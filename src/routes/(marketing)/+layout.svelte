<script lang="ts">
	import { currentUser } from "$lib/store";
	import type { IUser } from "$lib/types";
	import { onMount } from "svelte";

	export let data: {
		user: IUser
	};

	// set the current user
	onMount(() => currentUser.set(data.user));
</script>

<a href='/signup'>Signup</a>
<a href='/login'>Login</a>


<slot />