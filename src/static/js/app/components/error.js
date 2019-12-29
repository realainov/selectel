import {createElement} from '../utils';

const createTemplate = () => {
	return (
		`<li class='configure__server-item configure__server-item--error'>
			<span class='text text--light-black'>Ошибка соединения</span>
		</li>`
	);
};

export default class Error {
	constructor() {
		this._element = null;
	}

	getTemplate() {
		return createTemplate();
	}

	getElement() {
		if (!this._element) {
			this._element = createElement(this.getTemplate());
		}

		return this._element;
	}

	removeElement() {
		this._element = null;
	}
}
