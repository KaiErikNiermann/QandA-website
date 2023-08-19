import { client } from "$lib/db";
import { auth } from "$lib/server/lucia";
import { fail, redirect } from "@sveltejs/kit";
import type { PageServerLoad, Actions } from "./$types";

export const load: PageServerLoad = async ({ locals }) => {
    const data = await client.db("main_db").collection("QandA_collection").find(
            {},
            {
                limit: 1000,
                projection: {
                    _id: 0,
                },
            }
        )
        .toArray();

    const session = await locals.auth.validate();  
    if (!session) {
        return {
            userId: null,
            username: null,
            questions: data,
        }
    }   
    return {
        userId: session.user.userId,
        username: session.user.username,
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
                { question: data.get("question") },
                { $set: { answer: `${answer}`, },     }
            ).then(() => {
                console.log("Answer added!");
            }).catch((err) => {
                console.log(err);
            });
    },

    logout: async ({ locals }) => {
        const session = await locals.auth.validate();
        if (!session) return fail(401, { message: "Not logged in" });
        await auth.invalidateSession(session.sessionId);
        locals.auth.setSession(null);
        throw redirect(302, "/");
    }, 
    signin: async () => {
        throw redirect(302, "/auth/");
    },
};