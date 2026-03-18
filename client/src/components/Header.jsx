import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import logo from '../assets/icon.png';
import church from '../assets/church.png';

const Header = () => {
  const { t } = useLanguage();

  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-logo-left">
          <img src={logo} alt={t("St. Michael Tower", "புனித மிக்கேல் கோபுரம்")} />
        </div>
        
        <div className="header-center-text">
          <p className="line-1">{t("The Official Website of", "இதன் அதிகாரப்பூர்வ இணையதளம்")}</p>
          <p className="line-2">{t("St. Michael's Church", "புனித மிக்கேல் அதிதூதர் ஆலயம்")}</p>
          <p className="line-place">{t("Thoothar Nagar", "தூதர் நகர்")}</p>
          <p className="line-3">
            {t(
              "Ettunayakkanpatti, Thoothukudi District, Tamil Nadu 628 720",
              "எட்டுநாயக்கன்பட்டி, தூத்துக்குடி மாவட்டம், தமிழ்நாடு 628 720"
            )}
          </p>
        </div>

        <div className="header-logo-right">
          <img src={church} alt={t("Mother Church", "தாய் ஆலயம்")} />
        </div>
      </div>

      <style>{`
        .site-header {
          background: linear-gradient(to bottom, #ffffff, #fdfbf7);
          border-bottom: 3px solid var(--secondary);
          width: 100%;
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-md);
        }
 
        .site-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at 50% -20%, rgba(212, 175, 55, 0.2), transparent 70%);
          pointer-events: none;
        }
 
        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.8rem 5%;
          max-width: 1600px;
          margin: 0 auto;
          gap: 3rem;
        }
 
        .header-logo-left img,
        .header-logo-right img {
          width: 180px;
          height: 180px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid var(--secondary);
          box-shadow: var(--shadow-lg);
          transition: var(--transition-smooth);
        }
 
        .header-logo-left img:hover,
        .header-logo-right img:hover {
          transform: scale(1.03) rotate(2deg);
          box-shadow: var(--shadow-ultra);
        }
 
        .header-center-text {
          flex: 1;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
 
        .line-1 {
          font-family: var(--ui-font);
          font-size: 0.95rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 3px;
          font-weight: 600;
        }
 
        .line-2 {
          font-family: var(--heading-font);
          font-weight: 700;
          color: var(--primary);
          font-size: var(--fs-xl);
          line-height: 1.1;
          margin: 0.2rem 0;
        }
 
        .line-place {
          font-family: var(--heading-font);
          font-size: var(--fs-lg);
          color: var(--secondary);
          font-weight: 700;
          letter-spacing: 2px;
        }
 
        .line-3 {
          font-family: var(--body-font);
          font-size: var(--fs-base);
          color: var(--text-main);
          font-weight: 400;
          margin-top: 0.5rem;
        }
 
        @media (max-width: 1024px) {
          .header-logo-left img, .header-logo-right img { width: 120px; height: 120px; }
        }
 
        @media (max-width: 768px) {
          .header-top {
            flex-direction: column;
            gap: 1.2rem;
            padding: 1.5rem 1rem;
          }
          .line-1 { font-size: var(--fs-xs); letter-spacing: 2px; }
          .header-logo-left img,
          .header-logo-right img {
            width: 90px;
            height: 90px;
            border-width: 3px;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;
