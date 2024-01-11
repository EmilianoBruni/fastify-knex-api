import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

checkEnv(t)

t.test('Check pagination without filters', async t => {
    const app = await createServer(t);

    t.test('Get all items (default limit)', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors'
        });
        t.equal(res.statusCode, 200);
        t.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        const json = res.json();
        // check if the response is Object like {total: integer, items: [...]}
        t.ok(typeof json === 'object');
        t.ok(typeof json.total === 'number');
        t.ok(Array.isArray(json.items));
        // check if the limit is respected
        t.equal(json.items.length, 50);
        // check total == 70
        t.equal(json.total, 70);
        // last record has id == 50
        t.equal(json.items.at(-1).id, 50);
    });

    t.test('Get really all items (limit = -1)', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?limit=-1'
        });
        t.equal(res.statusCode, 200);
        t.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        const json = res.json();
        // check if the response is Object like {total: integer, items: [...]}
        t.ok(typeof json === 'object');
        t.ok(typeof json.total === 'number');
        t.ok(Array.isArray(json.items));
        // check if we got all items
        t.equal(json.items.length, 70);
        // check total == 70
        t.equal(json.total, 70);
        // last record has id == 70
        t.equal(json.items.at(-1).id, 70);
    });

    t.test('Limit the number of items', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?limit=2'
        });
        t.equal(res.statusCode, 200);
        t.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        // check if the response is Object like {total: integer, items: [...]}
        t.ok(typeof res.json() === 'object');
        t.ok(typeof res.json().total === 'number');
        t.ok(Array.isArray(res.json().items));
        // check if the limit is respected
        t.equal(res.json().items.length, 2);
        t.equal(res.json().total, 70);
        // last record has id == 2
        t.equal(res.json().items.at(-1).id, 2);
    });

    ['offset', 'skip'].forEach(param => {
        t.test(`Limit the number of items and ${param} some`, async t => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/authors?limit=2&${param}=2`
            });
            t.equal(res.statusCode, 200);
            // check if the limit is respected
            t.equal(res.json().items.length, 2);
            t.equal(res.json().total, 70);
            // first record has id == 3
            t.equal(res.json().items[0].id, 3);
        });
    });
    [('page', 'window')].forEach(param => {
        t.test(`Limit the number of items and get first ${param}`, async t => {
            const res = await app.inject({
                method: 'GET',
                url: `/api/authors?limit=2&${param}=1`
            });
            t.equal(res.statusCode, 200);
            // check if the limit is respected
            t.equal(res.json().items.length, 2);
            t.equal(res.json().total, 70);
            // first record has id == 1
            t.equal(res.json().items[0].id, 1);
        });
        t.test(
            `Limit the number of items and use ${param} option to skip some`,
            async t => {
                const res = await app.inject({
                    method: 'GET',
                    url: `/api/authors?limit=2&${param}=2`
                });
                t.equal(res.statusCode, 200);
                // check if the limit is respected
                t.equal(res.json().items.length, 2);
                // check total == 10
                t.equal(res.json().total, 70);
                // first record has id == 3
                t.equal(res.json().items[0].id, 3);
            }
        );
    });
});

t.test('Check pagination with filters', async t => {
    const app = await createServer(t);

    t.test('Limit the number of items', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id <= 5',
                limit: 2
            }
        });

        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.total, 5);
        t.equal(json.items.length, 2);
        t.equal(res.json().items.at(-1).id, 2);
    });

    t.test('Limit the number of items and skip some', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id <= 5',
                limit: 2,
                offset: 2
            }
        });

        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.total, 5);
        t.equal(json.items.length, 2);
        t.equal(json.items[0].id, 3);
    });

    t.test('Limit the number of items and get first page', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id <= 5',
                limit: 2,
                page: 1
            }
        });

        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.total, 5);
        t.equal(json.items.length, 2);
        t.equal(json.items[0].id, 1);
    });

    t.test('Limit the number of items and get second page', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id <= 5',
                limit: 2,
                page: 2
            }
        });

        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.total, 5);
        t.equal(json.items.length, 2);
        t.equal(json.items[0].id, 3);
    });
});

t.end();
