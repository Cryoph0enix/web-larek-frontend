export abstract class Component<T> {
	protected constructor(protected readonly element: HTMLElement) {}

	toggleClass(element: HTMLElement, className: string, condition?: boolean) {
		element.classList.toggle(className, condition);
	}

	disableButton(element: HTMLElement, enabled: boolean) {
		if (element) {
			if (enabled) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	protected setText(element: HTMLElement, content: unknown) {
		if (element) {
			element.textContent = String(content);
		}
	}

	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if(element) {
			element.src = src;
			if(alt) {
				element.alt = alt;
			}
		}
	}

	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.element;
	}
}