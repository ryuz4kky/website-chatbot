import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import ReactDOMServer from 'react-dom/server';

const appName = 'YZ Studio';

export default async (page) => {
    try {
        return await createInertiaApp({
            page,
            title: (title) => title ? `${title}` : appName,
            render: ReactDOMServer.renderToString,
            resolve: async (name) => {
                try {
                    return await resolvePageComponent(`./Pages/${name}.jsx`, import.meta.glob('./Pages/**/*.jsx'));
                } catch (error) {
                    console.error('[SSR] Failed to resolve page component:', name, error);
                    throw error;
                }
            },
            setup({ App, props }) {
                return <App {...props} />;
            },
        });
    } catch (error) {
        console.error('[SSR] Failed to render page:', page?.component, error);
        throw error;
    }
};
