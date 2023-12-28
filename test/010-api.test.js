import { createServer } from './helpers.js';
import t from 'tap';

const firstRecordAuthors = {
    id: 1,
    first_name: 'Michael',
    last_name: 'Messina',
    email: 'monia89@example.org',
    active: true,
    added: '2011-10-09T08:34:11.000Z'
};

const firstRecordPosts = {
    post_id: 1,
    author_id: 1,
    title: 'Eveniet a aut labore numquam unde quo.',
    description:
        'Illum et quibusdam consequatur dicta. Magni est minus sunt dicta et nam libero. Dignissimos illo voluptatum quod facilis consequatur aliquam tempora.',
    content:
        'Aspernatur sit magnam reiciendis non. Officiis aut est est odio. Aut et nesciunt labore similique molestiae voluptatem.'
};

const newRecordAuthors = {
    first_name: 'Emiliano',
    last_name: 'Bruni',
    email: 'info@ebruni.it',
    added: '2011-10-09 10:34:11'
};

let lastId = 0;

t.test('Unitialized Knex config', async t => {
    t.rejects(
        createServer(t, { knexConfig: 'error' }),
        'knexConfig is required'
    );
});

t.test('Autodiscovery tables info', async t => {
    const app = await createServer(t);

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
        t.same(res_list.json().items[0], firstRecordAuthors);

        const res_view = await app.inject({ url: '/api/authors/1' });
        t.equal(res_view.statusCode, 200);
        t.equal(
            res_view.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.same(res_view.json(), firstRecordAuthors);
    });

    t.test('Wrong record id', async t => {
        const res = await app.inject({ url: '/api/authors/0' });
        t.equal(res.statusCode, 404);
        t.equal(res.json().message, 'Not found');
    });

    t.test('exists the api for the table "posts"', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/posts/' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.ok(typeof res_list.json() === 'object');
        t.ok(typeof res_list.json().total === 'number');
        t.ok(Array.isArray(res_list.json().items));
        // check total = items.length
        t.equal(res_list.json().total, res_list.json().items.length);
        t.same(res_list.json().items[0], firstRecordPosts);

        const res_view = await app.inject({ url: '/api/posts/1' });
        t.equal(res_view.statusCode, 200);
        t.equal(
            res_view.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.same(res_view.json(), firstRecordPosts);
    });

    t.test('create a new record', t => {
        app.inject({
            method: 'POST',
            url: '/api/authors/',
            payload: newRecordAuthors
        }).then(res => {
            t.equal(res.statusCode, 200);
            lastId = res.json();
            // check lastId is a number
            t.ok(typeof lastId === 'number');
            t.end();
        });
    });

    t.test('Try to create a duplicated record', async t => {
        const res = await app.inject({
            method: 'POST',
            url: '/api/authors/',
            payload: newRecordAuthors
        });
        t.equal(res.statusCode, 500);
        t.equal(res.json().message, 'Error');
    });

    t.test('update last record', t => {
        app.inject({
            method: 'PATCH',
            url: `/api/authors/${lastId}`,
            payload: {
                first_name: 'Massimiliano'
            }
        })
            .then(res => {
                t.equal(res.statusCode, 200);
                t.equal(res.json().affected, 1);
                // get updated record
                return app.inject({
                    method: 'GET',
                    url: `/api/authors/${lastId}`
                });
            })
            .then(res => {
                t.equal(res.statusCode, 200);
                t.equal(res.json().first_name, 'Massimiliano');
                t.end();
            });
    });

    t.test('Try to update a record with wrong id', async t => {
        const res = await app.inject({
            method: 'PATCH',
            url: `/api/authors/0`,
            payload: {
                first_name: 'Massimiliano'
            }
        });
        t.equal(res.statusCode, 404);
        t.equal(res.json().message, 'Not found');
    });

    t.test('Try to update a record with wrong payload', async t => {
        const res = await app.inject({
            method: 'PATCH',
            url: `/api/authors/${lastId}`,
            payload: {
                wrong_fiels: ''
            }
        });
        t.equal(res.statusCode, 500);
        t.equal(res.json().message, 'Error');
    });

    t.test('delete last record', t => {
        app.inject({
            method: 'DELETE',
            url: `/api/authors/${lastId}`
        }).then(res => {
            t.equal(res.statusCode, 200);
            t.equal(res.json().affected, 1);
            t.end();
        });
    });

    t.test('Try to delete a record with wrong id', async t => {
        const res = await app.inject({
            method: 'DELETE',
            url: `/api/authors/${lastId}`
        });
        t.equal(res.statusCode, 404);
        t.equal(res.json().message, 'Not found');
    });
});

t.test('Select only some tables as array (autodiscover pk)', async t => {
    const app = await createServer(t, { tables: ['authors'] });

    t.test('the plugin is loaded', async t => {
        // test if the plugin is loaded
        t.ok(app.knexAPI);
        t.ok(app.knex);
    });

    t.test('exists the api for the table "authors"', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
    });

    t.test('exists the api for the table "authors"', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
    });

    t.test('api for the table "posts" doesn\'t exist', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/posts/' });
        t.equal(res_list.statusCode, 404);
    });
});

t.test('Forgot to use tables name in config', async t => {
    t.rejects(
        createServer(t, { tables: [{ pk: 'post_id' }] }),
        'Table name not specified'
    );
});

t.test('Select only some tables as object', async t => {
    const app = await createServer(t, {
        tables: [{ name: 'posts', pk: 'post_id' }]
    });

    t.test('the plugin is loaded', async t => {
        // test if the plugin is loaded
        t.ok(app.knexAPI);
        t.ok(app.knex);
    });

    t.test('exists the api for the table "posts"', async t => {
        // test if exists the api for the table "posts"
        const res_list = await app.inject({ url: '/api/posts/' });
        t.equal(res_list.statusCode, 200);
    });

    t.test('api for the table "authors" doesn\'t exist', async t => {
        // test if exists the api for the table "users"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 404);
    });
});

t.end();
