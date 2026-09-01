/**
 * Safe Local Storage & State Persistence Service for WoodBit ERP
 * Handles serialization, error suppression, and quota limits gracefully.
 */

const STORAGE_KEY_PREFIX = 'woodbit_erp_v1_';

export function saveState<T>(key: string, data: T): boolean {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return false;
    }
    const serialized = JSON.stringify(data);
    window.localStorage.setItem(`${STORAGE_KEY_PREFIX}${key}`, serialized);
    return true;
  } catch (err) {
    console.warn(`[WoodBit Storage] Failed to save key "${key}":`, err);
    return false;
  }
}

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

export function clearAllPersistedState(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      Object.keys(window.localStorage).forEach((k) => {
        if (k.startsWith(STORAGE_KEY_PREFIX)) {
          window.localStorage.removeItem(k);
        }
      });
    }
  } catch (e) {
    console.warn('[WoodBit Storage] Failed to clear storage:', e);
  }
}
