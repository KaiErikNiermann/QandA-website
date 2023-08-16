// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		
		interface Locals {
			wss?: ExtendedWebSocketServer;
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
			data: FormDataEntryValue;
		}
	}
}

export {};
