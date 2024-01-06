class DefaultController {
    constructor(tableName, columsInfo, pk = undefined) {
        this.table = tableName;
        this._columnsInfo = columsInfo;
        this._returningClient = ['pg', 'mssql', 'oracledb'];
        this.pk = pk;
    }

    async list(req, reply) {
        await this._fillPkIfUndefined(req);
        const query = req.server.knex(this.table);
        // apply where filters to the query
        this._applyFilters(query, req.query);
        // got total count for filters
        const total = await this._count(query);
        // apply pagination, sorting and other staments to the query
        this._applyOtherStatments(query, req.query);
        // apply projection to the query
        await this._applyProjection(query, req.query);
        // got items for filters
        const items = await query;
        return this._formatManyResult(total, items);
    }

    async view(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const query = req.server.knex(this.table).where(this.pk, id);
        // apply projection to the query
        await this._applyProjection(query, req.query);
        const data = await query;
        if (data.length === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        return data[0];
    }

    async create(req, reply) {
        const knex = req.server.knex;
        const client = knex.client.config.client;
        await this._fillPkIfUndefined(req);
        let data;
        try {
            const query = knex(this.table).insert(req.body);
            if (this._returningClient.includes(client)) {
                const returning = this._filterReturningFields(
                    Object.keys(this._columnsInfo),
                    req.query
                );
                query.returning(returning);
            }
            data = await query;
        } catch (err) {
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err));
        }
        // client is mysql or mysql2
        if (!this._returningClient.includes(client)) {
            // doesn't support returning but return last id in data[0]
            // query DB to get the last inserted record
            const query = knex(this.table).where(this.pk, data[0]);
            // apply projection to the query
            await this._applyProjection(query, req.query);
            data = await query;
        }
        return data[0];
    }

    async update(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const knex = req.server.knex;
        const client = knex.client.config.client;
        let data;
        try {
            const query = knex(this.table).where(this.pk, id).update(req.body);
            if (this._returningClient.includes(client)) {
                const returning = this._filterReturningFields(
                    Object.keys(this._columnsInfo),
                    req.query
                );
                query.returning(returning);
            }
            data = await query;
        } catch (err) {
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err));
        }
        if (data === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        if (!this._returningClient.includes(client)) {
            // doesn't support returning but return last id in data[0]
            // query DB to get the last inserted record
            const query = knex(this.table).where(this.pk, id);
            // apply projection to the query
            await this._applyProjection(query, req.query);
            data = await query;
        }
        return data[0];
    }

    async delete(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const data = await req.server.knex(this.table).del().where(this.pk, id);
        if (data === 0)
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        reply.code(204).send();
    }

    async _count(knex) {
        knex = knex.clone();
        const count = await knex.count(`${this.pk} as count`);
        return count[0].count;
    }

    _formatManyResult(total, items) {
        return { total: total, items: items };
    }

    async _fillPkIfUndefined(req) {
        if (this.pk === undefined) {
            this.pk = await req.server.knexAPI.schemaInspector.primary(
                this.table
            );
        }
    }

    _applyOtherStatments(query, filters) {
        /// pagination filters
        if (filters.limit != -1) {
            if (filters.limit === undefined) filters.limit = 50;
            query.limit(filters.limit);
        }
        // skip is an alias for offset
        if (filters.skip) filters.offset = filters.skip;

        if (filters.offset) {
            query.offset(filters.offset);
        }
        // window is an alias for page
        if (filters.window) filters.page = filters.window;
        // offset = (page - 1) * limit
        if (filters.page) {
            query.offset((filters.page - 1) * filters.limit);
        }

        /// sorting filters
        if (filters.sort) {
            // normalize sorting as an array of {column, order}
            if (typeof filters.sort === 'string') {
                filters.sort = filters.sort.split(',');
            }
            // normalize sorting as an array of {column, order}
            if (Array.isArray(filters.sort)) {
                filters.sort = filters.sort.map(sort => {
                    if (sort.startsWith('-')) {
                        return { column: sort.substr(1), order: 'desc' };
                    } else {
                        return { column: sort, order: 'asc' };
                    }
                });
            }
            query.orderBy(filters.sort);
        }
    }

    async _applyProjection(query, filters) {
        /// projection filters
        let filterFields = '*';
        if (filters.fields) {
            if (!filters.fields.startsWith('-')) {
                // include mode
                filterFields = filters.fields.split(',');
            } else {
                // first character is a minus, remove it and set the mode as exclude
                filters.fields = filters.fields.substr(1).split(',');
                filterFields = Object.keys(await query.clone().columnInfo());

                // take filter.fields and remove from filterFields
                filterFields = filterFields.filter(
                    field => !filters.fields.includes(field)
                );
            }
        }
        query.select(filterFields);
    }

    _filterReturningFields(allFields, filters) {
        // if fields is not defined or = '*', return all fields
        if (!filters.fields || filters.fields === '*') return allFields;
        // if fields is defined, not start with -,
        // return only the fields in the list
        if (!filters.fields.startsWith('-')) {
            return filters.fields.split(',');
        } else {
            // first character is a minus, remove it and set the mode as exclude
            filters.fields = filters.fields.substr(1).split(',');
            // take filter.fields and remove from allFields
            return allFields.filter(field => !filters.fields.includes(field));
        }
    }

    _applyFilters(query, filters) {
        /// filtering filters
        if (filters.filter) {
            query.whereRaw(filters.filter);
        }
    }

    static HTTP_ERROR = {
        404: {
            statusCode: 404,
            error: 'Not Found',
            message: 'Object Not Found'
        },
        500: (message = 'Something went wrong') => {
            return {
                statusCode: 500,
                error: 'Internal Server Error',
                message: message
            };
        }
    };
}

export default DefaultController;
