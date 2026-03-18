import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { Star, History, Users, ArrowRight } from 'lucide-react';
import church from '../assets/church.png';

const Home = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="home-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div 
            className="sacred-badge"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Star size={14} />
            <span>{t("Divine Grace Since 1900", "1900 முதல் இறை அருள்")}</span>
            <Star size={14} />
          </motion.div>
          <h1 className="hero-title">
            <span className="light-text">{t("Welcome to", "வரவேற்கிறோம்")}</span><br/>
            <span className="gold-gradient-text">St. Michael's Church</span>
          </h1>
          <p className="hero-subtitle">
            {t(
              "Experience the divine atmosphere and sacred heritage of Ettunayakkanpatti's spiritual heart.",
              "எட்டுநாயக்கன்பட்டியின் ஆன்மீக இதயமான புனித மிக்கேல் ஆலயத்தின் இறை அருளையும் புனித பாரம்பரியத்தையும் அனுபவியுங்கள்."
            )}
          </p>
          <div className="hero-actions">
            <Link to="/history" className="primary-btn" style={{ textDecoration: 'none' }}>
              {t("Explore History", "வரலாற்றை அறிக")}
              <ArrowRight size={18} />
            </Link>
            <Link to="/gallery/michael" className="secondary-btn" style={{ textDecoration: 'none' }}>
              {t("View Gallery", "படங்களைக் காண்க")}
            </Link>
          </div>
        </motion.div>

        <motion.div 
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <div className="visual-glow" />
          <div className="image-frame">
            <img src={church} alt="St. Michael's Church" className="hero-img" />
          </div>
        </motion.div>
      </section>

      {/* Features/Highlights */}
      <section className="features-section">
        <div className="section-header">
          <span className="section-tag">{t("Highlights", "சிறப்பம்சங்கள்")}</span>
          <h2>{t("Our Sacred Heritage", "எங்கள் புனித பாரம்பரியம்")}</h2>
          <div className="header-divider" />
        </div>
        
        <div className="features-grid">
          {[
            { 
              title: t("Deep History", "ஆழ்ந்த வரலாறு"), 
              desc: t("Centuries of faith and tradition preserved for generations.", "பல நூற்றாண்டுகளாக பாதுகாக்கப்பட்டு வரும் நம்பிக்கை மற்றும் பாரம்பரியம்."), 
              icon: <History size={32} /> ,
              color: "#8b0000"
            },
            { 
              title: t("Community", "சமூகம்"), 
              desc: t("A united family reflecting the love of our Archangel.", "எங்கள் அதிதூதரின் அன்பைப் பிரதிபலிக்கும் ஒரு ஒருங்கிணைந்த குடும்பம்."), 
              icon: <Users size={32} />,
              color: "#d4af37"
            },
            { 
              title: t("Devotion", "பக்தி"), 
              desc: t("Daily prayers and sacred rituals in a peaceful sanctuary.", "அமைதியான இந்த ஆலயத்தில் தினசரி ஜெபங்கள் மற்றும் புனித சடங்குகள்."), 
              icon: <Star size={32} />,
              color: "#1a237e"
            }
          ].map((item, i) => (
            <motion.div 
              key={i} 
              className="premium-feature-card shadow-premium"
              whileHover={{ y: -10 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="feature-icon-box" style={{ background: `${item.color}10`, color: item.color }}>
                {item.icon}
              </div>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <style>{`
        .home-container {
          overflow-x: hidden;
        }

        .hero-section {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 80px 5%;
          min-height: 80vh;
          gap: 4rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .hero-content {
          flex: 1.2;
        }

        .sacred-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: rgba(139, 0, 0, 0.05);
          color: var(--primary);
          padding: 0.6rem 1.4rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 2rem;
          border: 1px solid rgba(139, 0, 0, 0.1);
        }

        .hero-title {
          font-size: var(--fs-display);
          line-height: 1.1;
          margin-bottom: 2rem;
        }

        .hero-title .light-text {
          font-weight: 400;
          font-size: var(--fs-lg);
          color: var(--text-muted);
        }

        .hero-subtitle {
          font-size: 1.25rem;
          color: var(--text-muted);
          max-width: 600px;
          line-height: 1.8;
          margin-bottom: 3rem;
        }

        .hero-actions {
          display: flex;
          gap: 1.5rem;
        }

        .primary-btn {
          background: var(--primary);
          color: white;
          padding: 1rem 2.5rem;
          border-radius: 30px;
          font-weight: 600;
          font-size: 1rem;
          box-shadow: 0 10px 20px rgba(139, 0, 0, 0.2);
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .primary-btn:hover {
          background: var(--primary-light);
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(139, 0, 0, 0.3);
        }

        .secondary-btn {
          border: 2px solid var(--secondary);
          color: var(--primary);
          padding: 1rem 2.5rem;
          border-radius: 30px;
          font-weight: 600;
          transition: var(--transition-smooth);
        }

        .secondary-btn:hover {
          background: var(--bg-soft);
          transform: translateY(-3px);
        }

        .hero-visual {
          flex: 1;
          position: relative;
        }

        .visual-glow {
          position: absolute;
          width: 500px;
          height: 100%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          z-index: 0;
        }

        .image-frame {
          position: relative;
          z-index: 1;
          border-radius: 30px;
          overflow: hidden;
          padding: 15px;
          background: white;
          box-shadow: var(--shadow-ultra);
          border: 1px solid var(--glass-border);
        }

        .hero-img {
          width: 100%;
          height: auto;
          border-radius: 20px;
          display: block;
        }

        /* Features Section */
        .features-section {
          padding: 100px 5%;
          max-width: 1600px;
          margin: 0 auto;
        }

        .section-header {
          text-align: center;
          margin-bottom: 5rem;
        }

        .section-tag {
          color: var(--secondary);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
        }

        .section-header h2 {
          font-size: var(--fs-xl);
          margin-top: 1rem;
        }

        .header-divider {
          width: 80px;
          height: 4px;
          background: var(--secondary);
          margin: 1.5rem auto;
          border-radius: 2px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: clamp(1.5rem, 4vw, 3rem);
        }

        .premium-feature-card {
          background: white;
          padding: 4rem 2.5rem;
          border-radius: 32px;
          text-align: center;
          border: 1px solid var(--glass-border);
        }

        .feature-icon-box {
          width: 80px;
          height: 80px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 2rem;
        }

        .premium-feature-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1.2rem;
          color: var(--text-main);
        }

        .premium-feature-card p {
          color: var(--text-muted);
          font-size: 1rem;
          line-height: 1.8;
        }

        @media (max-width: 1024px) {
          .hero-section {
            flex-direction: column;
            text-align: center;
            padding: 40px 5%;
            gap: 3rem;
          }
          .hero-subtitle { margin: 0 auto 2.5rem; }
          .hero-actions { 
            justify-content: center;
            flex-wrap: wrap;
          }
          .hero-visual { width: 100%; max-width: 500px; margin: 0 auto; }
        }

        @media (max-width: 480px) {
          .hero-actions { flex-direction: column; width: 100%; }
          .primary-btn, .secondary-btn { width: 100%; justify-content: center; }
          .premium-feature-card { padding: 3rem 1.5rem; }
        }
      `}</style>
    </motion.div>
  );
};

export default Home;
