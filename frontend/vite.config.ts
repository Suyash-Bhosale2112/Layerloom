import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';

// Custom middleware plugin to serve PMTiles from the root PMTiles/ folder with HTTP Range Request support
function servePmtilesPlugin(): Plugin {
  return {
    name: 'serve-pmtiles',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith('/pmtiles/')) {
          return next();
        }

        // Decode path and remove query string
        const cleanUrl = req.url.split('?')[0];
        const relativePath = decodeURIComponent(cleanUrl.replace(/^\/pmtiles\//, ''));
        const filePath = path.resolve(__dirname, '../PMTiles', relativePath);

        if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
          res.statusCode = 404;
          res.end(`PMTiles file not found: ${relativePath}`);
          return;
        }

        const stat = fs.statSync(filePath);
        const fileSize = stat.size;
        const range = req.headers.range;

        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Headers', 'Range, Content-Type');
        res.setHeader('Accept-Ranges', 'bytes');
        res.setHeader('Content-Type', 'application/x-protobuf');

        if (req.method === 'OPTIONS') {
          res.statusCode = 204;
          res.end();
          return;
        }

        if (range) {
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

          if (start >= fileSize || end >= fileSize) {
            res.statusCode = 416;
            res.setHeader('Content-Range', `bytes */${fileSize}`);
            res.end();
            return;
          }

          const chunkSize = end - start + 1;
          const fileStream = fs.createReadStream(filePath, { start, end });

          res.statusCode = 206;
          res.setHeader('Content-Range', `bytes ${start}-${end}/${fileSize}`);
          res.setHeader('Content-Length', chunkSize);
          fileStream.pipe(res);
        } else {
          res.statusCode = 200;
          res.setHeader('Content-Length', fileSize);
          fs.createReadStream(filePath).pipe(res);
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), servePmtilesPlugin()],
  server: {
    port: 3000,
    open: false
  }
});

