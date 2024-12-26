import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IMarketPlace {
	items: HTMLElement[]
}

export class MarketPlace extends Component<IMarketPlace> {
	protected _counter: HTMLElement;
	protected _items: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);
		this._counter = ensureElement<HTMLElement>('.header__basket-counter', element);
		this._items = ensureElement<HTMLElement>('.gallery', element);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', element);
		this._basket = ensureElement<HTMLElement>('.header__basket', element);
		this.setupBasketClickHandler();
	}

	private setupBasketClickHandler(): void {
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	set counter(value: number) {
		const displayValue = value < 0 ? 0 : value;
		this.setText(this._counter, String(displayValue));
	}

	set items(items: HTMLElement[]) {
		if (items.length > 0) {
			this._items.replaceChildren(...items);
		} else {
			this._items.innerHTML = '';
		}
	}

	set lockClass(value: boolean) {
		value
			? this._wrapper.classList.add('page__wrapper_locked')
			: this._wrapper.classList.remove('page__wrapper_locked');
	}
}