define(['dispatcher', 'form/form.store'], function(dispatcher, store) {

	"use strict";

	var items = {}

	var _handleChange = function() {
		var storeData = store.getData();

		var _checkItem = function(item) {
			var id = item.id;
			if (!storeData.items.hasOwnProperty(id)) return;
			if (storeData.items[id].status === items[id].status) return;
			items[id].status = storeData.items[id].status;
			item.element.classList.remove('waiting');
			item.element.classList.remove('sending');
			item.element.classList.remove('submitted');
			item.element.classList.add(items[id].status);
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				_checkItem(items[id]);
			}
		}
	}

	var _add = function(element) {
		var id = element.getAttribute('data-id');

		if (!id) {
			console.warn('data-id attribute is missing');
			return;
		}

		items[id] = {
			id: id,
			element: element,
			status: false
		}
	}

	var _handle = function(item) {
		var form  = item.element;

		//проверка пустого ввода
		var validate = function(form) {
			var result = true;
			var inputs = form.getElementsByTagName('input');
			var textareas = form.getElementsByTagName('textarea');
			var bindedData = false;

			var checkInput = function(input) {
				if (!input.getAttribute('data-required')) return;

				if (!input.value || input.value === '') {
					input.parentNode.classList.add('error');
					result = false;
				}
			}

			var checkBinded = function(input) {
				if (!input.getAttribute('data-binded')) return;
				if (!input.value || input.value === '') return;
				if (!bindedData) {
					bindedData = input.value;
				} else {
					if (input.value !== bindedData) {
						input.parentNode.classList.add('error');
						result = false;
					}
				}
			}

			for (var i = 0; i < inputs.length; i++) {
				checkInput(inputs[i]);
				checkBinded(inputs[i]);
			}
			for (var i = 0; i < textareas.length; i++) {
				checkInput(textareas[i]);
				checkBinded(textareas[i]);
			}

			return result;
		}

		item.element.addEventListener('submit', function(e) {
			var action = form.action;
			var validation;
			var data;

			validation = validate(form);

			if (!validation || item.status !== 'waiting') {
				e.preventDefault();
				return;
			}

			if (!FormData) return;
			e.preventDefault();

			// item.status = 'sending';

			data = new FormData(form);

			dispatcher.dispatch({
				type: 'ajax-form-send',
				id: item.id
			});

			//реальный код-----------------------------------------
			fetch(action, {
				method: 'post',
				credentials: 'include',
				body: data
			}).then(function(response) {
				return response.json()
			}).then(function(json) {
				dispatcher.dispatch({
					type: 'ajax-form-submit',
					id: item.id,
					response: json
				});
				dispatcher.dispatch({
					type: 'ajax-server-responce',
					response: json
				});

				if (!json.hasOwnProperty('status') || json.status === 'error' || json.status === 'success-reset') {
					setTimeout(function() {
						dispatcher.dispatch({
							type: 'ajax-form-reset',
							id: item.id
						});
					}, 3000);
				}
			});
			//-----------------------------------------------------

			//временная заглушка для клиента-----------------------
			// var testObj = {
			// 	status:   'success-reset',
			// 	response: 'Отправка успешна',
			// 	fav: ['i1', 'i2', 'i4']
			// }

			// var testJSON = JSON.stringify(testObj);

			// setTimeout(function() {
			// 	// item.status = 'submitted';

			// 	dispatcher.dispatch({
			// 		type: 'ajax-form-submit',
			// 		id: item.id,
			// 		response: testObj
			// 	});
			// 	dispatcher.dispatch({
			// 		type: 'ajax-server-responce',
			// 		response: testObj
			// 	});

			// 	if (!testObj.hasOwnProperty('status') || testObj.status === 'error' || testObj.status === 'success-reset') {
			// 		setTimeout(function() {
			// 			dispatcher.dispatch({
			// 				type: 'ajax-form-reset',
			// 				id: item.id
			// 			});
			// 		}, 3000);
			// 	}
			// }, 2000);
			//----------------------------------------------------


		}, false);
	}

	var init = function() {
		var forms = document.querySelectorAll('.view-form');
		for (var i = 0; i < forms.length; i++) {
			_add(forms[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				_handle(items[id]);
			}
		}

		_handleChange();
		store.eventEmitter.subscribe(_handleChange);
	}

	return {
		init: init
	}
});