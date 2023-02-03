<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { afterUpdate, onMount } from 'svelte';
	import type { ICategory, IExpense, IFrequency } from '$lib/types';
	import { expenses } from '$lib/store';
	import type { ActionData } from './$types';
	// import { browser } from '$app/environment';

	export let data: {
		expenses: IExpense[];
		categories: ICategory[];
		frequencies: IFrequency[];
	};

	export let form: ActionData;

	function removeExpense(i: number): void {
		$expenses.splice(i, 1);
		$expenses = [...$expenses];
	}
</script>

<h3>Expense Page!</h3>

<!-- browser: {browser} -->

<form
	method="POST"
	action="?/save"
	use:enhance={() => {
		// this is a submit function
		// it runs before the form is submitted

		// disables form refresh on submit
		// still updates form object

		// this callback runs with the action result
		return async ({ result, update }) => {
			applyAction(result);
			update({ reset: false });
		};
	}}
>
	<table>
		<tr>
			<th>Name</th>
			<th>Cost</th>
			<th>Category</th>
			<th>Frequency</th>
			<th>Essential</th>
		</tr>
		{#each data.expenses as expense, i}
			<tr>
				<td hidden><input bind:value={expense.id} name="id" type="text" /></td>
				<td
					><input
						bind:value={expense.name}
						name="name"
						type="text"
						placeholder="Enter expense"
					/></td
				>
				<td
					><input
						bind:value={expense.cost}
						name="cost"
						type="string"
						placeholder="Enter cost"
					/></td
				>
				<td>
					<select bind:value={expense.category} name="category">
						{#each data.categories as category}
							<option value={category.id}>{category.name}</option>
						{/each}
					</select>
				</td>
				<td>
					<select bind:value={expense.frequency} name="frequency">
						{#each data.frequencies as frequency}
							<option value={frequency.id}>{frequency.name}</option>
						{/each}
					</select>
				</td>
				<td>
					<input
						bind:value={expense.essential}
						bind:checked={expense.essential}
						type="checkbox"
						name="essential"
					/>
				</td>
				<td>
					{#if expense?.id }
						<button id="delete-button" name="delete-id" value={expense?.id} formaction="?/delete">Delete</button>
					{:else}
						<button on:click|preventDefault={() => removeExpense(i)}>Remove</button>
					{/if}
				</td>
			</tr>
		{/each}
	</table>
	<button formAction="?/add"> Add Expense </button>
	<button formAction="?/save">Save</button>
</form>

<form
	method="POST"
	action="?/uploadCsv"
	use:enhance={() => {
		return async ({ result, update }) => {
			// applyAction(result);
			update({ reset: false });
		};
	}}
>
	<input type="file" id="csv-file" name="csv-file" />
	<input on:click|preventDefault={() => console.log('test')} formAction="?/uploadCsv" type="submit" />
	<!-- <button formAction="?/uploadCsv">Submit</button> -->
</form>

{#if form?.success}
	success
{/if}