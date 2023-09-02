import { z } from 'zod';
import { fail, redirect } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import { LuciaError } from 'lucia';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

import type { PageServerLoad } from './$types';

const userSchema = z.object({
	username: z.string().min(3).max(20),
	email: z.string().email(),
	password: z.string().min(8).max(100)
});

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
};

export const actions: import('./$types').Actions = {
	register: async ({ request: request, locals: locals }) => {
		const data = await request.formData();
		const authobj = {
			username: data.get('username') ?? ('' as string),
			email: data.get('email') ?? ('' as string),
			password: data.get('password') ?? ('' as string)
		};

		// Validate data
		const userdata = userSchema.safeParse(authobj);

		if (!userdata.success) {
			console.log('Invalid register data!');

			const errors: App.FieldError[] = userdata.error.issues.map((issue) => {
				return {
					field: issue.path[0],
					message: issue.message
				};
			});

			return fail(400, { errors: errors });
		} else {
			// Create user
			try {
				const user = await auth.createUser({
					key: {
						providerId: 'username',
						providerUserId: authobj.username.toString().toLowerCase(),
						password: authobj.password.toString()
					},
					attributes: {
						username: authobj.username.toString(),
						email: authobj.email.toString()
					}
				});

				const session = await auth.createSession({
					userId: user.userId,
					attributes: {}
				});

				locals.auth.setSession(session);
			} catch (err) {
				// Username already exists
				if (err instanceof PrismaClientKnownRequestError) {
					return fail(400, { errors: [{ field: 'username', message: 'Username already exists' }] });
				}
				// Unknown error
				return fail(500, { errors: [{ field: 'username', message: 'Unknown error' }] });
			}
			throw redirect(302, '/');
		}
	},

	login: async ({ request: request, locals: locals }) => {
		const data = await request.formData();
		const authobj = {
			username: data.get('username') ?? ('' as string),
			email: data.get('email') ?? ('' as string),
			password: data.get('password') ?? ('' as string)
		};
		const userdata = userSchema.safeParse(authobj);

		if (!userdata.success) {
			const errors: App.FieldError[] = userdata.error.issues.map((issue) => {
				return {
					field: issue.path[0],
					message: issue.message
				};
			});

			return fail(400, { errors: errors });
		}
		try {
			const key = await auth.useKey(
				'username',
				authobj.username.toString().toLowerCase(),
				authobj.password.toString()
			);
			const session = await auth.createSession({
				userId: key.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					errors: [
						{ field: 'username', message: 'Invalid username or password' },
						{ field: 'password', message: 'Invalid username or password' }
					]
				});
			}
			return fail(500, {
				errors: [{ field: 'username', message: 'Unknown error' }]
			});
		}
	},

	logout: async ({ locals }) => {
		// TODO - logout logic
	}
};
