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
  private getData(collection: string): any[] {
    const data = localStorage.getItem(`desklink_${collection}`);
    return data ? JSON.parse(data) : [];
  }

  private listeners: { [collection: string]: (() => void)[] } = {};

  private notifyListeners(collection: string) {
    if (this.listeners[collection]) {
      setTimeout(() => {
        if (this.listeners[collection]) {
          this.listeners[collection].forEach(callback => callback());
        }
      }, 0);
    }
  }

  private setData(collection: string, data: any[]) {
    try {
      localStorage.setItem(`desklink_${collection}`, JSON.stringify(data));
      this.notifyListeners(collection);
    } catch (e: any) {
      if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
        if (collection === 'messages' || collection === 'notifications') {
          const prunedData = data.slice(Math.floor(data.length / 2));
          try {
            localStorage.setItem(`desklink_${collection}`, JSON.stringify(prunedData));
            this.notifyListeners(collection);
            return;
          } catch (retryError) {
            console.error(`Failed to prune ${collection}:`, retryError);
          }
        }
      }
      throw e;
    }
  }

  // Auth Mocks
  async signIn(email: string, pass: string): Promise<User> {
    const users = this.getData('users');
    const user = users.find(u => u.email === email);
    if (!user) {
      const err = new Error('auth/user-not-found');
      (err as any).code = 'auth/user-not-found';
      throw err;
    }
    if (user.password && user.password !== pass) {
      const err = new Error('auth/wrong-password');
      (err as any).code = 'auth/wrong-password';
      throw err;
    }
    localStorage.setItem('desklink_user', JSON.stringify(user));
    this.notifyListeners('users');
    return user;
  }

  async signUp(email: string, pass: string, role: string, uid?: string, name?: string): Promise<User> {
    const users = this.getData('users');
    if (users.find(u => u.email === email)) {
      const err = new Error('auth/email-already-in-use');
      (err as any).code = 'auth/email-already-in-use';
      throw err;
    }
    
    const newUser: User = {
      uid: uid || uuidv4(),
      email,
      name,
      role: role as any,
      password: pass, // Store password for mock sign-in
      createdAt: new Date().toISOString(),
    };
    
    users.push(newUser);
    this.setData('users', users);
    localStorage.setItem('desklink_user', JSON.stringify(newUser));
    return newUser;
  }

  signOut() {
    localStorage.removeItem('desklink_user');
    this.notifyListeners('users');
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('desklink_user');
    return user ? JSON.parse(user) : null;
  }

  // Firestore Mocks
  async addDoc(collectionName: string, data: any) {
    const items = this.getData(collectionName);
    const newDoc = {
      ...data,
      id: uuidv4(),
      createdAt: data.createdAt || new Date().toISOString(),
    };
    items.push(newDoc);
    
    // Proactively limit log-like collections to prevent QuotaExceededError
    if (['messages', 'notifications'].includes(collectionName) && items.length > 200) {
      items.splice(0, items.length - 200); // Keep only the last 200 items
    }
    
    this.setData(collectionName, items);
    return { id: newDoc.id };
  }

  async setDoc(collectionName: string, id: string, data: any, options?: { merge?: boolean }) {
    const items = this.getData(collectionName);
    const index = items.findIndex(item => item.uid === id || item.id === id);
    
    if (index > -1) {
      if (options?.merge) {
        items[index] = { ...items[index], ...data };
      } else {
        items[index] = { ...data, id };
      }
    } else {
      items.push({ ...data, id: id || uuidv4() });
    }
    
    // Proactively limit log-like collections to prevent QuotaExceededError
    if (['messages', 'notifications'].includes(collectionName) && items.length > 200) {
      items.splice(0, items.length - 200); // Keep only the last 200 items
    }
    
    this.setData(collectionName, items);
  }

  async getDoc(collectionName: string, id: string) {
    const items = this.getData(collectionName);
    const item = items.find(i => i.uid === id || i.id === id);
    return {
      id: id,
      exists: () => !!item,
      data: () => item,
      get: (field: string) => item ? item[field] : undefined
    };
  }

  async getDocs(collectionName: string, queryConstraints?: any[]) {
    let items = this.getData(collectionName);
    
    if (queryConstraints) {
      queryConstraints.forEach(constraint => {
        if (constraint.type === 'where') {
          const [field, op, value] = constraint.args;
          if (op === '==') {
            items = items.filter(item => item[field] === value);
          } else if (op === '!=') {
            items = items.filter(item => item[field] !== value);
          } else if (op === '>') {
            items = items.filter(item => item[field] > value);
          } else if (op === '<') {
            items = items.filter(item => item[field] < value);
          } else if (op === '>=') {
            items = items.filter(item => item[field] >= value);
          } else if (op === '<=') {
            items = items.filter(item => item[field] <= value);
          } else if (op === 'array-contains') {
            items = items.filter(item => Array.isArray(item[field]) && item[field].includes(value));
          } else if (op === 'in') {
            items = items.filter(item => Array.isArray(value) && value.includes(item[field]));
          }
        }
      });

      const orderByConstraint = queryConstraints.find(c => c.type === 'orderBy');
      if (orderByConstraint) {
        const [field, direction] = orderByConstraint.args;
        items.sort((a, b) => {
          if (a[field] < b[field]) return direction === 'asc' ? -1 : 1;
          if (a[field] > b[field]) return direction === 'asc' ? 1 : -1;
          return 0;
        });
      }

      const limitConstraint = queryConstraints.find(c => c.type === 'limit');
      if (limitConstraint) {
        const [n] = limitConstraint.args;
        items = items.slice(0, n);
      }
    }
    
    const docs = items.map(item => ({
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
        docs.forEach(doc => callback(doc));
      },
      empty: items.length === 0,
      size: items.length,
      exists: () => items.length > 0
    };
  }

  onSnapshot(collectionName: string, callback: (snapshot: any) => void, queryConstraints?: any[], id?: string) {
    let previousIds = new Set<string>();
    let firstLoad = true;

    const load = async () => {
      if (id) {
        const snapshot = await this.getDoc(collectionName, id);
        callback(snapshot);
        return;
      }

      const snapshot = await this.getDocs(collectionName, queryConstraints);
      const currentIds = new Set(snapshot.docs.map(d => d.id));
      
      const changes: any[] = [];
      if (!firstLoad) {
        snapshot.docs.forEach(doc => {
          if (!previousIds.has(doc.id)) {
            changes.push({ type: 'added', doc });
          }
        });
      }
      
      (snapshot as any).docChanges = () => changes;
      
      previousIds = currentIds;
      firstLoad = false;
      
      callback(snapshot);
    };
    
    load();
    
    if (!this.listeners[collectionName]) {
      this.listeners[collectionName] = [];
    }
    this.listeners[collectionName].push(load);

    const interval = setInterval(load, 5000); 
    
    return () => {
      clearInterval(interval);
      if (this.listeners[collectionName]) {
        this.listeners[collectionName] = this.listeners[collectionName].filter(l => l !== load);
      }
    };
  }

  async updateDoc(collectionName: string, id: string, data: any) {
    await this.setDoc(collectionName, id, data, { merge: true });
  }

  async deleteDoc(collectionName: string, id: string) {
    let items = this.getData(collectionName);
    items = items.filter(i => i.id !== id && i.uid !== id);
    this.setData(collectionName, items);
  }
}

export const localDb = new LocalDb();
