import type { IKAPluginOptions, IKAApiOptions } from './types.ts';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import API from './Classes/API.js';
import fp from 'fastify-plugin';
import knex from 'knex';

//async function initPlugin(fastify: IKA, opts: IKAPluginOptions): Promise<void> {
const initPlugin: FastifyPluginAsync<IKAPluginOptions> = async (
    fastify: FastifyInstance,
    opts: IKAPluginOptions
) => {
    // opts.knexConfig is required and must be an object
    if (!opts.knexConfig || typeof opts.knexConfig !== 'object') {
        throw new Error('knexConfig is required');
    }

    const knexHandler = knex(opts.knexConfig);

    const apiOpts: IKAApiOptions = {
        ...opts,
        fastify,
        knex: knexHandler
    };

    const api = new API(apiOpts);
    await api.isInizialized;

    fastify.decorate('knexAPI', api);
    fastify.decorate('knex', knexHandler);

    fastify.addHook('onClose', async instance => {
        if (instance.knex === knexHandler) {
            instance.knex.destroy();
            delete instance.knex;
        }
        if (instance.knexAPI === api) {
            delete instance.knexAPI;
        }
    });
};

const plugin = fp(initPlugin, {
    fastify: '>=2.0.0',
    name: 'fastify-knex-api'
});

export default plugin;
