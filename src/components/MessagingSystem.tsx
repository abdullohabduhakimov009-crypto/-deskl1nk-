import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { 
  Bot,
  User, 
  Search, 
  Send,
  ChevronRight,
  ChevronDown,
  X,
  MessageSquare,
  CheckCircle,
  Clock,
  Paperclip,
  Image,
  Trash,
  MoreVertical
} from 'lucide-react';
import { 
  db, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy, 
  addDoc, 
  serverTimestamp,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  setDoc,
  writeBatch,
  handleFirestoreError,
  OperationType
} from '../firebase';

import { useNotifications } from '../context/NotificationContext';
import { useLanguage } from '../context/LanguageContext';
import { translateMessage, getAIChatResponse } from '../services/aiService';
import { HiLanguage as TranslateIcon } from 'react-icons/hi2';
import DeleteConfirmModal from './DeleteConfirmModal';

interface MessagingSystemProps {
  currentUser: any;
  role: 'admin' | 'engineer' | 'client';
  allUsers: any[]; // Pre-filtered based on role permissions
}

const MessagingSystem = React.memo(({ currentUser, role, allUsers }: MessagingSystemProps) => {
  const { addNotification } = useNotifications();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth >= 768 : true);
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [isTyping, setIsTyping] = useState<Record<string, boolean>>({});
  const [onlineUsers, setOnlineUsers] = useState<Record<string, boolean>>({});
  const [showScrollToBottom, setShowScrollToBottom] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null);
  const [chatToDelete, setChatToDelete] = useState<any | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  }, []);

  // Handle scroll events to show/hide "scroll to bottom" button
  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;
      setShowScrollToBottom(!isNearBottom);
    }
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  // Scroll on messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Only auto-scroll if user is already near bottom or it's a new chat
      if (scrollContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 250;
        
        if (isNearBottom || messages.length === 1) {
          requestAnimationFrame(() => {
            scrollToBottom("smooth");
          });
        }
      }
    }
  }, [messages.length, scrollToBottom]);

  // Scroll on chat selection
  useEffect(() => {
    if (selectedChat) {
      requestAnimationFrame(() => {
        scrollToBottom("auto");
      });
    }
  }, [selectedChat?.uid]);

  // Presence System
  useEffect(() => {
    if (!currentUser?.uid) return;

    const presenceRef = doc(db, "presence", currentUser.uid);
    setDoc(presenceRef, {
      online: true,
      lastSeen: serverTimestamp(),
      displayName: currentUser.displayName || currentUser.fullName || 'User'
    });

    const q = query(collection(db, "presence"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const online: Record<string, boolean> = {};
      snapshot.docs.forEach(doc => {
        online[doc.id] = doc.data().online;
      });
      setOnlineUsers(online);
    });

    return () => {
      updateDoc(presenceRef, { online: false, lastSeen: serverTimestamp() });
      unsubscribe();
    };
  }, [currentUser.uid]);

  // Typing Indicator System
  useEffect(() => {
    if (!selectedChat || !currentUser?.uid) return;

    const chatParticipants = [currentUser.uid, selectedChat.uid].sort();
    const chatId = chatParticipants.join('_');
    const typingRef = doc(db, "typing", `${chatId}_${currentUser.uid}`);

    // Listen for other person typing
    const otherTypingRef = doc(db, "typing", `${chatId}_${selectedChat.uid}`);
    const unsubscribe = onSnapshot(otherTypingRef, (doc) => {
      if (doc.exists()) {
        setIsTyping(prev => ({ ...prev, [selectedChat.uid]: doc.data().isTyping }));
      } else {
        setIsTyping(prev => ({ ...prev, [selectedChat.uid]: false }));
      }
    });

    return () => {
      updateDoc(typingRef, { isTyping: false }).catch(() => {});
      unsubscribe();
    };
  }, [selectedChat, currentUser.uid]);

  const handleTyping = (val: string) => {
    setNewMessage(val);
    if (!selectedChat || !currentUser?.uid) return;

    const chatParticipants = [currentUser.uid, selectedChat.uid].sort();
    const chatId = chatParticipants.join('_');
    const typingRef = doc(db, "typing", `${chatId}_${currentUser.uid}`);

    setDoc(typingRef, { isTyping: val.length > 0 }, { merge: true });
  };

  // Fetch unread counts for all users
  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", currentUser.uid),
      where("unread", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts: Record<string, number> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const senderId = data.senderId;
        counts[senderId] = (counts[senderId] || 0) + 1;
      });
      setUnreadCounts(counts);
    });

    return () => unsubscribe();
  }, [currentUser.uid]);

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    const adminUser = {
      id: 'admin_desklink',
      uid: 'admin_desklink',
      email: 'admin@desklink.com',
      displayName: 'Desknet Admin Support',
      fullName: 'Desknet Admin Support',
      role: 'admin',
      isSystem: true
    };

    const aiAssistant = {
      id: 'ai_assistant',
      uid: 'ai_assistant',
      email: 'ai@desklink.com',
      displayName: 'GEN-AI Assistant',
      fullName: 'GEN-AI Assistant',
      role: 'AI Assistant',
      isAI: true
    };

    let baseUsers = [...allUsers];
    
    // Remove current user from list
    baseUsers = baseUsers.filter(u => u.uid !== currentUser.uid);

    // If not admin, ensure admin and AI assistant are in the list and at the top
    if (role !== 'admin') {
      const existingAdmin = baseUsers.find(u => u.role === 'admin' || u.uid === 'admin_desklink');
      if (existingAdmin) {
        baseUsers = baseUsers.filter(u => u !== existingAdmin);
        baseUsers = [existingAdmin, ...baseUsers];
      } else {
        baseUsers = [adminUser, ...baseUsers];
      }
      
      // Add AI Assistant at the very top
      baseUsers = [aiAssistant, ...baseUsers];
    }

    return baseUsers.filter(u => 
      (u.displayName || u.fullName || u.email || 'Unnamed').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allUsers, searchTerm, currentUser.uid, role]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChat) return;

    const chatParticipants = [currentUser.uid, selectedChat.uid].sort();
    const chatId = chatParticipants.join('_');

    const q = query(
      collection(db, "messages"),
      where("chatId", "==", chatId),
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setMessages(prev => {
        // Deep comparison to avoid unnecessary re-renders
        if (prev.length === msgs.length && 
            prev.every((msg, i) => msg.id === msgs[i].id && msg.unread === msgs[i].unread)) {
          return prev;
        }
        return msgs;
      });

      // Mark messages as read if they are for me (BATCHED)
      const unreadDocs = snapshot.docs.filter(d => {
        const data = d.data();
        return data.receiverId === currentUser.uid && data.unread;
      });

      if (unreadDocs.length > 0) {
        const batch = writeBatch(db);
        unreadDocs.forEach(d => {
          batch.update(doc(db, "messages", d.id), { unread: false });
        });
        try {
          await batch.commit();
        } catch (err) {
          console.error("Error marking messages as read:", err);
        }
      }
    }, (error) => {
      console.error("Messages listener error:", error);
      handleFirestoreError(error, OperationType.LIST, "messages");
    });

    return () => unsubscribe();
  }, [selectedChat, currentUser.uid]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    const chatParticipants = [currentUser.uid, selectedChat.uid].sort();
    const chatId = chatParticipants.join('_');
    const messageContent = newMessage;

    try {
      const messageData: any = {
        chatId,
        senderId: currentUser.uid,
        receiverId: selectedChat.uid,
        content: messageContent,
        timestamp: serverTimestamp(),
        senderName: currentUser.displayName || currentUser.fullName || currentUser.email || 'User',
        unread: true
      };

      await addDoc(collection(db, "messages"), messageData);
      setNewMessage('');

      // If it's AI Assistant, get response
      if (selectedChat.isAI) {
        setIsTyping(prev => ({ ...prev, [selectedChat.uid]: true }));
        
        // Prepare history for AI
        const history = messages.slice(-10).map(m => ({
          role: m.senderId === currentUser.uid ? 'user' as const : 'model' as const,
          parts: [{ text: m.content }]
        }));

        const aiResponse = await getAIChatResponse(messageContent, history);
        
        await addDoc(collection(db, "messages"), {
          chatId,
          senderId: selectedChat.uid,
          receiverId: currentUser.uid,
          content: aiResponse,
          timestamp: serverTimestamp(),
          senderName: selectedChat.displayName,
          unread: false,
          isAI: true
        });
        
        setIsTyping(prev => ({ ...prev, [selectedChat.uid]: false }));
      } else {
        // Add persistent notification for the receiver
        await addNotification({
          type: 'message',
          title: 'New Message',
          message: `${currentUser.displayName || currentUser.fullName || currentUser.email || 'User'}: ${messageContent.substring(0, 50)}${messageContent.length > 50 ? '...' : ''}`,
          link: '/messages'
        }, selectedChat.uid);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setIsTyping(prev => ({ ...prev, [selectedChat.uid]: false }));
    }
  };

  const handleDeleteMessage = useCallback(async (messageId: string) => {
    setMessageToDelete(messageId);
  }, []);

  const confirmDeleteMessage = async () => {
    if (!messageToDelete) return;
    try {
      await deleteDoc(doc(db, "messages", messageToDelete));
      setMessageToDelete(null);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleDeleteChat = async (e: React.MouseEvent, chatUser: any) => {
    e.stopPropagation();
    setChatToDelete(chatUser);
  };

  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;
    
    const chatParticipants = [currentUser.uid, chatToDelete.uid].sort();
    const chatId = chatParticipants.join('_');

    try {
      // Find all messages for this chat
      const q = query(collection(db, "messages"), where("chatId", "==", chatId));
      const snapshot = await getDocs(q);
      
      // Delete each message
      const deletePromises = snapshot.docs.map(d => deleteDoc(doc(db, "messages", d.id)));
      await Promise.all(deletePromises);
      
      if (selectedChat?.uid === chatToDelete.uid) {
        setSelectedChat(null);
      }
      setChatToDelete(null);
      addNotification({
        type: 'success',
        title: 'Conversation Deleted',
        message: 'Conversation deleted successfully.'
      });
    } catch (error) {
      console.error("Error deleting chat:", error);
      addNotification({
        type: 'error',
        title: 'Delete Failed',
        message: 'Failed to delete conversation.'
      });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'image' | 'file') => {
    const file = e.target.files?.[0];
    if (!file || !selectedChat) return;

    // Check file size (limit to 1MB for local storage mock)
    if (file.size > 1024 * 1024) {
      addNotification({
        type: 'error',
        title: 'File Too Large',
        message: 'Please select a file smaller than 1MB.'
      });
      return;
    }

    // In a real app, we'd upload to Firebase Storage
    // For this mock, we'll convert to base64
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      const chatParticipants = [currentUser.uid, selectedChat.uid].sort();
      const chatId = chatParticipants.join('_');

      try {
        await addDoc(collection(db, "messages"), {
          chatId,
          senderId: currentUser.uid,
          receiverId: selectedChat.uid,
          content: type === 'image' ? 'Sent an image' : `Sent a file: ${file.name}`,
          fileUrl: base64,
          fileType: type,
          fileName: file.name,
          timestamp: serverTimestamp(),
          senderName: currentUser.displayName || currentUser.fullName || currentUser.email || 'User',
          unread: true
        });
      } catch (error) {
        console.error("Error sending file:", error);
      }
    };
    reader.readAsDataURL(file);
  };

  const formatMessageDate = useCallback((timestamp: any) => {
    if (!timestamp) return 'Sending...';
    
    let date: Date;
    try {
      if (timestamp instanceof Date) {
        date = timestamp;
      } else if (timestamp?.toDate) {
        date = timestamp.toDate();
      } else if (timestamp?.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'Just now';
      }

      if (isNaN(date.getTime())) return 'Just now';
      return format(date, 'HH:mm');
    } catch (e) {
      console.error("Error formatting date:", e);
      return 'Just now';
    }
  }, []);

  return (
    <div className="h-full bg-slate-50 flex overflow-hidden w-full">
      {/* Sidebar */}
      <div className={`${isSidebarOpen ? 'w-full md:w-80' : 'w-20'} ${selectedChat ? 'hidden md:flex' : 'flex'} border-r border-slate-200 flex-col transition-all duration-300 bg-white`}>
        <div className="p-6 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-2 justify-between mb-4">
            {isSidebarOpen && <h3 className="font-bold text-slate-900">Conversations</h3>}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          </div>
          {isSidebarOpen && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:ring-2 focus:ring-brand-teal outline-none transition-all"
              />
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((u) => (
              <ChatUserItem
                key={u.uid || u.id}
                user={u}
                isSelected={selectedChat?.uid === u.uid}
                isOnline={onlineUsers[u.uid || u.id]}
                unreadCount={unreadCounts[u.uid || u.id]}
                isSidebarOpen={isSidebarOpen}
                onSelect={() => setSelectedChat(u)}
                onDelete={(e) => handleDeleteChat(e, u)}
              />
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-sm italic">
              No users found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 ${!selectedChat ? 'hidden md:flex' : 'flex'} flex-col bg-white relative min-h-0`}>
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 md:p-6 bg-white border-b border-slate-200 flex items-center gap-4 justify-between shadow-sm z-10">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setSelectedChat(null)}
                  className="md:hidden p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400"
                >
                  <ChevronRight className="w-6 h-6 rotate-180" />
                </button>
                <div className="w-10 h-10 md:w-12 md:h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
                  {selectedChat.isAI ? (
                    <div className="w-full h-full bg-brand-teal flex items-center justify-center text-brand-dark">
                      <Bot className="w-6 h-6" />
                    </div>
                  ) : selectedChat.photoURL || selectedChat.profilePic ? (
                    <img src={selectedChat.photoURL || selectedChat.profilePic} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <User className="w-5 h-5 md:w-6 md:h-6" />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm md:text-base">
                    {selectedChat.displayName || selectedChat.fullName || selectedChat.email?.split('@')[0] || 'Unnamed'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 ${onlineUsers[selectedChat.uid] ? 'bg-emerald-500' : 'bg-slate-300'} rounded-full`} />
                    <span className={`text-[10px] ${onlineUsers[selectedChat.uid] ? 'text-emerald-500' : 'text-slate-500'} font-bold uppercase tracking-widest`}>
                      {onlineUsers[selectedChat.uid] ? 'Online' : 'Offline'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 px-4 md:px-10 py-6 space-y-6 overflow-y-auto custom-scrollbar bg-slate-50 min-h-0 relative"
            >
              {messages.length > 0 ? (
                <div className="space-y-6">
                  {messages.map((msg, i) => (
                    <MessageItem
                      key={msg.id || i}
                      message={msg}
                      isMe={msg.senderId === currentUser.uid}
                      otherUserPhoto={selectedChat.photoURL || selectedChat.profilePic}
                      onDelete={handleDeleteMessage}
                      formatDate={formatMessageDate}
                    />
                  ))}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
                  <div className="w-20 h-20 bg-slate-100 rounded-[2rem] flex items-center justify-center">
                    <MessageSquare className="w-10 h-10 opacity-20" />
                  </div>
                  <p className="text-sm font-medium">No messages yet. Start the conversation!</p>
                </div>
              )}
              {isTyping[selectedChat.uid] && (
                <div className="flex justify-start items-center gap-2">
                  <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden shrink-0">
                    {selectedChat.isAI ? (
                      <div className="w-full h-full bg-brand-teal flex items-center justify-center text-brand-dark">
                        <Bot className="w-4 h-4" />
                      </div>
                    ) : (
                      selectedChat.photoURL || selectedChat.profilePic ? (
                        <img src={selectedChat.photoURL || selectedChat.profilePic} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        <User className="w-4 h-4" />
                      )
                    )}
                  </div>
                  <div className="bg-white border border-slate-100 px-4 py-2 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-1">
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                    <motion.div animate={{ opacity: [0.2, 1, 0.2] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-slate-400 rounded-full" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-2" />

              {/* Scroll to bottom button */}
              <AnimatePresence>
                {showScrollToBottom && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={() => scrollToBottom("smooth")}
                    className="absolute bottom-6 right-10 p-3 bg-brand-teal text-brand-dark rounded-full shadow-lg hover:bg-brand-teal/90 transition-all z-30"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            {/* Input */}
            <div className="p-6 bg-white border-t border-slate-200">
              <div className="flex gap-2 mb-3">
                <label className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 cursor-pointer">
                  <Image className="w-5 h-5" />
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'image')} />
                </label>
                <label className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400 cursor-pointer">
                  <Paperclip className="w-5 h-5" />
                  <input type="file" className="hidden" onChange={(e) => handleFileUpload(e, 'file')} />
                </label>
              </div>
              <form 
                onSubmit={handleSendMessage}
                className="flex gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 focus-within:border-brand-teal/50 transition-all"
              >
                <input 
                  type="text" 
                  value={newMessage}
                  onChange={(e) => handleTyping(e.target.value)}
                  placeholder="Type your message here..." 
                  className="flex-1 bg-transparent px-4 py-2 text-sm text-slate-900 outline-none" 
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="w-12 h-12 bg-brand-teal text-brand-dark rounded-xl flex items-center justify-center hover:bg-teal-300 transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50 disabled:shadow-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center space-y-6">
            <div className="w-32 h-32 bg-white rounded-[3rem] shadow-2xl flex items-center justify-center relative border border-slate-200">
              <MessageSquare className="w-12 h-12 text-brand-teal" />
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-2 -right-2 w-8 h-8 bg-brand-teal rounded-full flex items-center justify-center text-brand-dark"
              >
                <PlusSquare className="w-4 h-4" />
              </motion.div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Your Messages</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Select a contact from the sidebar to start chatting with engineers, clients, or support.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Desknet Support', 'Recent Engineers', 'Active Clients'].map((tag) => (
                <span key={tag} className="px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-500 shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <DeleteConfirmModal 
        isOpen={!!messageToDelete}
        onClose={() => setMessageToDelete(null)}
        onConfirm={confirmDeleteMessage}
        title="Delete Message"
        message="Are you sure you want to delete this message? This action cannot be undone."
      />

      <DeleteConfirmModal 
        isOpen={!!chatToDelete}
        onClose={() => setChatToDelete(null)}
        onConfirm={confirmDeleteChat}
        title="Delete Conversation"
        message={`Are you sure you want to delete the entire conversation with ${chatToDelete?.displayName || chatToDelete?.fullName || 'this user'}? This action cannot be undone.`}
      />
    </div>
  );
});

const PlusSquare = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

// Memoized Components for Performance
const ChatUserItem = React.memo(({ user, isSelected, isOnline, unreadCount, isSidebarOpen, onSelect, onDelete }: any) => {
  return (
    <div
      onClick={onSelect}
      className={`w-full p-4 flex items-center gap-3 transition-all border-b border-slate-100 cursor-pointer group ${
        isSelected ? 'bg-slate-50 shadow-sm border-l-4 border-l-brand-teal' : 'hover:bg-slate-50'
      }`}
    >
      <div className="relative shrink-0">
        <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 overflow-hidden">
          {user.isAI ? (
            <div className="w-full h-full bg-brand-teal flex items-center justify-center text-brand-dark">
              <Bot className="w-6 h-6" />
            </div>
          ) : user.photoURL || user.profilePic ? (
            <img src={user.photoURL || user.profilePic} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-6 h-6" />
          )}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${isOnline ? 'bg-emerald-500' : 'bg-slate-200'} border-2 border-white rounded-full`} />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-bold text-white px-1">
            {unreadCount}
          </div>
        )}
      </div>
      {isSidebarOpen && (
        <div className="flex-1 min-w-0 text-left">
          <div className="flex justify-between items-center mb-0.5">
            <h4 className="font-bold text-sm text-slate-900 truncate">
              {user.displayName || user.fullName || user.email?.split('@')[0] || 'Unnamed'}
            </h4>
            <button 
              onClick={onDelete}
              className="p-1.5 hover:bg-rose-500/10 text-slate-300 hover:text-rose-500 rounded-lg transition-all opacity-0 group-hover:opacity-100"
              title="Delete conversation"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{user.role}</p>
        </div>
      )}
    </div>
  );
});

const MessageItem = React.memo(({ message, isMe, otherUserPhoto, onDelete, formatDate }: any) => {
  const { language, t } = useLanguage();
  const [translatedText, setTranslatedText] = useState<string | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const handleTranslate = async () => {
    if (translatedText) {
      setTranslatedText(null);
      return;
    }

    setIsTranslating(true);
    try {
      const targetLang = language === 'en' ? 'English' : language === 'ru' ? 'Russian' : 'Uzbek';
      const result = await translateMessage(message.content, targetLang);
      setTranslatedText(result);
    } catch (error) {
      console.error("Translation failed:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} items-end gap-2`}>
      {!isMe && (
        <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-400 overflow-hidden shrink-0 mb-1">
          {message.isAI ? (
            <div className="w-full h-full bg-brand-teal flex items-center justify-center text-brand-dark">
              <Bot className="w-4 h-4" />
            </div>
          ) : otherUserPhoto ? (
            <img src={otherUserPhoto} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          ) : (
            <User className="w-4 h-4" />
          )}
        </div>
      )}
      <div className={`group relative max-w-[85%] md:max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
        <div className={`p-4 rounded-2xl shadow-sm relative group/msg ${
          isMe 
            ? 'bg-brand-teal text-brand-dark rounded-br-none' 
            : 'bg-white text-slate-900 rounded-bl-none border border-slate-200'
        }`}>
          <div className="absolute top-2 flex gap-1 opacity-0 group-hover/msg:opacity-100 transition-all z-20" style={{ [isMe ? 'right' : 'left']: 'calc(100% + 8px)' }}>
            <button 
              onClick={() => onDelete(message.id)}
              className="p-1.5 bg-white border border-slate-200 text-slate-300 hover:text-rose-500 rounded-lg shadow-sm"
              title={t.common?.delete || "Delete"}
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
            {!isMe && (
              <button 
                onClick={handleTranslate}
                disabled={isTranslating}
                className={`p-1.5 bg-white border border-slate-200 rounded-lg shadow-sm transition-colors ${translatedText ? 'text-brand-teal' : 'text-slate-300 hover:text-brand-teal'}`}
                title={translatedText ? t.messaging.showOriginal : t.messaging.translate}
              >
                {isTranslating ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                    <TranslateIcon className="w-3.5 h-3.5" />
                  </motion.div>
                ) : (
                  <TranslateIcon className="w-3.5 h-3.5" />
                )}
              </button>
            )}
          </div>
          {message.fileUrl && (
            <div className="mb-2">
              {message.fileType === 'image' ? (
                <img src={message.fileUrl} alt="Sent" className="max-w-full rounded-lg cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.open(message.fileUrl)} />
              ) : (
                <a href={message.fileUrl} download={message.fileName} className="flex items-center gap-2 p-2 bg-slate-100 rounded-lg hover:bg-slate-200 transition-all">
                  <Paperclip className="w-4 h-4" />
                  <span className="text-xs font-medium truncate max-w-[150px]">{message.fileName}</span>
                </a>
              )}
            </div>
          )}
          <div className="space-y-2">
            <p className="text-sm leading-relaxed break-words">{message.content}</p>
            {translatedText && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2 border-t border-slate-100 mt-2"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <TranslateIcon className="w-3 h-3 text-brand-teal" />
                  <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">{t.messaging.translated}</span>
                </div>
                <p className="text-sm italic text-slate-600 leading-relaxed break-words">{translatedText}</p>
              </motion.div>
            )}
          </div>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest mt-1.5 text-slate-400`}>
          {formatDate(message.timestamp)}
        </span>
      </div>
    </div>
  );
});

export default MessagingSystem;
