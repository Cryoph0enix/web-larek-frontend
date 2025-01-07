import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";

interface IOrderConfirmed {
	totalAmount: number;
}

interface IActionHandler {
	handleSuccess: () => void;
}

export class OrderConfirmed extends Component<IOrderConfirmed> {
	protected _totalAmount: HTMLElement;
	protected _closeButton: HTMLElement;

	constructor(element: HTMLElement, actions: IActionHandler) {
		super(element);
		this._closeButton = this.getElement('.order-success__close');
		this._totalAmount = this.getElement('.order-success__description');
		this.initializeCloseButton(actions);
	}

	private getElement(selector: string): HTMLElement {
		return ensureElement<HTMLElement>(selector, this.element);
	}

	private initializeCloseButton(actions: IActionHandler): void {
		if (actions?.handleSuccess) {
			this._closeButton.addEventListener('click', actions.handleSuccess);
		}
	}

	set totalAmount(value: string) {
		this._totalAmount.textContent = `Списано ${value} синапсов`;
	}
}