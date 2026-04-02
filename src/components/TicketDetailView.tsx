import React, { useState } from 'react';
import { 
  HiMapPin as MapPin, 
  HiClock as Clock, 
  HiCurrencyDollar as DollarSign, 
  HiEnvelope as Mail, 
  HiPhone as Phone,
  HiDocumentText as FileText,
  HiCalendar as Calendar,
  HiTag as Tag,
  HiUser as User,
  HiCheckCircle as CheckCircle,
  HiBell as Bell,
  HiPaperAirplane as Send,
  HiMagnifyingGlass as Search,
  HiPencilSquare as Edit3,
  HiXMark as X,
  HiCheck as Check,
  HiArrowDownTray as Download
} from 'react-icons/hi2';
import { db, auth, doc, updateDoc } from '../firebase';
import { PremiumButton } from './PremiumButton';
import { generatePOPDF, generateTicketReportPDF, POData, TicketReportItem } from '../lib/pdfGenerator';

interface TicketDetailViewProps {
  ticket: any;
  t: any;
  language: string;
  showUpdates?: boolean;
}

const TicketDetailView: React.FC<TicketDetailViewProps> = ({ ticket, t, language, showUpdates = true }) => {
  const [isEditingService, setIsEditingService] = useState(false);
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [editData, setEditData] = useState({
    subject: ticket.subject || '',
    description: ticket.description || '',
    serviceType: ticket.serviceType || '',
    estimatedDuration: ticket.estimatedDuration || '',
    priority: ticket.priority || '',
    country: ticket.country || '',
    city: ticket.city || '',
    location: ticket.location || '',
    dateTime: ticket.dateTime || ''
  });

  const handleSave = async (section: 'service' | 'location') => {
    try {
      const ticketRef = doc(db, 'tickets', ticket.id);
      await updateDoc(ticketRef, {
        ...editData,
        updatedAt: new Date()
      });
      if (section === 'service') setIsEditingService(false);
      if (section === 'location') setIsEditingLocation(false);
    } catch (error) {
      console.error("Error updating ticket:", error);
    }
  };

  const formatDateTime = (dateTime: any) => {
    if (!dateTime) return 'N/A';
    try {
      let date: Date;
      if (typeof dateTime === 'string') {
        date = new Date(dateTime);
      } else if (dateTime.toDate && typeof dateTime.toDate === 'function') {
        date = dateTime.toDate();
      } else if (dateTime.seconds) {
        date = new Date(dateTime.seconds * 1000);
      } else {
        // If it's an object but we don't know how to handle it, return N/A instead of the object
        return 'N/A';
      }

      if (isNaN(date.getTime())) return 'N/A';

      return new Intl.DateTimeFormat(language === 'uz' ? 'uz-UZ' : language === 'ru' ? 'ru-RU' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }).format(date);
    } catch (e) {
      return 'N/A';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical (SLA)': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'High': return 'bg-orange-100 text-orange-600 border-orange-200';
      case 'Medium': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Low': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Waiting for client approval': return 'bg-purple-100 text-purple-600 border-purple-200';
      case 'Approved': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Rejected': return 'bg-rose-100 text-rose-600 border-rose-200';
      case 'Assigned': return 'bg-indigo-100 text-indigo-600 border-indigo-200';
      case 'Quote Accepted': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'In Progress': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'On Site': return 'bg-amber-100 text-amber-600 border-amber-200';
      case 'Waiting for Confirmation': return 'bg-brand-teal/10 text-brand-teal border-brand-teal/20';
      case 'Completed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  const calculateDuration = () => {
    if (!ticket.onSiteAt) return null;
    
    const start = ticket.onSiteAt.toDate ? ticket.onSiteAt.toDate() : new Date(ticket.onSiteAt);
    const end = ticket.completedAt 
      ? (ticket.completedAt.toDate ? ticket.completedAt.toDate() : new Date(ticket.completedAt))
      : new Date();
      
    const diffMs = end.getTime() - start.getTime();
    if (diffMs < 0) return '0m';
    
    const diffHrs = Math.floor(diffMs / 3600000);
    const diffMins = Math.floor((diffMs % 3600000) / 60000);
    
    if (diffHrs > 0) {
      return `${diffHrs}h ${diffMins}m`;
    }
    return `${diffMins}m`;
  };

  const duration = calculateDuration();

  const handleDownloadPDF = () => {
    if (!ticket.quote) return;
    
    try {
      const poData: POData = {
        poNumber: `PO-${ticket.id.substring(0, 8).toUpperCase()}`,
        quoteRef: ticket.id.substring(0, 8).toUpperCase(),
        date: new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }),
        client: {
          name: ticket.clientName || 'Client',
          address: ticket.location || ticket.city || 'N/A'
        },
        requester: {
          company: ticket.clientName || 'Desknet Client',
          contact: ticket.clientName || 'Client',
          phone: ticket.contactPhone || 'N/A'
        },
        items: [],
        summary: {
          subtotal: parseFloat(ticket.quote.amount) || 0,
          vat: 0,
          shipping: 0,
          total: parseFloat(ticket.quote.amount) || 0,
          currency: ticket.quote.currency || 'USD'
        },
        notes: ticket.specialInstructions || "No additional notes."
      };

      // Add breakdown items if available
      let breakdownTotal = 0;
      if (ticket.quote.firstTwoHours) {
        const price = parseFloat(ticket.quote.firstTwoHours);
        poData.items.push({
          description: t.clientPortal.quotations.firstTwoHours || "First 2 Hours",
          qty: 1,
          unitPrice: price,
          total: price
        });
        breakdownTotal += price;
      }
      if (ticket.quote.additionalHours) {
        const price = parseFloat(ticket.quote.additionalHours);
        poData.items.push({
          description: t.clientPortal.quotations.additionalHours || "Additional Hours",
          qty: 1,
          unitPrice: price,
          total: price
        });
        breakdownTotal += price;
      }
      if (ticket.quote.travelCost) {
        const price = parseFloat(ticket.quote.travelCost);
        poData.items.push({
          description: t.clientPortal.quotations.travelCost || "Travel Cost",
          qty: 1,
          unitPrice: price,
          total: price
        });
        breakdownTotal += price;
      }

      const totalAmount = parseFloat(ticket.quote.amount) || 0;
      const servicePrice = Math.max(0, totalAmount - breakdownTotal);

      poData.items.unshift({
        description: `${t.clientPortal.quotations.quoteDescription || "Service"}: ${ticket.serviceType} - ${ticket.subject}`,
        qty: 1,
        unitPrice: servicePrice,
        total: servicePrice
      });

      // Fallback if no items at all
      if (poData.items.length === 0) {
        poData.items.push({
          description: `${ticket.subject || 'Service'}: ${ticket.serviceType || 'IT Support'}`,
          qty: 1,
          unitPrice: parseFloat(ticket.quote.amount) || 0,
          total: parseFloat(ticket.quote.amount) || 0
        });
      }

      generatePOPDF(poData);
    } catch (pdfError) {
      console.error("Error generating PDF:", pdfError);
    }
  };

  const handleExportTicketReport = () => {
    const reportData: TicketReportItem = {
      id: ticket.id,
      subject: ticket.subject || ticket.title || 'N/A',
      clientName: ticket.clientName || 'N/A',
      clientEmail: ticket.clientEmail || 'N/A',
      status: ticket.status || 'N/A',
      priority: ticket.priority || 'N/A',
      category: ticket.category || 'N/A',
      createdAt: formatDateTime(ticket.createdAt),
      description: ticket.description || 'N/A',
      engineerName: ticket.engineerName,
      engineerEmail: ticket.engineerEmail,
      engineerPhone: ticket.engineerPhone,
      quoteAmount: ticket.quote?.amount ? `${ticket.quote.currency === 'EUR' ? '€' : '$'}${ticket.quote.amount}` : 'N/A',
      quoteDescription: ticket.quote?.description,
      updates: ticket.updates
    };

    generateTicketReportPDF([reportData]);
  };

  return (
    <div className="space-y-4">
      {/* On Site Status Banner */}
      {(ticket.isOnSite || ticket.status === 'Completed' || ticket.status === 'Waiting for Confirmation') && (
        <div className={`px-4 py-2 rounded-2xl flex items-center justify-between shadow-lg ${ticket.status === 'Completed' || ticket.status === 'Waiting for Confirmation' ? 'bg-slate-800 text-white shadow-slate-800/20' : 'bg-emerald-500 text-white shadow-emerald-500/20'}`}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {ticket.status === 'Completed' || ticket.status === 'Waiting for Confirmation' ? <CheckCircle className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
              <p className="text-sm font-bold">{ticket.status === 'Completed' || ticket.status === 'Waiting for Confirmation' ? 'The job is completed' : 'Engineer is On Site'}</p>
            </div>
            {duration && (
              <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full">
                <Clock className="w-3.5 h-3.5" />
                <span className="text-xs font-black tracking-wider">{duration}</span>
              </div>
            )}
          </div>
          <CheckCircle className="w-5 h-5 opacity-50" />
        </div>
      )}

      {/* Header Info - Compact */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
            <Tag className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-base font-bold text-slate-900">TK-{ticket.id?.slice(0, 8).toUpperCase()}</h3>
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase border ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <p className={`text-xs transition-all duration-500 truncate max-w-[200px] md:max-w-md ${ticket.status === 'Completed' ? 'text-slate-400 line-through' : 'text-slate-500'}`}>
              {ticket.subject}
            </p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-lg border font-bold text-[10px] uppercase tracking-wider self-start sm:self-center ${getPriorityColor(ticket.priority)}`}>
          {ticket.priority}
        </div>
        <PremiumButton 
          onClick={handleExportTicketReport}
          variant="ghost"
          className="!text-brand-teal !font-bold !text-[10px] !px-2 !py-1 !rounded-lg"
          icon={<FileText className="w-3.5 h-3.5" />}
        >
          Export Report
        </PremiumButton>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          {/* Service & Location Combined for space */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-50 pb-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <FileText className="w-3 h-3" /> Service & Location
              </h4>
              {(ticket.status === 'Pending' || ticket.status === 'Open') && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => setIsEditingService(!isEditingService)}
                    className={`p-1.5 rounded-lg transition-all ${isEditingService ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-brand-teal'}`}
                    title="Edit Service"
                  >
                    {isEditingService ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                  </button>
                  <button 
                    onClick={() => setIsEditingLocation(!isEditingLocation)}
                    className={`p-1.5 rounded-lg transition-all ${isEditingLocation ? 'bg-emerald-500 text-white' : 'bg-slate-50 text-slate-400 hover:text-brand-teal'}`}
                    title="Edit Location"
                  >
                    {isEditingLocation ? <Check className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {isEditingService ? (
                <div className="md:col-span-2 space-y-3 bg-slate-50 p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Subject</label>
                      <input 
                        type="text"
                        value={editData.subject}
                        onChange={(e) => setEditData({...editData, subject: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Type</label>
                      <select 
                        value={editData.serviceType}
                        onChange={(e) => setEditData({...editData, serviceType: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      >
                        <option value="On-Demand Dispatch">On-Demand Dispatch</option>
                        <option value="Project-Based">Project-Based</option>
                        <option value="Maintenance">Maintenance</option>
                        <option value="Hourly">Hourly</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Description</label>
                    <textarea 
                      value={editData.description}
                      onChange={(e) => setEditData({...editData, description: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold min-h-[60px]"
                    />
                  </div>
                  <PremiumButton 
                    onClick={() => handleSave('service')} 
                    variant="primary"
                    className="w-full !py-1.5 !text-[10px] !rounded-lg"
                  >
                    Save Service Changes
                  </PremiumButton>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Service Type</p>
                    <p className="text-xs font-semibold text-slate-900">{ticket.serviceType}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Duration</p>
                    <p className="text-xs font-semibold text-slate-900">{ticket.estimatedDuration}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Description</p>
                    <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap line-clamp-3 hover:line-clamp-none cursor-pointer">{ticket.description}</p>
                  </div>
                  {ticket.specialInstructions && (
                    <div className="md:col-span-2 pt-3 border-t border-slate-50">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">{t.clientPortal.logTicket.specialInstructions}</p>
                      <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{ticket.specialInstructions}</p>
                    </div>
                  )}
                </>
              )}

              {isEditingLocation ? (
                <div className="md:col-span-2 space-y-3 bg-slate-50 p-3 rounded-xl">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">Country</label>
                      <input 
                        type="text"
                        value={editData.country}
                        onChange={(e) => setEditData({...editData, country: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase">City</label>
                      <input 
                        type="text"
                        value={editData.city}
                        onChange={(e) => setEditData({...editData, city: e.target.value})}
                        className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Location</label>
                    <input 
                      type="text"
                      value={editData.location}
                      onChange={(e) => setEditData({...editData, location: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-slate-400 uppercase">Date/Time</label>
                    <input 
                      type="datetime-local"
                      value={editData.dateTime}
                      onChange={(e) => setEditData({...editData, dateTime: e.target.value})}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold"
                    />
                  </div>
                  <PremiumButton 
                    onClick={() => handleSave('location')} 
                    variant="primary"
                    className="w-full !py-1.5 !text-[10px] !rounded-lg"
                  >
                    Save Location Changes
                  </PremiumButton>
                </div>
              ) : (
                <>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Country & City</p>
                    <p className="text-xs font-semibold text-slate-900">{ticket.country}, {ticket.city}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Scheduled</p>
                    <p className="text-xs font-semibold text-slate-900">{formatDateTime(ticket.dateTime)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Exact Location</p>
                    <p className="text-xs font-semibold text-slate-900">{ticket.location}</p>
                  </div>
                </>
              )}

              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="md:col-span-2 pt-3 border-t border-slate-50">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Attachments ({ticket.attachments.length})</p>
                  <div className="flex flex-wrap gap-2">
                    {ticket.attachments.map((file: any, idx: number) => (
                      <div key={idx} className="group relative w-12 h-12 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                        {file.type?.startsWith('image/') ? (
                          <img src={file.data} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            <FileText className="w-4 h-4" />
                          </div>
                        )}
                        <a 
                          href={file.data} 
                          download={file.name}
                          className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <Search className="w-3 h-3 text-white" />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assigned Engineer Details - New Section in Main Column */}
          {ticket.engineerName && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-50 pb-3">
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <User className="w-3 h-3" /> Assigned Engineer Details
                </h4>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Full Name</p>
                  <p className="text-xs font-semibold text-slate-900">{ticket.engineerName}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Email Address</p>
                  <p className="text-xs font-semibold text-slate-900">{ticket.engineerEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Phone Number</p>
                  <p className="text-xs font-semibold text-slate-900">{ticket.engineerPhone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Traveling From</p>
                  <p className="text-xs font-semibold text-slate-900">{ticket.engineerLocationFrom || 'N/A'}</p>
                </div>

                {ticket.engineerAttachments && ticket.engineerAttachments.length > 0 && (
                  <div className="md:col-span-2 pt-3 border-t border-slate-50">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Engineer Attachments ({ticket.engineerAttachments.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {ticket.engineerAttachments.map((file: any, idx: number) => (
                        <div key={idx} className="group relative w-12 h-12 bg-slate-50 rounded-lg border border-slate-200 overflow-hidden shrink-0">
                          {file.type?.startsWith('image/') ? (
                            <img src={file.data} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <FileText className="w-4 h-4" />
                            </div>
                          )}
                          <a 
                            href={file.data} 
                            download={file.name}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <Search className="w-3 h-3 text-white" />
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* Quote Info - Compact */}
          {ticket.quote && (
            <div className={`p-4 rounded-2xl border ${
              ticket.quote.status === 'Accepted' || ticket.status === 'Approved' ? 'bg-emerald-50 border-emerald-100' :
              ticket.quote.status === 'Declined' || ticket.status === 'Rejected' ? 'bg-rose-50 border-rose-100' :
              'bg-blue-50 border-blue-100'
            }`}>
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 ${
                  ticket.quote.status === 'Accepted' || ticket.status === 'Approved' ? 'text-emerald-600' :
                  ticket.quote.status === 'Declined' || ticket.status === 'Rejected' ? 'text-rose-600' :
                  'text-blue-600'
                }`}>
                  <DollarSign className="w-3 h-3" /> Quotation
                </h4>
                <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${
                  ticket.quote.status === 'Accepted' || ticket.status === 'Approved' ? 'bg-emerald-100 text-emerald-600' :
                  ticket.quote.status === 'Declined' || ticket.status === 'Rejected' ? 'bg-rose-100 text-rose-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  {ticket.quote.status}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-xl font-black text-slate-900">
                  {ticket.quote.currency === 'EUR' ? '€' : '$'}
                  {parseFloat(ticket.quote.amount).toLocaleString()}
                </p>
                <div className="space-y-1 mt-2 border-t border-slate-100 pt-2">
                  {ticket.quote.firstTwoHours && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">{t.clientPortal.quotations.firstTwoHours}:</span>
                      <span className="text-[10px] font-black text-slate-900">
                        {ticket.quote.currency === 'EUR' ? '€' : '$'}{ticket.quote.firstTwoHours}
                      </span>
                    </div>
                  )}
                  {ticket.quote.additionalHours && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">{t.clientPortal.quotations.additionalHours}:</span>
                      <span className="text-[10px] font-black text-slate-900">
                        {ticket.quote.currency === 'EUR' ? '€' : '$'}{ticket.quote.additionalHours}
                      </span>
                    </div>
                  )}
                  {ticket.quote.travelCost && (
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">{t.clientPortal.quotations.travelCost}:</span>
                      <span className="text-[10px] font-black text-slate-900">
                        {ticket.quote.currency === 'EUR' ? '€' : '$'}{ticket.quote.travelCost}
                      </span>
                    </div>
                  )}
                </div>
                {ticket.quote.description && (
                  <p className="text-[10px] text-slate-600 leading-tight line-clamp-2 mt-2">{ticket.quote.description}</p>
                )}
                {(ticket.quote.status === 'Accepted' || ticket.status === 'Quote Accepted' || ticket.status === 'Approved' || ticket.status === 'Assigned' || ticket.status === 'In Progress' || ticket.status === 'On Site' || ticket.status === 'Completed' || ticket.status === 'Waiting for Confirmation') && (
                  <button
                    onClick={handleDownloadPDF}
                    className="w-full mt-3 flex items-center justify-center gap-2 py-2 px-3 bg-white border border-emerald-200 text-emerald-600 rounded-xl text-[10px] font-bold hover:bg-emerald-50 transition-colors shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download PO PDF
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Client Info - Compact */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <User className="w-3 h-3" /> Client
            </h4>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 text-xs font-bold shrink-0">
                {ticket.clientName?.charAt(0)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-900 truncate">
                  {ticket.clientName && ticket.clientName !== 'Unknown Client' 
                    ? ticket.clientName 
                    : (ticket.clientEmail || 'Unknown Client')}
                </p>
                <p className="text-[9px] text-slate-500 truncate">{ticket.contactEmail}</p>
              </div>
            </div>
          </div>

          {/* Assigned Engineer - Compact */}
          {ticket.engineerName && (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-100 space-y-3">
              <h4 className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                <User className="w-3 h-3" /> Engineer
              </h4>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-400 text-xs font-bold shadow-sm shrink-0">
                  {ticket.engineerName?.charAt(0)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 truncate">{ticket.engineerName}</p>
                  <p className="text-[9px] text-slate-500 truncate">{ticket.engineerPhone}</p>
                </div>
              </div>
            </div>
          )}

          {/* Ticket Updates Feed - Compact */}
          {showUpdates && (
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                <Bell className="w-3 h-3" /> Updates
              </h4>
              <div className="space-y-3 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                {ticket.updates && ticket.updates.length > 0 ? (
                  ticket.updates.slice().reverse().map((update: any, idx: number) => (
                    <div key={idx} className="relative pl-4 border-l border-slate-100 pb-2 last:pb-0">
                      <div className="absolute -left-[4.5px] top-1 w-2 h-2 rounded-full bg-brand-teal" />
                      <p className="text-[10px] text-slate-700 leading-tight mb-0.5">{update.text}</p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[8px] font-black text-brand-teal uppercase">{update.author || 'System'}</span>
                        <span className="text-slate-300 text-[8px]">•</span>
                        <p className="text-[8px] font-bold text-slate-400 uppercase">
                          {update.timestamp ? (
                            typeof update.timestamp === 'string' 
                              ? new Date(update.timestamp).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                              : update.timestamp.seconds 
                                ? new Date(update.timestamp.seconds * 1000).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) 
                                : 'N/A'
                          ) : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-2 text-slate-400 italic text-[10px]">No updates.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailView;
