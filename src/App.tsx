import { 
  motion, AnimatePresence, useInView, animate 
} from "framer-motion";
import { 
  HiArrowRight as ArrowRight, 
  HiPlay as Play, 
  HiStar as Star,
  HiUsers as Users, 
  HiGlobeAlt as Globe, 
  HiBolt as Zap, 
  HiShieldCheck as Shield, 
  HiCheckCircle as CheckCircle, 
  HiArrowTrendingUp as TrendingUp,
  HiChartBar as BarChart3,
  HiSquares2X2 as Layers,
  HiAcademicCap as Award,
  HiChevronDown as ChevronDown,
  HiCheck as Check,
  HiXMark as X,
  HiEnvelope as Mail,
  HiLockClosed as Lock,
  HiUser as User,
  HiBriefcase as Briefcase,
  HiShieldCheck as ShieldCheck,
  HiCalendar as Calendar,
  HiMapPin as MapPin,
  HiCodeBracket as Code,
  HiClock as Clock,
  HiCurrencyDollar as DollarSign,
  HiLanguage as Languages,
  HiPhone as Phone,
  HiDocumentText as FileText,
  HiCamera as Camera,
  HiHome as Home,
  HiInformationCircle as Info,
  HiLifebuoy as LifeBuoy,
  HiExclamationCircle as AlertCircle,
  HiChatBubbleLeftRight as MessageSquare,
  HiPaperAirplane as Send,
  HiArrowPath as Loader2,
  HiArrowTopRightOnSquare as ExternalLink,
  HiEye as Eye,
  HiEyeSlash as EyeOff,
  HiMagnifyingGlass as Search
} from "react-icons/hi2";
import { 
  FaWhatsapp as Whatsapp, 
  FaLinkedin as Linkedin,
  FaFacebook as Facebook,
  FaAmazon,
  FaMicrosoft
} from "react-icons/fa6";
import { 
  SiMeta, 
  SiApple, 
  SiNetflix, 
  SiUber, 
  SiAirbnb, 
  SiStripe, 
  SiShopify, 
  SiSlack, 
  SiZoom 
} from "react-icons/si";
import { LanguageProvider, useLanguage } from "./context/LanguageContext";
import { TypingAnimation } from "./components/TypingAnimation";
import { PremiumButton } from "./components/PremiumButton";
import { RollingText } from "./components/RollingText";
import AILogo from "./components/AILogo";
import GeminiAssistant from "./components/GeminiAssistant";
import { NotificationProvider } from "./context/NotificationContext";
import { Language } from "./translations";
import React, { useState, useEffect, useMemo, useRef } from "react";
import { trackPageView, trackEvent } from "./analytics";
import Select from 'react-select';
import { Country } from 'country-state-city';
import EngineerSignUpFlow from "./components/EngineerSignUpFlow";
import EngineerPortal from "./components/EngineerPortal";
import ClientPortal from "./components/ClientPortal";
import AdminPortal from "./components/AdminPortal";
import ContactPage from "./components/ContactPage";
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import { 
  auth, 
  db, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged, 
  signOut,
  doc, 
  getDoc, 
  setDoc, 
  addDoc,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  getDocs,
  updateDoc,
  serverTimestamp
} from "./firebase";
// import { 
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   onAuthStateChanged, 
//   signOut,
//   User as FirebaseUser
// } from "firebase/auth";
// import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import createGlobe from "cobe";

const NetworkAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    resize();

    const particleCount = 55; // Sparse count matching screenshot
    const particles: any[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 1000,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        vz: (Math.random() - 0.5) * 0.2,
        size: Math.random() * 4 + 2, // Smaller dots
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.z < 0) p.z = 1000;
        if (p.z > 1000) p.z = 0;

        const scale = 1000 / (1000 + p.z);
        const x2d = (p.x - width / 2) * scale + width / 2;
        const y2d = (p.y - height / 2) * scale + height / 2;
        const size = p.size * scale;
        const opacity = scale * 0.8;

        let connections = 0;
        for (let j = i + 1; j < particles.length; j++) {
          if (connections >= 3) break; // Limit connections per dot to 3-4 total
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 280) { // Slightly increased distance for better clustering
            connections++;
            const lineOpacity = (1 - dist / 280) * opacity * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = `rgba(45, 212, 191, ${lineOpacity})`; // Teal lines
            ctx.lineWidth = 0.6;
            ctx.moveTo(x2d, y2d);
            const scale2 = 1000 / (1000 + p2.z);
            const x2d2 = (p2.x - width / 2) * scale2 + width / 2;
            const y2d2 = (p2.y - height / 2) * scale2 + height / 2;
            ctx.lineTo(x2d2, y2d2);
            ctx.stroke();
          }
        }

        const mdx = x2d - mouseRef.current.x;
        const mdy = y2d - mouseRef.current.y;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);

        if (mdist < 200) {
          const mouseLineOpacity = (1 - mdist / 200) * 0.5;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(45, 212, 191, ${mouseLineOpacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(x2d, y2d);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();
        }

        ctx.beginPath();
        ctx.arc(x2d, y2d, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(45, 212, 191, ${opacity})`; // Teal dots
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 opacity-80 pointer-events-none"
    />
  );
};

const GlobeAnimation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const globeRef = useRef<any>(null);

  useEffect(() => {
    let phi = 0;
    let width = 0;

    const onResize = () => {
      if (canvasRef.current) {
        width = canvasRef.current.offsetWidth;
        if (width > 0 && !globeRef.current) {
          initGlobe(width);
        }
      }
    };

    const initGlobe = (initialWidth: number) => {
      if (!canvasRef.current) return;
      
      globeRef.current = createGlobe(canvasRef.current, {
        devicePixelRatio: 2,
        width: initialWidth * 2,
        height: initialWidth * 2,
        phi: 0,
        theta: 0,
        dark: 1,
        diffuse: 1.2,
        mapSamples: 16000,
        mapBrightness: 6,
        baseColor: [0.039, 0.066, 0.125], // #0A1120
        markerColor: [0.176, 0.831, 0.749], // #2DD4BF (brand-teal)
        glowColor: [0.176, 0.831, 0.749],
        markers: [
          // North America
          { location: [37.7749, -122.4194], size: 0.03 }, // San Francisco
          { location: [40.7128, -74.0060], size: 0.03 }, // New York
          { location: [45.4215, -75.6972], size: 0.03 }, // Ottawa
          { location: [19.4326, -99.1332], size: 0.03 }, // Mexico City
          { location: [34.0522, -118.2437], size: 0.03 }, // LA
          { location: [25.7617, -80.1918], size: 0.03 }, // Miami
          { location: [51.0447, -114.0719], size: 0.03 }, // Calgary
          
          // South America
          { location: [-23.5505, -46.6333], size: 0.03 }, // Sao Paulo
          { location: [-34.6037, -58.3816], size: 0.03 }, // Buenos Aires
          { location: [4.7110, -74.0721], size: 0.03 }, // Bogota
          { location: [-12.0464, -77.0428], size: 0.03 }, // Lima
          { location: [-33.4489, -70.6693], size: 0.03 }, // Santiago
          
          // Europe
          { location: [51.5074, -0.1278], size: 0.03 }, // London
          { location: [48.8566, 2.3522], size: 0.03 }, // Paris
          { location: [52.5200, 13.4050], size: 0.03 }, // Berlin
          { location: [40.4168, -3.7038], size: 0.03 }, // Madrid
          { location: [41.9028, 12.4964], size: 0.03 }, // Rome
          { location: [52.3676, 4.9041], size: 0.03 }, // Amsterdam
          { location: [59.3293, 18.0686], size: 0.03 }, // Stockholm
          { location: [50.0755, 14.4378], size: 0.03 }, // Prague
          { location: [52.2297, 21.0122], size: 0.03 }, // Warsaw
          { location: [47.4979, 19.0402], size: 0.03 }, // Budapest
          { location: [60.1699, 24.9384], size: 0.03 }, // Helsinki
          { location: [59.9139, 10.7522], size: 0.03 }, // Oslo
          { location: [38.7223, -9.1393], size: 0.03 }, // Lisbon
          { location: [37.9838, 23.7275], size: 0.03 }, // Athens
          
          // Africa
          { location: [6.5244, 3.3792], size: 0.03 }, // Lagos
          { location: [-26.2041, 28.0473], size: 0.03 }, // Johannesburg
          { location: [-1.2921, 36.8219], size: 0.03 }, // Nairobi
          { location: [30.0444, 31.2357], size: 0.03 }, // Cairo
          { location: [33.5731, -7.5898], size: 0.03 }, // Casablanca
          { location: [9.0249, 38.7469], size: 0.03 }, // Addis Ababa
          { location: [5.6037, -0.1870], size: 0.03 }, // Accra
          
          // Asia
          { location: [35.6895, 139.6917], size: 0.03 }, // Tokyo
          { location: [31.2304, 121.4737], size: 0.03 }, // Shanghai
          { location: [37.5665, 126.9780], size: 0.03 }, // Seoul
          { location: [1.3521, 103.8198], size: 0.03 }, // Singapore
          { location: [13.7563, 100.5018], size: 0.03 }, // Bangkok
          { location: [-6.2088, 106.8456], size: 0.03 }, // Jakarta
          { location: [14.5995, 120.9842], size: 0.03 }, // Manila
          { location: [19.0760, 72.8777], size: 0.03 }, // Mumbai
          { location: [28.6139, 77.2090], size: 0.03 }, // Delhi
          { location: [12.9716, 77.5946], size: 0.03 }, // Bangalore
          { location: [25.2048, 55.2708], size: 0.03 }, // Dubai
          { location: [24.7136, 46.6753], size: 0.03 }, // Riyadh
          { location: [41.0082, 28.9784], size: 0.03 }, // Istanbul
          { location: [41.3275, 69.2263], size: 0.03 }, // Tashkent
          { location: [43.2220, 76.8512], size: 0.03 }, // Almaty
          { location: [40.4093, 49.8671], size: 0.03 }, // Baku
          { location: [32.0853, 34.7818], size: 0.03 }, // Tel Aviv
          { location: [10.8231, 106.6297], size: 0.03 }, // Ho Chi Minh City
          
          // Oceania
          { location: [-33.8688, 151.2093], size: 0.03 }, // Sydney
          { location: [-37.8136, 144.9631], size: 0.03 }, // Melbourne
          { location: [-36.8485, 174.7633], size: 0.03 }, // Auckland
          { location: [-27.4705, 153.0260], size: 0.03 }, // Brisbane
          
          // Additional to reach ~94+ countries representation
          { location: [55.7558, 37.6173], size: 0.03 }, // Moscow
          { location: [64.1466, -21.9426], size: 0.03 }, // Reykjavik
          { location: [60.1282, 18.6435], size: 0.03 }, // Sweden (Central)
          { location: [56.1304, -106.3468], size: 0.03 }, // Canada (Central)
          { location: [-25.2744, 133.7751], size: 0.03 }, // Australia (Central)
          { location: [20.5937, 78.9629], size: 0.03 }, // India (Central)
          { location: [35.8617, 104.1954], size: 0.03 }, // China (Central)
          { location: [-14.2350, -51.9253], size: 0.03 }, // Brazil (Central)
          { location: [9.0820, 8.6753], size: 0.03 }, // Nigeria (Central)
          { location: [34.8021, 106.4606], size: 0.03 }, // Japan (Central)
          { location: [23.6345, -102.5528], size: 0.03 }, // Mexico (Central)
          { location: [46.2276, 2.2137], size: 0.03 }, // France (Central)
          { location: [51.1657, 10.4515], size: 0.03 }, // Germany (Central)
          { location: [41.8719, 12.5674], size: 0.03 }, // Italy (Central)
          { location: [52.1326, 5.2913], size: 0.03 }, // Netherlands (Central)
          { location: [50.5039, 4.4699], size: 0.03 }, // Belgium (Central)
          { location: [47.5162, 14.5501], size: 0.03 }, // Austria (Central)
          { location: [46.8182, 8.2275], size: 0.03 }, // Switzerland (Central)
          { location: [53.3498, -6.2603], size: 0.03 }, // Dublin
          { location: [55.6761, 12.5683], size: 0.03 }, // Copenhagen
          { location: [59.4370, 24.7535], size: 0.03 }, // Tallinn
          { location: [56.9496, 24.1052], size: 0.03 }, // Riga
          { location: [54.6872, 25.2797], size: 0.03 }, // Vilnius
          { location: [45.8150, 15.9819], size: 0.03 }, // Zagreb
          { location: [44.4268, 26.1025], size: 0.03 }, // Bucharest
          { location: [42.6977, 23.3219], size: 0.03 }, // Sofia
          { location: [44.7866, 20.4489], size: 0.03 }, // Belgrade
          { location: [41.3275, 19.8187], size: 0.03 }, // Tirana
          { location: [35.1856, 33.3823], size: 0.03 }, // Nicosia
          { location: [35.9375, 14.3754], size: 0.03 }, // Malta
          { location: [33.8886, 35.4955], size: 0.03 }, // Beirut
          { location: [31.9454, 35.9284], size: 0.03 }, // Amman
          { location: [29.3759, 47.9774], size: 0.03 }, // Kuwait City
          { location: [25.2854, 51.5310], size: 0.03 }, // Doha
          { location: [26.2285, 50.5860], size: 0.03 }, // Manama
          { location: [23.5859, 58.4059], size: 0.03 }, // Muscat
        ],
        onRender: (state) => {
          phi += 0.005;
          state.phi = phi;
          const currentWidth = canvasRef.current?.offsetWidth || 0;
          if (currentWidth > 0) {
            state.width = currentWidth * 2;
            state.height = currentWidth * 2;
          }
        },
      });
    };

    window.addEventListener('resize', onResize);
    
    // Initial check with a small delay to ensure DOM is ready
    const timer = setTimeout(onResize, 100);

    return () => {
      if (globeRef.current) globeRef.current.destroy();
      window.removeEventListener('resize', onResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full flex items-center justify-center relative group">
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: "100%", aspectRatio: "1" }}
      />
    </div>
  );
};

declare global {
  interface Window {
    aistudio: {
      hasSelectedApiKey: () => Promise<boolean>;
      openSelectKey: () => Promise<void>;
    };
  }
}

import Logo from "./components/Logo";
import WorldMap from "./components/WorldMap";

const Navbar = ({ 
  onLoginClick, 
  onSignUpClick, 
  onAIAssistantClick,
  currentPage, 
  setCurrentPage 
}: { 
  onLoginClick: () => void, 
  onSignUpClick: () => void,
  onAIAssistantClick: () => void,
  currentPage: string,
  setCurrentPage: (page: string) => void
}) => {
  const { t, language, setLanguage } = useLanguage();
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'ru', label: 'Russian', flag: '🇷🇺' },
    { code: 'uz', label: 'Uzbek', flag: '🇺🇿' }
  ];

  const navLinks = [
    { id: 'home', label: t.nav.home, icon: Home },
    { id: 'about', label: t.about.tag, icon: Info },
    { id: 'why', label: t.why.tag, icon: Star },
    { id: 'contact', label: t.nav.contact, icon: Phone }
  ];

  return (
    <>
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 w-[calc(100%-1.5rem)] sm:w-[calc(100%-3rem)] max-w-7xl z-[100] transition-all duration-500 ${
          scrolled 
            ? 'top-4 bg-black/95 border-brand-teal/20 shadow-[0_0_40px_rgba(45,212,191,0.1),0_25px_50px_rgba(0,0,0,0.6)]' 
            : 'top-8 bg-black/70 border-white/5 shadow-2xl'
        } md:backdrop-blur-2xl backdrop-blur-none border rounded-[2rem] group overflow-visible`}
      >
        {/* Subtle Pulse Glow */}
        <div className="absolute inset-0 bg-brand-teal/0 group-hover:bg-brand-teal/[0.02] transition-colors duration-700 rounded-[2rem] overflow-hidden" />

        <div className="px-4 sm:px-8 h-20 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Logo />
          </div>
          
          {/* Navigation Links - Pill Container */}
          <div className="hidden lg:flex items-center gap-2 p-1.5 bg-white/5 border border-white/5 rounded-[1.5rem]">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPage === link.id;
              return (
                <motion.button
                  key={link.id}
                  initial="initial"
                  whileHover="hovered"
                  variants={{
                    hovered: { scale: 1.02 }
                  }}
                  transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentPage(link.id);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`flex items-center gap-2.5 px-6 py-2.5 text-[13px] font-semibold transition-all rounded-[1.2rem] relative ${
                    isActive 
                      ? 'text-brand-dark' 
                      : 'text-white/50 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="nav-active-bg"
                      className="absolute inset-0 bg-brand-teal rounded-[1.2rem] shadow-[0_0_25px_rgba(45,212,191,0.4)]"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2.5">
                    <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-brand-dark' : 'text-white/30'}`} />
                    <RollingText text={link.label} className="tracking-tight" />
                    {isActive && (
                      <motion.div 
                        layoutId="nav-active-dot"
                        className="w-1.5 h-1.5 bg-brand-dark/80 rounded-full ml-1"
                      />
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
            <div className="hidden md:block relative">
              <button 
                onClick={() => setIsLangModalOpen(!isLangModalOpen)}
                className="flex items-center gap-2 text-[13px] font-semibold text-white/40 hover:text-white transition-all group"
              >
                <Languages className="w-4 h-4 text-white/30 group-hover:text-brand-teal transition-colors" />
                <span>{languages.find(l => l.code === language)?.label}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangModalOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Language Dropdown */}
              <AnimatePresence>
                {isLangModalOpen && (
                  <>
                    <div 
                      className="fixed inset-0 z-[90]" 
                      onClick={() => setIsLangModalOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-black/95 md:backdrop-blur-3xl backdrop-blur-none border border-white/20 rounded-2xl p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_20px_rgba(45,212,191,0.1)] z-[100] overflow-y-auto max-h-[70vh]"
                    >
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => {
                            setLanguage(lang.code);
                            setIsLangModalOpen(false);
                          }}
                          className={`w-full p-3 rounded-xl text-left flex items-center justify-between group transition-all ${language === lang.code ? 'bg-brand-teal text-brand-dark' : 'hover:bg-white/5 text-white/50 hover:text-white'}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{lang.flag}</span>
                            <span className="font-bold text-xs">{lang.label}</span>
                          </div>
                          {language === lang.code && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <PremiumButton 
              onClick={onLoginClick}
              variant="ghost"
              className="hidden sm:flex px-4 py-2 text-[13px] text-white/60 hover:text-white"
            >
              {t.nav.login}
            </PremiumButton>
            
            <PremiumButton 
              onClick={onSignUpClick}
              variant="primary"
              className="px-3 sm:px-5 lg:px-7 py-2 sm:py-2.5 text-[11px] sm:text-[13px] rounded-[1rem] sm:rounded-[1.2rem]"
            >
              {t.nav.signUp || "Sign Up"}
            </PremiumButton>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-white/40 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Layers className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-[40] bg-black/95 md:backdrop-blur-3xl backdrop-blur-none lg:hidden pt-32 px-8"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPage === link.id;
                return (
                  <motion.button
                    key={link.id}
                    initial="initial"
                    whileHover="hovered"
                    transition={{ duration: 0.45, ease: [0.65, 0, 0.35, 1] }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setCurrentPage(link.id);
                      setIsMobileMenuOpen(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`flex items-center gap-4 p-5 rounded-2xl text-lg font-bold transition-all ${
                      isActive ? 'bg-brand-teal text-brand-dark' : 'bg-white/5 text-white/60'
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <RollingText text={link.label} />
                  </motion.button>
                );
              })}
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onLoginClick();
                  }}
                  className="p-5 bg-white/5 rounded-2xl text-center font-bold text-white/60"
                >
                  {t.nav.login}
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    onSignUpClick();
                  }}
                  className="p-5 bg-brand-teal rounded-2xl text-center font-bold text-brand-dark"
                >
                  {t.nav.signUp}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HomeHero = ({ 
  onSignUpClick, 
  onWatchDemoClick,
  onAIAssistantClick
}: { 
  onSignUpClick: () => void, 
  onWatchDemoClick: () => void,
  onAIAssistantClick: () => void
}) => {
  const { t } = useLanguage();
  
  return (
    <section className="relative pt-48 pb-32 px-6 overflow-hidden min-h-screen flex items-center">
      {/* Dynamic Background Elements */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-teal/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[150px] -z-10" />
      
      {/* Overlay for readability */}
      <div className="absolute inset-0 bg-brand-dark/40 -z-10" />
      
      <div className="max-w-6xl mx-auto text-center relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: false }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="inline-block px-4 py-1.5 mb-8 rounded-full bg-white/5 border border-white/10 md:backdrop-blur-md backdrop-blur-none"
        >
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-brand-teal">
              {t.hero.badge || "Global Engineering Network"}
            </span>
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-4xl sm:text-6xl md:text-8xl font-bold tracking-tighter mb-8 leading-[1.1] md:leading-[1.05] text-white"
        >
          <TypingAnimation text={t.hero.title} delay={0.5} /> <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-teal to-emerald-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.3)]">
            <TypingAnimation text={t.hero.titleAccent} delay={1.5} />
          </span>
          <motion.span
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
            className="inline-block w-[4px] h-[0.8em] bg-brand-teal ml-2 align-middle"
          />
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-medium"
        >
          {t.hero.subtitle}
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-8"
        >
          <PremiumButton 
            onClick={onSignUpClick}
            variant="primary"
            glow
            icon={<ArrowRight className="w-5 h-5" />}
            className="px-8 py-4 text-base"
          >
            {t.hero.ctaPrimary}
          </PremiumButton>
          
          <PremiumButton 
            onClick={onWatchDemoClick}
            variant="secondary"
            className="px-8 py-4 text-base"
            icon={<Play className="w-4 h-4 fill-brand-teal text-brand-teal" />}
          >
            {t.hero.ctaSecondary}
          </PremiumButton>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12"
        >
          {[
            { label: "Active Engineers", value: "3,500+" },
            { label: "Countries", value: "94+" },
            { label: "Success Rate", value: "99.8%" },
            { label: "Avg. Response", value: "< 2h" }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-white/30 font-bold">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

const VideoDemoModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 md:backdrop-blur-md backdrop-blur-none"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-4xl bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-20 bg-slate-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">Platform Demonstration</h2>
            <p className="text-slate-500">Experience the future of global IT talent management</p>
          </div>

          <div className="aspect-video bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="text-center p-8">
              <div className="w-20 h-20 bg-brand-teal/10 rounded-full flex items-center justify-center mx-auto mb-8">
                <Play className="w-10 h-10 text-brand-teal fill-brand-teal" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Demo Coming Soon</h3>
              <p className="text-slate-500 mb-10 max-w-sm mx-auto">
                We are currently updating our platform demonstration. Please check back later or contact our sales team for a live walkthrough.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const AboutUs = () => {
  const { t } = useLanguage();

  return (
    <div className="pt-24">
      {/* Hero Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 mb-8">
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">{t.about.tag}</span>
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight">
                <TypingAnimation text={t.about.heroTitle} delay={0.3} />
              </h1>
              <p className="text-lg md:text-xl text-white/50 max-w-xl leading-relaxed mb-10">
                {t.about.heroDesc}
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50, scale: 0.9 }}
              whileInView={{ opacity: 1, x: 0, scale: 1 }}
              viewport={{ once: false, amount: 0.3 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="relative"
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key="globe"
                  initial={{ opacity: 0, rotateY: -20 }}
                  animate={{ opacity: 1, rotateY: 0 }}
                  exit={{ opacity: 0, rotateY: 20 }}
                  className="relative w-full aspect-square max-w-[600px] mx-auto flex items-center justify-center"
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <GlobeAnimation />
                  </div>
                  
                  {/* Floating Stats Cards */}
                  <motion.div 
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    whileHover={{ scale: 1.1, zIndex: 30 }}
                    className="absolute top-10 -left-10 glass-card p-4 border-white/10 shadow-2xl z-20 cursor-default hover-glow overflow-hidden"
                  >
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 relative z-10">Verified Engineers</p>
                    <p className="text-xl font-bold text-brand-teal relative z-10"><Counter value="3,500+" /></p>
                  </motion.div>

                  <motion.div 
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    whileHover={{ scale: 1.1, zIndex: 30 }}
                    className="absolute bottom-20 -right-10 glass-card p-4 border-white/10 shadow-2xl z-20 cursor-default hover-glow overflow-hidden"
                  >
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-1 relative z-10">Countries</p>
                    <p className="text-xl font-bold text-brand-teal relative z-10"><Counter value="94+" /></p>
                  </motion.div>

                  {/* Central Glow */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand-teal/10 blur-[100px] rounded-full -z-10" />
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-32 pt-16 border-t border-white/5">
            {[
              { value: '3,500+', label: t.stats.verified },
              { value: '35+', label: t.stats.partners },
              { value: '95%', label: t.stats.satisfaction },
              { value: '48h', label: t.stats.matchTime }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <p className="text-4xl font-bold text-brand-teal mb-2"><Counter value={stat.value} /></p>
                <p className="text-xs font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 mb-8">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-teal" />
                <span className="text-[10px] font-bold text-brand-teal uppercase tracking-widest">{t.about.missionTag}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">
                {t.about.missionTitle}
              </h2>
              <p className="text-lg text-white/50 mb-10 leading-relaxed max-w-xl">
                {t.about.missionDesc}
              </p>
              <div className="flex items-center gap-3 text-white/40 group cursor-default">
                <span className="text-sm font-bold uppercase tracking-widest group-hover:text-brand-teal transition-colors">{t.about.rigorousVetting}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false, amount: 0.3 }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent z-10" />
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2070" 
                  alt="Global Tech Collaboration" 
                  className="w-full h-[500px] object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    if (!target.src.includes('picsum.photos')) {
                      target.src = "https://picsum.photos/seed/tech-collaboration/1920/1080";
                    }
                  }}
                />
                <div className="absolute bottom-8 left-8 z-20">
                  <div className="w-12 h-12 bg-brand-teal rounded-xl flex items-center justify-center mb-4 shadow-lg">
                    <Users className="w-6 h-6 text-brand-dark" />
                  </div>
                  <p className="text-2xl font-bold text-white max-w-xs leading-tight">
                    Connecting the best minds in tech
                  </p>
                </div>
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-teal/20 blur-[60px] rounded-full -z-10" />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Global Presence Section */}
      <section className="py-24 px-6 relative bg-black/40">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              We serve in <span className="text-brand-teal">94+ countries</span>
            </h2>
            <div className="w-24 h-1 bg-brand-teal mx-auto rounded-full mb-8" />
          </div>
          <WorldMap variant="red" hideTitle={true} />
        </div>
      </section>

      {/* Values & Process Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="mb-32">
            <div className="text-center mb-16">
              <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mb-4">{t.about.valuesTag}</p>
              <h2 className="text-4xl font-bold mb-4">{t.about.valuesTitle}</h2>
              <p className="text-white/60">{t.about.valuesSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(t.about.values).map(([key, value]: [string, any], i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card p-8 hover:bg-white/10 transition-all group hover-glow relative"
                  whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px rgba(45,212,191,0.1)" }}
                >
                  <h3 className="text-xl font-bold mb-4 group-hover:text-brand-teal transition-colors relative z-10">{value.title}</h3>
                  <p className="text-white/60 leading-relaxed relative z-10">{value.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-4">{t.about.howItWorksTitle}</h2>
              <p className="text-white/60">{t.about.howItWorksSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="glass-card p-10 hover-glow">
                <h3 className="text-2xl font-bold mb-8 text-brand-teal">{t.about.forEngineers}</h3>
                <div className="space-y-8">
                  {t.about.steps.engineers.map((step: any, i: number) => (
                    <motion.div 
                      key={i} 
                      className="flex gap-6 group p-4 rounded-2xl hover:bg-white/5 transition-all cursor-default"
                      whileHover={{ x: 10 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center flex-shrink-0 font-bold text-brand-teal group-hover:bg-brand-teal group-hover:text-brand-dark transition-all">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 group-hover:text-brand-teal transition-colors">{step.title}</h4>
                        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="glass-card p-10 hover-glow">
                <h3 className="text-2xl font-bold mb-8 text-brand-teal">{t.about.forCompanies}</h3>
                <div className="space-y-8">
                  {t.about.steps.companies.map((step: any, i: number) => (
                    <motion.div 
                      key={i} 
                      className="flex gap-6 group p-4 rounded-2xl hover:bg-white/5 transition-all cursor-default"
                      whileHover={{ x: 10 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-teal/10 border border-brand-teal/20 flex items-center justify-center flex-shrink-0 font-bold text-brand-teal group-hover:bg-brand-teal group-hover:text-brand-dark transition-all">
                        {i + 1}
                      </div>
                      <div>
                        <h4 className="font-bold mb-2 group-hover:text-brand-teal transition-colors">{step.title}</h4>
                        <p className="text-sm text-white/60 group-hover:text-white/80 transition-colors">{step.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-brand-teal/10 rounded-3xl p-12 md:p-20 text-center border border-brand-teal/20">
            <h2 className="text-4xl font-bold mb-6">{t.about.ctaTitle}</h2>
            <p className="text-white/60 mb-10 max-w-2xl mx-auto">{t.about.ctaSubtitle}</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button className="px-10 py-4 bg-brand-teal text-brand-dark font-semibold rounded-xl hover:bg-teal-300 transition-all">
                {t.about.getStarted}
              </button>
              <button className="px-10 py-4 bg-white/5 text-white font-semibold rounded-xl border border-white/10 hover:bg-white/10 transition-all">
                {t.about.learnMore}
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const WhyDesknet = ({ onSignUpClick, onWatchDemoClick }: { onSignUpClick: () => void, onWatchDemoClick: () => void }) => {
  const { t } = useLanguage();
  return (
    <div className="pt-24">
      <section className="py-24 px-6 relative overflow-hidden min-h-[90vh] flex flex-col items-center justify-center">
        {/* Overlay */}
        <div className="absolute inset-0 bg-brand-dark/40 -z-10" />
        
        <div className="max-w-7xl mx-auto relative z-10 w-full">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8 }}
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-teal/5 border border-brand-teal/20 mb-10">
                <Star className="w-3.5 h-3.5 text-brand-teal fill-brand-teal" />
                <span className="text-xs font-medium text-brand-teal tracking-wide">Trusted by leading companies</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[1.1]">
                <TypingAnimation text={t.why.heroTitle} delay={0.3} /> <span className="text-brand-teal"><TypingAnimation text={t.why.heroTitleAccent} delay={1.2} /></span>
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 mb-16 leading-relaxed max-w-2xl mx-auto font-medium">
                {t.why.heroSubtitle}
              </p>

              <div className="grid grid-cols-3 gap-8 mb-20 max-w-3xl mx-auto">
                <div>
                  <div className="text-5xl md:text-6xl font-bold text-brand-teal mb-3 tracking-tighter"><Counter value="3,500+" /></div>
                  <div className="text-sm font-medium text-white/40">{t.why.stats.engineers}</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold text-brand-teal mb-3 tracking-tighter"><Counter value="94+" /></div>
                  <div className="text-sm font-medium text-white/40">{t.why.stats.countries}</div>
                </div>
                <div>
                  <div className="text-5xl md:text-6xl font-bold text-brand-teal mb-3 tracking-tighter"><Counter value="98%" /></div>
                  <div className="text-sm font-medium text-white/40">{t.why.stats.success}</div>
                </div>
              </div>

              <div className="flex justify-center mb-24">
                <PremiumButton 
                  onClick={() => {
                    trackEvent("Engagement", "Watch Demo", "Hero");
                    onWatchDemoClick();
                  }}
                  variant="secondary"
                  className="rounded-full px-8 py-4"
                  icon={<Play className="w-4 h-4 fill-brand-teal text-brand-teal" />}
                >
                  <span className="text-base font-semibold text-white">{t.why.watchDemo}</span>
                </PremiumButton>
              </div>

              {/* Scroll Indicator */}
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-2 opacity-40"
              >
                <div className="w-5 h-8 rounded-full border-2 border-white/30 flex justify-center p-1">
                  <div className="w-1 h-2 bg-brand-teal rounded-full" />
                </div>
              </motion.div>
            </motion.div>
          </div>

          <div className="mt-32 mb-32">
            <div className="text-center mb-20">
              <p className="text-xs font-semibold text-brand-teal uppercase tracking-widest mb-4">{t.why.benefitsTag}</p>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {t.why.benefitsTitle} <span className="text-gradient-teal">{t.why.benefitsTitleAccent}</span>
              </h2>
              <p className="text-white/60 max-w-2xl mx-auto font-medium">{t.why.benefitsSubtitle}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {t.why.benefits.map((benefit: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: i * 0.1, type: "spring", stiffness: 300, damping: 20 }}
                  className="glass-card p-8 hover:border-brand-teal/30 transition-all hover-glow relative"
                  whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px rgba(45,212,191,0.1)" }}
                >
                  <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform relative z-10">
                    <Check className="w-6 h-6 text-brand-teal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 group-hover:text-brand-teal transition-colors relative z-10">{benefit.title}</h3>
                  <p className="text-white/60 leading-relaxed font-normal relative z-10">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center mb-32">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
            >
              <p className="text-xs font-semibold text-brand-teal uppercase tracking-widest mb-4">{t.why.verificationTag}</p>
              <h2 className="text-4xl font-bold mb-8 leading-tight">
                {t.why.verificationTitle} <br />
                <span className="text-brand-teal">{t.why.verificationTitleAccent}</span>
              </h2>
              <p className="text-lg text-white/60 mb-10 leading-relaxed font-medium">
                {t.why.verificationSubtitle}
              </p>
              <div className="space-y-4">
                {t.why.verificationList.map((item: string, i: number) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-6 h-6 rounded-full bg-brand-teal/20 flex items-center justify-center">
                      <Check className="w-3 h-3 text-brand-teal" />
                    </div>
                    <span className="font-medium text-white/80">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: false }}
              className="glass-card p-10 hover-glow"
            >
              <div className="space-y-8">
                <motion.div 
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/10 transition-all cursor-default"
                >
                  <div className="font-semibold">Technical Skills</div>
                  <div className="px-4 py-1 bg-brand-teal/20 text-brand-teal rounded-full text-xs font-semibold">Verified</div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/10 transition-all cursor-default"
                >
                  <div className="font-semibold">Background Check</div>
                  <div className="px-4 py-1 bg-brand-teal/20 text-brand-teal rounded-full text-xs font-semibold">Passed</div>
                </motion.div>
                <motion.div 
                  whileHover={{ x: 10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                  className="flex justify-between items-center p-6 bg-white/5 rounded-2xl border border-white/10 transition-all cursor-default"
                >
                  <div className="font-semibold">Identity Verification</div>
                  <div className="px-4 py-1 bg-brand-teal/20 text-brand-teal rounded-full text-xs font-semibold">Confirmed</div>
                </motion.div>
              </div>
            </motion.div>
          </div>

          <div className="mb-32">
            <div className="text-center mb-16">
              <p className="text-xs font-semibold text-brand-teal uppercase tracking-widest mb-4">{t.why.comparisonTag}</p>
              <h2 className="text-4xl font-bold mb-4">
                {t.why.comparisonTitle} <span className="text-brand-teal">{t.why.comparisonTitleAccent}</span>
              </h2>
              <p className="text-white/60 font-medium">{t.why.comparisonSubtitle}</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/10">
                    {t.why.comparison.header.map((h: string, i: number) => (
                      <th key={i} className={`py-6 px-8 font-bold text-lg ${i === 1 ? 'text-brand-teal' : ''}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {t.why.comparison.rows.map((row: string[], i: number) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-6 px-8 text-white/60 font-medium">{row[0]}</td>
                      <td className="py-6 px-8 font-bold text-brand-teal">
                        {row[1] === 'Check' ? <Check className="w-5 h-5" /> : row[1]}
                      </td>
                      <td className="py-6 px-8 text-white/40">{row[2]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="relative mt-20">
            {/* Decorative background elements */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-brand-teal/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-teal/10 rounded-full blur-[120px] animate-pulse delay-1000" />
            
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
              className="bg-brand-dark/40 backdrop-blur-3xl border border-white/10 rounded-[48px] p-12 md:p-24 text-center relative overflow-hidden group shadow-2xl"
            >
              {/* Mesh background pattern */}
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
              />
              
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(45,212,191,0.15)_0%,transparent_70%)]" />
              
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                >
                  <h2 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter leading-[0.9] text-white">
                    {t.why.ctaTitle.split(' ').map((word: string, i: number) => (
                      <span key={i} className="inline-block mr-4 last:mr-0">
                        {word}
                      </span>
                    ))}
                  </h2>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="text-xl md:text-2xl text-white/60 mb-16 max-w-3xl mx-auto font-medium leading-relaxed"
                >
                  {t.why.ctaSubtitle}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="flex flex-col sm:flex-row justify-center items-center gap-8"
                >
                  <PremiumButton 
                    onClick={() => {
                      trackEvent("Engagement", "CTA Click", "Hiring");
                      onSignUpClick();
                    }}
                    variant="primary"
                    size="lg"
                    glow
                    className="px-12 py-6 text-lg min-w-[240px]"
                    icon={<ArrowRight className="w-6 h-6" />}
                  >
                    {t.why.ctaHiring}
                  </PremiumButton>
                  
                  <PremiumButton 
                    onClick={() => {
                      trackEvent("Engagement", "Watch Demo", "CTA");
                      onWatchDemoClick();
                    }}
                    variant="secondary"
                    size="lg"
                    className="px-12 py-6 text-lg min-w-[240px] hover:bg-white/10"
                  >
                    {t.why.ctaEarning}
                  </PremiumButton>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="mt-20 pt-12 border-t border-white/5 flex flex-wrap justify-center gap-12"
                >
                  {t.why.ctaBadges.map((badge: string, i: number) => (
                    <div key={i} className="flex items-center gap-3 group/badge cursor-default">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center group-hover/badge:bg-brand-teal/20 transition-colors">
                        <ShieldCheck className="w-5 h-5 text-brand-teal" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 group-hover/badge:text-white/80 transition-colors">
                        {badge}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </div>

              {/* Floating decorative shapes */}
              <div className="absolute top-1/4 -left-12 w-24 h-24 border border-brand-teal/20 rounded-full animate-bounce delay-700 opacity-20" />
              <div className="absolute bottom-1/4 -right-12 w-32 h-32 border border-brand-teal/20 rounded-full animate-bounce opacity-20" />
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

const TrustedBy = () => {
  const { t } = useLanguage();

  const brands = [
    { name: 'Amazon', domain: 'amazon.com', icon: FaAmazon },
    { name: 'Meta', domain: 'meta.com', icon: SiMeta },
    { name: 'Apple', domain: 'apple.com', icon: SiApple },
    { name: 'Netflix', domain: 'netflix.com', icon: SiNetflix },
    { name: 'Uber', domain: 'uber.com', icon: SiUber },
    { name: 'Airbnb', domain: 'airbnb.com', icon: SiAirbnb },
    { name: 'Stripe', domain: 'stripe.com', icon: SiStripe },
    { name: 'Shopify', domain: 'shopify.com', icon: SiShopify },
    { name: 'Slack', domain: 'slack.com', icon: SiSlack },
    { name: 'Zoom', domain: 'zoom.us', icon: SiZoom },
    { name: 'Microsoft', domain: 'microsoft.com', icon: FaMicrosoft }
  ];
  
  return (
    <section className="py-20 border-y border-white/5 relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-brand-teal/5 blur-[120px] -z-10" />
      
      <div className="max-w-7xl mx-auto px-6">
        <motion.p 
          whileInView={{ opacity: 1, y: 0 }}
          initial={{ opacity: 0, y: 20 }}
          viewport={{ once: false }}
          className="text-center text-sm font-bold tracking-[0.4em] text-white/40 uppercase mb-12"
        >
          {t.trusted}
        </motion.p>
        
        <div className="relative group">
          {/* Gradient Masks for smooth fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-brand-dark to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-brand-dark to-transparent z-20 pointer-events-none" />
          
          <div className="flex overflow-hidden py-12 -my-12">
            <motion.div 
              animate={{ x: ["0%", "-50%"] }}
              transition={{ 
                duration: 40, 
                repeat: Infinity, 
                ease: "linear" 
              }}
              className="flex items-center gap-20 whitespace-nowrap py-4"
            >
              {[...brands, ...brands].map((brand, idx) => (
                <motion.div 
                  key={`${brand.name}-${idx}`}
                  className="flex items-center gap-4 min-w-[220px] group/brand cursor-pointer relative"
                  whileHover={{ 
                    scale: 1.2, 
                    y: -12,
                    zIndex: 50,
                    transition: { type: "spring", stiffness: 400, damping: 25 }
                  }}
                >
                  <brand.icon className="h-10 w-10 text-white/40 group-hover/brand:text-brand-teal transition-all duration-300 drop-shadow-[0_0_15px_rgba(45,212,191,0.3)]" />
                  <span className="text-white/40 font-bold text-xl uppercase tracking-[0.2em] group-hover/brand:text-white transition-colors duration-300">
                    {brand.name}
                  </span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Counter = ({ value, duration = 2 }: { value: string | number, duration?: number }) => {
  const [count, setCount] = useState(0);
  const nodeRef = useRef(null);
  const isInView = useInView(nodeRef, { once: false, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      const stringValue = String(value);
      const numberMatch = stringValue.match(/[\d.,]+/);
      const number = numberMatch ? parseFloat(numberMatch[0].replace(/,/g, '')) : 0;

      const controls = animate(0, number, {
        duration,
        onUpdate: (latest) => {
          setCount(latest);
        },
        ease: "easeOut"
      });

      return () => controls.stop();
    }
  }, [value, duration, isInView]);

  const formatNumber = (num: number) => {
    const stringValue = String(value);
    const hasComma = stringValue.includes(',');
    const hasDecimal = stringValue.includes('.');
    
    let formatted: string | number = num;
    if (hasDecimal) {
      formatted = num.toFixed(1);
      // Remove trailing .0 if present
      if (formatted.endsWith('.0')) {
        formatted = formatted.slice(0, -2);
      }
    } else {
      formatted = Math.floor(num);
    }

    if (hasComma) {
      return Number(formatted).toLocaleString();
    }
    return formatted;
  };

  const stringValue = String(value);
  const suffix = stringValue.replace(/[\d.,]+/g, '');
  const prefix = stringValue.split(/[\d.,]+/)[0];

  return (
    <span ref={nodeRef}>
      {prefix}{formatNumber(count)}{suffix}
    </span>
  );
};

const Stats = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-teal/10 border border-brand-teal/20 text-brand-teal text-xs font-bold mb-6">
            <TrendingUp className="w-3 h-3" /> {t.stats.tag}
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.stats.title} <span className="text-gradient-teal">{t.stats.titleAccent}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {t.stats.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '3,500+', label: t.stats.verified, sub: t.stats.verifiedSub },
            { icon: Globe, value: '35+', label: t.stats.partners, sub: t.stats.partnersSub },
            { icon: Zap, value: '48 hrs', label: t.stats.matchTime, sub: t.stats.matchTimeSub },
            { icon: Award, value: '98%', label: t.stats.satisfaction, sub: t.stats.satisfactionSub }
          ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.05, boxShadow: "0 20px 40px rgba(45,212,191,0.15)" }}
                className="glass-card p-8 flex flex-col items-start group hover-glow relative"
              >
                <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-brand-teal/20 transition-all relative z-10">
                  <stat.icon className="w-5 h-5 text-brand-teal" />
                </div>
                <div className="text-3xl font-bold text-brand-teal mb-2 group-hover:scale-110 origin-left transition-transform relative z-10"><Counter value={stat.value} /></div>
                <div className="text-lg font-semibold mb-2 group-hover:text-white transition-colors relative z-10">{stat.label}</div>
                <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors relative z-10">{stat.sub}</div>
              </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Metrics = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
        <motion.div 
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
          className="relative"
        >
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-brand-teal/5 blur-[80px] rounded-full" />
          <div className="glass-card p-10 relative overflow-hidden">
            <div className="flex justify-between items-end mb-8">
              <div>
                <p className="text-xs font-bold text-white/40 uppercase mb-2">{t.metrics.matchTime}</p>
                <p className="text-4xl font-bold text-brand-teal"><Counter value="48 hours" /></p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-white/40 uppercase mb-2">{t.metrics.industryAvg}</p>
                <p className="text-4xl font-bold text-emerald-400"><Counter value={t.metrics.faster} /></p>
              </div>
            </div>
            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: '85%' }}
                transition={{ duration: 1, ease: "easeOut" }}
                viewport={{ once: false }}
                className="h-full bg-brand-teal"
              />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: false }}
        >
          <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mb-4">{t.metrics.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-8">
            {t.metrics.title} <span className="text-gradient-teal">{t.metrics.titleAccent}</span>
          </h2>
          <p className="text-white/60 mb-10 text-lg">
            {t.metrics.subtitle}
          </p>

          <div className="space-y-4">
            {[
              { icon: TrendingUp, label: t.metrics.reduction, value: '45%' },
              { icon: Zap, label: t.metrics.productivity, value: '3.2x' },
              { icon: CheckCircle, label: t.metrics.renewal, value: '94%' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 30, x: i % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                viewport={{ once: false }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.02, x: 10, backgroundColor: "rgba(255, 255, 255, 0.08)" }}
                className="glass-card p-6 flex items-center justify-between transition-all cursor-default group hover-glow relative"
              >
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-10 h-10 bg-brand-teal/10 rounded-lg flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors">
                    <item.icon className="w-5 h-5 text-brand-teal" />
                  </div>
                  <span className="font-semibold text-white/80 group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <span className="text-2xl font-bold group-hover:text-brand-teal transition-colors relative z-10"><Counter value={item.value} /></span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const Capabilities = () => {
  const { t } = useLanguage();
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false }}
          className="text-center mb-20"
        >
          <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mb-4">{t.capabilities.tag}</p>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t.capabilities.title} <span className="text-gradient-teal">{t.capabilities.titleAccent}</span>
          </h2>
          <p className="text-white/60 max-w-2xl mx-auto">
            {t.capabilities.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { icon: BarChart3, title: t.capabilities.ai, desc: t.capabilities.aiDesc, stat: '48hr', statLabel: 'avg. match time' },
            { icon: Shield, title: t.capabilities.security, desc: t.capabilities.securityDesc, stat: '100%', statLabel: 'compliance rate' },
            { icon: Globe, title: t.capabilities.network, desc: t.capabilities.networkDesc, stat: '94+', statLabel: 'countries covered' },
            { icon: Layers, title: t.capabilities.modular, desc: t.capabilities.modularDesc, stat: '6x', statLabel: 'faster scaling' }
          ].map((cap, i) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: false }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10, scale: 1.02, boxShadow: "0 20px 40px rgba(45,212,191,0.1)" }}
              className="glass-card p-10 group hover:bg-white/[0.08] transition-all hover-glow"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-brand-teal/20 transition-all">
                  <cap.icon className="w-6 h-6 text-brand-teal" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-brand-teal group-hover:scale-110 origin-right transition-transform"><Counter value={cap.stat} /></div>
                  <div className="text-xs font-bold text-white/40 uppercase">{cap.statLabel}</div>
                </div>
              </div>
              <h3 className="text-xl font-bold mb-4 group-hover:text-brand-teal transition-colors">{cap.title}</h3>
              <p className="text-white/70 leading-relaxed group-hover:text-white transition-colors">{cap.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HomeCTA = ({ onSignUpClick }: { onSignUpClick: () => void }) => {
  const { t } = useLanguage();
  return (
    <section className="py-32 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto bg-brand-card/60 md:backdrop-blur-2xl backdrop-blur-none border border-white/10 p-12 md:p-24 rounded-[2rem] text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-4xl relative z-10">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight tracking-tighter">
            {t.cta.title} <span className="text-brand-teal">{t.cta.titleAccent}</span>
          </h2>
          <p className="text-lg md:text-xl text-white/60 mb-12 max-w-2xl leading-relaxed">
            {t.cta.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <motion.button 
              onClick={onSignUpClick}
              whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(45,212,191,0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 bg-brand-teal text-brand-dark font-bold rounded-2xl hover:bg-teal-300 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(45,212,191,0.2)]"
            >
              {t.cta.primary} <ArrowRight className="w-5 h-5" />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto px-10 py-4 bg-transparent text-white font-bold rounded-2xl border border-white/10 transition-all"
            >
              {t.cta.secondary}
            </motion.button>
          </div>
        </div>
      </div>
    </section>
  );
};


const Footer = ({ setCurrentPage }: { setCurrentPage: (page: string) => void }) => {
  const { t } = useLanguage();
  
  const footerLinks = [
    {
      title: t.footer.product,
      links: [
        { label: t.footer.links.features, page: 'why' },
        { label: t.footer.links.getStarted, page: 'why' },
      ]
    },
    {
      title: t.footer.company,
      links: [
        { label: t.footer.links.aboutUs, page: 'about' },
        { label: t.footer.links.contact, page: 'contact' },
      ]
    },
    {
      title: t.footer.legal,
      links: [
        { label: t.legal.privacy.title, page: 'privacy' },
        { label: t.legal.terms.title, page: 'terms' },
        { label: t.legal.cookies.title, page: 'cookies' },
      ]
    }
  ];

  return (
    <footer className="relative pt-32 pb-16 px-6 overflow-hidden bg-brand-dark">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-brand-teal/50 to-transparent" />
        <motion.div 
          animate={{ 
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-64 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-brand-teal/10 blur-[120px] rounded-full"
        />
        
        {/* Floating Particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 100 }}
            animate={{ 
              opacity: [0, 0.5, 0],
              y: [-20, -120],
              x: Math.sin(i) * 50
            }}
            transition={{ 
              duration: 5 + Math.random() * 5, 
              repeat: Infinity, 
              delay: Math.random() * 5,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-brand-teal rounded-full"
            style={{ 
              left: `${10 + Math.random() * 80}%`,
              bottom: '0'
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-24">
          {/* Brand Section */}
          <div className="lg:col-span-5">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              className="mb-8"
            >
              <Logo />
            </motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ delay: 0.1 }}
              className="text-white/50 text-lg leading-relaxed max-w-md mb-10 font-medium"
            >
              {t.footer.desc}
            </motion.p>

            <div className="flex flex-wrap gap-4">
              {[
                { icon: Whatsapp, href: "#", label: "WhatsApp" },
                { icon: Linkedin, href: "#", label: "LinkedIn" },
                { icon: Facebook, href: "#", label: "Facebook" }
              ].map((social, i) => (
                <motion.a
                  key={i}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-brand-teal hover:border-brand-teal/50 hover:bg-brand-teal/10 transition-all duration-300 group"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5 group-hover:drop-shadow-[0_0_8px_rgba(45,212,191,0.5)]" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Links Sections */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
            {footerLinks.map((section, idx) => (
              <div key={idx}>
                <motion.h4 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: false }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-8 opacity-80"
                >
                  {section.title}
                </motion.h4>
                <ul className="space-y-4">
                  {section.links.map((link, linkIdx) => (
                    <motion.li 
                      key={linkIdx}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: false }}
                      transition={{ delay: 0.3 + idx * 0.1 + linkIdx * 0.05 }}
                    >
                      <button 
                        onClick={() => { 
                          setCurrentPage(link.page); 
                          window.scrollTo({ top: 0, behavior: 'smooth' }); 
                        }}
                        className="text-white/40 hover:text-brand-teal transition-all duration-300 text-sm font-medium flex items-center group"
                      >
                        <span className="w-0 group-hover:w-4 h-px bg-brand-teal mr-0 group-hover:mr-2 transition-all duration-300" />
                        {link.label}
                      </button>
                    </motion.li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: false }}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20"
          >
            © 2026 Desknet. {t.footer.rights}
          </motion.div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false }}
              className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/20"
            >
              {t.footer.tagline}
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: false }}
              className="flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/5 border border-emerald-500/10"
            >
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500/70">
                System Status: Optimal
              </span>
            </motion.div>
          </div>
        </div>
      </div>
    </footer>
  );
};

const LoginModal = ({ 
  isOpen, 
  onClose, 
  onSignUpClick,
  onLoginSuccess
}: { 
  isOpen: boolean; 
  onClose: () => void, 
  onSignUpClick: () => void,
  onLoginSuccess: (role: string, data: any) => void
}) => {
  const { t } = useLanguage();
  const [loginType, setLoginType] = useState<'selection' | 'engineer' | 'client' | 'admin'>('selection');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isOpen) return null;

  const handleBack = () => {
    setLoginType('selection');
    setError('');
    setSuccess('');
    setPassword('');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    if (loginType === 'admin') {
      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
      const masterPassword = import.meta.env.VITE_MASTER_PASSWORD || 'desklink2026';
      
      if (password === masterPassword) {
        try {
          let user;
          
          try {
            const result = await signInWithEmailAndPassword(auth, adminEmail, password);
            user = result.user;
          } catch (signInErr: any) {
            if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
              // If the admin account doesn't exist yet, create it with the master password
              const result = await createUserWithEmailAndPassword(auth, adminEmail, password);
              user = result.user;
              // Create the user profile in Firestore
              await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: adminEmail,
                role: 'admin',
                name: 'Administrator',
                createdAt: serverTimestamp(),
                status: 'Active'
              });
            } else {
              throw signInErr;
            }
          }

          setSuccess('Admin login successful!');
          onClose();
          onLoginSuccess('admin', { uid: user.uid, email: user.email, role: 'admin', name: 'Administrator' });
        } catch (err: any) {
          console.error("Admin login error:", err);
          setError(err.message || "Failed to authenticate admin account");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError('Wrong admin password. Please try again.');
        setIsLoading(false);
      }
      return;
    }

    // For client/engineer, use Email/Password Sign-In
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
    if (email.toLowerCase() === adminEmail.toLowerCase()) {
      setError("Admin access is only permitted via the Admin login portal.");
      setIsLoading(false);
      return;
    }
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        if (userData.role === 'admin') {
          setError("Admin access is only permitted via the Admin login portal.");
          await signOut(auth);
          setIsLoading(false);
          return;
        }

        const effectiveRole = userData.role || loginType;
        
        // Update last login in background
        setDoc(doc(db, "users", user.uid), { lastLogin: serverTimestamp() }, { merge: true }).catch(err => console.error("Background lastLogin update error:", err));
        setSuccess('Login successful! Welcome back.');
        onClose();
        onLoginSuccess(effectiveRole, userData);
      } else {
        // If document doesn't exist, we don't sign out. 
        // The global onAuthStateChanged listener in App.tsx will handle creating the document.
        // We just transition the UI to the expected portal based on loginType.
        const fallbackRole = (loginType as string) === 'admin' ? 'admin' : ((loginType as string) === 'engineer' ? 'engineer' : 'client');
        const fallbackData = { 
          uid: user.uid, 
          email: user.email, 
          role: fallbackRole,
          name: user.displayName || 'User'
        };
        
        setSuccess('Login successful! Creating your profile...');
        onClose();
        onLoginSuccess(fallbackData.role, fallbackData);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found') {
        setError("Account not found. Please sign up first.");
      } else if (err.code === 'auth/wrong-password') {
        setError("Wrong password. Please try again.");
      } else if (err.code === 'auth/invalid-credential') {
        // Modern Firebase often returns this for both user-not-found and wrong-password
        setError("Invalid credentials. Please check your email and password.");
      } else if (err.code === 'auth/too-many-requests') {
        setError("Too many failed attempts. Please try again later.");
      } else {
        setError(err.message || "Failed to sign in");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpClick = () => {
    onClose();
    onSignUpClick();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-md bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl text-slate-900"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {loginType === 'selection' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{t.login.title}</h2>
                <p className="text-slate-500 text-sm">{t.login.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <motion.button 
                    onClick={() => setLoginType('engineer')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors shrink-0">
                      <User className="w-7 h-7 text-brand-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-lg group-hover:text-brand-teal transition-colors text-slate-900">{t.login.engineer}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">{t.login.engineerDesc}</div>
                    </div>
                  </motion.button>

                  <motion.button 
                    onClick={() => setLoginType('client')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors shrink-0">
                      <Briefcase className="w-7 h-7 text-brand-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-lg group-hover:text-brand-teal transition-colors text-slate-900">{t.login.client}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">{t.login.clientDesc}</div>
                    </div>
                  </motion.button>

                  <motion.button 
                    onClick={() => setLoginType('admin')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors shrink-0">
                      <ShieldCheck className="w-7 h-7 text-brand-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-lg group-hover:text-brand-teal transition-colors text-slate-900">{t.login.admin}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">{t.login.adminDesc}</div>
                    </div>
                  </motion.button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-slate-400 font-bold">New to Desknet?</span></div>
                </div>

                <button 
                  onClick={handleSignUpClick}
                  className="w-full py-4 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  {t.login.signUp}
                </button>
              </div>
            </>
          ) : (
            <>
              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-xs font-bold text-brand-teal uppercase tracking-widest mb-6 hover:opacity-80 transition-opacity"
              >
                <ArrowRight className="w-4 h-4 rotate-180" /> {t.login.back}
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  {loginType === 'engineer' && t.login.engineer}
                  {loginType === 'client' && t.login.client}
                  {loginType === 'admin' && t.login.admin} {t.login.signIn}
                </h2>
                <p className="text-slate-500 text-sm">
                  {loginType === 'engineer' && "Access your dashboard and latest news."}
                  {loginType === 'client' && "Manage your team and post new roles."}
                  {loginType === 'admin' && "System-wide administration and monitoring."}
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleLogin}>
                {loginType === 'admin' ? (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Admin Password</label>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.login.email}</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                        <input 
                          type="email" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@company.com"
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.login.password}</label>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                        <input 
                          type={showPassword ? "text" : "password"} 
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}


                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}

                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 text-emerald-600 text-xs"
                  >
                    <CheckCircle className="w-5 h-5 shrink-0" />
                    <span>{success}</span>
                  </motion.div>
                )}

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-4 bg-brand-teal text-white font-bold rounded-xl transition-all shadow-lg shadow-brand-teal/20 active:scale-[0.98] ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-600 hover:shadow-brand-teal/40'}`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>{t.login.signIn}...</span>
                      </div>
                    ) : loginType === 'admin' ? t.login.signInAsAdmin : 
                        loginType === 'engineer' ? t.login.signInAsEngineer :
                        loginType === 'client' ? t.login.signInAsClient :
                        `${t.login.signIn} as ${loginType}`}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const LegalModal = ({ isOpen, onClose, title, content }: { isOpen: boolean; onClose: () => void; title: string; content: string }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/90 md:backdrop-blur-md backdrop-blur-none"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl"
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 transition-colors z-20 bg-slate-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-10 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-slate-900">{title}</h2>
            <div className="w-12 h-1 bg-brand-teal rounded-full" />
          </div>

          <div className="prose max-w-none text-slate-600 leading-relaxed space-y-4">
            {content.split('\n\n').map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const SignUpModal = ({ isOpen, onClose, onLoginClick, onEngineerContinue, onClientContinue, onShowTerms, onShowPrivacy, setIsClientLoggedIn, setCurrentPage }: { 
  isOpen: boolean; 
  onClose: () => void; 
  onLoginClick: () => void; 
  onEngineerContinue: (data: any) => void; 
  onClientContinue: (data: any) => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
  setIsClientLoggedIn: (val: boolean) => void;
  setCurrentPage: (page: string) => void;
}) => {
  const { t } = useLanguage();
  const [signUpType, setSignUpType] = useState<'selection' | 'engineer' | 'client'>('selection');
  const [engineerStep, setEngineerStep] = useState(1);
  const [clientStep, setClientStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    companyName: '',
    firstName: '',
    lastName: '',
    country: null as any,
    companyEmail: '',
    companySize: '',
    dobDay: '',
    dobMonth: '',
    dobYear: '',
    city: '',
    zipCode: '',
    specialization: '',
    experience: '',
    skills: '',
    hourlyRate: '',
    halfDayRate: '',
    fullDayRate: '',
    languages: '',
    contactInfo: '',
    acceptedTerms: false,
  });

  const countryOptions = useMemo(() => 
    Country.getAllCountries().map(c => ({
      value: c.isoCode,
      label: c.name,
      flag: c.flag
    })), []);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleBack = () => {
    if (signUpType === 'engineer' && engineerStep > 1) {
      setEngineerStep(engineerStep - 1);
    } else if (signUpType === 'client' && clientStep > 1) {
      setClientStep(clientStep - 1);
    } else {
      setSignUpType('selection');
      setEngineerStep(1);
      setClientStep(1);
    }
  };

  const handleLoginClick = () => {
    onClose();
    onLoginClick();
  };

  const handleEngineerContinue = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
    if (formData.email.toLowerCase() === adminEmail.toLowerCase()) {
      setError("This email address is reserved for system administration.");
      return;
    }
    if (engineerStep === 1) {
      onEngineerContinue(formData);
      onClose();
    } else if (engineerStep < 5) {
      setEngineerStep(engineerStep + 1);
    } else {
      // Final submission logic
      console.log('Form submitted:', formData);
      onClose();
    }
  };

  const handleClientContinue = () => {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
    if (formData.companyEmail.toLowerCase() === adminEmail.toLowerCase()) {
      setError("This email address is reserved for system administration.");
      return;
    }
    if (clientStep === 1) {
      setClientStep(2);
    } else {
      setIsLoading(true);
      setError('');
      
      // Perform signup and data persistence
      const performSignup = async () => {
        try {
          // Create Firebase Auth user first to get the correct UID
          const authResult = await createUserWithEmailAndPassword(auth, formData.companyEmail, formData.password, 'client', `${formData.firstName} ${formData.lastName}`);
          const uid = authResult.user.uid;

          const userData = {
            uid: uid,
            email: formData.companyEmail,
            companyName: formData.companyName,
            firstName: formData.firstName,
            lastName: formData.lastName,
            name: `${formData.firstName} ${formData.lastName}`,
            country: formData.country?.label || '',
            companySize: formData.companySize,
            role: 'client',
            status: 'Active',
            createdAt: serverTimestamp()
          };

          // Create Firestore document with the Auth UID
          await setDoc(doc(db, "users", uid), userData);

          // Transition UI
          onClientContinue(userData);
          onClose();
        } catch (err: any) {
          console.error("Client signup error:", err);
          let message = err.message || "Failed to create client account";
          try {
            const errInfo = JSON.parse(message);
            message = errInfo.error || message;
          } catch (e) {
            // Not JSON
          }
          
          if (err.code === 'auth/email-already-in-use') {
            setError("This email is already in use. Please sign in instead.");
          } else if (message.includes('Missing or insufficient permissions')) {
            setError("Permission denied. Please try again or contact support.");
          } else {
            setError(message);
          }
          // Rollback state if needed
          setIsClientLoggedIn(false);
          setCurrentPage('landing');
        } finally {
          setIsLoading(false);
        }
      };
      
      performSignup();
    }
  };

  const isStepValid = () => {
    if (signUpType === 'client') {
      if (clientStep === 1) {
        return formData.companyName && formData.firstName && formData.lastName && formData.country && formData.acceptedTerms;
      } else {
        return formData.companyEmail && formData.companySize && formData.password;
      }
    }
    
    switch (engineerStep) {
      case 1: return formData.fullName && formData.email && formData.password && formData.acceptedTerms;
      case 2: return formData.dobDay && formData.dobMonth && formData.dobYear && formData.country && formData.city;
      case 3: return formData.specialization && formData.experience && formData.skills;
      case 4: return formData.hourlyRate && formData.halfDayRate && formData.fullDayRate;
      case 5: return formData.languages && formData.contactInfo;
      default: return true;
    }
  };

  const customSelectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'rgba(0, 0, 0, 0.05)',
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: '0.75rem',
      padding: '0.25rem',
      color: '#0f172a',
      '&:hover': {
        borderColor: 'rgba(45, 212, 191, 0.5)',
      }
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'white',
      border: '1px solid rgba(0, 0, 0, 0.1)',
      borderRadius: '0.75rem',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'rgba(45, 212, 191, 0.1)' : 'transparent',
      color: state.isFocused ? '#0d9488' : '#475569',
      '&:active': {
        backgroundColor: 'rgba(45, 212, 191, 0.2)',
      }
    }),
    singleValue: (base: any) => ({
      ...base,
      color: '#0f172a',
    }),
    input: (base: any) => ({
      ...base,
      color: '#0f172a',
    }),
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 md:backdrop-blur-sm backdrop-blur-none"
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-lg bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xl text-slate-900"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {signUpType === 'selection' ? (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">{t.signup.title}</h2>
                <p className="text-slate-500 text-sm">{t.signup.subtitle}</p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <motion.button 
                    onClick={() => setSignUpType('engineer')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors shrink-0">
                      <User className="w-7 h-7 text-brand-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-lg group-hover:text-brand-teal transition-colors text-slate-900">{t.signup.engineer}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">{t.signup.engineerDesc}</div>
                    </div>
                  </motion.button>

                  <motion.button 
                    onClick={() => setSignUpType('client')}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full p-5 flex items-center gap-5 bg-slate-50 border border-slate-100 rounded-2xl hover:border-brand-teal/50 hover:bg-brand-teal/5 transition-all group text-left relative overflow-hidden"
                  >
                    <div className="w-14 h-14 bg-brand-teal/10 rounded-xl flex items-center justify-center group-hover:bg-brand-teal/20 transition-colors shrink-0">
                      <Briefcase className="w-7 h-7 text-brand-teal" />
                    </div>
                    <div className="relative z-10">
                      <div className="font-bold text-lg group-hover:text-brand-teal transition-colors text-slate-900">{t.signup.client}</div>
                      <div className="text-xs text-slate-400 group-hover:text-slate-600 transition-colors line-clamp-1">{t.signup.clientDesc}</div>
                    </div>
                  </motion.button>
                </div>

                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                  <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-white px-4 text-slate-400 font-bold">Already have an account?</span></div>
                </div>

                <button 
                  onClick={handleLoginClick}
                  className="w-full py-4 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-all"
                >
                  {t.login.signIn}
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <button 
                  onClick={handleBack}
                  className="flex items-center gap-2 text-xs font-semibold text-brand-teal uppercase tracking-widest hover:opacity-80 transition-opacity"
                >
                  <ArrowRight className="w-4 h-4 rotate-180" /> {t.signup.back}
                </button>
                {signUpType === 'engineer' && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {engineerStep}/5</span>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <div 
                          key={s} 
                          className={`w-6 h-1 rounded-full transition-colors ${s <= engineerStep ? 'bg-brand-teal' : 'bg-slate-100'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
                {signUpType === 'client' && (
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Step {clientStep}/2</span>
                    <div className="flex gap-1">
                      {[1, 2].map((s) => (
                        <div 
                          key={s} 
                          className={`w-6 h-1 rounded-full transition-colors ${s <= clientStep ? 'bg-brand-teal' : 'bg-slate-100'}`} 
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2 text-slate-900">
                  {signUpType === 'engineer' ? (
                    <>
                      {engineerStep === 1 && t.signup.steps.account}
                      {engineerStep === 2 && t.signup.steps.personal}
                      {engineerStep === 3 && t.signup.steps.professional}
                      {engineerStep === 4 && t.signup.steps.rates}
                      {engineerStep === 5 && t.signup.steps.assets}
                    </>
                  ) : (
                    t.signup.client
                  )} {t.nav.getStarted}
                </h2>
                <p className="text-slate-500 text-sm">
                  {signUpType === 'engineer' ? (
                    <>
                      {engineerStep === 1 && "Create your account to join the network."}
                      {engineerStep === 2 && "Tell us a bit about yourself."}
                      {engineerStep === 3 && "Showcase your technical expertise."}
                      {engineerStep === 4 && "Set your availability and rates."}
                      {engineerStep === 5 && "Finalize your profile with assets."}
                    </>
                  ) : (
                    "Start hiring verified talent for your projects."
                  )}
                </p>
              </div>

              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                {signUpType === 'engineer' ? (
                  <>
                    {engineerStep === 1 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-5">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fullName}</label>
                          <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                            <input 
                              type="text" 
                              name="fullName"
                              value={formData.fullName}
                              onChange={handleInputChange}
                              placeholder="John Doe" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.email}</label>
                          <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                            <input 
                              type="email" 
                              name="email"
                              value={formData.email}
                              onChange={handleInputChange}
                              placeholder="name@company.com" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.password}</label>
                          <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-brand-teal transition-colors" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="••••••••" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 pt-2">
                          <div className="relative flex items-center h-5">
                            <input
                              id="acceptedTermsEngineer"
                              name="acceptedTerms"
                              type="checkbox"
                              checked={formData.acceptedTerms}
                              onChange={(e) => setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-200 bg-slate-50 text-brand-teal focus:ring-brand-teal focus:ring-offset-white"
                            />
                          </div>
                          <div className="text-xs text-slate-500 leading-tight">
                            {t.legal.agreeText} <button type="button" onClick={onShowTerms} className="text-brand-teal hover:underline font-semibold">{t.legal.terms.title}</button> {t.legal.andText} <button type="button" onClick={onShowPrivacy} className="text-brand-teal hover:underline font-semibold">{t.legal.privacy.title}</button>{t.legal.agreeSuffix}.
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {engineerStep === 2 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.dob}</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <div className="grid grid-cols-3 gap-3 !pl-16">
                              <input 
                                type="text" 
                                name="dobDay"
                                value={formData.dobDay}
                                onChange={handleInputChange}
                                placeholder={t.signup.fields.day} 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all text-sm" 
                              />
                              <input 
                                type="text" 
                                name="dobMonth"
                                value={formData.dobMonth}
                                onChange={handleInputChange}
                                placeholder={t.signup.fields.month} 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all text-sm" 
                              />
                              <input 
                                type="text" 
                                name="dobYear"
                                value={formData.dobYear}
                                onChange={handleInputChange}
                                placeholder={t.signup.fields.year} 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl px-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all text-sm" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.country}</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="USA" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.city}</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                placeholder="New York" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.zipCode}</label>
                            <div className="relative">
                              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleInputChange}
                                placeholder={t.signup.onboarding.placeholders.zipCode} 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {engineerStep === 3 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.specialization}</label>
                          <div className="relative">
                            <Code className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="text" 
                              name="specialization"
                              value={formData.specialization}
                              onChange={handleInputChange}
                              placeholder="Full Stack Developer" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.experience}</label>
                          <div className="relative">
                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="number" 
                              name="experience"
                              value={formData.experience}
                              onChange={handleInputChange}
                              placeholder="5" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.skills}</label>
                          <div className="relative">
                            <Code className="absolute left-4 top-4 w-5 h-5 text-slate-300" />
                            <textarea 
                              name="skills"
                              value={formData.skills}
                              onChange={handleInputChange}
                              placeholder="React, Node.js, TypeScript..." 
                              className="w-full min-h-[100px] bg-slate-50 border border-slate-200 rounded-xl py-3 !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {engineerStep === 4 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.hourlyRate}</label>
                          <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="number" 
                              name="hourlyRate"
                              value={formData.hourlyRate}
                              onChange={handleInputChange}
                              placeholder="50" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.halfDayRate}</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="number" 
                                name="halfDayRate"
                                value={formData.halfDayRate}
                                onChange={handleInputChange}
                                placeholder="180" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.fullDayRate}</label>
                            <div className="relative">
                              <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="number" 
                                name="fullDayRate"
                                value={formData.fullDayRate}
                                onChange={handleInputChange}
                                placeholder="350" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {engineerStep === 5 && (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.languages}</label>
                            <div className="relative">
                              <Languages className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="languages"
                                value={formData.languages}
                                onChange={handleInputChange}
                                placeholder="English, Russian" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.contactInfo}</label>
                            <div className="relative">
                              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="contactInfo"
                                value={formData.contactInfo}
                                onChange={handleInputChange}
                                placeholder="@username" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.cvUpload}</label>
                          <div className="relative group cursor-pointer">
                            <div className="w-full bg-slate-50 border border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center group-hover:border-brand-teal/50 transition-colors">
                              <FileText className="w-8 h-8 text-slate-300 mb-2 group-hover:text-brand-teal transition-colors" />
                              <span className="text-sm text-slate-400 group-hover:text-slate-600 transition-colors">Click or drag to upload CV</span>
                            </div>
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.profilePic}</label>
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-50 border border-slate-200 rounded-full flex items-center justify-center overflow-hidden">
                              <Camera className="w-6 h-6 text-slate-300" />
                            </div>
                            <button className="text-xs font-semibold text-brand-teal uppercase tracking-widest hover:underline">Upload Photo</button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </>
                ) : (
                  <div className="space-y-4">
                    {clientStep === 1 ? (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.companyName}</label>
                          <div className="relative">
                            <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="text" 
                              name="companyName"
                              value={formData.companyName}
                              onChange={handleInputChange}
                              placeholder="Acme Corp" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.firstName}</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.lastName}</label>
                            <div className="relative">
                              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                              <input 
                                type="text" 
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe" 
                                className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                              />
                            </div>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.fields.country}</label>
                          <div className="relative">
                            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 z-10" />
                            <div className="flex-1">
                              <Select
                                options={countryOptions}
                                value={formData.country}
                                onChange={(opt) => setFormData(prev => ({ ...prev, country: opt }))}
                                styles={{
                                  ...customSelectStyles,
                                  control: (base) => ({
                                    ...customSelectStyles.control(base),
                                    paddingLeft: '4rem',
                                    backgroundColor: '#f8fafc',
                                    borderColor: '#e2e8f0'
                                  })
                                }}
                                placeholder="Select Country"
                                isSearchable
                              />
                            </div>
                          </div>
                        </div>

                        <div className="flex items-start gap-3 pt-2">
                          <div className="relative flex items-center h-5">
                            <input
                              id="acceptedTermsClient"
                              name="acceptedTerms"
                              type="checkbox"
                              checked={formData.acceptedTerms}
                              onChange={(e) => setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }))}
                              className="w-4 h-4 rounded border-slate-200 bg-slate-50 text-brand-teal focus:ring-brand-teal focus:ring-offset-white"
                            />
                          </div>
                          <div className="text-xs text-slate-500 leading-tight">
                            {t.legal.agreeText} <button type="button" onClick={onShowTerms} className="text-brand-teal hover:underline font-semibold">{t.legal.terms.title}</button> {t.legal.andText} <button type="button" onClick={onShowPrivacy} className="text-brand-teal hover:underline font-semibold">{t.legal.privacy.title}</button>{t.legal.agreeSuffix}.
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.companyEmail}</label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="email" 
                              name="companyEmail"
                              value={formData.companyEmail}
                              onChange={handleInputChange}
                              placeholder="hr@company.com" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.companySize}</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type="text" 
                              name="companySize"
                              value={formData.companySize}
                              onChange={handleInputChange}
                              placeholder="1-10, 11-50, 50+" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-4 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.signup.password}</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              name="password"
                              value={formData.password}
                              onChange={handleInputChange}
                              placeholder="••••••••" 
                              className="w-full h-14 bg-slate-50 border border-slate-200 rounded-xl !pl-16 pr-12 text-slate-900 placeholder:text-slate-300 focus:outline-none focus:border-brand-teal/50 focus:bg-white transition-all" 
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-brand-teal transition-colors"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <button 
                  onClick={signUpType === 'engineer' ? handleEngineerContinue : handleClientContinue}
                  disabled={!isStepValid() || isLoading}
                  className={`w-full py-4 font-semibold rounded-xl transition-all ${
                    isStepValid() && !isLoading
                      ? 'bg-brand-teal text-white hover:bg-teal-600' 
                      : 'bg-slate-100 text-slate-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    signUpType === 'engineer' ? (
                      engineerStep === 5 ? t.signup.complete : t.signup.continue
                    ) : (
                      clientStep === 2 ? t.signup.createAccount : t.signup.continue
                    )
                  )}
                </button>

                <div className="text-center text-sm text-slate-400 pt-4">
                  {t.signup.hasAccount} <button onClick={handleLoginClick} className="text-brand-teal font-semibold hover:underline">{t.signup.signIn}</button>
                </div>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const LogTicket = () => {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    subject: '',
    description: '',
    urgency: 'Medium',
    impact: 'Individual'
  });

  const steps = [
    { id: 1, label: t.ticket.steps.category, icon: Layers },
    { id: 2, label: t.ticket.steps.details, icon: FileText },
    { id: 3, label: t.ticket.steps.priority, icon: AlertCircle },
    { id: 4, label: t.ticket.steps.review, icon: CheckCircle },
  ];

  const handleNext = () => setStep(prev => Math.min(prev + 1, 4));
  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "tickets"), {
        ...formData,
        status: 'Pending',
        authorUid: auth.currentUser?.uid || 'guest',
        clientEmail: auth.currentUser?.email || 'guest@example.com',
        clientName: auth.currentUser?.displayName || 'Guest User',
        createdAt: serverTimestamp(),
      });
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting ticket from website:", error);
      window.dispatchEvent(new CustomEvent('desklink-notify', { 
        detail: {
          type: 'error',
          title: 'Submission Failed',
          message: 'Failed to submit ticket. Please try again.'
        }
      }));
    }
  };

  if (isSubmitted) {
    return (
      <section className="pt-48 pb-32 px-6 min-h-screen flex items-center justify-center bg-[#0A1120]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card p-12 text-center"
        >
          <div className="w-20 h-20 bg-brand-teal/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <CheckCircle className="w-10 h-10 text-brand-teal" />
          </div>
          <h2 className="text-3xl font-bold mb-4 text-white">{t.ticket.success}</h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            {t.ticket.successDesc}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-brand-teal text-brand-dark font-semibold rounded-xl hover:bg-teal-300 transition-all"
          >
            {t.nav.home}
          </button>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="pt-48 pb-32 px-6 min-h-screen bg-[#0A1120]">
      <div className="max-w-4xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <p className="text-xs font-bold text-brand-teal uppercase tracking-widest mb-4">/ {t.ticket.tag}</p>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-6 text-white">
            {t.ticket.title} <span className="text-brand-teal">{t.ticket.titleAccent}</span>
          </h1>
          <p className="text-white/50 text-xl max-w-2xl mx-auto font-medium">
            {t.ticket.subtitle}
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-px bg-white/10 -translate-y-1/2" />
          <div className="relative flex justify-between">
            {steps.map((s) => (
              <div key={s.id} className="flex flex-col items-center gap-3 relative z-10">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 border-2 ${
                  step >= s.id ? 'bg-brand-teal border-brand-teal text-brand-dark shadow-[0_0_20px_rgba(45,212,191,0.3)]' : 'bg-brand-dark border-white/10 text-white/40'
                }`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${step >= s.id ? 'text-brand-teal' : 'text-white/20'}`}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-8 md:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h3 className="text-xl font-bold mb-8 text-white">{t.ticket.fields.type}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {['Technical Issue', 'Billing & Payments', 'Account Access', 'Feature Request', 'Other'].map((type) => (
                    <button
                      key={type}
                      onClick={() => {
                        setFormData({ ...formData, type });
                        handleNext();
                      }}
                      className={`p-6 text-left rounded-2xl border-2 transition-all group ${
                        formData.type === type 
                          ? 'bg-brand-teal/5 border-brand-teal text-brand-teal' 
                          : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-semibold mb-1">{type}</div>
                      <div className="text-xs opacity-60">Select this for {type.toLowerCase()} related queries.</div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{t.ticket.fields.subject}</label>
                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                    <input 
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder={t.ticket.placeholders.subject}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 !pl-16 text-white focus:border-brand-teal/50 transition-all outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-white/40 uppercase tracking-widest mb-4">{t.ticket.fields.description}</label>
                  <div className="relative">
                    <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-white/20" />
                    <textarea 
                      rows={6}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder={t.ticket.placeholders.description}
                      className="w-full bg-white/5 border border-white/10 rounded-xl p-4 !pl-16 text-white focus:border-brand-teal/50 transition-all outline-none resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button onClick={handleBack} className="px-8 py-3 text-white/60 font-semibold hover:text-white transition-all">Back</button>
                  <button 
                    onClick={handleNext}
                    disabled={!formData.subject || !formData.description}
                    className={`px-10 py-3 bg-brand-teal text-brand-dark font-semibold rounded-xl transition-all ${!formData.subject || !formData.description ? 'opacity-50 cursor-not-allowed' : 'hover:bg-teal-300'}`}
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-10"
              >
                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">{t.ticket.fields.urgency}</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['Low', 'Medium', 'High', 'Urgent'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setFormData({ ...formData, urgency: u })}
                        className={`py-4 rounded-xl border-2 font-semibold transition-all ${
                          formData.urgency === u 
                            ? 'bg-brand-teal border-brand-teal text-brand-dark' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-6">{t.ticket.fields.impact}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {['Individual', 'Team', 'Organization'].map((i) => (
                      <button
                        key={i}
                        onClick={() => setFormData({ ...formData, impact: i })}
                        className={`py-4 rounded-xl border-2 font-semibold transition-all ${
                          formData.impact === i 
                            ? 'bg-brand-teal border-brand-teal text-brand-dark' 
                            : 'bg-white/5 border-white/10 text-white/40 hover:border-white/20'
                        }`}
                      >
                        {i}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={handleBack} className="px-8 py-3 text-white/60 font-semibold hover:text-white transition-all">Back</button>
                  <button onClick={handleNext} className="px-10 py-3 bg-brand-teal text-brand-dark font-semibold rounded-xl hover:bg-teal-300 transition-all">Review Ticket</button>
                </div>
              </motion.div>
            )}

            {step >= 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t.ticket.fields.type}</div>
                      <div className="text-brand-teal font-bold">{formData.type}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t.ticket.fields.urgency}</div>
                      <div className="text-white font-bold">{formData.urgency}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t.ticket.fields.impact}</div>
                      <div className="text-white font-bold">{formData.impact}</div>
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t.ticket.fields.subject}</div>
                      <div className="text-white font-bold">{formData.subject}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">{t.ticket.fields.description}</div>
                      <div className="text-white/70 text-sm leading-relaxed line-clamp-4">{formData.description}</div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-brand-teal/5 border border-brand-teal/20 rounded-2xl flex items-start gap-4">
                  <AlertCircle className="w-5 h-5 text-brand-teal shrink-0 mt-0.5" />
                  <p className="text-xs text-brand-teal/80 leading-relaxed">
                    By submitting this ticket, you agree that our support team may contact you via your registered email address. We aim to respond to all tickets within 24 hours.
                  </p>
                </div>

                <div className="flex justify-between pt-4">
                  <button onClick={handleBack} className="px-8 py-3 text-white/60 font-semibold hover:text-white transition-all">Back</button>
                  <button 
                    onClick={handleSubmit}
                    className="px-12 py-4 bg-brand-teal text-brand-dark font-semibold rounded-xl hover:bg-teal-300 transition-all shadow-lg shadow-brand-teal/20 flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {t.ticket.submit}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

const AppContent = () => {
  // Socket initialization for real-time updates
  useEffect(() => {
    const socket = io();
    
    socket.on('connect', () => {
      console.log('Socket connected');
    });

    socket.on('data:changed', (collection: string) => {
      console.log(`Data changed in ${collection}`);
      // Dispatch custom event for localDb to pick up
      window.dispatchEvent(new CustomEvent('db-changed', { detail: collection }));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const { t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(() => localStorage.getItem('desklink_currentPage') || 'home');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isEngineerOnboardingOpen, setIsEngineerOnboardingOpen] = useState(false);
  const [onboardingData, setOnboardingData] = useState<any>(null);
  const [isEngineerLoggedIn, setIsEngineerLoggedIn] = useState(false);
  const [engineerData, setEngineerData] = useState<any>(null);
  const [isClientLoggedIn, setIsClientLoggedIn] = useState(false);
  const [clientData, setClientData] = useState<any>(null);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => localStorage.getItem('desklink_isAdminLoggedIn') === 'true');
  const [adminData, setAdminData] = useState<any>(() => {
    const saved = localStorage.getItem('desklink_adminData');
    return saved ? JSON.parse(saved) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    localStorage.setItem('desklink_currentPage', currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('desklink_isAdminLoggedIn', isAdminLoggedIn.toString());
    if (adminData) {
      localStorage.setItem('desklink_adminData', JSON.stringify(adminData));
    } else {
      localStorage.removeItem('desklink_adminData');
    }
  }, [isAdminLoggedIn, adminData]);

  useEffect(() => {
    trackPageView(currentPage);
    
    // Check database health
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('Database Health:', data);
      })
      .catch(err => {
        console.error('Failed to check database health:', err);
      });
  }, [currentPage]);

  // Add reactive listener for user data
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        
        // Initial fetch to handle role and login success
        try {
          const userDoc = await getDoc(userRef);
          let userData = userDoc.exists() ? userDoc.data() : null;
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
          const masterAdminEmail = 'abdullohabduhakimov009@gmail.com';
          const secondaryAdminEmail = 'abdullohabdu123hakimov009@gmail.com';
          let role = userData?.role || (user.email === adminEmail || user.email === masterAdminEmail || user.email === secondaryAdminEmail ? 'admin' : 'client');
          
          if (!userDoc.exists()) {
            console.log("[Auth] User document not found, creating initial profile for role:", role);
            const newUserData = {
              uid: user.uid,
              email: user.email,
              role: role,
              name: user.displayName || 'User',
              createdAt: serverTimestamp()
            };
            try {
              await setDoc(userRef, newUserData);
              userData = newUserData;
            } catch (setErr) {
              console.error("[Auth] Error creating initial user document:", setErr);
              // Continue anyway, we have the user object
            }
          }
          
          console.log("[Auth] Login success for role:", role);
          handleLoginSuccess(role, userData || { uid: user.uid, email: user.email, role: role, name: user.displayName || 'User' });
        } catch (error) {
          console.error("[Auth] Error fetching initial user data:", error);
          // Fallback: try to determine role from email and proceed
          const adminEmail = import.meta.env.VITE_ADMIN_EMAIL || 'logistmate@gmail.com';
          const role = user.email === adminEmail ? 'admin' : 'client';
          console.log("[Auth] Falling back to email-based role:", role);
          handleLoginSuccess(role, { uid: user.uid, email: user.email, role: role, name: user.displayName || 'User' });
        }

        // Setup real-time listener
        unsubscribe = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = { id: docSnap.id, ...docSnap.data() };
            if (data.role === 'admin') setAdminData(data);
            else if (data.role === 'engineer') {
              // Data Recovery Logic: If this is a basic profile from signUp, try to find the full profile
              if (!data.hourlyRate || data.hourlyRate === '0') {
                const recoverData = async () => {
                  try {
                    const q = query(collection(db, "users"), where("email", "==", data.email), where("role", "==", "engineer"));
                    const querySnapshot = await getDocs(q);
                    let fullProfile: any = null;
                    
                    querySnapshot.docs.forEach((doc: any) => {
                      const docData = doc.data();
                      if (doc.id !== user.uid && (docData.hourlyRate && docData.hourlyRate !== '0')) {
                        fullProfile = docData;
                      }
                    });

                    if (fullProfile) {
                      console.log("Recovering lost engineer profile data...");
                      const { uid, ...rest } = fullProfile;
                      await updateDoc(userRef, { ...rest, recoveredFrom: uid });
                    }
                  } catch (err) {
                    console.error("Error recovering profile data:", err);
                  }
                };
                recoverData();
              }
              setEngineerData(data);
            }
            else if (data.role === 'client') setClientData(data);
          }
        }, (error) => {
          console.error("Error listening to user data:", error);
        });
      } else {
        setIsEngineerLoggedIn(false);
        setIsClientLoggedIn(false);
        if (localStorage.getItem('desklink_isAdminLoggedIn') !== 'true') {
          setIsAdminLoggedIn(false);
        }
        setAdminData(null);
        setEngineerData(null);
        setClientData(null);
      }
      setIsLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const notify = (detail: { type: 'success' | 'error' | 'info' | 'warning', title: string, message: string }) => {
    window.dispatchEvent(new CustomEvent('desklink-notify', { detail }));
  };

  const handleEngineerOnboarding = (data: any) => {
    setOnboardingData(data);
    setIsEngineerOnboardingOpen(true);
  };

  const handleEngineerComplete = async (data: any) => {
    try {
      // Create Firebase Auth user first to get the correct UID
      const authResult = await createUserWithEmailAndPassword(auth, data.email, data.password, 'engineer', data.fullName);
      const uid = authResult.user.uid;
      const userData = {
        uid: uid,
      email: data.email,
      name: data.fullName,
      fullName: data.fullName,
      displayName: data.fullName,
      role: 'engineer',
      status: 'Active',
      specialization: data.specializations?.[0]?.label || data.specializations?.[0] || data.specialization || '',
      specializations: data.specializations || [],
      experience: data.experience || '',
      engineerLevel: data.engineerLevel || 'L1',
      country: data.country || '',
      city: data.city || '',
      zipCode: data.zipCode || '',
      dobDay: data.dobDay || null,
      dobMonth: data.dobMonth || null,
      dobYear: data.dobYear || null,
      currency: data.currency || 'USD',
      hourlyRate: data.hourlyRate || '0',
      halfDayRate: data.halfDayRate || '0',
      fullDayRate: data.fullDayRate || '0',
      skills: data.skills || [],
      languages: data.languages || [],
      phoneNumber: data.phoneNumber || '',
      phoneCountryCode: data.phoneCountryCode || '',
      whatsappNumber: data.whatsappNumber || '',
      whatsappCountryCode: data.whatsappCountryCode || '',
      profilePic: data.profilePic || null,
      cvFile: data.cvFile || null,
      idFile: data.idFile || null,
      createdAt: serverTimestamp(),
      lastLogin: serverTimestamp()
    };

      // Create Firestore document with the Auth UID
      await setDoc(doc(db, "users", uid), userData);
      
      trackEvent("User", "Engineer Signup", uid);
      notify({
        type: 'success',
        title: 'Registration Complete',
        message: 'Welcome to Desknet! Your engineer profile has been created.'
      });

      // Transition UI after successful signup
      setEngineerData(userData);
      setIsEngineerLoggedIn(true);
      setIsEngineerOnboardingOpen(false);
      setCurrentPage('engineer-portal');
    } catch (error: any) {
      console.error("Engineer signup error:", error);
      let message = error instanceof Error ? error.message : 'Failed to complete engineer registration.';
      try {
        const errInfo = JSON.parse(message);
        message = errInfo.error || message;
      } catch (e) {
        // Not JSON
      }
      
      notify({
        type: 'error',
        title: 'Registration Failed',
        message: message
      });
      throw error;
    }
  };

  const handleClientComplete = (data: any) => {
    setClientData(data);
    setIsClientLoggedIn(true);
    setCurrentPage('client-portal');
    setIsSignUpOpen(false);
    trackEvent("User", "Client Signup", data.email);
    notify({
      type: 'success',
      title: 'Account Created',
      message: 'Welcome to Desknet! Your client account is ready.'
    });
  };

  const handleLoginSuccess = (role: string, data: any) => {
    trackEvent("User", "Login", role);
    if (role === 'admin') {
      setAdminData(data);
      setIsAdminLoggedIn(true);
      setCurrentPage('admin-portal');
    } else if (role === 'engineer') {
      setEngineerData(data);
      setIsEngineerLoggedIn(true);
      setCurrentPage('engineer-portal');
    } else if (role === 'client') {
      setClientData(data);
      setIsClientLoggedIn(true);
      setCurrentPage('client-portal');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      trackEvent("User", "Logout");
      setIsAdminLoggedIn(false);
      setIsEngineerLoggedIn(false);
      setIsClientLoggedIn(false);
      setAdminData(null);
      setEngineerData(null);
      setClientData(null);
      setCurrentPage('home');
      localStorage.removeItem('desklink_isAdminLoggedIn');
      localStorage.removeItem('desklink_adminData');
      localStorage.removeItem('desklink_currentPage');
      localStorage.removeItem('desklink_admin_activeTab');
      localStorage.removeItem('desklink_engineer_activeTab');
      localStorage.removeItem('desklink_client_activeTab');
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getCurrentUser = () => {
    if (isAdminLoggedIn) return adminData;
    if (isEngineerLoggedIn) return engineerData;
    if (isClientLoggedIn) return clientData;
    return null;
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <>
            <HomeHero 
              onSignUpClick={() => setIsSignUpOpen(true)} 
              onWatchDemoClick={() => setIsDemoOpen(true)}
              onAIAssistantClick={() => setIsAIAssistantOpen(true)}
            />
            <TrustedBy />
            <Stats />
            <Metrics />
            <Capabilities />
            <HomeCTA onSignUpClick={() => setIsSignUpOpen(true)} />
          </>
        );
      case 'about':
        return <AboutUs />;
      case 'why':
        return <WhyDesknet onSignUpClick={() => setIsSignUpOpen(true)} onWatchDemoClick={() => setIsDemoOpen(true)} />;
      case 'contact':
        return <ContactPage />;
      default:
        return (
          <HomeHero 
            onSignUpClick={() => setIsSignUpOpen(true)} 
            onWatchDemoClick={() => setIsDemoOpen(true)}
            onAIAssistantClick={() => setIsAIAssistantOpen(true)}
          />
        );
    }
  };

  const renderMainContent = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen bg-brand-dark flex items-center justify-center">
          <Loader2 className="w-12 h-12 text-brand-teal animate-spin" />
        </div>
      );
    }

    if (isAdminLoggedIn) {
      return (
        <NotificationProvider currentUser={adminData}>
          <AdminPortal user={adminData} onLogout={handleLogout} />
        </NotificationProvider>
      );
    }

    if (isEngineerLoggedIn) {
      return (
        <NotificationProvider currentUser={engineerData}>
          <EngineerPortal user={engineerData} onLogout={handleLogout} />
        </NotificationProvider>
      );
    }

    if (isClientLoggedIn) {
      return (
        <NotificationProvider currentUser={clientData}>
          <ClientPortal user={clientData} onLogout={handleLogout} />
        </NotificationProvider>
      );
    }

    return (
      <NotificationProvider currentUser={getCurrentUser()}>
        <div className="min-h-screen relative">
          <NetworkAnimation />
          <Navbar 
            onLoginClick={() => setIsLoginOpen(true)}
            onSignUpClick={() => setIsSignUpOpen(true)}
            onAIAssistantClick={() => setIsAIAssistantOpen(true)}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
          <VideoDemoModal 
            isOpen={isDemoOpen}
            onClose={() => setIsDemoOpen(false)}
          />
          <LoginModal 
            isOpen={isLoginOpen} 
            onClose={() => setIsLoginOpen(false)} 
            onSignUpClick={() => setIsSignUpOpen(true)}
            onLoginSuccess={handleLoginSuccess}
          />
          <SignUpModal 
            isOpen={isSignUpOpen} 
            onClose={() => setIsSignUpOpen(false)} 
            onLoginClick={() => setIsLoginOpen(true)}
            onEngineerContinue={handleEngineerOnboarding}
            onClientContinue={handleClientComplete}
            onShowTerms={() => setIsTermsOpen(true)}
            onShowPrivacy={() => setIsPrivacyOpen(true)}
            setIsClientLoggedIn={setIsClientLoggedIn}
            setCurrentPage={setCurrentPage}
          />
          <LegalModal 
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
            title={t.legal.terms.title}
            content={t.legal.terms.content}
          />
          <LegalModal 
            isOpen={isPrivacyOpen}
            onClose={() => setIsPrivacyOpen(false)}
            title={t.legal.privacy.title}
            content={t.legal.privacy.content}
          />
          <EngineerSignUpFlow 
            isOpen={isEngineerOnboardingOpen}
            onClose={() => setIsEngineerOnboardingOpen(false)}
            onComplete={handleEngineerComplete}
            initialData={onboardingData}
            initialStep={1}
          />
          <main>
            {renderPage()}
          </main>
          <Footer setCurrentPage={setCurrentPage} />
        </div>
      </NotificationProvider>
    );
  };

  const isInPortal = isAdminLoggedIn || isEngineerLoggedIn || isClientLoggedIn;

  return (
    <>
      {renderMainContent()}
      
      {!isInPortal && (
        <>
          <GeminiAssistant isOpen={isAIAssistantOpen} onClose={() => setIsAIAssistantOpen(false)} />
          
          {/* Floating AI Assistant Button */}
          <motion.div 
            className="fixed bottom-8 right-8 z-[100]"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <div className="relative group">
              {/* Pulse Effect */}
              <motion.div
                className="absolute inset-0 bg-brand-teal/40 rounded-full blur-xl -z-10"
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              
              <AILogo 
                size={64} 
                onClick={() => setIsAIAssistantOpen(true)} 
                className="shadow-[0_0_30px_rgba(45,212,191,0.4)] border-2 border-brand-teal/30"
              />
              
              {/* Tooltip/Label */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-white text-xs font-bold whitespace-nowrap pointer-events-none shadow-2xl"
              >
                Chat with Gemini AI
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-slate-900 border-r border-t border-white/10 rotate-45" />
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

