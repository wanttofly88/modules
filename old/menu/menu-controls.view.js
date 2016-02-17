define(['dispatcher', 'menu/menu.store'], function(dispatcher, store) {

	"use strict";

	var toggleControls;

	var _handleChange = function(storeData) {
		if (storeData.active) {
			for (var i = toggleControls.length - 1; i >= 0; i--) {
				toggleControls[i].classList.add('active');
			}
		} else {
			for (var i = toggleControls.length - 1; i >= 0; i--) {
				toggleControls[i].classList.remove('active');
			}
		}
	}

	var _handleToggle = function(element) {
		element.addEventListener('click', function() {
			dispatcher.dispatch({
				type: 'menu-toggle'
			});
		}, false);
	}

	var init = function() {
		var storeData;

		toggleControls = document.querySelectorAll('.view-menu-toggle');
		for (var i = toggleControls.length - 1; i >= 0; i--) {
			_handleToggle(toggleControls[i]);
		}

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