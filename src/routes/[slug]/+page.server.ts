import { mdsvex } from 'mdsvex'
import { compile } from 'mdsvex';
import { error } from "@sveltejs/kit";

export async function load({ params: params }) {
    
}

// form actions 
export const actions: import('./$types').Actions = {
    compile: async ({ request }) => {
        const data = await request.formData();
        const markdown: string = data.get('markdown') as string;
        
        console.log(markdown);

        const compiled = await compile(markdown);

        console.log(compiled);

        return {
            data: compiled
        }
    }
}