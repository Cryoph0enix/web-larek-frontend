import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { ICardEventHandlers } from '../../types';

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
	protected _colorType = <Record<string, string>> {
		"софт-скил": "soft",
		"другое": "other",
		"дополнительное": "additional",
		"кнопка": "button",
		"хард-скил": "hard"
	}

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