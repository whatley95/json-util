<template>
  <div id="app" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="fixed-nav-container" :class="{ 'nav-hidden': isFullscreen && !showNavInFullscreen }">
      <header>
        <div class="title-container">
          <div class="logo-section">
            <div class="logo-icon">{&thinsp;}</div>
            <div class="title-text">
              <h1 class="app-title">JSON Utilities <span class="app-version">v{{ appVersion }}</span></h1>
            </div>
          </div>
          <span v-if="currentSubtitle" class="app-subtitle">{{ currentSubtitle }}</span>
        </div>
        <div class="header-controls">
          <button @click="toggleMenu" class="menu-btn mobile-only" aria-label="Toggle menu">
            <span class="menu-icon"></span>
          </button>
          <div class="control-group">
            <button v-if="isFullscreen" @click="toggleNavInFullscreen" class="control-btn nav-toggle-btn"
              :title="showNavInFullscreen ? 'Hide navigation' : 'Show navigation'">
              <span class="nav-toggle-icon" :class="{ 'nav-hidden-icon': !showNavInFullscreen }"></span>
            </button>
            <button @click="toggleFullscreen" class="control-btn fullscreen-btn"
              :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
              <span class="fullscreen-icon" :class="{ 'exit-fullscreen': isFullscreen }"></span>
            </button>
            <button @click="toggleTheme" class="control-btn theme-btn"
              :title="isDarkTheme ? 'Switch to light mode' : 'Switch to dark mode'">
              <span class="theme-icon">{{ isDarkTheme ? '☀️' : '🌙' }}</span>
            </button>
          </div>
        </div>
      </header>

      <nav class="nav" :class="{ 'menu-open': isMenuOpen }">
        <div class="nav-container">
          <router-link to="/" class="nav-link" @click="isMenuOpen = false">Home</router-link>
          <router-link to="/diff" class="nav-link" @click="isMenuOpen = false">Diff</router-link>
          <router-link to="/escape" class="nav-link" @click="isMenuOpen = false">Escape</router-link>
          <router-link to="/beautify" class="nav-link" @click="isMenuOpen = false">Beautify</router-link>
          <router-link to="/converter" class="nav-link" @click="isMenuOpen = false">Converter</router-link>
          <router-link to="/validate" class="nav-link" @click="isMenuOpen = false">Validate</router-link>
          <router-link to="/path" class="nav-link" @click="isMenuOpen = false">JSONPath</router-link>
        </div>
      </nav>
    </div>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <div class="footer-content">
        <div class="footer-row">
          <span class="footer-brand">JSON Utilities v{{ appVersion }}</span>
          <span class="footer-sep">&middot;</span>
          <span class="footer-tech">Vue 3 + TypeScript</span>
          <span class="footer-sep">&middot;</span>
          <button @click="clearAllHistories" class="footer-clear-btn" title="Clear all saved histories">
            Clear History
          </button>
        </div>
        <div class="footer-row footer-bottom">
          <span>&copy; {{ buildYear }}
            <a href="https://whatley.xyz/playground" target="_blank" rel="noopener" class="footer-link">Whatley</a>
          </span>
          <span class="footer-sep">&middot;</span>
          <a href="https://github.com/whatley95/json-util" target="_blank" rel="noopener" class="footer-link">GitHub</a>
          <span class="footer-sep">&middot;</span>
          <span class="footer-license">MIT License</span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { clearAllHistory } from './utils/localStorage';

// App version from build time
const appVersion = __APP_VERSION__;
const buildYear = new Date().getFullYear();

// Theme handling
const isDarkTheme = ref(true);
// Menu state for mobile
const isMenuOpen = ref(false);
// Fullscreen state
const isFullscreen = ref(false);
// Controls visibility of navigation when in fullscreen mode
const showNavInFullscreen = ref(false);

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  document.documentElement.classList.toggle('light-theme');

  // Save theme preference
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
}

function toggleMenu() {
  isMenuOpen.value = !isMenuOpen.value;
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
}

// Toggle fullscreen mode
function toggleFullscreen() {
  if (!isFullscreen.value) {
    // Enter fullscreen
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
    } else if (document.documentElement.webkitRequestFullscreen) {
      document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) {
      document.documentElement.msRequestFullscreen();
    }
    isFullscreen.value = true;
    // Hide navigation by default when entering fullscreen
    showNavInFullscreen.value = false;
  } else {
    // Exit fullscreen
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
    isFullscreen.value = false;
  }
}

// Toggle navigation visibility in fullscreen mode
function toggleNavInFullscreen() {
  showNavInFullscreen.value = !showNavInFullscreen.value;
}

// Clear all histories from all tools
function clearAllHistories() {
  if (confirm('Are you sure you want to clear all history for all tools?')) {
    clearAllHistory();
    alert('All history has been cleared');
  }
}

// Handle fullscreen change events
function handleFullscreenChange() {
  const fullscreenActive = Boolean(
    document.fullscreenElement ||
    document.webkitFullscreenElement ||
    document.msFullscreenElement
  );

  // Update fullscreen state
  isFullscreen.value = fullscreenActive;

  // If we exited fullscreen via browser controls (e.g., Escape key)
  if (!fullscreenActive) {
    showNavInFullscreen.value = false;
  }
}

// Get the current route
const route = useRoute();

// Map of route names to subtitles
const subtitles = {
  home: '',
  diff: 'Diff Tool',
  escape: 'Escape/Unescape',
  beautify: 'Beautify/Minify',
  converter: 'Object Converter',
  validate: 'Validation',
  path: 'JSONPath'
};

// Computed property to get the current subtitle
const currentSubtitle = computed(() => {
  return subtitles[route.name as keyof typeof subtitles] || '';
});

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDarkTheme.value = false;
    document.documentElement.classList.add('light-theme');
  }

  // Add event listeners
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);
});

onUnmounted(() => {
  // Clean up event listeners
  document.removeEventListener('fullscreenchange', handleFullscreenChange);
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.removeEventListener('msfullscreenchange', handleFullscreenChange);
});
</script>

<style scoped>
#app {
  width: 100%;
  max-width: none;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  padding: 0;
}

/* ── Header ── */
header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 200;
  backdrop-filter: blur(12px);
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--primary);
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
}

.title-text {
  display: flex;
  flex-direction: column;
}

.app-title {
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0;
  color: var(--text);
  letter-spacing: -0.01em;
}

.app-version {
  font-weight: 400;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.title-container {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.app-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
  white-space: nowrap;
  padding-left: 16px;
  border-left: 1px solid var(--border-color);
}

/* ── Controls ── */
.header-controls {
  display: flex;
  align-items: center;
  gap: 6px;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 2px;
  border-radius: var(--radius-sm);
}

.control-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  color: var(--text-muted);
}

.control-btn:hover {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text);
}

.theme-icon {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.theme-btn:hover .theme-icon {
  transform: rotate(15deg);
}

.fullscreen-icon {
  position: relative;
  width: 13px;
  height: 13px;
  border: 1.5px solid currentColor;
  border-radius: 1.5px;
}

.fullscreen-icon::before {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-top: 1.5px solid currentColor;
  border-right: 1.5px solid currentColor;
  top: -3px;
  right: -3px;
}

.fullscreen-icon::after {
  content: '';
  position: absolute;
  width: 4px;
  height: 4px;
  border-bottom: 1.5px solid currentColor;
  border-left: 1.5px solid currentColor;
  bottom: -3px;
  left: -3px;
}

.exit-fullscreen {
  border-width: 0;
}

.exit-fullscreen::before {
  width: 5px;
  height: 5px;
  top: 0;
  right: 0;
}

.exit-fullscreen::after {
  width: 5px;
  height: 5px;
  bottom: 0;
  left: 0;
}

/* ── Navigation ── */
.fixed-nav-container {
  position: sticky;
  top: 0;
  z-index: 200;
  width: 100%;
}

.nav {
  overflow-x: auto;
  padding: 0.35rem 1rem;
  white-space: nowrap;
  background: var(--card-bg);
  border-bottom: 1px solid var(--border-color);
  transition: background-color 0.15s ease;
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: nowrap;
}

.nav::-webkit-scrollbar {
  height: 3px;
}

.nav::-webkit-scrollbar-track {
  background: transparent;
}

.nav::-webkit-scrollbar-thumb {
  background: rgba(var(--primary-rgb), 0.3);
  border-radius: 3px;
}

.nav-link {
  position: relative;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  transition: color 0.15s ease, background-color 0.15s ease;
  font-size: 0.8rem;
  text-decoration: none;
  color: var(--text-muted);
  font-weight: 500;
}

.nav-link:hover {
  color: var(--text);
  background: rgba(255, 255, 255, 0.04);
}

.nav-link.router-link-active {
  color: var(--primary);
  background: rgba(var(--primary-rgb), 0.08);
}

/* ── Main ── */
.main-content {
  flex: 1;
  padding: 0 1rem;
}

/* ── Footer ── */
.footer {
  margin-top: 2rem;
  padding: 1.25rem 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
  border-top: 1px solid var(--border-color);
  background: var(--surface);
}

.footer-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.footer-brand {
  font-weight: 600;
  color: var(--text);
  font-size: 0.8rem;
}

.footer-tech {
  color: var(--text-muted);
}

.footer-sep {
  color: var(--text-muted);
  opacity: 0.4;
}

.footer-clear-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.75rem;
  transition: color 0.15s ease, border-color 0.15s ease;
}

.footer-clear-btn:hover {
  color: var(--danger);
  border-color: var(--danger);
}

.footer-bottom {
  font-size: 0.75rem;
}

.footer-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.footer-link:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.footer-license {
  color: var(--text-muted);
  opacity: 0.7;
}

/* ── Tool description ── */
.tool-description {
  font-size: 0.95rem;
  color: var(--text-muted);
  margin-bottom: 1.25rem;
  max-width: 800px;
  line-height: 1.5;
}

/* ── Fullscreen overrides ── */
.fixed-nav-container.nav-hidden .nav {
  display: none;
}

.fixed-nav-container.nav-hidden + .main-content {
  padding-top: 1rem;
}

.nav-hidden header {
  margin-bottom: 0;
}

#app.is-fullscreen .main-content {
  padding: 1rem 2rem;
}

/* ── Nav toggle icon ── */
.nav-toggle-icon {
  position: relative;
  width: 16px;
  height: 10px;
}

.nav-toggle-icon:before,
.nav-toggle-icon:after {
  content: '';
  position: absolute;
  width: 16px;
  height: 1.5px;
  background: currentColor;
  left: 0;
}

.nav-toggle-icon:before {
  top: 0;
}

.nav-toggle-icon:after {
  bottom: 0;
  box-shadow: 0 -4px 0 currentColor;
}

.nav-hidden-icon:before,
.nav-hidden-icon:after {
  top: 4px;
}

.nav-hidden-icon:after {
  box-shadow: none;
}

/* ── Mobile ── */
.mobile-only {
  display: none;
}

.menu-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  position: relative;
  margin-right: 0.75rem;
  cursor: pointer;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.2s ease;
}

.menu-icon {
  top: 15px;
  left: 6px;
}

.menu-icon::before {
  content: '';
  top: -7px;
  left: 0;
}

.menu-icon::after {
  content: '';
  top: 7px;
  left: 0;
}

.menu-open .menu-icon {
  background: transparent;
}

.menu-open .menu-icon::before {
  transform: rotate(45deg) translate(5px, 5px);
}

.menu-open .menu-icon::after {
  transform: rotate(-45deg) translate(5px, -5px);
}

.icon {
  display: inline-block;
  margin-right: 0.4rem;
}

@media (max-width: 768px) {
  header {
    padding: 0.6rem 0.75rem;
  }

  .logo-icon {
    font-size: 1rem;
  }

  .app-title {
    font-size: 1rem;
  }

  .title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }

  .app-subtitle {
    font-size: 0.75rem;
    padding-left: 0;
    border-left: none;
  }

  .control-btn {
    width: 28px;
    height: 28px;
    padding: 4px;
  }

  .footer {
    padding: 1rem 0.75rem;
  }

  .mobile-only {
    display: block;
  }

  .nav {
    position: fixed;
    top: 48px;
    left: 0;
    right: 0;
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    transition: height 0.2s ease;
    border-radius: 0;
    z-index: 300;
  }

  .nav.menu-open {
    height: calc(100vh - 48px);
    overflow-y: auto;
    padding: 0.75rem;
  }

  .nav-container {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-link {
    padding: 0.85rem 1rem;
    font-size: 0.9rem;
    text-align: left;
  }
}
</style>
