const http = require('http');

let render = null;

(async () => {
    try {
        const mod = await import('./ssr.js');
        render = mod.default;
        console.log('[SSR] Render function loaded');
    } catch (err) {
        console.error('[SSR] Failed to load ssr.js:', err);
    }
})();

const readBody = (req) => new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
});

const normalizePath = (rawUrl = '/') => {
    const pathname = new URL(rawUrl, 'http://localhost').pathname;
    const stripped = pathname.replace(/^\/ssr(?=\/|$)/, '') || '/';

    if (stripped.length > 1) {
        return stripped.replace(/\/+$/, '');
    }

    return stripped;
};

const handler = async (req, res) => {
    const url = normalizePath(req.url);

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Server', 'Inertia.js SSR');

    if (url === '/health' || url === '/') {
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'OK', timestamp: Date.now() }));
        return;
    }

    if (url === '/render' && req.method === 'POST') {
        if (!render) {
            res.writeHead(503);
            res.end(JSON.stringify({ error: 'Renderer not ready' }));
            return;
        }
        try {
            const body = await readBody(req);
            const page = JSON.parse(body);
            const result = await render(page);
            res.writeHead(200);
            res.end(JSON.stringify(result));
        } catch (err) {
            console.error('[SSR] Render error:', err);
            res.writeHead(500);
            res.end(JSON.stringify({ error: err.message }));
        }
        return;
    }

    res.writeHead(404);
    res.end(JSON.stringify({ status: 'NOT_FOUND', timestamp: Date.now() }));
};

const port = Number(process.env.PORT || process.env.INERTIA_SSR_PORT || 13714);
const server = http.createServer(handler);

server.listen(port, () => {
    console.log(`[SSR] Server listening on port ${port}`);
});

server.on('error', (err) => {
    console.error(`[SSR] Failed to start on port ${port}:`, err.message);
});
