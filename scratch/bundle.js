const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const stickWarDir = path.join(rootDir, 'Stick war');
const srcDir = fs.existsSync(path.join(stickWarDir, 'game.js')) ? stickWarDir : rootDir;

const html = fs.readFileSync(path.join(srcDir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(srcDir, 'style.css'), 'utf8');
const audio = fs.readFileSync(path.join(srcDir, 'audio.js'), 'utf8');
const stickman = fs.readFileSync(path.join(srcDir, 'stickman.js'), 'utf8');
const game = fs.readFileSync(path.join(srcDir, 'game.js'), 'utf8');

let bundle = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>');
bundle = bundle.replace('<script src="audio.js"></script>', '<script>\n' + audio + '\n</script>');
bundle = bundle.replace('<script src="stickman.js"></script>', '<script>\n' + stickman + '\n</script>');
bundle = bundle.replace('<script src="game.js"></script>', '<script>\n' + game + '\n</script>');

// Write to both Stick war and root
[stickWarDir, rootDir].forEach(targetDir => {
    if (fs.existsSync(targetDir)) {
        fs.writeFileSync(path.join(targetDir, 'Uji Coba'), bundle, 'utf8');
        fs.writeFileSync(path.join(targetDir, 'Uji Coba.html'), bundle, 'utf8');
    }
});
console.log('Successfully bundled self-contained game to Uji Coba and Uji Coba.html in both local folders!');
