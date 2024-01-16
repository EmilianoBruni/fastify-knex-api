import { createServer, checkEnv } from './helpers.js';
import t from 'tap';

const prefix = '/crud';

checkEnv(t);

t.test('Use a different prefix', async t => {
    const app = await createServer(t, { prefix: prefix });

    t.test('Get all authors', async t => {
        const res = await app.inject({
            method: 'GET',
            url: `${prefix}/authors`
        });
        t.equal(res.statusCode, 200);
    });
});

t.end();
