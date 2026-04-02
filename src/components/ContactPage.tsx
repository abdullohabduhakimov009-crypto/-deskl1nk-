import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HiEnvelope as Mail, 
  HiPhone as Phone, 
  HiMapPin as MapPin,
  HiChatBubbleLeftRight as MessageSquare,
  HiGlobeAlt as Globe,
  HiArrowRight as ArrowRight,
  HiCheckCircle as CheckCircle
} from 'react-icons/hi2';
import { useLanguage } from '../context/LanguageContext';
import { TypingAnimation } from './TypingAnimation';
import { PremiumButton } from './PremiumButton';

const ContactPage = () => {
  const { t } = useLanguage();
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormState({ name: '', email: '', subject: '', message: '' });
    
    // Reset success message after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: t.contact.info.phone.title,
      details: t.contact.info.phone.details,
      subDetails: t.contact.info.phone.sub,
      color: "text-blue-400"
    },
    {
      icon: Mail,
      title: t.contact.info.email.title,
      details: t.contact.info.email.details,
      subDetails: t.contact.info.email.sub,
      color: "text-teal-400"
    },
    {
      icon: MapPin,
      title: t.contact.info.address.title,
      details: t.contact.info.address.details,
      subDetails: t.contact.info.address.sub,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="pt-24 min-h-screen bg-brand-dark">
      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.05)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto relative">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: false }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 mb-6"
            >
              <MessageSquare className="w-3 h-3 text-brand-teal" />
              <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">{t.contact.tag}</span>
            </motion.div>
            <motion.h1 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight"
            >
              <TypingAnimation text={t.contact.title} /> <span className="text-brand-teal"><TypingAnimation text={t.contact.titleAccent} delay={0.8} /></span> <TypingAnimation text={t.contact.titleSuffix} delay={1.6} />
            </motion.h1>
            <motion.p 
              whileInView={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              viewport={{ once: false }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/50 leading-relaxed"
            >
              {t.contact.subtitle}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <div className="lg:col-span-1 space-y-6">
              {contactInfo.map((item, i) => (
                <motion.div
                  key={i}
                  whileInView={{ opacity: 1, x: 0 }}
                  initial={{ opacity: 0, x: -20 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="glass-card p-8 border-white/5 hover:border-brand-teal/30 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-white font-medium mb-1">{item.details}</p>
                  <p className="text-white/40 text-sm">{item.subDetails}</p>
                </motion.div>
              ))}

              {/* Social Links */}
              <motion.div 
                whileInView={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                viewport={{ once: false }}
                transition={{ delay: 0.6 }}
                className="glass-card p-8 border-white/5"
              >
                <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-6">Follow Our Journey</h3>
                <div className="flex gap-4">
                  {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                    <button key={social} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40 hover:text-brand-teal hover:bg-brand-teal/10 transition-all">
                      <Globe className="w-5 h-5" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div 
              whileInView={{ opacity: 1, x: 0 }}
              initial={{ opacity: 0, x: 30 }}
              viewport={{ once: false }}
              transition={{ delay: 0.4 }}
              className="lg:col-span-2"
            >
              <div className="glass-card p-8 md:p-12 border-white/5 relative overflow-hidden">
                {isSubmitted ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-20"
                  >
                    <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
                      <CheckCircle className="w-10 h-10 text-brand-teal" />
                    </div>
                    <h2 className="text-3xl font-bold text-white mb-4">{t.contact.form.success}</h2>
                    <p className="text-white/50 max-w-sm mx-auto">
                      {t.contact.form.successDesc}
                    </p>
                    <button 
                      onClick={() => setIsSubmitted(false)}
                      className="mt-10 text-brand-teal font-bold text-sm hover:underline"
                    >
                      {t.contact.form.sendAnother}
                    </button>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.contact.form.name}</label>
                        <input 
                          required
                          type="text"
                          placeholder="John Doe"
                          value={formState.name}
                          onChange={(e) => setFormState({...formState, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-teal/50 transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.contact.form.email}</label>
                        <input 
                          required
                          type="email"
                          placeholder="john@company.com"
                          value={formState.email}
                          onChange={(e) => setFormState({...formState, email: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-teal/50 transition-all"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.contact.form.subject}</label>
                      <input 
                        required
                        type="text"
                        placeholder="How can we help?"
                        value={formState.subject}
                        onChange={(e) => setFormState({...formState, subject: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-teal/50 transition-all"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase tracking-widest ml-1">{t.contact.form.message}</label>
                      <textarea 
                        required
                        rows={6}
                        placeholder="Tell us more about your needs..."
                        value={formState.message}
                        onChange={(e) => setFormState({...formState, message: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-white/20 focus:outline-none focus:border-brand-teal/50 transition-all resize-none"
                      />
                    </div>

                    <PremiumButton 
                      disabled={isSubmitting}
                      variant="primary"
                      glow
                      className="w-full py-5"
                      icon={!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                          <span>{t.contact.form.sending}</span>
                        </>
                      ) : (
                        <span>{t.contact.form.submit}</span>
                      )}
                    </PremiumButton>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section Placeholder */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="glass-card h-[400px] border-white/5 overflow-hidden relative flex items-center justify-center">
            <div className="absolute inset-0 opacity-20 grayscale invert">
              {/* This would be a real map in a production app */}
              <div className="w-full h-full bg-[url('https://picsum.photos/seed/city-aerial-dark/1920/1080')] bg-cover bg-center" />
            </div>
            <div className="relative z-10 text-center p-8 glass-card border-white/10 backdrop-blur-xl max-w-sm">
              <MapPin className="w-10 h-10 text-brand-teal mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Global Headquarters</h3>
              <p className="text-white/50 text-sm">100 Tech Plaza, San Francisco, CA 94105, United States</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
