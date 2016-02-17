define(['dispatcher'], function(dispatcher) {

	"use strict";

	var _handleChange = function(storeData) {

	}

	var _handle = function(element) {
		var parent;

		var closest = function(element, toFind) {
			var element = element.parentNode;

			if (element.tagName.toUpperCase() === 'BODY') {
				return false;
			}
			if (element.classList.contains(toFind)) {
				return element;
			} else {
				return closest(element, toFind);
			}
		}

		parent = closest(element, 'view-hover-outer');
		if (!parent) return;

		element.addEventListener('mouseenter', function() {
			parent.classList.add('group-hover');
		}, false);
		element.addEventListener('mouseleave', function() {
			parent.classList.remove('group-hover');
		}, false);
	}

	var init = function() {
		var elements = document.querySelectorAll('.view-hover-inner');
		for (var i = elements.length - 1; i >= 0; i--) {
			_handle(elements[i]);
		}
	}

	return {
		init: init
	}
});