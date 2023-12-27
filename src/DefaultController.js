class DefaultController {
    constructor(tableName, pk = undefined) {
        this.table = tableName;
        this.pk = pk;
    }

    async list(req, reply) {
        await this._fillPkIfUndefined(req);
        const total = await this._count(req.server.knex(this.table));
        const query = req.server.knex(this.table).select('*');
        this._applyFilters(query, req.query);
        const items = await query;
        return this._formatManyResult(total, items);
    }

    async view(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const data = await req.server
            .knex(this.table)
            .select('*')
            .where(this.pk, id);
        if (data.length === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return data[0];
    }

    async create(req, reply) {
        let data;
        try {
            data = await req.server.knex(this.table).insert(req.body);
        } catch (err) {
            reply.code(500).send({ message: 'Error', err: err });
        }
        return data[0];
    }

    async update(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        let data;
        try {
            data = await req.server
                .knex(this.table)
                .update(req.body)
                .where(this.pk, id);
        } catch (err) {
            reply.code(500).send({ message: 'Error', err: err });
        }
        if (data === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return { affected: data };
    }

    async delete(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const data = await req.server.knex(this.table).del().where(this.pk, id);
        if (data === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return { affected: data };
    }

    async _count(knex) {
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

    _applyFilters(query, filters) {
        /// pagination filters
        if (filters.limit) {
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
}

export default DefaultController;
