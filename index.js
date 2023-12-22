import API from './src/API.js';
import fp from 'fastify-plugin';
import knex from 'knex';

async function initPlugin(fastify, opts) {
    opts.fastify = fastify;

    // opts.knexConfig is required and must be an object
    if (!opts.knexConfig || typeof opts.knexConfig !== 'object') {
        throw new Error('knexConfig is required');
    }

    const knexHandler = knex(opts.knexConfig);
    delete opts.knexConfig;

    opts.knex = knexHandler;

    const api = new API(opts);
    await api.isInizialized;

    fastify.decorate('knexAPI', api);
    fastify.decorate('knex', knexHandler);

    fastify.addHook('onClose', (instance, done) => {
        if (instance.knex === knexHandler) {
            instance.knex.destroy(done);
            delete instance.knex;
        }
        if (instance.knexAPI === api) {
            delete instance.knexAPI;
        }
        done();
    });
}

const plugin = fp(initPlugin, {
    fastify: '>=2.0.0',
    name: 'fastify-knex-api'
});

export default plugin;
