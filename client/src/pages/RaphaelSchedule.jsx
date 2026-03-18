import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Clock, Calendar, Star, ShieldCheck } from 'lucide-react';

const RaphaelSchedule = () => {
  const { t } = useLanguage();

  const schedules = [
    {
      title: t("Daily Prayers", "தினசரி ஜெபங்கள்"),
      time: t("Daily at 6:00 PM", "தினமும் மாலை 6:00 மணி"),
      desc: t("Quiet contemplation and communal prayer led by the parish community.", "பங்கு சமூகத்தின் தலைமையில் அமைதியான தியானம் மற்றும் பொதுவான ஜெபம்.")
    },
    {
      title: t("Regular Novena", "வழக்கமான நவநாள்"),
      time: t("Every Saturday: 6:30 PM", "ஒவ்வொரு சனிக்கிழமை: மாலை 6:30"),
      desc: t("Special intercessory prayers honoring the healing grace of Archangel Raphael.", "புனித ரபேல் அதிதூதரின் குணப்படுத்தும் அருளைக் கௌரவிக்கும் சிறப்பான மன்றாட்டு ஜெபங்கள்.")
    },
    {
      title: t("Annual Feast Day", "ஆண்டுத் திருவிழா"),
      time: t("October 24th", "அக்டோபர் 24 ஆம் தேதி"),
      desc: t("A grand celebration of our patron saint with special liturgical services.", "எங்கள் பாதுகாவலரான புனிதரின் சிறப்பு வழிபாடுகளுடன் கூடிய பிரம்மாண்டமான கொண்டாட்டம்.")
    }
  ];

  return (
    <motion.div 
      className="schedule-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="page-header">
        <motion.div 
          className="sacred-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Clock size={14} />
          <span>{t("Sacred Timing", "புனித நேரங்கள்")}</span>
          <Clock size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Archangel Raphael Schedule", "புனித ரபேல் ஜெப நேரங்கள்")}</h1>
        <p className="premium-subtitle">{t("Join us in prayer and devotion in the presence of the Divine Healer", "தெய்வீக குணப்படுத்துபவரின் முன்னிலையில் ஜெபத்திலும் வழிபாட்டிலும் எங்களுடன் இணையுங்கள்")}</p>
        <div className="header-divider" />
      </header>

      <div className="schedule-premium-grid">
        {schedules.map((item, index) => (
          <motion.div 
            key={index} 
            className="premium-schedule-card shadow-ultra"
            initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="card-top">
              <div className="icon-box">
                <Calendar size={24} />
              </div>
              <div className="time-tag">
                <Star size={12} fill="currentColor" />
                {item.time}
              </div>
            </div>
            
            <div className="card-content">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>

            <div className="card-footer-accent" />
          </motion.div>
        ))}
      </div>

      <style>{`
        .schedule-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 80px 5%;
        }

        .page-header {
          text-align: center;
          margin-bottom: 8rem;
        }

        .sacred-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--bg-soft);
          color: var(--primary);
          padding: 0.6rem 2rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 2rem;
          border: 1px solid var(--glass-border);
        }

        .premium-title {
          font-size: var(--fs-display);
          margin-bottom: 1.5rem;
        }

        .premium-subtitle {
          color: var(--text-muted);
          font-size: var(--fs-base);
          max-width: 600px;
          margin: 0 auto 2.5rem;
        }

        .header-divider {
          width: 80px;
          height: 4px;
          background: var(--secondary);
          margin: 0 auto;
          border-radius: 2px;
        }

        .schedule-premium-grid {
          display: flex;
          flex-direction: column;
          gap: 3rem;
        }

        .premium-schedule-card {
          position: relative;
          background: white;
          padding: 3.5rem 2.5rem;
          border-radius: 40px;
          border: 1px solid var(--glass-border);
          overflow: hidden;
          transition: var(--transition-smooth);
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2.5rem;
        }

        .icon-box {
          width: 60px;
          height: 60px;
          background: var(--bg-soft);
          color: var(--primary);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--glass-border);
        }

        .time-tag {
          background: var(--primary);
          color: white;
          padding: 0.8rem 2rem;
          border-radius: 30px;
          font-weight: 800;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: var(--shadow-premium);
          font-size: var(--fs-base);
        }

        .card-content h3 {
          font-size: var(--fs-xl);
          color: var(--primary);
          margin-bottom: 1.2rem;
        }

        .card-content p {
          font-size: var(--fs-base);
          line-height: 1.8;
          color: var(--text-muted);
          max-width: 800px;
        }

        .card-footer-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 6px;
          background: var(--secondary);
          opacity: 0.2;
        }

        @media (max-width: 768px) {
          .premium-title { font-size: var(--fs-xl); }
          .card-top { flex-direction: column; align-items: flex-start; gap: 1.5rem; }
          .time-tag { width: 100%; justify-content: center; padding: 0.8rem 1.5rem; }
          .premium-schedule-card { padding: 2.5rem 1.5rem; border-radius: 24px; }
          .card-content h3 { font-size: var(--fs-lg); }
        }
      `}</style>
    </motion.div>
  );
};

export default RaphaelSchedule;
