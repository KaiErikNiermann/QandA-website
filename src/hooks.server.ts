import { start_mongo } from "./db/mongo";

start_mongo().then(() => {
    console.log("MongoDB connected");
}).catch((err) => {
    console.error(`could not connect to MongoDB: ${err}`);
});