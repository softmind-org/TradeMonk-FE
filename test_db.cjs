const http = require('http');

http.get('http://localhost:5000/api/v1/products', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log("Product Image Example:", parsed.data[0].images[0]);
    } catch (e) {
      console.log("Error parsing:", e);
    }
  });
}).on('error', (e) => {
  console.error(`Got error: ${e.message}`);
});
