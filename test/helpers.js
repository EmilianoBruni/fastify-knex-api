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
            client: process.env.CRUD_CLIENT,
            connection: process.env.CRUD_DB_URI
        };
    }
    app.register(knexAPI, pluginConfig);
}

export function checkEnv(t) {
    if (!process.env.CRUD_CLIENT || !process.env.CRUD_DB_URI) {
        t.skip('CRUD_CLIENT or CRUD_DB_URI env variable not set');
        t.end();
        process.exit(0);
    }
}
