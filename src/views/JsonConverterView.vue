<template>
  <div class="container">
    <p class="tool-description">Convert between JSON strings and JavaScript objects</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="converter" @select="loadHistoryItem" />

    <div class="grid grid-2">
      <div>
        <h3>JSON String</h3>
        <textarea v-model="jsonString" class="textarea" placeholder="Enter JSON string here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="jsonToObject" class="btn">JSON → Object</button>
          <button @click="clearJson" class="btn btn-secondary">Clear JSON</button>
        </div>
      </div>

      <div>
        <h3>JavaScript Object</h3>
        <textarea v-model="jsObject" class="textarea" placeholder="Enter JavaScript object here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="objectToJson" class="btn">Object → JSON</button>
          <button @click="clearObject" class="btn btn-secondary">Clear Object</button>
        </div>
      </div>
    </div>

    <div style="margin: 1rem 0;">
      <button @click="validateJson" class="btn btn-success">Validate JSON</button>
      <button @click="copyJsonString" class="btn">Copy JSON</button>
      <button @click="copyJsObject" class="btn">Copy Object</button>
      <button @click="clearAll" class="btn btn-danger">Clear All</button>
    </div>

    <div v-if="errorMessage" class="error">
      {{ errorMessage }}
    </div>

    <div v-if="successMessage" class="success">
      {{ successMessage }}
    </div>

    <div v-if="validationResult" class="card">
      <h3>Validation Result</h3>
      <div v-if="validationResult.valid" class="success">
        ✅ Valid JSON
      </div>
      <div v-else class="error">
        ❌ Invalid JSON: {{ validationResult.error }}
      </div>

      <div v-if="validationResult.valid && validationResult.info" style="margin-top: 1rem; text-align: left;">
        <h4>JSON Information</h4>
        <p><strong>Type:</strong> {{ validationResult.info.type }}</p>
        <p><strong>Size:</strong> {{ validationResult.info.size }} characters</p>
        <p v-if="validationResult.info.keys"><strong>Keys:</strong> {{ validationResult.info.keys.join(', ') }}</p>
        <p v-if="validationResult.info.length !== undefined"><strong>Array Length:</strong> {{
          validationResult.info.length }}</p>
        <p><strong>Depth:</strong> {{ validationResult.info.depth }} levels</p>
      </div>
    </div>

    <div class="card" style="text-align: left;">
      <h3>Sample Data</h3>
      <p>Try these sample JSON objects:</p>
      <div style="margin: 1rem 0;">
        <button @click="loadSample('simple')" class="btn btn-secondary">Simple Object</button>
        <button @click="loadSample('nested')" class="btn btn-secondary">Nested Object</button>
        <button @click="loadSample('array')" class="btn btn-secondary">Array</button>
        <button @click="loadSample('complex')" class="btn btn-secondary">Complex Data</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import JSON5 from 'json5'
import HistoryPanel from '../components/HistoryPanel.vue'
import { saveToHistory, saveToolState, getToolState, HistoryItem } from '../utils/localStorage'

const jsonString = ref('')
const jsObject = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const validationResult = ref<any>(null)
const showHistory = ref(false)

const sampleData = {
  simple: {
    name: 'John Doe',
    age: 30,
    email: 'john@example.com'
  },
  nested: {
    user: {
      profile: {
        name: 'Jane Smith',
        age: 25,
        preferences: {
          theme: 'dark',
          notifications: true
        }
      },
      settings: {
        privacy: 'public',
        language: 'en'
      }
    }
  },
  array: [
    { id: 1, name: 'Apple', price: 1.99 },
    { id: 2, name: 'Banana', price: 0.99 },
    { id: 3, name: 'Orange', price: 2.49 }
  ],
  complex: {
    timestamp: '2024-01-01T12:00:00Z',
    data: {
      metrics: [
        { name: 'cpu', value: 85.5, unit: '%' },
        { name: 'memory', value: 4.2, unit: 'GB' }
      ],
      config: {
        enabled: true,
        options: ['option1', 'option2'],
        nested: {
          deep: {
            value: 42
          }
        }
      }
    }
  }
}

const jsonToObject = () => {
  errorMessage.value = ''
  successMessage.value = ''
  validationResult.value = null

  try {
    const parsed = JSON.parse(jsonString.value)
    jsObject.value = JSON.stringify(parsed, null, 2)
    successMessage.value = 'JSON converted to object successfully!'

    // Save to history
    saveCurrentToHistory('JSON to Object')
  } catch (error) {
    errorMessage.value = 'Invalid JSON format. Cannot convert to object.'
  }
}

const objectToJson = () => {
  errorMessage.value = ''
  successMessage.value = ''
  validationResult.value = null

  try {
    const parsed = JSON5.parse(jsObject.value)
    jsonString.value = JSON.stringify(parsed)
    successMessage.value = 'Object converted to JSON successfully!'

    // Save to history
    saveCurrentToHistory('Object to JSON')
  } catch (error) {
    errorMessage.value = 'Invalid object format. Cannot convert to JSON.'
  }
}

const validateJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (!jsonString.value.trim()) {
    errorMessage.value = 'Please enter JSON to validate'
    return
  }

  try {
    const parsed = JSON.parse(jsonString.value)
    const info = analyzeJson(parsed)

    validationResult.value = {
      valid: true,
      info
    }

    // Save to history
    saveCurrentToHistory('Validate')
  } catch (error) {
    validationResult.value = {
      valid: false,
      error: (error as Error).message
    }
  }
}

const analyzeJson = (obj: any) => {
  const getType = (value: any): string => {
    if (Array.isArray(value)) return 'array'
    if (value === null) return 'null'
    return typeof value
  }

  const getDepth = (obj: any, currentDepth = 1): number => {
    if (typeof obj !== 'object' || obj === null) return currentDepth

    let maxDepth = currentDepth
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const depth = getDepth(obj[key], currentDepth + 1)
        maxDepth = Math.max(maxDepth, depth)
      }
    }
    return maxDepth
  }

  const type = getType(obj)
  const size = jsonString.value.length
  const depth = getDepth(obj)

  const info: any = {
    type,
    size,
    depth
  }

  if (type === 'object') {
    info.keys = Object.keys(obj)
  } else if (type === 'array') {
    info.length = obj.length
  }

  return info
}

const loadSample = (sampleType: keyof typeof sampleData) => {
  const sample = sampleData[sampleType]
  jsonString.value = JSON.stringify(sample, null, 2)
  jsObject.value = JSON.stringify(sample, null, 2)
  errorMessage.value = ''
  successMessage.value = `${sampleType.charAt(0).toUpperCase() + sampleType.slice(1)} sample loaded!`
  validationResult.value = null
}

const copyJsonString = async () => {
  try {
    await navigator.clipboard.writeText(jsonString.value)
    successMessage.value = 'JSON copied to clipboard!'

    // Save to history when copying, if we have valid data
    if (jsonString.value && !errorMessage.value) {
      saveCurrentToHistory('Copy JSON')
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Failed to copy to clipboard'
  }
}

const copyJsObject = async () => {
  try {
    await navigator.clipboard.writeText(jsObject.value)
    successMessage.value = 'Object copied to clipboard!'

    // Save to history when copying, if we have valid data
    if (jsObject.value && !errorMessage.value) {
      saveCurrentToHistory('Copy Object')
    }

    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Failed to copy to clipboard'
  }
}

const clearJson = () => {
  jsonString.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  validationResult.value = null
}

const clearObject = () => {
  jsObject.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  validationResult.value = null
}

const clearAll = () => {
  jsonString.value = ''
  jsObject.value = ''
  errorMessage.value = ''
  successMessage.value = ''
  validationResult.value = null
}

// Save to history when a successful operation is completed
function saveCurrentToHistory(actionType: string) {
  if ((jsonString.value || jsObject.value) && !errorMessage.value) {
    const timestamp = new Date().toLocaleTimeString();
    const label = `${actionType} at ${timestamp}`;

    // Save to history, skipping duplicates
    saveToHistory('converter', label, {
      jsonString: jsonString.value,
      jsObject: jsObject.value,
      operation: actionType
    }, true); // true = skip duplicates
  }
}

// Load history item
function loadHistoryItem(item: HistoryItem) {
  const data = item.data;
  jsonString.value = data.jsonString || '';
  jsObject.value = data.jsObject || '';
  validationResult.value = null;

  // Hide history panel after loading
  showHistory.value = false;

  successMessage.value = 'History item loaded!';
  setTimeout(() => {
    successMessage.value = '';
  }, 2000);
}

// Save current state to localStorage when component unmounts
function saveState() {
  saveToolState('converter', {
    jsonString: jsonString.value,
    jsObject: jsObject.value
  });
}

// Load previous state if available
function loadPreviousState() {
  const state = getToolState('converter');
  if (state) {
    jsonString.value = state.jsonString || '';
    jsObject.value = state.jsObject || '';
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
