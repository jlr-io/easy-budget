<script lang="ts">
	import type { IExpense } from '$lib/types';
	import { applyAction, enhance } from '$app/forms';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';

	export let data: any;
	export let form: any;

	function state() {
		const { subscribe, set, update } = writable<IExpense[]>([]);
		return {
			subscribe,
			set,
			update,
			add: (expense?: IExpense) => update(e => {
				e.push({name: expense?.name, amount: expense?.amount }); 
				return e;
			}),
		};
	}
	const expenses = state();

	onMount(() => expenses.set(data.expenses));
</script>

<h3>Expense Page!</h3>

<form method="POST" use:enhance={() => {
		// disables form refresh on submit
		// still updates form object
		return async({ result }) => { 
			await applyAction(result);
		}
	}}>
	
	<table>
		<tr>
			<th>Expense Name</th>
			<th>Expense Amount</th>
		</tr>
		{#each $expenses as expense, i}
			<tr>
				<td hidden><input bind:value="{expense.id}" name="id" type="text" placeholder="Enter expense"/></td>
				<td><input bind:value="{expense.name}" name="name" type="text" placeholder="Enter expense"/></td>
				<td><input bind:value="{expense.amount}" name="amount" type="number" placeholder="Enter amount"/></td>
			</tr>
		{/each}

		<button on:click|preventDefault="{() => expenses.add()}"> Add Expense </button>
		
	</table>

	<button>Save</button>
</form>

{#if form?.success}
	success
{/if}

{#if form?.error}
	{form?.error}
{/if}
