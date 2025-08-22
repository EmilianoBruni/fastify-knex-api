// Class to manage CRUD operations
import type {
    TKACrudGenHandlerOptions,
    TKACrudOptions,
    TKARequest,
    TKAReply
} from '../types.js';
import type { FastifyInstance, FastifyPluginAsync } from 'fastify';
import { createError } from '@fastify/error';

const MissingControllerError = createError(
    'CRUD_MISSING_CONTROLLER',
    'Missing CRUD controller for %s'
);

const NotAuthorizedError = createError(
    'CRUD_NOT_AUTHORIZED',
    'Not authorized to perform CRUD operation',
    401
);

const crud: FastifyPluginAsync<TKACrudOptions> = async (
    fastify: FastifyInstance,
    opts: TKACrudOptions
) => {
    if (!opts.controller) {
        throw new MissingControllerError(opts.prefix || '/');
    }

    const buildUrlWithParams = () => {
        const ret: string[] = [];
        opts.pks.forEach(pk => ret.push(`/:${pk}`));
        return ret.join('');
    };

    // TODO: must be dynamic based on pks
    const routeOpts = {
        list: { url: '/', ...opts.list },
        create: { url: '/', ...opts.create },
        view: { url: buildUrlWithParams(), ...opts.view },
        update: { url: buildUrlWithParams(), ...opts.update },
        delete: { url: buildUrlWithParams(), ...opts.delete }
    };
    const config = {
        ...opts,
        ...routeOpts
    };

    if (!opts.verbs || opts.verbs.includes('list')) {
        fastify.get(config.list.url, {
            handler: async (req, reply) =>
                genHandler(req, reply, { ...config, type: 'list' }),
            ...config.list
        });
    }

    if (!opts.verbs || opts.verbs.includes('create')) {
        fastify.post(config.create.url, {
            handler: async (req, reply) =>
                genHandler(req, reply, { ...config, type: 'create' }),
            ...config.create
        });
    }

    if (!opts.verbs || opts.verbs.includes('view')) {
        fastify.get(config.view.url, {
            handler: async (req, reply) =>
                genHandler(req, reply, { ...config, type: 'view' }),
            ...config.view
        });
    }

    if (!opts.verbs || opts.verbs.includes('update')) {
        fastify.patch(config.update.url, {
            handler: async (req, reply) =>
                genHandler(req, reply, { ...config, type: 'update' }),
            ...config.update
        });
    }

    if (!opts.verbs || opts.verbs.includes('delete')) {
        fastify.delete(config.delete.url, {
            handler: async (req, reply) =>
                genHandler(req, reply, { ...config, type: 'delete' }),
            ...config.delete
        });
    }
};

const genHandler = async (
    req: TKARequest,
    reply: TKAReply,
    config: TKACrudGenHandlerOptions
) => {
    let checkAuth: boolean | undefined = true;
    if (typeof config.checkAuth === 'function') {
        checkAuth = await config.checkAuth(req, reply);
    }
    if (!checkAuth) {
        // no error was thrown by checkAuth, we set one as a default
        if (reply.statusCode < 299) reply.send(new NotAuthorizedError());
        return;
    }
    return config.controller[config.type](req, reply);
};

export default crud;
