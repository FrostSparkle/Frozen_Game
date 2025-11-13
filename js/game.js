// Main Game Controller
import { SceneManager } from './scenes.js';
import { CharacterManager } from './characters.js';
import { DialogueManager } from './dialogue.js';
import { WardrobeManager } from './wardrobe.js';
import { AnimalManager } from './animals.js';

/**
 * Main Game Class
 * Manages the overall game state, scene rendering, and user interactions
 */
class Game {
    /**
     * Initialize the Game instance
     */
    constructor() {
        this.initializeManagers();
        this.initializeDOMElements();
    }

    /**
     * Initialize game managers
     * @private
     */
    initializeManagers() {
        this.sceneManager = new SceneManager();
        this.characterManager = new CharacterManager();
        this.dialogueManager = new DialogueManager();
        this.wardrobeManager = new WardrobeManager();
        // AnimalManager will be initialized after DOM elements are ready
        this.animalManager = null;
    }

    /**
     * Cache DOM element references
     * @private
     */
    initializeDOMElements() {
        // Scene elements
        this.sceneContainer = document.getElementById('scene-container');
        this.sceneBackground = document.getElementById('scene-background');
        this.charactersContainer = document.getElementById('characters-container');
        
        // Dialogue elements
        this.dialogueBox = document.getElementById('dialogue-box');
        this.dialogueCharacterName = document.getElementById('dialogue-character-name');
        this.dialogueTextContent = document.getElementById('dialogue-text-content');
        this.dialogueContinueBtn = document.getElementById('dialogue-continue-btn');
        
        // Wardrobe elements
        this.wardrobePanel = document.getElementById('wardrobe-panel');
        this.wardrobeBtn = document.getElementById('wardrobe-btn');
        this.wardrobeCloseBtn = document.getElementById('wardrobe-close-btn');
        this.wardrobeCharacterSelect = document.getElementById('wardrobe-character-select');
        this.outfitCategoriesList = document.getElementById('outfit-categories-list');
        this.outfitsGrid = document.getElementById('outfits-grid');
        this.applyOutfitBtn = document.getElementById('apply-outfit-btn');
        this.removeOutfitBtn = document.getElementById('remove-outfit-btn');
        
        // Navigation elements
        this.overlay = document.getElementById('overlay');
        this.prevSceneBtn = document.getElementById('prev-scene-btn');
        this.nextSceneBtn = document.getElementById('next-scene-btn');
        this.sceneSelector = document.getElementById('scene-selector');
        
        // Initialize AnimalManager now that DOM elements are ready
        this.animalManager = new AnimalManager(this.charactersContainer);
    }

    /**
     * Initialize the game - load data and set up the initial state
     * @returns {Promise<void>}
     */
    async init() {
        try {
            await this.loadGameData();
            this.setupEventListeners();
            this.updateScene();
            console.log('Game initialized successfully!');
        } catch (error) {
            console.error('Error initializing game:', error);
            alert('Error loading game. Please check the console for details.');
        }
    }

    /**
     * Load all game data in parallel
     * @private
     * @returns {Promise<void>}
     */
    async loadGameData() {
        await Promise.all([
            this.sceneManager.loadScenes(),
            this.characterManager.loadCharacters(),
            this.dialogueManager.loadDialogue(),
            this.wardrobeManager.loadOutfits()
        ]);
    }

    /**
     * Set up all event listeners
     * @private
     */
    setupEventListeners() {
        this.setupSceneNavigationListeners();
        this.setupWardrobeListeners();
        this.setupDialogueListeners();
        this.setupKeyboardListeners();
    }

    /**
     * Set up scene navigation event listeners
     * @private
     */
    setupSceneNavigationListeners() {
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
    }

    /**
     * Set up wardrobe-related event listeners
     * @private
     */
    setupWardrobeListeners() {
        this.wardrobeBtn.addEventListener('click', () => {
            this.openWardrobe();
        });

        this.wardrobeCloseBtn.addEventListener('click', () => {
            this.wardrobeManager.closeWardrobe(this.wardrobePanel, this.overlay);
        });

        this.overlay.addEventListener('click', () => {
            this.wardrobeManager.closeWardrobe(this.wardrobePanel, this.overlay);
            this.dialogueManager.hideDialogue(this.dialogueBox, this.overlay);
        });

        this.applyOutfitBtn.addEventListener('click', () => {
            this.handleApplyOutfit();
        });

        this.removeOutfitBtn.addEventListener('click', () => {
            this.handleRemoveOutfit();
        });
    }

    /**
     * Open the wardrobe panel
     * @private
     */
    openWardrobe() {
        const currentScene = this.sceneManager.getCurrentScene();
        const characterId = this.getWardrobeCharacterId(currentScene);
        
        if (characterId && this.characterManager.characters.length > 0) {
            this.wardrobeManager.openWardrobe(
                characterId,
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

    /**
     * Get the character ID to use for wardrobe
     * @private
     * @param {Object} currentScene - The current scene object
     * @returns {string|null} Character ID or null
     */
    getWardrobeCharacterId(currentScene) {
        if (currentScene && currentScene.characters && currentScene.characters.length > 0) {
            return currentScene.characters[0];
        }
        if (this.characterManager.characters.length > 0) {
            return this.characterManager.characters[0].id;
        }
        return null;
    }

    /**
     * Handle applying an outfit to a character
     * @private
     */
    handleApplyOutfit() {
        const outfit = this.wardrobeManager.getSelectedOutfit();
        const characterId = this.wardrobeManager.getSelectedCharacter();
        
        if (outfit && characterId) {
            this.characterManager.setCharacterOutfit(characterId, outfit.id);
            this.characterManager.updateCharacterOutfit(characterId, outfit.image);
            this.updateScene();
        }
    }

    /**
     * Handle removing an outfit from a character
     * @private
     */
    handleRemoveOutfit() {
        const characterId = this.wardrobeManager.getSelectedCharacter();
        
        if (characterId) {
            this.characterManager.resetCharacterOutfit(characterId);
            this.updateScene();
        }
    }

    /**
     * Set up dialogue-related event listeners
     * @private
     */
    setupDialogueListeners() {
        this.dialogueContinueBtn.addEventListener('click', () => {
            this.dialogueManager.hideDialogue(this.dialogueBox, this.overlay);
        });
    }

    /**
     * Set up keyboard event listeners
     * @private
     */
    setupKeyboardListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.dialogueBox.classList.contains('hidden')) {
                this.dialogueManager.hideDialogue(this.dialogueBox, this.overlay);
            }
        });
    }

    /**
     * Update the current scene display
     */
    updateScene() {
        const currentScene = this.sceneManager.getCurrentScene();
        if (!currentScene) return;

        this.renderSceneBackground(currentScene);
        this.renderCharacters(currentScene);
        this.renderSceneAnimals(currentScene);
        this.updateNavigationControls();
        this.updateSceneSelector();
    }

    /**
     * Render the scene background
     * @private
     * @param {Object} scene - The scene object to render
     */
    renderSceneBackground(scene) {
        this.sceneManager.displayScene(scene, this.sceneContainer, this.sceneBackground);
    }

    /**
     * Render characters in the current scene
     * @private
     * @param {Object} scene - The scene object
     */
    renderCharacters(scene) {
        this.characterManager.renderCharactersInScene(
            scene.id,
            this.charactersContainer,
            (characterId, characterName) => {
                this.handleCharacterClick(characterId, characterName);
            }
        );
    }

    /**
     * Render animals for the current scene
     * @private
     * @param {Object} scene - The scene object
     */
    renderSceneAnimals(scene) {
        this.animalManager.renderAnimalsForScene(scene.id);
    }

    /**
     * Update navigation button states
     * @private
     */
    updateNavigationControls() {
        this.prevSceneBtn.disabled = !this.sceneManager.canGoPrevious();
        this.nextSceneBtn.disabled = !this.sceneManager.canGoNext();
    }

    /**
     * Update the scene selector UI
     * @private
     */
    updateSceneSelector() {
        this.sceneSelector.innerHTML = '';
        const scenes = this.sceneManager.getAllScenes();
        const currentScene = this.sceneManager.getCurrentScene();

        scenes.forEach(scene => {
            const thumbnail = this.createSceneThumbnail(scene, currentScene);
            this.sceneSelector.appendChild(thumbnail);
        });
    }

    /**
     * Create a scene thumbnail button
     * @private
     * @param {Object} scene - Scene object
     * @param {Object} currentScene - Currently active scene
     * @returns {HTMLElement} Thumbnail button element
     */
    createSceneThumbnail(scene, currentScene) {
        const thumbnail = document.createElement('button');
        thumbnail.className = `scene-thumbnail ${scene.id === currentScene.id ? 'active' : ''}`;
        thumbnail.textContent = scene.name;
        thumbnail.addEventListener('click', () => {
            this.sceneManager.goToScene(scene.id);
            this.updateScene();
        });
        return thumbnail;
    }

    /**
     * Handle character click events
     * @param {string} characterId - ID of the clicked character
     * @param {string} characterName - Name of the clicked character
     */
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
            this.dialogueContinueBtn,
            this.overlay
        );
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
    game.init();
});
