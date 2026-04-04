import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import _server from '@inertiajs/server';
import ReactDOMServer from 'react-dom/server';

const createServer = _server.default ?? _server;

const appName = 'YZ Studio';

createServer((page) =>
    createInertiaApp({
        page,
        title: (title) => title ? `${title}` : appName,
        render: ReactDOMServer.renderToString,
        resolve: (name) =>
            resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx')),
        setup({ App, props }) {
            return <App {...props} />;
        },
    })
);
