import { IOrderDetails } from "../../types";
import { ensureAllElements } from "../../utils/utils";
import { IEvents } from "../base/events";
import { Form } from "../base/Form";


export class Order extends Form<IOrderDetails> {
	protected _flatButtons: HTMLButtonElement[];

	constructor(element: HTMLFormElement, events: IEvents) {
		super(element, events);
		this._flatButtons = ensureAllElements<HTMLButtonElement>('.button_alt', element);
		this._flatButtons.forEach(button => {
			button.addEventListener('click', this.handleButtonClick.bind(this, button));
		});
	}

	private handleButtonClick(button: HTMLButtonElement): void {
		this.paymentMethod = button.name;
		this.events.emit('payment:change', button);
	}

	set paymentMethod(name: string) {
		this._flatButtons.forEach(button => {
			const isActive = button.name === name;
			this.toggleClass(button, 'button_alt-active', isActive);
		});
	}

	set deliveryAddress(value: string) {
		(this.element.elements.namedItem('address') as HTMLInputElement).value = value;
	}
}

export class ContactInformation extends Form<IOrderDetails> {
	constructor(element: HTMLFormElement, events: IEvents) {
		super(element, events);
	}
	set contactNumber(value: string) {
		(this.element.elements.namedItem('phone') as HTMLInputElement).value = value;
	}
	set emailAddress(value: string) {
		(this.element.elements.namedItem('email') as HTMLInputElement).value = value;
	}
}