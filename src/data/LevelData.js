/**
 * LevelData - Level definitions and configurations
 */
export const LEVELS = [
    {
        id: 1,
        name: "Tutorial Valley",
        width: 3000,
        height: 1080,
        playerStart: { x: 100, y: 800 },
        platforms: [
            // Ground
            { x: 1500, y: 1050, width: 3000, height: 60 },

            // Tutorial platforms
            { x: 300, y: 900, width: 200, height: 30 },
            { x: 600, y: 800, width: 200, height: 30 },
            { x: 900, y: 700, width: 200, height: 30 },
            { x: 1200, y: 800, width: 200, height: 30 },

            // Walls for wall jump tutorial
            { x: 1500, y: 600, width: 30, height: 400 },
            { x: 1700, y: 600, width: 30, height: 400 },

            // Upper platforms
            { x: 2000, y: 500, width: 300, height: 30 },
            { x: 2500, y: 400, width: 200, height: 30 }
        ],
        enemies: [
            { type: 'patroller', x: 800, y: 850 },
            { type: 'jumper', x: 1400, y: 900 }
        ],
        powerUps: [
            { type: 'doubleJump', x: 900, y: 600 },
            { type: 'dash', x: 2200, y: 400 }
        ],
        coins: [
            { x: 400, y: 850 },
            { x: 700, y: 750 },
            { x: 1000, y: 650 },
            { x: 1600, y: 550 },
            { x: 2100, y: 450 }
        ],
        exitDoor: { x: 2800, y: 900 }
    },

    {
        id: 2,
        name: "Danger Canyon",
        width: 4000,
        height: 1080,
        playerStart: { x: 100, y: 800 },
        platforms: [
            // Ground with gaps
            { x: 400, y: 1050, width: 800, height: 60 },
            { x: 1400, y: 1050, width: 600, height: 60 },
            { x: 2200, y: 1050, width: 800, height: 60 },
            { x: 3400, y: 1050, width: 600, height: 60 },

            // Floating platforms
            { x: 1000, y: 850, width: 150, height: 20 },
            { x: 1800, y: 850, width: 150, height: 20 },
            { x: 3000, y: 750, width: 200, height: 30 },

            // High platforms
            { x: 600, y: 600, width: 200, height: 30 },
            { x: 1200, y: 500, width: 250, height: 30 },
            { x: 2000, y: 400, width: 300, height: 30 },
            { x: 2800, y: 500, width: 200, height: 30 },

            // Vertical walls
            { x: 1600, y: 400, width: 30, height: 500 },
            { x: 2400, y: 300, width: 30, height: 600 }
        ],
        enemies: [
            { type: 'patroller', x: 500, y: 900 },
            { type: 'patroller', x: 1500, y: 900 },
            { type: 'jumper', x: 2300, y: 900 },
            { type: 'flyer', x: 1200, y: 400 },
            { type: 'shooter', x: 2100, y: 350 },
            { type: 'tank', x: 3500, y: 900 }
        ],
        powerUps: [
            { type: 'speedBoost', x: 700, y: 550 },
            { type: 'shield', x: 2900, y: 700 },
            { type: 'health', x: 3100, y: 450 }
        ],
        coins: [
            { x: 350, y: 950 },
            { x: 1000, y: 800 },
            { x: 1300, y: 450 },
            { x: 1800, y: 800 },
            { x: 2100, y: 350 },
            { x: 2500, y: 900 },
            { x: 3000, y: 700 },
            { x: 3500, y: 900 }
        ],
        exitDoor: { x: 3800, y: 900 }
    },

    {
        id: 3,
        name: "Sky Fortress",
        width: 5000,
        height: 1080,
        playerStart: { x: 100, y: 800 },
        platforms: [
            // Starting area
            { x: 300, y: 1050, width: 600, height: 60 },

            // Ascending platforms
            { x: 800, y: 900, width: 180, height: 25 },
            { x: 1100, y: 800, width: 180, height: 25 },
            { x: 1400, y: 700, width: 180, height: 25 },
            { x: 1700, y: 600, width: 200, height: 30 },
            { x: 2000, y: 500, width: 200, height: 30 },

            // Sky platforms
            { x: 2400, y: 400, width: 250, height: 30 },
            { x: 2800, y: 500, width: 200, height: 30 },
            { x: 3200, y: 400, width: 250, height: 30 },
            { x: 3600, y: 500, width: 200, height: 30 },
            { x: 4000, y: 400, width: 300, height: 30 },

            // Vertical walls for wall jumping
            { x: 1900, y: 200, width: 30, height: 300 },
            { x: 2650, y: 200, width: 30, height: 250 },
            { x: 3450, y: 200, width: 30, height: 300 },

            // Final platform
            { x: 4600, y: 300, width: 400, height: 60 }
        ],
        enemies: [
            { type: 'jumper', x: 900, y: 850 },
            { type: 'flyer', x: 1200, y: 600 },
            { type: 'flyer', x: 1800, y: 500 },
            { type: 'shooter', x: 2450, y: 350 },
            { type: 'flyer', x: 2900, y: 400 },
            { type: 'tank', x: 3250, y: 350 },
            { type: 'shooter', x: 3650, y: 450 },
            { type: 'flyer', x: 4100, y: 300 }
        ],
        powerUps: [
            { type: 'health', x: 1400, y: 650 },
            { type: 'speedBoost', x: 2500, y: 350 },
            { type: 'shield', x: 3800, y: 450 }
        ],
        coins: [
            { x: 400, y: 950 },
            { x: 900, y: 850 },
            { x: 1200, y: 750 },
            { x: 1500, y: 650 },
            { x: 1800, y: 550 },
            { x: 2100, y: 450 },
            { x: 2500, y: 350 },
            { x: 2900, y: 450 },
            { x: 3300, y: 350 },
            { x: 3700, y: 450 },
            { x: 4100, y: 350 },
            { x: 4700, y: 250 }
        ],
        exitDoor: { x: 4800, y: 200 },
        hasBoss: true,
        bossPosition: { x: 4400, y: 200 }
    },

    {
        id: 4,
        name: "Crystal Caverns",
        width: 4500,
        height: 1400,
        playerStart: { x: 100, y: 1200 },
        platforms: [
            // Deep cavern floor (scattered)
            { x: 300, y: 1370, width: 500, height: 60 },
            { x: 1000, y: 1370, width: 400, height: 60 },
            { x: 1600, y: 1370, width: 500, height: 60 },

            // Ascending cave path (narrow)
            { x: 200, y: 1150, width: 120, height: 25 },
            { x: 400, y: 1050, width: 140, height: 25 },
            { x: 650, y: 950, width: 100, height: 25 },
            { x: 850, y: 850, width: 120, height: 25 },
            { x: 1050, y: 750, width: 150, height: 25 },

            // Crystal chamber (mid-level)
            { x: 1300, y: 650, width: 250, height: 30 },
            { x: 1650, y: 550, width: 200, height: 30 },
            { x: 1950, y: 650, width: 250, height: 30 },

            // Vertical shaft walls (for wall jumping)
            { x: 1200, y: 400, width: 35, height: 350 },
            { x: 1450, y: 350, width: 35, height: 400 },
            { x: 1700, y: 300, width: 35, height: 450 },
            { x: 2250, y: 300, width: 35, height: 450 },
            { x: 2500, y: 350, width: 35, height: 400 },

            // Upper caverns (difficult jumps)
            { x: 2350, y: 450, width: 180, height: 25 },
            { x: 2700, y: 350, width: 160, height: 25 },
            { x: 3000, y: 450, width: 180, height: 25 },
            { x: 3350, y: 350, width: 200, height: 30 },

            // Narrow passage (requires precise movement)
            { x: 3600, y: 500, width: 100, height: 25 },
            { x: 3800, y: 600, width: 100, height: 25 },
            { x: 4000, y: 500, width: 100, height: 25 },

            // Final chamber platform
            { x: 4250, y: 350, width: 350, height: 40 },

            // Stalactite platforms (hanging from ceiling)
            { x: 800, y: 500, width: 100, height: 30 },
            { x: 1600, y: 350, width: 120, height: 30 },
            { x: 2800, y: 250, width: 140, height: 30 }
        ],
        enemies: [
            // Lower cavern enemies
            { type: 'patroller', x: 350, y: 1320 },
            { type: 'patroller', x: 1100, y: 1320 },
            { type: 'jumper', x: 1700, y: 1320 },

            // Mid-level threats
            { type: 'flyer', x: 700, y: 900 },
            { type: 'flyer', x: 1100, y: 700 },
            { type: 'shooter', x: 1400, y: 600 },
            { type: 'jumper', x: 1750, y: 500 },
            { type: 'flyer', x: 2000, y: 550 },

            // Upper cavern gauntlet
            { type: 'tank', x: 2400, y: 400 },
            { type: 'shooter', x: 2750, y: 300 },
            { type: 'flyer', x: 3100, y: 400 },
            { type: 'shooter', x: 3400, y: 300 },

            // Final chamber guards
            { type: 'tank', x: 3700, y: 550 },
            { type: 'flyer', x: 4000, y: 450 },
            { type: 'jumper', x: 4300, y: 300 }
        ],
        powerUps: [
            { type: 'health', x: 850, y: 450 },
            { type: 'shield', x: 1400, y: 600 },
            { type: 'speedBoost', x: 2400, y: 400 },
            { type: 'health', x: 3100, y: 400 }
        ],
        coins: [
            // Lower path
            { x: 250, y: 1100 },
            { x: 450, y: 1000 },
            { x: 700, y: 900 },

            // Mid cavern
            { x: 900, y: 800 },
            { x: 1100, y: 700 },
            { x: 1350, y: 600 },
            { x: 1600, y: 500 },

            // Crystal chamber
            { x: 1700, y: 300 },
            { x: 2000, y: 600 },

            // Upper caverns
            { x: 2400, y: 400 },
            { x: 2750, y: 300 },
            { x: 3050, y: 400 },
            { x: 3400, y: 300 },

            // Final stretch
            { x: 3650, y: 450 },
            { x: 3850, y: 550 },
            { x: 4050, y: 450 },
            { x: 4350, y: 300 }
        ],
        exitDoor: { x: 4450, y: 250 }
    }
];

export default LEVELS;
