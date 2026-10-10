import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import GamesCatalog from './components/GamesCatalog';
import HowToPlay from './components/HowToPlay';
import CommunitySocials from './components/CommunitySocials';
import Footer from './components/Footer';
import GameDetailModal from './components/GameDetailModal';
import ScrollToTop from './components/ScrollToTop';
import { fetchAllGames } from './services/supabaseService';
import AdminPortal from './components/AdminPortal';
import './App.css';

export default function App() {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGame, setSelectedGame] = useState(null);
  const [isAdminRoute, setIsAdminRoute] = useState(() => window.location.hash === '#admin');
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('el_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('el_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const loadGames = async (forceFresh = false) => {
    try {
      const data = await fetchAllGames(forceFresh);
      setGames(data);
      return data;
    } catch (err) {
      console.error('Error al cargar juegos desde Supabase:', err);
      return [];
    }
  };

  useEffect(() => {
    loadGames()
      .then((data) => {
        const hash = window.location.hash;
        if (hash === '#admin') {
          setIsAdminRoute(true);
        } else if (hash) {
          const currentHash = hash.replace('#', '');
          const found = data.find((g) => g.slug === currentHash || g.id === currentHash);
          if (found) setSelectedGame(found);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'el_last_update') {
        loadGames(true);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash === '#admin') {
        setIsAdminRoute(true);
        setSelectedGame(null);
        return;
      }
      setIsAdminRoute(false);
      const cleanHash = hash.replace('#', '');
      if (cleanHash && games.length > 0) {
        const found = games.find((g) => g.slug === cleanHash || g.id === cleanHash);
        if (found) setSelectedGame(found);
      } else if (!cleanHash) {
        setSelectedGame(null);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [games]);

  const handleOpenGame = (game) => {
    setSelectedGame(game);
    window.history.pushState(null, '', `#${game.slug}`);
  };

  const handleCloseGame = () => {
    setSelectedGame(null);
    window.history.pushState(null, '', window.location.pathname);
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Si se navega a la ruta oculta #admin, se muestra el portal de administración
  if (isAdminRoute) {
    return (
      <AdminPortal
        games={games}
        onDataUpdated={() => loadGames(true)}
        onClose={() => {
          window.history.pushState(null, '', window.location.pathname);
          setIsAdminRoute(false);
        }}
      />
    );
  }

  // Juegos activos visibles para el público general
  const publicGames = games.filter((g) => g.isActive !== false);

  return (
    <div className="app-layout">
      {/* Navegación Principal con selector de tema */}
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      {/* Contenido Estructurado */}
      <main>
        {/* 1. Hero: Introducción honesta y enlaces de acción */}
        <Hero 
          games={publicGames}
          onExploreClick={() => scrollToSection('juegos')}
          onHowToPlayClick={() => scrollToSection('como-jugar')}
        />

        {/* 2. Catálogo Oficial de Fangames: Con buscador, filtros y accesos a modales */}
        <GamesCatalog 
          games={publicGames} 
          loading={loading}
          onSelectGame={handleOpenGame}
        />

        {/* 3. Guía de Instalación: Explicaciones directas para PC y Android */}
        <HowToPlay />

        {/* 4. Canales Comunitarios: Enlaces verificados a Twitter, Discord, etc. */}
        <CommunitySocials />
      </main>

      {/* Pie de página con aviso de propiedad intelectual */}
      <Footer />

      {/* Botón flotante para volver arriba */}
      <ScrollToTop />

      {/* Modal accesible de detalles y descargas */}
      {selectedGame && (
        <GameDetailModal 
          game={selectedGame} 
          onClose={handleCloseGame} 
        />
      )}
    </div>
  );
}
