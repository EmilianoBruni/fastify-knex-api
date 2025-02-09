// Class that handles all API calls

import type {
    IKAApiOptions,
    TTablesDefinition,
    TTableDefinition,
    TTablesDefinitionNormalized,
    TKAAPISchemas,
    TKAVerbs,
    JSONSchemaProps,
    TColumnsInfo,
    TKACrudOptions
} from '../types.js';
import type { Knex } from 'knex';
import type { SchemaInspector as ISchemaInspector } from 'knex-schema-inspector/dist/types/schema-inspector.js';
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
    private _fastify: IKAApiOptions['fastify'];
    private _knex: IKAApiOptions['knex'];
    private _tables: TTablesDefinitionNormalized = [];
    private _schemas: IKAApiOptions['schemas'];
    private _columnSchema: IKAApiOptions['columnSchema'];
    private _schemaDirPath: IKAApiOptions['schemaDirPath'];
    private _checkAuth: IKAApiOptions['checkAuth'];
    private _prefix: IKAApiOptions['prefix'];
    private _verbs: IKAApiOptions['verbs'];

    public schemaInspector: ISchemaInspector;
    public isInizialized: Promise<boolean>;

    constructor(params: IKAApiOptions) {
        this._fastify = params.fastify;
        this._knex = params.knex;
        this._schemas = params.schemas;
        this._columnSchema = params.columnSchema;
        this._schemaDirPath = params.schemaDirPath;
        this._checkAuth = params.checkAuth;
        this._verbs = params.verbs;

        this._prefix = params.prefix || '/api';

        this.schemaInspector = SchemaInspector(this._knex);

        if (!params.tables) {
            this.isInizialized = this._getDBTables().then(tables => {
                return this.initialize(tables);
            });
        } else {
            this.isInizialized = this.initialize(params.tables);
        }
    }

    async initialize(tables: TTablesDefinition): Promise<boolean> {
        // normalize tables
        this._tables = this._normalizeTables(tables);
        // register default http code
        this._fastify.addSchema(defaultHttpCode);
        this._fastify.addSchema(defaultQueries);
        // register routes for each table
        await Promise.all(
            this._tables.map(table =>
                this._buildOptReg(table).then(optReg => {
                    // register routes
                    return this._fastify.register(crudGen, optReg);
                })
            )
        );
        return true;
    }

    /**
     * Builds the options to register crud routes for a given table.
     * @param {Object} table - The table object.
     * @returns {Object} - The options for registration routes.
     */
    async _buildOptReg(table: TTableDefinition): Promise<TKACrudOptions> {
        const columnsInfo = await this._knex(table.name).columnInfo();
        const schema = await this._buildSchema(table, columnsInfo);
        const verbs = await this._getVerbs(table.name);
        return {
            prefix: `${this._prefix}/${table.name}`,
            controller: new DefaultController(
                table.name,
                columnsInfo,
                table.pk
            ),
            verbs,
            ...schema,
            checkAuth: this._checkAuth
        };
    }

    async _buildSchema(
        table: TTableDefinition,
        columnsInfo: TColumnsInfo
    ): Promise<TKAAPISchemas> {
        const schemaTableFields = this._getTableSchema(table.name, columnsInfo);
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

    _getTableSchema(tableName: string, columnsInfo: TColumnsInfo) {
        return this._buildPropsFromColumnsInfo(tableName, columnsInfo);
    }

    _buildPropsFromColumnsInfo(tableName: string, columnsInfo: TColumnsInfo) {
        const props: Record<string, JSONSchemaProps> = {};
        for (const k of Object.keys(columnsInfo)) {
            const columnInfo = columnsInfo[k];
            if (!columnInfo) continue;
            const prop = this._initProps(k, columnInfo);
            if (
                columnInfo.maxLength !== undefined &&
                columnInfo.maxLength !== null
            ) {
                if (prop.type === 'string')
                    prop.maxLength = columnInfo.maxLength;
            }
            // TODO: columnInfo seems not have description, example, primary, unique
            // if (
            //     columnInfo.description !== undefined &&
            //     columnInfo.description !== null
            // ) {
            //     prop.description = columnInfo.description;
            // }
            // if (
            //     columnInfo.example !== undefined &&
            //     columnInfo.example !== null
            // ) {
            //     prop.example = columnInfo.example;
            // }
            // if (columnInfo.primary) {
            //     prop.description += ' (primary key)';
            // }
            // if (columnInfo.unique) {
            //     prop.description += ' (unique)';
            // }
            if (this._columnSchema) {
                const customProp = this._columnSchema(tableName, k, prop);
                // if customProp is null, skip this field
                if (customProp) {
                    props[k] = customProp;
                }
                continue;
            }
            props[k] = prop;
        }
        return props;
    }

    _appendResponseToSchemas(schemas: TKAAPISchemas, ref_id: string) {
        // view, create, update return ref_id for response=200
        const arr1: TKAVerbs[] = ['view', 'create', 'update'];
        arr1.forEach(k => {
            const schema = schemas[k].schema;
            schema.response ??= {};
            schema.response['200'] = schema.response['200'] || {
                type: 'object'
            };
            schema.response['200'].$ref = `${ref_id}#`;
        });

        // list return array of ref_id for response=200
        schemas.list.schema.response ??= {};
        schemas.list.schema.response[200] = {
            type: 'object',
            properties: {
                total: { type: 'integer', example: '1' },
                items: { type: 'array', items: { $ref: `${ref_id}#` } }
            }
        };

        // for create and update, ref_id also for body post
        const arr2: TKAVerbs[] = ['create', 'update'];
        arr2.forEach(k => {
            const schema = schemas[k].schema;
            schema.body = { type: 'object', $ref: `${ref_id}#` };
        });

        /// add default httpcode

        // delete return 204 if success
        schemas.delete.schema.response ??= {};
        schemas.delete.schema.response[204] = {
            $ref: 'fastify-knex-api/http-code#/properties/204'
        };

        const arr3: TKAVerbs[] = ['view', 'list', 'create', 'update', 'delete'];
        arr3.forEach(k => {
            const schema = schemas[k].schema;
            schema.response ??= {};
            schema.response[500] = {
                $ref: 'fastify-knex-api/http-code#/properties/500'
            };
        });
        const arr4: TKAVerbs[] = ['view', 'update', 'delete'];
        arr4.forEach(k => {
            const response = (schemas[k].schema.response ??= {});
            response['404'] = {
                $ref: 'fastify-knex-api/http-code#/properties/404'
            };
        });

        return schemas;
    }

    _initProps(name: string, columnInfo: Knex.ColumnInfo): JSONSchemaProps {
        // add type/format and other properties to the schema
        // See: https://ajv.js.org/json-type-definition.html
        const prop: JSONSchemaProps = { type: 'null' };
        switch (columnInfo.type.toLowerCase()) {
            case 'integer':
            case 'biginteger':
            case 'bigint':
            case 'int':
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
            case 'bit':
                prop.type = 'string';
                prop.format = 'binary';
                break;
            case 'uniqueidentifier':
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
            case 'set':
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
        return prop;
    }

    async _loadSchemaDirPath(
        table: TTableDefinition,
        schema: TKAAPISchemas
    ): Promise<TKAAPISchemas> {
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
        } catch (e: { message: string }) {
            throw new Error(`Error loading schema ${schemaPath}: ${e.message}`);
        }
        return schema;
    }

    _normalizeTables(
        tables: IKAApiOptions['tables']
    ): TTablesDefinitionNormalized {
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
        } else {
            throw new Error(
                'tables must be an array of string or an array of object'
            );
        }
    }

    async _getVerbs(tableName: string): Promise<TKAVerbs[] | undefined> {
        let verbs: TKAVerbs[] | undefined = undefined;
        // if exists verbs in tables manual definition, use it
        const table = this._tables.find(t => t.name === tableName);
        if (table && table.verbs) verbs = table.verbs;

        // if exists verbs in options, use it
        if (this._verbs && typeof this._verbs === 'function') {
            verbs = this._verbs(tableName, verbs);
        }
        return verbs;
    }

    async _getDBTables() {
        return await this.schemaInspector.tables();
    }
}

export default API;
