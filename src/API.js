// Class that handles all API calls

import { SchemaInspector } from 'knex-schema-inspector';

class API {
    constructor(params = {}) {
        this._knex = params.knex;
        this._tables = params.tables;

        if (!this._tables) {
            this.isInizialized = this._getDBTables().then(tables => {
                console.log(tables);
                this._tables = tables;
                this.initialize();
            });
        } else {
            this.isInizialized = Promise.resolve();
            this.initialize();
        }
    }

    initialize() {
        console.log('Initializing API');
    }

    async _getDBTables() {
        console.log('Getting tables');
        return await SchemaInspector(this._knex).tables();
    }
}

export default API;
