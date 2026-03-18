import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Image as ImageIcon, Camera, Star } from 'lucide-react';

const imageModules = import.meta.glob('../assets/*.{png,jpg,jpeg,svg,webp}', { eager: true });

const PhotoGallery = () => {
  const { t } = useLanguage();

  const photos = Object.entries(imageModules)
    .filter(([path]) => !path.includes('vite.svg') && !path.includes('react.svg'))
    .map(([path, module]) => {
      const fileName = path.split('/').pop().split('.')[0];
      return {
        src: module.default,
        title: t(fileName, fileName)
      };
    });

  return (
    <motion.div 
      className="gallery-page"
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
          <Camera size={14} />
          <span>{t("Captured Moments", "சிறப்புத் தருணங்கள்")}</span>
          <Camera size={14} />
        </motion.div>
        <h1 className="premium-title">{t("Photo Gallery", "புகைப்படத் தொகுப்பு")}</h1>
        <p className="premium-subtitle">{t("Moments of faith and celebration at Ettunayakkanpatti", "எட்டுநாயக்கன்பட்டியில் நம்பிக்கை மற்றும் கொண்டாட்டத்தின் தருணங்கள்")}</p>
        <div className="header-divider" />
      </header>

      <div className="photo-premium-grid">
        {photos.map((photo, index) => (
          <motion.div 
            key={index} 
            className="premium-photo-card shadow-ultra"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
          >
            <div className="card-visual">
              <img src={photo.src} alt={photo.title} className="gallery-img" />
              <div className="sacred-ring" />
              <div className="gallery-overlay">
                <Star size={18} className="overlay-star" />
                <p className="overlay-caption">{photo.title}</p>
              </div>
            </div>
            <div className="card-bottom-bar" />
          </motion.div>
        ))}
      </div>

      <style>{`
        .gallery-page {
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

        .photo-premium-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: clamp(1.5rem, 4vw, 2.5rem);
        }

        .premium-photo-card {
          position: relative;
          background: white;
          border-radius: 32px;
          overflow: hidden;
          border: 1px solid var(--glass-border);
          cursor: pointer;
        }

        .card-visual {
          position: relative;
          aspect-ratio: 1/1;
          overflow: hidden;
        }

        .gallery-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 1.2s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .sacred-ring {
          position: absolute;
          inset: 15px;
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 24px;
          opacity: 0;
          transform: scale(1.1);
          transition: all 0.6s ease;
          pointer-events: none;
        }

        .premium-photo-card:hover .sacred-ring {
          opacity: 1;
          transform: scale(1);
        }

        .premium-photo-card:hover .gallery-img {
          transform: scale(1.08);
        }

        .gallery-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.85), transparent 70%);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 2.5rem;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .premium-photo-card:hover .gallery-overlay {
          opacity: 1;
        }

        .overlay-star {
          color: var(--secondary);
          margin-bottom: 1rem;
        }

        .overlay-caption {
          color: white;
          font-size: var(--fs-base);
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          line-height: 1.4;
        }

        .card-bottom-bar {
          height: 4px;
          background: var(--secondary);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .premium-photo-card:hover .card-bottom-bar {
          opacity: 1;
        }

        @media (max-width: 1024px) {
          .gallery-page { padding: 40px 1.5rem; }
          .page-header { margin-bottom: 4rem; }
          .premium-photo-card { border-radius: 24px; }
          .gallery-overlay { padding: 1.5rem; }
        }
 
        @media (max-width: 480px) {
          .photo-premium-grid { grid-template-columns: 1fr; }
          .gallery-img { aspect-ratio: 4/3; }
        }
      `}</style>
    </motion.div>
  );
};

export default PhotoGallery;
