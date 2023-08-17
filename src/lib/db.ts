import { MongoClient } from "mongodb";
import { DATABASE_URL } from "$env/static/private";

export const client = new MongoClient(DATABASE_URL);

export async function connect() {
    console.log("Connecting to database...");
    await client.connect();
}