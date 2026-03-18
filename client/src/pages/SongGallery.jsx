import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { Music, Play, Pause, Volume2, Sparkles, Waves } from 'lucide-react';

import songIconImg from '../assets/song Icon.png';

const SongGallery = () => {
  const { t } = useLanguage();
  const { isPlaying, currentTrackIndex, playTrack, tracks, currentTime, duration } = useAudio();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', damping: 25, stiffness: 120 } }
  };

  return (
    <motion.div 
      className="songs-experience"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Immersive Atmospheric Background */}
      <div className="atmospheric-bg">
        <div className="gradient-sphere sphere-1"></div>
        <div className="gradient-sphere sphere-2"></div>
        
        {/* Divine Light Rays */}
        <div className="light-rays">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="ray"
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                rotate: [i * 30, i * 30 + 10, i * 30]
              }}
              transition={{ duration: 8 + i, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="floating-particle"
            initial={{ 
              x: `${Math.random() * 100}vw`, 
              y: `${Math.random() * 100}vh`, 
              opacity: 0,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: ['-10vh', '110vh'],
              opacity: [0, 0.4, 0],
              x: [`${Math.random() * 100}vw`, `${Math.random() * 100}vw`]
            }}
            transition={{ 
              duration: 20 + Math.random() * 20, 
              repeat: Infinity, 
              ease: "linear",
              delay: i * 2 
            }}
          >
            <Sparkles size={Math.random() * 20 + 10} />
          </motion.div>
        ))}
      </div>

      <div className="content-wrapper">
        <header className="page-header">
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9, rotate: 5 }}
            transition={{ type: 'spring', damping: 15 }}
            className="header-icon-glow"
          >
            <img src={songIconImg} alt="Songs" className="header-custom-icon" />
            <motion.div 
              className="glow-ring"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t("Spiritual Songs & Hymns", "ஆன்மீகப் பாடல்கள் மற்றும் கீதங்கள்")}
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {t("Experience the peace of sacred music", "புனித இசையின் அமைதியை அனுபவியுங்கள்")}
          </motion.p>
        </header>

        <section className="songs-grid-container">
          <motion.div 
            className="songs-grid"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {tracks.map((song, index) => (
              <motion.div 
                key={song.id} 
                variants={itemVariants}
                className={`song-card-premium ${currentTrackIndex === index ? 'active' : ''}`}
                whileHover={{ scale: 1.02, y: -5 }}
                onClick={() => playTrack(index)}
              >
                <div className="card-inner glass-morphism shadow-premium">
                  <div className="play-indicator">
                    {currentTrackIndex === index && isPlaying ? (
                      <motion.div 
                        className="visualizer-mini"
                        animate={{ opacity: 1 }}
                      >
                        {[...Array(4)].map((_, i) => (
                          <motion.div 
                            key={i} 
                            className="v-bar"
                            animate={{ height: ['20%', '100%', '40%', '80%', '20%'] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </motion.div>
                    ) : (
                      <div className="icon-circle">
                        <Music className="m-icon" size={24} />
                      </div>
                    )}
                  </div>
                  
                  <div className="song-info">
                    <h3>{t(song.title, song.taTitle)}</h3>
                    <div className="footer-meta">
                      <span className="church-tag">{t("St. Michael's", "புனித மிக்கேல்")}</span>
                      <span className="dur">{song.durationStr}</span>
                    </div>
                  </div>

                  <button className={`action-btn ${currentTrackIndex === index && isPlaying ? 'playing' : ''}`}>
                    {currentTrackIndex === index && isPlaying ? <Pause size={28} /> : <Play size={28} />}
                  </button>
                  
                  {/* Luminous Halo for active card */}
                  {currentTrackIndex === index && isPlaying && (
                    <motion.div 
                      className="luminous-halo"
                      animate={{ 
                        scale: [1, 1.2, 1],
                        opacity: [0.3, 0.6, 0.3],
                        rotate: 360
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    />
                  )}
                  
                  {/* Progress Glow for active card */}
                  {currentTrackIndex === index && (
                    <motion.div 
                      className="progress-glow"
                      style={{ width: `${(currentTime / duration) * 100}%` }}
                    />
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* Extensive Center Animation for "Now Playing" */}
        <AnimatePresence>
          {currentTrackIndex !== null && isPlaying && (
            <motion.div 
              className="immersive-now-playing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
               <div className="visualizer-container">
                  {[...Array(20)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      className="viz-bar-large"
                      animate={{ 
                        height: [
                          `${Math.random() * 40 + 20}%`, 
                          `${Math.random() * 60 + 40}%`, 
                          `${Math.random() * 40 + 10}%`
                        ] 
                      }}
                      transition={{ 
                        duration: 0.4 + Math.random() * 0.4, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    />
                  ))}
               </div>
               <motion.div 
                className="floating-hymn-text"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 4, repeat: Infinity }}
               >
                 <Waves size={20} className="wave-icon" />
                 <span>{t("Feeling the Harmony", "நல்லிணக்கத்தை உணர்தல்")}</span>
                 <Waves size={20} className="wave-icon" />
               </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .songs-experience {
          min-height: 100vh;
          padding: 2rem 0 8rem;
          position: relative;
          overflow: hidden;
        }

        .atmospheric-bg {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -1;
          background: var(--bg-soft);
        }
 
        .gradient-sphere {
          position: absolute;
          filter: blur(80px);
          opacity: 0.2;
          border-radius: 50%;
        }
 
        .sphere-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, var(--primary) 0%, transparent 70%);
          top: -200px;
          right: -100px;
        }
 
        .sphere-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
          bottom: -100px;
          left: -100px;
        }
 
        .light-rays {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
 
        .ray {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: 200%;
          background: linear-gradient(to top, transparent, rgba(212, 175, 55, 0.1), transparent);
          transform-origin: top;
        }
 
        .floating-particle {
          position: absolute;
          color: var(--primary);
          opacity: 0.1;
          pointer-events: none;
        }
 
        .header-icon-glow {
          position: relative;
          display: inline-flex;
          padding: 1rem;
          background: white;
          border-radius: 50%;
          box-shadow: var(--shadow-premium);
          margin-bottom: 2rem;
          border: 1px solid var(--glass-border);
        }
 
        .header-custom-icon {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 50%;
        }
 
        .glow-ring {
          position: absolute;
          top: -10%;
          left: -10%;
          width: 120%;
          height: 120%;
          border: 2px solid #8b0000;
          border-radius: 50%;
        }

        .page-header {
          text-align: center;
          margin-bottom: 8rem;
        }
 
        .page-header h1 {
          font-family: 'Cinzel', serif;
          font-size: var(--fs-display);
          margin-bottom: 1rem;
          color: var(--text-main);
          letter-spacing: 2px;
        }

        .page-header p {
          color: var(--text-muted);
          font-family: var(--ui-font);
          letter-spacing: 1px;
          font-size: var(--fs-base);
        }
 
        .songs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 3rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 5%;
        }
 
        .song-card-premium {
          cursor: pointer;
          position: relative;
        }
 
        .card-inner {
          padding: 2.5rem;
          border-radius: 32px;
          background: white;
          border: 1px solid var(--glass-border);
          display: flex;
          align-items: center;
          gap: 2rem;
          transition: var(--transition-smooth);
          position: relative;
          overflow: hidden;
        }
 
        .song-card-premium.active .card-inner {
          background: var(--bg-soft);
          border-color: var(--primary);
          box-shadow: var(--shadow-premium);
        }

        .song-card-premium:hover .card-inner {
          transform: translateY(-8px);
          box-shadow: var(--shadow-ultra);
          border-color: var(--secondary);
        }
 
        .icon-circle {
          width: 70px;
          height: 70px;
          background: var(--bg-soft);
          border-radius: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--primary);
        }
 
        .visualizer-mini {
          width: 70px;
          height: 70px;
          background: var(--primary);
          border-radius: 22px;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: 4px;
          padding-bottom: 15px;
        }
 
        .v-bar {
          width: 5px;
          background: white;
          border-radius: 3px;
        }
 
        .song-info {
          flex: 1;
        }

        .song-info h3 {
          font-family: 'Inter', sans-serif;
          font-size: var(--fs-md);
          font-weight: 700;
          color: var(--text-main);
          margin: 0 0 0.5rem 0;
        }
 
        .footer-meta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .church-tag {
          font-size: 0.8rem;
          font-weight: 700;
          color: var(--secondary);
          text-transform: uppercase;
          letter-spacing: 2px;
        }
 
        .dur {
          font-size: 0.9rem;
          color: var(--text-muted);
        }
 
        .action-btn {
          background: transparent;
          border: none;
          color: var(--primary);
          cursor: pointer;
          transition: var(--transition-smooth);
        }
 
        .action-btn.playing {
          color: var(--secondary);
        }
 
        .progress-glow {
          position: absolute;
          bottom: 0;
          left: 0;
          height: 4px;
          background: var(--secondary);
          box-shadow: 0 -2px 10px rgba(139, 0, 0, 0.3);
        }
 
        .luminous-halo {
          position: absolute;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
          pointer-events: none;
          z-index: -1;
        }

        .immersive-now-playing {
          margin-top: 8rem;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2rem;
          padding-bottom: 5rem;
        }

        .visualizer-container {
          display: flex;
          align-items: flex-end;
          gap: 6px;
          height: 80px;
          padding: 2rem;
          background: rgba(139, 0, 0, 0.02);
          border-radius: 40px;
        }
 
        .viz-bar-large {
          width: 10px;
          background: var(--primary);
          border-radius: 5px;
          box-shadow: 0 4px 15px rgba(139, 0, 0, 0.1);
        }
 
        .floating-hymn-text {
          display: flex;
          align-items: center;
          gap: 1rem;
          color: #1a1a2e;
          font-style: italic;
          opacity: 0.7;
          font-family: 'Inter', sans-serif;
        }

        .wave-icon {
          color: #8b0000;
        }
 
        @media (max-width: 1024px) {
          .songs-experience { padding: 40px 0 8rem; }
          .page-header { margin-bottom: 4rem; }
          .songs-grid { grid-template-columns: 1fr; gap: 2rem; }
          .card-inner { padding: 1.5rem; }
        }

        @media (max-width: 768px) {
          .songs-grid { 
            padding: 0 1.5rem;
            gap: 1.5rem;
          }
          .card-inner { padding: 1.2rem; gap: 1.2rem; border-radius: 20px; }
          .icon-circle, .visualizer-mini { width: 50px; height: 50px; border-radius: 12px; }
          
          .immersive-now-playing { margin-top: 4rem; }
          .visualizer-container { height: 40px; gap: 4px; padding: 0.8rem; border-radius: 20px; }
          .viz-bar-large { width: 4px; }
        }
      `}</style>
    </motion.div>
  );
};

export default SongGallery;
