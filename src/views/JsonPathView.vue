<template>
  <div class="container">
    <p class="tool-description">Explore and extract data from complex JSON structures using JSONPath expressions</p>

    <div class="options-bar">
      <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
        <span class="icon">⏱</span> History
      </button>
    </div>

    <HistoryPanel v-if="showHistory" toolName="path" @select="loadHistoryItem" />

    <div class="json-path-container">
      <div class="json-input-section">
        <h3>JSON Input</h3>
        <textarea v-model="jsonInput" class="textarea" placeholder="Paste your JSON data here..."></textarea>
        <div class="action-buttons small-buttons">
          <button @click="loadSampleData" class="btn btn-sm">Load Example</button>
          <button @click="formatJson" class="btn btn-sm btn-secondary">Format JSON</button>
        </div>
      </div>

      <div class="query-section">
        <h3>JSONPath Query</h3>
        <div class="path-input-container">
          <input v-model="jsonPath" class="path-input"
            placeholder="Enter JSONPath expression (e.g. $.store.book[*].author)" @keyup.enter="evaluatePath" />
          <button @click="evaluatePath" class="btn btn-success">Evaluate</button>
        </div>

        <div class="common-paths">
          <h4>Common Paths:</h4>
          <div class="path-examples">
            <button @click="setPath('$')" class="path-btn">$</button>
            <button @click="setPath('$.store.book[0]')" class="path-btn">$.store.book[0]</button>
            <button @click="setPath('$.store.book[*].author')" class="path-btn">$.store.book[*].author</button>
            <button @click="setPath('$..author')" class="path-btn">$..author</button>
            <button @click="setPath('$.store.book[?(@.price < 10)]')" class="path-btn">$.store.book[?(@.price <
                10)]</button>
                <button @click="setPath('$..book[(@.length-1)]')" class="path-btn">$..book[(@.length-1)]</button>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="error">
        {{ errorMessage }}
      </div>

      <div class="result-section" v-if="pathResult">
        <h3>Results</h3>
        <div class="result-info">
          <span>{{ resultCount }} matches found</span>
          <button @click="copyResultToClipboard" class="btn btn-sm btn-secondary">Copy to Clipboard</button>
        </div>
        <div class="result-display">
          <pre>{{ formattedResult }}</pre>
        </div>
      </div>
    </div>

    <div class="help-section card">
      <h3>JSONPath Syntax Guide</h3>
      <table class="syntax-table">
        <thead>
          <tr>
            <th>Syntax</th>
            <th>Description</th>
            <th>Example</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>$</td>
            <td>The root object/element</td>
            <td>$</td>
          </tr>
          <tr>
            <td>@</td>
            <td>The current object/element</td>
            <td>@.name</td>
          </tr>
          <tr>
            <td>.</td>
            <td>Child operator</td>
            <td>$.store.book</td>
          </tr>
          <tr>
            <td>..</td>
            <td>Recursive descent (searches all paths)</td>
            <td>$..book</td>
          </tr>
          <tr>
            <td>*</td>
            <td>Wildcard (all objects/elements)</td>
            <td>$.store.*</td>
          </tr>
          <tr>
            <td>[n]</td>
            <td>Array index</td>
            <td>$.store.book[0]</td>
          </tr>
          <tr>
            <td>[start:end:step]</td>
            <td>Array slice</td>
            <td>$.store.book[0:2]</td>
          </tr>
          <tr>
            <td>[?(expression)]</td>
            <td>Filter expression</td>
            <td>$.store.book[?(@.price < 10)]</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HistoryPanel from '../components/HistoryPanel.vue'
import { saveToHistory, saveToolState, getToolState, HistoryItem } from '../utils/localStorage'

const jsonInput = ref('')
const jsonPath = ref('')
const pathResult = ref<any>(null)
const errorMessage = ref('')
const showHistory = ref(false)

// Use a simple JSONPath implementation with basic support for common operations
function evaluatePath() {
  errorMessage.value = ''
  pathResult.value = null

  if (!jsonInput.value.trim()) {
    errorMessage.value = 'Please enter JSON data'
    return
  }

  if (!jsonPath.value.trim()) {
    errorMessage.value = 'Please enter a JSONPath expression'
    return
  }

  try {
    const jsonData = JSON.parse(jsonInput.value)
    const result = jsonPathQuery(jsonData, jsonPath.value)
    pathResult.value = result

    // Save to history when we have results
    if (pathResult.value) {
      saveCurrentToHistory('Query');
    }
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : 'Error evaluating JSONPath'
  }
}

// Very simplified JSONPath implementation for common cases
function jsonPathQuery(obj: any, path: string): any[] {
  try {
    // Implementation of a simple JSONPath query function
    // This is a simplified version that works for basic paths

    // Handle the root element
    if (path === '$') {
      return [obj]
    }

    // Handle basic property access ($.property)
    if (path.startsWith('$.') && !path.includes('[') && !path.includes('..')) {
      const props = path.substring(2).split('.')
      let current = obj

      for (const prop of props) {
        if (current === undefined || current === null) {
          return []
        }
        current = current[prop]
      }

      return current === undefined ? [] : [current]
    }

    // Handle array index access ($.array[0])
    if (path.includes('[') && path.includes(']')) {
      const pathParts = path.substring(2).split('[')
      let current = obj

      // Get to the array
      if (pathParts[0]) {
        const props = pathParts[0].split('.')
        for (const prop of props) {
          if (prop === '') continue
          if (current === undefined || current === null) {
            return []
          }
          current = current[prop]
        }
      }

      // Extract the index from "[index]"
      const indexStr = pathParts[1].substring(0, pathParts[1].length - 1)
      const index = parseInt(indexStr)

      if (Array.isArray(current) && !isNaN(index)) {
        return current[index] === undefined ? [] : [current[index]]
      }

      return []
    }

    // Handle wildcard for array elements ($.array[*].property)
    if (path.includes('[*]')) {
      const parts = path.split('[*]')
      const beforeWildcard = parts[0].substring(2)
      const afterWildcard = parts[1] ? parts[1].substring(1) : ''

      let current = obj
      if (beforeWildcard) {
        const props = beforeWildcard.split('.')
        for (const prop of props) {
          if (prop === '') continue
          if (current === undefined || current === null) {
            return []
          }
          current = current[prop]
        }
      }

      if (!Array.isArray(current)) {
        return []
      }

      if (!afterWildcard) {
        return current
      }

      // Process each item in the array with the remaining path
      const results: any[] = []
      for (const item of current) {
        let value = item
        const props = afterWildcard.split('.')
        for (const prop of props) {
          if (prop === '') continue
          if (value === undefined || value === null) {
            break
          }
          value = value[prop]
        }
        if (value !== undefined) {
          results.push(value)
        }
      }

      return results
    }

    // For more complex paths, show error - we'd need a full JSONPath library
    // for proper implementation of recursive descent, filters, etc.
    throw new Error('Complex JSONPath expressions require a full JSONPath library. Try simpler paths or check the examples.')

  } catch (error) {
    console.error('JSONPath evaluation error', error)
    throw new Error('Error evaluating JSONPath: ' + (error instanceof Error ? error.message : String(error)))
  }
}

const resultCount = computed(() => {
  if (!pathResult.value) return 0
  return Array.isArray(pathResult.value) ? pathResult.value.length : 1
})

const formattedResult = computed(() => {
  if (!pathResult.value) return ''
  return JSON.stringify(pathResult.value, null, 2)
})

function formatJson() {
  try {
    const parsed = JSON.parse(jsonInput.value)
    jsonInput.value = JSON.stringify(parsed, null, 2)
    errorMessage.value = ''
  } catch (error) {
    errorMessage.value = 'Invalid JSON format'
  }
}

function copyResultToClipboard() {
  if (!pathResult.value) return

  try {
    navigator.clipboard.writeText(formattedResult.value)
  } catch (error) {
    console.error('Failed to copy to clipboard', error)
  }
}

function setPath(path: string) {
  jsonPath.value = path
}

function loadSampleData() {
  jsonInput.value = JSON.stringify({
    "store": {
      "book": [
        {
          "category": "reference",
          "author": "Nigel Rees",
          "title": "Sayings of the Century",
          "price": 8.95
        },
        {
          "category": "fiction",
          "author": "Evelyn Waugh",
          "title": "Sword of Honour",
          "price": 12.99
        },
        {
          "category": "fiction",
          "author": "Herman Melville",
          "title": "Moby Dick",
          "isbn": "0-553-21311-3",
          "price": 8.99
        },
        {
          "category": "fiction",
          "author": "J. R. R. Tolkien",
          "title": "The Lord of the Rings",
          "isbn": "0-395-19395-8",
          "price": 22.99
        }
      ],
      "bicycle": {
        "color": "red",
        "price": 19.95
      }
    }
  }, null, 2)
}

// Save to history when a successful path query is made
function saveCurrentToHistory(actionType: string) {
  if (jsonInput.value && jsonPath.value && pathResult.value) {
    const timestamp = new Date().toLocaleTimeString();
    const label = `${actionType} at ${timestamp}`;

    // Save to history, skipping duplicates
    saveToHistory('path', label, {
      jsonInput: jsonInput.value,
      jsonPath: jsonPath.value,
      pathResult: pathResult.value
    }, true); // true = skip duplicates
  }
}

// Load history item
function loadHistoryItem(item: HistoryItem) {
  const data = item.data;
  jsonInput.value = data.jsonInput;
  jsonPath.value = data.jsonPath;
  pathResult.value = data.pathResult;

  // Hide history panel after loading
  showHistory.value = false;
}

// Save current state to localStorage when component unmounts
function saveState() {
  saveToolState('path', {
    jsonInput: jsonInput.value,
    jsonPath: jsonPath.value
  });
}

// Load previous state if available
function loadPreviousState() {
  const state = getToolState('path');
  if (state) {
    jsonInput.value = state.jsonInput || '';
    jsonPath.value = state.jsonPath || '';

    // Re-evaluate the path if both input and path exist
    if (jsonInput.value && jsonPath.value) {
      evaluatePath();
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
.json-path-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.json-input-section {
  display: flex;
  flex-direction: column;
}

.query-section {
  margin-top: 1rem;
}

.path-input-container {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.path-input {
  flex: 1;
  padding: 0.7rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  color: var(--text);
  font-family: 'Fira Code', monospace;
}

.path-input:focus {
  outline: none;
  border-color: var(--primary);
}

.common-paths {
  background: rgba(0, 0, 0, 0.1);
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.path-examples {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.path-btn {
  background: var(--surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text);
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-family: 'Fira Code', monospace;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.path-btn:hover {
  background: var(--primary);
  border-color: var(--primary);
}

.result-section {
  background: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  margin-top: 1rem;
}

.result-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  align-items: center;
}

.result-display {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  overflow-x: auto;
  max-height: 300px;
  overflow-y: auto;
}

.result-display pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: 'Fira Code', monospace;
  color: var(--text);
}

.help-section {
  margin-top: 2rem;
  text-align: left;
}

.syntax-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  font-size: 0.9rem;
}

.syntax-table th,
.syntax-table td {
  padding: 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.syntax-table th {
  background: var(--surface);
}

.syntax-table tr:nth-child(even) {
  background: rgba(0, 0, 0, 0.1);
}

.syntax-table td:first-child,
.syntax-table th:first-child {
  width: 15%;
}

.syntax-table td:nth-child(2),
.syntax-table th:nth-child(2) {
  width: 50%;
}

.small-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

@media screen and (max-width: 768px) {
  .path-input-container {
    flex-direction: column;
  }

  .syntax-table {
    font-size: 0.8rem;
  }

  .syntax-table th,
  .syntax-table td {
    padding: 0.5rem;
  }
}
</style>
