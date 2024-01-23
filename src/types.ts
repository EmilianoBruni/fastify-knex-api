import { FastifyInstance , FastifyPluginOptions} from 'fastify';
import API from './Classes/API.js';
import knex from 'knex';

export type IKA = FastifyInstance & {
    knexAPI?: API;
    knex?: knex.Knex
};

export type IKACommonOptions = {
    prefix?: string;
    // table is an array of table names or an array of objects with table name and table primary key
    tables?: Array<string | { name: string; pk: string }>;
    // schemas is a function (table_name, schema) => schema
    // schema is an structure like DefaultSchema
    schemas?: (tableName: string, schema: any) => any;
    schemaDirPath?: string;
    checkAuth?: (req: any, res: any) => boolean;
}

export type IKAOptions = {
    knexConfig: knex.Knex.Config;
} & IKACommonOptions;

export type IKAPluginOptions = FastifyPluginOptions & IKAOptions;

// options for API constructor class
export type IKAApiOptions = IKACommonOptions & {
    fastify: FastifyInstance;
    knex: knex.Knex;
};