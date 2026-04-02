import React, { useState, useEffect } from 'react';
import { db, collection, query, orderBy, limit, onSnapshot, where, handleFirestoreError, OperationType } from '../firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { HiClock as Clock, HiTicket as Ticket, HiUserPlus as UserPlus, HiChatBubbleLeftRight as MessageSquare } from 'react-icons/hi2';

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  userName: string;
  timestamp: any;
}

interface ActivityFeedProps {
  userId?: string;
  role?: string;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({ userId, role }) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const path = "activities";
    let q;
    if (role === 'admin') {
      q = query(collection(db, path), orderBy("timestamp", "desc"), limit(10));
    } else {
      q = query(collection(db, path), where("userId", "==", userId), orderBy("timestamp", "desc"), limit(10));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const activityList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Activity[];
      setActivities(activityList);
      setIsLoading(false);
      setError(null);
    }, (err) => {
      console.error("ActivityFeed listener error:", err);
      setIsLoading(false);
      setError("Failed to load activities");
      try {
        handleFirestoreError(err, OperationType.LIST, path);
      } catch (e) {
        // Error is already logged by handleFirestoreError
      }
    });

    return () => unsubscribe();
  }, [userId, role]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'ticket_created':
      case 'ticket_status_update':
        return <Ticket className="w-4 h-4 text-emerald-500" />;
      case 'user_added':
        return <UserPlus className="w-4 h-4 text-blue-500" />;
      case 'message_sent':
        return <MessageSquare className="w-4 h-4 text-brand-teal" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-slate-50 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold border border-rose-100">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {activities.length > 0 ? (
          activities.map((activity, i) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-brand-teal/10 transition-colors">
                {getIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{activity.title}</h4>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{formatTime(activity.timestamp)}</span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1">{activity.description}</p>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            No recent activity to show.
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActivityFeed;
