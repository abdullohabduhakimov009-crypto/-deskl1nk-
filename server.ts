import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { Server } from "socket.io";
import { createServer } from "http";
import { neon } from '@neondatabase/serverless';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Neon DB connection
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database initialization
if (sql) {
  const initDb = async () => {
    try {
      // Users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          name TEXT,
          role TEXT NOT NULL DEFAULT 'client',
          payment_details JSONB,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
      
      // Jobs table
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          client_id UUID REFERENCES users(id),
          engineer_id UUID REFERENCES users(id),
          status TEXT DEFAULT 'open',
          budget DECIMAL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Messages table
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sender_id UUID REFERENCES users(id),
          receiver_id UUID REFERENCES users(id),
          content TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Notifications table
      await sql`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          type TEXT NOT NULL,
          message TEXT NOT NULL,
          read BOOLEAN DEFAULT FALSE,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Tickets table
      await sql`
        CREATE TABLE IF NOT EXISTS tickets (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          subject TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'open',
          priority TEXT DEFAULT 'medium',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Quotations table
      await sql`
        CREATE TABLE IF NOT EXISTS quotations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID REFERENCES jobs(id),
          engineer_id UUID REFERENCES users(id),
          amount DECIMAL NOT NULL,
          status TEXT DEFAULT 'pending',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Invoices table
      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id),
          amount DECIMAL NOT NULL,
          status TEXT DEFAULT 'unpaid',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Generic documents table for everything else
      await sql`
        CREATE TABLE IF NOT EXISTS documents (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          collection TEXT NOT NULL,
          data JSONB NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      console.log("Database initialized successfully with all tables");
    } catch (error) {
      console.error("Failed to initialize database:", error);
    }
  };
  initDb();
}

// Health check with DB status
app.get("/api/health", async (req, res) => {
  let dbStatus = "not connected";
  if (sql) {
    try {
      await sql`SELECT 1`;
      dbStatus = "connected";
    } catch (error) {
      dbStatus = `error: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
  res.json({ 
    status: "ok", 
    database: dbStatus,
    timestamp: new Date().toISOString()
  });
});

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { email, password, name, role } = req.body;
  try {
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) return res.status(400).json({ error: "Email already in use" });

    const [user] = await sql`
      INSERT INTO users (email, password, name, role)
      VALUES (${email}, ${password}, ${name}, ${role || 'client'})
      RETURNING id, email, name, role, created_at
    `;
    res.status(201).json(user);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user" });
  }
});

app.post("/api/auth/signin", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { email, password } = req.body;
  try {
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;
    if (!user) return res.status(404).json({ error: "User not found" });
    if (user.password !== password) return res.status(401).json({ error: "Wrong password" });

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error("Signin error:", error);
    res.status(500).json({ error: "Failed to sign in" });
  }
});

// Generic DB routes
app.get("/api/db/:collection", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection } = req.params;
  const { whereField, whereOp, whereValue, orderByField, orderDirection, limitCount } = req.query;

  try {
    // Check if it's a specific table or generic documents
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices'];
    let data;

    if (tables.includes(collection)) {
      // Basic implementation for specific tables
      let data;

      if (whereField && whereOp && whereValue) {
        const op = whereOp === '==' ? '=' : whereOp;
        const query = `SELECT * FROM ${collection} WHERE ${whereField} ${op} $1 ${orderByField ? `ORDER BY ${orderByField} ${orderDirection === 'desc' ? 'DESC' : 'ASC'}` : 'ORDER BY created_at DESC'} ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        data = await (sql as any).unsafe(query, [whereValue]);
      } else {
        const query = `SELECT * FROM ${collection} ${orderByField ? `ORDER BY ${orderByField} ${orderDirection === 'desc' ? 'DESC' : 'ASC'}` : 'ORDER BY created_at DESC'} ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        data = await (sql as any).unsafe(query);
      }
      res.json(data);
    } else {
      // Generic documents table
      let docs;
      if (whereField && whereOp && whereValue) {
        const query = `SELECT id, data, created_at FROM documents WHERE collection = $1 AND data->>$2 = $3 ORDER BY created_at DESC ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        docs = await (sql as any).unsafe(query, [collection, whereField, whereValue]);
      } else {
        const query = `SELECT id, data, created_at FROM documents WHERE collection = $1 ORDER BY created_at DESC ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        docs = await (sql as any).unsafe(query, [collection]);
      }
      const data = docs.map((d: any) => ({ ...d.data, id: d.id, createdAt: d.created_at }));
      res.json(data);
    }
  } catch (error) {
    console.error(`Error fetching ${collection}:`, error);
    res.status(500).json({ error: `Failed to fetch ${collection}` });
  }
});

app.get("/api/db/:collection/:id", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection, id } = req.params;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices'];
    let data;
    if (tables.includes(collection)) {
      const result = await (sql as any).unsafe(`SELECT * FROM ${collection} WHERE id = $1`, [id]);
      data = result[0];
    } else {
      const result = await sql`SELECT data FROM documents WHERE id = ${id} AND collection = ${collection}`;
      data = result[0] ? { ...result[0].data, id } : null;
    }
    if (!data) return res.status(404).json({ error: "Not found" });
    res.json(data);
  } catch (error) {
    console.error(`Error fetching ${collection}/${id}:`, error);
    res.status(500).json({ error: "Failed to fetch document" });
  }
});

app.post("/api/db/:collection", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection } = req.params;
  const body = req.body;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices'];
    let resultData;
    if (tables.includes(collection)) {
      const keys = Object.keys(body);
      const values = Object.values(body);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${collection} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await (sql as any).unsafe(query, values);
      resultData = result[0];
    } else {
      const result = await sql`
        INSERT INTO documents (collection, data)
        VALUES (${collection}, ${body})
        RETURNING id, data, created_at
      `;
      resultData = { ...result[0].data, id: result[0].id, createdAt: result[0].created_at };
    }
    io.emit("data:changed", collection);
    res.status(201).json(resultData);
  } catch (error) {
    console.error(`Error creating in ${collection}:`, error);
    res.status(500).json({ error: "Failed to create document" });
  }
});

app.put("/api/db/:collection/:id", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection, id } = req.params;
  const body = req.body;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices'];
    if (tables.includes(collection)) {
      const keys = Object.keys(body);
      const values = Object.values(body);
      const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
      const query = `UPDATE ${collection} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
      await (sql as any).unsafe(query, [...values, id]);
    } else {
      await sql`
        UPDATE documents 
        SET data = data || ${body}::jsonb
        WHERE id = ${id} AND collection = ${collection}
      `;
    }
    io.emit("data:changed", collection);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error updating ${collection}/${id}:`, error);
    res.status(500).json({ error: "Failed to update document" });
  }
});

app.delete("/api/db/:collection/:id", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection, id } = req.params;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices'];
    if (tables.includes(collection)) {
      await (sql as any).unsafe(`DELETE FROM ${collection} WHERE id = $1`, [id]);
    } else {
      await sql`DELETE FROM documents WHERE id = ${id} AND collection = ${collection}`;
    }
    io.emit("data:changed", collection);
    res.json({ success: true });
  } catch (error) {
    console.error(`Error deleting ${collection}/${id}:`, error);
    res.status(500).json({ error: "Failed to delete document" });
  }
});

// Request logging middleware
app.use((req, res, next) => {
  if (req.url.startsWith('/api')) {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  }
  next();
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

app.post("/api/send-email", async (req, res) => {
  const { to, subject, text, html } = req.body;

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.warn("Email credentials not configured. Skipping email send.");
    return res.status(200).json({ success: true, message: "Email skipped (not configured)" });
  }

  try {
    await transporter.sendMail({
      from: `"Desknet Notifications" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    res.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Failed to send email" });
  }
});

// Socket.io for basic real-time signaling
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });

  // Basic signaling for presence and typing (without DB persistence)
  socket.on("presence:update", (data) => {
    socket.broadcast.emit("presence:updated", { [data.uid]: { ...data, lastSeen: new Date().toISOString() } });
  });

  socket.on("typing:update", (data) => {
    socket.broadcast.emit("typing:updated", { [data.id]: data });
  });
  
  socket.on("data:changed", (collection) => {
    socket.broadcast.emit("data:refetch", collection);
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  const startDevServer = async () => {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    
    const PORT = 3000;
    httpServer.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  };
  startDevServer();
} else {
  // Local production test
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "dist/index.html"));
  });
  
  const PORT = 3000;
  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export default app;
