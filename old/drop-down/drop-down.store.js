define(['dispatcher'], function(dispatcher) {
	"use strict";

	var initialized = false;
	var items = {};

	var _handleEvent = function(e) {
		var item;
		if (e.type === 'drop-down-toggle') {
			if (!items.hasOwnProperty(e.id)) return;

			item = items[e.id];

			if (item.disabled) return;

			item.active = !item.active;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-activate') {
			if (!items.hasOwnProperty(e.id)) return;

			item = items[e.id];

			if (item.active === true) return;

			item.active = true;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-deactivate') {
			if (!items.hasOwnProperty(e.id)) return;

			item = items[e.id];

			if (item.active === false) return;

			item.active = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-disable') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].disabled === true) return;

			items[e.id].disabled = true;

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'drop-down-enable') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].disabled === false) return;

			items[e.id].disabled = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}
	}

	var _add = function(container) {
		var active = container.classList.contains('active');
		var id = container.getAttribute('data-id');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		items[id] = {
			container: container,
			disabled: false,
			active: active
		}
	}

	var _init = function() {
		var containers = document.querySelectorAll('.drop-down-container');

		items = {}

		for (var i = 0; i < containers.length; i++) {
			_add(containers[i]);
		}

		if (initialized) return;
		initialized = true;

		dispatcher.subscribe(_handleEvent);
	}

	var eventEmitter = function() {
		var _handlers = [];

		var dispatch = function(event) {
			for (var i = _handlers.length - 1; i >= 0; i--) {
				_handlers[i](event);
			}
		}
		var subscribe = function(handler) {
			_handlers.push(handler);
		}
		var unsubscribe = function(handler) {
			for (var i = 0; i <= _handlers.length - 1; i++) {
				if (_handlers[i] == handler) {
					_handlers.splice(i--, 1);
				}
			}
		}

		return {
			dispatch: dispatch,
			subscribe: subscribe,
			unsubscribe: unsubscribe
		}
	}();

	var getData = function() {
		return {
			items: items
		}
	}

	if (!initialized) {
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData
	}
});