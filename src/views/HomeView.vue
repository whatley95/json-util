<template>
  <div class="container">
    <p class="tool-description">A comprehensive tool for working with JSON data</p>

    <div class="tools-grid">
      <div class="card tool-card">
        <div class="tool-icon">🔄</div>
        <h3>JSON Diff</h3>
        <p>Compare two JSON objects and see the differences highlighted</p>
        <router-link to="/diff" class="btn">Try JSON Diff</router-link>
      </div>

      <div class="card tool-card">
        <div class="tool-icon">🔒</div>
        <h3>Escape/Unescape</h3>
        <p>Escape special characters in JSON strings or unescape them</p>
        <router-link to="/escape" class="btn">Try Escape Tool</router-link>
      </div>

      <div class="card tool-card">
        <div class="tool-icon">✨</div>
        <h3>Beautify/Minify</h3>
        <p>Format JSON beautifully with indentation or minify to save space</p>
        <router-link to="/beautify" class="btn">Try Beautify Tool</router-link>
      </div>

      <div class="card tool-card">
        <div class="tool-icon">🔄</div>
        <h3>Object Converter</h3>
        <p>Convert between JSON strings and JavaScript objects</p>
        <router-link to="/converter" class="btn">Try Converter</router-link>
      </div>

      <div class="card tool-card">
        <div class="tool-icon">✓</div>
        <h3>JSON Validate</h3>
        <p>Validate JSON structure and syntax with detailed error messages</p>
        <router-link to="/validate" class="btn">Try Validator</router-link>
      </div>

      <div class="card tool-card">
        <div class="tool-icon">🔍</div>
        <h3>JSON Path Finder</h3>
        <p>Explore and extract data from complex JSON using JSONPath expressions</p>
        <router-link to="/path" class="btn">Try JSONPath</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// No additional setup needed for this component
</script>

<style scoped>
.tools-grid {
  display: grid;
  gap: 1.5rem;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  margin: 2rem 0;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.tool-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
  background: linear-gradient(90deg, var(--primary), var(--accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

h3 {
  margin: 1rem 0;
  font-size: 1.5rem;
}

.container>p {
  font-size: 1.2rem;
  color: var(--text-muted);
  max-width: 600px;
  margin: 0 auto 2rem;
}

.tool-card p {
  margin-bottom: 2rem;
  flex-grow: 1;
}

.tool-card .btn {
  width: 100%;
}
</style>
