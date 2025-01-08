import { ensureElement } from '../../utils/utils';
import { ProductCard } from './ProductCard';
import { ICardEventHandlers } from '../../types';

interface IProductPreview {
	text: string;
}

export class ProductPreview extends ProductCard<IProductPreview> {
	protected _text: HTMLElement;
	protected _button: HTMLElement;

	constructor(element: HTMLElement, eventHandlers?: ICardEventHandlers) {
		super(element, eventHandlers)
		this._button = element.querySelector(`.card__button`);
		this._text = ensureElement<HTMLElement>(`.card__text`, element);

		if (eventHandlers?.onClick && this._button) {
			element.removeEventListener('click', eventHandlers.onClick);
			this._button.addEventListener('click', eventHandlers.onClick);
		}
	}

	set text(value: string) {
		this.setText(this._text, value);
	}
}