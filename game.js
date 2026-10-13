// Stick War: Legacy - Core Game Engine
class StickWarGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Dimensions & World (Perluas wilayah 50 meter jauh dari patung kita dan musuh: 5000px)
        this.worldWidth = 5000;
        this.worldHeight = 650;
        this.groundY = 490;
        this.cameraX = 500;
        this.targetCameraX = 500;

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
        for (let i = 0; i < 60; i++) {
            this.ambientParticles.push({
                x: Math.random() * 5000,
                y: Math.random() * 480,
                radius: 1 + Math.random() * 2.5,
                speedX: 0.15 + Math.random() * 0.45,
                speedY: -0.15 - Math.random() * 0.35,
                alpha: 0.25 + Math.random() * 0.45
            });
        }

        // 20 Crystal Ball Spells System (Crafted from Wizard Shop in reference photos)
        this.spells = {
            // --- Halaman 1 ---
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
            },
            // --- Halaman 2 (10 Spell Baru dari Foto 1 & Foto 2) ---
            flameHelm: {
                id: 'flameHelm',
                name: 'Flame War Cry',
                icon: '🪖',
                key: 'Q',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25,
                activeTimer: 0,
                duration: 18
            },
            divineShield: {
                id: 'divineShield',
                name: 'Divine Aegis',
                icon: '🛡️',
                key: 'W',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 28,
                activeTimer: 0,
                duration: 14
            },
            archidonFury: {
                id: 'archidonFury',
                name: 'Archidon Volley',
                icon: '🏹',
                key: 'E',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 24,
                activeTimer: 0,
                duration: 16
            },
            massMend: {
                id: 'massMend',
                name: 'Mass Holy Mend',
                icon: '✨',
                key: 'F',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 22
            },
            speartonPhalanx: {
                id: 'speartonPhalanx',
                name: 'Spearton Phalanx',
                icon: '🔱',
                key: 'T',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 28,
                activeTimer: 0,
                duration: 15
            },
            sprintHaste: {
                id: 'sprintHaste',
                name: 'Wind Sprint',
                icon: '🏃',
                key: 'G',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 20,
                activeTimer: 0,
                duration: 16
            },
            toxicCloud: {
                id: 'toxicCloud',
                name: 'Toxic Mist',
                icon: '☣️',
                key: 'H',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 26,
                activeTimer: 0,
                duration: 12
            },
            royalCrown: {
                id: 'royalCrown',
                name: 'Royal King Crown',
                icon: '👑',
                key: 'J',
                stock: 2,
                maxStock: 2,
                cooldown: 0,
                maxCooldown: 32
            },
            undeadHorde: {
                id: 'undeadHorde',
                name: 'Undead Horde',
                icon: '💀',
                key: 'K',
                stock: 2,
                maxStock: 2,
                cooldown: 0,
                maxCooldown: 30
            },
            electricStorm: {
                id: 'electricStorm',
                name: 'Golden Thunder',
                icon: '⚡',
                key: 'U',
                stock: 3,
                maxStock: 3,
                cooldown: 0,
                maxCooldown: 25
            }
        };
        this.spellPage = 1; // 1 or 2 (switched via green arrow button)

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
            ice: false,
            bomb: false,
            vampire: false,
            savage: false,
            leaf: false,
            voltaic: false
        };
        this.equippedSkin = 'classic';
        this.mixSkinUnlocked = false;
        this.equippedSkins = ['classic'];
        this.enemyEquippedSkin = 'classic';
        this.isLoopRunning = false;
        this.enemyEmergencyTriggered = false;
        this.playerEmergencyTriggered = false;

        // Mode Gila-Gilaan: Musuh Mengontrolkan Pasukan
        this.enemyControlledUnit = null;
        this.enemyControlCooldown = 0;

        // Even Level Night & Zombie Horde System
        this.isNight = false;
        this.isZombieMode = false;
        this.nightStars = [];
        for (let i = 0; i < 120; i++) {
            this.nightStars.push({
                x: Math.random() * 5000,
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
            maxUpgrades: false,
            spyInvisible: false,
            statueInvulnerable: false,
            heartNotHave: false,
            hittingMeBro: false
        };
        this.enemyCheats = {
            infiniteGold: false,
            noCooldown: false,
            noPopulation: false,
            infiniteSpells: false,
            statueInvulnerable: false,
            heartNotHave: false,
            hittingMeBro: false
        };
        this.cheatTarget = 'player'; // 'player', 'enemy', 'both'
        this.enemyCastleSkin = 'classic';
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

        // Bases / Statues (Diperluas wilayah 50 meter di belakang patung pemain dan patung musuh)
        this.playerStatue = {
            x: 1000,
            y: this.groundY,
            hp: 2200,
            maxHp: 2200,
            team: 'player',
            width: 80,
            height: 180
        };

        this.enemyStatue = {
            x: 4000,
            y: this.groundY,
            hp: 2200,
            maxHp: 2200,
            team: 'enemy',
            width: 80,
            height: 180
        };
        this.matchTime = 0;

        // Entities
        this.units = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.stuckArrows = [];

        // Gold Mines (Minimal 6 tambang emas dengan kapasitas masing-masing minimal 6 penambang)
        this.goldMines = [
            { x: 1300, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] },
            { x: 1750, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] },
            { x: 2200, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] },
            { x: 2800, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] },
            { x: 3250, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] },
            { x: 3700, y: this.groundY, goldLeft: 9999, capacity: 6, miners: [] }
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
            },
            minion: {
                name: 'Minion Magikill',
                cost: 0,
                hp: 130,
                speed: 3.5,
                scale: 0.9,
                attackDmg: 22,
                attackCooldown: 0.7,
                range: 36,
                cooldownTime: 0
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
            marrowkai: 0,
            minion: 0
        };

        // Screen Shake
        this.shakeTime = 0;
        this.shakeIntensity = 0;

        // Castle Wall Archers (diawali 0 pemanah, bertambah 1 pemanah per 3 pasukan mundur masuk benteng, max 4)
        this.castleArchers = {
            player: { x: 750, y: this.groundY - 140, timer: 0, count: 0 },
            enemy: { x: 4250, y: this.groundY - 140, timer: 0, count: 0 }
        };
        this.playerGarrisonCount = 0;
        this.enemyGarrisonCount = 0;

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
        
        // Low-End Device Optimization: clamp DPR to 1.0 (or max 1.5 in HD) to keep rendering ultra smooth
        const isMobileOrLowEnd = (window.innerWidth <= 1024 || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4));
        const maxDpr = this.isHD ? 1.5 : (isMobileOrLowEnd ? 1.0 : 1.25);
        const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
        this.dpr = dpr;
        this.canvas.width = Math.round(rect.width * dpr);
        this.canvas.height = Math.round((rect.height || 650) * dpr);
        this.viewWidth = rect.width;
        this.viewHeight = rect.height || 650;

        // Responsive ground position safely positioned for phones, tablets & desktop
        const bottomOffset = this.viewHeight < 480 ? 95 : (this.viewHeight < 650 ? 120 : 140);
        this.groundY = Math.max(250, Math.round(this.viewHeight - bottomOffset));

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

        this.checkOrientation();
    }

    toggleHD() {
        this.isHD = !this.isHD;
        this.resize();
        const btn = document.getElementById('btn-hd');
        if (btn) btn.classList.toggle('hd-active', this.isHD);
        this.showToast(this.isHD ? '✨ Mode Grafis HD Aktif (Ultra Sharp)' : 'Mode Grafis Standar');
        return this.isHD;
    }

    toggleFullscreen() {
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            const root = document.documentElement;
            if (root.requestFullscreen) {
                root.requestFullscreen().catch(() => {});
            } else if (root.webkitRequestFullscreen) {
                root.webkitRequestFullscreen();
            }
            this.showToast('🖥️ Mode Layar Penuh (Fullscreen)');
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().catch(() => {});
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
            this.showToast('Keluar dari Layar Penuh');
        }
    }

    checkOrientation() {
        const overlay = document.getElementById('orientation-overlay');
        if (!overlay) return;
        const isPortraitMobile = window.innerHeight > window.innerWidth && window.innerWidth <= 820;
        if (isPortraitMobile) {
            overlay.classList.remove('hidden');
        } else {
            overlay.classList.add('hidden');
        }
    }

    hasSkin(unit, skinName) {
        if (!unit) {
            if (this.mixSkinUnlocked && this.equippedSkins && this.equippedSkins.length > 0) {
                return this.equippedSkins.includes(skinName);
            }
            return this.equippedSkin === skinName;
        }
        if (typeof unit === 'string') {
            return unit === skinName || unit.split('+').includes(skinName);
        }
        if (unit.skins && Array.isArray(unit.skins)) {
            return unit.skins.includes(skinName);
        }
        if (unit.skin) {
            if (Array.isArray(unit.skin)) return unit.skin.includes(skinName);
            return unit.skin === skinName || (typeof unit.skin === 'string' && unit.skin.split('+').includes(skinName));
        }
        if (unit.team === 'player') {
            if (this.mixSkinUnlocked && this.equippedSkins && this.equippedSkins.length > 0) {
                return this.equippedSkins.includes(skinName);
            }
            return this.equippedSkin === skinName;
        } else if (unit.team === 'enemy') {
            if (this.difficulty === 'insane') return false;
            return this.enemyEquippedSkin === skinName;
        }
        return false;
    }

    getMagikillMinionLimit(team = 'player') {
        if (team === 'player') {
            const lvl = (this.upgrades && this.upgrades.magikillStaff) || 0;
            if (lvl >= 3) return 10; // Tingkat 3 / MAX: 10 minion
            if (lvl === 2) return 9;  // Tingkat 2: 9 minion
            if (lvl === 1) return 7;  // Tingkat 1: 7 minion
            return 5;                 // Tingkat 0 (Standar): 5 minion
        } else {
            // Musuh
            if (this.difficulty === 'insane') return 10;
            if (this.difficulty === 'hard') return 9;
            if (this.currentLevel >= 40) return 7;
            return 5;
        }
    }

    start(level = 1, mode = 'campaign', difficulty = null) {
        this.currentLevel = Math.max(1, Math.min(100, Math.floor(level || 1)));
        this.gameMode = mode;
        if (difficulty) this.difficulty = difficulty;
        this.gameOver = false;
        this.gameWon = false;
        this.running = true;
        this.paused = false;
        this.enemyEmergencyTriggered = false;
        this.playerEmergencyTriggered = false;
        this.matchTime = 0;

        // Reset Mode Gila-Gilaan enemy commander
        this.enemyControlledUnit = null;
        this.enemyControlCooldown = 2.5;

        // Even Level Night & Zombie Horde Detection
        this.isNight = (this.currentLevel % 2 === 0);
        this.isZombieMode = this.isNight;

        const levelStatueBonus = (this.currentLevel - 1) * 65;
        const statueUpgradeBonus = (this.upgrades.statue || 0) * 400;

        // Configure Difficulty parameters & scaling (Patung minimal 2000-3500 HP agar ambang batas < 1000 HP terpicu saat kritis)
        if (this.difficulty === 'easy') {
            this.gold = 1000;
            this.playerStatue.maxHp = 2500 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 2000 + levelStatueBonus;
            this.enemyGold = 250;
        } else if (this.difficulty === 'hard') {
            this.gold = 350;
            this.playerStatue.maxHp = 2200 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 2800 + levelStatueBonus;
            this.enemyGold = 800 + this.currentLevel * 150;
        } else if (this.difficulty === 'insane') {
            // Mode Gila-Gilaan: Musuh Super Pro, Emas Melimpah & Sangat Agresif!
            this.gold = 350;
            this.playerStatue.maxHp = 2000 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 3500 + levelStatueBonus * 1.3;
            this.enemyGold = 1200 + this.currentLevel * 200;
        } else {
            // Medium (Default)
            this.gold = 500;
            this.playerStatue.maxHp = 2200 + levelStatueBonus + statueUpgradeBonus;
            this.enemyStatue.maxHp = 2200 + levelStatueBonus;
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

        // Castle skin assignment
        if (this.difficulty === 'insane') {
            const insaneSkins = ['fire', 'ice', 'bomb', 'vampire', 'savage'];
            this.enemyCastleSkin = insaneSkins[Math.floor(Math.random() * insaneSkins.length)];
        } else {
            this.enemyCastleSkin = 'classic';
        }

        // Reset Castle Wall Archers: diawali 0 pemanah di menara!
        this.castleArchers = {
            player: { x: 750, y: this.groundY - 140, timer: 0, count: 0 },
            enemy: { x: 4250, y: this.groundY - 140, timer: 0, count: 0 }
        };
        this.playerGarrisonCount = 0;
        this.enemyGarrisonCount = 0;
        this.garrisonedUnits = { player: [], enemy: [] };
        this.spellTrayCollapsed = false;
        this.enemySpyCollapsed = false;

        this.playerStatue.hp = this.playerStatue.maxHp;
        this.enemyStatue.hp = this.enemyStatue.maxHp;

        this.units = [];
        this.projectiles = [];
        this.particles = [];
        this.floatingTexts = [];
        this.stuckArrows = [];

        // Spawn initial miners: MINIMAL 5-6 PENAMBANG UNTUK KITA DAN MUSUH!
        const initialMiners = 5;
        for (let i = 0; i < initialMiners; i++) {
            this.spawnUnit('miner', 'player', 1040 + i * 25);
            this.spawnUnit('miner', 'enemy', 3960 - i * 25);
        }
        if (this.difficulty === 'insane') {
            // Mode gila-gilaan: 6 penambang penuh sejak detik pertama
            this.spawnUnit('miner', 'player', 1040 + initialMiners * 25);
            this.spawnUnit('miner', 'enemy', 3960 - initialMiners * 25);
        }

        // Enemy initial army dynamically crafted for Levels 1 to 100
        this.setupLevel(this.currentLevel);

        this.cameraX = 500;
        this.targetCameraX = 500;

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

        this.lastTime = 0;
        if (!this.isLoopRunning) {
            this.isLoopRunning = true;
            requestAnimationFrame((t) => this.gameLoop(t));
        }
    }

    setupLevel(level) {
        const isHard = this.difficulty === 'hard';
        const originalSpawn = this.spawnUnit.bind(this);
        const prevSpawn = this.spawnUnit;
        this.spawnUnit = (type, team, x) => {
            const adjustedX = (team === 'enemy' && x < 3500) ? (x + 1050) : x;
            return originalSpawn(type, team, adjustedX);
        };
        try {
            this._setupLevelInternal(level, isHard);
        } finally {
            this.spawnUnit = prevSpawn;
        }
    }

    _setupLevelInternal(level, isHard) {
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
                } else if (this.keyBuffer.endsWith('lookinvisble') || this.keyBuffer.endsWith('lookinvisible') || this.keyBuffer.endsWith('1lookinvisble') || this.keyBuffer.endsWith('1lookinvisible')) {
                    this.applyCheat('lookinvisble');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('mymart') || this.keyBuffer.endsWith('2mymart')) {
                    this.applyCheat('mymart');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('heartnothave') || this.keyBuffer.endsWith('1heartnothave')) {
                    this.applyCheat('heartnothave');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('hittingmebro') || this.keyBuffer.endsWith('2hittingmebro') || this.keyBuffer.endsWith('2.hittingmebro')) {
                    this.applyCheat('hittingmebro');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('enemyheartnothave')) {
                    this.applyCheat('enemyheartnothave');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('enemyhittingmebro')) {
                    this.applyCheat('enemyhittingmebro');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('enemymart')) {
                    this.applyCheat('enemymart');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('enemygold')) {
                    this.applyCheat('enemygold');
                    this.keyBuffer = '';
                } else if (this.keyBuffer.endsWith('balabantuan') || this.keyBuffer.endsWith('emergencycall') || this.keyBuffer.endsWith('panggilbalabantuan')) {
                    this.applyCheat('balabantuan');
                    this.keyBuffer = '';
                }
            }

            // Crystal Ball Spell Shortcuts (Disesuaikan menurut Halaman Mantra 1 atau 2)
            const p1Keys = { KeyQ: 'minerHustle', KeyW: 'arrowRain', KeyE: 'healWave', KeyF: 'swordRage', KeyT: 'goldenSpearton', KeyG: 'trainingHaste', KeyH: 'lightningStorm', KeyJ: 'summonDead', KeyK: 'goldRush', KeyU: 'summonMarrowkai' };
            const p2Keys = { KeyQ: 'flameHelm', KeyW: 'divineShield', KeyE: 'archidonFury', KeyF: 'massMend', KeyT: 'speartonPhalanx', KeyG: 'sprintHaste', KeyH: 'toxicCloud', KeyJ: 'royalCrown', KeyK: 'undeadHorde', KeyU: 'electricStorm' };
            const activeSpellMap = this.spellPage === 1 ? p1Keys : p2Keys;
            if (activeSpellMap[e.code]) {
                this.castSpell(activeSpellMap[e.code]);
            }
            if (e.code === 'KeyP') {
                this.toggleSpellPage();
            }

            // Direct Unit Ability hotkeys
            if (e.code === 'KeyD' && !this.controlledUnit) {
                this.setStance('defend');
            } else if (e.code === 'KeyA' && !this.controlledUnit) {
                this.setStance('attack');
            } else if (e.code === 'KeyR' && !this.controlledUnit) {
                this.setStance('retreat');
            } else if (e.code === 'KeyV' && !this.controlledUnit) {
                this.toggleSpellTray();
            } else if (e.code === 'KeyB' && !this.controlledUnit) {
                // Tombol B: Panggil Bala Bantuan Kerajaan Saat Patung Terancam (< 1000 HP)
                if (this.playerStatue && this.playerStatue.hp < 1000 && !this.playerEmergencyTriggered) {
                    this.triggerPlayerEmergencyReinforcements();
                } else if (this.playerEmergencyTriggered) {
                    this.showToast('⚠️ Bala bantuan kerajaan sudah pernah dikerahkan pada pertempuran ini!', 'warning');
                } else {
                    this.showToast(`🛡️ Bala bantuan siaga! Hanya bisa dipanggil saat patung terancam (<1000 HP). (HP Patung: ${Math.round(this.playerStatue.hp)}/${this.playerStatue.maxHp})`, 'warning');
                }
            } else if (e.code === 'KeyN' && !this.controlledUnit) {
                this.toggleEnemySpyHUD();
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
            const mx = this.viewWidth - mw - 20;
            const my = this.viewHeight - mh - 20;
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

        // Touch interactions (Mobile & Tablet)
        this.canvas.addEventListener('touchstart', (e) => {
            if (window.soundCtrl) {
                window.soundCtrl.init();
                window.soundCtrl.resume();
            }
            if (e.touches.length === 1) {
                const touch = e.touches[0];
                const rect = this.canvas.getBoundingClientRect();
                const tx = touch.clientX - rect.left;
                const ty = touch.clientY - rect.top;
                const worldX = tx + this.cameraX;

                // Minimap tap
                const mw = 220;
                const mh = 50;
                const mx = this.viewWidth - mw - 20;
                const my = this.viewHeight - mh - 20;
                if (tx >= mx && tx <= mx + mw && ty >= my && ty <= my + mh) {
                    const ratio = Math.max(0, Math.min(1, (tx - mx) / mw));
                    this.targetCameraX = ratio * this.worldWidth - this.viewWidth / 2;
                    this.clampCamera();
                    e.preventDefault();
                    return;
                }

                // Friendly unit selection tap
                const clickedUnit = this.findUnitAt(worldX, ty);
                if (clickedUnit && clickedUnit.team === 'player') {
                    this.selectUnit(clickedUnit);
                    e.preventDefault();
                    return;
                }

                // If controlling unit, tap acts
                if (this.controlledUnit) {
                    this.triggerControlledAction();
                    e.preventDefault();
                    return;
                }

                // Camera touch pan
                this.isTouchDragging = true;
                this.touchStartX = touch.clientX;
                this.touchCameraStartX = this.cameraX;
            }
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (this.isTouchDragging && e.touches.length > 0) {
                const dx = e.touches[0].clientX - this.touchStartX;
                this.targetCameraX = this.touchCameraStartX - dx;
                this.clampCamera();
            }
        }, { passive: true });

        window.addEventListener('touchend', () => {
            this.isTouchDragging = false;
        });
        window.addEventListener('touchcancel', () => {
            this.isTouchDragging = false;
        });

        // Mobile Virtual Controls
        const btnLeft = document.getElementById('btn-touch-left');
        const btnRight = document.getElementById('btn-touch-right');
        const btnAttack = document.getElementById('btn-touch-attack');
        const btnBlock = document.getElementById('btn-touch-block');
        const btnExit = document.getElementById('btn-touch-exit');

        if (btnLeft) {
            const startL = (e) => { e.preventDefault(); this.keys['KeyA'] = true; };
            const endL = (e) => { e.preventDefault(); this.keys['KeyA'] = false; };
            btnLeft.addEventListener('touchstart', startL, { passive: false });
            btnLeft.addEventListener('touchend', endL, { passive: false });
            btnLeft.addEventListener('mousedown', startL);
            btnLeft.addEventListener('mouseup', endL);
        }
        if (btnRight) {
            const startR = (e) => { e.preventDefault(); this.keys['KeyD'] = true; };
            const endR = (e) => { e.preventDefault(); this.keys['KeyD'] = false; };
            btnRight.addEventListener('touchstart', startR, { passive: false });
            btnRight.addEventListener('touchend', endR, { passive: false });
            btnRight.addEventListener('mousedown', startR);
            btnRight.addEventListener('mouseup', endR);
        }
        if (btnAttack) {
            const doAttack = (e) => { e.preventDefault(); this.triggerControlledAction(); };
            btnAttack.addEventListener('touchstart', doAttack, { passive: false });
            btnAttack.addEventListener('click', doAttack);
        }
        if (btnBlock) {
            const doBlock = (e) => {
                e.preventDefault();
                if (this.controlledUnit) {
                    this.controlledUnit.isManualBlock = !this.controlledUnit.isManualBlock;
                }
            };
            btnBlock.addEventListener('touchstart', doBlock, { passive: false });
            btnBlock.addEventListener('click', doBlock);
        }
        if (btnExit) {
            const doExit = (e) => {
                e.preventDefault();
                this.deselectUnit();
            };
            btnExit.addEventListener('touchstart', doExit, { passive: false });
            btnExit.addEventListener('click', doExit);
        }

        // Fullscreen & Orientation controls
        const btnFs = document.getElementById('btn-fullscreen');
        if (btnFs) {
            btnFs.addEventListener('click', () => this.toggleFullscreen());
        }
        const btnDismissOrient = document.getElementById('btn-dismiss-orient');
        if (btnDismissOrient) {
            btnDismissOrient.addEventListener('click', () => {
                const ov = document.getElementById('orientation-overlay');
                if (ov) ov.classList.add('hidden');
            });
        }

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
        }
        for (const u of this.units) {
            if (u.team === 'player' && u.isControlled) {
                u.isControlled = false;
                u.isManualBlock = false;
            }
        }
        this.updateControlUI();
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
        } else if (u.type === 'magikill') {
            // Summon minion & cast blast
            const isSavage = this.hasSkin(u, 'savage');
            const activeMinions = this.units.filter(m => m.team === u.team && m.type === 'minion' && m.state !== 'dead').length;
            const minionLimit = this.getMagikillMinionLimit(u.team);

            if (u.attackTimer <= 0) {
                u.state = 'attack';
                u.attackProgress = 0;
                // Savage skin provides 2X Attack Speed (cooldown 1.0s vs 2.0s)
                u.attackTimer = isSavage ? 1.0 : 2.0;

                // Batas pemanggilan minion ditentukan oleh Peningkatan Tongkat Magikill (1: 7, 2: 9, 3/MAX: 10 minion)
                if (activeMinions < minionLimit) {
                    const spawnBurst = (activeMinions < minionLimit - 1) ? 2 : 1;
                    for (let s = 0; s < spawnBurst; s++) {
                        const spawnX = u.x + u.dir * (40 + s * 24);
                        this.spawnUnit('minion', u.team, spawnX);
                        this.createMagicExplosionParticles(spawnX, this.groundY - 30, isSavage ? '#10b981' : '#c084fc');
                    }
                    this.showFloatingText(u.x + u.dir * 45, this.groundY - 65, `💀 MINION SWARM (${Math.min(minionLimit, activeMinions + spawnBurst)}/${minionLimit})`, isSavage ? '#10b981' : '#c084fc');
                } else {
                    const spawnX = u.x + u.dir * 45;
                    this.createMagicExplosionParticles(spawnX, this.groundY - 30, '#ffd700');
                    this.showFloatingText(u.x, this.groundY - 65, `⚡ MAGIKILL BLAST (MAX ${minionLimit} MINION)`, '#ffd700');
                }
                if (window.soundCtrl) window.soundCtrl.playMinionSummon();
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

        // Saat ingin menyerang atau bertahan lagi, SELURUH pasukan yang masuk ke benteng akan keluar!
        if (stance === 'attack' || stance === 'defend') {
            this.releaseGarrisonedUnits('player');
        }

        this.updateCastleUI();

        const msg = stance === 'defend' ? '🛡️ PERTAHANAN: Berbaris dan tahan musuh!' :
                    stance === 'attack' ? '⚔️ SERANGAN PENUH: Hancurkan patung musuh!' :
                    '🏰 MUNDUR: Masuk benteng perlindungan!';
        this.showToast(msg);
    }

    trainUnit(type) {
        const def = this.unitDefs[type];
        if (!def) return;

        let cost = def.cost;
        if (this.hasSkin(null, 'leaf')) {
            cost = Math.floor(cost * 0.5); // 50% Diskon Skin Daun!
        }

        // Check gold (bypass if infiniteGold cheat is active)
        if (!this.cheats.infiniteGold && this.gold < cost) {
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
            this.gold -= cost;
        }
        if (!this.cheats.noCooldown) {
            this.spawnCooldowns[type] = def.cooldownTime;
        } else {
            this.spawnCooldowns[type] = 0;
        }
        this.stats.unitsSpawned++;

        // Spawn unit at player base
        const spawnX = (this.playerStatue.x - 30) + Math.random() * 50;
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

        // Skin assignment for player & enemy
        let assignedSkin = 'classic';
        let assignedSkins = ['classic'];

        if (team === 'player') {
            if (this.mixSkinUnlocked && this.equippedSkins && this.equippedSkins.length > 1) {
                assignedSkin = this.equippedSkins.join('+');
                assignedSkins = [...this.equippedSkins];
            } else {
                assignedSkin = this.equippedSkin || 'classic';
                assignedSkins = [assignedSkin];
            }
        } else {
            if (this.difficulty === 'insane') {
                // Saat mode gila skin musuh tetap diacak!
                const insaneSkinPool = ['classic', 'fire', 'ice', 'bomb', 'vampire', 'savage', 'leaf', 'voltaic'];
                assignedSkin = insaneSkinPool[Math.floor(Math.random() * insaneSkinPool.length)];
                assignedSkins = [assignedSkin];
            } else {
                // Memberikan skin pilihan pemain kepada musuh
                assignedSkin = this.enemyEquippedSkin || 'classic';
                assignedSkins = [assignedSkin];
            }
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
            electrifiedTimer: 0,
            skin: assignedSkin,
            skins: assignedSkins,
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
        this.matchTime = (this.matchTime || 0) + dt;

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
        if (this.enemyCheats.infiniteGold) {
            this.enemyGold = Math.max(this.enemyGold, 999999);
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
        if (this.cheats.statueInvulnerable) {
            this.playerStatue.hp = this.playerStatue.maxHp;
        }
        if (this.enemyCheats.statueInvulnerable) {
            this.enemyStatue.hp = this.enemyStatue.maxHp;
        }
        if (this.cheats.heartNotHave) {
            for (const u of this.units) {
                if (u.team === 'player' && u.state !== 'dead') {
                    u.hp = u.maxHp;
                }
            }
        }
        if (this.enemyCheats.heartNotHave) {
            for (const u of this.units) {
                if (u.team === 'enemy' && u.state !== 'dead') {
                    u.hp = u.maxHp;
                }
            }
        }
        if (this.cheats.spyInvisible) {
            this.updateEnemySpyHUD();
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

        // Check Emergency Reinforcements for Player & Enemy (< 1000 HP)
        this.checkStatueEmergencyReinforcements();

        // Update Top HUD
        this.updateUI();
    }

    updateCastleArchers(dt) {
        // Player Castle Archers (diawali 0 pemanah; bertambah saat 2 pasukan mundur masuk benteng, max 4)
        const pArcher = this.castleArchers.player;
        if (pArcher.count > 0) {
            pArcher.timer -= dt;
            if (pArcher.timer <= 0) {
                const enemyThreats = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead' && u.x < 1550);
                if (enemyThreats.length > 0) {
                    const dmg = 26 + (this.upgrades.castleArcher || 0) * 10;
                    const shots = Math.min(pArcher.count, 4);
                    for (let s = 0; s < shots; s++) {
                        const target = enemyThreats[s % enemyThreats.length];
                        const archerX = pArcher.x - 24 + s * 16;
                        const archerY = pArcher.y - (s % 2) * 8;
                        this.fireArrow(archerX, archerY, target.x, target.y - 30, 'player', dmg);
                    }
                    if (window.soundCtrl) window.soundCtrl.playBowShoot();
                    pArcher.timer = Math.max(0.65, 1.5 - (this.upgrades.castleArcher || 0) * 0.25);
                }
            }
        }

        // Enemy Castle Archers (diawali 0 pemanah; bertambah saat 2 pasukan mundur masuk benteng, max 4)
        const eArcher = this.castleArchers.enemy;
        if (eArcher.count > 0) {
            eArcher.timer -= dt;
            if (eArcher.timer <= 0) {
                const playerThreats = this.units.filter(u => u.team === 'player' && u.state !== 'dead' && u.x > 3450);
                if (playerThreats.length > 0) {
                    const shots = Math.min(eArcher.count, 4);
                    for (let s = 0; s < shots; s++) {
                        const target = playerThreats[s % playerThreats.length];
                        const archerX = eArcher.x - 24 + s * 16;
                        const archerY = eArcher.y - (s % 2) * 8;
                        this.fireArrow(archerX, archerY, target.x, target.y - 30, 'enemy', 24);
                    }
                    if (window.soundCtrl) window.soundCtrl.playBowShoot();
                    eArcher.timer = 1.5;
                }
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
            if (u.attackTimer > 0) u.attackTimer -= dt * (this.hasSkin(u, 'savage') ? 2.0 : 1.0);
            if (u.hurtTimer > 0) u.hurtTimer -= dt;
            if (u.garrisonCooldown > 0) u.garrisonCooldown -= dt;
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

            // Electrified effect status timer: emit high-voltage sparks for 10 seconds!
            if (u.electrifiedTimer > 0) {
                u.electrifiedTimer -= dt;
                if (Math.random() < 0.35) {
                    this.createSparks(u.x + (Math.random() - 0.5) * 18, u.y - 30 + (Math.random() - 0.5) * 20, Math.random() < 0.5 ? '#38bdf8' : '#facc15', 1);
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

            // Magikill Minion Summoning (Batas pemanggilan minion diatur dari Peningkatan Tongkat Magikill: 1: 7, 2: 9, 3/MAX: 10 minion)
            if (u.type === 'magikill' && u.state !== 'dead') {
                const isSavage = this.hasSkin(u, 'savage');
                const activeMinions = this.units.filter(m => m.team === u.team && m.type === 'minion' && m.state !== 'dead').length;
                const minionLimit = this.getMagikillMinionLimit(u.team);
                const defaultInterval = isSavage ? 2.0 : (u.team === 'player' ? 3.0 : 6.0);
                u.minionSummonTimer = (u.minionSummonTimer !== undefined ? u.minionSummonTimer : defaultInterval) - dt;

                if (u.minionSummonTimer <= 0) {
                    if (activeMinions < minionLimit) {
                        const minionsNeeded = Math.max(1, minionLimit - activeMinions);
                        const spawnBurst = Math.min(2, minionsNeeded);
                        for (let s = 0; s < spawnBurst; s++) {
                            const spawnX = u.x + u.dir * (35 + s * 22);
                            this.spawnUnit('minion', u.team, spawnX);
                            this.createMagicExplosionParticles(spawnX, this.groundY - 30, isSavage ? '#10b981' : '#c084fc');
                        }
                        // Cepat summon ulang jika di bawah batas minion (3.5s atau 2.0s jika savage), normal 9s jika sudah mencapai batas
                        u.minionSummonTimer = (activeMinions + spawnBurst < minionLimit) ? (isSavage ? 2.0 : 3.5) : (isSavage ? 5.0 : 9.0);
                        this.showFloatingText(u.x, this.groundY - 65, `💀 MINION SWARM (${Math.min(minionLimit, activeMinions + spawnBurst)}/${minionLimit})`, isSavage ? '#10b981' : '#c084fc');
                    } else {
                        u.minionSummonTimer = isSavage ? 6.0 : 11.0;
                    }
                    if (window.soundCtrl) window.soundCtrl.playMinionSummon();
                }
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

            // Mode HD Real Animation: Efek partikel debu langkah kaki saat berlari/berjalan
            if (this.isHD && u.state === 'walk' && Math.random() < 0.1) {
                this.createDustPuff(u.x, this.groundY);
            }
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
            const speedFactor = this.hasSkin(u, 'savage') ? 2.0 : 1.0;
            u.animProgress += dt * 3.5 * speedFactor;
            u.attackProgress += dt * 3.5 * speedFactor;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = def.attackCooldown / speedFactor;
                u.hasHitThisSwing = false;
            }
            return;
        }

        if (u.state === 'mine' && u.type === 'miner') {
            const speedFactor = this.hasSkin(u, 'savage') ? 2.0 : 1.0;
            u.animProgress += dt * 3 * speedFactor;
            u.mineTimer += dt * speedFactor;
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

    handleUnitGarrison(u) {
        if (!u || u.neverGarrison) return;
        if (!this.garrisonedUnits) {
            this.garrisonedUnits = { player: [], enemy: [] };
        }

        // Unit masuk ke dalam kastil untuk berlindung (bukan mati)
        if (u.isControlled || this.controlledUnit === u) {
            this.deselectUnit();
        }
        if (u.isEnemyControlled || this.enemyControlledUnit === u) {
            this.enemyControlledUnit = null;
        }

        u.inCastle = true;
        u.state = 'garrisoned';
        if (!this.garrisonedUnits[u.team]) this.garrisonedUnits[u.team] = [];
        this.garrisonedUnits[u.team].push(u);

        // Hapus sementara dari unit aktif di lapangan agar tidak menerima damage / tabrakan
        const idx = this.units.indexOf(u);
        if (idx !== -1) {
            this.units.splice(idx, 1);
        }

        const isPlayer = u.team === 'player';
        const currentGarrison = this.garrisonedUnits[u.team].length;

        // "saat pasukan kita 3 pasukan unit akan hilang 1 pemanah menara begitu saat masuk saat pasukan masuk kemenarah kastil begitu juga dengan pemanah kastil musuh"
        // Setiap 3 pasukan di dalam kastil memunculkan 1 pemanah kastil di menara (maksimal 4 pemanah)
        const prevArchers = this.castleArchers[u.team].count;
        const newArchers = Math.min(4, Math.floor(currentGarrison / 3));
        this.castleArchers[u.team].count = newArchers;

        if (newArchers > prevArchers && isPlayer) {
            this.showToast(`🏹 Pemanah Kastil Aktif! (${newArchers}/4 Pemanah Menara)`, 'gold');
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        }

        const floatX = isPlayer ? 750 : 4250;
        const floatColor = isPlayer ? '#38bdf8' : '#ef4444';
        this.showFloatingText(floatX, this.groundY - 110, `🏰 Masuk Benteng (${currentGarrison} Pasukan | ${newArchers}/4 Pemanah)`, floatColor);
        this.updateCastleUI();
    }

    releaseGarrisonedUnits(team, count = null) {
        if (!this.garrisonedUnits || !this.garrisonedUnits[team]) return;
        const garrison = this.garrisonedUnits[team];
        if (garrison.length === 0) return;

        const isPlayer = team === 'player';
        // Spawn aman di luar gerbang kastil (750 & 4250) agar tidak ngebug langsung terhisap masuk kembali
        const exitX = isPlayer ? 840 : 4160;
        const exitDir = isPlayer ? 1 : -1;

        // Tentukan jumlah yang dikeluarkan (seluruhnya atau sebagian seperti 3 unit)
        const releaseCount = (count && count > 0) ? Math.min(count, garrison.length) : garrison.length;
        const unitsToRelease = garrison.splice(0, releaseCount);

        for (let i = 0; i < unitsToRelease.length; i++) {
            const u = unitsToRelease[i];
            u.inCastle = false;
            u.state = 'walk';
            u.deathAlpha = 1.0;
            u.x = exitX + exitDir * (i * 24);
            u.y = this.groundY;
            u.dir = exitDir;
            u.targetX = null;
            u.attackTimer = 0;
            u.attackProgress = 0;
            u.hasHitThisSwing = false;
            u.isControlled = false;
            u.isEnemyControlled = false;
            u.animProgress = Math.random() * 2;
            u.garrisonCooldown = 3.5; // Cooldown 3.5 detik agar unit tidak langsung terhisap kembali saat keluar!

            if (u.type === 'miner') {
                u.carriedGold = u.carriedGold || 0;
            }

            if (!this.units.includes(u)) {
                this.units.push(u);
            }
            this.createSparks(u.x, u.y - 25, isPlayer ? '#00e5ff' : '#ff3344', 6);
        }

        // "saat pasukan kita keluar semua saat pasukan kita 3 pasukan unit akan hilang 1 pemanah menara begitu saat masuk saat pasukan masuk kemenarah kastil begitu juga dengan pemanah kastil musuh"
        // Pemanah menara disesuaikan dengan sisa pasukan di dalam kastil:
        // Setiap 3 pasukan yang keluar -> 1 pemanah menara hilang!
        // Jika seluruh pasukan keluar -> seluruh pemanah menara turun posisi (0 pemanah)!
        const prevArchers = this.castleArchers[team].count;
        const newArchers = Math.min(4, Math.floor(garrison.length / 3));
        this.castleArchers[team].count = newArchers;
        const archersLost = Math.max(0, prevArchers - newArchers);

        if (isPlayer) {
            this.showFloatingText(exitX, this.groundY - 110, `⚔️ ${unitsToRelease.length} PASUKAN KELUAR BENTENG!`, '#ffd700');
            if (archersLost > 0) {
                this.showToast(`⚔️ ${unitsToRelease.length} Pasukan keluar benteng! (${archersLost} Pemanah Menara turun posisi, sisa: ${newArchers}/4)`, 'gold');
            } else {
                this.showToast(`⚔️ ${unitsToRelease.length} Pasukan keluar dari benteng!`, 'gold');
            }
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            this.triggerScreenShake(0.2, 5);
        } else {
            this.showFloatingText(exitX, this.groundY - 110, `⚔️ ${unitsToRelease.length} PASUKAN MUSUH KELUAR!`, '#ef4444');
        }

        this.updateCastleUI();
    }

    updateCastleUI() {
        const btn = document.getElementById('btn-release-castle');
        const badge = document.getElementById('castle-garrison-badge');
        if (!btn) return;
        const count = this.garrisonedUnits?.player?.length || 0;
        const archers = this.castleArchers?.player?.count || 0;
        if (count > 0) {
            btn.classList.remove('hidden');
            if (badge) badge.innerText = `KELUAR (${count} Unit | ${archers} 🏹)`;
        } else {
            btn.classList.add('hidden');
        }
    }

    handleMinerAI(u, dt) {
        const baseStatue = u.team === 'player' ? this.playerStatue : this.enemyStatue;
        const stance = u.team === 'player' ? this.playerStance : this.enemyStance;
        const isHustling = u.team === 'player' && this.spells.minerHustle && this.spells.minerHustle.activeTimer > 0;
        const miningUpgradeBonus = (u.team === 'player' ? (this.upgrades.mining || 0) : 0);
        const chilledMult = (u.chilledTimer > 0 ? 0.65 : 1.0);
        const minerSpeed = u.speed * (isHustling ? 1.85 : 1.0) * (1 + miningUpgradeBonus * 0.15) * chilledMult;

        // If retreat stance: run into safe castle tower garrison
        if (stance === 'retreat') {
            const isPlayer = u.team === 'player';
            if (u.garrisonCooldown > 0) u.garrisonCooldown -= dt;
            if (!u.garrisonCooldown || u.garrisonCooldown <= 0) {
                if (isPlayer && u.x <= 770) {
                    this.handleUnitGarrison(u);
                    return;
                } else if (!isPlayer && u.x >= 4230) {
                    this.handleUnitGarrison(u);
                    return;
                }
            }
            const safeX = isPlayer ? 760 : 4240;
            u.dir = safeX > u.x ? 1 : -1;
            u.x += u.dir * minerSpeed * 65 * dt;
            u.state = 'walk';
            u.animProgress += dt * (isHustling ? 4.5 : 3.0);
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
            if (u.team === 'player' && mine.x > 2800) continue;
            if (u.team === 'enemy' && mine.x < 2200) continue;

            const d = Math.abs(u.x - mine.x);
            if (d < bestDist) {
                bestDist = d;
                targetMine = mine;
            }
        }

        if (!targetMine) targetMine = this.goldMines[u.team === 'player' ? 0 : 5];

        const mineX = targetMine.x;
        const distToMine = Math.abs(u.x - mineX);

        if (distToMine > 20) {
            u.dir = mineX > u.x ? 1 : -1;
            u.x += u.dir * minerSpeed * 60 * dt;
            u.state = 'walk';
            u.animProgress += dt * (isHustling ? 4.5 : 3.0);
        } else {
            // At mine! Mine gold!
            const speedFactor = this.hasSkin(u, 'savage') ? 2.0 : 1.0;
            u.state = 'mine';
            u.animProgress += dt * (isHustling ? 4.5 : 2.8) * speedFactor;
            u.mineTimer += dt * (isHustling ? 1.6 : 1.0) * (1 + miningUpgradeBonus * 0.25) * speedFactor;
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
            const speedFactor = this.hasSkin(u, 'savage') ? 2.0 : 1.0;
            u.animProgress += dt * 3.5 * speedFactor;
            u.attackProgress += dt * 3.5 * speedFactor;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u, nearestTarget);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = def.attackCooldown / speedFactor;
                u.hasHitThisSwing = false;
            }
            return;
        }

        // Tactical Stance Logic: Mundur Masuk Menara Benteng (Pasukan bala bantuan asli tetap bertempur!)
        if (stance === 'retreat' && !u.neverGarrison) {
            if (u.garrisonCooldown > 0) u.garrisonCooldown -= dt;
            if (!u.garrisonCooldown || u.garrisonCooldown <= 0) {
                if (isPlayer && u.x <= 770) {
                    this.handleUnitGarrison(u);
                    return;
                } else if (!isPlayer && u.x >= 4230) {
                    this.handleUnitGarrison(u);
                    return;
                }
            }
            const garrisonX = isPlayer ? 750 : 4250;
            u.dir = garrisonX > u.x ? 1 : -1;
            u.x += u.dir * u.speed * 65 * dt;
            u.state = 'walk';
            u.animProgress += dt * 3.5;
            return;
        }

        // Defense stance line
        const defendLineX = isPlayer ? 1250 : 3750;

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

        // CHEAT: hittingmebro & heartnothave Interaction
        const attackerHas1Hit = (attacker && attacker.team === 'player' && this.cheats.hittingMeBro) || 
                                (attacker && attacker.team === 'enemy' && this.enemyCheats.hittingMeBro);
        const targetHasImmortal = (target.team === 'player' && this.cheats.heartNotHave) || 
                                  (target.team === 'enemy' && this.enemyCheats.heartNotHave);

        if (attackerHas1Hit && target.state !== 'dead') {
            if (targetHasImmortal) {
                // "tapi saat meggunakan pasukan tak pernah mati tetap pasukannya mati dengan 10 hit"
                target.immortalHits = (target.immortalHits || 0) + 1;
                this.triggerScreenShake(0.2, 5);
                this.createSparks(target.x, target.y - 40, '#ffd700', 8);
                if (target.immortalHits < 10) {
                    this.showFloatingText(target.x, target.y - 75, `💔 HIT ${target.immortalHits}/10 (hittingmebro)`, '#fbbf24');
                    target.hp = Math.max(1, target.maxHp * (1 - target.immortalHits / 10));
                    return;
                } else {
                    // Hit ke-10 tembus! Unit mati!
                    this.showFloatingText(target.x, target.y - 85, '💥 10 HIT TEMBUS! GUGUR!', '#ef4444');
                    this.triggerScreenShake(0.45, 9);
                    this.createShockwave(target.x, target.y);
                    this.killUnit(target, attacker ? attacker.dir : 1);
                    return;
                }
            } else {
                // "satu kali hit ke musuh dan mati"
                this.showFloatingText(target.x, target.y - 75, '💀 1-HIT KILL! (hittingmebro)', '#ef4444');
                this.triggerScreenShake(0.35, 7);
                this.createSparks(target.x, target.y - 40, '#ef4444', 12);
                this.killUnit(target, attacker ? attacker.dir : 1);
                return;
            }
        }

        if (targetHasImmortal && target.state !== 'dead') {
            // Serangan biasa tidak akan pernah membunuh unit ini
            this.showFloatingText(target.x, target.y - 65, '❤️ IMMORTAL (heartnothave)', '#22c55e');
            this.createSparks(target.x, target.y - 30, '#10b981', 6);
            target.hp = target.maxHp;
            return;
        }

        // Controlled Troop Multiplier: "dan saat mengontrolkan pasukan dan musuh menerima damage akan X2 damage tersebut"
        const isAttackerControlled = attacker && (attacker.isControlled || attacker.isEnemyControlled || (attacker.team === 'player' && this.controlledUnit === attacker));
        if (isAttackerControlled && target.state !== 'dead') {
            finalDamage = Math.round(finalDamage * 2);
            this.showFloatingText(target.x, target.y - 85, '💥 X2 DAMAGE!', '#ffd700');
            if (window.soundCtrl) window.soundCtrl.playCriticalHit();
            this.triggerScreenShake(0.18, 5);
            this.createSparks(target.x, target.y - 40, '#ffd700', 8);
        }

        // VOLTAIC SHOCK VULNERABILITY: "saat kena listrik akan menerima 1.5x damage tersebut"
        if (target && target.electrifiedTimer > 0 && target.state !== 'dead') {
            finalDamage = Math.round(finalDamage * 1.5);
            this.showFloatingText(target.x, target.y - 80, '⚡ 1.5X SENGATAN LISTRIK!', '#38bdf8');
            this.createSparks(target.x, target.y - 35, '#00e5ff', 9);
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

        // Elemental Skins Effects (Fire, Ice, Bomb, Vampire)
        // Elemental Skins Effects (Fire, Ice, Bomb, Vampire, Savage - Supports Mix Skin!)
        // FIRE SKIN ATTACK: "skin api memiliki efek bakar yaitu 10 kerusakan"
        if (this.hasSkin(attacker, 'fire') && target.state !== 'dead') {
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
        if (this.hasSkin(attacker, 'ice') && target.state !== 'dead') {
            target.chilledTimer = 2.5;
            this.createSparks(target.x, target.y - 30, '#00f0ff', 7);
            this.showFloatingText(target.x, target.y - 50, 'CHILLED ❄️', '#38bdf8');
        }

        // VAMPIRE SKIN ATTACK: "saat memukul musuh dan nyawa pasukan kita menipis saat memukul akan x2 kan, dan lifesteal"
        if (this.hasSkin(attacker, 'vampire') && target.state !== 'dead') {
            const isLowHp = attacker && attacker.hp <= (attacker.maxHp * 0.45);
            if (isLowHp) {
                finalDamage = Math.round(finalDamage * 2);
                this.showFloatingText(attacker.x, attacker.y - 75, '🧛 2X VAMPIRE CRIT!', '#e11d48');
                if (window.soundCtrl) window.soundCtrl.playVampireBite();
                this.triggerScreenShake(0.2, 5);
            }
            // Lifesteal heal
            const healVal = Math.max(5, Math.round(finalDamage * 0.35));
            attacker.hp = Math.min(attacker.maxHp, attacker.hp + healVal);
            this.showFloatingText(attacker.x, attacker.y - 45, `+${healVal} HP 🩸`, '#22c55e');
            this.createSparks(attacker.x, attacker.y - 30, '#be123c', 8);
        }

        // SAVAGE SKIN ATTACK: "efeknya melakukan pemukulan lebih cepat 2x speed"
        if (this.hasSkin(attacker, 'savage') && target.state !== 'dead') {
            this.createSparks(target.x, target.y - 30, '#10b981', 5);
            if (Math.random() < 0.35 || (attacker && attacker.isControlled)) {
                this.showFloatingText(attacker.x, attacker.y - 65, '⚡ 2X SPEED!', '#34d399');
            }
        }

        // VOLTAIC SKIN ATTACK: "skin voltaic saat pasukan kita memukul musuh akan mendapatkan efek listrik yaiitu 10 damage saat terkena pukulan dan hilangnnya sampai 10 detik saat kena listrik akan menerima 1.5x damage tersebut"
        if (this.hasSkin(attacker, 'voltaic') && target.state !== 'dead') {
            const shockDmg = 10;
            target.hp -= shockDmg;
            target.electrifiedTimer = 10.0;
            this.showFloatingText(target.x, target.y - 50, `⚡ LISTRIK -${shockDmg} (10s)`, '#38bdf8');
            this.createSparks(target.x, target.y - 30, '#00e5ff', 12);
            if (window.soundCtrl && window.soundCtrl.playElectricShock) window.soundCtrl.playElectricShock();
            if (attacker && attacker.team === 'player') {
                this.stats.damageDealt += shockDmg;
            }
            if (target.hp <= 0) {
                this.killUnit(target, attacker ? attacker.dir : 1);
                return;
            }
        }

        // Active Buff: Flame War Cry (All friendly troops burn targets)
        if (attacker && attacker.team === 'player' && this.spells.flameHelm && this.spells.flameHelm.activeTimer > 0) {
            target.burnTimer = 3.0;
            target.hp -= 12;
            this.showFloatingText(target.x, target.y - 45, '🔥 WAR CRY -12', '#ea580c');
            this.createSparks(target.x, target.y - 25, '#f97316', 6);
        }

        // Active Buff: Divine Shield Aegis (Reduces incoming damage by 70%)
        if (target.team === 'player' && this.spells.divineShield && this.spells.divineShield.activeTimer > 0) {
            finalDamage = Math.max(1, Math.round(finalDamage * 0.3));
            this.showFloatingText(target.x, target.y - 75, '🛡️ AEGIS -70%', '#38bdf8');
        }

        // Apply primary damage to target
        target.hp -= finalDamage;
        target.hurtTimer = 0.2;

        // RETALIATION ON RECEIVING DAMAGE:
        // FIRE SKIN: "dan saat terkena damage akan mendapatkan kerusakan 5 api"
        if (this.hasSkin(target, 'fire') && attacker && attacker.hp > 0 && attacker.team !== target.team) {
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
        if (this.hasSkin(target, 'ice') && attacker && attacker.hp > 0 && attacker.team !== target.team) {
            attacker.frozenTimer = 3.0;
            this.showFloatingText(attacker.x, attacker.y - 65, '❄️ MEMBEKU (3s)!', '#38bdf8');
            this.createSparks(attacker.x, attacker.y - 30, '#00f0ff', 14);
            if (window.soundCtrl) window.soundCtrl.playIceFreeze();
        }

        // VAMPIRE SKIN RETALIATION: saat menerima damage dan nyawa menipis, membalas hisap darah!
        if (this.hasSkin(target, 'vampire') && attacker && attacker.hp > 0 && attacker.team !== target.team) {
            if (target.hp <= target.maxHp * 0.45) {
                const retalDrain = Math.max(4, Math.round(finalDamage * 0.25));
                attacker.hp -= retalDrain;
                target.hp = Math.min(target.maxHp, target.hp + retalDrain);
                this.showFloatingText(target.x, target.y - 55, `🩸 SEDOT +${retalDrain}`, '#e11d48');
                if (attacker.hp <= 0) {
                    this.killUnit(attacker, target ? target.dir : 1);
                }
            }
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

        // BOMB SKIN ON DEATH: "skin ini saat mati menciptakan 3x3 area kena boom"
        if (this.hasSkin(unit, 'bomb')) {
            this.createExplosion(unit.x, unit.y - 30, 140, 75, unit.team);
        }

        if (unit.isControlled && unit.team === 'player') {
            this.deselectUnit();
            this.showToast('⭐ Komandan Pasukan Anda Telah Gugur! (Kembali ke Mode Normal)', 'warning');
        }

        if (unit.isEnemyControlled) {
            this.showToast('⭐ Komandan Pasukan Musuh Telah Gugur! (+300 Gold, +50 Gems)', 'gold');
            this.gold += 300;
            this.gems += 50;
            this.enemyControlledUnit = null;
            this.enemyControlCooldown = 12;
            this.updateUI(); // Fixed: was this.updateHUD() which caused game crash & freeze!
        }

        if (unit.team === 'enemy') {
            this.stats.enemiesKilled++;
            // Bounty reward
            const cost = this.unitDefs[unit.type] ? this.unitDefs[unit.type].cost : 100;
            const bounty = Math.round(cost * 0.35);
            this.gold += bounty;
            this.showFloatingText(unit.x, unit.y - 40, `+${bounty}G`, '#ffd700');
        }
    }

    createExplosion(x, y, radius, damage, sourceTeam) {
        if (window.soundCtrl) window.soundCtrl.playBombExplosion();
        this.triggerScreenShake(0.38, 9);
        this.createShockwave(x, this.groundY);
        this.createMagicExplosionParticles(x, y, '#f59e0b');
        this.showFloatingText(x, y - 50, `💥 BOOM 3x3! (-${damage})`, '#f97316');

        const enemyTeam = sourceTeam === 'player' ? 'enemy' : 'player';
        for (const target of this.units) {
            if (target.team === enemyTeam && target.state !== 'dead') {
                const dist = Math.hypot(target.x - x, (target.y - 30) - y);
                if (dist <= radius) {
                    this.dealDamage(target, damage, null);
                }
            }
        }

        const enemyStatue = sourceTeam === 'player' ? this.enemyStatue : this.playerStatue;
        if (Math.abs(enemyStatue.x - x) <= radius) {
            this.damageStatue(enemyStatue, damage);
        }
    }

    damageStatue(statue, dmg) {
        // CHEAT mymart: Patung pemain & musuh tak pernah hancur!
        if (statue.team === 'player' && this.cheats.statueInvulnerable) {
            this.showFloatingText(statue.x, this.groundY - 180, '🛡️ KEBAL (mymart)!', '#38bdf8');
            this.createSparks(statue.x, this.groundY - 90, '#38bdf8', 6);
            return;
        }
        if (statue.team === 'enemy' && this.enemyCheats.statueInvulnerable) {
            this.showFloatingText(statue.x, this.groundY - 180, '🛡️ KEBAL MUSUH (enemymart)!', '#ef4444');
            this.createSparks(statue.x, this.groundY - 90, '#ef4444', 6);
            return;
        }

        statue.hp = Math.max(0, statue.hp - dmg);
        this.triggerScreenShake(0.18, 5);
        this.createSparks(statue.x, this.groundY - 90, '#cbd5e0', 8);
        this.showFloatingText(statue.x, this.groundY - 180, `-${dmg}`, '#ef4444');

        this.checkStatueEmergencyReinforcements();
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

        // Enemy Spellcasting AI (Cerdik & Jenius dalam Mode Gila-Gilaan)
        if (this.enemySpellCooldown <= 0) {
            const enemyUnits = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
            const enemyCombat = enemyUnits.filter(u => u.type !== 'miner');
            const playerUnits = this.units.filter(u => u.team === 'player' && u.state !== 'dead');
            const playerCombat = playerUnits.filter(u => u.type !== 'miner');

            let spellToCast = null;
            if (this.enemyStatue.hp < this.enemyStatue.maxHp * 0.5) {
                spellToCast = (this.difficulty === 'insane' && Math.random() < 0.5) ? 'massMend' : 'healWave';
            } else if (playerCombat.some(u => u.x > 3200)) {
                // Pemain mendekati area markas musuh: musuh melepas badai / racun / panah api
                const dangerSpells = ['lightningStorm', 'arrowRain'];
                if (this.difficulty === 'insane') dangerSpells.push('toxicCloud', 'electricStorm');
                spellToCast = dangerSpells[Math.floor(Math.random() * dangerSpells.length)];
            } else if (this.enemyStance === 'attack') {
                const atkChoices = ['swordRage', 'trainingHaste'];
                if (this.difficulty === 'insane') atkChoices.push('flameHelm', 'divineShield');
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
                    massMend: 'Holy Mass Mend ✨',
                    arrowRain: 'Hujan Panah Api 🏹',
                    lightningStorm: 'Badai Petir Halilintar ⚡',
                    electricStorm: 'Golden Thunder ⚡',
                    toxicCloud: 'Kabut Racun Melumpuhkan ☣️',
                    swordRage: 'Sword Rage Membara ⚔️',
                    flameHelm: 'Flame War Cry 🔥',
                    divineShield: 'Divine Aegis Shield 🛡️',
                    trainingHaste: 'Training Haste ➰',
                    summonDead: 'Bangkitkan Mayat Hidup 💀',
                    summonMarrowkai: 'Titan Marrowkai ☠️'
                };
                this.showEnemySpellAlert(`⚠️ MUSUH MENGELUARKAN MANTRA: ${spellNames[spellToCast] || spellToCast}!`);
                const spellCdBase = (this.difficulty === 'insane') ? 18 : 38;
                const spellCdMin = (this.difficulty === 'insane') ? 8 : 14;
                this.enemySpellCooldown = Math.max(spellCdMin, spellCdBase - Math.min(20, this.currentLevel * 0.3));
            }
        }

        const aiInterval = this.difficulty === 'insane' ? 0.4 : (this.difficulty === 'hard' ? 0.75 : 1.2);
        if (this.enemyAiTimer < aiInterval) return;
        this.enemyAiTimer = 0;

        const enemyUnits = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
        const enemyMiners = enemyUnits.filter(u => u.type === 'miner');
        const enemyCombat = enemyUnits.filter(u => u.type !== 'miner');

        const playerUnits = this.units.filter(u => u.team === 'player' && u.state !== 'dead');
        const playerCombat = playerUnits.filter(u => u.type !== 'miner');

        const enemyDiscountMult = (this.enemyEquippedSkin === 'leaf') ? 0.5 : 1.0;
        // Train miners: musuh selalu menjaga minimal 5-6 penambang emas!
        const maxMiners = this.difficulty === 'insane' ? 6 : 5;
        const minerCost = Math.floor(150 * enemyDiscountMult);
        if (enemyMiners.length < maxMiners && this.enemyGold >= minerCost) {
            this.enemyGold -= minerCost;
            this.spawnUnit('miner', 'enemy', this.enemyStatue.x - 40);
            return;
        }

        // Strategic Pro Counter Recruitment (Gila-gilaan mode uses pro micro-counters)
        const recruitChoices = [];
        if (this.difficulty === 'insane') {
            const playerSpeartons = playerCombat.filter(u => u.type === 'spearton').length;
            const playerArchidons = playerCombat.filter(u => u.type === 'archidon').length;

            if (playerSpeartons >= 2 && this.enemyGold >= 800 * enemyDiscountMult) recruitChoices.push('magikill');
            if (playerSpeartons >= 2 && this.enemyGold >= 300 * enemyDiscountMult) recruitChoices.push('archidon');
            if (playerArchidons >= 2 && this.enemyGold >= 125 * enemyDiscountMult) recruitChoices.push('swordwrath');
            if (this.enemyGold >= 1800 * enemyDiscountMult) recruitChoices.push('marrowkai');
            if (this.enemyGold >= 1200 * enemyDiscountMult) recruitChoices.push('giant');
            if (this.enemyGold >= 500 * enemyDiscountMult) recruitChoices.push('spearton');
        }

        // Standard level-based pool
        if (recruitChoices.length === 0) {
            if (this.enemyGold >= 1800 * enemyDiscountMult && this.currentLevel >= 30) recruitChoices.push('marrowkai');
            if (this.enemyGold >= 1200 * enemyDiscountMult && this.currentLevel >= 5) recruitChoices.push('giant');
            if (this.enemyGold >= 800 * enemyDiscountMult && this.currentLevel >= 4) recruitChoices.push('magikill');
            if (this.enemyGold >= 500 * enemyDiscountMult && this.currentLevel >= 3) recruitChoices.push('spearton');
            if (this.enemyGold >= 300 * enemyDiscountMult && this.currentLevel >= 2) recruitChoices.push('archidon');
            if (this.enemyGold >= 140 * enemyDiscountMult && this.currentLevel >= 15) recruitChoices.push('undead');
            if (this.enemyGold >= 125 * enemyDiscountMult) recruitChoices.push('swordwrath');
        }

        if (recruitChoices.length > 0 && enemyUnits.length < this.maxPopulation) {
            const chosen = recruitChoices[Math.floor(Math.random() * recruitChoices.length)];
            const def = this.unitDefs[chosen];
            const enemyUnitCost = Math.floor(def.cost * enemyDiscountMult);
            if (this.enemyGold >= enemyUnitCost) {
                this.enemyGold -= enemyUnitCost;
                this.spawnUnit(chosen, 'enemy', this.enemyStatue.x - 60);
            }
        }

        // Strategic Stance Management (Mode Gila-Gilaan: AI Jenius bisa mundur taktis & serangan balik kilat)
        const prevEnemyStance = this.enemyStance;
        if (this.enemyStatue.hp < 400 && enemyCombat.length <= 2) {
            this.enemyStance = 'retreat';
        } else if (this.difficulty === 'insane') {
            // Evaluasi cerdik & jenius di mode gila-gilaan:
            const underHeavyThreat = playerCombat.some(u => u.x > 3300) && (enemyCombat.length < playerCombat.length * 0.7);
            const statueCritical = this.enemyStatue.hp < this.enemyStatue.maxHp * 0.55 && playerCombat.some(u => u.x > 3500);

            if ((underHeavyThreat || statueCritical) && enemyCombat.length <= 3) {
                // Taktik Mundur Jenius ke benteng untuk garrison & memicu 4 pemanah kastil
                if (this.enemyStance !== 'retreat') {
                    this.enemyStance = 'retreat';
                    this.showToast('🧠 [AI JENIUS MUSUH] Membaca Ancaman! Taktik Mundur ke Benteng & Pasang Perangkap Pemanah!', 'danger');
                    this.showEnemySpellAlert('⚠️ MUSUH MUNDUR TAKTIS KE BENTENG UNTUK MEMICU PEMANAH MENARA!');
                    if (this.enemySpellCooldown <= 3) {
                        this.castSpell('healWave', 'enemy');
                    }
                }
            } else if (this.enemyStance === 'retreat') {
                // Selesai mundur saat pasukan sudah terhimpun kuat (>= 4 atau seimbang), serang balik kilat!
                if (enemyCombat.length >= 4 || enemyCombat.length >= playerCombat.length || !playerCombat.some(u => u.x > 3200)) {
                    this.enemyStance = 'attack';
                    this.releaseGarrisonedUnits('enemy');
                    this.showToast('⚡ [AI JENIUS MUSUH] SERANGAN BALIK KILAT! Pasukan keluar serempak dari benteng!', 'warning');
                    if (this.enemySpellCooldown <= 3) {
                        this.castSpell('swordRage', 'enemy');
                    }
                }
            } else {
                // Attack jika pasukan cukup, Defend jika formasi belum matang
                this.enemyStance = (enemyCombat.length >= 3 && enemyCombat.length >= playerCombat.length) ? 'attack' : 'defend';
            }
        } else if (enemyCombat.length >= 4 + Math.min(10, Math.floor(this.currentLevel * 0.15)) || enemyCombat.length > playerCombat.length * 1.3) {
            this.enemyStance = 'attack';
        } else {
            this.enemyStance = 'defend';
        }

        if (prevEnemyStance === 'retreat' && (this.enemyStance === 'attack' || this.enemyStance === 'defend')) {
            this.releaseGarrisonedUnits('enemy');
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
            const speedFactor = this.hasSkin(u, 'savage') ? 2.0 : 1.0;
            u.animProgress += dt * 3.8 * speedFactor;
            u.attackProgress += dt * 3.8 * speedFactor;
            if (u.attackProgress >= 0.5 && !u.hasHitThisSwing) {
                this.executeAttack(u, targetGoal);
                u.hasHitThisSwing = true;
            }
            if (u.attackProgress >= 1.0) {
                u.state = 'idle';
                u.attackProgress = 0;
                u.attackTimer = (def.attackCooldown * 0.85) / speedFactor; // Pro attack recovery
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

        this.checkStatueEmergencyReinforcements();

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

    createDustPuff(x, y) {
        if (!this.particles) return;
        for (let i = 0; i < 2; i++) {
            this.particles.push({
                x: x + (Math.random() - 0.5) * 8,
                y: y - Math.random() * 3,
                vx: (Math.random() - 0.5) * 20,
                vy: -Math.random() * 12 - 4,
                gravity: 30,
                color: 'rgba(214, 180, 140, 0.5)',
                size: 2.5 + Math.random() * 2,
                alpha: 0.6,
                decay: 2.2
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

        // Particle and text capping for smooth 60fps on low-end mobile devices
        const maxParticles = this.isHD ? 120 : 65;
        if (this.particles.length > maxParticles) {
            this.particles.splice(0, this.particles.length - maxParticles);
        }
        if (this.floatingTexts.length > 25) {
            this.floatingTexts.splice(0, this.floatingTexts.length - 25);
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
        this.drawCastle(750, this.groundY, 'player');
        this.drawStatue(this.playerStatue);

        // Enemy Base & Castle
        this.drawCastle(4250, this.groundY, 'enemy');
        this.drawStatue(this.enemyStatue);
    }

    drawCastle(x, y, team) {
        const isPlayer = team === 'player';
        const skin = (isPlayer ? this.equippedSkin : (this.enemyCastleSkin || (this.difficulty === 'insane' ? 'fire' : 'classic'))) || 'classic';
        const ctx = this.ctx;
        ctx.save();

        // 1. Draw Castle Tower Body based on Equipped Skin
        if (skin === 'fire') {
            // FIRE SKIN: Obsidian Magma Fortress
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#ea580c';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Glowing Magma Cracks
            ctx.save();
            ctx.strokeStyle = '#ff6b00';
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x - 30, y - 160); ctx.lineTo(x - 10, y - 130); ctx.lineTo(x - 20, y - 90); ctx.lineTo(x - 5, y - 60);
            ctx.moveTo(x + 15, y - 170); ctx.lineTo(x + 28, y - 120); ctx.lineTo(x + 10, y - 80); ctx.lineTo(x + 25, y - 40);
            ctx.moveTo(x - 15, y - 110); ctx.lineTo(x + 5, y - 95); ctx.lineTo(x + 12, y - 50);
            ctx.stroke();
            ctx.restore();

            // Magma crenellations on top
            for (let i = -40; i <= 30; i += 24) {
                ctx.fillStyle = '#292524';
                ctx.fillRect(x + i, y - 195, 14, 16);
                ctx.strokeStyle = '#f97316';
                ctx.strokeRect(x + i, y - 195, 14, 16);
            }

            // Magma Cauldrons / Torches at left and right of battlements
            const flameWobble = Math.sin(Date.now() * 0.008) * 3;
            [-42, 34].forEach(bx => {
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(x + bx, y - 198, 10, 6);
                ctx.beginPath();
                ctx.moveTo(x + bx, y - 198);
                ctx.lineTo(x + bx + 5, y - 212 + flameWobble);
                ctx.lineTo(x + bx + 10, y - 198);
                ctx.fillStyle = '#ff6b00';
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(x + bx + 2, y - 198);
                ctx.lineTo(x + bx + 5, y - 208 + flameWobble * 0.7);
                ctx.lineTo(x + bx + 8, y - 198);
                ctx.fillStyle = '#fef08a';
                ctx.fill();
            });

            // Glowing Lava Gate
            ctx.fillStyle = '#7c2d12';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#f97316';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        } else if (skin === 'ice') {
            // ICE SKIN: Frost Cryo Glacier Citadel
            const iceGrad = ctx.createLinearGradient(x - 45, y - 180, x + 45, y);
            iceGrad.addColorStop(0, '#0284c7');
            iceGrad.addColorStop(0.5, '#38bdf8');
            iceGrad.addColorStop(1, '#0369a1');
            ctx.fillStyle = iceGrad;
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Crystalline highlights
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(x - 35, y - 170); ctx.lineTo(x - 10, y - 110); ctx.lineTo(x + 20, y - 130);
            ctx.moveTo(x + 10, y - 160); ctx.lineTo(x + 35, y - 70);
            ctx.moveTo(x - 30, y - 80); ctx.lineTo(x - 5, y - 30);
            ctx.stroke();

            // Ice crenellations on top
            for (let i = -40; i <= 30; i += 24) {
                ctx.fillStyle = '#7dd3fc';
                ctx.fillRect(x + i, y - 195, 14, 16);
                ctx.strokeStyle = '#e0f2fe';
                ctx.strokeRect(x + i, y - 195, 14, 16);
                // Icicles hanging down below crenellations
                ctx.beginPath();
                ctx.moveTo(x + i, y - 179);
                ctx.lineTo(x + i + 7, y - 165 + (Math.abs(i) % 7));
                ctx.lineTo(x + i + 14, y - 179);
                ctx.fillStyle = '#f0f9ff';
                ctx.fill();
            }

            // Translucent Ice Gate
            ctx.fillStyle = 'rgba(224, 242, 254, 0.45)';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#e0f2fe';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        } else if (skin === 'bomb') {
            // BOMB SKIN: Industrial Blast Bastion with hazard stripes and TNT
            ctx.fillStyle = '#334155';
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#1e293b';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Steel armor plates with rivets
            ctx.fillStyle = '#475569';
            ctx.fillRect(x - 40, y - 140, 80, 45);
            ctx.strokeRect(x - 40, y - 140, 80, 45);
            ctx.fillStyle = '#94a3b8';
            [-36, -12, 12, 34].forEach(rx => {
                ctx.beginPath(); ctx.arc(x + rx, y - 135, 2.5, 0, Math.PI * 2); ctx.fill();
                ctx.beginPath(); ctx.arc(x + rx, y - 100, 2.5, 0, Math.PI * 2); ctx.fill();
            });

            // Yellow-Black Hazard Stripes in middle
            ctx.save();
            ctx.beginPath();
            ctx.rect(x - 45, y - 85, 90, 20);
            ctx.clip();
            ctx.fillStyle = '#eab308';
            ctx.fillRect(x - 45, y - 85, 90, 20);
            ctx.fillStyle = '#0f172a';
            for (let hx = -60; hx <= 60; hx += 16) {
                ctx.beginPath();
                ctx.moveTo(x + hx, y - 85);
                ctx.lineTo(x + hx + 10, y - 85);
                ctx.lineTo(x + hx - 5, y - 65);
                ctx.lineTo(x + hx - 15, y - 65);
                ctx.fill();
            }
            ctx.restore();

            // Crenellations with hazard stripe tops
            for (let i = -40; i <= 30; i += 24) {
                ctx.fillStyle = '#1e293b';
                ctx.fillRect(x + i, y - 195, 14, 16);
                ctx.strokeStyle = '#eab308';
                ctx.strokeRect(x + i, y - 195, 14, 16);
            }

            // TNT Barrels on top battlements
            [-38, 22].forEach(tx => {
                ctx.fillStyle = '#dc2626';
                ctx.fillRect(x + tx, y - 206, 12, 12);
                ctx.strokeStyle = '#7f1d1d';
                ctx.strokeRect(x + tx, y - 206, 12, 12);
                ctx.fillStyle = '#fff';
                ctx.font = 'bold 7px sans-serif';
                ctx.fillText('TNT', x + tx + 1, y - 197);
            });

            // Heavy Iron Gate
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#eab308';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        } else if (skin === 'vampire') {
            // VAMPIRE SKIN: Gothic Dracula Spire with Blood Red Windows
            ctx.fillStyle = '#0f172a';
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Dark stone block textures
            ctx.strokeStyle = '#1e1b4b';
            ctx.lineWidth = 1.5;
            for (let ly = y - 160; ly <= y - 20; ly += 24) {
                ctx.beginPath(); ctx.moveTo(x - 45, ly); ctx.lineTo(x + 45, ly); ctx.stroke();
            }

            // Tall Gothic Arch Window glowing blood red
            ctx.fillStyle = '#881337';
            ctx.beginPath();
            ctx.moveTo(x - 10, y - 140);
            ctx.lineTo(x - 10, y - 100);
            ctx.lineTo(x + 10, y - 100);
            ctx.lineTo(x + 10, y - 140);
            ctx.arc(x, y - 140, 10, 0, Math.PI, true);
            ctx.fill();
            ctx.strokeStyle = '#e11d48';
            ctx.lineWidth = 1.5;
            ctx.stroke();
            // Iron cross bars on window
            ctx.beginPath();
            ctx.moveTo(x, y - 150); ctx.lineTo(x, y - 100);
            ctx.moveTo(x - 10, y - 120); ctx.lineTo(x + 10, y - 120);
            ctx.strokeStyle = '#000';
            ctx.stroke();

            // Gothic spiky crenellations on top
            for (let i = -40; i <= 30; i += 24) {
                ctx.fillStyle = '#18181b';
                ctx.fillRect(x + i, y - 195, 14, 16);
                ctx.strokeStyle = '#e11d48';
                ctx.strokeRect(x + i, y - 195, 14, 16);
                ctx.beginPath();
                ctx.moveTo(x + i + 2, y - 195);
                ctx.lineTo(x + i + 7, y - 205);
                ctx.lineTo(x + i + 12, y - 195);
                ctx.fillStyle = '#e11d48';
                ctx.fill();
            }

            // Hanging Crimson Lanterns
            ctx.save();
            ctx.fillStyle = '#be123c';
            ctx.shadowColor = '#e11d48';
            ctx.shadowBlur = 10;
            ctx.beginPath(); ctx.arc(x - 38, y - 170, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x + 38, y - 170, 4.5, 0, Math.PI * 2); ctx.fill();
            ctx.restore();

            // Gothic Spiked Gate
            ctx.fillStyle = '#18181b';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#e11d48';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        } else if (skin === 'savage') {
            // SAVAGE SKIN: Tribal Mammoth Bone Citadel with Tusks and Skull Totems
            ctx.fillStyle = '#291d14'; // primal dark wood / earth
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#78350f';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Spiked palisade timber logs
            ctx.strokeStyle = '#451a03';
            ctx.lineWidth = 2;
            for (let px = x - 35; px <= x + 35; px += 14) {
                ctx.beginPath();
                ctx.moveTo(px, y);
                ctx.lineTo(px, y - 180);
                ctx.stroke();
            }

            // Mammoth Tusks flanking the gate
            ctx.save();
            ctx.strokeStyle = '#f5f5f4';
            ctx.lineWidth = 4.5;
            ctx.beginPath();
            ctx.moveTo(x - 20, y);
            ctx.quadraticCurveTo(x - 38, y - 50, x - 26, y - 90);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + 20, y);
            ctx.quadraticCurveTo(x + 38, y - 50, x + 26, y - 90);
            ctx.stroke();
            ctx.restore();

            // Skull Totems with Glowing Emerald Eyes on battlements
            ctx.save();
            [-32, 0, 32].forEach(tx => {
                ctx.beginPath();
                ctx.arc(x + tx, y - 192, 7, 0, Math.PI * 2);
                ctx.fillStyle = '#f5f5f4';
                ctx.fill();
                ctx.strokeStyle = '#57534e';
                ctx.lineWidth = 1.2;
                ctx.stroke();

                // Emerald Eye
                ctx.beginPath();
                ctx.arc(x + tx, y - 192, 2.5, 0, Math.PI * 2);
                ctx.fillStyle = '#10b981';
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = 8;
                ctx.fill();
            });
            ctx.restore();

            // Bone Spiked Gate
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#10b981';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        } else {
            // CLASSIC SKIN: Stone Order of Inamorta Fortress
            ctx.fillStyle = '#2d3748';
            ctx.fillRect(x - 45, y - 180, 90, 180);
            ctx.strokeStyle = '#1a202c';
            ctx.lineWidth = 3;
            ctx.strokeRect(x - 45, y - 180, 90, 180);

            // Stone brick texture lines
            ctx.strokeStyle = '#1a202c';
            ctx.lineWidth = 1.2;
            for (let by = y - 160; by < y; by += 22) {
                ctx.beginPath(); ctx.moveTo(x - 45, by); ctx.lineTo(x + 45, by); ctx.stroke();
            }

            // Crenellations on top
            for (let i = -40; i <= 30; i += 24) {
                ctx.fillRect(x + i, y - 195, 14, 16);
                ctx.strokeRect(x + i, y - 195, 14, 16);
            }

            // Wooden Gate with iron bars
            ctx.fillStyle = '#78350f';
            ctx.fillRect(x - 16, y - 60, 32, 60);
            ctx.strokeStyle = '#475569';
            ctx.strokeRect(x - 16, y - 60, 32, 60);
        }

        // 2. Castle Banner & Flagpole (reflecting skin)
        let flagColor = isPlayer ? '#00e5ff' : '#ff3344';
        let flagSymbol = isPlayer ? '👑' : '💀';
        if (skin === 'fire') { flagColor = '#f97316'; flagSymbol = '🔥'; }
        else if (skin === 'ice') { flagColor = '#38bdf8'; flagSymbol = '❄️'; }
        else if (skin === 'bomb') { flagColor = '#eab308'; flagSymbol = '💣'; }
        else if (skin === 'vampire') { flagColor = '#e11d48'; flagSymbol = '🦇'; }
        else if (skin === 'savage') { flagColor = '#10b981'; flagSymbol = '🦴'; }

        // Flagpole
        ctx.beginPath();
        ctx.moveTo(x, y - 180);
        ctx.lineTo(x, y - 222);
        ctx.strokeStyle = (skin === 'bomb' ? '#64748b' : (skin === 'vampire' ? '#991b1b' : (skin === 'savage' ? '#10b981' : '#d69e2e')));
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Flag cloth waving
        const flagWave = Math.sin(Date.now() * 0.006) * 3;
        ctx.fillStyle = flagColor;
        ctx.beginPath();
        ctx.moveTo(x, y - 220);
        ctx.lineTo(x + (isPlayer ? 36 : -36), y - 208 + flagWave);
        ctx.lineTo(x, y - 196);
        ctx.closePath();
        ctx.fill();

        // Flag Symbol Icon
        ctx.font = '10px sans-serif';
        ctx.fillText(flagSymbol, x + (isPlayer ? 10 : -20), y - 205);

        // 3. Castle Archers (reflecting skin)
        const archerCount = this.castleArchers[team] ? (this.castleArchers[team].count || 0) : 0;
        const aY = y - 195;
        for (let i = 0; i < archerCount; i++) {
            const archerX = x - 26 + i * 16;
            const archerOffset = (i % 2) * 4;

            // Archer Head & Colors
            ctx.beginPath();
            ctx.arc(archerX, aY - 14 - archerOffset, 5, 0, Math.PI * 2);
            if (skin === 'fire') ctx.fillStyle = '#ff6b00';
            else if (skin === 'ice') ctx.fillStyle = '#00f0ff';
            else if (skin === 'bomb') ctx.fillStyle = '#f59e0b';
            else if (skin === 'vampire') ctx.fillStyle = '#e11d48';
            else if (skin === 'savage') ctx.fillStyle = '#10b981';
            else ctx.fillStyle = isPlayer ? '#00e5ff' : '#ff3344';
            ctx.fill();

            // Archer Torso
            ctx.fillRect(archerX - 2.5, aY - 9 - archerOffset, 5, 10);

            // Archer Eyes
            if (skin === 'vampire') {
                ctx.fillStyle = '#ff0000';
                ctx.beginPath(); ctx.arc(archerX + (isPlayer ? 2 : -2), aY - 14 - archerOffset, 1.2, 0, Math.PI * 2); ctx.fill();
            } else if (skin === 'savage') {
                ctx.fillStyle = '#34d399';
                ctx.beginPath(); ctx.arc(archerX + (isPlayer ? 2 : -2), aY - 14 - archerOffset, 1.2, 0, Math.PI * 2); ctx.fill();
            }

            // Bow Aiming Outward
            ctx.beginPath();
            ctx.arc(archerX + (isPlayer ? 5 : -5), aY - 5 - archerOffset, 7, -Math.PI * 0.35, Math.PI * 0.35);
            ctx.strokeStyle = (skin === 'ice' ? '#bae6fd' : (skin === 'fire' ? '#ff4500' : (skin === 'savage' ? '#10b981' : (skin === 'bomb' ? '#475569' : '#d97706'))));
            ctx.lineWidth = 1.8;
            ctx.stroke();
        }

        ctx.restore();
    }

    drawStatue(statue) {
        const sx = statue.x;
        const sy = statue.y;
        const isPlayer = statue.team === 'player';
        const hasLeafSkin = (isPlayer && this.hasSkin(null, 'leaf')) || (!isPlayer && this.enemyEquippedSkin === 'leaf');
        const hasVoltaicSkin = (isPlayer && this.hasSkin(null, 'voltaic')) || (!isPlayer && this.enemyEquippedSkin === 'voltaic');
        const eyeColor = hasVoltaicSkin ? '#38bdf8' : (hasLeafSkin ? '#86efac' : (isPlayer ? '#00e5ff' : '#ff3344'));

        this.ctx.save();
        if (hasVoltaicSkin) {
            this.drawVoltaicStatue(statue, sx, sy, isPlayer, eyeColor);
        } else if (hasLeafSkin) {
            this.drawLeafNatureStatue(statue, sx, sy, isPlayer, eyeColor);
        } else {
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
        }

        // Statue Health Bar
        const barW = 100;
        const barH = 10;
        const hpPct = Math.max(0, statue.hp / statue.maxHp);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(sx - barW / 2 - 2, sy - 265, barW + 4, barH + 4);
        this.ctx.fillStyle = isPlayer ? '#10b981' : '#ef4444';
        this.ctx.fillRect(sx - barW / 2, sy - 263, barW * hpPct, barH);

        // Statue Label
        this.ctx.font = 'bold 12px "Outfit", sans-serif';
        this.ctx.fillStyle = '#f7fafc';
        this.ctx.textAlign = 'center';
        const labelText = hasVoltaicSkin
            ? (isPlayer ? '⚡ PATUNG VOLTAIC KITA' : '⚡ PATUNG VOLTAIC MUSUH')
            : (hasLeafSkin 
                ? (isPlayer ? '🍃 PATUNG HUTAN KITA' : '🍃 PATUNG HUTAN MUSUH') 
                : (isPlayer ? 'PATUNG KITA' : 'PATUNG MUSUH'));
        this.ctx.fillText(labelText, sx, sy - 275);
        this.ctx.font = '10px "Outfit", sans-serif';
        this.ctx.fillText(`${Math.round(statue.hp)}/${statue.maxHp}`, sx, sy - 250);

        this.ctx.restore();
    }

    drawLeafNatureStatue(statue, sx, sy, isPlayer, eyeColor) {
        const ctx = this.ctx;

        // Ancient Sacred Mossy Stone Pedestal with Root Inlays
        ctx.fillStyle = '#1e3a1e';
        ctx.fillRect(sx - 48, sy - 32, 96, 32);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#15803d';
        ctx.strokeRect(sx - 48, sy - 32, 96, 32);

        // Moss Top Cap
        ctx.fillStyle = '#22c55e';
        ctx.beginPath();
        ctx.roundRect(sx - 48, sy - 35, 96, 6, 3);
        ctx.fill();

        // Statue Body: Ancient Petrified Oak Colossus
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#274427';

        // Legs
        ctx.beginPath();
        ctx.moveTo(sx - 16, sy - 32);
        ctx.lineTo(sx - 16, sy - 85);
        ctx.lineTo(sx, sy - 110);
        ctx.lineTo(sx + 16, sy - 85);
        ctx.lineTo(sx + 16, sy - 32);
        ctx.stroke();

        // Spine & Ribs
        ctx.beginPath();
        ctx.moveTo(sx, sy - 110);
        ctx.lineTo(sx, sy - 175);
        ctx.stroke();

        // Twisting Emerald Ivy Vines wrapping body & legs
        ctx.save();
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#4ade80';
        ctx.beginPath();
        ctx.moveTo(sx - 16, sy - 40);
        ctx.bezierCurveTo(sx - 8, sy - 60, sx - 20, sy - 80, sx - 4, sy - 105);
        ctx.bezierCurveTo(sx + 12, sy - 120, sx - 10, sy - 145, sx, sy - 175);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(sx + 16, sy - 38);
        ctx.bezierCurveTo(sx + 8, sy - 58, sx + 20, sy - 78, sx + 4, sy - 105);
        ctx.stroke();

        // Little leaves blooming along vines
        const vineLeaves = [
            { x: sx - 12, y: sy - 50, a: -0.4 },
            { x: sx - 15, y: sy - 75, a: 0.5 },
            { x: sx + 12, y: sy - 55, a: 0.4 },
            { x: sx + 15, y: sy - 70, a: -0.5 },
            { x: sx - 6, y: sy - 130, a: -0.6 },
            { x: sx + 8, y: sy - 150, a: 0.6 }
        ];
        ctx.fillStyle = '#22c55e';
        for (const vl of vineLeaves) {
            ctx.save();
            ctx.translate(vl.x, vl.y);
            ctx.rotate(vl.a);
            ctx.beginPath();
            ctx.ellipse(0, 0, 7, 3.5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();

        // Large Carved Head: Living Nature Colossus
        ctx.beginPath();
        ctx.arc(sx, sy - 198, 23, 0, Math.PI * 2);
        ctx.fillStyle = '#274427';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#15803d';
        ctx.stroke();

        // Majestic Leaf Crown / Wreath on Head
        ctx.save();
        ctx.fillStyle = '#4ade80';
        for (let i = -3; i <= 3; i++) {
            const angle = -Math.PI / 2 + (i * 0.28);
            const lx = sx + Math.cos(angle) * 24;
            const ly = (sy - 198) + Math.sin(angle) * 24;
            ctx.save();
            ctx.translate(lx, ly);
            ctx.rotate(angle + Math.PI / 2);
            ctx.beginPath();
            ctx.ellipse(0, 0, 8, 4, 0, 0, Math.PI * 2);
            ctx.fill();
            if (i === 0) {
                ctx.fillStyle = '#fef08a';
                ctx.beginPath();
                ctx.arc(0, -2, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        }
        ctx.restore();

        // Glowing Emerald Forest Eyes
        ctx.beginPath();
        ctx.arc(sx + (isPlayer ? 8 : -8), sy - 200, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#86efac';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 16;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Ancient Druid Glaive / Forest Tree Staff held high
        const staffX = sx + (isPlayer ? 28 : -28);
        ctx.save();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#15803d';
        ctx.beginPath();
        ctx.moveTo(staffX, sy - 40);
        ctx.lineTo(staffX, sy - 245);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#86efac';
        ctx.stroke();

        // Crystal Nature Core on top of staff
        ctx.beginPath();
        ctx.arc(staffX, sy - 250, 11, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(74, 222, 128, 0.85)';
        ctx.shadowColor = '#4ade80';
        ctx.shadowBlur = 20;
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3 Orbiting Leaf Runes around staff crystal
        for (let j = 0; j < 3; j++) {
            const orbAngle = (this.lastTime || 0) * 0.003 + (j * (Math.PI * 2 / 3));
            const ox = staffX + Math.cos(orbAngle) * 16;
            const oy = (sy - 250) + Math.sin(orbAngle) * 8;
            ctx.fillStyle = '#4ade80';
            ctx.beginPath();
            ctx.ellipse(ox, oy, 5, 2.5, orbAngle, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();

        // Floating Nature Petals at statue base
        ctx.save();
        for (let p = 0; p < 5; p++) {
            const petX = sx + Math.sin((this.lastTime || 0) * 0.0015 + p * 1.5) * 45;
            const petY = sy - 15 - (p * 5) - Math.cos((this.lastTime || 0) * 0.002 + p) * 8;
            ctx.fillStyle = (p % 2 === 0) ? '#4ade80' : '#86efac';
            ctx.beginPath();
            ctx.ellipse(petX, petY, 4, 2, p * 0.7, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    drawVoltaicStatue(statue, sx, sy, isPlayer, eyeColor) {
        const ctx = this.ctx;
        const now = Date.now();

        // 1. High-Voltage Obsidian & Slate Pedestal
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(sx - 48, sy - 32, 96, 32);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#0284c7';
        ctx.strokeRect(sx - 48, sy - 32, 96, 32);

        // Electric Capacitor Top Cap
        ctx.fillStyle = '#0369a1';
        ctx.beginPath();
        ctx.roundRect(sx - 48, sy - 36, 96, 6, 3);
        ctx.fill();

        // Glowing Cyan Circuit Inlays on Pedestal
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(sx - 36, sy - 16);
        ctx.lineTo(sx - 16, sy - 16);
        ctx.lineTo(sx - 8, sy - 24);
        ctx.lineTo(sx + 8, sy - 24);
        ctx.lineTo(sx + 16, sy - 16);
        ctx.lineTo(sx + 36, sy - 16);
        ctx.stroke();
        ctx.restore();

        // 2. Colossus Body: Dark High-Voltage Alloy
        ctx.lineWidth = 15;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#1e293b';

        // Legs
        ctx.beginPath();
        ctx.moveTo(sx - 16, sy - 34);
        ctx.lineTo(sx - 16, sy - 85);
        ctx.lineTo(sx, sy - 110);
        ctx.lineTo(sx + 16, sy - 85);
        ctx.lineTo(sx + 16, sy - 34);
        ctx.stroke();

        // Spine
        ctx.beginPath();
        ctx.moveTo(sx, sy - 110);
        ctx.lineTo(sx, sy - 175);
        ctx.stroke();

        // Voltaic Plasma Core in Chest
        const pulse = Math.sin(now * 0.008) * 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(sx, sy - 145, 10 + pulse, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.restore();

        // Lightning Spark Arcs between legs and body
        ctx.save();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;
        for (let a = 0; a < 2; a++) {
            const arcOff = (a === 0 ? -12 : 12);
            ctx.beginPath();
            ctx.moveTo(sx + arcOff, sy - 50);
            ctx.lineTo(sx + arcOff + (Math.sin(now * 0.02 + a) * 6), sy - 70);
            ctx.lineTo(sx + arcOff, sy - 90);
            ctx.stroke();
        }
        ctx.restore();

        // 3. Colossus Head & Voltaic Crest
        ctx.beginPath();
        ctx.arc(sx, sy - 198, 23, 0, Math.PI * 2);
        ctx.fillStyle = '#0f172a';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#0284c7';
        ctx.stroke();

        // Twin Tesla Horns / Spikes on Head
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;
        // Left Horn
        ctx.beginPath();
        ctx.moveTo(sx - 14, sy - 212);
        ctx.lineTo(sx - 26, sy - 232);
        ctx.lineTo(sx - 34, sy - 228);
        ctx.stroke();
        // Right Horn
        ctx.beginPath();
        ctx.moveTo(sx + 14, sy - 212);
        ctx.lineTo(sx + 26, sy - 232);
        ctx.lineTo(sx + 34, sy - 228);
        ctx.stroke();
        ctx.restore();

        // Glowing High-Voltage Electric Eyes
        ctx.beginPath();
        ctx.arc(sx + (isPlayer ? 8 : -8), sy - 200, 5, 0, Math.PI * 2);
        ctx.fillStyle = eyeColor;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.shadowBlur = 0;

        // 4. Gigantic Tesla Lightning Spire / Rod held high
        const spireX = sx + (isPlayer ? 28 : -28);
        ctx.save();
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#0369a1';
        ctx.beginPath();
        ctx.moveTo(spireX, sy - 40);
        ctx.lineTo(spireX, sy - 245);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#38bdf8';
        ctx.stroke();

        // Tesla High-Voltage Plasma Orb atop Spire
        ctx.beginPath();
        ctx.arc(spireX, sy - 250, 12, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(56, 189, 248, 0.95)';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 24;
        ctx.fill();
        ctx.strokeStyle = '#f0fdf4';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.shadowBlur = 0;

        // 3 Orbiting High-Voltage Rings around Spire Orb
        for (let j = 0; j < 3; j++) {
            const ringAngle = (now * 0.003) + (j * (Math.PI * 2 / 3));
            const ox = spireX + Math.cos(ringAngle) * 17;
            const oy = (sy - 250) + Math.sin(ringAngle) * 9;
            ctx.fillStyle = '#facc15';
            ctx.shadowColor = '#facc15';
            ctx.shadowBlur = 8;
            ctx.beginPath();
            ctx.arc(ox, oy, 3.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
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
        if (!this.running) {
            this.isLoopRunning = false;
            return;
        }

        try {
            const now = typeof timestamp === 'number' ? timestamp : performance.now();
            if (!this.lastTime || isNaN(this.lastTime) || this.lastTime <= 0) {
                this.lastTime = now;
            }
            let dt = (now - this.lastTime) / 1000;
            if (isNaN(dt) || dt <= 0 || dt > 0.5) dt = 0.016;
            dt = Math.min(0.05, dt);
            this.lastTime = now;

            this.update(dt);
            this.render();
        } catch (err) {
            console.error("Game loop error safely handled:", err);
        }

        if (this.running) {
            requestAnimationFrame((t) => this.gameLoop(t));
        } else {
            this.isLoopRunning = false;
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
        const garrisonPop = (this.garrisonedUnits && this.garrisonedUnits.player) ? this.garrisonedUnits.player.length : 0;
        const currentPop = this.units.filter(u => u.team === 'player' && u.state !== 'dead').length + garrisonPop;
        const pArchers = this.castleArchers?.player?.count || 0;
        if (popEl) {
            popEl.innerText = `${currentPop}/${this.maxPopulation}${pArchers > 0 ? ` (🏹 ${pArchers}/4)` : ''}`;
        }
        this.updateCastleUI();

        // Statue Health Percentages
        const pStatueBar = document.getElementById('player-statue-bar');
        const pStatueText = document.getElementById('player-statue-hp');
        if (pStatueBar && pStatueText) {
            const pct = Math.max(0, (this.playerStatue.hp / this.playerStatue.maxHp) * 100);
            pStatueBar.style.width = `${pct}%`;
            pStatueText.innerText = `${Math.round(this.playerStatue.hp)} HP`;
        }

        // Tombol Darurat Bala Bantuan Kerajaan (< 1000 HP)
        const emergencyCallBtn = document.getElementById('btn-call-reinforcements');
        if (emergencyCallBtn) {
            if (!this.playerEmergencyTriggered && this.playerStatue && this.playerStatue.hp < 1000 && this.playerStatue.hp > 0) {
                emergencyCallBtn.classList.remove('hidden');
            } else {
                emergencyCallBtn.classList.add('hidden');
            }
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
                const effectiveCost = this.hasSkin(null, 'leaf') ? Math.floor(this.unitDefs[type].cost * 0.5) : this.unitDefs[type].cost;
                const canAfford = this.cheats.infiniteGold || (this.gold >= effectiveCost);
                const isCooldown = !this.cheats.noCooldown && cd > 0;
                btn.classList.toggle('disabled', !canAfford || isCooldown);

                const costEl = btn.querySelector('.unit-cost');
                if (costEl) {
                    if (this.hasSkin(null, 'leaf')) {
                        costEl.innerText = `🪙 ${effectiveCost} (🍃-50%)`;
                    } else {
                        costEl.innerText = `🪙 ${this.unitDefs[type].cost}`;
                    }
                }
            }
        }
    }

    updateHUD() {
        this.updateUI();
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

    castSpell(spellId, team = 'player', isFree = false) {
        const isPlayer = team === 'player';
        const spell = this.spells[spellId];
        if (!spell && isPlayer) return;

        if (isPlayer && !this.cheats.infiniteSpells && !isFree) {
            if (spell.stock <= 0) {
                this.showToast(`⚠️ Stok spell ${spell.name} habis!`, 'warning');
                return;
            }
            if (spell.cooldown > 0) {
                this.showToast(`⏳ Cooldown ${spell.name}: ${Math.ceil(spell.cooldown)}s`, 'warning');
                return;
            }
        }

        // Consume stock & set cooldown for player (hanya jika bukan mantra bantuan darurat gratis)
        if (isPlayer && !this.cheats.infiniteSpells && !isFree) {
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

            const minX = isPlayer ? Math.max(this.playerStatue.x + 300, this.cameraX) : 750;
            const maxX = isPlayer ? Math.min(this.enemyStatue.x + 200, this.cameraX + this.viewWidth + 400) : 2600;
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
            const minX = isPlayer ? Math.max(this.playerStatue.x + 200, this.cameraX) : 750;
            const maxX = isPlayer ? Math.min(this.enemyStatue.x + 200, this.cameraX + this.viewWidth + 300) : 2600;

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
        } else if (spellId === 'flameHelm') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playFireBurn();
            this.triggerScreenShake(0.35, 6);
            if (isPlayer) this.showToast('🔥 SPELL: Flame War Cry! Seluruh pasukan membara kobaran api (+12 Burn)!', 'gold');
            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    u.burnTimer = 4.0;
                    this.createMagicExplosionParticles(u.x, u.y - 35, '#ff4500');
                    this.showFloatingText(u.x, u.y - 55, '🔥 WAR CRY', '#ff6b00');
                }
            }
        } else if (spellId === 'divineShield') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playDivineShield();
            this.triggerScreenShake(0.4, 7);
            if (isPlayer) this.showToast('🛡️ SPELL: Divine Aegis! Kubah perlindungan suci meredam 70% damage musuh!', 'info');
            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    this.createMagicExplosionParticles(u.x, u.y - 35, '#38bdf8');
                    this.showFloatingText(u.x, u.y - 55, '🛡️ AEGIS SHIELD', '#38bdf8');
                }
            }
        } else if (spellId === 'archidonFury') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playBowShoot();
            if (isPlayer) this.showToast('🏹 SPELL: Archidon Volley! Pemanah menembakkan 3 panah serentak!', 'gold');
            for (const u of this.units) {
                if (u.team === team && u.type === 'archidon' && u.state !== 'dead') {
                    this.createSparks(u.x, u.y - 40, '#ffd700', 8);
                    this.showFloatingText(u.x, u.y - 60, '🏹 TRIPLE SHOT', '#ffd700');
                }
            }
        } else if (spellId === 'massMend') {
            if (window.soundCtrl) window.soundCtrl.playSpellHeal();
            if (isPlayer) this.showToast('✨ SPELL: Holy Cross Mass Mend! Seluruh pasukan disembuhkan +350 HP!', 'success');
            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    u.hp = Math.min(u.maxHp, u.hp + 350);
                    u.burnTimer = 0;
                    u.frozenTimer = 0;
                    u.chilledTimer = 0;
                    this.createMagicExplosionParticles(u.x, u.y - 35, '#22c55e');
                    this.showFloatingText(u.x, u.y - 50, '+350 HP ✨', '#22c55e');
                }
            }
            const statue = isPlayer ? this.playerStatue : this.enemyStatue;
            statue.hp = Math.min(statue.maxHp, statue.hp + 350);
        } else if (spellId === 'speartonPhalanx') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            if (isPlayer) this.showToast('🔱 SPELL: Spearton Phalanx! Formasi perisai baja kebal & memantulkan serangan!', 'info');
            for (const u of this.units) {
                if (u.team === team && u.type === 'spearton' && u.state !== 'dead') {
                    u.isManualBlock = true;
                    this.createSparks(u.x, u.y - 40, '#d97706', 10);
                    this.showFloatingText(u.x, u.y - 65, '🔱 PHALANX', '#fbbf24');
                }
            }
        } else if (spellId === 'sprintHaste') {
            if (isPlayer) spell.activeTimer = spell.duration;
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            if (isPlayer) this.showToast('🏃 SPELL: Wind Sprint! Pasukan bergerak secepat kilat (+90% Speed)!', 'info');
            for (const u of this.units) {
                if (u.team === team && u.state !== 'dead') {
                    this.createSparks(u.x, u.y - 20, '#34d399', 6);
                    this.showFloatingText(u.x, u.y - 50, '⚡ SPRINT', '#34d399');
                }
            }
        } else if (spellId === 'toxicCloud') {
            if (window.soundCtrl) window.soundCtrl.playToxicPoison();
            this.triggerScreenShake(0.3, 5);
            if (isPlayer) this.showToast('☣️ SPELL: Toxic Mist! Kabut racun hijau melumpuhkan pasukan musuh!', 'danger');
            const oppTeam = isPlayer ? 'enemy' : 'player';
            for (const u of this.units) {
                if (u.team === oppTeam && u.state !== 'dead') {
                    u.burnTimer = 5.0;
                    u.chilledTimer = 5.0;
                    u.hp -= 40;
                    this.createMagicExplosionParticles(u.x, u.y - 30, '#10b981');
                    this.showFloatingText(u.x, u.y - 55, '☣️ POISON -40', '#10b981');
                }
            }
        } else if (spellId === 'royalCrown') {
            if (window.soundCtrl) window.soundCtrl.playSpellSummon();
            this.triggerScreenShake(0.5, 8);
            if (isPlayer) this.showToast('👑 SPELL: Royal King Champion! Panglima emas bermahkota turun ke medan laga!', 'gold');
            const spawnX = isPlayer ? (this.playerStatue.x + 100) : (this.enemyStatue.x - 100);
            const champ = this.spawnUnit('spearton', team, spawnX);
            if (champ) {
                champ.maxHp = 1400;
                champ.hp = 1400;
                champ.isGolden = true;
                champ.scale = 1.35;
                this.createMagicExplosionParticles(champ.x, champ.y - 45, '#ffd700');
                this.showFloatingText(champ.x, champ.y - 80, '👑 ROYAL CHAMPION', '#ffd700');
            }
        } else if (spellId === 'undeadHorde') {
            if (window.soundCtrl) window.soundCtrl.playSpellDead();
            this.triggerScreenShake(0.5, 8);
            if (isPlayer) this.showToast('💀 SPELL: Undead Horde! Kawanan 5 tengkorak mayat hidup bangkit serentak!', 'success');
            const baseX = isPlayer ? (this.playerStatue.x + 90) : (this.enemyStatue.x - 90);
            for (let i = 0; i < 5; i++) {
                setTimeout(() => {
                    if (!this.running) return;
                    const x = baseX + (isPlayer ? 1 : -1) * (i * 30);
                    const undead = this.spawnUnit('undead', team, x);
                    if (undead) {
                        this.createMagicExplosionParticles(undead.x, undead.y - 30, '#059669');
                        this.showFloatingText(undead.x, undead.y - 55, '💀 SKELETON', '#10b981');
                    }
                }, i * 70);
            }
        } else if (spellId === 'electricStorm') {
            if (window.soundCtrl) window.soundCtrl.playSpellMarrowkai();
            this.triggerScreenShake(0.7, 10);
            if (isPlayer) this.showToast('⚡ SPELL: Golden Thunder! Sambaran petir emas dahsyat membakar musuh!', 'gold');
            const minX = isPlayer ? Math.max(this.playerStatue.x + 200, this.cameraX) : 750;
            const maxX = isPlayer ? Math.min(this.enemyStatue.x + 200, this.cameraX + this.viewWidth + 300) : 2600;
            for (let i = 0; i < 10; i++) {
                setTimeout(() => {
                    if (!this.running) return;
                    const strikeX = minX + Math.random() * (maxX - minX);
                    this.particles.push({
                        type: 'lightning',
                        x: strikeX,
                        y: 0,
                        targetY: this.groundY,
                        alpha: 1.0,
                        decay: 4.0
                    });
                    this.createShockwave(strikeX, this.groundY);
                    this.createSparks(strikeX, this.groundY - 20, '#ffd700', 12);
                    const oppTeam = isPlayer ? 'enemy' : 'player';
                    for (const u of this.units) {
                        if (u.team === oppTeam && u.state !== 'dead') {
                            if (Math.abs(u.x - strikeX) < 110) {
                                this.dealDamage(u, 90);
                                u.x += (u.x > strikeX ? 1 : -1) * 35;
                            }
                        }
                    }
                }, i * 140);
            }
        }

        if (isPlayer) this.updateSpellUI();
    }

    toggleSpellPage() {
        this.spellPage = this.spellPage === 1 ? 2 : 1;
        this.updateSpellUI();
        if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        this.showToast(`🔮 Halaman Mantra ${this.spellPage}/2 (Gunakan tombol > atau tekan P)`);
    }

    toggleSpellTray() {
        this.spellTrayCollapsed = !this.spellTrayCollapsed;
        const hud = document.getElementById('spells-hud');
        const btn = document.getElementById('btn-spell-toggle');
        if (hud) hud.classList.toggle('collapsed', this.spellTrayCollapsed);
        if (btn) {
            btn.innerText = this.spellTrayCollapsed ? '▲' : '▼';
            btn.title = this.spellTrayCollapsed ? 'Tampilkan Rak Mantra (Panah Atas)' : 'Sembunyikan Rak Mantra (Panah Bawah)';
        }
        if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        this.showToast(this.spellTrayCollapsed ? '🔽 Rak Mantra Disembunyikan (Klik ▲ untuk membuka kembali)' : '🔼 Rak Mantra Ditampilkan!');
    }

    updateSpellUI() {
        const page1Ids = ['minerHustle', 'arrowRain', 'healWave', 'swordRage', 'goldenSpearton', 'trainingHaste', 'lightningStorm', 'summonDead', 'goldRush', 'summonMarrowkai'];
        const page2Ids = ['flameHelm', 'divineShield', 'archidonFury', 'massMend', 'speartonPhalanx', 'sprintHaste', 'toxicCloud', 'royalCrown', 'undeadHorde', 'electricStorm'];
        const activeIds = this.spellPage === 1 ? page1Ids : page2Ids;

        // "saat memakai skin spellnya juga ikut terpasang skinnya"
        const activeSkin = (this.mixSkinUnlocked && Array.isArray(this.equippedSkins) && this.equippedSkins.length > 0)
            ? this.equippedSkins[0]
            : (this.equippedSkin || 'classic');

        const spellsHud = document.getElementById('spells-hud');
        if (spellsHud) {
            ['classic', 'fire', 'ice', 'bomb', 'vampire', 'savage', 'leaf', 'voltaic'].forEach(s => {
                spellsHud.classList.remove(`spell-skin-${s}`);
            });
            spellsHud.classList.add(`spell-skin-${activeSkin}`);
        }

        const skinIcons = {
            classic: '🛡️',
            fire: '🔥',
            ice: '❄️',
            bomb: '💣',
            vampire: '🩸',
            savage: '🦴',
            leaf: '🍃',
            voltaic: '⚡'
        };

        // Update page button label
        const pageBtn = document.getElementById('btn-spell-page');
        if (pageBtn) {
            pageBtn.innerText = this.spellPage === 1 ? '▶' : '◀';
            pageBtn.title = `Ganti ke Halaman ${this.spellPage === 1 ? '2' : '1'} Mantra (Tekan P)`;
        }
        const pageIndicator = document.getElementById('spell-page-indicator');
        if (pageIndicator) {
            pageIndicator.innerText = `HAL ${this.spellPage}/2`;
        }

        for (const k in this.spells) {
            const spell = this.spells[k];
            const card = document.getElementById(`spell-${spell.id}`);
            if (!card) continue;

            // Toggle card visibility based on active page
            if (activeIds.includes(spell.id)) {
                card.classList.remove('hidden-by-page');
            } else {
                card.classList.add('hidden-by-page');
            }

            // Skin theme badge on spell orb card
            let skinBadge = card.querySelector('.orb-skin-badge');
            if (!skinBadge) {
                skinBadge = document.createElement('span');
                skinBadge.className = 'orb-skin-badge';
                card.appendChild(skinBadge);
            }
            skinBadge.innerText = skinIcons[activeSkin] || '✨';
            skinBadge.title = `Mantra mengadopsi aura Skin: ${activeSkin.toUpperCase()}`;

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

    setCheatTarget(target) {
        this.cheatTarget = target || 'player'; // 'player', 'enemy', 'both'
        const names = {
            player: '👑 PEMAIN (KITA)',
            enemy: '💀 MUSUH',
            both: '⚔️ KEDUANYA (PEMAIN & MUSUH)'
        };
        this.showToast(`🎯 Target Kode: ${names[this.cheatTarget] || this.cheatTarget}`, 'gold');
        this.updateCheatUI();
    }

    applyCheat(code) {
        let clean = (code || '').toLowerCase().trim();
        if (!clean) return false;

        // Cek prefix eksplisit enemy / player
        let target = this.cheatTarget || 'player';
        if (clean.startsWith('enemy')) {
            target = 'enemy';
            clean = clean.replace(/^enemy/, '');
        } else if (clean.startsWith('player')) {
            target = 'player';
            clean = clean.replace(/^player/, '');
        }

        const isPlayerTarget = target === 'player' || target === 'both';
        const isEnemyTarget = target === 'enemy' || target === 'both';

        // 1. heartnothave / 1heartnothave: Semua pasukan tak pernah mati
        if (clean === 'heartnothave' || clean === '1heartnothave' || clean === '1.heartnothave') {
            if (target === 'both') {
                const newState = !this.cheats.heartNotHave;
                this.cheats.heartNotHave = newState;
                this.enemyCheats.heartNotHave = newState;
                if (newState) {
                    for (const u of this.units) { if (u.state !== 'dead') { u.hp = u.maxHp; u.immortalHits = 0; } }
                    if (window.soundCtrl) window.soundCtrl.playSpellSummon();
                    this.showToast('❤️⚔️ CHEAT AKTIF: Pasukan KEDUA PIHAK Tak Pernah Mati (heartnothave)!', 'gold');
                } else {
                    this.showToast('Pasukan Tak Pernah Mati (Kedua Pihak) dinonaktifkan.');
                }
            } else if (target === 'enemy') {
                this.enemyCheats.heartNotHave = !this.enemyCheats.heartNotHave;
                if (this.enemyCheats.heartNotHave) {
                    for (const u of this.units) { if (u.team === 'enemy' && u.state !== 'dead') { u.hp = u.maxHp; u.immortalHits = 0; } }
                    if (window.soundCtrl) window.soundCtrl.playSpellDead();
                    this.showToast('💀❤️ CHEAT AKTIF: Semua Pasukan MUSUH Tak Pernah Mati (heartnothave)!', 'gold');
                } else {
                    this.showToast('Pasukan Tak Pernah Mati (Musuh) dinonaktifkan.');
                }
            } else {
                this.cheats.heartNotHave = !this.cheats.heartNotHave;
                if (this.cheats.heartNotHave) {
                    for (const u of this.units) { if (u.team === 'player' && u.state !== 'dead') { u.hp = u.maxHp; u.immortalHits = 0; } }
                    if (window.soundCtrl) window.soundCtrl.playSpellSummon();
                    this.showToast('❤️ CHEAT AKTIF: Semua Pasukan PEMAIN Tak Pernah Mati (heartnothave)!', 'gold');
                } else {
                    this.showToast('Pasukan Tak Pernah Mati (Pemain) dinonaktifkan.');
                }
            }
            this.updateCheatUI();
            this.updateUI();
            return true;
        }

        // 2. hittingmebro / 2hittingmebro: Satu kali hit ke musuh langsung mati (10 hit tembus immortal)
        if (clean === 'hittingmebro' || clean === '2hittingmebro' || clean === '2.hittingmebro') {
            if (target === 'both') {
                const newState = !this.cheats.hittingMeBro;
                this.cheats.hittingMeBro = newState;
                this.enemyCheats.hittingMeBro = newState;
                if (newState) {
                    if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                    this.showToast('💀⚔️ CHEAT AKTIF: 1-Hit Kill KEDUA PIHAK (hittingmebro)! [10 Hit tembus Immortal]', 'gold');
                } else {
                    this.showToast('1-Hit Kill (Kedua Pihak) dinonaktifkan.');
                }
            } else if (target === 'enemy') {
                this.enemyCheats.hittingMeBro = !this.enemyCheats.hittingMeBro;
                if (this.enemyCheats.hittingMeBro) {
                    if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                    this.showToast('💀 CHEAT AKTIF: 1-Hit Kill Serangan MUSUH (hittingmebro)! [10 Hit tembus Immortal]', 'warning');
                } else {
                    this.showToast('1-Hit Kill (Musuh) dinonaktifkan.');
                }
            } else {
                this.cheats.hittingMeBro = !this.cheats.hittingMeBro;
                if (this.cheats.hittingMeBro) {
                    if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                    this.showToast('💀 CHEAT AKTIF: 1-Hit Kill Serangan PEMAIN (hittingmebro)! [10 Hit tembus Immortal]', 'gold');
                } else {
                    this.showToast('1-Hit Kill (Pemain) dinonaktifkan.');
                }
            }
            this.updateCheatUI();
            this.updateUI();
            return true;
        }

        // 3. minegoldrich / gold
        if (clean === 'minegoldrich' || clean === 'gold') {
            if (isPlayerTarget) {
                this.cheats.infiniteGold = !this.cheats.infiniteGold;
                this.gold = this.cheats.infiniteGold ? 999999 : 500;
            }
            if (isEnemyTarget) {
                this.enemyCheats.infiniteGold = !this.enemyCheats.infiniteGold;
                this.enemyGold = this.enemyCheats.infiniteGold ? 999999 : 500;
            }
            if (window.soundCtrl) window.soundCtrl.playGold();
            const label = target === 'both' ? 'Kedua Pihak' : (target === 'enemy' ? 'Musuh' : 'Pemain');
            this.showToast(`✨ CHEAT AKTIF: Emas Tak Terbatas ${label} (minegoldrich)!`, 'gold');
            this.updateCheatUI();
            this.updateUI();
            return true;
        }

        // 4. mymart / mart: Patung kebal abadi
        if (clean === 'mymart' || clean === '2mymart' || clean === 'mart') {
            if (isPlayerTarget) {
                this.cheats.statueInvulnerable = !this.cheats.statueInvulnerable;
                if (this.cheats.statueInvulnerable) this.playerStatue.hp = this.playerStatue.maxHp;
            }
            if (isEnemyTarget) {
                this.enemyCheats.statueInvulnerable = !this.enemyCheats.statueInvulnerable;
                if (this.enemyCheats.statueInvulnerable) this.enemyStatue.hp = this.enemyStatue.maxHp;
            }
            if (window.soundCtrl) window.soundCtrl.playSpellSummon();
            const label = target === 'both' ? 'Kedua Pihak' : (target === 'enemy' ? 'Musuh' : 'Pemain');
            this.showToast(`🛡️ CHEAT AKTIF: Patung Kebal Abadi ${label} (mymart)!`, 'gold');
            this.updateCheatUI();
            return true;
        }

        // 5. cooldownnotspawn / cd
        if (clean === 'cooldownnotspawn' || clean === 'cd') {
            if (isPlayerTarget) {
                this.cheats.noCooldown = !this.cheats.noCooldown;
                if (this.cheats.noCooldown) { for (const key in this.spawnCooldowns) this.spawnCooldowns[key] = 0; }
            }
            if (isEnemyTarget) {
                this.enemyCheats.noCooldown = !this.enemyCheats.noCooldown;
            }
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            const label = target === 'both' ? 'Kedua Pihak' : (target === 'enemy' ? 'Musuh' : 'Pemain');
            this.showToast(`⚡ CHEAT AKTIF: Tanpa Cooldown ${label} (cooldownnotspawn)!`, 'info');
            this.updateCheatUI();
            this.updateUI();
            return true;
        }

        // 6. nopopuation / nopopulation / pop
        if (clean === 'nopopuation' || clean === 'nopopulation' || clean === 'pop') {
            if (isPlayerTarget) {
                this.cheats.noPopulation = !this.cheats.noPopulation;
                this.maxPopulation = this.cheats.noPopulation ? 9999 : 35;
            }
            if (isEnemyTarget) {
                this.enemyCheats.noPopulation = !this.enemyCheats.noPopulation;
            }
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            const label = target === 'both' ? 'Kedua Pihak' : (target === 'enemy' ? 'Musuh' : 'Pemain');
            this.showToast(`👥 CHEAT AKTIF: Populasi Tak Terbatas ${label} (nopopuation)!`, 'info');
            this.updateCheatUI();
            this.updateUI();
            return true;
        }

        // 7. spellol / spell
        if (clean === 'spellol' || clean === 'spell') {
            if (isPlayerTarget) {
                this.cheats.infiniteSpells = !this.cheats.infiniteSpells;
                for (const k in this.spells) {
                    this.spells[k].stock = this.cheats.infiniteSpells ? 99 : this.spells[k].maxStock;
                    if (this.cheats.infiniteSpells) this.spells[k].cooldown = 0;
                }
            }
            if (isEnemyTarget) {
                this.enemyCheats.infiniteSpells = !this.enemyCheats.infiniteSpells;
            }
            if (window.soundCtrl) window.soundCtrl.playSpellSummon();
            const label = target === 'both' ? 'Kedua Pihak' : (target === 'enemy' ? 'Musuh' : 'Pemain');
            this.showToast(`🔮 CHEAT AKTIF: Spell Tak Terbatas ${label} (spellol)!`, 'gold');
            this.updateCheatUI();
            this.updateSpellUI();
            return true;
        }

        // 8. gemsnotreal (Profil pemain)
        if (clean === 'gemsnotreal') {
            this.cheats.infiniteGems = !this.cheats.infiniteGems;
            this.gems = this.cheats.infiniteGems ? 999999 : 1250;
            if (window.soundCtrl) window.soundCtrl.playSpellSummon();
            this.showToast('💎 CHEAT AKTIF: Gems Tak Terbatas (gemsnotreal)!', 'gold');
            this.saveProfile();
            this.updateCheatUI();
            this.updateUI();
            this.updateShopUI();
            return true;
        }

        // 9. upgradereal (Profil pemain)
        if (clean === 'upgradereal') {
            this.cheats.maxUpgrades = !this.cheats.maxUpgrades;
            if (this.cheats.maxUpgrades) {
                for (const k in this.upgrades) this.upgrades[k] = 3;
                this.upgradePoints = 999;
            } else {
                for (const k in this.upgrades) this.upgrades[k] = 0;
                this.upgradePoints = 0;
            }
            if (window.soundCtrl) window.soundCtrl.playOrderHorn();
            this.showToast('⚔️ CHEAT AKTIF: Peningkatan Tak Terbatas (upgradereal)!', 'gold');
            this.saveProfile();
            this.updateCheatUI();
            this.updateUI();
            this.updateShopUI();
            return true;
        }

        // 10. lookinvisble (Radar mata-mata musuh)
        if (clean === 'lookinvisble' || clean === 'lookinvisible' || clean === '1lookinvisble' || clean === '1lookinvisible') {
            this.cheats.spyInvisible = !this.cheats.spyInvisible;
            if (this.cheats.spyInvisible) {
                if (window.soundCtrl) window.soundCtrl.playOrderHorn();
                this.showToast('👁️ CHEAT AKTIF: Radar Intelijen Musuh (lookinvisble)!', 'gold');
            } else {
                this.showToast('Radar Intelijen Musuh dinonaktifkan.');
            }
            this.updateCheatUI();
            return true;
        }

        // 11. balabantuan / emergencycall / panggilbantuan
        if (clean === 'balabantuan' || clean === 'emergencycall' || clean === 'panggilbalabantuan' || clean === 'panggilbantuan' || clean === 'reinforcements') {
            if (target === 'enemy') {
                this.enemyEmergencyTriggered = false;
                this.triggerEnemyEmergencyReinforcements();
                this.showToast('🚨 CHEAT AKTIF: Bala Bantuan Musuh Dikerahkan!', 'danger');
            } else {
                this.playerEmergencyTriggered = false;
                this.triggerPlayerEmergencyReinforcements();
                this.showToast('👑 CHEAT AKTIF: Bala Bantuan Kerajaan Dikerahkan!', 'gold');
            }
            return true;
        }

        // 12. Pasang Pasukan Unit Musuh / Pemain (Cheat Deployment)
        // Format perintah teks: "spawn <unit> [count]", "spawnenemy <unit> [count]", "spawnplayer <unit> [count]", "pasang <unit> [count]"
        const spawnRegex = /^(?:spawn|spawnenemy|spawnplayer|pasang|pasangmusuh|pasangpemain|unit)\s+([a-z]+)(?:\s+(\d+))?$/i;
        const spawnMatch = clean.match(spawnRegex);
        if (spawnMatch) {
            const rawUnit = spawnMatch[1].toLowerCase();
            const count = parseInt(spawnMatch[2]) || 1;
            let spawnTarget = target;
            if (clean.startsWith('spawnenemy') || clean.startsWith('pasangmusuh')) spawnTarget = 'enemy';
            else if (clean.startsWith('spawnplayer') || clean.startsWith('pasangpemain')) spawnTarget = 'player';

            const unitMap = {
                miner: 'miner', penambang: 'miner', tambang: 'miner',
                swordwrath: 'swordwrath', sword: 'swordwrath', pedang: 'swordwrath',
                archidon: 'archidon', archer: 'archidon', panah: 'archidon', pemanah: 'archidon',
                spearton: 'spearton', spear: 'spearton', tombak: 'spearton',
                magikill: 'magikill', mage: 'magikill', penyihir: 'magikill', sihir: 'magikill',
                giant: 'giant', raksasa: 'giant',
                undead: 'undead', zombie: 'undead', mayat: 'undead',
                marrowkai: 'marrowkai', titan: 'marrowkai', bos: 'marrowkai', boss: 'marrowkai'
            };
            const mappedType = unitMap[rawUnit];
            if (mappedType) {
                return this.cheatSpawnUnit(mappedType, spawnTarget, count);
            }
        }

        this.showToast('❌ Kode tidak valid! Gunakan: spawn <unit> [jumlah], heartnothave, hittingmebro, minegoldrich, cooldownnotspawn, nopopuation, spellol, gemsnotreal, upgradereal, lookinvisble, mymart', 'warning');
        return false;
    }

    cheatSpawnUnit(type, target = null, count = 1) {
        if (!type || !this.unitDefs[type]) return false;
        const t = target || this.cheatTarget || 'player';
        const teams = (t === 'both') ? ['player', 'enemy'] : [t];
        const n = Math.min(Math.max(parseInt(count) || 1, 1), 25);

        for (const team of teams) {
            const isPlayer = team === 'player';
            const startX = isPlayer ? (this.playerStatue.x + 80) : (this.enemyStatue.x - 80);
            const dir = isPlayer ? 1 : -1;

            for (let i = 0; i < n; i++) {
                const posX = startX + (i * 24 * dir);
                const clampedX = Math.max(120, Math.min(this.worldWidth - 120, posX));
                this.spawnUnit(type, team, clampedX);
                this.createMagicExplosionParticles(clampedX, this.groundY - 30, isPlayer ? '#00e5ff' : '#ef4444');
            }
        }

        if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        const teamLabel = t === 'both' ? 'Pemain & Musuh' : (t === 'enemy' ? 'Musuh' : 'Pemain');
        const unitName = this.unitDefs[type] ? this.unitDefs[type].name : type;
        this.showToast(`⚡ Pasang Unit: ${n}x ${unitName} (${teamLabel})!`, 'gold');
        this.updateUI();
        return true;
    }

    updateCheatUI() {
        // Update Target Selector Buttons
        const currentTarget = this.cheatTarget || 'player';
        ['player', 'enemy', 'both'].forEach(t => {
            const btn = document.getElementById(`btn-target-${t}`);
            if (btn) btn.classList.toggle('active', currentTarget === t);
        });

        // Tentukan state cheat yang ditampilkan pada tombol modal sesuai target yang dipilih
        const isEnemyView = currentTarget === 'enemy';
        const isBothView = currentTarget === 'both';
        const getCheatActive = (key) => {
            if (isEnemyView) return !!this.enemyCheats[key];
            if (isBothView) return !!(this.cheats[key] && this.enemyCheats[key]);
            return !!this.cheats[key];
        };

        const updateBtn = (id, isActive) => {
            const btn = document.getElementById(id);
            if (!btn) return;
            btn.innerText = isActive ? 'AKTIF ✅' : 'AKTIFKAN';
            btn.classList.toggle('active', isActive);
        };

        // Update modal cheat buttons
        updateBtn('toggle-cheat-heart', getCheatActive('heartNotHave'));
        updateBtn('toggle-cheat-hitting', getCheatActive('hittingMeBro'));
        updateBtn('toggle-cheat-gold', getCheatActive('infiniteGold'));
        updateBtn('toggle-cheat-cd', getCheatActive('noCooldown'));
        updateBtn('toggle-cheat-pop', getCheatActive('noPopulation'));
        updateBtn('toggle-cheat-spell', getCheatActive('infiniteSpells'));
        updateBtn('toggle-cheat-statue', getCheatActive('statueInvulnerable'));

        // Player Profile Cheats
        updateBtn('toggle-cheat-gems', this.cheats.infiniteGems);
        updateBtn('toggle-cheat-upgrade', this.cheats.maxUpgrades);
        updateBtn('toggle-cheat-spy', this.cheats.spyInvisible);

        // Update pills in Top HUD (Player)
        const updatePill = (id, active) => {
            const pill = document.getElementById(id);
            if (pill) pill.classList.toggle('hidden', !active);
        };

        updatePill('pill-cheat-gold', this.cheats.infiniteGold);
        updatePill('pill-cheat-cd', this.cheats.noCooldown);
        updatePill('pill-cheat-pop', this.cheats.noPopulation);
        updatePill('pill-cheat-spell', this.cheats.infiniteSpells);
        updatePill('pill-cheat-gems', this.cheats.infiniteGems);
        updatePill('pill-cheat-upgrade', this.cheats.maxUpgrades);
        updatePill('pill-cheat-spy', this.cheats.spyInvisible);
        updatePill('pill-cheat-statue', this.cheats.statueInvulnerable);
        updatePill('pill-cheat-heart', this.cheats.heartNotHave);
        updatePill('pill-cheat-hitting', this.cheats.hittingMeBro);

        // Update pills in Top HUD (Enemy)
        updatePill('pill-enemy-heart', this.enemyCheats.heartNotHave);
        updatePill('pill-enemy-hitting', this.enemyCheats.hittingMeBro);
        updatePill('pill-enemy-gold', this.enemyCheats.infiniteGold);
        updatePill('pill-enemy-statue', this.enemyCheats.statueInvulnerable);

        this.updateEnemySpyHUD();
    }

    toggleEnemySpyHUD() {
        this.enemySpyCollapsed = !this.enemySpyCollapsed;
        const hud = document.getElementById('enemy-spy-hud');
        const btn = document.getElementById('btn-spy-toggle');
        if (hud) hud.classList.toggle('collapsed', this.enemySpyCollapsed);
        if (btn) {
            btn.innerText = this.enemySpyCollapsed ? '▲' : '▼';
            btn.title = this.enemySpyCollapsed ? 'Tampilkan Detail Radar Musuh (Panah Atas)' : 'Sembunyikan Radar Musuh (Panah Bawah)';
        }
        if (window.soundCtrl) window.soundCtrl.playOrderHorn();
        this.showToast(this.enemySpyCollapsed ? '🔽 Radar Musuh Diciutkan (Klik ▲ untuk melihat lengkap)' : '🔼 Radar Musuh Dibuka Lengkap!');
    }

    updateEnemySpyHUD() {
        const hud = document.getElementById('enemy-spy-hud');
        if (!hud) return;
        if (!this.cheats.spyInvisible) {
            hud.classList.add('hidden');
            return;
        }
        hud.classList.remove('hidden');
        hud.classList.toggle('collapsed', !!this.enemySpyCollapsed);

        const toggleBtn = document.getElementById('btn-spy-toggle');
        if (toggleBtn) {
            toggleBtn.innerText = this.enemySpyCollapsed ? '▲' : '▼';
            toggleBtn.title = this.enemySpyCollapsed ? 'Tampilkan Detail Radar Musuh (Panah Atas)' : 'Sembunyikan Radar Musuh (Panah Bawah)';
        }

        // Stance badge
        const stanceBadge = document.getElementById('spy-stance-badge');
        if (stanceBadge) {
            const stanceLabels = {
                defend: '🛡️ BERTAHAN',
                attack: '⚔️ MENYERANG',
                retreat: '🏰 MUNDUR (MASUK KASTIL)'
            };
            stanceBadge.innerText = stanceLabels[this.enemyStance] || this.enemyStance.toUpperCase();
            stanceBadge.className = `spy-badge ${this.enemyStance}`;
        }

        // Gold & Economy
        const goldVal = document.getElementById('spy-gold-val');
        if (goldVal) {
            const enemyMiners = this.units.filter(u => u.team === 'enemy' && u.type === 'miner' && u.state !== 'dead').length;
            goldVal.innerText = `${Math.floor(this.enemyGold)} G (${enemyMiners} Penambang)`;
        }

        // Skin used by enemy
        const skinVal = document.getElementById('spy-skin-val');
        if (skinVal) {
            const skinNames = {
                classic: 'Klasik 🛡️',
                fire: 'Api (Bakar & Retaliasi) 🔥',
                ice: 'Es (Bekukan & Chill) ❄️',
                bomb: 'Bom (Ledakan 3x3 AoE) 💣',
                vampire: 'Vampire (Lifesteal & 2X DMG) 🧛',
                savage: 'Savage (2X Speed & 10 Minion) 🦴',
                leaf: 'Daun (Diskon 50% Biaya Rekrut) 🍃',
                voltaic: 'Voltaic (Sengatan 10 DMG & 1.5X Kerentanan) ⚡'
            };
            const enemyActiveSkins = [...new Set(this.units.filter(u => u.team === 'enemy' && u.state !== 'dead').map(u => u.skin || 'classic'))];
            if (enemyActiveSkins.length > 1) {
                skinVal.innerText = `Teracak: ${enemyActiveSkins.map(s => skinNames[s] || s).join(', ')}`;
            } else {
                const s = enemyActiveSkins[0] || (this.difficulty === 'insane' ? 'Teracak 🎲' : 'Klasik 🛡️');
                skinVal.innerText = skinNames[s] || s;
            }
        }

        // Army composition
        const armyVal = document.getElementById('spy-army-val');
        const breakdownEl = document.getElementById('spy-army-breakdown');
        const enemyAlive = this.units.filter(u => u.team === 'enemy' && u.state !== 'dead');
        if (armyVal) {
            armyVal.innerText = `${enemyAlive.length}/35 Prajurit (Pemanah Menara: ${this.castleArchers.enemy.count}/4)`;
        }
        if (breakdownEl) {
            const counts = {};
            enemyAlive.forEach(u => counts[u.type] = (counts[u.type] || 0) + 1);
            const iconMap = {
                miner: '⛏️ Miner',
                swordwrath: '⚔️ Sword',
                archidon: '🏹 Archer',
                spearton: '🛡️ Spearton',
                magikill: '🧙 Magikill',
                giant: '🧌 Giant',
                minion: '💀 Minion',
                undead: '🧟 Mayat',
                marrowkai: '☠️ Marrowkai'
            };
            const parts = Object.keys(counts).map(k => `${iconMap[k] || k}: ${counts[k]}`);
            breakdownEl.innerText = parts.length > 0 ? parts.join(' | ') : 'Tidak ada prajurit di lapangan';
        }

        // Spell used / status
        const spellVal = document.getElementById('spy-spell-val');
        if (spellVal) {
            const nextSpell = this.enemyNextSpell || (this.enemySpellCooldown > 0 ? `Siap dalam ${Math.ceil(this.enemySpellCooldown)}s` : 'Siaga Meluncurkan Mantra!');
            spellVal.innerText = nextSpell;
        }

        // Training queue
        const trainVal = document.getElementById('spy-train-val');
        if (trainVal) {
            const queueUnit = this.enemyNextTrainUnit ? (this.unitDefs[this.enemyNextTrainUnit]?.name || this.enemyNextTrainUnit) : 'Menganalisis Medan...';
            trainVal.innerText = `Rencana Rekrut: ${queueUnit}`;
        }
    }

    updateControlUI() {
        const controlPanel = document.getElementById('controlled-unit-panel');
        if (controlPanel) {
            if (this.controlledUnit) {
                controlPanel.classList.remove('hidden');
                document.getElementById('ctrl-unit-name').innerText = this.unitDefs[this.controlledUnit.type].name;
                document.getElementById('ctrl-unit-hp').innerText = `${Math.round(this.controlledUnit.hp)}/${this.controlledUnit.maxHp}`;
            } else {
                controlPanel.classList.add('hidden');
            }
        }

        const mobileDpad = document.getElementById('mobile-ctrl-dpad');
        if (mobileDpad) {
            if (this.controlledUnit) {
                mobileDpad.classList.remove('hidden');
            } else {
                mobileDpad.classList.add('hidden');
            }
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

    showEmergencyReinforcementAlert(text, title = null, isPlayer = false) {
        const banner = document.getElementById('emergency-warning-banner');
        if (!banner) return;
        const titleEl = document.getElementById('emergency-warning-title');
        const detailEl = document.getElementById('emergency-warning-detail');
        const iconLeft = document.getElementById('emergency-warning-icon-left');
        const iconRight = document.getElementById('emergency-warning-icon-right');

        if (isPlayer) {
            banner.classList.add('player-reinforcement');
            if (iconLeft) iconLeft.innerText = '👑';
            if (iconRight) iconRight.innerText = '👑';
            if (titleEl) titleEl.innerText = title || '👑 PERHATIAN! BALA BANTUAN KERAJAAN KITA TIBA! 👑';
        } else {
            banner.classList.remove('player-reinforcement');
            if (iconLeft) iconLeft.innerText = '🚨';
            if (iconRight) iconRight.innerText = '🚨';
            if (titleEl) titleEl.innerText = title || '🚨 PERHATIAN! MUSUH MEMANGGIL BALA BANTUAN! 🚨';
        }

        if (detailEl && text) {
            detailEl.innerText = text;
        }
        banner.classList.remove('hidden');
        clearTimeout(this.emergencyAlertTimer);
        this.emergencyAlertTimer = setTimeout(() => {
            banner.classList.add('hidden');
        }, 6000);
    }

    checkStatueEmergencyReinforcements() {
        if (this.gameOver || !this.running) return;
        // Mencegah trigger prematur di 2 detik awal pertempuran
        if ((this.matchTime || 0) < 2.0) return;

        // 1. Musuh memanggil bala bantuan darurat jika nyawa patung musuh < 1000
        if (!this.enemyEmergencyTriggered && this.enemyStatue && this.enemyStatue.hp < 1000 && this.enemyStatue.hp > 0 && this.enemyStatue.hp < this.enemyStatue.maxHp) {
            this.triggerEnemyEmergencyReinforcements();
        }

        // 2. Pemain memanggil bala bantuan darurat jika nyawa patung pemain < 1000
        if (!this.playerEmergencyTriggered && this.playerStatue && this.playerStatue.hp < 1000 && this.playerStatue.hp > 0 && this.playerStatue.hp < this.playerStatue.maxHp) {
            this.triggerPlayerEmergencyReinforcements();
        }
    }

    triggerEnemyEmergencyReinforcements() {
        if (this.enemyEmergencyTriggered) return;
        this.enemyEmergencyTriggered = true;

        // Pasukan musuh segera melancarkan serangan balik kilat!
        this.enemyStance = 'attack';

        // 1. Play Emergency alert audio & screen shake
        if (window.soundCtrl && window.soundCtrl.playEmergencyAlert) {
            window.soundCtrl.playEmergencyAlert();
        }
        this.triggerScreenShake(0.8, 16);

        // 2. Pasukan Bala Bantuan Musuh: acak (dari unit reguler atau spell), MINIMAL BATAS 6 PASUKAN!
        const enemyCandidatePool = ['giant', 'spearton', 'spearton', 'archidon', 'archidon', 'swordwrath', 'swordwrath', 'magikill', 'undead', 'undead', 'marrowkai'];
        // Pastikan jumlah pasukan acak minimal 6 (antara 6 sampai 8 pasukan)
        const squadSize = 6 + Math.floor(Math.random() * 3);
        const chosenSquad = [];
        for (let i = 0; i < squadSize; i++) {
            chosenSquad.push(enemyCandidatePool[Math.floor(Math.random() * enemyCandidatePool.length)]);
        }

        const squadDisplay = [];
        const startX = this.enemyStatue ? (this.enemyStatue.x - 100) : 3900;

        chosenSquad.forEach((uType, idx) => {
            setTimeout(() => {
                if (!this.gameOver && this.running) {
                    const spawnX = Math.max(250, startX - (idx * 28));
                    const u = this.spawnUnit(uType, 'enemy', spawnX);
                    if (u) {
                        // Pasukan Bala Bantuan Asli: memiliki battle aura, tidak pernah masuk benteng, dan langsung maju menyerang!
                        u.isEmergencyReinforcement = true;
                        u.neverGarrison = true;
                        u.garrisonCooldown = 999999;
                        u.state = 'walk';
                        u.dir = -1;
                        this.createSparks(u.x, u.y - 30, '#ef4444', 16);
                        this.triggerScreenShake(0.12, 4);
                        if (window.soundCtrl && window.soundCtrl.playSpellSummon) {
                            window.soundCtrl.playSpellSummon();
                        }
                        this.showFloatingText(u.x, u.y - 70, `🚨 ${uType.toUpperCase()} BALA BANTUAN ASLI!`, '#f87171');
                    }
                }
            }, idx * 140);
            if (!squadDisplay.includes(uType)) squadDisplay.push(uType.toUpperCase());
        });

        // 3. Mantra Bantuan Darurat Musuh: acak, MINIMAL BATAS 2 SPELL (gratis)!
        const emergencySpells = [
            'arrowRain', 'lightningStorm', 'summonDead', 'summonMarrowkai', 
            'divineShield', 'swordRage', 'massMend', 'toxicCloud', 'electricStorm'
        ];
        const spellCount = 2 + (Math.random() < 0.35 ? 1 : 0); // minimal 2 spell!
        const shuffledSpells = [...emergencySpells].sort(() => Math.random() - 0.5);
        const chosenSpells = shuffledSpells.slice(0, spellCount);

        chosenSpells.forEach((sp, idx) => {
            setTimeout(() => {
                if (!this.gameOver && this.running) {
                    this.castSpell(sp, 'enemy', true);
                }
            }, 300 + idx * 650);
        });

        const spellNames = {
            healWave: 'Healing Wave 💖',
            massMend: 'Holy Mass Mend ✨',
            arrowRain: 'Hujan Panah Api 🏹',
            lightningStorm: 'Badai Petir Halilintar ⚡',
            electricStorm: 'Golden Thunder ⚡',
            toxicCloud: 'Kabut Racun Melumpuhkan ☣️',
            swordRage: 'Sword Rage Membara ⚔️',
            flameHelm: 'Flame War Cry 🔥',
            divineShield: 'Divine Aegis Shield 🛡️',
            trainingHaste: 'Training Haste ➰',
            summonDead: 'Bangkitkan Mayat Hidup 💀',
            summonMarrowkai: 'Titan Marrowkai ☠️'
        };

        const spellListStr = chosenSpells.map(s => spellNames[s] || s).join(' & ');
        const alertDetail = `${chosenSquad.length} Pasukan (${squadDisplay.join(', ')}) + ${chosenSpells.length} Mantra: ${spellListStr}!`;
        this.showEmergencyReinforcementAlert(`Bala Bantuan Musuh: ${alertDetail}`, '🚨 PERHATIAN! MUSUH MEMANGGIL BALA BANTUAN! 🚨', false);
        this.showToast('🚨 PERHATIAN! MUSUH MEMANGGIL BALA BANTUAN!', 'danger');
        if (this.enemyStatue) {
            this.showFloatingText(this.enemyStatue.x, this.groundY - 210, '🚨 BALA BANTUAN MUSUH DATANG!', '#ef4444');
        }
    }

    triggerPlayerEmergencyReinforcements() {
        if (this.playerEmergencyTriggered) return;
        this.playerEmergencyTriggered = true;

        // Jika pemain sedang mundur, ubah ke bertahan dan keluarkan pasukan dari benteng untuk mempertahankan patung!
        if (this.playerStance === 'retreat') {
            this.setStance('defend');
            this.releaseGarrisonedUnits('player');
        }

        // Sembunyikan tombol bala bantuan setelah digunakan
        const emergencyCallBtn = document.getElementById('btn-call-reinforcements');
        if (emergencyCallBtn) emergencyCallBtn.classList.add('hidden');

        // 1. Play Emergency alert audio & screen shake
        if (window.soundCtrl && window.soundCtrl.playEmergencyAlert) {
            window.soundCtrl.playEmergencyAlert();
        }
        if (window.soundCtrl && window.soundCtrl.playOrderHorn) {
            setTimeout(() => window.soundCtrl.playOrderHorn(), 250);
        }
        this.triggerScreenShake(0.85, 18);

        // 2. Pasukan Bala Bantuan Pemain: acak (dari unit reguler atau spell), MINIMAL BATAS 6 PASUKAN!
        const playerCandidatePool = ['giant', 'spearton', 'spearton', 'archidon', 'archidon', 'swordwrath', 'swordwrath', 'magikill', 'undead', 'undead', 'marrowkai'];
        // Pastikan jumlah pasukan acak minimal 6 (antara 6 sampai 8 pasukan)
        const squadSize = 6 + Math.floor(Math.random() * 3);
        const chosenSquad = [];
        for (let i = 0; i < squadSize; i++) {
            chosenSquad.push(playerCandidatePool[Math.floor(Math.random() * playerCandidatePool.length)]);
        }

        const squadDisplay = [];
        const startX = this.playerStatue ? (this.playerStatue.x + 100) : 1100;

        chosenSquad.forEach((uType, idx) => {
            setTimeout(() => {
                if (!this.gameOver && this.running) {
                    const spawnX = Math.min(this.worldWidth - 250, startX + (idx * 28));
                    const u = this.spawnUnit(uType, 'player', spawnX);
                    if (u) {
                        // Pasukan Bala Bantuan Asli: memiliki battle aura, tidak pernah masuk benteng, dan langsung maju bertempur!
                        u.isEmergencyReinforcement = true;
                        u.neverGarrison = true;
                        u.garrisonCooldown = 999999;
                        u.state = 'walk';
                        u.dir = 1;
                        this.createSparks(u.x, u.y - 30, '#00e5ff', 18);
                        this.triggerScreenShake(0.12, 4);
                        if (window.soundCtrl && window.soundCtrl.playSpellSummon) {
                            window.soundCtrl.playSpellSummon();
                        }
                        this.showFloatingText(u.x, u.y - 70, `👑 ${uType.toUpperCase()} BALA BANTUAN ASLI!`, '#38bdf8');
                    }
                }
            }, idx * 140);
            if (!squadDisplay.includes(uType)) squadDisplay.push(uType.toUpperCase());
        });

        // 3. Mantra Bantuan Darurat Pemain: acak, MINIMAL BATAS 2 SPELL (gratis tanpa syarat stok/cooldown)!
        const availableSpells = [
            'divineShield', 'arrowRain', 'lightningStorm', 'electricStorm', 
            'massMend', 'swordRage', 'summonDead', 'summonMarrowkai', 
            'flameHelm', 'healWave', 'trainingHaste'
        ];
        const spellCount = 2 + (Math.random() < 0.35 ? 1 : 0); // minimal 2 spell!
        const shuffledSpells = [...availableSpells].sort(() => Math.random() - 0.5);
        const chosenSpells = shuffledSpells.slice(0, spellCount);

        chosenSpells.forEach((sp, idx) => {
            setTimeout(() => {
                if (!this.gameOver && this.running) {
                    this.castSpell(sp, 'player', true); // isFree = true
                }
            }, 300 + idx * 650);
        });

        const spellNames = {
            healWave: 'Healing Wave 💖',
            massMend: 'Holy Mass Mend ✨',
            arrowRain: 'Hujan Panah Api 🏹',
            lightningStorm: 'Badai Petir Halilintar ⚡',
            electricStorm: 'Golden Thunder ⚡',
            toxicCloud: 'Kabut Racun Melumpuhkan ☣️',
            swordRage: 'Sword Rage Membara ⚔️',
            flameHelm: 'Flame War Cry 🔥',
            divineShield: 'Divine Aegis Shield 🛡️',
            trainingHaste: 'Training Haste ➰',
            summonDead: 'Bangkitkan Mayat Hidup 💀',
            summonMarrowkai: 'Titan Marrowkai ☠️'
        };

        const spellListStr = chosenSpells.map(s => spellNames[s] || s).join(' & ');
        const alertDetail = `${chosenSquad.length} Pasukan (${squadDisplay.join(', ')}) + ${chosenSpells.length} Mantra: ${spellListStr}!`;
        this.showEmergencyReinforcementAlert(`Bala Bantuan Kerajaan: ${alertDetail}`, '👑 PERHATIAN! BALA BANTUAN KERAJAAN KITA TIBA! 👑', true);
        this.showToast('👑 PERHATIAN! PATUNG TERANCAM (<1000 HP), BALA BANTUAN KERAJAAN TIBA!', 'gold');
        if (this.playerStatue) {
            this.showFloatingText(this.playerStatue.x, this.groundY - 210, '👑 BALA BANTUAN KITA DATANG!', '#38bdf8');
        }
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
                equippedSkin: this.equippedSkin,
                mixSkinUnlocked: this.mixSkinUnlocked,
                equippedSkins: this.equippedSkins,
                enemyEquippedSkin: this.enemyEquippedSkin
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
                if (typeof data.mixSkinUnlocked === 'boolean') this.mixSkinUnlocked = data.mixSkinUnlocked;
                if (Array.isArray(data.equippedSkins)) this.equippedSkins = data.equippedSkins;
                if (data.enemyEquippedSkin) this.enemyEquippedSkin = data.enemyEquippedSkin;
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
            minerHustle: 20, arrowRain: 30, healWave: 150, swordRage: 40,
            goldenSpearton: 300, trainingHaste: 50, lightningStorm: 750, summonDead: 750,
            goldRush: 100, summonMarrowkai: 1000,
            flameHelm: 50, divineShield: 500, archidonFury: 40, massMend: 150,
            speartonPhalanx: 250, sprintHaste: 30, toxicCloud: 20, royalCrown: 100,
            undeadHorde: 300, electricStorm: 400
        };
        const cost = spellCosts[spellId] || 50;
        if (this.gems < cost && !this.cheats.infiniteGems) {
            this.showToast(`💎 Permata (Gems) tidak cukup! (${cost} Gems)`, 'warning');
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
        const skinCosts = {
            classic: 0,
            fire: 750,
            ice: 750,
            bomb: 850,
            vampire: 950,
            savage: 1000,
            leaf: 850,
            voltaic: 1000
        };
        const cost = skinCosts[skinId] || 750;
        if (this.gems < cost && !this.cheats.infiniteGems) {
            this.showToast(`💎 Permata tidak cukup untuk skin ini (${cost} Gems)!`, 'warning');
            return;
        }
        if (!this.cheats.infiniteGems) this.gems -= cost;
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
        this.equippedSkins = [skinId];
        // Update friendly units in battle
        for (const u of this.units) {
            if (u.team === 'player' && u.type !== 'minion') {
                u.skin = skinId;
                u.skins = [skinId];
            }
        }
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
        this.showToast(`👕 Skin ${skinId.toUpperCase()} dipasang!`);
    }

    unlockMixSkin() {
        if (this.mixSkinUnlocked) return true;
        const cost = 5000;
        if (this.gems < cost && !this.cheats.infiniteGems) {
            this.showToast(`💎 Permata tidak cukup! Butuh 5.000 Gems untuk membuka Mix Skin. (Milikmu: ${Math.floor(this.gems)})`, 'warning');
            return false;
        }
        if (!this.cheats.infiniteGems) this.gems -= cost;
        this.mixSkinUnlocked = true;
        if (!this.equippedSkins || this.equippedSkins.length === 0) {
            this.equippedSkins = [this.equippedSkin || 'classic'];
        }
        if (window.soundCtrl) window.soundCtrl.playStarChime();
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
        this.showToast('🧬 FITUR MIX SKIN DIBUKA! Kamu sekarang bisa menggabungkan 2 atau lebih skin sekaligus!', 'gold');
        return true;
    }

    toggleMixSkin(skinId) {
        if (!this.skins[skinId]) return;
        if (!this.mixSkinUnlocked) {
            this.equipSkin(skinId);
            return;
        }
        if (!this.equippedSkins) this.equippedSkins = [this.equippedSkin || 'classic'];

        const idx = this.equippedSkins.indexOf(skinId);
        if (idx !== -1) {
            if (this.equippedSkins.length <= 1) {
                this.showToast('Minimal harus ada 1 skin aktif di dalam kombinasi Mix!', 'warning');
                return;
            }
            this.equippedSkins.splice(idx, 1);
            this.showToast(`Dilepas dari Mix: ${skinId.toUpperCase()}`);
        } else {
            this.equippedSkins.push(skinId);
            this.showToast(`🧬 Ditambahkan ke Mix: ${skinId.toUpperCase()}!`, 'gold');
        }

        this.equippedSkin = this.equippedSkins[0] || 'classic';
        for (const u of this.units) {
            if (u.team === 'player' && u.type !== 'minion') {
                u.skin = this.equippedSkins.join('+');
                u.skins = [...this.equippedSkins];
            }
        }
        this.saveProfile();
        this.updateUI();
        this.updateShopUI();
    }

    setEnemySkin(skinId) {
        this.enemyEquippedSkin = skinId || 'classic';
        for (const u of this.units) {
            if (u.team === 'enemy' && this.difficulty !== 'insane' && u.type !== 'minion') {
                u.skin = this.enemyEquippedSkin;
                u.skins = [this.enemyEquippedSkin];
            }
        }
        this.saveProfile();
        this.updateShopUI();
        const sel = document.getElementById('enemy-skin-selector');
        if (sel) {
            sel.querySelectorAll('.enemy-skin-btn').forEach(b => {
                b.classList.toggle('active', b.dataset.skin === this.enemyEquippedSkin);
            });
        }
        this.showToast(`💀 Skin Pasukan Musuh diatur ke: ${skinId.toUpperCase()}!`, 'danger');
    }

    openCheatModal() {
        const modal = document.getElementById('cheat-modal');
        if (!modal) return;
        modal.classList.remove('hidden');
        this.updateCheatUI();
        const input = document.getElementById('cheat-input');
        if (input) input.focus();
    }

    closeCheatModal() {
        const modal = document.getElementById('cheat-modal');
        if (modal) modal.classList.add('hidden');
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
            { id: 'magikillStaff', name: 'Tongkat Magikill', icon: '🧙‍♂️', desc: 'Ledakan sihir area (+35 DMG/lvl) & batas pemanggilan minion: Tingkat 1 (7 Minion), Tingkat 2 (9 Minion), Tingkat 3/MAX (10 Minion)!' },
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

        // Update Skins Tab items (Klasik, Daun, Api, Es, Bom, Vampire, Savage)
        const skinDefs = [
            { id: 'classic', name: 'Skin Klasik (Stick War Classic)', cost: 0, icon: '🛡️', color: '#00e5ff', desc: 'Tampilan stickman orisinal prajurit kerajaan Order of Inamorta.' },
            { id: 'leaf', name: 'Skin Daun (Ancient Nature Leaf)', cost: 850, icon: '🍃', color: '#4ade80', desc: 'Aura tanaman purba! Biaya rekrutmen seluruh unit DISKON 50% drastis! Patung monolit raksasa berlumut & kayu purba mistis!' },
            { id: 'fire', name: 'Skin Api (Blazing Fire)', cost: 750, icon: '🔥', color: '#ff6b00', desc: 'Aura api magma! Serangan memiliki efek bakar 10 kerusakan, dan saat menerima damage membalas 5 kerusakan api ke musuh!' },
            { id: 'ice', name: 'Skin Es (Frost Ice Cryo)', cost: 750, icon: '❄️', color: '#00f0ff', desc: 'Aura kristal es kutub! Saat menerima damage, musuh yang menyerang akan MEMBEKU selama 3 detik! Serangan juga memberikan efek chill slow -35%.' },
            { id: 'bomb', name: 'Skin Bom (Blast Demolition)', cost: 850, icon: '💣', color: '#f59e0b', desc: 'Dilengkapi sumbu berapi & sabuk peledak dinamit! Saat gugur di medan tempur menciptakan ledakan dahsyat area 3x3 yang meluluhlantakkan pasukan lawan!' },
            { id: 'vampire', name: 'Skin Vampire (Crimson Blood)', cost: 950, icon: '🧛', color: '#e11d48', desc: 'Jubah kelelawar & taring merah! Serangan menyedot darah musuh (lifesteal), dan saat nyawa menipis (<45%) pukulan menghasilkan 2X DAMAGE serta membalas sedot darah!' },
            { id: 'savage', name: 'Skin Savage (Primal Beast Skull)', cost: 1000, icon: '🦴', color: '#10b981', desc: 'Topeng tengkorak binatang purba bertanduk, surai singa buas, perisai taring melingkar, dan belati bergerigi! Serangan & menambang 2X SPEED lebih cepat!' },
            { id: 'voltaic', name: 'Skin Voltaic (High-Voltage Shock)', cost: 1000, icon: '⚡', color: '#38bdf8', desc: 'Aura petir halilintar bertegangan tinggi! Pukulan menghasilkan 10 DAMAGE listrik instan & efek listrik selama 10 DETIK! Selama tersengat listrik, musuh menerima 1.5X DAMAGE dari semua serangan!' }
        ];

        const skinsContainer = document.getElementById('shop-skins-container');
        if (skinsContainer) {
            skinsContainer.innerHTML = '';

            // 1. MIX SKIN SYSTEM BANNER (5.000 GEMS)
            const mixBanner = document.createElement('div');
            mixBanner.className = `mix-skin-shop-banner ${this.mixSkinUnlocked ? 'active' : ''}`;
            if (!this.mixSkinUnlocked) {
                mixBanner.innerHTML = `
                    <div class="mix-banner-top">
                        <span class="mix-banner-badge">🧬 FITUR BARU: FUSION MIX SKIN</span>
                        <span class="mix-banner-cost">5.000 💎</span>
                    </div>
                    <p class="mix-banner-text">
                        Buka kemampuan menggabungkan <b>2 atau lebih skin</b> sekaligus! Gabungkan kecepatan Savage 2X, efek bakar api, pembeku es, ledakan bom, dan lifesteal vampire ke dalam prajuritmu secara serentak!
                    </p>
                    <button class="mix-unlock-action-btn" id="btn-unlock-mix-banner">
                        🔓 BUKA FITUR MIX SKIN (5.000 💎)
                    </button>
                `;
                const unlockBtn = mixBanner.querySelector('#btn-unlock-mix-banner');
                if (unlockBtn) unlockBtn.addEventListener('click', () => this.unlockMixSkin());
            } else {
                const activeMixNames = (this.equippedSkins && this.equippedSkins.length > 0)
                    ? this.equippedSkins.map(id => id.toUpperCase()).join(' + ')
                    : (this.equippedSkin || 'classic').toUpperCase();
                mixBanner.innerHTML = `
                    <div class="mix-banner-top active">
                        <span class="mix-banner-badge active">🧬 FITUR MIX SKIN AKTIF ✅</span>
                        <span class="mix-active-count">${this.equippedSkins.length} SKIN DIGABUNGKAN</span>
                    </div>
                    <p class="mix-banner-text">
                        Kombinasi Skin Pasukan Kita: <b style="color: #ffd700;">${activeMixNames}</b>.<br>
                        Klik tombol <b>[+ GABUNG KE MIX]</b> atau <b>[LEPAS DARI MIX]</b> pada kartu skin di bawah.
                    </p>
                `;
            }
            skinsContainer.appendChild(mixBanner);

            // 2. ENEMY SKIN STATUS BAR
            const enemyBar = document.createElement('div');
            enemyBar.className = 'enemy-skin-shop-bar';
            enemyBar.innerHTML = `
                <div class="enemy-bar-info">
                    <span>💀 <b>Skin Pasukan Musuh:</b></span>
                    <span class="enemy-bar-current" style="color: #ffd700; font-weight: 800;">${(this.enemyEquippedSkin || 'classic').toUpperCase()}</span>
                </div>
                <div class="enemy-bar-hint">
                    <i>Kecuali klasik, Anda bisa memberikan skin elemen/savage ke musuh! (Pada Mode Gila, skin musuh tetap diacak)</i>
                </div>
            `;
            skinsContainer.appendChild(enemyBar);

            // 3. RENDER SKIN CARDS
            for (const s of skinDefs) {
                const owned = !!this.skins[s.id];
                const isPlayerEquipped = this.mixSkinUnlocked ? (this.equippedSkins && this.equippedSkins.includes(s.id)) : (this.equippedSkin === s.id);
                const isEnemyEquipped = (this.enemyEquippedSkin === s.id);
                const card = document.createElement('div');
                card.className = `skin-card ${s.id}-theme ${isPlayerEquipped ? 'equipped' : (owned ? 'owned' : '')}`;
                card.innerHTML = `
                    <div class="skin-avatar ${s.id}">${s.icon}</div>
                    <div class="skin-info">
                        <div class="skin-title-row">
                            <span class="skin-name" style="color: ${s.color}; font-weight: 700;">${s.name}</span>
                            ${isPlayerEquipped ? '<span class="skin-equipped-badge">DIPASANG KITA ✅</span>' : ''}
                            ${isEnemyEquipped ? '<span class="skin-enemy-badge">SKIN MUSUH 💀</span>' : ''}
                        </div>
                        <p class="skin-desc">${s.desc}</p>
                    </div>
                    <div class="skin-action">
                        ${!owned ? `<button class="skin-btn buy" data-skin="${s.id}">BELI (${s.cost} 💎)</button>` :
                          (this.mixSkinUnlocked ?
                            (isPlayerEquipped ?
                              `<button class="skin-btn mix-remove" data-skin="${s.id}">LEPAS DARI MIX ❌</button>` :
                              `<button class="skin-btn mix-add" data-skin="${s.id}">+ GABUNG KE MIX 🧬</button>`) :
                            (isPlayerEquipped ?
                              `<button class="skin-btn equipped" disabled>TERPASANG</button>` :
                              `<button class="skin-btn equip" data-skin="${s.id}">PASANG KITA</button>`))}

                        <!-- Enemy Skin Assignment Button -->
                        ${isEnemyEquipped ?
                          `<button class="skin-btn enemy-active" disabled>💀 MUSUH AKTIF</button>` :
                          `<button class="skin-btn set-enemy" data-enemy-skin="${s.id}">BERIKAN KE MUSUH 💀</button>`}
                    </div>
                `;

                const buyBtn = card.querySelector('.skin-btn.buy');
                if (buyBtn) buyBtn.addEventListener('click', () => this.buySkin(s.id));

                const equipBtn = card.querySelector('.skin-btn.equip');
                if (equipBtn) equipBtn.addEventListener('click', () => this.equipSkin(s.id));

                const mixAddBtn = card.querySelector('.skin-btn.mix-add');
                if (mixAddBtn) mixAddBtn.addEventListener('click', () => this.toggleMixSkin(s.id));

                const mixRemoveBtn = card.querySelector('.skin-btn.mix-remove');
                if (mixRemoveBtn) mixRemoveBtn.addEventListener('click', () => this.toggleMixSkin(s.id));

                const enemyBtn = card.querySelector('.skin-btn.set-enemy');
                if (enemyBtn) enemyBtn.addEventListener('click', () => this.setEnemySkin(s.id));

                skinsContainer.appendChild(card);
            }
        }

        // Update Spells Shop Tab items (All 20 Spells: Page 1 & Page 2 from Wizard Armory)
        const spellDefs = [
            { id: 'minerHustle', name: 'Miner Hustle', cost: 20, icon: '⛏️', desc: 'Miner bergerak 85% lebih cepat dan membawa muatan emas ekstra berlipat ganda.' },
            { id: 'arrowRain', name: 'Arrow Rain', cost: 30, icon: '🏹', desc: 'Hujan badai 35 anak panah membakar medan perang barisan musuh.' },
            { id: 'healWave', name: 'Healing Wave', cost: 150, icon: '💖', desc: 'Gelombang penyembuh memulihkan seluruh prajurit dan patung kerajaan.' },
            { id: 'swordRage', name: 'Sword Rage', cost: 40, icon: '⚔️', desc: 'Seluruh Swordwrath mengamuk: serangan membara kobaran api +50% lebih mematikan.' },
            { id: 'goldenSpearton', name: 'Golden Spartan', cost: 300, icon: '🛡️', desc: 'Memanggil Spearton Emas perkasa 950 HP dengan pertahanan dan serangan masif.' },
            { id: 'trainingHaste', name: 'Training Haste', cost: 50, icon: '➰', desc: 'Kecepatan rekrutmen pasukan dipercepat 4x lipat selama 20 detik.' },
            { id: 'lightningStorm', name: 'Lightning Storm', cost: 750, icon: '⚡', desc: '12 petir halilintar dahsyat menghujam patung dan pasukan musuh.' },
            { id: 'summonDead', name: 'Summon Undead', cost: 750, icon: '💀', desc: 'Membangkitkan 5 Prajurit Mayat Hidup Beracun dari dalam tanah.' },
            { id: 'goldRush', name: 'Gold Rush', cost: 100, icon: '💰', desc: 'Seketika menambahkan peti harta karun +450 Emas & isi penuh tas penambang.' },
            { id: 'summonMarrowkai', name: 'Summon Marrowkai', cost: 1000, icon: '☠️', desc: 'Memanggil Titan Marrowkai Raja Kematian 1500 HP dengan sabit raksasa.' },
            { id: 'flameHelm', name: 'Flame War Cry', cost: 50, icon: '🔥', desc: 'Pekikan perang membara! Seluruh pasukan mendapat kobaran api (+12 Burn per serangan).' },
            { id: 'divineShield', name: 'Divine Aegis', cost: 500, icon: '🛡️', desc: 'Kubah perlindungan suci! Meredam 70% seluruh kerusakan musuh selama 15 detik.' },
            { id: 'archidonFury', name: 'Archidon Volley', cost: 40, icon: '🏹', desc: 'Pemanah Archidon menembakkan 3 anak panah mematikan secara serentak!' },
            { id: 'massMend', name: 'Holy Mass Mend', cost: 150, icon: '💚', desc: 'Sembuhkan instan +350 HP seluruh prajurit & patung serta hilangkan efek racun & beku!' },
            { id: 'speartonPhalanx', name: 'Spearton Phalanx', cost: 250, icon: '🔱', desc: 'Formasi dinding perisai baja kebal penuh dan memantulkan serangan balik musuh.' },
            { id: 'sprintHaste', name: 'Wind Sprint', cost: 30, icon: '🌪️', desc: 'Kecepatan gerak seluruh prajurit dipercepat hingga +90% (lari secepat angin).' },
            { id: 'toxicCloud', name: 'Toxic Mist', cost: 20, icon: '☣️', desc: 'Kabut racun hijau melumpuhkan barisan musuh (-40 HP instan dan efek racun).' },
            { id: 'royalCrown', name: 'Royal Champion', cost: 100, icon: '👑', desc: 'Panggil Panglima Ksatria Bermahkota Emas 1400 HP dengan kekuatan tempur luar biasa.' },
            { id: 'undeadHorde', name: 'Undead Horde', cost: 300, icon: '💀', desc: 'Bangkitkan kawanan 5 tengkorak mayat hidup prajurit perang dari dalam tanah.' },
            { id: 'electricStorm', name: 'Golden Thunder', cost: 400, icon: '⚡', desc: 'Sambaran 10 petir emas bertubi-tubi membakar patung dan pasukan musuh.' }
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
