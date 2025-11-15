/**
 * SaveManager - Robust localStorage wrapper for game saves
 */
export default class SaveManager {
    static SAVE_KEY_PREFIX = 'game_save_';

    /**
     * Save data to localStorage
     */
    static save(key, data) {
        try {
            const fullKey = this.SAVE_KEY_PREFIX + key;
            const serialized = JSON.stringify({
                data,
                timestamp: Date.now(),
                version: '1.0.0'
            });

            localStorage.setItem(fullKey, serialized);
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }

    /**
     * Load data from localStorage
     */
    static load(key, defaultValue = null) {
        try {
            const fullKey = this.SAVE_KEY_PREFIX + key;
            const serialized = localStorage.getItem(fullKey);

            if (!serialized) {
                return defaultValue;
            }

            const parsed = JSON.parse(serialized);
            return parsed.data;
        } catch (e) {
            console.error('Load failed:', e);
            return defaultValue;
        }
    }

    /**
     * Delete a save
     */
    static delete(key) {
        try {
            const fullKey = this.SAVE_KEY_PREFIX + key;
            localStorage.removeItem(fullKey);
            return true;
        } catch (e) {
            console.error('Delete failed:', e);
            return false;
        }
    }

    /**
     * Check if a save exists
     */
    static exists(key) {
        const fullKey = this.SAVE_KEY_PREFIX + key;
        return localStorage.getItem(fullKey) !== null;
    }

    /**
     * Get all save keys
     */
    static getAllKeys() {
        const keys = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(this.SAVE_KEY_PREFIX)) {
                keys.push(key.replace(this.SAVE_KEY_PREFIX, ''));
            }
        }
        return keys;
    }

    /**
     * Clear all saves
     */
    static clearAll() {
        const keys = this.getAllKeys();
        for (const key of keys) {
            this.delete(key);
        }
    }
}
