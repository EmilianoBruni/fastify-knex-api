import { createServer } from './helpers.js';
import t from 'tap';

t.test('Projection list', async t => {
    const server = await createServer(t);

    t.test('Show a single field', async t => {
        const res = await server.inject({
            url: '/api/authors?fields=first_name'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.ok(json.items, 'Items are returned');
        t.ok(json.items.length > 0, "There's at least one item");

        const item = json.items[0];
        t.hasOwnPropsOnly(
            item,
            ['first_name'],
            'Only the requested fields are returned'
        );
    });

    t.test('Show multiple fields', async t => {
        const res = await server.inject({
            url: '/api/authors?fields=id,first_name,last_name'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.ok(json.items, 'Items are returned');
        t.ok(json.items.length > 0, "There's at least one item");

        const item = json.items[0];
        t.hasOwnPropsOnly(
            item,
            ['id', 'first_name', 'last_name'],
            'Only the requested fields are returned'
        );
    });

    t.test('Show all fields explicit', async t => {
        const res = await server.inject({
            url: '/api/authors?fields=*'
        });

        t.equal(res.statusCode, 200);

        const json = res.json();

        t.ok(json.items, 'Items are returned');
        t.ok(json.items.length > 0, "There's at least one item");

        const item = json.items[0];
        t.hasOwnPropsOnly(
            item,
            ['id', 'first_name', 'last_name', 'email', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude a single field', async t => {
        const res = await server.inject({
            url: '/api/authors?fields=-email'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.ok(json.items, 'Items are returned');
        t.ok(json.items.length > 0, "There's at least one item");

        const item = json.items[0];
        t.hasOwnPropsOnly(
            item,
            ['id', 'first_name', 'last_name', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude multiple fields', async t => {
        const res = await server.inject({
            url: '/api/authors?fields=-id,email,active,added'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.ok(json.items, 'Items are returned');
        t.ok(json.items.length > 0, "There's at least one item");

        const item = json.items[0];
        t.hasOwnPropsOnly(
            item,
            ['first_name', 'last_name'],
            'Only the requested fields are returned'
        );
    });
});

t.test("Projection single record", async t => {
    const server = await createServer(t);

    t.test('Show a single field', async t => {
        const res = await server.inject({
            url: '/api/authors/1?fields=first_name'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.hasOwnPropsOnly(
            json,
            ['first_name'],
            'Only the requested fields are returned'
        );
    });

    t.test('Show multiple fields', async t => {
        const res = await server.inject({
            url: '/api/authors/1?fields=id,first_name,last_name'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.hasOwnPropsOnly(
            json,
            ['id', 'first_name', 'last_name'],
            'Only the requested fields are returned'
        );
    });

    t.test('Show all fields explicit', async t => {
        const res = await server.inject({
            url: '/api/authors/1?fields=*'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();
        console.log(json);

        t.hasOwnPropsOnly(
            json,
            ['id', 'first_name', 'last_name', 'email', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude a single field', async t => {
        const res = await server.inject({
            url: '/api/authors/1?fields=-email'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.hasOwnPropsOnly(
            json,
            ['id', 'first_name', 'last_name', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude multiple fields', async t => {
        const res = await server.inject({
            url: '/api/authors/1?fields=-id,email,active,added'
        });

        t.equal(res.statusCode, 200, 'Status code is 200');

        const json = res.json();

        t.hasOwnPropsOnly(
            json,
            ['first_name', 'last_name'],
            'Only the requested fields are returned'
        );
    });
})

t.end();
