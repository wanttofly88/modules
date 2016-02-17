define(['dispatcher'], function(dispatcher) {

	"use strict";

	//local

	var initialized = false;
	var items = {};

	var _handleEvent = function(e) {
		if (e.type === 'video-ready') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].status ='ready';

				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-play') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].status = 'play';
				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-stop') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].status = 'stop';
				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-backplay') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].status = 'backplaying';
				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-reset') {
			if (items.hasOwnProperty(e.id)) {
				items[e.id].status = 'not-ready';
				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-remove') {
			if (items.hasOwnProperty(e.id)) {
				delete items[e.id];
				eventEmitter.dispatch({
					type: 'change'
				});
			}
		}

		if (e.type === 'video-add') {
			_add(e.element);

			eventEmitter.dispatch({
				type: 'change'
			});
		}

		if (e.type === 'total-reset') {
			items = {}
			_init();
		}
	}

	var _add = function(video) {
		var id = video.id;
		if (!id) {
			console.warn('video id is missing');
			return;
		}

		items[id] = {
			id: id,
			status: 'not-ready'
		}
	}

	var _init = function() {
		var videos = document.getElementsByTagName('video');

		items = {};
		for (var i = videos.length - 1; i >= 0; i--) {
			_add(videos[i]);
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