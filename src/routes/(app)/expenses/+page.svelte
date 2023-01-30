<script lang="ts">
	import { applyAction, enhance } from '$app/forms';
	import { afterUpdate, onMount } from 'svelte';
	import type { ICategory, IExpense, IFrequency } from '$lib/types';
	import { expenses } from '$lib/store';
	import type { ActionData } from './$types';

	export let data: {
		expenses: IExpense[];
		categories: ICategory[];
		frequencies: IFrequency[];
	};

	interface DeleteAction {
		success: boolean;
		error: string;
		id: string;
	}

	export let form: ActionData;

	function removeIndex(i: number): void {
		$expenses.splice(i, 1);
		expenses.set($expenses);
	}
	// export let expenses: IExpense[] = [];

	// function addNewExpense(): void {
	// 	expenses.push({
	// 		name: undefined,
	// 		amount: undefined,
	// 		category: data.categories[0].id,
	// 		frequency: data.frequencies[0].id,
	// 		essential: false
	// 	});
	// 	expenses = [...expenses];
	// }

	onMount(() => {
		expenses.set(data.expenses)
	});

	// keeps expenses in sync with form
	afterUpdate(() => {
		// delete type guard
		if(form && "id" in form) {
			for (let i = 0; i < $expenses.length; i++) {
				if($expenses[i].id === form.id) {
					$expenses.splice(i, 1);
					expenses.set($expenses);
					form.id = undefined;
					break;
				}
			}
		}

		// add type guard
		if(form && "expenses" in form) {
			expenses.set($expenses.concat(form.expenses ?? []));
			$expenses = [...$expenses]
			form.expenses = undefined;
		}

		// update type guard
	});
</script>

<h3>Expense Page!</h3>

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
		{#each $expenses as expense, i}
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
						<button name="delete-id" value={expense?.id} formaction="?/delete">Delete</button>
					{:else}
						<button on:click|preventDefault={() => removeIndex(i)}>Remove</button>
					{/if}
				</td>
			</tr>
		{/each}
		<button on:click|preventDefault={() => expenses.add()}> Add Expense </button>
	</table>
	<button>Save</button>
</form>

<form
	method="POST"
	action="?/uploadCsv"
	use:enhance={() => {
		return async ({ result, update }) => {
			applyAction(result);
			update({ reset: false });
		};
	}}
>
	<input type="file" id="csv-file" name="csv-file" />
	<!-- <button>Upload CSV</button> -->
	<input formAction="?/uploadCsv" type="submit" />
</form>

<!-- {form?.success} -->

{#if form?.success}
	success
{/if}

<!-- {#if form?.error}
	{form?.error}
{/if} -->

<style>
	.float-right {
		float: right;
	}
</style>
