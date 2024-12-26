import { createElement, ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { EventEmitter } from "../base/events";


interface IBasket {
	cartItems: HTMLElement[];
	totalAmount: number;
}

export class Basket extends Component<IBasket> {
	protected _basketList: HTMLElement;
	protected _totalAmount: HTMLElement;
	basketButton: HTMLElement;

	constructor(element: HTMLElement, protected events: EventEmitter) {
		super(element);

		this.initializeElements();
		this.addEventListeners();
		this.cartItems = [];
	}

	private initializeElements(): void {
		this._basketList = ensureElement<HTMLElement>('.basket__list', this.element);
		this._totalAmount = this.element.querySelector<HTMLElement>('.basket__price');
		this.basketButton = this.element.querySelector<HTMLButtonElement>('.basket__button');
	}

	private addEventListeners(): void {
		if (this.basketButton) {
			this.basketButton.addEventListener('click', this.handleOrderOpen.bind(this));
		}
	}

	private handleOrderOpen(): void {
		this.events.emit('order:open');
	}

	set cartItems(items: HTMLElement[]) {
		if (items.length > 0) {
			this._basketList.replaceChildren(...items);
		} else {
			const emptyMessage = createElement<HTMLParagraphElement>('p', {
				textContent: 'Корзина пуста'
			});
			this._basketList.replaceChildren(emptyMessage);
		}
	}

	set totalAmount(total: number) {
		this.setText(this._totalAmount, `${total} синапсов`);
	}
}