import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

// { cookies, request, locals, params }
export const load = (({ cookies, url }) => {
	console.log('test');
	// redirect to login if no cookie
	if (!cookies.get('pb_auth') && url.pathname !== '/login' && url.pathname !== '/signup') {
    // throw redirect(307, '/login');
  }
}) satisfies LayoutServerLoad;