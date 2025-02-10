import type API from './Classes/API.js';
import type {
    FastifyInstance,
    FastifyPluginOptions,
    FastifyReply,
    FastifyRequest
} from 'fastify';
import type { Knex } from 'knex';

declare module 'fastify' {
    interface FastifyInstance {
        knexAPI: API;
        knex: Knex;
    }
}

export type TKARequest = FastifyRequest;
export type TKAReply = FastifyReply;

export type TKARequestList = TKARequest & {
    query: TKAControllerFiltersList | unknown;
};
export type TKAParamsId = { id: string };

export type TTableDefinition = {
    name: string;
    pk?: string | undefined;
    verbs?: TKAVerbs[];
};

export type TTablesDefinition = Array<string | TTableDefinition>;
export type TTablesDefinitionNormalized = Array<TTableDefinition>;

export type TKACheckAuth = (req: TKARequest, res: TKAReply) => Promise<boolean>;

export type IKACommonOptions = {
    prefix?: string;
    // table is an array of table names or an array of objects with table name and table primary key
    tables?: TTablesDefinition;
    // schemas is a function (table_name, schema) => schema
    // schema is an structure like DefaultSchema
    schemas?: (tableName: string, schema: TKAAPISchemas) => TKAAPISchemas;
    columnSchema?: (
        tableName: string,
        columnName: string,
        jsonColumnSchema: JSONSchemaProps
    ) => JSONSchemaProps | undefined;
    schemaDirPath?: string;
    checkAuth?: TKACheckAuth | undefined;
    verbs?: (
        tableName: string,
        verbs: TKAVerbs[] | undefined
    ) => TKAVerbs[] | undefined;
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

// DefaultController

export interface TKAController {
    list: (req: TKARequest, res: TKAReply) => Promise<TKAListResult>;
    view: (req: TKARequest, res: TKAReply) => Promise<any>;
    create: (req: TKARequest, res: TKAReply) => Promise<any>;
    update: (req: TKARequest, res: TKAReply) => Promise<any>;
    delete: (req: TKARequest, res: TKAReply) => Promise<any>;
    //[key: string]: (req: TKARequest, reply: TKAReply) => Promise<any>;
}

export type TKAControllerFiltersPagination = {
    offset?: number;
    skip?: number;
    limit?: number;
    page?: number;
    window?: number;
};

export type TKAControllerFiltersSort = {
    sort?: string;
};

export type TKAControllerFiltersProjection = {
    fields?: string;
};

export type TKAControllerFiltersSearch = {
    filter?: string;
};

export type TKAControllerFiltersList = TKAControllerFiltersPagination &
    TKAControllerFiltersSort &
    TKAControllerFiltersProjection &
    TKAControllerFiltersSearch;

// crud.ts

export type TKACrudVerbOptions = {
    url: string;
    schema?: TKASchema;
    handler?: any;
};

export type TKACrudVerbs = {
    list?: TKACrudVerbOptions;
    view?: TKACrudVerbOptions;
    create?: TKACrudVerbOptions;
    update?: TKACrudVerbOptions;
    delete?: TKACrudVerbOptions;
};

export type TKACrudOptions = {
    controller: TKAController;
    prefix?: string;
    checkAuth?: TKACheckAuth | undefined;
    verbs?: TKAVerbs[] | undefined;
} & TKAAPISchemas;

export type TKACrudGenHandlerOptions = {
    type: TKAVerbs;
} & TKACrudOptions;

// rappresent a generic row of a database

export type TKACrudRow = Record<string, any>;
export type TKAListResult = {
    total: number;
    items: Array<TKACrudRow>;
};
export type TKAVerbResult = TKACrudRow;
