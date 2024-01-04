/* eslint-disable no-console */
const http = require('http');
const { createReadStream, access, constants } = require('fs');
const zlib = require('zlib');
const path = require('path');
const { pipeline } = require('stream');
const accepts = require('accepts');

async function main() {
  const server = http.createServer((req, res) => {
    const accept = accepts(req);
    const requestedUrl = req.url;
    const filePath = path.join(__dirname, 'public', requestedUrl);

    // Validate if the file exists in the public directory
    access(filePath, constants.F_OK, (err) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('Not Found');
        }
      }
    });

    const srcStream = createReadStream(filePath);

    let compression;

    // Create the compression stream based on the encoding header
    switch (accept.encodings(['deflate', 'gzip', 'br'])) {
      case 'deflate':
        res.writeHead(200, { 'Content-Encoding': 'deflate' });
        compression = zlib.createDeflate();
        break;
      case 'gzip':
        res.writeHead(200, { 'Content-Encoding': 'gzip' });
        compression = zlib.createGzip();
        break;
      case 'br':
        res.writeHead(200, { 'Content-Encoding': 'br' });
        compression = zlib.createBrotliCompress();
        break;
      default:
        res.writeHead(200, { 'Content-Encoding': 'gzip' });
        compression = zlib.createGzip();
        break;
    }

    pipeline(srcStream, compression, res, (err) => {
      if (err) {
        console.log('Something went wrong');
      } else {
        console.log('Static served with compression');
      }
    });
  });

  const port = 3000;
  server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
  });
}

main();
