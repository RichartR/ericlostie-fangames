import { createClient } from '@supabase/supabase-js';

/**
 * SERVICIO CENTRALIZADO DE SUPABASE
 * Encapsula la conexión y todas las consultas a la base de datos de Supabase.
 * Los componentes de la interfaz nunca realizan llamadas directas a Supabase.
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('[supabaseService] Faltan variables de entorno VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY.');
}

// Cliente privado de Supabase
const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Capa de caché en memoria y sesión para evitar peticiones redundantes
let inMemoryGamesCache = null;
const CACHE_KEY = 'el_games_cache_v1';
const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hora de persistencia para visitantes regulares

/**
 * Mapea el modelo relacional de Supabase al contrato que consumen los componentes.
 */
function mapGameFromDatabase(dbGame) {
  if (!dbGame) return null;

  // Ordenar descargas por order_index
  const sortedDownloads = (dbGame.downloads || [])
    .slice()
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map((dl) => ({
      id: dl.id,
      serverName: dl.server_name,
      platform: dl.platform,
      // Generación dinámica del texto a partir de la plataforma y el servidor
      name: `Descargar para ${dl.platform} (${dl.server_name})`,
      url: dl.url,
      size: dl.file_size,
      primary: dl.is_primary
    }));

  // Ordenar capturas por order_index (solo imágenes)
  const sortedScreenshots = (dbGame.screenshots || [])
    .slice()
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map((shot) => ({
      id: shot.id,
      url: shot.image_url,
      alt: shot.alt_text || ''
    }));

  // Ordenar características por order_index
  const rawFeatures = (dbGame.game_features || [])
    .slice()
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map((f) => ({
      id: f.id,
      gameId: f.game_id,
      text: f.feature_text,
      orderIndex: f.order_index || 0
    }));

  const sortedFeatures = rawFeatures.map((f) => f.text);

  // Ordenar agradecimientos por order_index
  const sortedAcknowledgements = (dbGame.acknowledgements || [])
    .slice()
    .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
    .map((ack) => ({
      id: ack.id,
      description: ack.description,
      imageUrl: ack.image_url || null,
      linkUrl: ack.link_url || null,
      orderIndex: ack.order_index || 1
    }));

  return {
    id: dbGame.id,
    slug: dbGame.slug,
    title: dbGame.title,
    status: dbGame.status,
    statusLabel: dbGame.status === 'completed' ? 'Completo' : 'Próximamente',
    version: dbGame.version || 'En desarrollo',
    year: dbGame.release_year ? String(dbGame.release_year) : 'En desarrollo',
    banner: dbGame.banner_url,
    shortDescription: dbGame.short_description || '',
    fullDescription: dbGame.full_description || '',
    languages: dbGame.languages || ['Español'],
    platforms: dbGame.platforms || ['PC'],
    guideUrl: dbGame.guide_url || null,
    isActive: dbGame.is_active !== false,
    orderIndex: dbGame.order_index ?? 0,
    downloads: sortedDownloads,
    screenshots: sortedScreenshots,
    features: sortedFeatures,
    gameFeatures: rawFeatures,
    acknowledgements: sortedAcknowledgements
  };
}

/**
 * Obtiene el listado completo de juegos desde la base de datos de Supabase.
 */
export async function fetchAllGames(forceFresh = false) {
  if (!supabase) {
    throw new Error('[supabaseService] Cliente de Supabase no inicializado. Revisa el archivo .env.');
  }

  // 1. Servir desde caché si está disponible y no se fuerza recarga
  if (!forceFresh && inMemoryGamesCache) {
    return inMemoryGamesCache;
  }

  if (!forceFresh) {
    try {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY_MS && Array.isArray(data)) {
          inMemoryGamesCache = data;
          return data;
        }
      }
    } catch {
      // Continuar con fetch si la caché falla
    }
  }

  // 2. Consulta a la base de datos
  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      downloads (*),
      screenshots (*),
      game_features (*),
      acknowledgements (*)
    `)
    .order('order_index', { ascending: true });

  if (error) {
    console.error('[supabaseService] Error al consultar juegos en Supabase:', error);
    throw error;
  }

  const mapped = (data || []).map(mapGameFromDatabase);
  inMemoryGamesCache = mapped;

  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({
      data: mapped,
      timestamp: Date.now()
    }));
  } catch {
    // Almacenamiento lleno o no disponible
  }

  return mapped;
}

/**
 * Obtiene un juego individual por su slug o UUID desde Supabase.
 */
export async function fetchGameBySlug(slug) {
  if (!slug) return null;

  if (!supabase) {
    throw new Error('[supabaseService] Cliente de Supabase no inicializado. Revisa el archivo .env.');
  }

  const { data, error } = await supabase
    .from('games')
    .select(`
      *,
      downloads (*),
      screenshots (*),
      game_features (*),
      acknowledgements (*)
    `)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  if (error) {
    console.error(`[supabaseService] Error al obtener el juego '${slug}' en Supabase:`, error);
    return null;
  }

  return mapGameFromDatabase(data);
}

/**
 * --- AUTENTICACIÓN DE ADMINISTRADOR ---
 */

export async function signInAdmin(email, password) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOutAdmin() {
  if (!supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getAdminSession() {
  if (!supabase) return null;
  const { data: { session }, error } = await supabase.auth.getSession();
  if (error) return null;
  return session;
}

export function onAuthStateChange(callback) {
  if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
  return supabase.auth.onAuthStateChange(callback);
}

/**
 * Invalidador de caché y propagación de cambios en tiempo real:
 * 1. Notifica a otras pestañas activas para que recarguen datos instantáneamente.
 * 2. Si existe un webhook de revalidación/redeploy de CDN de Vercel (VITE_VERCEL_DEPLOY_HOOK), lo dispara automáticamente.
 */
export async function clearGamesCache() {
  inMemoryGamesCache = null;
  try {
    sessionStorage.removeItem(CACHE_KEY);
    localStorage.setItem('el_last_update', Date.now().toString());
  } catch {
    // Si almacenamiento no está disponible en el entorno
  }

  // Notificación opcional al deploy hook de Vercel si está configurado en las variables de entorno
  const deployHook = import.meta.env.VITE_VERCEL_DEPLOY_HOOK;
  if (deployHook) {
    try {
      await fetch(deployHook, { method: 'POST' });
    } catch (err) {
      console.warn('[supabaseService] Error al notificar deploy hook de Vercel:', err);
    }
  }
}

/**
 * Actualiza la marca temporal 'updated_at' del juego cuando se modifican sus relaciones (descargas, capturas, características, etc.).
 */
async function touchGameUpdated(gameId) {
  if (!supabase || !gameId) return;
  try {
    await supabase
      .from('games')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', gameId);
  } catch (err) {
    console.warn('[supabaseService] Error al actualizar marca de tiempo del juego:', err);
  }
}

export async function createGame(gameData) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const now = new Date().toISOString();
  const { data, error } = await supabase
    .from('games')
    .insert([{
      ...gameData,
      updated_at: now
    }])
    .select()
    .single();
  if (error) throw error;
  clearGamesCache();
  return data;
}

export async function deleteGame(gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { error } = await supabase
    .from('games')
    .delete()
    .eq('id', gameId);
  if (error) throw error;
  clearGamesCache();
  return true;
}

export async function toggleGameActive(gameId, currentActive) {
  return updateGame(gameId, { is_active: !currentActive });
}

export async function updateGame(gameId, updates) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('games')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', gameId)
    .select()
    .single();
  if (error) throw error;
  clearGamesCache();
  return data;
}

export async function updateGamesOrder(orderedGameIds) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const now = new Date().toISOString();
  const promises = orderedGameIds.map((id, index) => 
    supabase
      .from('games')
      .update({ order_index: index + 1, updated_at: now })
      .eq('id', id)
  );
  await Promise.all(promises);
  clearGamesCache();
  return true;
}

export async function createDownload(downloadData) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('downloads')
    .insert([downloadData])
    .select()
    .single();
  if (error) throw error;
  if (downloadData.game_id) await touchGameUpdated(downloadData.game_id);
  clearGamesCache();
  return data;
}

export async function updateDownload(downloadId, updates) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('downloads')
    .update(updates)
    .eq('id', downloadId)
    .select()
    .single();
  if (error) throw error;
  if (data?.game_id) await touchGameUpdated(data.game_id);
  clearGamesCache();
  return data;
}

export async function deleteDownload(downloadId, gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { error } = await supabase
    .from('downloads')
    .delete()
    .eq('id', downloadId);
  if (error) throw error;
  if (gameId) await touchGameUpdated(gameId);
  clearGamesCache();
  return true;
}

export async function createScreenshot(screenshotData) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('screenshots')
    .insert([screenshotData])
    .select()
    .single();
  if (error) throw error;
  if (screenshotData.game_id) await touchGameUpdated(screenshotData.game_id);
  clearGamesCache();
  return data;
}

export async function deleteScreenshot(screenshotId, gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { error } = await supabase
    .from('screenshots')
    .delete()
    .eq('id', screenshotId);
  if (error) throw error;
  if (gameId) await touchGameUpdated(gameId);
  clearGamesCache();
  return true;
}

export async function createAcknowledgement(ackData) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('acknowledgements')
    .insert([ackData])
    .select()
    .single();
  if (error) throw error;
  if (ackData.game_id) await touchGameUpdated(ackData.game_id);
  clearGamesCache();
  return data;
}

export async function updateAcknowledgement(ackId, updates) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('acknowledgements')
    .update(updates)
    .eq('id', ackId)
    .select()
    .single();
  if (error) throw error;
  if (data?.game_id) await touchGameUpdated(data.game_id);
  clearGamesCache();
  return data;
}

export async function deleteAcknowledgement(ackId, gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { error } = await supabase
    .from('acknowledgements')
    .delete()
    .eq('id', ackId);
  if (error) throw error;
  if (gameId) await touchGameUpdated(gameId);
  clearGamesCache();
  return true;
}

export async function createGameFeature(featureData) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('game_features')
    .insert([featureData])
    .select()
    .single();
  if (error) throw error;
  if (featureData.game_id) await touchGameUpdated(featureData.game_id);
  clearGamesCache();
  return data;
}

export async function updateGameFeature(featureId, updates, gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { data, error } = await supabase
    .from('game_features')
    .update(updates)
    .eq('id', featureId)
    .select()
    .single();
  if (error) throw error;
  if (gameId) await touchGameUpdated(gameId);
  clearGamesCache();
  return data;
}

export async function deleteGameFeature(featureId, gameId) {
  if (!supabase) throw new Error('Supabase no inicializado');
  const { error } = await supabase
    .from('game_features')
    .delete()
    .eq('id', featureId);
  if (error) throw error;
  if (gameId) await touchGameUpdated(gameId);
  clearGamesCache();
  return true;
}


