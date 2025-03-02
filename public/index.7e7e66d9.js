
      var $parcel$global = globalThis;
    
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequire94c2"];

if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      var init = $parcel$inits[id];
      delete $parcel$inits[id];
      var module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequire94c2"] = parcelRequire;
}

var parcelRegister = parcelRequire.register;
parcelRegister("dU2vF", function(module, exports) {








/*!
 * HyperMD, copyright (c) by laobubu
 * Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
 *
 * Break the Wall between writing and preview, in a Markdown Editor.
 *
 * HyperMD makes Markdown editor on web WYSIWYG, based on CodeMirror
 *
 * Homepage: http://laobubu.net/HyperMD/
 * Issues: https://github.com/laobubu/HyperMD/issues
 */ (function(global, factory) {
    factory(module.exports, (parcelRequire("aYIk2")), (parcelRequire("4KDU0")), (parcelRequire("5oR4k")), (parcelRequire("kcqjG")), (parcelRequire("bzGfa")), {}, {}, {});
})(module.exports, function(exports1, CodeMirror) {
    'use strict';
    /**
   * Provides some common PolyFill
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */ if (typeof Object['assign'] != 'function') // Must be writable: true, enumerable: false, configurable: true
    Object.defineProperty(Object, "assign", {
        value: function assign(target, varArgs) {
            var arguments$1 = arguments;
            if (target == null) throw new TypeError('Cannot convert undefined or null to object');
            var to = Object(target);
            for(var index = 1; index < arguments.length; index++){
                var nextSource = arguments$1[index];
                if (nextSource != null) {
                    for(var nextKey in nextSource)// Avoid bugs when hasOwnProperty is shadowed
                    if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) to[nextKey] = nextSource[nextKey];
                }
            }
            return to;
        },
        writable: true,
        configurable: true
    });
    /**
   * Provides some universal utils
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */ /** Simple FlipFlop */ var FlipFlop = function(on_cb, off_cb, state, subkey) {
        if (state === void 0) state = false;
        if (subkey === void 0) subkey = "enabled";
        this.on_cb = on_cb;
        this.off_cb = off_cb;
        this.state = state;
        this.subkey = subkey;
    };
    /** set a callback when state is changed and is **NOT** `null`, `false` etc. */ FlipFlop.prototype.ON = function(callback) {
        this.on_cb = callback;
        return this;
    };
    /** set a callback when state is set to `null`, `false` etc. */ FlipFlop.prototype.OFF = function(callback) {
        this.off_cb = callback;
        return this;
    };
    /**
   * Update FlipFlop status, and trig callback function if needed
   *
   * @param {T|object} state new status value. can be a object
   * @param {boolean} [toBool] convert retrived value to boolean. default: false
   */ FlipFlop.prototype.set = function(state, toBool) {
        var newVal = typeof state === 'object' && state ? state[this.subkey] : state;
        if (toBool) newVal = !!newVal;
        if (newVal === this.state) return;
        if (this.state = newVal) this.on_cb && this.on_cb(newVal);
        else this.off_cb && this.off_cb(newVal);
    };
    FlipFlop.prototype.setBool = function(state) {
        return this.set(state, true);
    };
    /**
   * Bind to a object's property with `Object.defineProperty`
   * so that you may set state with `obj.enable = true`
   */ FlipFlop.prototype.bind = function(obj, key, toBool) {
        var this$1 = this;
        Object.defineProperty(obj, key, {
            get: function() {
                return this$1.state;
            },
            set: function(v) {
                return this$1.set(v, toBool);
            },
            configurable: true,
            enumerable: true
        });
        return this;
    };
    /** async run a function, and retry up to N times until it returns true */ function tryToRun(fn, times, onFailed) {
        times = ~~times || 5;
        var delayTime = 250;
        function nextCycle() {
            if (!times--) {
                if (onFailed) onFailed();
                return;
            }
            try {
                if (fn()) return;
            } catch (e) {}
            setTimeout(nextCycle, delayTime);
            delayTime *= 2;
        }
        setTimeout(nextCycle, 0);
    }
    /**
   * make a debounced function
   *
   * @param {Function} fn
   * @param {number} delay in ms
   */ function debounce(fn, delay) {
        var deferTask = null;
        var notClearBefore = 0;
        var run = function() {
            fn();
            deferTask = 0;
        };
        var ans = function() {
            var nowTime = +new Date();
            if (deferTask) {
                if (nowTime < notClearBefore) return;
                else clearTimeout(deferTask);
            }
            deferTask = setTimeout(run, delay);
            notClearBefore = nowTime + 100; // allow 100ms error
        };
        ans.stop = function() {
            if (!deferTask) return;
            clearTimeout(deferTask);
            deferTask = 0;
        };
        return ans;
    }
    /**
   * addClass / removeClass etc.
   *
   * using CodeMirror's (although they're legacy API)
   */ var addClass = CodeMirror.addClass;
    var rmClass = CodeMirror.rmClass;
    var contains = CodeMirror.contains;
    /**
   * a fallback for new Array(count).fill(data)
   */ function repeat(item, count) {
        var ans = new Array(count);
        if (ans['fill']) ans['fill'](item);
        else for(var i = 0; i < count; i++)ans[i] = item;
        return ans;
    }
    function repeatStr(item, count) {
        var ans = "";
        while(count-- > 0)ans += item;
        return ans;
    }
    /**
   * Visit element nodes and their children
   */ function visitElements(seeds, handler) {
        var queue = [
            seeds
        ], tmp;
        while(tmp = queue.shift())for(var i = 0; i < tmp.length; i++){
            var el = tmp[i];
            if (!el || el.nodeType != Node.ELEMENT_NODE) continue;
            handler(el);
            if (el.children && el.children.length > 0) queue.push(el.children);
        }
    }
    /**
   * A lazy and simple Element size watcher. NOT WORK with animations
   */ function watchSize(el, onChange, needPoll) {
        var ref = el.getBoundingClientRect();
        var width = ref.width;
        var height = ref.height;
        /** check size and trig onChange */ var check = debounce(function() {
            var rect = el.getBoundingClientRect();
            var newWidth = rect.width;
            var newHeight = rect.height;
            if (width != newWidth || height != newHeight) {
                onChange(newWidth, newHeight, width, height);
                width = newWidth;
                height = newHeight;
                setTimeout(check, 200); // maybe changed again later?
            }
        }, 100);
        var nextTimer = null;
        function pollOnce() {
            if (nextTimer) clearTimeout(nextTimer);
            if (!stopped) nextTimer = setTimeout(pollOnce, 200);
            check();
        }
        var stopped = false;
        function stop() {
            stopped = true;
            check.stop();
            if (nextTimer) {
                clearTimeout(nextTimer);
                nextTimer = null;
            }
            for(var i = 0; i < eventBinded.length; i++)eventBinded[i][0].removeEventListener(eventBinded[i][1], check, false);
        }
        var eventBinded = [];
        function bindEvents(el) {
            var tagName = el.tagName;
            var computedStyle = getComputedStyle(el);
            var getStyle = function(name) {
                return computedStyle.getPropertyValue(name) || '';
            };
            if (getStyle("resize") != 'none') needPoll = true;
            // size changes if loaded
            if (/^(?:img|video)$/i.test(tagName)) {
                el.addEventListener('load', check, false);
                el.addEventListener('error', check, false);
            } else if (/^(?:details|summary)$/i.test(tagName)) el.addEventListener('click', check, false);
        }
        if (!needPoll) visitElements([
            el
        ], bindEvents);
        // bindEvents will update `needPoll`
        if (needPoll) nextTimer = setTimeout(pollOnce, 200);
        return {
            check: check,
            stop: stop
        };
    }
    function makeSymbol(name) {
        if (typeof Symbol === 'function') return Symbol(name);
        return "_\n" + name + "\n_" + Math.floor(Math.random() * 0xFFFF).toString(16);
    }
    /**
   * Ready-to-use functions that powers up your Markdown editor
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */ // if (HyperMD_Mark in editor), the editor was a HyperMD mode at least once
    var HyperMD_Mark = '__hypermd__';
    /**
   * The default configuration that used by `HyperMD.fromTextArea`
   *
   * Addons may update this object freely!
   */ var suggestedEditorConfig = {
        lineNumbers: true,
        lineWrapping: true,
        theme: "hypermd-light",
        mode: "text/x-hypermd",
        tabSize: 4,
        autoCloseBrackets: true,
        foldGutter: true,
        gutters: [
            "CodeMirror-linenumbers",
            "CodeMirror-foldgutter",
            "HyperMD-goback" // (addon: click) 'back' button for footnotes
        ]
    };
    /**
   * Editor Options that disable HyperMD WYSIWYG visual effects.
   * These option will be applied when user invoke `switchToNormal`.
   *
   * Addons about visual effects, shall update this object!
   */ var normalVisualConfig = {
        theme: "default"
    };
    /**
   * Initialize an editor from a <textarea>
   * Calling `CodeMirror.fromTextArea` with recommended HyperMD options
   *
   * @see CodeMirror.fromTextArea
   *
   * @param {HTMLTextAreaElement} textArea
   * @param {object} [config]
   * @returns {cm_t}
   */ function fromTextArea(textArea, config) {
        var final_config = Object.assign({}, suggestedEditorConfig, config);
        var cm = CodeMirror.fromTextArea(textArea, final_config);
        cm[HyperMD_Mark] = true;
        return cm;
    }
    function switchToNormal(editor, options_or_theme) {
        // this CodeMirror editor has never been in HyperMD mode. `switchToNormal` is meanless
        if (!editor[HyperMD_Mark]) return;
        if (typeof options_or_theme === 'string') options_or_theme = {
            theme: options_or_theme
        };
        var opt = Object.assign({}, normalVisualConfig, options_or_theme);
        for(var key in opt)editor.setOption(key, opt[key]);
    }
    function switchToHyperMD(editor, options_or_theme) {
        if (typeof options_or_theme === 'string') options_or_theme = {
            theme: options_or_theme
        };
        var opt = {};
        if (HyperMD_Mark in editor) {
            // has been HyperMD mode once. Only modify visual-related options
            for(var key in normalVisualConfig)opt[key] = suggestedEditorConfig[key];
            Object.assign(opt, options_or_theme);
        } else {
            // this CodeMirror editor is new to HyperMD
            Object.assign(opt, suggestedEditorConfig, options_or_theme);
            editor[HyperMD_Mark] = true;
        }
        for(var key$1 in opt)editor.setOption(key$1, opt[key$1]);
    }
    /**
    @internal DO NOT IMPORT THIS MODULE!
              If you want to use this module, import it from `core`:

                  import { cm_internal } from "../core"

    The following few functions are from CodeMirror's source code.

    MIT License

    Copyright (C) 2017 by Marijn Haverbeke <marijnh@gmail.com> and others

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
    all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
    THE SOFTWARE.

    */ /**
   * Find the view element corresponding to a given line. Return null when the line isn't visible.
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   * @param n lineNo
   */ function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo) return null;
        n -= cm.display.viewFrom;
        if (n < 0) return null;
        var view = cm.display.view;
        for(var i = 0; i < view.length; i++){
            n -= view[i].size;
            if (n < 0) return i;
        }
    }
    /**
   * Find a line view that corresponds to the given line number.
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   */ function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) return cm.display.view[findViewIndex(cm, lineN)];
        var ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) return ext;
    }
    /**
   * Find a line map (mapping character offsets to text nodes) and a
   * measurement cache for the given line number. (A line view might
   * contain multiple lines when collapsed ranges are present.)
   *
   * @see codemirror\src\measurement\position_measurement.js 5.37.0
   */ function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line) return {
            map: lineView.measure.map,
            cache: lineView.measure.cache,
            before: false
        };
        for(var i = 0; i < lineView.rest.length; i++){
            if (lineView.rest[i] == line) return {
                map: lineView.measure.maps[i],
                cache: lineView.measure.caches[i],
                before: false
            };
        }
        for(var i$1 = 0; i$1 < lineView.rest.length; i$1++){
            if (lineView.rest[i$1].lineNo() > lineN) return {
                map: lineView.measure.maps[i$1],
                cache: lineView.measure.caches[i$1],
                before: true
            };
        }
    }
    var cm_internal = /*#__PURE__*/ Object.freeze({
        findViewIndex: findViewIndex,
        findViewForLine: findViewForLine,
        mapFromLineView: mapFromLineView
    });
    /**
   * CodeMirror-related utils
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */ /**
   * Useful tool to seek for tokens
   *
   *     var seeker = new TokenSeeker(cm)
   *     seeker.setPos(0, 0) // set to line 0, char 0
   *     var ans = seeker.findNext(/fomratting-em/)
   *
   */ var TokenSeeker = function(cm) {
        this.cm = cm;
    };
    TokenSeeker.prototype.findNext = function(condition, varg, since) {
        var lineNo = this.lineNo;
        var tokens = this.lineTokens;
        var token = null;
        var i_token = this.i_token + 1;
        var maySpanLines = false;
        if (varg === true) maySpanLines = true;
        else if (typeof varg === 'number') i_token = varg;
        if (since) {
            if (since.line > lineNo) i_token = tokens.length; // just ignore current line
            else if (since.line < lineNo) ;
            else for(; i_token < tokens.length; i_token++){
                if (tokens[i_token].start >= since.ch) break;
            }
        }
        for(; i_token < tokens.length; i_token++){
            var token_tmp = tokens[i_token];
            if (typeof condition === "function" ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                token = token_tmp;
                break;
            }
        }
        if (!token && maySpanLines) {
            var cm = this.cm;
            var startLine = Math.max(since ? since.line : 0, lineNo + 1);
            cm.eachLine(startLine, cm.lastLine() + 1, function(line_i) {
                lineNo = line_i.lineNo();
                tokens = cm.getLineTokens(lineNo);
                i_token = 0;
                if (since && lineNo === since.line) for(; i_token < tokens.length; i_token++){
                    if (tokens[i_token].start >= since.ch) break;
                }
                for(; i_token < tokens.length; i_token++){
                    var token_tmp = tokens[i_token];
                    if (typeof condition === "function" ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                        token = token_tmp;
                        return true; // stop `eachLine`
                    }
                }
            });
        }
        return token ? {
            lineNo: lineNo,
            token: token,
            i_token: i_token
        } : null;
    };
    TokenSeeker.prototype.findPrev = function(condition, varg, since) {
        var lineNo = this.lineNo;
        var tokens = this.lineTokens;
        var token = null;
        var i_token = this.i_token - 1;
        var maySpanLines = false;
        if (varg === true) maySpanLines = true;
        else if (typeof varg === 'number') i_token = varg;
        if (since) {
            if (since.line < lineNo) i_token = -1; // just ignore current line
            else if (since.line > lineNo) ;
            else for(; i_token < tokens.length; i_token++){
                if (tokens[i_token].start >= since.ch) break;
            }
        }
        if (i_token >= tokens.length) i_token = tokens.length - 1;
        for(; i_token >= 0; i_token--){
            var token_tmp = tokens[i_token];
            if (typeof condition === "function" ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                token = token_tmp;
                break;
            }
        }
        if (!token && maySpanLines) {
            var cm = this.cm;
            var startLine = Math.min(since ? since.line : cm.lastLine(), lineNo - 1);
            var endLine = cm.firstLine();
            // cm.eachLine doesn't support reversed searching
            // use while... loop to iterate
            lineNo = startLine + 1;
            while(!token && endLine <= --lineNo){
                var line_i = cm.getLineHandle(lineNo);
                tokens = cm.getLineTokens(lineNo);
                i_token = 0;
                if (since && lineNo === since.line) for(; i_token < tokens.length; i_token++){
                    if (tokens[i_token].start >= since.ch) break;
                }
                if (i_token >= tokens.length) i_token = tokens.length - 1;
                for(; i_token >= 0; i_token--){
                    var token_tmp = tokens[i_token];
                    if (typeof condition === "function" ? condition(token_tmp, tokens, i_token) : condition.test(token_tmp.type)) {
                        token = token_tmp;
                        break; // FOUND token !
                    }
                }
            }
        }
        return token ? {
            lineNo: lineNo,
            token: token,
            i_token: i_token
        } : null;
    };
    /**
   * return a range in which every token has the same style, or meet same condition
   */ TokenSeeker.prototype.expandRange = function(style, maySpanLines) {
        var cm = this.cm;
        var isStyled;
        if (typeof style === "function") isStyled = style;
        else {
            if (typeof style === "string") style = new RegExp("(?:^|\\s)" + style + "(?:\\s|$)");
            isStyled = function(token) {
                return token ? style.test(token.type || "") : false;
            };
        }
        var from = {
            lineNo: this.lineNo,
            i_token: this.i_token,
            token: this.lineTokens[this.i_token]
        };
        var to = Object.assign({}, from);
        // find left
        var foundUnstyled = false, tokens = this.lineTokens, i = this.i_token;
        while(!foundUnstyled){
            if (i >= tokens.length) i = tokens.length - 1;
            for(; i >= 0; i--){
                var token = tokens[i];
                if (!isStyled(token, tokens, i)) {
                    foundUnstyled = true;
                    break;
                } else {
                    from.i_token = i;
                    from.token = token;
                }
            }
            if (foundUnstyled || !(maySpanLines && from.lineNo > cm.firstLine())) break;
             // found, or no more lines
            tokens = cm.getLineTokens(--from.lineNo);
            i = tokens.length - 1;
        }
        // find right
        var foundUnstyled = false, tokens = this.lineTokens, i = this.i_token;
        while(!foundUnstyled){
            if (i < 0) i = 0;
            for(; i < tokens.length; i++){
                var token$1 = tokens[i];
                if (!isStyled(token$1, tokens, i)) {
                    foundUnstyled = true;
                    break;
                } else {
                    to.i_token = i;
                    to.token = token$1;
                }
            }
            if (foundUnstyled || !(maySpanLines && to.lineNo < cm.lastLine())) break;
             // found, or no more lines
            tokens = cm.getLineTokens(++to.lineNo);
            i = 0;
        }
        return {
            from: from,
            to: to
        };
    };
    TokenSeeker.prototype.setPos = function(line, ch, precise) {
        if (ch === void 0) {
            ch = line;
            line = this.line;
        } else if (typeof line === 'number') line = this.cm.getLineHandle(line);
        var sameLine = line === this.line;
        var i_token = 0;
        if (precise || !sameLine) {
            this.line = line;
            this.lineNo = line.lineNo();
            this.lineTokens = this.cm.getLineTokens(this.lineNo);
        } else {
            // try to speed-up seeking
            i_token = this.i_token;
            var token = this.lineTokens[i_token];
            if (token.start > ch) i_token = 0;
        }
        var tokens = this.lineTokens;
        for(; i_token < tokens.length; i_token++){
            if (tokens[i_token].end > ch) break;
             // found
        }
        this.i_token = i_token;
    };
    /** get (current or idx-th) token */ TokenSeeker.prototype.getToken = function(idx) {
        if (typeof idx !== 'number') idx = this.i_token;
        return this.lineTokens[idx];
    };
    /** get (current or idx-th) token type. always return a string */ TokenSeeker.prototype.getTokenType = function(idx) {
        if (typeof idx !== 'number') idx = this.i_token;
        var t = this.lineTokens[idx];
        return t && t.type || "";
    };
    /**
   * CodeMirror's `getLineTokens` might merge adjacent chars with same styles,
   * but this one won't.
   *
   * This one will consume more memory.
   *
   * @param {CodeMirror.LineHandle} line
   * @returns {string[]} every char's style
   */ function getEveryCharToken(line) {
        var ans = new Array(line.text.length);
        var ss = line.styles;
        var i = 0;
        if (ss) // CodeMirror already parsed this line. Use cache
        for(var j = 1; j < ss.length; j += 2){
            var i_to = ss[j], s = ss[j + 1];
            while(i < i_to)ans[i++] = s;
        }
        else {
            // Emmm... slow method
            var cm = line.parent.cm || line.parent.parent.cm || line.parent.parent.parent.cm;
            var ss$1 = cm.getLineTokens(line.lineNo());
            for(var j$1 = 0; j$1 < ss$1.length; j$1++){
                var i_to$1 = ss$1[j$1].end, s$1 = ss$1[j$1].type;
                while(i < i_to$1)ans[i++] = s$1;
            }
        }
        return ans;
    }
    /**
   * return a range in which every char has the given style (aka. token type).
   * assuming char at `pos` already has the style.
   *
   * the result will NOT span lines.
   *
   * @param style aka. token type
   * @see TokenSeeker if you want to span lines
   */ function expandRange(cm, pos, style) {
        var line = pos.line;
        var from = {
            line: line,
            ch: 0
        };
        var to = {
            line: line,
            ch: pos.ch
        };
        var styleFn = typeof style === "function" ? style : false;
        var styleRE = !styleFn && new RegExp("(?:^|\\s)" + style + "(?:\\s|$)");
        var tokens = cm.getLineTokens(line);
        var iSince;
        for(iSince = 0; iSince < tokens.length; iSince++){
            if (tokens[iSince].end >= pos.ch) break;
        }
        if (iSince === tokens.length) return null;
        for(var i = iSince; i < tokens.length; i++){
            var token = tokens[i];
            if (styleFn ? styleFn(token) : styleRE.test(token.type)) to.ch = token.end;
            else break;
        }
        for(var i = iSince; i >= 0; i--){
            var token = tokens[i];
            if (!(styleFn ? styleFn(token) : styleRE.test(token.type))) {
                from.ch = token.end;
                break;
            }
        }
        return {
            from: from,
            to: to
        };
    }
    /**
   * Get ordered range from `CodeMirror.Range`-like object or `[Position, Position]`
   *
   * In an ordered range, The first `Position` must NOT be after the second.
   */ function orderedRange(range) {
        if ('anchor' in range) range = [
            range.head,
            range.anchor
        ];
        if (CodeMirror.cmpPos(range[0], range[1]) > 0) return [
            range[1],
            range[0]
        ];
        else return [
            range[0],
            range[1]
        ];
    }
    /**
   * Check if two range has intersection.
   *
   * @param range1 ordered range 1  (start <= end)
   * @param range2 ordered range 2  (start <= end)
   */ function rangesIntersect(range1, range2) {
        var from1 = range1[0];
        var to1 = range1[1];
        var from2 = range2[0];
        var to2 = range2[1];
        return !(CodeMirror.cmpPos(to1, from2) < 0 || CodeMirror.cmpPos(from1, to2) > 0);
    }
    /**
   * Post-process CodeMirror-mode-parsed lines, find the ranges
   *
   * for example, a parsed line `[**Hello** World](xxx.txt)` will gives you:
   *
   * 1. link from `[` to `)`
   * 2. bold text from `**` to another `**`
   */ var LineSpanExtractor = function(cm) {
        var this$1 = this;
        this.cm = cm;
        this.caches = new Array(); // cache for each lines
        cm.on("change", function(cm, change) {
            var line = change.from.line;
            if (this$1.caches.length > line) this$1.caches.splice(line);
        });
    };
    LineSpanExtractor.prototype.getTokenTypes = function(token, prevToken) {
        var prevState = prevToken ? prevToken.state : {};
        var state = token.state;
        var styles = ' ' + token.type + ' ';
        var ans = {
            // em
            em: state.em ? 1 /* IS_THIS_TYPE */  : prevState.em ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // strikethrough
            strikethrough: state.strikethrough ? 1 /* IS_THIS_TYPE */  : prevState.strikethrough ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // strong
            strong: state.strong ? 1 /* IS_THIS_TYPE */  : prevState.strong ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // code
            code: state.code ? 1 /* IS_THIS_TYPE */  : prevState.code ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // linkText
            linkText: state.linkText ? state.hmdLinkType === 3 /* NORMAL */  || state.hmdLinkType === 6 /* BARELINK2 */  ? 1 /* IS_THIS_TYPE */  : 0 /* NOTHING */  : prevState.linkText ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // linkHref
            linkHref: state.linkHref && !state.linkText ? 1 /* IS_THIS_TYPE */  : !state.linkHref && !state.linkText && prevState.linkHref && !prevState.linkText ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // task checkbox
            task: styles.indexOf(' formatting-task ') !== -1 ? 3 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ ,
            // hashtag
            hashtag: state.hmdHashtag ? 1 /* IS_THIS_TYPE */  : prevState.hmdHashtag ? 2 /* LEAVING_THIS_TYPE */  : 0 /* NOTHING */ 
        };
        return ans;
    };
    /** get spans from a line and update the cache */ LineSpanExtractor.prototype.extract = function(lineNo, precise) {
        var this$1 = this;
        if (!precise) {
            var cc = this.caches[lineNo];
            if (cc) return cc;
        }
        var tokens = this.cm.getLineTokens(lineNo);
        var lineText = this.cm.getLine(lineNo);
        var lineLength = lineText.length;
        var ans = [];
        var unclosed = {};
        for(var i = 0; i < tokens.length; i++){
            var token = tokens[i];
            var types = this$1.getTokenTypes(token, tokens[i - 1]);
            for(var type in types){
                var span = unclosed[type];
                if (types[type] & 1 /* IS_THIS_TYPE */ ) {
                    if (!span) {
                        span = {
                            type: type,
                            begin: token.start,
                            end: lineLength,
                            head: token,
                            head_i: i,
                            tail: tokens[tokens.length - 1],
                            tail_i: tokens.length - 1,
                            text: lineText.slice(token.start)
                        };
                        ans.push(span);
                        unclosed[type] = span;
                    }
                }
                if (types[type] & 2 /* LEAVING_THIS_TYPE */ ) {
                    if (span) {
                        span.tail = token;
                        span.tail_i = i;
                        span.end = token.end;
                        span.text = span.text.slice(0, span.end - span.begin);
                        unclosed[type] = null;
                    }
                }
            }
        }
        this.caches[lineNo] = ans;
        return ans;
    };
    LineSpanExtractor.prototype.findSpansAt = function(pos) {
        var spans = this.extract(pos.line);
        var ch = pos.ch;
        var ans = [];
        for(var i = 0; i < spans.length; i++){
            var span = spans[i];
            if (span.begin > ch) break;
            if (ch >= span.begin && span.end >= ch) ans.push(span);
        }
        return ans;
    };
    LineSpanExtractor.prototype.findSpanWithTypeAt = function(pos, type) {
        var spans = this.extract(pos.line);
        var ch = pos.ch;
        for(var i = 0; i < spans.length; i++){
            var span = spans[i];
            if (span.begin > ch) break;
            if (ch >= span.begin && span.end >= ch && span.type === type) return span;
        }
        return null;
    };
    var extractor_symbol = makeSymbol("LineSpanExtractor");
    /**
   * Get a `LineSpanExtractor` to extract spans from CodeMirror parsed lines
   *
   * for example, a parsed line `[**Hello** World](xxx.txt)` will gives you:
   *
   * 1. link from `[` to `)`
   * 2. bold text from `**` to another `**`
   */ function getLineSpanExtractor(cm) {
        if (extractor_symbol in cm) return cm[extractor_symbol];
        var inst = cm[extractor_symbol] = new LineSpanExtractor(cm);
        return inst;
    }
    /**
   * Utils for HyperMD addons
   *
   * @internal Part of HyperMD core.
   *
   * You shall NOT import this file; please import "core" instead
   */ var Addon = function(cm) {};
    /** make a Singleton getter */ function Getter(name, ClassCtor, defaultOption) {
        return function(cm) {
            if (!cm.hmd) cm.hmd = {};
            if (!cm.hmd[name]) {
                var inst = new ClassCtor(cm);
                cm.hmd[name] = inst;
                if (defaultOption) for(var k in defaultOption)inst[k] = defaultOption[k];
                return inst;
            }
            return cm.hmd[name];
        };
    }
    var addon = /*#__PURE__*/ Object.freeze({
        Addon: Addon,
        Getter: Getter
    });
    exports1.cmpPos = CodeMirror.cmpPos;
    exports1.Addon = addon;
    exports1.FlipFlop = FlipFlop;
    exports1.tryToRun = tryToRun;
    exports1.debounce = debounce;
    exports1.addClass = addClass;
    exports1.rmClass = rmClass;
    exports1.contains = contains;
    exports1.repeat = repeat;
    exports1.repeatStr = repeatStr;
    exports1.visitElements = visitElements;
    exports1.watchSize = watchSize;
    exports1.makeSymbol = makeSymbol;
    exports1.suggestedEditorConfig = suggestedEditorConfig;
    exports1.normalVisualConfig = normalVisualConfig;
    exports1.fromTextArea = fromTextArea;
    exports1.switchToNormal = switchToNormal;
    exports1.switchToHyperMD = switchToHyperMD;
    exports1.cm_internal = cm_internal;
    exports1.TokenSeeker = TokenSeeker;
    exports1.getEveryCharToken = getEveryCharToken;
    exports1.expandRange = expandRange;
    exports1.orderedRange = orderedRange;
    exports1.rangesIntersect = rangesIntersect;
    exports1.getLineSpanExtractor = getLineSpanExtractor;
    Object.defineProperty(exports1, '__esModule', {
        value: true
    });
});

});
parcelRegister("aYIk2", function(module, exports) {
// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
// This is CodeMirror (https://codemirror.net/5), a code editor
// implemented in JavaScript on top of the browser's DOM.
//
// You can find some technical background for some of the code below
// at http://marijnhaverbeke.nl/blog/#cm-internals .
(function(global, factory) {
    module.exports = factory();
})(module.exports, function() {
    'use strict';
    // Kludges for bugs and behavior differences that can't be feature
    // detected are enabled based on userAgent etc sniffing.
    var userAgent = navigator.userAgent;
    var platform = navigator.platform;
    var gecko = /gecko\/\d/i.test(userAgent);
    var ie_upto10 = /MSIE \d/.test(userAgent);
    var ie_11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(userAgent);
    var edge = /Edge\/(\d+)/.exec(userAgent);
    var ie = ie_upto10 || ie_11up || edge;
    var ie_version = ie && (ie_upto10 ? document.documentMode || 6 : +(edge || ie_11up)[1]);
    var webkit = !edge && /WebKit\//.test(userAgent);
    var qtwebkit = webkit && /Qt\/\d+\.\d+/.test(userAgent);
    var chrome = !edge && /Chrome\/(\d+)/.exec(userAgent);
    var chrome_version = chrome && +chrome[1];
    var presto = /Opera\//.test(userAgent);
    var safari = /Apple Computer/.test(navigator.vendor);
    var mac_geMountainLion = /Mac OS X 1\d\D([8-9]|\d\d)\D/.test(userAgent);
    var phantom = /PhantomJS/.test(userAgent);
    var ios = safari && (/Mobile\/\w+/.test(userAgent) || navigator.maxTouchPoints > 2);
    var android = /Android/.test(userAgent);
    // This is woefully incomplete. Suggestions for alternative methods welcome.
    var mobile = ios || android || /webOS|BlackBerry|Opera Mini|Opera Mobi|IEMobile/i.test(userAgent);
    var mac = ios || /Mac/.test(platform);
    var chromeOS = /\bCrOS\b/.test(userAgent);
    var windows = /win/i.test(platform);
    var presto_version = presto && userAgent.match(/Version\/(\d*\.\d*)/);
    if (presto_version) presto_version = Number(presto_version[1]);
    if (presto_version && presto_version >= 15) {
        presto = false;
        webkit = true;
    }
    // Some browsers use the wrong event properties to signal cmd/ctrl on OS X
    var flipCtrlCmd = mac && (qtwebkit || presto && (presto_version == null || presto_version < 12.11));
    var captureRightClick = gecko || ie && ie_version >= 9;
    function classTest(cls) {
        return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
    }
    var rmClass = function(node, cls) {
        var current = node.className;
        var match = classTest(cls).exec(current);
        if (match) {
            var after = current.slice(match.index + match[0].length);
            node.className = current.slice(0, match.index) + (after ? match[1] + after : "");
        }
    };
    function removeChildren(e) {
        for(var count = e.childNodes.length; count > 0; --count)e.removeChild(e.firstChild);
        return e;
    }
    function removeChildrenAndAdd(parent, e) {
        return removeChildren(parent).appendChild(e);
    }
    function elt(tag, content, className, style) {
        var e = document.createElement(tag);
        if (className) e.className = className;
        if (style) e.style.cssText = style;
        if (typeof content == "string") e.appendChild(document.createTextNode(content));
        else if (content) for(var i = 0; i < content.length; ++i)e.appendChild(content[i]);
        return e;
    }
    // wrapper for elt, which removes the elt from the accessibility tree
    function eltP(tag, content, className, style) {
        var e = elt(tag, content, className, style);
        e.setAttribute("role", "presentation");
        return e;
    }
    var range;
    if (document.createRange) range = function(node, start, end, endNode) {
        var r = document.createRange();
        r.setEnd(endNode || node, end);
        r.setStart(node, start);
        return r;
    };
    else range = function(node, start, end) {
        var r = document.body.createTextRange();
        try {
            r.moveToElementText(node.parentNode);
        } catch (e) {
            return r;
        }
        r.collapse(true);
        r.moveEnd("character", end);
        r.moveStart("character", start);
        return r;
    };
    function contains(parent, child) {
        if (child.nodeType == 3) child = child.parentNode;
        if (parent.contains) return parent.contains(child);
        do {
            if (child.nodeType == 11) child = child.host;
            if (child == parent) return true;
        }while (child = child.parentNode);
    }
    function activeElt(rootNode) {
        // IE and Edge may throw an "Unspecified Error" when accessing document.activeElement.
        // IE < 10 will throw when accessed while the page is loading or in an iframe.
        // IE > 9 and Edge will throw when accessed in an iframe if document.body is unavailable.
        var doc = rootNode.ownerDocument || rootNode;
        var activeElement;
        try {
            activeElement = rootNode.activeElement;
        } catch (e) {
            activeElement = doc.body || null;
        }
        while(activeElement && activeElement.shadowRoot && activeElement.shadowRoot.activeElement)activeElement = activeElement.shadowRoot.activeElement;
        return activeElement;
    }
    function addClass(node, cls) {
        var current = node.className;
        if (!classTest(cls).test(current)) node.className += (current ? " " : "") + cls;
    }
    function joinClasses(a, b) {
        var as = a.split(" ");
        for(var i = 0; i < as.length; i++)if (as[i] && !classTest(as[i]).test(b)) b += " " + as[i];
        return b;
    }
    var selectInput = function(node) {
        node.select();
    };
    if (ios) selectInput = function(node) {
        node.selectionStart = 0;
        node.selectionEnd = node.value.length;
    };
    else if (ie) selectInput = function(node) {
        try {
            node.select();
        } catch (_e) {}
    };
    function doc(cm) {
        return cm.display.wrapper.ownerDocument;
    }
    function root(cm) {
        return rootNode(cm.display.wrapper);
    }
    function rootNode(element) {
        // Detect modern browsers (2017+).
        return element.getRootNode ? element.getRootNode() : element.ownerDocument;
    }
    function win(cm) {
        return doc(cm).defaultView;
    }
    function bind(f) {
        var args = Array.prototype.slice.call(arguments, 1);
        return function() {
            return f.apply(null, args);
        };
    }
    function copyObj(obj, target, overwrite) {
        if (!target) target = {};
        for(var prop in obj)if (obj.hasOwnProperty(prop) && (overwrite !== false || !target.hasOwnProperty(prop))) target[prop] = obj[prop];
        return target;
    }
    // Counts the column offset in a string, taking tabs into account.
    // Used mostly to find indentation.
    function countColumn(string, end, tabSize, startIndex, startValue) {
        if (end == null) {
            end = string.search(/[^\s\u00a0]/);
            if (end == -1) end = string.length;
        }
        for(var i = startIndex || 0, n = startValue || 0;;){
            var nextTab = string.indexOf("\t", i);
            if (nextTab < 0 || nextTab >= end) return n + (end - i);
            n += nextTab - i;
            n += tabSize - n % tabSize;
            i = nextTab + 1;
        }
    }
    var Delayed = function() {
        this.id = null;
        this.f = null;
        this.time = 0;
        this.handler = bind(this.onTimeout, this);
    };
    Delayed.prototype.onTimeout = function(self) {
        self.id = 0;
        if (self.time <= +new Date) self.f();
        else setTimeout(self.handler, self.time - +new Date);
    };
    Delayed.prototype.set = function(ms, f) {
        this.f = f;
        var time = +new Date + ms;
        if (!this.id || time < this.time) {
            clearTimeout(this.id);
            this.id = setTimeout(this.handler, ms);
            this.time = time;
        }
    };
    function indexOf(array, elt) {
        for(var i = 0; i < array.length; ++i){
            if (array[i] == elt) return i;
        }
        return -1;
    }
    // Number of pixels added to scroller and sizer to hide scrollbar
    var scrollerGap = 50;
    // Returned or thrown by various protocols to signal 'I'm not
    // handling this'.
    var Pass = {
        toString: function() {
            return "CodeMirror.Pass";
        }
    };
    // Reused option objects for setSelection & friends
    var sel_dontScroll = {
        scroll: false
    }, sel_mouse = {
        origin: "*mouse"
    }, sel_move = {
        origin: "+move"
    };
    // The inverse of countColumn -- find the offset that corresponds to
    // a particular column.
    function findColumn(string, goal, tabSize) {
        for(var pos = 0, col = 0;;){
            var nextTab = string.indexOf("\t", pos);
            if (nextTab == -1) nextTab = string.length;
            var skipped = nextTab - pos;
            if (nextTab == string.length || col + skipped >= goal) return pos + Math.min(skipped, goal - col);
            col += nextTab - pos;
            col += tabSize - col % tabSize;
            pos = nextTab + 1;
            if (col >= goal) return pos;
        }
    }
    var spaceStrs = [
        ""
    ];
    function spaceStr(n) {
        while(spaceStrs.length <= n)spaceStrs.push(lst(spaceStrs) + " ");
        return spaceStrs[n];
    }
    function lst(arr) {
        return arr[arr.length - 1];
    }
    function map(array, f) {
        var out = [];
        for(var i = 0; i < array.length; i++)out[i] = f(array[i], i);
        return out;
    }
    function insertSorted(array, value, score) {
        var pos = 0, priority = score(value);
        while(pos < array.length && score(array[pos]) <= priority)pos++;
        array.splice(pos, 0, value);
    }
    function nothing() {}
    function createObj(base, props) {
        var inst;
        if (Object.create) inst = Object.create(base);
        else {
            nothing.prototype = base;
            inst = new nothing();
        }
        if (props) copyObj(props, inst);
        return inst;
    }
    var nonASCIISingleCaseWordChar = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
    function isWordCharBasic(ch) {
        return /\w/.test(ch) || ch > "\x80" && (ch.toUpperCase() != ch.toLowerCase() || nonASCIISingleCaseWordChar.test(ch));
    }
    function isWordChar(ch, helper) {
        if (!helper) return isWordCharBasic(ch);
        if (helper.source.indexOf("\\w") > -1 && isWordCharBasic(ch)) return true;
        return helper.test(ch);
    }
    function isEmpty(obj) {
        for(var n in obj){
            if (obj.hasOwnProperty(n) && obj[n]) return false;
        }
        return true;
    }
    // Extending unicode characters. A series of a non-extending char +
    // any number of extending chars is treated as a single unit as far
    // as editing and measuring is concerned. This is not fully correct,
    // since some scripts/fonts/browsers also treat other configurations
    // of code points as a group.
    var extendingChars = /[\u0300-\u036f\u0483-\u0489\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u064b-\u065e\u0670\u06d6-\u06dc\u06de-\u06e4\u06e7\u06e8\u06ea-\u06ed\u0711\u0730-\u074a\u07a6-\u07b0\u07eb-\u07f3\u0816-\u0819\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0900-\u0902\u093c\u0941-\u0948\u094d\u0951-\u0955\u0962\u0963\u0981\u09bc\u09be\u09c1-\u09c4\u09cd\u09d7\u09e2\u09e3\u0a01\u0a02\u0a3c\u0a41\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a70\u0a71\u0a75\u0a81\u0a82\u0abc\u0ac1-\u0ac5\u0ac7\u0ac8\u0acd\u0ae2\u0ae3\u0b01\u0b3c\u0b3e\u0b3f\u0b41-\u0b44\u0b4d\u0b56\u0b57\u0b62\u0b63\u0b82\u0bbe\u0bc0\u0bcd\u0bd7\u0c3e-\u0c40\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62\u0c63\u0cbc\u0cbf\u0cc2\u0cc6\u0ccc\u0ccd\u0cd5\u0cd6\u0ce2\u0ce3\u0d3e\u0d41-\u0d44\u0d4d\u0d57\u0d62\u0d63\u0dca\u0dcf\u0dd2-\u0dd4\u0dd6\u0ddf\u0e31\u0e34-\u0e3a\u0e47-\u0e4e\u0eb1\u0eb4-\u0eb9\u0ebb\u0ebc\u0ec8-\u0ecd\u0f18\u0f19\u0f35\u0f37\u0f39\u0f71-\u0f7e\u0f80-\u0f84\u0f86\u0f87\u0f90-\u0f97\u0f99-\u0fbc\u0fc6\u102d-\u1030\u1032-\u1037\u1039\u103a\u103d\u103e\u1058\u1059\u105e-\u1060\u1071-\u1074\u1082\u1085\u1086\u108d\u109d\u135f\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17b7-\u17bd\u17c6\u17c9-\u17d3\u17dd\u180b-\u180d\u18a9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193b\u1a17\u1a18\u1a56\u1a58-\u1a5e\u1a60\u1a62\u1a65-\u1a6c\u1a73-\u1a7c\u1a7f\u1b00-\u1b03\u1b34\u1b36-\u1b3a\u1b3c\u1b42\u1b6b-\u1b73\u1b80\u1b81\u1ba2-\u1ba5\u1ba8\u1ba9\u1c2c-\u1c33\u1c36\u1c37\u1cd0-\u1cd2\u1cd4-\u1ce0\u1ce2-\u1ce8\u1ced\u1dc0-\u1de6\u1dfd-\u1dff\u200c\u200d\u20d0-\u20f0\u2cef-\u2cf1\u2de0-\u2dff\u302a-\u302f\u3099\u309a\ua66f-\ua672\ua67c\ua67d\ua6f0\ua6f1\ua802\ua806\ua80b\ua825\ua826\ua8c4\ua8e0-\ua8f1\ua926-\ua92d\ua947-\ua951\ua980-\ua982\ua9b3\ua9b6-\ua9b9\ua9bc\uaa29-\uaa2e\uaa31\uaa32\uaa35\uaa36\uaa43\uaa4c\uaab0\uaab2-\uaab4\uaab7\uaab8\uaabe\uaabf\uaac1\uabe5\uabe8\uabed\udc00-\udfff\ufb1e\ufe00-\ufe0f\ufe20-\ufe26\uff9e\uff9f]/;
    function isExtendingChar(ch) {
        return ch.charCodeAt(0) >= 768 && extendingChars.test(ch);
    }
    // Returns a number from the range [`0`; `str.length`] unless `pos` is outside that range.
    function skipExtendingChars(str, pos, dir) {
        while((dir < 0 ? pos > 0 : pos < str.length) && isExtendingChar(str.charAt(pos)))pos += dir;
        return pos;
    }
    // Returns the value from the range [`from`; `to`] that satisfies
    // `pred` and is closest to `from`. Assumes that at least `to`
    // satisfies `pred`. Supports `from` being greater than `to`.
    function findFirst(pred, from, to) {
        // At any point we are certain `to` satisfies `pred`, don't know
        // whether `from` does.
        var dir = from > to ? -1 : 1;
        for(;;){
            if (from == to) return from;
            var midF = (from + to) / 2, mid = dir < 0 ? Math.ceil(midF) : Math.floor(midF);
            if (mid == from) return pred(mid) ? from : to;
            if (pred(mid)) to = mid;
            else from = mid + dir;
        }
    }
    // BIDI HELPERS
    function iterateBidiSections(order, from, to, f) {
        if (!order) return f(from, to, "ltr", 0);
        var found = false;
        for(var i = 0; i < order.length; ++i){
            var part = order[i];
            if (part.from < to && part.to > from || from == to && part.to == from) {
                f(Math.max(part.from, from), Math.min(part.to, to), part.level == 1 ? "rtl" : "ltr", i);
                found = true;
            }
        }
        if (!found) f(from, to, "ltr");
    }
    var bidiOther = null;
    function getBidiPartAt(order, ch, sticky) {
        var found;
        bidiOther = null;
        for(var i = 0; i < order.length; ++i){
            var cur = order[i];
            if (cur.from < ch && cur.to > ch) return i;
            if (cur.to == ch) {
                if (cur.from != cur.to && sticky == "before") found = i;
                else bidiOther = i;
            }
            if (cur.from == ch) {
                if (cur.from != cur.to && sticky != "before") found = i;
                else bidiOther = i;
            }
        }
        return found != null ? found : bidiOther;
    }
    // Bidirectional ordering algorithm
    // See http://unicode.org/reports/tr9/tr9-13.html for the algorithm
    // that this (partially) implements.
    // One-char codes used for character types:
    // L (L):   Left-to-Right
    // R (R):   Right-to-Left
    // r (AL):  Right-to-Left Arabic
    // 1 (EN):  European Number
    // + (ES):  European Number Separator
    // % (ET):  European Number Terminator
    // n (AN):  Arabic Number
    // , (CS):  Common Number Separator
    // m (NSM): Non-Spacing Mark
    // b (BN):  Boundary Neutral
    // s (B):   Paragraph Separator
    // t (S):   Segment Separator
    // w (WS):  Whitespace
    // N (ON):  Other Neutrals
    // Returns null if characters are ordered as they appear
    // (left-to-right), or an array of sections ({from, to, level}
    // objects) in the order in which they occur visually.
    var bidiOrdering = function() {
        // Character types for codepoints 0 to 0xff
        var lowTypes = "bbbbbbbbbtstwsbbbbbbbbbbbbbbssstwNN%%%NNNNNN,N,N1111111111NNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNNNLLLLLLLLLLLLLLLLLLLLLLLLLLNNNNbbbbbbsbbbbbbbbbbbbbbbbbbbbbbbbbb,N%%%%NNNNLNNNNN%%11NLNNN1LNNNNNLLLLLLLLLLLLLLLLLLLLLLLNLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLN";
        // Character types for codepoints 0x600 to 0x6f9
        var arabicTypes = "nnnnnnNNr%%r,rNNmmmmmmmmmmmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmmmmmmmmmmmmmmmnnnnnnnnnn%nnrrrmrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrmmmmmmmnNmmmmmmrrmmNmmmmrr1111111111";
        function charType(code) {
            if (code <= 0xf7) return lowTypes.charAt(code);
            else if (0x590 <= code && code <= 0x5f4) return "R";
            else if (0x600 <= code && code <= 0x6f9) return arabicTypes.charAt(code - 0x600);
            else if (0x6ee <= code && code <= 0x8ac) return "r";
            else if (0x2000 <= code && code <= 0x200b) return "w";
            else if (code == 0x200c) return "b";
            else return "L";
        }
        var bidiRE = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
        var isNeutral = /[stwN]/, isStrong = /[LRr]/, countsAsLeft = /[Lb1n]/, countsAsNum = /[1n]/;
        function BidiSpan(level, from, to) {
            this.level = level;
            this.from = from;
            this.to = to;
        }
        return function(str, direction) {
            var outerType = direction == "ltr" ? "L" : "R";
            if (str.length == 0 || direction == "ltr" && !bidiRE.test(str)) return false;
            var len = str.length, types = [];
            for(var i = 0; i < len; ++i)types.push(charType(str.charCodeAt(i)));
            // W1. Examine each non-spacing mark (NSM) in the level run, and
            // change the type of the NSM to the type of the previous
            // character. If the NSM is at the start of the level run, it will
            // get the type of sor.
            for(var i$1 = 0, prev = outerType; i$1 < len; ++i$1){
                var type = types[i$1];
                if (type == "m") types[i$1] = prev;
                else prev = type;
            }
            // W2. Search backwards from each instance of a European number
            // until the first strong type (R, L, AL, or sor) is found. If an
            // AL is found, change the type of the European number to Arabic
            // number.
            // W3. Change all ALs to R.
            for(var i$2 = 0, cur = outerType; i$2 < len; ++i$2){
                var type$1 = types[i$2];
                if (type$1 == "1" && cur == "r") types[i$2] = "n";
                else if (isStrong.test(type$1)) {
                    cur = type$1;
                    if (type$1 == "r") types[i$2] = "R";
                }
            }
            // W4. A single European separator between two European numbers
            // changes to a European number. A single common separator between
            // two numbers of the same type changes to that type.
            for(var i$3 = 1, prev$1 = types[0]; i$3 < len - 1; ++i$3){
                var type$2 = types[i$3];
                if (type$2 == "+" && prev$1 == "1" && types[i$3 + 1] == "1") types[i$3] = "1";
                else if (type$2 == "," && prev$1 == types[i$3 + 1] && (prev$1 == "1" || prev$1 == "n")) types[i$3] = prev$1;
                prev$1 = type$2;
            }
            // W5. A sequence of European terminators adjacent to European
            // numbers changes to all European numbers.
            // W6. Otherwise, separators and terminators change to Other
            // Neutral.
            for(var i$4 = 0; i$4 < len; ++i$4){
                var type$3 = types[i$4];
                if (type$3 == ",") types[i$4] = "N";
                else if (type$3 == "%") {
                    var end = void 0;
                    for(end = i$4 + 1; end < len && types[end] == "%"; ++end);
                    var replace = i$4 && types[i$4 - 1] == "!" || end < len && types[end] == "1" ? "1" : "N";
                    for(var j = i$4; j < end; ++j)types[j] = replace;
                    i$4 = end - 1;
                }
            }
            // W7. Search backwards from each instance of a European number
            // until the first strong type (R, L, or sor) is found. If an L is
            // found, then change the type of the European number to L.
            for(var i$5 = 0, cur$1 = outerType; i$5 < len; ++i$5){
                var type$4 = types[i$5];
                if (cur$1 == "L" && type$4 == "1") types[i$5] = "L";
                else if (isStrong.test(type$4)) cur$1 = type$4;
            }
            // N1. A sequence of neutrals takes the direction of the
            // surrounding strong text if the text on both sides has the same
            // direction. European and Arabic numbers act as if they were R in
            // terms of their influence on neutrals. Start-of-level-run (sor)
            // and end-of-level-run (eor) are used at level run boundaries.
            // N2. Any remaining neutrals take the embedding direction.
            for(var i$6 = 0; i$6 < len; ++i$6)if (isNeutral.test(types[i$6])) {
                var end$1 = void 0;
                for(end$1 = i$6 + 1; end$1 < len && isNeutral.test(types[end$1]); ++end$1);
                var before = (i$6 ? types[i$6 - 1] : outerType) == "L";
                var after = (end$1 < len ? types[end$1] : outerType) == "L";
                var replace$1 = before == after ? before ? "L" : "R" : outerType;
                for(var j$1 = i$6; j$1 < end$1; ++j$1)types[j$1] = replace$1;
                i$6 = end$1 - 1;
            }
            // Here we depart from the documented algorithm, in order to avoid
            // building up an actual levels array. Since there are only three
            // levels (0, 1, 2) in an implementation that doesn't take
            // explicit embedding into account, we can build up the order on
            // the fly, without following the level-based algorithm.
            var order = [], m;
            for(var i$7 = 0; i$7 < len;)if (countsAsLeft.test(types[i$7])) {
                var start = i$7;
                for(++i$7; i$7 < len && countsAsLeft.test(types[i$7]); ++i$7);
                order.push(new BidiSpan(0, start, i$7));
            } else {
                var pos = i$7, at = order.length, isRTL = direction == "rtl" ? 1 : 0;
                for(++i$7; i$7 < len && types[i$7] != "L"; ++i$7);
                for(var j$2 = pos; j$2 < i$7;)if (countsAsNum.test(types[j$2])) {
                    if (pos < j$2) {
                        order.splice(at, 0, new BidiSpan(1, pos, j$2));
                        at += isRTL;
                    }
                    var nstart = j$2;
                    for(++j$2; j$2 < i$7 && countsAsNum.test(types[j$2]); ++j$2);
                    order.splice(at, 0, new BidiSpan(2, nstart, j$2));
                    at += isRTL;
                    pos = j$2;
                } else ++j$2;
                if (pos < i$7) order.splice(at, 0, new BidiSpan(1, pos, i$7));
            }
            if (direction == "ltr") {
                if (order[0].level == 1 && (m = str.match(/^\s+/))) {
                    order[0].from = m[0].length;
                    order.unshift(new BidiSpan(0, 0, m[0].length));
                }
                if (lst(order).level == 1 && (m = str.match(/\s+$/))) {
                    lst(order).to -= m[0].length;
                    order.push(new BidiSpan(0, len - m[0].length, len));
                }
            }
            return direction == "rtl" ? order.reverse() : order;
        };
    }();
    // Get the bidi ordering for the given line (and cache it). Returns
    // false for lines that are fully left-to-right, and an array of
    // BidiSpan objects otherwise.
    function getOrder(line, direction) {
        var order = line.order;
        if (order == null) order = line.order = bidiOrdering(line.text, direction);
        return order;
    }
    // EVENT HANDLING
    // Lightweight event framework. on/off also work on DOM nodes,
    // registering native DOM handlers.
    var noHandlers = [];
    var on = function(emitter, type, f) {
        if (emitter.addEventListener) emitter.addEventListener(type, f, false);
        else if (emitter.attachEvent) emitter.attachEvent("on" + type, f);
        else {
            var map = emitter._handlers || (emitter._handlers = {});
            map[type] = (map[type] || noHandlers).concat(f);
        }
    };
    function getHandlers(emitter, type) {
        return emitter._handlers && emitter._handlers[type] || noHandlers;
    }
    function off(emitter, type, f) {
        if (emitter.removeEventListener) emitter.removeEventListener(type, f, false);
        else if (emitter.detachEvent) emitter.detachEvent("on" + type, f);
        else {
            var map = emitter._handlers, arr = map && map[type];
            if (arr) {
                var index = indexOf(arr, f);
                if (index > -1) map[type] = arr.slice(0, index).concat(arr.slice(index + 1));
            }
        }
    }
    function signal(emitter, type /*, values...*/ ) {
        var handlers = getHandlers(emitter, type);
        if (!handlers.length) return;
        var args = Array.prototype.slice.call(arguments, 2);
        for(var i = 0; i < handlers.length; ++i)handlers[i].apply(null, args);
    }
    // The DOM events that CodeMirror handles can be overridden by
    // registering a (non-DOM) handler on the editor for the event name,
    // and preventDefault-ing the event in that handler.
    function signalDOMEvent(cm, e, override) {
        if (typeof e == "string") e = {
            type: e,
            preventDefault: function() {
                this.defaultPrevented = true;
            }
        };
        signal(cm, override || e.type, cm, e);
        return e_defaultPrevented(e) || e.codemirrorIgnore;
    }
    function signalCursorActivity(cm) {
        var arr = cm._handlers && cm._handlers.cursorActivity;
        if (!arr) return;
        var set = cm.curOp.cursorActivityHandlers || (cm.curOp.cursorActivityHandlers = []);
        for(var i = 0; i < arr.length; ++i)if (indexOf(set, arr[i]) == -1) set.push(arr[i]);
    }
    function hasHandler(emitter, type) {
        return getHandlers(emitter, type).length > 0;
    }
    // Add on and off methods to a constructor's prototype, to make
    // registering events on such objects more convenient.
    function eventMixin(ctor) {
        ctor.prototype.on = function(type, f) {
            on(this, type, f);
        };
        ctor.prototype.off = function(type, f) {
            off(this, type, f);
        };
    }
    // Due to the fact that we still support jurassic IE versions, some
    // compatibility wrappers are needed.
    function e_preventDefault(e) {
        if (e.preventDefault) e.preventDefault();
        else e.returnValue = false;
    }
    function e_stopPropagation(e) {
        if (e.stopPropagation) e.stopPropagation();
        else e.cancelBubble = true;
    }
    function e_defaultPrevented(e) {
        return e.defaultPrevented != null ? e.defaultPrevented : e.returnValue == false;
    }
    function e_stop(e) {
        e_preventDefault(e);
        e_stopPropagation(e);
    }
    function e_target(e) {
        return e.target || e.srcElement;
    }
    function e_button(e) {
        var b = e.which;
        if (b == null) {
            if (e.button & 1) b = 1;
            else if (e.button & 2) b = 3;
            else if (e.button & 4) b = 2;
        }
        if (mac && e.ctrlKey && b == 1) b = 3;
        return b;
    }
    // Detect drag-and-drop
    var dragAndDrop = function() {
        // There is *some* kind of drag-and-drop support in IE6-8, but I
        // couldn't get it to work yet.
        if (ie && ie_version < 9) return false;
        var div = elt('div');
        return "draggable" in div || "dragDrop" in div;
    }();
    var zwspSupported;
    function zeroWidthElement(measure) {
        if (zwspSupported == null) {
            var test = elt("span", "\u200b");
            removeChildrenAndAdd(measure, elt("span", [
                test,
                document.createTextNode("x")
            ]));
            if (measure.firstChild.offsetHeight != 0) zwspSupported = test.offsetWidth <= 1 && test.offsetHeight > 2 && !(ie && ie_version < 8);
        }
        var node = zwspSupported ? elt("span", "\u200b") : elt("span", "\u00a0", null, "display: inline-block; width: 1px; margin-right: -1px");
        node.setAttribute("cm-text", "");
        return node;
    }
    // Feature-detect IE's crummy client rect reporting for bidi text
    var badBidiRects;
    function hasBadBidiRects(measure) {
        if (badBidiRects != null) return badBidiRects;
        var txt = removeChildrenAndAdd(measure, document.createTextNode("A\u062eA"));
        var r0 = range(txt, 0, 1).getBoundingClientRect();
        var r1 = range(txt, 1, 2).getBoundingClientRect();
        removeChildren(measure);
        if (!r0 || r0.left == r0.right) return false;
         // Safari returns null in some cases (#2780)
        return badBidiRects = r1.right - r0.right < 3;
    }
    // See if "".split is the broken IE version, if so, provide an
    // alternative way to split lines.
    var splitLinesAuto = "\n\nb".split(/\n/).length != 3 ? function(string) {
        var pos = 0, result = [], l = string.length;
        while(pos <= l){
            var nl = string.indexOf("\n", pos);
            if (nl == -1) nl = string.length;
            var line = string.slice(pos, string.charAt(nl - 1) == "\r" ? nl - 1 : nl);
            var rt = line.indexOf("\r");
            if (rt != -1) {
                result.push(line.slice(0, rt));
                pos += rt + 1;
            } else {
                result.push(line);
                pos = nl + 1;
            }
        }
        return result;
    } : function(string) {
        return string.split(/\r\n?|\n/);
    };
    var hasSelection = window.getSelection ? function(te) {
        try {
            return te.selectionStart != te.selectionEnd;
        } catch (e) {
            return false;
        }
    } : function(te) {
        var range;
        try {
            range = te.ownerDocument.selection.createRange();
        } catch (e) {}
        if (!range || range.parentElement() != te) return false;
        return range.compareEndPoints("StartToEnd", range) != 0;
    };
    var hasCopyEvent = function() {
        var e = elt("div");
        if ("oncopy" in e) return true;
        e.setAttribute("oncopy", "return;");
        return typeof e.oncopy == "function";
    }();
    var badZoomedRects = null;
    function hasBadZoomedRects(measure) {
        if (badZoomedRects != null) return badZoomedRects;
        var node = removeChildrenAndAdd(measure, elt("span", "x"));
        var normal = node.getBoundingClientRect();
        var fromRange = range(node, 0, 1).getBoundingClientRect();
        return badZoomedRects = Math.abs(normal.left - fromRange.left) > 1;
    }
    // Known modes, by name and by MIME
    var modes = {}, mimeModes = {};
    // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    function defineMode(name, mode) {
        if (arguments.length > 2) mode.dependencies = Array.prototype.slice.call(arguments, 2);
        modes[name] = mode;
    }
    function defineMIME(mime, spec) {
        mimeModes[mime] = spec;
    }
    // Given a MIME type, a {name, ...options} config object, or a name
    // string, return a mode config object.
    function resolveMode(spec) {
        if (typeof spec == "string" && mimeModes.hasOwnProperty(spec)) spec = mimeModes[spec];
        else if (spec && typeof spec.name == "string" && mimeModes.hasOwnProperty(spec.name)) {
            var found = mimeModes[spec.name];
            if (typeof found == "string") found = {
                name: found
            };
            spec = createObj(found, spec);
            spec.name = found.name;
        } else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+xml$/.test(spec)) return resolveMode("application/xml");
        else if (typeof spec == "string" && /^[\w\-]+\/[\w\-]+\+json$/.test(spec)) return resolveMode("application/json");
        if (typeof spec == "string") return {
            name: spec
        };
        else return spec || {
            name: "null"
        };
    }
    // Given a mode spec (anything that resolveMode accepts), find and
    // initialize an actual mode object.
    function getMode(options, spec) {
        spec = resolveMode(spec);
        var mfactory = modes[spec.name];
        if (!mfactory) return getMode(options, "text/plain");
        var modeObj = mfactory(options, spec);
        if (modeExtensions.hasOwnProperty(spec.name)) {
            var exts = modeExtensions[spec.name];
            for(var prop in exts){
                if (!exts.hasOwnProperty(prop)) continue;
                if (modeObj.hasOwnProperty(prop)) modeObj["_" + prop] = modeObj[prop];
                modeObj[prop] = exts[prop];
            }
        }
        modeObj.name = spec.name;
        if (spec.helperType) modeObj.helperType = spec.helperType;
        if (spec.modeProps) for(var prop$1 in spec.modeProps)modeObj[prop$1] = spec.modeProps[prop$1];
        return modeObj;
    }
    // This can be used to attach properties to mode objects from
    // outside the actual mode definition.
    var modeExtensions = {};
    function extendMode(mode, properties) {
        var exts = modeExtensions.hasOwnProperty(mode) ? modeExtensions[mode] : modeExtensions[mode] = {};
        copyObj(properties, exts);
    }
    function copyState(mode, state) {
        if (state === true) return state;
        if (mode.copyState) return mode.copyState(state);
        var nstate = {};
        for(var n in state){
            var val = state[n];
            if (val instanceof Array) val = val.concat([]);
            nstate[n] = val;
        }
        return nstate;
    }
    // Given a mode and a state (for that mode), find the inner mode and
    // state at the position that the state refers to.
    function innerMode(mode, state) {
        var info;
        while(mode.innerMode){
            info = mode.innerMode(state);
            if (!info || info.mode == mode) break;
            state = info.state;
            mode = info.mode;
        }
        return info || {
            mode: mode,
            state: state
        };
    }
    function startState(mode, a1, a2) {
        return mode.startState ? mode.startState(a1, a2) : true;
    }
    // STRING STREAM
    // Fed to the mode parsers, provides helper functions to make
    // parsers more succinct.
    var StringStream = function(string, tabSize, lineOracle) {
        this.pos = this.start = 0;
        this.string = string;
        this.tabSize = tabSize || 8;
        this.lastColumnPos = this.lastColumnValue = 0;
        this.lineStart = 0;
        this.lineOracle = lineOracle;
    };
    StringStream.prototype.eol = function() {
        return this.pos >= this.string.length;
    };
    StringStream.prototype.sol = function() {
        return this.pos == this.lineStart;
    };
    StringStream.prototype.peek = function() {
        return this.string.charAt(this.pos) || undefined;
    };
    StringStream.prototype.next = function() {
        if (this.pos < this.string.length) return this.string.charAt(this.pos++);
    };
    StringStream.prototype.eat = function(match) {
        var ch = this.string.charAt(this.pos);
        var ok;
        if (typeof match == "string") ok = ch == match;
        else ok = ch && (match.test ? match.test(ch) : match(ch));
        if (ok) {
            ++this.pos;
            return ch;
        }
    };
    StringStream.prototype.eatWhile = function(match) {
        var start = this.pos;
        while(this.eat(match));
        return this.pos > start;
    };
    StringStream.prototype.eatSpace = function() {
        var start = this.pos;
        while(/[\s\u00a0]/.test(this.string.charAt(this.pos)))++this.pos;
        return this.pos > start;
    };
    StringStream.prototype.skipToEnd = function() {
        this.pos = this.string.length;
    };
    StringStream.prototype.skipTo = function(ch) {
        var found = this.string.indexOf(ch, this.pos);
        if (found > -1) {
            this.pos = found;
            return true;
        }
    };
    StringStream.prototype.backUp = function(n) {
        this.pos -= n;
    };
    StringStream.prototype.column = function() {
        if (this.lastColumnPos < this.start) {
            this.lastColumnValue = countColumn(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue);
            this.lastColumnPos = this.start;
        }
        return this.lastColumnValue - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    };
    StringStream.prototype.indentation = function() {
        return countColumn(this.string, null, this.tabSize) - (this.lineStart ? countColumn(this.string, this.lineStart, this.tabSize) : 0);
    };
    StringStream.prototype.match = function(pattern, consume, caseInsensitive) {
        if (typeof pattern == "string") {
            var cased = function(str) {
                return caseInsensitive ? str.toLowerCase() : str;
            };
            var substr = this.string.substr(this.pos, pattern.length);
            if (cased(substr) == cased(pattern)) {
                if (consume !== false) this.pos += pattern.length;
                return true;
            }
        } else {
            var match = this.string.slice(this.pos).match(pattern);
            if (match && match.index > 0) return null;
            if (match && consume !== false) this.pos += match[0].length;
            return match;
        }
    };
    StringStream.prototype.current = function() {
        return this.string.slice(this.start, this.pos);
    };
    StringStream.prototype.hideFirstChars = function(n, inner) {
        this.lineStart += n;
        try {
            return inner();
        } finally{
            this.lineStart -= n;
        }
    };
    StringStream.prototype.lookAhead = function(n) {
        var oracle = this.lineOracle;
        return oracle && oracle.lookAhead(n);
    };
    StringStream.prototype.baseToken = function() {
        var oracle = this.lineOracle;
        return oracle && oracle.baseToken(this.pos);
    };
    // Find the line object corresponding to the given line number.
    function getLine(doc, n) {
        n -= doc.first;
        if (n < 0 || n >= doc.size) throw new Error("There is no line " + (n + doc.first) + " in the document.");
        var chunk = doc;
        while(!chunk.lines)for(var i = 0;; ++i){
            var child = chunk.children[i], sz = child.chunkSize();
            if (n < sz) {
                chunk = child;
                break;
            }
            n -= sz;
        }
        return chunk.lines[n];
    }
    // Get the part of a document between two positions, as an array of
    // strings.
    function getBetween(doc, start, end) {
        var out = [], n = start.line;
        doc.iter(start.line, end.line + 1, function(line) {
            var text = line.text;
            if (n == end.line) text = text.slice(0, end.ch);
            if (n == start.line) text = text.slice(start.ch);
            out.push(text);
            ++n;
        });
        return out;
    }
    // Get the lines between from and to, as array of strings.
    function getLines(doc, from, to) {
        var out = [];
        doc.iter(from, to, function(line) {
            out.push(line.text);
        }); // iter aborts when callback returns truthy value
        return out;
    }
    // Update the height of a line, propagating the height change
    // upwards to parent nodes.
    function updateLineHeight(line, height) {
        var diff = height - line.height;
        if (diff) for(var n = line; n; n = n.parent)n.height += diff;
    }
    // Given a line object, find its line number by walking up through
    // its parent links.
    function lineNo(line) {
        if (line.parent == null) return null;
        var cur = line.parent, no = indexOf(cur.lines, line);
        for(var chunk = cur.parent; chunk; cur = chunk, chunk = chunk.parent)for(var i = 0;; ++i){
            if (chunk.children[i] == cur) break;
            no += chunk.children[i].chunkSize();
        }
        return no + cur.first;
    }
    // Find the line at the given vertical position, using the height
    // information in the document tree.
    function lineAtHeight(chunk, h) {
        var n = chunk.first;
        outer: do {
            for(var i$1 = 0; i$1 < chunk.children.length; ++i$1){
                var child = chunk.children[i$1], ch = child.height;
                if (h < ch) {
                    chunk = child;
                    continue outer;
                }
                h -= ch;
                n += child.chunkSize();
            }
            return n;
        }while (!chunk.lines);
        var i = 0;
        for(; i < chunk.lines.length; ++i){
            var line = chunk.lines[i], lh = line.height;
            if (h < lh) break;
            h -= lh;
        }
        return n + i;
    }
    function isLine(doc, l) {
        return l >= doc.first && l < doc.first + doc.size;
    }
    function lineNumberFor(options, i) {
        return String(options.lineNumberFormatter(i + options.firstLineNumber));
    }
    // A Pos instance represents a position within the text.
    function Pos(line, ch, sticky) {
        if (sticky === void 0) sticky = null;
        if (!(this instanceof Pos)) return new Pos(line, ch, sticky);
        this.line = line;
        this.ch = ch;
        this.sticky = sticky;
    }
    // Compare two positions, return 0 if they are the same, a negative
    // number when a is less, and a positive number otherwise.
    function cmp(a, b) {
        return a.line - b.line || a.ch - b.ch;
    }
    function equalCursorPos(a, b) {
        return a.sticky == b.sticky && cmp(a, b) == 0;
    }
    function copyPos(x) {
        return Pos(x.line, x.ch);
    }
    function maxPos(a, b) {
        return cmp(a, b) < 0 ? b : a;
    }
    function minPos(a, b) {
        return cmp(a, b) < 0 ? a : b;
    }
    // Most of the external API clips given positions to make sure they
    // actually exist within the document.
    function clipLine(doc, n) {
        return Math.max(doc.first, Math.min(n, doc.first + doc.size - 1));
    }
    function clipPos(doc, pos) {
        if (pos.line < doc.first) return Pos(doc.first, 0);
        var last = doc.first + doc.size - 1;
        if (pos.line > last) return Pos(last, getLine(doc, last).text.length);
        return clipToLen(pos, getLine(doc, pos.line).text.length);
    }
    function clipToLen(pos, linelen) {
        var ch = pos.ch;
        if (ch == null || ch > linelen) return Pos(pos.line, linelen);
        else if (ch < 0) return Pos(pos.line, 0);
        else return pos;
    }
    function clipPosArray(doc, array) {
        var out = [];
        for(var i = 0; i < array.length; i++)out[i] = clipPos(doc, array[i]);
        return out;
    }
    var SavedContext = function(state, lookAhead) {
        this.state = state;
        this.lookAhead = lookAhead;
    };
    var Context = function(doc, state, line, lookAhead) {
        this.state = state;
        this.doc = doc;
        this.line = line;
        this.maxLookAhead = lookAhead || 0;
        this.baseTokens = null;
        this.baseTokenPos = 1;
    };
    Context.prototype.lookAhead = function(n) {
        var line = this.doc.getLine(this.line + n);
        if (line != null && n > this.maxLookAhead) this.maxLookAhead = n;
        return line;
    };
    Context.prototype.baseToken = function(n) {
        if (!this.baseTokens) return null;
        while(this.baseTokens[this.baseTokenPos] <= n)this.baseTokenPos += 2;
        var type = this.baseTokens[this.baseTokenPos + 1];
        return {
            type: type && type.replace(/( |^)overlay .*/, ""),
            size: this.baseTokens[this.baseTokenPos] - n
        };
    };
    Context.prototype.nextLine = function() {
        this.line++;
        if (this.maxLookAhead > 0) this.maxLookAhead--;
    };
    Context.fromSaved = function(doc, saved, line) {
        if (saved instanceof SavedContext) return new Context(doc, copyState(doc.mode, saved.state), line, saved.lookAhead);
        else return new Context(doc, copyState(doc.mode, saved), line);
    };
    Context.prototype.save = function(copy) {
        var state = copy !== false ? copyState(this.doc.mode, this.state) : this.state;
        return this.maxLookAhead > 0 ? new SavedContext(state, this.maxLookAhead) : state;
    };
    // Compute a style array (an array starting with a mode generation
    // -- for invalidation -- followed by pairs of end positions and
    // style strings), which is used to highlight the tokens on the
    // line.
    function highlightLine(cm, line, context, forceToEnd) {
        // A styles array always starts with a number identifying the
        // mode/overlays that it is based on (for easy invalidation).
        var st = [
            cm.state.modeGen
        ], lineClasses = {};
        // Compute the base array of styles
        runMode(cm, line.text, cm.doc.mode, context, function(end, style) {
            return st.push(end, style);
        }, lineClasses, forceToEnd);
        var state = context.state;
        // Run overlays, adjust style array.
        var loop = function(o) {
            context.baseTokens = st;
            var overlay = cm.state.overlays[o], i = 1, at = 0;
            context.state = true;
            runMode(cm, line.text, overlay.mode, context, function(end, style) {
                var start = i;
                // Ensure there's a token end at the current position, and that i points at it
                while(at < end){
                    var i_end = st[i];
                    if (i_end > end) st.splice(i, 1, end, st[i + 1], i_end);
                    i += 2;
                    at = Math.min(end, i_end);
                }
                if (!style) return;
                if (overlay.opaque) {
                    st.splice(start, i - start, end, "overlay " + style);
                    i = start + 2;
                } else for(; start < i; start += 2){
                    var cur = st[start + 1];
                    st[start + 1] = (cur ? cur + " " : "") + "overlay " + style;
                }
            }, lineClasses);
            context.state = state;
            context.baseTokens = null;
            context.baseTokenPos = 1;
        };
        for(var o = 0; o < cm.state.overlays.length; ++o)loop(o);
        return {
            styles: st,
            classes: lineClasses.bgClass || lineClasses.textClass ? lineClasses : null
        };
    }
    function getLineStyles(cm, line, updateFrontier) {
        if (!line.styles || line.styles[0] != cm.state.modeGen) {
            var context = getContextBefore(cm, lineNo(line));
            var resetState = line.text.length > cm.options.maxHighlightLength && copyState(cm.doc.mode, context.state);
            var result = highlightLine(cm, line, context);
            if (resetState) context.state = resetState;
            line.stateAfter = context.save(!resetState);
            line.styles = result.styles;
            if (result.classes) line.styleClasses = result.classes;
            else if (line.styleClasses) line.styleClasses = null;
            if (updateFrontier === cm.doc.highlightFrontier) cm.doc.modeFrontier = Math.max(cm.doc.modeFrontier, ++cm.doc.highlightFrontier);
        }
        return line.styles;
    }
    function getContextBefore(cm, n, precise) {
        var doc = cm.doc, display = cm.display;
        if (!doc.mode.startState) return new Context(doc, true, n);
        var start = findStartLine(cm, n, precise);
        var saved = start > doc.first && getLine(doc, start - 1).stateAfter;
        var context = saved ? Context.fromSaved(doc, saved, start) : new Context(doc, startState(doc.mode), start);
        doc.iter(start, n, function(line) {
            processLine(cm, line.text, context);
            var pos = context.line;
            line.stateAfter = pos == n - 1 || pos % 5 == 0 || pos >= display.viewFrom && pos < display.viewTo ? context.save() : null;
            context.nextLine();
        });
        if (precise) doc.modeFrontier = context.line;
        return context;
    }
    // Lightweight form of highlight -- proceed over this line and
    // update state, but don't save a style array. Used for lines that
    // aren't currently visible.
    function processLine(cm, text, context, startAt) {
        var mode = cm.doc.mode;
        var stream = new StringStream(text, cm.options.tabSize, context);
        stream.start = stream.pos = startAt || 0;
        if (text == "") callBlankLine(mode, context.state);
        while(!stream.eol()){
            readToken(mode, stream, context.state);
            stream.start = stream.pos;
        }
    }
    function callBlankLine(mode, state) {
        if (mode.blankLine) return mode.blankLine(state);
        if (!mode.innerMode) return;
        var inner = innerMode(mode, state);
        if (inner.mode.blankLine) return inner.mode.blankLine(inner.state);
    }
    function readToken(mode, stream, state, inner) {
        for(var i = 0; i < 10; i++){
            if (inner) inner[0] = innerMode(mode, state).mode;
            var style = mode.token(stream, state);
            if (stream.pos > stream.start) return style;
        }
        throw new Error("Mode " + mode.name + " failed to advance stream.");
    }
    var Token = function(stream, type, state) {
        this.start = stream.start;
        this.end = stream.pos;
        this.string = stream.current();
        this.type = type || null;
        this.state = state;
    };
    // Utility for getTokenAt and getLineTokens
    function takeToken(cm, pos, precise, asArray) {
        var doc = cm.doc, mode = doc.mode, style;
        pos = clipPos(doc, pos);
        var line = getLine(doc, pos.line), context = getContextBefore(cm, pos.line, precise);
        var stream = new StringStream(line.text, cm.options.tabSize, context), tokens;
        if (asArray) tokens = [];
        while((asArray || stream.pos < pos.ch) && !stream.eol()){
            stream.start = stream.pos;
            style = readToken(mode, stream, context.state);
            if (asArray) tokens.push(new Token(stream, style, copyState(doc.mode, context.state)));
        }
        return asArray ? tokens : new Token(stream, style, context.state);
    }
    function extractLineClasses(type, output) {
        if (type) for(;;){
            var lineClass = type.match(/(?:^|\s+)line-(background-)?(\S+)/);
            if (!lineClass) break;
            type = type.slice(0, lineClass.index) + type.slice(lineClass.index + lineClass[0].length);
            var prop = lineClass[1] ? "bgClass" : "textClass";
            if (output[prop] == null) output[prop] = lineClass[2];
            else if (!new RegExp("(?:^|\\s)" + lineClass[2] + "(?:$|\\s)").test(output[prop])) output[prop] += " " + lineClass[2];
        }
        return type;
    }
    // Run the given mode's parser over a line, calling f for each token.
    function runMode(cm, text, mode, context, f, lineClasses, forceToEnd) {
        var flattenSpans = mode.flattenSpans;
        if (flattenSpans == null) flattenSpans = cm.options.flattenSpans;
        var curStart = 0, curStyle = null;
        var stream = new StringStream(text, cm.options.tabSize, context), style;
        var inner = cm.options.addModeClass && [
            null
        ];
        if (text == "") extractLineClasses(callBlankLine(mode, context.state), lineClasses);
        while(!stream.eol()){
            if (stream.pos > cm.options.maxHighlightLength) {
                flattenSpans = false;
                if (forceToEnd) processLine(cm, text, context, stream.pos);
                stream.pos = text.length;
                style = null;
            } else style = extractLineClasses(readToken(mode, stream, context.state, inner), lineClasses);
            if (inner) {
                var mName = inner[0].name;
                if (mName) style = "m-" + (style ? mName + " " + style : mName);
            }
            if (!flattenSpans || curStyle != style) {
                while(curStart < stream.start){
                    curStart = Math.min(stream.start, curStart + 5000);
                    f(curStart, curStyle);
                }
                curStyle = style;
            }
            stream.start = stream.pos;
        }
        while(curStart < stream.pos){
            // Webkit seems to refuse to render text nodes longer than 57444
            // characters, and returns inaccurate measurements in nodes
            // starting around 5000 chars.
            var pos = Math.min(stream.pos, curStart + 5000);
            f(pos, curStyle);
            curStart = pos;
        }
    }
    // Finds the line to start with when starting a parse. Tries to
    // find a line with a stateAfter, so that it can start with a
    // valid state. If that fails, it returns the line with the
    // smallest indentation, which tends to need the least context to
    // parse correctly.
    function findStartLine(cm, n, precise) {
        var minindent, minline, doc = cm.doc;
        var lim = precise ? -1 : n - (cm.doc.mode.innerMode ? 1000 : 100);
        for(var search = n; search > lim; --search){
            if (search <= doc.first) return doc.first;
            var line = getLine(doc, search - 1), after = line.stateAfter;
            if (after && (!precise || search + (after instanceof SavedContext ? after.lookAhead : 0) <= doc.modeFrontier)) return search;
            var indented = countColumn(line.text, null, cm.options.tabSize);
            if (minline == null || minindent > indented) {
                minline = search - 1;
                minindent = indented;
            }
        }
        return minline;
    }
    function retreatFrontier(doc, n) {
        doc.modeFrontier = Math.min(doc.modeFrontier, n);
        if (doc.highlightFrontier < n - 10) return;
        var start = doc.first;
        for(var line = n - 1; line > start; line--){
            var saved = getLine(doc, line).stateAfter;
            // change is on 3
            // state on line 1 looked ahead 2 -- so saw 3
            // test 1 + 2 < 3 should cover this
            if (saved && (!(saved instanceof SavedContext) || line + saved.lookAhead < n)) {
                start = line + 1;
                break;
            }
        }
        doc.highlightFrontier = Math.min(doc.highlightFrontier, start);
    }
    // Optimize some code when these features are not used.
    var sawReadOnlySpans = false, sawCollapsedSpans = false;
    function seeReadOnlySpans() {
        sawReadOnlySpans = true;
    }
    function seeCollapsedSpans() {
        sawCollapsedSpans = true;
    }
    // TEXTMARKER SPANS
    function MarkedSpan(marker, from, to) {
        this.marker = marker;
        this.from = from;
        this.to = to;
    }
    // Search an array of spans for a span matching the given marker.
    function getMarkedSpanFor(spans, marker) {
        if (spans) for(var i = 0; i < spans.length; ++i){
            var span = spans[i];
            if (span.marker == marker) return span;
        }
    }
    // Remove a span from an array, returning undefined if no spans are
    // left (we don't store arrays for lines without spans).
    function removeMarkedSpan(spans, span) {
        var r;
        for(var i = 0; i < spans.length; ++i)if (spans[i] != span) (r || (r = [])).push(spans[i]);
        return r;
    }
    // Add a span to a line.
    function addMarkedSpan(line, span, op) {
        var inThisOp = op && window.WeakSet && (op.markedSpans || (op.markedSpans = new WeakSet));
        if (inThisOp && line.markedSpans && inThisOp.has(line.markedSpans)) line.markedSpans.push(span);
        else {
            line.markedSpans = line.markedSpans ? line.markedSpans.concat([
                span
            ]) : [
                span
            ];
            if (inThisOp) inThisOp.add(line.markedSpans);
        }
        span.marker.attachLine(line);
    }
    // Used for the algorithm that adjusts markers for a change in the
    // document. These functions cut an array of spans at a given
    // character position, returning an array of remaining chunks (or
    // undefined if nothing remains).
    function markedSpansBefore(old, startCh, isInsert) {
        var nw;
        if (old) for(var i = 0; i < old.length; ++i){
            var span = old[i], marker = span.marker;
            var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= startCh : span.from < startCh);
            if (startsBefore || span.from == startCh && marker.type == "bookmark" && (!isInsert || !span.marker.insertLeft)) {
                var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= startCh : span.to > startCh);
                (nw || (nw = [])).push(new MarkedSpan(marker, span.from, endsAfter ? null : span.to));
            }
        }
        return nw;
    }
    function markedSpansAfter(old, endCh, isInsert) {
        var nw;
        if (old) for(var i = 0; i < old.length; ++i){
            var span = old[i], marker = span.marker;
            var endsAfter = span.to == null || (marker.inclusiveRight ? span.to >= endCh : span.to > endCh);
            if (endsAfter || span.from == endCh && marker.type == "bookmark" && (!isInsert || span.marker.insertLeft)) {
                var startsBefore = span.from == null || (marker.inclusiveLeft ? span.from <= endCh : span.from < endCh);
                (nw || (nw = [])).push(new MarkedSpan(marker, startsBefore ? null : span.from - endCh, span.to == null ? null : span.to - endCh));
            }
        }
        return nw;
    }
    // Given a change object, compute the new set of marker spans that
    // cover the line in which the change took place. Removes spans
    // entirely within the change, reconnects spans belonging to the
    // same marker that appear on both sides of the change, and cuts off
    // spans partially within the change. Returns an array of span
    // arrays with one element for each line in (after) the change.
    function stretchSpansOverChange(doc, change) {
        if (change.full) return null;
        var oldFirst = isLine(doc, change.from.line) && getLine(doc, change.from.line).markedSpans;
        var oldLast = isLine(doc, change.to.line) && getLine(doc, change.to.line).markedSpans;
        if (!oldFirst && !oldLast) return null;
        var startCh = change.from.ch, endCh = change.to.ch, isInsert = cmp(change.from, change.to) == 0;
        // Get the spans that 'stick out' on both sides
        var first = markedSpansBefore(oldFirst, startCh, isInsert);
        var last = markedSpansAfter(oldLast, endCh, isInsert);
        // Next, merge those two ends
        var sameLine = change.text.length == 1, offset = lst(change.text).length + (sameLine ? startCh : 0);
        if (first) // Fix up .to properties of first
        for(var i = 0; i < first.length; ++i){
            var span = first[i];
            if (span.to == null) {
                var found = getMarkedSpanFor(last, span.marker);
                if (!found) span.to = startCh;
                else if (sameLine) span.to = found.to == null ? null : found.to + offset;
            }
        }
        if (last) // Fix up .from in last (or move them into first in case of sameLine)
        for(var i$1 = 0; i$1 < last.length; ++i$1){
            var span$1 = last[i$1];
            if (span$1.to != null) span$1.to += offset;
            if (span$1.from == null) {
                var found$1 = getMarkedSpanFor(first, span$1.marker);
                if (!found$1) {
                    span$1.from = offset;
                    if (sameLine) (first || (first = [])).push(span$1);
                }
            } else {
                span$1.from += offset;
                if (sameLine) (first || (first = [])).push(span$1);
            }
        }
        // Make sure we didn't create any zero-length spans
        if (first) first = clearEmptySpans(first);
        if (last && last != first) last = clearEmptySpans(last);
        var newMarkers = [
            first
        ];
        if (!sameLine) {
            // Fill gap with whole-line-spans
            var gap = change.text.length - 2, gapMarkers;
            if (gap > 0 && first) {
                for(var i$2 = 0; i$2 < first.length; ++i$2)if (first[i$2].to == null) (gapMarkers || (gapMarkers = [])).push(new MarkedSpan(first[i$2].marker, null, null));
            }
            for(var i$3 = 0; i$3 < gap; ++i$3)newMarkers.push(gapMarkers);
            newMarkers.push(last);
        }
        return newMarkers;
    }
    // Remove spans that are empty and don't have a clearWhenEmpty
    // option of false.
    function clearEmptySpans(spans) {
        for(var i = 0; i < spans.length; ++i){
            var span = spans[i];
            if (span.from != null && span.from == span.to && span.marker.clearWhenEmpty !== false) spans.splice(i--, 1);
        }
        if (!spans.length) return null;
        return spans;
    }
    // Used to 'clip' out readOnly ranges when making a change.
    function removeReadOnlyRanges(doc, from, to) {
        var markers = null;
        doc.iter(from.line, to.line + 1, function(line) {
            if (line.markedSpans) for(var i = 0; i < line.markedSpans.length; ++i){
                var mark = line.markedSpans[i].marker;
                if (mark.readOnly && (!markers || indexOf(markers, mark) == -1)) (markers || (markers = [])).push(mark);
            }
        });
        if (!markers) return null;
        var parts = [
            {
                from: from,
                to: to
            }
        ];
        for(var i = 0; i < markers.length; ++i){
            var mk = markers[i], m = mk.find(0);
            for(var j = 0; j < parts.length; ++j){
                var p = parts[j];
                if (cmp(p.to, m.from) < 0 || cmp(p.from, m.to) > 0) continue;
                var newParts = [
                    j,
                    1
                ], dfrom = cmp(p.from, m.from), dto = cmp(p.to, m.to);
                if (dfrom < 0 || !mk.inclusiveLeft && !dfrom) newParts.push({
                    from: p.from,
                    to: m.from
                });
                if (dto > 0 || !mk.inclusiveRight && !dto) newParts.push({
                    from: m.to,
                    to: p.to
                });
                parts.splice.apply(parts, newParts);
                j += newParts.length - 3;
            }
        }
        return parts;
    }
    // Connect or disconnect spans from a line.
    function detachMarkedSpans(line) {
        var spans = line.markedSpans;
        if (!spans) return;
        for(var i = 0; i < spans.length; ++i)spans[i].marker.detachLine(line);
        line.markedSpans = null;
    }
    function attachMarkedSpans(line, spans) {
        if (!spans) return;
        for(var i = 0; i < spans.length; ++i)spans[i].marker.attachLine(line);
        line.markedSpans = spans;
    }
    // Helpers used when computing which overlapping collapsed span
    // counts as the larger one.
    function extraLeft(marker) {
        return marker.inclusiveLeft ? -1 : 0;
    }
    function extraRight(marker) {
        return marker.inclusiveRight ? 1 : 0;
    }
    // Returns a number indicating which of two overlapping collapsed
    // spans is larger (and thus includes the other). Falls back to
    // comparing ids when the spans cover exactly the same range.
    function compareCollapsedMarkers(a, b) {
        var lenDiff = a.lines.length - b.lines.length;
        if (lenDiff != 0) return lenDiff;
        var aPos = a.find(), bPos = b.find();
        var fromCmp = cmp(aPos.from, bPos.from) || extraLeft(a) - extraLeft(b);
        if (fromCmp) return -fromCmp;
        var toCmp = cmp(aPos.to, bPos.to) || extraRight(a) - extraRight(b);
        if (toCmp) return toCmp;
        return b.id - a.id;
    }
    // Find out whether a line ends or starts in a collapsed span. If
    // so, return the marker for that span.
    function collapsedSpanAtSide(line, start) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) for(var sp = void 0, i = 0; i < sps.length; ++i){
            sp = sps[i];
            if (sp.marker.collapsed && (start ? sp.from : sp.to) == null && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) found = sp.marker;
        }
        return found;
    }
    function collapsedSpanAtStart(line) {
        return collapsedSpanAtSide(line, true);
    }
    function collapsedSpanAtEnd(line) {
        return collapsedSpanAtSide(line, false);
    }
    function collapsedSpanAround(line, ch) {
        var sps = sawCollapsedSpans && line.markedSpans, found;
        if (sps) for(var i = 0; i < sps.length; ++i){
            var sp = sps[i];
            if (sp.marker.collapsed && (sp.from == null || sp.from < ch) && (sp.to == null || sp.to > ch) && (!found || compareCollapsedMarkers(found, sp.marker) < 0)) found = sp.marker;
        }
        return found;
    }
    // Test whether there exists a collapsed span that partially
    // overlaps (covers the start or end, but not both) of a new span.
    // Such overlap is not allowed.
    function conflictingCollapsedRange(doc, lineNo, from, to, marker) {
        var line = getLine(doc, lineNo);
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) for(var i = 0; i < sps.length; ++i){
            var sp = sps[i];
            if (!sp.marker.collapsed) continue;
            var found = sp.marker.find(0);
            var fromCmp = cmp(found.from, from) || extraLeft(sp.marker) - extraLeft(marker);
            var toCmp = cmp(found.to, to) || extraRight(sp.marker) - extraRight(marker);
            if (fromCmp >= 0 && toCmp <= 0 || fromCmp <= 0 && toCmp >= 0) continue;
            if (fromCmp <= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.to, from) >= 0 : cmp(found.to, from) > 0) || fromCmp >= 0 && (sp.marker.inclusiveRight && marker.inclusiveLeft ? cmp(found.from, to) <= 0 : cmp(found.from, to) < 0)) return true;
        }
    }
    // A visual line is a line as drawn on the screen. Folding, for
    // example, can cause multiple logical lines to appear on the same
    // visual line. This finds the start of the visual line that the
    // given line is part of (usually that is the line itself).
    function visualLine(line) {
        var merged;
        while(merged = collapsedSpanAtStart(line))line = merged.find(-1, true).line;
        return line;
    }
    function visualLineEnd(line) {
        var merged;
        while(merged = collapsedSpanAtEnd(line))line = merged.find(1, true).line;
        return line;
    }
    // Returns an array of logical lines that continue the visual line
    // started by the argument, or undefined if there are no such lines.
    function visualLineContinued(line) {
        var merged, lines;
        while(merged = collapsedSpanAtEnd(line)){
            line = merged.find(1, true).line;
            (lines || (lines = [])).push(line);
        }
        return lines;
    }
    // Get the line number of the start of the visual line that the
    // given line number is part of.
    function visualLineNo(doc, lineN) {
        var line = getLine(doc, lineN), vis = visualLine(line);
        if (line == vis) return lineN;
        return lineNo(vis);
    }
    // Get the line number of the start of the next visual line after
    // the given line.
    function visualLineEndNo(doc, lineN) {
        if (lineN > doc.lastLine()) return lineN;
        var line = getLine(doc, lineN), merged;
        if (!lineIsHidden(doc, line)) return lineN;
        while(merged = collapsedSpanAtEnd(line))line = merged.find(1, true).line;
        return lineNo(line) + 1;
    }
    // Compute whether a line is hidden. Lines count as hidden when they
    // are part of a visual line that starts with another line, or when
    // they are entirely covered by collapsed, non-widget span.
    function lineIsHidden(doc, line) {
        var sps = sawCollapsedSpans && line.markedSpans;
        if (sps) for(var sp = void 0, i = 0; i < sps.length; ++i){
            sp = sps[i];
            if (!sp.marker.collapsed) continue;
            if (sp.from == null) return true;
            if (sp.marker.widgetNode) continue;
            if (sp.from == 0 && sp.marker.inclusiveLeft && lineIsHiddenInner(doc, line, sp)) return true;
        }
    }
    function lineIsHiddenInner(doc, line, span) {
        if (span.to == null) {
            var end = span.marker.find(1, true);
            return lineIsHiddenInner(doc, end.line, getMarkedSpanFor(end.line.markedSpans, span.marker));
        }
        if (span.marker.inclusiveRight && span.to == line.text.length) return true;
        for(var sp = void 0, i = 0; i < line.markedSpans.length; ++i){
            sp = line.markedSpans[i];
            if (sp.marker.collapsed && !sp.marker.widgetNode && sp.from == span.to && (sp.to == null || sp.to != span.from) && (sp.marker.inclusiveLeft || span.marker.inclusiveRight) && lineIsHiddenInner(doc, line, sp)) return true;
        }
    }
    // Find the height above the given line.
    function heightAtLine(lineObj) {
        lineObj = visualLine(lineObj);
        var h = 0, chunk = lineObj.parent;
        for(var i = 0; i < chunk.lines.length; ++i){
            var line = chunk.lines[i];
            if (line == lineObj) break;
            else h += line.height;
        }
        for(var p = chunk.parent; p; chunk = p, p = chunk.parent)for(var i$1 = 0; i$1 < p.children.length; ++i$1){
            var cur = p.children[i$1];
            if (cur == chunk) break;
            else h += cur.height;
        }
        return h;
    }
    // Compute the character length of a line, taking into account
    // collapsed ranges (see markText) that might hide parts, and join
    // other lines onto it.
    function lineLength(line) {
        if (line.height == 0) return 0;
        var len = line.text.length, merged, cur = line;
        while(merged = collapsedSpanAtStart(cur)){
            var found = merged.find(0, true);
            cur = found.from.line;
            len += found.from.ch - found.to.ch;
        }
        cur = line;
        while(merged = collapsedSpanAtEnd(cur)){
            var found$1 = merged.find(0, true);
            len -= cur.text.length - found$1.from.ch;
            cur = found$1.to.line;
            len += cur.text.length - found$1.to.ch;
        }
        return len;
    }
    // Find the longest line in the document.
    function findMaxLine(cm) {
        var d = cm.display, doc = cm.doc;
        d.maxLine = getLine(doc, doc.first);
        d.maxLineLength = lineLength(d.maxLine);
        d.maxLineChanged = true;
        doc.iter(function(line) {
            var len = lineLength(line);
            if (len > d.maxLineLength) {
                d.maxLineLength = len;
                d.maxLine = line;
            }
        });
    }
    // LINE DATA STRUCTURE
    // Line objects. These hold state related to a line, including
    // highlighting info (the styles array).
    var Line = function(text, markedSpans, estimateHeight) {
        this.text = text;
        attachMarkedSpans(this, markedSpans);
        this.height = estimateHeight ? estimateHeight(this) : 1;
    };
    Line.prototype.lineNo = function() {
        return lineNo(this);
    };
    eventMixin(Line);
    // Change the content (text, markers) of a line. Automatically
    // invalidates cached information and tries to re-estimate the
    // line's height.
    function updateLine(line, text, markedSpans, estimateHeight) {
        line.text = text;
        if (line.stateAfter) line.stateAfter = null;
        if (line.styles) line.styles = null;
        if (line.order != null) line.order = null;
        detachMarkedSpans(line);
        attachMarkedSpans(line, markedSpans);
        var estHeight = estimateHeight ? estimateHeight(line) : 1;
        if (estHeight != line.height) updateLineHeight(line, estHeight);
    }
    // Detach a line from the document tree and its markers.
    function cleanUpLine(line) {
        line.parent = null;
        detachMarkedSpans(line);
    }
    // Convert a style as returned by a mode (either null, or a string
    // containing one or more styles) to a CSS style. This is cached,
    // and also looks for line-wide styles.
    var styleToClassCache = {}, styleToClassCacheWithMode = {};
    function interpretTokenStyle(style, options) {
        if (!style || /^\s*$/.test(style)) return null;
        var cache = options.addModeClass ? styleToClassCacheWithMode : styleToClassCache;
        return cache[style] || (cache[style] = style.replace(/\S+/g, "cm-$&"));
    }
    // Render the DOM representation of the text of a line. Also builds
    // up a 'line map', which points at the DOM nodes that represent
    // specific stretches of text, and is used by the measuring code.
    // The returned object contains the DOM node, this map, and
    // information about line-wide styles that were set by the mode.
    function buildLineContent(cm, lineView) {
        // The padding-right forces the element to have a 'border', which
        // is needed on Webkit to be able to get line-level bounding
        // rectangles for it (in measureChar).
        var content = eltP("span", null, null, webkit ? "padding-right: .1px" : null);
        var builder = {
            pre: eltP("pre", [
                content
            ], "CodeMirror-line"),
            content: content,
            col: 0,
            pos: 0,
            cm: cm,
            trailingSpace: false,
            splitSpaces: cm.getOption("lineWrapping")
        };
        lineView.measure = {};
        // Iterate over the logical lines that make up this visual line.
        for(var i = 0; i <= (lineView.rest ? lineView.rest.length : 0); i++){
            var line = i ? lineView.rest[i - 1] : lineView.line, order = void 0;
            builder.pos = 0;
            builder.addToken = buildToken;
            // Optionally wire in some hacks into the token-rendering
            // algorithm, to deal with browser quirks.
            if (hasBadBidiRects(cm.display.measure) && (order = getOrder(line, cm.doc.direction))) builder.addToken = buildTokenBadBidi(builder.addToken, order);
            builder.map = [];
            var allowFrontierUpdate = lineView != cm.display.externalMeasured && lineNo(line);
            insertLineContent(line, builder, getLineStyles(cm, line, allowFrontierUpdate));
            if (line.styleClasses) {
                if (line.styleClasses.bgClass) builder.bgClass = joinClasses(line.styleClasses.bgClass, builder.bgClass || "");
                if (line.styleClasses.textClass) builder.textClass = joinClasses(line.styleClasses.textClass, builder.textClass || "");
            }
            // Ensure at least a single node is present, for measuring.
            if (builder.map.length == 0) builder.map.push(0, 0, builder.content.appendChild(zeroWidthElement(cm.display.measure)));
            // Store the map and a cache object for the current logical line
            if (i == 0) {
                lineView.measure.map = builder.map;
                lineView.measure.cache = {};
            } else {
                (lineView.measure.maps || (lineView.measure.maps = [])).push(builder.map);
                (lineView.measure.caches || (lineView.measure.caches = [])).push({});
            }
        }
        // See issue #2901
        if (webkit) {
            var last = builder.content.lastChild;
            if (/\bcm-tab\b/.test(last.className) || last.querySelector && last.querySelector(".cm-tab")) builder.content.className = "cm-tab-wrap-hack";
        }
        signal(cm, "renderLine", cm, lineView.line, builder.pre);
        if (builder.pre.className) builder.textClass = joinClasses(builder.pre.className, builder.textClass || "");
        return builder;
    }
    function defaultSpecialCharPlaceholder(ch) {
        var token = elt("span", "\u2022", "cm-invalidchar");
        token.title = "\\u" + ch.charCodeAt(0).toString(16);
        token.setAttribute("aria-label", token.title);
        return token;
    }
    // Build up the DOM representation for a single token, and add it to
    // the line map. Takes care to render special characters separately.
    function buildToken(builder, text, style, startStyle, endStyle, css, attributes) {
        if (!text) return;
        var displayText = builder.splitSpaces ? splitSpaces(text, builder.trailingSpace) : text;
        var special = builder.cm.state.specialChars, mustWrap = false;
        var content;
        if (!special.test(text)) {
            builder.col += text.length;
            content = document.createTextNode(displayText);
            builder.map.push(builder.pos, builder.pos + text.length, content);
            if (ie && ie_version < 9) mustWrap = true;
            builder.pos += text.length;
        } else {
            content = document.createDocumentFragment();
            var pos = 0;
            while(true){
                special.lastIndex = pos;
                var m = special.exec(text);
                var skipped = m ? m.index - pos : text.length - pos;
                if (skipped) {
                    var txt = document.createTextNode(displayText.slice(pos, pos + skipped));
                    if (ie && ie_version < 9) content.appendChild(elt("span", [
                        txt
                    ]));
                    else content.appendChild(txt);
                    builder.map.push(builder.pos, builder.pos + skipped, txt);
                    builder.col += skipped;
                    builder.pos += skipped;
                }
                if (!m) break;
                pos += skipped + 1;
                var txt$1 = void 0;
                if (m[0] == "\t") {
                    var tabSize = builder.cm.options.tabSize, tabWidth = tabSize - builder.col % tabSize;
                    txt$1 = content.appendChild(elt("span", spaceStr(tabWidth), "cm-tab"));
                    txt$1.setAttribute("role", "presentation");
                    txt$1.setAttribute("cm-text", "\t");
                    builder.col += tabWidth;
                } else if (m[0] == "\r" || m[0] == "\n") {
                    txt$1 = content.appendChild(elt("span", m[0] == "\r" ? "\u240d" : "\u2424", "cm-invalidchar"));
                    txt$1.setAttribute("cm-text", m[0]);
                    builder.col += 1;
                } else {
                    txt$1 = builder.cm.options.specialCharPlaceholder(m[0]);
                    txt$1.setAttribute("cm-text", m[0]);
                    if (ie && ie_version < 9) content.appendChild(elt("span", [
                        txt$1
                    ]));
                    else content.appendChild(txt$1);
                    builder.col += 1;
                }
                builder.map.push(builder.pos, builder.pos + 1, txt$1);
                builder.pos++;
            }
        }
        builder.trailingSpace = displayText.charCodeAt(text.length - 1) == 32;
        if (style || startStyle || endStyle || mustWrap || css || attributes) {
            var fullStyle = style || "";
            if (startStyle) fullStyle += startStyle;
            if (endStyle) fullStyle += endStyle;
            var token = elt("span", [
                content
            ], fullStyle, css);
            if (attributes) {
                for(var attr in attributes)if (attributes.hasOwnProperty(attr) && attr != "style" && attr != "class") token.setAttribute(attr, attributes[attr]);
            }
            return builder.content.appendChild(token);
        }
        builder.content.appendChild(content);
    }
    // Change some spaces to NBSP to prevent the browser from collapsing
    // trailing spaces at the end of a line when rendering text (issue #1362).
    function splitSpaces(text, trailingBefore) {
        if (text.length > 1 && !/  /.test(text)) return text;
        var spaceBefore = trailingBefore, result = "";
        for(var i = 0; i < text.length; i++){
            var ch = text.charAt(i);
            if (ch == " " && spaceBefore && (i == text.length - 1 || text.charCodeAt(i + 1) == 32)) ch = "\u00a0";
            result += ch;
            spaceBefore = ch == " ";
        }
        return result;
    }
    // Work around nonsense dimensions being reported for stretches of
    // right-to-left text.
    function buildTokenBadBidi(inner, order) {
        return function(builder, text, style, startStyle, endStyle, css, attributes) {
            style = style ? style + " cm-force-border" : "cm-force-border";
            var start = builder.pos, end = start + text.length;
            for(;;){
                // Find the part that overlaps with the start of this text
                var part = void 0;
                for(var i = 0; i < order.length; i++){
                    part = order[i];
                    if (part.to > start && part.from <= start) break;
                }
                if (part.to >= end) return inner(builder, text, style, startStyle, endStyle, css, attributes);
                inner(builder, text.slice(0, part.to - start), style, startStyle, null, css, attributes);
                startStyle = null;
                text = text.slice(part.to - start);
                start = part.to;
            }
        };
    }
    function buildCollapsedSpan(builder, size, marker, ignoreWidget) {
        var widget = !ignoreWidget && marker.widgetNode;
        if (widget) builder.map.push(builder.pos, builder.pos + size, widget);
        if (!ignoreWidget && builder.cm.display.input.needsContentAttribute) {
            if (!widget) widget = builder.content.appendChild(document.createElement("span"));
            widget.setAttribute("cm-marker", marker.id);
        }
        if (widget) {
            builder.cm.display.input.setUneditable(widget);
            builder.content.appendChild(widget);
        }
        builder.pos += size;
        builder.trailingSpace = false;
    }
    // Outputs a number of spans to make up a line, taking highlighting
    // and marked text into account.
    function insertLineContent(line, builder, styles) {
        var spans = line.markedSpans, allText = line.text, at = 0;
        if (!spans) {
            for(var i$1 = 1; i$1 < styles.length; i$1 += 2)builder.addToken(builder, allText.slice(at, at = styles[i$1]), interpretTokenStyle(styles[i$1 + 1], builder.cm.options));
            return;
        }
        var len = allText.length, pos = 0, i = 1, text = "", style, css;
        var nextChange = 0, spanStyle, spanEndStyle, spanStartStyle, collapsed, attributes;
        for(;;){
            if (nextChange == pos) {
                spanStyle = spanEndStyle = spanStartStyle = css = "";
                attributes = null;
                collapsed = null;
                nextChange = Infinity;
                var foundBookmarks = [], endStyles = void 0;
                for(var j = 0; j < spans.length; ++j){
                    var sp = spans[j], m = sp.marker;
                    if (m.type == "bookmark" && sp.from == pos && m.widgetNode) foundBookmarks.push(m);
                    else if (sp.from <= pos && (sp.to == null || sp.to > pos || m.collapsed && sp.to == pos && sp.from == pos)) {
                        if (sp.to != null && sp.to != pos && nextChange > sp.to) {
                            nextChange = sp.to;
                            spanEndStyle = "";
                        }
                        if (m.className) spanStyle += " " + m.className;
                        if (m.css) css = (css ? css + ";" : "") + m.css;
                        if (m.startStyle && sp.from == pos) spanStartStyle += " " + m.startStyle;
                        if (m.endStyle && sp.to == nextChange) (endStyles || (endStyles = [])).push(m.endStyle, sp.to);
                        // support for the old title property
                        // https://github.com/codemirror/CodeMirror/pull/5673
                        if (m.title) (attributes || (attributes = {})).title = m.title;
                        if (m.attributes) for(var attr in m.attributes)(attributes || (attributes = {}))[attr] = m.attributes[attr];
                        if (m.collapsed && (!collapsed || compareCollapsedMarkers(collapsed.marker, m) < 0)) collapsed = sp;
                    } else if (sp.from > pos && nextChange > sp.from) nextChange = sp.from;
                }
                if (endStyles) {
                    for(var j$1 = 0; j$1 < endStyles.length; j$1 += 2)if (endStyles[j$1 + 1] == nextChange) spanEndStyle += " " + endStyles[j$1];
                }
                if (!collapsed || collapsed.from == pos) for(var j$2 = 0; j$2 < foundBookmarks.length; ++j$2)buildCollapsedSpan(builder, 0, foundBookmarks[j$2]);
                if (collapsed && (collapsed.from || 0) == pos) {
                    buildCollapsedSpan(builder, (collapsed.to == null ? len + 1 : collapsed.to) - pos, collapsed.marker, collapsed.from == null);
                    if (collapsed.to == null) return;
                    if (collapsed.to == pos) collapsed = false;
                }
            }
            if (pos >= len) break;
            var upto = Math.min(len, nextChange);
            while(true){
                if (text) {
                    var end = pos + text.length;
                    if (!collapsed) {
                        var tokenText = end > upto ? text.slice(0, upto - pos) : text;
                        builder.addToken(builder, tokenText, style ? style + spanStyle : spanStyle, spanStartStyle, pos + tokenText.length == nextChange ? spanEndStyle : "", css, attributes);
                    }
                    if (end >= upto) {
                        text = text.slice(upto - pos);
                        pos = upto;
                        break;
                    }
                    pos = end;
                    spanStartStyle = "";
                }
                text = allText.slice(at, at = styles[i++]);
                style = interpretTokenStyle(styles[i++], builder.cm.options);
            }
        }
    }
    // These objects are used to represent the visible (currently drawn)
    // part of the document. A LineView may correspond to multiple
    // logical lines, if those are connected by collapsed ranges.
    function LineView(doc, line, lineN) {
        // The starting line
        this.line = line;
        // Continuing lines, if any
        this.rest = visualLineContinued(line);
        // Number of logical lines in this visual line
        this.size = this.rest ? lineNo(lst(this.rest)) - lineN + 1 : 1;
        this.node = this.text = null;
        this.hidden = lineIsHidden(doc, line);
    }
    // Create a range of LineView objects for the given lines.
    function buildViewArray(cm, from, to) {
        var array = [], nextPos;
        for(var pos = from; pos < to; pos = nextPos){
            var view = new LineView(cm.doc, getLine(cm.doc, pos), pos);
            nextPos = pos + view.size;
            array.push(view);
        }
        return array;
    }
    var operationGroup = null;
    function pushOperation(op) {
        if (operationGroup) operationGroup.ops.push(op);
        else op.ownsGroup = operationGroup = {
            ops: [
                op
            ],
            delayedCallbacks: []
        };
    }
    function fireCallbacksForOps(group) {
        // Calls delayed callbacks and cursorActivity handlers until no
        // new ones appear
        var callbacks = group.delayedCallbacks, i = 0;
        do {
            for(; i < callbacks.length; i++)callbacks[i].call(null);
            for(var j = 0; j < group.ops.length; j++){
                var op = group.ops[j];
                if (op.cursorActivityHandlers) while(op.cursorActivityCalled < op.cursorActivityHandlers.length)op.cursorActivityHandlers[op.cursorActivityCalled++].call(null, op.cm);
            }
        }while (i < callbacks.length);
    }
    function finishOperation(op, endCb) {
        var group = op.ownsGroup;
        if (!group) return;
        try {
            fireCallbacksForOps(group);
        } finally{
            operationGroup = null;
            endCb(group);
        }
    }
    var orphanDelayedCallbacks = null;
    // Often, we want to signal events at a point where we are in the
    // middle of some work, but don't want the handler to start calling
    // other methods on the editor, which might be in an inconsistent
    // state or simply not expect any other events to happen.
    // signalLater looks whether there are any handlers, and schedules
    // them to be executed when the last operation ends, or, if no
    // operation is active, when a timeout fires.
    function signalLater(emitter, type /*, values...*/ ) {
        var arr = getHandlers(emitter, type);
        if (!arr.length) return;
        var args = Array.prototype.slice.call(arguments, 2), list;
        if (operationGroup) list = operationGroup.delayedCallbacks;
        else if (orphanDelayedCallbacks) list = orphanDelayedCallbacks;
        else {
            list = orphanDelayedCallbacks = [];
            setTimeout(fireOrphanDelayed, 0);
        }
        var loop = function(i) {
            list.push(function() {
                return arr[i].apply(null, args);
            });
        };
        for(var i = 0; i < arr.length; ++i)loop(i);
    }
    function fireOrphanDelayed() {
        var delayed = orphanDelayedCallbacks;
        orphanDelayedCallbacks = null;
        for(var i = 0; i < delayed.length; ++i)delayed[i]();
    }
    // When an aspect of a line changes, a string is added to
    // lineView.changes. This updates the relevant part of the line's
    // DOM structure.
    function updateLineForChanges(cm, lineView, lineN, dims) {
        for(var j = 0; j < lineView.changes.length; j++){
            var type = lineView.changes[j];
            if (type == "text") updateLineText(cm, lineView);
            else if (type == "gutter") updateLineGutter(cm, lineView, lineN, dims);
            else if (type == "class") updateLineClasses(cm, lineView);
            else if (type == "widget") updateLineWidgets(cm, lineView, dims);
        }
        lineView.changes = null;
    }
    // Lines with gutter elements, widgets or a background class need to
    // be wrapped, and have the extra elements added to the wrapper div
    function ensureLineWrapped(lineView) {
        if (lineView.node == lineView.text) {
            lineView.node = elt("div", null, null, "position: relative");
            if (lineView.text.parentNode) lineView.text.parentNode.replaceChild(lineView.node, lineView.text);
            lineView.node.appendChild(lineView.text);
            if (ie && ie_version < 8) lineView.node.style.zIndex = 2;
        }
        return lineView.node;
    }
    function updateLineBackground(cm, lineView) {
        var cls = lineView.bgClass ? lineView.bgClass + " " + (lineView.line.bgClass || "") : lineView.line.bgClass;
        if (cls) cls += " CodeMirror-linebackground";
        if (lineView.background) {
            if (cls) lineView.background.className = cls;
            else {
                lineView.background.parentNode.removeChild(lineView.background);
                lineView.background = null;
            }
        } else if (cls) {
            var wrap = ensureLineWrapped(lineView);
            lineView.background = wrap.insertBefore(elt("div", null, cls), wrap.firstChild);
            cm.display.input.setUneditable(lineView.background);
        }
    }
    // Wrapper around buildLineContent which will reuse the structure
    // in display.externalMeasured when possible.
    function getLineContent(cm, lineView) {
        var ext = cm.display.externalMeasured;
        if (ext && ext.line == lineView.line) {
            cm.display.externalMeasured = null;
            lineView.measure = ext.measure;
            return ext.built;
        }
        return buildLineContent(cm, lineView);
    }
    // Redraw the line's text. Interacts with the background and text
    // classes because the mode may output tokens that influence these
    // classes.
    function updateLineText(cm, lineView) {
        var cls = lineView.text.className;
        var built = getLineContent(cm, lineView);
        if (lineView.text == lineView.node) lineView.node = built.pre;
        lineView.text.parentNode.replaceChild(built.pre, lineView.text);
        lineView.text = built.pre;
        if (built.bgClass != lineView.bgClass || built.textClass != lineView.textClass) {
            lineView.bgClass = built.bgClass;
            lineView.textClass = built.textClass;
            updateLineClasses(cm, lineView);
        } else if (cls) lineView.text.className = cls;
    }
    function updateLineClasses(cm, lineView) {
        updateLineBackground(cm, lineView);
        if (lineView.line.wrapClass) ensureLineWrapped(lineView).className = lineView.line.wrapClass;
        else if (lineView.node != lineView.text) lineView.node.className = "";
        var textClass = lineView.textClass ? lineView.textClass + " " + (lineView.line.textClass || "") : lineView.line.textClass;
        lineView.text.className = textClass || "";
    }
    function updateLineGutter(cm, lineView, lineN, dims) {
        if (lineView.gutter) {
            lineView.node.removeChild(lineView.gutter);
            lineView.gutter = null;
        }
        if (lineView.gutterBackground) {
            lineView.node.removeChild(lineView.gutterBackground);
            lineView.gutterBackground = null;
        }
        if (lineView.line.gutterClass) {
            var wrap = ensureLineWrapped(lineView);
            lineView.gutterBackground = elt("div", null, "CodeMirror-gutter-background " + lineView.line.gutterClass, "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px; width: " + dims.gutterTotalWidth + "px");
            cm.display.input.setUneditable(lineView.gutterBackground);
            wrap.insertBefore(lineView.gutterBackground, lineView.text);
        }
        var markers = lineView.line.gutterMarkers;
        if (cm.options.lineNumbers || markers) {
            var wrap$1 = ensureLineWrapped(lineView);
            var gutterWrap = lineView.gutter = elt("div", null, "CodeMirror-gutter-wrapper", "left: " + (cm.options.fixedGutter ? dims.fixedPos : -dims.gutterTotalWidth) + "px");
            gutterWrap.setAttribute("aria-hidden", "true");
            cm.display.input.setUneditable(gutterWrap);
            wrap$1.insertBefore(gutterWrap, lineView.text);
            if (lineView.line.gutterClass) gutterWrap.className += " " + lineView.line.gutterClass;
            if (cm.options.lineNumbers && (!markers || !markers["CodeMirror-linenumbers"])) lineView.lineNumber = gutterWrap.appendChild(elt("div", lineNumberFor(cm.options, lineN), "CodeMirror-linenumber CodeMirror-gutter-elt", "left: " + dims.gutterLeft["CodeMirror-linenumbers"] + "px; width: " + cm.display.lineNumInnerWidth + "px"));
            if (markers) for(var k = 0; k < cm.display.gutterSpecs.length; ++k){
                var id = cm.display.gutterSpecs[k].className, found = markers.hasOwnProperty(id) && markers[id];
                if (found) gutterWrap.appendChild(elt("div", [
                    found
                ], "CodeMirror-gutter-elt", "left: " + dims.gutterLeft[id] + "px; width: " + dims.gutterWidth[id] + "px"));
            }
        }
    }
    function updateLineWidgets(cm, lineView, dims) {
        if (lineView.alignable) lineView.alignable = null;
        var isWidget = classTest("CodeMirror-linewidget");
        for(var node = lineView.node.firstChild, next = void 0; node; node = next){
            next = node.nextSibling;
            if (isWidget.test(node.className)) lineView.node.removeChild(node);
        }
        insertLineWidgets(cm, lineView, dims);
    }
    // Build a line's DOM representation from scratch
    function buildLineElement(cm, lineView, lineN, dims) {
        var built = getLineContent(cm, lineView);
        lineView.text = lineView.node = built.pre;
        if (built.bgClass) lineView.bgClass = built.bgClass;
        if (built.textClass) lineView.textClass = built.textClass;
        updateLineClasses(cm, lineView);
        updateLineGutter(cm, lineView, lineN, dims);
        insertLineWidgets(cm, lineView, dims);
        return lineView.node;
    }
    // A lineView may contain multiple logical lines (when merged by
    // collapsed spans). The widgets for all of them need to be drawn.
    function insertLineWidgets(cm, lineView, dims) {
        insertLineWidgetsFor(cm, lineView.line, lineView, dims, true);
        if (lineView.rest) for(var i = 0; i < lineView.rest.length; i++)insertLineWidgetsFor(cm, lineView.rest[i], lineView, dims, false);
    }
    function insertLineWidgetsFor(cm, line, lineView, dims, allowAbove) {
        if (!line.widgets) return;
        var wrap = ensureLineWrapped(lineView);
        for(var i = 0, ws = line.widgets; i < ws.length; ++i){
            var widget = ws[i], node = elt("div", [
                widget.node
            ], "CodeMirror-linewidget" + (widget.className ? " " + widget.className : ""));
            if (!widget.handleMouseEvents) node.setAttribute("cm-ignore-events", "true");
            positionLineWidget(widget, node, lineView, dims);
            cm.display.input.setUneditable(node);
            if (allowAbove && widget.above) wrap.insertBefore(node, lineView.gutter || lineView.text);
            else wrap.appendChild(node);
            signalLater(widget, "redraw");
        }
    }
    function positionLineWidget(widget, node, lineView, dims) {
        if (widget.noHScroll) {
            (lineView.alignable || (lineView.alignable = [])).push(node);
            var width = dims.wrapperWidth;
            node.style.left = dims.fixedPos + "px";
            if (!widget.coverGutter) {
                width -= dims.gutterTotalWidth;
                node.style.paddingLeft = dims.gutterTotalWidth + "px";
            }
            node.style.width = width + "px";
        }
        if (widget.coverGutter) {
            node.style.zIndex = 5;
            node.style.position = "relative";
            if (!widget.noHScroll) node.style.marginLeft = -dims.gutterTotalWidth + "px";
        }
    }
    function widgetHeight(widget) {
        if (widget.height != null) return widget.height;
        var cm = widget.doc.cm;
        if (!cm) return 0;
        if (!contains(document.body, widget.node)) {
            var parentStyle = "position: relative;";
            if (widget.coverGutter) parentStyle += "margin-left: -" + cm.display.gutters.offsetWidth + "px;";
            if (widget.noHScroll) parentStyle += "width: " + cm.display.wrapper.clientWidth + "px;";
            removeChildrenAndAdd(cm.display.measure, elt("div", [
                widget.node
            ], null, parentStyle));
        }
        return widget.height = widget.node.parentNode.offsetHeight;
    }
    // Return true when the given mouse event happened in a widget
    function eventInWidget(display, e) {
        for(var n = e_target(e); n != display.wrapper; n = n.parentNode){
            if (!n || n.nodeType == 1 && n.getAttribute("cm-ignore-events") == "true" || n.parentNode == display.sizer && n != display.mover) return true;
        }
    }
    // POSITION MEASUREMENT
    function paddingTop(display) {
        return display.lineSpace.offsetTop;
    }
    function paddingVert(display) {
        return display.mover.offsetHeight - display.lineSpace.offsetHeight;
    }
    function paddingH(display) {
        if (display.cachedPaddingH) return display.cachedPaddingH;
        var e = removeChildrenAndAdd(display.measure, elt("pre", "x", "CodeMirror-line-like"));
        var style = window.getComputedStyle ? window.getComputedStyle(e) : e.currentStyle;
        var data = {
            left: parseInt(style.paddingLeft),
            right: parseInt(style.paddingRight)
        };
        if (!isNaN(data.left) && !isNaN(data.right)) display.cachedPaddingH = data;
        return data;
    }
    function scrollGap(cm) {
        return scrollerGap - cm.display.nativeBarWidth;
    }
    function displayWidth(cm) {
        return cm.display.scroller.clientWidth - scrollGap(cm) - cm.display.barWidth;
    }
    function displayHeight(cm) {
        return cm.display.scroller.clientHeight - scrollGap(cm) - cm.display.barHeight;
    }
    // Ensure the lineView.wrapping.heights array is populated. This is
    // an array of bottom offsets for the lines that make up a drawn
    // line. When lineWrapping is on, there might be more than one
    // height.
    function ensureLineHeights(cm, lineView, rect) {
        var wrapping = cm.options.lineWrapping;
        var curWidth = wrapping && displayWidth(cm);
        if (!lineView.measure.heights || wrapping && lineView.measure.width != curWidth) {
            var heights = lineView.measure.heights = [];
            if (wrapping) {
                lineView.measure.width = curWidth;
                var rects = lineView.text.firstChild.getClientRects();
                for(var i = 0; i < rects.length - 1; i++){
                    var cur = rects[i], next = rects[i + 1];
                    if (Math.abs(cur.bottom - next.bottom) > 2) heights.push((cur.bottom + next.top) / 2 - rect.top);
                }
            }
            heights.push(rect.bottom - rect.top);
        }
    }
    // Find a line map (mapping character offsets to text nodes) and a
    // measurement cache for the given line number. (A line view might
    // contain multiple lines when collapsed ranges are present.)
    function mapFromLineView(lineView, line, lineN) {
        if (lineView.line == line) return {
            map: lineView.measure.map,
            cache: lineView.measure.cache
        };
        if (lineView.rest) {
            for(var i = 0; i < lineView.rest.length; i++){
                if (lineView.rest[i] == line) return {
                    map: lineView.measure.maps[i],
                    cache: lineView.measure.caches[i]
                };
            }
            for(var i$1 = 0; i$1 < lineView.rest.length; i$1++){
                if (lineNo(lineView.rest[i$1]) > lineN) return {
                    map: lineView.measure.maps[i$1],
                    cache: lineView.measure.caches[i$1],
                    before: true
                };
            }
        }
    }
    // Render a line into the hidden node display.externalMeasured. Used
    // when measurement is needed for a line that's not in the viewport.
    function updateExternalMeasurement(cm, line) {
        line = visualLine(line);
        var lineN = lineNo(line);
        var view = cm.display.externalMeasured = new LineView(cm.doc, line, lineN);
        view.lineN = lineN;
        var built = view.built = buildLineContent(cm, view);
        view.text = built.pre;
        removeChildrenAndAdd(cm.display.lineMeasure, built.pre);
        return view;
    }
    // Get a {top, bottom, left, right} box (in line-local coordinates)
    // for a given character.
    function measureChar(cm, line, ch, bias) {
        return measureCharPrepared(cm, prepareMeasureForLine(cm, line), ch, bias);
    }
    // Find a line view that corresponds to the given line number.
    function findViewForLine(cm, lineN) {
        if (lineN >= cm.display.viewFrom && lineN < cm.display.viewTo) return cm.display.view[findViewIndex(cm, lineN)];
        var ext = cm.display.externalMeasured;
        if (ext && lineN >= ext.lineN && lineN < ext.lineN + ext.size) return ext;
    }
    // Measurement can be split in two steps, the set-up work that
    // applies to the whole line, and the measurement of the actual
    // character. Functions like coordsChar, that need to do a lot of
    // measurements in a row, can thus ensure that the set-up work is
    // only done once.
    function prepareMeasureForLine(cm, line) {
        var lineN = lineNo(line);
        var view = findViewForLine(cm, lineN);
        if (view && !view.text) view = null;
        else if (view && view.changes) {
            updateLineForChanges(cm, view, lineN, getDimensions(cm));
            cm.curOp.forceUpdate = true;
        }
        if (!view) view = updateExternalMeasurement(cm, line);
        var info = mapFromLineView(view, line, lineN);
        return {
            line: line,
            view: view,
            rect: null,
            map: info.map,
            cache: info.cache,
            before: info.before,
            hasHeights: false
        };
    }
    // Given a prepared measurement object, measures the position of an
    // actual character (or fetches it from the cache).
    function measureCharPrepared(cm, prepared, ch, bias, varHeight) {
        if (prepared.before) ch = -1;
        var key = ch + (bias || ""), found;
        if (prepared.cache.hasOwnProperty(key)) found = prepared.cache[key];
        else {
            if (!prepared.rect) prepared.rect = prepared.view.text.getBoundingClientRect();
            if (!prepared.hasHeights) {
                ensureLineHeights(cm, prepared.view, prepared.rect);
                prepared.hasHeights = true;
            }
            found = measureCharInner(cm, prepared, ch, bias);
            if (!found.bogus) prepared.cache[key] = found;
        }
        return {
            left: found.left,
            right: found.right,
            top: varHeight ? found.rtop : found.top,
            bottom: varHeight ? found.rbottom : found.bottom
        };
    }
    var nullRect = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };
    function nodeAndOffsetInLineMap(map, ch, bias) {
        var node, start, end, collapse, mStart, mEnd;
        // First, search the line map for the text node corresponding to,
        // or closest to, the target character.
        for(var i = 0; i < map.length; i += 3){
            mStart = map[i];
            mEnd = map[i + 1];
            if (ch < mStart) {
                start = 0;
                end = 1;
                collapse = "left";
            } else if (ch < mEnd) {
                start = ch - mStart;
                end = start + 1;
            } else if (i == map.length - 3 || ch == mEnd && map[i + 3] > ch) {
                end = mEnd - mStart;
                start = end - 1;
                if (ch >= mEnd) collapse = "right";
            }
            if (start != null) {
                node = map[i + 2];
                if (mStart == mEnd && bias == (node.insertLeft ? "left" : "right")) collapse = bias;
                if (bias == "left" && start == 0) while(i && map[i - 2] == map[i - 3] && map[i - 1].insertLeft){
                    node = map[(i -= 3) + 2];
                    collapse = "left";
                }
                if (bias == "right" && start == mEnd - mStart) while(i < map.length - 3 && map[i + 3] == map[i + 4] && !map[i + 5].insertLeft){
                    node = map[(i += 3) + 2];
                    collapse = "right";
                }
                break;
            }
        }
        return {
            node: node,
            start: start,
            end: end,
            collapse: collapse,
            coverStart: mStart,
            coverEnd: mEnd
        };
    }
    function getUsefulRect(rects, bias) {
        var rect = nullRect;
        if (bias == "left") for(var i = 0; i < rects.length; i++){
            if ((rect = rects[i]).left != rect.right) break;
        }
        else for(var i$1 = rects.length - 1; i$1 >= 0; i$1--){
            if ((rect = rects[i$1]).left != rect.right) break;
        }
        return rect;
    }
    function measureCharInner(cm, prepared, ch, bias) {
        var place = nodeAndOffsetInLineMap(prepared.map, ch, bias);
        var node = place.node, start = place.start, end = place.end, collapse = place.collapse;
        var rect;
        if (node.nodeType == 3) {
            for(var i$1 = 0; i$1 < 4; i$1++){
                while(start && isExtendingChar(prepared.line.text.charAt(place.coverStart + start)))--start;
                while(place.coverStart + end < place.coverEnd && isExtendingChar(prepared.line.text.charAt(place.coverStart + end)))++end;
                if (ie && ie_version < 9 && start == 0 && end == place.coverEnd - place.coverStart) rect = node.parentNode.getBoundingClientRect();
                else rect = getUsefulRect(range(node, start, end).getClientRects(), bias);
                if (rect.left || rect.right || start == 0) break;
                end = start;
                start = start - 1;
                collapse = "right";
            }
            if (ie && ie_version < 11) rect = maybeUpdateRectForZooming(cm.display.measure, rect);
        } else {
            if (start > 0) collapse = bias = "right";
            var rects;
            if (cm.options.lineWrapping && (rects = node.getClientRects()).length > 1) rect = rects[bias == "right" ? rects.length - 1 : 0];
            else rect = node.getBoundingClientRect();
        }
        if (ie && ie_version < 9 && !start && (!rect || !rect.left && !rect.right)) {
            var rSpan = node.parentNode.getClientRects()[0];
            if (rSpan) rect = {
                left: rSpan.left,
                right: rSpan.left + charWidth(cm.display),
                top: rSpan.top,
                bottom: rSpan.bottom
            };
            else rect = nullRect;
        }
        var rtop = rect.top - prepared.rect.top, rbot = rect.bottom - prepared.rect.top;
        var mid = (rtop + rbot) / 2;
        var heights = prepared.view.measure.heights;
        var i = 0;
        for(; i < heights.length - 1; i++){
            if (mid < heights[i]) break;
        }
        var top = i ? heights[i - 1] : 0, bot = heights[i];
        var result = {
            left: (collapse == "right" ? rect.right : rect.left) - prepared.rect.left,
            right: (collapse == "left" ? rect.left : rect.right) - prepared.rect.left,
            top: top,
            bottom: bot
        };
        if (!rect.left && !rect.right) result.bogus = true;
        if (!cm.options.singleCursorHeightPerLine) {
            result.rtop = rtop;
            result.rbottom = rbot;
        }
        return result;
    }
    // Work around problem with bounding client rects on ranges being
    // returned incorrectly when zoomed on IE10 and below.
    function maybeUpdateRectForZooming(measure, rect) {
        if (!window.screen || screen.logicalXDPI == null || screen.logicalXDPI == screen.deviceXDPI || !hasBadZoomedRects(measure)) return rect;
        var scaleX = screen.logicalXDPI / screen.deviceXDPI;
        var scaleY = screen.logicalYDPI / screen.deviceYDPI;
        return {
            left: rect.left * scaleX,
            right: rect.right * scaleX,
            top: rect.top * scaleY,
            bottom: rect.bottom * scaleY
        };
    }
    function clearLineMeasurementCacheFor(lineView) {
        if (lineView.measure) {
            lineView.measure.cache = {};
            lineView.measure.heights = null;
            if (lineView.rest) for(var i = 0; i < lineView.rest.length; i++)lineView.measure.caches[i] = {};
        }
    }
    function clearLineMeasurementCache(cm) {
        cm.display.externalMeasure = null;
        removeChildren(cm.display.lineMeasure);
        for(var i = 0; i < cm.display.view.length; i++)clearLineMeasurementCacheFor(cm.display.view[i]);
    }
    function clearCaches(cm) {
        clearLineMeasurementCache(cm);
        cm.display.cachedCharWidth = cm.display.cachedTextHeight = cm.display.cachedPaddingH = null;
        if (!cm.options.lineWrapping) cm.display.maxLineChanged = true;
        cm.display.lineNumChars = null;
    }
    function pageScrollX(doc) {
        // Work around https://bugs.chromium.org/p/chromium/issues/detail?id=489206
        // which causes page_Offset and bounding client rects to use
        // different reference viewports and invalidate our calculations.
        if (chrome && android) return -(doc.body.getBoundingClientRect().left - parseInt(getComputedStyle(doc.body).marginLeft));
        return doc.defaultView.pageXOffset || (doc.documentElement || doc.body).scrollLeft;
    }
    function pageScrollY(doc) {
        if (chrome && android) return -(doc.body.getBoundingClientRect().top - parseInt(getComputedStyle(doc.body).marginTop));
        return doc.defaultView.pageYOffset || (doc.documentElement || doc.body).scrollTop;
    }
    function widgetTopHeight(lineObj) {
        var ref = visualLine(lineObj);
        var widgets = ref.widgets;
        var height = 0;
        if (widgets) {
            for(var i = 0; i < widgets.length; ++i)if (widgets[i].above) height += widgetHeight(widgets[i]);
        }
        return height;
    }
    // Converts a {top, bottom, left, right} box from line-local
    // coordinates into another coordinate system. Context may be one of
    // "line", "div" (display.lineDiv), "local"./null (editor), "window",
    // or "page".
    function intoCoordSystem(cm, lineObj, rect, context, includeWidgets) {
        if (!includeWidgets) {
            var height = widgetTopHeight(lineObj);
            rect.top += height;
            rect.bottom += height;
        }
        if (context == "line") return rect;
        if (!context) context = "local";
        var yOff = heightAtLine(lineObj);
        if (context == "local") yOff += paddingTop(cm.display);
        else yOff -= cm.display.viewOffset;
        if (context == "page" || context == "window") {
            var lOff = cm.display.lineSpace.getBoundingClientRect();
            yOff += lOff.top + (context == "window" ? 0 : pageScrollY(doc(cm)));
            var xOff = lOff.left + (context == "window" ? 0 : pageScrollX(doc(cm)));
            rect.left += xOff;
            rect.right += xOff;
        }
        rect.top += yOff;
        rect.bottom += yOff;
        return rect;
    }
    // Coverts a box from "div" coords to another coordinate system.
    // Context may be "window", "page", "div", or "local"./null.
    function fromCoordSystem(cm, coords, context) {
        if (context == "div") return coords;
        var left = coords.left, top = coords.top;
        // First move into "page" coordinate system
        if (context == "page") {
            left -= pageScrollX(doc(cm));
            top -= pageScrollY(doc(cm));
        } else if (context == "local" || !context) {
            var localBox = cm.display.sizer.getBoundingClientRect();
            left += localBox.left;
            top += localBox.top;
        }
        var lineSpaceBox = cm.display.lineSpace.getBoundingClientRect();
        return {
            left: left - lineSpaceBox.left,
            top: top - lineSpaceBox.top
        };
    }
    function charCoords(cm, pos, context, lineObj, bias) {
        if (!lineObj) lineObj = getLine(cm.doc, pos.line);
        return intoCoordSystem(cm, lineObj, measureChar(cm, lineObj, pos.ch, bias), context);
    }
    // Returns a box for a given cursor position, which may have an
    // 'other' property containing the position of the secondary cursor
    // on a bidi boundary.
    // A cursor Pos(line, char, "before") is on the same visual line as `char - 1`
    // and after `char - 1` in writing order of `char - 1`
    // A cursor Pos(line, char, "after") is on the same visual line as `char`
    // and before `char` in writing order of `char`
    // Examples (upper-case letters are RTL, lower-case are LTR):
    //     Pos(0, 1, ...)
    //     before   after
    // ab     a|b     a|b
    // aB     a|B     aB|
    // Ab     |Ab     A|b
    // AB     B|A     B|A
    // Every position after the last character on a line is considered to stick
    // to the last character on the line.
    function cursorCoords(cm, pos, context, lineObj, preparedMeasure, varHeight) {
        lineObj = lineObj || getLine(cm.doc, pos.line);
        if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
        function get(ch, right) {
            var m = measureCharPrepared(cm, preparedMeasure, ch, right ? "right" : "left", varHeight);
            if (right) m.left = m.right;
            else m.right = m.left;
            return intoCoordSystem(cm, lineObj, m, context);
        }
        var order = getOrder(lineObj, cm.doc.direction), ch = pos.ch, sticky = pos.sticky;
        if (ch >= lineObj.text.length) {
            ch = lineObj.text.length;
            sticky = "before";
        } else if (ch <= 0) {
            ch = 0;
            sticky = "after";
        }
        if (!order) return get(sticky == "before" ? ch - 1 : ch, sticky == "before");
        function getBidi(ch, partPos, invert) {
            var part = order[partPos], right = part.level == 1;
            return get(invert ? ch - 1 : ch, right != invert);
        }
        var partPos = getBidiPartAt(order, ch, sticky);
        var other = bidiOther;
        var val = getBidi(ch, partPos, sticky == "before");
        if (other != null) val.other = getBidi(ch, other, sticky != "before");
        return val;
    }
    // Used to cheaply estimate the coordinates for a position. Used for
    // intermediate scroll updates.
    function estimateCoords(cm, pos) {
        var left = 0;
        pos = clipPos(cm.doc, pos);
        if (!cm.options.lineWrapping) left = charWidth(cm.display) * pos.ch;
        var lineObj = getLine(cm.doc, pos.line);
        var top = heightAtLine(lineObj) + paddingTop(cm.display);
        return {
            left: left,
            right: left,
            top: top,
            bottom: top + lineObj.height
        };
    }
    // Positions returned by coordsChar contain some extra information.
    // xRel is the relative x position of the input coordinates compared
    // to the found position (so xRel > 0 means the coordinates are to
    // the right of the character position, for example). When outside
    // is true, that means the coordinates lie outside the line's
    // vertical range.
    function PosWithInfo(line, ch, sticky, outside, xRel) {
        var pos = Pos(line, ch, sticky);
        pos.xRel = xRel;
        if (outside) pos.outside = outside;
        return pos;
    }
    // Compute the character position closest to the given coordinates.
    // Input must be lineSpace-local ("div" coordinate system).
    function coordsChar(cm, x, y) {
        var doc = cm.doc;
        y += cm.display.viewOffset;
        if (y < 0) return PosWithInfo(doc.first, 0, null, -1, -1);
        var lineN = lineAtHeight(doc, y), last = doc.first + doc.size - 1;
        if (lineN > last) return PosWithInfo(doc.first + doc.size - 1, getLine(doc, last).text.length, null, 1, 1);
        if (x < 0) x = 0;
        var lineObj = getLine(doc, lineN);
        for(;;){
            var found = coordsCharInner(cm, lineObj, lineN, x, y);
            var collapsed = collapsedSpanAround(lineObj, found.ch + (found.xRel > 0 || found.outside > 0 ? 1 : 0));
            if (!collapsed) return found;
            var rangeEnd = collapsed.find(1);
            if (rangeEnd.line == lineN) return rangeEnd;
            lineObj = getLine(doc, lineN = rangeEnd.line);
        }
    }
    function wrappedLineExtent(cm, lineObj, preparedMeasure, y) {
        y -= widgetTopHeight(lineObj);
        var end = lineObj.text.length;
        var begin = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch - 1).bottom <= y;
        }, end, 0);
        end = findFirst(function(ch) {
            return measureCharPrepared(cm, preparedMeasure, ch).top > y;
        }, begin, end);
        return {
            begin: begin,
            end: end
        };
    }
    function wrappedLineExtentChar(cm, lineObj, preparedMeasure, target) {
        if (!preparedMeasure) preparedMeasure = prepareMeasureForLine(cm, lineObj);
        var targetTop = intoCoordSystem(cm, lineObj, measureCharPrepared(cm, preparedMeasure, target), "line").top;
        return wrappedLineExtent(cm, lineObj, preparedMeasure, targetTop);
    }
    // Returns true if the given side of a box is after the given
    // coordinates, in top-to-bottom, left-to-right order.
    function boxIsAfter(box, x, y, left) {
        return box.bottom <= y ? false : box.top > y ? true : (left ? box.left : box.right) > x;
    }
    function coordsCharInner(cm, lineObj, lineNo, x, y) {
        // Move y into line-local coordinate space
        y -= heightAtLine(lineObj);
        var preparedMeasure = prepareMeasureForLine(cm, lineObj);
        // When directly calling `measureCharPrepared`, we have to adjust
        // for the widgets at this line.
        var widgetHeight = widgetTopHeight(lineObj);
        var begin = 0, end = lineObj.text.length, ltr = true;
        var order = getOrder(lineObj, cm.doc.direction);
        // If the line isn't plain left-to-right text, first figure out
        // which bidi section the coordinates fall into.
        if (order) {
            var part = (cm.options.lineWrapping ? coordsBidiPartWrapped : coordsBidiPart)(cm, lineObj, lineNo, preparedMeasure, order, x, y);
            ltr = part.level != 1;
            // The awkward -1 offsets are needed because findFirst (called
            // on these below) will treat its first bound as inclusive,
            // second as exclusive, but we want to actually address the
            // characters in the part's range
            begin = ltr ? part.from : part.to - 1;
            end = ltr ? part.to : part.from - 1;
        }
        // A binary search to find the first character whose bounding box
        // starts after the coordinates. If we run across any whose box wrap
        // the coordinates, store that.
        var chAround = null, boxAround = null;
        var ch = findFirst(function(ch) {
            var box = measureCharPrepared(cm, preparedMeasure, ch);
            box.top += widgetHeight;
            box.bottom += widgetHeight;
            if (!boxIsAfter(box, x, y, false)) return false;
            if (box.top <= y && box.left <= x) {
                chAround = ch;
                boxAround = box;
            }
            return true;
        }, begin, end);
        var baseX, sticky, outside = false;
        // If a box around the coordinates was found, use that
        if (boxAround) {
            // Distinguish coordinates nearer to the left or right side of the box
            var atLeft = x - boxAround.left < boxAround.right - x, atStart = atLeft == ltr;
            ch = chAround + (atStart ? 0 : 1);
            sticky = atStart ? "after" : "before";
            baseX = atLeft ? boxAround.left : boxAround.right;
        } else {
            // (Adjust for extended bound, if necessary.)
            if (!ltr && (ch == end || ch == begin)) ch++;
            // To determine which side to associate with, get the box to the
            // left of the character and compare it's vertical position to the
            // coordinates
            sticky = ch == 0 ? "after" : ch == lineObj.text.length ? "before" : measureCharPrepared(cm, preparedMeasure, ch - (ltr ? 1 : 0)).bottom + widgetHeight <= y == ltr ? "after" : "before";
            // Now get accurate coordinates for this place, in order to get a
            // base X position
            var coords = cursorCoords(cm, Pos(lineNo, ch, sticky), "line", lineObj, preparedMeasure);
            baseX = coords.left;
            outside = y < coords.top ? -1 : y >= coords.bottom ? 1 : 0;
        }
        ch = skipExtendingChars(lineObj.text, ch, 1);
        return PosWithInfo(lineNo, ch, sticky, outside, x - baseX);
    }
    function coordsBidiPart(cm, lineObj, lineNo, preparedMeasure, order, x, y) {
        // Bidi parts are sorted left-to-right, and in a non-line-wrapping
        // situation, we can take this ordering to correspond to the visual
        // ordering. This finds the first part whose end is after the given
        // coordinates.
        var index = findFirst(function(i) {
            var part = order[i], ltr = part.level != 1;
            return boxIsAfter(cursorCoords(cm, Pos(lineNo, ltr ? part.to : part.from, ltr ? "before" : "after"), "line", lineObj, preparedMeasure), x, y, true);
        }, 0, order.length - 1);
        var part = order[index];
        // If this isn't the first part, the part's start is also after
        // the coordinates, and the coordinates aren't on the same line as
        // that start, move one part back.
        if (index > 0) {
            var ltr = part.level != 1;
            var start = cursorCoords(cm, Pos(lineNo, ltr ? part.from : part.to, ltr ? "after" : "before"), "line", lineObj, preparedMeasure);
            if (boxIsAfter(start, x, y, true) && start.top > y) part = order[index - 1];
        }
        return part;
    }
    function coordsBidiPartWrapped(cm, lineObj, _lineNo, preparedMeasure, order, x, y) {
        // In a wrapped line, rtl text on wrapping boundaries can do things
        // that don't correspond to the ordering in our `order` array at
        // all, so a binary search doesn't work, and we want to return a
        // part that only spans one line so that the binary search in
        // coordsCharInner is safe. As such, we first find the extent of the
        // wrapped line, and then do a flat search in which we discard any
        // spans that aren't on the line.
        var ref = wrappedLineExtent(cm, lineObj, preparedMeasure, y);
        var begin = ref.begin;
        var end = ref.end;
        if (/\s/.test(lineObj.text.charAt(end - 1))) end--;
        var part = null, closestDist = null;
        for(var i = 0; i < order.length; i++){
            var p = order[i];
            if (p.from >= end || p.to <= begin) continue;
            var ltr = p.level != 1;
            var endX = measureCharPrepared(cm, preparedMeasure, ltr ? Math.min(end, p.to) - 1 : Math.max(begin, p.from)).right;
            // Weigh against spans ending before this, so that they are only
            // picked if nothing ends after
            var dist = endX < x ? x - endX + 1e9 : endX - x;
            if (!part || closestDist > dist) {
                part = p;
                closestDist = dist;
            }
        }
        if (!part) part = order[order.length - 1];
        // Clip the part to the wrapped line.
        if (part.from < begin) part = {
            from: begin,
            to: part.to,
            level: part.level
        };
        if (part.to > end) part = {
            from: part.from,
            to: end,
            level: part.level
        };
        return part;
    }
    var measureText;
    // Compute the default text height.
    function textHeight(display) {
        if (display.cachedTextHeight != null) return display.cachedTextHeight;
        if (measureText == null) {
            measureText = elt("pre", null, "CodeMirror-line-like");
            // Measure a bunch of lines, for browsers that compute
            // fractional heights.
            for(var i = 0; i < 49; ++i){
                measureText.appendChild(document.createTextNode("x"));
                measureText.appendChild(elt("br"));
            }
            measureText.appendChild(document.createTextNode("x"));
        }
        removeChildrenAndAdd(display.measure, measureText);
        var height = measureText.offsetHeight / 50;
        if (height > 3) display.cachedTextHeight = height;
        removeChildren(display.measure);
        return height || 1;
    }
    // Compute the default character width.
    function charWidth(display) {
        if (display.cachedCharWidth != null) return display.cachedCharWidth;
        var anchor = elt("span", "xxxxxxxxxx");
        var pre = elt("pre", [
            anchor
        ], "CodeMirror-line-like");
        removeChildrenAndAdd(display.measure, pre);
        var rect = anchor.getBoundingClientRect(), width = (rect.right - rect.left) / 10;
        if (width > 2) display.cachedCharWidth = width;
        return width || 10;
    }
    // Do a bulk-read of the DOM positions and sizes needed to draw the
    // view, so that we don't interleave reading and writing to the DOM.
    function getDimensions(cm) {
        var d = cm.display, left = {}, width = {};
        var gutterLeft = d.gutters.clientLeft;
        for(var n = d.gutters.firstChild, i = 0; n; n = n.nextSibling, ++i){
            var id = cm.display.gutterSpecs[i].className;
            left[id] = n.offsetLeft + n.clientLeft + gutterLeft;
            width[id] = n.clientWidth;
        }
        return {
            fixedPos: compensateForHScroll(d),
            gutterTotalWidth: d.gutters.offsetWidth,
            gutterLeft: left,
            gutterWidth: width,
            wrapperWidth: d.wrapper.clientWidth
        };
    }
    // Computes display.scroller.scrollLeft + display.gutters.offsetWidth,
    // but using getBoundingClientRect to get a sub-pixel-accurate
    // result.
    function compensateForHScroll(display) {
        return display.scroller.getBoundingClientRect().left - display.sizer.getBoundingClientRect().left;
    }
    // Returns a function that estimates the height of a line, to use as
    // first approximation until the line becomes visible (and is thus
    // properly measurable).
    function estimateHeight(cm) {
        var th = textHeight(cm.display), wrapping = cm.options.lineWrapping;
        var perLine = wrapping && Math.max(5, cm.display.scroller.clientWidth / charWidth(cm.display) - 3);
        return function(line) {
            if (lineIsHidden(cm.doc, line)) return 0;
            var widgetsHeight = 0;
            if (line.widgets) {
                for(var i = 0; i < line.widgets.length; i++)if (line.widgets[i].height) widgetsHeight += line.widgets[i].height;
            }
            if (wrapping) return widgetsHeight + (Math.ceil(line.text.length / perLine) || 1) * th;
            else return widgetsHeight + th;
        };
    }
    function estimateLineHeights(cm) {
        var doc = cm.doc, est = estimateHeight(cm);
        doc.iter(function(line) {
            var estHeight = est(line);
            if (estHeight != line.height) updateLineHeight(line, estHeight);
        });
    }
    // Given a mouse event, find the corresponding position. If liberal
    // is false, it checks whether a gutter or scrollbar was clicked,
    // and returns null if it was. forRect is used by rectangular
    // selections, and tries to estimate a character position even for
    // coordinates beyond the right of the text.
    function posFromMouse(cm, e, liberal, forRect) {
        var display = cm.display;
        if (!liberal && e_target(e).getAttribute("cm-not-content") == "true") return null;
        var x, y, space = display.lineSpace.getBoundingClientRect();
        // Fails unpredictably on IE[67] when mouse is dragged around quickly.
        try {
            x = e.clientX - space.left;
            y = e.clientY - space.top;
        } catch (e$1) {
            return null;
        }
        var coords = coordsChar(cm, x, y), line;
        if (forRect && coords.xRel > 0 && (line = getLine(cm.doc, coords.line).text).length == coords.ch) {
            var colDiff = countColumn(line, line.length, cm.options.tabSize) - line.length;
            coords = Pos(coords.line, Math.max(0, Math.round((x - paddingH(cm.display).left) / charWidth(cm.display)) - colDiff));
        }
        return coords;
    }
    // Find the view element corresponding to a given line. Return null
    // when the line isn't visible.
    function findViewIndex(cm, n) {
        if (n >= cm.display.viewTo) return null;
        n -= cm.display.viewFrom;
        if (n < 0) return null;
        var view = cm.display.view;
        for(var i = 0; i < view.length; i++){
            n -= view[i].size;
            if (n < 0) return i;
        }
    }
    // Updates the display.view data structure for a given change to the
    // document. From and to are in pre-change coordinates. Lendiff is
    // the amount of lines added or subtracted by the change. This is
    // used for changes that span multiple lines, or change the way
    // lines are divided into visual lines. regLineChange (below)
    // registers single-line changes.
    function regChange(cm, from, to, lendiff) {
        if (from == null) from = cm.doc.first;
        if (to == null) to = cm.doc.first + cm.doc.size;
        if (!lendiff) lendiff = 0;
        var display = cm.display;
        if (lendiff && to < display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers > from)) display.updateLineNumbers = from;
        cm.curOp.viewChanged = true;
        if (from >= display.viewTo) {
            if (sawCollapsedSpans && visualLineNo(cm.doc, from) < display.viewTo) resetView(cm);
        } else if (to <= display.viewFrom) {
            if (sawCollapsedSpans && visualLineEndNo(cm.doc, to + lendiff) > display.viewFrom) resetView(cm);
            else {
                display.viewFrom += lendiff;
                display.viewTo += lendiff;
            }
        } else if (from <= display.viewFrom && to >= display.viewTo) resetView(cm);
        else if (from <= display.viewFrom) {
            var cut = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cut) {
                display.view = display.view.slice(cut.index);
                display.viewFrom = cut.lineN;
                display.viewTo += lendiff;
            } else resetView(cm);
        } else if (to >= display.viewTo) {
            var cut$1 = viewCuttingPoint(cm, from, from, -1);
            if (cut$1) {
                display.view = display.view.slice(0, cut$1.index);
                display.viewTo = cut$1.lineN;
            } else resetView(cm);
        } else {
            var cutTop = viewCuttingPoint(cm, from, from, -1);
            var cutBot = viewCuttingPoint(cm, to, to + lendiff, 1);
            if (cutTop && cutBot) {
                display.view = display.view.slice(0, cutTop.index).concat(buildViewArray(cm, cutTop.lineN, cutBot.lineN)).concat(display.view.slice(cutBot.index));
                display.viewTo += lendiff;
            } else resetView(cm);
        }
        var ext = display.externalMeasured;
        if (ext) {
            if (to < ext.lineN) ext.lineN += lendiff;
            else if (from < ext.lineN + ext.size) display.externalMeasured = null;
        }
    }
    // Register a change to a single line. Type must be one of "text",
    // "gutter", "class", "widget"
    function regLineChange(cm, line, type) {
        cm.curOp.viewChanged = true;
        var display = cm.display, ext = cm.display.externalMeasured;
        if (ext && line >= ext.lineN && line < ext.lineN + ext.size) display.externalMeasured = null;
        if (line < display.viewFrom || line >= display.viewTo) return;
        var lineView = display.view[findViewIndex(cm, line)];
        if (lineView.node == null) return;
        var arr = lineView.changes || (lineView.changes = []);
        if (indexOf(arr, type) == -1) arr.push(type);
    }
    // Clear the view.
    function resetView(cm) {
        cm.display.viewFrom = cm.display.viewTo = cm.doc.first;
        cm.display.view = [];
        cm.display.viewOffset = 0;
    }
    function viewCuttingPoint(cm, oldN, newN, dir) {
        var index = findViewIndex(cm, oldN), diff, view = cm.display.view;
        if (!sawCollapsedSpans || newN == cm.doc.first + cm.doc.size) return {
            index: index,
            lineN: newN
        };
        var n = cm.display.viewFrom;
        for(var i = 0; i < index; i++)n += view[i].size;
        if (n != oldN) {
            if (dir > 0) {
                if (index == view.length - 1) return null;
                diff = n + view[index].size - oldN;
                index++;
            } else diff = n - oldN;
            oldN += diff;
            newN += diff;
        }
        while(visualLineNo(cm.doc, newN) != newN){
            if (index == (dir < 0 ? 0 : view.length - 1)) return null;
            newN += dir * view[index - (dir < 0 ? 1 : 0)].size;
            index += dir;
        }
        return {
            index: index,
            lineN: newN
        };
    }
    // Force the view to cover a given range, adding empty view element
    // or clipping off existing ones as needed.
    function adjustView(cm, from, to) {
        var display = cm.display, view = display.view;
        if (view.length == 0 || from >= display.viewTo || to <= display.viewFrom) {
            display.view = buildViewArray(cm, from, to);
            display.viewFrom = from;
        } else {
            if (display.viewFrom > from) display.view = buildViewArray(cm, from, display.viewFrom).concat(display.view);
            else if (display.viewFrom < from) display.view = display.view.slice(findViewIndex(cm, from));
            display.viewFrom = from;
            if (display.viewTo < to) display.view = display.view.concat(buildViewArray(cm, display.viewTo, to));
            else if (display.viewTo > to) display.view = display.view.slice(0, findViewIndex(cm, to));
        }
        display.viewTo = to;
    }
    // Count the number of lines in the view whose DOM representation is
    // out of date (or nonexistent).
    function countDirtyView(cm) {
        var view = cm.display.view, dirty = 0;
        for(var i = 0; i < view.length; i++){
            var lineView = view[i];
            if (!lineView.hidden && (!lineView.node || lineView.changes)) ++dirty;
        }
        return dirty;
    }
    function updateSelection(cm) {
        cm.display.input.showSelection(cm.display.input.prepareSelection());
    }
    function prepareSelection(cm, primary) {
        if (primary === void 0) primary = true;
        var doc = cm.doc, result = {};
        var curFragment = result.cursors = document.createDocumentFragment();
        var selFragment = result.selection = document.createDocumentFragment();
        var customCursor = cm.options.$customCursor;
        if (customCursor) primary = true;
        for(var i = 0; i < doc.sel.ranges.length; i++){
            if (!primary && i == doc.sel.primIndex) continue;
            var range = doc.sel.ranges[i];
            if (range.from().line >= cm.display.viewTo || range.to().line < cm.display.viewFrom) continue;
            var collapsed = range.empty();
            if (customCursor) {
                var head = customCursor(cm, range);
                if (head) drawSelectionCursor(cm, head, curFragment);
            } else if (collapsed || cm.options.showCursorWhenSelecting) drawSelectionCursor(cm, range.head, curFragment);
            if (!collapsed) drawSelectionRange(cm, range, selFragment);
        }
        return result;
    }
    // Draws a cursor for the given range
    function drawSelectionCursor(cm, head, output) {
        var pos = cursorCoords(cm, head, "div", null, null, !cm.options.singleCursorHeightPerLine);
        var cursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor"));
        cursor.style.left = pos.left + "px";
        cursor.style.top = pos.top + "px";
        cursor.style.height = Math.max(0, pos.bottom - pos.top) * cm.options.cursorHeight + "px";
        if (/\bcm-fat-cursor\b/.test(cm.getWrapperElement().className)) {
            var charPos = charCoords(cm, head, "div", null, null);
            var width = charPos.right - charPos.left;
            cursor.style.width = (width > 0 ? width : cm.defaultCharWidth()) + "px";
        }
        if (pos.other) {
            // Secondary cursor, shown when on a 'jump' in bi-directional text
            var otherCursor = output.appendChild(elt("div", "\u00a0", "CodeMirror-cursor CodeMirror-secondarycursor"));
            otherCursor.style.display = "";
            otherCursor.style.left = pos.other.left + "px";
            otherCursor.style.top = pos.other.top + "px";
            otherCursor.style.height = (pos.other.bottom - pos.other.top) * .85 + "px";
        }
    }
    function cmpCoords(a, b) {
        return a.top - b.top || a.left - b.left;
    }
    // Draws the given range as a highlighted selection
    function drawSelectionRange(cm, range, output) {
        var display = cm.display, doc = cm.doc;
        var fragment = document.createDocumentFragment();
        var padding = paddingH(cm.display), leftSide = padding.left;
        var rightSide = Math.max(display.sizerWidth, displayWidth(cm) - display.sizer.offsetLeft) - padding.right;
        var docLTR = doc.direction == "ltr";
        function add(left, top, width, bottom) {
            if (top < 0) top = 0;
            top = Math.round(top);
            bottom = Math.round(bottom);
            fragment.appendChild(elt("div", null, "CodeMirror-selected", "position: absolute; left: " + left + "px;\n                             top: " + top + "px; width: " + (width == null ? rightSide - left : width) + "px;\n                             height: " + (bottom - top) + "px"));
        }
        function drawForLine(line, fromArg, toArg) {
            var lineObj = getLine(doc, line);
            var lineLen = lineObj.text.length;
            var start, end;
            function coords(ch, bias) {
                return charCoords(cm, Pos(line, ch), "div", lineObj, bias);
            }
            function wrapX(pos, dir, side) {
                var extent = wrappedLineExtentChar(cm, lineObj, null, pos);
                var prop = dir == "ltr" == (side == "after") ? "left" : "right";
                var ch = side == "after" ? extent.begin : extent.end - (/\s/.test(lineObj.text.charAt(extent.end - 1)) ? 2 : 1);
                return coords(ch, prop)[prop];
            }
            var order = getOrder(lineObj, doc.direction);
            iterateBidiSections(order, fromArg || 0, toArg == null ? lineLen : toArg, function(from, to, dir, i) {
                var ltr = dir == "ltr";
                var fromPos = coords(from, ltr ? "left" : "right");
                var toPos = coords(to - 1, ltr ? "right" : "left");
                var openStart = fromArg == null && from == 0, openEnd = toArg == null && to == lineLen;
                var first = i == 0, last = !order || i == order.length - 1;
                if (toPos.top - fromPos.top <= 3) {
                    var openLeft = (docLTR ? openStart : openEnd) && first;
                    var openRight = (docLTR ? openEnd : openStart) && last;
                    var left = openLeft ? leftSide : (ltr ? fromPos : toPos).left;
                    var right = openRight ? rightSide : (ltr ? toPos : fromPos).right;
                    add(left, fromPos.top, right - left, fromPos.bottom);
                } else {
                    var topLeft, topRight, botLeft, botRight;
                    if (ltr) {
                        topLeft = docLTR && openStart && first ? leftSide : fromPos.left;
                        topRight = docLTR ? rightSide : wrapX(from, dir, "before");
                        botLeft = docLTR ? leftSide : wrapX(to, dir, "after");
                        botRight = docLTR && openEnd && last ? rightSide : toPos.right;
                    } else {
                        topLeft = !docLTR ? leftSide : wrapX(from, dir, "before");
                        topRight = !docLTR && openStart && first ? rightSide : fromPos.right;
                        botLeft = !docLTR && openEnd && last ? leftSide : toPos.left;
                        botRight = !docLTR ? rightSide : wrapX(to, dir, "after");
                    }
                    add(topLeft, fromPos.top, topRight - topLeft, fromPos.bottom);
                    if (fromPos.bottom < toPos.top) add(leftSide, fromPos.bottom, null, toPos.top);
                    add(botLeft, toPos.top, botRight - botLeft, toPos.bottom);
                }
                if (!start || cmpCoords(fromPos, start) < 0) start = fromPos;
                if (cmpCoords(toPos, start) < 0) start = toPos;
                if (!end || cmpCoords(fromPos, end) < 0) end = fromPos;
                if (cmpCoords(toPos, end) < 0) end = toPos;
            });
            return {
                start: start,
                end: end
            };
        }
        var sFrom = range.from(), sTo = range.to();
        if (sFrom.line == sTo.line) drawForLine(sFrom.line, sFrom.ch, sTo.ch);
        else {
            var fromLine = getLine(doc, sFrom.line), toLine = getLine(doc, sTo.line);
            var singleVLine = visualLine(fromLine) == visualLine(toLine);
            var leftEnd = drawForLine(sFrom.line, sFrom.ch, singleVLine ? fromLine.text.length + 1 : null).end;
            var rightStart = drawForLine(sTo.line, singleVLine ? 0 : null, sTo.ch).start;
            if (singleVLine) {
                if (leftEnd.top < rightStart.top - 2) {
                    add(leftEnd.right, leftEnd.top, null, leftEnd.bottom);
                    add(leftSide, rightStart.top, rightStart.left, rightStart.bottom);
                } else add(leftEnd.right, leftEnd.top, rightStart.left - leftEnd.right, leftEnd.bottom);
            }
            if (leftEnd.bottom < rightStart.top) add(leftSide, leftEnd.bottom, null, rightStart.top);
        }
        output.appendChild(fragment);
    }
    // Cursor-blinking
    function restartBlink(cm) {
        if (!cm.state.focused) return;
        var display = cm.display;
        clearInterval(display.blinker);
        var on = true;
        display.cursorDiv.style.visibility = "";
        if (cm.options.cursorBlinkRate > 0) display.blinker = setInterval(function() {
            if (!cm.hasFocus()) onBlur(cm);
            display.cursorDiv.style.visibility = (on = !on) ? "" : "hidden";
        }, cm.options.cursorBlinkRate);
        else if (cm.options.cursorBlinkRate < 0) display.cursorDiv.style.visibility = "hidden";
    }
    function ensureFocus(cm) {
        if (!cm.hasFocus()) {
            cm.display.input.focus();
            if (!cm.state.focused) onFocus(cm);
        }
    }
    function delayBlurEvent(cm) {
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
            if (cm.state.delayingBlurEvent) {
                cm.state.delayingBlurEvent = false;
                if (cm.state.focused) onBlur(cm);
            }
        }, 100);
    }
    function onFocus(cm, e) {
        if (cm.state.delayingBlurEvent && !cm.state.draggingText) cm.state.delayingBlurEvent = false;
        if (cm.options.readOnly == "nocursor") return;
        if (!cm.state.focused) {
            signal(cm, "focus", cm, e);
            cm.state.focused = true;
            addClass(cm.display.wrapper, "CodeMirror-focused");
            // This test prevents this from firing when a context
            // menu is closed (since the input reset would kill the
            // select-all detection hack)
            if (!cm.curOp && cm.display.selForContextMenu != cm.doc.sel) {
                cm.display.input.reset();
                if (webkit) setTimeout(function() {
                    return cm.display.input.reset(true);
                }, 20);
                 // Issue #1730
            }
            cm.display.input.receivedFocus();
        }
        restartBlink(cm);
    }
    function onBlur(cm, e) {
        if (cm.state.delayingBlurEvent) return;
        if (cm.state.focused) {
            signal(cm, "blur", cm, e);
            cm.state.focused = false;
            rmClass(cm.display.wrapper, "CodeMirror-focused");
        }
        clearInterval(cm.display.blinker);
        setTimeout(function() {
            if (!cm.state.focused) cm.display.shift = false;
        }, 150);
    }
    // Read the actual heights of the rendered lines, and update their
    // stored heights to match.
    function updateHeightsInViewport(cm) {
        var display = cm.display;
        var prevBottom = display.lineDiv.offsetTop;
        var viewTop = Math.max(0, display.scroller.getBoundingClientRect().top);
        var oldHeight = display.lineDiv.getBoundingClientRect().top;
        var mustScroll = 0;
        for(var i = 0; i < display.view.length; i++){
            var cur = display.view[i], wrapping = cm.options.lineWrapping;
            var height = void 0, width = 0;
            if (cur.hidden) continue;
            oldHeight += cur.line.height;
            if (ie && ie_version < 8) {
                var bot = cur.node.offsetTop + cur.node.offsetHeight;
                height = bot - prevBottom;
                prevBottom = bot;
            } else {
                var box = cur.node.getBoundingClientRect();
                height = box.bottom - box.top;
                // Check that lines don't extend past the right of the current
                // editor width
                if (!wrapping && cur.text.firstChild) width = cur.text.firstChild.getBoundingClientRect().right - box.left - 1;
            }
            var diff = cur.line.height - height;
            if (diff > .005 || diff < -0.005) {
                if (oldHeight < viewTop) mustScroll -= diff;
                updateLineHeight(cur.line, height);
                updateWidgetHeight(cur.line);
                if (cur.rest) for(var j = 0; j < cur.rest.length; j++)updateWidgetHeight(cur.rest[j]);
            }
            if (width > cm.display.sizerWidth) {
                var chWidth = Math.ceil(width / charWidth(cm.display));
                if (chWidth > cm.display.maxLineLength) {
                    cm.display.maxLineLength = chWidth;
                    cm.display.maxLine = cur.line;
                    cm.display.maxLineChanged = true;
                }
            }
        }
        if (Math.abs(mustScroll) > 2) display.scroller.scrollTop += mustScroll;
    }
    // Read and store the height of line widgets associated with the
    // given line.
    function updateWidgetHeight(line) {
        if (line.widgets) for(var i = 0; i < line.widgets.length; ++i){
            var w = line.widgets[i], parent = w.node.parentNode;
            if (parent) w.height = parent.offsetHeight;
        }
    }
    // Compute the lines that are visible in a given viewport (defaults
    // the current scroll position). viewport may contain top,
    // height, and ensure (see op.scrollToPos) properties.
    function visibleLines(display, doc, viewport) {
        var top = viewport && viewport.top != null ? Math.max(0, viewport.top) : display.scroller.scrollTop;
        top = Math.floor(top - paddingTop(display));
        var bottom = viewport && viewport.bottom != null ? viewport.bottom : top + display.wrapper.clientHeight;
        var from = lineAtHeight(doc, top), to = lineAtHeight(doc, bottom);
        // Ensure is a {from: {line, ch}, to: {line, ch}} object, and
        // forces those lines into the viewport (if possible).
        if (viewport && viewport.ensure) {
            var ensureFrom = viewport.ensure.from.line, ensureTo = viewport.ensure.to.line;
            if (ensureFrom < from) {
                from = ensureFrom;
                to = lineAtHeight(doc, heightAtLine(getLine(doc, ensureFrom)) + display.wrapper.clientHeight);
            } else if (Math.min(ensureTo, doc.lastLine()) >= to) {
                from = lineAtHeight(doc, heightAtLine(getLine(doc, ensureTo)) - display.wrapper.clientHeight);
                to = ensureTo;
            }
        }
        return {
            from: from,
            to: Math.max(to, from + 1)
        };
    }
    // SCROLLING THINGS INTO VIEW
    // If an editor sits on the top or bottom of the window, partially
    // scrolled out of view, this ensures that the cursor is visible.
    function maybeScrollWindow(cm, rect) {
        if (signalDOMEvent(cm, "scrollCursorIntoView")) return;
        var display = cm.display, box = display.sizer.getBoundingClientRect(), doScroll = null;
        var doc = display.wrapper.ownerDocument;
        if (rect.top + box.top < 0) doScroll = true;
        else if (rect.bottom + box.top > (doc.defaultView.innerHeight || doc.documentElement.clientHeight)) doScroll = false;
        if (doScroll != null && !phantom) {
            var scrollNode = elt("div", "\u200b", null, "position: absolute;\n                         top: " + (rect.top - display.viewOffset - paddingTop(cm.display)) + "px;\n                         height: " + (rect.bottom - rect.top + scrollGap(cm) + display.barHeight) + "px;\n                         left: " + rect.left + "px; width: " + Math.max(2, rect.right - rect.left) + "px;");
            cm.display.lineSpace.appendChild(scrollNode);
            scrollNode.scrollIntoView(doScroll);
            cm.display.lineSpace.removeChild(scrollNode);
        }
    }
    // Scroll a given position into view (immediately), verifying that
    // it actually became visible (as line heights are accurately
    // measured, the position of something may 'drift' during drawing).
    function scrollPosIntoView(cm, pos, end, margin) {
        if (margin == null) margin = 0;
        var rect;
        if (!cm.options.lineWrapping && pos == end) {
            // Set pos and end to the cursor positions around the character pos sticks to
            // If pos.sticky == "before", that is around pos.ch - 1, otherwise around pos.ch
            // If pos == Pos(_, 0, "before"), pos and end are unchanged
            end = pos.sticky == "before" ? Pos(pos.line, pos.ch + 1, "before") : pos;
            pos = pos.ch ? Pos(pos.line, pos.sticky == "before" ? pos.ch - 1 : pos.ch, "after") : pos;
        }
        for(var limit = 0; limit < 5; limit++){
            var changed = false;
            var coords = cursorCoords(cm, pos);
            var endCoords = !end || end == pos ? coords : cursorCoords(cm, end);
            rect = {
                left: Math.min(coords.left, endCoords.left),
                top: Math.min(coords.top, endCoords.top) - margin,
                right: Math.max(coords.left, endCoords.left),
                bottom: Math.max(coords.bottom, endCoords.bottom) + margin
            };
            var scrollPos = calculateScrollPos(cm, rect);
            var startTop = cm.doc.scrollTop, startLeft = cm.doc.scrollLeft;
            if (scrollPos.scrollTop != null) {
                updateScrollTop(cm, scrollPos.scrollTop);
                if (Math.abs(cm.doc.scrollTop - startTop) > 1) changed = true;
            }
            if (scrollPos.scrollLeft != null) {
                setScrollLeft(cm, scrollPos.scrollLeft);
                if (Math.abs(cm.doc.scrollLeft - startLeft) > 1) changed = true;
            }
            if (!changed) break;
        }
        return rect;
    }
    // Scroll a given set of coordinates into view (immediately).
    function scrollIntoView(cm, rect) {
        var scrollPos = calculateScrollPos(cm, rect);
        if (scrollPos.scrollTop != null) updateScrollTop(cm, scrollPos.scrollTop);
        if (scrollPos.scrollLeft != null) setScrollLeft(cm, scrollPos.scrollLeft);
    }
    // Calculate a new scroll position needed to scroll the given
    // rectangle into view. Returns an object with scrollTop and
    // scrollLeft properties. When these are undefined, the
    // vertical/horizontal position does not need to be adjusted.
    function calculateScrollPos(cm, rect) {
        var display = cm.display, snapMargin = textHeight(cm.display);
        if (rect.top < 0) rect.top = 0;
        var screentop = cm.curOp && cm.curOp.scrollTop != null ? cm.curOp.scrollTop : display.scroller.scrollTop;
        var screen1 = displayHeight(cm), result = {};
        if (rect.bottom - rect.top > screen1) rect.bottom = rect.top + screen1;
        var docBottom = cm.doc.height + paddingVert(display);
        var atTop = rect.top < snapMargin, atBottom = rect.bottom > docBottom - snapMargin;
        if (rect.top < screentop) result.scrollTop = atTop ? 0 : rect.top;
        else if (rect.bottom > screentop + screen1) {
            var newTop = Math.min(rect.top, (atBottom ? docBottom : rect.bottom) - screen1);
            if (newTop != screentop) result.scrollTop = newTop;
        }
        var gutterSpace = cm.options.fixedGutter ? 0 : display.gutters.offsetWidth;
        var screenleft = cm.curOp && cm.curOp.scrollLeft != null ? cm.curOp.scrollLeft : display.scroller.scrollLeft - gutterSpace;
        var screenw = displayWidth(cm) - display.gutters.offsetWidth;
        var tooWide = rect.right - rect.left > screenw;
        if (tooWide) rect.right = rect.left + screenw;
        if (rect.left < 10) result.scrollLeft = 0;
        else if (rect.left < screenleft) result.scrollLeft = Math.max(0, rect.left + gutterSpace - (tooWide ? 0 : 10));
        else if (rect.right > screenw + screenleft - 3) result.scrollLeft = rect.right + (tooWide ? 0 : 10) - screenw;
        return result;
    }
    // Store a relative adjustment to the scroll position in the current
    // operation (to be applied when the operation finishes).
    function addToScrollTop(cm, top) {
        if (top == null) return;
        resolveScrollToPos(cm);
        cm.curOp.scrollTop = (cm.curOp.scrollTop == null ? cm.doc.scrollTop : cm.curOp.scrollTop) + top;
    }
    // Make sure that at the end of the operation the current cursor is
    // shown.
    function ensureCursorVisible(cm) {
        resolveScrollToPos(cm);
        var cur = cm.getCursor();
        cm.curOp.scrollToPos = {
            from: cur,
            to: cur,
            margin: cm.options.cursorScrollMargin
        };
    }
    function scrollToCoords(cm, x, y) {
        if (x != null || y != null) resolveScrollToPos(cm);
        if (x != null) cm.curOp.scrollLeft = x;
        if (y != null) cm.curOp.scrollTop = y;
    }
    function scrollToRange(cm, range) {
        resolveScrollToPos(cm);
        cm.curOp.scrollToPos = range;
    }
    // When an operation has its scrollToPos property set, and another
    // scroll action is applied before the end of the operation, this
    // 'simulates' scrolling that position into view in a cheap way, so
    // that the effect of intermediate scroll commands is not ignored.
    function resolveScrollToPos(cm) {
        var range = cm.curOp.scrollToPos;
        if (range) {
            cm.curOp.scrollToPos = null;
            var from = estimateCoords(cm, range.from), to = estimateCoords(cm, range.to);
            scrollToCoordsRange(cm, from, to, range.margin);
        }
    }
    function scrollToCoordsRange(cm, from, to, margin) {
        var sPos = calculateScrollPos(cm, {
            left: Math.min(from.left, to.left),
            top: Math.min(from.top, to.top) - margin,
            right: Math.max(from.right, to.right),
            bottom: Math.max(from.bottom, to.bottom) + margin
        });
        scrollToCoords(cm, sPos.scrollLeft, sPos.scrollTop);
    }
    // Sync the scrollable area and scrollbars, ensure the viewport
    // covers the visible area.
    function updateScrollTop(cm, val) {
        if (Math.abs(cm.doc.scrollTop - val) < 2) return;
        if (!gecko) updateDisplaySimple(cm, {
            top: val
        });
        setScrollTop(cm, val, true);
        if (gecko) updateDisplaySimple(cm);
        startWorker(cm, 100);
    }
    function setScrollTop(cm, val, forceScroll) {
        val = Math.max(0, Math.min(cm.display.scroller.scrollHeight - cm.display.scroller.clientHeight, val));
        if (cm.display.scroller.scrollTop == val && !forceScroll) return;
        cm.doc.scrollTop = val;
        cm.display.scrollbars.setScrollTop(val);
        if (cm.display.scroller.scrollTop != val) cm.display.scroller.scrollTop = val;
    }
    // Sync scroller and scrollbar, ensure the gutter elements are
    // aligned.
    function setScrollLeft(cm, val, isScroller, forceScroll) {
        val = Math.max(0, Math.min(val, cm.display.scroller.scrollWidth - cm.display.scroller.clientWidth));
        if ((isScroller ? val == cm.doc.scrollLeft : Math.abs(cm.doc.scrollLeft - val) < 2) && !forceScroll) return;
        cm.doc.scrollLeft = val;
        alignHorizontally(cm);
        if (cm.display.scroller.scrollLeft != val) cm.display.scroller.scrollLeft = val;
        cm.display.scrollbars.setScrollLeft(val);
    }
    // SCROLLBARS
    // Prepare DOM reads needed to update the scrollbars. Done in one
    // shot to minimize update/measure roundtrips.
    function measureForScrollbars(cm) {
        var d = cm.display, gutterW = d.gutters.offsetWidth;
        var docH = Math.round(cm.doc.height + paddingVert(cm.display));
        return {
            clientHeight: d.scroller.clientHeight,
            viewHeight: d.wrapper.clientHeight,
            scrollWidth: d.scroller.scrollWidth,
            clientWidth: d.scroller.clientWidth,
            viewWidth: d.wrapper.clientWidth,
            barLeft: cm.options.fixedGutter ? gutterW : 0,
            docHeight: docH,
            scrollHeight: docH + scrollGap(cm) + d.barHeight,
            nativeBarWidth: d.nativeBarWidth,
            gutterWidth: gutterW
        };
    }
    var NativeScrollbars = function(place, scroll, cm) {
        this.cm = cm;
        var vert = this.vert = elt("div", [
            elt("div", null, null, "min-width: 1px")
        ], "CodeMirror-vscrollbar");
        var horiz = this.horiz = elt("div", [
            elt("div", null, null, "height: 100%; min-height: 1px")
        ], "CodeMirror-hscrollbar");
        vert.tabIndex = horiz.tabIndex = -1;
        place(vert);
        place(horiz);
        on(vert, "scroll", function() {
            if (vert.clientHeight) scroll(vert.scrollTop, "vertical");
        });
        on(horiz, "scroll", function() {
            if (horiz.clientWidth) scroll(horiz.scrollLeft, "horizontal");
        });
        this.checkedZeroWidth = false;
        // Need to set a minimum width to see the scrollbar on IE7 (but must not set it on IE8).
        if (ie && ie_version < 8) this.horiz.style.minHeight = this.vert.style.minWidth = "18px";
    };
    NativeScrollbars.prototype.update = function(measure) {
        var needsH = measure.scrollWidth > measure.clientWidth + 1;
        var needsV = measure.scrollHeight > measure.clientHeight + 1;
        var sWidth = measure.nativeBarWidth;
        if (needsV) {
            this.vert.style.display = "block";
            this.vert.style.bottom = needsH ? sWidth + "px" : "0";
            var totalHeight = measure.viewHeight - (needsH ? sWidth : 0);
            // A bug in IE8 can cause this value to be negative, so guard it.
            this.vert.firstChild.style.height = Math.max(0, measure.scrollHeight - measure.clientHeight + totalHeight) + "px";
        } else {
            this.vert.scrollTop = 0;
            this.vert.style.display = "";
            this.vert.firstChild.style.height = "0";
        }
        if (needsH) {
            this.horiz.style.display = "block";
            this.horiz.style.right = needsV ? sWidth + "px" : "0";
            this.horiz.style.left = measure.barLeft + "px";
            var totalWidth = measure.viewWidth - measure.barLeft - (needsV ? sWidth : 0);
            this.horiz.firstChild.style.width = Math.max(0, measure.scrollWidth - measure.clientWidth + totalWidth) + "px";
        } else {
            this.horiz.style.display = "";
            this.horiz.firstChild.style.width = "0";
        }
        if (!this.checkedZeroWidth && measure.clientHeight > 0) {
            if (sWidth == 0) this.zeroWidthHack();
            this.checkedZeroWidth = true;
        }
        return {
            right: needsV ? sWidth : 0,
            bottom: needsH ? sWidth : 0
        };
    };
    NativeScrollbars.prototype.setScrollLeft = function(pos) {
        if (this.horiz.scrollLeft != pos) this.horiz.scrollLeft = pos;
        if (this.disableHoriz) this.enableZeroWidthBar(this.horiz, this.disableHoriz, "horiz");
    };
    NativeScrollbars.prototype.setScrollTop = function(pos) {
        if (this.vert.scrollTop != pos) this.vert.scrollTop = pos;
        if (this.disableVert) this.enableZeroWidthBar(this.vert, this.disableVert, "vert");
    };
    NativeScrollbars.prototype.zeroWidthHack = function() {
        var w = mac && !mac_geMountainLion ? "12px" : "18px";
        this.horiz.style.height = this.vert.style.width = w;
        this.horiz.style.visibility = this.vert.style.visibility = "hidden";
        this.disableHoriz = new Delayed;
        this.disableVert = new Delayed;
    };
    NativeScrollbars.prototype.enableZeroWidthBar = function(bar, delay, type) {
        bar.style.visibility = "";
        function maybeDisable() {
            // To find out whether the scrollbar is still visible, we
            // check whether the element under the pixel in the bottom
            // right corner of the scrollbar box is the scrollbar box
            // itself (when the bar is still visible) or its filler child
            // (when the bar is hidden). If it is still visible, we keep
            // it enabled, if it's hidden, we disable pointer events.
            var box = bar.getBoundingClientRect();
            var elt = type == "vert" ? document.elementFromPoint(box.right - 1, (box.top + box.bottom) / 2) : document.elementFromPoint((box.right + box.left) / 2, box.bottom - 1);
            if (elt != bar) bar.style.visibility = "hidden";
            else delay.set(1000, maybeDisable);
        }
        delay.set(1000, maybeDisable);
    };
    NativeScrollbars.prototype.clear = function() {
        var parent = this.horiz.parentNode;
        parent.removeChild(this.horiz);
        parent.removeChild(this.vert);
    };
    var NullScrollbars = function() {};
    NullScrollbars.prototype.update = function() {
        return {
            bottom: 0,
            right: 0
        };
    };
    NullScrollbars.prototype.setScrollLeft = function() {};
    NullScrollbars.prototype.setScrollTop = function() {};
    NullScrollbars.prototype.clear = function() {};
    function updateScrollbars(cm, measure) {
        if (!measure) measure = measureForScrollbars(cm);
        var startWidth = cm.display.barWidth, startHeight = cm.display.barHeight;
        updateScrollbarsInner(cm, measure);
        for(var i = 0; i < 4 && startWidth != cm.display.barWidth || startHeight != cm.display.barHeight; i++){
            if (startWidth != cm.display.barWidth && cm.options.lineWrapping) updateHeightsInViewport(cm);
            updateScrollbarsInner(cm, measureForScrollbars(cm));
            startWidth = cm.display.barWidth;
            startHeight = cm.display.barHeight;
        }
    }
    // Re-synchronize the fake scrollbars with the actual size of the
    // content.
    function updateScrollbarsInner(cm, measure) {
        var d = cm.display;
        var sizes = d.scrollbars.update(measure);
        d.sizer.style.paddingRight = (d.barWidth = sizes.right) + "px";
        d.sizer.style.paddingBottom = (d.barHeight = sizes.bottom) + "px";
        d.heightForcer.style.borderBottom = sizes.bottom + "px solid transparent";
        if (sizes.right && sizes.bottom) {
            d.scrollbarFiller.style.display = "block";
            d.scrollbarFiller.style.height = sizes.bottom + "px";
            d.scrollbarFiller.style.width = sizes.right + "px";
        } else d.scrollbarFiller.style.display = "";
        if (sizes.bottom && cm.options.coverGutterNextToScrollbar && cm.options.fixedGutter) {
            d.gutterFiller.style.display = "block";
            d.gutterFiller.style.height = sizes.bottom + "px";
            d.gutterFiller.style.width = measure.gutterWidth + "px";
        } else d.gutterFiller.style.display = "";
    }
    var scrollbarModel = {
        "native": NativeScrollbars,
        "null": NullScrollbars
    };
    function initScrollbars(cm) {
        if (cm.display.scrollbars) {
            cm.display.scrollbars.clear();
            if (cm.display.scrollbars.addClass) rmClass(cm.display.wrapper, cm.display.scrollbars.addClass);
        }
        cm.display.scrollbars = new scrollbarModel[cm.options.scrollbarStyle](function(node) {
            cm.display.wrapper.insertBefore(node, cm.display.scrollbarFiller);
            // Prevent clicks in the scrollbars from killing focus
            on(node, "mousedown", function() {
                if (cm.state.focused) setTimeout(function() {
                    return cm.display.input.focus();
                }, 0);
            });
            node.setAttribute("cm-not-content", "true");
        }, function(pos, axis) {
            if (axis == "horizontal") setScrollLeft(cm, pos);
            else updateScrollTop(cm, pos);
        }, cm);
        if (cm.display.scrollbars.addClass) addClass(cm.display.wrapper, cm.display.scrollbars.addClass);
    }
    // Operations are used to wrap a series of changes to the editor
    // state in such a way that each change won't have to update the
    // cursor and display (which would be awkward, slow, and
    // error-prone). Instead, display updates are batched and then all
    // combined and executed at once.
    var nextOpId = 0;
    // Start a new operation.
    function startOperation(cm) {
        cm.curOp = {
            cm: cm,
            viewChanged: false,
            startHeight: cm.doc.height,
            forceUpdate: false,
            updateInput: 0,
            typing: false,
            changeObjs: null,
            cursorActivityHandlers: null,
            cursorActivityCalled: 0,
            selectionChanged: false,
            updateMaxLine: false,
            scrollLeft: null,
            scrollTop: null,
            scrollToPos: null,
            focus: false,
            id: ++nextOpId,
            markArrays: null // Used by addMarkedSpan
        };
        pushOperation(cm.curOp);
    }
    // Finish an operation, updating the display and signalling delayed events
    function endOperation(cm) {
        var op = cm.curOp;
        if (op) finishOperation(op, function(group) {
            for(var i = 0; i < group.ops.length; i++)group.ops[i].cm.curOp = null;
            endOperations(group);
        });
    }
    // The DOM updates done when an operation finishes are batched so
    // that the minimum number of relayouts are required.
    function endOperations(group) {
        var ops = group.ops;
        for(var i = 0; i < ops.length; i++)endOperation_R1(ops[i]);
        for(var i$1 = 0; i$1 < ops.length; i$1++)endOperation_W1(ops[i$1]);
        for(var i$2 = 0; i$2 < ops.length; i$2++)endOperation_R2(ops[i$2]);
        for(var i$3 = 0; i$3 < ops.length; i$3++)endOperation_W2(ops[i$3]);
        for(var i$4 = 0; i$4 < ops.length; i$4++)endOperation_finish(ops[i$4]);
    }
    function endOperation_R1(op) {
        var cm = op.cm, display = cm.display;
        maybeClipScrollbars(cm);
        if (op.updateMaxLine) findMaxLine(cm);
        op.mustUpdate = op.viewChanged || op.forceUpdate || op.scrollTop != null || op.scrollToPos && (op.scrollToPos.from.line < display.viewFrom || op.scrollToPos.to.line >= display.viewTo) || display.maxLineChanged && cm.options.lineWrapping;
        op.update = op.mustUpdate && new DisplayUpdate(cm, op.mustUpdate && {
            top: op.scrollTop,
            ensure: op.scrollToPos
        }, op.forceUpdate);
    }
    function endOperation_W1(op) {
        op.updatedDisplay = op.mustUpdate && updateDisplayIfNeeded(op.cm, op.update);
    }
    function endOperation_R2(op) {
        var cm = op.cm, display = cm.display;
        if (op.updatedDisplay) updateHeightsInViewport(cm);
        op.barMeasure = measureForScrollbars(cm);
        // If the max line changed since it was last measured, measure it,
        // and ensure the document's width matches it.
        // updateDisplay_W2 will use these properties to do the actual resizing
        if (display.maxLineChanged && !cm.options.lineWrapping) {
            op.adjustWidthTo = measureChar(cm, display.maxLine, display.maxLine.text.length).left + 3;
            cm.display.sizerWidth = op.adjustWidthTo;
            op.barMeasure.scrollWidth = Math.max(display.scroller.clientWidth, display.sizer.offsetLeft + op.adjustWidthTo + scrollGap(cm) + cm.display.barWidth);
            op.maxScrollLeft = Math.max(0, display.sizer.offsetLeft + op.adjustWidthTo - displayWidth(cm));
        }
        if (op.updatedDisplay || op.selectionChanged) op.preparedSelection = display.input.prepareSelection();
    }
    function endOperation_W2(op) {
        var cm = op.cm;
        if (op.adjustWidthTo != null) {
            cm.display.sizer.style.minWidth = op.adjustWidthTo + "px";
            if (op.maxScrollLeft < cm.doc.scrollLeft) setScrollLeft(cm, Math.min(cm.display.scroller.scrollLeft, op.maxScrollLeft), true);
            cm.display.maxLineChanged = false;
        }
        var takeFocus = op.focus && op.focus == activeElt(root(cm));
        if (op.preparedSelection) cm.display.input.showSelection(op.preparedSelection, takeFocus);
        if (op.updatedDisplay || op.startHeight != cm.doc.height) updateScrollbars(cm, op.barMeasure);
        if (op.updatedDisplay) setDocumentHeight(cm, op.barMeasure);
        if (op.selectionChanged) restartBlink(cm);
        if (cm.state.focused && op.updateInput) cm.display.input.reset(op.typing);
        if (takeFocus) ensureFocus(op.cm);
    }
    function endOperation_finish(op) {
        var cm = op.cm, display = cm.display, doc = cm.doc;
        if (op.updatedDisplay) postUpdateDisplay(cm, op.update);
        // Abort mouse wheel delta measurement, when scrolling explicitly
        if (display.wheelStartX != null && (op.scrollTop != null || op.scrollLeft != null || op.scrollToPos)) display.wheelStartX = display.wheelStartY = null;
        // Propagate the scroll position to the actual DOM scroller
        if (op.scrollTop != null) setScrollTop(cm, op.scrollTop, op.forceScroll);
        if (op.scrollLeft != null) setScrollLeft(cm, op.scrollLeft, true, true);
        // If we need to scroll a specific position into view, do so.
        if (op.scrollToPos) {
            var rect = scrollPosIntoView(cm, clipPos(doc, op.scrollToPos.from), clipPos(doc, op.scrollToPos.to), op.scrollToPos.margin);
            maybeScrollWindow(cm, rect);
        }
        // Fire events for markers that are hidden/unidden by editing or
        // undoing
        var hidden = op.maybeHiddenMarkers, unhidden = op.maybeUnhiddenMarkers;
        if (hidden) {
            for(var i = 0; i < hidden.length; ++i)if (!hidden[i].lines.length) signal(hidden[i], "hide");
        }
        if (unhidden) {
            for(var i$1 = 0; i$1 < unhidden.length; ++i$1)if (unhidden[i$1].lines.length) signal(unhidden[i$1], "unhide");
        }
        if (display.wrapper.offsetHeight) doc.scrollTop = cm.display.scroller.scrollTop;
        // Fire change events, and delayed event handlers
        if (op.changeObjs) signal(cm, "changes", cm, op.changeObjs);
        if (op.update) op.update.finish();
    }
    // Run the given function in an operation
    function runInOp(cm, f) {
        if (cm.curOp) return f();
        startOperation(cm);
        try {
            return f();
        } finally{
            endOperation(cm);
        }
    }
    // Wraps a function in an operation. Returns the wrapped function.
    function operation(cm, f) {
        return function() {
            if (cm.curOp) return f.apply(cm, arguments);
            startOperation(cm);
            try {
                return f.apply(cm, arguments);
            } finally{
                endOperation(cm);
            }
        };
    }
    // Used to add methods to editor and doc instances, wrapping them in
    // operations.
    function methodOp(f) {
        return function() {
            if (this.curOp) return f.apply(this, arguments);
            startOperation(this);
            try {
                return f.apply(this, arguments);
            } finally{
                endOperation(this);
            }
        };
    }
    function docMethodOp(f) {
        return function() {
            var cm = this.cm;
            if (!cm || cm.curOp) return f.apply(this, arguments);
            startOperation(cm);
            try {
                return f.apply(this, arguments);
            } finally{
                endOperation(cm);
            }
        };
    }
    // HIGHLIGHT WORKER
    function startWorker(cm, time) {
        if (cm.doc.highlightFrontier < cm.display.viewTo) cm.state.highlight.set(time, bind(highlightWorker, cm));
    }
    function highlightWorker(cm) {
        var doc = cm.doc;
        if (doc.highlightFrontier >= cm.display.viewTo) return;
        var end = +new Date + cm.options.workTime;
        var context = getContextBefore(cm, doc.highlightFrontier);
        var changedLines = [];
        doc.iter(context.line, Math.min(doc.first + doc.size, cm.display.viewTo + 500), function(line) {
            if (context.line >= cm.display.viewFrom) {
                var oldStyles = line.styles;
                var resetState = line.text.length > cm.options.maxHighlightLength ? copyState(doc.mode, context.state) : null;
                var highlighted = highlightLine(cm, line, context, true);
                if (resetState) context.state = resetState;
                line.styles = highlighted.styles;
                var oldCls = line.styleClasses, newCls = highlighted.classes;
                if (newCls) line.styleClasses = newCls;
                else if (oldCls) line.styleClasses = null;
                var ischange = !oldStyles || oldStyles.length != line.styles.length || oldCls != newCls && (!oldCls || !newCls || oldCls.bgClass != newCls.bgClass || oldCls.textClass != newCls.textClass);
                for(var i = 0; !ischange && i < oldStyles.length; ++i)ischange = oldStyles[i] != line.styles[i];
                if (ischange) changedLines.push(context.line);
                line.stateAfter = context.save();
                context.nextLine();
            } else {
                if (line.text.length <= cm.options.maxHighlightLength) processLine(cm, line.text, context);
                line.stateAfter = context.line % 5 == 0 ? context.save() : null;
                context.nextLine();
            }
            if (+new Date > end) {
                startWorker(cm, cm.options.workDelay);
                return true;
            }
        });
        doc.highlightFrontier = context.line;
        doc.modeFrontier = Math.max(doc.modeFrontier, context.line);
        if (changedLines.length) runInOp(cm, function() {
            for(var i = 0; i < changedLines.length; i++)regLineChange(cm, changedLines[i], "text");
        });
    }
    // DISPLAY DRAWING
    var DisplayUpdate = function(cm, viewport, force) {
        var display = cm.display;
        this.viewport = viewport;
        // Store some values that we'll need later (but don't want to force a relayout for)
        this.visible = visibleLines(display, cm.doc, viewport);
        this.editorIsHidden = !display.wrapper.offsetWidth;
        this.wrapperHeight = display.wrapper.clientHeight;
        this.wrapperWidth = display.wrapper.clientWidth;
        this.oldDisplayWidth = displayWidth(cm);
        this.force = force;
        this.dims = getDimensions(cm);
        this.events = [];
    };
    DisplayUpdate.prototype.signal = function(emitter, type) {
        if (hasHandler(emitter, type)) this.events.push(arguments);
    };
    DisplayUpdate.prototype.finish = function() {
        for(var i = 0; i < this.events.length; i++)signal.apply(null, this.events[i]);
    };
    function maybeClipScrollbars(cm) {
        var display = cm.display;
        if (!display.scrollbarsClipped && display.scroller.offsetWidth) {
            display.nativeBarWidth = display.scroller.offsetWidth - display.scroller.clientWidth;
            display.heightForcer.style.height = scrollGap(cm) + "px";
            display.sizer.style.marginBottom = -display.nativeBarWidth + "px";
            display.sizer.style.borderRightWidth = scrollGap(cm) + "px";
            display.scrollbarsClipped = true;
        }
    }
    function selectionSnapshot(cm) {
        if (cm.hasFocus()) return null;
        var active = activeElt(root(cm));
        if (!active || !contains(cm.display.lineDiv, active)) return null;
        var result = {
            activeElt: active
        };
        if (window.getSelection) {
            var sel = win(cm).getSelection();
            if (sel.anchorNode && sel.extend && contains(cm.display.lineDiv, sel.anchorNode)) {
                result.anchorNode = sel.anchorNode;
                result.anchorOffset = sel.anchorOffset;
                result.focusNode = sel.focusNode;
                result.focusOffset = sel.focusOffset;
            }
        }
        return result;
    }
    function restoreSelection(snapshot) {
        if (!snapshot || !snapshot.activeElt || snapshot.activeElt == activeElt(rootNode(snapshot.activeElt))) return;
        snapshot.activeElt.focus();
        if (!/^(INPUT|TEXTAREA)$/.test(snapshot.activeElt.nodeName) && snapshot.anchorNode && contains(document.body, snapshot.anchorNode) && contains(document.body, snapshot.focusNode)) {
            var doc = snapshot.activeElt.ownerDocument;
            var sel = doc.defaultView.getSelection(), range = doc.createRange();
            range.setEnd(snapshot.anchorNode, snapshot.anchorOffset);
            range.collapse(false);
            sel.removeAllRanges();
            sel.addRange(range);
            sel.extend(snapshot.focusNode, snapshot.focusOffset);
        }
    }
    // Does the actual updating of the line display. Bails out
    // (returning false) when there is nothing to be done and forced is
    // false.
    function updateDisplayIfNeeded(cm, update) {
        var display = cm.display, doc = cm.doc;
        if (update.editorIsHidden) {
            resetView(cm);
            return false;
        }
        // Bail out if the visible area is already rendered and nothing changed.
        if (!update.force && update.visible.from >= display.viewFrom && update.visible.to <= display.viewTo && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo) && display.renderedView == display.view && countDirtyView(cm) == 0) return false;
        if (maybeUpdateLineNumberWidth(cm)) {
            resetView(cm);
            update.dims = getDimensions(cm);
        }
        // Compute a suitable new viewport (from & to)
        var end = doc.first + doc.size;
        var from = Math.max(update.visible.from - cm.options.viewportMargin, doc.first);
        var to = Math.min(end, update.visible.to + cm.options.viewportMargin);
        if (display.viewFrom < from && from - display.viewFrom < 20) from = Math.max(doc.first, display.viewFrom);
        if (display.viewTo > to && display.viewTo - to < 20) to = Math.min(end, display.viewTo);
        if (sawCollapsedSpans) {
            from = visualLineNo(cm.doc, from);
            to = visualLineEndNo(cm.doc, to);
        }
        var different = from != display.viewFrom || to != display.viewTo || display.lastWrapHeight != update.wrapperHeight || display.lastWrapWidth != update.wrapperWidth;
        adjustView(cm, from, to);
        display.viewOffset = heightAtLine(getLine(cm.doc, display.viewFrom));
        // Position the mover div to align with the current scroll position
        cm.display.mover.style.top = display.viewOffset + "px";
        var toUpdate = countDirtyView(cm);
        if (!different && toUpdate == 0 && !update.force && display.renderedView == display.view && (display.updateLineNumbers == null || display.updateLineNumbers >= display.viewTo)) return false;
        // For big changes, we hide the enclosing element during the
        // update, since that speeds up the operations on most browsers.
        var selSnapshot = selectionSnapshot(cm);
        if (toUpdate > 4) display.lineDiv.style.display = "none";
        patchDisplay(cm, display.updateLineNumbers, update.dims);
        if (toUpdate > 4) display.lineDiv.style.display = "";
        display.renderedView = display.view;
        // There might have been a widget with a focused element that got
        // hidden or updated, if so re-focus it.
        restoreSelection(selSnapshot);
        // Prevent selection and cursors from interfering with the scroll
        // width and height.
        removeChildren(display.cursorDiv);
        removeChildren(display.selectionDiv);
        display.gutters.style.height = display.sizer.style.minHeight = 0;
        if (different) {
            display.lastWrapHeight = update.wrapperHeight;
            display.lastWrapWidth = update.wrapperWidth;
            startWorker(cm, 400);
        }
        display.updateLineNumbers = null;
        return true;
    }
    function postUpdateDisplay(cm, update) {
        var viewport = update.viewport;
        for(var first = true;; first = false){
            if (!first || !cm.options.lineWrapping || update.oldDisplayWidth == displayWidth(cm)) {
                // Clip forced viewport to actual scrollable area.
                if (viewport && viewport.top != null) viewport = {
                    top: Math.min(cm.doc.height + paddingVert(cm.display) - displayHeight(cm), viewport.top)
                };
                // Updated line heights might result in the drawn area not
                // actually covering the viewport. Keep looping until it does.
                update.visible = visibleLines(cm.display, cm.doc, viewport);
                if (update.visible.from >= cm.display.viewFrom && update.visible.to <= cm.display.viewTo) break;
            } else if (first) update.visible = visibleLines(cm.display, cm.doc, viewport);
            if (!updateDisplayIfNeeded(cm, update)) break;
            updateHeightsInViewport(cm);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm);
            updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.force = false;
        }
        update.signal(cm, "update", cm);
        if (cm.display.viewFrom != cm.display.reportedViewFrom || cm.display.viewTo != cm.display.reportedViewTo) {
            update.signal(cm, "viewportChange", cm, cm.display.viewFrom, cm.display.viewTo);
            cm.display.reportedViewFrom = cm.display.viewFrom;
            cm.display.reportedViewTo = cm.display.viewTo;
        }
    }
    function updateDisplaySimple(cm, viewport) {
        var update = new DisplayUpdate(cm, viewport);
        if (updateDisplayIfNeeded(cm, update)) {
            updateHeightsInViewport(cm);
            postUpdateDisplay(cm, update);
            var barMeasure = measureForScrollbars(cm);
            updateSelection(cm);
            updateScrollbars(cm, barMeasure);
            setDocumentHeight(cm, barMeasure);
            update.finish();
        }
    }
    // Sync the actual display DOM structure with display.view, removing
    // nodes for lines that are no longer in view, and creating the ones
    // that are not there yet, and updating the ones that are out of
    // date.
    function patchDisplay(cm, updateNumbersFrom, dims) {
        var display = cm.display, lineNumbers = cm.options.lineNumbers;
        var container = display.lineDiv, cur = container.firstChild;
        function rm(node) {
            var next = node.nextSibling;
            // Works around a throw-scroll bug in OS X Webkit
            if (webkit && mac && cm.display.currentWheelTarget == node) node.style.display = "none";
            else node.parentNode.removeChild(node);
            return next;
        }
        var view = display.view, lineN = display.viewFrom;
        // Loop over the elements in the view, syncing cur (the DOM nodes
        // in display.lineDiv) with the view as we go.
        for(var i = 0; i < view.length; i++){
            var lineView = view[i];
            if (lineView.hidden) ;
            else if (!lineView.node || lineView.node.parentNode != container) {
                var node = buildLineElement(cm, lineView, lineN, dims);
                container.insertBefore(node, cur);
            } else {
                while(cur != lineView.node)cur = rm(cur);
                var updateNumber = lineNumbers && updateNumbersFrom != null && updateNumbersFrom <= lineN && lineView.lineNumber;
                if (lineView.changes) {
                    if (indexOf(lineView.changes, "gutter") > -1) updateNumber = false;
                    updateLineForChanges(cm, lineView, lineN, dims);
                }
                if (updateNumber) {
                    removeChildren(lineView.lineNumber);
                    lineView.lineNumber.appendChild(document.createTextNode(lineNumberFor(cm.options, lineN)));
                }
                cur = lineView.node.nextSibling;
            }
            lineN += lineView.size;
        }
        while(cur)cur = rm(cur);
    }
    function updateGutterSpace(display) {
        var width = display.gutters.offsetWidth;
        display.sizer.style.marginLeft = width + "px";
        // Send an event to consumers responding to changes in gutter width.
        signalLater(display, "gutterChanged", display);
    }
    function setDocumentHeight(cm, measure) {
        cm.display.sizer.style.minHeight = measure.docHeight + "px";
        cm.display.heightForcer.style.top = measure.docHeight + "px";
        cm.display.gutters.style.height = measure.docHeight + cm.display.barHeight + scrollGap(cm) + "px";
    }
    // Re-align line numbers and gutter marks to compensate for
    // horizontal scrolling.
    function alignHorizontally(cm) {
        var display = cm.display, view = display.view;
        if (!display.alignWidgets && (!display.gutters.firstChild || !cm.options.fixedGutter)) return;
        var comp = compensateForHScroll(display) - display.scroller.scrollLeft + cm.doc.scrollLeft;
        var gutterW = display.gutters.offsetWidth, left = comp + "px";
        for(var i = 0; i < view.length; i++)if (!view[i].hidden) {
            if (cm.options.fixedGutter) {
                if (view[i].gutter) view[i].gutter.style.left = left;
                if (view[i].gutterBackground) view[i].gutterBackground.style.left = left;
            }
            var align = view[i].alignable;
            if (align) for(var j = 0; j < align.length; j++)align[j].style.left = left;
        }
        if (cm.options.fixedGutter) display.gutters.style.left = comp + gutterW + "px";
    }
    // Used to ensure that the line number gutter is still the right
    // size for the current document size. Returns true when an update
    // is needed.
    function maybeUpdateLineNumberWidth(cm) {
        if (!cm.options.lineNumbers) return false;
        var doc = cm.doc, last = lineNumberFor(cm.options, doc.first + doc.size - 1), display = cm.display;
        if (last.length != display.lineNumChars) {
            var test = display.measure.appendChild(elt("div", [
                elt("div", last)
            ], "CodeMirror-linenumber CodeMirror-gutter-elt"));
            var innerW = test.firstChild.offsetWidth, padding = test.offsetWidth - innerW;
            display.lineGutter.style.width = "";
            display.lineNumInnerWidth = Math.max(innerW, display.lineGutter.offsetWidth - padding) + 1;
            display.lineNumWidth = display.lineNumInnerWidth + padding;
            display.lineNumChars = display.lineNumInnerWidth ? last.length : -1;
            display.lineGutter.style.width = display.lineNumWidth + "px";
            updateGutterSpace(cm.display);
            return true;
        }
        return false;
    }
    function getGutters(gutters, lineNumbers) {
        var result = [], sawLineNumbers = false;
        for(var i = 0; i < gutters.length; i++){
            var name = gutters[i], style = null;
            if (typeof name != "string") {
                style = name.style;
                name = name.className;
            }
            if (name == "CodeMirror-linenumbers") {
                if (!lineNumbers) continue;
                else sawLineNumbers = true;
            }
            result.push({
                className: name,
                style: style
            });
        }
        if (lineNumbers && !sawLineNumbers) result.push({
            className: "CodeMirror-linenumbers",
            style: null
        });
        return result;
    }
    // Rebuild the gutter elements, ensure the margin to the left of the
    // code matches their width.
    function renderGutters(display) {
        var gutters = display.gutters, specs = display.gutterSpecs;
        removeChildren(gutters);
        display.lineGutter = null;
        for(var i = 0; i < specs.length; ++i){
            var ref = specs[i];
            var className = ref.className;
            var style = ref.style;
            var gElt = gutters.appendChild(elt("div", null, "CodeMirror-gutter " + className));
            if (style) gElt.style.cssText = style;
            if (className == "CodeMirror-linenumbers") {
                display.lineGutter = gElt;
                gElt.style.width = (display.lineNumWidth || 1) + "px";
            }
        }
        gutters.style.display = specs.length ? "" : "none";
        updateGutterSpace(display);
    }
    function updateGutters(cm) {
        renderGutters(cm.display);
        regChange(cm);
        alignHorizontally(cm);
    }
    // The display handles the DOM integration, both for input reading
    // and content drawing. It holds references to DOM nodes and
    // display-related state.
    function Display(place, doc, input, options) {
        var d = this;
        this.input = input;
        // Covers bottom-right square when both scrollbars are present.
        d.scrollbarFiller = elt("div", null, "CodeMirror-scrollbar-filler");
        d.scrollbarFiller.setAttribute("cm-not-content", "true");
        // Covers bottom of gutter when coverGutterNextToScrollbar is on
        // and h scrollbar is present.
        d.gutterFiller = elt("div", null, "CodeMirror-gutter-filler");
        d.gutterFiller.setAttribute("cm-not-content", "true");
        // Will contain the actual code, positioned to cover the viewport.
        d.lineDiv = eltP("div", null, "CodeMirror-code");
        // Elements are added to these to represent selection and cursors.
        d.selectionDiv = elt("div", null, null, "position: relative; z-index: 1");
        d.cursorDiv = elt("div", null, "CodeMirror-cursors");
        // A visibility: hidden element used to find the size of things.
        d.measure = elt("div", null, "CodeMirror-measure");
        // When lines outside of the viewport are measured, they are drawn in this.
        d.lineMeasure = elt("div", null, "CodeMirror-measure");
        // Wraps everything that needs to exist inside the vertically-padded coordinate system
        d.lineSpace = eltP("div", [
            d.measure,
            d.lineMeasure,
            d.selectionDiv,
            d.cursorDiv,
            d.lineDiv
        ], null, "position: relative; outline: none");
        var lines = eltP("div", [
            d.lineSpace
        ], "CodeMirror-lines");
        // Moved around its parent to cover visible view.
        d.mover = elt("div", [
            lines
        ], null, "position: relative");
        // Set to the height of the document, allowing scrolling.
        d.sizer = elt("div", [
            d.mover
        ], "CodeMirror-sizer");
        d.sizerWidth = null;
        // Behavior of elts with overflow: auto and padding is
        // inconsistent across browsers. This is used to ensure the
        // scrollable area is big enough.
        d.heightForcer = elt("div", null, null, "position: absolute; height: " + scrollerGap + "px; width: 1px;");
        // Will contain the gutters, if any.
        d.gutters = elt("div", null, "CodeMirror-gutters");
        d.lineGutter = null;
        // Actual scrollable element.
        d.scroller = elt("div", [
            d.sizer,
            d.heightForcer,
            d.gutters
        ], "CodeMirror-scroll");
        d.scroller.setAttribute("tabIndex", "-1");
        // The element in which the editor lives.
        d.wrapper = elt("div", [
            d.scrollbarFiller,
            d.gutterFiller,
            d.scroller
        ], "CodeMirror");
        // See #6982. FIXME remove when this has been fixed for a while in Chrome
        if (chrome && chrome_version >= 105) d.wrapper.style.clipPath = "inset(0px)";
        // This attribute is respected by automatic translation systems such as Google Translate,
        // and may also be respected by tools used by human translators.
        d.wrapper.setAttribute('translate', 'no');
        // Work around IE7 z-index bug (not perfect, hence IE7 not really being supported)
        if (ie && ie_version < 8) {
            d.gutters.style.zIndex = -1;
            d.scroller.style.paddingRight = 0;
        }
        if (!webkit && !(gecko && mobile)) d.scroller.draggable = true;
        if (place) {
            if (place.appendChild) place.appendChild(d.wrapper);
            else place(d.wrapper);
        }
        // Current rendered range (may be bigger than the view window).
        d.viewFrom = d.viewTo = doc.first;
        d.reportedViewFrom = d.reportedViewTo = doc.first;
        // Information about the rendered lines.
        d.view = [];
        d.renderedView = null;
        // Holds info about a single rendered line when it was rendered
        // for measurement, while not in view.
        d.externalMeasured = null;
        // Empty space (in pixels) above the view
        d.viewOffset = 0;
        d.lastWrapHeight = d.lastWrapWidth = 0;
        d.updateLineNumbers = null;
        d.nativeBarWidth = d.barHeight = d.barWidth = 0;
        d.scrollbarsClipped = false;
        // Used to only resize the line number gutter when necessary (when
        // the amount of lines crosses a boundary that makes its width change)
        d.lineNumWidth = d.lineNumInnerWidth = d.lineNumChars = null;
        // Set to true when a non-horizontal-scrolling line widget is
        // added. As an optimization, line widget aligning is skipped when
        // this is false.
        d.alignWidgets = false;
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        // Tracks the maximum line length so that the horizontal scrollbar
        // can be kept static when scrolling.
        d.maxLine = null;
        d.maxLineLength = 0;
        d.maxLineChanged = false;
        // Used for measuring wheel scrolling granularity
        d.wheelDX = d.wheelDY = d.wheelStartX = d.wheelStartY = null;
        // True when shift is held down.
        d.shift = false;
        // Used to track whether anything happened since the context menu
        // was opened.
        d.selForContextMenu = null;
        d.activeTouch = null;
        d.gutterSpecs = getGutters(options.gutters, options.lineNumbers);
        renderGutters(d);
        input.init(d);
    }
    // Since the delta values reported on mouse wheel events are
    // unstandardized between browsers and even browser versions, and
    // generally horribly unpredictable, this code starts by measuring
    // the scroll effect that the first few mouse wheel events have,
    // and, from that, detects the way it can convert deltas to pixel
    // offsets afterwards.
    //
    // The reason we want to know the amount a wheel event will scroll
    // is that it gives us a chance to update the display before the
    // actual scrolling happens, reducing flickering.
    var wheelSamples = 0, wheelPixelsPerUnit = null;
    // Fill in a browser-detected starting value on browsers where we
    // know one. These don't have to be accurate -- the result of them
    // being wrong would just be a slight flicker on the first wheel
    // scroll (if it is large enough).
    if (ie) wheelPixelsPerUnit = -0.53;
    else if (gecko) wheelPixelsPerUnit = 15;
    else if (chrome) wheelPixelsPerUnit = -0.7;
    else if (safari) wheelPixelsPerUnit = -1 / 3;
    function wheelEventDelta(e) {
        var dx = e.wheelDeltaX, dy = e.wheelDeltaY;
        if (dx == null && e.detail && e.axis == e.HORIZONTAL_AXIS) dx = e.detail;
        if (dy == null && e.detail && e.axis == e.VERTICAL_AXIS) dy = e.detail;
        else if (dy == null) dy = e.wheelDelta;
        return {
            x: dx,
            y: dy
        };
    }
    function wheelEventPixels(e) {
        var delta = wheelEventDelta(e);
        delta.x *= wheelPixelsPerUnit;
        delta.y *= wheelPixelsPerUnit;
        return delta;
    }
    function onScrollWheel(cm, e) {
        // On Chrome 102, viewport updates somehow stop wheel-based
        // scrolling. Turning off pointer events during the scroll seems
        // to avoid the issue.
        if (chrome && chrome_version == 102) {
            if (cm.display.chromeScrollHack == null) cm.display.sizer.style.pointerEvents = "none";
            else clearTimeout(cm.display.chromeScrollHack);
            cm.display.chromeScrollHack = setTimeout(function() {
                cm.display.chromeScrollHack = null;
                cm.display.sizer.style.pointerEvents = "";
            }, 100);
        }
        var delta = wheelEventDelta(e), dx = delta.x, dy = delta.y;
        var pixelsPerUnit = wheelPixelsPerUnit;
        if (e.deltaMode === 0) {
            dx = e.deltaX;
            dy = e.deltaY;
            pixelsPerUnit = 1;
        }
        var display = cm.display, scroll = display.scroller;
        // Quit if there's nothing to scroll here
        var canScrollX = scroll.scrollWidth > scroll.clientWidth;
        var canScrollY = scroll.scrollHeight > scroll.clientHeight;
        if (!(dx && canScrollX || dy && canScrollY)) return;
        // Webkit browsers on OS X abort momentum scrolls when the target
        // of the scroll event is removed from the scrollable element.
        // This hack (see related code in patchDisplay) makes sure the
        // element is kept around.
        if (dy && mac && webkit) outer: for(var cur = e.target, view = display.view; cur != scroll; cur = cur.parentNode){
            for(var i = 0; i < view.length; i++)if (view[i].node == cur) {
                cm.display.currentWheelTarget = cur;
                break outer;
            }
        }
        // On some browsers, horizontal scrolling will cause redraws to
        // happen before the gutter has been realigned, causing it to
        // wriggle around in a most unseemly way. When we have an
        // estimated pixels/delta value, we just handle horizontal
        // scrolling entirely here. It'll be slightly off from native, but
        // better than glitching out.
        if (dx && !gecko && !presto && pixelsPerUnit != null) {
            if (dy && canScrollY) updateScrollTop(cm, Math.max(0, scroll.scrollTop + dy * pixelsPerUnit));
            setScrollLeft(cm, Math.max(0, scroll.scrollLeft + dx * pixelsPerUnit));
            // Only prevent default scrolling if vertical scrolling is
            // actually possible. Otherwise, it causes vertical scroll
            // jitter on OSX trackpads when deltaX is small and deltaY
            // is large (issue #3579)
            if (!dy || dy && canScrollY) e_preventDefault(e);
            display.wheelStartX = null; // Abort measurement, if in progress
            return;
        }
        // 'Project' the visible viewport to cover the area that is being
        // scrolled into view (if we know enough to estimate it).
        if (dy && pixelsPerUnit != null) {
            var pixels = dy * pixelsPerUnit;
            var top = cm.doc.scrollTop, bot = top + display.wrapper.clientHeight;
            if (pixels < 0) top = Math.max(0, top + pixels - 50);
            else bot = Math.min(cm.doc.height, bot + pixels + 50);
            updateDisplaySimple(cm, {
                top: top,
                bottom: bot
            });
        }
        if (wheelSamples < 20 && e.deltaMode !== 0) {
            if (display.wheelStartX == null) {
                display.wheelStartX = scroll.scrollLeft;
                display.wheelStartY = scroll.scrollTop;
                display.wheelDX = dx;
                display.wheelDY = dy;
                setTimeout(function() {
                    if (display.wheelStartX == null) return;
                    var movedX = scroll.scrollLeft - display.wheelStartX;
                    var movedY = scroll.scrollTop - display.wheelStartY;
                    var sample = movedY && display.wheelDY && movedY / display.wheelDY || movedX && display.wheelDX && movedX / display.wheelDX;
                    display.wheelStartX = display.wheelStartY = null;
                    if (!sample) return;
                    wheelPixelsPerUnit = (wheelPixelsPerUnit * wheelSamples + sample) / (wheelSamples + 1);
                    ++wheelSamples;
                }, 200);
            } else {
                display.wheelDX += dx;
                display.wheelDY += dy;
            }
        }
    }
    // Selection objects are immutable. A new one is created every time
    // the selection changes. A selection is one or more non-overlapping
    // (and non-touching) ranges, sorted, and an integer that indicates
    // which one is the primary selection (the one that's scrolled into
    // view, that getCursor returns, etc).
    var Selection = function(ranges, primIndex) {
        this.ranges = ranges;
        this.primIndex = primIndex;
    };
    Selection.prototype.primary = function() {
        return this.ranges[this.primIndex];
    };
    Selection.prototype.equals = function(other) {
        if (other == this) return true;
        if (other.primIndex != this.primIndex || other.ranges.length != this.ranges.length) return false;
        for(var i = 0; i < this.ranges.length; i++){
            var here = this.ranges[i], there = other.ranges[i];
            if (!equalCursorPos(here.anchor, there.anchor) || !equalCursorPos(here.head, there.head)) return false;
        }
        return true;
    };
    Selection.prototype.deepCopy = function() {
        var out = [];
        for(var i = 0; i < this.ranges.length; i++)out[i] = new Range(copyPos(this.ranges[i].anchor), copyPos(this.ranges[i].head));
        return new Selection(out, this.primIndex);
    };
    Selection.prototype.somethingSelected = function() {
        for(var i = 0; i < this.ranges.length; i++){
            if (!this.ranges[i].empty()) return true;
        }
        return false;
    };
    Selection.prototype.contains = function(pos, end) {
        if (!end) end = pos;
        for(var i = 0; i < this.ranges.length; i++){
            var range = this.ranges[i];
            if (cmp(end, range.from()) >= 0 && cmp(pos, range.to()) <= 0) return i;
        }
        return -1;
    };
    var Range = function(anchor, head) {
        this.anchor = anchor;
        this.head = head;
    };
    Range.prototype.from = function() {
        return minPos(this.anchor, this.head);
    };
    Range.prototype.to = function() {
        return maxPos(this.anchor, this.head);
    };
    Range.prototype.empty = function() {
        return this.head.line == this.anchor.line && this.head.ch == this.anchor.ch;
    };
    // Take an unsorted, potentially overlapping set of ranges, and
    // build a selection out of it. 'Consumes' ranges array (modifying
    // it).
    function normalizeSelection(cm, ranges, primIndex) {
        var mayTouch = cm && cm.options.selectionsMayTouch;
        var prim = ranges[primIndex];
        ranges.sort(function(a, b) {
            return cmp(a.from(), b.from());
        });
        primIndex = indexOf(ranges, prim);
        for(var i = 1; i < ranges.length; i++){
            var cur = ranges[i], prev = ranges[i - 1];
            var diff = cmp(prev.to(), cur.from());
            if (mayTouch && !cur.empty() ? diff > 0 : diff >= 0) {
                var from = minPos(prev.from(), cur.from()), to = maxPos(prev.to(), cur.to());
                var inv = prev.empty() ? cur.from() == cur.head : prev.from() == prev.head;
                if (i <= primIndex) --primIndex;
                ranges.splice(--i, 2, new Range(inv ? to : from, inv ? from : to));
            }
        }
        return new Selection(ranges, primIndex);
    }
    function simpleSelection(anchor, head) {
        return new Selection([
            new Range(anchor, head || anchor)
        ], 0);
    }
    // Compute the position of the end of a change (its 'to' property
    // refers to the pre-change end).
    function changeEnd(change) {
        if (!change.text) return change.to;
        return Pos(change.from.line + change.text.length - 1, lst(change.text).length + (change.text.length == 1 ? change.from.ch : 0));
    }
    // Adjust a position to refer to the post-change position of the
    // same text, or the end of the change if the change covers it.
    function adjustForChange(pos, change) {
        if (cmp(pos, change.from) < 0) return pos;
        if (cmp(pos, change.to) <= 0) return changeEnd(change);
        var line = pos.line + change.text.length - (change.to.line - change.from.line) - 1, ch = pos.ch;
        if (pos.line == change.to.line) ch += changeEnd(change).ch - change.to.ch;
        return Pos(line, ch);
    }
    function computeSelAfterChange(doc, change) {
        var out = [];
        for(var i = 0; i < doc.sel.ranges.length; i++){
            var range = doc.sel.ranges[i];
            out.push(new Range(adjustForChange(range.anchor, change), adjustForChange(range.head, change)));
        }
        return normalizeSelection(doc.cm, out, doc.sel.primIndex);
    }
    function offsetPos(pos, old, nw) {
        if (pos.line == old.line) return Pos(nw.line, pos.ch - old.ch + nw.ch);
        else return Pos(nw.line + (pos.line - old.line), pos.ch);
    }
    // Used by replaceSelections to allow moving the selection to the
    // start or around the replaced test. Hint may be "start" or "around".
    function computeReplacedSel(doc, changes, hint) {
        var out = [];
        var oldPrev = Pos(doc.first, 0), newPrev = oldPrev;
        for(var i = 0; i < changes.length; i++){
            var change = changes[i];
            var from = offsetPos(change.from, oldPrev, newPrev);
            var to = offsetPos(changeEnd(change), oldPrev, newPrev);
            oldPrev = change.to;
            newPrev = to;
            if (hint == "around") {
                var range = doc.sel.ranges[i], inv = cmp(range.head, range.anchor) < 0;
                out[i] = new Range(inv ? to : from, inv ? from : to);
            } else out[i] = new Range(from, from);
        }
        return new Selection(out, doc.sel.primIndex);
    }
    // Used to get the editor into a consistent state again when options change.
    function loadMode(cm) {
        cm.doc.mode = getMode(cm.options, cm.doc.modeOption);
        resetModeState(cm);
    }
    function resetModeState(cm) {
        cm.doc.iter(function(line) {
            if (line.stateAfter) line.stateAfter = null;
            if (line.styles) line.styles = null;
        });
        cm.doc.modeFrontier = cm.doc.highlightFrontier = cm.doc.first;
        startWorker(cm, 100);
        cm.state.modeGen++;
        if (cm.curOp) regChange(cm);
    }
    // DOCUMENT DATA STRUCTURE
    // By default, updates that start and end at the beginning of a line
    // are treated specially, in order to make the association of line
    // widgets and marker elements with the text behave more intuitive.
    function isWholeLineUpdate(doc, change) {
        return change.from.ch == 0 && change.to.ch == 0 && lst(change.text) == "" && (!doc.cm || doc.cm.options.wholeLineUpdateBefore);
    }
    // Perform a change on the document data structure.
    function updateDoc(doc, change, markedSpans, estimateHeight) {
        function spansFor(n) {
            return markedSpans ? markedSpans[n] : null;
        }
        function update(line, text, spans) {
            updateLine(line, text, spans, estimateHeight);
            signalLater(line, "change", line, change);
        }
        function linesFor(start, end) {
            var result = [];
            for(var i = start; i < end; ++i)result.push(new Line(text[i], spansFor(i), estimateHeight));
            return result;
        }
        var from = change.from, to = change.to, text = change.text;
        var firstLine = getLine(doc, from.line), lastLine = getLine(doc, to.line);
        var lastText = lst(text), lastSpans = spansFor(text.length - 1), nlines = to.line - from.line;
        // Adjust the line structure
        if (change.full) {
            doc.insert(0, linesFor(0, text.length));
            doc.remove(text.length, doc.size - text.length);
        } else if (isWholeLineUpdate(doc, change)) {
            // This is a whole-line replace. Treated specially to make
            // sure line objects move the way they are supposed to.
            var added = linesFor(0, text.length - 1);
            update(lastLine, lastLine.text, lastSpans);
            if (nlines) doc.remove(from.line, nlines);
            if (added.length) doc.insert(from.line, added);
        } else if (firstLine == lastLine) {
            if (text.length == 1) update(firstLine, firstLine.text.slice(0, from.ch) + lastText + firstLine.text.slice(to.ch), lastSpans);
            else {
                var added$1 = linesFor(1, text.length - 1);
                added$1.push(new Line(lastText + firstLine.text.slice(to.ch), lastSpans, estimateHeight));
                update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
                doc.insert(from.line + 1, added$1);
            }
        } else if (text.length == 1) {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0] + lastLine.text.slice(to.ch), spansFor(0));
            doc.remove(from.line + 1, nlines);
        } else {
            update(firstLine, firstLine.text.slice(0, from.ch) + text[0], spansFor(0));
            update(lastLine, lastText + lastLine.text.slice(to.ch), lastSpans);
            var added$2 = linesFor(1, text.length - 1);
            if (nlines > 1) doc.remove(from.line + 1, nlines - 1);
            doc.insert(from.line + 1, added$2);
        }
        signalLater(doc, "change", doc, change);
    }
    // Call f for all linked documents.
    function linkedDocs(doc, f, sharedHistOnly) {
        function propagate(doc, skip, sharedHist) {
            if (doc.linked) for(var i = 0; i < doc.linked.length; ++i){
                var rel = doc.linked[i];
                if (rel.doc == skip) continue;
                var shared = sharedHist && rel.sharedHist;
                if (sharedHistOnly && !shared) continue;
                f(rel.doc, shared);
                propagate(rel.doc, doc, shared);
            }
        }
        propagate(doc, null, true);
    }
    // Attach a document to an editor.
    function attachDoc(cm, doc) {
        if (doc.cm) throw new Error("This document is already in use.");
        cm.doc = doc;
        doc.cm = cm;
        estimateLineHeights(cm);
        loadMode(cm);
        setDirectionClass(cm);
        cm.options.direction = doc.direction;
        if (!cm.options.lineWrapping) findMaxLine(cm);
        cm.options.mode = doc.modeOption;
        regChange(cm);
    }
    function setDirectionClass(cm) {
        (cm.doc.direction == "rtl" ? addClass : rmClass)(cm.display.lineDiv, "CodeMirror-rtl");
    }
    function directionChanged(cm) {
        runInOp(cm, function() {
            setDirectionClass(cm);
            regChange(cm);
        });
    }
    function History(prev) {
        // Arrays of change events and selections. Doing something adds an
        // event to done and clears undo. Undoing moves events from done
        // to undone, redoing moves them in the other direction.
        this.done = [];
        this.undone = [];
        this.undoDepth = prev ? prev.undoDepth : Infinity;
        // Used to track when changes can be merged into a single undo
        // event
        this.lastModTime = this.lastSelTime = 0;
        this.lastOp = this.lastSelOp = null;
        this.lastOrigin = this.lastSelOrigin = null;
        // Used by the isClean() method
        this.generation = this.maxGeneration = prev ? prev.maxGeneration : 1;
    }
    // Create a history change event from an updateDoc-style change
    // object.
    function historyChangeFromChange(doc, change) {
        var histChange = {
            from: copyPos(change.from),
            to: changeEnd(change),
            text: getBetween(doc, change.from, change.to)
        };
        attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        linkedDocs(doc, function(doc) {
            return attachLocalSpans(doc, histChange, change.from.line, change.to.line + 1);
        }, true);
        return histChange;
    }
    // Pop all selection events off the end of a history array. Stop at
    // a change event.
    function clearSelectionEvents(array) {
        while(array.length){
            var last = lst(array);
            if (last.ranges) array.pop();
            else break;
        }
    }
    // Find the top change event in the history. Pop off selection
    // events that are in the way.
    function lastChangeEvent(hist, force) {
        if (force) {
            clearSelectionEvents(hist.done);
            return lst(hist.done);
        } else if (hist.done.length && !lst(hist.done).ranges) return lst(hist.done);
        else if (hist.done.length > 1 && !hist.done[hist.done.length - 2].ranges) {
            hist.done.pop();
            return lst(hist.done);
        }
    }
    // Register a change in the history. Merges changes that are within
    // a single operation, or are close together with an origin that
    // allows merging (starting with "+") into a single event.
    function addChangeToHistory(doc, change, selAfter, opId) {
        var hist = doc.history;
        hist.undone.length = 0;
        var time = +new Date, cur;
        var last;
        if ((hist.lastOp == opId || hist.lastOrigin == change.origin && change.origin && (change.origin.charAt(0) == "+" && hist.lastModTime > time - (doc.cm ? doc.cm.options.historyEventDelay : 500) || change.origin.charAt(0) == "*")) && (cur = lastChangeEvent(hist, hist.lastOp == opId))) {
            // Merge this change into the last event
            last = lst(cur.changes);
            if (cmp(change.from, change.to) == 0 && cmp(change.from, last.to) == 0) // Optimized case for simple insertion -- don't want to add
            // new changesets for every character typed
            last.to = changeEnd(change);
            else // Add new sub-event
            cur.changes.push(historyChangeFromChange(doc, change));
        } else {
            // Can not be merged, start a new event.
            var before = lst(hist.done);
            if (!before || !before.ranges) pushSelectionToHistory(doc.sel, hist.done);
            cur = {
                changes: [
                    historyChangeFromChange(doc, change)
                ],
                generation: hist.generation
            };
            hist.done.push(cur);
            while(hist.done.length > hist.undoDepth){
                hist.done.shift();
                if (!hist.done[0].ranges) hist.done.shift();
            }
        }
        hist.done.push(selAfter);
        hist.generation = ++hist.maxGeneration;
        hist.lastModTime = hist.lastSelTime = time;
        hist.lastOp = hist.lastSelOp = opId;
        hist.lastOrigin = hist.lastSelOrigin = change.origin;
        if (!last) signal(doc, "historyAdded");
    }
    function selectionEventCanBeMerged(doc, origin, prev, sel) {
        var ch = origin.charAt(0);
        return ch == "*" || ch == "+" && prev.ranges.length == sel.ranges.length && prev.somethingSelected() == sel.somethingSelected() && new Date - doc.history.lastSelTime <= (doc.cm ? doc.cm.options.historyEventDelay : 500);
    }
    // Called whenever the selection changes, sets the new selection as
    // the pending selection in the history, and pushes the old pending
    // selection into the 'done' array when it was significantly
    // different (in number of selected ranges, emptiness, or time).
    function addSelectionToHistory(doc, sel, opId, options) {
        var hist = doc.history, origin = options && options.origin;
        // A new event is started when the previous origin does not match
        // the current, or the origins don't allow matching. Origins
        // starting with * are always merged, those starting with + are
        // merged when similar and close together in time.
        if (opId == hist.lastSelOp || origin && hist.lastSelOrigin == origin && (hist.lastModTime == hist.lastSelTime && hist.lastOrigin == origin || selectionEventCanBeMerged(doc, origin, lst(hist.done), sel))) hist.done[hist.done.length - 1] = sel;
        else pushSelectionToHistory(sel, hist.done);
        hist.lastSelTime = +new Date;
        hist.lastSelOrigin = origin;
        hist.lastSelOp = opId;
        if (options && options.clearRedo !== false) clearSelectionEvents(hist.undone);
    }
    function pushSelectionToHistory(sel, dest) {
        var top = lst(dest);
        if (!(top && top.ranges && top.equals(sel))) dest.push(sel);
    }
    // Used to store marked span information in the history.
    function attachLocalSpans(doc, change, from, to) {
        var existing = change["spans_" + doc.id], n = 0;
        doc.iter(Math.max(doc.first, from), Math.min(doc.first + doc.size, to), function(line) {
            if (line.markedSpans) (existing || (existing = change["spans_" + doc.id] = {}))[n] = line.markedSpans;
            ++n;
        });
    }
    // When un/re-doing restores text containing marked spans, those
    // that have been explicitly cleared should not be restored.
    function removeClearedSpans(spans) {
        if (!spans) return null;
        var out;
        for(var i = 0; i < spans.length; ++i){
            if (spans[i].marker.explicitlyCleared) {
                if (!out) out = spans.slice(0, i);
            } else if (out) out.push(spans[i]);
        }
        return !out ? spans : out.length ? out : null;
    }
    // Retrieve and filter the old marked spans stored in a change event.
    function getOldSpans(doc, change) {
        var found = change["spans_" + doc.id];
        if (!found) return null;
        var nw = [];
        for(var i = 0; i < change.text.length; ++i)nw.push(removeClearedSpans(found[i]));
        return nw;
    }
    // Used for un/re-doing changes from the history. Combines the
    // result of computing the existing spans with the set of spans that
    // existed in the history (so that deleting around a span and then
    // undoing brings back the span).
    function mergeOldSpans(doc, change) {
        var old = getOldSpans(doc, change);
        var stretched = stretchSpansOverChange(doc, change);
        if (!old) return stretched;
        if (!stretched) return old;
        for(var i = 0; i < old.length; ++i){
            var oldCur = old[i], stretchCur = stretched[i];
            if (oldCur && stretchCur) spans: for(var j = 0; j < stretchCur.length; ++j){
                var span = stretchCur[j];
                for(var k = 0; k < oldCur.length; ++k){
                    if (oldCur[k].marker == span.marker) continue spans;
                }
                oldCur.push(span);
            }
            else if (stretchCur) old[i] = stretchCur;
        }
        return old;
    }
    // Used both to provide a JSON-safe object in .getHistory, and, when
    // detaching a document, to split the history in two
    function copyHistoryArray(events, newGroup, instantiateSel) {
        var copy = [];
        for(var i = 0; i < events.length; ++i){
            var event = events[i];
            if (event.ranges) {
                copy.push(instantiateSel ? Selection.prototype.deepCopy.call(event) : event);
                continue;
            }
            var changes = event.changes, newChanges = [];
            copy.push({
                changes: newChanges
            });
            for(var j = 0; j < changes.length; ++j){
                var change = changes[j], m = void 0;
                newChanges.push({
                    from: change.from,
                    to: change.to,
                    text: change.text
                });
                if (newGroup) for(var prop in change){
                    if (m = prop.match(/^spans_(\d+)$/)) {
                        if (indexOf(newGroup, Number(m[1])) > -1) {
                            lst(newChanges)[prop] = change[prop];
                            delete change[prop];
                        }
                    }
                }
            }
        }
        return copy;
    }
    // The 'scroll' parameter given to many of these indicated whether
    // the new cursor position should be scrolled into view after
    // modifying the selection.
    // If shift is held or the extend flag is set, extends a range to
    // include a given position (and optionally a second position).
    // Otherwise, simply returns the range between the given positions.
    // Used for cursor motion and such.
    function extendRange(range, head, other, extend) {
        if (extend) {
            var anchor = range.anchor;
            if (other) {
                var posBefore = cmp(head, anchor) < 0;
                if (posBefore != cmp(other, anchor) < 0) {
                    anchor = head;
                    head = other;
                } else if (posBefore != cmp(head, other) < 0) head = other;
            }
            return new Range(anchor, head);
        } else return new Range(other || head, head);
    }
    // Extend the primary selection range, discard the rest.
    function extendSelection(doc, head, other, options, extend) {
        if (extend == null) extend = doc.cm && (doc.cm.display.shift || doc.extend);
        setSelection(doc, new Selection([
            extendRange(doc.sel.primary(), head, other, extend)
        ], 0), options);
    }
    // Extend all selections (pos is an array of selections with length
    // equal the number of selections)
    function extendSelections(doc, heads, options) {
        var out = [];
        var extend = doc.cm && (doc.cm.display.shift || doc.extend);
        for(var i = 0; i < doc.sel.ranges.length; i++)out[i] = extendRange(doc.sel.ranges[i], heads[i], null, extend);
        var newSel = normalizeSelection(doc.cm, out, doc.sel.primIndex);
        setSelection(doc, newSel, options);
    }
    // Updates a single range in the selection.
    function replaceOneSelection(doc, i, range, options) {
        var ranges = doc.sel.ranges.slice(0);
        ranges[i] = range;
        setSelection(doc, normalizeSelection(doc.cm, ranges, doc.sel.primIndex), options);
    }
    // Reset the selection to a single range.
    function setSimpleSelection(doc, anchor, head, options) {
        setSelection(doc, simpleSelection(anchor, head), options);
    }
    // Give beforeSelectionChange handlers a change to influence a
    // selection update.
    function filterSelectionChange(doc, sel, options) {
        var obj = {
            ranges: sel.ranges,
            update: function(ranges) {
                this.ranges = [];
                for(var i = 0; i < ranges.length; i++)this.ranges[i] = new Range(clipPos(doc, ranges[i].anchor), clipPos(doc, ranges[i].head));
            },
            origin: options && options.origin
        };
        signal(doc, "beforeSelectionChange", doc, obj);
        if (doc.cm) signal(doc.cm, "beforeSelectionChange", doc.cm, obj);
        if (obj.ranges != sel.ranges) return normalizeSelection(doc.cm, obj.ranges, obj.ranges.length - 1);
        else return sel;
    }
    function setSelectionReplaceHistory(doc, sel, options) {
        var done = doc.history.done, last = lst(done);
        if (last && last.ranges) {
            done[done.length - 1] = sel;
            setSelectionNoUndo(doc, sel, options);
        } else setSelection(doc, sel, options);
    }
    // Set a new selection.
    function setSelection(doc, sel, options) {
        setSelectionNoUndo(doc, sel, options);
        addSelectionToHistory(doc, doc.sel, doc.cm ? doc.cm.curOp.id : NaN, options);
    }
    function setSelectionNoUndo(doc, sel, options) {
        if (hasHandler(doc, "beforeSelectionChange") || doc.cm && hasHandler(doc.cm, "beforeSelectionChange")) sel = filterSelectionChange(doc, sel, options);
        var bias = options && options.bias || (cmp(sel.primary().head, doc.sel.primary().head) < 0 ? -1 : 1);
        setSelectionInner(doc, skipAtomicInSelection(doc, sel, bias, true));
        if (!(options && options.scroll === false) && doc.cm && doc.cm.getOption("readOnly") != "nocursor") ensureCursorVisible(doc.cm);
    }
    function setSelectionInner(doc, sel) {
        if (sel.equals(doc.sel)) return;
        doc.sel = sel;
        if (doc.cm) {
            doc.cm.curOp.updateInput = 1;
            doc.cm.curOp.selectionChanged = true;
            signalCursorActivity(doc.cm);
        }
        signalLater(doc, "cursorActivity", doc);
    }
    // Verify that the selection does not partially select any atomic
    // marked ranges.
    function reCheckSelection(doc) {
        setSelectionInner(doc, skipAtomicInSelection(doc, doc.sel, null, false));
    }
    // Return a selection that does not partially select any atomic
    // ranges.
    function skipAtomicInSelection(doc, sel, bias, mayClear) {
        var out;
        for(var i = 0; i < sel.ranges.length; i++){
            var range = sel.ranges[i];
            var old = sel.ranges.length == doc.sel.ranges.length && doc.sel.ranges[i];
            var newAnchor = skipAtomic(doc, range.anchor, old && old.anchor, bias, mayClear);
            var newHead = range.head == range.anchor ? newAnchor : skipAtomic(doc, range.head, old && old.head, bias, mayClear);
            if (out || newAnchor != range.anchor || newHead != range.head) {
                if (!out) out = sel.ranges.slice(0, i);
                out[i] = new Range(newAnchor, newHead);
            }
        }
        return out ? normalizeSelection(doc.cm, out, sel.primIndex) : sel;
    }
    function skipAtomicInner(doc, pos, oldPos, dir, mayClear) {
        var line = getLine(doc, pos.line);
        if (line.markedSpans) for(var i = 0; i < line.markedSpans.length; ++i){
            var sp = line.markedSpans[i], m = sp.marker;
            // Determine if we should prevent the cursor being placed to the left/right of an atomic marker
            // Historically this was determined using the inclusiveLeft/Right option, but the new way to control it
            // is with selectLeft/Right
            var preventCursorLeft = "selectLeft" in m ? !m.selectLeft : m.inclusiveLeft;
            var preventCursorRight = "selectRight" in m ? !m.selectRight : m.inclusiveRight;
            if ((sp.from == null || (preventCursorLeft ? sp.from <= pos.ch : sp.from < pos.ch)) && (sp.to == null || (preventCursorRight ? sp.to >= pos.ch : sp.to > pos.ch))) {
                if (mayClear) {
                    signal(m, "beforeCursorEnter");
                    if (m.explicitlyCleared) {
                        if (!line.markedSpans) break;
                        else {
                            --i;
                            continue;
                        }
                    }
                }
                if (!m.atomic) continue;
                if (oldPos) {
                    var near = m.find(dir < 0 ? 1 : -1), diff = void 0;
                    if (dir < 0 ? preventCursorRight : preventCursorLeft) near = movePos(doc, near, -dir, near && near.line == pos.line ? line : null);
                    if (near && near.line == pos.line && (diff = cmp(near, oldPos)) && (dir < 0 ? diff < 0 : diff > 0)) return skipAtomicInner(doc, near, pos, dir, mayClear);
                }
                var far = m.find(dir < 0 ? -1 : 1);
                if (dir < 0 ? preventCursorLeft : preventCursorRight) far = movePos(doc, far, dir, far.line == pos.line ? line : null);
                return far ? skipAtomicInner(doc, far, pos, dir, mayClear) : null;
            }
        }
        return pos;
    }
    // Ensure a given position is not inside an atomic range.
    function skipAtomic(doc, pos, oldPos, bias, mayClear) {
        var dir = bias || 1;
        var found = skipAtomicInner(doc, pos, oldPos, dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, dir, true) || skipAtomicInner(doc, pos, oldPos, -dir, mayClear) || !mayClear && skipAtomicInner(doc, pos, oldPos, -dir, true);
        if (!found) {
            doc.cantEdit = true;
            return Pos(doc.first, 0);
        }
        return found;
    }
    function movePos(doc, pos, dir, line) {
        if (dir < 0 && pos.ch == 0) {
            if (pos.line > doc.first) return clipPos(doc, Pos(pos.line - 1));
            else return null;
        } else if (dir > 0 && pos.ch == (line || getLine(doc, pos.line)).text.length) {
            if (pos.line < doc.first + doc.size - 1) return Pos(pos.line + 1, 0);
            else return null;
        } else return new Pos(pos.line, pos.ch + dir);
    }
    function selectAll(cm) {
        cm.setSelection(Pos(cm.firstLine(), 0), Pos(cm.lastLine()), sel_dontScroll);
    }
    // UPDATING
    // Allow "beforeChange" event handlers to influence a change
    function filterChange(doc, change, update) {
        var obj = {
            canceled: false,
            from: change.from,
            to: change.to,
            text: change.text,
            origin: change.origin,
            cancel: function() {
                return obj.canceled = true;
            }
        };
        if (update) obj.update = function(from, to, text, origin) {
            if (from) obj.from = clipPos(doc, from);
            if (to) obj.to = clipPos(doc, to);
            if (text) obj.text = text;
            if (origin !== undefined) obj.origin = origin;
        };
        signal(doc, "beforeChange", doc, obj);
        if (doc.cm) signal(doc.cm, "beforeChange", doc.cm, obj);
        if (obj.canceled) {
            if (doc.cm) doc.cm.curOp.updateInput = 2;
            return null;
        }
        return {
            from: obj.from,
            to: obj.to,
            text: obj.text,
            origin: obj.origin
        };
    }
    // Apply a change to a document, and add it to the document's
    // history, and propagating it to all linked documents.
    function makeChange(doc, change, ignoreReadOnly) {
        if (doc.cm) {
            if (!doc.cm.curOp) return operation(doc.cm, makeChange)(doc, change, ignoreReadOnly);
            if (doc.cm.state.suppressEdits) return;
        }
        if (hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange")) {
            change = filterChange(doc, change, true);
            if (!change) return;
        }
        // Possibly split or suppress the update based on the presence
        // of read-only spans in its range.
        var split = sawReadOnlySpans && !ignoreReadOnly && removeReadOnlyRanges(doc, change.from, change.to);
        if (split) for(var i = split.length - 1; i >= 0; --i)makeChangeInner(doc, {
            from: split[i].from,
            to: split[i].to,
            text: i ? [
                ""
            ] : change.text,
            origin: change.origin
        });
        else makeChangeInner(doc, change);
    }
    function makeChangeInner(doc, change) {
        if (change.text.length == 1 && change.text[0] == "" && cmp(change.from, change.to) == 0) return;
        var selAfter = computeSelAfterChange(doc, change);
        addChangeToHistory(doc, change, selAfter, doc.cm ? doc.cm.curOp.id : NaN);
        makeChangeSingleDoc(doc, change, selAfter, stretchSpansOverChange(doc, change));
        var rebased = [];
        linkedDocs(doc, function(doc, sharedHist) {
            if (!sharedHist && indexOf(rebased, doc.history) == -1) {
                rebaseHist(doc.history, change);
                rebased.push(doc.history);
            }
            makeChangeSingleDoc(doc, change, null, stretchSpansOverChange(doc, change));
        });
    }
    // Revert a change stored in a document's history.
    function makeChangeFromHistory(doc, type, allowSelectionOnly) {
        var suppress = doc.cm && doc.cm.state.suppressEdits;
        if (suppress && !allowSelectionOnly) return;
        var hist = doc.history, event, selAfter = doc.sel;
        var source = type == "undo" ? hist.done : hist.undone, dest = type == "undo" ? hist.undone : hist.done;
        // Verify that there is a useable event (so that ctrl-z won't
        // needlessly clear selection events)
        var i = 0;
        for(; i < source.length; i++){
            event = source[i];
            if (allowSelectionOnly ? event.ranges && !event.equals(doc.sel) : !event.ranges) break;
        }
        if (i == source.length) return;
        hist.lastOrigin = hist.lastSelOrigin = null;
        for(;;){
            event = source.pop();
            if (event.ranges) {
                pushSelectionToHistory(event, dest);
                if (allowSelectionOnly && !event.equals(doc.sel)) {
                    setSelection(doc, event, {
                        clearRedo: false
                    });
                    return;
                }
                selAfter = event;
            } else if (suppress) {
                source.push(event);
                return;
            } else break;
        }
        // Build up a reverse change object to add to the opposite history
        // stack (redo when undoing, and vice versa).
        var antiChanges = [];
        pushSelectionToHistory(selAfter, dest);
        dest.push({
            changes: antiChanges,
            generation: hist.generation
        });
        hist.generation = event.generation || ++hist.maxGeneration;
        var filter = hasHandler(doc, "beforeChange") || doc.cm && hasHandler(doc.cm, "beforeChange");
        var loop = function(i) {
            var change = event.changes[i];
            change.origin = type;
            if (filter && !filterChange(doc, change, false)) {
                source.length = 0;
                return {};
            }
            antiChanges.push(historyChangeFromChange(doc, change));
            var after = i ? computeSelAfterChange(doc, change) : lst(source);
            makeChangeSingleDoc(doc, change, after, mergeOldSpans(doc, change));
            if (!i && doc.cm) doc.cm.scrollIntoView({
                from: change.from,
                to: changeEnd(change)
            });
            var rebased = [];
            // Propagate to the linked documents
            linkedDocs(doc, function(doc, sharedHist) {
                if (!sharedHist && indexOf(rebased, doc.history) == -1) {
                    rebaseHist(doc.history, change);
                    rebased.push(doc.history);
                }
                makeChangeSingleDoc(doc, change, null, mergeOldSpans(doc, change));
            });
        };
        for(var i$1 = event.changes.length - 1; i$1 >= 0; --i$1){
            var returned = loop(i$1);
            if (returned) return returned.v;
        }
    }
    // Sub-views need their line numbers shifted when text is added
    // above or below them in the parent document.
    function shiftDoc(doc, distance) {
        if (distance == 0) return;
        doc.first += distance;
        doc.sel = new Selection(map(doc.sel.ranges, function(range) {
            return new Range(Pos(range.anchor.line + distance, range.anchor.ch), Pos(range.head.line + distance, range.head.ch));
        }), doc.sel.primIndex);
        if (doc.cm) {
            regChange(doc.cm, doc.first, doc.first - distance, distance);
            for(var d = doc.cm.display, l = d.viewFrom; l < d.viewTo; l++)regLineChange(doc.cm, l, "gutter");
        }
    }
    // More lower-level change function, handling only a single document
    // (not linked ones).
    function makeChangeSingleDoc(doc, change, selAfter, spans) {
        if (doc.cm && !doc.cm.curOp) return operation(doc.cm, makeChangeSingleDoc)(doc, change, selAfter, spans);
        if (change.to.line < doc.first) {
            shiftDoc(doc, change.text.length - 1 - (change.to.line - change.from.line));
            return;
        }
        if (change.from.line > doc.lastLine()) return;
        // Clip the change to the size of this doc
        if (change.from.line < doc.first) {
            var shift = change.text.length - 1 - (doc.first - change.from.line);
            shiftDoc(doc, shift);
            change = {
                from: Pos(doc.first, 0),
                to: Pos(change.to.line + shift, change.to.ch),
                text: [
                    lst(change.text)
                ],
                origin: change.origin
            };
        }
        var last = doc.lastLine();
        if (change.to.line > last) change = {
            from: change.from,
            to: Pos(last, getLine(doc, last).text.length),
            text: [
                change.text[0]
            ],
            origin: change.origin
        };
        change.removed = getBetween(doc, change.from, change.to);
        if (!selAfter) selAfter = computeSelAfterChange(doc, change);
        if (doc.cm) makeChangeSingleDocInEditor(doc.cm, change, spans);
        else updateDoc(doc, change, spans);
        setSelectionNoUndo(doc, selAfter, sel_dontScroll);
        if (doc.cantEdit && skipAtomic(doc, Pos(doc.firstLine(), 0))) doc.cantEdit = false;
    }
    // Handle the interaction of a change to a document with the editor
    // that this document is part of.
    function makeChangeSingleDocInEditor(cm, change, spans) {
        var doc = cm.doc, display = cm.display, from = change.from, to = change.to;
        var recomputeMaxLength = false, checkWidthStart = from.line;
        if (!cm.options.lineWrapping) {
            checkWidthStart = lineNo(visualLine(getLine(doc, from.line)));
            doc.iter(checkWidthStart, to.line + 1, function(line) {
                if (line == display.maxLine) {
                    recomputeMaxLength = true;
                    return true;
                }
            });
        }
        if (doc.sel.contains(change.from, change.to) > -1) signalCursorActivity(cm);
        updateDoc(doc, change, spans, estimateHeight(cm));
        if (!cm.options.lineWrapping) {
            doc.iter(checkWidthStart, from.line + change.text.length, function(line) {
                var len = lineLength(line);
                if (len > display.maxLineLength) {
                    display.maxLine = line;
                    display.maxLineLength = len;
                    display.maxLineChanged = true;
                    recomputeMaxLength = false;
                }
            });
            if (recomputeMaxLength) cm.curOp.updateMaxLine = true;
        }
        retreatFrontier(doc, from.line);
        startWorker(cm, 400);
        var lendiff = change.text.length - (to.line - from.line) - 1;
        // Remember that these lines changed, for updating the display
        if (change.full) regChange(cm);
        else if (from.line == to.line && change.text.length == 1 && !isWholeLineUpdate(cm.doc, change)) regLineChange(cm, from.line, "text");
        else regChange(cm, from.line, to.line + 1, lendiff);
        var changesHandler = hasHandler(cm, "changes"), changeHandler = hasHandler(cm, "change");
        if (changeHandler || changesHandler) {
            var obj = {
                from: from,
                to: to,
                text: change.text,
                removed: change.removed,
                origin: change.origin
            };
            if (changeHandler) signalLater(cm, "change", cm, obj);
            if (changesHandler) (cm.curOp.changeObjs || (cm.curOp.changeObjs = [])).push(obj);
        }
        cm.display.selForContextMenu = null;
    }
    function replaceRange(doc, code, from, to, origin) {
        var assign;
        if (!to) to = from;
        if (cmp(to, from) < 0) assign = [
            to,
            from
        ], from = assign[0], to = assign[1];
        if (typeof code == "string") code = doc.splitLines(code);
        makeChange(doc, {
            from: from,
            to: to,
            text: code,
            origin: origin
        });
    }
    // Rebasing/resetting history to deal with externally-sourced changes
    function rebaseHistSelSingle(pos, from, to, diff) {
        if (to < pos.line) pos.line += diff;
        else if (from < pos.line) {
            pos.line = from;
            pos.ch = 0;
        }
    }
    // Tries to rebase an array of history events given a change in the
    // document. If the change touches the same lines as the event, the
    // event, and everything 'behind' it, is discarded. If the change is
    // before the event, the event's positions are updated. Uses a
    // copy-on-write scheme for the positions, to avoid having to
    // reallocate them all on every rebase, but also avoid problems with
    // shared position objects being unsafely updated.
    function rebaseHistArray(array, from, to, diff) {
        for(var i = 0; i < array.length; ++i){
            var sub = array[i], ok = true;
            if (sub.ranges) {
                if (!sub.copied) {
                    sub = array[i] = sub.deepCopy();
                    sub.copied = true;
                }
                for(var j = 0; j < sub.ranges.length; j++){
                    rebaseHistSelSingle(sub.ranges[j].anchor, from, to, diff);
                    rebaseHistSelSingle(sub.ranges[j].head, from, to, diff);
                }
                continue;
            }
            for(var j$1 = 0; j$1 < sub.changes.length; ++j$1){
                var cur = sub.changes[j$1];
                if (to < cur.from.line) {
                    cur.from = Pos(cur.from.line + diff, cur.from.ch);
                    cur.to = Pos(cur.to.line + diff, cur.to.ch);
                } else if (from <= cur.to.line) {
                    ok = false;
                    break;
                }
            }
            if (!ok) {
                array.splice(0, i + 1);
                i = 0;
            }
        }
    }
    function rebaseHist(hist, change) {
        var from = change.from.line, to = change.to.line, diff = change.text.length - (to - from) - 1;
        rebaseHistArray(hist.done, from, to, diff);
        rebaseHistArray(hist.undone, from, to, diff);
    }
    // Utility for applying a change to a line by handle or number,
    // returning the number and optionally registering the line as
    // changed.
    function changeLine(doc, handle, changeType, op) {
        var no = handle, line = handle;
        if (typeof handle == "number") line = getLine(doc, clipLine(doc, handle));
        else no = lineNo(handle);
        if (no == null) return null;
        if (op(line, no) && doc.cm) regLineChange(doc.cm, no, changeType);
        return line;
    }
    // The document is represented as a BTree consisting of leaves, with
    // chunk of lines in them, and branches, with up to ten leaves or
    // other branch nodes below them. The top node is always a branch
    // node, and is the document object itself (meaning it has
    // additional methods and properties).
    //
    // All nodes have parent links. The tree is used both to go from
    // line numbers to line objects, and to go from objects to numbers.
    // It also indexes by height, and is used to convert between height
    // and line object, and to find the total height of the document.
    //
    // See also http://marijnhaverbeke.nl/blog/codemirror-line-tree.html
    function LeafChunk(lines) {
        this.lines = lines;
        this.parent = null;
        var height = 0;
        for(var i = 0; i < lines.length; ++i){
            lines[i].parent = this;
            height += lines[i].height;
        }
        this.height = height;
    }
    LeafChunk.prototype = {
        chunkSize: function() {
            return this.lines.length;
        },
        // Remove the n lines at offset 'at'.
        removeInner: function(at, n) {
            for(var i = at, e = at + n; i < e; ++i){
                var line = this.lines[i];
                this.height -= line.height;
                cleanUpLine(line);
                signalLater(line, "delete");
            }
            this.lines.splice(at, n);
        },
        // Helper used to collapse a small branch into a single leaf.
        collapse: function(lines) {
            lines.push.apply(lines, this.lines);
        },
        // Insert the given array of lines at offset 'at', count them as
        // having the given height.
        insertInner: function(at, lines, height) {
            this.height += height;
            this.lines = this.lines.slice(0, at).concat(lines).concat(this.lines.slice(at));
            for(var i = 0; i < lines.length; ++i)lines[i].parent = this;
        },
        // Used to iterate over a part of the tree.
        iterN: function(at, n, op) {
            for(var e = at + n; at < e; ++at){
                if (op(this.lines[at])) return true;
            }
        }
    };
    function BranchChunk(children) {
        this.children = children;
        var size = 0, height = 0;
        for(var i = 0; i < children.length; ++i){
            var ch = children[i];
            size += ch.chunkSize();
            height += ch.height;
            ch.parent = this;
        }
        this.size = size;
        this.height = height;
        this.parent = null;
    }
    BranchChunk.prototype = {
        chunkSize: function() {
            return this.size;
        },
        removeInner: function(at, n) {
            this.size -= n;
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var rm = Math.min(n, sz - at), oldHeight = child.height;
                    child.removeInner(at, rm);
                    this.height -= oldHeight - child.height;
                    if (sz == rm) {
                        this.children.splice(i--, 1);
                        child.parent = null;
                    }
                    if ((n -= rm) == 0) break;
                    at = 0;
                } else at -= sz;
            }
            // If the result is smaller than 25 lines, ensure that it is a
            // single leaf node.
            if (this.size - n < 25 && (this.children.length > 1 || !(this.children[0] instanceof LeafChunk))) {
                var lines = [];
                this.collapse(lines);
                this.children = [
                    new LeafChunk(lines)
                ];
                this.children[0].parent = this;
            }
        },
        collapse: function(lines) {
            for(var i = 0; i < this.children.length; ++i)this.children[i].collapse(lines);
        },
        insertInner: function(at, lines, height) {
            this.size += lines.length;
            this.height += height;
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at <= sz) {
                    child.insertInner(at, lines, height);
                    if (child.lines && child.lines.length > 50) {
                        // To avoid memory thrashing when child.lines is huge (e.g. first view of a large file), it's never spliced.
                        // Instead, small slices are taken. They're taken in order because sequential memory accesses are fastest.
                        var remaining = child.lines.length % 25 + 25;
                        for(var pos = remaining; pos < child.lines.length;){
                            var leaf = new LeafChunk(child.lines.slice(pos, pos += 25));
                            child.height -= leaf.height;
                            this.children.splice(++i, 0, leaf);
                            leaf.parent = this;
                        }
                        child.lines = child.lines.slice(0, remaining);
                        this.maybeSpill();
                    }
                    break;
                }
                at -= sz;
            }
        },
        // When a node has grown, check whether it should be split.
        maybeSpill: function() {
            if (this.children.length <= 10) return;
            var me = this;
            do {
                var spilled = me.children.splice(me.children.length - 5, 5);
                var sibling = new BranchChunk(spilled);
                if (!me.parent) {
                    var copy = new BranchChunk(me.children);
                    copy.parent = me;
                    me.children = [
                        copy,
                        sibling
                    ];
                    me = copy;
                } else {
                    me.size -= sibling.size;
                    me.height -= sibling.height;
                    var myIndex = indexOf(me.parent.children, me);
                    me.parent.children.splice(myIndex + 1, 0, sibling);
                }
                sibling.parent = me.parent;
            }while (me.children.length > 10);
            me.parent.maybeSpill();
        },
        iterN: function(at, n, op) {
            for(var i = 0; i < this.children.length; ++i){
                var child = this.children[i], sz = child.chunkSize();
                if (at < sz) {
                    var used = Math.min(n, sz - at);
                    if (child.iterN(at, used, op)) return true;
                    if ((n -= used) == 0) break;
                    at = 0;
                } else at -= sz;
            }
        }
    };
    // Line widgets are block elements displayed above or below a line.
    var LineWidget = function(doc, node, options) {
        if (options) {
            for(var opt in options)if (options.hasOwnProperty(opt)) this[opt] = options[opt];
        }
        this.doc = doc;
        this.node = node;
    };
    LineWidget.prototype.clear = function() {
        var cm = this.doc.cm, ws = this.line.widgets, line = this.line, no = lineNo(line);
        if (no == null || !ws) return;
        for(var i = 0; i < ws.length; ++i)if (ws[i] == this) ws.splice(i--, 1);
        if (!ws.length) line.widgets = null;
        var height = widgetHeight(this);
        updateLineHeight(line, Math.max(0, line.height - height));
        if (cm) {
            runInOp(cm, function() {
                adjustScrollWhenAboveVisible(cm, line, -height);
                regLineChange(cm, no, "widget");
            });
            signalLater(cm, "lineWidgetCleared", cm, this, no);
        }
    };
    LineWidget.prototype.changed = function() {
        var this$1 = this;
        var oldH = this.height, cm = this.doc.cm, line = this.line;
        this.height = null;
        var diff = widgetHeight(this) - oldH;
        if (!diff) return;
        if (!lineIsHidden(this.doc, line)) updateLineHeight(line, line.height + diff);
        if (cm) runInOp(cm, function() {
            cm.curOp.forceUpdate = true;
            adjustScrollWhenAboveVisible(cm, line, diff);
            signalLater(cm, "lineWidgetChanged", cm, this$1, lineNo(line));
        });
    };
    eventMixin(LineWidget);
    function adjustScrollWhenAboveVisible(cm, line, diff) {
        if (heightAtLine(line) < (cm.curOp && cm.curOp.scrollTop || cm.doc.scrollTop)) addToScrollTop(cm, diff);
    }
    function addLineWidget(doc, handle, node, options) {
        var widget = new LineWidget(doc, node, options);
        var cm = doc.cm;
        if (cm && widget.noHScroll) cm.display.alignWidgets = true;
        changeLine(doc, handle, "widget", function(line) {
            var widgets = line.widgets || (line.widgets = []);
            if (widget.insertAt == null) widgets.push(widget);
            else widgets.splice(Math.min(widgets.length, Math.max(0, widget.insertAt)), 0, widget);
            widget.line = line;
            if (cm && !lineIsHidden(doc, line)) {
                var aboveVisible = heightAtLine(line) < doc.scrollTop;
                updateLineHeight(line, line.height + widgetHeight(widget));
                if (aboveVisible) addToScrollTop(cm, widget.height);
                cm.curOp.forceUpdate = true;
            }
            return true;
        });
        if (cm) signalLater(cm, "lineWidgetAdded", cm, widget, typeof handle == "number" ? handle : lineNo(handle));
        return widget;
    }
    // TEXTMARKERS
    // Created with markText and setBookmark methods. A TextMarker is a
    // handle that can be used to clear or find a marked position in the
    // document. Line objects hold arrays (markedSpans) containing
    // {from, to, marker} object pointing to such marker objects, and
    // indicating that such a marker is present on that line. Multiple
    // lines may point to the same marker when it spans across lines.
    // The spans will have null for their from/to properties when the
    // marker continues beyond the start/end of the line. Markers have
    // links back to the lines they currently touch.
    // Collapsed markers have unique ids, in order to be able to order
    // them, which is needed for uniquely determining an outer marker
    // when they overlap (they may nest, but not partially overlap).
    var nextMarkerId = 0;
    var TextMarker = function(doc, type) {
        this.lines = [];
        this.type = type;
        this.doc = doc;
        this.id = ++nextMarkerId;
    };
    // Clear the marker.
    TextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) return;
        var cm = this.doc.cm, withOp = cm && !cm.curOp;
        if (withOp) startOperation(cm);
        if (hasHandler(this, "clear")) {
            var found = this.find();
            if (found) signalLater(this, "clear", found.from, found.to);
        }
        var min = null, max = null;
        for(var i = 0; i < this.lines.length; ++i){
            var line = this.lines[i];
            var span = getMarkedSpanFor(line.markedSpans, this);
            if (cm && !this.collapsed) regLineChange(cm, lineNo(line), "text");
            else if (cm) {
                if (span.to != null) max = lineNo(line);
                if (span.from != null) min = lineNo(line);
            }
            line.markedSpans = removeMarkedSpan(line.markedSpans, span);
            if (span.from == null && this.collapsed && !lineIsHidden(this.doc, line) && cm) updateLineHeight(line, textHeight(cm.display));
        }
        if (cm && this.collapsed && !cm.options.lineWrapping) for(var i$1 = 0; i$1 < this.lines.length; ++i$1){
            var visual = visualLine(this.lines[i$1]), len = lineLength(visual);
            if (len > cm.display.maxLineLength) {
                cm.display.maxLine = visual;
                cm.display.maxLineLength = len;
                cm.display.maxLineChanged = true;
            }
        }
        if (min != null && cm && this.collapsed) regChange(cm, min, max + 1);
        this.lines.length = 0;
        this.explicitlyCleared = true;
        if (this.atomic && this.doc.cantEdit) {
            this.doc.cantEdit = false;
            if (cm) reCheckSelection(cm.doc);
        }
        if (cm) signalLater(cm, "markerCleared", cm, this, min, max);
        if (withOp) endOperation(cm);
        if (this.parent) this.parent.clear();
    };
    // Find the position of the marker in the document. Returns a {from,
    // to} object by default. Side can be passed to get a specific side
    // -- 0 (both), -1 (left), or 1 (right). When lineObj is true, the
    // Pos objects returned contain a line object, rather than a line
    // number (used to prevent looking up the same line twice).
    TextMarker.prototype.find = function(side, lineObj) {
        if (side == null && this.type == "bookmark") side = 1;
        var from, to;
        for(var i = 0; i < this.lines.length; ++i){
            var line = this.lines[i];
            var span = getMarkedSpanFor(line.markedSpans, this);
            if (span.from != null) {
                from = Pos(lineObj ? line : lineNo(line), span.from);
                if (side == -1) return from;
            }
            if (span.to != null) {
                to = Pos(lineObj ? line : lineNo(line), span.to);
                if (side == 1) return to;
            }
        }
        return from && {
            from: from,
            to: to
        };
    };
    // Signals that the marker's widget changed, and surrounding layout
    // should be recomputed.
    TextMarker.prototype.changed = function() {
        var this$1 = this;
        var pos = this.find(-1, true), widget = this, cm = this.doc.cm;
        if (!pos || !cm) return;
        runInOp(cm, function() {
            var line = pos.line, lineN = lineNo(pos.line);
            var view = findViewForLine(cm, lineN);
            if (view) {
                clearLineMeasurementCacheFor(view);
                cm.curOp.selectionChanged = cm.curOp.forceUpdate = true;
            }
            cm.curOp.updateMaxLine = true;
            if (!lineIsHidden(widget.doc, line) && widget.height != null) {
                var oldHeight = widget.height;
                widget.height = null;
                var dHeight = widgetHeight(widget) - oldHeight;
                if (dHeight) updateLineHeight(line, line.height + dHeight);
            }
            signalLater(cm, "markerChanged", cm, this$1);
        });
    };
    TextMarker.prototype.attachLine = function(line) {
        if (!this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            if (!op.maybeHiddenMarkers || indexOf(op.maybeHiddenMarkers, this) == -1) (op.maybeUnhiddenMarkers || (op.maybeUnhiddenMarkers = [])).push(this);
        }
        this.lines.push(line);
    };
    TextMarker.prototype.detachLine = function(line) {
        this.lines.splice(indexOf(this.lines, line), 1);
        if (!this.lines.length && this.doc.cm) {
            var op = this.doc.cm.curOp;
            (op.maybeHiddenMarkers || (op.maybeHiddenMarkers = [])).push(this);
        }
    };
    eventMixin(TextMarker);
    // Create a marker, wire it up to the right lines, and
    function markText(doc, from, to, options, type) {
        // Shared markers (across linked documents) are handled separately
        // (markTextShared will call out to this again, once per
        // document).
        if (options && options.shared) return markTextShared(doc, from, to, options, type);
        // Ensure we are in an operation.
        if (doc.cm && !doc.cm.curOp) return operation(doc.cm, markText)(doc, from, to, options, type);
        var marker = new TextMarker(doc, type), diff = cmp(from, to);
        if (options) copyObj(options, marker, false);
        // Don't connect empty markers unless clearWhenEmpty is false
        if (diff > 0 || diff == 0 && marker.clearWhenEmpty !== false) return marker;
        if (marker.replacedWith) {
            // Showing up as a widget implies collapsed (widget replaces text)
            marker.collapsed = true;
            marker.widgetNode = eltP("span", [
                marker.replacedWith
            ], "CodeMirror-widget");
            if (!options.handleMouseEvents) marker.widgetNode.setAttribute("cm-ignore-events", "true");
            if (options.insertLeft) marker.widgetNode.insertLeft = true;
        }
        if (marker.collapsed) {
            if (conflictingCollapsedRange(doc, from.line, from, to, marker) || from.line != to.line && conflictingCollapsedRange(doc, to.line, from, to, marker)) throw new Error("Inserting collapsed marker partially overlapping an existing one");
            seeCollapsedSpans();
        }
        if (marker.addToHistory) addChangeToHistory(doc, {
            from: from,
            to: to,
            origin: "markText"
        }, doc.sel, NaN);
        var curLine = from.line, cm = doc.cm, updateMaxLine;
        doc.iter(curLine, to.line + 1, function(line) {
            if (cm && marker.collapsed && !cm.options.lineWrapping && visualLine(line) == cm.display.maxLine) updateMaxLine = true;
            if (marker.collapsed && curLine != from.line) updateLineHeight(line, 0);
            addMarkedSpan(line, new MarkedSpan(marker, curLine == from.line ? from.ch : null, curLine == to.line ? to.ch : null), doc.cm && doc.cm.curOp);
            ++curLine;
        });
        // lineIsHidden depends on the presence of the spans, so needs a second pass
        if (marker.collapsed) doc.iter(from.line, to.line + 1, function(line) {
            if (lineIsHidden(doc, line)) updateLineHeight(line, 0);
        });
        if (marker.clearOnEnter) on(marker, "beforeCursorEnter", function() {
            return marker.clear();
        });
        if (marker.readOnly) {
            seeReadOnlySpans();
            if (doc.history.done.length || doc.history.undone.length) doc.clearHistory();
        }
        if (marker.collapsed) {
            marker.id = ++nextMarkerId;
            marker.atomic = true;
        }
        if (cm) {
            // Sync editor state
            if (updateMaxLine) cm.curOp.updateMaxLine = true;
            if (marker.collapsed) regChange(cm, from.line, to.line + 1);
            else if (marker.className || marker.startStyle || marker.endStyle || marker.css || marker.attributes || marker.title) for(var i = from.line; i <= to.line; i++)regLineChange(cm, i, "text");
            if (marker.atomic) reCheckSelection(cm.doc);
            signalLater(cm, "markerAdded", cm, marker);
        }
        return marker;
    }
    // SHARED TEXTMARKERS
    // A shared marker spans multiple linked documents. It is
    // implemented as a meta-marker-object controlling multiple normal
    // markers.
    var SharedTextMarker = function(markers, primary) {
        this.markers = markers;
        this.primary = primary;
        for(var i = 0; i < markers.length; ++i)markers[i].parent = this;
    };
    SharedTextMarker.prototype.clear = function() {
        if (this.explicitlyCleared) return;
        this.explicitlyCleared = true;
        for(var i = 0; i < this.markers.length; ++i)this.markers[i].clear();
        signalLater(this, "clear");
    };
    SharedTextMarker.prototype.find = function(side, lineObj) {
        return this.primary.find(side, lineObj);
    };
    eventMixin(SharedTextMarker);
    function markTextShared(doc, from, to, options, type) {
        options = copyObj(options);
        options.shared = false;
        var markers = [
            markText(doc, from, to, options, type)
        ], primary = markers[0];
        var widget = options.widgetNode;
        linkedDocs(doc, function(doc) {
            if (widget) options.widgetNode = widget.cloneNode(true);
            markers.push(markText(doc, clipPos(doc, from), clipPos(doc, to), options, type));
            for(var i = 0; i < doc.linked.length; ++i){
                if (doc.linked[i].isParent) return;
            }
            primary = lst(markers);
        });
        return new SharedTextMarker(markers, primary);
    }
    function findSharedMarkers(doc) {
        return doc.findMarks(Pos(doc.first, 0), doc.clipPos(Pos(doc.lastLine())), function(m) {
            return m.parent;
        });
    }
    function copySharedMarkers(doc, markers) {
        for(var i = 0; i < markers.length; i++){
            var marker = markers[i], pos = marker.find();
            var mFrom = doc.clipPos(pos.from), mTo = doc.clipPos(pos.to);
            if (cmp(mFrom, mTo)) {
                var subMark = markText(doc, mFrom, mTo, marker.primary, marker.primary.type);
                marker.markers.push(subMark);
                subMark.parent = marker;
            }
        }
    }
    function detachSharedMarkers(markers) {
        var loop = function(i) {
            var marker = markers[i], linked = [
                marker.primary.doc
            ];
            linkedDocs(marker.primary.doc, function(d) {
                return linked.push(d);
            });
            for(var j = 0; j < marker.markers.length; j++){
                var subMarker = marker.markers[j];
                if (indexOf(linked, subMarker.doc) == -1) {
                    subMarker.parent = null;
                    marker.markers.splice(j--, 1);
                }
            }
        };
        for(var i = 0; i < markers.length; i++)loop(i);
    }
    var nextDocId = 0;
    var Doc = function(text, mode, firstLine, lineSep, direction) {
        if (!(this instanceof Doc)) return new Doc(text, mode, firstLine, lineSep, direction);
        if (firstLine == null) firstLine = 0;
        BranchChunk.call(this, [
            new LeafChunk([
                new Line("", null)
            ])
        ]);
        this.first = firstLine;
        this.scrollTop = this.scrollLeft = 0;
        this.cantEdit = false;
        this.cleanGeneration = 1;
        this.modeFrontier = this.highlightFrontier = firstLine;
        var start = Pos(firstLine, 0);
        this.sel = simpleSelection(start);
        this.history = new History(null);
        this.id = ++nextDocId;
        this.modeOption = mode;
        this.lineSep = lineSep;
        this.direction = direction == "rtl" ? "rtl" : "ltr";
        this.extend = false;
        if (typeof text == "string") text = this.splitLines(text);
        updateDoc(this, {
            from: start,
            to: start,
            text: text
        });
        setSelection(this, simpleSelection(start), sel_dontScroll);
    };
    Doc.prototype = createObj(BranchChunk.prototype, {
        constructor: Doc,
        // Iterate over the document. Supports two forms -- with only one
        // argument, it calls that for each line in the document. With
        // three, it iterates over the range given by the first two (with
        // the second being non-inclusive).
        iter: function(from, to, op) {
            if (op) this.iterN(from - this.first, to - from, op);
            else this.iterN(this.first, this.first + this.size, from);
        },
        // Non-public interface for adding and removing lines.
        insert: function(at, lines) {
            var height = 0;
            for(var i = 0; i < lines.length; ++i)height += lines[i].height;
            this.insertInner(at - this.first, lines, height);
        },
        remove: function(at, n) {
            this.removeInner(at - this.first, n);
        },
        // From here, the methods are part of the public interface. Most
        // are also available from CodeMirror (editor) instances.
        getValue: function(lineSep) {
            var lines = getLines(this, this.first, this.first + this.size);
            if (lineSep === false) return lines;
            return lines.join(lineSep || this.lineSeparator());
        },
        setValue: docMethodOp(function(code) {
            var top = Pos(this.first, 0), last = this.first + this.size - 1;
            makeChange(this, {
                from: top,
                to: Pos(last, getLine(this, last).text.length),
                text: this.splitLines(code),
                origin: "setValue",
                full: true
            }, true);
            if (this.cm) scrollToCoords(this.cm, 0, 0);
            setSelection(this, simpleSelection(top), sel_dontScroll);
        }),
        replaceRange: function(code, from, to, origin) {
            from = clipPos(this, from);
            to = to ? clipPos(this, to) : from;
            replaceRange(this, code, from, to, origin);
        },
        getRange: function(from, to, lineSep) {
            var lines = getBetween(this, clipPos(this, from), clipPos(this, to));
            if (lineSep === false) return lines;
            if (lineSep === '') return lines.join('');
            return lines.join(lineSep || this.lineSeparator());
        },
        getLine: function(line) {
            var l = this.getLineHandle(line);
            return l && l.text;
        },
        getLineHandle: function(line) {
            if (isLine(this, line)) return getLine(this, line);
        },
        getLineNumber: function(line) {
            return lineNo(line);
        },
        getLineHandleVisualStart: function(line) {
            if (typeof line == "number") line = getLine(this, line);
            return visualLine(line);
        },
        lineCount: function() {
            return this.size;
        },
        firstLine: function() {
            return this.first;
        },
        lastLine: function() {
            return this.first + this.size - 1;
        },
        clipPos: function(pos) {
            return clipPos(this, pos);
        },
        getCursor: function(start) {
            var range = this.sel.primary(), pos;
            if (start == null || start == "head") pos = range.head;
            else if (start == "anchor") pos = range.anchor;
            else if (start == "end" || start == "to" || start === false) pos = range.to();
            else pos = range.from();
            return pos;
        },
        listSelections: function() {
            return this.sel.ranges;
        },
        somethingSelected: function() {
            return this.sel.somethingSelected();
        },
        setCursor: docMethodOp(function(line, ch, options) {
            setSimpleSelection(this, clipPos(this, typeof line == "number" ? Pos(line, ch || 0) : line), null, options);
        }),
        setSelection: docMethodOp(function(anchor, head, options) {
            setSimpleSelection(this, clipPos(this, anchor), clipPos(this, head || anchor), options);
        }),
        extendSelection: docMethodOp(function(head, other, options) {
            extendSelection(this, clipPos(this, head), other && clipPos(this, other), options);
        }),
        extendSelections: docMethodOp(function(heads, options) {
            extendSelections(this, clipPosArray(this, heads), options);
        }),
        extendSelectionsBy: docMethodOp(function(f, options) {
            var heads = map(this.sel.ranges, f);
            extendSelections(this, clipPosArray(this, heads), options);
        }),
        setSelections: docMethodOp(function(ranges, primary, options) {
            if (!ranges.length) return;
            var out = [];
            for(var i = 0; i < ranges.length; i++)out[i] = new Range(clipPos(this, ranges[i].anchor), clipPos(this, ranges[i].head || ranges[i].anchor));
            if (primary == null) primary = Math.min(ranges.length - 1, this.sel.primIndex);
            setSelection(this, normalizeSelection(this.cm, out, primary), options);
        }),
        addSelection: docMethodOp(function(anchor, head, options) {
            var ranges = this.sel.ranges.slice(0);
            ranges.push(new Range(clipPos(this, anchor), clipPos(this, head || anchor)));
            setSelection(this, normalizeSelection(this.cm, ranges, ranges.length - 1), options);
        }),
        getSelection: function(lineSep) {
            var ranges = this.sel.ranges, lines;
            for(var i = 0; i < ranges.length; i++){
                var sel = getBetween(this, ranges[i].from(), ranges[i].to());
                lines = lines ? lines.concat(sel) : sel;
            }
            if (lineSep === false) return lines;
            else return lines.join(lineSep || this.lineSeparator());
        },
        getSelections: function(lineSep) {
            var parts = [], ranges = this.sel.ranges;
            for(var i = 0; i < ranges.length; i++){
                var sel = getBetween(this, ranges[i].from(), ranges[i].to());
                if (lineSep !== false) sel = sel.join(lineSep || this.lineSeparator());
                parts[i] = sel;
            }
            return parts;
        },
        replaceSelection: function(code, collapse, origin) {
            var dup = [];
            for(var i = 0; i < this.sel.ranges.length; i++)dup[i] = code;
            this.replaceSelections(dup, collapse, origin || "+input");
        },
        replaceSelections: docMethodOp(function(code, collapse, origin) {
            var changes = [], sel = this.sel;
            for(var i = 0; i < sel.ranges.length; i++){
                var range = sel.ranges[i];
                changes[i] = {
                    from: range.from(),
                    to: range.to(),
                    text: this.splitLines(code[i]),
                    origin: origin
                };
            }
            var newSel = collapse && collapse != "end" && computeReplacedSel(this, changes, collapse);
            for(var i$1 = changes.length - 1; i$1 >= 0; i$1--)makeChange(this, changes[i$1]);
            if (newSel) setSelectionReplaceHistory(this, newSel);
            else if (this.cm) ensureCursorVisible(this.cm);
        }),
        undo: docMethodOp(function() {
            makeChangeFromHistory(this, "undo");
        }),
        redo: docMethodOp(function() {
            makeChangeFromHistory(this, "redo");
        }),
        undoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "undo", true);
        }),
        redoSelection: docMethodOp(function() {
            makeChangeFromHistory(this, "redo", true);
        }),
        setExtending: function(val) {
            this.extend = val;
        },
        getExtending: function() {
            return this.extend;
        },
        historySize: function() {
            var hist = this.history, done = 0, undone = 0;
            for(var i = 0; i < hist.done.length; i++)if (!hist.done[i].ranges) ++done;
            for(var i$1 = 0; i$1 < hist.undone.length; i$1++)if (!hist.undone[i$1].ranges) ++undone;
            return {
                undo: done,
                redo: undone
            };
        },
        clearHistory: function() {
            var this$1 = this;
            this.history = new History(this.history);
            linkedDocs(this, function(doc) {
                return doc.history = this$1.history;
            }, true);
        },
        markClean: function() {
            this.cleanGeneration = this.changeGeneration(true);
        },
        changeGeneration: function(forceSplit) {
            if (forceSplit) this.history.lastOp = this.history.lastSelOp = this.history.lastOrigin = null;
            return this.history.generation;
        },
        isClean: function(gen) {
            return this.history.generation == (gen || this.cleanGeneration);
        },
        getHistory: function() {
            return {
                done: copyHistoryArray(this.history.done),
                undone: copyHistoryArray(this.history.undone)
            };
        },
        setHistory: function(histData) {
            var hist = this.history = new History(this.history);
            hist.done = copyHistoryArray(histData.done.slice(0), null, true);
            hist.undone = copyHistoryArray(histData.undone.slice(0), null, true);
        },
        setGutterMarker: docMethodOp(function(line, gutterID, value) {
            return changeLine(this, line, "gutter", function(line) {
                var markers = line.gutterMarkers || (line.gutterMarkers = {});
                markers[gutterID] = value;
                if (!value && isEmpty(markers)) line.gutterMarkers = null;
                return true;
            });
        }),
        clearGutter: docMethodOp(function(gutterID) {
            var this$1 = this;
            this.iter(function(line) {
                if (line.gutterMarkers && line.gutterMarkers[gutterID]) changeLine(this$1, line, "gutter", function() {
                    line.gutterMarkers[gutterID] = null;
                    if (isEmpty(line.gutterMarkers)) line.gutterMarkers = null;
                    return true;
                });
            });
        }),
        lineInfo: function(line) {
            var n;
            if (typeof line == "number") {
                if (!isLine(this, line)) return null;
                n = line;
                line = getLine(this, line);
                if (!line) return null;
            } else {
                n = lineNo(line);
                if (n == null) return null;
            }
            return {
                line: n,
                handle: line,
                text: line.text,
                gutterMarkers: line.gutterMarkers,
                textClass: line.textClass,
                bgClass: line.bgClass,
                wrapClass: line.wrapClass,
                widgets: line.widgets
            };
        },
        addLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
                var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
                if (!line[prop]) line[prop] = cls;
                else if (classTest(cls).test(line[prop])) return false;
                else line[prop] += " " + cls;
                return true;
            });
        }),
        removeLineClass: docMethodOp(function(handle, where, cls) {
            return changeLine(this, handle, where == "gutter" ? "gutter" : "class", function(line) {
                var prop = where == "text" ? "textClass" : where == "background" ? "bgClass" : where == "gutter" ? "gutterClass" : "wrapClass";
                var cur = line[prop];
                if (!cur) return false;
                else if (cls == null) line[prop] = null;
                else {
                    var found = cur.match(classTest(cls));
                    if (!found) return false;
                    var end = found.index + found[0].length;
                    line[prop] = cur.slice(0, found.index) + (!found.index || end == cur.length ? "" : " ") + cur.slice(end) || null;
                }
                return true;
            });
        }),
        addLineWidget: docMethodOp(function(handle, node, options) {
            return addLineWidget(this, handle, node, options);
        }),
        removeLineWidget: function(widget) {
            widget.clear();
        },
        markText: function(from, to, options) {
            return markText(this, clipPos(this, from), clipPos(this, to), options, options && options.type || "range");
        },
        setBookmark: function(pos, options) {
            var realOpts = {
                replacedWith: options && (options.nodeType == null ? options.widget : options),
                insertLeft: options && options.insertLeft,
                clearWhenEmpty: false,
                shared: options && options.shared,
                handleMouseEvents: options && options.handleMouseEvents
            };
            pos = clipPos(this, pos);
            return markText(this, pos, pos, realOpts, "bookmark");
        },
        findMarksAt: function(pos) {
            pos = clipPos(this, pos);
            var markers = [], spans = getLine(this, pos.line).markedSpans;
            if (spans) for(var i = 0; i < spans.length; ++i){
                var span = spans[i];
                if ((span.from == null || span.from <= pos.ch) && (span.to == null || span.to >= pos.ch)) markers.push(span.marker.parent || span.marker);
            }
            return markers;
        },
        findMarks: function(from, to, filter) {
            from = clipPos(this, from);
            to = clipPos(this, to);
            var found = [], lineNo = from.line;
            this.iter(from.line, to.line + 1, function(line) {
                var spans = line.markedSpans;
                if (spans) for(var i = 0; i < spans.length; i++){
                    var span = spans[i];
                    if (!(span.to != null && lineNo == from.line && from.ch >= span.to || span.from == null && lineNo != from.line || span.from != null && lineNo == to.line && span.from >= to.ch) && (!filter || filter(span.marker))) found.push(span.marker.parent || span.marker);
                }
                ++lineNo;
            });
            return found;
        },
        getAllMarks: function() {
            var markers = [];
            this.iter(function(line) {
                var sps = line.markedSpans;
                if (sps) {
                    for(var i = 0; i < sps.length; ++i)if (sps[i].from != null) markers.push(sps[i].marker);
                }
            });
            return markers;
        },
        posFromIndex: function(off) {
            var ch, lineNo = this.first, sepSize = this.lineSeparator().length;
            this.iter(function(line) {
                var sz = line.text.length + sepSize;
                if (sz > off) {
                    ch = off;
                    return true;
                }
                off -= sz;
                ++lineNo;
            });
            return clipPos(this, Pos(lineNo, ch));
        },
        indexFromPos: function(coords) {
            coords = clipPos(this, coords);
            var index = coords.ch;
            if (coords.line < this.first || coords.ch < 0) return 0;
            var sepSize = this.lineSeparator().length;
            this.iter(this.first, coords.line, function(line) {
                index += line.text.length + sepSize;
            });
            return index;
        },
        copy: function(copyHistory) {
            var doc = new Doc(getLines(this, this.first, this.first + this.size), this.modeOption, this.first, this.lineSep, this.direction);
            doc.scrollTop = this.scrollTop;
            doc.scrollLeft = this.scrollLeft;
            doc.sel = this.sel;
            doc.extend = false;
            if (copyHistory) {
                doc.history.undoDepth = this.history.undoDepth;
                doc.setHistory(this.getHistory());
            }
            return doc;
        },
        linkedDoc: function(options) {
            if (!options) options = {};
            var from = this.first, to = this.first + this.size;
            if (options.from != null && options.from > from) from = options.from;
            if (options.to != null && options.to < to) to = options.to;
            var copy = new Doc(getLines(this, from, to), options.mode || this.modeOption, from, this.lineSep, this.direction);
            if (options.sharedHist) copy.history = this.history;
            (this.linked || (this.linked = [])).push({
                doc: copy,
                sharedHist: options.sharedHist
            });
            copy.linked = [
                {
                    doc: this,
                    isParent: true,
                    sharedHist: options.sharedHist
                }
            ];
            copySharedMarkers(copy, findSharedMarkers(this));
            return copy;
        },
        unlinkDoc: function(other) {
            if (other instanceof CodeMirror) other = other.doc;
            if (this.linked) for(var i = 0; i < this.linked.length; ++i){
                var link = this.linked[i];
                if (link.doc != other) continue;
                this.linked.splice(i, 1);
                other.unlinkDoc(this);
                detachSharedMarkers(findSharedMarkers(this));
                break;
            }
            // If the histories were shared, split them again
            if (other.history == this.history) {
                var splitIds = [
                    other.id
                ];
                linkedDocs(other, function(doc) {
                    return splitIds.push(doc.id);
                }, true);
                other.history = new History(null);
                other.history.done = copyHistoryArray(this.history.done, splitIds);
                other.history.undone = copyHistoryArray(this.history.undone, splitIds);
            }
        },
        iterLinkedDocs: function(f) {
            linkedDocs(this, f);
        },
        getMode: function() {
            return this.mode;
        },
        getEditor: function() {
            return this.cm;
        },
        splitLines: function(str) {
            if (this.lineSep) return str.split(this.lineSep);
            return splitLinesAuto(str);
        },
        lineSeparator: function() {
            return this.lineSep || "\n";
        },
        setDirection: docMethodOp(function(dir) {
            if (dir != "rtl") dir = "ltr";
            if (dir == this.direction) return;
            this.direction = dir;
            this.iter(function(line) {
                return line.order = null;
            });
            if (this.cm) directionChanged(this.cm);
        })
    });
    // Public alias.
    Doc.prototype.eachLine = Doc.prototype.iter;
    // Kludge to work around strange IE behavior where it'll sometimes
    // re-fire a series of drag-related events right after the drop (#1551)
    var lastDrop = 0;
    function onDrop(e) {
        var cm = this;
        clearDragCursor(cm);
        if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;
        e_preventDefault(e);
        if (ie) lastDrop = +new Date;
        var pos = posFromMouse(cm, e, true), files = e.dataTransfer.files;
        if (!pos || cm.isReadOnly()) return;
        // Might be a file drop, in which case we simply extract the text
        // and insert it.
        if (files && files.length && window.FileReader && window.File) {
            var n = files.length, text = Array(n), read = 0;
            var markAsReadAndPasteIfAllFilesAreRead = function() {
                if (++read == n) operation(cm, function() {
                    pos = clipPos(cm.doc, pos);
                    var change = {
                        from: pos,
                        to: pos,
                        text: cm.doc.splitLines(text.filter(function(t) {
                            return t != null;
                        }).join(cm.doc.lineSeparator())),
                        origin: "paste"
                    };
                    makeChange(cm.doc, change);
                    setSelectionReplaceHistory(cm.doc, simpleSelection(clipPos(cm.doc, pos), clipPos(cm.doc, changeEnd(change))));
                })();
            };
            var readTextFromFile = function(file, i) {
                if (cm.options.allowDropFileTypes && indexOf(cm.options.allowDropFileTypes, file.type) == -1) {
                    markAsReadAndPasteIfAllFilesAreRead();
                    return;
                }
                var reader = new FileReader;
                reader.onerror = function() {
                    return markAsReadAndPasteIfAllFilesAreRead();
                };
                reader.onload = function() {
                    var content = reader.result;
                    if (/[\x00-\x08\x0e-\x1f]{2}/.test(content)) {
                        markAsReadAndPasteIfAllFilesAreRead();
                        return;
                    }
                    text[i] = content;
                    markAsReadAndPasteIfAllFilesAreRead();
                };
                reader.readAsText(file);
            };
            for(var i = 0; i < files.length; i++)readTextFromFile(files[i], i);
        } else {
            // Don't do a replace if the drop happened inside of the selected text.
            if (cm.state.draggingText && cm.doc.sel.contains(pos) > -1) {
                cm.state.draggingText(e);
                // Ensure the editor is re-focused
                setTimeout(function() {
                    return cm.display.input.focus();
                }, 20);
                return;
            }
            try {
                var text$1 = e.dataTransfer.getData("Text");
                if (text$1) {
                    var selected;
                    if (cm.state.draggingText && !cm.state.draggingText.copy) selected = cm.listSelections();
                    setSelectionNoUndo(cm.doc, simpleSelection(pos, pos));
                    if (selected) for(var i$1 = 0; i$1 < selected.length; ++i$1)replaceRange(cm.doc, "", selected[i$1].anchor, selected[i$1].head, "drag");
                    cm.replaceSelection(text$1, "around", "paste");
                    cm.display.input.focus();
                }
            } catch (e$1) {}
        }
    }
    function onDragStart(cm, e) {
        if (ie && (!cm.state.draggingText || +new Date - lastDrop < 100)) {
            e_stop(e);
            return;
        }
        if (signalDOMEvent(cm, e) || eventInWidget(cm.display, e)) return;
        e.dataTransfer.setData("Text", cm.getSelection());
        e.dataTransfer.effectAllowed = "copyMove";
        // Use dummy image instead of default browsers image.
        // Recent Safari (~6.0.2) have a tendency to segfault when this happens, so we don't do it there.
        if (e.dataTransfer.setDragImage && !safari) {
            var img = elt("img", null, null, "position: fixed; left: 0; top: 0;");
            img.src = "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
            if (presto) {
                img.width = img.height = 1;
                cm.display.wrapper.appendChild(img);
                // Force a relayout, or Opera won't use our image for some obscure reason
                img._top = img.offsetTop;
            }
            e.dataTransfer.setDragImage(img, 0, 0);
            if (presto) img.parentNode.removeChild(img);
        }
    }
    function onDragOver(cm, e) {
        var pos = posFromMouse(cm, e);
        if (!pos) return;
        var frag = document.createDocumentFragment();
        drawSelectionCursor(cm, pos, frag);
        if (!cm.display.dragCursor) {
            cm.display.dragCursor = elt("div", null, "CodeMirror-cursors CodeMirror-dragcursors");
            cm.display.lineSpace.insertBefore(cm.display.dragCursor, cm.display.cursorDiv);
        }
        removeChildrenAndAdd(cm.display.dragCursor, frag);
    }
    function clearDragCursor(cm) {
        if (cm.display.dragCursor) {
            cm.display.lineSpace.removeChild(cm.display.dragCursor);
            cm.display.dragCursor = null;
        }
    }
    // These must be handled carefully, because naively registering a
    // handler for each editor will cause the editors to never be
    // garbage collected.
    function forEachCodeMirror(f) {
        if (!document.getElementsByClassName) return;
        var byClass = document.getElementsByClassName("CodeMirror"), editors = [];
        for(var i = 0; i < byClass.length; i++){
            var cm = byClass[i].CodeMirror;
            if (cm) editors.push(cm);
        }
        if (editors.length) editors[0].operation(function() {
            for(var i = 0; i < editors.length; i++)f(editors[i]);
        });
    }
    var globalsRegistered = false;
    function ensureGlobalHandlers() {
        if (globalsRegistered) return;
        registerGlobalHandlers();
        globalsRegistered = true;
    }
    function registerGlobalHandlers() {
        // When the window resizes, we need to refresh active editors.
        var resizeTimer;
        on(window, "resize", function() {
            if (resizeTimer == null) resizeTimer = setTimeout(function() {
                resizeTimer = null;
                forEachCodeMirror(onResize);
            }, 100);
        });
        // When the window loses focus, we want to show the editor as blurred
        on(window, "blur", function() {
            return forEachCodeMirror(onBlur);
        });
    }
    // Called when the window resizes
    function onResize(cm) {
        var d = cm.display;
        // Might be a text scaling operation, clear size caches.
        d.cachedCharWidth = d.cachedTextHeight = d.cachedPaddingH = null;
        d.scrollbarsClipped = false;
        cm.setSize();
    }
    var keyNames = {
        3: "Pause",
        8: "Backspace",
        9: "Tab",
        13: "Enter",
        16: "Shift",
        17: "Ctrl",
        18: "Alt",
        19: "Pause",
        20: "CapsLock",
        27: "Esc",
        32: "Space",
        33: "PageUp",
        34: "PageDown",
        35: "End",
        36: "Home",
        37: "Left",
        38: "Up",
        39: "Right",
        40: "Down",
        44: "PrintScrn",
        45: "Insert",
        46: "Delete",
        59: ";",
        61: "=",
        91: "Mod",
        92: "Mod",
        93: "Mod",
        106: "*",
        107: "=",
        109: "-",
        110: ".",
        111: "/",
        145: "ScrollLock",
        173: "-",
        186: ";",
        187: "=",
        188: ",",
        189: "-",
        190: ".",
        191: "/",
        192: "`",
        219: "[",
        220: "\\",
        221: "]",
        222: "'",
        224: "Mod",
        63232: "Up",
        63233: "Down",
        63234: "Left",
        63235: "Right",
        63272: "Delete",
        63273: "Home",
        63275: "End",
        63276: "PageUp",
        63277: "PageDown",
        63302: "Insert"
    };
    // Number keys
    for(var i = 0; i < 10; i++)keyNames[i + 48] = keyNames[i + 96] = String(i);
    // Alphabetic keys
    for(var i$1 = 65; i$1 <= 90; i$1++)keyNames[i$1] = String.fromCharCode(i$1);
    // Function keys
    for(var i$2 = 1; i$2 <= 12; i$2++)keyNames[i$2 + 111] = keyNames[i$2 + 63235] = "F" + i$2;
    var keyMap = {};
    keyMap.basic = {
        "Left": "goCharLeft",
        "Right": "goCharRight",
        "Up": "goLineUp",
        "Down": "goLineDown",
        "End": "goLineEnd",
        "Home": "goLineStartSmart",
        "PageUp": "goPageUp",
        "PageDown": "goPageDown",
        "Delete": "delCharAfter",
        "Backspace": "delCharBefore",
        "Shift-Backspace": "delCharBefore",
        "Tab": "defaultTab",
        "Shift-Tab": "indentAuto",
        "Enter": "newlineAndIndent",
        "Insert": "toggleOverwrite",
        "Esc": "singleSelection"
    };
    // Note that the save and find-related commands aren't defined by
    // default. User code or addons can define them. Unknown commands
    // are simply ignored.
    keyMap.pcDefault = {
        "Ctrl-A": "selectAll",
        "Ctrl-D": "deleteLine",
        "Ctrl-Z": "undo",
        "Shift-Ctrl-Z": "redo",
        "Ctrl-Y": "redo",
        "Ctrl-Home": "goDocStart",
        "Ctrl-End": "goDocEnd",
        "Ctrl-Up": "goLineUp",
        "Ctrl-Down": "goLineDown",
        "Ctrl-Left": "goGroupLeft",
        "Ctrl-Right": "goGroupRight",
        "Alt-Left": "goLineStart",
        "Alt-Right": "goLineEnd",
        "Ctrl-Backspace": "delGroupBefore",
        "Ctrl-Delete": "delGroupAfter",
        "Ctrl-S": "save",
        "Ctrl-F": "find",
        "Ctrl-G": "findNext",
        "Shift-Ctrl-G": "findPrev",
        "Shift-Ctrl-F": "replace",
        "Shift-Ctrl-R": "replaceAll",
        "Ctrl-[": "indentLess",
        "Ctrl-]": "indentMore",
        "Ctrl-U": "undoSelection",
        "Shift-Ctrl-U": "redoSelection",
        "Alt-U": "redoSelection",
        "fallthrough": "basic"
    };
    // Very basic readline/emacs-style bindings, which are standard on Mac.
    keyMap.emacsy = {
        "Ctrl-F": "goCharRight",
        "Ctrl-B": "goCharLeft",
        "Ctrl-P": "goLineUp",
        "Ctrl-N": "goLineDown",
        "Ctrl-A": "goLineStart",
        "Ctrl-E": "goLineEnd",
        "Ctrl-V": "goPageDown",
        "Shift-Ctrl-V": "goPageUp",
        "Ctrl-D": "delCharAfter",
        "Ctrl-H": "delCharBefore",
        "Alt-Backspace": "delWordBefore",
        "Ctrl-K": "killLine",
        "Ctrl-T": "transposeChars",
        "Ctrl-O": "openLine"
    };
    keyMap.macDefault = {
        "Cmd-A": "selectAll",
        "Cmd-D": "deleteLine",
        "Cmd-Z": "undo",
        "Shift-Cmd-Z": "redo",
        "Cmd-Y": "redo",
        "Cmd-Home": "goDocStart",
        "Cmd-Up": "goDocStart",
        "Cmd-End": "goDocEnd",
        "Cmd-Down": "goDocEnd",
        "Alt-Left": "goGroupLeft",
        "Alt-Right": "goGroupRight",
        "Cmd-Left": "goLineLeft",
        "Cmd-Right": "goLineRight",
        "Alt-Backspace": "delGroupBefore",
        "Ctrl-Alt-Backspace": "delGroupAfter",
        "Alt-Delete": "delGroupAfter",
        "Cmd-S": "save",
        "Cmd-F": "find",
        "Cmd-G": "findNext",
        "Shift-Cmd-G": "findPrev",
        "Cmd-Alt-F": "replace",
        "Shift-Cmd-Alt-F": "replaceAll",
        "Cmd-[": "indentLess",
        "Cmd-]": "indentMore",
        "Cmd-Backspace": "delWrappedLineLeft",
        "Cmd-Delete": "delWrappedLineRight",
        "Cmd-U": "undoSelection",
        "Shift-Cmd-U": "redoSelection",
        "Ctrl-Up": "goDocStart",
        "Ctrl-Down": "goDocEnd",
        "fallthrough": [
            "basic",
            "emacsy"
        ]
    };
    keyMap["default"] = mac ? keyMap.macDefault : keyMap.pcDefault;
    // KEYMAP DISPATCH
    function normalizeKeyName(name) {
        var parts = name.split(/-(?!$)/);
        name = parts[parts.length - 1];
        var alt, ctrl, shift, cmd;
        for(var i = 0; i < parts.length - 1; i++){
            var mod = parts[i];
            if (/^(cmd|meta|m)$/i.test(mod)) cmd = true;
            else if (/^a(lt)?$/i.test(mod)) alt = true;
            else if (/^(c|ctrl|control)$/i.test(mod)) ctrl = true;
            else if (/^s(hift)?$/i.test(mod)) shift = true;
            else throw new Error("Unrecognized modifier name: " + mod);
        }
        if (alt) name = "Alt-" + name;
        if (ctrl) name = "Ctrl-" + name;
        if (cmd) name = "Cmd-" + name;
        if (shift) name = "Shift-" + name;
        return name;
    }
    // This is a kludge to keep keymaps mostly working as raw objects
    // (backwards compatibility) while at the same time support features
    // like normalization and multi-stroke key bindings. It compiles a
    // new normalized keymap, and then updates the old object to reflect
    // this.
    function normalizeKeyMap(keymap) {
        var copy = {};
        for(var keyname in keymap)if (keymap.hasOwnProperty(keyname)) {
            var value = keymap[keyname];
            if (/^(name|fallthrough|(de|at)tach)$/.test(keyname)) continue;
            if (value == "...") {
                delete keymap[keyname];
                continue;
            }
            var keys = map(keyname.split(" "), normalizeKeyName);
            for(var i = 0; i < keys.length; i++){
                var val = void 0, name = void 0;
                if (i == keys.length - 1) {
                    name = keys.join(" ");
                    val = value;
                } else {
                    name = keys.slice(0, i + 1).join(" ");
                    val = "...";
                }
                var prev = copy[name];
                if (!prev) copy[name] = val;
                else if (prev != val) throw new Error("Inconsistent bindings for " + name);
            }
            delete keymap[keyname];
        }
        for(var prop in copy)keymap[prop] = copy[prop];
        return keymap;
    }
    function lookupKey(key, map, handle, context) {
        map = getKeyMap(map);
        var found = map.call ? map.call(key, context) : map[key];
        if (found === false) return "nothing";
        if (found === "...") return "multi";
        if (found != null && handle(found)) return "handled";
        if (map.fallthrough) {
            if (Object.prototype.toString.call(map.fallthrough) != "[object Array]") return lookupKey(key, map.fallthrough, handle, context);
            for(var i = 0; i < map.fallthrough.length; i++){
                var result = lookupKey(key, map.fallthrough[i], handle, context);
                if (result) return result;
            }
        }
    }
    // Modifier key presses don't count as 'real' key presses for the
    // purpose of keymap fallthrough.
    function isModifierKey(value) {
        var name = typeof value == "string" ? value : keyNames[value.keyCode];
        return name == "Ctrl" || name == "Alt" || name == "Shift" || name == "Mod";
    }
    function addModifierNames(name, event, noShift) {
        var base = name;
        if (event.altKey && base != "Alt") name = "Alt-" + name;
        if ((flipCtrlCmd ? event.metaKey : event.ctrlKey) && base != "Ctrl") name = "Ctrl-" + name;
        if ((flipCtrlCmd ? event.ctrlKey : event.metaKey) && base != "Mod") name = "Cmd-" + name;
        if (!noShift && event.shiftKey && base != "Shift") name = "Shift-" + name;
        return name;
    }
    // Look up the name of a key as indicated by an event object.
    function keyName(event, noShift) {
        if (presto && event.keyCode == 34 && event["char"]) return false;
        var name = keyNames[event.keyCode];
        if (name == null || event.altGraphKey) return false;
        // Ctrl-ScrollLock has keyCode 3, same as Ctrl-Pause,
        // so we'll use event.code when available (Chrome 48+, FF 38+, Safari 10.1+)
        if (event.keyCode == 3 && event.code) name = event.code;
        return addModifierNames(name, event, noShift);
    }
    function getKeyMap(val) {
        return typeof val == "string" ? keyMap[val] : val;
    }
    // Helper for deleting text near the selection(s), used to implement
    // backspace, delete, and similar functionality.
    function deleteNearSelection(cm, compute) {
        var ranges = cm.doc.sel.ranges, kill = [];
        // Build up a set of ranges to kill first, merging overlapping
        // ranges.
        for(var i = 0; i < ranges.length; i++){
            var toKill = compute(ranges[i]);
            while(kill.length && cmp(toKill.from, lst(kill).to) <= 0){
                var replaced = kill.pop();
                if (cmp(replaced.from, toKill.from) < 0) {
                    toKill.from = replaced.from;
                    break;
                }
            }
            kill.push(toKill);
        }
        // Next, remove those actual ranges.
        runInOp(cm, function() {
            for(var i = kill.length - 1; i >= 0; i--)replaceRange(cm.doc, "", kill[i].from, kill[i].to, "+delete");
            ensureCursorVisible(cm);
        });
    }
    function moveCharLogically(line, ch, dir) {
        var target = skipExtendingChars(line.text, ch + dir, dir);
        return target < 0 || target > line.text.length ? null : target;
    }
    function moveLogically(line, start, dir) {
        var ch = moveCharLogically(line, start.ch, dir);
        return ch == null ? null : new Pos(start.line, ch, dir < 0 ? "after" : "before");
    }
    function endOfLine(visually, cm, lineObj, lineNo, dir) {
        if (visually) {
            if (cm.doc.direction == "rtl") dir = -dir;
            var order = getOrder(lineObj, cm.doc.direction);
            if (order) {
                var part = dir < 0 ? lst(order) : order[0];
                var moveInStorageOrder = dir < 0 == (part.level == 1);
                var sticky = moveInStorageOrder ? "after" : "before";
                var ch;
                // With a wrapped rtl chunk (possibly spanning multiple bidi parts),
                // it could be that the last bidi part is not on the last visual line,
                // since visual lines contain content order-consecutive chunks.
                // Thus, in rtl, we are looking for the first (content-order) character
                // in the rtl chunk that is on the last line (that is, the same line
                // as the last (content-order) character).
                if (part.level > 0 || cm.doc.direction == "rtl") {
                    var prep = prepareMeasureForLine(cm, lineObj);
                    ch = dir < 0 ? lineObj.text.length - 1 : 0;
                    var targetTop = measureCharPrepared(cm, prep, ch).top;
                    ch = findFirst(function(ch) {
                        return measureCharPrepared(cm, prep, ch).top == targetTop;
                    }, dir < 0 == (part.level == 1) ? part.from : part.to - 1, ch);
                    if (sticky == "before") ch = moveCharLogically(lineObj, ch, 1);
                } else ch = dir < 0 ? part.to : part.from;
                return new Pos(lineNo, ch, sticky);
            }
        }
        return new Pos(lineNo, dir < 0 ? lineObj.text.length : 0, dir < 0 ? "before" : "after");
    }
    function moveVisually(cm, line, start, dir) {
        var bidi = getOrder(line, cm.doc.direction);
        if (!bidi) return moveLogically(line, start, dir);
        if (start.ch >= line.text.length) {
            start.ch = line.text.length;
            start.sticky = "before";
        } else if (start.ch <= 0) {
            start.ch = 0;
            start.sticky = "after";
        }
        var partPos = getBidiPartAt(bidi, start.ch, start.sticky), part = bidi[partPos];
        if (cm.doc.direction == "ltr" && part.level % 2 == 0 && (dir > 0 ? part.to > start.ch : part.from < start.ch)) // Case 1: We move within an ltr part in an ltr editor. Even with wrapped lines,
        // nothing interesting happens.
        return moveLogically(line, start, dir);
        var mv = function(pos, dir) {
            return moveCharLogically(line, pos instanceof Pos ? pos.ch : pos, dir);
        };
        var prep;
        var getWrappedLineExtent = function(ch) {
            if (!cm.options.lineWrapping) return {
                begin: 0,
                end: line.text.length
            };
            prep = prep || prepareMeasureForLine(cm, line);
            return wrappedLineExtentChar(cm, line, prep, ch);
        };
        var wrappedLineExtent = getWrappedLineExtent(start.sticky == "before" ? mv(start, -1) : start.ch);
        if (cm.doc.direction == "rtl" || part.level == 1) {
            var moveInStorageOrder = part.level == 1 == dir < 0;
            var ch = mv(start, moveInStorageOrder ? 1 : -1);
            if (ch != null && (!moveInStorageOrder ? ch >= part.from && ch >= wrappedLineExtent.begin : ch <= part.to && ch <= wrappedLineExtent.end)) {
                // Case 2: We move within an rtl part or in an rtl editor on the same visual line
                var sticky = moveInStorageOrder ? "before" : "after";
                return new Pos(start.line, ch, sticky);
            }
        }
        // Case 3: Could not move within this bidi part in this visual line, so leave
        // the current bidi part
        var searchInVisualLine = function(partPos, dir, wrappedLineExtent) {
            var getRes = function(ch, moveInStorageOrder) {
                return moveInStorageOrder ? new Pos(start.line, mv(ch, 1), "before") : new Pos(start.line, ch, "after");
            };
            for(; partPos >= 0 && partPos < bidi.length; partPos += dir){
                var part = bidi[partPos];
                var moveInStorageOrder = dir > 0 == (part.level != 1);
                var ch = moveInStorageOrder ? wrappedLineExtent.begin : mv(wrappedLineExtent.end, -1);
                if (part.from <= ch && ch < part.to) return getRes(ch, moveInStorageOrder);
                ch = moveInStorageOrder ? part.from : mv(part.to, -1);
                if (wrappedLineExtent.begin <= ch && ch < wrappedLineExtent.end) return getRes(ch, moveInStorageOrder);
            }
        };
        // Case 3a: Look for other bidi parts on the same visual line
        var res = searchInVisualLine(partPos + dir, dir, wrappedLineExtent);
        if (res) return res;
        // Case 3b: Look for other bidi parts on the next visual line
        var nextCh = dir > 0 ? wrappedLineExtent.end : mv(wrappedLineExtent.begin, -1);
        if (nextCh != null && !(dir > 0 && nextCh == line.text.length)) {
            res = searchInVisualLine(dir > 0 ? 0 : bidi.length - 1, dir, getWrappedLineExtent(nextCh));
            if (res) return res;
        }
        // Case 4: Nowhere to move
        return null;
    }
    // Commands are parameter-less actions that can be performed on an
    // editor, mostly used for keybindings.
    var commands = {
        selectAll: selectAll,
        singleSelection: function(cm) {
            return cm.setSelection(cm.getCursor("anchor"), cm.getCursor("head"), sel_dontScroll);
        },
        killLine: function(cm) {
            return deleteNearSelection(cm, function(range) {
                if (range.empty()) {
                    var len = getLine(cm.doc, range.head.line).text.length;
                    if (range.head.ch == len && range.head.line < cm.lastLine()) return {
                        from: range.head,
                        to: Pos(range.head.line + 1, 0)
                    };
                    else return {
                        from: range.head,
                        to: Pos(range.head.line, len)
                    };
                } else return {
                    from: range.from(),
                    to: range.to()
                };
            });
        },
        deleteLine: function(cm) {
            return deleteNearSelection(cm, function(range) {
                return {
                    from: Pos(range.from().line, 0),
                    to: clipPos(cm.doc, Pos(range.to().line + 1, 0))
                };
            });
        },
        delLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range) {
                return {
                    from: Pos(range.from().line, 0),
                    to: range.from()
                };
            });
        },
        delWrappedLineLeft: function(cm) {
            return deleteNearSelection(cm, function(range) {
                var top = cm.charCoords(range.head, "div").top + 5;
                var leftPos = cm.coordsChar({
                    left: 0,
                    top: top
                }, "div");
                return {
                    from: leftPos,
                    to: range.from()
                };
            });
        },
        delWrappedLineRight: function(cm) {
            return deleteNearSelection(cm, function(range) {
                var top = cm.charCoords(range.head, "div").top + 5;
                var rightPos = cm.coordsChar({
                    left: cm.display.lineDiv.offsetWidth + 100,
                    top: top
                }, "div");
                return {
                    from: range.from(),
                    to: rightPos
                };
            });
        },
        undo: function(cm) {
            return cm.undo();
        },
        redo: function(cm) {
            return cm.redo();
        },
        undoSelection: function(cm) {
            return cm.undoSelection();
        },
        redoSelection: function(cm) {
            return cm.redoSelection();
        },
        goDocStart: function(cm) {
            return cm.extendSelection(Pos(cm.firstLine(), 0));
        },
        goDocEnd: function(cm) {
            return cm.extendSelection(Pos(cm.lastLine()));
        },
        goLineStart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                return lineStart(cm, range.head.line);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineStartSmart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                return lineStartSmart(cm, range.head);
            }, {
                origin: "+move",
                bias: 1
            });
        },
        goLineEnd: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                return lineEnd(cm, range.head.line);
            }, {
                origin: "+move",
                bias: -1
            });
        },
        goLineRight: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5;
                return cm.coordsChar({
                    left: cm.display.lineDiv.offsetWidth + 100,
                    top: top
                }, "div");
            }, sel_move);
        },
        goLineLeft: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5;
                return cm.coordsChar({
                    left: 0,
                    top: top
                }, "div");
            }, sel_move);
        },
        goLineLeftSmart: function(cm) {
            return cm.extendSelectionsBy(function(range) {
                var top = cm.cursorCoords(range.head, "div").top + 5;
                var pos = cm.coordsChar({
                    left: 0,
                    top: top
                }, "div");
                if (pos.ch < cm.getLine(pos.line).search(/\S/)) return lineStartSmart(cm, range.head);
                return pos;
            }, sel_move);
        },
        goLineUp: function(cm) {
            return cm.moveV(-1, "line");
        },
        goLineDown: function(cm) {
            return cm.moveV(1, "line");
        },
        goPageUp: function(cm) {
            return cm.moveV(-1, "page");
        },
        goPageDown: function(cm) {
            return cm.moveV(1, "page");
        },
        goCharLeft: function(cm) {
            return cm.moveH(-1, "char");
        },
        goCharRight: function(cm) {
            return cm.moveH(1, "char");
        },
        goColumnLeft: function(cm) {
            return cm.moveH(-1, "column");
        },
        goColumnRight: function(cm) {
            return cm.moveH(1, "column");
        },
        goWordLeft: function(cm) {
            return cm.moveH(-1, "word");
        },
        goGroupRight: function(cm) {
            return cm.moveH(1, "group");
        },
        goGroupLeft: function(cm) {
            return cm.moveH(-1, "group");
        },
        goWordRight: function(cm) {
            return cm.moveH(1, "word");
        },
        delCharBefore: function(cm) {
            return cm.deleteH(-1, "codepoint");
        },
        delCharAfter: function(cm) {
            return cm.deleteH(1, "char");
        },
        delWordBefore: function(cm) {
            return cm.deleteH(-1, "word");
        },
        delWordAfter: function(cm) {
            return cm.deleteH(1, "word");
        },
        delGroupBefore: function(cm) {
            return cm.deleteH(-1, "group");
        },
        delGroupAfter: function(cm) {
            return cm.deleteH(1, "group");
        },
        indentAuto: function(cm) {
            return cm.indentSelection("smart");
        },
        indentMore: function(cm) {
            return cm.indentSelection("add");
        },
        indentLess: function(cm) {
            return cm.indentSelection("subtract");
        },
        insertTab: function(cm) {
            return cm.replaceSelection("\t");
        },
        insertSoftTab: function(cm) {
            var spaces = [], ranges = cm.listSelections(), tabSize = cm.options.tabSize;
            for(var i = 0; i < ranges.length; i++){
                var pos = ranges[i].from();
                var col = countColumn(cm.getLine(pos.line), pos.ch, tabSize);
                spaces.push(spaceStr(tabSize - col % tabSize));
            }
            cm.replaceSelections(spaces);
        },
        defaultTab: function(cm) {
            if (cm.somethingSelected()) cm.indentSelection("add");
            else cm.execCommand("insertTab");
        },
        // Swap the two chars left and right of each selection's head.
        // Move cursor behind the two swapped characters afterwards.
        //
        // Doesn't consider line feeds a character.
        // Doesn't scan more than one line above to find a character.
        // Doesn't do anything on an empty line.
        // Doesn't do anything with non-empty selections.
        transposeChars: function(cm) {
            return runInOp(cm, function() {
                var ranges = cm.listSelections(), newSel = [];
                for(var i = 0; i < ranges.length; i++){
                    if (!ranges[i].empty()) continue;
                    var cur = ranges[i].head, line = getLine(cm.doc, cur.line).text;
                    if (line) {
                        if (cur.ch == line.length) cur = new Pos(cur.line, cur.ch - 1);
                        if (cur.ch > 0) {
                            cur = new Pos(cur.line, cur.ch + 1);
                            cm.replaceRange(line.charAt(cur.ch - 1) + line.charAt(cur.ch - 2), Pos(cur.line, cur.ch - 2), cur, "+transpose");
                        } else if (cur.line > cm.doc.first) {
                            var prev = getLine(cm.doc, cur.line - 1).text;
                            if (prev) {
                                cur = new Pos(cur.line, 1);
                                cm.replaceRange(line.charAt(0) + cm.doc.lineSeparator() + prev.charAt(prev.length - 1), Pos(cur.line - 1, prev.length - 1), cur, "+transpose");
                            }
                        }
                    }
                    newSel.push(new Range(cur, cur));
                }
                cm.setSelections(newSel);
            });
        },
        newlineAndIndent: function(cm) {
            return runInOp(cm, function() {
                var sels = cm.listSelections();
                for(var i = sels.length - 1; i >= 0; i--)cm.replaceRange(cm.doc.lineSeparator(), sels[i].anchor, sels[i].head, "+input");
                sels = cm.listSelections();
                for(var i$1 = 0; i$1 < sels.length; i$1++)cm.indentLine(sels[i$1].from().line, null, true);
                ensureCursorVisible(cm);
            });
        },
        openLine: function(cm) {
            return cm.replaceSelection("\n", "start");
        },
        toggleOverwrite: function(cm) {
            return cm.toggleOverwrite();
        }
    };
    function lineStart(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLine(line);
        if (visual != line) lineN = lineNo(visual);
        return endOfLine(true, cm, visual, lineN, 1);
    }
    function lineEnd(cm, lineN) {
        var line = getLine(cm.doc, lineN);
        var visual = visualLineEnd(line);
        if (visual != line) lineN = lineNo(visual);
        return endOfLine(true, cm, line, lineN, -1);
    }
    function lineStartSmart(cm, pos) {
        var start = lineStart(cm, pos.line);
        var line = getLine(cm.doc, start.line);
        var order = getOrder(line, cm.doc.direction);
        if (!order || order[0].level == 0) {
            var firstNonWS = Math.max(start.ch, line.text.search(/\S/));
            var inWS = pos.line == start.line && pos.ch <= firstNonWS && pos.ch;
            return Pos(start.line, inWS ? 0 : firstNonWS, start.sticky);
        }
        return start;
    }
    // Run a handler that was bound to a key.
    function doHandleBinding(cm, bound, dropShift) {
        if (typeof bound == "string") {
            bound = commands[bound];
            if (!bound) return false;
        }
        // Ensure previous input has been read, so that the handler sees a
        // consistent view of the document
        cm.display.input.ensurePolled();
        var prevShift = cm.display.shift, done = false;
        try {
            if (cm.isReadOnly()) cm.state.suppressEdits = true;
            if (dropShift) cm.display.shift = false;
            done = bound(cm) != Pass;
        } finally{
            cm.display.shift = prevShift;
            cm.state.suppressEdits = false;
        }
        return done;
    }
    function lookupKeyForEditor(cm, name, handle) {
        for(var i = 0; i < cm.state.keyMaps.length; i++){
            var result = lookupKey(name, cm.state.keyMaps[i], handle, cm);
            if (result) return result;
        }
        return cm.options.extraKeys && lookupKey(name, cm.options.extraKeys, handle, cm) || lookupKey(name, cm.options.keyMap, handle, cm);
    }
    // Note that, despite the name, this function is also used to check
    // for bound mouse clicks.
    var stopSeq = new Delayed;
    function dispatchKey(cm, name, e, handle) {
        var seq = cm.state.keySeq;
        if (seq) {
            if (isModifierKey(name)) return "handled";
            if (/\'$/.test(name)) cm.state.keySeq = null;
            else stopSeq.set(50, function() {
                if (cm.state.keySeq == seq) {
                    cm.state.keySeq = null;
                    cm.display.input.reset();
                }
            });
            if (dispatchKeyInner(cm, seq + " " + name, e, handle)) return true;
        }
        return dispatchKeyInner(cm, name, e, handle);
    }
    function dispatchKeyInner(cm, name, e, handle) {
        var result = lookupKeyForEditor(cm, name, handle);
        if (result == "multi") cm.state.keySeq = name;
        if (result == "handled") signalLater(cm, "keyHandled", cm, name, e);
        if (result == "handled" || result == "multi") {
            e_preventDefault(e);
            restartBlink(cm);
        }
        return !!result;
    }
    // Handle a key from the keydown event.
    function handleKeyBinding(cm, e) {
        var name = keyName(e, true);
        if (!name) return false;
        if (e.shiftKey && !cm.state.keySeq) // First try to resolve full name (including 'Shift-'). Failing
        // that, see if there is a cursor-motion command (starting with
        // 'go') bound to the keyname without 'Shift-'.
        return dispatchKey(cm, "Shift-" + name, e, function(b) {
            return doHandleBinding(cm, b, true);
        }) || dispatchKey(cm, name, e, function(b) {
            if (typeof b == "string" ? /^go[A-Z]/.test(b) : b.motion) return doHandleBinding(cm, b);
        });
        else return dispatchKey(cm, name, e, function(b) {
            return doHandleBinding(cm, b);
        });
    }
    // Handle a key from the keypress event
    function handleCharBinding(cm, e, ch) {
        return dispatchKey(cm, "'" + ch + "'", e, function(b) {
            return doHandleBinding(cm, b, true);
        });
    }
    var lastStoppedKey = null;
    function onKeyDown(e) {
        var cm = this;
        if (e.target && e.target != cm.display.input.getField()) return;
        cm.curOp.focus = activeElt(root(cm));
        if (signalDOMEvent(cm, e)) return;
        // IE does strange things with escape.
        if (ie && ie_version < 11 && e.keyCode == 27) e.returnValue = false;
        var code = e.keyCode;
        cm.display.shift = code == 16 || e.shiftKey;
        var handled = handleKeyBinding(cm, e);
        if (presto) {
            lastStoppedKey = handled ? code : null;
            // Opera has no cut event... we try to at least catch the key combo
            if (!handled && code == 88 && !hasCopyEvent && (mac ? e.metaKey : e.ctrlKey)) cm.replaceSelection("", null, "cut");
        }
        if (gecko && !mac && !handled && code == 46 && e.shiftKey && !e.ctrlKey && document.execCommand) document.execCommand("cut");
        // Turn mouse into crosshair when Alt is held on Mac.
        if (code == 18 && !/\bCodeMirror-crosshair\b/.test(cm.display.lineDiv.className)) showCrossHair(cm);
    }
    function showCrossHair(cm) {
        var lineDiv = cm.display.lineDiv;
        addClass(lineDiv, "CodeMirror-crosshair");
        function up(e) {
            if (e.keyCode == 18 || !e.altKey) {
                rmClass(lineDiv, "CodeMirror-crosshair");
                off(document, "keyup", up);
                off(document, "mouseover", up);
            }
        }
        on(document, "keyup", up);
        on(document, "mouseover", up);
    }
    function onKeyUp(e) {
        if (e.keyCode == 16) this.doc.sel.shift = false;
        signalDOMEvent(this, e);
    }
    function onKeyPress(e) {
        var cm = this;
        if (e.target && e.target != cm.display.input.getField()) return;
        if (eventInWidget(cm.display, e) || signalDOMEvent(cm, e) || e.ctrlKey && !e.altKey || mac && e.metaKey) return;
        var keyCode = e.keyCode, charCode = e.charCode;
        if (presto && keyCode == lastStoppedKey) {
            lastStoppedKey = null;
            e_preventDefault(e);
            return;
        }
        if (presto && (!e.which || e.which < 10) && handleKeyBinding(cm, e)) return;
        var ch = String.fromCharCode(charCode == null ? keyCode : charCode);
        // Some browsers fire keypress events for backspace
        if (ch == "\x08") return;
        if (handleCharBinding(cm, e, ch)) return;
        cm.display.input.onKeyPress(e);
    }
    var DOUBLECLICK_DELAY = 400;
    var PastClick = function(time, pos, button) {
        this.time = time;
        this.pos = pos;
        this.button = button;
    };
    PastClick.prototype.compare = function(time, pos, button) {
        return this.time + DOUBLECLICK_DELAY > time && cmp(pos, this.pos) == 0 && button == this.button;
    };
    var lastClick, lastDoubleClick;
    function clickRepeat(pos, button) {
        var now = +new Date;
        if (lastDoubleClick && lastDoubleClick.compare(now, pos, button)) {
            lastClick = lastDoubleClick = null;
            return "triple";
        } else if (lastClick && lastClick.compare(now, pos, button)) {
            lastDoubleClick = new PastClick(now, pos, button);
            lastClick = null;
            return "double";
        } else {
            lastClick = new PastClick(now, pos, button);
            lastDoubleClick = null;
            return "single";
        }
    }
    // A mouse down can be a single click, double click, triple click,
    // start of selection drag, start of text drag, new cursor
    // (ctrl-click), rectangle drag (alt-drag), or xwin
    // middle-click-paste. Or it might be a click on something we should
    // not interfere with, such as a scrollbar or widget.
    function onMouseDown(e) {
        var cm = this, display = cm.display;
        if (signalDOMEvent(cm, e) || display.activeTouch && display.input.supportsTouch()) return;
        display.input.ensurePolled();
        display.shift = e.shiftKey;
        if (eventInWidget(display, e)) {
            if (!webkit) {
                // Briefly turn off draggability, to allow widgets to do
                // normal dragging things.
                display.scroller.draggable = false;
                setTimeout(function() {
                    return display.scroller.draggable = true;
                }, 100);
            }
            return;
        }
        if (clickInGutter(cm, e)) return;
        var pos = posFromMouse(cm, e), button = e_button(e), repeat = pos ? clickRepeat(pos, button) : "single";
        win(cm).focus();
        // #3261: make sure, that we're not starting a second selection
        if (button == 1 && cm.state.selectingText) cm.state.selectingText(e);
        if (pos && handleMappedButton(cm, button, pos, repeat, e)) return;
        if (button == 1) {
            if (pos) leftButtonDown(cm, pos, repeat, e);
            else if (e_target(e) == display.scroller) e_preventDefault(e);
        } else if (button == 2) {
            if (pos) extendSelection(cm.doc, pos);
            setTimeout(function() {
                return display.input.focus();
            }, 20);
        } else if (button == 3) {
            if (captureRightClick) cm.display.input.onContextMenu(e);
            else delayBlurEvent(cm);
        }
    }
    function handleMappedButton(cm, button, pos, repeat, event) {
        var name = "Click";
        if (repeat == "double") name = "Double" + name;
        else if (repeat == "triple") name = "Triple" + name;
        name = (button == 1 ? "Left" : button == 2 ? "Middle" : "Right") + name;
        return dispatchKey(cm, addModifierNames(name, event), event, function(bound) {
            if (typeof bound == "string") bound = commands[bound];
            if (!bound) return false;
            var done = false;
            try {
                if (cm.isReadOnly()) cm.state.suppressEdits = true;
                done = bound(cm, pos) != Pass;
            } finally{
                cm.state.suppressEdits = false;
            }
            return done;
        });
    }
    function configureMouse(cm, repeat, event) {
        var option = cm.getOption("configureMouse");
        var value = option ? option(cm, repeat, event) : {};
        if (value.unit == null) {
            var rect = chromeOS ? event.shiftKey && event.metaKey : event.altKey;
            value.unit = rect ? "rectangle" : repeat == "single" ? "char" : repeat == "double" ? "word" : "line";
        }
        if (value.extend == null || cm.doc.extend) value.extend = cm.doc.extend || event.shiftKey;
        if (value.addNew == null) value.addNew = mac ? event.metaKey : event.ctrlKey;
        if (value.moveOnDrag == null) value.moveOnDrag = !(mac ? event.altKey : event.ctrlKey);
        return value;
    }
    function leftButtonDown(cm, pos, repeat, event) {
        if (ie) setTimeout(bind(ensureFocus, cm), 0);
        else cm.curOp.focus = activeElt(root(cm));
        var behavior = configureMouse(cm, repeat, event);
        var sel = cm.doc.sel, contained;
        if (cm.options.dragDrop && dragAndDrop && !cm.isReadOnly() && repeat == "single" && (contained = sel.contains(pos)) > -1 && (cmp((contained = sel.ranges[contained]).from(), pos) < 0 || pos.xRel > 0) && (cmp(contained.to(), pos) > 0 || pos.xRel < 0)) leftButtonStartDrag(cm, event, pos, behavior);
        else leftButtonSelect(cm, event, pos, behavior);
    }
    // Start a text drag. When it ends, see if any dragging actually
    // happen, and treat as a click if it didn't.
    function leftButtonStartDrag(cm, event, pos, behavior) {
        var display = cm.display, moved = false;
        var dragEnd = operation(cm, function(e) {
            if (webkit) display.scroller.draggable = false;
            cm.state.draggingText = false;
            if (cm.state.delayingBlurEvent) {
                if (cm.hasFocus()) cm.state.delayingBlurEvent = false;
                else delayBlurEvent(cm);
            }
            off(display.wrapper.ownerDocument, "mouseup", dragEnd);
            off(display.wrapper.ownerDocument, "mousemove", mouseMove);
            off(display.scroller, "dragstart", dragStart);
            off(display.scroller, "drop", dragEnd);
            if (!moved) {
                e_preventDefault(e);
                if (!behavior.addNew) extendSelection(cm.doc, pos, null, null, behavior.extend);
                // Work around unexplainable focus problem in IE9 (#2127) and Chrome (#3081)
                if (webkit && !safari || ie && ie_version == 9) setTimeout(function() {
                    display.wrapper.ownerDocument.body.focus({
                        preventScroll: true
                    });
                    display.input.focus();
                }, 20);
                else display.input.focus();
            }
        });
        var mouseMove = function(e2) {
            moved = moved || Math.abs(event.clientX - e2.clientX) + Math.abs(event.clientY - e2.clientY) >= 10;
        };
        var dragStart = function() {
            return moved = true;
        };
        // Let the drag handler handle this.
        if (webkit) display.scroller.draggable = true;
        cm.state.draggingText = dragEnd;
        dragEnd.copy = !behavior.moveOnDrag;
        on(display.wrapper.ownerDocument, "mouseup", dragEnd);
        on(display.wrapper.ownerDocument, "mousemove", mouseMove);
        on(display.scroller, "dragstart", dragStart);
        on(display.scroller, "drop", dragEnd);
        cm.state.delayingBlurEvent = true;
        setTimeout(function() {
            return display.input.focus();
        }, 20);
        // IE's approach to draggable
        if (display.scroller.dragDrop) display.scroller.dragDrop();
    }
    function rangeForUnit(cm, pos, unit) {
        if (unit == "char") return new Range(pos, pos);
        if (unit == "word") return cm.findWordAt(pos);
        if (unit == "line") return new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
        var result = unit(cm, pos);
        return new Range(result.from, result.to);
    }
    // Normal selection, as opposed to text dragging.
    function leftButtonSelect(cm, event, start, behavior) {
        if (ie) delayBlurEvent(cm);
        var display = cm.display, doc = cm.doc;
        e_preventDefault(event);
        var ourRange, ourIndex, startSel = doc.sel, ranges = startSel.ranges;
        if (behavior.addNew && !behavior.extend) {
            ourIndex = doc.sel.contains(start);
            if (ourIndex > -1) ourRange = ranges[ourIndex];
            else ourRange = new Range(start, start);
        } else {
            ourRange = doc.sel.primary();
            ourIndex = doc.sel.primIndex;
        }
        if (behavior.unit == "rectangle") {
            if (!behavior.addNew) ourRange = new Range(start, start);
            start = posFromMouse(cm, event, true, true);
            ourIndex = -1;
        } else {
            var range = rangeForUnit(cm, start, behavior.unit);
            if (behavior.extend) ourRange = extendRange(ourRange, range.anchor, range.head, behavior.extend);
            else ourRange = range;
        }
        if (!behavior.addNew) {
            ourIndex = 0;
            setSelection(doc, new Selection([
                ourRange
            ], 0), sel_mouse);
            startSel = doc.sel;
        } else if (ourIndex == -1) {
            ourIndex = ranges.length;
            setSelection(doc, normalizeSelection(cm, ranges.concat([
                ourRange
            ]), ourIndex), {
                scroll: false,
                origin: "*mouse"
            });
        } else if (ranges.length > 1 && ranges[ourIndex].empty() && behavior.unit == "char" && !behavior.extend) {
            setSelection(doc, normalizeSelection(cm, ranges.slice(0, ourIndex).concat(ranges.slice(ourIndex + 1)), 0), {
                scroll: false,
                origin: "*mouse"
            });
            startSel = doc.sel;
        } else replaceOneSelection(doc, ourIndex, ourRange, sel_mouse);
        var lastPos = start;
        function extendTo(pos) {
            if (cmp(lastPos, pos) == 0) return;
            lastPos = pos;
            if (behavior.unit == "rectangle") {
                var ranges = [], tabSize = cm.options.tabSize;
                var startCol = countColumn(getLine(doc, start.line).text, start.ch, tabSize);
                var posCol = countColumn(getLine(doc, pos.line).text, pos.ch, tabSize);
                var left = Math.min(startCol, posCol), right = Math.max(startCol, posCol);
                for(var line = Math.min(start.line, pos.line), end = Math.min(cm.lastLine(), Math.max(start.line, pos.line)); line <= end; line++){
                    var text = getLine(doc, line).text, leftPos = findColumn(text, left, tabSize);
                    if (left == right) ranges.push(new Range(Pos(line, leftPos), Pos(line, leftPos)));
                    else if (text.length > leftPos) ranges.push(new Range(Pos(line, leftPos), Pos(line, findColumn(text, right, tabSize))));
                }
                if (!ranges.length) ranges.push(new Range(start, start));
                setSelection(doc, normalizeSelection(cm, startSel.ranges.slice(0, ourIndex).concat(ranges), ourIndex), {
                    origin: "*mouse",
                    scroll: false
                });
                cm.scrollIntoView(pos);
            } else {
                var oldRange = ourRange;
                var range = rangeForUnit(cm, pos, behavior.unit);
                var anchor = oldRange.anchor, head;
                if (cmp(range.anchor, anchor) > 0) {
                    head = range.head;
                    anchor = minPos(oldRange.from(), range.anchor);
                } else {
                    head = range.anchor;
                    anchor = maxPos(oldRange.to(), range.head);
                }
                var ranges$1 = startSel.ranges.slice(0);
                ranges$1[ourIndex] = bidiSimplify(cm, new Range(clipPos(doc, anchor), head));
                setSelection(doc, normalizeSelection(cm, ranges$1, ourIndex), sel_mouse);
            }
        }
        var editorSize = display.wrapper.getBoundingClientRect();
        // Used to ensure timeout re-tries don't fire when another extend
        // happened in the meantime (clearTimeout isn't reliable -- at
        // least on Chrome, the timeouts still happen even when cleared,
        // if the clear happens after their scheduled firing time).
        var counter = 0;
        function extend(e) {
            var curCount = ++counter;
            var cur = posFromMouse(cm, e, true, behavior.unit == "rectangle");
            if (!cur) return;
            if (cmp(cur, lastPos) != 0) {
                cm.curOp.focus = activeElt(root(cm));
                extendTo(cur);
                var visible = visibleLines(display, doc);
                if (cur.line >= visible.to || cur.line < visible.from) setTimeout(operation(cm, function() {
                    if (counter == curCount) extend(e);
                }), 150);
            } else {
                var outside = e.clientY < editorSize.top ? -20 : e.clientY > editorSize.bottom ? 20 : 0;
                if (outside) setTimeout(operation(cm, function() {
                    if (counter != curCount) return;
                    display.scroller.scrollTop += outside;
                    extend(e);
                }), 50);
            }
        }
        function done(e) {
            cm.state.selectingText = false;
            counter = Infinity;
            // If e is null or undefined we interpret this as someone trying
            // to explicitly cancel the selection rather than the user
            // letting go of the mouse button.
            if (e) {
                e_preventDefault(e);
                display.input.focus();
            }
            off(display.wrapper.ownerDocument, "mousemove", move);
            off(display.wrapper.ownerDocument, "mouseup", up);
            doc.history.lastSelOrigin = null;
        }
        var move = operation(cm, function(e) {
            if (e.buttons === 0 || !e_button(e)) done(e);
            else extend(e);
        });
        var up = operation(cm, done);
        cm.state.selectingText = up;
        on(display.wrapper.ownerDocument, "mousemove", move);
        on(display.wrapper.ownerDocument, "mouseup", up);
    }
    // Used when mouse-selecting to adjust the anchor to the proper side
    // of a bidi jump depending on the visual position of the head.
    function bidiSimplify(cm, range) {
        var anchor = range.anchor;
        var head = range.head;
        var anchorLine = getLine(cm.doc, anchor.line);
        if (cmp(anchor, head) == 0 && anchor.sticky == head.sticky) return range;
        var order = getOrder(anchorLine);
        if (!order) return range;
        var index = getBidiPartAt(order, anchor.ch, anchor.sticky), part = order[index];
        if (part.from != anchor.ch && part.to != anchor.ch) return range;
        var boundary = index + (part.from == anchor.ch == (part.level != 1) ? 0 : 1);
        if (boundary == 0 || boundary == order.length) return range;
        // Compute the relative visual position of the head compared to the
        // anchor (<0 is to the left, >0 to the right)
        var leftSide;
        if (head.line != anchor.line) leftSide = (head.line - anchor.line) * (cm.doc.direction == "ltr" ? 1 : -1) > 0;
        else {
            var headIndex = getBidiPartAt(order, head.ch, head.sticky);
            var dir = headIndex - index || (head.ch - anchor.ch) * (part.level == 1 ? -1 : 1);
            if (headIndex == boundary - 1 || headIndex == boundary) leftSide = dir < 0;
            else leftSide = dir > 0;
        }
        var usePart = order[boundary + (leftSide ? -1 : 0)];
        var from = leftSide == (usePart.level == 1);
        var ch = from ? usePart.from : usePart.to, sticky = from ? "after" : "before";
        return anchor.ch == ch && anchor.sticky == sticky ? range : new Range(new Pos(anchor.line, ch, sticky), head);
    }
    // Determines whether an event happened in the gutter, and fires the
    // handlers for the corresponding event.
    function gutterEvent(cm, e, type, prevent) {
        var mX, mY;
        if (e.touches) {
            mX = e.touches[0].clientX;
            mY = e.touches[0].clientY;
        } else try {
            mX = e.clientX;
            mY = e.clientY;
        } catch (e$1) {
            return false;
        }
        if (mX >= Math.floor(cm.display.gutters.getBoundingClientRect().right)) return false;
        if (prevent) e_preventDefault(e);
        var display = cm.display;
        var lineBox = display.lineDiv.getBoundingClientRect();
        if (mY > lineBox.bottom || !hasHandler(cm, type)) return e_defaultPrevented(e);
        mY -= lineBox.top - display.viewOffset;
        for(var i = 0; i < cm.display.gutterSpecs.length; ++i){
            var g = display.gutters.childNodes[i];
            if (g && g.getBoundingClientRect().right >= mX) {
                var line = lineAtHeight(cm.doc, mY);
                var gutter = cm.display.gutterSpecs[i];
                signal(cm, type, cm, line, gutter.className, e);
                return e_defaultPrevented(e);
            }
        }
    }
    function clickInGutter(cm, e) {
        return gutterEvent(cm, e, "gutterClick", true);
    }
    // CONTEXT MENU HANDLING
    // To make the context menu work, we need to briefly unhide the
    // textarea (making it as unobtrusive as possible) to let the
    // right-click take effect on it.
    function onContextMenu(cm, e) {
        if (eventInWidget(cm.display, e) || contextMenuInGutter(cm, e)) return;
        if (signalDOMEvent(cm, e, "contextmenu")) return;
        if (!captureRightClick) cm.display.input.onContextMenu(e);
    }
    function contextMenuInGutter(cm, e) {
        if (!hasHandler(cm, "gutterContextMenu")) return false;
        return gutterEvent(cm, e, "gutterContextMenu", false);
    }
    function themeChanged(cm) {
        cm.display.wrapper.className = cm.display.wrapper.className.replace(/\s*cm-s-\S+/g, "") + cm.options.theme.replace(/(^|\s)\s*/g, " cm-s-");
        clearCaches(cm);
    }
    var Init = {
        toString: function() {
            return "CodeMirror.Init";
        }
    };
    var defaults = {};
    var optionHandlers = {};
    function defineOptions(CodeMirror) {
        var optionHandlers = CodeMirror.optionHandlers;
        function option(name, deflt, handle, notOnInit) {
            CodeMirror.defaults[name] = deflt;
            if (handle) optionHandlers[name] = notOnInit ? function(cm, val, old) {
                if (old != Init) handle(cm, val, old);
            } : handle;
        }
        CodeMirror.defineOption = option;
        // Passed to option handlers when there is no old value.
        CodeMirror.Init = Init;
        // These two are, on init, called from the constructor because they
        // have to be initialized before the editor can start at all.
        option("value", "", function(cm, val) {
            return cm.setValue(val);
        }, true);
        option("mode", null, function(cm, val) {
            cm.doc.modeOption = val;
            loadMode(cm);
        }, true);
        option("indentUnit", 2, loadMode, true);
        option("indentWithTabs", false);
        option("smartIndent", true);
        option("tabSize", 4, function(cm) {
            resetModeState(cm);
            clearCaches(cm);
            regChange(cm);
        }, true);
        option("lineSeparator", null, function(cm, val) {
            cm.doc.lineSep = val;
            if (!val) return;
            var newBreaks = [], lineNo = cm.doc.first;
            cm.doc.iter(function(line) {
                for(var pos = 0;;){
                    var found = line.text.indexOf(val, pos);
                    if (found == -1) break;
                    pos = found + val.length;
                    newBreaks.push(Pos(lineNo, found));
                }
                lineNo++;
            });
            for(var i = newBreaks.length - 1; i >= 0; i--)replaceRange(cm.doc, val, newBreaks[i], Pos(newBreaks[i].line, newBreaks[i].ch + val.length));
        });
        option("specialChars", /[\u0000-\u001f\u007f-\u009f\u00ad\u061c\u200b\u200e\u200f\u2028\u2029\u202d\u202e\u2066\u2067\u2069\ufeff\ufff9-\ufffc]/g, function(cm, val, old) {
            cm.state.specialChars = new RegExp(val.source + (val.test("\t") ? "" : "|\t"), "g");
            if (old != Init) cm.refresh();
        });
        option("specialCharPlaceholder", defaultSpecialCharPlaceholder, function(cm) {
            return cm.refresh();
        }, true);
        option("electricChars", true);
        option("inputStyle", mobile ? "contenteditable" : "textarea", function() {
            throw new Error("inputStyle can not (yet) be changed in a running editor") // FIXME
            ;
        }, true);
        option("spellcheck", false, function(cm, val) {
            return cm.getInputField().spellcheck = val;
        }, true);
        option("autocorrect", false, function(cm, val) {
            return cm.getInputField().autocorrect = val;
        }, true);
        option("autocapitalize", false, function(cm, val) {
            return cm.getInputField().autocapitalize = val;
        }, true);
        option("rtlMoveVisually", !windows);
        option("wholeLineUpdateBefore", true);
        option("theme", "default", function(cm) {
            themeChanged(cm);
            updateGutters(cm);
        }, true);
        option("keyMap", "default", function(cm, val, old) {
            var next = getKeyMap(val);
            var prev = old != Init && getKeyMap(old);
            if (prev && prev.detach) prev.detach(cm, next);
            if (next.attach) next.attach(cm, prev || null);
        });
        option("extraKeys", null);
        option("configureMouse", null);
        option("lineWrapping", false, wrappingChanged, true);
        option("gutters", [], function(cm, val) {
            cm.display.gutterSpecs = getGutters(val, cm.options.lineNumbers);
            updateGutters(cm);
        }, true);
        option("fixedGutter", true, function(cm, val) {
            cm.display.gutters.style.left = val ? compensateForHScroll(cm.display) + "px" : "0";
            cm.refresh();
        }, true);
        option("coverGutterNextToScrollbar", false, function(cm) {
            return updateScrollbars(cm);
        }, true);
        option("scrollbarStyle", "native", function(cm) {
            initScrollbars(cm);
            updateScrollbars(cm);
            cm.display.scrollbars.setScrollTop(cm.doc.scrollTop);
            cm.display.scrollbars.setScrollLeft(cm.doc.scrollLeft);
        }, true);
        option("lineNumbers", false, function(cm, val) {
            cm.display.gutterSpecs = getGutters(cm.options.gutters, val);
            updateGutters(cm);
        }, true);
        option("firstLineNumber", 1, updateGutters, true);
        option("lineNumberFormatter", function(integer) {
            return integer;
        }, updateGutters, true);
        option("showCursorWhenSelecting", false, updateSelection, true);
        option("resetSelectionOnContextMenu", true);
        option("lineWiseCopyCut", true);
        option("pasteLinesPerSelection", true);
        option("selectionsMayTouch", false);
        option("readOnly", false, function(cm, val) {
            if (val == "nocursor") {
                onBlur(cm);
                cm.display.input.blur();
            }
            cm.display.input.readOnlyChanged(val);
        });
        option("screenReaderLabel", null, function(cm, val) {
            val = val === '' ? null : val;
            cm.display.input.screenReaderLabelChanged(val);
        });
        option("disableInput", false, function(cm, val) {
            if (!val) cm.display.input.reset();
        }, true);
        option("dragDrop", true, dragDropChanged);
        option("allowDropFileTypes", null);
        option("cursorBlinkRate", 530);
        option("cursorScrollMargin", 0);
        option("cursorHeight", 1, updateSelection, true);
        option("singleCursorHeightPerLine", true, updateSelection, true);
        option("workTime", 100);
        option("workDelay", 100);
        option("flattenSpans", true, resetModeState, true);
        option("addModeClass", false, resetModeState, true);
        option("pollInterval", 100);
        option("undoDepth", 200, function(cm, val) {
            return cm.doc.history.undoDepth = val;
        });
        option("historyEventDelay", 1250);
        option("viewportMargin", 10, function(cm) {
            return cm.refresh();
        }, true);
        option("maxHighlightLength", 10000, resetModeState, true);
        option("moveInputWithCursor", true, function(cm, val) {
            if (!val) cm.display.input.resetPosition();
        });
        option("tabindex", null, function(cm, val) {
            return cm.display.input.getField().tabIndex = val || "";
        });
        option("autofocus", null);
        option("direction", "ltr", function(cm, val) {
            return cm.doc.setDirection(val);
        }, true);
        option("phrases", null);
    }
    function dragDropChanged(cm, value, old) {
        var wasOn = old && old != Init;
        if (!value != !wasOn) {
            var funcs = cm.display.dragFunctions;
            var toggle = value ? on : off;
            toggle(cm.display.scroller, "dragstart", funcs.start);
            toggle(cm.display.scroller, "dragenter", funcs.enter);
            toggle(cm.display.scroller, "dragover", funcs.over);
            toggle(cm.display.scroller, "dragleave", funcs.leave);
            toggle(cm.display.scroller, "drop", funcs.drop);
        }
    }
    function wrappingChanged(cm) {
        if (cm.options.lineWrapping) {
            addClass(cm.display.wrapper, "CodeMirror-wrap");
            cm.display.sizer.style.minWidth = "";
            cm.display.sizerWidth = null;
        } else {
            rmClass(cm.display.wrapper, "CodeMirror-wrap");
            findMaxLine(cm);
        }
        estimateLineHeights(cm);
        regChange(cm);
        clearCaches(cm);
        setTimeout(function() {
            return updateScrollbars(cm);
        }, 100);
    }
    // A CodeMirror instance represents an editor. This is the object
    // that user code is usually dealing with.
    function CodeMirror(place, options) {
        var this$1 = this;
        if (!(this instanceof CodeMirror)) return new CodeMirror(place, options);
        this.options = options = options ? copyObj(options) : {};
        // Determine effective options based on given values and defaults.
        copyObj(defaults, options, false);
        var doc = options.value;
        if (typeof doc == "string") doc = new Doc(doc, options.mode, null, options.lineSeparator, options.direction);
        else if (options.mode) doc.modeOption = options.mode;
        this.doc = doc;
        var input = new CodeMirror.inputStyles[options.inputStyle](this);
        var display = this.display = new Display(place, doc, input, options);
        display.wrapper.CodeMirror = this;
        themeChanged(this);
        if (options.lineWrapping) this.display.wrapper.className += " CodeMirror-wrap";
        initScrollbars(this);
        this.state = {
            keyMaps: [],
            overlays: [],
            modeGen: 0,
            overwrite: false,
            delayingBlurEvent: false,
            focused: false,
            suppressEdits: false,
            pasteIncoming: -1,
            cutIncoming: -1,
            selectingText: false,
            draggingText: false,
            highlight: new Delayed(),
            keySeq: null,
            specialChars: null
        };
        if (options.autofocus && !mobile) display.input.focus();
        // Override magic textarea content restore that IE sometimes does
        // on our hidden textarea on reload
        if (ie && ie_version < 11) setTimeout(function() {
            return this$1.display.input.reset(true);
        }, 20);
        registerEventHandlers(this);
        ensureGlobalHandlers();
        startOperation(this);
        this.curOp.forceUpdate = true;
        attachDoc(this, doc);
        if (options.autofocus && !mobile || this.hasFocus()) setTimeout(function() {
            if (this$1.hasFocus() && !this$1.state.focused) onFocus(this$1);
        }, 20);
        else onBlur(this);
        for(var opt in optionHandlers)if (optionHandlers.hasOwnProperty(opt)) optionHandlers[opt](this, options[opt], Init);
        maybeUpdateLineNumberWidth(this);
        if (options.finishInit) options.finishInit(this);
        for(var i = 0; i < initHooks.length; ++i)initHooks[i](this);
        endOperation(this);
        // Suppress optimizelegibility in Webkit, since it breaks text
        // measuring on line wrapping boundaries.
        if (webkit && options.lineWrapping && getComputedStyle(display.lineDiv).textRendering == "optimizelegibility") display.lineDiv.style.textRendering = "auto";
    }
    // The default configuration options.
    CodeMirror.defaults = defaults;
    // Functions to run when options are changed.
    CodeMirror.optionHandlers = optionHandlers;
    // Attach the necessary event handlers when initializing the editor
    function registerEventHandlers(cm) {
        var d = cm.display;
        on(d.scroller, "mousedown", operation(cm, onMouseDown));
        // Older IE's will not fire a second mousedown for a double click
        if (ie && ie_version < 11) on(d.scroller, "dblclick", operation(cm, function(e) {
            if (signalDOMEvent(cm, e)) return;
            var pos = posFromMouse(cm, e);
            if (!pos || clickInGutter(cm, e) || eventInWidget(cm.display, e)) return;
            e_preventDefault(e);
            var word = cm.findWordAt(pos);
            extendSelection(cm.doc, word.anchor, word.head);
        }));
        else on(d.scroller, "dblclick", function(e) {
            return signalDOMEvent(cm, e) || e_preventDefault(e);
        });
        // Some browsers fire contextmenu *after* opening the menu, at
        // which point we can't mess with it anymore. Context menu is
        // handled in onMouseDown for these browsers.
        on(d.scroller, "contextmenu", function(e) {
            return onContextMenu(cm, e);
        });
        on(d.input.getField(), "contextmenu", function(e) {
            if (!d.scroller.contains(e.target)) onContextMenu(cm, e);
        });
        // Used to suppress mouse event handling when a touch happens
        var touchFinished, prevTouch = {
            end: 0
        };
        function finishTouch() {
            if (d.activeTouch) {
                touchFinished = setTimeout(function() {
                    return d.activeTouch = null;
                }, 1000);
                prevTouch = d.activeTouch;
                prevTouch.end = +new Date;
            }
        }
        function isMouseLikeTouchEvent(e) {
            if (e.touches.length != 1) return false;
            var touch = e.touches[0];
            return touch.radiusX <= 1 && touch.radiusY <= 1;
        }
        function farAway(touch, other) {
            if (other.left == null) return true;
            var dx = other.left - touch.left, dy = other.top - touch.top;
            return dx * dx + dy * dy > 400;
        }
        on(d.scroller, "touchstart", function(e) {
            if (!signalDOMEvent(cm, e) && !isMouseLikeTouchEvent(e) && !clickInGutter(cm, e)) {
                d.input.ensurePolled();
                clearTimeout(touchFinished);
                var now = +new Date;
                d.activeTouch = {
                    start: now,
                    moved: false,
                    prev: now - prevTouch.end <= 300 ? prevTouch : null
                };
                if (e.touches.length == 1) {
                    d.activeTouch.left = e.touches[0].pageX;
                    d.activeTouch.top = e.touches[0].pageY;
                }
            }
        });
        on(d.scroller, "touchmove", function() {
            if (d.activeTouch) d.activeTouch.moved = true;
        });
        on(d.scroller, "touchend", function(e) {
            var touch = d.activeTouch;
            if (touch && !eventInWidget(d, e) && touch.left != null && !touch.moved && new Date - touch.start < 300) {
                var pos = cm.coordsChar(d.activeTouch, "page"), range;
                if (!touch.prev || farAway(touch, touch.prev)) range = new Range(pos, pos);
                else if (!touch.prev.prev || farAway(touch, touch.prev.prev)) range = cm.findWordAt(pos);
                else range = new Range(Pos(pos.line, 0), clipPos(cm.doc, Pos(pos.line + 1, 0)));
                cm.setSelection(range.anchor, range.head);
                cm.focus();
                e_preventDefault(e);
            }
            finishTouch();
        });
        on(d.scroller, "touchcancel", finishTouch);
        // Sync scrolling between fake scrollbars and real scrollable
        // area, ensure viewport is updated when scrolling.
        on(d.scroller, "scroll", function() {
            if (d.scroller.clientHeight) {
                updateScrollTop(cm, d.scroller.scrollTop);
                setScrollLeft(cm, d.scroller.scrollLeft, true);
                signal(cm, "scroll", cm);
            }
        });
        // Listen to wheel events in order to try and update the viewport on time.
        on(d.scroller, "mousewheel", function(e) {
            return onScrollWheel(cm, e);
        });
        on(d.scroller, "DOMMouseScroll", function(e) {
            return onScrollWheel(cm, e);
        });
        // Prevent wrapper from ever scrolling
        on(d.wrapper, "scroll", function() {
            return d.wrapper.scrollTop = d.wrapper.scrollLeft = 0;
        });
        d.dragFunctions = {
            enter: function(e) {
                if (!signalDOMEvent(cm, e)) e_stop(e);
            },
            over: function(e) {
                if (!signalDOMEvent(cm, e)) {
                    onDragOver(cm, e);
                    e_stop(e);
                }
            },
            start: function(e) {
                return onDragStart(cm, e);
            },
            drop: operation(cm, onDrop),
            leave: function(e) {
                if (!signalDOMEvent(cm, e)) clearDragCursor(cm);
            }
        };
        var inp = d.input.getField();
        on(inp, "keyup", function(e) {
            return onKeyUp.call(cm, e);
        });
        on(inp, "keydown", operation(cm, onKeyDown));
        on(inp, "keypress", operation(cm, onKeyPress));
        on(inp, "focus", function(e) {
            return onFocus(cm, e);
        });
        on(inp, "blur", function(e) {
            return onBlur(cm, e);
        });
    }
    var initHooks = [];
    CodeMirror.defineInitHook = function(f) {
        return initHooks.push(f);
    };
    // Indent the given line. The how parameter can be "smart",
    // "add"/null, "subtract", or "prev". When aggressive is false
    // (typically set to true for forced single-line indents), empty
    // lines are not indented, and places where the mode returns Pass
    // are left alone.
    function indentLine(cm, n, how, aggressive) {
        var doc = cm.doc, state;
        if (how == null) how = "add";
        if (how == "smart") {
            // Fall back to "prev" when the mode doesn't have an indentation
            // method.
            if (!doc.mode.indent) how = "prev";
            else state = getContextBefore(cm, n).state;
        }
        var tabSize = cm.options.tabSize;
        var line = getLine(doc, n), curSpace = countColumn(line.text, null, tabSize);
        if (line.stateAfter) line.stateAfter = null;
        var curSpaceString = line.text.match(/^\s*/)[0], indentation;
        if (!aggressive && !/\S/.test(line.text)) {
            indentation = 0;
            how = "not";
        } else if (how == "smart") {
            indentation = doc.mode.indent(state, line.text.slice(curSpaceString.length), line.text);
            if (indentation == Pass || indentation > 150) {
                if (!aggressive) return;
                how = "prev";
            }
        }
        if (how == "prev") {
            if (n > doc.first) indentation = countColumn(getLine(doc, n - 1).text, null, tabSize);
            else indentation = 0;
        } else if (how == "add") indentation = curSpace + cm.options.indentUnit;
        else if (how == "subtract") indentation = curSpace - cm.options.indentUnit;
        else if (typeof how == "number") indentation = curSpace + how;
        indentation = Math.max(0, indentation);
        var indentString = "", pos = 0;
        if (cm.options.indentWithTabs) for(var i = Math.floor(indentation / tabSize); i; --i){
            pos += tabSize;
            indentString += "\t";
        }
        if (pos < indentation) indentString += spaceStr(indentation - pos);
        if (indentString != curSpaceString) {
            replaceRange(doc, indentString, Pos(n, 0), Pos(n, curSpaceString.length), "+input");
            line.stateAfter = null;
            return true;
        } else // Ensure that, if the cursor was in the whitespace at the start
        // of the line, it is moved to the end of that space.
        for(var i$1 = 0; i$1 < doc.sel.ranges.length; i$1++){
            var range = doc.sel.ranges[i$1];
            if (range.head.line == n && range.head.ch < curSpaceString.length) {
                var pos$1 = Pos(n, curSpaceString.length);
                replaceOneSelection(doc, i$1, new Range(pos$1, pos$1));
                break;
            }
        }
    }
    // This will be set to a {lineWise: bool, text: [string]} object, so
    // that, when pasting, we know what kind of selections the copied
    // text was made out of.
    var lastCopied = null;
    function setLastCopied(newLastCopied) {
        lastCopied = newLastCopied;
    }
    function applyTextInput(cm, inserted, deleted, sel, origin) {
        var doc = cm.doc;
        cm.display.shift = false;
        if (!sel) sel = doc.sel;
        var recent = +new Date - 200;
        var paste = origin == "paste" || cm.state.pasteIncoming > recent;
        var textLines = splitLinesAuto(inserted), multiPaste = null;
        // When pasting N lines into N selections, insert one line per selection
        if (paste && sel.ranges.length > 1) {
            if (lastCopied && lastCopied.text.join("\n") == inserted) {
                if (sel.ranges.length % lastCopied.text.length == 0) {
                    multiPaste = [];
                    for(var i = 0; i < lastCopied.text.length; i++)multiPaste.push(doc.splitLines(lastCopied.text[i]));
                }
            } else if (textLines.length == sel.ranges.length && cm.options.pasteLinesPerSelection) multiPaste = map(textLines, function(l) {
                return [
                    l
                ];
            });
        }
        var updateInput = cm.curOp.updateInput;
        // Normal behavior is to insert the new text into every selection
        for(var i$1 = sel.ranges.length - 1; i$1 >= 0; i$1--){
            var range = sel.ranges[i$1];
            var from = range.from(), to = range.to();
            if (range.empty()) {
                if (deleted && deleted > 0) from = Pos(from.line, from.ch - deleted);
                else if (cm.state.overwrite && !paste) to = Pos(to.line, Math.min(getLine(doc, to.line).text.length, to.ch + lst(textLines).length));
                else if (paste && lastCopied && lastCopied.lineWise && lastCopied.text.join("\n") == textLines.join("\n")) from = to = Pos(from.line, 0);
            }
            var changeEvent = {
                from: from,
                to: to,
                text: multiPaste ? multiPaste[i$1 % multiPaste.length] : textLines,
                origin: origin || (paste ? "paste" : cm.state.cutIncoming > recent ? "cut" : "+input")
            };
            makeChange(cm.doc, changeEvent);
            signalLater(cm, "inputRead", cm, changeEvent);
        }
        if (inserted && !paste) triggerElectric(cm, inserted);
        ensureCursorVisible(cm);
        if (cm.curOp.updateInput < 2) cm.curOp.updateInput = updateInput;
        cm.curOp.typing = true;
        cm.state.pasteIncoming = cm.state.cutIncoming = -1;
    }
    function handlePaste(e, cm) {
        var pasted = e.clipboardData && e.clipboardData.getData("Text");
        if (pasted) {
            e.preventDefault();
            if (!cm.isReadOnly() && !cm.options.disableInput && cm.hasFocus()) runInOp(cm, function() {
                return applyTextInput(cm, pasted, 0, null, "paste");
            });
            return true;
        }
    }
    function triggerElectric(cm, inserted) {
        // When an 'electric' character is inserted, immediately trigger a reindent
        if (!cm.options.electricChars || !cm.options.smartIndent) return;
        var sel = cm.doc.sel;
        for(var i = sel.ranges.length - 1; i >= 0; i--){
            var range = sel.ranges[i];
            if (range.head.ch > 100 || i && sel.ranges[i - 1].head.line == range.head.line) continue;
            var mode = cm.getModeAt(range.head);
            var indented = false;
            if (mode.electricChars) {
                for(var j = 0; j < mode.electricChars.length; j++)if (inserted.indexOf(mode.electricChars.charAt(j)) > -1) {
                    indented = indentLine(cm, range.head.line, "smart");
                    break;
                }
            } else if (mode.electricInput) {
                if (mode.electricInput.test(getLine(cm.doc, range.head.line).text.slice(0, range.head.ch))) indented = indentLine(cm, range.head.line, "smart");
            }
            if (indented) signalLater(cm, "electricInput", cm, range.head.line);
        }
    }
    function copyableRanges(cm) {
        var text = [], ranges = [];
        for(var i = 0; i < cm.doc.sel.ranges.length; i++){
            var line = cm.doc.sel.ranges[i].head.line;
            var lineRange = {
                anchor: Pos(line, 0),
                head: Pos(line + 1, 0)
            };
            ranges.push(lineRange);
            text.push(cm.getRange(lineRange.anchor, lineRange.head));
        }
        return {
            text: text,
            ranges: ranges
        };
    }
    function disableBrowserMagic(field, spellcheck, autocorrect, autocapitalize) {
        field.setAttribute("autocorrect", autocorrect ? "on" : "off");
        field.setAttribute("autocapitalize", autocapitalize ? "on" : "off");
        field.setAttribute("spellcheck", !!spellcheck);
    }
    function hiddenTextarea() {
        var te = elt("textarea", null, null, "position: absolute; bottom: -1em; padding: 0; width: 1px; height: 1em; min-height: 1em; outline: none");
        var div = elt("div", [
            te
        ], null, "overflow: hidden; position: relative; width: 3px; height: 0px;");
        // The textarea is kept positioned near the cursor to prevent the
        // fact that it'll be scrolled into view on input from scrolling
        // our fake cursor out of view. On webkit, when wrap=off, paste is
        // very slow. So make the area wide instead.
        if (webkit) te.style.width = "1000px";
        else te.setAttribute("wrap", "off");
        // If border: 0; -- iOS fails to open keyboard (issue #1287)
        if (ios) te.style.border = "1px solid black";
        return div;
    }
    // The publicly visible API. Note that methodOp(f) means
    // 'wrap f in an operation, performed on its `this` parameter'.
    // This is not the complete set of editor methods. Most of the
    // methods defined on the Doc type are also injected into
    // CodeMirror.prototype, for backwards compatibility and
    // convenience.
    function addEditorMethods(CodeMirror) {
        var optionHandlers = CodeMirror.optionHandlers;
        var helpers = CodeMirror.helpers = {};
        CodeMirror.prototype = {
            constructor: CodeMirror,
            focus: function() {
                win(this).focus();
                this.display.input.focus();
            },
            setOption: function(option, value) {
                var options = this.options, old = options[option];
                if (options[option] == value && option != "mode") return;
                options[option] = value;
                if (optionHandlers.hasOwnProperty(option)) operation(this, optionHandlers[option])(this, value, old);
                signal(this, "optionChange", this, option);
            },
            getOption: function(option) {
                return this.options[option];
            },
            getDoc: function() {
                return this.doc;
            },
            addKeyMap: function(map, bottom) {
                this.state.keyMaps[bottom ? "push" : "unshift"](getKeyMap(map));
            },
            removeKeyMap: function(map) {
                var maps = this.state.keyMaps;
                for(var i = 0; i < maps.length; ++i)if (maps[i] == map || maps[i].name == map) {
                    maps.splice(i, 1);
                    return true;
                }
            },
            addOverlay: methodOp(function(spec, options) {
                var mode = spec.token ? spec : CodeMirror.getMode(this.options, spec);
                if (mode.startState) throw new Error("Overlays may not be stateful.");
                insertSorted(this.state.overlays, {
                    mode: mode,
                    modeSpec: spec,
                    opaque: options && options.opaque,
                    priority: options && options.priority || 0
                }, function(overlay) {
                    return overlay.priority;
                });
                this.state.modeGen++;
                regChange(this);
            }),
            removeOverlay: methodOp(function(spec) {
                var overlays = this.state.overlays;
                for(var i = 0; i < overlays.length; ++i){
                    var cur = overlays[i].modeSpec;
                    if (cur == spec || typeof spec == "string" && cur.name == spec) {
                        overlays.splice(i, 1);
                        this.state.modeGen++;
                        regChange(this);
                        return;
                    }
                }
            }),
            indentLine: methodOp(function(n, dir, aggressive) {
                if (typeof dir != "string" && typeof dir != "number") {
                    if (dir == null) dir = this.options.smartIndent ? "smart" : "prev";
                    else dir = dir ? "add" : "subtract";
                }
                if (isLine(this.doc, n)) indentLine(this, n, dir, aggressive);
            }),
            indentSelection: methodOp(function(how) {
                var ranges = this.doc.sel.ranges, end = -1;
                for(var i = 0; i < ranges.length; i++){
                    var range = ranges[i];
                    if (!range.empty()) {
                        var from = range.from(), to = range.to();
                        var start = Math.max(end, from.line);
                        end = Math.min(this.lastLine(), to.line - (to.ch ? 0 : 1)) + 1;
                        for(var j = start; j < end; ++j)indentLine(this, j, how);
                        var newRanges = this.doc.sel.ranges;
                        if (from.ch == 0 && ranges.length == newRanges.length && newRanges[i].from().ch > 0) replaceOneSelection(this.doc, i, new Range(from, newRanges[i].to()), sel_dontScroll);
                    } else if (range.head.line > end) {
                        indentLine(this, range.head.line, how, true);
                        end = range.head.line;
                        if (i == this.doc.sel.primIndex) ensureCursorVisible(this);
                    }
                }
            }),
            // Fetch the parser token for a given character. Useful for hacks
            // that want to inspect the mode state (say, for completion).
            getTokenAt: function(pos, precise) {
                return takeToken(this, pos, precise);
            },
            getLineTokens: function(line, precise) {
                return takeToken(this, Pos(line), precise, true);
            },
            getTokenTypeAt: function(pos) {
                pos = clipPos(this.doc, pos);
                var styles = getLineStyles(this, getLine(this.doc, pos.line));
                var before = 0, after = (styles.length - 1) / 2, ch = pos.ch;
                var type;
                if (ch == 0) type = styles[2];
                else for(;;){
                    var mid = before + after >> 1;
                    if ((mid ? styles[mid * 2 - 1] : 0) >= ch) after = mid;
                    else if (styles[mid * 2 + 1] < ch) before = mid + 1;
                    else {
                        type = styles[mid * 2 + 2];
                        break;
                    }
                }
                var cut = type ? type.indexOf("overlay ") : -1;
                return cut < 0 ? type : cut == 0 ? null : type.slice(0, cut - 1);
            },
            getModeAt: function(pos) {
                var mode = this.doc.mode;
                if (!mode.innerMode) return mode;
                return CodeMirror.innerMode(mode, this.getTokenAt(pos).state).mode;
            },
            getHelper: function(pos, type) {
                return this.getHelpers(pos, type)[0];
            },
            getHelpers: function(pos, type) {
                var found = [];
                if (!helpers.hasOwnProperty(type)) return found;
                var help = helpers[type], mode = this.getModeAt(pos);
                if (typeof mode[type] == "string") {
                    if (help[mode[type]]) found.push(help[mode[type]]);
                } else if (mode[type]) for(var i = 0; i < mode[type].length; i++){
                    var val = help[mode[type][i]];
                    if (val) found.push(val);
                }
                else if (mode.helperType && help[mode.helperType]) found.push(help[mode.helperType]);
                else if (help[mode.name]) found.push(help[mode.name]);
                for(var i$1 = 0; i$1 < help._global.length; i$1++){
                    var cur = help._global[i$1];
                    if (cur.pred(mode, this) && indexOf(found, cur.val) == -1) found.push(cur.val);
                }
                return found;
            },
            getStateAfter: function(line, precise) {
                var doc = this.doc;
                line = clipLine(doc, line == null ? doc.first + doc.size - 1 : line);
                return getContextBefore(this, line + 1, precise).state;
            },
            cursorCoords: function(start, mode) {
                var pos, range = this.doc.sel.primary();
                if (start == null) pos = range.head;
                else if (typeof start == "object") pos = clipPos(this.doc, start);
                else pos = start ? range.from() : range.to();
                return cursorCoords(this, pos, mode || "page");
            },
            charCoords: function(pos, mode) {
                return charCoords(this, clipPos(this.doc, pos), mode || "page");
            },
            coordsChar: function(coords, mode) {
                coords = fromCoordSystem(this, coords, mode || "page");
                return coordsChar(this, coords.left, coords.top);
            },
            lineAtHeight: function(height, mode) {
                height = fromCoordSystem(this, {
                    top: height,
                    left: 0
                }, mode || "page").top;
                return lineAtHeight(this.doc, height + this.display.viewOffset);
            },
            heightAtLine: function(line, mode, includeWidgets) {
                var end = false, lineObj;
                if (typeof line == "number") {
                    var last = this.doc.first + this.doc.size - 1;
                    if (line < this.doc.first) line = this.doc.first;
                    else if (line > last) {
                        line = last;
                        end = true;
                    }
                    lineObj = getLine(this.doc, line);
                } else lineObj = line;
                return intoCoordSystem(this, lineObj, {
                    top: 0,
                    left: 0
                }, mode || "page", includeWidgets || end).top + (end ? this.doc.height - heightAtLine(lineObj) : 0);
            },
            defaultTextHeight: function() {
                return textHeight(this.display);
            },
            defaultCharWidth: function() {
                return charWidth(this.display);
            },
            getViewport: function() {
                return {
                    from: this.display.viewFrom,
                    to: this.display.viewTo
                };
            },
            addWidget: function(pos, node, scroll, vert, horiz) {
                var display = this.display;
                pos = cursorCoords(this, clipPos(this.doc, pos));
                var top = pos.bottom, left = pos.left;
                node.style.position = "absolute";
                node.setAttribute("cm-ignore-events", "true");
                this.display.input.setUneditable(node);
                display.sizer.appendChild(node);
                if (vert == "over") top = pos.top;
                else if (vert == "above" || vert == "near") {
                    var vspace = Math.max(display.wrapper.clientHeight, this.doc.height), hspace = Math.max(display.sizer.clientWidth, display.lineSpace.clientWidth);
                    // Default to positioning above (if specified and possible); otherwise default to positioning below
                    if ((vert == 'above' || pos.bottom + node.offsetHeight > vspace) && pos.top > node.offsetHeight) top = pos.top - node.offsetHeight;
                    else if (pos.bottom + node.offsetHeight <= vspace) top = pos.bottom;
                    if (left + node.offsetWidth > hspace) left = hspace - node.offsetWidth;
                }
                node.style.top = top + "px";
                node.style.left = node.style.right = "";
                if (horiz == "right") {
                    left = display.sizer.clientWidth - node.offsetWidth;
                    node.style.right = "0px";
                } else {
                    if (horiz == "left") left = 0;
                    else if (horiz == "middle") left = (display.sizer.clientWidth - node.offsetWidth) / 2;
                    node.style.left = left + "px";
                }
                if (scroll) scrollIntoView(this, {
                    left: left,
                    top: top,
                    right: left + node.offsetWidth,
                    bottom: top + node.offsetHeight
                });
            },
            triggerOnKeyDown: methodOp(onKeyDown),
            triggerOnKeyPress: methodOp(onKeyPress),
            triggerOnKeyUp: onKeyUp,
            triggerOnMouseDown: methodOp(onMouseDown),
            execCommand: function(cmd) {
                if (commands.hasOwnProperty(cmd)) return commands[cmd].call(null, this);
            },
            triggerElectric: methodOp(function(text) {
                triggerElectric(this, text);
            }),
            findPosH: function(from, amount, unit, visually) {
                var dir = 1;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                var cur = clipPos(this.doc, from);
                for(var i = 0; i < amount; ++i){
                    cur = findPosH(this.doc, cur, dir, unit, visually);
                    if (cur.hitSide) break;
                }
                return cur;
            },
            moveH: methodOp(function(dir, unit) {
                var this$1 = this;
                this.extendSelectionsBy(function(range) {
                    if (this$1.display.shift || this$1.doc.extend || range.empty()) return findPosH(this$1.doc, range.head, dir, unit, this$1.options.rtlMoveVisually);
                    else return dir < 0 ? range.from() : range.to();
                }, sel_move);
            }),
            deleteH: methodOp(function(dir, unit) {
                var sel = this.doc.sel, doc = this.doc;
                if (sel.somethingSelected()) doc.replaceSelection("", null, "+delete");
                else deleteNearSelection(this, function(range) {
                    var other = findPosH(doc, range.head, dir, unit, false);
                    return dir < 0 ? {
                        from: other,
                        to: range.head
                    } : {
                        from: range.head,
                        to: other
                    };
                });
            }),
            findPosV: function(from, amount, unit, goalColumn) {
                var dir = 1, x = goalColumn;
                if (amount < 0) {
                    dir = -1;
                    amount = -amount;
                }
                var cur = clipPos(this.doc, from);
                for(var i = 0; i < amount; ++i){
                    var coords = cursorCoords(this, cur, "div");
                    if (x == null) x = coords.left;
                    else coords.left = x;
                    cur = findPosV(this, coords, dir, unit);
                    if (cur.hitSide) break;
                }
                return cur;
            },
            moveV: methodOp(function(dir, unit) {
                var this$1 = this;
                var doc = this.doc, goals = [];
                var collapse = !this.display.shift && !doc.extend && doc.sel.somethingSelected();
                doc.extendSelectionsBy(function(range) {
                    if (collapse) return dir < 0 ? range.from() : range.to();
                    var headPos = cursorCoords(this$1, range.head, "div");
                    if (range.goalColumn != null) headPos.left = range.goalColumn;
                    goals.push(headPos.left);
                    var pos = findPosV(this$1, headPos, dir, unit);
                    if (unit == "page" && range == doc.sel.primary()) addToScrollTop(this$1, charCoords(this$1, pos, "div").top - headPos.top);
                    return pos;
                }, sel_move);
                if (goals.length) for(var i = 0; i < doc.sel.ranges.length; i++)doc.sel.ranges[i].goalColumn = goals[i];
            }),
            // Find the word at the given position (as returned by coordsChar).
            findWordAt: function(pos) {
                var doc = this.doc, line = getLine(doc, pos.line).text;
                var start = pos.ch, end = pos.ch;
                if (line) {
                    var helper = this.getHelper(pos, "wordChars");
                    if ((pos.sticky == "before" || end == line.length) && start) --start;
                    else ++end;
                    var startChar = line.charAt(start);
                    var check = isWordChar(startChar, helper) ? function(ch) {
                        return isWordChar(ch, helper);
                    } : /\s/.test(startChar) ? function(ch) {
                        return /\s/.test(ch);
                    } : function(ch) {
                        return !/\s/.test(ch) && !isWordChar(ch);
                    };
                    while(start > 0 && check(line.charAt(start - 1)))--start;
                    while(end < line.length && check(line.charAt(end)))++end;
                }
                return new Range(Pos(pos.line, start), Pos(pos.line, end));
            },
            toggleOverwrite: function(value) {
                if (value != null && value == this.state.overwrite) return;
                if (this.state.overwrite = !this.state.overwrite) addClass(this.display.cursorDiv, "CodeMirror-overwrite");
                else rmClass(this.display.cursorDiv, "CodeMirror-overwrite");
                signal(this, "overwriteToggle", this, this.state.overwrite);
            },
            hasFocus: function() {
                return this.display.input.getField() == activeElt(root(this));
            },
            isReadOnly: function() {
                return !!(this.options.readOnly || this.doc.cantEdit);
            },
            scrollTo: methodOp(function(x, y) {
                scrollToCoords(this, x, y);
            }),
            getScrollInfo: function() {
                var scroller = this.display.scroller;
                return {
                    left: scroller.scrollLeft,
                    top: scroller.scrollTop,
                    height: scroller.scrollHeight - scrollGap(this) - this.display.barHeight,
                    width: scroller.scrollWidth - scrollGap(this) - this.display.barWidth,
                    clientHeight: displayHeight(this),
                    clientWidth: displayWidth(this)
                };
            },
            scrollIntoView: methodOp(function(range, margin) {
                if (range == null) {
                    range = {
                        from: this.doc.sel.primary().head,
                        to: null
                    };
                    if (margin == null) margin = this.options.cursorScrollMargin;
                } else if (typeof range == "number") range = {
                    from: Pos(range, 0),
                    to: null
                };
                else if (range.from == null) range = {
                    from: range,
                    to: null
                };
                if (!range.to) range.to = range.from;
                range.margin = margin || 0;
                if (range.from.line != null) scrollToRange(this, range);
                else scrollToCoordsRange(this, range.from, range.to, range.margin);
            }),
            setSize: methodOp(function(width, height) {
                var this$1 = this;
                var interpret = function(val) {
                    return typeof val == "number" || /^\d+$/.test(String(val)) ? val + "px" : val;
                };
                if (width != null) this.display.wrapper.style.width = interpret(width);
                if (height != null) this.display.wrapper.style.height = interpret(height);
                if (this.options.lineWrapping) clearLineMeasurementCache(this);
                var lineNo = this.display.viewFrom;
                this.doc.iter(lineNo, this.display.viewTo, function(line) {
                    if (line.widgets) {
                        for(var i = 0; i < line.widgets.length; i++)if (line.widgets[i].noHScroll) {
                            regLineChange(this$1, lineNo, "widget");
                            break;
                        }
                    }
                    ++lineNo;
                });
                this.curOp.forceUpdate = true;
                signal(this, "refresh", this);
            }),
            operation: function(f) {
                return runInOp(this, f);
            },
            startOperation: function() {
                return startOperation(this);
            },
            endOperation: function() {
                return endOperation(this);
            },
            refresh: methodOp(function() {
                var oldHeight = this.display.cachedTextHeight;
                regChange(this);
                this.curOp.forceUpdate = true;
                clearCaches(this);
                scrollToCoords(this, this.doc.scrollLeft, this.doc.scrollTop);
                updateGutterSpace(this.display);
                if (oldHeight == null || Math.abs(oldHeight - textHeight(this.display)) > .5 || this.options.lineWrapping) estimateLineHeights(this);
                signal(this, "refresh", this);
            }),
            swapDoc: methodOp(function(doc) {
                var old = this.doc;
                old.cm = null;
                // Cancel the current text selection if any (#5821)
                if (this.state.selectingText) this.state.selectingText();
                attachDoc(this, doc);
                clearCaches(this);
                this.display.input.reset();
                scrollToCoords(this, doc.scrollLeft, doc.scrollTop);
                this.curOp.forceScroll = true;
                signalLater(this, "swapDoc", this, old);
                return old;
            }),
            phrase: function(phraseText) {
                var phrases = this.options.phrases;
                return phrases && Object.prototype.hasOwnProperty.call(phrases, phraseText) ? phrases[phraseText] : phraseText;
            },
            getInputField: function() {
                return this.display.input.getField();
            },
            getWrapperElement: function() {
                return this.display.wrapper;
            },
            getScrollerElement: function() {
                return this.display.scroller;
            },
            getGutterElement: function() {
                return this.display.gutters;
            }
        };
        eventMixin(CodeMirror);
        CodeMirror.registerHelper = function(type, name, value) {
            if (!helpers.hasOwnProperty(type)) helpers[type] = CodeMirror[type] = {
                _global: []
            };
            helpers[type][name] = value;
        };
        CodeMirror.registerGlobalHelper = function(type, name, predicate, value) {
            CodeMirror.registerHelper(type, name, value);
            helpers[type]._global.push({
                pred: predicate,
                val: value
            });
        };
    }
    // Used for horizontal relative motion. Dir is -1 or 1 (left or
    // right), unit can be "codepoint", "char", "column" (like char, but
    // doesn't cross line boundaries), "word" (across next word), or
    // "group" (to the start of next group of word or
    // non-word-non-whitespace chars). The visually param controls
    // whether, in right-to-left text, direction 1 means to move towards
    // the next index in the string, or towards the character to the right
    // of the current position. The resulting position will have a
    // hitSide=true property if it reached the end of the document.
    function findPosH(doc, pos, dir, unit, visually) {
        var oldPos = pos;
        var origDir = dir;
        var lineObj = getLine(doc, pos.line);
        var lineDir = visually && doc.direction == "rtl" ? -dir : dir;
        function findNextLine() {
            var l = pos.line + lineDir;
            if (l < doc.first || l >= doc.first + doc.size) return false;
            pos = new Pos(l, pos.ch, pos.sticky);
            return lineObj = getLine(doc, l);
        }
        function moveOnce(boundToLine) {
            var next;
            if (unit == "codepoint") {
                var ch = lineObj.text.charCodeAt(pos.ch + (dir > 0 ? 0 : -1));
                if (isNaN(ch)) next = null;
                else {
                    var astral = dir > 0 ? ch >= 0xD800 && ch < 0xDC00 : ch >= 0xDC00 && ch < 0xDFFF;
                    next = new Pos(pos.line, Math.max(0, Math.min(lineObj.text.length, pos.ch + dir * (astral ? 2 : 1))), -dir);
                }
            } else if (visually) next = moveVisually(doc.cm, lineObj, pos, dir);
            else next = moveLogically(lineObj, pos, dir);
            if (next == null) {
                if (!boundToLine && findNextLine()) pos = endOfLine(visually, doc.cm, lineObj, pos.line, lineDir);
                else return false;
            } else pos = next;
            return true;
        }
        if (unit == "char" || unit == "codepoint") moveOnce();
        else if (unit == "column") moveOnce(true);
        else if (unit == "word" || unit == "group") {
            var sawType = null, group = unit == "group";
            var helper = doc.cm && doc.cm.getHelper(pos, "wordChars");
            for(var first = true;; first = false){
                if (dir < 0 && !moveOnce(!first)) break;
                var cur = lineObj.text.charAt(pos.ch) || "\n";
                var type = isWordChar(cur, helper) ? "w" : group && cur == "\n" ? "n" : !group || /\s/.test(cur) ? null : "p";
                if (group && !first && !type) type = "s";
                if (sawType && sawType != type) {
                    if (dir < 0) {
                        dir = 1;
                        moveOnce();
                        pos.sticky = "after";
                    }
                    break;
                }
                if (type) sawType = type;
                if (dir > 0 && !moveOnce(!first)) break;
            }
        }
        var result = skipAtomic(doc, pos, oldPos, origDir, true);
        if (equalCursorPos(oldPos, result)) result.hitSide = true;
        return result;
    }
    // For relative vertical movement. Dir may be -1 or 1. Unit can be
    // "page" or "line". The resulting position will have a hitSide=true
    // property if it reached the end of the document.
    function findPosV(cm, pos, dir, unit) {
        var doc = cm.doc, x = pos.left, y;
        if (unit == "page") {
            var pageSize = Math.min(cm.display.wrapper.clientHeight, win(cm).innerHeight || doc(cm).documentElement.clientHeight);
            var moveAmount = Math.max(pageSize - .5 * textHeight(cm.display), 3);
            y = (dir > 0 ? pos.bottom : pos.top) + dir * moveAmount;
        } else if (unit == "line") y = dir > 0 ? pos.bottom + 3 : pos.top - 3;
        var target;
        for(;;){
            target = coordsChar(cm, x, y);
            if (!target.outside) break;
            if (dir < 0 ? y <= 0 : y >= doc.height) {
                target.hitSide = true;
                break;
            }
            y += dir * 5;
        }
        return target;
    }
    // CONTENTEDITABLE INPUT STYLE
    var ContentEditableInput = function(cm) {
        this.cm = cm;
        this.lastAnchorNode = this.lastAnchorOffset = this.lastFocusNode = this.lastFocusOffset = null;
        this.polling = new Delayed();
        this.composing = null;
        this.gracePeriod = false;
        this.readDOMTimeout = null;
    };
    ContentEditableInput.prototype.init = function(display) {
        var this$1 = this;
        var input = this, cm = input.cm;
        var div = input.div = display.lineDiv;
        div.contentEditable = true;
        disableBrowserMagic(div, cm.options.spellcheck, cm.options.autocorrect, cm.options.autocapitalize);
        function belongsToInput(e) {
            for(var t = e.target; t; t = t.parentNode){
                if (t == div) return true;
                if (/\bCodeMirror-(?:line)?widget\b/.test(t.className)) break;
            }
            return false;
        }
        on(div, "paste", function(e) {
            if (!belongsToInput(e) || signalDOMEvent(cm, e) || handlePaste(e, cm)) return;
            // IE doesn't fire input events, so we schedule a read for the pasted content in this way
            if (ie_version <= 11) setTimeout(operation(cm, function() {
                return this$1.updateFromDOM();
            }), 20);
        });
        on(div, "compositionstart", function(e) {
            this$1.composing = {
                data: e.data,
                done: false
            };
        });
        on(div, "compositionupdate", function(e) {
            if (!this$1.composing) this$1.composing = {
                data: e.data,
                done: false
            };
        });
        on(div, "compositionend", function(e) {
            if (this$1.composing) {
                if (e.data != this$1.composing.data) this$1.readFromDOMSoon();
                this$1.composing.done = true;
            }
        });
        on(div, "touchstart", function() {
            return input.forceCompositionEnd();
        });
        on(div, "input", function() {
            if (!this$1.composing) this$1.readFromDOMSoon();
        });
        function onCopyCut(e) {
            if (!belongsToInput(e) || signalDOMEvent(cm, e)) return;
            if (cm.somethingSelected()) {
                setLastCopied({
                    lineWise: false,
                    text: cm.getSelections()
                });
                if (e.type == "cut") cm.replaceSelection("", null, "cut");
            } else if (!cm.options.lineWiseCopyCut) return;
            else {
                var ranges = copyableRanges(cm);
                setLastCopied({
                    lineWise: true,
                    text: ranges.text
                });
                if (e.type == "cut") cm.operation(function() {
                    cm.setSelections(ranges.ranges, 0, sel_dontScroll);
                    cm.replaceSelection("", null, "cut");
                });
            }
            if (e.clipboardData) {
                e.clipboardData.clearData();
                var content = lastCopied.text.join("\n");
                // iOS exposes the clipboard API, but seems to discard content inserted into it
                e.clipboardData.setData("Text", content);
                if (e.clipboardData.getData("Text") == content) {
                    e.preventDefault();
                    return;
                }
            }
            // Old-fashioned briefly-focus-a-textarea hack
            var kludge = hiddenTextarea(), te = kludge.firstChild;
            disableBrowserMagic(te);
            cm.display.lineSpace.insertBefore(kludge, cm.display.lineSpace.firstChild);
            te.value = lastCopied.text.join("\n");
            var hadFocus = activeElt(rootNode(div));
            selectInput(te);
            setTimeout(function() {
                cm.display.lineSpace.removeChild(kludge);
                hadFocus.focus();
                if (hadFocus == div) input.showPrimarySelection();
            }, 50);
        }
        on(div, "copy", onCopyCut);
        on(div, "cut", onCopyCut);
    };
    ContentEditableInput.prototype.screenReaderLabelChanged = function(label) {
        // Label for screenreaders, accessibility
        if (label) this.div.setAttribute('aria-label', label);
        else this.div.removeAttribute('aria-label');
    };
    ContentEditableInput.prototype.prepareSelection = function() {
        var result = prepareSelection(this.cm, false);
        result.focus = activeElt(rootNode(this.div)) == this.div;
        return result;
    };
    ContentEditableInput.prototype.showSelection = function(info, takeFocus) {
        if (!info || !this.cm.display.view.length) return;
        if (info.focus || takeFocus) this.showPrimarySelection();
        this.showMultipleSelections(info);
    };
    ContentEditableInput.prototype.getSelection = function() {
        return this.cm.display.wrapper.ownerDocument.getSelection();
    };
    ContentEditableInput.prototype.showPrimarySelection = function() {
        var sel = this.getSelection(), cm = this.cm, prim = cm.doc.sel.primary();
        var from = prim.from(), to = prim.to();
        if (cm.display.viewTo == cm.display.viewFrom || from.line >= cm.display.viewTo || to.line < cm.display.viewFrom) {
            sel.removeAllRanges();
            return;
        }
        var curAnchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var curFocus = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (curAnchor && !curAnchor.bad && curFocus && !curFocus.bad && cmp(minPos(curAnchor, curFocus), from) == 0 && cmp(maxPos(curAnchor, curFocus), to) == 0) return;
        var view = cm.display.view;
        var start = from.line >= cm.display.viewFrom && posToDOM(cm, from) || {
            node: view[0].measure.map[2],
            offset: 0
        };
        var end = to.line < cm.display.viewTo && posToDOM(cm, to);
        if (!end) {
            var measure = view[view.length - 1].measure;
            var map = measure.maps ? measure.maps[measure.maps.length - 1] : measure.map;
            end = {
                node: map[map.length - 1],
                offset: map[map.length - 2] - map[map.length - 3]
            };
        }
        if (!start || !end) {
            sel.removeAllRanges();
            return;
        }
        var old = sel.rangeCount && sel.getRangeAt(0), rng;
        try {
            rng = range(start.node, start.offset, end.offset, end.node);
        } catch (e) {} // Our model of the DOM might be outdated, in which case the range we try to set can be impossible
        if (rng) {
            if (!gecko && cm.state.focused) {
                sel.collapse(start.node, start.offset);
                if (!rng.collapsed) {
                    sel.removeAllRanges();
                    sel.addRange(rng);
                }
            } else {
                sel.removeAllRanges();
                sel.addRange(rng);
            }
            if (old && sel.anchorNode == null) sel.addRange(old);
            else if (gecko) this.startGracePeriod();
        }
        this.rememberSelection();
    };
    ContentEditableInput.prototype.startGracePeriod = function() {
        var this$1 = this;
        clearTimeout(this.gracePeriod);
        this.gracePeriod = setTimeout(function() {
            this$1.gracePeriod = false;
            if (this$1.selectionChanged()) this$1.cm.operation(function() {
                return this$1.cm.curOp.selectionChanged = true;
            });
        }, 20);
    };
    ContentEditableInput.prototype.showMultipleSelections = function(info) {
        removeChildrenAndAdd(this.cm.display.cursorDiv, info.cursors);
        removeChildrenAndAdd(this.cm.display.selectionDiv, info.selection);
    };
    ContentEditableInput.prototype.rememberSelection = function() {
        var sel = this.getSelection();
        this.lastAnchorNode = sel.anchorNode;
        this.lastAnchorOffset = sel.anchorOffset;
        this.lastFocusNode = sel.focusNode;
        this.lastFocusOffset = sel.focusOffset;
    };
    ContentEditableInput.prototype.selectionInEditor = function() {
        var sel = this.getSelection();
        if (!sel.rangeCount) return false;
        var node = sel.getRangeAt(0).commonAncestorContainer;
        return contains(this.div, node);
    };
    ContentEditableInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor") {
            if (!this.selectionInEditor() || activeElt(rootNode(this.div)) != this.div) this.showSelection(this.prepareSelection(), true);
            this.div.focus();
        }
    };
    ContentEditableInput.prototype.blur = function() {
        this.div.blur();
    };
    ContentEditableInput.prototype.getField = function() {
        return this.div;
    };
    ContentEditableInput.prototype.supportsTouch = function() {
        return true;
    };
    ContentEditableInput.prototype.receivedFocus = function() {
        var this$1 = this;
        var input = this;
        if (this.selectionInEditor()) setTimeout(function() {
            return this$1.pollSelection();
        }, 20);
        else runInOp(this.cm, function() {
            return input.cm.curOp.selectionChanged = true;
        });
        function poll() {
            if (input.cm.state.focused) {
                input.pollSelection();
                input.polling.set(input.cm.options.pollInterval, poll);
            }
        }
        this.polling.set(this.cm.options.pollInterval, poll);
    };
    ContentEditableInput.prototype.selectionChanged = function() {
        var sel = this.getSelection();
        return sel.anchorNode != this.lastAnchorNode || sel.anchorOffset != this.lastAnchorOffset || sel.focusNode != this.lastFocusNode || sel.focusOffset != this.lastFocusOffset;
    };
    ContentEditableInput.prototype.pollSelection = function() {
        if (this.readDOMTimeout != null || this.gracePeriod || !this.selectionChanged()) return;
        var sel = this.getSelection(), cm = this.cm;
        // On Android Chrome (version 56, at least), backspacing into an
        // uneditable block element will put the cursor in that element,
        // and then, because it's not editable, hide the virtual keyboard.
        // Because Android doesn't allow us to actually detect backspace
        // presses in a sane way, this code checks for when that happens
        // and simulates a backspace press in this case.
        if (android && chrome && this.cm.display.gutterSpecs.length && isInGutter(sel.anchorNode)) {
            this.cm.triggerOnKeyDown({
                type: "keydown",
                keyCode: 8,
                preventDefault: Math.abs
            });
            this.blur();
            this.focus();
            return;
        }
        if (this.composing) return;
        this.rememberSelection();
        var anchor = domToPos(cm, sel.anchorNode, sel.anchorOffset);
        var head = domToPos(cm, sel.focusNode, sel.focusOffset);
        if (anchor && head) runInOp(cm, function() {
            setSelection(cm.doc, simpleSelection(anchor, head), sel_dontScroll);
            if (anchor.bad || head.bad) cm.curOp.selectionChanged = true;
        });
    };
    ContentEditableInput.prototype.pollContent = function() {
        if (this.readDOMTimeout != null) {
            clearTimeout(this.readDOMTimeout);
            this.readDOMTimeout = null;
        }
        var cm = this.cm, display = cm.display, sel = cm.doc.sel.primary();
        var from = sel.from(), to = sel.to();
        if (from.ch == 0 && from.line > cm.firstLine()) from = Pos(from.line - 1, getLine(cm.doc, from.line - 1).length);
        if (to.ch == getLine(cm.doc, to.line).text.length && to.line < cm.lastLine()) to = Pos(to.line + 1, 0);
        if (from.line < display.viewFrom || to.line > display.viewTo - 1) return false;
        var fromIndex, fromLine, fromNode;
        if (from.line == display.viewFrom || (fromIndex = findViewIndex(cm, from.line)) == 0) {
            fromLine = lineNo(display.view[0].line);
            fromNode = display.view[0].node;
        } else {
            fromLine = lineNo(display.view[fromIndex].line);
            fromNode = display.view[fromIndex - 1].node.nextSibling;
        }
        var toIndex = findViewIndex(cm, to.line);
        var toLine, toNode;
        if (toIndex == display.view.length - 1) {
            toLine = display.viewTo - 1;
            toNode = display.lineDiv.lastChild;
        } else {
            toLine = lineNo(display.view[toIndex + 1].line) - 1;
            toNode = display.view[toIndex + 1].node.previousSibling;
        }
        if (!fromNode) return false;
        var newText = cm.doc.splitLines(domTextBetween(cm, fromNode, toNode, fromLine, toLine));
        var oldText = getBetween(cm.doc, Pos(fromLine, 0), Pos(toLine, getLine(cm.doc, toLine).text.length));
        while(newText.length > 1 && oldText.length > 1){
            if (lst(newText) == lst(oldText)) {
                newText.pop();
                oldText.pop();
                toLine--;
            } else if (newText[0] == oldText[0]) {
                newText.shift();
                oldText.shift();
                fromLine++;
            } else break;
        }
        var cutFront = 0, cutEnd = 0;
        var newTop = newText[0], oldTop = oldText[0], maxCutFront = Math.min(newTop.length, oldTop.length);
        while(cutFront < maxCutFront && newTop.charCodeAt(cutFront) == oldTop.charCodeAt(cutFront))++cutFront;
        var newBot = lst(newText), oldBot = lst(oldText);
        var maxCutEnd = Math.min(newBot.length - (newText.length == 1 ? cutFront : 0), oldBot.length - (oldText.length == 1 ? cutFront : 0));
        while(cutEnd < maxCutEnd && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1))++cutEnd;
        // Try to move start of change to start of selection if ambiguous
        if (newText.length == 1 && oldText.length == 1 && fromLine == from.line) while(cutFront && cutFront > from.ch && newBot.charCodeAt(newBot.length - cutEnd - 1) == oldBot.charCodeAt(oldBot.length - cutEnd - 1)){
            cutFront--;
            cutEnd++;
        }
        newText[newText.length - 1] = newBot.slice(0, newBot.length - cutEnd).replace(/^\u200b+/, "");
        newText[0] = newText[0].slice(cutFront).replace(/\u200b+$/, "");
        var chFrom = Pos(fromLine, cutFront);
        var chTo = Pos(toLine, oldText.length ? lst(oldText).length - cutEnd : 0);
        if (newText.length > 1 || newText[0] || cmp(chFrom, chTo)) {
            replaceRange(cm.doc, newText, chFrom, chTo, "+input");
            return true;
        }
    };
    ContentEditableInput.prototype.ensurePolled = function() {
        this.forceCompositionEnd();
    };
    ContentEditableInput.prototype.reset = function() {
        this.forceCompositionEnd();
    };
    ContentEditableInput.prototype.forceCompositionEnd = function() {
        if (!this.composing) return;
        clearTimeout(this.readDOMTimeout);
        this.composing = null;
        this.updateFromDOM();
        this.div.blur();
        this.div.focus();
    };
    ContentEditableInput.prototype.readFromDOMSoon = function() {
        var this$1 = this;
        if (this.readDOMTimeout != null) return;
        this.readDOMTimeout = setTimeout(function() {
            this$1.readDOMTimeout = null;
            if (this$1.composing) {
                if (this$1.composing.done) this$1.composing = null;
                else return;
            }
            this$1.updateFromDOM();
        }, 80);
    };
    ContentEditableInput.prototype.updateFromDOM = function() {
        var this$1 = this;
        if (this.cm.isReadOnly() || !this.pollContent()) runInOp(this.cm, function() {
            return regChange(this$1.cm);
        });
    };
    ContentEditableInput.prototype.setUneditable = function(node) {
        node.contentEditable = "false";
    };
    ContentEditableInput.prototype.onKeyPress = function(e) {
        if (e.charCode == 0 || this.composing) return;
        e.preventDefault();
        if (!this.cm.isReadOnly()) operation(this.cm, applyTextInput)(this.cm, String.fromCharCode(e.charCode == null ? e.keyCode : e.charCode), 0);
    };
    ContentEditableInput.prototype.readOnlyChanged = function(val) {
        this.div.contentEditable = String(val != "nocursor");
    };
    ContentEditableInput.prototype.onContextMenu = function() {};
    ContentEditableInput.prototype.resetPosition = function() {};
    ContentEditableInput.prototype.needsContentAttribute = true;
    function posToDOM(cm, pos) {
        var view = findViewForLine(cm, pos.line);
        if (!view || view.hidden) return null;
        var line = getLine(cm.doc, pos.line);
        var info = mapFromLineView(view, line, pos.line);
        var order = getOrder(line, cm.doc.direction), side = "left";
        if (order) {
            var partPos = getBidiPartAt(order, pos.ch);
            side = partPos % 2 ? "right" : "left";
        }
        var result = nodeAndOffsetInLineMap(info.map, pos.ch, side);
        result.offset = result.collapse == "right" ? result.end : result.start;
        return result;
    }
    function isInGutter(node) {
        for(var scan = node; scan; scan = scan.parentNode){
            if (/CodeMirror-gutter-wrapper/.test(scan.className)) return true;
        }
        return false;
    }
    function badPos(pos, bad) {
        if (bad) pos.bad = true;
        return pos;
    }
    function domTextBetween(cm, from, to, fromLine, toLine) {
        var text = "", closing = false, lineSep = cm.doc.lineSeparator(), extraLinebreak = false;
        function recognizeMarker(id) {
            return function(marker) {
                return marker.id == id;
            };
        }
        function close() {
            if (closing) {
                text += lineSep;
                if (extraLinebreak) text += lineSep;
                closing = extraLinebreak = false;
            }
        }
        function addText(str) {
            if (str) {
                close();
                text += str;
            }
        }
        function walk(node) {
            if (node.nodeType == 1) {
                var cmText = node.getAttribute("cm-text");
                if (cmText) {
                    addText(cmText);
                    return;
                }
                var markerID = node.getAttribute("cm-marker"), range;
                if (markerID) {
                    var found = cm.findMarks(Pos(fromLine, 0), Pos(toLine + 1, 0), recognizeMarker(+markerID));
                    if (found.length && (range = found[0].find(0))) addText(getBetween(cm.doc, range.from, range.to).join(lineSep));
                    return;
                }
                if (node.getAttribute("contenteditable") == "false") return;
                var isBlock = /^(pre|div|p|li|table|br)$/i.test(node.nodeName);
                if (!/^br$/i.test(node.nodeName) && node.textContent.length == 0) return;
                if (isBlock) close();
                for(var i = 0; i < node.childNodes.length; i++)walk(node.childNodes[i]);
                if (/^(pre|p)$/i.test(node.nodeName)) extraLinebreak = true;
                if (isBlock) closing = true;
            } else if (node.nodeType == 3) addText(node.nodeValue.replace(/\u200b/g, "").replace(/\u00a0/g, " "));
        }
        for(;;){
            walk(from);
            if (from == to) break;
            from = from.nextSibling;
            extraLinebreak = false;
        }
        return text;
    }
    function domToPos(cm, node, offset) {
        var lineNode;
        if (node == cm.display.lineDiv) {
            lineNode = cm.display.lineDiv.childNodes[offset];
            if (!lineNode) return badPos(cm.clipPos(Pos(cm.display.viewTo - 1)), true);
            node = null;
            offset = 0;
        } else for(lineNode = node;; lineNode = lineNode.parentNode){
            if (!lineNode || lineNode == cm.display.lineDiv) return null;
            if (lineNode.parentNode && lineNode.parentNode == cm.display.lineDiv) break;
        }
        for(var i = 0; i < cm.display.view.length; i++){
            var lineView = cm.display.view[i];
            if (lineView.node == lineNode) return locateNodeInLineView(lineView, node, offset);
        }
    }
    function locateNodeInLineView(lineView, node, offset) {
        var wrapper = lineView.text.firstChild, bad = false;
        if (!node || !contains(wrapper, node)) return badPos(Pos(lineNo(lineView.line), 0), true);
        if (node == wrapper) {
            bad = true;
            node = wrapper.childNodes[offset];
            offset = 0;
            if (!node) {
                var line = lineView.rest ? lst(lineView.rest) : lineView.line;
                return badPos(Pos(lineNo(line), line.text.length), bad);
            }
        }
        var textNode = node.nodeType == 3 ? node : null, topNode = node;
        if (!textNode && node.childNodes.length == 1 && node.firstChild.nodeType == 3) {
            textNode = node.firstChild;
            if (offset) offset = textNode.nodeValue.length;
        }
        while(topNode.parentNode != wrapper)topNode = topNode.parentNode;
        var measure = lineView.measure, maps = measure.maps;
        function find(textNode, topNode, offset) {
            for(var i = -1; i < (maps ? maps.length : 0); i++){
                var map = i < 0 ? measure.map : maps[i];
                for(var j = 0; j < map.length; j += 3){
                    var curNode = map[j + 2];
                    if (curNode == textNode || curNode == topNode) {
                        var line = lineNo(i < 0 ? lineView.line : lineView.rest[i]);
                        var ch = map[j] + offset;
                        if (offset < 0 || curNode != textNode) ch = map[j + (offset ? 1 : 0)];
                        return Pos(line, ch);
                    }
                }
            }
        }
        var found = find(textNode, topNode, offset);
        if (found) return badPos(found, bad);
        // FIXME this is all really shaky. might handle the few cases it needs to handle, but likely to cause problems
        for(var after = topNode.nextSibling, dist = textNode ? textNode.nodeValue.length - offset : 0; after; after = after.nextSibling){
            found = find(after, after.firstChild, 0);
            if (found) return badPos(Pos(found.line, found.ch - dist), bad);
            else dist += after.textContent.length;
        }
        for(var before = topNode.previousSibling, dist$1 = offset; before; before = before.previousSibling){
            found = find(before, before.firstChild, -1);
            if (found) return badPos(Pos(found.line, found.ch + dist$1), bad);
            else dist$1 += before.textContent.length;
        }
    }
    // TEXTAREA INPUT STYLE
    var TextareaInput = function(cm) {
        this.cm = cm;
        // See input.poll and input.reset
        this.prevInput = "";
        // Flag that indicates whether we expect input to appear real soon
        // now (after some event like 'keypress' or 'input') and are
        // polling intensively.
        this.pollingFast = false;
        // Self-resetting timeout for the poller
        this.polling = new Delayed();
        // Used to work around IE issue with selection being forgotten when focus moves away from textarea
        this.hasSelection = false;
        this.composing = null;
        this.resetting = false;
    };
    TextareaInput.prototype.init = function(display) {
        var this$1 = this;
        var input = this, cm = this.cm;
        this.createField(display);
        var te = this.textarea;
        display.wrapper.insertBefore(this.wrapper, display.wrapper.firstChild);
        // Needed to hide big blue blinking cursor on Mobile Safari (doesn't seem to work in iOS 8 anymore)
        if (ios) te.style.width = "0px";
        on(te, "input", function() {
            if (ie && ie_version >= 9 && this$1.hasSelection) this$1.hasSelection = null;
            input.poll();
        });
        on(te, "paste", function(e) {
            if (signalDOMEvent(cm, e) || handlePaste(e, cm)) return;
            cm.state.pasteIncoming = +new Date;
            input.fastPoll();
        });
        function prepareCopyCut(e) {
            if (signalDOMEvent(cm, e)) return;
            if (cm.somethingSelected()) setLastCopied({
                lineWise: false,
                text: cm.getSelections()
            });
            else if (!cm.options.lineWiseCopyCut) return;
            else {
                var ranges = copyableRanges(cm);
                setLastCopied({
                    lineWise: true,
                    text: ranges.text
                });
                if (e.type == "cut") cm.setSelections(ranges.ranges, null, sel_dontScroll);
                else {
                    input.prevInput = "";
                    te.value = ranges.text.join("\n");
                    selectInput(te);
                }
            }
            if (e.type == "cut") cm.state.cutIncoming = +new Date;
        }
        on(te, "cut", prepareCopyCut);
        on(te, "copy", prepareCopyCut);
        on(display.scroller, "paste", function(e) {
            if (eventInWidget(display, e) || signalDOMEvent(cm, e)) return;
            if (!te.dispatchEvent) {
                cm.state.pasteIncoming = +new Date;
                input.focus();
                return;
            }
            // Pass the `paste` event to the textarea so it's handled by its event listener.
            var event = new Event("paste");
            event.clipboardData = e.clipboardData;
            te.dispatchEvent(event);
        });
        // Prevent normal selection in the editor (we handle our own)
        on(display.lineSpace, "selectstart", function(e) {
            if (!eventInWidget(display, e)) e_preventDefault(e);
        });
        on(te, "compositionstart", function() {
            var start = cm.getCursor("from");
            if (input.composing) input.composing.range.clear();
            input.composing = {
                start: start,
                range: cm.markText(start, cm.getCursor("to"), {
                    className: "CodeMirror-composing"
                })
            };
        });
        on(te, "compositionend", function() {
            if (input.composing) {
                input.poll();
                input.composing.range.clear();
                input.composing = null;
            }
        });
    };
    TextareaInput.prototype.createField = function(_display) {
        // Wraps and hides input textarea
        this.wrapper = hiddenTextarea();
        // The semihidden textarea that is focused when the editor is
        // focused, and receives input.
        this.textarea = this.wrapper.firstChild;
        var opts = this.cm.options;
        disableBrowserMagic(this.textarea, opts.spellcheck, opts.autocorrect, opts.autocapitalize);
    };
    TextareaInput.prototype.screenReaderLabelChanged = function(label) {
        // Label for screenreaders, accessibility
        if (label) this.textarea.setAttribute('aria-label', label);
        else this.textarea.removeAttribute('aria-label');
    };
    TextareaInput.prototype.prepareSelection = function() {
        // Redraw the selection and/or cursor
        var cm = this.cm, display = cm.display, doc = cm.doc;
        var result = prepareSelection(cm);
        // Move the hidden textarea near the cursor to prevent scrolling artifacts
        if (cm.options.moveInputWithCursor) {
            var headPos = cursorCoords(cm, doc.sel.primary().head, "div");
            var wrapOff = display.wrapper.getBoundingClientRect(), lineOff = display.lineDiv.getBoundingClientRect();
            result.teTop = Math.max(0, Math.min(display.wrapper.clientHeight - 10, headPos.top + lineOff.top - wrapOff.top));
            result.teLeft = Math.max(0, Math.min(display.wrapper.clientWidth - 10, headPos.left + lineOff.left - wrapOff.left));
        }
        return result;
    };
    TextareaInput.prototype.showSelection = function(drawn) {
        var cm = this.cm, display = cm.display;
        removeChildrenAndAdd(display.cursorDiv, drawn.cursors);
        removeChildrenAndAdd(display.selectionDiv, drawn.selection);
        if (drawn.teTop != null) {
            this.wrapper.style.top = drawn.teTop + "px";
            this.wrapper.style.left = drawn.teLeft + "px";
        }
    };
    // Reset the input to correspond to the selection (or to be empty,
    // when not typing and nothing is selected)
    TextareaInput.prototype.reset = function(typing) {
        if (this.contextMenuPending || this.composing && typing) return;
        var cm = this.cm;
        this.resetting = true;
        if (cm.somethingSelected()) {
            this.prevInput = "";
            var content = cm.getSelection();
            this.textarea.value = content;
            if (cm.state.focused) selectInput(this.textarea);
            if (ie && ie_version >= 9) this.hasSelection = content;
        } else if (!typing) {
            this.prevInput = this.textarea.value = "";
            if (ie && ie_version >= 9) this.hasSelection = null;
        }
        this.resetting = false;
    };
    TextareaInput.prototype.getField = function() {
        return this.textarea;
    };
    TextareaInput.prototype.supportsTouch = function() {
        return false;
    };
    TextareaInput.prototype.focus = function() {
        if (this.cm.options.readOnly != "nocursor" && (!mobile || activeElt(rootNode(this.textarea)) != this.textarea)) try {
            this.textarea.focus();
        } catch (e) {} // IE8 will throw if the textarea is display: none or not in DOM
    };
    TextareaInput.prototype.blur = function() {
        this.textarea.blur();
    };
    TextareaInput.prototype.resetPosition = function() {
        this.wrapper.style.top = this.wrapper.style.left = 0;
    };
    TextareaInput.prototype.receivedFocus = function() {
        this.slowPoll();
    };
    // Poll for input changes, using the normal rate of polling. This
    // runs as long as the editor is focused.
    TextareaInput.prototype.slowPoll = function() {
        var this$1 = this;
        if (this.pollingFast) return;
        this.polling.set(this.cm.options.pollInterval, function() {
            this$1.poll();
            if (this$1.cm.state.focused) this$1.slowPoll();
        });
    };
    // When an event has just come in that is likely to add or change
    // something in the input textarea, we poll faster, to ensure that
    // the change appears on the screen quickly.
    TextareaInput.prototype.fastPoll = function() {
        var missed = false, input = this;
        input.pollingFast = true;
        function p() {
            var changed = input.poll();
            if (!changed && !missed) {
                missed = true;
                input.polling.set(60, p);
            } else {
                input.pollingFast = false;
                input.slowPoll();
            }
        }
        input.polling.set(20, p);
    };
    // Read input from the textarea, and update the document to match.
    // When something is selected, it is present in the textarea, and
    // selected (unless it is huge, in which case a placeholder is
    // used). When nothing is selected, the cursor sits after previously
    // seen text (can be empty), which is stored in prevInput (we must
    // not reset the textarea when typing, because that breaks IME).
    TextareaInput.prototype.poll = function() {
        var this$1 = this;
        var cm = this.cm, input = this.textarea, prevInput = this.prevInput;
        // Since this is called a *lot*, try to bail out as cheaply as
        // possible when it is clear that nothing happened. hasSelection
        // will be the case when there is a lot of text in the textarea,
        // in which case reading its value would be expensive.
        if (this.contextMenuPending || this.resetting || !cm.state.focused || hasSelection(input) && !prevInput && !this.composing || cm.isReadOnly() || cm.options.disableInput || cm.state.keySeq) return false;
        var text = input.value;
        // If nothing changed, bail.
        if (text == prevInput && !cm.somethingSelected()) return false;
        // Work around nonsensical selection resetting in IE9/10, and
        // inexplicable appearance of private area unicode characters on
        // some key combos in Mac (#2689).
        if (ie && ie_version >= 9 && this.hasSelection === text || mac && /[\uf700-\uf7ff]/.test(text)) {
            cm.display.input.reset();
            return false;
        }
        if (cm.doc.sel == cm.display.selForContextMenu) {
            var first = text.charCodeAt(0);
            if (first == 0x200b && !prevInput) prevInput = "\u200b";
            if (first == 0x21da) {
                this.reset();
                return this.cm.execCommand("undo");
            }
        }
        // Find the part of the input that is actually new
        var same = 0, l = Math.min(prevInput.length, text.length);
        while(same < l && prevInput.charCodeAt(same) == text.charCodeAt(same))++same;
        runInOp(cm, function() {
            applyTextInput(cm, text.slice(same), prevInput.length - same, null, this$1.composing ? "*compose" : null);
            // Don't leave long text in the textarea, since it makes further polling slow
            if (text.length > 1000 || text.indexOf("\n") > -1) input.value = this$1.prevInput = "";
            else this$1.prevInput = text;
            if (this$1.composing) {
                this$1.composing.range.clear();
                this$1.composing.range = cm.markText(this$1.composing.start, cm.getCursor("to"), {
                    className: "CodeMirror-composing"
                });
            }
        });
        return true;
    };
    TextareaInput.prototype.ensurePolled = function() {
        if (this.pollingFast && this.poll()) this.pollingFast = false;
    };
    TextareaInput.prototype.onKeyPress = function() {
        if (ie && ie_version >= 9) this.hasSelection = null;
        this.fastPoll();
    };
    TextareaInput.prototype.onContextMenu = function(e) {
        var input = this, cm = input.cm, display = cm.display, te = input.textarea;
        if (input.contextMenuPending) input.contextMenuPending();
        var pos = posFromMouse(cm, e), scrollPos = display.scroller.scrollTop;
        if (!pos || presto) return;
         // Opera is difficult.
        // Reset the current text selection only if the click is done outside of the selection
        // and 'resetSelectionOnContextMenu' option is true.
        var reset = cm.options.resetSelectionOnContextMenu;
        if (reset && cm.doc.sel.contains(pos) == -1) operation(cm, setSelection)(cm.doc, simpleSelection(pos), sel_dontScroll);
        var oldCSS = te.style.cssText, oldWrapperCSS = input.wrapper.style.cssText;
        var wrapperBox = input.wrapper.offsetParent.getBoundingClientRect();
        input.wrapper.style.cssText = "position: static";
        te.style.cssText = "position: absolute; width: 30px; height: 30px;\n      top: " + (e.clientY - wrapperBox.top - 5) + "px; left: " + (e.clientX - wrapperBox.left - 5) + "px;\n      z-index: 1000; background: " + (ie ? "rgba(255, 255, 255, .05)" : "transparent") + ";\n      outline: none; border-width: 0; outline: none; overflow: hidden; opacity: .05; filter: alpha(opacity=5);";
        var oldScrollY;
        if (webkit) oldScrollY = te.ownerDocument.defaultView.scrollY;
         // Work around Chrome issue (#2712)
        display.input.focus();
        if (webkit) te.ownerDocument.defaultView.scrollTo(null, oldScrollY);
        display.input.reset();
        // Adds "Select all" to context menu in FF
        if (!cm.somethingSelected()) te.value = input.prevInput = " ";
        input.contextMenuPending = rehide;
        display.selForContextMenu = cm.doc.sel;
        clearTimeout(display.detectingSelectAll);
        // Select-all will be greyed out if there's nothing to select, so
        // this adds a zero-width space so that we can later check whether
        // it got selected.
        function prepareSelectAllHack() {
            if (te.selectionStart != null) {
                var selected = cm.somethingSelected();
                var extval = "\u200b" + (selected ? te.value : "");
                te.value = "\u21da"; // Used to catch context-menu undo
                te.value = extval;
                input.prevInput = selected ? "" : "\u200b";
                te.selectionStart = 1;
                te.selectionEnd = extval.length;
                // Re-set this, in case some other handler touched the
                // selection in the meantime.
                display.selForContextMenu = cm.doc.sel;
            }
        }
        function rehide() {
            if (input.contextMenuPending != rehide) return;
            input.contextMenuPending = false;
            input.wrapper.style.cssText = oldWrapperCSS;
            te.style.cssText = oldCSS;
            if (ie && ie_version < 9) display.scrollbars.setScrollTop(display.scroller.scrollTop = scrollPos);
            // Try to detect the user choosing select-all
            if (te.selectionStart != null) {
                if (!ie || ie && ie_version < 9) prepareSelectAllHack();
                var i = 0, poll = function() {
                    if (display.selForContextMenu == cm.doc.sel && te.selectionStart == 0 && te.selectionEnd > 0 && input.prevInput == "\u200b") operation(cm, selectAll)(cm);
                    else if (i++ < 10) display.detectingSelectAll = setTimeout(poll, 500);
                    else {
                        display.selForContextMenu = null;
                        display.input.reset();
                    }
                };
                display.detectingSelectAll = setTimeout(poll, 200);
            }
        }
        if (ie && ie_version >= 9) prepareSelectAllHack();
        if (captureRightClick) {
            e_stop(e);
            var mouseup = function() {
                off(window, "mouseup", mouseup);
                setTimeout(rehide, 20);
            };
            on(window, "mouseup", mouseup);
        } else setTimeout(rehide, 50);
    };
    TextareaInput.prototype.readOnlyChanged = function(val) {
        if (!val) this.reset();
        this.textarea.disabled = val == "nocursor";
        this.textarea.readOnly = !!val;
    };
    TextareaInput.prototype.setUneditable = function() {};
    TextareaInput.prototype.needsContentAttribute = false;
    function fromTextArea(textarea, options) {
        options = options ? copyObj(options) : {};
        options.value = textarea.value;
        if (!options.tabindex && textarea.tabIndex) options.tabindex = textarea.tabIndex;
        if (!options.placeholder && textarea.placeholder) options.placeholder = textarea.placeholder;
        // Set autofocus to true if this textarea is focused, or if it has
        // autofocus and no other element is focused.
        if (options.autofocus == null) {
            var hasFocus = activeElt(rootNode(textarea));
            options.autofocus = hasFocus == textarea || textarea.getAttribute("autofocus") != null && hasFocus == document.body;
        }
        function save() {
            textarea.value = cm.getValue();
        }
        var realSubmit;
        if (textarea.form) {
            on(textarea.form, "submit", save);
            // Deplorable hack to make the submit method do the right thing.
            if (!options.leaveSubmitMethodAlone) {
                var form = textarea.form;
                realSubmit = form.submit;
                try {
                    var wrappedSubmit = form.submit = function() {
                        save();
                        form.submit = realSubmit;
                        form.submit();
                        form.submit = wrappedSubmit;
                    };
                } catch (e) {}
            }
        }
        options.finishInit = function(cm) {
            cm.save = save;
            cm.getTextArea = function() {
                return textarea;
            };
            cm.toTextArea = function() {
                cm.toTextArea = isNaN; // Prevent this from being ran twice
                save();
                textarea.parentNode.removeChild(cm.getWrapperElement());
                textarea.style.display = "";
                if (textarea.form) {
                    off(textarea.form, "submit", save);
                    if (!options.leaveSubmitMethodAlone && typeof textarea.form.submit == "function") textarea.form.submit = realSubmit;
                }
            };
        };
        textarea.style.display = "none";
        var cm = CodeMirror(function(node) {
            return textarea.parentNode.insertBefore(node, textarea.nextSibling);
        }, options);
        return cm;
    }
    function addLegacyProps(CodeMirror) {
        CodeMirror.off = off;
        CodeMirror.on = on;
        CodeMirror.wheelEventPixels = wheelEventPixels;
        CodeMirror.Doc = Doc;
        CodeMirror.splitLines = splitLinesAuto;
        CodeMirror.countColumn = countColumn;
        CodeMirror.findColumn = findColumn;
        CodeMirror.isWordChar = isWordCharBasic;
        CodeMirror.Pass = Pass;
        CodeMirror.signal = signal;
        CodeMirror.Line = Line;
        CodeMirror.changeEnd = changeEnd;
        CodeMirror.scrollbarModel = scrollbarModel;
        CodeMirror.Pos = Pos;
        CodeMirror.cmpPos = cmp;
        CodeMirror.modes = modes;
        CodeMirror.mimeModes = mimeModes;
        CodeMirror.resolveMode = resolveMode;
        CodeMirror.getMode = getMode;
        CodeMirror.modeExtensions = modeExtensions;
        CodeMirror.extendMode = extendMode;
        CodeMirror.copyState = copyState;
        CodeMirror.startState = startState;
        CodeMirror.innerMode = innerMode;
        CodeMirror.commands = commands;
        CodeMirror.keyMap = keyMap;
        CodeMirror.keyName = keyName;
        CodeMirror.isModifierKey = isModifierKey;
        CodeMirror.lookupKey = lookupKey;
        CodeMirror.normalizeKeyMap = normalizeKeyMap;
        CodeMirror.StringStream = StringStream;
        CodeMirror.SharedTextMarker = SharedTextMarker;
        CodeMirror.TextMarker = TextMarker;
        CodeMirror.LineWidget = LineWidget;
        CodeMirror.e_preventDefault = e_preventDefault;
        CodeMirror.e_stopPropagation = e_stopPropagation;
        CodeMirror.e_stop = e_stop;
        CodeMirror.addClass = addClass;
        CodeMirror.contains = contains;
        CodeMirror.rmClass = rmClass;
        CodeMirror.keyNames = keyNames;
    }
    // EDITOR CONSTRUCTOR
    defineOptions(CodeMirror);
    addEditorMethods(CodeMirror);
    // Set up methods on CodeMirror's prototype to redirect to the editor's document.
    var dontDelegate = "iter insert remove copy getEditor constructor".split(" ");
    for(var prop in Doc.prototype)if (Doc.prototype.hasOwnProperty(prop) && indexOf(dontDelegate, prop) < 0) CodeMirror.prototype[prop] = function(method) {
        return function() {
            return method.apply(this.doc, arguments);
        };
    }(Doc.prototype[prop]);
    eventMixin(Doc);
    CodeMirror.inputStyles = {
        "textarea": TextareaInput,
        "contenteditable": ContentEditableInput
    };
    // Extra arguments are stored as the mode's dependencies, which is
    // used by (legacy) mechanisms like loadmode.js to automatically
    // load a mode. (Preferred mechanism is the require/define calls.)
    CodeMirror.defineMode = function(name /*, mode, …*/ ) {
        if (!CodeMirror.defaults.mode && name != "null") CodeMirror.defaults.mode = name;
        defineMode.apply(this, arguments);
    };
    CodeMirror.defineMIME = defineMIME;
    // Minimal default mode.
    CodeMirror.defineMode("null", function() {
        return {
            token: function(stream) {
                return stream.skipToEnd();
            }
        };
    });
    CodeMirror.defineMIME("text/plain", "null");
    // EXTENSIONS
    CodeMirror.defineExtension = function(name, func) {
        CodeMirror.prototype[name] = func;
    };
    CodeMirror.defineDocExtension = function(name, func) {
        Doc.prototype[name] = func;
    };
    CodeMirror.fromTextArea = fromTextArea;
    addLegacyProps(CodeMirror);
    CodeMirror.version = "5.65.18";
    return CodeMirror;
});

});

parcelRegister("4KDU0", function(module, exports) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")));
})(function(CodeMirror) {
    "use strict";
    function doFold(cm, pos, options, force) {
        if (options && options.call) {
            var finder = options;
            options = null;
        } else var finder = getOption(cm, options, "rangeFinder");
        if (typeof pos == "number") pos = CodeMirror.Pos(pos, 0);
        var minSize = getOption(cm, options, "minFoldSize");
        function getRange(allowFolded) {
            var range = finder(cm, pos);
            if (!range || range.to.line - range.from.line < minSize) return null;
            if (force === "fold") return range;
            var marks = cm.findMarksAt(range.from);
            for(var i = 0; i < marks.length; ++i)if (marks[i].__isFold) {
                if (!allowFolded) return null;
                range.cleared = true;
                marks[i].clear();
            }
            return range;
        }
        var range = getRange(true);
        if (getOption(cm, options, "scanUp")) while(!range && pos.line > cm.firstLine()){
            pos = CodeMirror.Pos(pos.line - 1, 0);
            range = getRange(false);
        }
        if (!range || range.cleared || force === "unfold") return;
        var myWidget = makeWidget(cm, options, range);
        CodeMirror.on(myWidget, "mousedown", function(e) {
            myRange.clear();
            CodeMirror.e_preventDefault(e);
        });
        var myRange = cm.markText(range.from, range.to, {
            replacedWith: myWidget,
            clearOnEnter: getOption(cm, options, "clearOnEnter"),
            __isFold: true
        });
        myRange.on("clear", function(from, to) {
            CodeMirror.signal(cm, "unfold", cm, from, to);
        });
        CodeMirror.signal(cm, "fold", cm, range.from, range.to);
    }
    function makeWidget(cm, options, range) {
        var widget = getOption(cm, options, "widget");
        if (typeof widget == "function") widget = widget(range.from, range.to);
        if (typeof widget == "string") {
            var text = document.createTextNode(widget);
            widget = document.createElement("span");
            widget.appendChild(text);
            widget.className = "CodeMirror-foldmarker";
        } else if (widget) widget = widget.cloneNode(true);
        return widget;
    }
    // Clumsy backwards-compatible interface
    CodeMirror.newFoldFunction = function(rangeFinder, widget) {
        return function(cm, pos) {
            doFold(cm, pos, {
                rangeFinder: rangeFinder,
                widget: widget
            });
        };
    };
    // New-style interface
    CodeMirror.defineExtension("foldCode", function(pos, options, force) {
        doFold(this, pos, options, force);
    });
    CodeMirror.defineExtension("isFolded", function(pos) {
        var marks = this.findMarksAt(pos);
        for(var i = 0; i < marks.length; ++i)if (marks[i].__isFold) return true;
    });
    CodeMirror.commands.toggleFold = function(cm) {
        cm.foldCode(cm.getCursor());
    };
    CodeMirror.commands.fold = function(cm) {
        cm.foldCode(cm.getCursor(), null, "fold");
    };
    CodeMirror.commands.unfold = function(cm) {
        cm.foldCode(cm.getCursor(), {
            scanUp: false
        }, "unfold");
    };
    CodeMirror.commands.foldAll = function(cm) {
        cm.operation(function() {
            for(var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++)cm.foldCode(CodeMirror.Pos(i, 0), {
                scanUp: false
            }, "fold");
        });
    };
    CodeMirror.commands.unfoldAll = function(cm) {
        cm.operation(function() {
            for(var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++)cm.foldCode(CodeMirror.Pos(i, 0), {
                scanUp: false
            }, "unfold");
        });
    };
    CodeMirror.registerHelper("fold", "combine", function() {
        var funcs = Array.prototype.slice.call(arguments, 0);
        return function(cm, start) {
            for(var i = 0; i < funcs.length; ++i){
                var found = funcs[i](cm, start);
                if (found) return found;
            }
        };
    });
    CodeMirror.registerHelper("fold", "auto", function(cm, start) {
        var helpers = cm.getHelpers(start, "fold");
        for(var i = 0; i < helpers.length; i++){
            var cur = helpers[i](cm, start);
            if (cur) return cur;
        }
    });
    var defaultOptions = {
        rangeFinder: CodeMirror.fold.auto,
        widget: "\u2194",
        minFoldSize: 0,
        scanUp: false,
        clearOnEnter: true
    };
    CodeMirror.defineOption("foldOptions", null);
    function getOption(cm, options, name) {
        if (options && options[name] !== undefined) return options[name];
        var editorOptions = cm.options.foldOptions;
        if (editorOptions && editorOptions[name] !== undefined) return editorOptions[name];
        return defaultOptions[name];
    }
    CodeMirror.defineExtension("foldOption", function(options, name) {
        return getOption(this, options, name);
    });
});

});

parcelRegister("5oR4k", function(module, exports) {


// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")), (parcelRequire("4KDU0")));
})(function(CodeMirror) {
    "use strict";
    CodeMirror.defineOption("foldGutter", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            cm.clearGutter(cm.state.foldGutter.options.gutter);
            cm.state.foldGutter = null;
            cm.off("gutterClick", onGutterClick);
            cm.off("changes", onChange);
            cm.off("viewportChange", onViewportChange);
            cm.off("fold", onFold);
            cm.off("unfold", onFold);
            cm.off("swapDoc", onChange);
            cm.off("optionChange", optionChange);
        }
        if (val) {
            cm.state.foldGutter = new State(parseOptions(val));
            updateInViewport(cm);
            cm.on("gutterClick", onGutterClick);
            cm.on("changes", onChange);
            cm.on("viewportChange", onViewportChange);
            cm.on("fold", onFold);
            cm.on("unfold", onFold);
            cm.on("swapDoc", onChange);
            cm.on("optionChange", optionChange);
        }
    });
    var Pos = CodeMirror.Pos;
    function State(options) {
        this.options = options;
        this.from = this.to = 0;
    }
    function parseOptions(opts) {
        if (opts === true) opts = {};
        if (opts.gutter == null) opts.gutter = "CodeMirror-foldgutter";
        if (opts.indicatorOpen == null) opts.indicatorOpen = "CodeMirror-foldgutter-open";
        if (opts.indicatorFolded == null) opts.indicatorFolded = "CodeMirror-foldgutter-folded";
        return opts;
    }
    function isFolded(cm, line) {
        var marks = cm.findMarks(Pos(line, 0), Pos(line + 1, 0));
        for(var i = 0; i < marks.length; ++i)if (marks[i].__isFold) {
            var fromPos = marks[i].find(-1);
            if (fromPos && fromPos.line === line) return marks[i];
        }
    }
    function marker(spec) {
        if (typeof spec == "string") {
            var elt = document.createElement("div");
            elt.className = spec + " CodeMirror-guttermarker-subtle";
            return elt;
        } else return spec.cloneNode(true);
    }
    function updateFoldInfo(cm, from, to) {
        var opts = cm.state.foldGutter.options, cur = from - 1;
        var minSize = cm.foldOption(opts, "minFoldSize");
        var func = cm.foldOption(opts, "rangeFinder");
        // we can reuse the built-in indicator element if its className matches the new state
        var clsFolded = typeof opts.indicatorFolded == "string" && classTest(opts.indicatorFolded);
        var clsOpen = typeof opts.indicatorOpen == "string" && classTest(opts.indicatorOpen);
        cm.eachLine(from, to, function(line) {
            ++cur;
            var mark = null;
            var old = line.gutterMarkers;
            if (old) old = old[opts.gutter];
            if (isFolded(cm, cur)) {
                if (clsFolded && old && clsFolded.test(old.className)) return;
                mark = marker(opts.indicatorFolded);
            } else {
                var pos = Pos(cur, 0);
                var range = func && func(cm, pos);
                if (range && range.to.line - range.from.line >= minSize) {
                    if (clsOpen && old && clsOpen.test(old.className)) return;
                    mark = marker(opts.indicatorOpen);
                }
            }
            if (!mark && !old) return;
            cm.setGutterMarker(line, opts.gutter, mark);
        });
    }
    // copied from CodeMirror/src/util/dom.js
    function classTest(cls) {
        return new RegExp("(^|\\s)" + cls + "(?:$|\\s)\\s*");
    }
    function updateInViewport(cm) {
        var vp = cm.getViewport(), state = cm.state.foldGutter;
        if (!state) return;
        cm.operation(function() {
            updateFoldInfo(cm, vp.from, vp.to);
        });
        state.from = vp.from;
        state.to = vp.to;
    }
    function onGutterClick(cm, line, gutter) {
        var state = cm.state.foldGutter;
        if (!state) return;
        var opts = state.options;
        if (gutter != opts.gutter) return;
        var folded = isFolded(cm, line);
        if (folded) folded.clear();
        else cm.foldCode(Pos(line, 0), opts);
    }
    function optionChange(cm, option) {
        if (option == "mode") onChange(cm);
    }
    function onChange(cm) {
        var state = cm.state.foldGutter;
        if (!state) return;
        var opts = state.options;
        state.from = state.to = 0;
        clearTimeout(state.changeUpdate);
        state.changeUpdate = setTimeout(function() {
            updateInViewport(cm);
        }, opts.foldOnChangeTimeSpan || 600);
    }
    function onViewportChange(cm) {
        var state = cm.state.foldGutter;
        if (!state) return;
        var opts = state.options;
        clearTimeout(state.changeUpdate);
        state.changeUpdate = setTimeout(function() {
            var vp = cm.getViewport();
            if (state.from == state.to || vp.from - state.to > 20 || state.from - vp.to > 20) updateInViewport(cm);
            else cm.operation(function() {
                if (vp.from < state.from) {
                    updateFoldInfo(cm, vp.from, state.from);
                    state.from = vp.from;
                }
                if (vp.to > state.to) {
                    updateFoldInfo(cm, state.to, vp.to);
                    state.to = vp.to;
                }
            });
        }, opts.updateViewportTimeSpan || 400);
    }
    function onFold(cm, from) {
        var state = cm.state.foldGutter;
        if (!state) return;
        var line = from.line;
        if (line >= state.from && line < state.to) updateFoldInfo(cm, line, line + 1);
    }
});

});

parcelRegister("kcqjG", function(module, exports) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")));
})(function(CodeMirror) {
    "use strict";
    CodeMirror.registerHelper("fold", "markdown", function(cm, start) {
        var maxDepth = 100;
        function isHeader(lineNo) {
            var tokentype = cm.getTokenTypeAt(CodeMirror.Pos(lineNo, 0));
            return tokentype && /\bheader\b/.test(tokentype);
        }
        function headerLevel(lineNo, line, nextLine) {
            var match = line && line.match(/^#+/);
            if (match && isHeader(lineNo)) return match[0].length;
            match = nextLine && nextLine.match(/^[=\-]+\s*$/);
            if (match && isHeader(lineNo + 1)) return nextLine[0] == "=" ? 1 : 2;
            return maxDepth;
        }
        var firstLine = cm.getLine(start.line), nextLine = cm.getLine(start.line + 1);
        var level = headerLevel(start.line, firstLine, nextLine);
        if (level === maxDepth) return undefined;
        var lastLineNo = cm.lastLine();
        var end = start.line, nextNextLine = cm.getLine(end + 2);
        while(end < lastLineNo){
            if (headerLevel(end + 1, nextLine, nextNextLine) <= level) break;
            ++end;
            nextLine = nextNextLine;
            nextNextLine = cm.getLine(end + 2);
        }
        return {
            from: CodeMirror.Pos(start.line, firstLine.length),
            to: CodeMirror.Pos(end, cm.getLine(end).length)
        };
    });
});

});

parcelRegister("bzGfa", function(module, exports) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")));
})(function(CodeMirror) {
    var defaults = {
        pairs: "()[]{}''\"\"",
        closeBefore: ")]}'\":;>",
        triples: "",
        explode: "[]{}"
    };
    var Pos = CodeMirror.Pos;
    CodeMirror.defineOption("autoCloseBrackets", false, function(cm, val, old) {
        if (old && old != CodeMirror.Init) {
            cm.removeKeyMap(keyMap);
            cm.state.closeBrackets = null;
        }
        if (val) {
            ensureBound(getOption(val, "pairs"));
            cm.state.closeBrackets = val;
            cm.addKeyMap(keyMap);
        }
    });
    function getOption(conf, name) {
        if (name == "pairs" && typeof conf == "string") return conf;
        if (typeof conf == "object" && conf[name] != null) return conf[name];
        return defaults[name];
    }
    var keyMap = {
        Backspace: handleBackspace,
        Enter: handleEnter
    };
    function ensureBound(chars) {
        for(var i = 0; i < chars.length; i++){
            var ch = chars.charAt(i), key = "'" + ch + "'";
            if (!keyMap[key]) keyMap[key] = handler(ch);
        }
    }
    ensureBound(defaults.pairs + "`");
    function handler(ch) {
        return function(cm) {
            return handleChar(cm, ch);
        };
    }
    function getConfig(cm) {
        var deflt = cm.state.closeBrackets;
        if (!deflt || deflt.override) return deflt;
        var mode = cm.getModeAt(cm.getCursor());
        return mode.closeBrackets || deflt;
    }
    function handleBackspace(cm) {
        var conf = getConfig(cm);
        if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;
        var pairs = getOption(conf, "pairs");
        var ranges = cm.listSelections();
        for(var i = 0; i < ranges.length; i++){
            if (!ranges[i].empty()) return CodeMirror.Pass;
            var around = charsAround(cm, ranges[i].head);
            if (!around || pairs.indexOf(around) % 2 != 0) return CodeMirror.Pass;
        }
        for(var i = ranges.length - 1; i >= 0; i--){
            var cur = ranges[i].head;
            cm.replaceRange("", Pos(cur.line, cur.ch - 1), Pos(cur.line, cur.ch + 1), "+delete");
        }
    }
    function handleEnter(cm) {
        var conf = getConfig(cm);
        var explode = conf && getOption(conf, "explode");
        if (!explode || cm.getOption("disableInput")) return CodeMirror.Pass;
        var ranges = cm.listSelections();
        for(var i = 0; i < ranges.length; i++){
            if (!ranges[i].empty()) return CodeMirror.Pass;
            var around = charsAround(cm, ranges[i].head);
            if (!around || explode.indexOf(around) % 2 != 0) return CodeMirror.Pass;
        }
        cm.operation(function() {
            var linesep = cm.lineSeparator() || "\n";
            cm.replaceSelection(linesep + linesep, null);
            moveSel(cm, -1);
            ranges = cm.listSelections();
            for(var i = 0; i < ranges.length; i++){
                var line = ranges[i].head.line;
                cm.indentLine(line, null, true);
                cm.indentLine(line + 1, null, true);
            }
        });
    }
    function moveSel(cm, dir) {
        var newRanges = [], ranges = cm.listSelections(), primary = 0;
        for(var i = 0; i < ranges.length; i++){
            var range = ranges[i];
            if (range.head == cm.getCursor()) primary = i;
            var pos = range.head.ch || dir > 0 ? {
                line: range.head.line,
                ch: range.head.ch + dir
            } : {
                line: range.head.line - 1
            };
            newRanges.push({
                anchor: pos,
                head: pos
            });
        }
        cm.setSelections(newRanges, primary);
    }
    function contractSelection(sel) {
        var inverted = CodeMirror.cmpPos(sel.anchor, sel.head) > 0;
        return {
            anchor: new Pos(sel.anchor.line, sel.anchor.ch + (inverted ? -1 : 1)),
            head: new Pos(sel.head.line, sel.head.ch + (inverted ? 1 : -1))
        };
    }
    function handleChar(cm, ch) {
        var conf = getConfig(cm);
        if (!conf || cm.getOption("disableInput")) return CodeMirror.Pass;
        var pairs = getOption(conf, "pairs");
        var pos = pairs.indexOf(ch);
        if (pos == -1) return CodeMirror.Pass;
        var closeBefore = getOption(conf, "closeBefore");
        var triples = getOption(conf, "triples");
        var identical = pairs.charAt(pos + 1) == ch;
        var ranges = cm.listSelections();
        var opening = pos % 2 == 0;
        var type;
        for(var i = 0; i < ranges.length; i++){
            var range = ranges[i], cur = range.head, curType;
            var next = cm.getRange(cur, Pos(cur.line, cur.ch + 1));
            if (opening && !range.empty()) curType = "surround";
            else if ((identical || !opening) && next == ch) {
                if (identical && stringStartsAfter(cm, cur)) curType = "both";
                else if (triples.indexOf(ch) >= 0 && cm.getRange(cur, Pos(cur.line, cur.ch + 3)) == ch + ch + ch) curType = "skipThree";
                else curType = "skip";
            } else if (identical && cur.ch > 1 && triples.indexOf(ch) >= 0 && cm.getRange(Pos(cur.line, cur.ch - 2), cur) == ch + ch) {
                if (cur.ch > 2 && /\bstring/.test(cm.getTokenTypeAt(Pos(cur.line, cur.ch - 2)))) return CodeMirror.Pass;
                curType = "addFour";
            } else if (identical) {
                var prev = cur.ch == 0 ? " " : cm.getRange(Pos(cur.line, cur.ch - 1), cur);
                if (!CodeMirror.isWordChar(next) && prev != ch && !CodeMirror.isWordChar(prev)) curType = "both";
                else return CodeMirror.Pass;
            } else if (opening && (next.length === 0 || /\s/.test(next) || closeBefore.indexOf(next) > -1)) curType = "both";
            else return CodeMirror.Pass;
            if (!type) type = curType;
            else if (type != curType) return CodeMirror.Pass;
        }
        var left = pos % 2 ? pairs.charAt(pos - 1) : ch;
        var right = pos % 2 ? ch : pairs.charAt(pos + 1);
        cm.operation(function() {
            if (type == "skip") moveSel(cm, 1);
            else if (type == "skipThree") moveSel(cm, 3);
            else if (type == "surround") {
                var sels = cm.getSelections();
                for(var i = 0; i < sels.length; i++)sels[i] = left + sels[i] + right;
                cm.replaceSelections(sels, "around");
                sels = cm.listSelections().slice();
                for(var i = 0; i < sels.length; i++)sels[i] = contractSelection(sels[i]);
                cm.setSelections(sels);
            } else if (type == "both") {
                cm.replaceSelection(left + right, null);
                cm.triggerElectric(left + right);
                moveSel(cm, -1);
            } else if (type == "addFour") {
                cm.replaceSelection(left + left + left + left, "before");
                moveSel(cm, 1);
            }
        });
    }
    function charsAround(cm, pos) {
        var str = cm.getRange(Pos(pos.line, pos.ch - 1), Pos(pos.line, pos.ch + 1));
        return str.length == 2 ? str : null;
    }
    function stringStartsAfter(cm, pos) {
        var token = cm.getTokenAt(Pos(pos.line, pos.ch + 1));
        return /\bstring/.test(token.type) && token.start == pos.ch && (pos.ch == 0 || !/\bstring/.test(cm.getTokenTypeAt(pos)));
    }
});

});


parcelRegister("5Lj5Q", function(module, exports) {
// CodeMirror, copyright (c) by laobubu
// Distributed under an MIT license: http://codemirror.net/LICENSE
//
// This is a patch to markdown mode. Supports lots of new features
//
var $4320270d54bc096e$var$__assign = module.exports && module.exports.__assign || Object.assign || function(t) {
    for(var s, i = 1, n = arguments.length; i < n; i++){
        s = arguments[i];
        for(var p in s)if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
};



(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("54aYj")), {});
})(function(require1, exports1, CodeMirror) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var _a;
    /**
     * Markdown Extension Tokens
     *
     * - `$` Maybe a LaTeX
     * - `|` Maybe a Table Col Separator
     */ var tokenBreakRE = /[^\\][$|]/;
    var listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/;
    var urlRE = /^((?:(?:aaas?|about|acap|adiumxtra|af[ps]|aim|apt|attachment|aw|beshare|bitcoin|bolo|callto|cap|chrome(?:-extension)?|cid|coap|com-eventbrite-attendee|content|crid|cvs|data|dav|dict|dlna-(?:playcontainer|playsingle)|dns|doi|dtn|dvb|ed2k|facetime|feed|file|finger|fish|ftp|geo|gg|git|gizmoproject|go|gopher|gtalk|h323|hcp|https?|iax|icap|icon|im|imap|info|ipn|ipp|irc[6s]?|iris(?:\.beep|\.lwz|\.xpc|\.xpcs)?|itms|jar|javascript|jms|keyparc|lastfm|ldaps?|magnet|mailto|maps|market|message|mid|mms|ms-help|msnim|msrps?|mtqp|mumble|mupdate|mvn|news|nfs|nih?|nntp|notes|oid|opaquelocktoken|palm|paparazzi|platform|pop|pres|proxy|psyc|query|res(?:ource)?|rmi|rsync|rtmp|rtsp|secondlife|service|session|sftp|sgn|shttp|sieve|sips?|skype|sm[bs]|snmp|soap\.beeps?|soldat|spotify|ssh|steam|svn|tag|teamspeak|tel(?:net)?|tftp|things|thismessage|tip|tn3270|tv|udp|unreal|urn|ut2004|vemmi|ventrilo|view-source|webcal|wss?|wtai|wyciwyg|xcon(?:-userid)?|xfire|xmlrpc\.beeps?|xmpp|xri|ymsgr|z39\.50[rs]?):(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}\/)(?:[^\s()<>]|\([^\s()<>]*\))+(?:\([^\s()<>]*\)|[^\s`*!()\[\]{};:'".,<>?«»“”‘’]))/i; // from CodeMirror/mode/gfm
    var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    var url2RE = /^\.{0,2}\/[^\>\s]+/;
    var hashtagRE = /^(?:[-()/a-zA-Z0-9ァ-ヺー-ヾｦ-ﾟｰ０-９Ａ-Ｚａ-ｚぁ-ゖ゙-ゞー々ぁ-んァ-ヾ一-\u9FEF㐀-䶵﨎﨏﨑﨓﨔﨟﨡﨣﨤﨧-﨩]|[\ud840-\ud868][\udc00-\udfff]|\ud869[\udc00-\uded6\udf00-\udfff]|[\ud86a-\ud86c][\udc00-\udfff]|\ud86d[\udc00-\udf34\udf40-\udfff]|\ud86e[\udc00-\udc1d])+/;
    var SimpleTableRE = /^\s*[^\|].*?\|.*[^|]\s*$/;
    var SimpleTableLooseRE = /^\s*[^\|].*\|/; // unfinished | row
    var NormalTableRE = /^\s*\|[^\|]+\|.+\|\s*$/;
    var NormalTableLooseRE = /^\s*\|/; // | unfinished row
    var linkStyle = (_a = {}, _a[1 /* BARELINK */ ] = "hmd-barelink", _a[6 /* BARELINK2 */ ] = "hmd-barelink2", _a[2 /* FOOTREF */ ] = "hmd-barelink hmd-footref", _a[4 /* FOOTNOTE */ ] = "hmd-footnote line-HyperMD-footnote", _a[7 /* FOOTREF2 */ ] = "hmd-footref2", _a);
    function resetTable(state) {
        state.hmdTable = 0 /* NONE */ ;
        state.hmdTableColumns = [];
        state.hmdTableID = null;
        state.hmdTableCol = state.hmdTableRow = 0;
    }
    var listInQuoteRE = /^\s+((\d+[).]|[-*+])\s+)?/;
    var defaultTokenTypeOverrides = {
        hr: "line-HyperMD-hr line-background-HyperMD-hr-bg hr",
        // HyperMD needs to know the level of header/indent. using tokenTypeOverrides is not enough
        // header: "line-HyperMD-header header",
        // quote: "line-HyperMD-quote quote",
        // Note: there are some list related process below
        list1: "list-1",
        list2: "list-2",
        list3: "list-3",
        code: "inline-code",
        hashtag: "hashtag meta"
    };
    CodeMirror.defineMode("hypermd", function(cmCfg, modeCfgUser) {
        var modeCfg = {
            front_matter: true,
            math: true,
            table: true,
            toc: true,
            orgModeMarkup: true,
            hashtag: false,
            fencedCodeBlockHighlighting: true,
            name: "markdown",
            highlightFormatting: true,
            taskLists: true,
            strikethrough: true,
            emoji: true,
            /** @see defaultTokenTypeOverrides */ tokenTypeOverrides: defaultTokenTypeOverrides
        };
        Object.assign(modeCfg, modeCfgUser);
        if (modeCfg.tokenTypeOverrides !== defaultTokenTypeOverrides) modeCfg.tokenTypeOverrides = Object.assign({}, defaultTokenTypeOverrides, modeCfg.tokenTypeOverrides);
        modeCfg["name"] = "markdown";
        /** functions from CodeMirror Markdown mode closure. Only for status checking */ var rawClosure = {
            htmlBlock: null
        };
        var rawMode = CodeMirror.getMode(cmCfg, modeCfg);
        var newMode = $4320270d54bc096e$var$__assign({}, rawMode);
        newMode.startState = function() {
            var ans = rawMode.startState();
            resetTable(ans);
            ans.hmdOverride = null;
            ans.hmdInnerExitChecker = null;
            ans.hmdInnerMode = null;
            ans.hmdLinkType = 0 /* NONE */ ;
            ans.hmdNextMaybe = modeCfg.front_matter ? 1 /* FRONT_MATTER */  : 0 /* NONE */ ;
            ans.hmdNextState = null;
            ans.hmdNextStyle = null;
            ans.hmdNextPos = null;
            ans.hmdHashtag = 0 /* NONE */ ;
            return ans;
        };
        newMode.copyState = function(s) {
            var ans = rawMode.copyState(s);
            var keys = [
                "hmdLinkType",
                "hmdNextMaybe",
                "hmdTable",
                "hmdTableID",
                "hmdTableCol",
                "hmdTableRow",
                "hmdOverride",
                "hmdInnerMode",
                "hmdInnerStyle",
                "hmdInnerExitChecker",
                "hmdNextPos",
                "hmdNextState",
                "hmdNextStyle",
                "hmdHashtag"
            ];
            for(var _i = 0, keys_1 = keys; _i < keys_1.length; _i++){
                var key = keys_1[_i];
                ans[key] = s[key];
            }
            ans.hmdTableColumns = s.hmdTableColumns.slice(0);
            if (s.hmdInnerMode) ans.hmdInnerState = CodeMirror.copyState(s.hmdInnerMode, s.hmdInnerState);
            return ans;
        };
        newMode.blankLine = function(state) {
            var ans;
            var innerMode = state.hmdInnerMode;
            if (innerMode) {
                if (innerMode.blankLine) ans = innerMode.blankLine(state.hmdInnerState);
            } else ans = rawMode.blankLine(state);
            if (!ans) ans = "";
            if (state.code === -1) ans += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg";
            resetTable(state);
            return ans.trim() || null;
        };
        newMode.indent = function(state, textAfter) {
            var mode = state.hmdInnerMode || rawMode;
            var f = mode.indent;
            if (typeof f === 'function') return f.apply(mode, arguments);
            return CodeMirror.Pass;
        };
        newMode.innerMode = function(state) {
            if (state.hmdInnerMode) return {
                mode: state.hmdInnerMode,
                state: state.hmdInnerState
            };
            return rawMode.innerMode(state);
        };
        newMode.token = function(stream, state) {
            if (state.hmdOverride) return state.hmdOverride(stream, state);
            if (state.hmdNextMaybe === 1 /* FRONT_MATTER */ ) {
                if (stream.string === '---') {
                    state.hmdNextMaybe = 2 /* FRONT_MATTER_END */ ;
                    return enterMode(stream, state, "yaml", {
                        style: "hmd-frontmatter",
                        fallbackMode: function() {
                            return createDummyMode("---");
                        },
                        exitChecker: function(stream, state) {
                            if (stream.string === '---') {
                                // found the endline of front_matter
                                state.hmdNextMaybe = 0 /* NONE */ ;
                                return {
                                    endPos: 3
                                };
                            } else return null;
                        }
                    });
                } else state.hmdNextMaybe = 0 /* NONE */ ;
            }
            var wasInHTML = state.f === rawClosure.htmlBlock;
            var wasInCodeFence = state.code === -1;
            var bol = stream.start === 0;
            var wasLinkText = state.linkText;
            var wasLinkHref = state.linkHref;
            var inMarkdown = !(wasInCodeFence || wasInHTML);
            var inMarkdownInline = inMarkdown && !(state.code || state.indentedCode || state.linkHref);
            var ans = "";
            var tmp;
            if (inMarkdown) {
                // now implement some extra features that require higher priority than CodeMirror's markdown
                //#region Math
                if (modeCfg.math && inMarkdownInline && (tmp = stream.match(/^\${1,2}/, false))) {
                    var endTag_1 = tmp[0];
                    var mathLevel = endTag_1.length;
                    if (mathLevel === 2 || stream.string.slice(stream.pos).match(/[^\\]\$/)) {
                        // $$ may span lines, $ must be paired
                        var texMode = CodeMirror.getMode(cmCfg, {
                            name: "stex"
                        });
                        var noTexMode = texMode['name'] !== 'stex';
                        ans += enterMode(stream, state, texMode, {
                            style: "math",
                            skipFirstToken: noTexMode,
                            fallbackMode: function() {
                                return createDummyMode(endTag_1);
                            },
                            exitChecker: createSimpleInnerModeExitChecker(endTag_1, {
                                style: "formatting formatting-math formatting-math-end math-" + mathLevel
                            })
                        });
                        if (noTexMode) stream.pos += tmp[0].length;
                        ans += " formatting formatting-math formatting-math-begin math-" + mathLevel;
                        return ans;
                    }
                }
                //#endregion
                //#region [OrgMode] markup
                if (bol && modeCfg.orgModeMarkup && (tmp = stream.match(/^\#\+(\w+\:?)\s*/))) {
                    // Support #+TITLE: This is the title of the document
                    if (!stream.eol()) state.hmdOverride = function(stream, state) {
                        stream.skipToEnd();
                        state.hmdOverride = null;
                        return "string hmd-orgmode-markup";
                    };
                    return "meta formatting-hmd-orgmode-markup hmd-orgmode-markup line-HyperMD-orgmode-markup";
                }
                //#endregion
                //#region [TOC] in a single line
                if (bol && modeCfg.toc && stream.match(/^\[TOCM?\]\s*$/i)) return "meta line-HyperMD-toc hmd-toc";
                //#endregion
                //#region Extra markdown inline extenson
                if (inMarkdownInline) {
                    // transform unformatted URL into link
                    if (!state.hmdLinkType && (stream.match(urlRE) || stream.match(emailRE))) return "url";
                }
            //#endregion
            }
            // now enter markdown
            if (state.hmdNextState) {
                stream.pos = state.hmdNextPos;
                ans += " " + (state.hmdNextStyle || "");
                Object.assign(state, state.hmdNextState);
                state.hmdNextState = null;
                state.hmdNextStyle = null;
                state.hmdNextPos = null;
            } else ans += " " + (rawMode.token(stream, state) || "");
            // add extra styles
            if (state.hmdHashtag !== 0 /* NONE */ ) ans += " " + modeCfg.tokenTypeOverrides.hashtag;
            /** Try to capture some internal functions from CodeMirror Markdown mode closure! */ if (!rawClosure.htmlBlock && state.htmlState) rawClosure.htmlBlock = state.f;
            var inHTML = state.f === rawClosure.htmlBlock;
            var inCodeFence = state.code === -1;
            inMarkdown = inMarkdown && !(inHTML || inCodeFence);
            inMarkdownInline = inMarkdownInline && inMarkdown && !(state.code || state.indentedCode || state.linkHref);
            // If find a markdown extension token (which is not escaped),
            // break current parsed string into two parts and the first char of next part is the markdown extension token
            if (inMarkdownInline && (tmp = stream.current().match(tokenBreakRE))) stream.pos = stream.start + tmp.index + 1; // rewind
            var current = stream.current();
            if (inHTML != wasInHTML) {
                if (inHTML) {
                    ans += " hmd-html-begin";
                    rawClosure.htmlBlock = state.f;
                } else ans += " hmd-html-end";
            }
            if (wasInCodeFence || inCodeFence) {
                if (!state.localMode || !wasInCodeFence) ans = ans.replace("inline-code", "");
                ans += " line-HyperMD-codeblock line-background-HyperMD-codeblock-bg";
                if (inCodeFence !== wasInCodeFence) {
                    if (!inCodeFence) ans += " line-HyperMD-codeblock-end line-background-HyperMD-codeblock-end-bg";
                    else if (!wasInCodeFence) ans += " line-HyperMD-codeblock-begin line-background-HyperMD-codeblock-begin-bg";
                }
            }
            if (inMarkdown) {
                var tableType = state.hmdTable;
                //#region [Table] Reset
                if (bol && tableType) {
                    var rowRE = tableType == 1 /* SIMPLE */  ? SimpleTableLooseRE : NormalTableLooseRE;
                    if (rowRE.test(stream.string)) {
                        // still in table
                        state.hmdTableCol = 0;
                        state.hmdTableRow++;
                    } else // end of a table
                    resetTable(state);
                }
                //#endregion
                //#region Header, indentedCode, quote
                if (bol && state.header) {
                    if (/^(?:---+|===+)\s*$/.test(stream.string) && state.prevLine && state.prevLine.header) ans += " line-HyperMD-header-line line-HyperMD-header-line-" + state.header;
                    else ans += " line-HyperMD-header line-HyperMD-header-" + state.header;
                }
                if (state.indentedCode) ans += " hmd-indented-code";
                if (state.quote) {
                    // mess up as less as possible
                    if (stream.eol()) {
                        ans += " line-HyperMD-quote line-HyperMD-quote-" + state.quote;
                        if (!/^ {0,3}\>/.test(stream.string)) ans += " line-HyperMD-quote-lazy"; // ">" is omitted
                    }
                    if (bol && (tmp = current.match(/^\s+/))) {
                        stream.pos = tmp[0].length; // rewind
                        ans += " hmd-indent-in-quote";
                        return ans.trim();
                    }
                    // make indentation (and potential list bullet) monospaced
                    if (/^>\s+$/.test(current) && stream.peek() != ">") {
                        stream.pos = stream.start + 1; // rewind!
                        current = ">";
                        state.hmdOverride = function(stream, state) {
                            stream.match(listInQuoteRE);
                            state.hmdOverride = null;
                            return "hmd-indent-in-quote line-HyperMD-quote line-HyperMD-quote-" + state.quote;
                        };
                    }
                }
                //#endregion
                //#region List
                var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;
                var tokenIsIndent = bol && /^\s+$/.test(current) && (state.list !== false || stream.indentation() <= maxNonCodeIndentation);
                var tokenIsListBullet = state.list && /formatting-list/.test(ans);
                if (tokenIsListBullet || tokenIsIndent && (state.list !== false || stream.match(listRE, false))) {
                    var listLevel = state.listStack && state.listStack.length || 0;
                    if (tokenIsIndent) {
                        if (stream.match(listRE, false)) {
                            if (state.list === false) listLevel++;
                        } else {
                            while(listLevel > 0 && stream.pos < state.listStack[listLevel - 1])listLevel--; // find the real indent level
                            if (!listLevel) return ans.trim() || null;
                            ans += " line-HyperMD-list-line-nobullet line-HyperMD-list-line line-HyperMD-list-line-" + listLevel;
                        }
                        ans += " hmd-list-indent hmd-list-indent-" + listLevel;
                    } else if (tokenIsListBullet) // no space before bullet!
                    ans += " line-HyperMD-list-line line-HyperMD-list-line-" + listLevel;
                }
                //#endregion
                //#region Link, BareLink, Footnote etc
                if (wasLinkText !== state.linkText) {
                    if (!wasLinkText) {
                        // entering a link
                        tmp = stream.match(/^([^\]]+)\](\(| ?\[|\:)?/, false);
                        if (!tmp) state.hmdLinkType = 1 /* BARELINK */ ;
                        else if (!tmp[2]) {
                            if (tmp[1].charAt(0) === "^") state.hmdLinkType = 2 /* FOOTREF */ ;
                            else state.hmdLinkType = 1 /* BARELINK */ ;
                        } else if (tmp[2] === ":") state.hmdLinkType = 4 /* FOOTNOTE */ ;
                        else if ((tmp[2] === "[" || tmp[2] === " [") && stream.string.charAt(stream.pos + tmp[0].length) === "]") state.hmdLinkType = 6 /* BARELINK2 */ ;
                        else state.hmdLinkType = 3 /* NORMAL */ ;
                    } else {
                        // leaving a link
                        if (state.hmdLinkType in linkStyle) ans += " " + linkStyle[state.hmdLinkType];
                        if (state.hmdLinkType === 4 /* FOOTNOTE */ ) state.hmdLinkType = 5 /* MAYBE_FOOTNOTE_URL */ ;
                        else state.hmdLinkType = 0 /* NONE */ ;
                    }
                }
                if (wasLinkHref !== state.linkHref) {
                    if (!wasLinkHref) // [link][doc] the [doc] part
                    {
                        if (current === "[" && stream.peek() !== "]") state.hmdLinkType = 7 /* FOOTREF2 */ ;
                    } else if (state.hmdLinkType) {
                        ans += " " + linkStyle[state.hmdLinkType];
                        state.hmdLinkType = 0 /* NONE */ ;
                    }
                }
                if (state.hmdLinkType !== 0 /* NONE */ ) {
                    if (state.hmdLinkType in linkStyle) ans += " " + linkStyle[state.hmdLinkType];
                    if (state.hmdLinkType === 5 /* MAYBE_FOOTNOTE_URL */ ) {
                        if (!/^(?:\]\:)?\s*$/.test(current)) {
                            if (urlRE.test(current) || url2RE.test(current)) ans += " hmd-footnote-url";
                            else ans = ans.replace("string url", "");
                            state.hmdLinkType = 0 /* NONE */ ; // since then, can't be url anymore
                        }
                    }
                }
                //#endregion
                //#region start of an escaped char
                if (/formatting-escape/.test(ans) && current.length > 1) {
                    // CodeMirror merge backslash and escaped char into one token, which is not good
                    // Use hmdOverride to separate them
                    var escapedLength_1 = current.length - 1;
                    var escapedCharStyle_1 = ans.replace("formatting-escape", "escape") + " hmd-escape-char";
                    state.hmdOverride = function(stream, state) {
                        stream.pos += escapedLength_1;
                        state.hmdOverride = null;
                        return escapedCharStyle_1.trim();
                    };
                    ans += " hmd-escape-backslash";
                    stream.pos -= escapedLength_1;
                    return ans;
                }
                //#endregion
                //#region [Table] Creating Table and style Table Separators
                if (!ans.trim() && modeCfg.table) {
                    // string is unformatted
                    var isTableSep = false;
                    if (current.charAt(0) === "|") {
                        // is "|xxxxxx", separate "|" and "xxxxxx"
                        stream.pos = stream.start + 1; // rewind to end of "|"
                        current = "|";
                        isTableSep = true;
                    }
                    if (isTableSep) {
                        // if not inside a table, try to construct one
                        if (!tableType) {
                            // check 1: current line meet the table format
                            if (SimpleTableRE.test(stream.string)) tableType = 1 /* SIMPLE */ ;
                            else if (NormalTableRE.test(stream.string)) tableType = 2 /* NORMAL */ ;
                            // check 2: check every column's alignment style
                            var rowStyles = void 0;
                            if (tableType) {
                                var nextLine = stream.lookAhead(1);
                                if (tableType === 2 /* NORMAL */ ) {
                                    if (!NormalTableRE.test(nextLine)) tableType = 0 /* NONE */ ;
                                    else // remove leading / tailing pipe char
                                    nextLine = nextLine.replace(/^\s*\|/, '').replace(/\|\s*$/, '');
                                } else if (tableType === 1 /* SIMPLE */ ) {
                                    if (!SimpleTableRE.test(nextLine)) tableType = 0 /* NONE */ ;
                                }
                                if (tableType) {
                                    rowStyles = nextLine.split("|");
                                    for(var i = 0; i < rowStyles.length; i++){
                                        var row = rowStyles[i];
                                        if (/^\s*--+\s*:\s*$/.test(row)) row = "right";
                                        else if (/^\s*:\s*--+\s*$/.test(row)) row = "left";
                                        else if (/^\s*:\s*--+\s*:\s*$/.test(row)) row = "center";
                                        else if (/^\s*--+\s*$/.test(row)) row = "default";
                                        else {
                                            // ouch, can't be a table
                                            tableType = 0 /* NONE */ ;
                                            break;
                                        }
                                        rowStyles[i] = row;
                                    }
                                }
                            }
                            // step 3: made it
                            if (tableType) {
                                // successfully made one
                                state.hmdTable = tableType;
                                state.hmdTableColumns = rowStyles;
                                state.hmdTableID = "T" + stream.lineOracle.line;
                                state.hmdTableRow = state.hmdTableCol = 0;
                            }
                        }
                        // then
                        if (tableType) {
                            var colUbound = state.hmdTableColumns.length - 1;
                            if (tableType === 2 /* NORMAL */  && (state.hmdTableCol === 0 && /^\s*\|$/.test(stream.string.slice(0, stream.pos)) || stream.match(/^\s*$/, false))) ans += " hmd-table-sep hmd-table-sep-dummy";
                            else if (state.hmdTableCol < colUbound) {
                                var row = state.hmdTableRow;
                                var col = state.hmdTableCol++;
                                if (col == 0) ans += " line-HyperMD-table_" + state.hmdTableID + " line-HyperMD-table-" + tableType + " line-HyperMD-table-row line-HyperMD-table-row-" + row;
                                ans += " hmd-table-sep hmd-table-sep-" + col;
                            }
                        }
                    }
                }
                //#endregion
                if (tableType && state.hmdTableRow === 1) // fix a stupid problem:    :------: is not emoji
                {
                    if (/emoji/.test(ans)) ans = "";
                }
                //#region HTML Block
                //
                // See https://github.github.com/gfm/#html-blocks type3-5
                if (inMarkdownInline && current === '<') {
                    var endTag = null;
                    if (stream.match(/^\![A-Z]+/)) endTag = ">";
                    else if (stream.match("?")) endTag = "?>";
                    else if (stream.match("![CDATA[")) endTag = "]]>";
                    if (endTag != null) return enterMode(stream, state, null, {
                        endTag: endTag,
                        style: (ans + " comment hmd-cdata-html").trim()
                    });
                }
                //#endregion
                //#region Hashtag
                if (modeCfg.hashtag && inMarkdownInline) switch(state.hmdHashtag){
                    case 0 /* NONE */ :
                        if (current === '#' && !state.linkText && !state.image && (bol || /^\s*$/.test(stream.string.charAt(stream.start - 1)))) {
                            var escape_removed_str = stream.string.slice(stream.pos).replace(/\\./g, '');
                            if (tmp = hashtagRE.exec(escape_removed_str)) {
                                if (/^\d+$/.test(tmp[0])) state.hmdHashtag = 0 /* NONE */ ;
                                else state.hmdHashtag = 1 /* NORMAL */ ;
                                escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                do {
                                    // found tailing #
                                    if (escape_removed_str[0] === '#' && (escape_removed_str.length === 1 || !hashtagRE.test(escape_removed_str[1]))) {
                                        state.hmdHashtag = 2 /* WITH_SPACE */ ;
                                        break;
                                    }
                                    if (tmp = escape_removed_str.match(/^\s+/)) {
                                        escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                        if (tmp = escape_removed_str.match(hashtagRE)) {
                                            // found a space + valid tag text parts
                                            // continue this loop until tailing # is found
                                            escape_removed_str = escape_removed_str.slice(tmp[0].length);
                                            continue;
                                        }
                                    }
                                    break;
                                }while (true);
                            }
                            if (state.hmdHashtag) ans += " formatting formatting-hashtag hashtag-begin " + modeCfg.tokenTypeOverrides.hashtag;
                        }
                        break;
                    case 1 /* NORMAL */ :
                        var endHashTag = false;
                        if (!/formatting/.test(ans) && !/^\s*$/.test(current)) {
                            // if invalid hashtag char found, break current parsed text part
                            tmp = current.match(hashtagRE);
                            var backUpChars = current.length - (tmp ? tmp[0].length : 0);
                            if (backUpChars > 0) {
                                stream.backUp(backUpChars);
                                endHashTag = true;
                            }
                        }
                        if (!endHashTag) endHashTag = stream.eol(); // end of line
                        if (!endHashTag) endHashTag = !hashtagRE.test(stream.peek()); // or next char is invalid to hashtag name
                        // escaped char is always invisible to stream. no worry
                        if (endHashTag) {
                            ans += " hashtag-end";
                            state.hmdHashtag = 0 /* NONE */ ;
                        }
                        break;
                    case 2 /* WITH_SPACE */ :
                        // escaped char is always invisible to stream. no worry
                        if (current === '#') {
                            // end the hashtag if meet unescaped #
                            ans = ans.replace(/\sformatting-header(?:-\d+)?/g, '');
                            ans += " formatting formatting-hashtag hashtag-end";
                            state.hmdHashtag = 0 /* NONE */ ;
                        }
                        break;
                }
            //#endregion
            }
            return ans.trim() || null;
        };
        function modeOverride(stream, state) {
            var exit = state.hmdInnerExitChecker(stream, state);
            var extraStyle = state.hmdInnerStyle;
            var ans = (!exit || !exit.skipInnerMode) && state.hmdInnerMode.token(stream, state.hmdInnerState) || "";
            if (extraStyle) ans += " " + extraStyle;
            if (exit) {
                if (exit.style) ans += " " + exit.style;
                if (exit.endPos) stream.pos = exit.endPos;
                state.hmdInnerExitChecker = null;
                state.hmdInnerMode = null;
                state.hmdInnerState = null;
                state.hmdOverride = null;
            }
            return ans.trim() || null;
        }
        /**
         * advance Markdown tokenizing stream
         *
         * @returns true if success, then `state.hmdNextState` & `state.hmdNextStyle` will be set
         */ function advanceMarkdown(stream, state) {
            if (stream.eol() || state.hmdNextState) return false;
            var oldStart = stream.start;
            var oldPos = stream.pos;
            stream.start = oldPos;
            var newState = $4320270d54bc096e$var$__assign({}, state);
            var newStyle = rawMode.token(stream, newState);
            state.hmdNextPos = stream.pos;
            state.hmdNextState = newState;
            state.hmdNextStyle = newStyle;
            // console.log("ADVANCED!", oldStart, oldPos, stream.start, stream.pos)
            // console.log("ADV", newStyle, newState)
            stream.start = oldStart;
            stream.pos = oldPos;
            return true;
        }
        function createDummyMode(endTag) {
            return {
                token: function(stream) {
                    var endTagSince = stream.string.indexOf(endTag, stream.start);
                    if (endTagSince === -1) stream.skipToEnd(); // endTag not in this line
                    else if (endTagSince === 0) stream.pos += endTag.length; // current token is endTag
                    else {
                        stream.pos = endTagSince;
                        if (stream.string.charAt(endTagSince - 1) === "\\") stream.pos++;
                    }
                    return null;
                }
            };
        }
        function createSimpleInnerModeExitChecker(endTag, retInfo) {
            if (!retInfo) retInfo = {};
            return function(stream, state) {
                if (stream.string.substr(stream.start, endTag.length) === endTag) {
                    retInfo.endPos = stream.start + endTag.length;
                    return retInfo;
                }
                return null;
            };
        }
        /**
         * switch to another mode
         *
         * After entering a mode, you can then set `hmdInnerExitStyle` and `hmdInnerState` of `state`
         *
         * @returns if `skipFirstToken` not set, returns `innerMode.token(stream, innerState)`, meanwhile, stream advances
         */ function enterMode(stream, state, mode, opt) {
            if (typeof mode === "string") mode = CodeMirror.getMode(cmCfg, mode);
            if (!mode || mode["name"] === "null") {
                if ('endTag' in opt) mode = createDummyMode(opt.endTag);
                else mode = typeof opt.fallbackMode === 'function' && opt.fallbackMode();
                if (!mode) throw new Error("no mode");
            }
            state.hmdInnerExitChecker = 'endTag' in opt ? createSimpleInnerModeExitChecker(opt.endTag) : opt.exitChecker;
            state.hmdInnerStyle = opt.style;
            state.hmdInnerMode = mode;
            state.hmdOverride = modeOverride;
            state.hmdInnerState = CodeMirror.startState(mode);
            var ans = opt.style || "";
            if (!opt.skipFirstToken) ans += " " + mode.token(stream, state.hmdInnerState);
            return ans.trim();
        }
        return newMode;
    }, "hypermd");
    CodeMirror.defineMIME("text/x-hypermd", "hypermd");
});

});
parcelRegister("54aYj", function(module, exports) {



// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")), (parcelRequire("eADLY")), (parcelRequire("4ehgN")));
})(function(CodeMirror) {
    "use strict";
    CodeMirror.defineMode("markdown", function(cmCfg, modeCfg) {
        var htmlMode = CodeMirror.getMode(cmCfg, "text/html");
        var htmlModeMissing = htmlMode.name == "null";
        function getMode(name) {
            if (CodeMirror.findModeByName) {
                var found = CodeMirror.findModeByName(name);
                if (found) name = found.mime || found.mimes[0];
            }
            var mode = CodeMirror.getMode(cmCfg, name);
            return mode.name == "null" ? null : mode;
        }
        // Should characters that affect highlighting be highlighted separate?
        // Does not include characters that will be output (such as `1.` and `-` for lists)
        if (modeCfg.highlightFormatting === undefined) modeCfg.highlightFormatting = false;
        // Maximum number of nested blockquotes. Set to 0 for infinite nesting.
        // Excess `>` will emit `error` token.
        if (modeCfg.maxBlockquoteDepth === undefined) modeCfg.maxBlockquoteDepth = 0;
        // Turn on task lists? ("- [ ] " and "- [x] ")
        if (modeCfg.taskLists === undefined) modeCfg.taskLists = false;
        // Turn on strikethrough syntax
        if (modeCfg.strikethrough === undefined) modeCfg.strikethrough = false;
        if (modeCfg.emoji === undefined) modeCfg.emoji = false;
        if (modeCfg.fencedCodeBlockHighlighting === undefined) modeCfg.fencedCodeBlockHighlighting = true;
        if (modeCfg.fencedCodeBlockDefaultMode === undefined) modeCfg.fencedCodeBlockDefaultMode = 'text/plain';
        if (modeCfg.xml === undefined) modeCfg.xml = true;
        // Allow token types to be overridden by user-provided token types.
        if (modeCfg.tokenTypeOverrides === undefined) modeCfg.tokenTypeOverrides = {};
        var tokenTypes = {
            header: "header",
            code: "comment",
            quote: "quote",
            list1: "variable-2",
            list2: "variable-3",
            list3: "keyword",
            hr: "hr",
            image: "image",
            imageAltText: "image-alt-text",
            imageMarker: "image-marker",
            formatting: "formatting",
            linkInline: "link",
            linkEmail: "link",
            linkText: "link",
            linkHref: "string",
            em: "em",
            strong: "strong",
            strikethrough: "strikethrough",
            emoji: "builtin"
        };
        for(var tokenType in tokenTypes)if (tokenTypes.hasOwnProperty(tokenType) && modeCfg.tokenTypeOverrides[tokenType]) tokenTypes[tokenType] = modeCfg.tokenTypeOverrides[tokenType];
        var hrRE = /^([*\-_])(?:\s*\1){2,}\s*$/, listRE = /^(?:[*\-+]|^[0-9]+([.)]))\s+/, taskListRE = /^\[(x| )\](?=\s)/i // Must follow listRE
        , atxHeaderRE = modeCfg.allowAtxHeaderWithoutSpace ? /^(#+)/ : /^(#+)(?: |$)/, setextHeaderRE = /^ {0,3}(?:\={1,}|-{2,})\s*$/, textRE = /^[^#!\[\]*_\\<>` "'(~:]+/, fencedCodeRE = /^(~~~+|```+)[ \t]*([\w\/+#-]*)[^\n`]*$/, linkDefRE = /^\s*\[[^\]]+?\]:.*$/ // naive link-definition
        , punctuation = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E42\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDF3C-\uDF3E]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]/, expandedTab = "    " // CommonMark specifies tab as 4 spaces
        ;
        function switchInline(stream, state, f) {
            state.f = state.inline = f;
            return f(stream, state);
        }
        function switchBlock(stream, state, f) {
            state.f = state.block = f;
            return f(stream, state);
        }
        function lineIsEmpty(line) {
            return !line || !/\S/.test(line.string);
        }
        // Blocks
        function blankLine(state) {
            // Reset linkTitle state
            state.linkTitle = false;
            state.linkHref = false;
            state.linkText = false;
            // Reset EM state
            state.em = false;
            // Reset STRONG state
            state.strong = false;
            // Reset strikethrough state
            state.strikethrough = false;
            // Reset state.quote
            state.quote = 0;
            // Reset state.indentedCode
            state.indentedCode = false;
            if (state.f == htmlBlock) {
                var exit = htmlModeMissing;
                if (!exit) {
                    var inner = CodeMirror.innerMode(htmlMode, state.htmlState);
                    exit = inner.mode.name == "xml" && inner.state.tagStart === null && !inner.state.context && inner.state.tokenize.isInText;
                }
                if (exit) {
                    state.f = inlineNormal;
                    state.block = blockNormal;
                    state.htmlState = null;
                }
            }
            // Reset state.trailingSpace
            state.trailingSpace = 0;
            state.trailingSpaceNewLine = false;
            // Mark this line as blank
            state.prevLine = state.thisLine;
            state.thisLine = {
                stream: null
            };
            return null;
        }
        function blockNormal(stream, state) {
            var firstTokenOnLine = stream.column() === state.indentation;
            var prevLineLineIsEmpty = lineIsEmpty(state.prevLine.stream);
            var prevLineIsIndentedCode = state.indentedCode;
            var prevLineIsHr = state.prevLine.hr;
            var prevLineIsList = state.list !== false;
            var maxNonCodeIndentation = (state.listStack[state.listStack.length - 1] || 0) + 3;
            state.indentedCode = false;
            var lineIndentation = state.indentation;
            // compute once per line (on first token)
            if (state.indentationDiff === null) {
                state.indentationDiff = state.indentation;
                if (prevLineIsList) {
                    state.list = null;
                    // While this list item's marker's indentation is less than the deepest
                    //  list item's content's indentation,pop the deepest list item
                    //  indentation off the stack, and update block indentation state
                    while(lineIndentation < state.listStack[state.listStack.length - 1]){
                        state.listStack.pop();
                        if (state.listStack.length) state.indentation = state.listStack[state.listStack.length - 1];
                        else state.list = false;
                    }
                    if (state.list !== false) state.indentationDiff = lineIndentation - state.listStack[state.listStack.length - 1];
                }
            }
            // not comprehensive (currently only for setext detection purposes)
            var allowsInlineContinuation = !prevLineLineIsEmpty && !prevLineIsHr && !state.prevLine.header && (!prevLineIsList || !prevLineIsIndentedCode) && !state.prevLine.fencedCodeEnd;
            var isHr = (state.list === false || prevLineIsHr || prevLineLineIsEmpty) && state.indentation <= maxNonCodeIndentation && stream.match(hrRE);
            var match = null;
            if (state.indentationDiff >= 4 && (prevLineIsIndentedCode || state.prevLine.fencedCodeEnd || state.prevLine.header || prevLineLineIsEmpty)) {
                stream.skipToEnd();
                state.indentedCode = true;
                return tokenTypes.code;
            } else if (stream.eatSpace()) return null;
            else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(atxHeaderRE)) && match[1].length <= 6) {
                state.quote = 0;
                state.header = match[1].length;
                state.thisLine.header = true;
                if (modeCfg.highlightFormatting) state.formatting = "header";
                state.f = state.inline;
                return getType(state);
            } else if (state.indentation <= maxNonCodeIndentation && stream.eat('>')) {
                state.quote = firstTokenOnLine ? 1 : state.quote + 1;
                if (modeCfg.highlightFormatting) state.formatting = "quote";
                stream.eatSpace();
                return getType(state);
            } else if (!isHr && !state.setext && firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(listRE))) {
                var listType = match[1] ? "ol" : "ul";
                state.indentation = lineIndentation + stream.current().length;
                state.list = true;
                state.quote = 0;
                // Add this list item's content's indentation to the stack
                state.listStack.push(state.indentation);
                // Reset inline styles which shouldn't propagate across list items
                state.em = false;
                state.strong = false;
                state.code = false;
                state.strikethrough = false;
                if (modeCfg.taskLists && stream.match(taskListRE, false)) state.taskList = true;
                state.f = state.inline;
                if (modeCfg.highlightFormatting) state.formatting = [
                    "list",
                    "list-" + listType
                ];
                return getType(state);
            } else if (firstTokenOnLine && state.indentation <= maxNonCodeIndentation && (match = stream.match(fencedCodeRE, true))) {
                state.quote = 0;
                state.fencedEndRE = new RegExp(match[1] + "+ *$");
                // try switching mode
                state.localMode = modeCfg.fencedCodeBlockHighlighting && getMode(match[2] || modeCfg.fencedCodeBlockDefaultMode);
                if (state.localMode) state.localState = CodeMirror.startState(state.localMode);
                state.f = state.block = local;
                if (modeCfg.highlightFormatting) state.formatting = "code-block";
                state.code = -1;
                return getType(state);
            // SETEXT has lowest block-scope precedence after HR, so check it after
            //  the others (code, blockquote, list...)
            } else if (// if setext set, indicates line after ---/===
            state.setext || // line before ---/===
            (!allowsInlineContinuation || !prevLineIsList) && !state.quote && state.list === false && !state.code && !isHr && !linkDefRE.test(stream.string) && (match = stream.lookAhead(1)) && (match = match.match(setextHeaderRE))) {
                if (!state.setext) {
                    state.header = match[0].charAt(0) == '=' ? 1 : 2;
                    state.setext = state.header;
                } else {
                    state.header = state.setext;
                    // has no effect on type so we can reset it now
                    state.setext = 0;
                    stream.skipToEnd();
                    if (modeCfg.highlightFormatting) state.formatting = "header";
                }
                state.thisLine.header = true;
                state.f = state.inline;
                return getType(state);
            } else if (isHr) {
                stream.skipToEnd();
                state.hr = true;
                state.thisLine.hr = true;
                return tokenTypes.hr;
            } else if (stream.peek() === '[') return switchInline(stream, state, footnoteLink);
            return switchInline(stream, state, state.inline);
        }
        function htmlBlock(stream, state) {
            var style = htmlMode.token(stream, state.htmlState);
            if (!htmlModeMissing) {
                var inner = CodeMirror.innerMode(htmlMode, state.htmlState);
                if (inner.mode.name == "xml" && inner.state.tagStart === null && !inner.state.context && inner.state.tokenize.isInText || state.md_inside && stream.current().indexOf(">") > -1) {
                    state.f = inlineNormal;
                    state.block = blockNormal;
                    state.htmlState = null;
                }
            }
            return style;
        }
        function local(stream, state) {
            var currListInd = state.listStack[state.listStack.length - 1] || 0;
            var hasExitedList = state.indentation < currListInd;
            var maxFencedEndInd = currListInd + 3;
            if (state.fencedEndRE && state.indentation <= maxFencedEndInd && (hasExitedList || stream.match(state.fencedEndRE))) {
                if (modeCfg.highlightFormatting) state.formatting = "code-block";
                var returnType;
                if (!hasExitedList) returnType = getType(state);
                state.localMode = state.localState = null;
                state.block = blockNormal;
                state.f = inlineNormal;
                state.fencedEndRE = null;
                state.code = 0;
                state.thisLine.fencedCodeEnd = true;
                if (hasExitedList) return switchBlock(stream, state, state.block);
                return returnType;
            } else if (state.localMode) return state.localMode.token(stream, state.localState);
            else {
                stream.skipToEnd();
                return tokenTypes.code;
            }
        }
        // Inline
        function getType(state) {
            var styles = [];
            if (state.formatting) {
                styles.push(tokenTypes.formatting);
                if (typeof state.formatting === "string") state.formatting = [
                    state.formatting
                ];
                for(var i = 0; i < state.formatting.length; i++){
                    styles.push(tokenTypes.formatting + "-" + state.formatting[i]);
                    if (state.formatting[i] === "header") styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.header);
                    // Add `formatting-quote` and `formatting-quote-#` for blockquotes
                    // Add `error` instead if the maximum blockquote nesting depth is passed
                    if (state.formatting[i] === "quote") {
                        if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) styles.push(tokenTypes.formatting + "-" + state.formatting[i] + "-" + state.quote);
                        else styles.push("error");
                    }
                }
            }
            if (state.taskOpen) {
                styles.push("meta");
                return styles.length ? styles.join(' ') : null;
            }
            if (state.taskClosed) {
                styles.push("property");
                return styles.length ? styles.join(' ') : null;
            }
            if (state.linkHref) styles.push(tokenTypes.linkHref, "url");
            else {
                if (state.strong) styles.push(tokenTypes.strong);
                if (state.em) styles.push(tokenTypes.em);
                if (state.strikethrough) styles.push(tokenTypes.strikethrough);
                if (state.emoji) styles.push(tokenTypes.emoji);
                if (state.linkText) styles.push(tokenTypes.linkText);
                if (state.code) styles.push(tokenTypes.code);
                if (state.image) styles.push(tokenTypes.image);
                if (state.imageAltText) styles.push(tokenTypes.imageAltText, "link");
                if (state.imageMarker) styles.push(tokenTypes.imageMarker);
            }
            if (state.header) styles.push(tokenTypes.header, tokenTypes.header + "-" + state.header);
            if (state.quote) {
                styles.push(tokenTypes.quote);
                // Add `quote-#` where the maximum for `#` is modeCfg.maxBlockquoteDepth
                if (!modeCfg.maxBlockquoteDepth || modeCfg.maxBlockquoteDepth >= state.quote) styles.push(tokenTypes.quote + "-" + state.quote);
                else styles.push(tokenTypes.quote + "-" + modeCfg.maxBlockquoteDepth);
            }
            if (state.list !== false) {
                var listMod = (state.listStack.length - 1) % 3;
                if (!listMod) styles.push(tokenTypes.list1);
                else if (listMod === 1) styles.push(tokenTypes.list2);
                else styles.push(tokenTypes.list3);
            }
            if (state.trailingSpaceNewLine) styles.push("trailing-space-new-line");
            else if (state.trailingSpace) styles.push("trailing-space-" + (state.trailingSpace % 2 ? "a" : "b"));
            return styles.length ? styles.join(' ') : null;
        }
        function handleText(stream, state) {
            if (stream.match(textRE, true)) return getType(state);
            return undefined;
        }
        function inlineNormal(stream, state) {
            var style = state.text(stream, state);
            if (typeof style !== 'undefined') return style;
            if (state.list) {
                state.list = null;
                return getType(state);
            }
            if (state.taskList) {
                var taskOpen = stream.match(taskListRE, true)[1] === " ";
                if (taskOpen) state.taskOpen = true;
                else state.taskClosed = true;
                if (modeCfg.highlightFormatting) state.formatting = "task";
                state.taskList = false;
                return getType(state);
            }
            state.taskOpen = false;
            state.taskClosed = false;
            if (state.header && stream.match(/^#+$/, true)) {
                if (modeCfg.highlightFormatting) state.formatting = "header";
                return getType(state);
            }
            var ch = stream.next();
            // Matches link titles present on next line
            if (state.linkTitle) {
                state.linkTitle = false;
                var matchCh = ch;
                if (ch === '(') matchCh = ')';
                matchCh = (matchCh + '').replace(/([.?*+^\[\]\\(){}|-])/g, "\\$1");
                var regex = '^\\s*(?:[^' + matchCh + '\\\\]+|\\\\\\\\|\\\\.)' + matchCh;
                if (stream.match(new RegExp(regex), true)) return tokenTypes.linkHref;
            }
            // If this block is changed, it may need to be updated in GFM mode
            if (ch === '`') {
                var previousFormatting = state.formatting;
                if (modeCfg.highlightFormatting) state.formatting = "code";
                stream.eatWhile('`');
                var count = stream.current().length;
                if (state.code == 0 && (!state.quote || count == 1)) {
                    state.code = count;
                    return getType(state);
                } else if (count == state.code) {
                    var t = getType(state);
                    state.code = 0;
                    return t;
                } else {
                    state.formatting = previousFormatting;
                    return getType(state);
                }
            } else if (state.code) return getType(state);
            if (ch === '\\') {
                stream.next();
                if (modeCfg.highlightFormatting) {
                    var type = getType(state);
                    var formattingEscape = tokenTypes.formatting + "-escape";
                    return type ? type + " " + formattingEscape : formattingEscape;
                }
            }
            if (ch === '!' && stream.match(/\[[^\]]*\] ?(?:\(|\[)/, false)) {
                state.imageMarker = true;
                state.image = true;
                if (modeCfg.highlightFormatting) state.formatting = "image";
                return getType(state);
            }
            if (ch === '[' && state.imageMarker && stream.match(/[^\]]*\](\(.*?\)| ?\[.*?\])/, false)) {
                state.imageMarker = false;
                state.imageAltText = true;
                if (modeCfg.highlightFormatting) state.formatting = "image";
                return getType(state);
            }
            if (ch === ']' && state.imageAltText) {
                if (modeCfg.highlightFormatting) state.formatting = "image";
                var type = getType(state);
                state.imageAltText = false;
                state.image = false;
                state.inline = state.f = linkHref;
                return type;
            }
            if (ch === '[' && !state.image) {
                if (state.linkText && stream.match(/^.*?\]/)) return getType(state);
                state.linkText = true;
                if (modeCfg.highlightFormatting) state.formatting = "link";
                return getType(state);
            }
            if (ch === ']' && state.linkText) {
                if (modeCfg.highlightFormatting) state.formatting = "link";
                var type = getType(state);
                state.linkText = false;
                state.inline = state.f = stream.match(/\(.*?\)| ?\[.*?\]/, false) ? linkHref : inlineNormal;
                return type;
            }
            if (ch === '<' && stream.match(/^(https?|ftps?):\/\/(?:[^\\>]|\\.)+>/, false)) {
                state.f = state.inline = linkInline;
                if (modeCfg.highlightFormatting) state.formatting = "link";
                var type = getType(state);
                if (type) type += " ";
                else type = "";
                return type + tokenTypes.linkInline;
            }
            if (ch === '<' && stream.match(/^[^> \\]+@(?:[^\\>]|\\.)+>/, false)) {
                state.f = state.inline = linkInline;
                if (modeCfg.highlightFormatting) state.formatting = "link";
                var type = getType(state);
                if (type) type += " ";
                else type = "";
                return type + tokenTypes.linkEmail;
            }
            if (modeCfg.xml && ch === '<' && stream.match(/^(!--|\?|!\[CDATA\[|[a-z][a-z0-9-]*(?:\s+[a-z_:.\-]+(?:\s*=\s*[^>]+)?)*\s*(?:>|$))/i, false)) {
                var end = stream.string.indexOf(">", stream.pos);
                if (end != -1) {
                    var atts = stream.string.substring(stream.start, end);
                    if (/markdown\s*=\s*('|"){0,1}1('|"){0,1}/.test(atts)) state.md_inside = true;
                }
                stream.backUp(1);
                state.htmlState = CodeMirror.startState(htmlMode);
                return switchBlock(stream, state, htmlBlock);
            }
            if (modeCfg.xml && ch === '<' && stream.match(/^\/\w*?>/)) {
                state.md_inside = false;
                return "tag";
            } else if (ch === "*" || ch === "_") {
                var len = 1, before = stream.pos == 1 ? " " : stream.string.charAt(stream.pos - 2);
                while(len < 3 && stream.eat(ch))len++;
                var after = stream.peek() || " ";
                // See http://spec.commonmark.org/0.27/#emphasis-and-strong-emphasis
                var leftFlanking = !/\s/.test(after) && (!punctuation.test(after) || /\s/.test(before) || punctuation.test(before));
                var rightFlanking = !/\s/.test(before) && (!punctuation.test(before) || /\s/.test(after) || punctuation.test(after));
                var setEm = null, setStrong = null;
                if (len % 2) {
                    if (!state.em && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before))) setEm = true;
                    else if (state.em == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after))) setEm = false;
                }
                if (len > 1) {
                    if (!state.strong && leftFlanking && (ch === "*" || !rightFlanking || punctuation.test(before))) setStrong = true;
                    else if (state.strong == ch && rightFlanking && (ch === "*" || !leftFlanking || punctuation.test(after))) setStrong = false;
                }
                if (setStrong != null || setEm != null) {
                    if (modeCfg.highlightFormatting) state.formatting = setEm == null ? "strong" : setStrong == null ? "em" : "strong em";
                    if (setEm === true) state.em = ch;
                    if (setStrong === true) state.strong = ch;
                    var t = getType(state);
                    if (setEm === false) state.em = false;
                    if (setStrong === false) state.strong = false;
                    return t;
                }
            } else if (ch === ' ') {
                if (stream.eat('*') || stream.eat('_')) {
                    if (stream.peek() === ' ') return getType(state);
                    else stream.backUp(1);
                }
            }
            if (modeCfg.strikethrough) {
                if (ch === '~' && stream.eatWhile(ch)) {
                    if (state.strikethrough) {
                        if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
                        var t = getType(state);
                        state.strikethrough = false;
                        return t;
                    } else if (stream.match(/^[^\s]/, false)) {
                        state.strikethrough = true;
                        if (modeCfg.highlightFormatting) state.formatting = "strikethrough";
                        return getType(state);
                    }
                } else if (ch === ' ') {
                    if (stream.match('~~', true)) {
                        if (stream.peek() === ' ') return getType(state);
                        else stream.backUp(2);
                    }
                }
            }
            if (modeCfg.emoji && ch === ":" && stream.match(/^(?:[a-z_\d+][a-z_\d+-]*|\-[a-z_\d+][a-z_\d+-]*):/)) {
                state.emoji = true;
                if (modeCfg.highlightFormatting) state.formatting = "emoji";
                var retType = getType(state);
                state.emoji = false;
                return retType;
            }
            if (ch === ' ') {
                if (stream.match(/^ +$/, false)) state.trailingSpace++;
                else if (state.trailingSpace) state.trailingSpaceNewLine = true;
            }
            return getType(state);
        }
        function linkInline(stream, state) {
            var ch = stream.next();
            if (ch === ">") {
                state.f = state.inline = inlineNormal;
                if (modeCfg.highlightFormatting) state.formatting = "link";
                var type = getType(state);
                if (type) type += " ";
                else type = "";
                return type + tokenTypes.linkInline;
            }
            stream.match(/^[^>]+/, true);
            return tokenTypes.linkInline;
        }
        function linkHref(stream, state) {
            // Check if space, and return NULL if so (to avoid marking the space)
            if (stream.eatSpace()) return null;
            var ch = stream.next();
            if (ch === '(' || ch === '[') {
                state.f = state.inline = getLinkHrefInside(ch === "(" ? ")" : "]");
                if (modeCfg.highlightFormatting) state.formatting = "link-string";
                state.linkHref = true;
                return getType(state);
            }
            return 'error';
        }
        var linkRE = {
            ")": /^(?:[^\\\(\)]|\\.|\((?:[^\\\(\)]|\\.)*\))*?(?=\))/,
            "]": /^(?:[^\\\[\]]|\\.|\[(?:[^\\\[\]]|\\.)*\])*?(?=\])/
        };
        function getLinkHrefInside(endChar) {
            return function(stream, state) {
                var ch = stream.next();
                if (ch === endChar) {
                    state.f = state.inline = inlineNormal;
                    if (modeCfg.highlightFormatting) state.formatting = "link-string";
                    var returnState = getType(state);
                    state.linkHref = false;
                    return returnState;
                }
                stream.match(linkRE[endChar]);
                state.linkHref = true;
                return getType(state);
            };
        }
        function footnoteLink(stream, state) {
            if (stream.match(/^([^\]\\]|\\.)*\]:/, false)) {
                state.f = footnoteLinkInside;
                stream.next(); // Consume [
                if (modeCfg.highlightFormatting) state.formatting = "link";
                state.linkText = true;
                return getType(state);
            }
            return switchInline(stream, state, inlineNormal);
        }
        function footnoteLinkInside(stream, state) {
            if (stream.match(']:', true)) {
                state.f = state.inline = footnoteUrl;
                if (modeCfg.highlightFormatting) state.formatting = "link";
                var returnType = getType(state);
                state.linkText = false;
                return returnType;
            }
            stream.match(/^([^\]\\]|\\.)+/, true);
            return tokenTypes.linkText;
        }
        function footnoteUrl(stream, state) {
            // Check if space, and return NULL if so (to avoid marking the space)
            if (stream.eatSpace()) return null;
            // Match URL
            stream.match(/^[^\s]+/, true);
            // Check for link title
            if (stream.peek() === undefined) state.linkTitle = true;
            else stream.match(/^(?:\s+(?:"(?:[^"\\]|\\.)+"|'(?:[^'\\]|\\.)+'|\((?:[^)\\]|\\.)+\)))?/, true);
            state.f = state.inline = inlineNormal;
            return tokenTypes.linkHref + " url";
        }
        var mode = {
            startState: function() {
                return {
                    f: blockNormal,
                    prevLine: {
                        stream: null
                    },
                    thisLine: {
                        stream: null
                    },
                    block: blockNormal,
                    htmlState: null,
                    indentation: 0,
                    inline: inlineNormal,
                    text: handleText,
                    formatting: false,
                    linkText: false,
                    linkHref: false,
                    linkTitle: false,
                    code: 0,
                    em: false,
                    strong: false,
                    header: 0,
                    setext: 0,
                    hr: false,
                    taskList: false,
                    list: false,
                    listStack: [],
                    quote: 0,
                    trailingSpace: 0,
                    trailingSpaceNewLine: false,
                    strikethrough: false,
                    emoji: false,
                    fencedEndRE: null
                };
            },
            copyState: function(s) {
                return {
                    f: s.f,
                    prevLine: s.prevLine,
                    thisLine: s.thisLine,
                    block: s.block,
                    htmlState: s.htmlState && CodeMirror.copyState(htmlMode, s.htmlState),
                    indentation: s.indentation,
                    localMode: s.localMode,
                    localState: s.localMode ? CodeMirror.copyState(s.localMode, s.localState) : null,
                    inline: s.inline,
                    text: s.text,
                    formatting: false,
                    linkText: s.linkText,
                    linkTitle: s.linkTitle,
                    linkHref: s.linkHref,
                    code: s.code,
                    em: s.em,
                    strong: s.strong,
                    strikethrough: s.strikethrough,
                    emoji: s.emoji,
                    header: s.header,
                    setext: s.setext,
                    hr: s.hr,
                    taskList: s.taskList,
                    list: s.list,
                    listStack: s.listStack.slice(0),
                    quote: s.quote,
                    indentedCode: s.indentedCode,
                    trailingSpace: s.trailingSpace,
                    trailingSpaceNewLine: s.trailingSpaceNewLine,
                    md_inside: s.md_inside,
                    fencedEndRE: s.fencedEndRE
                };
            },
            token: function(stream, state) {
                // Reset state.formatting
                state.formatting = false;
                if (stream != state.thisLine.stream) {
                    state.header = 0;
                    state.hr = false;
                    if (stream.match(/^\s*$/, true)) {
                        blankLine(state);
                        return null;
                    }
                    state.prevLine = state.thisLine;
                    state.thisLine = {
                        stream: stream
                    };
                    // Reset state.taskList
                    state.taskList = false;
                    // Reset state.trailingSpace
                    state.trailingSpace = 0;
                    state.trailingSpaceNewLine = false;
                    if (!state.localState) {
                        state.f = state.block;
                        if (state.f != htmlBlock) {
                            var indentation = stream.match(/^\s*/, true)[0].replace(/\t/g, expandedTab).length;
                            state.indentation = indentation;
                            state.indentationDiff = null;
                            if (indentation > 0) return null;
                        }
                    }
                }
                return state.f(stream, state);
            },
            innerMode: function(state) {
                if (state.block == htmlBlock) return {
                    state: state.htmlState,
                    mode: htmlMode
                };
                if (state.localState) return {
                    state: state.localState,
                    mode: state.localMode
                };
                return {
                    state: state,
                    mode: mode
                };
            },
            indent: function(state, textAfter, line) {
                if (state.block == htmlBlock && htmlMode.indent) return htmlMode.indent(state.htmlState, textAfter, line);
                if (state.localState && state.localMode.indent) return state.localMode.indent(state.localState, textAfter, line);
                return CodeMirror.Pass;
            },
            blankLine: blankLine,
            getType: getType,
            blockCommentStart: "<!--",
            blockCommentEnd: "-->",
            closeBrackets: "()[]{}''\"\"``",
            fold: "markdown"
        };
        return mode;
    }, "xml");
    CodeMirror.defineMIME("text/markdown", "markdown");
    CodeMirror.defineMIME("text/x-markdown", "markdown");
});

});
parcelRegister("eADLY", function(module, exports) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")));
})(function(CodeMirror) {
    "use strict";
    var htmlConfig = {
        autoSelfClosers: {
            'area': true,
            'base': true,
            'br': true,
            'col': true,
            'command': true,
            'embed': true,
            'frame': true,
            'hr': true,
            'img': true,
            'input': true,
            'keygen': true,
            'link': true,
            'meta': true,
            'param': true,
            'source': true,
            'track': true,
            'wbr': true,
            'menuitem': true
        },
        implicitlyClosed: {
            'dd': true,
            'li': true,
            'optgroup': true,
            'option': true,
            'p': true,
            'rp': true,
            'rt': true,
            'tbody': true,
            'td': true,
            'tfoot': true,
            'th': true,
            'tr': true
        },
        contextGrabbers: {
            'dd': {
                'dd': true,
                'dt': true
            },
            'dt': {
                'dd': true,
                'dt': true
            },
            'li': {
                'li': true
            },
            'option': {
                'option': true,
                'optgroup': true
            },
            'optgroup': {
                'optgroup': true
            },
            'p': {
                'address': true,
                'article': true,
                'aside': true,
                'blockquote': true,
                'dir': true,
                'div': true,
                'dl': true,
                'fieldset': true,
                'footer': true,
                'form': true,
                'h1': true,
                'h2': true,
                'h3': true,
                'h4': true,
                'h5': true,
                'h6': true,
                'header': true,
                'hgroup': true,
                'hr': true,
                'menu': true,
                'nav': true,
                'ol': true,
                'p': true,
                'pre': true,
                'section': true,
                'table': true,
                'ul': true
            },
            'rp': {
                'rp': true,
                'rt': true
            },
            'rt': {
                'rp': true,
                'rt': true
            },
            'tbody': {
                'tbody': true,
                'tfoot': true
            },
            'td': {
                'td': true,
                'th': true
            },
            'tfoot': {
                'tbody': true
            },
            'th': {
                'td': true,
                'th': true
            },
            'thead': {
                'tbody': true,
                'tfoot': true
            },
            'tr': {
                'tr': true
            }
        },
        doNotIndent: {
            "pre": true
        },
        allowUnquoted: true,
        allowMissing: true,
        caseFold: true
    };
    var xmlConfig = {
        autoSelfClosers: {},
        implicitlyClosed: {},
        contextGrabbers: {},
        doNotIndent: {},
        allowUnquoted: false,
        allowMissing: false,
        allowMissingTagName: false,
        caseFold: false
    };
    CodeMirror.defineMode("xml", function(editorConf, config_) {
        var indentUnit = editorConf.indentUnit;
        var config = {};
        var defaults = config_.htmlMode ? htmlConfig : xmlConfig;
        for(var prop in defaults)config[prop] = defaults[prop];
        for(var prop in config_)config[prop] = config_[prop];
        // Return variables for tokenizers
        var type, setStyle;
        function inText(stream, state) {
            function chain(parser) {
                state.tokenize = parser;
                return parser(stream, state);
            }
            var ch = stream.next();
            if (ch == "<") {
                if (stream.eat("!")) {
                    if (stream.eat("[")) {
                        if (stream.match("CDATA[")) return chain(inBlock("atom", "]]>"));
                        else return null;
                    } else if (stream.match("--")) return chain(inBlock("comment", "-->"));
                    else if (stream.match("DOCTYPE", true, true)) {
                        stream.eatWhile(/[\w\._\-]/);
                        return chain(doctype(1));
                    } else return null;
                } else if (stream.eat("?")) {
                    stream.eatWhile(/[\w\._\-]/);
                    state.tokenize = inBlock("meta", "?>");
                    return "meta";
                } else {
                    type = stream.eat("/") ? "closeTag" : "openTag";
                    state.tokenize = inTag;
                    return "tag bracket";
                }
            } else if (ch == "&") {
                var ok;
                if (stream.eat("#")) {
                    if (stream.eat("x")) ok = stream.eatWhile(/[a-fA-F\d]/) && stream.eat(";");
                    else ok = stream.eatWhile(/[\d]/) && stream.eat(";");
                } else ok = stream.eatWhile(/[\w\.\-:]/) && stream.eat(";");
                return ok ? "atom" : "error";
            } else {
                stream.eatWhile(/[^&<]/);
                return null;
            }
        }
        inText.isInText = true;
        function inTag(stream, state) {
            var ch = stream.next();
            if (ch == ">" || ch == "/" && stream.eat(">")) {
                state.tokenize = inText;
                type = ch == ">" ? "endTag" : "selfcloseTag";
                return "tag bracket";
            } else if (ch == "=") {
                type = "equals";
                return null;
            } else if (ch == "<") {
                state.tokenize = inText;
                state.state = baseState;
                state.tagName = state.tagStart = null;
                var next = state.tokenize(stream, state);
                return next ? next + " tag error" : "tag error";
            } else if (/[\'\"]/.test(ch)) {
                state.tokenize = inAttribute(ch);
                state.stringStartCol = stream.column();
                return state.tokenize(stream, state);
            } else {
                stream.match(/^[^\s\u00a0=<>\"\']*[^\s\u00a0=<>\"\'\/]/);
                return "word";
            }
        }
        function inAttribute(quote) {
            var closure = function(stream, state) {
                while(!stream.eol())if (stream.next() == quote) {
                    state.tokenize = inTag;
                    break;
                }
                return "string";
            };
            closure.isInAttribute = true;
            return closure;
        }
        function inBlock(style, terminator) {
            return function(stream, state) {
                while(!stream.eol()){
                    if (stream.match(terminator)) {
                        state.tokenize = inText;
                        break;
                    }
                    stream.next();
                }
                return style;
            };
        }
        function doctype(depth) {
            return function(stream, state) {
                var ch;
                while((ch = stream.next()) != null){
                    if (ch == "<") {
                        state.tokenize = doctype(depth + 1);
                        return state.tokenize(stream, state);
                    } else if (ch == ">") {
                        if (depth == 1) {
                            state.tokenize = inText;
                            break;
                        } else {
                            state.tokenize = doctype(depth - 1);
                            return state.tokenize(stream, state);
                        }
                    }
                }
                return "meta";
            };
        }
        function lower(tagName) {
            return tagName && tagName.toLowerCase();
        }
        function Context(state, tagName, startOfLine) {
            this.prev = state.context;
            this.tagName = tagName || "";
            this.indent = state.indented;
            this.startOfLine = startOfLine;
            if (config.doNotIndent.hasOwnProperty(tagName) || state.context && state.context.noIndent) this.noIndent = true;
        }
        function popContext(state) {
            if (state.context) state.context = state.context.prev;
        }
        function maybePopContext(state, nextTagName) {
            var parentTagName;
            while(true){
                if (!state.context) return;
                parentTagName = state.context.tagName;
                if (!config.contextGrabbers.hasOwnProperty(lower(parentTagName)) || !config.contextGrabbers[lower(parentTagName)].hasOwnProperty(lower(nextTagName))) return;
                popContext(state);
            }
        }
        function baseState(type, stream, state) {
            if (type == "openTag") {
                state.tagStart = stream.column();
                return tagNameState;
            } else if (type == "closeTag") return closeTagNameState;
            else return baseState;
        }
        function tagNameState(type, stream, state) {
            if (type == "word") {
                state.tagName = stream.current();
                setStyle = "tag";
                return attrState;
            } else if (config.allowMissingTagName && type == "endTag") {
                setStyle = "tag bracket";
                return attrState(type, stream, state);
            } else {
                setStyle = "error";
                return tagNameState;
            }
        }
        function closeTagNameState(type, stream, state) {
            if (type == "word") {
                var tagName = stream.current();
                if (state.context && state.context.tagName != tagName && config.implicitlyClosed.hasOwnProperty(lower(state.context.tagName))) popContext(state);
                if (state.context && state.context.tagName == tagName || config.matchClosing === false) {
                    setStyle = "tag";
                    return closeState;
                } else {
                    setStyle = "tag error";
                    return closeStateErr;
                }
            } else if (config.allowMissingTagName && type == "endTag") {
                setStyle = "tag bracket";
                return closeState(type, stream, state);
            } else {
                setStyle = "error";
                return closeStateErr;
            }
        }
        function closeState(type, _stream, state) {
            if (type != "endTag") {
                setStyle = "error";
                return closeState;
            }
            popContext(state);
            return baseState;
        }
        function closeStateErr(type, stream, state) {
            setStyle = "error";
            return closeState(type, stream, state);
        }
        function attrState(type, _stream, state) {
            if (type == "word") {
                setStyle = "attribute";
                return attrEqState;
            } else if (type == "endTag" || type == "selfcloseTag") {
                var tagName = state.tagName, tagStart = state.tagStart;
                state.tagName = state.tagStart = null;
                if (type == "selfcloseTag" || config.autoSelfClosers.hasOwnProperty(lower(tagName))) maybePopContext(state, tagName);
                else {
                    maybePopContext(state, tagName);
                    state.context = new Context(state, tagName, tagStart == state.indented);
                }
                return baseState;
            }
            setStyle = "error";
            return attrState;
        }
        function attrEqState(type, stream, state) {
            if (type == "equals") return attrValueState;
            if (!config.allowMissing) setStyle = "error";
            return attrState(type, stream, state);
        }
        function attrValueState(type, stream, state) {
            if (type == "string") return attrContinuedState;
            if (type == "word" && config.allowUnquoted) {
                setStyle = "string";
                return attrState;
            }
            setStyle = "error";
            return attrState(type, stream, state);
        }
        function attrContinuedState(type, stream, state) {
            if (type == "string") return attrContinuedState;
            return attrState(type, stream, state);
        }
        return {
            startState: function(baseIndent) {
                var state = {
                    tokenize: inText,
                    state: baseState,
                    indented: baseIndent || 0,
                    tagName: null,
                    tagStart: null,
                    context: null
                };
                if (baseIndent != null) state.baseIndent = baseIndent;
                return state;
            },
            token: function(stream, state) {
                if (!state.tagName && stream.sol()) state.indented = stream.indentation();
                if (stream.eatSpace()) return null;
                type = null;
                var style = state.tokenize(stream, state);
                if ((style || type) && style != "comment") {
                    setStyle = null;
                    state.state = state.state(type || style, stream, state);
                    if (setStyle) style = setStyle == "error" ? style + " error" : setStyle;
                }
                return style;
            },
            indent: function(state, textAfter, fullLine) {
                var context = state.context;
                // Indent multi-line strings (e.g. css).
                if (state.tokenize.isInAttribute) {
                    if (state.tagStart == state.indented) return state.stringStartCol + 1;
                    else return state.indented + indentUnit;
                }
                if (context && context.noIndent) return CodeMirror.Pass;
                if (state.tokenize != inTag && state.tokenize != inText) return fullLine ? fullLine.match(/^(\s*)/)[0].length : 0;
                // Indent the starts of attribute names.
                if (state.tagName) {
                    if (config.multilineTagIndentPastTag !== false) return state.tagStart + state.tagName.length + 2;
                    else return state.tagStart + indentUnit * (config.multilineTagIndentFactor || 1);
                }
                if (config.alignCDATA && /<!\[CDATA\[/.test(textAfter)) return 0;
                var tagAfter = textAfter && /^<(\/)?([\w_:\.-]*)/.exec(textAfter);
                if (tagAfter && tagAfter[1]) while(context){
                    if (context.tagName == tagAfter[2]) {
                        context = context.prev;
                        break;
                    } else if (config.implicitlyClosed.hasOwnProperty(lower(context.tagName))) context = context.prev;
                    else break;
                }
                else if (tagAfter) while(context){
                    var grabbers = config.contextGrabbers[lower(context.tagName)];
                    if (grabbers && grabbers.hasOwnProperty(lower(tagAfter[2]))) context = context.prev;
                    else break;
                }
                while(context && context.prev && !context.startOfLine)context = context.prev;
                if (context) return context.indent + indentUnit;
                else return state.baseIndent || 0;
            },
            electricInput: /<\/[\s\w:]+>$/,
            blockCommentStart: "<!--",
            blockCommentEnd: "-->",
            configuration: config.htmlMode ? "html" : "xml",
            helperType: config.htmlMode ? "html" : "xml",
            skipAttribute: function(state) {
                if (state.state == attrValueState) state.state = attrState;
            },
            xmlCurrentTag: function(state) {
                return state.tagName ? {
                    name: state.tagName,
                    close: state.type == "closeTag"
                } : null;
            },
            xmlCurrentContext: function(state) {
                var context = [];
                for(var cx = state.context; cx; cx = cx.prev)context.push(cx.tagName);
                return context.reverse();
            }
        };
    });
    CodeMirror.defineMIME("text/xml", "xml");
    CodeMirror.defineMIME("application/xml", "xml");
    if (!CodeMirror.mimeModes.hasOwnProperty("text/html")) CodeMirror.defineMIME("text/html", {
        name: "xml",
        htmlMode: true
    });
});

});

parcelRegister("4ehgN", function(module, exports) {

// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: https://codemirror.net/5/LICENSE
(function(mod) {
    mod((parcelRequire("aYIk2")));
})(function(CodeMirror) {
    "use strict";
    CodeMirror.modeInfo = [
        {
            name: "APL",
            mime: "text/apl",
            mode: "apl",
            ext: [
                "dyalog",
                "apl"
            ]
        },
        {
            name: "PGP",
            mimes: [
                "application/pgp",
                "application/pgp-encrypted",
                "application/pgp-keys",
                "application/pgp-signature"
            ],
            mode: "asciiarmor",
            ext: [
                "asc",
                "pgp",
                "sig"
            ]
        },
        {
            name: "ASN.1",
            mime: "text/x-ttcn-asn",
            mode: "asn.1",
            ext: [
                "asn",
                "asn1"
            ]
        },
        {
            name: "Asterisk",
            mime: "text/x-asterisk",
            mode: "asterisk",
            file: /^extensions\.conf$/i
        },
        {
            name: "Brainfuck",
            mime: "text/x-brainfuck",
            mode: "brainfuck",
            ext: [
                "b",
                "bf"
            ]
        },
        {
            name: "C",
            mime: "text/x-csrc",
            mode: "clike",
            ext: [
                "c",
                "h",
                "ino"
            ]
        },
        {
            name: "C++",
            mime: "text/x-c++src",
            mode: "clike",
            ext: [
                "cpp",
                "c++",
                "cc",
                "cxx",
                "hpp",
                "h++",
                "hh",
                "hxx"
            ],
            alias: [
                "cpp"
            ]
        },
        {
            name: "Cobol",
            mime: "text/x-cobol",
            mode: "cobol",
            ext: [
                "cob",
                "cpy",
                "cbl"
            ]
        },
        {
            name: "C#",
            mime: "text/x-csharp",
            mode: "clike",
            ext: [
                "cs"
            ],
            alias: [
                "csharp",
                "cs"
            ]
        },
        {
            name: "Clojure",
            mime: "text/x-clojure",
            mode: "clojure",
            ext: [
                "clj",
                "cljc",
                "cljx"
            ]
        },
        {
            name: "ClojureScript",
            mime: "text/x-clojurescript",
            mode: "clojure",
            ext: [
                "cljs"
            ]
        },
        {
            name: "Closure Stylesheets (GSS)",
            mime: "text/x-gss",
            mode: "css",
            ext: [
                "gss"
            ]
        },
        {
            name: "CMake",
            mime: "text/x-cmake",
            mode: "cmake",
            ext: [
                "cmake",
                "cmake.in"
            ],
            file: /^CMakeLists\.txt$/
        },
        {
            name: "CoffeeScript",
            mimes: [
                "application/vnd.coffeescript",
                "text/coffeescript",
                "text/x-coffeescript"
            ],
            mode: "coffeescript",
            ext: [
                "coffee"
            ],
            alias: [
                "coffee",
                "coffee-script"
            ]
        },
        {
            name: "Common Lisp",
            mime: "text/x-common-lisp",
            mode: "commonlisp",
            ext: [
                "cl",
                "lisp",
                "el"
            ],
            alias: [
                "lisp"
            ]
        },
        {
            name: "Cypher",
            mime: "application/x-cypher-query",
            mode: "cypher",
            ext: [
                "cyp",
                "cypher"
            ]
        },
        {
            name: "Cython",
            mime: "text/x-cython",
            mode: "python",
            ext: [
                "pyx",
                "pxd",
                "pxi"
            ]
        },
        {
            name: "Crystal",
            mime: "text/x-crystal",
            mode: "crystal",
            ext: [
                "cr"
            ]
        },
        {
            name: "CSS",
            mime: "text/css",
            mode: "css",
            ext: [
                "css"
            ]
        },
        {
            name: "CQL",
            mime: "text/x-cassandra",
            mode: "sql",
            ext: [
                "cql"
            ]
        },
        {
            name: "D",
            mime: "text/x-d",
            mode: "d",
            ext: [
                "d"
            ]
        },
        {
            name: "Dart",
            mimes: [
                "application/dart",
                "text/x-dart"
            ],
            mode: "dart",
            ext: [
                "dart"
            ]
        },
        {
            name: "diff",
            mime: "text/x-diff",
            mode: "diff",
            ext: [
                "diff",
                "patch"
            ]
        },
        {
            name: "Django",
            mime: "text/x-django",
            mode: "django"
        },
        {
            name: "Dockerfile",
            mime: "text/x-dockerfile",
            mode: "dockerfile",
            file: /^Dockerfile$/
        },
        {
            name: "DTD",
            mime: "application/xml-dtd",
            mode: "dtd",
            ext: [
                "dtd"
            ]
        },
        {
            name: "Dylan",
            mime: "text/x-dylan",
            mode: "dylan",
            ext: [
                "dylan",
                "dyl",
                "intr"
            ]
        },
        {
            name: "EBNF",
            mime: "text/x-ebnf",
            mode: "ebnf"
        },
        {
            name: "ECL",
            mime: "text/x-ecl",
            mode: "ecl",
            ext: [
                "ecl"
            ]
        },
        {
            name: "edn",
            mime: "application/edn",
            mode: "clojure",
            ext: [
                "edn"
            ]
        },
        {
            name: "Eiffel",
            mime: "text/x-eiffel",
            mode: "eiffel",
            ext: [
                "e"
            ]
        },
        {
            name: "Elm",
            mime: "text/x-elm",
            mode: "elm",
            ext: [
                "elm"
            ]
        },
        {
            name: "Embedded JavaScript",
            mime: "application/x-ejs",
            mode: "htmlembedded",
            ext: [
                "ejs"
            ]
        },
        {
            name: "Embedded Ruby",
            mime: "application/x-erb",
            mode: "htmlembedded",
            ext: [
                "erb"
            ]
        },
        {
            name: "Erlang",
            mime: "text/x-erlang",
            mode: "erlang",
            ext: [
                "erl"
            ]
        },
        {
            name: "Esper",
            mime: "text/x-esper",
            mode: "sql"
        },
        {
            name: "Factor",
            mime: "text/x-factor",
            mode: "factor",
            ext: [
                "factor"
            ]
        },
        {
            name: "FCL",
            mime: "text/x-fcl",
            mode: "fcl"
        },
        {
            name: "Forth",
            mime: "text/x-forth",
            mode: "forth",
            ext: [
                "forth",
                "fth",
                "4th"
            ]
        },
        {
            name: "Fortran",
            mime: "text/x-fortran",
            mode: "fortran",
            ext: [
                "f",
                "for",
                "f77",
                "f90",
                "f95"
            ]
        },
        {
            name: "F#",
            mime: "text/x-fsharp",
            mode: "mllike",
            ext: [
                "fs"
            ],
            alias: [
                "fsharp"
            ]
        },
        {
            name: "Gas",
            mime: "text/x-gas",
            mode: "gas",
            ext: [
                "s"
            ]
        },
        {
            name: "Gherkin",
            mime: "text/x-feature",
            mode: "gherkin",
            ext: [
                "feature"
            ]
        },
        {
            name: "GitHub Flavored Markdown",
            mime: "text/x-gfm",
            mode: "gfm",
            file: /^(readme|contributing|history)\.md$/i
        },
        {
            name: "Go",
            mime: "text/x-go",
            mode: "go",
            ext: [
                "go"
            ]
        },
        {
            name: "Groovy",
            mime: "text/x-groovy",
            mode: "groovy",
            ext: [
                "groovy",
                "gradle"
            ],
            file: /^Jenkinsfile$/
        },
        {
            name: "HAML",
            mime: "text/x-haml",
            mode: "haml",
            ext: [
                "haml"
            ]
        },
        {
            name: "Haskell",
            mime: "text/x-haskell",
            mode: "haskell",
            ext: [
                "hs"
            ]
        },
        {
            name: "Haskell (Literate)",
            mime: "text/x-literate-haskell",
            mode: "haskell-literate",
            ext: [
                "lhs"
            ]
        },
        {
            name: "Haxe",
            mime: "text/x-haxe",
            mode: "haxe",
            ext: [
                "hx"
            ]
        },
        {
            name: "HXML",
            mime: "text/x-hxml",
            mode: "haxe",
            ext: [
                "hxml"
            ]
        },
        {
            name: "ASP.NET",
            mime: "application/x-aspx",
            mode: "htmlembedded",
            ext: [
                "aspx"
            ],
            alias: [
                "asp",
                "aspx"
            ]
        },
        {
            name: "HTML",
            mime: "text/html",
            mode: "htmlmixed",
            ext: [
                "html",
                "htm",
                "handlebars",
                "hbs"
            ],
            alias: [
                "xhtml"
            ]
        },
        {
            name: "HTTP",
            mime: "message/http",
            mode: "http"
        },
        {
            name: "IDL",
            mime: "text/x-idl",
            mode: "idl",
            ext: [
                "pro"
            ]
        },
        {
            name: "Pug",
            mime: "text/x-pug",
            mode: "pug",
            ext: [
                "jade",
                "pug"
            ],
            alias: [
                "jade"
            ]
        },
        {
            name: "Java",
            mime: "text/x-java",
            mode: "clike",
            ext: [
                "java"
            ]
        },
        {
            name: "Java Server Pages",
            mime: "application/x-jsp",
            mode: "htmlembedded",
            ext: [
                "jsp"
            ],
            alias: [
                "jsp"
            ]
        },
        {
            name: "JavaScript",
            mimes: [
                "text/javascript",
                "text/ecmascript",
                "application/javascript",
                "application/x-javascript",
                "application/ecmascript"
            ],
            mode: "javascript",
            ext: [
                "js"
            ],
            alias: [
                "ecmascript",
                "js",
                "node"
            ]
        },
        {
            name: "JSON",
            mimes: [
                "application/json",
                "application/x-json"
            ],
            mode: "javascript",
            ext: [
                "json",
                "map"
            ],
            alias: [
                "json5"
            ]
        },
        {
            name: "JSON-LD",
            mime: "application/ld+json",
            mode: "javascript",
            ext: [
                "jsonld"
            ],
            alias: [
                "jsonld"
            ]
        },
        {
            name: "JSX",
            mime: "text/jsx",
            mode: "jsx",
            ext: [
                "jsx"
            ]
        },
        {
            name: "Jinja2",
            mime: "text/jinja2",
            mode: "jinja2",
            ext: [
                "j2",
                "jinja",
                "jinja2"
            ]
        },
        {
            name: "Julia",
            mime: "text/x-julia",
            mode: "julia",
            ext: [
                "jl"
            ],
            alias: [
                "jl"
            ]
        },
        {
            name: "Kotlin",
            mime: "text/x-kotlin",
            mode: "clike",
            ext: [
                "kt"
            ]
        },
        {
            name: "LESS",
            mime: "text/x-less",
            mode: "css",
            ext: [
                "less"
            ]
        },
        {
            name: "LiveScript",
            mime: "text/x-livescript",
            mode: "livescript",
            ext: [
                "ls"
            ],
            alias: [
                "ls"
            ]
        },
        {
            name: "Lua",
            mime: "text/x-lua",
            mode: "lua",
            ext: [
                "lua"
            ]
        },
        {
            name: "Markdown",
            mime: "text/x-markdown",
            mode: "markdown",
            ext: [
                "markdown",
                "md",
                "mkd"
            ]
        },
        {
            name: "mIRC",
            mime: "text/mirc",
            mode: "mirc"
        },
        {
            name: "MariaDB SQL",
            mime: "text/x-mariadb",
            mode: "sql"
        },
        {
            name: "Mathematica",
            mime: "text/x-mathematica",
            mode: "mathematica",
            ext: [
                "m",
                "nb",
                "wl",
                "wls"
            ]
        },
        {
            name: "Modelica",
            mime: "text/x-modelica",
            mode: "modelica",
            ext: [
                "mo"
            ]
        },
        {
            name: "MUMPS",
            mime: "text/x-mumps",
            mode: "mumps",
            ext: [
                "mps"
            ]
        },
        {
            name: "MS SQL",
            mime: "text/x-mssql",
            mode: "sql"
        },
        {
            name: "mbox",
            mime: "application/mbox",
            mode: "mbox",
            ext: [
                "mbox"
            ]
        },
        {
            name: "MySQL",
            mime: "text/x-mysql",
            mode: "sql"
        },
        {
            name: "Nginx",
            mime: "text/x-nginx-conf",
            mode: "nginx",
            file: /nginx.*\.conf$/i
        },
        {
            name: "NSIS",
            mime: "text/x-nsis",
            mode: "nsis",
            ext: [
                "nsh",
                "nsi"
            ]
        },
        {
            name: "NTriples",
            mimes: [
                "application/n-triples",
                "application/n-quads",
                "text/n-triples"
            ],
            mode: "ntriples",
            ext: [
                "nt",
                "nq"
            ]
        },
        {
            name: "Objective-C",
            mime: "text/x-objectivec",
            mode: "clike",
            ext: [
                "m"
            ],
            alias: [
                "objective-c",
                "objc"
            ]
        },
        {
            name: "Objective-C++",
            mime: "text/x-objectivec++",
            mode: "clike",
            ext: [
                "mm"
            ],
            alias: [
                "objective-c++",
                "objc++"
            ]
        },
        {
            name: "OCaml",
            mime: "text/x-ocaml",
            mode: "mllike",
            ext: [
                "ml",
                "mli",
                "mll",
                "mly"
            ]
        },
        {
            name: "Octave",
            mime: "text/x-octave",
            mode: "octave",
            ext: [
                "m"
            ]
        },
        {
            name: "Oz",
            mime: "text/x-oz",
            mode: "oz",
            ext: [
                "oz"
            ]
        },
        {
            name: "Pascal",
            mime: "text/x-pascal",
            mode: "pascal",
            ext: [
                "p",
                "pas"
            ]
        },
        {
            name: "PEG.js",
            mime: "null",
            mode: "pegjs",
            ext: [
                "jsonld"
            ]
        },
        {
            name: "Perl",
            mime: "text/x-perl",
            mode: "perl",
            ext: [
                "pl",
                "pm"
            ]
        },
        {
            name: "PHP",
            mimes: [
                "text/x-php",
                "application/x-httpd-php",
                "application/x-httpd-php-open"
            ],
            mode: "php",
            ext: [
                "php",
                "php3",
                "php4",
                "php5",
                "php7",
                "phtml"
            ]
        },
        {
            name: "Pig",
            mime: "text/x-pig",
            mode: "pig",
            ext: [
                "pig"
            ]
        },
        {
            name: "Plain Text",
            mime: "text/plain",
            mode: "null",
            ext: [
                "txt",
                "text",
                "conf",
                "def",
                "list",
                "log"
            ]
        },
        {
            name: "PLSQL",
            mime: "text/x-plsql",
            mode: "sql",
            ext: [
                "pls"
            ]
        },
        {
            name: "PostgreSQL",
            mime: "text/x-pgsql",
            mode: "sql"
        },
        {
            name: "PowerShell",
            mime: "application/x-powershell",
            mode: "powershell",
            ext: [
                "ps1",
                "psd1",
                "psm1"
            ]
        },
        {
            name: "Properties files",
            mime: "text/x-properties",
            mode: "properties",
            ext: [
                "properties",
                "ini",
                "in"
            ],
            alias: [
                "ini",
                "properties"
            ]
        },
        {
            name: "ProtoBuf",
            mime: "text/x-protobuf",
            mode: "protobuf",
            ext: [
                "proto"
            ]
        },
        {
            name: "Python",
            mime: "text/x-python",
            mode: "python",
            ext: [
                "BUILD",
                "bzl",
                "py",
                "pyw"
            ],
            file: /^(BUCK|BUILD)$/
        },
        {
            name: "Puppet",
            mime: "text/x-puppet",
            mode: "puppet",
            ext: [
                "pp"
            ]
        },
        {
            name: "Q",
            mime: "text/x-q",
            mode: "q",
            ext: [
                "q"
            ]
        },
        {
            name: "R",
            mime: "text/x-rsrc",
            mode: "r",
            ext: [
                "r",
                "R"
            ],
            alias: [
                "rscript"
            ]
        },
        {
            name: "reStructuredText",
            mime: "text/x-rst",
            mode: "rst",
            ext: [
                "rst"
            ],
            alias: [
                "rst"
            ]
        },
        {
            name: "RPM Changes",
            mime: "text/x-rpm-changes",
            mode: "rpm"
        },
        {
            name: "RPM Spec",
            mime: "text/x-rpm-spec",
            mode: "rpm",
            ext: [
                "spec"
            ]
        },
        {
            name: "Ruby",
            mime: "text/x-ruby",
            mode: "ruby",
            ext: [
                "rb"
            ],
            alias: [
                "jruby",
                "macruby",
                "rake",
                "rb",
                "rbx"
            ]
        },
        {
            name: "Rust",
            mime: "text/x-rustsrc",
            mode: "rust",
            ext: [
                "rs"
            ]
        },
        {
            name: "SAS",
            mime: "text/x-sas",
            mode: "sas",
            ext: [
                "sas"
            ]
        },
        {
            name: "Sass",
            mime: "text/x-sass",
            mode: "sass",
            ext: [
                "sass"
            ]
        },
        {
            name: "Scala",
            mime: "text/x-scala",
            mode: "clike",
            ext: [
                "scala"
            ]
        },
        {
            name: "Scheme",
            mime: "text/x-scheme",
            mode: "scheme",
            ext: [
                "scm",
                "ss"
            ]
        },
        {
            name: "SCSS",
            mime: "text/x-scss",
            mode: "css",
            ext: [
                "scss"
            ]
        },
        {
            name: "Shell",
            mimes: [
                "text/x-sh",
                "application/x-sh"
            ],
            mode: "shell",
            ext: [
                "sh",
                "ksh",
                "bash"
            ],
            alias: [
                "bash",
                "sh",
                "zsh"
            ],
            file: /^PKGBUILD$/
        },
        {
            name: "Sieve",
            mime: "application/sieve",
            mode: "sieve",
            ext: [
                "siv",
                "sieve"
            ]
        },
        {
            name: "Slim",
            mimes: [
                "text/x-slim",
                "application/x-slim"
            ],
            mode: "slim",
            ext: [
                "slim"
            ]
        },
        {
            name: "Smalltalk",
            mime: "text/x-stsrc",
            mode: "smalltalk",
            ext: [
                "st"
            ]
        },
        {
            name: "Smarty",
            mime: "text/x-smarty",
            mode: "smarty",
            ext: [
                "tpl"
            ]
        },
        {
            name: "Solr",
            mime: "text/x-solr",
            mode: "solr"
        },
        {
            name: "SML",
            mime: "text/x-sml",
            mode: "mllike",
            ext: [
                "sml",
                "sig",
                "fun",
                "smackspec"
            ]
        },
        {
            name: "Soy",
            mime: "text/x-soy",
            mode: "soy",
            ext: [
                "soy"
            ],
            alias: [
                "closure template"
            ]
        },
        {
            name: "SPARQL",
            mime: "application/sparql-query",
            mode: "sparql",
            ext: [
                "rq",
                "sparql"
            ],
            alias: [
                "sparul"
            ]
        },
        {
            name: "Spreadsheet",
            mime: "text/x-spreadsheet",
            mode: "spreadsheet",
            alias: [
                "excel",
                "formula"
            ]
        },
        {
            name: "SQL",
            mime: "text/x-sql",
            mode: "sql",
            ext: [
                "sql"
            ]
        },
        {
            name: "SQLite",
            mime: "text/x-sqlite",
            mode: "sql"
        },
        {
            name: "Squirrel",
            mime: "text/x-squirrel",
            mode: "clike",
            ext: [
                "nut"
            ]
        },
        {
            name: "Stylus",
            mime: "text/x-styl",
            mode: "stylus",
            ext: [
                "styl"
            ]
        },
        {
            name: "Swift",
            mime: "text/x-swift",
            mode: "swift",
            ext: [
                "swift"
            ]
        },
        {
            name: "sTeX",
            mime: "text/x-stex",
            mode: "stex"
        },
        {
            name: "LaTeX",
            mime: "text/x-latex",
            mode: "stex",
            ext: [
                "text",
                "ltx",
                "tex"
            ],
            alias: [
                "tex"
            ]
        },
        {
            name: "SystemVerilog",
            mime: "text/x-systemverilog",
            mode: "verilog",
            ext: [
                "v",
                "sv",
                "svh"
            ]
        },
        {
            name: "Tcl",
            mime: "text/x-tcl",
            mode: "tcl",
            ext: [
                "tcl"
            ]
        },
        {
            name: "Textile",
            mime: "text/x-textile",
            mode: "textile",
            ext: [
                "textile"
            ]
        },
        {
            name: "TiddlyWiki",
            mime: "text/x-tiddlywiki",
            mode: "tiddlywiki"
        },
        {
            name: "Tiki wiki",
            mime: "text/tiki",
            mode: "tiki"
        },
        {
            name: "TOML",
            mime: "text/x-toml",
            mode: "toml",
            ext: [
                "toml"
            ]
        },
        {
            name: "Tornado",
            mime: "text/x-tornado",
            mode: "tornado"
        },
        {
            name: "troff",
            mime: "text/troff",
            mode: "troff",
            ext: [
                "1",
                "2",
                "3",
                "4",
                "5",
                "6",
                "7",
                "8",
                "9"
            ]
        },
        {
            name: "TTCN",
            mime: "text/x-ttcn",
            mode: "ttcn",
            ext: [
                "ttcn",
                "ttcn3",
                "ttcnpp"
            ]
        },
        {
            name: "TTCN_CFG",
            mime: "text/x-ttcn-cfg",
            mode: "ttcn-cfg",
            ext: [
                "cfg"
            ]
        },
        {
            name: "Turtle",
            mime: "text/turtle",
            mode: "turtle",
            ext: [
                "ttl"
            ]
        },
        {
            name: "TypeScript",
            mime: "application/typescript",
            mode: "javascript",
            ext: [
                "ts"
            ],
            alias: [
                "ts"
            ]
        },
        {
            name: "TypeScript-JSX",
            mime: "text/typescript-jsx",
            mode: "jsx",
            ext: [
                "tsx"
            ],
            alias: [
                "tsx"
            ]
        },
        {
            name: "Twig",
            mime: "text/x-twig",
            mode: "twig"
        },
        {
            name: "Web IDL",
            mime: "text/x-webidl",
            mode: "webidl",
            ext: [
                "webidl"
            ]
        },
        {
            name: "VB.NET",
            mime: "text/x-vb",
            mode: "vb",
            ext: [
                "vb"
            ]
        },
        {
            name: "VBScript",
            mime: "text/vbscript",
            mode: "vbscript",
            ext: [
                "vbs"
            ]
        },
        {
            name: "Velocity",
            mime: "text/velocity",
            mode: "velocity",
            ext: [
                "vtl"
            ]
        },
        {
            name: "Verilog",
            mime: "text/x-verilog",
            mode: "verilog",
            ext: [
                "v"
            ]
        },
        {
            name: "VHDL",
            mime: "text/x-vhdl",
            mode: "vhdl",
            ext: [
                "vhd",
                "vhdl"
            ]
        },
        {
            name: "Vue.js Component",
            mimes: [
                "script/x-vue",
                "text/x-vue"
            ],
            mode: "vue",
            ext: [
                "vue"
            ]
        },
        {
            name: "XML",
            mimes: [
                "application/xml",
                "text/xml"
            ],
            mode: "xml",
            ext: [
                "xml",
                "xsl",
                "xsd",
                "svg"
            ],
            alias: [
                "rss",
                "wsdl",
                "xsd"
            ]
        },
        {
            name: "XQuery",
            mime: "application/xquery",
            mode: "xquery",
            ext: [
                "xy",
                "xquery"
            ]
        },
        {
            name: "Yacas",
            mime: "text/x-yacas",
            mode: "yacas",
            ext: [
                "ys"
            ]
        },
        {
            name: "YAML",
            mimes: [
                "text/x-yaml",
                "text/yaml"
            ],
            mode: "yaml",
            ext: [
                "yaml",
                "yml"
            ],
            alias: [
                "yml"
            ]
        },
        {
            name: "Z80",
            mime: "text/x-z80",
            mode: "z80",
            ext: [
                "z80"
            ]
        },
        {
            name: "mscgen",
            mime: "text/x-mscgen",
            mode: "mscgen",
            ext: [
                "mscgen",
                "mscin",
                "msc"
            ]
        },
        {
            name: "xu",
            mime: "text/x-xu",
            mode: "mscgen",
            ext: [
                "xu"
            ]
        },
        {
            name: "msgenny",
            mime: "text/x-msgenny",
            mode: "mscgen",
            ext: [
                "msgenny"
            ]
        },
        {
            name: "WebAssembly",
            mime: "text/webassembly",
            mode: "wast",
            ext: [
                "wat",
                "wast"
            ]
        }
    ];
    // Ensure all modes have a mime property for backwards compatibility
    for(var i = 0; i < CodeMirror.modeInfo.length; i++){
        var info = CodeMirror.modeInfo[i];
        if (info.mimes) info.mime = info.mimes[0];
    }
    CodeMirror.findModeByMIME = function(mime) {
        mime = mime.toLowerCase();
        for(var i = 0; i < CodeMirror.modeInfo.length; i++){
            var info = CodeMirror.modeInfo[i];
            if (info.mime == mime) return info;
            if (info.mimes) {
                for(var j = 0; j < info.mimes.length; j++)if (info.mimes[j] == mime) return info;
            }
        }
        if (/\+xml$/.test(mime)) return CodeMirror.findModeByMIME("application/xml");
        if (/\+json$/.test(mime)) return CodeMirror.findModeByMIME("application/json");
    };
    CodeMirror.findModeByExtension = function(ext) {
        ext = ext.toLowerCase();
        for(var i = 0; i < CodeMirror.modeInfo.length; i++){
            var info = CodeMirror.modeInfo[i];
            if (info.ext) {
                for(var j = 0; j < info.ext.length; j++)if (info.ext[j] == ext) return info;
            }
        }
    };
    CodeMirror.findModeByFileName = function(filename) {
        for(var i = 0; i < CodeMirror.modeInfo.length; i++){
            var info = CodeMirror.modeInfo[i];
            if (info.file && info.file.test(filename)) return info;
        }
        var dot = filename.lastIndexOf(".");
        var ext = dot > -1 && filename.substring(dot + 1, filename.length);
        if (ext) return CodeMirror.findModeByExtension(ext);
    };
    CodeMirror.findModeByName = function(name) {
        name = name.toLowerCase();
        for(var i = 0; i < CodeMirror.modeInfo.length; i++){
            var info = CodeMirror.modeInfo[i];
            if (info.name.toLowerCase() == name) return info;
            if (info.alias) {
                for(var j = 0; j < info.alias.length; j++)if (info.alias[j].toLowerCase() == name) return info;
            }
        }
    };
});

});



parcelRegister("jbuSj", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Insert images or files into Editor by pasting (Ctrl+V) or Drag'n'Drop
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    /**
     * send data to url
     *
     * @param method default: "POST"
     */ function ajaxUpload(url, form, callback, method) {
        var xhr = new XMLHttpRequest();
        var formData = new FormData();
        for(var name in form)formData.append(name, form[name]);
        xhr.onreadystatechange = function() {
            if (4 == this.readyState) {
                var ret = xhr.responseText;
                try {
                    ret = JSON.parse(xhr.responseText);
                } catch (err) {}
                if (/^20\d/.test(xhr.status + "")) callback(ret, null);
                else callback(null, ret);
            }
        };
        xhr.open(method || 'POST', url, true);
        // xhr.setRequestHeader("Content-Type", "multipart/form-data");
        xhr.send(formData);
    }
    exports1.ajaxUpload = ajaxUpload;
    exports1.defaultOption = {
        byDrop: false,
        byPaste: false,
        fileHandler: null
    };
    exports1.suggestedOption = {
        byPaste: true,
        byDrop: true
    };
    core_1.suggestedEditorConfig.hmdInsertFile = exports1.suggestedOption;
    CodeMirror.defineOption("hmdInsertFile", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") {
            var enabled = !!newVal;
            newVal = {
                byDrop: enabled,
                byPaste: enabled
            };
        } else if (typeof newVal === 'function') newVal = {
            byDrop: true,
            byPaste: true,
            fileHandler: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var InsertFile = /** @class */ function() {
        function InsertFile(cm) {
            // options will be initialized to defaultOption when constructor is finished
            var _this = this;
            this.cm = cm;
            this.pasteHandle = function(cm, ev) {
                if (!_this.doInsert(ev.clipboardData || window['clipboardData'], true)) return;
                ev.preventDefault();
            };
            this.dropHandle = function(cm, ev) {
                var self = _this, cm = _this.cm, result = false;
                cm.operation(function() {
                    var pos = cm.coordsChar({
                        left: ev.clientX,
                        top: ev.clientY
                    }, "window");
                    cm.setCursor(pos);
                    result = self.doInsert(ev.dataTransfer, false);
                });
                if (!result) return;
                ev.preventDefault();
            };
            new core_1.FlipFlop(/* ON  */ function() {
                return _this.cm.on("paste", _this.pasteHandle);
            }, /* OFF */ function() {
                return _this.cm.off("paste", _this.pasteHandle);
            }).bind(this, "byPaste", true);
            new core_1.FlipFlop(/* ON  */ function() {
                return _this.cm.on("drop", _this.dropHandle);
            }, /* OFF */ function() {
                return _this.cm.off("drop", _this.dropHandle);
            }).bind(this, "byDrop", true);
        }
        /**
         * upload files to the current cursor.
         *
         * @param {DataTransfer} data
         * @returns {boolean} data is accepted or not
         */ InsertFile.prototype.doInsert = function(data, isClipboard) {
            var cm = this.cm;
            if (isClipboard && data.types && data.types.some(function(type) {
                return type.slice(0, 5) === 'text/';
            })) return false;
            if (!data || !data.files || 0 === data.files.length) return false;
            var files = data.files;
            var fileHandler = this.fileHandler;
            var handled = false;
            if (typeof fileHandler !== 'function') return false;
            cm.operation(function() {
                // create a placeholder
                cm.replaceSelection(".");
                var posTo = cm.getCursor();
                var posFrom = {
                    line: posTo.line,
                    ch: posTo.ch - 1
                };
                var placeholderContainer = document.createElement("span");
                var marker = cm.markText(posFrom, posTo, {
                    replacedWith: placeholderContainer,
                    clearOnEnter: false,
                    handleMouseEvents: false
                });
                var action = {
                    marker: marker,
                    cm: cm,
                    finish: function(text, cursor) {
                        return cm.operation(function() {
                            var range = marker.find();
                            var posFrom = range.from, posTo = range.to;
                            cm.replaceRange(text, posFrom, posTo);
                            marker.clear();
                            if (typeof cursor === 'number') cm.setCursor({
                                line: posFrom.line,
                                ch: posFrom.ch + cursor
                            });
                        });
                    },
                    setPlaceholder: function(el) {
                        if (placeholderContainer.childNodes.length > 0) placeholderContainer.removeChild(placeholderContainer.firstChild);
                        placeholderContainer.appendChild(el);
                        marker.changed();
                    },
                    resize: function() {
                        marker.changed();
                    }
                };
                handled = fileHandler(files, action);
                if (!handled) marker.clear();
            });
            return handled;
        };
        return InsertFile;
    }();
    exports1.InsertFile = InsertFile;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one InsertFile instance */ exports1.getAddon = core_1.Addon.Getter("InsertFile", InsertFile, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("1UVd0", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fetch footnote content, Resolve relative URLs
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    /**
     * Normalize a (potentially-with-title) URL string
     *
     * @param content eg. `http://laobubu.net/page "The Page"` or just a URL
     */ function splitLink(content) {
        // remove title part (if exists)
        content = content.trim();
        var url = content, title = "";
        var mat = content.match(/^(\S+)\s+("(?:[^"\\]+|\\.)+"|[^"\s].*)/);
        if (mat) {
            url = mat[1];
            title = mat[2];
            if (title.charAt(0) === '"') title = title.substr(1, title.length - 2).replace(/\\"/g, '"');
        }
        return {
            url: url,
            title: title
        };
    }
    exports1.splitLink = splitLink;
    /********************************************************************************** */ //#region CodeMirror Extension
    // add methods to all CodeMirror editors
    // every codemirror editor will have these member methods:
    exports1.Extensions = {
        /**
         * Try to find a footnote and return its lineNo, content.
         *
         * NOTE: You will need `hmdSplitLink` and `hmdResolveURL` if you want to get a URL
         *
         * @param footNoteName without square brackets, case-insensive
         * @param line since which line
         */ hmdReadLink: function(footNoteName, line) {
            return exports1.getAddon(this).read(footNoteName, line);
        },
        /**
         * Check if URL is relative URL, and add baseURI if needed; or if it's a email address, add "mailto:"
         *
         * @see ReadLink.resolve
         */ hmdResolveURL: function(url, baseURI) {
            return exports1.getAddon(this).resolve(url, baseURI);
        },
        hmdSplitLink: splitLink
    };
    for(var name in exports1.Extensions)CodeMirror.defineExtension(name, exports1.Extensions[name]);
    exports1.defaultOption = {
        baseURI: ""
    };
    exports1.suggestedOption = {
        baseURI: ""
    };
    core_1.suggestedEditorConfig.hmdReadLink = exports1.suggestedOption;
    CodeMirror.defineOption("hmdReadLink", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "string") newVal = {
            baseURI: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var ReadLink = /** @class */ function() {
        function ReadLink(cm) {
            var _this = this;
            this.cm = cm;
            this.cache = {};
            cm.on("changes", core_1.debounce(function() {
                return _this.rescan();
            }, 500));
            this.rescan();
        }
        /**
         * get link footnote content like
         *
         * ```markdown
         *  [icon]: http://laobubu.net/icon.png
         * ```
         *
         * @param footNoteName case-insensive name, without "[" or "]"
         * @param line         current line. if not set, the first definition will be returned
         */ ReadLink.prototype.read = function(footNoteName, line) {
            var defs = this.cache[footNoteName.trim().toLowerCase()] || [];
            var def;
            if (typeof line !== "number") line = 1e9;
            for(var i = 0; i < defs.length; i++){
                def = defs[i];
                if (def.line > line) break;
            }
            return def;
        };
        /**
         * Scan content and rebuild the cache
         */ ReadLink.prototype.rescan = function() {
            var cm = this.cm;
            var cache = this.cache = {};
            cm.eachLine(function(line) {
                var txt = line.text, mat = /^(?:>\s+)*>?\s{0,3}\[([^\]]+)\]:\s*(.+)$/.exec(txt);
                if (mat) {
                    var key = mat[1].trim().toLowerCase(), content = mat[2];
                    if (!cache[key]) cache[key] = [];
                    cache[key].push({
                        line: line.lineNo(),
                        content: content
                    });
                }
            });
        };
        /**
         * Check if URL is relative URL, and add baseURI if needed
         *
         * @example
         *
         *     resolve("<email address>") // => "mailto:xxxxxxx"
         *     resolve("../world.png") // => (depends on your editor configuration)
         *     resolve("../world.png", "http://laobubu.net/xxx/foo/") // => "http://laobubu.net/xxx/world.png"
         *     resolve("../world.png", "http://laobubu.net/xxx/foo") // => "http://laobubu.net/xxx/world.png"
         *     resolve("/world.png", "http://laobubu.net/xxx/foo/") // => "http://laobubu.net/world.png"
         */ ReadLink.prototype.resolve = function(uri, baseURI) {
            var emailRE = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            var hostExtract = /^(?:[\w-]+\:\/*|\/\/)[^\/]+/;
            var levelupRE = /\/[^\/]+(?:\/+\.?)*$/;
            if (!uri) return uri;
            if (emailRE.test(uri)) return "mailto:" + uri;
            var tmp;
            var host = "";
            baseURI = baseURI || this.baseURI;
            // not configured, or is already URI with scheme
            if (!baseURI || hostExtract.test(uri)) return uri;
            // try to extract scheme+host like http://laobubu.net without tailing slash
            if (tmp = baseURI.match(hostExtract)) {
                host = tmp[0];
                baseURI = baseURI.slice(host.length);
            }
            while(tmp = uri.match(/^(\.{1,2})([\/\\]+)/)){
                uri = uri.slice(tmp[0].length);
                if (tmp[1] == "..") baseURI = baseURI.replace(levelupRE, "");
            }
            if (uri.charAt(0) === '/' && host) uri = host + uri;
            else {
                if (!/\/$/.test(baseURI)) baseURI += "/";
                uri = host + baseURI + uri;
            }
            return uri;
        };
        return ReadLink;
    }();
    exports1.ReadLink = ReadLink;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one ReadLink instance */ exports1.getAddon = core_1.Addon.Getter("ReadLink", ReadLink, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("eRlC8", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: When mouse hovers on a link or footnote ref, shows related footnote
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("1UVd0")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var markdownToHTML = typeof marked === 'function' ? marked : function(text) {
        text = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/  /g, ' &nbsp;');
        return "<pre>" + text + "</pre>";
    };
    /** if `marked` exists, use it; else, return safe html */ function defaultConvertor(footnote, text) {
        if (!text) return null;
        return markdownToHTML(text);
    }
    exports1.defaultConvertor = defaultConvertor;
    exports1.defaultOption = {
        enabled: false,
        xOffset: 10,
        convertor: defaultConvertor
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdHover = exports1.suggestedOption;
    CodeMirror.defineOption("hmdHover", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            enabled: !!newVal
        };
        else if (typeof newVal === "function") newVal = {
            enabled: true,
            convertor: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var Hover = /** @class */ function() {
        function Hover(cm) {
            // options will be initialized to defaultOption when constructor is finished
            var _this = this;
            this.cm = cm;
            new core_1.FlipFlop(/* ON  */ function() {
                lineDiv.addEventListener("mouseenter", evhandler, true);
            }, /* OFF */ function() {
                lineDiv.removeEventListener("mouseenter", evhandler, true);
                _this.hideInfo();
            }).bind(this, "enabled", true);
            var lineDiv = cm.display.lineDiv;
            this.lineDiv = lineDiv;
            var tooltip = document.createElement("div"), tooltipContent = document.createElement("div"), tooltipIndicator = document.createElement("div");
            tooltip.setAttribute("style", "position:absolute;z-index:99");
            tooltip.setAttribute("class", "HyperMD-hover");
            tooltip.setAttribute("cm-ignore-events", "true");
            tooltipContent.setAttribute("class", "HyperMD-hover-content");
            tooltip.appendChild(tooltipContent);
            tooltipIndicator.setAttribute("class", "HyperMD-hover-indicator");
            tooltip.appendChild(tooltipIndicator);
            this.tooltipDiv = tooltip;
            this.tooltipContentDiv = tooltipContent;
            this.tooltipIndicator = tooltipIndicator;
            var evhandler = this.mouseenter.bind(this);
        }
        Hover.prototype.mouseenter = function(ev) {
            var cm = this.cm, target = ev.target;
            var className = target.className;
            if (target == this.tooltipDiv || target.compareDocumentPosition && (target.compareDocumentPosition(this.tooltipDiv) & 8) == 8) return;
            var mat;
            if (target.nodeName !== "SPAN" || !(mat = className.match(/(?:^|\s)cm-(hmd-barelink2?|hmd-footref2)(?:\s|$)/))) {
                this.hideInfo();
                return;
            }
            var pos = cm.coordsChar({
                left: ev.clientX,
                top: ev.clientY
            }, "window");
            var footnoteName = null;
            var footnote = null;
            var hover_type = mat[1]; // hmd-barelink|hmd-link-url-s
            var range = core_1.expandRange(cm, pos, hover_type);
            if (range) {
                footnoteName = cm.getRange(range.from, range.to);
                footnoteName = footnoteName.slice(1, -1);
                if (footnoteName) footnote = cm.hmdReadLink(footnoteName, pos.line) || null;
            }
            var convertor = this.convertor || defaultConvertor;
            var html = convertor(footnoteName, footnote && footnote.content || null);
            if (!html) {
                this.hideInfo();
                return;
            }
            this.showInfo(html, target);
        };
        Hover.prototype.showInfo = function(html, relatedTo) {
            var b1 = relatedTo.getBoundingClientRect();
            var b2 = this.lineDiv.getBoundingClientRect();
            var tdiv = this.tooltipDiv;
            var xOffset = this.xOffset;
            this.tooltipContentDiv.innerHTML = html;
            tdiv.style.left = b1.left - b2.left - xOffset + 'px';
            this.lineDiv.appendChild(tdiv);
            var b3 = tdiv.getBoundingClientRect();
            if (b3.right > b2.right) {
                xOffset = b3.right - b2.right;
                tdiv.style.left = b1.left - b2.left - xOffset + 'px';
            }
            tdiv.style.top = b1.top - b2.top - b3.height + 'px';
            this.tooltipIndicator.style.marginLeft = xOffset + 'px';
        };
        Hover.prototype.hideInfo = function() {
            if (this.tooltipDiv.parentElement == this.lineDiv) this.lineDiv.removeChild(this.tooltipDiv);
        };
        return Hover;
    }();
    exports1.Hover = Hover;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one Hover instance */ exports1.getAddon = core_1.Addon.Getter("Hover", Hover, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("cxGyy", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Click to open links / jump to footnotes / toggle TODOs, and more.
//
// With custom ClickHandler supported
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("1UVd0")));
})(function(require1, exports1, CodeMirror, core_1, read_link_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    //#endregion
    /********************************************************************************** */ //#region defaultClickHandler
    exports1.defaultClickHandler = function(info, cm) {
        var text = info.text, type = info.type, url = info.url, pos = info.pos;
        if (type === 'url' || type === 'link') {
            var footnoteRef = text.match(/\[[^\[\]]+\](?:\[\])?$/); // bare link, footref or [foot][] . assume no escaping char inside
            if (footnoteRef && info.altKey) {
                // extract footnote part (with square brackets), then jump to the footnote
                text = footnoteRef[0];
                if (text.slice(-2) === '[]') text = text.slice(0, -2); // remove [] of [foot][]
                type = "footref";
            } else if ((info.ctrlKey || info.altKey) && url) // just open URL
            window.open(url, "_blank");
        }
        if (type === 'todo') {
            var _a = core_1.expandRange(cm, pos, "formatting-task"), from = _a.from, to = _a.to;
            var text_1 = cm.getRange(from, to);
            text_1 = text_1 === '[ ]' ? '[x]' : '[ ]';
            cm.replaceRange(text_1, from, to);
        }
        if (type === 'footref' && (info.ctrlKey || info.altKey)) {
            // Jump to FootNote
            var footnote_name = text.slice(1, -1);
            var footnote = cm.hmdReadLink(footnote_name, pos.line);
            if (footnote) {
                makeBackButton(cm, footnote.line, pos);
                cm.setCursor({
                    line: footnote.line,
                    ch: 0
                });
            }
        }
    };
    /**
     * Display a "go back" button. Requires "HyperMD-goback" gutter set.
     *
     * maybe not useful?
     *
     * @param line where to place the button
     * @param anchor when user click the back button, jumps to here
     */ var makeBackButton = function() {
        var bookmark = null;
        function updateBookmark(cm, pos) {
            if (bookmark) {
                cm.clearGutter("HyperMD-goback");
                bookmark.clear();
            }
            bookmark = cm.setBookmark(pos);
        }
        /**
         * Make a button, bind event handlers, but not insert the button
         */ function makeButton(cm) {
            var hasBackButton = cm.options.gutters.indexOf("HyperMD-goback") != -1;
            if (!hasBackButton) return null;
            var backButton = document.createElement("div");
            backButton.className = "HyperMD-goback-button";
            backButton.addEventListener("click", function() {
                cm.setCursor(bookmark.find());
                cm.clearGutter("HyperMD-goback");
                bookmark.clear();
                bookmark = null;
            });
            var _tmp1 = cm.display.gutters.children;
            _tmp1 = _tmp1[_tmp1.length - 1];
            _tmp1 = _tmp1.offsetLeft + _tmp1.offsetWidth;
            backButton.style.width = _tmp1 + "px";
            backButton.style.marginLeft = -_tmp1 + "px";
            return backButton;
        }
        return function(cm, line, anchor) {
            var backButton = makeButton(cm);
            if (!backButton) return;
            backButton.innerHTML = anchor.line + 1 + "";
            updateBookmark(cm, anchor);
            cm.setGutterMarker(line, "HyperMD-goback", backButton);
        };
    }();
    exports1.defaultOption = {
        enabled: false,
        handler: null
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdClick = exports1.suggestedOption;
    CodeMirror.defineOption("hmdClick", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            enabled: !!newVal
        };
        else if (typeof newVal === "function") newVal = {
            enabled: true,
            handler: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var Click = /** @class */ function() {
        function Click(cm) {
            var _this = this;
            this.cm = cm;
            /** remove modifier className to editor DOM */ this._mouseMove_keyDetect = function(ev) {
                var el = _this.el;
                var className = el.className, newClassName = className;
                var altClass = "HyperMD-with-alt";
                var ctrlClass = "HyperMD-with-ctrl";
                if (!ev.altKey && className.indexOf(altClass) >= 0) newClassName = className.replace(altClass, "");
                if (!ev.ctrlKey && className.indexOf(ctrlClass) >= 0) newClassName = className.replace(ctrlClass, "");
                if (!ev.altKey && !ev.ctrlKey) {
                    _this._KeyDetectorActive = false;
                    el.removeEventListener('mousemove', _this._mouseMove_keyDetect, false);
                }
                if (className != newClassName) el.className = newClassName.trim();
            };
            /** add modifier className to editor DOM */ this._keyDown = function(ev) {
                var kc = ev.keyCode || ev.which;
                var className = "";
                if (kc == 17) className = "HyperMD-with-ctrl";
                if (kc == 18) className = "HyperMD-with-alt";
                var el = _this.el;
                if (className && el.className.indexOf(className) == -1) el.className += " " + className;
                if (!_this._KeyDetectorActive) {
                    _this._KeyDetectorActive = true;
                    _this.el.addEventListener('mousemove', _this._mouseMove_keyDetect, false);
                }
            };
            /**
             * Unbind _mouseUp, then call ClickHandler if mouse not bounce
             */ this._mouseUp = function(ev) {
                var cinfo = _this._cinfo;
                _this.lineDiv.removeEventListener("mouseup", _this._mouseUp, false);
                if (Math.abs(ev.clientX - cinfo.clientX) > 5 || Math.abs(ev.clientY - cinfo.clientY) > 5) return;
                if (typeof _this.handler === 'function' && _this.handler(cinfo, _this.cm) === false) return;
                exports1.defaultClickHandler(cinfo, _this.cm);
            };
            /**
             * Try to construct ClickInfo and bind _mouseUp
             */ this._mouseDown = function(ev) {
                var button = ev.button, clientX = ev.clientX, clientY = ev.clientY, ctrlKey = ev.ctrlKey, altKey = ev.altKey, shiftKey = ev.shiftKey;
                var cm = _this.cm;
                if (ev.target.tagName === "PRE") return;
                var pos = cm.coordsChar({
                    left: clientX,
                    top: clientY
                }, "window");
                var range;
                var token = cm.getTokenAt(pos);
                var state = token.state;
                var styles = " " + token.type + " ";
                var mat;
                var type = null;
                var text, url;
                if (mat = styles.match(/\s(image|link|url)\s/)) {
                    // Could be a image, link, bare-link, footref, footnote, plain url, plain url w/o angle brackets
                    type = mat[1];
                    var isBareLink = /\shmd-barelink\s/.test(styles);
                    if (state.linkText) {
                        // click on content of a link text.
                        range = core_1.expandRange(cm, pos, function(token) {
                            return token.state.linkText || /(?:\s|^)link(?:\s|$)/.test(token.type);
                        });
                        type = "link";
                    } else range = core_1.expandRange(cm, pos, type);
                    if (/^(?:image|link)$/.test(type) && !isBareLink) {
                        // CodeMirror breaks [text] and (url)
                        // Let HyperMD mode handle it!
                        var tmp_range = core_1.expandRange(cm, {
                            line: pos.line,
                            ch: range.to.ch + 1
                        }, "url");
                        if (tmp_range) range.to = tmp_range.to;
                    }
                    text = cm.getRange(range.from, range.to).trim();
                    // now extract the URL. boring job
                    var tmp = void 0;
                    if (text.slice(-1) === ')' && (tmp = text.lastIndexOf('](')) !== -1 // xxxx](url)     image / link without ref
                    ) // remove title part (if exists)
                    url = read_link_1.splitLink(text.slice(tmp + 2, -1)).url;
                    else if ((mat = text.match(/[^\\]\]\s?\[([^\]]+)\]$/)) || // .][ref]     image / link with ref
                    (mat = text.match(/^\[(.+)\]\s?\[\]$/)) || // [ref][]
                    (mat = text.match(/^\[(.+)\](?:\:\s*)?$/) // [barelink] or [^ref] or [footnote]:
                    )) {
                        if (isBareLink && mat[1].charAt(0) === '^') type = 'footref';
                        var t2 = cm.hmdReadLink(mat[1], pos.line);
                        if (!t2) url = null;
                        else // remove title part (if exists)
                        url = read_link_1.splitLink(t2.content).url;
                    } else {
                        (mat = text.match(/^\<(.+)\>$/)) || // <http://laobubu.net>
                        (mat = text.match(/^\((.+)\)$/)) || // (http://laobubu.net)
                        (mat = [
                            null,
                            text
                        ] // http://laobubu.net    last possibility: plain url w/o < >
                        );
                        url = mat[1];
                    }
                    url = cm.hmdResolveURL(url);
                } else if (styles.match(/\sformatting-task\s/)) {
                    // TO-DO checkbox
                    type = "todo";
                    range = core_1.expandRange(cm, pos, "formatting-task");
                    range.to.ch = cm.getLine(pos.line).length;
                    text = cm.getRange(range.from, range.to);
                    url = null;
                } else if (styles.match(/\shashtag/)) {
                    type = "hashtag";
                    range = core_1.expandRange(cm, pos, "hashtag");
                    text = cm.getRange(range.from, range.to);
                    url = null;
                }
                if (type !== null) {
                    _this._cinfo = {
                        type: type,
                        text: text,
                        url: url,
                        pos: pos,
                        button: button,
                        clientX: clientX,
                        clientY: clientY,
                        ctrlKey: ctrlKey,
                        altKey: altKey,
                        shiftKey: shiftKey
                    };
                    _this.lineDiv.addEventListener('mouseup', _this._mouseUp, false);
                }
            };
            this.lineDiv = cm.display.lineDiv;
            var el = this.el = cm.getWrapperElement();
            new core_1.FlipFlop(/* ON  */ function() {
                _this.lineDiv.addEventListener("mousedown", _this._mouseDown, false);
                el.addEventListener("keydown", _this._keyDown, false);
            }, /* OFF */ function() {
                _this.lineDiv.removeEventListener("mousedown", _this._mouseDown, false);
                el.removeEventListener("keydown", _this._keyDown, false);
            }).bind(this, "enabled", true);
        }
        return Click;
    }();
    exports1.Click = Click;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one Click instance */ exports1.getAddon = core_1.Addon.Getter("Click", Click, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("1Oo9g", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Convert content to Markdown before pasting
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.defaultOption = {
        enabled: false,
        convertor: null
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdPaste = exports1.suggestedOption;
    CodeMirror.defineOption("hmdPaste", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            enabled: !!newVal
        };
        else if (typeof newVal === "function") newVal = {
            enabled: true,
            convertor: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var Paste = /** @class */ function() {
        function Paste(cm) {
            var _this = this;
            this.cm = cm;
            this.pasteHandler = function(cm, ev) {
                var cd = ev.clipboardData || window['clipboardData'];
                var convertor = _this.convertor;
                if (!convertor || !cd || cd.types.indexOf('text/html') == -1) return;
                var result = convertor(cd.getData('text/html'));
                if (!result) return;
                cm.operation(cm.replaceSelection.bind(cm, result));
                ev.preventDefault();
            };
            new core_1.FlipFlop(/* ON  */ function() {
                cm.on('paste', _this.pasteHandler);
            }, /* OFF */ function() {
                cm.off('paste', _this.pasteHandler);
            }).bind(this, "enabled", true);
        }
        return Paste;
    }();
    exports1.Paste = Paste;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one Paste instance */ exports1.getAddon = core_1.Addon.Getter("Paste", Paste, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("j53Ua", function(module, exports) {
// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Turn Markdown markers into real images, link icons etc. Support custom folders.
//
// You may set `hmdFold.customFolders` option to fold more, where `customFolders` is Array<FolderFunc>
//
var $de41836541cae333$var$__extends = module.exports && module.exports.__extends || function() {
    var extendStatics = Object.setPrototypeOf || ({
        __proto__: []
    }) instanceof Array && function(d, b) {
        d.__proto__ = b;
    } || function(d, b) {
        for(var p in b)if (b.hasOwnProperty(p)) d[p] = b[p];
    };
    return function(d, b) {
        extendStatics(d, b);
        function __() {
            this.constructor = d;
        }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
}();



(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1, cm_utils_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var DEBUG = false;
    var FlagArray = typeof Uint8Array === 'undefined' ? Array : Uint8Array;
    var RequestRangeResult;
    (function(RequestRangeResult) {
        // Use string values because in TypeScript, string enum members do not get a reverse mapping generated at all.
        // Otherwise the generated code looks ugly
        RequestRangeResult["OK"] = "ok";
        RequestRangeResult["CURSOR_INSIDE"] = "ci";
        RequestRangeResult["HAS_MARKERS"] = "hm";
    })(RequestRangeResult = exports1.RequestRangeResult || (exports1.RequestRangeResult = {}));
    //#endregion
    /********************************************************************************** */ //#region FolderFunc Registry
    exports1.folderRegistry = {};
    /**
     * Add a Folder to the System Folder Registry
     *
     * @param name eg. "math"  "html"  "image"  "link"
     * @param folder
     * @param suggested enable this folder in suggestedEditorConfig
     * @param force if a folder with same name is already exists, overwrite it. (dangerous)
     */ function registerFolder(name, folder, suggested, force) {
        var registry = exports1.folderRegistry;
        if (name in registry && !force) throw new Error("Folder " + name + " already registered");
        exports1.defaultOption[name] = false;
        exports1.suggestedOption[name] = !!suggested;
        registry[name] = folder;
    }
    exports1.registerFolder = registerFolder;
    //#endregion
    /********************************************************************************** */ //#region Utils
    /** break a TextMarker, move cursor to where marker is */ function breakMark(cm, marker, chOffset) {
        cm.operation(function() {
            var pos = marker.find().from;
            pos = {
                line: pos.line,
                ch: pos.ch + ~~chOffset
            };
            cm.setCursor(pos);
            cm.focus();
            marker.clear();
        });
    }
    exports1.breakMark = breakMark;
    exports1.defaultOption = {
    };
    exports1.suggestedOption = {
    };
    core_1.suggestedEditorConfig.hmdFold = exports1.suggestedOption;
    core_1.normalVisualConfig.hmdFold = false;
    CodeMirror.defineOption("hmdFold", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Record<string, boolean>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = newVal ? exports1.suggestedOption : exports1.defaultOption;
        if ('customFolders' in newVal) {
            console.error('[HyperMD][Fold] `customFolders` is removed. To use custom folders, `registerFolder` first.');
            delete newVal['customFolders'];
        }
        ///// apply config
        var inst = exports1.getAddon(cm);
        for(var type in exports1.folderRegistry)inst.setStatus(type, newVal[type]);
    // then, folding task will be queued by setStatus()
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var Fold = /** @class */ function(_super) {
        $de41836541cae333$var$__extends(Fold, _super);
        function Fold(cm) {
            var _this = _super.call(this, cm) || this;
            _this.cm = cm;
            /**
             * stores Folder status for current editor
             * @private To enable/disable folders, use `setStatus()`
             */ _this._enabled = {};
            /** Folder's output goes here */ _this.folded = {};
            /// END OF APIS THAT EXPOSED TO FolderFunc
            ///////////////////////////////////////////////////////////////////////////////////////////
            /**
             * Fold everything! (This is a debounced, and `this`-binded version)
             */ _this.startFold = core_1.debounce(_this.startFoldImmediately.bind(_this), 100);
            /** stores every affected lineNo */ _this._quickFoldHint = [];
            cm.on("changes", function(cm, changes) {
                var changedMarkers = [];
                for(var _i = 0, changes_1 = changes; _i < changes_1.length; _i++){
                    var change = changes_1[_i];
                    var markers = cm.findMarks(change.from, change.to);
                    for(var _a = 0, markers_1 = markers; _a < markers_1.length; _a++){
                        var marker = markers_1[_a];
                        if (marker._hmd_fold_type) changedMarkers.push(marker);
                    }
                }
                for(var _b = 0, changedMarkers_1 = changedMarkers; _b < changedMarkers_1.length; _b++){
                    var m = changedMarkers_1[_b];
                    m.clear(); // TODO: add "changed" handler for FolderFunc
                }
                _this.startFold();
            });
            cm.on("cursorActivity", function(cm) {
                if (DEBUG) console.time('CA');
                var lineStuff = {};
                function addPosition(pos) {
                    var lineNo = pos.line;
                    if (!(lineNo in lineStuff)) {
                        var lh = cm.getLineHandle(pos.line);
                        var ms = lh.markedSpans || [];
                        var markers = [];
                        for(var i = 0; i < ms.length; i++){
                            var marker = ms[i].marker;
                            if ('_hmd_crange' in marker) {
                                var from = marker._hmd_crange[0].line < lineNo ? 0 : marker._hmd_crange[0].ch;
                                var to = marker._hmd_crange[1].line > lineNo ? lh.text.length : marker._hmd_crange[1].ch;
                                markers.push([
                                    marker,
                                    from,
                                    to
                                ]);
                            }
                        }
                        lineStuff[lineNo] = {
                            lineNo: lineNo,
                            ch: [
                                pos.ch
                            ],
                            markers: markers
                        };
                    } else lineStuff[lineNo].ch.push(pos.ch);
                }
                cm.listSelections().forEach(function(selection) {
                    addPosition(selection.anchor);
                    addPosition(selection.head);
                });
                for(var tmp_id in lineStuff){
                    var lineData = lineStuff[tmp_id];
                    if (!lineData.markers.length) continue;
                    for(var i = 0; i < lineData.ch.length; i++){
                        var ch = lineData.ch[i];
                        for(var j = 0; j < lineData.markers.length; j++){
                            var _a = lineData.markers[j], marker = _a[0], from = _a[1], to = _a[2];
                            if (from <= ch && ch <= to) {
                                marker.clear();
                                lineData.markers.splice(j, 1);
                                j--;
                            }
                        }
                    }
                }
                if (DEBUG) console.timeEnd('CA');
                _this.startQuickFold();
            });
            return _this;
        }
        /** enable/disable one kind of folder, in current editor */ Fold.prototype.setStatus = function(type, enabled) {
            if (!(type in exports1.folderRegistry)) return;
            if (!this._enabled[type] !== !enabled) {
                this._enabled[type] = !!enabled;
                if (enabled) this.startFold();
                else this.clear(type);
            }
        };
        ///////////////////////////////////////////////////////////////////////////////////////////
        /// BEGIN OF APIS THAT EXPOSED TO FolderFunc
        /// @see FoldStream
        /**
         * Check if a range is foldable and update _quickFoldHint
         *
         * NOTE: this function is always called after `_quickFoldHint` reset by `startFoldImmediately`
         */ Fold.prototype.requestRange = function(from, to, cfrom, cto) {
            if (!cto) cto = to;
            if (!cfrom) cfrom = from;
            var cm = this.cm;
            var markers = cm.findMarks(from, to);
            if (markers.length !== 0) return RequestRangeResult.HAS_MARKERS;
            this._quickFoldHint.push(from.line);
            // store "crange" for the coming marker
            this._lastCRange = [
                cfrom,
                cto
            ];
            var selections = cm.listSelections();
            for(var i = 0; i < selections.length; i++){
                var oselection = cm_utils_1.orderedRange(selections[i]);
                // note that "crange" can be bigger or smaller than marked-text range.
                if (cm_utils_1.rangesIntersect(this._lastCRange, oselection) || cm_utils_1.rangesIntersect([
                    from,
                    to
                ], oselection)) return RequestRangeResult.CURSOR_INSIDE;
            }
            this._quickFoldHint.push(cfrom.line);
            return RequestRangeResult.OK;
        };
        /**
         * Fold everything!
         *
         * @param toLine last line to fold. Inclusive
         */ Fold.prototype.startFoldImmediately = function(fromLine, toLine) {
            var _this = this;
            var cm = this.cm;
            fromLine = fromLine || cm.firstLine();
            toLine = (toLine || cm.lastLine()) + 1;
            this._quickFoldHint = [];
            this.setPos(fromLine, 0, true);
            if (DEBUG) console.log("start fold! ", fromLine, toLine);
            cm.operation(function() {
                return cm.eachLine(fromLine, toLine, function(line) {
                    var lineNo = line.lineNo();
                    if (lineNo < _this.lineNo) return; // skip current line...
                    else if (lineNo > _this.lineNo) _this.setPos(lineNo, 0); // hmmm... maybe last one is empty line
                    // all the not-foldable chars are marked
                    var charMarked = new FlagArray(line.text.length);
                    // populate charMarked array.
                    // @see CodeMirror's findMarksAt
                    var lineMarkers = line.markedSpans;
                    if (lineMarkers) for(var i = 0; i < lineMarkers.length; ++i){
                        var span = lineMarkers[i];
                        var spanFrom = span.from == null ? 0 : span.from;
                        var spanTo = span.to == null ? charMarked.length : span.to;
                        for(var j = spanFrom; j < spanTo; j++)charMarked[j] = 1;
                    }
                    var tokens = _this.lineTokens;
                    while(_this.i_token < tokens.length){
                        var token = tokens[_this.i_token];
                        var type;
                        var marker = null;
                        var tokenFoldable = true;
                        for(var i = token.start; i < token.end; i++)if (charMarked[i]) {
                            tokenFoldable = false;
                            break;
                        }
                        if (tokenFoldable) // try all enabled folders in registry
                        for(type in exports1.folderRegistry){
                            if (!_this._enabled[type]) continue;
                            if (marker = exports1.folderRegistry[type](_this, token)) break;
                        }
                        if (!marker) // this token not folded. check next
                        _this.i_token++;
                        else {
                            var _a = marker.find(), from = _a.from, to = _a.to;
                            (_this.folded[type] || (_this.folded[type] = [])).push(marker);
                            marker._hmd_fold_type = type;
                            marker._hmd_crange = _this._lastCRange;
                            marker.on('clear', function(from, to) {
                                var markers = _this.folded[type];
                                var idx;
                                if (markers && (idx = markers.indexOf(marker)) !== -1) markers.splice(idx, 1);
                                _this._quickFoldHint.push(from.line);
                            });
                            if (DEBUG) console.log("[FOLD] New marker ", type, from, to, marker);
                            // now let's update the pointer position
                            if (from.line > lineNo || from.ch > token.start) {
                                // there are some not-marked chars after current token, before the new marker
                                // first, advance the pointer
                                _this.i_token++;
                                // then mark the hidden chars as "marked"
                                var fromCh = from.line === lineNo ? from.ch : charMarked.length;
                                var toCh = to.line === lineNo ? to.ch : charMarked.length;
                                for(var i = fromCh; i < toCh; i++)charMarked[i] = 1;
                            } else // classical situation
                            // new marker starts since current token
                            if (to.line !== lineNo) {
                                _this.setPos(to.line, to.ch);
                                return; // nothing left in this line
                            } else _this.setPos(to.ch); // i_token will be updated by this.setPos()
                        }
                    }
                });
            });
        };
        /**
         * Start a quick fold: only process recent `requestRange`-failed ranges
         */ Fold.prototype.startQuickFold = function() {
            var hint = this._quickFoldHint;
            if (hint.length === 0) return;
            var from = hint[0], to = from;
            for(var _i = 0, hint_1 = hint; _i < hint_1.length; _i++){
                var lineNo = hint_1[_i];
                if (from > lineNo) from = lineNo;
                if (to < lineNo) to = lineNo;
            }
            this.startFold.stop();
            this.startFoldImmediately(from, to);
        };
        /**
         * Clear one type of folded TextMarkers
         *
         * @param type builtin folder type ("image", "link" etc) or custom fold type
         */ Fold.prototype.clear = function(type) {
            this.startFold.stop();
            var folded = this.folded[type];
            if (!folded || !folded.length) return;
            var marker;
            while(marker = folded.pop())marker.clear();
        };
        /**
         * Clear all folding result
         */ Fold.prototype.clearAll = function() {
            this.startFold.stop();
            for(var type in this.folded){
                var folded = this.folded[type];
                var marker;
                while(marker = folded.pop())marker.clear();
            }
        };
        return Fold;
    }(core_1.TokenSeeker);
    exports1.Fold = Fold;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one Fold instance */ exports1.getAddon = core_1.Addon.Getter("Fold", Fold);
});

});

parcelRegister("flGpM", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold Image Markers `![](xxx)`
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("j53Ua")), (parcelRequire("1UVd0")));
})(function(require1, exports1, fold_1, read_link_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var DEBUG = false;
    exports1.ImageFolder = function(stream, token) {
        var cm = stream.cm;
        var imgRE = /\bimage-marker\b/;
        var urlRE = /\bformatting-link-string\b/; // matches the parentheses
        if (imgRE.test(token.type) && token.string === "!") {
            var lineNo = stream.lineNo;
            // find the begin and end of url part
            var url_begin = stream.findNext(urlRE);
            var url_end = stream.findNext(urlRE, url_begin.i_token + 1);
            var from = {
                line: lineNo,
                ch: token.start
            };
            var to = {
                line: lineNo,
                ch: url_end.token.end
            };
            var rngReq = stream.requestRange(from, to, from, from);
            if (rngReq === fold_1.RequestRangeResult.OK) {
                var url;
                var title;
                var rawurl = cm.getRange({
                    line: lineNo,
                    ch: url_begin.token.start + 1
                }, {
                    line: lineNo,
                    ch: url_end.token.start
                });
                if (url_end.token.string === "]") {
                    var tmp = cm.hmdReadLink(rawurl, lineNo);
                    if (!tmp) return null; // Yup! bad URL?!
                    rawurl = tmp.content;
                }
                url = read_link_1.splitLink(rawurl).url;
                url = cm.hmdResolveURL(url);
                title = cm.getRange({
                    line: lineNo,
                    ch: from.ch + 2
                }, {
                    line: lineNo,
                    ch: url_begin.token.start - 1
                });
                var img = document.createElement("img");
                var marker = cm.markText(from, to, {
                    clearOnEnter: true,
                    collapsed: true,
                    replacedWith: img
                });
                img.addEventListener('load', function() {
                    img.classList.remove("hmd-image-loading");
                    marker.changed();
                }, false);
                img.addEventListener('error', function() {
                    img.classList.remove("hmd-image-loading");
                    img.classList.add("hmd-image-error");
                    marker.changed();
                }, false);
                img.addEventListener('click', function() {
                    return fold_1.breakMark(cm, marker);
                }, false);
                img.className = "hmd-image hmd-image-loading";
                img.src = url;
                img.title = title;
                return marker;
            } else if (DEBUG) console.log("[image]FAILED TO REQUEST RANGE: ", rngReq);
        }
        return null;
    };
    fold_1.registerFolder("image", exports1.ImageFolder, true);
});

});

parcelRegister("lWZFt", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold URL of links `[text](url)`
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("j53Ua")), (parcelRequire("1UVd0")), (parcelRequire("dU2vF")));
})(function(require1, exports1, fold_1, read_link_1, line_spans_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var DEBUG = false;
    exports1.LinkFolder = function(stream, token) {
        var cm = stream.cm;
        // a valid beginning must be ...
        if (!(token.string === '[' && // the leading [
        token.state.linkText && // (double check) is link text
        !token.state.linkTitle && // (double check) not image's title
        !/\bimage\b/.test(token.type) // and is not a image mark
        )) return null;
        var spanExtractor = line_spans_1.getLineSpanExtractor(cm);
        var tmpSpans;
        // first, find the link text span
        var linkTextSpan = spanExtractor.findSpanWithTypeAt({
            line: stream.lineNo,
            ch: token.start
        }, "linkText");
        if (!linkTextSpan) return null;
        // then find the link href span
        var linkHrefSpan = spanExtractor.findSpanWithTypeAt({
            line: stream.lineNo,
            ch: linkTextSpan.end + 1
        }, "linkHref");
        if (!linkHrefSpan) return null;
        // now compose the ranges
        var href_from = {
            line: stream.lineNo,
            ch: linkHrefSpan.begin
        };
        var href_to = {
            line: stream.lineNo,
            ch: linkHrefSpan.end
        };
        var link_from = {
            line: stream.lineNo,
            ch: linkTextSpan.begin
        };
        var link_to = href_to;
        // and check if the range is OK
        var rngReq = stream.requestRange(href_from, href_to, link_from, href_from);
        if (rngReq !== fold_1.RequestRangeResult.OK) return null;
        // everything is OK! make the widget
        var text = cm.getRange(href_from, href_to);
        var _a = read_link_1.splitLink(text.substr(1, text.length - 2)), url = _a.url, title = _a.title;
        var img = document.createElement("span");
        img.setAttribute("class", "hmd-link-icon");
        img.setAttribute("title", url + "\n" + title);
        img.setAttribute("data-url", url);
        var marker = cm.markText(href_from, href_to, {
            collapsed: true,
            replacedWith: img
        });
        img.addEventListener('click', function() {
            return fold_1.breakMark(cm, marker);
        }, false);
        return marker;
    };
    fold_1.registerFolder("link", exports1.LinkFolder, true);
});

});

parcelRegister("4gGQe", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Turn code blocks into flow charts / playground sandboxes etc.
//
// =============================================
// **START AN ADDON** Check List
// =============================================
// 1. Replace "FoldCode" to your addon's name (note the first letter is upper-case)
// 2. Edit #region CodeMirror Extension
//    - If don't need this, delete the whole region
//    - Otherwise, delete hmdRollAndDice and add your own functions
// 3. Edit #region Addon Class
//    - You might want to reading CONTRIBUTING.md
// 4. Edit #region Addon Options
//    - It's highly suggested to finish the docs, see //TODO: write doc
//    - Note the defaultOption shall be the status when this addon is disabled!
//    - As for `FlipFlop` and `ff_*`, you might want to reading CONTRIBUTING.md
// 5. Remove this check-list
// 6. Modify `DESCRIPTION: ` above
// 6. Build, Publish, Pull Request etc.
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("j53Ua")));
})(function(require1, exports1, CodeMirror, core_1, fold_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.rendererRegistry = {};
    /**
     * Add a CodeRenderer to the System CodeRenderer Registry
     *
     * @param lang
     * @param folder
     * @param suggested enable this folder in suggestedEditorConfig
     * @param force if a folder with same name is already exists, overwrite it. (dangerous)
     */ function registerRenderer(info, force) {
        if (!info || !info.name || !info.renderer) return;
        var name = info.name;
        var pattern = info.pattern;
        var registry = exports1.rendererRegistry;
        if (name in registry) {
            if (!force) throw new Error("CodeRenderer " + name + " already exists");
        }
        if (typeof pattern === 'string') {
            var t_1 = pattern.toLowerCase();
            pattern = function(lang) {
                return lang.toLowerCase() === t_1;
            };
        } else if (pattern instanceof RegExp) pattern = function(lang) {
            return info.pattern.test(lang);
        };
        var newInfo = {
            name: name,
            suggested: !!info.suggested,
            pattern: pattern,
            renderer: info.renderer
        };
        registry[name] = newInfo;
        exports1.defaultOption[name] = false;
        exports1.suggestedOption[name] = newInfo.suggested;
    }
    exports1.registerRenderer = registerRenderer;
    //#endregion
    //#region FolderFunc for Addon/Fold -----------------------------------------------------
    /** the FolderFunc for Addon/Fold */ exports1.CodeFolder = function(stream, token) {
        if (token.start !== 0 || !token.type || token.type.indexOf('HyperMD-codeblock-begin') === -1 || !/[-\w]+\s*$/.test(token.string)) return null;
        return exports1.getAddon(stream.cm).fold(stream, token);
    };
    fold_1.registerFolder("code", exports1.CodeFolder, true);
    exports1.defaultOption = {
    };
    exports1.suggestedOption = {
    };
    core_1.suggestedEditorConfig.hmdFoldCode = exports1.suggestedOption;
    CodeMirror.defineOption("hmdFoldCode", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Record<string, boolean>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = newVal ? exports1.suggestedOption : exports1.defaultOption;
        ///// apply config
        var inst = exports1.getAddon(cm);
        for(var type in exports1.rendererRegistry)inst.setStatus(type, newVal[type]);
    // then, folding task will be queued by setStatus()
    });
    var FoldCode = /** @class */ function() {
        function FoldCode(cm) {
            this.cm = cm;
            /**
             * stores renderer status for current editor
             * @private To enable/disable renderer, use `setStatus()`
             */ this._enabled = {};
            /** renderers' output goes here */ this.folded = {};
        }
        /** enable/disable one kind of renderer, in current editor */ FoldCode.prototype.setStatus = function(type, enabled) {
            if (!(type in exports1.rendererRegistry)) return;
            if (!this._enabled[type] !== !enabled) {
                this._enabled[type] = !!enabled;
                if (enabled) fold_1.getAddon(this.cm).startFold();
                else this.clear(type);
            }
        };
        /** Clear one type of rendered TextMarkers */ FoldCode.prototype.clear = function(type) {
            var folded = this.folded[type];
            if (!folded || !folded.length) return;
            var info;
            while(info = folded.pop())info.marker.clear();
        };
        FoldCode.prototype.fold = function(stream, token) {
            var _this = this;
            if (token.start !== 0 || !token.type || token.type.indexOf('HyperMD-codeblock-begin') === -1) return null;
            var tmp = /([-\w]+)\s*$/.exec(token.string);
            var lang = tmp && tmp[1].toLowerCase();
            if (!lang) return null;
            var renderer;
            var type;
            var cm = this.cm, registry = exports1.rendererRegistry, _enabled = this._enabled;
            for(var type_i in registry){
                var r = registry[type_i];
                if (!_enabled[type_i]) continue;
                if (!r.pattern(lang)) continue;
                type = type_i;
                renderer = r.renderer;
                break;
            }
            if (!type) return null;
            var from = {
                line: stream.lineNo,
                ch: 0
            };
            var to = null;
            // find the end of code block
            var lastLineCM = cm.lastLine();
            var endLine = stream.lineNo + 1;
            do {
                var s = cm.getTokenAt({
                    line: endLine,
                    ch: 1
                });
                if (s && s.type && s.type.indexOf('HyperMD-codeblock-end') !== -1) {
                    //FOUND END!
                    to = {
                        line: endLine,
                        ch: s.end
                    };
                    break;
                }
            }while (++endLine < lastLineCM);
            if (!to) return null;
            // request the range
            var rngReq = stream.requestRange(from, to);
            if (rngReq !== fold_1.RequestRangeResult.OK) return null;
            // now we can call renderer
            var code = cm.getRange({
                line: from.line + 1,
                ch: 0
            }, {
                line: to.line,
                ch: 0
            });
            var info = {
                editor: cm,
                lang: lang,
                marker: null,
                lineWidget: null,
                el: null,
                break: undefined_function,
                changed: undefined_function
            };
            var el = info.el = renderer(code, info);
            if (!el) {
                info.marker.clear();
                return null;
            }
            //-----------------------------
            var $wrapper = document.createElement('div');
            $wrapper.className = contentClass + type;
            $wrapper.style.minHeight = '1em';
            $wrapper.appendChild(el);
            var lineWidget = info.lineWidget = cm.addLineWidget(to.line, $wrapper, {
                above: false,
                coverGutter: false,
                noHScroll: false,
                showIfHidden: false
            });
            //-----------------------------
            var $stub = document.createElement('span');
            $stub.className = stubClass + type;
            $stub.textContent = '<CODE>';
            var marker = info.marker = cm.markText(from, to, {
                replacedWith: $stub
            });
            //-----------------------------
            var highlightON = function() {
                return $stub.className = stubClassHighlight + type;
            };
            var highlightOFF = function() {
                return $stub.className = stubClass + type;
            };
            $wrapper.addEventListener("mouseenter", highlightON, false);
            $wrapper.addEventListener("mouseleave", highlightOFF, false);
            info.changed = function() {
                lineWidget.changed();
            };
            info.break = function() {
                fold_1.breakMark(cm, marker);
            };
            $stub.addEventListener('click', info.break, false);
            marker.on("clear", function() {
                var markers = _this.folded[type];
                var idx;
                if (markers && (idx = markers.indexOf(info)) !== -1) markers.splice(idx, 1);
                if (typeof info.onRemove === 'function') info.onRemove(info);
                lineWidget.clear();
            });
            if (!(type in this.folded)) this.folded[type] = [
                info
            ];
            else this.folded[type].push(info);
            return marker;
        };
        return FoldCode;
    }();
    exports1.FoldCode = FoldCode;
    //#endregion
    var contentClass = "hmd-fold-code-content hmd-fold-code-"; // + renderer_type
    var stubClass = "hmd-fold-code-stub hmd-fold-code-"; // + renderer_type
    var stubClassHighlight = "hmd-fold-code-stub highlight hmd-fold-code-"; // + renderer_type
    var undefined_function = function() {};
    /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldCode instance */ exports1.getAddon = core_1.Addon.Getter("FoldCode", FoldCode, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("fehL4", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold and Render TeX formula expressions. Works with *fold* addon.
//
// Provides *DumbRenderer* as the Default MathRenderer.
// You may use others like MathJax, KaTeX via PowerPacks
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("j53Ua")));
})(function(require1, exports1, CodeMirror, core_1, fold_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var DEBUG = false;
    /********************************************************************************** */ //#region Exports
    /**
     * Detect if a token is a beginning of Math, and fold it!
     *
     * @see FolderFunc in ./fold.ts
     */ exports1.MathFolder = function(stream, token) {
        var mathBeginRE = /formatting-math-begin\b/;
        if (!mathBeginRE.test(token.type)) return null;
        var cm = stream.cm;
        var line = stream.lineNo;
        var maySpanLines = /math-2\b/.test(token.type); // $$ may span lines!
        var tokenLength = maySpanLines ? 2 : 1; // "$$" or "$"
        // CodeMirror GFM mode split "$$" into two tokens, so do a extra check.
        if (tokenLength == 2 && token.string.length == 1) {
            if (DEBUG) console.log("[FoldMath] $$ is splitted into 2 tokens");
            var nextToken = stream.lineTokens[stream.i_token + 1];
            if (!nextToken || !mathBeginRE.test(nextToken.type)) return null;
        }
        // Find the position of the "$" tail and compose a range
        var end_info = stream.findNext(/formatting-math-end\b/, maySpanLines);
        var from = {
            line: line,
            ch: token.start
        };
        var to;
        var noEndingToken = false;
        if (end_info) to = {
            line: end_info.lineNo,
            ch: end_info.token.start + tokenLength
        };
        else if (maySpanLines) {
            // end not found, but this is a multi-line math block.
            // fold to the end of doc
            var lastLineNo = cm.lastLine();
            to = {
                line: lastLineNo,
                ch: cm.getLine(lastLineNo).length
            };
            noEndingToken = true;
        } else // Hmm... corrupted math ?
        return null;
        // Range is ready. request the range
        var expr_from = {
            line: from.line,
            ch: from.ch + tokenLength
        };
        var expr_to = {
            line: to.line,
            ch: to.ch - (noEndingToken ? 0 : tokenLength)
        };
        var expr = cm.getRange(expr_from, expr_to).trim();
        var foldMathAddon = exports1.getAddon(cm);
        var reqAns = stream.requestRange(from, to);
        if (reqAns !== fold_1.RequestRangeResult.OK) {
            if (reqAns === fold_1.RequestRangeResult.CURSOR_INSIDE) foldMathAddon.editingExpr = expr; // try to trig preview event
            return null;
        }
        // Now let's make a math widget!
        var isDisplayMode = tokenLength > 1 && from.ch == 0 && (noEndingToken || to.ch >= cm.getLine(to.line).length);
        var marker = insertMathMark(cm, from, to, expr, tokenLength, isDisplayMode);
        foldMathAddon.editingExpr = null; // try to hide preview
        return marker;
    };
    /**
     * Insert a TextMarker, and try to render it with configured MathRenderer.
     */ function insertMathMark(cm, p1, p2, expression, tokenLength, isDisplayMode) {
        var span = document.createElement("span");
        span.setAttribute("class", "hmd-fold-math math-" + (isDisplayMode ? 2 : 1));
        span.setAttribute("title", expression);
        var mathPlaceholder = document.createElement("span");
        mathPlaceholder.setAttribute("class", "hmd-fold-math-placeholder");
        mathPlaceholder.textContent = expression;
        span.appendChild(mathPlaceholder);
        if (DEBUG) console.log("insert", p1, p2, expression);
        var marker = cm.markText(p1, p2, {
            replacedWith: span
        });
        span.addEventListener("click", function() {
            return fold_1.breakMark(cm, marker, tokenLength);
        }, false);
        var foldMathAddon = exports1.getAddon(cm);
        var mathRenderer = foldMathAddon.createRenderer(span, isDisplayMode ? "display" : "");
        mathRenderer.onChanged = function() {
            if (mathPlaceholder) {
                span.removeChild(mathPlaceholder);
                mathPlaceholder = null;
            }
            marker.changed();
        };
        marker.on("clear", function() {
            mathRenderer.clear();
        });
        marker["mathRenderer"] = mathRenderer;
        core_1.tryToRun(function() {
            if (DEBUG) console.log("[MATH] Trying to render ", expression);
            if (!mathRenderer.isReady()) return false;
            mathRenderer.startRender(expression);
            return true;
        }, 5, function() {
            marker.clear();
            if (DEBUG) console.log("[MATH] engine always not ready. faild to render ", expression, p1);
        });
        return marker;
    }
    exports1.insertMathMark = insertMathMark;
    //#endregion
    fold_1.registerFolder("math", exports1.MathFolder, true);
    /********************************************************************************** */ //#region Default Renderer
    var DumbRenderer = /** @class */ function() {
        function DumbRenderer(container, mode) {
            var _this = this;
            this.container = container;
            var img = document.createElement("img");
            img.setAttribute("class", "hmd-math-dumb");
            img.addEventListener("load", function() {
                if (_this.onChanged) _this.onChanged(_this.last_expr);
            }, false);
            this.img = img;
            container.appendChild(img);
        }
        DumbRenderer.prototype.startRender = function(expr) {
            this.last_expr = expr;
            this.img.src = "https://latex.codecogs.com/gif.latex?" + encodeURIComponent(expr);
        };
        DumbRenderer.prototype.clear = function() {
            this.container.removeChild(this.img);
        };
        /** indicate that if the Renderer is ready to execute */ DumbRenderer.prototype.isReady = function() {
            return true; // I'm always ready!
        };
        return DumbRenderer;
    }();
    exports1.DumbRenderer = DumbRenderer;
    exports1.defaultOption = {
        renderer: DumbRenderer,
        onPreview: null,
        onPreviewEnd: null
    };
    exports1.suggestedOption = {};
    core_1.suggestedEditorConfig.hmdFoldMath = exports1.suggestedOption;
    CodeMirror.defineOption("hmdFoldMath", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal) newVal = {};
        else if (typeof newVal === "function") newVal = {
            renderer: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var FoldMath = /** @class */ function() {
        function FoldMath(cm) {
            var _this = this;
            this.cm = cm;
            new core_1.FlipFlop(/** CHANGED */ function(expr) {
                _this.onPreview && _this.onPreview(expr);
            }, /** HIDE    */ function() {
                _this.onPreviewEnd && _this.onPreviewEnd();
            }, null).bind(this, "editingExpr");
        }
        FoldMath.prototype.createRenderer = function(container, mode) {
            var RendererClass = this.renderer || DumbRenderer;
            return new RendererClass(container, mode);
        };
        return FoldMath;
    }();
    exports1.FoldMath = FoldMath;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldMath instance */ exports1.getAddon = core_1.Addon.Getter("FoldMath", FoldMath, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("jyUjl", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold and render emoji :smile:
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("j53Ua")));
})(function(require1, exports1, CodeMirror, core_1, fold_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.defaultDict = {};
    exports1.defaultChecker = function(text) {
        return text in exports1.defaultDict;
    };
    exports1.defaultRenderer = function(text) {
        var el = document.createElement("span");
        el.textContent = exports1.defaultDict[text];
        el.title = text;
        return el;
    };
    /********************************************************************************** */ //#region Folder
    /**
     * Detect if a token is emoji and fold it
     *
     * @see FolderFunc in ./fold.ts
     */ exports1.EmojiFolder = function(stream, token) {
        if (!token.type || !/ formatting-emoji/.test(token.type)) return null;
        var cm = stream.cm;
        var from = {
            line: stream.lineNo,
            ch: token.start
        };
        var to = {
            line: stream.lineNo,
            ch: token.end
        };
        var name = token.string; // with ":"
        var addon = exports1.getAddon(cm);
        if (!addon.isEmoji(name)) return null;
        var reqAns = stream.requestRange(from, to);
        if (reqAns !== fold_1.RequestRangeResult.OK) return null;
        // now we are ready to fold and render!
        var marker = addon.foldEmoji(name, from, to);
        return marker;
    };
    //#endregion
    fold_1.registerFolder("emoji", exports1.EmojiFolder, true);
    exports1.defaultOption = {
        myEmoji: {},
        emojiRenderer: exports1.defaultRenderer,
        emojiChecker: exports1.defaultChecker
    };
    exports1.suggestedOption = {};
    core_1.suggestedEditorConfig.hmdFoldEmoji = exports1.suggestedOption;
    CodeMirror.defineOption("hmdFoldEmoji", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal) newVal = {};
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var FoldEmoji = /** @class */ function() {
        function FoldEmoji(cm) {
            this.cm = cm;
        // options will be initialized to defaultOption when constructor is finished
        }
        FoldEmoji.prototype.isEmoji = function(text) {
            return text in this.myEmoji || this.emojiChecker(text);
        };
        FoldEmoji.prototype.foldEmoji = function(text, from, to) {
            var cm = this.cm;
            var el = text in this.myEmoji && this.myEmoji[text](text) || this.emojiRenderer(text);
            if (!el || !el.tagName) return null;
            if (el.className.indexOf('hmd-emoji') === -1) el.className += " hmd-emoji";
            var marker = cm.markText(from, to, {
                replacedWith: el
            });
            el.addEventListener("click", fold_1.breakMark.bind(this, cm, marker, 1), false);
            if (el.tagName.toLowerCase() === 'img') {
                el.addEventListener('load', function() {
                    return marker.changed();
                }, false);
                el.addEventListener('dragstart', function(ev) {
                    return ev.preventDefault();
                }, false);
            }
            return marker;
        };
        return FoldEmoji;
    }();
    exports1.FoldEmoji = FoldEmoji;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldEmoji instance */ exports1.getAddon = core_1.Addon.Getter("FoldEmoji", FoldEmoji, exports1.defaultOption /** if has options */ );
    /********************************************************************************** */ //#region initialize compact emoji dict
    (function(dest) {
        /** source https://gist.github.com/rxaviers/7360908 */ var parts = [
            "smile:\uD83D\uDE04;laughing:\uD83D\uDE06;blush:\uD83D\uDE0A;smiley:\uD83D\uDE03;relaxed:\u263A\uFE0F;smirk:\uD83D\uDE0F;heart_eyes:\uD83D\uDE0D;kissing_heart:\uD83D\uDE18;kissing_closed_eyes:\uD83D\uDE1A;flushed:\uD83D\uDE33;relieved:\uD83D\uDE0C;satisfied:\uD83D\uDE06;grin:\uD83D\uDE01;wink:\uD83D\uDE09;stuck_out_tongue_winking_eye:\uD83D\uDE1C;stuck_out_tongue_closed_eyes:\uD83D\uDE1D;grinning:\uD83D\uDE00;kissing:\uD83D\uDE17;kissing_smiling_eyes:\uD83D\uDE19;stuck_out_tongue:\uD83D\uDE1B;sleeping:\uD83D\uDE34;worried:\uD83D\uDE1F;frowning:\uD83D\uDE26;anguished:\uD83D\uDE27;open_mouth:\uD83D\uDE2E;grimacing:\uD83D\uDE2C;confused:\uD83D\uDE15;hushed:\uD83D\uDE2F;expressionless:\uD83D\uDE11;unamused:\uD83D\uDE12;sweat_smile:\uD83D\uDE05;sweat:\uD83D\uDE13;disappointed_relieved:\uD83D\uDE25;weary:\uD83D\uDE29;pensive:\uD83D\uDE14;disappointed:\uD83D\uDE1E;confounded:\uD83D\uDE16;fearful:\uD83D\uDE28;cold_sweat:\uD83D\uDE30;persevere:\uD83D\uDE23;cry:\uD83D\uDE22;sob:\uD83D\uDE2D;joy:\uD83D\uDE02;astonished:\uD83D\uDE32;scream:\uD83D\uDE31;tired_face:\uD83D\uDE2B;angry:\uD83D\uDE20;rage:\uD83D\uDE21;triumph:\uD83D\uDE24;sleepy:\uD83D\uDE2A;yum:\uD83D\uDE0B;mask:\uD83D\uDE37;sunglasses:\uD83D\uDE0E;dizzy_face:\uD83D\uDE35;imp:\uD83D\uDC7F;smiling_imp:\uD83D\uDE08;neutral_face:\uD83D\uDE10;no_mouth:\uD83D\uDE36;innocent:\uD83D\uDE07;alien:\uD83D\uDC7D;yellow_heart:\uD83D\uDC9B;blue_heart:\uD83D\uDC99;purple_heart:\uD83D\uDC9C;heart:\u2764\uFE0F;green_heart:\uD83D\uDC9A;broken_heart:\uD83D\uDC94;heartbeat:\uD83D\uDC93;heartpulse:\uD83D\uDC97;two_hearts:\uD83D\uDC95;revolving_hearts:\uD83D\uDC9E;cupid:\uD83D\uDC98;sparkling_heart:\uD83D\uDC96;sparkles:\u2728;star:\u2B50\uFE0F;star2:\uD83C\uDF1F;dizzy:\uD83D\uDCAB;boom:\uD83D\uDCA5;collision:\uD83D\uDCA5;anger:\uD83D\uDCA2;exclamation:\u2757\uFE0F;question:\u2753;grey_exclamation:\u2755;grey_question:\u2754;zzz:\uD83D\uDCA4;dash:\uD83D\uDCA8;sweat_drops:\uD83D\uDCA6;notes:\uD83C\uDFB6;musical_note:\uD83C\uDFB5;fire:\uD83D\uDD25;hankey:\uD83D\uDCA9;poop:\uD83D\uDCA9;shit:\uD83D\uDCA9;",
            "+1:\uD83D\uDC4D;thumbsup:\uD83D\uDC4D;-1:\uD83D\uDC4E;thumbsdown:\uD83D\uDC4E;ok_hand:\uD83D\uDC4C;punch:\uD83D\uDC4A;facepunch:\uD83D\uDC4A;fist:\u270A;v:\u270C\uFE0F;wave:\uD83D\uDC4B;hand:\u270B;raised_hand:\u270B;open_hands:\uD83D\uDC50;point_up:\u261D\uFE0F;point_down:\uD83D\uDC47;point_left:\uD83D\uDC48;point_right:\uD83D\uDC49;raised_hands:\uD83D\uDE4C;pray:\uD83D\uDE4F;point_up_2:\uD83D\uDC46;clap:\uD83D\uDC4F;muscle:\uD83D\uDCAA;metal:\uD83E\uDD18;fu:\uD83D\uDD95;walking:\uD83D\uDEB6;runner:\uD83C\uDFC3;running:\uD83C\uDFC3;couple:\uD83D\uDC6B;family:\uD83D\uDC6A;two_men_holding_hands:\uD83D\uDC6C;two_women_holding_hands:\uD83D\uDC6D;dancer:\uD83D\uDC83;dancers:\uD83D\uDC6F;ok_woman:\uD83D\uDE46;no_good:\uD83D\uDE45;information_desk_person:\uD83D\uDC81;raising_hand:\uD83D\uDE4B;bride_with_veil:\uD83D\uDC70;person_with_pouting_face:\uD83D\uDE4E;person_frowning:\uD83D\uDE4D;bow:\uD83D\uDE47;couplekiss::couplekiss:;couple_with_heart:\uD83D\uDC91;massage:\uD83D\uDC86;haircut:\uD83D\uDC87;nail_care:\uD83D\uDC85;boy:\uD83D\uDC66;girl:\uD83D\uDC67;woman:\uD83D\uDC69;man:\uD83D\uDC68;baby:\uD83D\uDC76;older_woman:\uD83D\uDC75;older_man:\uD83D\uDC74;person_with_blond_hair:\uD83D\uDC71;man_with_gua_pi_mao:\uD83D\uDC72;man_with_turban:\uD83D\uDC73;construction_worker:\uD83D\uDC77;cop:\uD83D\uDC6E;angel:\uD83D\uDC7C;princess:\uD83D\uDC78;smiley_cat:\uD83D\uDE3A;smile_cat:\uD83D\uDE38;heart_eyes_cat:\uD83D\uDE3B;kissing_cat:\uD83D\uDE3D;smirk_cat:\uD83D\uDE3C;scream_cat:\uD83D\uDE40;crying_cat_face:\uD83D\uDE3F;joy_cat:\uD83D\uDE39;pouting_cat:\uD83D\uDE3E;japanese_ogre:\uD83D\uDC79;japanese_goblin:\uD83D\uDC7A;see_no_evil:\uD83D\uDE48;hear_no_evil:\uD83D\uDE49;speak_no_evil:\uD83D\uDE4A;guardsman:\uD83D\uDC82;skull:\uD83D\uDC80;feet:\uD83D\uDC3E;lips:\uD83D\uDC44;kiss:\uD83D\uDC8B;droplet:\uD83D\uDCA7;ear:\uD83D\uDC42;eyes:\uD83D\uDC40;nose:\uD83D\uDC43;tongue:\uD83D\uDC45;love_letter:\uD83D\uDC8C;bust_in_silhouette:\uD83D\uDC64;busts_in_silhouette:\uD83D\uDC65;speech_balloon:\uD83D\uDCAC;",
            "thought_balloon:\uD83D\uDCAD;sunny:\u2600\uFE0F;umbrella:\u2614\uFE0F;cloud:\u2601\uFE0F;snowflake:\u2744\uFE0F;snowman:\u26C4\uFE0F;zap:\u26A1\uFE0F;cyclone:\uD83C\uDF00;foggy:\uD83C\uDF01;ocean:\uD83C\uDF0A;cat:\uD83D\uDC31;dog:\uD83D\uDC36;mouse:\uD83D\uDC2D;hamster:\uD83D\uDC39;rabbit:\uD83D\uDC30;wolf:\uD83D\uDC3A;frog:\uD83D\uDC38;tiger:\uD83D\uDC2F;koala:\uD83D\uDC28;bear:\uD83D\uDC3B;pig:\uD83D\uDC37;pig_nose:\uD83D\uDC3D;cow:\uD83D\uDC2E;boar:\uD83D\uDC17;monkey_face:\uD83D\uDC35;monkey:\uD83D\uDC12;horse:\uD83D\uDC34;racehorse:\uD83D\uDC0E;camel:\uD83D\uDC2B;sheep:\uD83D\uDC11;elephant:\uD83D\uDC18;panda_face:\uD83D\uDC3C;snake:\uD83D\uDC0D;bird:\uD83D\uDC26;baby_chick:\uD83D\uDC24;hatched_chick:\uD83D\uDC25;hatching_chick:\uD83D\uDC23;chicken:\uD83D\uDC14;penguin:\uD83D\uDC27;turtle:\uD83D\uDC22;bug:\uD83D\uDC1B;honeybee:\uD83D\uDC1D;ant:\uD83D\uDC1C;beetle:\uD83D\uDC1E;snail:\uD83D\uDC0C;octopus:\uD83D\uDC19;tropical_fish:\uD83D\uDC20;fish:\uD83D\uDC1F;whale:\uD83D\uDC33;whale2:\uD83D\uDC0B;dolphin:\uD83D\uDC2C;cow2:\uD83D\uDC04;ram:\uD83D\uDC0F;rat:\uD83D\uDC00;water_buffalo:\uD83D\uDC03;tiger2:\uD83D\uDC05;rabbit2:\uD83D\uDC07;dragon:\uD83D\uDC09;goat:\uD83D\uDC10;rooster:\uD83D\uDC13;dog2:\uD83D\uDC15;pig2:\uD83D\uDC16;mouse2:\uD83D\uDC01;ox:\uD83D\uDC02;dragon_face:\uD83D\uDC32;blowfish:\uD83D\uDC21;crocodile:\uD83D\uDC0A;dromedary_camel:\uD83D\uDC2A;leopard:\uD83D\uDC06;cat2:\uD83D\uDC08;poodle:\uD83D\uDC29;paw_prints:\uD83D\uDC3E;bouquet:\uD83D\uDC90;cherry_blossom:\uD83C\uDF38;tulip:\uD83C\uDF37;four_leaf_clover:\uD83C\uDF40;rose:\uD83C\uDF39;sunflower:\uD83C\uDF3B;hibiscus:\uD83C\uDF3A;maple_leaf:\uD83C\uDF41;leaves:\uD83C\uDF43;fallen_leaf:\uD83C\uDF42;herb:\uD83C\uDF3F;mushroom:\uD83C\uDF44;cactus:\uD83C\uDF35;palm_tree:\uD83C\uDF34;evergreen_tree:\uD83C\uDF32;deciduous_tree:\uD83C\uDF33;chestnut:\uD83C\uDF30;seedling:\uD83C\uDF31;blossom:\uD83C\uDF3C;ear_of_rice:\uD83C\uDF3E;shell:\uD83D\uDC1A;globe_with_meridians:\uD83C\uDF10;sun_with_face:\uD83C\uDF1E;full_moon_with_face:\uD83C\uDF1D;new_moon_with_face:\uD83C\uDF1A;new_moon:\uD83C\uDF11;waxing_crescent_moon:\uD83C\uDF12;first_quarter_moon:\uD83C\uDF13;waxing_gibbous_moon:\uD83C\uDF14;full_moon:\uD83C\uDF15;waning_gibbous_moon:\uD83C\uDF16;last_quarter_moon:\uD83C\uDF17;waning_crescent_moon:\uD83C\uDF18;last_quarter_moon_with_face:\uD83C\uDF1C;",
            "first_quarter_moon_with_face:\uD83C\uDF1B;moon:\uD83C\uDF14;earth_africa:\uD83C\uDF0D;earth_americas:\uD83C\uDF0E;earth_asia:\uD83C\uDF0F;volcano:\uD83C\uDF0B;milky_way:\uD83C\uDF0C;partly_sunny:\u26C5\uFE0F;bamboo:\uD83C\uDF8D;gift_heart:\uD83D\uDC9D;dolls:\uD83C\uDF8E;school_satchel:\uD83C\uDF92;mortar_board:\uD83C\uDF93;flags:\uD83C\uDF8F;fireworks:\uD83C\uDF86;sparkler:\uD83C\uDF87;wind_chime:\uD83C\uDF90;rice_scene:\uD83C\uDF91;jack_o_lantern:\uD83C\uDF83;ghost:\uD83D\uDC7B;santa:\uD83C\uDF85;christmas_tree:\uD83C\uDF84;gift:\uD83C\uDF81;bell:\uD83D\uDD14;no_bell:\uD83D\uDD15;tanabata_tree:\uD83C\uDF8B;tada:\uD83C\uDF89;confetti_ball:\uD83C\uDF8A;balloon:\uD83C\uDF88;crystal_ball:\uD83D\uDD2E;cd:\uD83D\uDCBF;dvd:\uD83D\uDCC0;floppy_disk:\uD83D\uDCBE;camera:\uD83D\uDCF7;video_camera:\uD83D\uDCF9;movie_camera:\uD83C\uDFA5;computer:\uD83D\uDCBB;tv:\uD83D\uDCFA;iphone:\uD83D\uDCF1;phone:\u260E\uFE0F;telephone:\u260E\uFE0F;telephone_receiver:\uD83D\uDCDE;pager:\uD83D\uDCDF;fax:\uD83D\uDCE0;minidisc:\uD83D\uDCBD;vhs:\uD83D\uDCFC;sound:\uD83D\uDD09;speaker:\uD83D\uDD08;mute:\uD83D\uDD07;loudspeaker:\uD83D\uDCE2;mega:\uD83D\uDCE3;hourglass:\u231B\uFE0F;hourglass_flowing_sand:\u23F3;alarm_clock:\u23F0;watch:\u231A\uFE0F;radio:\uD83D\uDCFB;satellite:\uD83D\uDCE1;loop:\u27BF;mag:\uD83D\uDD0D;mag_right:\uD83D\uDD0E;unlock:\uD83D\uDD13;lock:\uD83D\uDD12;lock_with_ink_pen:\uD83D\uDD0F;closed_lock_with_key:\uD83D\uDD10;key:\uD83D\uDD11;bulb:\uD83D\uDCA1;flashlight:\uD83D\uDD26;high_brightness:\uD83D\uDD06;low_brightness:\uD83D\uDD05;electric_plug:\uD83D\uDD0C;battery:\uD83D\uDD0B;calling:\uD83D\uDCF2;email:\u2709\uFE0F;mailbox:\uD83D\uDCEB;postbox:\uD83D\uDCEE;bath:\uD83D\uDEC0;bathtub:\uD83D\uDEC1;shower:\uD83D\uDEBF;toilet:\uD83D\uDEBD;wrench:\uD83D\uDD27;nut_and_bolt:\uD83D\uDD29;hammer:\uD83D\uDD28;seat:\uD83D\uDCBA;moneybag:\uD83D\uDCB0;yen:\uD83D\uDCB4;dollar:\uD83D\uDCB5;pound:\uD83D\uDCB7;euro:\uD83D\uDCB6;",
            "credit_card:\uD83D\uDCB3;money_with_wings:\uD83D\uDCB8;e-mail:\uD83D\uDCE7;inbox_tray:\uD83D\uDCE5;outbox_tray:\uD83D\uDCE4;envelope:\u2709\uFE0F;incoming_envelope:\uD83D\uDCE8;postal_horn:\uD83D\uDCEF;mailbox_closed:\uD83D\uDCEA;mailbox_with_mail:\uD83D\uDCEC;mailbox_with_no_mail:\uD83D\uDCED;door:\uD83D\uDEAA;smoking:\uD83D\uDEAC;bomb:\uD83D\uDCA3;gun:\uD83D\uDD2B;hocho:\uD83D\uDD2A;pill:\uD83D\uDC8A;syringe:\uD83D\uDC89;page_facing_up:\uD83D\uDCC4;page_with_curl:\uD83D\uDCC3;bookmark_tabs:\uD83D\uDCD1;bar_chart:\uD83D\uDCCA;chart_with_upwards_trend:\uD83D\uDCC8;chart_with_downwards_trend:\uD83D\uDCC9;scroll:\uD83D\uDCDC;clipboard:\uD83D\uDCCB;calendar:\uD83D\uDCC6;date:\uD83D\uDCC5;card_index:\uD83D\uDCC7;file_folder:\uD83D\uDCC1;open_file_folder:\uD83D\uDCC2;scissors:\u2702\uFE0F;pushpin:\uD83D\uDCCC;paperclip:\uD83D\uDCCE;black_nib:\u2712\uFE0F;pencil2:\u270F\uFE0F;straight_ruler:\uD83D\uDCCF;triangular_ruler:\uD83D\uDCD0;closed_book:\uD83D\uDCD5;green_book:\uD83D\uDCD7;blue_book:\uD83D\uDCD8;orange_book:\uD83D\uDCD9;notebook:\uD83D\uDCD3;notebook_with_decorative_cover:\uD83D\uDCD4;ledger:\uD83D\uDCD2;books:\uD83D\uDCDA;bookmark:\uD83D\uDD16;name_badge:\uD83D\uDCDB;microscope:\uD83D\uDD2C;telescope:\uD83D\uDD2D;newspaper:\uD83D\uDCF0;football:\uD83C\uDFC8;basketball:\uD83C\uDFC0;soccer:\u26BD\uFE0F;baseball:\u26BE\uFE0F;tennis:\uD83C\uDFBE;8ball:\uD83C\uDFB1;",
            "rugby_football:\uD83C\uDFC9;bowling:\uD83C\uDFB3;golf:\u26F3\uFE0F;mountain_bicyclist:\uD83D\uDEB5;bicyclist:\uD83D\uDEB4;horse_racing:\uD83C\uDFC7;snowboarder:\uD83C\uDFC2;swimmer:\uD83C\uDFCA;surfer:\uD83C\uDFC4;ski:\uD83C\uDFBF;spades:\u2660\uFE0F;hearts:\u2665\uFE0F;clubs:\u2663\uFE0F;diamonds:\u2666\uFE0F;gem:\uD83D\uDC8E;ring:\uD83D\uDC8D;trophy:\uD83C\uDFC6;musical_score:\uD83C\uDFBC;musical_keyboard:\uD83C\uDFB9;violin:\uD83C\uDFBB;space_invader:\uD83D\uDC7E;video_game:\uD83C\uDFAE;black_joker:\uD83C\uDCCF;flower_playing_cards:\uD83C\uDFB4;game_die:\uD83C\uDFB2;dart:\uD83C\uDFAF;mahjong:\uD83C\uDC04\uFE0F;clapper:\uD83C\uDFAC;memo:\uD83D\uDCDD;pencil:\uD83D\uDCDD;book:\uD83D\uDCD6;art:\uD83C\uDFA8;microphone:\uD83C\uDFA4;headphones:\uD83C\uDFA7;trumpet:\uD83C\uDFBA;saxophone:\uD83C\uDFB7;guitar:\uD83C\uDFB8;shoe:\uD83D\uDC5E;sandal:\uD83D\uDC61;high_heel:\uD83D\uDC60;lipstick:\uD83D\uDC84;boot:\uD83D\uDC62;shirt:\uD83D\uDC55;tshirt:\uD83D\uDC55;necktie:\uD83D\uDC54;womans_clothes:\uD83D\uDC5A;dress:\uD83D\uDC57;running_shirt_with_sash:\uD83C\uDFBD;jeans:\uD83D\uDC56;kimono:\uD83D\uDC58;bikini:\uD83D\uDC59;ribbon:\uD83C\uDF80;tophat:\uD83C\uDFA9;crown:\uD83D\uDC51;womans_hat:\uD83D\uDC52;mans_shoe:\uD83D\uDC5E;closed_umbrella:\uD83C\uDF02;briefcase:\uD83D\uDCBC;handbag:\uD83D\uDC5C;pouch:\uD83D\uDC5D;purse:\uD83D\uDC5B;eyeglasses:\uD83D\uDC53;fishing_pole_and_fish:\uD83C\uDFA3;coffee:\u2615\uFE0F;tea:\uD83C\uDF75;sake:\uD83C\uDF76;baby_bottle:\uD83C\uDF7C;beer:\uD83C\uDF7A;beers:\uD83C\uDF7B;cocktail:\uD83C\uDF78;tropical_drink:\uD83C\uDF79;wine_glass:\uD83C\uDF77;fork_and_knife:\uD83C\uDF74;pizza:\uD83C\uDF55;hamburger:\uD83C\uDF54;fries:\uD83C\uDF5F;poultry_leg:\uD83C\uDF57;meat_on_bone:\uD83C\uDF56;spaghetti:\uD83C\uDF5D;curry:\uD83C\uDF5B;fried_shrimp:\uD83C\uDF64;bento:\uD83C\uDF71;sushi:\uD83C\uDF63;fish_cake:\uD83C\uDF65;rice_ball:\uD83C\uDF59;rice_cracker:\uD83C\uDF58;rice:\uD83C\uDF5A;",
            "ramen:\uD83C\uDF5C;stew:\uD83C\uDF72;oden:\uD83C\uDF62;dango:\uD83C\uDF61;egg:\uD83E\uDD5A;bread:\uD83C\uDF5E;doughnut:\uD83C\uDF69;custard:\uD83C\uDF6E;icecream:\uD83C\uDF66;ice_cream:\uD83C\uDF68;shaved_ice:\uD83C\uDF67;birthday:\uD83C\uDF82;cake:\uD83C\uDF70;cookie:\uD83C\uDF6A;chocolate_bar:\uD83C\uDF6B;candy:\uD83C\uDF6C;lollipop:\uD83C\uDF6D;honey_pot:\uD83C\uDF6F;apple:\uD83C\uDF4E;green_apple:\uD83C\uDF4F;tangerine:\uD83C\uDF4A;lemon:\uD83C\uDF4B;cherries:\uD83C\uDF52;grapes:\uD83C\uDF47;watermelon:\uD83C\uDF49;strawberry:\uD83C\uDF53;peach:\uD83C\uDF51;melon:\uD83C\uDF48;banana:\uD83C\uDF4C;pear:\uD83C\uDF50;pineapple:\uD83C\uDF4D;sweet_potato:\uD83C\uDF60;eggplant:\uD83C\uDF46;tomato:\uD83C\uDF45;corn:\uD83C\uDF3D;house:\uD83C\uDFE0;house_with_garden:\uD83C\uDFE1;school:\uD83C\uDFEB;office:\uD83C\uDFE2;post_office:\uD83C\uDFE3;hospital:\uD83C\uDFE5;bank:\uD83C\uDFE6;convenience_store:\uD83C\uDFEA;love_hotel:\uD83C\uDFE9;hotel:\uD83C\uDFE8;wedding:\uD83D\uDC92;church:\u26EA\uFE0F;department_store:\uD83C\uDFEC;european_post_office:\uD83C\uDFE4;city_sunrise:\uD83C\uDF07;city_sunset:\uD83C\uDF06;japanese_castle:\uD83C\uDFEF;european_castle:\uD83C\uDFF0;tent:\u26FA\uFE0F;factory:\uD83C\uDFED;tokyo_tower:\uD83D\uDDFC;japan:\uD83D\uDDFE;mount_fuji:\uD83D\uDDFB;sunrise_over_mountains:\uD83C\uDF04;sunrise:\uD83C\uDF05;stars:\uD83C\uDF20;statue_of_liberty:\uD83D\uDDFD;bridge_at_night:\uD83C\uDF09;carousel_horse:\uD83C\uDFA0;rainbow:\uD83C\uDF08;ferris_wheel:\uD83C\uDFA1;fountain:\u26F2\uFE0F;roller_coaster:\uD83C\uDFA2;ship:\uD83D\uDEA2;speedboat:\uD83D\uDEA4;boat:\u26F5\uFE0F;sailboat:\u26F5\uFE0F;rowboat:\uD83D\uDEA3;anchor:\u2693\uFE0F;rocket:\uD83D\uDE80;airplane:\u2708\uFE0F;helicopter:\uD83D\uDE81;steam_locomotive:\uD83D\uDE82;tram:\uD83D\uDE8A;mountain_railway:\uD83D\uDE9E;bike:\uD83D\uDEB2;aerial_tramway:\uD83D\uDEA1;suspension_railway:\uD83D\uDE9F;",
            "mountain_cableway:\uD83D\uDEA0;tractor:\uD83D\uDE9C;blue_car:\uD83D\uDE99;oncoming_automobile:\uD83D\uDE98;car:\uD83D\uDE97;red_car:\uD83D\uDE97;taxi:\uD83D\uDE95;oncoming_taxi:\uD83D\uDE96;articulated_lorry:\uD83D\uDE9B;bus:\uD83D\uDE8C;oncoming_bus:\uD83D\uDE8D;rotating_light:\uD83D\uDEA8;police_car:\uD83D\uDE93;oncoming_police_car:\uD83D\uDE94;fire_engine:\uD83D\uDE92;ambulance:\uD83D\uDE91;minibus:\uD83D\uDE90;truck:\uD83D\uDE9A;train:\uD83D\uDE8B;station:\uD83D\uDE89;train2:\uD83D\uDE86;bullettrain_front:\uD83D\uDE85;bullettrain_side:\uD83D\uDE84;light_rail:\uD83D\uDE88;monorail:\uD83D\uDE9D;railway_car:\uD83D\uDE83;trolleybus:\uD83D\uDE8E;ticket:\uD83C\uDFAB;fuelpump:\u26FD\uFE0F;vertical_traffic_light:\uD83D\uDEA6;traffic_light:\uD83D\uDEA5;warning:\u26A0\uFE0F;construction:\uD83D\uDEA7;beginner:\uD83D\uDD30;atm:\uD83C\uDFE7;slot_machine:\uD83C\uDFB0;busstop:\uD83D\uDE8F;barber:\uD83D\uDC88;hotsprings:\u2668\uFE0F;checkered_flag:\uD83C\uDFC1;crossed_flags:\uD83C\uDF8C;izakaya_lantern:\uD83C\uDFEE;moyai:\uD83D\uDDFF;circus_tent:\uD83C\uDFAA;performing_arts:\uD83C\uDFAD;round_pushpin:\uD83D\uDCCD;triangular_flag_on_post:\uD83D\uDEA9;jp:\uD83C\uDDEF\uD83C\uDDF5;kr:\uD83C\uDDF0\uD83C\uDDF7;cn:\uD83C\uDDE8\uD83C\uDDF3;us:\uD83C\uDDFA\uD83C\uDDF8;fr:\uD83C\uDDEB\uD83C\uDDF7;es:\uD83C\uDDEA\uD83C\uDDF8;it:\uD83C\uDDEE\uD83C\uDDF9;ru:\uD83C\uDDF7\uD83C\uDDFA;gb:\uD83C\uDDEC\uD83C\uDDE7;uk:\uD83C\uDDEC\uD83C\uDDE7;de:\uD83C\uDDE9\uD83C\uDDEA;one:1\uFE0F\u20E3;two:2\uFE0F\u20E3;three:3\uFE0F\u20E3;four:4\uFE0F\u20E3;five:5\uFE0F\u20E3;six:6\uFE0F\u20E3;seven:7\uFE0F\u20E3;eight:8\uFE0F\u20E3;nine:9\uFE0F\u20E3;keycap_ten:\uD83D\uDD1F;",
            "1234:\uD83D\uDD22;zero:0\uFE0F\u20E3;hash:#\uFE0F\u20E3;symbols:\uD83D\uDD23;arrow_backward:\u25C0\uFE0F;arrow_down:\u2B07\uFE0F;arrow_forward:\u25B6\uFE0F;arrow_left:\u2B05\uFE0F;capital_abcd:\uD83D\uDD20;abcd:\uD83D\uDD21;abc:\uD83D\uDD24;arrow_lower_left:\u2199\uFE0F;arrow_lower_right:\u2198\uFE0F;arrow_right:\u27A1\uFE0F;arrow_up:\u2B06\uFE0F;arrow_upper_left:\u2196\uFE0F;arrow_upper_right:\u2197\uFE0F;arrow_double_down:\u23EC;arrow_double_up:\u23EB;arrow_down_small:\uD83D\uDD3D;arrow_heading_down:\u2935\uFE0F;arrow_heading_up:\u2934\uFE0F;leftwards_arrow_with_hook:\u21A9\uFE0F;arrow_right_hook:\u21AA\uFE0F;left_right_arrow:\u2194\uFE0F;arrow_up_down:\u2195\uFE0F;arrow_up_small:\uD83D\uDD3C;arrows_clockwise:\uD83D\uDD03;arrows_counterclockwise:\uD83D\uDD04;rewind:\u23EA;fast_forward:\u23E9;information_source:\u2139\uFE0F;ok:\uD83C\uDD97;twisted_rightwards_arrows:\uD83D\uDD00;repeat:\uD83D\uDD01;repeat_one:\uD83D\uDD02;new:\uD83C\uDD95;top:\uD83D\uDD1D;up:\uD83C\uDD99;cool:\uD83C\uDD92;free:\uD83C\uDD93;ng:\uD83C\uDD96;cinema:\uD83C\uDFA6;koko:\uD83C\uDE01;signal_strength:\uD83D\uDCF6;u5272:\uD83C\uDE39;u5408:\uD83C\uDE34;u55b6:\uD83C\uDE3A;u6307:\uD83C\uDE2F\uFE0F;u6708:\uD83C\uDE37\uFE0F;u6709:\uD83C\uDE36;u6e80:\uD83C\uDE35;u7121:\uD83C\uDE1A\uFE0F;u7533:\uD83C\uDE38;u7a7a:\uD83C\uDE33;u7981:\uD83C\uDE32;sa:\uD83C\uDE02\uFE0F;restroom:\uD83D\uDEBB;mens:\uD83D\uDEB9;womens:\uD83D\uDEBA;baby_symbol:\uD83D\uDEBC;no_smoking:\uD83D\uDEAD;",
            "parking:\uD83C\uDD7F\uFE0F;wheelchair:\u267F\uFE0F;metro:\uD83D\uDE87;baggage_claim:\uD83D\uDEC4;accept:\uD83C\uDE51;wc:\uD83D\uDEBE;potable_water:\uD83D\uDEB0;put_litter_in_its_place:\uD83D\uDEAE;secret:\u3299\uFE0F;congratulations:\u3297\uFE0F;m:\u24C2\uFE0F;passport_control:\uD83D\uDEC2;left_luggage:\uD83D\uDEC5;customs:\uD83D\uDEC3;ideograph_advantage:\uD83C\uDE50;cl:\uD83C\uDD91;sos:\uD83C\uDD98;id:\uD83C\uDD94;no_entry_sign:\uD83D\uDEAB;underage:\uD83D\uDD1E;no_mobile_phones:\uD83D\uDCF5;do_not_litter:\uD83D\uDEAF;non-potable_water:\uD83D\uDEB1;no_bicycles:\uD83D\uDEB3;no_pedestrians:\uD83D\uDEB7;children_crossing:\uD83D\uDEB8;no_entry:\u26D4\uFE0F;eight_spoked_asterisk:\u2733\uFE0F;eight_pointed_black_star:\u2734\uFE0F;heart_decoration:\uD83D\uDC9F;vs:\uD83C\uDD9A;vibration_mode:\uD83D\uDCF3;mobile_phone_off:\uD83D\uDCF4;chart:\uD83D\uDCB9;currency_exchange:\uD83D\uDCB1;aries:\u2648\uFE0F;taurus:\u2649\uFE0F;gemini:\u264A\uFE0F;cancer:\u264B\uFE0F;leo:\u264C\uFE0F;virgo:\u264D\uFE0F;libra:\u264E\uFE0F;scorpius:\u264F\uFE0F;",
            "sagittarius:\u2650\uFE0F;capricorn:\u2651\uFE0F;aquarius:\u2652\uFE0F;pisces:\u2653\uFE0F;ophiuchus:\u26CE;six_pointed_star:\uD83D\uDD2F;negative_squared_cross_mark:\u274E;a:\uD83C\uDD70\uFE0F;b:\uD83C\uDD71\uFE0F;ab:\uD83C\uDD8E;o2:\uD83C\uDD7E\uFE0F;diamond_shape_with_a_dot_inside:\uD83D\uDCA0;recycle:\u267B\uFE0F;end:\uD83D\uDD1A;on:\uD83D\uDD1B;soon:\uD83D\uDD1C;clock1:\uD83D\uDD50;clock130:\uD83D\uDD5C;clock10:\uD83D\uDD59;clock1030:\uD83D\uDD65;clock11:\uD83D\uDD5A;clock1130:\uD83D\uDD66;clock12:\uD83D\uDD5B;clock1230:\uD83D\uDD67;clock2:\uD83D\uDD51;clock230:\uD83D\uDD5D;clock3:\uD83D\uDD52;clock330:\uD83D\uDD5E;clock4:\uD83D\uDD53;clock430:\uD83D\uDD5F;clock5:\uD83D\uDD54;clock530:\uD83D\uDD60;clock6:\uD83D\uDD55;clock630:\uD83D\uDD61;clock7:\uD83D\uDD56;clock730:\uD83D\uDD62;clock8:\uD83D\uDD57;clock830:\uD83D\uDD63;clock9:\uD83D\uDD58;clock930:\uD83D\uDD64;heavy_dollar_sign:\uD83D\uDCB2;copyright:\xa9\uFE0F;registered:\xae\uFE0F;tm:\u2122\uFE0F;x:\u274C;heavy_exclamation_mark:\u2757\uFE0F;bangbang:\u203C\uFE0F;interrobang:\u2049\uFE0F;o:\u2B55\uFE0F;heavy_multiplication_x:\u2716\uFE0F;",
            "heavy_plus_sign:\u2795;heavy_minus_sign:\u2796;heavy_division_sign:\u2797;white_flower:\uD83D\uDCAE;100:\uD83D\uDCAF;heavy_check_mark:\u2714\uFE0F;ballot_box_with_check:\u2611\uFE0F;radio_button:\uD83D\uDD18;link:\uD83D\uDD17;curly_loop:\u27B0;wavy_dash:\u3030\uFE0F;part_alternation_mark:\u303D\uFE0F;trident:\uD83D\uDD31;black_square::black_square:;white_square::white_square:;white_check_mark:\u2705;black_square_button:\uD83D\uDD32;white_square_button:\uD83D\uDD33;black_circle:\u26AB\uFE0F;white_circle:\u26AA\uFE0F;red_circle:\uD83D\uDD34;large_blue_circle:\uD83D\uDD35;large_blue_diamond:\uD83D\uDD37;large_orange_diamond:\uD83D\uDD36;small_blue_diamond:\uD83D\uDD39;small_orange_diamond:\uD83D\uDD38;small_red_triangle:\uD83D\uDD3A;small_red_triangle_down:\uD83D\uDD3B"
        ];
        var matRE = /([-\w]+:)([^;]+);/g;
        var t;
        for(var i = 0; i < parts.length; i++){
            matRE.lastIndex = 0;
            while(t = matRE.exec(parts[i]))dest[':' + t[1]] = t[2];
        }
    })(exports1.defaultDict);
}); //#endregion

});

parcelRegister("2qsXv", function(module, exports) {




// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Fold and render embedded HTML snippets
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("j53Ua")), (parcelRequire("1UVd0")));
})(function(require1, exports1, CodeMirror, core_1, fold_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.defaultChecker = function(html) {
        // TODO: read https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
        if (/^<(?:br)/i.test(html)) return false; // check first element...
        if (/<(?:script|style|link|meta)/i.test(html)) return false; // don't allow some tags
        if (/\son\w+\s*=/i.test(html)) return false; // don't allow `onclick=` etc.
        if (/src\s*=\s*["']?javascript:/i.test(html)) return false; // don't allow `src="javascript:` etc.
        return true;
    };
    /**
     * Create HTMLElement from HTML string and do special process with HyperMD.ReadLink
     */ exports1.defaultRenderer = function(html, pos, cm) {
        var tagBegin = /^<(\w+)\s*/.exec(html);
        if (!tagBegin) return null;
        var tagName = tagBegin[1];
        var ans = document.createElement(tagName);
        var propRE = /([\w\:\-]+)(?:\s*=\s*((['"]).*?\3|\S+))?\s*/g;
        var propLastIndex = propRE.lastIndex = tagBegin[0].length;
        var tmp;
        while(tmp = propRE.exec(html)){
            if (tmp.index > propLastIndex) break; // emmm
            var propName = tmp[1];
            var propValue = tmp[2]; // could be wrapped by " or '
            if (propValue && /^['"]/.test(propValue)) propValue = propValue.slice(1, -1);
            ans.setAttribute(propName, propValue);
            propLastIndex = propRE.lastIndex;
        }
        if ('innerHTML' in ans) {
            // node may contain innerHTML
            var startCh = html.indexOf('>', propLastIndex) + 1;
            var endCh = html.length;
            if (tmp = new RegExp("</" + tagName + "\\s*>\\s*$", "i").exec(html)) endCh = tmp.index;
            var innerHTML = html.slice(startCh, endCh);
            if (innerHTML) ans.innerHTML = innerHTML;
            // resolve relative URLs and change default behavoirs
            core_1.visitElements([
                ans
            ], function(el) {
                var tagName = el.tagName.toLowerCase();
                if (tagName === 'a') // for links, if target not set, add target="_blank"
                {
                    if (!el.getAttribute("target")) el.setAttribute("target", "_blank");
                }
                // Then, resovle relative URLs
                var urlAttrs = {
                    a: [
                        "href"
                    ],
                    img: [
                        "src"
                    ],
                    iframe: [
                        "src"
                    ]
                }[tagName];
                if (urlAttrs) for(var i = 0; i < urlAttrs.length; i++){
                    var attr = urlAttrs[i];
                    var attrValue = el.getAttribute(attr);
                    if (attrValue) el.setAttribute(attr, cm.hmdResolveURL(attrValue));
                }
            });
        }
        return ans;
    };
    /********************************************************************************** */ var stubClass = "hmd-fold-html-stub";
    var stubClassOmittable = "hmd-fold-html-stub omittable";
    var stubClassHighlight = "hmd-fold-html-stub highlight";
    /********************************************************************************** */ //#region Folder
    /**
     * Detect if a token is a beginning of HTML, and fold it!
     *
     * @see FolderFunc in ./fold.ts
     */ exports1.HTMLFolder = function(stream, token) {
        if (!token.type || !/ hmd-html-begin/.test(token.type)) return null;
        var endInfo = stream.findNext(/ hmd-html-\w+/, true); // find next html start/end token
        if (!endInfo || !/ hmd-html-end/.test(endInfo.token.type) || / hmd-html-unclosed/.test(endInfo.token.type)) return null;
        var cm = stream.cm;
        var from = {
            line: stream.lineNo,
            ch: token.start
        };
        var to = {
            line: endInfo.lineNo,
            ch: endInfo.token.end
        };
        var inlineMode = from.ch != 0 || to.ch < cm.getLine(to.line).length;
        // if (!inlineMode) {
        //   // if not inline mode, be greddy and eat following blank lines (except last line of editor)!
        //   let lastLine: number = cm.lastLine() - 1
        //   let allowCount: number = 1
        //   while (allowCount > 0 && to.line < lastLine) {
        //     let nextLine: string = cm.getLine(to.line + 1)
        //     if (!/^\s*$/.test(nextLine)) break
        //     to.line++
        //     to.ch = nextLine.length
        //     allowCount--
        //   }
        // }
        var addon = exports1.getAddon(cm);
        var html = cm.getRange(from, to);
        if (!addon.checker(html, from, cm)) return null; // security check
        // security check pass!
        var reqAns = stream.requestRange(from, to);
        if (reqAns !== fold_1.RequestRangeResult.OK) return null;
        // now we are ready to fold and render!
        var marker = addon.renderAndInsert(html, from, to, inlineMode);
        return marker;
    };
    //#endregion
    fold_1.registerFolder("html", exports1.HTMLFolder, false);
    exports1.defaultOption = {
        checker: exports1.defaultChecker,
        renderer: exports1.defaultRenderer,
        stubText: "<HTML>",
        isolatedTagName: /^(?:div|pre|form|table|iframe|ul|ol|input|textarea|p|summary|a)$/i
    };
    exports1.suggestedOption = {};
    core_1.suggestedEditorConfig.hmdFoldHTML = exports1.suggestedOption;
    CodeMirror.defineOption("hmdFoldHTML", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal) newVal = {};
        else if (typeof newVal == 'function') newVal = {
            checker: newVal
        };
        else if (typeof newVal != 'object') {
            console.warn('[HyperMD][FoldHTML] incorrect option value type');
            newVal = {};
        }
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
        ///// Type Check
        if (inst.isolatedTagName && !(inst.isolatedTagName instanceof RegExp)) {
            console.error("[HyperMD][FoldHTML] option isolatedTagName only accepts RegExp");
            inst.isolatedTagName = exports1.defaultOption.isolatedTagName;
        }
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var FoldHTML = /** @class */ function() {
        function FoldHTML(cm) {
            this.cm = cm;
        // options will be initialized to defaultOption when constructor is finished
        }
        /**
         * Render HTML, insert into editor and return the marker
         */ FoldHTML.prototype.renderAndInsert = function(html, from, to, inlineMode) {
            var cm = this.cm;
            var stub = this.makeStub();
            var el = this.renderer(html, from, cm);
            var breakFn = function() {
                return fold_1.breakMark(cm, marker);
            };
            if (!el) return null;
            stub.addEventListener("click", breakFn, false);
            if (!el.tagName.match(this.isolatedTagName || /^$/)) el.addEventListener("click", breakFn, false);
            var replacedWith;
            var marker;
            if (inlineMode) {
                /** put HTML inline */ var span = document.createElement("span");
                span.setAttribute("class", "hmd-fold-html");
                span.setAttribute("style", "display: inline-block");
                span.appendChild(stub);
                span.appendChild(el);
                replacedWith = span;
                /** If element size changed, we notify CodeMirror */ var watcher = core_1.watchSize(el, function(w, h) {
                    var computedStyle = getComputedStyle(el);
                    var getStyle = function(name) {
                        return computedStyle.getPropertyValue(name);
                    };
                    var floating = w < 10 || h < 10 || !/^relative|static$/i.test(getStyle('position')) || !/^none$/i.test(getStyle('float'));
                    if (!floating) stub.className = stubClassOmittable;
                    else stub.className = stubClass;
                    marker.changed();
                });
                watcher.check(); // trig the checker once
                // Marker is not created yet. Bind events later
                setTimeout(function() {
                    marker.on("clear", function() {
                        watcher.stop();
                    });
                }, 0);
            } else {
                /** use lineWidget to insert element */ replacedWith = stub;
                var lineWidget_1 = cm.addLineWidget(to.line, el, {
                    above: false,
                    coverGutter: false,
                    noHScroll: false,
                    showIfHidden: false
                });
                var highlightON_1 = function() {
                    return stub.className = stubClassHighlight;
                };
                var highlightOFF_1 = function() {
                    return stub.className = stubClass;
                };
                el.addEventListener("mouseenter", highlightON_1, false);
                el.addEventListener("mouseleave", highlightOFF_1, false);
                var watcher = core_1.watchSize(el, function() {
                    return lineWidget_1.changed();
                });
                watcher.check();
                // Marker is not created yet. Bind events later
                setTimeout(function() {
                    marker.on("clear", function() {
                        watcher.stop();
                        lineWidget_1.clear();
                        el.removeEventListener("mouseenter", highlightON_1, false);
                        el.removeEventListener("mouseleave", highlightOFF_1, false);
                    });
                }, 0);
            }
            marker = cm.markText(from, to, {
                replacedWith: replacedWith
            });
            return marker;
        };
        FoldHTML.prototype.makeStub = function() {
            var ans = document.createElement('span');
            ans.setAttribute("class", stubClass);
            ans.textContent = this.stubText || '<HTML>';
            return ans;
        };
        return FoldHTML;
    }();
    exports1.FoldHTML = FoldHTML;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one FoldHTML instance */ exports1.getAddon = core_1.Addon.Getter("FoldHTML", FoldHTML, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("1h5Fv", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Align Table Columns
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.defaultOption = {
        enabled: false
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdTableAlign = exports1.suggestedOption;
    core_1.normalVisualConfig.hmdTableAlign = false;
    CodeMirror.defineOption("hmdTableAlign", exports1.defaultOption, function(cm, newVal) {
        var enabled = !!newVal;
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!enabled || typeof newVal === "boolean") newVal = {
            enabled: enabled
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var TableAlign = /** @class */ function() {
        function TableAlign(cm) {
            // options will be initialized to defaultOption (if exists)
            // add your code here
            var _this = this;
            this.cm = cm;
            this.styleEl = document.createElement("style");
            /**
             * Remeasure visible columns, update CSS style to make columns aligned
             *
             * (This is a debounced function)
             */ this.updateStyle = core_1.debounce(function() {
                if (!_this.enabled) return;
                var cm = _this.cm;
                var measures = _this.measure();
                var css = _this.makeCSS(measures);
                if (css === _this._lastCSS) return;
                _this.styleEl.textContent = _this._lastCSS = css;
                cm.refresh();
            }, 100);
            /** CodeMirror renderLine event handler */ this._procLine = function(cm, line, el) {
                if (!el.querySelector('.cm-hmd-table-sep')) return;
                var lineSpan = el.firstElementChild;
                var lineSpanChildren = Array.prototype.slice.call(lineSpan.childNodes, 0);
                var eolState = cm.getStateAfter(line.lineNo());
                var columnStyles = eolState.hmdTableColumns;
                var tableID = eolState.hmdTableID;
                var columnIdx = eolState.hmdTable === 2 /* NORMAL */  ? -1 : 0;
                var columnSpan = _this.makeColumn(columnIdx, columnStyles[columnIdx] || "dummy", tableID);
                var columnContentSpan = columnSpan.firstElementChild;
                for(var _i = 0, lineSpanChildren_1 = lineSpanChildren; _i < lineSpanChildren_1.length; _i++){
                    var el_1 = lineSpanChildren_1[_i];
                    var elClass = el_1.nodeType === Node.ELEMENT_NODE && el_1.className || "";
                    if (/cm-hmd-table-sep/.test(elClass)) {
                        // found a "|", and a column is finished
                        columnIdx++;
                        columnSpan.appendChild(columnContentSpan);
                        lineSpan.appendChild(columnSpan);
                        lineSpan.appendChild(el_1);
                        columnSpan = _this.makeColumn(columnIdx, columnStyles[columnIdx] || "dummy", tableID);
                        columnContentSpan = columnSpan.firstElementChild;
                    } else columnContentSpan.appendChild(el_1);
                }
                columnSpan.appendChild(columnContentSpan);
                lineSpan.appendChild(columnSpan);
            };
            new core_1.FlipFlop(/* ON  */ function() {
                cm.on("renderLine", _this._procLine);
                cm.on("update", _this.updateStyle);
                cm.refresh();
                document.head.appendChild(_this.styleEl);
            }, /* OFF */ function() {
                cm.off("renderLine", _this._procLine);
                cm.off("update", _this.updateStyle);
                document.head.removeChild(_this.styleEl);
            }).bind(this, "enabled", true);
        }
        /**
         * create a <span> container as column,
         * note that put content into column.firstElementChild
         */ TableAlign.prototype.makeColumn = function(index, style, tableID) {
            var span = document.createElement("span");
            span.className = "hmd-table-column hmd-table-column-" + index + " hmd-table-column-" + style;
            span.setAttribute("data-column", "" + index);
            span.setAttribute("data-table-id", tableID);
            var span2 = document.createElement("span");
            span2.className = "hmd-table-column-content";
            span2.setAttribute("data-column", "" + index);
            span.appendChild(span2);
            return span;
        };
        /** Measure all visible tables and columns */ TableAlign.prototype.measure = function() {
            var cm = this.cm;
            var lineDiv = cm.display.lineDiv; // contains every <pre> line
            var contentSpans = lineDiv.querySelectorAll(".hmd-table-column-content");
            /** every table's every column's width in px */ var ans = {};
            for(var i = 0; i < contentSpans.length; i++){
                var contentSpan = contentSpans[i];
                var column = contentSpan.parentElement;
                var tableID = column.getAttribute("data-table-id");
                var columnIdx = ~~column.getAttribute("data-column");
                var width = contentSpan.offsetWidth + 1; // +1 because browsers turn 311.3 into 312
                if (!(tableID in ans)) ans[tableID] = [];
                var columnWidths = ans[tableID];
                while(columnWidths.length <= columnIdx)columnWidths.push(0);
                if (columnWidths[columnIdx] < width) columnWidths[columnIdx] = width;
            }
            return ans;
        };
        /** Generate CSS */ TableAlign.prototype.makeCSS = function(measures) {
            var rules = [];
            for(var tableID in measures){
                var columnWidths = measures[tableID];
                var rulePrefix = "pre.HyperMD-table-row.HyperMD-table_" + tableID + " .hmd-table-column-";
                for(var columnIdx = 0; columnIdx < columnWidths.length; columnIdx++){
                    var width = columnWidths[columnIdx];
                    rules.push("" + rulePrefix + columnIdx + " { min-width: " + (width + .5) + "px }");
                }
            }
            return rules.join("\n");
        };
        return TableAlign;
    }();
    exports1.TableAlign = TableAlign;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one TableAlign instance */ exports1.getAddon = core_1.Addon.Getter("TableAlign", TableAlign, exports1.defaultOption);
});

});

parcelRegister("3iGBY", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Load code highlighting modes (aka. profiles) automatically
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("4ehgN")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    exports1.defaultOption = {
        source: null
    };
    exports1.suggestedOption = {
        source: typeof requirejs === 'function' ? "~codemirror/" : "https://cdn.jsdelivr.net/npm/codemirror/"
    };
    core_1.suggestedEditorConfig.hmdModeLoader = exports1.suggestedOption;
    CodeMirror.defineOption("hmdModeLoader", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            source: newVal && exports1.suggestedOption.source || null
        };
        else if (typeof newVal === "string" || typeof newVal === "function") newVal = {
            source: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var ModeLoader = /** @class */ function() {
        function ModeLoader(cm) {
            // options will be initialized to defaultOption when constructor is finished
            // add your code here
            var _this = this;
            this.cm = cm;
            this._loadingModes = {};
            /**
             * CodeMirror "renderLine" event handler
             */ this.rlHandler = function(cm, line) {
                var lineNo = line.lineNo();
                var text = line.text || "", mat = text.match(/^```\s*(\S+)/);
                if (mat) {
                    var lang = mat[1];
                    var modeInfo = CodeMirror.findModeByName(lang);
                    var modeName = modeInfo && modeInfo.mode;
                    if (modeName && !(modeName in CodeMirror.modes)) // a not-loaded mode is found!
                    // now we shall load mode `modeName`
                    _this.startLoadMode(modeName, lineNo);
                }
            };
            new core_1.FlipFlop() // use FlipFlop to detect if a option is changed
            .bind(this, "source").ON(function() {
                cm.on("renderLine", _this.rlHandler);
            }).OFF(function() {
                cm.off("renderLine", _this.rlHandler);
            });
        }
        /** trig a "change" event on one line */ ModeLoader.prototype.touchLine = function(lineNo) {
            var line = this.cm.getLineHandle(lineNo);
            var lineLen = line.text.length;
            this.cm.replaceRange(line.text.charAt(lineLen - 1), {
                line: lineNo,
                ch: lineLen - 1
            }, {
                line: lineNo,
                ch: lineLen
            });
        };
        /**
         * load a mode, then refresh editor
         *
         * @param  mode
         * @param  line >=0 : add into waiting queue    <0 : load and retry up to `-line` times
         */ ModeLoader.prototype.startLoadMode = function(mode, line) {
            var linesWaiting = this._loadingModes;
            var self = this;
            if (line >= 0 && mode in linesWaiting) {
                linesWaiting[mode].push(line);
                return;
            }
            // start load a mode
            if (line >= 0) linesWaiting[mode] = [
                line
            ];
            var successCb = function() {
                console.log("[HyperMD] mode-loader loaded " + mode);
                var lines = linesWaiting[mode];
                self.cm.operation(function() {
                    for(var i = 0; i < lines.length; i++)self.touchLine(lines[i]);
                });
                delete linesWaiting[mode];
            };
            var errorCb = function() {
                console.warn("[HyperMD] mode-loader failed to load mode " + mode + " from ", url);
                if (line === -1) // no more chance
                return;
                console.log("[HyperMD] mode-loader will retry loading " + mode);
                setTimeout(function() {
                    self.startLoadMode(mode, line >= 0 ? -3 : line + 1);
                }, 1000);
            };
            if (typeof this.source === "function") {
                this.source(mode, successCb, errorCb);
                return;
            }
            var url = this.source + "mode/" + mode + "/" + mode + ".js";
            if (typeof requirejs === 'function' && url.charAt(0) === "~") // require.js
            requirejs([
                url.slice(1, -3)
            ], successCb);
            else {
                // trandition loadScript
                var script = document.createElement('script');
                script.onload = successCb;
                script.onerror = errorCb;
                script.src = url;
                document.head.appendChild(script);
            }
        };
        return ModeLoader;
    }();
    exports1.ModeLoader = ModeLoader;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one ModeLoader instance */ exports1.getAddon = core_1.Addon.Getter("ModeLoader", ModeLoader, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("0ct6M", function(module, exports) {




// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: Auto show/hide markdown tokens like `##` or `*`
//
// Only works with `hypermd` mode, require special CSS rules
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")), (parcelRequire("dU2vF")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1, cm_utils_1, line_spans_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var DEBUG = false;
    //#region Internal Function...
    /** check if has the class and remove it */ function rmClass(el, className) {
        var c = ' ' + el.className + ' ', cnp = ' ' + className + ' ';
        if (c.indexOf(cnp) === -1) return false;
        el.className = c.replace(cnp, '').trim();
        return true;
    }
    /** check if NOT has the class and add it */ function addClass(el, className) {
        var c = ' ' + el.className + ' ', cnp = ' ' + className + ' ';
        if (c.indexOf(cnp) !== -1) return false;
        el.className = el.className + ' ' + className;
        return true;
    }
    exports1.defaultOption = {
        enabled: false,
        line: true,
        tokenTypes: "em|strong|strikethrough|code|linkText|task".split("|")
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdHideToken = exports1.suggestedOption;
    core_1.normalVisualConfig.hmdHideToken = false;
    CodeMirror.defineOption("hmdHideToken", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            enabled: !!newVal
        };
        else if (typeof newVal === "string") newVal = {
            enabled: true,
            tokenTypes: newVal.split("|")
        };
        else if (newVal instanceof Array) newVal = {
            enabled: true,
            tokenTypes: newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var hideClassName = "hmd-hidden-token";
    var lineInactiveClassName = "hmd-inactive-line";
    var HideToken = /** @class */ function() {
        function HideToken(cm) {
            var _this = this;
            this.cm = cm;
            this.renderLineHandler = function(cm, line, el) {
                // TODO: if we procLine now, we can only get the outdated lineView, lineViewMeasure and lineViewMap. Calling procLine will be wasteful!
                var changed = _this.procLine(line, el);
                if (DEBUG) console.log("renderLine return " + changed);
            };
            this.cursorActivityHandler = function(doc) {
                _this.update();
            };
            this.update = core_1.debounce(function() {
                return _this.updateImmediately();
            }, 100);
            /** Current user's selections, in each line */ this._rangesInLine = {};
            new core_1.FlipFlop(/* ON  */ function() {
                cm.on("cursorActivity", _this.cursorActivityHandler);
                cm.on("renderLine", _this.renderLineHandler);
                cm.on("update", _this.update);
                _this.update();
                cm.refresh();
            }, /* OFF */ function() {
                cm.off("cursorActivity", _this.cursorActivityHandler);
                cm.off("renderLine", _this.renderLineHandler);
                cm.off("update", _this.update);
                _this.update.stop();
                cm.refresh();
            }).bind(this, "enabled", true);
        }
        /**
         * hide/show <span>s in one line, based on `this._rangesInLine`
         * @returns line changed or not
         */ HideToken.prototype.procLine = function(line, pre) {
            var cm = this.cm;
            var lineNo = typeof line === 'number' ? line : line.lineNo();
            if (typeof line === 'number') line = cm.getLineHandle(line);
            var rangesInLine = this._rangesInLine[lineNo] || [];
            var lv = core_1.cm_internal.findViewForLine(cm, lineNo);
            if (!lv || lv.hidden || !lv.measure) return false;
            if (!pre) pre = lv.text;
            if (!pre) return false;
            if (DEBUG) {
                if (!pre.isSameNode(lv.text)) console.warn("procLine got different node... " + lineNo);
            }
            var mapInfo = core_1.cm_internal.mapFromLineView(lv, line, lineNo);
            var map = mapInfo.map;
            var nodeCount = map.length / 3;
            var changed = false;
            // change line status
            if (rangesInLine.length === 0) {
                if (addClass(pre, lineInactiveClassName)) changed = true;
            } else if (rmClass(pre, lineInactiveClassName)) changed = true;
            // show or hide tokens
            /**
             * @returns if there are Span Nodes changed
             */ function changeVisibilityForSpan(span, shallHideTokens, iNodeHint) {
                var changed = false;
                iNodeHint = iNodeHint || 0;
                // iterate the map
                for(var i = iNodeHint; i < nodeCount; i++){
                    var begin = map[i * 3], end = map[i * 3 + 1];
                    var domNode = map[i * 3 + 2];
                    if (begin === span.head.start) {
                        // find the leading token!
                        if (/formatting-/.test(span.head.type) && domNode.nodeType === Node.TEXT_NODE) {
                            // if (DEBUG) console.log("DOMNODE", shallHideTokens, domNode, begin, span)
                            // good. this token can be changed
                            var domParent = domNode.parentElement;
                            if (shallHideTokens ? addClass(domParent, hideClassName) : rmClass(domParent, hideClassName)) // if (DEBUG) console.log("HEAD DOM CHANGED")
                            changed = true;
                        }
                        //FIXME: if leading formatting token is separated into two, the latter will not be hidden/shown!
                        // search for the tailing token
                        if (span.tail && /formatting-/.test(span.tail.type)) for(var j = i + 1; j < nodeCount; j++){
                            var begin_1 = map[j * 3], end_1 = map[j * 3 + 1];
                            var domNode_1 = map[j * 3 + 2];
                            if (begin_1 == span.tail.start) // if (DEBUG) console.log("TAIL DOM CHANGED", domNode)
                            {
                                if (domNode_1.nodeType === Node.TEXT_NODE) {
                                    // good. this token can be changed
                                    var domParent = domNode_1.parentElement;
                                    if (shallHideTokens ? addClass(domParent, hideClassName) : rmClass(domParent, hideClassName)) changed = true;
                                }
                            }
                            if (begin_1 >= span.tail.end) break;
                        }
                    }
                    // whoops, next time we can start searching since here
                    // return the hint value
                    if (begin >= span.begin) break;
                }
                return changed;
            }
            var spans = line_spans_1.getLineSpanExtractor(cm).extract(lineNo);
            var iNodeHint = 0;
            for(var iSpan = 0; iSpan < spans.length; iSpan++){
                var span = spans[iSpan];
                if (this.tokenTypes.indexOf(span.type) === -1) continue; // not-interested span type
                /* TODO: Use AST, instead of crafted Position */ var spanRange = [
                    {
                        line: lineNo,
                        ch: span.begin
                    },
                    {
                        line: lineNo,
                        ch: span.end
                    }
                ];
                /* TODO: If use AST, compute `spanBeginCharInCurrentLine` in another way */ var spanBeginCharInCurrentLine = span.begin;
                while(iNodeHint < nodeCount && map[iNodeHint * 3 + 1] < spanBeginCharInCurrentLine)iNodeHint++;
                var shallHideTokens = true;
                for(var iLineRange = 0; iLineRange < rangesInLine.length; iLineRange++){
                    var userRange = rangesInLine[iLineRange];
                    if (cm_utils_1.rangesIntersect(spanRange, userRange)) {
                        shallHideTokens = false;
                        break;
                    }
                }
                if (changeVisibilityForSpan(span, shallHideTokens, iNodeHint)) changed = true;
            }
            // finally clean the cache (if needed) and report the result
            if (changed) {
                // clean CodeMirror measure cache
                delete lv.measure.heights;
                lv.measure.cache = {};
            }
            return changed;
        };
        HideToken.prototype.updateImmediately = function() {
            var _this = this;
            this.update.stop();
            var cm = this.cm;
            var selections = cm.listSelections();
            var caretAtLines = {};
            var activedLines = {};
            var lastActivedLines = this._rangesInLine;
            // update this._activedLines and caretAtLines
            for(var _i = 0, selections_1 = selections; _i < selections_1.length; _i++){
                var selection = selections_1[_i];
                var oRange = cm_utils_1.orderedRange(selection);
                var line0 = oRange[0].line, line1 = oRange[1].line;
                caretAtLines[line0] = caretAtLines[line1] = true;
                for(var line = line0; line <= line1; line++)if (!activedLines[line]) activedLines[line] = [
                    oRange
                ];
                else activedLines[line].push(oRange);
            }
            this._rangesInLine = activedLines;
            if (DEBUG) console.log("======= OP START " + Object.keys(activedLines));
            cm.operation(function() {
                // adding "inactive" class
                for(var line in lastActivedLines){
                    if (activedLines[line]) continue; // line is still active. do nothing
                    _this.procLine(~~line); // or, try adding "inactive" class to the <pre>s
                }
                var caretLineChanged = false;
                // process active lines
                for(var line in activedLines){
                    var lineChanged = _this.procLine(~~line);
                    if (lineChanged && caretAtLines[line]) caretLineChanged = true;
                }
                // refresh cursor position if needed
                if (caretLineChanged) {
                    if (DEBUG) console.log("caretLineChanged");
                    cm.refresh();
                // legacy unstable way to update display and caret position:
                // updateCursorDisplay(cm, true)
                // if (cm.hmd.TableAlign && cm.hmd.TableAlign.enabled) cm.hmd.TableAlign.updateStyle()
                }
            });
            if (DEBUG) console.log("======= OP END ");
        };
        return HideToken;
    }();
    exports1.HideToken = HideToken;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one HideToken instance */ exports1.getAddon = core_1.Addon.Getter("HideToken", HideToken, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("gWrVL", function(module, exports) {


// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// DESCRIPTION: A workaround for cheap and unstable mouses.
//
// When a user clicks to move the cursor, releasing mouse button,
// the user's hand might shake and an unexcepted selection will be made.
// This addon suppresses the shake.
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    /********************************************************************************** */ // Some parameter LGTM
    var silenceDuration = 100, distance = 5;
    exports1.defaultOption = {
        enabled: false
    };
    exports1.suggestedOption = {
        enabled: true
    };
    core_1.suggestedEditorConfig.hmdCursorDebounce = exports1.suggestedOption;
    CodeMirror.defineOption("hmdCursorDebounce", exports1.defaultOption, function(cm, newVal) {
        ///// convert newVal's type to `Partial<Options>`, if it is not.
        if (!newVal || typeof newVal === "boolean") newVal = {
            enabled: !!newVal
        };
        ///// apply config and write new values into cm
        var inst = exports1.getAddon(cm);
        for(var k in exports1.defaultOption)inst[k] = k in newVal ? newVal[k] : exports1.defaultOption[k];
    });
    //#endregion
    /********************************************************************************** */ //#region Addon Class
    var CursorDebounce = /** @class */ function() {
        function CursorDebounce(cm) {
            var _this = this;
            this.cm = cm;
            this.mouseDownHandler = function(cm, ev) {
                _this.lastX = ev.clientX;
                _this.lastY = ev.clientY;
                var supressor = _this.mouseMoveSuppress;
                document.addEventListener("mousemove", supressor, true);
                if (_this.lastTimeout) clearTimeout(_this.lastTimeout);
                _this.lastTimeout = setTimeout(function() {
                    document.removeEventListener("mousemove", supressor, true);
                    _this.lastTimeout = null;
                }, silenceDuration);
            };
            this.mouseMoveSuppress = function(ev) {
                if (Math.abs(ev.clientX - _this.lastX) <= distance && Math.abs(ev.clientY - _this.lastY) <= distance) ev.stopPropagation();
            };
            new core_1.FlipFlop(/* ON  */ function() {
                cm.on('mousedown', _this.mouseDownHandler);
            }, /* OFF */ function() {
                cm.off('mousedown', _this.mouseDownHandler);
            }).bind(this, "enabled", true);
        }
        return CursorDebounce;
    }();
    exports1.CursorDebounce = CursorDebounce;
    //#endregion
    /** ADDON GETTER (Singleton Pattern): a editor can have only one CursorDebounce instance */ exports1.getAddon = core_1.Addon.Getter("CursorDebounce", CursorDebounce, exports1.defaultOption /** if has options */ );
});

});

parcelRegister("8Rmc8", function(module, exports) {



// HyperMD, copyright (c) by laobubu
// Distributed under an MIT license: http://laobubu.net/HyperMD/LICENSE
//
// powerful keymap for HyperMD and Markdown modes
//
(function(mod) {
    mod(null, module.exports, (parcelRequire("aYIk2")), (parcelRequire("aYIk2")), (parcelRequire("dU2vF")));
})(function(require1, exports1, CodeMirror, codemirror_1, core_1) {
    "use strict";
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    var _a;
    /**
      Some codes in this files are from CodeMirror's source code.
    
      CodeMirror, copyright (c) by Marijn Haverbeke and others
      MIT license: http://codemirror.net/LICENSE
    
      @see codemirror\addon\edit\continuelist.js
     */ // loq = List Or Quote
    var LoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]\s|[*+-]\s|(\d+)([.)]))(\s*)/, emptyLoQRE = /^(\s*)(>[> ]*|[*+-] \[[x ]\]|[*+-]|(\d+)[.)])(\s*)$/, unorderedListRE = /[*+-]\s/;
    var ListRE = /^(\s*)([*+-]\s|(\d+)([.)]))(\s*)/;
    var isRealTableSep = function(token) {
        return /hmd-table-sep/.test(token.type) && !/hmd-table-sep-dummy/.test(token.type);
    };
    /**
     * continue list / quote / insert table row
     * start a table
     */ function newlineAndContinue(cm) {
        if (cm.getOption("disableInput")) return CodeMirror.Pass;
        var selections = cm.listSelections();
        var replacements = [];
        for(var _i = 0, selections_1 = selections; _i < selections_1.length; _i++){
            var range = selections_1[_i];
            var pos = range.head;
            var rangeEmpty = range.empty();
            var eolState = cm.getStateAfter(pos.line);
            var line = cm.getLine(pos.line);
            var handled = false;
            if (!handled) {
                var inList = eolState.list !== false;
                var inQuote = eolState.quote;
                var match = LoQRE.exec(line);
                var cursorBeforeBullet = /^\s*$/.test(line.slice(0, pos.ch));
                if (rangeEmpty && (inList || inQuote) && match && !cursorBeforeBullet) {
                    handled = true;
                    if (emptyLoQRE.test(line)) {
                        if (!/>\s*$/.test(line)) cm.replaceRange("", {
                            line: pos.line,
                            ch: 0
                        }, {
                            line: pos.line,
                            ch: pos.ch + 1
                        });
                        replacements.push("\n");
                    } else {
                        var indent = match[1], after = match[5];
                        var numbered = !(unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0);
                        var bullet = numbered ? parseInt(match[3], 10) + 1 + match[4] : match[2].replace("x", " ");
                        replacements.push("\n" + indent + bullet + after);
                        if (numbered) incrementRemainingMarkdownListNumbers(cm, pos);
                    }
                }
            }
            if (!handled) {
                var table = rangeEmpty ? eolState.hmdTable : 0 /* NONE */ ;
                if (table != 0 /* NONE */ ) {
                    if (/^[\s\|]+$/.test(line) && (pos.line === cm.lastLine() || cm.getStateAfter(pos.line + 1).hmdTable !== table)) {
                        // if this is last row and is empty
                        // remove this row and insert a new line
                        cm.setCursor({
                            line: pos.line,
                            ch: 0
                        });
                        cm.replaceRange("\n", {
                            line: pos.line,
                            ch: 0
                        }, {
                            line: pos.line,
                            ch: line.length
                        });
                    } else {
                        // insert a row below
                        var columns = eolState.hmdTableColumns;
                        var newline_1 = core_1.repeatStr("  |  ", columns.length - 1);
                        var leading = "\n";
                        if (table === 2 /* NORMAL */ ) {
                            leading += "| ";
                            newline_1 += " |";
                        }
                        // There are always nut users!
                        if (eolState.hmdTableRow == 0) cm.setCursor({
                            line: pos.line + 1,
                            ch: cm.getLine(pos.line + 1).length
                        });
                        else cm.setCursor({
                            line: pos.line,
                            ch: line.length
                        });
                        cm.replaceSelection(leading);
                        cm.replaceSelection(newline_1, "start");
                    }
                    handled = true;
                    return;
                } else if (rangeEmpty && pos.ch >= line.length && !eolState.code && !eolState.hmdInnerMode && /^\|.+\|.+\|$/.test(line)) {
                    // current line is   | this | format |
                    // let's make a table
                    var lineTokens = cm.getLineTokens(pos.line);
                    var ans = "|", ans2 = "|";
                    for(var i = 1; i < lineTokens.length; i++){
                        var token = lineTokens[i];
                        if (token.string === "|" && (!token.type || !token.type.trim().length)) {
                            ans += " ------- |";
                            ans2 += "   |";
                        }
                    }
                    // multi-cursor is meanless for this
                    // replacements.push("\n" + ans + "\n" + ans2 + "\n")
                    cm.setCursor({
                        line: pos.line,
                        ch: line.length
                    });
                    cm.replaceSelection("\n" + ans + "\n| ");
                    cm.replaceSelection(ans2.slice(1) + "\n", "start");
                    handled = true;
                    return;
                }
            }
            if (!handled) {
                if (rangeEmpty && line.slice(pos.ch - 2, pos.ch) == "$$" && /math-end/.test(cm.getTokenTypeAt(pos))) {
                    // ignore indentations of MathBlock Tex lines
                    replacements.push("\n");
                    handled = true;
                }
            }
            if (!handled) {
                cm.execCommand("newlineAndIndent");
                return;
            }
        }
        cm.replaceSelections(replacements);
    }
    exports1.newlineAndContinue = newlineAndContinue;
    /** insert "\n" , or if in list, insert "\n" + indentation */ function newline(cm) {
        if (cm.getOption("disableInput")) return CodeMirror.Pass;
        var selections = cm.listSelections();
        var replacements = core_1.repeat("\n", selections.length);
        for(var i = 0; i < selections.length; i++){
            var range = selections[i];
            var pos = range.head;
            var eolState = cm.getStateAfter(pos.line);
            if (eolState.list !== false) replacements[i] += core_1.repeatStr(" ", eolState.listStack.slice(-1)[0]);
        }
        cm.replaceSelections(replacements);
    }
    exports1.newline = newline;
    function killIndent(cm, lineNo, spaces) {
        if (!spaces || spaces < 0) return;
        var oldSpaces = /^ */.exec(cm.getLine(lineNo))[0].length;
        if (oldSpaces < spaces) spaces = oldSpaces;
        if (spaces > 0) cm.replaceRange("", {
            line: lineNo,
            ch: 0
        }, {
            line: lineNo,
            ch: spaces
        });
    }
    /** unindent or move cursor into prev table cell */ function shiftTab(cm) {
        var _a;
        var selections = cm.listSelections();
        var replacements = [];
        var tokenSeeker = new core_1.TokenSeeker(cm);
        for(var i = 0; i < selections.length; i++){
            var range = selections[i];
            var left = range.head;
            var right = range.anchor;
            var rangeEmpty = range.empty();
            if (!rangeEmpty && codemirror_1.cmpPos(left, right) > 0) _a = [
                left,
                right
            ], right = _a[0], left = _a[1];
            else if (right === left) right = range.anchor = {
                ch: left.ch,
                line: left.line
            };
            var eolState = cm.getStateAfter(left.line);
            if (eolState.hmdTable) {
                tokenSeeker.setPos(left.line, left.ch);
                var isNormalTable = eolState.hmdTable === 2 /* NORMAL */ ; // leading and ending | is not omitted
                var line = left.line;
                var lineText = cm.getLine(line);
                var chStart = 0, chEnd = 0;
                var rightPipe = tokenSeeker.findPrev(isRealTableSep);
                if (rightPipe) {
                    var leftPipe = tokenSeeker.findPrev(isRealTableSep, rightPipe.i_token - 1);
                    chStart = leftPipe ? leftPipe.token.end : 0;
                    chEnd = rightPipe.token.start;
                    if (chStart == 0 && isNormalTable) chStart += lineText.match(/^\s*\|/)[0].length;
                } else {
                    if (eolState.hmdTableRow == 0) return; // no more row before
                    if (eolState.hmdTableRow == 2) line--; // skip row #1 (| ----- | ----- |)
                    line--;
                    lineText = cm.getLine(line);
                    tokenSeeker.setPos(line, lineText.length);
                    var leftPipe = tokenSeeker.findPrev(isRealTableSep);
                    chStart = leftPipe.token.end;
                    chEnd = lineText.length;
                    if (isNormalTable) chEnd -= lineText.match(/\|\s*$/)[0].length;
                }
                if (lineText.charAt(chStart) === " ") chStart += 1;
                if (chStart > 0 && lineText.substr(chStart - 1, 2) === ' |') chStart--;
                if (lineText.charAt(chEnd - 1) === " ") chEnd -= 1;
                cm.setSelection({
                    line: line,
                    ch: chStart
                }, {
                    line: line,
                    ch: chEnd
                });
                return;
            } else if (eolState.listStack.length > 0) {
                var lineNo = left.line;
                while(!ListRE.test(cm.getLine(lineNo))){
                    lineNo--;
                    var isList = cm.getStateAfter(lineNo).listStack.length > 0;
                    if (!isList) {
                        lineNo++;
                        break;
                    }
                }
                var lastLine = cm.lastLine();
                var tmp = void 0;
                for(; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++){
                    var listStack = cm.getStateAfter(lineNo).listStack;
                    var listLevel = listStack.length;
                    var spaces = 0;
                    if (listLevel == 1) // maybe user wants to trimLeft?
                    spaces = tmp[1].length;
                    else // make bullets right-aligned
                    spaces = listStack[listLevel - 1] - (listStack[listLevel - 2] || 0);
                    killIndent(cm, lineNo, spaces);
                    // if current list item is multi-line...
                    while(++lineNo <= lastLine){
                        if (/*corrupted */ cm.getStateAfter(lineNo).listStack.length !== listLevel) {
                            lineNo = Infinity;
                            break;
                        }
                        if (/*has bullet*/ ListRE.test(cm.getLine(lineNo))) {
                            lineNo--;
                            break;
                        }
                        killIndent(cm, lineNo, spaces);
                    }
                }
                return;
            }
        }
        cm.execCommand("indentLess");
    }
    exports1.shiftTab = shiftTab;
    /**
     * 1. for tables, move cursor into next table cell, and maybe insert a cell
     * 2.
     */ function tab(cm) {
        var _a;
        var selections = cm.listSelections();
        var beforeCur = [];
        var afterCur = [];
        var selected = [];
        var addIndentTo = {}; // {lineNo: stringIndent}
        var tokenSeeker = new core_1.TokenSeeker(cm);
        /** indicate previous 4 variable changed or not */ var flag0 = false, flag1 = false, flag2 = false, flag3 = true;
        function setBeforeCur(text) {
            beforeCur[i] = text;
            if (text) flag1 = true;
        }
        function setAfterCur(text) {
            afterCur[i] = text;
            if (text) flag2 = true;
        }
        function setSelected(text) {
            selected[i] = text;
            if (text) flag3 = true;
        }
        for(var i = 0; i < selections.length; i++){
            beforeCur[i] = afterCur[i] = selected[i] = "";
            var range = selections[i];
            var left = range.head;
            var right = range.anchor;
            var rangeEmpty = range.empty();
            if (!rangeEmpty && codemirror_1.cmpPos(left, right) > 0) _a = [
                left,
                right
            ], right = _a[0], left = _a[1];
            else if (right === left) right = range.anchor = {
                ch: left.ch,
                line: left.line
            };
            var eolState = cm.getStateAfter(left.line);
            var line = cm.getLine(left.line);
            if (eolState.hmdTable) {
                // yeah, we are inside a table
                flag0 = true; // cursor will move
                var isNormalTable = eolState.hmdTable === 2 /* NORMAL */ ;
                var columns = eolState.hmdTableColumns;
                tokenSeeker.setPos(left.line, left.ch);
                var nextCellLeft = tokenSeeker.findNext(isRealTableSep, tokenSeeker.i_token);
                if (!nextCellLeft) {
                    var lineSpan = eolState.hmdTableRow === 0 ? 2 : 1; // skip |---|---| line
                    if (left.line + lineSpan > cm.lastLine() || cm.getStateAfter(left.line + lineSpan).hmdTable != eolState.hmdTable) {
                        // insert a row after this line
                        left.ch = right.ch = line.length;
                        var newline_2 = core_1.repeatStr("  |  ", columns.length - 1);
                        // There are always nut users!
                        if (eolState.hmdTableRow === 0) {
                            right.line = left.line += 1;
                            right.ch = left.ch = cm.getLine(left.line).length;
                        }
                        if (isNormalTable) {
                            setBeforeCur("\n| ");
                            setAfterCur(newline_2 + " |");
                        } else {
                            setBeforeCur("\n");
                            setAfterCur(newline_2.trimRight());
                        }
                        setSelected("");
                    } else {
                        // move cursor to next line, first cell
                        right.line = left.line += lineSpan;
                        tokenSeeker.setPos(left.line, 0);
                        var line_1 = tokenSeeker.line.text;
                        var dummySep = isNormalTable && tokenSeeker.findNext(/hmd-table-sep-dummy/, 0);
                        var nextCellRight = tokenSeeker.findNext(/hmd-table-sep/, dummySep ? dummySep.i_token + 1 : 1);
                        left.ch = dummySep ? dummySep.token.end : 0;
                        right.ch = nextCellRight ? nextCellRight.token.start : line_1.length;
                        if (right.ch > left.ch && line_1.charAt(left.ch) === " ") left.ch++;
                        if (right.ch > left.ch && line_1.charAt(right.ch - 1) === " ") right.ch--;
                        setSelected(right.ch > left.ch ? cm.getRange(left, right) : "");
                    }
                } else {
                    var nextCellRight = tokenSeeker.findNext(/hmd-table-sep/, nextCellLeft.i_token + 1);
                    left.ch = nextCellLeft.token.end;
                    right.ch = nextCellRight ? nextCellRight.token.start : line.length;
                    if (right.ch > left.ch && line.charAt(left.ch) === " ") left.ch++;
                    if (right.ch > left.ch && line.charAt(right.ch - 1) === " ") right.ch--;
                    setSelected(right.ch > left.ch ? cm.getRange(left, right) : "");
                }
            // console.log("selected cell", left.ch, right.ch, selected[i])
            } else if (eolState.listStack.length > 0) {
                // add indent to current line
                var lineNo = left.line;
                var tmp = void 0; // ["  * ", "  ", "* "]
                while(!(tmp = ListRE.exec(cm.getLine(lineNo)))){
                    lineNo--;
                    var isList = cm.getStateAfter(lineNo).listStack.length > 0;
                    if (!isList) {
                        lineNo++;
                        break;
                    }
                }
                var firstLine = cm.firstLine();
                var lastLine = cm.lastLine();
                for(; lineNo <= right.line && (tmp = ListRE.exec(cm.getLine(lineNo))); lineNo++){
                    var eolState_1 = cm.getStateAfter(lineNo);
                    var listStack = eolState_1.listStack;
                    var listStackOfPrevLine = cm.getStateAfter(lineNo - 1).listStack;
                    var listLevel = listStack.length;
                    var spaces = "";
                    // avoid uncontinuous list levels
                    if (lineNo > firstLine && listLevel <= listStackOfPrevLine.length) {
                        if (listLevel == listStackOfPrevLine.length) // tmp[1] is existed leading spaces
                        // listStackOfPrevLine[listLevel-1] is desired indentation
                        spaces = core_1.repeatStr(" ", listStackOfPrevLine[listLevel - 1] - tmp[1].length);
                        else // make bullets right-aligned
                        // tmp[0].length is end pos of current bullet
                        spaces = core_1.repeatStr(" ", listStackOfPrevLine[listLevel] - tmp[0].length);
                    }
                    addIndentTo[lineNo] = spaces;
                    // if current list item is multi-line...
                    while(++lineNo <= lastLine){
                        if (/*corrupted */ cm.getStateAfter(lineNo).listStack.length !== listLevel) {
                            lineNo = Infinity;
                            break;
                        }
                        if (/*has bullet*/ ListRE.test(cm.getLine(lineNo))) {
                            lineNo--;
                            break;
                        }
                        addIndentTo[lineNo] = spaces;
                    }
                }
                if (!rangeEmpty) {
                    flag3 = false;
                    break; // f**k
                }
            } else // emulate Tab
            if (rangeEmpty) setBeforeCur("    ");
            else {
                setSelected(cm.getRange(left, right));
                for(var lineNo = left.line; lineNo <= right.line; lineNo++)if (!(lineNo in addIndentTo)) addIndentTo[lineNo] = "    ";
            }
        }
        // if (!(flag0 || flag1 || flag2 || flag3)) return cm.execCommand("defaultTab")
        // console.log(flag0, flag1, flag2, flag3)
        for(var lineNo in addIndentTo)if (addIndentTo[lineNo]) cm.replaceRange(addIndentTo[lineNo], {
            line: ~~lineNo,
            ch: 0
        });
        if (flag0) cm.setSelections(selections);
        if (flag1) cm.replaceSelections(beforeCur);
        if (flag2) cm.replaceSelections(afterCur, "start");
        if (flag3) cm.replaceSelections(selected, "around");
    }
    exports1.tab = tab;
    /**
     * add / delete bracket pair to every selections,
     * or just add left bracket to cursor if nothing selected.
     *
     * This provides a `createStyleToggler`-like feature,
     * but don't rely on HyperMD mode
     *
     * @example
     *     When brackets are "(" and ")" :
     *     (Hello) => Hello   (Selected "(Hello)" or just "Hello")
     *     Hello   => (Hello)
     *
     * @param rightBracket if null, will use leftBracket
     */ function wrapTexts(cm, leftBracket, rightBracket) {
        var _a;
        if (cm.getOption("disableInput")) return CodeMirror.Pass;
        var selections = cm.listSelections();
        var replacements = new Array(selections.length);
        var insertBeforeCursor = new Array(selections.length);
        var flag0 = false; // replacements changed
        var flag1 = false; // insertBeforeCursor changed
        var flag2 = false; // selections changed
        if (!rightBracket) rightBracket = leftBracket;
        var lb_len = leftBracket.length;
        var rb_len = rightBracket.length;
        for(var i = 0; i < selections.length; i++){
            replacements[i] = insertBeforeCursor[i] = "";
            var range = selections[i];
            var left = range.head;
            var right = range.anchor;
            var line = cm.getLine(left.line);
            if (range.empty()) {
                if (left.ch >= lb_len && line.substr(left.ch - lb_len, lb_len) === leftBracket) {
                    // wipe out the left bracket
                    flag2 = true;
                    left.ch -= lb_len;
                } else {
                    // insert left bracket
                    flag1 = true;
                    insertBeforeCursor[i] = leftBracket;
                }
                continue;
            }
            flag0 = true;
            var headAfterAnchor = codemirror_1.cmpPos(left, right) > 0;
            if (headAfterAnchor) _a = [
                left,
                right
            ], right = _a[0], left = _a[1];
            var text = cm.getRange(left, right);
            if (left.ch >= lb_len && left.line === right.line) {
                if (line.substr(left.ch - lb_len, lb_len) === leftBracket && line.substr(right.ch, rb_len) === rightBracket) {
                    flag2 = true;
                    right.ch += rb_len;
                    left.ch -= lb_len;
                    text = leftBracket + text + rightBracket;
                }
            }
            if (text.slice(0, lb_len) === leftBracket && text.slice(-rb_len) === rightBracket) replacements[i] = text.slice(lb_len, -rb_len);
            else replacements[i] = leftBracket + text + rightBracket;
        }
        if (flag2) cm.setSelections(selections);
        if (flag1) cm.replaceSelections(insertBeforeCursor);
        if (flag0) cm.replaceSelections(replacements, "around");
    }
    exports1.wrapTexts = wrapTexts;
    function createStyleToggler(isStyled, isFormattingToken, getFormattingText) {
        return function(cm) {
            var _a;
            if (cm.getOption("disableInput")) return CodeMirror.Pass;
            var ts = new core_1.TokenSeeker(cm);
            var selections = cm.listSelections();
            var replacements = new Array(selections.length);
            for(var i = 0; i < selections.length; i++){
                var range = selections[i];
                var left = range.head;
                var right = range.anchor;
                var eolState = cm.getStateAfter(left.line);
                var rangeEmpty = range.empty();
                if (codemirror_1.cmpPos(left, right) > 0) _a = [
                    left,
                    right
                ], right = _a[0], left = _a[1];
                var rangeText = replacements[i] = rangeEmpty ? "" : cm.getRange(left, right);
                if (rangeEmpty || isStyled(cm.getTokenAt(left).state)) {
                    var line = left.line;
                    ts.setPos(line, left.ch, true);
                    var token_1 = ts.lineTokens[ts.i_token];
                    var state_1 = token_1 ? token_1.state : eolState;
                    if (!token_1 || /^\s*$/.test(token_1.string)) token_1 = ts.lineTokens[--ts.i_token]; // maybe eol, or current token is space
                    var _b = ts.expandRange(function(token) {
                        return token && (isStyled(token.state) || isFormattingToken(token));
                    }), from = _b.from, to = _b.to;
                    if (to.i_token === from.i_token) {
                        var f = getFormattingText();
                        if (token_1 && !/^\s*$/.test(token_1.string)) {
                            var pos1 = {
                                line: line,
                                ch: token_1.start
                            }, pos2 = {
                                line: line,
                                ch: token_1.end
                            };
                            token_1 = from.token;
                            cm.replaceRange(f + token_1.string + f, pos1, pos2);
                            pos2.ch += f.length;
                            cm.setCursor(pos2);
                            return;
                        } else replacements[i] = f;
                    } else {
                        if (isFormattingToken(to.token)) cm.replaceRange("", {
                            line: line,
                            ch: to.token.start
                        }, {
                            line: line,
                            ch: to.token.end
                        });
                        if (from.i_token !== to.i_token && isFormattingToken(from.token)) cm.replaceRange("", {
                            line: line,
                            ch: from.token.start
                        }, {
                            line: line,
                            ch: from.token.end
                        });
                    }
                    continue;
                }
                var token = cm.getTokenAt(left);
                var state = token ? token.state : eolState;
                var formatter = getFormattingText(state);
                replacements[i] = formatter + rangeText + formatter;
            }
            cm.replaceSelections(replacements);
        };
    }
    exports1.createStyleToggler = createStyleToggler;
    // Auto-updating Markdown list numbers when a new item is added to the
    // middle of a list
    function incrementRemainingMarkdownListNumbers(cm, pos) {
        var listRE = LoQRE;
        var startLine = pos.line, lookAhead = 0, skipCount = 0;
        var startItem = listRE.exec(cm.getLine(startLine)), startIndent = startItem[1];
        do {
            lookAhead += 1;
            var nextLineNumber = startLine + lookAhead;
            var nextLine = cm.getLine(nextLineNumber), nextItem = listRE.exec(nextLine);
            if (nextItem) {
                var nextIndent = nextItem[1];
                var newNumber = parseInt(startItem[3], 10) + lookAhead - skipCount;
                var nextNumber = parseInt(nextItem[3], 10), itemNumber = nextNumber;
                if (startIndent === nextIndent && !isNaN(nextNumber)) {
                    if (newNumber === nextNumber) itemNumber = nextNumber + 1;
                    if (newNumber > nextNumber) itemNumber = newNumber + 1;
                    cm.replaceRange(nextLine.replace(listRE, nextIndent + itemNumber + nextItem[4] + nextItem[5]), {
                        line: nextLineNumber,
                        ch: 0
                    }, {
                        line: nextLineNumber,
                        ch: nextLine.length
                    });
                } else {
                    if (startIndent.length > nextIndent.length) return;
                    // This doesn't run if the next line immediatley indents, as it is
                    // not clear of the users intention (new indented item or same level)
                    if (startIndent.length < nextIndent.length && lookAhead === 1) return;
                    skipCount += 1;
                }
            }
        }while (nextItem);
    }
    Object.assign(CodeMirror.commands, {
        hmdNewlineAndContinue: newlineAndContinue,
        hmdNewline: newline,
        hmdShiftTab: shiftTab,
        hmdTab: tab
    });
    var defaultKeyMap = CodeMirror.keyMap["default"];
    var modPrefix = defaultKeyMap === CodeMirror.keyMap["macDefault"] ? "Cmd" : "Ctrl";
    exports1.keyMap = (_a = {
        "Shift-Tab": "hmdShiftTab",
        "Tab": "hmdTab",
        "Enter": "hmdNewlineAndContinue",
        "Shift-Enter": "hmdNewline"
    }, _a[modPrefix + "-B"] = createStyleToggler(function(state) {
        return state.strong;
    }, function(token) {
        return / formatting-strong /.test(token.type);
    }, function(state) {
        return core_1.repeatStr(state && state.strong || "*", 2);
    } // ** or __
    ), _a[modPrefix + "-I"] = createStyleToggler(function(state) {
        return state.em;
    }, function(token) {
        return / formatting-em /.test(token.type);
    }, function(state) {
        return state && state.em || "*";
    }), _a[modPrefix + "-D"] = createStyleToggler(function(state) {
        return state.strikethrough;
    }, function(token) {
        return / formatting-strikethrough /.test(token.type);
    }, function(state) {
        return "~~";
    }), _a.fallthrough = "default", _a);
    exports1.keyMap = CodeMirror.normalizeKeyMap(exports1.keyMap);
    CodeMirror.keyMap["hypermd"] = exports1.keyMap;
    core_1.suggestedEditorConfig.keyMap = "hypermd";
});

});

var $ae8c4d6773892d61$exports = {};



















// Import&Export all HyperMD components except PowerPacks
// (This file is also used to generate all-in-one bundle)
//
// **DO NOT EDIT!** This file is generated by script.
//
// @see dev/HyperMD.config.js
//
(function(mod) {
    mod(null, $ae8c4d6773892d61$exports, (parcelRequire("dU2vF")), (parcelRequire("5Lj5Q")), (parcelRequire("jbuSj")), (parcelRequire("1UVd0")), (parcelRequire("eRlC8")), (parcelRequire("cxGyy")), (parcelRequire("1Oo9g")), (parcelRequire("j53Ua")), (parcelRequire("flGpM")), (parcelRequire("lWZFt")), (parcelRequire("4gGQe")), (parcelRequire("fehL4")), (parcelRequire("jyUjl")), (parcelRequire("2qsXv")), (parcelRequire("1h5Fv")), (parcelRequire("3iGBY")), (parcelRequire("0ct6M")), (parcelRequire("gWrVL")), (parcelRequire("8Rmc8")));
})(function(require1, exports1, core_1, Mode, InsertFile, ReadLink, Hover, Click, Paste, Fold, FoldImage, FoldLink, FoldCode, FoldMath, FoldEmoji, FoldHTML, TableAlign, ModeLoader, HideToken, CursorDebounce, KeyMap) {
    "use strict";
    function __export(m) {
        for(var p in m)if (!exports1.hasOwnProperty(p)) exports1[p] = m[p];
    }
    Object.defineProperty(exports1, "__esModule", {
        value: true
    });
    __export(core_1);
    exports1.Mode = Mode;
    exports1.InsertFile = InsertFile;
    exports1.ReadLink = ReadLink;
    exports1.Hover = Hover;
    exports1.Click = Click;
    exports1.Paste = Paste;
    exports1.Fold = Fold;
    exports1.FoldImage = FoldImage;
    exports1.FoldLink = FoldLink;
    exports1.FoldCode = FoldCode;
    exports1.FoldMath = FoldMath;
    exports1.FoldEmoji = FoldEmoji;
    exports1.FoldHTML = FoldHTML;
    exports1.TableAlign = TableAlign;
    exports1.ModeLoader = ModeLoader;
    exports1.HideToken = HideToken;
    exports1.CursorDebounce = CursorDebounce;
    exports1.KeyMap = KeyMap;
});


var $3da87ddc4a220fcd$var$myTextarea = document.getElementById("myTextarea");
var $3da87ddc4a220fcd$var$editor = $ae8c4d6773892d61$exports.fromTextArea($3da87ddc4a220fcd$var$myTextarea, {
    /* optional editor options here */ hmdModeLoader: false
});
window.onload = function() {
    if (localStorage.getItem("content") === null) return;
    $3da87ddc4a220fcd$var$editor.setValue(localStorage.getItem("content"));
};
document.addEventListener("keyup", function() {
    console.log($3da87ddc4a220fcd$var$editor.getValue());
    localStorage.setItem("content", $3da87ddc4a220fcd$var$editor.getValue());
});


//# sourceMappingURL=index.7e7e66d9.js.map
