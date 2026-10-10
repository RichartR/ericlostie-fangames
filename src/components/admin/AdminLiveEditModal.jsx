import React from 'react';
import { 
  Pencil, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  X, 
  Image as ImageIcon, 
  BookOpen, 
  Plus, 
  Check, 
  Trash2, 
  ExternalLink 
} from 'lucide-react';

export default function AdminLiveEditModal({
  activeGame,
  formData,
  setFormData,
  modalTab,
  setModalTab,
  showBannerInput,
  setShowBannerInput,
  saveMessage,
  saveError,
  isSaving,
  handleSaveGame,
  handleCloseEditModal,
  // Features
  newFeatureText,
  setNewFeatureText,
  editingFeatureId,
  setEditingFeatureId,
  editFeatureText,
  setEditFeatureText,
  isSavingFeature,
  handleCreateFeature,
  handleStartEditFeature,
  handleSaveEditFeature,
  handleDeleteFeature,
  // Downloads
  newDl,
  setNewDl,
  editingDlId,
  editDlForm,
  setEditDlForm,
  savingDlId,
  handleAddDownload,
  handleDeleteDownload,
  handleStartEditDownload,
  handleCancelEditDownload,
  handleSaveEditedDownload,
  // Screenshots
  newShotUrl,
  setNewShotUrl,
  handleAddScreenshot,
  handleDeleteScreenshot,
  // Acknowledgements
  newAck,
  setNewAck,
  editingAckId,
  editAckForm,
  setEditAckForm,
  savingAckId,
  handleAddAcknowledgement,
  handleDeleteAcknowledgement,
  handleStartEditAcknowledgement,
  handleCancelEditAcknowledgement,
  handleSaveEditedAcknowledgement
}) {
  if (!activeGame) return null;

  return (
    <div 
      className="modal-backdrop admin-live-backdrop" 
      onClick={handleCloseEditModal}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="modal-card admin-live-modal-card" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra superior flotante de administración */}
        <div className="admin-live-modal-bar">
          <div className="admin-live-tag">
            <Pencil size={13} aria-hidden="true" />
            <span>MODO EDICIÓN EN VIVO</span>
          </div>

          {saveMessage && (
            <div className="admin-live-msg success" role="status">
              <CheckCircle2 size={14} aria-hidden="true" />
              <span>{saveMessage}</span>
            </div>
          )}

          {saveError && (
            <div className="admin-live-msg error" role="alert">
              <AlertCircle size={14} aria-hidden="true" />
              <span>{saveError}</span>
            </div>
          )}

          <div className="admin-live-bar-actions">
            <button
              type="button"
              className="btn-primary admin-live-save-btn"
              onClick={handleSaveGame}
              disabled={isSaving}
            >
              <Save size={15} aria-hidden="true" />
              <span>{isSaving ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>

            <button
              type="button"
              className="modal-close-btn admin-live-close-btn"
              onClick={handleCloseEditModal}
              aria-label="Cerrar modal de edición"
            >
              <X size={18} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Cabecera con banner y campos directamente editables */}
        <div className="modal-banner-header admin-live-banner">
          <img
            src={formData.banner_url || activeGame.banner}
            alt={`Banner de ${formData.title}`}
            className="modal-banner-img"
          />
          <div className="modal-banner-scrim" />

          {/* Botón para cambiar URL de la portada */}
          <div className="admin-banner-change-wrap">
            <button
              type="button"
              className="admin-banner-edit-trigger"
              onClick={() => setShowBannerInput(!showBannerInput)}
            >
              <ImageIcon size={14} aria-hidden="true" />
              <span>Cambiar Imagen de Portada</span>
            </button>

            {showBannerInput && (
              <div className="admin-banner-input-popover">
                <label className="admin-field-label">URL del Banner</label>
                <input
                  type="text"
                  className="admin-input"
                  value={formData.banner_url}
                  onChange={(e) => setFormData({ ...formData, banner_url: e.target.value })}
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
                className={`admin-status-pill-btn ${formData.status === 'completed' ? 'badge-status-completed' : 'badge-status-dev'}`}
                onClick={() => setFormData({
                  ...formData,
                  status: formData.status === 'completed' ? 'in_development' : 'completed'
                })}
                title="Haz clic para alternar entre Completo y En desarrollo"
              >
                {formData.status === 'completed' ? 'Completo ▾' : 'En desarrollo ▾'}
              </button>

              <input
                type="text"
                className="admin-inline-pill"
                value={formData.release_year}
                onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                placeholder="Año"
                title="Año de lanzamiento"
              />

              <input
                type="text"
                className="admin-inline-pill"
                value={formData.version}
                onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                placeholder="Versión (ej. v1.12)"
                title="Versión actual"
              />
            </div>

            {/* Título editable directamente con la tipografía oficial del modal */}
            <input
              type="text"
              className="modal-game-title admin-live-title-input"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Título del juego..."
              required
            />
          </div>
        </div>

        {/* Barra de pestañas del modal */}
        <div className="modal-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={modalTab === 'overview'}
            className={`modal-tab-btn ${modalTab === 'overview' ? 'active' : ''}`}
            onClick={() => setModalTab('overview')}
          >
            <span>Información y Sinopsis</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modalTab === 'downloads'}
            className={`modal-tab-btn ${modalTab === 'downloads' ? 'active' : ''}`}
            onClick={() => setModalTab('downloads')}
          >
            <span>Descargas ({activeGame.downloads?.length || 0})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modalTab === 'screenshots'}
            className={`modal-tab-btn ${modalTab === 'screenshots' ? 'active' : ''}`}
            onClick={() => setModalTab('screenshots')}
          >
            <span>Capturas ({activeGame.screenshots?.length || 0})</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={modalTab === 'acknowledgements'}
            className={`modal-tab-btn ${modalTab === 'acknowledgements' ? 'active' : ''}`}
            onClick={() => setModalTab('acknowledgements')}
          >
            <span>Agradecimientos ({activeGame.acknowledgements?.length || 0})</span>
          </button>
        </div>

        {/* Cuerpo del modal */}
        <div className="modal-body-content">
          {/* --- PESTAÑA 1: INFORMACIÓN & SINOPSIS --- */}
          {modalTab === 'overview' && (
            <div className="modal-tab-pane">
              {/* Tira de especificaciones editables */}
              <div className="modal-specs-grid">
                <div className="spec-card">
                  <span className="spec-name">Versión</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={formData.version}
                    onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    placeholder="v1.0"
                  />
                </div>
                <div className="spec-card">
                  <span className="spec-name">Año</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={formData.release_year}
                    onChange={(e) => setFormData({ ...formData, release_year: e.target.value })}
                    placeholder="2023"
                  />
                </div>
                <div className="spec-card">
                  <span className="spec-name">Idiomas</span>
                  <input
                    type="text"
                    className="admin-spec-input"
                    value={formData.languages}
                    onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
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
                  value={formData.full_description}
                  onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                  placeholder="Escribe la historia y descripción completa de la aventura..."
                />
              </div>

              {/* Características Destacadas editables en vivo */}
              <div className="modal-section-block" style={{ marginTop: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <h3 className="modal-block-title" style={{ margin: 0 }}>
                    Características Destacadas ({activeGame.gameFeatures?.length || 0})
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>
                    Modifica, elimina o añade puntos clave
                  </span>
                </div>

                {/* Formulario para añadir nueva característica */}
                <form onSubmit={handleCreateFeature} style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Añadir nueva característica (ej. Más de 600 Pokémon capturables...)"
                    value={newFeatureText}
                    onChange={(e) => setNewFeatureText(e.target.value)}
                    style={{ flex: 1 }}
                  />
                  <button
                    type="submit"
                    className="btn-secondary"
                    disabled={isSavingFeature || !newFeatureText.trim()}
                    style={{ flexShrink: 0, padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={16} aria-hidden="true" />
                    <span>Añadir</span>
                  </button>
                </form>

                {/* Lista de características con estilo fiel al modal original */}
                <div className="features-list admin-features-list">
                  {activeGame.gameFeatures && activeGame.gameFeatures.length > 0 ? (
                    activeGame.gameFeatures.map((feat) => {
                      const isEditing = editingFeatureId === feat.id;
                      if (isEditing) {
                        return (
                          <div key={feat.id} className="feature-row admin-feature-row-editing">
                            <input
                              type="text"
                              className="admin-input"
                              value={editFeatureText}
                              onChange={(e) => setEditFeatureText(e.target.value)}
                              autoFocus
                              style={{ flex: 1 }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleSaveEditFeature(feat.id);
                                } else if (e.key === 'Escape') {
                                  setEditingFeatureId(null);
                                }
                              }}
                            />
                            <button
                              type="button"
                              className="admin-btn-icon-success"
                              onClick={() => handleSaveEditFeature(feat.id)}
                              title="Guardar cambios"
                              disabled={isSavingFeature}
                            >
                              <Check size={16} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="admin-btn-icon-secondary"
                              onClick={() => setEditingFeatureId(null)}
                              title="Cancelar edición"
                            >
                              <X size={16} aria-hidden="true" />
                            </button>
                          </div>
                        );
                      }
                      return (
                        <div key={feat.id} className="feature-row admin-feature-row">
                          <div className="feature-check" aria-hidden="true">
                            <Check size={14} />
                          </div>
                          <span className="admin-feature-text" style={{ flex: 1 }}>{feat.text}</span>
                          <div className="admin-feature-actions">
                            <button
                              type="button"
                              className="admin-btn-icon-secondary admin-feature-btn"
                              onClick={() => handleStartEditFeature(feat)}
                              title="Modificar característica"
                            >
                              <Pencil size={13} aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className="admin-btn-icon-danger admin-feature-btn"
                              onClick={() => handleDeleteFeature(feat)}
                              title="Eliminar característica"
                            >
                              <Trash2 size={13} aria-hidden="true" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0, fontStyle: 'italic' }}>
                      No hay características añadidas aún. Usa el formulario superior para añadir la primera.
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción Corta (Tarjeta de catálogo) */}
              <div className="modal-section-block" style={{ marginTop: '16px' }}>
                <h3 className="modal-block-title" style={{ marginBottom: '8px' }}>Descripción Corta (Tarjeta)</h3>
                <textarea
                  className="admin-textarea"
                  style={{ minHeight: '60px' }}
                  value={formData.short_description}
                  onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                  placeholder="Descripción corta visible en la tarjeta exterior..."
                />
              </div>

              {/* Enlace de Guías */}
              <div className="modal-section-block" style={{ marginTop: '16px' }}>
                <h3 className="modal-block-title" style={{ marginBottom: '8px' }}>Enlace de Guías (Google Drive)</h3>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="url"
                    className="admin-input"
                    value={formData.guide_url}
                    onChange={(e) => setFormData({ ...formData, guide_url: e.target.value })}
                    placeholder="https://drive.google.com/..."
                    style={{ flex: 1 }}
                  />
                  {formData.guide_url && (
                    <a
                      href={formData.guide_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary"
                      style={{ flexShrink: 0, padding: '0 16px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <BookOpen size={15} />
                      <span>Probar</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* --- PESTAÑA 2: DESCARGAS Y ENLACES --- */}
          {modalTab === 'downloads' && (
            <div className="modal-tab-pane">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                  Tarjetas de descarga configuradas para este juego:
                </p>
              </div>

              {/* Lista visual de tarjetas de descarga */}
              {activeGame.downloads && activeGame.downloads.length > 0 ? (
                <div className="downloads-list" style={{ marginBottom: '24px' }}>
                  {activeGame.downloads.map((dl) => {
                    const isEditing = editingDlId === dl.id;
                    if (isEditing) {
                      return (
                        <div key={dl.id} className="download-card admin-dl-card-editing">
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <div className="admin-grid-3">
                              <select
                                className="admin-select"
                                value={editDlForm.platform}
                                onChange={(e) => setEditDlForm({ ...editDlForm, platform: e.target.value })}
                              >
                                <option value="PC y Android">PC y Android</option>
                                <option value="PC">Solo PC</option>
                                <option value="Android">Solo Android</option>
                              </select>
                              <input
                                type="text"
                                className="admin-input"
                                value={editDlForm.server_name}
                                onChange={(e) => setEditDlForm({ ...editDlForm, server_name: e.target.value })}
                                placeholder="Servidor (Mega, Mediafire)"
                                required
                              />
                              <input
                                type="text"
                                className="admin-input"
                                value={editDlForm.file_size}
                                onChange={(e) => setEditDlForm({ ...editDlForm, file_size: e.target.value })}
                                placeholder="Tamaño (~900 MB)"
                              />
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input
                                type="url"
                                className="admin-input"
                                value={editDlForm.url}
                                onChange={(e) => setEditDlForm({ ...editDlForm, url: e.target.value })}
                                placeholder="https://..."
                                style={{ flex: 1 }}
                                required
                              />
                              <button
                                type="button"
                                className="btn-primary"
                                onClick={() => handleSaveEditedDownload(dl.id)}
                                disabled={savingDlId === dl.id}
                                style={{ padding: '0 16px' }}
                              >
                                <Check size={16} />
                                <span>Guardar</span>
                              </button>
                              <button
                                type="button"
                                className="btn-secondary"
                                onClick={handleCancelEditDownload}
                                style={{ padding: '0 14px' }}
                              >
                                <X size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div key={dl.id} className="download-card">
                        <div className="download-info">
                          <span className="dl-badge">
                            {dl.platform} • {dl.size || 'Archivo completo'}
                          </span>
                          <h4 className="dl-title">{dl.name}</h4>
                          <span className="dl-server-type">
                            Servidor: {dl.serverName}
                          </span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn-secondary dl-action-btn"
                            onClick={() => handleStartEditDownload(dl)}
                            title="Editar servidor o enlace"
                          >
                            <Pencil size={15} />
                            <span>Editar</span>
                          </button>
                          <button
                            type="button"
                            className="admin-btn-icon-danger"
                            onClick={() => handleDeleteDownload(dl.id)}
                            title="Eliminar servidor"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '20px' }}>
                  No hay enlaces de descarga configurados.
                </p>
              )}

              {/* Formulario para añadir nueva descarga */}
              <form onSubmit={handleAddDownload} className="admin-add-dl-box">
                <span className="admin-field-label" style={{ marginBottom: '10px', display: 'block' }}>
                  + Añadir nuevo servidor / mirror de descarga
                </span>
                <div className="admin-grid-3">
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Servidor (ej. Mega, Mediafire, Drive)"
                    value={newDl.server_name}
                    onChange={(e) => setNewDl({ ...newDl, server_name: e.target.value })}
                    required
                  />
                  <select
                    className="admin-select"
                    value={newDl.platform}
                    onChange={(e) => setNewDl({ ...newDl, platform: e.target.value })}
                  >
                    <option value="PC y Android">PC y Android</option>
                    <option value="PC">Solo PC</option>
                    <option value="Android">Solo Android</option>
                  </select>
                  <input
                    type="text"
                    className="admin-input"
                    placeholder="Tamaño (ej. ~980 MB)"
                    value={newDl.file_size}
                    onChange={(e) => setNewDl({ ...newDl, file_size: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="URL de descarga (https://mega.nz/...)"
                    value={newDl.url}
                    onChange={(e) => setNewDl({ ...newDl, url: e.target.value })}
                    style={{ flex: 1 }}
                    required
                  />
                  <button type="submit" className="btn-secondary" style={{ flexShrink: 0, padding: '0 18px' }}>
                    <Plus size={16} />
                    <span>Añadir Servidor</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* --- PESTAÑA 3: CAPTURAS DE PANTALLA --- */}
          {modalTab === 'screenshots' && (
            <div className="modal-tab-pane">
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Galería visual de capturas ({activeGame.screenshots?.length || 0}):
              </p>

              <div className="screenshots-grid admin-live-shots-grid">
                {activeGame.screenshots && activeGame.screenshots.map((shot) => (
                  <div key={shot.id} className="screenshot-thumb admin-live-shot-card">
                    <img src={shot.url} alt="" className="screenshot-img" />
                    <button
                      type="button"
                      className="admin-shot-delete"
                      onClick={() => handleDeleteScreenshot(shot.id)}
                      title="Eliminar captura"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Tarjeta rápida de añadir captura */}
                <form onSubmit={handleAddScreenshot} className="admin-live-add-shot-card">
                  <ImageIcon size={24} style={{ color: 'var(--color-text-muted)' }} />
                  <input
                    type="text"
                    className="admin-input"
                    style={{ fontSize: '0.8125rem', textAlign: 'center' }}
                    placeholder="URL de la captura..."
                    value={newShotUrl}
                    onChange={(e) => setNewShotUrl(e.target.value)}
                    required
                  />
                  <button type="submit" className="btn-secondary" style={{ padding: '6px 14px', fontSize: '0.8125rem' }}>
                    <Plus size={14} />
                    <span>Añadir</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* --- PESTAÑA 4: AGRADECIMIENTOS --- */}
          {modalTab === 'acknowledgements' && (
            <div className="modal-tab-pane">
              <p style={{ margin: '0 0 16px 0', fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>
                Menciones y agradecimientos especiales ({activeGame.acknowledgements?.length || 0}). Si esta lista está vacía, la pestaña no se mostrará en la web pública.
              </p>

              <div className="acknowledgements-container" style={{ marginBottom: '24px' }}>
                {(!activeGame.acknowledgements || activeGame.acknowledgements.length === 0) ? (
                  <div style={{ padding: '24px', textAlign: 'center', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '12px', border: '1px dashed var(--color-border)' }}>
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', margin: 0 }}>
                      No hay agradecimientos registrados para este juego. (La pestaña permanecerá oculta en la web pública).
                    </p>
                  </div>
                ) : (
                  activeGame.acknowledgements.map((ack) => (
                    <div 
                      key={ack.id} 
                      className={`acknowledgement-card ${editingAckId === ack.id ? 'admin-ack-card-editing' : ''}`}
                      style={{ position: 'relative' }}
                    >
                      {editingAckId === ack.id ? (
                        /* Modo edición inline */
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
                          <div className="admin-field-group">
                            <label className="admin-field-label">Descripción / Mención *</label>
                            <textarea
                              className="admin-textarea"
                              style={{ minHeight: '60px' }}
                              value={editAckForm.description}
                              onChange={(e) => setEditAckForm({ ...editAckForm, description: e.target.value })}
                              required
                            />
                          </div>
                          <div className="admin-grid-2">
                            <div className="admin-field-group">
                              <label className="admin-field-label">URL de Imagen / Avatar (Opcional)</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="https://..."
                                value={editAckForm.image_url}
                                onChange={(e) => setEditAckForm({ ...editAckForm, image_url: e.target.value })}
                              />
                            </div>
                            <div className="admin-field-group">
                              <label className="admin-field-label">Enlace Web / Red Social (Opcional)</label>
                              <input
                                type="text"
                                className="admin-input"
                                placeholder="https://..."
                                value={editAckForm.link_url}
                                onChange={(e) => setEditAckForm({ ...editAckForm, link_url: e.target.value })}
                              />
                            </div>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                            <button
                              type="button"
                              className="btn-secondary"
                              onClick={handleCancelEditAcknowledgement}
                              style={{ padding: '6px 12px', fontSize: '0.8125rem' }}
                            >
                              <X size={14} />
                              <span>Cancelar</span>
                            </button>
                            <button
                              type="button"
                              className="btn-primary"
                              onClick={() => handleSaveEditedAcknowledgement(ack.id)}
                              disabled={savingAckId === ack.id}
                              style={{ padding: '6px 14px', fontSize: '0.8125rem' }}
                            >
                              <Check size={14} />
                              <span>{savingAckId === ack.id ? 'Guardando...' : 'Guardar'}</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Modo visualización con acciones de administración */
                        <>
                          <div className="ack-avatar-wrap">
                            {ack.imageUrl ? (
                              <img 
                                src={ack.imageUrl} 
                                alt="Avatar o icono de agradecimiento" 
                                className="ack-avatar-img"
                                loading="lazy"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  if (e.target.nextElementSibling) {
                                    e.target.nextElementSibling.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div 
                              className="ack-avatar-placeholder" 
                              style={{ display: ack.imageUrl ? 'none' : 'flex' }}
                            >
                            </div>
                          </div>

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

                          <div style={{ display: 'flex', gap: '6px', marginLeft: 'auto', alignSelf: 'flex-start' }}>
                            <button
                              type="button"
                              className="admin-btn-icon-secondary"
                              onClick={() => handleStartEditAcknowledgement(ack)}
                              title="Editar agradecimiento"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              type="button"
                              className="admin-btn-icon-danger"
                              onClick={() => handleDeleteAcknowledgement(ack.id)}
                              title="Eliminar agradecimiento"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Formulario para añadir nuevo agradecimiento */}
              <form onSubmit={handleAddAcknowledgement} className="admin-add-dl-box">
                <span className="admin-field-label" style={{ marginBottom: '10px', display: 'block' }}>
                  + Añadir nuevo agradecimiento
                </span>
                <div className="admin-field-group" style={{ marginBottom: '12px' }}>
                  <textarea
                    className="admin-textarea"
                    style={{ minHeight: '60px' }}
                    placeholder="Descripción o mención especial (ej. Agradecimiento a @SpriteArtist por los sprites de combate)..."
                    value={newAck.description}
                    onChange={(e) => setNewAck({ ...newAck, description: e.target.value })}
                    required
                  />
                </div>
                <div className="admin-grid-2" style={{ marginBottom: '12px' }}>
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="URL de imagen/avatar (opcional)"
                    value={newAck.image_url}
                    onChange={(e) => setNewAck({ ...newAck, image_url: e.target.value })}
                  />
                  <input
                    type="url"
                    className="admin-input"
                    placeholder="URL de enlace web o red social (opcional)"
                    value={newAck.link_url}
                    onChange={(e) => setNewAck({ ...newAck, link_url: e.target.value })}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn-secondary" style={{ padding: '8px 18px', fontSize: '0.875rem' }}>
                    <Plus size={15} />
                    <span>Añadir Agradecimiento</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
