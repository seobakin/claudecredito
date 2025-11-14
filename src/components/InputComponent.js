import Component from '../ecs/Component.js';

/**
 * InputComponent - Handles keyboard/touch input for entities
 */
export default class InputComponent extends Component {
    constructor(scene, config = {}) {
        super();
        this.scene = scene;
        this.config = config;
        this.keys = {};
        this.cursors = null;
    }

    init() {
        // Create keyboard cursors
        this.cursors = this.scene.input.keyboard.createCursorKeys();

        // Create additional keys if specified
        if (this.config.keys) {
            for (const [name, keyCode] of Object.entries(this.config.keys)) {
                this.keys[name] = this.scene.input.keyboard.addKey(keyCode);
            }
        }

        // Add WASD by default
        this.keys.W = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.A = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.S = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        this.keys.D = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        this.keys.SPACE = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    /**
     * Get horizontal input (-1, 0, 1)
     */
    getHorizontal() {
        let horizontal = 0;

        if (this.cursors.left.isDown || this.keys.A.isDown) {
            horizontal = -1;
        } else if (this.cursors.right.isDown || this.keys.D.isDown) {
            horizontal = 1;
        }

        return horizontal;
    }

    /**
     * Get vertical input (-1, 0, 1)
     */
    getVertical() {
        let vertical = 0;

        if (this.cursors.up.isDown || this.keys.W.isDown) {
            vertical = -1;
        } else if (this.cursors.down.isDown || this.keys.S.isDown) {
            vertical = 1;
        }

        return vertical;
    }

    /**
     * Check if jump is pressed
     */
    isJumpPressed() {
        return Phaser.Input.Keyboard.JustDown(this.cursors.up) ||
               Phaser.Input.Keyboard.JustDown(this.keys.SPACE) ||
               Phaser.Input.Keyboard.JustDown(this.keys.W);
    }

    /**
     * Check if action is pressed
     */
    isActionPressed() {
        return Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    }

    destroy() {
        // Keys are automatically cleaned up by Phaser
    }
}
