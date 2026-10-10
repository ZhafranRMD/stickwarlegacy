const fs = require('fs');

function checkFile(filename) {
    const code = fs.readFileSync(filename, 'utf8');
    console.log(`Checking ${filename}...`);
    try {
        new Function(code);
        console.log(`Syntax OK in ${filename}`);
    } catch (e) {
        console.error(`Syntax Error in ${filename}:`, e);
    }
}

checkFile('audio.js');
checkFile('stickman.js');
checkFile('game.js');
