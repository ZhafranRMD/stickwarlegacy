const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.requestAnimationFrame = () => {};
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

eval(fs.readFileSync('audio.js', 'utf8'));
eval(fs.readFileSync('stickman.js', 'utf8'));
eval(fs.readFileSync('game.js', 'utf8'));

game.resize();
game.start(1, 'campaign');

// Train each unit
['miner', 'swordwrath', 'archidon', 'spearton', 'magikill', 'giant'].forEach(u => {
    game.spawnUnit(u, 'player', 350);
    game.spawnUnit(u, 'enemy', 2600);
});

// Set attack stance so they charge into each other
game.setStance('attack');

// Test manual control on a Spearton
const playerSpearton = game.units.find(u => u.type === 'spearton' && u.team === 'player');
if (playerSpearton) {
    game.selectUnit(playerSpearton);
    game.keys['Space'] = true; // attack
    game.triggerControlledAction();
    game.keys['KeyS'] = true; // block
}

console.log('Testing 300 frames of full war simulation...');
for (let i = 0; i < 300; i++) {
    game.update(0.016);
    game.render();
}

console.log('Simulation complete!');
console.log('Final units left:', game.units.filter(u => u.state !== 'dead').length);
console.log('Player statue HP:', Math.round(game.playerStatue.hp));
console.log('Enemy statue HP:', Math.round(game.enemyStatue.hp));
console.log('Gold mined:', game.stats.goldMined);
console.log('Enemies killed:', game.stats.enemiesKilled);
console.log('Deep simulation PASSED with 0 errors!');
