import { ref, onMounted, onUnmounted, watch } from 'vue'
import { saveToHistory, getHistory, saveToolState, getToolState, clearHistory, type HistoryItem } from '../utils/localStorage'
import type { BaseToolState, KeyboardShortcut, LoadingState } from '../types/index'

/**
 * Utility function to debounce a function call
 */
function debounce<T extends (...args: unknown[]) => unknown>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout

    return (...args: Parameters<T>) => {
        clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
    }
}

/**
 * Composable for common JSON tool functionality
 */
export function useJsonTool(toolName: string) {
    // Core state
    const state = ref<BaseToolState>({
        input: '',
        output: '',
        isProcessing: false,
        error: null,
        showHistory: false
    })

    const loadingState = ref<LoadingState>({
        isLoading: false,
        message: undefined,
        progress: undefined
    })

    const history = ref<HistoryItem[]>([])
    const shortcuts = ref<KeyboardShortcut[]>([])

    // Load initial state and history
    onMounted(() => {
        loadHistory()
        loadSavedState()
        registerKeyboardShortcuts()
    })

    // Clean up keyboard shortcuts
    onUnmounted(() => {
        unregisterKeyboardShortcuts()
    })

    // Auto-save state when input changes
    watch(
        () => state.value.input,
        debounce(() => {
            saveState()
        }, 1000),
        { deep: true }
    )

    /**
     * Load history from localStorage
     */
    function loadHistory(): void {
        history.value = getHistory(toolName)
    }

    /**
     * Load saved tool state
     */
    function loadSavedState(): void {
        const savedState = getToolState(toolName)
        if (savedState) {
            state.value = { ...state.value, ...savedState }
        }
    }

    /**
     * Save current state
     */
    function saveState(): void {
        saveToolState(toolName, {
            input: state.value.input,
            showHistory: state.value.showHistory
        })
    }

    /**
     * Save operation to history
     */
    function saveToHistoryList(label: string, data: unknown, skipDuplicates = true): HistoryItem | null {
        const item = saveToHistory(toolName, label, data, skipDuplicates)
        if (item) {
            loadHistory() // Refresh history list
        }
        return item
    }

    /**
     * Clear tool history
     */
    function clearToolHistory(): void {
        clearHistory(toolName)
        history.value = []
    }

    /**
     * Load a history item
     */
    function loadHistoryItem(item: HistoryItem): void {
        // This should be implemented by the specific tool
        console.log('Loading history item:', item)
    }

    /**
     * Set loading state
     */
    function setLoading(isLoading: boolean, message?: string, progress?: number): void {
        loadingState.value = {
            isLoading,
            message,
            progress
        }
    }

    /**
     * Set error state
     */
    function setError(error: string | null): void {
        state.value.error = error
        if (error) {
            state.value.isProcessing = false
            setLoading(false)
        }
    }

    /**
     * Clear all states
     */
    function clearAll(): void {
        state.value.input = ''
        state.value.output = ''
        state.value.error = null
        state.value.isProcessing = false
        setLoading(false)
    }

    /**
     * Register a keyboard shortcut
     */
    function registerShortcut(shortcut: KeyboardShortcut): void {
        shortcuts.value.push(shortcut)
    }

    /**
     * Handle keyboard events
     */
    function handleKeyDown(event: KeyboardEvent): void {
        for (const shortcut of shortcuts.value) {
            if (
                event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                !!event.ctrlKey === !!shortcut.ctrlKey &&
                !!event.shiftKey === !!shortcut.shiftKey &&
                !!event.altKey === !!shortcut.altKey
            ) {
                event.preventDefault()
                shortcut.action()
                break
            }
        }
    }

    /**
     * Register keyboard event listeners
     */
    function registerKeyboardShortcuts(): void {
        document.addEventListener('keydown', handleKeyDown)
    }

    /**
     * Unregister keyboard event listeners
     */
    function unregisterKeyboardShortcuts(): void {
        document.removeEventListener('keydown', handleKeyDown)
    }

    /**
     * Process JSON with error handling
     */
    async function processJson<T>(
        processor: () => Promise<T> | T,
        loadingMessage = 'Processing...'
    ): Promise<T | null> {
        try {
            state.value.isProcessing = true
            state.value.error = null
            setLoading(true, loadingMessage)

            const result = await processor()

            return result
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An error occurred'
            setError(errorMessage)
            return null
        } finally {
            state.value.isProcessing = false
            setLoading(false)
        }
    }

    /**
     * Validate JSON string
     */
    function validateJson(jsonString: string): { isValid: boolean; error?: string; parsed?: unknown } {
        try {
            const parsed = JSON.parse(jsonString)
            return { isValid: true, parsed }
        } catch (error) {
            return {
                isValid: false,
                error: error instanceof Error ? error.message : 'Invalid JSON'
            }
        }
    }

    /**
     * Format JSON string
     */
    function formatJson(jsonString: string, indent = 2): string | null {
        try {
            const parsed = JSON.parse(jsonString)
            return JSON.stringify(parsed, null, indent)
        } catch {
            return null
        }
    }

    /**
     * Create debounced version of a function
     */
    function createDebouncedFunction<T extends (...args: unknown[]) => unknown>(
        func: T,
        wait = 300
    ): (...args: Parameters<T>) => void {
        return debounce(func, wait)
    }

    return {
        // State
        state,
        loadingState,
        history,
        shortcuts,

        // Methods
        loadHistory,
        loadSavedState,
        saveState,
        saveToHistoryList,
        clearToolHistory,
        loadHistoryItem,
        setLoading,
        setError,
        clearAll,
        registerShortcut,
        processJson,
        validateJson,
        formatJson,
        createDebouncedFunction
    }
}

/**
 * Composable for keyboard shortcuts
 */
export function useKeyboardShortcuts() {
    const shortcuts = ref<KeyboardShortcut[]>([])

    function registerShortcut(shortcut: KeyboardShortcut): void {
        shortcuts.value.push(shortcut)
    }

    function unregisterShortcut(key: string): void {
        shortcuts.value = shortcuts.value.filter(s => s.key !== key)
    }

    function handleKeyDown(event: KeyboardEvent): void {
        for (const shortcut of shortcuts.value) {
            if (
                event.key.toLowerCase() === shortcut.key.toLowerCase() &&
                !!event.ctrlKey === !!shortcut.ctrlKey &&
                !!event.shiftKey === !!shortcut.shiftKey &&
                !!event.altKey === !!shortcut.altKey
            ) {
                event.preventDefault()
                shortcut.action()
                break
            }
        }
    }

    onMounted(() => {
        document.addEventListener('keydown', handleKeyDown)
    })

    onUnmounted(() => {
        document.removeEventListener('keydown', handleKeyDown)
    })

    return {
        shortcuts,
        registerShortcut,
        unregisterShortcut
    }
}