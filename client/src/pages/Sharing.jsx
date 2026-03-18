import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Send, Upload } from 'lucide-react';
import { io } from 'socket.io-client';
import API_URL, { getApiUrl, getImageUrl } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const Sharing = () => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photo: null,
    message: ''
  });

  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchSubmissions();

    const socket = io(API_URL || undefined);
    socket.on('sharing_updated', (updatedSharing) => {
      setSubmissions(updatedSharing);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch(getApiUrl('/api/sharing'));
      if (response.ok) {
        const data = await response.json();
        setSubmissions(data);
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('message', formData.message);
      if (formData.photo) {
        formDataToSend.append('image', formData.photo);
      }

      const response = await fetch(getApiUrl('/api/sharing'), {
        method: 'POST',
        body: formDataToSend
      });

      if (response.ok) {
        const savedEntry = await response.json();
        setSubmissions(prev => [savedEntry, ...prev]);
        showNotification(t("Thank you for sharing your testimonial!", "உங்கள் சாட்சியத்தைப் பகிர்ந்தமைக்கு நன்றி!"), 'success');
        setFormData({ name: '', email: '', photo: null, message: '' });
      } else {
        showNotification(t("Upload failed. Please try again.", "பதிவேற்றம் தோல்வியடைந்தது. மீண்டும் முயற்சிக்கவும்."), 'error');
      }
    } catch (error) {
      console.error('Error submitting experience:', error);
      showNotification(t("Connection error. Please try again.", "இணைப்புப் பிழை. மீண்டும் முயற்சிக்கவும்."), 'error');
    }
  };

  return (
    <motion.div 
      className="sharing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="premium-sharing-header">
        <motion.div 
          className="sacred-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Upload size={14} />
          <span>{t("Community", "சமூகம்")}</span>
          <Upload size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Grace & Faith", "அருள் மற்றும் நம்பிக்கை")}</h1>
        <p className="premium-subtitle">{t("Share your experiences of grace and faith with our community in Ettunayakkanpatti", "இறை அருள் மற்றும் நம்பிக்கையின் உங்கள் அனுபவங்களை பகிர்ந்து கொள்ளுங்கள்")}</p>
        <div className="header-divider" />
      </header>

      <div className="sharing-compact-container">
        {/* Live Experiences Section */}
        <section className="live-experiences-section">
          <div className="section-header-compact">
            <h2>{t("Shared Experiences", "பகிரப்பட்ட அனுபவங்கள்")}</h2>
          </div>
          
          <div className="experiences-list">
            <AnimatePresence initial={false}>
              {submissions.map((sub) => (
                <motion.div 
                  key={sub.id}
                  className="experience-entry shadow-sm"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <div className="entry-content-wrapper">
                    <div className="entry-photo-side">
                      {sub.photo ? (
                        <img src={getImageUrl(sub.photo)} alt={sub.name} className="user-photo-circle" />
                      ) : (
                        <div className="user-photo-placeholder">
                          {sub.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="entry-text-side">
                      <p className="experience-text">"{sub.message}"</p>
                      <div className="author-details-minimal">
                        <span className="author-name-bold">{sub.name}</span>
                        <span className="author-email-muted">{sub.email}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Compact Submission Form */}
        <section className="compact-form-section">
          <div className="premium-sharing-card-compact shadow-premium">
            <div className="sharing-card-header-compact">
              <h2>{t("Your Story", "உங்கள் கதை")}</h2>
            </div>
            
            <form className="compact-sharing-form" onSubmit={handleSubmit}>
              <div className="compact-input-grid">
                <div className="compact-input-group">
                  <label>{t("Name", "பெயர்")}</label>
                  <input 
                    type="text" 
                    placeholder={t("John Doe", "ஜான் டோ")}
                    required 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="compact-input-group">
                  <label>{t("Email", "மின்னஞ்சல்")}</label>
                  <input 
                    type="email" 
                    placeholder="email@example.com"
                    required 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="compact-input-group">
                <label>{t("Your Experience", "உங்கள் அனுபவம்")}</label>
                <textarea 
                  rows="3" 
                  required
                  placeholder={t("Share your grace experience...", "உங்கள் அருள் அனுபவத்தைப் பகிரவும்...")}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <div className="compact-input-group">
                <label>{t("Photo Upload", "புகைப்படத்தைப் பதிவேற்றவும்")}</label>
                <div className="compact-upload-zone">
                  <Upload size={16} className="upload-icon" />
                  <span className="upload-text">{formData.photo ? formData.photo.name : t("Choose Image", "படத்தைத் தேர்ந்தெடுக்கவும்")}</span>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => setFormData({...formData, photo: e.target.files[0]})}
                  />
                </div>
              </div>

              <button type="submit" className="compact-submit-btn shadow-premium">
                <Send size={16} /> 
                <span>{t("Share Experience", "அனுபவத்தைப் பகிர்க")}</span>
              </button>
            </form>
          </div>
        </section>
      </div>

      <style>{`
        .sharing-page {
          max-width: 1000px;
          margin: 0 auto;
          padding: 60px 5%;
        }

        .premium-sharing-header {
          text-align: center;
          margin-bottom: 8rem;
        }

        .sacred-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--bg-soft);
          color: var(--primary);
          padding: 0.5rem 1.5rem;
          border-radius: 40px;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
          border: 1px solid var(--glass-border);
        }

        .premium-title {
          font-size: var(--fs-display);
          margin-bottom: 1rem;
          font-family: var(--display-font);
        }

        .premium-subtitle {
          color: var(--text-muted);
          font-size: var(--fs-base);
          max-width: 500px;
          margin: 0 auto 2rem;
        }

        .header-divider {
          width: 50px;
          height: 3px;
          background: var(--secondary);
          margin: 0 auto;
          border-radius: 2px;
        }

        .sharing-compact-container {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        /* Live Experiences Styles */
        .live-experiences-section {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .section-header-compact h2 {
          font-size: var(--fs-xl);
          font-family: var(--display-font);
          color: var(--text-main);
          text-align: center;
        }

        .experiences-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .experience-entry {
          background: white;
          padding: 2rem;
          border-radius: 24px;
          border: 1px solid var(--glass-border);
        }

        .entry-content-wrapper {
          display: flex;
          gap: 1.5rem;
          align-items: flex-start;
        }

        .entry-photo-side {
          flex-shrink: 0;
        }

        .user-photo-circle {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid var(--secondary);
        }

        .user-photo-placeholder {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--bg-soft);
          color: var(--primary);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 700;
          border: 2px solid var(--secondary);
        }

        .entry-text-side {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .experience-text {
          font-size: var(--fs-base);
          line-height: 1.6;
          color: var(--text-main);
          font-style: italic;
        }

        .author-details-minimal {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
        }

        .author-name-bold {
          font-weight: 800;
          font-size: 0.9rem;
          color: var(--primary);
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .author-email-muted {
          font-size: 0.8rem;
          color: var(--text-muted);
        }

        /* Compact Form Styles */
        .premium-sharing-card-compact {
          background: var(--bg-soft);
          padding: 3rem;
          border-radius: 32px;
          border: 1px solid var(--glass-border);
        }

        .sharing-card-header-compact { margin-bottom: 2rem; text-align: center; }
        .sharing-card-header-compact h2 { font-size: var(--fs-md); color: var(--primary); }

        .compact-sharing-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .compact-input-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .compact-input-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .compact-input-group label {
          font-weight: 700;
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          color: var(--text-muted);
        }

        .compact-input-group input, .compact-input-group textarea {
          padding: 1rem;
          border: 1px solid var(--glass-border);
          background: white;
          border-radius: 12px;
          font-size: var(--fs-base);
          outline: none;
          transition: border-color 0.3s;
        }

        .compact-input-group input:focus, .compact-input-group textarea:focus {
          border-color: var(--secondary);
        }

        .compact-upload-zone {
          position: relative;
          padding: 1.5rem;
          border: 1px dashed var(--secondary);
          border-radius: 12px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          cursor: pointer;
          background: white;
        }

        .upload-icon { color: var(--secondary); }
        .upload-text { font-weight: 600; color: var(--text-muted); font-size: 0.8rem; }

        .compact-upload-zone input {
          position: absolute;
          inset: 0;
          opacity: 0;
          cursor: pointer;
        }

        .compact-submit-btn {
          padding: 1rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-weight: 700;
          font-size: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.8rem;
          cursor: pointer;
          transition: 0.3s;
        }

        .compact-submit-btn:hover { background: #a00000; transform: translateY(-2px); }

        @media (max-width: 1024px) {
          .sharing-page { padding: 40px 1.5rem; }
          .premium-sharing-header { margin-bottom: 4rem; }
          .premium-sharing-card-compact { padding: 2.5rem 1.5rem; }
          .compact-input-grid { grid-template-columns: 1fr; }
          .entry-content-wrapper { flex-direction: column; align-items: center; text-align: center; }
          .author-details-minimal { align-items: center; }
          .user-photo-circle, .user-photo-placeholder { width: 60px; height: 60px; }
        }
      `}</style>
    </motion.div>
  );
};

export default Sharing;
