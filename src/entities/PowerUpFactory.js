import EventBus from '../utils/EventBus.js';

/**
 * PowerUpFactory - Creates collectible power-ups
 */
export default class PowerUpFactory {
    constructor(scene) {
        this.scene = scene;
    }

    createPowerUp(x, y, type) {
        const powerUp = this.scene.add.container(x, y);
        this.scene.physics.add.existing(powerUp);
        powerUp.body.setAllowGravity(false);
        powerUp.body.setSize(30, 30);

        powerUp.powerUpType = type;

        // Visual representation
        const config = this.getPowerUpConfig(type);

        const outerCircle = this.scene.add.circle(0, 0, 18, config.color, 0.3);
        const innerCircle = this.scene.add.circle(0, 0, 12, config.color);

        // Icon (simplified text for now)
        const icon = this.scene.add.text(0, 0, config.icon, {
            fontSize: '20px',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        icon.setOrigin(0.5);

        powerUp.add([outerCircle, innerCircle, icon]);

        // Floating animation
        this.scene.tweens.add({
            targets: powerUp,
            y: y - 20,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Rotation animation
        this.scene.tweens.add({
            targets: powerUp,
            angle: 360,
            duration: 3000,
            repeat: -1,
            ease: 'Linear'
        });

        // Pulse animation
        this.scene.tweens.add({
            targets: [outerCircle],
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        return powerUp;
    }

    getPowerUpConfig(type) {
        const configs = {
            doubleJump: {
                color: 0xFFD700,
                icon: '↑↑',
                name: 'Double Jump'
            },
            dash: {
                color: 0x2196F3,
                icon: '→',
                name: 'Dash'
            },
            speedBoost: {
                color: 0xFF9800,
                icon: '⚡',
                name: 'Speed Boost'
            },
            shield: {
                color: 0x4CAF50,
                icon: '⬡',
                name: 'Shield'
            },
            health: {
                color: 0xF44336,
                icon: '♥',
                name: 'Health'
            }
        };

        return configs[type] || configs.doubleJump;
    }

    createCoin(x, y) {
        const coin = this.scene.add.circle(x, y, 12, 0xFFD700);
        this.scene.physics.add.existing(coin);
        coin.body.setAllowGravity(false);
        coin.isCoin = true;

        // Add glow effect
        const glow = this.scene.add.circle(x, y, 15, 0xFFD700, 0.3);
        this.scene.physics.add.existing(glow);
        glow.body.setAllowGravity(false);

        // Floating animation
        this.scene.tweens.add({
            targets: [coin, glow],
            y: y - 20,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Pulse animation
        this.scene.tweens.add({
            targets: glow,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        coin.glowEffect = glow;

        return coin;
    }

    collectPowerUp(powerUp, player) {
        if (!powerUp || !powerUp.active || !powerUp.powerUpType) return;

        const playerComp = player.getComponent(require('../components/PlayerComponent.js').default);

        if (playerComp) {
            playerComp.addPowerUp(powerUp.powerUpType);

            // Visual feedback
            EventBus.emit('particle:spawn', {
                x: powerUp.x,
                y: powerUp.y,
                color: this.getPowerUpConfig(powerUp.powerUpType).color,
                count: 20,
                spread: true
            });

            EventBus.emit('camera:flash', {
                color: this.getPowerUpConfig(powerUp.powerUpType).color,
                duration: 100
            });

            // Show power-up name
            const text = this.scene.add.text(powerUp.x, powerUp.y - 50,
                `${this.getPowerUpConfig(powerUp.powerUpType).name} Acquired!`, {
                fontSize: '20px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 4,
                fontStyle: 'bold'
            });
            text.setOrigin(0.5);

            this.scene.tweens.add({
                targets: text,
                y: text.y - 50,
                alpha: 0,
                duration: 1500,
                ease: 'Cubic.easeOut',
                onComplete: () => text.destroy()
            });

            powerUp.destroy();
        }
    }

    collectCoin(coin, player) {
        if (!coin || !coin.active) return;

        EventBus.emit('coin:collected', { value: 100 });

        // Visual feedback
        EventBus.emit('particle:spawn', {
            x: coin.x,
            y: coin.y,
            color: 0xFFD700,
            count: 10,
            spread: true
        });

        EventBus.emit('sfx:play', { type: 'collect' });

        // Animate coin to player then destroy
        if (coin.glowEffect) coin.glowEffect.destroy();

        this.scene.tweens.add({
            targets: coin,
            x: player.x,
            y: player.y,
            scaleX: 0,
            scaleY: 0,
            duration: 300,
            ease: 'Cubic.easeIn',
            onComplete: () => coin.destroy()
        });
    }
}
