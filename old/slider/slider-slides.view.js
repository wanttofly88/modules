define(['dispatcher', 'slider/slider.store'], function(dispatcher, sliderStore) {

	"use strict";

	var items = [];

	var _handleChange = function(storeData) {

		var sheckItem = function(item) {
			var id = item.id;
			var storeData = sliderStore.getDataById(id);

			var setClass = function() {

			}

			if (!storeData) {
				console.warn('slider with id ' + id + ' is missing');
				return;
			}

			if (item.current === storeData.index) return;
			item.current = storeData.index;

			for (var i = 0; i < item.slides.length; i++) {
				if (i < item.current) {
					item.slides[i].classList.remove('to-right');
					item.slides[i].classList.remove('to-center');
					item.slides[i].classList.add('to-left');
				}
				if (i === item.current) {
					item.slides[i].classList.remove('to-right');
					item.slides[i].classList.add('to-center');
					item.slides[i].classList.remove('to-left');
				}
				if (i > item.current) {
					item.slides[i].classList.add('to-right');
					item.slides[i].classList.remove('to-center');
					item.slides[i].classList.remove('to-left');
				}
			}
		}
		

		for (var i = 0; i < items.length; i++) {
			sheckItem(items[i]);
		}
	}

	var _add = function(container) {
		var slides = container.getElementsByClassName('slide');
		var currentSlide = false;
		var id = container.id;

		items.push({
			id: id,
			current: currentSlide,
			slides: slides
		});
	}

	var _restart = function() {
		var containers = document.querySelectorAll('.view-slider');
		items = [];
		if (!containers || !containers.length) return;
		for (var i = containers.length - 1; i >= 0; i--) {
			_add(containers[i]);
		}
		_handleChange();
	}

	var init = function() {
		var containers = document.querySelectorAll('.view-slider');

		for (var i = containers.length - 1; i >= 0; i--) {
			_add(containers[i]);
		}

		_handleChange();

		sliderStore.eventEmitter.subscribe(function() {
			_handleChange();
		});

		dispatcher.subscribe(function(e) {
			if (e.type === 'total-reset') {
				setTimeout(_restart, 17);
			};
		});
	}

	return {
		init: init
	}
});