class DefaultController {
    constructor(tableName, pk = undefined) {
        this.table = tableName;
        this.pk = pk;
    }

    async list(req, reply) {
        await this._fillPkIfUndefined(req);
        const total = await this._count(req.server.knex(this.table));
        const items = await req.server.knex(this.table)
            .select('*')
        return this._formatManyResult(total, items);
    }

    async view(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const data = await req.server.knex(this.table)
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
            data = await req.server.knex(this.table)
                .insert(req.body);
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
            data = await req.server.knex(this.table)
                .update(req.body)
                .where(this.pk, id);
        } catch (err) {
            reply.code(500).send({ message: 'Error', err: err });
        };
        if (data === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return {affected: data};
    }

    async delete(req, reply) {
        const id = req.params.id;
        await this._fillPkIfUndefined(req);
        const data = await req.server.knex(this.table)
            .del()
            .where(this.pk, id);
        if (data === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return {affected: data};
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

}

export default DefaultController;
