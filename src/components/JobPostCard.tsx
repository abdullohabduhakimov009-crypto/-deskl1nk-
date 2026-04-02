import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiEllipsisHorizontal as EllipsisHorizontal,
  HiXMark as XMark,
  HiGlobeAlt as Globe,
  HiLink as LinkIcon,
  HiChevronDown as ChevronDown,
  HiMapPin as MapPin,
  HiLanguage as LanguageIcon,
  HiWrench as Wrench,
  HiClock as ClockIcon,
  HiUsers as Users,
  HiCurrencyDollar as DollarSign,
  HiDocumentText as FileText,
  HiArrowDownTray as Download
} from 'react-icons/hi2';

interface JobPostCardProps {
  post: {
    author: {
      name: string;
      headline: string;
      avatar: string;
    };
    time: string;
    title: string;
    description: string;
    image?: string;
    tags?: string[];
    country?: string;
    city?: string;
    language?: string;
    languageRequirement?: string;
    technicianType?: string;
    serviceType?: string;
    engineerLevel?: string;
    engineersCount?: string;
    rate?: string;
    currency?: string;
    attachments?: {
      name: string;
      type: string;
      data: string;
    }[];
  };
  onView?: () => void;
  onApply?: () => void;
  isApplied?: boolean;
}

const JobPostCard: React.FC<JobPostCardProps> = ({ post, onView, onApply, isApplied }) => {
  const [showRequirements, setShowRequirements] = React.useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden max-w-2xl mx-auto mb-6"
    >
      {/* Header */}
      <div className="p-4 flex items-start justify-between">
        <div className="flex gap-3">
          <img 
            src={post.author.avatar || "https://picsum.photos/seed/user/100/100"} 
            alt={post.author.name}
            className="w-12 h-12 rounded-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-bold text-slate-900 hover:text-blue-600 hover:underline cursor-pointer">{post.author.name}</span>
              <span className="text-slate-500 text-sm">• 1st</span>
            </div>
            <p className="text-xs text-slate-500 leading-tight">{post.author.headline}</p>
            <div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5">
              <span>{post.time}</span>
              <span>•</span>
              <Globe className="w-3 h-3" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(post.country || post.language || post.technicianType) && (
            <button 
              onClick={() => setShowRequirements(true)}
              className="px-3 py-1.5 bg-brand-teal text-brand-dark rounded-lg text-[10px] font-black uppercase tracking-widest transition-all hover:bg-teal-300 shadow-sm"
            >
              See Requirement
            </button>
          )}
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <EllipsisHorizontal className="w-5 h-5" />
          </button>
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
            <XMark className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Requirements Modal */}
      <AnimatePresence>
        {showRequirements && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRequirements(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Job Requirements</h3>
                <button 
                  onClick={() => setShowRequirements(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                >
                  <XMark className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 gap-4">
                  {post.country && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Location</span>
                        <span className="text-sm font-bold text-slate-700">
                          {post.city ? `${post.city}, ${post.country}` : post.country}
                        </span>
                      </div>
                    </div>
                  )}
                  {post.language && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <LanguageIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Language</span>
                        <span className="text-sm font-bold text-slate-700">
                          {post.language} ({post.languageRequirement || 'Basic'})
                        </span>
                      </div>
                    </div>
                  )}
                  {post.technicianType && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Tech Type</span>
                        <span className="text-sm font-bold text-slate-700">{post.technicianType}</span>
                      </div>
                    </div>
                  )}
                  {post.serviceType && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <ClockIcon className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Service</span>
                        <span className="text-sm font-bold text-slate-700 capitalize">{post.serviceType}</span>
                      </div>
                    </div>
                  )}
                  {post.engineerLevel && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Engineer Level</span>
                        <span className="text-sm font-bold text-slate-700">{post.engineerLevel}</span>
                      </div>
                    </div>
                  )}
                  {post.engineersCount && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <Users className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Engineers</span>
                        <span className="text-sm font-bold text-slate-700">
                          {post.engineersCount} {parseInt(post.engineersCount) > 1 ? 'Engineers' : 'Engineer'}
                        </span>
                      </div>
                    </div>
                  )}
                  {post.rate && (
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-brand-teal">
                        <DollarSign className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Rate</span>
                        <span className="text-sm font-bold text-slate-700">
                          {post.currency === 'EUR' ? '€' : '$'}{post.rate} / {post.serviceType || 'service'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 bg-slate-50 border-t border-slate-100">
                <button 
                  onClick={() => setShowRequirements(false)}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Main Image (Infographic style) */}
      <div className="relative bg-slate-100 cursor-pointer overflow-hidden" onClick={onView}>
        {post.image ? (
          <img 
            src={post.image} 
            alt="Post content" 
            className="w-full h-auto max-h-[800px] object-contain block mx-auto"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full bg-linear-to-b from-blue-900 via-blue-800 to-blue-950 p-6 flex flex-col items-center">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-brand-teal/20" />
              <div className="grid grid-cols-12 h-full w-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border-r border-white/10 h-full" />
                ))}
              </div>
            </div>

            <div className="relative z-10 w-full max-w-lg mx-auto space-y-4">
              {/* Title Section */}
              <div className="text-center mb-6">
                <p className="text-white text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Understanding</p>
                <h2 className="text-white text-4xl font-black tracking-tighter leading-none">
                  TRUNK <span className="text-orange-500">PORT</span>
                </h2>
                <div className="h-1 w-24 bg-orange-500 mx-auto mt-2 rounded-full" />
              </div>

              {/* Grid Content */}
              <div className="grid grid-cols-2 gap-3">
                {/* What is it? */}
                <div className="col-span-2 bg-white/5 backdrop-blur-md p-4 rounded-xl border border-white/10">
                  <h3 className="text-brand-teal text-xs font-black uppercase mb-2 flex items-center gap-2">
                    <div className="w-1 h-3 bg-brand-teal rounded-full" />
                    What is a Trunk Port?
                  </h3>
                  <p className="text-white/80 text-[10px] leading-relaxed">
                    A <span className="text-brand-teal font-bold">trunk port</span> is a switch port configured to carry traffic for <span className="text-white font-bold">multiple VLANs</span> over a single physical link.
                  </p>
                </div>

                {/* How it works */}
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <h3 className="text-brand-teal text-[10px] font-black uppercase mb-2">How it Works</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
                      <span className="text-white/70 text-[8px]">IEEE 802.1Q Tagging</span>
                    </div>
                    <div className="h-12 bg-slate-800/50 rounded-lg border border-white/5 flex items-center justify-center">
                      <div className="flex items-center gap-1">
                        <div className="w-4 h-4 bg-slate-700 rounded" />
                        <div className="w-8 h-1 bg-brand-teal rounded-full" />
                        <div className="w-4 h-4 bg-slate-700 rounded" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Advantages */}
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <h3 className="text-brand-teal text-[10px] font-black uppercase mb-2">Advantages</h3>
                  <ul className="space-y-1.5">
                    {['Efficient Bandwidth', 'Simplified Design', 'Scalability'].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 bg-brand-teal rotate-45" />
                        <span className="text-white/70 text-[8px]">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Use Cases */}
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <h3 className="text-brand-teal text-[10px] font-black uppercase mb-2">Use Cases</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-1 bg-white/5 rounded border border-white/5">
                      <span className="text-white/60 text-[7px] block">Switch to Switch</span>
                    </div>
                    <div className="text-center p-1 bg-white/5 rounded border border-white/5">
                      <span className="text-white/60 text-[7px] block">Switch to Router</span>
                    </div>
                  </div>
                </div>

                {/* Config Example */}
                <div className="bg-white/5 backdrop-blur-md p-3 rounded-xl border border-white/10">
                  <h3 className="text-brand-teal text-[10px] font-black uppercase mb-2">Config Example</h3>
                  <div className="bg-slate-950/50 p-2 rounded font-mono text-[7px] text-emerald-400 border border-white/5">
                    interface Gi0/1 <br />
                    switchport mode trunk <br />
                    switchport trunk allowed vlan 10,20
                  </div>
                </div>
              </div>

              {/* Key Points Footer */}
              <div className="mt-4 bg-orange-500/10 border border-orange-500/20 rounded-xl p-3">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="h-px flex-1 bg-orange-500/30" />
                  <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">Key Points</span>
                  <div className="h-px flex-1 bg-orange-500/30" />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                  {['Carries Multiple VLANs', '802.1Q Tagging', 'Inter-VLAN Comms', 'Switch-to-Switch Links'].map((point, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-orange-500 flex items-center justify-center">
                        <div className="w-1 h-1 bg-white rounded-full" />
                      </div>
                      <span className="text-white/80 text-[7px] font-medium">{point}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-4 py-3 pb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-slate-900 font-medium hover:text-blue-600 cursor-pointer">
            <LinkIcon className="w-4 h-4 text-slate-400 rotate-45" />
            <span className="underline decoration-slate-300 underline-offset-4">{post.title}</span>
          </div>
        </div>

        <p className="text-sm text-slate-600 break-words whitespace-pre-wrap">
          {post.description}
        </p>

        {post.attachments && post.attachments.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {post.attachments.map((file, idx) => (
              <a 
                key={idx}
                href={file.data}
                download={file.name}
                title={`Download ${file.name}`}
                className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 hover:border-brand-teal/30 hover:bg-teal-50/30 transition-all group"
              >
                {file.type?.startsWith('image/') ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-200 overflow-hidden border border-slate-300">
                      <img src={file.data} alt="Attachment" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <span className="font-medium text-slate-500">Image Attachment</span>
                  </div>
                ) : (
                  <>
                    <FileText className="w-4 h-4 text-slate-400 group-hover:text-brand-teal" />
                    <span className="truncate max-w-[150px] font-medium">{file.name}</span>
                  </>
                )}
                <Download className="w-3 h-3 text-slate-400 group-hover:text-brand-teal ml-1" />
              </a>
            ))}
          </div>
        )}

        {onApply && (
          <div className="mt-6 pt-6 border-t border-slate-100 flex justify-end">
            <button
              onClick={onApply}
              disabled={isApplied}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                isApplied 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                  : 'bg-brand-teal text-brand-dark hover:bg-teal-300 shadow-brand-teal/20'
              }`}
            >
              {isApplied ? 'Applied' : 'Apply Now'}
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default JobPostCard;
