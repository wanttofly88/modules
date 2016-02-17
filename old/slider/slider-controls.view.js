define(['dispatcher', 'slider/slider.store'], function(dispatcher, store) {

	"use strict";
	var items = {};

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var storeData;
			var id = item.sliders[0];
			storeData = store.getDataById(id);

			if (item.active && storeData.index !== item.slide)  {
				item.active = false;
				item.element.classList.remove('active');
			}
			if (!item.active && storeData.index === item.slide)  {
				item.active = true;
				item.element.classList.add('active');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
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
		slide = parseInt(slide);

		items.push({
			element: element,
			sliders: sliders,
			slide: slide,
			active: false
		});
	}

	var _handle = function(item) {
		item.element.addEventListener('click', function() {
			for (var i = item.sliders.length - 1; i >= 0; i--) {
				dispatcher.dispatch({
					type: 'slider-change-to',
					id: item.sliders[i],
					index: item.slide
				});
			}
		}, false);
	}

	var init = function() {
		var storeData;

		var controls = document.querySelectorAll('.view-slider-control');
		for (var i = controls.length - 1; i >= 0; i--) {
			_add(controls[i]);
		}

		for (var i = items.length - 1; i >= 0; i--) {
			_handle(items[i]);
		}

		storeData = store.getData();
		_handleChange(storeData);

		store.eventEmitter.subscribe(function() {
			storeData = store.getData();
			_handleChange(storeData);
		});
	}

	return {
		init: init
	}
});