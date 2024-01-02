import knexAPI from '../index.js';
import fastify from 'fastify';

export async function createServer(t, pluginConfig = {}) {
    const app = initServer(t);
    registerKnexAPI(app, pluginConfig);
    await app.ready();
    return app;
}

export function initServer(t) {
    const app = fastify();
    t.after(app.close.bind(app));
    return app;
}

export function registerKnexAPI(app, pluginConfig = {}) {
    if (!pluginConfig.knexConfig) {
        pluginConfig.knexConfig = {
            client: 'mysql2',
            connection: 'mysql://root:test@mariadb:3306/test'
        };
    }
    app.register(knexAPI, pluginConfig);
}
