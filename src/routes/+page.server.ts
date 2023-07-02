import { questions } from "../db/questions";

/** @type {import('./$types').PageServerLoad} */
export async function load() {
    const data = await questions.find({}, {limit: 50, projection: {
        _id: 0,
    }}).toArray();

    return {
        questions: data
    };
}