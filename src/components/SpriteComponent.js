import Component from '../ecs/Component.js';

/**
 * SpriteComponent - Visual representation using Phaser sprite
 */
export default class SpriteComponent extends Component {
    constructor(scene, texture, frame, options = {}) {
        super();
        this.scene = scene;
        this.texture = texture;
        this.frame = frame;
        this.sprite = null;
        this.options = options;
    }

    init() {
        if (!this.entity) return;

        // Create sprite (or use graphics if no texture)
        if (this.texture) {
            this.sprite = this.scene.add.sprite(
                this.entity.x,
                this.entity.y,
                this.texture,
                this.frame
            );
        } else {
            // Fallback: create a colored rectangle
            this.sprite = this.scene.add.rectangle(
                this.entity.x,
                this.entity.y,
                this.options.width || 32,
                this.options.height || 32,
                this.options.color || 0x4CAF50
            );
        }

        // Apply options
        if (this.options.scale) {
            this.sprite.setScale(this.options.scale);
        }
        if (this.options.depth !== undefined) {
            this.sprite.setDepth(this.options.depth);
        }
    }

    update(delta) {
        if (!this.sprite || !this.entity) return;

        // Sync sprite position with entity
        this.sprite.x = this.entity.x;
        this.sprite.y = this.entity.y;
    }

    destroy() {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = null;
        }
    }

    // Helper methods
    setTexture(texture, frame) {
        if (this.sprite) {
            this.sprite.setTexture(texture, frame);
        }
    }

    setTint(color) {
        if (this.sprite && this.sprite.setTint) {
            this.sprite.setTint(color);
        }
    }

    playAnimation(key, ignoreIfPlaying = false) {
        if (this.sprite && this.sprite.anims) {
            this.sprite.anims.play(key, ignoreIfPlaying);
        }
    }
}
