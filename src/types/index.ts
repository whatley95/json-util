/**
 * Core type definitions for JSON Utility application
 */

// Re-export HistoryItem from localStorage utils
export type { HistoryItem } from '../utils/localStorage'

/**
 * Base interface for tool state
 */
export interface BaseToolState {
    input: string
    output: string
    isProcessing: boolean
    error: string | null
    showHistory: boolean
}

/**
 * JSON validation result
 */
export interface JsonValidationResult {
    isValid: boolean
    message: string
    error?: JsonValidationError
}

/**
 * JSON validation error details
 */
export interface JsonValidationError {
    message: string
    line?: number
    column?: number
    position?: number
}

/**
 * JSON statistics for validation tool
 */
export interface JsonStatistics {
    objects: number
    arrays: number
    values: number
    depth: number
    size: number
}

/**
 * JSON Diff configuration
 */
export interface DiffConfiguration {
    viewMode: 'side-by-side' | 'line-by-line'
    outputFormat: 'formatted' | 'compact'
    autoCompareEnabled: boolean
    ignoreCase: boolean
    ignoreWhitespace: boolean
}

/**
 * JSON Beautify options
 */
export interface BeautifyOptions {
    indent: number
    sortKeys: boolean
    trailingComma: boolean
}

/**
 * JSONPath query result
 */
export interface JsonPathResult {
    path: string
    value: unknown
    parent: unknown
    parentProperty: string | number
}

/**
 * Tool configuration
 */
export interface ToolConfig {
    name: string
    title: string
    description: string
    icon: string
    path: string
}

/**
 * Keyboard shortcut definition
 */
export interface KeyboardShortcut {
    key: string
    ctrlKey?: boolean
    shiftKey?: boolean
    altKey?: boolean
    action: () => void
    description: string
}

/**
 * Toast notification
 */
export interface ToastNotification {
    id: string
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message?: string
    duration?: number
    persistent?: boolean
}

/**
 * Loading state
 */
export interface LoadingState {
    isLoading: boolean
    message?: string
    progress?: number
}