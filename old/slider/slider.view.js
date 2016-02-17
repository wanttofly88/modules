define(['dispatcher', 'swipe', 'slider/slider.store'], function (dispatcher, swipe, sliderStore) {
	"use strict";

	var sliders = [];

	var _handleChange = function() {
		var _checkItem = function(item) {
			var storeData = sliderStore.getDataById(item.id);
			var classToSet = false;

			if (!storeData) {
				console.warn('error. no data in store for slider with id ' + item.id);
				return;
			}

			if (!item.initialized) {
				item.initialized = true;
				if (storeData.index !== item.current) {
					item.current = storeData.index;
					item.slider.slide(item.current, 0);
				}
			}

			if (storeData.index === item.current) return;

			item.current = storeData.index;
			item.slider.slide(item.current, item.speed);

			if (item.bind) {
				dispatcher.dispatch({
					type: 'slider-change-to',
					id: item.bind,
					index: item.current
				});
			}
		}

		for (var i = sliders.length - 1; i >= 0; i--) {
			_checkItem(sliders[i]);
		}
	}

	var _add = function(container) {
		var current = 0;
		var speed = container.getAttribute('data-speed');
		var slider;
		var id = container.id;
		var updateQuery = container.classList.contains('update-query');
		var updateClass = container.classList.contains('update-class');
		var continious  = container.getAttribute('data-continious');

		var bind = container.getAttribute('data-slider-bind') || false;

		if (continious && continious === 'true') {
			continious = true;
		} else {
			continious = false;
		}

		if (!speed) {
			speed = 700;
		} else {
			speed = parseInt(speed);
		}

		slider = new swipe.Swipe(container, {
			speed: speed,
			startSlide: current,
			continious: continious,
			callback: function(index, el) {
				dispatcher.dispatch({
					type: 'slider-change-to',
					id: id,
					index: index
				});
			}
		});

		container.parentNode.classList.add('slider-initialized');

		if (current > 0) {
			slider.slide(current, 0);

			dispatcher.dispatch({
				type: 'slider-change-to',
				id: id,
				index: current
			});
		}

		sliders.push({
			initialized: false,
			current: current,
			slider: slider,
			id: container.id,
			speed: speed,
			updateQuery: updateQuery,
			bind: bind
		});
	}

	var init = function() {
		var containers = document.querySelectorAll('.view-slider');

		if (!containers || !containers.length) return;

		for (var i = containers.length - 1; i >= 0; i--) {
			_add(containers[i]);
		}

		_handleChange();

		sliderStore.eventEmitter.subscribe(function() {
			_handleChange();
		});
	}

	return {
		init: init
	}
});