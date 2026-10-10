const fs = require('fs');
const path = require('path');

const dir = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(dir, 'style.css'), 'utf8');
const audio = fs.readFileSync(path.join(dir, 'audio.js'), 'utf8');
const stickman = fs.readFileSync(path.join(dir, 'stickman.js'), 'utf8');
const game = fs.readFileSync(path.join(dir, 'game.js'), 'utf8');

let bundle = html.replace('<link rel="stylesheet" href="style.css">', '<style>\n' + css + '\n</style>');
bundle = bundle.replace('<script src="audio.js"></script>', '<script>\n' + audio + '\n</script>');
bundle = bundle.replace('<script src="stickman.js"></script>', '<script>\n' + stickman + '\n</script>');
bundle = bundle.replace('<script src="game.js"></script>', '<script>\n' + game + '\n</script>');

fs.writeFileSync(path.join(dir, 'Uji Coba'), bundle, 'utf8');
fs.writeFileSync(path.join(dir, 'Uji Coba.html'), bundle, 'utf8');
console.log('Successfully bundled self-contained game to Uji Coba and Uji Coba.html!');
