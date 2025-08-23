import {
    createServer,
    initServer,
    registerKnexAPI,
    checkEnv
} from './helpers.js';
import t from 'tap';
import type { Test } from 'tap';
import { RouteOptions } from 'fastify';
import { TKASchema } from '../src/types.js';
import { FastifyInstance } from 'fastify';

checkEnv(t);

const authors_note_db = [
    { author_id: 1, row: 1, note: 'Note1 for author1' },
    { author_id: 1, row: 2, note: 'Note2 for author1' },
    { author_id: 2, row: 1, note: 'Note1 for author2' },
    { author_id: 2, row: 2, note: 'Note2 for author2' }
];

const authors_address_db = [
    { author_id: 1, address_key: 'home', address: '123 Main St, Anytown, USA' },
    {
        author_id: 1,
        address_key: 'work',
        address: '456 Corporate Blvd, Business City, USA'
    },
    {
        author_id: 2,
        address_key: 'home',
        address: '789 Elm St, Othertown, USA'
    },
    {
        author_id: 2,
        address_key: 'work',
        address: '101 Business Rd, Work City, USA'
    }
];

const authors_note_newrec = {
    author_id: 1,
    row: 3,
    note: 'Note3 for author1'
};

const authors_address_newrec = {
    author_id: 3,
    address_key: 'home',
    address: '123 New St, Newtown, USA'
};

t.test('Checking default schema for combined pks', t_default_schema);
t.test('With autodiscovery tables', t_autodiscovery_full);
t.test(
    'Select only some tables as array (autodiscover pk)',
    t_autodiscovery_pks
);
t.test(
    'Select only some tables via config (no autodiscovery)',
    t_fullset_via_config
);

async function t_default_schema(t: Test) {
    const server = initServer(t);
    const routes: RouteOptions[] = [];
    server.addHook('onRoute', route => {
        routes.push(route);
    });
    registerKnexAPI(server, { tables: ['authors_note', 'authors_address'] });
    await server.ready();

    t.test('Checking default schema for GET /authors_note', async t => {
        const route = routes.find(
            route =>
                route.url === '/api/authors_note/' && route.method === 'GET'
        );
        t.ok(route, 'Expected route to be defined');
        const schema = route?.schema as TKASchema;
        t.ok(schema.response, 'Expected response to be defined');
        if (!schema.response) return;
        t.ok(schema.response[200], 'Expected response 200 to be defined');
        if (!schema.response[200]) return;
        t.ok(
            schema.response[200].properties,
            'Expected response 200 properties to be defined'
        );
        if (!schema.response[200].properties) return;
        t.hasOwnPropsOnly(
            schema.response[200].properties,
            ['total', 'items'],
            'Expected response 200 properties to match'
        );
        const prop = schema.response[200].properties;
        t.equal(prop['total'].type, 'integer', 'Expected total to be integer');
        t.equal(prop['items'].type, 'array', 'Expected items to be array');
        t.ok(prop['items'].items, 'Expected items to be defined');
        if (!prop['items'].items) return;
        t.equal(
            prop['items'].items.$ref,
            'fastify-knex-api/tables/authors_note#',
            'Expected items array to reference authors_notes table'
        );

        const qs = schema.querystring as { $ref: string };
        t.ok(qs, 'Expected querystring to be defined');
        if (!qs) return;
        t.ok(qs.$ref, 'Expected querystring $ref to be defined');
        t.equal(
            qs.$ref,
            'fastify-knex-api/query#/properties/list',
            'Expected querystring $ref to match'
        );
    });
    t.test(
        'Checking default schema for GET /authors_address/:author_id/:address_key',
        async t => {
            const route = routes.find(
                route =>
                    route.url ===
                        '/api/authors_address/:author_id/:address_key' &&
                    route.method === 'GET'
            );
            t.ok(route);
            if (!route) return;
            t.ok(route.schema);
            const schema = route?.schema as TKASchema;
            t.ok(schema.response);
            if (!schema.response) return;
            t.ok(schema.response[200]);
            if (!schema.response[200]) return;
            t.ok(schema.response[200].$ref);
            t.equal(
                schema.response[200].$ref,
                'fastify-knex-api/tables/authors_address#',
                'Expected response 200 $ref to match'
            );
            t.ok(schema.params, 'Expect schema.params to be defined');
            const params = schema.params as {
                properties: Record<string, unknown>;
            };

            t.ok(params.properties, 'Expected params.properties to be defined');
            t.ok(
                params.properties.author_id,
                'Expected params.properties.author_id to be defined'
            );
            t.ok(
                params.properties.address_key,
                'Expected params.properties.address_key to be defined'
            );
        }
    );
}

async function t_autodiscovery_full(t: Test) {
    const app = await createServer(t);

    t.test('Test all verbs', async t => t_fullVerbs(t, app));
}

async function t_autodiscovery_pks(t: Test) {
    const app = await createServer(t, {
        tables: ['authors', 'authors_note', 'authors_address']
    });

    t_fullVerbs(t, app);
}

async function t_fullset_via_config(t: Test) {
    const app = await createServer(t, {
        tables: [
            { name: 'authors_note', pk: ['author_id', 'row'] },
            { name: 'authors_address', pk: ['author_id', 'address_key'] }
        ]
    });

    t_fullVerbs(t, app);
}

async function t_fullVerbs(t: Test, app: FastifyInstance) {
    t.test('test GET /api/authors_note (LIST)', async t =>
        st_LIST_authors_note(t, app)
    );
    t.test('test GET /api/authors_address (LIST)', async t =>
        st_LIST_authors_address(t, app)
    );
    t.test('test GET /api/authors_note/:author_id/:row (GET)', async t =>
        st_GET_authors_note(t, app)
    );
    t.test(
        'test GET /api/authors_address/:author_id/:address_key (GET)',
        async t => st_GET_authors_address(t, app)
    );
    t.test('test POST /api/authors_note (CREATE)', async t =>
        st_POST_authors_note(t, app)
    );

    t.test('test POST /api/authors_address (CREATE)', async t =>
        st_POST_authors_address(t, app)
    );

    t.test('test PATCH /api/authors_note/:author_id/:row (PATCH)', async t =>
        st_PATCH_authors_note(t, app)
    );

    t.test(
        'test PATCH /api/authors_address/:author_id/:address_key (PATCH)',
        async t => st_PATCH_authors_address(t, app)
    );

    t.test('test DELETE /api/authors_note/:author_id/:row (DELETE)', async t =>
        st_DELETE_authors_note(t, app)
    );

    t.test(
        'test DELETE /api/authors_address/:author_id/:address_key (DELETE)',
        async t => st_DELETE_authors_address(t, app)
    );
}

async function st_LIST_authors_note(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'GET',
        url: '/api/authors_note?fields=-created_at'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.ok(res.json().total, 'Expected total to be defined');
    t.ok(res.json().items, 'Expected items to be defined');
    t.equal(
        res.json().total,
        authors_address_db.length,
        'Expected total to match'
    );
    t.equal(
        res.json().items.length,
        authors_address_db.length,
        'Expected items length to match'
    );
    t.match(res.json().items, authors_note_db, 'Expected items to match');
}

async function st_LIST_authors_address(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'GET',
        url: '/api/authors_address?fields=-created_at'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.ok(res.json().total, 'Expected total to be defined');
    t.ok(res.json().items, 'Expected items to be defined');
    t.equal(
        res.json().total,
        authors_address_db.length,
        'Expected total to match'
    );
    t.equal(
        res.json().items.length,
        authors_address_db.length,
        'Expected items length to match'
    );
    t.match(res.json().items, authors_address_db, 'Expected items to match');
}

async function st_GET_authors_note(t: Test, app: FastifyInstance) {
    let res = await app.inject({
        method: 'GET',
        url: '/api/authors_note/1/1'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_note_db[0], 'Expected item to match');
    res = await app.inject({
        method: 'GET',
        url: '/api/authors_note/1/2'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_note_db[1], 'Expected item to match');
    res = await app.inject({
        method: 'GET',
        url: '/api/authors_note/2/1'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_note_db[2], 'Expected item to match');
}

async function st_GET_authors_address(t: Test, app: FastifyInstance) {
    let res = await app.inject({
        method: 'GET',
        url: '/api/authors_address/1/home'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_address_db[0], 'Expected item to match');
    res = await app.inject({
        method: 'GET',
        url: '/api/authors_address/1/work'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_address_db[1], 'Expected item to match');
    res = await app.inject({
        method: 'GET',
        url: '/api/authors_address/2/home'
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json(), authors_address_db[2], 'Expected item to match');
}

async function st_POST_authors_note(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'POST',
        url: '/api/authors_note',
        payload: authors_note_newrec
    });
    t.equal(res.statusCode, 201, 'Expected status code match');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.ok(res.json().created_at, 'Expected created_at to be defined');
    t.match(res.json(), authors_note_newrec, 'Expected item to match');
}

async function st_POST_authors_address(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'POST',
        url: '/api/authors_address',
        payload: authors_address_newrec
    });
    t.equal(res.statusCode, 201, 'Expected status code match');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.ok(res.json().created_at, 'Expected created_at to be defined');
    t.match(res.json(), authors_address_newrec, 'Expected item to match');
}

async function st_PATCH_authors_note(t: Test, app: FastifyInstance) {
    const authors_note_patch = 'Note3 for author1 patched';
    const res = await app.inject({
        method: 'PATCH',
        url: '/api/authors_note/1/3',
        payload: { note: authors_note_patch }
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(res.json().note, authors_note_patch, 'Expected item to match');
}

async function st_PATCH_authors_address(t: Test, app: FastifyInstance) {
    const authors_address_patch = '123 New Street, New City';
    const res = await app.inject({
        method: 'PATCH',
        url: '/api/authors_address/3/home',
        payload: { address: authors_address_patch }
    });
    t.equal(res.statusCode, 200, 'Expected status code 200');
    t.ok(res.json(), 'Expected JSON response');
    t.ok(typeof res.json() === 'object', 'Expected response to be object');
    t.match(
        res.json().address,
        authors_address_patch,
        'Expected item to match'
    );
}

async function st_DELETE_authors_note(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'DELETE',
        url: '/api/authors_note/1/3'
    });
    t.equal(res.statusCode, 204, 'Expected status code 204');
    t.equal(res.body, '', 'Expected empty body');
}

async function st_DELETE_authors_address(t: Test, app: FastifyInstance) {
    const res = await app.inject({
        method: 'DELETE',
        url: '/api/authors_address/3/home'
    });
    t.equal(res.statusCode, 204, 'Expected status code 204');
    t.equal(res.body, '', 'Expected empty body');
}
