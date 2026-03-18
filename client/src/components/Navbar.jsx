import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ChevronDown, Globe, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [leadersOpen, setLeadersOpen] = useState(false);
  const [raphaelOpen, setRaphaelOpen] = useState(false);
  const [michaelOpen, setMichaelOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: 10, 
      scale: 0.95,
      transition: { duration: 0.2, ease: "easeOut" }
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.3, 
        ease: "backOut",
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const navLinks = [
    { to: "/", label: t("Home", "முகப்பு") },
    { 
      type: 'dropdown',
      label: t("Saint Michael", "புனித மிக்கேல்"),
      isOpen: michaelOpen,
      setOpen: setMichaelOpen,
      items: [
        { to: "/history", label: t("History", "வரலாறு") },
        { to: "/schedule", label: t("Worship & Prayer", "வழிபாடு") }
      ]
    },
    { 
      type: 'dropdown',
      label: t("Archangel Raphael", "புனித ரபேல் அதிதூதர்"),
      isOpen: raphaelOpen,
      setOpen: setRaphaelOpen,
      items: [
        { to: "/raphael/history", label: t("History", "வரலாறு") },
        { to: "/raphael/schedule", label: t("Prayer Timings", "ஜெப நேரங்கள்") }
      ]
    },
    { to: "/events", label: t("Events", "நிகழ்வுகள்") },
    { to: "/festivals", label: t("Festivals", "திருவிழாக்கள்") },
    { 
      type: 'dropdown',
      label: t("Gallery", "புகைப்பட தொகுப்பு"),
      isOpen: galleryOpen,
      setOpen: setGalleryOpen,
      items: [
        { to: "/gallery/michael", label: t("Michael Photos", "மிக்கேல் படங்கள்") },
        { to: "/gallery/raphael", label: t("Raphael Photos", "ரபேல் படங்கள்") },
        { to: "/gallery/songs", label: t("Songs", "பாடல்கள்") }
      ]
    },
    { to: "/sharing", label: t("Sharing", "பகிர்வு") },
    { 
      type: 'dropdown',
      label: t("Leaders", "தலைவர்கள்"),
      isOpen: leadersOpen,
      setOpen: setLeadersOpen,
      items: [
        { to: "/leaders", label: t("Village Leaders", "ஊர் தலைவர்கள்") },
        { to: "/welfare", label: t("Welfare Forum", "நற்பணி மன்றம்") }
      ]
    },
    { to: "/contact", label: t("Contact", "தொடர்பு") }
  ];

  return (
    <nav className="navbar-container shadow-premium">
      {/* Mobile Toggle */}
      <button 
        className="mobile-menu-toggle"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Desktop & Mobile Links Overlay */}
      <div className={`nav-links-wrapper ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-links">
          {navLinks.map((link, idx) => (
            link.type === 'dropdown' ? (
              <div 
                key={idx}
                className="nav-item dropdown"
                onMouseEnter={() => window.innerWidth > 1024 && link.setOpen(true)}
                onMouseLeave={() => window.innerWidth > 1024 && link.setOpen(false)}
                onClick={() => window.innerWidth <= 1024 && link.setOpen(!link.isOpen)}
              >
                <div className="dropdown-trigger">
                  {link.label} <ChevronDown size={14} className={link.isOpen ? 'rotated' : ''} />
                </div>
                <AnimatePresence>
                  {link.isOpen && (
                    <motion.div 
                      className="dropdown-menu glass-morphism"
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={dropdownVariants}
                    >
                      {link.items.map((sub, sIdx) => (
                        <motion.div key={sIdx} variants={itemVariants}>
                          <NavLink 
                            to={sub.to} 
                            className="dropdown-item"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {sub.label}
                          </NavLink>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <NavLink 
                key={idx}
                to={link.to} 
                className={({ isActive }) => (isActive ? 'nav-item active' : 'nav-item')}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </NavLink>
            )
          ))}

        </div>
      </div>


      <style>{`
        .navbar-container {
          background: white;
          padding: 0 5%;
          position: sticky;
          top: 0;
          z-index: 1100;
          border-bottom: 2px solid var(--glass-border);
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 80px;
        }

        .mobile-menu-toggle {
          display: none;
          color: var(--primary);
          position: absolute;
          right: 5%;
          z-index: 1001;
        }

        .nav-links-wrapper {
          display: flex;
          justify-content: center;
          width: 100%;
        }

        .nav-links {
          display: flex;
          gap: 1rem;
        }

        .nav-item {
          padding: 1.5rem 1rem;
          font-family: var(--ui-font);
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.82rem;
          letter-spacing: 1px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 0.4rem;
          position: relative;
          white-space: nowrap;
        }

        .nav-item::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: var(--primary);
          transition: 0.3s;
          transform: translateX(-50%);
        }

        .nav-item:hover, .nav-item.active { color: var(--primary); }
        .nav-item:hover::after, .nav-item.active::after { width: 50%; }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          min-width: 220px;
          background: white;
          padding: 1rem;
          border-radius: 0 0 16px 16px;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--glass-border);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .dropdown-item {
          padding: 0.8rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          color: var(--text-main);
          transition: 0.3s;
        }

        .dropdown-item:hover {
          background: var(--bg-soft);
          color: var(--primary);
          padding-left: 1.5rem;
        }



        .rotated { transform: rotate(180deg); }

        @media (max-width: 1024px) {
          .navbar-container { justify-content: flex-start; min-height: 60px; }
          .desktop-only { display: none; }
          .mobile-menu-toggle { display: block; }

          .nav-links-wrapper {
            position: fixed;
            top: 0;
            right: 0;
            width: 80%;
            height: 100vh;
            background: white;
            box-shadow: -10px 0 30px rgba(0,0,0,0.1);
            transform: translateX(100%);
            transition: transform 0.4s cubic-bezier(0.23, 1, 0.32, 1);
            padding: 5rem 2rem;
            z-index: 999;
          }

          .nav-links-wrapper.mobile-open { transform: translateX(0); }

          .nav-links { flex-direction: column; width: 100%; gap: 0; }

          .nav-item {
            width: 100%;
            padding: 1.2rem 0;
            border-bottom: 1px solid var(--glass-border);
            flex-direction: column;
            align-items: flex-start;
          }

          .dropdown-trigger { width: 100%; justify-content: space-between; }

          .dropdown-menu {
            position: static;
            transform: none;
            width: 100%;
            box-shadow: none;
            border: none;
            background: var(--bg-soft);
            padding: 1rem;
            margin-top: 0.5rem;
            border-radius: 12px;
          }

        }
      `}</style>
    </nav>
  );
};

export default Navbar;
