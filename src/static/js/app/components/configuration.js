import {createElement, addSpacesIntoNumber} from '../utils';

const createTemplate = (server) => {
	const {name, ram} = server;
	let {disk, cpu, price, gpu} = server;

	disk = disk.count > 1 ? `${disk.count} x ${disk.value} ГБ ${disk.type}` : `${disk.value} ГБ ${disk.type}`;
	cpu = cpu.count > 1 ? `${cpu.count} x ${cpu.name}, ${cpu.cores === 2 || cpu.cores === 4 ? `${cpu.cores} ядра` : `${cpu.cores} ядер`}` : `${cpu.name}, ${cpu.cores === 2 || cpu.cores === 4 ? `${cpu.cores} ядра` : `${cpu.cores} ядер`}`;
	gpu = gpu !== undefined ? gpu : '';
	price = `${addSpacesIntoNumber(price / 100)} ₽/месяц`;

	return (
		`<li class='configure__server-item'>
			<span class='text text--light-black configure__name-text'>${name}</span>
			<span class='text text--light-black configure__cpu-text'>${cpu}</span>
			<span class='text text--light-black configure__ram-text'>${ram}</span>
			<span class='text text--light-black configure__disk-text'>${disk}</span>
			<span class='text text--light-black configure__gpu-text'>${gpu}</span>
			<div class='configure__server-wrapper'>
				<span class='text text--light-black configure__price-text'>${price}</span>
				<a class='button button--white button--sm configure__order-button' href='https://selectel.ru/' target='self'>Заказать</a>
			</div>
		</li>`
	);
};

export default class Configuration {
	constructor(server) {
		this._element = null;
		this._server = server;
	}

	getTemplate() {
		return createTemplate(this._server);
	}

	getElement() {
		if (!this._element) {
			this._element = createElement(this.getTemplate(this._server));
		}

		return this._element;
	}

	removeElement() {
		this._element = null;
	}
}
