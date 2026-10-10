const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('--- RUNNING COMPREHENSIVE STICK WAR LEGACY TEST SUITE ---');

// Mock browser environment for headless validation
class MockElement {
    constructor(id) {
        this.id = id;
        this.innerText = '';
        this.innerHTML = '';
        this.className = '';
        this.style = {};
        this.classList = {
            classes: new Set(),
            add: (c) => this.classList.classes.add(c),
            remove: (c) => this.classList.classes.delete(c),
            toggle: (c, force) => {
                if (force === undefined) {
                    if (this.classList.classes.has(c)) this.classList.classes.delete(c);
                    else this.classList.classes.add(c);
                } else if (force) {
                    this.classList.classes.add(c);
                } else {
                    this.classList.classes.delete(c);
                }
            },
            contains: (c) => this.classList.classes.has(c)
        };
        this.dataset = {};
    }
    addEventListener() {}
    querySelector() { return new MockElement('sub'); }
    querySelectorAll() { return [new MockElement('sub1')]; }
    appendChild() {}
    getBoundingClientRect() { return { width: 1280, height: 650 }; }
    getContext() {
        return {
            fillRect() {},
            strokeRect() {},
            clearRect() {},
            beginPath() {},
            closePath() {},
            arc() {},
            ellipse() {},
            roundRect() {},
            moveTo() {},
            lineTo() {},
            fill() {},
            stroke() {},
            save() {},
            restore() {},
            scale() {},
            translate() {},
            setTransform() {},
            setLineDash() {},
            fillText() {},
            measureText: () => ({ width: 40 }),
            createLinearGradient: () => ({ addColorStop() {} }),
            createRadialGradient: () => ({ addColorStop() {} }),
            drawImage() {}
        };
    }
}

const mockElements = {};
global.document = {
    getElementById: (id) => {
        if (!mockElements[id]) mockElements[id] = new MockElement(id);
        return mockElements[id];
    },
    querySelectorAll: (sel) => [new MockElement(sel)],
    createElement: (tag) => new MockElement(tag)
};

global.window = {
    innerWidth: 1280,
    innerHeight: 720,
    devicePixelRatio: 2,
    addEventListener: () => {},
    localStorage: {
        store: {},
        getItem: function(k) { return this.store[k] || null; },
        setItem: function(k, v) { this.store[k] = String(v); }
    }
};

global.localStorage = global.window.localStorage;
global.requestAnimationFrame = (cb) => setTimeout(cb, 16);

// Load Audio engine
const audioCode = fs.readFileSync(path.join(__dirname, '../audio.js'), 'utf8');
eval(audioCode);
assert(window.soundCtrl, 'Sound controller must exist');
console.log('✅ audio.js loaded');

// Test Jukebox Multi-Track
assert.strictEqual(window.soundCtrl.tracks.length, 4, 'Must have exactly 4 tracks in Jukebox');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 0);
assert.strictEqual(window.soundCtrl.getTrackName(), 'Inamorta War March');

const t1 = window.soundCtrl.nextTrack();
assert.strictEqual(t1, 'Stick War Royal Hymn');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 1);

const t2 = window.soundCtrl.nextTrack();
assert.strictEqual(t2, 'Night of the Deads (Zombie)');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 2);

const t3 = window.soundCtrl.nextTrack();
assert.strictEqual(t3, 'Battle Climax Symphony');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 3);

const t0 = window.soundCtrl.nextTrack();
assert.strictEqual(t0, 'Inamorta War March');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 0);
console.log('✅ 4-track procedural Jukebox cycles correctly');

// Load Stickman Renderer
const stickmanCode = fs.readFileSync(path.join(__dirname, '../stickman.js'), 'utf8');
eval(stickmanCode);
assert(window.StickmanRenderer, 'StickmanRenderer must exist');
console.log('✅ stickman.js loaded');

// Load Game Engine
const gameCode = fs.readFileSync(path.join(__dirname, '../game.js'), 'utf8');
eval(gameCode);
assert(window.game, 'Game instance must exist');
console.log('✅ game.js loaded');

const g = window.game;

// Test 1: Even levels night mode & zombie horde
g.start(1, 'campaign');
assert.strictEqual(g.isNight, false, 'Level 1 must be day');
assert.strictEqual(g.isZombieMode, false, 'Level 1 must not be zombie mode');

g.start(2, 'campaign');
assert.strictEqual(g.isNight, true, 'Level 2 must be night');
assert.strictEqual(g.isZombieMode, true, 'Level 2 must be zombie horde mode');
assert.strictEqual(window.soundCtrl.currentTrackIndex, 2, 'Even levels auto-play Night of the Deads (track 2)');

g.start(4, 'campaign');
assert.strictEqual(g.isNight, true, 'Level 4 must be night');
assert.strictEqual(g.isZombieMode, true, 'Level 4 must be zombie mode');

g.start(5, 'campaign');
assert.strictEqual(g.isNight, false, 'Level 5 must be day');
assert.strictEqual(g.isZombieMode, false, 'Level 5 must not be zombie mode');
console.log('✅ Even levels night mode & zombie horde verified');

// Test 2: Mode Gila-Gilaan (Insane Difficulty)
g.start(1, 'campaign', 'insane');
assert.strictEqual(g.difficulty, 'insane', 'Difficulty should be insane');
assert(g.enemyStatue.maxHp > 2000, 'Insane enemy statue has massive HP');
assert(g.enemyGold > 1000, 'Insane enemy starts with rich economy');
console.log('✅ Mode Gila-Gilaan (Insane difficulty) verified');

// Test 3: Cheats (All 6 codes)
// 1. minegoldrich
g.applyCheat('minegoldrich');
assert.strictEqual(g.cheats.infiniteGold, true);
assert.strictEqual(g.gold, 999999);
g.applyCheat('minegoldrich');
assert.strictEqual(g.cheats.infiniteGold, false);

// 2. cooldownnotspawn
g.applyCheat('cooldownnotspawn');
assert.strictEqual(g.cheats.noCooldown, true);
g.applyCheat('cooldownnotspawn');
assert.strictEqual(g.cheats.noCooldown, false);

// 3. nopopuation
g.applyCheat('nopopuation');
assert.strictEqual(g.cheats.noPopulation, true);
assert.strictEqual(g.maxPopulation, 9999);
g.applyCheat('nopopuation');
assert.strictEqual(g.cheats.noPopulation, false);
assert.strictEqual(g.maxPopulation, 35);

// 4. spellol
g.applyCheat('spellol');
assert.strictEqual(g.cheats.infiniteSpells, true);
assert.strictEqual(g.spells.minerHustle.stock, 99);
g.applyCheat('spellol');
assert.strictEqual(g.cheats.infiniteSpells, false);

// 5. gemsnotreal (NEW)
g.applyCheat('gemsnotreal');
assert.strictEqual(g.cheats.infiniteGems, true);
assert.strictEqual(g.gems, 999999);
g.applyCheat('gemsnotreal');
assert.strictEqual(g.cheats.infiniteGems, false);

// 6. upgradereal (NEW)
g.applyCheat('upgradereal');
assert.strictEqual(g.cheats.maxUpgrades, true);
assert.strictEqual(g.upgrades.sword, 3);
assert.strictEqual(g.upgrades.bow, 3);
assert.strictEqual(g.upgrades.statue, 3);
assert.strictEqual(g.upgrades.castleArcher, 3);
assert.strictEqual(g.upgrades.giantClub, 3);
assert.strictEqual(g.upgrades.magikillStaff, 3);
assert.strictEqual(g.upgrades.mining, 3);
assert.strictEqual(g.upgrades.speartonHelmet, 3);
assert.strictEqual(g.upgrades.speartonSpear, 3);
assert.strictEqual(g.upgrades.speartonShield, 3);
assert.strictEqual(g.upgradePoints, 999);
g.applyCheat('upgradereal');
assert.strictEqual(g.cheats.maxUpgrades, false);
console.log('✅ All 6 cheats (including gemsnotreal & upgradereal) verified');

// Test 4: Toko Penyihir & 10 Upgrades System
g.gems = 2000;
g.upgradePoints = 5;
for (const k in g.upgrades) g.upgrades[k] = 0;

// Upgrade sword to level 3
g.buyUpgrade('sword');
assert.strictEqual(g.upgrades.sword, 1);
assert.strictEqual(g.upgradePoints, 4);

g.buyUpgrade('sword');
assert.strictEqual(g.upgrades.sword, 2);
assert.strictEqual(g.upgradePoints, 3);

g.buyUpgrade('sword');
assert.strictEqual(g.upgrades.sword, 3);
assert.strictEqual(g.upgradePoints, 2);

// Cannot exceed max level 3
g.buyUpgrade('sword');
assert.strictEqual(g.upgrades.sword, 3, 'Cannot exceed level 3');
assert.strictEqual(g.upgradePoints, 2, 'Points should not be spent if maxed');

// Test 5: Skins System (Api & Es)
assert.strictEqual(g.equippedSkin, 'classic');
assert.strictEqual(g.skins.fire, false);
assert.strictEqual(g.skins.ice, false);

g.buySkin('fire');
assert.strictEqual(g.skins.fire, true, 'Fire skin purchased');
assert.strictEqual(g.equippedSkin, 'fire', 'Fire skin automatically equipped');
assert.strictEqual(g.gems, 2000 - 750, '750 Gems deducted for fire skin');

g.buySkin('ice');
assert.strictEqual(g.skins.ice, true, 'Ice skin purchased');
assert.strictEqual(g.equippedSkin, 'ice', 'Ice skin automatically equipped');
assert.strictEqual(g.gems, 2000 - 750 - 750, '750 Gems deducted for ice skin');

g.equipSkin('fire');
assert.strictEqual(g.equippedSkin, 'fire', 'Switch skin back to fire');

// Test 6: Fire & Ice Skins Effects & Controlled 2X Damage & Insane Enemy Control
// 6.1: Fire Skin (Efek bakar 10 kerusakan saat menyerang, 5 kerusakan api saat menerima damage)
g.start(1, 'campaign');
g.equippedSkin = 'fire';
const playerFireUnit = g.spawnUnit('swordwrath', 'player', 500);
const enemyTarget1 = g.spawnUnit('swordwrath', 'enemy', 550);
const enemyHpBefore = enemyTarget1.hp;

// Attack with Fire Skin
g.dealDamage(enemyTarget1, 25, playerFireUnit);
assert(enemyTarget1.burnTimer > 0, 'Enemy must receive burn effect (burnTimer > 0)');
assert.strictEqual(enemyTarget1.hp, enemyHpBefore - 25 - 10, 'Enemy takes normal dmg (25) + burn dmg (10) = 35 dmg total');
console.log('✅ Skin Api efek bakar (10 kerusakan saat menyerang) verified');

// Fire Skin takes damage -> Attacker gets 5 fire damage
const enemyAttacker = g.spawnUnit('swordwrath', 'enemy', 520);
const enemyAttackerHpBefore = enemyAttacker.hp;
g.dealDamage(playerFireUnit, 20, enemyAttacker);
assert.strictEqual(enemyAttacker.hp, enemyAttackerHpBefore - 5, 'Attacker must take 5 fire damage when damaging fire skin unit');
console.log('✅ Skin Api pembalas api (5 kerusakan api saat terkena damage) verified');

// 6.2: Ice Skin (Saat menerima damage musuhnya akan MEMBEKU selama 3 detik)
g.equippedSkin = 'ice';
const playerIceUnit = g.spawnUnit('spearton', 'player', 600);
const enemyStriker = g.spawnUnit('swordwrath', 'enemy', 620);
enemyStriker.frozenTimer = 0;
g.dealDamage(playerIceUnit, 15, enemyStriker);
assert.strictEqual(enemyStriker.frozenTimer, 3.0, 'Enemy striker must be frozen for exactly 3 seconds upon damaging ice skin unit');
console.log('✅ Skin Es pembeku (musuh membeku selama 3 detik saat menerima damage) verified');

// Frozen unit immobilized during updateUnits
const frozenStartX = enemyStriker.x;
g.update(0.5);
assert.strictEqual(enemyStriker.x, frozenStartX, 'Frozen unit cannot move');
assert(enemyStriker.frozenTimer < 3.0 && enemyStriker.frozenTimer > 0, 'Frozen timer counts down');
console.log('✅ Frozen unit immobilization mechanics verified');

// 6.3: Controlled troop deals 2X Damage (saat mengontrolkan pasukan musuh menerima damage akan X2)
g.selectUnit(playerFireUnit);
assert.strictEqual(playerFireUnit.isControlled, true);
assert.strictEqual(g.controlledUnit, playerFireUnit);

const enemyDummy = g.spawnUnit('spearton', 'enemy', 800);
const dummyHpBefore = enemyDummy.hp;
g.dealDamage(enemyDummy, 30, playerFireUnit);
// 30 * 2 = 60, plus fire skin 10 burn = 70 damage total
assert.strictEqual(enemyDummy.hp, dummyHpBefore - 60 - 10, 'Controlled troop deals X2 damage (30 * 2 = 60)');
console.log('✅ Kontrol pasukan X2 Damage verified');

// 6.4: Star appearance above controlled unit
assert(typeof window.StickmanRenderer.drawStar === 'function', 'StickmanRenderer must have drawStar static method');
console.log('✅ Bintang di atas pasukan yang dikontrol verified');

// 6.5: Mode Gila-Gilaan Musuh Mengontrol Pasukannya
g.start(1, 'campaign', 'insane');
assert.strictEqual(g.difficulty, 'insane');
const enemyChamp = g.spawnUnit('spearton', 'enemy', 2500);
g.enemyControlCooldown = 0;
g.updateEnemyControlledUnit(0.1);
assert(g.enemyControlledUnit, 'Insane mode must assign an enemy controlled unit');
assert.strictEqual(g.enemyControlledUnit.isEnemyControlled, true);
assert.strictEqual(g.enemyControlledUnit.isControlled, true);

// Enemy controlled unit also deals 2X damage when striking player!
const playerDummy = g.spawnUnit('swordwrath', 'player', 2450);
const playerHpBefore = playerDummy.hp;
g.dealDamage(playerDummy, 20, g.enemyControlledUnit);
assert.strictEqual(playerDummy.hp, playerHpBefore - 40, 'Enemy controlled unit deals X2 damage (20 * 2 = 40)');
console.log('✅ Mode Gila-Gilaan musuh mengontrol pasukan dengan 2X Damage verified');

// Test 7: Victory Rewards rule (menang 1 kali = 2 peningkatan + 150 gems)
const ptsBefore = g.upgradePoints;
const gemsBefore = g.gems;
g.showGameOverModal(true);
assert.strictEqual(g.upgradePoints, ptsBefore + 2, 'Victory must grant exactly +2 upgrade points');
assert.strictEqual(g.gems, gemsBefore + 150, 'Victory must grant exactly +150 gems');
console.log('✅ Victory rewards rule (menang 1 kali = 2 peningkatan, 150 gems) verified');

// Test 8: Persistence
g.saveProfile();
const saved = JSON.parse(window.localStorage.getItem('stickwar_save_profile'));
assert(saved, 'Profile must be saved to localStorage');
assert.strictEqual(saved.upgradePoints, g.upgradePoints);
assert.strictEqual(saved.gems, g.gems);
assert.strictEqual(saved.equippedSkin, 'ice');
assert.strictEqual(saved.upgrades.sword, 3);

g.gems = 0;
g.upgradePoints = 0;
g.equippedSkin = 'classic';
g.loadProfile();
assert.strictEqual(g.gems, saved.gems);
assert.strictEqual(g.upgradePoints, saved.upgradePoints);
assert.strictEqual(g.equippedSkin, 'ice');
console.log('✅ Save and Load profile persistence verified');

// Test 9: Bundled self-contained files validation
const ujiCobaContent = fs.readFileSync(path.join(__dirname, '../Uji Coba'), 'utf8');
assert(ujiCobaContent.includes('gemsnotreal'), 'Uji Coba must contain gemsnotreal');
assert(ujiCobaContent.includes('upgradereal'), 'Uji Coba must contain upgradereal');
assert(ujiCobaContent.includes('Stick War Royal Hymn'), 'Uji Coba must contain Royal Hymn song');
assert(ujiCobaContent.includes('Night of the Deads'), 'Uji Coba must contain Night of the Deads song');
assert(ujiCobaContent.includes('shop-modal'), 'Uji Coba must contain shop modal');
assert(ujiCobaContent.includes('GILA-GILAAN'), 'Uji Coba must contain insane mode');
assert(ujiCobaContent.includes('drawStar'), 'Uji Coba must contain drawStar');
assert(ujiCobaContent.includes('frozenTimer'), 'Uji Coba must contain frozenTimer');
assert(ujiCobaContent.includes('burnTimer'), 'Uji Coba must contain burnTimer');
assert(ujiCobaContent.includes('enemyControlledUnit'), 'Uji Coba must contain enemyControlledUnit');
console.log('✅ Uji Coba bundle content validation passed');

console.log('\n⭐⭐⭐ ALL TESTS PASSED SUCCESSFULLY (100%) ⭐⭐⭐\n');
process.exit(0);
