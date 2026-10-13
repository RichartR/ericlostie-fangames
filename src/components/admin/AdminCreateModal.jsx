import React from 'react';
import { 
  X, 
  Plus, 
  AlertCircle, 
  Image as ImageIcon, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export default function AdminCreateModal({
  newGameForm,
  setNewGameForm,
  createTab,
  setCreateTab,
  showCreateBannerInput,
  setShowCreateBannerInput,
  saveError,
  isSaving,
  handleCreateGame,
  onClose,
  // Downloads
  createDownloads,
  newCreateDl,
  setNewCreateDl,
  handleAddCreateDownload,
  handleDeleteCreateDownload,
  // Screenshots
  createScreenshots,
  newCreateShotUrl,
  setNewCreateShotUrl,
  handleAddCreateScreenshot,
  handleDeleteCreateScreenshot,
  // Acknowledgements
  createAcknowledgements,
  newCreateAck,
  setNewCreateAck,
  handleAddCreateAcknowledgement,
  handleDeleteCreateAcknowledgement
}) {
  return (
    <div 
      className="modal-backdrop admin-live-backdrop" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="modal-card admin-live-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior de herramientas de creación */}
        <div className="admin-live-modal-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span className="admin-live-tag" style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-accent-text)' }}>
              CREAR NUEVO JUEGO
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)' }}>
              Diseño directo en vivo
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
            >
              <X size={15} />
              <span>Cancelar</span>
            </button>

            <button
              type="button"
              className="btn-primary"
              onClick={handleCreateGame}
              disabled={isSaving}
              style={{ padding: '6px 16px', fontSize: '0.8125rem' }}
            >
              <Plus size={15} />
              <span>{isSaving ? 'Creando...' : 'Crear Juego'}</span>
            </button>

            <button
              type="button"
              className="modal-close-btn admin-live-close-btn"
              onClick={onClose}
              aria-label="Cerrar modal de creación"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {saveError && (
          <div className="admin-error-banner" style={{ margin: '16px 24px 0' }} role="alert">
            <AlertCircle size={16} />
            <span>{saveError}</span>
          </div>
        )}

        {/* Cabecera con banner y campos editables directamente */}
        <div className="modal-banner-header admin-live-banner">
          {newGameForm.banner_url ? (
            <img
              src={newGameForm.banner_url}
              alt="Banner del nuevo juego"
              className="modal-banner-img"
            />
          ) : (
            <div className="admin-banner-placeholder-view">
              <ImageIcon size={36} opacity={0.35} />
            </div>
          )}
          <div className="modal-banner-scrim" />

          {/* Botón para cambiar URL de la portada */}
          <div className="admin-banner-change-wrap">
            <button
              type="button"
              className="admin-banner-edit-trigger"
              onClick={() => setShowCreateBannerInput(!showCreateBannerInput)}
            >
              <ImageIcon size={14} aria-hidden="true" />
              <span>Cambiar Imagen de Portada</span>
            </button>

            {showCreateBannerInput && (
              <div className="admin-banner-input-popover">
                <label className="admin-field-label">URL del Banner</label>
                <input
                  type="text"
                  className="admin-input"
                  value={newGameForm.banner_url}
                  onChange={(e) => setNewGameForm({ ...newGameForm, banner_url: e.target.value })}
                  placeholder="https://..."
                />
              </div>
            )}
          </div>

          <div className="modal-header-info">
            <div className="modal-badges-row admin-live-badges-row">
              {/* Selector de estado interactivo */}
              <button
                type="button"
                className={`admin-status-pill-btn ${newGameForm.status === 'completed' ? 'badge-status-completed' : 'badge-status-dev'}`}
                onClick={() => setNewGameForm({
                  ...newGameForm,
                  status: newGameForm.status === 'completed' ? 'in_development' : 'completed'
                })}
                title="Haz clic para alternar entre Completo y En desarrollo"
              >
                {newGameForm.status === 'completed' ? 'Completo ▾' : 'En desarrollo ▾'}
              </button>

              <input
                type="text"
                className="admin-inline-pill"
                value={newGameForm.release_year}
                onChange={(e) => setNewGameForm({ ...newGameForm, release_year: e.target.value })}
                placeholder="Año"
                title="Año de lanzamiento"
              />

              <input
                type="text"
                className="admin-inline-pill"
                value={newGameForm.version}
                onChange={(e) => setNewGameForm({ ...newGameForm, version: e.target.value })}
                placeholder="Versión (ej. v1.0)"
                title="Versión actual"
              />
            </div>

            {/* Título editable directamente con la tipografía oficial del modal */}
            <div className="admin-title-edit-wrap">
              <input
                type="text"
                className="admin-live-title-input"
                value={newGameForm.title}
                onChange={(e) => setNewGameForm({ ...newGameForm, title: e.target.value })}
                placeholder="Escribe el Título del Nuevo Juego... *"
                required
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Barra de pestañas del modal (Idéntica a la edición en vivo) */}
        <div className="modal-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={createTab === 'overview'}
            className={`modal-tab-btn ${createTab === 'overview' ? 'active' : ''}`}
            onClick={() => setCreateTab('overview')}
          >
            <span>Información y Sinopsis</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={createTab === 'downloads'}
            className={`modal-tab-btn ${createTab === 'downloads' ? 'active' : ''}`}
            onClick={() => setCreateTab('downloads')}
          >
            <span>Descargas ({createDownloads.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={createTab === 'screenshots'}
            className={`modal-tab-btn ${createTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setCreateTab('screenshots')}
          >
            <span>Capturas ({createScreenshots.length})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={createTab === 'acknowledgements'}
            className={`modal-tab-btn ${createTab === 'acknowledgements' ? 'active' : ''}`}
            onClick={() => setCreateTab('acknowledgements')}
          >
            <span>Agradecimientos ({createAcknowledgements.length})</span>
          </button>
        </div>

        {/* Cuerpo del modal */}
        <div className="modal-body-content">
          {/* --- PESTAÑA 1: INFORMACIÓN & SINOPSIS --- */}
          {createTab === 'overview' && (
            <div className="modal-tab-pane">
              {/* Tira de especificaciones editables */}
              <div className="modal-specs-grid">
                <div className="spec-card">
                  <span className="spec-name">Versión</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={newGameForm.version}
                    onChange={(e) => setNewGameForm({ ...newGameForm, version: e.target.value })}
                    placeholder="v1.0"
                  />
                </div>
                <div className="spec-card">
                  <span className="spec-name">Año</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={newGameForm.release_year}
                    onChange={(e) => setNewGameForm({ ...newGameForm, release_year: e.target.value })}
                    placeholder="2026"
                  />
                </div>
                <div className="spec-card">
                  <span className="spec-name">Idiomas</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={newGameForm.languages}
                    onChange={(e) => setNewGameForm({ ...newGameForm, languages: e.target.value })}
                    placeholder="Español, English..."
                  />
                </div>
                <div className="spec-card">
                  <span className="spec-name">Plataformas</span>
                  <span className="spec-data" style={{ padding: '4px 0' }}>PC / Android</span>
                </div>
              </div>

              {/* Sinopsis editable directamente sobre el estilo del modal */}
              <div className="modal-section-block">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 className="modal-block-title" style={{ margin: 0 }}>Sinopsis de la Aventura</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Edición directa</span>
                </div>
                <textarea
                  className="admin-live-synopsis"
                  value={newGameForm.full_description}
                  onChange={(e) => setNewGameForm({ ...newGameForm, full_description: e.target.value })}
                  placeholder="Escribe la historia y descripción completa de la aventura..."
                />
              </div>

              {/* Características Destacadas iniciales */}
              <div className="modal-section-block" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h3 className="modal-block-title" style={{ margin: 0 }}>Características Destacadas</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Una por línea</span>
                </div>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: '85px' }}
                  value={newGameForm.features}
                  onChange={(e) => setNewGameForm({ ...newGameForm, features: e.target.value })}
                  placeholder="Megaevoluciones y Formas Regionales&#10;Modo Nuzlocke integrado&#10;Kanto expandido con nuevas rutas..."
                />
              </div>

              {/* Descripción Corta (Tarjeta de catálogo) */}
              <div className="modal-section-block" style={{ marginTop: '16px' }}>
                <h3 className="modal-block-title" style={{ marginBottom: '8px' }}>Descripción Corta (Tarjeta)</h3>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: '60px' }}
                  value={newGameForm.short_description}
                  onChange={(e) => setNewGameForm({ ...newGameForm, short_description: e.target.value })}
                  placeholder="Descripción corta para la tarjeta exterior del catálogo..."
                />
              </div>

              {/* Enlace de Guías */}
              <div className="modal-section-block" style={{ marginTop: '16px' }}>
                <h3 className="modal-block-title" style={{ marginBottom: '8px' }}>Enlace de Guías (Google Drive)</h3>
                <input
                  type="url"
                  className="admin-input"
                  value={newGameForm.guide_url}
                  onChange={(e) => setNewGameForm({ ...newGameForm, guide_url: e.target.value })}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              {/* Opción de publicación */}
              <div className="modal-section-block" style={{ marginTop: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
                  <input
                    type="checkbox"
                    checked={newGameForm.is_active}
                    onChange={(e) => setNewGameForm({ ...newGameForm, is_active: e.target.checked })}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: 'var(--color-text-primary)', fontWeight: 600 }}>
                    Publicar como juego activo visible en la web pública
                  </span>
                </label>
              </div>

              {/* Botones al pie del modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateGame}
                  disabled={isSaving}
                  style={{ padding: '9px 24px' }}
                >
                  <Plus size={16} />
                  <span>{isSaving ? 'Creando...' : 'Crear y Publicar Juego'}</span>
                </button>
              </div>
            </div>
          )}

          {/* --- PESTAÑA 2: DESCARGAS Y ENLACES --- */}
          {createTab === 'downloads' && (
            <div className="modal-tab-pane">
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Configura los enlaces de descarga. Se guardarán en el orden establecido al pulsar en "Crear Juego" ({createDownloads.length}):
              </p>

              {/* Lista de descargas temporales */}
              {createDownloads.length > 0 ? (
                <div className="downloads-list" style={{ marginBottom: '24px' }}>
                  {createDownloads.map((dl) => (
                    <div key={dl.id} className="download-card">
                      <div className="download-info">
                        <span className="dl-badge">
                          {dl.platform} • {dl.file_size || 'Archivo completo'}
                        </span>
                        <h4 className="dl-title">{dl.name}</h4>
                        <span className="dl-server-type">
                          Servidor: {dl.server_name}
                        </span>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          type="button"
                          className="admin-btn-icon-danger"
                          onClick={() => handleDeleteCreateDownload(dl.id)}
                          title="Eliminar de la lista temporal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--color-border)', marginBottom: '24px' }}>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                    No hay enlaces añadidos aún. Puedes agregar servidores de Mega, Mediafire, etc. ahora mismo usando el formulario inferior.
                  </p>
                </div>
              )}

              {/* Formulario para añadir descarga temporal */}
              <form onSubmit={handleAddCreateDownload} className="admin-add-dl-box">
                <span className="admin-field-label" style={{ marginBottom: '10px', display: 'block' }}>
                  + Añadir nuevo servidor / mirror de descarga
                </span>
                <div className="admin-grid-3">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Servidor (ej. Mega, Mediafire, Drive)"
                    value={newCreateDl.server_name}
                    onChange={(e) => setNewCreateDl({ ...newCreateDl, server_name: e.target.value })}
                    required
                  />
                  <select
                    className="admin-select"
                    value={newCreateDl.platform}
                    onChange={(e) => setNewCreateDl({ ...newCreateDl, platform: e.target.value })}
                  >
                    <option value="PC y Android">PC y Android</option>
                    <option value="PC">Solo PC</option>
                    <option value="Android">Solo Android</option>
                  </select>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Tamaño (ej. ~980 MB)"
                    value={newCreateDl.file_size}
                    onChange={(e) => setNewCreateDl({ ...newCreateDl, file_size: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="Enlace URL (https://mega.nz/...)"
                    value={newCreateDl.url}
                    onChange={(e) => setNewCreateDl({ ...newCreateDl, url: e.target.value })}
                    style={{ flex: 1 }}
                    required
                  />
                  <button type="submit" className="btn-primary" style={{ padding: '0 18px', whiteSpace: 'nowrap' }}>
                    <Plus size={16} />
                    <span>Añadir a la Lista</span>
                  </button>
                </div>
              </form>

              {/* Botones al pie del modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateGame}
                  disabled={isSaving}
                  style={{ padding: '9px 24px' }}
                >
                  <Plus size={16} />
                  <span>{isSaving ? 'Creando...' : 'Crear y Publicar Juego'}</span>
                </button>
              </div>
            </div>
          )}

          {/* --- PESTAÑA 3: CAPTURAS DE PANTALLA --- */}
          {createTab === 'screenshots' && (
            <div className="modal-tab-pane">
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Galería visual de capturas para este juego ({createScreenshots.length}):
              </p>

              <div className="screenshots-grid admin-live-shots-grid">
                {createScreenshots.map((shot) => (
                  <div key={shot.id} className="screenshot-thumb admin-live-shot-card">
                    <img src={shot.url} alt="" className="screenshot-img" />
                    <button
                      type="button"
                      className="admin-shot-delete"
                      onClick={() => handleDeleteCreateScreenshot(shot.id)}
                      title="Eliminar de la lista temporal"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Tarjeta rápida de añadir captura */}
                <form onSubmit={handleAddCreateScreenshot} className="admin-live-add-shot-card">
                  <ImageIcon size={24} style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontSize: '0.8125rem', textAlign: 'center' }}
                    placeholder="URL de la captura..."
                    value={newCreateShotUrl}
                    onChange={(e) => setNewCreateShotUrl(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
                    <Plus size={14} />
                    <span>Añadir</span>
                  </button>
                </form>
              </div>

              {/* Botones al pie del modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateGame}
                  disabled={isSaving}
                  style={{ padding: '9px 24px' }}
                >
                  <Plus size={16} />
                  <span>{isSaving ? 'Creando...' : 'Crear y Publicar Juego'}</span>
                </button>
              </div>
            </div>
          )}

          {/* --- PESTAÑA 4: AGRADECIMIENTOS --- */}
          {createTab === 'acknowledgements' && (
            <div className="modal-tab-pane">
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Menciones y agradecimientos especiales ({createAcknowledgements.length}). Si esta lista queda vacía, la pestaña permanecerá oculta en la web pública:
              </p>

              <div className="acknowledgements-container" style={{ marginBottom: '24px' }}>
                {createAcknowledgements.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      No has registrado agradecimientos para este juego todavía. Puedes añadirlos ahora con el formulario inferior.
                    </p>
                  </div>
                ) : (
                  createAcknowledgements.map((ack) => (
                    <div 
                      key={ack.id} 
                      className="acknowledgement-card"
                      style={{ position: 'relative' }}
                    >
                      <div className="ack-avatar-wrap">
                        {ack.imageUrl ? (
                          <img 
                            src={ack.imageUrl} 
                            alt="" 
                            className="ack-avatar-img"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                              if (e.currentTarget.nextSibling) {
                                e.currentTarget.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                        ) : null}
                        <div 
                          className="ack-avatar-placeholder" 
                          style={{ display: ack.imageUrl ? 'none' : 'flex' }}
                        >
                          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-accent)' }}>
                            {ack.description?.charAt(0)?.toUpperCase() || '?'}
                          </span>
                        </div>
                      </div>

                      <div className="ack-content" style={{ flex: 1 }}>
                        <p className="ack-description" style={{ margin: 0, whiteSpace: 'pre-line' }}>{ack.description}</p>
                        {ack.linkUrl && (
                          <a
                            href={ack.linkUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ack-link"
                            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontSize: '0.8125rem' }}
                          >
                            <span>Visitar perfil / recurso</span>
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <button
                          type="button"
                          className="admin-btn-icon-danger"
                          onClick={() => handleDeleteCreateAcknowledgement(ack.id)}
                          title="Eliminar de la lista temporal"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Formulario para añadir agradecimiento temporal */}
              <form onSubmit={handleAddCreateAcknowledgement} className="admin-add-dl-box">
                <span className="admin-field-label" style={{ marginBottom: '10px', display: 'block' }}>
                  + Añadir mención o agradecimiento especial
                </span>
                <div className="admin-field-group" style={{ marginBottom: '10px' }}>
                  <label className="admin-field-label">Descripción / Mención / Rol *</label>
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: '60px' }}
                    placeholder="Ej: Sprites y animaciones adicionales creados por @autor..."
                    value={newCreateAck.description}
                    onChange={(e) => setNewCreateAck({ ...newCreateAck, description: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-grid-2" style={{ marginBottom: '12px' }}>
                  <div className="admin-field-group">
                    <label className="admin-field-label">URL de Avatar / Imagen (Opcional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="https://..."
                      value={newCreateAck.image_url}
                      onChange={(e) => setNewCreateAck({ ...newCreateAck, image_url: e.target.value })}
                    />
                  </div>
                  <div className="admin-field-group">
                    <label className="admin-field-label">Enlace Web / Red Social (Opcional)</label>
                    <input
                      type="text"
                      className="admin-input"
                      placeholder="https://..."
                      value={newCreateAck.link_url}
                      onChange={(e) => setNewCreateAck({ ...newCreateAck, link_url: e.target.value })}
                    />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                  <Plus size={15} />
                  <span>Añadir a la Lista</span>
                </button>
              </form>

              {/* Botones al pie del modal */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--color-border)' }}>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={onClose}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleCreateGame}
                  disabled={isSaving}
                  style={{ padding: '9px 24px' }}
                >
                  <Plus size={16} />
                  <span>{isSaving ? 'Creando...' : 'Crear y Publicar Juego'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
