/**
 * Game Configuration
 * Easily adjust positions, sizes, and asset paths here
 */
export const GAME_CONFIG = {
    // Animal positions and sizes (by scene)
    animals: {
        kittens: {
            scenes: ['castle'], // Which scenes to show kittens in
            position: {
                castle: { x: 750, y: 50 }
            },
            size: {
                height: 150, // pixels
                width: 'auto'
            },
            zIndex: 15,
            hoverScale: 1.1,
            image: 'assets/images/animals/2kittens.png',
            sound: 'assets/sounds/kittens.mp3'
        }
    },
    
    // Animation settings
    animations: {
        hoverTransition: 'transform 0.2s',
        transformOrigin: 'bottom center'
    },
    
    // Visual effects
    effects: {
        dropShadow: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))'
    }
};

