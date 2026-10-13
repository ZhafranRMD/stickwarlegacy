const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node.js PNG encoder using built-in zlib
function createPng(width, height, pixelFn) {
    const rowBytes = width * 4;
    const rawBuffer = Buffer.alloc((rowBytes + 1) * height);
    
    for (let y = 0; y < height; y++) {
        const offset = y * (rowBytes + 1);
        rawBuffer[offset] = 0; // Filter type: None
        for (let x = 0; x < width; x++) {
            const pixel = pixelFn(x, y, width, height);
            const pOffset = offset + 1 + x * 4;
            rawBuffer[pOffset] = Math.max(0, Math.min(255, Math.floor(pixel.r)));
            rawBuffer[pOffset + 1] = Math.max(0, Math.min(255, Math.floor(pixel.g)));
            rawBuffer[pOffset + 2] = Math.max(0, Math.min(255, Math.floor(pixel.b)));
            rawBuffer[pOffset + 3] = Math.max(0, Math.min(255, Math.floor(pixel.a !== undefined ? pixel.a : 255)));
        }
    }

    const compressed = zlib.deflateSync(rawBuffer);

    // CRC32 table
    const crcTable = [];
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) {
            if (c & 1) c = 0xedb88320 ^ (c >>> 1);
            else c = c >>> 1;
        }
        crcTable[n] = c;
    }

    function crc32(buf) {
        let c = 0xffffffff;
        for (let i = 0; i < buf.length; i++) {
            c = crcTable[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
        }
        return (c ^ 0xffffffff) >>> 0;
    }

    function createChunk(type, data) {
        const len = data.length;
        const buf = Buffer.alloc(len + 12);
        buf.writeUInt32BE(len, 0);
        buf.write(type, 4, 4, 'ascii');
        data.copy(buf, 8);
        const crc = crc32(buf.slice(4, 8 + len));
        buf.writeUInt32BE(crc, 8 + len);
        return buf;
    }

    const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

    // IHDR
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(width, 0);
    ihdr.writeUInt32BE(height, 4);
    ihdr[8] = 8; // bit depth
    ihdr[9] = 6; // color type: RGBA
    ihdr[10] = 0; // compression
    ihdr[11] = 0; // filter
    ihdr[12] = 0; // interlace
    const ihdrChunk = createChunk('IHDR', ihdr);

    const idatChunk = createChunk('IDAT', compressed);
    const iendChunk = createChunk('IEND', Buffer.alloc(0));

    return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Procedural high quality Stick War Savage Icon generator
function generateIconPixels(x, y, w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const nx = (x - cx) / (w / 2);
    const ny = (y - cy) / (h / 2);
    const dist = Math.sqrt(nx * nx + ny * ny);

    // Outer background: Dark obsidian radial gradient with amber/emerald glow
    let r = 10, g = 13, b = 20;
    if (dist < 0.95) {
        const borderGlow = (1 - dist);
        r = 15 + borderGlow * 30;
        g = 20 + borderGlow * 45;
        b = 30 + borderGlow * 35;
    }

    // Gold decorative border ring
    if (dist >= 0.86 && dist <= 0.94) {
        return { r: 218, g: 165, b: 32, a: 255 }; // Golden border
    }
    if (dist >= 0.94 && dist <= 0.96) {
        return { r: 120, g: 90, b: 20, a: 255 };
    }

    // Savage Fur & Horn silhouette in center
    // Horn curve
    const hornLeft = Math.pow(nx + 0.35, 2) + Math.pow(ny + 0.3, 2);
    const hornRight = Math.pow(nx - 0.35, 2) + Math.pow(ny + 0.3, 2);
    if ((hornLeft < 0.08 && nx < -0.15) || (hornRight < 0.08 && nx > 0.15)) {
        return { r: 245, g: 245, b: 244, a: 255 }; // Bone horn
    }

    // Savage Fur Mane (Lion mane spiky circle behind head)
    if (dist < 0.65 && dist > 0.35) {
        const angle = Math.atan2(ny, nx);
        const spike = Math.sin(angle * 14) * 0.08;
        if (dist < 0.55 + spike) {
            return { r: 217, g: 119, b: 6, a: 255 }; // Feral orange mane
        }
    }

    // Bone Skull Shield / Face in center
    const faceDist = Math.sqrt(nx * nx * 1.3 + Math.pow(ny + 0.05, 2));
    if (faceDist < 0.32) {
        // Glowing Emerald gem on forehead
        const gemDist = Math.sqrt(nx * nx * 2 + Math.pow(ny + 0.22, 2));
        if (gemDist < 0.08) {
            return { r: 16, g: 185, b: 129, a: 255 }; // Emerald Green Gem
        }

        // Skull eye sockets
        const eyeL = Math.sqrt(Math.pow(nx + 0.1, 2) * 2 + Math.pow(ny + 0.05, 2));
        const eyeR = Math.sqrt(Math.pow(nx - 0.1, 2) * 2 + Math.pow(ny + 0.05, 2));
        if (eyeL < 0.05 || eyeR < 0.05) {
            return { r: 10, g: 13, b: 20, a: 255 }; // Deep dark eyes
        }

        // Skull Teeth
        if (ny > 0.12 && ny < 0.22 && Math.abs(nx) < 0.18) {
            const toothStripe = Math.floor((nx + 0.2) * 30) % 2;
            if (toothStripe === 0) return { r: 254, g: 243, b: 199, a: 255 };
            return { r: 40, g: 30, b: 20, a: 255 };
        }

        return { r: 245, g: 245, b: 240, a: 255 }; // Pale bone skull
    }

    // Crossed weapons at bottom
    if (ny > 0.45 && ny < 0.75 && Math.abs(nx) < 0.7) {
        const cross1 = Math.abs((nx * 0.7) - (ny - 0.6));
        const cross2 = Math.abs((-nx * 0.7) - (ny - 0.6));
        if (cross1 < 0.04 || cross2 < 0.04) {
            return { r: 255, g: 215, b: 0, a: 255 }; // Golden blades
        }
    }

    return { r, g, b, a: 255 };
}

const outDir = path.join(__dirname, '..');
console.log('Generating PNG icons for PWA...');

const png192 = createPng(192, 192, generateIconPixels);
fs.writeFileSync(path.join(outDir, 'icon-192.png'), png192);
console.log('✓ Created icon-192.png');

const png512 = createPng(512, 512, generateIconPixels);
fs.writeFileSync(path.join(outDir, 'icon-512.png'), png512);
console.log('✓ Created icon-512.png');

fs.writeFileSync(path.join(outDir, 'apple-touch-icon.png'), png192);
console.log('✓ Created apple-touch-icon.png');

// Also create beautiful vector icon.svg
const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="bg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="70%" stop-color="#0f172a"/>
      <stop offset="100%" stop-color="#020617"/>
    </radialGradient>
    <radialGradient id="gem" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#6ee7b7"/>
      <stop offset="45%" stop-color="#10b981"/>
      <stop offset="100%" stop-color="#047857"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#bg)"/>
  <circle cx="256" cy="256" r="230" fill="none" stroke="#d97706" stroke-width="8" opacity="0.6"/>
  <circle cx="256" cy="256" r="218" fill="none" stroke="#ffd700" stroke-width="4"/>

  <!-- Savage Feral Lion Fur Ring -->
  <g fill="#d97706" stroke="#b45309" stroke-width="3">
    <!-- Mane spikes -->
    <path d="M256 70 L280 125 L340 85 L335 145 L400 120 L375 175 L435 170 L395 220 L445 240 L395 270 L440 310 L380 325 L415 375 L355 370 L370 425 L315 400 L305 455 L256 415 L207 455 L197 400 L142 425 L157 370 L97 375 L132 325 L72 310 L117 270 L67 240 L117 220 L77 170 L137 175 L112 120 L177 145 L172 85 L232 125 Z" fill="#b45309"/>
    <circle cx="256" cy="256" r="145" fill="#78350f"/>
  </g>

  <!-- Horns -->
  <path d="M190 190 Q120 120 110 50 Q160 90 205 160 Z" fill="#f5f5f4" stroke="#78716c" stroke-width="3"/>
  <path d="M322 190 Q392 120 402 50 Q352 90 307 160 Z" fill="#f5f5f4" stroke="#78716c" stroke-width="3"/>

  <!-- Skull Head -->
  <path d="M190 170 Q256 130 322 170 Q345 250 315 295 L310 350 L202 350 L197 295 Q167 250 190 170 Z" fill="#f5f5f4" stroke="#57534e" stroke-width="5"/>

  <!-- Emerald Forehead Gem -->
  <polygon points="256,160 278,190 256,220 234,190" fill="url(#gem)" filter="url(#glow)"/>

  <!-- Eye Sockets -->
  <ellipse cx="225" cy="245" rx="20" ry="25" transform="rotate(-10 225 245)" fill="#0f172a"/>
  <ellipse cx="287" cy="245" rx="20" ry="25" transform="rotate(10 287 245)" fill="#0f172a"/>

  <!-- Glowing Green Eyes -->
  <circle cx="227" cy="245" r="7" fill="#34d399" filter="url(#glow)"/>
  <circle cx="285" cy="245" r="7" fill="#34d399" filter="url(#glow)"/>

  <!-- Fangs / Teeth -->
  <path d="M215 315 L225 345 L235 315 L245 345 L256 315 L267 345 L277 315 L287 345 L297 315" fill="none" stroke="#292524" stroke-width="4"/>

  <!-- Crossed Savage Swords at Bottom -->
  <g stroke="#ffd700" stroke-width="7" stroke-linecap="round">
    <line x1="120" y1="440" x2="392" y2="440"/>
  </g>
  <text x="256" y="475" text-anchor="middle" font-family="Cinzel, Arial, sans-serif" font-weight="900" font-size="34" fill="#ffd700" letter-spacing="4">STICK WAR</text>
</svg>`;
fs.writeFileSync(path.join(outDir, 'icon.svg'), svgIcon, 'utf8');
console.log('✓ Created icon.svg');
