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
        const query = this._knex(tableName);

        let columnInfos;
        return this._knex(tableName)
            .columnInfo()
            .then(columns => {
                columnInfos = columns;
                return columns;
            })
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
                    const [type, format] = this._convTypeDBToAjvSchema(
                        columnInfo.type
                    );
                    p[k].type = type;
                    if (format !== undefined && format !== null) {
                        p[k].format = format;
                    }
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

    _convTypeDBToAjvSchema(type) {
        // convert Knex column type to Ajv schema type
        // See: https://ajv.js.org/json-type-definition.html

        switch (type) {
            case 'integer':
            case 'bigInteger':
            case 'int':
            case 'tinyInteger':
            case 'smallInteger':
            case 'tinyint':
            case 'mediumInteger':
            case 'unsignedInteger':
            case 'unsignedBigInteger':
            case 'unsignedSmallInteger':
            case 'unsignedMediumInteger':
                return ['integer', undefined];
            case 'float':
            case 'decimal':
            case 'double':
                return ['number', undefined];
            case 'binary':
            case 'json':
            case 'jsonb':
            case 'uuid':
            case 'enu':
                return ['object', undefined];
            case 'boolean':
                return [type, undefined];
            case 'string':
            case 'text':
            case 'mediumText':
            case 'longText':
            case 'enum':
            case 'char':
            case 'varchar':
            case 'text':
                return ['string', undefined];
            case 'dateTime':
            case 'dateTimeTz':
            case 'timestamp':
            case 'timestampTz':
                return ['string', 'date-time'];
            default:
                throw new Error(`Unknown column type ${type}`);
        }
    }
}

export default API;
