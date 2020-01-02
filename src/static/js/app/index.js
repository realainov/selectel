import Configuration from './components/configuration';
import NoConfigurations from './components/no-configurations';
import Error from './components/error';
import {render} from './utils';
import {backend} from './backend';

const configureElement = document.querySelector('.configure');

if (configureElement !== null) {
	const serverListElement = configureElement.querySelector('.configure__server-list');
	const graphicInputElement = configureElement.querySelector('.js-graphic-input');
	const diskInputElement = configureElement.querySelector('.js-disk-input');
	const memoryInputElement = configureElement.querySelector('.js-memory-input');
	const productSliderElement = configureElement.querySelector('.js-product-slider');

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
				return item.cpu.cores * item.cpu.count === +rangeSlider.get();
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
}
