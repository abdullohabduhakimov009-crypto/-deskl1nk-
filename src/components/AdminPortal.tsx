import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ISO6391 from 'iso-639-1';
import { Country, City } from 'country-state-city';
import NotificationDropdown from './NotificationDropdown';
import CustomDropdown from './CustomDropdown';
import { 
  LayoutDashboard, 
  Users, 
  Ticket, 
  FileText, 
  MapPin, 
  CheckCircle2, 
  HardHat,
  Briefcase, 
  Building2,
  CreditCard, 
  Library,
  BarChart3, 
  PlusSquare, 
  MessageSquare, 
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User,
  Filter,
  MoreVertical,
  ArrowUpRight,
  ArrowDownRight,
  ArrowLeft,
  Clock,
  Calendar,
  DollarSign,
  Star,
  Send,
  Heart,
  MessageCircle,
  Share2,
  Loader2,
  Image as ImageIcon,
  Play,
  Camera,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  Globe,
  Wrench,
  Mail,
  Phone,
  Code,
  Paperclip as PaperClip,
  Edit,
  Trash2,
  Download,
  Bold,
  Italic,
  Link2,
  List,
  LayoutGrid
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import Logo from './Logo';
import LogoutConfirmModal from './LogoutConfirmModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import MessagingSystem from './MessagingSystem';
import ActivityFeed from './ActivityFeed';
import { FileUpload } from './FileUpload';
import ReactMarkdown from 'react-markdown';
import QuotationPortal from './QuotationPortal';
import { PremiumButton } from './PremiumButton';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { generateJobHistoryPDF, generateClientListPDF, generateEngineerListPDF, generateStaffListPDF, generateTicketReportPDF, generateOpportunityReportPDF, generateJobsReportPDF, ClientListItem, EngineerListItem, StaffListItem, TicketReportItem, OpportunityReportItem, JobPostingReportItem } from '../lib/pdfGenerator';
import { 
  auth,
  db,
  collection, 
  onSnapshot, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  query, 
  where,
  orderBy, 
  addDoc, 
  serverTimestamp,
  updateDoc,
  setDoc,
  doc,
  deleteDoc,
  limit,
  handleFirestoreError,
  OperationType
} from '../firebase';
// import { 
//   collection, 
//   onSnapshot, 
//   query, 
//   orderBy, 
//   addDoc, 
//   serverTimestamp,
//   updateDoc,
//   setDoc,
//   doc,
//   deleteDoc,
//   limit
// } from 'firebase/firestore';

import TicketDetailView from './TicketDetailView';
import OpportunityDetailView from './OpportunityDetailView';
import BillingInvoices from './BillingInvoices';

interface ApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  job: any;
  applications: any[];
  users: any[];
}

const ApplicantsModal: React.FC<ApplicantsModalProps> = ({ isOpen, onClose, job, applications, users }) => {
  const jobApplications = applications.filter(app => app.jobId === job?.id);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[85vh]"
          >
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10">
              <div>
                <h3 className="text-xl font-bold text-black">Applicants for {job?.title}</h3>
                <p className="text-sm text-slate-500">{jobApplications.length} engineers applied</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
              {jobApplications.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {jobApplications.map((app) => {
                    const applicant = users.find(u => u.id === app.engineerId);
                    return (
                      <div key={app.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-100 hover:border-brand-teal/30 transition-all group">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-slate-200 shadow-sm overflow-hidden">
                              {applicant?.photoURL ? (
                                <img src={applicant.photoURL} alt={applicant.displayName} className="w-full h-full object-cover" />
                              ) : (
                                <User className="w-6 h-6 text-slate-300" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900">{applicant?.displayName || 'Unknown Engineer'}</h4>
                              <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {applicant?.email}</span>
                                <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {applicant?.city?.label ?? (typeof applicant?.city === 'string' ? applicant.city : '')}, {applicant?.country?.label ?? (typeof applicant?.country === 'string' ? applicant.country : '')}</span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Applied On</div>
                            <div className="text-sm font-bold text-slate-900">
                              {app.appliedAt?.toDate ? app.appliedAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date(app.appliedAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                          <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Technician</div>
                            <div className="text-xs font-bold text-slate-700">{applicant?.technicianType?.label ?? (typeof applicant?.technicianType === 'string' ? applicant.technicianType : 'N/A')}</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Service</div>
                            <div className="text-xs font-bold text-slate-700">{applicant?.serviceType?.label ?? (typeof applicant?.serviceType === 'string' ? applicant.serviceType : 'N/A')}</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Level</div>
                            <div className="text-xs font-bold text-slate-700">{applicant?.engineerLevel?.label ?? (typeof applicant?.engineerLevel === 'string' ? applicant.engineerLevel : 'L1')}</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Experience</div>
                            <div className="text-xs font-bold text-slate-700">{applicant?.experience || '0'}+ Years</div>
                          </div>
                          <div className="bg-white p-3 rounded-xl border border-slate-200/50">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Languages</div>
                            <div className="text-xs font-bold text-slate-700">
                              {applicant?.languages?.map((l: any) => l.label || l.value || l.name || l.language || l).join(', ') || 'N/A'}
                            </div>
                          </div>
                        </div>

                        {applicant?.bio && (
                          <div className="mt-4 p-4 bg-white rounded-xl border border-slate-200/50">
                            <p className="text-xs text-slate-600 italic line-clamp-2">"{applicant.bio}"</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">No applications for this job yet.</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

interface AdminPortalProps {
  user: any;
  onLogout: () => void;
}

const AdminPortal: React.FC<AdminPortalProps> = ({ user, onLogout }) => {
  const { t, language } = useLanguage();
  const { addNotification } = useNotifications();
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('desklink_admin_activeTab') || 'Dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(!!auth.currentUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    localStorage.setItem('desklink_admin_activeTab', activeTab);
  }, [activeTab]);
  const [activeUserSubTab, setActiveUserSubTab] = useState('Clients');
  const [activeTicketSubTab, setActiveTicketSubTab] = useState('Pending');
  const [selectedTicket, setSelectedTicket] = useState<any>(null);
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null);
  const [selectedEngineer, setSelectedEngineer] = useState<any>(null);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [showOpportunityModal, setShowOpportunityModal] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);
  const [showEngineerModal, setShowEngineerModal] = useState(false);
  const [ticketModalTab, setTicketModalTab] = useState<'Details' | 'Timeline' | 'Actions'>('Details');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddInvoiceModal, setShowAddInvoiceModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    id: string;
    collection: string;
    title: string;
    message: string;
    onSuccess?: () => void;
  }>({
    isOpen: false,
    id: '',
    collection: '',
    title: '',
    message: ''
  });
  const [openUserMenuId, setOpenUserMenuId] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [editingJob, setEditingJob] = useState<any>(null);
  const [newUser, setNewUser] = useState({
    username: '',
    email: '',
    password: '',
    role: 'client',
    status: 'Active'
  });
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientEmail: '',
    amount: '',
    status: 'Pending',
    dueDate: '',
    description: ''
  });
  const [newUpdateText, setNewUpdateText] = useState('');
  const [isAddingUpdate, setIsAddingUpdate] = useState(false);
  const [quoteAmount, setQuoteAmount] = useState('');
  const [quoteFirstTwoHours, setQuoteFirstTwoHours] = useState('');
  const [quoteAdditionalHours, setQuoteAdditionalHours] = useState('');
  const [quoteTravelCost, setQuoteTravelCost] = useState('');
  const [quoteDescription, setQuoteDescription] = useState('');
  const [quoteCurrency, setQuoteCurrency] = useState('USD');
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [isAssigningEngineer, setIsAssigningEngineer] = useState(false);
  const [assignData, setAssignData] = useState({
    assignmentType: 'manual' as 'manual' | 'existing',
    selectedEngineerId: '',
    firstName: '',
    lastName: '',
    email: '',
    locationFrom: '',
    phone: '',
    attachments: [] as { name: string, type: string, data: string }[]
  });

  // Firestore Data State
  const [tickets, setTickets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [clients, setClients] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [jobPostings, setJobPostings] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [quotations, setQuotations] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [showApplicantsModal, setShowApplicantsModal] = useState(false);
  const [selectedJobForApplicants, setSelectedJobForApplicants] = useState<any>(null);

  useEffect(() => {
    if (!isLoggedIn) return;

    const unsubTickets = onSnapshot(query(collection(db, "tickets"), orderBy("createdAt", "desc")), (snapshot) => {
      const ticketList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log("[AdminPortal] Fetched tickets:", ticketList.length, ticketList);
      setTickets(ticketList);
    }, (error) => {
      console.error("[AdminPortal] Error fetching tickets:", error);
      handleFirestoreError(error, OperationType.LIST, "tickets");
    });

    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "users"));

    const unsubClients = onSnapshot(query(collection(db, "users"), where("role", "==", "client")), (snapshot) => {
      setClients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "users"));

    const unsubJobs = onSnapshot(query(collection(db, "jobs"), orderBy("completedAt", "desc")), (snapshot) => {
      setJobs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "jobs"));

    const unsubJobPostings = onSnapshot(query(collection(db, "job_postings"), orderBy("createdAt", "desc")), (snapshot) => {
      setJobPostings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "job_postings"));

    const unsubMessages = onSnapshot(query(collection(db, "messages"), orderBy("timestamp", "asc")), (snapshot) => {
      setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "messages"));

    const unsubInvoices = onSnapshot(query(collection(db, "invoices"), orderBy("createdAt", "desc")), (snapshot: any) => {
      setInvoices(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
      setIsLoading(false);
    }, (error) => handleFirestoreError(error, OperationType.LIST, "invoices"));

    const unsubQuotations = onSnapshot(query(collection(db, "quotations"), orderBy("createdAt", "desc")), (snapshot: any) => {
      setQuotations(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "quotations"));

    const unsubOpps = onSnapshot(query(collection(db, "opportunities"), orderBy("createdAt", "desc")), (snapshot: any) => {
      setOpportunities(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "opportunities"));

    const unsubApps = onSnapshot(query(collection(db, "applications"), orderBy("appliedAt", "desc")), (snapshot: any) => {
      setApplications(snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.LIST, "applications"));

    return () => {
      unsubTickets();
      unsubUsers();
      unsubClients();
      unsubJobs();
      unsubJobPostings();
      unsubMessages();
      unsubInvoices();
      unsubQuotations();
      unsubOpps();
      unsubApps();
    };
  }, [isLoggedIn]);

  const [newJobDescription, setNewJobDescription] = useState('');
  const [newJobImage, setNewJobImage] = useState<string | null>(null);
  const [newJobAttachments, setNewJobAttachments] = useState<any[]>([]);
  const [newJobCountry, setNewJobCountry] = useState('US');
  const [newJobCity, setNewJobCity] = useState('');
  const [newJobLanguage, setNewJobLanguage] = useState('English');
  const [newJobLanguageRequirement, setNewJobLanguageRequirement] = useState('Fluent');
  const [newJobTechnicianType, setNewJobTechnicianType] = useState('Desktop');
  const [newJobServiceType, setNewJobServiceType] = useState('hourly');
  const [newJobEngineerLevel, setNewJobEngineerLevel] = useState('L1');
  const [newJobRate, setNewJobRate] = useState('');
  const [newJobCurrency, setNewJobCurrency] = useState('EUR');
  const [newJobEngineersCount, setNewJobEngineersCount] = useState('1');
  const [ticketSearch, setTicketSearch] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userStatusFilter, setUserStatusFilter] = useState('All');
  const [ticketDateFilter, setTicketDateFilter] = useState('All');
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState('All');
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState('All');

  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  const allLanguages = useMemo(() => {
    return ISO6391.getAllNames().map(name => ({
      value: name,
      label: name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const allCountries = useMemo(() => {
    return Country.getAllCountries().map(country => ({
      value: country.isoCode,
      label: country.name
    })).sort((a, b) => a.label.localeCompare(b.label));
  }, []);

  const allCities = useMemo(() => {
    if (!newJobCountry) return [];
    const cities = City.getCitiesOfCountry(newJobCountry) || [];
    // Filter out duplicate city names to avoid duplicate keys in dropdown
    const uniqueCityNames = Array.from(new Set(cities.map(city => city.name)));
    return uniqueCityNames.map(name => ({
      value: name,
      label: name
    }));
  }, [newJobCountry]);

  const editingJobCities = useMemo(() => {
    if (!editingJob?.country) return [];
    // editingJob.country might be isoCode or Name. getCitiesOfCountry needs isoCode.
    const countryCode = Country.getAllCountries().find(c => c.isoCode === editingJob.country || c.name === editingJob.country)?.isoCode;
    if (!countryCode) return [];
    const cities = City.getCitiesOfCountry(countryCode) || [];
    // Filter out duplicate city names to avoid duplicate keys in dropdown
    const uniqueCityNames = Array.from(new Set(cities.map(city => city.name)));
    return uniqueCityNames.map(name => ({
      value: name,
      label: name
    }));
  }, [editingJob?.country]);

  const selectedEngineerStats = useMemo(() => {
    if (!selectedEngineer || !tickets) return null;
    
    const engineerTickets = tickets.filter(t => 
      (t.engineerId === selectedEngineer.id || t.engineerEmail === selectedEngineer.email) && 
      t.status === 'Completed'
    );

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const thisMonthCompletions = engineerTickets.filter(t => {
      const date = t.completedAt?.toDate ? t.completedAt.toDate() : (t.updatedAt?.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt || t.completedAt || 0));
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    }).length;

    // Monthly breakdown for the last 6 months
    const monthlyBreakdown = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = d.toLocaleString('default', { month: 'short' });
      const year = d.getFullYear();
      const month = d.getMonth();
      
      const count = engineerTickets.filter(t => {
        const date = t.completedAt?.toDate ? t.completedAt.toDate() : (t.updatedAt?.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt || t.completedAt || 0));
        return date.getMonth() === month && date.getFullYear() === year;
      }).length;
      
      monthlyBreakdown.push({ name: `${monthName} ${year}`, count });
    }

    return {
      total: engineerTickets.length,
      thisMonth: thisMonthCompletions,
      monthlyBreakdown
    };
  }, [selectedEngineer, tickets]);

  const newTicketsCount = useMemo(() => tickets.filter(t => t.status === 'Pending').length, [tickets]);
  const newQuotationsCount = useMemo(() => quotations.filter(q => q.status === 'Draft').length, [quotations]);
  const pendingOppsCount = useMemo(() => opportunities.filter(o => o.status === 'Under Review').length, [opportunities]);

  const dashboardStats = useMemo(() => {
    const activeTicketsCount = tickets.filter(t => t.status !== 'Resolved' && t.status !== 'Closed' && t.status !== 'Completed').length;
    const newEngineersCount = users.filter(u => u.role === 'engineer' && u.status === 'Pending').length;
    const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + parseFloat(i.amount.replace(/[^0-9.]/g, '') || '0'), 0);
    const pendingInvoicesCount = invoices.filter(i => i.status === 'Pending').length;
    const activeOpportunitiesCount = opportunities.filter(o => o.status === 'Active').length;
    
    // Generate some mock data for charts based on real counts
    const revenueData = [
      { name: 'Jan', value: totalRevenue * 0.4 },
      { name: 'Feb', value: totalRevenue * 0.6 },
      { name: 'Mar', value: totalRevenue * 0.8 },
      { name: 'Apr', value: totalRevenue * 0.7 },
      { name: 'May', value: totalRevenue * 0.9 },
      { name: 'Jun', value: totalRevenue }
    ];

    const ticketDistribution = [
      { name: 'Pending', value: tickets.filter(t => t.status === 'Pending').length },
      { name: 'In Progress', value: tickets.filter(t => t.status === 'In Progress').length },
      { name: 'Completed', value: tickets.filter(t => t.status === 'Completed').length },
      { name: 'Rejected', value: tickets.filter(t => t.status === 'Rejected').length }
    ];

    return { 
      activeTicketsCount, 
      newEngineersCount, 
      totalRevenue, 
      pendingInvoicesCount, 
      activeOpportunitiesCount,
      revenueData,
      ticketDistribution
    };
  }, [tickets, users, invoices, opportunities]);

  const filteredClients = useMemo(() => {
    return users
      .filter(u => 
        u.role === 'client' && 
        ((u.displayName?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
         (u.name?.toLowerCase() || '').includes(userSearch.toLowerCase()) ||
         (u.companyName?.toLowerCase() || '').includes(userSearch.toLowerCase()) ||
         (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())) &&
        (userStatusFilter === 'All' || u.status === userStatusFilter)
      )
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt || 0);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  }, [users, userSearch, userStatusFilter]);

  const filteredEngineers = useMemo(() => {
    return users
      .filter(u => 
        u.role === 'engineer' && 
        ((u.displayName?.toLowerCase() || '').includes(userSearch.toLowerCase()) || 
         (u.fullName?.toLowerCase() || '').includes(userSearch.toLowerCase()) ||
         (u.email?.toLowerCase() || '').includes(userSearch.toLowerCase())) &&
        (userStatusFilter === 'All' || u.status === userStatusFilter)
      )
      .sort((a, b) => {
        const dateA = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : (a.createdAt || 0);
        const dateB = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : (b.createdAt || 0);
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });
  }, [users, userSearch, userStatusFilter]);

  const staffUsers = useMemo(() => {
    return users
      .filter(u => u.role === 'admin' || u.role === 'staff')
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }, [users]);

  useEffect(() => {
    const q = query(
      collection(db, "messages"),
      where("receiverId", "==", "admin_desklink"),
      where("unread", "==", true)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setUnreadMessagesCount(snapshot.size);
    });

    return () => unsubscribe();
  }, []);

  const handleViewAllActivity = () => {
    setActiveTab('Dashboard');
    setTimeout(() => {
      const element = document.getElementById('activity-feed-container');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const menuItems = [
    { id: 'Dashboard', icon: LayoutDashboard },
    { id: 'Manage Users', icon: Users },
    { id: 'Tickets', icon: Ticket, badge: newTicketsCount },
    { id: 'Completed Jobs', icon: CheckCircle2 },
    { id: 'Billing & Invoices', icon: CreditCard },
    { id: 'Quotations', icon: FileText, badge: newQuotationsCount },
    { id: 'Opportunities', icon: Briefcase, badge: pendingOppsCount },
    { id: 'Post a Job', icon: PlusSquare },
    { id: 'Messages', icon: MessageSquare },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewJobImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    if (typeof date === 'object' && 'seconds' in date) {
      return new Date(date.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    }
    const d = new Date(date);
    return isNaN(d.getTime()) ? 'N/A' : d.toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  };

  const handleExportReport = () => {
    const completedTickets = tickets.filter(t => t.status === 'Completed');
    if (completedTickets.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No completed jobs found to export.',
        type: 'error'
      });
      return;
    }

    const reportData = completedTickets.map(job => ({
      jobId: `JB-${job.id.slice(0, 4).toUpperCase()}`,
      subject: job.subject || 'N/A',
      client: job.clientName || 'N/A',
      engineer: job.engineerName || 'N/A',
      type: job.serviceType || 'N/A',
      completedDate: formatDate(job.updatedAt || job.completedAt),
      description: job.description,
      specialInstructions: job.specialInstructions,
      engineerEmail: job.engineerEmail,
      engineerPhone: job.engineerPhone,
      quoteAmount: job.quote?.amount ? `${job.quote.currency === 'EUR' ? '€' : '$'}${job.quote.amount}` : 'N/A',
      quoteDescription: job.quote?.description,
      updates: job.updates
    }));

    generateJobHistoryPDF(reportData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Completed jobs report has been downloaded.',
      type: 'success'
    });
  };

  const handleExportClients = () => {
    if (filteredClients.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No clients found to export.',
        type: 'error'
      });
      return;
    }

    const clientData: ClientListItem[] = filteredClients.map(client => ({
      name: client.name || client.displayName || 'Unnamed Client',
      company: client.companyName || 'No Company',
      email: client.email || 'N/A',
      location: `${client.country?.label ?? (typeof client.country === 'string' ? client.country : (client.location || 'N/A'))}${client.city ? `, ${client.city?.label ?? (typeof client.city === 'string' ? client.city : '')}` : ''}`,
      size: client.companySize || 'N/A',
      status: client.status || 'Active',
      joined: client.createdAt?.toDate ? client.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
      phone: client.phoneNumber || client.phone || 'N/A',
      industry: client.industry || 'N/A'
    }));

    generateClientListPDF(clientData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Client list report has been downloaded.',
      type: 'success'
    });
  };

  const handleExportEngineers = () => {
    if (filteredEngineers.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No engineers found to export.',
        type: 'error'
      });
      return;
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const engineerData: EngineerListItem[] = filteredEngineers.map(eng => {
      // Calculate stats for this engineer
      const engineerTickets = tickets.filter(t => 
        (t.engineerId === eng.id || t.engineerEmail === eng.email) && 
        t.status === 'Completed'
      );

      const thisMonthCompletions = engineerTickets.filter(t => {
        const date = t.completedAt?.toDate ? t.completedAt.toDate() : (t.updatedAt?.toDate ? t.updatedAt.toDate() : new Date(t.updatedAt || t.completedAt || 0));
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }).length;

      const joinedDate = eng.createdAt 
        ? (eng.createdAt.toDate ? eng.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date(eng.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }))
        : 'N/A';

      const techType = eng.specialization?.label ?? (typeof eng.specialization === 'string' ? eng.specialization : (eng.technicianType?.label ?? (typeof eng.technicianType === 'string' ? eng.technicianType : 'N/A')));

      return {
        name: eng.fullName || eng.displayName || 'Unnamed Engineer',
        email: eng.email || 'N/A',
        location: eng.location || `${eng.city?.label ?? (typeof eng.city === 'string' ? eng.city : '')}${eng.city && eng.country ? ', ' : ''}${eng.country?.label ?? (typeof eng.country === 'string' ? eng.country : '')}` || 'N/A',
        technicianType: techType,
        serviceType: eng.serviceType?.label ?? (typeof eng.serviceType === 'string' ? eng.serviceType : 'N/A'),
        level: eng.engineerLevel?.label ?? (typeof eng.engineerLevel === 'string' ? eng.engineerLevel : 'L1'),
        experience: eng.experience || '0',
        languages: eng.languages?.map((l: any) => `${l.name || l.label || l.value || l}${l.level ? ` (${l.level})` : ''}`).join(', ') || 'N/A',
        status: eng.status || 'Active',
        joined: joinedDate,
        phone: `${eng.phoneCountryCode?.value ?? (typeof eng.phoneCountryCode === 'string' ? eng.phoneCountryCode : '')} ${eng.phoneNumber || eng.phone || ''}`.trim() || 'N/A',
        whatsapp: eng.whatsappNumber ? `${eng.whatsappCountryCode?.value ?? (typeof eng.whatsappCountryCode === 'string' ? eng.whatsappCountryCode : '')} ${eng.whatsappNumber}`.trim() : 'N/A',
        bio: eng.bio,
        hourlyRate: eng.hourlyRate ? `$${eng.hourlyRate}` : undefined,
        halfDayRate: eng.halfDayRate ? `$${eng.halfDayRate}` : undefined,
        fullDayRate: eng.fullDayRate ? `$${eng.fullDayRate}` : undefined,
        specialization: techType,
        skills: Array.isArray(eng.skills) ? eng.skills.map((s: any) => s.label || s) : (eng.skills || '').split(',').map((s: string) => s.trim()).filter(Boolean),
        totalCompleted: engineerTickets.length,
        thisMonthCompleted: thisMonthCompletions,
        paymentDetails: eng.paymentDetails,
        hasCV: !!(eng.cvFile || eng.cvUrl)
      };
    });

    generateEngineerListPDF(engineerData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Engineer list report has been downloaded.',
      type: 'success'
    });
  };

  const handleExportStaff = () => {
    if (staffUsers.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No staff members found to export.',
        type: 'error'
      });
      return;
    }

    const staffData: StaffListItem[] = staffUsers.map(staff => ({
      name: staff.displayName || 'Unnamed Staff',
      email: staff.email || 'N/A',
      role: staff.role || 'N/A',
      status: staff.status || 'Active',
      joined: staff.createdAt?.toDate ? staff.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'
    }));

    generateStaffListPDF(staffData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Staff list report has been downloaded.',
      type: 'success'
    });
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
      createdAt: formatDate(ticket.createdAt),
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
      createdAt: formatDate(opp.createdAt),
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

  const handleExportJobs = () => {
    if (jobPostings.length === 0) {
      addNotification({
        title: 'Export Failed',
        message: 'No jobs found to export.',
        type: 'error'
      });
      return;
    }

    const reportData: JobPostingReportItem[] = jobPostings.map(job => ({
      id: job.id,
      title: job.title || 'New Opportunity',
      company: job.company || 'Desknet',
      location: job.location || 'N/A',
      description: job.description || 'N/A',
      technicianType: job.technicianType || 'N/A',
      serviceType: job.serviceType || 'N/A',
      engineerLevel: job.engineerLevel || 'N/A',
      engineersCount: job.engineersCount || 'N/A',
      salary: job.salary || 'Not specified',
      language: job.language || 'N/A',
      languageRequirement: job.languageRequirement || 'N/A',
      createdAt: job.createdAt?.toDate ? job.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A',
      imageUrl: job.imageUrl
    }));

    generateJobsReportPDF(reportData);
    
    addNotification({
      title: 'Export Successful',
      message: 'Job postings report has been downloaded.',
      type: 'success'
    });
  };

  const handlePostJob = async () => {
    if (!newJobDescription.trim()) return;
    try {
      const countryName = allCountries.find(c => c.value === newJobCountry)?.label || newJobCountry;
      await addDoc(collection(db, "job_postings"), {
        title: "New Opportunity", // Default title since field was removed
        description: newJobDescription,
        company: "Desknet", // Default company
        location: `${newJobCity}, ${countryName}`,
        country: countryName,
        city: newJobCity,
        language: newJobLanguage,
        languageRequirement: newJobLanguageRequirement,
        technicianType: newJobTechnicianType,
        serviceType: newJobServiceType,
        engineerLevel: newJobEngineerLevel,
        engineersCount: newJobEngineersCount,
        rate: newJobRate,
        currency: newJobCurrency,
        salary: newJobRate ? `${newJobCurrency === 'EUR' ? '€' : '$'}${newJobRate}` : "Not specified",
        type: "Full-time",
        imageUrl: newJobAttachments.find(a => a.type.startsWith('image/'))?.data || null,
        attachments: newJobAttachments,
        author: 'Admin',
        createdAt: serverTimestamp(),
        status: 'Active'
      });
      setNewJobDescription('');
      setNewJobImage(null);
      setNewJobAttachments([]);
      setNewJobCity('');
      setNewJobRate('');
      setNewJobEngineerLevel('L1');
      setNewJobCurrency('EUR');
      addNotification({
        type: 'success',
        title: 'Job Posted',
        message: 'The job has been posted successfully!'
      });
    } catch (error) {
      console.error("Error posting job:", error);
      addNotification({
        type: 'error',
        title: 'Post Failed',
        message: 'Failed to post the job.'
      });
    }
  };

  const handleUpdateJob = async () => {
    if (!editingJob) return;
    try {
      const countryName = allCountries.find(c => c.value === editingJob.country)?.label || editingJob.country;
      await updateDoc(doc(db, "job_postings", editingJob.id), {
        title: editingJob.title || 'New Opportunity',
        description: editingJob.description,
        company: editingJob.company || 'Desknet',
        location: `${editingJob.city || ''}, ${countryName}`,
        country: countryName,
        city: editingJob.city || '',
        language: editingJob.language || 'English',
        languageRequirement: editingJob.languageRequirement || 'Fluent',
        technicianType: editingJob.technicianType || 'Desktop',
        serviceType: editingJob.serviceType || 'hourly',
        engineerLevel: editingJob.engineerLevel || 'L1',
        engineersCount: editingJob.engineersCount || '1',
        rate: editingJob.rate || '',
        currency: editingJob.currency || 'EUR',
        salary: editingJob.rate ? `${editingJob.currency === 'EUR' ? '€' : '$'}${editingJob.rate}` : (editingJob.salary || "Not specified"),
        type: editingJob.type || "Full-time",
        imageUrl: editingJob.attachments?.find((a: any) => a.type.startsWith('image/'))?.data || editingJob.imageUrl,
        attachments: editingJob.attachments || [],
        updatedAt: serverTimestamp()
      });
      setEditingJob(null);
      addNotification({
        type: 'success',
        title: 'Job Updated',
        message: 'The job posting has been updated successfully!'
      });
    } catch (error) {
      console.error("Error updating job:", error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update the job posting.'
      });
    }
  };

  const handleDeleteJob = (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      collection: 'job_postings',
      title: 'Delete Job Posting',
      message: 'Are you sure you want to delete this job posting? This action cannot be undone.'
    });
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    try {
      await updateDoc(doc(db, "users", editingUser.id), {
        displayName: editingUser.displayName || editingUser.name,
        name: editingUser.displayName || editingUser.name,
        email: editingUser.email,
        role: editingUser.role,
        status: editingUser.status,
        companyName: editingUser.companyName,
        location: editingUser.location,
        specialization: editingUser.specialization,
        engineerLevel: editingUser.engineerLevel || 'L1',
        updatedAt: serverTimestamp()
      });
      setEditingUser(null);
      addNotification({
        type: 'success',
        title: 'User Updated',
        message: 'User information has been updated successfully.'
      });
    } catch (error) {
      console.error("Error updating user:", error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update user information.'
      });
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // If adding staff or admin, we need to create an auth account
      if (newUser.role === 'staff' || newUser.role === 'admin') {
        try {
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            newUser.email, 
            newUser.password || 'Desknet2024!' // Default password if none provided
          );
          
          const userRef = doc(db, "users", userCredential.user.uid);
          await setDoc(userRef, {
            uid: userCredential.user.uid,
            displayName: newUser.username,
            name: newUser.username,
            fullName: newUser.username,
            email: newUser.email,
            role: newUser.role.toLowerCase(),
            status: newUser.status,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Error creating auth account:", err);
          throw err;
        }
      } else {
        const userRef = doc(collection(db, "users"));
        const userData = {
          uid: userRef.id,
          displayName: newUser.username,
          name: newUser.username,
          fullName: newUser.username,
          email: newUser.email,
          role: newUser.role.toLowerCase(),
          status: newUser.status,
          createdAt: serverTimestamp()
        };
        
        await setDoc(userRef, userData);
      }

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'user_added',
          title: 'New User Added',
          description: `Admin added a new ${newUser.role}: ${newUser.username}`,
          userId: 'admin_desklink',
          userName: 'Admin',
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }
      
      setShowAddUserModal(false);
      setNewUser({ username: '', email: '', password: '', role: 'client', status: 'Active' });
      addNotification({
        type: 'success',
        title: 'User Added',
        message: `${newUser.role} added successfully!`
      });
    } catch (error: any) {
      console.error("Error adding user:", error);
      addNotification({
        type: 'error',
        title: 'Add Failed',
        message: error.message || 'Failed to add user.'
      });
    }
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "invoices"), {
        ...newInvoice,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      setShowAddInvoiceModal(false);
      setNewInvoice({
        clientName: '',
        clientEmail: '',
        amount: '',
        status: 'Pending',
        dueDate: '',
        description: ''
      });
      addNotification({
        type: 'success',
        title: 'Invoice Created',
        message: 'The invoice has been created successfully.'
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, "invoices");
    }
  };

  const handleUpdateInvoiceStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, "invoices", id), { 
        status, 
        updatedAt: serverTimestamp() 
      });
      addNotification({
        type: 'success',
        title: 'Invoice Updated',
        message: `Invoice marked as ${status.toLowerCase()}.`
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, "invoices");
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    setDeleteConfirm({
      isOpen: true,
      id,
      collection: 'invoices',
      title: 'Delete Invoice',
      message: 'Are you sure you want to delete this invoice? This action cannot be undone.'
    });
  };

  const handleConfirmDelete = async () => {
    const { id, collection, onSuccess } = deleteConfirm;
    try {
      await deleteDoc(doc(db, collection, id));
      addNotification({
        type: 'success',
        title: 'Deleted Successfully',
        message: 'The item has been removed.'
      });
      if (onSuccess) onSuccess();
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, collection);
    } finally {
      setDeleteConfirm(prev => ({ ...prev, isOpen: false }));
    }
  };

  const handleToggleOnSite = async (ticketId: string, currentStatus: boolean) => {
    if (currentStatus) return; // Prevent marking off site if already on site
    
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      const isQuoteAccepted = ticket?.quote?.status === 'Accepted' || ticket?.status === 'Quote Accepted' || ticket?.status === 'In Progress';
      const newOnSiteStatus = true; // Always true now
      
      const updateData: any = {
        isOnSite: newOnSiteStatus,
        status: 'On Site',
        updatedAt: serverTimestamp(),
        updates: [
          ...(ticket?.updates || []),
          { 
            text: `Engineer is now ON SITE.`, 
            timestamp: new Date().toISOString(),
            author: 'Admin'
          }
        ]
      };

      updateData.onSiteAt = serverTimestamp();
      
      await updateDoc(doc(db, "tickets", ticketId), updateData);
      
      addNotification({
        type: 'success',
        title: 'Status Updated',
        message: `Engineer is now on site.`
      });
      
      // Update local state if needed
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ 
          ...selectedTicket, 
          isOnSite: newOnSiteStatus,
          status: 'On Site'
        });
      }
    } catch (error) {
      console.error("Error toggling on-site status:", error);
    }
  };

  const handleAddUpdate = async (ticketId: string) => {
    if (!newUpdateText.trim()) return;
    setIsAddingUpdate(true);
    try {
      const ticketRef = doc(db, "tickets", ticketId);
      const currentUpdates = selectedTicket.updates || [];
      const newUpdate = {
        text: newUpdateText,
        timestamp: new Date().toISOString(),
        author: 'Admin'
      };
      
      await updateDoc(ticketRef, {
        updates: [...currentUpdates, newUpdate],
        updatedAt: serverTimestamp()
      });
      
      setNewUpdateText('');
      addNotification({
        type: 'success',
        title: 'Update Sent',
        message: 'Client has been notified of the update.'
      });
      
      // Update local state
      setSelectedTicket({ 
        ...selectedTicket, 
        updates: [...currentUpdates, newUpdate] 
      });
    } catch (error) {
      console.error("Error adding update:", error);
    } finally {
      setIsAddingUpdate(false);
    }
  };

  const handleUpdateTicketStatus = async (ticketId: string, newStatus: string) => {
    try {
      const updateData: any = {
        status: newStatus,
        updatedAt: serverTimestamp()
      };

      if (newStatus === 'Completed' || newStatus === 'Waiting for Confirmation') {
        updateData.isOnSite = false;
        updateData.completedAt = serverTimestamp();
      }

      await updateDoc(doc(db, "tickets", ticketId), updateData);

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'ticket_status_update',
          title: 'Ticket Status Updated',
          description: `Ticket #${ticketId.substring(0, 6)} status changed to ${newStatus}`,
          userId: 'admin_desklink',
          userName: 'Admin',
          targetUserId: tickets.find(t => t.id === ticketId)?.clientId,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }
      
      const ticket = tickets.find(t => t.id === ticketId);
      
      // Notify client
      if (ticket?.clientId) {
        await addNotification({
          type: 'ticket',
          title: 'Ticket Status Updated',
          message: `Your ticket #${ticketId.substring(0, 6)} status changed to ${newStatus}`,
          link: `/tickets/${ticketId}`
        }, ticket.clientId);
      }

      // Notify engineer if assigned
      if (ticket?.assignedEngineerId) {
        await addNotification({
          type: 'ticket',
          title: 'Ticket Status Updated',
          message: `Ticket #${ticketId.substring(0, 6)} status changed to ${newStatus}`,
          link: `/tickets/${ticketId}`
        }, ticket.assignedEngineerId);
      }

      if (newStatus === 'Completed' || newStatus === 'Waiting for Confirmation') {
        setShowSuccessAnimation(true);
        setTimeout(() => setShowSuccessAnimation(false), 3000);
        addNotification({
          type: 'success',
          title: 'Job Completed',
          message: 'The job is completed'
        });
      } else {
        addNotification({
          type: 'success',
          title: 'Status Updated',
          message: `Ticket ${newStatus.toLowerCase()} successfully!`
        });
      }
      
      setShowTicketModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error updating ticket status:", error);
      addNotification({
        type: 'error',
        title: 'Update Failed',
        message: 'Failed to update ticket status.'
      });
    }
  };

  const handleGiveQuote = async (ticketId: string) => {
    if (!quoteAmount.trim()) return;
    setIsSubmittingQuote(true);
    try {
      const ticket = tickets.find(t => t.id === ticketId);
      
      await updateDoc(doc(db, "tickets", ticketId), {
        quote: {
          amount: quoteAmount,
          firstTwoHours: quoteFirstTwoHours,
          additionalHours: quoteAdditionalHours,
          travelCost: quoteTravelCost,
          description: quoteDescription,
          currency: quoteCurrency,
          status: 'Quoted',
          createdAt: new Date().toISOString()
        },
        status: 'Waiting for client approval',
        updatedAt: serverTimestamp()
      });

      // Also create a separate quotation record for the Quotation Portal
        await addDoc(collection(db, "quotations"), {
          clientName: (ticket?.clientName && ticket?.clientName !== 'Unknown Client') ? ticket.clientName : (ticket?.clientEmail || 'Unknown Client'),
          clientUid: ticket?.clientUid || '',
          project: `Ticket Quote: ${ticket?.subject || 'Service'}`,
          description: quoteDescription || ticket?.description || '',
          amount: quoteAmount,
          firstTwoHours: quoteFirstTwoHours,
          additionalHours: quoteAdditionalHours,
          travelCost: quoteTravelCost,
          currency: quoteCurrency,
          status: 'Sent',
          ticketId: ticketId,
          createdAt: serverTimestamp()
        });

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'ticket_quoted',
          title: 'Ticket Quoted',
          description: `Admin provided a quote for Ticket #${ticketId.substring(0, 6)}`,
          userId: 'admin_desklink',
          userName: 'Admin',
          targetUserId: tickets.find(t => t.id === ticketId)?.clientId,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      addNotification({
        type: 'success',
        title: 'Quote Sent',
        message: 'The quotation has been sent to the client for approval.'
      });

      setQuoteAmount('');
      setQuoteFirstTwoHours('');
      setQuoteAdditionalHours('');
      setQuoteTravelCost('');
      setQuoteDescription('');
      setShowTicketModal(false);
      setSelectedTicket(null);
    } catch (error) {
      console.error("Error giving quote:", error);
      addNotification({
        type: 'error',
        title: 'Quote Failed',
        message: 'Failed to send quotation.'
      });
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setAssignData(prev => ({
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

  const handleAssignEngineer = async () => {
    if (assignData.assignmentType === 'manual' && (!assignData.firstName || !assignData.lastName || !assignData.email)) {
      addNotification({
        type: 'error',
        title: 'Missing Info',
        message: 'Please fill in required engineer details.'
      });
      return;
    }

    if (assignData.assignmentType === 'existing' && !assignData.selectedEngineerId) {
      addNotification({
        type: 'error',
        title: 'Missing Selection',
        message: 'Please select an engineer from the list.'
      });
      return;
    }
    
    setIsAssigningEngineer(true);
    try {
      const isQuoteAccepted = selectedTicket.quote?.status === 'Accepted' || selectedTicket.status === 'Quote Accepted';
      
      let engineerDetails: any = {};
      if (assignData.assignmentType === 'existing') {
        const engineer = users.find(u => u.id === assignData.selectedEngineerId);
        engineerDetails = {
          engineerName: engineer.displayName || engineer.fullName,
          engineerEmail: engineer.email,
          engineerPhone: engineer.phoneNumber || engineer.phone,
          engineerLocationFrom: `${engineer.city?.label ?? (typeof engineer.city === 'string' ? engineer.city : '')}, ${engineer.country?.label ?? (typeof engineer.country === 'string' ? engineer.country : '')}`,
          assignedEngineerId: engineer.id
        };
      } else {
        engineerDetails = {
          engineerName: `${assignData.firstName} ${assignData.lastName}`,
          engineerEmail: assignData.email,
          engineerPhone: assignData.phone,
          engineerLocationFrom: assignData.locationFrom,
          engineerAttachments: assignData.attachments
        };
      }

      await updateDoc(doc(db, "tickets", selectedTicket.id), {
        status: isQuoteAccepted ? 'In Progress' : 'Assigned',
        ...engineerDetails,
        assignedAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Log activity
      try {
        await addDoc(collection(db, "activities"), {
          type: 'engineer_assigned',
          title: 'Engineer Assigned',
          description: `Engineer ${engineerDetails.engineerName} assigned to Ticket #${selectedTicket.id.substring(0, 6)}${isQuoteAccepted ? ' and moved to In Progress' : ''}`,
          userId: 'admin_desklink',
          userName: 'Admin',
          targetUserId: selectedTicket.clientId,
          timestamp: serverTimestamp()
        });
      } catch (err) {
        handleFirestoreError(err, OperationType.CREATE, "activities");
      }

      addNotification({
        type: 'success',
        title: 'Engineer Assigned',
        message: `Engineer ${engineerDetails.engineerName} has been assigned successfully.`
      });

      setShowAssignForm(false);
      setShowTicketModal(false);
      setSelectedTicket(null);
      setAssignData({
        assignmentType: 'manual',
        selectedEngineerId: '',
        firstName: '',
        lastName: '',
        email: '',
        locationFrom: '',
        phone: '',
        attachments: []
      });
    } catch (error) {
      console.error("Error assigning engineer:", error);
      addNotification({
        type: 'error',
        title: 'Assignment Failed',
        message: 'Failed to assign engineer.'
      });
    } finally {
      setIsAssigningEngineer(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        const { 
          activeTicketsCount, 
          newEngineersCount, 
          totalRevenue, 
          pendingInvoicesCount, 
          activeOpportunitiesCount,
          revenueData,
          ticketDistribution
        } = dashboardStats;

        const COLORS = ['#0D9488', '#3B82F6', '#F59E0B', '#EF4444'];
        
        return (
          <div className="space-y-6 animate-in fade-in duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Executive Overview</h2>
                <p className="text-slate-500 font-medium">Real-time operational intelligence for Desknet Global</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {users.slice(0, 4).map((u, i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600 overflow-hidden">
                      {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : (u.displayName?.charAt(0) || 'U')}
                    </div>
                  ))}
                  <div className="w-8 h-8 rounded-full border-2 border-white bg-brand-teal flex items-center justify-center text-[10px] font-bold text-white">
                    +{users.length > 4 ? users.length - 4 : 0}
                  </div>
                </div>
                <div className="h-8 w-px bg-slate-200 mx-1" />
                <button className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all flex items-center gap-2 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                  Last 30 Days
                </button>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, change: '+12.5%', icon: CreditCard, color: 'text-emerald-500', bg: 'bg-emerald-50', sparkline: [40, 60, 45, 70, 55, 90] },
                { label: 'Active Tickets', value: activeTicketsCount.toString(), change: '+3', icon: Ticket, color: 'text-blue-500', bg: 'bg-blue-50', sparkline: [30, 40, 35, 50, 45, 60] },
                { label: 'Pending Invoices', value: pendingInvoicesCount.toString(), change: '-2', icon: FileText, color: 'text-orange-500', bg: 'bg-orange-50', sparkline: [50, 40, 45, 30, 35, 25] },
                { label: 'Active Opps', value: activeOpportunitiesCount.toString(), change: '+5', icon: Briefcase, color: 'text-purple-500', bg: 'bg-purple-50', sparkline: [20, 30, 25, 40, 35, 50] },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all group relative overflow-hidden">
                  <div className="flex justify-between items-start mb-3">
                    <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 transition-transform duration-500`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] font-black flex items-center justify-end gap-0.5 px-2 py-0.5 rounded-full ${stat.change.startsWith('+') ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'}`}>
                        {stat.change.startsWith('+') ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
                  </div>
                  {/* Mini Sparkline */}
                  <div className="mt-4 h-8 flex items-end gap-1">
                    {stat.sparkline.map((h, idx) => (
                      <motion.div 
                        key={idx}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ delay: idx * 0.1, duration: 0.5 }}
                        className={`flex-1 rounded-t-sm ${stat.color.replace('text-', 'bg-').replace('500', '400')} opacity-20 group-hover:opacity-40 transition-opacity`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Revenue Chart */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Revenue Analytics</h3>
                    <p className="text-sm text-slate-500">Monthly performance tracking</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 bg-brand-teal rounded-full" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Revenue</span>
                    </div>
                  </div>
                </div>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueData}>
                      <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0D9488" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        dy={10}
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 10, fontWeight: 700, fill: '#94a3b8' }}
                        tickFormatter={(value) => `$${value/1000}k`}
                      />
                      <Tooltip 
                        contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '12px', fontWeight: '700' }}
                        cursor={{ stroke: '#0D9488', strokeWidth: 2, strokeDasharray: '5 5' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#0D9488" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Quick Actions & Distribution */}
              <div className="space-y-8">
                {/* Quick Actions */}
                <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                  <h3 className="text-xl font-black mb-6 relative z-10">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3 relative z-10">
                    {[
                      { label: 'New Post', icon: PlusSquare, action: () => setActiveTab('Post News') },
                      { label: 'Invoices', icon: FileText, action: () => setActiveTab('Billing & Invoices') },
                      { label: 'Tickets', icon: Ticket, action: () => setActiveTab('Tickets') },
                    ].map((item, idx) => (
                      <button 
                        key={idx}
                        onClick={item.action}
                        className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-105"
                      >
                        <item.icon className="w-5 h-5 text-brand-teal" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ticket Distribution */}
                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm p-8">
                  <h3 className="text-xl font-black text-slate-900 mb-6">Ticket Status</h3>
                  <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={ticketDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {ticketDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: '700' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    {ticketDistribution.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                        <span className="text-[10px] font-bold text-slate-500 uppercase">{item.name}</span>
                        <span className="text-[10px] font-black text-slate-900 ml-auto">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Tickets Table */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <h3 className="text-xl font-black text-slate-900">Recent Service Requests</h3>
                    <p className="text-sm text-slate-500">Latest tickets requiring attention</p>
                  </div>
                  <button onClick={() => setActiveTab('Tickets')} className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-slate-100">
                  {tickets.slice(0, 5).map((ticket, i) => (
                    <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => { setSelectedTicket(ticket); setShowTicketModal(true); }}>
                      <div className="flex items-center gap-4 min-w-0">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xs shrink-0 border-2 ${
                          ticket.priority === 'High' ? 'bg-rose-50 border-rose-100 text-rose-500' : 
                          ticket.priority === 'Medium' ? 'bg-orange-50 border-orange-100 text-orange-500' : 'bg-blue-50 border-blue-100 text-blue-500'
                        }`}>
                          {ticket.priority.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 group-hover:text-brand-teal transition-colors truncate">{ticket.subject || ticket.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">#{ticket.id.slice(0, 6).toUpperCase()}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full" />
                            <span className="text-[10px] font-bold text-slate-500">{ticket.clientName}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.1em] border ${
                          ticket.status === 'Pending' ? 'bg-orange-50 border-orange-100 text-orange-600' :
                          ticket.status === 'Waiting for client approval' ? 'bg-purple-50 border-purple-100 text-purple-600' :
                          ticket.status === 'In Progress' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                          ticket.status === 'On Site' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                          ticket.status === 'Completed' ? 'bg-slate-50 border-slate-200 text-slate-400' :
                          'bg-emerald-50 border-emerald-100 text-emerald-600'
                        }`}>
                          {ticket.status}
                        </span>
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all">
                          <ChevronRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                  {tickets.length === 0 && (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Ticket className="w-8 h-8 text-slate-200" />
                      </div>
                      <p className="text-slate-400 font-bold">No active tickets found</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Activity & Status */}
              <div className="space-y-8">
                {/* Live Feed */}
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-full">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-black text-slate-900">Live Activity</h3>
                    <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 rounded-full">
                      <motion.div 
                        animate={{ opacity: [1, 0.5, 1] }} 
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="w-1.5 h-1.5 bg-emerald-500 rounded-full" 
                      />
                      <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                  <div id="activity-feed-container" className="max-h-[400px] overflow-y-auto custom-scrollbar pr-2">
                    <ActivityFeed role="admin" />
                  </div>
                </div>

                {/* System Health */}
                <div className="bg-slate-50 border border-slate-200 p-8 rounded-[2.5rem] relative overflow-hidden group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900">System Health</h3>
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: 'API Latency', value: '24ms', status: 'Optimal', progress: 95 },
                      { label: 'Database Load', value: '12%', status: 'Low', progress: 12 },
                      { label: 'Storage', value: '1.2TB', status: 'Healthy', progress: 45 },
                    ].map((item, idx) => (
                      <div key={idx} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                          <span className="text-slate-400">{item.label}</span>
                          <span className="text-slate-900">{item.value}</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${item.progress}%` }} 
                            className={`h-full ${item.progress > 80 ? 'bg-emerald-500' : item.progress > 50 ? 'bg-amber-500' : 'bg-brand-teal'}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Manage Users':
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold text-black">Manage Users</h3>
                <div className="flex gap-2 mt-2 bg-slate-100 p-1 rounded-2xl w-full md:w-fit overflow-x-auto whitespace-nowrap custom-scrollbar">
                  {['Clients', 'Engineers', 'Staff'].map(sub => (
                    <PremiumButton 
                      key={sub}
                      variant={activeUserSubTab === sub ? 'primary' : 'ghost'}
                      size="sm"
                      onClick={() => setActiveUserSubTab(sub)}
                      className={`px-4 py-1.5 rounded-xl text-sm font-bold transition-all shrink-0 ${
                        activeUserSubTab === sub 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {sub}
                    </PremiumButton>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                {(userSearch || userStatusFilter !== 'All') && (
                  <PremiumButton 
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setUserSearch('');
                      setUserStatusFilter('All');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors min-w-0"
                  >
                    Clear Filters
                  </PremiumButton>
                )}
                <CustomDropdown 
                  value={userStatusFilter}
                  onChange={setUserStatusFilter}
                  options={[
                    { value: 'All', label: 'All Status' },
                    { value: 'Active', label: 'Active' },
                    { value: 'Inactive', label: 'Inactive' },
                    { value: 'Pending', label: 'Pending' }
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                />
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder={`Search ${activeUserSubTab.toLowerCase()}...`} 
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal/50"
                  />
                </div>
                {activeUserSubTab === 'Clients' && (
                  <PremiumButton 
                    variant="primary"
                    size="sm"
                    onClick={handleExportClients}
                    className="w-full md:w-auto px-4 py-2 bg-brand-teal text-slate-900 rounded-xl text-sm font-bold"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Export List
                  </PremiumButton>
                )}
                {activeUserSubTab === 'Engineers' && (
                  <PremiumButton 
                    variant="primary"
                    size="sm"
                    onClick={handleExportEngineers}
                    className="w-full md:w-auto px-4 py-2 bg-brand-teal text-slate-900 rounded-xl text-sm font-bold"
                    icon={<Download className="w-4 h-4" />}
                  >
                    Export List
                  </PremiumButton>
                )}
                {activeUserSubTab === 'Staff' && (
                  <div className="flex gap-2 w-full md:w-auto">
                    <PremiumButton 
                      variant="primary"
                      size="sm"
                      onClick={handleExportStaff}
                      className="flex-1 md:flex-none px-4 py-2 bg-white text-slate-600 border border-slate-200 rounded-xl text-sm font-bold"
                      icon={<Download className="w-4 h-4" />}
                    >
                      Export List
                    </PremiumButton>
                    <PremiumButton 
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setNewUser(prev => ({ ...prev, role: 'staff' }));
                        setShowAddUserModal(true);
                      }}
                      className="flex-1 md:flex-none px-4 py-2 bg-brand-teal text-slate-900 rounded-xl text-sm font-bold"
                      icon={<PlusSquare className="w-4 h-4" />}
                    >
                      Add Staff
                    </PremiumButton>
                  </div>
                )}
              </div>
            </div>

            {activeUserSubTab === 'Clients' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Client & Company</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Location</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Size</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredClients.map((client) => (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold text-sm overflow-hidden border border-slate-200 shrink-0">
                              {client.photoURL ? <img src={client.photoURL} className="w-full h-full object-cover" /> : (client.name?.charAt(0) || client.displayName?.charAt(0) || client.email?.charAt(0))}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="font-bold text-slate-900 truncate">{client.name || client.displayName || 'Unnamed Client'}</span>
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{client.companyName || 'No Company'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500 truncate max-w-[200px]" title={client.email}>{client.email}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm text-slate-600 font-medium">{client.country?.label ?? (typeof client.country === 'string' ? client.country : (client.location || 'N/A'))}</span>
                            {client.city && <span className="text-[10px] text-slate-400 uppercase font-bold">{client.city?.label ?? (typeof client.city === 'string' ? client.city : '')}</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-slate-100 rounded-md text-[10px] font-bold text-slate-600">
                            {client.companySize || 'N/A'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                            client.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'
                          }`}>
                            {client.status || 'Active'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-slate-500">{client.createdAt?.toDate ? client.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</td>
                        <td className="px-4 py-3 text-right relative overflow-visible">
                          <PremiumButton 
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === client.id ? null : client.id);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0"
                            icon={<MoreVertical className="w-4 h-4" />}
                          />
                          
                          <AnimatePresence>
                            {openUserMenuId === client.id && (
                              <React.Fragment key={`client-menu-${client.id}`}>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                <motion.div
                                  key={`client-menu-content-${client.id}`}
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                >
                                  <PremiumButton 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setEditingUser(client);
                                      setOpenUserMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 justify-start min-w-0"
                                    icon={<Edit className="w-4 h-4" />}
                                  >
                                    Edit Details
                                  </PremiumButton>
                                  <PremiumButton 
                                    variant="ghost"
                                    size="sm"
                                    onClick={async () => {
                                      const newStatus = client.status === 'Active' ? 'Inactive' : 'Active';
                                      await updateDoc(doc(db, "users", client.id), { status: newStatus });
                                      setOpenUserMenuId(null);
                                      addNotification({
                                        type: 'success',
                                        title: 'Status Updated',
                                        message: `Client ${client.displayName} marked as ${newStatus}`
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2 justify-start min-w-0"
                                    icon={<CheckCircle className="w-4 h-4" />}
                                  >
                                    Mark as {client.status === 'Active' ? 'Inactive' : 'Active'}
                                  </PremiumButton>
                                  <PremiumButton 
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      setDeleteConfirm({
                                        isOpen: true,
                                        id: client.id,
                                        collection: 'users',
                                        title: 'Delete Client',
                                        message: `Are you sure you want to delete client ${client.displayName}? This action cannot be undone.`,
                                        onSuccess: () => setOpenUserMenuId(null)
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 justify-start min-w-0"
                                    icon={<X className="w-4 h-4" />}
                                  >
                                    Delete Client
                                  </PremiumButton>
                                </motion.div>
                              </React.Fragment>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

            {activeUserSubTab === 'Engineers' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredEngineers.map((eng) => (
                  <div key={eng.id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm hover:border-brand-teal/30 transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold text-xl overflow-hidden">
                        {eng.photoURL ? <img src={eng.photoURL} className="w-full h-full object-cover" /> : (eng.displayName?.charAt(0) || eng.email?.charAt(0))}
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <div className="relative">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === eng.id ? null : eng.id);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          
                          <AnimatePresence>
                            {openUserMenuId === eng.id && (
                              <React.Fragment key={`eng-menu-${eng.id}`}>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                <motion.div
                                  key={`eng-menu-content-${eng.id}`}
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                >
                                  <button 
                                    onClick={() => {
                                      setEditingUser(eng);
                                      setOpenUserMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Details
                                  </button>
                                  <button 
                                    onClick={async () => {
                                      const newStatus = eng.status === 'Active' ? 'Inactive' : 'Active';
                                      await updateDoc(doc(db, "users", eng.id), { status: newStatus });
                                      setOpenUserMenuId(null);
                                      addNotification({
                                        type: 'success',
                                        title: 'Status Updated',
                                        message: `Engineer status updated to ${newStatus}`
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <CheckCircle className="w-4 h-4" />
                                    Mark as {eng.status === 'Active' ? 'Inactive' : 'Active'}
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setDeleteConfirm({
                                        isOpen: true,
                                        id: eng.id,
                                        collection: 'users',
                                        title: 'Delete Engineer',
                                        message: `Are you sure you want to delete engineer ${eng.displayName || eng.fullName}? This action cannot be undone.`,
                                        onSuccess: () => setOpenUserMenuId(null)
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <X className="w-4 h-4" />
                                    Delete Engineer
                                  </button>
                                </motion.div>
                              </React.Fragment>
                            )}
                          </AnimatePresence>
                        </div>
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          eng.status === 'Active' ? 'bg-emerald-100 text-emerald-600' : 
                          eng.status === 'Busy' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-400'
                        }`}>
                          {eng.status || 'Active'}
                        </span>
                      </div>
                    </div>
                    <h4 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-brand-teal transition-colors truncate" title={eng.displayName || eng.fullName || 'Unnamed Engineer'}>
                      {eng.displayName || eng.fullName || 'Unnamed Engineer'}
                    </h4>
                    <p className="text-sm text-slate-500 mb-4 truncate" title={`${eng.specialization?.label ?? (typeof eng.specialization === 'string' ? eng.specialization : 'General Engineer')} • ${eng.engineerLevel?.label ?? (typeof eng.engineerLevel === 'string' ? eng.engineerLevel : 'L1')} • ${eng.location || (eng.city?.label ? `${eng.city.label}, ${eng.country?.label}` : (typeof eng.city === 'string' ? `${eng.city}, ${eng.country}` : 'N/A'))}`}>
                      {eng.specialization?.label ?? (typeof eng.specialization === 'string' ? eng.specialization : 'General Engineer')} • {eng.engineerLevel?.label ?? (typeof eng.engineerLevel === 'string' ? eng.engineerLevel : 'L1')} • {eng.location || (eng.city?.label ? `${eng.city.label}, ${eng.country?.label}` : (typeof eng.city === 'string' ? `${eng.city}, ${eng.country}` : 'N/A'))}
                    </p>
                    
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      <div className="text-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[8px] text-slate-400 uppercase font-bold">Hourly</div>
                        <div className="text-xs font-bold text-slate-900">${eng.hourlyRate || '0'}</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[8px] text-slate-400 uppercase font-bold">Half Day</div>
                        <div className="text-xs font-bold text-slate-900">${eng.halfDayRate || '0'}</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="text-[8px] text-slate-400 uppercase font-bold">Full Day</div>
                        <div className="text-xs font-bold text-slate-900">${eng.fullDayRate || '0'}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                      <div className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                        <Star className="w-4 h-4 fill-current" /> {eng.rating || 'N/A'}
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedEngineer(eng);
                          setShowEngineerModal(true);
                        }}
                        className="text-xs font-bold text-brand-teal uppercase tracking-widest hover:underline"
                      >
                        View Profile
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeUserSubTab === 'Staff' && (
              <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
                <div className="overflow-x-auto min-h-[300px]">
                  <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Staff Name</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {staffUsers.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-900">{staff.displayName || staff.email}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{staff.email}</td>
                        <td className="px-4 py-3 text-sm font-bold text-brand-teal uppercase">{staff.role}</td>
                        <td className="px-4 py-3 text-right relative overflow-visible">
                          <PremiumButton 
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === staff.id ? null : staff.id);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0"
                            icon={<MoreVertical className="w-4 h-4" />}
                          />

                          <AnimatePresence>
                            {openUserMenuId === staff.id && (
                              <React.Fragment key={`staff-menu-${staff.id}`}>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                <motion.div
                                  key={`staff-menu-content-${staff.id}`}
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                >
                                  <button 
                                    onClick={() => {
                                      setEditingUser(staff);
                                      setOpenUserMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Edit className="w-4 h-4" />
                                    Edit Details
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setDeleteConfirm({
                                        isOpen: true,
                                        id: staff.id,
                                        collection: 'users',
                                        title: 'Delete Staff Member',
                                        message: `Are you sure you want to delete staff member ${staff.displayName || staff.email}? This action cannot be undone.`,
                                        onSuccess: () => setOpenUserMenuId(null)
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Staff
                                  </button>
                                </motion.div>
                              </React.Fragment>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </div>
        );
      case 'Tickets':
        const ticketSubTabs = [
          { id: 'Pending', label: 'New Tickets', icon: Clock },
          { id: 'Approved', label: 'Approved', icon: CheckCircle },
          { id: 'Waiting for client approval', label: 'Waiting for Approval', icon: Clock },
          { id: 'Rejected', label: 'Rejected', icon: X },
          { id: 'Quote Accepted', label: 'Assign Engineer', icon: HardHat },
          { id: 'In Progress', label: 'In Progress', icon: Play },
          { id: 'Waiting for Confirmation', label: 'Waiting for Confirmation', icon: Clock },
          { id: 'Completed', label: 'Completed', icon: CheckCircle }
        ];

        const filteredTickets = tickets.filter(ticket => {
          const matchesSearch = (ticket.subject?.toLowerCase() || '').includes(ticketSearch.toLowerCase()) ||
                               (ticket.title?.toLowerCase() || '').includes(ticketSearch.toLowerCase()) ||
                               (ticket.clientName?.toLowerCase() || '').includes(ticketSearch.toLowerCase()) ||
                               (ticket.clientEmail?.toLowerCase() || '').includes(ticketSearch.toLowerCase());
          
          const matchesPriority = ticketPriorityFilter === 'All' || ticket.priority === ticketPriorityFilter;
          const matchesCategory = ticketCategoryFilter === 'All' || ticket.category === ticketCategoryFilter;

          let matchesDate = true;
          if (ticketDateFilter !== 'All') {
            const ticketDate = ticket.createdAt?.toDate ? ticket.createdAt.toDate() : new Date();
            const now = new Date();
            if (ticketDateFilter === 'Today') {
              matchesDate = ticketDate.toDateString() === now.toDateString();
            } else if (ticketDateFilter === 'This Week') {
              const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
              matchesDate = ticketDate >= weekAgo;
            } else if (ticketDateFilter === 'This Month') {
              matchesDate = ticketDate.getMonth() === now.getMonth() && ticketDate.getFullYear() === now.getFullYear();
            }
          }

          if (activeTicketSubTab === 'In Progress') {
            return matchesSearch && matchesPriority && matchesCategory && matchesDate && (ticket.status === 'In Progress' || ticket.status === 'On Site');
          }
          return matchesSearch && matchesPriority && matchesCategory && matchesDate && ticket.status === activeTicketSubTab;
        });

        return (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold text-black">Service Tickets</h3>
                <p className="text-xs text-slate-500 mt-1">Manage and track all service requests</p>
              </div>
              <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
                {(ticketSearch || activeTicketSubTab !== 'Pending' || ticketPriorityFilter !== 'All' || ticketCategoryFilter !== 'All' || ticketDateFilter !== 'All') && (
                  <button 
                    onClick={() => {
                      setTicketSearch('');
                      setActiveTicketSubTab('Pending');
                      setTicketPriorityFilter('All');
                      setTicketCategoryFilter('All');
                      setTicketDateFilter('All');
                    }}
                    className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
                <CustomDropdown 
                  value={ticketDateFilter}
                  onChange={setTicketDateFilter}
                  options={[
                    { value: 'All', label: 'All Time' },
                    { value: 'Today', label: 'Today' },
                    { value: 'This Week', label: 'This Week' },
                    { value: 'This Month', label: 'This Month' }
                  ]}
                  icon={<Calendar className="w-4 h-4" />}
                />
                <CustomDropdown 
                  value={ticketPriorityFilter}
                  onChange={setTicketPriorityFilter}
                  options={[
                    { value: 'All', label: 'All Priority' },
                    { value: 'Critical (SLA)', label: 'Critical (SLA)' },
                    { value: 'High', label: 'High' },
                    { value: 'Medium', label: 'Medium' },
                    { value: 'Low', label: 'Low' }
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                />
                <CustomDropdown 
                  value={ticketCategoryFilter}
                  onChange={setTicketCategoryFilter}
                  options={[
                    { value: 'All', label: 'All Categories' },
                    { value: 'Hardware', label: 'Hardware' },
                    { value: 'Software', label: 'Software' },
                    { value: 'Network', label: 'Network' },
                    { value: 'Security', label: 'Security' },
                    { value: 'Other', label: 'Other' }
                  ]}
                  icon={<Filter className="w-4 h-4" />}
                />
                <PremiumButton 
                  onClick={() => handleExportTickets(filteredTickets)}
                  variant="ghost"
                  className="!text-brand-teal !font-bold !text-sm !px-3 !py-1 !rounded-lg"
                  icon={<FileText className="w-4 h-4" />}
                >
                  Export Report
                </PremiumButton>
                <div className="relative flex-1 md:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text" 
                    placeholder="Search subject or client..." 
                    value={ticketSearch}
                    onChange={(e) => setTicketSearch(e.target.value)}
                    className="w-full md:w-64 pl-10 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-brand-teal/50"
                  />
                </div>
              </div>
            </div>

            {/* Ticket Sub-Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-2xl w-full md:w-fit overflow-x-auto whitespace-nowrap custom-scrollbar">
              {ticketSubTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTicketSubTab(tab.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                    activeTicketSubTab === tab.id
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                  {tickets.filter(t => {
                    if (tab.id === 'All') return true;
                    if (tab.id === 'In Progress') return t.status === 'In Progress' || t.status === 'On Site';
                    return t.status === tab.id;
                  }).length > 0 && (
                    <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeTicketSubTab === tab.id ? 'bg-brand-teal/10 text-brand-teal' : 'bg-slate-200 text-slate-500'
                    }`}>
                      {tickets.filter(t => {
                        if (tab.id === 'All') return true;
                        if (tab.id === 'In Progress') return t.status === 'In Progress' || t.status === 'On Site';
                        return t.status === tab.id;
                      }).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket ID</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Priority</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Created</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedTicket(ticket);
                        setShowTicketModal(true);
                      }}
                    >
                      <td className="px-4 py-3 font-bold text-brand-teal text-sm flex items-center gap-2">
                        TK-{ticket.id.slice(0, 4).toUpperCase()}
                        {ticket.createdAt && (new Date().getTime() - (ticket.createdAt?.seconds ? ticket.createdAt.seconds * 1000 : new Date(ticket.createdAt).getTime()) < 24 * 60 * 60 * 1000) && (
                          <span className="px-1.5 py-0.5 bg-brand-teal text-brand-dark text-[8px] font-black uppercase rounded">New</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col min-w-0">
                          <span className="font-bold text-slate-900 truncate">
                            {ticket.clientName && ticket.clientName !== 'Unknown Client' 
                              ? ticket.clientName 
                              : (ticket.clientEmail || 'Unknown Client')}
                          </span>
                          {ticket.clientEmail && ticket.clientEmail !== ticket.clientName && (
                            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest truncate">{ticket.clientEmail}</span>
                          )}
                        </div>
                      </td>
                      <td className={`px-4 py-3 text-sm transition-all duration-500 max-w-[200px] ${ticket.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-600'}`}>
                        <p className="truncate">{ticket.subject || ticket.title}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          ticket.priority === 'Critical (SLA)' ? 'bg-rose-100 text-rose-600' :
                          ticket.priority === 'High' ? 'bg-orange-100 text-orange-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {ticket.priority}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          ticket.status === 'Completed' ? 'bg-slate-100 text-slate-400' : 
                          ticket.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                          ticket.status === 'On Site' ? 'bg-amber-100 text-amber-600' :
                          ticket.status === 'Waiting for Confirmation' ? 'bg-brand-teal/10 text-brand-teal' :
                          ticket.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                          ticket.status === 'Rejected' ? 'bg-rose-100 text-rose-600' :
                          ticket.status === 'Waiting for client approval' ? 'bg-purple-100 text-purple-600' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {ticket.createdAt ? (
                          ticket.createdAt.seconds 
                            ? new Date(ticket.createdAt.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                            : new Date(ticket.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
                        ) : 'N/A'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {ticket.status === 'Pending' && (
                            <div className="flex items-center gap-1 mr-2">
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await updateDoc(doc(db, "tickets", ticket.id), {
                                      status: 'Approved',
                                      updatedAt: serverTimestamp(),
                                      updates: [
                                        ...(ticket.updates || []),
                                        { text: 'Ticket approved by administrator.', timestamp: new Date().toISOString() }
                                      ]
                                    });
                                    addNotification({
                                      type: 'success',
                                      title: 'Ticket Approved',
                                      message: `Ticket TK-${ticket.id.slice(0,4).toUpperCase()} has been approved.`
                                    });
                                  } catch (err) {
                                    handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticket.id}`);
                                  }
                                }}
                                className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                                title="Quick Approve"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    await updateDoc(doc(db, "tickets", ticket.id), {
                                      status: 'Rejected',
                                      updatedAt: serverTimestamp(),
                                      updates: [
                                        ...(ticket.updates || []),
                                        { text: 'Ticket rejected by administrator.', timestamp: new Date().toISOString() }
                                      ]
                                    });
                                    addNotification({
                                      type: 'system',
                                      title: 'Ticket Rejected',
                                      message: `Ticket TK-${ticket.id.slice(0,4).toUpperCase()} has been rejected.`
                                    });
                                  } catch (err) {
                                    handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticket.id}`);
                                  }
                                }}
                                className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all"
                                title="Quick Reject"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                          <div className="relative inline-block text-left">
                            <PremiumButton 
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenUserMenuId(openUserMenuId === ticket.id ? null : ticket.id);
                              }}
                              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0"
                              icon={<MoreVertical className="w-4 h-4" />}
                            />
                          
                          <AnimatePresence>
                            {openUserMenuId === ticket.id && (
                              <React.Fragment key={`ticket-menu-${ticket.id}`}>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                <motion.div
                                  key={`ticket-menu-content-${ticket.id}`}
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                >
                                  <button 
                                    onClick={() => {
                                      setSelectedTicket(ticket);
                                      setShowTicketModal(true);
                                      setOpenUserMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  
                                  {ticket.status === 'Pending' && (
                                    <>
                                      <button 
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          try {
                                            await updateDoc(doc(db, "tickets", ticket.id), {
                                              status: 'Waiting for client approval',
                                              updatedAt: serverTimestamp(),
                                              updates: [
                                                ...(ticket.updates || []),
                                                { text: 'Ticket status changed to Waiting for client approval.', timestamp: new Date().toISOString() }
                                              ]
                                            });
                                            setOpenUserMenuId(null);
                                            addNotification({
                                              type: 'system',
                                              title: 'Status Updated',
                                              message: `Ticket TK-${ticket.id.slice(0,4).toUpperCase()} is now waiting for client approval.`
                                            });
                                          } catch (err) {
                                            handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticket.id}`);
                                          }
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-purple-600 hover:bg-purple-50 flex items-center gap-2"
                                      >
                                        <Clock className="w-4 h-4" />
                                        Wait for Approval
                                      </button>

                                      <button 
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          try {
                                            await updateDoc(doc(db, "tickets", ticket.id), {
                                              status: 'Approved',
                                              updatedAt: serverTimestamp(),
                                              updates: [
                                                ...(ticket.updates || []),
                                                { text: 'Ticket approved by administrator.', timestamp: new Date().toISOString() }
                                              ]
                                            });
                                            setOpenUserMenuId(null);
                                            addNotification({
                                              type: 'success',
                                              title: 'Ticket Approved',
                                              message: `Ticket TK-${ticket.id.slice(0,4).toUpperCase()} has been approved.`
                                            });
                                          } catch (err) {
                                            handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticket.id}`);
                                          }
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                        Approve Ticket
                                      </button>

                                      <button 
                                        onClick={async (e) => {
                                          e.stopPropagation();
                                          try {
                                            await updateDoc(doc(db, "tickets", ticket.id), {
                                              status: 'Rejected',
                                              updatedAt: serverTimestamp(),
                                              updates: [
                                                ...(ticket.updates || []),
                                                { text: 'Ticket rejected by administrator.', timestamp: new Date().toISOString() }
                                              ]
                                            });
                                            setOpenUserMenuId(null);
                                            addNotification({
                                              type: 'system',
                                              title: 'Ticket Rejected',
                                              message: `Ticket TK-${ticket.id.slice(0,4).toUpperCase()} has been rejected.`
                                            });
                                          } catch (err) {
                                            handleFirestoreError(err, OperationType.UPDATE, `tickets/${ticket.id}`);
                                          }
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                      >
                                        <X className="w-4 h-4" />
                                        Reject Ticket
                                      </button>
                                    </>
                                  )}
                                </motion.div>
                              </React.Fragment>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                    </tr>
                  ))}
                  {filteredTickets.length === 0 && (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                        No tickets matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
      case 'Completed Jobs':
        const completedTickets = tickets.filter(t => t.status === 'Completed');
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-black">Completed Jobs History</h3>
              <PremiumButton 
                onClick={handleExportReport}
                variant="ghost"
                className="!text-brand-teal !font-bold !text-sm !px-3 !py-1 !rounded-lg"
                icon={<FileText className="w-4 h-4" />}
              >
                Export Report
              </PremiumButton>
            </div>
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Job ID</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Subject</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Engineer</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Completed</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {completedTickets.map((job) => (
                      <tr 
                        key={job.id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer"
                        onClick={() => {
                          setSelectedTicket(job);
                          setShowTicketModal(true);
                        }}
                      >
                        <td className="px-4 py-3 font-bold text-slate-900 text-sm">JB-{job.id.slice(0, 4).toUpperCase()}</td>
                        <td className="px-4 py-3 text-sm text-slate-400 line-through">{job.subject}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{job.clientName}</td>
                        <td className="px-4 py-3 text-sm text-slate-600">{job.engineerName || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">{job.serviceType?.label ?? (typeof job.serviceType === 'string' ? job.serviceType : (job.serviceType || 'N/A'))}</td>
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {formatDate(job.updatedAt || job.completedAt)}
                        </td>
                        <td className="px-4 py-3 text-right relative overflow-visible">
                          <PremiumButton 
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenUserMenuId(openUserMenuId === job.id ? null : job.id);
                            }}
                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0"
                            icon={<MoreVertical className="w-4 h-4" />}
                          />

                          <AnimatePresence>
                            {openUserMenuId === job.id && (
                              <React.Fragment key={`job-menu-${job.id}`}>
                                <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                <motion.div
                                  key={`job-menu-content-${job.id}`}
                                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                  className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                >
                                  <button 
                                    onClick={() => {
                                      setSelectedTicket(job);
                                      setShowTicketModal(true);
                                      setOpenUserMenuId(null);
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                  >
                                    <Eye className="w-4 h-4" />
                                    View Details
                                  </button>
                                  <button 
                                    onClick={() => {
                                      setDeleteConfirm({
                                        isOpen: true,
                                        id: job.id,
                                        collection: 'tickets',
                                        title: 'Delete Job',
                                        message: 'Are you sure you want to delete this job? This action cannot be undone.',
                                        onSuccess: () => setOpenUserMenuId(null)
                                      });
                                    }}
                                    className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                    Delete Job
                                  </button>
                                </motion.div>
                              </React.Fragment>
                            )}
                          </AnimatePresence>
                        </td>
                      </tr>
                    ))}
                    {completedTickets.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-medium">
                          No completed jobs found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Quotations':
        return <QuotationPortal role="admin" />;
      case 'Opportunities':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Opportunities Management</h2>
                <p className="text-sm text-slate-500">Review and manage client-submitted opportunities</p>
              </div>
              <div className="flex items-center gap-3">
                <PremiumButton 
                  onClick={handleExportOpportunities}
                  variant="ghost"
                  className="!text-brand-teal !font-bold !text-[10px] !px-3 !py-1.5 !rounded-xl"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Export Report
                </PremiumButton>
                <div className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100 flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="text-xs font-bold uppercase tracking-widest">{pendingOppsCount} Pending Review</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
              <div className="overflow-x-auto min-h-[300px]">
                <table className="w-full text-left min-w-[800px]">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Opportunity Details</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Client</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Location & Budget</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {opportunities.map((opp) => (
                      <tr 
                        key={opp.id} 
                        onClick={() => {
                          setSelectedOpportunity(opp);
                          setShowOpportunityModal(true);
                        }}
                        className="hover:bg-slate-50 transition-colors group cursor-pointer"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 shrink-0 group-hover:bg-white group-hover:shadow-sm transition-all">
                              <Briefcase className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{opp.title}</p>
                              <p className="text-xs text-slate-500 truncate">{opp.type} • {opp.createdAt?.toDate ? opp.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'N/A'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-700">{opp.clientName}</span>
                            <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">{opp.clientEmail}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-1 text-sm text-slate-600">
                              <MapPin className="w-3 h-3" />
                              <span>{opp.location || 'Remote'}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-brand-teal font-bold">
                              <DollarSign className="w-3 h-3" />
                              <span>{opp.budget || 'N/A'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                            opp.status === 'Under Review' ? 'bg-blue-100 text-blue-600' :
                            opp.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                            'bg-slate-100 text-slate-400'
                          }`}>
                            {opp.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {opp.status === 'Under Review' && (
                              <div className="flex items-center gap-1 mr-2">
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await updateDoc(doc(db, "opportunities", opp.id), { 
                                      status: 'Active',
                                      updatedAt: serverTimestamp()
                                    });
                                    addNotification({
                                      type: 'success',
                                      title: 'Opportunity Approved',
                                      message: `"${opp.title}" is now active.`
                                    });
                                  }}
                                  className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 transition-all"
                                  title="Quick Approve"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button 
                                  onClick={async (e) => {
                                    e.stopPropagation();
                                    await updateDoc(doc(db, "opportunities", opp.id), { 
                                      status: 'Rejected',
                                      updatedAt: serverTimestamp()
                                    });
                                    addNotification({
                                      type: 'system',
                                      title: 'Opportunity Rejected',
                                      message: `"${opp.title}" has been rejected.`
                                    });
                                  }}
                                  className="p-1.5 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 transition-all"
                                  title="Quick Reject"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                            <div className="relative inline-block text-left">
                              <PremiumButton 
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenUserMenuId(openUserMenuId === opp.id ? null : opp.id);
                                }}
                                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-400 min-w-0"
                                icon={<MoreVertical className="w-4 h-4" />}
                              />
                            
                            <AnimatePresence>
                              {openUserMenuId === opp.id && (
                                <React.Fragment key={`opp-menu-${opp.id}`}>
                                  <div className="fixed inset-0 z-40" onClick={() => setOpenUserMenuId(null)} />
                                  <motion.div
                                    key={`opp-menu-content-${opp.id}`}
                                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                    className="absolute right-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden text-left"
                                  >
                                    <button 
                                      onClick={() => {
                                        setSelectedOpportunity(opp);
                                        setShowOpportunityModal(true);
                                        setOpenUserMenuId(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                                    >
                                      <Eye className="w-4 h-4" />
                                      View Details
                                    </button>
                                    {opp.status === 'Under Review' && (
                                      <>
                                        <button 
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await updateDoc(doc(db, "opportunities", opp.id), { 
                                              status: 'Active',
                                              updatedAt: serverTimestamp()
                                            });
                                            setOpenUserMenuId(null);
                                            addNotification({
                                              type: 'success',
                                              title: 'Opportunity Approved',
                                              message: `"${opp.title}" is now active.`
                                            });
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                          Approve
                                        </button>
                                        <button 
                                          onClick={async (e) => {
                                            e.stopPropagation();
                                            await updateDoc(doc(db, "opportunities", opp.id), { 
                                              status: 'Rejected',
                                              updatedAt: serverTimestamp()
                                            });
                                            setOpenUserMenuId(null);
                                            addNotification({
                                              type: 'system',
                                              title: 'Opportunity Rejected',
                                              message: `"${opp.title}" has been rejected.`
                                            });
                                          }}
                                          className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                        >
                                          <X className="w-4 h-4" />
                                          Reject
                                        </button>
                                      </>
                                    )}
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteConfirm({
                                          isOpen: true,
                                          id: opp.id,
                                          collection: 'opportunities',
                                          title: 'Delete Opportunity',
                                          message: 'Are you sure you want to delete this opportunity? This action cannot be undone.',
                                          onSuccess: () => setOpenUserMenuId(null)
                                        });
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                      Delete
                                    </button>
                                  </motion.div>
                                </React.Fragment>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </td>
                      </tr>
                    ))}
                    {opportunities.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Briefcase className="w-8 h-8 text-slate-300" />
                          </div>
                          <p className="text-slate-400 font-medium">No opportunities found</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      case 'Post a Job':
        return (
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Main Editor Area */}
              <div className="flex-1 space-y-6">
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-6">
                    <div className="space-y-6">
                      {/* Job Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Country</label>
                          <CustomDropdown 
                            value={newJobCountry}
                            onChange={(val) => {
                              setNewJobCountry(val);
                              setNewJobCity('');
                            }}
                            options={allCountries}
                            icon={<Globe className="w-4 h-4" />}
                            className="w-full"
                            searchable={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">City</label>
                          <CustomDropdown 
                            value={newJobCity}
                            onChange={setNewJobCity}
                            options={allCities}
                            icon={<MapPin className="w-4 h-4" />}
                            className="w-full"
                            searchable={true}
                            placeholder="Select city..."
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Technician Type</label>
                          <CustomDropdown 
                            value={newJobTechnicianType}
                            onChange={setNewJobTechnicianType}
                            options={[
                              { value: 'Network', label: 'Network Technician' },
                              { value: 'Desktop', label: 'Desktop Technician' },
                              { value: 'Both', label: 'Both' },
                            ]}
                            icon={<HardHat className="w-4 h-4" />}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Language</label>
                          <CustomDropdown 
                            value={newJobLanguage}
                            onChange={setNewJobLanguage}
                            options={allLanguages}
                            icon={<MessageSquare className="w-4 h-4" />}
                            className="w-full"
                            searchable={true}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Language Requirement</label>
                          <CustomDropdown 
                            value={newJobLanguageRequirement}
                            onChange={setNewJobLanguageRequirement}
                            options={[
                              { value: 'A1', label: 'A1' },
                              { value: 'A2', label: 'A2' },
                              { value: 'B1', label: 'B1' },
                              { value: 'B2', label: 'B2' },
                              { value: 'C1', label: 'C1' },
                              { value: 'C2', label: 'C2' },
                              { value: 'Native', label: 'Native' },
                            ]}
                            icon={<CheckCircle className="w-4 h-4" />}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Service Type</label>
                          <CustomDropdown 
                            value={newJobServiceType}
                            onChange={setNewJobServiceType}
                            options={[
                              { value: 'hourly', label: 'Hourly' },
                              { value: 'half day', label: 'Half Day' },
                              { value: 'full day', label: 'Full Day' },
                              { value: 'project based', label: 'Project Based' },
                              { value: 'monthly', label: 'Monthly' },
                            ]}
                            icon={<Clock className="w-4 h-4" />}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engineer Level (Optional)</label>
                          <CustomDropdown 
                            value={newJobEngineerLevel}
                            onChange={setNewJobEngineerLevel}
                            options={[
                              { value: 'L1', label: 'L1 (Level 1)' },
                              { value: 'L2', label: 'L2 (Level 2)' },
                              { value: 'L3', label: 'L3 (Level 3)' },
                              { value: 'All', label: 'All of the above' }
                            ]}
                            icon={<HardHat className="w-4 h-4" />}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Engineers Required</label>
                          <CustomDropdown 
                            value={newJobEngineersCount}
                            onChange={setNewJobEngineersCount}
                            options={[
                              { value: '1', label: '1' },
                              { value: '2', label: '2' },
                              { value: '3', label: '3' },
                              { value: '4', label: '4' },
                              { value: '5', label: '5' },
                              { value: '6', label: '6' },
                              { value: '7', label: '7' },
                              { value: '8', label: '8' },
                              { value: '9', label: '9' },
                              { value: '10', label: '10' },
                            ]}
                            icon={<Users className="w-4 h-4" />}
                            className="w-full"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rate (Optional)</label>
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                <DollarSign className="w-4 h-4" />
                              </div>
                              <input 
                                type="text"
                                value={newJobRate}
                                onChange={(e) => setNewJobRate(e.target.value)}
                                placeholder="e.g. 50"
                                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-brand-teal/50 transition-all"
                              />
                            </div>
                            <div className="w-24">
                              <CustomDropdown 
                                value={newJobCurrency}
                                onChange={setNewJobCurrency}
                                options={[
                                  { value: 'EUR', label: '€ EUR' },
                                  { value: 'USD', label: '$ USD' },
                                ]}
                                className="w-full"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Job Description</label>
                        <textarea 
                          value={newJobDescription}
                          onChange={(e) => setNewJobDescription(e.target.value)}
                          placeholder="Describe the role, requirements, and benefits..."
                          className="w-full min-h-[200px] bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-medium outline-none focus:border-brand-teal/50 transition-all resize-none leading-relaxed"
                        />
                      </div>

                      <FileUpload 
                        label="Job Attachments (Images/Documents)"
                        existingFiles={newJobAttachments}
                        onFilesSelected={(newFiles) => setNewJobAttachments(prev => [...prev, ...newFiles])}
                        onRemoveFile={(idx) => setNewJobAttachments(prev => prev.filter((_, i) => i !== idx))}
                      />
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex gap-4">
                    </div>
                    <div className="flex items-center gap-3">
                      <PremiumButton 
                        onClick={handlePostJob}
                        disabled={!newJobDescription.trim()}
                        variant="primary"
                        glow
                        className="!px-8 !py-2.5 !rounded-xl !text-sm shadow-lg shadow-teal-500/20"
                      >
                        Post Job
                      </PremiumButton>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Settings - Removed as per user request */}
            </div>

            {/* Recent Job Postings */}
            <div className="mt-8 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-slate-900">Recent Job Postings</h3>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full text-[10px] font-bold">
                    {jobPostings.length} Total
                  </span>
                </div>
                <PremiumButton 
                  onClick={handleExportJobs}
                  variant="ghost"
                  className="!text-brand-teal !font-bold !text-[10px] !px-4 !py-2 !rounded-xl"
                  icon={<Download className="w-3.5 h-3.5" />}
                >
                  Export Report
                </PremiumButton>
              </div>

              <div className="grid grid-cols-1 gap-6">
                {jobPostings.map((job) => (
                  <div key={job.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden group hover:border-brand-teal/30 transition-all">
                    <div className="flex flex-col">
                      {job.imageUrl && (
                        <div className="w-full bg-slate-50 border-b border-slate-100">
                          <img 
                            src={job.imageUrl} 
                            className="w-full h-auto max-h-[800px] object-contain block mx-auto" 
                            alt={job.title} 
                          />
                        </div>
                      )}
                      
                      {job.attachments && job.attachments.length > 0 && (
                        <div className="px-6 pt-3 flex flex-wrap gap-2">
                          {job.attachments.map((file: any, idx: number) => (
                            <a 
                              key={idx}
                              href={file.data}
                              download={file.name}
                              title={`Download ${file.name}`}
                              className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-brand-teal/30 hover:bg-teal-50/30 transition-all group"
                            >
                              {file.type?.startsWith('image/') ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-5 h-5 rounded bg-slate-200 overflow-hidden border border-slate-300">
                                    <img src={file.data} alt="Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <span className="font-medium text-slate-500">Image Attachment</span>
                                </div>
                              ) : (
                                <>
                                  <FileText className="w-3 h-3 text-slate-400 group-hover:text-brand-teal" />
                                  <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                                </>
                              )}
                              <Download className="w-3 h-3 text-slate-400 group-hover:text-brand-teal ml-1" />
                            </a>
                          ))}
                        </div>
                      )}
                      <div className="p-6 space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-0.5">
                            <h4 className="text-xl font-bold text-slate-900">{job.title || 'New Opportunity'}</h4>
                            <div className="flex items-center gap-3 text-xs text-slate-500">
                              <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {job.company || 'Desknet'}</span>
                              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {job.createdAt?.toDate ? job.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Just now'}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => {
                                setSelectedJobForApplicants(job);
                                setShowApplicantsModal(true);
                              }}
                              className="px-4 py-2 bg-brand-teal/10 text-brand-teal rounded-xl text-xs font-bold hover:bg-brand-teal/20 transition-all flex items-center gap-2"
                              title="View Applicants"
                            >
                              <Users className="w-4 h-4" />
                              <span>{applications.filter(app => app.jobId === job.id).length} Applicants</span>
                            </button>
                            <button 
                              onClick={() => {
                                const countryCode = Country.getAllCountries().find(c => c.name === job.country || c.isoCode === job.country)?.isoCode || 'US';
                                setEditingJob({
                                  ...job,
                                  country: countryCode
                                });
                              }}
                              className="p-3 text-slate-400 hover:text-brand-teal hover:bg-brand-teal/10 rounded-2xl transition-all"
                              title="Edit Posting"
                            >
                              <Edit className="w-5 h-5" />
                            </button>
                            <button 
                              onClick={() => handleDeleteJob(job.id)}
                              className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                              title="Delete Posting"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        
                        <div className="prose prose-slate max-w-none">
                          <p className="text-base text-slate-600 leading-relaxed whitespace-pre-wrap break-words">
                            {job.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {jobPostings.length === 0 && (
                  <div className="text-center py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-slate-300" />
                    </div>
                    <p className="text-slate-500 font-medium">No job postings yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      case 'Messages':
        const adminUser = {
          uid: 'admin_desklink',
          email: 'admin@desklink.com',
          displayName: 'Admin',
          role: 'admin'
        };
        return <MessagingSystem currentUser={adminUser} role="admin" allUsers={users} />;
      case 'Billing & Invoices':
        return (
          <BillingInvoices 
            invoices={invoices}
            setShowAddInvoiceModal={setShowAddInvoiceModal}
            onUpdateInvoiceStatus={handleUpdateInvoiceStatus}
            onDeleteInvoice={handleDeleteInvoice}
          />
        );
      default:
        return (
          <div className="bg-white rounded-3xl border border-slate-200 p-20 flex flex-col items-center justify-center text-center space-y-6 shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200">
              <BarChart3 className="w-12 h-12" />
            </div>
            <div className="max-w-md">
              <h3 className="text-2xl font-bold text-black mb-2">{activeTab}</h3>
              <p className="text-slate-500">This management module is currently being populated with real-time data from the Desknet global network. Check back shortly for full administrative controls.</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex">
      <AnimatePresence>
        {showSuccessAnimation && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
          >
            <motion.div 
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
              className="bg-white p-12 rounded-[3rem] shadow-2xl flex flex-col items-center space-y-6"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-500">
                <motion.div
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <CheckCircle className="w-16 h-16" />
                </motion.div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900">The job is completed</h3>
                <p className="text-slate-500 font-medium">The ticket has been successfully closed.</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-[60] lg:hidden md:backdrop-blur-sm backdrop-blur-none"
          />
        )}
      </AnimatePresence>

      <motion.aside 
        initial={false}
        animate={{ 
          width: isSidebarOpen ? 280 : 80,
          x: typeof window !== 'undefined' && window.innerWidth < 1024 ? (isMobileSidebarOpen ? 0 : -280) : 0
        }}
        className={`bg-slate-900 flex flex-col z-[70] shadow-2xl transition-all duration-300 fixed lg:sticky top-0 h-screen`}
      >
        <div className="p-8 flex items-center justify-between">
          {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && <Logo />}
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="hidden lg:block p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                if (window.innerWidth < 1024) setIsMobileSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 p-3.5 rounded-xl transition-all group relative ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white font-bold shadow-lg shadow-blue-600/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'}`} />
              {(isSidebarOpen || (typeof window !== 'undefined' && window.innerWidth < 1024)) && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="text-sm">{item.id}</span>
                  {item.id === 'Messages' && unreadMessagesCount > 0 && (
                    <span className="bg-brand-teal text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-brand-teal/20">
                      {unreadMessagesCount}
                    </span>
                  )}
                  {item.id !== 'Messages' && item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-rose-500/20">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button 
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-4 p-3.5 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            {isSidebarOpen && <span className="text-sm font-bold uppercase tracking-widest">Logout</span>}
          </button>
        </div>
      </motion.aside>

      <LogoutConfirmModal 
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title="Confirm Admin Logout"
        message="Are you sure you want to log out of the administrator dashboard?"
        confirmLabel="Log Out"
        cancelLabel="Cancel"
      />

      <DeleteConfirmModal 
        isOpen={deleteConfirm.isOpen}
        onClose={() => setDeleteConfirm(prev => ({ ...prev, isOpen: false }))}
        onConfirm={handleConfirmDelete}
        title={deleteConfirm.title}
        message={deleteConfirm.message}
      />

      <ApplicantsModal 
        isOpen={showApplicantsModal}
        onClose={() => {
          setShowApplicantsModal(false);
          setSelectedJobForApplicants(null);
        }}
        job={selectedJobForApplicants}
        applications={applications}
        users={users}
      />

      {/* Main Content Area */}
      <main className={`flex-1 flex flex-col min-w-0 ${activeTab === 'Messages' ? 'h-screen overflow-hidden' : 'overflow-y-auto'}`}>
        {/* Top Bar with Breadcrumbs */}
        <div className="flex items-center justify-between px-6 md:px-12 py-4 md:py-8 z-40 gap-4 bg-white/50 md:backdrop-blur-sm backdrop-blur-none sticky top-0 border-b border-slate-100/50">
          <div className="flex items-center gap-3 md:gap-4 min-w-0">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm shrink-0"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex flex-col min-w-0">
              <h2 className="text-lg md:text-xl font-black text-black leading-none mb-1 truncate">
                {activeTab + (activeTab === 'Messages' && unreadMessagesCount > 0 ? ` (${unreadMessagesCount})` : '')}
              </h2>
              <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                <button 
                  onClick={() => setActiveTab('Dashboard')}
                  className="hover:text-brand-teal transition-colors"
                >
                  Admin Portal
                </button>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="text-brand-teal truncate">
                  {activeTab}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 shrink-0">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Network Live</span>
            </div>

            <div className="flex items-center gap-2 md:gap-3">
              <NotificationDropdown onViewAllActivity={handleViewAllActivity} />

              <button 
                onClick={() => setShowLogoutConfirm(true)}
                className="w-9 h-9 md:w-10 md:h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all shrink-0 shadow-sm"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>



        <div className={`${activeTab === 'Messages' ? 'flex-1 flex flex-col min-h-0' : 'p-6 md:p-12 pt-4 md:pt-6 max-w-[1600px] mx-auto w-full'}`}>
          {renderContent()}
        </div>
      </main>

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
                  <h3 className="text-xl font-bold text-black">Add New {newUser.role.charAt(0).toUpperCase() + newUser.role.slice(1)}</h3>
                  <button onClick={() => setShowAddUserModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form className="space-y-6" onSubmit={handleAddUser}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Username</label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="text" 
                          value={newUser.username}
                          onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                          placeholder="Enter username" 
                          className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                          required
                        />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input 
                        type="email" 
                        value={newUser.email}
                        onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                        placeholder="user@company.com" 
                        className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                        required
                      />
                    </div>
                  </div>
                  {(newUser.role === 'staff' || newUser.role === 'admin') && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input 
                          type="password" 
                          value={newUser.password}
                          onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                          placeholder="Enter password" 
                          className="w-full p-3 !pl-16 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Role</label>
                    <CustomDropdown 
                      value={newUser.role}
                      onChange={(val) => setNewUser({...newUser, role: val})}
                      options={[
                        { value: 'staff', label: 'Staff' },
                        { value: 'admin', label: 'Admin' }
                      ]}
                      className="w-full"
                    />
                  </div>
                  <PremiumButton 
                    type="submit"
                    variant="primary"
                    glow
                    className="w-full !py-4 !rounded-xl shadow-lg shadow-brand-teal/20"
                  >
                    Create User
                  </PremiumButton>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Invoice Modal */}
      <AnimatePresence>
        {showAddInvoiceModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddInvoiceModal(false)}
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
                  <h3 className="text-xl font-bold text-black">Create New Invoice</h3>
                  <button onClick={() => setShowAddInvoiceModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <form className="space-y-6" onSubmit={handleCreateInvoice}>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Name</label>
                    <input 
                      type="text" 
                      value={newInvoice.clientName}
                      onChange={(e) => setNewInvoice({...newInvoice, clientName: e.target.value})}
                      placeholder="Enter client name" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Client Email</label>
                    <input 
                      type="email" 
                      value={newInvoice.clientEmail}
                      onChange={(e) => setNewInvoice({...newInvoice, clientEmail: e.target.value})}
                      placeholder="client@company.com" 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Amount ($)</label>
                      <input 
                        type="text" 
                        value={newInvoice.amount}
                        onChange={(e) => setNewInvoice({...newInvoice, amount: e.target.value})}
                        placeholder="0.00" 
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Due Date</label>
                      <input 
                        type="date" 
                        value={newInvoice.dueDate}
                        onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({...newInvoice, description: e.target.value})}
                      placeholder="Invoice description..." 
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all resize-none" 
                      rows={3}
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full py-4 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-teal-300 transition-all shadow-lg shadow-brand-teal/20"
                  >
                    Create Invoice
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Engineer Detail Modal */}
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
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Detailed registration information</p>
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
                  <div className="flex-1 text-center md:text-left min-w-0">
                    <h2 className="text-2xl font-bold text-slate-900 mb-2 truncate" title={selectedEngineer.displayName || selectedEngineer.fullName}>{selectedEngineer.displayName || selectedEngineer.fullName}</h2>
                    <p className="text-brand-teal font-bold mb-4 truncate" title={selectedEngineer.specialization?.label ?? (typeof selectedEngineer.specialization === 'string' ? selectedEngineer.specialization : 'IT Professional')}>
                      {selectedEngineer.specialization?.label ?? (typeof selectedEngineer.specialization === 'string' ? selectedEngineer.specialization : 'IT Professional')}
                    </p>
                    <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-2 min-w-0">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={`${selectedEngineer.city?.label ?? (typeof selectedEngineer.city === 'string' ? selectedEngineer.city : '')}, ${selectedEngineer.country?.label ?? (typeof selectedEngineer.country === 'string' ? selectedEngineer.country : '')}`}>
                          {selectedEngineer.city?.label ?? (typeof selectedEngineer.city === 'string' ? selectedEngineer.city : '')}, {selectedEngineer.country?.label ?? (typeof selectedEngineer.country === 'string' ? selectedEngineer.country : '')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={selectedEngineer.email}>{selectedEngineer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 min-w-0">
                        <Phone className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={`${selectedEngineer.phoneCountryCode?.value ?? (typeof selectedEngineer.phoneCountryCode === 'string' ? selectedEngineer.phoneCountryCode : '')} ${selectedEngineer.phoneNumber}`}>
                          {selectedEngineer.phoneCountryCode?.value ?? (typeof selectedEngineer.phoneCountryCode === 'string' ? selectedEngineer.phoneCountryCode : '')} {selectedEngineer.phoneNumber}
                        </span>
                      </div>
                      {selectedEngineer.whatsappNumber && (
                        <div className="flex items-center gap-2 min-w-0">
                          <MessageCircle className="w-4 h-4 text-emerald-500 shrink-0" />
                          <span className="truncate" title={`${selectedEngineer.whatsappCountryCode?.value ?? (typeof selectedEngineer.whatsappCountryCode === 'string' ? selectedEngineer.whatsappCountryCode : '')} ${selectedEngineer.whatsappNumber} (WhatsApp)`}>
                            {selectedEngineer.whatsappCountryCode?.value ?? (typeof selectedEngineer.whatsappCountryCode === 'string' ? selectedEngineer.whatsappCountryCode : '')} {selectedEngineer.whatsappNumber} (WhatsApp)
                          </span>
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
                    { label: 'Engineer Level', value: selectedEngineer.engineerLevel?.label ?? (typeof selectedEngineer.engineerLevel === 'string' ? selectedEngineer.engineerLevel : 'L1'), icon: User },
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

                {/* Job Completion Statistics */}
                <div className="bg-white border border-slate-100 rounded-[2rem] p-8 space-y-8 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
                        <BarChart3 className="w-6 h-6 text-emerald-500" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Job Completion Performance</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Historical & Current Month Data</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Total Completed</div>
                        <div className="text-2xl font-black text-slate-900">{selectedEngineerStats?.total || 0}</div>
                      </div>
                      <div className="w-px h-10 bg-slate-100 mx-2" />
                      <div className="text-right">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">This Month</div>
                        <div className="text-2xl font-black text-emerald-500">{selectedEngineerStats?.thisMonth || 0}</div>
                      </div>
                    </div>
                  </div>

                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={selectedEngineerStats?.monthlyBreakdown || []}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                          dataKey="name" 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                          dy={10}
                        />
                        <YAxis 
                          axisLine={false} 
                          tickLine={false} 
                          tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip 
                          cursor={{ fill: '#f8fafc' }}
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                          }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#009688" 
                          radius={[6, 6, 0, 0]} 
                          barSize={40}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
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
                {/* Bank Account Details Section */}
                {selectedEngineer.paymentDetails && (
                  <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm">
                        <Library className="w-6 h-6 text-brand-teal" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">Bank Account Details</h4>
                        <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Payment Information</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Payment Method</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.method}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Account Type</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.accountType}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Currency</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.currency}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Bank Name</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.bankName}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Account Holder</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.accountHolder}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Account Number / IBAN</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.accountNumber}</div>
                      </div>
                      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                        <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">SWIFT / BIC Code</div>
                        <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.swiftCode}</div>
                      </div>
                      {selectedEngineer.paymentDetails.routingNumber && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Routing Number</div>
                          <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.routingNumber}</div>
                        </div>
                      )}
                      {selectedEngineer.paymentDetails.bankAddress && (
                        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm sm:col-span-2 lg:col-span-3">
                          <div className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-1">Bank Address</div>
                          <div className="text-sm font-bold text-slate-900">{selectedEngineer.paymentDetails.bankAddress}</div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
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
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mt-1">Review client-submitted project</p>
                </div>
                <button onClick={() => setShowOpportunityModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <OpportunityDetailView 
                  opportunity={selectedOpportunity} 
                  t={t} 
                  language={language} 
                  isAdmin={true}
                />
              </div>
              
              <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50 flex justify-end gap-4">
                {selectedOpportunity.status === 'Under Review' && (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      await updateDoc(doc(db, "opportunities", selectedOpportunity.id), { 
                        status: 'Active',
                        updatedAt: serverTimestamp()
                      });
                      addNotification({
                        type: 'success',
                        title: 'Opportunity Approved',
                        message: `"${selectedOpportunity.title}" is now active.`
                      });
                      setShowOpportunityModal(false);
                    }}
                    className="px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold text-sm hover:bg-emerald-700 transition-all flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Approve Opportunity
                  </button>
                )}
                <button 
                  onClick={() => setShowOpportunityModal(false)}
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Ticket Detail Modal */}
      <AnimatePresence>
        {showTicketModal && selectedTicket && (
          <div className="fixed inset-0 z-[100] bg-slate-50 flex flex-col">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="relative w-full h-full flex flex-col overflow-hidden"
            >
              <div className="p-6 md:p-8 border-b border-slate-200 bg-white flex justify-between items-center sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <button onClick={() => setShowTicketModal(false)} className="p-2 -ml-2 hover:bg-slate-100 rounded-xl transition-colors">
                      <ArrowLeft className="w-5 h-5 text-slate-600" />
                    </button>
                    <h3 className="text-xl font-bold text-slate-900">Ticket Details</h3>
                  </div>
                  <p className="text-xs text-slate-500 uppercase tracking-widest font-bold ml-10">Review and manage service request</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-xl">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ticket ID:</span>
                    <span className="text-xs font-bold text-slate-900">TK-{selectedTicket.id.slice(0, 8).toUpperCase()}</span>
                  </div>
                  <button onClick={() => setShowTicketModal(false)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                    <X className="w-6 h-6 text-slate-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 md:p-12 lg:p-16 max-w-7xl mx-auto w-full">
                {/* Tab Navigation */}
                <div className="flex items-center gap-2 mb-12 bg-slate-100 p-1.5 rounded-2xl w-fit mx-auto shadow-inner">
                  {(['Details', 'Timeline', 'Actions'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setTicketModalTab(tab)}
                      className={`px-8 py-3 rounded-xl text-xs font-black transition-all duration-300 flex items-center gap-2 ${
                        ticketModalTab === tab 
                          ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 scale-105' 
                          : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                      }`}
                    >
                      {tab === 'Details' && <FileText className="w-4 h-4" />}
                      {tab === 'Timeline' && <Clock className="w-4 h-4" />}
                      {tab === 'Actions' && <Settings className="w-4 h-4" />}
                      {tab}
                    </button>
                  ))}
                </div>

                {ticketModalTab === 'Details' && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <TicketDetailView ticket={selectedTicket} t={t} language={language} showUpdates={false} />
                  </motion.div>
                )}

                {ticketModalTab === 'Timeline' && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                    <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-3">
                        <Clock className="w-5 h-5 text-brand-teal" />
                        Ticket Activity Timeline
                      </h4>
                      
                      <div className="space-y-8 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                        {selectedTicket.updates && selectedTicket.updates.length > 0 ? (
                          selectedTicket.updates.slice().reverse().map((update: any, idx: number) => (
                            <div key={idx} className="relative pl-12">
                              <div className="absolute left-0 top-0 w-9 h-9 bg-white border-2 border-brand-teal rounded-full flex items-center justify-center z-10">
                                <div className="w-2 h-2 rounded-full bg-brand-teal" />
                              </div>
                              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                                  <span className="text-[10px] font-black text-brand-teal uppercase tracking-widest bg-brand-teal/10 px-3 py-1 rounded-lg self-start">
                                    {update.author || 'System'}
                                  </span>
                                  <span className="text-[10px] font-bold text-slate-400 uppercase">
                                    {update.timestamp ? (
                                      typeof update.timestamp === 'string' 
                                        ? new Date(update.timestamp).toLocaleString() 
                                        : update.timestamp.seconds 
                                          ? new Date(update.timestamp.seconds * 1000).toLocaleString() 
                                          : 'N/A'
                                    ) : 'N/A'}
                                  </span>
                                </div>
                                <p className="text-sm text-slate-700 leading-relaxed">{update.text}</p>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-12">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                              <Clock className="w-8 h-8 text-slate-300" />
                            </div>
                            <p className="text-slate-400 font-medium">No activity recorded yet.</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {ticketModalTab === 'Actions' && (
                  <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                    {/* Admin Controls for Approval */}
                    {selectedTicket.status === 'Pending' && (
                      <div className="space-y-6">
                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
                          <div>
                            <h4 className="font-bold text-slate-900">New Service Request</h4>
                            <p className="text-xs text-slate-500">Please review the details and approve or reject this ticket.</p>
                          </div>
                          <div className="flex gap-4 w-full md:w-auto">
                            <button 
                              onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Rejected')}
                              className="flex-1 md:flex-none px-8 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all"
                            >
                              Reject
                            </button>
                            <button 
                              onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Approved')}
                              className="flex-1 md:flex-none px-8 py-3 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-brand-teal/20"
                            >
                              Approve
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTicket.status === 'Waiting for client approval' && (
                      <div className="bg-purple-50 p-8 rounded-3xl border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600">
                            <Clock className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-bold text-purple-900">Waiting for Client Action</h4>
                            <p className="text-xs text-purple-600/70">This ticket is currently waiting for the client to accept or reject the proposed quote.</p>
                          </div>
                        </div>
                        <div className="px-6 py-2 bg-white/50 border border-purple-200 rounded-xl text-[10px] font-black text-purple-600 uppercase tracking-[0.2em]">
                          Pending Client Response
                        </div>
                      </div>
                    )}

                    {/* Admin Controls for Giving Quote */}
                    {selectedTicket.status === 'Approved' && (
                      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h4 className="font-bold text-slate-900 flex items-center gap-3">
                          <DollarSign className="w-6 h-6 text-brand-teal" /> 
                          {t.clientPortal.quotations.giveQuote}
                        </h4>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                          <div className="space-y-6">
                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                {t.clientPortal.quotations.quoteAmount}
                              </label>
                              <div className="flex gap-3">
                                <div className="relative flex-1">
                                  {quoteCurrency === 'USD' ? (
                                    <DollarSign className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                  ) : (
                                    <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-bold text-slate-400">€</span>
                                  )}
                                  <input 
                                    type="text"
                                    value={quoteAmount}
                                    onChange={(e) => setQuoteAmount(e.target.value.replace(/[^0-9.]/g, ''))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 !pl-16 text-base font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                  />
                                </div>
                                <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                                  <button
                                    onClick={() => setQuoteCurrency('USD')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${quoteCurrency === 'USD' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                  >
                                    USD
                                  </button>
                                  <button
                                    onClick={() => setQuoteCurrency('EUR')}
                                    className={`px-6 py-3 rounded-xl text-xs font-black transition-all ${quoteCurrency === 'EUR' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}
                                  >
                                    EUR
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                  {t.clientPortal.quotations.firstTwoHours}
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="text"
                                    value={quoteFirstTwoHours}
                                    onChange={(e) => setQuoteFirstTwoHours(e.target.value.replace(/[^0-9.]/g, ''))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 !pl-10 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                  {t.clientPortal.quotations.additionalHours}
                                </label>
                                <div className="relative">
                                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="text"
                                    value={quoteAdditionalHours}
                                    onChange={(e) => setQuoteAdditionalHours(e.target.value.replace(/[^0-9.]/g, ''))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 !pl-10 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                  />
                                </div>
                              </div>
                              <div>
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                  {t.clientPortal.quotations.travelCost}
                                </label>
                                <div className="relative">
                                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                  <input 
                                    type="text"
                                    value={quoteTravelCost}
                                    onChange={(e) => setQuoteTravelCost(e.target.value.replace(/[^0-9.]/g, ''))}
                                    placeholder="0.00"
                                    className="w-full bg-slate-50 border border-slate-100 rounded-xl p-3 !pl-10 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                  />
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                                {t.clientPortal.quotations.quoteDescription}
                              </label>
                              <div className="relative">
                                <MessageSquare className="absolute left-5 top-6 w-5 h-5 text-slate-400" />
                                <textarea 
                                  value={quoteDescription}
                                  onChange={(e) => setQuoteDescription(e.target.value)}
                                  placeholder={t.clientPortal.quotations.modal.descriptionPlaceholder}
                                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 !pl-16 text-sm outline-none focus:border-brand-teal/50 transition-all resize-none shadow-inner"
                                  rows={4}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex flex-col justify-center text-center space-y-4">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-sm">
                              <DollarSign className="w-8 h-8 text-brand-teal" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">Ready to submit?</p>
                              <p className="text-xs text-slate-500">The client will be notified immediately to review and accept your quote.</p>
                            </div>
                            <button 
                              onClick={() => handleGiveQuote(selectedTicket.id)}
                              disabled={isSubmittingQuote || !quoteAmount.trim()}
                              className="w-full py-5 bg-slate-900 text-brand-teal rounded-2xl font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                            >
                              {isSubmittingQuote ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                  <Send className="w-5 h-5" />
                                  {t.clientPortal.quotations.submitQuote}
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Admin Controls for On-Site and Updates */}
                    {(selectedTicket.status === 'Approved' || selectedTicket.status === 'Quote Accepted' || selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' || selectedTicket.status === 'On Site') && (
                      <div className="space-y-8">
                        {selectedTicket.status === 'Quote Accepted' && !showAssignForm && (
                          <div className="p-8 bg-blue-50 rounded-3xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600">
                                <HardHat className="w-7 h-7" />
                              </div>
                              <div>
                                <h4 className="font-bold text-blue-900">Ready for Assignment</h4>
                                <p className="text-xs text-blue-600">The client has accepted the quote. You can now assign an engineer.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => setShowAssignForm(true)}
                              className="w-full md:w-auto px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3"
                            >
                              <Users className="w-5 h-5" />
                              Assign Engineer
                            </button>
                          </div>
                        )}

                        {showAssignForm && (
                          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center justify-between">
                              <h4 className="font-bold text-slate-900 flex items-center gap-3">
                                <Users className="w-6 h-6 text-brand-teal" /> 
                                Assign Engineer Details
                              </h4>
                              <button onClick={() => setShowAssignForm(false)} className="text-xs font-black text-rose-500 hover:text-rose-600 uppercase tracking-widest bg-rose-50 px-4 py-2 rounded-xl transition-all">Cancel</button>
                            </div>

                            <div className="flex gap-4 p-1 bg-slate-100 rounded-2xl w-fit">
                              <button 
                                onClick={() => setAssignData({...assignData, assignmentType: 'manual'})}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${assignData.assignmentType === 'manual' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                Manual Entry
                              </button>
                              <button 
                                onClick={() => setAssignData({...assignData, assignmentType: 'existing'})}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${assignData.assignmentType === 'existing' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                              >
                                Select from Application
                              </button>
                            </div>
                            
                            {assignData.assignmentType === 'existing' ? (
                              <div className="space-y-4">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Select Engineer *</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {users.filter(u => u.role === 'engineer').map((engineer) => (
                                    <button
                                      key={engineer.id}
                                      onClick={() => setAssignData({...assignData, selectedEngineerId: engineer.id})}
                                      className={`p-4 rounded-2xl border transition-all text-left flex items-center gap-4 ${assignData.selectedEngineerId === engineer.id ? 'bg-brand-teal/5 border-brand-teal shadow-md' : 'bg-white border-slate-100 hover:border-slate-200'}`}
                                    >
                                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 font-bold shrink-0">
                                        {engineer.photoURL || engineer.profilePic ? (
                                          <img src={engineer.photoURL || engineer.profilePic} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                          engineer.displayName?.charAt(0) || engineer.fullName?.charAt(0) || 'E'
                                        )}
                                      </div>
                                      <div className="min-w-0">
                                        <p className="font-bold text-slate-900 truncate">{engineer.displayName || engineer.fullName}</p>
                                        <p className="text-[10px] text-slate-500 truncate">{engineer.email}</p>
                                      </div>
                                    </button>
                                  ))}
                                  {users.filter(u => u.role === 'engineer').length === 0 && (
                                    <div className="md:col-span-2 p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                      <p className="text-sm text-slate-400 font-bold">No engineers found in the application.</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">First Name *</label>
                                  <input 
                                    type="text"
                                    value={assignData.firstName}
                                    onChange={(e) => setAssignData({...assignData, firstName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                    placeholder="John"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Surname *</label>
                                  <input 
                                    type="text"
                                    value={assignData.lastName}
                                    onChange={(e) => setAssignData({...assignData, lastName: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                    placeholder="Doe"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Email Address *</label>
                                  <input 
                                    type="email"
                                    value={assignData.email}
                                    onChange={(e) => setAssignData({...assignData, email: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                    placeholder="john.doe@example.com"
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Phone Number</label>
                                  <input 
                                    type="tel"
                                    value={assignData.phone}
                                    onChange={(e) => setAssignData({...assignData, phone: e.target.value})}
                                    className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                    placeholder="+1 234 567 890"
                                  />
                                </div>
                                <div className="md:col-span-2 space-y-2">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Location Traveling From</label>
                                  <div className="relative">
                                    <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                                    <input 
                                      type="text"
                                      value={assignData.locationFrom}
                                      onChange={(e) => setAssignData({...assignData, locationFrom: e.target.value})}
                                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-4 pl-14 text-sm font-bold outline-none focus:border-brand-teal/50 transition-all shadow-inner"
                                      placeholder="City, Country"
                                    />
                                  </div>
                                </div>
                                
                                <div className="md:col-span-2 space-y-4">
                                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Attachments (PDF, JPG, PNG)</label>
                                  <div className="flex flex-wrap gap-4">
                                    <label className="w-32 h-32 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-brand-teal/50 hover:bg-slate-50 transition-all group">
                                      <PaperClip className="w-7 h-7 text-slate-300 group-hover:text-brand-teal transition-colors" />
                                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Add Files</span>
                                      <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
                                    </label>
                                    
                                    {assignData.attachments.map((file, idx) => (
                                      <div key={idx} className="w-32 h-32 bg-slate-50 border border-slate-100 rounded-3xl p-3 flex flex-col justify-between relative group shadow-sm">
                                        <button 
                                          onClick={() => setAssignData(prev => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }))}
                                          className="absolute -top-2 -right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                        >
                                          <X className="w-3 h-3" />
                                        </button>
                                        <div className="flex-1 flex items-center justify-center overflow-hidden rounded-2xl">
                                          {file.type.startsWith('image/') ? (
                                            <img src={file.data} className="w-full h-full object-cover" />
                                          ) : (
                                            <FileText className="w-10 h-10 text-slate-300" />
                                          )}
                                        </div>
                                        <p className="text-[8px] font-bold text-slate-500 truncate mt-2 text-center">{file.name}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}

                            <button 
                              onClick={handleAssignEngineer}
                              disabled={isAssigningEngineer || (assignData.assignmentType === 'manual' ? (!assignData.firstName || !assignData.lastName || !assignData.email) : !assignData.selectedEngineerId)}
                              className="w-full py-5 bg-slate-900 text-brand-teal rounded-2xl font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center gap-3 shadow-xl shadow-slate-900/20"
                            >
                              {isAssigningEngineer ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                                <>
                                  <CheckCircle className="w-5 h-5" />
                                  Complete Assignment
                                </>
                              )}
                            </button>
                          </div>
                        )}

                        {(selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' || selectedTicket.status === 'On Site') && (
                          <div className="flex flex-col md:flex-row items-center justify-between p-8 bg-white rounded-3xl border border-slate-200 shadow-sm gap-6">
                            <div className="flex items-center gap-5">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${selectedTicket.isOnSite ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                <MapPin className="w-7 h-7" />
                              </div>
                              <div>
                                <h4 className="font-bold text-slate-900">Engineer On-Site Status</h4>
                                <p className="text-xs text-slate-500">Toggle this when the engineer arrives at the client location.</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => !selectedTicket.isOnSite && handleToggleOnSite(selectedTicket.id, selectedTicket.isOnSite)}
                              disabled={selectedTicket.isOnSite}
                              className={`w-full md:w-auto px-8 py-4 rounded-2xl font-black text-sm transition-all ${
                                selectedTicket.isOnSite 
                                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/20 opacity-80 cursor-default' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              {selectedTicket.isOnSite ? 'Engineer On Site' : 'Mark as On Site'}
                            </button>
                          </div>
                        )}

                        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                          <h4 className="font-bold text-slate-900 flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-brand-teal" /> 
                            Send Update to Client
                          </h4>
                          <div className="flex flex-col sm:flex-row gap-4">
                            <textarea 
                              value={newUpdateText}
                              onChange={(e) => setNewUpdateText(e.target.value)}
                              placeholder="Type an update for the client..."
                              className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm outline-none focus:border-brand-teal/50 transition-all resize-none shadow-inner"
                              rows={2}
                            />
                            <button 
                              onClick={() => handleAddUpdate(selectedTicket.id)}
                              disabled={isAddingUpdate || !newUpdateText.trim()}
                              className="px-10 py-4 bg-brand-teal text-slate-900 rounded-2xl font-black text-sm hover:bg-teal-300 transition-all disabled:opacity-50 shrink-0 shadow-lg shadow-brand-teal/20"
                            >
                              {isAddingUpdate ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Send Update'}
                            </button>
                          </div>
                          
                          {selectedTicket.updates && selectedTicket.updates.length > 0 && (
                            <div className="space-y-4 mt-6 pt-6 border-t border-slate-50">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Recent Updates</p>
                              <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                  {selectedTicket.updates.slice().reverse().slice(0, 3).map((update: any, idx: number) => (
                                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                      <p className="text-xs text-slate-700 leading-relaxed">{update.text}</p>
                                      <div className="flex items-center justify-between mt-3">
                                        <span className="text-[9px] font-black text-brand-teal uppercase tracking-widest">{update.author || 'System'}</span>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase">
                                          {update.timestamp ? (
                                            typeof update.timestamp === 'string' 
                                              ? new Date(update.timestamp).toLocaleString() 
                                              : update.timestamp.seconds 
                                                ? new Date(update.timestamp.seconds * 1000).toLocaleString() 
                                                : 'N/A'
                                          ) : 'N/A'}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              <div className="p-6 md:p-8 border-t border-slate-200 bg-white flex flex-wrap gap-4 justify-end sticky bottom-0 z-10">
                {selectedTicket.status === 'Pending' && (
                  <>
                    <button 
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Rejected')}
                      className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl hover:bg-rose-100 transition-all"
                    >
                      Reject Ticket
                    </button>
                    <button 
                      onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Approved')}
                      className="px-8 py-3 bg-brand-teal text-slate-900 font-bold rounded-xl hover:bg-teal-400 transition-all shadow-lg shadow-brand-teal/20"
                    >
                      Approve & List as Job
                    </button>
                  </>
                )}
                {(selectedTicket.status === 'Assigned' || selectedTicket.status === 'In Progress' || selectedTicket.status === 'On Site') && (
                  <button 
                    onClick={() => handleUpdateTicketStatus(selectedTicket.id, 'Waiting for Confirmation')}
                    className="px-8 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Mark as Completed
                  </button>
                )}
                <button 
                  onClick={() => setShowTicketModal(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingUser(null)}
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
                  <h3 className="text-xl font-bold text-black">Edit User Details</h3>
                  <button onClick={() => setEditingUser(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</label>
                    <input 
                      type="text" 
                      value={editingUser.displayName || editingUser.name || ''}
                      onChange={(e) => setEditingUser({...editingUser, displayName: e.target.value, name: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</label>
                    <input 
                      type="email" 
                      value={editingUser.email || ''}
                      onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                      className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                    />
                  </div>
                  {editingUser.role === 'client' && (
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Company Name</label>
                      <input 
                        type="text" 
                        value={editingUser.companyName || ''}
                        onChange={(e) => setEditingUser({...editingUser, companyName: e.target.value})}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                      />
                    </div>
                  )}
                  {editingUser.role === 'engineer' && (
                    <>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Specialization</label>
                        <input 
                          type="text" 
                          value={editingUser.specialization || ''}
                          onChange={(e) => setEditingUser({...editingUser, specialization: e.target.value})}
                          className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all" 
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engineer Level</label>
                        <CustomDropdown 
                          value={editingUser.engineerLevel || 'L1'}
                          onChange={(val) => setEditingUser({...editingUser, engineerLevel: val})}
                          options={[
                            { value: 'L1', label: 'L1 (Level 1)' },
                            { value: 'L2', label: 'L2 (Level 2)' },
                            { value: 'L3', label: 'L3 (Level 3)' },
                            { value: 'All', label: 'All of the above' }
                          ]}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Status</label>
                    <CustomDropdown 
                      value={editingUser.status || 'Active'}
                      onChange={(val) => setEditingUser({...editingUser, status: val})}
                      options={[
                        { value: 'Active', label: 'Active' },
                        { value: 'Inactive', label: 'Inactive' },
                        { value: 'Suspended', label: 'Suspended' }
                      ]}
                      className="w-full"
                    />
                  </div>
                  <PremiumButton 
                    onClick={handleUpdateUser}
                    variant="primary"
                    glow
                    className="w-full !py-4 !rounded-xl shadow-lg shadow-brand-teal/20"
                  >
                    Save Changes
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Job Modal */}
      <AnimatePresence>
        {editingJob && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingJob(null)}
              className="absolute inset-0 bg-slate-900/40 md:backdrop-blur-sm backdrop-blur-none"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-xl font-bold text-black">Edit Job Posting</h3>
                  <button onClick={() => setEditingJob(null)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Country</label>
                      <CustomDropdown 
                        value={editingJob.country || 'US'}
                        onChange={(val) => setEditingJob({...editingJob, country: val, city: ''})}
                        options={allCountries}
                        icon={<Globe className="w-4 h-4" />}
                        className="w-full"
                        searchable={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">City</label>
                      <CustomDropdown 
                        value={editingJob.city || ''}
                        onChange={(val) => setEditingJob({...editingJob, city: val})}
                        options={editingJobCities}
                        icon={<MapPin className="w-4 h-4" />}
                        className="w-full"
                        searchable={true}
                        placeholder="Select city..."
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Technician Type</label>
                      <CustomDropdown 
                        value={editingJob.technicianType || 'Desktop'}
                        onChange={(val) => setEditingJob({...editingJob, technicianType: val})}
                        options={[
                          { value: 'Desktop', label: 'Desktop' },
                          { value: 'Network', label: 'Network' },
                          { value: 'Both', label: 'Both' },
                          { value: 'Server', label: 'Server' },
                          { value: 'Printer', label: 'Printer' },
                          { value: 'POS', label: 'POS' },
                          { value: 'AV', label: 'AV' },
                          { value: 'Security', label: 'Security' },
                          { value: 'Telecom', label: 'Telecom' },
                          { value: 'Cabling', label: 'Cabling' },
                          { value: 'Other', label: 'Other' },
                        ]}
                        icon={<Wrench className="w-4 h-4" />}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Language</label>
                      <CustomDropdown 
                        value={editingJob.language || 'English'}
                        onChange={(val) => setEditingJob({...editingJob, language: val})}
                        options={allLanguages}
                        icon={<Globe className="w-4 h-4" />}
                        className="w-full"
                        searchable={true}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Language Requirement</label>
                      <CustomDropdown 
                        value={editingJob.languageRequirement || 'Fluent'}
                        onChange={(val) => setEditingJob({...editingJob, languageRequirement: val})}
                        options={[
                          { value: 'A1', label: 'A1' },
                          { value: 'A2', label: 'A2' },
                          { value: 'B1', label: 'B1' },
                          { value: 'B2', label: 'B2' },
                          { value: 'C1', label: 'C1' },
                          { value: 'C2', label: 'C2' },
                          { value: 'Native', label: 'Native' },
                        ]}
                        icon={<CheckCircle className="w-4 h-4" />}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Service Type</label>
                      <CustomDropdown 
                        value={editingJob.serviceType || 'hourly'}
                        onChange={(val) => setEditingJob({...editingJob, serviceType: val})}
                        options={[
                          { value: 'hourly', label: 'Hourly' },
                          { value: 'half day', label: 'Half Day' },
                          { value: 'full day', label: 'Full Day' },
                          { value: 'project based', label: 'Project Based' },
                          { value: 'monthly', label: 'Monthly' },
                        ]}
                        icon={<Clock className="w-4 h-4" />}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engineer Level (Optional)</label>
                      <CustomDropdown 
                        value={editingJob.engineerLevel || 'L1'}
                        onChange={(val) => setEditingJob({...editingJob, engineerLevel: val})}
                        options={[
                          { value: 'L1', label: 'L1 (Level 1)' },
                          { value: 'L2', label: 'L2 (Level 2)' },
                          { value: 'L3', label: 'L3 (Level 3)' },
                          { value: 'All', label: 'All of the above' }
                        ]}
                        icon={<HardHat className="w-4 h-4" />}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Engineers Required</label>
                      <CustomDropdown 
                        value={editingJob.engineersCount || '1'}
                        onChange={(val) => setEditingJob({...editingJob, engineersCount: val})}
                        options={[
                          { value: '1', label: '1' },
                          { value: '2', label: '2' },
                          { value: '3', label: '3' },
                          { value: '4', label: '4' },
                          { value: '5', label: '5' },
                          { value: '6', label: '6' },
                          { value: '7', label: '7' },
                          { value: '8', label: '8' },
                          { value: '9', label: '9' },
                          { value: '10', label: '10' },
                        ]}
                        icon={<Users className="w-4 h-4" />}
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Rate (Optional)</label>
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                            <DollarSign className="w-4 h-4" />
                          </div>
                          <input 
                            type="text"
                            value={editingJob.rate || ''}
                            onChange={(e) => setEditingJob({...editingJob, rate: e.target.value})}
                            placeholder="e.g. 50"
                            className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3 pl-10 pr-4 text-sm font-medium outline-none focus:border-brand-teal/50 transition-all"
                          />
                        </div>
                        <div className="w-24">
                          <CustomDropdown 
                            value={editingJob.currency || 'EUR'}
                            onChange={(val) => setEditingJob({...editingJob, currency: val})}
                            options={[
                              { value: 'EUR', label: '€ EUR' },
                              { value: 'USD', label: '$ USD' },
                            ]}
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Description</label>
                    <textarea 
                      value={editingJob.description || ''}
                      onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                      className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-brand-teal outline-none transition-all resize-none" 
                      rows={6}
                    />
                  </div>

                  <FileUpload 
                    label="Job Attachments"
                    existingFiles={editingJob.attachments || []}
                    onFilesSelected={(newFiles) => setEditingJob({
                      ...editingJob,
                      attachments: [...(editingJob.attachments || []), ...newFiles]
                    })}
                    onRemoveFile={(idx) => setEditingJob({
                      ...editingJob,
                      attachments: (editingJob.attachments || []).filter((_: any, i: number) => i !== idx)
                    })}
                  />
                  <PremiumButton 
                    onClick={handleUpdateJob}
                    className="w-full !py-4 !rounded-2xl shadow-lg shadow-brand-teal/20"
                    variant="primary"
                    glow
                  >
                    Update Job Posting
                  </PremiumButton>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminPortal;
