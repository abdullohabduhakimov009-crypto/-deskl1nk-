import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import nodemailer from "nodemailer";
import { Server } from "socket.io";
import { createServer } from "http";
import { neon } from '@neondatabase/serverless';
import { randomUUID } from "crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Neon DB connection
const sql = process.env.DATABASE_URL ? neon(process.env.DATABASE_URL) : null;
console.log("DATABASE_URL present:", !!process.env.DATABASE_URL);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Database initialization
if (sql) {
  const initDb = async () => {
    try {
      // Users table
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          name TEXT,
          first_name TEXT,
          last_name TEXT,
          company_name TEXT,
          role TEXT NOT NULL DEFAULT 'client',
          status TEXT DEFAULT 'Active',
          country TEXT,
          city TEXT,
          specialization TEXT,
          experience TEXT,
          hourly_rate TEXT,
          payment_details JSONB,
          metadata JSONB DEFAULT '{}',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          last_login TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Migration for users table to ensure all columns exist
      const columns = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'users' AND table_schema = 'public'`;
      const columnNames = columns.map((c: any) => c.column_name);
      console.log("Current users table columns:", columnNames);
      
      // Check if id is UUID and change to TEXT if needed
      const idCol = columns.find((c: any) => c.column_name === 'id');
      if (idCol && idCol.data_type === 'uuid') {
        console.log("Changing users.id from UUID to TEXT");
        await sql`ALTER TABLE users ALTER COLUMN id TYPE TEXT`;
      }
      
      const missingColumns = [
        { name: 'password', type: 'TEXT' },
        { name: 'name', type: 'TEXT' },
        { name: 'role', type: 'TEXT NOT NULL DEFAULT \'client\'' },
        { name: 'first_name', type: 'TEXT' },
        { name: 'last_name', type: 'TEXT' },
        { name: 'company_name', type: 'TEXT' },
        { name: 'status', type: 'TEXT DEFAULT \'Active\'' },
        { name: 'country', type: 'TEXT' },
        { name: 'city', type: 'TEXT' },
        { name: 'specialization', type: 'TEXT' },
        { name: 'experience', type: 'TEXT' },
        { name: 'hourly_rate', type: 'TEXT' },
        { name: 'payment_details', type: 'JSONB' },
        { name: 'metadata', type: 'JSONB DEFAULT \'{}\'' },
        { name: 'last_login', type: 'TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP' },
        { name: 'parent_client_email', type: 'TEXT' }
      ];

      for (const col of missingColumns) {
        if (!columnNames.includes(col.name)) {
          console.log(`Adding missing column ${col.name} to users table`);
          try {
            // Using a direct string query for DDL
            await (sql as any).query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
          } catch (err) {
            console.error(`Failed to add column ${col.name}:`, err);
          }
        }
      }
      
      // Jobs table
      await sql`
        CREATE TABLE IF NOT EXISTS jobs (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          client_id TEXT REFERENCES users(id),
          engineer_id TEXT REFERENCES users(id),
          status TEXT DEFAULT 'open',
          budget DECIMAL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP WITH TIME ZONE
        )
      `;

      // Migration for jobs table
      const jobCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'jobs' AND table_schema = 'public'`;
      const jobColNames = jobCols.map((c: any) => c.column_name);
      if (!jobColNames.includes('completed_at')) {
        await (sql as any).query(`ALTER TABLE jobs ADD COLUMN completed_at TIMESTAMP WITH TIME ZONE`);
      }

      // Messages table
      await sql`
        CREATE TABLE IF NOT EXISTS messages (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          sender_id TEXT REFERENCES users(id),
          receiver_id TEXT REFERENCES users(id),
          content TEXT NOT NULL,
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Notifications table
      await sql`
        CREATE TABLE IF NOT EXISTS notifications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT REFERENCES users(id),
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
          user_id TEXT REFERENCES users(id),
          author_uid TEXT,
          subject TEXT NOT NULL,
          description TEXT,
          status TEXT DEFAULT 'open',
          priority TEXT DEFAULT 'medium',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Migration for tickets table
      const ticketCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'tickets' AND table_schema = 'public'`;
      const ticketColNames = ticketCols.map((c: any) => c.column_name);
      if (!ticketColNames.includes('author_uid')) {
        await (sql as any).query(`ALTER TABLE tickets ADD COLUMN author_uid TEXT`);
      }

      // Quotations table
      await sql`
        CREATE TABLE IF NOT EXISTS quotations (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID REFERENCES jobs(id),
          engineer_id TEXT REFERENCES users(id),
          client_uid TEXT,
          amount DECIMAL NOT NULL,
          status TEXT DEFAULT 'pending',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Migration for quotations table
      const quoteCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'quotations' AND table_schema = 'public'`;
      const quoteColNames = quoteCols.map((c: any) => c.column_name);
      if (!quoteColNames.includes('client_uid')) {
        await (sql as any).query(`ALTER TABLE quotations ADD COLUMN client_uid TEXT`);
      }

      // Invoices table
      await sql`
        CREATE TABLE IF NOT EXISTS invoices (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id TEXT REFERENCES users(id),
          client_email TEXT,
          amount DECIMAL NOT NULL,
          status TEXT DEFAULT 'unpaid',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Migration for invoices table
      const invoiceCols = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = 'invoices' AND table_schema = 'public'`;
      const invoiceColNames = invoiceCols.map((c: any) => c.column_name);
      if (!invoiceColNames.includes('client_email')) {
        await (sql as any).query(`ALTER TABLE invoices ADD COLUMN client_email TEXT`);
      }

      // Job Postings table
      await sql`
        CREATE TABLE IF NOT EXISTS job_postings (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          company TEXT,
          location TEXT,
          salary TEXT,
          type TEXT,
          status TEXT DEFAULT 'active',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Opportunities table
      await sql`
        CREATE TABLE IF NOT EXISTS opportunities (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          title TEXT NOT NULL,
          description TEXT,
          client_id TEXT REFERENCES users(id),
          status TEXT DEFAULT 'open',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Applications table
      await sql`
        CREATE TABLE IF NOT EXISTS applications (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          job_id UUID,
          engineer_id TEXT REFERENCES users(id),
          status TEXT DEFAULT 'pending',
          metadata JSONB,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;

      // Migration for other tables to ensure user ID references are TEXT
      const tablesToMigrate = [
        { table: 'jobs', columns: ['client_id', 'engineer_id'] },
        { table: 'messages', columns: ['sender_id', 'receiver_id'] },
        { table: 'notifications', columns: ['user_id'] },
        { table: 'tickets', columns: ['user_id'] },
        { table: 'quotations', columns: ['engineer_id'] },
        { table: 'invoices', columns: ['user_id'] },
        { table: 'opportunities', columns: ['client_id'] },
        { table: 'applications', columns: ['engineer_id'] }
      ];

      for (const t of tablesToMigrate) {
        try {
          const cols = await sql`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = ${t.table}`;
          for (const colName of t.columns) {
            const col = cols.find((c: any) => c.column_name === colName);
            if (col && col.data_type === 'uuid') {
              console.log(`Changing ${t.table}.${colName} from UUID to TEXT`);
              await (sql as any).query(`ALTER TABLE ${t.table} ALTER COLUMN ${colName} TYPE TEXT`);
            }
          }
        } catch (err) {
          console.error(`Error migrating table ${t.table}:`, err);
        }
      }

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

// Helper to map keys and filter for table columns
async function prepareTableData(collection: string, body: any, sql: any) {
  const columns = await sql`SELECT column_name FROM information_schema.columns WHERE table_name = ${collection} AND table_schema = 'public'`;
  const columnNames = columns.map((c: any) => c.column_name);
  
  const tableData: any = {};
  const metadata: any = body.metadata || {};
  
  Object.keys(body).forEach(key => {
    if (key === 'metadata') return;
    
    // Map camelCase to snake_case
    let snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Handle common lowercase versions
    if (snakeKey === 'createdat' || snakeKey === 'timestamp') snakeKey = 'created_at';
    if (snakeKey === 'completedat') snakeKey = 'completed_at';
    if (snakeKey === 'appliedat') snakeKey = 'applied_at';
    if (snakeKey === 'clientid') snakeKey = 'client_id';
    if (snakeKey === 'engineerid') snakeKey = 'engineer_id';
    if (snakeKey === 'userid') snakeKey = 'user_id';
    if (snakeKey === 'senderid') snakeKey = 'sender_id';
    if (snakeKey === 'receiverid') snakeKey = 'receiver_id';
    
    if (columnNames.includes(snakeKey)) {
      tableData[snakeKey] = body[key];
    } else if (columnNames.includes(key)) {
      tableData[key] = body[key];
    } else {
      // Put extra fields into metadata
      metadata[key] = body[key];
    }
  });
  
  if (columnNames.includes('metadata')) {
    tableData.metadata = metadata;
  }
  
  return tableData;
}

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  console.log("Signup request received:", req.body.email);
  if (!sql) {
    console.error("Signup failed: Database not connected");
    return res.status(500).json({ error: "Database not connected" });
  }
  const { email, password, name, role, id } = req.body;
  const userId = id || randomUUID();
  try {
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;
    if (existing) {
      console.warn("Signup failed: Email already in use", email);
      return res.status(400).json({ error: "Email already in use" });
    }

    const [user] = await sql`
      INSERT INTO users (id, email, password, name, role)
      VALUES (${userId}, ${email}, ${password}, ${name}, ${role || 'client'})
      RETURNING id, email, name, role, created_at
    `;
    console.log("User created successfully:", user.id);
    res.status(201).json(user);
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Failed to create user", details: error instanceof Error ? error.message : String(error) });
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
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices', 'job_postings', 'opportunities', 'applications'];
    let data;

    if (tables.includes(collection)) {
      // Basic implementation for specific tables
      
      // Map camelCase to snake_case for query fields
      const mapKey = (key: string) => {
        if (!key || typeof key !== 'string') return key;
        if (key === 'timestamp' || key === 'createdat') return 'created_at';
        if (key === 'completedat') return 'completed_at';
        if (key === 'appliedat') return 'applied_at';
        if (key === 'clientid') return 'client_id';
        if (key === 'engineerid') return 'engineer_id';
        if (key === 'userid') return 'user_id';
        if (key === 'senderid') return 'sender_id';
        if (key === 'receiverid') return 'receiver_id';
        return key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      };
      
      const mappedWhereField = (whereField && typeof whereField === 'string') ? mapKey(whereField) : null;
      const mappedOrderByField = (orderByField && typeof orderByField === 'string') ? mapKey(orderByField) : null;

      if (mappedWhereField && whereOp && whereValue) {
        const op = whereOp === '==' ? '=' : whereOp;
        const query = `SELECT * FROM ${collection} WHERE ${mappedWhereField} ${op} $1 ${mappedOrderByField ? `ORDER BY ${mappedOrderByField} ${orderDirection === 'desc' ? 'DESC' : 'ASC'}` : 'ORDER BY created_at DESC'} ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        data = await (sql as any).query(query, [whereValue]);
      } else {
        const query = `SELECT * FROM ${collection} ${mappedOrderByField ? `ORDER BY ${mappedOrderByField} ${orderDirection === 'desc' ? 'DESC' : 'ASC'}` : 'ORDER BY created_at DESC'} ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        data = await (sql as any).query(query);
      }
      res.json(data);
    } else {
      // Generic documents table
      let docs;
      if (whereField && whereOp && whereValue) {
        const query = `SELECT id, data, created_at FROM documents WHERE collection = $1 AND data->>$2 = $3 ORDER BY created_at DESC ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        docs = await (sql as any).query(query, [collection, whereField, whereValue]);
      } else {
        const query = `SELECT id, data, created_at FROM documents WHERE collection = $1 ORDER BY created_at DESC ${limitCount ? `LIMIT ${limitCount}` : ''}`;
        docs = await (sql as any).query(query, [collection]);
      }
      const docsData = docs.map((d: any) => ({ ...d.data, id: d.id, createdAt: d.created_at }));
      res.json(docsData);
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
      const result = await (sql as any).query(`SELECT * FROM ${collection} WHERE id = $1`, [id]);
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
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices', 'job_postings', 'opportunities', 'applications'];
    let resultData;
    if (tables.includes(collection)) {
      const tableData = await prepareTableData(collection, body, sql);
      const keys = Object.keys(tableData);
      const values = Object.values(tableData);
      const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
      const query = `INSERT INTO ${collection} (${keys.join(', ')}) VALUES (${placeholders}) RETURNING *`;
      const result = await (sql as any).query(query, values);
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

app.post("/api/db/:collection/:id", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection, id } = req.params;
  const body = req.body;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices', 'job_postings', 'opportunities', 'applications'];
    if (tables.includes(collection)) {
      // Upsert for specific tables
      const tableData = await prepareTableData(collection, body, sql);
      const keys = Object.keys(tableData);
      const values = Object.values(tableData);
      
      // Check if exists
      const [existing] = await (sql as any).query(`SELECT id FROM ${collection} WHERE id = $1`, [id]);
      
      if (existing) {
        // Update
        const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
        await (sql as any).query(`UPDATE ${collection} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id]);
      } else {
        // Insert with specified ID
        const placeholders = keys.map((_, i) => `$${i + 1}`).join(', ');
        await (sql as any).query(`INSERT INTO ${collection} (id, ${keys.join(', ')}) VALUES ($${keys.length + 1}, ${placeholders})`, [...values, id]);
      }
    } else {
      // Generic documents table upsert
      await sql`
        INSERT INTO documents (id, collection, data)
        VALUES (${id}, ${collection}, ${body})
        ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data, collection = EXCLUDED.collection
      `;
    }
    io.emit("data:changed", collection);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(`Error upserting ${collection}/${id}:`, error);
    res.status(500).json({ error: "Failed to upsert document" });
  }
});

app.put("/api/db/:collection/:id", async (req, res) => {
  if (!sql) return res.status(500).json({ error: "Database not connected" });
  const { collection, id } = req.params;
  const body = req.body;
  try {
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices', 'job_postings', 'opportunities', 'applications'];
    if (tables.includes(collection)) {
      const tableData = await prepareTableData(collection, body, sql);
      const keys = Object.keys(tableData);
      const values = Object.values(tableData);
      const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(', ');
      const query = `UPDATE ${collection} SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
      await (sql as any).query(query, [...values, id]);
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
    const tables = ['users', 'jobs', 'messages', 'notifications', 'tickets', 'quotations', 'invoices', 'job_postings', 'opportunities', 'applications'];
    if (tables.includes(collection)) {
      await (sql as any).query(`DELETE FROM ${collection} WHERE id = $1`, [id]);
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

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ 
    error: "Internal server error", 
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
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
