import React from 'react';
import { 
  Plus, 
  Layers, 
  Archive, 
  GripVertical, 
  Eye, 
  EyeOff, 
  Globe, 
  Monitor, 
  Smartphone, 
  Pencil, 
  Trash2 
} from 'lucide-react';

export default function AdminGameCards({
  adminTab,
  setAdminTab,
  activeGames,
  archivedGames,
  displayGames,
  draggedGameId,
  draggedGame,
  dragPointer,
  onOpenCreate,
  handleCardPointerDown,
  handleOpenEdit,
  handleToggleActive,
  handleDeleteGame,
  wasDraggingRef
}) {
  const currentList = adminTab === 'active' ? activeGames : archivedGames;
  const cardsToDisplay = displayGames || currentList;

  return (
    <>
      <div className="admin-toolbar-row">
        <div className="admin-tabs-group" role="tablist">
          <button
            type="button"
            className={`admin-filter-pill ${adminTab === 'active' ? 'active' : ''}`}
            onClick={() => setAdminTab('active')}
          >
            <Layers size={16} aria-hidden="true" />
            <span>Juegos Activos</span>
            <span className="admin-pill-count">{activeGames.length}</span>
          </button>

          <button
            type="button"
            className={`admin-filter-pill ${adminTab === 'archived' ? 'active' : ''}`}
            onClick={() => setAdminTab('archived')}
          >
            <Archive size={16} aria-hidden="true" />
            <span>Archivados / Ocultos</span>
            <span className="admin-pill-count">{archivedGames.length}</span>
          </button>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={onOpenCreate}
          style={{ padding: '9px 18px', fontSize: '0.875rem' }}
        >
          <Plus size={16} aria-hidden="true" />
          <span>Crear Nuevo Juego</span>
        </button>
      </div>

      {cardsToDisplay.length === 0 ? (
        <div className="admin-empty-state">
          <p>
            {adminTab === 'active' 
              ? 'No hay juegos activos en este momento. Pulsa en "Crear Nuevo Juego" o activa uno archivado.' 
              : 'No hay juegos archivados u ocultos.'}
          </p>
        </div>
      ) : (
        <>
          <p className="admin-drag-hint" style={{ margin: '0 0 16px 4px', fontSize: '0.8125rem', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <GripVertical size={14} aria-hidden="true" style={{ color: 'var(--color-accent)' }} />
            <span>Puedes arrastrar y desplazar las tarjetas para definir su orden de visualización en la web.</span>
          </p>
          <div className="games-grid admin-cards-grid">
            {cardsToDisplay.map((game, index) => {
              const isDragging = draggedGameId === game.id;

              if (isDragging) {
                return (
                  <article 
                    key={game.id} 
                    data-game-id={game.id}
                    className="game-card admin-game-card admin-card-placeholder-slot"
                  >
                    <div className="admin-placeholder-inner">
                      <GripVertical size={24} className="admin-placeholder-icon" />
                      <span className="admin-placeholder-text">Posición #{index + 1}</span>
                      <span className="admin-placeholder-subtext">{game.title}</span>
                    </div>
                  </article>
                );
              }

              return (
                <article 
                  key={game.id} 
                  data-game-id={game.id}
                  className={`game-card admin-game-card ${!game.isActive ? 'is-archived' : ''}`}
                  onPointerDown={(e) => handleCardPointerDown(e, game)}
                >
                  {/* Media / Portada del juego */}
                  <div 
                    className="game-card-media"
                    onClick={() => {
                      if (wasDraggingRef.current) return;
                      handleOpenEdit(game);
                    }}
                    style={{ cursor: 'pointer' }}
                    title="Haz clic para editar este juego directamente en su modal"
                  >
                    <img
                      src={game.banner}
                      alt={`Portada de ${game.title}`}
                      className="game-banner-img"
                      loading="lazy"
                    />
                    <div className="game-card-status-overlay">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span 
                          className="admin-drag-badge" 
                          title="Posición en el orden de la web. Arrastra para reordenar"
                        >
                          <GripVertical size={12} aria-hidden="true" />
                          <span>#{index + 1}</span>
                        </span>
                        <span className={game.status === 'completed' ? 'badge-status-completed' : 'badge-status-dev'}>
                          {game.statusLabel}
                        </span>
                      </div>
                      <span className="game-card-version">{game.version}</span>
                    </div>

                    {!game.isActive && (
                      <div className="admin-archived-stamp">
                        <EyeOff size={13} aria-hidden="true" />
                        <span>Oculto de la Web</span>
                      </div>
                    )}
                  </div>

                  {/* Cuerpo de la tarjeta con diseño original */}
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

                    {/* Barra de acciones de administración */}
                    <div className="admin-card-actions-bar">
                      <button
                        type="button"
                        className="btn-primary admin-card-action-btn"
                        onClick={() => handleOpenEdit(game)}
                      >
                        <Pencil size={15} aria-hidden="true" />
                        <span>Modificar</span>
                      </button>

                      <button
                        type="button"
                        className={`btn-secondary admin-card-action-btn ${game.isActive ? 'btn-archive' : 'btn-activate'}`}
                        onClick={() => handleToggleActive(game)}
                        title={game.isActive ? 'Ocultar este juego en la web pública' : 'Volver a mostrar en la web pública'}
                      >
                        {game.isActive ? (
                          <>
                            <EyeOff size={15} aria-hidden="true" />
                            <span>Ocultar</span>
                          </>
                        ) : (
                          <>
                            <Eye size={15} aria-hidden="true" />
                            <span>Activar</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="admin-btn-icon-danger admin-card-delete-icon"
                        onClick={() => handleDeleteGame(game)}
                        title="Eliminar juego permanentemente"
                      >
                        <Trash2 size={16} aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* Tarjeta flotante 100% nítida que sigue al ratón sin transparencias */}
          {draggedGame && dragPointer && (
            <div
              className="admin-floating-drag-card"
              style={{
                left: `${dragPointer.x - dragPointer.offsetX}px`,
                top: `${dragPointer.y - dragPointer.offsetY}px`,
                width: `${dragPointer.width}px`,
                height: `${dragPointer.height}px`,
              }}
            >
              <div className="game-card-media">
                <img
                  src={draggedGame.banner}
                  alt={`Portada de ${draggedGame.title}`}
                  className="game-banner-img"
                />
                <div className="game-card-status-overlay">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span className="admin-drag-badge">
                      <GripVertical size={12} aria-hidden="true" />
                      <span>#{cardsToDisplay.findIndex((g) => g.id === draggedGame.id) + 1}</span>
                    </span>
                    <span className={draggedGame.status === 'completed' ? 'badge-status-completed' : 'badge-status-dev'}>
                      {draggedGame.statusLabel}
                    </span>
                  </div>
                  <span className="game-card-version">{draggedGame.version}</span>
                </div>
              </div>
              <div className="game-card-body">
                <div className="game-meta-row">
                  <span className="game-year">{draggedGame.year}</span>
                  <span className="game-platforms">
                    <Monitor size={14} aria-hidden="true" />
                    <span>PC</span>
                    <span className="meta-sep">•</span>
                    <Smartphone size={14} aria-hidden="true" />
                    <span>Android</span>
                  </span>
                </div>
                <div className="game-card-title-row">
                  <h3 className="game-card-title">{draggedGame.title}</h3>
                  <span className="game-lang-tag">
                    <Globe size={13} aria-hidden="true" />
                    <span>{(draggedGame.languages || ['Español']).join(' / ')}</span>
                  </span>
                </div>
                <p className="game-card-desc">{draggedGame.shortDescription}</p>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}
