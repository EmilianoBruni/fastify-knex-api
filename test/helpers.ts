import knexAPI from '../src/index.js';
import fastify from 'fastify';
import { FastifyInstance } from 'fastify';
import type { Test } from 'tap';
import type { IKAOptions as IKAPluginOptions } from '../src/types.js';

declare let process: {
    env: {
        CRUD_CLIENT: string;
        CRUD_DB_URI: string;
    };
    exit: (code: number) => void;
};

export async function createServer(
    t: Test,
    pluginConfig: Partial<IKAPluginOptions> = {}
) {
    const app = initServer(t);
    registerKnexAPI(app, pluginConfig);
    await app.ready();
    return app;
}

export function initServer(t: Test) {
    const app = fastify();
    t.after(app.close.bind(app));
    return app;
}

export function registerKnexAPI(
    app: FastifyInstance,
    pluginConfig: Partial<Pick<IKAPluginOptions, 'knexConfig'>> &
        Omit<IKAPluginOptions, 'knexConfig'> = {}
) {
    if (pluginConfig.knexConfig === undefined) {
        pluginConfig.knexConfig = {
            client: process.env.CRUD_CLIENT,
            connection: process.env.CRUD_DB_URI
        };
    }
    const pC = pluginConfig as IKAPluginOptions;
    app.register(knexAPI, pC);
}

export function checkEnv(t: Test) {
    if (!process.env.CRUD_CLIENT || !process.env.CRUD_DB_URI) {
        t.skip(() => 'CRUD_CLIENT or CRUD_DB_URI env variable not set');
        t.end();
        process.exit(0);
    }
}
