import Phaser from 'phaser';
import GameConfig from '../engine/GameConfig.js';

/**
 * MenuScene - Main menu
 */
export default class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        this.add.rectangle(width / 2, height / 2, width, height, 0x1a1a2e);

        // Title
        const title = this.add.text(width / 2, height / 3, 'CLAUDECREDITO\nGAME ENGINE', {
            fontSize: '72px',
            fontFamily: 'Arial',
            color: '#4CAF50',
            align: 'center',
            fontStyle: 'bold'
        });
        title.setOrigin(0.5);

        // Subtitle
        const subtitle = this.add.text(width / 2, height / 3 + 120, 'Production-Ready Browser Game Template', {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });
        subtitle.setOrigin(0.5);

        // Start button
        const startButton = this.createButton(width / 2, height / 2 + 100, 'START GAME', () => {
            this.scene.start('GameScene');
        });

        // Instructions
        const instructions = this.add.text(width / 2, height - 100,
            'Arrow Keys or WASD to Move | SPACE to Jump\nPress START to begin!', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#aaaaaa',
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Pulsing animation on title
        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // Keyboard shortcut
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });
    }

    createButton(x, y, text, callback) {
        const button = this.add.rectangle(x, y, 300, 70, 0x4CAF50);
        const buttonText = this.add.text(x, y, text, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#ffffff',
            fontStyle: 'bold'
        });
        buttonText.setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });

        button.on('pointerover', () => {
            button.setFillStyle(0x66BB6A);
            this.tweens.add({
                targets: button,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 100
            });
        });

        button.on('pointerout', () => {
            button.setFillStyle(0x4CAF50);
            this.tweens.add({
                targets: button,
                scaleX: 1,
                scaleY: 1,
                duration: 100
            });
        });

        button.on('pointerdown', () => {
            button.setFillStyle(0x388E3C);
        });

        button.on('pointerup', () => {
            button.setFillStyle(0x66BB6A);
            callback();
        });

        return button;
    }
}
