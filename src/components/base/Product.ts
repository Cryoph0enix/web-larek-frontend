import { Model } from './Model';
import { IProduct } from '../../types';

export class Product extends Model<IProduct> {
	id: string;
	title: string;
	description: string;
	category: string;
	image: string;
	price: number | null;
}