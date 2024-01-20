// this test try to use this library as a commonjs module

const { test } = require('tap');
const KnexAPI = require('../index.cjs');

test('Knex as cjs module', async t => {
    const app = require('fastify')();
    app.register(KnexAPI, {
        knexConfig: {
            client: process.env.CRUD_CLIENT,
            connection: process.env.CRUD_DB_URI
        }
    });

    t.after(app.close.bind(app));

    await app.ready();

    t.test('plugin is loaded', async t => {
        // test if the plugin is loaded
        t.ok(app.knexAPI);
        t.ok(app.knex);
    });

    t.test('exists the api for the table "authors"', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        // check if the response is Object like {total: integer, items: [...]}
        t.ok(typeof res_list.json() === 'object');
        t.ok(typeof res_list.json().total === 'number');
        t.ok(Array.isArray(res_list.json().items));
        // check total = items.length
        t.equal(res_list.json().total, 70);
    });
});