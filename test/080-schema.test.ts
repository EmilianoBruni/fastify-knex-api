import path from 'path';
import { initServer, registerKnexAPI, checkEnv } from './helpers.js';
import t from 'tap';
import { RouteOptions } from 'fastify';
import { TKASchema } from '../src/types.js';

checkEnv(t);

t.test('Checking default schema', async t => {
    const server = initServer(t);
    const routes: RouteOptions[] = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
    registerKnexAPI(server, { tables: ['authors'] });
    await server.ready();

    t.test('Checking default schema for GET /authors', async t => {
        const route = routes.find(
            route => route.url === '/api/authors/' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        const schema = route?.schema as TKASchema;
        if (!schema.response || t.ok(schema.response)) return;
        t.ok(schema.response[200]);
        if (
            !schema.response[200]?.properties ||
            t.ok(schema.response[200].properties)
        )
            return;
        t.hasOwnPropsOnly(schema.response[200].properties, ['total', 'items']);
        const prop = schema.response[200].properties;
        if (!prop['total'] || t.equal(prop['total'].type, 'integer')) return;
        if (!prop['items'] || t.equal(prop['items'].type, 'array')) return;
        if (
            !prop['items'].items ||
            t.equal(
                prop['items'].items.$ref,
                'fastify-knex-api/tables/authors#'
            )
        )
            return;

        const qs = schema.querystring as { $ref: string };
        if (!qs || t.ok(qs)) return;
        if (!qs.$ref || t.ok(qs.$ref)) return;
        t.equal(qs.$ref, 'fastify-knex-api/query#/properties/list');
    });
    t.test('Checking default schema for GET /authors/:id', async t => {
        const route = routes.find(
            route => route.url === '/api/authors/:id' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.ok(route.schema);
        const schema = route?.schema as TKASchema;
        if (!schema.response || t.ok(schema.response)) return;
        if (!schema.response[200] || !t.ok(schema.response[200])) return;
        t.ok(schema.response[200].$ref);
        t.equal(schema.response[200].$ref, 'fastify-knex-api/tables/authors#');
        if (!schema.params || t.ok(schema.params)) return;
        const params = schema.params as { properties: Record<string, unknown> };

        t.ok(params.properties);
        t.ok(params.properties.id);
    });
});

t.test('Checking empty schema for all tables', async t => {
    const server = initServer(t);
    const routes: RouteOptions[] = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
    registerKnexAPI(server, {
        schemas: () => {
            return {
                list: { schema: {} },
                create: { schema: {} },
                view: { schema: {} },
                update: { schema: {} },
                delete: { schema: {} }
            };
        }
    });
    await server.ready();

    t.test('Checking empty schema for GET /authors/:id', async t => {
        const route = routes.find(
            route => route.url === '/api/authors/:id' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.match(route.schema, {}, 'Route has no schema defined');
    });
    t.test('Checking empty schema for GET /posts', async t => {
        const route = routes.find(
            route => route.url === '/api/posts/' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.ok(route);
        t.match(route.schema, {}, 'Route has no schema defined');
    });
    t.test('Checking empty schema for GET /posts/:id', async t => {
        const route = routes.find(
            route => route.url === '/api/posts/:id' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.match(route.schema, {}, 'Route has no schema defined');
    });
});

t.test('Checking empty schema for specific tables', async t => {
    const server = initServer(t);
    const routes: RouteOptions[] = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
    const schemas = (tableName, defSchemas) =>
        tableName === 'authors' ? undefined : defSchemas;
    registerKnexAPI(server, { schemas: schemas });
    await server.ready();

    t.test('Checking empty schema for GET /authors', async t => {
        const route = routes.find(
            route => route.url === '/api/authors/' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.notOk(route.schema, 'Route has no schema defined');
    });
    t.test('Checking empty schema for GET /authors/:id', async t => {
        const route = routes.find(
            route => route.url === '/api/authors/:id' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        t.notOk(route.schema, 'Route has no schema defined');
    });
    t.test('Checking default schema for GET /posts', async t => {
        const route = routes.find(
            route => route.url === '/api/posts/' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        if (!route.schema || !t.ok(route.schema)) return;
        if (!route.schema.response || !t.ok(route.schema.response)) return;
        t.ok(route.schema.response[200]);
        t.ok(route.schema.response[200].properties);
        t.hasOwnPropsOnly(route.schema.response[200].properties, [
            'total',
            'items'
        ]);
        t.equal(route.schema.response[200].properties.total.type, 'integer');
        t.equal(route.schema.response[200].properties.items.type, 'array');
        t.equal(
            route.schema.response[200].properties.items.items.$ref,
            'fastify-knex-api/tables/posts#'
        );
        if (!route.schema.querystring || !t.ok(route.schema.querystring))
            return;
        const qs = route.schema.querystring as { $ref: string };
        t.ok(qs.$ref);
        t.equal(qs.$ref, 'fastify-knex-api/query#/properties/list');
    });

    t.test('Checking default schema for GET /posts/:id', async t => {
        const route = routes.find(
            route => route.url === '/api/posts/:id' && route.method === 'GET'
        );
        if (!route || !t.ok(route)) return;
        if (!route.schema || !t.ok(route.schema)) return;
        if (!route.schema.response || !t.ok(route.schema.response)) return;
        t.ok(route.schema.response[200]);
        t.equal(
            route.schema.response[200].$ref,
            'fastify-knex-api/tables/posts#'
        );

        const params = route.schema.params as {
            properties: Record<string, unknown>;
        };
        t.ok(params);
        t.ok(params.properties);
        t.ok(params.properties.id);
    });
});

t.test('Alter schema for specific tables', async t => {
    const server = initServer(t);
    const schemas = (tableName, defSchemas) => {
        if (tableName === 'authors') {
            // for author creation, we set 'active' as required
            defSchemas.create.schema.body.required = ['active'];
        }
        return defSchemas;
    };
    registerKnexAPI(server, { schemas: schemas });
    await server.ready();

    // try to create an author without 'active'
    const rec = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'jd@jd.com'
    } as {
        first_name: string;
        last_name: string;
        email: string;
        active?: boolean;
    };
    const res = await server.inject({
        method: 'POST',
        url: '/api/authors/',
        body: rec
    });
    t.equal(res.statusCode, 400);
    // json.message should have 'active' as required
    t.match(res.json().message, /active/);
    if (res.json().id) {
        t.fail('Author was created without required active');
        // remove author
        const id = res.json().id;
        await server.knex('authors').where('id', id).del();
    }

    // all works if we add active
    rec.active = true;
    const res2 = await server.inject({
        method: 'POST',
        url: '/api/authors/',
        body: rec
    });
    t.equal(res2.statusCode, 201, 'Status code match');
    t.ok(res2.json().id);
    // remove author
    const id = res2.json().id;
    await server.knex('authors').where('id', id).del();
});

t.test('Checking schemaDirPath', async t => {
    const server = initServer(t);
    const routes: RouteOptions[] = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
    // build full path to test/schemas
    const __dirname = path.dirname(new URL(import.meta.url).pathname);
    const schemaDirPath = path.join(__dirname, 'schemas');
    registerKnexAPI(server, { schemaDirPath: schemaDirPath });
    await server.ready();
    t.test('Checking schema for GET /authors (required fields)', async t => {
        // try to create an author without 'active'
        const rec = {
            first_name: 'John',
            last_name: 'Doe',
            email: 'jd@jd.com'
        } as {
            first_name: string;
            last_name: string;
            email: string;
            active?: boolean;
        };
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors/',
            body: rec
        });
        t.equal(res.statusCode, 400);
        // json.message should have 'active' as required
        t.match(res.json().message, /active/);
        if (res.json().id) {
            t.fail('Author was created without required active');
            // remove author
            const id = res.json().id;
            await server.knex('authors').where('id', id).del();
        }

        // all works if we add active
        rec.active = true;
        const res2 = await server.inject({
            method: 'POST',
            url: '/api/authors/',
            body: rec
        });
        t.equal(res2.statusCode, 201, 'Status code match');
        t.ok(res2.json().id);
        // remove author
        const id = res2.json().id;
        await server.knex('authors').where('id', id).del();
    });

    t.test('Checking schema for GET /posts (no schema at all)', async t => {
        // find all router for /api/posts

        const routesList = routes.filter(route => route.url === '/api/posts/');
        routesList.forEach(route => {
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
        const routesGet = routes.filter(
            route => route.url === '/api/posts/:id'
        );
        routesGet.forEach(route => {
            t.ok(route);
            t.notOk(route.schema, 'Route has no schema defined');
        });
    });

    t.test(
        'Checking schema for GET /all_std_types (disabled list, create, delete)',
        async t => {
            // find all router for /api/posts

            const routesList = routes.filter(
                route => route.url === '/api/all_std_types/'
            );
            routesList.forEach(route => {
                t.ok(route);
                t.notOk(route.schema, 'Route has no schema defined');
            });
            const routesGet = routes.filter(
                route => route.url === '/api/all_std_types/:id'
            );
            routesGet.forEach(route => {
                if (route.method === 'DELETE') {
                    // no schema for DELETE
                    t.ok(route);
                    t.notOk(route.schema, 'Route has no schema defined');
                } else {
                    // schema for GET
                    t.ok(route);
                    if (!route.schema || !t.ok(route.schema)) return;
                    if (!route.schema.response || !t.ok(route.schema.response))
                        return;
                    t.ok(route.schema.response[200]);
                    t.ok(route.schema.response[200].$ref);
                    t.equal(
                        route.schema.response[200].$ref,
                        'fastify-knex-api/tables/all_std_types#'
                    );
                }
            });
        }
    );
});

t.end();
