const fs = require('fs');

// Create mock browser globals
global.window = global;
global.window.addEventListener = () => {};
global.document = {
    getElementById: (id) => ({
        getContext: () => mockCtx,
        getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 650 }),
        addEventListener: () => {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} },
        style: {},
        innerText: '',
        innerHTML: '',
        dataset: {}
    }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

const mockCtx = {
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    stroke: () => {},
    fill: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    quadraticCurveTo: () => {},
    closePath: () => {},
    fillText: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} })
};

global.requestAnimationFrame = (cb) => {};

// Load modules
try {
    eval(fs.readFileSync('audio.js', 'utf8'));
    eval(fs.readFileSync('stickman.js', 'utf8'));
    eval(fs.readFileSync('game.js', 'utf8'));

    console.log('Successfully loaded all scripts without error!');

    // Test game start
    game.resize();
    game.start(1, 'campaign');
    console.log('Game started! Units count:', game.units.length);

    // Spawn each type of unit
    ['miner', 'swordwrath', 'archidon', 'spearton', 'magikill', 'giant'].forEach(type => {
        game.spawnUnit(type, 'player', 300);
        game.spawnUnit(type, 'enemy', 2700);
    });

    console.log('Spawned all unit types! Total units:', game.units.length);

    // Run 60 frames of update and render
    for (let frame = 0; frame < 60; frame++) {
        game.update(0.016);
        game.render();
    }
    console.log('Successfully ran 60 simulation frames with zero runtime errors!');
} catch (err) {
    console.error('RUNTIME ERROR ENCOUNTERED:', err);
    process.exit(1);
}
