import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiUser as User, 
  HiEnvelope as Mail, 
  HiLockClosed as Lock, 
  HiCalendar as Calendar, 
  HiMapPin as MapPin, 
  HiCodeBracket as Code, 
  HiClock as Clock, 
  HiCurrencyDollar as DollarSign, 
  HiLanguage as Languages, 
  HiPhone as Phone, 
  HiDocumentText as FileText, 
  HiCamera as Camera, 
  HiArrowRight as ArrowRight, 
  HiCheck as Check, 
  HiXMark as X, 
  HiChevronLeft as ChevronLeft, 
  HiMagnifyingGlass as Search, 
  HiPlus as Plus, 
  HiTrash as Trash2, 
  HiCheckCircle as CheckCircle
} from 'react-icons/hi2';
import { 
  FaWhatsapp as Whatsapp, 
  FaLinkedin as Linkedin,
  FaFacebook as Facebook
} from 'react-icons/fa6';
import Select from 'react-select';
import { Country, City } from 'country-state-city';
import ISO6391 from 'iso-639-1';
import countriesLib from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';
import ruCountries from 'i18n-iso-countries/langs/ru.json';
import { useLanguage } from '../context/LanguageContext';
import { PremiumButton } from './PremiumButton';

countriesLib.registerLocale(enCountries);
countriesLib.registerLocale(ruCountries);

interface EngineerSignUpFlowProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
  initialData?: any;
  initialStep?: number;
}

const EngineerSignUpFlow: React.FC<EngineerSignUpFlowProps> = ({ isOpen, onClose, onComplete, initialData, initialStep = 1 }) => {
  const { t, language, setLanguage } = useLanguage();
  const [step, setStep] = useState(initialStep);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialStep) setStep(initialStep);
  }, [initialStep, isOpen]);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    dobDay: null as any,
    dobMonth: null as any,
    dobYear: null as any,
    country: null as any,
    city: null as any,
    zipCode: '',
    specializations: [] as any[],
    experience: '',
    skills: [] as any[],
    hourlyRate: '',
    halfDayRate: '',
    fullDayRate: '',
    currency: 'USD' as 'USD' | 'EUR',
    languages: [] as { name: string, level: string }[],
    phoneCountryCode: null as any,
    phoneNumber: '',
    whatsappCountryCode: null as any,
    whatsappNumber: '',
    linkedin: '',
    facebook: '',
    profilePic: null as string | null,
    cvFile: null as string | null,
    idFile: null as string | null,
  });

  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [idFileName, setIdFileName] = useState<string | null>(null);
  const [isProfilePicConfirmed, setIsProfilePicConfirmed] = useState(false);
  const [isCvConfirmed, setIsCvConfirmed] = useState(false);
  const [isIdConfirmed, setIsIdConfirmed] = useState(false);

  const [currentLang, setCurrentLang] = useState<any>(null);
  const [currentLevel, setCurrentLevel] = useState<any>(null);

  useEffect(() => {
    if (initialData) {
      setFormData(prev => ({
        ...prev,
        fullName: initialData.fullName || '',
        email: initialData.email || '',
        password: initialData.password || '',
      }));
    }
  }, [initialData]);

  const [countries, setCountries] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);

  const languageOptions = useMemo(() => {
    const langNames = new Intl.DisplayNames([language === 'uz' ? 'uz' : language === 'ru' ? 'ru' : 'en'], { type: 'language' });
    const allLanguages = ISO6391.getLanguages(ISO6391.getAllCodes());
    
    return allLanguages.map(lang => {
      const translatedName = langNames.of(lang.code);
      return {
        value: lang.name,
        label: (translatedName && translatedName !== lang.code) ? translatedName : lang.name
      };
    }).sort((a, b) => a.label.localeCompare(b.label));
  }, [language]);

  const proficiencyOptions = [
    { value: 'A1', label: t.signup.onboarding.proficiencyLevels.a1 },
    { value: 'A2', label: t.signup.onboarding.proficiencyLevels.a2 },
    { value: 'B1', label: t.signup.onboarding.proficiencyLevels.b1 },
    { value: 'B2', label: t.signup.onboarding.proficiencyLevels.b2 },
    { value: 'C1', label: t.signup.onboarding.proficiencyLevels.c1 },
    { value: 'C2', label: t.signup.onboarding.proficiencyLevels.c2 },
    { value: 'Native', label: t.signup.onboarding.proficiencyLevels.native },
  ];

  const specializationOptions = [
    { value: 'it_support', label: 'IT Support Specialist' },
    { value: 'network_eng', label: 'Network Engineer' },
    { value: 'sys_admin', label: 'System Administrator' },
    { value: 'cloud_infra', label: 'Cloud Infrastructure Engineer' },
    { value: 'cyber_analyst', label: 'Cybersecurity Analyst' },
    { value: 'service_desk', label: 'IT Service Desk Manager' },
    { value: 'hardware_tech', label: 'Hardware Technician' },
    { value: 'db_admin', label: 'Database Administrator' },
    { value: 'it_consultant', label: 'IT Consultant' },
    { value: 'infra_arch', label: 'Infrastructure Architect' },
    { value: 'tech_support', label: 'Technical Support Engineer' },
    { value: 'voip_eng', label: 'VoIP Engineer' },
  ];

  const skillOptions = [
    { value: 'active_directory', label: 'Active Directory' },
    { value: 'cisco', label: 'Cisco Networking' },
    { value: 'linux', label: 'Linux Administration' },
    { value: 'windows_server', label: 'Windows Server' },
    { value: 'vmware', label: 'VMware / Virtualization' },
    { value: 'azure', label: 'Microsoft Azure' },
    { value: 'aws', label: 'AWS Infrastructure' },
    { value: 'cybersecurity', label: 'Cybersecurity Tools' },
    { value: 'firewalls', label: 'Firewall Management' },
    { value: 'itil', label: 'ITIL Framework' },
    { value: 'office365', label: 'Office 365 Admin' },
    { value: 'powershell', label: 'PowerShell Scripting' },
    { value: 'bash', label: 'Bash Scripting' },
    { value: 'sql', label: 'SQL Database' },
    { value: 'hardware_repair', label: 'Hardware Repair' },
    { value: 'voip', label: 'VoIP Systems' },
    { value: 'monitoring', label: 'Network Monitoring (Zabbix/Nagios)' },
    { value: 'backup', label: 'Backup & Recovery' },
  ];

  useEffect(() => {
    const allCountries = Country.getAllCountries().map(c => {
      let translatedName = c.name;
      if (language === 'ru') {
        translatedName = countriesLib.getName(c.isoCode, 'ru') || c.name;
      } else if (language === 'uz') {
        // Fallback to English for now as 'uz' might not be in the library
        translatedName = c.name;
      }
      
      return {
        value: c.isoCode,
        label: translatedName,
        flag: c.flag,
        phonecode: c.phonecode.startsWith('+') ? c.phonecode : `+${c.phonecode}`
      };
    });
    setCountries(allCountries);
  }, [language]);

  useEffect(() => {
    if (formData.country) {
      const allCities = City.getCitiesOfCountry(formData.country.value) || [];
      // Filter out duplicate city names to avoid duplicate keys in dropdown
      const uniqueCityNames = Array.from(new Set(allCities.map(city => city.name)));
      const countryCities = uniqueCityNames.map(name => ({
        value: name,
        label: name
      }));
      setCities(countryCities);
      setFormData(prev => ({ ...prev, city: null }));
    } else {
      setCities([]);
    }
  }, [formData.country]);

  const days = Array.from({ length: 31 }, (_, i) => ({ value: String(i + 1), label: String(i + 1) }));
  const months = [
    { value: '1', label: 'January' }, { value: '2', label: 'February' }, { value: '3', label: 'March' },
    { value: '4', label: 'April' }, { value: '5', label: 'May' }, { value: '6', label: 'June' },
    { value: '7', label: 'July' }, { value: '8', label: 'August' }, { value: '9', label: 'September' },
    { value: '10', label: 'October' }, { value: '11', label: 'November' }, { value: '12', label: 'December' }
  ];
  const years = Array.from({ length: 100 }, (_, i) => {
    const year = new Date().getFullYear() - 18 - i;
    return { value: String(year), label: String(year) };
  });

  const countryCodeOptions = useMemo(() => 
    countries.map(c => ({
      value: c.phonecode,
      label: `${c.flag} ${c.phonecode} (${c.value})`,
      isoCode: c.value
    })),
  [countries]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validation logic
    if (['fullName'].includes(name)) {
      // Text only: No digits
      if (/\d/.test(value)) return;
    }
    
    if (['experience', 'hourlyRate', 'halfDayRate', 'fullDayRate', 'phoneNumber', 'whatsappNumber', 'linkedin', 'facebook'].includes(name)) {
      // Numbers only: No letters
      // For phone numbers, we allow some symbols, but definitely no letters
      // For usernames, we allow letters and numbers, so we should probably rethink this validation for usernames
      if (['linkedin', 'facebook'].includes(name)) {
        // Allow alphanumeric for usernames
        setFormData(prev => ({ ...prev, [name]: value }));
        return;
      }
      if (/[a-zA-Z]/.test(value)) return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, option: any) => {
    setFormData(prev => ({ ...prev, [name]: option }));
  };

  const addLanguage = () => {
    if (currentLang && currentLevel) {
      if (!formData.languages.find(l => l.name === currentLang.value)) {
        setFormData(prev => ({
          ...prev,
          languages: [...prev.languages, { name: currentLang.value, level: currentLevel.value }]
        }));
        setCurrentLang(null);
        setCurrentLevel(null);
      }
    }
  };

  const removeLanguage = (name: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter(l => l.name !== name)
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'profilePic' | 'cvFile' | 'idFile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        if (type === 'profilePic') {
          setProfilePicPreview(base64String);
          setIsProfilePicConfirmed(false);
          setFormData(prev => ({ ...prev, profilePic: base64String }));
        } else if (type === 'cvFile') {
          setCvFileName(file.name);
          setIsCvConfirmed(false);
          setFormData(prev => ({ ...prev, cvFile: base64String }));
        } else if (type === 'idFile') {
          setIdFileName(file.name);
          setIsIdConfirmed(false);
          setFormData(prev => ({ ...prev, idFile: base64String }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmFile = (type: 'profilePic' | 'cvFile' | 'idFile') => {
    if (type === 'profilePic') setIsProfilePicConfirmed(true);
    else if (type === 'cvFile') setIsCvConfirmed(true);
    else if (type === 'idFile') setIsIdConfirmed(true);
  };

  const removeFile = (type: 'profilePic' | 'cvFile' | 'idFile') => {
    if (type === 'profilePic') {
      setProfilePicPreview(null);
      setIsProfilePicConfirmed(false);
      setFormData(prev => ({ ...prev, profilePic: null }));
    } else if (type === 'cvFile') {
      setCvFileName(null);
      setIsCvConfirmed(false);
      setFormData(prev => ({ ...prev, cvFile: null }));
    } else if (type === 'idFile') {
      setIdFileName(null);
      setIsIdConfirmed(false);
      setFormData(prev => ({ ...prev, idFile: null }));
    }
  };

  const isStepValid = (stepNum: number = step) => {
    switch (stepNum) {
      case 1: return formData.dobDay && formData.dobMonth && formData.dobYear;
      case 2: return formData.country && formData.city;
      case 3: return formData.specializations.length > 0;
      case 4: return formData.experience;
      case 5: return formData.skills.length > 0;
      case 6: return formData.hourlyRate && formData.halfDayRate && formData.fullDayRate;
      case 7: return formData.languages.length > 0;
      case 8: return formData.phoneCountryCode && formData.phoneNumber;
      case 9: return !!formData.cvFile && !!formData.idFile;
      case 10: return !!formData.profilePic;
      default: return true;
    }
  };

  const onboardingSteps = [
    { id: 1, title: t.signup.onboarding.step1.title, icon: Calendar },
    { id: 2, title: t.signup.onboarding.step2.title, icon: MapPin },
    { id: 3, title: t.signup.onboarding.step3.title, icon: Code },
    { id: 4, title: t.signup.onboarding.step4.title, icon: Clock },
    { id: 5, title: t.signup.onboarding.step5.title, icon: Search },
    { id: 6, title: t.signup.onboarding.step6.title, icon: DollarSign },
    { id: 7, title: t.signup.onboarding.step7.title, icon: Languages },
    { id: 8, title: t.signup.onboarding.step8.title, icon: Phone },
    { id: 9, title: t.signup.onboarding.step9.title, icon: FileText },
    { id: 10, title: t.signup.onboarding.step10.title, icon: Camera },
  ];

  const isAllStepsValid = () => {
    return onboardingSteps.every(s => isStepValid(s.id));
  };

  const nextStep = async () => {
    if (step < 10) setStep(step + 1);
    else {
      if (!isAllStepsValid()) {
        // Find the first invalid step and go to it
        const firstInvalidStep = onboardingSteps.find(s => !isStepValid(s.id));
        if (firstInvalidStep) {
          setStep(firstInvalidStep.id);
          return;
        }
      }
      setIsSubmitting(true);
      try {
        await onComplete(formData);
      } catch (error) {
        console.error("Submission error:", error);
        setIsSubmitting(false);
      }
    }
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
    else onClose();
  };

  if (!isOpen) return null;

  const customSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      backgroundColor: '#f8fafc',
      borderColor: state.isFocused ? '#2dd4bf' : '#e2e8f0',
      borderRadius: '0.75rem',
      padding: '0.25rem',
      color: '#0f172a',
      '&:hover': {
        borderColor: 'rgba(45, 212, 191, 0.3)'
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: '#ffffff',
      border: '1px solid #e2e8f0',
      borderRadius: '0.75rem',
      overflow: 'hidden',
      zIndex: 50
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
      color: state.isFocused ? '#0d9488' : '#475569',
      cursor: 'pointer',
      '&:active': {
        backgroundColor: 'rgba(45, 212, 191, 0.2)'
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#0f172a'
    }),
    input: (base: any) => ({
      ...base,
      color: '#0f172a'
    }),
    placeholder: (base: any) => ({
      ...base,
      color: '#94a3b8'
    })
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-labelledby="onboarding-title"
      className="fixed inset-0 z-[200] bg-white flex flex-col overflow-hidden text-slate-900"
    >
      {/* Header */}
      <div className="px-8 py-6 border-b border-slate-200 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <PremiumButton 
            variant="ghost"
            size="sm"
            onClick={prevStep}
            aria-label="Go to previous step"
            className="p-2 min-w-0 w-10 h-10 rounded-full text-slate-400 hover:text-slate-600"
          >
            <ChevronLeft className="w-6 h-6" />
          </PremiumButton>
          <div>
            <h1 id="onboarding-title" className="text-xl font-semibold text-slate-900">{t.signup.engineer} Onboarding</h1>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold" aria-live="polite">
              {t.signup.steps.account} {step} of 10
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative">
            <PremiumButton 
              variant="outline"
              size="sm"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="gap-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:border-slate-300 transition-all"
            >
              <Languages className="w-4 h-4 text-brand-teal" />
              <span>{language === 'en' ? 'English' : language === 'ru' ? 'Русский' : 'O\'zbekcha'}</span>
            </PremiumButton>

            <AnimatePresence>
              {isLangMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                >
                  {[
                    { code: 'en', label: 'English' },
                    { code: 'ru', label: 'Русский' },
                    { code: 'uz', label: 'O\'zbekcha' }
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
                      className={`justify-start gap-3 ${
                        language === lang.code 
                          ? 'bg-brand-teal/10 text-brand-teal' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <span>{lang.label}</span>
                    </PremiumButton>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <PremiumButton 
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close onboarding"
            className="p-2 min-w-0 w-10 h-10 rounded-full text-slate-400 hover:text-slate-600"
          >
            <X className="w-6 h-6" />
          </PremiumButton>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-80 border-r border-slate-200 bg-slate-50/50 overflow-y-auto hidden md:block">
          <div className="p-6 space-y-2">
            <div className="px-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Completion</span>
                <span className="text-xs font-bold text-brand-teal">
                  {Math.round((onboardingSteps.filter(s => isStepValid(s.id)).length / 10) * 100)}%
                </span>
              </div>
              <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-brand-teal"
                  initial={{ width: 0 }}
                  animate={{ width: `${(onboardingSteps.filter(s => isStepValid(s.id)).length / 10) * 100}%` }}
                />
              </div>
            </div>

            {onboardingSteps.map((s) => {
              const isValid = isStepValid(s.id);
              const isActive = step === s.id;
              const Icon = s.icon;
              
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${
                    isActive 
                      ? 'bg-white shadow-sm border border-slate-200 text-brand-teal' 
                      : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                    isActive 
                      ? 'bg-brand-teal text-white' 
                      : isValid 
                        ? 'bg-brand-teal/10 text-brand-teal' 
                        : 'bg-slate-200 text-slate-400 group-hover:bg-slate-300'
                  }`}>
                    {isValid && !isActive ? <Check className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isActive ? 'text-brand-teal' : 'text-slate-400'}`}>
                      Step {s.id}
                    </p>
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-slate-900' : 'text-slate-600'}`}>
                      {s.title}
                    </h3>
                  </div>
                  {isValid && !isActive && (
                    <CheckCircle className="w-4 h-4 text-brand-teal opacity-50" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-8 py-12">
          <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-12">
                <h2 className="text-4xl font-semibold mb-4 text-slate-900">
                  {step === 1 && t.signup.onboarding.step1.title}
                  {step === 2 && t.signup.onboarding.step2.title}
                  {step === 3 && t.signup.onboarding.step3.title}
                  {step === 4 && t.signup.onboarding.step4.title}
                  {step === 5 && t.signup.onboarding.step5.title}
                  {step === 6 && t.signup.onboarding.step6.title}
                  {step === 7 && t.signup.onboarding.step7.title}
                  {step === 8 && t.signup.onboarding.step8.title}
                  {step === 9 && t.signup.onboarding.step9.title}
                  {step === 10 && t.signup.onboarding.step10.title}
                </h2>
                <p className="text-slate-500 text-lg">
                  {step === 1 && t.signup.onboarding.step1.desc}
                  {step === 2 && t.signup.onboarding.step2.desc}
                  {step === 3 && t.signup.onboarding.step3.desc}
                  {step === 4 && t.signup.onboarding.step4.desc}
                  {step === 5 && t.signup.onboarding.step5.desc}
                  {step === 6 && t.signup.onboarding.step6.desc}
                  {step === 7 && t.signup.onboarding.step7.desc}
                  {step === 8 && t.signup.onboarding.step8.desc}
                  {step === 9 && t.signup.onboarding.step9.desc}
                  {step === 10 && t.signup.onboarding.step10.desc}
                </p>
              </div>

              <div className="space-y-8">
                {step === 1 && (
                  <fieldset className="group">
                    <legend className="block text-sm font-semibold text-slate-500 uppercase tracking-widest mb-3">
                      {t.signup.fields.dob}
                    </legend>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                        <Calendar className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-4 flex-1">
                        <Select
                          options={days}
                          placeholder={t.signup.fields.day}
                          styles={customSelectStyles}
                          onChange={(opt) => handleSelectChange('dobDay', opt)}
                          value={formData.dobDay}
                          aria-label="Day of birth"
                        />
                        <Select
                          options={months}
                          placeholder={t.signup.fields.month}
                          styles={customSelectStyles}
                          onChange={(opt) => handleSelectChange('dobMonth', opt)}
                          value={formData.dobMonth}
                          aria-label="Month of birth"
                        />
                        <Select
                          options={years}
                          placeholder={t.signup.fields.year}
                          styles={customSelectStyles}
                          onChange={(opt) => handleSelectChange('dobYear', opt)}
                          value={formData.dobYear}
                          aria-label="Year of birth"
                        />
                      </div>
                    </div>
                  </fieldset>
                )}

                {step === 2 && (
                  <div className="space-y-8">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.country}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <Select
                            options={countries}
                            placeholder={t.signup.onboarding.placeholders.searchCountry}
                            styles={customSelectStyles}
                            onChange={(opt) => handleSelectChange('country', opt)}
                            value={formData.country}
                            isSearchable
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.city}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1">
                          <Select
                            options={cities}
                            placeholder={formData.country ? t.signup.onboarding.placeholders.searchCity : t.signup.onboarding.placeholders.selectCountryFirst}
                            styles={customSelectStyles}
                            onChange={(opt) => handleSelectChange('city', opt)}
                            value={formData.city}
                            isSearchable
                            isDisabled={!formData.country}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="zip-code-input" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.zipCode}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                          <MapPin className="w-6 h-6 text-slate-400" />
                        </div>
                        <input 
                          id="zip-code-input"
                          type="text" 
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          placeholder={t.signup.onboarding.placeholders.zipCode} 
                          className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t.signup.fields.specialization}
                    </label>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                        <Code className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <Select
                          isMulti
                          options={specializationOptions}
                          placeholder={t.signup.onboarding.placeholders.selectSpecializations}
                          styles={customSelectStyles}
                          onChange={(opts) => setFormData(prev => ({ ...prev, specializations: opts as any[] }))}
                          value={formData.specializations}
                          isSearchable
                        />
                      </div>
                    </div>
                    {formData.specializations.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {formData.specializations.map((spec: any) => (
                          <span key={spec.value} className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-brand-teal text-sm font-bold">
                            {spec.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-8">
                    <div className="group">
                      <label htmlFor="experience-input" className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                        {t.signup.fields.experience}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          <Clock className="w-6 h-6 text-slate-400" />
                        </div>
                        <input 
                          id="experience-input"
                          type="text" 
                          name="experience"
                          value={formData.experience}
                          onChange={handleInputChange}
                          placeholder={t.signup.onboarding.placeholders.yearsExperience} 
                          className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 5 && (
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t.signup.fields.skills}
                    </label>
                    <div className="flex gap-4">
                      <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                        <Search className="w-6 h-6 text-slate-400" />
                      </div>
                      <div className="flex-1">
                        <Select
                          isMulti
                          options={skillOptions}
                          placeholder={t.signup.onboarding.placeholders.searchSkills}
                          styles={customSelectStyles}
                          onChange={(opts) => setFormData(prev => ({ ...prev, skills: opts as any[] }))}
                          value={formData.skills}
                          isSearchable
                        />
                      </div>
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="mt-6 flex flex-wrap gap-2">
                        {formData.skills.map((skill: any) => (
                          <span key={skill.value} className="px-4 py-2 bg-brand-teal/10 border border-brand-teal/20 rounded-xl text-brand-teal text-sm font-bold">
                            {skill.label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-8">
                    <div className="group">
                      <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                        Select Currency
                      </label>
                      <div className="grid grid-cols-2 gap-4">
                        <PremiumButton
                          variant={formData.currency === 'USD' ? "primary" : "outline"}
                          onClick={() => setFormData({ ...formData, currency: 'USD' })}
                          className={`flex items-center justify-center p-6 rounded-2xl border-2 transition-all h-auto ${
                            formData.currency === 'USD'
                              ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                              : 'border-slate-200 hover:border-slate-300 text-slate-400'
                          }`}
                        >
                          <span className="text-3xl mr-3">$</span>
                          <span className="font-bold">US Dollar (USD)</span>
                        </PremiumButton>
                        <PremiumButton
                          variant={formData.currency === 'EUR' ? "primary" : "outline"}
                          onClick={() => setFormData({ ...formData, currency: 'EUR' })}
                          className={`flex items-center justify-center p-6 rounded-2xl border-2 transition-all h-auto ${
                            formData.currency === 'EUR'
                              ? 'border-brand-teal bg-brand-teal/10 text-brand-teal'
                              : 'border-slate-200 hover:border-slate-300 text-slate-400'
                          }`}
                        >
                          <span className="text-3xl mr-3">€</span>
                          <span className="font-bold">Euro (EUR)</span>
                        </PremiumButton>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="hourly-rate" className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                        {t.signup.fields.hourlyRate} ({formData.currency})
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          {formData.currency === 'USD' ? <DollarSign className="w-6 h-6 text-slate-400" /> : <span className="text-xl text-slate-400 font-bold">€</span>}
                        </div>
                        <input 
                          id="hourly-rate"
                          type="text" 
                          name="hourlyRate"
                          value={formData.hourlyRate}
                          onChange={handleInputChange}
                          placeholder={`0.00 ${formData.currency}`} 
                          className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label htmlFor="half-day-rate" className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                          {t.signup.fields.halfDayRate} ({formData.currency})
                        </label>
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                            {formData.currency === 'USD' ? <DollarSign className="w-6 h-6 text-slate-400" /> : <span className="text-xl text-slate-400 font-bold">€</span>}
                          </div>
                          <input 
                            id="half-day-rate"
                            type="text" 
                            name="halfDayRate"
                            value={formData.halfDayRate}
                            onChange={handleInputChange}
                            placeholder={`0.00 ${formData.currency}`} 
                            className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                          />
                        </div>
                      </div>
                      <div className="group">
                        <label htmlFor="full-day-rate" className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3">
                          {t.signup.fields.fullDayRate} ({formData.currency})
                        </label>
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                            {formData.currency === 'USD' ? <DollarSign className="w-6 h-6 text-slate-400" /> : <span className="text-xl text-slate-400 font-bold">€</span>}
                          </div>
                          <input 
                            id="full-day-rate"
                            type="text" 
                            name="fullDayRate"
                            value={formData.fullDayRate}
                            onChange={handleInputChange}
                            placeholder={`0.00 ${formData.currency}`} 
                            className="flex-1 bg-white border border-slate-200 rounded-2xl px-6 text-lg text-slate-900 outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {step === 7 && (
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t.signup.fields.languages}
                    </label>
                    <div className="space-y-4">
                      <div className="flex gap-4 items-end">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0">
                          <Languages className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Select
                            options={languageOptions}
                            placeholder={t.signup.onboarding.placeholders.selectLanguage}
                            styles={customSelectStyles}
                            value={currentLang}
                            onChange={setCurrentLang}
                            isSearchable
                          />
                          <Select
                            options={proficiencyOptions}
                            placeholder={t.signup.onboarding.placeholders.selectLevel}
                            styles={customSelectStyles}
                            value={currentLevel}
                            onChange={setCurrentLevel}
                          />
                        </div>
                        <PremiumButton 
                          variant="primary"
                          size="sm"
                          onClick={addLanguage}
                          disabled={!currentLang || !currentLevel}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all p-0 min-w-0 ${
                            currentLang && currentLevel 
                              ? 'bg-brand-teal text-white hover:bg-teal-600' 
                              : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          }`}
                        >
                          <Plus className="w-6 h-6" />
                        </PremiumButton>
                      </div>

                      {formData.languages.length > 0 && (
                        <div className="flex flex-wrap gap-3 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                          {formData.languages.map((lang) => (
                            <div 
                              key={lang.name}
                              className="flex items-center gap-3 bg-brand-teal/10 border border-brand-teal/20 rounded-xl px-4 py-2 group/lang"
                            >
                              <span className="text-brand-teal font-bold">{lang.name}</span>
                              <span className="text-slate-400 text-xs uppercase font-bold">{lang.level}</span>
                              <PremiumButton 
                                variant="ghost"
                                size="sm"
                                onClick={() => removeLanguage(lang.name)}
                                className="text-white/20 hover:text-red-400 transition-colors p-1 min-w-0"
                              >
                                <Trash2 className="w-4 h-4" />
                              </PremiumButton>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {step === 8 && (
                  <div className="space-y-8">
                    <div className="group">
                      <label htmlFor="phone-number" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.phoneNumber}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          <Phone className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 flex gap-3">
                          <div className="w-40">
                            <Select
                              options={countryCodeOptions}
                              placeholder={t.signup.onboarding.placeholders.countryCode}
                              styles={customSelectStyles}
                              onChange={(opt) => handleSelectChange('phoneCountryCode', opt)}
                              value={formData.phoneCountryCode}
                              isSearchable
                              aria-label="Phone country code"
                            />
                          </div>
                          <input 
                            id="phone-number"
                            type="tel" 
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder={t.signup.onboarding.placeholders.phoneNumber} 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="whatsapp-number" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.whatsappNumber}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          <Phone className="w-6 h-6 text-slate-400" />
                        </div>
                        <div className="flex-1 flex gap-3">
                          <div className="w-40">
                            <Select
                              options={countryCodeOptions}
                              placeholder={t.signup.onboarding.placeholders.countryCode}
                              styles={customSelectStyles}
                              onChange={(opt) => handleSelectChange('whatsappCountryCode', opt)}
                              value={formData.whatsappCountryCode}
                              isSearchable
                              aria-label="WhatsApp country code"
                            />
                          </div>
                          <input 
                            id="whatsapp-number"
                            type="tel" 
                            name="whatsappNumber"
                            value={formData.whatsappNumber}
                            onChange={handleInputChange}
                            placeholder={t.signup.onboarding.placeholders.whatsappNumber} 
                            className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                          />
                        </div>
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="linkedin-username" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.linkedin}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          <Linkedin className="w-6 h-6 text-slate-400" />
                        </div>
                        <input 
                          id="linkedin-username"
                          type="text" 
                          name="linkedin"
                          value={formData.linkedin}
                          onChange={handleInputChange}
                          placeholder={t.signup.onboarding.placeholders.linkedin} 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                        />
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="facebook-username" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.facebook}
                      </label>
                      <div className="flex gap-4">
                        <div className="w-14 h-14 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center shrink-0" aria-hidden="true">
                          <Facebook className="w-6 h-6 text-slate-400" />
                        </div>
                        <input 
                          id="facebook-username"
                          type="text" 
                          name="facebook"
                          value={formData.facebook}
                          onChange={handleInputChange}
                          placeholder={t.signup.onboarding.placeholders.facebook} 
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 text-lg outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-all placeholder:text-slate-300" 
                        />
                      </div>
                    </div>
                  </div>
                )}

                {step === 9 && (
                  <div className="space-y-8">
                    <div className="group">
                      <label htmlFor="cv-upload-input" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.cvUpload}
                      </label>
                      <div className="relative group/upload">
                        {!cvFileName ? (
                          <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center group-hover/upload:border-brand-teal/50 group-hover/upload:bg-brand-teal/5 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6 group-hover/upload:scale-110 transition-transform" aria-hidden="true">
                              <FileText className="w-10 h-10 text-brand-teal" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.signup.onboarding.placeholders.uploadCV}</h3>
                            <p className="text-slate-400">{t.signup.onboarding.placeholders.cvFormat}</p>
                            <input 
                              id="cv-upload-input"
                              type="file" 
                              accept=".pdf,.doc,.docx"
                              onChange={(e) => handleFileChange(e, 'cvFile')}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              aria-label="Upload CV"
                            />
                          </div>
                        ) : (
                          <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
                              <FileText className="w-8 h-8 text-brand-teal" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 truncate max-w-full px-4">{cvFileName}</h3>
                            <p className="text-sm text-slate-400 mb-6">File selected successfully</p>
                            
                            <div className="flex gap-4">
                              <div className="px-8 py-3 bg-brand-teal/20 text-brand-teal font-semibold rounded-xl flex items-center gap-2 border border-brand-teal/30" role="status">
                                <CheckCircle className="w-5 h-5" /> {t.signup.onboarding.placeholders.cvConfirmed}
                              </div>
                              <PremiumButton 
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile('cvFile')}
                                aria-label="Remove CV"
                                className="px-6 py-3 border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </PremiumButton>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="group">
                      <label htmlFor="id-upload-input" className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                        {t.signup.fields.idUpload || "ID Upload"}
                      </label>
                      <div className="relative group/upload">
                        {!idFileName ? (
                          <div className="w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 flex flex-col items-center justify-center group-hover/upload:border-brand-teal/50 group-hover/upload:bg-brand-teal/5 transition-all cursor-pointer">
                            <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mb-6 group-hover/upload:scale-110 transition-transform" aria-hidden="true">
                              <FileText className="w-10 h-10 text-brand-teal" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">{t.signup.onboarding.placeholders.uploadID}</h3>
                            <p className="text-slate-400">{t.signup.onboarding.placeholders.idFormat}</p>
                            <input 
                              id="id-upload-input"
                              type="file" 
                              accept=".pdf,.jpg,.jpeg,.png"
                              onChange={(e) => handleFileChange(e, 'idFile')}
                              className="absolute inset-0 opacity-0 cursor-pointer" 
                              aria-label="Upload ID"
                            />
                          </div>
                        ) : (
                          <div className="w-full bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-brand-teal/10 rounded-2xl flex items-center justify-center mb-4" aria-hidden="true">
                              <FileText className="w-8 h-8 text-brand-teal" />
                            </div>
                            <h3 className="text-lg font-bold mb-1 truncate max-w-full px-4">{idFileName}</h3>
                            <p className="text-sm text-slate-400 mb-6">ID selected successfully</p>
                            
                            <div className="flex gap-4">
                              <div className="px-8 py-3 bg-brand-teal/20 text-brand-teal font-semibold rounded-xl flex items-center gap-2 border border-brand-teal/30" role="status">
                                <CheckCircle className="w-5 h-5" /> {t.signup.onboarding.placeholders.idConfirmed}
                              </div>
                              <PremiumButton 
                                variant="outline"
                                size="sm"
                                onClick={() => removeFile('idFile')}
                                aria-label="Remove ID"
                                className="px-6 py-3 border-slate-200 text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all"
                              >
                                <Trash2 className="w-5 h-5" />
                              </PremiumButton>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {step === 10 && (
                  <div className="group">
                    <label className="block text-sm font-bold text-slate-400 uppercase tracking-widest mb-3">
                      {t.signup.fields.profilePic}
                    </label>
                    <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8">
                      <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="w-40 h-40 bg-brand-teal/10 border-2 border-brand-teal/20 rounded-full flex items-center justify-center overflow-hidden shrink-0 relative group/pic">
                          {profilePicPreview ? (
                            <img 
                              src={profilePicPreview} 
                              alt="Preview" 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <Camera className="w-12 h-12 text-brand-teal/40" />
                          )}
                          {!isProfilePicConfirmed && profilePicPreview && (
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/pic:opacity-100 transition-opacity">
                              <PremiumButton 
                                variant="primary"
                                size="sm"
                                onClick={() => removeFile('profilePic')}
                                className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors min-w-0 w-12 h-12"
                                aria-label="Remove profile picture"
                              >
                                <Trash2 className="w-6 h-6" />
                              </PremiumButton>
                            </div>
                          )}
                        </div>
                        <div className="flex-1 text-center md:text-left">
                          <h3 className="text-xl font-bold mb-2 text-slate-900">{t.signup.onboarding.placeholders.profilePicTitle}</h3>
                          <p className="text-slate-500 mb-6">{t.signup.onboarding.placeholders.profilePicDesc}</p>
                          
                          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                            {!profilePicPreview ? (
                              <div className="relative">
                                <PremiumButton 
                                  variant="outline"
                                  size="sm"
                                  className="px-8 py-3 bg-brand-teal/10 text-brand-teal font-semibold rounded-xl hover:bg-brand-teal/20 transition-colors uppercase tracking-widest text-xs"
                                >
                                  {t.signup.onboarding.placeholders.choosePhoto}
                                </PremiumButton>
                                <input 
                                  id="profile-pic-input"
                                  type="file" 
                                  accept="image/*"
                                  onChange={(e) => handleFileChange(e, 'profilePic')}
                                  className="absolute inset-0 opacity-0 cursor-pointer" 
                                  aria-label="Upload profile picture"
                                />
                              </div>
                            ) : (
                              <>
                                <div className="px-8 py-3 bg-brand-teal/20 text-brand-teal font-semibold rounded-xl flex items-center gap-2 border border-brand-teal/30" role="status">
                                  <CheckCircle className="w-5 h-5" /> {t.signup.onboarding.placeholders.photoConfirmed}
                                </div>
                                <PremiumButton 
                                  variant="outline"
                                  size="sm"
                                  onClick={() => removeFile('profilePic')}
                                  className="px-6 py-3 bg-slate-100 text-slate-500 font-semibold rounded-xl hover:bg-red-50 hover:text-red-500 transition-all"
                                >
                                  {t.signup.onboarding.placeholders.change}
                                </PremiumButton>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-16 flex items-center justify-between">
                <PremiumButton 
                  onClick={prevStep}
                  variant="ghost"
                  className="px-8 py-4 uppercase tracking-widest text-sm"
                >
                  {step === 1 ? t.signup.onboarding.placeholders.cancel : t.signup.onboarding.placeholders.back}
                </PremiumButton>
                <PremiumButton 
                  onClick={nextStep}
                  disabled={(step === 10 ? !isAllStepsValid() : !isStepValid()) || isSubmitting}
                  variant="primary"
                  glow
                  className="px-12 py-5 rounded-2xl text-lg"
                  icon={!isSubmitting && <ArrowRight className="w-6 h-6" />}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-6 h-6 border-2 border-brand-dark/30 border-t-brand-dark rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    step === 10 ? t.signup.onboarding.placeholders.completeReg : t.signup.onboarding.placeholders.continue
                  )}
                </PremiumButton>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);
};

export default EngineerSignUpFlow;
