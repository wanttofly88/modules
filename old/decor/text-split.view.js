define(['dispatcher', 'resize/resize.store'], function(dispatcher, resizeStore) {

	"use strict";
	var items = [];

	var _handleMutations = function(insertedElement) {
		var elements = insertedElement.querySelectorAll('.view-hover-inner');
		for (var i = elements.length - 1; i >= 0; i--) {
			_add(elements[i]);
		}
		if (insertedElement.classList.contains('view-hover-inner')) {
			_add(insertedElement);
		}

		_handleChange();
	}


	var _handleChange = function() {
		var handleItem = function(item) {
			var text  = item.text;
			var words = [];
			var lines = [];
			var minH;
			var stopped;
			var content;
			var element = item.element;
			var wordNum;
			var n;
			var i = 0;

			var insertElement = function(element, content) {
				var div;
				var span;

				div = document.createElement('div');
				span = document.createElement('span');
				span.innerHTML = content;
				div.appendChild(span);
				element.appendChild(div);
			}

			if (!text) return;
			words = text.split(' ');


			element.classList.remove('text-split-visible');
			element.classList.add('text-split-hidden');


			element.innerHTML = words[0];
			minH = element.clientHeight;

			stopped = -1;
			n = 0; 
			wordNum = 0;


			while (stopped < words.length - 1) {
				element.innerHTML = '';
				lines[n] = [];
				wordNum = 0;

				for (i = stopped + 1; i <= words.length - 1; i++) {
					if (wordNum > 0) {
						element.innerHTML += ' ';
					}

					if (words[i] && words[i] !== '') { //safari bugfix
						element.innerHTML += words[i];

						if (element.clientHeight > minH) break;
						lines[n].push(words[i]);
					}

					stopped = i;
					wordNum++;
				}
				n++;
			}

			element.innerHTML = '';

			for (var i = 0; i <= lines.length - 1; i++) {
				content = '';
				for (var j = 0; j <= lines[i].length - 1; j++) {
					if (j > 0) content += ' ';
					content += lines[i][j];
				}

				insertElement(element, content);
			}

			element.classList.remove('text-split-hidden');
			element.classList.add('text-split-visible');
		}

		for (var i = items.length - 1; i >= 0; i--) {
			handleItem(items[i]);
		}
	}

	var _add = function(element) {
		var trimSpaces = function(str) {
			return str.replace(/\s+/g, ' ').replace(/^\s+|\s+$/, '');
		}
		var text = element.innerHTML;
		text = trimSpaces(text);

		items.push({
			element: element,
			text: text,
			initialized: false
		});
	}

	var init = function() {
		var elements = document.querySelectorAll('.view-split');

		for (var i = elements.length - 1; i >= 0; i--) {
			_add(elements[i]);
		}

		_handleChange();
		resizeStore.eventEmitter.subscribe(function() {
			setTimeout(function() {
				_handleChange();
			}, 0);
		});

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutation-element-insert') {
				_handleMutations(e.element);
			}
		});
	}

	return {
		init: init
	}
});