import { Component } from '../base/Component';
import { ICardEventHandlers } from '../../types';
import { ensureElement } from '../../utils/utils';

interface IProductsBasket {
	name: string;
	cost: number;
	index: number;
}

export class ProductsBasket extends Component<IProductsBasket> {
	protected _name: HTMLElement;
	protected _cost: HTMLElement;
	protected _button: HTMLElement;
	protected _index: HTMLElement;

	constructor(element: HTMLElement, eventHandlers?: ICardEventHandlers) {
		super(element);
		this._name = ensureElement<HTMLElement>(`.card__title`, element);
		this._cost = ensureElement<HTMLElement>(`.card__price`, element);
		this._index = ensureElement<HTMLElement>(`.basket__item-index`, element);
		this._button = element.querySelector(`.card__button`);
		if (eventHandlers?.onClick && this._button) {
			element.removeEventListener('click', eventHandlers.onClick);
			this._button.addEventListener('click', eventHandlers.onClick);
		}
	}

	set index(value: number) {
		this.setText(this._index, value);
	}

	set name(value: string) {
		this.setText(this._name, value);
	}

	set cost(value: string | null) {
		const displayValue = value === null ? 'Бесценно' : `${value} синапсов`;
		this.setText(this._cost, displayValue);
	}
}