import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import LoadingPage from './components/LoadingPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';

// Pages
import Home from './pages/Home';
import History from './pages/History';
import Schedule from './pages/Schedule';
import Leaders from './pages/Leaders';
import Welfare from './pages/Welfare';
import Sharing from './pages/Sharing';
import Events from './pages/Events';
import Contact from './pages/Contact';
import PhotoGallery from './pages/PhotoGallery';
import MichaelGallery from './pages/MichaelGallery';
import RaphaelGallery from './pages/RaphaelGallery';
import SongGallery from './pages/SongGallery';
import RaphaelHistory from './pages/RaphaelHistory';
import RaphaelSchedule from './pages/RaphaelSchedule';
import Festivals from './pages/Festivals';
import SuperAdmin from './pages/SuperAdmin';

const AppContent = () => {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isAdminPage = location.pathname === '/admin';

  if (loading) return <LoadingPage onComplete={() => setLoading(false)} />;

  return (
    <div id="root">
      <ScrollToTop />
      <Header />
      {!isAdminPage && <Navbar />}
      {!isAdminPage && <Sidebar />}
      <main className="content-area">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.32, ease: 'easeInOut' }}
            style={{ width: '100%' }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/history" element={<History />} />
              <Route path="/schedule" element={<Schedule />} />
              <Route path="/leaders" element={<Leaders />} />
              <Route path="/welfare" element={<Welfare />} />
              <Route path="/sharing" element={<Sharing />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/gallery/songs" element={<SongGallery />} />
              <Route path="/gallery/michael" element={<MichaelGallery />} />
              <Route path="/gallery/raphael" element={<RaphaelGallery />} />
              <Route path="/raphael/history" element={<RaphaelHistory />} />
              <Route path="/raphael/schedule" element={<RaphaelSchedule />} />
              <Route path="/festivals" element={<Festivals />} />
              <Route path="/admin" element={<SuperAdmin />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <GlobalAudioPlayer />}

      <style>{`
        .content-area {
          flex: 1;
          padding: 0;
          max-width: 1400px;
          margin: 0 auto;
          width: 100%;
        }
      `}</style>
    </div>
  );
};

import { NotificationProvider } from './context/NotificationContext';

function App() {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <AudioProvider>
          <Router>
            <AppContent />
          </Router>
        </AudioProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
}

export default App;
