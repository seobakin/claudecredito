import Phaser from 'phaser';
import Entity from '../ecs/Entity.js';
import SpriteComponent from '../components/SpriteComponent.js';
import PhysicsComponent from '../components/PhysicsComponent.js';
import InputComponent from '../components/InputComponent.js';
import HealthComponent from '../components/HealthComponent.js';
import PlayerComponent from '../components/PlayerComponent.js';
import EventBus from '../utils/EventBus.js';
import ProceduralAudio from '../utils/ProceduralAudio.js';
import SaveManager from '../utils/SaveManager.js';
import ParticleSystem from '../systems/ParticleSystem.js';
import CameraSystem from '../systems/CameraSystem.js';
import EnemyFactory from '../entities/EnemyFactory.js';
import PowerUpFactory from '../entities/PowerUpFactory.js';
import BossEnemy from '../entities/BossEnemy.js';
import LEVELS from '../data/LevelData.js';

/**
 * AdvancedGameScene - Complete platformer with all features
 */
export default class AdvancedGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AdvancedGameScene' });
    }

    init(data) {
        this.currentLevelId = data.levelId || 1;
    }

    create() {
        // Load current level data
        this.levelData = LEVELS.find(l => l.id === this.currentLevelId);
        if (!this.levelData) this.levelData = LEVELS[0];

        // Initialize systems
        this.proceduralAudio = new ProceduralAudio();
        this.particleSystem = new ParticleSystem(this);
        this.cameraSystem = new CameraSystem(this);
        this.enemyFactory = new EnemyFactory(this);
        this.powerUpFactory = new PowerUpFactory(this);

        // Game state
        this.entities = [];
        this.enemies = [];
        this.powerUps = [];
        this.coins = [];
        this.score = 0;
        this.coinsCollected = 0;
        this.combo = 0;
        this.gameOver = false;
        this.levelComplete = false;
        this.boss = null;

        // Setup world
        this.physics.world.setBounds(0, 0, this.levelData.width, this.levelData.height);

        // Create background with gradient
        this.createBackground();

        // Create platforms
        this.createPlatforms();

        // Create player
        this.createPlayer();

        // Create level content
        this.createEnemies();
        this.createPowerUps();
        this.createCoins();
        this.createExitDoor();

        // Boss if applicable
        if (this.levelData.hasBoss) {
            this.time.delayedCall(2000, () => this.createBoss());
        }

        // Setup UI
        this.createUI();

        // Setup camera
        this.setupCamera();

        // Event listeners
        this.setupEventListeners();

        // ESC to pause/menu
        this.input.keyboard.on('keydown-ESC', () => {
            this.scene.pause();
            this.scene.launch('PauseScene');
        });

        // Level intro
        this.showLevelIntro();
    }

    createBackground() {
        const { width, height } = { width: this.levelData.width, height: this.levelData.height };

        // Gradient background
        const skyTop = this.currentLevelId === 3 ? 0x0D47A1 : 0x87CEEB;
        const skyBottom = this.currentLevelId === 3 ? 0x1976D2 : 0xE1F5FE;

        const gradient = this.add.graphics();
        gradient.fillGradientStyle(skyTop, skyTop, skyBottom, skyBottom, 1);
        gradient.fillRect(0, 0, width, height);
        gradient.setDepth(0);

        // Add clouds/stars
        if (this.currentLevelId === 3) {
            for (let i = 0; i < 50; i++) {
                const star = this.add.circle(
                    Math.random() * width,
                    Math.random() * height * 0.6,
                    1 + Math.random() * 2,
                    0xFFFFFF,
                    0.7 + Math.random() * 0.3
                );
                star.setScrollFactor(0.1);
            }
        } else {
            for (let i = 0; i < 10; i++) {
                const cloud = this.add.ellipse(
                    Math.random() * width,
                    Math.random() * 300,
                    60 + Math.random() * 40,
                    30 + Math.random() * 20,
                    0xFFFFFF,
                    0.7
                );
                cloud.setScrollFactor(0.3 + Math.random() * 0.2);
            }
        }
    }

    createPlatforms() {
        this.platforms = this.physics.add.staticGroup();

        this.levelData.platforms.forEach(platform => {
            const rect = this.add.rectangle(
                platform.x,
                platform.y,
                platform.width,
                platform.height,
                platform.height > 50 ? 0x228B22 : 0x8B4513
            );
            this.platforms.add(rect);

            // Add some visual detail to platforms
            if (platform.width > 100 && Math.random() < 0.5) {
                const decoration = this.add.circle(
                    platform.x + (Math.random() - 0.5) * platform.width * 0.8,
                    platform.y - platform.height / 2 - 5,
                    3,
                    0x4CAF50
                );
            }
        });
    }

    createPlayer() {
        const { x, y } = this.levelData.playerStart;

        this.player = new Entity(this, x, y);
        this.player.addTag('player');

        // Sprite
        const sprite = new SpriteComponent(this, null, null, {
            width: 40,
            height: 60,
            color: 0x4CAF50,
            depth: 40
        });
        sprite.init();
        this.player.addComponent(sprite);

        // Physics
        const physics = new PhysicsComponent(this, {
            width: 40,
            height: 60,
            bounce: 0.1,
            collideWorldBounds: true
        });
        physics.init();
        this.player.addComponent(physics);

        // Input
        const input = new InputComponent(this);
        input.init();
        this.player.addComponent(input);

        // Advanced player controller
        const playerComp = new PlayerComponent(this);
        this.player.addComponent(playerComp);

        // Health
        const health = new HealthComponent(5);
        this.player.addComponent(health);

        // Collisions
        this.physics.add.collider(sprite.sprite, this.platforms);

        this.entities.push(this.player);
    }

    createEnemies() {
        this.levelData.enemies.forEach(enemyData => {
            let enemy;

            switch (enemyData.type) {
                case 'patroller':
                    enemy = this.enemyFactory.createPatroller(enemyData.x, enemyData.y, this.platforms);
                    break;
                case 'jumper':
                    enemy = this.enemyFactory.createJumper(enemyData.x, enemyData.y, this.platforms);
                    break;
                case 'flyer':
                    enemy = this.enemyFactory.createFlyer(enemyData.x, enemyData.y);
                    break;
                case 'shooter':
                    enemy = this.enemyFactory.createShooter(enemyData.x, enemyData.y, this.platforms);
                    break;
                case 'tank':
                    enemy = this.enemyFactory.createTank(enemyData.x, enemyData.y, this.platforms);
                    break;
            }

            if (enemy) {
                this.enemies.push(enemy);
                this.entities.push(enemy);

                // Setup collision with player
                const enemySprite = enemy.getComponent(SpriteComponent).sprite;
                const playerSprite = this.player.getComponent(SpriteComponent).sprite;

                this.physics.add.overlap(playerSprite, enemySprite, () => {
                    this.handlePlayerEnemyCollision(enemy);
                });
            }
        });
    }

    createPowerUps() {
        this.levelData.powerUps.forEach(powerUpData => {
            const powerUp = this.powerUpFactory.createPowerUp(
                powerUpData.x,
                powerUpData.y,
                powerUpData.type
            );

            this.powerUps.push(powerUp);

            const playerSprite = this.player.getComponent(SpriteComponent).sprite;
            this.physics.add.overlap(playerSprite, powerUp, () => {
                this.powerUpFactory.collectPowerUp(powerUp, this.player);
            });
        });
    }

    createCoins() {
        this.levelData.coins.forEach(coinData => {
            const coin = this.powerUpFactory.createCoin(coinData.x, coinData.y);
            this.coins.push(coin);

            const playerSprite = this.player.getComponent(SpriteComponent).sprite;
            this.physics.add.overlap(playerSprite, coin, () => {
                this.powerUpFactory.collectCoin(coin, this.player);
            });
        });
    }

    createExitDoor() {
        const { x, y } = this.levelData.exitDoor;

        // Visual door
        const door = this.add.rectangle(x, y, 60, 100, 0x00BCD4);
        this.physics.add.existing(door);
        door.body.setAllowGravity(false);
        door.body.setImmovable(true);
        this.exitDoor = door;

        // Door glow
        const glow = this.add.circle(x, y, 50, 0x00BCD4, 0.3);
        this.tweens.add({
            targets: glow,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });

        // Label
        const label = this.add.text(x, y - 70, '>>> EXIT >>>', {
            fontSize: '20px',
            color: '#00BCD4',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        label.setOrigin(0.5);

        this.tweens.add({
            targets: label,
            alpha: 0.5,
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // Collision
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        this.physics.add.overlap(playerSprite, door, () => {
            this.completeLevel();
        });
    }

    createBoss() {
        const { x, y } = this.levelData.bossPosition;
        this.boss = new BossEnemy(this, x, y, this.platforms);

        // Player collision with boss
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        const bossSprite = this.boss.entity.getComponent(SpriteComponent).sprite;

        this.physics.add.overlap(playerSprite, bossSprite, () => {
            this.handlePlayerEnemyCollision(this.boss.entity);
        });

        EventBus.emit('camera:shake', { intensity: 15, duration: 1000 });

        // Show boss health bar
        this.createBossHealthBar();
    }

    createBossHealthBar() {
        const barWidth = 600;
        const barHeight = 30;
        const x = this.cameras.main.width / 2;
        const y = 50;

        this.bossHealthBarBg = this.add.rectangle(x, y, barWidth, barHeight, 0x000000, 0.7);
        this.bossHealthBarBg.setScrollFactor(0);
        this.bossHealthBarBg.setDepth(200);

        this.bossHealthBar = this.add.rectangle(x - barWidth / 2, y, barWidth - 4, barHeight - 4, 0x9C27B0);
        this.bossHealthBar.setOrigin(0, 0.5);
        this.bossHealthBar.setScrollFactor(0);
        this.bossHealthBar.setDepth(201);

        const bossLabel = this.add.text(x, y, '♕ BOSS ♕', {
            fontSize: '24px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        bossLabel.setOrigin(0.5);
        bossLabel.setScrollFactor(0);
        bossLabel.setDepth(202);
    }

    setupCamera() {
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        this.cameras.main.startFollow(playerSprite, true, 0.1, 0.1);
        this.cameras.main.setBounds(0, 0, this.levelData.width, this.levelData.height);
    }

    createUI() {
        const width = this.cameras.main.width;

        // Score
        this.scoreText = this.add.text(20, 20, 'Score: 0', {
            fontSize: '28px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.scoreText.setScrollFactor(0);
        this.scoreText.setDepth(100);

        // Health
        this.healthText = this.add.text(20, 55, '❤❤❤❤❤', {
            fontSize: '28px',
            color: '#FF0000',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.healthText.setScrollFactor(0);
        this.healthText.setDepth(100);

        // Combo
        this.comboText = this.add.text(20, 90, '', {
            fontSize: '24px',
            color: '#FF9800',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.comboText.setScrollFactor(0);
        this.comboText.setDepth(100);

        // Level name
        this.levelText = this.add.text(width - 20, 20, this.levelData.name, {
            fontSize: '24px',
            color: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.levelText.setOrigin(1, 0);
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(100);

        // Coins
        this.coinText = this.add.text(width - 20, 55, '● 0/' + this.coins.length, {
            fontSize: '24px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        });
        this.coinText.setOrigin(1, 0);
        this.coinText.setScrollFactor(0);
        this.coinText.setDepth(100);
    }

    setupEventListeners() {
        EventBus.on('entity:died', (data) => {
            if (data.entity === this.player) {
                this.handlePlayerDeath();
            } else if (data.entity.hasTag && data.entity.hasTag('enemy')) {
                this.handleEnemyDeath(data.entity);
            }
        });

        EventBus.on('health:changed', (data) => {
            if (data.entity === this.player) {
                this.updateHealthDisplay(data.current);
            }

            if (this.boss && data.entity === this.boss.entity) {
                this.updateBossHealthBar(data.current, data.max);
            }
        });

        EventBus.on('coin:collected', (data) => {
            this.coinsCollected++;
            this.addScore(data.value);
            this.coinText.setText(`● ${this.coinsCollected}/${this.coins.length}`);
        });

        EventBus.on('combo:increment', (data) => {
            this.combo = data.combo;
            this.comboText.setText(`COMBO x${this.combo}!`);

            this.tweens.add({
                targets: this.comboText,
                scaleX: 1.5,
                scaleY: 1.5,
                duration: 100,
                yoyo: true
            });
        });

        EventBus.on('combo:ended', () => {
            this.combo = 0;
            this.comboText.setText('');
        });
    }

    showLevelIntro() {
        const width = this.cameras.main.width;
        const height = this.cameras.main.height;

        const overlay = this.add.rectangle(width / 2, height / 2, width, height, 0x000000, 0.8);
        overlay.setScrollFactor(0);
        overlay.setDepth(300);

        const levelName = this.add.text(width / 2, height / 2 - 50, this.levelData.name, {
            fontSize: '64px',
            color: '#4CAF50',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        levelName.setOrigin(0.5);
        levelName.setScrollFactor(0);
        levelName.setDepth(301);

        const ready = this.add.text(width / 2, height / 2 + 50, 'GET READY!', {
            fontSize: '32px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 4
        });
        ready.setOrigin(0.5);
        ready.setScrollFactor(0);
        ready.setDepth(301);

        this.tweens.add({
            targets: [overlay, levelName, ready],
            alpha: 0,
            duration: 1500,
            delay: 1500,
            onComplete: () => {
                overlay.destroy();
                levelName.destroy();
                ready.destroy();
            }
        });
    }

    handlePlayerEnemyCollision(enemy) {
        const health = this.player.getComponent(HealthComponent);
        const playerComp = this.player.getComponent(PlayerComponent);

        if (!health || !playerComp) return;

        if (playerComp.powerUps.shield) {
            // Shield absorbs hit
            playerComp.powerUps.shield = false;
            EventBus.emit('particle:explosion', {
                x: this.player.x,
                y: this.player.y,
                color: 0x4CAF50,
                count: 30
            });
            EventBus.emit('sfx:play', { type: 'shieldBreak' });
            return;
        }

        if (!health.invulnerable) {
            health.takeDamage(1);
            health.makeInvulnerable(2000);

            EventBus.emit('camera:shake', { intensity: 5, duration: 200 });
            EventBus.emit('sfx:play', { type: 'hit' });

            // Knockback
            const physics = this.player.getComponent(PhysicsComponent);
            const knockbackX = this.player.x < enemy.x ? -300 : 300;
            physics.setVelocityX(knockbackX);
            physics.setVelocityY(-200);

            // Flash effect
            const sprite = this.player.getComponent(SpriteComponent).sprite;
            this.tweens.add({
                targets: sprite,
                alpha: 0.3,
                duration: 100,
                yoyo: true,
                repeat: 10
            });
        }
    }

    handleEnemyDeath(enemy) {
        const playerComp = this.player.getComponent(PlayerComponent);
        if (playerComp) {
            playerComp.incrementCombo();
        }

        const baseScore = enemy.enemyType === 'tank' ? 500 : enemy.enemyType === 'shooter' ? 300 : 200;
        const multiplier = playerComp ? playerComp.getComboMultiplier() : 1;
        this.addScore(Math.floor(baseScore * multiplier));

        EventBus.emit('particle:explosion', {
            x: enemy.x,
            y: enemy.y,
            color: 0xFF5722,
            count: 25,
            speed: 250
        });

        EventBus.emit('sfx:play', { type: 'enemyDeath' });

        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }

        enemy.destroy();
    }

    handlePlayerDeath() {
        if (this.gameOver) return;
        this.gameOver = true;

        EventBus.emit('camera:shake', { intensity: 20, duration: 500 });
        EventBus.emit('sfx:play', { type: 'defeat' });

        this.time.delayedCall(1000, () => {
            this.scene.start('GameOverScene', { won: false, score: this.score });
        });
    }

    completeLevel() {
        if (this.levelComplete) return;

        // Check if boss needs to be defeated
        if (this.levelData.hasBoss && this.boss && this.boss.entity.active) {
            const bossHealth = this.boss.entity.getComponent(HealthComponent);
            if (bossHealth.isAlive()) {
                // Can't exit until boss is defeated
                return;
            }
        }

        this.levelComplete = true;

        EventBus.emit('sfx:play', { type: 'victory' });
        EventBus.emit('camera:flash', { color: 0xFFD700, duration: 500 });

        const bonusScore = this.coinsCollected * 100;
        this.addScore(bonusScore);

        // Save progress
        SaveManager.save('lastLevel', this.currentLevelId);
        const highScore = SaveManager.load('highScore', 0);
        if (this.score > highScore) {
            SaveManager.save('highScore', this.score);
        }

        // Next level or victory
        const nextLevelId = this.currentLevelId + 1;
        const hasNextLevel = LEVELS.find(l => l.id === nextLevelId);

        this.time.delayedCall(1500, () => {
            if (hasNextLevel) {
                this.scene.start('AdvancedGameScene', { levelId: nextLevelId });
            } else {
                this.scene.start('VictoryScene', { score: this.score });
            }
        });
    }

    addScore(amount) {
        this.score += amount;
        this.scoreText.setText(`Score: ${this.score}`);

        this.tweens.add({
            targets: this.scoreText,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 100,
            yoyo: true
        });
    }

    updateHealthDisplay(health) {
        const hearts = '❤'.repeat(Math.max(0, health));
        const emptyHearts = '♡'.repeat(Math.max(0, 5 - health));
        this.healthText.setText(hearts + emptyHearts);
    }

    updateBossHealthBar(current, max) {
        if (!this.bossHealthBar) return;

        const percent = current / max;
        const maxWidth = 596;

        this.tweens.add({
            targets: this.bossHealthBar,
            width: maxWidth * percent,
            duration: 200
        });

        if (current <= 0) {
            // Boss defeated
            this.time.delayedCall(500, () => {
                if (this.bossHealthBar) this.bossHealthBar.destroy();
                if (this.bossHealthBarBg) this.bossHealthBarBg.destroy();
            });

            EventBus.emit('particle:explosion', {
                x: this.boss.entity.x,
                y: this.boss.entity.y,
                color: 0x9C27B0,
                count: 100,
                speed: 500
            });

            this.addScore(5000);

            this.boss.destroy();
            this.boss = null;
        }
    }

    update(time, delta) {
        if (this.gameOver || this.levelComplete) return;

        // Update all entities
        for (const entity of this.entities) {
            entity.update(delta);
        }

        // Update enemies
        for (const enemy of this.enemies) {
            this.enemyFactory.updateEnemy(enemy, delta, this.player);

            // Check if enemy projectiles hit player
            if (enemy.aiState && enemy.aiState.projectiles) {
                const playerSprite = this.player.getComponent(SpriteComponent).sprite;

                for (const projectile of enemy.aiState.projectiles) {
                    if (projectile && projectile.active) {
                        const distance = Phaser.Math.Distance.Between(
                            projectile.x, projectile.y,
                            playerSprite.x, playerSprite.y
                        );

                        if (distance < 30) {
                            this.handlePlayerEnemyCollision(enemy);
                            projectile.destroy();
                        }
                    }
                }
            }
        }

        // Update boss
        if (this.boss) {
            this.boss.update(delta, this.player);

            // Check boss projectile collisions
            const playerSprite = this.player.getComponent(SpriteComponent).sprite;
            for (const projectile of this.boss.getProjectiles()) {
                const distance = Phaser.Math.Distance.Between(
                    projectile.x, projectile.y,
                    playerSprite.x, playerSprite.y
                );

                if (distance < 30) {
                    this.handlePlayerEnemyCollision(this.boss.entity);
                    projectile.destroy();
                }
            }

            // Player can damage boss by jumping on it
            const bossSprite = this.boss.entity.getComponent(SpriteComponent).sprite;
            if (playerSprite.body.velocity.y > 0 &&
                playerSprite.body.bottom - 10 < bossSprite.body.top &&
                Phaser.Geom.Intersects.RectangleToRectangle(playerSprite.body, bossSprite.body)) {

                const bossHealth = this.boss.entity.getComponent(HealthComponent);
                bossHealth.takeDamage(1);

                // Bounce player up
                const playerPhysics = this.player.getComponent(PhysicsComponent);
                playerPhysics.setVelocityY(-400);

                EventBus.emit('camera:shake', { intensity: 8, duration: 200 });
            }
        }

        // Update systems
        this.particleSystem.update(delta);
        this.cameraSystem.update(delta);

        // Player can stomp enemies
        const playerSprite = this.player.getComponent(SpriteComponent).sprite;
        const playerPhysics = this.player.getComponent(PhysicsComponent);

        for (const enemy of this.enemies) {
            const enemySprite = enemy.getComponent(SpriteComponent).sprite;

            if (enemySprite && playerSprite.body.velocity.y > 0) {
                const threshold = 15;
                if (playerSprite.body.bottom - threshold < enemySprite.body.top &&
                    Phaser.Geom.Intersects.RectangleToRectangle(playerSprite.body, enemySprite.body)) {

                    const health = enemy.getComponent(HealthComponent);
                    health.takeDamage(1);

                    playerPhysics.setVelocityY(-350);

                    if (!health.isAlive()) {
                        this.handleEnemyDeath(enemy);
                    }

                    EventBus.emit('camera:shake', { intensity: 4, duration: 100 });
                }
            }
        }
    }

    shutdown() {
        EventBus.off('entity:died');
        EventBus.off('health:changed');
        EventBus.off('coin:collected');
        EventBus.off('combo:increment');
        EventBus.off('combo:ended');

        if (this.particleSystem) this.particleSystem.destroy();
        if (this.cameraSystem) this.cameraSystem.destroy();
        if (this.boss) this.boss.destroy();
    }
}
