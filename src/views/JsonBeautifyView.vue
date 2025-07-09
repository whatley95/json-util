<template>
  <div class="container">
    <p class="tool-description">Format JSON beautifully or minify it</p>

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
import { ref } from 'vue'

const inputJson = ref('')
const outputJson = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const indentSize = ref('2')
const jsonStats = ref<any>(null)

const beautifyJson = () => {
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const parsed = JSON.parse(inputJson.value)
    const indent = indentSize.value === '\t' ? '\t' : parseInt(indentSize.value)
    outputJson.value = JSON.stringify(parsed, null, indent)

    calculateStats(parsed)
    successMessage.value = 'JSON beautified successfully!'
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
</script>
