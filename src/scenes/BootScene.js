import Phaser from 'phaser';
import AssetLoader from '../engine/AssetLoader.js';

/**
 * BootScene - Initial loading scene
 * Handles asset loading and transitions to menu
 */
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        this.assetLoader = new AssetLoader(this);

        // Load critical assets first
        this.assetLoader.loadCriticalAssets();

        // Load game assets
        this.assetLoader.loadGameAssets();

        // Add loading complete handler
        this.load.on('complete', () => {
            this.assetLoader.hideLoadingScreen();
            this.time.delayedCall(300, () => {
                this.scene.start('MenuScene');
            });
        });
    }

    create() {
        // Any additional setup after loading
    }
}
