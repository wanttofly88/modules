define(['dispatcher'], function(dispatcher) {

	"use strict";

	var _handle = function(element) {

		element.addEventListener('focus', function() {
			element.parentNode.classList.remove('error');
			element.parentNode.classList.add('focus');
		}, false);
		element.addEventListener('blur', function() {
			element.parentNode.classList.remove('focus');
		}, false);

		element.addEventListener('keyup', function() {
			if (element.value) {
				element.parentNode.classList.add('not-empty');
			} else {
				element.parentNode.classList.remove('not-empty');
			}
		}, false);
	}

	var init = function() {
		var inputs = document.getElementsByTagName('input');
		var textareas = document.getElementsByTagName('textarea');

		for (var i = inputs.length - 1; i >= 0; i--) {
			_handle(inputs[i]);
		}
		for (var i = textareas.length - 1; i >= 0; i--) {
			_handle(textareas[i]);
		}
	}

	return {
		init: init
	}
});