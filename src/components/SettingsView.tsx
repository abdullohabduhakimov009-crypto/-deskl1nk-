import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiUser as User, 
  HiLockClosed as Lock, 
  HiBell as Bell, 
  HiCheckCircle as CheckCircle,
  HiExclamationCircle as AlertCircle,
  HiEye as Eye,
  HiEyeSlash as EyeOff,
  HiTrash as Trash,
  HiArrowPath as Refresh,
  HiShieldCheck as Shield
} from 'react-icons/hi2';
import { PremiumButton } from './PremiumButton';
import { useLanguage } from '../context/LanguageContext';
import { updateDoc, doc, db, serverTimestamp } from '../firebase';

interface SettingsViewProps {
  currentUser: any;
  role: 'admin' | 'client' | 'engineer';
}

const SettingsView: React.FC<SettingsViewProps> = ({ currentUser, role }) => {
  const { language, setLanguage, t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'profile' | 'security' | 'notifications'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Profile State
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });

  // Security State
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Notifications State
  const [notifications, setNotifications] = useState({
    email: currentUser?.notifications?.email ?? true,
    push: currentUser?.notifications?.push ?? true,
    sms: currentUser?.notifications?.sms ?? false,
    marketing: currentUser?.notifications?.marketing ?? false
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profileData.displayName,
        phone: profileData.phone,
        updatedAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: t.settings.successProfile });
    } catch (error) {
      setStatus({ type: 'error', message: t.settings.errorProfile });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveNotifications = async () => {
    setIsSaving(true);
    setStatus(null);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        notifications,
        updatedAt: serverTimestamp()
      });
      setStatus({ type: 'success', message: t.settings.successNotif });
    } catch (error) {
      setStatus({ type: 'error', message: t.settings.errorNotif });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsSaving(true);
    try {
      // In a real app, we'd delete from Auth and Firestore
      await new Promise(resolve => setTimeout(resolve, 2000));
      window.location.href = '/';
    } catch (error) {
      setStatus({ type: 'error', message: t.settings.errorDelete });
      setIsSaving(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword) {
      setStatus({ type: 'error', message: t.settings.errorPassword });
      return;
    }
    if (newPassword !== confirmPassword) {
      setStatus({ type: 'error', message: t.settings.errorPassword }); // Or a more specific one if added
      return;
    }

    setIsSaving(true);
    setStatus(null);
    try {
      // In a real app, we'd use auth.updatePassword
      // For this mock, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStatus({ type: 'success', message: t.settings.successPassword });
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setStatus({ type: 'error', message: t.settings.errorPassword });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    { id: 'profile', label: t.settings.profile, icon: <User className="w-5 h-5" /> },
    { id: 'security', label: t.settings.security, icon: <Lock className="w-5 h-5" /> },
    { id: 'notifications', label: t.settings.notifications, icon: <Bell className="w-5 h-5" /> },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
      {/* Sidebar Navigation */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white rounded-[2rem] border border-slate-200 p-4 shadow-sm sticky top-8">
          <div className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeSection === section.id 
                    ? 'bg-brand-teal text-brand-dark shadow-lg shadow-brand-teal/20' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                {section.icon}
                {section.label}
              </button>
            ))}
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-100 px-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</p>
                <p className="text-xs font-bold text-emerald-500">Verified {role.charAt(0).toUpperCase() + role.slice(1)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1">
        <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 sm:p-12">
            <AnimatePresence mode="wait">
              {activeSection === 'profile' && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{t.settings.profileInfo}</h3>
                    <p className="text-slate-500">{t.settings.profileDesc}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.settings.fullName}</label>
                      <input 
                        type="text"
                        value={profileData.displayName}
                        onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-brand-teal/50 focus:ring-4 focus:ring-brand-teal/5 transition-all"
                        placeholder={t.settings.fullName}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.settings.email}</label>
                      <input 
                        type="email"
                        value={profileData.email}
                        disabled
                        className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium text-slate-500 cursor-not-allowed"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.settings.phone}</label>
                      <input 
                        type="tel"
                        value={profileData.phone}
                        onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-brand-teal/50 focus:ring-4 focus:ring-brand-teal/5 transition-all"
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                      <div className="w-full bg-slate-100 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-bold text-slate-500 uppercase tracking-wider">
                        {role}
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <PremiumButton 
                      onClick={handleSaveProfile}
                      loading={isSaving}
                      className="w-full sm:w-auto px-10 py-4"
                    >
                      {t.settings.saveChanges}
                    </PremiumButton>
                  </div>
                </motion.div>
              )}

              {activeSection === 'security' && (
                <motion.div
                  key="security"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{t.settings.securitySettings}</h3>
                    <p className="text-slate-500">{t.settings.securityDesc}</p>
                  </div>

                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 flex items-start gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-brand-teal shadow-sm flex-shrink-0">
                      <Shield className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{t.settings.passwordReq}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{t.settings.passwordReqDesc}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.settings.newPassword}</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? "text" : "password"}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-brand-teal/50 focus:ring-4 focus:ring-brand-teal/5 transition-all"
                          placeholder="••••••••"
                        />
                        <button 
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">{t.settings.confirmPassword}</label>
                      <input 
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm font-medium outline-none focus:border-brand-teal/50 focus:ring-4 focus:ring-brand-teal/5 transition-all"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <PremiumButton 
                      onClick={handleUpdatePassword}
                      loading={isSaving}
                      className="w-full sm:w-auto px-10 py-4"
                    >
                      {t.settings.updatePassword}
                    </PremiumButton>
                  </div>
                </motion.div>
              )}

              {activeSection === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-8"
                >
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 mb-2">{t.settings.notifPrefs}</h3>
                    <p className="text-slate-500">{t.settings.notifDesc}</p>
                  </div>

                  <div className="divide-y divide-slate-100">
                    {[
                      { id: 'email', title: t.settings.emailNotif, desc: t.settings.emailNotifDesc, icon: <Mail className="w-5 h-5" /> },
                      { id: 'push', title: t.settings.pushNotif, desc: t.settings.pushNotifDesc, icon: <Bell className="w-5 h-5" /> },
                      { id: 'sms', title: t.settings.smsNotif, desc: t.settings.smsNotifDesc, icon: <Phone className="w-5 h-5" /> },
                      { id: 'marketing', title: t.settings.marketingNotif, desc: t.settings.marketingNotifDesc, icon: <Refresh className="w-5 h-5" /> },
                    ].map((item) => (
                      <div key={item.id} className="py-6 flex items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mt-1">
                            {item.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{item.title}</h4>
                            <p className="text-xs text-slate-500 max-w-sm">{item.desc}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleToggleNotification(item.id as any)}
                          className={`w-12 h-6 rounded-full transition-all relative ${notifications[item.id as keyof typeof notifications] ? 'bg-brand-teal' : 'bg-slate-200'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id as keyof typeof notifications] ? 'right-1' : 'left-1'}`} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4">
                    <PremiumButton 
                      onClick={handleSaveNotifications}
                      loading={isSaving}
                      className="w-full sm:w-auto px-10 py-4"
                    >
                      {t.settings.saveNotif}
                    </PremiumButton>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Status Message */}
            <AnimatePresence>
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`mt-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold ${
                    status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'
                  }`}
                >
                  {status.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                  {status.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-8 bg-rose-50/50 rounded-[2.5rem] border border-rose-100 p-8 sm:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 flex-shrink-0">
              <Trash className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-rose-900">{t.settings.dangerZone}</h4>
              <p className="text-xs text-rose-600/70 max-w-sm">{t.settings.deleteDesc}</p>
            </div>
          </div>
          <PremiumButton 
            variant="danger" 
            size="sm" 
            className="px-8"
            onClick={() => setShowDeleteConfirm(true)}
          >
            {t.settings.deleteAccount}
          </PremiumButton>
        </div>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-slate-100"
              >
                <div className="w-16 h-16 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                  <Trash className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-2">{t.settings.deleteConfirmTitle}</h3>
                <p className="text-slate-500 mb-8">{t.settings.deleteConfirmDesc}</p>
                
                <div className="flex flex-col gap-3">
                  <PremiumButton 
                    variant="danger" 
                    onClick={handleDeleteAccount}
                    loading={isSaving}
                    className="w-full py-4"
                  >
                    {t.settings.deleteConfirmButton}
                  </PremiumButton>
                  <button 
                    onClick={() => setShowDeleteConfirm(false)}
                    className="w-full py-4 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    {t.settings.cancel}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Internal Helper Icons
const Mail = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const Phone = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

export default SettingsView;
