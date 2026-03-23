import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.DB_HOST!);
client.connect();

export { client };