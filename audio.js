// Stick War Web Audio Procedural Synthesizer
class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.initialized = false;
        this.bgmPlaying = false;
        this.bgmInterval = null;
        this.musicEnabled = true;
        this.currentTrackIndex = 0;
        this.tracks = [
            "Inamorta War March",
            "Stick War Royal Hymn",
            "Night of the Deads (Zombie)",
            "Battle Climax Symphony"
        ];
    }

    init() {
        if (this.initialized) {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
            return;
        }
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.initialized = true;
            this.startAmbience();
        } catch (e) {
            console.warn("AudioContext not supported", e);
        }
    }

    resume() {
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.ctx && this.ctx.state === 'suspended' && !this.muted) {
            this.ctx.resume();
        }
        return this.muted;
    }

    playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.2, pitchDecay = true) {
        if (this.muted || !this.ctx) return;
        if (this.ctx.state === 'suspended') this.ctx.resume();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);
        if (pitchDecay) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(20, freq * 0.1), now + duration);
        }

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    playNoise(duration = 0.1, gainVal = 0.2, filterFreq = 1000) {
        if (this.muted || !this.ctx) return;
        const bufferSize = this.ctx.sampleRate * duration;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(filterFreq, this.ctx.currentTime);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        noise.start();
    }

    playGold() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(987.77, now); // B5
        osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }

    playMine() {
        this.playTone(1800, 'sine', 0.08, 0.15, true);
        this.playNoise(0.07, 0.15, 3000);
    }

    playSwordSlash() {
        this.playNoise(0.12, 0.25, 4500);
        this.playTone(350, 'sawtooth', 0.1, 0.1, true);
    }

    playSwordHit() {
        this.playTone(200, 'square', 0.09, 0.2, true);
        this.playNoise(0.15, 0.35, 2000);
    }

    playBowShoot() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
    }

    playArrowHit() {
        this.playNoise(0.08, 0.25, 1200);
        this.playTone(280, 'triangle', 0.06, 0.15, true);
    }

    playShieldBlock() {
        this.playTone(400, 'triangle', 0.15, 0.3, true);
        this.playTone(800, 'sine', 0.25, 0.2, true);
        this.playNoise(0.12, 0.25, 5000);
    }

    playSpearThrust() {
        this.playNoise(0.1, 0.2, 3500);
        this.playTone(220, 'triangle', 0.12, 0.2, true);
    }

    playMagicCast() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.2);
        osc.frequency.linearRampToValueAtTime(1200, now + 0.35);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
    }

    playExplosion() {
        this.playNoise(0.4, 0.5, 600);
        this.playTone(120, 'sawtooth', 0.35, 0.4, true);
    }

    playGiantSmash() {
        this.playNoise(0.5, 0.6, 400);
        this.playTone(70, 'sawtooth', 0.45, 0.5, true);
        this.playTone(45, 'sine', 0.6, 0.6, true);
    }

    playSpawn() {
        this.playTone(520, 'triangle', 0.12, 0.15, false);
    }

    playOrderHorn() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.setValueAtTime(390, now + 0.15);
        osc.frequency.setValueAtTime(520, now + 0.35);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.6);
    }

    playVictory() {
        if (this.muted || !this.ctx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.4, 0.3, false);
            }, idx * 160);
        });
    }

    playDefeat() {
        if (this.muted || !this.ctx) return;
        const notes = [440, 392, 349.23, 293.66];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sawtooth', 0.5, 0.25, true);
            }, idx * 250);
        });
    }

    playSpellHeal() {
        if (this.muted || !this.ctx) return;
        const notes = [440, 554.37, 659.25, 880];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.35, 0.25, false);
            }, idx * 75);
        });
    }

    playSpellArrowRain() {
        this.playNoise(0.6, 0.4, 2800);
        this.playTone(180, 'sawtooth', 0.4, 0.25, true);
    }

    playSpellRage() {
        this.playNoise(0.5, 0.5, 1500);
        this.playTone(140, 'sawtooth', 0.45, 0.4, true);
        this.playTone(280, 'triangle', 0.3, 0.3, true);
    }

    playSpellHustle() {
        if (this.muted || !this.ctx) return;
        const notes = [659.25, 880, 1108.73, 1318.51];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.15, 0.2, false);
            }, idx * 55);
        });
    }

    playSpellSummon() {
        this.playTone(300, 'square', 0.25, 0.3, true);
        this.playTone(600, 'triangle', 0.4, 0.3, false);
        this.playNoise(0.3, 0.35, 3000);
    }

    // New 5 Spell Sound Effects
    playSpellHaste() {
        // Whip snap & rapid rush chime
        this.playNoise(0.08, 0.45, 4500);
        const notes = [587.33, 783.99, 1046.50, 1396.91];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.12, 0.25, false);
            }, idx * 45);
        });
    }

    playSpellLightning() {
        // Thunderclap strike & crackle
        this.playTone(85, 'sawtooth', 0.5, 0.45, true);
        this.playNoise(0.7, 0.5, 3800);
        setTimeout(() => {
            this.playNoise(0.4, 0.3, 1200);
        }, 80);
    }

    playSpellDead() {
        // Undead dark reanimation drone & bone rattle
        this.playTone(95, 'sawtooth', 0.6, 0.4, false);
        this.playTone(142, 'triangle', 0.5, 0.3, true);
        this.playNoise(0.25, 0.25, 1800);
    }

    playSpellGoldRush() {
        // Cascade of gleaming gold coins
        const notes = [880, 1108.73, 1318.51, 1760];
        for (let i = 0; i < 6; i++) {
            setTimeout(() => {
                const note = notes[i % notes.length];
                this.playTone(note, 'triangle', 0.18, 0.25, false);
            }, i * 70);
        }
    }

    playSpellMarrowkai() {
        // Colossal titan ground roar & seismic tremor
        this.playTone(50, 'sawtooth', 0.9, 0.55, true);
        this.playTone(82, 'square', 0.7, 0.4, true);
        this.playNoise(0.8, 0.5, 600);
    }

    playIceFreeze() {
        // Crystalline ice freeze crack & chilling chime
        if (this.muted || !this.ctx) return;
        this.playNoise(0.12, 0.35, 6000);
        const notes = [1046.50, 1318.51, 1567.98, 2093.00];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'sine', 0.25, 0.18, true);
            }, idx * 40);
        });
    }

    playFireBurn() {
        // Sizzling flame burst & combustion crackle
        if (this.muted || !this.ctx) return;
        this.playNoise(0.22, 0.4, 2400);
        this.playTone(130, 'sawtooth', 0.18, 0.25, true);
    }

    playCriticalHit() {
        // Heavy impactful 2x critical strike clash
        if (this.muted || !this.ctx) return;
        this.playTone(85, 'sawtooth', 0.25, 0.4, true);
        this.playTone(170, 'square', 0.15, 0.3, true);
        this.playNoise(0.18, 0.45, 3200);
    }

    playStarChime() {
        // Divine golden star power chime
        if (this.muted || !this.ctx) return;
        const notes = [587.33, 880, 1174.66, 1760];
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                this.playTone(freq, 'triangle', 0.2, 0.2, false);
            }, idx * 60);
        });
    }

    playBrassNote(freq, duration = 0.28, gainVal = 0.12) {
        if (this.muted || !this.musicEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 1.004, now); // subtle detune for brass chorus

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3.5, now);
        filter.frequency.exponentialRampToValueAtTime(freq * 1.8, now + duration);

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }

    playFluteNote(freq, duration = 0.35, gainVal = 0.1) {
        if (this.muted || !this.musicEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 2.2, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(gainVal, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    playBellNote(freq, duration = 0.5, gainVal = 0.09) {
        if (this.muted || !this.musicEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 2.76, now); // Metallic overtone

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }

    playPluckNote(freq, duration = 0.3, gainVal = 0.1) {
        if (this.muted || !this.musicEnabled || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(freq * 3, now);
        filter.frequency.exponentialRampToValueAtTime(freq, now + duration);

        gain.gain.setValueAtTime(gainVal, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + duration);
    }

    toggleBGM() {
        this.musicEnabled = !this.musicEnabled;
        if (this.musicEnabled) {
            this.startBGM(this.currentTrackIndex);
        } else {
            this.stopBGM();
        }
        return this.musicEnabled;
    }

    getTrackName() {
        const names = [
            "Inamorta War March",
            "Stick War Royal Hymn",
            "Night of the Deads (Zombie)",
            "Battle Climax Symphony"
        ];
        return names[this.currentTrackIndex || 0] || "Inamorta War March";
    }

    nextTrack() {
        if (!this.currentTrackIndex) this.currentTrackIndex = 0;
        this.currentTrackIndex = (this.currentTrackIndex + 1) % 4;
        if (this.musicEnabled) {
            this.stopBGM();
            this.startBGM(this.currentTrackIndex);
        }
        return this.getTrackName();
    }

    setTrack(index) {
        this.currentTrackIndex = Math.max(0, Math.min(3, index));
        if (this.musicEnabled) {
            this.stopBGM();
            this.startBGM(this.currentTrackIndex);
        }
        return this.getTrackName();
    }

    stopWarTheme() {
        this.stopBGM();
    }

    stopBGM() {
        if (this.bgmInterval) {
            clearInterval(this.bgmInterval);
            this.bgmInterval = null;
        }
        this.bgmPlaying = false;
    }

    startWarTheme() {
        this.startBGM(this.currentTrackIndex || 0);
    }

    startBGM(trackIdx = 0) {
        if (!this.ctx || !this.musicEnabled) return;
        this.stopBGM();
        this.bgmPlaying = true;
        this.currentTrackIndex = trackIdx;
        let beat = 0;

        if (trackIdx === 0) {
            // Track 0: Inamorta War March (136 BPM March)
            const melody = [
                293.66, 0, 293.66, 349.23, 392.00, 440.00, 0, 392.00,
                349.23, 0, 293.66, 0, 261.63, 0, 293.66, 0,
                349.23, 0, 392.00, 440.00, 523.25, 0, 440.00, 0,
                392.00, 349.23, 293.66, 0, 261.63, 0, 293.66, 0
            ];
            const bassNotes = [
                73.42, 73.42, 73.42, 73.42, 58.27, 58.27, 58.27, 58.27,
                65.41, 65.41, 65.41, 65.41, 55.00, 55.00, 55.00, 55.00
            ];

            this.bgmInterval = setInterval(() => {
                if (this.muted || !this.musicEnabled || !this.ctx) return;
                if (this.ctx.state === 'suspended') return;
                const step = beat % 32;
                const bassStep = Math.floor(beat / 2) % 16;

                if (step % 4 === 0) {
                    this.playTone(60, 'sine', 0.22, 0.22, true);
                    this.playNoise(0.08, 0.1, 300);
                }
                if (step % 4 === 2) {
                    this.playNoise(0.12, 0.14, 1500);
                    this.playTone(190, 'triangle', 0.08, 0.08, true);
                }
                const bassFreq = bassNotes[bassStep];
                if (bassFreq && beat % 2 === 0) {
                    this.playTone(bassFreq, 'sawtooth', 0.22, 0.09, false);
                }
                const note = melody[step];
                if (note > 0) {
                    this.playBrassNote(note, 0.28, 0.13);
                }
                beat++;
            }, 220);
        } else if (trackIdx === 1) {
            // Track 1: Stick War Royal Hymn (Relaxing, Enak Didengar, Akustik Kerajaan 110 BPM)
            const hymnMelody = [
                329.63, 392.00, 440.00, 493.88, 440.00, 392.00, 329.63, 293.66,
                329.63, 440.00, 493.88, 587.33, 493.88, 440.00, 392.00, 0,
                329.63, 392.00, 440.00, 493.88, 523.25, 493.88, 440.00, 392.00,
                440.00, 392.00, 329.63, 293.66, 329.63, 0, 329.63, 0
            ];
            const arpeggios = [
                164.81, 246.94, 329.63, 392.00,
                146.83, 220.00, 293.66, 369.99,
                130.81, 196.00, 261.63, 329.63,
                164.81, 246.94, 329.63, 392.00
            ];

            this.bgmInterval = setInterval(() => {
                if (this.muted || !this.musicEnabled || !this.ctx) return;
                if (this.ctx.state === 'suspended') return;
                const step = beat % 32;
                const arpStep = beat % 16;

                // Gentle royal harp pluck
                const arpNote = arpeggios[arpStep];
                if (arpNote) this.playPluckNote(arpNote, 0.35, 0.08);

                // Flute / Oboe lead melody
                const leadNote = hymnMelody[step];
                if (leadNote > 0 && beat % 2 === 0) {
                    this.playFluteNote(leadNote, 0.45, 0.12);
                }

                // Soft background heartbeat percussion
                if (step % 8 === 0) {
                    this.playTone(55, 'sine', 0.25, 0.12, true);
                }

                beat++;
            }, 270);
        } else if (trackIdx === 2) {
            // Track 2: Night of the Deads (Zombie Horde Night Mode - Spooky, Menegangkan, 120 BPM)
            const darkMelody = [
                220.00, 0, 233.08, 0, 220.00, 0, 207.65, 0,
                220.00, 0, 261.63, 0, 246.94, 0, 233.08, 0,
                220.00, 0, 277.18, 0, 261.63, 0, 246.94, 0,
                233.08, 0, 220.00, 0, 196.00, 0, 220.00, 0
            ];

            this.bgmInterval = setInterval(() => {
                if (this.muted || !this.musicEnabled || !this.ctx) return;
                if (this.ctx.state === 'suspended') return;
                const step = beat % 32;

                // 1. Spooky zombie bells
                const bell = darkMelody[step];
                if (bell > 0) {
                    this.playBellNote(bell * 1.5, 0.55, 0.11);
                }

                // 2. Heavy eerie dungeon thud
                if (step % 4 === 0) {
                    this.playTone(45, 'sawtooth', 0.28, 0.24, true);
                    this.playNoise(0.06, 0.08, 250);
                }

                // 3. Rattling zombie bone chimes
                if (step % 4 === 2) {
                    this.playNoise(0.14, 0.12, 2800);
                }

                // 4. Low pulsing sub-bass
                if (beat % 2 === 0) {
                    this.playTone(55, 'sine', 0.35, 0.15, false);
                }

                beat++;
            }, 240);
        } else if (trackIdx === 3) {
            // Track 3: Battle Climax Symphony (High-octane Epic Battle, 150 BPM)
            const battleLead = [
                392.00, 392.00, 440.00, 493.88, 523.25, 523.25, 493.88, 440.00,
                392.00, 440.00, 493.88, 587.33, 523.25, 493.88, 440.00, 392.00,
                587.33, 587.33, 523.25, 493.88, 440.00, 440.00, 493.88, 523.25,
                493.88, 440.00, 392.00, 349.23, 392.00, 0, 392.00, 0
            ];

            this.bgmInterval = setInterval(() => {
                if (this.muted || !this.musicEnabled || !this.ctx) return;
                if (this.ctx.state === 'suspended') return;
                const step = beat % 32;

                // High speed war gallop
                if (step % 2 === 0) {
                    this.playTone(70, 'triangle', 0.12, 0.18, true);
                }
                if (step % 4 === 2) {
                    this.playNoise(0.08, 0.16, 2200);
                }

                // Epic Brass Fanfare
                const note = battleLead[step];
                if (note > 0) {
                    this.playBrassNote(note, 0.22, 0.15);
                }

                beat++;
            }, 190);
        }
    }

    startAmbience() {
        if (!this.musicEnabled) return;
        this.startBGM(this.currentTrackIndex || 0);
    }
}

window.soundCtrl = new SoundController();
