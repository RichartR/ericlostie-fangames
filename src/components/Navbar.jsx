import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import './Navbar.css';

export default function Navbar({ theme = 'dark', onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const isLight = theme === 'light';

  return (
    <header className={`site-header ${scrolled ? 'site-header-scrolled' : ''}`}>
      <div className="container header-container">
        {/* Brand / Logo */}
        <a 
          href="#inicio" 
          className="brand-logo" 
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('inicio');
          }}
          aria-label="Eric Lostie - Ir al inicio"
        >
          <img 
            src="/volcarona-sprite.gif" 
            alt="Emblema de Volcarona" 
            className="brand-sprite" 
            width="36" 
            height="36" 
          />
          <div className="brand-text">
            <span className="brand-name">Eric Lostie</span>
            <span className="brand-tagline">Fangames de Pokémon</span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="desktop-nav" aria-label="Navegación principal">
          <ul className="nav-list">
            <li>
              <button 
                type="button" 
                className="nav-link" 
                onClick={() => scrollToSection('juegos')}
              >
                Catálogo de Juegos
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="nav-link" 
                onClick={() => scrollToSection('como-jugar')}
              >
                Cómo Jugar (PC / Móvil)
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="nav-link" 
                onClick={() => scrollToSection('comunidad')}
              >
                Canales Oficiales
              </button>
            </li>
          </ul>
        </nav>

        {/* Quick CTA & Theme Switcher con Piedra Día / Piedra Noche */}
        <div className="header-actions">
          {/* Conmutador temático con Piedras Evolutivas */}
          <button
            type="button"
            className="theme-toggle-btn stone-toggle-btn"
            onClick={onToggleTheme}
            aria-label={isLight ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
            title={isLight ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}
          >
            <img
              src={isLight ? '/piedra-noche.png' : '/piedra-dia.png'}
              alt={isLight ? 'Piedra Noche' : 'Piedra Día'}
              className="theme-stone-sprite"
              width="24"
              height="24"
            />
          </button>

          {/* Mobile Menu Toggle Button */}
          <button 
            type="button" 
            className="mobile-toggle-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú de navegación'}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <nav className="mobile-nav-drawer" aria-label="Navegación móvil">
          <div className="mobile-drawer-top">
            <button
              type="button"
              className="mobile-theme-toggle-btn"
              onClick={onToggleTheme}
            >
              <img
                src={isLight ? '/piedra-noche.png' : '/piedra-dia.png'}
                alt=""
                className="theme-stone-sprite"
                width="22"
                height="22"
              />
              <span>{isLight ? 'Activar Modo Oscuro' : 'Activar Modo Claro'}</span>
            </button>
          </div>

          <ul className="mobile-nav-list">
            <li>
              <button 
                type="button" 
                className="mobile-nav-link" 
                onClick={() => scrollToSection('juegos')}
              >
                Catálogo de Juegos
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="mobile-nav-link" 
                onClick={() => scrollToSection('como-jugar')}
              >
                Cómo Jugar en PC y Android
              </button>
            </li>
            <li>
              <button 
                type="button" 
                className="mobile-nav-link" 
                onClick={() => scrollToSection('comunidad')}
              >
                Canales Oficiales
              </button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
