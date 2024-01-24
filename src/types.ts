import type API from './Classes/API.js';
import type { FastifyInstance, FastifyPluginOptions } from 'fastify';
import type { Knex } from 'knex';

export type IKA = FastifyInstance & {
    knexAPI?: API;
    knex?: Knex;
};

export type TTableDefinition = {
    name: string;
    pk?: string | undefined;
};

export type TTablesDefinition = Array<string | TTableDefinition>;
export type TTablesDefinitionNormalized = Array<TTableDefinition>;

export type IKACommonOptions = {
    prefix?: string;
    // table is an array of table names or an array of objects with table name and table primary key
    tables?: TTablesDefinition;
    // schemas is a function (table_name, schema) => schema
    // schema is an structure like DefaultSchema
    schemas?: (tableName: string, schema: any) => any;
    schemaDirPath?: string;
    checkAuth?: (req: any, res: any) => boolean;
};

export type IKAOptions = {
    knexConfig: Knex.Config;
} & IKACommonOptions;

export type IKAPluginOptions = FastifyPluginOptions & IKAOptions;

// options for API constructor class
export type IKAApiOptions = IKACommonOptions & {
    fastify: FastifyInstance;
    knex: Knex;
};

export type TColumnsInfo = Record<string | number | symbol, Knex.ColumnInfo>;

/// DefaultSchemas

export type TKASchema = {
    summary: string;
    tags: Array<string>;
    params?: {
        type: 'object';
        properties: Record<string, JSONSchemaProps>;
    };
    query?: any;
    body?: any;
    response?: {
        200?: any;
        204?: any;
        302?: any;
        400?: any;
        401?: any;
        404?: any;
        500?: any;
    };
};

export type TKAVerbs = 'view' | 'list' | 'create' | 'update' | 'delete';

export type TKAAPISchemas = Record<TKAVerbs, { schema: TKASchema }>;

export type JSONType =
    | 'string'
    | 'number'
    | 'integer'
    | 'boolean'
    | 'object'
    | 'array'
    | 'null'
    | 'object';

export type JSONSchemaProps = {
    type: JSONType;
    properties?: Record<string, JSONSchemaProps>;
    items?: JSONSchemaProps;
    $ref?: string;
    description?: string;
    required?: Array<string>;
    enum?: Array<string>;
    default?: any;
    additionalProperties?: boolean;
    oneOf?: Array<JSONSchemaProps>;
    anyOf?: Array<JSONSchemaProps>;
    allOf?: Array<JSONSchemaProps>;
    not?: JSONSchemaProps;
    title?: string;
    format?: string;
    minLength?: number;
    maxLength?: number;
    minimum?: number;
    maximum?: number;
    multipleOf?: number;
    exclusiveMinimum?: number;
    exclusiveMaximum?: number;
    pattern?: string;
    minItems?: number;
    maxItems?: number;
    uniqueItems?: boolean;
    contains?: JSONSchemaProps;
    examples?: Array<any>;
    const?: any;
    readOnly?: boolean;
    writeOnly?: boolean;
    discriminator?: string;
    xml?: any;
    externalDocs?: any;
    deprecated?: boolean;
    if?: JSONSchemaProps;
    then?: JSONSchemaProps;
    else?: JSONSchemaProps;
    contentEncoding?: string;
    contentMediaType?: string;
    contentSchema?: JSONSchemaProps;
    [key: string]: any;
    example?: string | number | boolean | object | Array<any> | null;
};
