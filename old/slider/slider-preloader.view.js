define(['dispatcher', 'slider/slider.store'], function(dispatcher, store) {

	"use strict";


	var items = {}

	var _handleChange = function() {

		var checkItem = function(item) {
			var id = item.id;
			var storeItem = store.getDataById(id);

			var checkInnerItem = function(i) {
				if (i < 0) {
					i = storeItem.total;
				}
				if (i > storeItem.total) {
					i = 0;
				}

				if (!item.innerItems[i] || !item.innerItems[i].src) return;

				item.innerItems[i].img.src = item.innerItems[i].src;
			}

			if (!storeItem) return;
			if (item.index === storeItem.index) return;

			item.index = storeItem.index;

			checkInnerItem(item.index);
			checkInnerItem(item.index + 1);
			checkInnerItem(item.index - 1);
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(container) {
		var current = 0;
		var id = container.id;

		var elements = container.querySelectorAll('.view-slider-preload');

		var innerItems = [];

		var addElement = function(element) {
			var preloader = element.querySelector('.preloader');
			var img = document.createElement('img');
			var dataElement = element.querySelector('.data-element');
			var src;

			img.className = 'hidden';
			element.appendChild(img);

			img.addEventListener('load', function() {
				img.classList.remove('hidden');
			}, false);

			if (!dataElement) {
				src = false;
			} else {
				src = dataElement.getAttribute('data-src');
				if (!src) {
					console.warn('data-src element is missing');
					return;
				}
			}

			innerItems.push({
				element: element,
				img: img,
				src: src,
				preloader: preloader
			});
		}

		for (var i = 0; i < elements.length; i++) {
			addElement(elements[i]);
		}

		items[id] = {
			id: id,
			index: false,
			container: container,
			innerItems: innerItems
		};
	}

	var init = function() {
		var containers = document.querySelectorAll('.view-slider');

		if (!containers || !containers.length) return;

		for (var i = containers.length - 1; i >= 0; i--) {
			_add(containers[i]);
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