define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var lastId = 0;
	var items  = {};

	var _handleEvent = function(e) {
		if (e.type === 'element-trigger') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].triggered === true) return;

			items[e.id].triggered = true;

			eventEmitter.dispatch({
				type: 'change'
			});
		}
		if (e.type === 'element-untrigger') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].triggered === false) return;

			items[e.id].triggered = false;

			eventEmitter.dispatch({
				type: 'change'
			});
		}
	}

	var _add   = function(element) {
		var id;
		lastId = lastId + 1;
		id = 'id' + lastId;

		element.setAttribute('data-trigger-id', id);

		items[id] = {
			id: id,
			triggered: false
		}
	}

	var _init = function() {
		var elements = document.querySelectorAll('.triggerable');

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
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