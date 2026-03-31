<template>
  <div class="container">
    <div class="hero">
      <h1 class="hero-title">JSON Utilities</h1>
      <p class="hero-desc">Tools for working with JSON — diff, format, validate, query, and more.</p>
    </div>

    <div class="tools-grid">
      <router-link to="/diff" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--primary)"></div>
        <h3>Diff</h3>
        <p>Compare two JSON objects and visualize differences</p>
      </router-link>

      <router-link to="/escape" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--success)"></div>
        <h3>Escape / Unescape</h3>
        <p>Escape or unescape special characters in JSON strings</p>
      </router-link>

      <router-link to="/beautify" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--secondary)"></div>
        <h3>Beautify / Minify</h3>
        <p>Format JSON with indentation or minify to save space</p>
      </router-link>

      <router-link to="/converter" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--warning)"></div>
        <h3>Object Converter</h3>
        <p>Convert between JSON strings and JavaScript objects</p>
      </router-link>

      <router-link to="/validate" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--danger)"></div>
        <h3>Validate</h3>
        <p>Check JSON syntax and view structure statistics</p>
      </router-link>

      <router-link to="/path" class="tool-card card">
        <div class="tool-indicator" style="--tool-color: var(--primary)"></div>
        <h3>JSONPath</h3>
        <p>Query and extract data using JSONPath expressions</p>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for this component
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 2rem 0 0.5rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--text);
  letter-spacing: -0.02em;
}

.hero-desc {
  font-size: 1rem;
  color: var(--text-muted);
  margin: 0 auto 1.5rem;
  max-width: 480px;
}

.tools-grid {
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  margin: 1rem 0 2rem;
}

.tool-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem 1.5rem;
  text-decoration: none;
  color: inherit;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.tool-card:hover {
  border-color: rgba(var(--primary-rgb), 0.3);
}

.tool-indicator {
  width: 32px;
  height: 3px;
  border-radius: 2px;
  background: var(--tool-color, var(--primary));
  margin-bottom: 0.75rem;
  opacity: 0.8;
}

.tool-card h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
}

.tool-card p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--text-muted);
  line-height: 1.5;
}
</style>
