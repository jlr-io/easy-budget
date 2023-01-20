import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	login: async ({ request, locals }) => {

		const data = await request.formData();
		const username = data.get('username');
		const password = data.get('password');

		if (!username || !password) {
			return { success: false, error: "All fields are required" };
		}

		try {
			await locals.pb.collection('users').authWithPassword(username.toString(), password.toString());
		} catch(error) {
			return { success: false, error: "Error logging in" };
		}

		// redirect to home
		throw redirect(307, '/~')
	},
}