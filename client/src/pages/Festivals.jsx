import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calendar } from 'lucide-react';

const Festivals = () => {
  const { t } = useLanguage();

  const localFestivals = [
    {
      name: t("St. Michael's Feast (Grand Festival)", "புனித மிக்கேல் பெருவிழா"),
      date: t("September 20th - 29th", "செப்டம்பர் 20 - 29"),
      desc: t("The main village festival celebrated with a 10-day flag hoisting, special masses, and a grand procession.", "கொடியேற்றம், சிறப்பு திருப்பலிகள் மற்றும் பிரம்மாண்டமான தேர்பவனி ஆகியவற்றுடன் 10 நாட்கள் கொண்டாடப்படும் முக்கிய கிராமத் திருவிழா.")
    },
    {
      name: t("St. Raphael's Feast", "புனித ரபேல் அதிதூதர் திருவிழா"),
      date: t("October 24th", "அக்டோபர் 24"),
      desc: t("A special feast honoring Archangel Raphael with novenas and community prayers.", "நவநாட்கள் மற்றும் சமூக ஜெபங்களுடன் புனித ரபேல் அதிதூதரை கௌரவிக்கும் சிறப்பு விழா.")
    }
  ];

  const christianFestivals = [
    { name: t("Christmas", "கிறிஸ்துமஸ்"), date: t("December 25th", "டிசம்பர் 25") },
    { name: t("Epiphany", "திருக்காட்சி விழா"), date: t("January 6th", "ஜனவரி 6") },
    { name: t("Ash Wednesday", "விபூதி புதன்"), date: t("Variable (Start of Lent)", "மாறுபடும் (தவக்காலத்தின் தொடக்கம்)") },
    { name: t("Good Friday", "புனித வெள்ளி"), date: t("Variable (Passion of Christ)", "மாறுபடும் (கிறிஸ்துவின் திருப்பாடுகள்)") },
    { name: t("Easter Sunday", "இயேசு உயிர்ப்பு பெருவிழா"), date: t("Variable (Resurrection)", "மாறுபடும் (உயிர்ப்பு விழா)") },
    { name: t("Pentecost", "தூய ஆவி பெருவிழா"), date: t("50 Days after Easter", "ஈஸ்டர் பண்டிகைக்கு 50 நாட்களுக்குப் பிறகு") },
    { name: t("All Saints Day", "அனைத்து புனிதர்கள் விழா"), date: t("November 1st", "நவம்பர் 1") },
    { name: t("All Souls Day", "அனைத்து ஆன்மாக்கள் நாள்"), date: t("November 2nd", "நவம்பர் 2") }
  ];

  return (
    <motion.div 
      className="festivals-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="page-header">
        <h1>{t("Festivals & Celebrations", "திருவிழாக்கள் & கொண்டாட்டங்கள்")}</h1>
        <p>{t("Celebrating our faith and traditions in Ettunayakkanpatti", "எட்டுநாயக்கன்பட்டியில் எமது நம்பிக்கை மற்றும் மரபுகளைக் கொண்டாடுதல்")}</p>
      </header>

      <section className="festivals-section">
        <div className="section-title">
          <Sparkles className="title-icon" />
          <h2>{t("Local Village Festivals", "உள்ளூர் கிராமத் திருவிழாக்கள்")}</h2>
        </div>
        <div className="local-festivals-grid">
          {localFestivals.map((fest, index) => (
            <motion.div 
              key={index} 
              className="festival-card gold-border glass-morphism shadow-premium"
              whileHover={{ y: -5 }}
            >
              <div className="fest-header">
                <h3>{fest.name}</h3>
                <span className="fest-date">{fest.date}</span>
              </div>
              <p>{fest.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="festivals-section">
        <div className="section-title">
          <Calendar className="title-icon" />
          <h2>{t("Christian Festivals", "கிறிஸ்தவ திருவிழாக்கள்")}</h2>
        </div>
        <div className="global-festivals-list shadow-premium gold-border glass-morphism">
          {christianFestivals.map((fest, index) => (
            <div key={index} className="global-fest-item">
              <span className="fest-name">{fest.name}</span>
              <span className="fest-date-value">{fest.date}</span>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        .festivals-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 8rem;
          padding: 0 1rem;
        }

        .page-header h1 {
           font-size: var(--fs-xl);
        }

        .page-header p {
           font-size: var(--fs-base);
        }

        .festivals-section {
          margin-bottom: 5rem;
        }

        .section-title {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          color: #8b0000;
        }

        .title-icon {
          width: 32px;
          height: 32px;
        }

        .section-title h2 {
          font-family: 'Cinzel', serif;
          margin: 0;
        }

        .local-festivals-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
        }

        .festival-card {
          padding: 2.5rem;
          border-radius: 20px;
        }

        .fest-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          gap: 1rem;
        }

        .fest-header h3 {
          color: #8b0000;
          margin: 0;
          font-size: var(--fs-md);
        }

        .fest-date {
          background: #8b0000;
          color: white;
          padding: 0.4rem 1rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }

        .festival-card p {
          color: #2c3e50;
          line-height: 1.6;
          font-weight: 500;
        }

        .global-festivals-list {
          border-radius: 20px;
          overflow: hidden;
          background: white;
        }

        .global-fest-item {
          display: flex;
          justify-content: space-between;
          padding: 1.2rem clamp(1rem, 5%, 2.5rem);
          border-bottom: 1px solid rgba(212, 175, 55, 0.2);
          transition: background 0.3s ease;
        }

        .global-fest-item:last-child {
          border-bottom: none;
        }

        .global-fest-item:hover {
          background: rgba(139, 0, 0, 0.02);
        }

        .fest-name {
          font-weight: 700;
          color: #2c3e50;
        }

        .fest-date-value {
          color: #8b0000;
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .festivals-page { padding: 40px 1.5rem; }
          .page-header { margin-bottom: 4rem; }
          .global-fest-item { padding: 1.2rem 1.5rem; flex-direction: column; gap: 0.2rem; }
          .fest-header { flex-direction: column; gap: 0.5rem; }
          .festival-card { padding: 1.5rem; }
        }
      `}</style>
    </motion.div>
  );
};

export default Festivals;
