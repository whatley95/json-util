<template>
  <div class="container">
    <p class="tool-description">Format JSON beautifully or minify it</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="beautify" @select="loadHistoryItem" />

    <div class="grid grid-2">
      <div>
        <h3>Input JSON</h3>
        <textarea v-model="inputJson" class="textarea" placeholder="Enter your JSON here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="beautifyJson" class="btn">Beautify JSON</button>
          <button @click="minifyJson" class="btn btn-success">Minify JSON</button>
          <button @click="clearAll" class="btn btn-secondary">Clear</button>
        </div>

        <div style="margin: 1rem 0;">
          <label>
            Indent Size:
            <select v-model="indentSize" style="margin-left: 0.5rem; padding: 0.2rem;">
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
              <option value="\t">Tab</option>
            </select>
          </label>
        </div>
      </div>

      <div>
        <h3>Output</h3>
        <textarea v-model="outputJson" class="textarea" readonly
          placeholder="Formatted JSON will appear here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="copyOutput" class="btn">Copy Output</button>
          <button @click="swapInputOutput" class="btn btn-success">Swap Input/Output</button>
        </div>

        <div v-if="jsonStats" class="card" style="text-align: left; margin-top: 1rem;">
          <h4>JSON Statistics</h4>
          <p><strong>Original Size:</strong> {{ jsonStats.originalSize }} characters</p>
          <p><strong>Formatted Size:</strong> {{ jsonStats.formattedSize }} characters</p>
          <p><strong>Compression:</strong> {{ jsonStats.compression }}%</p>
          <p><strong>Objects:</strong> {{ jsonStats.objects }}</p>
          <p><strong>Arrays:</strong> {{ jsonStats.arrays }}</p>
          <p><strong>Properties:</strong> {{ jsonStats.properties }}</p>
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
import { ref, onMounted, onUnmounted } from 'vue'
import HistoryPanel from '../components/HistoryPanel.vue'
import { saveToHistory, saveToolState, getToolState, HistoryItem } from '../utils/localStorage'

const inputJson = ref('')
const outputJson = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const indentSize = ref('2')
const jsonStats = ref<any>(null)
const showHistory = ref(false) // Toggle history panel visibility

const beautifyJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const parsed = JSON.parse(inputJson.value)
    const indent = indentSize.value === '\t' ? '\t' : parseInt(indentSize.value)
    outputJson.value = JSON.stringify(parsed, null, indent)

    calculateStats(parsed)
    successMessage.value = 'JSON beautified successfully!'

    // Save to history
    saveCurrentToHistory('Beautify')
  } catch (error) {
    errorMessage.value = 'Invalid JSON format. Please check your input.'
  }
}

const minifyJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const parsed = JSON.parse(inputJson.value)
    outputJson.value = JSON.stringify(parsed)

    calculateStats(parsed)
    successMessage.value = 'JSON minified successfully!'

    // Save to history
    saveCurrentToHistory('Minify')
  } catch (error) {
    errorMessage.value = 'Invalid JSON format. Please check your input.'
  }
}

const calculateStats = (parsed: any) => {
  const originalSize = inputJson.value.length
  const formattedSize = outputJson.value.length
  const compression = originalSize > 0 ? Math.round(((originalSize - formattedSize) / originalSize) * 100) : 0

  let objects = 0
  let arrays = 0
  let properties = 0

  const countElements = (obj: any) => {
    if (Array.isArray(obj)) {
      arrays++
      obj.forEach(countElements)
    } else if (typeof obj === 'object' && obj !== null) {
      objects++
      Object.keys(obj).forEach(key => {
        properties++
        countElements(obj[key])
      })
    }
  }

  countElements(parsed)

  jsonStats.value = {
    originalSize,
    formattedSize,
    compression,
    objects,
    arrays,
    properties
  }
}

const clearAll = () => {
  inputJson.value = ''
  outputJson.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  jsonStats.value = null
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputJson.value)
    successMessage.value = 'Output copied to clipboard!'

    // Save to history when copying, as it might be valuable to the user
    if (inputJson.value && outputJson.value) {
      saveCurrentToHistory('Copy')
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Failed to copy to clipboard'
  }
}

const swapInputOutput = () => {
  const temp = inputJson.value
  inputJson.value = outputJson.value
  outputJson.value = temp
  errorMessage.value = ''
  successMessage.value = 'Input and output swapped!'
  setTimeout(() => {
    successMessage.value = ''
  }, 2000)
}

// Save to history when a successful beautify or minify operation is completed
function saveCurrentToHistory(actionType: string) {
  if (inputJson.value && outputJson.value && !errorMessage.value) {
    const timestamp = new Date().toLocaleTimeString();
    const label = `${actionType} at ${timestamp}`;

    // Save to history, skipping duplicates
    saveToHistory('beautify', label, {
      inputJson: inputJson.value,
      outputJson: outputJson.value,
      indentSize: indentSize.value,
      stats: jsonStats.value
    }, true); // true = skip duplicates
  }
}

// Load history item
function loadHistoryItem(item: HistoryItem) {
  const data = item.data;
  inputJson.value = data.inputJson;
  outputJson.value = data.outputJson;
  indentSize.value = data.indentSize;
  jsonStats.value = data.stats;

  // Hide history panel after loading
  showHistory.value = false;
}

// Save current state to localStorage when component unmounts
function saveState() {
  saveToolState('beautify', {
    inputJson: inputJson.value,
    outputJson: outputJson.value,
    indentSize: indentSize.value
  });
}

// Load previous state if available
function loadPreviousState() {
  const state = getToolState('beautify');
  if (state) {
    inputJson.value = state.inputJson || '';
    outputJson.value = state.outputJson || '';
    indentSize.value = state.indentSize || '2';

    // Recalculate stats if both input and output exist
    if (inputJson.value && outputJson.value) {
      try {
        const parsed = JSON.parse(inputJson.value);
        calculateStats(parsed);
      } catch (error) {
        // Ignore errors when loading previous state
      }
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
