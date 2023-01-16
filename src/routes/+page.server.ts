// import type { PageServerLoad } from "./$types";

// export const load = (async ({ locals }) => {
//   return {
//     username: locals.username
//   };
// }) satisfies PageServerLoad;
import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	login: async ({ request, locals }) => {
		console.log('login');

		const data = await request.formData();
		// console.log(data);

		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return { success: false, error: "All fields are required" };
		}

		try {
			await locals.pb.collection('users').authWithPassword(username.toString(), password.toString());
		} catch(error) {
			console.log(error);
			return { success: false, error: "Error logging in" };
		}

		console.log('user: ' + JSON.stringify(locals.pb.authStore.model));
		throw redirect(307, '/')
	},
}