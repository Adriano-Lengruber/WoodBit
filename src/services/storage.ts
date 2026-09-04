/**
 * Hybrid Offline-First Persistence Service for WoodBit ERP
 * Integrates LocalStorage (Instant UI + Offline Cache) with Backend Native SQLite.
 * Handles automatic offline queuing, sync flush upon reconnection, and error suppression.
 */

const STORAGE_KEY_PREFIX = 'woodbit_erp_v1_';
const QUEUE_KEY = 'woodbit_offline_sync_queue_v1';

// Save state to local cache immediately + async sync to SQLite database
export function saveState<T>(key: string, data: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, serialized);

    // Sync to SQLite backend asynchronously
    syncKeyToBackend(key, data);
    return true;
  } catch (err) {
    console.warn(`[WoodBit Storage] Failed to save key "${key}":`, err);
    return false;
  }
}

// Load state from local cache with fallback
export function loadState<T>(key: string, fallback: T): T {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return fallback;
    }
    const item = window.localStorage.getItem(`${STORAGE_KEY_PREFIX}${key}`);
    if (item === null) {
      return fallback;
    }
    return JSON.parse(item) as T;
  } catch (err) {
    console.warn(`[WoodBit Storage] Failed to load key "${key}", using default:`, err);
    return fallback;
  }
}

// Asynchronously sync a single key to backend SQLite
async function syncKeyToBackend(key: string, data: any) {
  try {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      queueOfflineMutation(key, data);
      return;
    }

    const res = await fetch('/api/db/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, data }),
    });

    if (!res.ok) {
      queueOfflineMutation(key, data);
    }
  } catch (err) {
    queueOfflineMutation(key, data);
  }
}

// Queue mutations when working offline in the field (e.g. at a client's home)
function queueOfflineMutation(key: string, data: any) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const raw = window.localStorage.getItem(QUEUE_KEY);
    const queue: Record<string, any> = raw ? JSON.parse(raw) : {};
    queue[key] = { data, timestamp: new Date().toISOString() };
    window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log(`[WoodBit Offline Sync] Queued offline change for "${key}"`);
  } catch (e) {
    console.warn('[WoodBit Offline Sync] Failed to queue offline mutation:', e);
  }
}

// Get number of pending offline mutations
export function getOfflineQueueCount(): number {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 0;
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return 0;
    const queue = JSON.parse(raw);
    return Object.keys(queue).length;
  } catch {
    return 0;
  }
}

// Flush pending offline changes when connection is restored
export async function flushOfflineSyncQueue(): Promise<number> {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return 0;
    const raw = window.localStorage.getItem(QUEUE_KEY);
    if (!raw) return 0;
    const queue: Record<string, { data: any; timestamp: string }> = JSON.parse(raw);
    const keys = Object.keys(queue);
    if (keys.length === 0) return 0;

    console.log(`[WoodBit Offline Sync] Flushing ${keys.length} queued offline changes to SQLite...`);

    let flushed = 0;
    for (const key of keys) {
      try {
        const item = queue[key];
        const res = await fetch('/api/db/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, data: item.data }),
        });
        if (res.ok) {
          delete queue[key];
          flushed++;
        }
      } catch {
        break; // Network still unreachable
      }
    }

    if (Object.keys(queue).length === 0) {
      window.localStorage.removeItem(QUEUE_KEY);
    } else {
      window.localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    }

    console.log(`[WoodBit Offline Sync] Successfully flushed ${flushed} items to SQLite.`);
    return flushed;
  } catch (err) {
    console.warn('[WoodBit Offline Sync] Error flushing sync queue:', err);
    return 0;
  }
}

// Fetch database baseline from SQLite and hydrate local state if newer
export async function hydrateFromSQLiteDatabase(): Promise<Record<string, any> | null> {
  try {
    const res = await fetch('/api/db/sync');
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.success || !json.data) return null;

    // Flush any pending offline queue first
    await flushOfflineSyncQueue();

    return json.data;
  } catch (err) {
    console.warn('[WoodBit Storage] Failed to fetch SQLite sync, operating with offline local cache:', err);
    return null;
  }
}

// Clear all local state
export function clearAllPersistedState(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(window.localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_KEY_PREFIX) || k === QUEUE_KEY) {
          window.localStorage.removeItem(k);
        }
      });
    }
  } catch (e) {
    console.warn('[WoodBit Storage] Failed to clear storage:', e);
  }
}

// Auto-listen to network reconnection
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('[WoodBit Connectivity] Reconnected to network. Flushing offline queue...');
    flushOfflineSyncQueue();
  });
}
