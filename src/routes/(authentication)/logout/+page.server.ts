import type { PageServerLoad } from "./$types";
import type { IUser } from "$lib/types";
import { redirect } from "@sveltejs/kit";

export const load = (async ({ locals }) => {
	try {
		// clear the current user
		console.log('clear auth store');
		locals.pb.authStore.clear();
	} catch(error) {
		console.log(error);
	}
	throw redirect(307, '/');
}) satisfies PageServerLoad;