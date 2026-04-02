import React, { useState } from 'react';
import { db, updateDoc, doc } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import { useNotifications } from '../context/NotificationContext';
import { motion } from 'framer-motion';
import { HiCreditCard, HiBuildingLibrary, HiUser, HiHashtag, HiMapPin, HiGlobeAlt } from 'react-icons/hi2';

interface PaymentSetupProps {
  user: any;
  onComplete: () => void;
}

const PaymentSetup: React.FC<PaymentSetupProps> = ({ user, onComplete }) => {
  const { t } = useLanguage();
  const { addNotification } = useNotifications();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    method: user.paymentDetails?.method || 'Bank Transfer',
    bankName: user.paymentDetails?.bankName || '',
    accountHolder: user.paymentDetails?.accountHolder || user.name || user.displayName || '',
    accountNumber: user.paymentDetails?.accountNumber || '',
    swiftCode: user.paymentDetails?.swiftCode || '',
    routingNumber: user.paymentDetails?.routingNumber || '',
    bankAddress: user.paymentDetails?.bankAddress || '',
    accountType: user.paymentDetails?.accountType || 'Checking',
    currency: user.paymentDetails?.currency || 'USD'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await updateDoc(doc(db, "users", user.uid || user.id), {
        paymentDetails: formData
      });
      
      addNotification({
        type: 'success',
        title: t.portal.paymentSetup.success,
        message: t.portal.paymentSetup.successDesc
      });
      onComplete();
    } catch (error) {
      console.error('Error saving payment details:', error);
      addNotification({
        type: 'error',
        title: t.portal.paymentSetup.error,
        message: t.portal.paymentSetup.errorDesc
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 dark:border-slate-800"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <HiCreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {t.portal.paymentSetup.title}
                </h2>
                <p className="text-slate-500 dark:text-slate-400">
                  {t.portal.paymentSetup.subtitle}
                </p>
              </div>
            </div>
            <button
              onClick={onComplete}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title={t.portal.paymentSetup.exit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Payment Method */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiGlobeAlt className="w-4 h-4" />
                  {t.portal.paymentSetup.method}
                </label>
                <select
                  value={formData.method}
                  onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                >
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Payoneer">Payoneer</option>
                  <option value="Wise Transfer">Wise Transfer</option>
                </select>
              </div>

              {/* Currency */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiGlobeAlt className="w-4 h-4" />
                  {t.portal.paymentSetup.currency}
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="UZS">UZS - Uzbek Som</option>
                  <option value="RUB">RUB - Russian Ruble</option>
                </select>
              </div>

              {/* Account Type */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiBuildingLibrary className="w-4 h-4" />
                  {t.portal.paymentSetup.accountType}
                </label>
                <select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                >
                  <option value="Checking">{t.portal.paymentSetup.checking}</option>
                  <option value="Savings">{t.portal.paymentSetup.savings}</option>
                </select>
              </div>

              {/* Bank Name */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiBuildingLibrary className="w-4 h-4" />
                  {t.portal.paymentSetup.bankName}
                </label>
                <input
                  type="text"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="e.g. Chase Bank"
                  required
                />
              </div>

              {/* Account Holder */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiUser className="w-4 h-4" />
                  {t.portal.paymentSetup.accountHolder}
                </label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => setFormData({ ...formData, accountHolder: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  required
                />
              </div>

              {/* Account Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiHashtag className="w-4 h-4" />
                  {t.portal.paymentSetup.accountNumber}
                </label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="IBAN or Account Number"
                  required
                />
              </div>

              {/* SWIFT Code */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiGlobeAlt className="w-4 h-4" />
                  {t.portal.paymentSetup.swiftCode}
                </label>
                <input
                  type="text"
                  value={formData.swiftCode}
                  onChange={(e) => setFormData({ ...formData, swiftCode: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="BIC / SWIFT"
                  required
                />
              </div>

              {/* Routing Number */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <HiHashtag className="w-4 h-4" />
                  {t.portal.paymentSetup.routingNumber}
                </label>
                <input
                  type="text"
                  value={formData.routingNumber}
                  onChange={(e) => setFormData({ ...formData, routingNumber: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none"
                  placeholder="Optional"
                />
              </div>
            </div>

            {/* Bank Address */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <HiMapPin className="w-4 h-4" />
                {t.portal.paymentSetup.bankAddress}
              </label>
              <textarea
                value={formData.bankAddress}
                onChange={(e) => setFormData({ ...formData, bankAddress: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none h-24"
                placeholder="Full bank branch address"
              />
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                type="button"
                onClick={onComplete}
                className="px-8 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl transition-all"
              >
                {t.portal.paymentSetup.exit}
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-8 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.portal.paymentSetup.saving}
                  </>
                ) : (
                  t.portal.paymentSetup.save
                )}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentSetup;
