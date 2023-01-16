import type { Actions } from "@sveltejs/kit";

export const actions: Actions = {
	signUp: async ({ request, locals }) => {
		const data = await request.formData();
		console.log(data);

		const username = data.get('username');
		const password = data.get('password');
		const passwordConfirm = data.get('passwordConfirm');

		if (!username || !password || !passwordConfirm) {
			return { success: false, error: "All fields are required" };
		};

		if (password !== passwordConfirm) {
			return { success: false, error: "Passwords do not match" };
		}

		// let createdUser: Record;

		try {
			const createdUser = await locals.pb.collection('users').create(data);
			console.log(createdUser);
			await locals.pb.collection('users').authWithPassword(createdUser.username, createdUser.password);
		} catch(error) {
			console.log(error);
			return { success: false, error: "Error creating user" };
		}
	}
}