import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAudio } from '../context/AudioContext';
import { useLanguage } from '../context/LanguageContext';
import { Play, Pause, Volume2, VolumeX, Music, SkipBack, SkipForward, X, ExternalLink } from 'lucide-react';
import logoIcon from '../assets/icon.png';

const GlobalAudioPlayer = () => {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay, 
    volume,
    adjustVolume,
    currentTime, 
    duration, 
    seekTo,
    nextTrack,
    prevTrack
  } = useAudio();
  const { language } = useLanguage();
  const [isMinimized, setIsMinimized] = useState(true);

  if (!currentTrack) return null;

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleSeek = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  return (
    <AnimatePresence>
      {!isMinimized ? (
        <motion.div
          key="expanded-player"
          className="rectangular-player-left"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
        >
          <div className="horizontal-rect shadow-premium">
            <button className="close-player-btn" onClick={() => setIsMinimized(true)} title="Minimize">
              <X size={16} />
            </button>


            {/* Section 1: Thumbnail & Titles */}
            <div className="track-info-rect">
              <div className={`rect-thumb ${isPlaying ? 'spin-slow' : ''}`}>
                <img src={logoIcon} alt="Track" className="rect-icon-img" />
              </div>
              <div className="rect-titles">
                <span className="rect-main-title">{language === 'en' ? currentTrack.title : currentTrack.taTitle}</span>
                <span className="rect-subtitle">{language === 'en' ? 'St. Michael\'s Church' : 'புனித மிக்கேல் ஆலயம்'}</span>
              </div>
            </div>

            {/* Section 2: Controls (Back, Play, Next) */}
            <div className="playback-group">
              <button className="control-btn" onClick={prevTrack} title="Previous">
                <SkipBack size={20} fill="currentColor" />
              </button>
              <button className="rect-play-btn" onClick={togglePlay}>
                {isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
              </button>
              <button className="control-btn" onClick={nextTrack} title="Next">
                <SkipForward size={20} fill="currentColor" />
              </button>
            </div>

            {/* Section 3: Seek & Time */}
            <div className="rect-seek-area">
              <span className="rect-time">{formatTime(currentTime)}</span>
              <input 
                type="range" 
                min="0" 
                max={duration || 0} 
                step="0.1"
                value={currentTime} 
                onChange={handleSeek}
                className="rect-seek-bar"
              />
              <span className="rect-time">{formatTime(duration)}</span>
            </div>

            {/* Section 4: Volume (0-250) */}
            <div className="rect-volume-section">
              <div className={`vol-icon-btn ${volume === 0 ? 'muted' : ''}`} onClick={() => adjustVolume(volume === 0 ? 125 : 0)}>
                {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </div>
              <div className="vol-slider-container">
                <input 
                  type="range" 
                  min="0" 
                  max="250" 
                  step="1" 
                  value={volume} 
                  onChange={(e) => adjustVolume(parseFloat(e.target.value))}
                  className="rect-vol-slider"
                />
                <span className="vol-label">{Math.round(volume)}</span>
              </div>
            </div>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="minimized-icon"
          className="minimized-floating-icon"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="floating-icon-inner shadow-premium">
            <img src={logoIcon} alt="Open Player" />
            {isPlaying && (
              <motion.div 
                className="mini-playing-ring"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
          </div>
        </motion.div>
      )}

      <style>{`
        .rectangular-player-left {
          position: fixed;
          left: 2rem;
          bottom: 2rem;
          z-index: 2000;
        }

        .horizontal-rect {
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
          border-radius: 20px;
          padding: 0.8rem 1.8rem;
          border: 1.5px solid rgba(212, 175, 55, 0.5);
          display: flex;
          align-items: center;
          gap: 2rem;
          min-width: 950px;
          position: relative;
        }

        .close-player-btn {
          position: absolute;
          top: -10px;
          right: -10px;
          width: 24px;
          height: 24px;
          background: #8b0000;
          color: white;
          border: 2px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 4px 10px rgba(0,0,0,0.2);
          transition: transform 0.2s ease;
        }

        .close-player-btn:hover {
          transform: scale(1.1);
        }

        .track-info-rect {
          display: flex;
          align-items: center;
          gap: 1.2rem;
          width: 240px;
          flex-shrink: 0;
        }


        .rect-thumb {
          width: 52px;
          height: 52px;
          background: #fdf2f2;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          border: 1px solid rgba(139, 0, 0, 0.15);
          overflow: hidden;
        }

        .rect-icon-img {
          width: 85%;
          height: 85%;
          object-fit: contain;
        }

        .rect-titles {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .rect-main-title {
          font-family: 'Cinzel', serif;
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a2e;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .rect-subtitle {
          font-size: 0.75rem;
          color: #888;
          font-family: 'Inter', sans-serif;
        }

        .playback-group {
          display: flex;
          align-items: center;
          gap: 1.2rem;
        }

        .control-btn {
          background: transparent;
          border: none;
          color: #8b0000;
          cursor: pointer;
          transition: transform 0.2s ease;
        }

        .rect-play-btn {
          width: 52px;
          height: 52px;
          background: #8b0000;
          color: white;
          border: none;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 18px rgba(139, 0, 0, 0.35);
          cursor: pointer;
        }

        .rect-seek-area {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
        }

        .rect-seek-bar {
          flex: 1;
          height: 4px;
          background: #f0e6d2;
          border-radius: 2px;
          cursor: pointer;
          -webkit-appearance: none;
        }

        .rect-seek-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          background: #8b0000;
          border-radius: 50%;
          border: 2px solid white;
        }

        .rect-volume-section {
          display: flex;
          align-items: center;
          gap: 1rem;
          border-left: 1px solid #f0e6d2;
          padding-left: 1.5rem;
        }

        .rect-vol-slider {
          width: 100px;
          height: 4px;
          background: #f0e6d2;
          border-radius: 2px;
          -webkit-appearance: none;
        }

        .rect-vol-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 10px;
          height: 10px;
          background: #8b0000;
          border-radius: 50%;
        }

        .vol-label {
          font-size: 0.8rem;
          font-family: monospace;
          color: #8b0000;
          min-width: 25px;
        }

        /* Minimized Floating Icon */
        .minimized-floating-icon {
          position: fixed;
          left: 2rem;
          bottom: 2rem;
          z-index: 2000;
          cursor: pointer;
        }

        .floating-icon-inner {
          width: 60px;
          height: 60px;
          background: white;
          border-radius: 50%;
          border: 2.5px solid #d4af37;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 8px;
          position: relative;
        }

        .floating-icon-inner img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .mini-playing-ring {
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          border: 2px solid #8b0000;
          border-radius: 50%;
          z-index: -1;
        }

        .spin-slow {
          animation: rotate 12s linear infinite;
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1024px) {
          .horizontal-rect { min-width: 600px; gap: 1rem; }
          .rect-volume-section { display: none; }
        }

        @media (max-width: 768px) {
          .rectangular-player-left { 
            left: 0; 
            right: 0; 
            bottom: 0; 
            width: 100%;
          }
          .horizontal-rect { 
             min-width: auto; 
             width: 100%; 
             gap: 0.5rem; 
             padding: 1rem; 
             flex-direction: column;
             align-items: center;
             height: auto;
             border-radius: 24px 24px 0 0;
             border-bottom: none;
             box-shadow: 0 -10px 30px rgba(0,0,0,0.1);
          }
          .track-info-rect { 
            width: 100%; 
            justify-content: center; 
            gap: 0.8rem;
            margin-bottom: 0.5rem;
          }
          .rect-titles { align-items: center; }
          .rect-main-title { font-size: 0.9rem; }
          .rect-thumb { width: 44px; height: 44px; }
          
          .rect-seek-area { 
            width: 100%; 
            padding: 0 5px;
            gap: 0.5rem;
          }
          .rect-time { font-size: 0.7rem; }
          
          .playback-group {
            gap: 2rem;
            margin: 0.5rem 0;
          }
          .rect-play-btn { width: 48px; height: 48px; }
          
          .rect-volume-section {
            display: flex;
            border-left: none;
            padding-left: 0;
            width: 100%;
            justify-content: center;
            margin-top: 0.5rem;
          }
          .rect-vol-slider {
            width: 120px;
          }

          .minimized-floating-icon {
            left: 1rem;
            bottom: 1rem;
          }
          .floating-icon-inner {
            width: 50px;
            height: 50px;
          }
        }
      `}</style>
    </AnimatePresence>
  );
};

export default GlobalAudioPlayer;
