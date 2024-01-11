// Class that handles all API calls

import { existsSync, statSync } from 'fs';
import path from 'path';
import crudGen from './crud.js';
import DefaultController from './DefaultController.js';
import {
    defaultSchemas,
    defaultHttpCode,
    defaultQueries
} from './DefaultSchemas.js';
import { SchemaInspector } from 'knex-schema-inspector';

class API {
    constructor(params = {}) {
        this._fastify = params.fastify;
        this._knex = params.knex;
        this._tables = params.tables;
        this._schemas = params.schemas;
        this._schemaDirPath = params.schemaDirPath;
        this._checkAuth = params.checkAuth;

        this._prefix = params.prefix || '/api';

        this.schemaInspector = SchemaInspector(this._knex);

        if (!this._tables) {
            this.isInizialized = this._getDBTables().then(tables => {
                this._tables = tables;
                return this.initialize();
            });
        } else {
            this.isInizialized = this.initialize();
        }
    }

    initialize() {
        // normalize tables
        this._tables = this._normalizeTables(this._tables);
        // register default http code
        this._fastify.addSchema(defaultHttpCode);
        this._fastify.addSchema(defaultQueries);
        // register routes for each table
        return Promise.all(
            this._tables.map(table =>
                this._buildOptReg(table).then(optReg => {
                    // register routes
                    return this._fastify.register(crudGen, optReg);
                })
            )
        );
    }

    /**
     * Builds the options to register crud routes for a given table.
     * @param {Object} table - The table object.
     * @returns {Object} - The options for registration routes.
     */
    async _buildOptReg(table) {
        const columnsInfo = await this._knex(table.name).columnInfo();
        const schema = await this._buildSchema(table, columnsInfo);
        return {
            prefix: `${this._prefix}/${table.name}`,
            controller: new DefaultController(
                table.name,
                columnsInfo,
                table.pk
            ),
            ...schema,
            checkAuth: this._checkAuth
        };
    }

    async _buildSchema(table, columnsInfo) {
        const schemaTableFields = this._getTableSchema(columnsInfo);
        // register table fields schema in fastify
        const ref_id = `fastify-knex-api/tables/${table.name}`;
        this._fastify.addSchema({
            $id: ref_id,
            type: 'object',
            properties: schemaTableFields
        });
        // get default schemas valid for every table
        let schema = defaultSchemas(table.name);
        // add response to schemas
        this._appendResponseToSchemas(schema, ref_id);
        // load and apply custom schemas in schemaDirPath
        schema = await this._loadSchemaDirPath(table, schema);
        // if exists custom schemas, apply it
        if (this._schemas && typeof this._schemas === 'function') {
            schema = this._schemas(table.name, schema);
        }
        return schema;
    }

    _getTableSchema(columnsInfo) {
        return this._buildPropsFromColumnsInfo(columnsInfo);
    }

    _buildPropsFromColumnsInfo(columnsInfo) {
        const props = {};
        for (const k of Object.keys(columnsInfo)) {
            const columnInfo = columnsInfo[k];
            props[k] = {};
            this._addTypeFormat(k, columnInfo, props[k]);
            if (
                columnInfo.maxLength !== undefined &&
                columnInfo.maxLength !== null
            ) {
                if (props[k].type === 'string')
                    props[k].maxLength = columnInfo.maxLength;
            }
            if (
                columnInfo.description !== undefined &&
                columnInfo.description !== null
            ) {
                props[k].description = columnInfo.description;
            }
            if (
                columnInfo.example !== undefined &&
                columnInfo.example !== null
            ) {
                props[k].example = columnInfo.example;
            }
            if (columnInfo.primary) {
                props[k].description += ' (primary key)';
            }
            if (columnInfo.unique) {
                props[k].description += ' (unique)';
            }
        }
        return props;
    }

    _appendResponseToSchemas(schemas, ref_id) {
        // view, create, update return ref_id for response=200
        ['view', 'create', 'update'].forEach(k => {
            const schema = schemas[k].schema;
            schema.response = schema.response || {};
            schema.response['200'] = schema.response['200'] || {
                type: 'object'
            };
            schema.response['200'].$ref = `${ref_id}#`;
        });

        // list return array of ref_id for response=200
        schemas.list.schema.response = {
            200: {
                total: { type: 'integer', example: '1' },
                items: { type: 'array', items: { $ref: `${ref_id}#` } }
            }
        };

        // for create and update, ref_id also for body post
        ['create', 'update'].forEach(k => {
            const schema = schemas[k].schema;
            schema.body = { type: 'object', $ref: `${ref_id}#` };
        });

        /// add default httpcode

        // delete return 204 if success
        schemas.delete.schema.response = {
            204: { $ref: 'fastify-knex-api/http-code#/properties/204' }
        };

        ['view', 'list', 'create', 'update', 'delete'].forEach(k => {
            const response = schemas[k].schema.response;
            response['500'] = {
                $ref: 'fastify-knex-api/http-code#/properties/500'
            };
        });
        ['view', 'update', 'delete'].forEach(k => {
            const response = schemas[k].schema.response;
            response['404'] = {
                $ref: 'fastify-knex-api/http-code#/properties/404'
            };
        });

        return schemas;
    }

    _addTypeFormat(name, columnInfo, prop) {
        // add type/format and other properties to the schema
        // See: https://ajv.js.org/json-type-definition.html
        switch (columnInfo.type.toLowerCase()) {
            case 'integer':
            case 'biginteger':
            case 'bigint':
            case 'int':
            case 'bit':
            case 'tinyinteger':
            case 'smallinteger':
            case 'smallint':
            case 'tinyint':
            case 'mediuminteger':
            case 'unsignedinteger':
            case 'unsignedbiginteger':
            case 'unsignedsmallinteger':
            case 'unsignedmediuminteger':
            case 'year':
                prop.type = 'integer';
                break;
            case 'float':
            case 'decimal':
            case 'double':
                prop.type = 'number';
                break;
            case 'binary':
            case 'jsonb':
                prop.type = 'string';
                prop.format = 'binary';
                break;
            case 'uuid':
                prop.type = 'string';
                prop.format = 'uuid';
                break;
            case 'boolean':
                prop.type = 'boolean';
                break;
            case 'string':
            case 'text':
            case 'mediumtext':
            case 'longtext':
            case 'enum':
            case 'char':
            case 'varchar':
            case 'tinytext':
            case 'json':
                prop.type = 'string';
                break;
            case 'datetime':
            case 'datetimetz':
            case 'timestamp':
            case 'timestamptz':
                prop.type = 'string';
                prop.format = 'date-time';
                break;
            case 'date':
                prop.type = 'string';
                prop.format = 'date';
                break;
            case 'time':
                prop.type = 'string';
                prop.format = 'time';
                break;
            case 'set':
                prop.type = 'array';
                prop.items = { type: 'string' };
                break;
            case 'inet4':
                prop.type = 'string';
                prop.format = 'ipv4';
                break;
            case 'inet6':
                prop.type = 'string';
                prop.format = 'ipv6';
                break;
            default:
                throw new Error(
                    `Unknown column type ${columnInfo.type} for field ${name}: ` +
                        JSON.stringify(columnInfo)
                );
        }
    }

    async _loadSchemaDirPath(table, schema) {
        if (!this._schemaDirPath || typeof this._schemaDirPath !== 'string')
            return schema;
        const schemaPath = path.join(
            this._schemaDirPath,
            `${table.name}.schema.js`
        );
        if (!existsSync(schemaPath)) return schema;
        if (!statSync(schemaPath).isFile()) return schema;
        try {
            const customSchema = (await import(schemaPath)).default;
            if (typeof customSchema === 'function') {
                schema = customSchema(schema);
            }
        } catch (e) {
            throw new Error(`Error loading schema ${schemaPath}: ${e.message}`);
        }
        return schema;
    }

    _normalizeTables(tables) {
        // return array of objects {name, pk}
        if (Array.isArray(tables)) {
            return tables.map(table => {
                if (typeof table === 'string') {
                    return { name: table, pk: undefined };
                }
                // throw error if not exists name
                if (!table.name) {
                    throw new Error('Table name not specified');
                }
                // if not exists, set pk to undefined
                if (!table.pk) table.pk = undefined;
                return table;
            });
        }
    }

    async _getDBTables() {
        return await this.schemaInspector.tables();
    }
}

export default API;
