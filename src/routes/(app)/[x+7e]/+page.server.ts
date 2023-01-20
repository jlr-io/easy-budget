import type { PageServerLoad } from "./$types";
import type { IUser } from "$lib/types";

export const load = (async ({ locals }) => {
	// return user record if logged in
	if (locals.pb.authStore.model) {
		const { id, username, email } = await locals.pb.collection('users').getOne(locals.pb.authStore.model.id);
		const user: IUser = { id, name: username, email };
		return { 
			user
		};
	}	
}) satisfies PageServerLoad;