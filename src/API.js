// Class that handles all API calls

import DefaultController from './DefaultController.js';
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
                this.initialize();
            });
        } else {
            this.initialize();
            this.isInizialized = Promise.resolve();
        }
    }

    initialize() {
        // normalize tables
        this._tables = this._normalizeTables(this._tables);
        // register routes for each table
        for (const table of this._tables) {
            this._fastify.register(crudGen, {
                prefix: `${this._prefix}/${table.name}`,
                controller: new DefaultController(table.name, table.pk)
            });
        }
    }

    _normalizeTables(tables) {
        // return array of objects {name, pk}
        if (Array.isArray(tables)) {
            return tables.map(table => {
                if (typeof table === 'string') {
                    return { name: table, pk: undefined };
                }
                // if not exists, set pk to undefined
                if (!table.pk) table.pk = undefined;
                return table;
            });
        }
        return tables;
    }

    async _getDBTables() {
        return await this.schemaInspector.tables();
    }
}

export default API;
