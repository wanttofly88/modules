define(['dispatcher', 'popup/popup.store'], function(dispatcher, popupStore) {

	"use strict";

	var dialogPopup;
	var textCont;

	var _handleChange = function(e) {
		var id;
		var storeData = popupStore.getData();
		var delay = 0;

		if (e.type === 'ajax-form-submit') {
			if (e.response.hasOwnProperty('dialog') && e.response.dialog !== '') {

				if (storeData.active === 'dialog-popup') {
					dispatcher.dispatch({
						type: 'popup-close-all'
					});
					delay = 400;
				} else {
					delay = 0;
				}

				setTimeout(function() {
					if (e.response.status === 'success') {
						textCont.innerHTML = e.response.dialog;
						dialogPopup.classList.remove('status-error');
						dialogPopup.classList.add('status-success');
						// items[e.id].element.classList.add('active');
					}

					if (e.response.status === 'error') {
						textCont.innerHTML = e.response.dialog;
						dialogPopup.classList.add('status-error');
						dialogPopup.classList.remove('status-success');
						// items[e.id].element.classList.add('active');
					}

					dispatcher.dispatch({
						type: 'popup-open',
						id: 'dialog-popup'
					});
				}, delay);
			}
		}
	}

	var init = function() {
		dialogPopup = document.getElementById('dialog-popup');
		textCont    = document.getElementById('dialog-popup-text');

		dispatcher.subscribe(_handleChange);
	}

	return {
		init: init
	}
});