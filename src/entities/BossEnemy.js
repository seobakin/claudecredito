import Entity from '../ecs/Entity.js';
import SpriteComponent from '../components/SpriteComponent.js';
import PhysicsComponent from '../components/PhysicsComponent.js';
import HealthComponent from '../components/HealthComponent.js';
import EventBus from '../utils/EventBus.js';

/**
 * BossEnemy - Epic boss battle
 */
export default class BossEnemy {
    constructor(scene, x, y, platforms) {
        this.scene = scene;
        this.entity = new Entity(scene, x, y);
        this.entity.addTag('boss');

        // Create boss sprite (large and intimidating)
        const sprite = new SpriteComponent(scene, null, null, {
            width: 100,
            height: 120,
            color: 0x4A148C,
            depth: 35
        });
        sprite.init();
        this.entity.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(scene, {
            width: 100,
            height: 120,
            immovable: false,
            bounce: 0
        });
        physics.init();
        this.entity.addComponent(physics);

        // Lots of health
        const health = new HealthComponent(30);
        this.entity.addComponent(health);

        // Boss AI state
        this.phase = 1;
        this.currentAttack = null;
        this.attackTimer = 0;
        this.moveTimer = 0;
        this.isVulnerable = true;
        this.projectiles = [];

        // Attack patterns
        this.attacks = {
            phase1: ['shoot', 'jump', 'charge'],
            phase2: ['tripleShoot', 'dashAttack', 'groundPound'],
            phase3: ['bulletSpiral', 'rapidDash', 'meteorShower']
        };

        // Collision
        scene.physics.add.collider(sprite.sprite, platforms);

        // Visual crown to show it's a boss
        this.createCrown();

        // Boss music/event
        EventBus.emit('boss:spawned');

        // Listen for health changes
        EventBus.on('health:changed', this.onHealthChanged, this);
    }

    createCrown() {
        const sprite = this.entity.getComponent(SpriteComponent).sprite;

        // Simple crown visual
        const crown = this.scene.add.text(0, -70, '♕', {
            fontSize: '40px',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        crown.setOrigin(0.5);
        sprite.add(crown);

        // Make it pulse
        this.scene.tweens.add({
            targets: crown,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    onHealthChanged(data) {
        if (data.entity !== this.entity) return;

        const healthPercent = data.current / data.max;

        // Phase transitions
        if (healthPercent <= 0.66 && this.phase === 1) {
            this.enterPhase2();
        } else if (healthPercent <= 0.33 && this.phase === 2) {
            this.enterPhase3();
        }

        // Flash on hit
        const sprite = this.entity.getComponent(SpriteComponent).sprite;
        this.scene.tweens.add({
            targets: sprite,
            alpha: 0.5,
            duration: 100,
            yoyo: true,
            repeat: 2
        });

        // Particle effect
        EventBus.emit('particle:spawn', {
            x: this.entity.x,
            y: this.entity.y,
            color: 0x9C27B0,
            count: 10,
            spread: true
        });
    }

    enterPhase2() {
        this.phase = 2;
        EventBus.emit('boss:phase', { phase: 2 });
        EventBus.emit('camera:shake', { intensity: 10, duration: 500 });
        EventBus.emit('particle:explosion', {
            x: this.entity.x,
            y: this.entity.y,
            color: 0xFF5722,
            count: 50,
            speed: 300
        });

        // Change color to indicate phase change
        const sprite = this.entity.getComponent(SpriteComponent).sprite;
        this.scene.tweens.add({
            targets: sprite,
            fillColor: { from: 0x4A148C, to: 0xE91E63 },
            duration: 1000
        });
    }

    enterPhase3() {
        this.phase = 3;
        EventBus.emit('boss:phase', { phase: 3 });
        EventBus.emit('camera:shake', { intensity: 15, duration: 800 });
        EventBus.emit('particle:explosion', {
            x: this.entity.x,
            y: this.entity.y,
            color: 0xF44336,
            count: 80,
            speed: 400
        });

        // Final form color
        const sprite = this.entity.getComponent(SpriteComponent).sprite;
        this.scene.tweens.add({
            targets: sprite,
            fillColor: { from: 0xE91E63, to: 0xF44336 },
            duration: 1000
        });
    }

    update(delta, player) {
        if (!this.entity.active) return;

        const physics = this.entity.getComponent(PhysicsComponent);
        if (!physics || !physics.body) return;

        this.attackTimer += delta;
        this.moveTimer += delta;

        // Select attack pattern based on phase
        const phaseKey = `phase${this.phase}`;
        const availableAttacks = this.attacks[phaseKey];

        // Choose new attack
        if (!this.currentAttack && this.attackTimer >= 2000) {
            this.currentAttack = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
            this.performAttack(player);
            this.attackTimer = 0;
        }

        // Move toward player
        if (player && this.moveTimer >= 100 && !this.currentAttack) {
            const distanceX = player.x - this.entity.x;

            if (Math.abs(distanceX) > 150) {
                const direction = distanceX > 0 ? 1 : -1;
                physics.setVelocityX(direction * 100);
            } else {
                physics.setVelocityX(0);
            }

            this.moveTimer = 0;
        }

        // Update projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const proj = this.projectiles[i];
            if (!proj || !proj.active) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    performAttack(player) {
        if (!player) return;

        switch (this.currentAttack) {
            case 'shoot':
                this.attackShoot(player);
                break;
            case 'tripleShoot':
                this.attackTripleShoot(player);
                break;
            case 'bulletSpiral':
                this.attackBulletSpiral();
                break;
            case 'charge':
                this.attackCharge(player);
                break;
            case 'dashAttack':
                this.attackDash(player);
                break;
            case 'rapidDash':
                this.attackRapidDash(player);
                break;
            case 'jump':
                this.attackJump();
                break;
            case 'groundPound':
                this.attackGroundPound();
                break;
            case 'meteorShower':
                this.attackMeteorShower();
                break;
        }
    }

    attackShoot(player) {
        const angle = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, player.x, player.y);
        this.createProjectile(this.entity.x, this.entity.y, angle, 250);

        this.scene.time.delayedCall(500, () => {
            this.currentAttack = null;
        });
    }

    attackTripleShoot(player) {
        const baseAngle = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, player.x, player.y);
        const spread = 0.3;

        this.createProjectile(this.entity.x, this.entity.y, baseAngle - spread, 300);
        this.createProjectile(this.entity.x, this.entity.y, baseAngle, 300);
        this.createProjectile(this.entity.x, this.entity.y, baseAngle + spread, 300);

        this.scene.time.delayedCall(800, () => {
            this.currentAttack = null;
        });
    }

    attackBulletSpiral() {
        let count = 0;
        const timer = this.scene.time.addEvent({
            delay: 100,
            repeat: 15,
            callback: () => {
                const angle = (count * Math.PI * 2) / 8;
                this.createProjectile(this.entity.x, this.entity.y, angle, 200);
                count++;
            }
        });

        this.scene.time.delayedCall(1800, () => {
            this.currentAttack = null;
        });
    }

    attackCharge(player) {
        const physics = this.entity.getComponent(PhysicsComponent);
        const direction = player.x > this.entity.x ? 1 : -1;

        physics.setVelocityX(direction * 500);

        EventBus.emit('camera:shake', { intensity: 5, duration: 200 });

        this.scene.time.delayedCall(800, () => {
            physics.setVelocityX(0);
            this.currentAttack = null;
        });
    }

    attackDash(player) {
        this.attackCharge(player);

        this.scene.time.delayedCall(1000, () => {
            if (player) {
                const angle = Phaser.Math.Angle.Between(this.entity.x, this.entity.y, player.x, player.y);
                this.createProjectile(this.entity.x, this.entity.y, angle, 350);
            }
        });
    }

    attackRapidDash(player) {
        let dashCount = 0;
        const dashTimer = this.scene.time.addEvent({
            delay: 600,
            repeat: 3,
            callback: () => {
                if (player) {
                    const direction = player.x > this.entity.x ? 1 : -1;
                    const physics = this.entity.getComponent(PhysicsComponent);
                    physics.setVelocityX(direction * 600);

                    this.scene.time.delayedCall(300, () => {
                        physics.setVelocityX(0);
                    });
                }
                dashCount++;
            }
        });

        this.scene.time.delayedCall(2800, () => {
            this.currentAttack = null;
        });
    }

    attackJump() {
        const physics = this.entity.getComponent(PhysicsComponent);
        physics.setVelocityY(-600);

        EventBus.emit('particle:spawn', {
            x: this.entity.x,
            y: this.entity.y + 60,
            color: 0x9C27B0,
            count: 15,
            spread: true
        });

        this.scene.time.delayedCall(1000, () => {
            this.currentAttack = null;
        });
    }

    attackGroundPound() {
        const physics = this.entity.getComponent(PhysicsComponent);
        physics.setVelocityY(-700);

        this.scene.time.delayedCall(500, () => {
            physics.setVelocityY(1000);
        });

        // Shockwave on landing
        const checkLanding = this.scene.time.addEvent({
            delay: 100,
            repeat: 20,
            callback: () => {
                if (physics.body && physics.body.touching.down) {
                    EventBus.emit('camera:shake', { intensity: 12, duration: 400 });
                    EventBus.emit('particle:explosion', {
                        x: this.entity.x,
                        y: this.entity.y + 60,
                        color: 0xE91E63,
                        count: 40,
                        speed: 400
                    });

                    checkLanding.destroy();
                    this.scene.time.delayedCall(500, () => {
                        this.currentAttack = null;
                    });
                }
            }
        });
    }

    attackMeteorShower() {
        for (let i = 0; i < 10; i++) {
            this.scene.time.delayedCall(i * 200, () => {
                const x = this.entity.x + (Math.random() - 0.5) * 600;
                const y = 100;
                const meteor = this.scene.add.circle(x, y, 8, 0xFF5722);
                this.scene.physics.add.existing(meteor);
                meteor.body.setVelocityY(400);
                meteor.isMeteor = true;

                this.projectiles.push(meteor);
            });
        }

        this.scene.time.delayedCall(2500, () => {
            this.currentAttack = null;
        });
    }

    createProjectile(x, y, angle, speed) {
        const projectile = this.scene.add.circle(x, y, 8, 0xFF00FF);
        this.scene.physics.add.existing(projectile);
        projectile.body.setAllowGravity(false);
        projectile.body.setVelocity(
            Math.cos(angle) * speed,
            Math.sin(angle) * speed
        );
        projectile.isBossProjectile = true;

        this.projectiles.push(projectile);

        // Particle trail
        const trailTimer = this.scene.time.addEvent({
            delay: 50,
            repeat: -1,
            callback: () => {
                if (projectile.active) {
                    EventBus.emit('particle:trail', {
                        x: projectile.x,
                        y: projectile.y,
                        color: 0xFF00FF,
                        count: 2
                    });
                } else {
                    trailTimer.destroy();
                }
            }
        });

        // Auto-destroy
        this.scene.time.delayedCall(5000, () => {
            if (projectile) projectile.destroy();
        });

        return projectile;
    }

    getProjectiles() {
        return this.projectiles.filter(p => p && p.active);
    }

    destroy() {
        EventBus.off('health:changed', this.onHealthChanged);

        for (const proj of this.projectiles) {
            if (proj) proj.destroy();
        }
        this.projectiles = [];

        if (this.entity) {
            this.entity.destroy();
        }
    }
}
