import { ensureElement } from "../../utils/utils";
import { Component } from "./Component";
import { IEvents } from "./events";

interface IValidationState {
	isValid: boolean;
	validationErrors: string[];
}

export class Form<T> extends Component<IValidationState> {
	protected _submitButton: HTMLButtonElement;
	protected _validationErrors: HTMLElement;

	constructor(protected element: HTMLFormElement, protected events: IEvents) {
		super(element);

		this.initializeElements();
		this.addEventListeners();
	}

	private initializeElements(): void {
		this._submitButton = ensureElement<HTMLButtonElement>('button[type=submit]', this.element);
		this._validationErrors = ensureElement<HTMLElement>('.form__errors', this.element);
	}

	private addEventListeners(): void {
		this.element.addEventListener('input', this.handleInputChange.bind(this));
		this.element.addEventListener('submit', this.handleSubmit.bind(this));
	}

	private handleInputChange(evt: Event): void {
		const target = evt.target as HTMLInputElement;
		const field = target.name as keyof T;
		const value = target.value;
		this.handleFieldChange(field, value);
	}

	private handleSubmit(evt: Event): void {
		evt.preventDefault();
		this.events.emit(`${this.element.name}:submit`);
	}

	protected handleFieldChange(field: keyof T, value: string): void {
		if (field && value !== undefined) {
			this.events.emit(`${this.element.name}.${String(field)}:change`, {
				field,
				value
			});
		} else {
			console.warn('Некорректные данные для события изменения поля:', { field, value });
		}
	}

	set isValid(value: boolean) {
		this._submitButton.disabled = !value;
	}

	set validationErrors(value: string) {
		if (value) {
			this.setText(this._submitButton, value);
		} else {
			this.setText(this._submitButton, '');
		}
	}

	render(state: Partial<T> & IValidationState): HTMLElement {
		const {isValid, validationErrors, ...inputs} = state;
		super.render({isValid, validationErrors});
		Object.assign(this, inputs);
		return this.element;
	}
}