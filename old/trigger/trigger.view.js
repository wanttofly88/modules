define(['dispatcher', 'trigger/trigger.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			if (!storeData.items.hasOwnProperty(item.id)) return;
			if (item.triggered === storeData.items[item.id].triggered) return;

			item.triggered = storeData.items[item.id].triggered;

			if (item.triggered) {
				item.element.classList.add('triggered');
				item.element.classList.add('triggered-once');
			} else {
				item.element.classList.remove('triggered');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-trigger-id');

		items[id] = {
			id: id,
			element: element,
			triggered: false
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.triggerable');

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