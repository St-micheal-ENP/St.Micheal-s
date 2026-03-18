import React, { useState, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from './context/LanguageContext';
import { AudioProvider } from './context/AudioContext';
import { NotificationProvider } from './context/NotificationContext';

// ── Always-eager shell components ────────────────────────────────────────────
import LoadingPage from './components/LoadingPage';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import GlobalAudioPlayer from './components/GlobalAudioPlayer';

// ── Lazy-loaded pages (each becomes its own JS chunk) ────────────────────────
const Home           = lazy(() => import('./pages/Home'));
const History        = lazy(() => import('./pages/History'));
const Schedule       = lazy(() => import('./pages/Schedule'));
const Leaders        = lazy(() => import('./pages/Leaders'));
const Welfare        = lazy(() => import('./pages/Welfare'));
const Sharing        = lazy(() => import('./pages/Sharing'));
const Events         = lazy(() => import('./pages/Events'));
const Contact        = lazy(() => import('./pages/Contact'));
const PhotoGallery   = lazy(() => import('./pages/PhotoGallery'));
const MichaelGallery = lazy(() => import('./pages/MichaelGallery'));
const RaphaelGallery = lazy(() => import('./pages/RaphaelGallery'));
const SongGallery    = lazy(() => import('./pages/SongGallery'));
const RaphaelHistory = lazy(() => import('./pages/RaphaelHistory'));
const RaphaelSchedule = lazy(() => import('./pages/RaphaelSchedule'));
const Festivals      = lazy(() => import('./pages/Festivals'));

// ── Admin panel — isolated chunk, only fetched on /admin ─────────────────────
const SuperAdmin = lazy(() => import('./pages/SuperAdmin'));

// ── Route-level suspense fallback ─────────────────────────────────────────────
const PageLoader = () => (
  <div style={{
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '1.2rem',
    fontFamily: 'Inter, sans-serif',
  }}>
    <div style={{
      width: 44,
      height: 44,
      border: '4px solid #f1f5f9',
      borderTopColor: '#8b0000',
      borderRadius: '50%',
      animation: 'spin 0.8s linear infinite',
    }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: 0 }}>Loading…</p>
  </div>
);

// ── App shell ─────────────────────────────────────────────────────────────────
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
            {/* Suspense wraps only the lazy route content */}
            <Suspense fallback={<PageLoader />}>
              <Routes location={location}>
                <Route path="/"                  element={<Home />} />
                <Route path="/history"           element={<History />} />
                <Route path="/schedule"          element={<Schedule />} />
                <Route path="/leaders"           element={<Leaders />} />
                <Route path="/welfare"           element={<Welfare />} />
                <Route path="/sharing"           element={<Sharing />} />
                <Route path="/events"            element={<Events />} />
                <Route path="/contact"           element={<Contact />} />
                <Route path="/gallery/songs"     element={<SongGallery />} />
                <Route path="/gallery/michael"   element={<MichaelGallery />} />
                <Route path="/gallery/raphael"   element={<RaphaelGallery />} />
                <Route path="/raphael/history"   element={<RaphaelHistory />} />
                <Route path="/raphael/schedule"  element={<RaphaelSchedule />} />
                <Route path="/festivals"         element={<Festivals />} />
                {/* Admin panel — fetched only when /admin is visited */}
                <Route path="/admin"             element={<SuperAdmin />} />
              </Routes>
            </Suspense>
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

// ── Root ──────────────────────────────────────────────────────────────────────
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
