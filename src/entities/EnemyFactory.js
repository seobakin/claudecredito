import Entity from '../ecs/Entity.js';
import SpriteComponent from '../components/SpriteComponent.js';
import PhysicsComponent from '../components/PhysicsComponent.js';
import HealthComponent from '../components/HealthComponent.js';
import EventBus from '../utils/EventBus.js';

/**
 * EnemyFactory - Creates different enemy types with unique behaviors
 */
export default class EnemyFactory {
    constructor(scene) {
        this.scene = scene;
    }

    /**
     * Patrol Enemy - Walks back and forth
     */
    createPatroller(x, y, platforms) {
        const enemy = new Entity(this.scene, x, y);
        enemy.addTag('enemy');
        enemy.enemyType = 'patroller';

        // Sprite
        const sprite = new SpriteComponent(this.scene, null, null, {
            width: 35,
            height: 35,
            color: 0xFF5722,
            depth: 30
        });
        sprite.init();
        enemy.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(this.scene, {
            width: 35,
            height: 35,
            bounce: 0,
            collideWorldBounds: false
        });
        physics.init();
        enemy.addComponent(physics);

        // Health
        const health = new HealthComponent(1);
        enemy.addComponent(health);

        // AI state
        enemy.aiState = {
            direction: 1,
            speed: 80,
            turnTimer: 0,
            turnDelay: 1000
        };

        // Collision with platforms
        this.scene.physics.add.collider(sprite.sprite, platforms);

        return enemy;
    }

    /**
     * Jumper Enemy - Jumps periodically
     */
    createJumper(x, y, platforms) {
        const enemy = new Entity(this.scene, x, y);
        enemy.addTag('enemy');
        enemy.enemyType = 'jumper';

        // Sprite
        const sprite = new SpriteComponent(this.scene, null, null, {
            width: 32,
            height: 40,
            color: 0x9C27B0,
            depth: 30
        });
        sprite.init();
        enemy.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(this.scene, {
            width: 32,
            height: 40,
            bounce: 0.2,
            collideWorldBounds: false
        });
        physics.init();
        enemy.addComponent(physics);

        // Health
        const health = new HealthComponent(2);
        enemy.addComponent(health);

        // AI state
        enemy.aiState = {
            jumpTimer: 0,
            jumpDelay: 1500,
            jumpPower: -400,
            direction: 1,
            speed: 50
        };

        // Collision
        this.scene.physics.add.collider(sprite.sprite, platforms);

        return enemy;
    }

    /**
     * Flyer Enemy - Flies in wave pattern
     */
    createFlyer(x, y) {
        const enemy = new Entity(this.scene, x, y);
        enemy.addTag('enemy');
        enemy.enemyType = 'flyer';

        // Sprite
        const sprite = new SpriteComponent(this.scene, null, null, {
            width: 30,
            height: 30,
            color: 0x03A9F4,
            depth: 30
        });
        sprite.init();
        enemy.addComponent(sprite);

        // Physics (no gravity for flyers)
        const physics = new PhysicsComponent(this.scene, {
            width: 30,
            height: 30,
            allowGravity: false
        });
        physics.init();
        enemy.addComponent(physics);

        // Health
        const health = new HealthComponent(1);
        enemy.addComponent(health);

        // AI state
        enemy.aiState = {
            direction: -1,
            speed: 120,
            waveAmplitude: 100,
            waveFrequency: 0.002,
            startY: y,
            time: 0
        };

        return enemy;
    }

    /**
     * Shooter Enemy - Shoots projectiles
     */
    createShooter(x, y, platforms) {
        const enemy = new Entity(this.scene, x, y);
        enemy.addTag('enemy');
        enemy.enemyType = 'shooter';

        // Sprite
        const sprite = new SpriteComponent(this.scene, null, null, {
            width: 40,
            height: 35,
            color: 0xF44336,
            depth: 30
        });
        sprite.init();
        enemy.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(this.scene, {
            width: 40,
            height: 35,
            immovable: true,
            allowGravity: true,
            bounce: 0
        });
        physics.init();
        enemy.addComponent(physics);

        // Health
        const health = new HealthComponent(3);
        enemy.addComponent(health);

        // AI state
        enemy.aiState = {
            shootTimer: 0,
            shootDelay: 2000,
            detectionRange: 400,
            projectiles: []
        };

        // Collision
        this.scene.physics.add.collider(sprite.sprite, platforms);

        return enemy;
    }

    /**
     * Tank Enemy - Slow, heavily armored
     */
    createTank(x, y, platforms) {
        const enemy = new Entity(this.scene, x, y);
        enemy.addTag('enemy');
        enemy.enemyType = 'tank';

        // Sprite
        const sprite = new SpriteComponent(this.scene, null, null, {
            width: 50,
            height: 50,
            color: 0x607D8B,
            depth: 30
        });
        sprite.init();
        enemy.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(this.scene, {
            width: 50,
            height: 50,
            bounce: 0,
            immovable: false
        });
        physics.init();
        enemy.addComponent(physics);

        // Health
        const health = new HealthComponent(5);
        enemy.addComponent(health);

        // AI state
        enemy.aiState = {
            direction: 1,
            speed: 40,
            chargeTimer: 0,
            chargeDelay: 3000,
            charging: false
        };

        // Collision
        this.scene.physics.add.collider(sprite.sprite, platforms);

        return enemy;
    }

    /**
     * Update enemy AI
     */
    updateEnemy(enemy, delta, player) {
        if (!enemy.active) return;

        const physics = enemy.getComponent(PhysicsComponent);
        const sprite = enemy.getComponent(SpriteComponent);

        if (!physics || !physics.body || !sprite) return;

        switch (enemy.enemyType) {
            case 'patroller':
                this.updatePatroller(enemy, delta, physics);
                break;
            case 'jumper':
                this.updateJumper(enemy, delta, physics, player);
                break;
            case 'flyer':
                this.updateFlyer(enemy, delta, physics);
                break;
            case 'shooter':
                this.updateShooter(enemy, delta, physics, player);
                break;
            case 'tank':
                this.updateTank(enemy, delta, physics, player);
                break;
        }

        // Create movement particles occasionally
        if (Math.random() < 0.05) {
            EventBus.emit('particle:trail', {
                x: enemy.x,
                y: enemy.y,
                color: sprite.options.color || 0xFFFFFF,
                count: 1
            });
        }
    }

    updatePatroller(enemy, delta, physics) {
        const state = enemy.aiState;
        const body = physics.body;

        // Move
        physics.setVelocityX(state.direction * state.speed);

        // Check if at edge or hit wall
        if (body.blocked.left || body.blocked.right) {
            state.direction *= -1;
        }

        // Random direction change
        state.turnTimer += delta;
        if (state.turnTimer >= state.turnDelay) {
            state.direction *= -1;
            state.turnTimer = 0;
        }
    }

    updateJumper(enemy, delta, physics, player) {
        const state = enemy.aiState;
        const body = physics.body;

        // Horizontal movement toward player if nearby
        if (player) {
            const distanceX = player.x - enemy.x;
            if (Math.abs(distanceX) < 300) {
                state.direction = distanceX > 0 ? 1 : -1;
            }
        }

        physics.setVelocityX(state.direction * state.speed);

        // Jump periodically if grounded
        state.jumpTimer += delta;
        if (state.jumpTimer >= state.jumpDelay && body.touching.down) {
            physics.setVelocityY(state.jumpPower);
            state.jumpTimer = 0;

            EventBus.emit('particle:spawn', {
                x: enemy.x,
                y: enemy.y + 20,
                color: 0x9C27B0,
                count: 5
            });
        }
    }

    updateFlyer(enemy, delta, physics) {
        const state = enemy.aiState;

        // Move horizontally
        physics.setVelocityX(state.direction * state.speed);

        // Wave motion
        state.time += delta;
        const waveOffset = Math.sin(state.time * state.waveFrequency) * state.waveAmplitude;
        const targetY = state.startY + waveOffset;

        physics.setVelocityY((targetY - enemy.y) * 2);

        // Turn around at world bounds
        if (enemy.x < 100 || enemy.x > this.scene.cameras.main.width - 100) {
            state.direction *= -1;
        }
    }

    updateShooter(enemy, delta, physics, player) {
        const state = enemy.aiState;

        if (!player) return;

        const distance = Phaser.Math.Distance.Between(enemy.x, enemy.y, player.x, player.y);

        // Shoot at player if in range
        if (distance < state.detectionRange) {
            state.shootTimer += delta;

            if (state.shootTimer >= state.shootDelay) {
                this.shootProjectile(enemy, player);
                state.shootTimer = 0;
            }
        }
    }

    shootProjectile(enemy, player) {
        const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, player.x, player.y);
        const speed = 300;

        const projectile = this.scene.add.circle(enemy.x, enemy.y, 6, 0xFFFF00);
        this.scene.physics.add.existing(projectile);
        projectile.body.setAllowGravity(false);
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );

        enemy.aiState.projectiles.push(projectile);

        // Auto-destroy after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            if (projectile) projectile.destroy();
        });

        EventBus.emit('sfx:play', { type: 'enemyShoot' });
    }

    updateTank(enemy, delta, physics, player) {
        const state = enemy.aiState;

        if (!player) return;

        const distanceX = player.x - enemy.x;

        // Charge at player periodically
        state.chargeTimer += delta;

        if (!state.charging) {
            physics.setVelocityX(state.direction * state.speed);

            if (state.chargeTimer >= state.chargeDelay && Math.abs(distanceX) < 400) {
                state.charging = true;
                state.direction = distanceX > 0 ? 1 : -1;
                state.chargeTimer = 0;

                EventBus.emit('camera:shake', { intensity: 3, duration: 100 });
            }
        } else {
            // Charging
            physics.setVelocityX(state.direction * state.speed * 4);

            if (state.chargeTimer >= 1000) {
                state.charging = false;
                state.chargeTimer = 0;
            }
        }
    }
}
