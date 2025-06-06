import {
  require_react
} from "./chunk-6GAV2S6I.js";
import {
  __commonJS,
  __toESM
} from "./chunk-DC5AMYBS.js";

// node_modules/lodash.debounce/index.js
var require_lodash = __commonJS({
  "node_modules/lodash.debounce/index.js"(exports, module) {
    var FUNC_ERROR_TEXT = "Expected a function";
    var NAN = 0 / 0;
    var symbolTag = "[object Symbol]";
    var reTrim = /^\s+|\s+$/g;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsOctal = /^0o[0-7]+$/i;
    var freeParseInt = parseInt;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var objectProto = Object.prototype;
    var objectToString = objectProto.toString;
    var nativeMax = Math.max;
    var nativeMin = Math.min;
    var now = function() {
      return root.Date.now();
    };
    function debounce2(func, wait, options) {
      var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
      if (typeof func != "function") {
        throw new TypeError(FUNC_ERROR_TEXT);
      }
      wait = toNumber(wait) || 0;
      if (isObject(options)) {
        leading = !!options.leading;
        maxing = "maxWait" in options;
        maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
        trailing = "trailing" in options ? !!options.trailing : trailing;
      }
      function invokeFunc(time) {
        var args = lastArgs, thisArg = lastThis;
        lastArgs = lastThis = void 0;
        lastInvokeTime = time;
        result = func.apply(thisArg, args);
        return result;
      }
      function leadingEdge(time) {
        lastInvokeTime = time;
        timerId = setTimeout(timerExpired, wait);
        return leading ? invokeFunc(time) : result;
      }
      function remainingWait(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
        return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
      }
      function shouldInvoke(time) {
        var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
        return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
      }
      function timerExpired() {
        var time = now();
        if (shouldInvoke(time)) {
          return trailingEdge(time);
        }
        timerId = setTimeout(timerExpired, remainingWait(time));
      }
      function trailingEdge(time) {
        timerId = void 0;
        if (trailing && lastArgs) {
          return invokeFunc(time);
        }
        lastArgs = lastThis = void 0;
        return result;
      }
      function cancel() {
        if (timerId !== void 0) {
          clearTimeout(timerId);
        }
        lastInvokeTime = 0;
        lastArgs = lastCallTime = lastThis = timerId = void 0;
      }
      function flush() {
        return timerId === void 0 ? result : trailingEdge(now());
      }
      function debounced() {
        var time = now(), isInvoking = shouldInvoke(time);
        lastArgs = arguments;
        lastThis = this;
        lastCallTime = time;
        if (isInvoking) {
          if (timerId === void 0) {
            return leadingEdge(lastCallTime);
          }
          if (maxing) {
            timerId = setTimeout(timerExpired, wait);
            return invokeFunc(lastCallTime);
          }
        }
        if (timerId === void 0) {
          timerId = setTimeout(timerExpired, wait);
        }
        return result;
      }
      debounced.cancel = cancel;
      debounced.flush = flush;
      return debounced;
    }
    function isObject(value) {
      var type = typeof value;
      return !!value && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return !!value && typeof value == "object";
    }
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
    }
    function toNumber(value) {
      if (typeof value == "number") {
        return value;
      }
      if (isSymbol(value)) {
        return NAN;
      }
      if (isObject(value)) {
        var other = typeof value.valueOf == "function" ? value.valueOf() : value;
        value = isObject(other) ? other + "" : other;
      }
      if (typeof value != "string") {
        return value === 0 ? value : +value;
      }
      value = value.replace(reTrim, "");
      var isBinary = reIsBinary.test(value);
      return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
    }
    module.exports = debounce2;
  }
});

// node_modules/react-speech-recognition/dist/cc-BU0zEyYq.js
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) resolve(value);
  else Promise.resolve(value).then(_next, _throw);
}
function _async_to_generator(fn) {
  return function() {
    var self2 = this, args = arguments;
    return new Promise(function(resolve, reject) {
      var gen = fn.apply(self2, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(void 0);
    });
  };
}

// node_modules/react-speech-recognition/dist/index.js
var import_react = __toESM(require_react());
var import_lodash = __toESM(require_lodash());
var NativeSpeechRecognition = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition);
var isNative = (SpeechRecognition2) => SpeechRecognition2 === NativeSpeechRecognition;
var isAndroid = () => /(android)/i.test(typeof navigator !== "undefined" ? navigator.userAgent : "");
var concatTranscripts = (...transcriptParts) => {
  return transcriptParts.map((t) => t.trim()).join(" ").trim();
};
var optionalParam = /\s*\((.*?)\)\s*/g;
var optionalRegex = /(\(\?:[^)]+\))\?/g;
var namedParam = /(\(\?)?:\w+/g;
var splatParam = /\*/g;
var escapeRegExp = /[-{}[\]+?.,\\^$|#]/g;
var commandToRegExp = (command) => {
  if (command instanceof RegExp) {
    return new RegExp(command.source, "i");
  }
  command = command.replace(escapeRegExp, "\\$&").replace(optionalParam, "(?:$1)?").replace(namedParam, (match, optional) => {
    return optional ? match : "([^\\s]+)";
  }).replace(splatParam, "(.*?)").replace(optionalRegex, "\\s*$1?\\s*");
  return new RegExp("^" + command + "$", "i");
};
var compareTwoStringsUsingDiceCoefficient = (first, second) => {
  first = first.replace(/\s+/g, "").toLowerCase();
  second = second.replace(/\s+/g, "").toLowerCase();
  if (!first.length && !second.length) return 1;
  if (!first.length || !second.length) return 0;
  if (first === second) return 1;
  if (first.length === 1 && second.length === 1) return 0;
  if (first.length < 2 || second.length < 2) return 0;
  const firstBigrams = /* @__PURE__ */ new Map();
  for (let i = 0; i < first.length - 1; i++) {
    const bigram = first.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) + 1 : 1;
    firstBigrams.set(bigram, count);
  }
  let intersectionSize = 0;
  for (let i = 0; i < second.length - 1; i++) {
    const bigram = second.substring(i, i + 2);
    const count = firstBigrams.has(bigram) ? firstBigrams.get(bigram) : 0;
    if (count > 0) {
      firstBigrams.set(bigram, count - 1);
      intersectionSize++;
    }
  }
  return 2 * intersectionSize / (first.length + second.length - 2);
};
var browserSupportsPolyfills = () => {
  return typeof window !== "undefined" && window.navigator !== void 0 && window.navigator.mediaDevices !== void 0 && window.navigator.mediaDevices.getUserMedia !== void 0 && (window.AudioContext !== void 0 || window.webkitAudioContext !== void 0);
};
var RecognitionManager = class {
  setSpeechRecognition(SpeechRecognition2) {
    const browserSupportsRecogniser = !!SpeechRecognition2 && (isNative(SpeechRecognition2) || browserSupportsPolyfills());
    if (browserSupportsRecogniser) {
      this.disableRecognition();
      this.recognition = new SpeechRecognition2();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.onresult = this.updateTranscript.bind(this);
      this.recognition.onend = this.onRecognitionDisconnect.bind(this);
      this.recognition.onerror = this.onError.bind(this);
    }
    this.emitBrowserSupportsSpeechRecognitionChange(browserSupportsRecogniser);
  }
  subscribe(id, callbacks) {
    this.subscribers[id] = callbacks;
  }
  unsubscribe(id) {
    delete this.subscribers[id];
  }
  emitListeningChange(listening) {
    this.listening = listening;
    Object.keys(this.subscribers).forEach((id) => {
      const { onListeningChange } = this.subscribers[id];
      onListeningChange(listening);
    });
  }
  emitMicrophoneAvailabilityChange(isMicrophoneAvailable) {
    this.isMicrophoneAvailable = isMicrophoneAvailable;
    Object.keys(this.subscribers).forEach((id) => {
      const { onMicrophoneAvailabilityChange } = this.subscribers[id];
      onMicrophoneAvailabilityChange(isMicrophoneAvailable);
    });
  }
  emitTranscriptChange(interimTranscript, finalTranscript) {
    Object.keys(this.subscribers).forEach((id) => {
      const { onTranscriptChange } = this.subscribers[id];
      onTranscriptChange(interimTranscript, finalTranscript);
    });
  }
  emitClearTranscript() {
    Object.keys(this.subscribers).forEach((id) => {
      const { onClearTranscript } = this.subscribers[id];
      onClearTranscript();
    });
  }
  emitBrowserSupportsSpeechRecognitionChange(browserSupportsSpeechRecognitionChange) {
    Object.keys(this.subscribers).forEach((id) => {
      const { onBrowserSupportsSpeechRecognitionChange, onBrowserSupportsContinuousListeningChange } = this.subscribers[id];
      onBrowserSupportsSpeechRecognitionChange(browserSupportsSpeechRecognitionChange);
      onBrowserSupportsContinuousListeningChange(browserSupportsSpeechRecognitionChange);
    });
  }
  disconnect(disconnectType) {
    if (this.recognition && this.listening) {
      switch (disconnectType) {
        case "ABORT":
          this.pauseAfterDisconnect = true;
          this.abort();
          break;
        case "RESET":
          this.pauseAfterDisconnect = false;
          this.abort();
          break;
        case "STOP":
        default:
          this.pauseAfterDisconnect = true;
          this.stop();
      }
    }
  }
  disableRecognition() {
    if (this.recognition) {
      this.recognition.onresult = () => {
      };
      this.recognition.onend = () => {
      };
      this.recognition.onerror = () => {
      };
      if (this.listening) {
        this.stopListening();
      }
    }
  }
  onError(event) {
    if (event && event.error && event.error === "not-allowed") {
      this.emitMicrophoneAvailabilityChange(false);
      this.disableRecognition();
    }
  }
  onRecognitionDisconnect() {
    this.onStopListening();
    this.listening = false;
    if (this.pauseAfterDisconnect) {
      this.emitListeningChange(false);
    } else if (this.recognition) {
      if (this.recognition.continuous) {
        this.startListening({
          continuous: this.recognition.continuous
        });
      } else {
        this.emitListeningChange(false);
      }
    }
    this.pauseAfterDisconnect = false;
  }
  updateTranscript({ results, resultIndex }) {
    const currentIndex = resultIndex === void 0 ? results.length - 1 : resultIndex;
    this.interimTranscript = "";
    this.finalTranscript = "";
    for (let i = currentIndex; i < results.length; ++i) {
      if (results[i].isFinal && (!isAndroid() || results[i][0].confidence > 0)) {
        this.updateFinalTranscript(results[i][0].transcript);
      } else {
        this.interimTranscript = concatTranscripts(this.interimTranscript, results[i][0].transcript);
      }
    }
    let isDuplicateResult = false;
    if (this.interimTranscript === "" && this.finalTranscript !== "") {
      if (this.previousResultWasFinalOnly) {
        isDuplicateResult = true;
      }
      this.previousResultWasFinalOnly = true;
    } else {
      this.previousResultWasFinalOnly = false;
    }
    if (!isDuplicateResult) {
      this.emitTranscriptChange(this.interimTranscript, this.finalTranscript);
    }
  }
  updateFinalTranscript(newFinalTranscript) {
    this.finalTranscript = concatTranscripts(this.finalTranscript, newFinalTranscript);
  }
  resetTranscript() {
    this.disconnect("RESET");
  }
  startListening() {
    return _async_to_generator(function* ({ continuous = false, language } = {}) {
      if (!this.recognition) {
        return;
      }
      const isContinuousChanged = continuous !== this.recognition.continuous;
      const isLanguageChanged = language && language !== this.recognition.lang;
      if (isContinuousChanged || isLanguageChanged) {
        if (this.listening) {
          yield this.stopListening();
        }
        this.recognition.continuous = isContinuousChanged ? continuous : this.recognition.continuous;
        this.recognition.lang = isLanguageChanged ? language : this.recognition.lang;
      }
      if (!this.listening) {
        if (!this.recognition.continuous) {
          this.resetTranscript();
          this.emitClearTranscript();
        }
        try {
          yield this.start();
          this.emitListeningChange(true);
        } catch (e) {
          if (!(e instanceof DOMException)) {
            this.emitMicrophoneAvailabilityChange(false);
          }
        }
      }
    }).apply(this, arguments);
  }
  abortListening() {
    return _async_to_generator(function* () {
      this.disconnect("ABORT");
      this.emitListeningChange(false);
      yield new Promise((resolve) => {
        this.onStopListening = resolve;
      });
    }).call(this);
  }
  stopListening() {
    return _async_to_generator(function* () {
      this.disconnect("STOP");
      this.emitListeningChange(false);
      yield new Promise((resolve) => {
        this.onStopListening = resolve;
      });
    }).call(this);
  }
  getRecognition() {
    return this.recognition;
  }
  start() {
    return _async_to_generator(function* () {
      if (this.recognition && !this.listening) {
        yield this.recognition.start();
        this.listening = true;
      }
    }).call(this);
  }
  stop() {
    if (this.recognition && this.listening) {
      this.recognition.stop();
      this.listening = false;
    }
  }
  abort() {
    if (this.recognition && this.listening) {
      this.recognition.abort();
      this.listening = false;
    }
  }
  constructor(SpeechRecognition2) {
    this.recognition = null;
    this.pauseAfterDisconnect = false;
    this.interimTranscript = "";
    this.finalTranscript = "";
    this.listening = false;
    this.isMicrophoneAvailable = true;
    this.subscribers = {};
    this.onStopListening = () => {
    };
    this.previousResultWasFinalOnly = false;
    this.resetTranscript = this.resetTranscript.bind(this);
    this.startListening = this.startListening.bind(this);
    this.stopListening = this.stopListening.bind(this);
    this.abortListening = this.abortListening.bind(this);
    this.setSpeechRecognition = this.setSpeechRecognition.bind(this);
    this.disableRecognition = this.disableRecognition.bind(this);
    this.setSpeechRecognition(SpeechRecognition2);
    if (isAndroid()) {
      this.updateFinalTranscript = (0, import_lodash.default)(this.updateFinalTranscript, 250, {
        leading: true
      });
    }
  }
};
var CLEAR_TRANSCRIPT = "CLEAR_TRANSCRIPT";
var APPEND_TRANSCRIPT = "APPEND_TRANSCRIPT";
var clearTranscript = () => {
  return {
    type: CLEAR_TRANSCRIPT
  };
};
var appendTranscript = (interimTranscript, finalTranscript) => {
  return {
    type: APPEND_TRANSCRIPT,
    payload: {
      interimTranscript,
      finalTranscript
    }
  };
};
var transcriptReducer = (state, action) => {
  switch (action.type) {
    case CLEAR_TRANSCRIPT:
      return {
        interimTranscript: "",
        finalTranscript: ""
      };
    case APPEND_TRANSCRIPT:
      return {
        interimTranscript: action.payload.interimTranscript,
        finalTranscript: concatTranscripts(state.finalTranscript, action.payload.finalTranscript)
      };
    default:
      throw new Error();
  }
};
var _browserSupportsSpeechRecognition = !!NativeSpeechRecognition;
var _browserSupportsContinuousListening = _browserSupportsSpeechRecognition && !isAndroid();
var recognitionManager;
var useSpeechRecognition = ({ transcribing = true, clearTranscriptOnListen = true, commands = [] } = {}) => {
  const [recognitionManager2] = (0, import_react.useState)(SpeechRecognition.getRecognitionManager());
  const [browserSupportsSpeechRecognition, setBrowserSupportsSpeechRecognition] = (0, import_react.useState)(_browserSupportsSpeechRecognition);
  const [browserSupportsContinuousListening, setBrowserSupportsContinuousListening] = (0, import_react.useState)(_browserSupportsContinuousListening);
  const [{ interimTranscript, finalTranscript }, dispatch] = (0, import_react.useReducer)(transcriptReducer, {
    interimTranscript: recognitionManager2.interimTranscript,
    finalTranscript: ""
  });
  const [listening, setListening] = (0, import_react.useState)(recognitionManager2.listening);
  const [isMicrophoneAvailable, setMicrophoneAvailable] = (0, import_react.useState)(recognitionManager2.isMicrophoneAvailable);
  const commandsRef = (0, import_react.useRef)(commands);
  commandsRef.current = commands;
  const dispatchClearTranscript = () => {
    dispatch(clearTranscript());
  };
  const resetTranscript = (0, import_react.useCallback)(() => {
    recognitionManager2.resetTranscript();
    dispatchClearTranscript();
  }, [
    recognitionManager2
  ]);
  const testFuzzyMatch = (command, input, fuzzyMatchingThreshold) => {
    const commandToString = typeof command === "object" ? command.toString() : command;
    const commandWithoutSpecials = commandToString.replace(/[&/\\#,+()!$~%.'":*?<>{}]/g, "").replace(/  +/g, " ").trim();
    const howSimilar = compareTwoStringsUsingDiceCoefficient(commandWithoutSpecials, input);
    if (howSimilar >= fuzzyMatchingThreshold) {
      return {
        command,
        commandWithoutSpecials,
        howSimilar,
        isFuzzyMatch: true
      };
    }
    return null;
  };
  const testMatch = (command, input) => {
    const pattern = commandToRegExp(command);
    const result = pattern.exec(input);
    if (result) {
      return {
        command,
        parameters: result.slice(1)
      };
    }
    return null;
  };
  const matchCommands = (0, import_react.useCallback)((newInterimTranscript, newFinalTranscript) => {
    commandsRef.current.forEach(({ command, callback, matchInterim = false, isFuzzyMatch = false, fuzzyMatchingThreshold = 0.8, bestMatchOnly = false }) => {
      const input = !newFinalTranscript && matchInterim ? newInterimTranscript.trim() : newFinalTranscript.trim();
      const subcommands = Array.isArray(command) ? command : [
        command
      ];
      const results = subcommands.map((subcommand) => {
        if (isFuzzyMatch) {
          return testFuzzyMatch(subcommand, input, fuzzyMatchingThreshold);
        }
        return testMatch(subcommand, input);
      }).filter((x) => x);
      if (isFuzzyMatch && bestMatchOnly && results.length >= 2) {
        results.sort((a, b) => b.howSimilar - a.howSimilar);
        const { command: command2, commandWithoutSpecials, howSimilar } = results[0];
        callback(commandWithoutSpecials, input, howSimilar, {
          command: command2,
          resetTranscript
        });
      } else {
        results.forEach((result) => {
          if (result.isFuzzyMatch) {
            const { command: command2, commandWithoutSpecials, howSimilar } = result;
            callback(commandWithoutSpecials, input, howSimilar, {
              command: command2,
              resetTranscript
            });
          } else {
            const { command: command2, parameters } = result;
            callback(...parameters, {
              command: command2,
              resetTranscript
            });
          }
        });
      }
    });
  }, [
    resetTranscript
  ]);
  const handleTranscriptChange = (0, import_react.useCallback)((newInterimTranscript, newFinalTranscript) => {
    if (transcribing) {
      dispatch(appendTranscript(newInterimTranscript, newFinalTranscript));
    }
    matchCommands(newInterimTranscript, newFinalTranscript);
  }, [
    matchCommands,
    transcribing
  ]);
  const handleClearTranscript = (0, import_react.useCallback)(() => {
    if (clearTranscriptOnListen) {
      dispatchClearTranscript();
    }
  }, [
    clearTranscriptOnListen
  ]);
  (0, import_react.useEffect)(() => {
    const id = SpeechRecognition.counter;
    SpeechRecognition.counter += 1;
    const callbacks = {
      onListeningChange: setListening,
      onMicrophoneAvailabilityChange: setMicrophoneAvailable,
      onTranscriptChange: handleTranscriptChange,
      onClearTranscript: handleClearTranscript,
      onBrowserSupportsSpeechRecognitionChange: setBrowserSupportsSpeechRecognition,
      onBrowserSupportsContinuousListeningChange: setBrowserSupportsContinuousListening
    };
    recognitionManager2.subscribe(id, callbacks);
    return () => {
      recognitionManager2.unsubscribe(id);
    };
  }, [
    transcribing,
    clearTranscriptOnListen,
    recognitionManager2,
    handleTranscriptChange,
    handleClearTranscript
  ]);
  const transcript = concatTranscripts(finalTranscript, interimTranscript);
  return {
    transcript,
    interimTranscript,
    finalTranscript,
    listening,
    isMicrophoneAvailable,
    resetTranscript,
    browserSupportsSpeechRecognition,
    browserSupportsContinuousListening
  };
};
var SpeechRecognition = {
  counter: 0,
  applyPolyfill: (PolyfillSpeechRecognition) => {
    if (recognitionManager) {
      recognitionManager.setSpeechRecognition(PolyfillSpeechRecognition);
    } else {
      recognitionManager = new RecognitionManager(PolyfillSpeechRecognition);
    }
    const browserSupportsPolyfill = !!PolyfillSpeechRecognition && browserSupportsPolyfills();
    _browserSupportsSpeechRecognition = browserSupportsPolyfill;
    _browserSupportsContinuousListening = browserSupportsPolyfill;
  },
  removePolyfill: () => {
    if (recognitionManager) {
      recognitionManager.setSpeechRecognition(NativeSpeechRecognition);
    } else {
      recognitionManager = new RecognitionManager(NativeSpeechRecognition);
    }
    _browserSupportsSpeechRecognition = !!NativeSpeechRecognition;
    _browserSupportsContinuousListening = _browserSupportsSpeechRecognition && !isAndroid();
  },
  getRecognitionManager: () => {
    if (!recognitionManager) {
      recognitionManager = new RecognitionManager(NativeSpeechRecognition);
    }
    return recognitionManager;
  },
  getRecognition: () => {
    const recognitionManager2 = SpeechRecognition.getRecognitionManager();
    return recognitionManager2.getRecognition();
  },
  startListening: ({ continuous, language } = {}) => _async_to_generator(function* () {
    const recognitionManager2 = SpeechRecognition.getRecognitionManager();
    yield recognitionManager2.startListening({
      continuous,
      language
    });
  })(),
  stopListening: () => _async_to_generator(function* () {
    const recognitionManager2 = SpeechRecognition.getRecognitionManager();
    yield recognitionManager2.stopListening();
  })(),
  abortListening: () => _async_to_generator(function* () {
    const recognitionManager2 = SpeechRecognition.getRecognitionManager();
    yield recognitionManager2.abortListening();
  })(),
  browserSupportsSpeechRecognition: () => _browserSupportsSpeechRecognition,
  browserSupportsContinuousListening: () => _browserSupportsContinuousListening
};
export {
  SpeechRecognition as default,
  useSpeechRecognition
};
//# sourceMappingURL=react-speech-recognition.js.map
