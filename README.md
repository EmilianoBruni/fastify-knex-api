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

If you set `.schemas = []` as an empty array validation and serialization will be disabled.

If you set a null schema for a single table like this

```javascript
schemas: [
  { name: 'tableName' }
]
```
validation and serialization will be disabled only for table_name CRUD operations.

If you wish to add or update default schema for your API you should add an object to `.schemas` array or set a directory where automatically load schemas with `.schemaDirPath`:

```javascript
fastify.register(knexAPI, { 
    knexConfig: {...},
    schemas: [
    {
      name: 'tableName',
      view:   {},
	    list:   {},
      create: {},
	    update: {},
	    delete: {}
    },
    { name: 'anotherTableName',
      ...
    },
    ...
  ],
  schemaDirPath: '/path/to/your/schemas',

```

where `tableName` is the name of the table to which this schema will be applied and the others are validation and/or serialization schemas for related restful http verbs where:

| validation name | URL | VERB |
|-----------------|-----|------|
| list            | /   | GET  |
| create          | /   | POST |
| view            | /id | GET  |
| update          | /id | PATCH|
| delete          | /id | DELETE|

If you omit one of these, the [default](#example-of-a-generated-validation-and-serializazion-schema) is used.

If you set to empty one, validation and serialization are disabled.

If you set an not empty one, it will be merged with [defaults](#example-of-a-generated-validation-and-serializazion-schema), with, obviously, custom parameters with precedence.

As an example, it declares author first and last name as required. Do this for `POST` only

```javascript
const schemas = {
  name: 'authors',
  create: {
    body: {
      required: ['first_name', 'last_name']
    }
  }
};

fastify.register(knexAPI, { 
  knexConfig: {...},
  schemas: schemas
});

```

As you can see taking a look to defaults, this plugin supports the URI [references](https://datatracker.ietf.org/doc/html/draft-handrews-json-schema-01#section-8) `$ref` to other schemas.

You can add manually these references through `fastify.addSchema(schema)` or automatically if your schema has a `ref` attribute.

This attribute could be a single object or an array of objects if you wish to register more references at once.

If `.schemas` and `schemaDirPath` are used together, the schemas defined in `.schemas` have precedence to there loaded in `schemaDirPath`.

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

## License

Licensed under [APACHE 2.0](./LICENSE)

## AUTHOR

Emiliano Bruni (<info@ebruni.it>)