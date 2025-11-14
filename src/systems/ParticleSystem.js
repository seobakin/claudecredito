import ObjectPool from '../utils/ObjectPool.js';
import EventBus from '../utils/EventBus.js';

/**
 * ParticleSystem - Advanced particle effects system
 */
export default class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];

        // Create particle pool
        this.particlePool = new ObjectPool(
            () => this.createParticle(),
            (particle) => this.resetParticle(particle),
            100
        );

        // Listen for particle spawn events
        EventBus.on('particle:spawn', this.spawnParticles, this);
        EventBus.on('particle:explosion', this.createExplosion, this);
        EventBus.on('particle:trail', this.createTrail, this);
    }

    createParticle() {
        const particle = this.scene.add.circle(0, 0, 3, 0xFFFFFF);
        particle.setActive(false);
        particle.setVisible(false);
        return particle;
    }

    resetParticle(particle) {
        particle.setActive(false);
        particle.setVisible(false);
        particle.setPosition(0, 0);
        particle.setScale(1);
        particle.setAlpha(1);
    }

    spawnParticles(config) {
        const {
            x,
            y,
            color = 0xFFFFFF,
            count = 5,
            spread = false,
            trail = false,
            velocityX = 0,
            velocityY = 0,
            radius = 3,
            lifetime = 1000,
            gravity = true
        } = config;

        for (let i = 0; i < count; i++) {
            const particle = this.particlePool.get();
            particle.setActive(true);
            particle.setVisible(true);
            particle.setPosition(x, y);
            particle.setFillStyle(color);
            particle.setRadius(radius);

            // Calculate velocity
            let vx = velocityX;
            let vy = velocityY;

            if (spread) {
                const angle = (Math.PI * 2 * i) / count;
                const speed = 100 + Math.random() * 100;
                vx = Math.cos(angle) * speed;
                vy = Math.sin(angle) * speed;
            } else {
                vx += (Math.random() - 0.5) * 100;
                vy += (Math.random() - 0.5) * 100;
            }

            // Store particle data
            const particleData = {
                graphic: particle,
                vx,
                vy,
                lifetime,
                maxLifetime: lifetime,
                gravity,
                trail
            };

            this.particles.push(particleData);
        }
    }

    createExplosion(config) {
        const {
            x,
            y,
            color = 0xFF5722,
            count = 20,
            speed = 200
        } = config;

        for (let i = 0; i < count; i++) {
            const angle = (Math.PI * 2 * i) / count;
            const speedVariation = speed * (0.5 + Math.random() * 0.5);

            this.spawnParticles({
                x,
                y,
                color,
                count: 1,
                velocityX: Math.cos(angle) * speedVariation,
                velocityY: Math.sin(angle) * speedVariation,
                radius: 4 + Math.random() * 3,
                lifetime: 500 + Math.random() * 500,
                gravity: true
            });
        }
    }

    createTrail(config) {
        const {
            x,
            y,
            color = 0x2196F3,
            count = 3
        } = config;

        this.spawnParticles({
            x,
            y,
            color,
            count,
            velocityX: (Math.random() - 0.5) * 50,
            velocityY: (Math.random() - 0.5) * 50,
            radius: 2,
            lifetime: 300,
            gravity: false
        });
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];

            // Update position
            particle.graphic.x += particle.vx * (delta / 1000);
            particle.graphic.y += particle.vy * (delta / 1000);

            // Apply gravity
            if (particle.gravity) {
                particle.vy += 800 * (delta / 1000);
            }

            // Apply drag
            particle.vx *= 0.98;
            particle.vy *= 0.98;

            // Update lifetime
            particle.lifetime -= delta;

            // Fade out
            const alpha = particle.lifetime / particle.maxLifetime;
            particle.graphic.setAlpha(alpha);

            // Scale down
            const scale = 0.5 + (alpha * 0.5);
            particle.graphic.setScale(scale);

            // Remove dead particles
            if (particle.lifetime <= 0) {
                this.particlePool.release(particle.graphic);
                this.particles.splice(i, 1);
            }
        }
    }

    destroy() {
        EventBus.off('particle:spawn', this.spawnParticles);
        EventBus.off('particle:explosion', this.createExplosion);
        EventBus.off('particle:trail', this.createTrail);

        // Clean up all particles
        for (const particle of this.particles) {
            particle.graphic.destroy();
        }
        this.particles = [];
        this.particlePool.clear();
    }
}
