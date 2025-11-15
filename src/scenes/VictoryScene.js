import Phaser from 'phaser';
import SaveManager from '../utils/SaveManager.js';
import EventBus from '../utils/EventBus.js';

/**
 * VictoryScene - Complete game victory!
 */
export default class VictoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'VictoryScene' });
    }

    init(data) {
        this.finalScore = data.score || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Epic background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x1A237E, 0x1A237E, 0x4A148C, 0x4A148C, 1);
        gradient.fillRect(0, 0, width, height);

        // Stars
        for (let i = 0; i < 100; i++) {
            const star = this.add.circle(
                Math.random() * width,
                Math.random() * height,
                1 + Math.random() * 3,
                0xFFFFFF,
                0.5 + Math.random() * 0.5
            );

            this.tweens.add({
                targets: star,
                alpha: 0.2,
                duration: 500 + Math.random() * 1000,
                yoyo: true,
                repeat: -1
            });
        }

        // Victory text
        const victory = this.add.text(width / 2, height / 4, 'VICTORY!', {
            fontSize: '128px',
            color: '#FFD700',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 8
        });
        victory.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, height / 4 + 100,
            'You conquered all levels!', {
            fontSize: '36px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        subtitle.setOrigin(0.5);

        // Score
        const scoreText = this.add.text(width / 2, height / 2,
            `Final Score: ${this.finalScore}`, {
            fontSize: '48px',
            color: '#4CAF50',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 5
        });
        scoreText.setOrigin(0.5);

        // High score
        const highScore = SaveManager.load('highScore', 0);
        const isNewRecord = this.finalScore > highScore;

        if (isNewRecord) {
            SaveManager.save('highScore', this.finalScore);

            const newRecord = this.add.text(width / 2, height / 2 + 70,
                '🏆 NEW HIGH SCORE! 🏆', {
                fontSize: '32px',
                color: '#FFD700',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 4
            });
            newRecord.setOrigin(0.5);

            this.tweens.add({
                targets: newRecord,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        } else {
            const highScoreText = this.add.text(width / 2, height / 2 + 70,
                `High Score: ${highScore}`, {
                fontSize: '28px',
                color: '#FFD700',
                stroke: '#000000',
                strokeThickness: 3
            });
            highScoreText.setOrigin(0.5);
        }

        // Stats
        const stats = this.add.text(width / 2, height / 2 + 150,
            'Thanks for playing!', {
            fontSize: '24px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3
        });
        stats.setOrigin(0.5);

        // Buttons
        const playAgainButton = this.createButton(width / 2 - 200, height - 150,
            'PLAY AGAIN', () => {
            this.scene.start('AdvancedGameScene', { levelId: 1 });
        });

        const menuButton = this.createButton(width / 2 + 200, height - 150,
            'MAIN MENU', () => {
            this.scene.start('MenuScene');
        });

        // Fireworks!
        this.createFireworks();

        // Animations
        this.tweens.add({
            targets: victory,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        this.tweens.add({
            targets: victory,
            angle: { from: -5, to: 5 },
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Play victory sound
        EventBus.emit('sfx:play', { type: 'victory' });

        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('AdvancedGameScene', { levelId: 1 });
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });
    }

    createFireworks() {
        const { width, height } = this.cameras.main;

        this.time.addEvent({
            delay: 1000,
            repeat: -1,
            callback: () => {
                const x = 200 + Math.random() * (width - 400);
                const y = 100 + Math.random() * (height / 2);

                EventBus.emit('particle:explosion', {
                    x,
                    y,
                    color: Phaser.Display.Color.RandomRGB().color,
                    count: 30,
                    speed: 200 + Math.random() * 200
                });
            }
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 280, 70, 0x2196F3);
        const buttonText = this.add.text(x, y, text, {
            fontSize: '28px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            button.setFillStyle(0x42A5F5);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x2196F3);
            this.tweens.add({
                targets: [button, buttonText],
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        button.on('pointerdown', () => {
            button.setFillStyle(0x1976D2);
        });

        button.on('pointerup', () => {
            button.setFillStyle(0x42A5F5);
            callback();
        });

        return button;
    }
}
