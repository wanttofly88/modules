define(['dispatcher', 'first-scroll/first-scroll.store', 'scroll/scroll.store'], function(dispatcher, store, scrollStore) {

	"use strict";

	var reverseScrolling;
	var active = 'none';
	var blockUserActions = true;
	var keys = [32, 37, 38, 39, 40];
	var to;
	var body;
	var home;
	var touchCurrent = false;
	var idName = 'fs-btn';
	var idNum  = 0;
	var items  = {}

	var _handleChange = function() {
		var storeData = store.getData();

		if (!home) return;

		var activate = function() {
			clearTimeout(to);
			to = setTimeout(function() {
				blockUserActions = false;
			}, 1000);
			body.classList.remove('first-scroll');
		}
		var deactivate = function() {
			clearTimeout(to);
			blockUserActions = true;
			body.classList.add('first-scroll');
		}

		if (storeData.active === active) return;
		active = storeData.active;

		if (active) {
			activate();
		} else {
			deactivate();
		}
	}

	var _handleWheel = function(e) {
		var delta = e.deltaY || e.detail || e.wheelDelta;
		var scrolled = scrollStore.getData().top;

		if (reverseScrolling) delta = -delta;

		if (delta > 0) {
			if (blockUserActions) {
				e.preventDefault();
			}

			if (!active) {
				dispatcher.dispatch({
					type: 'first-scroll-activale'
				});
			}
		}
		if (delta < 0 && scrolled <= 0) {
			if (blockUserActions) {
				e.preventDefault();
			}
			if (active) {
				dispatcher.dispatch({
					type: 'first-scroll-deactivale'
				});
			}
		}
	}

	var _handleKey = function(e) {
		for (var i = keys.length; i--;) {
			if (e.keyCode === keys[i]) {
				if (blockUserActions) {
					e.preventDefault();
				}

				if (!active) {
					dispatcher.dispatch({
						type: 'first-scroll-activale'
					});
				}
			}
		}
	}

	var _handleTouch = function(e) {
		var delta = 0;
		var scrolled = scrollStore.getData().top;

		if (touchCurrent) {
			delta = e.touches[0].clientY - touchCurrent.clientY;
		}

		if (blockUserActions) {
			if (delta < 0) {
				e.preventDefault();
			}
		}

		if (touchCurrent) {
			if (delta < 0) {				
				if (!active) {
					touchCurrent = false;
					dispatcher.dispatch({
						type: 'first-scroll-activale'
					});
				}
			} else if (delta > 0) {
				if (active && scrolled <= 0) {
					touchCurrent = false;
					dispatcher.dispatch({
						type: 'first-scroll-deactivale'
					});
				}
			}
		}

		touchCurrent = e.touches[0];
	}

	var _handleBtn = function(element) {
		if (!active) {
			dispatcher.dispatch({
				type: 'first-scroll-activale'
			});
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			id = idName + idNum;
			idNum++;
		}

		element.addEventListener('click', _handleBtn);
	}

	var _remove = function(items, item) {
		delete items[item.id];
	}

	var _setupHandlers = function() {
		dispatcher.dispatch({
			type: 'first-scroll-deactivale'
		});
		window.addEventListener('mousewheel', _handleWheel);
		document.addEventListener('mousewheel', _handleWheel);
		document.addEventListener('DOMMouseScroll', _handleWheel);
		document.addEventListener('keydown', _handleKey);
		document.addEventListener('touchmove', _handleTouch);
	}

	var _removeHandlers = function() {
		dispatcher.dispatch({
			type: 'first-scroll-activale'
		});
		window.removeEventListener('mousewheel', _handleWheel);
		document.removeEventListener('mousewheel', _handleWheel);
		document.removeEventListener('DOMMouseScroll', _handleWheel);
		document.removeEventListener('keydown', _handleKey);
		document.removeEventListener('touchmove', _handleTouch);
	}

	var _handleMutate = function() {
		var elements;

		var check = function(items, element) {
			var found = false;
			for (var id in items) {
				if (items.hasOwnProperty(id)) {
					if (items[id].element === element) {
						found = true;
						break;
					}
				}
			}
			if (!found) {
				_add(items, element);
			}
		}

		var backCheck = function(items, elements, item) {
			var element = item.element;
			var found   = false;

			for (var i = 0; i < elements.length; i++) {
				if (elements[i] === item.element) {
					found = true;
					break;
				}
			}

			if (!found) {
				_remove(items, item);
			}
		}


		elements = document.getElementsByClassName('first-scroll-link');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}


		window.scrollTo(0, 0);
		home = document.getElementsByClassName('view-slide-scroll')[0];
		if (home) {
			dispatcher.dispatch({
				type: 'first-scroll-enable'
			});
			_setupHandlers();
		} else {
			dispatcher.dispatch({
				type: 'first-scroll-disable'
			});
			_removeHandlers();
		}
	}

	var init = function() {
		if (navigator.userAgent.indexOf('MSIE') > -1)   reverseScrolling = true;
		if (navigator.userAgent.indexOf("Safari") > -1) reverseScrolling = true;
		if (navigator.userAgent.indexOf('Chrome') > -1) reverseScrolling = false;

		body = document.getElementsByTagName('body')[0];

		document.addEventListener('touchend', function() {
			touchCurrent = false;
		});
		document.addEventListener('touchstart', function(e) {
			touchCurrent = e.touches[0];
		});

		_handleMutate();
		_handleChange();

		store.eventEmitter.subscribe(_handleChange);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
				_handleChange();
			}
		});
	}

	return {
		init: init
	}
});