import { defineConfig } from 'vite';
import bggHandler from './api/bgg.js';
import bookHandler from './api/book.js';

function apiMiddlewarePlugin() {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        
        if (url.pathname === '/api/bgg') {
          const query = Object.fromEntries(url.searchParams.entries());
          const reqAdapt = Object.assign(req, { query });
          const resAdapt = Object.assign(res, {
            status(code) { res.statusCode = code; return this; },
            send(body) { res.end(body); return this; },
            json(body) { 
              res.setHeader('Content-Type', 'application/json'); 
              res.end(JSON.stringify(body)); 
              return this; 
            }
          });
          try {
            await bggHandler(reqAdapt, resAdapt);
          } catch (err) {
            res.statusCode = 500;
            res.end(err.message);
          }
          return;
        }

        if (url.pathname === '/api/book') {
          let bodyStr = '';
          req.on('data', chunk => { bodyStr += chunk; });
          req.on('end', async () => {
            let body = {};
            try { 
              if (bodyStr) body = JSON.parse(bodyStr); 
            } catch (e) {}
            
            const reqAdapt = Object.assign(req, { body, query: Object.fromEntries(url.searchParams.entries()) });
            const resAdapt = Object.assign(res, {
              status(code) { res.statusCode = code; return this; },
              send(b) { res.end(b); return this; },
              json(b) { 
                res.setHeader('Content-Type', 'application/json'); 
                res.end(JSON.stringify(b)); 
                return this; 
              }
            });
            try {
              await bookHandler(reqAdapt, resAdapt);
            } catch (err) {
              res.statusCode = 500;
              res.end(err.message);
            }
          });
          return;
        }

        next();
      });
    }
  };
}

export default defineConfig({
  plugins: [apiMiddlewarePlugin()],
  server: {
    port: 3000
  }
});
