import { CharacterManager } from '../js/characters.js';
import { test, assertEqual, assert } from './testRunner.js';

function createCharacter({
    id = 'char-a',
    name = 'Luna',
    defaultOutfit = 'default',
    sprite = 'assets/images/characters/luna.png',
    position = { 'scene-1': { x: 10, y: 20 } }
} = {}) {
    return { id, name, defaultOutfit, sprite, position };
}

test('setCharacterOutfit updates the stored outfit and returns true', () => {
    const manager = new CharacterManager();
    manager.characters = [createCharacter()];
    manager.characterOutfits = { 'char-a': 'default' };

    const result = manager.setCharacterOutfit('char-a', 'star-dress');
    assert(result, 'Should return true when outfit exists');
    assertEqual(manager.getCharacterOutfit('char-a'), 'star-dress');
});

test('resetCharacterOutfit restores default outfit', () => {
    const manager = new CharacterManager();
    manager.characters = [createCharacter()];
    manager.characterOutfits = { 'char-a': 'star-dress' };

    const resetResult = manager.resetCharacterOutfit('char-a');
    assert(resetResult, 'Reset should succeed');
    assertEqual(manager.getCharacterOutfit('char-a'), 'default');
});

test('getCharactersInScene filters by available position data', () => {
    const manager = new CharacterManager();
    manager.characters = [
        createCharacter({ id: 'char-a', position: { 'scene-1': { x: 0, y: 0 } } }),
        createCharacter({ id: 'char-b', position: { 'scene-2': { x: 10, y: 0 } } })
    ];

    const sceneOneCharacters = manager.getCharactersInScene('scene-1');
    assertEqual(sceneOneCharacters.length, 1);
    assertEqual(sceneOneCharacters[0].id, 'char-a');
});

test('getCharacterSprite returns sprite path for known character', () => {
    const manager = new CharacterManager();
    manager.characters = [createCharacter({ sprite: 'sprite.png' })];

    const sprite = manager.getCharacterSprite('char-a');
    assertEqual(sprite, 'sprite.png');
});

