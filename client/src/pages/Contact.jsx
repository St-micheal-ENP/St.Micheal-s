import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Mail, Phone, MapPin, Clock, Send, Globe, MessageSquare } from 'lucide-react';
import { getApiUrl } from '../utils/api';
import { useNotification } from '../context/NotificationContext';

const Contact = () => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [status, setStatus] = useState({ loading: false, success: null });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: null });

    try {
      const response = await fetch(getApiUrl('/api/contacts'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setStatus({ loading: false, success: true });
        showNotification(t("Thank you for your message! We will get back to you soon.", "உங்கள் செய்திக்கு நன்றி! விரைவில் உங்களைத் தொடர்பு கொள்வோம்."), 'success');
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Submit error:', error);
      setStatus({ loading: false, success: false });
      showNotification(t("Failed to send message. Please try again later.", "செய்தியை அனுப்புவதில் தோல்வி. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."), 'error');
    }
  };

  return (
    <motion.div 
      className="contact-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="premium-contact-header">
        <motion.div 
          className="sacred-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <Globe size={14} />
          <span>{t("Connect", "தொடர்பு")}</span>
          <Globe size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Contact Us", "தொடர்பு கொள்ள")}</h1>
        <p className="premium-subtitle">{t("Reach out for prayers, service inquiries, or visits. We are here to serve you.", "ஜெபங்கள், சேவை விசாரணைகள் அல்லது வருகைகளுக்கு எங்களைத் தொடர்பு கொள்ளவும். உங்களுக்கு சேவை செய்ய நாங்கள் இங்கு இருக்கிறோம்.")}</p>
        <div className="header-divider" />
      </header>

      <div className="contact-premium-grid">
        <motion.div 
          className="form-visual-section"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="premium-form-card shadow-ultra">
            <div className="form-card-header">
              <MessageSquare className="accent-icon" />
              <h2>{t("Send a Message", "செய்தி அனுப்புங்கள்")}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="premium-form">
              <div className="input-row">
                <div className="input-group">
                  <label>{t("Full Name", "முழு பெயர்")}</label>
                  <input 
                    type="text" 
                    required 
                    placeholder={t("Your Name", "உங்கள் பெயர்")}
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>{t("Email Address", "மின்னஞ்சல் முகவரி")}</label>
                  <input 
                    type="email" 
                    required 
                    placeholder={t("example@mail.com", "உதாரணம்@mail.com")}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-row">
                <div className="input-group">
                  <label>{t("Phone Number", "தொலைபேசி எண்")}</label>
                  <input 
                    type="tel" 
                    placeholder="+91 00000 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
                <div className="input-group">
                  <label>{t("Subject", "பொருள்")}</label>
                  <input 
                    type="text" 
                    placeholder={t("Prayer Request, Inquiry, etc.", "ஜெப உதவி, விசாரணை போன்றவை.")}
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>{t("Your Message", "உங்கள் செய்தி")}</label>
                <textarea 
                  rows="5" 
                  required 
                  placeholder={t("How can we help you?", "நாங்கள் உங்களுக்கு எவ்வாறு உதவலாம்?")}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                ></textarea>
              </div>

              <button type="submit" className="premium-submit-btn shadow-premium">
                <Send size={18} /> 
                <span>{t("Send Message", "செய்தி அனுப்பு")}</span>
              </button>
            </form>
          </div>
        </motion.div>

        <motion.div 
          className="details-visual-section"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
        >
          <div className="info-cards-stack">
            {[
              { icon: <MapPin />, title: t("Location", "இருப்பிடம்"), lines: [t("Ettunayakkanpatti,", "எட்டுநாயக்கன்பட்டி,"), t("Thoothukudi District, Tamil Nadu 628 720", "தூத்துக்குடி மாவட்டம், தமிழ்நாடு 628 720")] },
              { icon: <Phone />, title: t("Call Us", "அழைக்கவும்"), lines: ["+91 98765 43210", "+91 0461 234567"] },
              { icon: <Mail />, title: t("Email Us", "மின்னஞ்சல்"), lines: ["stmichealenp@gmail.com"] },
              { icon: <Clock />, title: t("Office Hours", "அலுவலக நேரம்"), lines: [t("Mon - Sat: 9 AM - 7 PM", "திங்கள் - சனி: காலை 9 - இரவு 7"), t("Sun: 8 AM - 12 PM", "ஞாயிறு: காலை 8 - மதியம் 12")] }
            ].map((box, i) => (
              <div key={i} className="info-detail-card shadow-premium">
                <div className="icon-circle">{box.icon}</div>
                <div className="info-content">
                  <h4>{box.title}</h4>
                  {box.lines.map((line, li) => <p key={li}>{line}</p>)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="premium-map-container shadow-ultra">
         <iframe 
            title={t("Detailed Church Map", "விரிவான ஆலய வரைபடம்")}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.570725833113!2d77.94291845!3d9.0811415!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3b01535eb6ef7ed5%3A0x5c46e219e1645bd8!2sEttunayakkanpatti%2C%20Tamil%20Nadu%20628720!5e0!3m2!1sen!2sin!4v1710526488000!5m2!1sen!2sin" 
            width="100%" 
            height="500" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            loading="lazy"
          ></iframe>
      </div>

      <style>{`
        .contact-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 5%;
        }

        .premium-contact-header {
          text-align: center;
          margin-bottom: 6rem;
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

        .contact-premium-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 5rem;
          margin-bottom: 8rem;
          align-items: flex-start;
        }

        /* Form Card */
        .premium-form-card {
          background: white;
          padding: 5rem;
          border-radius: 40px;
          border: 1px solid var(--glass-border);
        }

        .form-card-header {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 4rem;
        }

        .accent-icon {
          width: 40px;
          height: 40px;
          color: var(--primary);
        }

        .form-card-header h2 {
          font-size: var(--fs-xl);
        }

        .premium-form {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }

        .input-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        .input-group {
          display: flex;
          flex-direction: column;
          gap: 0.8rem;
        }

        .input-group label {
          font-weight: 800;
          font-size: var(--fs-xs);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--primary);
          opacity: 0.8;
        }

        .input-group input, .input-group textarea {
          padding: 1.2rem;
          border: 1px solid var(--glass-border);
          background: var(--bg-soft);
          border-radius: 16px;
          font-size: 1rem;
          outline: none;
          transition: var(--transition-smooth);
        }

        .input-group input:focus, .input-group textarea:focus {
          border-color: var(--primary);
          background: white;
          box-shadow: 0 0 0 4px rgba(139, 0, 0, 0.05);
        }

        .premium-submit-btn {
          padding: 1.2rem;
          background: var(--primary);
          color: white;
          border: none;
          border-radius: 16px;
          font-weight: 700;
          font-size: 1.1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          cursor: pointer;
          transition: var(--transition-smooth);
        }

        .premium-submit-btn:hover {
          background: #a00000;
          transform: translateY(-4px);
        }

        /* Details Stack */
        .info-cards-stack {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-detail-card {
          background: white;
          padding: 2rem;
          border-radius: 24px;
          display: flex;
          gap: 2rem;
          align-items: center;
          border: 1px solid var(--glass-border);
          transition: var(--transition-smooth);
        }

        .info-detail-card:hover {
          transform: translateX(12px);
          border-color: var(--secondary);
        }

        .icon-circle {
          width: 60px;
          height: 60px;
          background: var(--bg-soft);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
          flex-shrink: 0;
        }

        .info-content h4 {
          font-size: 1.1rem;
          margin-bottom: 0.4rem;
          color: var(--primary);
        }

        .info-content p {
          color: var(--text-muted);
          font-size: var(--fs-base);
          line-height: 1.5;
        }

        .premium-map-container {
          border-radius: 40px;
          overflow: hidden;
          background: white;
          border: 1px solid var(--glass-border);
        }

        @media (max-width: 1200px) {
          .contact-premium-grid { grid-template-columns: 1fr; gap: 3rem; }
          .premium-form-card { padding: 3rem 1.5rem; border-radius: 24px; }
          .form-card-header { margin-bottom: 2.5rem; }
        }
 
        @media (max-width: 600px) {
          .input-row { grid-template-columns: 1fr; gap: 2.5rem; }
          .info-detail-card { flex-direction: column; text-align: center; gap: 1rem; padding: 1.5rem; }
          .premium-map-container { border-radius: 20px; }
          .premium-map-container iframe { height: 350px; }
        }
      `}</style>
    </motion.div>
  );
};

export default Contact;
