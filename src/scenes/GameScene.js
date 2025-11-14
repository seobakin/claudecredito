import Phaser from 'phaser';
import GameConfig from '../engine/GameConfig.js';
import Entity from '../ecs/Entity.js';
import SpriteComponent from '../components/SpriteComponent.js';
import PhysicsComponent from '../components/PhysicsComponent.js';
import InputComponent from '../components/InputComponent.js';
import HealthComponent from '../components/HealthComponent.js';
import EventBus from '../utils/EventBus.js';
import AudioManager from '../utils/AudioManager.js';
import SaveManager from '../utils/SaveManager.js';

/**
 * GameScene - Main gameplay scene
 * Demonstrates ECS architecture with a simple platformer
 */
export default class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Initialize managers
        this.audioManager = new AudioManager(this);
        this.entities = [];
        this.score = 0;
        this.gameOver = false;

        // Setup world
        this.physics.world.setBounds(0, 0, width, height);

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x87CEEB);

        // Create ground platforms
        this.createPlatforms();

        // Create player using ECS
        this.player = this.createPlayer(200, height - 200);
        this.entities.push(this.player);

        // Create collectibles
        this.createCollectibles();

        // Create enemies
        this.createEnemies();

        // Setup UI
        this.createUI();

        // Event listeners
        this.setupEventListeners();

        // Camera follow player
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        this.cameras.main.startFollow(playerSprite, true, 0.1, 0.1);
        this.cameras.main.setZoom(1);

        // ESC to return to menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    createPlatforms() {
        const { width, height } = this.cameras.main;
        this.platforms = this.physics.add.staticGroup();

        // Ground
        const ground = this.add.rectangle(width / 2, height - 30, width, 60, 0x228B22);
        this.platforms.add(ground);

        // Floating platforms
        const platform1 = this.add.rectangle(400, height - 200, 200, 30, 0x8B4513);
        this.platforms.add(platform1);

        const platform2 = this.add.rectangle(800, height - 350, 200, 30, 0x8B4513);
        this.platforms.add(platform2);

        const platform3 = this.add.rectangle(1200, height - 250, 200, 30, 0x8B4513);
        this.platforms.add(platform3);

        const platform4 = this.add.rectangle(1600, height - 400, 200, 30, 0x8B4513);
        this.platforms.add(platform4);
    }

    createPlayer(x, y) {
        const player = new Entity(this, x, y);
        player.addTag('player');

        // Add sprite component
        const sprite = new SpriteComponent(this, null, null, {
            width: 40,
            height: 60,
            color: GameConfig.COLORS.PRIMARY,
            depth: GameConfig.DEPTH.PLAYER
        });
        sprite.init();
        player.addComponent(sprite);

        // Add physics
        const physics = new PhysicsComponent(this, {
            width: 40,
            height: 60,
            bounce: 0.1,
            collideWorldBounds: true
        });
        physics.init();
        player.addComponent(physics);

        // Add input
        const input = new InputComponent(this);
        input.init();
        player.addComponent(input);

        // Add health
        const health = new HealthComponent(3);
        player.addComponent(health);

        // Setup collisions
        this.physics.add.collider(sprite.sprite, this.platforms);

        return player;
    }

    createCollectibles() {
        this.collectibles = this.physics.add.group();

        const positions = [
            [400, 400],
            [800, 300],
            [1200, 350],
            [1600, 250],
            [600, 500]
        ];

        positions.forEach(([x, y]) => {
            const collectible = this.add.circle(x, y, 15, 0xFFD700);
            this.physics.add.existing(collectible);
            collectible.body.setAllowGravity(false);
            this.collectibles.add(collectible);

            // Floating animation
            this.tweens.add({
                targets: collectible,
                y: y - 20,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });

        // Collision with player
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        this.physics.add.overlap(playerSprite, this.collectibles, this.collectItem, null, this);
    }

    createEnemies() {
        this.enemies = this.physics.add.group();

        const enemyPositions = [
            [600, 400],
            [1000, 300],
            [1400, 350]
        ];

        enemyPositions.forEach(([x, y]) => {
            const enemy = this.add.rectangle(x, y, 40, 40, 0xFF0000);
            this.physics.add.existing(enemy);
            enemy.body.setCollideWorldBounds(true);
            enemy.body.setBounce(1, 0);
            enemy.body.setVelocityX(Phaser.Math.Between(-100, 100));
            this.enemies.add(enemy);

            this.physics.add.collider(enemy, this.platforms);
        });

        // Collision with player
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        this.physics.add.overlap(playerSprite, this.enemies, this.hitEnemy, null, this);
    }

    createUI() {
        const { width } = this.cameras.main;

        // Score text
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(GameConfig.DEPTH.UI);

        // Health text
        this.healthText = this.add.text(20, 60, 'Health: 3', {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(GameConfig.DEPTH.UI);

        // Instructions
        this.add.text(width - 20, 20, 'ESC: Menu', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(1, 0).setScrollFactor(0).setDepth(GameConfig.DEPTH.UI);
    }

    setupEventListeners() {
        EventBus.on('entity:died', (data) => {
            if (data.entity === this.player) {
                this.endGame(false);
            }
        });

        EventBus.on('health:changed', (data) => {
            if (data.entity === this.player) {
                this.healthText.setText(`Health: ${data.current}`);
            }
        });
    }

    collectItem(playerSprite, collectible) {
        collectible.destroy();
        this.score += 100;
        this.scoreText.setText(`Score: ${this.score}`);

        // Check win condition
        if (this.collectibles.countActive() === 0) {
            this.endGame(true);
        }
    }

    hitEnemy(playerSprite, enemy) {
        const health = this.player.getComponent(HealthComponent);

        if (!health.invulnerable) {
            health.takeDamage(1);
            health.makeInvulnerable(2000);

            // Flash effect
            this.tweens.add({
                targets: playerSprite,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 10
            });

            // Knockback
            const physics = this.player.getComponent(PhysicsComponent);
            const knockbackX = playerSprite.x < enemy.x ? -300 : 300;
            physics.setVelocity(knockbackX, -200);
        }
    }

    endGame(won) {
        if (this.gameOver) return;
        this.gameOver = true;

        // Save high score
        const highScore = SaveManager.load('highScore', 0);
        if (this.score > highScore) {
            SaveManager.save('highScore', this.score);
        }

        // Transition to game over
        this.time.delayedCall(500, () => {
            this.scene.start('GameOverScene', { won, score: this.score });
        });
    }

    update(time, delta) {
        if (this.gameOver) return;

        // Update all entities
        for (const entity of this.entities) {
            entity.update(delta);
        }

        // Player movement
        const input = this.player.getComponent(InputComponent);
        const physics = this.player.getComponent(PhysicsComponent);
        const sprite = this.player.getComponent(SpriteComponent).sprite;

        // Horizontal movement
        const horizontal = input.getHorizontal();
        physics.setVelocityX(horizontal * GameConfig.PLAYER_SPEED);

        // Jump
        if (input.isJumpPressed() && sprite.body.touching.down) {
            physics.setVelocityY(GameConfig.PLAYER_JUMP);
        }

        // Visual feedback
        if (horizontal !== 0) {
            sprite.setFlipX(horizontal < 0);
        }
    }
}
