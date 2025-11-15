/**
 * Entity - Base class for game objects in ECS architecture
 * Entities are containers for components
 */
export default class Entity {
    static nextId = 0;

    constructor(scene, x = 0, y = 0) {
        this.id = Entity.nextId++;
        this.scene = scene;
        this.components = new Map();
        this.active = true;
        this.tags = new Set();

        // Transform is fundamental to all entities
        this.x = x;
        this.y = y;
    }

    /**
     * Add a component to this entity
     */
    addComponent(component) {
        const name = component.constructor.name;
        this.components.set(name, component);
        component.entity = this;
        return this;
    }

    /**
     * Get a component by class name
     */
    getComponent(ComponentClass) {
        return this.components.get(ComponentClass.name);
    }

    /**
     * Check if entity has a component
     */
    hasComponent(ComponentClass) {
        return this.components.has(ComponentClass.name);
    }

    /**
     * Remove a component
     */
    removeComponent(ComponentClass) {
        const component = this.getComponent(ComponentClass);
        if (component && component.destroy) {
            component.destroy();
        }
        this.components.delete(ComponentClass.name);
        return this;
    }

    /**
     * Add a tag to this entity
     */
    addTag(tag) {
        this.tags.add(tag);
        return this;
    }

    /**
     * Check if entity has a tag
     */
    hasTag(tag) {
        return this.tags.has(tag);
    }

    /**
     * Update entity (called each frame)
     */
    update(delta) {
        if (!this.active) return;

        // Update all components
        for (const component of this.components.values()) {
            if (component.update) {
                component.update(delta);
            }
        }
    }

    /**
     * Destroy entity and all components
     */
    destroy() {
        for (const component of this.components.values()) {
            if (component.destroy) {
                component.destroy();
            }
        }
        this.components.clear();
        this.active = false;
    }
}
