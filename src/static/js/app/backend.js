const createXHR = (onLoad, onError) => {
	const XHR_STATUS_SUCCESS = 200;

	const xhr = new XMLHttpRequest();

	xhr.addEventListener('load', () => {
		if (xhr.status === XHR_STATUS_SUCCESS) {
			onLoad(xhr.response);
		} else {
			onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
		}
	});
	xhr.addEventListener('error', () => {
		onError('Произошла ошибка соединения');
	});
	xhr.addEventListener('timeout', () => {
		onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
	});

	return xhr;
};

export const backend = {
	load: (onLoad, onError) => {
		const URL = 'https://api.jsonbin.io/b/5df3c10a2c714135cda0bf0f/1';

		const XHR_TIMEOUT = 10000;

		const xhr = createXHR(onLoad, onError);

		xhr.open('GET', URL);

		xhr.timeout = XHR_TIMEOUT;

		xhr.send();
	}
};
