import https from 'https';

https.get('https://images.unsplash.com/photo-1490645935967-10de6ba17061', (res) => {
  console.log(res.statusCode);
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
