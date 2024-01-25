// Class to manage CRUD operations

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { createError } from '@fastify/error';
import { TKACrudGenHandlerOptions, TKACrudOptions } from '../types.js';

const MissingControllerError = createError(
    'CRUD_MISSING_CONTROLLER',
    'Missing CRUD controller for %s'
);

const NotAuthorizedError = createError(
    'CRUD_NOT_AUTHORIZED',
    'Not authorized to perform CRUD operation',
    401
);

const crud = async (fastify: FastifyInstance, opts: TKACrudOptions) => {
    if (!opts.controller) {
        throw new MissingControllerError(opts.prefix || '/');
    }

    const routeOpts = {
        list: { url: '/', ...opts.list },
        create: { url: '/', ...opts.create },
        view: { url: '/:id', ...opts.view },
        update: { url: '/:id', ...opts.update },
        delete: { url: '/:id', ...opts.delete }
    };
    const config = {
        ...opts,
        ...routeOpts
    };

    fastify.get(config.list.url, {
        handler: async (req, reply) =>
            genHandler(req, reply, { ...config, type: 'list' }),
        ...config.list
    });

    fastify.post(config.create.url, {
        handler: async (req, reply) =>
            genHandler(req, reply, { ...config, type: 'create' }),
        ...config.create
    });

    fastify.get(config.view.url, {
        handler: async (req, reply) =>
            genHandler(req, reply, { ...config, type: 'view' }),
        ...config.view
    });

    fastify.patch(config.update.url, {
        handler: async (req, reply) =>
            genHandler(req, reply, { ...config, type: 'update' }),
        ...config.update
    });

    fastify.delete(config.delete.url, {
        handler: async (req, reply) =>
            genHandler(req, reply, { ...config, type: 'delete' }),
        ...config.delete
    });
};

const genHandler = async (req: FastifyRequest, reply: FastifyReply, config: TKACrudGenHandlerOptions) => {
    let checkAuth = true;
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
