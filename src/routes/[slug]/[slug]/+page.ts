export async function load({ parent, data }) {
    await parent();
    const id = data.id;
    console.log(id);
    const post = await import(`../../../questions/${id}.md`);
    return {
        data: post.default
    }
}