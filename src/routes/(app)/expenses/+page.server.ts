import type { Actions, PageServerLoad } from './$types';
import type { IExpense } from '$lib/types';
import { error } from '@sveltejs/kit';

export const load = (async ({ locals }) => {
	let expenses = await locals.pb.collection('expenses').getFullList(200 /* batch size */, {
		sort: '+created',
	}).then((expenses) => expenses.map(({id, name, cost, category, frequency, essential}) => ({id, name, cost, category, frequency, essential})))
	.catch((e) => { throw error(500, e) });

	let categories = await locals.pb.collection('categories').getFullList(200 /* batch size */, {
		sort: "+name",
	}).then((categories) => categories.map(({id, name}) => ({id, name})))
	.catch((e) => { throw error(500, e) });

	let frequencies = await locals.pb.collection('frequencies').getFullList(200 /* batch size */, {
		sort: "+name",
	}).then((frequencies) => frequencies.map(({id, name}) => ({id, name})))
	.catch((e) => { throw error(500, e) });

  return {
    expenses,
		categories,
		frequencies,
  };
}) satisfies PageServerLoad;

export const actions: Actions = {
	// only used when csr is enabled
	// creates an empty expense
	add: async ({ locals }) => {
		const user = locals.user?.id!;
		await locals.pb.collection('expenses').create({user}).catch((e) => { throw error(500, e) })
		return { success: true }
	},

	save: async ({ request, locals }) => {
		const user = locals.user?.id;
		const data = await request.formData();
		const ids = data.getAll('id');
		const names = data.getAll('name');
		const costs = data.getAll('cost');
		const categories = data.getAll('category');
		const frequencies = data.getAll('frequency');
		const essentials = data.getAll('essential');

		let expenses = ids.map((id, i) => ({
			id: id.toString(),
			name: names[i].toString(),
			cost: +costs[i].toString(),
			category: categories[i].toString(),
			frequency: frequencies[i].toString(),
			essential: !!essentials[i],
		})).filter(e => e.name && e.cost && e.category && e.frequency);

		if(!expenses.length) {
			return { success: true };
		}

		for (const expense of expenses) {
			expense.id
			? await locals.pb.collection('expenses').update(expense.id, {user, ...expense}).catch((e) => { throw error(500, e) })
			: await locals.pb.collection('expenses').create({ user, ...expense}).catch((e) => { throw error(500, e) })
		}

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
		const user = locals.user?.id!;
		// // console.log('uploadCsv');
		const data = await request.formData();
		const file = data.get('csv-file') as File;

		if (file.length >= 0) {
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
			// save to db
			// 	// expenses.forEach(async (expense) => {
			// 	// 	await locals.pb.collection('expenses').create({ user, ...expense}).catch((e) => { throw error(500, e) })
			// 	// });
			return { success: true, expenses };
		}

		return { success: false };
	},
};