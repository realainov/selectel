export const createElement = (template) => {
    const newElement = document.createElement(`div`);

    newElement.insertAdjacentHTML(`beforeend`, template);

    return newElement.firstChild;
};

export const render = (container, element) => {
    container.appendChild(element);
};

export const addSpacesIntoNumber = (number) => {
	const string = number.toString();

	return string.replace(/(\d{1,3}(?=(?:\d\d\d)+(?!\d)))/g, '$1 ');
};
