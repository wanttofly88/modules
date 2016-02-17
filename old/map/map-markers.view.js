define(['dispatcher', 'map/map.store'], function(dispatcher, store) {
	"use strict";

	var initialized = false;
	var markers;

	var _handleChange = function(storeData) {
		if (initialized) return;
		if (storeData.active) {
			initialized = true;

			_addMarkers(storeData.map);
		}
	}

	var _addMarkers = function(map) {
		var _add = function(marker, i) {
			var title;
			var lat, lng, latLng;
			var icon, marker;
			var iconPath;

			lat   = marker.getAttribute('data-lat');
			lng   = marker.getAttribute('data-lng');
			title = marker.getAttribute('data-title');

			if (!lat || !lng) {
				console.warn('marker lat or/and lng is missing');
			}

			iconPath = path +  'images/marker.png';


			icon = {
				url: iconPath,
				size: new google.maps.Size(47, 48),
				origin: new google.maps.Point(0, 0),
				anchor: new google.maps.Point(23, 24)
			}

			latLng = new google.maps.LatLng(lat, lng);

			marker = new google.maps.Marker({
				position: latLng,
				map: map,
				icon: icon,
				title: title
			});
		}

		for (var i = 0; i < markers.length; i++) {
			_add(markers[i], i);
		}
	}

	var init = function() {
		var storeData;
		var outerContainer = document.querySelector('.markers-container');
		if (!outerContainer) return;

		markers = outerContainer.querySelectorAll('.marker');

		storeData = store.getData();
		_handleChange(storeData);

		store.eventEmitter.subscribe(function() {
			storeData = store.getData();
			_handleChange(storeData);
		});
	}

	return {
		init: init
	}
});