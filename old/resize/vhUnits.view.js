define(['dispatcher', 'resize/resize.store'], function(dispatcher, store) {
	"use strict";

	var items = [];

	//local

	var _handleChange = function(storeData) {
		var wh = storeData.height;
		// var evt;

		var checkItem = function(item) {
			item.element.style.height = wh + 'px';
		}

		for (var i = items.length - 1; i >= 0; i--) {
			checkItem(items[i]);
		}

		dispatcher.dispatch({
			type: 'fire-resize',
			me: 'vhUnits.view'
		});

		// evt = document.createEvent('UIEvents');
		// evt.initUIEvent('resize', true, false, window, 0);
		// window.dispatchEvent(evt);
	}

	var _add = function(element) {
		items.push({
			element: element
		});
	}

	var _reset = function() {
		var storeData;
		var elements;

		if (Modernizr.cssvhunit) return;

		items = [];

		elements = document.getElementsByClassName('vh-height');
		for (var i = elements.length - 1; i >= 0; i--) {
			_add(elements[i]);
		}

		storeData = store.getData();
		_handleChange(storeData);
	}

	var init = function() {
		var storeData;
		var elements;

		if (Modernizr.cssvhunit) return;

		elements = document.getElementsByClassName('vh-height');
		for (var i = elements.length - 1; i >= 0; i--) {
			_add(elements[i]);
		}

		storeData = store.getData();
		_handleChange(storeData);

		store.eventEmitter.subscribe(function() {
			storeData = store.getData();
			_handleChange(storeData);
		});

		dispatcher.subscribe(function(e) {
			if (e.type === 'total-reset') {
				setTimeout(_reset, 0);
			}
		});
	}

	return {
		init: init
	}
});