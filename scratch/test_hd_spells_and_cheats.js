const fs = require('fs');

global.window = global;
global.window.addEventListener = () => {};
global.requestAnimationFrame = () => {};
global.window.devicePixelRatio = 2;

const mockCtx = {
    save: () => {},
    restore: () => {},
    translate: () => {},
    scale: () => {},
    setTransform: () => {},
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
        querySelector: () => ({ innerText: '', classList: { add: () => {}, remove: () => {} } }),
        focus: () => {}
    }),
    querySelectorAll: () => [],
    addEventListener: () => {}
};

eval(fs.readFileSync('audio.js', 'utf8'));
eval(fs.readFileSync('stickman.js', 'utf8'));
eval(fs.readFileSync('game.js', 'utf8'));

console.log('=== 1. TESTING HD GRAPHICS MODE ===');
console.log('Initial isHD:', game.isHD, 'DPR:', game.dpr);
if (!game.isHD) throw new Error('Default HD should be true');
game.toggleHD();
console.log('After toggleHD() -> isHD:', game.isHD);
if (game.isHD) throw new Error('Toggle HD should disable');
game.toggleHD();
console.log('Re-enabled HD -> isHD:', game.isHD);
if (!game.isHD) throw new Error('Re-enabled HD should be true');

console.log('\n=== 2. TESTING CHEATS: NOPOPUATION & SPELLOL ===');
game.start(1, 'campaign', 'medium');

// Test nopopuation
console.log('Testing nopopuation...');
game.applyCheat('nopopuation');
if (!game.cheats.noPopulation || game.maxPopulation < 9999) {
    throw new Error('nopopuation cheat failed');
}
console.log('nopopuation active! Max population:', game.maxPopulation);

// Also test alternate spelling nopopulation
game.applyCheat('nopopulation'); // toggles off
if (game.cheats.noPopulation) throw new Error('Toggle nopopulation failed');
game.applyCheat('nopopulation'); // toggles back on
if (!game.cheats.noPopulation) throw new Error('nopopulation on failed');

// Test spellol
console.log('Testing spellol...');
game.applyCheat('spellol');
if (!game.cheats.infiniteSpells) {
    throw new Error('spellol cheat failed');
}
if (game.spells.minerHustle.stock !== 99 || game.spells.arrowRain.stock !== 99) {
    throw new Error('spellol stock failed');
}
console.log('spellol active! Spells stock:', game.spells.minerHustle.stock);

console.log('\n=== 3. TESTING POPULATION LIMIT BYPASS ===');
game.applyCheat('minegoldrich');
game.applyCheat('cooldownnotspawn');
for (let i = 0; i < 45; i++) {
    game.trainUnit('swordwrath');
}
console.log('Trained 45 units with nopopuation! Total units:', game.units.length);
if (game.units.length < 45) {
    throw new Error('Training past 35 units failed with nopopuation');
}

console.log('\n=== 4. TESTING ALL 5 SPELLS ===');

// Spell 1: Miner Hustle (Q)
console.log('Casting Miner Hustle...');
game.castSpell('minerHustle');
if (game.spells.minerHustle.activeTimer <= 0) {
    throw new Error('Miner hustle activeTimer failed');
}
console.log('Miner Hustle active! Timer:', game.spells.minerHustle.activeTimer);

// Spell 2: Arrow Rain (W)
console.log('Casting Arrow Rain...');
const initialProjCount = game.projectiles.length;
game.castSpell('arrowRain');
console.log('Arrow Rain cast! Initial projectiles:', initialProjCount);

// Spell 3: Healing Wave (E)
console.log('Casting Healing Wave...');
game.playerStatue.hp = 500;
game.castSpell('healWave');
if (game.playerStatue.hp <= 500) {
    throw new Error('Healing wave failed to heal statue');
}
console.log('Healing Wave cast! Statue HP after heal:', game.playerStatue.hp);

// Spell 4: Sword Rage (F)
console.log('Casting Sword Rage...');
game.castSpell('swordRage');
if (game.spells.swordRage.activeTimer <= 0) {
    throw new Error('Sword rage activeTimer failed');
}
const enragedUnits = game.units.filter(u => u.team === 'player' && u.rageTimer > 0);
console.log('Sword Rage active! Enraged units count:', enragedUnits.length);
if (enragedUnits.length === 0) {
    throw new Error('No units were enraged by Sword Rage');
}

// Spell 5: Golden Spartan (T)
console.log('Casting Golden Spartan...');
game.castSpell('goldenSpearton');
const goldenUnits = game.units.filter(u => u.isGolden);
if (goldenUnits.length === 0) {
    throw new Error('Golden Spartan spawn failed');
}
console.log('Golden Spartan successfully summoned! HP:', goldenUnits[0].hp, 'Scale:', goldenUnits[0].scale);

console.log('\n=== 5. RUNNING 120 GAME FRAMES SIMULATION ===');
for (let frame = 0; frame < 120; frame++) {
    game.update(0.016);
    game.render();
}
console.log('120 simulation frames completed smoothly without errors!');
console.log('Ambient HD particles count:', game.ambientParticles.length);
console.log('Projectiles processed:', game.projectiles.length);

console.log('\n ALL TESTS PASSED SUCCESSFULLY! 100% VERIFIED!');
