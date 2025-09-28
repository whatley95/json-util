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
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
}

.history-header h3 {
    margin: 0;
    font-size: 1.1rem;
}

.empty-history {
    text-align: center;
    padding: 1rem 0;
    color: var(--text-muted);
}

.history-list {
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;
}

.history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 4px;
    transition: background-color 0.2s;
    border-left: 3px solid var(--primary);
}

.history-item:hover {
    background-color: rgba(255, 255, 255, 0.12);
}

.history-item-content {
    flex: 1;
    padding: 0.75rem;
    cursor: pointer;
}

.history-item-label {
    font-weight: 500;
    margin-bottom: 0.25rem;
}

.history-item-date {
    font-size: 0.8rem;
    color: var(--text-muted);
}

.delete-button {
    background: none;
    border: none;
    color: var(--text-muted);
    padding: 0.5rem;
    cursor: pointer;
    opacity: 0.6;
    transition: opacity 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    margin-right: 0.5rem;
    height: 28px;
    width: 28px;
}

.delete-button:hover {
    opacity: 1;
    color: var(--error, #ff6b6b);
    background-color: rgba(255, 255, 255, 0.1);
}

.icon-small {
    font-size: 0.9rem;
    display: inline-block;
}
</style>
