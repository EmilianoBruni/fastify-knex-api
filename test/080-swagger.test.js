import { initServer, registerKnexAPI } from './helpers.js';
import swagger from '@fastify/swagger';
import swagger_ui from '@fastify/swagger-ui';
import t from 'tap';

t.test('schema', async t => {
    const server = initServer(t);
    server.register(swagger, {
        openapi: {
            info: {
                title: 'Test swagger',
                description: 'testing the fastify swagger api',
                version: '0.1.0'
            }
        }
    });
    server.register(swagger_ui, {
        title: 'Test swagger',
        routePrefix: '/doc'
    });

    registerKnexAPI(server, {}, ['swagger-ui']);

    await server.ready();

    t.test('Doc page available', async t => {
        const response = await server.inject({ url: '/doc/static/index.html' });
        t.equal(response.statusCode, 200);
    });
    t.test('JSON schema available', async t => {
        const response = await server.inject({ url: '/doc/json' });
        t.equal(response.statusCode, 200);
    });

    t.test('Check authors/id swagger schema view', async t => {
        const response = await server.inject({ url: '/doc/json' });
        t.equal(response.statusCode, 200);
        const paths = response.json().paths;
        const authors = paths['/api/authors/{id}'];
        t.ok(authors, 'authors path exists');
        const get = authors.get;
        t.ok(get, 'authors get exists');
        const resp = get.responses;
        t.ok(resp, 'authors get responses exists');
        const twohundred = resp['200'];
        t.ok(twohundred, 'authors get responses 200 exists');
        t.ok(twohundred.content, 'authors get responses 200 content exists');
        const appjson = twohundred.content['application/json'];
        t.ok(appjson, '200 content application/json exists');
        const schema = appjson.schema;
        t.ok(schema, '200 schema exists');
        const ref = schema.$ref;
        t.ok(ref, '200 schema ref exists');
        // TODO: check ref
    });
    t.test('exists the api for the table "authors"', async t => {
        // test if exists the api for the table "users"
        const res_list = await server.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
    });
});

t.end();
