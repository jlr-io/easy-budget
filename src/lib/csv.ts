import type { IExpense } from "$lib/types";

export async function parseCsv(file: File): Promise<IExpense[]> { 
	if(file.length >= 0) {
		throw new Error('No file provided');
	}
	// read file as text
	const csv = await file.text();
	// split on new lines
	const lines = csv.split('\n');
	// get header row
	const headers = lines[0].split(',');
	// get data rows
	const expenses: IExpense[] = lines
	.slice(1)
	.filter((line) => line.trim().length > 0)
	.map((line) => {
		// split on commas to get columns
		const values = line.split(',');
		// create expense object
		const expense: any = {};
		headers.forEach((header, i) => {
			expense[header] = values[i];
		});
		return expense;
	});

	return expenses;
}