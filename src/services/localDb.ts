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
    
    if (!response.ok) {
      const error = await response.json();
      const err = new Error(error.error || 'auth/failed');
      (err as any).code = error.error === 'User not found' ? 'auth/user-not-found' : 'auth/wrong-password';
      throw err;
    }

    const user = await response.json();
    const mappedUser = { ...user, uid: user.id };
    localStorage.setItem('desklink_user', JSON.stringify(mappedUser));
    this.notifyListeners('users');
    return mappedUser;
  }

  async signUp(email: string, pass: string, role: string, uid?: string, name?: string): Promise<User> {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass, role, name })
    });

    if (!response.ok) {
      const error = await response.json();
      const err = new Error(error.error || 'auth/failed');
      (err as any).code = 'auth/email-already-in-use';
      throw err;
    }

    const user = await response.json();
    const mappedUser = { ...user, uid: user.id };
    localStorage.setItem('desklink_user', JSON.stringify(mappedUser));
    this.notifyListeners('users');
    return mappedUser;
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
    const result = await response.json();
    return { id: result.id };
  }

  async setDoc(collectionName: string, id: string, data: any, options?: { merge?: boolean }) {
    const response = await fetch(`/api/db/${collectionName}/${id}`, {
      method: options?.merge ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
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
    return {
      id,
      exists: () => !!item,
      data: () => item,
      get: (field: string) => item ? item[field] : undefined
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
    const items = await response.json();
    
    const docs = items.map((item: any) => ({
      id: item.id || item.uid,
      exists: () => true,
      data: () => item,
      get: (field: string) => item[field],
      metadata: { hasPendingWrites: false }
    }));

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
