# fastify-knex-api

Fastify plugin to expose API for Knex Query Builder

If you are using [Fastify](https://github.com/fastify/fastify) as your server and [Knex](https://knexjs.org/) as your ODM, **fastify-knex-api** is the easiest solution to run API server for your models. 

**fastify-knex-api** generates REST routes with refs subroutes like `/api/authors` and `/api/authors/AUTHOR_ID` autodiscovered all tables and primary keys or permit to select which tables to expose.

### As simple as:
```javascript
import knexAPI from 'fastify-knex-api';
import Fastify from 'fastify';

const fastify = Fastify();

fastify.register(knexAPI, { // plugin registration
    knexConfig: {           // See: initialization parameters
        client: 'YOUR_CLIENT_ADAPTER (mysql, oracle)',
        connection: 'YOUR_QUERY_STRING',
    }
});

await fastify.ready();      // waiting for plugins registration
await fastify.listen(8080); // running the server
```
And if your database has `authors` and `posts` tables the result routes will be something like this

```
/
└── api/
    ├── authors (GET, HEAD, POST)
    │   └── / (GET, HEAD, POST)
    │       └── :id (GET, HEAD, PATCH, DELETE)
    └── posts (GET, HEAD, POST)
        └── / (GET, HEAD, POST)
            └── :id (GET, HEAD, PATCH, DELETE)
```

## Installation

```bash
npm i fastify-knex-api -s
```

## Initialization

Register plugin on fastify instance:

```javascript
const fastify = Fastify();
fastify.register(knexAPI, options);
```

with following options:

### .knexConfig

Knex configuration options like

```javascript
{  
    client: 'YOUR_CLIENT_ADAPTER (mysql, oracle)',
    connection: 'YOUR_QUERY_STRING',
}
```

See Knex [documentation](https://knexjs.org/guide/#configuration-options) for other parameters.


### .prefix : string (default: '/api/')

Path prefix. Default is `/api/`.

### .tables: Array of string || Array of Object

An array of tables to expose or an object of tables to expose with their primary key

```javascript
[  
    {table: 'authors', pk: 'id' },
    {table: 'posts', pk: 'post_id' }
]
```
Default is to autodiscover and expose all tables and to autodiscover their primary keys.

## Options for list method

In list method (`GET /api/authors`) we can use URL options to paginating, sorting, filter items and a mix of them.

### Pagination

Options to limit and eventually skip some records

```javascript
/api/authors?limit=5        // return first 5 items
/api/authors?limit=5&skip=6 // skip first 6 items and return next 5
/api/authors?limit=5&page=2 // page of 5 items. We get page 2 (6 to 10)
```

|         | Option Name | Default Value |
| ------- | ----------- | ------------- |
| Offset  | offset      | 0             |
| Offset  | skip        | 0             |
| Limit   | limit       | infinity      |
| Page    | page        | 1             |
| Page    | window      | 1             |    

* offset and skip are aliases
* window and page are aliases

## License

Licensed under [APACHE 2.0](./LICENSE)

## AUTHOR

Emiliano Bruni <info@ebruni.it>