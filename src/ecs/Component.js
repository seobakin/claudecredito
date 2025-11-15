/**
 * Component - Base class for all components in ECS
 * Components hold data and minimal logic
 */
export default class Component {
    constructor() {
        this.entity = null;
        this.enabled = true;
    }

    /**
     * Called when component is added to entity
     */
    init() {
        // Override in subclass
    }

    /**
     * Update component (optional)
     */
    update(delta) {
        // Override in subclass if needed
    }

    /**
     * Clean up resources
     */
    destroy() {
        // Override in subclass
    }
}
