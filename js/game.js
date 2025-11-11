// Main Game Controller
import { SceneManager } from './scenes.js';
import { CharacterManager } from './characters.js';
import { DialogueManager } from './dialogue.js';
import { WardrobeManager } from './wardrobe.js';

class Game {
    constructor() {
        this.sceneManager = new SceneManager();
        this.characterManager = new CharacterManager();
        this.dialogueManager = new DialogueManager();
        this.wardrobeManager = new WardrobeManager();

        // DOM Elements
        this.sceneContainer = document.getElementById('scene-container');
        this.sceneBackground = document.getElementById('scene-background');
        this.charactersContainer = document.getElementById('characters-container');
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueCharacterName = document.getElementById('dialogue-character-name');
        this.dialogueTextContent = document.getElementById('dialogue-text-content');
        this.dialogueContinueBtn = document.getElementById('dialogue-continue-btn');
        this.wardrobePanel = document.getElementById('wardrobe-panel');
        this.wardrobeBtn = document.getElementById('wardrobe-btn');
        this.wardrobeCloseBtn = document.getElementById('wardrobe-close-btn');
        this.overlay = document.getElementById('overlay');
        this.prevSceneBtn = document.getElementById('prev-scene-btn');
        this.nextSceneBtn = document.getElementById('next-scene-btn');
        this.sceneSelector = document.getElementById('scene-selector');
        this.wardrobeCharacterSelect = document.getElementById('wardrobe-character-select');
        this.outfitCategoriesList = document.getElementById('outfit-categories-list');
        this.outfitsGrid = document.getElementById('outfits-grid');
        this.applyOutfitBtn = document.getElementById('apply-outfit-btn');
        this.removeOutfitBtn = document.getElementById('remove-outfit-btn');
    }

    async init() {
        try {
            // Load all game data
            await Promise.all([
                this.sceneManager.loadScenes(),
                this.characterManager.loadCharacters(),
                this.dialogueManager.loadDialogue(),
                this.wardrobeManager.loadOutfits()
            ]);

            // Set up event listeners
            this.setupEventListeners();

            // Display initial scene
            this.updateScene();

            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Error initializing game:', error);
            alert('Error loading game. Please check the console for details.');
        }
    }

    setupEventListeners() {
        // Scene navigation
        this.prevSceneBtn.addEventListener('click', () => {
            const scene = this.sceneManager.previousScene();
            if (scene) {
                this.updateScene();
            }
        });

        this.nextSceneBtn.addEventListener('click', () => {
            const scene = this.sceneManager.nextScene();
            if (scene) {
                this.updateScene();
            }
        });

        // Wardrobe
        this.wardrobeBtn.addEventListener('click', () => {
            const currentScene = this.sceneManager.getCurrentScene();
            if (currentScene && currentScene.characters.length > 0) {
                // Open wardrobe with first character in scene
                const firstCharacter = currentScene.characters[0];
                this.wardrobeManager.openWardrobe(
                    firstCharacter,
                    this.wardrobePanel,
                    this.overlay,
                    this.wardrobeCharacterSelect,
                    this.outfitCategoriesList,
                    this.outfitsGrid,
                    this.applyOutfitBtn,
                    this.removeOutfitBtn,
                    this.characterManager.characters
                );
            } else {
                // Open with first available character
                if (this.characterManager.characters.length > 0) {
                    this.wardrobeManager.openWardrobe(
                        this.characterManager.characters[0].id,
                        this.wardrobePanel,
                        this.overlay,
                        this.wardrobeCharacterSelect,
                        this.outfitCategoriesList,
                        this.outfitsGrid,
                        this.applyOutfitBtn,
                        this.removeOutfitBtn,
                        this.characterManager.characters
                    );
                }
            }
        });

        this.wardrobeCloseBtn.addEventListener('click', () => {
            this.wardrobeManager.closeWardrobe(this.wardrobePanel, this.overlay);
        });

        this.overlay.addEventListener('click', () => {
            this.wardrobeManager.closeWardrobe(this.wardrobePanel, this.overlay);
            this.dialogueManager.hideDialogue(this.dialogueBox);
        });

        // Character selector in wardrobe
        this.wardrobeCharacterSelect.addEventListener('change', (e) => {
            const characterId = e.target.value;
            this.wardrobeManager.selectedCharacter = characterId;
            this.wardrobeManager.updateWardrobeDisplay(
                characterId,
                this.outfitCategoriesList,
                this.outfitsGrid,
                this.applyOutfitBtn,
                this.removeOutfitBtn
            );
        });

        // Apply/Remove outfit buttons
        this.applyOutfitBtn.addEventListener('click', () => {
            const outfit = this.wardrobeManager.getSelectedOutfit();
            const characterId = this.wardrobeManager.getSelectedCharacter();
            
            if (outfit && characterId) {
                this.characterManager.setCharacterOutfit(characterId, outfit.id);
                this.characterManager.updateCharacterOutfit(characterId, outfit.image);
                this.updateScene(); // Refresh scene to show new outfit
            }
        });

        this.removeOutfitBtn.addEventListener('click', () => {
            const characterId = this.wardrobeManager.getSelectedCharacter();
            
            if (characterId) {
                this.characterManager.resetCharacterOutfit(characterId);
                this.updateScene(); // Refresh scene to show default outfit
            }
        });

        // Dialogue continue button
        this.dialogueContinueBtn.addEventListener('click', () => {
            this.dialogueManager.hideDialogue(this.dialogueBox);
        });
    }

    updateScene() {
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;

        // Update background
        this.sceneManager.displayScene(currentScene, this.sceneContainer, this.sceneBackground);

        // Render characters
        this.characterManager.renderCharactersInScene(
            currentScene.id,
            this.charactersContainer,
            (characterId, characterName) => {
                this.handleCharacterClick(characterId, characterName);
            }
        );

        // Update navigation buttons
        this.prevSceneBtn.disabled = !this.sceneManager.canGoPrevious();
        this.nextSceneBtn.disabled = !this.sceneManager.canGoNext();

        // Update scene selector
        this.updateSceneSelector();
    }

    updateSceneSelector() {
        this.sceneSelector.innerHTML = '';
        const scenes = this.sceneManager.getAllScenes();
        const currentScene = this.sceneManager.getCurrentScene();

        scenes.forEach(scene => {
            const thumbnail = document.createElement('button');
            thumbnail.className = `scene-thumbnail ${scene.id === currentScene.id ? 'active' : ''}`;
            thumbnail.textContent = scene.name;
            thumbnail.addEventListener('click', () => {
                this.sceneManager.goToScene(scene.id);
                this.updateScene();
            });
            this.sceneSelector.appendChild(thumbnail);
        });
    }

    handleCharacterClick(characterId, characterName) {
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;

        this.dialogueManager.handleCharacterClick(
            currentScene.id,
            characterId,
            characterName,
            this.dialogueBox,
            this.dialogueCharacterName,
            this.dialogueTextContent,
            this.dialogueContinueBtn
        );
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});

