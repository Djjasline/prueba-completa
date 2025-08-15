import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const ModalOverlay = ({ 
  isOpen = false, 
  onClose, 
  title, 
  children, 
  size = 'default',
  showCloseButton = true,
  closeOnBackdrop = true,
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'max-w-md',
    default: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  };

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen && onClose) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget && closeOnBackdrop && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-1100">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-1050 transition-fade"
        onClick={handleBackdropClick}
      />
      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center p-4 z-1100">
        <div 
          className={`
            relative w-full ${sizeClasses?.[size]} 
            bg-card rounded-lg shadow-modal 
            transition-layout transform
            ${className}
          `}
        >
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="flex items-center justify-between p-6 border-b border-border">
              {title && (
                <h2 className="text-lg font-semibold text-foreground">
                  {title}
                </h2>
              )}
              
              {showCloseButton && onClose && (
                <button
                  onClick={onClose}
                  className="flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-micro"
                  aria-label="Cerrar modal"
                >
                  <Icon name="X" size={16} />
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalOverlay;