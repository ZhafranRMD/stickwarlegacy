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

const makeEl = () => ({
    classList: { add: () => {}, remove: () => {}, toggle: () => {} },
    innerText: '',
    style: {},
    dataset: {},
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 1200, height: 600 }),
    addEventListener: () => {},
    querySelector: () => makeEl(),
    querySelectorAll: () => []
});

const jsdom = {
    window: {
        soundCtrl: {
            playEmergencyAlert: () => {},
            playOrderHorn: () => {},
            playBowShoot: () => {},
            playSpellArrowRain: () => {},
            playSpellLightning: () => {},
            getTrackName: () => 'track1',
            init: () => {},
            resume: () => {},
            setTrack: () => {}
        },
        addEventListener: () => {},
        innerWidth: 1200,
        innerHeight: 600,
        localStorage: { getItem: () => null, setItem: () => {}, removeItem: () => {} }
    },
    document: {
        getElementById: (id) => (id === 'gameCanvas' ? mockCanvas : makeEl()),
        querySelectorAll: () => [],
        createElement: () => makeEl()
    }
};

global.window = jsdom.window;
global.document = jsdom.document;
global.localStorage = jsdom.window.localStorage;
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

const vm = require('vm');
const code = fs.readFileSync('game.js', 'utf8');
vm.runInThisContext(code);

const game = new StickWarGame(mockCanvas);

// Test on 'easy' difficulty
console.log('--- STARTING EASY MODE ---');
game.start(1, 'campaign', 'easy');
console.log('Player statue maxHp:', game.playerStatue.maxHp, 'hp:', game.playerStatue.hp);
console.log('Enemy statue maxHp:', game.enemyStatue.maxHp, 'hp:', game.enemyStatue.hp);
console.log('Enemy emergency triggered on start?:', game.enemyEmergencyTriggered);
game.checkStatueEmergencyReinforcements();
console.log('After frame 1 checkStatueEmergencyReinforcements:');
console.log('Enemy emergency triggered?:', game.enemyEmergencyTriggered);

console.log('\n--- STARTING HARD MODE ---');
game.start(1, 'campaign', 'hard');
console.log('Player statue maxHp:', game.playerStatue.maxHp, 'hp:', game.playerStatue.hp);
console.log('Enemy statue maxHp:', game.enemyStatue.maxHp, 'hp:', game.enemyStatue.hp);
console.log('Player emergency triggered on start?:', game.playerEmergencyTriggered);
game.checkStatueEmergencyReinforcements();
console.log('Player emergency triggered?:', game.playerEmergencyTriggered);
