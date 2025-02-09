// this test try to use this library as a commonjs module

// disable eslint rule for this file
/* eslint-disable */

const { test } = require('tap');
const scriptPath = '../dist/index.cjs';
const scriptFullPath = require('path').join(__dirname, scriptPath);

// skip if ../index.cjs not exists
test(
    'Knex as cjs module',
    {
        // use dirname to resolve the path
        skip: !require('fs').existsSync(scriptFullPath)
    },
    async t => {
        if (!process.env.CRUD_CLIENT || !process.env.CRUD_DB_URI) {
            t.skip('CRUD_CLIENT or CRUD_DB_URI env variable not set');
            t.end();
            process.exit(0);
        }

        const KnexAPI = require(scriptPath);
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
    }
);
