import { createServer } from './helpers.js';
import t from 'tap';

t.test('Check pagination', async t => {
    const app = await createServer(t);

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
        // check total == 10
        t.equal(res.json().total, 10);
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
            // check total == 10
            t.equal(res.json().total, 10);
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
            // check total == 10
            t.equal(res.json().total, 10);
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
                t.equal(res.json().total, 10);
                // first record has id == 3
                t.equal(res.json().items[0].id, 3);
            }
        );
    });
});

t.end();
