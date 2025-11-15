/**
 * System - Base class for all systems in ECS
 * Systems contain logic and operate on entities with specific components
 */
export default class System {
    constructor(scene) {
        this.scene = scene;
        this.enabled = true;
    }

    /**
     * Filter entities that this system should process
     * Override to specify required components
     */
    filter(entity) {
        return true;
    }

    /**
     * Update all entities managed by this system
     */
    update(entities, delta) {
        if (!this.enabled) return;

        for (const entity of entities) {
            if (entity.active && this.filter(entity)) {
                this.updateEntity(entity, delta);
            }
        }
    }

    /**
     * Update a single entity
     * Override in subclass
     */
    updateEntity(entity, delta) {
        // Override in subclass
    }

    /**
     * Called when system is destroyed
     */
    destroy() {
        // Override in subclass
    }
}
