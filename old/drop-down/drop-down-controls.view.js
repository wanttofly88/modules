define(['dispatcher', 'drop-down/drop-down.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var storeData = store.getData();

		var _checkItem = function(item) {
			var id = item.id;

			// if (item.active === storeData.items[id].active) return;

			item.active = storeData.items[id].active;

			if (item.active) {
				item.element.classList.add('active');
			} else {
				item.element.classList.remove('active');
			}

			if (storeData.items[id].disabled) {
				item.element.classList.add('hidden');
			} else {
				item.element.classList.remove('hidden');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				_checkItem(items[id]);
			}
		}
	}

	var _add = function(element) {
		var id     = element.getAttribute('data-id');
		var active = element.classList.contains('active');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		element.addEventListener('click', function() {
			dispatcher.dispatch({
				type: 'drop-down-toggle',
				me:   'drop-down-controls',
				id:   id
			});
		}, false);

		items[id] = {
			id: id,
			element: element,
			active: active
		}
	}

	var init = function() {
		var controls = document.querySelectorAll('.drop-down-control');
		for (var i = 0; i < controls.length; i++) {
			_add(controls[i]);
		}

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});