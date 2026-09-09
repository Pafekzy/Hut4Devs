import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { handleCreateProposal, ServerHandlerResponse } from './src/server/payments/serverHandler';
import { PaymentProvider } from './src/domain/payments';

const MIME_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

export interface ServerOptions {
  distDir?: string;
  customProvider?: PaymentProvider;
}

/**
 * Request handler for POST /api/payments/proposal
 */
export async function handlePaymentProposalRequest(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  customProvider?: PaymentProvider
): Promise<void> {
  let bodyStr = '';
  req.on('data', (chunk) => {
    bodyStr += chunk;
    if (bodyStr.length > 1024 * 1024) {
      // 1MB safety guard
      res.statusCode = 413;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ success: false, error: 'Payload too large.' }));
      req.destroy();
    }
  });

  req.on('end', async () => {
    try {
      let body: any = {};
      if (bodyStr.trim().length > 0) {
        try {
          body = JSON.parse(bodyStr);
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload.' }));
          return;
        }
      }

      const result: ServerHandlerResponse = await handleCreateProposal(body, customProvider);

      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(JSON.stringify(result.body));
    } catch (err: any) {
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(JSON.stringify({ success: false, error: 'Internal server error.' }));
    }
  });
}

/**
 * Creates the deployable Hut4Devs HTTP Server instance.
 * Exposes POST /api/payments/proposal outside of Vite.
 * Serves built static frontend from dist/ when available, with SPA routing fallback.
 */
export function createDeployableServer(options: ServerOptions = {}): http.Server {
  const distDir = options.distDir || path.join(process.cwd(), 'dist');

  const server = http.createServer(async (req, res) => {
    const rawUrl = req.url || '/';
    const parsedUrl = new URL(rawUrl, 'http://localhost');
    const pathname = parsedUrl.pathname;

    // 1. API: POST /api/payments/proposal
    if (pathname === '/api/payments/proposal' && req.method === 'POST') {
      return handlePaymentProposalRequest(req, res, options.customProvider);
    }

    // 2. API: GET /api/health
    if (pathname === '/api/health' && req.method === 'GET') {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(
        JSON.stringify({
          status: 'ok',
          server: 'hut4devs-deployable',
          endpoint: '/api/payments/proposal',
          timestamp: new Date().toISOString(),
        })
      );
      return;
    }

    // Reject unknown /api routes with 404 JSON
    if (pathname.startsWith('/api/')) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.end(JSON.stringify({ error: 'Endpoint not found.' }));
      return;
    }

    // 3. Static frontend serving from dist/
    if (req.method === 'GET' || req.method === 'HEAD') {
      try {
        const resolvedDist = path.resolve(distDir);
        let safeRelativePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
        if (safeRelativePath.startsWith('/') || safeRelativePath.startsWith('\\')) {
          safeRelativePath = safeRelativePath.slice(1);
        }

        const potentialFilePath = path.join(resolvedDist, safeRelativePath);

        // Security check: ensure path stays within distDir
        if (!potentialFilePath.startsWith(resolvedDist)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }

        // Check if static file exists
        if (fs.existsSync(potentialFilePath) && fs.statSync(potentialFilePath).isFile()) {
          const ext = path.extname(potentialFilePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          res.statusCode = 200;
          res.setHeader('Content-Type', contentType);
          if (ext === '.html') {
            res.setHeader('Cache-Control', 'no-cache');
          } else {
            res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          }
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          fs.createReadStream(potentialFilePath).pipe(res);
          return;
        }

        // SPA Fallback: Serve dist/index.html for client-side navigation routes
        const indexPath = path.join(resolvedDist, 'index.html');
        if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html; charset=utf-8');
          res.setHeader('Cache-Control', 'no-cache');
          if (req.method === 'HEAD') {
            res.end();
            return;
          }
          fs.createReadStream(indexPath).pipe(res);
          return;
        }

        // If dist not yet built
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.end(
          `<!DOCTYPE html><html><head><title>Hut4Devs Server</title></head><body><h1>Hut4Devs Deployable Server</h1><p>Server is running. Payment API endpoint is active at <code>POST /api/payments/proposal</code>.</p><p>Frontend assets are not yet built. Run <code>npm run build</code> to compile static assets.</p></body></html>`
        );
        return;
      } catch (err: any) {
        res.statusCode = 500;
        res.end('Server Error');
        return;
      }
    }

    res.statusCode = 405;
    res.end('Method Not Allowed');
  });

  return server;
}

/**
 * Starts the deployable server on specified port (default 3000).
 */
export function startDeployableServer(
  port = Number(process.env.PORT) || 3000,
  host = '0.0.0.0',
  options: ServerOptions = {}
): Promise<{ server: http.Server; port: number; url: string }> {
  return new Promise((resolve, reject) => {
    const server = createDeployableServer(options);

    server.on('error', (err) => {
      reject(err);
    });

    server.listen(port, host, () => {
      const addr = server.address();
      const actualPort = typeof addr === 'object' && addr ? addr.port : port;
      const url = `http://${host === '0.0.0.0' ? 'localhost' : host}:${actualPort}`;
      console.log(`[Hut4Devs] Deployable Payment Server running at ${url}`);
      console.log(`[Hut4Devs] Payment Endpoint: POST ${url}/api/payments/proposal`);
      resolve({ server, port: actualPort, url });
    });
  });
}

// Auto-start if executed directly via Node
if (
  typeof require !== 'undefined' &&
  typeof module !== 'undefined' &&
  require.main === module
) {
  startDeployableServer().catch((err) => {
    console.error('[Hut4Devs] Failed to start server:', err);
    process.exit(1);
  });
}
