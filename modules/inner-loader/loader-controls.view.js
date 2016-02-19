define(['dispatcher', 'inner-loader/loader.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'inner-loader-controls-id-';
	var idNum  = 1;


	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var itemData;
			if (!storeData.items.hasOwnProperty(item.id)) {
				return;
			}

			itemData = storeData.items[item.id];

			if (itemData.loading === item.loading) return;
			item.loading = itemData.loading;

			if (item.loading) {
				item.element.classList.add('loading');
			} else {
				item.element.classList.add('loading-finished');
				setTimeout(function() {
					item.element.classList.remove('loading-finished');
					item.element.classList.remove('loading');
				}, 300);
			}
			if (itemData.done) {
				item.element.classList.add('hidden');
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _handleClick = function(item) {
		item.element.addEventListener('click', function(e) {
			if (item.loading) return;

			dispatcher.dispatch({
				type: 'inner-loader-start',
				id: item.id
			});
		});
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		items[id] = {
			id: id,
			loading: false,
			element: element
		}

		dispatcher.dispatch({
			type: 'inner-loader-add',
			id: id
		});

		_handleClick(items[id]);
	}

	var _remove = function(items, item) {
		dispatcher.dispatch({
			type: 'inner-loader-remove',
			id: item.id
		});

		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;

		var check = function(items, element) {
			var found = false;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					if (items[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(items, element);
			}
		}

		var backCheck = function(items, elements, item) {
			var element = item.element;
			var found   = false;

			for (var i = 0; i < elements.length; i++) {
				if (elements[i] === item.element) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(items, item);
			}
		}

		elements = document.getElementsByClassName('inner-loader-control');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
	}

	var init = function() {
		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});