<template>
  <div id="app" :class="{ 'is-fullscreen': isFullscreen }">
    <div class="fixed-nav-container" :class="{ 'nav-hidden': isFullscreen && !showNavInFullscreen }">
      <header>
        <div class="title-container">
          <h1 class="app-title">JSON Utilities</h1>
          <span v-if="currentSubtitle" class="app-subtitle">{{ currentSubtitle }}</span>
        </div>
        <div class="header-controls">
          <button @click="toggleMenu" class="menu-btn mobile-only">
            <span class="menu-icon"></span>
          </button>
          <button v-if="isFullscreen" @click="toggleNavInFullscreen" class="nav-toggle-btn"
            :title="showNavInFullscreen ? 'Hide navigation' : 'Show navigation'">
            <span class="nav-toggle-icon" :class="{ 'nav-hidden-icon': !showNavInFullscreen }"></span>
          </button>
          <button @click="toggleFullscreen" class="fullscreen-btn"
            :title="isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'">
            <span class="fullscreen-icon" :class="{ 'exit-fullscreen': isFullscreen }"></span>
          </button>
          <div class="theme-toggle">
            <button @click="toggleTheme" class="theme-btn">
              {{ isDarkTheme ? '☀️' : '🌙' }}
            </button>
          </div>
        </div>
      </header>

      <nav class="nav" :class="{ 'menu-open': isMenuOpen }">
        <div class="nav-container">
          <router-link to="/" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">🏠</span> Home
          </router-link>
          <router-link to="/diff" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">🔄</span> JSON Diff
          </router-link>
          <router-link to="/escape" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">🔒</span> Escape/Unescape
          </router-link>
          <router-link to="/beautify" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">✨</span> Beautify/Minify
          </router-link>
          <router-link to="/converter" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">🔄</span> Object Converter
          </router-link>
          <router-link to="/validate" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">✓</span> Validate
          </router-link>
          <router-link to="/path" class="nav-link" @click="isMenuOpen = false">
            <span class="icon">🔍</span> JSONPath
          </router-link>
        </div>
      </nav>

      <div class="nav-shadow" v-if="scrolled"></div>
    </div>

    <main class="main-content">
      <router-view />
    </main>

    <footer class="footer">
      <p>JSON Utilities - A comprehensive tool for JSON operations</p>
      <p class="copyright">© 2025 <a href="https://whatley.xyz/playground" target="_blank" rel="noopener"
          class="footer-link">Whatley</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';

// Theme handling
const isDarkTheme = ref(true);
// Menu state for mobile
const isMenuOpen = ref(false);
// Scroll state for shadow effect
const scrolled = ref(false);
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
  // Prevent body scrolling when menu is open on mobile
  document.body.style.overflow = isMenuOpen.value ? 'hidden' : '';
}

// Handle scroll events to add shadow and effects
function handleScroll() {
  scrolled.value = window.scrollY > 10;
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
  window.addEventListener('scroll', handleScroll);
  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('msfullscreenchange', handleFullscreenChange);

  // Initial check
  handleScroll();
});

onUnmounted(() => {
  // Clean up event listeners
  window.removeEventListener('scroll', handleScroll);
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
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  margin-bottom: 1rem;
  background: rgba(0, 0, 0, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 200;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  letter-spacing: 1px;
  position: relative;
  text-shadow: 0 2px 10px rgba(67, 97, 238, 0.2);
}

.app-title::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 40%;
  height: 3px;
  background: linear-gradient(90deg, var(--primary), transparent);
  border-radius: 3px;
}

.title-container {
  display: flex;
  align-items: baseline;
  gap: 15px;
}

.app-subtitle {
  font-size: 1.1rem;
  color: var(--accent);
  opacity: 0.9;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  padding-left: 20px;
  animation: fadeIn 0.5s ease-out;
}

.app-subtitle:before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  height: 16px;
  width: 2px;
  background: var(--accent);
  transform: translateY(-50%);
}

.theme-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-btn:hover {
  transform: rotate(30deg) scale(1.2);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.1);
}

.fullscreen-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.fullscreen-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.fullscreen-icon {
  position: relative;
  width: 16px;
  height: 16px;
  border: 2px solid currentColor;
  border-radius: 2px;
}

.fullscreen-icon::before {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-top: 2px solid currentColor;
  border-right: 2px solid currentColor;
  top: -4px;
  right: -4px;
}

.fullscreen-icon::after {
  content: '';
  position: absolute;
  width: 6px;
  height: 6px;
  border-bottom: 2px solid currentColor;
  border-left: 2px solid currentColor;
  bottom: -4px;
  left: -4px;
}

.exit-fullscreen {
  border-width: 0;
  height: 16px;
}

.exit-fullscreen::before {
  width: 8px;
  height: 8px;
  top: 0px;
  right: 0px;
}

.exit-fullscreen::after {
  width: 8px;
  height: 8px;
  bottom: 0px;
  left: 0px;
}

.main-content {
  flex: 1;
  padding: 0 1rem;
  animation: contentFadeIn 0.6s ease-out;
}

@keyframes contentFadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.footer {
  margin-top: 2rem;
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(4px);
}

.footer-link {
  color: var(--accent);
  text-decoration: none;
  transition: color 0.2s ease;
  font-weight: 500;
}

.footer-link:hover {
  color: var(--primary);
  text-decoration: underline;
}

.icon {
  display: inline-block;
  margin-right: 0.5rem;
}

.copyright {
  margin-top: 0.5rem;
  font-size: 0.8rem;
}

.fixed-nav-container {
  position: sticky;
  top: 0;
  z-index: 200;
  width: 100%;
}

.nav-shadow {
  position: absolute;
  bottom: -10px;
  left: 0;
  right: 0;
  height: 10px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), transparent);
  z-index: 1;
  pointer-events: none;
}

.nav {
  overflow-x: auto;
  padding: 0.75rem;
  white-space: nowrap;
  margin-bottom: 2rem;
  background: linear-gradient(to right, var(--surface), rgba(15, 52, 96, 0.9));
  border-radius: 0 0 12px 12px;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
}

.nav-container {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
}

.nav::-webkit-scrollbar {
  height: 4px;
}

.nav::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.nav::-webkit-scrollbar-thumb {
  background: var(--primary);
  border-radius: 4px;
}

.nav-link {
  position: relative;
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.05);
}

.nav-link.router-link-active {
  background: rgba(var(--primary-rgb), 0.15);
  box-shadow: 0 2px 8px rgba(var(--primary-rgb), 0.2);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -3px;
  left: 50%;
  width: 0;
  height: 3px;
  background: var(--accent);
  transition: all 0.3s ease;
  transform: translateX(-50%);
  border-radius: 3px;
  opacity: 0;
}

.nav-link:hover::after {
  width: 80%;
  opacity: 1;
}

.nav-link.active::after {
  width: 100%;
  opacity: 1;
}

.header-controls {
  display: flex;
  align-items: center;
}

.mobile-only {
  display: none;
}

.menu-btn {
  background: transparent;
  border: none;
  width: 32px;
  height: 32px;
  position: relative;
  margin-right: 1rem;
  cursor: pointer;
}

.menu-icon,
.menu-icon::before,
.menu-icon::after {
  position: absolute;
  width: 24px;
  height: 3px;
  background: var(--text);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.menu-icon {
  top: 14px;
  left: 4px;
}

.menu-icon::before {
  content: '';
  top: -8px;
  left: 0;
}

.menu-icon::after {
  content: '';
  top: 8px;
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

.nav-toggle-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
}

.nav-toggle-btn:hover {
  transform: scale(1.1);
  background: rgba(255, 255, 255, 0.1);
}

.nav-toggle-icon {
  position: relative;
  width: 18px;
  height: 12px;
}

.nav-toggle-icon:before,
.nav-toggle-icon:after {
  content: '';
  position: absolute;
  width: 18px;
  height: 2px;
  background: currentColor;
  left: 0;
}

.nav-toggle-icon:before {
  top: 0;
}

.nav-toggle-icon:after {
  bottom: 0;
}

.nav-toggle-icon::after {
  box-shadow: 0 -5px 0 currentColor;
}

.nav-hidden-icon:before,
.nav-hidden-icon:after {
  top: 5px;
}

.nav-hidden-icon:after {
  box-shadow: none;
}

/* Style for tool descriptions */
.tool-description {
  font-size: 1.2rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  max-width: 800px;
  line-height: 1.6;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

/* Hidden navigation styles */
.fixed-nav-container.nav-hidden .nav,
.fixed-nav-container.nav-hidden .nav-shadow {
  display: none;
}

.fixed-nav-container.nav-hidden+.main-content {
  padding-top: 1rem;
}

/* Adjust header for hidden navigation */
.nav-hidden header {
  margin-bottom: 0;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

/* Adjust fullscreen styles */
:fullscreen #app .fixed-nav-container.nav-hidden header,
:-webkit-full-screen #app .fixed-nav-container.nav-hidden header,
:-ms-fullscreen #app .fixed-nav-container.nav-hidden header {
  background: rgba(0, 0, 0, 0.3);
}

:fullscreen #app .fixed-nav-container.nav-hidden,
:-webkit-full-screen #app .fixed-nav-container.nav-hidden,
:-ms-fullscreen #app .fixed-nav-container.nav-hidden {
  margin-bottom: 0.5rem;
}

:fullscreen #app.is-fullscreen .fixed-nav-container.nav-hidden+.main-content,
:-webkit-full-screen #app.is-fullscreen .fixed-nav-container.nav-hidden+.main-content,
:-ms-fullscreen #app.is-fullscreen .fixed-nav-container.nav-hidden+.main-content {
  padding-top: 0.5rem;
}

#app.is-fullscreen .main-content {
  padding: 1rem 2rem;
  transition: padding 0.3s ease;
}

@media (max-width: 768px) {
  header {
    padding: 1rem;
  }

  .app-title {
    font-size: 1.5rem;
  }

  .title-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }

  .app-subtitle {
    font-size: 0.9rem;
    padding-left: 0;
  }

  .app-subtitle:before {
    display: none;
  }

  .mobile-only {
    display: block;
  }

  .nav {
    position: fixed;
    top: 64px;
    left: 0;
    right: 0;
    height: 0;
    overflow: hidden;
    margin: 0;
    padding: 0;
    transition: height 0.3s ease;
    border-radius: 0;
    z-index: 300;
  }

  .nav.menu-open {
    height: calc(100vh - 64px);
    overflow-y: auto;
    padding: 1rem;
  }

  .nav-container {
    flex-direction: column;
    align-items: stretch;
  }

  .nav-link {
    margin: 0.5rem 0;
    padding: 1rem;
    font-size: 1.1rem;
    text-align: left;
  }
}
</style>
