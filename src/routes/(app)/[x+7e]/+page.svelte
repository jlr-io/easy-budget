<script lang="ts">
	import type { IUser } from "$lib/types";
	import { currentUser } from "$lib/store";

	export let data: {
		user: IUser
	};
</script>

<h3>welcome {data.user.name}</h3>
<h3>welcome (from the store) {$currentUser?.name}</h3>