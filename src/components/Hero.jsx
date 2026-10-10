import { Gamepad2, BookOpen, Monitor, Smartphone, Check } from 'lucide-react';
import './Hero.css';

export default function Hero({ games = [], onExploreClick, onHowToPlayClick }) {
  return (
    <section id="inicio" className="hero-section">
      {/* Marca de agua de Volcarona en gran formato de fondo inclinada a 120 grados */}
      <div className="hero-large-watermark" aria-hidden="true">
        <img
          src="/volcarona-logo.png"
          alt=""
          className="hero-large-watermark-img"
        />
      </div>

      <div className="container hero-container">
        {/* Columna de texto principal */}
        <div className="hero-content">
          <div className="hero-pill">
            <span className="hero-pill-tag">PORTAL OFICIAL</span>
            <span className="hero-pill-text">Descargas y guías de los fangames de Eric Lostie.</span>
          </div>

          <h1 className="hero-title">
            Los fangames de Pokémon de <span className="hero-highlight">Eric Lostie</span>
          </h1>

          <p className="hero-description">
            Repositorio oficial para descargar los juegos creados por Eric Lostie y seguir los avances de los nuevos que están por venir.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="btn-primary hero-btn"
              onClick={onExploreClick}
              id="hero-explore-btn"
            >
              <Gamepad2 size={18} aria-hidden="true" />
              <span>Ver Juegos</span>
            </button>

            <button
              type="button"
              className="btn-secondary hero-btn"
              onClick={onHowToPlayClick}
              id="hero-guide-btn"
            >
              <BookOpen size={18} aria-hidden="true" />
              <span>Instrucciones PC y Móvil</span>
            </button>
          </div>

          {/* Indicadores honestos y reales */}
          <div className="hero-features-list">
            <div className="hero-feature-item">
              <Check size={16} className="feature-check-icon" aria-hidden="true" />
              <span>Gratuitos y sin ánimo de lucro</span>
            </div>
            <div className="hero-feature-item">
              <Monitor size={16} className="feature-check-icon" aria-hidden="true" />
              <span>Windows (sin emulador)</span>
            </div>
            <div className="hero-feature-item">
              <Smartphone size={16} className="feature-check-icon" aria-hidden="true" />
              <span>Jugable en Android (Kirin)</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de presentación / Avatar de Eric Lostie */}
        <div className="hero-showcase">
          <div className="creator-card">
            <div className="creator-card-header">
              <div className="creator-avatar-wrap">
                <img
                  src="/eric-lostie-avatar.png"
                  alt="Avatar oficial de Eric Lostie junto a Volcarona"
                  className="creator-avatar"
                  width="80"
                  height="80"
                />
              </div>
              <div>
                <span className="creator-label">CREADOR DE FANGAMES</span>
                <h2 className="creator-name">Eric Lostie</h2>
              </div>
            </div>

            <p className="creator-bio">
              Desarrollador de fangames de Pokémon y Streamer.
            </p>

            <div className="creator-specs">
              <div className="creator-spec-item">
                <span className="spec-label">Proyectos</span>
                <span className="spec-value">
                  {games.length > 0 ? `${games.length} ${games.length === 1 ? 'Juego' : 'Juegos'}` : '—'}
                </span>
              </div>
              <div className="creator-spec-item">
                <span className="spec-label">Plataformas</span>
                <span className="spec-value">PC y Android</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
