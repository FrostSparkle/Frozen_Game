// Scene Management System
export class SceneManager {
    constructor() {
        this.scenes = [];
        this.currentSceneIndex = 0;
        this.currentScene = null;
    }

    async loadScenes() {
        try {
            const response = await fetch('data/scenes.json');
            const data = await response.json();
            this.scenes = data.scenes.filter(scene => scene.unlocked);
            if (this.scenes.length > 0) {
                this.currentSceneIndex = 0;
                this.currentScene = this.scenes[0];
            }
            return this.scenes;
        } catch (error) {
            console.error('Error loading scenes:', error);
            return [];
        }
    }

    getCurrentScene() {
        return this.currentScene;
    }

    getSceneById(sceneId) {
        return this.scenes.find(scene => scene.id === sceneId);
    }

    nextScene() {
        if (this.currentSceneIndex < this.scenes.length - 1) {
            this.currentSceneIndex++;
            this.currentScene = this.scenes[this.currentSceneIndex];
            return this.currentScene;
        }
        return null;
    }

    previousScene() {
        if (this.currentSceneIndex > 0) {
            this.currentSceneIndex--;
            this.currentScene = this.scenes[this.currentSceneIndex];
            return this.currentScene;
        }
        return null;
    }

    goToScene(sceneId) {
        const index = this.scenes.findIndex(scene => scene.id === sceneId);
        if (index !== -1) {
            this.currentSceneIndex = index;
            this.currentScene = this.scenes[index];
            return this.currentScene;
        }
        return null;
    }

    displayScene(scene, sceneContainer, backgroundElement) {
        if (!scene) return;

        // Set background
        if (scene.background) {
            backgroundElement.style.backgroundImage = `url('${scene.background}')`;
        } else {
            // Fallback gradient if no image
            backgroundElement.style.background = 'linear-gradient(135deg, #87ceeb 0%, #e0f6ff 100%)';
        }
    }

    canGoNext() {
        return this.currentSceneIndex < this.scenes.length - 1;
    }

    canGoPrevious() {
        return this.currentSceneIndex > 0;
    }

    getAllScenes() {
        return this.scenes;
    }
}

