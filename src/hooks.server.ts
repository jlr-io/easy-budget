import { redirect, type Handle } from '@sveltejs/kit';
import PocketBase from 'pocketbase';

export const handle = (async ({ event, resolve }) => {
	event.locals.pb = new PocketBase("http://127.0.0.1:8090");

	// load the store data from the request cookie string
	event.locals.pb.authStore.loadFromCookie(event.request.headers.get('cookie') || '');

	try {
		// get an up-to-date auth store state by verifying and refreshing the loaded auth model (if any)
		event.locals.pb.authStore.isValid && await event.locals.pb.collection('users').authRefresh();
		event.locals.user = event.locals.pb.authStore.model ?
		{
			id: event.locals.pb.authStore.model?.id,
			name: event.locals.pb.authStore.model?.username,
			email: event.locals.pb.authStore.model?.email
		} : null;
	} catch (_) {
		// clear the auth store on failed refresh
		event.locals.pb.authStore.clear();
	}

	if(!event.locals.pb.authStore.isValid && event.url.pathname !== '/login' && event.url.pathname !== '/signup' && event.url.pathname !== '/') {
		// Unauthorized user trying to access a page other than login or signup
		throw redirect(307, '/');
	}

	if (event.locals.pb.authStore.isValid && event.url.pathname == '/') {
		throw redirect(307, '/~');
	}
		
	const response = await resolve(event);

	// send back the default 'pb_auth' cookie to the client with the latest store state
	response.headers.append('set-cookie', event.locals.pb.authStore.exportToCookie());

	return response;
}) satisfies Handle;