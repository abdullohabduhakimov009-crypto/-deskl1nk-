import React from 'react';
import { 
  HiMapPin as MapPin, 
  HiClock as Clock, 
  HiCurrencyDollar as DollarSign, 
  HiBriefcase as Briefcase,
  HiCalendar as Calendar,
  HiTag as Tag,
  HiUser as User,
  HiDocumentText as FileText,
  HiCheckCircle as CheckCircle,
  HiInformationCircle as Info
} from 'react-icons/hi2';

interface OpportunityDetailViewProps {
  opportunity: any;
  t: any;
  language: string;
  isAdmin?: boolean;
}

const OpportunityDetailView: React.FC<OpportunityDetailViewProps> = ({ opportunity, t, language, isAdmin = false }) => {
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Review': return 'bg-blue-100 text-blue-600 border-blue-200';
      case 'Active': return 'bg-emerald-100 text-emerald-600 border-emerald-200';
      case 'Closed': return 'bg-slate-100 text-slate-600 border-slate-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-slate-900 truncate" title={opportunity.title}>{opportunity.title}</h3>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase border shrink-0 ${getStatusColor(opportunity.status)}`}>
                {opportunity.status}
              </span>
            </div>
            <p className="text-sm text-slate-500 truncate">
              {opportunity.type} • Created on {formatDateTime(opportunity.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Main Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4" /> Opportunity Description
            </h4>
            <div className="space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                {opportunity.description}
              </p>
            </div>
          </div>

          {/* Location & Timeline */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Info className="w-4 h-4" /> Logistics & Timeline
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Location</p>
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <MapPin className="w-4 h-4 text-brand-teal" />
                  <span>{opportunity.location || 'Remote / Global'}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Timeline</p>
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <Clock className="w-4 h-4 text-brand-teal" />
                  <span>{opportunity.timeline || 'TBD'}</span>
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Budget Range</p>
                <div className="flex items-center gap-2 font-semibold text-slate-900">
                  <DollarSign className="w-4 h-4 text-brand-teal" />
                  <span>{opportunity.budget || 'To be discussed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Attachments */}
          {opportunity.attachments && opportunity.attachments.length > 0 && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Tag className="w-4 h-4" /> Attachments
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {opportunity.attachments.map((file: any, idx: number) => (
                  <div key={idx} className="relative group aspect-square rounded-2xl border border-slate-100 bg-slate-50 overflow-hidden">
                    {file.type.startsWith('image/') ? (
                      <img src={file.data} alt={file.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                        <FileText className="w-8 h-8 text-slate-400 mb-2" />
                        <span className="text-[10px] font-medium text-slate-600 truncate w-full">{file.name}</span>
                      </div>
                    )}
                    <a 
                      href={file.data} 
                      download={file.name}
                      className="absolute inset-0 flex items-center justify-center bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <span className="px-3 py-1.5 bg-white text-slate-900 text-[10px] font-bold rounded-lg shadow-sm">Download</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-8">
          {/* Client Info (Visible to Admin) */}
          {isAdmin && (
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" /> Client Information
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 font-bold">
                    {opportunity.clientName?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 truncate" title={opportunity.clientName || 'Unknown Client'}>{opportunity.clientName || 'Unknown Client'}</p>
                    <p className="text-xs text-slate-500 truncate" title={opportunity.clientEmail}>{opportunity.clientEmail}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6 shadow-xl shadow-slate-900/20">
            <h4 className="text-[10px] font-black uppercase tracking-widest opacity-50">Quick Summary</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">Type</span>
                <span className="text-xs font-bold">{opportunity.type}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">Status</span>
                <span className="text-xs font-bold text-brand-teal">{opportunity.status}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs opacity-70">Posted</span>
                <span className="text-xs font-bold">{formatDateTime(opportunity.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetailView;
