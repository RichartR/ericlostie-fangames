import React from 'react';
import { ArrowLeft, LogOut } from 'lucide-react';

export default function AdminNavbar({ userEmail, onClose, handleLogout }) {
  return (
    <header className="admin-navbar">
      <div className="admin-navbar-brand">
        <span className="admin-badge-tag">ADMIN</span>
        <span className="admin-navbar-title">Panel de Control de Fangames</span>
      </div>

      <div className="admin-navbar-actions">
        <span className="admin-user-pill">{userEmail}</span>
        <button
          type="button"
          className="btn-secondary"
          onClick={onClose}
          style={{ padding: '8px 14px', fontSize: '0.8125rem' }}
        >
          <ArrowLeft size={14} aria-hidden="true" />
          <span>Ver Web Pública</span>
        </button>
        <button
          type="button"
          className="admin-logout-btn"
          onClick={handleLogout}
          title="Cerrar sesión"
        >
          <LogOut size={14} aria-hidden="true" />
          <span>Salir</span>
        </button>
      </div>
    </header>
  );
}
