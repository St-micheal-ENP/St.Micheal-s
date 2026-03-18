import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { ShieldCheck, HeartPulse, MapPin, Star } from 'lucide-react';

const RaphaelHistory = () => {
  const { t } = useLanguage();

  const historySections = [
    { 
      title: t("Divine Mission & Name", "தெய்வீகப் பணி மற்றும் பெயர்"), 
      body: t("St. Raphael is one of the seven Archangels who stand before the throne of God. His name profoundly means 'God heals' or 'Divine Healer'. He is one of only three archangels specifically mentioned by name in the Bible, alongside Michael and Gabriel.", "புனித ரபேல் ஆண்டவரின் சிம்மாசனத்திற்கு முன் நிற்கும் ஏழு அதிதூதர்களில் ஒருவர். அவருடைய பெயருக்கு 'கடவுள் குணப்படுத்துகிறார்' என்று பொருள். விவிலியத்தில் பெயரால் குறிப்பிடப்பட்டுள்ள மூன்று அதிதூதர்களில் இவரும் ஒருவர்."),
      icon: <ShieldCheck size={24} />
    },
    { 
      title: t("The Journey with Tobiah", "தோபியாவுடன் பயணம்"), 
      body: t("The primary account of St. Raphael's mission is found in the Book of Tobit. Disguised as 'Azariah', he served as a guide and protector for Tobiah on a dangerous journey. He taught Tobiah how to catch a fish and use its organs for medicinal and spiritual protection.", "தோபித்து நூலில் புனித ரபேலின் பணி விவரிக்கப்பட்டுள்ளது. 'அசரியா' என்ற பெயரில் மறைந்து, தோபியாவுக்கு ஒரு பயணத்தில் வழிகாட்டியாகவும் பாதுகாவலராகவும் இருந்தார். ஒரு மீனைப் பிடித்து அதன் உறுப்புகளை மருந்தாகவும் பாதுகாப்பாகவும் எவ்வாறு பயன்படுத்துவது என்று அவர் தோபியாவுக்குக் கற்றுக் கொடுத்தார்."),
      icon: <MapPin size={24} />
    },
    { 
      title: t("Miracles of Healing", "குணப்படுத்தும் அற்புதங்கள்"), 
      body: t("Through Raphael's guidance, Tobit's blindness was cured and Sarah was delivered from demonic affliction. After these miracles, he revealed his true identity as an Archangel sent by God to heal and deliver. He is also traditionally associated with the stirring of the healing waters at the Pool of Bethesda (John 5:1-4).", "ரபேலின் வழிகாட்டுதலின் மூலம், தோபித்துவின் குருட்டுத்தன்மை நீங்கியது மற்றும் சாராள் தீய சக்தியிலிருந்து விடுவிக்கப்பட்டார். இந்த அற்புதங்களுக்குப் பிறகு, அவர் கடவுளால் அனுப்பப்பட்ட அதிதூதர் என்பதை வெளிப்படுத்தினார். பெதஸ்தா குளத்தில் குணப்படுத்தும் நீரை அசைக்கும் தூதராகவும் அவர் பாரம்பரியமாகக் கருதப்படுகிறார்."),
      icon: <HeartPulse size={24} />
    },
    { 
      title: t("Patronage", "பாதுகாவல்"), 
      body: t("As a guide and healer, St. Raphael is invoked as the patron saint of travelers, the blind, physicians, nurses, medical workers, and happy meetings. He is a source of divine remedy and strength in times of suffering and uncertainty.", "வழிகாட்டியாகவும் குணப்படுத்துபவராகவும், புனித ரபேல் பயணிகள், பார்வையற்றோர், மருத்துவர்கள், செவிலியர்கள் மற்றும் மகிழ்ச்சியான சந்திப்புகளின் பாதுகாவலராக வேண்டப்படுகிறார். அவர் துன்ப நேரங்களில் தெய்வீக தீர்வாகவும் பலமாகவும் இருக்கிறார்."),
      icon: <Star size={24} />
    }
  ];

  return (
    <motion.div 
      className="history-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="premium-raphael-header">
        <motion.div 
          className="sacred-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          <HeartPulse size={14} />
          <span>{t("Divine Healer", "தெய்வீக குணப்படுத்துபவர்")}</span>
          <HeartPulse size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Archangel Raphael History", "புனித ரபேல் அதிதூதர் வரலாறு")}</h1>
        <p className="premium-subtitle">{t("The Divine Healer and Companion of Travelers", "தெய்வீக குணப்படுத்துபவர் மற்றும் பயணிகளின் துணை")}</p>
        <div className="header-divider" />
      </header>

      <section className="raphael-history-content">
        {historySections.map((section, idx) => (
          <motion.div 
            key={idx} 
            className="premium-history-section shadow-premium"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="section-index-wrap">
              <div className="section-index">0{idx + 1}</div>
              <div className="section-icon">{section.icon}</div>
            </div>
            <div className="section-text">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </div>
            <div className="section-accent-line" />
          </motion.div>
        ))}
      </section>

      <style>{`
        .history-page {
          max-width: 1400px;
          margin: 0 auto;
          padding: 80px 5%;
        }

        .premium-raphael-header {
          text-align: center;
          margin-bottom: 8rem;
        }

        .sacred-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.8rem;
          background: var(--bg-soft);
          color: var(--primary);
          padding: 0.6rem 2.5rem;
          border-radius: 40px;
          font-size: 0.8rem;
          font-weight: 800;
          letter-spacing: 3px;
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

        .raphael-history-content {
          display: flex;
          flex-direction: column;
          gap: 4rem;
        }

        .premium-history-section {
          background: white;
          padding: 4rem 2.5rem;
          border-radius: 40px;
          display: flex;
          gap: 3rem;
          align-items: center;
          border: 1px solid var(--glass-border);
          position: relative;
          overflow: hidden;
        }

        .section-index-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .section-index {
          font-family: var(--display-font);
          font-size: var(--fs-display);
          color: var(--bg-soft);
          font-weight: 950;
          line-height: 1;
        }

        .section-icon {
          color: var(--secondary);
        }

        .section-text {
          flex: 1;
        }

        .section-text h2 {
          font-size: var(--fs-lg);
          color: var(--primary);
          margin-bottom: 1.5rem;
        }

        .section-text p {
          font-size: var(--fs-base);
          line-height: 1.8;
          color: var(--text-muted);
          text-align: justify;
        }

        .section-accent-line {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 0;
          background: var(--secondary);
          transition: width 0.4s ease;
        }

        .premium-history-section:hover .section-accent-line {
          width: 8px;
        }

        @media (max-width: 1024px) {
          .premium-history-section { padding: 3rem 1.5rem; flex-direction: column; text-align: center; gap: 2rem; border-radius: 24px; }
          .section-index { font-size: var(--fs-xl); }
          .section-text h2 { font-size: var(--fs-md); }
        }
      `}</style>
    </motion.div>
  );
};

export default RaphaelHistory;
