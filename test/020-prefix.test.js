import { createServer } from './helpers.js';
import t from 'tap';

const prefix = '/crud';

t.test('Use a different prefix', async t => {
    const app = await createServer(t, { prefix: prefix });

    t.test('Get all authors', async t => {
        const res = await app.inject({
            method: 'GET',
            url: `${prefix}/authors`
        });
        t.equal(res.statusCode, 200);
        t.equal(res.headers['content-type'], 'application/json; charset=utf-8');
        // check if the response is Object like {total: integer, items: [...]}
        t.ok(typeof res.json() === 'object');
        t.ok(typeof res.json().total === 'number');
        t.ok(Array.isArray(res.json().items));
        // check total = items.length
        t.equal(res.json().total, res.json().items.length);
    });
});

t.end();
