import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { 
  signInAdmin, 
  signOutAdmin, 
  getAdminSession, 
  onAuthStateChange,
  updateGame,
  updateGamesOrder,
  createGame,
  deleteGame,
  toggleGameActive,
  createDownload,
  updateDownload,
  deleteDownload,
  createScreenshot,
  deleteScreenshot,
  createAcknowledgement,
  updateAcknowledgement,
  deleteAcknowledgement,
  createGameFeature,
  updateGameFeature,
  deleteGameFeature
} from '../services/supabaseService';
import AdminLogin from './admin/AdminLogin';
import AdminNavbar from './admin/AdminNavbar';
import AdminGameCards from './admin/AdminGameCards';
import AdminLiveEditModal from './admin/AdminLiveEditModal';
import AdminCreateModal from './admin/AdminCreateModal';
import './GameDetailModal.css';
import './AdminPortal.css';

export default function AdminPortal({ games, onDataUpdated, onClose }) {
  const [session, setSession] = useState(null);
  const [loadingSession, setLoadingSession] = useState(true);

  // Estados de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Modos de vista: 'cards' (listado visual), 'edit' (modal interactivo en vivo), 'create' (modal nuevo juego)
  const [viewMode, setViewMode] = useState('cards');
  
  // Pestaña de filtrado en el listado: 'active' (visibles en web) vs 'archived' (ocultos)
  const [adminTab, setAdminTab] = useState('active');

  // Pestaña activa dentro del modal en vivo: 'overview' | 'downloads' | 'screenshots' | 'acknowledgements'
  const [modalTab, setModalTab] = useState('overview');
  const [showBannerInput, setShowBannerInput] = useState(false);
  const [showCreateBannerInput, setShowCreateBannerInput] = useState(false);

  // Estados de gestión
  const [selectedGameId, setSelectedGameId] = useState(games[0]?.id || '');
  const currentEditingGameIdRef = useRef(null);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Juego activo en edición
  const activeGame = games.find((g) => g.id === selectedGameId) || games[0];
  const [formData, setFormData] = useState({
    title: '',
    version: '',
    release_year: '',
    status: 'completed',
    languages: 'Español',
    banner_url: '',
    guide_url: '',
    short_description: '',
    full_description: ''
  });

  // Formulario de creación de nuevo juego (modal en vivo)
  const [newGameForm, setNewGameForm] = useState({
    title: '',
    version: 'v1.0',
    release_year: '2026',
    status: 'completed',
    languages: 'Español',
    banner_url: '',
    guide_url: '',
    short_description: '',
    full_description: '',
    features: '',
    is_active: true
  });

  // Pestaña activa en el modal de creación: 'overview' | 'downloads' | 'screenshots' | 'acknowledgements'
  const [createTab, setCreateTab] = useState('overview');

  // Elementos temporales durante la creación de un nuevo juego (se guardan en memoria hasta confirmar)
  const [createDownloads, setCreateDownloads] = useState([]);
  const [newCreateDl, setNewCreateDl] = useState({
    server_name: 'Mega',
    platform: 'PC y Android',
    url: '',
    file_size: '~900 MB',
    is_primary: false
  });

  const [createScreenshots, setCreateScreenshots] = useState([]);
  const [newCreateShotUrl, setNewCreateShotUrl] = useState('');

  const [createAcknowledgements, setCreateAcknowledgements] = useState([]);
  const [newCreateAck, setNewCreateAck] = useState({
    description: '',
    image_url: '',
    link_url: ''
  });

  // Formulario de nueva descarga en modo edición
  const [newDl, setNewDl] = useState({
    server_name: 'Mega',
    platform: 'PC y Android',
    url: '',
    file_size: '~900 MB',
    is_primary: false
  });

  // Estado de edición en línea de descarga
  const [editingDlId, setEditingDlId] = useState(null);
  const [editDlForm, setEditDlForm] = useState({
    server_name: '',
    platform: 'PC y Android',
    url: '',
    file_size: '',
    is_primary: false
  });
  const [savingDlId, setSavingDlId] = useState(null);

  // Estado de arrastrar y soltar (Drag & Drop) para definir orden
  const [draggedGameId, setDraggedGameId] = useState(null);
  const [draggedGame, setDraggedGame] = useState(null);
  const [dragPointer, setDragPointer] = useState(null);
  const [displayGames, setDisplayGames] = useState(null);
  const dragStartRef = useRef(null);
  const wasDraggingRef = useRef(false);

  // Formulario de nueva captura
  const [newShotUrl, setNewShotUrl] = useState('');

  // Formulario de nuevo agradecimiento
  const [newAck, setNewAck] = useState({
    description: '',
    image_url: '',
    link_url: ''
  });

  // Estado de edición en línea de agradecimiento
  const [editingAckId, setEditingAckId] = useState(null);
  const [editAckForm, setEditAckForm] = useState({
    description: '',
    image_url: '',
    link_url: ''
  });
  const [savingAckId, setSavingAckId] = useState(null);

  // Estado para gestión de Características Destacadas
  const [newFeatureText, setNewFeatureText] = useState('');
  const [editingFeatureId, setEditingFeatureId] = useState(null);
  const [editFeatureText, setEditFeatureText] = useState('');
  const [isSavingFeature, setIsSavingFeature] = useState(false);

  // Separación de juegos activos y archivados
  const activeGames = games.filter((g) => g.isActive !== false);
  const archivedGames = games.filter((g) => g.isActive === false);

  useEffect(() => {
    getAdminSession().then((sess) => {
      setSession(sess);
      setLoadingSession(false);
    });

    const { data: { subscription } } = onAuthStateChange((_event, sess) => {
      setSession(sess);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sincronizar datos del formulario solo al cambiar de juego activo
  useEffect(() => {
    if (activeGame && selectedGameId !== currentEditingGameIdRef.current) {
      setFormData({
        title: activeGame.title || '',
        version: activeGame.version || '',
        release_year: activeGame.year === 'En desarrollo' ? '' : activeGame.year,
        status: activeGame.status || 'completed',
        languages: (activeGame.languages || ['Español']).join(', '),
        banner_url: activeGame.banner || '',
        guide_url: activeGame.guideUrl || '',
        short_description: activeGame.shortDescription || '',
        full_description: activeGame.fullDescription || ''
      });
      currentEditingGameIdRef.current = selectedGameId;
      setShowBannerInput(false);
      setSaveMessage('');
      setSaveError('');
    }
  }, [selectedGameId, activeGame]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');

    try {
      await signInAdmin(email, password);
    } catch (err) {
      setLoginError(err.message || 'Error al iniciar sesión. Revisa tus credenciales.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOutAdmin();
      setSession(null);
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    }
  };

  // Helper para armar el payload de actualización del juego
  const getGameUpdatesPayload = () => {
    const languagesArray = (formData.languages || 'Español')
      .split(',')
      .map((l) => l.trim())
      .filter(Boolean);

    return {
      title: formData.title,
      version: formData.version,
      release_year: formData.release_year ? parseInt(formData.release_year, 10) : null,
      status: formData.status,
      languages: languagesArray,
      banner_url: formData.banner_url,
      guide_url: formData.guide_url || null,
      short_description: formData.short_description,
      full_description: formData.full_description
    };
  };

  // Abrir modal de edición en vivo cargando los datos del juego
  const handleOpenEdit = (game) => {
    setSelectedGameId(game.id);
    currentEditingGameIdRef.current = game.id;
    setFormData({
      title: game.title || '',
      version: game.version || '',
      release_year: game.year === 'En desarrollo' ? '' : game.year,
      status: game.status || 'completed',
      languages: (game.languages || ['Español']).join(', '),
      banner_url: game.banner || '',
      guide_url: game.guideUrl || '',
      short_description: game.shortDescription || '',
      full_description: game.fullDescription || ''
    });
    setModalTab('overview');
    setShowBannerInput(false);
    setSaveMessage('');
    setSaveError('');
    setViewMode('edit');
  };

  // Cerrar modal de edición en vivo
  const handleCloseEditModal = () => {
    currentEditingGameIdRef.current = null;
    setViewMode('cards');
  };

  // Handlers para reordenar juegos de forma orgánica y 100% nítida (Pointer Events)
  const onWindowPointerMove = (e) => {
    if (!dragStartRef.current) return;
    const info = dragStartRef.current;

    if (!info.hasStarted) {
      const distance = Math.hypot(e.clientX - info.startX, e.clientY - info.startY);
      if (distance < 6) return;

      info.hasStarted = true;
      wasDraggingRef.current = true;
      document.body.style.userSelect = 'none';
      document.body.style.cursor = 'grabbing';
      setDraggedGame(info.game);
      setDraggedGameId(info.game.id);
      setDisplayGames(info.initialList);
    }

    setDragPointer({
      x: e.clientX,
      y: e.clientY,
      offsetX: info.offsetX,
      offsetY: info.offsetY,
      width: info.width,
      height: info.height,
    });

    // Detectar qué tarjeta está bajo el cursor en tiempo real para desplazar las demás
    const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
    const targetCard = elementUnder?.closest('.admin-game-card[data-game-id]');
    if (targetCard) {
      const targetId = targetCard.getAttribute('data-game-id');
      if (targetId && targetId !== info.game.id) {
        setDisplayGames((prev) => {
          const list = prev || info.initialList;
          const sourceIdx = list.findIndex((g) => g.id === info.game.id);
          const targetIdx = list.findIndex((g) => g.id === targetId);
          if (sourceIdx === -1 || targetIdx === -1 || sourceIdx === targetIdx) return list;
          const reordered = [...list];
          const [moved] = reordered.splice(sourceIdx, 1);
          reordered.splice(targetIdx, 0, moved);
          info.currentOrderedList = reordered;
          return reordered;
        });
      }
    }
  };

  const onWindowPointerUp = async () => {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', onWindowPointerUp);
    window.removeEventListener('pointercancel', onWindowPointerUp);

    document.body.style.userSelect = '';
    document.body.style.cursor = '';

    if (!dragStartRef.current) return;
    const { hasStarted, initialList, currentOrderedList } = dragStartRef.current;
    dragStartRef.current = null;

    if (!hasStarted) {
      return;
    }

    setDragPointer(null);
    setDraggedGame(null);
    setDraggedGameId(null);

    if (currentOrderedList && currentOrderedList.length > 0) {
      const changed = currentOrderedList.some((g, idx) => g.id !== initialList[idx]?.id);
      if (changed) {
        try {
          setSaveMessage('Actualizando orden de los juegos...');
          await updateGamesOrder(currentOrderedList.map((g) => g.id));
          await onDataUpdated();
          setSaveMessage('¡Orden de los juegos actualizado con éxito!');
          setTimeout(() => setSaveMessage(''), 3000);
        } catch (err) {
          setSaveError(err.message || 'Error al actualizar el orden de los juegos');
        }
      }
    }
    setDisplayGames(null);

    setTimeout(() => {
      wasDraggingRef.current = false;
    }, 100);
  };

  const handleCardPointerDown = (e, game) => {
    if (e.target.closest('button, a, input, select, textarea')) return;
    if (e.button !== 0) return;

    const currentList = adminTab === 'active' ? activeGames : archivedGames;
    const cardElement = e.currentTarget;
    const rect = cardElement.getBoundingClientRect();

    dragStartRef.current = {
      game,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      hasStarted: false,
      initialList: currentList,
      currentOrderedList: currentList,
    };

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onWindowPointerUp);
    window.addEventListener('pointercancel', onWindowPointerUp);
  };

  // Guardar cambios en el juego desde el modal en vivo
  const handleSaveGame = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!activeGame) return;

    setIsSaving(true);
    setSaveMessage('');
    setSaveError('');

    try {
      await updateGame(activeGame.id, getGameUpdatesPayload());
      setSaveMessage('¡Cambios guardados con éxito!');
      await onDataUpdated();
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar el juego');
    } finally {
      setIsSaving(false);
    }
  };

  // Manejadores para añadir/eliminar elementos temporales durante la creación
  const handleAddCreateDownload = (e) => {
    e.preventDefault();
    if (!newCreateDl.server_name || !newCreateDl.url) return;
    setCreateDownloads((prev) => [
      ...prev,
      {
        id: `temp_dl_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        server_name: newCreateDl.server_name.trim(),
        serverName: newCreateDl.server_name.trim(),
        platform: newCreateDl.platform,
        url: newCreateDl.url.trim(),
        file_size: newCreateDl.file_size.trim() || '~900 MB',
        size: newCreateDl.file_size.trim() || '~900 MB',
        name: `${newCreateDl.platform} - ${newCreateDl.server_name.trim()}`
      }
    ]);
    setNewCreateDl({
      server_name: 'Mega',
      platform: 'PC y Android',
      url: '',
      file_size: '~900 MB',
      is_primary: false
    });
  };

  const handleDeleteCreateDownload = (tempId) => {
    setCreateDownloads((prev) => prev.filter((dl) => dl.id !== tempId));
  };

  const handleAddCreateScreenshot = (e) => {
    e.preventDefault();
    if (!newCreateShotUrl.trim()) return;
    setCreateScreenshots((prev) => [
      ...prev,
      {
        id: `temp_shot_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        url: newCreateShotUrl.trim()
      }
    ]);
    setNewCreateShotUrl('');
  };

  const handleDeleteCreateScreenshot = (tempId) => {
    setCreateScreenshots((prev) => prev.filter((s) => s.id !== tempId));
  };

  const handleAddCreateAcknowledgement = (e) => {
    e.preventDefault();
    if (!newCreateAck.description.trim()) return;
    setCreateAcknowledgements((prev) => [
      ...prev,
      {
        id: `temp_ack_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        description: newCreateAck.description.trim(),
        image_url: newCreateAck.image_url.trim() || null,
        imageUrl: newCreateAck.image_url.trim() || null,
        link_url: newCreateAck.link_url.trim() || null,
        linkUrl: newCreateAck.link_url.trim() || null
      }
    ]);
    setNewCreateAck({
      description: '',
      image_url: '',
      link_url: ''
    });
  };

  const handleDeleteCreateAcknowledgement = (tempId) => {
    setCreateAcknowledgements((prev) => prev.filter((ack) => ack.id !== tempId));
  };

  // Crear nuevo juego con todos sus datos asociados en orden
  const handleCreateGame = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newGameForm.title.trim()) {
      setSaveError('Por favor, introduce un título para el juego');
      setCreateTab('overview');
      return;
    }

    setIsSaving(true);
    setSaveError('');
    setSaveMessage('');

    // Generar slug automáticamente a partir del título sin intervención del usuario
    const cleanSlug = newGameForm.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') || `juego-${Date.now()}`;

    try {
      const created = await createGame({
        title: newGameForm.title.trim(),
        slug: cleanSlug,
        version: newGameForm.version || 'v1.0',
        release_year: newGameForm.release_year ? parseInt(newGameForm.release_year, 10) : null,
        status: newGameForm.status || 'completed',
        banner_url: newGameForm.banner_url || '',
        guide_url: newGameForm.guide_url || null,
        short_description: newGameForm.short_description || '',
        full_description: newGameForm.full_description || '',
        languages: newGameForm.languages
          ? newGameForm.languages.split(',').map((l) => l.trim()).filter(Boolean)
          : ['Español'],
        is_active: newGameForm.is_active,
        order_index: games.length + 1
      });

      // 1. Guardar características destacadas
      if (newGameForm.features) {
        const feats = newGameForm.features
          .split('\n')
          .map((f) => f.trim())
          .filter(Boolean);
        for (let i = 0; i < feats.length; i++) {
          await createGameFeature({
            game_id: created.id,
            feature_text: feats[i],
            order_index: i + 1
          });
        }
      }

      // 2. Guardar descargas configuradas temporalmente
      if (createDownloads.length > 0) {
        for (let i = 0; i < createDownloads.length; i++) {
          const dl = createDownloads[i];
          await createDownload({
            game_id: created.id,
            server_name: dl.server_name,
            platform: dl.platform,
            url: dl.url,
            file_size: dl.file_size || '',
            order_index: i + 1
          });
        }
      }

      // 3. Guardar capturas de pantalla configuradas temporalmente
      if (createScreenshots.length > 0) {
        for (let i = 0; i < createScreenshots.length; i++) {
          const shot = createScreenshots[i];
          await createScreenshot({
            game_id: created.id,
            image_url: shot.url,
            caption: '',
            order_index: i + 1
          });
        }
      }

      // 4. Guardar agradecimientos configurados temporalmente
      if (createAcknowledgements.length > 0) {
        for (let i = 0; i < createAcknowledgements.length; i++) {
          const ack = createAcknowledgements[i];
          await createAcknowledgement({
            game_id: created.id,
            description: ack.description,
            image_url: ack.image_url || null,
            link_url: ack.link_url || null,
            order_index: i + 1
          });
        }
      }

      await onDataUpdated();
      setSaveMessage(`¡Juego "${newGameForm.title}" creado con éxito con todos sus datos y enlaces!`);
      setSelectedGameId(created.id);
      setViewMode('edit'); // Abre directamente el modal en vivo del nuevo juego
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      console.error('Error al crear juego completo:', err);
      setSaveError(err.message || 'Error al crear el juego en Supabase');
    } finally {
      setIsSaving(false);
    }
  };

  // Alternar visibilidad (Activo / Oculto)
  const handleToggleActive = async (game) => {
    try {
      await toggleGameActive(game.id, game.isActive);
      await onDataUpdated();
      setSaveMessage(
        game.isActive 
          ? `¡"${game.title}" se ha archivado! (Oculto de la web pública)` 
          : `¡"${game.title}" se ha activado! (Visible en la web pública)`
      );
      setTimeout(() => setSaveMessage(''), 4000);
    } catch (err) {
      setSaveError(err.message || 'Error al cambiar estado de visibilidad');
    }
  };

  // Borrar juego
  const handleDeleteGame = async (game) => {
    if (!confirm(`¿Estás SEGURO de que deseas eliminar permanentemente "${game.title}" y todos sus servidores y capturas? Esta acción es irreversible.`)) {
      return;
    }
    try {
      await deleteGame(game.id);
      await onDataUpdated();
      setSaveMessage(`¡"${game.title}" eliminado correctamente!`);
      setTimeout(() => setSaveMessage(''), 4000);
      if (selectedGameId === game.id) {
        setSelectedGameId(games.find((g) => g.id !== game.id)?.id || '');
        setViewMode('cards');
      }
    } catch (err) {
      setSaveError(err.message || 'Error al eliminar el juego');
    }
  };

  // Operaciones de descarga
  const handleAddDownload = async (e) => {
    e.preventDefault();
    if (!activeGame || !newDl.url) return;

    try {
      if (formData.title) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await createDownload({
        game_id: activeGame.id,
        server_name: newDl.server_name,
        platform: newDl.platform,
        url: newDl.url,
        file_size: newDl.file_size,
        is_primary: newDl.is_primary,
        order_index: (activeGame.downloads?.length || 0) + 1
      });

      setNewDl({
        server_name: 'Mega',
        platform: 'PC',
        url: '',
        file_size: '~900 MB',
        is_primary: false
      });
      await onDataUpdated();
      setSaveMessage('¡Enlace de descarga guardado con éxito!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al añadir descarga');
    }
  };

  const handleDeleteDownload = async (downloadId) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este enlace de descarga?')) return;
    try {
      await deleteDownload(downloadId);
      await onDataUpdated();
    } catch (err) {
      setSaveError(err.message || 'Error al eliminar descarga');
    }
  };

  const handleStartEditDownload = (dl) => {
    setEditingDlId(dl.id);
    setEditDlForm({
      server_name: dl.serverName,
      platform: dl.platform,
      url: dl.url,
      file_size: dl.size || '',
      is_primary: !!dl.primary
    });
  };

  const handleCancelEditDownload = () => {
    setEditingDlId(null);
  };

  const handleSaveEditedDownload = async (downloadId) => {
    if (!editDlForm.url || !editDlForm.server_name) {
      setSaveError('El servidor y la URL no pueden estar vacíos.');
      return;
    }

    setSavingDlId(downloadId);
    setSaveError('');
    try {
      if (formData.title) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await updateDownload(downloadId, {
        server_name: editDlForm.server_name,
        platform: editDlForm.platform,
        url: editDlForm.url,
        file_size: editDlForm.file_size,
        is_primary: editDlForm.is_primary
      });
      setEditingDlId(null);
      await onDataUpdated();
      setSaveMessage('¡Enlace de descarga actualizado con éxito!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar descarga');
    } finally {
      setSavingDlId(null);
    }
  };

  // Operaciones de capturas
  const handleAddScreenshot = async (e) => {
    e.preventDefault();
    if (!activeGame || !newShotUrl) return;

    try {
      if (formData.title) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await createScreenshot({
        game_id: activeGame.id,
        image_url: newShotUrl,
        alt_text: `Captura de ${activeGame.title}`,
        order_index: (activeGame.screenshots?.length || 0) + 1
      });

      setNewShotUrl('');
      await onDataUpdated();
      setSaveMessage('¡Captura añadida!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al añadir captura');
    }
  };

  const handleDeleteScreenshot = async (shotId) => {
    if (!confirm('¿Eliminar esta captura de pantalla?')) return;
    try {
      await deleteScreenshot(shotId);
      await onDataUpdated();
    } catch (err) {
      setSaveError(err.message || 'Error al eliminar captura');
    }
  };

  // Operaciones de agradecimientos
  const handleAddAcknowledgement = async (e) => {
    e.preventDefault();
    if (!activeGame || !newAck.description) return;

    try {
      if (formData.title) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await createAcknowledgement({
        game_id: activeGame.id,
        description: newAck.description,
        image_url: newAck.image_url || null,
        link_url: newAck.link_url || null,
        order_index: (activeGame.acknowledgements?.length || 0) + 1
      });

      setNewAck({ description: '', image_url: '', link_url: '' });
      await onDataUpdated();
      setSaveMessage('¡Agradecimiento añadido!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al añadir agradecimiento');
    }
  };

  const handleDeleteAcknowledgement = async (ackId) => {
    if (!confirm('¿Eliminar este agradecimiento?')) return;
    try {
      await deleteAcknowledgement(ackId);
      await onDataUpdated();
      setSaveMessage('Agradecimiento eliminado');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al eliminar agradecimiento');
    }
  };

  const handleStartEditAcknowledgement = (ack) => {
    setEditingAckId(ack.id);
    setEditAckForm({
      description: ack.description || '',
      image_url: ack.imageUrl || '',
      link_url: ack.linkUrl || ''
    });
  };

  const handleCancelEditAcknowledgement = () => {
    setEditingAckId(null);
  };

  const handleSaveEditedAcknowledgement = async (ackId) => {
    if (!editAckForm.description) {
      setSaveError('La descripción no puede estar vacía.');
      return;
    }

    setSavingAckId(ackId);
    setSaveError('');
    try {
      if (formData.title) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await updateAcknowledgement(ackId, {
        description: editAckForm.description,
        image_url: editAckForm.image_url || null,
        link_url: editAckForm.link_url || null
      });
      setEditingAckId(null);
      await onDataUpdated();
      setSaveMessage('¡Agradecimiento actualizado!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar agradecimiento');
    } finally {
      setSavingAckId(null);
    }
  };

  // Handlers para Características Destacadas
  const handleCreateFeature = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!newFeatureText.trim() || !activeGame) return;

    setIsSavingFeature(true);
    try {
      if (currentEditingGameIdRef.current === activeGame.id) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      const nextOrder = (activeGame.gameFeatures?.length || 0) + 1;
      await createGameFeature({
        game_id: activeGame.id,
        feature_text: newFeatureText.trim(),
        order_index: nextOrder
      });
      setNewFeatureText('');
      await onDataUpdated();
      setSaveMessage('¡Característica destacada añadida!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al añadir característica');
    } finally {
      setIsSavingFeature(false);
    }
  };

  const handleStartEditFeature = (feat) => {
    setEditingFeatureId(feat.id);
    setEditFeatureText(feat.text);
  };

  const handleSaveEditFeature = async (featId) => {
    if (!editFeatureText.trim()) return;

    setIsSavingFeature(true);
    try {
      if (currentEditingGameIdRef.current === activeGame.id) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await updateGameFeature(featId, { feature_text: editFeatureText.trim() });
      setEditingFeatureId(null);
      await onDataUpdated();
      setSaveMessage('¡Característica destacada actualizada!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al actualizar característica');
    } finally {
      setIsSavingFeature(false);
    }
  };

  const handleDeleteFeature = async (feat) => {
    if (!confirm(`¿Eliminar la característica "${feat.text}"?`)) return;

    try {
      if (currentEditingGameIdRef.current === activeGame.id) {
        await updateGame(activeGame.id, getGameUpdatesPayload());
      }

      await deleteGameFeature(feat.id);
      await onDataUpdated();
      setSaveMessage('¡Característica eliminada!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveError(err.message || 'Error al eliminar característica');
    }
  };

  const handleOpenCreateModal = () => {
    setNewGameForm({
      title: '',
      version: 'v1.0',
      release_year: new Date().getFullYear().toString(),
      status: 'completed',
      languages: 'Español',
      banner_url: '',
      guide_url: '',
      short_description: '',
      full_description: '',
      features: '',
      is_active: true
    });
    setCreateTab('overview');
    setCreateDownloads([]);
    setCreateScreenshots([]);
    setCreateAcknowledgements([]);
    setNewCreateDl({
      server_name: 'Mega',
      platform: 'PC y Android',
      url: '',
      file_size: '~900 MB',
      is_primary: false
    });
    setNewCreateShotUrl('');
    setNewCreateAck({
      description: '',
      image_url: '',
      link_url: ''
    });
    setShowCreateBannerInput(false);
    setSaveError('');
    setSaveMessage('');
    setViewMode('create');
  };

  if (loadingSession) {
    return (
      <div className="admin-viewport admin-login-screen">
        <p style={{ color: 'var(--color-text-secondary)' }}>Verificando sesión segura...</p>
      </div>
    );
  }

  // --- VISTA 1: LOGIN OCULTO ---
  if (!session) {
    return (
      <AdminLogin 
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        loginLoading={loginLoading}
        loginError={loginError}
        handleLogin={handleLogin}
        onClose={onClose}
      />
    );
  }

  // --- VISTA 2: PANEL DE CONTROL AUTENTICADO ---
  return (
    <div className="admin-viewport">
      <AdminNavbar 
        userEmail={session.user.email} 
        onClose={onClose} 
        handleLogout={handleLogout} 
      />

      <main className="admin-main-content">
        {saveMessage && viewMode === 'cards' && (
          <div className="admin-success-banner" role="status">
            <CheckCircle2 size={18} aria-hidden="true" />
            <span>{saveMessage}</span>
          </div>
        )}

        {saveError && viewMode === 'cards' && (
          <div className="admin-error-banner" role="alert">
            <AlertCircle size={18} aria-hidden="true" />
            <span>{saveError}</span>
          </div>
        )}

        {/* MODO 1: VISTA DE TARJETAS (Visual con Drag & Drop) */}
        <AdminGameCards 
          adminTab={adminTab}
          setAdminTab={setAdminTab}
          activeGames={activeGames}
          archivedGames={archivedGames}
          displayGames={displayGames}
          draggedGameId={draggedGameId}
          draggedGame={draggedGame}
          dragPointer={dragPointer}
          onOpenCreate={handleOpenCreateModal}
          handleCardPointerDown={handleCardPointerDown}
          handleOpenEdit={handleOpenEdit}
          handleToggleActive={handleToggleActive}
          handleDeleteGame={handleDeleteGame}
          wasDraggingRef={wasDraggingRef}
        />

        {/* MODO 2: MODAL DE EDICIÓN EN VIVO */}
        {viewMode === 'edit' && activeGame && (
          <AdminLiveEditModal 
            activeGame={activeGame}
            formData={formData}
            setFormData={setFormData}
            modalTab={modalTab}
            setModalTab={setModalTab}
            showBannerInput={showBannerInput}
            setShowBannerInput={setShowBannerInput}
            saveMessage={saveMessage}
            saveError={saveError}
            isSaving={isSaving}
            handleSaveGame={handleSaveGame}
            handleCloseEditModal={handleCloseEditModal}
            newFeatureText={newFeatureText}
            setNewFeatureText={setNewFeatureText}
            editingFeatureId={editingFeatureId}
            setEditingFeatureId={setEditingFeatureId}
            editFeatureText={editFeatureText}
            setEditFeatureText={setEditFeatureText}
            isSavingFeature={isSavingFeature}
            handleCreateFeature={handleCreateFeature}
            handleStartEditFeature={handleStartEditFeature}
            handleSaveEditFeature={handleSaveEditFeature}
            handleDeleteFeature={handleDeleteFeature}
            newDl={newDl}
            setNewDl={setNewDl}
            editingDlId={editingDlId}
            editDlForm={editDlForm}
            setEditDlForm={setEditDlForm}
            savingDlId={savingDlId}
            handleAddDownload={handleAddDownload}
            handleDeleteDownload={handleDeleteDownload}
            handleStartEditDownload={handleStartEditDownload}
            handleCancelEditDownload={handleCancelEditDownload}
            handleSaveEditedDownload={handleSaveEditedDownload}
            newShotUrl={newShotUrl}
            setNewShotUrl={setNewShotUrl}
            handleAddScreenshot={handleAddScreenshot}
            handleDeleteScreenshot={handleDeleteScreenshot}
            newAck={newAck}
            setNewAck={setNewAck}
            editingAckId={editingAckId}
            editAckForm={editAckForm}
            setEditAckForm={setEditAckForm}
            savingAckId={savingAckId}
            handleAddAcknowledgement={handleAddAcknowledgement}
            handleDeleteAcknowledgement={handleDeleteAcknowledgement}
            handleStartEditAcknowledgement={handleStartEditAcknowledgement}
            handleCancelEditAcknowledgement={handleCancelEditAcknowledgement}
            handleSaveEditedAcknowledgement={handleSaveEditedAcknowledgement}
          />
        )}

        {/* MODO 3: MODAL DE CREACIÓN EN VIVO */}
        {viewMode === 'create' && (
          <AdminCreateModal 
            newGameForm={newGameForm}
            setNewGameForm={setNewGameForm}
            createTab={createTab}
            setCreateTab={setCreateTab}
            showCreateBannerInput={showCreateBannerInput}
            setShowCreateBannerInput={setShowCreateBannerInput}
            saveError={saveError}
            isSaving={isSaving}
            handleCreateGame={handleCreateGame}
            onClose={() => setViewMode('cards')}
            createDownloads={createDownloads}
            newCreateDl={newCreateDl}
            setNewCreateDl={setNewCreateDl}
            handleAddCreateDownload={handleAddCreateDownload}
            handleDeleteCreateDownload={handleDeleteCreateDownload}
            createScreenshots={createScreenshots}
            newCreateShotUrl={newCreateShotUrl}
            setNewCreateShotUrl={setNewCreateShotUrl}
            handleAddCreateScreenshot={handleAddCreateScreenshot}
            handleDeleteCreateScreenshot={handleDeleteCreateScreenshot}
            createAcknowledgements={createAcknowledgements}
            newCreateAck={newCreateAck}
            setNewCreateAck={setNewCreateAck}
            handleAddCreateAcknowledgement={handleAddCreateAcknowledgement}
            handleDeleteCreateAcknowledgement={handleDeleteCreateAcknowledgement}
          />
        )}
      </main>
    </div>
  );
}
