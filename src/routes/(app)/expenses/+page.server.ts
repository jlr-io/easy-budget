import type { Actions, PageServerLoad } from './$types';
import * as fs from 'fs/promises';
// import * as fd from 'form-data';
import type { ICategory, IExpense } from '$lib/types';
import type { Record } from 'pocketbase';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	// fetch expenses
	let expenses = await locals.pb.collection('expenses').getFullList<IExpense>(200 /* batch size */, {
		sort: '+created',
	}).then((expenses) => expenses.map(({id, name, cost, category, frequency, essential}) => ({id, name, cost, category, frequency, essential})))
	.catch((e) => { throw error(500, e) });

	// fetch categories
	let categories = await locals.pb.collection('categories').getFullList<ICategory>(200 /* batch size */, {
		sort: "+name",
	}).then((categories) => categories.map(({id, name}) => ({id, name})))
	.catch((e) => { throw error(500, e) });

	// fetch frequencies
	let frequencies = await locals.pb.collection('frequencies').getFullList<Record>(200 /* batch size */, {
		sort: "+name",
	}).then((frequencies) => frequencies.map(({id, name}) => ({id, name})))
	.catch((e) => { throw error(500, e) });

  return {
    expenses,
		categories,
		frequencies,
  };
}) satisfies PageServerLoad;

// function parseFormData(formData: FormData): IExpense[] {
// 	const ids = formData.getAll('id');
// 	const names = formData.getAll('name');
// 	const costs = formData.getAll('costs');
// 	const categories = formData.getAll('category');
// 	const frequencies = formData.getAll('frequency');
// 	const essentials = formData.getAll('essential');

// 	// create array of objects from form data
// 	return ids.map((id, i) => ({ 
// 		id: id.toString(),
// 		name: names[i].toString(),
// 		cost: +costs[i].toString(),
// 		category: categories[i].toString(),
// 		frequency: frequencies[i].toString(),
// 		essential: essentials[i] === 'true' ? true : false,
// 	})).filter(e => e.name && e.cost && e.category && e.frequency);
// }

export const actions: Actions = {
	save: async ({ request, locals }) => {
		console.log('save');
		const user = locals.user?.id;

		const data = await request.formData();
		const ids = data.getAll('id');
		const names = data.getAll('name');
		const costs = data.getAll('cost');
		const categories = data.getAll('category');
		const frequencies = data.getAll('frequency');
		const essentials = data.getAll('essential');

		// // create array of objects from form data
		let expenses = ids.map((id, i) => ({
			id: id.toString(),
			name: names[i].toString(),
			cost: +costs[i].toString(),
			category: categories[i].toString(),
			frequency: frequencies[i].toString(),
			essential: essentials[i] === 'true' ? true : false
		})).filter(e => e.name && e.cost && e.category && e.frequency);

		// // if no expenses, return success
		if(!expenses.length) {
			return { success: true };
		}

		// create or update each expense
		expenses.forEach(async (expense) => {
			console.log(expense);
			expense.id 
			? await locals.pb.collection('expenses').update(expense.id, {user, ...expense}).catch((e) => { throw error(500, e) })
			: await locals.pb.collection('expenses').create({ user, ...expense}).catch((e) => { throw error(500, e) })
		});
		
		return { success: true }
	},

	delete: async ({ request, locals }) => {
		const data = await request.formData();
		const deleteId = data.get('delete-id')?.toString();
		if (deleteId) {
			await locals.pb.collection('expenses').delete(deleteId).catch((e) => { throw error(500, e) });
			return { success: true, id: deleteId }
		}
		return { success: false }
	},

	uploadCsv: async ({ request, locals }) => {
		const user = locals.user?.id;
		// console.log('uploadCsv');
		const data = await request.formData();
		const file = data.get('csv-file') as File;

		if (file) {
			const csv = await file.text();
			const lines = csv.split('\n');
			const headers = lines[0].split(',');
			const expenses: IExpense[] = lines
			.slice(1)
			.filter((line) => line.trim().length > 0)
			.map((line) => {
				const values = line.split(',');
				const expense: any = {};
				headers.forEach((header, i) => {
					expense[header] = values[i];
				});
				return expense;
			});

			return { success: true, expenses }

			// expenses.forEach(async (expense) => {
			// 	await locals.pb.collection('expenses').create({ user, ...expense}).catch((e) => { throw error(500, e) })
			// });
		}

		return { success: false }
	},
};