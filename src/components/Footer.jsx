import React from 'react';
import './Footer.css';

export default function Footer() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top-row">
          <div className="footer-brand">
            <div className="footer-brand-title">
              <img
                src="/volcarona-sprite.gif"
                alt="Emblema de Volcarona"
                className="footer-sprite"
                width="32"
                height="32"
              />
              <span className="footer-name">Eric Lostie</span>
            </div>
            <p className="footer-tagline">
              Portal oficial de fangames de Pokémon en español.
            </p>
          </div>

          <nav className="footer-nav" aria-label="Navegación de pie de página">
            <ul className="footer-links-list">
              <li>
                <button type="button" onClick={() => scrollTo('inicio')}>
                  Inicio
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('juegos')}>
                  Catálogo de Juegos
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('como-jugar')}>
                  Guía de Instalación
                </button>
              </li>
              <li>
                <button type="button" onClick={() => scrollTo('comunidad')}>
                  Canales Oficiales
                </button>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-disclaimer-box">
          <p className="disclaimer-text">
            <strong>Aviso de Propiedad Intelectual:</strong> Pokémon y sus respectivos personajes,
            nombres y marcas registradas son propiedad de Nintendo, Creatures Inc. y Game Freak.
            Esta web y los proyectos desarrollados por Eric Lostie son creados por un fan sin
            ánimo de lucro, ofrecidas de manera 100% gratuita para la comunidad.
          </p>
        </div>

        <div className="footer-bottom-row">
          <span className="copyright-text">
            Proyectos desarrollados por Eric Lostie (2017 - 2026).
          </span>
          <span className="footer-note">
            Hecho con respeto a la comunidad y a la franquicia.
          </span>
        </div>
      </div>
    </footer>
  );
}
