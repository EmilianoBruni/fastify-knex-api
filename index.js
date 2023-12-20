import fp from 'fastify-plugin';

function initPlugin(fastify, opts, next) {
    opts = opts || {};
    opts.fastify = fastify;

    const api = {}; // TODO: implement api
    fastify.decorate('knexAPI', api);
    next();
}

const plugin = fp(initPlugin, {
    fastify: '>=1.0.0',
    name: 'fastify-knex-api'
});

export default plugin;
