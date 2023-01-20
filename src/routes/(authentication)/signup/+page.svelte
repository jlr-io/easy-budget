<script lang="ts">
	import { applyAction, enhance } from "$app/forms";

	export let form: any;

	let username: string;
	let password: string;
	let passwordConfirm: string;

</script>

<h2>Signup!</h2>

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

		<input 
      placeholder="Confirm Password" 
      type="password"
			name="passwordConfirm"
      bind:value={passwordConfirm} 
    />

	<button formaction="?/signUp">Sign Up</button>
</form>

<p>Already have an account? <a href='/login'>Login!</a></p>