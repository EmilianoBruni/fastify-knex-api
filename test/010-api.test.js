import t from 'tap';
import fastify from 'fastify';

import knexAPI from '../index.js';

function createServer(t) {
    const app = fastify();
    app.register(knexAPI, {
        knexConfig: {
            client: 'mysql2',
            connection: {
                host: 'mariadb',
                port: 3306,
                user: 'root',
                password: 'test',
                database: 'test'
            }
        }
    });
    t.after(app.close.bind(app));
    return app;
}

const app = createServer(t);
await app.ready();

t.test('test if the plugin is loaded', async t => {
    // test if the plugin is loaded
    t.ok(app.knexAPI);
    t.ok(app.knex);
});

t.end();

