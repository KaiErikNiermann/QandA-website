import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';

const userSchema = z.object({
	username: z.string().min(3).max(20),
	email: z.string().email(),
	password: z.string().min(8).max(100)
});

export const actions: import('./$types').Actions = {
	register: async ({ request: request }) => {
		const data = await request.formData();
		const authobj =  {
			username: data.get('username') ?? '' as string,
			email: data.get('email') ?? '' as string,
			password: data.get('password') ?? '' as string
		};

		// Validate data
		const userdata = userSchema.safeParse(authobj);

		if (!userdata.success) {
			console.log('Invalid register data!');

            const errors: App.FieldError[] = userdata.error.issues.map((issue) => {
                return { 
                    field: issue.path[0], 
                    message: issue.message,
                    data: authobj[issue.path[0] as keyof typeof authobj] 
                };
            });

            return fail(400, { errors: errors });

		} else {
			// Valid data
			console.log('Valid register data!');
			// Check username availability

			// Create user 
			const user = await auth.createUser({
				key: {
					providerId: 'username',
					providerUserId: authobj.username.toString().toLowerCase(),
					password: authobj.password.toString()

				},
				attributes: {
					authobj.username
				}
			})

            return { success : true }
		}
	},

	login: async ({ request: request }) => {
		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');
		console.log('Logging in user: ' + username);
	},

	logout: async ({ locals }) => {
		// TODO - logout logic
	}
};
