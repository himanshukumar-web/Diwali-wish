import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import url from 'url';

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) {
          return next();
        }

        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname || '';
        const endpoint = pathname.replace(/^\/api\//, '').replace(/\/$/, '');

        // Match handler file
        let handlerModule: any;
        try {
          if (endpoint === 'create-order') {
            handlerModule = await server.ssrLoadModule('/api/create-order.ts');
          } else if (endpoint === 'verify-payment') {
            handlerModule = await server.ssrLoadModule('/api/verify-payment.ts');
          } else if (endpoint === 'webhook') {
            handlerModule = await server.ssrLoadModule('/api/webhook.ts');
          } else if (endpoint === 'get-order') {
            handlerModule = await server.ssrLoadModule('/api/get-order.ts');
          } else if (endpoint === 'custom-inquiry') {
            handlerModule = await server.ssrLoadModule('/api/custom-inquiry.ts');
          } else if (endpoint === 'admin-orders') {
            handlerModule = await server.ssrLoadModule('/api/admin-orders.ts');
          } else {
            res.statusCode = 404;
            res.setHeader('Content-Type', 'application/json');
            return res.end(JSON.stringify({ error: 'API route not found' }));
          }
        } catch (err: any) {
          console.error('Failed to load API module:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          return res.end(JSON.stringify({ error: err.message }));
        }

        const handler = handlerModule.default || handlerModule;

        // Parse request body for POST/PUT
        let body: any = {};
        if (req.method === 'POST' || req.method === 'PUT') {
          const buffers: Buffer[] = [];
          for await (const chunk of req) {
            buffers.push(chunk);
          }
          const raw = Buffer.concat(buffers).toString('utf8');
          try {
            body = raw ? JSON.parse(raw) : {};
          } catch {
            body = raw;
          }
        }

        // Mock VercelRequest & VercelResponse helper methods
        const vercelReq = Object.assign(req, {
          query: parsedUrl.query,
          body
        });

        const vercelRes = Object.assign(res, {
          status(statusCode: number) {
            res.statusCode = statusCode;
            return vercelRes;
          },
          json(data: any) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(data));
            return vercelRes;
          }
        });

        try {
          await handler(vercelReq, vercelRes);
        } catch (handlerErr: any) {
          console.error(`Error in /api/${endpoint}:`, handlerErr);
          if (!res.headersSent) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: handlerErr.message || 'Internal Server Error' }));
          }
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), apiDevPlugin()],
  server: {
    port: 3000,
    open: false,
  },
});
