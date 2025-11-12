// Wardrobe Management System
export class WardrobeManager {
    constructor() {
        this.outfits = [];
        this.selectedCharacter = null;
        this.selectedOutfit = null;
        this.selectedCategory = 'all';
    }

    async loadOutfits() {
        try {
            const response = await fetch('data/outfits.json');
            const data = await response.json();
            this.outfits = data.outfits;
            return this.outfits;
        } catch (error) {
            console.error('Error loading outfits:', error);
            return [];
        }
    }

    getOutfitsForCharacter(characterId) {
        return this.outfits.filter(outfit => outfit.character === characterId);
    }

    getOutfitsByCategory(characterId, category) {
        const characterOutfits = this.getOutfitsForCharacter(characterId);
        if (category === 'all') {
            return characterOutfits;
        }
        return characterOutfits.filter(outfit => outfit.category === category);
    }

    getCategoriesForCharacter(characterId) {
        const characterOutfits = this.getOutfitsForCharacter(characterId);
        const categories = new Set();
        characterOutfits.forEach(outfit => {
            categories.add(outfit.category);
        });
        return Array.from(categories);
    }

    openWardrobe(
        characterId,
        panel,
        overlay,
        characterSelect,
        categoriesList,
        outfitsGrid,
        applyBtn,
        removeBtn,
        characters = []
    ) {
        this.selectedCharacter = characterId;
        this.selectedOutfit = null;
        this.selectedCategory = 'all';

        // Show panel and overlay
        panel.classList.remove('hidden');
        overlay.classList.remove('hidden');

        // Populate character selector
        this.populateCharacterSelector(characterSelect, characters);

        // Set selected character visually
        if (characterSelect) {
            characterSelect.querySelectorAll('.character-select-btn').forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.characterId === characterId) {
                    btn.classList.add('active');
                }
            });
        }

        // Populate categories and outfits
        this.updateWardrobeDisplay(characterId, categoriesList, outfitsGrid, applyBtn, removeBtn);
    }

    closeWardrobe(panel, overlay) {
        panel.classList.add('hidden');
        overlay.classList.add('hidden');
        this.selectedCharacter = null;
        this.selectedOutfit = null;
    }

    populateCharacterSelector(characterSelect, characters = []) {
        if (!characterSelect) return;

        characterSelect.innerHTML = '';
        characters.forEach(character => {
            const charButton = document.createElement('button');
            charButton.className = `character-select-btn ${this.selectedCharacter === character.id ? 'active' : ''}`;
            charButton.dataset.characterId = character.id;
            
            const img = document.createElement('img');
            img.src = character.sprite;
            img.alt = character.name;
            img.onerror = function() {
                // Fallback if image doesn't exist
                this.style.display = 'none';
                charButton.innerHTML = `<span>${character.name}</span>`;
            };
            
            const name = document.createElement('span');
            name.className = 'character-select-name';
            name.textContent = character.name;
            
            charButton.appendChild(img);
            charButton.appendChild(name);
            
            charButton.onclick = () => {
                // Remove active class from all buttons
                characterSelect.querySelectorAll('.character-select-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                // Add active class to clicked button
                charButton.classList.add('active');
                // Update selected character
                this.selectedCharacter = character.id;
                this.selectedOutfit = null;
                // Update wardrobe display
                const categoriesList = document.getElementById('outfit-categories-list');
                const outfitsGrid = document.getElementById('outfits-grid');
                const applyBtn = document.getElementById('apply-outfit-btn');
                const removeBtn = document.getElementById('remove-outfit-btn');
                this.updateWardrobeDisplay(character.id, categoriesList, outfitsGrid, applyBtn, removeBtn);
            };
            
            characterSelect.appendChild(charButton);
        });
    }

    updateWardrobeDisplay(characterId, categoriesList, outfitsGrid, applyBtn, removeBtn) {
        // Get categories for this character
        const categories = this.getCategoriesForCharacter(characterId);
        
        // Populate categories
        if (categoriesList) {
            categoriesList.innerHTML = '';
            
            // Add "All" category
            const allBtn = document.createElement('button');
            allBtn.className = `category-btn ${this.selectedCategory === 'all' ? 'active' : ''}`;
            allBtn.textContent = 'All';
            allBtn.onclick = () => {
                this.selectedCategory = 'all';
                this.updateWardrobeDisplay(characterId, categoriesList, outfitsGrid, applyBtn, removeBtn);
            };
            categoriesList.appendChild(allBtn);

            // Add category buttons
            categories.forEach(category => {
                const btn = document.createElement('button');
                btn.className = `category-btn ${this.selectedCategory === category ? 'active' : ''}`;
                btn.textContent = category.charAt(0).toUpperCase() + category.slice(1);
                btn.onclick = () => {
                    this.selectedCategory = category;
                    this.updateWardrobeDisplay(characterId, categoriesList, outfitsGrid, applyBtn, removeBtn);
                };
                categoriesList.appendChild(btn);
            });
        }

        // Populate outfits grid
        if (outfitsGrid) {
            outfitsGrid.innerHTML = '';
            const filteredOutfits = this.getOutfitsByCategory(characterId, this.selectedCategory);

            if (filteredOutfits.length === 0) {
                outfitsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #718096;">No outfits in this category.</p>';
            } else {
                filteredOutfits.forEach(outfit => {
                    const outfitItem = this.createOutfitItem(outfit);
                    outfitsGrid.appendChild(outfitItem);
                });
            }
        }

        // Update button states
        if (applyBtn) {
            applyBtn.disabled = !this.selectedOutfit;
        }
        if (removeBtn) {
            removeBtn.disabled = !this.selectedOutfit;
        }
    }

    createOutfitItem(outfit) {
        const item = document.createElement('div');
        item.className = 'outfit-item';
        if (this.selectedOutfit === outfit.id) {
            item.classList.add('selected');
        }

        item.onclick = () => {
            // Toggle selection
            if (this.selectedOutfit === outfit.id) {
                this.selectedOutfit = null;
                item.classList.remove('selected');
            } else {
                // Remove selection from other items
                document.querySelectorAll('.outfit-item').forEach(el => el.classList.remove('selected'));
                this.selectedOutfit = outfit.id;
                item.classList.add('selected');
            }

            // Update button states
            const applyBtn = document.getElementById('apply-outfit-btn');
            const removeBtn = document.getElementById('remove-outfit-btn');
            if (applyBtn) applyBtn.disabled = !this.selectedOutfit;
            if (removeBtn) removeBtn.disabled = !this.selectedOutfit;
        };

        const img = document.createElement('img');
        img.src = outfit.image;
        img.alt = outfit.name;
        img.onerror = function() {
            // Placeholder if image doesn't exist
            this.style.display = 'none';
            item.innerHTML = `<div style="width: 100%; height: 120px; background: rgba(102, 126, 234, 0.1); border: 2px dashed #667eea; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; color: #667eea; text-align: center; padding: 10px;">${outfit.name}</div>`;
        };

        const name = document.createElement('div');
        name.className = 'outfit-name';
        name.textContent = outfit.name;

        item.appendChild(img);
        item.appendChild(name);

        return item;
    }

    getSelectedOutfit() {
        if (!this.selectedOutfit) return null;
        return this.outfits.find(outfit => outfit.id === this.selectedOutfit);
    }

    getSelectedCharacter() {
        return this.selectedCharacter;
    }
}

