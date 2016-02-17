define(['dispatcher'], function(dispatcher) {
	"use strict";

	var _handle = function(el) {
		el.addEventListener('click', function() {
			dispatcher.dispatch({
				type: 'popup-close-all'
			});
		}, false);
	}

	var init = function() {
		var storeData;

		var elements = document.querySelectorAll('.view-popup-close');
		for (var i = elements.length - 1; i >= 0; i--) {
			_handle(elements[i]);
		}
	}

	return {
		init: init
	}
});