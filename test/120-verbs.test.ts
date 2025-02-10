import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

process.env.TZ = 'UTC'; // set timezone to UTC to avoid problems with dates

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

checkEnv(t);

t.test('Check verbs in manual table configuration', async t => {
    const app = await createServer(t, {
        tables: [
            {
                name: 'authors',
                pk: 'id',
                verbs: ['list']
            }
        ]
    });

    t.test('LIST for the table "authors" exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.ok(typeof res_list.json() === 'object');
        t.ok(typeof res_list.json().total === 'number');
        t.ok(Array.isArray(res_list.json().items));
        t.equal(res_list.json().total, 70);
        t.same(res_list.json().items[0], firstRecordAuthors);
    });

    t.test('GET for the table "authors" doesn\'t exist', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/1' });
        t.equal(res_list.statusCode, 404);
    });
});

t.test('Check verbs in verbs callback', async t => {
    const app = await createServer(t, {
        verbs: (tableName, verbs) => {
            if (tableName === 'authors') {
                return ['list'];
            }
            return verbs;
        }
    });

    t.test('LIST for the table "authors" exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.ok(typeof res_list.json() === 'object');
        t.ok(typeof res_list.json().total === 'number');
        t.ok(Array.isArray(res_list.json().items));
        t.equal(res_list.json().total, 70);
        t.same(res_list.json().items[0], firstRecordAuthors);
    });

    t.test('GET for the table "authors" doesn\'t exist', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/1' });
        t.equal(res_list.statusCode, 404);
    });

    t.test('GET for the table "posts" exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/posts/1' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.ok(typeof res_list.json() === 'object');
        t.same(res_list.json(), firstRecordPosts);
    });
});

t.test('Return undefined to enable all verbs', async t => {
    const app = await createServer(t, {
        tables: [
            {
                name: 'authors',
                pk: 'id',
                verbs: ['list']
            }
        ],
        verbs: () => {
            return undefined;
        }
    });

    t.test('GET for the table "authors" exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/1' });
        t.equal(res_list.statusCode, 200);
        t.equal(
            res_list.headers['content-type'],
            'application/json; charset=utf-8'
        );
        t.ok(typeof res_list.json() === 'object');
        t.same(res_list.json(), firstRecordAuthors);
    });
});

t.test('Return empty array to disable all verbs', async t => {
    const app = await createServer(t, {
        tables: [
            {
                name: 'authors',
                pk: 'id',
                verbs: ['list']
            }
        ],
        verbs: () => {
            return [];
        }
    });

    t.test('GET for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/1' });
        t.equal(res_list.statusCode, 404);
    });

    t.test('LIST for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 404);
    });

    t.test('POST for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({
            url: '/api/authors/',
            method: 'POST',
            payload: JSON.stringify(newRecordAuthors)
        });
        t.equal(res_list.statusCode, 404);
    });
});

t.test('Return empty array in manual config to disable all verbs', async t => {
    const app = await createServer(t, {
        tables: [
            {
                name: 'authors',
                pk: 'id',
                verbs: []
            }
        ]
    });

    t.test('GET for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/1' });
        t.equal(res_list.statusCode, 404);
    });

    t.test('LIST for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({ url: '/api/authors/' });
        t.equal(res_list.statusCode, 404);
    });

    t.test('POST for the table "authors" doesn\'t exists', async t => {
        // test if exists the api for the table "authors"
        const res_list = await app.inject({
            url: '/api/authors/',
            method: 'POST',
            payload: JSON.stringify(newRecordAuthors)
        });
        t.equal(res_list.statusCode, 404);
    });
});

t.end();
