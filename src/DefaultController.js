class DefaultController {
    constructor(tableName, pk = 'id') {
        this.table = tableName;
        this.pk = pk;
    }

    async list(req, reply) {
        const [data, fields] = await req.server.mysql.query(
            `SELECT * FROM ${this.table} limit 10`
        );
        return data;
    }

    async view(req, reply) {
        const id = req.params.id;
        const [data, fields] = await req.server.mysql.query(
            `SELECT * FROM ${this.table} WHERE ${this.pk} = ?`,
            [id]
        );
        if (data.length === 0) {
            reply.code(404).send({ message: 'Not found' });
        }
        return data[0];
    }

    async create(req, reply) {
        const { nome, cognome, email, password } = req.body;
        return await req.server.mysql.query(
            `INSERT INTO ${this.table} (nome, cognome, email, password) VALUES (?, ?, ?, ?)`,
            [nome, cognome, email, password]
        );
    }

    async update(req, reply) {
        const id = req.params.id;
        const { nome, cognome, email, password } = req.body;
        return await req.server.mysql.query(
            `UPDATE ${this.table} SET nome = ?, cognome = ?, email = ?, password = ? WHERE ${this.pk} = ?`,
            [nome, cognome, email, password, id]
        );
    }

    async delete(req, reply) {
        const id = req.params.id;
        return await req.server.mysql.query(
            `DELETE FROM ${this.table} WHERE ${this.pk} = ?`,
            [id]
        );
    }
}

export default DefaultController;
