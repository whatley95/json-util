<template>
    <div class="history-panel">
        <div class="history-header">
            <h3>Recent History</h3>
            <button @click="clearToolHistory" class="btn btn-sm btn-secondary" title="Clear history">
                <span class="icon">✕</span>
            </button>
        </div>

        <div v-if="history.length === 0" class="empty-history">
            <p>No history items yet</p>
        </div>

        <ul v-else class="history-list">
            <li v-for="item in history" :key="item.id" class="history-item">
                <div class="history-item-content" @click="loadItem(item)">
                    <div class="history-item-label">{{ item.label }}</div>
                    <div class="history-item-date">{{ formatDate(item.timestamp) }}</div>
                </div>
                <button @click.stop="removeHistoryItem(item)" class="delete-button" title="Delete this item">
                    <span class="icon-small">✕</span>
                </button>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { HistoryItem, getHistory, clearHistory, deleteHistoryItem } from '../utils/localStorage';

const props = defineProps<{
    toolName: string;
}>();

const emit = defineEmits<{
    (e: 'select', item: HistoryItem): void;
}>();

const history = ref<HistoryItem[]>([]);

const historyStorageKey = (tool: string) => `json-util.${tool}.history`;

const handleStorage = (event: StorageEvent) => {
    if (event.key === historyStorageKey(props.toolName)) {
        loadHistory();
    }
};

const handleHistoryUpdated = (event: Event) => {
    const detail = (event as CustomEvent).detail;
    if (!detail || typeof detail !== 'object') return;
    if (detail.toolName === props.toolName) {
        loadHistory();
    }
};

// Load history on mount and register listeners
onMounted(() => {
    loadHistory();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('json-util:history-updated', handleHistoryUpdated as EventListener);
});

// Clean up listeners on unmount
onUnmounted(() => {
    window.removeEventListener('storage', handleStorage);
    window.removeEventListener('json-util:history-updated', handleHistoryUpdated as EventListener);
});

// Reload history when tool name changes
watch(() => props.toolName, () => {
    loadHistory();
});

function loadHistory() {
    history.value = getHistory(props.toolName);
}

function loadItem(item: HistoryItem) {
    emit('select', item);
}

function clearToolHistory() {
    clearHistory(props.toolName);
    history.value = [];
}

function removeHistoryItem(item: HistoryItem) {
    const success = deleteHistoryItem(props.toolName, item.id);
    if (success) {
        // Update the local history without a full refresh
        history.value = history.value.filter(h => h.id !== item.id);
    }
}

function formatDate(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}
</script>

<style scoped>
.history-panel {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: var(--radius);
    padding: 0.875rem;
    margin-bottom: 1rem;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.history-header h3 {
    margin: 0;
    font-size: 0.85rem;
    font-weight: 600;
}

.empty-history {
    text-align: center;
    padding: 0.75rem 0;
    color: var(--text-muted);
    font-size: 0.85rem;
}

.history-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 240px;
    overflow-y: auto;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.35rem;
    background: var(--surface);
    border-radius: var(--radius-sm);
    transition: background-color 0.15s ease;
    border-left: 2px solid var(--primary);
}

.history-item:hover {
    background: rgba(var(--primary-rgb), 0.06);
}

.history-item-content {
    flex: 1;
    padding: 0.5rem 0.75rem;
    cursor: pointer;
}

.history-item-label {
    font-weight: 500;
    font-size: 0.85rem;
    margin-bottom: 0.15rem;
}

.history-item-date {
    font-size: 0.7rem;
    color: var(--text-muted);
}

.delete-button {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 0.35rem;
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.15s ease, color 0.15s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--radius-sm);
    margin-right: 0.35rem;
    height: 24px;
    width: 24px;
    font-size: 0.75rem;
}

.history-item:hover .delete-button {
    opacity: 0.6;
}

.delete-button:hover {
    opacity: 1 !important;
    color: var(--danger);
    background: rgba(248, 113, 113, 0.1);
}

.icon-small {
    font-size: 0.8rem;
    display: inline-block;
}
</style>
