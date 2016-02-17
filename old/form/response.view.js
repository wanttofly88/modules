define(['dispatcher', 'popup/popup.store'], function(dispatcher, popupStore) {

	"use strict";

	var items = {}

	var _handlePopupChange = function() {
		var resetState = function(item) {
			item.element.classList.remove('active');
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				resetState(items[id]);
			}
		}
	}

	var _handleChange = function(e) {
		var id;
		if (e.type === 'ajax-form-submit') {
			if (e.response.hasOwnProperty('response') && e.response.response !== '') {
				if (!items.hasOwnProperty(e.id)) return;

				if (e.response.status === 'success') {
					items[e.id].element.innerHTML = e.response.response;
					items[e.id].element.classList.remove('status-error');
					items[e.id].element.classList.add('status-success');
					items[e.id].element.classList.add('active');
				}

				if (e.response.status === 'error') {
					items[e.id].element.innerHTML = e.response.response;
					items[e.id].element.classList.add('status-error');
					items[e.id].element.classList.remove('status-success');
					items[e.id].element.classList.add('active');
				}
			} else {
				if (!items.hasOwnProperty(e.id)) return;
				items[e.id].element.innerHTML = '';
				items[e.id].element.classList.remove('active');
			}
		}

		if (e.type === 'ajax-form-reset') {
			if (!items.hasOwnProperty(e.id)) return;
			items[e.id].element.innerHTML = '';
			items[e.id].element.classList.remove('active');
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');
		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		items[id] = {
			id: id,
			element: element
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.view-form-response');

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		dispatcher.subscribe(_handleChange);
		popupStore.eventEmitter.subscribe(_handlePopupChange);
	}

	return {
		init: init
	}
});