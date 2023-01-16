import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// { cookies, request, locals, params }
export const load = (({ cookies, locals }) => {
	try {
		locals.pb.authStore.clear();
	} catch(error) {
		console.log(error);
	}

	throw redirect(307, '/login');
	
}) satisfies LayoutServerLoad;