import { writeFile } from 'fs';
import { db } from '../../../hooks.server.js';

export async function load({ params: params }) {
	const message_id = params.slug;

	const question = await db.findOne({ message_id: message_id });

    console.log(question);
    writeFile(`src/questions/${question?.message_id}.md`, question?.question, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });    

	return {
		id: question?.message_id,
	};
}
