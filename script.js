/**
 * ============================================================================
 * QUIÉN QUIERE SER MILLONARIO - EDICIÓN BÍBLICA
 * Lógica del Juego, Comodines, Temporizador, Sonidos y Máquina de Estados
 * ============================================================================
 */

// Escala oficial de los 15 premios
const PRIZE_SCALE = [
  "$100",        // 1
  "$200",        // 2
  "$300",        // 3
  "$500",        // 4
  "$1,000",      // 5 (SEGURO 1)
  "$2,000",      // 6
  "$4,000",      // 7
  "$8,000",      // 8
  "$16,000",     // 9
  "$32,000",     // 10 (SEGURO 2)
  "$64,000",     // 11
  "$125,000",    // 12
  "$250,000",    // 13
  "$500,000",    // 14
  "$1,000,000"   // 15 (MILLONARIO)
];

const SAFE_CHECKPOINTS = [4, 9]; // Índices basados en 0 para las preguntas 5 y 10
const TIMER_START_SECONDS = 45; // 45 segundos por pregunta
const AUDIENCE_TIMER_SECONDS = 90; // 90 segundos (1:30 min) para que el público escanee el QR y vote

class SoundManager {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.isMuted = false;
    this.ambientNodes = [];
    this.heartbeatTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.7, this.ctx.currentTime);
    }
    return this.isMuted;
  }

  // Detiene drones continuos o latidos
  stopAmbient() {
    this.ambientNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    this.ambientNodes = [];

    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  /**
   * Tono individual con envolvente ADSR
   */
  playTone(freq, type, duration, gainVal = 0.15, startTimeOffset = 0) {
    if (!this.ctx || this.isMuted) return null;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startT = this.ctx.currentTime + startTimeOffset;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.0001, startT);
      gain.gain.linearRampToValueAtTime(gainVal, startT + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(startT);
      osc.stop(startT + duration);
      return osc;
    } catch (e) {
      return null;
    }
  }

  /**
   * Sonido característico al iniciar / cargar cada pregunta:
   * Acorde dramático orquestal con barrido de frecuencias
   */
  playQuestionSting(questionIndex = 0) {
    this.init();
    this.stopAmbient();
    if (!this.ctx || this.isMuted) return;

    const baseFreq = 110 + (questionIndex * 6); // Se vuelve ligeramente más agudo con la dificultad
    const freqs = [baseFreq, baseFreq * 1.5, baseFreq * 2, baseFreq * 2.37];

    freqs.forEach((f, idx) => {
      this.playTone(f, 'sine', 1.8, 0.18, idx * 0.04);
      this.playTone(f * 1.01, 'triangle', 1.5, 0.09, idx * 0.04);
    });

    // Sub-bass thump característico del show
    this.playSubBass(65, 1.2);

    // Iniciar drone de tensión ambiental acorde al nivel
    setTimeout(() => {
      this.startTensionAmbient(questionIndex);
    }, 1200);
  }

  /**
   * Sonido sub-bass bajo para golpes dramáticos
   */
  playSubBass(freq = 60, duration = 1.0) {
    if (!this.ctx || this.isMuted) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + duration);

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  /**
   * Drone ambiental de concentración y tensión característico mientras el reloj corre
   */
  startTensionAmbient(questionIndex = 0) {
    if (!this.ctx || this.isMuted) return;
    this.stopAmbient();

    try {
      // Oscilador dual con efecto de batido ("beating drone")
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const droneGain = this.ctx.createGain();

      const pitch = 98 + Math.min(questionIndex * 5, 60); // Sube sutilmente según la pregunta
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(pitch, this.ctx.currentTime);

      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(pitch + 1.2, this.ctx.currentTime); // Ligeramente desafinado para tensión

      // Filtro pasa-bajos para que suene oscuro y cinematográfico
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, this.ctx.currentTime);

      droneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      droneGain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + 1.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(droneGain);
      droneGain.connect(this.masterGain);

      osc1.start();
      osc2.start();

      this.ambientNodes.push(osc1, osc2, filter, droneGain);

      // Latidos cardíacos si estamos en nivel avanzado (preguntas 6+)
      if (questionIndex >= 5) {
        this.heartbeatTimer = setInterval(() => {
          this.playHeartbeat();
        }, 1200);
      }
    } catch (e) {}
  }

  /**
   * Latido de corazón para máxima tensión
   */
  playHeartbeat() {
    if (!this.ctx || this.isMuted) return;
    this.playTone(70, 'sine', 0.15, 0.12, 0);
    this.playTone(55, 'sine', 0.22, 0.10, 0.18);
  }

  /**
   * Tictac del reloj en los últimos segundos
   */
  playClockTick(isDanger = false) {
    this.init();
    if (!this.ctx || this.isMuted) return;
    const freq = isDanger ? 880 : 660;
    this.playTone(freq, 'sine', 0.08, isDanger ? 0.2 : 0.09);
  }

  /**
   * Sonido de selección ("Respuesta Definitiva"):
   * Clásico acorde misterioso suspendido mientras se espera el veredicto
   */
  playFinalAnswerSuspense() {
    this.init();
    this.stopAmbient();
    if (!this.ctx || this.isMuted) return;

    // Acorde de suspenso (Suspended / Menor intrigante)
    const notes = [130.81, 196.00, 246.94, 311.13]; // C3, G3, B3, Eb4
    notes.forEach((f, idx) => {
      this.playTone(f, 'sawtooth', 2.2, 0.09, idx * 0.05);
      this.playTone(f * 2, 'sine', 2.0, 0.08, idx * 0.05);
    });

    // Pulso grave
    this.playSubBass(75, 1.8);
  }

  /**
   * Sonido característico de RESPUESTA CORRECTA:
   * Fanfarria brillante ascendente triunfal con campanilleo
   */
  playCorrectSting(isSafeLevel = false) {
    this.init();
    this.stopAmbient();
    if (!this.ctx || this.isMuted) return;

    // Ráfaga ascendente triunfal
    const chord = isSafeLevel
      ? [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50] // C major extendido
      : [329.63, 392.00, 493.88, 659.25, 783.99];

    chord.forEach((note, i) => {
      this.playTone(note, 'triangle', 0.7, 0.16, i * 0.08);
      this.playTone(note * 1.5, 'sine', 0.5, 0.08, i * 0.08);
    });

    // Resonancia final dorada
    setTimeout(() => {
      this.playTone(1046.50, 'sine', 1.2, 0.18);
      this.playTone(1318.51, 'triangle', 1.0, 0.12);
    }, chord.length * 80);
  }

  /**
   * Sonido característico de RESPUESTA INCORRECTA / ELIMINACIÓN:
   * Golpe orquestal descendente disonante de descalificación
   */
  playWrongSting() {
    this.init();
    this.stopAmbient();
    if (!this.ctx || this.isMuted) return;

    // Disminución dramática disonante
    const notes = [440, 415.30, 392, 349.23, 220, 110];
    notes.forEach((f, i) => {
      this.playTone(f, 'sawtooth', 0.6, 0.22, i * 0.11);
    });

    this.playSubBass(50, 1.8);
  }

  /**
   * Sonido de activación de comodines
   */
  playLifelineSting() {
    this.init();
    if (!this.ctx || this.isMuted) return;

    [440, 554.37, 659.25, 880].forEach((freq, idx) => {
      this.playTone(freq, 'sine', 0.35, 0.12, idx * 0.07);
    });
  }

  /**
   * Fanfarria grandiosa del MILLÓN de dólares (Ganador Absoluto)
   */
  playMillionGrandTheme() {
    this.init();
    this.stopAmbient();
    if (!this.ctx || this.isMuted) return;

    const fanfare = [
      { f: 523.25, d: 0.3, t: 0 },
      { f: 523.25, d: 0.3, t: 0.25 },
      { f: 523.25, d: 0.3, t: 0.5 },
      { f: 659.25, d: 0.6, t: 0.75 },
      { f: 783.99, d: 0.6, t: 1.2 },
      { f: 1046.50, d: 1.6, t: 1.8 }
    ];

    fanfare.forEach(note => {
      this.playTone(note.f, 'triangle', note.d, 0.25, note.t);
      this.playTone(note.f * 1.5, 'sine', note.d, 0.15, note.t);
    });
  }
}

class MillionaireGame {
  constructor() {
    this.sessionQuestions = [];
    this.currentQuestionIdx = 0;
    this.timer = null;
    this.timeLeft = TIMER_START_SECONDS;
    this.isInputLocked = false;
    this.sounds = new SoundManager();

    // Historial y estadísticas (guardados en LocalStorage)
    this.historyStorageKey = "qqm_biblical_history";
    this.history = this.loadHistory();

    // Estado de comodines (2 comodines: 50:50 y Audiencia en vivo)
    this.lifelines = {
      fiftyFifty: true,
      askAudience: true
    };

    // Referencias del DOM
    this.dom = {
      // Vistas
      homeView: document.getElementById('home-view'),
      gameView: document.getElementById('game-view'),
      btnStartGame: document.getElementById('btn-start-game'),
      btnLeaveGame: document.getElementById('btn-leave-game'),
      btnHomeReturn: document.getElementById('btn-home-return'),

      // Estadísticas y tabs del Home
      statTotalGames: document.getElementById('stat-total-games'),
      statMaxPrize: document.getElementById('stat-max-prize'),
      statMillionCount: document.getElementById('stat-million-count'),
      historyList: document.getElementById('history-list'),
      historyActionsRow: document.getElementById('history-actions-row'),
      btnClearHistory: document.getElementById('btn-clear-history'),
      tabHistoryBtn: document.getElementById('tab-history-btn'),
      tabRulesBtn: document.getElementById('tab-rules-btn'),
      paneHistory: document.getElementById('pane-history'),
      paneRules: document.getElementById('pane-rules'),

      // Tablero de Juego
      questionNumber: document.getElementById('question-number'),
      questionText: document.getElementById('question-text'),
      optionsGrid: document.getElementById('options-grid'),
      optionBtns: Array.from(document.querySelectorAll('.option-btn')),
      currentPrizeVal: document.getElementById('current-prize-val'),
      safePrizeVal: document.getElementById('safe-prize-val'),
      timerSeconds: document.getElementById('timer-seconds'),
      timerCircle: document.getElementById('timer-circle'),
      prizeLadder: document.getElementById('prize-ladder'),
      btn5050: document.getElementById('btn-5050'),
      btnAudience: document.getElementById('btn-audience'),
      btnRetire: document.getElementById('btn-retire'),
      btnToggleSound: document.getElementById('btn-toggle-sound'),
      soundIcon: document.getElementById('sound-icon'),

      // Modales y Audiencia Interactiva
      modalAudience: document.getElementById('modal-audience'),
      closeAudienceModal: document.getElementById('close-audience-modal'),
      audienceQrImg: document.getElementById('audience-qr-img'),
      qrDirectLink: document.getElementById('qr-direct-link'),
      totalLiveVotes: document.getElementById('total-live-votes'),
      audienceTimerSec: document.getElementById('audience-timer-sec'),
      audienceTimerBar: document.getElementById('audience-timer-bar'),
      modalNgrok: document.getElementById('modal-ngrok'),
      btnNgrokSetup: document.getElementById('btn-ngrok-setup'),
      btnConfigUrl: document.getElementById('btn-config-url'),
      inputCustomUrl: document.getElementById('input-custom-url'),
      btnSaveNgrok: document.getElementById('btn-save-ngrok'),
      btnCancelNgrok: document.getElementById('btn-cancel-ngrok'),
      // Ficha explicativa bíblica (Cita Bíblica y Contexto Teológico)
      modalExplanation: document.getElementById('modal-explanation'),
      explanationIcon: document.getElementById('explanation-icon'),
      explanationBadge: document.getElementById('explanation-badge'),
      explanationStatusText: document.getElementById('explanation-status-text'),
      explanationCitation: document.getElementById('explanation-citation'),
      explanationBody: document.getElementById('explanation-body'),
      expAutoText: document.getElementById('exp-auto-text'),
      btnExplanationNext: document.getElementById('btn-explanation-next'),
      modalGameover: document.getElementById('modal-gameover'),
      gameoverTitle: document.getElementById('gameover-title'),
      gameoverMsg: document.getElementById('gameover-msg'),
      gameoverPrize: document.getElementById('gameover-prize'),
      gameoverDetail: document.getElementById('gameover-detail'),
      gameoverIcon: document.getElementById('gameover-icon'),
      btnPlayAgain: document.getElementById('btn-play-again'),

      // Tema Claro / Oscuro
      btnThemeToggleHome: document.getElementById('btn-theme-toggle-home'),
      themeIconHome: document.getElementById('theme-icon-home'),
      themeTextHome: document.getElementById('theme-text-home'),
      btnToggleTheme: document.getElementById('btn-toggle-theme'),
      themeIconGame: document.getElementById('theme-icon-game')
    };

    // Almacenamiento de URL personalizada de ngrok
    this.customPublicUrl = localStorage.getItem("qqm_custom_url") || "";
    this.audiencePollInterval = null;
    this.audienceCountdownInterval = null;
    this.audienceTotalSeconds = AUDIENCE_TIMER_SECONDS;
    this.audienceTimeLeft = AUDIENCE_TIMER_SECONDS;
    this.explanationTimer = null;

    // Gestión del tema (Claro / Oscuro)
    this.currentTheme = localStorage.getItem("qqm_theme") || "dark";
    this.applyTheme(this.currentTheme, false);

    this.bindEvents();
    this.renderHomeStats();
  }

  // ==================== PERSISTENCIA Y HOME ====================
  loadHistory() {
    try {
      const data = localStorage.getItem(this.historyStorageKey);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  saveHistory(record) {
    this.history.unshift(record); // El más reciente primero
    if (this.history.length > 30) this.history.pop();
    try {
      localStorage.setItem(this.historyStorageKey, JSON.stringify(this.history));
    } catch (e) {}
    this.renderHomeStats();
  }

  clearHistory() {
    this.history = [];
    try {
      localStorage.removeItem(this.historyStorageKey);
    } catch (e) {}
    this.renderHomeStats();
  }

  renderHomeStats() {
    const total = this.history.length;
    this.dom.statTotalGames.textContent = total;

    // Calcular máximo premio
    let maxNumeric = 0;
    let maxPrizeStr = "$0";
    let millionWins = 0;

    this.history.forEach(item => {
      const num = parseInt(item.prize.replace(/[^0-9]/g, ''), 10) || 0;
      if (num > maxNumeric) {
        maxNumeric = num;
        maxPrizeStr = item.prize;
      }
      if (num === 1000000) millionWins++;
    });

    this.dom.statMaxPrize.textContent = maxPrizeStr;
    this.dom.statMillionCount.textContent = millionWins;

    // Renderizar lista del historial
    this.dom.historyList.innerHTML = '';
    if (total === 0) {
      this.dom.historyList.innerHTML = `<li class="history-empty">Aún no has jugado ninguna partida. ¡Inicia una ahora y pon tu conocimiento a prueba!</li>`;
      this.dom.historyActionsRow.style.display = 'none';
    } else {
      this.dom.historyActionsRow.style.display = 'flex';
      this.history.forEach(item => {
        const li = document.createElement('li');
        li.className = 'history-item';

        const isWin = item.prize === "$1,000,000";
        const icon = isWin ? "👑" : (item.status === "retired" ? "💰" : "❌");

        li.innerHTML = `
          <div class="history-main">
            <span class="history-icon">${icon}</span>
            <div class="history-info">
              <strong>${item.reason}</strong>
              <small>${item.date} • Alcanzó pregunta ${item.questionReached} de 15</small>
            </div>
          </div>
          <div class="history-prize">${item.prize}</div>
        `;
        this.dom.historyList.appendChild(li);
      });
    }
  }

  goToHome() {
    this.stopTimer();
    this.sounds.stopAmbient();
    this.closeModal(this.dom.modalGameover);
    this.dom.gameView.style.display = 'none';
    this.dom.homeView.style.display = 'block';
    this.renderHomeStats();
  }

  startNewGameFromHome() {
    this.sounds.init();
    this.dom.homeView.style.display = 'none';
    this.dom.gameView.style.display = 'grid';
    this.initGame();
  }

  /**
   * Selecciona aleatoriamente 15 preguntas del banco completo:
   * 5 fáciles (niveles 1-5), 5 intermedias (niveles 6-10), 5 difíciles (niveles 11-15)
   */
  selectSessionQuestions() {
    const shuffle = arr => [...arr].sort(() => 0.5 - Math.random());

    const easyPool = shuffle(questionsData.filter(q => q.difficulty === 'easy'));
    const mediumPool = shuffle(questionsData.filter(q => q.difficulty === 'medium'));
    const hardPool = shuffle(questionsData.filter(q => q.difficulty === 'hard'));

    const selectedEasy = easyPool.slice(0, 5);
    const selectedMedium = mediumPool.slice(0, 5);
    const selectedHard = hardPool.slice(0, 5);

    return [...selectedEasy, ...selectedMedium, ...selectedHard];
  }

  bindEvents() {
    // Activar AudioContext en el primer click de usuario para cumplir con políticas del navegador
    document.addEventListener('click', () => {
      this.sounds.init();
    }, { once: true });

    // Botón activar/silenciar sonido
    if (this.dom.btnToggleSound) {
      this.dom.btnToggleSound.addEventListener('click', () => {
        const isMuted = this.sounds.toggleMute();
        this.dom.soundIcon.textContent = isMuted ? '🔇' : '🔊';
        this.dom.btnToggleSound.classList.toggle('muted', isMuted);
      });
    }

    // Click en opciones
    this.dom.optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const selectedIdx = parseInt(btn.dataset.index, 10);
        this.handleSelectAnswer(selectedIdx);
      });
    });

    // Comodines
    if (this.dom.btn5050) this.dom.btn5050.addEventListener('click', () => this.useFiftyFifty());
    if (this.dom.btnAudience) this.dom.btnAudience.addEventListener('click', () => this.useAskAudience());

    // Cierre de modales
    if (this.dom.closeAudienceModal) this.dom.closeAudienceModal.addEventListener('click', () => this.closeModal(this.dom.modalAudience));

    // Controles de navegación de Home
    if (this.dom.btnStartGame) {
      this.dom.btnStartGame.addEventListener('click', () => this.startNewGameFromHome());
    }

    if (this.dom.btnLeaveGame) {
      this.dom.btnLeaveGame.addEventListener('click', () => {
        if (confirm("¿Deseas salir al Menú Principal? Se cancelará la partida actual.")) {
          this.goToHome();
        }
      });
    }

    if (this.dom.btnHomeReturn) {
      this.dom.btnHomeReturn.addEventListener('click', () => this.goToHome());
    }

    // Tabs del Home
    if (this.dom.tabHistoryBtn && this.dom.tabRulesBtn) {
      this.dom.tabHistoryBtn.addEventListener('click', () => {
        this.dom.tabHistoryBtn.classList.add('active');
        this.dom.tabRulesBtn.classList.remove('active');
        this.dom.paneHistory.classList.add('active');
        this.dom.paneRules.classList.remove('active');
      });

      this.dom.tabRulesBtn.addEventListener('click', () => {
        this.dom.tabRulesBtn.classList.add('active');
        this.dom.tabHistoryBtn.classList.remove('active');
        this.dom.paneRules.classList.add('active');
        this.dom.paneHistory.classList.remove('active');
      });
    }

    if (this.dom.btnClearHistory) {
      this.dom.btnClearHistory.addEventListener('click', () => {
        if (confirm("¿Estás seguro de que deseas borrar todo el historial de partidas?")) {
          this.clearHistory();
        }
      });
    }

    // Configuración de URL pública (ngrok)
    const openNgrokModal = () => {
      if (this.dom.inputCustomUrl) {
        this.dom.inputCustomUrl.value = this.customPublicUrl;
      }
      this.openModal(this.dom.modalNgrok);
    };

    if (this.dom.btnNgrokSetup) this.dom.btnNgrokSetup.addEventListener('click', openNgrokModal);
    if (this.dom.btnConfigUrl) this.dom.btnConfigUrl.addEventListener('click', openNgrokModal);

    if (this.dom.btnCancelNgrok) {
      this.dom.btnCancelNgrok.addEventListener('click', () => {
        this.closeModal(this.dom.modalNgrok);
      });
    }

    if (this.dom.btnSaveNgrok) {
      this.dom.btnSaveNgrok.addEventListener('click', () => {
        let val = this.dom.inputCustomUrl ? this.dom.inputCustomUrl.value.trim() : '';
        if (val) {
          if (!val.startsWith('http://') && !val.startsWith('https://')) {
            val = 'https://' + val;
          }
          // Quitar barra final si la tiene
          if (val.endsWith('/')) val = val.slice(0, -1);

          // Si el usuario puso sólo el dominio de ngrok sin /QQM, lo añadimos automáticamente
          try {
            const parsed = new URL(val);
            if (!parsed.pathname || parsed.pathname === '/' || parsed.pathname === '') {
              val = `${parsed.origin}/QQM`;
            } else if (parsed.pathname.endsWith('/vote.html')) {
              val = val.replace('/vote.html', '');
            }
          } catch(e) {}
        }

        this.customPublicUrl = val;
        localStorage.setItem("qqm_custom_url", val);
        this.closeModal(this.dom.modalNgrok);
        alert(val ? `¡URL pública configurada!\nEl código QR ahora apuntará a:\n${val}/vote.html` : "Se ha restablecido la dirección a la IP local por defecto.");
      });
    }

    // Ficha explicativa bíblica (Siguiente)
    if (this.dom.btnExplanationNext) {
      this.dom.btnExplanationNext.addEventListener('click', () => {
        this.closeExplanationAndProceed();
      });
    }

    // Control de cambio de tema Claro / Oscuro
    const handleToggleTheme = () => this.toggleTheme();
    if (this.dom.btnThemeToggleHome) this.dom.btnThemeToggleHome.addEventListener('click', handleToggleTheme);
    if (this.dom.btnToggleTheme) this.dom.btnToggleTheme.addEventListener('click', handleToggleTheme);

    // Retirarse y reiniciar
    this.dom.btnRetire.addEventListener('click', () => this.handleRetire());
    this.dom.btnPlayAgain.addEventListener('click', () => this.restartGame());
  }

  // ==================== TEMA CLARO / OSCURO ====================
  applyTheme(theme, save = true) {
    this.currentTheme = theme;
    const isLight = theme === 'light';

    if (isLight) {
      document.body.classList.add('theme-light');
      if (this.dom.themeIconHome) this.dom.themeIconHome.textContent = '🌙';
      if (this.dom.themeTextHome) this.dom.themeTextHome.textContent = 'Modo Oscuro';
      if (this.dom.themeIconGame) this.dom.themeIconGame.textContent = '🌙';
      if (this.dom.btnToggleTheme) this.dom.btnToggleTheme.title = 'Cambiar a Modo Oscuro';
      if (this.dom.btnThemeToggleHome) this.dom.btnThemeToggleHome.title = 'Cambiar a Modo Oscuro';
    } else {
      document.body.classList.remove('theme-light');
      if (this.dom.themeIconHome) this.dom.themeIconHome.textContent = '☀️';
      if (this.dom.themeTextHome) this.dom.themeTextHome.textContent = 'Modo Claro';
      if (this.dom.themeIconGame) this.dom.themeIconGame.textContent = '☀️';
      if (this.dom.btnToggleTheme) this.dom.btnToggleTheme.title = 'Cambiar a Modo Claro';
      if (this.dom.btnThemeToggleHome) this.dom.btnThemeToggleHome.title = 'Cambiar a Modo Claro';
    }

    if (save) {
      try {
        localStorage.setItem("qqm_theme", theme);
      } catch (e) {}
    }
  }

  toggleTheme() {
    const nextTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(nextTheme, true);
  }

  initGame() {
    // Generar nuevo set aleatorio de 15 preguntas para esta partida
    this.sessionQuestions = this.selectSessionQuestions();
    this.currentQuestionIdx = 0;
    this.isInputLocked = false;
    this.lifelines = { fiftyFifty: true, askAudience: true };

    // Resetear botones comodines
    [this.dom.btn5050, this.dom.btnAudience].forEach(btn => {
      if (btn) btn.disabled = false;
    });

    this.renderPrizeLadder();
    this.loadQuestion();
  }

  renderPrizeLadder() {
    this.dom.prizeLadder.innerHTML = '';
    // Renderizamos de la pregunta 15 (arriba) a la 1 (abajo)
    for (let i = PRIZE_SCALE.length - 1; i >= 0; i--) {
      const li = document.createElement('li');
      li.className = 'ladder-item';
      li.id = `ladder-tier-${i}`;

      if (i === 14) {
        li.classList.add('million-tier');
      } else if (SAFE_CHECKPOINTS.includes(i)) {
        li.classList.add('safe-tier');
      }

      const qNum = document.createElement('span');
      qNum.className = 'lvl-num';
      qNum.textContent = (i + 1).toString().padStart(2, '0');

      const amount = document.createElement('span');
      amount.className = 'lvl-amount';
      amount.textContent = PRIZE_SCALE[i];

      li.appendChild(qNum);
      li.appendChild(amount);
      this.dom.prizeLadder.appendChild(li);
    }
  }

  updateLadderHighlight() {
    for (let i = 0; i < PRIZE_SCALE.length; i++) {
      const item = document.getElementById(`ladder-tier-${i}`);
      if (!item) continue;
      item.classList.remove('current-tier', 'passed-tier');

      if (i === this.currentQuestionIdx) {
        item.classList.add('current-tier');
      } else if (i < this.currentQuestionIdx) {
        item.classList.add('passed-tier');
      }
    }
  }

  getCurrentSafePrize() {
    if (this.currentQuestionIdx > 9) return PRIZE_SCALE[9]; // $32,000
    if (this.currentQuestionIdx > 4) return PRIZE_SCALE[4]; // $1,000
    return "$0";
  }

  loadQuestion() {
    this.isInputLocked = false;
    const currentQ = this.sessionQuestions[this.currentQuestionIdx];

    // Actualizar estado superior
    this.dom.questionNumber.textContent = `Pregunta ${this.currentQuestionIdx + 1} de 15 • Dificultad: ${currentQ.difficulty.toUpperCase()}`;
    this.dom.questionText.textContent = currentQ.question;
    this.dom.currentPrizeVal.textContent = PRIZE_SCALE[this.currentQuestionIdx];
    this.dom.safePrizeVal.textContent = this.getCurrentSafePrize();

    // Actualizar opciones
    const letterLabels = ["A", "B", "C", "D"];
    this.dom.optionBtns.forEach((btn, idx) => {
      btn.className = 'option-btn';
      btn.disabled = false;
      btn.querySelector('.opt-letter').textContent = `${letterLabels[idx]}:`;
      btn.querySelector('.opt-text').textContent = currentQ.options[idx];
    });

    this.updateLadderHighlight();

    // Sonido distintivo de presentación de la pregunta (Orquestal TV Sting + Drone)
    this.sounds.playQuestionSting(this.currentQuestionIdx);

    this.startTimer();
  }

  startTimer() {
    this.stopTimer();
    this.timeLeft = TIMER_START_SECONDS;
    this.updateTimerDisplay();

    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      // Efecto tictac de tensión
      if (this.timeLeft <= 10 && this.timeLeft > 0) {
        this.sounds.playClockTick(this.timeLeft <= 5);
      }

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeOut();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  updateTimerDisplay() {
    this.dom.timerSeconds.textContent = this.timeLeft;
    this.dom.timerCircle.classList.remove('warning', 'danger');

    if (this.timeLeft <= 5) {
      this.dom.timerCircle.classList.add('danger');
    } else if (this.timeLeft <= 10) {
      this.dom.timerCircle.classList.add('warning');
    }
  }

  handleTimeOut() {
    if (this.isInputLocked) return;
    this.isInputLocked = true;
    this.sounds.stopAmbient();
    this.sounds.playWrongSting();

    const currentQ = this.sessionQuestions[this.currentQuestionIdx];
    const correctIdx = currentQ.correct;
    this.dom.optionBtns[correctIdx].classList.add('correct');

    setTimeout(() => {
      this.showExplanationCard(currentQ, false);
    }, 1500);
  }

  handleSelectAnswer(selectedIdx) {
    if (this.isInputLocked) return;
    this.isInputLocked = true;
    this.stopTimer();

    // Sonido distintivo de "Respuesta Definitiva" y suspenso televisivo
    this.sounds.playFinalAnswerSuspense();

    const selectedBtn = this.dom.optionBtns[selectedIdx];
    selectedBtn.classList.add('selected');

    const currentQ = this.sessionQuestions[this.currentQuestionIdx];
    const isCorrect = (selectedIdx === currentQ.correct);

    // Tensión dramática de TV show (2.2 segundos de deliberación)
    setTimeout(() => {
      selectedBtn.classList.remove('selected');

      if (isCorrect) {
        selectedBtn.classList.add('correct');
        const isSafeFloor = SAFE_CHECKPOINTS.includes(this.currentQuestionIdx);
        this.sounds.playCorrectSting(isSafeFloor);

        setTimeout(() => {
          this.showExplanationCard(currentQ, true);
        }, 1600);
      } else {
        selectedBtn.classList.add('wrong');
        this.dom.optionBtns[currentQ.correct].classList.add('correct');
        this.sounds.playWrongSting();

        setTimeout(() => {
          this.showExplanationCard(currentQ, false);
        }, 1800);
      }
    }, 2200);
  }

  showExplanationCard(currentQ, isCorrect) {
    // Parsear cita y explicación (Ejemplo: "Génesis 6:13-14 - Dios le ordenó a Noé...")
    let citation = "Referencia Bíblica";
    let bodyText = currentQ.explanation;

    if (currentQ.explanation.includes(" - ")) {
      const parts = currentQ.explanation.split(" - ");
      citation = parts[0].trim();
      bodyText = parts.slice(1).join(" - ").trim();
    } else if (currentQ.explanation.includes(":")) {
      citation = "Texto Sagrado";
    }

    if (this.dom.explanationCitation) this.dom.explanationCitation.textContent = citation;
    if (this.dom.explanationBody) this.dom.explanationBody.textContent = `"${bodyText}"`;

    if (this.dom.explanationBadge) {
      this.dom.explanationBadge.classList.toggle('wrong-mode', !isCorrect);
    }
    if (this.dom.explanationStatusText) {
      this.dom.explanationStatusText.textContent = isCorrect ? "¡Respuesta Correcta!" : "¡Respuesta Incorrecta!";
    }
    if (this.dom.btnExplanationNext) {
      this.dom.btnExplanationNext.textContent = isCorrect 
        ? (this.currentQuestionIdx === this.sessionQuestions.length - 1 ? "Ver Premio Final 👑" : "Siguiente Pregunta ➡")
        : "Ver Resultados 📊";
    }

    this.pendingIsCorrect = isCorrect;
    this.openModal(this.dom.modalExplanation);

    // Cuenta regresiva automática de 7 segundos para avanzar
    let countdown = 7;
    if (this.dom.expAutoText) {
      this.dom.expAutoText.innerHTML = `Avanzando automáticamente en <strong>${countdown}s</strong> o pulsa Continuar`;
    }

    if (this.explanationTimer) clearInterval(this.explanationTimer);
    this.explanationTimer = setInterval(() => {
      countdown--;
      if (this.dom.expAutoText) {
        this.dom.expAutoText.innerHTML = `Avanzando automáticamente en <strong>${countdown}s</strong> o pulsa Continuar`;
      }
      if (countdown <= 0) {
        clearInterval(this.explanationTimer);
        this.explanationTimer = null;
        this.closeExplanationAndProceed();
      }
    }, 1000);
  }

  closeExplanationAndProceed() {
    if (this.explanationTimer) {
      clearInterval(this.explanationTimer);
      this.explanationTimer = null;
    }
    this.closeModal(this.dom.modalExplanation);

    if (this.pendingIsCorrect) {
      this.handleCorrectProgression();
    } else {
      const currentQ = this.sessionQuestions[this.currentQuestionIdx];
      this.showGameOver({
        title: "¡Respuesta Incorrecta!",
        msg: "Has fallado la pregunta.",
        prize: this.getCurrentSafePrize(),
        detail: `La respuesta correcta era: "${currentQ.options[currentQ.correct]}".\n${currentQ.explanation}`,
        icon: "❌",
        status: "wrong"
      });
    }
  }

  handleCorrectProgression() {
    if (this.currentQuestionIdx === this.sessionQuestions.length - 1) {
      // ¡GANÓ EL MILLÓN!
      this.sounds.playMillionGrandTheme();
      this.showGameOver({
        title: "¡ERES MILLONARIO!",
        msg: "¡Felicidades! Has respondido correctamente las 15 preguntas bíblicas.",
        prize: "$1,000,000",
        detail: "Has demostrado un conocimiento y sabiduría excepcionales de las Sagradas Escrituras.",
        icon: "👑",
        status: "won"
      });
    } else {
      this.currentQuestionIdx++;
      this.loadQuestion();
    }
  }

  handleRetire() {
    if (this.isInputLocked) return;
    this.stopTimer();
    this.sounds.stopAmbient();
    const wonPrize = (this.currentQuestionIdx === 0) ? "$0" : PRIZE_SCALE[this.currentQuestionIdx - 1];

    this.showGameOver({
      title: "Te has retirado de la partida",
      msg: "Decidiste asegurar tus ganancias.",
      prize: wonPrize,
      detail: `Decisión prudente. Te llevas a casa ${wonPrize} antes de arriesgarte en la pregunta ${this.currentQuestionIdx + 1}.`,
      icon: "💰",
      status: "retired"
    });
  }

  // ==================== COMODINES ====================
  useFiftyFifty() {
    if (!this.lifelines.fiftyFifty || this.isInputLocked) return;
    this.lifelines.fiftyFifty = false;
    this.dom.btn5050.disabled = true;
    this.sounds.playLifelineSting();

    const currentQ = this.sessionQuestions[this.currentQuestionIdx];
    const incorrectIndices = [0, 1, 2, 3].filter(i => i !== currentQ.correct);

    // Seleccionar 2 incorrectas aleatorias para ocultar
    const shuffled = incorrectIndices.sort(() => 0.5 - Math.random());
    const toHide = shuffled.slice(0, 2);

    toHide.forEach(idx => {
      this.dom.optionBtns[idx].classList.add('hidden-5050');
    });
  }

  useAskAudience() {
    if (!this.lifelines.askAudience || this.isInputLocked) return;
    this.lifelines.askAudience = false;
    this.dom.btnAudience.disabled = true;
    this.sounds.playLifelineSting();

    const currentQ = this.sessionQuestions[this.currentQuestionIdx];

    // Resetear visualmente las barras
    for (let i = 0; i < 4; i++) {
      const fill = document.getElementById(`bar-fill-${i}`);
      const pct = document.getElementById(`bar-pct-${i}`);
      if (fill && pct) {
        fill.style.height = `0%`;
        pct.textContent = `0%`;
      }
    }
    if (this.dom.totalLiveVotes) this.dom.totalLiveVotes.textContent = '0';

    // 1. Pausar el reloj del concursante mientras la audiencia vota
    this.stopTimer();

    // 2. Determinar la URL para escanear
    // Si el usuario configuró ngrok o un dominio público, se usa directamente
    let voteUrl = "";
    if (this.customPublicUrl) {
      let base = this.customPublicUrl.trim();
      if (base.endsWith('/')) base = base.slice(0, -1);
      if (base.endsWith('/vote.html')) base = base.replace('/vote.html', '');
      
      // Si la URL de ngrok no tiene /QQM, añadirlo automáticamente porque Laragon sirve desde www/QQM
      if (!base.endsWith('/QQM') && !base.includes('/QQM/')) {
        base = `${base}/QQM`;
      }
      voteUrl = `${base}/vote.html`;
    } else {
      const currentHost = window.location.host;
      let voteUrlHost = currentHost;
      if (currentHost.includes('localhost') || currentHost.includes('127.0.0.1')) {
        voteUrlHost = '192.168.1.107' + (window.location.port ? ':' + window.location.port : '');
      }
      voteUrl = `${window.location.protocol}//${voteUrlHost}${window.location.pathname.replace('index.html', '')}vote.html`;
    }

    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(voteUrl)}`;

    if (this.dom.audienceQrImg) this.dom.audienceQrImg.src = qrApiUrl;
    if (this.dom.qrDirectLink) this.dom.qrDirectLink.textContent = voteUrl;

    // 3. Iniciar temporizador de la Audiencia (90 segundos para que escaneen y voten)
    this.audienceTotalSeconds = AUDIENCE_TIMER_SECONDS;
    this.audienceTimeLeft = this.audienceTotalSeconds;
    this.updateAudienceTimerDisplay();

    if (this.audienceCountdownInterval) clearInterval(this.audienceCountdownInterval);
    this.audienceCountdownInterval = setInterval(() => {
      this.audienceTimeLeft--;
      this.updateAudienceTimerDisplay();

      if (this.audienceTimeLeft <= 0) {
        clearInterval(this.audienceCountdownInterval);
        this.audienceCountdownInterval = null;
        if (this.dom.audienceTimerSec) this.dom.audienceTimerSec.textContent = "¡Tiempo cumplido!";
      }
    }, 1000);

    this.openModal(this.dom.modalAudience);

    // 4. Iniciar sesión en backend PHP
    fetch('audience_api.php?action=start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: currentQ.question,
        options: currentQ.options
      })
    }).then(r => r.json()).catch(() => {});

    // Sondeo de votos cada 1.5 segundos mientras el modal esté abierto
    if (this.audiencePollInterval) clearInterval(this.audiencePollInterval);
    this.audiencePollInterval = setInterval(() => {
      this.pollAudienceVotes();
    }, 1500);
  }

  pollAudienceVotes() {
    fetch('audience_api.php?action=status')
      .then(res => res.json())
      .then(json => {
        if (!json.success || !json.data) return;
        const { votes, totalVotes } = json.data;
        if (this.dom.totalLiveVotes) this.dom.totalLiveVotes.textContent = totalVotes;

        if (totalVotes > 0) {
          for (let i = 0; i < 4; i++) {
            const count = votes[i] || 0;
            const pct = Math.round((count / totalVotes) * 100);
            const fill = document.getElementById(`bar-fill-${i}`);
            const pctEl = document.getElementById(`bar-pct-${i}`);
            if (fill && pctEl) {
              fill.style.height = `${pct}%`;
              pctEl.textContent = `${pct}%`;
            }
          }
        }
      })
      .catch(() => {});
  }

  updateAudienceTimerDisplay() {
    if (!this.dom.audienceTimerSec) return;
    const mins = Math.floor(this.audienceTimeLeft / 60);
    const secs = this.audienceTimeLeft % 60;
    const timeFormatted = mins > 0 
      ? `${mins}:${secs.toString().padStart(2, '0')} (${this.audienceTimeLeft}s)`
      : `${this.audienceTimeLeft}s`;

    this.dom.audienceTimerSec.textContent = timeFormatted;
    if (this.dom.audienceTimerBar) {
      const total = this.audienceTotalSeconds || AUDIENCE_TIMER_SECONDS;
      const pct = Math.max(0, (this.audienceTimeLeft / total) * 100);
      this.dom.audienceTimerBar.style.width = `${pct}%`;
    }
  }

  // ==================== MODALES ====================
  openModal(modalElem) {
    modalElem.classList.add('active');
  }

  closeModal(modalElem) {
    modalElem.classList.remove('active');

    // Si se cierra el modal de audiencia
    if (modalElem === this.dom.modalAudience) {
      if (this.audiencePollInterval) {
        clearInterval(this.audiencePollInterval);
        this.audiencePollInterval = null;
      }
      if (this.audienceCountdownInterval) {
        clearInterval(this.audienceCountdownInterval);
        this.audienceCountdownInterval = null;
      }
      fetch('audience_api.php?action=close').catch(() => {});

      // Bono de tiempo: reactivar reloj del participante con 45 segundos completos para deliberar
      this.timeLeft = Math.max(this.timeLeft, TIMER_START_SECONDS);
      this.updateTimerDisplay();
      this.resumeTimer();
    }
  }

  resumeTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      this.timeLeft--;
      this.updateTimerDisplay();

      if (this.timeLeft <= 10 && this.timeLeft > 0) {
        this.sounds.playClockTick(this.timeLeft <= 5);
      }

      if (this.timeLeft <= 0) {
        this.stopTimer();
        this.handleTimeOut();
      }
    }, 1000);
  }

  showGameOver({ title, msg, prize, detail, icon, status = "finished" }) {
    this.dom.gameoverTitle.textContent = title;
    this.dom.gameoverMsg.textContent = msg;
    this.dom.gameoverPrize.textContent = prize;
    this.dom.gameoverDetail.textContent = detail;
    this.dom.gameoverIcon.textContent = icon || "🏆";
    this.openModal(this.dom.modalGameover);

    // Guardar en el historial de partidas
    const now = new Date();
    const formattedDate = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth()+1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    this.saveHistory({
      date: formattedDate,
      reason: title,
      prize: prize,
      questionReached: this.currentQuestionIdx + 1,
      status: status
    });
  }

  restartGame() {
    this.sounds.stopAmbient();
    this.closeModal(this.dom.modalGameover);
    this.initGame();
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.game = new MillionaireGame();
});
