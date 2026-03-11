const https = require('https');
https.get('https://api.github.com/repos/Eaubin08/MVP-prez-obsidia/contents', { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('prez', data));
});
https.get('https://api.github.com/repos/Eaubin08/MVP-obsidia-MVP-obsidia-/contents', { headers: { 'User-Agent': 'node.js' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => console.log('obsidia', data));
});
