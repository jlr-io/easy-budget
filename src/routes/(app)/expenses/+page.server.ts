import type { Actions, PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import type { IExpense, ICategory, IFrequency } from '$lib/types';

export const load = (async ({ locals }) => {
	const expenses = await locals.pb.collection('expenses').getFullList<IExpense>(200 /* batch size */, {
		sort: '+created',
	}).then((expenses) => expenses.map(({id, name, cost, category, frequency, essential}) => ({id, name, cost, category, frequency, essential})))
	.catch((e) => { throw error(500, e) });

	const categories = await locals.pb.collection('categories').getFullList<ICategory>(200 /* batch size */, {
		sort: "+name",
	}).then((categories) => categories.map(({id, name}) => ({id, name})))
	.catch((e) => { throw error(500, e) });

	const frequencies = await locals.pb.collection('frequencies').getFullList<IFrequency>(200 /* batch size */, {
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
		const user = locals.user?.id;
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

		const expenses = ids.map((id, i) => ({
			id: id.toString(),
			name: names[i] && names[i].toString(),
			cost: costs[i] && +costs[i].toString(),
			category: categories[i] && categories[i].toString(),
			frequency: frequencies[i] && frequencies[i].toString(),
			essential: !!essentials[i],
		}));

		if(!expenses.length) {
			return { success: true };
		}

		for (const expense of expenses) {
			!expense.id
			? await locals.pb.collection('expenses').create({user, ...expense}).catch((e) => {throw error(500, e)})
			: await locals.pb.collection('expenses').update(expense.id, {user, ...expense}).catch((e) => {throw error(500, e)})
		}

		// delete expenses that were removed
		const existingExpenses = await locals.pb.collection('expenses').getFullList<IExpense>(200 /* batch size */)
		.then((expenses) => expenses.map(({id}) => id))
		.catch((e) => { throw error(500, e) });

		const deletedExpenses = existingExpenses.filter((id) => !ids.includes(id));
		for (const id of deletedExpenses) {
			await locals.pb.collection('expenses').delete(id).catch((e) => { throw error(500, e) });
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

	// only used when csr is enabled
	// TODO: work with ssr
	uploadCsv: async ({ request, locals }) => {
		const user = locals.user?.id;
		const data = await request.formData();
		const file = data.get('csv-file') as File;
		if (file) {
			const csv = await file.text().catch((e) => { throw error(500, e) });
			const lines = csv.split('\n');
			const headers = lines[0].split(',').map((header) => header.trim().toLowerCase());
			const csvExpenses: IExpense[] = lines
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
			
			const dbExpenses = await locals.pb.collection('expenses').getFullList<IExpense>(200 /* batch size */, {
				sort: '+created',
			}).then((expenses) => expenses.map(({name}) => name));

			const frequencies = await locals.pb.collection('frequencies').getFullList<IFrequency>(200 /* batch size */).then((frequencies) => frequencies.map(({id, name}) => ({id, name})))
			const categories = await locals.pb.collection('categories').getFullList<ICategory>(200 /* batch size */).then((categories) => categories.map(({id, name}) => ({id, name})))
	
			// Add new expenses from csv
			// TODO: update existing expenses
			for (const expense of csvExpenses) {
				if (!dbExpenses.includes(expense.name)) {
					const data = {
						user,
						...expense,
						category: categories.find((category) => category.name === expense.category)?.id,
						frequency: frequencies.find((frequency) => frequency.name === expense.frequency)?.id,
					}
					await locals.pb.collection('expenses').create(data).catch((e) => { throw error(500, e) })
				}
			}
		}
		
		return { success: false };
	},
};