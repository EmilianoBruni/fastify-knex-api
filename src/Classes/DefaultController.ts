import type {
    TColumnsInfo,
    TKAControllerFiltersPagination,
    TKAControllerFiltersProjection,
    TKAControllerFiltersSearch,
    TKAControllerFiltersSort,
    TKACrudRow,
    TKAListResult,
    TKAParamsId,
    TKAReply,
    TKARequest,
    TKARequestList
} from '../types.js';
import type { TKAController } from '../types.js';
import type { Knex } from 'knex';

class DefaultController implements TKAController {
    private _returningClient = ['pg', 'mssql', 'oracledb'];
    private table: string;
    private _columnsInfo: TColumnsInfo;
    private pk: string | undefined;
    // for MSSQL DB with triggers
    private includeTriggerModifications = false;

    constructor(
        tableName: string,
        columsInfo: TColumnsInfo,
        pk: string | undefined
    ) {
        this.table = tableName;
        this._columnsInfo = columsInfo;
        this.pk = pk;
    }

    async list(req: TKARequestList, reply: TKAReply): Promise<TKAListResult> {
        this.pk ??= await this._fillPkIfUndefined(req);
        const query = req.server.knex(this.table);
        let total = 0;
        if (req.query) {
            // apply where filters to the query
            this._applyFilters(query, req.query);
            // got total count for filters
            total = await this._count(query);
            // apply pagination, sorting and other staments to the query
            this._applyOtherStatments(query, req.query);
            // apply projection to the query
            await this._applyProjection(query, req.query);
        }
        try {
            const items = await query;
            return this._formatManyResult(total, items);
        } catch (e: unknown) {
            const err = e as string;
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err));
        }
    }

    async view(
        req: TKARequest & { params: TKAParamsId | unknown } & {
            query: TKAControllerFiltersProjection | unknown;
        },
        reply: TKAReply
    ): Promise<TKACrudRow> {
        const id = (req.params as TKAParamsId).id;
        this.pk ??= await this._fillPkIfUndefined(req);
        const query = req.server.knex(this.table).where(this.pk, id);
        // apply projection to the query
        await this._applyProjection(
            query,
            req.query as TKAControllerFiltersProjection
        );
        let data: Array<TKACrudRow>;
        try {
            data = await query;
        } catch (e: unknown) {
            const err = e as string;
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err));
        }
        if (data.length === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        return data[0] as TKACrudRow;
    }

    async create(
        req: TKARequest & { body: TKACrudRow | unknown } & {
            query: TKAControllerFiltersProjection | unknown;
        },
        reply: TKAReply
    ): Promise<TKACrudRow> {
        const knex = req.server.knex;
        const client = knex.client.config.client;
        this.pk ??= await this._fillPkIfUndefined(req);
        const query = knex<TKACrudRow>(this.table).insert(
            req.body as TKACrudRow
        );
        let data: Array<TKACrudRow | number | string>;
        if (this._returningClient.includes(client)) {
            const opt: {includeTriggerModifications?: boolean} = {};
            if (this.includeTriggerModifications) {
                // for MSSQL DB with triggers
                opt.includeTriggerModifications = true;
            }
            const returning = this._filterReturningFields(
                Object.keys(this._columnsInfo),
                req.query as TKAControllerFiltersProjection
            );
            query.returning(returning, opt);
        }
        try {
            data = await query;
        } catch (e: unknown) {
            const err = e as Object;
            // for MSSQL DB with triggers
            if (err.toString().includes('the DML statement cannot have any enabled triggers')) {
                // enabled includeTriggerModifications
                this.includeTriggerModifications = true;
                // try again
                return this.create(req, reply);
            }
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err.toString()));
        }
        // client is mysql or mysql2
        if (!this._returningClient.includes(client)) {
            // doesn't support returning but return last id in data[0]
            // query DB to get the last inserted record
            const query = knex<TKACrudRow>(this.table).where(this.pk, data[0]);
            // apply projection to the query
            await this._applyProjection(
                query,
                req.query as TKAControllerFiltersProjection
            );
            try {
                data = await query;
            } catch (e: unknown) {
                const err = e as Object;
                return reply
                    .code(500)
                    .send(DefaultController.HTTP_ERROR[500](err.toString()));
            }
        }
        return data[0] as TKACrudRow;
    }

    async update(
        req: TKARequest & { params: TKAParamsId | unknown } & {
            query: TKAControllerFiltersProjection | unknown;
        },
        reply: TKAReply
    ): Promise<TKACrudRow> {
        const id = (req.params as TKAParamsId).id;
        this.pk ??= await this._fillPkIfUndefined(req);
        const knex = req.server.knex;
        const client = knex.client.config.client;
        let data: Array<TKACrudRow> | number;
        const query = knex(this.table).where(this.pk, id).update(req.body);
        if (this._returningClient.includes(client)) {
            const returning = this._filterReturningFields(
                Object.keys(this._columnsInfo),
                req.query as TKAControllerFiltersProjection
            );
            const opt: {includeTriggerModifications?: boolean} = {};
            if (this.includeTriggerModifications) {
                opt.includeTriggerModifications = true;
            }
            query.returning(returning,opt);
        }
        try {
            data = await query;
        } catch (e: unknown) {
            const err = e as Object;
            // for MSSQL DB with triggers
            if (err.toString().includes('the DML statement cannot have any enabled triggers')) {
                // enabled includeTriggerModifications
                this.includeTriggerModifications = true;
                // try again
                return this.update(req, reply);
            }
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err.toString()));
        }
        if (data === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        let returning: Array<TKACrudRow>;
        if (!this._returningClient.includes(client)) {
            // doesn't support returning but return last id in data[0]
            // query DB to get the last inserted record
            const query = knex<TKACrudRow>(this.table).where(this.pk, id);
            // apply projection to the query
            await this._applyProjection(
                query,
                req.query as TKAControllerFiltersProjection
            );
            try {
                returning = await query;
            } catch (e: unknown) {
                const err = e as string;
                return reply
                    .code(500)
                    .send(DefaultController.HTTP_ERROR[500](err));
            }
        } else {
            // data is an array of TKACrudRow not a number
            // convert data to TKACrudRow
            returning = [data as unknown as TKACrudRow];
        }
        if (returning.length === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        return returning[0] as TKACrudRow;
    }

    async delete(
        req: TKARequest & { params: TKAParamsId | unknown },
        reply: TKAReply
    ): Promise<void> {
        const id = (req.params as TKAParamsId).id;
        const knex = req.server.knex;
        this.pk ??= await this._fillPkIfUndefined(req);
        try {
            const data = await knex(this.table).del().where(this.pk, id);
            if (data === 0)
                return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        } catch (e: unknown) {
            const err = e as string;
            return reply.code(500).send(DefaultController.HTTP_ERROR[500](err));
        }
        reply.code(204).send();
    }

    private async _count(knex: Knex.QueryBuilder): Promise<number> {
        knex = knex.clone();
        const count = await knex.count<Array<{ count: number }>>(
            `${this.pk} as count`
        );
        return count?.[0]?.count ?? 0;
    }

    private _formatManyResult(
        total: number,
        items: Array<Record<string, unknown>>
    ): TKAListResult {
        return { total: total, items: items };
    }

    private async _fillPkIfUndefined(req: TKARequest): Promise<string> {
        const pk = await req.server.knexAPI.schemaInspector.primary(this.table);
        if (pk === undefined || pk === null) {
            throw new Error(
                `Table ${this.table} doesn't have a primary key defined`
            );
        }
        return pk;
    }

    private _applyOtherStatments(
        query: Knex.QueryBuilder,
        filters: TKAControllerFiltersPagination & TKAControllerFiltersSort
    ) {
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
            let sortsNorm: string[] = [];
            let sorts: { column: string; order: string }[] = [];
            if (filters.sort) {
                sortsNorm = filters.sort.split(',');
                // normalize sorting as an array of {column, order}
                sorts = sortsNorm.map(sort => {
                    if (sort.startsWith('-')) {
                        return { column: sort.substring(1), order: 'desc' };
                    } else {
                        return { column: sort, order: 'asc' };
                    }
                });
                query.orderBy(sorts);
            }
        }
    }

    private async _applyProjection(
        query: Knex.QueryBuilder,
        filters: TKAControllerFiltersProjection
    ) {
        /// projection filters
        let filterFields = ['*'];
        if (filters.fields) {
            if (!filters.fields.startsWith('-')) {
                // include mode
                filterFields = filters.fields.split(',');
            } else {
                // first character is a minus, remove it and set the mode as exclude
                const excludedFields = filters.fields.substring(1).split(',');
                filterFields = Object.keys(await query.clone().columnInfo());

                // take filter.fields and remove from filterFields
                filterFields = filterFields.filter(
                    field => !excludedFields.includes(field)
                );
            }
        }
        query.select(filterFields);
    }

    private _filterReturningFields(
        allFields: string[],
        filters: TKAControllerFiltersProjection
    ): string[] {
        // if fields is not defined or = '*', return all fields
        if (!filters.fields || filters.fields === '*') return allFields;
        // if fields is defined, not start with -,
        // return only the fields in the list
        if (!filters.fields.startsWith('-')) {
            return filters.fields.split(',');
        } else {
            // first character is a minus, remove it and set the mode as exclude
            const excludedFields = filters.fields.substring(1).split(',');
            // take filter.fields and remove from allFields
            return allFields.filter(field => !excludedFields.includes(field));
        }
    }

    private _applyFilters(
        query: Knex.QueryBuilder,
        filters: TKAControllerFiltersSearch
    ) {
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
