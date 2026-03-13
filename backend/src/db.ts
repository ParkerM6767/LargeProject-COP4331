import { MongoClient } from "mongodb";

const client = new MongoClient(`mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/`);
client.connect();

export { client };
