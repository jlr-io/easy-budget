<script lang="ts">
	import { browser } from '$app/environment';
	import { applyAction, enhance } from '$app/forms';
	import type { Expense, ICategory, IExpense, IFrequency } from '$lib/types';
	import { onMount } from 'svelte';
	import type { ActionData } from './$types';

	export let data: {
		expenses: IExpense[];
		categories: ICategory[];
		frequencies: IFrequency[];
	};

	export let form: ActionData;

	let expenses: Expense[] = [];

	// initialize expenses with data from the server
	onMount(() => expenses = data.expenses);

	// if we're not on the browser keep in sync with data from server
	$: {
		if (!browser) {
			expenses = data.expenses;
		}
	}

	$: total = expenses.reduce((acc, expense) => {
		return acc + expense.cost!;
	}, 0);

	// determine if the form is dirty
	$: dirty = expenses.some((current, i) => {
		const original = data.expenses[i];
		return JSON.stringify(original) !== JSON.stringify(current)
	});

	function addExpense(): void {
		expenses = [...expenses, {
			name: '', 
			cost: 0, 
			category: data.categories[0].id, 
			frequency: data.frequencies[0].id, 
			essential: false 
		}];
	}

	function removeExpense(i: number): void {
		expenses = expenses.filter((_, index) => index !== i);
	}
</script>

<h3>Expense Page!</h3>
dirty: {dirty}
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
		{#each expenses as expense, i}
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
					<slot />
					<!-- {#if expense?.id} -->
						<button
							on:click|preventDefault={() => removeExpense(i)}
							id="delete-button"
							name="delete-id"
							value={expense?.id}
							formaction="expenses?/delete">Delete</button
						>
						<!-- {:else}
					<button on:click|preventDefault={() => removeExpense(i)}>Remove</button> -->
					<!-- {/if} -->
				</td>
			</tr>
		{/each}
	</table>
	<button on:click|preventDefault={addExpense} formAction="?/add"> Add Expense </button>
	<button on:click|preventDefault={() => console.log('test')} disabled="{!dirty}">Save</button>
</form>

total {total}

<!-- only available w/ csr for now -->
{#if browser }
	<form method="POST" action="?/uploadCsv" use:enhance>
		<input type="file" id="csv-file" name="csv-file" />
		<button>Upload CSV</button>
	</form>
{/if}


{#if form?.success}
	<p>Success!</p>
{/if}