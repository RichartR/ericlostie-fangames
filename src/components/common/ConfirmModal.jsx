import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Trash2, Info, X } from 'lucide-react';
import './ConfirmModal.css';

export default function ConfirmModal({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  variant = 'danger',
  requireKeyword = null,
  onConfirm,
  onCancel,
}) {
  const [keywordInput, setKeywordInput] = useState('');
  const cancelBtnRef = useRef(null);
  const inputRef = useRef(null);
  const cardRef = useRef(null);

  const isKeywordMatching = !requireKeyword || keywordInput.trim().toLowerCase() === requireKeyword.toLowerCase();

  useEffect(() => {
    if (!isOpen) return;

    setKeywordInput('');

    // Bloquear scroll de fondo mientras el modal de confirmación está abierto
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Si requiere keyword, hacer foco en el input; si no, en el botón cancelar
    const timer = setTimeout(() => {
      if (requireKeyword && inputRef.current) {
        inputRef.current.focus();
      } else if (cancelBtnRef.current) {
        cancelBtnRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onCancel();
      } else if (e.key === 'Tab' && cardRef.current) {
        // Trampa de foco accesible considerando elementos no deshabilitados
        const focusableElements = cardRef.current.querySelectorAll(
          'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(timer);
    };
  }, [isOpen, requireKeyword, onCancel]);

  if (!isOpen) return null;

  const handleConfirmClick = () => {
    if (!isKeywordMatching) return;
    onConfirm();
  };

  const renderIcon = () => {
    switch (variant) {
      case 'warning':
        return <AlertTriangle size={26} aria-hidden="true" />;
      case 'info':
        return <Info size={26} aria-hidden="true" />;
      case 'danger':
      default:
        return <Trash2 size={26} aria-hidden="true" />;
    }
  };

  return (
    <div
      className="confirm-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
      role="presentation"
    >
      <div
        ref={cardRef}
        className={`confirm-modal-card confirm-variant-${variant}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
      >
        <button
          type="button"
          className="confirm-modal-close-btn"
          onClick={onCancel}
          aria-label="Cerrar y cancelar"
        >
          <X size={16} aria-hidden="true" />
        </button>

        <div className={`confirm-icon-badge confirm-badge-${variant}`}>
          {renderIcon()}
        </div>

        <div className="confirm-modal-body">
          <h3 id="confirm-modal-title" className="confirm-modal-title">
            {title}
          </h3>
          <p id="confirm-modal-desc" className="confirm-modal-desc">
            {message}
          </p>

          {requireKeyword && (
            <div className="confirm-keyword-box">
              <label htmlFor="confirm-keyword-input" className="confirm-keyword-label">
                Para confirmar la eliminación, escribe <strong className="confirm-keyword-target">"{requireKeyword}"</strong>:
              </label>
              <input
                id="confirm-keyword-input"
                ref={inputRef}
                type="text"
                className="confirm-keyword-input"
                placeholder={`Escribe "${requireKeyword}"`}
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && isKeywordMatching) {
                    e.preventDefault();
                    handleConfirmClick();
                  }
                }}
                autoComplete="off"
                autoCorrect="off"
                spellCheck="false"
              />
            </div>
          )}
        </div>

        <div className="confirm-modal-actions">
          <button
            ref={cancelBtnRef}
            type="button"
            className="confirm-btn-secondary"
            onClick={onCancel}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`confirm-btn-primary confirm-btn-primary-${variant} ${!isKeywordMatching ? 'confirm-btn-disabled' : ''}`}
            onClick={handleConfirmClick}
            disabled={!isKeywordMatching}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
