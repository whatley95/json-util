<template>
  <div class="container">
    <p class="tool-description">Escape or unescape JSON strings</p>

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
import { ref } from 'vue'

const inputText = ref('')
const outputText = ref('')
const errorMessage = ref('')
const successMessage = ref('')

const escapeJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    outputText.value = JSON.stringify(inputText.value)
    successMessage.value = 'JSON escaped successfully!'
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
</script>
