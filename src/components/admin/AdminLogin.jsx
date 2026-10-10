import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function AdminLogin({
  email,
  setEmail,
  password,
  setPassword,
  loginLoading,
  loginError,
  handleLogin,
  onClose
}) {
  return (
    <div className="admin-viewport admin-login-screen">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <div className="admin-login-logo-wrap">
            <img 
              src="/volcarona-logo.png" 
              alt="Logo Eric Lostie" 
              className="admin-login-logo"
            />
          </div>
          <h1 className="admin-login-title">Panel Admin</h1>
          <p className="admin-login-subtitle">Acceso exclusivo para el administrador</p>
        </div>

        {loginError && (
          <div className="admin-error-banner" role="alert">
            <AlertCircle size={16} aria-hidden="true" />
            <span>{loginError}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="admin-email">Email de Administrador</label>
            <input
              id="admin-email"
              type="email"
              className="admin-input"
              placeholder="lostiefangames@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="admin-field-group">
            <label className="admin-field-label" htmlFor="admin-pass">Contraseña</label>
            <input
              id="admin-pass"
              type="password"
              className="admin-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loginLoading}
            style={{ width: '100%', marginTop: '8px' }}
          >
            {loginLoading ? 'Autenticando...' : 'Entrar al Panel'}
          </button>
        </form>

        <button
          type="button"
          className="admin-back-btn"
          onClick={onClose}
        >
          ← Volver a la web pública
        </button>
      </div>
    </div>
  );
}
