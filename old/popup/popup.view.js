define(['dispatcher', 'popup/popup.store'], function(dispatcher, store) {
	"use strict";

	var items = {};
	var overlay;
	var body;
	var active = false;
	var pw;

	var _handleChange = function(storeData) {
		var el;

		var ww1 = document.documentElement.clientWidth;
		var ww2;
		var diff = 0;

		if (active === storeData.active) return;

		if (active) {
			if (items[active]) items[active].element.classList.remove('active');
			if (items[active] && items[active].inner) {
				items[active].inner.style.paddingRight = '0px';
			}
		} else {
			dispatcher.dispatch({
				type: 'overlay-show'
			});
			body.classList.add('prevent-scroll');

			ww2 = document.documentElement.clientWidth;
			diff = ww2 - ww1;
			if (diff < 0) diff = 0;
		}

		active = storeData.active;

		if (active) {
			if (items[active]) items[active].element.classList.add('active');
			if (items[active] && items[active].inner) {
				items[active].inner.style.paddingRight = diff + 'px';
			}
		} else {
			dispatcher.dispatch({
				type: 'overlay-hide'
			});
			body.classList.remove('prevent-scroll');
		}

		pw.style.marginRight = diff + 'px';
	}

	var _add = function(el) {
		var id = el.id;
		var inner = el.querySelector('.popup-inner');
		if (!id) {
			console.warn('popup id is missing');
			return;
		}

		if (el.classList.contains('active')) {
			active = id;
		}

		items[id] = {
			element: el,
			id: id,
			inner: inner
		};
	}

	var init = function() {
		var storeData;
		var popups = document.querySelectorAll('.popup');

		pw = document.querySelector('.page-wrapper');

		body = document.getElementsByTagName('body')[0];

		for (var i = popups.length - 1; i >= 0; i--) {
			_add(popups[i]);
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