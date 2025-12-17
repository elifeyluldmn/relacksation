const http = require('http');

console.log('Testing RelACKs Backend...');

const options = {
  hostname: 'localhost',
  port: 5000,
  path: '/api/health',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      console.log('Response:', response);
      if (response.ok === true) {
        console.log('✅ Backend is healthy!');
      } else {
        console.log('❌ Backend health check failed');
      }
    } catch (e) {
      console.log('❌ Invalid JSON response:', data);
    }
  });
});

req.on('error', (e) => {
  console.log('❌ Request failed:', e.message);
});

req.setTimeout(5000, () => {
  console.log('❌ Request timeout after 5 seconds');
  req.destroy();
});

req.end();
