define(['dispatcher', 'slider/slider.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var checkItem = function(item) {
			var storeData = store.getDataById(item.id);
			var tmpVal;

			if (item.index !== storeData.index) {
				item.index = storeData.index;
				if (item.leadZero && item.index < 10) {
					tmpVal = '0' + (item.index + 1);
				} else {
					tmpVal = item.index;
				}

				item.curElement.innerHTML = tmpVal;
			}

			if (item.total !== storeData.total) {
				item.total = storeData.total;
				if (item.leadZero && item.total < 10) {
					tmpVal = '0' + (item.total + 1);
				} else {
					tmpVal = item.total;
				}

				item.totElement.innerHTML = tmpVal;
			}
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');
		var curElement = element.querySelector('.cur');
		var totElement = element.querySelector('.tot');
		var leadZero   = element.getAttribute('data-lead-zero');

		if (!id || !curElement || !totElement) return;

		if (!leadZero) {
			leadZero = false;
		} else if (leadZero === 'true') {
			leadZero = true;
		}

		items[id] = {
			id: id,
			leadZero: leadZero,
			container: element,
			curElement: curElement,
			totElement: totElement,
			index: false,
			total: false
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.view-slider-counter');
		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});