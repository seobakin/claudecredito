/**
 * EntityManager - Manages all entities and systems
 * Central registry for ECS architecture
 */
export default class EntityManager {
    constructor(scene) {
        this.scene = scene;
        this.entities = [];
        this.systems = [];
        this.entitiesToDestroy = [];
    }

    /**
     * Create and register a new entity
     */
    createEntity(x, y) {
        const Entity = require('./Entity.js').default;
        const entity = new Entity(this.scene, x, y);
        this.entities.push(entity);
        return entity;
    }

    /**
     * Add an existing entity
     */
    addEntity(entity) {
        this.entities.push(entity);
        return entity;
    }

    /**
     * Add a system
     */
    addSystem(system) {
        this.systems.push(system);
        return system;
    }

    /**
     * Get entities with a specific tag
     */
    getEntitiesByTag(tag) {
        return this.entities.filter(e => e.hasTag(tag));
    }

    /**
     * Get entities with specific components
     */
    getEntitiesWithComponents(...ComponentClasses) {
        return this.entities.filter(entity => {
            return ComponentClasses.every(Component => entity.hasComponent(Component));
        });
    }

    /**
     * Mark entity for destruction
     */
    destroyEntity(entity) {
        this.entitiesToDestroy.push(entity);
    }

    /**
     * Update all systems and entities
     */
    update(delta) {
        // Update all systems
        for (const system of this.systems) {
            system.update(this.entities, delta);
        }

        // Update entities directly (for components)
        for (const entity of this.entities) {
            entity.update(delta);
        }

        // Clean up destroyed entities
        if (this.entitiesToDestroy.length > 0) {
            for (const entity of this.entitiesToDestroy) {
                entity.destroy();
                const index = this.entities.indexOf(entity);
                if (index !== -1) {
                    this.entities.splice(index, 1);
                }
            }
            this.entitiesToDestroy = [];
        }
    }

    /**
     * Destroy all entities and systems
     */
    destroy() {
        for (const entity of this.entities) {
            entity.destroy();
        }
        this.entities = [];

        for (const system of this.systems) {
            system.destroy();
        }
        this.systems = [];
    }
}
