import React, { useState } from 'react';
import { Monitor, Smartphone, Download } from 'lucide-react';
import './HowToPlay.css';

const LAUNCHER_EXE_URL = 'https://ericlostie-launcher.jagoba.dev/public/installer/LostieLauncher-win-Setup.exe';

export default function HowToPlay() {
  const [activeTab, setActiveTab] = useState('pc'); // 'pc' | 'android'

  return (
    <section id="como-jugar" className="how-to-play-section">
      <div className="container">
        {/* Encabezado */}
        <div className="how-to-play-header">
          <span className="section-label">GUÍA DE INSTALACIÓN</span>
          <h2 className="section-title">¿Cómo jugar en tu dispositivo?</h2>
          <p className="how-to-play-lead">
            Todos los fangames creados por Eric Lostie son 100% gratuitos y funcionan de forma nativa
            en ordenadores Windows sin requerir ningún emulador. Si deseas jugar en tu teléfono Android,
            puedes hacerlo mediante Kirin.
          </p>
        </div>

        {/* Selector de plataforma */}
        <div className="platform-toggle" role="tablist" aria-label="Seleccionar plataforma para ver instrucciones">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'pc'}
            className={`platform-btn ${activeTab === 'pc' ? 'active' : ''}`}
            onClick={() => setActiveTab('pc')}
          >
            <Monitor size={18} aria-hidden="true" />
            <span>En Ordenador (Windows)</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === 'android'}
            className={`platform-btn ${activeTab === 'android' ? 'active' : ''}`}
            onClick={() => setActiveTab('android')}
          >
            <Smartphone size={18} aria-hidden="true" />
            <span>En Móvil (Android)</span>
          </button>
        </div>

        {/* Contenido de la plataforma activa */}
        <div className="platform-card" role="tabpanel">
          {activeTab === 'pc' ? (
            <div className="platform-guide-content">
              <div className="guide-summary-box">
                <span className="summary-tag">ORDENADOR (WINDOWS)</span>
                <h3 className="summary-title">Ejecución directa en Windows</h3>
                <p className="summary-desc">
                  Los juegos funcionan de forma nativa en tu ordenador sin necesidad de emuladores. Puedes usar el lanzador oficial para gestionarlos automáticamente o descargarlos manualmente.
                </p>
              </div>

              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number" aria-hidden="true">1</div>
                  <div className="step-body">
                    <h4 className="step-title">Opción recomendada: Lostie Launcher</h4>
                    <p className="step-text">
                      Instala el lanzador oficial para descargar, actualizar y abrir cualquiera de los juegos en un solo clic.
                    </p>
                    <div style={{ marginTop: '12px' }}>
                      <a
                        href={LAUNCHER_EXE_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '9px 18px', fontSize: '0.875rem' }}
                      >
                        <Download size={15} aria-hidden="true" />
                        <span>Descargar Lostie Launcher (.exe)</span>
                      </a>
                    </div>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number" aria-hidden="true">2</div>
                  <div className="step-body">
                    <h4 className="step-title">Opción manual: Descarga del juego (.zip)</h4>
                    <p className="step-text">
                      Si prefieres no usar el lanzador, elige tu juego en el catálogo y descárgalo directamente desde el servidor correspondiente.
                    </p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number" aria-hidden="true">3</div>
                  <div className="step-body">
                    <h4 className="step-title">Descomprimir y ejecutar</h4>
                    <p className="step-text">
                      Descomprime la carpeta del archivo descargado y haz doble clic en <strong>Game.exe</strong> para comenzar tu partida.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="platform-guide-content">
              <div className="guide-summary-box">
                <span className="summary-tag">PARA DISPOSITIVOS MÓVILES</span>
                <h3 className="summary-title">Jugar en Android con Kirin</h3>
                <p className="summary-desc">
                  Al tratarse de juegos creados para PC, para ejecutarlos en tu móvil necesitas
                  un cargador un motor de RPG Maker como Kirin.
                </p>
              </div>

              <div className="steps-container">
                <div className="step-item">
                  <div className="step-number" aria-hidden="true">1</div>
                  <div className="step-body">
                    <h4 className="step-title">Instala la aplicación compatible</h4>
                    <p className="step-text">
                      Descarga en tu teléfono la aplicación <strong><a href="https://www.playkirin.com/">Kirin (enlace)</a></strong>.
                    </p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number" aria-hidden="true">2</div>
                  <div className="step-body">
                    <h4 className="step-title">Descarga y descomprime el juego</h4>
                    <p className="step-text">
                      Descarga el archivo del juego en tu móvil y descomprimelo.
                    </p>
                  </div>
                </div>

                <div className="step-item">
                  <div className="step-number" aria-hidden="true">3</div>
                  <div className="step-body">
                    <h4 className="step-title">Añade Game.exe en la aplicación</h4>
                    <p className="step-text">
                      Abre Kirin pulsa el botón (+) para añadir un nuevo juego, navega hasta
                      la carpeta descomprimida y selecciona el ejecutable <strong>Game.exe</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
