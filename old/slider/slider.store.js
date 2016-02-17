define(['dispatcher'], function(dispatcher) {
	"use strict";

	var sliders = [];
	var initialized = false;

	var _handleEvent = function(e) {
		var id;
		var slider;

		if (e.type === 'slider-change-next') {
			slider = getDataById(e.id);
			if (!slider) {
				console.warn('slider with id ' + e.id + ' is missing');
				return;
			}

			slider.index++;
			if (slider.continious) {
				if (slider.index > slider.total) slider.index = 0;
			} else {
				if (slider.index > slider.total) slider.index = slider.total;
			}
			

			eventEmitter.dispatch({
				type: 'change'
			});
		}
		if (e.type === 'slider-change-prev') {
			slider = getDataById(e.id);
			if (!slider) {
				console.warn('slider with id ' + e.id + ' is missing');
				return;
			}

			slider.index--;
			if (slider.continious) {
				if (slider.index < 0) slider.index = slider.total;
			} else {
				if (slider.index < 0) slider.index = 0;
			}
			

			eventEmitter.dispatch({
				type: 'change'
			});
		}
		if (e.type === 'slider-change-to') {
			slider = getDataById(e.id);
			if (!slider) {
				console.warn('slider with id ' + e.id + ' is missing');
				return;
			}

			if (slider.index !== e.index) {
				if (e.index > slider.total || e.index < 0) {
					console.warn('no slide width index ' + e.index + ' for slider width id ' + e.id);
					return
				}
				slider.index = e.index;

				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}
	}

	var _add = function(container) {
		var total;
		var index  = 0;
		var slides = container.querySelectorAll('.slide');
		var continious = container.getAttribute('data-continious');

		if (continious && continious === 'true') {
			continious = true;
		} else {
			continious = false;
		}

		total = slides.length - 1;

		sliders.push({
			id: container.id,
			total: total,
			index: index,
			slides: slides,
			continious: continious
		});
	}

	var _init = function() {
		var containers = document.querySelectorAll('.view-slider');
		if (!containers || !containers.length) return;

		for (var i = containers.length - 1; i >= 0; i--) {
			_add(containers[i]);
		}

		dispatcher.subscribe(_handleEvent);
	}

	var eventEmitter = function() {
		var _handlers = [];

		var dispatch = function(event) {
			for (var i = _handlers.length - 1; i >= 0; i--) {
				_handlers[i](event);
			}
		}
		var subscribe = function(handler) {
			_handlers.push(handler);
		}
		var unsubscribe = function(handler) {
			for (var i = 0; i <= _handlers.length - 1; i++) {
				if (_handlers[i] == handler) {
					_handlers.splice(i--, 1);
				}
			}
		}

		return {
			dispatch: dispatch,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		}
	}();

	var getData = function() {
		return sliders;
	}

	var getDataById = function(id) {
		for (var i = sliders.length - 1; i >= 0; i--) {
			if (sliders[i].id === id) return sliders[i];
		}

		return false;
	}

	if (!initialized) {
		initialized = true;
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData,
		getDataById: getDataById
	}
});