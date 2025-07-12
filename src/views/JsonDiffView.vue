<template>
  <div class="container">
    <p class="tool-description">Compare two JSON objects and see the differences</p>

    <div class="diff-options">
      <div>
        <label>View Mode:</label>
        <select v-model="viewMode" class="select-input">
          <option value="side-by-side">Side by Side</option>
          <option value="line-by-line">Line by Line</option>
        </select>
      </div>
      <div>
        <label>Format Output:</label>
        <select v-model="outputFormat" class="select-input">
          <option value="formatted">Formatted</option>
          <option value="compact">Compact</option>
        </select>
      </div>
      <div class="auto-compare-toggle" title="When enabled, comparison updates as you type">
        <label for="auto-compare">Auto Compare:</label>
        <div class="toggle-switch">
          <input type="checkbox" id="auto-compare" v-model="autoCompareEnabled">
          <span class="toggle-slider"></span>
        </div>
      </div>
    </div>

    <div class="grid grid-2">
      <div class="json-input-container">
        <h3>Original JSON</h3>
        <textarea v-model="originalJson" class="textarea json-input"
          placeholder="Enter your original JSON here..."></textarea>
        <div class="sample-buttons">
          <button @click="loadSimpleExample" class="btn btn-sm">Load Example</button>
          <button @click="formatJson('original')" class="btn btn-sm btn-secondary">Format</button>
        </div>
      </div>

      <div class="json-input-container">
        <h3>Modified JSON</h3>
        <textarea v-model="modifiedJson" class="textarea json-input"
          placeholder="Enter your modified JSON here..."></textarea>
        <div class="sample-buttons">
          <button @click="loadModifiedExample" class="btn btn-sm">Load Example</button>
          <button @click="formatJson('modified')" class="btn btn-sm btn-secondary">Format</button>
        </div>
      </div>
    </div>

    <div class="action-buttons">
      <button @click="compareJson" class="btn btn-lg" :class="{ 'btn-secondary': autoCompareEnabled }"
        title="Compare JSON (Ctrl+Enter)">
        <span class="icon">⟐</span> {{ autoCompareEnabled ? 'Refresh Diff' : 'Compare JSON' }}
      </button>
      <button @click="clearAll" class="btn btn-secondary" title="Clear All (Ctrl+Shift+C)">
        <span class="icon">✕</span> Clear All
      </button>
      <button @click="swapJsons" class="btn btn-sm" title="Swap original and modified JSON (Ctrl+Shift+S)">
        <span class="icon">⇄</span> Swap
      </button>
    </div>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="diffResult" class="card diff-result-container">
      <h3>Differences</h3>
      <div class="diff-view" ref="diffContainer"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue'
import * as Diff2Html from 'diff2html'
import 'diff2html/bundles/css/diff2html.min.css'

const originalJson = ref('')
const modifiedJson = ref('')
const diffResult = ref('')
const errorMessage = ref('')
const diffContainer = ref(null)
const viewMode = ref('side-by-side')
const outputFormat = ref('formatted')
const autoCompareEnabled = ref(true) // Enable auto-compare by default
const debounceTimer = ref(null as number | null)

// Watch for changes in view mode to rerender diff if needed
watch([viewMode, outputFormat], () => {
  if (diffResult.value) {
    renderDiff()
  }
})

// Helper function to debounce the comparison
const debouncedCompare = () => {
  // Clear any existing timer
  if (debounceTimer.value !== null) {
    clearTimeout(debounceTimer.value)
  }

  // Set a new timer
  debounceTimer.value = window.setTimeout(() => {
    if (autoCompareEnabled.value) {
      compareJson()
    }
  }, 800) // Wait 800ms after user stops typing
}

// Watch for changes in the JSON inputs
watch([originalJson, modifiedJson], () => {
  if (originalJson.value && modifiedJson.value) {
    debouncedCompare()
  }
})

const compareJson = () => {
  errorMessage.value = ''
  diffResult.value = ''

  // Skip comparison if either input is empty
  if (!originalJson.value.trim() || !modifiedJson.value.trim()) {
    return
  }

  try {
    // Parse both JSONs with error handling for each
    let original, modified;

    try {
      original = JSON.parse(originalJson.value)
    } catch (err) {
      errorMessage.value = 'Error in Original JSON: ' + (err instanceof Error ? err.message : 'Invalid format')
      return
    }

    try {
      modified = JSON.parse(modifiedJson.value)
    } catch (err) {
      errorMessage.value = 'Error in Modified JSON: ' + (err instanceof Error ? err.message : 'Invalid format')
      return
    }

    // Generate a unified diff
    const originalStr = outputFormat.value === 'formatted'
      ? JSON.stringify(original, null, 2)
      : JSON.stringify(original)
    const modifiedStr = outputFormat.value === 'formatted'
      ? JSON.stringify(modified, null, 2)
      : JSON.stringify(modified)

    // Create a unified diff string
    const diff = createUnifiedDiff(originalStr, modifiedStr)
    diffResult.value = diff

    // Render the diff using diff2html
    renderDiff()
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Invalid JSON format. Please check your input.'
  }
}

const createUnifiedDiff = (originalStr: string, modifiedStr: string): string => {
  const originalLines = originalStr.split('\n')
  const modifiedLines = modifiedStr.split('\n')

  let diffStr = '--- a/original.json\n'
  diffStr += '+++ b/modified.json\n'
  diffStr += '@@ -1,' + originalLines.length + ' +1,' + modifiedLines.length + ' @@\n'

  // Add all lines from original with - prefix
  originalLines.forEach(line => {
    diffStr += '-' + line + '\n'
  })

  // Add all lines from modified with + prefix
  modifiedLines.forEach(line => {
    diffStr += '+' + line + '\n'
  })

  return diffStr
}

const renderDiff = () => {
  if (!diffContainer.value) return

  const configuration = {
    drawFileList: false,
    matching: 'lines',
    outputFormat: viewMode.value,
    highlight: true,
    fileContentToggle: false,
  }

  const diffHtml = Diff2Html.html(diffResult.value, configuration)
  diffContainer.value.innerHTML = diffHtml
}

const formatJson = (source: 'original' | 'modified') => {
  try {
    if (source === 'original') {
      const parsed = JSON.parse(originalJson.value)
      originalJson.value = JSON.stringify(parsed, null, 2)
    } else {
      const parsed = JSON.parse(modifiedJson.value)
      modifiedJson.value = JSON.stringify(parsed, null, 2)
    }
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Invalid JSON format.'
  }
}

const loadSimpleExample = () => {
  originalJson.value = JSON.stringify({
    name: "John Doe",
    age: 30,
    isActive: true,
    address: {
      street: "123 Main St",
      city: "Anytown",
      zip: "12345"
    },
    hobbies: ["reading", "swimming", "coding"]
  }, null, 2)
}

const loadModifiedExample = () => {
  modifiedJson.value = JSON.stringify({
    name: "John Smith",
    age: 31,
    isActive: false,
    address: {
      street: "456 Oak Ave",
      city: "Anytown",
      zip: "12345",
      country: "USA"
    },
    hobbies: ["reading", "hiking", "coding"],
    email: "john@example.com"
  }, null, 2)
}

const swapJsons = () => {
  const temp = originalJson.value
  originalJson.value = modifiedJson.value
  modifiedJson.value = temp
}

const clearAll = () => {
  originalJson.value = ''
  modifiedJson.value = ''
  diffResult.value = ''
  errorMessage.value = ''
  if (diffContainer.value) {
    diffContainer.value.innerHTML = ''
  }
}

// Keyboard shortcuts
const handleKeyboardShortcut = (event: KeyboardEvent) => {
  // Ctrl+Enter or Cmd+Enter to compare
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
    compareJson()
    event.preventDefault()
  }

  // Ctrl+Shift+C or Cmd+Shift+C to clear all
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'C') {
    clearAll()
    event.preventDefault()
  }

  // Ctrl+Shift+S or Cmd+Shift+S to swap JSONs
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'S') {
    swapJsons()
    event.preventDefault()
  }
}

// Register and unregister keyboard shortcuts
onMounted(() => {
  document.addEventListener('keydown', handleKeyboardShortcut)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyboardShortcut)
})
</script>

<style scoped>
.diff-options {
  display: flex;
  gap: 1.25rem;
  /* Increased from 1rem */
  margin-bottom: 2rem;
  /* Increased from 1.5rem */
  justify-content: center;
  flex-wrap: wrap;
  align-items: center;
  padding: 1rem 1.25rem;
  /* Increased from 0.75rem */
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.select-input {
  padding: 0.6rem 0.8rem;
  /* Increased padding for larger height */
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: var(--surface);
  color: var(--text);
  margin-left: 0.5rem;
  height: 40px;
  /* Set specific height for consistency */
  min-width: 140px;
  /* Ensure dropdowns have enough width */
}

.auto-compare-toggle {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  background-color: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.auto-compare-toggle:hover {
  background-color: rgba(255, 255, 255, 0.12);
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 56px;
  /* Increased from 46px */
  height: 30px;
  /* Increased from 24px */
  margin-left: 0.5rem;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.15);
  transition: .4s;
  border-radius: 24px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 4px;
}

.toggle-slider::after {
  content: "Off";
  color: rgba(255, 255, 255, 0.5);
  font-size: 11px;
  /* Slightly increased font size */
  margin-left: 24px;
  /* Adjusted for new size */
  margin-top: 2px;
}

input:checked+.toggle-slider::after {
  content: "On";
  color: rgba(255, 255, 255, 0.8);
  margin-right: 24px;
  /* Adjusted for new size */
}

.toggle-slider:before {
  position: absolute;
  content: "●";
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(0, 0, 0, 0.4);
  font-size: 18px;
  /* Increased from 16px */
  height: 24px;
  /* Increased from 18px */
  width: 24px;
  /* Increased from 18px */
  left: 4px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

input:checked+.toggle-slider {
  background-color: var(--primary);
}

input:checked+.toggle-slider:before {
  transform: translateX(26px);
  /* Increased from 22px to match new toggle size */
  color: var(--primary);
  background-color: white;
}

.json-input-container {
  display: flex;
  flex-direction: column;
}

.json-input {
  flex: 1;
  min-height: 450px;
  /* Increased from 350px */
  resize: vertical;
  font-family: monospace;
  line-height: 1.4;
  padding: 12px;
  /* Added more padding for better readability */
}

@media (max-height: 800px) {
  .json-input {
    min-height: 350px;
    /* Increased from 250px */
  }
}

@media (min-height: 1000px) {
  .json-input {
    min-height: 550px;
    /* Increased from 450px */
  }
}

.sample-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
  justify-content: flex-end;
}

.action-buttons {
  margin: 2rem 0;
  /* Increased from 1.5rem */
  display: flex;
  gap: 1.25rem;
  /* Increased from 1rem */
  justify-content: center;
  flex-wrap: wrap;
}

/* Make buttons slightly larger */
.action-buttons .btn {
  padding: 0.6rem 1.2rem;
  /* More generous padding */
  font-size: 1.05rem;
  /* Slightly larger font */
}

.action-buttons .btn-lg {
  padding: 0.8rem 1.5rem;
  /* Larger padding for the main button */
}

.icon {
  display: inline-block;
  margin-right: 0.4rem;
  font-weight: bold;
  font-size: 1.1em;
  vertical-align: middle;
  position: relative;
  top: -0.05em;
  transition: transform 0.2s ease;
}

button:active .icon {
  transform: scale(0.9);
}

button:hover .icon {
  transform: scale(1.1);
}

.diff-result-container {
  margin-top: 2rem;
  /* Increased from 1.5rem */
  text-align: left;
  min-height: 300px;
  /* Added min-height */
  padding: 1.25rem;
  /* Added padding */
}

:deep(.d2h-file-header) {
  background-color: var(--surface);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

:deep(.d2h-file-list-header) {
  background-color: var(--primary);
}

:deep(.d2h-code-line) {
  color: var(--text);
}

:deep(.d2h-code-line-ctn) {
  background-color: var(--card-bg);
}

:deep(.d2h-ins) {
  background-color: rgba(66, 184, 131, 0.2);
}

:deep(.d2h-del) {
  background-color: rgba(245, 101, 101, 0.2);
}

:deep(.d2h-code-linenumber) {
  background-color: var(--surface);
  color: var(--text-muted);
}
</style>
