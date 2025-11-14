import EventBus from './EventBus.js';

/**
 * ProceduralAudio - Generate game sounds using Web Audio API
 * No audio files needed!
 */
export default class ProceduralAudio {
    constructor() {
        this.audioContext = null;
        this.masterGain = null;
        this.unlocked = false;
        this.enabled = true;

        this.setup();
    }

    setup() {
        const unlock = () => {
            if (this.unlocked) return;

            try {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                this.masterGain = this.audioContext.createGain();
                this.masterGain.gain.value = 0.3;
                this.masterGain.connect(this.audioContext.destination);

                this.unlocked = true;

                // Listen for SFX events
                EventBus.on('sfx:play', this.playSFX, this);

                document.removeEventListener('touchstart', unlock);
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
        };

        document.addEventListener('touchstart', unlock);
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
    }

    playSFX(config) {
        if (!this.unlocked || !this.enabled) return;

        const { type } = config;

        switch (type) {
            case 'jump':
                this.playJump();
                break;
            case 'doubleJump':
                this.playDoubleJump();
                break;
            case 'wallJump':
                this.playWallJump();
                break;
            case 'dash':
                this.playDash();
                break;
            case 'collect':
                this.playCollect();
                break;
            case 'powerup':
                this.playPowerup();
                break;
            case 'hit':
                this.playHit();
                break;
            case 'explosion':
                this.playExplosion();
                break;
            case 'enemyDeath':
                this.playEnemyDeath();
                break;
            case 'victory':
                this.playVictory();
                break;
            case 'defeat':
                this.playDefeat();
                break;
        }
    }

    // Jump sound - rising tone
    playJump() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Double jump - higher pitched with wobble
    playDoubleJump() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.15);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Wall jump - sharp attack
    playWallJump() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.08);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Dash - whoosh sound
    playDash() {
        const now = this.audioContext.currentTime;
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.2, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(100, now + 0.2);

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
    }

    // Collect - pleasant chime
    playCollect() {
        const now = this.audioContext.currentTime;
        const frequencies = [523.25, 659.25, 783.99]; // C, E, G

        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.05);
            gain.gain.setValueAtTime(0.2, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.3);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.3);
        });
    }

    // Powerup - ascending arpeggio
    playPowerup() {
        const now = this.audioContext.currentTime;
        const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C

        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            const startTime = now + (i * 0.08);
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.4);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.4);
        });
    }

    // Hit - harsh sound
    playHit() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Explosion - noise burst
    playExplosion() {
        const now = this.audioContext.currentTime;
        const noise = this.audioContext.createBufferSource();
        const buffer = this.audioContext.createBuffer(1, this.audioContext.sampleRate * 0.3, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < data.length; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        noise.buffer = buffer;

        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(50, now + 0.3);

        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        noise.start(now);
    }

    // Enemy death - descending tone
    playEnemyDeath() {
        const now = this.audioContext.currentTime;
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.2);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + 0.2);
    }

    // Victory - triumphant fanfare
    playVictory() {
        const now = this.audioContext.currentTime;
        const melody = [
            { freq: 523.25, time: 0 },    // C
            { freq: 659.25, time: 0.15 },  // E
            { freq: 783.99, time: 0.3 },   // G
            { freq: 1046.50, time: 0.45 }  // C
        ];

        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'triangle';
            osc.frequency.value = note.freq;

            const startTime = now + note.time;
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.5);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.5);
        });
    }

    // Defeat - sad descending tones
    playDefeat() {
        const now = this.audioContext.currentTime;
        const melody = [
            { freq: 392.00, time: 0 },     // G
            { freq: 349.23, time: 0.2 },   // F
            { freq: 293.66, time: 0.4 },   // D
            { freq: 261.63, time: 0.6 }    // C
        ];

        melody.forEach(note => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'sine';
            osc.frequency.value = note.freq;

            const startTime = now + note.time;
            gain.gain.setValueAtTime(0.25, startTime);
            gain.gain.exponentialRampToValueAtTime(0.01, startTime + 0.6);

            osc.connect(gain);
            gain.connect(this.masterGain);

            osc.start(startTime);
            osc.stop(startTime + 0.6);
        });
    }

    setEnabled(enabled) {
        this.enabled = enabled;
    }

    setVolume(volume) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }

    destroy() {
        EventBus.off('sfx:play', this.playSFX);
        if (this.audioContext) {
            this.audioContext.close();
        }
    }
}
