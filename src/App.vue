<template>
  <div id="app">
    <header>
      <h1 class="app-title">JSON Utilities</h1>
      <div class="theme-toggle">
        <button @click="toggleTheme" class="theme-btn">
          {{ isDarkTheme ? '☀️' : '🌙' }}
        </button>
      </div>
    </header>
    
    <nav class="nav">
      <router-link to="/" class="nav-link">
        <span class="icon">🏠</span> Home
      </router-link>
      <router-link to="/diff" class="nav-link">
        <span class="icon">🔄</span> JSON Diff
      </router-link>
      <router-link to="/escape" class="nav-link">
        <span class="icon">🔒</span> Escape/Unescape
      </router-link>
      <router-link to="/beautify" class="nav-link">
        <span class="icon">✨</span> Beautify/Minify
      </router-link>
      <router-link to="/converter" class="nav-link">
        <span class="icon">🔄</span> Object Converter
      </router-link>
      <router-link to="/validate" class="nav-link">
        <span class="icon">✓</span> Validate
      </router-link>
      <router-link to="/path" class="nav-link">
        <span class="icon">🔍</span> JSONPath
      </router-link>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
    
    <footer class="footer">
      <p>JSON Utilities - A comprehensive tool for JSON operations</p>
      <p class="copyright">© 2025 <a href="https://whatley.xyz/" target="_blank" rel="noopener" class="footer-link">Whatley</a></p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Theme handling
const isDarkTheme = ref(true);

function toggleTheme() {
  isDarkTheme.value = !isDarkTheme.value;
  document.documentElement.classList.toggle('light-theme');
  
  // Save theme preference
  localStorage.setItem('theme', isDarkTheme.value ? 'dark' : 'light');
}

onMounted(() => {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    isDarkTheme.value = false;
    document.documentElement.classList.add('light-theme');
  }
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
  -webkit-text-fill-color: transparent;
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

.nav {
  overflow-x: auto;
  padding: 0.75rem;
  white-space: nowrap;
  margin-bottom: 2rem;
  background: linear-gradient(to right, var(--surface), rgba(15, 52, 96, 0.9));
  border-radius: 12px;
  transition: all 0.3s ease;
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

@media (max-width: 768px) {
  header {
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .nav {
    padding: 0.5rem;
    margin-bottom: 1.5rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.8rem;
    font-size: 0.9rem;
  }
}
</style>
