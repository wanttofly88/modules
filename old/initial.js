var domReady = function(callback) {
	var div, isTop, scrollIntervalId;
	var isLoaded = false;

	var loaded = function() {
		if (isLoaded) return;
		isLoaded = true;

		if (scrollIntervalId) {
			clearInterval(scrollIntervalId);
		}
		callback();
	}

	if (document.addEventListener) {
		document.addEventListener("DOMContentLoaded", loaded, false);
		window.addEventListener("load", loaded, false);
	} else if (window.attachEvent) {
		window.attachEvent("onload", loaded);

		div = document.createElement('div');
		try {
			isTop = window.frameElement === null;
		} catch (e) {}

		if (div.doScroll && isTop && window.external) {
			scrollIntervalId = setInterval(function () {
				try {
					div.doScroll();
					loaded();
				} catch (e) {}
			}, 30);
		}
	}

	if (document.readyState === "complete") {
		loaded();
	}
}

domReady(function() {
	var windowSize = function() {
		var width = 0, height = 0;
		if( typeof( window.innerWidth ) === 'number' ) {
			width = window.innerWidth;
			height = window.innerHeight;
		} else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
			width = document.documentElement.clientWidth;
			height = document.documentElement.clientHeight;
		} else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
			width = document.body.clientWidth;
			height = document.body.clientHeight;
		}
		return {
			height: height,
			width: width
		}
	}

	var isTouchDevice = 'ontouchstart' in document.documentElement;
});