import React from 'react';
import ModalOverlay from '../../../components/ui/ModalOverlay';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmText = "Confirmar", 
  cancelText = "Cancelar",
  type = "default",
  isLoading = false 
}) => {
  const getIconAndColor = () => {
    switch (type) {
      case 'danger':
        return { icon: 'AlertTriangle', color: 'text-destructive' };
      case 'warning':
        return { icon: 'AlertCircle', color: 'text-warning' };
      case 'success':
        return { icon: 'CheckCircle', color: 'text-success' };
      default:
        return { icon: 'HelpCircle', color: 'text-primary' };
    }
  };

  const { icon, color } = getIconAndColor();

  const getConfirmVariant = () => {
    switch (type) {
      case 'danger':
        return 'destructive';
      case 'warning':
        return 'warning';
      case 'success':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClose={onClose}
      size="sm"
      closeOnBackdrop={!isLoading}
      showCloseButton={!isLoading}
    >
      <div className="text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-muted rounded-full">
          <Icon name={icon} size={32} className={color} />
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {title}
        </h3>

        {/* Message */}
        <p className="text-muted-foreground mb-6">
          {message}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            variant={getConfirmVariant()}
            onClick={onConfirm}
            loading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </ModalOverlay>
  );
};

export default ConfirmationModal;