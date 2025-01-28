import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contentTypes = {
  '.webm': 'video/webm',
  '.webp': 'image/webp'
};

const server = http.createServer(async (req, res) => {
  try {
    const cleanUrl = decodeURIComponent(req.url.split('?')[0]);

    if (!cleanUrl.startsWith('/public/')) {
      res.writeHead(403);
      res.end('Forbidden');
      return;
    }

    const filePath = path.join(__dirname, cleanUrl);
    const ext = path.extname(filePath).toLowerCase();

    try {
      await fs.promises.access(filePath);
    } catch {
      res.writeHead(404);
      res.end('File not found');
      return;
    }

    const contentType = contentTypes[ext] || 'application/octet-stream';

    const fileStream = fs.createReadStream(filePath);
    res.writeHead(200, { 'Content-Type': contentType });

    fileStream.pipe(res);
  } catch (error) {
    console.error(error);
    res.writeHead(500);
    res.end('Internal Server Error');
  }
});

const PORT = 7532;

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
