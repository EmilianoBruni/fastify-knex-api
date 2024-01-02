import knexAPI from '../index.js';
import fastify from 'fastify';

export async function createServer(t, pluginConfig = {}) {
    const app = initServer(t, pluginConfig);
    await app.ready();
    return app;
}

export function initServer(t, pluginConfig = {}) {
    const app = fastify();
    if (!pluginConfig.knexConfig) {
        pluginConfig.knexConfig = {
            client: 'mysql2',
            connection: 'mysql://root:test@mariadb:3306/test'
        };
    }
    app.register(knexAPI, pluginConfig);
    t.after(app.close.bind(app));
    return app;
}
