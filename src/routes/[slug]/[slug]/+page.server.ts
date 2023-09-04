import { writeFile } from 'fs';
import { db } from '../../../hooks.server.js';

export async function load({ params: params }) {
	const message_id = params.slug;

	const question = await db.findOne({ message_id: message_id });
	const answers_arr: string[] = question?.answers;
	const answers_iter = answers_arr.entries();

	const r = Array.from(answers_iter).map(([idx, answer]) => {
		return `---\n## answer ${idx + 1}\n${answer}`
	});

	const file_contents = [
		`${question?.question}`,
		``,
		r
	].join('\n');

	writeFile(`src/questions/${question?.message_id}.md`, file_contents, (err) => {
		if (err) throw err;
		console.log('The file has been saved!');
	});

	return {
		id: question?.message_id
	};
}