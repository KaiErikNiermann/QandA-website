import { z } from 'zod';
import { fail } from '@sveltejs/kit';

const userSchema = z.object({
	username: z.string().min(3).max(20),
	email: z.string().email(),
	password: z.string().min(8).max(100)
});

export const actions: import('./$types').Actions = {
	register: async ({ request: request }) => {
		const data = await request.formData();
		const auth_obj =  {
			username: data.get('username') ?? '' as string,
			email: data.get('email') ?? '' as string,
			password: data.get('password') ?? '' as string
		};

		// Validate data
		const userdata = userSchema.safeParse(auth_obj);

		if (!userdata.success) {
			console.log('Invalid register data!');

            const errors: App.FieldError[] = userdata.error.issues.map((issue) => {
                return { 
                    field: issue.path[0], 
                    message: issue.message,
                    data: auth_obj[issue.path[0] as keyof typeof auth_obj] 
                };
            });

            return fail(400, { errors: errors });

		} else {
			// Valid data
			console.log('Valid register data!');
			// Check username availability

            return { success : true }
		}
	},

	login: async ({ request: request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		console.log('Logging in user: ' + username);
	}
};
