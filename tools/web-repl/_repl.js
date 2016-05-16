/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	var repl = document.getElementById('repl');
	var rows = document.getElementById('repl-rows');
	var input = document.getElementById('repl-input');
	var prompt = document.getElementById('repl-prompt');
	var stat = document.getElementById('repl-status');

	function createRow() {
	  var div = document.createElement('div');
	  div.setAttribute('class', 'repl__row');
	  return div;
	}

	function createHistory(status, code) {
	  var statusSpan = document.createElement('span');
	  statusSpan.innerText = status;
	  statusSpan.classList.add('repl__prompt__status');

	  var codeInput = document.createElement('input');
	  codeInput.setAttribute('type', 'text');
	  codeInput.classList.add('repl__prompt__input');
	  codeInput.value = code;

	  var row = createRow();
	  row.classList.add('repl__prompt');
	  row.appendChild(statusSpan);
	  row.appendChild(codeInput);

	  return row;
	}

	repl.addEventListener('click', function onREPLClick(e) {
	  input.focus();
	});

	input.addEventListener('keydown', function onREPLPress(e) {
	  var isEnter = (e.which == 13);

	  if(isEnter) {
	    var code = input.value;
	    input.value = '';
	    var history = createHistory(stat.innerText, ' ' + code);
	    rows.appendChild(history);
	  }
	});



/***/ }
/******/ ]);