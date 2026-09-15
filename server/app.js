import express from 'express';
import { fileURLToPath } from 'node:url';

const app = express();
const PORT = process.env.PORT || 3000;

const publicFolder = fileURLToPath(
  new URL('../public/', import.meta.url)
);

app.use(express.static(publicFolder));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});