// Class that handles all API calls

import DefaultController from './DefaultController.js';
import crudGen from 'fastify-crud-generator';
import { SchemaInspector } from 'knex-schema-inspector';

class API {
    constructor(params = {}) {
        this._fastify = params.fastify;
        this._knex = params.knex;
        this._tables = params.tables;

        this.schemaInspector = SchemaInspector(this._knex);

        if (!this._tables) {
            this.isInizialized = this._getDBTables().then(tables => {
                console.log(tables);
                this._tables = tables;
                this.initialize();
            });
        } else {
            this.initialize();
            this.isInizialized = Promise.resolve();
        }
    }

    initialize() {
        // register routes for each table
        for (const table of this._tables) {
            this._fastify.register(crudGen, {
                prefix: `/api/${table}`,
                controller: new DefaultController(table)
            });
        }
    }

    async _getDBTables() {
        return await this.schemaInspector.tables();
    }
}

export default API;
