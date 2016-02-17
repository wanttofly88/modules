define(['dispatcher', 'popup/popup.store'], function(dispatcher, store) {
	"use strict";

	var items = {};
	var active = false;

	var _handleChange = function(storeData) {
		if (active === storeData.active) return;

		if (active) {
			items[active].classList.remove('active');
		}

		active = storeData.active;
		if (active) {
			items[active].classList.add('active');
		}	
	}

	var _add = function(el) {
		var id = el.getAttribute('data-popup');
		if (!id) {
			console.warn('data-popup attribute is missing');
			return;
		}

		if (el.classList.contains('active')) {
			active = id;
		}

		el.addEventListener('click', function() {
			dispatcher.dispatch({
				type: 'popup-toggle',
				id: id
			});
		}, false);

		items[id] = el;
	}

	var init = function() {
		var storeData;
		var toggleControls = document.querySelectorAll('.view-popup-toggle');
		// if (!controls || !controls.length) return;

		for (var i = toggleControls.length - 1; i >= 0; i--) {
			_add(toggleControls[i]);
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