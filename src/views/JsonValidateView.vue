<template>
  <div class="container">
    <p class="tool-description">Validate JSON structure and format with detailed feedback</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="validate" @select="loadHistoryItem" />

    <div class="validate-container">
      <div>
        <h3>JSON Input</h3>
        <textarea v-model="jsonInput" class="textarea" placeholder="Enter your JSON here..."
          :class="{ 'error': !isValid && validationResult }"></textarea>
        <div class="sample-buttons">
          <button @click="formatJson" class="btn btn-sm btn-secondary">Format</button>
          <button @click="clearInput" class="btn btn-sm btn-secondary">Clear</button>
        </div>
      </div>

      <div class="action-buttons">
        <button @click="validateJson" class="btn btn-success" :disabled="isProcessing">
          <span class="icon">✓</span> {{ isProcessing ? 'Validating...' : 'Validate JSON' }}
        </button>
        <button @click="clearAll" class="btn btn-secondary">
          <span class="icon">⌫</span> Clear All
        </button>
      </div>

      <div v-if="validationResult" :class="isValid ? 'success' : 'error'" class="validation-result">
        <div v-if="isValid">
          <h3>✓ Valid JSON</h3>
          <p>Your JSON is syntactically valid.</p>
          <div class="json-stats">
            <div>Size: {{ formatBytes(stats.size) }}</div>
            <div>Objects: {{ stats.objects }}</div>
            <div>Arrays: {{ stats.arrays }}</div>
            <div>Values: {{ stats.values }}</div>
            <div>Depth: {{ stats.depth }}</div>
          </div>
        </div>
        <div v-else>
          <h3>⚠ Invalid JSON</h3>
          <pre class="error-message">{{ validationResult }}</pre>
        </div>
      </div>
    </div>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success">
      {{ successMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import jsonlint from 'jsonlint-mod'
import HistoryPanel from '../components/HistoryPanel.vue'
import { saveToHistory, saveToolState, getToolState, type HistoryItem } from '../utils/localStorage'

const jsonInput = ref('')
const validationResult = ref('')
const isValid = ref(false)
const showHistory = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const isProcessing = ref(false)
const stats = ref({
  objects: 0,
  arrays: 0,
  values: 0,
  depth: 0,
  size: 0
})

const jsonSize = computed(() => {
  const bytes = new TextEncoder().encode(jsonInput.value).length
  if (bytes < 1024) {
    return `${bytes} bytes`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
})

function calculateStats(obj: unknown, originalString: string) {
  let objects = 0
  let arrays = 0
  let values = 0
  let maxDepth = 0

  function traverse(item: unknown, depth: number): void {
    maxDepth = Math.max(maxDepth, depth)

    if (Array.isArray(item)) {
      arrays++
      item.forEach(subItem => traverse(subItem, depth + 1))
    } else if (item !== null && typeof item === 'object') {
      objects++
      Object.values(item as Record<string, unknown>).forEach(value =>
        traverse(value, depth + 1)
      )
    } else {
      values++
    }
  }

  traverse(obj, 1)

  return {
    objects,
    arrays,
    values,
    depth: maxDepth,
    size: originalString.length
  }
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} bytes`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function validateJson() {
  if (!jsonInput.value.trim()) {
    errorMessage.value = 'Please enter JSON to validate'
    return
  }

  isProcessing.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const parsed = jsonlint.parse(jsonInput.value)
    stats.value = calculateStats(parsed, jsonInput.value)

    validationResult.value = 'Valid JSON'
    isValid.value = true
    successMessage.value = 'JSON is valid!'

    // Save to history
    saveToHistory('validate', `Valid JSON (${formatBytes(stats.value.size)})`, {
      input: jsonInput.value,
      stats: stats.value
    })

  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Invalid JSON'
    validationResult.value = errorMsg
    isValid.value = false

    stats.value = {
      objects: 0,
      arrays: 0,
      values: 0,
      depth: 0,
      size: jsonInput.value.length
    }
  } finally {
    isProcessing.value = false
  }
}

function formatJson() {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    successMessage.value = 'JSON formatted successfully'
  } catch {
    errorMessage.value = 'Cannot format invalid JSON'
  }
}

function clearInput() {
  jsonInput.value = ''
  validationResult.value = ''
  isValid.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

function clearAll() {
  clearInput()
  showHistory.value = false
}

function loadHistoryItem(item: HistoryItem) {
  if (item.data && typeof item.data === 'object' && 'input' in item.data) {
    jsonInput.value = item.data.input as string
    successMessage.value = `Loaded: ${item.label}`
  }
}
</script>

<style scoped>
.validate-container {
  max-width: 800px;
  margin: 0 auto;
}

.options-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.validation-result {
  margin-top: 1.5rem;
  padding: 1.5rem;
  border-radius: 8px;
}

.validation-result.success {
  background: linear-gradient(135deg, rgba(74, 222, 128, 0.1), rgba(34, 197, 94, 0.1));
  border-left: 4px solid var(--success);
}

.validation-result.error {
  background: linear-gradient(135deg, rgba(248, 113, 113, 0.1), rgba(239, 68, 68, 0.1));
  border-left: 4px solid var(--danger);
}

.json-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  text-align: center;
}

.json-stats>div {
  font-size: 0.9rem;
  color: var(--success);
  font-weight: 500;
}

.error-message {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 6px;
  color: var(--danger);
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  white-space: pre-wrap;
  overflow-x: auto;
  margin-top: 1rem;
}

.sample-buttons {
  margin-top: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.action-buttons {
  margin: 1.5rem 0;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.textarea.error {
  border-color: var(--danger);
  box-shadow: 0 0 0 2px rgba(248, 113, 113, 0.3);
}
</style>