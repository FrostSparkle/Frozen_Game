// Character Management System
export class CharacterManager {
    constructor() {
        this.characters = [];
        this.characterOutfits = {}; // Track current outfits per character (outfit IDs)
        this.characterOutfitImages = {}; // Track current outfit images per character
    }

    async loadCharacters() {
        try {
            const response = await fetch('data/characters.json');
            const data = await response.json();
            this.characters = data.characters;
            
            // Initialize outfit tracking
            this.characters.forEach(char => {
                this.characterOutfits[char.id] = char.outfit || char.defaultOutfit || 'default';
            });
            
            return this.characters;
        } catch (error) {
            console.error('Error loading characters:', error);
            return [];
        }
    }

    getCharacterById(characterId) {
        return this.characters.find(char => char.id === characterId);
    }

    getCharactersInScene(sceneId) {
        return this.characters.filter(char => {
            // Check if character has a position for this scene
            return char.position && char.position[sceneId];
        });
    }

    getCharacterSprite(characterId) {
        const character = this.getCharacterById(characterId);
        if (!character) return null;

        // Check if character has a custom outfit image applied
        if (this.characterOutfitImages[characterId]) {
            return this.characterOutfitImages[characterId];
        }
        
        // Return base sprite if no outfit is applied
        return character.sprite;
    }

    setCharacterOutfit(characterId, outfitId) {
        if (this.characterOutfits.hasOwnProperty(characterId)) {
            this.characterOutfits[characterId] = outfitId;
            return true;
        }
        return false;
    }

    getCharacterOutfit(characterId) {
        return this.characterOutfits[characterId] || 'default';
    }

    resetCharacterOutfit(characterId) {
        const character = this.getCharacterById(characterId);
        if (character) {
            this.characterOutfits[characterId] = character.defaultOutfit || 'default';
            // Clear the outfit image to return to base sprite
            delete this.characterOutfitImages[characterId];
            return true;
        }
        return false;
    }

    renderCharactersInScene(sceneId, container, onClickCallback) {
        // Clear existing characters
        container.innerHTML = '';

        const charactersInScene = this.getCharactersInScene(sceneId);
        
        charactersInScene.forEach(character => {
            const charElement = this.createCharacterElement(character, sceneId, onClickCallback);
            container.appendChild(charElement);
        });
    }

    createCharacterElement(character, sceneId, onClickCallback) {
        const charDiv = document.createElement('div');
        charDiv.className = 'character clickable';
        charDiv.dataset.characterId = character.id;
        charDiv.dataset.characterName = character.name;

        const position = character.position[sceneId];
        if (position) {
            charDiv.style.left = `${position.x}px`;
            charDiv.style.bottom = `${position.y}px`;
            // Apply scaling if specified
            const baseScale = position.scale || 1;
            charDiv.style.setProperty('--base-scale', baseScale);
            charDiv.style.transformOrigin = 'bottom center';
            // Set initial transform to match base scale (animation will override this)
            charDiv.style.transform = `scale(${baseScale})`;
        }

        const img = document.createElement('img');
        img.src = this.getCharacterSprite(character.id);
        img.alt = character.name;
        img.onerror = function() {
            // Fallback if image doesn't exist - create a placeholder
            this.style.display = 'none';
            charDiv.innerHTML = `<div style="width: 100px; height: 150px; background: rgba(255,255,255,0.8); border: 3px solid #667eea; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; color: #667eea;">${character.name}</div>`;
        };

        charDiv.appendChild(img);

        // Add click handler
        charDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            if (onClickCallback) {
                onClickCallback(character.id, character.name);
            }
        });

        return charDiv;
    }

    updateCharacterOutfit(characterId, outfitImage) {
        // Store the outfit image so it persists when scenes are re-rendered
        if (outfitImage) {
            this.characterOutfitImages[characterId] = outfitImage;
        } else {
            delete this.characterOutfitImages[characterId];
        }
        
        // Update the visual representation of the character
        const charElements = document.querySelectorAll(`[data-character-id="${characterId}"]`);
        charElements.forEach(element => {
            const img = element.querySelector('img');
            if (img && outfitImage) {
                img.src = outfitImage;
            }
        });
    }
}

