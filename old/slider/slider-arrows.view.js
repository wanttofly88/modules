define(['dispatcher', 'slider/slider.store'], function(dispatcher, store) {

	"use strict";

	var items = [];

	var _handleChange = function() {
		var checkItem = function(item) {
			var id;
			var storeData;
			// if (item.sliders.length !== 1) return;

			id = item.sliders[0];
			storeData = store.getDataById(id);

			if (!storeData) {
				return;
			}

			if (!item.hidden && item.slide === 'prev' && storeData.index === 0) {
				item.hidden = true;
				item.element.classList.add('hidden');
			} else if (item.hidden && item.slide === 'prev' && storeData.index !== 0) {
				item.hidden = false;
				item.element.classList.remove('hidden');
			}

			if (!item.hidden && item.slide === 'next' && storeData.index === storeData.total) {
				item.hidden = true;
				item.element.classList.add('hidden');
			} else if (item.hidden && item.slide === 'next' && storeData.index !== storeData.total) {
				item.hidden = false;
				item.element.classList.remove('hidden');
			}
		}

		for (var i = items.length - 1; i >= 0; i--) {
			checkItem(items[i]);
		}
	}

	var _add = function(element) {
		var sliderString = element.getAttribute('data-sliders');
		var sliders;
		var slide = element.getAttribute('data-slide');

		if (!sliderString) {
			console.warn('data-sliders attribute is missing');
			return;
		}

		if (!slide) {
			console.warn('data-slide attribute is missing');
			return;
		}

		sliders = sliderString.split('||');

		items.push({
			element: element,
			sliders: sliders,
			slide: slide,
			hidden: false
		});
	}

	var _handle = function(item) {
		item.element.addEventListener('click', function() {
			for (var i = item.sliders.length - 1; i >= 0; i--) {
				dispatcher.dispatch({
					type: 'slider-change-' + item.slide,
					id: item.sliders[i]
				});
			}
		}, false);
	}

	var init = function() {
		var elements = document.querySelectorAll('.view-slider-arrow');

		for (var i = elements.length - 1; i >= 0; i--) {
			_add(elements[i]);
		}

		for (var i = items.length - 1; i >= 0; i--) {
			_handle(items[i]);
		}

		_handleChange();

		store.eventEmitter.subscribe(function() {
			_handleChange();
		});
	}

	return {
		init: init
	}
});