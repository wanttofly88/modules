define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var items = {}

	var _handleEvent = function(e) {
		if (e.type === 'inner-loader-add') {
			if (items.hasOwnProperty(e.id)) return;
			items[e.id] = {
				id: e.id,
				loading: false,
				done: false
			}
		}

		if (e.type === 'inner-loader-done') {
			if (!items.hasOwnProperty(e.id)) return;
			items[e.id].done = true;
			eventEmitter.dispatch();
		}

		if (e.type === 'inner-loader-remove') {
			if (!items.hasOwnProperty(e.id)) return;
			delete items[e.id];
		}

		if (e.type === 'inner-loader-start') {
			if (!items.hasOwnProperty(e.id)) return;
			if (items[e.id].loading || items[e.id].done) return;

			items[e.id].loading = true;
			eventEmitter.dispatch();
		}

		if (e.type === 'inner-loader-finish') {
			if (!items.hasOwnProperty(e.id)) return;
			if (!items[e.id].loading) return;

			items[e.id].loading = false;
			eventEmitter.dispatch();
		}


	}

	var _init = function() {
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
		initialized = true;
		_init();
	}

	return {
		eventEmitter: eventEmitter,
		getData: getData
	}
});