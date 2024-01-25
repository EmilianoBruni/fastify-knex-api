import fastify from "fastify";

declare module "fastify" {
    export interface FastifyInstance<
        HttpServer = HttpServer,
        HttpRequest = HttpRequest,
        HttpResponse = HttpResponse
        > {
        knexAPI: API;
        knex: Knex;
    }
};