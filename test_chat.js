import fetch from 'node-fetch';

async function run() {
  let chatHistory = [];
  
  // 1. Tell the AI my favorite fruit
  let res = await fetch('http://localhost:3000/api/recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Hai, buah kesukaan saya mangga.', hpht: '', lang: 'id', persona: 'default', history: chatHistory })
  });
  let data = await res.json();
  console.log('User: Hai, buah kesukaan saya mangga.');
  console.log('AI:', data.text);
  
  chatHistory.push({ role: 'user', text: 'Hai, buah kesukaan saya mangga.' });
  chatHistory.push({ role: 'ai', text: data.text });
  
  // 2. Ask what my favorite fruit is
  res = await fetch('http://localhost:3000/api/recommendation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'Apa buah kesukaan saya?', hpht: '', lang: 'id', persona: 'default', history: chatHistory })
  });
  data = await res.json();
  console.log('User: Apa buah kesukaan saya?');
  console.log('AI:', data.text);
}

run();
