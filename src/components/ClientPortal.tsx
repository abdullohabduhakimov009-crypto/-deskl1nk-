import React, { useState, useEffect, useMemo, useRef } from 'react';
import NotificationDropdown from './NotificationDropdown';
import CustomDropdown from './CustomDropdown';
import { 
  db, 
  auth, 
  collection, 
  query, 
  where, 
  onSnapshot, 
  onAuthStateChanged,
  orderBy, 
  addDoc, 
  updateDoc,
  deleteDoc,
  serverTimestamp, 
  doc, 
  setDoc,
  getDocs,
  handleFirestoreError,
  OperationType
} from '../firebase';
// import { collection, query, where, onSnapshot, orderBy, addDoc, serverTimestamp, doc, setDoc } from 'firebase/firestore';
import { 
  HiHome as Home, 
  HiPlusCircle as PlusCircle, 
  HiTicket as Ticket, 
  HiSquares2X2 as Layers, 
  HiBriefcase as Briefcase, 
  HiCreditCard as CreditCard, 
  HiUsers as Users, 
  HiBuildingOffice2 as Building2, 
  HiQuestionMarkCircle as HelpCircle, 
  HiChatBubbleLeftRight as MessageSquare,
  HiChatBubbleOvalLeft as MessageCircle,
  HiArrowLeftOnRectangle as LogOut,
  HiBell as Bell,
  HiMagnifyingGlass as Search,
  HiChevronRight as ChevronRight,
  HiBars3 as Menu,
  HiXMark as X,
  HiArrowLeft as ArrowLeft,
  HiUser as User,
  HiBolt as Zap,
  HiGlobeAlt as Globe,
  HiClock as Clock,
  HiCurrencyDollar as DollarSign,
  HiShieldCheck as ShieldCheck,
  HiPlus as Plus,
  HiCheckCircle as CheckCircle,
  HiCheck as Check,
  HiStar as Star,
  HiCodeBracket as Code,
  HiDocumentText as FileText,
  HiEnvelope as Mail,
  HiPhone as Phone,
  HiArrowTrendingUp as TrendingUp,
  HiExclamationCircle as AlertCircle,
  HiShieldCheck as Shield,
  HiListBullet as List,
  HiFunnel as Filter,
  HiPresentationChartLine as Activity,
  HiCog6Tooth as Settings,
  HiComputerDesktop as Monitor,
  HiTruck as Truck,
  HiPlusCircle as PlusSquare,
  HiChartBar as BarChart3,
  HiUserPlus as UserPlus,
  HiLockClosed as Lock,
  HiBookOpen as BookOpen,
  HiClock as History,
  HiPaperAirplane as Send,
  HiMapPin as MapPin,
  HiMap as MapIcon,
  HiChevronDown as ChevronDown,
  HiPaperClip as PaperClip,
  HiArrowPath as Loader2,
  HiWrenchScrewdriver as Wrench,
  HiPencil as Edit3,
  HiTrash as Trash,
  HiArrowDownTray as Download,
  HiArrowLeft,
  HiEye as Eye,
  HiEllipsisVertical as MoreVertical
} from 'react-icons/hi2';
import { FaHeadset as Headphones } from 'react-icons/fa6';
import { Country, City } from 'country-state-city';
import countriesLib from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import ruCountries from 'i18n-iso-countries/langs/ru.json';
import Select from 'react-select';
import { PremiumButton } from './PremiumButton';

countriesLib.registerLocale(enCountries);
countriesLib.registerLocale(ruCountries);
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Logo from './Logo';
import WorldMap from './WorldMap';
import { motion, AnimatePresence } from 'framer-motion';

const notifyAdmins = async (notification: any) => {
  try {
    const adminDocs = await getDocs(query(collection(db, "users"), where("role", "==", "admin")));
    const adminIds = adminDocs.docs.map(doc => doc.id);
    
    for (const adminId of adminIds) {
      await addDoc(collection(db, "users", adminId, "notifications"), {
        ...notification,
        read: false,
        timestamp: serverTimestamp()
      });
    }
  } catch (err) {
    console.error("Error notifying admins:", err);
  }
};
import { generatePOPDF, generateTicketReportPDF, generateOpportunityReportPDF, POData, TicketReportItem, OpportunityReportItem } from '../lib/pdfGenerator';
import LogoutConfirmModal from './LogoutConfirmModal';
import TicketDetailView from './TicketDetailView';
import OpportunityDetailView from './OpportunityDetailView';
import MessagingSystem from './MessagingSystem';
import ActivityFeed from './ActivityFeed';
import QuotationPortal from './QuotationPortal';
import SettingsView from './SettingsView';
import { FileUpload } from './FileUpload';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';

interface ClientPortalProps {
  user: any;
  onLogout: () => void;
}

const ClientPortal: React.FC<ClientPortalProps> = ({ user, onLogout }) => {
  const { t, language, setLanguage } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('desklink_client_activeTab') || 'home');
  const [activeSubTab, setActiveSubTab] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<string[]>(['help']);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showPaymentAdviceModal, setShowPaymentAdviceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [paymentAdvice, setPaymentAdvice] = useState({
    transactionId: '',
    paymentMethod: 'Bank Transfer',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [showTicketReview, setShowTicketReview] = useState(false);
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState(false);
  const [submittedTicketId, setSubmittedTicketId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmittingRating, setIsSubmittingRating] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [tickets, setTickets] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [subUsers, setSubUsers] = useState<any[]>([]);
  const [engineers, setEngineers] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    name: '',
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    contactPhone: '',
    country: '',
    city: '',
    location: '',
    description: '',
    taxId: '',
    yearFounded: '',
    linkedin: '',
    primaryContact: ''
  });

  useEffect(() => {
    if (user) {
      setEditProfileData({
        name: user.name || user.fullName || '',
        companyName: user.companyName || '',
        industry: user.industry || '',
        companySize: user.companySize || '',
        website: user.website || '',
        contactPhone: user.contactPhone || '',
        country: user.country || '',
        city: user.city || '',
        location: user.location || '',
        description: user.description || '',
        taxId: user.taxId || '',
        yearFounded: user.yearFounded || '',
        linkedin: user.linkedin || '',
        primaryContact: user.primaryContact || ''
      });
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    const path = `users/${user.uid}`;
    try {
      await updateDoc(doc(db, "users", user.uid), {
        ...editProfileData,
        updatedAt: serverTimestamp()
      });
      setIsEditingProfile(false);
      addNotification({
        type: 'success',
        title: 'Profile Updated',
        message: 'Your company profile has been updated successfully.'
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };
  const handleSendPaymentAdvice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.uid || !selectedInvoice) return;

    try {
      await addDoc(collection(db, "payment_advice"), {
        ...paymentAdvice,
        invoiceId: selectedInvoice.id,
        clientId: user.uid,
        clientName: user.displayName || user.fullName || user.email,
        status: 'Pending',
        createdAt: serverTimestamp()
      });

      // Notify admins
      await notifyAdmins({
        type: 'billing',
        title: 'New Payment Advice',
        message: `Client ${user.displayName || user.fullName || user.email} sent payment advice for INV-${selectedInvoice.id.slice(0, 4).toUpperCase()}`,
        link: '/admin/billing'
      });

      setShowPaymentAdviceModal(false);
      setPaymentAdvice({
        transactionId: '',
        paymentMethod: 'Bank Transfer',
        amount: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      });
      addNotification({
        type: 'success',
        title: 'Advice Sent',
        message: 'Your payment advice has been sent to the billing department.'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "payment_advice");
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [ticketData, setTicketData] = useState({
    serviceType: 'On-Demand Dispatch',
    estimatedDuration: '',
    priority: 'Medium',
    subject: '',
    description: '',
    country: '',
    city: '',
    location: '',
    contactEmail: user?.email || '',
    contactPhone: '',
    ticketNumber: '',
    dateTime: '',
    specialInstructions: '',
    attachments: [] as { name: string, type: string, data: string }[]
  });
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    role: 'Viewer'
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(typeof window !== 'undefined' ? window.innerWidth > 1024 : true);
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 1024 : false);

  useEffect(() => {
    let timeoutId: any = null;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const mobile = window.innerWidth <= 1024;
        setIsMobile(mobile);
        if (!mobile) setIsSidebarOpen(true);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [showCreateOppModal, setShowCreateOppModal] = useState(false);
  const [currentOppStep, setCurrentOppStep] = useState(1);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [newOpp, setNewOpp] = useState({
    type: 'Project',
    title: '',
    description: '',
    country: '',
    city: '',
    location: '',
    budget: '',
    timeline: '',
    attachments: [] as { name: string; type: string; data: string }[]
  });

  useEffect(() => {
    if (user?.email && !ticketData.contactEmail) {
      setTicketData(prev => ({ ...prev, contactEmail: user.email }));
    }
  }, [user?.email, ticketData.contactEmail]);
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedEngineer, setSelectedEngineer] = useState<any>(null);
  const [showEngineerModal, setShowEngineerModal] = useState(false);
  const [feedback, setFeedback] = useState({ rating: 5, comment: '' });
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [ticketSearch, setTicketSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [dateFilter, setDateFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const opportunityStats = useMemo(() => [
    { label: 'Under Review', count: opportunities.filter(o => o.status === 'Under Review').length, color: 'bg-blue-100 text-blue-600' },
    { label: 'Active', count: opportunities.filter(o => o.status === 'Active').length, color: 'bg-emerald-100 text-emerald-700' },
    { label: 'Closed', count: opportunities.filter(o => o.status === 'Closed').length, color: 'bg-gray-100 text-gray-400' },
    { label: 'Total', count: opportunities.length, color: 'bg-slate-100 text-slate-600' }
  ], [opportunities]);

  const opportunityChartData = useMemo(() => [
    { name: 'Review', value: opportunities.filter(o => o.status === 'Under Review').length },
    { name: 'Active', value: opportunities.filter(o => o.status === 'Active').length },
    { name: 'Closed', value: opportunities.filter(o => o.status === 'Closed').length },
  ], [opportunities]);

  const billingStats = useMemo(() => {
    const currentBalance = invoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + parseFloat(i.amount.replace(/[^0-9.]/g, '') || '0'), 0);
    const pendingAdvice = invoices.filter(i => i.status === 'Pending').length;
    return { currentBalance, pendingAdvice };
  }, [invoices]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [newUpdateText, setNewUpdateText] = useState('');
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      padding: '8px',
      borderRadius: '16px',
      border: '1px solid #e2e8f0',
      backgroundColor: '#f8fafc',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#009688'
      }
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isSelected ? '#009688' : state.isFocused ? '#f1f5f9' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      padding: '12px'
    })
  };

  const countries = useMemo(() => {
    const all = Country.getAllCountries().map(c => {
      let translatedName = c.name;
      if (language === 'ru') {
        translatedName = countriesLib.getName(c.isoCode, 'ru') || c.name;
      } else if (language === 'uz') {
        translatedName = c.name; // Fallback
      }
      return {
        value: c.isoCode,
        label: translatedName,
        flag: c.flag
      };
    });
    
    // Sort to put Sweden and Australia at top as preferred
    const preferred = ['SE', 'AU'];
    return [
      ...all.filter(c => preferred.includes(c.value)).sort((a, b) => preferred.indexOf(a.value) - preferred.indexOf(b.value)),
      ...all.filter(c => !preferred.includes(c.value))
    ];
  }, [language]);

  const cities = useMemo(() => {
    if (!ticketData.country) return [];
    const allCities = City.getCitiesOfCountry(ticketData.country) || [];
    // Filter out duplicate city names to avoid duplicate keys in dropdown
    const uniqueCityNames = Array.from(new Set(allCities.map(city => city.name)));
    return uniqueCityNames.map(name => ({
      value: name,
      label: name
    }));
  }, [ticketData.country]);

  const newOppCities = useMemo(() => {
    if (!newOpp.country) return [];
    const allCities = City.getCitiesOfCountry(newOpp.country) || [];
    // Filter out duplicate city names to avoid duplicate keys in dropdown
    const uniqueCityNames = Array.from(new Set(allCities.map(city => city.name)));
    return uniqueCityNames.map(name => ({
      value: name,
      label: name
    }));
  }, [newOpp.country]);

  useEffect(() => {
    if (newOpp.country || newOpp.city) {
      const countryName = countries.find(c => c.value === newOpp.country)?.label || '';
      const location = [newOpp.city, countryName].filter(Boolean).join(', ');
      setNewOpp(prev => ({ ...prev, location }));
    }
  }, [newOpp.country, newOpp.city, countries]);

  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.currentUser || !!user?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setIsLoggedIn(!!firebaseUser || !!user?.uid);
    });
    return () => unsubscribe();
  }, [user?.uid]);

  useEffect(() => {
    const userEmail = (user?.email || auth.currentUser?.email || user?.companyEmail || '').toLowerCase().trim();
    
    console.log("[ClientPortal] Ticket fetch useEffect triggered", { isLoggedIn, userEmail });

    if (!isLoggedIn || !userEmail) {
      console.log("[ClientPortal] Skipping ticket fetch: not authenticated or no email");
      return;
    }

    const q = query(
      collection(db, "tickets"), 
      where("authorUid", "==", auth.currentUser?.uid || user?.uid || 'unknown'), 
      orderBy("createdAt", "desc")
    );

    const unsubTickets = onSnapshot(q, (snapshot: any) => {
      const ticketList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
      
      console.log("[ClientPortal] Fetched tickets for", userEmail, ":", ticketList.length);
      setTickets(ticketList.sort((a: any, b: any) => {
        const getTime = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'string') return new Date(val).getTime();
          if (val.toDate) return val.toDate().getTime();
          if (val.seconds) return val.seconds * 1000;
          return 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      }));
    });

    const unsubInvoices = onSnapshot(
      query(collection(db, "invoices"), where("clientEmail", "==", userEmail), orderBy("createdAt", "desc")),
      (snapshot: any) => {
        const invoiceList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        setInvoices(invoiceList);
      }
    );

    const unsubMessages = onSnapshot(
      query(collection(db, "messages"), where("receiverId", "==", user.uid || user.id), where("unread", "==", true)),
      (snapshot: any) => {
        setUnreadMessagesCount(snapshot.size);
      }
    );

    const unsubQuotations = onSnapshot(
      query(collection(db, "quotations"), where("clientUid", "==", user?.uid), orderBy("createdAt", "desc")),
      (snapshot: any) => {
        setQuotations(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      }
    );

    const unsubSubUsers = onSnapshot(
      query(collection(db, "users"), where("parentClientEmail", "==", userEmail)),
      (snapshot: any) => {
        const userList = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        const filteredUsers = userList.filter((u: any) => u.parentClientEmail === userEmail);
        setSubUsers(filteredUsers);
      }
    );

    const unsubEngineers = onSnapshot(query(collection(db, "users"), where("role", "==", "engineer")), (snapshot: any) => {
      setEngineers(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    });

    const unsubOpps = onSnapshot(
      query(
        collection(db, "opportunities"),
        where("clientId", "==", user.uid),
        orderBy("createdAt", "desc")
      ),
      (snapshot: any) => {
        setOpportunities(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      },
      (error) => handleFirestoreError(error, OperationType.LIST, "opportunities")
    );

    return () => {
      unsubTickets();
      unsubInvoices();
      unsubMessages();
      unsubQuotations();
      unsubSubUsers();
      unsubEngineers();
      unsubOpps();
    };
  }, [user?.email, user.uid, user.id, isLoggedIn]);

  useEffect(() => {
    if (selectedTicket) {
      const updatedTicket = tickets.find(t => t.id === selectedTicket.id);
      if (updatedTicket) {
        setSelectedTicket(updatedTicket);
      }
    }
  }, [tickets]);

  const handleTicketInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validation logic
    if (['contactPhone', 'ticketNumber'].includes(name)) {
      // Allow numbers, spaces, plus, and dashes
      if (/[^0-9+\-\s]/.test(value)) return;
    }

    setTicketData(prev => ({ ...prev, [name]: value }));
  };

  const handleNewUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Validation logic
    if (['username'].includes(name)) {
      // Text only: No digits
      if (/\d/.test(value)) return;
    }

    setNewUser(prev => ({ ...prev, [name]: value }));
  };

  const handleOppFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setNewOpp(prev => ({
            ...prev,
            attachments: [...prev.attachments, {
              name: file.name,
              type: file.type,
              data: reader.result as string
            }]
          }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeOppAttachment = (index: number) => {
    setNewOpp(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const handleCreateOpportunity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOpp.title || !newOpp.description || !newOpp.country || !newOpp.city) {
      addNotification({
        type: 'error',
        title: 'Missing Fields',
        message: 'Please provide title, description, country, and city.'
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const oppData = {
        ...newOpp,
        clientId: user.uid,
        clientName: user.displayName || user.name || 'Client',
        clientEmail: user.email,
        status: 'Under Review',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, "opportunities"), oppData);

      // Notify admins
      await notifyAdmins({
        type: 'new_opportunity',
        title: 'New Opportunity Created',
        message: `A new opportunity "${newOpp.title}" has been created by ${user.displayName || user.name || 'a client'}.`,
        link: '/admin/opportunities'
      });

      addNotification({
        type: 'success',
        title: 'Opportunity Created',
        message: 'Your opportunity has been submitted for review.'
      });

      setShowCreateOppModal(false);
      setCurrentOppStep(1);
      setNewOpp({
        type: 'Project',
        title: '',
        description: '',
        country: '',
        city: '',
        location: '',
        budget: '',
        timeline: '',
        attachments: [] as { name: string; type: string; data: string }[]
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "opportunities");
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: 'Failed to create opportunity. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userRef = doc(collection(db, "users"));
      const userData = {
        uid: userRef.id,
        displayName: newUser.username,
        email: newUser.email,
        role: 'client', // Sub-users are also clients but with restricted roles in app logic
        parentClientEmail: user.email,
        status: 'Active',
        createdAt: serverTimestamp()
      };
      
      await setDoc(userRef, userData);
      
      setShowAddUserModal(false);
      setNewUser({ username: '', email: '', role: 'Viewer' });
      addNotification({
        type: 'success',
        title: 'User Added',
        message: 'User added successfully!'
      });
    } catch (error) {
      console.error("Error adding user:", error);
      addNotification({
        type: 'error',
        title: 'Add Failed',
        message: 'Failed to add user. Please check permissions.'
      });
    }
  };

  const handleTicketSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Clean payload to ensure it matches security rules exactly
      const ticketPayload = {
        serviceType: ticketData.serviceType,
        estimatedDuration: ticketData.estimatedDuration,
        priority: ticketData.priority,
        subject: ticketData.subject,
        description: ticketData.description,
        country: ticketData.country,
        city: ticketData.city,
        location: ticketData.location,
        contactEmail: ticketData.contactEmail || user?.email || auth.currentUser?.email || '',
        contactPhone: ticketData.contactPhone,
        ticketNumber: ticketData.ticketNumber,
        dateTime: ticketData.dateTime,
        specialInstructions: ticketData.specialInstructions || '',
        attachments: ticketData.attachments || [],
        authorUid: user?.uid || auth.currentUser?.uid || 'unknown',
        clientName: user?.companyName || user?.displayName || user?.name || user?.fullName || auth.currentUser?.displayName || 'Unknown Client',
        clientEmail: (user?.email || auth.currentUser?.email || user?.companyEmail || 'unknown').toLowerCase().trim(),
        status: 'Pending',
        createdAt: serverTimestamp(),
      };

      console.log("Submitting ticket with payload:", ticketPayload);

      const docRef = await addDoc(collection(db, "tickets"), ticketPayload);
      console.log("Ticket submitted successfully with ID:", docRef.id);
      
      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'ticket_created',
          title: 'New Ticket Logged',
          description: `Client ${user?.displayName || user?.email} logged a new ticket: ${ticketData.subject}`,
          userId: user?.uid || auth.currentUser?.uid,
          userName: user?.displayName || user?.email,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }
      
      addNotification({
        type: 'success',
        title: 'Ticket Submitted',
        message: 'Ticket submitted successfully!'
      });

      // Notify Admins
      notifyAdmins({
        type: 'ticket',
        title: 'New Ticket Created',
        message: `Client ${user?.displayName || user?.email} created a new ticket: ${ticketPayload.subject}`,
        link: `/admin?ticket=${docRef.id}`
      });
      
      // Reset form and navigate
      setSubmittedTicketId(docRef.id);
      setShowSubmissionSuccess(true);
      
      // Reset data
      setTicketData({
        serviceType: 'On-Demand Dispatch',
        estimatedDuration: '',
        priority: 'Medium',
        subject: '',
        description: '',
        country: '',
        city: '',
        location: '',
        contactEmail: user?.email || '',
        contactPhone: '',
        dateTime: '',
        ticketNumber: '',
        specialInstructions: '',
        attachments: []
      });
    } catch (error) {
      console.error("Error submitting ticket:", error);
      addNotification({
        type: 'error',
        title: 'Submission Failed',
        message: error instanceof Error ? error.message : 'Failed to submit ticket'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptQuote = async (ticketId: string) => {
    try {
      const isEngineerAssigned = !!selectedTicket?.engineerName;
      
      await updateDoc(doc(db, "tickets", ticketId), {
        "quote.status": 'Accepted',
        status: isEngineerAssigned ? 'In Progress' : 'Quote Accepted',
        updatedAt: serverTimestamp(),
        updates: [
          ...(selectedTicket?.updates || []),
          { 
            text: `Client accepted the quotation.${isEngineerAssigned ? ' Ticket moved to In Progress.' : ''}`, 
            timestamp: new Date().toISOString(), 
            author: 'Client' 
          }
        ]
      });

      // PDF Generation
      if (selectedTicket && selectedTicket.quote) {
        try {
          const poData: POData = {
            poNumber: `PO-${ticketId.substring(0, 8).toUpperCase()}`,
            quoteRef: ticketId.substring(0, 8).toUpperCase(),
            date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
            client: {
              name: user?.displayName || user?.name || 'Client',
              address: selectedTicket.location || selectedTicket.city || 'N/A'
            },
            requester: {
              company: selectedTicket.companyName || 'Desknet Client',
              contact: user?.displayName || user?.name || 'Client',
              phone: selectedTicket.contactPhone || 'N/A'
            },
            items: [],
            summary: {
              subtotal: parseFloat(selectedTicket.quote.amount) || 0,
              vat: 0,
              shipping: 0,
              total: parseFloat(selectedTicket.quote.amount) || 0,
              currency: selectedTicket.quote.currency || 'USD'
            },
            notes: selectedTicket.specialInstructions || "No additional notes."
          };

          // Add breakdown items if available
          let breakdownTotal = 0;
          if (selectedTicket.quote.firstTwoHours) {
            const price = parseFloat(selectedTicket.quote.firstTwoHours);
            poData.items.push({
              description: t.clientPortal.quotations.firstTwoHours || "First 2 Hours",
              qty: 1,
              unitPrice: price,
              total: price
            });
            breakdownTotal += price;
          }
          if (selectedTicket.quote.additionalHours) {
            const price = parseFloat(selectedTicket.quote.additionalHours);
            poData.items.push({
              description: t.clientPortal.quotations.additionalHours || "Additional Hours",
              qty: 1,
              unitPrice: price,
              total: price
            });
            breakdownTotal += price;
          }
          if (selectedTicket.quote.travelCost) {
            const price = parseFloat(selectedTicket.quote.travelCost);
            poData.items.push({
              description: t.clientPortal.quotations.travelCost || "Travel Cost",
              qty: 1,
              unitPrice: price,
              total: price
            });
            breakdownTotal += price;
          }

          const totalAmount = parseFloat(selectedTicket.quote.amount) || 0;
          const servicePrice = Math.max(0, totalAmount - breakdownTotal);

          poData.items.unshift({
            description: `${t.clientPortal.quotations.quoteDescription || "Service"}: ${selectedTicket.serviceType} - ${selectedTicket.subject}`,
            qty: 1,
            unitPrice: servicePrice,
            total: servicePrice
          });

          // Fallback if no items at all
          if (poData.items.length === 0) {
            poData.items.push({
              description: `${selectedTicket.subject || 'Service'}: ${selectedTicket.serviceType || 'IT Support'}`,
              qty: 1,
              unitPrice: parseFloat(selectedTicket.quote.amount) || 0,
              total: parseFloat(selectedTicket.quote.amount) || 0
            });
          }

          generatePOPDF(poData);
        } catch (pdfError) {
          console.error("Error generating PDF:", pdfError);
          addNotification({
            type: 'error',
            title: 'PDF Generation Failed',
            message: 'Failed to generate Purchase Order PDF.'
          });
        }
      }

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'quote_accepted',
          title: 'Quote Accepted',
          description: `Client accepted the quote for Ticket #${ticketId.substring(0, 6)}${isEngineerAssigned ? ' and moved to In Progress' : ''}`,
          userId: user?.uid || auth.currentUser?.uid,
          userName: user?.displayName || user?.email,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      addNotification({
        type: 'success',
        title: 'Quote Accepted',
        message: 'The quotation has been accepted. We will now proceed with assigning an engineer.'
      });

      // Notify Admins
      notifyAdmins({
        type: 'success',
        title: 'Quote Accepted',
        message: `Client ${user?.displayName || user?.email} accepted the quote for Ticket #${ticketId.substring(0, 6)}`,
        link: `/admin?ticket=${ticketId}`
      });

      setShowTicketReview(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error accepting quote:", error);
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to accept quotation.'
      });
    }
  };

  const handleDeclineQuote = async (ticketId: string) => {
    try {
      await updateDoc(doc(db, "tickets", ticketId), {
        "quote.status": 'Declined',
        status: 'Rejected',
        updatedAt: serverTimestamp(),
        updates: [
          ...(selectedTicket?.updates || []),
          { text: 'Client declined the quotation.', timestamp: new Date().toISOString(), author: 'Client' }
        ]
      });

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'quote_declined',
          title: 'Quote Declined',
          description: `Client declined the quote for Ticket #${ticketId.substring(0, 6)}`,
          userId: user?.uid || auth.currentUser?.uid,
          userName: user?.displayName || user?.email,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      addNotification({
        type: 'success',
        title: 'Quote Declined',
        message: 'The quotation has been declined.'
      });

      // Notify Admins
      notifyAdmins({
        type: 'error',
        title: 'Quote Declined',
        message: `Client ${user?.displayName || user?.email} declined the quote for Ticket #${ticketId.substring(0, 6)}`,
        link: `/admin?ticket=${ticketId}`
      });

      setShowTicketReview(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error declining quote:", error);
      addNotification({
        type: 'error',
        title: 'Action Failed',
        message: 'Failed to decline quotation.'
      });
    }
  };

  const handleExportTickets = (filteredTickets: any[]) => {
    if (filteredTickets.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No tickets found to export.',
        type: 'error'
      });
      return;
    }

    const reportData: TicketReportItem[] = filteredTickets.map(ticket => ({
      id: ticket.id,
      subject: ticket.subject || ticket.title || 'N/A',
      clientName: ticket.clientName || 'N/A',
      clientEmail: ticket.clientEmail || 'N/A',
      status: ticket.status || 'N/A',
      priority: ticket.priority || 'N/A',
      category: ticket.category || 'N/A',
      createdAt: ticket.createdAt?.toDate ? ticket.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
      description: ticket.description || 'N/A',
      engineerName: ticket.engineerName,
      engineerEmail: ticket.engineerEmail,
      engineerPhone: ticket.engineerPhone,
      quoteAmount: ticket.quote?.amount ? `${ticket.quote.currency === 'EUR' ? '€' : '$'}${ticket.quote.amount}` : 'N/A',
      quoteDescription: ticket.quote?.description,
      updates: ticket.updates
    }));

    generateTicketReportPDF(reportData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Service ticket report has been downloaded.',
      type: 'success'
    });
  };

  const handleExportOpportunities = () => {
    if (opportunities.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No opportunities found to export.',
        type: 'error'
      });
      return;
    }

    const reportData: OpportunityReportItem[] = opportunities.map(opp => ({
      id: opp.id,
      title: opp.title || 'N/A',
      clientName: opp.clientName || 'N/A',
      type: opp.type || 'N/A',
      location: opp.location || 'N/A',
      status: opp.status || 'N/A',
      createdAt: opp.createdAt?.toDate ? opp.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
      description: opp.description || 'N/A',
      budget: opp.budget,
      timeline: opp.timeline
    }));

    generateOpportunityReportPDF(reportData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Opportunities report has been downloaded.',
      type: 'success'
    });
  };

  const handleAddUpdate = async (ticketId: string) => {
    if (!newUpdateText.trim()) return;
    
    setIsAddingUpdate(true);
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const update = {
        text: newUpdateText,
        timestamp: new Date().toISOString(),
        author: 'Client'
      };

      await updateDoc(ticketRef, {
        updates: [
          ...(selectedTicket?.updates || []),
          update
        ],
        updatedAt: serverTimestamp()
      });

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'ticket_update',
          title: 'Ticket Updated by Client',
          description: `Client added an update to Ticket #${ticketId.substring(0, 6)}`,
          userId: user?.uid || auth.currentUser?.uid,
          userName: user?.displayName || user?.email,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      setNewUpdateText('');
      addNotification({
        type: 'success',
        title: 'Update Sent',
        message: 'Your update has been sent successfully.'
      });
      
      // Update local state for immediate feedback
      setSelectedTicket((prev: any) => ({
        ...prev,
        updates: [...(prev?.updates || []), update]
      }));
    } catch (error) {
      console.error("Error adding update:", error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to send update. Please try again.'
      });
    } finally {
      setIsAddingUpdate(false);
    }
  };

  const handleConfirmCompletion = async (ticketId: string) => {
    if (!rating) return;
    setIsSubmittingRating(true);
    try {
      const updateData: any = {
        status: 'Completed',
        clientRating: rating,
        confirmedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await updateDoc(doc(db, "tickets", ticketId), updateData);

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'ticket_confirmed',
          title: 'Ticket Confirmed',
          description: `Client confirmed completion of Ticket #${ticketId.substring(0, 6)} and rated ${rating} stars`,
          userId: auth.currentUser?.uid,
          userName: user?.displayName || user?.email || 'Client',
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      // Notify admin
      try {
        await addDoc(collection(db, "notifications"), {
          type: 'ticket',
          title: 'Job Confirmed & Rated',
          message: `Client confirmed Ticket #${ticketId.substring(0, 6)} and rated ${rating} stars`,
          link: `/admin/tickets`,
          userId: 'admin_desklink',
          read: false,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "notifications");
      }

      addNotification({
        type: 'success',
        title: 'Thank you!',
        message: t.clientPortal.myTickets.status.ratingSuccess
      });

      setShowTicketReview(false);
      setRating(0);
    } catch (error) {
      console.error("Error confirming completion:", error);
      handleFirestoreError(error, OperationType.UPDATE, "tickets");
    } finally {
      setIsSubmittingRating(false);
    }
  };

  const serviceTypeLabels: Record<string, string> = {
    'On-Demand Dispatch': t.clientPortal.logTicket.options.serviceTypes.onDemand,
    'Project-Based': t.clientPortal.logTicket.options.serviceTypes.project,
    'Maintenance': t.clientPortal.logTicket.options.serviceTypes.maintenance,
    'Hourly': t.clientPortal.logTicket.options.serviceTypes.hourly,
    'Half Day': t.clientPortal.logTicket.options.serviceTypes.halfDay,
    'Full Day': t.clientPortal.logTicket.options.serviceTypes.fullDay
  };

  const priorityLabels: Record<string, string> = {
    'Low': t.clientPortal.logTicket.options.priorities.low,
    'Medium': t.clientPortal.logTicket.options.priorities.medium,
    'High': t.clientPortal.logTicket.options.priorities.high,
    'Critical (SLA)': t.clientPortal.logTicket.options.priorities.critical
  };

  const renderContent = () => {
    if (activeSubTab && activeTab !== 'home') {
      // Special case for Location sub-tab in Company Profile
      if (activeTab === 'company-profile' && activeSubTab === t.clientPortal.subItems.companyProfile.location) {
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <PremiumButton 
                variant="outline"
                size="sm"
                onClick={() => setActiveSubTab(null)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#009688] hover:border-[#009688]/30 transition-all p-0 min-w-0"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </PremiumButton>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {navigation.find(n => n.id === activeTab)?.name || activeTab}
                </div>
                <h2 className="text-2xl font-bold text-black">{activeSubTab}</h2>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.country}</label>
                  <p className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">{user?.country || 'United States'}</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.city}</label>
                  <p className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900">{user?.city || 'Silicon Valley'}</p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.location}</label>
                <p className="p-4 bg-slate-50 rounded-xl font-semibold text-slate-900 leading-relaxed">
                  {user?.location || '123 Business Avenue, Suite 500, Silicon Valley, CA 94025, United States'}
                </p>
              </div>
            </div>
          </div>
        );
      }



      // User Management Page
      if (activeTab === 'user-management') {
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{t.clientPortal.userManagement.title}</h2>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900">Active Users</h4>
                  <div className="flex gap-4 items-center">
                    {userSearch && (
                      <PremiumButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => setUserSearch('')}
                        className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        Clear
                      </PremiumButton>
                    )}
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-[#009688]/50 w-64"
                      />
                    </div>
                    <PremiumButton 
                      onClick={() => setShowAddUserModal(true)} 
                      variant="primary"
                      className="!px-4 !py-2 !text-xs !rounded-lg"
                      icon={<UserPlus className="w-4 h-4" />}
                    >
                      Add User
                    </PremiumButton>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subUsers
                    .filter(u => 
                      (u.displayName?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
                      (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())
                    )
                    .map(u => (
                    <div key={u.email} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-slate-400 shadow-sm shrink-0">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <h5 className="font-bold text-slate-900 text-sm truncate" title={u.displayName}>{u.displayName}</h5>
                          <p className="text-[10px] text-slate-400 truncate" title={u.email}>{u.email}</p>
                        </div>
                      </div>
                      <PremiumButton 
                        variant="ghost"
                        size="sm"
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all min-w-0 shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </PremiumButton>
                    </div>
                  ))}
                  {subUsers.filter(u => 
                    (u.displayName?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
                    (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())
                  ).length === 0 && (
                    <div className="col-span-full text-center py-10 text-slate-400 italic">
                      {userSearch ? 'No users matching your search.' : t.clientPortal.userManagement.noUsers}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 space-y-6">
                <h4 className="font-bold text-slate-900">Access Control</h4>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">Two-Factor Authentication</h5>
                      <p className="text-xs text-slate-500">Require 2FA for all sub-users.</p>
                    </div>
                    <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
                      <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-slate-900">IP Whitelisting</h5>
                      <p className="text-xs text-slate-500">Restrict access to specific IP ranges.</p>
                    </div>
                    <PremiumButton 
                      variant="ghost"
                      size="sm"
                      className="text-xs font-bold text-[#009688] hover:underline"
                    >
                      Configure
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      // Help & Support Sub-tabs
      if (activeTab === 'help') {
        return (
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <PremiumButton 
                variant="outline"
                size="sm"
                onClick={() => setActiveSubTab(null)}
                className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#009688] hover:border-[#009688]/30 transition-all p-0 min-w-0"
              >
                <ChevronRight className="w-5 h-5 rotate-180" />
              </PremiumButton>
              <div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                  {navigation.find(n => n.id === activeTab)?.name || activeTab}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{activeSubTab}</h2>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-8">
              {activeSubTab === t.clientPortal.subItems.help.howItWorks && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  {t.clientPortal.help.howItWorksItems.map((s: any) => (
                    <div key={s.step} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <span className="text-2xl font-black text-[#009688]/20">{s.step}</span>
                      <h5 className="font-bold text-slate-900">{s.title}</h5>
                      <p className="text-xs text-slate-500">{s.desc}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === t.clientPortal.subItems.help.faqs && (
                <div className="space-y-4">
                  {t.clientPortal.help.faqItems.map((faq: any, i: number) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                      <h5 className="font-bold text-slate-900 flex items-center gap-2">
                        <HelpCircle className="w-4 h-4 text-[#009688]" />
                        {faq.q}
                      </h5>
                      <p className="text-sm text-slate-600 pl-6">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeSubTab === t.clientPortal.subItems.help.contact && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-[#009688] text-white rounded-2xl space-y-4">
                    <h4 className="font-bold text-lg">{t.clientPortal.help.supportCenter}</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-white/60" />
                        <span className="font-bold">support@desklink.com</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <Phone className="w-5 h-5 text-white/60" />
                        <span className="font-bold">+1 (800) 123-4567</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 bg-slate-900 text-white rounded-2xl space-y-4">
                    <h4 className="font-bold text-lg">{t.clientPortal.help.accountManager}</h4>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <h5 className="font-bold">{t.clientPortal.help.managerName}</h5>
                        <p className="text-xs text-slate-400">{t.clientPortal.help.managerRole}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSubTab === t.clientPortal.subItems.help.guidelines && (
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <h4 className="font-bold text-slate-900">Portal Usage Guidelines</h4>
                  <ul className="text-sm text-slate-600 space-y-3 list-disc pl-5">
                    <li>Always provide clear site access instructions for engineers.</li>
                    <li>Ensure a local site contact is available and reachable.</li>
                    <li>Upload relevant site documentation to the ticket.</li>
                    <li>Review and approve billing advice within 5 business days.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        );
      }

    }

    const serviceTypeLabels: Record<string, string> = {
      'On-Demand Dispatch': t.clientPortal.logTicket.options.serviceTypes.onDemand,
      'Project-Based': t.clientPortal.logTicket.options.serviceTypes.project,
      'Maintenance': t.clientPortal.logTicket.options.serviceTypes.maintenance,
      'Hourly': t.clientPortal.logTicket.options.serviceTypes.hourly,
      'Half Day': t.clientPortal.logTicket.options.serviceTypes.halfDay,
      'Full Day': t.clientPortal.logTicket.options.serviceTypes.fullDay
    };

    const formatDateTime = (dateTimeStr: string) => {
      if (!dateTimeStr) return '';
      try {
        const date = new Date(dateTimeStr);
        return new Intl.DateTimeFormat(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }).format(date);
      } catch (e) {
        return dateTimeStr;
      }
    };

    const priorityLabels: Record<string, string> = {
      'Low': t.clientPortal.logTicket.options.priorities.low,
      'Medium': t.clientPortal.logTicket.options.priorities.medium,
      'High': t.clientPortal.logTicket.options.priorities.high,
      'Critical (SLA)': t.clientPortal.logTicket.options.priorities.critical
    };

    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-5">
                <div className="w-14 h-14 bg-brand-teal rounded-2xl flex items-center justify-center text-brand-dark shadow-lg shadow-brand-teal/20">
                  <Home className="w-7 h-7" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mb-1">{t.clientPortal.welcome}, {user?.name || t.clientPortal.guest}</h1>
                  <p className="text-slate-500 font-medium">{t.clientPortal.subtitle}</p>
                </div>
              </div>
              <PremiumButton 
                variant="primary"
                onClick={() => setActiveTab('log-ticket')}
                className="px-4 sm:px-8 py-3 sm:py-4 bg-brand-teal text-brand-dark text-sm sm:text-base font-black rounded-2xl hover:bg-teal-300 transition-all shadow-lg shadow-brand-teal/20 flex items-center gap-2 group"
                icon={<PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />}
              >
                {t.clientPortal.logTicket.title}
              </PremiumButton>
            </div>

            {/* Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-brand-teal/10 rounded-2xl flex items-center justify-center text-brand-teal group-hover:bg-brand-teal group-hover:text-brand-dark transition-all duration-500">
                        <Ticket className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t.clientPortal.stats.activeTickets}</span>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{tickets.filter(t => t.status !== 'Completed' && t.status !== 'Resolved').length}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-500 bg-emerald-50 w-fit px-3 py-1.5 rounded-full">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{t.clientPortal.stats.activeTicketsDesc}</span>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
                        <Users className="w-7 h-7" />
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t.clientPortal.stats.teamMembers}</span>
                        <div className="text-4xl font-black text-slate-900 tracking-tighter">{subUsers.length + 1}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-blue-500 bg-blue-50 w-fit px-3 py-1.5 rounded-full">
                      <Shield className="w-3.5 h-3.5" />
                      <span>{t.clientPortal.stats.teamMembersDesc}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Tickets */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                    <h3 className="text-xl font-black text-slate-900">{t.clientPortal.myTickets.title}</h3>
                    <PremiumButton 
                      onClick={() => setActiveTab('my-tickets')} 
                      variant="ghost"
                      className="!text-brand-teal !text-sm !font-bold hover:underline !p-0"
                    >
                      View All
                    </PremiumButton>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {tickets.slice(0, 5).map((ticket, i) => (
                      <div key={ticket.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer gap-4" onClick={() => { setSelectedTicket(ticket); setActiveTab('my-tickets'); }}>
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                            ticket.priority === 'High' ? 'bg-rose-50 text-rose-500' : 
                            ticket.priority === 'Medium' ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500'
                          }`}>
                            {ticket.priority.charAt(0)}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 group-hover:text-brand-teal transition-colors truncate" title={ticket.subject || ticket.title}>{ticket.subject || ticket.title}</p>
                            <p className="text-xs text-slate-500 truncate">#{ticket.id.slice(0, 6).toUpperCase()} • {ticket.status}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 transition-all shrink-0" />
                      </div>
                    ))}
                    {tickets.length === 0 && <p className="text-center text-slate-400 py-12">No tickets found</p>}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900">Live Activity</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Live</span>
                    </div>
                  </div>
                  <div id="activity-feed-container">
                    <ActivityFeed userId={user?.uid} role="client" />
                  </div>
                </div>

                <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/10 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150" />
                  <h3 className="text-lg font-black mb-2 relative z-10">Network Health</h3>
                  <p className="text-xs text-slate-400 mb-6 relative z-10">Connected to Desknet Global. Latency: 18ms</p>
                  <div className="space-y-4 relative z-10">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} className="h-full bg-brand-teal" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-white/40">
                      <span>Status</span>
                      <span className="text-brand-teal">Optimal</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'log-ticket':
        const steps = [
          { id: 1, name: t.clientPortal.logTicket.steps.service, icon: Zap },
          { id: 2, name: t.clientPortal.logTicket.steps.location, icon: MapPin },
          { id: 3, name: t.clientPortal.logTicket.steps.contact, icon: Mail },
          { id: 4, name: t.clientPortal.logTicket.steps.details, icon: FileText },
          { id: 5, name: t.clientPortal.logTicket.steps.review, icon: CheckCircle },
        ];

        const countries = Country.getAllCountries().map(c => ({ value: c.isoCode, label: c.name }));
        const cities = ticketData.country 
          ? (() => {
              const allCities = City.getCitiesOfCountry(ticketData.country) || [];
              const uniqueCityNames = Array.from(new Set(allCities.map(city => city.name)));
              return uniqueCityNames.map(name => ({ value: name, label: name }));
            })()
          : [];

        const isStepValid = () => {
          switch (currentStep) {
            case 1: return ticketData.serviceType && ticketData.priority;
            case 2: return ticketData.country && ticketData.city;
            case 3: return ticketData.contactEmail;
            case 4: return ticketData.subject && ticketData.description;
            default: return true;
          }
        };

        if (showSubmissionSuccess) {
          return (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-slate-200 p-8 shadow-sm"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-8">
                <CheckCircle className="w-12 h-12 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-4">Ticket Submitted!</h3>
              <p className="text-slate-500 max-w-md mb-10">
                Your service request has been successfully logged. Our team will review it and assign an engineer shortly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <PremiumButton 
                  variant="primary"
                  onClick={() => {
                    setShowSubmissionSuccess(false);
                    setActiveTab('my-tickets');
                    setActiveSubTab(null);
                  }}
                  className="px-8 py-4 bg-[#009688] text-white font-black rounded-2xl uppercase tracking-widest hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20"
                >
                  View My Tickets
                </PremiumButton>
                <PremiumButton 
                  variant="outline"
                  onClick={() => {
                    setShowSubmissionSuccess(false);
                    setCurrentStep(1);
                  }}
                  className="px-8 py-4 bg-slate-100 text-slate-600 font-black rounded-2xl uppercase tracking-widest hover:bg-slate-200 transition-all"
                >
                  Log Another Ticket
                </PremiumButton>
              </div>
            </motion.div>
          );
        }

        return (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <h2 className="text-2xl font-bold text-black">{t.clientPortal.logTicket.title}</h2>
              <div className="flex items-center gap-1 md:gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
                {steps.map((step, idx) => (
                  <React.Fragment key={step.id}>
                    <div className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-[10px] md:text-xs font-bold transition-all ${
                        currentStep === step.id ? 'bg-[#009688] text-white shadow-lg shadow-[#009688]/20' :
                        currentStep > step.id ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {currentStep > step.id ? <CheckCircle className="w-3 h-3 md:w-4 md:h-4" /> : step.id}
                      </div>
                      <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-tighter ${currentStep === step.id ? 'text-[#009688]' : 'text-slate-400'}`}>
                        {step.name}
                      </span>
                    </div>
                    {idx < steps.length - 1 && (
                      <div className={`w-4 md:w-8 h-[2px] mb-4 shrink-0 ${currentStep > step.id ? 'bg-emerald-100' : 'bg-slate-100'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  {currentStep === 1 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.serviceType}</label>
                        <CustomDropdown 
                          value={ticketData.serviceType}
                          onChange={(val) => setTicketData({...ticketData, serviceType: val})}
                          options={[
                            { value: 'On-Demand Dispatch', label: t.clientPortal.logTicket.options.serviceTypes.onDemand },
                            { value: 'Project-Based', label: t.clientPortal.logTicket.options.serviceTypes.project },
                            { value: 'Maintenance', label: t.clientPortal.logTicket.options.serviceTypes.maintenance },
                            { value: 'Hourly', label: t.clientPortal.logTicket.options.serviceTypes.hourly },
                            { value: 'Half Day', label: t.clientPortal.logTicket.options.serviceTypes.halfDay },
                            { value: 'Full Day', label: t.clientPortal.logTicket.options.serviceTypes.fullDay }
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.priority}</label>
                        <CustomDropdown 
                          value={ticketData.priority}
                          onChange={(val) => setTicketData({...ticketData, priority: val})}
                          options={[
                            { value: 'Low', label: t.clientPortal.logTicket.options.priorities.low },
                            { value: 'Medium', label: t.clientPortal.logTicket.options.priorities.medium },
                            { value: 'High', label: t.clientPortal.logTicket.options.priorities.high },
                            { value: 'Critical (SLA)', label: t.clientPortal.logTicket.options.priorities.critical }
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.estimatedDuration}</label>
                        <div className="relative">
                          <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            name="estimatedDuration"
                            value={ticketData.estimatedDuration}
                            onChange={handleTicketInputChange}
                            placeholder={t.clientPortal.logTicket.placeholders.estimatedDuration} 
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.country}</label>
                        <Select
                          options={countries}
                          value={countries.find(c => c.value === ticketData.country)}
                          onChange={(val: any) => setTicketData({...ticketData, country: val?.value || '', city: ''})}
                          placeholder={t.clientPortal.logTicket.placeholders.country}
                          styles={customSelectStyles}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.city}</label>
                        <Select
                          options={cities}
                          value={cities.find(c => c.value === ticketData.city)}
                          onChange={(val: any) => setTicketData({...ticketData, city: val?.value || ''})}
                          placeholder={t.clientPortal.logTicket.placeholders.city}
                          isDisabled={!ticketData.country}
                          styles={customSelectStyles}
                        />
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.location}</label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            value={ticketData.location}
                            onChange={(e) => setTicketData({...ticketData, location: e.target.value})}
                            placeholder={t.clientPortal.logTicket.placeholders.location} 
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.contactEmail}</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="email" 
                            value={ticketData.contactEmail}
                            onChange={(e) => setTicketData({...ticketData, contactEmail: e.target.value})}
                            placeholder={t.clientPortal.logTicket.placeholders.contactEmail} 
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.contactPhone}</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="tel" 
                            name="contactPhone"
                            value={ticketData.contactPhone}
                            onChange={handleTicketInputChange}
                            placeholder={t.clientPortal.logTicket.placeholders.contactPhone} 
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                            required
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.ticketNumber}</label>
                          <div className="relative">
                            <Ticket className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="text" 
                              name="ticketNumber"
                              value={ticketData.ticketNumber}
                              onChange={handleTicketInputChange}
                              placeholder={t.clientPortal.logTicket.placeholders.ticketNumber} 
                              className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.dateTime}</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input 
                              type="datetime-local" 
                              value={ticketData.dateTime}
                              onChange={(e) => setTicketData({...ticketData, dateTime: e.target.value})}
                              className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.subject}</label>
                        <div className="relative">
                          <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <input 
                            type="text" 
                            name="subject"
                            value={ticketData.subject}
                            onChange={handleTicketInputChange}
                            placeholder={t.clientPortal.logTicket.placeholders.subject} 
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.description}</label>
                        <div className="relative">
                          <MessageSquare className="absolute left-4 top-5 w-4 h-4 text-slate-400" />
                          <textarea 
                            rows={4} 
                            value={ticketData.description}
                            onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all resize-none" 
                            placeholder={t.clientPortal.logTicket.placeholders.description}
                            required
                          ></textarea>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">{t.clientPortal.logTicket.specialInstructions}</label>
                        <div className="relative">
                          <Wrench className="absolute left-4 top-5 w-4 h-4 text-slate-400" />
                          <textarea 
                            rows={3} 
                            name="specialInstructions"
                            value={ticketData.specialInstructions}
                            onChange={handleTicketInputChange}
                            className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all resize-none" 
                            placeholder={t.clientPortal.logTicket.placeholders.specialInstructions}
                          ></textarea>
                        </div>
                      </div>

                      <FileUpload 
                        label="Attachments (Photos/Documents)"
                        existingFiles={ticketData.attachments}
                        onFilesSelected={(newFiles) => setTicketData(prev => ({
                          ...prev,
                          attachments: [...prev.attachments, ...newFiles]
                        }))}
                        onRemoveFile={(idx) => setTicketData(prev => ({
                          ...prev,
                          attachments: prev.attachments.filter((_, i) => i !== idx)
                        }))}
                      />
                    </div>
                  )}

                  {currentStep >= 5 && (
                    <div className="space-y-6">
                      <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.serviceType}</p>
                            <p className="font-semibold text-slate-900">{serviceTypeLabels[ticketData.serviceType] || ticketData.serviceType}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.priority}</p>
                            <p className="font-semibold text-slate-900">{priorityLabels[ticketData.priority] || ticketData.priority}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.estimatedDuration}</p>
                            <p className="font-semibold text-slate-900">{ticketData.estimatedDuration}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.country}</p>
                            <p className="font-semibold text-slate-900">{countries.find(c => c.value === ticketData.country)?.label || ticketData.country}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.city}</p>
                            <p className="font-semibold text-slate-900">{ticketData.city}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.ticketNumber}</p>
                            <p className="font-semibold text-slate-900">{ticketData.ticketNumber}</p>
                          </div>
                        </div>
                        {ticketData.specialInstructions && (
                          <div className="pt-4 border-t border-slate-200">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.specialInstructions}</p>
                            <p className="text-sm text-slate-700 whitespace-pre-wrap">{ticketData.specialInstructions}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.contactEmail}</p>
                            <p className="font-semibold text-slate-900">{ticketData.contactEmail}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.contactPhone}</p>
                            <p className="font-semibold text-slate-900">{ticketData.contactPhone}</p>
                          </div>
                        </div>
                        <div className="pt-4 border-t border-slate-200">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.subject}</p>
                          <p className="font-semibold text-slate-900">{ticketData.subject}</p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.description}</p>
                          <p className="text-sm text-slate-600 leading-relaxed">{ticketData.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-slate-200">
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.location}</p>
                            <p className="font-semibold text-slate-900">{ticketData.location}</p>
                          </div>
                          <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{t.clientPortal.logTicket.dateTime}</p>
                            <p className="font-semibold text-slate-900">{formatDateTime(ticketData.dateTime)}</p>
                          </div>
                        </div>
                        {ticketData.attachments.length > 0 && (
                          <div className="pt-4">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Attachments</p>
                            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                              {ticketData.attachments.map((file, idx) => (
                                <div key={idx} className="aspect-square bg-white rounded-lg border border-slate-200 overflow-hidden shadow-sm">
                                  {file.type.startsWith('image/') ? (
                                    <img src={file.data} className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                                      <FileText className="w-6 h-6" />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4 pt-6">
                    {currentStep > 1 && (
                      <PremiumButton 
                        onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
                        disabled={isSubmitting}
                        variant="secondary"
                        className="flex-1 !py-4 !rounded-xl !text-slate-600"
                      >
                        {t.clientPortal.common.back}
                      </PremiumButton>
                    )}
                    {currentStep < 5 ? (
                      <PremiumButton 
                        onClick={() => setCurrentStep(prev => Math.min(prev + 1, 5))}
                        disabled={!isStepValid()}
                        variant="primary"
                        glow
                        className="flex-1 !py-4 !rounded-xl shadow-lg shadow-[#009688]/20"
                      >
                        {t.signup.continue}
                      </PremiumButton>
                    ) : (
                      <PremiumButton 
                        onClick={handleTicketSubmit}
                        disabled={isSubmitting}
                        variant="primary"
                        glow
                        className="flex-1 !py-4 !rounded-xl shadow-lg shadow-[#009688]/20"
                        icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      >
                        {isSubmitting ? t.clientPortal.logTicket.submitting : t.clientPortal.logTicket.confirm}
                      </PremiumButton>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        );
      case 'my-tickets':
        return (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-2xl font-bold text-black">{t.clientPortal.myTickets.title}</h2>
              <div className="flex flex-wrap items-center gap-3">
                {(ticketSearch || statusFilter !== 'All' || priorityFilter !== 'All' || categoryFilter !== 'All' || dateFilter !== 'All') && (
                  <PremiumButton 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setTicketSearch('');
                      setStatusFilter('All');
                      setPriorityFilter('All');
                      setCategoryFilter('All');
                      setDateFilter('All');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Clear Filters
                  </PremiumButton>
                )}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={t.clientPortal.myTickets.filters.search}
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#009688]/50 w-full md:w-64 shadow-sm"
                  />
                </div>
                <div className="w-40">
                  <CustomDropdown
                    options={[
                      { value: 'All', label: 'All Time' },
                      { value: 'Today', label: 'Today' },
                      { value: 'This Week', label: 'This Week' },
                      { value: 'This Month', label: 'This Month' }
                    ]}
                    value={dateFilter}
                    onChange={setDateFilter}
                    placeholder="Date Range"
                  />
                </div>
                <PremiumButton 
                  variant={showFilters ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`p-2 rounded-xl border transition-all min-w-0 w-10 h-10 ${showFilters ? 'bg-[#009688] text-white border-[#009688]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'}`}
                >
                  <Filter className="w-5 h-5" />
                </PremiumButton>
                <PremiumButton 
                  onClick={() => handleExportTickets(filteredTickets)}
                  variant="ghost"
                  className="!text-[#009688] !font-bold !text-sm !px-3 !py-1 !rounded-lg"
                  icon={<FileText className="w-4 h-4" />}
                >
                  Export Report
                </PremiumButton>
              </div>
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.myTickets.filters.status}</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Open', 'In Progress', 'Resolved', 'Completed'].map(status => (
                          <PremiumButton
                            key={status}
                            variant={statusFilter === status ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              statusFilter === status 
                                ? 'bg-[#009688] text-white' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {status === 'All' ? t.clientPortal.myTickets.filters.all : 
                             status === 'Open' ? t.clientPortal.myTickets.status.open :
                             status === 'In Progress' ? t.clientPortal.myTickets.status.inProgress :
                             status === 'Resolved' ? t.clientPortal.myTickets.status.resolved :
                             t.clientPortal.myTickets.status.completed}
                          </PremiumButton>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.myTickets.filters.priority}</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Low', 'Medium', 'High', 'Critical'].map(priority => (
                          <PremiumButton
                            key={priority}
                            variant={priorityFilter === priority ? "primary" : "ghost"}
                            size="sm"
                            onClick={() => setPriorityFilter(priority)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              priorityFilter === priority 
                                ? 'bg-[#009688] text-white' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {priority === 'All' ? t.clientPortal.myTickets.filters.all : priority}
                          </PremiumButton>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Category</label>
                      <div className="flex flex-wrap gap-2">
                        {['All', 'Hardware', 'Software', 'Network', 'Security', 'Other'].map(cat => (
                          <button
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                              categoryFilter === cat 
                                ? 'bg-[#009688] text-white' 
                                : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.id}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.subject}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.type}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.priority}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.status}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.engineer}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.date}</th>
                      <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider">{t.clientPortal.myTickets.table.actions || 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredTickets.map((ticket) => (
                      <tr 
                        key={ticket.id} 
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTicketReview(true);
                        }}
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        <td className="p-3 font-bold text-slate-700 text-sm">#{ticket.id.slice(0, 5).toUpperCase()}</td>
                        <td className="p-3">
                          <div className={`font-semibold transition-all duration-500 truncate max-w-[250px] ${ticket.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`} title={ticket.subject || ticket.title}>
                            {ticket.subject || ticket.title}
                          </div>
                          <div className="text-xs text-slate-400 truncate max-w-[250px]" title={ticket.description}>{ticket.description}</div>
                        </td>
                        <td className="p-3 text-xs font-medium text-slate-600">{ticket.serviceType || 'N/A'}</td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            ticket.priority === 'Critical' ? 'bg-red-100 text-red-700' :
                            ticket.priority === 'High' ? 'bg-orange-100 text-orange-700' :
                            ticket.priority === 'Medium' ? 'bg-blue-100 text-blue-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.priority}
                          </span>
                        </td>
                        <td className="p-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            ticket.status === 'Completed' || ticket.status === 'Resolved' ? 'bg-emerald-100 text-emerald-700' :
                            ticket.status === 'On Site' ? 'bg-amber-100 text-amber-700' :
                            ticket.status === 'Waiting for Confirmation' ? 'bg-brand-teal/10 text-brand-teal' :
                            ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                            ticket.status === 'Assigned' ? 'bg-indigo-100 text-indigo-700' :
                            ticket.status === 'Quote Accepted' ? 'bg-emerald-50 text-emerald-600' :
                            ticket.status === 'Quoted' || ticket.status === 'Waiting for client approval' ? 'bg-purple-100 text-purple-700' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {ticket.status === 'Completed' ? t.clientPortal.myTickets.status.completed : 
                             ticket.status === 'Resolved' ? t.clientPortal.myTickets.status.resolved :
                             ticket.status === 'Waiting for Confirmation' ? t.clientPortal.myTickets.status.waitingForConfirmation :
                             ticket.status === 'On Site' ? t.clientPortal.myTickets.status.onSite :
                             ticket.status === 'Assigned' ? t.clientPortal.myTickets.status.assigned :
                             ticket.status === 'Quote Accepted' ? t.clientPortal.myTickets.status.quoteAccepted :
                             ticket.status === 'Quoted' || ticket.status === 'Waiting for client approval' ? 'Waiting for Approval' :
                             ticket.status === 'In Progress' ? t.clientPortal.myTickets.status.inProgress :
                             t.clientPortal.myTickets.status.open}
                          </span>
                        </td>
                        <td className="p-3 text-slate-600 text-sm">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
                              {ticket.engineerName?.charAt(0) || 'U'}
                            </div>
                            <span className="truncate max-w-[120px]" title={ticket.engineerName || 'Unassigned'}>{ticket.engineerName || 'Unassigned'}</span>
                          </div>
                        </td>
                        <td className="p-3 text-slate-500 text-sm">
                          {ticket.createdAt ? (
                            typeof ticket.createdAt === 'string' 
                              ? new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                              : ticket.createdAt.seconds 
                                ? new Date(ticket.createdAt.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                                : 'N/A'
                          ) : 'N/A'}
                        </td>
                        <td className="p-3">
                          <PremiumButton 
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTicket(ticket);
                              setShowTicketReview(true);
                            }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 text-slate-600 hover:bg-brand-teal hover:text-slate-900 rounded-lg text-xs font-bold transition-all border border-slate-100"
                            icon={<Eye className="w-3.5 h-3.5" />}
                          >
                            {t.clientPortal.myTickets.table.seeMore || 'See More'}
                          </PremiumButton>
                        </td>
                      </tr>
                    ))}
                    {filteredTickets.length === 0 && (
                      <tr>
                        <td colSpan={8} className="p-12 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-400">
                            <Ticket className="w-12 h-12 mb-4 opacity-20" />
                            <p className="font-medium">{t.clientPortal.common.noData}</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'services':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-black">{t.clientPortal.nav.services}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { ...t.clientPortal.services.itManagement, icon: Monitor },
                { ...t.clientPortal.services.infrastructure, icon: Building2 },
                { ...t.clientPortal.services.support, icon: Headphones },
                { ...t.clientPortal.services.maintenance, icon: Wrench },
                { ...t.clientPortal.services.asset, icon: Trash },
              ].map((service) => (
                <div key={service.title} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                  <div className="w-12 h-12 bg-[#009688]/10 rounded-xl flex items-center justify-center text-[#009688] mb-4">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{service.title}</h3>
                  <p className="text-sm text-slate-500 mb-4">{service.desc}</p>
                  <div className="text-lg font-black text-[#009688]">{service.price}</div>
                </div>
              ))}
            </div>
            <div className="bg-[#1E293B] text-white p-0 rounded-3xl overflow-hidden relative group/map">
              <div className="absolute top-12 left-12 z-10 pointer-events-none">
                <div className="flex flex-col gap-1">
                  <h3 className="text-3xl md:text-5xl font-black tracking-tighter text-white drop-shadow-2xl">
                    We serve in <span className="text-brand-teal">92+</span> countries
                  </h3>
                  <div className="h-1.5 w-24 bg-brand-teal rounded-full" />
                </div>
              </div>
              <div className="w-full min-h-[500px] md:min-h-[700px]">
                <WorldMap hideTitle />
              </div>
            </div>
          </div>
        );
      case 'opportunities':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">{t.clientPortal.nav.opportunities}</h2>
              <div className="flex items-center gap-3">
                <PremiumButton 
                  onClick={handleExportOpportunities}
                  variant="ghost"
                  className="!text-brand-teal !font-bold !text-[10px] !px-4 !py-2 !rounded-xl"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Export Report
                </PremiumButton>
                <PremiumButton 
                  variant="primary"
                  size="sm"
                  onClick={() => setShowCreateOppModal(true)}
                  className="px-4 py-2 bg-[#009688] text-white text-xs font-bold rounded-lg hover:bg-[#00796B] transition-all flex items-center gap-2"
                  icon={<Plus className="w-4 h-4" />}
                >
                  Create New
                </PremiumButton>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
                  <h4 className="font-bold text-slate-900 mb-4">Active Opportunities</h4>
                  <div className="space-y-3">
                    {opportunities.length > 0 ? (
                      opportunities.map(opp => (
                        <div 
                          key={opp.id} 
                          onClick={() => {
                            setSelectedOpportunity(opp);
                            setShowOpportunityModal(true);
                          }}
                          className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between hover:border-[#009688]/30 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-[#009688] shadow-sm shrink-0">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h5 className="font-bold text-slate-900 truncate" title={opp.title}>{opp.title}</h5>
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider truncate">
                                {opp.type} • {opp.location || 'Remote'} • {opp.createdAt?.toDate ? opp.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                              opp.status === 'Under Review' ? 'bg-blue-100 text-blue-700' :
                              opp.status === 'Active' ? 'bg-emerald-100 text-emerald-700' :
                              'bg-slate-100 text-slate-500'
                            }`}>
                              {opp.status}
                            </span>
                            <div className="relative">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenMenuId(openMenuId === opp.id ? null : opp.id);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                              >
                                <MoreVertical className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {openMenuId === opp.id && (
                                  <>
                                    <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                    >
                                      <button 
                                        onClick={() => {
                                          setSelectedOpportunity(opp);
                                          setShowOpportunityModal(true);
                                          setOpenMenuId(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                      >
                                        <Eye className="w-4 h-4" />
                                        View Details
                                      </button>
                                      <button 
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          if (window.confirm('Are you sure you want to delete this opportunity?')) {
                                            try {
                                              await deleteDoc(doc(db, "opportunities", opp.id));
                                              setOpenMenuId(null);
                                              addNotification({
                                                type: 'success',
                                                title: 'Opportunity Deleted',
                                                message: 'The opportunity has been removed.'
                                              });
                                            } catch (err) {
                                              handleFirestoreError(err, OperationType.DELETE, `opportunities/${opp.id}`);
                                            }
                                          }
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                      >
                                        <Trash className="w-4 h-4" />
                                        Delete
                                      </button>
                                    </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Briefcase className="w-8 h-8 text-slate-300" />
                        </div>
                        <p className="text-slate-400 font-medium">No opportunities created yet.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <h4 className="text-sm font-bold text-slate-900 mb-6">Pipeline Overview</h4>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {opportunityStats.map(stat => (
                      <div key={stat.label} className="p-3 bg-slate-50 rounded-xl text-center">
                        <div className={`w-7 h-7 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-1 text-[10px] font-bold`}>{stat.count}</div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={opportunityChartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 8, fill: '#94a3b8' }} />
                        <Bar dataKey="value" fill="#009688" radius={[4, 4, 0, 0]} barSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'billing':
        const { currentBalance, pendingAdvice } = billingStats;

        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-semibold text-black">{t.clientPortal.billing.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t.clientPortal.billing.balance}</p>
                <div className="text-3xl font-bold text-slate-900">${currentBalance.toLocaleString()}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t.clientPortal.billing.pending}</p>
                <div className="text-3xl font-bold text-orange-500">{pendingAdvice}</div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{t.clientPortal.billing.nextBilling}</p>
                <div className="text-3xl font-bold text-slate-900">Apr 01</div>
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-semibold text-slate-900">{t.clientPortal.billing.recentInvoices}</h3>
                <PremiumButton 
                  variant="ghost"
                  size="sm"
                  className="text-[#009688] text-sm font-semibold hover:underline"
                >
                  {t.clientPortal.common.viewAll}
                </PremiumButton>
              </div>
              <div className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">INV-{inv.id.slice(0, 4).toUpperCase()}</p>
                        <p className="text-xs text-slate-400">{inv.createdAt ? (inv.createdAt.toDate ? inv.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date(inv.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })) : 'N/A'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right">
                        <p className="font-bold text-slate-900">{inv.amount}</p>
                        <span className={`text-[10px] font-bold uppercase ${inv.status === 'Paid' ? 'text-emerald-500' : 'text-red-500'}`}>
                          {inv.status}
                        </span>
                      </div>
                      <div className="relative">
                        <PremiumButton 
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenMenuId(openMenuId === inv.id ? null : inv.id);
                          }}
                          className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0 w-8 h-8"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </PremiumButton>
                        
                        <AnimatePresence>
                          {openMenuId === inv.id && (
                            <>
                              <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                              >
                                <PremiumButton 
                                  variant="ghost"
                                  size="sm"
                                  fullWidth
                                  onClick={() => {
                                    // View invoice logic
                                    setOpenMenuId(null);
                                  }}
                                  className="justify-start px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  icon={<Eye className="w-4 h-4" />}
                                >
                                  View Invoice
                                </PremiumButton>
                                {inv.status !== 'Paid' && (
                                  <PremiumButton 
                                    variant="ghost"
                                    size="sm"
                                    fullWidth
                                    onClick={() => {
                                      setSelectedInvoice(inv);
                                      setShowPaymentAdviceModal(true);
                                      setOpenMenuId(null);
                                    }}
                                    className="justify-start px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                    icon={<CreditCard className="w-4 h-4" />}
                                  >
                                    Send Payment Advice
                                  </PremiumButton>
                                )}
                              </motion.div>
                            </>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'user-management':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">{t.clientPortal.userManagement.title}</h2>
              <PremiumButton 
                variant="primary"
                size="sm"
                onClick={() => setShowAddUserModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#009688] text-white font-semibold rounded-xl hover:bg-[#00796B] transition-all"
                icon={<UserPlus className="w-4 h-4" />}
              >
                <span>{t.clientPortal.userManagement.addUser}</span>
              </PremiumButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {subUsers.map((u) => (
                <div key={u.email} className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 min-w-0">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 truncate" title={u.displayName}>{u.displayName}</h4>
                    <p className="text-xs text-slate-400 truncate" title={u.email}>{u.email}</p>
                  </div>
                  <div className="text-right flex items-center gap-3 shrink-0">
                    <div>
                      <span className="block text-xs font-bold text-slate-500 mb-1">{u.role}</span>
                      <span className={`text-[10px] font-bold uppercase ${u.status === 'Active' ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {u.status}
                      </span>
                    </div>
                    <div className="relative">
                      <PremiumButton 
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(openMenuId === u.email ? null : u.email);
                        }}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0 w-8 h-8"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </PremiumButton>
                      
                      <AnimatePresence>
                        {openMenuId === u.email && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                            >
                              <PremiumButton 
                                variant="ghost"
                                size="sm"
                                fullWidth
                                onClick={() => {
                                  // Add edit logic here if needed
                                  setOpenMenuId(null);
                                }}
                                className="justify-start px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                icon={<Edit3 className="w-4 h-4" />}
                              >
                                Edit User
                              </PremiumButton>
                              <PremiumButton 
                                variant="ghost"
                                size="sm"
                                fullWidth
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  if (window.confirm('Are you sure you want to remove this user?')) {
                                    try {
                                      await deleteDoc(doc(db, "users", u.uid));
                                      setOpenMenuId(null);
                                      addNotification({
                                        type: 'success',
                                        title: 'User Removed',
                                        message: 'The user has been removed successfully.'
                                      });
                                    } catch (err) {
                                      handleFirestoreError(err, OperationType.DELETE, `users/${u.uid}`);
                                    }
                                  }
                                }}
                                className="justify-start px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                icon={<Trash className="w-4 h-4" />}
                              >
                                Remove User
                              </PremiumButton>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              ))}
              {subUsers.length === 0 && (
                <div className="col-span-full text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-slate-400">{t.clientPortal.userManagement.noUsers}</p>
                </div>
              )}
            </div>
          </div>
        );
      case 'company-profile':
        return (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-black">{t.clientPortal.nav.companyProfile}</h2>
              <PremiumButton 
                variant={isEditingProfile ? "outline" : "primary"}
                size="md"
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  isEditingProfile 
                  ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
                  : 'bg-[#009688] text-white hover:bg-[#00796B] shadow-lg shadow-[#009688]/20'
                }`}
                icon={isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              >
                {isEditingProfile ? 'Cancel' : 'Edit Profile'}
              </PremiumButton>
            </div>

            {isEditingProfile ? (
              <form onSubmit={handleUpdateProfile} className="bg-white rounded-[2.5rem] border border-slate-200 p-10 shadow-sm space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">General Information</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Full Name</label>
                        <input 
                          type="text"
                          value={editProfileData.name}
                          onChange={(e) => setEditProfileData({...editProfileData, name: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Full Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Company Name</label>
                        <input 
                          type="text"
                          value={editProfileData.companyName}
                          onChange={(e) => setEditProfileData({...editProfileData, companyName: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Company Name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Industry</label>
                        <input 
                          type="text"
                          value={editProfileData.industry}
                          onChange={(e) => setEditProfileData({...editProfileData, industry: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Industry"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Company Size</label>
                        <input 
                          type="text"
                          value={editProfileData.companySize}
                          onChange={(e) => setEditProfileData({...editProfileData, companySize: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Company Size"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Contact & Online</h4>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Website</label>
                        <input 
                          type="text"
                          value={editProfileData.website}
                          onChange={(e) => setEditProfileData({...editProfileData, website: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Website"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 ml-1">Contact Phone</label>
                        <input 
                          type="text"
                          value={editProfileData.contactPhone}
                          onChange={(e) => setEditProfileData({...editProfileData, contactPhone: e.target.value})}
                          className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                          placeholder="Phone Number"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-6 border-t border-slate-100">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Location Details</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 ml-1">Country</label>
                      <input 
                        type="text"
                        value={editProfileData.country}
                        onChange={(e) => setEditProfileData({...editProfileData, country: e.target.value})}
                        className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-[#009688]/50 font-semibold"
                        placeholder="Country"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-4 pt-6">
                  <PremiumButton 
                    type="button"
                    onClick={() => setIsEditingProfile(false)}
                    variant="secondary"
                    className="!px-8 !py-4 !rounded-2xl !text-slate-600"
                  >
                    Cancel
                  </PremiumButton>
                  <PremiumButton 
                    type="submit"
                    variant="primary"
                    glow
                    className="!px-8 !py-4 !rounded-2xl shadow-lg shadow-[#009688]/20"
                  >
                    Save Changes
                  </PremiumButton>
                </div>
              </form>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-200 p-10 space-y-10 shadow-sm">
                <div className="flex items-center gap-8">
                  <div className="w-32 h-32 bg-slate-50 rounded-[2rem] flex items-center justify-center text-slate-200 border border-slate-100">
                    <Building2 className="w-16 h-16" />
                  </div>
                  <div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tighter mb-2">{user?.companyName || 'Global Tech Solutions'}</h3>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                        {user?.companySize || 'Enterprise'} Client
                      </span>
                      <span className="text-slate-400 text-xs font-bold">
                        {t.clientPortal.companyProfile.memberSince} {user?.createdAt?.seconds ? new Date(user.createdAt.seconds * 1000).getFullYear() : '2022'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.clientPortal.companyProfile.generalInfo}</h4>
                    <div className="space-y-4">
                      <div className="flex justify-between py-4 border-b border-slate-50 group">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.industry}</span>
                        <span className="text-sm font-black text-slate-900">{user?.industry || 'Information Technology'}</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-slate-50 group">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.employees}</span>
                        <span className="text-sm font-black text-slate-900">{user?.companySize || '500 - 1000'}</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-slate-50 group">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.website}</span>
                        <span className="text-sm font-black text-[#009688] hover:underline cursor-pointer">{user?.website || `www.${(user?.companyName || 'globaltech').toLowerCase().replace(/\s+/g, '')}.com`}</span>
                      </div>
                      <div className="flex justify-between py-4 border-b border-slate-50 group">
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.contactDetails}</span>
                        <span className="text-sm font-black text-slate-900">{user?.contactPhone || '+1 (800) 555-0199'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">{t.clientPortal.companyProfile.primaryAddress}</h4>
                    <div className="p-8 bg-slate-50 rounded-3xl space-y-6 border border-slate-100">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.clientPortal.companyProfile.country}</span>
                        <span className="text-sm font-black text-slate-900">{user?.country || 'United States'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      case 'help':
        if (activeSubTab === t.clientPortal.subItems.help.faqs) {
          return (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveSubTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-black">{t.clientPortal.help.faqs}</h2>
              </div>
              <div className="grid grid-cols-1 gap-4">
                {t.clientPortal.help.faqItems.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-bold text-lg mb-3 text-slate-900 flex items-center gap-3">
                      <div className="w-8 h-8 bg-brand-teal/10 rounded-lg flex items-center justify-center text-brand-teal text-sm">
                        Q
                      </div>
                      {item.q}
                    </h3>
                    <div className="pl-11">
                      <p className="text-slate-600 text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                        {item.a}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        }

        if (activeSubTab === t.clientPortal.subItems.help.howItWorks) {
          return (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <button onClick={() => setActiveSubTab(null)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <ArrowLeft className="w-5 h-5 text-slate-600" />
                </button>
                <h2 className="text-2xl font-bold text-black">{t.clientPortal.subItems.help.howItWorks}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {t.clientPortal.help.howItWorksItems.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-4 text-4xl font-black text-slate-50 group-hover:text-brand-teal/5 transition-colors">
                      {item.step}
                    </div>
                    <div className="relative z-10">
                      <div className="w-12 h-12 bg-brand-teal text-black rounded-xl flex items-center justify-center font-bold mb-4 shadow-lg shadow-brand-teal/20">
                        {item.step}
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-black">{t.clientPortal.help.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                <h3 className="font-bold text-lg mb-4">{t.clientPortal.help.faqs}</h3>
                <div className="space-y-4">
                  {t.clientPortal.help.faqItems.map((item, idx) => (
                    <PremiumButton 
                      key={idx} 
                      variant="ghost"
                      size="sm"
                      fullWidth
                      className="justify-between p-3 rounded-xl hover:bg-slate-50 text-left text-sm text-slate-900 transition-all border border-transparent hover:border-slate-100"
                      icon={<ChevronRight className="w-4 h-4 text-slate-300" />}
                      onClick={() => setActiveSubTab(t.clientPortal.subItems.help.faqs)}
                    >
                      <span className="text-slate-700">{item.q}</span>
                    </PremiumButton>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-[#009688] text-white p-8 rounded-2xl shadow-lg shadow-[#009688]/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
                  <h3 className="font-bold text-lg mb-2 relative z-10">{t.clientPortal.help.immediateHelp}</h3>
                  <p className="text-white/80 text-sm mb-6 relative z-10">{t.clientPortal.help.supportDesc}</p>
                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-white/60" />
                      <span className="font-bold">support@desklink.com</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-white/60" />
                      <span className="font-bold">+1 (800) 123-4567</span>
                    </div>
                    <div className="pt-4 border-t border-white/10 space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">{t.clientPortal.companyProfile.country} Support</span>
                        <span className="font-bold">Global / Multi-Country</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">{t.clientPortal.companyProfile.city} Support</span>
                        <span className="font-bold">All Major Tech Hubs</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 flex items-center gap-4 hover:shadow-md transition-shadow">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                    <MessageSquare className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.clientPortal.help.liveChat}</h4>
                    <p className="text-xs text-slate-400">{t.clientPortal.help.waitTime}</p>
                  </div>
                  <PremiumButton 
                    variant="primary"
                    size="sm"
                    className="ml-auto px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg"
                    onClick={() => setActiveTab('messages')}
                  >
                    {t.clientPortal.help.startChat}
                  </PremiumButton>
                </div>
              </div>
            </div>
          </div>
        );
      case 'messages':
        return <MessagingSystem currentUser={user} role="client" allUsers={engineers} />;
      case 'settings':
        return <SettingsView currentUser={user} role="client" />;
      case 'quotations':
        return <QuotationPortal role="client" userEmail={user?.email} userName={user?.displayName || user?.name || user?.fullName} />;
      default:
        return null;
    }
  };

  const handleViewAllActivity = () => {
    setActiveTab('home');
    setTimeout(() => {
      const element = document.getElementById('activity-feed-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const navigation = [
    { 
      id: 'home',
      name: t.clientPortal.nav.home, 
      icon: Home, 
    },
    { id: 'log-ticket', name: t.clientPortal.nav.logTicket, icon: Plus, isAction: true },
    { 
      id: 'my-tickets',
      name: t.clientPortal.nav.myTickets, 
      icon: CheckCircle, 
    },
    { 
      id: 'services',
      name: t.clientPortal.nav.services, 
      icon: Layers, 
    },
    { 
      id: 'opportunities',
      name: t.clientPortal.nav.opportunities, 
      icon: Briefcase, 
    },
    { 
      id: 'billing',
      name: t.clientPortal.nav.billing, 
      icon: CreditCard, 
    },
    { 
      id: 'quotations',
      name: t.clientPortal.nav.quotations, 
      icon: FileText, 
      badge: quotations.filter(q => q.status === 'Sent').length
    },
    { 
      id: 'user-management',
      name: t.clientPortal.nav.userManagement, 
      icon: Users, 
    },
    { 
      id: 'company-profile',
      name: t.clientPortal.nav.companyProfile, 
      icon: Building2, 
    },
    { 
      id: 'help',
      name: t.clientPortal.nav.help, 
      icon: HelpCircle, 
      subItems: [
        { name: t.clientPortal.subItems.help.howItWorks, icon: BookOpen },
        { name: t.clientPortal.subItems.help.faqs, icon: HelpCircle },
        { name: t.clientPortal.subItems.help.contact, icon: Headphones },
        { name: t.clientPortal.subItems.help.guidelines, icon: FileText },
      ]
    },
    { id: 'messages', name: t.clientPortal.nav.messages, icon: MessageSquare, badge: unreadMessagesCount },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const activeTicketsCount = tickets.filter(t => t.status !== 'Completed' && t.status !== 'Resolved').length;

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = 
        (t.subject?.toLowerCase() || '').includes(ticketSearch.toLowerCase()) ||
        (t.id?.toLowerCase() || '').includes(ticketSearch.toLowerCase()) ||
        (t.description?.toLowerCase() || '').includes(ticketSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'All' || 
                           t.status === statusFilter || 
                           (statusFilter === 'Open' && t.status === 'Pending');
      const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
      const matchesCategory = categoryFilter === 'All' || t.category === categoryFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'All') {
        const ticketDate = t.createdAt?.seconds ? new Date(t.createdAt.seconds * 1000) : new Date();
        const now = new Date();
        if (dateFilter === 'Today') {
          matchesDate = ticketDate.toDateString() === now.toDateString();
        } else if (dateFilter === 'This Week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          matchesDate = ticketDate >= weekAgo;
        } else if (dateFilter === 'This Month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          matchesDate = ticketDate >= monthAgo;
        }
      }
      
      return matchesSearch && matchesStatus && matchesPriority && matchesCategory && matchesDate;
    });
  }, [tickets, ticketSearch, statusFilter, priorityFilter, categoryFilter, dateFilter]);

  const portalCards = [
    { 
      id: 'awaiting-action',
      name: t.clientPortal.cards.awaitingAction.name, 
      desc: t.clientPortal.cards.awaitingAction.desc, 
      icon: AlertCircle, 
      color: 'text-orange-500', 
      bgColor: 'bg-orange-50',
      badge: tickets.filter(t => t.status === 'Awaiting Action').length 
    },
    { 
      id: 'updates',
      name: t.clientPortal.cards.updates.name, 
      desc: t.clientPortal.cards.updates.desc, 
      icon: Bell, 
      color: 'text-cyan-500', 
      bgColor: 'bg-cyan-50',
      badge: 0 
    },
    { 
      id: 'account-status',
      name: t.clientPortal.cards.accountStatus.name, 
      desc: t.clientPortal.cards.accountStatus.desc, 
      icon: Shield, 
      color: 'text-slate-500', 
      bgColor: 'bg-slate-50',
      badge: 0
    },
  ];

  const logoutT = t.portal.logoutConfirm || {
    title: "Confirm Logout",
    message: "Are you sure you want to log out of your account?",
    confirm: "Logout",
    cancel: "Cancel"
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans">
      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {(isSidebarOpen || !isMobile) && (
          <>
            {isMobile && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="fixed inset-0 bg-slate-900/60 md:backdrop-blur-sm backdrop-blur-none z-[55]"
              />
            )}
            <motion.aside 
              initial={isMobile ? { x: -300 } : undefined}
              animate={{ x: 0 }}
              exit={isMobile ? { x: -300 } : undefined}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`${isMobile ? 'fixed inset-y-0 left-0' : 'sticky top-0'} w-72 bg-[#0a1120] h-screen flex flex-col z-[60] shadow-2xl`}
            >
              <div className="p-8 flex items-center justify-between">
                <Logo />
                {isMobile && (
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                )}
              </div>
        <div className="flex-1 px-3 space-y-1 mt-2 overflow-y-auto custom-scrollbar">
          {navigation.map((item) => (
            <div 
              key={item.id}
              className="relative"
            >
              <button
                onClick={() => {
                  if (item.subItems && item.subItems.length > 0) {
                    setExpandedItems(prev => 
                      prev.includes(item.id) ? prev.filter(i => i !== item.id) : [...prev, item.id]
                    );
                  }
                  setActiveTab(item.id);
                  setActiveSubTab(null);
                  if (isMobile) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm transition-all group relative justify-start ${
                  activeTab === item.id 
                    ? 'bg-[#1a2233] text-white font-bold shadow-lg shadow-black/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5 font-medium'
                }`}
              >
                {activeTab === item.id && (
                  <motion.div 
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-teal rounded-r-full"
                  />
                )}
                {item.isAction ? (
                  <Plus className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                ) : (
                  <item.icon className={`w-5 h-5 shrink-0 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                )}
                <span>{item.name}</span>
                {item.id === 'messages' && unreadMessagesCount > 0 && (
                  <span className="ml-auto bg-brand-teal text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-brand-teal/20">
                    {unreadMessagesCount}
                  </span>
                )}
                {item.id !== 'messages' && item.badge !== undefined && item.badge > 0 && (
                  <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">
                    {item.badge}
                  </span>
                )}
                {item.subItems && item.subItems.length > 0 && (
                  <ChevronRight className={`ml-auto w-4 h-4 transition-transform duration-300 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-slate-300'} ${expandedItems.includes(item.id) ? 'rotate-90' : ''}`} />
                )}
              </button>

              {/* Sub-items in Sidebar (Accordion) */}
              <AnimatePresence>
                {expandedItems.includes(item.id) && item.subItems && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-1 ml-9 space-y-1 border-l border-slate-800/50">
                      {item.subItems.map((subItem, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setActiveTab(item.id);
                            setActiveSubTab(subItem.name);
                            if (isMobile) setIsSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-xs transition-all ${
                            activeSubTab === subItem.name
                              ? 'text-brand-teal font-bold bg-brand-teal/5'
                              : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                          }`}
                        >
                          {subItem.icon && <subItem.icon className="w-3.5 h-3.5" />}
                          <span>{subItem.name}</span>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all group justify-start"
          >
            <LogOut className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" />
            <span>{t.clientPortal.nav.logout}</span>
          </button>
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 ${activeTab === 'messages' ? 'h-screen overflow-visible' : 'overflow-y-auto'}`}>
        {/* Top Bar with Breadcrumbs */}
        <div className="flex items-center justify-between px-4 md:px-12 py-4 md:py-6 z-[60] gap-4 bg-white/90 backdrop-blur-xl sticky top-0 border-b border-slate-200/60 shadow-sm">
          <div className="flex items-center gap-4">
            {isMobile && (
              <PremiumButton 
                variant="outline"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 shadow-sm min-w-0 w-10 h-10 flex items-center justify-center"
                icon={<Layers className="w-6 h-6" />}
              />
            )}
            <div className="flex flex-col min-w-0">
              <div className="hidden md:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.15em] mb-1.5">
                <button 
                  onClick={() => { setActiveTab('home'); setActiveSubTab(null); }}
                  className="hover:text-brand-teal transition-colors"
                >
                  Client Portal
                </button>
                <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                <button 
                  onClick={() => setActiveSubTab(null)}
                  className={`transition-colors ${!activeSubTab ? 'text-brand-teal' : 'hover:text-brand-teal'}`}
                >
                  {navigation.find(n => n.id === activeTab)?.name || activeTab}
                </button>
                {activeSubTab && (
                  <>
                    <ChevronRight className="w-2.5 h-2.5 opacity-30" />
                    <span className="text-brand-teal">{activeSubTab}</span>
                  </>
                )}
              </div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 leading-none tracking-tight truncate">
                {activeSubTab || (navigation.find(n => n.id === activeTab)?.name + (activeTab === 'messages' && unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : '')) || activeTab}
              </h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Network Live</span>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="relative" ref={langMenuRef}>
                <PremiumButton 
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                  className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:border-brand-teal/30 transition-all shadow-sm min-w-0"
                  icon={<Globe className="w-4 h-4 text-brand-teal" />}
                >
                  <span className="hidden lg:inline">{language === 'en' ? 'English' : language === 'ru' ? 'Русский' : 'O\'zbekcha'}</span>
                  <span className="lg:hidden uppercase">{language}</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`} />
                </PremiumButton>

                <AnimatePresence>
                  {isLangMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-40 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 overflow-hidden"
                    >
                      {[
                        { code: 'en', label: 'English', flag: '🇺🇸' },
                        { code: 'ru', label: 'Русский', flag: '🇷🇺' },
                        { code: 'uz', label: 'O\'zbekcha', flag: '🇺🇿' }
                      ].map((lang) => (
                        <PremiumButton
                          key={lang.code}
                          variant="ghost"
                          size="sm"
                          fullWidth
                          onClick={() => {
                            setLanguage(lang.code as any);
                            setIsLangMenuOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold transition-all justify-start ${
                            language === lang.code 
                              ? 'bg-brand-teal/10 !text-brand-teal' 
                              : '!text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span className="text-lg">{lang.flag}</span>
                          <span>{lang.label}</span>
                        </PremiumButton>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center gap-2">
                <NotificationDropdown onViewAllActivity={handleViewAllActivity} />

                <PremiumButton 
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLogoutConfirm(true)}
                  className="w-9 h-9 sm:w-10 sm:h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shrink-0 shadow-sm min-w-0 p-0"
                  title={t.clientPortal.nav.logout}
                  icon={<LogOut className="w-5 h-5" />}
                />
              </div>
            </div>
          </div>
        </div>

        <main className={`flex-1 flex flex-col min-w-0 ${activeTab === 'messages' ? 'h-screen overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={activeTab === 'messages' ? 'w-full flex-1 flex flex-col min-h-0' : 'p-4 sm:p-6 md:p-12 pt-4 md:pt-6 max-w-[1400px] mx-auto w-full'}>
            {renderContent()}
          </div>
        </main>
      </div>

      {/* Feedback Modal */}
      <AnimatePresence>
        {showFeedbackModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFeedbackModal(false)}
              className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-black">Service Feedback</h3>
                  <PremiumButton 
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFeedbackModal(false)} 
                    className="text-slate-400 hover:text-slate-600 min-w-0 p-2"
                    icon={<X className="w-5 h-5" />}
                  />
                </div>
                <div className="space-y-6">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <PremiumButton 
                        key={star}
                        variant="ghost"
                        size="md"
                        onClick={() => setFeedback({ ...feedback, rating: star })}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all min-w-0 ${
                          feedback.rating >= star ? 'bg-amber-100 text-amber-500' : 'bg-slate-50 text-slate-300'
                        }`}
                        icon={<Zap className={`w-5 h-5 ${feedback.rating >= star ? 'fill-current' : ''}`} />}
                      />
                    ))}
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Comments</label>
                    <textarea 
                      rows={4}
                      value={feedback.comment}
                      onChange={(e) => setFeedback({ ...feedback, comment: e.target.value })}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all"
                      placeholder="Tell us about your experience..."
                    />
                  </div>
                  <PremiumButton 
                    variant="primary"
                    size="md"
                    fullWidth
                    glow
                    onClick={() => {
                      addNotification({
                        type: 'success',
                        title: 'Feedback Received',
                        message: 'Thank you for your feedback!'
                      });
                      setShowFeedbackModal(false);
                    }}
                    className="w-full py-4 bg-[#009688] text-white font-semibold rounded-xl hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20"
                  >
                    Submit Feedback
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Opportunity Detail Modal */}
      <AnimatePresence>
        {showOpportunityModal && selectedOpportunity && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowOpportunityModal(false)}
              className="absolute inset-0 bg-slate-900/60 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 bg-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Opportunity Details</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Review full project information</p>
                </div>
                <PremiumButton 
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowOpportunityModal(false)} 
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors min-w-0"
                  icon={<X className="w-6 h-6 text-slate-400" />}
                />
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <OpportunityDetailView 
                  opportunity={selectedOpportunity} 
                  t={t} 
                  language={language} 
                />
              </div>
              
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex justify-end">
                <PremiumButton 
                  variant="primary"
                  size="md"
                  onClick={() => setShowOpportunityModal(false)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Close Details
                </PremiumButton>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Create Opportunity Modal */}
      <AnimatePresence>
        {showCreateOppModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowCreateOppModal(false);
                setCurrentOppStep(1);
              }}
              className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-black">Create New Opportunity</h3>
                    <div className="flex items-center gap-2 mt-2">
                      {[1, 2, 3].map((step) => (
                        <div 
                          key={step}
                          className={`h-1.5 rounded-full transition-all duration-300 ${
                            currentOppStep >= step ? 'w-8 bg-[#009688]' : 'w-4 bg-slate-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <PremiumButton 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowCreateOppModal(false);
                      setCurrentOppStep(1);
                    }} 
                    className="text-slate-400 hover:text-slate-600 min-w-0 p-2"
                    icon={<X className="w-5 h-5" />}
                  />
                </div>

                {currentOppStep === 1 && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Opportunity Type</label>
                        <CustomDropdown 
                          value={newOpp.type}
                          onChange={(val) => setNewOpp({...newOpp, type: val})}
                          options={[
                            { value: 'Project', label: 'Project' },
                            { value: 'Maintenance', label: 'Maintenance' },
                            { value: 'Deployment', label: 'Deployment' },
                            { value: 'Consulting', label: 'Consulting' }
                          ]}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Title</label>
                        <input 
                          type="text" 
                          value={newOpp.title}
                          onChange={(e) => setNewOpp({...newOpp, title: e.target.value})}
                          placeholder="e.g. Data Center Migration" 
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                      <textarea 
                        rows={4}
                        value={newOpp.description}
                        onChange={(e) => setNewOpp({...newOpp, description: e.target.value})}
                        placeholder="Describe the opportunity details..." 
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                        required
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Country</label>
                        <Select 
                          options={countries}
                          value={countries.find(c => c.value === newOpp.country)}
                          onChange={(option: any) => setNewOpp({...newOpp, country: option.value, city: ''})}
                          styles={customSelectStyles}
                          placeholder="Select Country"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City</label>
                        <Select 
                          options={newOppCities}
                          value={newOppCities.find(c => c.value === newOpp.city)}
                          onChange={(option: any) => setNewOpp({...newOpp, city: option.value})}
                          isDisabled={!newOpp.country}
                          styles={customSelectStyles}
                          placeholder="Select City"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Budget Range</label>
                        <input 
                          type="text" 
                          value={newOpp.budget}
                          onChange={(e) => setNewOpp({...newOpp, budget: e.target.value})}
                          placeholder="e.g. $5k - $10k" 
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Timeline</label>
                        <input 
                          type="text" 
                          value={newOpp.timeline}
                          onChange={(e) => setNewOpp({...newOpp, timeline: e.target.value})}
                          placeholder="e.g. 2 weeks" 
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                        />
                      </div>
                    </div>

                    <PremiumButton 
                      variant="primary"
                      size="md"
                      fullWidth
                      glow
                      onClick={() => {
                        if (newOpp.title && newOpp.description) {
                          setCurrentOppStep(2);
                        } else {
                          addNotification({
                            type: 'error',
                            title: 'Missing Fields',
                            message: 'Please provide at least a title and description.'
                          });
                        }
                      }}
                      className="w-full py-4 bg-[#009688] text-white font-semibold rounded-xl hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20 flex items-center justify-center gap-2"
                      icon={<ChevronRight className="w-5 h-5" />}
                      iconPosition="right"
                    >
                      Next: Files & Images
                    </PremiumButton>
                  </div>
                )}

                {currentOppStep === 2 && (
                  <div className="space-y-6">
                    <FileUpload 
                      label="Attachments (Files & Images)"
                      existingFiles={newOpp.attachments}
                      onFilesSelected={(newFiles) => setNewOpp(prev => ({
                        ...prev,
                        attachments: [...prev.attachments, ...newFiles]
                      }))}
                      onRemoveFile={removeOppAttachment}
                    />

                    <div className="flex gap-4">
                      <PremiumButton 
                        variant="ghost"
                        size="md"
                        onClick={() => setCurrentOppStep(1)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                      >
                        Back
                      </PremiumButton>
                      <PremiumButton 
                        variant="primary"
                        size="md"
                        glow
                        onClick={() => setCurrentOppStep(3)}
                        className="flex-[2] py-4 bg-[#009688] text-white font-semibold rounded-xl hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20 flex items-center justify-center gap-2"
                        icon={<ChevronRight className="w-5 h-5" />}
                        iconPosition="right"
                      >
                        Next: Review
                      </PremiumButton>
                    </div>
                  </div>
                )}

                {currentOppStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 rounded-2xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</label>
                          <p className="font-bold text-slate-900">{newOpp.type}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
                          <p className="font-bold text-slate-900">{newOpp.title}</p>
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
                        <p className="text-sm text-slate-600 leading-relaxed">{newOpp.description}</p>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Location</label>
                          <p className="text-sm font-bold text-slate-900">{newOpp.location || 'Remote'}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Budget</label>
                          <p className="text-sm font-bold text-[#009688]">{newOpp.budget || 'N/A'}</p>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Timeline</label>
                          <p className="text-sm font-bold text-slate-900">{newOpp.timeline || 'N/A'}</p>
                        </div>
                      </div>
                      {newOpp.attachments.length > 0 && (
                        <div>
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Attachments</label>
                          <div className="flex flex-wrap gap-2">
                            {newOpp.attachments.map((file, idx) => (
                              <div key={idx} className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-[10px] font-bold text-slate-600 flex items-center gap-2">
                                <FileText className="w-3 h-3" />
                                {file.name}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4">
                      <PremiumButton 
                        variant="ghost"
                        size="md"
                        onClick={() => setCurrentOppStep(2)}
                        className="flex-1 py-4 bg-slate-100 text-slate-600 font-semibold rounded-xl hover:bg-slate-200 transition-all"
                      >
                        Back
                      </PremiumButton>
                      <PremiumButton 
                        variant="primary"
                        size="md"
                        glow
                        onClick={handleCreateOpportunity}
                        disabled={isSubmitting}
                        className="flex-[2] py-4 bg-[#009688] text-white font-semibold rounded-xl hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20 flex items-center justify-center gap-2"
                        icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                        iconPosition="left"
                      >
                        Submit Opportunity
                      </PremiumButton>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add User Modal */}
      <AnimatePresence>
        {showAddUserModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddUserModal(false)}
              className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-black">{t.clientPortal.addUser.title}</h3>
                  <PremiumButton 
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAddUserModal(false)} 
                    className="text-slate-400 hover:text-slate-600 min-w-0 p-2"
                    icon={<X className="w-5 h-5" />}
                  />
                </div>
                <form className="space-y-6" onSubmit={handleAddUser}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.addUser.username}</label>
                    <input 
                      type="text" 
                      name="username"
                      value={newUser.username}
                      onChange={handleNewUserInputChange}
                      placeholder={t.clientPortal.addUser.usernamePlaceholder} 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.addUser.email}</label>
                    <input 
                      type="email" 
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      placeholder={t.clientPortal.addUser.emailPlaceholder} 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.addUser.role}</label>
                    <CustomDropdown 
                      value={newUser.role}
                      onChange={(val) => setNewUser({...newUser, role: val})}
                      options={[
                        { value: 'Admin', label: t.clientPortal.addUser.roles.admin },
                        { value: 'Manager', label: t.clientPortal.addUser.roles.manager },
                        { value: 'Viewer', label: t.clientPortal.addUser.roles.viewer }
                      ]}
                      className="w-full"
                    />
                  </div>
                  <PremiumButton 
                    type="submit" 
                    variant="primary"
                    glow
                    className="w-full !py-4 !rounded-xl shadow-lg shadow-[#009688]/20"
                  >
                    {t.clientPortal.addUser.submit}
                  </PremiumButton>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title={logoutT.title}
        message={logoutT.message}
        confirmLabel={logoutT.confirm}
        cancelLabel={logoutT.cancel}
      />

      {/* Ticket Review Modal */}
      <AnimatePresence>
        {showTicketReview && selectedTicket && (
          <div className="fixed inset-0 z-[110] bg-slate-50 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full h-full bg-slate-50 overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <PremiumButton 
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTicketReview(false)} 
                      className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors min-w-0"
                      icon={<HiArrowLeft className="w-5 h-5 text-slate-600" />}
                    />
                    <h3 className="text-xl font-bold text-black">Ticket Details</h3>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold ml-10">Review your service request</p>
                </div>
                <PremiumButton 
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowTicketReview(false)} 
                  className="p-2 hover:bg-slate-100 rounded-xl transition-colors min-w-0"
                  icon={<X className="w-6 h-6 text-slate-400" />}
                />
              </div>
              <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
                <TicketDetailView ticket={selectedTicket} t={t} language={language} />
                
                <div className="mt-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                  <h4 className="font-bold text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-brand-teal" /> 
                    Send Update
                  </h4>
                  <div className="flex gap-3">
                    <textarea 
                      value={newUpdateText}
                      onChange={(e) => setNewUpdateText(e.target.value)}
                      placeholder="Type an update for the support team..."
                      className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm outline-none focus:border-brand-teal/50 transition-all resize-none"
                      rows={2}
                    />
                    <PremiumButton 
                      variant="primary"
                      size="md"
                      onClick={() => handleAddUpdate(selectedTicket.id)}
                      disabled={isAddingUpdate || !newUpdateText.trim()}
                      className="px-6 bg-brand-teal text-slate-900 rounded-2xl font-bold text-sm hover:bg-teal-300 transition-all disabled:opacity-50 shrink-0 min-w-0"
                      icon={isAddingUpdate ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    />
                  </div>
                </div>

                {(selectedTicket.status === 'Quoted' || selectedTicket.status === 'Waiting for client approval') && selectedTicket.quote && (
                  <div className="mt-8 flex gap-4 justify-end pt-8 border-t border-slate-100">
                    <PremiumButton 
                      variant="ghost"
                      size="md"
                      onClick={() => handleDeclineQuote(selectedTicket.id)}
                      className="px-8 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all"
                    >
                      {t.clientPortal.quotations.reject}
                    </PremiumButton>
                    <PremiumButton 
                      variant="primary"
                      size="md"
                      glow
                      onClick={() => handleAcceptQuote(selectedTicket.id)}
                      className="px-8 py-3 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-brand-teal/20"
                    >
                      {t.clientPortal.quotations.approve}
                    </PremiumButton>
                  </div>
                )}

                {selectedTicket.status === 'Waiting for Confirmation' && (
                  <div className="mt-8 bg-white p-8 rounded-3xl border border-brand-teal/20 shadow-xl shadow-brand-teal/5 space-y-6 text-center">
                    <div className="w-16 h-16 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-8 h-8 text-brand-teal" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900">{t.clientPortal.myTickets.status.confirmCompletion}</h4>
                      <p className="text-slate-500 mt-2">The engineer has marked this job as finished. Please confirm if everything is to your satisfaction.</p>
                    </div>
                    
                    <div className="flex flex-col items-center gap-4">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{t.clientPortal.myTickets.status.rateEngineer}</p>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setRating(star)}
                            onMouseEnter={() => setHoverRating(star)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="p-1 transition-transform hover:scale-110"
                          >
                            <Star 
                              className={`w-8 h-8 ${
                                (hoverRating || rating) >= star 
                                  ? 'fill-amber-400 text-amber-400' 
                                  : 'text-slate-200'
                              }`} 
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    <button 
                      onClick={() => handleConfirmCompletion(selectedTicket.id)}
                      disabled={!rating || isSubmittingRating}
                      className="w-full py-4 bg-brand-teal text-slate-900 font-bold rounded-2xl hover:bg-teal-400 transition-all shadow-lg shadow-brand-teal/20 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isSubmittingRating ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                      {t.clientPortal.myTickets.status.confirmCompletion}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showEngineerModal && selectedEngineer && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEngineerModal(false)}
              className="absolute inset-0 bg-slate-900/60 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 bg-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Engineer Profile</h3>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Detailed professional information</p>
                </div>
                <button onClick={() => setShowEngineerModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                {/* Profile Hero */}
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="w-32 h-32 bg-white border border-slate-200 rounded-3xl flex items-center justify-center overflow-hidden shrink-0">
                    {selectedEngineer.photoURL || selectedEngineer.profilePic ? (
                      <img 
                        src={selectedEngineer.photoURL || selectedEngineer.profilePic} 
                        alt="Profile" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer" 
                      />
                    ) : (
                      <User className="w-12 h-12 text-slate-200" />
                    )}
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">{selectedEngineer.displayName || selectedEngineer.fullName}</h2>
                    <p className="text-brand-teal font-bold mb-4">{selectedEngineer.specialization?.label || selectedEngineer.specialization || 'IT Professional'}</p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{selectedEngineer.city?.label || selectedEngineer.city}, {selectedEngineer.country?.label || selectedEngineer.country}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{selectedEngineer.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{selectedEngineer.phoneCountryCode?.value} {selectedEngineer.phoneNumber}</span>
                      </div>
                      {selectedEngineer.whatsappNumber && (
                        <div className="flex items-center gap-2">
                          <MessageCircle className="w-4 h-4 text-emerald-500" />
                          <span>{selectedEngineer.whatsappCountryCode?.value} {selectedEngineer.whatsappNumber} (WhatsApp)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
                  {[
                    { label: 'Hourly Rate', value: `$${selectedEngineer.hourlyRate || '0'}/hr`, icon: CreditCard },
                    { label: 'Half-day Rate', value: `$${selectedEngineer.halfDayRate || '0'}/4h`, icon: CreditCard },
                    { label: 'Full-day Rate', value: `$${selectedEngineer.fullDayRate || '0'}/8h`, icon: CreditCard },
                    { label: 'Experience', value: `${selectedEngineer.experience || '0'}+ Years`, icon: Clock },
                    { label: 'Status', value: selectedEngineer.status || 'Active', icon: CheckCircle },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                      <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center">
                        <stat.icon className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">{stat.label}</div>
                        <div className="text-lg font-bold text-slate-900">{stat.value}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills & Languages */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Code className="w-5 h-5 text-brand-teal" /> Technical Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {Array.isArray(selectedEngineer.skills) ? (
                        selectedEngineer.skills.map((skill: any, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600">
                            {skill.label || skill}
                          </span>
                        ))
                      ) : (
                        (selectedEngineer.skills || '').split(',').map((skill: string, i: number) => (
                          <span key={i} className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-sm text-slate-600">
                            {skill.trim()}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Globe className="w-5 h-5 text-brand-teal" /> Languages
                    </h4>
                    <div className="space-y-2">
                      {(selectedEngineer.languages || []).map((lang: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                          <span className="font-bold text-slate-700">{lang.name}</span>
                          <span className="text-[10px] px-2 py-1 bg-brand-teal/10 text-brand-teal rounded-md font-bold uppercase">
                            {lang.level}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* CV Section */}
                <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8">
                  <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <FileText className="w-8 h-8 text-brand-teal" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Curriculum Vitae</h4>
                        <p className="text-xs text-slate-500">Verified Resume Document</p>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      {selectedEngineer.cvFile && (
                        <>
                          <a 
                            href={typeof selectedEngineer.cvFile === 'string' ? selectedEngineer.cvFile : '#'} 
                            download={selectedEngineer.fullName ? `${selectedEngineer.fullName}_CV.pdf` : 'CV.pdf'}
                            className="px-6 py-3 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-teal-300 transition-all flex items-center gap-2 shadow-lg shadow-brand-teal/20"
                          >
                            <FileText className="w-4 h-4" /> Download CV
                          </a>
                          <button 
                            onClick={() => {
                              if (typeof selectedEngineer.cvFile === 'string') {
                                window.open(selectedEngineer.cvFile, '_blank');
                              }
                            }}
                            className="px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-all"
                          >
                            Preview
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-slate-100 bg-white flex justify-end sticky bottom-0 z-10">
                <button 
                  onClick={() => setShowEngineerModal(false)}
                  className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Payment Advice Modal */}
      <AnimatePresence>
        {showPaymentAdviceModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentAdviceModal(false)}
              className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-black">Send Payment Advice</h3>
                  <button onClick={() => setShowPaymentAdviceModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form className="space-y-6" onSubmit={handleSendPaymentAdvice}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Transaction ID / Reference</label>
                    <input 
                      type="text" 
                      value={paymentAdvice.transactionId}
                      onChange={(e) => setPaymentAdvice({...paymentAdvice, transactionId: e.target.value})}
                      placeholder="Enter reference number" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount Paid ($)</label>
                      <input 
                        type="text" 
                        value={paymentAdvice.amount}
                        onChange={(e) => setPaymentAdvice({...paymentAdvice, amount: e.target.value})}
                        placeholder="0.00" 
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Date</label>
                      <input 
                        type="date" 
                        value={paymentAdvice.date}
                        onChange={(e) => setPaymentAdvice({...paymentAdvice, date: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Payment Method</label>
                    <CustomDropdown 
                      value={paymentAdvice.paymentMethod}
                      onChange={(val) => setPaymentAdvice({...paymentAdvice, paymentMethod: val})}
                      options={[
                        { value: 'Bank Transfer', label: 'Bank Transfer' },
                        { value: 'Credit Card', label: 'Credit Card' },
                        { value: 'PayPal', label: 'PayPal' },
                        { value: 'Other', label: 'Other' }
                      ]}
                      className="w-full"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Notes (Optional)</label>
                    <textarea 
                      value={paymentAdvice.notes}
                      onChange={(e) => setPaymentAdvice({...paymentAdvice, notes: e.target.value})}
                      placeholder="Any additional information..." 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-[#009688] outline-none transition-all resize-none" 
                      rows={3}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#009688] text-white font-bold rounded-xl hover:bg-[#00796B] transition-all shadow-lg shadow-[#009688]/20"
                  >
                    Send Advice
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClientPortal;
