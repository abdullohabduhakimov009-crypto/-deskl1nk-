import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiCreditCard as CreditCard, 
  HiPlusCircle as PlusSquare, 
  HiEllipsisVertical as MoreVertical,
  HiEye as Eye,
  HiCheckCircle as CheckCircle,
  HiTrash as Trash2,
  HiMagnifyingGlass as Search,
  HiFunnel as Filter,
  HiArrowUpRight as ArrowUpRight,
  HiArrowDownRight as ArrowDownRight,
  HiClock as Clock,
  HiCalendar as Calendar,
  HiCurrencyDollar as DollarSign,
  HiExclamationCircle as AlertCircle,
  HiArrowPath as Loader2,
  HiArrowDownTray as Download
} from 'react-icons/hi2';
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
  Cell
} from 'recharts';
import { format, subMonths, startOfMonth, endOfMonth, isWithinInterval, parseISO } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PremiumButton } from './PremiumButton';

interface Invoice {
  id: string;
  clientName: string;
  clientEmail: string;
  amount: string;
  status: 'Paid' | 'Pending' | 'Overdue' | string;
  dueDate: string;
  description: string;
  createdAt: any;
  updatedAt: any;
}

interface BillingInvoicesProps {
  invoices: Invoice[];
  setShowAddInvoiceModal: (show: boolean) => void;
  onUpdateInvoiceStatus: (id: string, status: string) => Promise<void>;
  onDeleteInvoice: (id: string) => Promise<void>;
}

const BillingInvoices: React.FC<BillingInvoicesProps> = ({ 
  invoices, 
  setShowAddInvoiceModal,
  onUpdateInvoiceStatus,
  onDeleteInvoice
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const stats = useMemo(() => {
    const totalOutstanding = invoices
      .filter(i => i.status !== 'Paid')
      .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[^0-9.]/g, '') || '0'), 0);
    
    const paidThisMonth = invoices
      .filter(i => {
        if (i.status !== 'Paid') return false;
        const date = i.createdAt?.toDate ? i.createdAt.toDate() : new Date(i.createdAt);
        return isWithinInterval(date, {
          start: startOfMonth(new Date()),
          end: endOfMonth(new Date())
        });
      })
      .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[^0-9.]/g, '') || '0'), 0);

    const overdueCount = invoices.filter(i => i.status === 'Overdue').length;
    const totalRevenue = invoices
      .filter(i => i.status === 'Paid')
      .reduce((sum, i) => sum + parseFloat(i.amount.replace(/[^0-9.]/g, '') || '0'), 0);

    return { totalOutstanding, paidThisMonth, overdueCount, totalRevenue };
  }, [invoices]);

  const chartData = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), 5 - i);
      return {
        name: format(date, 'MMM'),
        revenue: 0,
        fullDate: date
      };
    });

    invoices.forEach(inv => {
      if (inv.status === 'Paid') {
        const date = inv.createdAt?.toDate ? inv.createdAt.toDate() : new Date(inv.createdAt);
        const monthIndex = last6Months.findIndex(m => 
          m.fullDate.getMonth() === date.getMonth() && 
          m.fullDate.getFullYear() === date.getFullYear()
        );
        if (monthIndex !== -1) {
          last6Months[monthIndex].revenue += parseFloat(inv.amount.replace(/[^0-9.]/g, '') || '0');
        }
      }
    });

    return last6Months;
  }, [invoices]);

  const pieData = useMemo(() => {
    const counts = invoices.reduce((acc: any, inv) => {
      acc[inv.status] = (acc[inv.status] || 0) + 1;
      return acc;
    }, {});

    return Object.keys(counts).map(status => ({
      name: status,
      value: counts[status]
    }));
  }, [invoices]);

  const COLORS = ['#10b981', '#f59e0b', '#ef4444', '#6366f1'];

  const filteredInvoices = useMemo(() => {
    return invoices.filter(inv => {
      const matchesSearch = inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchQuery, statusFilter]);

  const handleDownloadReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.setTextColor(15, 22, 25); // Slate 900
    doc.text('Invoice Report', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text(`Generated on: ${format(new Date(), 'PPP p')}`, 14, 30);
    
    // Add stats summary
    doc.setFontSize(12);
    doc.setTextColor(71, 85, 105); // Slate 600
    doc.text(`Total Invoices: ${filteredInvoices.length}`, 14, 40);
    doc.text(`Total Revenue: $${stats.totalRevenue.toLocaleString()}`, 14, 47);
    doc.text(`Outstanding: $${stats.totalOutstanding.toLocaleString()}`, 14, 54);

    const tableColumn = ['Invoice ID', 'Client Name', 'Amount', 'Status', 'Due Date'];
    const tableRows = filteredInvoices.map(inv => [
      `INV-${inv.id.slice(0, 4).toUpperCase()}`,
      inv.clientName,
      inv.amount,
      inv.status,
      inv.dueDate ? format(new Date(inv.dueDate), 'MMM d, yyyy') : 'N/A'
    ]);

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 65,
      theme: 'striped',
      headStyles: { 
        fillColor: [15, 22, 25], // Slate 900
        textColor: [255, 255, 255],
        fontSize: 10,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 9,
        textColor: [71, 85, 105] // Slate 600
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252] // Slate 50
      },
      margin: { top: 65 }
    });

    doc.save(`invoice_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Billing & Invoices</h2>
          <p className="text-slate-500 font-medium">Financial performance and invoice management</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadReport}
            className="flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all shadow-sm active:scale-95"
          >
            <Download className="w-5 h-5" />
            <span>Download Report</span>
          </button>
          <button 
            onClick={() => setShowAddInvoiceModal(true)}
            className="flex items-center gap-2 px-6 py-3.5 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 active:scale-95"
          >
            <PlusSquare className="w-5 h-5" />
            <span>New Invoice</span>
          </button>
        </div>
      </div>

      {/* Stats Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full uppercase tracking-wider">Revenue</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <div className="text-3xl font-black text-slate-900">${stats.totalRevenue.toLocaleString()}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Clock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-1 rounded-full uppercase tracking-wider">Pending</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Outstanding</p>
          <div className="text-3xl font-black text-slate-900">${stats.totalOutstanding.toLocaleString()}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-600">
              <AlertCircle className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full uppercase tracking-wider">Overdue</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Overdue Count</p>
          <div className="text-3xl font-black text-rose-600">{stats.overdueCount}</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-black text-brand-teal bg-brand-teal/10 px-2 py-1 rounded-full uppercase tracking-wider">Monthly</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Paid This Month</p>
          <div className="text-3xl font-black text-slate-900">${stats.paidThisMonth.toLocaleString()}</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Revenue Trend</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <div className="w-3 h-3 bg-brand-teal rounded-full" />
              Monthly Revenue (USD)
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00A3A3" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#00A3A3" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    borderRadius: '16px', 
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    fontWeight: 'bold'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00A3A3" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 tracking-tight mb-8">Status Distribution</h3>
          <div className="h-[250px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-slate-900">{invoices.length}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            {pieData.map((entry, index) => (
              <div key={entry.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-sm font-bold text-slate-600">{entry.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Invoice Management</h3>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-6 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-medium outline-none focus:border-brand-teal/50 transition-all w-full md:w-64"
              />
            </div>
            <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
              {['All', 'Paid', 'Pending', 'Overdue'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                    statusFilter === status 
                      ? 'bg-white text-slate-900 shadow-sm' 
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invoice</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Client</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-white group-hover:shadow-sm transition-all">
                        <CreditCard className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">INV-{inv.id.slice(0, 4).toUpperCase()}</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {inv.createdAt ? (inv.createdAt.toDate ? inv.createdAt.toDate().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : new Date(inv.createdAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div>
                      <p className="font-bold text-slate-900">{inv.clientName}</p>
                      <p className="text-xs text-slate-400">{inv.clientEmail}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-slate-900">{inv.amount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      inv.status === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 
                      inv.status === 'Overdue' ? 'bg-rose-50 text-rose-600' : 
                      'bg-amber-50 text-amber-600'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        inv.status === 'Paid' ? 'bg-emerald-600' : 
                        inv.status === 'Overdue' ? 'bg-rose-600' : 
                        'bg-amber-600'
                      }`} />
                      {inv.status}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                      <Calendar className="w-4 h-4" />
                      {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : 'N/A'}
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="relative">
                      <PremiumButton 
                        variant="ghost"
                        size="sm"
                        onClick={() => setOpenMenuId(openMenuId === inv.id ? null : inv.id)}
                        className="p-2 hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 rounded-xl transition-all text-slate-400 min-w-0"
                        icon={<MoreVertical className="w-4 h-4" />}
                      />
                      
                      <AnimatePresence>
                        {openMenuId === inv.id && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setOpenMenuId(null)} />
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: -10 }}
                              className="absolute right-0 top-full mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 py-2 overflow-hidden"
                            >
                              <button 
                                onClick={() => setOpenMenuId(null)}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 flex items-center gap-2"
                              >
                                <Eye className="w-4 h-4" />
                                View Details
                              </button>
                              {inv.status !== 'Paid' && (
                                <button 
                                  onClick={() => {
                                    onUpdateInvoiceStatus(inv.id, 'Paid');
                                    setOpenMenuId(null);
                                  }}
                                  className="w-full px-4 py-2 text-left text-sm font-bold text-emerald-600 hover:bg-emerald-50 flex items-center gap-2"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Mark as Paid
                                </button>
                              )}
                              <button 
                                onClick={() => {
                                  if (window.confirm('Delete this invoice?')) {
                                    onDeleteInvoice(inv.id);
                                  }
                                  setOpenMenuId(null);
                                }}
                                className="w-full px-4 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </motion.div>
                          </>
                        )}
                      </AnimatePresence>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200">
                        <CreditCard className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900">No invoices found</p>
                        <p className="text-sm text-slate-500">Try adjusting your search or filters</p>
                      </div>
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
};

export default BillingInvoices;
