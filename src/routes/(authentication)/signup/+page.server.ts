import { redirect, type Actions } from "@sveltejs/kit";

export const actions: Actions = {
	signUp: async ({ request, locals }) => {
		const data = await request.formData();
		const username = data.get('username')?.toString();
		const password = data.get('password')?.toString();
		const passwordConfirm = data.get('passwordConfirm')?.toString();

		if (!username || !password || !passwordConfirm) {
			return { success: false, error: "All fields are required" };
		};

		if (password !== passwordConfirm) {
			return { success: false, error: "Passwords do not match" };
		}

		try {
			await locals.pb.collection('users').create(data);
		} catch(error) {
			return { success: false, error: "Error creating user" };
		}

		try {
			await locals.pb.collection('users').authWithPassword(username, password);
		} catch(error) {
			return { success: false, error: "Error logging in" };
		}

		// redirect to home
		throw redirect(307, '/~');
	}
}