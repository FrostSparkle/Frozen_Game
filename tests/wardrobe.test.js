import { WardrobeManager } from '../js/wardrobe.js';
import { test, assert, assertEqual } from './testRunner.js';

function createButton(id) {
    const button = document.createElement('button');
    if (id) {
        button.id = id;
    }
    return button;
}

function createPanel(className = '') {
    const panel = document.createElement('div');
    if (className) {
        panel.className = className;
    }
    return panel;
}

function createOverlay(className = '') {
    return createPanel(className);
}

test('populateCharacterSelector adds options for each character', () => {
    const manager = new WardrobeManager();
    const select = document.createElement('select');
    const characters = [
        { id: 'char-a', name: 'Luna' },
        { id: 'char-b', name: 'Faye' },
        { id: 'char-c', name: 'Nova' }
    ];

    manager.populateCharacterSelector(select, characters);

    assertEqual(select.options.length, characters.length);
    assertEqual(select.options[0].value, 'char-a');
    assertEqual(select.options[1].textContent, 'Faye');
});

test('openWardrobe reveals panel and overlay and sets selected character', () => {
    const manager = new WardrobeManager();
    manager.outfits = [];

    const panel = createPanel('hidden');
    const overlay = createOverlay('hidden');
    const select = document.createElement('select');
    const categoriesList = document.createElement('div');
    const outfitsGrid = document.createElement('div');
    const applyBtn = createButton('apply-outfit-btn');
    const removeBtn = createButton('remove-outfit-btn');
    document.body.append(panel, overlay, select, categoriesList, outfitsGrid, applyBtn, removeBtn);

    const characters = [
        { id: 'char-a', name: 'Luna' },
        { id: 'char-b', name: 'Faye' }
    ];

    manager.openWardrobe(
        'char-a',
        panel,
        overlay,
        select,
        categoriesList,
        outfitsGrid,
        applyBtn,
        removeBtn,
        characters
    );

    assert(manager.getSelectedCharacter() === 'char-a', 'Selected character should be char-a');
    assert(!panel.classList.contains('hidden'), 'Panel should be visible');
    assert(!overlay.classList.contains('hidden'), 'Overlay should be visible');
    assertEqual(select.value, 'char-a');

    panel.remove();
    overlay.remove();
    select.remove();
    categoriesList.remove();
    outfitsGrid.remove();
    applyBtn.remove();
    removeBtn.remove();
});

test('updateWardrobeDisplay creates category buttons and disables apply button when no outfit selected', () => {
    const manager = new WardrobeManager();
    manager.outfits = [
        { id: 'out-1', name: 'Winter Cloak', category: 'winter', character: 'char-a', image: 'cloak.png' },
        { id: 'out-2', name: 'Star Dress', category: 'formal', character: 'char-a', image: 'dress.png' }
    ];

    const categoriesList = document.createElement('div');
    const outfitsGrid = document.createElement('div');
    const applyBtn = createButton('apply-outfit-btn');
    const removeBtn = createButton('remove-outfit-btn');

    manager.updateWardrobeDisplay('char-a', categoriesList, outfitsGrid, applyBtn, removeBtn);

    const categoryButtons = Array.from(categoriesList.querySelectorAll('button'));
    assertEqual(categoryButtons.length, 3, 'Includes All plus two categories');
    assertEqual(categoryButtons[0].textContent, 'All');
    assertEqual(outfitsGrid.children.length, 2);
    assert(applyBtn.disabled, 'Apply button should be disabled when no outfit selected');
    assert(removeBtn.disabled, 'Remove button should be disabled when no outfit selected');
});

test('createOutfitItem toggles selection state and updates selectedOutfit', () => {
    const manager = new WardrobeManager();
    const outfit = { id: 'out-1', name: 'Cosmic Cape', image: 'cape.png' };
    manager.outfits = [outfit];
    const item = manager.createOutfitItem(outfit);
    const applyBtn = createButton('apply-outfit-btn');
    const removeBtn = createButton('remove-outfit-btn');
    document.body.append(item, applyBtn, removeBtn);

    assertEqual(manager.getSelectedOutfit(), null);
    item.click();
    assertEqual(manager.getSelectedOutfit().id, 'out-1');
    assert(item.classList.contains('selected'), 'Item should be marked selected');

    item.click();
    assertEqual(manager.getSelectedOutfit(), null);
    assert(!item.classList.contains('selected'), 'Item should be unselected after second click');

    item.remove();
    applyBtn.remove();
    removeBtn.remove();
});

