import { createServer } from './helpers.js';
import { createError } from '@fastify/error';
import t from 'tap';

let isAuthed = false;
let isDefined = false;

const errNotAuthorized = createError('CUST_NOT_AUTHORIZED', 'Go away', 401);

t.test('Test auth', async t => {
    const server = await createServer(t, {
        checkAuth: async (req, reply) => {
            if (!isAuthed && isDefined) {
                reply.send(new errNotAuthorized());
                return false;
            } else if (isDefined) {
                return true;
            }
            // if !isAuthed and !isDefined do nothing
        }
    });

    t.test('Check auth defined but not set (default not auth)', async t => {
        const res = await server.inject({
            method: 'GET',
            url: '/api/authors'
        });
        t.equal(res.statusCode, 401);
        const json = res.json();
        t.equal(json.code, 'CRUD_NOT_AUTHORIZED');
        t.equal(json.message, 'Not authorized to perform CRUD operation');
    });

    t.test('Check auth defined and not auth (not auth)', async t => {
        isDefined = true;
        const res = await server.inject({
            method: 'GET',
            url: '/api/authors'
        });
        t.equal(res.statusCode, 401);
        const json = res.json();
        t.equal(json.code, 'CUST_NOT_AUTHORIZED');
        t.equal(json.message, 'Go away');
    });

    t.test('Check auth defined and auth (auth)', async t => {
        isDefined = true;
        isAuthed = true;
        const res = await server.inject({
            method: 'GET',
            url: '/api/authors'
        });
        t.equal(res.statusCode, 200);
    });
});
