export interface IUser {
	id: string;
	name: string;
	email: string;
}

export enum Categories {
	Utilities = 'utilities',
	Insurance = 'insurance',
	Transportation = 'transportation',
	Entertainment = 'entertainment',
	Health = 'health',
	Debt = 'debt',
	Misc = 'misc',
}

export enum Frequencies {
	Daily = 'daily',
	Weekly = 'weekly',
	BiWeekly = 'bi-weekly',
	Monthly = 'monthly',
	Yearly = 'yearly',
}

export interface IExpense {
	id: string;
	name: string;
	cost: number;
	category: string;
	frequency: string;
	essential: boolean;
}

export type Expense = Partial<IExpense>;

export interface ICategory {
	id: string;
	name: string;
}

export interface IFrequency {
	id: string;
	name: string;
}