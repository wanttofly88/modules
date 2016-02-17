define(['dispatcher'], function(dispatcher) {

	"use strict";

	//global

	var initialized = false;
	var isTouchDevice = false;

	var _init = function() {
		isTouchDevice = 'ontouchstart' in document.documentElement;

		if (isTouchDevice) {
			document.body.classList.remove('hover');
			document.body.classList.add('touch');
		} else {
			document.body.classList.remove('touch');
			document.body.classList.add('hover');
		}
	}


	var getData = function() {
		return {
			isTouchDevice: isTouchDevice
		}
	}

	if (!initialized) {
		initialized = true;
		_init();
	}

	return {
		getData: getData
	}
});