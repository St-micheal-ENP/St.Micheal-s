import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Globe, Star } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import API_URL, { getApiUrl, getImageUrl } from '../utils/api';
import feastImg from '../assets/Feast.jpeg';
import flagImg from '../assets/Flag.png';
import massImg from '../assets/Mass.jpeg';

const Events = () => {
  const { t } = useLanguage();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEvents();
 
    const socket = io(API_URL || undefined);
    socket.on('events_updated', (updatedEvents) => {
      setEvents(updatedEvents);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/events'));
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      setEvents(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching events:', error);
      setError(t("Unable to load events at this time.", "இந்த நிகழ்வுகளை இப்போதைக்கு ஏற்ற முடியவில்லை."));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      className="events-page"
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
          <Calendar size={14} />
          <span>{t("Community Events", "சமூக நிகழ்வுகள்")}</span>
          <Calendar size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Upcoming & Past Events", "வரவிருக்கும் மற்றும் கடந்த கால நிகழ்வுகள்")}</h1>
        <p className="premium-subtitle">{t("Celebrating our faith through community gatherings", "சமூகக் கூட்டங்கள் மூலம் நமது நம்பிக்கையைக் கொண்டாடுதல்")}</p>
        <div className="header-divider" />
      </header>

      <div className="events-premium-list">
        {isLoading ? (
          <div className="loading-container">
            <div className="sacred-loader"></div>
            <p>{t("Loading Sacred Events...", "புனித நிகழ்வுகள் ஏற்றப்படுகின்றன...")}</p>
          </div>
        ) : error ? (
          <div className="error-container">
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">{t("Retry", "மீண்டும் முயற்சி")}</button>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-events">
            <p>{t("No upcoming events scheduled yet.", "வரவிருக்கும் நிகழ்வுகள் எதுவும் இதுவரை திட்டமிடப்படவில்லை.")}</p>
          </div>
        ) : (
          events.map((event, index) => (
          <motion.div 
            key={index} 
            className="premium-event-card shadow-ultra"
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="event-visual">
              <img src={getImageUrl(event.image)} alt={event.title} className="event-img" />
              <div className="img-overlay" />
              <div className="event-floating-tag">
                <Star size={12} />
                {event.tag}
              </div>
            </div>

            <div className="event-content">
              <span className="event-index">0{index + 1}</span>
              <h2 className="event-display-title">{t(event.title, event.title_ta)}</h2>
              <p className="event-premium-desc">{t(event.description, event.description_ta)}</p>
              <div className="event-footer">
                <div className="event-marker" />
                <span className="marker-text">{t(event.tag, event.tag_ta) || t("Sacred Tradition", "புனித பாரம்பரியம்")}</span>
              </div>
            </div>
          </motion.div>
          )))}
      </div>

      <style>{`
        .events-page {
          max-width: 1400px;
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

        .events-premium-list {
          display: flex;
          flex-direction: column;
          gap: 10rem;
        }

        .premium-event-card {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          background: white;
          border-radius: 40px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          min-height: 500px;
        }

        .premium-event-card:nth-child(even) {
          direction: rtl;
        }

        .premium-event-card:nth-child(even) .event-content {
          direction: ltr;
          text-align: left;
        }

        .event-visual {
          position: relative;
          overflow: hidden;
        }

        .event-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s ease;
        }

        .premium-event-card:hover .event-img {
          transform: scale(1.05);
        }

        .img-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to right, rgba(139, 0, 0, 0.2), transparent);
        }

        .event-floating-tag {
          position: absolute;
          top: 30px;
          left: 30px;
          background: var(--secondary);
          color: var(--primary);
          padding: 0.6rem 1.4rem;
          border-radius: 30px;
          font-weight: 800;
          font-size: 0.75rem;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 0.8rem;
          box-shadow: var(--shadow-premium);
        }

        .event-content {
          padding: 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
        }

        .event-index {
          font-size: 5rem;
          font-weight: 900;
          color: var(--bg-soft);
          position: absolute;
          top: 2rem;
          right: 3rem;
          line-height: 1;
        }

        .event-display-title {
          font-size: var(--fs-xl);
          color: var(--primary);
          margin-bottom: 2rem;
          position: relative;
          z-index: 1;
        }

        .event-premium-desc {
          font-size: var(--fs-base);
          line-height: 2;
          color: var(--text-muted);
          margin-bottom: 3rem;
          text-align: justify;
        }

        .event-footer {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-top: auto;
        }

        .event-marker {
          width: 40px;
          height: 2px;
          background: var(--secondary);
        }

        .marker-text {
          font-size: 0.8rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 3px;
          color: var(--secondary);
        }

        @media (max-width: 1024px) {
          .events-premium-list { gap: 5rem; }
          .premium-event-card {
            grid-template-columns: 1fr;
            min-height: auto;
            border-radius: 24px;
          }
          .premium-event-card:nth-child(even) {
            direction: ltr;
          }
          .event-visual {
            height: 300px;
          }
          .event-content {
            padding: 3rem 1.5rem;
          }
          .event-display-title {
            font-size: var(--fs-lg);
          }
          .event-index {
            font-size: var(--fs-xl);
            opacity: 0.1;
          }
        }
 
        @media (max-width: 480px) {
          .events-page { padding: 40px 1.2rem; }
          .page-header { margin-bottom: 4rem; }
          .event-visual { height: 220px; }
        }

        /* Loading & Error UI */
        .loading-container, .error-container, .empty-events { text-align: center; padding: 5rem; color: var(--text-muted); }
        .sacred-loader { width: 40px; height: 40px; border: 3px solid var(--bg-soft); border-top-color: var(--primary); border-radius: 50%; margin: 0 auto 1.5rem; animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .retry-btn { margin-top: 1rem; padding: 0.6rem 2rem; border-radius: 30px; border: 1px solid var(--primary); color: var(--primary); background: transparent; cursor: pointer; font-weight: 700; transition: 0.3s; }
        .retry-btn:hover { background: var(--primary); color: white; }
      `}</style>
    </motion.div>
  );
};

export default Events;
