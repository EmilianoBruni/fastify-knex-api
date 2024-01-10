import { initServer, registerKnexAPI } from './helpers.js';
import t from 'tap';

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
    const routes = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
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

t.end();
