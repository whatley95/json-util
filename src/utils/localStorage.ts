/**
 * Local storage utility for JSON-Util
 * Handles storing and retrieving history items with namespacing for different tools
 */

// Constants
const LOCAL_STORAGE_PREFIX = 'json-util';
const MAX_HISTORY_ITEMS = 10;  // Maximum number of history items per tool

// Type definitions
export interface HistoryItem {
    id: string;
    label: string;
    timestamp: number;
    data: any;
}

export interface ToolHistory {
    [key: string]: HistoryItem[];
}

/**
 * Check if item with similar data already exists in history
 * @param history Array of history items
 * @param data Data to check
 * @returns True if similar item exists, false otherwise
 */
function isDuplicate(history: HistoryItem[], data: any): boolean {
    // Check for duplicates by comparing stringified data
    const newDataString = JSON.stringify(data);
    return history.some(item => JSON.stringify(item.data) === newDataString);
}

/**
 * Save an item to history for a specific tool
 * @param toolName The name of the tool (e.g., 'diff', 'beautify')
 * @param label A short label for the history item
 * @param data The data to store
 * @param skipDuplicates Whether to skip saving if similar data already exists (default: true)
 * @returns The saved history item or null if skipped as duplicate
 */
export function saveToHistory(toolName: string, label: string, data: any, skipDuplicates: boolean = true): HistoryItem | null {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.history`;

    // Get existing history or initialize empty array
    let history: HistoryItem[] = [];
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            history = JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to parse history from localStorage:', error);
    }

    // Check for duplicates if skipDuplicates is true
    if (skipDuplicates && isDuplicate(history, data)) {
        console.log('Skipping duplicate history item');
        return null;
    }

    // Create new history item
    const newItem: HistoryItem = {
        id: generateId(),
        label,
        timestamp: Date.now(),
        data
    };

    // Add new item to the beginning of the array
    history.unshift(newItem);

    // Limit the number of history items
    history = history.slice(0, MAX_HISTORY_ITEMS);

    // Save back to localStorage
    try {
        localStorage.setItem(key, JSON.stringify(history));
    } catch (error) {
        console.error('Failed to save history to localStorage:', error);
    }

    return newItem;
}

/**
 * Get history items for a specific tool
 * @param toolName The name of the tool
 * @returns Array of history items
 */
export function getHistory(toolName: string): HistoryItem[] {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.history`;

    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to retrieve history from localStorage:', error);
    }

    return [];
}

/**
 * Delete a single history item by ID
 * @param toolName The name of the tool
 * @param itemId The ID of the history item to delete
 * @returns True if item was found and deleted, false otherwise
 */
export function deleteHistoryItem(toolName: string, itemId: string): boolean {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.history`;

    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            let history: HistoryItem[] = JSON.parse(stored);
            const initialLength = history.length;

            // Filter out the item with the matching ID
            history = history.filter(item => item.id !== itemId);

            // If an item was removed, save the updated history
            if (history.length < initialLength) {
                localStorage.setItem(key, JSON.stringify(history));
                return true;
            }
        }
    } catch (error) {
        console.error('Failed to delete history item:', error);
    }

    return false;
}

/**
 * Clear history for a specific tool
 * @param toolName The name of the tool
 */
export function clearHistory(toolName: string): void {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.history`;
    localStorage.removeItem(key);
}

/**
 * Check if there is any history saved for any tool
 * @returns True if there is any history, false otherwise
 */
export function hasAnyHistory(): boolean {
    for (const key in localStorage) {
        if (key.startsWith(LOCAL_STORAGE_PREFIX) && key.endsWith('history')) {
            const stored = localStorage.getItem(key);
            if (stored && JSON.parse(stored).length > 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * Clear all history for all tools
 */
export function clearAllHistory(): void {
    for (const key in localStorage) {
        if (key.startsWith(LOCAL_STORAGE_PREFIX) && key.endsWith('history')) {
            localStorage.removeItem(key);
        }
    }
}

/**
 * Save the last state of a tool
 * @param toolName The name of the tool
 * @param state The state to save
 */
export function saveToolState(toolName: string, state: any): void {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.state`;
    try {
        localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
        console.error('Failed to save tool state to localStorage:', error);
    }
}

/**
 * Get the last saved state of a tool
 * @param toolName The name of the tool
 * @returns The saved state or null if none exists
 */
export function getToolState(toolName: string): any {
    const key = `${LOCAL_STORAGE_PREFIX}.${toolName}.state`;

    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Failed to retrieve tool state from localStorage:', error);
    }

    return null;
}

/**
 * Generate a unique ID for history items
 */
function generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}
