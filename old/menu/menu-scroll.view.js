define(['dispatcher', 'menu/menu.store', 'scroll/scroll.store'], function(dispatcher, store, scrollStore) {

	"use strict";
	var active = false;

	var _handleChange = function(storeData) {
		if (active === storeData.active) return;

		active = storeData.active;
	}

	var _handleScrollChange = function(scrollStoreData) {
		if (active) {
			dispatcher.dispatch({
				type: 'menu-close'
			});
		}
	}

	var init = function() {
		var storeData;
		var scrollStoreData;

		storeData = store.getData();
		_handleChange(storeData);

		store.eventEmitter.subscribe(function() {
			storeData = store.getData();
			_handleChange(storeData);
		});

		scrollStore.eventEmitter.subscribe(function() {
			scrollStoreData = scrollStore.getData();
			_handleScrollChange(scrollStoreData);
		});
	}

	return {
		init: init
	}
});