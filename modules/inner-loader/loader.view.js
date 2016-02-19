define(['dispatcher', 'inner-loader/loader.store', 'utils'], function(dispatcher, store, utils) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'inner-loader-container-id-';
	var idNum  = 1;

	var testDelay = 0;

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var itemData;

			var addElement = function(element) {
				element.classList.add('hidden');
				item.element.appendChild(element);

				setTimeout(function() {
					element.classList.remove('hidden');
				}, 100);
			}

			if (!storeData.items.hasOwnProperty(item.id)) {
				return;
			}

			itemData = storeData.items[item.id];

			if (itemData.loading === item.loading) return;
			item.loading = itemData.loading;


			if (item.loading) {
				item.element.classList.add('loading');

				utils.ajax.send(item.action, function(response) {
					var div = document.createElement('div');
					response = JSON.parse(response);

					setTimeout(function() {
						if (response.hasOwnProperty('status') && response.status === 'success') {
							div.innerHTML = response.response;

							for (var i = 0; i < div.childNodes.length; i++) {
								addElement(div.childNodes[i]);
							}

							if (response.hasOwnProperty('done') && response.done === 'true') {
								dispatcher.dispatch({
									type: 'inner-loader-done',
									id: item.id
								});
							}
						}
						dispatcher.dispatch({
							type: 'inner-loader-finish',
							id: item.id
						});
					}, testDelay);

				}, 'get', {p: item.page}, false);
			} else {
				item.element.classList.remove('loading');
			}

		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				checkItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var action = element.getAttribute('data-action');
		var page   = element.getAttribute('data-page');

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		if (page) {
			page = parseInt(page);
		} else {
			page = 0;
		}

		if (!action) {
			console.warn('data-action attribute is missing');
			return;
		}

		items[id] = {
			id: id,
			action: action,
			element: element,
			loading: false,
			page: page
		}

		dispatcher.dispatch({
			type: 'inner-loader-add',
			id: id
		});
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

		//-------
		elements = document.getElementsByClassName('inner-loader-container');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
		//-------
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