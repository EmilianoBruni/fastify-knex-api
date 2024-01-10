const schema = schema => {
    ['create', 'list', 'delete'].forEach(method => {
        schema[method] = undefined;
    });
    return schema;
};

export default schema;
