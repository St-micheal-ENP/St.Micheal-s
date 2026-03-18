import { motion } from 'framer-motion';
import logoIcon from '../assets/icon.png';

const LoadingPage = ({ onComplete }) => {
  return (
    <div className="loading-container">
      <motion.div 
        className="loading-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="loading-header">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            St. Michael the Archangel Church
          </motion.h1>
          <motion.h2 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Ettunayakkanpatti
          </motion.h2>
        </div>

        <div className="image-animation-container">
          <motion.div 
            className="loading-spinner-circle"
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          />
          <motion.img 
            src={logoIcon} 
            alt="St. Michael" 
            className="st-michael-image"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 1.2 }}
          />
        </div>

        <div className="loading-footer">
          <motion.h2 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            Vazhga Valamudan
          </motion.h2>
          <motion.h3 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            onAnimationComplete={() => {
              // Add a small delay so the user can actually read the final welcome message
              setTimeout(onComplete, 500);
            }}
          >
            Welcome to All
          </motion.h3>
        </div>
      </motion.div>

      <style>{`
        .loading-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          text-align: center;
          background: linear-gradient(135deg, #ffffff 0%, #fcfaf5 100%);
        }
 
        .loading-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
        }
 
        .loading-header h1 {
          font-family: var(--heading-font);
          color: var(--primary);
          font-size: 2.8rem;
          margin-bottom: 0.5rem;
          letter-spacing: 2px;
        }
 
        .loading-header h2 {
          font-family: var(--ui-font);
          color: var(--secondary);
          font-size: 1.6rem;
          text-transform: uppercase;
          letter-spacing: 5px;
          font-weight: 400;
        }
 
        .image-animation-container {
          position: relative;
          width: 300px;
          height: 300px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
 
        .st-michael-image {
          width: 240px;
          height: 240px;
          object-fit: cover;
          border-radius: 50%;
          border: 4px solid var(--secondary);
          box-shadow: 0 15px 45px rgba(139, 0, 0, 0.2);
          z-index: 2;
        }
 
        .loading-spinner-circle {
          position: absolute;
          width: 280px;
          height: 280px;
          border-radius: 50%;
          border: 3px solid transparent;
          border-top: 3px solid var(--primary);
          border-right: 3px solid var(--secondary);
          border-bottom: 3px solid var(--secondary-light);
          z-index: 1;
        }
 
        .loading-footer h2 {
          font-family: var(--heading-font);
          color: var(--primary);
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }
 
        .loading-footer h3 {
          font-family: var(--ui-font);
          color: var(--text-muted);
          font-size: 1.3rem;
          text-transform: uppercase;
          letter-spacing: 4px;
          font-weight: 300;
        }
 
        @media (max-width: 768px) {
          .loading-header h1 { font-size: 1.8rem; }
          .loading-header h2 { font-size: 1rem; letter-spacing: 3px; }
          .image-animation-container { width: 220px; height: 220px; }
          .st-michael-image { width: 180px; height: 180px; }
          .loading-spinner-circle { width: 200px; height: 200px; }
          .loading-footer h2 { font-size: 1.5rem; }
          .loading-footer h3 { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default LoadingPage;
