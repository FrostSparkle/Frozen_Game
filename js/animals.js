// Animal Management System
import { GAME_CONFIG } from './config.js';

/**
 * Manages rendering and interactions for animals in scenes
 */
export class AnimalManager {
    /**
     * Initialize the AnimalManager
     * @param {HTMLElement} container - Container element to render animals in
     */
    constructor(container) {
        this.container = container;
        this.renderedAnimals = new Map(); // Track rendered animals by ID
    }

    /**
     * Render animals for a specific scene
     * @param {string} sceneId - ID of the scene to render animals for
     */
    renderAnimalsForScene(sceneId) {
        const animals = GAME_CONFIG.animals;
        
        // Render each animal if it should appear in this scene
        Object.keys(animals).forEach(animalId => {
            const animalConfig = animals[animalId];
            if (animalConfig.scenes.includes(sceneId)) {
                this.renderAnimal(animalId, sceneId, animalConfig);
            } else {
                this.removeAnimal(animalId);
            }
        });
    }

    /**
     * Render a specific animal in a scene
     * @private
     * @param {string} animalId - ID of the animal
     * @param {string} sceneId - ID of the scene
     * @param {Object} config - Animal configuration
     */
    renderAnimal(animalId, sceneId, config) {
        // Remove existing instance if any
        this.removeAnimal(animalId);

        const position = config.position[sceneId];
        if (!position) {
            console.warn(`No position configured for ${animalId} in scene: ${sceneId}`);
            return;
        }

        const animalElement = this.createAnimalElement(animalId, config, position);
        const img = this.createAnimalImage(config);
        animalElement.appendChild(img);

        this.attachAnimalInteractions(animalElement, config);
        this.container.appendChild(animalElement);
        
        // Track rendered animal
        this.renderedAnimals.set(animalId, animalElement);
    }

    /**
     * Create an animal container element
     * @private
     * @param {string} animalId - ID of the animal
     * @param {Object} config - Animal configuration
     * @param {Object} position - Position object with x and y
     * @returns {HTMLElement} Animal container div
     */
    createAnimalElement(animalId, config, position) {
        const div = document.createElement('div');
        div.id = `${animalId}-element`;
        div.className = `${animalId} clickable`;
        
        // Apply position
        div.style.position = 'absolute';
        div.style.left = `${position.x}px`;
        div.style.bottom = `${position.y}px`;
        
        // Apply styling
        div.style.cursor = 'pointer';
        div.style.zIndex = config.zIndex || 15;
        div.style.transition = GAME_CONFIG.animations.hoverTransition;
        div.style.transformOrigin = GAME_CONFIG.animations.transformOrigin;
        
        return div;
    }

    /**
     * Create an animal image element
     * @private
     * @param {Object} config - Animal configuration
     * @returns {HTMLElement} Image element
     */
    createAnimalImage(config) {
        const img = document.createElement('img');
        img.src = config.image;
        img.alt = 'Animal';
        img.style.height = `${config.size.height}px`;
        img.style.width = config.size.width;
        img.style.display = 'block';
        img.style.filter = GAME_CONFIG.effects.dropShadow;
        img.style.userSelect = 'none';
        img.style.pointerEvents = 'none';
        
        return img;
    }

    /**
     * Attach hover and click interactions to an animal element
     * @private
     * @param {HTMLElement} element - Animal element
     * @param {Object} config - Animal configuration
     */
    attachAnimalInteractions(element, config) {
        const hoverScale = config.hoverScale || 1.1;
        
        element.addEventListener('mouseenter', () => {
            element.style.transform = `scale(${hoverScale})`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'scale(1)';
        });
        
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.playAnimalSound(config.sound);
        });
    }

    /**
     * Remove a specific animal from the scene
     * @param {string} animalId - ID of the animal to remove
     */
    removeAnimal(animalId) {
        const animalElement = document.getElementById(`${animalId}-element`);
        if (animalElement) {
            animalElement.remove();
            this.renderedAnimals.delete(animalId);
        }
    }

    /**
     * Remove all animals from the scene
     */
    removeAllAnimals() {
        this.renderedAnimals.forEach((element, animalId) => {
            this.removeAnimal(animalId);
        });
    }

    /**
     * Play an animal sound
     * @private
     * @param {string} soundPath - Path to the sound file
     */
    playAnimalSound(soundPath) {
        try {
            const audio = new Audio(soundPath);
            audio.play().catch(error => {
                console.error('Error playing animal sound:', error);
            });
        } catch (error) {
            console.error('Error creating audio:', error);
        }
    }
}

