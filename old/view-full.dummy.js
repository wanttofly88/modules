define(['dispatcher', 'store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	//!!!replace!
	var idName = 'new-id-';
	var idNum  = 1;


	var _handleChange = function(storeData) {
		storeData = store.getData();
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
			element.setAttribute('data-id', id);
		}



		items[id] = {
			id: id,
			element: element
		}
	}

	var _remove = function(item) {
		delete items[item.id];
	}

	var _handleMutate = function() {
		var elements;

		var check = function(items, element) {
			var id = element.getAttribute('data-id');

			if (!id || !items.hasOwnProperty[id]) {
				_add(items, element);
			}
		}

		var backCheck = function(elements, item) {
			var element = item.element;
			var found   = false;

			var elId;

			for (var i = 0; i < elements.length; i++) {
				elId = elements[i].getAttribute('data-id');
				if (elId && items.hasOwnProperty(elId)) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(item);
			}
		}





		//-------
		elements = document.getElementsByClassName('className');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(elements, items[id]);
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