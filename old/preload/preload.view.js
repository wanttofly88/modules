define(['dispatcher', 'preload/preload.store'], function(dispatcher, store) {

	"use strict";

	var pageWrapper;
	var elements;
	var items = [];
	var total;
	var loaded = 0;
	var complete = false;

	var startTime;
	var minTimeout = 500;

	var _handleChange = function() {
		var storeData = store.getData();

		if (complete === storeData.complete) return;
		complete = storeData.complete;

		pageWrapper.classList.add('load-complete');
	}

	var _loaded = function() {
		var delay;
		var currTime;

		currTime = Date.now();
		delay = currTime - startTime + minTimeout;

		if (delay < 0) delay = 0;

		setTimeout(function() {
			dispatcher.dispatch({
				type: 'preload-complete'
			});
		}, delay);
	}

	var _handleLoad = function(element) {
		var count = function() {
			loaded++;
			if (loaded >= total) {
				_loaded();
			}
		}

		if (element.complete) {
			count();
		} else {
			element.addEventListener('load', function() {
				count();
			}, false);
			element.src = element.src; //ie fix
		}
	}

	var init = function() {
		pageWrapper = document.querySelector('.page-wrapper');
		elements = document.querySelectorAll('.wait-load');

		total = elements.length;

		startTime = Date.now();

		for (var i = 0; i < elements.length; i++) {
			_handleLoad(elements[i]);
		}

		if (total === 0) {
			_loaded();
		}

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});