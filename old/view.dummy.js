define(['dispatcher', 'store'], function(dispatcher, store) {

	"use strict";

	var _handleChange = function(storeData) {

	}

	var init = function() {
		var storeData;

		storeData = store.getData();
		_handleChange(storeData);

		store.eventEmitter.subscribe(function() {
			storeData = store.getData();
			_handleChange(storeData);
		});
	}

	return {
		init: init
	}
});