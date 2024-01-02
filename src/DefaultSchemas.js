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

export { defaultSchemas };
