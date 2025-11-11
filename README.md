# FrostSparkle - Interactive Storybook Game

A web-based interactive storybook game where you can dress up Frozen-style characters, navigate through scenes, and have characters talk to each other through pre-written dialogue.

## Getting Started

The game loads its data files with `fetch`, so it needs to be served from a local web server (opening `index.html` directly with `file://` will show a blank scene).

### Quick Start (Node.js)

1. Open a terminal in the `App` folder.
2. Run `npx --yes http-server -p 8080`.
3. When the server starts, visit `http://localhost:8080/index.html` in your browser.
4. Click on characters to hear them speak, use the “Wardrobe” button to dress them up, and navigate scenes with the Previous/Next buttons or thumbnails.

### Other Options

- `python -m http.server 8080` (if Python is installed), then visit `http://localhost:8080/index.html`.
- VS Code's “Live Server” extension or any static file server you prefer.

## Game Features

- **Multiple Scenes**: Navigate between different locations (Castle, Ice Palace, Village, Forest)
- **Character Interactions**: Click on characters to hear them speak
- **Dress-Up System**: Change characters' outfits from the wardrobe panel
- **Story-Driven**: Pre-written dialogue creates an interactive story experience

## Adding Content

### Adding New Scenes

1. Open `data/scenes.json`
2. Add a new scene object to the `scenes` array:

```json
{
  "id": "new_scene",
  "name": "New Scene Name",
  "background": "assets/images/scenes/new-scene.jpg",
  "characters": ["elsa", "anna"],
  "unlocked": true
}
```

3. Add a background image to `assets/images/scenes/` with the filename matching the `background` path
4. Update character positions in `data/characters.json` to include positions for the new scene

### Adding New Characters

1. Open `data/characters.json`
2. Add a new character object to the `characters` array:

```json
{
  "id": "new_character",
  "name": "Character Name",
  "sprite": "assets/images/characters/new-character-base.png",
  "position": {
    "castle": {"x": 400, "y": 400},
    "ice_palace": {"x": 300, "y": 350}
  },
  "outfit": "default",
  "defaultOutfit": "default"
}
```

3. Add character sprite images to `assets/images/characters/`
4. Update scene data to include the new character in the `characters` array for relevant scenes

### Adding New Outfits

1. Open `data/outfits.json`
2. Add a new outfit object to the `outfits` array:

```json
{
  "id": "character_outfit_name",
  "name": "Outfit Display Name",
  "category": "dress",
  "character": "elsa",
  "image": "assets/images/outfits/character-outfit-name.png",
  "layers": ["base", "dress"]
}
```

3. Add outfit images to `assets/images/outfits/`
4. Categories can be: "dress", "casual", "accessories", or any custom category name

### Adding New Dialogue

1. Open `data/dialogue.json`
2. Add new dialogue entries to the `dialogue` array:

```json
{
  "id": "scene_character_1",
  "scene": "castle",
  "character": "elsa",
  "text": "Hello! This is what the character says.",
  "next": "scene_character_2"
}
```

3. To create a dialogue chain, use the `next` field to link to another dialogue entry
4. Set `next` to `null` for the final dialogue in a chain
5. Multiple dialogue entries can exist for the same scene/character combination - the first one will be used

## File Structure

```
App/
├── index.html              # Main game page
├── css/
│   └── style.css          # Game styling
├── js/
│   ├── game.js            # Main game logic
│   ├── scenes.js          # Scene management
│   ├── characters.js      # Character system
│   ├── wardrobe.js        # Dress-up functionality
│   └── dialogue.js        # Dialogue system
├── data/
│   ├── scenes.json        # Scene definitions
│   ├── characters.json    # Character data
│   ├── outfits.json       # Outfit definitions
│   └── dialogue.json      # Dialogue scripts
└── assets/
    ├── images/
    │   ├── scenes/        # Background images
    │   ├── characters/    # Character sprites
    │   └── outfits/       # Outfit images
    └── sounds/            # Sound clips (future feature)
```

## Image Requirements

### Scene Backgrounds
- Recommended size: 1920x1080 or similar wide aspect ratio
- Formats: JPG, PNG
- Should cover the full scene area

### Character Sprites
- Recommended size: 200-300px wide, 300-400px tall
- Formats: PNG (supports transparency)
- Characters should face forward or slightly to the side

### Outfit Images
- Should match character sprite dimensions
- Formats: PNG (supports transparency for layering)
- Can be full character images or overlay pieces

## Tips for Creating Content

1. **Start Simple**: Begin with one scene and a few characters to test
2. **Test Dialogue**: Make sure dialogue IDs are unique and chains are properly linked
3. **Character Positions**: Use the browser's developer tools to find good x,y coordinates for character placement
4. **Image Fallbacks**: The game will show placeholder boxes if images are missing, so you can test without all images
5. **Story Flexibility**: Since the story is child-led, keep dialogue open-ended and fun!

## Troubleshooting

- **Blank scene / no characters**: Make sure you opened the game via `http://localhost...` and not by double-clicking `index.html` (browsers block JSON loading over `file://`).
- **Images not showing**: Check that image paths in JSON files match actual file locations
- **Characters not appearing**: Verify character IDs in scene data match character IDs in characters.json
- **Dialogue not working**: Ensure dialogue scene and character IDs match exactly (case-sensitive)
- **Wardrobe not opening**: Check browser console for JavaScript errors

## Running the game with npm

This project is a static site. For a smooth local workflow, a lightweight dev server is included using Vite.

1. Open a terminal in the `App` directory (this folder).
2. Run:

```
npm install
npm run dev
```

3. Follow the URL printed in the terminal (e.g., `http://localhost:5173/`).
4. Tests are available at `/tests/index.html` (e.g., `http://localhost:5173/tests/index.html`).

Notes:
- You only need Node.js and npm installed. No build step is required, but `npm run dev` provides fast reload and serves JSON/assets correctly.
- If you prefer, `npm run preview` will serve the production build locally.

## Future Enhancements

- Sound effects and voice clips
- Character animations
- Save/load game state
- Multiple story paths
- Mini-games
- Custom character creation

## Notes

- This game is designed for personal use
- All content (images, dialogue, etc.) should be original or properly licensed
- The game works best in modern browsers (Chrome, Firefox, Edge, Safari)
- For best experience, use a screen resolution of 1280x720 or higher

Enjoy creating and playing your interactive storybook game!

