<script lang="ts">
	import { applyAction, enhance } from "$app/forms";

	export let form: {
		success: boolean,
		error: string
	};

	let username: string;
	let password: string;

</script>

<h1>Login</h1>

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

<p>Don't have an account? <a href='/signup'>Signup</a></p>

{#if form?.error}
	{form.error}
{/if}