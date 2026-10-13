// Stick War Procedural Stickman Animation & Rendering Engine
class StickmanRenderer {
    static hasSkin(unit, skinName) {
        if (!skinName || skinName === 'classic') return false;
        if (!unit) return false;
        if (Array.isArray(unit.skins) && unit.skins.includes(skinName)) return true;
        if (unit.skin && (unit.skin === skinName || unit.skin.includes(skinName))) return true;
        if (unit.team === 'player' && window.game) {
            if (window.game.mixSkinUnlocked && Array.isArray(window.game.equippedSkins) && window.game.equippedSkins.includes(skinName)) return true;
            if (window.game.equippedSkin === skinName) return true;
        }
        if (unit.team === 'enemy' && window.game) {
            if (window.game.difficulty !== 'insane' && window.game.enemyEquippedSkin === skinName) return true;
        }
        return false;
    }

    static draw(ctx, unit, time) {
        ctx.save();
        ctx.translate(unit.x, unit.y);
        ctx.scale(unit.dir * unit.scale, unit.scale);

        const isPlayer = unit.team === 'player';
        const isNight = window.game && window.game.isNight;
        const isZombie = !isPlayer && isNight;

        const hasFire = StickmanRenderer.hasSkin(unit, 'fire');
        const hasIce = StickmanRenderer.hasSkin(unit, 'ice');
        const hasBomb = StickmanRenderer.hasSkin(unit, 'bomb');
        const hasVampire = StickmanRenderer.hasSkin(unit, 'vampire');
        const hasSavage = StickmanRenderer.hasSkin(unit, 'savage');
        const hasLeaf = StickmanRenderer.hasSkin(unit, 'leaf');
        const hasVoltaic = StickmanRenderer.hasSkin(unit, 'voltaic');

        let teamColor = isPlayer ? '#00e5ff' : '#ff3344';
        let bodyColor = '#1a1a1a';
        let skinGlow = null;

        if (hasVoltaic) {
            bodyColor = '#0f172a';
            teamColor = isPlayer ? '#38bdf8' : '#facc15';
            skinGlow = '#38bdf8';
        } else if (hasLeaf) {
            bodyColor = '#152b1b';
            teamColor = isPlayer ? '#4ade80' : '#84cc16';
            skinGlow = '#4ade80';
        } else if (hasSavage) {
            bodyColor = '#241a13';
            teamColor = isPlayer ? '#10b981' : '#d97706';
            skinGlow = '#10b981';
        } else if (hasFire) {
            bodyColor = '#2b1104';
            teamColor = isPlayer ? '#ff6b00' : '#f97316';
            skinGlow = '#f97316';
        } else if (hasIce) {
            bodyColor = '#082f49';
            teamColor = isPlayer ? '#00f0ff' : '#38bdf8';
            skinGlow = '#38bdf8';
        } else if (hasBomb) {
            bodyColor = '#1c1917';
            teamColor = isPlayer ? '#f59e0b' : '#ea580c';
            skinGlow = '#f59e0b';
        } else if (hasVampire) {
            bodyColor = '#1c0f16';
            teamColor = isPlayer ? '#f43f5e' : '#be123c';
            skinGlow = '#e11d48';
        } else if (isZombie) {
            bodyColor = '#273822';
            teamColor = '#ef4444';
            skinGlow = '#22c55e';
        }

        // Draw selection / controlled aura under feet (Player & Enemy Mode Gila-Gilaan)
        if (unit.isControlled || unit.isEnemyControlled) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 26, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = unit.isEnemyControlled ? 'rgba(239, 68, 68, 0.45)' : 'rgba(255, 215, 0, 0.45)';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = unit.isEnemyControlled ? '#ef4444' : '#ffd700';
            ctx.shadowColor = unit.isEnemyControlled ? '#ef4444' : '#ffd700';
            ctx.shadowBlur = 12;
            ctx.stroke();
            ctx.restore();
        }

        // Draw Fire Skin Aura
        if (hasFire) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(249, 115, 22, 0.45)';
            ctx.shadowColor = '#f97316';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
        }

        // Draw Ice Skin Aura
        if (hasIce) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
        }

        // Draw Bomb Skin Aura
        if (hasBomb) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
            ctx.shadowColor = '#f59e0b';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.restore();
        }

        // Draw Vampire Skin Aura
        if (hasVampire) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(225, 29, 72, 0.45)';
            ctx.shadowColor = '#e11d48';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.restore();
        }

        // Draw Savage Skin Aura (Emerald & Tribal Bone Glow)
        if (hasSavage) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(16, 185, 129, 0.45)';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.strokeStyle = '#fef08a';
            ctx.lineWidth = 1.2;
            ctx.stroke();
            ctx.restore();
        }

        // Draw Leaf Skin Aura (Nature Emerald Swirl & Petals)
        if (hasLeaf) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(74, 222, 128, 0.45)';
            ctx.shadowColor = '#4ade80';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.strokeStyle = '#22c55e';
            ctx.lineWidth = 1.4;
            ctx.stroke();
            // Floating nature leaf petals
            for (let i = 0; i < 3; i++) {
                const pAngle = (time * 2.5 + i * 2.1) % (Math.PI * 2);
                const px = Math.cos(pAngle) * 18;
                const py = Math.sin(pAngle) * 6 - 5;
                ctx.beginPath();
                ctx.ellipse(px, py, 3.5, 1.8, pAngle, 0, Math.PI * 2);
                ctx.fillStyle = '#4ade80';
                ctx.fill();
            }
            ctx.restore();
        }

        // Draw Voltaic Skin Aura (High-Voltage Electric Pulse & Rings)
        if (hasVoltaic) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 24, 7, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 16;
            ctx.fill();
            ctx.strokeStyle = '#facc15';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            // Crackling lightning spark arcs
            const t = time * 8;
            for (let i = 0; i < 4; i++) {
                const pAngle = (t + i * 1.57) % (Math.PI * 2);
                const px = Math.cos(pAngle) * (16 + Math.sin(t * 3 + i) * 6);
                const py = Math.sin(pAngle) * (6 + Math.cos(t * 2 + i) * 2) - 4;
                ctx.beginPath();
                ctx.arc(px, py, 2.2, 0, Math.PI * 2);
                ctx.fillStyle = (i % 2 === 0) ? '#38bdf8' : '#facc15';
                ctx.shadowColor = '#38bdf8';
                ctx.shadowBlur = 8;
                ctx.fill();
            }
            ctx.restore();
        }

        // Draw Zombie Swamp Rot Aura
        if (isZombie) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 20, 5, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(34, 197, 94, 0.35)';
            ctx.shadowColor = '#22c55e';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.restore();
        }

        // Draw Rage Fire Aura under feet
        if (unit.rageTimer > 0) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(239, 68, 68, 0.55)';
            ctx.shadowColor = '#ef4444';
            ctx.shadowBlur = 12;
            ctx.fill();
            ctx.restore();
        }

        // Draw Golden Spearton Royal Aura
        if (unit.isGolden) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 26, 8, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(255, 215, 0, 0.4)';
            ctx.shadowColor = '#ffd700';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#ffd700';
            ctx.stroke();
            ctx.restore();
        }

        // Draw Emergency Reinforcement Battle Aura (Bala Bantuan Asli)
        if (unit.isEmergencyReinforcement) {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 28, 9, 0, 0, Math.PI * 2);
            ctx.fillStyle = isPlayer ? 'rgba(56, 189, 248, 0.45)' : 'rgba(239, 68, 68, 0.45)';
            ctx.shadowColor = isPlayer ? '#38bdf8' : '#ef4444';
            ctx.shadowBlur = 18;
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = isPlayer ? '#ffd700' : '#ff4500';
            ctx.stroke();
            ctx.restore();
        }

        // Procedural joint positions & HD Real Animation
        const cycle = unit.animProgress;
        const isWalking = unit.state === 'walk';
        const isAttacking = unit.state === 'attack';
        const isMining = unit.state === 'mine';
        const isBlocking = unit.state === 'block';
        const isHurt = unit.hurtTimer > 0;
        const isDead = unit.state === 'dead';
        const isIdle = !isWalking && !isAttacking && !isMining && !isBlocking && !isHurt && !isDead;

        // HD Real Animation: Dynamic Realistic Radial Ground Shadow
        if (window.game && window.game.isHD && !isDead) {
            ctx.save();
            const shadowBounce = isWalking ? (1.0 + Math.sin(cycle * Math.PI * 4) * 0.14) : (1.0 + Math.sin((time || 0) * 2.5) * 0.05);
            const sGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 20 * shadowBounce);
            sGrad.addColorStop(0, 'rgba(0, 0, 0, 0.42)');
            sGrad.addColorStop(0.55, 'rgba(0, 0, 0, 0.18)');
            sGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = sGrad;
            ctx.beginPath();
            ctx.ellipse(0, 0, 22 * shadowBounce, 6.5 * shadowBounce, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }

        // HD Real Animation: Natural Breathing Bobbing & Secondary Physics
        const breathBob = (window.game && window.game.isHD && isIdle) ? Math.sin((time || 0) * 2.8 + (unit.x % 90) * 0.1) * 1.5 : 0;
        const walkBob = (window.game && window.game.isHD && isWalking) ? Math.abs(Math.sin(cycle * Math.PI * 2)) * 2.0 : 0;

        // Calculate dynamic limb angles
        let legSwing = isWalking ? Math.sin(cycle * Math.PI * 2) * 0.6 : 0;
        let spineTilt = isWalking ? 0.15 : (isBlocking ? -0.1 : 0);
        let headTilt = isWalking ? Math.sin(cycle * Math.PI * 2) * 0.08 : 0;

        if (isAttacking) {
            spineTilt = 0.25;
        } else if (isHurt) {
            spineTilt = -0.3;
            legSwing = 0;
        }

        if (isDead) {
            // Death tumble rendering
            this.drawDeadUnit(ctx, unit, bodyColor, teamColor);
            ctx.restore();
            return;
        }

        // Baseline offsets (responsive to natural breathing)
        const hipY = -35 + breathBob * 0.4 - walkBob * 0.5;
        const neckY = -68 + breathBob - walkBob;
        const headY = -82 + breathBob * 1.2 - walkBob;
        const headR = 10;

        // Limbs calculation
        const leftLegAngle = legSwing;
        const rightLegAngle = -legSwing;

        // Draw back leg
        this.drawLeg(ctx, 0, hipY, rightLegAngle, 18, 20, bodyColor);

        // Draw Cape / Robe for Magikill
        if (unit.type === 'magikill') {
            this.drawMageCape(ctx, spineTilt * 12, neckY, hipY, isWalking, cycle, teamColor);
        }

        // Draw Miner Sack
        if (unit.type === 'miner' && unit.carriedGold > 0) {
            this.drawMinerSack(ctx, -10, neckY + 12, unit.carriedGold);
        }

        // Draw Torso (Spine)
        ctx.beginPath();
        ctx.moveTo(0, hipY);
        ctx.lineTo(spineTilt * 12, neckY);
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = bodyColor;
        ctx.stroke();

        // Draw Front Leg
        this.drawLeg(ctx, 0, hipY, leftLegAngle, 18, 20, bodyColor);

        // Neck position
        const neckX = spineTilt * 12;

        // Draw Head
        const hX = neckX + headTilt * 6;
        const hY = headY;
        ctx.beginPath();
        ctx.arc(hX, hY, headR, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#000';
        ctx.stroke();

        // Eyes
        this.drawEyes(ctx, hX, hY, unit);

        // Specific Headgear / Accessories
        if (hasSavage) {
            if (unit.type !== 'giant' && unit.type !== 'marrowkai') {
                this.drawSavageFeatures(ctx, hX, hY, neckX, neckY, hipY, isWalking, cycle, unit);
            } else if (unit.type === 'giant') {
                this.drawGiantFeatures(ctx, hX, hY);
                this.drawSavageFeatures(ctx, hX, hY, neckX, neckY, hipY, isWalking, cycle, unit);
            } else if (unit.type === 'marrowkai') {
                this.drawMarrowkaiHorns(ctx, hX, hY);
                this.drawMarrowkaiWings(ctx, neckX, neckY);
            }
        } else {
            if (unit.type === 'spearton') {
                this.drawSpartanHelmet(ctx, hX, hY, teamColor, unit.isGolden);
            } else if (unit.type === 'magikill') {
                this.drawWizardHat(ctx, hX, hY, teamColor);
                this.drawWizardBeard(ctx, hX, hY);
            } else if (unit.type === 'miner') {
                this.drawMinerHat(ctx, hX, hY);
            } else if (unit.type === 'giant') {
                this.drawGiantFeatures(ctx, hX, hY);
            } else if (unit.type === 'undead') {
                this.drawUndeadSkull(ctx, hX, hY);
            } else if (unit.type === 'minion') {
                this.drawMinionSkullMask(ctx, hX, hY, unit);
            } else if (unit.type === 'marrowkai') {
                this.drawMarrowkaiHorns(ctx, hX, hY);
                this.drawMarrowkaiWings(ctx, neckX, neckY);
            }
        }

        // Skin specific accessories
        if (hasBomb) {
            this.drawBombFuse(ctx, hX, hY);
            this.drawBombBelt(ctx, neckX, neckY, hipY);
        }
        if (hasVampire) {
            this.drawVampireCape(ctx, neckX, neckY, hipY, isWalking, cycle);
            this.drawVampireFangs(ctx, hX, hY);
        }
        if (hasLeaf) {
            this.drawLeafCrown(ctx, hX, hY);
            this.drawLeafSash(ctx, neckX, neckY, hipY);
        }
        if (hasVoltaic) {
            this.drawVoltaicCrest(ctx, hX, hY);
            this.drawVoltaicPauldrons(ctx, neckX, neckY, hipY);
        }

        // Arms & Weapons
        this.drawArmsAndWeapons(ctx, unit, neckX, neckY, bodyColor, teamColor);

        // Render Frozen Ice Crystal Block (if frozenTimer > 0)
        if (unit.frozenTimer > 0) {
            ctx.save();
            ctx.beginPath();
            const iceH = (unit.type === 'giant' ? 140 : 85);
            const iceW = (unit.type === 'giant' ? 70 : 44);
            ctx.roundRect(-iceW / 2, -iceH + 10, iceW, iceH, 6);
            ctx.fillStyle = 'rgba(186, 230, 253, 0.6)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.strokeStyle = '#bae6fd';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Frozen crystal facets & light reflections
            ctx.beginPath();
            ctx.moveTo(-iceW * 0.35, -iceH * 0.8);
            ctx.lineTo(-iceW * 0.1, -iceH * 0.45);
            ctx.lineTo(iceW * 0.25, -iceH * 0.75);
            ctx.moveTo(-iceW * 0.2, -iceH * 0.3);
            ctx.lineTo(iceW * 0.3, -iceH * 0.15);
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.lineWidth = 1.8;
            ctx.stroke();
            ctx.restore();
        }

        // Render Burning Flame Smoke & Embers (if burnTimer > 0)
        if (unit.burnTimer > 0) {
            ctx.save();
            ctx.beginPath();
            const flameH = (unit.type === 'giant' ? 120 : 70);
            ctx.ellipse(0, -flameH * 0.5, 20, flameH * 0.55, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
            ctx.shadowColor = '#ea580c';
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.restore();
        }

        // Render Crackling Electric Lightning Arcs (if electrifiedTimer > 0)
        if (unit.electrifiedTimer > 0) {
            ctx.save();
            ctx.strokeStyle = Math.random() < 0.5 ? '#38bdf8' : '#facc15';
            ctx.lineWidth = 1.8;
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            const bodyH = (unit.type === 'giant' ? 120 : 65);
            // 3 dynamic jagged lightning bolts wrapping around body
            for (let i = 0; i < 3; i++) {
                const startY = -bodyH * 0.9 + i * (bodyH * 0.35);
                const startX = (Math.random() - 0.5) * 16;
                const midX = startX + (Math.random() - 0.5) * 22;
                const endX = (Math.random() - 0.5) * 18;
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(midX, startY + 12);
                ctx.lineTo(endX, startY + 24);
                ctx.stroke();
            }
            ctx.restore();
        }

        ctx.restore();

        // Draw Health Bar & Status
        if (!isDead) {
            this.drawHealthBar(ctx, unit);
        }
    }

    static drawLeg(ctx, startX, startY, angle, thighLen, shinLen, color) {
        ctx.save();
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        const kneeX = startX + Math.sin(angle) * thighLen;
        const kneeY = startY + Math.cos(angle) * thighLen;

        const footAngle = angle - 0.2;
        const footX = kneeX + Math.sin(footAngle) * shinLen;
        const footY = kneeY + Math.cos(footAngle) * shinLen;

        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();
        ctx.restore();
    }

    static drawEyes(ctx, hX, hY, unit) {
        ctx.save();
        const isPlayer = unit.team === 'player';
        const isZombie = !isPlayer && (window.game && window.game.isNight);

        let eyeColor = isPlayer ? '#fff' : '#ff5555';
        if (StickmanRenderer.hasSkin(unit, 'voltaic')) eyeColor = '#38bdf8';
        else if (StickmanRenderer.hasSkin(unit, 'leaf')) eyeColor = '#4ade80';
        else if (StickmanRenderer.hasSkin(unit, 'savage')) eyeColor = '#34d399';
        else if (StickmanRenderer.hasSkin(unit, 'fire')) eyeColor = '#fbbf24';
        else if (StickmanRenderer.hasSkin(unit, 'ice')) eyeColor = '#38bdf8';
        else if (StickmanRenderer.hasSkin(unit, 'vampire')) eyeColor = '#ff0033';
        else if (StickmanRenderer.hasSkin(unit, 'bomb')) eyeColor = '#f59e0b';
        if (isZombie) eyeColor = '#ef4444';
        if (unit.type === 'undead') eyeColor = '#10b981';
        if (unit.type === 'marrowkai') eyeColor = '#c084fc';
        const eyeX = hX + 4;
        const eyeY = hY - 1;

        if (unit.state === 'attack' || unit.type === 'giant') {
            // Angry angled eyes
            ctx.beginPath();
            ctx.moveTo(eyeX - 3, eyeY - 2);
            ctx.lineTo(eyeX + 3, eyeY + 1);
            ctx.lineWidth = 2;
            ctx.strokeStyle = eyeColor;
            ctx.stroke();
        } else {
            // Intense dot eye
            ctx.beginPath();
            ctx.arc(eyeX, eyeY, 2.2, 0, Math.PI * 2);
            ctx.fillStyle = eyeColor;
            ctx.fill();
        }
        ctx.restore();
    }

    static drawSpartanHelmet(ctx, hX, hY, teamColor, isGolden = false) {
        ctx.save();
        // Helmet Dome
        ctx.beginPath();
        ctx.arc(hX, hY - 2, 12, Math.PI * 0.9, Math.PI * 2.1);
        ctx.lineTo(hX + 11, hY + 6);
        ctx.lineTo(hX + 4, hY + 8);
        ctx.lineTo(hX - 6, hY + 9);
        ctx.lineTo(hX - 11, hY + 3);
        ctx.closePath();
        ctx.fillStyle = isGolden ? '#ffd700' : '#4a5568';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = isGolden ? '#b7791f' : '#2d3748';
        ctx.stroke();

        // Nose guard and cheek plates
        ctx.beginPath();
        ctx.moveTo(hX + 2, hY - 4);
        ctx.lineTo(hX + 6, hY + 5);
        ctx.strokeStyle = '#cbd5e0';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Iconic Red Crest / Plume
        ctx.beginPath();
        ctx.moveTo(hX - 14, hY - 10);
        ctx.quadraticCurveTo(hX, hY - 24, hX + 15, hY - 12);
        ctx.quadraticCurveTo(hX + 3, hY - 17, hX - 14, hY - 10);
        ctx.fillStyle = teamColor === '#00e5ff' ? '#e53e3e' : '#9b2c2c';
        ctx.fill();

        // Crest bristles texture
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#c53030';
        for (let i = -12; i <= 14; i += 4) {
            ctx.beginPath();
            ctx.moveTo(hX + i, hY - 13);
            ctx.lineTo(hX + i + 2, hY - 21);
            ctx.stroke();
        }
        ctx.restore();
    }

    static drawWizardHat(ctx, hX, hY, teamColor) {
        ctx.save();
        // Hat Brim
        ctx.beginPath();
        ctx.ellipse(hX, hY - 7, 18, 5, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#2b1b4d';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#1a102f';
        ctx.stroke();

        // Cone
        ctx.beginPath();
        ctx.moveTo(hX - 12, hY - 8);
        ctx.quadraticCurveTo(hX - 4, hY - 25, hX - 10, hY - 34);
        ctx.quadraticCurveTo(hX + 6, hY - 22, hX + 12, hY - 8);
        ctx.closePath();
        ctx.fillStyle = '#3c236e';
        ctx.fill();
        ctx.stroke();

        // Hat Band
        ctx.beginPath();
        ctx.moveTo(hX - 12, hY - 9);
        ctx.lineTo(hX + 12, hY - 7);
        ctx.lineWidth = 3;
        ctx.strokeStyle = teamColor;
        ctx.stroke();

        // Magic star buckle
        ctx.beginPath();
        ctx.arc(hX + 1, hY - 8, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffd700';
        ctx.fill();
        ctx.restore();
    }

    static drawWizardBeard(ctx, hX, hY) {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(hX + 2, hY + 4);
        ctx.quadraticCurveTo(hX + 10, hY + 12, hX + 4, hY + 22);
        ctx.quadraticCurveTo(hX - 2, hY + 14, hX - 2, hY + 5);
        ctx.fillStyle = '#f7fafc';
        ctx.fill();
        ctx.restore();
    }

    static drawMageCape(ctx, neckX, neckY, hipY, isWalking, cycle, teamColor) {
        ctx.save();
        const flutter = isWalking ? Math.sin(cycle * Math.PI * 2) * 8 : Math.sin(Date.now() * 0.005) * 3;
        ctx.beginPath();
        ctx.moveTo(neckX - 4, neckY + 2);
        ctx.quadraticCurveTo(-14 - flutter, hipY + 10, -22 - flutter, hipY + 28);
        ctx.lineTo(-10 - flutter, hipY + 26);
        ctx.lineTo(0, hipY);
        ctx.fillStyle = 'rgba(43, 27, 77, 0.85)';
        ctx.fill();
        ctx.restore();
    }

    static drawMinerHat(ctx, hX, hY) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(hX, hY - 7, 13, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#b7791f';
        ctx.fill();
        // Headlamp
        ctx.beginPath();
        ctx.arc(hX + 6, hY - 7, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#fefcbf';
        ctx.fill();
        ctx.restore();
    }

    static drawGiantFeatures(ctx, hX, hY) {
        ctx.save();
        // Heavy brow
        ctx.beginPath();
        ctx.moveTo(hX - 8, hY - 5);
        ctx.lineTo(hX + 10, hY - 2);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#0a0a0a';
        ctx.stroke();
        ctx.restore();
    }

    static drawMinerSack(ctx, sX, sY, goldAmt) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(sX, sY, 9 + Math.min(6, goldAmt * 0.06), 0, Math.PI * 2);
        ctx.fillStyle = '#8b5a2b';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#4a2f13';
        ctx.stroke();

        // Visible gold nugget
        ctx.beginPath();
        ctx.arc(sX + 2, sY - 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ecc94b';
        ctx.fill();
        ctx.restore();
    }

    static drawArmsAndWeapons(ctx, unit, shoulderX, shoulderY, bodyColor, teamColor) {
        const type = unit.type;
        const progress = unit.attackProgress || 0;
        const isAttacking = unit.state === 'attack';
        const isMining = unit.state === 'mine';
        const isBlocking = unit.state === 'block';

        ctx.save();
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = bodyColor;

        if (type === 'miner') {
            this.drawMinerArmAndPickaxe(ctx, shoulderX, shoulderY, unit, isMining);
        } else if (type === 'swordwrath') {
            this.drawSwordwrathArms(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        } else if (type === 'archidon') {
            this.drawArchidonBow(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        } else if (type === 'spearton') {
            this.drawSpeartonEquipment(ctx, shoulderX, shoulderY, unit, isAttacking, isBlocking, progress, teamColor);
        } else if (type === 'magikill') {
            this.drawMagikillStaff(ctx, shoulderX, shoulderY, unit, isAttacking, progress, teamColor);
        } else if (type === 'giant') {
            this.drawGiantClub(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        } else if (type === 'undead') {
            this.drawUndeadClaws(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        } else if (type === 'minion') {
            this.drawMinionBoneDagger(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        } else if (type === 'marrowkai') {
            this.drawMarrowkaiScythe(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        }

        ctx.restore();
    }

    static drawMinionSkullMask(ctx, hX, hY, unit) {
        ctx.save();
        const isSavage = StickmanRenderer.hasSkin(unit, 'savage');

        // White curved bone skull mask covering face with crest horn
        ctx.beginPath();
        ctx.moveTo(hX - 6, hY - 6);
        ctx.quadraticCurveTo(hX - 11, hY - 14, hX - 2, hY - 17); // horn crest pointing back
        if (isSavage) {
            ctx.quadraticCurveTo(hX - 16, hY - 22, hX - 6, hY - 25); // Savage beast horn
        }
        ctx.quadraticCurveTo(hX + 6, hY - 12, hX + 9, hY - 2);
        ctx.lineTo(hX + 6, hY + 8);
        ctx.lineTo(hX - 2, hY + 7);
        ctx.lineTo(hX - 6, hY);
        ctx.closePath();
        ctx.fillStyle = '#f8fafc';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = isSavage ? '#047857' : '#475569';
        ctx.stroke();

        // Dark hollow eye socket (Glowing emerald for Savage)
        ctx.beginPath();
        ctx.ellipse(hX + 3, hY - 1, 3.5, 2.5, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = isSavage ? '#10b981' : '#0f172a';
        if (isSavage) {
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 6;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Jagged teeth lines on jaw
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(hX + 1, hY + 4);
        ctx.lineTo(hX + 5, hY + 4);
        ctx.moveTo(hX + 2, hY + 2);
        ctx.lineTo(hX + 2, hY + 6);
        ctx.moveTo(hX + 4, hY + 2);
        ctx.lineTo(hX + 4, hY + 6);
        ctx.stroke();

        ctx.restore();
    }

    static drawMinionBoneDagger(ctx, sx, sy, unit, isAttacking, progress) {
        const isSavage = StickmanRenderer.hasSkin(unit, 'savage');
        let armAngle = 0.6;
        if (isAttacking) {
            armAngle = -0.7 + Math.sin(progress * Math.PI) * 1.9;
        }

        const handX = sx + Math.cos(armAngle) * 16;
        const handY = sy + Math.sin(armAngle) * 16;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(armAngle + 0.3);

        // Handle
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(8, -2);
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#78350f';
        ctx.stroke();

        // Jagged bone dagger blade (from reference photo 3)
        ctx.beginPath();
        ctx.moveTo(8, -2);
        ctx.lineTo(14, -6);
        ctx.lineTo(18, -3);
        ctx.lineTo(26, -10); // sharp point
        ctx.lineTo(21, 1);
        ctx.lineTo(13, 1);
        ctx.closePath();
        ctx.fillStyle = '#e2e8f0';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = isSavage ? '#10b981' : '#94a3b8';
        ctx.stroke();

        if (isSavage) {
            ctx.beginPath();
            ctx.arc(14, -2, 1.8, 0, Math.PI * 2);
            ctx.fillStyle = '#34d399';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 6;
            ctx.fill();
        }

        ctx.restore();
    }

    static drawBombFuse(ctx, hX, hY) {
        ctx.save();
        // Burning fuse from head
        ctx.beginPath();
        ctx.moveTo(hX, hY - 10);
        ctx.quadraticCurveTo(hX + 4, hY - 16, hX + 2, hY - 20);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Spark at fuse tip
        const sparkTime = Date.now() * 0.01;
        const sSize = 3 + Math.sin(sparkTime) * 1.5;
        ctx.beginPath();
        ctx.arc(hX + 2, hY - 20, sSize, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
        ctx.shadowColor = '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }

    static drawBombBelt(ctx, nX, nY, hipY) {
        ctx.save();
        const midY = (nY + hipY) * 0.5;
        // Belt strap
        ctx.beginPath();
        ctx.moveTo(-6, midY - 2);
        ctx.lineTo(6, midY + 4);
        ctx.strokeStyle = '#451a03';
        ctx.lineWidth = 3;
        ctx.stroke();

        // 3 Red dynamite sticks
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(-5, midY - 6, 3, 10);
        ctx.fillRect(-1, midY - 5, 3, 10);
        ctx.fillRect(3, midY - 4, 3, 10);
        ctx.restore();
    }

    static drawLeafCrown(ctx, hX, hY) {
        ctx.save();
        // Golden/vine wreath band around forehead
        ctx.beginPath();
        ctx.ellipse(hX, hY - 3, 11, 4, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Emerald gemstone at front center
        ctx.beginPath();
        ctx.arc(hX + 9, hY - 3, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#4ade80';
        ctx.shadowColor = '#22c55e';
        ctx.shadowBlur = 6;
        ctx.fill();

        // 4 Laurel leaves along the wreath
        const leafOffsets = [
            { x: -8, y: -5, rot: -0.6 },
            { x: -3, y: -7, rot: -0.2 },
            { x: 3, y: -7, rot: 0.2 },
            { x: 7, y: -5, rot: 0.6 }
        ];
        ctx.fillStyle = '#22c55e';
        ctx.strokeStyle = '#14532d';
        ctx.lineWidth = 0.8;
        for (const lo of leafOffsets) {
            ctx.save();
            ctx.translate(hX + lo.x, hY + lo.y);
            ctx.rotate(lo.rot);
            ctx.beginPath();
            ctx.ellipse(0, 0, 5, 2.2, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.restore();
        }
        ctx.restore();
    }

    static drawLeafSash(ctx, nX, nY, hipY) {
        ctx.save();
        const midY = (nY + hipY) * 0.5;
        // Diagonal vine sash
        ctx.beginPath();
        ctx.moveTo(-6, nY + 2);
        ctx.quadraticCurveTo(0, midY, 6, hipY - 2);
        ctx.strokeStyle = '#15803d';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Small woven leaf clusters on chest
        ctx.fillStyle = '#4ade80';
        ctx.strokeStyle = '#166534';
        ctx.lineWidth = 0.6;
        [-3, 1, 4].forEach((lx, idx) => {
            ctx.beginPath();
            ctx.ellipse(lx, midY + (idx - 1) * 6, 4, 1.8, 0.5 * (idx - 1), 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
        ctx.restore();
    }

    static drawVoltaicCrest(ctx, hX, hY) {
        ctx.save();
        // High-voltage lightning horn horns angled upward
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.2;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 10;

        // Left lightning horn
        ctx.beginPath();
        ctx.moveTo(hX - 4, hY - 8);
        ctx.lineTo(hX - 10, hY - 16);
        ctx.lineTo(hX - 6, hY - 18);
        ctx.lineTo(hX - 14, hY - 26);
        ctx.stroke();

        // Right lightning horn
        ctx.beginPath();
        ctx.moveTo(hX + 4, hY - 8);
        ctx.lineTo(hX + 10, hY - 16);
        ctx.lineTo(hX + 6, hY - 18);
        ctx.lineTo(hX + 14, hY - 26);
        ctx.stroke();

        // Central plasma capacitor node
        ctx.beginPath();
        ctx.arc(hX + 6, hY - 4, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#facc15';
        ctx.shadowColor = '#facc15';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.restore();
    }

    static drawVoltaicPauldrons(ctx, nX, nY, hipY) {
        ctx.save();
        // Electric shoulder pauldron plates
        ctx.fillStyle = '#1e293b';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 6;

        ctx.beginPath();
        ctx.rect(-9, nY - 2, 6, 7);
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.rect(3, nY - 2, 6, 7);
        ctx.fill();
        ctx.stroke();

        // Discharging miniature spark on shoulder
        ctx.fillStyle = '#facc15';
        ctx.beginPath();
        ctx.arc(6, nY + 1, 1.5, 0, Math.PI * 2);
        ctx.arc(-6, nY + 1, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }

    static drawVampireCape(ctx, neckX, neckY, hipY, isWalking, cycle) {
        ctx.save();
        const flutter = isWalking ? Math.sin(cycle * Math.PI * 2) * 9 : Math.sin(Date.now() * 0.006) * 4;
        ctx.beginPath();
        ctx.moveTo(neckX - 3, neckY + 2);
        ctx.quadraticCurveTo(-14 - flutter, hipY + 8, -26 - flutter, hipY + 28);
        ctx.lineTo(-12 - flutter, hipY + 25);
        ctx.lineTo(0, hipY);
        ctx.fillStyle = 'rgba(159, 18, 57, 0.85)'; // Crimson vampire cape
        ctx.fill();
        ctx.restore();
    }

    static drawVampireFangs(ctx, hX, hY) {
        ctx.save();
        // Red glowing vampire eyes
        ctx.beginPath();
        ctx.arc(hX + 4, hY - 2, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#ff0033';
        ctx.shadowColor = '#ff0033';
        ctx.shadowBlur = 6;
        ctx.fill();

        // White fangs
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.moveTo(hX + 2, hY + 4);
        ctx.lineTo(hX + 4, hY + 4);
        ctx.lineTo(hX + 3, hY + 7);
        ctx.fill();
        ctx.restore();
    }

    static drawSavageFeatures(ctx, hX, hY, neckX, neckY, hipY, isWalking, cycle, unit) {
        ctx.save();

        // 1. Feral Lion Fur Collar / Mane (around neck and upper chest)
        const furBob = isWalking ? Math.sin(cycle) * 1.5 : 0;
        ctx.save();
        ctx.translate(neckX, neckY + furBob);

        // Dark chestnut under-fur
        ctx.beginPath();
        ctx.arc(0, 4, 12, 0, Math.PI * 2);
        ctx.fillStyle = '#78350f';
        ctx.fill();

        // Thick jagged spiky fur bristles (Lion-like feral mane)
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        const furPoints = [
            [-12, -4], [-17, 2], [-11, 4],
            [-16, 8], [-9, 9], [-13, 14],
            [-5, 12], [0, 16], [5, 12],
            [13, 14], [9, 9], [16, 8],
            [11, 4], [17, 2], [12, -4]
        ];
        ctx.moveTo(furPoints[0][0], furPoints[0][1]);
        for (let i = 1; i < furPoints.length; i++) {
            ctx.lineTo(furPoints[i][0], furPoints[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#b45309';
        ctx.stroke();

        // Bone Tooth Necklace on chest
        ctx.fillStyle = '#fef3c7';
        for (let t = -8; t <= 8; t += 4) {
            ctx.beginPath();
            ctx.moveTo(t - 1.5, 6);
            ctx.lineTo(t + 1.5, 6);
            ctx.lineTo(t, 12);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();

        // 2. Savage Horned Beast Skull Headdress / Mask (on head hX, hY)
        // Large curved horns protruding from skull temples
        ctx.save();
        // Left Horn (curving upward & backward)
        ctx.beginPath();
        ctx.moveTo(hX - 4, hY - 6);
        ctx.quadraticCurveTo(hX - 16, hY - 14, hX - 22, hY - 8);
        ctx.quadraticCurveTo(hX - 14, hY - 8, hX - 6, hY - 2);
        ctx.closePath();
        ctx.fillStyle = '#f5f5f4';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#78716c';
        ctx.stroke();

        // Left Horn ridges
        ctx.beginPath();
        ctx.moveTo(hX - 10, hY - 7); ctx.lineTo(hX - 12, hY - 11);
        ctx.moveTo(hX - 15, hY - 8); ctx.lineTo(hX - 17, hY - 10);
        ctx.strokeStyle = '#a8a29e';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Right Horn (curving up & forward)
        ctx.beginPath();
        ctx.moveTo(hX + 3, hY - 7);
        ctx.quadraticCurveTo(hX + 12, hY - 18, hX + 6, hY - 22);
        ctx.quadraticCurveTo(hX + 4, hY - 15, hX - 1, hY - 8);
        ctx.closePath();
        ctx.fillStyle = '#f5f5f4';
        ctx.fill();
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#78716c';
        ctx.stroke();

        // Skull Faceplate over upper head
        ctx.beginPath();
        ctx.arc(hX, hY - 1, 9.5, Math.PI * 0.8, Math.PI * 2.2);
        ctx.lineTo(hX + 7, hY + 4);
        ctx.lineTo(hX - 7, hY + 4);
        ctx.closePath();
        ctx.fillStyle = '#f5f5f4';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#57534e';
        ctx.stroke();

        // Dangling bone teeth on jaw brow
        ctx.fillStyle = '#fef08a';
        ctx.beginPath();
        ctx.moveTo(hX - 5, hY + 4); ctx.lineTo(hX - 3, hY + 7); ctx.lineTo(hX - 1, hY + 4);
        ctx.moveTo(hX + 1, hY + 4); ctx.lineTo(hX + 3, hY + 7); ctx.lineTo(hX + 5, hY + 4);
        ctx.fill();

        // Glowing Emerald Forehead Gem (Matching Reference Photo)
        ctx.beginPath();
        ctx.moveTo(hX, hY - 8);
        ctx.lineTo(hX + 3.5, hY - 4);
        ctx.lineTo(hX, hY);
        ctx.lineTo(hX - 3.5, hY - 4);
        ctx.closePath();
        ctx.fillStyle = '#10b981';
        ctx.shadowColor = '#10b981';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = '#047857';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Emerald Specular White Glint
        ctx.beginPath();
        ctx.arc(hX - 1, hY - 5, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        ctx.restore();
        ctx.restore();
    }

    static drawUndeadSkull(ctx, hX, hY) {
        ctx.save();
        // Skeletal brow ridge
        ctx.beginPath();
        ctx.moveTo(hX - 6, hY - 6);
        ctx.lineTo(hX + 7, hY - 4);
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#059669';
        ctx.stroke();

        // Toxic green poison aura wisp
        ctx.beginPath();
        ctx.arc(hX + 3, hY - 2, 8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        ctx.fill();
        ctx.restore();
    }

    static drawMarrowkaiHorns(ctx, hX, hY) {
        ctx.save();
        // Large demonic ram horns
        ctx.strokeStyle = '#4c1d95';
        ctx.lineWidth = 3.5;
        ctx.lineCap = 'round';
        // Left horn
        ctx.beginPath();
        ctx.moveTo(hX - 6, hY - 8);
        ctx.quadraticCurveTo(hX - 16, hY - 18, hX - 12, hY - 26);
        ctx.stroke();
        // Right horn
        ctx.beginPath();
        ctx.moveTo(hX + 6, hY - 8);
        ctx.quadraticCurveTo(hX + 16, hY - 18, hX + 12, hY - 26);
        ctx.stroke();
        ctx.restore();
    }

    static drawMarrowkaiWings(ctx, nX, nY) {
        ctx.save();
        // Large dark bat wings
        ctx.fillStyle = 'rgba(30, 27, 75, 0.85)';
        ctx.strokeStyle = '#581c87';
        ctx.lineWidth = 2;

        const flap = Math.sin(Date.now() * 0.005) * 6;
        // Wing silhouette
        ctx.beginPath();
        ctx.moveTo(nX - 4, nY);
        ctx.lineTo(nX - 38, nY - 42 + flap);
        ctx.lineTo(nX - 24, nY - 18 + flap);
        ctx.lineTo(nX - 12, nY - 6);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
    }

    static drawUndeadClaws(ctx, sx, sy, unit, isAttacking, progress) {
        let armAngle = 0.5;
        if (isAttacking) {
            armAngle = -0.8 + Math.sin(progress * Math.PI) * 1.8;
        }

        const handX = sx + Math.cos(armAngle) * 22;
        const handY = sy + Math.sin(armAngle) * 22;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Poison Bone Claws
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(armAngle);
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 2.5;
        for (let i = -4; i <= 4; i += 4) {
            ctx.beginPath();
            ctx.moveTo(0, i);
            ctx.lineTo(14, i + 2);
            ctx.stroke();
        }
        ctx.restore();
    }

    static drawMarrowkaiScythe(ctx, sx, sy, unit, isAttacking, progress) {
        let swing = 0.2;
        if (isAttacking) {
            swing = -1.2 + Math.sin(progress * Math.PI) * 2.5;
        }

        const handX = sx + Math.cos(swing) * 32;
        const handY = sy + Math.sin(swing) * 32;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.lineWidth = 6;
        ctx.stroke();

        // Great Reaper Scythe
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(swing + 1.2);

        // Staff shaft
        ctx.strokeStyle = '#2e1065';
        ctx.lineWidth = 4.5;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.lineTo(0, 45);
        ctx.stroke();

        // Curved dark scythe blade
        ctx.strokeStyle = '#c084fc';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(0, -50);
        ctx.quadraticCurveTo(40, -55, 34, -20);
        ctx.stroke();
        ctx.restore();
    }

    static drawMinerArmAndPickaxe(ctx, sx, sy, unit, isMining) {
        let swing = isMining ? Math.sin(unit.animProgress * Math.PI * 2) : 0;
        let armAngle = -0.4 + swing * 1.1;

        const handX = sx + Math.cos(armAngle) * 22;
        const handY = sy + Math.sin(armAngle) * 22;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Draw Pickaxe
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(armAngle + 1.2);

        // Handle
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#a0522d';
        ctx.beginPath();
        ctx.moveTo(0, -18);
        ctx.lineTo(0, 18);
        ctx.stroke();

        // Pickaxe metal head
        ctx.beginPath();
        ctx.moveTo(-14, -18);
        ctx.quadraticCurveTo(0, -22, 14, -18);
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#a0aec0';
        ctx.stroke();

        ctx.restore();
    }

    static drawSwordwrathArms(ctx, sx, sy, unit, isAttacking, progress) {
        const isSavage = StickmanRenderer.hasSkin(unit, 'savage');

        let armAngle = 0.4;
        let swordAngle = 0.5;

        if (isAttacking) {
            // Windup -> Slash -> Recovery
            if (progress < 0.3) {
                // Windup back
                armAngle = -1.2;
                swordAngle = -1.5;
            } else if (progress < 0.7) {
                // Dynamic forward slash
                const t = (progress - 0.3) / 0.4;
                armAngle = -1.2 + t * 2.4;
                swordAngle = -1.5 + t * 2.8;

                // Slash trail effect (Emerald green for Savage)
                ctx.save();
                ctx.beginPath();
                ctx.arc(sx + 10, sy, 38, -1.2, 1.2);
                ctx.strokeStyle = isSavage ? 'rgba(16, 185, 129, 0.65)' : 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = isSavage ? 7 : 6;
                ctx.stroke();
                ctx.restore();
            } else {
                armAngle = 1.0;
                swordAngle = 1.2;
            }
        }

        const handX = sx + Math.cos(armAngle) * 20;
        const handY = sy + Math.sin(armAngle) * 20;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Sword blade
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(swordAngle);

        if (isSavage) {
            // Savage Serrated Bone Blade (from Reference Photo)
            // Leather wrapped bone hilt with skull pommel
            ctx.beginPath();
            ctx.moveTo(-5, 0); ctx.lineTo(5, 0);
            ctx.lineWidth = 3; ctx.strokeStyle = '#78350f'; ctx.stroke();
            ctx.beginPath(); ctx.arc(0, 4, 3, 0, Math.PI * 2);
            ctx.fillStyle = '#f5f5f4'; ctx.fill();

            // Curved serrated bone blade with saw teeth & emerald inlay
            ctx.beginPath();
            ctx.moveTo(-2, 0);
            ctx.quadraticCurveTo(-6, -16, 2, -34); // sharp curved bone tip
            ctx.lineTo(8, -31);
            ctx.lineTo(4, -26); // tooth 1
            ctx.lineTo(8, -22);
            ctx.lineTo(4, -17); // tooth 2
            ctx.lineTo(7, -13);
            ctx.lineTo(3, -8);  // tooth 3
            ctx.lineTo(5, -4);
            ctx.lineTo(1, 0);
            ctx.closePath();
            ctx.fillStyle = '#f5f5f4';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#57534e';
            ctx.stroke();

            // Inlaid Emerald Rune Gem at blade base
            ctx.beginPath();
            ctx.arc(0, -6, 2.5, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Hilt
            ctx.beginPath();
            ctx.moveTo(-6, 0);
            ctx.lineTo(6, 0);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#d69e2e';
            ctx.stroke();

            // Blade
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.lineTo(0, -32);
            ctx.lineTo(3, -28);
            ctx.lineTo(0, 0);
            ctx.fillStyle = '#e2e8f0';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#cbd5e0';
            ctx.stroke();

            // HD Specular Weapon Blade Sheen Glint
            if (window.game && window.game.isHD) {
                ctx.beginPath();
                ctx.arc(0, -22, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 6;
                ctx.fill();
            }
        }
        ctx.restore();
    }

    static drawArchidonBow(ctx, sx, sy, unit, isAttacking, progress) {
        // Left arm holds bow forward
        const handX = sx + 22;
        const handY = sy - 2;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Quiver on back
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(sx - 10, sy + 6);
        ctx.lineTo(sx - 18, sy - 18);
        ctx.lineWidth = 5;
        ctx.strokeStyle = '#7b341e';
        ctx.stroke();
        // Arrow fletchings in quiver
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(sx - 18, sy - 18);
        ctx.lineTo(sx - 22, sy - 24);
        ctx.moveTo(sx - 16, sy - 18);
        ctx.lineTo(sx - 18, sy - 25);
        ctx.stroke();
        ctx.restore();

        // Draw Bow & Bowstring
        ctx.save();
        ctx.translate(handX, handY);

        // Recurve Bow Wood
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.quadraticCurveTo(12, 0, 0, 26);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = '#975a16';
        ctx.stroke();

        // Bowstring & Drawn Arrow
        let drawBack = isAttacking ? Math.min(18, progress * 24) : 0;
        ctx.beginPath();
        ctx.moveTo(0, -26);
        ctx.lineTo(-drawBack, 0);
        ctx.lineTo(0, 26);
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = '#f7fafc';
        ctx.stroke();

        // Arrow if aiming
        if (isAttacking && progress < 0.85) {
            ctx.beginPath();
            ctx.moveTo(-drawBack, 0);
            ctx.lineTo(24 - drawBack, 0);
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#4a5568';
            ctx.stroke();

            // Arrow head
            ctx.beginPath();
            ctx.moveTo(24 - drawBack, 0);
            ctx.lineTo(20 - drawBack, -3);
            ctx.lineTo(20 - drawBack, 3);
            ctx.fillStyle = '#cbd5e0';
            ctx.fill();
        }

        ctx.restore();

        // Right arm pulling string
        const pullHandX = handX - drawBack;
        const pullHandY = handY;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(pullHandX, pullHandY);
        ctx.stroke();
    }

    static drawSpeartonEquipment(ctx, sx, sy, unit, isAttacking, isBlocking, progress, teamColor) {
        const isPlayer = unit.team === 'player';
        const isSavage = StickmanRenderer.hasSkin(unit, 'savage');

        // Shield Arm & Shield
        let shieldX = sx + 8;
        let shieldY = sy + 6;

        if (isBlocking) {
            shieldX = sx + 18;
            shieldY = sy + 2;
        }

        // Draw Shield First
        ctx.save();
        ctx.translate(shieldX, shieldY);

        if (isSavage) {
            // SAVAGE SPIKED FUR SKULL SHIELD (Matching User Reference Photo)
            // Outer Ring: 10 Curved Bone Spikes / Fangs radiating outward
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 5) {
                ctx.beginPath();
                const ax = Math.cos(a) * 17;
                const ay = Math.sin(a) * 17;
                const tipX = Math.cos(a + 0.18) * 27;
                const tipY = Math.sin(a + 0.18) * 27;
                const bx = Math.cos(a + 0.36) * 17;
                const by = Math.sin(a + 0.36) * 17;
                ctx.moveTo(ax, ay);
                ctx.lineTo(tipX, tipY);
                ctx.lineTo(bx, by);
                ctx.closePath();
                ctx.fillStyle = '#f5f5f4';
                ctx.fill();
                ctx.lineWidth = 1;
                ctx.strokeStyle = '#78716c';
                ctx.stroke();
            }

            // Feral Orange Lion Fur Rim
            ctx.beginPath();
            ctx.arc(0, 0, 19, 0, Math.PI * 2);
            ctx.fillStyle = '#d97706';
            ctx.fill();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = '#b45309';
            ctx.stroke();

            // Dark Tribal Core
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = '#291d14';
            ctx.fill();

            // Center Horned Beast Skull Boss
            ctx.beginPath();
            ctx.arc(0, -1, 8.5, 0, Math.PI * 2);
            ctx.fillStyle = '#f5f5f4';
            ctx.fill();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = '#57534e';
            ctx.stroke();

            // Center Glowing Emerald Jewel
            ctx.beginPath();
            ctx.arc(0, -1, 3.5, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.strokeStyle = '#047857';
            ctx.lineWidth = 1;
            ctx.stroke();
        } else {
            // Shield Body
            ctx.beginPath();
            ctx.arc(0, 0, 19, 0, Math.PI * 2);
            ctx.fillStyle = unit.isGolden ? '#ffd700' : '#9c4221'; // Gold or Bronze
            if (unit.isGolden) {
                ctx.shadowColor = '#ffd700';
                ctx.shadowBlur = 12;
            }
            ctx.fill();
            ctx.shadowBlur = 0;
            ctx.lineWidth = 3;
            ctx.strokeStyle = unit.isGolden ? '#b7791f' : '#442211';
            ctx.stroke();

            // Shield Rim & Chevron
            ctx.beginPath();
            ctx.arc(0, 0, 16, 0, Math.PI * 2);
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#d69e2e';
            ctx.stroke();

            // Spartan Chevron Λ
            ctx.beginPath();
            ctx.moveTo(-7, 8);
            ctx.lineTo(0, -9);
            ctx.lineTo(7, 8);
            ctx.lineWidth = 3.5;
            ctx.strokeStyle = '#1a202c';
            ctx.stroke();
        }

        ctx.restore();

        // Spear Arm & Long Spear
        let spearThrust = 0;
        let spearAngle = -0.15;

        if (isAttacking) {
            if (progress < 0.3) {
                spearThrust = -10;
            } else if (progress < 0.7) {
                spearThrust = 35 * ((progress - 0.3) / 0.4);
            } else {
                spearThrust = 20 * (1 - (progress - 0.7) / 0.3);
            }
        }

        const handX = sx + 14 + spearThrust * 0.4;
        const handY = sy + 4;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Draw Long Spear
        ctx.save();
        ctx.translate(handX + spearThrust, handY);
        ctx.rotate(spearAngle);

        // Shaft
        ctx.beginPath();
        ctx.moveTo(-25, 0);
        ctx.lineTo(48, 0);
        ctx.lineWidth = 3;
        ctx.strokeStyle = isSavage ? '#5c2c16' : '#7b341e';
        ctx.stroke();

        if (isSavage) {
            // Savage Tusk Bone Spearhead
            ctx.beginPath();
            ctx.moveTo(48, -5);
            ctx.lineTo(66, 0);
            ctx.lineTo(48, 5);
            ctx.lineTo(52, 0);
            ctx.closePath();
            ctx.fillStyle = '#f5f5f4';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = '#10b981';
            ctx.stroke();

            // Emerald tip glint
            ctx.beginPath();
            ctx.arc(58, 0, 2, 0, Math.PI * 2);
            ctx.fillStyle = '#34d399';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 6;
            ctx.fill();
            ctx.shadowBlur = 0;
        } else {
            // Standard Spearhead
            ctx.beginPath();
            ctx.moveTo(48, -4);
            ctx.lineTo(62, 0);
            ctx.lineTo(48, 4);
            ctx.closePath();
            ctx.fillStyle = '#e2e8f0';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#a0aec0';
            ctx.stroke();

            // HD Specular Spearhead Glint
            if (window.game && window.game.isHD) {
                ctx.beginPath();
                ctx.arc(58, 0, 1.8, 0, Math.PI * 2);
                ctx.fillStyle = '#ffffff';
                ctx.shadowColor = '#ffffff';
                ctx.shadowBlur = 6;
                ctx.fill();
            }
        }

        ctx.restore();
    }

    static drawMagikillStaff(ctx, sx, sy, unit, isAttacking, progress, teamColor) {
        const isPlayer = unit.team === 'player';
        const isSavage = StickmanRenderer.hasSkin(unit, 'savage');

        let staffAngle = isAttacking ? -0.8 : -0.2;
        const handX = sx + 16;
        const handY = sy;

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Staff
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(staffAngle);

        ctx.beginPath();
        ctx.moveTo(0, 30);
        ctx.lineTo(0, -42);
        ctx.lineWidth = 3.5;
        ctx.strokeStyle = isSavage ? '#271607' : '#4a2810';
        ctx.stroke();

        if (isSavage) {
            // Savage Shaman Skull Headpiece
            ctx.beginPath();
            ctx.arc(0, -45, 8, 0, Math.PI * 2);
            ctx.fillStyle = '#f5f5f4';
            ctx.fill();
            ctx.lineWidth = 1.2;
            ctx.strokeStyle = '#57534e';
            ctx.stroke();

            // Skull Horns
            ctx.beginPath();
            ctx.moveTo(-6, -46); ctx.quadraticCurveTo(-14, -54, -8, -60);
            ctx.moveTo(6, -46); ctx.quadraticCurveTo(14, -54, 8, -60);
            ctx.lineWidth = 1.8;
            ctx.strokeStyle = '#e2e8f0';
            ctx.stroke();

            // Mystic Emerald Orb
            const pulse = Math.sin(Date.now() * 0.009) * 2.5;
            ctx.beginPath();
            ctx.arc(0, -45, 5 + pulse, 0, Math.PI * 2);
            ctx.fillStyle = '#10b981';
            ctx.shadowColor = '#10b981';
            ctx.shadowBlur = 14;
            ctx.fill();
            ctx.shadowBlur = 0;

            if (isAttacking) {
                ctx.beginPath();
                ctx.arc(0, -45, 14 + progress * 16, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(16, 185, 129, 0.8)';
                ctx.lineWidth = 2.5;
                ctx.stroke();
            }
        } else {
            // Staff head crown
            ctx.beginPath();
            ctx.arc(0, -46, 7, 0, Math.PI * 2);
            ctx.fillStyle = '#ecc94b';
            ctx.fill();

            // Glowing crystal orb
            const pulse = Math.sin(Date.now() * 0.008) * 2;
            ctx.beginPath();
            ctx.arc(0, -46, 5 + pulse, 0, Math.PI * 2);
            ctx.fillStyle = teamColor === '#00e5ff' ? '#00ffff' : '#ff0055';
            ctx.shadowColor = teamColor;
            ctx.shadowBlur = 12;
            ctx.fill();

            // Casting spark particles
            if (isAttacking) {
                ctx.beginPath();
                ctx.arc(0, -46, 12 + progress * 15, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 2;
                ctx.stroke();
            }
        }

        ctx.restore();
    }

    static drawGiantClub(ctx, sx, sy, unit, isAttacking, progress) {
        let armAngle = 0.5;
        let clubAngle = 0.4;

        if (isAttacking) {
            if (progress < 0.4) {
                // Raise overhead
                armAngle = -1.6;
                clubAngle = -1.8;
            } else if (progress < 0.7) {
                // Slam down!
                const t = (progress - 0.4) / 0.3;
                armAngle = -1.6 + t * 2.8;
                clubAngle = -1.8 + t * 2.8;
            } else {
                armAngle = 1.0;
                clubAngle = 0.8;
            }
        }

        const handX = sx + Math.cos(armAngle) * 36;
        const handY = sy + Math.sin(armAngle) * 36;

        ctx.lineWidth = 7;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(handX, handY);
        ctx.stroke();

        // Huge stone club
        ctx.save();
        ctx.translate(handX, handY);
        ctx.rotate(clubAngle);

        // Handle
        ctx.lineWidth = 6;
        ctx.strokeStyle = '#5a3d28';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -55);
        ctx.stroke();

        // Massive rock head
        ctx.beginPath();
        ctx.ellipse(0, -48, 16, 26, 0.1, 0, Math.PI * 2);
        ctx.fillStyle = '#4a5568';
        ctx.fill();
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#2d3748';
        ctx.stroke();

        // Spikes on club
        ctx.fillStyle = '#1a202c';
        [-58, -48, -38].forEach(y => {
            ctx.beginPath();
            ctx.moveTo(-16, y);
            ctx.lineTo(-24, y - 2);
            ctx.lineTo(-15, y - 4);
            ctx.fill();

            ctx.beginPath();
            ctx.moveTo(16, y);
            ctx.lineTo(24, y - 2);
            ctx.lineTo(15, y - 4);
            ctx.fill();
        });

        ctx.restore();
    }

    static drawDeadUnit(ctx, unit, bodyColor, teamColor) {
        ctx.save();
        ctx.globalAlpha = Math.max(0, unit.deathAlpha || 1);
        ctx.translate(unit.deathXOffset || 0, (unit.deathYOffset || 0) + 15);
        ctx.rotate((unit.deathRotation || 0) * unit.dir);

        // Collapsed stick figure
        ctx.lineWidth = 4;
        ctx.strokeStyle = bodyColor;
        ctx.lineCap = 'round';

        // Torso flat
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(15, 0);
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.arc(24, 0, 9, 0, Math.PI * 2);
        ctx.fillStyle = bodyColor;
        ctx.fill();

        // X Eyes
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#fff';
        ctx.beginPath();
        ctx.moveTo(22, -3);
        ctx.lineTo(26, 1);
        ctx.moveTo(26, -3);
        ctx.lineTo(22, 1);
        ctx.stroke();

        // Broken legs
        ctx.beginPath();
        ctx.moveTo(-15, 0);
        ctx.lineTo(-25, 10);
        ctx.lineTo(-35, 8);
        ctx.moveTo(-15, 0);
        ctx.lineTo(-28, -6);
        ctx.stroke();

        ctx.restore();
    }

    static drawStar(ctx, cx, cy, spikes = 5, outerRadius = 8.5, innerRadius = 3.8, fillStyle = '#ffd700', strokeStyle = '#ffffff') {
        let rot = (Math.PI / 2) * 3;
        let x = cx;
        let y = cy;
        const step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        if (fillStyle) {
            ctx.fillStyle = fillStyle;
            ctx.fill();
        }
        if (strokeStyle) {
            ctx.strokeStyle = strokeStyle;
            ctx.lineWidth = 1.2;
            ctx.stroke();
        }
    }

    static drawHealthBar(ctx, unit) {
        const barWidth = 34 * (unit.type === 'giant' ? 2.2 : 1);
        const barHeight = 5;
        const barX = unit.x - barWidth / 2;
        const barY = unit.y - (unit.type === 'giant' ? 180 : 96);

        ctx.save();
        // Background
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(barX - 1, barY - 1, barWidth + 2, barHeight + 2);

        // Health fill
        const pct = Math.max(0, Math.min(1, unit.hp / unit.maxHp));
        ctx.fillStyle = unit.team === 'player' ? '#10b981' : '#ef4444';
        if (pct < 0.25) ctx.fillStyle = '#f59e0b';
        ctx.fillRect(barX, barY, barWidth * pct, barHeight);

        // Shield indicator icon if blocking
        if (unit.state === 'block' || unit.isManualBlock) {
            ctx.fillStyle = '#60a5fa';
            ctx.beginPath();
            ctx.arc(barX - 6, barY + 2, 4, 0, Math.PI * 2);
            ctx.fill();
        }

        // Bintang Di Atas Pasukan Saat Mengontrolkan (Player & Enemy Mode Gila-Gilaan)
        if (unit.isControlled || unit.isEnemyControlled) {
            const now = Date.now();
            const floatOffset = Math.sin(now / 220) * 3.5;
            const starY = barY - 18 + floatOffset;

            ctx.save();
            ctx.shadowColor = unit.isEnemyControlled ? '#ef4444' : '#ffd700';
            ctx.shadowBlur = 14;

            // Draw glowing 5-pointed star
            const starFill = unit.isEnemyControlled ? '#f87171' : '#ffd700';
            StickmanRenderer.drawStar(ctx, unit.x, starY, 5, 8.5, 3.8, starFill, '#ffffff');

            // Twinkle sparkles
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(unit.x - 11, starY);
            ctx.lineTo(unit.x + 11, starY);
            ctx.moveTo(unit.x, starY - 11);
            ctx.lineTo(unit.x, starY + 11);
            ctx.stroke();

            // Controlled Tag with 2X Damage Badge
            ctx.font = 'bold 9px "Outfit", sans-serif';
            ctx.textAlign = 'center';
            if (unit.isEnemyControlled) {
                ctx.fillStyle = '#ef4444';
                ctx.fillText('⭐ MUSUH (2X DMG)', unit.x, starY - 10);
            } else {
                ctx.fillStyle = '#ffd700';
                ctx.fillText('⭐ KOMANDAN (2X DMG)', unit.x, starY - 10);
            }
            ctx.restore();
        }

        // Badge Di Atas Pasukan Bala Bantuan Asli (👑 BALA BANTUAN ASLI)
        if (unit.isEmergencyReinforcement) {
            const now = Date.now();
            const floatOffset = Math.sin(now / 180 + (unit.x % 10)) * 2.5;
            const badgeY = barY - ((unit.isControlled || unit.isEnemyControlled) ? 38 : 12) + floatOffset;

            ctx.save();
            ctx.shadowColor = unit.team === 'player' ? '#38bdf8' : '#ef4444';
            ctx.shadowBlur = 10;
            ctx.font = 'bold 9px "Outfit", sans-serif';
            ctx.textAlign = 'center';
            if (unit.team === 'player') {
                ctx.fillStyle = '#ffd700';
                ctx.fillText('👑 BALA BANTUAN ASLI', unit.x, badgeY);
            } else {
                ctx.fillStyle = '#f87171';
                ctx.fillText('🚨 BALA BANTUAN ASLI', unit.x, badgeY);
            }
            ctx.restore();
        }

        // Status Effects (Frozen / Burn)
        if (unit.frozenTimer > 0) {
            ctx.save();
            ctx.font = 'bold 9px "Outfit", sans-serif';
            ctx.fillStyle = '#38bdf8';
            ctx.textAlign = 'center';
            const offsetAbove = (unit.isControlled || unit.isEnemyControlled) ? 36 : 10;
            ctx.fillText(`❄️ MEMBEKU: ${unit.frozenTimer.toFixed(1)}s`, unit.x, barY - offsetAbove);
            ctx.restore();
        } else if (unit.burnTimer > 0) {
            ctx.save();
            ctx.font = 'bold 9px "Outfit", sans-serif';
            ctx.fillStyle = '#ff6b00';
            ctx.textAlign = 'center';
            const offsetAbove = (unit.isControlled || unit.isEnemyControlled) ? 36 : 10;
            ctx.fillText('🔥 TERBAKAR (-10)', unit.x, barY - offsetAbove);
            ctx.restore();
        }

        ctx.restore();
    }
}

window.StickmanRenderer = StickmanRenderer;
