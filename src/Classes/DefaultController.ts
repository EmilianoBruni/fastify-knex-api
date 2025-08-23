import type {
    TColumnsInfo,
    TKAControllerFiltersPagination,
    TKAControllerFiltersProjection,
    TKAControllerFiltersSearch,
    TKAControllerFiltersSort,
    TKACrudRow,
    TKAListResult,
    TKAParamsIds,
    TKAReply,
    TKARequest,
    TKARequestList,
    TKAInternalPks
} from '../types.js';
import type { TKAController } from '../types.js';
import type { Knex } from 'knex';

class DefaultController implements TKAController {
    private _returningClient = ['pg', 'mssql', 'oracledb'];
    private table: string;
    private _columnsInfo: TColumnsInfo;
    private pk: TKAInternalPks;
    // for MSSQL DB with triggers
    private includeTriggerModifications = false;

    constructor(
        tableName: string,
        columsInfo: TColumnsInfo,
        pk: TKAInternalPks
    ) {
        this.table = tableName;
        this._columnsInfo = columsInfo;
        this.pk = pk;
    }

    async list(req: TKARequestList, reply: TKAReply): Promise<TKAListResult> {
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
        req: TKARequest & { params: TKAParamsIds | unknown } & {
            query: TKAControllerFiltersProjection | unknown;
        },
        reply: TKAReply
    ): Promise<TKACrudRow> {
        const params = req.params as TKAParamsIds;
        const query = req.server.knex(this.table);

        this.pk.map(pkName => query.where(pkName, params[pkName]));
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
        const params = req.body as TKACrudRow;
        const query = knex<TKACrudRow>(this.table).insert(params);
        let data: Array<TKACrudRow | number | string>;
        if (this._returningClient.includes(client)) {
            const opt: { includeTriggerModifications?: boolean } = {};
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
            const err = e as object;
            // for MSSQL DB with triggers
            if (
                err
                    .toString()
                    .includes(
                        'the DML statement cannot have any enabled triggers'
                    )
            ) {
                // enabled includeTriggerModifications
                this.includeTriggerModifications = true;
                // try again
                return this.create(req, reply);
            }
            return reply
                .code(500)
                .send(DefaultController.HTTP_ERROR[500](err.toString()));
        }
        // client is mysql or mysql2
        if (!this._returningClient.includes(client)) {
            // doesn't support returning but return last id in data[0]
            // query DB to get the last inserted record
            const query = knex<TKACrudRow>(this.table);
            this.pk.map((value, idx) =>
                query.where(value, params[value] || data[idx])
            );
            // apply projection to the query
            await this._applyProjection(
                query,
                req.query as TKAControllerFiltersProjection
            );
            try {
                data = await query;
            } catch (e: unknown) {
                const err = e as object;
                return reply
                    .code(500)
                    .send(DefaultController.HTTP_ERROR[500](err.toString()));
            }
        }
        reply.code(201);
        return data[0] as TKACrudRow;
    }

    async update(
        req: TKARequest & { params: TKAParamsIds | unknown } & {
            query: TKAControllerFiltersProjection | unknown;
        },
        reply: TKAReply
    ): Promise<TKACrudRow> {
        const knex = req.server.knex;
        const client = knex.client.config.client;
        let data: Array<TKACrudRow> | number;
        const params = req.params as TKAParamsIds;
        const query = req.server.knex(this.table);

        this.pk.map(pkName => query.where(pkName, params[pkName]));
        query.update(req.body);

        if (this._returningClient.includes(client)) {
            const returning = this._filterReturningFields(
                Object.keys(this._columnsInfo),
                req.query as TKAControllerFiltersProjection
            );
            const opt: { includeTriggerModifications?: boolean } = {};
            if (this.includeTriggerModifications) {
                opt.includeTriggerModifications = true;
            }
            query.returning(returning, opt);
        }
        try {
            data = await query;
        } catch (e: unknown) {
            const err = e as object;
            // for MSSQL DB with triggers
            if (
                err
                    .toString()
                    .includes(
                        'the DML statement cannot have any enabled triggers'
                    )
            ) {
                // enabled includeTriggerModifications
                this.includeTriggerModifications = true;
                // try again
                return this.update(req, reply);
            }
            return reply
                .code(500)
                .send(DefaultController.HTTP_ERROR[500](err.toString()));
        }
        if (typeof data === 'number' && data === 0) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        let returning: Array<TKACrudRow>;
        if (!this._returningClient.includes(client)) {
            // doesn't support returning. query DB to get the updated record by id
            const query = knex<TKACrudRow>(this.table);
            this.pk.map(pkName => query.where(pkName, params[pkName]));
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
            returning = data as unknown as Array<TKACrudRow>;
        }
        if (returning.length === 0 || !returning[0]) {
            return reply.code(404).send(DefaultController.HTTP_ERROR[404]);
        }
        return returning[0];
    }

    async delete(
        req: TKARequest & { params: TKAParamsIds | unknown },
        reply: TKAReply
    ): Promise<void> {
        const params = req.params as TKAParamsIds;
        const query = req.server.knex(this.table).del();

        this.pk.map(pkName => query.where(pkName, params[pkName]));
        try {
            const data = await query;
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
            `${this.pk[0]} as count`
        );
        return count?.[0]?.count ?? 0;
    }

    private _formatManyResult(
        total: number,
        items: Array<Record<string, unknown>>
    ): TKAListResult {
        return { total: total, items: items };
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
