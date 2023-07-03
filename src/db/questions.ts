import { client } from "./mongo";

export const questions = client.db("main_db").collection("QandA_collection");
