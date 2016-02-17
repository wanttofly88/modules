define(['dispatcher', 'map/map.store'], function(dispatcher, store) {
	var outerContainer;
	var initialized = false;
	var lang;
	var map = false;

	var _build = function(outerContainer) {
		var container = outerContainer.querySelector('.map');
		var lat, lng, zoom;
		var id;
		var config, styles;
		if (!container) return;

		id =   container.id;
		lat  = container.getAttribute('data-lat')  || 0;
		lng  = container.getAttribute('data-lng')  || 0;
		zoom = parseInt(container.getAttribute('data-zoom')) || 2;

		// styles = [{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#1e242b"},{"lightness":"5"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#1e242b"},{"saturation":"0"},{"lightness":"30"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"color":"#1e242b"},{"lightness":"30"}]},{"featureType":"administrative","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"administrative.province","elementType":"geometry.stroke","stylers":[{"color":"#1e242b"},{"lightness":"20"},{"weight":"1.00"}]},{"featureType":"administrative.neighborhood","elementType":"labels.text.fill","stylers":[{"lightness":"-20"}]},{"featureType":"administrative.land_parcel","elementType":"labels.text.fill","stylers":[{"lightness":"-20"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#1e242b"}]},{"featureType":"landscape","elementType":"labels","stylers":[{"color":"#1e242b"},{"lightness":"30"}]},{"featureType":"landscape","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#1e242b"},{"lightness":"5"}]},{"featureType":"poi","elementType":"labels","stylers":[{"color":"#1e242b"},{"lightness":"30"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"simplified"},{"color":"#1e242b"},{"lightness":"15"}]},{"featureType":"road","elementType":"labels","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#1e242b"},{"lightness":"6"}]},{"featureType":"transit","elementType":"labels","stylers":[{"color":"#1e242b"},{"lightness":"30"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"geometry","stylers":[{"color":"#010306"}]},{"featureType":"water","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]}];

		config = {
			zoom: zoom,
			scrollwheel: false,
			center: new google.maps.LatLng(lat, lng)
		}

		map = new google.maps.Map(container, config);

		// map.setOptions({styles: styles});

		container.style.background = 'rgba(1, 3, 6, 1)';

		dispatcher.dispatch({
			type: 'map-initialized',
			map: map
		});
	}

	var init = function() {
		var html = document.getElementsByTagName('html')[0];
		lang = html.getAttribute('lang');

		if (!lang) lang = 'ru';

		outerContainer = document.querySelector('.map-container');
		if (!outerContainer) return;

		function loadMaps() {
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = 'https://www.google.com/jsapi?key=AIzaSyCIuYnYUScrpSJwCMtCUKM-9yVn8wT_QoM&callback=initLoader';
			script.setAttribute('async', '');
			document.body.appendChild(script);
		}

		loadMaps();
	}

	var _initMaps = function() {
		_build(outerContainer);
	}

	window.initLoader = function() {
		google.load("maps", "3.x", {"callback" : _initMaps, "other_params": "sensor=false&language=" + lang});
	}

	return {
		init: init
	}
});