import type { IExpense } from "$lib/types";
import { derived, writable } from "svelte/store";

function state() {
	const { subscribe, set, update } = writable<IExpense[]>([]);
	return {
		subscribe,
		set,
		update,
		add: (expense?: IExpense) => update(e => {
			e.push({ 
				id: expense?.id,
				name: expense?.name ?? '', 
				cost: expense?.cost ?? 0,
				category: expense?.category ?? '',
				frequency: expense?.frequency ?? '',
				essential: expense?.essential ?? false,
			}); 
			return e;
		}),
	};
}

export const expenses = state();
export const totalAmount = derived(expenses, $expenses => $expenses.map(expense => expense.cost).reduce((acc, cur) => acc + cur));