import React, { useEffect, useState } from 'react';
import {
  X,
  Download,
  BookOpen,
  Check,
  ExternalLink,
  Maximize2,
  Share2,
  CheckCircle2
} from 'lucide-react';
import './GameDetailModal.css';

export default function GameDetailModal({ game, onClose }) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'downloads' | 'screenshots'
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // Cerrar al pulsar Escape y bloquear scroll del fondo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (selectedScreenshot) {
          setSelectedScreenshot(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose, selectedScreenshot]);

  if (!game) return null;

  const handleShare = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#${game.slug}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2500);
      });
    }
  };

  return (
    <div 
      className="modal-backdrop" 
      onClick={onClose} 
      role="dialog" 
      aria-modal="true"
      aria-labelledby="modal-game-title"
    >
      <div 
        className="modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón de cierre */}
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar detalles del juego"
        >
          <X size={20} aria-hidden="true" />
        </button>

        {/* Cabecera con banner */}
        <div className="modal-banner-header">
          <img
            src={game.banner}
            alt={`Banner de ${game.title}`}
            className="modal-banner-img"
          />
          <div className="modal-banner-scrim" />

          <div className="modal-header-info">
            <div className="modal-badges-row">
              <span
                className={
                  game.status === 'completed'
                    ? 'badge-status-completed'
                    : 'badge-status-dev'
                }
              >
                {game.statusLabel}
              </span>
              <span className="modal-year-tag">{game.year}</span>
              <span className="modal-ver-tag">{game.version}</span>
            </div>

            <h2 id="modal-game-title" className="modal-game-title">{game.title}</h2>
          </div>
        </div>

        {/* Barra de pestañas */}
        <div className="modal-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'overview'}
            className={`modal-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>Información y Sinopsis</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'downloads'}
            className={`modal-tab-btn ${activeTab === 'downloads' ? 'active' : ''}`}
            onClick={() => setActiveTab('downloads')}
          >
            <span>Descargas y Enlaces</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'screenshots'}
            className={`modal-tab-btn ${activeTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setActiveTab('screenshots')}
          >
            <span>Capturas de Pantalla</span>
          </button>
          {game.acknowledgements && game.acknowledgements.length > 0 && (
            <button
              type="button"
              role="tab"
              aria-selected={activeTab === 'acknowledgements'}
              className={`modal-tab-btn ${activeTab === 'acknowledgements' ? 'active' : ''}`}
              onClick={() => setActiveTab('acknowledgements')}
            >
              <span>Agradecimientos</span>
            </button>
          )}
        </div>

        {/* Cuerpo del modal */}
        <div className="modal-body-content">
          {/* Pestaña 1: Información & Sinopsis */}
          {activeTab === 'overview' && (
            <div className="modal-tab-pane">
              {/* Tira de especificaciones técnicas */}
              <div className="modal-specs-grid">
                <div className="spec-card">
                  <span className="spec-name">Versión Actual</span>
                  <span className="spec-data">{game.version}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-name">Año</span>
                  <span className="spec-data">{game.year}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-name">Idiomas</span>
                  <span className="spec-data">{game.languages.join(', ')}</span>
                </div>
                <div className="spec-card">
                  <span className="spec-name">Plataformas</span>
                  <span className="spec-data">PC (Windows) / Android</span>
                </div>
              </div>

              {/* Argumento */}
              <div className="modal-section-block">
                <h3 className="modal-block-title">Sinopsis de la Aventura</h3>
                <div className="modal-paragraphs">
                  {game.fullDescription.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div className="modal-section-block">
                <h3 className="modal-block-title">Características Destacadas</h3>
                <div className="features-list">
                  {game.features.map((feat, index) => (
                    <div key={index} className="feature-row">
                      <div className="feature-check" aria-hidden="true">
                        <Check size={14} />
                      </div>
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Pestaña 2: Descargas */}
          {activeTab === 'downloads' && (
            <div className="modal-tab-pane">
              {game.status === 'completed' && game.downloads.length > 0 ? (
                <>
                  <div className="download-notice">
                    <p>
                      Enlaces de descarga directa facilitados por Eric Lostie. El archivo incluye
                      el juego completo listo para descomprimir y jugar.
                    </p>
                  </div>

                  <div className="downloads-list">
                    {game.downloads.map((dl, index) => (
                      <div key={index} className="download-card">
                        <div className="download-info">
                          <span className="dl-badge">
                            {dl.platform} • {dl.size || 'Archivo completo'}
                          </span>
                          <h4 className="dl-title">{dl.name}</h4>
                          <span className="dl-server-type">
                            Servidor de descarga
                          </span>
                        </div>

                        <a
                          href={dl.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary dl-action-btn"
                        >
                          <Download size={16} aria-hidden="true" />
                          <span>Descargar</span>
                        </a>
                      </div>
                    ))}
                  </div>

                  {game.guideUrl && (
                    <div className="guide-card-promo">
                      <div>
                        <h4 className="guide-promo-title">Guía de Estrategia y Documentación</h4>
                        <p className="guide-promo-desc">
                          Consulta la carpeta con tablas de evolución, objetos, encuentros salvajes y secretos.
                        </p>
                      </div>
                      <a
                        href={game.guideUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary guide-promo-btn"
                      >
                        <BookOpen size={16} aria-hidden="true" />
                        <span>Ver Guías</span>
                        <ExternalLink size={14} aria-hidden="true" />
                      </a>
                    </div>
                  )}
                </>
              ) : (
                <div className="dev-status-card">
                  <span className="dev-badge">EN DESARROLLO ACTIVO</span>
                  <h3 className="dev-title">Descargas Próximamente Disponibles</h3>
                  <p className="dev-text">
                    {game.title} es el próximo gran proyecto de Eric Lostie ambientado en la antigua región de Kalos.
                    Las fechas de salida y las versiones de prueba beta se comunicarán oficialmente a través
                    de Twitter y del servidor de Discord de la comunidad.
                  </p>
                  <div className="dev-actions">
                    <a
                      href="https://twitter.com/Eric_Lostie"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary"
                    >
                      <span>Seguir en Twitter (@Eric_Lostie)</span>
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Pestaña 3: Galería de Capturas */}
          {activeTab === 'screenshots' && (
            <div className="modal-tab-pane">
              <div className="modal-screenshots-gallery">
                <div className="screenshots-header-note">
                  <p>Haz clic en cualquiera de las imágenes para ampliar la captura en alta resolución.</p>
                </div>

                {game.screenshots && game.screenshots.length > 0 ? (
                  <div className="screenshots-grid">
                    {game.screenshots.map((shot, index) => (
                      <figure 
                        key={index} 
                        className="screenshot-card"
                        onClick={() => setSelectedScreenshot(shot)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            setSelectedScreenshot(shot);
                          }
                        }}
                        aria-label={`Ampliar captura ${index + 1} de ${game.title}`}
                      >
                        <div className="screenshot-img-wrap">
                          <img
                            src={shot.url}
                            alt={`Captura ${index + 1} de ${game.title}`}
                            className="screenshot-img"
                            loading="lazy"
                          />
                          <div className="screenshot-zoom-overlay">
                            <Maximize2 size={18} aria-hidden="true" />
                            <span>Ampliar</span>
                          </div>
                        </div>
                      </figure>
                    ))}
                  </div>
                ) : (
                  <div className="screenshots-empty">
                    <p>No hay capturas disponibles actualmente.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Pestaña 4: Agradecimientos (Opcional, solo si existen) */}
          {activeTab === 'acknowledgements' && game.acknowledgements && game.acknowledgements.length > 0 && (
            <div className="modal-tab-pane">
              <div className="acknowledgements-container">
                <div className="acknowledgements-header-note">
                  <p>Menciones y agradecimientos especiales a las personas y recursos que hicieron posible este proyecto.</p>
                </div>

                <div className="acknowledgements-grid">
                  {game.acknowledgements.map((ack) => (
                    <div key={ack.id} className="acknowledgement-card">
                      {ack.imageUrl && (
                        <div className="ack-avatar-wrap">
                          <img src={ack.imageUrl} alt="" className="ack-avatar-img" />
                        </div>
                      )}
                      <div className="ack-content">
                        <p className="ack-description">{ack.description}</p>
                        {ack.linkUrl && (
                          <a
                            href={ack.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ack-link"
                          >
                            <span>Visitar enlace</span>
                            <ExternalLink size={13} aria-hidden="true" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pie del modal: botón compartir */}
        <div className="modal-footer-bar">
          <button
            type="button"
            className="share-link-btn"
            onClick={handleShare}
            aria-label="Copiar enlace directo de este juego al portapapeles"
          >
            {copiedLink ? (
              <>
                <CheckCircle2 size={16} className="share-success-icon" aria-hidden="true" />
                <span>¡Enlace copiado al portapapeles!</span>
              </>
            ) : (
              <>
                <Share2 size={16} aria-hidden="true" />
                <span>Compartir enlace de este juego</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Lightbox para ampliar captura en detalle */}
      {selectedScreenshot && (
        <div 
          className="screenshot-lightbox-backdrop" 
          onClick={() => setSelectedScreenshot(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Captura ampliada de ${game.title}`}
        >
          <div className="screenshot-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="lightbox-close-btn"
              onClick={() => setSelectedScreenshot(null)}
              aria-label="Cerrar captura ampliada"
            >
              <X size={20} aria-hidden="true" />
            </button>
            <div className="lightbox-img-wrap">
              <img
                src={selectedScreenshot.url}
                alt={`Captura de ${game.title}`}
                className="lightbox-img"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
