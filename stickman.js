// Stick War Procedural Stickman Animation & Rendering Engine
class StickmanRenderer {
    static draw(ctx, unit, time) {
        ctx.save();
        ctx.translate(unit.x, unit.y);
        ctx.scale(unit.dir * unit.scale, unit.scale);

        const isPlayer = unit.team === 'player';
        const isNight = window.game && window.game.isNight;
        const skin = unit.skin || (isPlayer ? (window.game ? window.game.equippedSkin : 'classic') : 'classic');
        const isZombie = !isPlayer && isNight;

        let teamColor = isPlayer ? '#00e5ff' : '#ff3344';
        let bodyColor = '#1a1a1a';
        let skinGlow = null;

        if (skin === 'fire') {
            bodyColor = '#2b1104';
            teamColor = isPlayer ? '#ff6b00' : '#f97316';
            skinGlow = '#f97316';
        } else if (skin === 'ice') {
            bodyColor = '#082f49';
            teamColor = isPlayer ? '#00f0ff' : '#38bdf8';
            skinGlow = '#38bdf8';
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
        if (skin === 'fire') {
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
        if (skin === 'ice') {
            ctx.save();
            ctx.beginPath();
            ctx.ellipse(0, 0, 22, 6, 0, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.shadowColor = '#38bdf8';
            ctx.shadowBlur = 12;
            ctx.fill();
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

        // Procedural joint positions
        const cycle = unit.animProgress;
        const isWalking = unit.state === 'walk';
        const isAttacking = unit.state === 'attack';
        const isMining = unit.state === 'mine';
        const isBlocking = unit.state === 'block';
        const isHurt = unit.hurtTimer > 0;
        const isDead = unit.state === 'dead';

        // Calculate dynamic limb angles
        let legSwing = isWalking ? Math.sin(cycle * Math.PI * 2) * 0.6 : 0;
        let spineTilt = isWalking ? 0.15 : (isBlocking ? -0.1 : 0);
        let headTilt = 0;

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

        // Baseline offsets
        const hipY = -35;
        const neckY = -68;
        const headY = -82;
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
        } else if (unit.type === 'marrowkai') {
            this.drawMarrowkaiHorns(ctx, hX, hY);
            this.drawMarrowkaiWings(ctx, neckX, neckY);
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
        const skin = unit.skin || (isPlayer ? (window.game ? window.game.equippedSkin : 'classic') : 'classic');
        const isZombie = !isPlayer && (window.game && window.game.isNight);

        let eyeColor = isPlayer ? '#fff' : '#ff5555';
        if (skin === 'fire') eyeColor = '#fbbf24';
        if (skin === 'ice') eyeColor = '#38bdf8';
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
        } else if (type === 'marrowkai') {
            this.drawMarrowkaiScythe(ctx, shoulderX, shoulderY, unit, isAttacking, progress);
        }

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

                // Slash trail effect
                ctx.save();
                ctx.beginPath();
                ctx.arc(sx + 10, sy, 38, -1.2, 1.2);
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
                ctx.lineWidth = 6;
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
        // Shield Arm & Shield
        let shieldX = sx + 8;
        let shieldY = sy + 6;

        if (isBlocking) {
            shieldX = sx + 18;
            shieldY = sy + 2;
        }

        // Draw Shield First (Hoplon round shield)
        ctx.save();
        ctx.translate(shieldX, shieldY);

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
        ctx.strokeStyle = '#7b341e';
        ctx.stroke();

        // Spearhead
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

        ctx.restore();
    }

    static drawMagikillStaff(ctx, sx, sy, unit, isAttacking, progress, teamColor) {
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
        ctx.strokeStyle = '#4a2810';
        ctx.stroke();

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
