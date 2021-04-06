#!/usr/bin/env node
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _react = _interopRequireWildcard(require("react"));

var _ink = require("ink");

var _inkSelectInput = _interopRequireDefault(require("ink-select-input"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var EXIT_KEY = 'q';
var ANALYZE_KEY = 'a';
var FILTER_KEY = 'm';
var ENTER_KEY = 'return';
var PAUSE_KEY = 'p';
var CONTINUE_KEY = 'c';

var _require = require('child_process'),
    spawn = _require.spawn;

var interactiveConfig = [{
  key: ANALYZE_KEY,
  description: 'Analyze build for performance improvements'
}, {
  key: PAUSE_KEY,
  description: 'Pause compilation at a given time'
}, {
  key: CONTINUE_KEY,
  description: 'Continue a compilation'
}, {
  key: FILTER_KEY,
  description: 'Filter a module and get stats on why a module was included'
}, {
  key: ENTER_KEY,
  description: 'Run webpack'
}, {
  key: EXIT_KEY,
  description: 'Exit interactive mode'
}];
var webpackProc = spawn("webpack", ['--profile', '--json', 'stats.json']);

var Counter = function Counter() {
  var ref = (0, _react.useRef)();

  var _useStdin = (0, _ink.useStdin)(),
      setRawMode = _useStdin.setRawMode;

  var _useStdout = (0, _ink.useStdout)(),
      write = _useStdout.write;

  var _useFocusManager = (0, _ink.useFocusManager)(),
      enableFocus = _useFocusManager.enableFocus;

  var _useState = (0, _react.useState)({
    modules: [],
    compiling: true,
    compiledModule: {}
  }),
      _useState2 = _slicedToArray(_useState, 2),
      state = _useState2[0],
      setState = _useState2[1];

  (0, _react.useEffect)(function () {
    var _measureElement = (0, _ink.measureElement)(ref.current),
        width = _measureElement.width,
        height = _measureElement.height; // width = 100, height = 1


    setRawMode(true);
    enableFocus();
    return function () {
      setRawMode(false);
    };
  }, []);
  webpackProc.stdout.on('data', function (data) {
    console.clear();
    write(data.toString());
    setState({
      compiling: false,
      modules: []
    });
  });
  webpackProc.stderr.on('data', function (data) {
    console.clear();
    write(data.toString());
    setState({
      compiling: false,
      modules: [],
      compiledModule: null
    });
  });

  var writeFilterConsole = function writeFilterConsole(stats) {
    var latestCompilation = stats;
    var data = [];

    for (var i = 0; i < latestCompilation.chunks.length; i++) {
      var name = latestCompilation.chunks[i].names[0];
      var chunksArr = [];

      for (var j = 0; j < latestCompilation.chunks[i].modules.length; j++) {
        var size = latestCompilation.chunks[i].modules[j].size;
        var path = latestCompilation.chunks[i].modules[j].name.replace('./', '');
        var issuerPath = latestCompilation.chunks[i].modules[j].issuerPath;
        chunksArr.push({
          path: path,
          size: size,
          issuerPath: issuerPath
        });
      }

      data.push(_defineProperty({}, name, chunksArr));
    }

    console.clear();
    setState({
      compiling: false,
      modules: data,
      compiledModule: null
    });
  };

  var handleSelect = function handleSelect(item) {
    setState({
      compiledModule: item,
      isCompiling: false,
      modules: []
    });
  };

  (0, _ink.useInput)(function (input, key) {
    if (input === 'q') {
      // Exit program
      console.clear();
      process.exit(0);
    }

    interactiveConfig.forEach(function (prop) {
      if (prop.key === input || key["return"]) {
        if (key["return"] && !state.modules.length) {
          setState({
            compiling: true,
            modules: [],
            compiledModule: null
          });
          write("Compiling...");
          webpackProc = spawn("webpack", []);
        } else if (input === ANALYZE_KEY) {
          console.clear();
          setState({
            compiling: true,
            modules: [],
            compiledModule: null
          });
          write("Compiling...");
          webpackProc = spawn("webpack", []);

          var bundleAnalyzer = require('webpack-bundle-analyzer');

          var fs = require('fs');

          var file = JSON.parse(fs.readFileSync('./stats.json', 'utf8'));
          bundleAnalyzer.start(file);
        } else if (input === FILTER_KEY) {
          var _fs = require('fs');

          var _file = JSON.parse(_fs.readFileSync('./stats.json', 'utf8'));

          console.clear();
          writeFilterConsole(_file);
        } else if (input === PAUSE_KEY) {
          webpackProc.kill('SIGSTOP');
          setState({
            compiling: false,
            modules: [],
            compiledModule: null
          });
          console.clear();
          write("Paused!");
        } else if (input === CONTINUE_KEY) {
          webpackProc.kill('SIGCONT');
          setState({
            compiling: true,
            modules: [],
            compiledModule: null
          });
          write("Continuing...");
        }
      }
    });
  });

  if (state.compiledModule && Object.keys(state.compiledModule).length > 0) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      width: 100
    }, /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      flexDirection: "column",
      ref: ref,
      marginLeft: 2
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "gray"
    }, "Path: ", /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "#FF4500"
    }, state.compiledModule.label.toString())), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "gray"
    }, "Size: ", /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "#FF4500"
    }, state.compiledModule.data.size.toString())), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "gray"
    }, "Issuerpath: ", /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "#FF4500"
    }, state.compiledModule.data.issuerPath ? state.compiledModule.data.issuerPath.toString() : 'null'))));
  }

  if (state.modules && state.modules.length > 0) {
    var map = [];
    state.modules.forEach(function (chunk) {
      var data;
      data = Object.keys(chunk).forEach(function (mod) {
        chunk[mod].forEach(function (sub) {
          var path = mod + ' > ' + sub.path;
          map.push({
            value: path.toUpperCase(),
            label: path,
            data: {
              issuerPath: sub.issuerPath,
              size: sub.size
            }
          });
        });
      });
    });
    return /*#__PURE__*/_react["default"].createElement(_inkSelectInput["default"], {
      items: map,
      onSelect: handleSelect
    });
  }

  return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
    width: 100
  }, /*#__PURE__*/_react["default"].createElement(_ink.Box, {
    flexDirection: "column",
    ref: ref,
    marginLeft: 2
  }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "gray"
  }, "Interactive Usage"), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "gray"
  }, "Compiling: ", /*#__PURE__*/_react["default"].createElement(_ink.Text, {
    color: "#FF4500"
  }, state.compiling ? state.compiling.toString() : 'false')), interactiveConfig.map(function (prop) {
    return /*#__PURE__*/_react["default"].createElement(_ink.Box, {
      key: prop.key
    }, /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "gray",
      height: 2,
      marginLeft: 5,
      marginRight: 2
    }, "> Press "), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "#FF4500"
    }, prop.key, " "), /*#__PURE__*/_react["default"].createElement(_ink.Text, {
      color: "gray"
    }, prop.description));
  })));
};

(0, _ink.render)( /*#__PURE__*/_react["default"].createElement(Counter, null));