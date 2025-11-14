/**
 * ObjectPool - Reusable object pool for performance optimization
 * Reduces garbage collection by reusing objects
 */
export default class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];

        // Pre-allocate objects
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    /**
     * Get an object from the pool
     */
    get(...args) {
        let obj;

        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }

        this.active.push(obj);
        return obj;
    }

    /**
     * Return an object to the pool
     */
    release(obj) {
        const index = this.active.indexOf(obj);

        if (index !== -1) {
            this.active.splice(index, 1);
        }

        if (this.resetFn) {
            this.resetFn(obj);
        }

        this.pool.push(obj);
    }

    /**
     * Release all active objects
     */
    releaseAll() {
        while (this.active.length > 0) {
            this.release(this.active[0]);
        }
    }

    /**
     * Get pool statistics
     */
    getStats() {
        return {
            pooled: this.pool.length,
            active: this.active.length,
            total: this.pool.length + this.active.length
        };
    }

    /**
     * Clear the pool
     */
    clear() {
        this.pool = [];
        this.active = [];
    }
}
