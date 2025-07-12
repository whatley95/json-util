<template>
  <div class="container">
    <p class="tool-description">Validate JSON structure and format</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="validate" @select="loadHistoryItem" />

    <div class="validate-container">
      <div>
        <h3>JSON Input</h3>
        <textarea v-model="jsonInput" class="textarea" placeholder="Enter your JSON here..."></textarea>
      </div>

      <div class="action-buttons">
        <button @click="validateJson" class="btn btn-success">
          <span class="icon">✓</span> Validate JSON
        </button>
        <button @click="clearAll" class="btn btn-secondary">
          <span class="icon">⌫</span> Clear
        </button>
        <button @click="formatJson" class="btn">
          <span class="icon">✨</span> Format
        </button>
      </div>

      <div v-if="validationResult" :class="isValid ? 'success' : 'error'" class="validation-result">
        <div v-if="isValid">
          <h3>✓ Valid JSON</h3>
          <p>Your JSON is syntactically valid.</p>
          <div class="json-stats">
            <div>Size: {{ jsonSize }}</div>
            <div>Objects: {{ stats.objects }}</div>
            <div>Arrays: {{ stats.arrays }}</div>
            <div>Values: {{ stats.values }}</div>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import jsonlint from 'jsonlint-mod'
import HistoryPanel from '../components/HistoryPanel.vue'
import { saveToHistory, saveToolState, getToolState, HistoryItem } from '../utils/localStorage'

const jsonInput = ref('')
const validationResult = ref('')
const isValid = ref(false)
const showHistory = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const stats = ref({
  objects: 0,
  arrays: 0,
  values: 0
})

const jsonSize = computed(() => {
  const bytes = new TextEncoder().encode(jsonInput.value).length
  if (bytes < 1024) {
    return `${bytes} bytes`
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }
})

const validateJson = () => {
  validationResult.value = ''
  isValid.value = false

  if (!jsonInput.value.trim()) {
    validationResult.value = 'Please enter JSON to validate'
    return
  }

  try {
    // Use jsonlint for more detailed validation
    jsonlint.parse(jsonInput.value)
    isValid.value = true
    validationResult.value = 'JSON is valid'
    calculateStats()

    // Save to history
    saveCurrentToHistory('Validate')

    // Show success message
    successMessage.value = 'JSON validated successfully!';
    setTimeout(() => {
      successMessage.value = '';
    }, 2000);
  } catch (error) {
    isValid.value = false
    validationResult.value = error instanceof Error ? error.message : 'Invalid JSON'
    errorMessage.value = 'Validation failed';
    setTimeout(() => {
      errorMessage.value = '';
    }, 2000);
  }
}

const formatJson = () => {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)

    // Validate after formatting
    validateJson()
  } catch (error) {
    validationResult.value = error instanceof Error ? error.message : 'Invalid JSON'
    isValid.value = false
  }
}

const calculateStats = () => {
  const countItems = (obj: any) => {
    if (typeof obj !== 'object' || obj === null) {
      stats.value.values++
      return
    }

    if (Array.isArray(obj)) {
      stats.value.arrays++
      obj.forEach(item => countItems(item))
    } else {
      stats.value.objects++
      Object.values(obj).forEach(val => countItems(val))
    }
  }

  stats.value = {
    objects: 0,
    arrays: 0,
    values: 0
  }

  try {
    const parsed = JSON.parse(jsonInput.value)
    countItems(parsed)
  } catch (error) {
    console.error('Error calculating stats', error)
  }
}

const clearAll = () => {
  jsonInput.value = ''
  validationResult.value = ''
  isValid.value = false
  stats.value = {
    objects: 0,
    arrays: 0,
    values: 0
  }
}

// Save to history when validation is successful
function saveCurrentToHistory(actionType: string) {
  if (jsonInput.value && isValid.value) {
    const timestamp = new Date().toLocaleTimeString();
    const label = `${actionType} at ${timestamp}`;

    // Save to history, skipping duplicates
    saveToHistory('validate', label, {
      jsonInput: jsonInput.value,
      isValid: isValid.value,
      stats: stats.value
    }, true); // true = skip duplicates
  }
}

// Load history item
function loadHistoryItem(item: HistoryItem) {
  const data = item.data;
  jsonInput.value = data.jsonInput;
  if (data.isValid) {
    isValid.value = true;
    validationResult.value = 'JSON is valid';
    stats.value = data.stats;
  }

  // Hide history panel after loading
  showHistory.value = false;
}

// Save current state to localStorage when component unmounts
function saveState() {
  saveToolState('validate', {
    jsonInput: jsonInput.value
  });
}

// Load previous state if available
function loadPreviousState() {
  const state = getToolState('validate');
  if (state) {
    jsonInput.value = state.jsonInput || '';

    // Validate the loaded JSON if it exists
    if (jsonInput.value) {
      validateJson();
    }
  }
}

// Register and unregister lifecycle hooks
onMounted(() => {
  loadPreviousState();
});

onUnmounted(() => {
  saveState();
});
</script>

<style scoped>
.validate-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.validation-result {
  padding: 1.5rem;
  border-radius: 8px;
  text-align: left;
  margin-top: 1rem;
}

.error-message {
  white-space: pre-wrap;
  font-family: 'Fira Code', monospace;
  font-size: 0.9rem;
  overflow-x: auto;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}

.json-stats {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 4px;
  justify-content: space-around;
  flex-wrap: wrap;
}

.json-stats div {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
