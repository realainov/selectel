!function(root, factory) {
	typeof define === "function" && define.amd ? // AMD. Register as an anonymous module unless amdModuleId is set
		define([], function() {
			return root.svg4everybody = factory();
		}) : typeof module === "object" && module.exports ? // Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory() : root.svg4everybody = factory();
}(this, function() {
	/*! svg4everybody v2.1.9 | github.com/jonathantneal/svg4everybody */
	function embed(parent, svg, target) {
		// if the target exists
		if (target) {
			// create a document fragment to hold the contents of the target
			const fragment = document.createDocumentFragment(); const viewBox = !svg.hasAttribute("viewBox") && target.getAttribute("viewBox");
			// conditionally set the viewBox on the svg
			viewBox && svg.setAttribute("viewBox", viewBox);
			// copy the contents of the clone into the fragment
			for (// clone the target
				let clone = target.cloneNode(!0); clone.childNodes.length; ) {
				fragment.appendChild(clone.firstChild);
			}
			// append the fragment into the svg
			parent.appendChild(fragment);
		}
	}
	function loadreadystatechange(xhr) {
		// listen to changes in the request
		xhr.onreadystatechange = function() {
			// if the request is ready
			if (xhr.readyState === 4) {
				// get the cached html document
				let cachedDocument = xhr._cachedDocument;
				// ensure the cached html document based on the xhr response
				cachedDocument || (cachedDocument = xhr._cachedDocument = document.implementation.createHTMLDocument(""),
					cachedDocument.body.innerHTML = xhr.responseText, xhr._cachedTarget = {}), // clear the xhr embeds list and embed each item
					xhr._embeds.splice(0).map(function(item) {
						// get the cached target
						let target = xhr._cachedTarget[item.id];
						// ensure the cached target
						target || (target = xhr._cachedTarget[item.id] = cachedDocument.getElementById(item.id)),
							// embed the target into the svg
							embed(item.parent, item.svg, target);
					});
			}
		}, // test the ready state change immediately
			xhr.onreadystatechange();
	}
	function svg4everybody(rawopts) {
		function oninterval() {
			// while the index exists in the live <use> collection
			for (// get the cached <use> index
				let index = 0; index < uses.length; ) {
				// get the current <use>
				const use = uses[index]; const parent = use.parentNode; const svg = getSVGAncestor(parent); let src = use.getAttribute("xlink:href") || use.getAttribute("href");
				if (!src && opts.attributeName && (src = use.getAttribute(opts.attributeName)),
				svg && src) {
					if (polyfill) {
						if (!opts.validate || opts.validate(src, svg, use)) {
							// remove the <use> element
							parent.removeChild(use);
							// parse the src and get the url and id
							const srcSplit = src.split("#"); const url = srcSplit.shift(); const id = srcSplit.join("#");
							// if the link is external
							if (url.length) {
								// get the cached xhr request
								let xhr = requests[url];
								// ensure the xhr request exists
								xhr || (xhr = requests[url] = new XMLHttpRequest(), xhr.open("GET", url), xhr.send(),
									xhr._embeds = []), // add the svg and id as an item to the xhr embeds list
									xhr._embeds.push({
										parent,
										svg,
										id
									}), // prepare the xhr ready state change event
									loadreadystatechange(xhr);
							} else {
								// embed the local id into the svg
								embed(parent, svg, document.getElementById(id));
							}
						} else {
							// increase the index when the previous value was not "valid"
							++index, ++numberOfSvgUseElementsToBypass;
						}
					}
				} else {
					// increase the index when the previous value was not "valid"
					++index;
				}
			}
			// continue the interval
			(!uses.length || uses.length - numberOfSvgUseElementsToBypass > 0) && requestAnimationFrame(oninterval, 67);
		}
		let polyfill; var opts = Object(rawopts); const newerIEUA = /\bTrident\/[567]\b|\bMSIE (?:9|10)\.0\b/; const webkitUA = /\bAppleWebKit\/(\d+)\b/; const olderEdgeUA = /\bEdge\/12\.(\d+)\b/; const edgeUA = /\bEdge\/.(\d+)\b/; const inIframe = window.top !== window.self;
		polyfill = "polyfill" in opts ? opts.polyfill : newerIEUA.test(navigator.userAgent) || (navigator.userAgent.match(olderEdgeUA) || [])[1] < 10547 || (navigator.userAgent.match(webkitUA) || [])[1] < 537 || edgeUA.test(navigator.userAgent) && inIframe;
		// create xhr requests object
		var requests = {}; var requestAnimationFrame = window.requestAnimationFrame || setTimeout; var uses = document.getElementsByTagName("use"); var numberOfSvgUseElementsToBypass = 0;
		// conditionally start the interval if the polyfill is active
		polyfill && oninterval();
	}
	function getSVGAncestor(node) {
		for (var svg = node; svg.nodeName.toLowerCase() !== "svg" && (svg = svg.parentNode); ) {}
		return svg;
	}
	return svg4everybody;
});
