define(['dispatcher',
	'drop-down/drop-down.store', 
	'resize/resize.store', 
	'resize/breakpoint.store'], function(
		dispatcher, 
		store, 
		resizeStore, 
		bpStore
	) {
	"use strict";

	var items = {};
	var breakpointName = 'desktop';
	var animationDelay = 300;
	var to;


	var _show = function(item) {
		item.container.classList.add('active');
		item.container.style.height = (item.inner.clientHeight) + 'px';

		clearTimeout(to);
		to = setTimeout(function() {
			item.container.style.height = 'auto';
		}, animationDelay);
	}

	var _hide = function(item) {
		var bpName = bpStore.getData().breakpoint.name;
		var h;

		h = item.heights[bpName] || 0;
		if (item.inner.clientHeight <= h) h = item.inner.clientHeight;

		item.container.classList.remove('active');
		item.container.style.height = (item.inner.clientHeight) + 'px';

		clearTimeout(to);
		setTimeout(function() {
			item.container.style.height = h + 'px';
		}, 20);
	}

	var _handleChange = function() {
		var storeData = store.getData();

		var checkItem = function(item) {
			var container = item.container;
			var id = item.id;

			if (item.active === storeData.items[id].active) return;

			item.active = storeData.items[id].active

			if (!item.active) {
				_hide(item);
			}

			if (item.active) {
				_show(item);
			}
		}

		for (var id in items) {
			checkItem(items[id]);
		}
	}

	var _recount = function() {
		var bpName = breakpointName || bpStore.getData().breakpoint.name;

		var _check = function(item) {
			var h =  item.heights[bpName] || 0;
			var ih = item.inner.clientHeight;

			if (ih <= h && item.enabled) {
				item.enabled = false;
				dispatcher.dispatch({
					type: 'drop-down-disable',
					me:   'drop-down-view',
					id: item.id
				});
				dispatcher.dispatch({
					type: 'drop-down-activate',
					me:   'drop-down-view',
					id: item.id
				});
				item.container.style.height = 'auto';
			} else if (ih > h & !item.enabled) {
				item.enabled = true;
				dispatcher.dispatch({
					type: 'drop-down-enable',
					me:   'drop-down-view',
					id: item.id
				});
			}

			if (item.enabled) {
				if (item.active) {
					_show(item);
					//item.container.style.height = (item.inner.clientHeight) + 'px';
				} else {
					_hide(item);
					//item.container.style.height = item.heights[bpName] + 'px';
				}
			}

		}

		for (var id in items) {
			_check(items[id]);
		}
	}

	var _add = function(container) {
		var inner = container.querySelector('.drop-down-inner');
		var id = container.getAttribute('data-id');
		var heights = {}

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		heights.mobile  = container.getAttribute('data-height-mobile')  || 9999999;
		heights.mobile  = parseInt(heights.mobile);

		heights.tablet  = container.getAttribute('data-height-tablet')  || 9999999;
		heights.tablet  = parseInt(heights.tablet);

		heights.desktop = container.getAttribute('data-height-desktop') || 9999999;
		heights.desktop = parseInt(heights.desktop);

		items[id] = {
			id: id,
			enabled: true,
			active: false,
			container: container,
			inner: inner,
			heights: heights
		}
	}


	var init = function() {
		var containers = document.querySelectorAll('.drop-down-container');

		for (var i = 0; i < containers.length; i++) {
			_add(containers[i]);
		}

		_handleChange();
		store.eventEmitter.subscribe(function() {
			_handleChange();
		});

		setTimeout(_recount, 0);

		resizeStore.eventEmitter.subscribe(function() {
			setTimeout(_recount, 0);
		});
	}

	return {
		init: init
	}
});