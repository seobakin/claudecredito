# ClaudeCredito Game Engine

**Production-ready browser game template with Phaser 3, Vite, and ECS architecture**

A comprehensive, optimized foundation for building modern browser games with best practices baked in.

---

## Features

### Core Architecture
- **Phaser 3** - Industry-standard HTML5 game framework
- **Vite** - Lightning-fast development with instant HMR
- **ECS Pattern** - Entity-Component-System for scalable game logic
- **TypeScript-ready** - Easy to migrate to TypeScript

### Performance Optimizations
- Object pooling for bullets, particles, enemies
- Spatial partitioning ready (QuadTree)
- Efficient asset loading with progress tracking
- Optimized build with code splitting
- Gzip/Brotli compression

### Built-in Systems
- **Audio Manager** - Handles browser autoplay policies
- **Save Manager** - Robust localStorage wrapper
- **Event Bus** - Decoupled communication system
- **Input System** - Keyboard + touch support
- **Health System** - Damage, invulnerability, death handling

### Mobile & PWA Support
- Responsive scaling for all screen sizes
- Touch controls ready
- Progressive Web App (installable)
- Service Worker for offline play
- Prevents scroll/zoom on mobile

### Developer Experience
- Hot Module Replacement (HMR)
- Clean project structure
- Modular, reusable components
- Comprehensive example game
- Production-ready deployment

---

## Quick Start

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The game will open at `http://localhost:3000`

---

## Project Structure

```
claudecredito/
├── public/                  # Static assets
│   ├── manifest.json       # PWA manifest
│   ├── sw.js              # Service worker
│   └── favicon.png        # Favicon
│
├── src/
│   ├── main.js            # Game entry point
│   │
│   ├── engine/            # Core engine systems
│   │   ├── AssetLoader.js
│   │   └── GameConfig.js
│   │
│   ├── ecs/               # Entity-Component-System
│   │   ├── Entity.js
│   │   ├── Component.js
│   │   ├── System.js
│   │   └── EntityManager.js
│   │
│   ├── components/        # Reusable components
│   │   ├── SpriteComponent.js
│   │   ├── PhysicsComponent.js
│   │   ├── HealthComponent.js
│   │   └── InputComponent.js
│   │
│   ├── scenes/            # Game scenes
│   │   ├── BootScene.js
│   │   ├── MenuScene.js
│   │   ├── GameScene.js
│   │   └── GameOverScene.js
│   │
│   └── utils/             # Utility classes
│       ├── EventBus.js
│       ├── ObjectPool.js
│       ├── AudioManager.js
│       └── SaveManager.js
│
├── index.html             # Entry HTML
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies
```

---

## Creating Entities with ECS

The Entity-Component-System architecture makes it easy to create game objects:

```javascript
import Entity from './ecs/Entity.js';
import SpriteComponent from './components/SpriteComponent.js';
import PhysicsComponent from './components/PhysicsComponent.js';

// Create a new entity
const player = new Entity(scene, 100, 100);

// Add visual representation
const sprite = new SpriteComponent(scene, 'player', 0, {
    depth: 10
});
sprite.init();
player.addComponent(sprite);

// Add physics
const physics = new PhysicsComponent(scene, {
    bounce: 0.2,
    collideWorldBounds: true
});
physics.init();
player.addComponent(physics);

// Add to entity list
entities.push(player);
```

---

## Creating Custom Components

```javascript
import Component from '../ecs/Component.js';

export default class MyComponent extends Component {
    constructor(customData) {
        super();
        this.customData = customData;
    }

    init() {
        // Called when added to entity
        console.log('Component initialized on entity:', this.entity.id);
    }

    update(delta) {
        // Called every frame
        // Access entity: this.entity
    }

    destroy() {
        // Clean up resources
    }
}
```

---

## Event System

Use the EventBus for decoupled communication:

```javascript
import EventBus from './utils/EventBus.js';

// Subscribe to event
EventBus.on('player:jump', (data) => {
    console.log('Player jumped:', data);
});

// Emit event
EventBus.emit('player:jump', { height: 500 });

// One-time subscription
EventBus.once('game:start', () => {
    console.log('Game started!');
});

// Unsubscribe
EventBus.off('player:jump', callback);
```

---

## Audio Management

```javascript
import AudioManager from './utils/AudioManager.js';

// In your scene
this.audioManager = new AudioManager(this);

// Play background music
this.audioManager.playMusic('bgMusic', true);

// Play sound effect
this.audioManager.playSFX('jump');

// Control volume
this.audioManager.setMusicVolume(0.5);
this.audioManager.setSFXVolume(0.8);

// Mute/unmute
this.audioManager.muteAll();
this.audioManager.unmuteAll();
```

---

## Save System

```javascript
import SaveManager from './utils/SaveManager.js';

// Save data
SaveManager.save('playerData', {
    level: 5,
    score: 10000,
    inventory: ['sword', 'shield']
});

// Load data
const data = SaveManager.load('playerData', { level: 1, score: 0 });

// Check if save exists
if (SaveManager.exists('playerData')) {
    // Load existing save
}

// Delete save
SaveManager.delete('playerData');

// Get all save keys
const saves = SaveManager.getAllKeys();
```

---

## Object Pooling

Improve performance by reusing objects:

```javascript
import ObjectPool from './utils/ObjectPool.js';

// Create pool
const bulletPool = new ObjectPool(
    () => scene.add.circle(0, 0, 5, 0xFFFFFF),  // Create function
    (bullet) => {                                // Reset function
        bullet.setActive(false);
        bullet.setVisible(false);
    },
    20  // Initial pool size
);

// Get object from pool
const bullet = bulletPool.get();
bullet.setPosition(x, y);
bullet.setActive(true);
bullet.setVisible(true);

// Return to pool when done
bulletPool.release(bullet);

// Get statistics
const stats = bulletPool.getStats();
console.log('Active:', stats.active, 'Pooled:', stats.pooled);
```

---

## Configuration

Edit `src/engine/GameConfig.js` to customize game settings:

```javascript
export const GameConfig = {
    GAME_WIDTH: 1920,
    GAME_HEIGHT: 1080,
    GRAVITY: 800,
    PLAYER_SPEED: 300,
    PLAYER_JUMP: -500,
    // ... more settings
};
```

---

## Building Custom Systems

Create systems to operate on entities with specific components:

```javascript
import System from '../ecs/System.js';
import HealthComponent from '../components/HealthComponent.js';

export default class RegenerationSystem extends System {
    filter(entity) {
        // Only process entities with HealthComponent
        return entity.hasComponent(HealthComponent);
    }

    updateEntity(entity, delta) {
        const health = entity.getComponent(HealthComponent);

        if (health.currentHealth < health.maxHealth) {
            health.heal(1 * (delta / 1000));  // Heal 1 HP per second
        }
    }
}

// Add to EntityManager
entityManager.addSystem(new RegenerationSystem(scene));
```

---

## Deployment

### Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

### Deploy to Netlify

1. Push to GitHub
2. Connect repository to Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Deploy!

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to GitHub Pages

```bash
npm run build
# Push dist/ folder to gh-pages branch
```

---

## Performance Tips

1. **Use Object Pools** for frequently created/destroyed objects
2. **Limit Physics Bodies** - only add physics where needed
3. **Use Sprite Sheets** instead of individual images
4. **Implement Culling** - don't update off-screen entities
5. **Optimize Assets** - compress images, use WebP
6. **Lazy Load** non-critical assets after game start
7. **Use Fixed Timestep** for deterministic physics
8. **Profile with DevTools** - identify bottlenecks

---

## Demo Game Controls

**Keyboard:**
- Arrow Keys / WASD - Move
- Space / W - Jump
- ESC - Return to menu

**Objective:**
Collect all gold coins while avoiding red enemies!

---

## Customization Guide

### Adding New Scenes

1. Create file in `src/scenes/`
2. Extend `Phaser.Scene`
3. Add to scene array in `src/main.js`

```javascript
import MyScene from './scenes/MyScene.js';

scene: [BootScene, MenuScene, MyScene, GameScene, GameOverScene]
```

### Adding Assets

1. Place assets in `public/assets/`
2. Load in `AssetLoader.js`:

```javascript
loadGameAssets() {
    this.scene.load.image('mySprite', 'assets/images/sprite.png');
    this.scene.load.audio('mySound', 'assets/audio/sound.mp3');
}
```

### Creating Custom Input

```javascript
// In your scene
this.input.keyboard.on('keydown-E', () => {
    console.log('E key pressed!');
});

// Touch controls
this.input.on('pointerdown', (pointer) => {
    console.log('Touch at:', pointer.x, pointer.y);
});
```

---

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Optimized

---

## License

MIT License - Use freely for personal and commercial projects

---

## Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [Phaser Examples](https://phaser.io/examples)
- [Vite Documentation](https://vitejs.dev/)
- [Game Programming Patterns](https://gameprogrammingpatterns.com/)
- [HTML5 Game Development](https://developer.mozilla.org/en-US/docs/Games)

---

## What's Included

✅ Phaser 3 game framework
✅ Vite build system
✅ ECS architecture
✅ Object pooling
✅ Event system
✅ Audio manager
✅ Save/load system
✅ Responsive scaling
✅ Mobile support
✅ PWA support
✅ Service worker
✅ Working example game
✅ Production optimizations
✅ Development HMR
✅ Comprehensive documentation

---

## Next Steps

1. **Customize the demo game** - Modify `GameScene.js`
2. **Add your assets** - Replace placeholder graphics
3. **Implement your game logic** - Use ECS pattern
4. **Test on mobile** - Use `npm run dev` with network access
5. **Deploy** - Build and deploy to your favorite platform

---

## Contributing

Feel free to submit issues and enhancement requests!

---

**Built with ❤️ using Claude Code's ultrathink mode**

**Maximizing value from Claude credits - one game at a time!**
