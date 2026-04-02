import React, { useState, memo, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import { Country } from 'country-state-city';
import { HiMapPin, HiMagnifyingGlass, HiCheckCircle, HiXCircle } from "react-icons/hi2";
import countries from 'i18n-iso-countries';
import enCountries from 'i18n-iso-countries/langs/en.json';

countries.registerLocale(enCountries);

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

// A representative list of countries we serve (ISO codes and Names for better matching)
const highlightedCountries = [
  "CAN", "GBR", "DEU", "FRA", "ESP", "ITA", "NLD", "BEL", "CHE", 
  "AUT", "NOR", "DNK", "FIN", "POL", "CZE", "AUS", "NZL", "JPN", "SGP", 
  "IND", "ARE", "SAU", "MEX", "BRA", "ARG", "CHL", "ZAF", "NGA", "EGY", 
  "PAK", "BGD", "MYS", "THA", "PHL", "VNM", "IDN", "KOR", "HKG", "TWN", 
  "CHN", "MNG", "TUR", "GRC", "PRT", "IRL", "ROU", "BGR", "EST", "HRV", "SVN", 
  "HUN", "SVK", "LTU", "LVA", "ISL", "BLR", "KAZ", "UZB", "TKM", 
  "GEO", "ARM", "AZE", "JOR", "MAR", "TUN", "DZA", "ETH", "QAT", "KWT", 
  "OMN", "YEM", "LBN", "PER", "ECU", "VEN", "CRI", "PAN", "DOM", "GTM", 
  "HND", "COL", "NPL", "MDV", "LKA", "AGO", "MOZ", "TZA", "UGA", "GHA", 
  "SEN", "LUX", "IRN", "IRQ", "BTN", "SRB", "CZE", "SWE", "BIH",
  // Full names for better matching with topojson
  "Canada", "United Kingdom", "Germany", "France", "Spain", "Italy", "Netherlands", "Belgium", "Switzerland", "Austria", "Norway", "Denmark", "Finland", "Poland", "Czech Republic", "Czechia", "Australia", "New Zealand", "Japan", "Singapore", "India", "United Arab Emirates", "Saudi Arabia", "Mexico", "Brazil", "Argentina", "Chile", "South Africa", "Nigeria", "Egypt", "Pakistan", "Bangladesh", "Malaysia", "Thailand", "Philippines", "Vietnam", "Indonesia", "South Korea", "Dem. Rep. Korea", "Korea", "Hong Kong", "Taiwan", "China", "Mongolia", "Turkey", "Greece", "Portugal", "Ireland", "Romania", "Bulgaria", "Estonia", "Croatia", "Slovenia", "Hungary", "Slovakia", "Lithuania", "Latvia", "Iceland", "Belarus", "Kazakhstan", "Uzbekistan", "Turkmenistan", "Georgia", "Armenia", "Azerbaijan", "Jordan", "Morocco", "Tunisia", "Algeria", "ETH", "Qatar", "Kuwait", "Oman", "Yemen", "Lebanon", "Peru", "Ecuador", "Venezuela", "Costa Rica", "Panama", "Dominican Republic", "Guatemala", "Honduras", "Colombia", "Nepal", "Maldives", "Sri Lanka", "Angola", "Mozambique", "Tanzania", "Uganda", "Ghana", "Senegal", "Luxembourg", "Iran", "Iraq", "Bhutan", "Serbia", "Sweden", "Bosnia and Herzegovina"
];

const WorldMap = memo(({ variant = "default", hideTitle = false }: { variant?: "default" | "red", hideTitle?: boolean }) => {
  const [tooltip, setTooltip] = useState<{ name: string; flag: string | React.ReactNode } | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{ name: string; isCovered: boolean; flag: string; iso3: string | null } | null>(null);
  const [highlightedFromSearch, setHighlightedFromSearch] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Fetch geo data manually for better control and reliability
    fetch(geoUrl)
      .then(res => res.json())
      .then(data => {
        setGeoData(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to load map data:", err);
        setIsLoading(false);
      });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.length < 2) {
      setSearchResult(null);
      return;
    }

    const allCountries = Country.getAllCountries();
    const found = allCountries.find(c => 
      c.name.toLowerCase().includes(query.toLowerCase()) || 
      c.isoCode.toLowerCase() === query.toLowerCase()
    );

    if (found) {
      const iso3 = countries.alpha2ToAlpha3(found.isoCode);
      const isCovered = highlightedCountries.includes(iso3 || "") || 
                        highlightedCountries.includes(found.name) || 
                        highlightedCountries.includes(found.isoCode);
      
      setSearchResult({
        name: found.name,
        isCovered: !!isCovered,
        flag: found.flag,
        iso3: iso3 || found.isoCode
      });
    } else {
      setSearchResult(null);
    }
  };

  const selectCountry = (iso3: string | null, name: string) => {
    if (!iso3 && !name) return;
    
    const target = iso3 || name;
    setHighlightedFromSearch(target);
    setSearchQuery("");
    setSearchResult(null);

    setTimeout(() => {
      setHighlightedFromSearch(null);
    }, 5000);
  };

  const colors = {
    highlight: "#ef4444", // Red for all highlighted countries
    searchHighlight: "#facc15", // Yellow for search selection
    base: "#ffffff",
    bg: variant === "red" ? "#000000" : "transparent",
    stroke: "#0A1120",
    text: "#ffffff"
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={(e) => {
        if (!isMobile && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          setMousePos({ 
            x: e.clientX - rect.left, 
            y: e.clientY - rect.top 
          });
        }
      }}
      className={`w-full rounded-3xl border border-white/5 p-4 relative group min-h-[400px] flex flex-col ${variant === 'red' ? 'bg-black' : 'bg-brand-dark/20'}`}
    >
      {!hideTitle && (
        <div className="absolute top-6 left-6 z-10">
          <h3 className="text-xl font-bold text-white mb-1">Global Presence</h3>
          <p className="text-xs font-bold uppercase tracking-widest text-red-500">94+ Countries Served</p>
        </div>
      )}

      {/* Search Bar */}
      <div className="absolute top-6 right-6 z-20 w-full max-w-[280px]">
        <div className="relative group/search">
          <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within/search:text-red-500 transition-colors" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search country coverage..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500/50 transition-all backdrop-blur-md"
          />
          
          <AnimatePresence>
            {searchResult && searchQuery.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                onClick={() => selectCountry(searchResult.iso3, searchResult.name)}
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl p-4 shadow-2xl border border-slate-200 z-50 cursor-pointer hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{searchResult.flag}</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900">{searchResult.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${searchResult.isCovered ? 'text-emerald-500' : 'text-slate-400'}`}>
                        {searchResult.isCovered ? 'Active Coverage' : 'Expansion Pending'}
                      </span>
                    </div>
                  </div>
                  {searchResult.isCovered ? (
                    <HiCheckCircle className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <HiXCircle className="w-6 h-6 text-slate-300" />
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="w-full aspect-[2/1] min-h-[400px] md:min-h-[600px] overflow-hidden rounded-2xl flex items-center justify-center">
        {isLoading ? (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-teal/20 border-t-brand-teal rounded-full animate-spin" />
            <p className="text-white/40 text-sm font-bold">Loading Global Network...</p>
          </div>
        ) : geoData ? (
          <ComposableMap
            projectionConfig={{
              rotate: [-10, 0, 0],
              scale: isMobile ? 140 : 160
            }}
          >
            <Sphere stroke="#ffffff10" strokeWidth={0.5} id="sphere" fill="transparent" />
            <Geographies geography={geoData}>
              {({ geographies }) =>
                geographies
                  .filter(geo => geo.properties.iso_a3 !== "ISR" && geo.properties.name !== "Israel")
                  .map((geo) => {
                  const iso3 = geo.properties.iso_a3 || geo.id;
                  const name = geo.properties.name;
                  const isHighlighted = highlightedCountries.includes(iso3) || highlightedCountries.includes(name);
                  const isSearchHighlighted = highlightedFromSearch === iso3 || highlightedFromSearch === name;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onMouseEnter={() => {
                        if (!isMobile) {
                          const iso2 = countries.alpha3ToAlpha2(geo.properties.iso_a3 || geo.id);
                          const countryData = iso2 ? Country.getCountryByCode(iso2) : null;
                          setTooltip({
                            name: geo.properties.name || geo.id || "Unknown Country",
                            flag: countryData?.flag || <HiMapPin className="w-5 h-5 text-red-500" />
                          });
                        }
                      }}
                      onMouseLeave={() => {
                        if (!isMobile) {
                          setTooltip(null);
                        }
                      }}
                      style={{
                        default: {
                          fill: isSearchHighlighted ? colors.searchHighlight : (isHighlighted ? colors.highlight : colors.base),
                          outline: "none",
                          stroke: colors.stroke,
                          strokeWidth: 0.5,
                          transition: isMobile ? "none" : "all 250ms"
                        },
                        hover: {
                          fill: isSearchHighlighted ? colors.searchHighlight : "#3b82f6",
                          outline: "none",
                          stroke: colors.stroke,
                          strokeWidth: 0.5,
                          cursor: "pointer"
                        },
                        pressed: {
                          fill: isSearchHighlighted ? colors.searchHighlight : "#2563eb",
                          outline: "none"
                        }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
        ) : (
          <div className="text-center p-8">
            <p className="text-white/40 font-bold">Unable to load map data. Please check your connection.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              left: mousePos.x + 15,
              top: mousePos.y + 15
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.5 }}
            className="absolute pointer-events-none z-[100] flex items-center gap-3 px-4 py-2 rounded-xl font-bold text-sm shadow-2xl border border-slate-200 bg-white text-slate-900 whitespace-nowrap"
          >
            <span className="flex items-center justify-center">
              {typeof tooltip.flag === 'string' ? (
                <span className="text-lg leading-none">{tooltip.flag}</span>
              ) : (
                tooltip.flag
              )}
            </span>
            {tooltip.name}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-6 left-6 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-600 shadow-lg shadow-red-600/50" />
          <span className="text-[10px] text-white/60 font-medium">Active Coverage</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white shadow-sm" />
          <span className="text-[10px] text-white/60 font-medium">Expansion Pending</span>
        </div>
      </div>
    </div>
  );
});

export default WorldMap;
