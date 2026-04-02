import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiBell as Bell, 
  HiChatBubbleLeftRight as MessageSquare, 
  HiTicket as Ticket, 
  HiXMark as X,
  HiCheckCircle as CheckCircle,
  HiClock as Clock,
  HiTrash as Trash
} from 'react-icons/hi2';
import { useNotifications } from '../context/NotificationContext';
import { formatDistanceToNow } from 'date-fns';

interface NotificationDropdownProps {
  onViewAllActivity?: () => void;
}

const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ onViewAllActivity }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'message': return <MessageSquare className="w-4 h-4 text-blue-400" />;
      case 'ticket': return <Ticket className="w-4 h-4 text-emerald-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'error': return <X className="w-4 h-4 text-rose-500" />;
      default: return <Bell className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-brand-teal hover:bg-slate-50 transition-all shrink-0 shadow-sm"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-[10px] font-bold text-brand-teal uppercase tracking-widest hover:text-teal-600 transition-colors"
                >
                  Mark all as read
                </button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center">
                  <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-xs text-slate-400">No notifications yet</p>
                </div>
              ) : (
                notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    className={`p-4 border-b border-slate-50 flex gap-3 group transition-colors relative cursor-pointer ${notif.read ? 'opacity-60' : 'bg-brand-teal/5 hover:bg-brand-teal/10'}`}
                    onClick={() => !notif.read && markAsRead(notif.id)}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                      notif.read ? 'bg-slate-100' : 'bg-brand-teal/10'
                    }`}>
                      {getIcon(notif.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className={`text-xs font-bold truncate ${notif.read ? 'text-slate-500' : 'text-slate-900'}`}>
                          {notif.title}
                        </h4>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDistanceToNow(new Date(notif.timestamp), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                        {notif.message}
                      </p>
                    </div>

                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-50 rounded text-slate-300 hover:text-rose-500 transition-all"
                    >
                      <Trash className="w-3 h-3" />
                    </button>

                    {!notif.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-brand-teal" />
                    )}
                  </div>
                ))
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-slate-100 text-center bg-slate-50">
                <button 
                  onClick={() => {
                    setIsOpen(false);
                    onViewAllActivity?.();
                  }}
                  className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-brand-teal transition-colors"
                >
                  View all activity
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
