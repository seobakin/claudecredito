import EventBus from '../utils/EventBus.js';

/**
 * CameraSystem - Advanced camera effects (shake, zoom, etc.)
 */
export default class CameraSystem {
    constructor(scene) {
        this.scene = scene;
        this.camera = scene.cameras.main;

        // Shake state
        this.isShaking = false;
        this.shakeIntensity = 0;
        this.shakeDuration = 0;
        this.shakeTimer = 0;
        this.originalX = 0;
        this.originalY = 0;

        // Zoom state
        this.targetZoom = 1;
        this.zoomSpeed = 2;

        // Listen for camera events
        EventBus.on('camera:shake', this.shake, this);
        EventBus.on('camera:zoom', this.setZoom, this);
        EventBus.on('camera:flash', this.flash, this);
    }

    shake(config) {
        const { intensity = 5, duration = 200 } = config;

        this.isShaking = true;
        this.shakeIntensity = intensity;
        this.shakeDuration = duration;
        this.shakeTimer = duration;
        this.originalX = this.camera.scrollX;
        this.originalY = this.camera.scrollY;
    }

    setZoom(config) {
        const { zoom = 1, duration = 500 } = config;

        this.scene.tweens.add({
            targets: this.camera,
            zoom: zoom,
            duration: duration,
            ease: 'Sine.easeInOut'
        });
    }

    flash(config) {
        const { color = 0xFFFFFF, duration = 100 } = config;

        this.camera.flash(duration,
            (color >> 16) & 255,
            (color >> 8) & 255,
            color & 255
        );
    }

    update(delta) {
        if (this.isShaking) {
            this.shakeTimer -= delta;

            if (this.shakeTimer > 0) {
                // Calculate shake offset
                const progress = this.shakeTimer / this.shakeDuration;
                const currentIntensity = this.shakeIntensity * progress;

                const offsetX = (Math.random() - 0.5) * currentIntensity * 2;
                const offsetY = (Math.random() - 0.5) * currentIntensity * 2;

                this.camera.setScroll(
                    this.originalX + offsetX,
                    this.originalY + offsetY
                );
            } else {
                // Shake finished
                this.isShaking = false;
                this.camera.setScroll(this.originalX, this.originalY);
            }
        } else if (this.camera.scrollX !== undefined) {
            // Store original position for next shake
            this.originalX = this.camera.scrollX;
            this.originalY = this.camera.scrollY;
        }
    }

    destroy() {
        EventBus.off('camera:shake', this.shake);
        EventBus.off('camera:zoom', this.setZoom);
        EventBus.off('camera:flash', this.flash);
    }
}
