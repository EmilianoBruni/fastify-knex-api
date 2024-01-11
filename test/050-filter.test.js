import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

checkEnv(t)

t.test('Check filtering', async t => {
    const app = await createServer(t);

    t.test('Filter by id', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id=4'
            }
        });
        t.equal(res.statusCode, 200);
        t.equal(res.json().items.length, 1);
        t.equal(res.json().items[0].id, 4);
    });

    t.test('Filter by name', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: "first_name='Nunzia'"
            }
        });
        t.equal(res.statusCode, 200);
        t.equal(res.json().items.length, 2);
        t.equal(res.json().items[0].id, 7);
        t.equal(res.json().items[0].first_name, 'Nunzia');
    });

    t.test('Filter by id less than', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'id<=4'
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 4);
        [1, 2, 3, 4].forEach(id => {
            t.equal(json.items[id - 1].id, id);
        });
    });

    t.test('And filter with no result', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: "id<=4 AND first_name='Gabriele'"
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 0);
    });

    t.test('And filter with one result', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: "id<=4 AND first_name='Deborah'"
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 1);
        t.equal(json.items[0].id, 3);
    });

    t.test('And and or filters with two results', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: "id<=4 AND (first_name='Deborah' OR first_name='Quasimodo')"
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 2);
        t.equal(json.items[0].id, 3);
        t.equal(json.items[1].id, 4);
    });
    t.test('And and or filters with two results and sort', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: "id<=4 AND (first_name='Deborah' OR first_name='Quasimodo')",
                sort: '-first_name'
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 2);
        t.equal(json.items[0].id, 4);
        t.equal(json.items[1].id, 3);
    });

    t.test('Filter over boolean field', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'active=true'
            }
        });
        t.equal(res.statusCode, 200);
        const json = res.json();
        t.equal(json.items.length, 27);

        const res2 = await app.inject({
            method: 'GET',
            url: '/api/authors',
            query: {
                filter: 'active=false'
            }
        });
        t.equal(res2.statusCode, 200);
        const json2 = res2.json();
        t.equal(json2.items.length, 43);
    });
});

t.end();
