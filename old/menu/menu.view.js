define(['dispatcher', 'menu/menu.store'], function(dispatcher, store) {

	"use strict";
	var view;

	var active = false;

	var _handleChange = function(storeData) {
		if (active === storeData.active) return;

		active = storeData.active;

		if (active) {
			view.classList.add('show-navigation');
		} else {
			view.classList.remove('show-navigation');
		}
	}

	var init = function() {
		var storeData;

		view = document.querySelector('.view-menu');
		if (!view) return;



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