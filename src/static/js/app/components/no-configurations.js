import {createElement} from '../utils';

const createTemplate = () => {
	return (
		`<li class='configure__server-item configure__server-item--no-result'>
			<span class='text text--light-black'>Нет результатов</span>
		</li>`
	);
};

export default class NoConfigurations {
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
