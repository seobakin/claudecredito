import Component from '../ecs/Component.js';

/**
 * PhysicsComponent - Arcade physics body
 */
export default class PhysicsComponent extends Component {
    constructor(scene, options = {}) {
        super();
        this.scene = scene;
        this.body = null;
        this.options = options;
    }

    init() {
        if (!this.entity) return;

        // Get sprite from SpriteComponent if available
        const spriteComp = this.entity.getComponent(
            require('./SpriteComponent.js').default
        );

        if (spriteComp && spriteComp.sprite) {
            // Add physics to sprite
            this.scene.physics.add.existing(spriteComp.sprite);
            this.body = spriteComp.sprite.body;
        } else {
            // Create a physics body without sprite (for invisible colliders)
            const obj = this.scene.add.rectangle(
                this.entity.x,
                this.entity.y,
                this.options.width || 32,
                this.options.height || 32
            );
            this.scene.physics.add.existing(obj);
            this.body = obj.body;
        }

        // Apply options
        if (this.options.gravity !== undefined) {
            this.body.setGravityY(this.options.gravity);
        }
        if (this.options.bounce !== undefined) {
            this.body.setBounce(this.options.bounce);
        }
        if (this.options.collideWorldBounds !== undefined) {
            this.body.setCollideWorldBounds(this.options.collideWorldBounds);
        }
        if (this.options.immovable !== undefined) {
            this.body.setImmovable(this.options.immovable);
        }
        if (this.options.allowGravity !== undefined) {
            this.body.setAllowGravity(this.options.allowGravity);
        }
    }

    update(delta) {
        if (!this.body || !this.entity) return;

        // Sync entity position with physics body
        this.entity.x = this.body.x;
        this.entity.y = this.body.y;
    }

    // Helper methods
    setVelocity(x, y) {
        if (this.body) {
            this.body.setVelocity(x, y);
        }
    }

    setVelocityX(x) {
        if (this.body) {
            this.body.setVelocityX(x);
        }
    }

    setVelocityY(y) {
        if (this.body) {
            this.body.setVelocityY(y);
        }
    }

    setAcceleration(x, y) {
        if (this.body) {
            this.body.setAcceleration(x, y);
        }
    }

    destroy() {
        this.body = null;
    }
}
