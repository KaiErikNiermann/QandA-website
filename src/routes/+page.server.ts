import { questions } from "../db/questions";
import { client } from "../db/mongo";

export async function load() {
    console.log("Loading questions...");

    const data = await questions
        .find(
            {},
            {
                limit: 100,
                projection: {
                    _id: 0,
                },
            }
        )
        .toArray();

    return {
        questions: data,
    };
}

export const actions: import("./$types").Actions = {
    add_answer: async ({ request }) => {
        const data = await request.formData();
        const answer = data.get("answer");

        console.log("Adding answer to question: " + data.get("question"));
        await client
            .db("main_db")
            .collection("QandA_collection")
            .updateOne(
                {
                    question: data.get("question"),
                },
                {
                    $set: {
                        answer: answer,
                    },
                }
            ).then(() => {
                console.log("Answer added!");
            }).catch((err) => {
                console.log(err);
            });
    },
};
