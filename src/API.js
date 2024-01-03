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
                this._generateSchemas(table.name).then(schemas => {
                    const optReg = {
                        prefix: `${this._prefix}/${table.name}`,
                        controller: new DefaultController(table.name, table.pk),
                        ...schemas
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

    _generateSchemas(tableName) {
        return this._knex(tableName)
            .columnInfo()
            .then(columnInfos => {
                const retColumnInfo = defaultSchemas(tableName);
                const retSchema = retColumnInfo.view.schema;
                retSchema.response = retSchema.response || {};
                retSchema.response['200'] = retSchema.response['200'] || {
                    type: 'object'
                };
                retSchema.response['200'].properties =
                    retSchema.response['200'].properties || {};
                const p = retSchema.response['200'].properties;
                for (const k of Object.keys(columnInfos)) {
                    const columnInfo = columnInfos[k];
                    p[k] = {};
                    this._addTypeFormat(k, columnInfo, p[k]);
                    if (
                        columnInfo.maxLength !== undefined &&
                        columnInfo.maxLength !== null
                    ) {
                        p[k].maxLength = columnInfo.maxLength;
                    }
                    if (
                        columnInfo.description !== undefined &&
                        columnInfo.description !== null
                    ) {
                        p[k].description = columnInfo.description;
                    }
                    if (
                        columnInfo.example !== undefined &&
                        columnInfo.example !== null
                    ) {
                        p[k].example = columnInfo.example;
                    }
                    if (columnInfo.primary) {
                        p[k].description += ' (primary key)';
                    }
                    if (columnInfo.unique) {
                        p[k].description += ' (unique)';
                    }
                }
                return retColumnInfo;
            });
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
}

export default API;
