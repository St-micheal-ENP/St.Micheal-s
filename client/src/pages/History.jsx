import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const History = () => {
  const { t } = useLanguage();

  return (
    <motion.div 
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="history-header">
        <motion.div 
          className="sacred-tag"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {t("Our Legacy", "எங்கள் பாரம்பரியம்")}
        </motion.div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {t("The Journey of Faith", "நம்பிக்கையின் பயணம்")}
        </motion.h1>
        <div className="location-badge">St. Michael's Church, Ettunayakkanpatti</div>
      </header>
 
      <section className="timeline-container">
        <div className="timeline-line" />
        
        {[
          { 
            date: "1600s AD", 
            text: t("The Church of Our Lady of Heaven (Thuya Paraloga Annai Aalayam) was constructed, serving as a spiritual home for multiple surrounding villages.", "தூய பரலோக அன்னை ஆலயம் கட்டப்பட்டது, இது சுற்றியுள்ள பல கிராமங்களுக்கு ஆன்மீக இல்லமாக விளங்கியது."),
            align: "left"
          },
          { 
            date: "1863 AD", 
            text: t("A historic transition where the Nadar community sustained the church's legacy, ensuring the continuity of faith in the region.", "நாடார் சமூகம் ஆலயத்தின் பாரம்பரியத்தைத் தக்கவைத்து, இப்பகுதியில் நம்பிக்கையின் தொடர்ச்சியை உறுதி செய்த ஒரு வரலாற்று மாற்றம்."),
            align: "right"
          },
          { 
            date: "1880s AD", 
            text: t("The first small chapel dedicated to Saint Michael the Archangel was built, marked by early miracles and growing devotion.", "புனித மிக்கேல் அதிதூதருக்கென முதல் சிறிய சிற்றாலயம் கட்டப்பட்டது, இது ஆரம்பகால அற்புதங்கள் மற்றும் வளர்ந்து வரும் பக்தியால் குறிக்கப்பட்டது."),
            align: "left"
          },
          { 
            date: "2004 AD", 
            text: t("The completion of the grand multi-storied tower and magnificent sanctuary that stands today as a testament to communal sacrifice.", "இன்று சமூக தியாகத்திற்கு ஒரு சான்றாக நிற்கும் பிரமாண்டமான பல அடுக்கு கோபுரத்துடனான பெரிய ஆலயத்தின் நிறைவு."),
            align: "right"
          }
        ].map((item, i) => (
          <motion.div 
            key={i} 
            className={`timeline-item ${item.align}`}
            initial={{ opacity: 0, x: item.align === 'left' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2 }}
          >
            <div className="premium-timeline-card shadow-ultra">
              <span className="year-tag">{item.date}</span>
              <p>{item.text}</p>
              <div className="card-indicator" />
            </div>
          </motion.div>
        ))}
      </section>
 
      <section className="important-dates-banner shadow-premium">
        <div className="banner-glow" />
        <div className="banner-content">
          <h2>{t("Sacred Observances", "புனித தினங்கள்")}</h2>
          <div className="dates-row">
            <div className="date-box">
              <span className="label">{t("Annual Festival", "ஆண்டு திருவிழா")}</span>
              <span className="val">{t("Sep 29", "செப் 29")}</span>
            </div>
            <div className="date-box">
              <span className="label">{t("Flag Hoisting", "கொடியேற்றம்")}</span>
              <span className="val">{t("Sep 20", "செப் 20")}</span>
            </div>
            <div className="date-box">
              <span className="label">{t("Mother Feast", "அன்னை திருவிழா")}</span>
              <span className="val">{t("Aug 15", "ஆக 15")}</span>
            </div>
          </div>
        </div>
      </section>
 
      <style>{`
        .history-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 5%;
        }
 
        .history-header {
          text-align: center;
          margin-bottom: 8rem;
        }
 
        .sacred-tag {
          color: var(--secondary);
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          font-size: 0.85rem;
          margin-bottom: 1rem;
        }
 
        .history-header h1 {
          font-size: var(--fs-display);
          margin-bottom: 1.5rem;
        }
 
        .location-badge {
          display: inline-block;
          background: var(--bg-soft);
          padding: 0.6rem 2rem;
          border-radius: 40px;
          color: var(--text-muted);
          font-family: var(--ui-font);
          font-size: 0.9rem;
          border: 1px solid var(--glass-border);
        }
 
        .timeline-container {
          position: relative;
          padding: 2rem 0;
          margin-bottom: 10rem;
        }
 
        .timeline-line {
          position: absolute;
          left: 50%;
          top: 0;
          bottom: 0;
          width: 2px;
          background: linear-gradient(transparent, var(--secondary), transparent);
          transform: translateX(-50%);
        }
 
        @media (max-width: 1024px) {
          .timeline-line { left: 20px; transform: none; }
        }
 
        .timeline-item {
          display: flex;
          justify-content: flex-end;
          padding-right: 50%;
          margin-bottom: 4rem;
          position: relative;
        }
 
        .timeline-item.right {
          justify-content: flex-start;
          padding-right: 0;
          padding-left: 50%;
        }
 
        .premium-timeline-card {
          background: white;
          padding: 3rem;
          border-radius: 30px;
          width: calc(100% - 60px);
          max-width: 500px;
          position: relative;
          border: 1px solid var(--glass-border);
          transition: var(--transition-smooth);
        }
 
        .premium-timeline-card:hover {
          transform: translateY(-10px);
          border-color: var(--primary);
        }
 
        .year-tag {
          display: block;
          font-family: var(--heading-font);
          font-size: var(--fs-xl);
          color: var(--primary);
          margin-bottom: 1rem;
        }
 
        .premium-timeline-card p {
          color: var(--text-muted);
          line-height: 1.8;
          font-size: var(--fs-base);
        }
 
        .card-indicator {
          position: absolute;
          width: 20px;
          height: 20px;
          background: white;
          border: 4px solid var(--secondary);
          border-radius: 50%;
          top: 3rem;
        }
 
        .timeline-item.left .card-indicator { right: -60px; }
        .timeline-item.right .card-indicator { left: -60px; }
 
        /* Important Dates Banner */
        .important-dates-banner {
          position: relative;
          background: var(--primary);
          color: white;
          padding: 6rem;
          border-radius: 40px;
          text-align: center;
          overflow: hidden;
        }
 
        .banner-glow {
          position: absolute;
          top: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.3) 0%, transparent 70%);
        }
 
        .banner-content h2 {
          font-size: var(--fs-xl);
          margin-bottom: 3rem;
          color: white;
        }
 
        .dates-row {
          display: flex;
          justify-content: center;
          gap: 4rem;
          flex-wrap: wrap;
        }
 
        .date-box {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
 
        .date-box .label {
          font-family: var(--ui-font);
          text-transform: uppercase;
          letter-spacing: 2px;
          font-size: 0.8rem;
          opacity: 0.8;
        }
 
        .date-box .val {
          font-family: var(--heading-font);
          font-size: var(--fs-lg);
          color: var(--secondary);
        }
 
        @media (max-width: 1024px) {
          .timeline-item { padding: 0 0 0 60px !important; justify-content: flex-start !important; }
          .premium-timeline-card { max-width: 100%; width: 100%; padding: 2rem; }
          .year-tag { font-size: var(--fs-lg); }
          .card-indicator { left: -50px !important; top: 2rem; }
          .dates-row { gap: 2rem; }
          .important-dates-banner { padding: 3rem 1.5rem; }
        }
 
        @media (max-width: 480px) {
          .history-page { padding: 40px 1.2rem; }
          .history-header { margin-bottom: 4rem; }
          .premium-timeline-card { padding: 1.5rem; border-radius: 20px; }
        }
      `}</style>
    </motion.div>
  );
};

export default History;
