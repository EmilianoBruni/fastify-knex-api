// @ts-nocheck
import { createServer } from './helpers.js';
import t from 'tap';

t.test('Unitialized Knex config', async t => {
    t.rejects(
        createServer(t, { knexConfig: 'error' }), 
        'knexConfig is required'
    );
});

t.test('Forgot to use tables name in config', async t => {
    t.rejects(
        createServer(t, { tables: [{ pk: 'post_id' }] }),
        'Table name not specified'
    );
});

t.end();