import { useState } from 'react';

interface PopupConfig {
  title: string;
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  confirmText?: string;
  cancelText?: string;
  showCancel?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const usePopup = () => {
  const [popupConfig, setPopupConfig] = useState<PopupConfig | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const showPopup = (config: PopupConfig) => {
    setPopupConfig(config);
    setIsVisible(true);
  };

  const hidePopup = () => {
    setIsVisible(false);
    setPopupConfig(null);
  };

  const showSuccess = (title: string, message: string, onConfirm?: () => void) => {
    showPopup({
      title,
      message,
      type: 'success',
      confirmText: 'OK',
      onConfirm: () => {
        hidePopup();
        onConfirm?.();
      },
    });
  };

  const showError = (title: string, message: string, onConfirm?: () => void) => {
    showPopup({
      title,
      message,
      type: 'error',
      confirmText: 'OK',
      onConfirm: () => {
        hidePopup();
        onConfirm?.();
      },
    });
  };

  const showWarning = (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    showPopup({
      title,
      message,
      type: 'warning',
      confirmText: 'Continue',
      cancelText: 'Cancel',
      showCancel: true,
      onConfirm: () => {
        hidePopup();
        onConfirm?.();
      },
      onCancel: () => {
        hidePopup();
        onCancel?.();
      },
    });
  };

  const showConfirmation = (title: string, message: string, onConfirm?: () => void, onCancel?: () => void) => {
    showPopup({
      title,
      message,
      type: 'info',
      confirmText: 'Yes',
      cancelText: 'No',
      showCancel: true,
      onConfirm: () => {
        hidePopup();
        onConfirm?.();
      },
      onCancel: () => {
        hidePopup();
        onCancel?.();
      },
    });
  };

  return {
    popupConfig,
    isVisible,
    showPopup,
    hidePopup,
    showSuccess,
    showError,
    showWarning,
    showConfirmation,
  };
}; 