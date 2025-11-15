import Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import MenuScene from './scenes/MenuScene.js';
import GameScene from './scenes/GameScene.js';
import AdvancedGameScene from './scenes/AdvancedGameScene.js';
import GameOverScene from './scenes/GameOverScene.js';
import VictoryScene from './scenes/VictoryScene.js';

/**
 * Main game configuration
 * Production-ready setup with optimal performance settings
 */
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false // Set to true for development
        }
    },
    scene: [BootScene, MenuScene, AdvancedGameScene, GameScene, GameOverScene, VictoryScene],
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: false
    },
    backgroundColor: '#000000'
};

// Initialize the game
const game = new Phaser.Game(config);

// Global game reference for debugging (development only)
if (import.meta.env.DEV) {
    window.game = game;
}

export default game;
