import fs from 'fs';
const html = fs.readFileSync('index.html', 'utf8');
const scripts = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scripts && scripts.length > 1) {
  const content = scripts[1].replace(/<\/?script>/g, '');
  fs.writeFileSync('test_script.js', content);
  console.log('Saved test_script.js');
}
