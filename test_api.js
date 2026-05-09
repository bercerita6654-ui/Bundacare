import fetch from 'node-fetch';
const res = await fetch('http://localhost:3000/api/recommendation', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: 'tes', hpht: '', lang: 'id', persona: 'default' })
});
console.log(await res.text());
