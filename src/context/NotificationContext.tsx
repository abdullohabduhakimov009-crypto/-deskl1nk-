import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { db, collection, query, where, onSnapshot, orderBy, limit, addDoc, serverTimestamp, deleteDoc, updateDoc, doc } from '../firebase';
import { AnimatePresence, motion } from 'framer-motion';
import { HiBell as Bell, HiChatBubbleLeftRight as MessageSquare, HiTicket as Ticket, HiXMark as X } from 'react-icons/hi2';

interface Notification {
  id: string;
  type: 'message' | 'ticket' | 'system' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: any;
  link?: string;
  read: boolean;
  userId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>, targetUserId?: string) => Promise<void>;
  removeNotification: (id: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  sendEmail: (to: string, subject: string, text: string, html?: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: React.ReactNode, currentUser: any }> = ({ children, currentUser }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [toasts, setToasts] = useState<any[]>([]);

  // Listen for persistent notifications from Firestore
  useEffect(() => {
    if (!currentUser?.uid) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", currentUser.uid),
      orderBy("createdAt", "desc"),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().createdAt?.toDate?.() || new Date()
      })) as Notification[];
      setNotifications(notifs);

      // Show toast for new unread notifications (only if added after initial load)
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added" && !change.doc.metadata.hasPendingWrites) {
          const data = change.doc.data();
          if (!data.read) {
            showToast({
              id: change.doc.id,
              type: data.type,
              title: data.title,
              message: data.message
            });
          }
        }
      });
    }, (error) => {
      console.error("Notification listener error:", error);
    });

    return () => unsubscribe();
  }, [currentUser?.uid]);

  const showToast = useCallback((toast: any) => {
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 5000);
  }, []);

  const addNotification = useCallback(async (notif: Omit<Notification, 'id' | 'timestamp' | 'read' | 'userId'>, targetUserId?: string) => {
    const userId = targetUserId || currentUser?.uid;
    if (!userId) return;

    try {
      await addDoc(collection(db, "notifications"), {
        ...notif,
        userId,
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.error("Error adding notification:", error);
    }
  }, [currentUser?.uid]);

  const removeNotification = useCallback(async (id: string) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (error) {
      console.error("Error removing notification:", error);
    }
  }, []);

  const markAsRead = useCallback(async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), {
        read: true
      });
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    if (!currentUser?.uid) return;
    const unreadNotifs = notifications.filter(n => !n.read);
    try {
      await Promise.all(unreadNotifs.map(n => 
        updateDoc(doc(db, "notifications", n.id), { read: true })
      ));
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [currentUser?.uid, notifications]);

  const sendEmail = useCallback(async (to: string, subject: string, text: string, html?: string) => {
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to, subject, text, html })
      });
    } catch (error) {
      console.error("Error calling send-email API:", error);
    }
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleGlobalNotify = (event: any) => {
      if (event.detail) {
        // Global notify usually for transient toasts, but we can make them persistent if needed
        // For now, just show toast
        showToast({
          id: Math.random().toString(36).substring(7),
          ...event.detail
        });
      }
    };
    window.addEventListener('desklink-notify', handleGlobalNotify);
    return () => window.removeEventListener('desklink-notify', handleGlobalNotify);
  }, [showToast]);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      removeNotification, 
      markAsRead, 
      markAllAsRead,
      sendEmail
    }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.9 }}
              className="pointer-events-auto w-80 bg-brand-card rounded-2xl shadow-2xl border border-white/10 p-4 flex gap-4 items-start relative overflow-hidden group backdrop-blur-md"
            >
              <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                toast.type === 'error' ? 'bg-red-500' : 
                toast.type === 'success' ? 'bg-emerald-500' : 
                'bg-brand-teal'
              }`} />
              
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                toast.type === 'message' ? 'bg-blue-500/10 text-blue-400' : 
                toast.type === 'ticket' ? 'bg-emerald-500/10 text-emerald-400' : 
                toast.type === 'error' ? 'bg-red-500/10 text-red-400' :
                toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-400' :
                'bg-white/5 text-white/40'
              }`}>
                {toast.type === 'message' ? <MessageSquare className="w-5 h-5" /> : 
                 toast.type === 'ticket' ? <Ticket className="w-5 h-5" /> : 
                 toast.type === 'error' ? <X className="w-5 h-5" /> :
                 toast.type === 'success' ? <Ticket className="w-5 h-5" /> :
                 <Bell className="w-5 h-5" />}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{toast.title}</h4>
                <p className="text-xs text-white/60 line-clamp-2 mt-0.5">{toast.message}</p>
              </div>

              <button 
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="p-1 hover:bg-white/5 rounded-lg text-white/20 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </NotificationContext.Provider>
  );
};
