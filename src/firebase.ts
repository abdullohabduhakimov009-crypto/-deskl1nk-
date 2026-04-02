import { localDb } from "./services/localDb";

// Mock Firebase Auth
export const auth = {
  get currentUser() {
    return localDb.getCurrentUser();
  }
};

export const db = {}; // Dummy object

// Auth functions
export const onAuthStateChanged = (authInstance: any, callback: (user: any) => void) => {
  // Initial check
  const user = localDb.getCurrentUser();
  callback(user);
  
  // Listen for user changes
  const handleUserChanged = (e: any) => {
    if (e.detail === 'users') {
      const currentUser = localDb.getCurrentUser();
      callback(currentUser);
    }
  };

  window.addEventListener('db-changed', handleUserChanged as any);

  return () => {
    window.removeEventListener('db-changed', handleUserChanged as any);
  };
};

export const signOut = async (authInstance: any) => {
  return localDb.signOut();
};

export const signInWithEmailAndPassword = async (authInstance: any, email: string, pass: string) => {
  const user = await localDb.signIn(email, pass);
  return { user };
};

export const createUserWithEmailAndPassword = async (authInstance: any, email: string, pass: string, role: string = 'client', name?: string) => {
  const user = await localDb.signUp(email, pass, role, undefined, name);
  return { user };
};

// Firestore functions
export const serverTimestamp = () => new Date().toISOString();

export const doc = (dbInstance: any, ...pathSegments: string[]) => {
  if (typeof dbInstance === 'string') {
    // Case: doc("collection", "id")
    return { collection: dbInstance, id: pathSegments[0] };
  }
  if (dbInstance && typeof dbInstance === 'object' && dbInstance.collection) {
    // Case: doc(collection(db, "path"), "id")
    return { collection: dbInstance.collection, id: pathSegments[0] };
  }
  if (pathSegments.length === 0) {
    // Case: doc(collection(db, "path")) - generate random ID
    return { collection: dbInstance, id: Math.random().toString(36).substring(2) };
  }
  // Case: doc(db, "collection", "id")
  return { collection: pathSegments[0], id: pathSegments[1] };
};

export const collection = (dbInstance: any, ...pathSegments: string[]) => {
  return { collection: pathSegments.join('/') };
};

export const query = (q: any, ...constraints: any[]) => {
  const collectionName = typeof q === 'string' ? q : q.collection;
  return { collection: collectionName, constraints };
};

export const where = (field: string, op: string, value: any) => {
  return { type: 'where', args: [field, op, value] };
};

export const orderBy = (field: string, direction: string = 'asc') => {
  return { type: 'orderBy', args: [field, direction] };
};

export const limit = (n: number) => {
  return { type: 'limit', args: [n] };
};

export const onSnapshot = (q: any, callback: (snapshot: any) => void, errorCallback?: (err: any) => void) => {
  const collectionName = typeof q === 'string' ? q : q.collection;
  const constraints = q.constraints || [];
  const id = q.id;
  
  return localDb.onSnapshot(collectionName, callback, constraints, id);
};

export const addDoc = async (q: any, data: any) => {
  const collectionName = typeof q === 'string' ? q : q.collection;
  return localDb.addDoc(collectionName, data);
};

export const updateDoc = async (docRef: any, data: any) => {
  return localDb.updateDoc(docRef.collection, docRef.id, data);
};

export const deleteDoc = async (docRef: any) => {
  return localDb.deleteDoc(docRef.collection, docRef.id);
};

export const setDoc = async (docRef: any, data: any, options?: any) => {
  return localDb.setDoc(docRef.collection, docRef.id, data, options);
};

export const getDoc = async (docRef: any) => {
  return localDb.getDoc(docRef.collection, docRef.id);
};

export const getDocs = async (q: any) => {
  const collectionName = typeof q === 'string' ? q : q.collection;
  const constraints = q.constraints || [];
  return localDb.getDocs(collectionName, constraints);
};

export const writeBatch = (dbInstance?: any) => ({
  set: (docRef: any, data: any, options?: any) => localDb.setDoc(docRef.collection, docRef.id, data, options),
  update: (docRef: any, data: any) => localDb.updateDoc(docRef.collection, docRef.id, data),
  delete: (docRef: any) => localDb.deleteDoc(docRef.collection, docRef.id),
  commit: async () => {}
});

export const isFirebaseConfigured = false;

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Local DB Error: ', error, operationType, path);
}
