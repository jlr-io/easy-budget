<script lang="ts">
	import { currentUser } from "$lib/store";
	import type { IUser } from "$lib/types";
	import { onMount } from "svelte";

	export let data: {
		user: IUser
	}

	onMount(() => {
		currentUser.set(data.user);
	});

</script>

<a data-sveltekit-preload-data="tap" href='/logout'>Logout</a>
<a href='/expenses'>Expenses</a>

<slot />