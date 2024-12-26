export interface IProduct {
	id: string;
	name: string;
	details: string;
	category: string;
	imageUrl: string;
	cost: number | null;
}

export interface IApplicationState {
	productCatalog: IProduct[];
	selectedPreview: string;
	cartItems: string[];
	currentOrder: IOrder;
	totalAmount: string | number;
	isLoading: boolean;
}

export interface IProductsCollection  {
	items: IProduct[];
}

export interface IOrderDetails {
	paymentMethod?: string;
	deliveryAddress?: string;
	contactNumber?: string;
	emailAddress?: string;
	orderTotal?: string | number;
}

export interface IOrder extends IOrderDetails {
	items: string[];
}

export type OrderFormErrors  = Partial<Record<keyof IOrder, string>>;

export interface IOrderResponse {
	orderId: string;
}