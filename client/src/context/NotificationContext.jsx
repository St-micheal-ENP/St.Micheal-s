import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) throw new Error('useNotification must be used within a NotificationProvider');
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const showNotification = useCallback((message, type = 'info', duration = 4000) => {
        const id = Date.now();
        setNotifications(prev => [...prev, { id, message, type }]);

        if (duration !== Infinity) {
            setTimeout(() => {
                setNotifications(prev => prev.filter(n => n.id !== id));
            }, duration);
        }
    }, []);

    const removeNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ showNotification }}>
            {children}
            <div className="notification-container">
                <AnimatePresence>
                    {notifications.map(n => (
                        <motion.div
                            key={n.id}
                            layout
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 20, scale: 0.9 }}
                            className={`notification-item ${n.type}`}
                        >
                            <div className="notification-icon">
                                {n.type === 'success' && <CheckCircle size={18} />}
                                {n.type === 'error' && <XCircle size={18} />}
                                {n.type === 'warning' && <AlertCircle size={18} />}
                                {n.type === 'info' && <Info size={18} />}
                            </div>
                            <div className="notification-content">
                                {n.message}
                            </div>
                            <button className="notification-close" onClick={() => removeNotification(n.id)}>
                                <X size={14} />
                            </button>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <style>{`
                .notification-container {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    pointer-events: none;
                }

                .notification-item {
                    pointer-events: auto;
                    min-width: 300px;
                    max-width: 450px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(12px);
                    border-radius: 16px;
                    padding: 14px 18px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 
                        0 10px 25px -5px rgba(0, 0, 0, 0.08),
                        0 8px 10px -6px rgba(0, 0, 0, 0.05),
                        inset 0 0 0 1px rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(0, 0, 0, 0.05);
                    position: relative;
                    overflow: hidden;
                }

                .notification-item.success { border-left: 4px solid #10b981; }
                .notification-item.error { border-left: 4px solid #ef4444; }
                .notification-item.warning { border-left: 4px solid #f59e0b; }
                .notification-item.info { border-left: 4px solid #3b82f6; }

                .notification-icon {
                    flex-shrink: 0;
                }

                .success .notification-icon { color: #10b981; }
                .error .notification-icon { color: #ef4444; }
                .warning .notification-icon { color: #f59e0b; }
                .info .notification-icon { color: #3b82f6; }

                .notification-content {
                    flex: 1;
                    font-size: 0.92rem;
                    font-weight: 500;
                    color: #1e293b;
                    line-height: 1.4;
                }

                .notification-close {
                    background: transparent;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    padding: 4px;
                    border-radius: 6px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .notification-close:hover {
                    background: #f1f5f9;
                    color: #475569;
                }

                @media (max-width: 640px) {
                    .notification-container {
                        top: auto;
                        bottom: 24px;
                        right: 16px;
                        left: 16px;
                    }
                    .notification-item {
                        min-width: 0;
                        width: 100%;
                    }
                }
            `}</style>
        </NotificationContext.Provider>
    );
};
