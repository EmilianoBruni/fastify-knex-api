// Class that handles all API calls

import DefaultController from './DefaultController.js';
import { defaultSchemas } from './DefaultSchemas.js';
import crudGen from 'fastify-crud-generator';
import { SchemaInspector } from 'knex-schema-inspector';

class API {
    constructor(params = {}) {
        this._fastify = params.fastify;
        this._knex = params.knex;
        this._tables = params.tables;

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
        // register routes for each table
        return Promise.all(
            this._tables.map(table =>
                this._knex(table.name)
                    .columnInfo()
                    .then(columnsInfo => {
                        const schema = this._getTableSchema(columnsInfo);
                        // register schema in fastify
                        const ref_id = `fastify-knex-api-${table.name}`;
                        this._fastify.addSchema({
                            $id: ref_id,
                            type: 'object',
                            properties: schema
                        });
                        // get default schemas
                        const defSchemas = defaultSchemas(table.name);
                        // add response to schemas
                        this._appendResponseToSchemas(defSchemas, ref_id);
                        // register routes
                        const optReg = {
                            prefix: `${this._prefix}/${table.name}`,
                            controller: new DefaultController(
                                table.name,
                                columnsInfo,
                                table.pk
                            ),
                            ...defSchemas
                        };
                        return this._fastify.register(crudGen, optReg);
                    })
            )
        );
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

    async _getDBTables() {
        return await this.schemaInspector.tables();
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

    _getTableSchema(columnsInfo) {
        return this._buildPropsFromColumnsInfo(columnsInfo);
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
        const schema = schemas.list.schema;
        schema.response = schema.response || {};
        schema.response['200'] = schema.response['200'] || {
            total: { type: 'integer', example: '1' },
            items: { type: 'array', items: { $ref: `${ref_id}#` } }
        };

        // for create and update, ref_id also for body post
        ['create', 'update'].forEach(k => {
            const schema = schemas[k].schema;
            schema.body = { $ref: `${ref_id}#` };
        });

        return schemas;
    }
}

export default API;
