// npm add lucia-auth
import { lucia } from 'lucia';
import { sveltekit } from 'lucia/middleware';

// npm add @lucia-auth/adapter-prisma
import { prisma as prismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './prisma';
import { dev } from '$app/environment';

export const auth = lucia({
	adapter: prismaAdapter(prisma, {
		user: 'user',
		session: 'session',
		key: 'key'
	}),
	middleware: sveltekit(),
	env: dev ? 'DEV' : 'PROD',
	getUserAttributes: (user) => ({
		userId: user.id,
		username: user.username,
        email: user.email
	})
});

export type Auth = typeof auth;