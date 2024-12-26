import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface ICardEventHandlers {
	onClick: (event: MouseEvent) => void;
	onDoubleClick?: (event: MouseEvent) => void;
}

interface IProductCard {
	name: string;
	category: string;
	imageUrl: string;
	cost: number;
	text: string;
}

export class ProductCard<T> extends Component<IProductCard> {
	protected _name: HTMLElement;
	protected _category: HTMLElement;
	protected _imageUrl: HTMLImageElement;
	protected _cost: HTMLElement;
	protected _colorType: Record<string, string> = {
		"софт-скил": "soft",
		"другое": "other",
		"дополнительное": "additional",
		"кнопка": "button",
		"хард-скил": "hard"
	};

	constructor(element: HTMLElement, eventHandlers?: ICardEventHandlers) {
		super(element);
		this._name = ensureElement<HTMLElement>(`.card__title`, element);
		this._category = ensureElement<HTMLElement>(`.card__category`, element);
		this._imageUrl = ensureElement<HTMLImageElement>(`.card__image`, element);
		this._cost = ensureElement<HTMLElement>(`.card__price`, element);


		if (eventHandlers?.onClick) {
			element.addEventListener('click', eventHandlers.onClick);
		}
	}

	set name(value: string) {
		try {
			this.setText(this._name, value);
		} catch (error) {
			console.error('Ошибка при установке имени:', error);
		}
	}

	set category(value: string) {
		try {
			this.setText(this._category, value);
			const colorClass = this._colorType[value];
			if (colorClass) {
				this._category.className = `card__category card__category_${colorClass}`;
			} else {
				console.warn(`Цвет для категории '${value}' не найден.`);
			}
		} catch (error) {
			console.error('Ошибка при установке категории:', error);
		}
	}

	set imageUrl(value: string) {
		try {
			this.setImage(this._imageUrl, value, this.name);
		} catch (error) {
			console.error('Ошибка при установке URL изображения:', error);
		}
	}

	set cost(value: string | null) {
		try {
			this.setText(this._cost, value === null ? 'Бесценно' : `${value} синапсов`);
		} catch (error) {
			console.error('Ошибка при установке стоимости:', error);
		}
	}
}

interface IProductPreview {
	text: string;
}

export class ProductPreview extends ProductCard<IProductPreview> {
	protected _text: HTMLElement;
	protected _button: HTMLElement;

	constructor(element: HTMLElement, eventHandlers?: ICardEventHandlers) {
		super(element, eventHandlers);

		this._button = element.querySelector('.card__button');
		this._text = ensureElement<HTMLElement>('.card__text', element);

		if (eventHandlers?.onClick && this._button) {
			element.removeEventListener('click', eventHandlers.onClick);
			this._button.addEventListener('click', eventHandlers.onClick);
		}
	}

	set text(value: string) {
		this.setText(this._text, value);
	}
}

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
		this._name = ensureElement<HTMLElement>('.card__title', element);
		this._cost = ensureElement<HTMLElement>('.card__price', element);
		this._index = ensureElement<HTMLElement>('.basket__item-index', element);
		this._button = element.querySelector('.card__button');
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