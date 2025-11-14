/**
 * GameConfig - Centralized game configuration
 * All game constants and settings in one place
 */
export const GameConfig = {
    // Display settings
    GAME_WIDTH: 1920,
    GAME_HEIGHT: 1080,

    // Physics settings
    GRAVITY: 800,
    PLAYER_SPEED: 300,
    PLAYER_JUMP: -500,

    // Game settings
    MAX_LIVES: 3,
    LEVEL_TIME: 180, // seconds

    // Performance settings
    OBJECT_POOL_SIZE: {
        BULLETS: 50,
        PARTICLES: 100,
        ENEMIES: 20
    },

    // Audio settings
    MUSIC_VOLUME: 0.7,
    SFX_VOLUME: 0.8,

    // Colors (for drawing when no assets available)
    COLORS: {
        PRIMARY: 0x4CAF50,
        SECONDARY: 0x2196F3,
        DANGER: 0xF44336,
        WARNING: 0xFFC107,
        SUCCESS: 0x8BC34A,
        BACKGROUND: 0x000000,
        TEXT: 0xFFFFFF
    },

    // Z-index layers
    DEPTH: {
        BACKGROUND: 0,
        TERRAIN: 10,
        COLLECTIBLES: 20,
        ENEMIES: 30,
        PLAYER: 40,
        PARTICLES: 50,
        UI: 100
    }
};

export default GameConfig;
