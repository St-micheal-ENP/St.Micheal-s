import { Phone, Mail, Instagram, Youtube, Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Sidebar = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const socialLinks = [
    { icon: <Phone size={12} />, url: 'tel:+910000000000', label: t('Call', 'அழைப்பு'), color: '#25D366' },
    { icon: <Mail size={12} />, url: 'mailto:stmichealenp@gmail.com', label: t('Email', 'மின்னஞ்சல்'), color: '#EA4335' },
    { icon: <Instagram size={12} />, url: 'https://www.instagram.com/st.micheal_enp_church/', label: t('Instagram', 'இன்ஸ்டாகிராம்'), color: '#E4405F' },
    { icon: <Youtube size={12} />, url: 'https://www.youtube.co/@Ettunayakkanpatti2009', label: t('YouTube', 'யுடியூப்'), color: '#FF0000' },
  ];

  return (
    <aside className="social-sidebar">


      {socialLinks.map((link, index) => (
        <a 
          key={index} 
          href={link.url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-icon"
          style={{ '--hover-color': link.color }}
          aria-label={link.label}
        >
          {link.icon}
        </a>
      ))}

      <div className="sidebar-divider"></div>

      <button 
        className="social-icon lang-sidebar-btn" 
        onClick={toggleLanguage}
        title={t("Switch Language", "மொழியை மாற்றவும்")}
      >
        <Globe size={14} />
        <span className="lang-mini-tag">{language === 'en' ? 'TA' : 'EN'}</span>
      </button>

      <style>{`
        .social-sidebar {
          position: fixed;
          right: 12px;
          top: 75%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          z-index: 1200;
          padding: 0.5rem;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 40px;
          border: 1px solid rgba(212, 175, 55, 0.25);
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        }
 
        .social-icon {
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: #ffffff;
          border: 1px solid var(--secondary);
          color: var(--primary);
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-sm);
        }
 
        .social-icon:hover {
          background: var(--primary);
          color: white;
          transform: scale(1.1) translateX(-3px);
          box-shadow: 0 5px 15px rgba(139, 0, 0, 0.3);
        }
 
        .tooltip {
          position: absolute;
          right: 120%;
          background: var(--primary);
          color: white;
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
          font-size: 0.7rem;
          font-family: var(--ui-font);
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-smooth);
          box-shadow: var(--shadow-md);
        }
 
        .social-icon:hover .tooltip {
          opacity: 1;
          visibility: visible;
          right: 130%;
        }

        .sidebar-divider {
          width: 50%;
          height: 1px;
          background: rgba(212, 175, 55, 0.3);
          margin: 0.2rem auto;
        }

        .lang-sidebar-btn {
          background: var(--primary);
          color: white;
          border: none;
          cursor: pointer;
          flex-direction: column;
          gap: 2px;
          height: auto !important;
          padding: 6px 0;
          min-height: 38px;
        }

        .lang-sidebar-btn:hover {
          background: var(--secondary);
          transform: scale(1.1) translateX(-3px);
        }

        .lang-sidebar-btn .lang-mini-tag {
          font-size: 0.55rem;
          font-weight: 800;
          letter-spacing: 0.5px;
        }
 

        @media (max-width: 768px) {
          .social-sidebar {
            top: 42%;
            right: 0;
            border-radius: 12px 0 0 12px;
            padding: 0.8rem 0.4rem;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.95);
            box-shadow: -5px 5px 20px rgba(0,0,0,0.1);
          }
          .social-icon {
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </aside>
  );
};

export default Sidebar;
