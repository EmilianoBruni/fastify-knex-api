const schema = schema => {
    schema.create.schema.body.required = ['active'];
    return schema;
};

export default schema;
