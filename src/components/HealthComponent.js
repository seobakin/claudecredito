import Component from '../ecs/Component.js';
import EventBus from '../utils/EventBus.js';

/**
 * HealthComponent - Manages entity health and damage
 */
export default class HealthComponent extends Component {
    constructor(maxHealth = 100) {
        super();
        this.maxHealth = maxHealth;
        this.currentHealth = maxHealth;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
    }

    /**
     * Take damage
     */
    takeDamage(amount) {
        if (this.invulnerable) return false;

        this.currentHealth -= amount;

        EventBus.emit('health:changed', {
            entity: this.entity,
            current: this.currentHealth,
            max: this.maxHealth
        });

        if (this.currentHealth <= 0) {
            this.currentHealth = 0;
            this.die();
            return true;
        }

        return false;
    }

    /**
     * Heal entity
     */
    heal(amount) {
        this.currentHealth = Math.min(this.currentHealth + amount, this.maxHealth);

        EventBus.emit('health:changed', {
            entity: this.entity,
            current: this.currentHealth,
            max: this.maxHealth
        });
    }

    /**
     * Make invulnerable for a duration
     */
    makeInvulnerable(duration) {
        this.invulnerable = true;
        this.invulnerabilityTime = duration;
    }

    update(delta) {
        if (this.invulnerable && this.invulnerabilityTime > 0) {
            this.invulnerabilityTime -= delta;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
    }

    /**
     * Called when health reaches 0
     */
    die() {
        EventBus.emit('entity:died', { entity: this.entity });
    }

    /**
     * Check if entity is alive
     */
    isAlive() {
        return this.currentHealth > 0;
    }

    /**
     * Get health percentage
     */
    getHealthPercent() {
        return this.currentHealth / this.maxHealth;
    }
}
