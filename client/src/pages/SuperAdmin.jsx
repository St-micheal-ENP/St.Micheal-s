import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { LayoutDashboard, Users, MessageCircle, Clock, Search, Trash2, LogOut, Lock, Calendar, PlusCircle, Heart, HeartPulse, Eye, EyeOff, Shield, Image as ImageIcon } from 'lucide-react';
import { io } from 'socket.io-client';
import API_URL, { getApiUrl, getImageUrl } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import churchLogo from '../assets/icon.png';
import OptimizedImage from '../components/OptimizedImage';

const SuperAdmin = () => {
  const { t } = useLanguage();
  const { showNotification } = useNotification();

  const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{ zIndex: 3000 }}
          onClick={onCancel}
        >
          <motion.div 
            className="modal-card confirm-modal shadow-ultra"
            initial={{ scale: 0.9, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.9, y: 30, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 400 }}
            onClick={e => e.stopPropagation()}
            style={{ 
              maxWidth: '400px', 
              padding: '2rem', 
              borderRadius: '24px',
              textAlign: 'center'
            }}
          >
            <div className="confirm-icon-wrapper" style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '50%', 
              background: '#fff1f2', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 1.5rem',
              color: '#e11d48'
            }}>
              <Trash2 size={32} />
            </div>
            
            <h3 style={{ 
              fontSize: '1.4rem', 
              marginBottom: '0.8rem', 
              color: '#1e293b',
              fontWeight: 800 
            }}>
              {title || t('Confirm Action', 'செயலை உறுதிப்படுத்தவும்')}
            </h3>
            
            <p style={{ 
              color: '#64748b', 
              lineHeight: '1.6', 
              marginBottom: '2rem',
              fontSize: '0.95rem'
            }}>
              {message}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <button 
                className="cancel-btn-alt" 
                onClick={onCancel}
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0',
                  background: 'white',
                  color: '#64748b',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: '0.2s'
                }}
              >
                {t('Cancel', 'ரத்து')}
              </button>
              <button 
                className="confirm-btn-alt" 
                onClick={() => { onConfirm(); onCancel(); }}
                style={{
                  padding: '0.8rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#e11d48',
                  color: 'white',
                  fontWeight: 700,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(225, 29, 72, 0.2)',
                  transition: '0.2s'
                }}
              >
                {t('Confirm', 'உறுதி')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  const [submissions, setSubmissions] = useState([]);
  const [events, setEvents] = useState([]);
  const [welfare, setWelfare] = useState([]);
  const [villageLeaders, setVillageLeaders] = useState([]);
  const [sharing, setSharing] = useState([]);
  const [michaelGallery, setMichaelGallery] = useState([]);
  const [raphaelGallery, setRaphaelGallery] = useState([]);
  const [activeTab, setActiveTab] = useState('submissions'); // 'submissions', 'events', 'welfare', 'sharing' or 'village-leaders'
  const [activeGallerySubTab, setActiveGallerySubTab] = useState('michael');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(() => localStorage.getItem('adminAuth') === 'true');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null); // For viewing submissions
  
  // Security State
  const [failedAttempts, setFailedAttempts] = useState(() => Number(localStorage.getItem('failedAttempts')) || 0);
  const [lockoutUntil, setLockoutUntil] = useState(() => Number(localStorage.getItem('lockoutUntil')) || 0);
  const [remainingLockout, setRemainingLockout] = useState(0);
  
  const [newEvent, setNewEvent] = useState({
    title: '', title_ta: '',
    tag: '', tag_ta: '',
    description: '', description_ta: '',
  });
  const [newMember, setNewMember] = useState({
    name: '', name_ta: '',
    phone: '', designation: '', designation_ta: '',
    group: 'general'
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [leaderEdits, setLeaderEdits] = useState({}); // Tracking pending changes for welfare leaders
  const [vLeaderEdits, setVLeaderEdits] = useState({}); // Tracking pending changes for village leaders
  const [editingIds, setEditingIds] = useState(new Set()); // Tracks which member cards are in edit mode
  const [savingIds, setSavingIds] = useState(new Set()); // Tracks which cards are currently saving
  const [editingVIds, setEditingVIds] = useState(new Set()); // Tracks village leader edit mode
  const [savingVIds, setSavingVIds] = useState(new Set()); // Tracks village leader save state
  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });


  const toggleEditMode = (id) => {
    setEditingIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Cancel any pending edits for this member
        setLeaderEdits(le => { const n = {...le}; delete n[id]; return n; });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveMemberCard = async (id) => {
    const changes = leaderEdits[id];
    if (!changes || Object.keys(changes).length === 0) return;
    setSavingIds(prev => new Set(prev).add(id));
    try {
      await handleUpdateMember(id, changes);
      // Exit edit mode after saving
      setEditingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } finally {
      setSavingIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  const toggleEditVMode = (id) => {
    setEditingVIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        setVLeaderEdits(ve => { const n = {...ve}; delete n[id]; return n; });
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSaveVLeaderCard = async (id) => {
    const changes = vLeaderEdits[id];
    if (!changes || Object.keys(changes).length === 0) return;
    setSavingVIds(prev => new Set(prev).add(id));
    try {
      await handleUpdateVillageLeader(id, changes);
      setEditingVIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    } finally {
      setSavingVIds(prev => { const n = new Set(prev); n.delete(id); return n; });
    }
  };

  // Security Login
  const handleLogin = (e) => {
    e.preventDefault();
    
    const now = Date.now();
    if (lockoutUntil > now) {
      const waitMins = Math.ceil((lockoutUntil - now) / 60000);
      setError(t(`Too many failed attempts. Please wait ${waitMins} minutes.`, `அதிகப்படியான தோல்விகள். தயவுசெய்து ${waitMins} நிமிடங்கள் காத்திருக்கவும்.`));
      return;
    }

    if (password === 'Micheal@2004') {
      setIsAuthenticated(true);
      localStorage.setItem('adminAuth', 'true');
      setFailedAttempts(0);
      setLockoutUntil(0);
      localStorage.removeItem('failedAttempts');
      localStorage.removeItem('lockoutUntil');
      setError('');
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem('failedAttempts', newAttempts);
      
      if (newAttempts >= 3) {
        const lockoutTime = Date.now() + 5 * 60 * 1000; // 5 minutes
        setLockoutUntil(lockoutTime);
        localStorage.setItem('lockoutUntil', lockoutTime);
        setError(t("3 failed attempts. Locked for 5 minutes.", "3 தோல்வியுற்ற முயற்சிகள். 5 நிமிடங்கள் முடக்கப்பட்டது."));
      } else {
        setError(t(`Incorrect password. ${3 - newAttempts} attempts remaining.`, `தவறான கடவுச்சொல். இன்னும் ${3 - newAttempts} முயற்சிகள் உள்ளன.`));
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('adminAuth');
  };

  // Lockout Timer Effect
  useEffect(() => {
    if (lockoutUntil <= Date.now()) return;

    const timer = setInterval(() => {
      const now = Date.now();
      if (now >= lockoutUntil) {
        setLockoutUntil(0);
        localStorage.removeItem('lockoutUntil');
        setFailedAttempts(0);
        localStorage.removeItem('failedAttempts');
        setError('');
        clearInterval(timer);
      } else {
        setRemainingLockout(Math.ceil((lockoutUntil - now) / 1000));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lockoutUntil]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubmissions();
      fetchEvents();
      fetchWelfare();
      fetchVillageLeaders();
      fetchSharing();
      fetchGallery('michael');
      fetchGallery('raphael');

      const socket = io(API_URL || undefined);
      socket.on('new_submission', (newSub) => {
        setSubmissions(prev => [newSub, ...prev]);
      });
      socket.on('events_updated', (updatedEvents) => {
        setEvents(updatedEvents);
      });
      socket.on('welfare_updated', (updatedWelfare) => {
        setWelfare(updatedWelfare);
      });
      socket.on('leaders_updated', (updatedLeaders) => {
        setVillageLeaders(updatedLeaders);
      });
      socket.on('sharing_updated', (updatedSharing) => {
        setSharing(updatedSharing);
      });
      socket.on('sharing_deleted', (id) => {
        setSharing(prev => prev.filter(s => String(s.id) !== String(id)));
      });
      socket.on('gallery_updated', ({ category, photos }) => {
        if (category === 'michael') setMichaelGallery(photos);
        else setRaphaelGallery(photos);
      });

      socket.on('new_submission_deleted', (deletedId) => {
        setSubmissions(prev => prev.filter(sub => String(sub.id) !== String(deletedId)));
        if (selectedSubmission && String(selectedSubmission.id) === String(deletedId)) {
          setSelectedSubmission(null);
        }
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated]);

  const fetchSubmissions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(getApiUrl('/api/admin/contacts'));
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setSubmissions(data.reverse());
    } catch (error) {
      console.error('Fetch submissions error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSubmission = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: t('Delete Submission', 'கோரிக்கையை நீக்கு'),
      message: t('Are you sure you want to delete this submission?', 'இந்த கோரிக்கையை நீக்க விரும்புகிறீர்களா?'),
      onConfirm: async () => {
        console.log('Attempting to delete submission with ID:', id);
        try {
          const response = await fetch(getApiUrl(`/api/admin/contacts/${id}`), { method: 'DELETE' });
          if (response.ok) {
            setSubmissions(prev => prev.filter(sub => String(sub.id) !== String(id)));
            if (selectedSubmission && String(selectedSubmission.id) === String(id)) {
              setSelectedSubmission(null);
            }
          } else {
            const errData = await response.json().catch(() => ({}));
            showNotification(t(`Failed to delete: ${errData.message || 'Server error'}`, `நீக்குவதில் தோல்வி: ${errData.message || 'பிணைய பிழை'}`), 'error');
          }
        } catch (error) {
          console.error('Delete submission network error:', error);
          alert(t("Network error. Please check your connection.", "பிணைய பிழை. உங்கள் இணைப்பைச் சரிபார்க்கவும்."));
        }
      }
    });
  };

  const fetchEvents = async () => {
    try {
      const response = await fetch(getApiUrl('/api/events'));
      const data = await response.json();
      setEvents(data);
    } catch (error) {
      console.error('Fetch events error:', error);
    }
  };

  const fetchSharing = async () => {
    try {
      const response = await fetch(getApiUrl('/api/sharing'));
      if (response.ok) {
        const data = await response.json();
        setSharing(data);
      }
    } catch (error) {
      console.error('Error fetching sharing:', error);
    }
  };

  const handleDeleteSharing = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: t("Delete Sharing Entry", "பகிர்வு பதிவை நீக்கு"),
      message: t("Are you sure you want to delete this sharing entry?", "இந்த பகிர்வு பதிவை நீக்க வேண்டுமா?"),
      onConfirm: async () => {
        try {
          const response = await fetch(getApiUrl(`/api/sharing/${id}`), { method: 'DELETE' });
          if (response.ok) {
            setSharing(prev => prev.filter(s => String(s.id) !== String(id)));
          } else {
            showNotification(t("Failed to delete sharing entry", "பகிர்வு பதிவை நீக்க முடியவில்லை"), 'error');
          }
        } catch (error) {
          console.error('Error deleting sharing:', error);
          showNotification(t("Server error while deleting", "நீக்கும்போது சர்வர் பிழை ஏற்பட்டது"), 'error');
        }
      }
    });
  };

  const fetchWelfare = async () => {
    try {
      const response = await fetch(getApiUrl('/api/welfare'));
      const data = await response.json();
      setWelfare(data);
    } catch (error) {
      console.error('Fetch welfare error:', error);
    }
  };

  const fetchVillageLeaders = async () => {
    try {
      const response = await fetch(getApiUrl('/api/leaders'));
      const data = await response.json();
      setVillageLeaders(data);
    } catch (error) {
      console.error('Fetch village leaders error:', error);
    }
  };

  const fetchGallery = async (category) => {
    try {
      const response = await fetch(getApiUrl(`/api/gallery/${category}`));
      if (response.ok) {
        const data = await response.json();
        if (category === 'michael') setMichaelGallery(data);
        else setRaphaelGallery(data);
      }
    } catch (error) {
      console.error(`Error fetching ${category} gallery:`, error);
    }
  };

  const handleGalleryUpload = async (e, category) => {
    e.preventDefault();
    const caption = e.target.caption.value;
    const file = e.target.photo.files[0];

    if (!file) {
      showNotification(t("Please select a photo", "தயவுசெய்து ஒரு புகைப்படத்தைத் தேர்ந்தெடுக்கவும்"), 'error');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('caption', caption);
      formData.append('image', file);

      const response = await fetch(getApiUrl(`/api/gallery/${category}`), {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        showNotification(t("Photo uploaded successfully!", "புகைப்படம் வெற்றிகரமாக பதிவேற்றப்பட்டது!"), 'success');
        e.target.reset();
        fetchGallery(category);
      } else {
        showNotification(t("Upload failed", "பதிவேற்றம் தோல்வியடைந்தது"), 'error');
      }
    } catch (error) {
      console.error('Gallery upload error:', error);
      showNotification(t("Server error", "சர்வர் பிழை"), 'error');
    }
  };

  const handleDeleteGalleryPhoto = async (category, id) => {
    setConfirmConfig({
      isOpen: true,
      title: t("Delete Photo", "புகைப்படத்தை நீக்கு"),
      message: t("Are you sure you want to delete this photo?", "இந்த புகைப்படத்தை நீக்க வேண்டுமா?"),
      onConfirm: async () => {
        try {
          const response = await fetch(getApiUrl(`/api/gallery/${category}/${id}`), { method: 'DELETE' });
          if (response.ok) {
            fetchGallery(category);
          } else {
            showNotification(t("Failed to delete photo", "புகைப்படத்தை நீக்க முடியவில்லை"), 'error');
          }
        } catch (error) {
          console.error('Delete gallery error:', error);
        }
      }
    });
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', newEvent.title);
      formData.append('title_ta', newEvent.title_ta);
      formData.append('tag', newEvent.tag);
      formData.append('tag_ta', newEvent.tag_ta);
      formData.append('description', newEvent.description);
      formData.append('description_ta', newEvent.description_ta);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      const response = await fetch(getApiUrl('/api/events'), {
        method: 'POST',
        body: formData // Fetch handles FormData headers automatically
      });
      
      if (response.ok) {
        fetchEvents();
        setNewEvent({ title: '', title_ta: '', tag: '', tag_ta: '', description: '', description_ta: '' });
        setImageFile(null);
        setImagePreview(null);
        showNotification(t("Event uploaded successfully!", "நிகழ்வு வெற்றிகரமாக பதிவேற்றப்பட்டது!"), 'success');
      } else {
        const errData = await response.json();
        showNotification(t(`Upload failed: ${errData.message}`, `பதிவேற்றம் தோல்வியடைந்தது: ${errData.message}`), 'error');
      }
    } catch (error) {
      console.error('Add event error:', error);
      showNotification(t("Network error while uploading. Please check connection.", "பதிவேற்றும்போது பிணைய பிழை. இணைப்பைச் சரிபார்க்கவும்."), 'error');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteEvent = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: t('Delete Event', 'நிகழ்வை நீக்கு'),
      message: t('Are you sure you want to delete this event?', 'இந்த நிகழ்வை நீக்க விரும்புகிறீர்களா?'),
      onConfirm: async () => {
        try {
          const response = await fetch(getApiUrl(`/api/events/${id}`), { method: 'DELETE' });
          if (response.ok) {
            fetchEvents();
          }
        } catch (error) {
          console.error('Delete event error:', error);
        }
      }
    });
  };

  const handleDeleteMember = async (id) => {
    setConfirmConfig({
      isOpen: true,
      title: t('Remove Member', 'உறுப்பினரை நீக்கு'),
      message: t('Are you sure you want to delete this member?', 'இந்த உறுப்பினரை நீக்க விரும்புகிறீர்களா?'),
      onConfirm: async () => {
        try {
          const response = await fetch(getApiUrl(`/api/welfare/${id}`), { method: 'DELETE' });
          if (response.ok) {
            fetchWelfare();
          }
        } catch (error) {
          console.error('Delete member error:', error);
        }
      }
    });
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(newMember).forEach(key => formData.append(key, newMember[key]));
      if (imageFile) formData.append('image', imageFile);

      const response = await fetch(getApiUrl('/api/welfare'), {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        fetchWelfare();
        setNewMember({ name: '', name_ta: '', phone: '', designation: '', designation_ta: '', group: 'general' });
        setImageFile(null);
        setImagePreview(null);
        showNotification(t("Member added successfully!", "உறுப்பினர் வெற்றிகரமாக சேர்க்கப்பட்டார்!"), 'success');
      }
    } catch (error) {
      console.error('Add member error:', error);
    }
  };

  const handleUpdateMember = async (id, updatedData, isFile = false) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] !== undefined) formData.append(key, updatedData[key]);
      });

      const response = await fetch(getApiUrl(`/api/welfare/${id}`), {
        method: 'PUT',
        body: formData
      });
      
      if (response.ok) {
        fetchWelfare();
        // Clear local edits for this leader on success
        if (!isFile) {
          setLeaderEdits(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Update member error:', error);
    }
  };

  const handleLeaderChange = (id, field, value) => {
    setLeaderEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveLeader = async (id) => {
    const changes = leaderEdits[id];
    if (!changes) return;
    
    // Check if there's a pending image for this id
    // (Actually, photos are handled instantly in the current UI, 
    // but the user wants a more unified modification flow. 
    // I'll stick to instant photo update for now but allow text updates to be saved.)
    
    await handleUpdateMember(id, changes);
    showNotification(t("Leader details updated!", "தலைவர் விவரங்கள் புதுப்பிக்கப்பட்டன!"), 'success');
  };

  const handleUpdateVillageLeader = async (id, updatedData, isFile = false) => {
    try {
      const formData = new FormData();
      Object.keys(updatedData).forEach(key => {
        if (updatedData[key] !== undefined) formData.append(key, updatedData[key]);
      });

      const response = await fetch(getApiUrl(`/api/leaders/${id}`), {
        method: 'PUT',
        body: formData
      });

      if (response.ok) {
        fetchVillageLeaders();
        if (!isFile) {
          setVLeaderEdits(prev => {
            const next = { ...prev };
            delete next[id];
            return next;
          });
        }
      }
    } catch (error) {
      console.error('Update village leader error:', error);
    }
  };

  const handleVLeaderChange = (id, field, value) => {
    setVLeaderEdits(prev => ({
      ...prev,
      [id]: {
        ...(prev[id] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveVLeader = async (id) => {
    const changes = vLeaderEdits[id];
    if (!changes) return;
    await handleUpdateVillageLeader(id, changes);
    showNotification(t("Village leader details updated!", "ஊர் தலைவர் விவரங்கள் புதுப்பிக்கப்பட்டன!"), 'success');
  };

  const filteredSubmissions = submissions.filter(sub => 
    sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sub.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="admin-login-overlay">
        <div className="sacred-glow-bg"></div>
        <div className="sacred-particles"></div>
        
        <motion.div 
          className="login-card-container"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="login-glass-card shadow-ultra">
            <motion.div 
              className="login-header"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="icon-wrapper">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <Shield size={48} className="lock-icon" />
                </motion.div>
                <div className="icon-pulse"></div>
              </div>
              <h2>{t("Divine Access", "நிர்வாகி அணுகல்")}</h2>
              <p className="subtitle">{t("Authorized Personnel Only", "அங்கீகரிக்கப்பட்ட ஊழியர்களுக்கு மட்டும்")}</p>
            </motion.div>

            <form onSubmit={handleLogin} className="login-form">
              <motion.div 
                className="input-wrapper"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <label>{t("Master Key", "ரகசிய கடவுச்சொல்")}</label>
                <div className="password-input-container">
                  <Lock size={18} className="field-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button 
                    type="button" 
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {error && (
                <motion.div 
                  className="error-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <p className="error-text">{error}</p>
                  {lockoutUntil > Date.now() && (
                    <div className="lockout-countdown">
                      <Clock size={14} />
                      <span>
                        {Math.floor(remainingLockout / 60)}:{(remainingLockout % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}

              <motion.button 
                type="submit" 
                className={`login-btn-premium ${lockoutUntil > Date.now() ? 'disabled' : ''}`}
                disabled={lockoutUntil > Date.now()}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                whileHover={lockoutUntil > Date.now() ? {} : { scale: 1.02, boxShadow: "0 10px 30px rgba(139, 0, 0, 0.3)" }}
                whileTap={lockoutUntil > Date.now() ? {} : { scale: 0.98 }}
              >
                <span>{lockoutUntil > Date.now() ? t("Locked", "முடக்கப்பட்டது") : t("Connect to Sanctuary", "இணைக்கவும்")}</span>
                <div className="btn-glow"></div>
              </motion.button>
            </form>
          </div>
          
          <motion.p 
            className="login-footer-note"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            © 2024 St. Michael's Church • Ettunayakkanpatti
          </motion.p>
        </motion.div>

        <style>{`
          .admin-login-overlay {
            position: fixed;
            inset: 0;
            background: #0a0a0c;
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 2000;
            overflow: hidden;
          }

          .sacred-glow-bg {
            position: absolute;
            width: 150vw;
            height: 150vh;
            background: radial-gradient(circle at 30% 30%, rgba(139, 0, 0, 0.15) 0%, transparent 40%),
                        radial-gradient(circle at 70% 70%, rgba(212, 175, 55, 0.1) 0%, transparent 40%);
            animation: rotateBG 20s linear infinite;
          }

          @keyframes rotateBG {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }

          .login-card-container {
            width: 100%;
            max-width: 440px;
            padding: 2rem;
            z-index: 10;
          }

          .login-glass-card {
            background: rgba(255, 255, 255, 0.03);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            border-radius: 40px;
            padding: 3.5rem 2.5rem;
            border: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            position: relative;
            box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
          }

          .icon-wrapper {
            position: relative;
            margin-bottom: 2rem;
            display: inline-block;
          }

          .lock-icon {
            color: var(--secondary);
            filter: drop-shadow(0 0 15px rgba(212, 175, 55, 0.4));
          }

          .icon-pulse {
            position: absolute;
            inset: -10px;
            border: 2px solid var(--secondary);
            border-radius: 50%;
            opacity: 0;
            animation: iconPulse 3s ease-out infinite;
          }

          @keyframes iconPulse {
            0% { transform: scale(0.8); opacity: 0; }
            50% { opacity: 0.3; }
            100% { transform: scale(1.5); opacity: 0; }
          }

          .login-header h2 {
            color: white;
            font-size: 2rem;
            margin: 0;
            font-family: var(--heading-font);
            letter-spacing: 1px;
          }

          .subtitle {
            color: rgba(255, 255, 255, 0.5);
            font-size: 0.9rem;
            margin-top: 0.5rem;
            text-transform: uppercase;
            letter-spacing: 2px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 2rem;
            margin-top: 3rem;
          }

          .input-wrapper {
            text-align: left;
          }

          .input-wrapper label {
            display: block;
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 0.8rem;
            padding-left: 0.5rem;
          }

          .password-input-container {
            position: relative;
            display: flex;
            align-items: center;
          }

          .field-icon {
            position: absolute;
            left: 1.25rem;
            color: rgba(255, 255, 255, 0.3);
            transition: 0.3s;
          }

          .password-input-container input {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 1.2rem 3.5rem;
            color: white;
            font-size: 1.1rem;
            transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .password-input-container input:focus {
            outline: none;
            background: rgba(255, 255, 255, 0.08);
            border-color: var(--secondary);
            box-shadow: 0 0 20px rgba(212, 175, 55, 0.15);
          }

          .password-input-container input:focus + .field-icon {
            color: var(--secondary);
          }

          .toggle-password {
            position: absolute;
            right: 1.25rem;
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.3);
            cursor: pointer;
            padding: 0.5rem;
            transition: 0.3s;
          }

          .toggle-password:hover {
            color: white;
          }

          .error-container {
            background: rgba(255, 77, 77, 0.1);
            padding: 1rem;
            border-radius: 12px;
            border: 1px solid rgba(255, 77, 77, 0.2);
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            align-items: center;
          }

          .error-text {
            color: #ff4d4d;
            font-size: 0.85rem;
            margin: 0;
            text-align: center;
          }

          .lockout-countdown {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #ff4d4d;
            font-size: 1.2rem;
            font-weight: 800;
            font-family: monospace;
          }

          .login-btn-premium {
            background: var(--primary);
            color: white;
            padding: 1.2rem;
            border: none;
            border-radius: 16px;
            font-weight: 800;
            font-size: 1rem;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
            letter-spacing: 1px;
            text-transform: uppercase;
            transition: 0.3s;
          }

          .login-btn-premium.disabled {
            background: rgba(255, 255, 255, 0.05);
            color: rgba(255, 255, 255, 0.2);
            cursor: not-allowed;
            border: 1px solid rgba(255, 255, 255, 0.05);
          }

          .btn-glow {
            position: absolute;
            width: 100%;
            height: 100%;
            background: radial-gradient(circle at center, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
            top: 100%;
            transition: 0.3s;
          }

          .login-btn-premium:hover .btn-glow {
            top: 0;
          }

          .login-footer-note {
            color: rgba(255, 255, 255, 0.3);
            text-align: center;
            font-size: 0.8rem;
            margin-top: 2rem;
          }

          @media (max-width: 480px) {
            .login-card-container { padding: 1rem; }
            .login-glass-card { padding: 2.5rem 1.5rem; }
            .login-header h2 { font-size: 1.5rem; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <motion.div 
      className="admin-dashboard-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <header className="admin-header">
        <div className="admin-meta">
          <div className="admin-logo-wrap">
            <img src={churchLogo} alt="St. Michael's" className="admin-logo-img" />
          </div>
          <div className="admin-brand-text">
            <span className="admin-brand-top">{t("St. Michael's", "புனித மிக்கேல்")}</span>
            <span className="admin-brand-bottom">{t("Super Admin", "கட்டுப்பாட்டு அறை")}</span>
          </div>
        </div>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'submissions' ? 'active' : ''}`}
            onClick={() => setActiveTab('submissions')}
          >
            <MessageCircle size={18} />
            {t("Submissions", "கோரிக்கைகள்")}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
            onClick={() => setActiveTab('events')}
          >
            <Calendar size={18} />
            {t("Events", "நிகழ்வுகள்")}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'welfare' ? 'active' : ''}`}
            onClick={() => setActiveTab('welfare')}
          >
            <Heart size={18} />
            {t("Welfare", "நற்பணி")}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'village-leaders' ? 'active' : ''}`}
            onClick={() => setActiveTab('village-leaders')}
          >
            <Users size={18} />
            {t("Village Leaders", "ஊர் தலைவர்கள்")}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'sharing' ? 'active' : ''}`}
            onClick={() => setActiveTab('sharing')}
          >
            <MessageCircle size={18} />
            {t("Community Sharing", "சமூகப் பகிர்வு")}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'gallery' ? 'active' : ''}`}
            onClick={() => setActiveTab('gallery')}
          >
            <ImageIcon size={18} />
            {t("Gallery", "புகைப்படங்கள்")}
          </button>
        </div>

        <div className="admin-actions">
            <button onClick={handleLogout} className="logout-btn" title={t("Logout", "வெளியேறு")}>
              <LogOut size={18} />
            </button>
        </div>
      </header>

      <div className="dashboard-stats-grid">
         <div className="stat-card shadow-premium">
            <Users className="stat-icon" />
            <div className="stat-info">
               <h3>{isLoading ? '...' : submissions.length}</h3>
               <p>{t("Total Requests", "மொத்த கோரிக்கைகள்")}</p>
            </div>
         </div>
         <div className="stat-card shadow-premium">
            <Calendar className="stat-icon" />
            <div className="stat-info">
               <h3>{isLoading ? '...' : events.length}</h3>
               <p>{t("Active Events", "செயலில் உள்ள நிகழ்வுகள்")}</p>
            </div>
         </div>
         <div className="stat-card shadow-premium">
            <MessageCircle className="stat-icon" />
            <div className="stat-info">
               <h3>{isLoading ? '...' : sharing.length}</h3>
               <p>{t("Community Sharing", "சமூகப் பகிர்வு")}</p>
            </div>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'submissions' ? (
          <motion.div 
            key="submissions"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="submissions-section"
          >
            <div className="submission-header">
               <div className="search-bar">
                 <Search size={18} />
                 <input 
                   type="text" 
                   placeholder={t("Search submissions...", "தேடவும்...")}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>

             <div className="submissions-table-container shadow-premium">
               {isLoading ? (
                 <div className="table-loader">
                   <div className="sacred-loader"></div>
                 </div>
                ) : (
                 <table className="submissions-table">
                  <thead>
                    <tr>
                      <th>{t("Date", "தேதி")}</th>
                      <th>{t("Member", "உறுப்பினர்")}</th>
                      <th>{t("Subject", "பொருள்")}</th>
                      <th>{t("Actions", "செயல்கள்")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubmissions.map((sub) => (
                      <tr key={sub.id}>
                        <td className="date-cell">
                           {new Date(sub.timestamp).toLocaleDateString()}
                           <span>{new Date(sub.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </td>
                        <td className="name-cell">{sub.name}</td>
                        <td className="subject-cell">{sub.subject}</td>
                        <td className="actions-cell">
                           <div className="table-actions">
                             <button onClick={() => setSelectedSubmission(sub)} className="view-btn" title="View Detail">
                               <Eye size={16} />
                               <span>{t("View", "பார்க்க")}</span>
                             </button>
                             <button onClick={() => handleDeleteSubmission(sub.id)} className="delete-btn-table" title="Delete">
                               <Trash2 size={16} />
                             </button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                 </table>
                )}

                {/* Submission Detail Modal */}
                <AnimatePresence>
                  {selectedSubmission && (
                    <motion.div 
                      className="modal-overlay"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setSelectedSubmission(null)}
                    >
                      <motion.div 
                        className="modal-card submission-modal shadow-ultra"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div className="modal-header">
                          <h3>{t("Submission Details", "கோரிக்கை விவரங்கள்")}</h3>
                          <button className="close-modal" onClick={() => setSelectedSubmission(null)}>&times;</button>
                        </div>
                        <div className="modal-body">
                          <div className="detail-row">
                            <label>{t("From", "அனுப்புநர்")}:</label>
                            <div className="detail-content">
                              <strong>{selectedSubmission.name}</strong>
                              <p>{selectedSubmission.email} • {selectedSubmission.phone}</p>
                            </div>
                          </div>
                          <div className="detail-row">
                            <label>{t("Date", "தேதி")}:</label>
                            <p>{new Date(selectedSubmission.timestamp).toLocaleString()}</p>
                          </div>
                          <div className="detail-row">
                            <label>{t("Subject", "பொருள்")}:</label>
                            <p className="highlight-subject">{selectedSubmission.subject}</p>
                          </div>
                          <div className="detail-row full-width">
                            <label>{t("Message", "செய்தி")}:</label>
                            <div className="message-box">
                              {selectedSubmission.message}
                            </div>
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button className="delete-accent-btn" onClick={() => handleDeleteSubmission(selectedSubmission.id)}>
                            <Trash2 size={16} />
                            {t("Delete Submission", "கோரிக்கையை நீக்கு")}
                          </button>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
               {!isLoading && filteredSubmissions.length === 0 && (
                 <div className="empty-state">
                   {t("No submissions found", "கோரிக்கைகள் எதுவும் இல்லை")}
                 </div>
               )}
            </div>
          </motion.div>
        ) : activeTab === 'events' ? (
          <motion.div 
            key="events"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="events-management-section"
          >
              <div className="event-management-layout">
                <div className="event-form-card shadow-ultra">
                  <div className="card-header">
                    <PlusCircle className="accent-icon" />
                    <h3>{t("Add New Event", "புதிய நிகழ்வை சேர்க்கவும்")}</h3>
                  </div>
                  <form onSubmit={handleAddEvent} className="event-form">
                    <div className="form-grid">
                      <div className="input-field">
                        <label>Title (English)</label>
                        <input value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} required />
                      </div>
                      <div className="input-field">
                        <label>தலைப்பு (Tamil)</label>
                        <input value={newEvent.title_ta} onChange={e => setNewEvent({...newEvent, title_ta: e.target.value})} required />
                      </div>
                      <div className="input-field">
                        <label>Tag (English)</label>
                        <input value={newEvent.tag} onChange={e => setNewEvent({...newEvent, tag: e.target.value})} />
                      </div>
                      <div className="input-field">
                        <label>குறிச்சொல் (Tamil)</label>
                        <input value={newEvent.tag_ta} onChange={e => setNewEvent({...newEvent, tag_ta: e.target.value})} />
                      </div>
                      <div className="input-field full-width">
                        <label>Description (English)</label>
                        <textarea value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})} required />
                      </div>
                      <div className="input-field full-width">
                        <label>விளக்கம் (Tamil)</label>
                        <textarea value={newEvent.description_ta} onChange={e => setNewEvent({...newEvent, description_ta: e.target.value})} required />
                      </div>
                      <div className="input-field full-width">
                        <label>{t("Upload Image", "புகைப்படத்தைப் பதிவேற்றவும்")}</label>
                        <input type="file" onChange={handleImageChange} accept="image/*" required />
                      </div>
                    </div>
                    {imagePreview && (
                      <div className="event-preview shadow-premium">
                           <OptimizedImage src={imagePreview || 'https://placehold.co/600x400?text=Upload+Image'} alt="Preview" />
                        </div>
                    )}
                    <button type="submit" className="add-event-btn shadow-premium">{t("Upload Event", "நிகழ்வை பதிவேற்றவும்")}</button>
                  </form>
                </div>

                {/* Dashboard Live Preview */}
                <div className="event-live-preview shadow-premium">
                  <div className="preview-label">
                    <Clock size={14} />
                    <span>{t("Live Preview", "நேரடி முன்பார்வை")}</span>
                  </div>
                  <div className="mgmt-event-card mini-preview">
                    <div className="mgmt-visual">
                      <OptimizedImage src={imagePreview || 'https://placehold.co/400x200?text=Upload+Image'} alt="Preview" />
                      {newEvent.tag && (
                        <div className="preview-tag-overlay">{newEvent.tag}</div>
                      )}
                    </div>
                    <div className="mgmt-event-info">
                      <h4>{newEvent.title || 'Event Title'}</h4>
                      <p>{newEvent.tag || 'Category'}</p>
                      <small className="desc-preview">{newEvent.description || 'Description will appear here...'}</small>
                    </div>
                  </div>
                </div>
              </div>

            <div className="events-grid-mgmt">
              <h3 className="section-subtitle">{t("Existing Events", "தற்போதுள்ள நிகழ்வுகள்")}</h3>
              <div className="mgmt-grid">
                {events.map(event => (
                  <div key={event.id} className="mgmt-event-card shadow-premium">
                    <div className="mgmt-visual">
                      <OptimizedImage src={getImageUrl(event.image)} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div className="card-overlay-actions">
                        <button onClick={() => handleDeleteEvent(event.id)} className="delete-btn-float" title="Delete">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="mgmt-event-info">
                      <span className="event-tag-small">{event.tag}</span>
                      <h4>{event.title}</h4>
                      <p className="event-desc-small">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        ) : activeTab === 'welfare' ? (
          <motion.div 
            key="welfare"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="welfare-management-section"
          >
            {/* ── Leadership Section ── */}
            <div className="mgmt-section-header">
              <Shield size={20} />
              <h3>{t("Leadership (Council)", "தலைமை (மன்றம்)")}</h3>
            </div>
            <div className="leaders-edit-grid">
              {welfare.filter(m => m.group === 'leadership').map(member => {
                const edits   = leaderEdits[member.id] || {};
                const isEditing = editingIds.has(member.id);
                const isSaving  = savingIds.has(member.id);
                const hasChanges = Object.keys(edits).length > 0;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    className={`wcard shadow-ultra ${isEditing ? 'wcard--editing' : ''}`}
                  >
                    {/* Role badge */}
                    <div className="wcard-role">
                      {t(member.designation, member.designation_ta)}
                    </div>

                    {/* Photo */}
                    <div className="wcard-photo">
                      <OptimizedImage src={getImageUrl(member.image)} alt={member.name} />
                      {isEditing && (
                        <label className="wcard-photo-btn" title="Change Photo">
                          <Eye size={14} />
                          <input type="file" style={{ display:'none' }} accept="image/*"
                            onChange={e => handleUpdateMember(member.id, { image: e.target.files[0] }, true)} />
                        </label>
                      )}
                    </div>

                    {/* Info */}
                    <div className="wcard-body">
                      {isEditing ? (
                        <>
                          <div className="wcard-field">
                            <label>Name (EN)</label>
                            <input className="wcard-input"
                              value={edits.name !== undefined ? edits.name : member.name}
                              onChange={e => handleLeaderChange(member.id, 'name', e.target.value)}
                              placeholder="English Name" />
                          </div>
                          <div className="wcard-field">
                            <label>பெயர் (TA)</label>
                            <input className="wcard-input"
                              value={edits.name_ta !== undefined ? edits.name_ta : member.name_ta}
                              onChange={e => handleLeaderChange(member.id, 'name_ta', e.target.value)}
                              placeholder="தமிழ் பெயர்" />
                          </div>
                          <div className="wcard-field">
                            <label>Phone</label>
                            <input className="wcard-input wcard-input--phone"
                              value={edits.phone !== undefined ? edits.phone : member.phone}
                              onChange={e => handleLeaderChange(member.id, 'phone', e.target.value)}
                              placeholder="Phone Number" />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="wcard-name">{member.name}</p>
                          <p className="wcard-name-ta">{member.name_ta}</p>
                          <p className="wcard-phone">📞 {member.phone || '—'}</p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="wcard-actions">
                      <button className={`wcard-edit-btn ${isEditing ? 'wcard-edit-btn--cancel' : ''}`}
                        onClick={() => toggleEditMode(member.id)}>
                        {isEditing ? t('Cancel', 'ரத்து') : t('Edit', 'திருத்து')}
                      </button>
                      {isEditing && (
                        <motion.button
                          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                          className={`wcard-save-btn ${hasChanges ? 'wcard-save-btn--active' : ''}`}
                          disabled={!hasChanges || isSaving}
                          onClick={() => handleSaveMemberCard(member.id)}
                        >
                          {isSaving ? '⏳' : t('Save', 'சேமி')}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* ── Add New General Member ── */}
            <div className="mgmt-section-header" style={{ marginTop: '4rem' }}>
              <PlusCircle size={20} />
              <h3>{t("Add New General Member", "புதிய உறுப்பினரைச் சேர்க்கவும்")}</h3>
            </div>
            <div className="event-form-card shadow-ultra" style={{ marginBottom: '3rem' }}>
              <form onSubmit={handleAddMember} className="event-form">
                <div className="form-grid">
                  <div className="input-field">
                    <label>Name (English)</label>
                    <input value={newMember.name} onChange={e => setNewMember({...newMember, name: e.target.value})} required />
                  </div>
                  <div className="input-field">
                    <label>பெயர் (தமிழ்)</label>
                    <input value={newMember.name_ta} onChange={e => setNewMember({...newMember, name_ta: e.target.value})} required />
                  </div>
                  <div className="input-field">
                    <label>{t("Contact Number", "தொடர்பு எண்")}</label>
                    <input value={newMember.phone} onChange={e => setNewMember({...newMember, phone: e.target.value})} required />
                  </div>
                  <div className="input-field">
                    <label>{t("Upload Photo", "புகைப்படத்தைப் பதிவேற்றவும்")}</label>
                    <input type="file" onChange={handleImageChange} accept="image/*" required />
                  </div>
                </div>
                {imagePreview && (
                  <div style={{ width:'90px', height:'90px', borderRadius:'16px', overflow:'hidden', border:'2px solid #e2e8f0', marginBottom:'1rem' }}>
                    <img src={imagePreview} alt="Preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                )}
                <button type="submit" className="add-event-btn shadow-premium">
                  {t("Add Member", "உறுப்பினரைச் சேர்க்கவும்")}
                </button>
              </form>
            </div>

            {/* ── General Members List ── */}
            <div className="mgmt-section-header">
              <Users size={20} />
              <h3>{t("General Members", "பொது உறுப்பினர்கள்")}</h3>
            </div>
            <div className="leaders-edit-grid">
              {welfare.filter(m => m.group !== 'leadership').map(member => {
                const edits      = leaderEdits[member.id] || {};
                const isEditing  = editingIds.has(member.id);
                const isSaving   = savingIds.has(member.id);
                const hasChanges = Object.keys(edits).length > 0;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    className={`wcard shadow-ultra ${isEditing ? 'wcard--editing' : ''}`}
                  >
                    <div className="wcard-photo">
                      <img src={getImageUrl(member.image)} alt={member.name} />
                      {isEditing && (
                        <label className="wcard-photo-btn" title="Change Photo">
                          <Eye size={14} />
                          <input type="file" style={{ display:'none' }} accept="image/*"
                            onChange={e => handleUpdateMember(member.id, { image: e.target.files[0] }, true)} />
                        </label>
                      )}
                    </div>

                    <div className="wcard-body">
                      {isEditing ? (
                        <>
                          <div className="wcard-field">
                            <label>Name (EN)</label>
                            <input className="wcard-input"
                              value={edits.name !== undefined ? edits.name : member.name}
                              onChange={e => handleLeaderChange(member.id, 'name', e.target.value)}
                              placeholder="English Name" />
                          </div>
                          <div className="wcard-field">
                            <label>பெயர் (TA)</label>
                            <input className="wcard-input"
                              value={edits.name_ta !== undefined ? edits.name_ta : member.name_ta}
                              onChange={e => handleLeaderChange(member.id, 'name_ta', e.target.value)}
                              placeholder="தமிழ் பெயர்" />
                          </div>
                          <div className="wcard-field">
                            <label>Phone</label>
                            <input className="wcard-input wcard-input--phone"
                              value={edits.phone !== undefined ? edits.phone : member.phone}
                              onChange={e => handleLeaderChange(member.id, 'phone', e.target.value)}
                              placeholder="Phone Number" />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="wcard-name">{member.name}</p>
                          <p className="wcard-name-ta">{member.name_ta}</p>
                          <p className="wcard-phone">📞 {member.phone || '—'}</p>
                        </>
                      )}
                    </div>

                    <div className="wcard-actions">
                      <button className={`wcard-edit-btn ${isEditing ? 'wcard-edit-btn--cancel' : ''}`}
                        onClick={() => toggleEditMode(member.id)}>
                        {isEditing ? t('Cancel', 'ரத்து') : t('Edit', 'திருத்து')}
                      </button>
                      {isEditing && (
                        <motion.button
                          initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                          className={`wcard-save-btn ${hasChanges ? 'wcard-save-btn--active' : ''}`}
                          disabled={!hasChanges || isSaving}
                          onClick={() => handleSaveMemberCard(member.id)}
                        >
                          {isSaving ? '⏳' : t('Save', 'சேமி')}
                        </motion.button>
                      )}
                      <button onClick={() => handleDeleteMember(member.id)} className="delete-small-btn" style={{ marginLeft:'auto' }}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : activeTab === 'village-leaders' ? (
          <motion.div 
            key="village-leaders"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="welfare-management-section"
          >
            <div className="mgmt-section-header">
              <Users size={20} />
              <h3>{t("Village Leaders Management", "ஊர் தலைவர்கள் நிர்வாகம்")}</h3>
            </div>

            <div className="leaders-edit-grid">
              {villageLeaders.map(member => {
                const edits      = vLeaderEdits[member.id] || {};
                const isEditing  = editingVIds.has(member.id);
                const isSaving   = savingVIds.has(member.id);
                const hasChanges = Object.keys(edits).length > 0;

                return (
                  <motion.div
                    key={member.id}
                    layout
                    className={`wcard shadow-ultra ${isEditing ? 'wcard--editing' : ''}`}
                  >
                    {/* Role badge */}
                    <div className="wcard-role">
                      {t(member.designation, member.designation_ta)}
                    </div>

                    {/* Photo */}
                    <div className="wcard-photo">
                      <OptimizedImage src={getImageUrl(member.image)} alt={member.name} />
                      {isEditing && (
                        <label className="wcard-photo-btn" title="Change Photo">
                          <Eye size={14} />
                          <input type="file" style={{ display:'none' }} accept="image/*"
                            onChange={e => handleUpdateVillageLeader(member.id, { image: e.target.files[0] }, true)} />
                        </label>
                      )}
                    </div>

                    {/* Info */}
                    <div className="wcard-body">
                      {isEditing ? (
                        <>
                          <div className="wcard-field">
                            <label>Name (EN)</label>
                            <input className="wcard-input"
                              value={edits.name !== undefined ? edits.name : member.name}
                              onChange={e => handleVLeaderChange(member.id, 'name', e.target.value)}
                              placeholder="English Name" />
                          </div>
                          <div className="wcard-field">
                            <label>பெயர் (TA)</label>
                            <input className="wcard-input"
                              value={edits.name_ta !== undefined ? edits.name_ta : member.name_ta}
                              onChange={e => handleVLeaderChange(member.id, 'name_ta', e.target.value)}
                              placeholder="தமிழ் பெயர்" />
                          </div>
                          <div className="wcard-field">
                            <label>Phone</label>
                            <input className="wcard-input wcard-input--phone"
                              value={edits.phone !== undefined ? edits.phone : member.phone}
                              onChange={e => handleVLeaderChange(member.id, 'phone', e.target.value)}
                              placeholder="Phone Number" />
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="wcard-name">{member.name}</p>
                          <p className="wcard-name-ta">{member.name_ta}</p>
                          <p className="wcard-phone">📞 {member.phone || '—'}</p>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="wcard-actions">
                      <button
                        className={`wcard-edit-btn ${isEditing ? 'wcard-edit-btn--cancel' : ''}`}
                        onClick={() => toggleEditVMode(member.id)}
                      >
                        {isEditing ? t('Cancel', 'ரத்து') : t('Edit', 'திருத்து')}
                      </button>
                      {isEditing && (
                        <motion.button
                          initial={{ opacity:0, scale:0.8 }}
                          animate={{ opacity:1, scale:1 }}
                          className={`wcard-save-btn ${hasChanges ? 'wcard-save-btn--active' : ''}`}
                          disabled={!hasChanges || isSaving}
                          onClick={() => handleSaveVLeaderCard(member.id)}
                        >
                          {isSaving ? '⏳' : t('Save', 'சேமி')}
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        ) : activeTab === 'sharing' ? (
          <motion.div 
            key="sharing"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="submissions-section"
          >
            <div className="submission-header">
               <div className="header-info">
                 <h3 style={{ margin: 0, color: 'var(--primary)', fontWeight: 800 }}>{t("Community Sharing", "சமூகப் பகிர்வு")}</h3>
               </div>
               <div className="search-bar">
                 <Search size={18} />
                 <input 
                   type="text" 
                   placeholder={t("Search stories...", "தேடவும்...")}
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                 />
               </div>
            </div>

             <div className="submissions-table-container shadow-premium">
                <table className="submissions-table">
                 <thead>
                   <tr>
                     <th>{t("Date", "தேதி")}</th>
                     <th>{t("Author", "ஆசிரியர்")}</th>
                     <th>{t("Message", "செய்தி")}</th>
                     <th>{t("Actions", "செயல்கள்")}</th>
                   </tr>
                 </thead>
                 <tbody>
                   {sharing.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.message.toLowerCase().includes(searchTerm.toLowerCase())).map((item) => (
                     <tr key={item.id}>
                       <td className="date-cell">
                          {item.date}
                       </td>
                       <td>
                         <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                           {item.photo ? (
                             <img src={getImageUrl(item.photo)} alt="" style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }} />
                           ) : (
                             <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 'bold', color: 'var(--primary)' }}>
                               {item.name.charAt(0)}
                             </div>
                           )}
                           <div>
                             <div className="name-cell">{item.name}</div>
                             <div style={{ fontSize: '0.7rem', opacity: 0.6 }}>{item.email}</div>
                           </div>
                         </div>
                       </td>
                       <td className="subject-cell" style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                         {item.message}
                       </td>
                       <td className="actions-cell">
                          <div className="table-actions">
                            <button onClick={() => handleDeleteSharing(item.id)} className="delete-btn-table" title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                       </td>
                     </tr>
                   ))}
                 </tbody>
                </table>
                {sharing.length === 0 && (
                  <div className="empty-state">
                    {t("No sharing records found", "பகிர்வு பதிவுகள் எதுவும் இல்லை")}
                  </div>
                )}
             </div>
          </motion.div>
        ) : activeTab === 'gallery' ? (
          <motion.div 
            key="gallery"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="gallery-mgmt-section"
          >
            <div className="tab-header" style={{ marginBottom: '2rem' }}>
              <ImageIcon size={24} />
              <h2>{t("Gallery Management", "கேலரி நிர்வாகம்")}</h2>
            </div>

            {/* Sub-tab Navigation */}
            <div className="gallery-sub-tabs shadow-premium">
              <button 
                className={`sub-tab-btn ${activeGallerySubTab === 'michael' ? 'active michael' : ''}`}
                onClick={() => setActiveGallerySubTab('michael')}
              >
                <ImageIcon size={18} />
                {t("Mickel's Photos", "மிக்கேல் புகைப்படங்கள்")}
              </button>
              <button 
                className={`sub-tab-btn ${activeGallerySubTab === 'raphael' ? 'active raphael' : ''}`}
                onClick={() => setActiveGallerySubTab('raphael')}
              >
                <ImageIcon size={18} />
                {t("Rafael's Photos", "ரபேல் புகைப்படங்கள்")}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {activeGallerySubTab === 'michael' ? (
                <motion.div
                  key="michael-mgmt"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="mgmt-section-header">
                    <ImageIcon size={20} />
                    <h3>{t("Mickel's Photos Management", "மிக்கேல் புகைப்படங்கள் நிர்வாகம்")}</h3>
                  </div>

                  <div className="gallery-mgmt-container shadow-ultra">
                    <form onSubmit={(e) => handleGalleryUpload(e, 'michael')} className="gallery-upload-form">
                      <div className="form-grid">
                        <div className="input-field">
                          <label>{t("Caption", "தலைப்பு")}</label>
                          <input name="caption" placeholder={t("Enter photo caption...", "புகைப்படத் தலைப்பை உள்ளிடவும்...")} />
                        </div>
                        <div className="input-field">
                          <label>{t("Select Photo", "புகைப்படத்தைத் தேர்ந்தெடுக்கவும்")}</label>
                          <input type="file" name="photo" accept="image/*" required />
                        </div>
                      </div>
                      <button type="submit" className="add-event-btn shadow-premium">
                        <PlusCircle size={18} />
                        {t("Upload to Mickel's Gallery", "மிக்கேல் கேலரியில் பதிவேற்றவும்")}
                      </button>
                    </form>

                    <div className="gallery-preview-grid">
                      {michaelGallery.map((photo) => (
                        <div key={photo.id} className="gallery-admin-card shadow-premium">
                          <div className="gallery-admin-visual">
                            <OptimizedImage src={getImageUrl(photo.src)} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => handleDeleteGalleryPhoto('michael', photo.id)} className="delete-photo-btn shadow-premium">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="gallery-admin-info">
                            <p>{photo.caption || t("No Caption", "தலைப்பு இல்லை")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {michaelGallery.length === 0 && <p className="empty-text">{t("No photos in Mickel's Gallery", "மிக்கேல் கேலரியில் படங்கள் எதுவும் இல்லை")}</p>}
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="raphael-mgmt"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                >
                  <div className="mgmt-section-header">
                    <ImageIcon size={20} />
                    <h3>{t("Rafael's Photos Management", "ரபேல் புகைப்படங்கள் நிர்வாகம்")}</h3>
                  </div>

                  <div className="gallery-mgmt-container shadow-ultra" style={{ borderTop: '4px solid #006400' }}>
                    <form onSubmit={(e) => handleGalleryUpload(e, 'raphael')} className="gallery-upload-form">
                      <div className="form-grid">
                        <div className="input-field">
                          <label>{t("Caption", "தலைப்பு")}</label>
                          <input name="caption" placeholder={t("Enter photo caption...", "புகைப்படத் தலைப்பை உள்ளிடவும்...")} />
                        </div>
                        <div className="input-field">
                          <label>{t("Select Photo (Profile)", "புகைப்படத்தைத் தேர்ந்தெடுக்கவும்")}</label>
                          <input type="file" name="photo" accept="image/*" required />
                        </div>
                      </div>
                      <button type="submit" className="add-event-btn shadow-premium" style={{ background: '#006400' }}>
                        <PlusCircle size={18} />
                        {t("Upload to Rafael's Gallery", "ரபேல் கேலரியில் பதிவேற்றவும்")}
                      </button>
                    </form>

                    <div className="gallery-preview-grid">
                      {raphaelGallery.map((photo) => (
                        <div key={photo.id} className="gallery-admin-card shadow-premium" style={{ borderColor: '#00640022' }}>
                          <div className="gallery-admin-visual">
                            <OptimizedImage src={getImageUrl(photo.src)} alt={photo.caption} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            <button onClick={() => handleDeleteGalleryPhoto('raphael', photo.id)} className="delete-photo-btn shadow-premium">
                              <Trash2 size={16} />
                            </button>
                          </div>
                          <div className="gallery-admin-info">
                            <p>{photo.caption || t("No Caption", "தலைப்பு இல்லை")}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    {raphaelGallery.length === 0 && <p className="empty-text">{t("No photos in Rafael's Gallery", "ரபேல் கேலரியில் படங்கள் எதுவும் இல்லை")}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmModal 
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      <style>{`
        /* Dashboard Layout */
        .admin-dashboard-page { padding: 40px 4% 100px; background: #f8f9fc; min-height: 100vh; font-family: 'Inter', sans-serif; }
        .admin-header { 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
          margin-bottom: 2.5rem; 
          background: white; 
          padding: 1rem 2rem; 
          border-radius: 20px; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          border: 1px solid rgba(0,0,0,0.05);
          position: sticky;
          top: 20px;
          z-index: 100;
        }
        .admin-meta { display: flex; align-items: center; gap: 1rem; color: var(--primary); }
        .admin-meta h1 { font-size: 1.2rem; margin: 0; font-family: var(--heading-font); letter-spacing: 0.5px; }

        .admin-logo-wrap {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(212, 175, 55, 0.5);
          flex-shrink: 0;
          box-shadow: 0 3px 10px rgba(139, 0, 0, 0.12);
        }
        .admin-logo-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .admin-brand-text {
          display: flex;
          flex-direction: column;
          gap: 1px;
        }
        .admin-brand-top {
          font-size: 0.68rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: #b08020;
          font-family: 'Inter', sans-serif;
        }
        .admin-brand-bottom {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--primary);
          font-family: var(--heading-font);
          letter-spacing: 0.3px;
          line-height: 1;
        }

        .admin-tabs { display: flex; gap: 0.4rem; background: #f0f0f4; padding: 0.3rem; border-radius: 12px; margin-left: 1.5rem; }
        .tab-btn { 
          display: flex; 
          align-items: center; 
          gap: 0.5rem; 
          padding: 0.5rem 1rem; 
          border-radius: 9px; 
          border: none; 
          background: transparent; 
          font-weight: 700; 
          color: #64748b; 
          cursor: pointer; 
          transition: 0.2s ease; 
          font-size: 0.85rem; 
        }
        .tab-btn.active { background: white; color: var(--primary); box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

        .admin-actions { display: flex; align-items: center; gap: 1rem; margin-left: auto; padding-left: 1.5rem; }
        .logout-btn { 
          display: flex; 
          align-items: center; 
          justify-content: center;
          width: 36px;
          height: 36px;
          background: rgba(225, 29, 72, 0.04); 
          border: 1px solid rgba(225, 29, 72, 0.1); 
          border-radius: 12px; 
          cursor: pointer; 
          color: #e11d48; 
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); 
        }
        .logout-btn:hover { 
          background: #e11d48; 
          color: white; 
          border-color: #e11d48;
          box-shadow: 0 4px 12px rgba(225, 29, 72, 0.2);
          transform: translateY(-2px);
        }
        .logout-btn:active {
          transform: translateY(0);
        }

        /* Stats */
        .dashboard-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 24px; display: flex; align-items: center; gap: 1.5rem; border: 1px solid rgba(0,0,0,0.05); box-shadow: 0 2px 10px rgba(0,0,0,0.02); }
        .stat-icon { width: 32px; height: 32px; color: var(--primary); opacity: 0.3; }
        .stat-info h3 { font-size: 1.8rem; margin: 0; color: var(--primary); font-weight: 800; }
        .stat-info p { margin: 0; color: #64748b; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; }

        /* Sections */
        .submissions-section, .events-management-section, .welfare-management-section, .gallery-mgmt-section { animation: sectionEntry 0.4s ease-out; }
        @keyframes sectionEntry { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }

        /* Gallery Management */
        .gallery-mgmt-container {
          background: white;
          padding: 2.5rem;
          border-radius: 32px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 4px 30px rgba(0,0,0,0.03);
          margin-bottom: 2rem;
        }

        .gallery-sub-tabs {
          display: flex;
          gap: 1rem;
          background: #f1f5f9;
          padding: 0.5rem;
          border-radius: 16px;
          margin-bottom: 2rem;
          border: 1px solid #e2e8f0;
        }

        .sub-tab-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.75rem;
          padding: 0.8rem;
          border: none;
          background: transparent;
          color: #64748b;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .sub-tab-btn:hover {
          background: rgba(255, 255, 255, 0.5);
          color: #1e293b;
        }

        .sub-tab-btn.active.michael {
          background: white;
          color: #1e3c72;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .sub-tab-btn.active.raphael {
          background: white;
          color: #006400;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }

        .gallery-upload-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-bottom: 3rem;
          padding-bottom: 2rem;
          border-bottom: 1px solid #f1f5f9;
        }

        .gallery-preview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
        }

        .gallery-admin-card {
          background: #f8fafc;
          border-radius: 20px;
          overflow: hidden;
          border: 1px solid #e2e8f0;
          transition: 0.3s;
        }

        .gallery-admin-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.05);
        }

        .gallery-admin-visual {
          height: 150px;
          position: relative;
        }

        .gallery-admin-visual img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .delete-photo-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: white;
          color: #e11d48;
          border: none;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          opacity: 0;
          transition: 0.2s;
        }

        .gallery-admin-card:hover .delete-photo-btn {
          opacity: 1;
        }

        .gallery-admin-info {
          padding: 1rem;
        }

        .gallery-admin-info p {
          margin: 0;
          font-size: 0.85rem;
          font-weight: 600;
          color: #334155;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .empty-text {
          text-align: center;
          color: #94a3b8;
          font-style: italic;
          margin-top: 2rem;
        }

        /* Submissions Table */
        .submission-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .search-bar { 
          background: white; 
          padding: 0.7rem 1.2rem; 
          border-radius: 12px; 
          border: 1px solid #e2e8f0; 
          display: flex; 
          align-items: center; 
          gap: 0.8rem; 
          width: 320px; 
        }
        .search-bar input { border: none; outline: none; width: 100%; font-size: 0.9rem; color: #1e293b; }
        
        .submissions-table-container { 
          background: white; 
          border-radius: 20px; 
          overflow: hidden; 
          border: 1px solid #e2e8f0; 
          box-shadow: 0 4px 20px rgba(0,0,0,0.02);
        }
        .submissions-table { width: 100%; border-collapse: collapse; text-align: left; }
        .submissions-table th { background: #f8fafc; padding: 1.25rem 1.5rem; font-size: 0.65rem; text-transform: uppercase; color: #64748b; font-weight: 800; letter-spacing: 1px; border-bottom: 1px solid #e2e8f0; }
        .submissions-table td { padding: 1.25rem 1.5rem; border-bottom: 1px solid #f1f5f9; font-size: 0.9rem; color: #334155; vertical-align: middle; }
        .date-cell { font-weight: 600; color: #64748b; font-size: 0.8rem; }
        .date-cell span { display: block; font-weight: 400; font-size: 0.75rem; opacity: 0.6; margin-top: 2px; }
        .name-cell { font-weight: 700; color: #0f172a; }
        .subject-cell { font-weight: 500; font-style: italic; color: #475569; }

        .actions-cell { width: 150px; }
        .table-actions { display: flex; gap: 0.5rem; justify-content: flex-end; }
        .view-btn { 
          display: flex; 
          align-items: center; 
          gap: 0.4rem; 
          background: #f1f5f9; 
          color: #475569; 
          border: none; 
          padding: 0.5rem 0.8rem; 
          border-radius: 8px; 
          font-size: 0.75rem; 
          font-weight: 700; 
          cursor: pointer; 
          transition: 0.2s; 
        }
        .view-btn:hover { background: var(--primary); color: white; }
        .delete-btn-table { 
          background: #fff1f2; 
          color: #e11d48; 
          border: none; 
          width: 32px; 
          height: 32px; 
          border-radius: 8px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          cursor: pointer; 
          transition: 0.2s; 
        }
        .delete-btn-table:hover { background: #e11d48; color: white; }

        /* Modal */
        .modal-overlay { 
          position: fixed; 
          inset: 0; 
          background: rgba(15, 23, 42, 0.7); 
          backdrop-filter: blur(4px); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          z-index: 2000; 
          padding: 2rem;
        }
        .modal-card { 
          background: white; 
          border-radius: 32px; 
          width: 100%; 
          max-width: 600px; 
          overflow: hidden; 
          position: relative; 
          box-shadow: 0 25px 60px rgba(0,0,0,0.3);
        }
        .modal-header { 
          padding: 2rem 2.5rem; 
          background: #f8fafc; 
          border-bottom: 1px solid #e2e8f0; 
          display: flex; 
          justify-content: space-between; 
          align-items: center; 
        }
        .modal-header h3 { margin: 0; font-size: 1.25rem; font-family: var(--heading-font); color: var(--primary); }
        .close-modal { 
          background: none; 
          border: none; 
          font-size: 2rem; 
          color: #94a3b8; 
          cursor: pointer; 
          line-height: 1; 
          transition: 0.2s;
        }
        .close-modal:hover { color: #0f172a; }
        
        .modal-body { padding: 2.5rem; display: flex; flex-direction: column; gap: 1.5rem; }
        .detail-row { display: flex; gap: 1.5rem; }
        .detail-row label { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; width: 80px; flex-shrink: 0; padding-top: 4px; }
        .detail-content strong { display: block; font-size: 1.1rem; color: #0f172a; margin-bottom: 4px; }
        .detail-content p { margin: 0; color: #64748b; font-size: 0.95rem; }
        .highlight-subject { font-weight: 600; color: #334155; font-size: 1rem; }
        .message-box { 
          background: #fbfbfc; 
          padding: 1.5rem; 
          border-radius: 16px; 
          border: 1px solid #e2e8f0; 
          line-height: 1.7; 
          color: #334155; 
          white-space: pre-wrap; 
          max-height: 250px; 
          overflow-y: auto; 
        }
        .modal-footer { padding: 1.5rem 2.5rem; border-top: 1px solid #e2e8f0; text-align: right; background: #fafafa; }
        .delete-accent-btn { 
          background: #fff1f2; 
          color: #e11d48; 
          border: 1px solid #fecdd3; 
          padding: 0.8rem 1.5rem; 
          border-radius: 12px; 
          font-weight: 700; 
          display: inline-flex; 
          align-items: center; 
          gap: 0.6rem; 
          cursor: pointer; 
          transition: 0.2s; 
          font-size: 0.85rem;
        }
        .delete-accent-btn:hover { background: #e11d48; color: white; border-color: #e11d48; }

        /* Events Section Improvements */
        .event-management-layout { display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 2.5rem; margin-bottom: 4rem; }
        .event-form-card { background: white; padding: 2.5rem; border-radius: 32px; border: 1px solid #e2e8f0; box-shadow: 0 4px 30px rgba(0,0,0,0.03); }
        .card-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
        .accent-icon { color: var(--primary); }
        .card-header h3, .card-header h4 { margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--primary); }
        
        .event-form { display: flex; flex-direction: column; gap: 2rem; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .input-field label { font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; margin-bottom: 0.5rem; display: block; }
        .input-field input, .input-field textarea { width: 100%; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 0.8rem 1rem; outline: none; transition: 0.2s; font-size: 0.95rem; }
        .input-field input:focus, .input-field textarea:focus { border-color: var(--primary); background: white; box-shadow: 0 0 15px rgba(139, 0, 0, 0.05); }

        .add-event-btn { 
          background: var(--primary); 
          color: white; 
          padding: 1rem; 
          border-radius: 16px; 
          border: none; 
          font-weight: 800; 
          cursor: pointer; 
          transition: 0.3s; 
          text-transform: uppercase; 
          letter-spacing: 1px;
        }
        .add-event-btn:hover { transform: translateY(-3px); box-shadow: 0 10px 25px rgba(139, 0, 0, 0.2); }

        .event-live-preview { background: #0f172a; border-radius: 32px; padding: 2.5rem; color: white; display: flex; flex-direction: column; gap: 1.5rem; align-items: center; justify-content: center; }
        .preview-label { display: flex; align-items: center; gap: 0.5rem; opacity: 0.5; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 2px; }
        .mini-preview { width: 100%; max-width: 320px; background: rgba(255,255,255,0.05) !important; border: 1px solid rgba(255,255,255,0.1) !important; }
        .preview-tag-overlay { position: absolute; top: 12px; left: 12px; background: var(--secondary); color: white; padding: 4px 10px; border-radius: 6px; font-size: 0.65rem; font-weight: 800; }

        .mgmt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 2rem; }
        .mgmt-event-card { background: white; border-radius: 28px; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.3s; position: relative; }
        .mgmt-event-card:hover { transform: translateY(-8px); box-shadow: 0 20px 40px rgba(0,0,0,0.08); }
        .mgmt-visual { height: 180px; position: relative; }
        .mgmt-visual img { width: 100%; height: 100%; object-fit: cover; }
        .card-overlay-actions { position: absolute; top: 15px; right: 15px; }
        .delete-btn-float { 
          background: white; 
          color: #e11d48; 
          width: 38px; 
          height: 38px; 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: none; 
          cursor: pointer; 
          box-shadow: 0 4px 15px rgba(0,0,0,0.15); 
          transition: 0.2s;
        }
        .delete-btn-float:hover { background: #e11d48; color: white; transform: scale(1.1); }
        
        .mgmt-event-info { padding: 1.5rem; }
        .event-tag-small { display: inline-block; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; color: var(--secondary); margin-bottom: 0.5rem; letter-spacing: 1px; }
        .mgmt-event-info h4 { margin: 0 0 0.5rem; font-size: 1.1rem; color: #0f172a; }
        .event-desc-small { font-size: 0.8rem; color: #64748b; line-height: 1.5; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }

        /* Welfare Management */
        .mgmt-section-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; color: #0f172a; padding-bottom: 1rem; border-bottom: 2px solid #f1f5f9; }
        .section-subtitle { margin: 3rem 0 1.5rem; font-size: 1.4rem; font-family: var(--heading-font); color: #0f172a; }

        .general-members-mgmt-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
        .member-mgmt-card { 
          background: white; 
          padding: 1.5rem; 
          border-radius: 24px; 
          border: 1px solid #e2e8f0; 
          display: flex; 
          align-items: center; 
          gap: 1.5rem; 
          transition: 0.2s;
        }
        .member-mgmt-card:hover { border-color: var(--secondary); }
        .member-mgmt-visual { width: 80px; height: 80px; border-radius: 20px; overflow: hidden; background: #f8fafc; flex-shrink: 0; position: relative; border: 2px solid #f1f5f9; }
        .member-mgmt-visual img { width: 100%; height: 100%; object-fit: cover; }
        .photo-edit-overlay { 
          position: absolute; 
          inset: 0; 
          background: rgba(0,0,0,0.4); 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          opacity: 0; 
          transition: 0.2s; 
          cursor: pointer; 
          color: white; 
        }
        .member-mgmt-visual:hover .photo-edit-overlay { opacity: 1; }

        .member-mgmt-info { flex-grow: 1; display: flex; flex-direction: column; gap: 0.5rem; }
        .inline-edit-input { border: none; background: #f8fafc; padding: 0.4rem 0.6rem; border-radius: 8px; font-size: 0.9rem; font-weight: 600; width: 100%; outline: none; border: 1px solid transparent; transition: 0.2s; }
        .inline-edit-input:focus { background: white; border-color: var(--secondary); }
        .inline-edit-input.name { color: #0f172a; font-size: 1rem; }
        .inline-edit-input.phone { color: #64748b; font-size: 0.8rem; font-family: monospace; }
        
        .member-mgmt-actions { display: flex; gap: 0.5rem; margin-top: 0.5rem; align-items: center; }
        .save-btn { 
          background: #f1f5f9; 
          color: #94a3b8; 
          border: none; 
          padding: 0.4rem 1rem; 
          border-radius: 8px; 
          font-size: 0.75rem; 
          font-weight: 800; 
          cursor: default; 
          transition: 0.2s; 
        }
        .save-btn.active { background: #ecfdf5; color: #10b981; cursor: pointer; }
        .save-btn.active:hover { background: #10b981; color: white; }
        .delete-small-btn { background: #fff1f2; color: #e11d48; border: none; padding: 0.4rem 0.6rem; border-radius: 8px; cursor: pointer; transition: 0.2s; }
        .delete-small-btn:hover { background: #e11d48; color: white; }

        .leaders-edit-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.8rem; }

        /* ── Premium Welfare Card ── */
        .wcard {
          background: white;
          border: 1px solid rgba(0,0,0,0.06);
          border-radius: 28px;
          padding: 1.8rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.2rem;
          text-align: center;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
          overflow: hidden;
        }
        .wcard::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 4px;
          background: linear-gradient(90deg, var(--primary), var(--secondary));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .wcard:hover { transform: translateY(-6px); box-shadow: 0 20px 50px rgba(0,0,0,0.1); }
        .wcard:hover::before { opacity: 1; }
        .wcard--editing {
          border-color: var(--secondary);
          background: #fffaf8;
          box-shadow: 0 8px 30px rgba(139,0,0,0.08);
        }
        .wcard--editing::before { opacity: 1; }

        .wcard-role {
          font-size: 0.62rem;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          color: var(--secondary);
          background: #fff0f0;
          padding: 4px 12px;
          border-radius: 99px;
        }

        .wcard-photo {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          border: 4px solid white;
          box-shadow: 0 8px 24px rgba(0,0,0,0.12);
          overflow: hidden;
          flex-shrink: 0;
          position: relative;
        }
        .wcard-photo img { width: 100%; height: 100%; object-fit: cover; }
        .wcard-photo-btn {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          opacity: 0;
          transition: 0.2s;
          font-size: 0.7rem;
          border-radius: 50%;
        }
        .wcard-photo:hover .wcard-photo-btn { opacity: 1; }

        .wcard-body { width: 100%; display: flex; flex-direction: column; gap: 0.6rem; }
        .wcard-name { margin: 0; font-size: 1.05rem; font-weight: 800; color: #0f172a; }
        .wcard-name-ta { margin: 0; font-size: 0.9rem; color: #64748b; font-weight: 500; }
        .wcard-phone { margin: 0; font-size: 0.78rem; color: #94a3b8; font-family: monospace; }

        .wcard-field { text-align: left; }
        .wcard-field label { font-size: 0.62rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8; display: block; margin-bottom: 4px; }
        .wcard-input {
          width: 100%;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 0.5rem 0.75rem;
          font-size: 0.9rem;
          font-weight: 600;
          outline: none;
          transition: 0.2s;
          box-sizing: border-box;
        }
        .wcard-input:focus { background: white; border-color: var(--secondary); box-shadow: 0 0 0 3px rgba(139,0,0,0.08); }
        .wcard-input--phone { font-family: monospace; color: #64748b; }

        .wcard-actions {
          display: flex;
          gap: 0.6rem;
          width: 100%;
          justify-content: center;
          flex-wrap: wrap;
        }
        .wcard-edit-btn {
          background: #f1f5f9;
          color: #475569;
          border: none;
          padding: 0.5rem 1.4rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: pointer;
          transition: 0.2s;
          letter-spacing: 0.3px;
        }
        .wcard-edit-btn:hover { background: #e2e8f0; }
        .wcard-edit-btn--cancel { background: #fff0f0; color: #e11d48; }
        .wcard-edit-btn--cancel:hover { background: #fecdd3; }

        .wcard-save-btn {
          background: #f1f5f9;
          color: #94a3b8;
          border: none;
          padding: 0.5rem 1.4rem;
          border-radius: 10px;
          font-size: 0.8rem;
          font-weight: 700;
          cursor: not-allowed;
          transition: 0.2s;
          letter-spacing: 0.3px;
        }
        .wcard-save-btn--active {
          background: linear-gradient(135deg, var(--primary), #b00030);
          color: white;
          cursor: pointer;
          box-shadow: 0 4px 15px rgba(139,0,0,0.25);
        }
        .wcard-save-btn--active:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(139,0,0,0.3); }


        .leader-edit-card { background: white; padding: 1.5rem; border-radius: 28px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 1rem; position: relative; }
        .leader-edit-visual { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto; position: relative; border: 4px solid var(--secondary); padding: 5px; background: white; }
        .leader-edit-visual img { width: 100%; height: 100%; border-radius: 50%; object-fit: cover; }
        .leader-photo-edit { position: absolute; bottom: 0; right: 0; background: var(--secondary); color: white; width: 30px; height: 30px; border-radius: 50%; border: 3px solid white; display: flex; align-items: center; justify-content: center; cursor: pointer; }

        /* General UI components */
        .empty-state { padding: 5rem; text-align: center; color: #94a3b8; font-weight: 600; font-size: 1rem; }
        .sacred-loader { width: 40px; height: 40px; border: 4px solid #f1f5f9; border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto; }
        @keyframes spin { to { transform: rotate(360deg); } }
        .table-loader { padding: 5rem; }

        @media (max-width: 1024px) {
          .event-management-layout { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .admin-header { flex-direction: column; height: auto; gap: 1.5rem; padding: 1.5rem; }
          .admin-tabs { width: 100%; overflow-x: auto; padding: 0.5rem; }
          .form-grid { grid-template-columns: 1fr; }
          .search-bar { width: 100%; }
          .modal-overlay { padding: 1rem; }
          .modal-card { border-radius: 24px; }
          .detail-row { flex-direction: column; gap: 0.5rem; }
          .detail-row label { width: 100%; }
        }
      `}</style>
    </motion.div>
  );
};

export default SuperAdmin;
