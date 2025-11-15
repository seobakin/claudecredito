import Component from '../ecs/Component.js';
import EventBus from '../utils/EventBus.js';

/**
 * PlayerComponent - Advanced player controller with multiple abilities
 */
export default class PlayerComponent extends Component {
    constructor(scene) {
        super();
        this.scene = scene;

        // Movement stats
        this.speed = 300;
        this.jumpPower = -550;
        this.wallSlideSpeed = 100;
        this.dashSpeed = 800;
        this.dashDuration = 200;

        // State
        this.canDoubleJump = false;
        this.hasDoubleJumped = false;
        this.canWallJump = true;
        this.canDash = true;
        this.isDashing = false;
        this.dashTimer = 0;
        this.dashCooldown = 0;
        this.dashCooldownMax = 500;

        // Wall jump detection
        this.isTouchingWall = false;
        this.wallDirection = 0;

        // Coyote time (grace period for jumping after leaving platform)
        this.coyoteTime = 100;
        this.coyoteTimer = 0;
        this.wasGrounded = false;

        // Jump buffering
        this.jumpBuffer = 100;
        this.jumpBufferTimer = 0;

        // Power-ups
        this.powerUps = {
            doubleJump: false,
            speedBoost: false,
            shield: false,
            dash: false
        };

        // Combo system
        this.combo = 0;
        this.comboTimer = 0;
        this.comboTimeMax = 2000;
    }

    update(delta) {
        if (!this.entity) return;

        const physics = this.entity.getComponent(require('./PhysicsComponent.js').default);
        const input = this.entity.getComponent(require('./InputComponent.js').default);
        const sprite = this.entity.getComponent(require('./SpriteComponent.js').default);

        if (!physics || !physics.body || !input || !sprite) return;

        const body = physics.body;
        const isGrounded = body.touching.down || body.blocked.down;

        // Update coyote time
        if (isGrounded) {
            this.coyoteTimer = this.coyoteTime;
            this.hasDoubleJumped = false;
        } else if (this.coyoteTimer > 0) {
            this.coyoteTimer -= delta;
        }

        // Update jump buffer
        if (this.jumpBufferTimer > 0) {
            this.jumpBufferTimer -= delta;
        }

        // Detect wall touching
        this.isTouchingWall = body.touching.left || body.touching.right;
        this.wallDirection = body.touching.left ? -1 : body.touching.right ? 1 : 0;

        // Horizontal movement
        const horizontal = input.getHorizontal();

        if (!this.isDashing) {
            const moveSpeed = this.powerUps.speedBoost ? this.speed * 1.5 : this.speed;

            // Wall slide
            if (this.isTouchingWall && !isGrounded && body.velocity.y > 0 && this.canWallJump) {
                body.setVelocityY(Math.min(body.velocity.y, this.wallSlideSpeed));

                // Wall jump visual feedback
                if (Math.random() < 0.3) {
                    EventBus.emit('particle:spawn', {
                        x: this.entity.x + (this.wallDirection * 20),
                        y: this.entity.y + Math.random() * 30 - 15,
                        color: 0xCCCCCC,
                        count: 1
                    });
                }
            }

            body.setVelocityX(horizontal * moveSpeed);

            // Flip sprite based on direction
            if (horizontal !== 0) {
                sprite.sprite.setFlipX(horizontal < 0);
            }
        }

        // Jump buffering - store jump input
        if (input.isJumpPressed()) {
            this.jumpBufferTimer = this.jumpBuffer;
        }

        // Jump logic
        if (this.jumpBufferTimer > 0) {
            // Ground jump or coyote time
            if (this.coyoteTimer > 0) {
                this.performJump(body);
                this.jumpBufferTimer = 0;
            }
            // Wall jump
            else if (this.isTouchingWall && this.canWallJump && !isGrounded) {
                this.performWallJump(body);
                this.jumpBufferTimer = 0;
            }
            // Double jump
            else if (!this.hasDoubleJumped && this.powerUps.doubleJump && !isGrounded) {
                this.performDoubleJump(body);
                this.jumpBufferTimer = 0;
            }
        }

        // Dash
        if (this.isDashing) {
            this.dashTimer -= delta;
            if (this.dashTimer <= 0) {
                this.isDashing = false;
                body.setDragX(1000); // Add drag to slow down after dash

                // Reset drag after a moment
                this.scene.time.delayedCall(100, () => {
                    if (body) body.setDragX(0);
                });
            }
        } else {
            // Update dash cooldown
            if (this.dashCooldown > 0) {
                this.dashCooldown -= delta;
            }

            // Trigger dash
            if (input.keys.SHIFT && input.keys.SHIFT.isDown &&
                this.dashCooldown <= 0 && this.powerUps.dash && horizontal !== 0) {
                this.performDash(body, horizontal);
            }
        }

        // Update combo timer
        if (this.combo > 0) {
            this.comboTimer -= delta;
            if (this.comboTimer <= 0) {
                this.combo = 0;
                EventBus.emit('combo:ended');
            }
        }

        // Variable jump height (release jump early for shorter jump)
        if (body.velocity.y < 0 && !input.cursors.up.isDown &&
            !input.keys.W.isDown && !input.keys.SPACE.isDown) {
            body.setVelocityY(body.velocity.y * 0.5);
        }

        // Create run particles
        if (isGrounded && Math.abs(horizontal) > 0 && Math.random() < 0.2) {
            EventBus.emit('particle:spawn', {
                x: this.entity.x,
                y: this.entity.y + 25,
                color: 0x8B4513,
                count: 1,
                velocityY: -50,
                velocityX: -horizontal * 50
            });
        }

        this.wasGrounded = isGrounded;
    }

    performJump(body) {
        body.setVelocityY(this.jumpPower);
        this.coyoteTimer = 0;

        EventBus.emit('player:jump', { type: 'normal' });
        EventBus.emit('particle:spawn', {
            x: this.entity.x,
            y: this.entity.y + 30,
            color: 0xCCCCCC,
            count: 5
        });
        EventBus.emit('sfx:play', { type: 'jump' });
    }

    performWallJump(body) {
        const jumpAwayPower = 400;
        body.setVelocityY(this.jumpPower * 0.9);
        body.setVelocityX(-this.wallDirection * jumpAwayPower);

        EventBus.emit('player:jump', { type: 'wall' });
        EventBus.emit('particle:spawn', {
            x: this.entity.x + (this.wallDirection * 20),
            y: this.entity.y,
            color: 0x4CAF50,
            count: 8,
            velocityX: this.wallDirection * 100
        });
        EventBus.emit('sfx:play', { type: 'wallJump' });
        EventBus.emit('camera:shake', { intensity: 2 });
    }

    performDoubleJump(body) {
        body.setVelocityY(this.jumpPower * 0.85);
        this.hasDoubleJumped = true;

        EventBus.emit('player:jump', { type: 'double' });
        EventBus.emit('particle:spawn', {
            x: this.entity.x,
            y: this.entity.y,
            color: 0xFFD700,
            count: 12,
            spread: true
        });
        EventBus.emit('sfx:play', { type: 'doubleJump' });
    }

    performDash(body, direction) {
        this.isDashing = true;
        this.dashTimer = this.dashDuration;
        this.dashCooldown = this.dashCooldownMax;

        body.setVelocityX(direction * this.dashSpeed);
        body.setVelocityY(0);
        body.setDragX(0);

        EventBus.emit('player:dash', { direction });
        EventBus.emit('particle:spawn', {
            x: this.entity.x,
            y: this.entity.y,
            color: 0x2196F3,
            count: 15,
            trail: true,
            velocityX: -direction * 100
        });
        EventBus.emit('sfx:play', { type: 'dash' });
        EventBus.emit('camera:shake', { intensity: 3 });
    }

    addPowerUp(type) {
        if (this.powerUps.hasOwnProperty(type)) {
            this.powerUps[type] = true;
            EventBus.emit('powerup:acquired', { type });
            EventBus.emit('sfx:play', { type: 'powerup' });
        }
    }

    incrementCombo() {
        this.combo++;
        this.comboTimer = this.comboTimeMax;
        EventBus.emit('combo:increment', { combo: this.combo });
    }

    getComboMultiplier() {
        return 1 + (this.combo * 0.1);
    }
}
