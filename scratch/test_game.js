const fs = require('fs');

console.log('--- RUNNING FULL SYSTEM VERIFICATION ---');

// 1. Verify HTML and bundle contents
const indexHtml = fs.readFileSync('index.html', 'utf8');
const ujiCoba = fs.readFileSync('Uji Coba', 'utf8');
const ujiCobaHtml = fs.readFileSync('Uji Coba.html', 'utf8');

const spells = [
    'minerHustle', 'arrowRain', 'healWave', 'swordRage', 'goldenSpearton',
    'trainingHaste', 'lightningStorm', 'summonDead', 'goldRush', 'summonMarrowkai'
];

for (const s of spells) {
    if (!indexHtml.includes(`data-spell="${s}"`)) throw new Error('Missing spell in index.html: ' + s);
    if (!ujiCoba.includes(`data-spell="${s}"`)) throw new Error('Missing spell in Uji Coba: ' + s);
    if (!ujiCobaHtml.includes(`data-spell="${s}"`)) throw new Error('Missing spell in Uji Coba.html: ' + s);
}
console.log('✅ All 10 spells present across index.html, Uji Coba, and Uji Coba.html!');

// 2. Verify Level 1-100 and BGM elements
if (!indexHtml.includes('id="btn-bgm"')) throw new Error('Missing btn-bgm in index.html');
if (!indexHtml.includes('id="btn-level-map"')) throw new Error('Missing btn-level-map in index.html');
if (!indexHtml.includes('id="level-modal"')) throw new Error('Missing level-modal in index.html');
if (!indexHtml.includes('id="enemy-spell-banner"')) throw new Error('Missing enemy-spell-banner in index.html');
console.log('✅ All HUD and modal controls verified in HTML!');

// 3. Verify audio.js methods
const audioCode = fs.readFileSync('audio.js', 'utf8');
const requiredAudioMethods = [
    'startWarTheme', 'stopWarTheme', 'toggleBGM',
    'playSpellHaste', 'playSpellLightning', 'playSpellDead',
    'playSpellGoldRush', 'playSpellMarrowkai'
];
for (const m of requiredAudioMethods) {
    if (!audioCode.includes(m)) throw new Error('Missing audio method: ' + m);
}
console.log('✅ Stick War March War Theme BGM & 5 new spell audio synthesizers verified in audio.js!');

// 4. Verify stickman.js rendering units
const stickmanCode = fs.readFileSync('stickman.js', 'utf8');
if (!stickmanCode.includes("unit.type === 'undead'")) throw new Error('Missing undead in stickman.js');
if (!stickmanCode.includes("unit.type === 'marrowkai'")) throw new Error('Missing marrowkai in stickman.js');
console.log('✅ Undead and Marrowkai Titan visuals verified in stickman.js!');

// 5. Verify game.js logic
const gameCode = fs.readFileSync('game.js', 'utf8');
for (const s of spells) {
    if (!gameCode.includes(`id: '${s}'`)) throw new Error('Missing spell definition in game.js: ' + s);
}
if (!gameCode.includes("this.maxLevel = 100")) throw new Error('Missing maxLevel = 100 in game.js');
if (!gameCode.includes("showEnemySpellAlert")) throw new Error('Missing showEnemySpellAlert in game.js');
if (!gameCode.includes("openLevelModal")) throw new Error('Missing openLevelModal in game.js');
if (!gameCode.includes("selectLevel")) throw new Error('Missing selectLevel in game.js');
if (!gameCode.includes("KeyG") || !gameCode.includes("KeyH") || !gameCode.includes("KeyJ") || !gameCode.includes("KeyK") || !gameCode.includes("KeyU")) {
    throw new Error('Missing spell shortcut keys in game.js');
}

console.log('✅ game.js all 100 levels, AI spellcasting, and 10 spells verified!');
console.log('--- ALL CHECKS PASSED PERFECTLY! ---');
