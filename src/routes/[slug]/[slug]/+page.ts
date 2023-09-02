export async function load({ parent, data }) {
    await parent();
    const id = data.id;
    const fp = `../../../questions/${id}.md`
    const question = await import(fp);
    
    return {
        data: question.default
    }
}