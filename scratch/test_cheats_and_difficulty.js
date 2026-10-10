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
        dataset: {},
        focus: () => {}
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

console.log('Testing Easy Difficulty...');
game.start(1, 'campaign', 'easy');
console.log('Easy Player Gold:', game.gold, 'Player Statue HP:', game.playerStatue.maxHp, 'Enemy Statue HP:', game.enemyStatue.maxHp);
if (game.gold !== 1000 || game.enemyStatue.maxHp !== 800) {
    throw new Error('Easy difficulty params incorrect');
}

console.log('Testing Hard Difficulty...');
game.start(1, 'campaign', 'hard');
console.log('Hard Player Gold:', game.gold, 'Enemy Statue HP:', game.enemyStatue.maxHp);
if (game.gold !== 350 || game.enemyStatue.maxHp !== 1600) {
    throw new Error('Hard difficulty params incorrect');
}

console.log('Testing Cheat minegoldrich...');
game.applyCheat('minegoldrich');
if (!game.cheats.infiniteGold || game.gold < 999999) {
    throw new Error('minegoldrich cheat failed');
}
console.log('Infinite Gold Active! Gold:', game.gold);

console.log('Testing Cheat cooldownnotspawn...');
game.applyCheat('cooldownnotspawn');
if (!game.cheats.noCooldown) {
    throw new Error('cooldownnotspawn cheat failed');
}
console.log('No Cooldown Active!');

// Train 10 Giants instantly with cheats!
console.log('Spawning 10 Giants with cheats active...');
for (let i = 0; i < 10; i++) {
    game.trainUnit('giant');
}
console.log('Giants spawned! Total units:', game.units.length);

// Run 100 game simulation frames
for (let i = 0; i < 100; i++) {
    game.update(0.016);
    game.render();
}

console.log('Cheat & Difficulty Test PASSED with 100% success!');
