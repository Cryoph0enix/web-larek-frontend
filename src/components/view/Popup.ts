import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";

interface IPopup {
	popupContent: HTMLElement;
}

export class Popup extends Component<IPopup> {
	protected _closeButton: HTMLButtonElement;
	protected _popupContent: HTMLElement;

	constructor(element: HTMLElement, protected events: IEvents) {
		super(element);

		this.initializeElements(element);
		this.addEventListeners();
	}

	private initializeElements(element: HTMLElement): void {
		this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', element);
		this._popupContent = ensureElement<HTMLElement>('.modal__content', element);
	}

	private addEventListeners(): void {
		this._closeButton.addEventListener('click', this.closeModal.bind(this));
		this.element.addEventListener('click', this.closeModal.bind(this));
		this._popupContent.addEventListener('click', (event) => event.stopPropagation());
	}

	set popupContent(value: HTMLElement) {
		if (value instanceof HTMLElement) {
			this._popupContent.replaceChildren(value);
		} else {
			console.warn('Переданное значение не является HTMLElement.');
		}
	}

	openModal(): void {
		try {
			this.element.classList.add('modal_active');
			this.events.emit('modal:open');
		} catch (error) {
			console.error('Ошибка при открытии модального окна:', error);
		}
	}

	closeModal(): void {
		try {
			this.element.classList.remove('modal_active');
			this.popupContent = null;
			this.events.emit('modal:close');
		} catch (error) {
			console.error('Ошибка при закрытии модального окна:', error);
		}
	}

	render(data: IPopup): HTMLElement {
		try {
			super.render(data);
			this.openModal();
			return this.element;
		} catch (error) {
			console.error('Ошибка при рендеринге модального окна:', error);
		}
	}
}