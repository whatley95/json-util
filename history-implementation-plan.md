# History Implementation Plan for JSON Utility Views

## Common Pattern for All Views

1. **Add UI Components**:
   ```vue
   <div class="options-bar">
     <button @click="showHistory = !showHistory" class="btn btn-sm" :class="{ 'btn-primary': showHistory }">
       <span class="icon">⏱</span> History
     </button>
   </div>

   <HistoryPanel v-if="showHistory" toolName="[toolName]" @select="loadHistoryItem" />
   ```

2. **Add Imports**:
   ```typescript
   import HistoryPanel from '../components/HistoryPanel.vue'
   import { saveToHistory, saveToolState, getToolState, HistoryItem } from '../utils/localStorage'
   import { ref, onMounted, onUnmounted } from 'vue' // Add if not already present
   ```

3. **Add State Variables**:
   ```typescript
   const showHistory = ref(false)
   ```

4. **Add History Functions**:
   ```typescript
   // Save to history when operation is successful
   function saveCurrentToHistory(actionType: string) {
     if ([check for valid data condition]) {
       const timestamp = new Date().toLocaleTimeString();
       const label = `${actionType} at ${timestamp}`;
       
       // Save to history, skipping duplicates
       saveToHistory('[toolName]', label, {
         // Tool-specific data
       }, true); // true = skip duplicates
     }
   }

   // Load history item
   function loadHistoryItem(item: HistoryItem) {
     const data = item.data;
     // Restore state from data
     
     // Hide history panel after loading
     showHistory.value = false;
   }

   // Save current state to localStorage when component unmounts
   function saveState() {
     saveToolState('[toolName]', {
       // Tool-specific data
     });
   }

   // Load previous state if available
   function loadPreviousState() {
     const state = getToolState('[toolName]');
     if (state) {
       // Restore state
     }
   }

   // Register and unregister lifecycle hooks
   onMounted(() => {
     loadPreviousState();
   });

   onUnmounted(() => {
     saveState();
   });
   ```

5. **Update Action Functions** to call `saveCurrentToHistory`

## Specific Implementation for Each View

### JsonBeautifyView
- Already implemented ✓

### JsonDiffView
- Already implemented ✓

### JsonValidateView
- Implemented now ✓

### JsonPathView
- Tool name: "path"
- Key data: 
  - jsonInput
  - jsonPath
  - result
  - Auto-save after successful path query

### JsonEscapeView
- Tool name: "escape"
- Key data:
  - inputText
  - outputText
  - direction (encode/decode)
  - Auto-save after encode/decode operations

### JsonConverterView
- Tool name: "converter"
- Key data:
  - inputFormat
  - outputFormat
  - inputData
  - outputData
  - Auto-save after successful conversion
