import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

checkEnv(t)

t.test('Check sorting', async t => {
    const app = await createServer(t);

    t.test('Sort by id', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=id'
        });
        t.equal(res.statusCode, 200);
        // first record has id == 1
        t.equal(res.json().items[0].id, 1);
    });

    t.test('Sort by id desc', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=-id'
        });
        t.equal(res.statusCode, 200);
        // first record has id == 5
        t.equal(res.json().items[0].id, res.json().total);
    });

    t.test('Sort by name', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=first_name'
        });
        t.equal(res.statusCode, 200);
        // first record has id == 67
        t.equal(res.json().items[0].id, 67);
    });

    t.test('Sort by name desc', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=-first_name'
        });
        t.equal(res.statusCode, 200);
        // first record has id == 1
        t.equal(res.json().items[0].id, 16);
    });

    t.test('Sort by name and id', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=first_name,id'
        });
        t.equal(res.statusCode, 200);
        // first record has id ==67
        t.equal(res.json().items[0].id, 67);
    });

    t.test('Sort by id and name', async t => {
        const res = await app.inject({
            method: 'GET',
            url: '/api/authors?sort=id,first_name'
        });
        t.equal(res.statusCode, 200);
        // first record has id == 1
        t.equal(res.json().items[0].id, 1);
    });
});

t.end();
