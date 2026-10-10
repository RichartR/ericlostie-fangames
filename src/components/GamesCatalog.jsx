import React, { useState } from 'react';
import { Search, Download, Info, Monitor, Smartphone, RefreshCw, Globe } from 'lucide-react';
import './GamesCatalog.css';

export default function GamesCatalog({ games, loading = false, onSelectGame }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const completedCount = games.filter((g) => g.status === 'completed').length;
  const devCount = games.filter((g) => g.status === 'in_development').length;

  const filteredGames = games.filter((game) => {
    const matchesFilter =
      activeFilter === 'all'
        ? true
        : activeFilter === 'completed'
        ? game.status === 'completed'
        : game.status === 'in_development';

    const query = searchTerm.toLowerCase().trim();
    const matchesSearch =
      query === '' ||
      game.title.toLowerCase().includes(query) ||
      (game.shortDescription && game.shortDescription.toLowerCase().includes(query)) ||
      (game.features && game.features.some((f) => f.toLowerCase().includes(query)));

    return matchesFilter && matchesSearch;
  });

  const handleResetFilters = () => {
    setActiveFilter('all');
    setSearchTerm('');
  };

  return (
    <section id="juegos" className="catalog-section">
      <div className="container">
        {/* Encabezado del catálogo */}
        <div className="catalog-header">
          <div className="catalog-titles">
            <span className="section-label">CATÁLOGO Y DESCARGAS</span>
            <h2 className="section-title">Mis Fangames</h2>
          </div>
          <p className="catalog-intro">
            Haz click sobre cualquiera de los juegos para ver su información completa, lista de características,
            enlaces directos de descarga (Mega, Mediafire) y las guías existentes.
          </p>
        </div>

        {/* Barra de herramientas: Filtros y buscador */}
        <div className="catalog-toolbar">
          <div className="filter-group" role="tablist" aria-label="Filtro de estado de juegos">
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'all'}
              className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              <span>Todos los juegos</span>
              <span className="filter-count">{games.length}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'completed'}
              className={`filter-btn ${activeFilter === 'completed' ? 'active' : ''}`}
              onClick={() => setActiveFilter('completed')}
            >
              <span>Completos</span>
              <span className="filter-count">{completedCount}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={activeFilter === 'in_dev'}
              className={`filter-btn ${activeFilter === 'in_dev' ? 'active' : ''}`}
              onClick={() => setActiveFilter('in_dev')}
            >
              <span>En Desarrollo</span>
              <span className="filter-count">{devCount}</span>
            </button>
          </div>

          <div className="search-wrap">
            <Search size={18} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              className="search-input"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Buscar fangames"
            />
            {searchTerm && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={() => setSearchTerm('')}
                aria-label="Borrar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Lista de juegos o estado de carga / vacío */}
        {loading ? (
          <div className="catalog-loading-state" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--color-text-secondary)' }}>
            <p>Cargando catálogo oficial de juegos...</p>
          </div>
        ) : filteredGames.length > 0 ? (
          <div className="games-grid">
            {filteredGames.map((game) => (
              <article key={game.id} className="game-card">
                {/* Banner del juego */}
                <div 
                  className="game-card-media"
                  onClick={() => onSelectGame(game)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectGame(game);
                    }
                  }}
                  aria-label={`Ver detalles de ${game.title}`}
                >
                  <img
                    src={game.banner}
                    alt={`Portada promocional de ${game.title}`}
                    className="game-banner-img"
                    loading="lazy"
                  />
                  <div className="game-card-status-overlay">
                    <span
                      className={
                        game.status === 'completed'
                          ? 'badge-status-completed'
                          : 'badge-status-dev'
                      }
                    >
                      {game.statusLabel}
                    </span>
                    <span className="game-card-version">{game.version}</span>
                  </div>
                </div>

                {/* Contenido de la tarjeta */}
                <div className="game-card-body">
                  <div className="game-meta-row">
                    <span className="game-year">{game.year}</span>
                    <span className="game-platforms">
                      <Monitor size={14} aria-hidden="true" />
                      <span>PC</span>
                      <span className="meta-sep">•</span>
                      <Smartphone size={14} aria-hidden="true" />
                      <span>Android</span>
                    </span>
                  </div>

                  <div className="game-card-title-row">
                    <h3 className="game-card-title">{game.title}</h3>
                    <span className="game-lang-tag" title={`Idioma: ${(game.languages || ['Español']).join(', ')}`}>
                      <Globe size={13} aria-hidden="true" />
                      <span>{(game.languages || ['Español']).join(' / ')}</span>
                    </span>
                  </div>

                  <p className="game-card-desc">{game.shortDescription}</p>

                  {/* Botones de acción */}
                  <div className="game-card-actions">
                    <button
                      type="button"
                      className="btn-primary game-action-btn"
                      onClick={() => onSelectGame(game)}
                    >
                      <Info size={16} aria-hidden="true" />
                      <span>Ver Detalles y Descargas</span>
                    </button>

                    {game.status === 'completed' && game.downloads.length > 0 ? (
                      <a
                        href={game.downloads[0].url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-secondary game-download-shortcut"
                        title={`Descarga directa de ${game.title}`}
                      >
                        <Download size={16} aria-hidden="true" />
                        <span>Descarga Rápida</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        className="btn-secondary game-download-shortcut"
                        onClick={() => onSelectGame(game)}
                      >
                        <span>Avance y Estado</span>
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* Estado vacío real (R-27) */
          <div className="catalog-empty-state" role="status">
            <h3 className="empty-title">No se han encontrado juegos</h3>
            <p className="empty-desc">
              No hay ningún juego que coincida con los términos "{searchTerm}". Prueba a buscar
              por título como "Añil", "Ópalo", "Iberia" o revisa los filtros.
            </p>
            <button
              type="button"
              className="btn-secondary empty-reset-btn"
              onClick={handleResetFilters}
            >
              <RefreshCw size={16} aria-hidden="true" />
              <span>Restablecer búsqueda</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
