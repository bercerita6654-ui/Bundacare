const fs = require('fs');

const temp = fs.readFileSync('temp.js', 'utf8');
let html = fs.readFileSync('index.html', 'utf8');
html = html.replace('const i18n = {', temp + '\n        const i18n = {');
fs.writeFileSync('index.html', html);
