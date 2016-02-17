define(['dispatcher', 'trigger/trigger.store', 'preload/preload.store'], function(dispatcher, store, preloadStore) {

	"use strict";

	var items = {}
	var preloadComplete = false;

	var _handlePreload = function() {
		var handle = function(item) {
			setTimeout(function() {
				dispatcher.dispatch({
					type: 'element-trigger',
					me: 'timer-trigger',
					id: item.id
				});
			}, item.timeout);
		}

		var storeData = preloadStore.getData();
		if (preloadComplete) return;

		if (storeData.complete === true) {
			preloadComplete = true;

			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					handle(items[id]);
				}
			}
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-trigger-id');
		var timeout = element.getAttribute('data-timer');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		if (!timeout) {
			timeout = 1000;
		} else {
			timeout = parseInt(timeout);
		}

		items[id] = {
			id: id,
			element: element,
			timeout: timeout
		}
	}


	var init = function() {
		var elements = document.querySelectorAll('.timer-trigger');

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		_handlePreload();
		preloadStore.eventEmitter.subscribe(_handlePreload);
	}

	return {
		init: init
	}
});