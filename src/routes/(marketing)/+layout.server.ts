import type { IUser } from '$lib/types';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ locals }) => {
	if (locals.pb.authStore.model) {
		const { id, username, email } = await locals.pb.collection('users').getOne(locals.pb.authStore.model.id, { '$autoCancel': false });
		const user: IUser = { id, name: username, email };
		return { 
			user
		};
	}	
}) satisfies LayoutServerLoad;