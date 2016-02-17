define(['dispatcher', 'scroll/scroll.store', 'resize/resize.store', 'utils', 'trigger/trigger.store', 'preload/preload.store'], function(dispatcher, scrollStore, resizeStore, utils, triggerStore, preloadStore) {

	"use strict";

	var items = [];
	var wh;

	var virtualScroll = 0;
	var requestAnimationFrame;
	var scrolled;
	var scrolldWheight;
	var helper;

	var _handleScroll = function() {
		var storeData = scrollStore.getData();
		scrolled  = storeData.top;
		scrolldWheight = scrolled + wh;
	}

	var _handleVirtualScroll = function() {
		if (helper) {
			helper.style.top = virtualScroll + 'px';
		}
		var checkItem = function(item) {
			var trigger = function() {
				if (item.triggered) return;
				item.triggered = true;
				dispatcher.dispatch({
					type: 'element-trigger',
					id: item.id,
					me:   'scroll-trigger'
				});
			}
			var untrigger = function() {
				if (!item.triggered) return;
				item.triggered = false;
				dispatcher.dispatch({
					type: 'element-untrigger',
					me:   'scroll-trigger',
					id: item.id
				});
			}

			// if (item.pos === 'middle') {
			// 	if (virtualScroll - item.height/2 + wh/2 > item.offset) {
			// 		trigger();
			// 	}
			// 	if (virtualScroll - item.height/2 + wh/2 <= item.offset) {
			// 		untrigger();
			// 	}
			// }
			if (item.pos === 'bottom') {
				if (virtualScroll - 50 > item.offset) {
					trigger();
				}
				if (virtualScroll - 50 <= item.offset) {
					untrigger();
				}
			}
		}

		for (var i = 0; i < items.length; i++) {
			checkItem(items[i]);
		}
	}

	var _loop = function() {
		if (virtualScroll !== scrolldWheight) {
			scrolldWheight = Math.floor(scrolldWheight);
			virtualScroll = Math.floor(virtualScroll);
			virtualScroll = virtualScroll + (scrolldWheight - virtualScroll)/20;

			_handleVirtualScroll();
		}

		requestAnimationFrame(_loop);
	}

	var _handleResize = function() {
		wh = resizeStore.getData().height;
		scrolldWheight = scrolled + wh;
	}

	var _add = function(element) {
		var offset = utils.offset(element).top;
		var height = element.clientHeight;
		var triggered = false;
		var id    = element.getAttribute('data-trigger-id');
		var pos   = element.getAttribute('data-pos') || 'bottom';
		var shift = element.getAttribute('data-shift');

		if (!shift) shift = 0;
		shift = parseInt(shift);

		items.push({
			id: id,
			element: element,
			height: height,
			offset: offset,
			pos: pos,
			shift: shift,
			triggered: false
		});
	}

	var _handlePreload = function() {
		var storeData = preloadStore.getData();
		if (storeData.complete) {

			setTimeout(function() {
				_handleResize();
				_handleScroll();
				
				resizeStore.eventEmitter.subscribe(_handleResize);
				scrollStore.eventEmitter.subscribe(_handleScroll);

				//let's get the party started
				_loop();
			});
		}
	}

	var init = function() {
		var elements = document.querySelectorAll('.scroll-trigger');
		if (!elements || elements.length === 0) return;

		helper = document.getElementById('scroll-helper');

		requestAnimationFrame = utils.getRequestAnimationFrame();

		for (var i = 0; i < elements.length; i++) {
			_add(elements[i]);
		}

		preloadStore.eventEmitter.subscribe(_handlePreload);
	}

	return {
		init: init
	}
});