import { IEvents } from './events';

export abstract class Model<T> {
	constructor(data: Partial<T>, protected events: IEvents) {
		Object.assign(this, data);
	}

	notifyChanges(event: string, params?: object) {
		this.events.emit(event, params ?? {});
	}
}