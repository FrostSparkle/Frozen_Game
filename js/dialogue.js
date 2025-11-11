// Dialogue Management System
export class DialogueManager {
    constructor() {
        this.dialogue = [];
        this.currentDialogue = null;
        this.dialogueQueue = [];
    }

    async loadDialogue() {
        try {
            const response = await fetch('data/dialogue.json');
            const data = await response.json();
            this.dialogue = data.dialogue;
            return this.dialogue;
        } catch (error) {
            console.error('Error loading dialogue:', error);
            return [];
        }
    }

    getDialogueForCharacter(sceneId, characterId) {
        // Find dialogue entries for this character in this scene
        const matchingDialogue = this.dialogue.filter(
            d => d.scene === sceneId && d.character === characterId
        );

        if (matchingDialogue.length === 0) {
            // Return default dialogue if none found
            return [{
                id: 'default',
                scene: sceneId,
                character: characterId,
                text: "Hello! It's nice to see you!",
                next: null
            }];
        }

        // Return the first dialogue entry (can be extended for multiple options)
        return matchingDialogue;
    }

    getDialogueById(dialogueId) {
        return this.dialogue.find(d => d.id === dialogueId);
    }

    showDialogue(characterName, text, dialogueBox, characterNameElement, textElement, continueBtn) {
        if (!dialogueBox || !characterNameElement || !textElement) return;

        characterNameElement.textContent = characterName;
        textElement.textContent = text;
        
        dialogueBox.classList.remove('hidden');

        // Set up continue button
        if (continueBtn) {
            continueBtn.onclick = () => {
                this.hideDialogue(dialogueBox);
            };
        }
    }

    hideDialogue(dialogueBox) {
        if (dialogueBox) {
            dialogueBox.classList.add('hidden');
        }
        this.currentDialogue = null;
    }

    showDialogueSequence(dialogueEntries, dialogueBox, characterNameElement, textElement, continueBtn, onComplete) {
        if (!dialogueEntries || dialogueEntries.length === 0) {
            if (onComplete) onComplete();
            return;
        }

        let currentIndex = 0;

        const showNext = () => {
            if (currentIndex >= dialogueEntries.length) {
                this.hideDialogue(dialogueBox);
                if (onComplete) onComplete();
                return;
            }

            const entry = dialogueEntries[currentIndex];
            const character = entry.character || 'Character';
            const text = entry.text || '...';

            this.showDialogue(character, text, dialogueBox, characterNameElement, textElement, continueBtn);

            // Update continue button to show next dialogue
            continueBtn.onclick = () => {
                currentIndex++;
                if (currentIndex < dialogueEntries.length) {
                    showNext();
                } else {
                    this.hideDialogue(dialogueBox);
                    if (onComplete) onComplete();
                }
            };
        };

        showNext();
    }

    handleCharacterClick(sceneId, characterId, characterName, dialogueBox, characterNameElement, textElement, continueBtn) {
        const dialogueEntries = this.getDialogueForCharacter(sceneId, characterId);
        
        if (dialogueEntries && dialogueEntries.length > 0) {
            // If dialogue has a "next" field, follow the chain
            const firstEntry = dialogueEntries[0];
            
            if (firstEntry.next) {
                // Build dialogue chain
                const chain = [firstEntry];
                let currentId = firstEntry.next;
                
                while (currentId) {
                    const nextDialogue = this.getDialogueById(currentId);
                    if (nextDialogue) {
                        chain.push(nextDialogue);
                        currentId = nextDialogue.next;
                    } else {
                        break;
                    }
                }
                
                this.showDialogueSequence(chain, dialogueBox, characterNameElement, textElement, continueBtn);
            } else {
                // Single dialogue entry
                this.showDialogue(characterName, firstEntry.text, dialogueBox, characterNameElement, textElement, continueBtn);
            }
        } else {
            // Default dialogue
            this.showDialogue(characterName, "Hello! It's nice to see you!", dialogueBox, characterNameElement, textElement, continueBtn);
        }
    }
}

