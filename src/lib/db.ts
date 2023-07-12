import { MongoClient } from "mongodb";
import { DB_URI } from "$env/static/private";

export const client = new MongoClient(DB_URI);

export async function connect() {
    console.log("Connecting to database...");
    await client.connect();
}