import { v4 as uuidv4 } from 'uuid';

// Types to mimic Firebase
export type PaymentDetails = {
  method: string;
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  swiftCode: string;
  routingNumber?: string;
  bankAddress?: string;
};

export type User = {
  uid: string;
  email: string;
  displayName?: string;
  name?: string;
  role: 'admin' | 'client' | 'engineer';
  paymentDetails?: PaymentDetails;
  [key: string]: any;
};

class LocalDb {
  private listeners: { [collection: string]: (() => void)[] } = {};

  private notifyListeners(collection: string) {
    if (this.listeners[collection]) {
      this.listeners[collection].forEach(callback => callback());
    }
  }

  // Auth
  async signIn(email: string, pass: string): Promise<User> {
    const response = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    
    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      let errorMessage = 'auth/failed';
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      const err = new Error(errorMessage);
      (err as any).code = errorMessage === 'User not found' ? 'auth/user-not-found' : 'auth/wrong-password';
      throw err;
    }

    if (contentType && contentType.includes("application/json")) {
      const user = await response.json();
      const mappedUser = { ...user, uid: user.id };
      localStorage.setItem('desklink_user', JSON.stringify(mappedUser));
      this.notifyListeners('users');
      return mappedUser;
    } else {
      throw new Error("Invalid server response: expected JSON");
    }
  }

  async signUp(email: string, pass: string, role: string, uid?: string, name?: string): Promise<User> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, role, name, id: uid })
    });

    const contentType = response.headers.get("content-type");
    if (!response.ok) {
      let errorMessage = 'auth/failed';
      if (contentType && contentType.includes("application/json")) {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } else {
        errorMessage = await response.text();
      }
      const err = new Error(errorMessage);
      if (errorMessage === 'Email already in use') {
        (err as any).code = 'auth/email-already-in-use';
      } else {
        (err as any).code = 'auth/failed';
      }
      throw err;
    }

    if (contentType && contentType.includes("application/json")) {
      const user = await response.json();
      const mappedUser = { ...user, uid: user.id };
      localStorage.setItem('desklink_user', JSON.stringify(mappedUser));
      this.notifyListeners('users');
      return mappedUser;
    } else {
      throw new Error("Invalid server response: expected JSON");
    }
  }

  signOut() {
    localStorage.removeItem('desklink_user');
    this.notifyListeners('users');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('desklink_user');
    return user ? JSON.parse(user) : null;
  }

  // Firestore
  async addDoc(collectionName: string, data: any) {
    const response = await fetch(`/api/db/${collectionName}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to add document: ${errorText}`);
    }
    
    const result = await response.json();
    return { id: result.id };
  }

  async setDoc(collectionName: string, id: string, data: any, options?: { merge?: boolean }) {
    const response = await fetch(`/api/db/${collectionName}/${id}`, {
      method: options?.merge ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to set document: ${errorText}`);
    }
    
    return response.json();
  }

  async getDoc(collectionName: string, id: string) {
    const response = await fetch(`/api/db/${collectionName}/${id}`);
    if (!response.ok) {
      return {
        id,
        exists: () => false,
        data: () => null
      };
    }
    const item = await response.json();
    
    // Map snake_case to camelCase for frontend compatibility
    const mappedItem = { ...item };
    if (item.created_at) {
      mappedItem.createdAt = item.created_at;
      mappedItem.timestamp = item.created_at;
    }
    if (item.completed_at) mappedItem.completedAt = item.completed_at;
    if (item.client_id) mappedItem.clientId = item.client_id;
    if (item.engineer_id) mappedItem.engineerId = item.engineer_id;
    if (item.user_id) mappedItem.userId = item.user_id;
    if (item.sender_id) mappedItem.senderId = item.sender_id;
    if (item.receiver_id) mappedItem.receiverId = item.receiver_id;

    return {
      id,
      exists: () => !!item,
      data: () => mappedItem,
      get: (field: string) => mappedItem[field],
      metadata: { hasPendingWrites: false }
    };
  }

  async getDocs(collectionName: string, queryConstraints?: any[]) {
    let url = `/api/db/${collectionName}?`;
    
    if (queryConstraints) {
      queryConstraints.forEach(constraint => {
        if (constraint.type === 'where') {
          const [field, op, value] = constraint.args;
          url += `whereField=${field}&whereOp=${encodeURIComponent(op)}&whereValue=${encodeURIComponent(value)}&`;
        } else if (constraint.type === 'orderBy') {
          const [field, direction] = constraint.args;
          url += `orderByField=${field}&orderDirection=${direction}&`;
        } else if (constraint.type === 'limit') {
          const [n] = constraint.args;
          url += `limitCount=${n}&`;
        }
      });
    }

    const response = await fetch(url);
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`API Error fetching ${collectionName}:`, errorText);
      return {
        docs: [],
        docChanges: () => [],
        forEach: (callback: any) => {},
        empty: true,
        size: 0,
        exists: () => false
      };
    }
    
    const items = await response.json();
    
    if (!Array.isArray(items)) {
      console.error(`API Error: expected array for ${collectionName}, got:`, items);
      return {
        docs: [],
        docChanges: () => [],
        forEach: (callback: any) => {},
        empty: true,
        size: 0,
        exists: () => false
      };
    }
    
    const docs = items.map((item: any) => {
      // Map snake_case to camelCase for frontend compatibility
      const mappedItem = { ...item };
      if (item.created_at) {
        mappedItem.createdAt = item.created_at;
        mappedItem.timestamp = item.created_at;
      }
      if (item.completed_at) mappedItem.completedAt = item.completed_at;
      if (item.client_id) mappedItem.clientId = item.client_id;
      if (item.engineer_id) mappedItem.engineerId = item.engineer_id;
      if (item.user_id) mappedItem.userId = item.user_id;
      if (item.sender_id) mappedItem.senderId = item.sender_id;
      if (item.receiver_id) mappedItem.receiverId = item.receiver_id;
      
      return {
        id: item.id || item.uid,
        exists: () => true,
        data: () => mappedItem,
        get: (field: string) => mappedItem[field],
        metadata: { hasPendingWrites: false }
      };
    });

    return {
      docs,
      docChanges: () => [],
      forEach: (callback: any) => {
        docs.forEach((doc: any) => callback(doc));
      },
      empty: items.length === 0,
      size: items.length,
      exists: () => items.length > 0
    };
  }

  onSnapshot(collectionName: string, callback: (snapshot: any) => void, queryConstraints?: any[], id?: string) {
    const load = async () => {
      try {
        if (id) {
          const snapshot = await this.getDoc(collectionName, id);
          callback(snapshot);
        } else {
          const snapshot = await this.getDocs(collectionName, queryConstraints);
          callback(snapshot);
        }
      } catch (error) {
        console.error(`Error in onSnapshot for ${collectionName}:`, error);
      }
    };
    
    load();
    
    // In a real app, we'd use Socket.io to trigger this
    // For now, we'll keep the polling but also listen for Socket.io events if available
    const interval = setInterval(load, 10000); 
    
    // Listen for data:changed events from server
    const handleDataChanged = (changedCollection: string) => {
      if (changedCollection === collectionName) {
        load();
      }
    };

    // We assume socket is available globally or we can use a simple event emitter
    window.addEventListener('db-changed', ((e: CustomEvent) => handleDataChanged(e.detail)) as any);

    return () => {
      clearInterval(interval);
      window.removeEventListener('db-changed', ((e: CustomEvent) => handleDataChanged(e.detail)) as any);
    };
  }

  async updateDoc(collectionName: string, id: string, data: any) {
    await fetch(`/api/db/${collectionName}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  }

  async deleteDoc(collectionName: string, id: string) {
    await fetch(`/api/db/${collectionName}/${id}`, {
      method: 'DELETE'
    });
  }
}

export const localDb = new LocalDb();
