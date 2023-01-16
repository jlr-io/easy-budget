<script lang="ts">
	import { applyAction, enhance } from "$app/forms";
	// import { writable } from "svelte/store";

	export let form: any;

	let username: string;
	let password: string;
	// let passwordConfirm: string;

	// const user = writable(null);
</script>

<h1>Welcome to Easy Budget!</h1>

<!-- sign up -->
<form method="POST"	use:enhance={() => {
	// disables form refresh on submit
	// still updates form object
	return async({ result }) => { 
		await applyAction(result);
	}
}}>
	<input
      placeholder="Username"
      type="text"
			name="username"
      bind:value={username}
    />

    <input 
      placeholder="Password" 
      type="password"
			name="password"
      bind:value={password} 
    />
	<button formaction="?/login">Login</button>
</form>

{#if form?.success}
	success
{/if}

{#if form?.error}
	{form.error}
{/if}