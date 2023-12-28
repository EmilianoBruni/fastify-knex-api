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
[ 'authors', 'posts']

// or

[  
    {name: 'authors', pk: 'id' },
    {name: 'posts',   pk: 'post_id' }
]
```
Default is to autodiscover and expose all tables and, on request, to autodiscover their primary keys if not manually set.

## API schema

### List

```javascript
GET /api/authors
```

List records in authors table. Return a structure like this

```javascript
{
  total: 70,
  items: [
    {
      id: 1,
      first_name: 'Michael',
      last_name: 'Messina',
      email: 'monia89@example.org',
      active: 1,
      added: '2011-10-09T08:34:11.000Z'
    },
    {
      id: 2,
      first_name: 'Joannes',
      last_name: 'Russo',
      email: 'sorrentino.akira@example.net',
      active: 1,
      added: '1982-02-11T19:39:12.000Z'
    },
    ...
  ]
}
```

where

* `total` is the count of record in the table based on [filters](#filtering) (where)
* `items` are records based on filters (where) and [pagination](#pagination) (skip, page, limit, ...)

## Options for list method

In list method (`GET /api/authors`) we can use URL options to paginating, sorting, filter items and a mix of them.

### Pagination

Options to limit and eventually skip some records

```javascript
/api/authors                // return first 50 items
/api/authors?limit=-1       // return all items in table
/api/authors?limit=5        // return first 5 items
/api/authors?limit=5&skip=6 // skip first 6 items and return next 5
/api/authors?limit=5&page=2 // page of 5 items. We get page 2 (6 to 10)
```

|         | Option Name | Default Value |
| ------- | ----------- | ------------- |
| Offset  | offset      | 0             |
| Offset  | skip        | 0             |
| Limit   | limit       | 50            |
| Page    | page        | 1             |
| Page    | window      | 1             |    

* offset and skip are aliases
* window and page are aliases

To get all records force limit=-1

### Sorting

Pass sort option string. A `-` at the beginning for descending order. `name` for sorting by name field or `-name` for descending sort by it.

Separate fields by `,` to allow multiple sorting. So `-first_name,last_name` for sorting by `first_name` in descending order and then for `last_name` in ascending.

```javascript
/api/authors?sort=-first_name,last_name
```

|         | Option Name | Default Value |
| ------- | ----------- | ------------- |
| Sort    | sort        | null          |

### Filtering

Raw filtering is available via filter query option. 

```javascript
/api/posts?filter=author_id%3D1
```

will return all posts for `author_id` with id equals to 1. 

Filter must be obviously url encoded and so `%3D` here is urlencoded '=' symbol, so actual option value is `author_id=1`.

We can use some http(s) library to simplify URL encoding. For [axios](https://www.npmjs.com/package//axios), at an example, we can write

```javascript
const res = await axios.get('/api/posts', { 
    params: { 
        filter: 'author_id=1'
    } 
});
```

|         | Option Name | Default Value |
| ------- | ----------- | ------------- |
| Filter  | filter      | null          |

The filter parameter has passed as is to knex [`whereRaw`](https://knexjs.org/guide/query-builder.html#whereraw)

## License

Licensed under [APACHE 2.0](./LICENSE)

## AUTHOR

Emiliano Bruni <info@ebruni.it>