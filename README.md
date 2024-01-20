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

#### .checkAuth : function

Function to run before any API request to check authorization permissions in. 

If not set, all crud routes are allowed.


```javascript
  checkAuth: async (req, reply) => {
    ...
    return true;
  }, // all crud routes are allowed. As not set checkAuth
```

If return `true`, user is allowed to perform action.

If return `false`, user is not allowed to perform action. In this case you should return a 401 custom error code as this

```javascript
 checkAuth: async(req, reply) => {
  reply.status(401);
 } // all crud routes are denied
```

If `checkAuth` doesn't set an error code, a default is set.

```json
{
  "statusCode": 401,
  "code": "CRUD_NOT_AUTHORIZED",
  "error": "Unauthorized",
  "message": "Not authorized to perform CRUD operation"
}
```

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

#### .schemas: function

Optional function to call to alter [default validation and serialization schema](#example-of-an-auto-generated-validation-and-serializazion-schema).

See [here](#schemas-function) for some example. 

`.schemas` has this signature

```javascript
.schemas = (table_name, schema) => {
  ...
  return schema;
}
```

where table_name is the table name and schema is the generated schema. 

If `.schemaDirPath` is defined, it's called after `.schemaDirPath`.

#### .schemaDirPath: function

Directory where it's possible to define schemas for validation and serialization. 

If exists, module `.schemaDirPath/${table_name}.schema.js` is loaded and the default export function has called.

This function should have this signature:

```javascript
(schema) => {
  ...
  return schema;
}
```

where schema is the generated schema. 

If `.schemas` is defined, it's called before `.schemas`.

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

### View

```javascript
GET /api/authors/1
```

Return a single record with the primary key as parameter.


```javascript
{
  id: 1,
  first_name: 'Michael',
  last_name: 'Messina',
  email: 'monia89@example.org',
  active: 1,
  added: '2011-10-09T08:34:11.000Z'
}
```

Supports [projection](#projection) as parameter.

```javascript
GET /api/authors/1?fields=id,first_name
```

return

```javascript
{
  id: 1,
  first_name: 'Michael',
}
```

### Create

```javascript
POST /api/authors/
{
  first_name: 'Michael',
  last_name: 'Messina',
  email: 'monia89@example.org',
}
```

Create a new record in `authors`. Return saved record.


```javascript
{
  id: 1,
  first_name: 'Michael',
  last_name: 'Messina',
  email: 'monia89@example.org',
  active: 1,
  added: '2011-10-09T08:34:11.000Z'
}
```

Supports [projection](#projection) as parameter.

```javascript
POST /api/authors/?fields=id,first_name
```

return only selected fields

### Update

```javascript
PATCH /api/authors/1
{
  last_name: 'Jefferson',
}
```

Update a record in `authors`. Return updated record


```javascript
{
  id: 1,
  first_name: 'Michael',
  last_name: 'Jefferson',
  email: 'monia89@example.org',
  active: 1,
  added: '2011-10-09T08:34:11.000Z'
}
```

Supports [projection](#projection) as parameter.

```javascript
PATCH /api/authors/1?fields=id,first_name
```

return only selected fields

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

### Projection

Return only fields that matches the parameter. If first character is `-` 
will return everything except fields in the parameter.

```javascript
/api/authors?fields=first_name,last_name // only return first_name and last_name
/api/authors?fields=-id,first_name // return everything except id and first_name
```

|          | Option Name | Default Value |
| -------- | ----------- | ------------- |
|Projection| fields      | *             |

## Validation and Serialization

Generated API support standard fastify validation and serialization via `.schemas` option.

If you are not confidable with fastify validation and serialization logics, see [documentation](https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/).

If you don't set `.schemas`, it's automatic generated See [later](#example-of-a-generated-validation-and-serializazion-schema) for an example of a generated schema. 

If you set `.schemas` as a function, it received the name of table and its generated schema. What it's returned, it will be used as schema for the table.

You can disable serialization and validation at all returning `undefined`

```javascript
schemas: () => {}
```

You can disable it for a single table 

```javascript
schemas: (tn, schema) => tn === 'authors' ? undefined : schema;
```

You can add or update default schema by change it inside schemas(tn,schema) and return the changed schema.

```javascript
fastify.register(knexAPI, { 
    knexConfig: {...},
    schemas: (tn, schema) => {
      if (tn === 'authors') {
        // for author creation, we set 'active' as required
        schema.create.schema.body.required = ['active'];
      }
      // remember to return schema
      return schema;
    },
    ...
```

where `schema.create` are validation and/or serialization schema for related restful http verbs where:

| validation name | URL | VERB |
|-----------------|-----|------|
| schema.list            | /   | GET  |
| schema.create          | /   | POST |
| schema.view            | /id | GET  |
| schema.update          | /id | PATCH|
| schema.delete          | /id | DELETE|

If you omit one of these, the [default](#example-of-a-generated-validation-and-serializazion-schema) is used.

If you set to `undefined` one, validation and serialization are disabled for this verb.

As you can see, taking a look to defaults, this plugin supports the URI [references](https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-01#section-8) `$ref` to other schemas.

You can add manually these references through `fastify.addSchema(schema)` or automatically if your schema has a `ref` attribute.

This attribute could be a single object or an array of objects if you wish to register more references at once.

If `.schemas` and `.schemaDirPath` are used together, the schemas defined in `.schemas` have precedence to there loaded in `.schemaDirPath`.

The generated validation and serialization is compatible with other plugins like [@fastify/swagger](https://github.com/fastify/fastify-swagger) and [@fastify/swagger-ui](https://github.com/fastify/fastify-swagger-ui) for automatically serving OpenAPI v2/v3 schemas

### Example of an auto-generated validation and serializazion schema

As an example, in MySQL, if you have an authors table like this

```sql
`id` int(11) NOT NULL AUTO_INCREMENT,
`first_name` varchar(50) NOT NULL,
`last_name` varchar(50) NOT NULL,
`email` varchar(100) NOT NULL,
`active` tinyint(1) NOT NULL DEFAULT 1,
`added` timestamp NOT NULL DEFAULT current_timestamp(),
```

this is the default generated schema for CRUD operations over this table

```javascript
{
  "view": {
    "schema": {
      "summary": "Get details of single authors",
      "tags": [
        "authors"
      ],
      "params": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier of authors"
          }
        }
      },
      "query": {
        "$ref": "fastify-knex-api/query#/properties/fields"
      },
      "response": {
        "200": {
          "type": "object",
          "$ref": "fastify-knex-api/tables/authors#"
        },
        "404": {
          "$ref": "fastify-knex-api/http-code#/properties/404"
        },
        "500": {
          "$ref": "fastify-knex-api/http-code#/properties/500"
        }
      }
    }
  },
  "list": {
    "schema": {
      "summary": "List authors",
      "tags": [
        "authors"
      ],
      "query": {
        "$ref": "fastify-knex-api/query#/properties/list"
      },
      "response": {
        "200": {
          "total": {
            "type": "integer",
            "example": "1"
          },
          "items": {
            "type": "array",
            "items": {
              "$ref": "fastify-knex-api/tables/authors#"
            }
          }
        },
        "500": {
          "$ref": "fastify-knex-api/http-code#/properties/500"
        }
      }
    }
  },
  "create": {
    "schema": {
      "summary": "Create a new authors",
      "tags": [
        "authors"
      ],
      "query": {
        "type": "object",
        "$ref": "fastify-knex-api/query#/properties/fields"
      },
      "response": {
        "200": {
          "type": "object",
          "$ref": "fastify-knex-api/tables/authors#"
        },
        "500": {
          "$ref": "fastify-knex-api/http-code#/properties/500"
        }
      },
      "body": {
        "$ref": "fastify-knex-api/tables/authors#"
      }
    }
  },
  "update": {
    "schema": {
      "summary": "Update existing authors",
      "tags": [
        "authors"
      ],
      "params": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier of authors"
          }
        }
      },
      "query": {
        "$ref": "fastify-knex-api/query#/properties/fields"
      },
      "response": {
        "200": {
          "type": "object",
          "$ref": "fastify-knex-api/tables/authors#"
        },
        "404": {
          "$ref": "fastify-knex-api/http-code#/properties/404"
        },
        "500": {
          "$ref": "fastify-knex-api/http-code#/properties/500"
        }
      },
      "body": {
        "$ref": "fastify-knex-api/tables/authors#"
      }
    }
  },
  "delete": {
    "schema": {
      "summary": "Delete existing authors",
      "tags": [
        "authors"
      ],
      "params": {
        "type": "object",
        "properties": {
          "id": {
            "type": "string",
            "description": "Unique identifier of authors"
          }
        }
      },
      "response": {
        "204": {
          "$ref": "fastify-knex-api/http-code#/properties/204"
        },
        "404": {
          "$ref": "fastify-knex-api/http-code#/properties/404"
        },
        "500": {
          "$ref": "fastify-knex-api/http-code#/properties/500"
        }
      }
    }
  }
}
```

where `fastify-knex-api/tables/authors#` is this auto-generated schema for table

```javascript
"$ref": "fastify-knex-api/tables/authors#"
"type": "object",
"properties": {
  "id": {
    "type": "integer"
  },
  "first_name": {
    "type": "string",
    "maxLength": 50
  },
  "last_name": {
    "type": "string",
    "maxLength": 50
  },
  "email": {
    "type": "string",
    "maxLength": 100
  },
  "active": {
    "type": "integer"
  },
  "added": {
    "type": "string",
    "format": "date-time"
  }
}
```
while 

* `fastify-knex-api/http-code#/properties/204`
* `fastify-knex-api/http-code#/properties/404`
* `fastify-knex-api/http-code#/properties/500` 

are schemas for delete response and errors and 

* `fastify-knex-api/query#/properties/list`
* `fastify-knex-api/query#/properties/field` 

are schemas for list method query string and for projection returning query string.

Definitions of there references can be found in [./src/DefaultSchemas.js](./src/DefaultSchemas.js).

## CommonJS

This module supports both ESM and CommonJS. If you are using CommonJS, you can import it like so:

```js
const knexAPI = require('knex-fastify-api');
```

## Bugs / Help / Feature Requests / Contributing

* For feature requests or help, please visit [the discussions page on GitHub](https://github.com/EmilianoBruni/fastify-knex-api/discussions).

* For bug reports, please file an issue on [the issues page on GitHub](https://github.com/EmilianoBruni/fastify-knex-api/issues).

* Contributions welcome! Please open a [pull request on GitHub](https://github.com/EmilianoBruni/fastify-knex-api/pulls) with your changes. You can run them by me first on [the discussions page](https://github.com/EmilianoBruni/fastify-knex-api/discussions) if you'd like. Please add tests for any changes.

## License

Licensed under [APACHE 2.0](./LICENSE)

## AUTHOR

Emiliano Bruni (<info@ebruni.it>)