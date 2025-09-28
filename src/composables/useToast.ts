import { ref } from 'vue'
import type { ToastNotification } from '../types'

const toasts = ref<ToastNotification[]>([])
let toastIdCounter = 0

/**
 * Toast notification composable
 */
export function useToast() {
    /**
     * Add a new toast notification
     */
    function addToast(
        type: ToastNotification['type'],
        title: string,
        message?: string,
        options?: Partial<Pick<ToastNotification, 'duration' | 'persistent'>>
    ): string {
        const id = `toast-${++toastIdCounter}`
        const toast: ToastNotification = {
            id,
            type,
            title,
            message,
            duration: options?.duration ?? (type === 'error' ? 5000 : 3000),
            persistent: options?.persistent ?? false
        }

        toasts.value.push(toast)

        // Auto-remove toast after duration (if not persistent)
        if (!toast.persistent && toast.duration) {
            setTimeout(() => {
                removeToast(id)
            }, toast.duration)
        }

        return id
    }

    /**
     * Remove a toast by ID
     */
    function removeToast(id: string): void {
        const index = toasts.value.findIndex(toast => toast.id === id)
        if (index > -1) {
            toasts.value.splice(index, 1)
        }
    }

    /**
     * Clear all toasts
     */
    function clearToasts(): void {
        toasts.value = []
    }

    /**
     * Show success toast
     */
    function showSuccess(title: string, message?: string): string {
        return addToast('success', title, message)
    }

    /**
     * Show error toast
     */
    function showError(title: string, message?: string): string {
        return addToast('error', title, message, { duration: 5000 })
    }

    /**
     * Show warning toast
     */
    function showWarning(title: string, message?: string): string {
        return addToast('warning', title, message)
    }

    /**
     * Show info toast
     */
    function showInfo(title: string, message?: string): string {
        return addToast('info', title, message)
    }

    return {
        toasts,
        addToast,
        removeToast,
        clearToasts,
        showSuccess,
        showError,
        showWarning,
        showInfo
    }
}

// Global toast instance for use across the app
export const globalToast = useToast()