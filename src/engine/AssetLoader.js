/**
 * AssetLoader - Progressive asset loading with priority system
 * Handles efficient loading of images, audio, and other game assets
 */
export default class AssetLoader {
    constructor(scene) {
        this.scene = scene;
        this.loadProgress = 0;
    }

    /**
     * Load critical assets first (for menu/splash)
     */
    loadCriticalAssets() {
        // Update HTML loading bar if available
        this.scene.load.on('progress', (value) => {
            this.loadProgress = value;
            const loadingBarFill = document.getElementById('loading-bar-fill');
            if (loadingBarFill) {
                loadingBarFill.style.width = `${value * 100}%`;
            }
        });

        // Critical assets (menu, UI)
        // In a real project, replace these with actual asset paths
        // this.scene.load.image('logo', 'assets/images/logo.png');
        // this.scene.load.image('button', 'assets/images/button.png');
    }

    /**
     * Load game assets (can be done in background)
     */
    loadGameAssets() {
        // Game sprites
        // this.scene.load.spritesheet('player', 'assets/sprites/player.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });

        // this.scene.load.spritesheet('enemies', 'assets/sprites/enemies.png', {
        //     frameWidth: 32,
        //     frameHeight: 32
        // });

        // Tilemaps
        // this.scene.load.image('tiles', 'assets/tilemaps/tiles.png');
        // this.scene.load.tilemapTiledJSON('level1', 'assets/tilemaps/level1.json');

        // Audio
        // this.scene.load.audio('bgMusic', 'assets/audio/music.mp3');
        // this.scene.load.audio('jump', 'assets/audio/jump.mp3');
        // this.scene.load.audio('collect', 'assets/audio/collect.mp3');
    }

    /**
     * Load audio assets separately (due to autoplay policies)
     */
    loadAudioAssets() {
        // Load after user interaction to comply with autoplay policies
    }

    /**
     * Hide loading screen when ready
     */
    hideLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }
    }
}
