import path from 'path';
import { initServer, registerKnexAPI, checkEnv } from './helpers.js';
import t from 'tap';

checkEnv(t);

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
        t.equal(route.schema.response[200].properties.total.type, 'integer');
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
            route => route.url === '/api/authors/:id' && route.method === 'GET'
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
    registerKnexAPI(server, { schemas: () => {} });
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
            route => route.url === '/api/authors/:id' && route.method === 'GET'
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
            route => route.url === '/api/posts/:id' && route.method === 'GET'
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
    const schemas = (tableName, defSchemas) =>
        tableName === 'authors' ? undefined : defSchemas;
    registerKnexAPI(server, { schemas: schemas });
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
            route => route.url === '/api/authors/:id' && route.method === 'GET'
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
        t.equal(route.schema.response[200].properties.total.type, 'integer');
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
            route => route.url === '/api/posts/:id' && route.method === 'GET'
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
    t.equal(res2.statusCode, 200);
    t.ok(res2.json().id);
    // remove author
    const id = res2.json().id;
    await server.knex('authors').where('id', id).del();
});

t.test('Checking schemaDirPath', async t => {
    const server = initServer(t);
    const routes = [];
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
        t.equal(res2.statusCode, 200);
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
                    t.ok(route.schema);
                    t.ok(route.schema.response);
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
