/**
 * EventBus - Global event system for decoupled communication
 * Singleton pattern for game-wide events
 */
class EventBusClass {
    constructor() {
        this.events = new Map();
    }

    /**
     * Subscribe to an event
     */
    on(eventName, callback, context) {
        if (!this.events.has(eventName)) {
            this.events.set(eventName, []);
        }

        this.events.get(eventName).push({ callback, context });
    }

    /**
     * Subscribe to an event (one-time)
     */
    once(eventName, callback, context) {
        const wrapper = (...args) => {
            callback.apply(context, args);
            this.off(eventName, wrapper);
        };

        this.on(eventName, wrapper, context);
    }

    /**
     * Unsubscribe from an event
     */
    off(eventName, callback) {
        if (!this.events.has(eventName)) return;

        const listeners = this.events.get(eventName);
        const index = listeners.findIndex(l => l.callback === callback);

        if (index !== -1) {
            listeners.splice(index, 1);
        }

        if (listeners.length === 0) {
            this.events.delete(eventName);
        }
    }

    /**
     * Emit an event
     */
    emit(eventName, data) {
        if (!this.events.has(eventName)) return;

        const listeners = this.events.get(eventName);

        for (const listener of listeners) {
            listener.callback.call(listener.context, data);
        }
    }

    /**
     * Clear all events
     */
    clear() {
        this.events.clear();
    }

    /**
     * Remove all listeners for a specific event
     */
    removeAll(eventName) {
        this.events.delete(eventName);
    }
}

// Export singleton instance
const EventBus = new EventBusClass();
export default EventBus;
