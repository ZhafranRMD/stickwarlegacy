// Stick War: Legacy - Core Game Engine
class StickWarGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Dimensions & World
        this.worldWidth = 3200;
        this.worldHeight = 650;
        this.groundY = 490;
        this.cameraX = 0;
        this.targetCameraX = 0;

        // Game State
        this.running = false;
        this.paused = false;
        this.gameSpeed = 1;
        this.currentLevel = 1;
        this.difficulty = 'medium'; // 'easy', 'medium', 'hard'
        this.gameMode = 'campaign'; // 'campaign' or 'endless'
        this.gameOver = false;
        this.gameWon = false;

        // HD Graphics Mode & Device Pixel Ratio
        this.isHD = true;
        this.dpr = 1;

        // Ambient HD Atmospheric Dust / Embers
        this.ambientParticles = [];
        for (let i = 0; i < 40; i++) {
            this.ambientParticles.push({
                x: Math.random() * 3200,
                y: Math.random() * 480,
                radius: 1 + Math.random() * 2.5,
                speedX: 0.15 + Math.random() * 0.45,
                speedY: -0.15 - Math.random() * 0.35,
                alpha: 0.25 + Math.random() * 0.45
            });
        }

        // 10 Crystal Ball Spells System (Crafted from Wizard Shop in reference photos)
        this.spells = {
            minerHustle: {
                id: 'minerHustle',
                name: 'Miner Hustle',
                icon: '⛏️',
                key: 'Q',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25,
                activeTimer: 0,
                duration: 20
            },
            arrowRain: {
                id: 'arrowRain',
                name: 'Arrow Rain',
                icon: '🏹',
                key: 'W',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 20
            },
            healWave: {
                id: 'healWave',
                name: 'Healing Wave',
                icon: '💖',
                key: 'E',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 22
            },
            swordRage: {
                id: 'swordRage',
                name: 'Sword Rage',
                icon: '⚔️',
                key: 'F',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25,
                activeTimer: 0,
                duration: 15
            },
            goldenSpearton: {
                id: 'goldenSpearton',
                name: 'Golden Spartan',
                icon: '🛡️',
                key: 'T',
                stock: 2,
                maxStock: 2,
                cooldown: 0,
                maxCooldown: 30
            },
            trainingHaste: {
                id: 'trainingHaste',
                name: 'Training Haste',
                icon: '➰',
                key: 'G',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25,
                activeTimer: 0,
                duration: 20
            },
            lightningStorm: {
                id: 'lightningStorm',
                name: 'Lightning Storm',
                icon: '⚡',
                key: 'H',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 24
            },
            summonDead: {
                id: 'summonDead',
                name: 'Summon Undead',
                icon: '💀',
                key: 'J',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 22
            },
            goldRush: {
                id: 'goldRush',
                name: 'Gold Rush',
                icon: '💰',
                key: 'K',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25
            },
            summonMarrowkai: {
                id: 'summonMarrowkai',
                name: 'Summon Marrowkai',
                icon: '☠️',
                key: 'U',
                stock: 2,
                maxStock: 2,
                cooldown: 0,
                maxCooldown: 35
            }
        };

        // Level Progression System (Level 1 to 100)
        this.maxLevel = 100;
        this.unlockedLevel = 1;
        this.enemySpellCooldown = 35;

        // Gems, Armory Upgrades, & Skins System
        this.gems = 1250;
        this.upgradePoints = 0;
        this.upgrades = {
            sword: 0,
            bow: 0,
            statue: 0,
            castleArcher: 0,
            giantClub: 0,
            magikillStaff: 0,
            mining: 0,
            speartonHelmet: 0,
            speartonSpear: 0,
            speartonShield: 0
        };
        this.skins = {
            classic: true,
            fire: false,
            ice: false
        };
        this.equippedSkin = 'classic';

        // Mode Gila-Gilaan: Musuh Mengontrolkan Pasukan
        this.enemyControlledUnit = null;
        this.enemyControlCooldown = 0;

        // Even Level Night & Zombie Horde System
        this.isNight = false;
        this.isZombieMode = false;
        this.nightStars = [];
        for (let i = 0; i < 80; i++) {
            this.nightStars.push({
                x: Math.random() * 3200,
                y: Math.random() * 350,
                radius: 0.8 + Math.random() * 1.8,
                alpha: 0.3 + Math.random() * 0.7,
                twinkleSpeed: 1 + Math.random() * 3
            });
        }

        // Cheats System
        this.cheats = {
            infiniteGold: false,
            noCooldown: false,
            noPopulation: false,
            infiniteSpells: false,
            infiniteGems: false,
            maxUpgrades: false
        };
        this.keyBuffer = '';

        // Load Persistent Progress
        this.loadProfile();

        // Player Economy & Army
        this.gold = 500;
        this.maxPopulation = 35;
        this.playerStance = 'defend'; // 'defend', 'attack', 'retreat'
        this.controlledUnit = null;

        // Enemy Economy & AI
        this.enemyGold = 500;
        this.enemyStance = 'defend';
        this.enemyAiTimer = 0;

        // Bases / Statues
        this.playerStatue = {
            x: 250,
            y: this.groundY,
            hp: 1200,
            maxHp: 1200,
            team: 'player',
            width: 80,
            height: 180
        };

        this.enemyStatue = {
            x: 2950,
            y: this.groundY,
            hp: 1200,
            maxHp: 1200,
            team: 'enemy',
            width: 80,
            height: 180
        };

        // Entities
        this.units = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.stuckArrows = [];

        // Gold Mines
        this.goldMines = [
            { x: 550, y: this.groundY, goldLeft: 9999, capacity: 3, miners: [] },
            { x: 1100, y: this.groundY, goldLeft: 9999, capacity: 4, miners: [] },
            { x: 2100, y: this.groundY, goldLeft: 9999, capacity: 4, miners: [] },
            { x: 2650, y: this.groundY, goldLeft: 9999, capacity: 3, miners: [] }
        ];

        // Unit Spawning Definitions & Cooldowns
        this.unitDefs = {
            miner: {
                name: 'Miner',
                cost: 150,
                hp: 120,
                speed: 2.4,
                scale: 1.0,
                attackDmg: 12,
                attackCooldown: 1.0,
                range: 30,
                cooldownTime: 2.5
            },
            swordwrath: {
                name: 'Swordwrath',
                cost: 125,
                hp: 150,
                speed: 3.3,
                scale: 1.0,
                attackDmg: 24,
                attackCooldown: 0.65,
                range: 38,
                cooldownTime: 3.0
            },
            archidon: {
                name: 'Archidon',
                cost: 300,
                hp: 95,
                speed: 2.6,
                scale: 1.0,
                attackDmg: 30,
                attackCooldown: 1.3,
                range: 480,
                cooldownTime: 4.5
            },
            spearton: {
                name: 'Spearton',
                cost: 500,
                hp: 360,
                speed: 1.9,
                scale: 1.05,
                attackDmg: 42,
                attackCooldown: 1.0,
                range: 65,
                cooldownTime: 7.0
            },
            magikill: {
                name: 'Magikill',
                cost: 800,
                hp: 190,
                speed: 1.7,
                scale: 1.0,
                attackDmg: 85,
                attackCooldown: 2.4,
                range: 400,
                cooldownTime: 12.0
            },
            giant: {
                name: 'Giant',
                cost: 1200,
                hp: 1250,
                speed: 1.2,
                scale: 2.2,
                attackDmg: 120,
                attackCooldown: 2.8,
                range: 85,
                cooldownTime: 18.0
            },
            undead: {
                name: 'Undead Warrior',
                cost: 140,
                hp: 180,
                speed: 3.4,
                scale: 1.0,
                attackDmg: 28,
                attackCooldown: 0.6,
                range: 40,
                cooldownTime: 2.0
            },
            marrowkai: {
                name: 'Marrowkai Titan',
                cost: 1800,
                hp: 1500,
                speed: 2.2,
                scale: 1.6,
                attackDmg: 95,
                attackCooldown: 1.5,
                range: 85,
                cooldownTime: 15.0
            }
        };

        this.spawnCooldowns = {
            miner: 0,
            swordwrath: 0,
            archidon: 0,
            spearton: 0,
            magikill: 0,
            giant: 0,
            undead: 0,
            marrowkai: 0
        };

        // Screen Shake
        this.shakeTime = 0;
        this.shakeIntensity = 0;

        // Castle Wall Archers
        this.castleArchers = {
            player: { x: 120, y: this.groundY - 140, timer: 0 },
            enemy: { x: 3080, y: this.groundY - 140, timer: 0 }
        };

        // Input state
        this.keys = {};
        this.mouse = { x: 0, y: 0, worldX: 0, isDown: false };
        this.isDragging = false;
        this.dragStartX = 0;
        this.cameraDragStartX = 0;

        // Statistics
        this.stats = {
            goldMined: 0,
            unitsSpawned: 0,
            enemiesKilled: 0,
            damageDealt: 0
        };

        this.setupEventListeners();
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const container = document.getElementById('canvas-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const dpr = this.isHD ? Math.min(2, window.devicePixelRatio || 1) : 1;
        this.dpr = dpr;
        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round((rect.height || 650) * dpr);
        this.viewWidth = rect.width;
        this.viewHeight = rect.height || 650;

        // Responsive ground position safely positioned above bottom unit cards
        this.groundY = Math.max(380, Math.round(this.viewHeight - 140));

        if (this.playerStatue) this.playerStatue.y = this.groundY;
        if (this.enemyStatue) this.enemyStatue.y = this.groundY;
        if (this.goldMines) {
            for (const m of this.goldMines) m.y = this.groundY;
        }
        if (this.units) {
            for (const u of this.units) {
                if (u.state !== 'dead') u.y = this.groundY;
            }
        }
        if (this.castleArchers) {
            this.castleArchers.player.y = this.groundY - 140;
            this.castleArchers.enemy.y = this.groundY - 140;
        }
    }

    toggleHD() {
        this.isHD = !this.isHD;
        this.resize();
        const btn = document.getElementById('btn-hd');
        if (btn) btn.classList.toggle('hd-active', this.isHD);
        this.showToast(this.isHD ? '✨ Mode Grafis HD Aktif (Ultra Sharp)' : 'Mode Grafis Standar');
        return this.isHD;
    }

    start(level = 1, mode = 'campaign', difficulty = null) {
        this.currentLevel = Math.max(1, Math.min(100, Math.floor(level || 1)));
        this.gameMode = mode;
        if (difficulty) this.difficulty = difficulty;
        this.gameOver = false;
        this.gameWon = false;
        this.running = true;
        this.paused = false;

        // Reset Mode Gila-Gilaan enemy commander
        this.enemyControlledUnit = null;
        this.enemyControlCooldown = 2.5;

        // Even Level Night & Zombie Horde Detection
        this.isNight = (this.currentLevel % 2 === 0);
        this.isZombieMode = this.isNight;

        const levelStatueBonus = (this.currentLevel - 1) * 65;
        const statueUpgradeBonus = (this.upgrades.statue || 0) * 400;

        // Configure Difficulty parameters & scaling
        if (this.difficulty === 'easy') {
            this.gold = 1000;
            this.playerStatue.maxHp = 1500 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 800 + levelStatueBonus;
            this.enemyGold = 250;
        } else if (this.difficulty === 'hard') {
            this.gold = 350;
            this.playerStatue.maxHp = 1000 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 1600 + levelStatueBonus;
            this.enemyGold = 800 + this.currentLevel * 150;
        } else if (this.difficulty === 'insane') {
            // Mode Gila-Gilaan: Musuh Super Pro, Emas Melimpah & Sangat Agresif!
            this.gold = 350;
            this.playerStatue.maxHp = 1000 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 2200 + levelStatueBonus * 1.3;
            this.enemyGold = 1200 + this.currentLevel * 200;
        } else {
            // Medium (Default)
            this.gold = 500;
            this.playerStatue.maxHp = 1200 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 1200 + levelStatueBonus;
            this.enemyGold = 450 + this.currentLevel * 80;
        }

        if (this.cheats.infiniteGold) {
            this.gold = 999999;
        }
        if (this.cheats.infiniteGems) {
            this.gems = 999999;
        }

        // Initialize / Reset Spells stock
        for (const k in this.spells) {
            const s = this.spells[k];
            s.stock = this.cheats.infiniteSpells ? 99 : s.maxStock;
            s.cooldown = 0;
            s.activeTimer = 0;
        }

        const cdModifier = this.difficulty === 'insane' ? 0.45 : 0.25;
        this.enemySpellCooldown = Math.max(12, 38 - Math.min(22, this.currentLevel * cdModifier));
        this.maxPopulation = this.cheats.noPopulation ? 9999 : 35;

        this.playerStance = 'defend';
        this.enemyStance = 'defend';
        this.controlledUnit = null;

        this.playerStatue.hp = this.playerStatue.maxHp;
        this.enemyStatue.hp = this.enemyStatue.maxHp;

        this.units = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.stuckArrows = [];

        // Spawn initial miners
        this.spawnUnit('miner', 'player', 280);
        this.spawnUnit('miner', 'player', 300);

        this.spawnUnit('miner', 'enemy', 2900);
        this.spawnUnit('miner', 'enemy', 2880);
        if (this.currentLevel >= 30) {
            this.spawnUnit('miner', 'enemy', 2860);
        }
        if (this.currentLevel >= 70) {
            this.spawnUnit('miner', 'enemy', 2840);
        }

        // Enemy initial army dynamically crafted for Levels 1 to 100
        this.setupLevel(this.currentLevel);

        this.cameraX = 0;
        this.targetCameraX = 0;

        // Update UI
        this.updateUI();
        this.updateCheatUI();
        this.updateSpellUI();

        // Audio & Music: auto switch to Night Theme on even levels or start current track
        if (window.soundCtrl) {
            window.soundCtrl.init();
            window.soundCtrl.resume();
            if (this.isNight) {
                window.soundCtrl.setTrack(2); // Night of the Deads (Zombie Theme)
                this.showToast(`🌙 LEVEL ${this.currentLevel}: MALAM HARI & INVASI ZOMBIE!`, 'danger');
            } else {
                window.soundCtrl.setTrack(0); // Inamorta War March
            }
            window.soundCtrl.playOrderHorn();
        }

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    setupLevel(level) {
        const isHard = this.difficulty === 'hard';

        // Level 100: FINAL APOCALYPTIC BATTLE OF INAMORTA
        if (level === 100) {
            const titan = this.spawnUnit('marrowkai', 'enemy', 2850);
            if (titan) {
                titan.maxHp = 2500;
                titan.hp = 2500;
                titan.scale = 1.9;
            }
            this.spawnUnit('giant', 'enemy', 2800);
            this.spawnUnit('giant', 'enemy', 2900);
            this.spawnUnit('magikill', 'enemy', 2930);
            this.spawnUnit('magikill', 'enemy', 2960);
            this.spawnUnit('spearton', 'enemy', 2780);
            this.spawnUnit('spearton', 'enemy', 2760);
            for (let i = 0; i < 4; i++) {
                this.spawnUnit('undead', 'enemy', 2720 - i * 35);
            }
            return;
        }

        // Boss encounters every 10 levels
        if (level % 10 === 0) {
            const bossTier = Math.floor(level / 10);
            if (bossTier === 1) { // Lv 10
                this.spawnUnit('giant', 'enemy', 2850);
                this.spawnUnit('spearton', 'enemy', 2820);
                this.spawnUnit('archidon', 'enemy', 2900);
            } else if (bossTier === 2) { // Lv 20
                this.spawnUnit('giant', 'enemy', 2850);
                this.spawnUnit('magikill', 'enemy', 2900);
                this.spawnUnit('spearton', 'enemy', 2820);
                this.spawnUnit('undead', 'enemy', 2800);
            } else if (bossTier === 3) { // Lv 30
                this.spawnUnit('marrowkai', 'enemy', 2850);
                this.spawnUnit('spearton', 'enemy', 2820);
                this.spawnUnit('undead', 'enemy', 2800);
                this.spawnUnit('undead', 'enemy', 2780);
            } else if (bossTier === 4) { // Lv 40
                this.spawnUnit('marrowkai', 'enemy', 2850);
                this.spawnUnit('giant', 'enemy', 2890);
                this.spawnUnit('magikill', 'enemy', 2930);
                this.spawnUnit('archidon', 'enemy', 2960);
            } else if (bossTier === 5) { // Lv 50
                this.spawnUnit('marrowkai', 'enemy', 2850);
                this.spawnUnit('marrowkai', 'enemy', 2890);
                this.spawnUnit('magikill', 'enemy', 2920);
                this.spawnUnit('spearton', 'enemy', 2810);
            } else if (bossTier === 6) { // Lv 60
                this.spawnUnit('giant', 'enemy', 2850);
                this.spawnUnit('giant', 'enemy', 2890);
                this.spawnUnit('marrowkai', 'enemy', 2820);
                this.spawnUnit('magikill', 'enemy', 2930);
            } else if (bossTier === 7) { // Lv 70
                this.spawnUnit('marrowkai', 'enemy', 2850);
                for (let i = 0; i < 6; i++) this.spawnUnit('undead', 'enemy', 2800 - i * 30);
                this.spawnUnit('magikill', 'enemy', 2920);
            } else if (bossTier === 8) { // Lv 80
                this.spawnUnit('marrowkai', 'enemy', 2850);
                this.spawnUnit('giant', 'enemy', 2890);
                this.spawnUnit('magikill', 'enemy', 2920);
                this.spawnUnit('magikill', 'enemy', 2950);
                this.spawnUnit('spearton', 'enemy', 2810);
            } else if (bossTier === 9) { // Lv 90
                this.spawnUnit('marrowkai', 'enemy', 2850);
                this.spawnUnit('marrowkai', 'enemy', 2890);
                this.spawnUnit('giant', 'enemy', 2810);
                this.spawnUnit('magikill', 'enemy', 2930);
                this.spawnUnit('spearton', 'enemy', 2780);
            }
            if (isHard) {
                this.spawnUnit('spearton', 'enemy', 2830);
            }
            return;
        }

        // Standard Dynamic Tier Scaling (Levels 1 to 99)
        if (level === 1) {
            this.spawnUnit('swordwrath', 'enemy', 2850);
            if (isHard) this.spawnUnit('swordwrath', 'enemy', 2880);
        } else if (level <= 5) {
            this.spawnUnit('swordwrath', 'enemy', 2850);
            this.spawnUnit('archidon', 'enemy', 2900);
            if (level >= 3) this.spawnUnit('spearton', 'enemy', 2820);
            if (isHard) this.spawnUnit('archidon', 'enemy', 2930);
        } else if (level < 15) {
            this.spawnUnit('spearton', 'enemy', 2850);
            this.spawnUnit('archidon', 'enemy', 2900);
            this.spawnUnit('swordwrath', 'enemy', 2820);
            if (level >= 8) this.spawnUnit('magikill', 'enemy', 2930);
            if (isHard) this.spawnUnit('spearton', 'enemy', 2790);
        } else if (level < 30) {
            this.spawnUnit('spearton', 'enemy', 2850);
            this.spawnUnit('magikill', 'enemy', 2910);
            this.spawnUnit('archidon', 'enemy', 2940);
            this.spawnUnit('undead', 'enemy', 2810);
            if (level >= 25) this.spawnUnit('giant', 'enemy', 2880);
            if (isHard) this.spawnUnit('undead', 'enemy', 2780);
        } else if (level < 60) {
            this.spawnUnit('giant', 'enemy', 2850);
            this.spawnUnit('magikill', 'enemy', 2910);
            this.spawnUnit('spearton', 'enemy', 2810);
            this.spawnUnit('undead', 'enemy', 2780);
            if (level >= 45) this.spawnUnit('marrowkai', 'enemy', 2890);
            if (isHard) this.spawnUnit('archidon', 'enemy', 2950);
        } else {
            // High Level Battlefields (61 - 99)
            this.spawnUnit('marrowkai', 'enemy', 2850);
            this.spawnUnit('giant', 'enemy', 2890);
            this.spawnUnit('magikill', 'enemy', 2930);
            this.spawnUnit('spearton', 'enemy', 2810);
            this.spawnUnit('undead', 'enemy', 2780);
            if (level >= 80) this.spawnUnit('giant', 'enemy', 2760);
            if (isHard) this.spawnUnit('undead', 'enemy', 2740);
        }
    }

    setupEventListeners() {
        // Keyboard controls
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') e.preventDefault();
            this.keys[e.code] = true;

            // Cheat Secret Code typing buffer
            if (e.key && e.key.length === 1 && !e.ctrlKey && !e.altKey) {
                this.keyBuffer = (this.keyBuffer + e.key.toLowerCase()).slice(-30);
                if (this.keyBuffer.endsWith('minegoldrich')) {
                    this.applyCheat('minegoldrich');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('cooldownnotspawn')) {
                    this.applyCheat('cooldownnotspawn');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('nopopuation') || this.keyBuffer.endsWith('nopopulation')) {
                    this.applyCheat('nopopuation');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('spellol')) {
                    this.applyCheat('spellol');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('gemsnotreal')) {
                    this.applyCheat('gemsnotreal');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('upgradereal')) {
                    this.applyCheat('upgradereal');
                    this.keyBuffer = '';
                }
            }

            // Crystal Ball Spell Shortcuts (10 Spells: Q, W, E, F, T, G, H, J, K, U)
            if (e.code === 'KeyQ') this.castSpell('minerHustle');
            if (e.code === 'KeyW') this.castSpell('arrowRain');
            if (e.code === 'KeyE') this.castSpell('healWave');
            if (e.code === 'KeyF') this.castSpell('swordRage');
            if (e.code === 'KeyT') this.castSpell('goldenSpearton');
            if (e.code === 'KeyG') this.castSpell('trainingHaste');
            if (e.code === 'KeyH') this.castSpell('lightningStorm');
            if (e.code === 'KeyJ') this.castSpell('summonDead');
            if (e.code === 'KeyK') this.castSpell('goldRush');
            if (e.code === 'KeyU') this.castSpell('summonMarrowkai');

            // Direct Unit Ability hotkeys
            if (e.code === 'KeyD' && !this.controlledUnit) {
                this.setStance('defend');
            } else if (e.code === 'KeyA' && !this.controlledUnit) {
                this.setStance('attack');
            } else if (e.code === 'KeyR' && !this.controlledUnit) {
                this.setStance('retreat');
            }

            // Quick spawn shortcuts 1-6
            const keyMap = { 'Digit1': 'miner', 'Digit2': 'swordwrath', 'Digit3': 'archidon', 'Digit4': 'spearton', 'Digit5': 'magikill', 'Digit6': 'giant' };
            if (keyMap[e.code]) {
                this.trainUnit(keyMap[e.code]);
            }

            if (e.code === 'Escape' && this.controlledUnit) {
                this.deselectUnit();
            }
        });

        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });

        // Mouse interactions
        this.canvas.addEventListener('mousedown', (e) => {
            if (window.soundCtrl) {
                window.soundCtrl.init();
                window.soundCtrl.resume();
            }
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.worldX = this.mouse.x + this.cameraX;
            this.mouse.isDown = true;

            // Check if clicked inside Minimap (bottom right) to jump camera
            const mw = 220;
            const mh = 50;
            const mx = this.canvas.width - mw - 20;
            const my = this.canvas.height - mh - 20;
            if (this.mouse.x >= mx && this.mouse.x <= mx + mw && this.mouse.y >= my && this.mouse.y <= my + mh) {
                const ratio = Math.max(0, Math.min(1, (this.mouse.x - mx) / mw));
                this.targetCameraX = ratio * this.worldWidth - this.viewWidth / 2;
                this.clampCamera();
                return;
            }

            if (e.button === 0) { // Left click
                // Check if clicked on a player unit to take direct control
                const clickedUnit = this.findUnitAt(this.mouse.worldX, this.mouse.y);
                if (clickedUnit && clickedUnit.team === 'player') {
                    this.selectUnit(clickedUnit);
                    return;
                }

                // If currently controlling a unit, attack / action in mouse direction!
                if (this.controlledUnit) {
                    this.triggerControlledAction();
                    return;
                }

                // Otherwise begin camera drag
                this.isDragging = true;
                this.dragStartX = e.clientX;
                this.cameraDragStartX = this.cameraX;
            } else if (e.button === 2) { // Right click
                e.preventDefault();
                if (this.controlledUnit) {
                    // Spearton block or miner cancel
                    this.controlledUnit.isManualBlock = !this.controlledUnit.isManualBlock;
                }
            }
        });

        this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());

        window.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.mouse.worldX = this.mouse.x + this.cameraX;

            if (this.isDragging) {
                const dx = e.clientX - this.dragStartX;
                this.targetCameraX = this.cameraDragStartX - dx;
                this.clampCamera();
            }
        });

        window.addEventListener('mouseup', () => {
            this.mouse.isDown = false;
            this.isDragging = false;
        });

        // Wheel scroll for camera
        this.canvas.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetCameraX += e.deltaY * 0.8;
            this.clampCamera();
        }, { passive: false });
    }

    findUnitAt(worldX, y) {
        // Find closest friendly living unit
        let closest = null;
        let minDist = 45;
        for (const u of this.units) {
            if (u.state === 'dead') continue;
            const dist = Math.hypot(u.x - worldX, (u.y - 45) - y);
            if (dist < minDist) {
                minDist = dist;
                closest = u;
            }
        }
        return closest;
    }

    selectUnit(unit) {
        if (!unit || unit.team !== 'player' || unit.state === 'dead') return;
        if (this.controlledUnit) {
            this.controlledUnit.isControlled = false;
            this.controlledUnit.isManualBlock = false;
        }
        this.controlledUnit = unit;
        unit.isControlled = true;
        this.showToast(`⭐ Mengendalikan ${unit.type.toUpperCase()}! Bintang Aktif & 2X DAMAGE! (A/D: Gerak, Spasi: Serang, S: Tangkis, Esc: Lepas)`, 'gold');
        if (window.soundCtrl) {
            window.soundCtrl.playStarChime();
        }
        this.updateControlUI();
    }

    deselectUnit() {
        if (this.controlledUnit) {
            this.controlledUnit.isControlled = false;
            this.controlledUnit.isManualBlock = false;
            this.controlledUnit = null;
            this.updateControlUI();
            this.showToast('Mode Komandan (Auto)');
        }
    }

    triggerControlledAction() {
        if (!this.controlledUnit || this.controlledUnit.state === 'dead') return;
        const u = this.controlledUnit;

        if (u.type === 'miner') {
            // Mine rock nearby or attack
            u.attackTimer = 0;
            u.state = 'mine';
            u.mineTimer = 0;
        } else if (u.type === 'archidon') {
            // Aim and shoot
            if (u.attackTimer <= 0) {
                u.state = 'attack';
                u.attackProgress = 0;
            }
        } else {
            // Melee attack
            if (u.attackTimer <= 0) {
                u.state = 'attack';
                u.attackProgress = 0;
            }
        }
    }

    setStance(stance) {
        this.playerStance = stance;
        if (window.soundCtrl) window.soundCtrl.playOrderHorn();

        // Update active UI stance buttons
        document.querySelectorAll('.stance-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.stance === stance);
        });

        const msg = stance === 'defend' ? '🛡️ PERTAHANAN: Berbaris dan tahan musuh!' :
                    stance === 'attack' ? '⚔️ SERANGAN PENUH: Hancurkan patung musuh!' :
                    '🏰 MUNDUR: Masuk benteng perlindungan!';
        this.showToast(msg);
    }

    trainUnit(type) {
        const def = this.unitDefs[type];
        if (!def) return;

        // Check gold (bypass if infiniteGold cheat is active)
        if (!this.cheats.infiniteGold && this.gold < def.cost) {
            this.showToast('⚠️ Emas tidak cukup!', 'warning');
            return;
        }

        // Check pop (bypass if noPopulation cheat is active)
        const playerPop = this.units.filter(u => u.team === 'player' && u.state !== 'dead').length;
        if (!this.cheats.noPopulation && playerPop >= this.maxPopulation) {
            this.showToast('⚠️ Batas populasi tercapai!', 'warning');
            return;
        }

        // Check cooldown (bypass if noCooldown cheat is active)
        if (!this.cheats.noCooldown && this.spawnCooldowns[type] > 0) {
            this.showToast('⏳ Unit masih dalam persiapan!', 'warning');
            return;
        }

        // Deduct gold & trigger cooldown
        if (!this.cheats.infiniteGold) {
            this.gold -= def.cost;
        }
        if (!this.cheats.noCooldown) {
            this.spawnCooldowns[type] = def.cooldownTime;
        } else {
            this.spawnCooldowns[type] = 0;
        }
        this.stats.unitsSpawned++;

        // Spawn unit at player base
        const spawnX = 220 + Math.random() * 40;
        this.spawnUnit(type, 'player', spawnX);

        if (window.soundCtrl) window.soundCtrl.playSpawn();
        this.updateUI();
    }

    spawnUnit(type, team, x) {
        const def = this.unitDefs[type];
        let maxHp = def.hp;
        if (team === 'player' && type === 'spearton' && this.upgrades.speartonHelmet > 0) {
            maxHp += this.upgrades.speartonHelmet * 120;
        }

        const unit = {
            id: Math.random().toString(36).substr(2, 9),
            type: type,
            team: team,
            x: x,
            y: this.groundY,
            hp: maxHp,
            maxHp: maxHp,
            speed: def.speed,
            scale: def.scale,
            dir: team === 'player' ? 1 : -1,
            state: 'idle', // 'idle', 'walk', 'attack', 'mine', 'block', 'hurt', 'dead'
            animProgress: 0,
            attackProgress: 0,
            attackTimer: 0,
            hurtTimer: 0,
            target: null,
            chilledTimer: 0,
            frozenTimer: 0,
            burnTimer: 0,
            skin: (team === 'player') ? this.equippedSkin : 'classic',
            isZombie: (team === 'enemy' && this.isZombieMode),

            // Miner specifics
            carriedGold: 0,
            mineTarget: null,
            mineTimer: 0,

            // Controlled specifics
            isControlled: false,
            isEnemyControlled: false,
            isManualBlock: false,

            // Ragdoll / Death physics
            deathAlpha: 1.0,
            deathRotation: 0,
            deathXOffset: 0,
            deathYOffset: 0,
            deathVx: 0,
            deathVy: 0
        };

        this.units.push(unit);
        return unit;
    }

    clampCamera() {
        const maxScroll = Math.max(0, this.worldWidth - this.viewWidth);
        this.targetCameraX = Math.max(0, Math.min(maxScroll, this.targetCameraX));
    }

    update(dt) {
        if (this.paused || !this.running) return;

        // Apply game speed
        dt = dt * this.gameSpeed;

        // Passive income scaling by difficulty
        const playerIncomeRate = this.difficulty === 'easy' ? 4.0 : (this.difficulty === 'hard' ? 1.5 : (this.difficulty === 'insane' ? 1.8 : 2.5));
        const enemyIncomeRate = this.difficulty === 'easy' ? 1.5 : (this.difficulty === 'hard' ? 5.0 : (this.difficulty === 'insane' ? 8.5 : 2.8));

        this.gold += playerIncomeRate * dt;
        this.enemyGold += (enemyIncomeRate + this.currentLevel * (this.difficulty === 'insane' ? 1.4 : 0.8)) * dt;

        // Statue Auto-Repair Upgrade (Heals statue continuously)
        if (this.upgrades.statue > 0 && this.playerStatue.hp < this.playerStatue.maxHp) {
            this.playerStatue.hp = Math.min(this.playerStatue.maxHp, this.playerStatue.hp + this.upgrades.statue * 4.0 * dt);
        }

        // Cheats persistence
        if (this.cheats.infiniteGold) {
            this.gold = 999999;
        }
        if (this.cheats.infiniteGems) {
            this.gems = 999999;
        }
        if (this.cheats.maxUpgrades) {
            for (const k in this.upgrades) this.upgrades[k] = 3;
            this.upgradePoints = 999;
        }
        if (this.cheats.noPopulation) {
            this.maxPopulation = 9999;
        }
        if (this.cheats.infiniteSpells) {
            for (const k in this.spells) {
                this.spells[k].stock = 99;
                this.spells[k].cooldown = 0;
            }
        }

        // Update Spells Cooldowns & Active Buff Timers
        for (const k in this.spells) {
            const spell = this.spells[k];
            if (!this.cheats.infiniteSpells && spell.cooldown > 0) {
                spell.cooldown = Math.max(0, spell.cooldown - dt);
            }
            if (spell.activeTimer && spell.activeTimer > 0) {
                spell.activeTimer = Math.max(0, spell.activeTimer - dt);
            }
        }
        this.updateSpellUI();

        // Update Spawning Cooldowns (Training Haste boosts speed by 4x!)
        const hasteMult = (this.spells.trainingHaste && this.spells.trainingHaste.activeTimer > 0) ? 4.0 : 1.0;
        for (const key in this.spawnCooldowns) {
            if (this.cheats.noCooldown) {
                this.spawnCooldowns[key] = 0;
            } else if (this.spawnCooldowns[key] > 0) {
                this.spawnCooldowns[key] = Math.max(0, this.spawnCooldowns[key] - dt * hasteMult);
            }
        }

        // Camera Smooth Follow or Keyboard Scrolling
        if (this.controlledUnit && this.controlledUnit.state !== 'dead') {
            this.targetCameraX = this.controlledUnit.x - this.viewWidth / 2;
            this.clampCamera();
        } else if (!this.isDragging) {
            if (this.keys['ArrowLeft']) this.targetCameraX -= 600 * dt;
            if (this.keys['ArrowRight']) this.targetCameraX += 600 * dt;
            this.clampCamera();
        }
        this.cameraX += (this.targetCameraX - this.cameraX) * Math.min(1, 10 * dt);

        // Update Screen Shake
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
        }

        // Update Castle Defense Archers
        this.updateCastleArchers(dt);

        // Update Units
        this.updateUnits(dt);

        // Update Projectiles (Arrows & Spells)
        this.updateProjectiles(dt);

        // Update Particles & Floating Text
        this.updateParticles(dt);

        // Update Enemy AI
        this.updateEnemyAI(dt);

        // Check Victory / Defeat Conditions
        this.checkGameStatus();

        // Update Top HUD
        this.updateUI();
    }

    updateCastleArchers(dt) {
        // Player Castle Archer: fires if enemy comes within 600px of player base
        const pArcher = this.castleArchers.player;
        pArcher.timer -= dt;
        if (pArcher.timer <= 0) {
            const enemyThreat = this.units.find(u => u.team === 'enemy' && u.state !== 'dead' && u.x < 750);
            if (enemyThreat) {
                const dmg = 24 + (this.upgrades.castleArcher || 0) * 10;
                this.fireArrow(pArcher.x, pArcher.y, enemyThreat.x, enemyThreat.y - 30, 'player', dmg);
                pArcher.timer = Math.max(0.65, 1.6 - (this.upgrades.castleArcher || 0) * 0.3);
            }
        }

        // Enemy Castle Archer: fires if player approaches enemy base
        const eArcher = this.castleArchers.enemy;
        eArcher.timer -= dt;
        if (eArcher.timer <= 0) {
            const playerThreat = this.units.find(u => u.team === 'player' && u.state !== 'dead' && u.x > 2450);
            if (playerThreat) {
                this.fireArrow(eArcher.x, eArcher.y, playerThreat.x, playerThreat.y - 30, 'enemy', 24);
                eArcher.timer = 1.6;
            }
        }
    }

    updateUnits(dt) {
        for (let i = this.units.length - 1; i >= 0; i--) {
            const u = this.units[i];

            // Handle dead units
            if (u.state === 'dead') {
                u.deathAlpha -= dt * 0.35;
                u.deathXOffset += u.deathVx * dt;
                u.deathYOffset += u.deathVy * dt;
                u.deathVy += 980 * dt; // gravity
                if (u.deathYOffset > 0) {
                    u.deathYOffset = 0;
                    u.deathVx *= 0.8;
                }
                if (u.deathAlpha <= 0) {
                    this.units.splice(i, 1);
                }
                continue;
            }

            // Timers
            if (u.attackTimer > 0) u.attackTimer -= dt;
            if (u.hurtTimer > 0) u.hurtTimer -= dt;
            if (u.rageTimer > 0) {
                u.rageTimer -= dt;
                if (Math.random() < 0.25) {
                    this.createSparks(u.x + (Math.random() - 0.5) * 16, u.y - 30 - Math.random() * 20, '#ef4444', 1);
                }
            }
            if (u.chilledTimer > 0) {
                u.chilledTimer -= dt;
                if (Math.random() < 0.2) {
                    this.createSparks(u.x + (Math.random() - 0.5) * 16, u.y - 25, '#00f0ff', 1);
                }
            }

            // Burn effect status timer: emit flame sparks
            if (u.burnTimer > 0) {
                u.burnTimer -= dt;
                if (Math.random() < 0.25) {
                    this.createSparks(u.x + (Math.random() - 0.5) * 16, u.y - 30 - Math.random() * 15, '#ff4500', 1);
                }
            }

            // Frozen status timer: completely immobilized for duration!
            if (u.frozenTimer > 0) {
                u.frozenTimer -= dt;
                if (Math.random() < 0.2) {
                    this.createSparks(u.x + (Math.random() - 0.5) * 16, u.y - 25, '#93c5fd', 1);
                }
                // Skip movement & attacks while frozen
                continue;
            }

            // Controlled vs AI behavior
            if (u.isEnemyControlled) {
                this.handleEnemyControlledMicro(u, dt);
            } else if (u.isControlled && u.team === 'player') {
                this.handleControlledUnit(u, dt);
            } else if (u.type === 'miner') {
                this.handleMinerAI(u, dt);
            } else {
                this.handleCombatUnitAI(u, dt);
            }

            // Boundary clamp
            u.x = Math.max(80, Math.min(this.worldWidth - 80, u.x));
        }
    }

    handleControlledUnit(u, dt) {
        const def = this.unitDefs[u.type];
        let moveX = 0;

        if (this.keys['KeyA'] || this.keys['ArrowLeft']) {
            moveX = -1;
            u.dir = -1;
        } else if (this.keys['KeyD'] || this.keys['ArrowRight']) {
            moveX = 1;
            u.dir = 1;
        }

        // Spearton blocking
        if (u.type === 'spearton' && (this.keys['KeyS'] || this.keys['ArrowDown'] || u.isManualBlock)) {
            u.state = 'block';
            return;
        }

        // Attacking or Action
        if (this.keys['Space']) {
            this.triggerControlledAction();
        }

        if (u.state === 'attack') {
            u.animProgress += dt * 3.5;
            u.attackProgress += dt * 3.5;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = def.attackCooldown;
                u.hasHitThisSwing = false;
            }
            return;
        }

        if (u.state === 'mine' && u.type === 'miner') {
            u.animProgress += dt * 3;
            u.mineTimer += dt;
            if (u.mineTimer >= 0.6) {
                u.mineTimer = 0;
                if (window.soundCtrl) window.soundCtrl.playMine();
                this.createSparks(u.x + u.dir * 25, u.y - 15, '#ecc94b', 6);
                u.carriedGold += 20;
                this.showFloatingText(u.x, u.y - 50, '+20 Gold', '#ecc94b');
                if (u.carriedGold >= 100) {
                    u.state = 'walk';
                }
            }
            return;
        }

        if (moveX !== 0) {
            u.state = 'walk';
            u.animProgress += dt * 3.5;
            const chilledMult = (u.chilledTimer > 0 ? 0.65 : 1.0);
            u.x += moveX * u.speed * 65 * dt * chilledMult;
        } else {
            u.state = 'idle';
        }
    }

    handleMinerAI(u, dt) {
        const baseStatue = u.team === 'player' ? this.playerStatue : this.enemyStatue;
        const stance = u.team === 'player' ? this.playerStance : this.enemyStance;
        const isHustling = u.team === 'player' && this.spells.minerHustle && this.spells.minerHustle.activeTimer > 0;
        const miningUpgradeBonus = (u.team === 'player' ? (this.upgrades.mining || 0) : 0);
        const chilledMult = (u.chilledTimer > 0 ? 0.65 : 1.0);
        const minerSpeed = u.speed * (isHustling ? 1.85 : 1.0) * (1 + miningUpgradeBonus * 0.15) * chilledMult;

        // If retreat stance: run into safe garrison behind statue
        if (stance === 'retreat') {
            const safeX = u.team === 'player' ? 140 : 3060;
            if (Math.abs(u.x - safeX) > 15) {
                u.dir = safeX > u.x ? 1 : -1;
                u.x += u.dir * minerSpeed * 60 * dt;
                u.state = 'walk';
                u.animProgress += dt * (isHustling ? 4.5 : 3.0);
            } else {
                u.state = 'idle';
            }
            return;
        }

        // If bag is full: walk back to statue and deposit gold
        const bagCapacity = (isHustling ? 120 : 80) + miningUpgradeBonus * 25;
        if (u.carriedGold >= bagCapacity) {
            const depositX = baseStatue.x;
            const dist = Math.abs(u.x - depositX);

            if (dist > 30) {
                u.dir = depositX > u.x ? 1 : -1;
                u.x += u.dir * minerSpeed * 55 * dt;
                u.state = 'walk';
                u.animProgress += dt * (isHustling ? 4.5 : 3.0);
            } else {
                // Deposit gold!
                if (u.team === 'player') {
                    this.gold += u.carriedGold;
                    this.stats.goldMined += u.carriedGold;
                    if (window.soundCtrl) window.soundCtrl.playGold();
                    this.showFloatingText(u.x, u.y - 70, `+${u.carriedGold} Gold`, '#ffd700');
                    this.createSparks(u.x, u.y - 40, '#ffd700', 8);
                } else {
                    this.enemyGold += u.carriedGold;
                }
                u.carriedGold = 0;
                u.state = 'idle';
            }
            return;
        }

        // Find best gold mine
        let targetMine = null;
        let bestDist = Infinity;
        for (const mine of this.goldMines) {
            // Player miners prefer mines on left side, enemy prefers right side
            if (u.team === 'player' && mine.x > 2200) continue;
            if (u.team === 'enemy' && mine.x < 1000) continue;

            const d = Math.abs(u.x - mine.x);
            if (d < bestDist) {
                bestDist = d;
                targetMine = mine;
            }
        }

        if (!targetMine) targetMine = this.goldMines[u.team === 'player' ? 0 : 3];

        const mineX = targetMine.x;
        const distToMine = Math.abs(u.x - mineX);

        if (distToMine > 20) {
            u.dir = mineX > u.x ? 1 : -1;
            u.x += u.dir * minerSpeed * 60 * dt;
            u.state = 'walk';
            u.animProgress += dt * (isHustling ? 4.5 : 3.0);
        } else {
            // At mine! Mine gold!
            u.state = 'mine';
            u.animProgress += dt * (isHustling ? 4.5 : 2.8);
            u.mineTimer += dt * (isHustling ? 1.6 : 1.0) * (1 + miningUpgradeBonus * 0.25);
            if (u.mineTimer >= 0.8) {
                u.mineTimer = 0;
                const minedAmount = (isHustling ? 40 : 20) + miningUpgradeBonus * 5;
                u.carriedGold += minedAmount;
                if (u.team === 'player' && window.soundCtrl) window.soundCtrl.playMine();
                this.createSparks(u.x + u.dir * 18, u.y - 20, isHustling ? '#ffd700' : '#f6e05e', isHustling ? 8 : 4);
                this.showFloatingText(u.x, u.y - 45, `+${minedAmount}`, isHustling ? '#ffd700' : '#f6e05e');
            }
        }
    }

    handleCombatUnitAI(u, dt) {
        const def = this.unitDefs[u.type];
        const isPlayer = u.team === 'player';
        const stance = isPlayer ? this.playerStance : this.enemyStance;
        const enemyTeam = isPlayer ? 'enemy' : 'player';
        const enemyStatue = isPlayer ? this.enemyStatue : this.playerStatue;

        // Find nearest living enemy unit or enemy statue
        let nearestTarget = null;
        let nearestDist = Infinity;

        for (const target of this.units) {
            if (target.team === enemyTeam && target.state !== 'dead') {
                const dist = Math.abs(u.x - target.x);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestTarget = target;
                }
            }
        }

        // Distance to enemy statue
        const distToStatue = Math.abs(u.x - enemyStatue.x);
        let targetIsStatue = false;
        if (distToStatue < nearestDist) {
            nearestDist = distToStatue;
            nearestTarget = enemyStatue;
            targetIsStatue = true;
        }

        // Currently in attack swing animation
        if (u.state === 'attack') {
            u.animProgress += dt * 3.5;
            u.attackProgress += dt * 3.5;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u, nearestTarget);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = def.attackCooldown;
                u.hasHitThisSwing = false;
            }
            return;
        }

        // Tactical Stance Logic
        if (stance === 'retreat') {
            const garrisonX = isPlayer ? 140 : 3060;
            if (Math.abs(u.x - garrisonX) > 20) {
                u.dir = garrisonX > u.x ? 1 : -1;
                u.x += u.dir * u.speed * 60 * dt;
                u.state = 'walk';
                u.animProgress += dt * 3.5;
            } else {
                u.state = 'idle';
            }
            return;
        }

        // Defense stance line
        const defendLineX = isPlayer ? 450 : 2750;

        // If target is in combat range
        const attackRange = def.range;
        if (nearestTarget && nearestDist <= attackRange) {
            u.dir = nearestTarget.x > u.x ? 1 : -1;

            // Spearton block chance if facing archers/enemies
            if (u.type === 'spearton' && nearestDist > 45 && Math.random() < 0.3) {
                u.state = 'block';
                return;
            }

            if (u.attackTimer <= 0) {
                u.state = 'attack';
                u.attackProgress = 0;
                u.hasHitThisSwing = false;
            } else {
                u.state = 'idle';
            }
            return;
        }

        // Target out of range: should advance or hold defense line?
        let shouldAdvance = false;

        if (stance === 'attack') {
            shouldAdvance = true;
        } else if (stance === 'defend') {
            // In defend stance, advance only if enemy crossed the front line or approaching
            if (nearestTarget && nearestDist < 500) {
                shouldAdvance = true;
            } else {
                // Return to defense line
                const distToLine = Math.abs(u.x - defendLineX);
                if (distToLine > 30) {
                    u.dir = defendLineX > u.x ? 1 : -1;
                    const chilledMult = (u.chilledTimer > 0 ? 0.65 : 1.0);
                    u.x += u.dir * u.speed * 55 * dt * chilledMult;
                    u.state = 'walk';
                    u.animProgress += dt * 3;
                    return;
                } else {
                    u.state = 'idle';
                    u.dir = isPlayer ? 1 : -1;
                    return;
                }
            }
        }

        const speedMult = (u.rageTimer > 0 ? 1.25 : 1.0) * (u.chilledTimer > 0 ? 0.65 : 1.0);
        if (shouldAdvance && nearestTarget) {
            u.dir = nearestTarget.x > u.x ? 1 : -1;
            u.x += u.dir * u.speed * speedMult * 60 * dt;
            u.state = 'walk';
            u.animProgress += dt * (u.rageTimer > 0 ? 4.5 : 3.5);
        } else {
            u.state = 'idle';
        }
    }

    executeAttack(attacker, explicitTarget = null) {
        const def = this.unitDefs[attacker.type];
        const isPlayer = attacker.team === 'player';
        const enemyTeam = isPlayer ? 'enemy' : 'player';

        let damage = def.attackDmg;
        if (isPlayer) {
            if (attacker.type === 'swordwrath') damage += (this.upgrades.sword || 0) * 8;
            else if (attacker.type === 'archidon') damage += (this.upgrades.bow || 0) * 10;
            else if (attacker.type === 'giant') damage += (this.upgrades.giantClub || 0) * 45;
            else if (attacker.type === 'magikill') damage += (this.upgrades.magikillStaff || 0) * 35;
            else if (attacker.type === 'spearton') damage += (this.upgrades.speartonSpear || 0) * 14;
        }
        if (attacker.rageTimer > 0) {
            damage = Math.round(damage * 1.55);
        }
        if (attacker.isGolden) {
            damage = Math.round(damage * 1.4);
        }

        if (attacker.type === 'archidon') {
            // Launch arrow
            const bowRange = 300 + (isPlayer ? (this.upgrades.bow || 0) * 50 : 0);
            const targetX = explicitTarget ? explicitTarget.x : (attacker.x + attacker.dir * bowRange);
            const targetY = explicitTarget ? (explicitTarget.y - 35) : (attacker.y - 35);
            this.fireArrow(attacker.x + attacker.dir * 18, attacker.y - 45, targetX, targetY, attacker.team, damage, attacker);
            if (window.soundCtrl) window.soundCtrl.playBowShoot();
            return;
        }

        if (attacker.type === 'magikill') {
            // Launch magic orb blast
            const targetX = explicitTarget ? explicitTarget.x : (attacker.x + attacker.dir * 250);
            this.fireMagicBlast(attacker.x + attacker.dir * 25, attacker.y - 65, targetX, attacker.team, damage, attacker);
            if (window.soundCtrl) window.soundCtrl.playMagicCast();
            return;
        }

        if (attacker.type === 'giant') {
            // Massive AoE ground slam!
            this.triggerScreenShake(0.35, 9);
            if (window.soundCtrl) window.soundCtrl.playGiantSmash();
            this.createShockwave(attacker.x + attacker.dir * 45, this.groundY);

            // Damage all enemies in shockwave range
            for (const target of this.units) {
                if (target.team === enemyTeam && target.state !== 'dead') {
                    if (Math.abs(target.x - attacker.x) < 130) {
                        this.dealDamage(target, damage, attacker);
                        // Knockback
                        target.x += attacker.dir * 35;
                    }
                }
            }

            // Damage enemy statue if in range
            const targetStatue = isPlayer ? this.enemyStatue : this.playerStatue;
            if (Math.abs(targetStatue.x - attacker.x) < 130) {
                this.damageStatue(targetStatue, damage);
            }
            return;
        }

        if (attacker.type === 'marrowkai') {
            // Devastating Demonic Reaper Scythe Cleave!
            this.triggerScreenShake(0.45, 11);
            if (window.soundCtrl) window.soundCtrl.playGiantSmash();
            this.createShockwave(attacker.x + attacker.dir * 55, this.groundY);
            this.createMagicExplosionParticles(attacker.x + attacker.dir * 45, this.groundY - 50, '#9333ea');

            // Cleave damage all enemies in 140px range
            for (const target of this.units) {
                if (target.team === enemyTeam && target.state !== 'dead') {
                    if (Math.abs(target.x - attacker.x) < 140) {
                        this.dealDamage(target, damage, attacker);
                        target.x += attacker.dir * 45; // Massive knockback
                    }
                }
            }
            const targetStatue = isPlayer ? this.enemyStatue : this.playerStatue;
            if (Math.abs(targetStatue.x - attacker.x) < 140) {
                this.damageStatue(targetStatue, damage);
            }
            return;
        }

        // Standard Melee Attack (Swordwrath, Spearton, Miner, Undead)
        if (attacker.type === 'undead') {
            if (window.soundCtrl) window.soundCtrl.playSwordSlash();
            this.createSparks(attacker.x + attacker.dir * 25, attacker.y - 30, '#10b981', 8);
        } else if (attacker.type === 'swordwrath') {
            if (window.soundCtrl) window.soundCtrl.playSwordSlash();
        } else if (attacker.type === 'spearton') {
            if (window.soundCtrl) window.soundCtrl.playSpearThrust();
        }

        // Check melee hit targets
        for (const target of this.units) {
            if (target.team === enemyTeam && target.state !== 'dead') {
                const dist = Math.abs(target.x - attacker.x);
                if (dist <= def.range + 10 && ((attacker.dir > 0 && target.x >= attacker.x) || (attacker.dir < 0 && target.x <= attacker.x))) {
                    this.dealDamage(target, damage, attacker);
                    return; // Hit first target
                }
            }
        }

        // Check if hitting statue
        const targetStatue = isPlayer ? this.enemyStatue : this.playerStatue;
        if (Math.abs(targetStatue.x - attacker.x) <= def.range + 30) {
            this.damageStatue(targetStatue, damage);
        }
    }

    dealDamage(target, rawDamage, attacker) {
        let finalDamage = rawDamage;

        // Controlled Troop Multiplier: "dan saat mengontrolkan pasukan dan musuh menerima damage akan X2 damage tersebut"
        const isAttackerControlled = attacker && (attacker.isControlled || attacker.isEnemyControlled || (attacker.team === 'player' && this.controlledUnit === attacker));
        if (isAttackerControlled && target.state !== 'dead') {
            finalDamage = Math.round(finalDamage * 2);
            this.showFloatingText(target.x, target.y - 85, '💥 X2 DAMAGE!', '#ffd700');
            if (window.soundCtrl) window.soundCtrl.playCriticalHit();
            this.triggerScreenShake(0.18, 5);
            this.createSparks(target.x, target.y - 40, '#ffd700', 8);
        }

        // Spearton Shield Block reduction & Damage Reflection
        if (target.type === 'spearton' && (target.state === 'block' || target.isManualBlock)) {
            const shieldLvl = target.team === 'player' ? (this.upgrades.speartonShield || 0) : (this.difficulty === 'insane' ? 2 : 0);
            const blockFactor = Math.max(0.1, 0.25 - shieldLvl * 0.05); // Level 3 blocks 90%
            finalDamage = Math.round(finalDamage * blockFactor);

            if (shieldLvl > 0 && attacker && attacker.hp && attacker.team !== target.team) {
                // Reflect 15% damage per level back to attacker!
                const reflectDmg = Math.round(rawDamage * 0.15 * shieldLvl);
                attacker.hp -= reflectDmg;
                this.showFloatingText(attacker.x, attacker.y - 40, `REFLECT -${reflectDmg}`, '#38bdf8');
                if (attacker.hp <= 0) {
                    this.killUnit(attacker, target ? target.dir : 1);
                }
            }

            if (window.soundCtrl) window.soundCtrl.playShieldBlock();
            this.createSparks(target.x, target.y - 45, '#d69e2e', 8);
            this.showFloatingText(target.x, target.y - 70, 'BLOCKED!', '#60a5fa');
        } else {
            if (window.soundCtrl) window.soundCtrl.playSwordHit();
            this.createBloodSpurt(target.x, target.y - 40, target.team === 'player' ? '#00e5ff' : '#ff3344');
        }

        // Elemental Skins Effects (Fire / Ice)
        const attackerSkin = (attacker && attacker.skin) ? attacker.skin : (attacker && attacker.team === 'player' ? this.equippedSkin : 'classic');
        const targetSkin = (target && target.skin) ? target.skin : (target && target.team === 'player' ? this.equippedSkin : 'classic');

        // FIRE SKIN ATTACK: "skin api memiliki efek bakar yaitu 10 kerusakan"
        if (attackerSkin === 'fire' && target.state !== 'dead') {
            target.burnTimer = 2.5;
            const burnDmg = 10;
            target.hp -= burnDmg;
            this.showFloatingText(target.x, target.y - 50, `🔥 BAKAR -${burnDmg}`, '#ff6b00');
            this.createSparks(target.x, target.y - 30, '#ff4500', 9);
            if (window.soundCtrl) window.soundCtrl.playFireBurn();
            if (attacker && attacker.team === 'player') {
                this.stats.damageDealt += burnDmg;
            }
        }

        // ICE SKIN ATTACK: chills and slows movement by 35%
        if (attackerSkin === 'ice' && target.state !== 'dead') {
            target.chilledTimer = 2.5;
            this.createSparks(target.x, target.y - 30, '#00f0ff', 7);
            this.showFloatingText(target.x, target.y - 50, 'CHILLED ❄️', '#38bdf8');
        }

        // Apply primary damage to target
        target.hp -= finalDamage;
        target.hurtTimer = 0.2;

        // RETALIATION ON RECEIVING DAMAGE:
        // FIRE SKIN: "dan saat terkena damage akan mendapatkan kerusakan 5 api"
        if (targetSkin === 'fire' && attacker && attacker.hp > 0 && attacker.team !== target.team) {
            const fireRetal = 5;
            attacker.hp -= fireRetal;
            this.showFloatingText(attacker.x, attacker.y - 45, `🔥 -${fireRetal} API`, '#ff6b00');
            this.createSparks(attacker.x, attacker.y - 30, '#ff4500', 8);
            if (window.soundCtrl) window.soundCtrl.playFireBurn();
            if (target.team === 'player') {
                this.stats.damageDealt += fireRetal;
            }
            if (attacker.hp <= 0) {
                this.killUnit(attacker, target ? target.dir : 1);
            }
        }

        // ICE SKIN: "kalau skin es efeknya saat menerima damage musuhnya akan membeku selama 3 detik"
        if (targetSkin === 'ice' && attacker && attacker.hp > 0 && attacker.team !== target.team) {
            attacker.frozenTimer = 3.0;
            this.showFloatingText(attacker.x, attacker.y - 65, '❄️ MEMBEKU (3s)!', '#38bdf8');
            this.createSparks(attacker.x, attacker.y - 30, '#00f0ff', 14);
            if (window.soundCtrl) window.soundCtrl.playIceFreeze();
        }

        if (attacker && attacker.team === 'player') {
            this.stats.damageDealt += finalDamage;
        }

        // Damage Number
        const color = target.team === 'player' ? '#ef4444' : '#f59e0b';
        this.showFloatingText(target.x, target.y - 60, `-${finalDamage}`, color);

        // Check death
        if (target.hp <= 0) {
            this.killUnit(target, attacker ? attacker.dir : 1);
        }
    }

    killUnit(unit, knockbackDir = 1) {
        unit.state = 'dead';
        unit.deathVx = knockbackDir * (120 + Math.random() * 80);
        unit.deathVy = -180 - Math.random() * 120;
        unit.deathRotation = knockbackDir * (Math.PI * 0.4);

        if (unit.isControlled && unit.team === 'player') {
            this.deselectUnit();
            this.showToast('⚠️ Unit Anda Gugur!', 'warning');
        }

        if (unit.isEnemyControlled) {
            this.showToast('⭐ Komandan Pasukan Musuh Telah Gugur! (+300 Gold, +50 Gems)', 'gold');
            this.gold += 300;
            this.gems += 50;
            this.enemyControlledUnit = null;
            this.enemyControlCooldown = 12;
            this.updateHUD();
        }

        if (unit.team === 'enemy') {
            this.stats.enemiesKilled++;
            // Bounty reward
            const bounty = Math.round(this.unitDefs[unit.type].cost * 0.35);
            this.gold += bounty;
            this.showFloatingText(unit.x, unit.y - 40, `+${bounty}G`, '#ffd700');
        }
    }

    damageStatue(statue, dmg) {
        statue.hp = Math.max(0, statue.hp - dmg);
        this.triggerScreenShake(0.18, 5);
        this.createSparks(statue.x, this.groundY - 90, '#cbd5e0', 8);
        this.showFloatingText(statue.x, this.groundY - 180, `-${dmg}`, '#ef4444');
    }

    fireArrow(startX, startY, targetX, targetY, team, damage, shooter = null) {
        const dx = targetX - startX;
        const dy = targetY - startY;
        const dist = Math.abs(dx);

        // Calculate ballistic arc velocity
        const timeToTarget = Math.max(0.4, dist / 480);
        const vx = dx / timeToTarget;
        const vy = (dy - 0.5 * 750 * (timeToTarget * timeToTarget)) / timeToTarget;

        this.projectiles.push({
            type: 'arrow',
            x: startX,
            y: startY,
            vx: vx,
            vy: vy,
            gravity: 750,
            team: team,
            damage: damage,
            angle: Math.atan2(vy, vx),
            shooter: shooter,
            alive: true
        });
    }

    fireMagicBlast(startX, startY, targetX, team, damage, shooter = null) {
        const dir = targetX > startX ? 1 : -1;
        this.projectiles.push({
            type: 'magic',
            x: startX,
            y: startY,
            vx: dir * 320,
            vy: 0,
            gravity: 0,
            team: team,
            damage: damage,
            targetX: targetX,
            shooter: shooter,
            alive: true
        });
    }

    updateProjectiles(dt) {
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.angle = Math.atan2(p.vy, p.vx);

            // Ground hit
            if (p.y >= this.groundY) {
                if (p.type === 'arrow') {
                    if (window.soundCtrl) window.soundCtrl.playArrowHit();
                    // Stick arrow into ground
                    this.stuckArrows.push({ x: p.x, y: this.groundY, angle: p.angle, alpha: 1.0 });
                } else if (p.type === 'magic') {
                    this.explodeMagic(p.x, this.groundY, p.team, p.damage, p.shooter);
                }
                this.projectiles.splice(i, 1);
                continue;
            }

            // Check collision with units
            const enemyTeam = p.team === 'player' ? 'enemy' : 'player';
            let hit = false;

            for (const u of this.units) {
                if (u.team === enemyTeam && u.state !== 'dead') {
                    if (Math.abs(p.x - u.x) < 22 && Math.abs(p.y - (u.y - 45)) < 40) {
                        if (p.type === 'arrow') {
                            if (window.soundCtrl) window.soundCtrl.playArrowHit();
                            this.dealDamage(u, p.damage, p.shooter);
                            hit = true;
                        } else if (p.type === 'magic') {
                            this.explodeMagic(p.x, p.y, p.team, p.damage, p.shooter);
                            hit = true;
                        }
                        break;
                    }
                }
            }

            // Check collision with enemy statue
            const targetStatue = p.team === 'player' ? this.enemyStatue : this.playerStatue;
            if (!hit && Math.abs(p.x - targetStatue.x) < 40 && p.y > this.groundY - 180) {
                if (p.type === 'arrow') {
                    this.damageStatue(targetStatue, p.damage);
                    this.stuckArrows.push({ x: p.x, y: p.y, angle: p.angle, alpha: 1.0 });
                } else if (p.type === 'magic') {
                    this.explodeMagic(p.x, p.y, p.team, p.damage, p.shooter);
                }
                hit = true;
            }

            if (hit) {
                this.projectiles.splice(i, 1);
            }
        }

        // Fade stuck arrows over time
        for (let i = this.stuckArrows.length - 1; i >= 0; i--) {
            this.stuckArrows[i].alpha -= dt * 0.05;
            if (this.stuckArrows[i].alpha <= 0) {
                this.stuckArrows.splice(i, 1);
            }
        }
    }

    explodeMagic(x, y, team, damage, shooter = null) {
        if (window.soundCtrl) window.soundCtrl.playExplosion();
        this.triggerScreenShake(0.25, 7);
        this.createMagicExplosionParticles(x, y, team === 'player' ? '#00e5ff' : '#ff0055');

        const enemyTeam = team === 'player' ? 'enemy' : 'player';
        for (const u of this.units) {
            if (u.team === enemyTeam && u.state !== 'dead') {
                if (Math.abs(u.x - x) < 95) {
                    this.dealDamage(u, damage, shooter);
                    u.x += (u.x > x ? 1 : -1) * 30; // knockback
                }
            }
        }

        const statue = team === 'player' ? this.enemyStatue : this.playerStatue;
        if (Math.abs(statue.x - x) < 95) {
            this.damageStatue(statue, damage);
        }
    }

    updateEnemyAI(dt) {
        this.enemyAiTimer += dt;
        this.enemySpellCooldown -= dt;

        // Mode Gila-Gilaan: Musuh Mengontrolkan Pasukan
        if (this.difficulty === 'insane') {
            this.updateEnemyControlledUnit(dt);
        }

        // Enemy Spellcasting AI
        if (this.enemySpellCooldown <= 0) {
            const enemyUnits = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
            const enemyCombat = enemyUnits.filter(u => u.type !== 'miner');
            const playerUnits = this.units.filter(u => u.team === 'player' && u.state !== 'dead');
            const playerCombat = playerUnits.filter(u => u.type !== 'miner');

            let spellToCast = null;
            if (this.enemyStatue.hp < this.enemyStatue.maxHp * 0.45) {
                spellToCast = 'healWave';
            } else if (playerCombat.some(u => u.x > 1800)) {
                spellToCast = Math.random() < 0.5 ? 'lightningStorm' : 'arrowRain';
            } else if (this.enemyStance === 'attack') {
                const atkChoices = ['swordRage', 'trainingHaste'];
                if (this.currentLevel >= 15) atkChoices.push('summonDead');
                if (this.currentLevel >= 35) atkChoices.push('summonMarrowkai');
                spellToCast = atkChoices[Math.floor(Math.random() * atkChoices.length)];
            } else if (this.currentLevel >= 20 && Math.random() < 0.45) {
                spellToCast = 'summonDead';
            } else if (this.currentLevel >= 50 && Math.random() < 0.35) {
                spellToCast = 'summonMarrowkai';
            }

            if (spellToCast) {
                this.castSpell(spellToCast, 'enemy');
                const spellNames = {
                    healWave: 'Healing Wave 💖',
                    arrowRain: 'Hujan Panah Api 🏹',
                    lightningStorm: 'Badai Petir Halilintar ⚡',
                    swordRage: 'Sword Rage Membara ⚔️',
                    trainingHaste: 'Training Haste ➰',
                    summonDead: 'Bangkitkan Mayat Hidup 💀',
                    summonMarrowkai: 'Titan Marrowkai ☠️'
                };
                this.showEnemySpellAlert(`⚠️ MUSUH MENGELUARKAN MANTRA: ${spellNames[spellToCast] || spellToCast}!`);
                const spellCdBase = (this.difficulty === 'insane') ? 22 : 42;
                const spellCdMin = (this.difficulty === 'insane') ? 9 : 16;
                this.enemySpellCooldown = Math.max(spellCdMin, spellCdBase - Math.min(20, this.currentLevel * 0.3));
            }
        }

        const aiInterval = this.difficulty === 'insane' ? 0.45 : (this.difficulty === 'hard' ? 0.8 : 1.2);
        if (this.enemyAiTimer < aiInterval) return;
        this.enemyAiTimer = 0;

        const enemyUnits = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
        const enemyMiners = enemyUnits.filter(u => u.type === 'miner');
        const enemyCombat = enemyUnits.filter(u => u.type !== 'miner');

        const playerUnits = this.units.filter(u => u.team === 'player' && u.state !== 'dead');
        const playerCombat = playerUnits.filter(u => u.type !== 'miner');

        // Train miners if fewer than target
        const maxMiners = this.difficulty === 'insane' ? 5 : (this.currentLevel >= 60 ? 4 : (this.currentLevel >= 25 ? 3 : 2));
        if (enemyMiners.length < maxMiners && this.enemyGold >= 150) {
            this.enemyGold -= 150;
            this.spawnUnit('miner', 'enemy', 2900);
            return;
        }

        // Strategic Pro Counter Recruitment (Gila-gilaan mode uses pro micro-counters)
        const recruitChoices = [];
        if (this.difficulty === 'insane') {
            const playerSpeartons = playerCombat.filter(u => u.type === 'spearton').length;
            const playerArchidons = playerCombat.filter(u => u.type === 'archidon').length;

            if (playerSpeartons >= 2 && this.enemyGold >= 800) recruitChoices.push('magikill');
            if (playerSpeartons >= 2 && this.enemyGold >= 300) recruitChoices.push('archidon');
            if (playerArchidons >= 2 && this.enemyGold >= 125) recruitChoices.push('swordwrath');
            if (this.enemyGold >= 1800) recruitChoices.push('marrowkai');
            if (this.enemyGold >= 1200) recruitChoices.push('giant');
            if (this.enemyGold >= 500) recruitChoices.push('spearton');
        }

        // Standard level-based pool
        if (recruitChoices.length === 0) {
            if (this.enemyGold >= 1800 && this.currentLevel >= 30) recruitChoices.push('marrowkai');
            if (this.enemyGold >= 1200 && this.currentLevel >= 5) recruitChoices.push('giant');
            if (this.enemyGold >= 800 && this.currentLevel >= 4) recruitChoices.push('magikill');
            if (this.enemyGold >= 500 && this.currentLevel >= 3) recruitChoices.push('spearton');
            if (this.enemyGold >= 300 && this.currentLevel >= 2) recruitChoices.push('archidon');
            if (this.enemyGold >= 140 && this.currentLevel >= 15) recruitChoices.push('undead');
            if (this.enemyGold >= 125) recruitChoices.push('swordwrath');
        }

        if (recruitChoices.length > 0 && enemyUnits.length < this.maxPopulation) {
            const chosen = recruitChoices[Math.floor(Math.random() * recruitChoices.length)];
            const def = this.unitDefs[chosen];
            if (this.enemyGold >= def.cost) {
                this.enemyGold -= def.cost;
                this.spawnUnit(chosen, 'enemy', 2920);
            }
        }

        // Strategic Stance Management
        if (this.enemyStatue.hp < 400 && enemyCombat.length <= 2) {
            this.enemyStance = 'retreat';
        } else if (this.difficulty === 'insane') {
            // Insane AI is hyper-aggressive
            this.enemyStance = (enemyCombat.length >= 2 || enemyCombat.length >= playerCombat.length) ? 'attack' : 'defend';
        } else if (enemyCombat.length >= 4 + Math.min(10, Math.floor(this.currentLevel * 0.15)) || enemyCombat.length > playerCombat.length * 1.3) {
            this.enemyStance = 'attack';
        } else {
            this.enemyStance = 'defend';
        }
    }

    // Mode Gila-Gilaan: Musuh Mengontrolkan Pasukan
    updateEnemyControlledUnit(dt) {
        if (this.gameOver) return;

        // Check if existing enemy controlled unit is still alive and present
        if (this.enemyControlledUnit) {
            if (this.enemyControlledUnit.state === 'dead' || !this.units.includes(this.enemyControlledUnit)) {
                this.enemyControlledUnit = null;
                this.enemyControlCooldown = 8.0; // Quick regroup cooldown
            }
        }

        if (!this.enemyControlledUnit) {
            this.enemyControlCooldown = (this.enemyControlCooldown || 0) - dt;
            if (this.enemyControlCooldown <= 0) {
                // Find living combat units on enemy side
                const enemyCombat = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead' && u.type !== 'miner');
                if (enemyCombat.length > 0) {
                    const priority = ['marrowkai', 'giant', 'spearton', 'magikill', 'swordwrath', 'archidon', 'undead'];
                    enemyCombat.sort((a, b) => {
                        const idxA = priority.indexOf(a.type);
                        const idxB = priority.indexOf(b.type);
                        return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
                    });
                    const best = enemyCombat[0];
                    best.isEnemyControlled = true;
                    best.isControlled = true;
                    this.enemyControlledUnit = best;
                    this.enemyControlCooldown = 25; // Hold command

                    this.showToast(`🔥 [MODE GILA-GILAAN] Musuh Mengendalikan ${best.type.toUpperCase()}! (⭐ 2X Damage)!`, 'warning');
                    this.showFloatingText(best.x, best.y - 75, '⭐ KOMANDAN MUSUH AKTIF!', '#ef4444');
                    if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                }
            }
        }
    }

    handleEnemyControlledMicro(u, dt) {
        const def = this.unitDefs[u.type];
        const playerStatue = this.playerStatue;
        const speedMult = (u.rageTimer > 0 ? 1.35 : 1.0) * (u.chilledTimer > 0 ? 0.65 : 1.0);

        // Find nearest living player target
        let nearestTarget = null;
        let nearestDist = Infinity;
        for (const target of this.units) {
            if (target.team === 'player' && target.state !== 'dead') {
                const dist = Math.abs(u.x - target.x);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    nearestTarget = target;
                }
            }
        }

        const distToStatue = Math.abs(u.x - playerStatue.x);
        let targetGoal = nearestTarget;
        let targetDist = nearestDist;
        if (distToStatue < nearestDist) {
            targetGoal = playerStatue;
            targetDist = distToStatue;
        }

        if (!targetGoal) {
            u.state = 'idle';
            return;
        }

        u.dir = targetGoal.x > u.x ? 1 : -1;

        // Currently in attack animation
        if (u.state === 'attack') {
            u.animProgress += dt * 3.8;
            u.attackProgress += dt * 3.8;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u, targetGoal);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = def.attackCooldown * 0.85; // Pro attack recovery
                u.hasHitThisSwing = false;
            }
            return;
        }

        // Spearton smart defensive micro: block if facing incoming melee attack
        if (u.type === 'spearton') {
            if (nearestTarget && nearestDist < 95 && (nearestTarget.state === 'attack' || nearestTarget.isControlled)) {
                u.state = 'block';
                u.isManualBlock = true;
                return;
            } else {
                u.isManualBlock = false;
            }
        }

        // Archidon pro kiting micro: maintain safe distance
        if (u.type === 'archidon') {
            if (nearestTarget && nearestDist < 160) {
                u.x += -u.dir * u.speed * speedMult * 80 * dt;
                u.state = 'walk';
                u.animProgress += dt * 3.5;
                return;
            } else if (targetDist <= def.range) {
                if (u.attackTimer <= 0) {
                    u.state = 'attack';
                    u.attackProgress = 0;
                    u.hasHitThisSwing = false;
                } else {
                    u.state = 'idle';
                }
                return;
            }
        }

        // Within attack range: strike with 2X damage!
        if (targetDist <= def.range) {
            if (u.attackTimer <= 0) {
                u.state = 'attack';
                u.attackProgress = 0;
                u.hasHitThisSwing = false;
            } else {
                u.state = 'idle';
            }
            return;
        }

        // Rapid advance towards target
        u.x += u.dir * u.speed * speedMult * 75 * dt;
        u.state = 'walk';
        u.animProgress += dt * 3.8;
        u.x = Math.max(80, Math.min(this.worldWidth - 80, u.x));
    }

    checkGameStatus() {
        if (this.gameOver) return;

        // Player Victory
        if (this.enemyStatue.hp <= 0) {
            this.gameOver = true;
            this.gameWon = true;
            if (window.soundCtrl) window.soundCtrl.playVictory();
            this.showGameOverModal(true);
        }

        // Player Defeat
        if (this.playerStatue.hp <= 0) {
            this.gameOver = true;
            this.gameWon = false;
            if (window.soundCtrl) window.soundCtrl.playDefeat();
            this.showGameOverModal(false);
        }
    }

    triggerScreenShake(duration, intensity) {
        this.shakeTime = duration;
        this.shakeIntensity = intensity;
    }

    // Particle FX
    createSparks(x, y, color, count = 6) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 160,
                vy: -Math.random() * 120 - 40,
                gravity: 350,
                color: color,
                size: 2.5 + Math.random() * 2,
                alpha: 1.0,
                decay: 1.8 + Math.random() * 1.5
            });
        }
    }

    createBloodSpurt(x, y, color) {
        for (let i = 0; i < 7; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 140,
                vy: -Math.random() * 80 - 20,
                gravity: 400,
                color: color,
                size: 2 + Math.random() * 2,
                alpha: 0.9,
                decay: 2.5
            });
        }
    }

    createShockwave(x, y) {
        this.particles.push({
            type: 'shockwave',
            x: x,
            y: y,
            radius: 5,
            maxRadius: 85,
            alpha: 0.9,
            color: '#ecc94b',
            decay: 2.0
        });
    }

    createMagicExplosionParticles(x, y, color) {
        for (let i = 0; i < 22; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 40 + Math.random() * 180;
            this.particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                gravity: 50,
                color: color,
                size: 3 + Math.random() * 3,
                alpha: 1.0,
                decay: 1.6
            });
        }
    }

    showFloatingText(x, y, text, color) {
        this.floatingTexts.push({
            x: x,
            y: y,
            text: text,
            color: color,
            alpha: 1.0,
            vy: -40
        });
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            if (p.type === 'shockwave') {
                p.radius += 180 * dt;
                p.alpha -= dt * p.decay;
                if (p.alpha <= 0) this.particles.splice(i, 1);
                continue;
            }

            if (p.type === 'lightning') {
                p.alpha -= dt * p.decay;
                if (p.alpha <= 0) this.particles.splice(i, 1);
                continue;
            }

            p.x += p.vx * dt;
            p.y += p.vy * dt;
            p.vy += p.gravity * dt;
            p.alpha -= dt * p.decay;
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
            const t = this.floatingTexts[i];
            t.y += t.vy * dt;
            t.alpha -= dt * 0.9;
            if (t.alpha <= 0) {
                this.floatingTexts.splice(i, 1);
            }
        }
    }

    // Rendering pipeline
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        if (this.dpr !== 1) {
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }

        // Screen Shake offset
        if (this.shakeTime > 0) {
            const sx = (Math.random() - 0.5) * this.shakeIntensity * 2;
            const sy = (Math.random() - 0.5) * this.shakeIntensity * 2;
            this.ctx.translate(sx, sy);
        }

        // Draw Parallax Sky & Mountains (independent of full camera or slower)
        this.drawBackground();

        // Apply World Camera
        this.ctx.translate(-this.cameraX, 0);

        // Draw Environment & Mines
        this.drawEnvironment();

        // Draw Castles & Statues
        this.drawBases();

        // Draw Stuck Arrows on ground
        this.drawStuckArrows();

        // Draw Units
        const sortedUnits = [...this.units].sort((a, b) => a.y - b.y);
        for (const u of sortedUnits) {
            window.StickmanRenderer.draw(this.ctx, u, Date.now());
        }

        // Draw Projectiles
        this.drawProjectiles();

        // Draw Particles
        this.drawParticles();

        // Draw Floating Text Numbers
        this.drawFloatingTexts();

        this.ctx.restore();

        // Screen Overlays (Ambient HD atmosphere embers & Minimap)
        this.ctx.save();
        if (this.dpr !== 1) {
            this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
        }
        this.drawAmbientAtmosphere();
        this.drawMinimap();
        this.ctx.restore();
    }

    drawAmbientAtmosphere() {
        if (!this.ambientParticles) return;
        this.ctx.save();
        for (const p of this.ambientParticles) {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x > this.worldWidth) p.x = 0;
            if (p.x < 0) p.x = this.worldWidth;
            if (p.y < 0) p.y = this.groundY;
            if (p.y > this.groundY) p.y = 0;

            const screenX = p.x - this.cameraX;
            if (screenX >= -10 && screenX <= this.viewWidth + 10) {
                this.ctx.beginPath();
                this.ctx.arc(screenX, p.y, p.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = `rgba(255, 205, 110, ${p.alpha * (this.isHD ? 0.65 : 0.35)})`;
                this.ctx.fill();
            }
        }
        this.ctx.restore();
    }

    drawBackground() {
        const w = this.viewWidth;
        const h = this.viewHeight;

        if (this.isNight) {
            // Eerie Midnight / Spooky Zombie Apocalypse Night Sky
            const nightGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
            nightGrad.addColorStop(0, '#020617');
            nightGrad.addColorStop(0.35, '#090d16');
            nightGrad.addColorStop(0.7, '#0f172a');
            nightGrad.addColorStop(1, '#1e1b4b');
            this.ctx.fillStyle = nightGrad;
            this.ctx.fillRect(0, 0, w, this.groundY);

            // Twinkling Stars
            this.ctx.save();
            const now = Date.now();
            for (const s of this.nightStars) {
                const sx = (s.x - this.cameraX * 0.05 + 6400) % w;
                const alpha = s.alpha * (0.6 + 0.4 * Math.sin(now * 0.003 * s.twinkleSpeed));
                this.ctx.fillStyle = `rgba(241, 245, 249, ${alpha})`;
                this.ctx.beginPath();
                this.ctx.arc(sx, s.y, s.radius, 0, Math.PI * 2);
                this.ctx.fill();
            }

            // Full Silver Blood/Ghost Moon with atmospheric glow
            const moonX = w * 0.76;
            const moonY = 85;

            // Moon Aura
            const moonGlow = this.ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 75);
            moonGlow.addColorStop(0, 'rgba(186, 230, 253, 0.4)');
            moonGlow.addColorStop(0.5, 'rgba(147, 197, 253, 0.15)');
            moonGlow.addColorStop(1, 'rgba(147, 197, 253, 0)');
            this.ctx.fillStyle = moonGlow;
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 75, 0, Math.PI * 2);
            this.ctx.fill();

            // Moon Disc
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.beginPath();
            this.ctx.arc(moonX, moonY, 28, 0, Math.PI * 2);
            this.ctx.fill();

            // Moon Craters
            this.ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
            this.ctx.beginPath();
            this.ctx.arc(moonX - 7, moonY - 6, 6, 0, Math.PI * 2);
            this.ctx.arc(moonX + 9, moonY + 7, 5, 0, Math.PI * 2);
            this.ctx.arc(moonX + 6, moonY - 11, 4, 0, Math.PI * 2);
            this.ctx.fill();

            this.ctx.restore();

            // Night Mountain Silhouettes
            this.ctx.save();
            const paraX1 = -(this.cameraX * 0.15) % 800;
            this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            for (let x = -200; x < w + 400; x += 150) {
                const peakH = 120 + Math.sin(x * 0.01) * 60;
                this.ctx.lineTo(x + paraX1, this.groundY - peakH);
            }
            this.ctx.lineTo(w, this.groundY);
            this.ctx.fill();

            const paraX2 = -(this.cameraX * 0.35) % 600;
            this.ctx.fillStyle = 'rgba(2, 6, 23, 0.95)';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            for (let x = -200; x < w + 400; x += 100) {
                const peakH = 70 + Math.cos(x * 0.02) * 45;
                this.ctx.lineTo(x + paraX2, this.groundY - peakH);
            }
            this.ctx.lineTo(w, this.groundY);
            this.ctx.fill();
            this.ctx.restore();
        } else {
            // Beautiful Sunset/Dusk War Gradient Sky (Day Mode)
            const skyGrad = this.ctx.createLinearGradient(0, 0, 0, this.groundY);
            skyGrad.addColorStop(0, '#1a1829');
            skyGrad.addColorStop(0.45, '#3a254c');
            skyGrad.addColorStop(0.8, '#70385c');
            skyGrad.addColorStop(1, '#b86053');
            this.ctx.fillStyle = skyGrad;
            this.ctx.fillRect(0, 0, w, this.groundY);

            // Distant Mountain Silhouettes (Parallax 0.15)
            this.ctx.save();
            const paraX1 = -(this.cameraX * 0.15) % 800;
            this.ctx.fillStyle = 'rgba(38, 26, 52, 0.7)';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            for (let x = -200; x < w + 400; x += 150) {
                const peakH = 120 + Math.sin(x * 0.01) * 60;
                this.ctx.lineTo(x + paraX1, this.groundY - peakH);
            }
            this.ctx.lineTo(w, this.groundY);
            this.ctx.fill();

            // Mid-distance Mountain Range (Parallax 0.35)
            const paraX2 = -(this.cameraX * 0.35) % 600;
            this.ctx.fillStyle = 'rgba(25, 17, 36, 0.9)';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.groundY);
            for (let x = -200; x < w + 400; x += 100) {
                const peakH = 70 + Math.cos(x * 0.02) * 45;
                this.ctx.lineTo(x + paraX2, this.groundY - peakH);
            }
            this.ctx.lineTo(w, this.groundY);
            this.ctx.fill();
            this.ctx.restore();
        }
    }

    drawEnvironment() {
        // Ground Fill
        const groundGrad = this.ctx.createLinearGradient(0, this.groundY, 0, this.canvas.height);
        groundGrad.addColorStop(0, '#2e3a24');
        groundGrad.addColorStop(0.15, '#1e2617');
        groundGrad.addColorStop(1, '#11160d');
        this.ctx.fillStyle = groundGrad;
        this.ctx.fillRect(0, this.groundY, this.worldWidth, this.canvas.height - this.groundY);

        // Grass Top Edge
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.groundY);
        this.ctx.lineTo(this.worldWidth, this.groundY);
        this.ctx.lineWidth = 4;
        this.ctx.strokeStyle = '#485c34';
        this.ctx.stroke();

        // Gold Mine Deposits
        for (const mine of this.goldMines) {
            this.drawGoldMine(mine);
        }
    }

    drawGoldMine(mine) {
        const mx = mine.x;
        const my = mine.y;

        this.ctx.save();
        // Rock Formation
        this.ctx.beginPath();
        this.ctx.moveTo(mx - 35, my);
        this.ctx.lineTo(mx - 25, my - 32);
        this.ctx.lineTo(mx - 8, my - 44);
        this.ctx.lineTo(mx + 18, my - 36);
        this.ctx.lineTo(mx + 38, my);
        this.ctx.closePath();
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fill();
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#2d3748';
        this.ctx.stroke();

        // Sparkling Gold Crystals on Rock
        const goldCrystals = [
            { ox: -12, oy: -20, r: 7 },
            { ox: 8, oy: -15, r: 9 },
            { ox: -4, oy: -32, r: 6 },
            { ox: 15, oy: -28, r: 5 }
        ];

        for (const c of goldCrystals) {
            this.ctx.beginPath();
            this.ctx.arc(mx + c.ox, my + c.oy, c.r, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ecc94b';
            this.ctx.shadowColor = '#ffd700';
            this.ctx.shadowBlur = 8;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;

            // Highlight glint
            this.ctx.beginPath();
            this.ctx.arc(mx + c.ox - 2, my + c.oy - 2, c.r * 0.4, 0, Math.PI * 2);
            this.ctx.fillStyle = '#fffff0';
            this.ctx.fill();
        }

        // Label
        this.ctx.font = 'bold 11px "Outfit", sans-serif';
        this.ctx.fillStyle = '#ffd700';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('TAMBANG EMAS', mx, my + 18);

        this.ctx.restore();
    }

    drawBases() {
        // Player Base & Castle
        this.drawCastle(60, this.groundY, 'player');
        this.drawStatue(this.playerStatue);

        // Enemy Base & Castle
        this.drawCastle(3080, this.groundY, 'enemy');
        this.drawStatue(this.enemyStatue);
    }

    drawCastle(x, y, team) {
        const isPlayer = team === 'player';
        this.ctx.save();
        this.ctx.fillStyle = '#2d3748';
        this.ctx.strokeStyle = '#1a202c';
        this.ctx.lineWidth = 3;

        // Castle Wall Tower
        this.ctx.fillRect(x - 45, y - 180, 90, 180);
        this.ctx.strokeRect(x - 45, y - 180, 90, 180);

        // Crenellations / battlements on top
        for (let i = -40; i <= 30; i += 24) {
            this.ctx.fillRect(x + i, y - 195, 14, 16);
            this.ctx.strokeRect(x + i, y - 195, 14, 16);
        }

        // Castle Banner / Flag
        this.ctx.fillStyle = isPlayer ? '#00e5ff' : '#ff3344';
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 200);
        this.ctx.lineTo(x + (isPlayer ? 35 : -35), y - 188);
        this.ctx.lineTo(x, y - 176);
        this.ctx.closePath();
        this.ctx.fill();

        // Flagpole
        this.ctx.beginPath();
        this.ctx.moveTo(x, y - 180);
        this.ctx.lineTo(x, y - 215);
        this.ctx.strokeStyle = '#d69e2e';
        this.ctx.lineWidth = 2.5;
        this.ctx.stroke();

        // Castle Archer Silhoutte on wall
        const aY = y - 195;
        this.ctx.beginPath();
        this.ctx.arc(x, aY - 14, 6, 0, Math.PI * 2);
        this.ctx.fillStyle = '#111';
        this.ctx.fill();
        this.ctx.fillRect(x - 3, aY - 8, 6, 12);

        this.ctx.restore();
    }

    drawStatue(statue) {
        const sx = statue.x;
        const sy = statue.y;
        const isPlayer = statue.team === 'player';
        const eyeColor = isPlayer ? '#00e5ff' : '#ff3344';

        this.ctx.save();
        // Stone Pedestal
        this.ctx.fillStyle = '#4a5568';
        this.ctx.fillRect(sx - 45, sy - 30, 90, 30);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = '#2d3748';
        this.ctx.strokeRect(sx - 45, sy - 30, 90, 30);

        // Statue Body (Monolithic Stick Warrior Statue)
        const ctx = this.ctx;
        ctx.lineWidth = 14;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#718096';

        // Legs
        ctx.beginPath();
        ctx.moveTo(sx - 15, sy - 30);
        ctx.lineTo(sx - 15, sy - 85);
        ctx.lineTo(sx, sy - 110);
        ctx.lineTo(sx + 15, sy - 85);
        ctx.lineTo(sx + 15, sy - 30);
        ctx.stroke();

        // Spine
        ctx.beginPath();
        ctx.moveTo(sx, sy - 110);
        ctx.lineTo(sx, sy - 175);
        ctx.stroke();

        // Large Carved Head
        ctx.beginPath();
        ctx.arc(sx, sy - 198, 22, 0, Math.PI * 2);
        ctx.fillStyle = '#718096';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#4a5568';
        ctx.stroke();

        // Glowing Monolith Eyes
        ctx.beginPath();
        ctx.arc(sx + (isPlayer ? 8 : -8), sy - 200, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = eyeColor;
        ctx.shadowBlur = 14;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Monument Greatsword / Spear held straight up
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#cbd5e0';
        ctx.beginPath();
        ctx.moveTo(sx + (isPlayer ? 28 : -28), sy - 40);
        ctx.lineTo(sx + (isPlayer ? 28 : -28), sy - 240);
        ctx.stroke();

        // Statue Health Bar
        const barW = 100;
        const barH = 10;
        const hpPct = Math.max(0, statue.hp / statue.maxHp);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(sx - barW / 2 - 2, sy - 265, barW + 4, barH + 4);
        ctx.fillStyle = isPlayer ? '#10b981' : '#ef4444';
        ctx.fillRect(sx - barW / 2, sy - 263, barW * hpPct, barH);

        // Statue Label
        ctx.font = 'bold 12px "Outfit", sans-serif';
        ctx.fillStyle = '#f7fafc';
        ctx.textAlign = 'center';
        ctx.fillText(isPlayer ? 'PATUNG KITA' : 'PATUNG MUSUH', sx, sy - 275);
        ctx.font = '10px "Outfit", sans-serif';
        ctx.fillText(`${Math.round(statue.hp)}/${statue.maxHp}`, sx, sy - 250);

        this.ctx.restore();
    }

    drawStuckArrows() {
        this.ctx.save();
        for (const a of this.stuckArrows) {
            this.ctx.save();
            this.ctx.globalAlpha = a.alpha;
            this.ctx.translate(a.x, a.y);
            this.ctx.rotate(a.angle);
            this.ctx.beginPath();
            this.ctx.moveTo(0, 0);
            this.ctx.lineTo(-24, 0);
            this.ctx.lineWidth = 2;
            this.ctx.strokeStyle = '#718096';
            this.ctx.stroke();
            this.ctx.restore();
        }
        this.ctx.restore();
    }

    drawProjectiles() {
        this.ctx.save();
        for (const p of this.projectiles) {
            if (p.type === 'arrow') {
                this.ctx.save();
                this.ctx.translate(p.x, p.y);
                this.ctx.rotate(p.angle);
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(-24, 0);
                this.ctx.lineWidth = 2.5;
                this.ctx.strokeStyle = '#2d3748';
                this.ctx.stroke();

                // Arrow Head
                this.ctx.beginPath();
                this.ctx.moveTo(0, 0);
                this.ctx.lineTo(-5, -3);
                this.ctx.lineTo(-5, 3);
                this.ctx.fillStyle = '#cbd5e0';
                this.ctx.fill();
                this.ctx.restore();
            } else if (p.type === 'magic') {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, 10, 0, Math.PI * 2);
                this.ctx.fillStyle = p.team === 'player' ? '#00ffff' : '#ff0055';
                this.ctx.shadowColor = this.ctx.fillStyle;
                this.ctx.shadowBlur = 15;
                this.ctx.fill();
                this.ctx.shadowBlur = 0;
            }
        }
        this.ctx.restore();
    }

    drawParticles() {
        this.ctx.save();
        for (const p of this.particles) {
            if (p.type === 'shockwave') {
                this.ctx.beginPath();
                this.ctx.arc(p.x, p.y, p.radius, Math.PI, Math.PI * 2);
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = `rgba(236, 201, 75, ${p.alpha})`;
                this.ctx.stroke();
                continue;
            }

            if (p.type === 'lightning') {
                this.ctx.save();
                this.ctx.globalAlpha = p.alpha;
                this.ctx.lineWidth = 6;
                this.ctx.strokeStyle = '#38bdf8';
                this.ctx.shadowColor = '#00e5ff';
                this.ctx.shadowBlur = 18;
                this.ctx.beginPath();
                this.ctx.moveTo(p.x, 0);
                const segs = 6;
                const segH = p.targetY / segs;
                for (let s = 1; s < segs; s++) {
                    const jx = p.x + ((s % 2 === 0 ? 1 : -1) * 14);
                    this.ctx.lineTo(jx, s * segH);
                }
                this.ctx.lineTo(p.x, p.targetY);
                this.ctx.stroke();

                this.ctx.lineWidth = 2.5;
                this.ctx.strokeStyle = '#ffffff';
                this.ctx.stroke();
                this.ctx.restore();
                continue;
            }

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fillStyle = p.color;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
        }
        this.ctx.restore();
    }

    drawFloatingTexts() {
        this.ctx.save();
        for (const t of this.floatingTexts) {
            this.ctx.font = 'bold 15px "Outfit", sans-serif';
            this.ctx.fillStyle = t.color;
            this.ctx.globalAlpha = t.alpha;
            this.ctx.textAlign = 'center';
            this.ctx.fillText(t.text, t.x, t.y);
        }
        this.ctx.restore();
    }

    drawMinimap() {
        const mw = 220;
        const mh = 50;
        const mx = this.viewWidth - mw - 20;
        const my = this.viewHeight - mh - 20;

        this.ctx.save();
        // Radar Background
        this.ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
        this.ctx.fillRect(mx, my, mw, mh);
        this.ctx.lineWidth = 2;
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.strokeRect(mx, my, mw, mh);

        // Ground line
        this.ctx.beginPath();
        this.ctx.moveTo(mx, my + mh * 0.75);
        this.ctx.lineTo(mx + mw, my + mh * 0.75);
        this.ctx.strokeStyle = '#485c34';
        this.ctx.lineWidth = 1.5;
        this.ctx.stroke();

        // Statues
        const pStatueMapX = mx + (this.playerStatue.x / this.worldWidth) * mw;
        const eStatueMapX = mx + (this.enemyStatue.x / this.worldWidth) * mw;
        this.ctx.fillStyle = '#00e5ff';
        this.ctx.fillRect(pStatueMapX - 3, my + mh * 0.35, 6, 20);
        this.ctx.fillStyle = '#ff3344';
        this.ctx.fillRect(eStatueMapX - 3, my + mh * 0.35, 6, 20);

        // Mines (Yellow dots)
        for (const m of this.goldMines) {
            const mapX = mx + (m.x / this.worldWidth) * mw;
            this.ctx.beginPath();
            this.ctx.arc(mapX, my + mh * 0.75, 3, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ffd700';
            this.ctx.fill();
        }

        // Units dots
        for (const u of this.units) {
            if (u.state === 'dead') continue;
            const dotX = mx + (u.x / this.worldWidth) * mw;
            const dotY = my + mh * 0.7;
            this.ctx.beginPath();
            this.ctx.arc(dotX, dotY, u.type === 'giant' ? 3.5 : 2, 0, Math.PI * 2);
            this.ctx.fillStyle = u.team === 'player' ? '#00e5ff' : '#ff3344';
            this.ctx.fill();
        }

        // Camera Viewport Box on Minimap
        const camBoxX = mx + (this.cameraX / this.worldWidth) * mw;
        const camBoxW = (this.viewWidth / this.worldWidth) * mw;
        this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
        this.ctx.lineWidth = 1.5;
        this.ctx.strokeRect(camBoxX, my + 2, camBoxW, mh - 4);

        this.ctx.restore();
    }

    gameLoop(timestamp) {
        if (!this.lastTime) this.lastTime = timestamp;
        const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
        this.lastTime = timestamp;

        this.update(dt);
        this.render();

        if (this.running) {
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    // UI Updates
    updateUI() {
        const goldEl = document.getElementById('gold-count');
        if (goldEl) {
            goldEl.innerText = this.cheats.infiniteGold ? '∞' : Math.floor(this.gold);
        }

        const gemsEl = document.getElementById('gems-count');
        if (gemsEl) {
            gemsEl.innerText = this.cheats.infiniteGems ? '∞' : Math.floor(this.gems);
        }

        const popEl = document.getElementById('pop-count');
        const currentPop = this.units.filter(u => u.team === 'player' && u.state !== 'dead').length;
        if (popEl) popEl.innerText = `${currentPop}/${this.maxPopulation}`;

        // Statue Health Percentages
        const pStatueBar = document.getElementById('player-statue-bar');
        const pStatueText = document.getElementById('player-statue-hp');
        if (pStatueBar && pStatueText) {
            const pct = Math.max(0, (this.playerStatue.hp / this.playerStatue.maxHp) * 100);
            pStatueBar.style.width = `${pct}%`;
            pStatueText.innerText = `${Math.round(this.playerStatue.hp)} HP`;
        }

        const eStatueBar = document.getElementById('enemy-statue-bar');
        const eStatueText = document.getElementById('enemy-statue-hp');
        if (eStatueBar && eStatueText) {
            const pct = Math.max(0, (this.enemyStatue.hp / this.enemyStatue.maxHp) * 100);
            eStatueBar.style.width = `${pct}%`;
            eStatueText.innerText = `${Math.round(this.enemyStatue.hp)} HP`;
        }

        // Difficulty Badge in HUD
        const diffBadge = document.getElementById('hud-diff-badge');
        if (diffBadge) {
            const diffNames = { easy: '🟢 MUDAH', medium: '🟡 SEDANG', hard: '🔴 SULIT', insane: '🔥 GILA-GILAAN' };
            diffBadge.innerText = diffNames[this.difficulty] || 'SEDANG';
            diffBadge.className = `diff-badge ${this.difficulty}`;
        }

        // Day / Night Zombie Indicator Badge
        const timeBadge = document.getElementById('hud-time-badge');
        if (timeBadge) {
            if (this.isNight) {
                timeBadge.innerText = '🌙 MALAM (ZOMBIE)';
                timeBadge.className = 'time-badge night';
            } else {
                timeBadge.innerText = '☀️ SIANG HARI';
                timeBadge.className = 'time-badge day';
            }
        }

        // Jukebox Track Button in HUD
        const trackBtn = document.getElementById('btn-track');
        if (trackBtn && window.soundCtrl) {
            trackBtn.innerText = `🎵 ${window.soundCtrl.getTrackName()}`;
        }

        // Unit Cooldown Overlays
        for (const type in this.spawnCooldowns) {
            const cd = this.spawnCooldowns[type];
            const maxCd = this.unitDefs[type].cooldownTime;
            const overlay = document.getElementById(`cd-${type}`);
            const btn = document.getElementById(`btn-${type}`);
            if (overlay) {
                if (this.cheats.noCooldown) {
                    overlay.style.height = '0%';
                } else if (cd > 0) {
                    overlay.style.height = `${(cd / maxCd) * 100}%`;
                } else {
                    overlay.style.height = '0%';
                }
            }
            if (btn) {
                const canAfford = this.cheats.infiniteGold || (this.gold >= this.unitDefs[type].cost);
                const isCooldown = !this.cheats.noCooldown && cd > 0;
                btn.classList.toggle('disabled', !canAfford || isCooldown);
            }
        }
    }

    setDifficulty(diff) {
        if (!['easy', 'medium', 'hard', 'insane'].includes(diff)) return;
        this.difficulty = diff;

        // Update active class on difficulty buttons
        document.querySelectorAll('.diff-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.diff === diff);
        });

        const diffLabels = { easy: '🟢 Mudah (Easy)', medium: '🟡 Sedang (Medium)', hard: '🔴 Sulit (Hard)', insane: '🔥 Gila-Gilaan (Insane Pro AI)' };
        this.showToast(`Tingkat Kesulitan: ${diffLabels[diff]}`);
        this.updateUI();
    }

    castSpell(spellId, team = 'player') {
        const isPlayer = team === 'player';
        const spell = this.spells[spellId];
        if (!spell && isPlayer) return;

        if (isPlayer && !this.cheats.infiniteSpells) {
            if (spell.stock <= 0) {
                this.showToast(`⚠️ Stok spell ${spell.name} habis!`, 'warning');
                return;
            }
            if (spell.cooldown > 0) {
                this.showToast(`⏳ Cooldown ${spell.name}: ${Math.ceil(spell.cooldown)}s`, 'warning');
                return;
            }
        }

        // Consume stock & set cooldown for player
        if (isPlayer && !this.cheats.infiniteSpells) {
            spell.stock--;
            spell.cooldown = spell.maxCooldown;
        }

        if (spellId === 'minerHustle') {
            if (isPlayer) {
                spell.activeTimer = spell.duration;
                if (window.soundCtrl) window.soundCtrl.playSpellHustle();
                this.showToast('⛏️ SPELL: Miner Hustle aktif! Kecepatan & hasil tambang berlipat ganda!', 'gold');
                this.showFloatingText(this.playerStatue.x + 80, this.groundY - 100, '⛏️ HUSTLE!', '#ffd700');
                for (const u of this.units) {
                    if (u.team === 'player' && u.type === 'miner') {
                        this.createSparks(u.x, u.y - 30, '#ffd700', 10);
                    }
                }
            }
        } else if (spellId === 'arrowRain') {
            if (window.soundCtrl) window.soundCtrl.playSpellArrowRain();
            this.triggerScreenShake(0.6, 7);
            if (isPlayer) this.showToast('🏹 SPELL: Hujan Panah Membakar diluncurkan ke musuh!', 'danger');

            const minX = isPlayer ? Math.max(1200, this.cameraX) : 250;
            const maxX = isPlayer ? Math.min(2950, this.cameraX + this.viewWidth + 400) : 1800;
            for (let i = 0; i < 35; i++) {
                setTimeout(() => {
                    if (!this.running) return;
                    const dropX = minX + Math.random() * (maxX - minX);
                    const startX = dropX - (isPlayer ? 150 : -150) + Math.random() * 80;
                    this.projectiles.push({
                        type: 'arrow',
                        x: startX,
                        y: -40 - Math.random() * 80,
                        vx: (isPlayer ? 1 : -1) * (180 + Math.random() * 60),
                        vy: 750 + Math.random() * 200,
                        gravity: 400,
                        team: team,
                        damage: 48,
                        isFireArrow: true,
                        angle: isPlayer ? Math.PI * 0.42 : Math.PI * 0.58,
                        alive: true
                    });
                }, i * 65);
            }
        } else if (spellId === 'healWave') {
            if (window.soundCtrl) window.soundCtrl.playSpellHeal();
            const statue = isPlayer ? this.playerStatue : this.enemyStatue;
            statue.hp = Math.min(statue.maxHp, statue.hp + 400);
            this.showFloatingText(statue.x, this.groundY - 140, '+400 HP', '#48bb78');
            if (isPlayer) this.showToast('💖 SPELL: Gelombang Penyembuh memulihkan seluruh pasukan!', 'info');

            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    const healAmt = Math.round(u.maxHp * 0.6);
                    u.hp = Math.min(u.maxHp, u.hp + healAmt);
                    this.createMagicExplosionParticles(u.x, u.y - 35, '#48bb78');
                    this.showFloatingText(u.x, u.y - 50, `+${healAmt}`, '#48bb78');
                }
            }
        } else if (spellId === 'swordRage') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playSpellRage();
            this.triggerScreenShake(0.4, 6);
            if (isPlayer) this.showToast('⚔️ SPELL: Sword Rage aktif! Pasukan membara dengan +50% Damage!', 'danger');
            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    u.rageTimer = 15;
                    this.createMagicExplosionParticles(u.x, u.y - 40, isPlayer ? '#f56565' : '#dc2626');
                    this.showFloatingText(u.x, u.y - 60, '🔥 RAGE!', '#f56565');
                }
            }
        } else if (spellId === 'goldenSpearton') {
            if (window.soundCtrl) window.soundCtrl.playSpellSummon();
            this.triggerScreenShake(0.5, 8);
            if (isPlayer) this.showToast('🛡️ SPELL: Golden Spartan Perkasa telah tiba di medan tempur!', 'gold');
            const spawnX = isPlayer ? 260 : 2940;
            const golden = this.spawnUnit('spearton', team, spawnX);
            if (golden) {
                golden.isGolden = true;
                golden.maxHp = 950;
                golden.hp = 950;
                golden.scale = 1.25;
                golden.speed = 3.2;
                this.createMagicExplosionParticles(golden.x, golden.y - 45, '#ffd700');
                this.showFloatingText(golden.x, golden.y - 75, '⭐ ELITE SPARTAN ⭐', '#ffd700');
            }
        } else if (spellId === 'trainingHaste') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playSpellHaste();
            if (isPlayer) this.showToast('➰ SPELL: Training Haste aktif! Waktu rekrut pasukan 4x lebih cepat!', 'gold');
            const statue = isPlayer ? this.playerStatue : this.enemyStatue;
            this.showFloatingText(statue.x, this.groundY - 120, '➰ HASTE 4x!', '#38bdf8');
            this.createMagicExplosionParticles(statue.x, this.groundY - 80, '#38bdf8');
        } else if (spellId === 'lightningStorm') {
            if (window.soundCtrl) window.soundCtrl.playSpellLightning();
            this.triggerScreenShake(0.7, 10);
            if (isPlayer) this.showToast('⚡ SPELL: Badai Petir Halilintar menghantam barisan lawan!', 'info');

            const opposingTeam = isPlayer ? 'enemy' : 'player';
            const minX = isPlayer ? Math.max(800, this.cameraX) : 250;
            const maxX = isPlayer ? Math.min(2950, this.cameraX + this.viewWidth + 300) : 1800;

            for (let i = 0; i < 12; i++) {
                setTimeout(() => {
                    if (!this.running) return;
                    const strikeX = minX + Math.random() * (maxX - minX);
                    this.particles.push({
                        type: 'lightning',
                        x: strikeX,
                        y: 0,
                        targetY: this.groundY,
                        alpha: 1.0,
                        decay: 4.5
                    });
                    this.createShockwave(strikeX, this.groundY);
                    this.createSparks(strikeX, this.groundY - 20, '#67e8f9', 14);

                    for (const u of this.units) {
                        if (u.team === opposingTeam && u.state !== 'dead') {
                            if (Math.abs(u.x - strikeX) < 110) {
                                this.dealDamage(u, 75);
                                u.x += (u.x > strikeX ? 1 : -1) * 35;
                            }
                        }
                    }
                    const targetStatue = isPlayer ? this.enemyStatue : this.playerStatue;
                    if (Math.abs(targetStatue.x - strikeX) < 100) {
                        this.damageStatue(targetStatue, 60);
                    }
                }, i * 160);
            }
        } else if (spellId === 'summonDead') {
            if (window.soundCtrl) window.soundCtrl.playSpellDead();
            this.triggerScreenShake(0.4, 7);
            if (isPlayer) this.showToast('💀 SPELL: Pasukan Mayat Hidup Beracun bangkit dari tanah!', 'success');
            const spawnBaseX = isPlayer ? (this.playerStatue.x + 100) : (this.enemyStatue.x - 100);
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    if (!this.running) return;
                    const x = spawnBaseX + (isPlayer ? 1 : -1) * (i * 35);
                    const undead = this.spawnUnit('undead', team, x);
                    if (undead) {
                        this.createMagicExplosionParticles(undead.x, undead.y - 30, '#10b981');
                        this.showFloatingText(undead.x, undead.y - 60, '💀 UNDEAD', '#10b981');
                    }
                }, i * 90);
            }
        } else if (spellId === 'goldRush') {
            if (window.soundCtrl) window.soundCtrl.playSpellGoldRush();
            if (isPlayer) {
                this.gold += 450;
                this.stats.goldMined += 450;
                this.showToast('💰 SPELL: Gold Rush! +450 Emas instan & tas penambang penuh!', 'gold');
                this.showFloatingText(this.playerStatue.x, this.groundY - 140, '+450 GOLD!', '#ffd700');
            } else {
                this.enemyGold += 450;
            }
            for (const u of this.units) {
                if (u.team === team && u.type === 'miner' && u.state !== 'dead') {
                    u.carriedGold = 100;
                    this.createSparks(u.x, u.y - 30, '#ffd700', 8);
                    this.showFloatingText(u.x, u.y - 50, 'FULL BAG 🎒', '#ffd700');
                }
            }
        } else if (spellId === 'summonMarrowkai') {
            if (window.soundCtrl) window.soundCtrl.playSpellMarrowkai();
            this.triggerScreenShake(0.8, 12);
            if (isPlayer) this.showToast('☠️ SPELL: Titan Marrowkai Raja Kematian telah bangkit!', 'purple');
            const spawnX = isPlayer ? (this.playerStatue.x + 120) : (this.enemyStatue.x - 120);
            const marrowkai = this.spawnUnit('marrowkai', team, spawnX);
            if (marrowkai) {
                this.createMagicExplosionParticles(marrowkai.x, marrowkai.y - 60, '#a855f7');
                this.createShockwave(marrowkai.x, this.groundY);
                this.showFloatingText(marrowkai.x, marrowkai.y - 90, '☠️ TITAN MARROWKAI ☠️', '#a855f7');
            }
        }

        if (isPlayer) this.updateSpellUI();
    }

    updateSpellUI() {
        for (const k in this.spells) {
            const spell = this.spells[k];
            const card = document.getElementById(`spell-${spell.id}`);
            if (!card) continue;

            const stockEl = card.querySelector('.orb-stock-badge');
            if (stockEl) {
                stockEl.innerText = this.cheats.infiniteSpells ? '∞' : spell.stock;
            }

            const cdOverlay = card.querySelector('.orb-cd-overlay');
            if (cdOverlay) {
                if (!this.cheats.infiniteSpells && spell.cooldown > 0) {
                    cdOverlay.classList.remove('hidden');
                    cdOverlay.innerText = Math.ceil(spell.cooldown) + 's';
                } else {
                    cdOverlay.classList.add('hidden');
                }
            }

            if (spell.activeTimer && spell.activeTimer > 0) {
                card.classList.add('spell-active');
            } else {
                card.classList.remove('spell-active');
            }
        }
    }

    applyCheat(code) {
        const clean = (code || '').toLowerCase().trim();
        if (clean === 'minegoldrich') {
            this.cheats.infiniteGold = !this.cheats.infiniteGold;
            if (this.cheats.infiniteGold) {
                this.gold = 999999;
                if (window.soundCtrl) window.soundCtrl.playGold();
                this.showToast('✨ CHEAT AKTIF: Emas Tak Terbatas (minegoldrich)!', 'gold');
            } else {
                this.gold = 500;
                this.showToast('Emas Tak Terbatas dinonaktifkan.');
            }
            this.updateCheatUI();
            this.updateUI();
            return true;
        } else if (clean === 'cooldownnotspawn') {
            this.cheats.noCooldown = !this.cheats.noCooldown;
            if (this.cheats.noCooldown) {
                for (const key in this.spawnCooldowns) this.spawnCooldowns[key] = 0;
                if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                this.showToast('⚡ CHEAT AKTIF: Tanpa Cooldown (cooldownnotspawn)!', 'info');
            } else {
                this.showToast('Cooldown rekrutmen diaktifkan kembali.');
            }
            this.updateCheatUI();
            this.updateUI();
            return true;
        } else if (clean === 'nopopuation' || clean === 'nopopulation') {
            this.cheats.noPopulation = !this.cheats.noPopulation;
            if (this.cheats.noPopulation) {
                this.maxPopulation = 9999;
                if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                this.showToast('👥 CHEAT AKTIF: Populasi Tak Terbatas (nopopuation)!', 'info');
            } else {
                this.maxPopulation = 35;
                this.showToast('Batas populasi normal (35) dikembalikan.');
            }
            this.updateCheatUI();
            this.updateUI();
            return true;
        } else if (clean === 'spellol') {
            this.cheats.infiniteSpells = !this.cheats.infiniteSpells;
            if (this.cheats.infiniteSpells) {
                for (const k in this.spells) {
                    this.spells[k].stock = 99;
                    this.spells[k].cooldown = 0;
                }
                if (window.soundCtrl) window.soundCtrl.playSpellSummon();
                this.showToast('🔮 CHEAT AKTIF: Spell Tak Terbatas (spellol)!', 'gold');
            } else {
                for (const k in this.spells) {
                    this.spells[k].stock = this.spells[k].maxStock;
                }
                this.showToast('Spell Tak Terbatas dinonaktifkan.');
            }
            this.updateCheatUI();
            this.updateSpellUI();
            return true;
        } else if (clean === 'gemsnotreal') {
            this.cheats.infiniteGems = !this.cheats.infiniteGems;
            if (this.cheats.infiniteGems) {
                this.gems = 999999;
                if (window.soundCtrl) window.soundCtrl.playSpellSummon();
                this.showToast('💎 CHEAT AKTIF: Gems Tak Terbatas (gemsnotreal)!', 'gold');
            } else {
                this.gems = 1250;
                this.showToast('Gems Tak Terbatas dinonaktifkan.');
            }
            this.saveProfile();
            this.updateCheatUI();
            this.updateUI();
            this.updateShopUI();
            return true;
        } else if (clean === 'upgradereal') {
            this.cheats.maxUpgrades = !this.cheats.maxUpgrades;
            if (this.cheats.maxUpgrades) {
                for (const k in this.upgrades) this.upgrades[k] = 3;
                this.upgradePoints = 999;
                if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                this.showToast('⚔️ CHEAT AKTIF: Peningkatan Tak Terbatas (upgradereal)!', 'gold');
            } else {
                for (const k in this.upgrades) this.upgrades[k] = 0;
                this.upgradePoints = 0;
                this.showToast('Peningkatan Tak Terbatas dinonaktifkan.');
            }
            this.saveProfile();
            this.updateCheatUI();
            this.updateUI();
            this.updateShopUI();
            return true;
        } else {
            this.showToast('❌ Kode tidak valid! Gunakan: minegoldrich, cooldownnotspawn, nopopuation, spellol, gemsnotreal, atau upgradereal', 'warning');
            return false;
        }
    }

    updateCheatUI() {
        // Update Cheat Buttons in modal
        const goldBtn = document.getElementById('toggle-cheat-gold');
        if (goldBtn) {
            goldBtn.innerText = this.cheats.infiniteGold ? 'AKTIF ✅' : 'AKTIFKAN';
            goldBtn.classList.toggle('active', this.cheats.infiniteGold);
        }

        const cdBtn = document.getElementById('toggle-cheat-cd');
        if (cdBtn) {
            cdBtn.innerText = this.cheats.noCooldown ? 'AKTIF ✅' : 'AKTIFKAN';
            cdBtn.classList.toggle('active', this.cheats.noCooldown);
        }

        const popBtn = document.getElementById('toggle-cheat-pop');
        if (popBtn) {
            popBtn.innerText = this.cheats.noPopulation ? 'AKTIF ✅' : 'AKTIFKAN';
            popBtn.classList.toggle('active', this.cheats.noPopulation);
        }

        const spellBtn = document.getElementById('toggle-cheat-spell');
        if (spellBtn) {
            spellBtn.innerText = this.cheats.infiniteSpells ? 'AKTIF ✅' : 'AKTIFKAN';
            spellBtn.classList.toggle('active', this.cheats.infiniteSpells);
        }

        const gemsBtn = document.getElementById('toggle-cheat-gems');
        if (gemsBtn) {
            gemsBtn.innerText = this.cheats.infiniteGems ? 'AKTIF ✅' : 'AKTIFKAN';
            gemsBtn.classList.toggle('active', this.cheats.infiniteGems);
        }

        const upBtn = document.getElementById('toggle-cheat-upgrade');
        if (upBtn) {
            upBtn.innerText = this.cheats.maxUpgrades ? 'AKTIF ✅' : 'AKTIFKAN';
            upBtn.classList.toggle('active', this.cheats.maxUpgrades);
        }

        // Update pills in Top HUD
        const pillGold = document.getElementById('pill-cheat-gold');
        if (pillGold) {
            pillGold.classList.toggle('hidden', !this.cheats.infiniteGold);
        }

        const pillCd = document.getElementById('pill-cheat-cd');
        if (pillCd) {
            pillCd.classList.toggle('hidden', !this.cheats.noCooldown);
        }

        const pillPop = document.getElementById('pill-cheat-pop');
        if (pillPop) {
            pillPop.classList.toggle('hidden', !this.cheats.noPopulation);
        }

        const pillSpell = document.getElementById('pill-cheat-spell');
        if (pillSpell) {
            pillSpell.classList.toggle('hidden', !this.cheats.infiniteSpells);
        }

        const pillGems = document.getElementById('pill-cheat-gems');
        if (pillGems) {
            pillGems.classList.toggle('hidden', !this.cheats.infiniteGems);
        }

        const pillUp = document.getElementById('pill-cheat-upgrade');
        if (pillUp) {
            pillUp.classList.toggle('hidden', !this.cheats.maxUpgrades);
        }
    }

    updateControlUI() {
        const controlPanel = document.getElementById('controlled-unit-panel');
        if (!controlPanel) return;

        if (this.controlledUnit) {
            controlPanel.classList.remove('hidden');
            document.getElementById('ctrl-unit-name').innerText = this.unitDefs[this.controlledUnit.type].name;
            document.getElementById('ctrl-unit-hp').innerText = `${Math.round(this.controlledUnit.hp)}/${this.controlledUnit.maxHp}`;
        } else {
            controlPanel.classList.add('hidden');
        }
    }

    showToast(message, type = 'info') {
        const toast = document.getElementById('toast-msg');
        if (!toast) return;
        toast.innerText = message;
        toast.className = `toast show ${type}`;
        clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => {
            toast.className = 'toast';
        }, 2800);
    }

    showEnemySpellAlert(text) {
        const banner = document.getElementById('enemy-spell-banner');
        if (!banner) return;
        banner.innerText = text;
        banner.classList.remove('hidden');
        clearTimeout(this.enemyAlertTimer);
        this.enemyAlertTimer = setTimeout(() => {
            banner.classList.add('hidden');
        }, 3600);
    }

    openLevelModal() {
        const modal = document.getElementById('level-modal');
        if (!modal) return;
        this.updateLevelModalUI();
        modal.classList.remove('hidden');
    }

    closeLevelModal() {
        const modal = document.getElementById('level-modal');
        if (modal) modal.classList.add('hidden');
    }

    selectLevel(lvl) {
        if (lvl < 1 || lvl > this.maxLevel) return;
        this.closeLevelModal();
        this.start(lvl, 'campaign');
        this.showToast(`🗺️ Memulai Kampanye Level ${lvl}!`, 'gold');
    }

    updateLevelModalUI() {
        const container = document.getElementById('level-grid-container');
        if (!container) return;
        container.innerHTML = '';
        for (let lvl = 1; lvl <= this.maxLevel; lvl++) {
            const cell = document.createElement('button');
            cell.className = 'lvl-cell';
            const isBoss = (lvl % 10 === 0);
            const isBoss100 = (lvl === 100);
            if (isBoss100) cell.classList.add('boss-100');
            else if (isBoss) cell.classList.add('boss');

            if (lvl === this.currentLevel) cell.classList.add('current');
            else if (lvl < this.unlockedLevel) cell.classList.add('completed');

            let icon = '⚔️';
            if (isBoss100) icon = '👑';
            else if (isBoss) icon = '💀';
            else if (lvl < this.unlockedLevel) icon = '✅';

            cell.innerHTML = `<span>${icon}</span><span>Lv.${lvl}</span>`;
            cell.title = isBoss100 ? 'Level 100: Raja Terakhir Inamorta' : (isBoss ? `Level ${lvl}: Pertarungan Bos!` : `Level ${lvl}`);
            cell.addEventListener('click', () => {
                this.selectLevel(lvl);
            });
            container.appendChild(cell);
        }
    }

    showGameOverModal(won) {
        const modal = document.getElementById('game-over-modal');
        const title = document.getElementById('modal-title');
        const desc = document.getElementById('modal-desc');
        const nextBtn = document.getElementById('btn-next-level');

        if (!modal) return;

        modal.classList.remove('hidden');
        if (won) {
            title.innerText = '🏆 KEMENANGAN AKBAR! 🏆';
            title.style.color = '#ffd700';

            // User requirement: menang 1 kali = 2 didapatkan peningkatan, plus 150 gems bonus
            this.upgradePoints += 2;
            this.gems += 150;
            this.saveProfile();
            this.updateUI();

            desc.innerHTML = `Selamat! Patung musuh telah dihancurkan pada Level ${this.currentLevel}!<br><br>
                <b>Emas Dikumpulkan:</b> ${this.stats.goldMined}<br>
                <b>Pasukan Dilatih:</b> ${this.stats.unitsSpawned}<br>
                <b>Musuh Dikalahkan:</b> ${this.stats.enemiesKilled}<br><br>
                <div style="background: rgba(255,215,0,0.15); border: 1px solid #ffd700; border-radius: 8px; padding: 10px; margin-top: 6px;">
                    🎁 <b>Hadiah Kemenangan:</b> +2 Poin Peningkatan 🌟, +150 Gems 💎
                </div>`;

            if (this.currentLevel >= this.unlockedLevel) {
                this.unlockedLevel = Math.min(100, this.currentLevel + 1);
            }

            if (this.currentLevel < this.maxLevel) {
                nextBtn.classList.remove('hidden');
                nextBtn.innerText = `Lanjut ke Level ${this.currentLevel + 1} ➔`;
            } else {
                nextBtn.classList.add('hidden');
                this.showToast('🎉 SELAMAT! Anda telah menaklukkan seluruh 100 Level Inamorta!', 'gold');
            }
        } else {
            title.innerText = '💀 KEKALAHAN! 💀';
            title.style.color = '#ef4444';
            desc.innerHTML = `Patung kerajaan Anda telah hancur oleh serbuan musuh pada Level ${this.currentLevel}!<br>Atur strategi pertahanan yang lebih kuat!`;
            nextBtn.classList.add('hidden');
        }
    }

    saveProfile() {
        try {
            const data = {
                gems: this.gems,
                upgradePoints: this.upgradePoints,
                unlockedLevel: this.unlockedLevel,
                upgrades: this.upgrades,
                skins: this.skins,
                equippedSkin: this.equippedSkin
            };
            localStorage.setItem('stickwar_save_profile', JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save profile', e);
        }
    }

    loadProfile() {
        try {
            const raw = localStorage.getItem('stickwar_save_profile');
            if (raw) {
                const data = JSON.parse(raw);
                if (typeof data.gems === 'number') this.gems = data.gems;
                if (typeof data.upgradePoints === 'number') this.upgradePoints = data.upgradePoints;
                if (typeof data.unlockedLevel === 'number') this.unlockedLevel = data.unlockedLevel;
                if (data.upgrades) this.upgrades = Object.assign(this.upgrades, data.upgrades);
                if (data.skins) this.skins = Object.assign(this.skins, data.skins);
                if (data.equippedSkin) this.equippedSkin = data.equippedSkin;
            }
        } catch (e) {
            console.warn('Failed to load profile', e);
        }
    }

    openShopModal(tab = 'upgrades') {
        const modal = document.getElementById('shop-modal');
        if (!modal) return;
        this.updateShopUI();
        this.switchShopTab(tab);
        modal.classList.remove('hidden');
    }

    closeShopModal() {
        const modal = document.getElementById('shop-modal');
        if (modal) modal.classList.add('hidden');
    }

    switchShopTab(tab) {
        document.querySelectorAll('.shop-tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        document.querySelectorAll('.shop-tab-pane').forEach(pane => {
            pane.classList.toggle('hidden', pane.id !== `shop-pane-${tab}`);
        });
        this.updateShopUI();
    }

    buySpell(spellId) {
        const spellCosts = {
            minerHustle: 20, arrowRain: 30, healWave: 40, trainingHaste: 50,
            goldenSpearton: 100, goldRush: 250, summonDead: 300, swordRage: 400,
            lightningStorm: 750, summonMarrowkai: 1000
        };
        const cost = spellCosts[spellId] || 50;
        if (this.gems < cost && !this.cheats.infiniteGems) {
            this.showToast('💎 Permata (Gems) tidak cukup!', 'warning');
            return;
        }
        if (!this.cheats.infiniteGems) this.gems -= cost;
        if (this.spells[spellId]) {
            this.spells[spellId].stock = (this.spells[spellId].stock || 0) + 1;
            this.spells[spellId].maxStock = Math.max(this.spells[spellId].maxStock, this.spells[spellId].stock);
        }
        if (window.soundCtrl) window.soundCtrl.playSpellSummon();
        this.saveProfile();
        this.updateUI();
        this.updateSpellUI();
        this.updateShopUI();
        this.showToast(`✨ Berhasil membeli 1 stok mantra!`, 'gold');
    }

    buySkin(skinId) {
        if (this.skins[skinId]) {
            this.equipSkin(skinId);
            return;
        }
        if (this.gems < 750 && !this.cheats.infiniteGems) {
            this.showToast('💎 Permata tidak cukup untuk skin ini (750 Gems)!', 'warning');
            return;
        }
        if (!this.cheats.infiniteGems) this.gems -= 750;
        this.skins[skinId] = true;
        this.equippedSkin = skinId;
        if (window.soundCtrl) window.soundCtrl.playSpellSummon();
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
        this.showToast(`🔥 Skin ${skinId.toUpperCase()} berhasil dibeli & dipasang!`, 'gold');
    }

    equipSkin(skinId) {
        if (!this.skins[skinId]) return;
        this.equippedSkin = skinId;
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
        this.showToast(`👕 Skin ${skinId.toUpperCase()} dipasang!`);
    }

    buyUpgrade(cat) {
        if ((this.upgrades[cat] || 0) >= 3) {
            this.showToast('⭐ Peningkatan ini sudah mencapai Level Maksimal (3/3)!', 'warning');
            return;
        }
        if (this.upgradePoints < 1 && !this.cheats.maxUpgrades) {
            this.showToast('🌟 Poin peningkatan tidak cukup! Menangkan pertempuran untuk dapat +2 poin.', 'warning');
            return;
        }
        if (!this.cheats.maxUpgrades) this.upgradePoints -= 1;
        this.upgrades[cat] = (this.upgrades[cat] || 0) + 1;
        if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
        this.showToast(`⚔️ Peningkatan berhasil naik ke Level ${this.upgrades[cat]}/3!`, 'gold');
    }

    updateShopUI() {
        const gemsBalance = document.getElementById('shop-gems-balance');
        if (gemsBalance) {
            gemsBalance.innerText = this.cheats.infiniteGems ? '∞' : Math.floor(this.gems);
        }

        const upPoints = document.getElementById('shop-upgrade-points');
        if (upPoints) {
            upPoints.innerText = this.cheats.maxUpgrades ? '∞' : this.upgradePoints;
        }

        // Update Upgrades Tab items (10 categories specified by user)
        const upgradeCats = [
            { id: 'sword', name: 'Pedang (Swordwrath)', icon: '⚔️', desc: 'Meningkatkan daya serang tebasan pedang (+8 DMG/lvl)' },
            { id: 'bow', name: 'Panah (Archidon)', icon: '🏹', desc: 'Meningkatkan damage panah (+10 DMG/lvl) & jangkauan tembak' },
            { id: 'statue', name: 'Patung Kerajaan', icon: '🗿', desc: 'Meningkatkan HP maksimal patung (+400 HP/lvl) & regenerasi otomatis' },
            { id: 'castleArcher', name: 'Menara Pemanah Benteng', icon: '🏰', desc: 'Meningkatkan frekuensi tembakan & damage panah penjaga benteng' },
            { id: 'giantClub', name: 'Pemukul Giant', icon: '🧌', desc: 'Hantaman gada raksasa lebih dahsyat (+45 DMG/lvl) & radius gempa' },
            { id: 'magikillStaff', name: 'Tongkat Magikill', icon: '🧙‍♂️', desc: 'Ledakan sihir area lebih mematikan (+35 DMG/lvl)' },
            { id: 'mining', name: 'Tambang & Pengisian Emas', icon: '⛏️', desc: 'Miner bergerak lebih cepat, kantong emas lebih besar (+25G) & menambang lebih cepat' },
            { id: 'speartonHelmet', name: 'Topi / Helm Spearton', icon: '🪖', desc: 'Mempertebal pertahanan dan HP Spearton (+120 HP/lvl)' },
            { id: 'speartonSpear', name: 'Tombak Spearton', icon: '🔱', desc: 'Tusukan tombak lebih tajam dan mematikan (+14 DMG/lvl)' },
            { id: 'speartonShield', name: 'Perisai Spearton', icon: '🛡️', desc: 'Tangkisan blok hingga 90% dan memantulkan serangan balik ke musuh' }
        ];

        const upContainer = document.getElementById('shop-upgrades-container');
        if (upContainer) {
            upContainer.innerHTML = '';
            for (const cat of upgradeCats) {
                const lvl = this.upgrades[cat.id] || 0;
                const isMax = lvl >= 3;
                const card = document.createElement('div');
                card.className = `upgrade-card ${isMax ? 'maxed' : ''}`;
                card.innerHTML = `
                    <div class="upgrade-icon">${cat.icon}</div>
                    <div class="upgrade-info">
                        <div class="upgrade-title-row">
                            <span class="upgrade-name">${cat.name}</span>
                            <span class="upgrade-level-badge ${isMax ? 'max' : ''}">Tingkat ${lvl}/3 ${isMax ? '⭐ MAX' : ''}</span>
                        </div>
                        <p class="upgrade-desc">${cat.desc}</p>
                        <div class="upgrade-meter">
                            <div class="upgrade-meter-pip ${lvl >= 1 ? 'filled' : ''}"></div>
                            <div class="upgrade-meter-pip ${lvl >= 2 ? 'filled' : ''}"></div>
                            <div class="upgrade-meter-pip ${lvl >= 3 ? 'filled' : ''}"></div>
                        </div>
                    </div>
                    <div class="upgrade-action">
                        <button class="upgrade-btn ${isMax ? 'disabled' : ''}" data-cat="${cat.id}">
                            ${isMax ? 'MAKSIMAL' : 'TINGKATKAN (1 🌟)'}
                        </button>
                    </div>
                `;
                const btn = card.querySelector('.upgrade-btn');
                if (btn && !isMax) {
                    btn.addEventListener('click', () => this.buyUpgrade(cat.id));
                }
                upContainer.appendChild(card);
            }
        }

        // Update Skins Tab items (Api & Es)
        const skinDefs = [
            { id: 'classic', name: 'Skin Klasik (Stick War Classic)', cost: 0, icon: '🛡️', color: '#00e5ff', desc: 'Tampilan stickman orisinal prajurit kerajaan Order of Inamorta.' },
            { id: 'fire', name: 'Skin Api (Blazing Fire)', cost: 750, icon: '🔥', color: '#ff6b00', desc: 'Aura api magma! Serangan memiliki efek bakar 10 kerusakan, dan saat menerima damage membalas 5 kerusakan api ke musuh!' },
            { id: 'ice', name: 'Skin Es (Frost Ice Cryo)', cost: 750, icon: '❄️', color: '#00f0ff', desc: 'Aura kristal es kutub! Saat menerima damage, musuh yang menyerang akan MEMBEKU selama 3 detik! Serangan juga memberikan efek chill slow -35%.' }
        ];

        const skinsContainer = document.getElementById('shop-skins-container');
        if (skinsContainer) {
            skinsContainer.innerHTML = '';
            for (const s of skinDefs) {
                const owned = !!this.skins[s.id];
                const isEquipped = this.equippedSkin === s.id;
                const card = document.createElement('div');
                card.className = `skin-card ${isEquipped ? 'equipped' : (owned ? 'owned' : '')}`;
                card.innerHTML = `
                    <div class="skin-avatar ${s.id}">${s.icon}</div>
                    <div class="skin-info">
                        <div class="skin-title-row">
                            <span class="skin-name" style="color: ${s.color}; font-weight: 700;">${s.name}</span>
                            ${isEquipped ? '<span class="skin-equipped-badge">DIPASANG ✅</span>' : ''}
                        </div>
                        <p class="skin-desc">${s.desc}</p>
                    </div>
                    <div class="skin-action">
                        ${isEquipped ? '<button class="skin-btn equipped" disabled>TERPASANG</button>' :
                          (owned ? `<button class="skin-btn equip" data-skin="${s.id}">PASANG</button>` :
                          `<button class="skin-btn buy" data-skin="${s.id}">BELI (${s.cost} 💎)</button>`)}
                    </div>
                `;
                const btn = card.querySelector('.skin-btn');
                if (btn) {
                    if (owned && !isEquipped) {
                        btn.addEventListener('click', () => this.equipSkin(s.id));
                    } else if (!owned) {
                        btn.addEventListener('click', () => this.buySkin(s.id));
                    }
                }
                skinsContainer.appendChild(card);
            }
        }

        // Update Spells Shop Tab items (All 10 Spells)
        const spellDefs = [
            { id: 'minerHustle', name: 'Miner Hustle', cost: 20, icon: '⛏️', desc: 'Miner bergerak 85% lebih cepat dan membawa emas ekstra.' },
            { id: 'arrowRain', name: 'Arrow Rain', cost: 30, icon: '🏹', desc: 'Hujan badai anak panah membakar medan perang musuh.' },
            { id: 'healWave', name: 'Healing Wave', cost: 40, icon: '💖', desc: 'Gelombang penyembuh memulihkan seluruh prajurit dan patung.' },
            { id: 'trainingHaste', name: 'Training Haste', cost: 50, icon: '➰', desc: 'Kecepatan rekrutmen pasukan dipercepat 4x lipat.' },
            { id: 'goldenSpearton', name: 'Golden Spartan', cost: 100, icon: '🛡️', desc: 'Memanggil Spearton Emas perkasa dengan HP dan serangan masif.' },
            { id: 'goldRush', name: 'Gold Rush', cost: 250, icon: '💰', desc: 'Seketika menambahkan peti harta karun +1,000 Emas.' },
            { id: 'summonDead', name: 'Summon Undead', cost: 300, icon: '💀', desc: 'Membangkitkan 3 Prajurit Mayat Hidup dari dalam tanah.' },
            { id: 'swordRage', name: 'Sword Rage', cost: 400, icon: '⚔️', desc: 'Seluruh Swordwrath mengamuk: serangan +55% lebih mematikan.' },
            { id: 'lightningStorm', name: 'Lightning Storm', cost: 750, icon: '⚡', desc: 'Petir halilintar dahsyat menyambar patung dan pasukan musuh.' },
            { id: 'summonMarrowkai', name: 'Summon Marrowkai', cost: 1000, icon: '☠️', desc: 'Memanggil Titan Marrowkai pencabut nyawa dengan sabit raksasa.' }
        ];

        const spellsContainer = document.getElementById('shop-spells-container');
        if (spellsContainer) {
            spellsContainer.innerHTML = '';
            for (const sp of spellDefs) {
                const stock = this.spells[sp.id] ? this.spells[sp.id].stock : 0;
                const card = document.createElement('div');
                card.className = 'shop-item-card';
                card.innerHTML = `
                    <div class="shop-item-icon">${sp.icon}</div>
                    <div class="shop-item-info">
                        <div class="shop-item-title-row">
                            <span class="shop-item-name">${sp.name}</span>
                            <span class="shop-item-stock">Stok: ${stock}</span>
                        </div>
                        <p class="shop-item-desc">${sp.desc}</p>
                    </div>
                    <div class="shop-item-action">
                        <button class="shop-buy-btn" data-spell="${sp.id}">BELI (${sp.cost} 💎)</button>
                    </div>
                `;
                const btn = card.querySelector('.shop-buy-btn');
                if (btn) {
                    btn.addEventListener('click', () => this.buySpell(sp.id));
                }
                spellsContainer.appendChild(card);
            }
        }
    }
}

// Global instance
window.game = new StickWarGame();
