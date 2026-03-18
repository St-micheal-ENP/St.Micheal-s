import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import OptimizedImage from '../components/OptimizedImage';

const michaelPhotos = [];

const MichaelGallery = () => {
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
        const response = await fetch(`${API_URL}/api/gallery/michael`);
        if (response.ok) {
          const data = await response.json();
          setDynamicPhotos(data);
        }
      } catch (error) {
        console.error('Error fetching Michael photos:', error);
      }
    };
    fetchPhotos();
  }, [API_URL]);

  const allPhotos = [...dynamicPhotos, ...michaelPhotos];

  return (
    <motion.div
      className="mgallery-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <header className="page-header">
        <h1>{t("Michael Photos", "மிக்கேல் புகைப்படங்கள்")}</h1>
        <p>{t("Sacred images of Archangel Michael, our patron and protector", "நம் திருமைகேல் அதிதூதரின் புனிதப் படங்கள்")}</p>
      </header>

      <div className="mgallery-grid">
        {allPhotos.map((photo, index) => (
          <motion.div
            key={index}
            className="mgallery-card shadow-premium gold-border"
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
            <div className="mgallery-overlay">
              <p>{t(photo.caption, photo.caption)}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <style>{`
        .mgallery-page {
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

        .mgallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
        }

        .mgallery-card {
          position: relative;
          border-radius: 14px;
          overflow: hidden;
          background: #000;
          cursor: pointer;
        }

        .mgallery-card img {
          width: 100%;
          height: 340px;
          object-fit: cover;
          transition: transform 0.5s ease, opacity 0.4s ease;
        }

        .mgallery-card:hover img {
          transform: scale(1.08);
          opacity: 0.7;
        }

        .mgallery-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(transparent, rgba(139,0,0,0.82));
          padding: 1.5rem;
          color: white;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .mgallery-card:hover .mgallery-overlay {
          opacity: 1;
        }

        .mgallery-overlay p {
          font-family: 'Tenor Sans', sans-serif;
          font-weight: 700;
          letter-spacing: 0.5px;
          font-size: var(--fs-base);
        }

        @media (max-width: 1024px) {
          .mgallery-page { padding: 40px 1.5rem; }
          .page-header { margin-bottom: 4rem; }
          .mgallery-grid { grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.5rem; }
        }
 
        @media (max-width: 480px) {
          .mgallery-grid { grid-template-columns: 1fr; }
          .mgallery-card img { height: 280px; }
        }
      `}</style>
    </motion.div>
  );
};

export default MichaelGallery;
