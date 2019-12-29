import Configuration from './components/configuration';
import NoConfigurations from './components/no-configurations';
import Error from './components/error';
import {render} from './utils';
import {backend} from './backend';

const serverListElement = document.querySelector('.configure__server-list');
const graphicInputElement = document.querySelector('.js-graphic-input');
const diskInputElement = document.querySelector('.js-disk-input');
const memoryInputElement = document.querySelector('.js-memory-input');
const productSliderElement = document.querySelector('.js-product-slider');

const rangeSlider = noUiSlider.create(productSliderElement, {
	start: 6,
	connect: 'lower',
	snap: true,
	range: {
		'min': 2,
		'25%': 4,
		'50%': 6,
		'75%': 8,
		'max': 12
	},
	pips: {
		mode: 'values',
		values: [2, 6, 12],
		density: 500,
		format: {
			to: (value) => {
				return `${value} ядер`;
			}
		}
	}
});

const renderConfigurations = (configurations) => {
	serverListElement.innerHTML = '';

	const sortingConfigurations = configurations
		.filter((item) => {
			return item.cpu.cores === +rangeSlider.get().substring(0, 1);
		})
		.filter((item) => {
			return graphicInputElement.checked ? item.gpu : true;
		})
		.filter((item) => {
			return diskInputElement.checked ? item.disk.count > 1 : true;
		})
		.filter((item) => {
			return memoryInputElement.checked ? item.disk.type.toUpperCase() === 'SSD' : true;
		});

	if (sortingConfigurations.length === 0) {
		const noConfigurationsElement = new NoConfigurations().getElement();

		render(serverListElement, noConfigurationsElement);
	} else {
		sortingConfigurations.forEach((item) => {
			const configurationElement = new Configuration(item).getElement();

			render(serverListElement, configurationElement);
		});
	}
};

const onSuccess = (data) => {
	const configurations = JSON.parse(data);

	renderConfigurations(configurations);

	rangeSlider.on('change', () => {
		renderConfigurations(configurations);
	});

	graphicInputElement.addEventListener('change', () => {
		renderConfigurations(configurations);
	});

	diskInputElement.addEventListener('change', () => {
		renderConfigurations(configurations);
	});

	memoryInputElement.addEventListener('change', () => {
		renderConfigurations(configurations);
	});
};

const onError = () => {
	serverListElement.innerHTML = '';

	const errorElement = new Error().getElement();

	render(serverListElement, errorElement);
};

backend.load(onSuccess, onError);
