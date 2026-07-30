import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Stubs for client SDK scripts referenced in tastiere HTML files
app.get('/_sdk/element_sdk.js', (req, res) => {
  res.type('javascript').send('window.elementSdk = window.elementSdk || { init: () => {}, setConfig: () => {} };');
});

app.get('/_sdk/data_sdk.js', (req, res) => {
  res.type('javascript').send('');
});

// Serve static files from root directory
app.use(express.static(__dirname));

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
