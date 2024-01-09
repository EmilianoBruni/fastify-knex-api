import { initServer, registerKnexAPI } from './helpers.js';
import t from 'tap';

t.test('schema', async t => {
    t.test('Checking default schema', async t => {
        const server = initServer(t);
        const routes = [];
        server.addHook('onRoute', route => {
            routes.push(route);
        });
        registerKnexAPI(server, { tables: ['authors'] });
        await server.ready();

        t.test('Checking default schema for GET /authors', async t => {
            const route = routes.find(
                route => route.url === '/api/authors/' && route.method === 'GET'
            );
            t.ok(route);
            t.ok(route.schema);
            t.ok(route.schema.response);
            t.ok(route.schema.response[200]);
            t.ok(route.schema.response[200].properties);
            t.hasOwnPropsOnly(route.schema.response[200].properties, [
                'total',
                'items'
            ]);
            t.equal(
                route.schema.response[200].properties.total.type,
                'integer'
            );
            t.equal(route.schema.response[200].properties.items.type, 'array');
            t.equal(
                route.schema.response[200].properties.items.items.$ref,
                'fastify-knex-api/tables/authors#'
            );
            t.ok(route.schema.querystring);
            t.ok(route.schema.querystring.$ref);
            t.equal(
                route.schema.querystring.$ref,
                'fastify-knex-api/query#/properties/list'
            );
        });
        t.test('Checking default schema for GET /authors/:id', async t => {
            const route = routes.find(
                route =>
                    route.url === '/api/authors/:id' && route.method === 'GET'
            );
            t.ok(route);
            t.ok(route.schema);
            t.ok(route.schema.response);
            t.ok(route.schema.response[200]);
            t.ok(route.schema.response[200].$ref);
            t.equal(
                route.schema.response[200].$ref,
                'fastify-knex-api/tables/authors#'
            );
            t.ok(route.schema.params);
            t.ok(route.schema.params.properties);
            t.ok(route.schema.params.properties.id);
        });
    });

    t.test('Checking empty schema for all tables', async t => {
        const server = initServer(t);
        const routes = [];
        server.addHook('onRoute', route => {
            routes.push(route);
        });
        registerKnexAPI(server, { schemas: [] });
        await server.ready();

        t.test('Checking empty schema for GET /authors', async t => {
            const route = routes.find(
                route => route.url === '/api/authors/' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        t.test('Checking empty schema for GET /authors/:id', async t => {
            const route = routes.find(
                route =>
                    route.url === '/api/authors/:id' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        t.test('Checking empty schema for GET /posts', async t => {
            const route = routes.find(
                route => route.url === '/api/posts/' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        t.test('Checking empty schema for GET /posts/:id', async t => {
            const route = routes.find(
                route =>
                    route.url === '/api/posts/:id' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
    });

    t.test('Checking empty schema for specific tables', async t => {
        const server = initServer(t);
        const routes = [];
        server.addHook('onRoute', route => {
            routes.push(route);
        });
        registerKnexAPI(server, { schemas: [{ name: 'authors' }] });
        await server.ready();

        t.test('Checking empty schema for GET /authors', async t => {
            const route = routes.find(
                route => route.url === '/api/authors/' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        t.test('Checking empty schema for GET /authors/:id', async t => {
            const route = routes.find(
                route =>
                    route.url === '/api/authors/:id' && route.method === 'GET'
            );
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        t.test('Checking default schema for GET /posts', async t => {
            const route = routes.find(
                route => route.url === '/api/posts/' && route.method === 'GET'
            );
            t.ok(route);
            t.ok(route.schema);
            t.ok(route.schema.response);
            t.ok(route.schema.response[200]);
            t.ok(route.schema.response[200].properties);
            t.hasOwnPropsOnly(route.schema.response[200].properties, [
                'total',
                'items'
            ]);
            t.equal(
                route.schema.response[200].properties.total.type,
                'integer'
            );
            t.equal(route.schema.response[200].properties.items.type, 'array');
            t.equal(
                route.schema.response[200].properties.items.items.$ref,
                'fastify-knex-api/tables/posts#'
            );
            t.ok(route.schema.querystring);
            t.ok(route.schema.querystring.$ref);
            t.equal(
                route.schema.querystring.$ref,
                'fastify-knex-api/query#/properties/list'
            );
        });

        t.test('Checking default schema for GET /posts/:id', async t => {
            const route = routes.find(
                route =>
                    route.url === '/api/posts/:id' && route.method === 'GET'
            );
            t.ok(route);
            t.ok(route.schema);
            t.ok(route.schema.response);
            t.ok(route.schema.response[200]);
            t.ok(route.schema.response[200].$ref);
            t.equal(
                route.schema.response[200].$ref,
                'fastify-knex-api/tables/posts#'
            );
            t.ok(route.schema.params);
            t.ok(route.schema.params.properties);
            t.ok(route.schema.params.properties.id);
        });
    });
});

t.end();
