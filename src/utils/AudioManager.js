/**
 * AudioManager - Handles audio playback and browser autoplay policies
 */
export default class AudioManager {
    constructor(scene) {
        this.scene = scene;
        this.unlocked = false;
        this.musicVolume = 0.7;
        this.sfxVolume = 0.8;
        this.currentMusic = null;
        this.setup();
    }

    /**
     * Setup audio unlock for mobile browsers
     */
    setup() {
        const unlock = () => {
            this.unlocked = true;
            document.removeEventListener('touchstart', unlock);
            document.removeEventListener('click', unlock);
            document.removeEventListener('keydown', unlock);
        };

        document.addEventListener('touchstart', unlock);
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
    }

    /**
     * Play background music
     */
    playMusic(key, loop = true) {
        if (!this.unlocked) return null;

        // Stop current music if playing
        if (this.currentMusic) {
            this.currentMusic.stop();
        }

        try {
            this.currentMusic = this.scene.sound.add(key, {
                loop,
                volume: this.musicVolume
            });
            this.currentMusic.play();
            return this.currentMusic;
        } catch (e) {
            console.warn('Music playback failed:', e);
            return null;
        }
    }

    /**
     * Play sound effect
     */
    playSFX(key, config = {}) {
        if (!this.unlocked) return null;

        try {
            return this.scene.sound.play(key, {
                volume: this.sfxVolume,
                ...config
            });
        } catch (e) {
            console.warn('SFX playback failed:', e);
            return null;
        }
    }

    /**
     * Stop current music
     */
    stopMusic() {
        if (this.currentMusic) {
            this.currentMusic.stop();
            this.currentMusic = null;
        }
    }

    /**
     * Pause current music
     */
    pauseMusic() {
        if (this.currentMusic && this.currentMusic.isPlaying) {
            this.currentMusic.pause();
        }
    }

    /**
     * Resume music
     */
    resumeMusic() {
        if (this.currentMusic && this.currentMusic.isPaused) {
            this.currentMusic.resume();
        }
    }

    /**
     * Set music volume
     */
    setMusicVolume(volume) {
        this.musicVolume = Phaser.Math.Clamp(volume, 0, 1);
        if (this.currentMusic) {
            this.currentMusic.setVolume(this.musicVolume);
        }
    }

    /**
     * Set SFX volume
     */
    setSFXVolume(volume) {
        this.sfxVolume = Phaser.Math.Clamp(volume, 0, 1);
    }

    /**
     * Mute all audio
     */
    muteAll() {
        this.scene.sound.mute = true;
    }

    /**
     * Unmute all audio
     */
    unmuteAll() {
        this.scene.sound.mute = false;
    }
}
