const http = require('http');

const data = JSON.stringify({
  name: 'Test User',
  email: 'testuser1@example.com',
  password: 'Password123',
});

const options = {
  hostname: 'localhost',
  port: 5001,
  path: '/api/auth/register',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(data),
  },
};

const req = http.request(options, (res) => {
  console.log('STATUS', res.statusCode);
  res.setEncoding('utf8');
  res.on('data', (chunk) => process.stdout.write(chunk));
});

req.on('error', (e) => console.error('ERROR', e.message));
req.write(data);
req.end();
