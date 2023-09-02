export async function load({ parent, data }) {
    await parent();
    const id = data.id;
    const question = await import(`../../../questions/${id}.md`);
    return {
        data: question.default
    }
}