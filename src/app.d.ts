import type { PrismaClient } from "@prisma/client";

declare global {
	namespace App {
		// interface Error {}
		
		interface Locals {
			wss?: ExtendedWebSocketServer;
			auth: import('lucia').AuthRequest;
		}
		
		// interface PageData {}
		
		// interface Platform {}

		interface Question {
			question: string;
			answer: string;
			status: number;
			guild_id: string | null;
			channel_id: string;
			message_id: string;
		}

		interface FieldError {
			field: string | number;
			message: string;
		}
	}
	var prisma: PrismaClient;
}

declare global {
	namespace Lucia {
		type Auth = import('$lib/server/lucia').Auth;
		type DatabaseUserAttributes = {
			username: string; 
			email: string; 
		}
		type DatabaseSessionAttributes = Record<string, never>;
	}
}

export {};
