import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const userSchema = z.object({
    username: z.string().min(3).max(20),
    // email: z.string().email(),
    password: z.string().min(8).max(100),
    password2: z.string().min(8).max(100),
});

export const actions: import("./$types").Actions = {
    register: async ({ request: request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");
        console.log("Registering user: " + username);

        const userdata = userSchema.safeParse(data);
        if (!userdata.success) {
            console.log("Invalid register data!");
        } else {
            // Valid data
            console.log("Valid register data!");
            console.log(userdata.data);
        }
    }, 
    login: async ({ request: request }) => {
        const data = await request.formData();
        const username = data.get("username");
        const password = data.get("password");
        console.log("Logging in user: " + username);
    }
};