const defaultSchemas = modelName => {
    return {
        view: {
            schema: {
                summary: 'Get details of single ' + modelName,
                tags: [modelName],
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier of ' + modelName
                        }
                    }
                },
                querystring: {
                    type: 'object',
                    properties: {
                        fields: {
                            type: 'string',
                            description:
                                'Comma separated list of fields to return'
                        }
                    }
                }
            }
        },
        list: {
            schema: {
                summary: 'List ' + modelName,
                tags: [modelName],
                querystring: {
                    type: 'object',
                    properties: {
                        offset: {
                            type: 'number',
                            description: 'offset of the list'
                        },
                        skip: {
                            type: 'number',
                            description: 'number of items to skip'
                        },
                        limit: {
                            type: 'number',
                            description: 'limit the records to return'
                        },
                        page: {
                            type: 'number',
                            description:
                                'based on limit, return page of the list'
                        },
                        window: {
                            type: 'number',
                            description:
                                'based on limit, return page of the list'
                        },
                        sort: {
                            type: 'string',
                            description:
                                'a comma separated list of fields to sort by'
                        },
                        filter: {
                            type: 'string',
                            description: 'knex whereRaw filter'
                        },
                        fields: {
                            type: 'string',
                            description:
                                'Comma separated list of fields to return'
                        }
                    }
                }
            }
        },
        create: {
            schema: {
                summary: 'Create a new ' + modelName,
                tags: [modelName]
            }
        },
        update: {
            schema: {
                summary: 'Update existing ' + modelName,
                tags: [modelName],
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier of ' + modelName
                        }
                    }
                }
            }
        },
        delete: {
            schema: {
                summary: 'Delete existing ' + modelName,
                tags: [modelName],
                params: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'string',
                            description: 'Unique identifier of ' + modelName
                        }
                    }
                }
            }
        }
    };
};

const defaultHttpCode = {
    $id: 'fastify-knex-api/http-code',
    type: 'object',
    204: {
        type: 'object',
        description: 'No Content',
        properties: {
            message: { type: 'string', example: 'Object delete' },
            statusCode: { type: 'number', example: 204 }
        }
    },
    404: {
        type: 'object',
        description: 'Object not found',
        properties: {
            error: { type: 'string', example: 'Not Found' },
            message: { type: 'string', example: 'Object Not Found' },
            statusCode: { type: 'number', example: 404 }
        }
    },
    500: {
        type: 'object',
        description: 'Internal Server Error',
        properties: {
            error: { type: 'string', example: 'Internal Server Error' },
            message: { type: 'string', example: 'Something went wrong' },
            statusCode: { type: 'number', example: 500 }
        }
    }
};

export { defaultSchemas, defaultHttpCode };
