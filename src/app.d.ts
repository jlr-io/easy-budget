// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
import type { IUser } from "$lib/types";
import PocketBase, { Admin, Record } from "pocketbase";

declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			pb: PocketBase
			user: IUser | undefined
		}
		interface Error {
			message: string;
			errorId: string;
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export {};
