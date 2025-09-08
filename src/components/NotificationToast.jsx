import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationToast = ({ 
  message, 
  type = 'info', 
  duration = 3000, 
  onClose,
  show = false 
}) => {
  const [isVisible, setIsVisible] = useState(show);

  useEffect(() => {
    setIsVisible(show);
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onClose]);

  const typeStyles = {
    success: {
      bg: 'bg-green-500/20 border-green-400/50',
      text: 'text-green-300',
      icon: '✅'
    },
    error: {
      bg: 'bg-red-500/20 border-red-400/50',
      text: 'text-red-300',
      icon: '❌'
    },
    warning: {
      bg: 'bg-yellow-500/20 border-yellow-400/50',
      text: 'text-yellow-300',
      icon: '⚠️'
    },
    info: {
      bg: 'bg-blue-500/20 border-blue-400/50',
      text: 'text-blue-300',
      icon: 'ℹ️'
    }
  };

  const style = typeStyles[type] || typeStyles.info;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          className={`fixed top-4 right-4 z-50 ${style.bg} backdrop-blur-xl border rounded-xl p-4 max-w-sm shadow-lg`}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{style.icon}</span>
            <p className={`${style.text} flex-1`}>{message}</p>
            <button
              onClick={() => {
                setIsVisible(false);
                onClose?.();
              }}
              className={`${style.text} hover:text-white transition-colors`}
            >
              ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Hook for managing notifications
export const useNotification = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const notification = { id, message, type, duration };
    
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, duration);
    }
    
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map(notification => (
        <NotificationToast
          key={notification.id}
          message={notification.message}
          type={notification.type}
          duration={0} // Managed by the hook
          show={true}
          onClose={() => removeNotification(notification.id)}
        />
      ))}
    </div>
  );

  return {
    addNotification,
    removeNotification,
    NotificationContainer
  };
};

export default NotificationToast;