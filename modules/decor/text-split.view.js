define(['dispatcher', 'resize/resize.store'], function(dispatcher, resizeStore) {

	"use strict";

	var items = {}

	//!!!replace if setting data-attribute!
	var idName = 'text-split-id-';
	var idNum  = 1;

	var _handleResize = function() {
		var resizeItem = function(item) {
			var text = item.text;
			var words = [];
			var lines = [];
			var h, minH, curWord, content;
			var curLine, curWordInLine;
			var div, span;

			var separators = [' ', '-'];
			var separatorsBackup = [];

			var totalWords = 0;
			var currentWord = 0;
			var breakNumber = 0; //for emergency

			if (!text) return;
			words = text.split(new RegExp(separators.join('|'), 'g'));
			totalWords = words.length;

			separatorsBackup = text.match(new RegExp(separators.join('|'), 'g'));

			item.element.innerHTML = words[0];
			minH = item.element.clientHeight;
			curWord = -1; //where are we now
			curLine = 0; 
			curWordInLine = 0;

			while (curWord < words.length -1) {
				item.element.innerHTML = '';
				lines[curLine] = [];
				curWordInLine  = 0;

				breakNumber++;
				if (breakNumber >= 4000) return;

				for (var i = curWord + 1; i <= words.length - 1; i++) {
					if (curWordInLine > 0) {
						item.element.innerHTML += ' ';
					}

					if (words[i] && words[i] != '') { //safari bugfix
						item.element.innerHTML += words[i];
						if (item.element.clientHeight > minH*1.5) {
							break;
						}

						lines[curLine].push(words[i]);
					}


					curWord = i;
					curWordInLine++;
				}
				curLine++;
			}

			item.element.innerHTML = '';
			currentWord = 0;

			for (var i = 0; i <= lines.length - 1; i++) {
				content = '';

				for (var j = 0; j <= lines[i].length - 1; j++) {

					currentWord++;


					if (j > 0) {
						if (typeof separatorsBackup[currentWord - 2] === 'undefined') {
							content += ' ';
						} else {
							content += separatorsBackup[currentWord - 2];
						}
					}
					content += lines[i][j];
				}

				div  = document.createElement('div');
				span = document.createElement('span');
				span.innerHTML = content;
				div.appendChild(span);
				item.element.appendChild(div);
			}
		}

		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				resizeItem(items[id]);
			}
		}
	}

	var _add = function(items, element) {
		var id = element.getAttribute('data-id');
		var text = element.innerHTML;

		if (!id) {
			id = idName + idNum;
			idNum++;

			//setAttribute('data-id', id);
		}

		items[id] = {
			id: id,
			element: element,
			text: text
		}
	}

	var _remove = function(items, item) {
		delete items[item.id];
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

		elements = document.getElementsByClassName('text-split');
		for (var i = 0; i < elements.length; i++) {
			check(items, elements[i]);
		}
		for (var id in items) {
			if (items.hasOwnProperty(id)) {
				backCheck(items, elements, items[id]);
			}
		}
	}

	var init = function() {
		_handleMutate();
		_handleResize();

		resizeStore.eventEmitter.subscribe(_handleResize);

		dispatcher.subscribe(function(e) {
			if (e.type === 'mutate') {
				_handleMutate();
			}
		});
	}

	return {
		init: init
	}
});