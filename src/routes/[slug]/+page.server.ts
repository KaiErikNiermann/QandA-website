import { error } from '@sveltejs/kit'
import { db } from '../../hooks.server.js';
import { writeFile } from 'fs';

export async function load({ params: params }) {
    try {
        const guild_id = params.slug;

        const server_questions = await db.find({
            guild_id: guild_id
        }, {
            limit: 100,
            projection: {
                _id: 0
            }
        }).toArray();

        server_questions.forEach((question) => {
            writeFile(`src/routes/${guild_id}.md`, question.question, err => {
                if (err) {
                    console.error(err);
                    return;
                }
            });
        });

        const post = await import(`../${guild_id}.md`);
        
        return {
            data: post.default
        }
    } catch (e) {
        throw error(404, 'Post not found');
    }
}
