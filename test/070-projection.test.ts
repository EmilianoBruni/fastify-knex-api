import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

checkEnv(t);

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

t.test('Projection single record', async t => {
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
});

t.test('Projection on create', async t => {
    const server = await createServer(t);
    let id: string;
    const rec = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@email.fak'
    };
    const cleanUp = async () => {
        await server.inject({
            method: 'DELETE',
            url: `/api/authors/${id}`
        });
    };
    t.afterEach(cleanUp);

    t.test('Show a single field', async t => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors?fields=id',
            body: rec
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id'],
            'Only the requested fields are returned'
        );
        id = res.json().id;
    });

    t.test('Show multiple fields', async t => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors?fields=id,first_name,last_name',
            body: rec
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name'],
            'Only the requested fields are returned'
        );
        id = res.json().id;
    });

    t.test('Show all fields explicit', async t => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors?fields=*',
            body: rec
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name', 'email', 'active', 'added'],
            'Only the requested fields are returned'
        );
        id = res.json().id;
    });

    t.test('Exclude a single field', async t => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors?fields=-email',
            body: rec
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name', 'active', 'added'],
            'Only the requested fields are returned'
        );
        id = res.json().id;
    });

    t.test('Exclude multiple fields', async t => {
        const res = await server.inject({
            method: 'POST',
            url: '/api/authors?fields=-email,active,added',
            body: rec
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name'],
            'Only the requested fields are returned'
        );
        id = res.json().id;
    });
});

t.test('Projection on update', async t => {
    const server = await createServer(t);

    const cleanUp = async () => {
        // revert update
        await server.inject({
            method: 'PATCH',
            url: `/api/authors/1`,
            body: {
                first_name: 'Michael',
                last_name: 'Messina'
            }
        });
    };
    t.afterEach(cleanUp);

    const firstRecordAuthors = {
        first_name: 'Michael',
        last_name: 'Jefferson'
    };

    t.test('Show a single field', async t => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/api/authors/1?fields=first_name',
            body: firstRecordAuthors
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['first_name'],
            'Only the requested fields are returned'
        );
    });

    t.test('Show multiple fields', async t => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/api/authors/1?fields=first_name,last_name',
            body: firstRecordAuthors
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['first_name', 'last_name'],
            'Only the requested fields are returned'
        );
        t.equal(res.json().last_name, 'Jefferson');
    });

    t.test('Show all fields explicit', async t => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/api/authors/1?fields=*',
            body: firstRecordAuthors
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name', 'email', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude a single field', async t => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/api/authors/1?fields=-email',
            body: firstRecordAuthors
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name', 'active', 'added'],
            'Only the requested fields are returned'
        );
    });

    t.test('Exclude multiple fields', async t => {
        const res = await server.inject({
            method: 'PATCH',
            url: '/api/authors/1?fields=-email,active,added',
            body: firstRecordAuthors
        });

        t.equal(res.statusCode, 200, 'Status code is 200');
        t.hasOwnPropsOnly(
            res.json(),
            ['id', 'first_name', 'last_name'],
            'Only the requested fields are returned'
        );
    });
});

t.end();
