const fs = require('fs');

const mockCanvas = {
    getContext: () => ({
        save: () => {}, restore: () => {}, translate: () => {}, scale: () => {},
        beginPath: () => {}, closePath: () => {}, moveTo: () => {}, lineTo: () => {},
        arc: () => {}, fill: () => {}, stroke: () => {}, fillRect: () => {},
        strokeRect: () => {}, clearRect: () => {}, createLinearGradient: () => ({ addColorStop: () => {} }),
        fillText: () => {}, measureText: () => ({ width: 10 }), setLineDash: () => {}
    }),
    width: 1200,
    height: 600,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 600 }),
    addEventListener: () => {}
};

const mockStorage = {};
const mockLocalStorage = {
    getItem: (k) => mockStorage[k] || null,
    setItem: (k, v) => { mockStorage[k] = v; },
    removeItem: (k) => { delete mockStorage[k]; }
};

const jsdom = {
    window: {
        soundCtrl: {
            playEmergencyAlert: () => {},
            playOrderHorn: () => {},
            playBowShoot: () => {},
            playSpellArrowRain: () => {},
            playSpellLightning: () => {}
        },
        addEventListener: () => {},
        innerWidth: 1200,
        innerHeight: 600,
        localStorage: mockLocalStorage
    },
    document: {
        getElementById: (id) => {
            if (id === 'gameCanvas') return mockCanvas;
            return {
                classList: { add: () => {}, remove: () => {}, toggle: () => {} },
                innerText: '',
                style: {},
                dataset: {},
                getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 600 }),
                addEventListener: () => {}
            };
        },
        querySelectorAll: () => [],
        createElement: () => ({
            classList: { add: () => {} },
            appendChild: () => {},
            addEventListener: () => {},
            getBoundingClientRect: () => ({ left: 0, top: 0, width: 100, height: 50 })
        })
    }
};

global.window = jsdom.window;
global.document = jsdom.document;
global.localStorage = mockLocalStorage;
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

const vm = require('vm');
const code = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(code);

const game = new StickWarGame(mockCanvas);
game.running = true;

let passed = true;

// Test 1: Garrison Entry & Archers
console.log('--- Testing Castle Garrison Entry & Archers ---');
game.castleArchers = {
    player: { x: 750, y: 360, timer: 0, count: 0 },
    enemy: { x: 4250, y: 360, timer: 0, count: 0 }
};
game.garrisonedUnits = { player: [], enemy: [] };

for (let i = 1; i <= 12; i++) {
    const dummy = { team: 'player', type: 'spearton', x: 760, state: 'walk', hp: 100 };
    game.units.push(dummy);
    game.handleUnitGarrison(dummy);
    const expectedArchers = Math.min(4, Math.floor(i / 3));
    if (game.castleArchers.player.count !== expectedArchers) {
        console.error('FAIL Garrison Entry i=' + i + ': expected ' + expectedArchers + ', got ' + game.castleArchers.player.count);
        passed = false;
    }
}
console.log('12 units entered -> Archers count:', game.castleArchers.player.count, '(Expected: 4)');
if (game.castleArchers.player.count !== 4) passed = false;

// Test 2: Garrison Partial & Full Exit
console.log('--- Testing Garrison Exit (3 units out -> 1 archer lost) ---');
game.releaseGarrisonedUnits('player', 3);
console.log('3 units released -> Remaining garrison:', game.garrisonedUnits.player.length, 'Archers:', game.castleArchers.player.count, '(Expected: 3)');
if (game.castleArchers.player.count !== 3) passed = false;

game.releaseGarrisonedUnits('player', 3);
console.log('3 more units released -> Remaining garrison:', game.garrisonedUnits.player.length, 'Archers:', game.castleArchers.player.count, '(Expected: 2)');
if (game.castleArchers.player.count !== 2) passed = false;

console.log('--- Testing Garrison Full Exit ---');
game.releaseGarrisonedUnits('player');
console.log('All released -> Remaining garrison:', game.garrisonedUnits.player.length, 'Archers:', game.castleArchers.player.count, '(Expected: 0)');
if (game.castleArchers.player.count !== 0) passed = false;

// Check that released units are in game.units with proper state & cooldown
const releasedPlayer = game.units.filter(u => u.team === 'player');
const hasBug = releasedPlayer.some(u => u.inCastle || u.state !== 'walk' || u.garrisonCooldown <= 0);
console.log('Units walk status & garrisonCooldown valid:', !hasBug);
if (hasBug) passed = false;

// Test 3: Emergency Reinforcements Player
console.log('--- Testing Player Emergency Reinforcements (<1000 HP) ---');
game.playerStatue = { hp: 950, maxHp: 1200, x: 1000, team: 'player' };
game.enemyStatue = { hp: 1200, maxHp: 1200, x: 4000, team: 'enemy' };
game.playerEmergencyTriggered = false;
game.enemyEmergencyTriggered = false;

// Track castSpell calls
let castCalls = [];
game.castSpell = function(sp, team, isFree) {
    castCalls.push({ sp, team, isFree });
};

const initialUnitsCount = game.units.length;
game.checkStatueEmergencyReinforcements();

console.log('playerEmergencyTriggered:', game.playerEmergencyTriggered);
if (!game.playerEmergencyTriggered) passed = false;

// Wait for setTimeout to spawn units and cast spells
setTimeout(() => {
    const spawnedPlayerUnits = game.units.length - initialUnitsCount;
    console.log('Player spawned units:', spawnedPlayerUnits, '(Minimum required: 6)');
    if (spawnedPlayerUnits < 6) passed = false;

    console.log('Player cast spells count:', castCalls.length, '(Minimum required: 2)');
    if (castCalls.length < 2) passed = false;
    const allFree = castCalls.every(c => c.isFree === true && c.team === 'player');
    console.log('All spells free and team player:', allFree);
    if (!allFree) passed = false;

    // Test 4: Emergency Reinforcements Enemy
    console.log('--- Testing Enemy Emergency Reinforcements (<1000 HP) ---');
    castCalls = [];
    game.enemyStatue.hp = 850;
    const preEnemyUnits = game.units.length;
    game.checkStatueEmergencyReinforcements();

    console.log('enemyEmergencyTriggered:', game.enemyEmergencyTriggered);
    if (!game.enemyEmergencyTriggered) passed = false;

    setTimeout(() => {
        const spawnedEnemyUnits = game.units.length - preEnemyUnits;
        console.log('Enemy spawned units:', spawnedEnemyUnits, '(Minimum required: 6)');
        if (spawnedEnemyUnits < 6) passed = false;

        console.log('Enemy cast spells count:', castCalls.length, '(Minimum required: 2)');
        if (castCalls.length < 2) passed = false;
        const allEnemyFree = castCalls.every(c => c.isFree === true && c.team === 'enemy');
        console.log('All enemy spells free and team enemy:', allEnemyFree);
        if (!allEnemyFree) passed = false;

        console.log('\n========================================');
        console.log('OVERALL TEST RESULT:', passed ? '✅ ALL TESTS PASSED!' : '❌ SOME TESTS FAILED!');
        console.log('========================================');
        process.exit(passed ? 0 : 1);
    }, 2500);
}, 2500);
