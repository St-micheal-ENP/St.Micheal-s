import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="main-footer">
      <div className="footer-content">
        <div className="footer-col brand-col">
          <h2 className="footer-logo">St. Michael's</h2>
          <p className="footer-tagline">{t("Divine Grace & Sacred Heritage", "இறை அருள் மற்றும் புனித பாரம்பரியம்")}</p>
          <p className="footer-desc">
            {t(
              "Experience the spiritual serenity and historic legacy of Ettunayakkanpatti's most sacred sanctuary.",
              "எட்டுநாயக்கன்பட்டியின் மிக புனிதமான இந்த ஆலயத்தின் ஆன்மீக அமைதியையும் வரலாற்றுப் பாரம்பரியத்தையும் அனுபவியுங்கள்."
            )}
          </p>
        </div>
        
        <div className="footer-col links-col">
          <h3>{t("Quick Links", "விரைவு இணைப்புகள்")}</h3>
          <ul>
            <li><Link to="/">{t("Home", "முகப்பு")}</Link></li>
            <li><Link to="/history">{t("History", "வரலாறு")}</Link></li>
            <li><Link to="/gallery/songs">{t("Songs", "பாடல்கள்")}</Link></li>
            <li><Link to="/contact">{t("Contact", "தொடர்பு")}</Link></li>
          </ul>
        </div>

        <div className="footer-col contact-col">
          <h3>{t("Get in Touch", "தொடர்பு கொள்ள")}</h3>
          <p className="contact-item">
            <strong>{t("Address:", "முகவரி:")}</strong><br/>
            {t("Ettunayakkanpatti, Tamil Nadu 628720", "எட்டுநாயக்கன்பட்டி, தமிழ்நாடு 628720")}
          </p>
          <p className="contact-item">
            <strong>{t("Email:", "மின்னஞ்சல்:")}</strong><br/>
            <a href="mailto:stmichealenp@gmail.com" className="footer-link">stmichealenp@gmail.com</a>
          </p>
          <div className="footer-social-links">
            <a href="https://www.instagram.com/st.micheal_enp_church/" target="_blank" rel="noopener noreferrer" className="footer-social-icon">Instagram</a>
            <a href="https://www.youtube.co/@Ettunayakkanpatti2009" target="_blank" rel="noopener noreferrer" className="footer-social-icon">YouTube</a>
          </div>
        </div>

        <div className="footer-col map-col">
          <h3>{t("Find Us", "எங்களைக் கண்டறிய")}</h3>
          <div className="footer-map-wrapper shadow-premium">
            <iframe 
              title={t("Church Map", "ஆலய வரைபடம்")}
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.570725833113!2d77.94291845!3d9.0811415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01535eb6ef7ed5%3A0x5c46e219e1645bd8!2sEttunayakkanpatti%2C%20Tamil%20Nadu%20628720!5e0!3m2!1sen!2sin!4v1710526488000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="divider" />
        <p>© {new Date().getFullYear()} St. Michael's Church, Ettunayakkanpatti. {t("All Rights Reserved.", "அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.")}</p>
        <p className="footer-credits">
          {t("Developed and Designed by", "உருவாக்கம் மற்றும் வடிவமைப்பு:")} 
          <a href="https://boldvizbyte.com" target="_blank" rel="noopener noreferrer" className="credit-link">BoldVizByte</a>
        </p>
      </div>

      <style>{`
        .main-footer {
          background: #ffffff;
          border-top: 3px solid var(--secondary);
          padding: 80px 5% 40px;
          margin-top: 4rem;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1.5fr 0.8fr 1.2fr 1.5fr;
          gap: 3rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .footer-logo {
          font-family: var(--heading-font);
          font-size: var(--fs-xl);
          color: var(--primary);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .footer-tagline {
          color: var(--secondary);
          font-size: var(--fs-xs);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 2px;
          margin-bottom: 1.5rem;
        }

        .footer-desc {
          color: var(--text-muted);
          max-width: 400px;
          line-height: 1.8;
          font-size: var(--fs-base);
        }

        .footer-col h3 {
          font-family: var(--heading-font);
          font-size: 1.3rem;
          margin-bottom: 2rem;
          position: relative;
          display: inline-block;
          color: var(--primary);
        }

        .footer-col h3::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 0;
          width: 40px;
          height: 3px;
          background: var(--secondary);
        }

        .links-col ul {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .links-col a {
          color: var(--text-muted);
          font-family: var(--ui-font);
          font-weight: 500;
          transition: var(--transition-smooth);
        }

        .links-col a:hover {
          color: var(--primary);
          padding-left: 8px;
        }

        .contact-item {
          margin-bottom: 1.5rem;
          color: var(--text-muted);
          line-height: 1.6;
        }

        .contact-item strong {
          color: var(--primary);
          font-family: var(--ui-font);
          font-size: var(--fs-xs);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .footer-map-wrapper {
          width: 180px;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid var(--secondary);
          background: var(--bg-soft);
        }

        .footer-bottom {
          margin-top: 80px;
          text-align: center;
        }

        .footer-bottom .divider {
          height: 1px;
          background: var(--glass-border);
          margin-bottom: 30px;
        }

        .footer-bottom p {
          color: var(--text-muted);
          font-size: var(--fs-base);
          font-family: var(--ui-font);
          margin-bottom: 0.5rem;
        }

        .footer-credits {
          font-size: 0.8rem !important;
          opacity: 0.8;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .credit-link {
          color: var(--secondary) !important;
          font-weight: 700;
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .credit-link:hover {
          color: var(--primary) !important;
          text-decoration: underline;
        }

        .footer-link {
          color: var(--text-muted);
          text-decoration: none;
          transition: var(--transition-smooth);
        }

        .footer-link:hover {
          color: var(--primary);
        }

        .footer-social-links {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .footer-social-icon {
          font-size: var(--fs-xs);
          font-weight: 700;
          color: var(--secondary);
          text-decoration: none;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: var(--transition-smooth);
        }

        .footer-social-icon:hover {
          color: var(--primary);
        }

        @media (max-width: 1200px) {
          .footer-content {
            grid-template-columns: 1fr 1fr;
            gap: 4rem;
          }
        }

        @media (max-width: 768px) {
          .main-footer { padding: 60px 1.5rem 40px; }
          .footer-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }
          .footer-desc { margin: 0 auto; }
          .footer-col h3::after { left: 50%; transform: translateX(-50%); }
          .links-col ul { align-items: center; }
          .footer-map-wrapper { margin: 0 auto; width: 220px; height: 220px; }
          .footer-logo { font-size: var(--fs-lg); }
        }
      `}</style>
    </footer>
  );
};

export default Footer;
