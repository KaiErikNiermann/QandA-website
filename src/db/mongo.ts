import { MongoClient } from 'mongodb';
import { DB_URI } from '$env/static/private';

export const client = new MongoClient(DB_URI);

export function start_mongo() {
    console.log("Connecting to MongoDB...");
    return client.connect();
}

