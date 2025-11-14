import Phaser from 'phaser';
import SaveManager from '../utils/SaveManager.js';

/**
 * GameOverScene - Display results and options
 */
export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameOverScene' });
    }

    init(data) {
        this.won = data.won || false;
        this.score = data.score || 0;
    }

    create() {
        const { width, height } = this.cameras.main;

        // Background
        const bgColor = this.won ? 0x1B5E20 : 0xB71C1C;
        this.add.rectangle(width / 2, height / 2, width, height, bgColor);

        // Title
        const titleText = this.won ? 'VICTORY!' : 'GAME OVER';
        const titleColor = this.won ? '#4CAF50' : '#F44336';

        const title = this.add.text(width / 2, height / 3, titleText, {
            fontSize: '96px',
            fontFamily: 'Arial',
            color: titleColor,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 6
        });
        title.setOrigin(0.5);

        // Score
        const scoreText = this.add.text(width / 2, height / 2, `Score: ${this.score}`, {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        scoreText.setOrigin(0.5);

        // High score
        const highScore = SaveManager.load('highScore', 0);
        const highScoreText = this.add.text(width / 2, height / 2 + 70, `High Score: ${highScore}`, {
            fontSize: '32px',
            fontFamily: 'Arial',
            color: '#FFD700',
            stroke: '#000000',
            strokeThickness: 3
        });
        highScoreText.setOrigin(0.5);

        // Buttons
        const restartButton = this.createButton(width / 2 - 200, height - 200, 'PLAY AGAIN', () => {
            this.scene.start('GameScene');
        });

        const menuButton = this.createButton(width / 2 + 200, height - 200, 'MAIN MENU', () => {
            this.scene.start('MenuScene');
        });

        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.start('GameScene');
        });

        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MenuScene');
        });

        // Instructions
        const instructions = this.add.text(width / 2, height - 100,
            'SPACE: Play Again | ESC: Menu', {
            fontSize: '20px',
            fontFamily: 'Arial',
            color: '#ffffff',
            align: 'center'
        });
        instructions.setOrigin(0.5);

        // Animation
        this.tweens.add({
            targets: title,
            scale: { from: 0.8, to: 1.2 },
            duration: 500,
            yoyo: true,
            ease: 'Back.easeOut'
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
