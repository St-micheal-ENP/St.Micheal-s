import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import OptimizedImage from '../components/OptimizedImage';

const raphaelPhotos = [];

const RaphaelGallery = () => {
  const { t } = useLanguage();
  const [dynamicPhotos, setDynamicPhotos] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    return `${API_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(`${API_URL}/api/gallery/raphael`);
        if (response.ok) {
          const data = await response.json();
          setDynamicPhotos(data);
        }
      } catch (error) {
        console.error('Error fetching Raphael photos:', error);
      }
    };
    fetchPhotos();
  }, [API_URL]);

  const allPhotos = [...dynamicPhotos, ...raphaelPhotos];

  return (
    <motion.div
      className="rgallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="page-header">
        <h1>{t("Raphael Photos", "ரபேல் புகைப்படங்கள்")}</h1>
        <p>{t("Sacred images of Archangel Raphael, the divine healer", "திவ்ய குணமளிக்கும் ரபேல் அதிதூதரின் புனிதப் படங்கள்")}</p>
      </header>

      <div className="rgallery-grid">
        {allPhotos.map((photo, index) => (
          <motion.div
            key={index}
            className="rgallery-card shadow-premium gold-border"
            whileHover={{ scale: 1.02, rotate: index % 2 === 0 ? 1 : -1 }}
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <OptimizedImage
              src={getImageUrl(photo.src)}
              alt={photo.caption}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div className="rgallery-overlay">
              <p>{t(photo.caption, photo.caption)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .rgallery-page {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 0;
        }

        .page-header {
          text-align: center;
          margin-bottom: 6rem;
        }
 
        .page-header h1 {
          font-size: var(--fs-display);
          margin-bottom: 1.5rem;
        }
 
        .page-header p {
          font-size: var(--fs-base);
          color: var(--text-muted);
          max-width: 600px;
          margin: 0 auto;
        }

        .rgallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .rgallery-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #000;
          cursor: pointer;
        }

        .rgallery-card img {
          width: 100%;
          height: 340px;
          object-fit: cover;
          transition: transform 0.5s ease, opacity 0.4s ease;
        }

        .rgallery-card:hover img {
          transform: scale(1.08);
          opacity: 0.7;
        }

        .rgallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(0,80,60,0.82));
          padding: 1.5rem;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .rgallery-card:hover .rgallery-overlay {
          opacity: 1;
        }

        .rgallery-overlay p {
          font-family: 'Tenor Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.5px;
          font-size: var(--fs-base);
        }

        @media (max-width: 1024px) {
          .rgallery-page { padding: 40px 1.5rem; }
          .page-header { margin-bottom: 4rem; }
          .rgallery-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        }
 
        @media (max-width: 480px) {
          .rgallery-grid { grid-template-columns: 1fr; }
          .rgallery-card img { height: 280px; }
        }
      `}</style>
    </motion.div>
  );
};

export default RaphaelGallery;
