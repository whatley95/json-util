<template>
  <div class="container">
    <p class="tool-description">Escape or unescape JSON strings</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="escape" @select="loadHistoryItem" />

    <div class="grid grid-2">
      <div>
        <h3>Input</h3>
        <textarea v-model="inputText" class="textarea" placeholder="Enter your text here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="escapeJson" class="btn">Escape JSON</button>
          <button @click="unescapeJson" class="btn btn-success">Unescape JSON</button>
          <button @click="clearInput" class="btn btn-secondary">Clear</button>
        </div>
      </div>

      <div>
        <h3>Output</h3>
        <textarea v-model="outputText" class="textarea" readonly placeholder="Result will appear here..."></textarea>

        <div style="margin: 1rem 0;">
          <button @click="copyOutput" class="btn">Copy Output</button>
          <button @click="swapInputOutput" class="btn btn-success">Swap Input/Output</button>
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

const inputText = ref('')
const outputText = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const showHistory = ref(false)

const escapeJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    outputText.value = JSON.stringify(inputText.value)
    successMessage.value = 'JSON escaped successfully!'

    // Save to history
    saveCurrentToHistory('Escape')
  } catch (error) {
    errorMessage.value = 'Error escaping JSON'
  }
}

const unescapeJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    outputText.value = JSON.parse(inputText.value)
    successMessage.value = 'JSON unescaped successfully!'

    // Save to history
    saveCurrentToHistory('Unescape')
  } catch (error) {
    errorMessage.value = 'Invalid JSON format. Cannot unescape.'
  }
}

const clearInput = () => {
  inputText.value = ''
  outputText.value = ''
  errorMessage.value = ''
  successMessage.value = ''
}

const copyOutput = async () => {
  try {
    await navigator.clipboard.writeText(outputText.value)
    successMessage.value = 'Output copied to clipboard!'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  } catch (error) {
    errorMessage.value = 'Failed to copy to clipboard'
  }
}

const swapInputOutput = () => {
  const temp = inputText.value
  inputText.value = outputText.value
  outputText.value = temp
  errorMessage.value = ''
  successMessage.value = 'Input and output swapped!'
  setTimeout(() => {
    successMessage.value = ''
  }, 2000)
}

// Save to history when a successful operation is completed
function saveCurrentToHistory(actionType: string) {
  if (inputText.value && outputText.value && !errorMessage.value) {
    const timestamp = new Date().toLocaleTimeString();
    const label = `${actionType} at ${timestamp}`;

    // Save to history, skipping duplicates
    saveToHistory('escape', label, {
      inputText: inputText.value,
      outputText: outputText.value,
      operation: actionType
    }, true); // true = skip duplicates
  }
}

// Load history item
function loadHistoryItem(item: HistoryItem) {
  const data = item.data;
  inputText.value = data.inputText;
  outputText.value = data.outputText;

  // Hide history panel after loading
  showHistory.value = false;

  successMessage.value = 'History item loaded!';
  setTimeout(() => {
    successMessage.value = '';
  }, 2000);
}

// Save current state to localStorage when component unmounts
function saveState() {
  saveToolState('escape', {
    inputText: inputText.value,
    outputText: outputText.value
  });
}

// Load previous state if available
function loadPreviousState() {
  const state = getToolState('escape');
  if (state) {
    inputText.value = state.inputText || '';
    outputText.value = state.outputText || '';
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
