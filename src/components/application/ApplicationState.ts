import { OrderFormErrors, IApplicationState, IOrder, IOrderDetails, IProduct } from "../../types";
import { Model } from "../base/Model";
import { Product } from "../base/Product";

export class ApplicationState extends Model<IApplicationState> {
	productCatalog: Product[];
	selectedPreview: string;
	cartItems: Product[] = [];
	currentOrder: IOrder = {
		address: '',
		payment: 'card',
		email: '',
		total: 0,
		phone: '',
		items: []
	};
	orderFormErrors: OrderFormErrors = {};

	emptyCart (): void {
		try {
			this.cartItems = [];
			this.currentOrder.items = [];
		} catch (error) {
			console.error('Ошибка при очистке корзины:', error);
		}
	}

	addItemToOrder(item: Product): void {
		try {
			if (!item || !item.id) {
				throw new Error('Неверный продукт для добавления в заказ.');
			}
			if (item.price !== null) {
				this.currentOrder.items.push(item.id);
			}
		} catch (error) {
			console.error('Ошибка при добавлении продукта в заказ:', error);
		}
	}

	removeItemFromOrder(item: Product): void {
		try {
			const index = this.currentOrder.items.indexOf(item.id);
			if (index >= 0) {
				this.currentOrder.items.splice(index, 1);
			} else {
				console.warn(`Продукт с ID ${item.id} не найден в заказе.`);
			}
		} catch (error) {
			console.error('Ошибка при удалении продукта из заказа:', error);
		}
	}

	updateCatalog(items: IProduct[]): void {
		try {
			this.productCatalog = items.map(item => new Product(item, this.events));
			this.notifyChanges('items:changed', { catalog: this.productCatalog });
			console.log('Каталог успешно обновлён.');
		} catch (error) {
			console.error('Ошибка при обновлении каталога:', error);
		}
	}

	updatePreview(item: Product): void {
		try {
			this.selectedPreview = item.id;
			this.notifyChanges('preview:changed', item);
		} catch (error) {
			console.error('Ошибка при установке предварительного просмотра:', error);
		}
	}

	addItemToCart(item: Product): void {
		try {
			this.cartItems.push(item);
		} catch (error) {
			console.error('Ошибка при добавлении продукта в корзину:', error);
		}
	}

	removeItemFromCart(item: Product): void {
		try {
			const index = this.cartItems.indexOf(item);
			if (index >= 0) {
				this.cartItems.splice(index, 1);
			} else {
				console.warn(`Продукт с ID ${item.id} не найден в корзине.`);
			}
		} catch (error) {
			console.error('Ошибка при удалении продукта из корзины:', error);
		}
	}

	get isBasketEmpty(): boolean {
		return this.cartItems.length === 0;
	}

	get basketItems(): Product[] {
		return this.cartItems;
	}

	set orderTotal(value: number) {
		try {
			this.currentOrder.total = value;
		} catch (error) {
			console.error('Ошибка при установке суммы заказа:', error);
		}
	}

	calculateTotal(): number {
		try {
			return this.currentOrder.items.reduce((total, itemId) => {
				const product = this.productCatalog.find(product => product.id === itemId);
				if (product) {
					return total + product.price;
				} else {
					console.warn(`Продукт с ID ${itemId} не найден в каталоге.`);
					return total; // Возвращаем текущую сумму, если продукт не найден
				}
			}, 0);
		} catch (error) {
			console.error('Ошибка при расчёте общей суммы заказа:', error);
			return 0; // Возвращаем 0 в случае ошибки
		}
	}

	updateOrderField(field: keyof IOrderDetails, value: string): void {
		try {
			this.currentOrder[field] = value;
			if (this.isOrderValid()) {
				this.events.emit('order:ready', this.currentOrder);
			} else {
				console.warn(`Заказ не валиден после обновления поля '${field}'.`);
			}
		} catch (error) {
			console.error('Ошибка при установке поля заказа:', error);
		}
	}

	updateContactsField(field: keyof IOrderDetails, value: string): void {
		try {
			this.currentOrder[field] = value;
			if (this.areContactsValid()) {
				this.events.emit('order:ready', this.currentOrder);
			} else {
				console.warn(`Контакты не валидны после обновления поля '${field}'.`);
			}
		} catch (error) {
			console.error('Ошибка при установке поля контактов:', error);
		}
	}

	isOrderValid(): boolean {
		const errors: typeof this.orderFormErrors = {};
		if (!this.currentOrder.address) {
			errors.address = 'Необходимо указать адрес.';
		}
		this.orderFormErrors = errors;
		this.events.emit('formErrors:change', this.orderFormErrors);
		return Object.keys(errors).length === 0;
	}

	areContactsValid(): boolean {
		const errors: typeof this.orderFormErrors = {};
		if (!this.currentOrder.email) {
			errors.email = 'Необходимо указать email.';
		}
		if (!this.currentOrder.phone) {
			errors.phone = 'Необходимо указать телефон.';
		}
		this.orderFormErrors = errors;
		this.events.emit('formErrors:change', this.orderFormErrors);
		return Object.keys(errors).length === 0;
	}
}