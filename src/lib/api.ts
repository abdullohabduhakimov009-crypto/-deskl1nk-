// Direct API helpers for Neon database operations
// Replaces Firebase functionality completely

export type User = {
  id: string;
  email: string;
  name?: string;
  role: 'admin' | 'client' | 'engineer';
  [key: string]: any;
};

// Session Management
export const setSessionUser = (user: User | null) => {
  if (user) {
    localStorage.setItem('desklink_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('desklink_user');
  }
  window.dispatchEvent(new CustomEvent('auth-changed', { detail: user }));
};

export const getSessionUser = (): User | null => {
  const user = localStorage.getItem('desklink_user');
  return user ? JSON.parse(user) : null;
};

export const onAuthStateChanged = (callback: (user: User | null) => void) => {
  callback(getSessionUser());
  
  const handleAuthChanged = (e: any) => {
    callback(e.detail);
  };
  
  window.addEventListener('auth-changed', handleAuthChanged);
  return () => {
    window.removeEventListener('auth-changed', handleAuthChanged);
  };
};

export const clearSession = () => {
  setSessionUser(null);
};

// Auth API
export const signIn = async (email: string, password: string): Promise<User> => {
  const response = await fetch('/api/auth/signin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign in failed');
  }

  const user = await response.json();
  setSessionUser(user);
  return user;
};

export const signUp = async (email: string, password: string, role: string = 'client', name?: string): Promise<User> => {
  const response = await fetch('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, role, name })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Sign up failed');
  }

  const user = await response.json();
  setSessionUser(user);
  return user;
};

export const signOut = async (): Promise<void> => {
  clearSession();
};

export const adminSignIn = async (password: string): Promise<User> => {
  const response = await fetch('/api/auth/admin', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Admin authentication failed');
  }

  const user = await response.json();
  setSessionUser(user);
  return user;
};

// Database operations
export const getDocument = async (collection: string, id: string): Promise<any> => {
  const response = await fetch(`/api/db/${collection}/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch document');
  }

  return response.json();
};

export const getDocuments = async (collection: string, filters?: Record<string, any>): Promise<any[]> => {
  const query = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      query.append(key, JSON.stringify(value));
    });
  }

  const response = await fetch(`/api/db/${collection}?${query.toString()}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch documents');
  }

  return response.json();
};

export const createDocument = async (collection: string, data: any): Promise<any> => {
  const response = await fetch(`/api/db/${collection}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create document');
  }

  return response.json();
};

export const updateDocument = async (collection: string, id: string, data: any): Promise<any> => {
  const response = await fetch(`/api/db/${collection}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update document');
  }

  return response.json();
};

export const deleteDocument = async (collection: string, id: string): Promise<void> => {
  const response = await fetch(`/api/db/${collection}/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete document');
  }
};

// Real-time subscriptions via Socket.io
export const subscribeToCollection = (collection: string, callback: (data: any) => void): (() => void) => {
  // This will be handled via Socket.io in the app
  // For now, return a noop unsubscribe function
  return () => {};
};

// Helper to convert Firebase-style callbacks to our API
export const onSnapshot = async (collection: string, callback: (snapshot: any) => void) => {
  try {
    const docs = await getDocuments(collection);
    callback({
      docs: docs.map(doc => ({
        id: doc.id,
        data: () => doc,
        exists: () => true
      }))
    });
  } catch (error) {
    console.error('Failed to get documents:', error);
  }
};
