define(['dispatcher'], function(dispatcher) {

	"use strict";

	var initialized = false;
	var active = false;
	var disabled = false;

	var _handleEvent = function(e) {
		if (e.type === 'first-scroll-activale') {
			if (active) return;
			active = true;
			eventEmitter.dispatch();
		}

		if (e.type === 'first-scroll-deactivale') {
			if (!active) return;
			active = false;
			eventEmitter.dispatch();
		}

		if (e.type === 'first-scroll-disable') {
			disabled = true;
		}
		if (e.type === 'first-scroll-enable') {
			disabled = false;
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
			active: active,
			disabled: disabled
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