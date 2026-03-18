import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Heart, GraduationCap, Cross, HeartPulse, Star, Users } from 'lucide-react';

import { io } from 'socket.io-client';
import API_URL, { getApiUrl, getImageUrl } from '../utils/api';

const Welfare = () => {
  const { t } = useLanguage();
  const [members, setMembers] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    fetchMembers();

    const socket = io(API_URL || undefined);
    socket.on('welfare_updated', (updatedMembers) => {
      setMembers(updatedMembers);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchMembers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/welfare'));
      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching welfare members:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const activities = [
    {
      title: t("Marriage Assistance", "திருமண உதவி"),
      desc: t("Providing financial support for marriages in underprivileged families.", "பின்தங்கிய குடும்பங்களில் நடைபெறும் திருமணங்களுக்கு நிதி உதவி வழங்குதல்."),
      icon: <Heart size={24} />,
      color: "#e91e63",
      benefit: t("Social Support", "சமூக ஆதரவு")
    },
    {
      title: t("Educational Aid", "கல்வி உதவி"),
      desc: t("Scholarships and supplies for students to ensure bright futures.", "மாணவர்களின் ஒளிமயமான எதிர்காலத்தை உறுதி செய்ய கல்வி உதவித்தொகை மற்றும் உபகரணங்கள்."),
      icon: <GraduationCap size={24} />,
      color: "#2196f3",
      benefit: t("Empowerment", "அதிகாரமளித்தல்")
    },
    {
      title: t("Medical Help", "மருத்துவ உதவி"),
      desc: t("Helping with medical expenses and organizing health camps.", "மருத்துவச் செலவுகளுக்கு உதவுதல் மற்றும் சுகாதார முகாம்களை ஏற்பாடு செய்தல்."),
      icon: <Cross size={24} />,
      color: "#f44336",
      benefit: t("Health Care", "சுகாதார பராமரிப்பு")
    },
    {
      title: t("General Welfare", "பொது நலன்"),
      desc: t("Supporting local community development and individual needs.", "உள்ளூர் சமூக மேம்பாடு மற்றும் தனிநபர் தேவைகளை ஆதரித்தல்."),
      icon: <HeartPulse size={24} />,
      color: "#4caf50",
      benefit: t("Community Care", "சமூக பராமரிப்பு")
    }
  ];

  const leaders = members.filter(m => m.group === 'leadership');
  const generalMembers = members.filter(m => m.group !== 'leadership');

  return (
    <motion.div 
      className="welfare-page"
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
          <Heart size={14} />
          <span>{t("St. Michael Welfare Forum", "புனித மிக்கேல் நற்பணி மன்றம்")}</span>
          <Heart size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Empowering Our Community", "எங்கள் சமூகத்தை உயர்த்துவது")}</h1>
        <p className="premium-subtitle">{t("Dedicated to the social and spiritual upliftment of Ettunayakkanpatti", "எட்டுநாயக்கன்பட்டியின் சமூக மற்றும் ஆன்மீக மேம்பாட்டிற்காக அர்ப்பணிக்கப்பட்டது")}</p>
        <div className="header-divider" />
      </header>

      <section className="welfare-intro-section">
        <div className="welfare-intro premium-card shadow-premium">
          <h2>{t("Our Mission", "எங்கள் நோக்கம்")}</h2>
          <p>
            {t(
              "St. Michael Welfare Forum (Narpani Mandram) serves as a beacon of hope and support in Ettunayakkanpatti. Since its inception, we have been committed to providing holistic aid to the needy, ensuring that no member of our community faces life's challenges alone. Through your support and the intercession of Archangel Michael, we continue to grow in our service of love.",
              "புனித மிக்கேல் நற்பணி மன்றம் எட்டுநாயக்கன்பட்டியில் நம்பிக்கை மற்றும் ஆதரவின் அடையாளமாக செயல்படுகிறது. அதன் தொடக்கத்திலிருந்தே, தேவையுள்ளவர்களுக்கு முழுமையான உதவியை வழங்க நாங்கள் கடமைப்பட்டுள்ளோம். உங்கள் ஆதரவு மற்றும் அதிதூதர் மிக்கேலின் வேண்டுதல்கள் மூலம், நாங்கள் அன்பின் சேவையில் தொடர்ந்து வளர்கிறோம்."
            )}
          </p>
          <div className="intro-accent-glow" />
        </div>
      </section>

      <section className="activities-section">
        <div className="section-header">
          <span className="section-tag">{t("Impact", "தாக்கம்")}</span>
          <h2>{t("Welfare Activities", "நற்பணி நடவடிக்கைகள்")}</h2>
        </div>

        <div className="activities-premium-grid">
          {activities.map((item, index) => (
            <motion.div 
              key={index} 
              className="premium-activity-card shadow-premium"
              whileHover={{ y: -12 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="activity-icon-box" style={{ background: `${item.color}10`, color: item.color }}>
                {item.icon}
              </div>
              <span className="benefit-pill" style={{ background: `${item.color}10`, color: item.color }}>{item.benefit}</span>
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
              <div className="card-accent" style={{ background: item.color }} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="council-section">
        <div className="section-header">
          <span className="section-tag">{t("Leadership", "தலைமை")}</span>
          <h2>{t("Charity Council", "அறக்கட்டளைக் குழு")}</h2>
        </div>

        <div className="welfare-leaders-grid">
          {leaders.map((leader, index) => (
            <motion.div 
              key={index} 
              className={`welfare-leader-card ${leader.featured ? 'featured-card shadow-ultra' : 'shadow-premium'}`}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05 }}
            >
              <div className="leader-visual">
                <div className="photo-inner">
                  <img src={getImageUrl(leader.image)} alt={leader.name} />
                </div>
                {leader.featured && <div className="featured-badge"><Users size={16} /></div>}
              </div>
              <div className="leader-info">
                <span className="role-tag">{t(leader.designation, leader.designation_ta)}</span>
                <h3>{t(leader.name, leader.name_ta)}</h3>
                <p className="leader-contact">{leader.phone}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {generalMembers.length > 0 && (
        <section className="members-list-section">
          <div className="section-header">
            <span className="section-tag">{t("Community", "சமூகம்")}</span>
            <h2>{t("Welfare Members", "நற்பணி மன்ற உறுப்பினர்கள்")}</h2>
          </div>

          <div className="members-linear-container shadow-premium">
            {generalMembers.map((member, index) => (
              <motion.div 
                key={member.id}
                className="member-linear-row"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <div className="member-mini-visual">
                  <img 
                    src={getImageUrl(member.image) || 'https://via.placeholder.com/50'} 
                    alt={member.name} 
                    className="member-photo-mini" 
                  />
                </div>
                <div className="member-linear-info">
                  <span className="member-name-text">{t(member.name, member.name_ta)}</span>
                  <div className="info-dot" />
                  <span className="member-contact-text">{member.phone}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      <style>{`
        .welfare-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 5%;
        }

        .page-header {
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
          font-size: var(--fs-xl);
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

        .welfare-intro-section {
          margin-bottom: 8rem;
        }

        .welfare-intro.premium-card {
          background: white;
          padding: 5rem;
          border-radius: 40px;
          text-align: center;
          position: relative;
          overflow: hidden;
          border: 1px solid var(--glass-border);
        }

        .welfare-intro h2 {
          font-size: var(--fs-xl);
          margin-bottom: 2rem;
          color: var(--primary);
        }

        .welfare-intro p {
          font-size: var(--fs-md);
          line-height: 1.8;
          color: var(--text-muted);
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 1;
        }

        .intro-accent-glow {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(139, 0, 0, 0.05) 0%, transparent 70%);
          bottom: -200px;
          right: -100px;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-tag {
          color: var(--secondary);
          font-size: 0.85rem;
          font-weight: 800;
          letter-spacing: 4px;
          text-transform: uppercase;
          display: block;
          margin-bottom: 1rem;
        }

        .section-header h2 {
          font-size: 2.5rem;
        }

        .activities-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 3rem;
          margin-bottom: 8rem;
        }

        .premium-activity-card {
          background: white;
          padding: 4rem 2.5rem;
          border-radius: 32px;
          text-align: center;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .activity-icon-box {
          width: 70px;
          height: 70px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
        }

        .benefit-pill {
          display: inline-block;
          padding: 0.4rem 1.2rem;
          border-radius: 40px;
          font-size: 0.7rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-bottom: 1.5rem;
        }

        .premium-activity-card h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        .premium-activity-card p {
          color: var(--text-muted);
          line-height: 1.6;
        }

        .card-accent {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
          opacity: 0.5;
        }

        .council-section {
          margin-bottom: 4rem;
        }

        .welfare-leaders-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 2.5rem;
        }

        .welfare-leader-card {
          background: white;
          padding: 3rem 2rem;
          border-radius: 32px;
          text-align: center;
          border: 1px solid var(--glass-border);
          position: relative;
        }

        .featured-card {
          background: var(--bg-soft);
          border-color: var(--secondary);
        }

        .leader-visual {
          width: 140px;
          height: 140px;
          margin: 0 auto 1.5rem;
          position: relative;
        }

        .photo-inner {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid var(--secondary);
          padding: 6px;
          background: white;
        }

        .photo-inner img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 50%;
        }

        .featured-badge {
          position: absolute;
          bottom: 5px;
          right: 5px;
          background: var(--secondary);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 3px solid white;
        }

        .role-tag {
          font-size: var(--fs-xs);
          font-weight: 800;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 2px;
          display: block;
          margin-bottom: 0.8rem;
        }

        .leader-info h3 {
          font-size: 1.3rem;
          margin-bottom: 0.5rem;
        }

        .leader-contact {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        @media (max-width: 768px) {
          .welfare-intro.premium-card { padding: 3rem 1.5rem; }
          .welfare-leader-card { padding: 2.5rem 1.5rem; }
          .premium-activity-card { padding: 3rem 1.5rem; }
          .leader-visual { width: 120px; height: 120px; }
          .welfare-intro h2 { font-size: var(--fs-lg); }
        }

        .members-list-section {
          margin-top: 6rem;
          margin-bottom: 4rem;
        }

        .members-linear-container {
          background: white;
          border-radius: 24px;
          padding: 1.5rem;
          border: 1px solid var(--glass-border);
          max-width: 900px;
          margin: 0 auto;
        }

        .member-linear-row {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid var(--bg-soft);
          gap: 2rem;
          transition: var(--transition-smooth);
        }

        .member-linear-row:last-child {
          border-bottom: none;
        }

        .member-linear-row:hover {
          background: var(--bg-soft);
          transform: translateX(10px);
        }

        .member-mini-visual {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid var(--secondary);
          flex-shrink: 0;
        }

        .member-photo-mini {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .member-linear-info {
          display: flex;
          align-items: center;
          gap: 1.5rem;
          flex-grow: 1;
        }

        .member-name-text {
          font-weight: 700;
          color: var(--primary);
          font-size: 1.1rem;
          min-width: 200px;
        }

        .info-dot {
          width: 6px;
          height: 6px;
          background: var(--secondary);
          border-radius: 50%;
          opacity: 0.5;
        }

        .member-contact-text {
          color: var(--text-muted);
          font-family: var(--ui-font);
          letter-spacing: 0.5px;
        }

        @media (max-width: 600px) {
          .member-linear-row {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
            padding: 2rem 1rem;
          }
          .member-linear-info {
            flex-direction: column;
            gap: 0.5rem;
          }
          .info-dot { display: none; }
          .member-name-text { min-width: auto; }
        }
      `}</style>
    </motion.div>
  );
};

export default Welfare;
