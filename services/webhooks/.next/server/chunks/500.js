exports.id = 500;
exports.ids = [500];
exports.modules = {

/***/ 27760:
/***/ ((module) => {

/*! For license information please see editor.js.LICENSE.txt */
!function(t,e){ true?module.exports=e():0}(window,(function(){return function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=186)}([function(t,e,n){var o=n(10),r=n(17),i=n(27),a=n(21),s=n(31),l=function(t,e,n){var c,u,f,d,p=t&l.F,h=t&l.G,v=t&l.S,g=t&l.P,y=t&l.B,b=h?o:v?o[e]||(o[e]={}):(o[e]||{}).prototype,m=h?r:r[e]||(r[e]={}),k=m.prototype||(m.prototype={});for(c in h&&(n=e),n)f=((u=!p&&b&&void 0!==b[c])?b:n)[c],d=y&&u?s(f,o):g&&"function"==typeof f?s(Function.call,f):f,b&&a(b,c,f,t&l.U),m[c]!=f&&i(m,c,d),g&&k[c]!=f&&(k[c]=f)};o.core=r,l.F=1,l.G=2,l.S=4,l.P=8,l.B=16,l.W=32,l.U=64,l.R=128,t.exports=l},function(t,e){t.exports=function(t){return t&&t.__esModule?t:{default:t}}},function(t,e){t.exports=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}},function(t,e){function n(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}t.exports=function(t,e,o){return e&&n(t.prototype,e),o&&n(t,o),t}},function(t,e){function n(e){return t.exports=n=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)},n(e)}t.exports=n},function(t,e,n){var o=n(110);t.exports=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&o(t,e)}},function(t,e,n){var o=n(80),r=n(149);t.exports=function(t,e){return!e||"object"!==o(e)&&"function"!=typeof e?r(t):e}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(370),n(24),n(398),n(15)],void 0===(i="function"==typeof(o=function(t,e,o,r,i,a){"use strict";var s,l=n(1);function c(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"log",o=arguments.length>3?arguments[3]:void 0,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"color: inherit";if("console"in window&&window.console[n]){var i=["info","log","warn","error"].includes(n),a=[];switch(c.logLevel){case s.ERROR:if("error"!==n)return;break;case s.WARN:if(!["error","warn"].includes(n))return;break;case s.INFO:if(!i||t)return}o&&a.push(o);var l="Editor.js ".concat("2.22.2"),u="line-height: 1em;\n            color: #006FEA;\n            display: inline-block;\n            font-size: 11px;\n            line-height: 1em;\n            background-color: #fff;\n            padding: 4px 9px;\n            border-radius: 30px;\n            border: 1px solid rgba(56, 138, 229, 0.16);\n            margin: 4px 5px 4px 0;";t&&(i?(a.unshift(u,r),e="%c".concat(l,"%c ").concat(e)):e="( ".concat(l," )").concat(e));try{if(i)if(o){var f;(f=console)[n].apply(f,["".concat(e," %o")].concat(a))}else{var d;(d=console)[n].apply(d,[e].concat(a))}else console[n](e)}catch(t){}}}Object.defineProperty(t,"__esModule",{value:!0}),t.setLogLevel=function(t){c.logLevel=t},t.typeOf=d,t.isFunction=p,t.isObject=h,t.isString=function(t){return"string"===d(t)},t.isBoolean=function(t){return"boolean"===d(t)},t.isNumber=function(t){return"number"===d(t)},t.isUndefined=v,t.isClass=function(t){return p(t)&&/^\s*class\s+/.test(t.toString())},t.isEmpty=function(t){return!t||0===Object.keys(t).length&&t.constructor===Object},t.isPromise=function(t){return Promise.resolve(t)===t},t.isPrintableKey=function(t){return t>47&&t<58||32===t||13===t||229===t||t>64&&t<91||t>95&&t<112||t>185&&t<193||t>218&&t<223},t.sequence=function(t){return g.apply(this,arguments)},t.array=function(t){return Array.prototype.slice.call(t)},t.delay=function(t,e){return function(){var n=this,o=arguments;window.setTimeout((function(){return t.apply(n,o)}),e)}},t.getFileExtension=function(t){return t.name.split(".").pop()},t.isValidMimeType=function(t){return/^[-\w]+\/([-+\w]+|\*)$/.test(t)},t.debounce=function(t,e,n){var o,r=this;return function(){for(var i=arguments.length,a=new Array(i),s=0;s<i;s++)a[s]=arguments[s];var l=r,c=function(){o=null,n||t.apply(l,a)},u=n&&!o;window.clearTimeout(o),o=window.setTimeout(c,e),u&&t.apply(l,a)}},t.copyTextToClipboard=function(t){var e=a.default.make("div","codex-editor-clipboard",{innerHTML:t});document.body.appendChild(e);var n=window.getSelection(),o=document.createRange();o.selectNode(e),window.getSelection().removeAllRanges(),n.addRange(o),document.execCommand("copy"),document.body.removeChild(e)},t.getUserOS=y,t.capitalize=function(t){return t[0].toUpperCase()+t.slice(1)},t.deepMerge=function t(e){for(var n=arguments.length,r=new Array(n>1?n-1:0),i=1;i<n;i++)r[i-1]=arguments[i];if(!r.length)return e;var a=r.shift();if(h(e)&&h(a))for(var s in a)h(a[s])?(e[s]||Object.assign(e,(0,o.default)({},s,{})),t(e[s],a[s])):Object.assign(e,(0,o.default)({},s,a[s]));return t.apply(void 0,[e].concat(r))},t.beautifyShortcut=function(t){var e=y();return t=t.replace(/shift/gi,"⇧").replace(/backspace/gi,"⌫").replace(/enter/gi,"⏎").replace(/up/gi,"↑").replace(/left/gi,"→").replace(/down/gi,"↓").replace(/right/gi,"←").replace(/escape/gi,"⎋").replace(/insert/gi,"Ins").replace(/delete/gi,"␡").replace(/\+/gi," + "),t=e.mac?t.replace(/ctrl|cmd/gi,"⌘").replace(/alt/gi,"⌥"):t.replace(/cmd/gi,"Ctrl").replace(/windows/gi,"WIN")},t.getValidUrl=function(t){try{return new URL(t).href}catch(t){}return"//"===t.substring(0,2)?window.location.protocol+t:window.location.origin+t},t.generateBlockId=function(){return(0,i.nanoid)(10)},t.openTab=function(t){window.open(t,"_blank")},t.generateId=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"";return"".concat(t).concat(Math.floor(1e8*Math.random()).toString(16))},t.deprecationAssert=function(t,e,n){var o="«".concat(e,"» is deprecated and will be removed in the next major release. Please use the «").concat(n,"» instead.");t&&f(o,"warn")},t.cacheable=function(t,e,n){var o=n.value?"value":"get",r=n[o],i="#".concat(e,"Cache");if(n[o]=function(){if(void 0===this[i]){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];this[i]=r.apply.apply(r,[this].concat(e))}return this[i]},"get"===o&&n.set){var a=n.set;n.set=function(e){delete t[i],a.apply(this,e)}}return n},t.isTouchSupported=t.logLabeled=t.log=t.mouseButtons=t.keyCodes=t.LogLevels=void 0,e=l(e),o=l(o),r=l(r),a=l(a),t.LogLevels=s,function(t){t.VERBOSE="VERBOSE",t.INFO="INFO",t.WARN="WARN",t.ERROR="ERROR"}(s||(t.LogLevels=s={})),t.keyCodes={BACKSPACE:8,TAB:9,ENTER:13,SHIFT:16,CTRL:17,ALT:18,ESC:27,SPACE:32,LEFT:37,UP:38,DOWN:40,RIGHT:39,DELETE:46,META:91},t.mouseButtons={LEFT:0,WHEEL:1,RIGHT:2,BACKWARD:3,FORWARD:4},c.logLevel=s.VERBOSE;var u=c.bind(window,!1);t.log=u;var f=c.bind(window,!0);function d(t){return Object.prototype.toString.call(t).match(/\s([a-zA-Z]+)/)[1].toLowerCase()}function p(t){return"function"===d(t)}function h(t){return"object"===d(t)}function v(t){return"undefined"===d(t)}function g(){return(g=(0,r.default)(e.default.mark((function t(n){var o,i,a,s,l=arguments;return e.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return s=function(){return(s=(0,r.default)(e.default.mark((function t(n,o,r){return e.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n.function(n.data);case 3:return t.next=5,o(v(n.data)?{}:n.data);case 5:t.next=10;break;case 7:t.prev=7,t.t0=t.catch(0),r(v(n.data)?{}:n.data);case 10:case"end":return t.stop()}}),t,null,[[0,7]])})))).apply(this,arguments)},a=function(t,e,n){return s.apply(this,arguments)},o=l.length>1&&void 0!==l[1]?l[1]:function(){},i=l.length>2&&void 0!==l[2]?l[2]:function(){},t.abrupt("return",n.reduce(function(){var t=(0,r.default)(e.default.mark((function t(n,r){return e.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,n;case 2:return t.abrupt("return",a(r,o,i));case 3:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}(),Promise.resolve()));case 5:case"end":return t.stop()}}),t)})))).apply(this,arguments)}function y(){var t={win:!1,mac:!1,x11:!1,linux:!1},e=Object.keys(t).find((function(t){return-1!==navigator.appVersion.toLowerCase().indexOf(t)}));return e?(t[e]=!0,t):t}t.logLabeled=f;var b="ontouchstart"in document.documentElement;t.isTouchSupported=b})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(80);function r(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return r=function(){return t},t}t.exports=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==o(t)&&"function"!=typeof t)return{default:t};var e=r();if(e&&e.has(t))return e.get(t);var n={},i=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var a in t)if(Object.prototype.hasOwnProperty.call(t,a)){var s=i?Object.getOwnPropertyDescriptor(t,a):null;s&&(s.get||s.set)?Object.defineProperty(n,a,s):n[a]=t[a]}return n.default=t,e&&e.set(t,n),n}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(375)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);function l(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=function(t,e){if(t){if("string"==typeof t)return c(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?c(t,e):void 0}}(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,r,i=!0,a=!1;return{s:function(){o=t[Symbol.iterator]()},n:function(){var t=o.next();return i=t.done,t},e:function(t){a=!0,r=t},f:function(){try{i||null==o.return||o.return()}finally{if(a)throw r}}}}function c(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var u=function(){function t(e){var n=this,o=e.config,i=e.eventsDispatcher;if((0,r.default)(this,t),this.nodes={},this.listeners=new a.default,this.readOnlyMutableListeners={on:function(t,e,o){var r=arguments.length>3&&void 0!==arguments[3]&&arguments[3];n.mutableListenerIds.push(n.listeners.on(t,e,o,r))},clearAll:function(){var t,e=l(n.mutableListenerIds);try{for(e.s();!(t=e.n()).done;){var o=t.value;n.listeners.offById(o)}}catch(t){e.e(t)}finally{e.f()}n.mutableListenerIds=[]}},this.mutableListenerIds=[],(this instanceof t?this.constructor:void 0)===t)throw new TypeError("Constructors for abstract class Module are not allowed.");this.config=o,this.eventsDispatcher=i}return(0,i.default)(t,[{key:"removeAllNodes",value:function(){for(var t in this.nodes){var e=this.nodes[t];e instanceof HTMLElement&&e.remove()}}},{key:"state",set:function(t){this.Editor=t}},{key:"isRtl",get:function(){return"rtl"===this.config.i18n.direction}}]),t}();o.default=u,u.displayName="Module",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e){var n=t.exports="undefined"!=typeof window&&window.Math==Math?window:"undefined"!=typeof self&&self.Math==Math?self:Function("return this")();"number"==typeof __g&&(__g=n)},function(t,e){t.exports=function(t){try{return!!t()}catch(t){return!0}}},function(t,e,n){var o=n(13);t.exports=function(t){if(!o(t))throw TypeError(t+" is not an object!");return t}},function(t,e){t.exports=function(t){return"object"==typeof t?null!==t:"function"==typeof t}},function(t,e,n){var o=n(68)("wks"),r=n(44),i=n(10).Symbol,a="function"==typeof i;(t.exports=function(t){return o[t]||(o[t]=a&&i[t]||(a?i:r)("Symbol."+t))}).store=o},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(42),n(2),n(3),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s){"use strict";var l=n(8),c=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=c(r),i=c(i),a=c(a),s=l(s);var u=function(){function t(){(0,i.default)(this,t)}return(0,a.default)(t,null,[{key:"isSingleTag",value:function(t){return t.tagName&&["AREA","BASE","BR","COL","COMMAND","EMBED","HR","IMG","INPUT","KEYGEN","LINK","META","PARAM","SOURCE","TRACK","WBR"].includes(t.tagName)}},{key:"isLineBreakTag",value:function(t){return t&&t.tagName&&["BR","WBR"].includes(t.tagName)}},{key:"make",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},i=document.createElement(t);for(var a in Array.isArray(n)?(e=i.classList).add.apply(e,(0,r.default)(n)):n&&i.classList.add(n),o)Object.prototype.hasOwnProperty.call(o,a)&&(i[a]=o[a]);return i}},{key:"text",value:function(t){return document.createTextNode(t)}},{key:"svg",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:14,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:14,o=document.createElementNS("http://www.w3.org/2000/svg","svg");return o.classList.add("icon","icon--"+t),o.setAttribute("width",e+"px"),o.setAttribute("height",n+"px"),o.innerHTML='<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#'.concat(t,'"></use>'),o}},{key:"append",value:function(t,e){Array.isArray(e)?e.forEach((function(e){return t.appendChild(e)})):t.appendChild(e)}},{key:"prepend",value:function(t,e){Array.isArray(e)?(e=e.reverse()).forEach((function(e){return t.prepend(e)})):t.prepend(e)}},{key:"swap",value:function(t,e){var n=document.createElement("div"),o=t.parentNode;o.insertBefore(n,t),o.insertBefore(t,e),o.insertBefore(e,n),o.removeChild(n)}},{key:"find",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,e=arguments.length>1?arguments[1]:void 0;return t.querySelector(e)}},{key:"get",value:function(t){return document.getElementById(t)}},{key:"findAll",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document,e=arguments.length>1?arguments[1]:void 0;return t.querySelectorAll(e)}},{key:"findAllInputs",value:function(e){return s.array(e.querySelectorAll(t.allInputsSelector)).reduce((function(e,n){return t.isNativeInput(n)||t.containsOnlyInlineElements(n)?[].concat((0,r.default)(e),[n]):[].concat((0,r.default)(e),(0,r.default)(t.getDeepestBlockElements(n)))}),[])}},{key:"getDeepestNode",value:function(e){var n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=n?"lastChild":"firstChild",r=n?"previousSibling":"nextSibling";if(e&&e.nodeType===Node.ELEMENT_NODE&&e[o]){var i=e[o];if(t.isSingleTag(i)&&!t.isNativeInput(i)&&!t.isLineBreakTag(i))if(i[r])i=i[r];else{if(!i.parentNode[r])return i.parentNode;i=i.parentNode[r]}return this.getDeepestNode(i,n)}return e}},{key:"isElement",value:function(t){return!s.isNumber(t)&&t&&t.nodeType&&t.nodeType===Node.ELEMENT_NODE}},{key:"isFragment",value:function(t){return!s.isNumber(t)&&t&&t.nodeType&&t.nodeType===Node.DOCUMENT_FRAGMENT_NODE}},{key:"isContentEditable",value:function(t){return"true"===t.contentEditable}},{key:"isNativeInput",value:function(t){return!(!t||!t.tagName)&&["INPUT","TEXTAREA"].includes(t.tagName)}},{key:"canSetCaret",value:function(e){var n=!0;if(t.isNativeInput(e))switch(e.type){case"file":case"checkbox":case"radio":case"hidden":case"submit":case"button":case"image":case"reset":n=!1}else n=t.isContentEditable(e);return n}},{key:"isNodeEmpty",value:function(t){return!(this.isSingleTag(t)&&!this.isLineBreakTag(t))&&0===(this.isElement(t)&&this.isNativeInput(t)?t.value:t.textContent.replace("​","")).trim().length}},{key:"isLeaf",value:function(t){return!!t&&0===t.childNodes.length}},{key:"isEmpty",value:function(t){t.normalize();for(var e=[t];e.length>0;)if(t=e.shift()){if(this.isLeaf(t)&&!this.isNodeEmpty(t))return!1;t.childNodes&&e.push.apply(e,(0,r.default)(Array.from(t.childNodes)))}return!0}},{key:"isHTMLString",value:function(e){var n=t.make("div");return n.innerHTML=e,n.childElementCount>0}},{key:"getContentLength",value:function(e){return t.isNativeInput(e)?e.value.length:e.nodeType===Node.TEXT_NODE?e.length:e.textContent.length}},{key:"containsOnlyInlineElements",value:function(e){var n;return s.isString(e)?(n=document.createElement("div")).innerHTML=e:n=e,Array.from(n.children).every((function e(n){return!t.blockElements.includes(n.tagName.toLowerCase())&&Array.from(n.children).every(e)}))}},{key:"getDeepestBlockElements",value:function(e){return t.containsOnlyInlineElements(e)?[e]:Array.from(e.children).reduce((function(e,n){return[].concat((0,r.default)(e),(0,r.default)(t.getDeepestBlockElements(n)))}),[])}},{key:"getHolder",value:function(t){return s.isString(t)?document.getElementById(t):t}},{key:"isExtensionNode",value:function(t){return t&&["GRAMMARLY-EXTENSION"].includes(t.nodeName)}},{key:"isAnchor",value:function(t){return"a"===t.tagName.toLowerCase()}},{key:"allInputsSelector",get:function(){return"[contenteditable=true], textarea, input:not([type]), "+["text","password","email","number","search","tel","url"].map((function(t){return'input[type="'.concat(t,'"]')})).join(", ")}},{key:"blockElements",get:function(){return["address","article","aside","blockquote","canvas","div","dl","dt","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","header","hgroup","hr","li","main","nav","noscript","ol","output","p","pre","ruby","section","table","tr","tfoot","ul","video"]}}]),t}();o.default=u,u.displayName="Dom",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(33),r=Math.min;t.exports=function(t){return t>0?r(o(t),9007199254740991):0}},function(t,e){var n=t.exports={version:"2.6.11"};"number"==typeof __e&&(__e=n)},function(t,e,n){t.exports=!n(11)((function(){return 7!=Object.defineProperty({},"a",{get:function(){return 7}}).a}))},function(t,e,n){var o=n(12),r=n(113),i=n(40),a=Object.defineProperty;e.f=n(18)?Object.defineProperty:function(t,e,n){if(o(t),e=i(e,!0),o(n),r)try{return a(t,e,n)}catch(t){}if("get"in n||"set"in n)throw TypeError("Accessors not supported!");return"value"in n&&(t[e]=n.value),t}},function(t,e,n){var o=n(38);t.exports=function(t){return Object(o(t))}},function(t,e,n){var o=n(10),r=n(27),i=n(26),a=n(44)("src"),s=n(191),l=(""+s).split("toString");n(17).inspectSource=function(t){return s.call(t)},(t.exports=function(t,e,n,s){var c="function"==typeof n;c&&(i(n,"name")||r(n,"name",e)),t[e]!==n&&(c&&(i(n,a)||r(n,a,t[e]?""+t[e]:l.join(String(e)))),t===o?t[e]=n:s?t[e]?t[e]=n:r(t,e,n):(delete t[e],r(t,e,n)))})(Function.prototype,"toString",(function(){return"function"==typeof this&&this[a]||s.call(this)}))},function(t,e,n){var o=n(0),r=n(11),i=n(38),a=/"/g,s=function(t,e,n,o){var r=String(i(t)),s="<"+e;return""!==n&&(s+=" "+n+'="'+String(o).replace(a,"&quot;")+'"'),s+">"+r+"</"+e+">"};t.exports=function(t,e){var n={};n[t]=e(s),o(o.P+o.F*r((function(){var e=""[t]('"');return e!==e.toLowerCase()||e.split('"').length>3})),"String",n)}},function(t,e,n){t.exports=n(144)},function(t,e){function n(t,e,n,o,r,i,a){try{var s=t[i](a),l=s.value}catch(t){return void n(t)}s.done?e(l):Promise.resolve(l).then(o,r)}t.exports=function(t){return function(){var e=this,o=arguments;return new Promise((function(r,i){var a=t.apply(e,o);function s(t){n(a,r,i,s,l,"next",t)}function l(t){n(a,r,i,s,l,"throw",t)}s(void 0)}))}}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(7),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a,s){"use strict";var l=n(8),c=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=c(r),i=c(i),a=l(a),s=c(s);var u=function(){function t(){(0,r.default)(this,t),this.instance=null,this.selection=null,this.savedSelectionRange=null,this.isFakeBackgroundEnabled=!1,this.commandBackground="backColor",this.commandRemoveFormat="removeFormat"}return(0,i.default)(t,[{key:"removeFakeBackground",value:function(){this.isFakeBackgroundEnabled&&(this.isFakeBackgroundEnabled=!1,document.execCommand(this.commandRemoveFormat))}},{key:"setFakeBackground",value:function(){document.execCommand(this.commandBackground,!1,"#a8d6ff"),this.isFakeBackgroundEnabled=!0}},{key:"save",value:function(){this.savedSelectionRange=t.range}},{key:"restore",value:function(){if(this.savedSelectionRange){var t=window.getSelection();t.removeAllRanges(),t.addRange(this.savedSelectionRange)}}},{key:"clearSaved",value:function(){this.savedSelectionRange=null}},{key:"collapseToEnd",value:function(){var t=window.getSelection(),e=document.createRange();e.selectNodeContents(t.focusNode),e.collapse(!1),t.removeAllRanges(),t.addRange(e)}},{key:"findParentTag",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:10,o=window.getSelection(),r=null;if(!o||!o.anchorNode||!o.focusNode)return null;var i=[o.anchorNode,o.focusNode];return i.forEach((function(o){for(var i=n;i>0&&o.parentNode&&(o.tagName!==t||(r=o,e&&o.classList&&!o.classList.contains(e)&&(r=null),!r));)o=o.parentNode,i--})),r}},{key:"expandToTag",value:function(t){var e=window.getSelection();e.removeAllRanges();var n=document.createRange();n.selectNodeContents(t),e.addRange(n)}}],[{key:"isSelectionAtEditor",value:function(e){if(!e)return!1;var n=e.anchorNode||e.focusNode;n&&n.nodeType===Node.TEXT_NODE&&(n=n.parentNode);var o=null;return n&&n instanceof Element&&(o=n.closest(".".concat(t.CSS.editorZone))),!!o&&o.nodeType===Node.ELEMENT_NODE}},{key:"isRangeAtEditor",value:function(e){if(e){var n=e.startContainer;n&&n.nodeType===Node.TEXT_NODE&&(n=n.parentNode);var o=null;return n&&n instanceof Element&&(o=n.closest(".".concat(t.CSS.editorZone))),!!o&&o.nodeType===Node.ELEMENT_NODE}}},{key:"getRangeFromSelection",value:function(t){return t&&t.rangeCount?t.getRangeAt(0):null}},{key:"get",value:function(){return window.getSelection()}},{key:"setCursor",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=document.createRange(),o=window.getSelection();if(s.default.isNativeInput(t)){if(!s.default.canSetCaret(t))return;return t.focus(),t.selectionStart=t.selectionEnd=e,t.getBoundingClientRect()}return n.setStart(t,e),n.setEnd(t,e),o.removeAllRanges(),o.addRange(n),n.getBoundingClientRect()}},{key:"addFakeCursor",value:function(e){var n=t.range,o=s.default.make("span","codex-editor__fake-cursor");o.dataset.mutationFree="true",!n||e&&!e.contains(n.startContainer)||(n.collapse(),n.insertNode(o))}},{key:"removeFakeCursor",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:document.body,e=s.default.find(t,".codex-editor__fake-cursor");e&&e.remove()}},{key:"CSS",get:function(){return{editorWrapper:"codex-editor",editorZone:"codex-editor__redactor"}}},{key:"anchorNode",get:function(){var t=window.getSelection();return t?t.anchorNode:null}},{key:"anchorElement",get:function(){var t=window.getSelection();if(!t)return null;var e=t.anchorNode;return e?s.default.isElement(e)?e:e.parentElement:null}},{key:"anchorOffset",get:function(){var t=window.getSelection();return t?t.anchorOffset:null}},{key:"isCollapsed",get:function(){var t=window.getSelection();return t?t.isCollapsed:null}},{key:"isAtEditor",get:function(){return this.isSelectionAtEditor(t.get())}},{key:"isSelectionExists",get:function(){return!!t.get().anchorNode}},{key:"range",get:function(){return this.getRangeFromSelection(this.get())}},{key:"rect",get:function(){var t,e=document.selection,n={x:0,y:0,width:0,height:0};if(e&&"Control"!==e.type)return t=(e=e).createRange(),n.x=t.boundingLeft,n.y=t.boundingTop,n.width=t.boundingWidth,n.height=t.boundingHeight,n;if(!window.getSelection)return a.log("Method window.getSelection is not supported","warn"),n;if(null===(e=window.getSelection()).rangeCount||isNaN(e.rangeCount))return a.log("Method SelectionUtils.rangeCount is not supported","warn"),n;if(0===e.rangeCount)return n;if((t=e.getRangeAt(0).cloneRange()).getBoundingClientRect&&(n=t.getBoundingClientRect()),0===n.x&&0===n.y){var o=document.createElement("span");if(o.getBoundingClientRect){o.appendChild(document.createTextNode("​")),t.insertNode(o),n=o.getBoundingClientRect();var r=o.parentNode;r.removeChild(o),r.normalize()}}return n}},{key:"text",get:function(){return window.getSelection?window.getSelection().toString():""}}]),t}();o.default=u,u.displayName="SelectionUtils",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e){var n={}.hasOwnProperty;t.exports=function(t,e){return n.call(t,e)}},function(t,e,n){var o=n(19),r=n(43);t.exports=n(18)?function(t,e,n){return o.f(t,e,r(1,n))}:function(t,e,n){return t[e]=n,t}},function(t,e,n){var o=n(61),r=n(38);t.exports=function(t){return o(r(t))}},function(t,e,n){"use strict";var o=n(11);t.exports=function(t,e){return!!t&&o((function(){e?t.call(null,(function(){}),1):t.call(null)}))}},function(t,e,n){var o=n(360),r=n(361),i=n(145),a=n(362);t.exports=function(t,e){return o(t)||r(t,e)||i(t,e)||a()}},function(t,e,n){var o=n(32);t.exports=function(t,e,n){if(o(t),void 0===e)return t;switch(n){case 1:return function(n){return t.call(e,n)};case 2:return function(n,o){return t.call(e,n,o)};case 3:return function(n,o,r){return t.call(e,n,o,r)}}return function(){return t.apply(e,arguments)}}},function(t,e){t.exports=function(t){if("function"!=typeof t)throw TypeError(t+" is not a function!");return t}},function(t,e){var n=Math.ceil,o=Math.floor;t.exports=function(t){return isNaN(t=+t)?0:(t>0?o:n)(t)}},function(t,e,n){var o=n(62),r=n(43),i=n(28),a=n(40),s=n(26),l=n(113),c=Object.getOwnPropertyDescriptor;e.f=n(18)?c:function(t,e){if(t=i(t),e=a(e,!0),l)try{return c(t,e)}catch(t){}if(s(t,e))return r(!o.f.call(t,e),t[e])}},function(t,e,n){var o=n(0),r=n(17),i=n(11);t.exports=function(t,e){var n=(r.Object||{})[t]||Object[t],a={};a[t]=e(n),o(o.S+o.F*i((function(){n(1)})),"Object",a)}},function(t,e,n){var o=n(31),r=n(61),i=n(20),a=n(16),s=n(129);t.exports=function(t,e){var n=1==t,l=2==t,c=3==t,u=4==t,f=6==t,d=5==t||f,p=e||s;return function(e,s,h){for(var v,g,y=i(e),b=r(y),m=o(s,h,3),k=a(b.length),x=0,w=n?p(e,k):l?p(e,0):void 0;k>x;x++)if((d||x in b)&&(g=m(v=b[x],x,y),t))if(n)w[x]=g;else if(g)switch(t){case 3:return!0;case 5:return v;case 6:return x;case 2:w.push(v)}else if(u)return!1;return f?-1:c||u?u:w}}},function(t,e){var n={}.toString;t.exports=function(t){return n.call(t).slice(8,-1)}},function(t,e){t.exports=function(t){if(null==t)throw TypeError("Can't call method on  "+t);return t}},function(t,e,n){"use strict";if(n(18)){var o=n(45),r=n(10),i=n(11),a=n(0),s=n(79),l=n(109),c=n(31),u=n(57),f=n(43),d=n(27),p=n(58),h=n(33),v=n(16),g=n(140),y=n(47),b=n(40),m=n(26),k=n(63),x=n(13),w=n(20),S=n(101),T=n(48),E=n(50),B=n(49).f,C=n(103),_=n(44),O=n(14),I=n(36),M=n(69),R=n(64),A=n(105),N=n(55),P=n(72),L=n(56),D=n(104),j=n(131),F=n(19),U=n(34),H=F.f,z=U.f,W=r.RangeError,Y=r.TypeError,V=r.Uint8Array,X=Array.prototype,G=l.ArrayBuffer,K=l.DataView,Z=I(0),q=I(2),J=I(3),$=I(4),Q=I(5),tt=I(6),et=M(!0),nt=M(!1),ot=A.values,rt=A.keys,it=A.entries,at=X.lastIndexOf,st=X.reduce,lt=X.reduceRight,ct=X.join,ut=X.sort,ft=X.slice,dt=X.toString,pt=X.toLocaleString,ht=O("iterator"),vt=O("toStringTag"),gt=_("typed_constructor"),yt=_("def_constructor"),bt=s.CONSTR,mt=s.TYPED,kt=s.VIEW,xt=I(1,(function(t,e){return Bt(R(t,t[yt]),e)})),wt=i((function(){return 1===new V(new Uint16Array([1]).buffer)[0]})),St=!!V&&!!V.prototype.set&&i((function(){new V(1).set({})})),Tt=function(t,e){var n=h(t);if(n<0||n%e)throw W("Wrong offset!");return n},Et=function(t){if(x(t)&&mt in t)return t;throw Y(t+" is not a typed array!")},Bt=function(t,e){if(!x(t)||!(gt in t))throw Y("It is not a typed array constructor!");return new t(e)},Ct=function(t,e){return _t(R(t,t[yt]),e)},_t=function(t,e){for(var n=0,o=e.length,r=Bt(t,o);o>n;)r[n]=e[n++];return r},Ot=function(t,e,n){H(t,e,{get:function(){return this._d[n]}})},It=function(t){var e,n,o,r,i,a,s=w(t),l=arguments.length,u=l>1?arguments[1]:void 0,f=void 0!==u,d=C(s);if(null!=d&&!S(d)){for(a=d.call(s),o=[],e=0;!(i=a.next()).done;e++)o.push(i.value);s=o}for(f&&l>2&&(u=c(u,arguments[2],2)),e=0,n=v(s.length),r=Bt(this,n);n>e;e++)r[e]=f?u(s[e],e):s[e];return r},Mt=function(){for(var t=0,e=arguments.length,n=Bt(this,e);e>t;)n[t]=arguments[t++];return n},Rt=!!V&&i((function(){pt.call(new V(1))})),At=function(){return pt.apply(Rt?ft.call(Et(this)):Et(this),arguments)},Nt={copyWithin:function(t,e){return j.call(Et(this),t,e,arguments.length>2?arguments[2]:void 0)},every:function(t){return $(Et(this),t,arguments.length>1?arguments[1]:void 0)},fill:function(t){return D.apply(Et(this),arguments)},filter:function(t){return Ct(this,q(Et(this),t,arguments.length>1?arguments[1]:void 0))},find:function(t){return Q(Et(this),t,arguments.length>1?arguments[1]:void 0)},findIndex:function(t){return tt(Et(this),t,arguments.length>1?arguments[1]:void 0)},forEach:function(t){Z(Et(this),t,arguments.length>1?arguments[1]:void 0)},indexOf:function(t){return nt(Et(this),t,arguments.length>1?arguments[1]:void 0)},includes:function(t){return et(Et(this),t,arguments.length>1?arguments[1]:void 0)},join:function(t){return ct.apply(Et(this),arguments)},lastIndexOf:function(t){return at.apply(Et(this),arguments)},map:function(t){return xt(Et(this),t,arguments.length>1?arguments[1]:void 0)},reduce:function(t){return st.apply(Et(this),arguments)},reduceRight:function(t){return lt.apply(Et(this),arguments)},reverse:function(){for(var t,e=Et(this).length,n=Math.floor(e/2),o=0;o<n;)t=this[o],this[o++]=this[--e],this[e]=t;return this},some:function(t){return J(Et(this),t,arguments.length>1?arguments[1]:void 0)},sort:function(t){return ut.call(Et(this),t)},subarray:function(t,e){var n=Et(this),o=n.length,r=y(t,o);return new(R(n,n[yt]))(n.buffer,n.byteOffset+r*n.BYTES_PER_ELEMENT,v((void 0===e?o:y(e,o))-r))}},Pt=function(t,e){return Ct(this,ft.call(Et(this),t,e))},Lt=function(t){Et(this);var e=Tt(arguments[1],1),n=this.length,o=w(t),r=v(o.length),i=0;if(r+e>n)throw W("Wrong length!");for(;i<r;)this[e+i]=o[i++]},Dt={entries:function(){return it.call(Et(this))},keys:function(){return rt.call(Et(this))},values:function(){return ot.call(Et(this))}},jt=function(t,e){return x(t)&&t[mt]&&"symbol"!=typeof e&&e in t&&String(+e)==String(e)},Ft=function(t,e){return jt(t,e=b(e,!0))?f(2,t[e]):z(t,e)},Ut=function(t,e,n){return!(jt(t,e=b(e,!0))&&x(n)&&m(n,"value"))||m(n,"get")||m(n,"set")||n.configurable||m(n,"writable")&&!n.writable||m(n,"enumerable")&&!n.enumerable?H(t,e,n):(t[e]=n.value,t)};bt||(U.f=Ft,F.f=Ut),a(a.S+a.F*!bt,"Object",{getOwnPropertyDescriptor:Ft,defineProperty:Ut}),i((function(){dt.call({})}))&&(dt=pt=function(){return ct.call(this)});var Ht=p({},Nt);p(Ht,Dt),d(Ht,ht,Dt.values),p(Ht,{slice:Pt,set:Lt,constructor:function(){},toString:dt,toLocaleString:At}),Ot(Ht,"buffer","b"),Ot(Ht,"byteOffset","o"),Ot(Ht,"byteLength","l"),Ot(Ht,"length","e"),H(Ht,vt,{get:function(){return this[mt]}}),t.exports=function(t,e,n,l){var c=t+((l=!!l)?"Clamped":"")+"Array",f="get"+t,p="set"+t,h=r[c],y=h||{},b=h&&E(h),m=!h||!s.ABV,w={},S=h&&h.prototype,C=function(t,n){H(t,n,{get:function(){return function(t,n){var o=t._d;return o.v[f](n*e+o.o,wt)}(this,n)},set:function(t){return function(t,n,o){var r=t._d;l&&(o=(o=Math.round(o))<0?0:o>255?255:255&o),r.v[p](n*e+r.o,o,wt)}(this,n,t)},enumerable:!0})};m?(h=n((function(t,n,o,r){u(t,h,c,"_d");var i,a,s,l,f=0,p=0;if(x(n)){if(!(n instanceof G||"ArrayBuffer"==(l=k(n))||"SharedArrayBuffer"==l))return mt in n?_t(h,n):It.call(h,n);i=n,p=Tt(o,e);var y=n.byteLength;if(void 0===r){if(y%e)throw W("Wrong length!");if((a=y-p)<0)throw W("Wrong length!")}else if((a=v(r)*e)+p>y)throw W("Wrong length!");s=a/e}else s=g(n),i=new G(a=s*e);for(d(t,"_d",{b:i,o:p,l:a,e:s,v:new K(i)});f<s;)C(t,f++)})),S=h.prototype=T(Ht),d(S,"constructor",h)):i((function(){h(1)}))&&i((function(){new h(-1)}))&&P((function(t){new h,new h(null),new h(1.5),new h(t)}),!0)||(h=n((function(t,n,o,r){var i;return u(t,h,c),x(n)?n instanceof G||"ArrayBuffer"==(i=k(n))||"SharedArrayBuffer"==i?void 0!==r?new y(n,Tt(o,e),r):void 0!==o?new y(n,Tt(o,e)):new y(n):mt in n?_t(h,n):It.call(h,n):new y(g(n))})),Z(b!==Function.prototype?B(y).concat(B(b)):B(y),(function(t){t in h||d(h,t,y[t])})),h.prototype=S,o||(S.constructor=h));var _=S[ht],O=!!_&&("values"==_.name||null==_.name),I=Dt.values;d(h,gt,!0),d(S,mt,c),d(S,kt,!0),d(S,yt,h),(l?new h(1)[vt]==c:vt in S)||H(S,vt,{get:function(){return c}}),w[c]=h,a(a.G+a.W+a.F*(h!=y),w),a(a.S,c,{BYTES_PER_ELEMENT:e}),a(a.S+a.F*i((function(){y.of.call(h,1)})),c,{from:It,of:Mt}),"BYTES_PER_ELEMENT"in S||d(S,"BYTES_PER_ELEMENT",e),a(a.P,c,Nt),L(c),a(a.P+a.F*St,c,{set:Lt}),a(a.P+a.F*!O,c,Dt),o||S.toString==dt||(S.toString=dt),a(a.P+a.F*i((function(){new h(1).slice()})),c,{slice:Pt}),a(a.P+a.F*(i((function(){return[1,2].toLocaleString()!=new h([1,2]).toLocaleString()}))||!i((function(){S.toLocaleString.call([1,2])}))),c,{toLocaleString:At}),N[c]=O?_:I,o||O||d(S,ht,I)}}else t.exports=function(){}},function(t,e,n){var o=n(13);t.exports=function(t,e){if(!o(t))return t;var n,r;if(e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;if("function"==typeof(n=t.valueOf)&&!o(r=n.call(t)))return r;if(!e&&"function"==typeof(n=t.toString)&&!o(r=n.call(t)))return r;throw TypeError("Can't convert object to primitive value")}},function(t,e,n){var o=n(44)("meta"),r=n(13),i=n(26),a=n(19).f,s=0,l=Object.isExtensible||function(){return!0},c=!n(11)((function(){return l(Object.preventExtensions({}))})),u=function(t){a(t,o,{value:{i:"O"+ ++s,w:{}}})},f=t.exports={KEY:o,NEED:!1,fastKey:function(t,e){if(!r(t))return"symbol"==typeof t?t:("string"==typeof t?"S":"P")+t;if(!i(t,o)){if(!l(t))return"F";if(!e)return"E";u(t)}return t[o].i},getWeak:function(t,e){if(!i(t,o)){if(!l(t))return!0;if(!e)return!1;u(t)}return t[o].w},onFreeze:function(t){return c&&f.NEED&&l(t)&&!i(t,o)&&u(t),t}}},function(t,e,n){var o=n(367),r=n(368),i=n(145),a=n(369);t.exports=function(t){return o(t)||r(t)||i(t)||a()}},function(t,e){t.exports=function(t,e){return{enumerable:!(1&t),configurable:!(2&t),writable:!(4&t),value:e}}},function(t,e){var n=0,o=Math.random();t.exports=function(t){return"Symbol(".concat(void 0===t?"":t,")_",(++n+o).toString(36))}},function(t,e){t.exports=!1},function(t,e,n){var o=n(115),r=n(88);t.exports=Object.keys||function(t){return o(t,r)}},function(t,e,n){var o=n(33),r=Math.max,i=Math.min;t.exports=function(t,e){return(t=o(t))<0?r(t+e,0):i(t,e)}},function(t,e,n){var o=n(12),r=n(116),i=n(88),a=n(87)("IE_PROTO"),s=function(){},l=function(){var t,e=n(85)("iframe"),o=i.length;for(e.style.display="none",n(89).appendChild(e),e.src="javascript:",(t=e.contentWindow.document).open(),t.write("<script>document.F=Object<\/script>"),t.close(),l=t.F;o--;)delete l.prototype[i[o]];return l()};t.exports=Object.create||function(t,e){var n;return null!==t?(s.prototype=o(t),n=new s,s.prototype=null,n[a]=t):n=l(),void 0===e?n:r(n,e)}},function(t,e,n){var o=n(115),r=n(88).concat("length","prototype");e.f=Object.getOwnPropertyNames||function(t){return o(t,r)}},function(t,e,n){var o=n(26),r=n(20),i=n(87)("IE_PROTO"),a=Object.prototype;t.exports=Object.getPrototypeOf||function(t){return t=r(t),o(t,i)?t[i]:"function"==typeof t.constructor&&t instanceof t.constructor?t.constructor.prototype:t instanceof Object?a:null}},function(t,e,n){var o=n(14)("unscopables"),r=Array.prototype;null==r[o]&&n(27)(r,o,{}),t.exports=function(t){r[o][t]=!0}},function(t,e,n){var o=n(13);t.exports=function(t,e){if(!o(t)||t._t!==e)throw TypeError("Incompatible receiver, "+e+" required!");return t}},function(t,e,n){var o=n(19).f,r=n(26),i=n(14)("toStringTag");t.exports=function(t,e,n){t&&!r(t=n?t:t.prototype,i)&&o(t,i,{configurable:!0,value:e})}},function(t,e,n){var o=n(0),r=n(38),i=n(11),a=n(91),s="["+a+"]",l=RegExp("^"+s+s+"*"),c=RegExp(s+s+"*$"),u=function(t,e,n){var r={},s=i((function(){return!!a[t]()||"​"!="​"[t]()})),l=r[t]=s?e(f):a[t];n&&(r[n]=l),o(o.P+o.F*s,"String",r)},f=u.trim=function(t,e){return t=String(r(t)),1&e&&(t=t.replace(l,"")),2&e&&(t=t.replace(c,"")),t};t.exports=u},function(t,e){t.exports={}},function(t,e,n){"use strict";var o=n(10),r=n(19),i=n(18),a=n(14)("species");t.exports=function(t){var e=o[t];i&&e&&!e[a]&&r.f(e,a,{configurable:!0,get:function(){return this}})}},function(t,e){t.exports=function(t,e,n,o){if(!(t instanceof e)||void 0!==o&&o in t)throw TypeError(n+": incorrect invocation!");return t}},function(t,e,n){var o=n(21);t.exports=function(t,e,n){for(var r in e)o(t,r,e[r],n);return t}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(147)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(){(0,r.default)(this,t)}return(0,i.default)(t,null,[{key:"ui",value:function(e,n){return t._t(e,n)}},{key:"t",value:function(e,n){return t._t(e,n)}},{key:"setDictionary",value:function(e){t.currentDictionary=e}},{key:"_t",value:function(e,n){var o=t.getNamespace(e);return o&&o[n]?o[n]:n}},{key:"getNamespace",value:function(e){return e.split(".").reduce((function(t,e){return t&&Object.keys(t).length?t[e]:{}}),t.currentDictionary)}}]),t}();o.default=l,l.displayName="I18n",l.currentDictionary=a.default,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(380),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s){"use strict";var l=n(8),c=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=c(r),i=c(i),a=c(a),s=l(s);var u=function(){function t(e){var n=this;(0,r.default)(this,t),this.iterator=null,this.activated=!1,this.allowArrows=!0,this.onKeyDown=function(e){if(n.isEventReadyForHandling(e))switch(t.usedKeys.includes(e.keyCode)&&e.preventDefault(),e.keyCode){case s.keyCodes.TAB:n.handleTabPress(e);break;case s.keyCodes.LEFT:case s.keyCodes.UP:n.flipLeft();break;case s.keyCodes.RIGHT:case s.keyCodes.DOWN:n.flipRight();break;case s.keyCodes.ENTER:n.handleEnterPress(e)}},this.allowArrows=!s.isBoolean(e.allowArrows)||e.allowArrows,this.iterator=new a.default(e.items,e.focusedItemClass),this.activateCallback=e.activateCallback}return(0,i.default)(t,[{key:"activate",value:function(t){this.activated=!0,t&&this.iterator.setItems(t),document.addEventListener("keydown",this.onKeyDown)}},{key:"deactivate",value:function(){this.activated=!1,this.dropCursor(),document.removeEventListener("keydown",this.onKeyDown)}},{key:"focusFirst",value:function(){this.dropCursor(),this.flipRight()}},{key:"flipLeft",value:function(){this.iterator.previous()}},{key:"flipRight",value:function(){this.iterator.next()}},{key:"dropCursor",value:function(){this.iterator.dropCursor()}},{key:"isEventReadyForHandling",value:function(t){var e=[s.keyCodes.TAB,s.keyCodes.ENTER],n=this.iterator.currentItem==document.activeElement;return this.allowArrows&&!n&&e.push(s.keyCodes.LEFT,s.keyCodes.RIGHT,s.keyCodes.UP,s.keyCodes.DOWN),this.activated&&-1!==e.indexOf(t.keyCode)}},{key:"handleTabPress",value:function(t){switch(t.shiftKey?a.default.directions.LEFT:a.default.directions.RIGHT){case a.default.directions.RIGHT:this.flipRight();break;case a.default.directions.LEFT:this.flipLeft()}}},{key:"handleEnterPress",value:function(t){this.activated&&(this.iterator.currentItem&&this.iterator.currentItem.click(),s.isFunction(this.activateCallback)&&this.activateCallback(this.iterator.currentItem),t.preventDefault(),t.stopPropagation())}},{key:"currentItem",get:function(){return this.iterator.currentItem}}],[{key:"usedKeys",get:function(){return[s.keyCodes.TAB,s.keyCodes.LEFT,s.keyCodes.RIGHT,s.keyCodes.ENTER,s.keyCodes.UP,s.keyCodes.DOWN]}}]),t}();o.default=u,u.displayName="Flipper",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(37);t.exports=Object("z").propertyIsEnumerable(0)?Object:function(t){return"String"==o(t)?t.split(""):Object(t)}},function(t,e){e.f={}.propertyIsEnumerable},function(t,e,n){var o=n(37),r=n(14)("toStringTag"),i="Arguments"==o(function(){return arguments}());t.exports=function(t){var e,n,a;return void 0===t?"Undefined":null===t?"Null":"string"==typeof(n=function(t,e){try{return t[e]}catch(t){}}(e=Object(t),r))?n:i?o(e):"Object"==(a=o(e))&&"function"==typeof e.callee?"Arguments":a}},function(t,e,n){var o=n(12),r=n(32),i=n(14)("species");t.exports=function(t,e){var n,a=o(t).constructor;return void 0===a||null==(n=o(a)[i])?e:r(n)}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(7),n(378)],void 0===(i="function"==typeof(o=function(t,e,o){"use strict";var r=n(1),i=n(8);function a(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n={tags:e},r=new o.default(n);return r.clean(t)}function s(t,n){return Array.isArray(t)?(i=n,t.map((function(t){return s(t,i)}))):e.isObject(t)?function(t,n){var o,r={};for(var i in t)if(Object.prototype.hasOwnProperty.call(t,i)){var a=t[i],l=(o=n[i],e.isObject(o)||e.isBoolean(o)||e.isFunction(o)?n[i]:n);r[i]=s(a,l)}return r}(t,n):e.isString(t)?(o=t,r=n,e.isObject(r)?a(o,r):!1===r?a(o,{}):o):t;var o,r,i}Object.defineProperty(t,"__esModule",{value:!0}),t.sanitizeBlocks=function(t,n){return t.map((function(t){var o=e.isFunction(n)?n(t.tool):n;return e.isEmpty(o)||(t.data=s(t.data,o)),t}))},t.clean=a,e=i(e),o=r(o)})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(23),n(24),n(42),n(2),n(3),n(149),n(168),n(5),n(6),n(4),n(15),n(7),n(111),n(25),n(151)],void 0===(i="function"==typeof(o=function(t,e,o,r,i,a,s,l,c,u,f,d,p,h,v,g,y){"use strict";var b,m=n(8),k=n(1);function x(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.BlockToolAPI=void 0,e=k(e),o=k(o),r=k(r),i=k(i),a=k(a),s=k(s),l=k(l),c=k(c),u=k(u),f=k(f),d=k(d),p=k(p),h=m(h),v=k(v),g=k(g),y=k(y),t.BlockToolAPI=b,function(t){t.APPEND_CALLBACK="appendCallback",t.RENDERED="rendered",t.MOVED="moved",t.UPDATED="updated",t.REMOVED="removed",t.ON_PASTE="onPaste"}(b||(t.BlockToolAPI=b={}));var w=function(t){(0,u.default)(S,t);var n,y,m,k,w=(n=S,function(){var t,e=(0,d.default)(n);if(x()){var o=(0,d.default)(this).constructor;t=Reflect.construct(e,arguments,o)}else t=e.apply(this,arguments);return(0,f.default)(this,t)});function S(t){var e,n=t.id,o=void 0===n?h.generateBlockId():n,r=t.data,s=t.tool,c=t.api,u=t.readOnly,f=t.tunesData;return(0,a.default)(this,S),(e=w.call(this)).cachedInputs=[],e.tunesInstances=new Map,e.defaultTunesInstances=new Map,e.unavailableTunesData={},e.inputIndex=0,e.modificationDebounceTimer=450,e.didMutated=h.debounce((function(t){!t.some((function(t){var e=t.addedNodes,n=void 0===e?[]:e,o=t.removedNodes;return[].concat((0,i.default)(Array.from(n)),(0,i.default)(Array.from(o))).some((function(t){return p.default.isElement(t)&&"true"===t.dataset.mutationFree}))}))&&(e.cachedInputs=[],e.updateCurrentInput(),e.call(b.UPDATED),e.emit("didMutated",(0,l.default)(e)))}),e.modificationDebounceTimer),e.handleFocus=function(){e.cachedInputs=[],e.updateCurrentInput()},e.name=s.name,e.id=o,e.settings=s.settings,e.config=s.settings.config||{},e.api=c,e.blockAPI=new v.default((0,l.default)(e)),e.mutationObserver=new MutationObserver(e.didMutated),e.tool=s,e.toolInstance=s.create(r,e.blockAPI,u),e.tunes=s.tunes,e.composeTunes(f),e.holder=e.compose(),e}return(0,s.default)(S,[{key:"call",value:function(t,e){if(h.isFunction(this.toolInstance[t])){t===b.APPEND_CALLBACK&&h.log("`appendCallback` hook is deprecated and will be removed in the next major release. Use `rendered` hook instead","warn");try{this.toolInstance[t].call(this.toolInstance,e)}catch(e){h.log("Error during '".concat(t,"' call: ").concat(e.message),"error")}}}},{key:"mergeWith",value:(k=(0,r.default)(o.default.mark((function t(e){return o.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.toolInstance.merge(e);case 2:case"end":return t.stop()}}),t,this)}))),function(t){return k.apply(this,arguments)})},{key:"save",value:(m=(0,r.default)(o.default.mark((function t(){var n,r,a,s,l=this;return o.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,this.toolInstance.save(this.pluginsContent);case 2:return n=t.sent,r=this.unavailableTunesData,[].concat((0,i.default)(this.tunesInstances.entries()),(0,i.default)(this.defaultTunesInstances.entries())).forEach((function(t){var n=(0,e.default)(t,2),o=n[0],i=n[1];if(h.isFunction(i.save))try{r[o]=i.save()}catch(t){h.log("Tune ".concat(i.constructor.name," save method throws an Error %o"),"warn",t)}})),a=window.performance.now(),t.abrupt("return",Promise.resolve(n).then((function(t){return s=window.performance.now(),{id:l.id,tool:l.name,data:t,tunes:r,time:s-a}})).catch((function(t){h.log("Saving proccess for ".concat(l.name," tool failed due to the ").concat(t),"log","red")})));case 7:case"end":return t.stop()}}),t,this)}))),function(){return m.apply(this,arguments)})},{key:"validate",value:(y=(0,r.default)(o.default.mark((function t(e){var n;return o.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=!0,!(this.toolInstance.validate instanceof Function)){t.next=5;break}return t.next=4,this.toolInstance.validate(e);case 4:n=t.sent;case 5:return t.abrupt("return",n);case 6:case"end":return t.stop()}}),t,this)}))),function(t){return y.apply(this,arguments)})},{key:"renderTunes",value:function(){var t=document.createDocumentFragment(),e=document.createDocumentFragment();return this.tunesInstances.forEach((function(e){p.default.append(t,e.render())})),this.defaultTunesInstances.forEach((function(t){p.default.append(e,t.render())})),[t,e]}},{key:"updateCurrentInput",value:function(){this.currentInput=p.default.isNativeInput(document.activeElement)||!g.default.anchorNode?document.activeElement:g.default.anchorNode}},{key:"willSelect",value:function(){this.mutationObserver.observe(this.holder.firstElementChild,{childList:!0,subtree:!0,characterData:!0,attributes:!0}),this.addInputEvents()}},{key:"willUnselect",value:function(){this.mutationObserver.disconnect(),this.removeInputEvents()}},{key:"destroy",value:function(){(0,c.default)((0,d.default)(S.prototype),"destroy",this).call(this),h.isFunction(this.toolInstance.destroy)&&this.toolInstance.destroy()}},{key:"renderSettings",value:function(){if(h.isFunction(this.toolInstance.renderSettings))return this.toolInstance.renderSettings()}},{key:"compose",value:function(){var t=p.default.make("div",S.CSS.wrapper),e=p.default.make("div",S.CSS.content),n=this.toolInstance.render();e.appendChild(n);var o=e;return[].concat((0,i.default)(this.tunesInstances.values()),(0,i.default)(this.defaultTunesInstances.values())).forEach((function(t){if(h.isFunction(t.wrap))try{o=t.wrap(o)}catch(e){h.log("Tune ".concat(t.constructor.name," wrap method throws an Error %o"),"warn",e)}})),t.appendChild(o),t}},{key:"composeTunes",value:function(t){var n=this;Array.from(this.tunes.values()).forEach((function(e){(e.isInternal?n.defaultTunesInstances:n.tunesInstances).set(e.name,e.create(t[e.name],n.blockAPI))})),Object.entries(t).forEach((function(t){var o=(0,e.default)(t,2),r=o[0],i=o[1];n.tunesInstances.has(r)||(n.unavailableTunesData[r]=i)}))}},{key:"addInputEvents",value:function(){var t=this;this.inputs.forEach((function(e){e.addEventListener("focus",t.handleFocus),p.default.isNativeInput(e)&&e.addEventListener("input",t.didMutated)}))}},{key:"removeInputEvents",value:function(){var t=this;this.inputs.forEach((function(e){e.removeEventListener("focus",t.handleFocus),p.default.isNativeInput(e)&&e.removeEventListener("input",t.didMutated)}))}},{key:"inputs",get:function(){if(0!==this.cachedInputs.length)return this.cachedInputs;var t=p.default.findAllInputs(this.holder);return this.inputIndex>t.length-1&&(this.inputIndex=t.length-1),this.cachedInputs=t,t}},{key:"currentInput",get:function(){return this.inputs[this.inputIndex]},set:function(t){var e=this.inputs.findIndex((function(e){return e===t||e.contains(t)}));-1!==e&&(this.inputIndex=e)}},{key:"firstInput",get:function(){return this.inputs[0]}},{key:"lastInput",get:function(){var t=this.inputs;return t[t.length-1]}},{key:"nextInput",get:function(){return this.inputs[this.inputIndex+1]}},{key:"previousInput",get:function(){return this.inputs[this.inputIndex-1]}},{key:"data",get:function(){return this.save().then((function(t){return t&&!h.isEmpty(t.data)?t.data:{}}))}},{key:"sanitize",get:function(){return this.tool.sanitizeConfig}},{key:"mergeable",get:function(){return h.isFunction(this.toolInstance.merge)}},{key:"isEmpty",get:function(){var t=p.default.isEmpty(this.pluginsContent),e=!this.hasMedia;return t&&e}},{key:"hasMedia",get:function(){return!!this.holder.querySelector(["img","iframe","video","audio","source","input","textarea","twitterwidget"].join(","))}},{key:"focused",set:function(t){this.holder.classList.toggle(S.CSS.focused,t)},get:function(){return this.holder.classList.contains(S.CSS.focused)}},{key:"selected",set:function(t){t?(this.holder.classList.add(S.CSS.selected),g.default.addFakeCursor(this.holder)):(this.holder.classList.remove(S.CSS.selected),g.default.removeFakeCursor(this.holder))},get:function(){return this.holder.classList.contains(S.CSS.selected)}},{key:"stretched",set:function(t){this.holder.classList.toggle(S.CSS.wrapperStretched,t)},get:function(){return this.holder.classList.contains(S.CSS.wrapperStretched)}},{key:"dropTarget",set:function(t){this.holder.classList.toggle(S.CSS.dropTarget,t)}},{key:"pluginsContent",get:function(){var t=this.holder.querySelector(".".concat(S.CSS.content));if(t&&t.childNodes.length)for(var e=t.childNodes.length-1;e>=0;e--){var n=t.childNodes[e];if(!p.default.isExtensionNode(n))return n}return null}}],[{key:"CSS",get:function(){return{wrapper:"ce-block",wrapperStretched:"ce-block--stretched",content:"ce-block__content",focused:"ce-block--focused",selected:"ce-block--selected",dropTarget:"ce-block--drop-target"}}}]),S}(y.default);t.default=w,w.displayName="Block"})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(7)],void 0===(i="function"==typeof(o=function(t,e,o,r){"use strict";var i,a,s,l,c,u,f=n(8),d=n(1);Object.defineProperty(t,"__esModule",{value:!0}),t.default=t.InternalTuneSettings=t.InternalInlineToolSettings=t.InternalBlockToolSettings=t.CommonInternalSettings=t.UserSettings=t.ToolType=void 0,e=d(e),o=d(o),r=f(r),t.ToolType=i,function(t){t[t.Block=0]="Block",t[t.Inline=1]="Inline",t[t.Tune=2]="Tune"}(i||(t.ToolType=i={})),t.UserSettings=a,function(t){t.Shortcut="shortcut",t.Toolbox="toolbox",t.EnabledInlineTools="inlineToolbar",t.EnabledBlockTunes="tunes",t.Config="config"}(a||(t.UserSettings=a={})),t.CommonInternalSettings=s,function(t){t.Shortcut="shortcut",t.SanitizeConfig="sanitize"}(s||(t.CommonInternalSettings=s={})),t.InternalBlockToolSettings=l,function(t){t.IsEnabledLineBreaks="enableLineBreaks",t.Toolbox="toolbox",t.ConversionConfig="conversionConfig",t.IsReadOnlySupported="isReadOnlySupported",t.PasteConfig="pasteConfig"}(l||(t.InternalBlockToolSettings=l={})),t.InternalInlineToolSettings=c,function(t){t.IsInline="isInline",t.Title="title"}(c||(t.InternalInlineToolSettings=c={})),t.InternalTuneSettings=u,function(t){t.IsTune="isTune"}(u||(t.InternalTuneSettings=u={}));var p=function(){function t(n){var o=n.name,r=n.constructable,i=n.config,a=n.api,s=n.isDefault,l=n.isInternal,c=void 0!==l&&l,u=n.defaultPlaceholder;(0,e.default)(this,t),this.api=a,this.name=o,this.constructable=r,this.config=i,this.isDefault=s,this.isInternal=c,this.defaultPlaceholder=u}return(0,o.default)(t,[{key:"reset",value:function(){if(r.isFunction(this.constructable.reset))return this.constructable.reset()}},{key:"prepare",value:function(){if(r.isFunction(this.constructable.prepare))return this.constructable.prepare({toolName:this.name,config:this.settings})}},{key:"isInline",value:function(){return this.type===i.Inline}},{key:"isBlock",value:function(){return this.type===i.Block}},{key:"isTune",value:function(){return this.type===i.Tune}},{key:"settings",get:function(){var t=this.config[a.Config]||{};return this.isDefault&&!("placeholder"in t)&&this.defaultPlaceholder&&(t.placeholder=this.defaultPlaceholder),t}},{key:"shortcut",get:function(){var t=this.constructable[s.Shortcut];return this.config[a.Shortcut]||t}},{key:"sanitizeConfig",get:function(){return this.constructable[s.SanitizeConfig]||{}}}]),t}();t.default=p,p.displayName="BaseTool"})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(17),r=n(10),i=r["__core-js_shared__"]||(r["__core-js_shared__"]={});(t.exports=function(t,e){return i[t]||(i[t]=void 0!==e?e:{})})("versions",[]).push({version:o.version,mode:n(45)?"pure":"global",copyright:"© 2019 Denis Pushkarev (zloirock.ru)"})},function(t,e,n){var o=n(28),r=n(16),i=n(47);t.exports=function(t){return function(e,n,a){var s,l=o(e),c=r(l.length),u=i(a,c);if(t&&n!=n){for(;c>u;)if((s=l[u++])!=s)return!0}else for(;c>u;u++)if((t||u in l)&&l[u]===n)return t||u||0;return!t&&-1}}},function(t,e){e.f=Object.getOwnPropertySymbols},function(t,e,n){var o=n(37);t.exports=Array.isArray||function(t){return"Array"==o(t)}},function(t,e,n){var o=n(14)("iterator"),r=!1;try{var i=[7][o]();i.return=function(){r=!0},Array.from(i,(function(){throw 2}))}catch(t){}t.exports=function(t,e){if(!e&&!r)return!1;var n=!1;try{var i=[7],a=i[o]();a.next=function(){return{done:n=!0}},i[o]=function(){return a},t(i)}catch(t){}return n}},function(t,e,n){"use strict";var o=n(12);t.exports=function(){var t=o(this),e="";return t.global&&(e+="g"),t.ignoreCase&&(e+="i"),t.multiline&&(e+="m"),t.unicode&&(e+="u"),t.sticky&&(e+="y"),e}},function(t,e,n){"use strict";var o=n(63),r=RegExp.prototype.exec;t.exports=function(t,e){var n=t.exec;if("function"==typeof n){var i=n.call(t,e);if("object"!=typeof i)throw new TypeError("RegExp exec method returned something other than an Object or null");return i}if("RegExp"!==o(t))throw new TypeError("RegExp#exec called on incompatible receiver");return r.call(t,e)}},function(t,e,n){"use strict";n(133);var o=n(21),r=n(27),i=n(11),a=n(38),s=n(14),l=n(106),c=s("species"),u=!i((function(){var t=/./;return t.exec=function(){var t=[];return t.groups={a:"7"},t},"7"!=="".replace(t,"$<a>")})),f=function(){var t=/(?:)/,e=t.exec;t.exec=function(){return e.apply(this,arguments)};var n="ab".split(t);return 2===n.length&&"a"===n[0]&&"b"===n[1]}();t.exports=function(t,e,n){var d=s(t),p=!i((function(){var e={};return e[d]=function(){return 7},7!=""[t](e)})),h=p?!i((function(){var e=!1,n=/a/;return n.exec=function(){return e=!0,null},"split"===t&&(n.constructor={},n.constructor[c]=function(){return n}),n[d](""),!e})):void 0;if(!p||!h||"replace"===t&&!u||"split"===t&&!f){var v=/./[d],g=n(a,d,""[t],(function(t,e,n,o,r){return e.exec===l?p&&!r?{done:!0,value:v.call(e,n,o)}:{done:!0,value:t.call(n,e,o)}:{done:!1}})),y=g[0],b=g[1];o(String.prototype,t,y),r(RegExp.prototype,d,2==e?function(t,e){return b.call(t,this,e)}:function(t){return b.call(t,this)})}}},function(t,e,n){var o=n(31),r=n(128),i=n(101),a=n(12),s=n(16),l=n(103),c={},u={};(e=t.exports=function(t,e,n,f,d){var p,h,v,g,y=d?function(){return t}:l(t),b=o(n,f,e?2:1),m=0;if("function"!=typeof y)throw TypeError(t+" is not iterable!");if(i(y)){for(p=s(t.length);p>m;m++)if((g=e?b(a(h=t[m])[0],h[1]):b(t[m]))===c||g===u)return g}else for(v=y.call(t);!(h=v.next()).done;)if((g=r(v,b,h.value,e))===c||g===u)return g}).BREAK=c,e.RETURN=u},function(t,e,n){var o=n(10).navigator;t.exports=o&&o.userAgent||""},function(t,e,n){"use strict";var o=n(10),r=n(0),i=n(21),a=n(58),s=n(41),l=n(76),c=n(57),u=n(13),f=n(11),d=n(72),p=n(53),h=n(92);t.exports=function(t,e,n,v,g,y){var b=o[t],m=b,k=g?"set":"add",x=m&&m.prototype,w={},S=function(t){var e=x[t];i(x,t,"delete"==t||"has"==t?function(t){return!(y&&!u(t))&&e.call(this,0===t?0:t)}:"get"==t?function(t){return y&&!u(t)?void 0:e.call(this,0===t?0:t)}:"add"==t?function(t){return e.call(this,0===t?0:t),this}:function(t,n){return e.call(this,0===t?0:t,n),this})};if("function"==typeof m&&(y||x.forEach&&!f((function(){(new m).entries().next()})))){var T=new m,E=T[k](y?{}:-0,1)!=T,B=f((function(){T.has(1)})),C=d((function(t){new m(t)})),_=!y&&f((function(){for(var t=new m,e=5;e--;)t[k](e,e);return!t.has(-0)}));C||((m=e((function(e,n){c(e,m,t);var o=h(new b,e,m);return null!=n&&l(n,g,o[k],o),o}))).prototype=x,x.constructor=m),(B||_)&&(S("delete"),S("has"),g&&S("get")),(_||E)&&S(k),y&&x.clear&&delete x.clear}else m=v.getConstructor(e,t,g,k),a(m.prototype,n),s.NEED=!0;return p(m,t),w[t]=m,r(r.G+r.W+r.F*(m!=b),w),y||v.setStrong(m,t,g),m}},function(t,e,n){for(var o,r=n(10),i=n(27),a=n(44),s=a("typed_array"),l=a("view"),c=!(!r.ArrayBuffer||!r.DataView),u=c,f=0,d="Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array".split(",");f<9;)(o=r[d[f++]])?(i(o.prototype,s,!0),i(o.prototype,l,!0)):u=!1;t.exports={ABV:c,CONSTR:u,TYPED:s,VIEW:l}},function(t,e){function n(e){return"function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?t.exports=n=function(t){return typeof t}:t.exports=n=function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},n(e)}t.exports=n},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"getMethodsForTool",value:function(t){return Object.assign(this.methods,{i18n:this.Editor.I18nAPI.getMethodsForTool(t)})}},{key:"methods",get:function(){return{blocks:this.Editor.BlocksAPI.methods,caret:this.Editor.CaretAPI.methods,events:this.Editor.EventsAPI.methods,listeners:this.Editor.ListenersAPI.methods,notifier:this.Editor.NotifierAPI.methods,sanitizer:this.Editor.SanitizerAPI.methods,saver:this.Editor.SaverAPI.methods,selection:this.Editor.SelectionAPI.methods,styles:this.Editor.StylesAPI.classes,toolbar:this.Editor.ToolbarAPI.methods,inlineToolbar:this.Editor.InlineToolbarAPI.methods,tooltip:this.Editor.TooltipAPI.methods,i18n:this.Editor.I18nAPI.methods,readOnly:this.Editor.ReadOnlyAPI.methods}}}]),o}((c=u(c)).default);o.default=d,d.displayName="API",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(379)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(){(0,r.default)(this,t),this.lib=new a.default}return(0,i.default)(t,[{key:"destroy",value:function(){this.lib.destroy()}},{key:"show",value:function(t,e,n){this.lib.show(t,e,n)}},{key:"hide",value:function(){this.lib.hide()}},{key:"onHover",value:function(t,e,n){this.lib.onHover(t,e,n)}}]),t}();o.default=l,l.displayName="Tooltip",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(7),n(59),n(84),n(82)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h){"use strict";var v=n(8),g=n(1);function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=g(r),i=g(i),a=g(a),s=g(s),l=g(l),c=g(c),u=g(u),f=v(f),d=g(d),h=g(h);var b=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(y()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(t){var e,i=t.config,a=t.eventsDispatcher;return(0,r.default)(this,o),(e=n.call(this,{config:i,eventsDispatcher:a})).tooltip=new h.default,e}return(0,i.default)(o,[{key:"toggleReadOnly",value:function(t){t?(this.destroy(),this.Editor.Toolbox.destroy(),this.Editor.BlockSettings.destroy(),this.disableModuleBindings()):(this.drawUI(),this.enableModuleBindings())}},{key:"move",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];t&&(this.Editor.Toolbox.close(),this.Editor.BlockSettings.close());var e=this.Editor.BlockManager.currentBlock.holder;if(e){var n=this.Editor.UI.isMobile,o=e.offsetHeight,r=e.offsetTop;if(n)r+=o;else{var i=Math.floor(o/2);this.nodes.plusButton.style.transform="translate3d(0, calc(".concat(i,"px - 50%), 0)"),this.Editor.Toolbox.nodes.toolbox.style.transform="translate3d(0, calc(".concat(i,"px - 50%), 0)")}this.nodes.wrapper.style.transform="translate3D(0, ".concat(Math.floor(r),"px, 0)")}}},{key:"open",value:function(){var t=this,e=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];f.delay((function(){t.move(n),t.nodes.wrapper.classList.add(t.CSS.toolbarOpened),e?t.blockActions.show():t.blockActions.hide()}),50)()}},{key:"close",value:function(){this.nodes.wrapper.classList.remove(this.CSS.toolbarOpened),this.blockActions.hide(),this.Editor.Toolbox.close(),this.Editor.BlockSettings.close()}},{key:"make",value:function(){var t=this;this.nodes.wrapper=u.default.make("div",this.CSS.toolbar),["content","actions"].forEach((function(e){t.nodes[e]=u.default.make("div",t.CSS[e])})),u.default.append(this.nodes.wrapper,this.nodes.content),u.default.append(this.nodes.content,this.nodes.actions),this.nodes.plusButton=u.default.make("div",this.CSS.plusButton),u.default.append(this.nodes.plusButton,u.default.svg("plus",14,14)),u.default.append(this.nodes.content,this.nodes.plusButton),this.readOnlyMutableListeners.on(this.nodes.plusButton,"click",(function(){t.plusButtonClicked()}),!1);var e=u.default.make("div");e.appendChild(document.createTextNode(d.default.ui(p.I18nInternalNS.ui.toolbar.toolbox,"Add"))),e.appendChild(u.default.make("div",this.CSS.plusButtonShortcut,{textContent:"⇥ Tab"})),this.tooltip.onHover(this.nodes.plusButton,e),this.nodes.blockActionsButtons=u.default.make("div",this.CSS.blockActionsButtons),this.nodes.settingsToggler=u.default.make("span",this.CSS.settingsToggler);var n=u.default.svg("dots",8,8);u.default.append(this.nodes.settingsToggler,n),u.default.append(this.nodes.blockActionsButtons,this.nodes.settingsToggler),u.default.append(this.nodes.actions,this.nodes.blockActionsButtons),this.tooltip.onHover(this.nodes.settingsToggler,d.default.ui(p.I18nInternalNS.ui.blockTunes.toggler,"Click to tune"),{placement:"top"}),u.default.append(this.nodes.content,this.Editor.Toolbox.nodes.toolbox),u.default.append(this.nodes.actions,this.Editor.BlockSettings.nodes.wrapper),u.default.append(this.Editor.UI.nodes.wrapper,this.nodes.wrapper)}},{key:"plusButtonClicked",value:function(){this.Editor.Toolbox.toggle()}},{key:"enableModuleBindings",value:function(){var t=this;this.readOnlyMutableListeners.on(this.nodes.settingsToggler,"mousedown",(function(e){e.stopPropagation(),t.settingsTogglerClicked()}),!0)}},{key:"disableModuleBindings",value:function(){this.readOnlyMutableListeners.clearAll()}},{key:"settingsTogglerClicked",value:function(){this.Editor.BlockSettings.opened?this.Editor.BlockSettings.close():this.Editor.BlockSettings.open()}},{key:"drawUI",value:function(){this.Editor.BlockSettings.make(),this.Editor.Toolbox.make(),this.make()}},{key:"destroy",value:function(){this.removeAllNodes(),this.tooltip.destroy()}},{key:"CSS",get:function(){return{toolbar:"ce-toolbar",content:"ce-toolbar__content",actions:"ce-toolbar__actions",actionsOpened:"ce-toolbar__actions--opened",toolbarOpened:"ce-toolbar--opened",plusButton:"ce-toolbar__plus",plusButtonShortcut:"ce-toolbar__plus-shortcut",plusButtonHidden:"ce-toolbar__plus--hidden",blockActionsButtons:"ce-toolbar__actions-buttons",settingsToggler:"ce-toolbar__settings-btn"}}},{key:"opened",get:function(){return this.nodes.wrapper.classList.contains(this.CSS.toolbarOpened)}},{key:"plusButton",get:function(){var t=this;return{hide:function(){return t.nodes.plusButton.classList.add(t.CSS.plusButtonHidden)},show:function(){t.Editor.Toolbox.isEmpty||t.nodes.plusButton.classList.remove(t.CSS.plusButtonHidden)}}}},{key:"blockActions",get:function(){var t=this;return{hide:function(){t.nodes.actions.classList.remove(t.CSS.actionsOpened)},show:function(){t.nodes.actions.classList.add(t.CSS.actionsOpened)}}}}]),o}(c.default);o.default=b,b.displayName="Toolbar",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(147),n(7)],void 0===(i="function"==typeof(o=function(t,e,o,r){"use strict";var i=n(1);Object.defineProperty(t,"__esModule",{value:!0}),t.I18nInternalNS=void 0,e=i(e);var a=function t(n,o){var i={};return Object.entries(n).forEach((function(n){var a=(0,e.default)(n,2),s=a[0],l=a[1];if((0,r.isObject)(l)){var c=o?"".concat(o,".").concat(s):s,u=Object.values(l).every((function(t){return(0,r.isString)(t)}));i[s]=u?c:t(l,c)}else i[s]=l})),i}((o=i(o)).default);t.I18nInternalNS=a})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(13),r=n(10).document,i=o(r)&&o(r.createElement);t.exports=function(t){return i?r.createElement(t):{}}},function(t,e,n){e.f=n(14)},function(t,e,n){var o=n(68)("keys"),r=n(44);t.exports=function(t){return o[t]||(o[t]=r(t))}},function(t,e){t.exports="constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf".split(",")},function(t,e,n){var o=n(10).document;t.exports=o&&o.documentElement},function(t,e,n){var o=n(13),r=n(12),i=function(t,e){if(r(t),!o(e)&&null!==e)throw TypeError(e+": can't set as prototype!")};t.exports={set:Object.setPrototypeOf||("__proto__"in{}?function(t,e,o){try{(o=n(31)(Function.call,n(34).f(Object.prototype,"__proto__").set,2))(t,[]),e=!(t instanceof Array)}catch(t){e=!0}return function(t,n){return i(t,n),e?t.__proto__=n:o(t,n),t}}({},!1):void 0),check:i}},function(t,e){t.exports="\t\n\v\f\r   ᠎             　\u2028\u2029\ufeff"},function(t,e,n){var o=n(13),r=n(90).set;t.exports=function(t,e,n){var i,a=e.constructor;return a!==n&&"function"==typeof a&&(i=a.prototype)!==n.prototype&&o(i)&&r&&r(t,i),t}},function(t,e,n){"use strict";var o=n(33),r=n(38);t.exports=function(t){var e=String(r(this)),n="",i=o(t);if(i<0||i==1/0)throw RangeError("Count can't be negative");for(;i>0;(i>>>=1)&&(e+=e))1&i&&(n+=e);return n}},function(t,e){t.exports=Math.sign||function(t){return 0==(t=+t)||t!=t?t:t<0?-1:1}},function(t,e){var n=Math.expm1;t.exports=!n||n(10)>22025.465794806718||n(10)<22025.465794806718||-2e-17!=n(-2e-17)?function(t){return 0==(t=+t)?t:t>-1e-6&&t<1e-6?t+t*t/2:Math.exp(t)-1}:n},function(t,e,n){var o=n(33),r=n(38);t.exports=function(t){return function(e,n){var i,a,s=String(r(e)),l=o(n),c=s.length;return l<0||l>=c?t?"":void 0:(i=s.charCodeAt(l))<55296||i>56319||l+1===c||(a=s.charCodeAt(l+1))<56320||a>57343?t?s.charAt(l):i:t?s.slice(l,l+2):a-56320+(i-55296<<10)+65536}}},function(t,e,n){"use strict";var o=n(45),r=n(0),i=n(21),a=n(27),s=n(55),l=n(127),c=n(53),u=n(50),f=n(14)("iterator"),d=!([].keys&&"next"in[].keys()),p=function(){return this};t.exports=function(t,e,n,h,v,g,y){l(n,e,h);var b,m,k,x=function(t){if(!d&&t in E)return E[t];switch(t){case"keys":case"values":return function(){return new n(this,t)}}return function(){return new n(this,t)}},w=e+" Iterator",S="values"==v,T=!1,E=t.prototype,B=E[f]||E["@@iterator"]||v&&E[v],C=B||x(v),_=v?S?x("entries"):C:void 0,O="Array"==e&&E.entries||B;if(O&&(k=u(O.call(new t)))!==Object.prototype&&k.next&&(c(k,w,!0),o||"function"==typeof k[f]||a(k,f,p)),S&&B&&"values"!==B.name&&(T=!0,C=function(){return B.call(this)}),o&&!y||!d&&!T&&E[f]||a(E,f,C),s[e]=C,s[w]=p,v)if(b={values:S?C:x("values"),keys:g?C:x("keys"),entries:_},y)for(m in b)m in E||i(E,m,b[m]);else r(r.P+r.F*(d||T),e,b);return b}},function(t,e,n){var o=n(99),r=n(38);t.exports=function(t,e,n){if(o(e))throw TypeError("String#"+n+" doesn't accept regex!");return String(r(t))}},function(t,e,n){var o=n(13),r=n(37),i=n(14)("match");t.exports=function(t){var e;return o(t)&&(void 0!==(e=t[i])?!!e:"RegExp"==r(t))}},function(t,e,n){var o=n(14)("match");t.exports=function(t){var e=/./;try{"/./"[t](e)}catch(n){try{return e[o]=!1,!"/./"[t](e)}catch(t){}}return!0}},function(t,e,n){var o=n(55),r=n(14)("iterator"),i=Array.prototype;t.exports=function(t){return void 0!==t&&(o.Array===t||i[r]===t)}},function(t,e,n){"use strict";var o=n(19),r=n(43);t.exports=function(t,e,n){e in t?o.f(t,e,r(0,n)):t[e]=n}},function(t,e,n){var o=n(63),r=n(14)("iterator"),i=n(55);t.exports=n(17).getIteratorMethod=function(t){if(null!=t)return t[r]||t["@@iterator"]||i[o(t)]}},function(t,e,n){"use strict";var o=n(20),r=n(47),i=n(16);t.exports=function(t){for(var e=o(this),n=i(e.length),a=arguments.length,s=r(a>1?arguments[1]:void 0,n),l=a>2?arguments[2]:void 0,c=void 0===l?n:r(l,n);c>s;)e[s++]=t;return e}},function(t,e,n){"use strict";var o=n(51),r=n(132),i=n(55),a=n(28);t.exports=n(97)(Array,"Array",(function(t,e){this._t=a(t),this._i=0,this._k=e}),(function(){var t=this._t,e=this._k,n=this._i++;return!t||n>=t.length?(this._t=void 0,r(1)):r(0,"keys"==e?n:"values"==e?t[n]:[n,t[n]])}),"values"),i.Arguments=i.Array,o("keys"),o("values"),o("entries")},function(t,e,n){"use strict";var o,r,i=n(73),a=RegExp.prototype.exec,s=String.prototype.replace,l=a,c=(o=/a/,r=/b*/g,a.call(o,"a"),a.call(r,"a"),0!==o.lastIndex||0!==r.lastIndex),u=void 0!==/()??/.exec("")[1];(c||u)&&(l=function(t){var e,n,o,r,l=this;return u&&(n=new RegExp("^"+l.source+"$(?!\\s)",i.call(l))),c&&(e=l.lastIndex),o=a.call(l,t),c&&o&&(l.lastIndex=l.global?o.index+o[0].length:e),u&&o&&o.length>1&&s.call(o[0],n,(function(){for(r=1;r<arguments.length-2;r++)void 0===arguments[r]&&(o[r]=void 0)})),o}),t.exports=l},function(t,e,n){"use strict";var o=n(96)(!0);t.exports=function(t,e,n){return e+(n?o(t,e).length:1)}},function(t,e,n){var o,r,i,a=n(31),s=n(121),l=n(89),c=n(85),u=n(10),f=u.process,d=u.setImmediate,p=u.clearImmediate,h=u.MessageChannel,v=u.Dispatch,g=0,y={},b=function(){var t=+this;if(y.hasOwnProperty(t)){var e=y[t];delete y[t],e()}},m=function(t){b.call(t.data)};d&&p||(d=function(t){for(var e=[],n=1;arguments.length>n;)e.push(arguments[n++]);return y[++g]=function(){s("function"==typeof t?t:Function(t),e)},o(g),g},p=function(t){delete y[t]},"process"==n(37)(f)?o=function(t){f.nextTick(a(b,t,1))}:v&&v.now?o=function(t){v.now(a(b,t,1))}:h?(i=(r=new h).port2,r.port1.onmessage=m,o=a(i.postMessage,i,1)):u.addEventListener&&"function"==typeof postMessage&&!u.importScripts?(o=function(t){u.postMessage(t+"","*")},u.addEventListener("message",m,!1)):o="onreadystatechange"in c("script")?function(t){l.appendChild(c("script")).onreadystatechange=function(){l.removeChild(this),b.call(t)}}:function(t){setTimeout(a(b,t,1),0)}),t.exports={set:d,clear:p}},function(t,e,n){"use strict";var o=n(10),r=n(18),i=n(45),a=n(79),s=n(27),l=n(58),c=n(11),u=n(57),f=n(33),d=n(16),p=n(140),h=n(49).f,v=n(19).f,g=n(104),y=n(53),b=o.ArrayBuffer,m=o.DataView,k=o.Math,x=o.RangeError,w=o.Infinity,S=b,T=k.abs,E=k.pow,B=k.floor,C=k.log,_=k.LN2,O=r?"_b":"buffer",I=r?"_l":"byteLength",M=r?"_o":"byteOffset";function R(t,e,n){var o,r,i,a=new Array(n),s=8*n-e-1,l=(1<<s)-1,c=l>>1,u=23===e?E(2,-24)-E(2,-77):0,f=0,d=t<0||0===t&&1/t<0?1:0;for((t=T(t))!=t||t===w?(r=t!=t?1:0,o=l):(o=B(C(t)/_),t*(i=E(2,-o))<1&&(o--,i*=2),(t+=o+c>=1?u/i:u*E(2,1-c))*i>=2&&(o++,i/=2),o+c>=l?(r=0,o=l):o+c>=1?(r=(t*i-1)*E(2,e),o+=c):(r=t*E(2,c-1)*E(2,e),o=0));e>=8;a[f++]=255&r,r/=256,e-=8);for(o=o<<e|r,s+=e;s>0;a[f++]=255&o,o/=256,s-=8);return a[--f]|=128*d,a}function A(t,e,n){var o,r=8*n-e-1,i=(1<<r)-1,a=i>>1,s=r-7,l=n-1,c=t[l--],u=127&c;for(c>>=7;s>0;u=256*u+t[l],l--,s-=8);for(o=u&(1<<-s)-1,u>>=-s,s+=e;s>0;o=256*o+t[l],l--,s-=8);if(0===u)u=1-a;else{if(u===i)return o?NaN:c?-w:w;o+=E(2,e),u-=a}return(c?-1:1)*o*E(2,u-e)}function N(t){return t[3]<<24|t[2]<<16|t[1]<<8|t[0]}function P(t){return[255&t]}function L(t){return[255&t,t>>8&255]}function D(t){return[255&t,t>>8&255,t>>16&255,t>>24&255]}function j(t){return R(t,52,8)}function F(t){return R(t,23,4)}function U(t,e,n){v(t.prototype,e,{get:function(){return this[n]}})}function H(t,e,n,o){var r=p(+n);if(r+e>t[I])throw x("Wrong index!");var i=t[O]._b,a=r+t[M],s=i.slice(a,a+e);return o?s:s.reverse()}function z(t,e,n,o,r,i){var a=p(+n);if(a+e>t[I])throw x("Wrong index!");for(var s=t[O]._b,l=a+t[M],c=o(+r),u=0;u<e;u++)s[l+u]=c[i?u:e-u-1]}if(a.ABV){if(!c((function(){b(1)}))||!c((function(){new b(-1)}))||c((function(){return new b,new b(1.5),new b(NaN),"ArrayBuffer"!=b.name}))){for(var W,Y=(b=function(t){return u(this,b),new S(p(t))}).prototype=S.prototype,V=h(S),X=0;V.length>X;)(W=V[X++])in b||s(b,W,S[W]);i||(Y.constructor=b)}var G=new m(new b(2)),K=m.prototype.setInt8;G.setInt8(0,2147483648),G.setInt8(1,2147483649),!G.getInt8(0)&&G.getInt8(1)||l(m.prototype,{setInt8:function(t,e){K.call(this,t,e<<24>>24)},setUint8:function(t,e){K.call(this,t,e<<24>>24)}},!0)}else b=function(t){u(this,b,"ArrayBuffer");var e=p(t);this._b=g.call(new Array(e),0),this[I]=e},m=function(t,e,n){u(this,m,"DataView"),u(t,b,"DataView");var o=t[I],r=f(e);if(r<0||r>o)throw x("Wrong offset!");if(r+(n=void 0===n?o-r:d(n))>o)throw x("Wrong length!");this[O]=t,this[M]=r,this[I]=n},r&&(U(b,"byteLength","_l"),U(m,"buffer","_b"),U(m,"byteLength","_l"),U(m,"byteOffset","_o")),l(m.prototype,{getInt8:function(t){return H(this,1,t)[0]<<24>>24},getUint8:function(t){return H(this,1,t)[0]},getInt16:function(t){var e=H(this,2,t,arguments[1]);return(e[1]<<8|e[0])<<16>>16},getUint16:function(t){var e=H(this,2,t,arguments[1]);return e[1]<<8|e[0]},getInt32:function(t){return N(H(this,4,t,arguments[1]))},getUint32:function(t){return N(H(this,4,t,arguments[1]))>>>0},getFloat32:function(t){return A(H(this,4,t,arguments[1]),23,4)},getFloat64:function(t){return A(H(this,8,t,arguments[1]),52,8)},setInt8:function(t,e){z(this,1,t,P,e)},setUint8:function(t,e){z(this,1,t,P,e)},setInt16:function(t,e){z(this,2,t,L,e,arguments[2])},setUint16:function(t,e){z(this,2,t,L,e,arguments[2])},setInt32:function(t,e){z(this,4,t,D,e,arguments[2])},setUint32:function(t,e){z(this,4,t,D,e,arguments[2])},setFloat32:function(t,e){z(this,4,t,F,e,arguments[2])},setFloat64:function(t,e){z(this,8,t,j,e,arguments[2])}});y(b,"ArrayBuffer"),y(m,"DataView"),s(m.prototype,a.VIEW,!0),e.ArrayBuffer=b,e.DataView=m},function(t,e){function n(e,o){return t.exports=n=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t},n(e,o)}t.exports=n},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e],void 0===(i="function"==typeof(o=function(n){"use strict";Object.defineProperty(n,"__esModule",{value:!0}),n.default=void 0;var o=function(t){var e={get id(){return t.id},get name(){return t.name},get config(){return t.config},get holder(){return t.holder},get isEmpty(){return t.isEmpty},get selected(){return t.selected},set stretched(e){t.stretched=e},get stretched(){return t.stretched},call:function(e,n){return t.call(e,n)},save:function(){return t.save()},validate:function(e){return t.validate(e)}};Object.setPrototypeOf(this,e)};n.default=o,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(42),n(2),n(3),n(383)],void 0===(i="function"==typeof(o=function(o,r,i,a,s){"use strict";var l=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=l(r),i=l(i),a=l(a),s=l(s);var c=function(){function t(){(0,i.default)(this,t),this.registeredShortcuts=new Map}return(0,a.default)(t,[{key:"add",value:function(t){if(this.findShortcut(t.on,t.name))throw Error("Shortcut ".concat(t.name," is already registered for ").concat(t.on,". Please remove it before add a new handler."));var e=new s.default({name:t.name,on:t.on,callback:t.handler}),n=this.registeredShortcuts.get(t.on)||[];this.registeredShortcuts.set(t.on,[].concat((0,r.default)(n),[e]))}},{key:"remove",value:function(t,e){var n=this.findShortcut(t,e);if(n){n.remove();var o=this.registeredShortcuts.get(t);this.registeredShortcuts.set(t,o.filter((function(t){return t!==n})))}}},{key:"findShortcut",value:function(t,e){return(this.registeredShortcuts.get(t)||[]).find((function(t){return t.name===e}))}}]),t}();c.displayName="Shortcuts";var u=new c;o.default=u,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){t.exports=!n(18)&&!n(11)((function(){return 7!=Object.defineProperty(n(85)("div"),"a",{get:function(){return 7}}).a}))},function(t,e,n){var o=n(10),r=n(17),i=n(45),a=n(86),s=n(19).f;t.exports=function(t){var e=r.Symbol||(r.Symbol=i?{}:o.Symbol||{});"_"==t.charAt(0)||t in e||s(e,t,{value:a.f(t)})}},function(t,e,n){var o=n(26),r=n(28),i=n(69)(!1),a=n(87)("IE_PROTO");t.exports=function(t,e){var n,s=r(t),l=0,c=[];for(n in s)n!=a&&o(s,n)&&c.push(n);for(;e.length>l;)o(s,n=e[l++])&&(~i(c,n)||c.push(n));return c}},function(t,e,n){var o=n(19),r=n(12),i=n(46);t.exports=n(18)?Object.defineProperties:function(t,e){r(t);for(var n,a=i(e),s=a.length,l=0;s>l;)o.f(t,n=a[l++],e[n]);return t}},function(t,e,n){var o=n(28),r=n(49).f,i={}.toString,a="object"==typeof window&&window&&Object.getOwnPropertyNames?Object.getOwnPropertyNames(window):[];t.exports.f=function(t){return a&&"[object Window]"==i.call(t)?function(t){try{return r(t)}catch(t){return a.slice()}}(t):r(o(t))}},function(t,e,n){"use strict";var o=n(18),r=n(46),i=n(70),a=n(62),s=n(20),l=n(61),c=Object.assign;t.exports=!c||n(11)((function(){var t={},e={},n=Symbol(),o="abcdefghijklmnopqrst";return t[n]=7,o.split("").forEach((function(t){e[t]=t})),7!=c({},t)[n]||Object.keys(c({},e)).join("")!=o}))?function(t,e){for(var n=s(t),c=arguments.length,u=1,f=i.f,d=a.f;c>u;)for(var p,h=l(arguments[u++]),v=f?r(h).concat(f(h)):r(h),g=v.length,y=0;g>y;)p=v[y++],o&&!d.call(h,p)||(n[p]=h[p]);return n}:c},function(t,e){t.exports=Object.is||function(t,e){return t===e?0!==t||1/t==1/e:t!=t&&e!=e}},function(t,e,n){"use strict";var o=n(32),r=n(13),i=n(121),a=[].slice,s={},l=function(t,e,n){if(!(e in s)){for(var o=[],r=0;r<e;r++)o[r]="a["+r+"]";s[e]=Function("F,a","return new F("+o.join(",")+")")}return s[e](t,n)};t.exports=Function.bind||function(t){var e=o(this),n=a.call(arguments,1),s=function(){var o=n.concat(a.call(arguments));return this instanceof s?l(e,o.length,o):i(e,o,t)};return r(e.prototype)&&(s.prototype=e.prototype),s}},function(t,e){t.exports=function(t,e,n){var o=void 0===n;switch(e.length){case 0:return o?t():t.call(n);case 1:return o?t(e[0]):t.call(n,e[0]);case 2:return o?t(e[0],e[1]):t.call(n,e[0],e[1]);case 3:return o?t(e[0],e[1],e[2]):t.call(n,e[0],e[1],e[2]);case 4:return o?t(e[0],e[1],e[2],e[3]):t.call(n,e[0],e[1],e[2],e[3])}return t.apply(n,e)}},function(t,e,n){var o=n(10).parseInt,r=n(54).trim,i=n(91),a=/^[-+]?0[xX]/;t.exports=8!==o(i+"08")||22!==o(i+"0x16")?function(t,e){var n=r(String(t),3);return o(n,e>>>0||(a.test(n)?16:10))}:o},function(t,e,n){var o=n(10).parseFloat,r=n(54).trim;t.exports=1/o(n(91)+"-0")!=-1/0?function(t){var e=r(String(t),3),n=o(e);return 0===n&&"-"==e.charAt(0)?-0:n}:o},function(t,e,n){var o=n(37);t.exports=function(t,e){if("number"!=typeof t&&"Number"!=o(t))throw TypeError(e);return+t}},function(t,e,n){var o=n(13),r=Math.floor;t.exports=function(t){return!o(t)&&isFinite(t)&&r(t)===t}},function(t,e){t.exports=Math.log1p||function(t){return(t=+t)>-1e-8&&t<1e-8?t-t*t/2:Math.log(1+t)}},function(t,e,n){"use strict";var o=n(48),r=n(43),i=n(53),a={};n(27)(a,n(14)("iterator"),(function(){return this})),t.exports=function(t,e,n){t.prototype=o(a,{next:r(1,n)}),i(t,e+" Iterator")}},function(t,e,n){var o=n(12);t.exports=function(t,e,n,r){try{return r?e(o(n)[0],n[1]):e(n)}catch(e){var i=t.return;throw void 0!==i&&o(i.call(t)),e}}},function(t,e,n){var o=n(281);t.exports=function(t,e){return new(o(t))(e)}},function(t,e,n){var o=n(32),r=n(20),i=n(61),a=n(16);t.exports=function(t,e,n,s,l){o(e);var c=r(t),u=i(c),f=a(c.length),d=l?f-1:0,p=l?-1:1;if(n<2)for(;;){if(d in u){s=u[d],d+=p;break}if(d+=p,l?d<0:f<=d)throw TypeError("Reduce of empty array with no initial value")}for(;l?d>=0:f>d;d+=p)d in u&&(s=e(s,u[d],d,c));return s}},function(t,e,n){"use strict";var o=n(20),r=n(47),i=n(16);t.exports=[].copyWithin||function(t,e){var n=o(this),a=i(n.length),s=r(t,a),l=r(e,a),c=arguments.length>2?arguments[2]:void 0,u=Math.min((void 0===c?a:r(c,a))-l,a-s),f=1;for(l<s&&s<l+u&&(f=-1,l+=u-1,s+=u-1);u-- >0;)l in n?n[s]=n[l]:delete n[s],s+=f,l+=f;return n}},function(t,e){t.exports=function(t,e){return{value:e,done:!!t}}},function(t,e,n){"use strict";var o=n(106);n(0)({target:"RegExp",proto:!0,forced:o!==/./.exec},{exec:o})},function(t,e,n){n(18)&&"g"!=/./g.flags&&n(19).f(RegExp.prototype,"flags",{configurable:!0,get:n(73)})},function(t,e,n){"use strict";var o,r,i,a,s=n(45),l=n(10),c=n(31),u=n(63),f=n(0),d=n(13),p=n(32),h=n(57),v=n(76),g=n(64),y=n(108).set,b=n(301)(),m=n(136),k=n(302),x=n(77),w=n(137),S=l.TypeError,T=l.process,E=T&&T.versions,B=E&&E.v8||"",C=l.Promise,_="process"==u(T),O=function(){},I=r=m.f,M=!!function(){try{var t=C.resolve(1),e=(t.constructor={})[n(14)("species")]=function(t){t(O,O)};return(_||"function"==typeof PromiseRejectionEvent)&&t.then(O)instanceof e&&0!==B.indexOf("6.6")&&-1===x.indexOf("Chrome/66")}catch(t){}}(),R=function(t){var e;return!(!d(t)||"function"!=typeof(e=t.then))&&e},A=function(t,e){if(!t._n){t._n=!0;var n=t._c;b((function(){for(var o=t._v,r=1==t._s,i=0,a=function(e){var n,i,a,s=r?e.ok:e.fail,l=e.resolve,c=e.reject,u=e.domain;try{s?(r||(2==t._h&&L(t),t._h=1),!0===s?n=o:(u&&u.enter(),n=s(o),u&&(u.exit(),a=!0)),n===e.promise?c(S("Promise-chain cycle")):(i=R(n))?i.call(n,l,c):l(n)):c(o)}catch(t){u&&!a&&u.exit(),c(t)}};n.length>i;)a(n[i++]);t._c=[],t._n=!1,e&&!t._h&&N(t)}))}},N=function(t){y.call(l,(function(){var e,n,o,r=t._v,i=P(t);if(i&&(e=k((function(){_?T.emit("unhandledRejection",r,t):(n=l.onunhandledrejection)?n({promise:t,reason:r}):(o=l.console)&&o.error&&o.error("Unhandled promise rejection",r)})),t._h=_||P(t)?2:1),t._a=void 0,i&&e.e)throw e.v}))},P=function(t){return 1!==t._h&&0===(t._a||t._c).length},L=function(t){y.call(l,(function(){var e;_?T.emit("rejectionHandled",t):(e=l.onrejectionhandled)&&e({promise:t,reason:t._v})}))},D=function(t){var e=this;e._d||(e._d=!0,(e=e._w||e)._v=t,e._s=2,e._a||(e._a=e._c.slice()),A(e,!0))},j=function(t){var e,n=this;if(!n._d){n._d=!0,n=n._w||n;try{if(n===t)throw S("Promise can't be resolved itself");(e=R(t))?b((function(){var o={_w:n,_d:!1};try{e.call(t,c(j,o,1),c(D,o,1))}catch(t){D.call(o,t)}})):(n._v=t,n._s=1,A(n,!1))}catch(t){D.call({_w:n,_d:!1},t)}}};M||(C=function(t){h(this,C,"Promise","_h"),p(t),o.call(this);try{t(c(j,this,1),c(D,this,1))}catch(t){D.call(this,t)}},(o=function(t){this._c=[],this._a=void 0,this._s=0,this._d=!1,this._v=void 0,this._h=0,this._n=!1}).prototype=n(58)(C.prototype,{then:function(t,e){var n=I(g(this,C));return n.ok="function"!=typeof t||t,n.fail="function"==typeof e&&e,n.domain=_?T.domain:void 0,this._c.push(n),this._a&&this._a.push(n),this._s&&A(this,!1),n.promise},catch:function(t){return this.then(void 0,t)}}),i=function(){var t=new o;this.promise=t,this.resolve=c(j,t,1),this.reject=c(D,t,1)},m.f=I=function(t){return t===C||t===a?new i(t):r(t)}),f(f.G+f.W+f.F*!M,{Promise:C}),n(53)(C,"Promise"),n(56)("Promise"),a=n(17).Promise,f(f.S+f.F*!M,"Promise",{reject:function(t){var e=I(this);return(0,e.reject)(t),e.promise}}),f(f.S+f.F*(s||!M),"Promise",{resolve:function(t){return w(s&&this===a?C:this,t)}}),f(f.S+f.F*!(M&&n(72)((function(t){C.all(t).catch(O)}))),"Promise",{all:function(t){var e=this,n=I(e),o=n.resolve,r=n.reject,i=k((function(){var n=[],i=0,a=1;v(t,!1,(function(t){var s=i++,l=!1;n.push(void 0),a++,e.resolve(t).then((function(t){l||(l=!0,n[s]=t,--a||o(n))}),r)})),--a||o(n)}));return i.e&&r(i.v),n.promise},race:function(t){var e=this,n=I(e),o=n.reject,r=k((function(){v(t,!1,(function(t){e.resolve(t).then(n.resolve,o)}))}));return r.e&&o(r.v),n.promise}})},function(t,e,n){"use strict";var o=n(32);function r(t){var e,n;this.promise=new t((function(t,o){if(void 0!==e||void 0!==n)throw TypeError("Bad Promise constructor");e=t,n=o})),this.resolve=o(e),this.reject=o(n)}t.exports.f=function(t){return new r(t)}},function(t,e,n){var o=n(12),r=n(13),i=n(136);t.exports=function(t,e){if(o(t),r(e)&&e.constructor===t)return e;var n=i.f(t);return(0,n.resolve)(e),n.promise}},function(t,e,n){"use strict";var o=n(19).f,r=n(48),i=n(58),a=n(31),s=n(57),l=n(76),c=n(97),u=n(132),f=n(56),d=n(18),p=n(41).fastKey,h=n(52),v=d?"_s":"size",g=function(t,e){var n,o=p(e);if("F"!==o)return t._i[o];for(n=t._f;n;n=n.n)if(n.k==e)return n};t.exports={getConstructor:function(t,e,n,c){var u=t((function(t,o){s(t,u,e,"_i"),t._t=e,t._i=r(null),t._f=void 0,t._l=void 0,t[v]=0,null!=o&&l(o,n,t[c],t)}));return i(u.prototype,{clear:function(){for(var t=h(this,e),n=t._i,o=t._f;o;o=o.n)o.r=!0,o.p&&(o.p=o.p.n=void 0),delete n[o.i];t._f=t._l=void 0,t[v]=0},delete:function(t){var n=h(this,e),o=g(n,t);if(o){var r=o.n,i=o.p;delete n._i[o.i],o.r=!0,i&&(i.n=r),r&&(r.p=i),n._f==o&&(n._f=r),n._l==o&&(n._l=i),n[v]--}return!!o},forEach:function(t){h(this,e);for(var n,o=a(t,arguments.length>1?arguments[1]:void 0,3);n=n?n.n:this._f;)for(o(n.v,n.k,this);n&&n.r;)n=n.p},has:function(t){return!!g(h(this,e),t)}}),d&&o(u.prototype,"size",{get:function(){return h(this,e)[v]}}),u},def:function(t,e,n){var o,r,i=g(t,e);return i?i.v=n:(t._l=i={i:r=p(e,!0),k:e,v:n,p:o=t._l,n:void 0,r:!1},t._f||(t._f=i),o&&(o.n=i),t[v]++,"F"!==r&&(t._i[r]=i)),t},getEntry:g,setStrong:function(t,e,n){c(t,e,(function(t,n){this._t=h(t,e),this._k=n,this._l=void 0}),(function(){for(var t=this._k,e=this._l;e&&e.r;)e=e.p;return this._t&&(this._l=e=e?e.n:this._t._f)?u(0,"keys"==t?e.k:"values"==t?e.v:[e.k,e.v]):(this._t=void 0,u(1))}),n?"entries":"values",!n,!0),f(e)}}},function(t,e,n){"use strict";var o=n(58),r=n(41).getWeak,i=n(12),a=n(13),s=n(57),l=n(76),c=n(36),u=n(26),f=n(52),d=c(5),p=c(6),h=0,v=function(t){return t._l||(t._l=new g)},g=function(){this.a=[]},y=function(t,e){return d(t.a,(function(t){return t[0]===e}))};g.prototype={get:function(t){var e=y(this,t);if(e)return e[1]},has:function(t){return!!y(this,t)},set:function(t,e){var n=y(this,t);n?n[1]=e:this.a.push([t,e])},delete:function(t){var e=p(this.a,(function(e){return e[0]===t}));return~e&&this.a.splice(e,1),!!~e}},t.exports={getConstructor:function(t,e,n,i){var c=t((function(t,o){s(t,c,e,"_i"),t._t=e,t._i=h++,t._l=void 0,null!=o&&l(o,n,t[i],t)}));return o(c.prototype,{delete:function(t){if(!a(t))return!1;var n=r(t);return!0===n?v(f(this,e)).delete(t):n&&u(n,this._i)&&delete n[this._i]},has:function(t){if(!a(t))return!1;var n=r(t);return!0===n?v(f(this,e)).has(t):n&&u(n,this._i)}}),c},def:function(t,e,n){var o=r(i(e),!0);return!0===o?v(t).set(e,n):o[t._i]=n,t},ufstore:v}},function(t,e,n){var o=n(33),r=n(16);t.exports=function(t){if(void 0===t)return 0;var e=o(t),n=r(e);if(e!==n)throw RangeError("Wrong length!");return n}},function(t,e,n){var o=n(49),r=n(70),i=n(12),a=n(10).Reflect;t.exports=a&&a.ownKeys||function(t){var e=o.f(i(t)),n=r.f;return n?e.concat(n(t)):e}},function(t,e,n){var o=n(16),r=n(93),i=n(38);t.exports=function(t,e,n,a){var s=String(i(t)),l=s.length,c=void 0===n?" ":String(n),u=o(e);if(u<=l||""==c)return s;var f=u-l,d=r.call(c,Math.ceil(f/c.length));return d.length>f&&(d=d.slice(0,f)),a?d+s:s+d}},function(t,e,n){var o=n(18),r=n(46),i=n(28),a=n(62).f;t.exports=function(t){return function(e){for(var n,s=i(e),l=r(s),c=l.length,u=0,f=[];c>u;)n=l[u++],o&&!a.call(s,n)||f.push(t?[n,s[n]]:s[n]);return f}}},function(t,e,n){var o=function(t){"use strict";var e=Object.prototype,n=e.hasOwnProperty,o="function"==typeof Symbol?Symbol:{},r=o.iterator||"@@iterator",i=o.asyncIterator||"@@asyncIterator",a=o.toStringTag||"@@toStringTag";function s(t,e,n,o){var r=e&&e.prototype instanceof u?e:u,i=Object.create(r.prototype),a=new w(o||[]);return i._invoke=function(t,e,n){var o="suspendedStart";return function(r,i){if("executing"===o)throw new Error("Generator is already running");if("completed"===o){if("throw"===r)throw i;return T()}for(n.method=r,n.arg=i;;){var a=n.delegate;if(a){var s=m(a,n);if(s){if(s===c)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===o)throw o="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);o="executing";var u=l(t,e,n);if("normal"===u.type){if(o=n.done?"completed":"suspendedYield",u.arg===c)continue;return{value:u.arg,done:n.done}}"throw"===u.type&&(o="completed",n.method="throw",n.arg=u.arg)}}}(t,n,a),i}function l(t,e,n){try{return{type:"normal",arg:t.call(e,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=s;var c={};function u(){}function f(){}function d(){}var p={};p[r]=function(){return this};var h=Object.getPrototypeOf,v=h&&h(h(S([])));v&&v!==e&&n.call(v,r)&&(p=v);var g=d.prototype=u.prototype=Object.create(p);function y(t){["next","throw","return"].forEach((function(e){t[e]=function(t){return this._invoke(e,t)}}))}function b(t,e){var o;this._invoke=function(r,i){function a(){return new e((function(o,a){!function o(r,i,a,s){var c=l(t[r],t,i);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==typeof f&&n.call(f,"__await")?e.resolve(f.__await).then((function(t){o("next",t,a,s)}),(function(t){o("throw",t,a,s)})):e.resolve(f).then((function(t){u.value=t,a(u)}),(function(t){return o("throw",t,a,s)}))}s(c.arg)}(r,i,o,a)}))}return o=o?o.then(a,a):a()}}function m(t,e){var n=t.iterator[e.method];if(void 0===n){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,m(t,e),"throw"===e.method))return c;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return c}var o=l(n,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,c;var r=o.arg;return r?r.done?(e[t.resultName]=r.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,c):r:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,c)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function x(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function w(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function S(t){if(t){var e=t[r];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var o=-1,i=function e(){for(;++o<t.length;)if(n.call(t,o))return e.value=t[o],e.done=!1,e;return e.value=void 0,e.done=!0,e};return i.next=i}}return{next:T}}function T(){return{value:void 0,done:!0}}return f.prototype=g.constructor=d,d.constructor=f,d[a]=f.displayName="GeneratorFunction",t.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===f||"GeneratorFunction"===(e.displayName||e.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,d):(t.__proto__=d,a in t||(t[a]="GeneratorFunction")),t.prototype=Object.create(g),t},t.awrap=function(t){return{__await:t}},y(b.prototype),b.prototype[i]=function(){return this},t.AsyncIterator=b,t.async=function(e,n,o,r,i){void 0===i&&(i=Promise);var a=new b(s(e,n,o,r),i);return t.isGeneratorFunction(n)?a:a.next().then((function(t){return t.done?t.value:a.next()}))},y(g),g[a]="Generator",g[r]=function(){return this},g.toString=function(){return"[object Generator]"},t.keys=function(t){var e=[];for(var n in t)e.push(n);return e.reverse(),function n(){for(;e.length;){var o=e.pop();if(o in t)return n.value=o,n.done=!1,n}return n.done=!0,n}},t.values=S,w.prototype={constructor:w,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(x),!t)for(var e in this)"t"===e.charAt(0)&&n.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function o(n,o){return a.type="throw",a.arg=t,e.next=n,o&&(e.method="next",e.arg=void 0),!!o}for(var r=this.tryEntries.length-1;r>=0;--r){var i=this.tryEntries[r],a=i.completion;if("root"===i.tryLoc)return o("end");if(i.tryLoc<=this.prev){var s=n.call(i,"catchLoc"),l=n.call(i,"finallyLoc");if(s&&l){if(this.prev<i.catchLoc)return o(i.catchLoc,!0);if(this.prev<i.finallyLoc)return o(i.finallyLoc)}else if(s){if(this.prev<i.catchLoc)return o(i.catchLoc,!0)}else{if(!l)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return o(i.finallyLoc)}}}},abrupt:function(t,e){for(var o=this.tryEntries.length-1;o>=0;--o){var r=this.tryEntries[o];if(r.tryLoc<=this.prev&&n.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var i=r;break}}i&&("break"===t||"continue"===t)&&i.tryLoc<=e&&e<=i.finallyLoc&&(i=null);var a=i?i.completion:{};return a.type=t,a.arg=e,i?(this.method="next",this.next=i.finallyLoc,c):this.complete(a)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),c},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),x(n),c}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var n=this.tryEntries[e];if(n.tryLoc===t){var o=n.completion;if("throw"===o.type){var r=o.arg;x(n)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,n){return this.delegate={iterator:S(t),resultName:e,nextLoc:n},"next"===this.method&&(this.arg=void 0),c}},t}(t.exports);try{regeneratorRuntime=o}catch(t){Function("r","regeneratorRuntime = r")(o)}},function(t,e,n){var o=n(146);t.exports=function(t,e){if(t){if("string"==typeof t)return o(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(t,e):void 0}}},function(t,e){t.exports=function(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}},function(t){t.exports=JSON.parse('{"ui":{"blockTunes":{"toggler":{"Click to tune":"","or drag to move":""}},"inlineToolbar":{"converter":{"Convert to":""}},"toolbar":{"toolbox":{"Add":""}}},"toolNames":{"Text":"","Link":"","Bold":"","Italic":""},"tools":{"link":{"Add a link":""},"stub":{"The block can not be displayed correctly.":""}},"blockTunes":{"delete":{"Delete":""},"moveUp":{"Move up":""},"moveDown":{"Move down":""}}}')},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(5),n(6),n(4),n(150)],void 0===(i="function"==typeof(o=function(t,e,o,r,i,a){"use strict";var s=n(1);function l(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(t,"__esModule",{value:!0}),t.CriticalError=void 0,e=s(e),o=s(o),r=s(r),i=s(i);var c=function(t){(0,o.default)(s,t);var n,a=(n=s,function(){var t,e=(0,i.default)(n);if(l()){var o=(0,i.default)(this).constructor;t=Reflect.construct(e,arguments,o)}else t=e.apply(this,arguments);return(0,r.default)(this,t)});function s(){return(0,e.default)(this,s),a.apply(this,arguments)}return s}((0,(a=s(a)).default)(Error));t.CriticalError=c,c.displayName="CriticalError"})?o.apply(e,r):o)||(t.exports=i)},function(t,e){t.exports=function(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}},function(t,e,n){var o=n(4),r=n(110),i=n(371),a=n(372);function s(e){var n="function"==typeof Map?new Map:void 0;return t.exports=s=function(t){if(null===t||!i(t))return t;if("function"!=typeof t)throw new TypeError("Super expression must either be null or a function");if(void 0!==n){if(n.has(t))return n.get(t);n.set(t,e)}function e(){return a(t,arguments,o(this).constructor)}return e.prototype=Object.create(t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),r(e,t)},s(e)}t.exports=s},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i);var l=function(){function t(){(0,r.default)(this,t),this.subscribers={}}return(0,i.default)(t,[{key:"on",value:function(t,e){t in this.subscribers||(this.subscribers[t]=[]),this.subscribers[t].push(e)}},{key:"once",value:function(t,e){var n=this;t in this.subscribers||(this.subscribers[t]=[]),this.subscribers[t].push((function o(r){var i=e(r),a=n.subscribers[t].indexOf(o);return-1!==a&&n.subscribers[t].splice(a,1),i}))}},{key:"emit",value:function(t,e){!(0,a.isEmpty)(this.subscribers)&&this.subscribers[t]&&this.subscribers[t].reduce((function(t,e){return e(t)||t}),e)}},{key:"off",value:function(t,e){for(var n=0;n<this.subscribers[t].length;n++)if(this.subscribers[t][n]===e){delete this.subscribers[t][n];break}}},{key:"destroy",value:function(){this.subscribers=null}}]),t}();o.default=l,l.displayName="EventsDispatcher",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(7),n(111),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f){"use strict";var d=n(8),p=n(1);function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=p(r),i=p(i),a=p(a),s=p(s),l=p(l),c=d(c),u=p(u);var v=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(h()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).insert=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.config.defaultBlock,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},o=(arguments.length>2&&void 0!==arguments[2]&&arguments[2],arguments.length>3?arguments[3]:void 0),r=arguments.length>4?arguments[4]:void 0;t.Editor.BlockManager.insert({tool:e,data:n,index:o,needToFocus:r})},t.update=function(e,n){var o=t.Editor.BlockManager,r=o.getBlockById(e);if(r){var i=o.getBlockIndex(r);o.insert({id:r.id,tool:r.name,data:n,index:i,replace:!0,tunes:r.tunes})}else c.log("blocks.update(): Block with passed id was not found","warn")},t}return(0,i.default)(o,[{key:"getBlocksCount",value:function(){return this.Editor.BlockManager.blocks.length}},{key:"getCurrentBlockIndex",value:function(){return this.Editor.BlockManager.currentBlockIndex}},{key:"getBlockByIndex",value:function(t){var e=this.Editor.BlockManager.getBlockByIndex(t);if(void 0!==e)return new u.default(e);c.logLabeled("There is no block at index `"+t+"`","warn")}},{key:"getById",value:function(t){var e=this.Editor.BlockManager.getBlockById(t);return void 0===e?(c.logLabeled("There is no block with id `"+t+"`","warn"),null):new u.default(e)}},{key:"swap",value:function(t,e){c.log("`blocks.swap()` method is deprecated and will be removed in the next major release. Use `block.move()` method instead","info"),this.Editor.BlockManager.swap(t,e),this.Editor.Toolbar.move(!1)}},{key:"move",value:function(t,e){this.Editor.BlockManager.move(t,e),this.Editor.Toolbar.move(!1)}},{key:"delete",value:function(t){try{this.Editor.BlockManager.removeBlock(t)}catch(t){return void c.logLabeled(t,"warn")}0===this.Editor.BlockManager.blocks.length&&this.Editor.BlockManager.insert(),this.Editor.BlockManager.currentBlock&&this.Editor.Caret.setToBlock(this.Editor.BlockManager.currentBlock,this.Editor.Caret.positions.END),this.Editor.Toolbar.close()}},{key:"clear",value:function(){this.Editor.BlockManager.clear(!0),this.Editor.InlineToolbar.close()}},{key:"render",value:function(t){return this.Editor.BlockManager.clear(),this.Editor.Renderer.render(t.blocks)}},{key:"renderFromHTML",value:function(t){return this.Editor.BlockManager.clear(),this.Editor.Paste.processText(t,!0)}},{key:"stretchBlock",value:function(t){var e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];c.deprecationAssert(!0,"blocks.stretchBlock()","BlockAPI");var n=this.Editor.BlockManager.getBlockByIndex(t);n&&(n.stretched=e)}},{key:"insertNewBlock",value:function(){c.log("Method blocks.insertNewBlock() is deprecated and it will be removed in the next major release. Use blocks.insert() instead.","warn"),this.insert()}},{key:"methods",get:function(){var t=this;return{clear:function(){return t.clear()},render:function(e){return t.render(e)},renderFromHTML:function(e){return t.renderFromHTML(e)},delete:function(e){return t.delete(e)},swap:function(e,n){return t.swap(e,n)},move:function(e,n){return t.move(e,n)},getBlockByIndex:function(e){return t.getBlockByIndex(e)},getById:function(e){return t.getById(e)},getCurrentBlockIndex:function(){return t.getCurrentBlockIndex()},getBlocksCount:function(){return t.getBlocksCount()},stretchBlock:function(e){var n=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];return t.stretchBlock(e,n)},insertNewBlock:function(){return t.insertNewBlock()},insert:this.insert,update:this.update}}}]),o}((f=p(f)).default);o.default=v,v.displayName="BlocksAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).setToFirstBlock=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.Editor.Caret.positions.DEFAULT,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return!!t.Editor.BlockManager.firstBlock&&(t.Editor.Caret.setToBlock(t.Editor.BlockManager.firstBlock,e,n),!0)},t.setToLastBlock=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.Editor.Caret.positions.DEFAULT,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return!!t.Editor.BlockManager.lastBlock&&(t.Editor.Caret.setToBlock(t.Editor.BlockManager.lastBlock,e,n),!0)},t.setToPreviousBlock=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.Editor.Caret.positions.DEFAULT,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return!!t.Editor.BlockManager.previousBlock&&(t.Editor.Caret.setToBlock(t.Editor.BlockManager.previousBlock,e,n),!0)},t.setToNextBlock=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:t.Editor.Caret.positions.DEFAULT,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return!!t.Editor.BlockManager.nextBlock&&(t.Editor.Caret.setToBlock(t.Editor.BlockManager.nextBlock,e,n),!0)},t.setToBlock=function(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:t.Editor.Caret.positions.DEFAULT,o=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0;return!!t.Editor.BlockManager.blocks[e]&&(t.Editor.Caret.setToBlock(t.Editor.BlockManager.blocks[e],n,o),!0)},t.focus=function(){var e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];return e?t.setToLastBlock(t.Editor.Caret.positions.END):t.setToFirstBlock(t.Editor.Caret.positions.START)},t}return(0,i.default)(o,[{key:"methods",get:function(){return{setToFirstBlock:this.setToFirstBlock,setToLastBlock:this.setToLastBlock,setToPreviousBlock:this.setToPreviousBlock,setToNextBlock:this.setToNextBlock,setToBlock:this.setToBlock,focus:this.focus}}}]),o}((c=u(c)).default);o.default=d,d.displayName="CaretAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"on",value:function(t,e){this.eventsDispatcher.on(t,e)}},{key:"emit",value:function(t,e){this.eventsDispatcher.emit(t,e)}},{key:"off",value:function(t,e){this.eventsDispatcher.off(t,e)}},{key:"methods",get:function(){var t=this;return{emit:function(e,n){return t.emit(e,n)},off:function(e,n){return t.off(e,n)},on:function(e,n){return t.on(e,n)}}}}]),o}((c=u(c)).default);o.default=d,d.displayName="EventsAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(59),n(7),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f){"use strict";var d=n(1);function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=d(r),i=d(i),a=d(a),s=d(s),l=d(l),c=d(c);var h=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(p()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"getMethodsForTool",value:function(t){return Object.assign(this.methods,{t:function(e){return c.default.t(o.getNamespace(t),e)}})}},{key:"methods",get:function(){return{t:function(){(0,u.logLabeled)("I18n.t() method can be accessed only from Tools","warn")}}}}],[{key:"getNamespace",value:function(t){return t.isTune()?"blockTunes.".concat(t.name):"tools.".concat(t.name)}}]),o}((f=d(f)).default);o.default=h,h.displayName="I18nAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"open",value:function(){this.Editor.InlineToolbar.tryToShow()}},{key:"close",value:function(){this.Editor.InlineToolbar.close()}},{key:"methods",get:function(){var t=this;return{close:function(){return t.close()},open:function(){return t.open()}}}}]),o}((c=u(c)).default);o.default=d,d.displayName="InlineToolbarAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"on",value:function(t,e,n,o){this.listeners.on(t,e,n,o)}},{key:"off",value:function(t,e,n,o){this.listeners.off(t,e,n,o)}},{key:"methods",get:function(){var t=this;return{on:function(e,n,o,r){return t.on(e,n,o,r)},off:function(e,n,o,r){return t.off(e,n,o,r)}}}}]),o}((c=u(c)).default);o.default=d,d.displayName="ListenersAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(376),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l),c=f(c);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(t){var e,i=t.config,a=t.eventsDispatcher;return(0,r.default)(this,o),(e=n.call(this,{config:i,eventsDispatcher:a})).notifier=new c.default,e}return(0,i.default)(o,[{key:"show",value:function(t){return this.notifier.show(t)}},{key:"methods",get:function(){var t=this;return{show:function(e){return t.show(e)}}}}]),o}((u=f(u)).default);o.default=p,p.displayName="NotifierAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"toggle",value:function(t){return this.Editor.ReadOnly.toggle(t)}},{key:"methods",get:function(){var t=this;return{toggle:function(e){return t.toggle(e)},isEnabled:this.isEnabled}}},{key:"isEnabled",get:function(){return this.Editor.ReadOnly.isEnabled}}]),o}((c=u(c)).default);o.default=d,d.displayName="ReadOnlyAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(65)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"clean",value:function(t,e){return(0,u.clean)(t,e)}},{key:"methods",get:function(){var t=this;return{clean:function(e,n){return t.clean(e,n)}}}}]),o}((c=f(c)).default);o.default=p,p.displayName="SanitizerAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(7),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(8),d=n(1);function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=d(r),i=d(i),a=d(a),s=d(s),l=d(l),c=f(c);var h=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(p()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"save",value:function(){var t="Editor's content can not be saved in read-only mode";return this.Editor.ReadOnly.isEnabled?(c.logLabeled(t,"warn"),Promise.reject(new Error(t))):this.Editor.Saver.save()}},{key:"methods",get:function(){var t=this;return{save:function(){return t.save()}}}}]),o}((u=d(u)).default);o.default=h,h.displayName="SaverAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(25),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l),c=f(c);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"findParentTag",value:function(t,e){return(new c.default).findParentTag(t,e)}},{key:"expandToTag",value:function(t){(new c.default).expandToTag(t)}},{key:"methods",get:function(){var t=this;return{findParentTag:function(e,n){return t.findParentTag(e,n)},expandToTag:function(e){return t.expandToTag(e)}}}}]),o}((u=f(u)).default);o.default=p,p.displayName="SelectionAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);function f(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=u(l);var d=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(f()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"classes",get:function(){return{block:"cdx-block",inlineToolButton:"ce-inline-tool",inlineToolButtonActive:"ce-inline-tool--active",input:"cdx-input",loader:"cdx-loader",button:"cdx-button",settingsButton:"cdx-settings-button",settingsButtonActive:"cdx-settings-button--active"}}}]),o}((c=u(c)).default);o.default=d,d.displayName="StylesAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(8),d=n(1);function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=d(r),i=d(i),a=d(a),s=d(s),l=d(l),c=d(c),u=f(u);var h=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(p()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"open",value:function(){this.Editor.Toolbar.open()}},{key:"close",value:function(){this.Editor.Toolbar.close()}},{key:"toggleBlockSettings",value:function(t){if(-1!==this.Editor.BlockManager.currentBlockIndex){var e=null!=t?t:!this.Editor.BlockSettings.opened;t!==this.Editor.BlockSettings.opened&&(e?(this.Editor.Toolbar.opened||(this.Editor.Toolbar.open(!0,!1),this.Editor.Toolbar.plusButton.hide()),this.Editor.BlockSettings.open()):this.Editor.BlockSettings.close())}else u.logLabeled("Could't toggle the Toolbar because there is no block selected ","warn")}},{key:"methods",get:function(){var t=this;return{close:function(){return t.close()},open:function(){return t.open()},toggleBlockSettings:function(e){return t.toggleBlockSettings(e)}}}}]),o}(c.default);o.default=h,h.displayName="ToolbarAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(82)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l),c=f(c),u=f(u);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(t){var e,i=t.config,a=t.eventsDispatcher;return(0,r.default)(this,o),(e=n.call(this,{config:i,eventsDispatcher:a})).tooltip=new u.default,e}return(0,i.default)(o,[{key:"destroy",value:function(){this.tooltip.destroy()}},{key:"show",value:function(t,e,n){this.tooltip.show(t,e,n)}},{key:"hide",value:function(){this.tooltip.hide()}},{key:"onHover",value:function(t,e,n){this.tooltip.onHover(t,e,n)}},{key:"methods",get:function(){var t=this;return{show:function(e,n,o){return t.show(e,n,o)},hide:function(){return t.hide()},onHover:function(e,n,o){return t.onHover(e,n,o)}}}}]),o}(c.default);o.default=p,p.displayName="TooltipAPI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(7),n(25),n(60)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(8),h=n(1);function v(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=h(r),i=h(i),a=h(a),s=h(s),l=h(l),c=h(c),u=p(u),f=h(f),d=h(d);var g=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(v()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"keydown",value:function(t){switch(this.beforeKeydownProcessing(t),t.keyCode){case u.keyCodes.BACKSPACE:this.backspace(t);break;case u.keyCodes.ENTER:this.enter(t);break;case u.keyCodes.DOWN:case u.keyCodes.RIGHT:this.arrowRightAndDown(t);break;case u.keyCodes.UP:case u.keyCodes.LEFT:this.arrowLeftAndUp(t);break;case u.keyCodes.TAB:this.tabPressed(t)}}},{key:"beforeKeydownProcessing",value:function(t){this.needToolbarClosing(t)&&u.isPrintableKey(t.keyCode)&&(this.Editor.Toolbar.close(),this.Editor.ConversionToolbar.close(),t.ctrlKey||t.metaKey||t.altKey||t.shiftKey||(this.Editor.BlockManager.clearFocused(),this.Editor.BlockSelection.clearSelection(t)))}},{key:"keyup",value:function(t){t.shiftKey||this.Editor.UI.checkEmptiness()}},{key:"tabPressed",value:function(t){this.Editor.BlockSelection.clearSelection(t);var e=this.Editor,n=e.BlockManager,o=e.InlineToolbar,r=e.ConversionToolbar,i=n.currentBlock;if(i){var a=i.tool.isDefault&&i.isEmpty,s=!i.isEmpty&&r.opened,l=!i.isEmpty&&!f.default.isCollapsed&&o.opened;a?this.activateToolbox():s||l||this.activateBlockSettings()}}},{key:"dragOver",value:function(t){this.Editor.BlockManager.getBlockByChildNode(t.target).dropTarget=!0}},{key:"dragLeave",value:function(t){this.Editor.BlockManager.getBlockByChildNode(t.target).dropTarget=!1}},{key:"handleCommandC",value:function(t){var e=this.Editor.BlockSelection;e.anyBlockSelected&&e.copySelectedBlocks(t)}},{key:"handleCommandX",value:function(t){var e=this.Editor,n=e.BlockSelection,o=e.BlockManager,r=e.Caret;n.anyBlockSelected&&n.copySelectedBlocks(t).then((function(){var e=o.removeSelectedBlocks(),i=o.insertDefaultBlockAtIndex(e,!0);r.setToBlock(i,r.positions.START),n.clearSelection(t)}))}},{key:"enter",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.UI;if(!n.currentBlock.tool.isLineBreaksEnabled&&!(o.someToolbarOpened&&o.someFlipperButtonFocused||t.shiftKey)){var r=this.Editor.BlockManager.currentBlock;this.Editor.Caret.isAtStart&&!this.Editor.BlockManager.currentBlock.hasMedia?this.Editor.BlockManager.insertDefaultBlockAtIndex(this.Editor.BlockManager.currentBlockIndex):r=this.Editor.BlockManager.split(),this.Editor.Caret.setToBlock(r),r.tool.isDefault&&r.isEmpty&&(this.Editor.Toolbar.open(!1),this.Editor.Toolbar.plusButton.show()),t.preventDefault()}}},{key:"backspace",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.BlockSelection,r=e.Caret,i=n.currentBlock,a=i.tool;if(i.selected||i.isEmpty&&i.currentInput===i.firstInput){t.preventDefault();var s=n.currentBlockIndex;return n.previousBlock&&0===n.previousBlock.inputs.length?n.removeBlock(s-1):n.removeBlock(),r.setToBlock(n.currentBlock,s?r.positions.END:r.positions.START),this.Editor.Toolbar.close(),void o.clearSelection(t)}if(!a.isLineBreaksEnabled||r.isAtStart){var l=0===n.currentBlockIndex;r.isAtStart&&f.default.isCollapsed&&i.currentInput===i.firstInput&&!l&&(t.preventDefault(),this.mergeBlocks())}}},{key:"mergeBlocks",value:function(){var t=this.Editor,e=t.BlockManager,n=t.Caret,o=t.Toolbar,r=e.previousBlock,i=e.currentBlock;if(i.name!==r.name||!r.mergeable)return 0===r.inputs.length||r.isEmpty?(e.removeBlock(e.currentBlockIndex-1),n.setToBlock(e.currentBlock),void o.close()):void(n.navigatePrevious()&&o.close());n.createShadow(r.pluginsContent),e.mergeBlocks(r,i).then((function(){n.restoreCaret(r.pluginsContent),r.pluginsContent.normalize(),o.close()}))}},{key:"arrowRightAndDown",value:function(t){var e=this,n=d.default.usedKeys.includes(t.keyCode)&&(!t.shiftKey||t.keyCode===u.keyCodes.TAB);if(!this.Editor.UI.someToolbarOpened||!n){this.Editor.BlockManager.clearFocused(),this.Editor.Toolbar.close();var o=this.Editor.Caret.isAtEnd||this.Editor.BlockSelection.anyBlockSelected;t.shiftKey&&t.keyCode===u.keyCodes.DOWN&&o?this.Editor.CrossBlockSelection.toggleBlockSelectedState():((t.keyCode===u.keyCodes.DOWN||t.keyCode===u.keyCodes.RIGHT&&!this.isRtl?this.Editor.Caret.navigateNext():this.Editor.Caret.navigatePrevious())?t.preventDefault():u.delay((function(){e.Editor.BlockManager.currentBlock&&e.Editor.BlockManager.currentBlock.updateCurrentInput()}),20)(),this.Editor.BlockSelection.clearSelection(t))}}},{key:"arrowLeftAndUp",value:function(t){var e=this;if(this.Editor.UI.someToolbarOpened){if(d.default.usedKeys.includes(t.keyCode)&&(!t.shiftKey||t.keyCode===u.keyCodes.TAB))return;this.Editor.UI.closeAllToolbars()}this.Editor.BlockManager.clearFocused(),this.Editor.Toolbar.close();var n=this.Editor.Caret.isAtStart||this.Editor.BlockSelection.anyBlockSelected;t.shiftKey&&t.keyCode===u.keyCodes.UP&&n?this.Editor.CrossBlockSelection.toggleBlockSelectedState(!1):((t.keyCode===u.keyCodes.UP||t.keyCode===u.keyCodes.LEFT&&!this.isRtl?this.Editor.Caret.navigatePrevious():this.Editor.Caret.navigateNext())?t.preventDefault():u.delay((function(){e.Editor.BlockManager.currentBlock&&e.Editor.BlockManager.currentBlock.updateCurrentInput()}),20)(),this.Editor.BlockSelection.clearSelection(t))}},{key:"needToolbarClosing",value:function(t){var e=t.keyCode===u.keyCodes.ENTER&&this.Editor.Toolbox.opened,n=t.keyCode===u.keyCodes.ENTER&&this.Editor.BlockSettings.opened,o=t.keyCode===u.keyCodes.ENTER&&this.Editor.InlineToolbar.opened,r=t.keyCode===u.keyCodes.ENTER&&this.Editor.ConversionToolbar.opened,i=t.keyCode===u.keyCodes.TAB;return!(t.shiftKey||i||e||n||o||r)}},{key:"activateToolbox",value:function(){this.Editor.Toolbar.opened||(this.Editor.Toolbar.open(!1,!1),this.Editor.Toolbar.plusButton.show()),this.Editor.Toolbox.open()}},{key:"activateBlockSettings",value:function(){this.Editor.Toolbar.opened||(this.Editor.BlockManager.currentBlock.focused=!0,this.Editor.Toolbar.open(!0,!1),this.Editor.Toolbar.plusButton.hide()),this.Editor.BlockSettings.opened||this.Editor.BlockSettings.open()}}]),o}(c.default);o.default=g,g.displayName="BlockEvents",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(66),n(9),n(15),n(7),n(382),n(111)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g){"use strict";var y=n(8),b=n(1);function m(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=b(r),i=b(i),a=b(a),s=b(s),l=b(l),c=b(c),u=b(u),f=y(f),d=b(d),p=b(p),h=y(h),v=b(v),g=b(g);var k=function(t){(0,l.default)(y,t);var e,n,o,d=(e=y,function(){var t,n=(0,u.default)(e);if(m()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function y(){var t;return(0,a.default)(this,y),(t=d.apply(this,arguments))._currentBlockIndex=-1,t._blocks=null,t}return(0,s.default)(y,[{key:"prepare",value:function(){var t=this,e=new v.default(this.Editor.UI.nodes.redactor);this._blocks=new Proxy(e,{set:v.default.set,get:v.default.get}),this.listeners.on(document,"copy",(function(e){return t.Editor.BlockEvents.handleCommandC(e)}))}},{key:"toggleReadOnly",value:function(t){t?this.disableModuleBindings():this.enableModuleBindings()}},{key:"composeBlock",value:function(t){var e=t.tool,n=t.data,o=void 0===n?{}:n,r=t.id,i=void 0===r?void 0:r,a=t.tunes,s=void 0===a?{}:a,l=this.Editor.ReadOnly.isEnabled,c=this.Editor.Tools.blockTools.get(e),u=new f.default({id:i,data:o,tool:c,api:this.Editor.API,readOnly:l,tunesData:s});return l||this.bindBlockEvents(u),u}},{key:"insert",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=t.id,n=void 0===e?void 0:e,o=t.tool,r=void 0===o?this.config.defaultBlock:o,i=t.data,a=void 0===i?{}:i,s=t.index,l=t.needToFocus,c=void 0===l||l,u=t.replace,f=void 0!==u&&u,d=t.tunes,p=void 0===d?{}:d,h=s;void 0===h&&(h=this.currentBlockIndex+(f?0:1));var v=this.composeBlock({id:n,tool:r,data:a,tunes:p});return this._blocks.insert(h,v,f),this.blockDidMutated(v),c?this.currentBlockIndex=h:h<=this.currentBlockIndex&&this.currentBlockIndex++,v}},{key:"replace",value:function(t){var e=t.tool,n=void 0===e?this.config.defaultBlock:e,o=t.data,r=void 0===o?{}:o;return this.insert({tool:n,data:r,index:this.currentBlockIndex,replace:!0})}},{key:"paste",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],o=this.insert({tool:t,replace:n});try{o.call(f.BlockToolAPI.ON_PASTE,e)}catch(e){h.log("".concat(t,": onPaste callback call is failed"),"error",e)}return o}},{key:"insertDefaultBlockAtIndex",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.composeBlock({tool:this.config.defaultBlock});return this._blocks[t]=n,this.blockDidMutated(n),e?this.currentBlockIndex=t:t<=this.currentBlockIndex&&this.currentBlockIndex++,n}},{key:"insertAtEnd",value:function(){return this.currentBlockIndex=this.blocks.length-1,this.insert()}},{key:"mergeBlocks",value:(o=(0,i.default)(r.default.mark((function t(e,n){var o,i;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(o=this._blocks.indexOf(n),!n.isEmpty){t.next=3;break}return t.abrupt("return");case 3:return t.next=5,n.data;case 5:if(i=t.sent,h.isEmpty(i)){t.next=9;break}return t.next=9,e.mergeWith(i);case 9:this.removeBlock(o),this.currentBlockIndex=this._blocks.indexOf(e);case 11:case"end":return t.stop()}}),t,this)}))),function(t,e){return o.apply(this,arguments)})},{key:"removeBlock",value:function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.currentBlockIndex;if(!this.validateIndex(t))throw new Error("Can't find a Block to remove");var e=this._blocks[t];e.destroy(),this._blocks.remove(t),this.blockDidMutated(e),this.currentBlockIndex>=t&&this.currentBlockIndex--,this.blocks.length?0===t&&(this.currentBlockIndex=0):(this.currentBlockIndex=-1,this.insert())}},{key:"removeSelectedBlocks",value:function(){for(var t,e=this.blocks.length-1;e>=0;e--)this.blocks[e].selected&&(this.removeBlock(e),t=e);return t}},{key:"removeAllBlocks",value:function(){for(var t=this.blocks.length-1;t>=0;t--)this._blocks.remove(t);this.currentBlockIndex=-1,this.insert(),this.currentBlock.firstInput.focus()}},{key:"split",value:function(){var t=this.Editor.Caret.extractFragmentFromCaretPosition(),e=p.default.make("div");e.appendChild(t);var n={text:p.default.isEmpty(e)?"":e.innerHTML};return this.insert({data:n})}},{key:"getBlockByIndex",value:function(t){return this._blocks[t]}},{key:"getBlockIndex",value:function(t){return this._blocks.indexOf(t)}},{key:"getBlockById",value:function(t){return this._blocks.array.find((function(e){return e.id===t}))}},{key:"getBlock",value:function(t){p.default.isElement(t)||(t=t.parentNode);var e=this._blocks.nodes,n=t.closest(".".concat(f.default.CSS.wrapper)),o=e.indexOf(n);if(o>=0)return this._blocks[o]}},{key:"highlightCurrentNode",value:function(){this.clearFocused(),this.currentBlock.focused=!0}},{key:"clearFocused",value:function(){this.blocks.forEach((function(t){t.focused=!1}))}},{key:"setCurrentBlockByChildNode",value:function(t){p.default.isElement(t)||(t=t.parentNode);var e=t.closest(".".concat(f.default.CSS.wrapper));if(e){var n=e.closest(".".concat(this.Editor.UI.CSS.editorWrapper));if(null==n?void 0:n.isEqualNode(this.Editor.UI.nodes.wrapper))return this.currentBlockIndex=this._blocks.nodes.indexOf(e),this.currentBlock.updateCurrentInput(),this.currentBlock}}},{key:"getBlockByChildNode",value:function(t){p.default.isElement(t)||(t=t.parentNode);var e=t.closest(".".concat(f.default.CSS.wrapper));return this.blocks.find((function(t){return t.holder===e}))}},{key:"swap",value:function(t,e){this._blocks.swap(t,e),this.currentBlockIndex=e}},{key:"move",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.currentBlockIndex;isNaN(t)||isNaN(e)?h.log("Warning during 'move' call: incorrect indices provided.","warn"):this.validateIndex(t)&&this.validateIndex(e)?(this._blocks.move(t,e),this.currentBlockIndex=t,this.blockDidMutated(this.currentBlock)):h.log("Warning during 'move' call: indices cannot be lower than 0 or greater than the amount of blocks.","warn")}},{key:"dropPointer",value:function(){this.currentBlockIndex=-1,this.clearFocused()}},{key:"clear",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this._blocks.removeAll(),this.dropPointer(),t&&this.insert(),this.Editor.UI.checkEmptiness()}},{key:"destroy",value:(n=(0,i.default)(r.default.mark((function t(){return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,Promise.all(this.blocks.map((function(t){return t.destroy()})));case 2:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"bindBlockEvents",value:function(t){var e=this,n=this.Editor.BlockEvents;this.readOnlyMutableListeners.on(t.holder,"keydown",(function(t){n.keydown(t)})),this.readOnlyMutableListeners.on(t.holder,"keyup",(function(t){n.keyup(t)})),this.readOnlyMutableListeners.on(t.holder,"dragover",(function(t){n.dragOver(t)})),this.readOnlyMutableListeners.on(t.holder,"dragleave",(function(t){n.dragLeave(t)})),t.on("didMutated",(function(t){return e.blockDidMutated(t)}))}},{key:"disableModuleBindings",value:function(){this.readOnlyMutableListeners.clearAll()}},{key:"enableModuleBindings",value:function(){var t=this;this.readOnlyMutableListeners.on(document,"cut",(function(e){return t.Editor.BlockEvents.handleCommandX(e)})),this.blocks.forEach((function(e){t.bindBlockEvents(e)}))}},{key:"validateIndex",value:function(t){return!(t<0||t>=this._blocks.length)}},{key:"blockDidMutated",value:function(t){return this.Editor.ModificationsObserver.onChange(new g.default(t)),t}},{key:"currentBlockIndex",get:function(){return this._currentBlockIndex},set:function(t){this._blocks[this._currentBlockIndex]&&this._blocks[this._currentBlockIndex].willUnselect(),this._blocks[t]&&this._blocks[t].willSelect(),this._currentBlockIndex=t}},{key:"firstBlock",get:function(){return this._blocks[0]}},{key:"lastBlock",get:function(){return this._blocks[this._blocks.length-1]}},{key:"currentBlock",get:function(){return this._blocks[this.currentBlockIndex]}},{key:"nextBlock",get:function(){return this.currentBlockIndex===this._blocks.length-1?null:this._blocks[this.currentBlockIndex+1]}},{key:"nextContentfulBlock",get:function(){return this.blocks.slice(this.currentBlockIndex+1).find((function(t){return!!t.inputs.length}))}},{key:"previousContentfulBlock",get:function(){return this.blocks.slice(0,this.currentBlockIndex).reverse().find((function(t){return!!t.inputs.length}))}},{key:"previousBlock",get:function(){return 0===this.currentBlockIndex?null:this._blocks[this.currentBlockIndex-1]}},{key:"blocks",get:function(){return this._blocks.array}},{key:"isEditorEmpty",get:function(){return this.blocks.every((function(t){return t.isEmpty}))}}]),y}(d.default);o.default=k,k.displayName="BlockManager",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(381);function r(e,n,i){return"undefined"!=typeof Reflect&&Reflect.get?t.exports=r=Reflect.get:t.exports=r=function(t,e,n){var r=o(t,e);if(r){var i=Object.getOwnPropertyDescriptor(r,e);return i.get?i.get.call(n):i.value}},r(e,n,i||e)}t.exports=r},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(7),n(15),n(112),n(25),n(65)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h){"use strict";var v=n(8),g=n(1);function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=g(r),i=g(i),a=g(a),s=g(s),l=g(l),c=g(c),u=v(u),f=g(f),d=g(d),p=g(p);var b=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(y()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).anyBlockSelectedCache=null,t.needToSelectAll=!1,t.nativeInputSelected=!1,t.readyToBlockSelection=!1,t}return(0,i.default)(o,[{key:"prepare",value:function(){var t=this;this.selection=new p.default,d.default.add({name:"CMD+A",handler:function(e){var n=t.Editor,o=n.BlockManager;if(n.ReadOnly.isEnabled)return e.preventDefault(),void t.selectAllBlocks();o.currentBlock&&t.handleCommandA(e)},on:this.Editor.UI.nodes.redactor})}},{key:"toggleReadOnly",value:function(t){p.default.get().removeAllRanges(),this.allBlocksSelected=!1}},{key:"unSelectBlockByIndex",value:function(t){var e=this.Editor.BlockManager;(isNaN(t)?e.currentBlock:e.getBlockByIndex(t)).selected=!1,this.clearCache()}},{key:"clearSelection",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=this.Editor,o=n.BlockManager,r=n.Caret,i=n.RectangleSelection;this.needToSelectAll=!1,this.nativeInputSelected=!1,this.readyToBlockSelection=!1;var a=t&&t instanceof KeyboardEvent,s=a&&u.isPrintableKey(t.keyCode);if(this.anyBlockSelected&&a&&s&&!p.default.isSelectionExists){var l=o.removeSelectedBlocks();o.insertDefaultBlockAtIndex(l,!0),r.setToBlock(o.currentBlock),u.delay((function(){var e=t.key;r.insertContentAtCaretPosition(e.length>1?"":e)}),20)()}this.Editor.CrossBlockSelection.clear(t),this.anyBlockSelected&&!i.isRectActivated()?(e&&this.selection.restore(),this.allBlocksSelected=!1):this.Editor.RectangleSelection.clearSelection()}},{key:"copySelectedBlocks",value:function(t){var e=this;t.preventDefault();var n=f.default.make("div");this.selectedBlocks.forEach((function(t){var o=(0,h.clean)(t.holder.innerHTML,e.sanitizerConfig),r=f.default.make("p");r.innerHTML=o,n.appendChild(r)}));var o=Array.from(n.childNodes).map((function(t){return t.textContent})).join("\n\n"),r=n.innerHTML;return t.clipboardData.setData("text/plain",o),t.clipboardData.setData("text/html",r),Promise.all(this.selectedBlocks.map((function(t){return t.save()}))).then((function(n){try{t.clipboardData.setData(e.Editor.Paste.MIME_TYPE,JSON.stringify(n))}catch(t){}}))}},{key:"selectBlockByIndex",value:function(t){var e,n=this.Editor.BlockManager;n.clearFocused(),e=isNaN(t)?n.currentBlock:n.getBlockByIndex(t),this.selection.save(),p.default.get().removeAllRanges(),e.selected=!0,this.clearCache(),this.Editor.InlineToolbar.close()}},{key:"clearCache",value:function(){this.anyBlockSelectedCache=null}},{key:"destroy",value:function(){d.default.remove(this.Editor.UI.nodes.redactor,"CMD+A")}},{key:"handleCommandA",value:function(t){if(this.Editor.RectangleSelection.clearSelection(),!f.default.isNativeInput(t.target)||this.readyToBlockSelection){var e=this.Editor.BlockManager.getBlock(t.target).inputs;e.length>1&&!this.readyToBlockSelection?this.readyToBlockSelection=!0:1!==e.length||this.needToSelectAll?this.needToSelectAll?(t.preventDefault(),this.selectAllBlocks(),this.needToSelectAll=!1,this.readyToBlockSelection=!1,this.Editor.ConversionToolbar.close()):this.readyToBlockSelection&&(t.preventDefault(),this.selectBlockByIndex(),this.needToSelectAll=!0):this.needToSelectAll=!0}else this.readyToBlockSelection=!0}},{key:"selectAllBlocks",value:function(){this.selection.save(),p.default.get().removeAllRanges(),this.allBlocksSelected=!0,this.Editor.InlineToolbar.close()}},{key:"sanitizerConfig",get:function(){return{p:{},h1:{},h2:{},h3:{},h4:{},h5:{},h6:{},ol:{},ul:{},li:{},br:!0,img:{src:!0,width:!0,height:!0},a:{href:!0},b:{},i:{},u:{}}}},{key:"allBlocksSelected",get:function(){return this.Editor.BlockManager.blocks.every((function(t){return!0===t.selected}))},set:function(t){this.Editor.BlockManager.blocks.forEach((function(e){e.selected=t})),this.clearCache()}},{key:"anyBlockSelected",get:function(){var t=this.Editor.BlockManager;return null===this.anyBlockSelectedCache&&(this.anyBlockSelectedCache=t.blocks.some((function(t){return!0===t.selected}))),this.anyBlockSelectedCache}},{key:"selectedBlocks",get:function(){return this.Editor.BlockManager.blocks.filter((function(t){return t.selected}))}}]),o}(c.default);o.default=b,b.displayName="BlockSelection",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(25),n(9),n(15),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(8),h=n(1);function v(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=h(r),i=h(i),a=h(a),s=h(s),l=h(l),c=h(c),u=h(u),f=h(f),d=p(d);var g=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(v()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){return(0,r.default)(this,o),n.apply(this,arguments)}return(0,i.default)(o,[{key:"setToBlock",value:function(t){var e,n=this,o=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.positions.DEFAULT,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=this.Editor.BlockManager;switch(o){case this.positions.START:e=t.firstInput;break;case this.positions.END:e=t.lastInput;break;default:e=t.currentInput}if(e){var a=f.default.getDeepestNode(e,o===this.positions.END),s=f.default.getContentLength(a);switch(!0){case o===this.positions.START:r=0;break;case o===this.positions.END:case r>s:r=s}d.delay((function(){n.set(a,r)}),20)(),i.setCurrentBlockByChildNode(t.holder),i.currentBlock.currentInput=e}}},{key:"setToInput",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:this.positions.DEFAULT,n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,o=this.Editor.BlockManager.currentBlock,r=f.default.getDeepestNode(t);switch(e){case this.positions.START:this.set(r,0);break;case this.positions.END:this.set(r,f.default.getContentLength(r));break;default:n&&this.set(r,n)}o.currentInput=t}},{key:"set",value:function(t){var e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=c.default.setCursor(t,e),o=n.top,r=n.bottom,i=window,a=i.innerHeight;o<0&&window.scrollBy(0,o),r>a&&window.scrollBy(0,r-a)}},{key:"setToTheLastBlock",value:function(){var t=this.Editor.BlockManager.lastBlock;if(t)if(t.tool.isDefault&&t.isEmpty)this.setToBlock(t);else{var e=this.Editor.BlockManager.insertAtEnd();this.setToBlock(e)}}},{key:"extractFragmentFromCaretPosition",value:function(){var t=c.default.get();if(t.rangeCount){var e=t.getRangeAt(0),n=this.Editor.BlockManager.currentBlock.currentInput;if(e.deleteContents(),n){if(f.default.isNativeInput(n)){var o=n,r=document.createDocumentFragment(),i=o.value.substring(0,o.selectionStart),a=o.value.substring(o.selectionStart);return r.textContent=a,o.value=i,r}var s=e.cloneRange();return s.selectNodeContents(n),s.setStart(e.endContainer,e.endOffset),s.extractContents()}}}},{key:"navigateNext",value:function(){var t=this.Editor.BlockManager,e=t.currentBlock,n=t.nextContentfulBlock,o=e.nextInput,r=this.isAtEnd,i=n;if(!i&&!o){if(e.tool.isDefault||!r)return!1;i=t.insertAtEnd()}return!!r&&(o?this.setToInput(o,this.positions.START):this.setToBlock(i,this.positions.START),!0)}},{key:"navigatePrevious",value:function(){var t=this.Editor.BlockManager,e=t.currentBlock,n=t.previousContentfulBlock;if(!e)return!1;var o=e.previousInput;return!(!n&&!o||!this.isAtStart||(o?this.setToInput(o,this.positions.END):this.setToBlock(n,this.positions.END),0))}},{key:"createShadow",value:function(t){var e=document.createElement("span");e.classList.add(o.CSS.shadowCaret),t.insertAdjacentElement("beforeend",e)}},{key:"restoreCaret",value:function(t){var e=t.querySelector(".".concat(o.CSS.shadowCaret));e&&((new c.default).expandToTag(e),setTimeout((function(){var t=document.createRange();t.selectNode(e),t.extractContents()}),50))}},{key:"insertContentAtCaretPosition",value:function(t){var e=document.createDocumentFragment(),n=document.createElement("div"),o=c.default.get(),r=c.default.range;n.innerHTML=t,Array.from(n.childNodes).forEach((function(t){return e.appendChild(t)})),0===e.childNodes.length&&e.appendChild(new Text);var i=e.lastChild;r.deleteContents(),r.insertNode(e);var a=document.createRange();a.setStart(i,i.textContent.length),o.removeAllRanges(),o.addRange(a)}},{key:"getHigherLevelSiblings",value:function(t,e){for(var n=t,o=[];n.parentNode&&"true"!==n.parentNode.contentEditable;)n=n.parentNode;for(var r="left"===e?"previousSibling":"nextSibling";n[r];)n=n[r],o.push(n);return o}},{key:"positions",get:function(){return{START:"start",END:"end",DEFAULT:"default"}}},{key:"isAtStart",get:function(){var t=c.default.get(),e=f.default.getDeepestNode(this.Editor.BlockManager.currentBlock.currentInput),n=t.focusNode;if(f.default.isNativeInput(e))return 0===e.selectionEnd;if(!t.anchorNode)return!1;var o=n.textContent.search(/\S/);-1===o&&(o=0);var r=t.focusOffset;return n.nodeType!==Node.TEXT_NODE&&n.childNodes.length&&(n.childNodes[r]?(n=n.childNodes[r],r=0):r=(n=n.childNodes[r-1]).textContent.length),!(!f.default.isLineBreakTag(e)&&!f.default.isEmpty(e)||!this.getHigherLevelSiblings(n,"left").every((function(t){var e=f.default.isLineBreakTag(t),n=1===t.children.length&&f.default.isLineBreakTag(t.children[0]),o=e||n;return f.default.isEmpty(t)&&!o}))||r!==o)||(null===e||n===e&&r<=o)}},{key:"isAtEnd",get:function(){var t=c.default.get(),e=t.focusNode,n=f.default.getDeepestNode(this.Editor.BlockManager.currentBlock.currentInput,!0);if(f.default.isNativeInput(n))return n.selectionEnd===n.value.length;if(!t.focusNode)return!1;var o=t.focusOffset;if(e.nodeType!==Node.TEXT_NODE&&e.childNodes.length&&(e.childNodes[o-1]?o=(e=e.childNodes[o-1]).textContent.length:(e=e.childNodes[0],o=0)),f.default.isLineBreakTag(n)||f.default.isEmpty(n)){var r=this.getHigherLevelSiblings(e,"right");if(r.every((function(t,e){return e===r.length-1&&f.default.isLineBreakTag(t)||f.default.isEmpty(t)&&!f.default.isLineBreakTag(t)}))&&o===e.textContent.length)return!0}var i=n.textContent.replace(/\s+$/,"");return e===n&&o>=i.length}}],[{key:"CSS",get:function(){return{shadowCaret:"cdx-shadow-caret"}}}]),o}(u.default);o.default=g,g.displayName="Caret",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(9),n(25),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p){"use strict";var h=n(8),v=n(1);function g(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=v(r),i=v(i),a=v(a),s=v(s),l=v(l),c=v(c),u=v(u),f=v(f),d=v(d),p=h(p);var y=function(t){(0,l.default)(f,t);var e,n,o=(e=f,function(){var t,n=(0,u.default)(e);if(g()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function f(){var t;return(0,a.default)(this,f),(t=o.apply(this,arguments)).onMouseUp=function(){t.listeners.off(document,"mouseover",t.onMouseOver),t.listeners.off(document,"mouseup",t.onMouseUp)},t.onMouseOver=function(e){var n=t.Editor,o=n.BlockManager,r=n.BlockSelection,i=o.getBlockByChildNode(e.relatedTarget)||t.lastSelectedBlock,a=o.getBlockByChildNode(e.target);if(i&&a&&a!==i){if(i===t.firstSelectedBlock)return d.default.get().removeAllRanges(),i.selected=!0,a.selected=!0,void r.clearCache();if(a===t.firstSelectedBlock)return i.selected=!1,a.selected=!1,void r.clearCache();t.Editor.InlineToolbar.close(),t.toggleBlocksSelectedState(i,a),t.lastSelectedBlock=a}},t}return(0,s.default)(f,[{key:"prepare",value:(n=(0,i.default)(r.default.mark((function t(){var e=this;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.listeners.on(document,"mousedown",(function(t){e.enableCrossBlockSelection(t)}));case 1:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"watchSelection",value:function(t){if(t.button===p.mouseButtons.LEFT){var e=this.Editor.BlockManager;this.firstSelectedBlock=e.getBlock(t.target),this.lastSelectedBlock=this.firstSelectedBlock,this.listeners.on(document,"mouseover",this.onMouseOver),this.listeners.on(document,"mouseup",this.onMouseUp)}}},{key:"toggleBlockSelectedState",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],e=this.Editor,n=e.BlockManager,o=e.BlockSelection;this.lastSelectedBlock||(this.lastSelectedBlock=this.firstSelectedBlock=n.currentBlock),this.firstSelectedBlock===this.lastSelectedBlock&&(this.firstSelectedBlock.selected=!0,o.clearCache(),d.default.get().removeAllRanges());var r=n.blocks.indexOf(this.lastSelectedBlock)+(t?1:-1),i=n.blocks[r];i&&(this.lastSelectedBlock.selected!==i.selected?(i.selected=!0,o.clearCache()):(this.lastSelectedBlock.selected=!1,o.clearCache()),this.lastSelectedBlock=i,this.Editor.InlineToolbar.close(),i.holder.scrollIntoView({block:"nearest"}))}},{key:"clear",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.BlockSelection,r=e.Caret,i=n.blocks.indexOf(this.firstSelectedBlock),a=n.blocks.indexOf(this.lastSelectedBlock);if(o.anyBlockSelected&&i>-1&&a>-1)if(t&&t instanceof KeyboardEvent)switch(t.keyCode){case p.keyCodes.DOWN:case p.keyCodes.RIGHT:r.setToBlock(n.blocks[Math.max(i,a)],r.positions.END);break;case p.keyCodes.UP:case p.keyCodes.LEFT:r.setToBlock(n.blocks[Math.min(i,a)],r.positions.START);break;default:r.setToBlock(n.blocks[Math.max(i,a)],r.positions.END)}else r.setToBlock(n.blocks[Math.max(i,a)],r.positions.END);this.firstSelectedBlock=this.lastSelectedBlock=null}},{key:"enableCrossBlockSelection",value:function(t){var e=this.Editor.UI;d.default.isCollapsed||this.Editor.BlockSelection.clearSelection(t),e.nodes.redactor.contains(t.target)?this.watchSelection(t):this.Editor.BlockSelection.clearSelection(t)}},{key:"toggleBlocksSelectedState",value:function(t,e){for(var n=this.Editor,o=n.BlockManager,r=n.BlockSelection,i=o.blocks.indexOf(t),a=o.blocks.indexOf(e),s=t.selected!==e.selected,l=Math.min(i,a);l<=Math.max(i,a);l++){var c=o.blocks[l];c!==this.firstSelectedBlock&&c!==(s?t:e)&&(o.blocks[l].selected=!o.blocks[l].selected,r.clearCache())}}},{key:"isCrossBlockSelectionStarted",get:function(){return!!this.firstSelectedBlock&&!!this.lastSelectedBlock}}]),f}(f.default);o.default=y,y.displayName="CrossBlockSelection",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(25),n(9)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(1);function h(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=p(r),i=p(i),a=p(a),s=p(s),l=p(l),c=p(c),u=p(u),f=p(f);var v=function(t){(0,l.default)(d,t);var e,n,o=(e=d,function(){var t,n=(0,u.default)(e);if(h()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function d(){var t;return(0,a.default)(this,d),(t=o.apply(this,arguments)).isStartedAtEditor=!1,t}return(0,s.default)(d,[{key:"toggleReadOnly",value:function(t){t?this.disableModuleBindings():this.enableModuleBindings()}},{key:"enableModuleBindings",value:function(){var t=this,e=this.Editor.UI;this.readOnlyMutableListeners.on(e.nodes.holder,"drop",function(){var e=(0,i.default)(r.default.mark((function e(n){return r.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,t.processDrop(n);case 2:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),!0),this.readOnlyMutableListeners.on(e.nodes.holder,"dragstart",(function(){t.processDragStart()})),this.readOnlyMutableListeners.on(e.nodes.holder,"dragover",(function(e){t.processDragOver(e)}),!0)}},{key:"disableModuleBindings",value:function(){this.readOnlyMutableListeners.clearAll()}},{key:"processDrop",value:(n=(0,i.default)(r.default.mark((function t(e){var n,o,i,a,s,l;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=this.Editor,o=n.BlockManager,i=n.Caret,a=n.Paste,e.preventDefault(),o.blocks.forEach((function(t){t.dropTarget=!1})),f.default.isAtEditor&&!f.default.isCollapsed&&this.isStartedAtEditor&&document.execCommand("delete"),this.isStartedAtEditor=!1,(s=o.setCurrentBlockByChildNode(e.target))?this.Editor.Caret.setToBlock(s,i.positions.END):(l=o.setCurrentBlockByChildNode(o.lastBlock.holder),this.Editor.Caret.setToBlock(l,i.positions.END)),t.next=9,a.processDataTransfer(e.dataTransfer,!0);case 9:case"end":return t.stop()}}),t,this)}))),function(t){return n.apply(this,arguments)})},{key:"processDragStart",value:function(){f.default.isAtEditor&&!f.default.isCollapsed&&(this.isStartedAtEditor=!0),this.Editor.InlineToolbar.close()}},{key:"processDragOver",value:function(t){t.preventDefault()}}]),d}((d=p(d)).default);o.default=v,v.displayName="DragNDrop",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(8),d=n(1);function p(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=d(r),i=d(i),a=d(a),s=d(s),l=d(l),c=d(c),u=f(u);var h=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(p()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).disabled=!1,t}return(0,i.default)(o,[{key:"enable",value:function(){this.disabled=!1}},{key:"disable",value:function(){this.disabled=!0}},{key:"onChange",value:function(t){!this.disabled&&u.isFunction(this.config.onChange)&&this.config.onChange(this.Editor.API.methods,t)}}]),o}(c.default);o.default=h,h.displayName="ModificationsObserver",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(42),n(30),n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(7),n(65)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g){"use strict";var y=n(8),b=n(1);function m(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=b(r),i=b(i),a=b(a),s=b(s),l=b(l),c=b(c),u=b(u),f=b(f),d=b(d),p=b(p),h=b(h),v=y(v);var k=function(t){(0,u.default)(T,t);var e,n,o,p,y,b,k,x,w,S=(e=T,function(){var t,n=(0,d.default)(e);if(m()){var o=(0,d.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,f.default)(this,t)});function T(){var t;return(0,l.default)(this,T),(t=S.apply(this,arguments)).MIME_TYPE="application/x-editor-js",t.toolsTags={},t.tagsByTool={},t.toolsPatterns=[],t.toolsFiles={},t.exceptionList=[],t.processTool=function(e){try{var n=e.create({},{},!1);if(!1===e.pasteConfig)return void t.exceptionList.push(e.name);if(!v.isFunction(n.onPaste))return;t.getTagsConfig(e),t.getFilesConfig(e),t.getPatternsConfig(e)}catch(t){v.log("Paste handling for «".concat(e.name,"» Tool hasn't been set up because of the error"),"warn",t)}},t.handlePasteEvent=function(){var e=(0,s.default)(a.default.mark((function e(n){var o,r,i;return a.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o=t.Editor,r=o.BlockManager,i=o.Toolbar,r.currentBlock&&(!t.isNativeBehaviour(n.target)||n.clipboardData.types.includes("Files"))){e.next=3;break}return e.abrupt("return");case 3:if(!r.currentBlock||!t.exceptionList.includes(r.currentBlock.name)){e.next=5;break}return e.abrupt("return");case 5:n.preventDefault(),t.processDataTransfer(n.clipboardData),r.clearFocused(),i.close();case 9:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),t}return(0,c.default)(T,[{key:"prepare",value:(w=(0,s.default)(a.default.mark((function t(){return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.processTools();case 1:case"end":return t.stop()}}),t,this)}))),function(){return w.apply(this,arguments)})},{key:"toggleReadOnly",value:function(t){t?this.unsetCallback():this.setCallback()}},{key:"processDataTransfer",value:(x=(0,s.default)(a.default.mark((function t(e){var n,o,r,i,s,l,c,u,f,d=arguments;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=d.length>1&&void 0!==d[1]&&d[1],o=this.Editor.Tools,!((r=e.types).includes?r.includes("Files"):r.contains("Files"))){t.next=8;break}return t.next=7,this.processFiles(e.files);case 7:return t.abrupt("return");case 8:if(i=e.getData(this.MIME_TYPE),s=e.getData("text/plain"),l=e.getData("text/html"),!i){t.next=19;break}return t.prev=12,this.insertEditorJSData(JSON.parse(i)),t.abrupt("return");case 17:t.prev=17,t.t0=t.catch(12);case 19:if(n&&s.trim()&&l.trim()&&(l="<p>"+(l.trim()?l:s)+"</p>"),c=Object.keys(this.toolsTags).reduce((function(t,e){return t[e.toLowerCase()]=!0,t}),{}),u=Object.assign({},c,o.getAllInlineToolsSanitizeConfig(),{br:{}}),(f=(0,g.clean)(l,u)).trim()&&f.trim()!==s&&h.default.isHTMLString(f)){t.next=28;break}return t.next=26,this.processText(s);case 26:t.next=30;break;case 28:return t.next=30,this.processText(f,!0);case 30:case"end":return t.stop()}}),t,this,[[12,17]])}))),function(t){return x.apply(this,arguments)})},{key:"processText",value:(k=(0,s.default)(a.default.mark((function t(e){var n,o,r,i,l,c,u,f=this,d=arguments;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=d.length>1&&void 0!==d[1]&&d[1],o=this.Editor,r=o.Caret,i=o.BlockManager,(l=n?this.processHTML(e):this.processPlain(e)).length){t.next=5;break}return t.abrupt("return");case 5:if(1!==l.length){t.next=8;break}return l[0].isBlock?this.processSingleBlock(l.pop()):this.processInlinePaste(l.pop()),t.abrupt("return");case 8:c=i.currentBlock&&i.currentBlock.tool.isDefault,u=c&&i.currentBlock.isEmpty,l.map(function(){var t=(0,s.default)(a.default.mark((function t(e,n){return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",f.insertBlock(e,0===n&&u));case 1:case"end":return t.stop()}}),t)})));return function(e,n){return t.apply(this,arguments)}}()),i.currentBlock&&r.setToBlock(i.currentBlock,r.positions.END);case 12:case"end":return t.stop()}}),t,this)}))),function(t){return k.apply(this,arguments)})},{key:"setCallback",value:function(){this.listeners.on(this.Editor.UI.nodes.holder,"paste",this.handlePasteEvent)}},{key:"unsetCallback",value:function(){this.listeners.off(this.Editor.UI.nodes.holder,"paste",this.handlePasteEvent)}},{key:"processTools",value:function(){var t=this.Editor.Tools.blockTools;Array.from(t.values()).forEach(this.processTool)}},{key:"getTagsConfig",value:function(t){var e=this,n=t.pasteConfig.tags||[];n.forEach((function(n){Object.prototype.hasOwnProperty.call(e.toolsTags,n)?v.log("Paste handler for «".concat(t.name,"» Tool on «").concat(n,"» tag is skipped ")+"because it is already used by «".concat(e.toolsTags[n].tool.name,"» Tool."),"warn"):e.toolsTags[n.toUpperCase()]={tool:t}})),this.tagsByTool[t.name]=n.map((function(t){return t.toUpperCase()}))}},{key:"getFilesConfig",value:function(t){var e=t.pasteConfig.files,n=void 0===e?{}:e,o=n.extensions,r=n.mimeTypes;(o||r)&&(o&&!Array.isArray(o)&&(v.log("«extensions» property of the onDrop config for «".concat(t.name,"» Tool should be an array")),o=[]),r&&!Array.isArray(r)&&(v.log("«mimeTypes» property of the onDrop config for «".concat(t.name,"» Tool should be an array")),r=[]),r&&(r=r.filter((function(e){return!!v.isValidMimeType(e)||(v.log("MIME type value «".concat(e,"» for the «").concat(t.name,"» Tool is not a valid MIME type"),"warn"),!1)}))),this.toolsFiles[t.name]={extensions:o||[],mimeTypes:r||[]})}},{key:"getPatternsConfig",value:function(t){var e=this;t.pasteConfig.patterns&&!v.isEmpty(t.pasteConfig.patterns)&&Object.entries(t.pasteConfig.patterns).forEach((function(n){var o=(0,i.default)(n,2),r=o[0],a=o[1];a instanceof RegExp||v.log("Pattern ".concat(a," for «").concat(t.name,"» Tool is skipped because it should be a Regexp instance."),"warn"),e.toolsPatterns.push({key:r,pattern:a,tool:t})}))}},{key:"isNativeBehaviour",value:function(t){return h.default.isNativeInput(t)}},{key:"processFiles",value:(b=(0,s.default)(a.default.mark((function t(e){var n,o,r,i,s=this;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=this.Editor.BlockManager,t.next=3,Promise.all(Array.from(e).map((function(t){return s.processFile(t)})));case 3:o=(o=t.sent).filter((function(t){return!!t})),r=n.currentBlock.tool.isDefault,i=r&&n.currentBlock.isEmpty,o.forEach((function(t,e){n.paste(t.type,t.event,0===e&&i)}));case 8:case"end":return t.stop()}}),t,this)}))),function(t){return b.apply(this,arguments)})},{key:"processFile",value:(y=(0,s.default)(a.default.mark((function t(e){var n,o,r,s,l;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=v.getFileExtension(e),o=Object.entries(this.toolsFiles).find((function(t){var o=(0,i.default)(t,2),r=(o[0],o[1]),a=r.mimeTypes,s=r.extensions,l=e.type.split("/"),c=(0,i.default)(l,2),u=c[0],f=c[1],d=s.find((function(t){return t.toLowerCase()===n.toLowerCase()})),p=a.find((function(t){var e=t.split("/"),n=(0,i.default)(e,2),o=n[0],r=n[1];return o===u&&(r===f||"*"===r)}));return!!d||!!p}))){t.next=4;break}return t.abrupt("return");case 4:return r=(0,i.default)(o,1),s=r[0],l=this.composePasteEvent("file",{file:e}),t.abrupt("return",{event:l,type:s});case 7:case"end":return t.stop()}}),t,this)}))),function(t){return y.apply(this,arguments)})},{key:"processHTML",value:function(t){var e=this,n=this.Editor.Tools,o=h.default.make("DIV");return o.innerHTML=t,this.getNodes(o).map((function(t){var o,r=n.defaultTool,i=!1;switch(t.nodeType){case Node.DOCUMENT_FRAGMENT_NODE:(o=h.default.make("div")).appendChild(t);break;case Node.ELEMENT_NODE:o=t,i=!0,e.toolsTags[o.tagName]&&(r=e.toolsTags[o.tagName].tool)}var a=r.pasteConfig.tags.reduce((function(t,e){return t[e.toLowerCase()]={},t}),{}),s=Object.assign({},a,r.baseSanitizeConfig);o.innerHTML=(0,g.clean)(o.innerHTML,s);var l=e.composePasteEvent("tag",{data:o});return{content:o,isBlock:i,tool:r.name,event:l}})).filter((function(t){return!h.default.isNodeEmpty(t.content)||h.default.isSingleTag(t.content)}))}},{key:"processPlain",value:function(t){var e=this,n=this.config.defaultBlock;if(!t)return[];var o=n;return t.split(/\r?\n/).filter((function(t){return t.trim()})).map((function(t){var n=h.default.make("div");n.textContent=t;var r=e.composePasteEvent("tag",{data:n});return{content:n,tool:o,isBlock:!1,event:r}}))}},{key:"processSingleBlock",value:(p=(0,s.default)(a.default.mark((function t(e){var n,o,r,i;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.Editor,o=n.Caret,r=n.BlockManager,(i=r.currentBlock)&&e.tool===i.name&&h.default.containsOnlyInlineElements(e.content.innerHTML)){t.next=5;break}return this.insertBlock(e,(null==i?void 0:i.tool.isDefault)&&i.isEmpty),t.abrupt("return");case 5:o.insertContentAtCaretPosition(e.content.innerHTML);case 6:case"end":return t.stop()}}),t,this)}))),function(t){return p.apply(this,arguments)})},{key:"processInlinePaste",value:(o=(0,s.default)(a.default.mark((function t(e){var n,o,r,i,s,l,c,u;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.Editor,o=n.BlockManager,r=n.Caret,i=e.content,!(o.currentBlock&&o.currentBlock.tool.isDefault&&i.textContent.length<T.PATTERN_PROCESSING_MAX_LENGTH)){t.next=12;break}return t.next=6,this.processPattern(i.textContent);case 6:if(!(s=t.sent)){t.next=12;break}return l=o.currentBlock&&o.currentBlock.tool.isDefault&&o.currentBlock.isEmpty,c=o.paste(s.tool,s.event,l),r.setToBlock(c,r.positions.END),t.abrupt("return");case 12:o.currentBlock&&o.currentBlock.currentInput?(u=o.currentBlock.tool.sanitizeConfig,document.execCommand("insertHTML",!1,(0,g.clean)(i.innerHTML,u))):this.insertBlock(e);case 13:case"end":return t.stop()}}),t,this)}))),function(t){return o.apply(this,arguments)})},{key:"processPattern",value:(n=(0,s.default)(a.default.mark((function t(e){var n,o;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.toolsPatterns.find((function(t){var n=t.pattern.exec(e);return!!n&&e===n.shift()}))){t.next=3;break}return t.abrupt("return");case 3:return o=this.composePasteEvent("pattern",{key:n.key,data:e}),t.abrupt("return",{event:o,tool:n.tool.name});case 5:case"end":return t.stop()}}),t,this)}))),function(t){return n.apply(this,arguments)})},{key:"insertBlock",value:function(t){var e,n=arguments.length>1&&void 0!==arguments[1]&&arguments[1],o=this.Editor,r=o.BlockManager,i=o.Caret,a=r.currentBlock;if(n&&a&&a.isEmpty)return e=r.paste(t.tool,t.event,!0),void i.setToBlock(e,i.positions.END);e=r.paste(t.tool,t.event),i.setToBlock(e,i.positions.END)}},{key:"insertEditorJSData",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.Caret,r=e.Tools;(0,g.sanitizeBlocks)(t,(function(t){return r.blockTools.get(t).sanitizeConfig})).forEach((function(t,e){var r=t.tool,i=t.data,a=!1;0===e&&(a=n.currentBlock&&n.currentBlock.tool.isDefault&&n.currentBlock.isEmpty);var s=n.insert({tool:r,data:i,replace:a});o.setToBlock(s,o.positions.END)}))}},{key:"processElementNode",value:function(t,e,n){var o=Object.keys(this.toolsTags),i=t,a=(this.toolsTags[i.tagName]||{}).tool,s=this.tagsByTool[null==a?void 0:a.name]||[],l=o.includes(i.tagName),c=h.default.blockElements.includes(i.tagName.toLowerCase()),u=Array.from(i.children).some((function(t){var e=t.tagName;return o.includes(e)&&!s.includes(e)})),f=Array.from(i.children).some((function(t){var e=t.tagName;return h.default.blockElements.includes(e.toLowerCase())}));return c||l||u?l&&!u||c&&!f&&!u?[].concat((0,r.default)(e),[n,i]):void 0:(n.appendChild(i),[].concat((0,r.default)(e),[n]))}},{key:"getNodes",value:function(t){var e,n=this;return Array.from(t.childNodes).reduce((function t(o,i){if(h.default.isEmpty(i)&&!h.default.isSingleTag(i))return o;var a=o[o.length-1],s=new DocumentFragment;switch(a&&h.default.isFragment(a)&&(s=o.pop()),i.nodeType){case Node.ELEMENT_NODE:if(e=n.processElementNode(i,o,s))return e;break;case Node.TEXT_NODE:return s.appendChild(i),[].concat((0,r.default)(o),[s]);default:return[].concat((0,r.default)(o),[s])}return[].concat((0,r.default)(o),(0,r.default)(Array.from(i.childNodes).reduce(t,[])))}),[])}},{key:"composePasteEvent",value:function(t,e){return new CustomEvent(t,{detail:e})}}]),T}(p.default);o.default=k,k.displayName="Paste",k.PATTERN_PROCESSING_MAX_LENGTH=450,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(30),n(24),n(2),n(3),n(5),n(6),n(4),n(9),n(148)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p){"use strict";var h=n(1);function v(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=h(r),i=h(i),a=h(a),s=h(s),l=h(l),c=h(c),u=h(u),f=h(f);var g=function(t){(0,c.default)(h,t);var e,n,o,d=(e=h,function(){var t,n=(0,f.default)(e);if(v()){var o=(0,f.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,u.default)(this,t)});function h(){var t;return(0,s.default)(this,h),(t=d.apply(this,arguments)).toolsDontSupportReadOnly=[],t.readOnlyEnabled=!1,t}return(0,l.default)(h,[{key:"prepare",value:(o=(0,a.default)(r.default.mark((function t(){var e,n,o;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:e=this.Editor.Tools,n=e.blockTools,o=[],Array.from(n.entries()).forEach((function(t){var e=(0,i.default)(t,2),n=e[0];e[1].isReadOnlySupported||o.push(n)})),this.toolsDontSupportReadOnly=o,this.config.readOnly&&o.length>0&&this.throwCriticalError(),this.toggle(this.config.readOnly);case 7:case"end":return t.stop()}}),t,this)}))),function(){return o.apply(this,arguments)})},{key:"toggle",value:(n=(0,a.default)(r.default.mark((function t(){var e,n,o,i,a=arguments;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:(e=a.length>0&&void 0!==a[0]?a[0]:!this.readOnlyEnabled)&&this.toolsDontSupportReadOnly.length>0&&this.throwCriticalError(),n=this.readOnlyEnabled,this.readOnlyEnabled=e,t.t0=r.default.keys(this.Editor);case 5:if((t.t1=t.t0()).done){t.next=12;break}if(o=t.t1.value,this.Editor[o].toggleReadOnly){t.next=9;break}return t.abrupt("continue",5);case 9:this.Editor[o].toggleReadOnly(e),t.next=5;break;case 12:if(n!==e){t.next=14;break}return t.abrupt("return",this.readOnlyEnabled);case 14:return t.next=16,this.Editor.Saver.save();case 16:return i=t.sent,t.next=19,this.Editor.BlockManager.clear();case 19:return t.next=21,this.Editor.Renderer.render(i.blocks);case 21:return t.abrupt("return",this.readOnlyEnabled);case 22:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"throwCriticalError",value:function(){throw new p.CriticalError("To enable read-only mode all connected tools should support it. Tools ".concat(this.toolsDontSupportReadOnly.join(", ")," don't support read-only mode."))}},{key:"isEnabled",get:function(){return this.readOnlyEnabled}}]),h}((d=h(d)).default);o.default=g,g.displayName="ReadOnly",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(25),n(66)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(1);function h(t){if("undefined"==typeof Symbol||null==t[Symbol.iterator]){if(Array.isArray(t)||(t=function(t,e){if(t){if("string"==typeof t)return v(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?v(t,e):void 0}}(t))){var e=0,n=function(){};return{s:n,n:function(){return e>=t.length?{done:!0}:{done:!1,value:t[e++]}},e:function(t){throw t},f:n}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var o,r,i=!0,a=!1;return{s:function(){o=t[Symbol.iterator]()},n:function(){var t=o.next();return i=t.done,t},e:function(t){a=!0,r=t},f:function(){try{i||null==o.return||o.return()}finally{if(a)throw r}}}}function v(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function g(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=p(r),i=p(i),a=p(a),s=p(s),l=p(l),c=p(c),u=p(u),f=p(f),d=p(d);var y=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(g()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).isRectSelectionActivated=!1,t.SCROLL_SPEED=3,t.HEIGHT_OF_SCROLL_ZONE=40,t.BOTTOM_SCROLL_ZONE=1,t.TOP_SCROLL_ZONE=2,t.MAIN_MOUSE_BUTTON=0,t.mousedown=!1,t.isScrolling=!1,t.inScrollZone=null,t.startX=0,t.startY=0,t.mouseX=0,t.mouseY=0,t.stackOfSelected=[],t.listenerIds=[],t}return(0,i.default)(o,[{key:"prepare",value:function(){this.enableModuleBindings()}},{key:"startSelection",value:function(t,e){var n=document.elementFromPoint(t-window.pageXOffset,e-window.pageYOffset);n.closest(".".concat(this.Editor.Toolbar.CSS.toolbar))||(this.Editor.BlockSelection.allBlocksSelected=!1,this.clearSelection(),this.stackOfSelected=[]);var o=[".".concat(d.default.CSS.content),".".concat(this.Editor.Toolbar.CSS.toolbar),".".concat(this.Editor.InlineToolbar.CSS.inlineToolbar)],r=n.closest("."+this.Editor.UI.CSS.editorWrapper),i=o.some((function(t){return!!n.closest(t)}));r&&!i&&(this.mousedown=!0,this.startX=t,this.startY=e)}},{key:"endSelection",value:function(){this.mousedown=!1,this.startX=0,this.startY=0,this.overlayRectangle.style.display="none"}},{key:"isRectActivated",value:function(){return this.isRectSelectionActivated}},{key:"clearSelection",value:function(){this.isRectSelectionActivated=!1}},{key:"enableModuleBindings",value:function(){var t=this,e=this.genHTML().container;this.listeners.on(e,"mousedown",(function(e){t.processMouseDown(e)}),!1),this.listeners.on(document.body,"mousemove",(function(e){t.processMouseMove(e)}),!1),this.listeners.on(document.body,"mouseleave",(function(){t.processMouseLeave()})),this.listeners.on(window,"scroll",(function(e){t.processScroll(e)}),!1),this.listeners.on(document.body,"mouseup",(function(){t.processMouseUp()}),!1)}},{key:"processMouseDown",value:function(t){t.button===this.MAIN_MOUSE_BUTTON&&(null!==t.target.closest(u.default.allInputsSelector)||this.startSelection(t.pageX,t.pageY))}},{key:"processMouseMove",value:function(t){this.changingRectangle(t),this.scrollByZones(t.clientY)}},{key:"processMouseLeave",value:function(){this.clearSelection(),this.endSelection()}},{key:"processScroll",value:function(t){this.changingRectangle(t)}},{key:"processMouseUp",value:function(){this.endSelection()}},{key:"scrollByZones",value:function(t){this.inScrollZone=null,t<=this.HEIGHT_OF_SCROLL_ZONE&&(this.inScrollZone=this.TOP_SCROLL_ZONE),document.documentElement.clientHeight-t<=this.HEIGHT_OF_SCROLL_ZONE&&(this.inScrollZone=this.BOTTOM_SCROLL_ZONE),this.inScrollZone?this.isScrolling||(this.scrollVertical(this.inScrollZone===this.TOP_SCROLL_ZONE?-this.SCROLL_SPEED:this.SCROLL_SPEED),this.isScrolling=!0):this.isScrolling=!1}},{key:"genHTML",value:function(){var t=this.Editor.UI,e=t.nodes.holder.querySelector("."+t.CSS.editorWrapper),n=u.default.make("div",o.CSS.overlay,{}),r=u.default.make("div",o.CSS.overlayContainer,{}),i=u.default.make("div",o.CSS.rect,{});return r.appendChild(i),n.appendChild(r),e.appendChild(n),this.overlayRectangle=i,{container:e,overlay:n}}},{key:"scrollVertical",value:function(t){var e=this;if(this.inScrollZone&&this.mousedown){var n=window.pageYOffset;window.scrollBy(0,t),this.mouseY+=window.pageYOffset-n,setTimeout((function(){e.scrollVertical(t)}),0)}}},{key:"changingRectangle",value:function(t){if(this.mousedown){void 0!==t.pageY&&(this.mouseX=t.pageX,this.mouseY=t.pageY);var e=this.genInfoForMouseSelection(),n=e.rightPos,o=e.leftPos,r=e.index,i=this.startX>n&&this.mouseX>n,a=this.startX<o&&this.mouseX<o;this.rectCrossesBlocks=!(i||a),this.isRectSelectionActivated||(this.rectCrossesBlocks=!1,this.isRectSelectionActivated=!0,this.shrinkRectangleToPoint(),this.overlayRectangle.style.display="block"),this.updateRectangleSize(),void 0!==r&&(this.trySelectNextBlock(r),this.inverseSelection(),f.default.get().removeAllRanges(),t.preventDefault())}}},{key:"shrinkRectangleToPoint",value:function(){this.overlayRectangle.style.left="".concat(this.startX-window.pageXOffset,"px"),this.overlayRectangle.style.top="".concat(this.startY-window.pageYOffset,"px"),this.overlayRectangle.style.bottom="calc(100% - ".concat(this.startY-window.pageYOffset,"px"),this.overlayRectangle.style.right="calc(100% - ".concat(this.startX-window.pageXOffset,"px")}},{key:"inverseSelection",value:function(){var t=this.Editor.BlockManager.getBlockByIndex(this.stackOfSelected[0]).selected;if(this.rectCrossesBlocks&&!t){var e,n=h(this.stackOfSelected);try{for(n.s();!(e=n.n()).done;){var o=e.value;this.Editor.BlockSelection.selectBlockByIndex(o)}}catch(t){n.e(t)}finally{n.f()}}if(!this.rectCrossesBlocks&&t){var r,i=h(this.stackOfSelected);try{for(i.s();!(r=i.n()).done;){var a=r.value;this.Editor.BlockSelection.unSelectBlockByIndex(a)}}catch(t){i.e(t)}finally{i.f()}}}},{key:"updateRectangleSize",value:function(){this.mouseY>=this.startY?(this.overlayRectangle.style.top="".concat(this.startY-window.pageYOffset,"px"),this.overlayRectangle.style.bottom="calc(100% - ".concat(this.mouseY-window.pageYOffset,"px")):(this.overlayRectangle.style.bottom="calc(100% - ".concat(this.startY-window.pageYOffset,"px"),this.overlayRectangle.style.top="".concat(this.mouseY-window.pageYOffset,"px")),this.mouseX>=this.startX?(this.overlayRectangle.style.left="".concat(this.startX-window.pageXOffset,"px"),this.overlayRectangle.style.right="calc(100% - ".concat(this.mouseX-window.pageXOffset,"px")):(this.overlayRectangle.style.right="calc(100% - ".concat(this.startX-window.pageXOffset,"px"),this.overlayRectangle.style.left="".concat(this.mouseX-window.pageXOffset,"px"))}},{key:"genInfoForMouseSelection",value:function(){var t,e=document.body.offsetWidth/2,n=this.mouseY-window.pageYOffset,o=document.elementFromPoint(e,n),r=this.Editor.BlockManager.getBlockByChildNode(o);void 0!==r&&(t=this.Editor.BlockManager.blocks.findIndex((function(t){return t.holder===r.holder})));var i=this.Editor.BlockManager.lastBlock.holder.querySelector("."+d.default.CSS.content),a=Number.parseInt(window.getComputedStyle(i).width,10)/2;return{index:t,leftPos:e-a,rightPos:e+a}}},{key:"addBlockInSelection",value:function(t){this.rectCrossesBlocks&&this.Editor.BlockSelection.selectBlockByIndex(t),this.stackOfSelected.push(t)}},{key:"trySelectNextBlock",value:function(t){var e=this,n=this.stackOfSelected[this.stackOfSelected.length-1]===t,o=this.stackOfSelected.length;if(!n){var r=this.stackOfSelected[o-1]-this.stackOfSelected[o-2]>0,i=0;o>1&&(i=r?1:-1);var a=t>this.stackOfSelected[o-1]&&1===i,s=t<this.stackOfSelected[o-1]&&-1===i,l=!(a||s||0===i);if(l||!(t>this.stackOfSelected[o-1]||void 0===this.stackOfSelected[o-1])){if(!l&&t<this.stackOfSelected[o-1])for(var c=this.stackOfSelected[o-1]-1;c>=t;c--)this.addBlockInSelection(c);else if(l){var u,f=o-1;for(u=t>this.stackOfSelected[o-1]?function(){return t>e.stackOfSelected[f]}:function(){return t<e.stackOfSelected[f]};u();)this.rectCrossesBlocks&&this.Editor.BlockSelection.unSelectBlockByIndex(this.stackOfSelected[f]),this.stackOfSelected.pop(),f--}}else for(var d=this.stackOfSelected[o-1]+1||t;d<=t;d++)this.addBlockInSelection(d)}}}],[{key:"CSS",get:function(){return{overlay:"codex-editor-overlay",overlayContainer:"codex-editor-overlay__container",rect:"codex-editor-overlay__rectangle",topScrollZone:"codex-editor-overlay__scroll-zone--top",bottomScrollZone:"codex-editor-overlay__scroll-zone--bottom"}}}]),o}(c.default);o.default=y,y.displayName="RectangleSelection",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(9),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(8),h=n(1);function v(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=h(r),i=h(i),a=h(a),s=h(s),l=h(l),c=h(c),u=h(u),f=h(f),d=p(d);var g=function(t){(0,l.default)(p,t);var e,n,o,f=(e=p,function(){var t,n=(0,u.default)(e);if(v()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function p(){return(0,a.default)(this,p),f.apply(this,arguments)}return(0,s.default)(p,[{key:"render",value:(o=(0,i.default)(r.default.mark((function t(e){var n,o,i=this;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=e.map((function(t){return{function:function(){return i.insertBlock(t)}}})),this.Editor.ModificationsObserver.disable(),t.next=4,d.sequence(n);case 4:return o=t.sent,this.Editor.ModificationsObserver.enable(),this.Editor.UI.checkEmptiness(),t.abrupt("return",o);case 8:case"end":return t.stop()}}),t,this)}))),function(t){return o.apply(this,arguments)})},{key:"insertBlock",value:(n=(0,i.default)(r.default.mark((function t(e){var n,o,i,a,s,l,c,u,f;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(n=this.Editor,o=n.Tools,i=n.BlockManager,a=e.type,s=e.data,l=e.tunes,c=e.id,!o.available.has(a)){t.next=13;break}t.prev=3,i.insert({id:c,tool:a,data:s,tunes:l}),t.next=11;break;case 7:throw t.prev=7,t.t0=t.catch(3),d.log("Block «".concat(a,"» skipped because of plugins error"),"warn",s),Error(t.t0);case 11:t.next=18;break;case 13:u={savedData:{id:c,type:a,data:s},title:a},o.unavailable.has(a)&&(f=o.unavailable.get(a).toolbox,u.title=(null==f?void 0:f.title)||u.title),i.insert({id:c,tool:o.stubTool,data:u}).stretched=!0,d.log("Tool «".concat(a,"» is not found. Check 'tools' property at your initial Editor.js config."),"warn");case 18:case"end":return t.stop()}}),t,this,[[3,7]])}))),function(t){return n.apply(this,arguments)})}]),p}(f.default);o.default=g,g.displayName="Renderer",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(9),n(7),n(65)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p){"use strict";var h=n(8),v=n(1);function g(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=v(r),i=v(i),a=v(a),s=v(s),l=v(l),c=v(c),u=v(u),f=v(f),d=h(d);var y=function(t){(0,l.default)(h,t);var e,n,o,f=(e=h,function(){var t,n=(0,u.default)(e);if(g()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function h(){return(0,a.default)(this,h),f.apply(this,arguments)}return(0,s.default)(h,[{key:"save",value:(o=(0,i.default)(r.default.mark((function t(){var e,n,o,i,a,s,l,c,u=this;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=this.Editor,n=e.BlockManager,o=e.Tools,i=e.ModificationsObserver,a=n.blocks,s=[],t.prev=2,i.disable(),a.forEach((function(t){s.push(u.getSavedData(t))})),t.next=7,Promise.all(s);case 7:return l=t.sent,t.next=10,(0,p.sanitizeBlocks)(l,(function(t){return o.blockTools.get(t).sanitizeConfig}));case 10:return c=t.sent,t.abrupt("return",this.makeOutput(c));case 14:t.prev=14,t.t0=t.catch(2),d.logLabeled("Saving failed due to the Error %o","error",t.t0);case 17:return t.prev=17,i.enable(),t.finish(17);case 20:case"end":return t.stop()}}),t,this,[[2,14,17,20]])}))),function(){return o.apply(this,arguments)})},{key:"getSavedData",value:(n=(0,i.default)(r.default.mark((function t(e){var n,o;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,e.save();case 2:if(n=t.sent,t.t0=n,!t.t0){t.next=8;break}return t.next=7,e.validate(n.data);case 7:t.t0=t.sent;case 8:return o=t.t0,t.abrupt("return",Object.assign(Object.assign({},n),{isValid:o}));case 10:case"end":return t.stop()}}),t)}))),function(t){return n.apply(this,arguments)})},{key:"makeOutput",value:function(t){var e=this,n=0,o=[];return d.log("[Editor.js saving]:","groupCollapsed"),t.forEach((function(t){var r=t.id,i=t.tool,a=t.data,s=t.tunes,l=t.time,c=t.isValid;if(n+=l,d.log("".concat(i.charAt(0).toUpperCase()+i.slice(1)),"group"),!c)return d.log("Block «".concat(i,"» skipped because saved data is invalid")),void d.log(void 0,"groupEnd");if(d.log(a),d.log(void 0,"groupEnd"),i!==e.Editor.Tools.stubTool){var u=Object.assign({id:r,type:i,data:a},!d.isEmpty(s)&&{tunes:s});o.push(u)}else o.push(a)})),d.log("Total","log",n),d.log(void 0,"groupEnd"),{time:+new Date,blocks:o,version:"2.22.2"}}}]),h}(f.default);o.default=y,y.displayName="Saver",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(60),n(7),n(25)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h){"use strict";var v=n(8),g=n(1);function y(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=g(r),i=g(i),a=g(a),s=g(s),l=g(l),c=g(c),u=g(u),f=g(f),d=g(d),p=v(p),h=g(h);var b=function(t){(0,s.default)(o,t);var e,n=(e=o,function(){var t,n=(0,c.default)(e);if(y()){var o=(0,c.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,l.default)(this,t)});function o(){var t;return(0,i.default)(this,o),(t=n.apply(this,arguments)).buttons=[],t.flipper=null,t.selection=new h.default,t}return(0,a.default)(o,[{key:"make",value:function(){this.nodes.wrapper=f.default.make("div",this.CSS.wrapper),this.nodes.toolSettings=f.default.make("div",this.CSS.toolSettings),this.nodes.defaultSettings=f.default.make("div",this.CSS.defaultSettings),f.default.append(this.nodes.wrapper,[this.nodes.toolSettings,this.nodes.defaultSettings]),this.enableFlipper()}},{key:"destroy",value:function(){this.flipper&&(this.flipper.deactivate(),this.flipper=null),this.removeAllNodes()}},{key:"open",value:function(){this.nodes.wrapper.classList.add(this.CSS.wrapperOpened),this.selection.save(),this.Editor.BlockManager.currentBlock.selected=!0,this.Editor.BlockSelection.clearCache(),this.addToolSettings(),this.addTunes(),this.eventsDispatcher.emit(this.events.opened),this.flipper.activate(this.blockTunesButtons)}},{key:"close",value:function(){this.nodes.wrapper.classList.remove(this.CSS.wrapperOpened),h.default.isAtEditor||this.selection.restore(),this.selection.clearSaved(),!this.Editor.CrossBlockSelection.isCrossBlockSelectionStarted&&this.Editor.BlockManager.currentBlock&&(this.Editor.BlockManager.currentBlock.selected=!1),this.nodes.toolSettings.innerHTML="",this.nodes.defaultSettings.innerHTML="",this.eventsDispatcher.emit(this.events.closed),this.buttons=[],this.flipper.deactivate()}},{key:"addToolSettings",value:function(){var t=this.Editor.BlockManager.currentBlock.renderSettings();t&&f.default.append(this.nodes.toolSettings,t)}},{key:"addTunes",value:function(){var t=this.Editor.BlockManager.currentBlock.renderTunes(),e=(0,r.default)(t,2),n=e[0],o=e[1];f.default.append(this.nodes.toolSettings,n),f.default.append(this.nodes.defaultSettings,o)}},{key:"enableFlipper",value:function(){var t=this;this.flipper=new d.default({focusedItemClass:this.CSS.focusedButton,activateCallback:function(e){e&&f.default.canSetCaret(e)?t.close():p.delay((function(){t.Editor.Caret.setToBlock(t.Editor.BlockManager.currentBlock)}),50)()}})}},{key:"events",get:function(){return{opened:"block-settings-opened",closed:"block-settings-closed"}}},{key:"CSS",get:function(){return{wrapper:"ce-settings",wrapperOpened:"ce-settings--opened",toolSettings:"ce-settings__plugin-zone",defaultSettings:"ce-settings__default-zone",button:"ce-settings__button",focusedButton:"ce-settings__button--focused",focusedButtonAnimated:"ce-settings__button--focused-animated"}}},{key:"opened",get:function(){return this.nodes.wrapper.classList.contains(this.CSS.wrapperOpened)}},{key:"blockTunesButtons",get:function(){var t=this,e=this.Editor.StylesAPI;if(0!==this.buttons.length)return this.buttons;var n=this.nodes.toolSettings.querySelectorAll(".".concat(e.classes.settingsButton,", ").concat(f.default.allInputsSelector)),o=this.nodes.defaultSettings.querySelectorAll(".".concat(this.CSS.button));return n.forEach((function(e){t.buttons.push(e)})),o.forEach((function(e){t.buttons.push(e)})),this.buttons}}]),o}(u.default);o.default=b,b.displayName="BlockSettings",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(23),n(24),n(42),n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(7),n(60),n(59),n(84),n(65)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g,y,b,m){"use strict";var k=n(8),x=n(1);function w(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=x(r),i=x(i),a=x(a),s=x(s),l=x(l),c=x(c),u=x(u),f=x(f),d=x(d),p=x(p),h=x(h),v=k(v),g=x(g),y=x(y);var S=function(t){(0,u.default)(p,t);var e,n,o=(e=p,function(){var t,n=(0,d.default)(e);if(w()){var o=(0,d.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,f.default)(this,t)});function p(){var t;return(0,l.default)(this,p),(t=o.apply(this,arguments)).opened=!1,t.tools={},t.flipper=null,t.togglingCallback=null,t}return(0,c.default)(p,[{key:"make",value:function(){this.nodes.wrapper=h.default.make("div",[p.CSS.conversionToolbarWrapper].concat((0,s.default)(this.isRtl?[this.Editor.UI.CSS.editorRtlFix]:[]))),this.nodes.tools=h.default.make("div",p.CSS.conversionToolbarTools);var t=h.default.make("div",p.CSS.conversionToolbarLabel,{textContent:y.default.ui(b.I18nInternalNS.ui.inlineToolbar.converter,"Convert to")});return this.addTools(),this.enableFlipper(),h.default.append(this.nodes.wrapper,t),h.default.append(this.nodes.wrapper,this.nodes.tools),this.nodes.wrapper}},{key:"destroy",value:function(){this.flipper&&(this.flipper.deactivate(),this.flipper=null),this.removeAllNodes()}},{key:"toggle",value:function(t){this.opened?this.close():this.open(),v.isFunction(t)&&(this.togglingCallback=t)}},{key:"open",value:function(){var t=this;this.filterTools(),this.opened=!0,this.nodes.wrapper.classList.add(p.CSS.conversionToolbarShowed),setTimeout((function(){t.flipper.activate(Object.values(t.tools).filter((function(t){return!t.classList.contains(p.CSS.conversionToolHidden)}))),t.flipper.focusFirst(),v.isFunction(t.togglingCallback)&&t.togglingCallback(!0)}),50)}},{key:"close",value:function(){this.opened=!1,this.flipper.deactivate(),this.nodes.wrapper.classList.remove(p.CSS.conversionToolbarShowed),v.isFunction(this.togglingCallback)&&this.togglingCallback(!1)}},{key:"hasTools",value:function(){var t=Object.keys(this.tools);return!(1===t.length&&t.shift()===this.config.defaultBlock)}},{key:"replaceWithBlock",value:(n=(0,a.default)(i.default.mark((function t(e){var n,o,r,a,s,l,c,u,f,d,p=this;return i.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return n=this.Editor.BlockManager.currentBlock.tool,o=this.Editor.BlockManager.currentBlock.name,t.next=4,this.Editor.BlockManager.currentBlock.save();case 4:if(r=t.sent,a=r.data,o===e&&(e=this.config.defaultBlock),s=this.Editor.Tools.blockTools.get(e),l="",c=n.conversionConfig.export,!v.isFunction(c)){t.next=14;break}l=c(a),t.next=20;break;case 14:if(!v.isString(c)){t.next=18;break}l=a[c],t.next=20;break;case 18:return v.log("Conversion «export» property must be a string or function. String means key of saved data object to export. Function should export processed string to export."),t.abrupt("return");case 20:if(u=(0,m.clean)(l,s.sanitizeConfig),f={},d=s.conversionConfig.import,!v.isFunction(d)){t.next=27;break}f=d(u),t.next=33;break;case 27:if(!v.isString(d)){t.next=31;break}f[d]=u,t.next=33;break;case 31:return v.log("Conversion «import» property must be a string or function. String means key of tool data to import. Function accepts a imported string and return composed tool data."),t.abrupt("return");case 33:this.Editor.BlockManager.replace({tool:e,data:f}),this.Editor.BlockSelection.clearSelection(),this.close(),this.Editor.InlineToolbar.close(),v.delay((function(){p.Editor.Caret.setToBlock(p.Editor.BlockManager.currentBlock)}),10)();case 38:case"end":return t.stop()}}),t,this)}))),function(t){return n.apply(this,arguments)})},{key:"addTools",value:function(){var t=this,e=this.Editor.Tools.blockTools;Array.from(e.entries()).forEach((function(e){var n=(0,r.default)(e,2),o=n[0],i=n[1],a=i.toolbox,s=i.conversionConfig;!v.isEmpty(a)&&a.icon&&s&&s.import&&t.addTool(o,a.icon,a.title)}))}},{key:"addTool",value:function(t,e,n){var o=this,r=h.default.make("div",[p.CSS.conversionTool]),s=h.default.make("div",[p.CSS.conversionToolIcon]);r.dataset.tool=t,s.innerHTML=e,h.default.append(r,s),h.default.append(r,h.default.text(y.default.t(b.I18nInternalNS.toolNames,n||v.capitalize(t)))),h.default.append(this.nodes.tools,r),this.tools[t]=r,this.listeners.on(r,"click",(0,a.default)(i.default.mark((function e(){return i.default.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.replaceWithBlock(t);case 2:case"end":return e.stop()}}),e)}))))}},{key:"filterTools",value:function(){var t=this.Editor.BlockManager.currentBlock;Object.entries(this.tools).forEach((function(e){var n=(0,r.default)(e,2),o=n[0],i=n[1];i.hidden=!1,i.classList.toggle(p.CSS.conversionToolHidden,o===t.name)}))}},{key:"enableFlipper",value:function(){this.flipper=new g.default({focusedItemClass:p.CSS.conversionToolFocused})}}],[{key:"CSS",get:function(){return{conversionToolbarWrapper:"ce-conversion-toolbar",conversionToolbarShowed:"ce-conversion-toolbar--showed",conversionToolbarTools:"ce-conversion-toolbar__tools",conversionToolbarLabel:"ce-conversion-toolbar__label",conversionTool:"ce-conversion-tool",conversionToolHidden:"ce-conversion-tool--hidden",conversionToolIcon:"ce-conversion-tool__icon",conversionToolFocused:"ce-conversion-tool--focused",conversionToolActive:"ce-conversion-tool--active"}}}]),p}(p.default);o.default=S,S.displayName="ConversionToolbar",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(42),n(30),n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(25),n(7),n(60),n(59),n(84),n(112),n(82),n(67)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g,y,b,m,k){"use strict";var x=n(8),w=n(1);function S(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=w(r),i=w(i),a=w(a),s=w(s),l=w(l),c=w(c),u=w(u),f=w(f),d=w(d),p=w(p),h=x(h),v=w(v),g=w(g),b=w(b),m=w(m);var T=function(t){(0,l.default)(o,t);var e,n=(e=o,function(){var t,n=(0,u.default)(e);if(S()){var o=(0,u.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,c.default)(this,t)});function o(t){var e,r=t.config,i=t.eventsDispatcher;return(0,a.default)(this,o),(e=n.call(this,{config:r,eventsDispatcher:i})).CSS={inlineToolbar:"ce-inline-toolbar",inlineToolbarShowed:"ce-inline-toolbar--showed",inlineToolbarLeftOriented:"ce-inline-toolbar--left-oriented",inlineToolbarRightOriented:"ce-inline-toolbar--right-oriented",inlineToolbarShortcut:"ce-inline-toolbar__shortcut",buttonsWrapper:"ce-inline-toolbar__buttons",actionsWrapper:"ce-inline-toolbar__actions",inlineToolButton:"ce-inline-tool",inputField:"cdx-input",focusedButton:"ce-inline-tool--focused",conversionToggler:"ce-inline-toolbar__dropdown",conversionTogglerHidden:"ce-inline-toolbar__dropdown--hidden",conversionTogglerContent:"ce-inline-toolbar__dropdown-content",togglerAndButtonsWrapper:"ce-inline-toolbar__toggler-and-button-wrapper"},e.opened=!1,e.toolbarVerticalMargin=5,e.buttonsList=null,e.width=0,e.flipper=null,e.tooltip=new m.default,e}return(0,s.default)(o,[{key:"toggleReadOnly",value:function(t){t?(this.destroy(),this.Editor.ConversionToolbar.destroy()):this.make()}},{key:"tryToShow",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0],e=!(arguments.length>1&&void 0!==arguments[1])||arguments[1];this.allowedToShow()?(this.move(),this.open(e),this.Editor.Toolbar.close()):t&&this.close()}},{key:"move",value:function(){var t=p.default.rect,e=this.Editor.UI.nodes.wrapper.getBoundingClientRect(),n={x:t.x-e.left,y:t.y+t.height-e.top+this.toolbarVerticalMargin};t.width&&(n.x+=Math.floor(t.width/2));var o=n.x-this.width/2,r=n.x+this.width/2;this.nodes.wrapper.classList.toggle(this.CSS.inlineToolbarLeftOriented,o<this.Editor.UI.contentRect.left),this.nodes.wrapper.classList.toggle(this.CSS.inlineToolbarRightOriented,r>this.Editor.UI.contentRect.right),this.nodes.wrapper.style.left=Math.floor(n.x)+"px",this.nodes.wrapper.style.top=Math.floor(n.y)+"px"}},{key:"close",value:function(){var t=this;this.opened&&(this.Editor.ReadOnly.isEnabled||(this.nodes.wrapper.classList.remove(this.CSS.inlineToolbarShowed),Array.from(this.toolsInstances.entries()).forEach((function(e){var n=(0,i.default)(e,2),o=n[0],r=n[1],a=t.getToolShortcut(o);a&&b.default.remove(t.Editor.UI.nodes.redactor,a),h.isFunction(r.clear)&&r.clear()})),this.opened=!1,this.flipper.deactivate(),this.Editor.ConversionToolbar.close()))}},{key:"open",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];if(!this.opened){this.addToolsFiltered(),this.nodes.wrapper.classList.add(this.CSS.inlineToolbarShowed),this.buttonsList=this.nodes.buttons.querySelectorAll(".".concat(this.CSS.inlineToolButton)),this.opened=!0,t&&this.Editor.ConversionToolbar.hasTools()?this.setConversionTogglerContent():this.nodes.conversionToggler.hidden=!0;var e=Array.from(this.buttonsList);e.unshift(this.nodes.conversionToggler),e=e.filter((function(t){return!t.hidden})),this.flipper.activate(e)}}},{key:"containsNode",value:function(t){return this.nodes.wrapper.contains(t)}},{key:"destroy",value:function(){this.flipper&&(this.flipper.deactivate(),this.flipper=null),this.removeAllNodes(),this.tooltip.destroy()}},{key:"make",value:function(){var t=this;this.nodes.wrapper=d.default.make("div",[this.CSS.inlineToolbar].concat((0,r.default)(this.isRtl?[this.Editor.UI.CSS.editorRtlFix]:[]))),this.nodes.togglerAndButtonsWrapper=d.default.make("div",this.CSS.togglerAndButtonsWrapper),this.nodes.buttons=d.default.make("div",this.CSS.buttonsWrapper),this.nodes.actions=d.default.make("div",this.CSS.actionsWrapper),this.listeners.on(this.nodes.wrapper,"mousedown",(function(e){e.target.closest(".".concat(t.CSS.actionsWrapper))||e.preventDefault()})),d.default.append(this.nodes.wrapper,[this.nodes.togglerAndButtonsWrapper,this.nodes.actions]),d.default.append(this.Editor.UI.nodes.wrapper,this.nodes.wrapper),this.addConversionToggler(),d.default.append(this.nodes.togglerAndButtonsWrapper,this.nodes.buttons),this.prepareConversionToolbar(),this.recalculateWidth(),this.enableFlipper()}},{key:"allowedToShow",value:function(){var t=p.default.get(),e=p.default.text;if(!t||!t.anchorNode)return!1;if(t.isCollapsed||e.length<1)return!1;var n=d.default.isElement(t.anchorNode)?t.anchorNode:t.anchorNode.parentElement;if(t&&["IMG","INPUT"].includes(n.tagName))return!1;if(null===n.closest('[contenteditable="true"]'))return!1;var o=this.Editor.BlockManager.getBlock(t.anchorNode);return!!o&&0!==o.tool.inlineTools.size}},{key:"recalculateWidth",value:function(){this.width=this.nodes.wrapper.offsetWidth}},{key:"addConversionToggler",value:function(){var t=this;this.nodes.conversionToggler=d.default.make("div",this.CSS.conversionToggler),this.nodes.conversionTogglerContent=d.default.make("div",this.CSS.conversionTogglerContent);var e=d.default.svg("toggler-down",13,13);this.nodes.conversionToggler.appendChild(this.nodes.conversionTogglerContent),this.nodes.conversionToggler.appendChild(e),this.nodes.togglerAndButtonsWrapper.appendChild(this.nodes.conversionToggler),this.listeners.on(this.nodes.conversionToggler,"click",(function(){t.Editor.ConversionToolbar.toggle((function(e){!e&&t.opened?t.flipper.activate():t.opened&&t.flipper.deactivate()}))})),this.tooltip.onHover(this.nodes.conversionToggler,g.default.ui(y.I18nInternalNS.ui.inlineToolbar.converter,"Convert to"),{placement:"top",hidingDelay:100})}},{key:"setConversionTogglerContent",value:function(){var t=this.Editor.BlockManager.currentBlock,e=t.name,n=t.tool.conversionConfig,o=n&&n.export;this.nodes.conversionToggler.hidden=!o,this.nodes.conversionToggler.classList.toggle(this.CSS.conversionTogglerHidden,!o);var r=t.tool.toolbox||{};this.nodes.conversionTogglerContent.innerHTML=r.icon||r.title||h.capitalize(e)}},{key:"prepareConversionToolbar",value:function(){var t=this.Editor.ConversionToolbar.make();d.default.append(this.nodes.wrapper,t)}},{key:"addToolsFiltered",value:function(){var t=this,e=p.default.get(),n=this.Editor.BlockManager.getBlock(e.anchorNode);this.nodes.buttons.innerHTML="",this.nodes.actions.innerHTML="",this.toolsInstances=new Map,Array.from(n.tool.inlineTools.values()).forEach((function(e){t.addTool(e)})),this.recalculateWidth()}},{key:"addTool",value:function(t){var e=this,n=t.create(),o=n.render();if(o){if(o.dataset.tool=t.name,this.nodes.buttons.appendChild(o),this.toolsInstances.set(t.name,n),h.isFunction(n.renderActions)){var r=n.renderActions();this.nodes.actions.appendChild(r)}this.listeners.on(o,"click",(function(t){e.toolClicked(n),t.preventDefault()}));var i=this.getToolShortcut(t.name);if(i)try{this.enableShortcuts(n,i)}catch(t){}var a=d.default.make("div"),s=g.default.t(y.I18nInternalNS.toolNames,t.title||h.capitalize(t.name));a.appendChild(d.default.text(s)),i&&a.appendChild(d.default.make("div",this.CSS.inlineToolbarShortcut,{textContent:h.beautifyShortcut(i)})),this.tooltip.onHover(o,a,{placement:"top",hidingDelay:100}),n.checkState(p.default.get())}else h.log("Render method must return an instance of Node","warn",t.name)}},{key:"getToolShortcut",value:function(t){var e=this.Editor.Tools,n=e.inlineTools.get(t),o=e.internal.inlineTools;return Array.from(o.keys()).includes(t)?this.inlineTools[t][k.CommonInternalSettings.Shortcut]:n.shortcut}},{key:"enableShortcuts",value:function(t,e){var n=this;b.default.add({name:e,handler:function(e){var o=n.Editor.BlockManager.currentBlock;o&&o.tool.enabledInlineTools&&(e.preventDefault(),n.toolClicked(t))},on:this.Editor.UI.nodes.redactor})}},{key:"toolClicked",value:function(t){var e=p.default.range;t.surround(e),this.checkToolsState()}},{key:"checkToolsState",value:function(){this.toolsInstances.forEach((function(t){t.checkState(p.default.get())}))}},{key:"enableFlipper",value:function(){this.flipper=new v.default({focusedItemClass:this.CSS.focusedButton,allowArrows:!1})}},{key:"inlineTools",get:function(){var t={};return Array.from(this.Editor.Tools.inlineTools.entries()).forEach((function(e){var n=(0,i.default)(e,2),o=n[0],r=n[1];t[o]=r.create()})),t}}]),o}(f.default);o.default=T,T.displayName="InlineToolbar",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(9),n(15),n(7),n(60),n(66),n(59),n(84),n(112),n(82)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g,y){"use strict";var b=n(8),m=n(1);function k(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=m(r),i=m(i),a=m(a),s=m(s),l=m(l),c=m(c),u=m(u),f=b(f),d=m(d),h=m(h),g=m(g),y=m(y);var x=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(k()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(t){var e,i=t.config,a=t.eventsDispatcher;return(0,r.default)(this,o),(e=n.call(this,{config:i,eventsDispatcher:a})).nodes={toolbox:null,buttons:[]},e.opened=!1,e.displayedToolsCount=0,e.flipper=null,e.tooltip=new y.default,e}return(0,i.default)(o,[{key:"make",value:function(){this.nodes.toolbox=u.default.make("div",this.CSS.toolbox),this.addTools(),this.enableFlipper()}},{key:"destroy",value:function(){this.flipper&&(this.flipper.deactivate(),this.flipper=null),this.removeAllNodes(),this.removeAllShortcuts(),this.tooltip.destroy()}},{key:"toolButtonActivate",value:function(t,e){this.insertNewBlock(e)}},{key:"open",value:function(){this.isEmpty||(this.Editor.UI.nodes.wrapper.classList.add(this.CSS.openedToolbarHolderModifier),this.nodes.toolbox.classList.add(this.CSS.toolboxOpened),this.opened=!0,this.flipper.activate())}},{key:"close",value:function(){this.nodes.toolbox.classList.remove(this.CSS.toolboxOpened),this.Editor.UI.nodes.wrapper.classList.remove(this.CSS.openedToolbarHolderModifier),this.opened=!1,this.flipper.deactivate()}},{key:"toggle",value:function(){this.opened?this.close():this.open()}},{key:"addTools",value:function(){var t=this,e=this.Editor.Tools.blockTools;Array.from(e.values()).forEach((function(e){return t.addTool(e)}))}},{key:"addTool",value:function(t){var e=this,n=t.toolbox;if(n)if(!n||n.icon){var o=u.default.make("li",[this.CSS.toolboxButton]);o.dataset.tool=t.name,o.innerHTML=n.icon,u.default.append(this.nodes.toolbox,o),this.nodes.toolbox.appendChild(o),this.nodes.buttons.push(o),this.listeners.on(o,"click",(function(n){e.toolButtonActivate(n,t.name)}));var r=this.drawTooltip(t);this.tooltip.onHover(o,r,{placement:"bottom",hidingDelay:200});var i=t.shortcut;i&&this.enableShortcut(t.name,i),this.displayedToolsCount++}else f.log("Toolbar icon is missed. Tool %o skipped","warn",t.name)}},{key:"drawTooltip",value:function(t){var e=t.toolbox||{},n=h.default.t(v.I18nInternalNS.toolNames,e.title||t.name),o=t.shortcut,r=u.default.make("div",this.CSS.buttonTooltip),i=document.createTextNode(f.capitalize(n));return r.appendChild(i),o&&(o=f.beautifyShortcut(o),r.appendChild(u.default.make("div",this.CSS.buttonShortcut,{textContent:o}))),r}},{key:"enableShortcut",value:function(t,e){var n=this;g.default.add({name:e,handler:function(e){e.preventDefault(),n.insertNewBlock(t)},on:this.Editor.UI.nodes.redactor})}},{key:"removeAllShortcuts",value:function(){var t=this,e=this.Editor.Tools.blockTools;Array.from(e.values()).forEach((function(e){var n=e.shortcut;n&&g.default.remove(t.Editor.UI.nodes.redactor,n)}))}},{key:"enableFlipper",value:function(){var t=Array.from(this.nodes.toolbox.childNodes);this.flipper=new d.default({items:t,focusedItemClass:this.CSS.toolboxButtonActive})}},{key:"insertNewBlock",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.Caret,r=n.currentBlock,i=n.insert({tool:t,replace:r.isEmpty});i.call(p.BlockToolAPI.APPEND_CALLBACK),this.Editor.Caret.setToBlock(i),0===i.inputs.length&&(i===n.lastBlock?(n.insertAtEnd(),o.setToBlock(n.lastBlock)):o.setToBlock(n.nextBlock)),this.Editor.Toolbar.close()}},{key:"CSS",get:function(){return{toolbox:"ce-toolbox",toolboxButton:"ce-toolbox__button",toolboxButtonActive:"ce-toolbox__button--active",toolboxOpened:"ce-toolbox--opened",openedToolbarHolderModifier:"codex-editor--toolbox-opened",buttonTooltip:"ce-toolbox-button-tooltip",buttonShortcut:"ce-toolbox-button-tooltip__shortcut"}}},{key:"isEmpty",get:function(){return 0===this.displayedToolsCount}}]),o}(c.default);o.default=x,x.displayName="Toolbox",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(42),n(30),n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(80),n(384),n(9),n(7),n(385),n(386),n(387),n(388),n(389),n(393),n(394),n(395),n(184)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g,y,b,m,k,x,w,S,T,E){"use strict";var B=n(8),C=n(1);function _(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=C(r),i=C(i),a=C(a),s=C(s),l=C(l),c=C(c),u=C(u),f=C(f),d=C(d),p=C(p),h=C(h),v=C(v),g=B(g),y=C(y),b=C(b),m=C(m),k=C(k),x=C(x),w=C(w),S=C(S),T=C(T),E=C(E);var O=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"===("undefined"==typeof Reflect?"undefined":(0,p.default)(Reflect))&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},I=function(t){(0,u.default)(p,t);var e,n,o=(e=p,function(){var t,n=(0,d.default)(e);if(_()){var o=(0,d.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,f.default)(this,t)});function p(){var t;return(0,l.default)(this,p),(t=o.apply(this,arguments)).stubTool="stub",t.toolsAvailable=new E.default,t.toolsUnavailable=new E.default,t}return(0,c.default)(p,[{key:"prepare",value:(n=(0,s.default)(a.default.mark((function t(){var e,n,o=this;return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(this.validateTools(),this.config.tools=g.deepMerge({},this.internalTools,this.config.tools),Object.prototype.hasOwnProperty.call(this.config,"tools")&&0!==Object.keys(this.config.tools).length){t.next=4;break}throw Error("Can't start without tools");case 4:if(e=this.prepareConfig(),this.factory=new x.default(e,this.config,this.Editor.API),0!==(n=this.getListOfPrepareFunctions(e)).length){t.next=9;break}return t.abrupt("return",Promise.resolve());case 9:return t.next=11,g.sequence(n,(function(t){o.toolPrepareMethodSuccess(t)}),(function(t){o.toolPrepareMethodFallback(t)}));case 11:this.prepareBlockTools();case 12:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"getAllInlineToolsSanitizeConfig",value:function(){var t={};return Array.from(this.inlineTools.values()).forEach((function(e){Object.assign(t,e.sanitizeConfig)})),t}},{key:"destroy",value:function(){Object.values(this.available).forEach(function(){var t=(0,s.default)(a.default.mark((function t(e){return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(!g.isFunction(e.reset)){t.next=3;break}return t.next=3,e.reset();case 3:case"end":return t.stop()}}),t)})));return function(e){return t.apply(this,arguments)}}())}},{key:"toolPrepareMethodSuccess",value:function(t){var e=this.factory.get(t.toolName);if(e.isInline()){var n=["render","surround","checkState"].filter((function(t){return!e.create()[t]}));if(n.length)return g.log("Incorrect Inline Tool: ".concat(e.name,". Some of required methods is not implemented %o"),"warn",n),void this.toolsUnavailable.set(e.name,e)}this.toolsAvailable.set(e.name,e)}},{key:"toolPrepareMethodFallback",value:function(t){this.toolsUnavailable.set(t.toolName,this.factory.get(t.toolName))}},{key:"getListOfPrepareFunctions",value:function(t){var e=[];return Object.entries(t).forEach((function(t){var n=(0,i.default)(t,2),o=n[0],r=n[1];e.push({function:g.isFunction(r.class.prepare)?r.class.prepare:function(){},data:{toolName:o}})})),e}},{key:"prepareBlockTools",value:function(){var t=this;Array.from(this.blockTools.values()).forEach((function(e){t.assignInlineToolsToBlockTool(e),t.assignBlockTunesToBlockTool(e)}))}},{key:"assignInlineToolsToBlockTool",value:function(t){var e=this;!1!==this.config.inlineToolbar&&(!0!==t.enabledInlineTools?Array.isArray(t.enabledInlineTools)&&(t.inlineTools=new E.default(t.enabledInlineTools.map((function(t){return[t,e.inlineTools.get(t)]})))):t.inlineTools=new E.default(Array.isArray(this.config.inlineToolbar)?this.config.inlineToolbar.map((function(t){return[t,e.inlineTools.get(t)]})):Array.from(this.inlineTools.entries())))}},{key:"assignBlockTunesToBlockTool",value:function(t){var e=this;if(!1!==t.enabledBlockTunes)if(Array.isArray(t.enabledBlockTunes)){var n=new E.default(t.enabledBlockTunes.map((function(t){return[t,e.blockTunes.get(t)]})));t.tunes=new E.default([].concat((0,r.default)(n),(0,r.default)(this.blockTunes.internalTools)))}else if(Array.isArray(this.config.tunes)){var o=new E.default(this.config.tunes.map((function(t){return[t,e.blockTunes.get(t)]})));t.tunes=new E.default([].concat((0,r.default)(o),(0,r.default)(this.blockTunes.internalTools)))}else t.tunes=this.blockTunes.internalTools}},{key:"validateTools",value:function(){for(var t in this.config.tools)if(Object.prototype.hasOwnProperty.call(this.config.tools,t)){if(t in this.internalTools)return;var e=this.config.tools[t];if(!g.isFunction(e)&&!g.isFunction(e.class))throw Error("Tool «".concat(t,"» must be a constructor function or an object with function in the «class» property"))}}},{key:"prepareConfig",value:function(){var t={};for(var e in this.config.tools)g.isObject(this.config.tools[e])?t[e]=this.config.tools[e]:t[e]={class:this.config.tools[e]};return t}},{key:"available",get:function(){return this.toolsAvailable}},{key:"unavailable",get:function(){return this.toolsUnavailable}},{key:"inlineTools",get:function(){return this.available.inlineTools}},{key:"blockTools",get:function(){return this.available.blockTools}},{key:"blockTunes",get:function(){return this.available.blockTunes}},{key:"defaultTool",get:function(){return this.blockTools.get(this.config.defaultBlock)}},{key:"internal",get:function(){return this.available.internalTools}},{key:"internalTools",get:function(){return{bold:{class:y.default,isInternal:!0},italic:{class:b.default,isInternal:!0},link:{class:m.default,isInternal:!0},paragraph:{class:h.default,inlineToolbar:!0,isInternal:!0},stub:{class:k.default,isInternal:!0},moveUp:{class:T.default,isInternal:!0},delete:{class:S.default,isInternal:!0},moveDown:{class:w.default,isInternal:!0}}}}]),p}(v.default);o.default=I,I.displayName="Tools",O([g.cacheable],I.prototype,"getAllInlineToolsSanitizeConfig",null),t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(2),n(3),n(5),n(6),n(4),n(150)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l),c=f(c);var p=function(t){(0,s.default)(o,t);var e,n=(e=o,function(){var t,n=(0,c.default)(e);if(d()){var o=(0,c.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,l.default)(this,t)});function o(){return(0,i.default)(this,o),n.apply(this,arguments)}return(0,a.default)(o,[{key:"blockTools",get:function(){return new o(Array.from(this.entries()).filter((function(t){return(0,r.default)(t,2)[1].isBlock()})))}},{key:"inlineTools",get:function(){return new o(Array.from(this.entries()).filter((function(t){return(0,r.default)(t,2)[1].isInline()})))}},{key:"blockTunes",get:function(){return new o(Array.from(this.entries()).filter((function(t){return(0,r.default)(t,2)[1].isTune()})))}},{key:"internalTools",get:function(){return new o(Array.from(this.entries()).filter((function(t){return(0,r.default)(t,2)[1].isInternal})))}},{key:"externalTools",get:function(){return new o(Array.from(this.entries()).filter((function(t){return!(0,r.default)(t,2)[1].isInternal})))}}]),o}((0,(u=f(u)).default)(Map));o.default=p,p.displayName="ToolsCollection",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(42),n(23),n(24),n(2),n(3),n(5),n(6),n(4),n(396),n(9),n(15),n(7),n(25),n(66),n(60)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p,h,v,g,y,b,m){"use strict";var k=n(8),x=n(1);function w(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=x(r),i=x(i),a=x(a),s=x(s),l=x(l),c=x(c),u=x(u),f=x(f),d=x(d),p=x(p),h=x(h),v=x(v),g=k(g),y=x(y),b=x(b),m=x(m);var S=function(t){(0,u.default)(k,t);var e,o,h=(e=k,function(){var t,n=(0,d.default)(e);if(w()){var o=(0,d.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,f.default)(this,t)});function k(){var t;return(0,l.default)(this,k),(t=h.apply(this,arguments)).isMobile=!1,t.contentRectCache=void 0,t.resizeDebouncer=g.debounce((function(){t.windowResize()}),200),t}return(0,c.default)(k,[{key:"addLoader",value:function(){this.nodes.loader=v.default.make("div",this.CSS.editorLoader),this.nodes.wrapper.prepend(this.nodes.loader),this.nodes.redactor.classList.add(this.CSS.editorZoneHidden)}},{key:"removeLoader",value:function(){this.nodes.loader.remove(),this.nodes.redactor.classList.remove(this.CSS.editorZoneHidden)}},{key:"prepare",value:(o=(0,s.default)(a.default.mark((function t(){return a.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:this.checkIsMobile(),this.make(),this.addLoader(),this.appendSVGSprite(),this.loadStyles();case 5:case"end":return t.stop()}}),t,this)}))),function(){return o.apply(this,arguments)})},{key:"toggleReadOnly",value:function(t){t?this.disableModuleBindings():this.enableModuleBindings()}},{key:"checkEmptiness",value:function(){var t=this.Editor.BlockManager;this.nodes.wrapper.classList.toggle(this.CSS.editorEmpty,t.isEditorEmpty)}},{key:"destroy",value:function(){this.nodes.holder.innerHTML=""}},{key:"closeAllToolbars",value:function(){var t=this.Editor,e=t.Toolbox,n=t.BlockSettings,o=t.InlineToolbar,r=t.ConversionToolbar;n.close(),o.close(),r.close(),e.close()}},{key:"checkIsMobile",value:function(){this.isMobile=window.innerWidth<650}},{key:"make",value:function(){this.nodes.holder=v.default.getHolder(this.config.holder),this.nodes.wrapper=v.default.make("div",[this.CSS.editorWrapper].concat((0,i.default)(this.isRtl?[this.CSS.editorRtlFix]:[]))),this.nodes.redactor=v.default.make("div",this.CSS.editorZone),this.nodes.holder.offsetWidth<this.contentRect.width&&this.nodes.wrapper.classList.add(this.CSS.editorWrapperNarrow),this.nodes.redactor.style.paddingBottom=this.config.minHeight+"px",this.nodes.wrapper.appendChild(this.nodes.redactor),this.nodes.holder.appendChild(this.nodes.wrapper)}},{key:"loadStyles",value:function(){var t=n(397);if(!v.default.get("editor-js-styles")){var e=v.default.make("style",null,{id:"editor-js-styles",textContent:t.toString()});v.default.prepend(document.head,e)}}},{key:"enableModuleBindings",value:function(){var t=this;this.readOnlyMutableListeners.on(this.nodes.redactor,"click",(function(e){t.redactorClicked(e)}),!1),this.readOnlyMutableListeners.on(this.nodes.redactor,"mousedown",(function(e){t.documentTouched(e)}),!0),this.readOnlyMutableListeners.on(this.nodes.redactor,"touchstart",(function(e){t.documentTouched(e)}),!0),this.readOnlyMutableListeners.on(document,"keydown",(function(e){t.documentKeydown(e)}),!0),this.readOnlyMutableListeners.on(document,"mousedown",(function(e){t.documentClicked(e)}),!0),this.readOnlyMutableListeners.on(document,"selectionchange",(function(e){t.selectionChanged(e)}),!0),this.readOnlyMutableListeners.on(window,"resize",(function(){t.resizeDebouncer()}),{passive:!0})}},{key:"disableModuleBindings",value:function(){this.readOnlyMutableListeners.clearAll()}},{key:"windowResize",value:function(){this.contentRectCache=null,this.checkIsMobile()}},{key:"documentKeydown",value:function(t){switch(t.keyCode){case g.keyCodes.ENTER:this.enterPressed(t);break;case g.keyCodes.BACKSPACE:this.backspacePressed(t);break;case g.keyCodes.ESC:this.escapePressed(t);break;default:this.defaultBehaviour(t)}}},{key:"defaultBehaviour",value:function(t){var e=this.Editor.BlockManager.currentBlock,n=t.target.closest(".".concat(this.CSS.editorWrapper)),o=t.altKey||t.ctrlKey||t.metaKey||t.shiftKey;void 0===e||null!==n?n||e&&o||(this.Editor.BlockManager.dropPointer(),this.Editor.Toolbar.close()):this.Editor.BlockEvents.keydown(t)}},{key:"backspacePressed",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.BlockSelection,r=e.Caret;if(o.anyBlockSelected&&!y.default.isSelectionExists){var i=n.removeSelectedBlocks();r.setToBlock(n.insertDefaultBlockAtIndex(i,!0),r.positions.START),o.clearSelection(t),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation()}}},{key:"escapePressed",value:function(t){this.Editor.BlockSelection.clearSelection(t),this.Editor.Toolbox.opened?this.Editor.Toolbox.close():this.Editor.BlockSettings.opened?this.Editor.BlockSettings.close():this.Editor.ConversionToolbar.opened?this.Editor.ConversionToolbar.close():this.Editor.InlineToolbar.opened?this.Editor.InlineToolbar.close():this.Editor.Toolbar.close()}},{key:"enterPressed",value:function(t){var e=this.Editor,n=e.BlockManager,o=e.BlockSelection,r=n.currentBlockIndex>=0;if(o.anyBlockSelected&&!y.default.isSelectionExists)return o.clearSelection(t),t.preventDefault(),t.stopImmediatePropagation(),void t.stopPropagation();if(!this.someToolbarOpened&&r&&"BODY"===t.target.tagName){var i=this.Editor.BlockManager.insert();this.Editor.Caret.setToBlock(i),this.Editor.BlockManager.highlightCurrentNode(),this.Editor.Toolbar.move(),this.Editor.Toolbar.plusButton.show()}this.Editor.BlockSelection.clearSelection(t)}},{key:"documentClicked",value:function(t){if(t.isTrusted){var e=t.target;this.nodes.holder.contains(e)||y.default.isAtEditor||(this.Editor.BlockManager.dropPointer(),this.Editor.InlineToolbar.close(),this.Editor.Toolbar.close(),this.Editor.ConversionToolbar.close()),this.Editor.BlockSelection.clearSelection(t)}}},{key:"documentTouched",value:function(t){var e=t.target;if(e===this.nodes.redactor){var n=t instanceof MouseEvent?t.clientX:t.touches[0].clientX,o=t instanceof MouseEvent?t.clientY:t.touches[0].clientY;e=document.elementFromPoint(n,o)}try{this.Editor.BlockManager.setCurrentBlockByChildNode(e),this.Editor.BlockManager.highlightCurrentNode()}catch(t){this.Editor.RectangleSelection.isRectActivated()||this.Editor.Caret.setToTheLastBlock()}this.Editor.Toolbar.open(),this.Editor.Toolbar.plusButton.hide()}},{key:"redactorClicked",value:function(t){var e=this.Editor.BlockSelection;if(y.default.isCollapsed){var n=function(){t.stopImmediatePropagation(),t.stopPropagation()},o=t.target,r=t.metaKey||t.ctrlKey;if(v.default.isAnchor(o)&&r){n();var i=o.getAttribute("href"),a=g.getValidUrl(i);g.openTab(a)}else{if(t.target instanceof Element&&t.target.isEqualNode(this.nodes.redactor)&&!e.anyBlockSelected){n();var s=this.Editor,l=s.BlockManager,c=s.Caret,u=s.Toolbar;l.lastBlock.tool.isDefault&&l.lastBlock.isEmpty||l.insertAtEnd(),c.setToTheLastBlock(),u.move()}this.Editor.BlockManager.currentBlock.tool.isDefault&&(n(),this.Editor.BlockManager.currentBlock.isEmpty&&this.Editor.Toolbar.plusButton.show())}}}},{key:"selectionChanged",value:function(t){var e=this.Editor,n=e.CrossBlockSelection,o=e.BlockSelection,r=y.default.anchorElement;if(n.isCrossBlockSelectionStarted&&o.anyBlockSelected&&y.default.get().removeAllRanges(),r){var i=null===r.closest(".".concat(b.default.CSS.content));if(i&&(this.Editor.InlineToolbar.containsNode(r)||this.Editor.InlineToolbar.close(),"true"!==r.dataset.inlineToolbar))return;this.Editor.BlockManager.currentBlock||this.Editor.BlockManager.setCurrentBlockByChildNode(r);var a=!0!==i;this.Editor.InlineToolbar.tryToShow(!0,a)}else y.default.range||this.Editor.InlineToolbar.close()}},{key:"appendSVGSprite",value:function(){var t=v.default.make("div");t.hidden=!0,t.style.display="none",t.innerHTML=p.default,v.default.append(this.nodes.wrapper,t)}},{key:"CSS",get:function(){return{editorWrapper:"codex-editor",editorWrapperNarrow:"codex-editor--narrow",editorZone:"codex-editor__redactor",editorZoneHidden:"codex-editor__redactor--hidden",editorLoader:"codex-editor__loader",editorEmpty:"codex-editor--empty",editorRtlFix:"codex-editor--rtl"}}},{key:"contentRect",get:function(){if(this.contentRectCache)return this.contentRectCache;var t=this.nodes.wrapper.querySelector(".".concat(b.default.CSS.content));return t?(this.contentRectCache=t.getBoundingClientRect(),this.contentRectCache):{width:650,left:0,right:0}}},{key:"someToolbarOpened",get:function(){var t=this.Editor,e=t.Toolbox,n=t.BlockSettings,o=t.InlineToolbar,r=t.ConversionToolbar;return n.opened||o.opened||r.opened||e.opened}},{key:"someFlipperButtonFocused",get:function(){return Object.entries(this.Editor).filter((function(t){var e=(0,r.default)(t,2);return e[0],e[1].flipper instanceof m.default})).some((function(t){var e=(0,r.default)(t,2);return e[0],e[1].flipper.currentItem}))}}]),k}(h.default);o.default=S,S.displayName="UI",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){n(187),t.exports=n(359)},function(t,e,n){n(188)},function(t,e,n){"use strict";n(189),n(332),n(334),n(337),n(339),n(341),n(343),n(345),n(347),n(349),n(351),n(353),n(355),n(144)},function(t,e,n){n(190),n(193),n(194),n(195),n(196),n(197),n(198),n(199),n(200),n(201),n(202),n(203),n(204),n(205),n(206),n(207),n(208),n(209),n(210),n(211),n(212),n(213),n(214),n(215),n(216),n(217),n(218),n(219),n(220),n(221),n(222),n(223),n(224),n(225),n(226),n(227),n(228),n(229),n(230),n(231),n(232),n(233),n(234),n(236),n(237),n(238),n(239),n(240),n(241),n(242),n(243),n(244),n(245),n(246),n(247),n(248),n(249),n(250),n(251),n(252),n(253),n(254),n(255),n(256),n(257),n(258),n(259),n(260),n(261),n(262),n(263),n(264),n(265),n(266),n(267),n(268),n(269),n(271),n(272),n(274),n(275),n(276),n(277),n(278),n(279),n(280),n(282),n(283),n(284),n(285),n(286),n(287),n(288),n(289),n(290),n(291),n(292),n(293),n(294),n(105),n(295),n(133),n(296),n(134),n(297),n(298),n(299),n(300),n(135),n(303),n(304),n(305),n(306),n(307),n(308),n(309),n(310),n(311),n(312),n(313),n(314),n(315),n(316),n(317),n(318),n(319),n(320),n(321),n(322),n(323),n(324),n(325),n(326),n(327),n(328),n(329),n(330),n(331),t.exports=n(17)},function(t,e,n){"use strict";var o=n(10),r=n(26),i=n(18),a=n(0),s=n(21),l=n(41).KEY,c=n(11),u=n(68),f=n(53),d=n(44),p=n(14),h=n(86),v=n(114),g=n(192),y=n(71),b=n(12),m=n(13),k=n(20),x=n(28),w=n(40),S=n(43),T=n(48),E=n(117),B=n(34),C=n(70),_=n(19),O=n(46),I=B.f,M=_.f,R=E.f,A=o.Symbol,N=o.JSON,P=N&&N.stringify,L=p("_hidden"),D=p("toPrimitive"),j={}.propertyIsEnumerable,F=u("symbol-registry"),U=u("symbols"),H=u("op-symbols"),z=Object.prototype,W="function"==typeof A&&!!C.f,Y=o.QObject,V=!Y||!Y.prototype||!Y.prototype.findChild,X=i&&c((function(){return 7!=T(M({},"a",{get:function(){return M(this,"a",{value:7}).a}})).a}))?function(t,e,n){var o=I(z,e);o&&delete z[e],M(t,e,n),o&&t!==z&&M(z,e,o)}:M,G=function(t){var e=U[t]=T(A.prototype);return e._k=t,e},K=W&&"symbol"==typeof A.iterator?function(t){return"symbol"==typeof t}:function(t){return t instanceof A},Z=function(t,e,n){return t===z&&Z(H,e,n),b(t),e=w(e,!0),b(n),r(U,e)?(n.enumerable?(r(t,L)&&t[L][e]&&(t[L][e]=!1),n=T(n,{enumerable:S(0,!1)})):(r(t,L)||M(t,L,S(1,{})),t[L][e]=!0),X(t,e,n)):M(t,e,n)},q=function(t,e){b(t);for(var n,o=g(e=x(e)),r=0,i=o.length;i>r;)Z(t,n=o[r++],e[n]);return t},J=function(t){var e=j.call(this,t=w(t,!0));return!(this===z&&r(U,t)&&!r(H,t))&&(!(e||!r(this,t)||!r(U,t)||r(this,L)&&this[L][t])||e)},$=function(t,e){if(t=x(t),e=w(e,!0),t!==z||!r(U,e)||r(H,e)){var n=I(t,e);return!n||!r(U,e)||r(t,L)&&t[L][e]||(n.enumerable=!0),n}},Q=function(t){for(var e,n=R(x(t)),o=[],i=0;n.length>i;)r(U,e=n[i++])||e==L||e==l||o.push(e);return o},tt=function(t){for(var e,n=t===z,o=R(n?H:x(t)),i=[],a=0;o.length>a;)!r(U,e=o[a++])||n&&!r(z,e)||i.push(U[e]);return i};W||(s((A=function(){if(this instanceof A)throw TypeError("Symbol is not a constructor!");var t=d(arguments.length>0?arguments[0]:void 0),e=function(n){this===z&&e.call(H,n),r(this,L)&&r(this[L],t)&&(this[L][t]=!1),X(this,t,S(1,n))};return i&&V&&X(z,t,{configurable:!0,set:e}),G(t)}).prototype,"toString",(function(){return this._k})),B.f=$,_.f=Z,n(49).f=E.f=Q,n(62).f=J,C.f=tt,i&&!n(45)&&s(z,"propertyIsEnumerable",J,!0),h.f=function(t){return G(p(t))}),a(a.G+a.W+a.F*!W,{Symbol:A});for(var et="hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables".split(","),nt=0;et.length>nt;)p(et[nt++]);for(var ot=O(p.store),rt=0;ot.length>rt;)v(ot[rt++]);a(a.S+a.F*!W,"Symbol",{for:function(t){return r(F,t+="")?F[t]:F[t]=A(t)},keyFor:function(t){if(!K(t))throw TypeError(t+" is not a symbol!");for(var e in F)if(F[e]===t)return e},useSetter:function(){V=!0},useSimple:function(){V=!1}}),a(a.S+a.F*!W,"Object",{create:function(t,e){return void 0===e?T(t):q(T(t),e)},defineProperty:Z,defineProperties:q,getOwnPropertyDescriptor:$,getOwnPropertyNames:Q,getOwnPropertySymbols:tt});var it=c((function(){C.f(1)}));a(a.S+a.F*it,"Object",{getOwnPropertySymbols:function(t){return C.f(k(t))}}),N&&a(a.S+a.F*(!W||c((function(){var t=A();return"[null]"!=P([t])||"{}"!=P({a:t})||"{}"!=P(Object(t))}))),"JSON",{stringify:function(t){for(var e,n,o=[t],r=1;arguments.length>r;)o.push(arguments[r++]);if(n=e=o[1],(m(e)||void 0!==t)&&!K(t))return y(e)||(e=function(t,e){if("function"==typeof n&&(e=n.call(this,t,e)),!K(e))return e}),o[1]=e,P.apply(N,o)}}),A.prototype[D]||n(27)(A.prototype,D,A.prototype.valueOf),f(A,"Symbol"),f(Math,"Math",!0),f(o.JSON,"JSON",!0)},function(t,e,n){t.exports=n(68)("native-function-to-string",Function.toString)},function(t,e,n){var o=n(46),r=n(70),i=n(62);t.exports=function(t){var e=o(t),n=r.f;if(n)for(var a,s=n(t),l=i.f,c=0;s.length>c;)l.call(t,a=s[c++])&&e.push(a);return e}},function(t,e,n){var o=n(0);o(o.S,"Object",{create:n(48)})},function(t,e,n){var o=n(0);o(o.S+o.F*!n(18),"Object",{defineProperty:n(19).f})},function(t,e,n){var o=n(0);o(o.S+o.F*!n(18),"Object",{defineProperties:n(116)})},function(t,e,n){var o=n(28),r=n(34).f;n(35)("getOwnPropertyDescriptor",(function(){return function(t,e){return r(o(t),e)}}))},function(t,e,n){var o=n(20),r=n(50);n(35)("getPrototypeOf",(function(){return function(t){return r(o(t))}}))},function(t,e,n){var o=n(20),r=n(46);n(35)("keys",(function(){return function(t){return r(o(t))}}))},function(t,e,n){n(35)("getOwnPropertyNames",(function(){return n(117).f}))},function(t,e,n){var o=n(13),r=n(41).onFreeze;n(35)("freeze",(function(t){return function(e){return t&&o(e)?t(r(e)):e}}))},function(t,e,n){var o=n(13),r=n(41).onFreeze;n(35)("seal",(function(t){return function(e){return t&&o(e)?t(r(e)):e}}))},function(t,e,n){var o=n(13),r=n(41).onFreeze;n(35)("preventExtensions",(function(t){return function(e){return t&&o(e)?t(r(e)):e}}))},function(t,e,n){var o=n(13);n(35)("isFrozen",(function(t){return function(e){return!o(e)||!!t&&t(e)}}))},function(t,e,n){var o=n(13);n(35)("isSealed",(function(t){return function(e){return!o(e)||!!t&&t(e)}}))},function(t,e,n){var o=n(13);n(35)("isExtensible",(function(t){return function(e){return!!o(e)&&(!t||t(e))}}))},function(t,e,n){var o=n(0);o(o.S+o.F,"Object",{assign:n(118)})},function(t,e,n){var o=n(0);o(o.S,"Object",{is:n(119)})},function(t,e,n){var o=n(0);o(o.S,"Object",{setPrototypeOf:n(90).set})},function(t,e,n){"use strict";var o=n(63),r={};r[n(14)("toStringTag")]="z",r+""!="[object z]"&&n(21)(Object.prototype,"toString",(function(){return"[object "+o(this)+"]"}),!0)},function(t,e,n){var o=n(0);o(o.P,"Function",{bind:n(120)})},function(t,e,n){var o=n(19).f,r=Function.prototype,i=/^\s*function ([^ (]*)/;"name"in r||n(18)&&o(r,"name",{configurable:!0,get:function(){try{return(""+this).match(i)[1]}catch(t){return""}}})},function(t,e,n){"use strict";var o=n(13),r=n(50),i=n(14)("hasInstance"),a=Function.prototype;i in a||n(19).f(a,i,{value:function(t){if("function"!=typeof this||!o(t))return!1;if(!o(this.prototype))return t instanceof this;for(;t=r(t);)if(this.prototype===t)return!0;return!1}})},function(t,e,n){var o=n(0),r=n(122);o(o.G+o.F*(parseInt!=r),{parseInt:r})},function(t,e,n){var o=n(0),r=n(123);o(o.G+o.F*(parseFloat!=r),{parseFloat:r})},function(t,e,n){"use strict";var o=n(10),r=n(26),i=n(37),a=n(92),s=n(40),l=n(11),c=n(49).f,u=n(34).f,f=n(19).f,d=n(54).trim,p=o.Number,h=p,v=p.prototype,g="Number"==i(n(48)(v)),y="trim"in String.prototype,b=function(t){var e=s(t,!1);if("string"==typeof e&&e.length>2){var n,o,r,i=(e=y?e.trim():d(e,3)).charCodeAt(0);if(43===i||45===i){if(88===(n=e.charCodeAt(2))||120===n)return NaN}else if(48===i){switch(e.charCodeAt(1)){case 66:case 98:o=2,r=49;break;case 79:case 111:o=8,r=55;break;default:return+e}for(var a,l=e.slice(2),c=0,u=l.length;c<u;c++)if((a=l.charCodeAt(c))<48||a>r)return NaN;return parseInt(l,o)}}return+e};if(!p(" 0o1")||!p("0b1")||p("+0x1")){p=function(t){var e=arguments.length<1?0:t,n=this;return n instanceof p&&(g?l((function(){v.valueOf.call(n)})):"Number"!=i(n))?a(new h(b(e)),n,p):b(e)};for(var m,k=n(18)?c(h):"MAX_VALUE,MIN_VALUE,NaN,NEGATIVE_INFINITY,POSITIVE_INFINITY,EPSILON,isFinite,isInteger,isNaN,isSafeInteger,MAX_SAFE_INTEGER,MIN_SAFE_INTEGER,parseFloat,parseInt,isInteger".split(","),x=0;k.length>x;x++)r(h,m=k[x])&&!r(p,m)&&f(p,m,u(h,m));p.prototype=v,v.constructor=p,n(21)(o,"Number",p)}},function(t,e,n){"use strict";var o=n(0),r=n(33),i=n(124),a=n(93),s=1..toFixed,l=Math.floor,c=[0,0,0,0,0,0],u="Number.toFixed: incorrect invocation!",f=function(t,e){for(var n=-1,o=e;++n<6;)o+=t*c[n],c[n]=o%1e7,o=l(o/1e7)},d=function(t){for(var e=6,n=0;--e>=0;)n+=c[e],c[e]=l(n/t),n=n%t*1e7},p=function(){for(var t=6,e="";--t>=0;)if(""!==e||0===t||0!==c[t]){var n=String(c[t]);e=""===e?n:e+a.call("0",7-n.length)+n}return e},h=function(t,e,n){return 0===e?n:e%2==1?h(t,e-1,n*t):h(t*t,e/2,n)};o(o.P+o.F*(!!s&&("0.000"!==8e-5.toFixed(3)||"1"!==.9.toFixed(0)||"1.25"!==1.255.toFixed(2)||"1000000000000000128"!==(0xde0b6b3a7640080).toFixed(0))||!n(11)((function(){s.call({})}))),"Number",{toFixed:function(t){var e,n,o,s,l=i(this,u),c=r(t),v="",g="0";if(c<0||c>20)throw RangeError(u);if(l!=l)return"NaN";if(l<=-1e21||l>=1e21)return String(l);if(l<0&&(v="-",l=-l),l>1e-21)if(n=(e=function(t){for(var e=0,n=t;n>=4096;)e+=12,n/=4096;for(;n>=2;)e+=1,n/=2;return e}(l*h(2,69,1))-69)<0?l*h(2,-e,1):l/h(2,e,1),n*=4503599627370496,(e=52-e)>0){for(f(0,n),o=c;o>=7;)f(1e7,0),o-=7;for(f(h(10,o,1),0),o=e-1;o>=23;)d(1<<23),o-=23;d(1<<o),f(1,1),d(2),g=p()}else f(0,n),f(1<<-e,0),g=p()+a.call("0",c);return g=c>0?v+((s=g.length)<=c?"0."+a.call("0",c-s)+g:g.slice(0,s-c)+"."+g.slice(s-c)):v+g}})},function(t,e,n){"use strict";var o=n(0),r=n(11),i=n(124),a=1..toPrecision;o(o.P+o.F*(r((function(){return"1"!==a.call(1,void 0)}))||!r((function(){a.call({})}))),"Number",{toPrecision:function(t){var e=i(this,"Number#toPrecision: incorrect invocation!");return void 0===t?a.call(e):a.call(e,t)}})},function(t,e,n){var o=n(0);o(o.S,"Number",{EPSILON:Math.pow(2,-52)})},function(t,e,n){var o=n(0),r=n(10).isFinite;o(o.S,"Number",{isFinite:function(t){return"number"==typeof t&&r(t)}})},function(t,e,n){var o=n(0);o(o.S,"Number",{isInteger:n(125)})},function(t,e,n){var o=n(0);o(o.S,"Number",{isNaN:function(t){return t!=t}})},function(t,e,n){var o=n(0),r=n(125),i=Math.abs;o(o.S,"Number",{isSafeInteger:function(t){return r(t)&&i(t)<=9007199254740991}})},function(t,e,n){var o=n(0);o(o.S,"Number",{MAX_SAFE_INTEGER:9007199254740991})},function(t,e,n){var o=n(0);o(o.S,"Number",{MIN_SAFE_INTEGER:-9007199254740991})},function(t,e,n){var o=n(0),r=n(123);o(o.S+o.F*(Number.parseFloat!=r),"Number",{parseFloat:r})},function(t,e,n){var o=n(0),r=n(122);o(o.S+o.F*(Number.parseInt!=r),"Number",{parseInt:r})},function(t,e,n){var o=n(0),r=n(126),i=Math.sqrt,a=Math.acosh;o(o.S+o.F*!(a&&710==Math.floor(a(Number.MAX_VALUE))&&a(1/0)==1/0),"Math",{acosh:function(t){return(t=+t)<1?NaN:t>94906265.62425156?Math.log(t)+Math.LN2:r(t-1+i(t-1)*i(t+1))}})},function(t,e,n){var o=n(0),r=Math.asinh;o(o.S+o.F*!(r&&1/r(0)>0),"Math",{asinh:function t(e){return isFinite(e=+e)&&0!=e?e<0?-t(-e):Math.log(e+Math.sqrt(e*e+1)):e}})},function(t,e,n){var o=n(0),r=Math.atanh;o(o.S+o.F*!(r&&1/r(-0)<0),"Math",{atanh:function(t){return 0==(t=+t)?t:Math.log((1+t)/(1-t))/2}})},function(t,e,n){var o=n(0),r=n(94);o(o.S,"Math",{cbrt:function(t){return r(t=+t)*Math.pow(Math.abs(t),1/3)}})},function(t,e,n){var o=n(0);o(o.S,"Math",{clz32:function(t){return(t>>>=0)?31-Math.floor(Math.log(t+.5)*Math.LOG2E):32}})},function(t,e,n){var o=n(0),r=Math.exp;o(o.S,"Math",{cosh:function(t){return(r(t=+t)+r(-t))/2}})},function(t,e,n){var o=n(0),r=n(95);o(o.S+o.F*(r!=Math.expm1),"Math",{expm1:r})},function(t,e,n){var o=n(0);o(o.S,"Math",{fround:n(235)})},function(t,e,n){var o=n(94),r=Math.pow,i=r(2,-52),a=r(2,-23),s=r(2,127)*(2-a),l=r(2,-126);t.exports=Math.fround||function(t){var e,n,r=Math.abs(t),c=o(t);return r<l?c*(r/l/a+1/i-1/i)*l*a:(n=(e=(1+a/i)*r)-(e-r))>s||n!=n?c*(1/0):c*n}},function(t,e,n){var o=n(0),r=Math.abs;o(o.S,"Math",{hypot:function(t,e){for(var n,o,i=0,a=0,s=arguments.length,l=0;a<s;)l<(n=r(arguments[a++]))?(i=i*(o=l/n)*o+1,l=n):i+=n>0?(o=n/l)*o:n;return l===1/0?1/0:l*Math.sqrt(i)}})},function(t,e,n){var o=n(0),r=Math.imul;o(o.S+o.F*n(11)((function(){return-5!=r(4294967295,5)||2!=r.length})),"Math",{imul:function(t,e){var n=+t,o=+e,r=65535&n,i=65535&o;return 0|r*i+((65535&n>>>16)*i+r*(65535&o>>>16)<<16>>>0)}})},function(t,e,n){var o=n(0);o(o.S,"Math",{log10:function(t){return Math.log(t)*Math.LOG10E}})},function(t,e,n){var o=n(0);o(o.S,"Math",{log1p:n(126)})},function(t,e,n){var o=n(0);o(o.S,"Math",{log2:function(t){return Math.log(t)/Math.LN2}})},function(t,e,n){var o=n(0);o(o.S,"Math",{sign:n(94)})},function(t,e,n){var o=n(0),r=n(95),i=Math.exp;o(o.S+o.F*n(11)((function(){return-2e-17!=!Math.sinh(-2e-17)})),"Math",{sinh:function(t){return Math.abs(t=+t)<1?(r(t)-r(-t))/2:(i(t-1)-i(-t-1))*(Math.E/2)}})},function(t,e,n){var o=n(0),r=n(95),i=Math.exp;o(o.S,"Math",{tanh:function(t){var e=r(t=+t),n=r(-t);return e==1/0?1:n==1/0?-1:(e-n)/(i(t)+i(-t))}})},function(t,e,n){var o=n(0);o(o.S,"Math",{trunc:function(t){return(t>0?Math.floor:Math.ceil)(t)}})},function(t,e,n){var o=n(0),r=n(47),i=String.fromCharCode,a=String.fromCodePoint;o(o.S+o.F*(!!a&&1!=a.length),"String",{fromCodePoint:function(t){for(var e,n=[],o=arguments.length,a=0;o>a;){if(e=+arguments[a++],r(e,1114111)!==e)throw RangeError(e+" is not a valid code point");n.push(e<65536?i(e):i(55296+((e-=65536)>>10),e%1024+56320))}return n.join("")}})},function(t,e,n){var o=n(0),r=n(28),i=n(16);o(o.S,"String",{raw:function(t){for(var e=r(t.raw),n=i(e.length),o=arguments.length,a=[],s=0;n>s;)a.push(String(e[s++])),s<o&&a.push(String(arguments[s]));return a.join("")}})},function(t,e,n){"use strict";n(54)("trim",(function(t){return function(){return t(this,3)}}))},function(t,e,n){"use strict";var o=n(96)(!0);n(97)(String,"String",(function(t){this._t=String(t),this._i=0}),(function(){var t,e=this._t,n=this._i;return n>=e.length?{value:void 0,done:!0}:(t=o(e,n),this._i+=t.length,{value:t,done:!1})}))},function(t,e,n){"use strict";var o=n(0),r=n(96)(!1);o(o.P,"String",{codePointAt:function(t){return r(this,t)}})},function(t,e,n){"use strict";var o=n(0),r=n(16),i=n(98),a="".endsWith;o(o.P+o.F*n(100)("endsWith"),"String",{endsWith:function(t){var e=i(this,t,"endsWith"),n=arguments.length>1?arguments[1]:void 0,o=r(e.length),s=void 0===n?o:Math.min(r(n),o),l=String(t);return a?a.call(e,l,s):e.slice(s-l.length,s)===l}})},function(t,e,n){"use strict";var o=n(0),r=n(98);o(o.P+o.F*n(100)("includes"),"String",{includes:function(t){return!!~r(this,t,"includes").indexOf(t,arguments.length>1?arguments[1]:void 0)}})},function(t,e,n){var o=n(0);o(o.P,"String",{repeat:n(93)})},function(t,e,n){"use strict";var o=n(0),r=n(16),i=n(98),a="".startsWith;o(o.P+o.F*n(100)("startsWith"),"String",{startsWith:function(t){var e=i(this,t,"startsWith"),n=r(Math.min(arguments.length>1?arguments[1]:void 0,e.length)),o=String(t);return a?a.call(e,o,n):e.slice(n,n+o.length)===o}})},function(t,e,n){"use strict";n(22)("anchor",(function(t){return function(e){return t(this,"a","name",e)}}))},function(t,e,n){"use strict";n(22)("big",(function(t){return function(){return t(this,"big","","")}}))},function(t,e,n){"use strict";n(22)("blink",(function(t){return function(){return t(this,"blink","","")}}))},function(t,e,n){"use strict";n(22)("bold",(function(t){return function(){return t(this,"b","","")}}))},function(t,e,n){"use strict";n(22)("fixed",(function(t){return function(){return t(this,"tt","","")}}))},function(t,e,n){"use strict";n(22)("fontcolor",(function(t){return function(e){return t(this,"font","color",e)}}))},function(t,e,n){"use strict";n(22)("fontsize",(function(t){return function(e){return t(this,"font","size",e)}}))},function(t,e,n){"use strict";n(22)("italics",(function(t){return function(){return t(this,"i","","")}}))},function(t,e,n){"use strict";n(22)("link",(function(t){return function(e){return t(this,"a","href",e)}}))},function(t,e,n){"use strict";n(22)("small",(function(t){return function(){return t(this,"small","","")}}))},function(t,e,n){"use strict";n(22)("strike",(function(t){return function(){return t(this,"strike","","")}}))},function(t,e,n){"use strict";n(22)("sub",(function(t){return function(){return t(this,"sub","","")}}))},function(t,e,n){"use strict";n(22)("sup",(function(t){return function(){return t(this,"sup","","")}}))},function(t,e,n){var o=n(0);o(o.S,"Date",{now:function(){return(new Date).getTime()}})},function(t,e,n){"use strict";var o=n(0),r=n(20),i=n(40);o(o.P+o.F*n(11)((function(){return null!==new Date(NaN).toJSON()||1!==Date.prototype.toJSON.call({toISOString:function(){return 1}})})),"Date",{toJSON:function(t){var e=r(this),n=i(e);return"number"!=typeof n||isFinite(n)?e.toISOString():null}})},function(t,e,n){var o=n(0),r=n(270);o(o.P+o.F*(Date.prototype.toISOString!==r),"Date",{toISOString:r})},function(t,e,n){"use strict";var o=n(11),r=Date.prototype.getTime,i=Date.prototype.toISOString,a=function(t){return t>9?t:"0"+t};t.exports=o((function(){return"0385-07-25T07:06:39.999Z"!=i.call(new Date(-50000000000001))}))||!o((function(){i.call(new Date(NaN))}))?function(){if(!isFinite(r.call(this)))throw RangeError("Invalid time value");var t=this,e=t.getUTCFullYear(),n=t.getUTCMilliseconds(),o=e<0?"-":e>9999?"+":"";return o+("00000"+Math.abs(e)).slice(o?-6:-4)+"-"+a(t.getUTCMonth()+1)+"-"+a(t.getUTCDate())+"T"+a(t.getUTCHours())+":"+a(t.getUTCMinutes())+":"+a(t.getUTCSeconds())+"."+(n>99?n:"0"+a(n))+"Z"}:i},function(t,e,n){var o=Date.prototype,r=o.toString,i=o.getTime;new Date(NaN)+""!="Invalid Date"&&n(21)(o,"toString",(function(){var t=i.call(this);return t==t?r.call(this):"Invalid Date"}))},function(t,e,n){var o=n(14)("toPrimitive"),r=Date.prototype;o in r||n(27)(r,o,n(273))},function(t,e,n){"use strict";var o=n(12),r=n(40);t.exports=function(t){if("string"!==t&&"number"!==t&&"default"!==t)throw TypeError("Incorrect hint");return r(o(this),"number"!=t)}},function(t,e,n){var o=n(0);o(o.S,"Array",{isArray:n(71)})},function(t,e,n){"use strict";var o=n(31),r=n(0),i=n(20),a=n(128),s=n(101),l=n(16),c=n(102),u=n(103);r(r.S+r.F*!n(72)((function(t){Array.from(t)})),"Array",{from:function(t){var e,n,r,f,d=i(t),p="function"==typeof this?this:Array,h=arguments.length,v=h>1?arguments[1]:void 0,g=void 0!==v,y=0,b=u(d);if(g&&(v=o(v,h>2?arguments[2]:void 0,2)),null==b||p==Array&&s(b))for(n=new p(e=l(d.length));e>y;y++)c(n,y,g?v(d[y],y):d[y]);else for(f=b.call(d),n=new p;!(r=f.next()).done;y++)c(n,y,g?a(f,v,[r.value,y],!0):r.value);return n.length=y,n}})},function(t,e,n){"use strict";var o=n(0),r=n(102);o(o.S+o.F*n(11)((function(){function t(){}return!(Array.of.call(t)instanceof t)})),"Array",{of:function(){for(var t=0,e=arguments.length,n=new("function"==typeof this?this:Array)(e);e>t;)r(n,t,arguments[t++]);return n.length=e,n}})},function(t,e,n){"use strict";var o=n(0),r=n(28),i=[].join;o(o.P+o.F*(n(61)!=Object||!n(29)(i)),"Array",{join:function(t){return i.call(r(this),void 0===t?",":t)}})},function(t,e,n){"use strict";var o=n(0),r=n(89),i=n(37),a=n(47),s=n(16),l=[].slice;o(o.P+o.F*n(11)((function(){r&&l.call(r)})),"Array",{slice:function(t,e){var n=s(this.length),o=i(this);if(e=void 0===e?n:e,"Array"==o)return l.call(this,t,e);for(var r=a(t,n),c=a(e,n),u=s(c-r),f=new Array(u),d=0;d<u;d++)f[d]="String"==o?this.charAt(r+d):this[r+d];return f}})},function(t,e,n){"use strict";var o=n(0),r=n(32),i=n(20),a=n(11),s=[].sort,l=[1,2,3];o(o.P+o.F*(a((function(){l.sort(void 0)}))||!a((function(){l.sort(null)}))||!n(29)(s)),"Array",{sort:function(t){return void 0===t?s.call(i(this)):s.call(i(this),r(t))}})},function(t,e,n){"use strict";var o=n(0),r=n(36)(0),i=n(29)([].forEach,!0);o(o.P+o.F*!i,"Array",{forEach:function(t){return r(this,t,arguments[1])}})},function(t,e,n){var o=n(13),r=n(71),i=n(14)("species");t.exports=function(t){var e;return r(t)&&("function"!=typeof(e=t.constructor)||e!==Array&&!r(e.prototype)||(e=void 0),o(e)&&null===(e=e[i])&&(e=void 0)),void 0===e?Array:e}},function(t,e,n){"use strict";var o=n(0),r=n(36)(1);o(o.P+o.F*!n(29)([].map,!0),"Array",{map:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var o=n(0),r=n(36)(2);o(o.P+o.F*!n(29)([].filter,!0),"Array",{filter:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var o=n(0),r=n(36)(3);o(o.P+o.F*!n(29)([].some,!0),"Array",{some:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var o=n(0),r=n(36)(4);o(o.P+o.F*!n(29)([].every,!0),"Array",{every:function(t){return r(this,t,arguments[1])}})},function(t,e,n){"use strict";var o=n(0),r=n(130);o(o.P+o.F*!n(29)([].reduce,!0),"Array",{reduce:function(t){return r(this,t,arguments.length,arguments[1],!1)}})},function(t,e,n){"use strict";var o=n(0),r=n(130);o(o.P+o.F*!n(29)([].reduceRight,!0),"Array",{reduceRight:function(t){return r(this,t,arguments.length,arguments[1],!0)}})},function(t,e,n){"use strict";var o=n(0),r=n(69)(!1),i=[].indexOf,a=!!i&&1/[1].indexOf(1,-0)<0;o(o.P+o.F*(a||!n(29)(i)),"Array",{indexOf:function(t){return a?i.apply(this,arguments)||0:r(this,t,arguments[1])}})},function(t,e,n){"use strict";var o=n(0),r=n(28),i=n(33),a=n(16),s=[].lastIndexOf,l=!!s&&1/[1].lastIndexOf(1,-0)<0;o(o.P+o.F*(l||!n(29)(s)),"Array",{lastIndexOf:function(t){if(l)return s.apply(this,arguments)||0;var e=r(this),n=a(e.length),o=n-1;for(arguments.length>1&&(o=Math.min(o,i(arguments[1]))),o<0&&(o=n+o);o>=0;o--)if(o in e&&e[o]===t)return o||0;return-1}})},function(t,e,n){var o=n(0);o(o.P,"Array",{copyWithin:n(131)}),n(51)("copyWithin")},function(t,e,n){var o=n(0);o(o.P,"Array",{fill:n(104)}),n(51)("fill")},function(t,e,n){"use strict";var o=n(0),r=n(36)(5),i=!0;"find"in[]&&Array(1).find((function(){i=!1})),o(o.P+o.F*i,"Array",{find:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(51)("find")},function(t,e,n){"use strict";var o=n(0),r=n(36)(6),i="findIndex",a=!0;i in[]&&Array(1)[i]((function(){a=!1})),o(o.P+o.F*a,"Array",{findIndex:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(51)(i)},function(t,e,n){n(56)("Array")},function(t,e,n){var o=n(10),r=n(92),i=n(19).f,a=n(49).f,s=n(99),l=n(73),c=o.RegExp,u=c,f=c.prototype,d=/a/g,p=/a/g,h=new c(d)!==d;if(n(18)&&(!h||n(11)((function(){return p[n(14)("match")]=!1,c(d)!=d||c(p)==p||"/a/i"!=c(d,"i")})))){c=function(t,e){var n=this instanceof c,o=s(t),i=void 0===e;return!n&&o&&t.constructor===c&&i?t:r(h?new u(o&&!i?t.source:t,e):u((o=t instanceof c)?t.source:t,o&&i?l.call(t):e),n?this:f,c)};for(var v=function(t){t in c||i(c,t,{configurable:!0,get:function(){return u[t]},set:function(e){u[t]=e}})},g=a(u),y=0;g.length>y;)v(g[y++]);f.constructor=c,c.prototype=f,n(21)(o,"RegExp",c)}n(56)("RegExp")},function(t,e,n){"use strict";n(134);var o=n(12),r=n(73),i=n(18),a=/./.toString,s=function(t){n(21)(RegExp.prototype,"toString",t,!0)};n(11)((function(){return"/a/b"!=a.call({source:"a",flags:"b"})}))?s((function(){var t=o(this);return"/".concat(t.source,"/","flags"in t?t.flags:!i&&t instanceof RegExp?r.call(t):void 0)})):"toString"!=a.name&&s((function(){return a.call(this)}))},function(t,e,n){"use strict";var o=n(12),r=n(16),i=n(107),a=n(74);n(75)("match",1,(function(t,e,n,s){return[function(n){var o=t(this),r=null==n?void 0:n[e];return void 0!==r?r.call(n,o):new RegExp(n)[e](String(o))},function(t){var e=s(n,t,this);if(e.done)return e.value;var l=o(t),c=String(this);if(!l.global)return a(l,c);var u=l.unicode;l.lastIndex=0;for(var f,d=[],p=0;null!==(f=a(l,c));){var h=String(f[0]);d[p]=h,""===h&&(l.lastIndex=i(c,r(l.lastIndex),u)),p++}return 0===p?null:d}]}))},function(t,e,n){"use strict";var o=n(12),r=n(20),i=n(16),a=n(33),s=n(107),l=n(74),c=Math.max,u=Math.min,f=Math.floor,d=/\$([$&`']|\d\d?|<[^>]*>)/g,p=/\$([$&`']|\d\d?)/g;n(75)("replace",2,(function(t,e,n,h){return[function(o,r){var i=t(this),a=null==o?void 0:o[e];return void 0!==a?a.call(o,i,r):n.call(String(i),o,r)},function(t,e){var r=h(n,t,this,e);if(r.done)return r.value;var f=o(t),d=String(this),p="function"==typeof e;p||(e=String(e));var g=f.global;if(g){var y=f.unicode;f.lastIndex=0}for(var b=[];;){var m=l(f,d);if(null===m)break;if(b.push(m),!g)break;""===String(m[0])&&(f.lastIndex=s(d,i(f.lastIndex),y))}for(var k,x="",w=0,S=0;S<b.length;S++){m=b[S];for(var T=String(m[0]),E=c(u(a(m.index),d.length),0),B=[],C=1;C<m.length;C++)B.push(void 0===(k=m[C])?k:String(k));var _=m.groups;if(p){var O=[T].concat(B,E,d);void 0!==_&&O.push(_);var I=String(e.apply(void 0,O))}else I=v(T,d,E,B,_,e);E>=w&&(x+=d.slice(w,E)+I,w=E+T.length)}return x+d.slice(w)}];function v(t,e,o,i,a,s){var l=o+t.length,c=i.length,u=p;return void 0!==a&&(a=r(a),u=d),n.call(s,u,(function(n,r){var s;switch(r.charAt(0)){case"$":return"$";case"&":return t;case"`":return e.slice(0,o);case"'":return e.slice(l);case"<":s=a[r.slice(1,-1)];break;default:var u=+r;if(0===u)return n;if(u>c){var d=f(u/10);return 0===d?n:d<=c?void 0===i[d-1]?r.charAt(1):i[d-1]+r.charAt(1):n}s=i[u-1]}return void 0===s?"":s}))}}))},function(t,e,n){"use strict";var o=n(12),r=n(119),i=n(74);n(75)("search",1,(function(t,e,n,a){return[function(n){var o=t(this),r=null==n?void 0:n[e];return void 0!==r?r.call(n,o):new RegExp(n)[e](String(o))},function(t){var e=a(n,t,this);if(e.done)return e.value;var s=o(t),l=String(this),c=s.lastIndex;r(c,0)||(s.lastIndex=0);var u=i(s,l);return r(s.lastIndex,c)||(s.lastIndex=c),null===u?-1:u.index}]}))},function(t,e,n){"use strict";var o=n(99),r=n(12),i=n(64),a=n(107),s=n(16),l=n(74),c=n(106),u=n(11),f=Math.min,d=[].push,p="length",h=!u((function(){RegExp(4294967295,"y")}));n(75)("split",2,(function(t,e,n,u){var v;return v="c"=="abbc".split(/(b)*/)[1]||4!="test".split(/(?:)/,-1)[p]||2!="ab".split(/(?:ab)*/)[p]||4!=".".split(/(.?)(.?)/)[p]||".".split(/()()/)[p]>1||"".split(/.?/)[p]?function(t,e){var r=String(this);if(void 0===t&&0===e)return[];if(!o(t))return n.call(r,t,e);for(var i,a,s,l=[],u=(t.ignoreCase?"i":"")+(t.multiline?"m":"")+(t.unicode?"u":"")+(t.sticky?"y":""),f=0,h=void 0===e?4294967295:e>>>0,v=new RegExp(t.source,u+"g");(i=c.call(v,r))&&!((a=v.lastIndex)>f&&(l.push(r.slice(f,i.index)),i[p]>1&&i.index<r[p]&&d.apply(l,i.slice(1)),s=i[0][p],f=a,l[p]>=h));)v.lastIndex===i.index&&v.lastIndex++;return f===r[p]?!s&&v.test("")||l.push(""):l.push(r.slice(f)),l[p]>h?l.slice(0,h):l}:"0".split(void 0,0)[p]?function(t,e){return void 0===t&&0===e?[]:n.call(this,t,e)}:n,[function(n,o){var r=t(this),i=null==n?void 0:n[e];return void 0!==i?i.call(n,r,o):v.call(String(r),n,o)},function(t,e){var o=u(v,t,this,e,v!==n);if(o.done)return o.value;var c=r(t),d=String(this),p=i(c,RegExp),g=c.unicode,y=(c.ignoreCase?"i":"")+(c.multiline?"m":"")+(c.unicode?"u":"")+(h?"y":"g"),b=new p(h?c:"^(?:"+c.source+")",y),m=void 0===e?4294967295:e>>>0;if(0===m)return[];if(0===d.length)return null===l(b,d)?[d]:[];for(var k=0,x=0,w=[];x<d.length;){b.lastIndex=h?x:0;var S,T=l(b,h?d:d.slice(x));if(null===T||(S=f(s(b.lastIndex+(h?0:x)),d.length))===k)x=a(d,x,g);else{if(w.push(d.slice(k,x)),w.length===m)return w;for(var E=1;E<=T.length-1;E++)if(w.push(T[E]),w.length===m)return w;x=k=S}}return w.push(d.slice(k)),w}]}))},function(t,e,n){var o=n(10),r=n(108).set,i=o.MutationObserver||o.WebKitMutationObserver,a=o.process,s=o.Promise,l="process"==n(37)(a);t.exports=function(){var t,e,n,c=function(){var o,r;for(l&&(o=a.domain)&&o.exit();t;){r=t.fn,t=t.next;try{r()}catch(o){throw t?n():e=void 0,o}}e=void 0,o&&o.enter()};if(l)n=function(){a.nextTick(c)};else if(!i||o.navigator&&o.navigator.standalone)if(s&&s.resolve){var u=s.resolve(void 0);n=function(){u.then(c)}}else n=function(){r.call(o,c)};else{var f=!0,d=document.createTextNode("");new i(c).observe(d,{characterData:!0}),n=function(){d.data=f=!f}}return function(o){var r={fn:o,next:void 0};e&&(e.next=r),t||(t=r,n()),e=r}}},function(t,e){t.exports=function(t){try{return{e:!1,v:t()}}catch(t){return{e:!0,v:t}}}},function(t,e,n){"use strict";var o=n(138),r=n(52);t.exports=n(78)("Map",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{get:function(t){var e=o.getEntry(r(this,"Map"),t);return e&&e.v},set:function(t,e){return o.def(r(this,"Map"),0===t?0:t,e)}},o,!0)},function(t,e,n){"use strict";var o=n(138),r=n(52);t.exports=n(78)("Set",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return o.def(r(this,"Set"),t=0===t?0:t,t)}},o)},function(t,e,n){"use strict";var o,r=n(10),i=n(36)(0),a=n(21),s=n(41),l=n(118),c=n(139),u=n(13),f=n(52),d=n(52),p=!r.ActiveXObject&&"ActiveXObject"in r,h=s.getWeak,v=Object.isExtensible,g=c.ufstore,y=function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}},b={get:function(t){if(u(t)){var e=h(t);return!0===e?g(f(this,"WeakMap")).get(t):e?e[this._i]:void 0}},set:function(t,e){return c.def(f(this,"WeakMap"),t,e)}},m=t.exports=n(78)("WeakMap",y,b,c,!0,!0);d&&p&&(l((o=c.getConstructor(y,"WeakMap")).prototype,b),s.NEED=!0,i(["delete","has","get","set"],(function(t){var e=m.prototype,n=e[t];a(e,t,(function(e,r){if(u(e)&&!v(e)){this._f||(this._f=new o);var i=this._f[t](e,r);return"set"==t?this:i}return n.call(this,e,r)}))})))},function(t,e,n){"use strict";var o=n(139),r=n(52);n(78)("WeakSet",(function(t){return function(){return t(this,arguments.length>0?arguments[0]:void 0)}}),{add:function(t){return o.def(r(this,"WeakSet"),t,!0)}},o,!1,!0)},function(t,e,n){"use strict";var o=n(0),r=n(79),i=n(109),a=n(12),s=n(47),l=n(16),c=n(13),u=n(10).ArrayBuffer,f=n(64),d=i.ArrayBuffer,p=i.DataView,h=r.ABV&&u.isView,v=d.prototype.slice,g=r.VIEW;o(o.G+o.W+o.F*(u!==d),{ArrayBuffer:d}),o(o.S+o.F*!r.CONSTR,"ArrayBuffer",{isView:function(t){return h&&h(t)||c(t)&&g in t}}),o(o.P+o.U+o.F*n(11)((function(){return!new d(2).slice(1,void 0).byteLength})),"ArrayBuffer",{slice:function(t,e){if(void 0!==v&&void 0===e)return v.call(a(this),t);for(var n=a(this).byteLength,o=s(t,n),r=s(void 0===e?n:e,n),i=new(f(this,d))(l(r-o)),c=new p(this),u=new p(i),h=0;o<r;)u.setUint8(h++,c.getUint8(o++));return i}}),n(56)("ArrayBuffer")},function(t,e,n){var o=n(0);o(o.G+o.W+o.F*!n(79).ABV,{DataView:n(109).DataView})},function(t,e,n){n(39)("Int8",1,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Uint8",1,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Uint8",1,(function(t){return function(e,n,o){return t(this,e,n,o)}}),!0)},function(t,e,n){n(39)("Int16",2,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Uint16",2,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Int32",4,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Uint32",4,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Float32",4,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){n(39)("Float64",8,(function(t){return function(e,n,o){return t(this,e,n,o)}}))},function(t,e,n){var o=n(0),r=n(32),i=n(12),a=(n(10).Reflect||{}).apply,s=Function.apply;o(o.S+o.F*!n(11)((function(){a((function(){}))})),"Reflect",{apply:function(t,e,n){var o=r(t),l=i(n);return a?a(o,e,l):s.call(o,e,l)}})},function(t,e,n){var o=n(0),r=n(48),i=n(32),a=n(12),s=n(13),l=n(11),c=n(120),u=(n(10).Reflect||{}).construct,f=l((function(){function t(){}return!(u((function(){}),[],t)instanceof t)})),d=!l((function(){u((function(){}))}));o(o.S+o.F*(f||d),"Reflect",{construct:function(t,e){i(t),a(e);var n=arguments.length<3?t:i(arguments[2]);if(d&&!f)return u(t,e,n);if(t==n){switch(e.length){case 0:return new t;case 1:return new t(e[0]);case 2:return new t(e[0],e[1]);case 3:return new t(e[0],e[1],e[2]);case 4:return new t(e[0],e[1],e[2],e[3])}var o=[null];return o.push.apply(o,e),new(c.apply(t,o))}var l=n.prototype,p=r(s(l)?l:Object.prototype),h=Function.apply.call(t,p,e);return s(h)?h:p}})},function(t,e,n){var o=n(19),r=n(0),i=n(12),a=n(40);r(r.S+r.F*n(11)((function(){Reflect.defineProperty(o.f({},1,{value:1}),1,{value:2})})),"Reflect",{defineProperty:function(t,e,n){i(t),e=a(e,!0),i(n);try{return o.f(t,e,n),!0}catch(t){return!1}}})},function(t,e,n){var o=n(0),r=n(34).f,i=n(12);o(o.S,"Reflect",{deleteProperty:function(t,e){var n=r(i(t),e);return!(n&&!n.configurable)&&delete t[e]}})},function(t,e,n){"use strict";var o=n(0),r=n(12),i=function(t){this._t=r(t),this._i=0;var e,n=this._k=[];for(e in t)n.push(e)};n(127)(i,"Object",(function(){var t,e=this._k;do{if(this._i>=e.length)return{value:void 0,done:!0}}while(!((t=e[this._i++])in this._t));return{value:t,done:!1}})),o(o.S,"Reflect",{enumerate:function(t){return new i(t)}})},function(t,e,n){var o=n(34),r=n(50),i=n(26),a=n(0),s=n(13),l=n(12);a(a.S,"Reflect",{get:function t(e,n){var a,c,u=arguments.length<3?e:arguments[2];return l(e)===u?e[n]:(a=o.f(e,n))?i(a,"value")?a.value:void 0!==a.get?a.get.call(u):void 0:s(c=r(e))?t(c,n,u):void 0}})},function(t,e,n){var o=n(34),r=n(0),i=n(12);r(r.S,"Reflect",{getOwnPropertyDescriptor:function(t,e){return o.f(i(t),e)}})},function(t,e,n){var o=n(0),r=n(50),i=n(12);o(o.S,"Reflect",{getPrototypeOf:function(t){return r(i(t))}})},function(t,e,n){var o=n(0);o(o.S,"Reflect",{has:function(t,e){return e in t}})},function(t,e,n){var o=n(0),r=n(12),i=Object.isExtensible;o(o.S,"Reflect",{isExtensible:function(t){return r(t),!i||i(t)}})},function(t,e,n){var o=n(0);o(o.S,"Reflect",{ownKeys:n(141)})},function(t,e,n){var o=n(0),r=n(12),i=Object.preventExtensions;o(o.S,"Reflect",{preventExtensions:function(t){r(t);try{return i&&i(t),!0}catch(t){return!1}}})},function(t,e,n){var o=n(19),r=n(34),i=n(50),a=n(26),s=n(0),l=n(43),c=n(12),u=n(13);s(s.S,"Reflect",{set:function t(e,n,s){var f,d,p=arguments.length<4?e:arguments[3],h=r.f(c(e),n);if(!h){if(u(d=i(e)))return t(d,n,s,p);h=l(0)}if(a(h,"value")){if(!1===h.writable||!u(p))return!1;if(f=r.f(p,n)){if(f.get||f.set||!1===f.writable)return!1;f.value=s,o.f(p,n,f)}else o.f(p,n,l(0,s));return!0}return void 0!==h.set&&(h.set.call(p,s),!0)}})},function(t,e,n){var o=n(0),r=n(90);r&&o(o.S,"Reflect",{setPrototypeOf:function(t,e){r.check(t,e);try{return r.set(t,e),!0}catch(t){return!1}}})},function(t,e,n){n(333),t.exports=n(17).Array.includes},function(t,e,n){"use strict";var o=n(0),r=n(69)(!0);o(o.P,"Array",{includes:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0)}}),n(51)("includes")},function(t,e,n){n(335),t.exports=n(17).Array.flatMap},function(t,e,n){"use strict";var o=n(0),r=n(336),i=n(20),a=n(16),s=n(32),l=n(129);o(o.P,"Array",{flatMap:function(t){var e,n,o=i(this);return s(t),e=a(o.length),n=l(o,0),r(n,o,o,e,0,1,t,arguments[1]),n}}),n(51)("flatMap")},function(t,e,n){"use strict";var o=n(71),r=n(13),i=n(16),a=n(31),s=n(14)("isConcatSpreadable");t.exports=function t(e,n,l,c,u,f,d,p){for(var h,v,g=u,y=0,b=!!d&&a(d,p,3);y<c;){if(y in l){if(h=b?b(l[y],y,n):l[y],v=!1,r(h)&&(v=void 0!==(v=h[s])?!!v:o(h)),v&&f>0)g=t(e,n,h,i(h.length),g,f-1)-1;else{if(g>=9007199254740991)throw TypeError();e[g]=h}g++}y++}return g}},function(t,e,n){n(338),t.exports=n(17).String.padStart},function(t,e,n){"use strict";var o=n(0),r=n(142),i=n(77),a=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(i);o(o.P+o.F*a,"String",{padStart:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0,!0)}})},function(t,e,n){n(340),t.exports=n(17).String.padEnd},function(t,e,n){"use strict";var o=n(0),r=n(142),i=n(77),a=/Version\/10\.\d+(\.\d+)?( Mobile\/\w+)? Safari\//.test(i);o(o.P+o.F*a,"String",{padEnd:function(t){return r(this,t,arguments.length>1?arguments[1]:void 0,!1)}})},function(t,e,n){n(342),t.exports=n(17).String.trimLeft},function(t,e,n){"use strict";n(54)("trimLeft",(function(t){return function(){return t(this,1)}}),"trimStart")},function(t,e,n){n(344),t.exports=n(17).String.trimRight},function(t,e,n){"use strict";n(54)("trimRight",(function(t){return function(){return t(this,2)}}),"trimEnd")},function(t,e,n){n(346),t.exports=n(86).f("asyncIterator")},function(t,e,n){n(114)("asyncIterator")},function(t,e,n){n(348),t.exports=n(17).Object.getOwnPropertyDescriptors},function(t,e,n){var o=n(0),r=n(141),i=n(28),a=n(34),s=n(102);o(o.S,"Object",{getOwnPropertyDescriptors:function(t){for(var e,n,o=i(t),l=a.f,c=r(o),u={},f=0;c.length>f;)void 0!==(n=l(o,e=c[f++]))&&s(u,e,n);return u}})},function(t,e,n){n(350),t.exports=n(17).Object.values},function(t,e,n){var o=n(0),r=n(143)(!1);o(o.S,"Object",{values:function(t){return r(t)}})},function(t,e,n){n(352),t.exports=n(17).Object.entries},function(t,e,n){var o=n(0),r=n(143)(!0);o(o.S,"Object",{entries:function(t){return r(t)}})},function(t,e,n){"use strict";n(135),n(354),t.exports=n(17).Promise.finally},function(t,e,n){"use strict";var o=n(0),r=n(17),i=n(10),a=n(64),s=n(137);o(o.P+o.R,"Promise",{finally:function(t){var e=a(this,r.Promise||i.Promise),n="function"==typeof t;return this.then(n?function(n){return s(e,t()).then((function(){return n}))}:t,n?function(n){return s(e,t()).then((function(){throw n}))}:t)}})},function(t,e,n){n(356),n(357),n(358),t.exports=n(17)},function(t,e,n){var o=n(10),r=n(0),i=n(77),a=[].slice,s=/MSIE .\./.test(i),l=function(t){return function(e,n){var o=arguments.length>2,r=!!o&&a.call(arguments,2);return t(o?function(){("function"==typeof e?e:Function(e)).apply(this,r)}:e,n)}};r(r.G+r.B+r.F*s,{setTimeout:l(o.setTimeout),setInterval:l(o.setInterval)})},function(t,e,n){var o=n(0),r=n(108);o(o.G+o.B,{setImmediate:r.set,clearImmediate:r.clear})},function(t,e,n){for(var o=n(105),r=n(46),i=n(21),a=n(10),s=n(27),l=n(55),c=n(14),u=c("iterator"),f=c("toStringTag"),d=l.Array,p={CSSRuleList:!0,CSSStyleDeclaration:!1,CSSValueList:!1,ClientRectList:!1,DOMRectList:!1,DOMStringList:!1,DOMTokenList:!0,DataTransferItemList:!1,FileList:!1,HTMLAllCollection:!1,HTMLCollection:!1,HTMLFormElement:!1,HTMLSelectElement:!1,MediaList:!0,MimeTypeArray:!1,NamedNodeMap:!1,NodeList:!0,PaintRequestList:!1,Plugin:!1,PluginArray:!1,SVGLengthList:!1,SVGNumberList:!1,SVGPathSegList:!1,SVGPointList:!1,SVGStringList:!1,SVGTransformList:!1,SourceBufferList:!1,StyleSheetList:!0,TextTrackCueList:!1,TextTrackList:!1,TouchList:!1},h=r(p),v=0;v<h.length;v++){var g,y=h[v],b=p[y],m=a[y],k=m&&m.prototype;if(k&&(k[u]||s(k,u,d),k[f]||s(k,f,y),l[y]=d,b))for(g in o)k[g]||i(k,g,o[g],!0)}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(30),n(2),n(3),n(363),n(365),n(366),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u){"use strict";var f=n(8),d=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=d(r),i=d(i),a=d(a),c=d(c),u=f(u);var p=function(){function t(e){var n=this;(0,i.default)(this,t);var o=function(){};u.isObject(e)&&u.isFunction(e.onReady)&&(o=e.onReady);var r=new c.default(e);this.isReady=r.isReady.then((function(){n.exportAPI(r),o()}))}return(0,a.default)(t,[{key:"exportAPI",value:function(t){var e=this;["configuration"].forEach((function(n){e[n]=t[n]})),this.destroy=function(){for(var n in Object.values(t.moduleInstances).forEach((function(t){u.isFunction(t.destroy)&&t.destroy(),t.listeners.removeAll()})),t=null,e)Object.prototype.hasOwnProperty.call(e,n)&&delete e[n];Object.setPrototypeOf(e,null)},Object.setPrototypeOf(this,t.moduleInstances.API.methods),delete this.exportAPI,Object.entries({blocks:{clear:"clear",render:"render"},caret:{focus:"focus"},events:{on:"on",off:"off",emit:"emit"},saver:{save:"save"}}).forEach((function(n){var o=(0,r.default)(n,2),i=o[0],a=o[1];Object.entries(a).forEach((function(n){var o=(0,r.default)(n,2),a=o[0],s=o[1];e[s]=t.moduleInstances.API.methods[i][a]}))}))}}],[{key:"version",get:function(){return"2.22.2"}}]),t}();o.default=p,p.displayName="EditorJS",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e){t.exports=function(t){if(Array.isArray(t))return t}},function(t,e){t.exports=function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],o=!0,r=!1,i=void 0;try{for(var a,s=t[Symbol.iterator]();!(o=(a=s.next()).done)&&(n.push(a.value),!e||n.length!==e);o=!0);}catch(t){r=!0,i=t}finally{try{o||null==s.return||s.return()}finally{if(r)throw i}}return n}}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e,n){(e=t.exports=function(...t){return r(...t)}).__esModule=!0;const o=n(364),r=o.default;Object.assign(e,o)},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){},e.revert=function(){}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[],void 0===(i="function"==typeof(o=function(){"use strict";Element.prototype.matches||(Element.prototype.matches=Element.prototype.matchesSelector||Element.prototype.mozMatchesSelector||Element.prototype.msMatchesSelector||Element.prototype.oMatchesSelector||Element.prototype.webkitMatchesSelector||function(t){for(var e=(this.document||this.ownerDocument).querySelectorAll(t),n=e.length;--n>=0&&e.item(n)!==this;);return n>-1}),Element.prototype.closest||(Element.prototype.closest=function(t){var e=this;if(!document.documentElement.contains(e))return null;do{if(e.matches(t))return e;e=e.parentElement||e.parentNode}while(null!==e);return null}),Element.prototype.prepend||(Element.prototype.prepend=function(t){var e=document.createDocumentFragment();Array.isArray(t)||(t=[t]),t.forEach((function(t){var n=t instanceof Node;e.appendChild(n?t:document.createTextNode(t))})),this.insertBefore(e,this.firstChild)})})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(23),n(24),n(2),n(3),n(15),n(7),n(59),n(148),n(151)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d){"use strict";var p=n(8),h=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=h(r),i=h(i),a=h(a),s=h(s),l=h(l),c=p(c),u=h(u),d=h(d);var v=n(374),g=[];v.keys().forEach((function(t){t.match(/^\.\/[^_][\w/]*\.([tj])s$/)&&g.push(v(t))}));var y=function(){function t(e){var n,o,s=this;(0,a.default)(this,t),this.moduleInstances={},this.eventsDispatcher=new d.default,this.isReady=new Promise((function(t,e){n=t,o=e})),Promise.resolve().then((0,i.default)(r.default.mark((function t(){return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return s.configuration=e,t.next=3,s.validate();case 3:return t.next=5,s.init();case 5:return t.next=7,s.start();case 7:c.logLabeled("I'm ready! (ﾉ◕ヮ◕)ﾉ*:･ﾟ✧","log","","color: #E24A75"),setTimeout((0,i.default)(r.default.mark((function t(){var e,o,i;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,s.render();case 2:s.configuration.autofocus&&(e=s.moduleInstances,o=e.BlockManager,(i=e.Caret).setToBlock(o.blocks[0],i.positions.START),o.highlightCurrentNode()),s.moduleInstances.UI.removeLoader(),n();case 5:case"end":return t.stop()}}),t)}))),500);case 9:case"end":return t.stop()}}),t)})))).catch((function(t){c.log("Editor.js is not ready because of ".concat(t),"error"),o(t)}))}var e,n;return(0,s.default)(t,[{key:"validate",value:(n=(0,i.default)(r.default.mark((function t(){var e,n,o;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:if(e=this.config,n=e.holderId,o=e.holder,!n||!o){t.next=3;break}throw Error("«holderId» and «holder» param can't assign at the same time.");case 3:if(!c.isString(o)||l.default.get(o)){t.next=5;break}throw Error("element with ID «".concat(o,"» is missing. Pass correct holder's ID."));case 5:if(!o||!c.isObject(o)||l.default.isElement(o)){t.next=7;break}throw Error("«holder» value must be an Element node");case 7:case"end":return t.stop()}}),t,this)}))),function(){return n.apply(this,arguments)})},{key:"init",value:function(){this.constructModules(),this.configureModules()}},{key:"start",value:(e=(0,i.default)(r.default.mark((function t(){var e,n=this;return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return e=["Tools","UI","BlockManager","Paste","BlockSelection","RectangleSelection","CrossBlockSelection","ReadOnly"],t.next=3,e.reduce((function(t,e){return t.then((0,i.default)(r.default.mark((function t(){return r.default.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.prev=0,t.next=3,n.moduleInstances[e].prepare();case 3:t.next=10;break;case 5:if(t.prev=5,t.t0=t.catch(0),!(t.t0 instanceof f.CriticalError)){t.next=9;break}throw new Error(t.t0.message);case 9:c.log("Module ".concat(e," was skipped because of %o"),"warn",t.t0);case 10:case"end":return t.stop()}}),t,null,[[0,5]])}))))}),Promise.resolve());case 3:case"end":return t.stop()}}),t)}))),function(){return e.apply(this,arguments)})},{key:"render",value:function(){return this.moduleInstances.Renderer.render(this.config.data.blocks)}},{key:"constructModules",value:function(){var t=this;g.forEach((function(e){var n=c.isFunction(e)?e:e.default;try{t.moduleInstances[n.displayName]=new n({config:t.configuration,eventsDispatcher:t.eventsDispatcher})}catch(t){c.log("Module ".concat(n.displayName," skipped because"),"warn",t)}}))}},{key:"configureModules",value:function(){for(var t in this.moduleInstances)Object.prototype.hasOwnProperty.call(this.moduleInstances,t)&&(this.moduleInstances[t].state=this.getModulesDiff(t))}},{key:"getModulesDiff",value:function(t){var e={};for(var n in this.moduleInstances)n!==t&&(e[n]=this.moduleInstances[n]);return e}},{key:"configuration",set:function(t){var e,n;c.isObject(t)?this.config=Object.assign({},t):this.config={holder:t},c.deprecationAssert(!!this.config.holderId,"config.holderId","config.holder"),this.config.holderId&&!this.config.holder&&(this.config.holder=this.config.holderId,this.config.holderId=null),null==this.config.holder&&(this.config.holder="editorjs"),this.config.logLevel||(this.config.logLevel=c.LogLevels.VERBOSE),c.setLogLevel(this.config.logLevel),c.deprecationAssert(Boolean(this.config.initialBlock),"config.initialBlock","config.defaultBlock"),this.config.defaultBlock=this.config.defaultBlock||this.config.initialBlock||"paragraph",this.config.minHeight=void 0!==this.config.minHeight?this.config.minHeight:300;var o={type:this.config.defaultBlock,data:{}};this.config.placeholder=this.config.placeholder||!1,this.config.sanitizer=this.config.sanitizer||{p:!0,b:!0,a:!0},this.config.hideToolbar=!!this.config.hideToolbar&&this.config.hideToolbar,this.config.tools=this.config.tools||{},this.config.i18n=this.config.i18n||{},this.config.data=this.config.data||{blocks:[]},this.config.onReady=this.config.onReady||function(){},this.config.onChange=this.config.onChange||function(){},this.config.inlineToolbar=void 0===this.config.inlineToolbar||this.config.inlineToolbar,!c.isEmpty(this.config.data)&&this.config.data.blocks&&0!==this.config.data.blocks.length||(this.config.data={blocks:[o]}),this.config.readOnly=this.config.readOnly||!1,(null===(e=this.config.i18n)||void 0===e?void 0:e.messages)&&u.default.setDictionary(this.config.i18n.messages),this.config.i18n.direction=(null===(n=this.config.i18n)||void 0===n?void 0:n.direction)||"ltr"},get:function(){return this.config}}]),t}();o.default=y,y.displayName="Core",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(146);t.exports=function(t){if(Array.isArray(t))return o(t)}},function(t,e){t.exports=function(t){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t))return Array.from(t)}},function(t,e){t.exports=function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}},function(t,e){t.exports=function(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}},function(t,e){t.exports=function(t){return-1!==Function.toString.call(t).indexOf("[native code]")}},function(t,e,n){var o=n(110),r=n(373);function i(e,n,a){return r()?t.exports=i=Reflect.construct:t.exports=i=function(t,e,n){var r=[null];r.push.apply(r,e);var i=new(Function.bind.apply(t,r));return n&&o(i,n.prototype),i},i.apply(null,arguments)}t.exports=i},function(t,e){t.exports=function(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}},function(t,e,n){var o={"./api":81,"./api/":81,"./api/blocks":152,"./api/blocks.ts":152,"./api/caret":153,"./api/caret.ts":153,"./api/events":154,"./api/events.ts":154,"./api/i18n":155,"./api/i18n.ts":155,"./api/index":81,"./api/index.ts":81,"./api/inlineToolbar":156,"./api/inlineToolbar.ts":156,"./api/listeners":157,"./api/listeners.ts":157,"./api/notifier":158,"./api/notifier.ts":158,"./api/readonly":159,"./api/readonly.ts":159,"./api/sanitizer":160,"./api/sanitizer.ts":160,"./api/saver":161,"./api/saver.ts":161,"./api/selection":162,"./api/selection.ts":162,"./api/styles":163,"./api/styles.ts":163,"./api/toolbar":164,"./api/toolbar.ts":164,"./api/tooltip":165,"./api/tooltip.ts":165,"./blockEvents":166,"./blockEvents.ts":166,"./blockManager":167,"./blockManager.ts":167,"./blockSelection":169,"./blockSelection.ts":169,"./caret":170,"./caret.ts":170,"./crossBlockSelection":171,"./crossBlockSelection.ts":171,"./dragNDrop":172,"./dragNDrop.ts":172,"./modificationsObserver":173,"./modificationsObserver.ts":173,"./paste":174,"./paste.ts":174,"./readonly":175,"./readonly.ts":175,"./rectangleSelection":176,"./rectangleSelection.ts":176,"./renderer":177,"./renderer.ts":177,"./saver":178,"./saver.ts":178,"./toolbar":83,"./toolbar/":83,"./toolbar/blockSettings":179,"./toolbar/blockSettings.ts":179,"./toolbar/conversion":180,"./toolbar/conversion.ts":180,"./toolbar/index":83,"./toolbar/index.ts":83,"./toolbar/inline":181,"./toolbar/inline.ts":181,"./toolbar/toolbox":182,"./toolbar/toolbox.ts":182,"./tools":183,"./tools.ts":183,"./ui":185,"./ui.ts":185};function r(t){var e=i(t);return n(e)}function i(t){if(!n.o(o,t)){var e=new Error("Cannot find module '"+t+"'");throw e.code="MODULE_NOT_FOUND",e}return o[t]}r.keys=function(){return Object.keys(o)},r.resolve=i,t.exports=r,r.id=374},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(8),l=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=l(r),i=l(i),a=s(a);var c=function(){function t(){(0,r.default)(this,t),this.allListeners=[]}return(0,i.default)(t,[{key:"on",value:function(t,e,n){var o=arguments.length>3&&void 0!==arguments[3]&&arguments[3],r=a.generateId("l"),i={id:r,element:t,eventType:e,handler:n,options:o},s=this.findOne(t,e,n);if(!s)return this.allListeners.push(i),t.addEventListener(e,n,o),r}},{key:"off",value:function(t,e,n,o){var r=this,i=this.findAll(t,e,n);i.forEach((function(t,e){var n=r.allListeners.indexOf(i[e]);n>-1&&(r.allListeners.splice(n,1),t.element.removeEventListener(t.eventType,t.handler,t.options))}))}},{key:"offById",value:function(t){var e=this.findById(t);e&&e.element.removeEventListener(e.eventType,e.handler,e.options)}},{key:"findOne",value:function(t,e,n){var o=this.findAll(t,e,n);return o.length>0?o[0]:null}},{key:"findAll",value:function(t,e,n){var o=t?this.findByEventTarget(t):[];return t&&e&&n?o.filter((function(t){return t.eventType===e&&t.handler===n})):t&&e?o.filter((function(t){return t.eventType===e})):o}},{key:"removeAll",value:function(){this.allListeners.map((function(t){t.element.removeEventListener(t.eventType,t.handler,t.options)})),this.allListeners=[]}},{key:"destroy",value:function(){this.removeAll()}},{key:"findByEventTarget",value:function(t){return this.allListeners.filter((function(e){if(e.element===t)return e}))}},{key:"findByType",value:function(t){return this.allListeners.filter((function(e){if(e.eventType===t)return e}))}},{key:"findByHandler",value:function(t){return this.allListeners.filter((function(e){if(e.handler===t)return e}))}},{key:"findById",value:function(t){return this.allListeners.find((function(e){return e.id===t}))}}]),t}();o.default=c,c.displayName="Listeners",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(377)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(){(0,r.default)(this,t)}return(0,i.default)(t,[{key:"show",value:function(t){a.default.show(t)}}]),t}();o.default=l,l.displayName="Notifier",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){window,t.exports=function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=0)}([function(t,e,n){"use strict";n(1),t.exports=function(){var t=n(6),e=null;return{show:function(n){if(n.message){!function(){if(e)return!0;e=t.getWrapper(),document.body.appendChild(e)}();var o=null,r=n.time||8e3;switch(n.type){case"confirm":o=t.confirm(n);break;case"prompt":o=t.prompt(n);break;default:o=t.alert(n),window.setTimeout((function(){o.remove()}),r)}e.appendChild(o),o.classList.add("cdx-notify--bounce-in")}}}}()},function(t,e,n){var o=n(2);"string"==typeof o&&(o=[[t.i,o,""]]),n(4)(o,{hmr:!0,transform:void 0,insertInto:void 0}),o.locals&&(t.exports=o.locals)},function(t,e,n){(t.exports=n(3)(!1)).push([t.i,'.cdx-notify--error{background:#fffbfb!important}.cdx-notify--error::before{background:#fb5d5d!important}.cdx-notify__input{max-width:130px;padding:5px 10px;background:#f7f7f7;border:0;border-radius:3px;font-size:13px;color:#656b7c;outline:0}.cdx-notify__input:-ms-input-placeholder{color:#656b7c}.cdx-notify__input::placeholder{color:#656b7c}.cdx-notify__input:focus:-ms-input-placeholder{color:rgba(101,107,124,.3)}.cdx-notify__input:focus::placeholder{color:rgba(101,107,124,.3)}.cdx-notify__button{border:none;border-radius:3px;font-size:13px;padding:5px 10px;cursor:pointer}.cdx-notify__button:last-child{margin-left:10px}.cdx-notify__button--cancel{background:#f2f5f7;box-shadow:0 2px 1px 0 rgba(16,19,29,0);color:#656b7c}.cdx-notify__button--cancel:hover{background:#eee}.cdx-notify__button--confirm{background:#34c992;box-shadow:0 1px 1px 0 rgba(18,49,35,.05);color:#fff}.cdx-notify__button--confirm:hover{background:#33b082}.cdx-notify__btns-wrapper{display:-ms-flexbox;display:flex;-ms-flex-flow:row nowrap;flex-flow:row nowrap;margin-top:5px}.cdx-notify__cross{position:absolute;top:5px;right:5px;width:10px;height:10px;padding:5px;opacity:.54;cursor:pointer}.cdx-notify__cross::after,.cdx-notify__cross::before{content:\'\';position:absolute;left:9px;top:5px;height:12px;width:2px;background:#575d67}.cdx-notify__cross::before{transform:rotate(-45deg)}.cdx-notify__cross::after{transform:rotate(45deg)}.cdx-notify__cross:hover{opacity:1}.cdx-notifies{position:fixed;z-index:2;bottom:20px;left:20px;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif}.cdx-notify{position:relative;width:220px;margin-top:15px;padding:13px 16px;background:#fff;box-shadow:0 11px 17px 0 rgba(23,32,61,.13);border-radius:5px;font-size:14px;line-height:1.4em;word-wrap:break-word}.cdx-notify::before{content:\'\';position:absolute;display:block;top:0;left:0;width:3px;height:calc(100% - 6px);margin:3px;border-radius:5px;background:0 0}@keyframes bounceIn{0%{opacity:0;transform:scale(.3)}50%{opacity:1;transform:scale(1.05)}70%{transform:scale(.9)}100%{transform:scale(1)}}.cdx-notify--bounce-in{animation-name:bounceIn;animation-duration:.6s;animation-iteration-count:1}.cdx-notify--success{background:#fafffe!important}.cdx-notify--success::before{background:#41ffb1!important}',""])},function(t,e){t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n,o=t[1]||"",r=t[3];if(!r)return o;if(e&&"function"==typeof btoa){var i=(n=r,"/*# sourceMappingURL=data:application/json;charset=utf-8;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */"),a=r.sources.map((function(t){return"/*# sourceURL="+r.sourceRoot+t+" */"}));return[o].concat(a).concat([i]).join("\n")}return[o].join("\n")}(e,t);return e[2]?"@media "+e[2]+"{"+n+"}":n})).join("")},e.i=function(t,n){"string"==typeof t&&(t=[[null,t,""]]);for(var o={},r=0;r<this.length;r++){var i=this[r][0];"number"==typeof i&&(o[i]=!0)}for(r=0;r<t.length;r++){var a=t[r];"number"==typeof a[0]&&o[a[0]]||(n&&!a[2]?a[2]=n:n&&(a[2]="("+a[2]+") and ("+n+")"),e.push(a))}},e}},function(t,e,n){var o,r,i={},a=(o=function(){return window&&document&&document.all&&!window.atob},function(){return void 0===r&&(r=o.apply(this,arguments)),r}),s=function(t){var e={};return function(t){if("function"==typeof t)return t();if(void 0===e[t]){var n=function(t){return document.querySelector(t)}.call(this,t);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}e[t]=n}return e[t]}}(),l=null,c=0,u=[],f=n(5);function d(t,e){for(var n=0;n<t.length;n++){var o=t[n],r=i[o.id];if(r){r.refs++;for(var a=0;a<r.parts.length;a++)r.parts[a](o.parts[a]);for(;a<o.parts.length;a++)r.parts.push(b(o.parts[a],e))}else{var s=[];for(a=0;a<o.parts.length;a++)s.push(b(o.parts[a],e));i[o.id]={id:o.id,refs:1,parts:s}}}}function p(t,e){for(var n=[],o={},r=0;r<t.length;r++){var i=t[r],a=e.base?i[0]+e.base:i[0],s={css:i[1],media:i[2],sourceMap:i[3]};o[a]?o[a].parts.push(s):n.push(o[a]={id:a,parts:[s]})}return n}function h(t,e){var n=s(t.insertInto);if(!n)throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");var o=u[u.length-1];if("top"===t.insertAt)o?o.nextSibling?n.insertBefore(e,o.nextSibling):n.appendChild(e):n.insertBefore(e,n.firstChild),u.push(e);else if("bottom"===t.insertAt)n.appendChild(e);else{if("object"!=typeof t.insertAt||!t.insertAt.before)throw new Error("[Style Loader]\n\n Invalid value for parameter 'insertAt' ('options.insertAt') found.\n Must be 'top', 'bottom', or Object.\n (https://github.com/webpack-contrib/style-loader#insertat)\n");var r=s(t.insertInto+" "+t.insertAt.before);n.insertBefore(e,r)}}function v(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t);var e=u.indexOf(t);e>=0&&u.splice(e,1)}function g(t){var e=document.createElement("style");return void 0===t.attrs.type&&(t.attrs.type="text/css"),y(e,t.attrs),h(t,e),e}function y(t,e){Object.keys(e).forEach((function(n){t.setAttribute(n,e[n])}))}function b(t,e){var n,o,r,i;if(e.transform&&t.css){if(!(i=e.transform(t.css)))return function(){};t.css=i}if(e.singleton){var a=c++;n=l||(l=g(e)),o=x.bind(null,n,a,!1),r=x.bind(null,n,a,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(n=function(t){var e=document.createElement("link");return void 0===t.attrs.type&&(t.attrs.type="text/css"),t.attrs.rel="stylesheet",y(e,t.attrs),h(t,e),e}(e),o=function(t,e,n){var o=n.css,r=n.sourceMap,i=void 0===e.convertToAbsoluteUrls&&r;(e.convertToAbsoluteUrls||i)&&(o=f(o)),r&&(o+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */");var a=new Blob([o],{type:"text/css"}),s=t.href;t.href=URL.createObjectURL(a),s&&URL.revokeObjectURL(s)}.bind(null,n,e),r=function(){v(n),n.href&&URL.revokeObjectURL(n.href)}):(n=g(e),o=function(t,e){var n=e.css,o=e.media;if(o&&t.setAttribute("media",o),t.styleSheet)t.styleSheet.cssText=n;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(n))}}.bind(null,n),r=function(){v(n)});return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else r()}}t.exports=function(t,e){if("undefined"!=typeof DEBUG&&DEBUG&&"object"!=typeof document)throw new Error("The style-loader cannot be used in a non-browser environment");(e=e||{}).attrs="object"==typeof e.attrs?e.attrs:{},e.singleton||"boolean"==typeof e.singleton||(e.singleton=a()),e.insertInto||(e.insertInto="head"),e.insertAt||(e.insertAt="bottom");var n=p(t,e);return d(n,e),function(t){for(var o=[],r=0;r<n.length;r++){var a=n[r];(s=i[a.id]).refs--,o.push(s)}for(t&&d(p(t,e),e),r=0;r<o.length;r++){var s;if(0===(s=o[r]).refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete i[s.id]}}}};var m,k=(m=[],function(t,e){return m[t]=e,m.filter(Boolean).join("\n")});function x(t,e,n,o){var r=n?"":o.css;if(t.styleSheet)t.styleSheet.cssText=k(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}},function(t,e){t.exports=function(t){var e="undefined"!=typeof window&&window.location;if(!e)throw new Error("fixUrls requires window.location");if(!t||"string"!=typeof t)return t;var n=e.protocol+"//"+e.host,o=n+e.pathname.replace(/\/[^\/]*$/,"/");return t.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi,(function(t,e){var r,i=e.trim().replace(/^"(.*)"$/,(function(t,e){return e})).replace(/^'(.*)'$/,(function(t,e){return e}));return/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/|\s*$)/i.test(i)?t:(r=0===i.indexOf("//")?i:0===i.indexOf("/")?n+i:o+i.replace(/^\.\//,""),"url("+JSON.stringify(r)+")")}))}},function(t,e,n){"use strict";var o,r,i,a,s,l;t.exports=(o="cdx-notify",r="cdx-notify__cross",i="cdx-notify__button--confirm",a="cdx-notify__button",s="cdx-notify__btns-wrapper",{alert:l=function(t){var e=document.createElement("DIV"),n=document.createElement("DIV"),i=t.message,a=t.style;return e.classList.add(o),a&&e.classList.add(o+"--"+a),e.innerHTML=i,n.classList.add(r),n.addEventListener("click",e.remove.bind(e)),e.appendChild(n),e},confirm:function(t){var e=l(t),n=document.createElement("div"),o=document.createElement("button"),c=document.createElement("button"),u=e.querySelector("."+r),f=t.cancelHandler,d=t.okHandler;return n.classList.add(s),o.innerHTML=t.okText||"Confirm",c.innerHTML=t.cancelText||"Cancel",o.classList.add(a),c.classList.add(a),o.classList.add(i),c.classList.add("cdx-notify__button--cancel"),f&&"function"==typeof f&&(c.addEventListener("click",f),u.addEventListener("click",f)),d&&"function"==typeof d&&o.addEventListener("click",d),o.addEventListener("click",e.remove.bind(e)),c.addEventListener("click",e.remove.bind(e)),n.appendChild(o),n.appendChild(c),e.appendChild(n),e},prompt:function(t){var e=l(t),n=document.createElement("div"),o=document.createElement("button"),c=document.createElement("input"),u=e.querySelector("."+r),f=t.cancelHandler,d=t.okHandler;return n.classList.add(s),o.innerHTML=t.okText||"Ok",o.classList.add(a),o.classList.add(i),c.classList.add("cdx-notify__input"),t.placeholder&&c.setAttribute("placeholder",t.placeholder),t.default&&(c.value=t.default),t.inputType&&(c.type=t.inputType),f&&"function"==typeof f&&u.addEventListener("click",f),d&&"function"==typeof d&&o.addEventListener("click",(function(){d(c.value)})),o.addEventListener("click",e.remove.bind(e)),n.appendChild(c),n.appendChild(o),e.appendChild(n),e},getWrapper:function(){var t=document.createElement("DIV");return t.classList.add("cdx-notifies"),t}})}])},function(t,e,n){var o,r;void 0===(r="function"==typeof(o=function(){function t(t){var e=t.tags;if(!Object.keys(e).map((function(t){return typeof e[t]})).every((function(t){return"object"===t||"boolean"===t||"function"===t})))throw new Error("The configuration was invalid");this.config=t}var e=["P","LI","TD","TH","DIV","H1","H2","H3","H4","H5","H6","PRE"];function n(t){return-1!==e.indexOf(t.nodeName)}var o=["A","B","STRONG","I","EM","SUB","SUP","U","STRIKE"];function r(t){return-1!==o.indexOf(t.nodeName)}function i(t,e,n){return"function"==typeof t.tags[e]?t.tags[e](n):t.tags[e]}function a(t,e){return void 0===e||"boolean"==typeof e&&!e}function s(t,e,n){var o=t.name.toLowerCase();return!0!==e&&("function"==typeof e[o]?!e[o](t.value,n):void 0===e[o]||!1===e[o]||"string"==typeof e[o]&&e[o]!==t.value)}return t.prototype.clean=function(t){const e=document.implementation.createHTMLDocument(),n=e.createElement("div");return n.innerHTML=t,this._sanitize(e,n),n.innerHTML},t.prototype._sanitize=function(t,e){var o=function(t,e){return t.createTreeWalker(e,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_COMMENT,null,!1)}(t,e),l=o.firstChild();if(l)do{if(l.nodeType!==Node.TEXT_NODE){if(l.nodeType===Node.COMMENT_NODE){e.removeChild(l),this._sanitize(t,e);break}var c,u=r(l);u&&(c=Array.prototype.some.call(l.childNodes,n));var f=!!e.parentNode,d=n(e)&&n(l)&&f,p=l.nodeName.toLowerCase(),h=i(this.config,p,l);if(u&&c||a(0,h)||!this.config.keepNestedBlockElements&&d){if("SCRIPT"!==l.nodeName&&"STYLE"!==l.nodeName)for(;l.childNodes.length>0;)e.insertBefore(l.childNodes[0],l);e.removeChild(l),this._sanitize(t,e);break}for(var v=0;v<l.attributes.length;v+=1){var g=l.attributes[v];s(g,h,l)&&(l.removeAttribute(g.name),v-=1)}this._sanitize(t,l)}else if(""===l.data.trim()&&(l.previousElementSibling&&n(l.previousElementSibling)||l.nextElementSibling&&n(l.nextElementSibling))){e.removeChild(l),this._sanitize(t,e);break}}while(l=o.nextSibling())},t})?o.call(e,n,e,t):o)||(t.exports=r)},function(t,e,n){window,t.exports=function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){t.exports=n(1)},function(t,e,n){"use strict";n.r(e),n.d(e,"default",(function(){return o}));class o{constructor(){this.nodes={wrapper:null,content:null},this.showed=!1,this.offsetTop=10,this.offsetLeft=10,this.offsetRight=10,this.hidingDelay=0,this.handleWindowScroll=()=>{this.showed&&this.hide(!0)},this.loadStyles(),this.prepare(),window.addEventListener("scroll",this.handleWindowScroll,{passive:!0})}get CSS(){return{tooltip:"ct",tooltipContent:"ct__content",tooltipShown:"ct--shown",placement:{left:"ct--left",bottom:"ct--bottom",right:"ct--right",top:"ct--top"}}}show(t,e,n){this.nodes.wrapper||this.prepare(),this.hidingTimeout&&clearTimeout(this.hidingTimeout);const o=Object.assign({placement:"bottom",marginTop:0,marginLeft:0,marginRight:0,marginBottom:0,delay:70,hidingDelay:0},n);if(o.hidingDelay&&(this.hidingDelay=o.hidingDelay),this.nodes.content.innerHTML="","string"==typeof e)this.nodes.content.appendChild(document.createTextNode(e));else{if(!(e instanceof Node))throw Error("[CodeX Tooltip] Wrong type of «content» passed. It should be an instance of Node or String. But "+typeof e+" given.");this.nodes.content.appendChild(e)}switch(this.nodes.wrapper.classList.remove(...Object.values(this.CSS.placement)),o.placement){case"top":this.placeTop(t,o);break;case"left":this.placeLeft(t,o);break;case"right":this.placeRight(t,o);break;case"bottom":default:this.placeBottom(t,o)}o&&o.delay?this.showingTimeout=setTimeout(()=>{this.nodes.wrapper.classList.add(this.CSS.tooltipShown),this.showed=!0},o.delay):(this.nodes.wrapper.classList.add(this.CSS.tooltipShown),this.showed=!0)}hide(t=!1){if(this.hidingDelay&&!t)return this.hidingTimeout&&clearTimeout(this.hidingTimeout),void(this.hidingTimeout=setTimeout(()=>{this.hide(!0)},this.hidingDelay));this.nodes.wrapper.classList.remove(this.CSS.tooltipShown),this.showed=!1,this.showingTimeout&&clearTimeout(this.showingTimeout)}onHover(t,e,n){t.addEventListener("mouseenter",()=>{this.show(t,e,n)}),t.addEventListener("mouseleave",()=>{this.hide()})}destroy(){this.nodes.wrapper.remove(),window.removeEventListener("scroll",this.handleWindowScroll)}prepare(){this.nodes.wrapper=this.make("div",this.CSS.tooltip),this.nodes.content=this.make("div",this.CSS.tooltipContent),this.append(this.nodes.wrapper,this.nodes.content),this.append(document.body,this.nodes.wrapper)}loadStyles(){const t="codex-tooltips-style";if(document.getElementById(t))return;const e=n(2),o=this.make("style",null,{textContent:e.toString(),id:t});this.prepend(document.head,o)}placeBottom(t,e){const n=t.getBoundingClientRect(),o=n.left+t.clientWidth/2-this.nodes.wrapper.offsetWidth/2,r=n.bottom+window.pageYOffset+this.offsetTop+e.marginTop;this.applyPlacement("bottom",o,r)}placeTop(t,e){const n=t.getBoundingClientRect(),o=n.left+t.clientWidth/2-this.nodes.wrapper.offsetWidth/2,r=n.top+window.pageYOffset-this.nodes.wrapper.clientHeight-this.offsetTop;this.applyPlacement("top",o,r)}placeLeft(t,e){const n=t.getBoundingClientRect(),o=n.left-this.nodes.wrapper.offsetWidth-this.offsetLeft-e.marginLeft,r=n.top+window.pageYOffset+t.clientHeight/2-this.nodes.wrapper.offsetHeight/2;this.applyPlacement("left",o,r)}placeRight(t,e){const n=t.getBoundingClientRect(),o=n.right+this.offsetRight+e.marginRight,r=n.top+window.pageYOffset+t.clientHeight/2-this.nodes.wrapper.offsetHeight/2;this.applyPlacement("right",o,r)}applyPlacement(t,e,n){this.nodes.wrapper.classList.add(this.CSS.placement[t]),this.nodes.wrapper.style.left=e+"px",this.nodes.wrapper.style.top=n+"px"}make(t,e=null,n={}){const o=document.createElement(t);Array.isArray(e)?o.classList.add(...e):e&&o.classList.add(e);for(const t in n)n.hasOwnProperty(t)&&(o[t]=n[t]);return o}append(t,e){Array.isArray(e)?e.forEach(e=>t.appendChild(e)):t.appendChild(e)}prepend(t,e){Array.isArray(e)?(e=e.reverse()).forEach(e=>t.prepend(e)):t.prepend(e)}}},function(t,e){t.exports='.ct{z-index:999;opacity:0;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;pointer-events:none;-webkit-transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1);transition:opacity 50ms ease-in,transform 70ms cubic-bezier(.215,.61,.355,1),-webkit-transform 70ms cubic-bezier(.215,.61,.355,1);will-change:opacity,top,left;-webkit-box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);box-shadow:0 8px 12px 0 rgba(29,32,43,.17),0 4px 5px -3px rgba(5,6,12,.49);border-radius:9px}.ct,.ct:before{position:absolute;top:0;left:0}.ct:before{content:"";bottom:0;right:0;background-color:#1d202b;z-index:-1;border-radius:4px}@supports(-webkit-mask-box-image:url("")){.ct:before{border-radius:0;-webkit-mask-box-image:url(\'data:image/svg+xml;charset=utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"><path d="M10.71 0h2.58c3.02 0 4.64.42 6.1 1.2a8.18 8.18 0 013.4 3.4C23.6 6.07 24 7.7 24 10.71v2.58c0 3.02-.42 4.64-1.2 6.1a8.18 8.18 0 01-3.4 3.4c-1.47.8-3.1 1.21-6.11 1.21H10.7c-3.02 0-4.64-.42-6.1-1.2a8.18 8.18 0 01-3.4-3.4C.4 17.93 0 16.3 0 13.29V10.7c0-3.02.42-4.64 1.2-6.1a8.18 8.18 0 013.4-3.4C6.07.4 7.7 0 10.71 0z"/></svg>\') 48% 41% 37.9% 53.3%}}@media (--mobile){.ct{display:none}}.ct__content{padding:6px 10px;color:#cdd1e0;font-size:12px;text-align:center;letter-spacing:.02em;line-height:1em}.ct:after{content:"";width:8px;height:8px;position:absolute;background-color:#1d202b;z-index:-1}.ct--bottom{-webkit-transform:translateY(5px);transform:translateY(5px)}.ct--bottom:after{top:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--top{-webkit-transform:translateY(-5px);transform:translateY(-5px)}.ct--top:after{top:auto;bottom:-3px;left:50%;-webkit-transform:translateX(-50%) rotate(-45deg);transform:translateX(-50%) rotate(-45deg)}.ct--left{-webkit-transform:translateX(-5px);transform:translateX(-5px)}.ct--left:after{top:50%;left:auto;right:0;-webkit-transform:translate(41.6%,-50%) rotate(-45deg);transform:translate(41.6%,-50%) rotate(-45deg)}.ct--right{-webkit-transform:translateX(5px);transform:translateX(5px)}.ct--right:after{top:50%;left:0;-webkit-transform:translate(-41.6%,-50%) rotate(-45deg);transform:translate(-41.6%,-50%) rotate(-45deg)}.ct--shown{opacity:1;-webkit-transform:none;transform:none}'}]).default},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15),n(7),n(25)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l){"use strict";var c=n(8),u=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=c(s),l=u(l);var f=function(){function t(e,n){(0,r.default)(this,t),this.cursor=-1,this.items=[],this.items=e||[],this.focusedCssClass=n}return(0,i.default)(t,[{key:"setItems",value:function(t){this.items=t}},{key:"next",value:function(){this.cursor=this.leafNodesAndReturnIndex(t.directions.RIGHT)}},{key:"previous",value:function(){this.cursor=this.leafNodesAndReturnIndex(t.directions.LEFT)}},{key:"dropCursor",value:function(){-1!==this.cursor&&(this.items[this.cursor].classList.remove(this.focusedCssClass),this.cursor=-1)}},{key:"leafNodesAndReturnIndex",value:function(e){var n=this;if(0===this.items.length)return this.cursor;var o=this.cursor;return-1===o?o=e===t.directions.RIGHT?-1:0:this.items[o].classList.remove(this.focusedCssClass),o=e===t.directions.RIGHT?(o+1)%this.items.length:(this.items.length+o-1)%this.items.length,a.default.canSetCaret(this.items[o])&&s.delay((function(){return l.default.setCursor(n.items[o])}),50)(),this.items[o].classList.add(this.focusedCssClass),o}},{key:"currentItem",get:function(){return-1===this.cursor?null:this.items[this.cursor]}}]),t}();o.default=f,f.displayName="DomIterator",f.directions={RIGHT:"right",LEFT:"left"},t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o=n(4);t.exports=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=o(t)););return t}},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(7),n(15),n(66)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l){"use strict";var c=n(8),u=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=c(a),s=u(s);var f=function(){function t(e){(0,r.default)(this,t),this.blocks=[],this.workingArea=e}return(0,i.default)(t,[{key:"push",value:function(t){this.blocks.push(t),this.insertToDOM(t)}},{key:"swap",value:function(t,e){var n=this.blocks[e];s.default.swap(this.blocks[t].holder,n.holder),this.blocks[e]=this.blocks[t],this.blocks[t]=n}},{key:"move",value:function(t,e){var n=this.blocks.splice(e,1)[0],o=t-1,r=Math.max(0,o),i=this.blocks[r];t>0?this.insertToDOM(n,"afterend",i):this.insertToDOM(n,"beforebegin",i),this.blocks.splice(t,0,n);var a=this.composeBlockEvent("move",{fromIndex:e,toIndex:t});n.call(l.BlockToolAPI.MOVED,a)}},{key:"insert",value:function(t,e){var n=arguments.length>2&&void 0!==arguments[2]&&arguments[2];if(this.length){t>this.length&&(t=this.length),n&&(this.blocks[t].holder.remove(),this.blocks[t].call(l.BlockToolAPI.REMOVED));var o=n?1:0;if(this.blocks.splice(t,o,e),t>0){var r=this.blocks[t-1];this.insertToDOM(e,"afterend",r)}else{var i=this.blocks[t+1];i?this.insertToDOM(e,"beforebegin",i):this.insertToDOM(e)}}else this.push(e)}},{key:"remove",value:function(t){isNaN(t)&&(t=this.length-1),this.blocks[t].holder.remove(),this.blocks[t].call(l.BlockToolAPI.REMOVED),this.blocks.splice(t,1)}},{key:"removeAll",value:function(){this.workingArea.innerHTML="",this.blocks.forEach((function(t){return t.call(l.BlockToolAPI.REMOVED)})),this.blocks.length=0}},{key:"insertAfter",value:function(t,e){var n=this.blocks.indexOf(t);this.insert(n+1,e)}},{key:"get",value:function(t){return this.blocks[t]}},{key:"indexOf",value:function(t){return this.blocks.indexOf(t)}},{key:"insertToDOM",value:function(t,e,n){e?n.holder.insertAdjacentElement(e,t.holder):this.workingArea.appendChild(t.holder),t.call(l.BlockToolAPI.RENDERED)}},{key:"composeBlockEvent",value:function(t,e){return new CustomEvent(t,{detail:e})}},{key:"length",get:function(){return this.blocks.length}},{key:"array",get:function(){return this.blocks}},{key:"nodes",get:function(){return a.array(this.workingArea.children)}}],[{key:"set",value:function(t,e,n){return isNaN(Number(e))?(Reflect.set(t,e,n),!0):(t.insert(+e,n),!0)}},{key:"get",value:function(t,e){return isNaN(Number(e))?Reflect.get(t,e):t.get(+e)}}]),t}();o.default=f,f.displayName="Blocks",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){window,t.exports=function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="",n(n.s=0)}([function(t,e,n){"use strict";function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function r(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}n.r(e);var i=function(){function t(e){var n=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.commands={},this.keys={},this.name=e.name,this.parseShortcutName(e.name),this.element=e.on,this.callback=e.callback,this.executeShortcut=function(t){n.execute(t)},this.element.addEventListener("keydown",this.executeShortcut,!1)}return r(t,null,[{key:"supportedCommands",get:function(){return{SHIFT:["SHIFT"],CMD:["CMD","CONTROL","COMMAND","WINDOWS","CTRL"],ALT:["ALT","OPTION"]}}},{key:"keyCodes",get:function(){return{0:48,1:49,2:50,3:51,4:52,5:53,6:54,7:55,8:56,9:57,A:65,B:66,C:67,D:68,E:69,F:70,G:71,H:72,I:73,J:74,K:75,L:76,M:77,N:78,O:79,P:80,Q:81,R:82,S:83,T:84,U:85,V:86,W:87,X:88,Y:89,Z:90,BACKSPACE:8,ENTER:13,ESCAPE:27,LEFT:37,UP:38,RIGHT:39,DOWN:40,INSERT:45,DELETE:46}}}]),r(t,[{key:"parseShortcutName",value:function(e){e=e.split("+");for(var n=0;n<e.length;n++){e[n]=e[n].toUpperCase();var o=!1;for(var r in t.supportedCommands)if(t.supportedCommands[r].includes(e[n])){o=this.commands[r]=!0;break}o||(this.keys[e[n]]=!0)}for(var i in t.supportedCommands)this.commands[i]||(this.commands[i]=!1)}},{key:"execute",value:function(e){var n,o={CMD:e.ctrlKey||e.metaKey,SHIFT:e.shiftKey,ALT:e.altKey},r=!0;for(n in this.commands)this.commands[n]!==o[n]&&(r=!1);var i,a=!0;for(i in this.keys)a=a&&e.keyCode===t.keyCodes[i];r&&a&&this.callback(e)}},{key:"remove",value:function(){this.element.removeEventListener("keydown",this.executeShortcut)}}]),t}();e.default=i}]).default},function(t,e,n){window,t.exports=function(t){var e={};function n(o){if(e[o])return e[o].exports;var r=e[o]={i:o,l:!1,exports:{}};return t[o].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=e,n.d=function(t,e,o){n.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:o})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,e){if(1&e&&(t=n(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)n.d(o,r,function(e){return t[e]}.bind(null,r));return o},n.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(e,"a",e),e},n.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},n.p="/",n(n.s=0)}([function(t,e,n){function o(t,e){for(var n=0;n<e.length;n++){var o=e[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(t,o.key,o)}}function r(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}n(1).toString();var i=function(){function t(e){var n=e.data,o=e.config,r=e.api,i=e.readOnly;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),this.api=r,this.readOnly=i,this._CSS={block:this.api.styles.block,wrapper:"ce-paragraph"},this.readOnly||(this.onKeyUp=this.onKeyUp.bind(this)),this._placeholder=o.placeholder?o.placeholder:t.DEFAULT_PLACEHOLDER,this._data={},this._element=this.drawView(),this._preserveBlank=void 0!==o.preserveBlank&&o.preserveBlank,this.data=n}return r(t,null,[{key:"DEFAULT_PLACEHOLDER",get:function(){return""}}]),r(t,[{key:"onKeyUp",value:function(t){"Backspace"!==t.code&&"Delete"!==t.code||""===this._element.textContent&&(this._element.innerHTML="")}},{key:"drawView",value:function(){var t=document.createElement("DIV");return t.classList.add(this._CSS.wrapper,this._CSS.block),t.contentEditable=!1,t.dataset.placeholder=this.api.i18n.t(this._placeholder),this.readOnly||(t.contentEditable=!0,t.addEventListener("keyup",this.onKeyUp)),t}},{key:"render",value:function(){return this._element}},{key:"merge",value:function(t){var e={text:this.data.text+t.text};this.data=e}},{key:"validate",value:function(t){return!(""===t.text.trim()&&!this._preserveBlank)}},{key:"save",value:function(t){return{text:t.innerHTML}}},{key:"onPaste",value:function(t){var e={text:t.detail.data.innerHTML};this.data=e}},{key:"data",get:function(){var t=this._element.innerHTML;return this._data.text=t,this._data},set:function(t){this._data=t||{},this._element.innerHTML=this._data.text||""}}],[{key:"conversionConfig",get:function(){return{export:"text",import:"text"}}},{key:"sanitize",get:function(){return{text:{br:!0}}}},{key:"isReadOnlySupported",get:function(){return!0}},{key:"pasteConfig",get:function(){return{tags:["P"]}}},{key:"toolbox",get:function(){return{icon:n(5).default,title:"Text"}}}]),t}();t.exports=i},function(t,e,n){var o=n(2),r=n(3);"string"==typeof(r=r.__esModule?r.default:r)&&(r=[[t.i,r,""]]),o(r,{insert:"head",singleton:!1}),t.exports=r.locals||{}},function(t,e,n){"use strict";var o,r=function(){var t={};return function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(t){n=null}t[e]=n}return t[e]}}(),i=[];function a(t){for(var e=-1,n=0;n<i.length;n++)if(i[n].identifier===t){e=n;break}return e}function s(t,e){for(var n={},o=[],r=0;r<t.length;r++){var s=t[r],l=e.base?s[0]+e.base:s[0],c=n[l]||0,u="".concat(l," ").concat(c);n[l]=c+1;var f=a(u),d={css:s[1],media:s[2],sourceMap:s[3]};-1!==f?(i[f].references++,i[f].updater(d)):i.push({identifier:u,updater:v(d,e),references:1}),o.push(u)}return o}function l(t){var e=document.createElement("style"),o=t.attributes||{};if(void 0===o.nonce){var i=n.nc;i&&(o.nonce=i)}if(Object.keys(o).forEach((function(t){e.setAttribute(t,o[t])})),"function"==typeof t.insert)t.insert(e);else{var a=r(t.insert||"head");if(!a)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");a.appendChild(e)}return e}var c,u=(c=[],function(t,e){return c[t]=e,c.filter(Boolean).join("\n")});function f(t,e,n,o){var r=n?"":o.media?"@media ".concat(o.media," {").concat(o.css,"}"):o.css;if(t.styleSheet)t.styleSheet.cssText=u(e,r);else{var i=document.createTextNode(r),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function d(t,e,n){var o=n.css,r=n.media,i=n.sourceMap;if(r?t.setAttribute("media",r):t.removeAttribute("media"),i&&btoa&&(o+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i))))," */")),t.styleSheet)t.styleSheet.cssText=o;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(o))}}var p=null,h=0;function v(t,e){var n,o,r;if(e.singleton){var i=h++;n=p||(p=l(e)),o=f.bind(null,n,i,!1),r=f.bind(null,n,i,!0)}else n=l(e),o=d.bind(null,n,e),r=function(){!function(t){if(null===t.parentNode)return!1;t.parentNode.removeChild(t)}(n)};return o(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;o(t=e)}else r()}}t.exports=function(t,e){(e=e||{}).singleton||"boolean"==typeof e.singleton||(e.singleton=(void 0===o&&(o=Boolean(window&&document&&document.all&&!window.atob)),o));var n=s(t=t||[],e);return function(t){if(t=t||[],"[object Array]"===Object.prototype.toString.call(t)){for(var o=0;o<n.length;o++){var r=a(n[o]);i[r].references--}for(var l=s(t,e),c=0;c<n.length;c++){var u=a(n[c]);0===i[u].references&&(i[u].updater(),i.splice(u,1))}n=l}}}},function(t,e,n){(e=n(4)(!1)).push([t.i,".ce-paragraph {\n    line-height: 1.6em;\n    outline: none;\n}\n\n.ce-paragraph[data-placeholder]:empty::before{\n  content: attr(data-placeholder);\n  color: #707684;\n  font-weight: normal;\n  opacity: 0;\n}\n\n/** Show placeholder at the first paragraph if Editor is empty */\n.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty::before {\n  opacity: 1;\n}\n\n.codex-editor--toolbox-opened .ce-block:first-child .ce-paragraph[data-placeholder]:empty::before,\n.codex-editor--empty .ce-block:first-child .ce-paragraph[data-placeholder]:empty:focus::before {\n  opacity: 0;\n}\n\n.ce-paragraph p:first-of-type{\n    margin-top: 0;\n}\n\n.ce-paragraph p:last-of-type{\n    margin-bottom: 0;\n}\n",""]),t.exports=e},function(t,e,n){"use strict";t.exports=function(t){var e=[];return e.toString=function(){return this.map((function(e){var n=function(t,e){var n,o,r,i=t[1]||"",a=t[3];if(!a)return i;if(e&&"function"==typeof btoa){var s=(n=a,o=btoa(unescape(encodeURIComponent(JSON.stringify(n)))),r="sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(o),"/*# ".concat(r," */")),l=a.sources.map((function(t){return"/*# sourceURL=".concat(a.sourceRoot||"").concat(t," */")}));return[i].concat(l).concat([s]).join("\n")}return[i].join("\n")}(e,t);return e[2]?"@media ".concat(e[2]," {").concat(n,"}"):n})).join("")},e.i=function(t,n,o){"string"==typeof t&&(t=[[null,t,""]]);var r={};if(o)for(var i=0;i<this.length;i++){var a=this[i][0];null!=a&&(r[a]=!0)}for(var s=0;s<t.length;s++){var l=[].concat(t[s]);o&&r[l[0]]||(n&&(l[2]?l[2]="".concat(n," and ").concat(l[2]):l[2]=n),e.push(l))}},e}},function(t,e,n){"use strict";n.r(e),e.default='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0.2 -0.3 9 11.4" width="12" height="14">\n  <path d="M0 2.77V.92A1 1 0 01.2.28C.35.1.56 0 .83 0h7.66c.28.01.48.1.63.28.14.17.21.38.21.64v1.85c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26a1 1 0 01-.21-.66V1.69H5.6v7.58h.5c.25 0 .45.08.6.23.17.16.25.35.25.6s-.08.45-.24.6a.87.87 0 01-.62.22H3.21a.87.87 0 01-.61-.22.78.78 0 01-.24-.6c0-.25.08-.44.24-.6a.85.85 0 01.61-.23h.5V1.7H1.73v1.08c0 .26-.08.48-.23.66-.15.17-.37.26-.66.26-.28 0-.5-.09-.64-.26A1 1 0 010 2.77z"/>\n</svg>\n'}])},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(){(0,r.default)(this,t),this.commandName="bold",this.CSS={button:"ce-inline-tool",buttonActive:"ce-inline-tool--active",buttonModifier:"ce-inline-tool--bold"},this.nodes={button:void 0}}return(0,i.default)(t,[{key:"render",value:function(){return this.nodes.button=document.createElement("button"),this.nodes.button.type="button",this.nodes.button.classList.add(this.CSS.button,this.CSS.buttonModifier),this.nodes.button.appendChild(a.default.svg("bold",12,14)),this.nodes.button}},{key:"surround",value:function(t){document.execCommand(this.commandName)}},{key:"checkState",value:function(t){var e=document.queryCommandState(this.commandName);return this.nodes.button.classList.toggle(this.CSS.buttonActive,e),e}},{key:"shortcut",get:function(){return"CMD+B"}}],[{key:"sanitize",get:function(){return{b:{}}}}]),t}();o.default=l,l.displayName="BoldInlineTool",l.isInline=!0,l.title="Bold",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(){(0,r.default)(this,t),this.commandName="italic",this.CSS={button:"ce-inline-tool",buttonActive:"ce-inline-tool--active",buttonModifier:"ce-inline-tool--italic"},this.nodes={button:null}}return(0,i.default)(t,[{key:"render",value:function(){return this.nodes.button=document.createElement("button"),this.nodes.button.type="button",this.nodes.button.classList.add(this.CSS.button,this.CSS.buttonModifier),this.nodes.button.appendChild(a.default.svg("italic",4,11)),this.nodes.button}},{key:"surround",value:function(t){document.execCommand(this.commandName)}},{key:"checkState",value:function(t){var e=document.queryCommandState(this.commandName);return this.nodes.button.classList.toggle(this.CSS.buttonActive,e),e}},{key:"shortcut",get:function(){return"CMD+I"}}],[{key:"sanitize",get:function(){return{i:{}}}}]),t}();o.default=l,l.displayName="ItalicInlineTool",l.isInline=!0,l.title="Italic",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(25),n(15),n(7)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l){"use strict";var c=n(8),u=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),a=u(a),s=u(s),l=c(l);var f=function(){function t(e){var n=e.api;(0,r.default)(this,t),this.commandLink="createLink",this.commandUnlink="unlink",this.ENTER_KEY=13,this.CSS={button:"ce-inline-tool",buttonActive:"ce-inline-tool--active",buttonModifier:"ce-inline-tool--link",buttonUnlink:"ce-inline-tool--unlink",input:"ce-inline-tool-input",inputShowed:"ce-inline-tool-input--showed"},this.nodes={button:null,input:null},this.inputOpened=!1,this.toolbar=n.toolbar,this.inlineToolbar=n.inlineToolbar,this.notifier=n.notifier,this.i18n=n.i18n,this.selection=new a.default}return(0,i.default)(t,[{key:"render",value:function(){return this.nodes.button=document.createElement("button"),this.nodes.button.type="button",this.nodes.button.classList.add(this.CSS.button,this.CSS.buttonModifier),this.nodes.button.appendChild(s.default.svg("link",14,10)),this.nodes.button.appendChild(s.default.svg("unlink",15,11)),this.nodes.button}},{key:"renderActions",value:function(){var t=this;return this.nodes.input=document.createElement("input"),this.nodes.input.placeholder=this.i18n.t("Add a link"),this.nodes.input.classList.add(this.CSS.input),this.nodes.input.addEventListener("keydown",(function(e){e.keyCode===t.ENTER_KEY&&t.enterPressed(e)})),this.nodes.input}},{key:"surround",value:function(t){if(t){this.inputOpened?(this.selection.restore(),this.selection.removeFakeBackground()):(this.selection.setFakeBackground(),this.selection.save());var e=this.selection.findParentTag("A");if(e)return this.selection.expandToTag(e),this.unlink(),this.closeActions(),this.checkState(),void this.toolbar.close()}this.toggleActions()}},{key:"checkState",value:function(t){var e=this.selection.findParentTag("A");if(e){this.nodes.button.classList.add(this.CSS.buttonUnlink),this.nodes.button.classList.add(this.CSS.buttonActive),this.openActions();var n=e.getAttribute("href");this.nodes.input.value="null"!==n?n:"",this.selection.save()}else this.nodes.button.classList.remove(this.CSS.buttonUnlink),this.nodes.button.classList.remove(this.CSS.buttonActive);return!!e}},{key:"clear",value:function(){this.closeActions()}},{key:"toggleActions",value:function(){this.inputOpened?this.closeActions(!1):this.openActions(!0)}},{key:"openActions",value:function(){var t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.nodes.input.classList.add(this.CSS.inputShowed),t&&this.nodes.input.focus(),this.inputOpened=!0}},{key:"closeActions",value:function(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0];if(this.selection.isFakeBackgroundEnabled){var e=new a.default;e.save(),this.selection.restore(),this.selection.removeFakeBackground(),e.restore()}this.nodes.input.classList.remove(this.CSS.inputShowed),this.nodes.input.value="",t&&this.selection.clearSaved(),this.inputOpened=!1}},{key:"enterPressed",value:function(t){var e=this.nodes.input.value||"";return e.trim()?this.validateURL(e)?(e=this.prepareLink(e),this.selection.restore(),this.selection.removeFakeBackground(),this.insertLink(e),t.preventDefault(),t.stopPropagation(),t.stopImmediatePropagation(),this.selection.collapseToEnd(),void this.inlineToolbar.close()):(this.notifier.show({message:"Pasted link is not valid.",style:"error"}),void l.log("Incorrect Link pasted","warn",e)):(this.selection.restore(),this.unlink(),t.preventDefault(),void this.closeActions())}},{key:"validateURL",value:function(t){return!/\s/.test(t)}},{key:"prepareLink",value:function(t){return t=t.trim(),t=this.addProtocol(t)}},{key:"addProtocol",value:function(t){if(/^(\w+):(\/\/)?/.test(t))return t;var e=/^\/[^/\s]/.test(t),n="#"===t.substring(0,1),o=/^\/\/[^/\s]/.test(t);return e||n||o||(t="http://"+t),t}},{key:"insertLink",value:function(t){var e=this.selection.findParentTag("A");e&&this.selection.expandToTag(e),document.execCommand(this.commandLink,!1,t)}},{key:"unlink",value:function(){document.execCommand(this.commandUnlink)}},{key:"shortcut",get:function(){return"CMD+K"}}],[{key:"sanitize",get:function(){return{a:{href:!0,target:"_blank",rel:"nofollow"}}}}]),t}();o.default=f,f.displayName="LinkInlineTool",f.isInline=!0,f.title="Link",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(e){var n=e.data,o=e.api;(0,r.default)(this,t),this.CSS={wrapper:"ce-stub",info:"ce-stub__info",title:"ce-stub__title",subtitle:"ce-stub__subtitle"},this.api=o,this.title=n.title||this.api.i18n.t("Error"),this.subtitle=this.api.i18n.t("The block can not be displayed correctly."),this.savedData=n.savedData,this.wrapper=this.make()}return(0,i.default)(t,[{key:"render",value:function(){return this.wrapper}},{key:"save",value:function(){return this.savedData}},{key:"make",value:function(){var t=a.default.make("div",this.CSS.wrapper),e=a.default.svg("sad-face",52,52),n=a.default.make("div",this.CSS.info),o=a.default.make("div",this.CSS.title,{textContent:this.title}),r=a.default.make("div",this.CSS.subtitle,{textContent:this.subtitle});return t.appendChild(e),n.appendChild(o),n.appendChild(r),t.appendChild(n),t}}]),t}();o.default=l,l.displayName="Stub",l.isReadOnlySupported=!0,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(67),n(390),n(391),n(392)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=u(r),i=u(i),s=u(s),l=u(l),c=u(c);var f=function(t,e){var n={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(t);r<o.length;r++)e.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(t,o[r])&&(n[o[r]]=t[o[r]])}return n},d=function(){function t(e,n,o){(0,r.default)(this,t),this.api=o,this.config=e,this.editorConfig=n}return(0,i.default)(t,[{key:"get",value:function(t){var e=this.config[t],n=e.class,o=e.isInternal,r=void 0!==o&&o,i=f(e,["class","isInternal"]);return new(this.getConstructor(n))({name:t,constructable:n,config:i,api:this.api,isDefault:t===this.editorConfig.defaultBlock,defaultPlaceholder:this.editorConfig.placeholder,isInternal:r})}},{key:"getConstructor",value:function(t){switch(!0){case t[a.InternalInlineToolSettings.IsInline]:return s.default;case t[a.InternalTuneSettings.IsTune]:return l.default;default:return c.default}}}]),t}();o.default=d,d.displayName="ToolsFactory",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(67)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(8),f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).type=c.ToolType.Inline,t}return(0,i.default)(o,[{key:"create",value:function(){return new this.constructable({api:this.api.getMethodsForTool(this),config:this.settings})}},{key:"title",get:function(){return this.constructable[c.InternalInlineToolSettings.Title]}}]),o}((c=u(c)).default);o.default=p,p.displayName="InlineTool",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(5),n(6),n(4),n(67)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c){"use strict";var u=n(8),f=n(1);function d(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=f(r),i=f(i),a=f(a),s=f(s),l=f(l);var p=function(t){(0,a.default)(o,t);var e,n=(e=o,function(){var t,n=(0,l.default)(e);if(d()){var o=(0,l.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,s.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).type=c.ToolType.Tune,t}return(0,i.default)(o,[{key:"create",value:function(t,e){return new this.constructable({api:this.api.getMethodsForTool(this),config:this.settings,block:e,data:t})}}]),o}((c=u(c)).default);o.default=p,p.displayName="BlockTune",t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(168),n(5),n(6),n(4),n(80),n(67),n(7),n(184)],void 0===(i="function"==typeof(o=function(o,r,i,a,s,l,c,u,f,d,p){"use strict";var h=n(8),v=n(1);function g(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],(function(){}))),!0}catch(t){return!1}}Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=v(r),i=v(i),a=v(a),s=v(s),l=v(l),c=v(c),u=v(u),f=h(f),d=h(d),p=v(p);var y=function(t,e,n,o){var r,i=arguments.length,a=i<3?e:null===o?o=Object.getOwnPropertyDescriptor(e,n):o;if("object"===("undefined"==typeof Reflect?"undefined":(0,u.default)(Reflect))&&"function"==typeof Reflect.decorate)a=Reflect.decorate(t,e,n,o);else for(var s=t.length-1;s>=0;s--)(r=t[s])&&(a=(i<3?r(a):i>3?r(e,n,a):r(e,n))||a);return i>3&&a&&Object.defineProperty(e,n,a),a},b=function(t){(0,s.default)(o,t);var e,n=(e=o,function(){var t,n=(0,c.default)(e);if(g()){var o=(0,c.default)(this).constructor;t=Reflect.construct(n,arguments,o)}else t=n.apply(this,arguments);return(0,l.default)(this,t)});function o(){var t;return(0,r.default)(this,o),(t=n.apply(this,arguments)).type=f.ToolType.Block,t.inlineTools=new p.default,t.tunes=new p.default,t}return(0,i.default)(o,[{key:"create",value:function(t,e,n){return new this.constructable({data:t,block:e,readOnly:n,api:this.api.getMethodsForTool(this),config:this.settings})}},{key:"isReadOnlySupported",get:function(){return!0===this.constructable[f.InternalBlockToolSettings.IsReadOnlySupported]}},{key:"isLineBreaksEnabled",get:function(){return this.constructable[f.InternalBlockToolSettings.IsEnabledLineBreaks]}},{key:"toolbox",get:function(){var t=this.constructable[f.InternalBlockToolSettings.Toolbox],e=this.config[f.UserSettings.Toolbox];if(!d.isEmpty(t)&&!1!==(null!=e?e:t))return Object.assign({},t,e)}},{key:"conversionConfig",get:function(){return this.constructable[f.InternalBlockToolSettings.ConversionConfig]}},{key:"enabledInlineTools",get:function(){return this.config[f.UserSettings.EnabledInlineTools]||!1}},{key:"enabledBlockTunes",get:function(){return this.config[f.UserSettings.EnabledBlockTunes]}},{key:"pasteConfig",get:function(){return this.constructable[f.InternalBlockToolSettings.PasteConfig]||{}}},{key:"sanitizeConfig",get:function(){var t=(0,a.default)((0,c.default)(o.prototype),"sanitizeConfig",this),e=this.baseSanitizeConfig;if(d.isEmpty(t))return e;var n={};for(var r in t)if(Object.prototype.hasOwnProperty.call(t,r)){var i=t[r];d.isObject(i)?n[r]=Object.assign({},e,i):n[r]=i}return n}},{key:"baseSanitizeConfig",get:function(){var t={};return Array.from(this.inlineTools.values()).forEach((function(e){return Object.assign(t,e.sanitizeConfig)})),Array.from(this.tunes.values()).forEach((function(e){return Object.assign(t,e.sanitizeConfig)})),t}}]),o}(f.default);o.default=b,b.displayName="BlockTool",y([d.cacheable],b.prototype,"sanitizeConfig",null),y([d.cacheable],b.prototype,"baseSanitizeConfig",null),t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(e){var n=e.api;(0,r.default)(this,t),this.CSS={button:"ce-settings__button",wrapper:"ce-tune-move-down",animation:"wobble"},this.api=n}return(0,i.default)(t,[{key:"render",value:function(){var t=this,e=a.default.make("div",[this.CSS.button,this.CSS.wrapper],{});return e.appendChild(a.default.svg("arrow-down",14,14)),this.api.listeners.on(e,"click",(function(n){return t.handleClick(n,e)}),!1),this.api.tooltip.onHover(e,this.api.i18n.t("Move down"),{hidingDelay:300}),e}},{key:"handleClick",value:function(t,e){var n=this,o=this.api.blocks.getCurrentBlockIndex(),r=this.api.blocks.getBlockByIndex(o+1);if(!r)return e.classList.add(this.CSS.animation),void window.setTimeout((function(){e.classList.remove(n.CSS.animation)}),500);var i=r.holder,a=i.getBoundingClientRect(),s=Math.abs(window.innerHeight-i.offsetHeight);a.top<window.innerHeight&&(s=window.scrollY+i.offsetHeight),window.scrollTo(0,s),this.api.blocks.move(o+1),this.api.tooltip.hide()}}]),t}();o.default=l,l.displayName="MoveDownTune",l.isTune=!0,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(e){var n=this,o=e.api;(0,r.default)(this,t),this.CSS={button:"ce-settings__button",buttonDelete:"ce-settings__button--delete",buttonConfirm:"ce-settings__button--confirm"},this.nodes={button:null},this.api=o,this.resetConfirmation=function(){n.setConfirmation(!1)}}return(0,i.default)(t,[{key:"render",value:function(){var t=this;return this.nodes.button=a.default.make("div",[this.CSS.button,this.CSS.buttonDelete],{}),this.nodes.button.appendChild(a.default.svg("cross",12,12)),this.api.listeners.on(this.nodes.button,"click",(function(e){return t.handleClick(e)}),!1),this.api.tooltip.onHover(this.nodes.button,this.api.i18n.t("Delete"),{hidingDelay:300}),this.nodes.button}},{key:"handleClick",value:function(t){this.needConfirmation?(this.api.events.off("block-settings-closed",this.resetConfirmation),this.api.blocks.delete(),this.api.toolbar.close(),this.api.tooltip.hide(),t.stopPropagation()):(this.setConfirmation(!0),this.api.events.on("block-settings-closed",this.resetConfirmation))}},{key:"setConfirmation",value:function(t){this.needConfirmation=t,this.nodes.button.classList.add(this.CSS.buttonConfirm)}}]),t}();o.default=l,l.displayName="DeleteTune",l.isTune=!0,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){var o,r,i;"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self&&self,r=[e,n(2),n(3),n(15)],void 0===(i="function"==typeof(o=function(o,r,i,a){"use strict";var s=n(1);Object.defineProperty(o,"__esModule",{value:!0}),o.default=void 0,r=s(r),i=s(i),a=s(a);var l=function(){function t(e){var n=e.api;(0,r.default)(this,t),this.CSS={button:"ce-settings__button",wrapper:"ce-tune-move-up",animation:"wobble"},this.api=n}return(0,i.default)(t,[{key:"render",value:function(){var t=this,e=a.default.make("div",[this.CSS.button,this.CSS.wrapper],{});return e.appendChild(a.default.svg("arrow-up",14,14)),this.api.listeners.on(e,"click",(function(n){return t.handleClick(n,e)}),!1),this.api.tooltip.onHover(e,this.api.i18n.t("Move up"),{hidingDelay:300}),e}},{key:"handleClick",value:function(t,e){var n=this,o=this.api.blocks.getCurrentBlockIndex(),r=this.api.blocks.getBlockByIndex(o),i=this.api.blocks.getBlockByIndex(o-1);if(0===o||!r||!i)return e.classList.add(this.CSS.animation),void window.setTimeout((function(){e.classList.remove(n.CSS.animation)}),500);var a,s=r.holder,l=i.holder,c=s.getBoundingClientRect(),u=l.getBoundingClientRect();a=u.top>0?Math.abs(c.top)-Math.abs(u.top):window.innerHeight-Math.abs(c.top)+Math.abs(u.top),window.scrollBy(0,-1*a),this.api.blocks.move(o-1),this.api.tooltip.hide()}}]),t}();o.default=l,l.displayName="MoveUpTune",l.isTune=!0,t.exports=e.default})?o.apply(e,r):o)||(t.exports=i)},function(t,e,n){"use strict";n.r(e),e.default='<?xml version="1.0" encoding="utf-8"?>\n<svg xmlns="http://www.w3.org/2000/svg">\n<symbol id="arrow-down" viewBox="0 0 14 14">\n  <path transform="matrix(1 0 0 -1 0 14)" d="M8.024 4.1v8.6a1.125 1.125 0 0 1-2.25 0V4.1L2.18 7.695A1.125 1.125 0 1 1 .59 6.104L6.103.588c.44-.439 1.151-.439 1.59 0l5.516 5.516a1.125 1.125 0 0 1-1.59 1.59L8.023 4.1z"/>\n\n</symbol>\n<symbol id="arrow-up" viewBox="0 0 14 14">\n    <path d="M8.024 4.1v8.6a1.125 1.125 0 0 1-2.25 0V4.1L2.18 7.695A1.125 1.125 0 1 1 .59 6.104L6.103.588c.44-.439 1.151-.439 1.59 0l5.516 5.516a1.125 1.125 0 0 1-1.59 1.59L8.023 4.1z"/>\n\n</symbol>\n<symbol id="bold" viewBox="0 0 12 14"><path d="M5.997 14H1.72c-.618 0-1.058-.138-1.323-.415C.132 13.308 0 12.867 0 12.262V1.738C0 1.121.135.676.406.406.676.136 1.114 0 1.719 0h4.536c.669 0 1.248.041 1.738.124.49.083.93.242 1.318.478a3.458 3.458 0 0 1 1.461 1.752c.134.366.2.753.2 1.16 0 1.401-.7 2.426-2.1 3.075 1.84.586 2.76 1.726 2.76 3.42 0 .782-.2 1.487-.602 2.114a3.61 3.61 0 0 1-1.623 1.39 5.772 5.772 0 0 1-1.471.377c-.554.073-1.2.11-1.939.11zm-.21-6.217h-2.95v4.087h3.046c1.916 0 2.874-.69 2.874-2.072 0-.707-.248-1.22-.745-1.537-.496-.319-1.238-.478-2.225-.478zM2.837 2.13v3.619h2.597c.707 0 1.252-.067 1.638-.2.385-.134.68-.389.883-.765.16-.267.239-.566.239-.897 0-.707-.252-1.176-.755-1.409-.503-.232-1.27-.348-2.301-.348H2.836z"/>\n</symbol>\n<symbol id="cross" viewBox="0 0 237 237">\n  <path transform="rotate(45 280.675 51.325)" d="M191 191V73c0-5.523 4.477-10 10-10h25c5.523 0 10 4.477 10 10v118h118c5.523 0 10 4.477 10 10v25c0 5.523-4.477 10-10 10H236v118c0 5.523-4.477 10-10 10h-25c-5.523 0-10-4.477-10-10V236H73c-5.523 0-10-4.477-10-10v-25c0-5.523 4.477-10 10-10h118z"/>\n\n</symbol>\n<symbol id="dots" viewBox="0 0 8 8">\n  <circle cx="6.5" cy="1.5" r="1.5"/>\n  <circle cx="6.5" cy="6.5" r="1.5"/>\n  <circle cx="1.5" cy="1.5" r="1.5"/>\n  <circle cx="1.5" cy="6.5" r="1.5"/>\n\n</symbol>\n<symbol id="italic" viewBox="0 0 4 11">\n    <path d="M3.289 4.17L2.164 9.713c-.078.384-.238.674-.48.87-.243.198-.52.296-.831.296-.312 0-.545-.1-.699-.302-.153-.202-.192-.49-.116-.864L1.15 4.225c.077-.38.232-.665.466-.857a1.25 1.25 0 01.818-.288c.312 0 .55.096.713.288.163.192.21.46.141.801zm-.667-2.09c-.295 0-.53-.09-.706-.273-.176-.181-.233-.439-.173-.77.055-.302.207-.55.457-.745C2.45.097 2.716 0 3 0c.273 0 .5.088.68.265.179.176.238.434.177.771-.06.327-.21.583-.45.767-.24.185-.502.277-.785.277z"/>\n\n</symbol>\n<symbol id="link" viewBox="0 0 14 10">\n  <path d="M6 0v2H5a3 3 0 000 6h1v2H5A5 5 0 115 0h1zm2 0h1a5 5 0 110 10H8V8h1a3 3 0 000-6H8V0zM5 4h4a1 1 0 110 2H5a1 1 0 110-2z"/>\n\n</symbol>\n<symbol id="plus" viewBox="0 0 14 14">\n    <path d="M8.05 5.8h4.625a1.125 1.125 0 0 1 0 2.25H8.05v4.625a1.125 1.125 0 0 1-2.25 0V8.05H1.125a1.125 1.125 0 0 1 0-2.25H5.8V1.125a1.125 1.125 0 0 1 2.25 0V5.8z"/>\n\n</symbol>\n<symbol id="sad-face" viewBox="0 0 52 52">\n    <path fill="#D76B6B" fill-rule="nonzero" d="M26 52C11.64 52 0 40.36 0 26S11.64 0 26 0s26 11.64 26 26-11.64 26-26 26zm0-3.25c12.564 0 22.75-10.186 22.75-22.75S38.564 3.25 26 3.25 3.25 13.436 3.25 26 13.436 48.75 26 48.75zM15.708 33.042a2.167 2.167 0 1 1 0-4.334 2.167 2.167 0 0 1 0 4.334zm23.834 0a2.167 2.167 0 1 1 0-4.334 2.167 2.167 0 0 1 0 4.334zm-15.875 5.452a1.083 1.083 0 1 1-1.834-1.155c1.331-2.114 3.49-3.179 6.334-3.179 2.844 0 5.002 1.065 6.333 3.18a1.083 1.083 0 1 1-1.833 1.154c-.913-1.45-2.366-2.167-4.5-2.167s-3.587.717-4.5 2.167z"/>\n\n</symbol>\n<symbol id="toggler-down">\n  <path d="M6.5 9.294a.792.792 0 01-.562-.232L2.233 5.356a.794.794 0 011.123-1.123L6.5 7.377l3.144-3.144a.794.794 0 011.123 1.123L7.062 9.062a.792.792 0 01-.562.232z"/>\n\n</symbol>\n<symbol id="unlink" viewBox="0 0 15 11">\n  <path d="M13.073 2.099l-1.448 1.448A3 3 0 009 2H8V0h1c1.68 0 3.166.828 4.073 2.099zM6.929 4l-.879.879L7.172 6H5a1 1 0 110-2h1.929zM6 0v2H5a3 3 0 100 6h1v2H5A5 5 0 115 0h1zm6.414 7l2.122 2.121-1.415 1.415L11 8.414l-2.121 2.122L7.464 9.12 9.586 7 7.464 4.879 8.88 3.464 11 5.586l2.121-2.122 1.415 1.415L12.414 7z"/>\n\n</symbol></svg>'},function(t,e){t.exports='.codex-editor{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;z-index:1}.codex-editor .hide,.codex-editor__redactor--hidden{display:none}.codex-editor__redactor [contenteditable]:empty:after{content:"\\feff "}@media (min-width:651px){.codex-editor--narrow .codex-editor__redactor{margin-right:50px}}@media (min-width:651px){.codex-editor--narrow.codex-editor--rtl .codex-editor__redactor{margin-left:50px;margin-right:0}}@media (min-width:651px){.codex-editor--narrow .ce-toolbar__actions{right:-5px}}.codex-editor__loader{position:relative;height:30vh}.codex-editor__loader:before{content:"";position:absolute;left:50%;top:50%;width:30px;height:30px;margin-top:-15px;margin-left:-15px;border-radius:50%;border:2px solid rgba(201,201,204,.48);border-top-color:transparent;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-animation:editor-loader-spin .8s linear infinite;animation:editor-loader-spin .8s linear infinite;will-change:transform}.codex-editor-copyable{position:absolute;height:1px;width:1px;top:-400%;opacity:.001}.codex-editor-overlay{position:fixed;top:0;left:0;right:0;bottom:0;z-index:999;pointer-events:none;overflow:hidden}.codex-editor-overlay__container{position:relative;pointer-events:auto;z-index:0}.codex-editor-overlay__rectangle{position:absolute;pointer-events:none;background-color:rgba(46,170,220,.2);border:1px solid transparent}.codex-editor svg{fill:currentColor;vertical-align:middle;max-height:100%}::-moz-selection{background-color:#d4ecff}::selection{background-color:#d4ecff}.codex-editor--toolbox-opened [contentEditable=true][data-placeholder]:focus:before{opacity:0!important}@-webkit-keyframes editor-loader-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes editor-loader-spin{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.ce-toolbar{position:absolute;left:0;right:0;top:0;-webkit-transition:opacity .1s ease;transition:opacity .1s ease;will-change:opacity,transform;display:none}@media (max-width:650px){.ce-toolbar{position:absolute;background-color:#fff;border:1px solid #eaeaea;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px rgba(13,20,33,.13);border-radius:4px;z-index:2}}@media (max-width:650px) and (max-width:650px){.ce-toolbar{-webkit-box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);border-bottom-color:#d5d7db}}@media (max-width:650px){.ce-toolbar{padding:3px;margin-top:5px}.ce-toolbar--left-oriented:before{left:15px;margin-left:0}.ce-toolbar--right-oriented:before{left:auto;right:15px;margin-left:0}}.ce-toolbar--opened{display:block}@media (max-width:650px){.ce-toolbar--opened{display:-webkit-box;display:-ms-flexbox;display:flex}}.ce-toolbar__content{max-width:650px;margin:0 auto;position:relative}@media (max-width:650px){.ce-toolbar__content{display:-webkit-box;display:-ms-flexbox;display:flex;-ms-flex-line-pack:center;align-content:center;margin:0;max-width:calc(100% - 35px)}}.ce-toolbar__plus{color:#707684;cursor:pointer;width:34px;height:34px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;position:absolute;left:-34px;-ms-flex-negative:0;flex-shrink:0}.ce-toolbar__plus--active,.ce-toolbar__plus:hover{color:#388ae5}.ce-toolbar__plus--active{-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-toolbar__plus-shortcut{opacity:.6;word-spacing:-2px;margin-top:5px}.ce-toolbar__plus--hidden{display:none}@media (max-width:650px){.ce-toolbar__plus{display:-webkit-inline-box!important;display:-ms-inline-flexbox!important;display:inline-flex!important;position:static;-webkit-transform:none!important;transform:none!important}}.ce-toolbar .ce-toolbox,.ce-toolbar__plus{top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.ce-toolbar__actions{position:absolute;right:-30px;top:5px;opacity:0}@media (max-width:650px){.ce-toolbar__actions{position:absolute;right:-28px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%);display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center}}.ce-toolbar__actions--opened{opacity:1}.ce-toolbar__actions-buttons{text-align:right}.ce-toolbar__settings-btn{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:18px;height:18px;color:#707684;cursor:pointer;background:#eff2f5;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ce-toolbar__settings-btn:hover{color:#1d202b}@media (max-width:650px){.ce-toolbar__settings-btn{background:transparent}}@media (min-width:651px){.codex-editor--narrow .ce-toolbar__plus{left:5px}}.ce-toolbox{position:absolute;visibility:hidden;-webkit-transition:opacity .1s ease;transition:opacity .1s ease;will-change:opacity;display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-orient:horizontal;-webkit-box-direction:normal;-ms-flex-direction:row;flex-direction:row}@media (max-width:650px){.ce-toolbox{position:static;-webkit-transform:none!important;transform:none!important;-webkit-box-align:center;-ms-flex-align:center;align-items:center;overflow-x:auto}}.ce-toolbox--opened{opacity:1;visibility:visible}.ce-toolbox__button{color:#707684;cursor:pointer;width:34px;height:34px;display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-ms-flex-negative:0;flex-shrink:0}.ce-toolbox__button--active,.ce-toolbox__button:hover{color:#388ae5}.ce-toolbox__button--active{-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-toolbox-button-tooltip__shortcut{opacity:.6;word-spacing:-3px;margin-top:3px}@media (min-width:651px){.codex-editor--narrow .ce-toolbox{background:#fff;z-index:2}}.ce-inline-toolbar{position:absolute;background-color:#fff;border:1px solid #eaeaea;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px rgba(13,20,33,.13);border-radius:4px;z-index:2}@media (max-width:650px){.ce-inline-toolbar{-webkit-box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);border-bottom-color:#d5d7db}}.ce-inline-toolbar{-webkit-transform:translateX(-50%) translateY(8px) scale(.9);transform:translateX(-50%) translateY(8px) scale(.9);opacity:0;visibility:hidden;-webkit-transition:opacity .25s ease,-webkit-transform .15s ease;transition:opacity .25s ease,-webkit-transform .15s ease;transition:transform .15s ease,opacity .25s ease;transition:transform .15s ease,opacity .25s ease,-webkit-transform .15s ease;will-change:transform,opacity;top:0;left:0;z-index:3}.ce-inline-toolbar--left-oriented:before{left:15px;margin-left:0}.ce-inline-toolbar--right-oriented:before{left:auto;right:15px;margin-left:0}.ce-inline-toolbar--showed{opacity:1;visibility:visible;-webkit-transform:translateX(-50%);transform:translateX(-50%)}.ce-inline-toolbar--left-oriented{-webkit-transform:translateX(-23px) translateY(8px) scale(.9);transform:translateX(-23px) translateY(8px) scale(.9)}.ce-inline-toolbar--left-oriented.ce-inline-toolbar--showed{-webkit-transform:translateX(-23px);transform:translateX(-23px)}.ce-inline-toolbar--right-oriented{-webkit-transform:translateX(-100%) translateY(8px) scale(.9);transform:translateX(-100%) translateY(8px) scale(.9);margin-left:23px}.ce-inline-toolbar--right-oriented.ce-inline-toolbar--showed{-webkit-transform:translateX(-100%);transform:translateX(-100%)}.ce-inline-toolbar [hidden]{display:none!important}.ce-inline-toolbar__toggler-and-button-wrapper{width:100%;padding:0 6px}.ce-inline-toolbar__buttons,.ce-inline-toolbar__toggler-and-button-wrapper{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-inline-toolbar__dropdown{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;height:34px;padding:0 9px 0 10px;margin:0 6px 0 -6px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;cursor:pointer;border-right:1px solid rgba(201,201,204,.48)}.ce-inline-toolbar__dropdown:hover{background:#eff2f5}.ce-inline-toolbar__dropdown--hidden{display:none}.ce-inline-toolbar__dropdown-content{display:-webkit-box;display:-ms-flexbox;display:flex;font-weight:500;font-size:14px}.ce-inline-toolbar__dropdown-content svg{height:12px}.ce-inline-toolbar__dropdown .icon--toggler-down{margin-left:4px}.ce-inline-toolbar__shortcut{opacity:.6;word-spacing:-3px;margin-top:3px}.ce-inline-tool{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:34px;height:34px;line-height:34px;padding:0!important;text-align:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:#000;margin:0}.ce-inline-tool:hover{background-color:#eff2f5}.ce-inline-tool{border-radius:0;line-height:normal;width:auto;padding:0 5px!important;min-width:24px}.ce-inline-tool--active{color:#388ae5}.ce-inline-tool--focused{-webkit-box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);background:rgba(34,186,255,.08)!important}.ce-inline-tool--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.ce-inline-tool:not(:last-of-type){margin-right:2px}.ce-inline-tool .icon{height:12px}.ce-inline-tool--link .icon--unlink,.ce-inline-tool--unlink .icon--link{display:none}.ce-inline-tool--unlink .icon--unlink{display:inline-block;margin-bottom:-1px}.ce-inline-tool-input{outline:none;border:0;border-radius:0 0 4px 4px;margin:0;font-size:13px;padding:10px;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box;display:none;font-weight:500;border-top:1px solid rgba(201,201,204,.48)}.ce-inline-tool-input::-webkit-input-placeholder{color:#707684}.ce-inline-tool-input::-moz-placeholder{color:#707684}.ce-inline-tool-input:-ms-input-placeholder{color:#707684}.ce-inline-tool-input::-ms-input-placeholder{color:#707684}.ce-inline-tool-input::placeholder{color:#707684}.ce-inline-tool-input--showed{display:block}.ce-conversion-toolbar{position:absolute;background-color:#fff;border:1px solid #eaeaea;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px rgba(13,20,33,.13);border-radius:4px;z-index:2}@media (max-width:650px){.ce-conversion-toolbar{-webkit-box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);border-bottom-color:#d5d7db}}.ce-conversion-toolbar{opacity:0;visibility:hidden;will-change:transform,opacity;-webkit-transition:opacity .1s ease,-webkit-transform .1s ease;transition:opacity .1s ease,-webkit-transform .1s ease;transition:transform .1s ease,opacity .1s ease;transition:transform .1s ease,opacity .1s ease,-webkit-transform .1s ease;-webkit-transform:translateY(-8px);transform:translateY(-8px);left:-1px;width:150px;margin-top:5px;-webkit-box-sizing:content-box;box-sizing:content-box}.ce-conversion-toolbar--left-oriented:before{left:15px;margin-left:0}.ce-conversion-toolbar--right-oriented:before{left:auto;right:15px;margin-left:0}.ce-conversion-toolbar--showed{opacity:1;visibility:visible;-webkit-transform:none;transform:none}.ce-conversion-toolbar [hidden]{display:none!important}.ce-conversion-toolbar__buttons{display:-webkit-box;display:-ms-flexbox;display:flex}.ce-conversion-toolbar__label{color:#707684;font-size:11px;font-weight:500;letter-spacing:.33px;padding:10px 10px 5px;text-transform:uppercase}.ce-conversion-tool{display:-webkit-box;display:-ms-flexbox;display:flex;padding:5px 10px;font-size:14px;line-height:20px;font-weight:500;cursor:pointer;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ce-conversion-tool--hidden{display:none}.ce-conversion-tool--focused{-webkit-box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);background:rgba(34,186,255,.08)!important}.ce-conversion-tool--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.ce-conversion-tool:hover{background:#eff2f5}.ce-conversion-tool__icon{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;width:20px;height:20px;border:1px solid rgba(201,201,204,.48);border-radius:3px;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;margin-right:10px;background:#fff}.ce-conversion-tool__icon svg{width:11px;height:11px}.ce-conversion-tool--last{margin-right:0!important}.ce-conversion-tool--active{color:#388ae5!important;-webkit-animation:bounceIn .75s 1;animation:bounceIn .75s 1;-webkit-animation-fill-mode:forwards;animation-fill-mode:forwards}.ce-settings{position:absolute;background-color:#fff;border:1px solid #eaeaea;-webkit-box-shadow:0 3px 15px -3px rgba(13,20,33,.13);box-shadow:0 3px 15px -3px rgba(13,20,33,.13);border-radius:4px;z-index:2}@media (max-width:650px){.ce-settings{-webkit-box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);box-shadow:0 13px 7px -5px rgba(26,38,49,.09),6px 15px 34px -6px rgba(33,48,73,.29);border-bottom-color:#d5d7db}}.ce-settings{right:-1px;top:30px;min-width:114px;-webkit-box-sizing:content-box;box-sizing:content-box}.ce-settings--left-oriented:before{left:15px;margin-left:0}.ce-settings--right-oriented:before{left:auto;right:15px;margin-left:0}@media (max-width:650px){.ce-settings{bottom:40px;right:-11px;top:auto}}.ce-settings:before{left:auto;right:12px}@media (max-width:650px){.ce-settings:before{bottom:-5px;top:auto}}.ce-settings{display:none}.ce-settings--opened{display:block;-webkit-animation-duration:.1s;animation-duration:.1s;-webkit-animation-name:panelShowing;animation-name:panelShowing}.ce-settings__plugin-zone:not(:empty){padding:3px 3px 0}.ce-settings__default-zone:not(:empty){padding:3px}.ce-settings__button{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:34px;height:34px;line-height:34px;padding:0!important;text-align:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:#000;margin:0}.ce-settings__button:hover{background-color:#eff2f5}.ce-settings__button--active{color:#388ae5}.ce-settings__button--focused{-webkit-box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);background:rgba(34,186,255,.08)!important}.ce-settings__button--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.ce-settings__button:not(:nth-child(3n+3)){margin-right:3px}.ce-settings__button:nth-child(n+4){margin-top:3px}.ce-settings__button{line-height:32px}.ce-settings__button--disabled{cursor:not-allowed!important;opacity:.3}.ce-settings__button--selected{color:#388ae5}.ce-settings__button--delete{-webkit-transition:background-color .3s ease;transition:background-color .3s ease;will-change:background-color}.ce-settings__button--delete .icon{-webkit-transition:-webkit-transform .2s ease-out;transition:-webkit-transform .2s ease-out;transition:transform .2s ease-out;transition:transform .2s ease-out,-webkit-transform .2s ease-out;will-change:transform}.ce-settings__button--confirm{background-color:#e24a4a!important;color:#fff}.ce-settings__button--confirm:hover{background-color:#d54a4a!important}.ce-settings__button--confirm .icon{-webkit-transform:rotate(90deg);transform:rotate(90deg)}.ce-block:first-of-type{margin-top:0}.ce-block--selected .ce-block__content{background:#e1f2ff}.ce-block--selected .ce-block__content [contenteditable]{-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.ce-block--selected .ce-block__content .ce-stub,.ce-block--selected .ce-block__content img{opacity:.55}.ce-block--stretched .ce-block__content{max-width:none}.ce-block__content{position:relative;max-width:650px;margin:0 auto;-webkit-transition:background-color .15s ease;transition:background-color .15s ease}.ce-block--drop-target .ce-block__content:before{content:"";position:absolute;top:100%;left:-20px;margin-top:-1px;height:8px;width:8px;border:solid #388ae5;border-width:1px 1px 0 0;-webkit-transform-origin:right;transform-origin:right;-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ce-block--drop-target .ce-block__content:after{content:"";position:absolute;top:100%;height:1px;width:100%;color:#388ae5;background:repeating-linear-gradient(90deg,#388ae5,#388ae5 1px,#fff 0,#fff 6px)}.ce-block a{cursor:pointer;text-decoration:underline}.ce-block b{font-weight:700}.ce-block i{font-style:italic}@media (min-width:651px){.codex-editor--narrow .ce-block--focused{margin-right:-50px;padding-right:50px}}.wobble{-webkit-animation-name:wobble;animation-name:wobble;-webkit-animation-duration:.4s;animation-duration:.4s}@-webkit-keyframes wobble{0%{-webkit-transform:translateZ(0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-5%,0,0) rotate(-5deg);transform:translate3d(-5%,0,0) rotate(-5deg)}30%{-webkit-transform:translate3d(2%,0,0) rotate(3deg);transform:translate3d(2%,0,0) rotate(3deg)}45%{-webkit-transform:translate3d(-3%,0,0) rotate(-3deg);transform:translate3d(-3%,0,0) rotate(-3deg)}60%{-webkit-transform:translate3d(2%,0,0) rotate(2deg);transform:translate3d(2%,0,0) rotate(2deg)}75%{-webkit-transform:translate3d(-1%,0,0) rotate(-1deg);transform:translate3d(-1%,0,0) rotate(-1deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@keyframes wobble{0%{-webkit-transform:translateZ(0);transform:translateZ(0)}15%{-webkit-transform:translate3d(-5%,0,0) rotate(-5deg);transform:translate3d(-5%,0,0) rotate(-5deg)}30%{-webkit-transform:translate3d(2%,0,0) rotate(3deg);transform:translate3d(2%,0,0) rotate(3deg)}45%{-webkit-transform:translate3d(-3%,0,0) rotate(-3deg);transform:translate3d(-3%,0,0) rotate(-3deg)}60%{-webkit-transform:translate3d(2%,0,0) rotate(2deg);transform:translate3d(2%,0,0) rotate(2deg)}75%{-webkit-transform:translate3d(-1%,0,0) rotate(-1deg);transform:translate3d(-1%,0,0) rotate(-1deg)}to{-webkit-transform:translateZ(0);transform:translateZ(0)}}@-webkit-keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes bounceIn{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.9,.9,.9);transform:scale3d(.9,.9,.9)}20%{-webkit-transform:scale3d(1.03,1.03,1.03);transform:scale3d(1.03,1.03,1.03)}60%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@-webkit-keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes selectionBounce{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}50%{-webkit-transform:scale3d(1.01,1.01,1.01);transform:scale3d(1.01,1.01,1.01)}70%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@-webkit-keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@keyframes buttonClicked{0%,20%,40%,60%,80%,to{-webkit-animation-timing-function:cubic-bezier(.215,.61,.355,1);animation-timing-function:cubic-bezier(.215,.61,.355,1)}0%{-webkit-transform:scale3d(.95,.95,.95);transform:scale3d(.95,.95,.95)}60%{-webkit-transform:scale3d(1.02,1.02,1.02);transform:scale3d(1.02,1.02,1.02)}80%{-webkit-transform:scaleX(1);transform:scaleX(1)}}@-webkit-keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}@keyframes panelShowing{0%{opacity:0;-webkit-transform:translateY(-8px) scale(.9);transform:translateY(-8px) scale(.9)}70%{opacity:1;-webkit-transform:translateY(2px);transform:translateY(2px)}to{-webkit-transform:translateY(0);transform:translateY(0)}}.cdx-block{padding:.4em 0}.cdx-input{border:1px solid rgba(201,201,204,.48);-webkit-box-shadow:inset 0 1px 2px 0 rgba(35,44,72,.06);box-shadow:inset 0 1px 2px 0 rgba(35,44,72,.06);border-radius:3px;padding:10px 12px;outline:none;width:100%;-webkit-box-sizing:border-box;box-sizing:border-box}.cdx-input[data-placeholder]:before{position:static!important;display:inline-block;width:0;white-space:nowrap;pointer-events:none}.cdx-settings-button{display:-webkit-inline-box;display:-ms-inline-flexbox;display:inline-flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:34px;height:34px;line-height:34px;padding:0!important;text-align:center;border-radius:3px;cursor:pointer;border:0;outline:none;background-color:transparent;vertical-align:bottom;color:#000;margin:0}.cdx-settings-button:hover{background-color:#eff2f5}.cdx-settings-button--focused{-webkit-box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);box-shadow:inset 0 0 0 1px rgba(7,161,227,.08);background:rgba(34,186,255,.08)!important}.cdx-settings-button--focused-animated{-webkit-animation-name:buttonClicked;animation-name:buttonClicked;-webkit-animation-duration:.25s;animation-duration:.25s}.cdx-settings-button:not(:nth-child(3n+3)){margin-right:3px}.cdx-settings-button:nth-child(n+4){margin-top:3px}.cdx-settings-button--active{color:#388ae5}.cdx-loader{position:relative;border:1px solid rgba(201,201,204,.48)}.cdx-loader:before{content:"";position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-11px 0 0 -11px;border:2px solid rgba(201,201,204,.48);border-left-color:#388ae5;border-radius:50%;-webkit-animation:cdxRotation 1.2s linear infinite;animation:cdxRotation 1.2s linear infinite}@-webkit-keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}@keyframes cdxRotation{0%{-webkit-transform:rotate(0deg);transform:rotate(0deg)}to{-webkit-transform:rotate(1turn);transform:rotate(1turn)}}.cdx-button{padding:13px;border-radius:3px;border:1px solid rgba(201,201,204,.48);font-size:14.9px;background:#fff;-webkit-box-shadow:0 2px 2px 0 rgba(18,30,57,.04);box-shadow:0 2px 2px 0 rgba(18,30,57,.04);color:#707684;text-align:center;cursor:pointer}.cdx-button:hover{background:#fbfcfe;-webkit-box-shadow:0 1px 3px 0 rgba(18,30,57,.08);box-shadow:0 1px 3px 0 rgba(18,30,57,.08)}.cdx-button svg{height:20px;margin-right:.2em;margin-top:-2px}.ce-stub{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-align:center;-ms-flex-align:center;align-items:center;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;width:100%;padding:3.5em 0;margin:17px 0;border-radius:3px;background:#fcf7f7;color:#b46262}.ce-stub__info{margin-left:20px}.ce-stub__title{margin-bottom:3px;font-weight:600;font-size:18px;text-transform:capitalize}.ce-stub__subtitle{font-size:16px}.codex-editor.codex-editor--rtl{direction:rtl}.codex-editor.codex-editor--rtl .cdx-list{padding-left:0;padding-right:40px}.codex-editor.codex-editor--rtl .ce-toolbar__plus{right:-34px;left:auto}.codex-editor.codex-editor--rtl .ce-toolbar__actions{right:auto;left:-34px}@media (max-width:650px){.codex-editor.codex-editor--rtl .ce-toolbar__actions{margin-left:0;margin-right:auto;padding-right:0;padding-left:10px}}.codex-editor.codex-editor--rtl .ce-settings{left:5px;right:auto}.codex-editor.codex-editor--rtl .ce-settings:before{right:auto;left:25px}.codex-editor.codex-editor--rtl .ce-settings__button:not(:nth-child(3n+3)){margin-left:3px;margin-right:0}.codex-editor.codex-editor--rtl .ce-conversion-tool__icon{margin-right:0;margin-left:10px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown{border-right:0 solid transparent;border-left:1px solid rgba(201,201,204,.48);margin:0 -6px 0 6px}.codex-editor.codex-editor--rtl .ce-inline-toolbar__dropdown .icon--toggler-down{margin-left:0;margin-right:4px}@media (min-width:651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__plus{left:0;right:5px}}@media (min-width:651px){.codex-editor--narrow.codex-editor--rtl .ce-toolbar__actions{left:-5px}}'},function(t,e,n){"use strict";n.r(e),n.d(e,"nanoid",(function(){return s})),n.d(e,"customAlphabet",(function(){return a})),n.d(e,"customRandom",(function(){return i})),n.d(e,"urlAlphabet",(function(){return o})),n.d(e,"random",(function(){return r}));let o="ModuleSymbhasOwnPr-0123456789ABCDEFGHNRVfgctiUvz_KqYTJkLxpZXIjQW";let r=t=>crypto.getRandomValues(new Uint8Array(t)),i=(t,e,n)=>{let o=(2<<Math.log(t.length-1)/Math.LN2)-1,r=-~(1.6*o*e/t.length);return()=>{let i="";for(;;){let a=n(r),s=r;for(;s--;)if(i+=t[a[s]&o]||"",i.length===e)return i}}},a=(t,e)=>i(t,e,r),s=(t=21)=>{let e="",n=crypto.getRandomValues(new Uint8Array(t));for(;t--;){let o=63&n[t];e+=o<36?o.toString(36):o<62?(o-26).toString(36).toUpperCase():o<63?"_":"-"}return e}}])}));

/***/ }),

/***/ 94915:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/**
 * @fileoverview ES7 async wrapper for the csv package.
 */



const csv = __webpack_require__(44679);

class CsvAsync {
  /**
   * @param {object} [options]
   * @param {number} options.seed
   * @param {number} options.columns
   * @param {number} options.length
   */
  static generate(options) {
    return new Promise((resolve, reject) => {
      const callback = (error, output) =>
        error
          ? reject(error)
          : resolve(output);

      options
        ? csv.generate(options, callback)
        : csv.generate(callback);
    });
  }

  /**
   * Parses a CSV file into an array of rows.
   * @param {string} input
   * @param {object} [options]
   */
  static parse(input, options) {
    return new Promise((resolve, reject) => {
      const callback = (error, output) =>
        error
          ? reject(error)
          : resolve(output);

      options
        ? csv.parse(input, options, callback)
        : csv.parse(input, callback);
    });
  }

  /**
   *
   * @param {string[][]} data
   * @param {function} handler
   * @param {object} [options]
   */
  static transform(data, handler, options) {
    return new Promise((resolve, reject) => {
      const callback = (error, output) =>
        error
          ? reject(error)
          : resolve(output);

      options
        ? csv.transform(data, handler, options, callback)
        : csv.transform(data, handler, callback);
    });
  }

  /**
   *
   * @param {string[][]} data
   * @param {object} options
   */
  static stringify(data, options) {
    return new Promise((resolve, reject) => {
      const callback = (error, output) =>
        error
          ? reject(error)
          : resolve(output);

      options
        ? csv.stringify(data, options, callback)
        : csv.stringify(data, callback);
    });
  }
}

module.exports = CsvAsync;


/***/ }),

/***/ 78959:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/*
CSV Generate - main module

Please look at the [project documentation](https://csv.js.org/generate/) for
additional information.
*/

const stream = __webpack_require__(12781)
const util = __webpack_require__(73837)

module.exports = function(){
  let options
  let callback
  if(arguments.length === 2){
    options = arguments[0]
    callback = arguments[1]
  }else if(arguments.length === 1){
    if(typeof arguments[0] === 'function'){
      options = {}
      callback = arguments[0]
    }else{
      options = arguments[0]
    }
  }else if(arguments.length === 0){
    options = {}
  }
  const generator = new Generator(options)
  if(callback){
    const data = []
    generator.on('readable', function(){
      let d; while(d = generator.read()){
        data.push(d)
      }
    })
    generator.on('error', callback)
    generator.on('end', function(){
      if(generator.options.objectMode){
        callback(null, data)
      }else{
        if(generator.options.encoding){
          callback(null, data.join(''))
        }else{
          callback(null, Buffer.concat(data))
        }
      }
    })
  }
  return generator
}

Generator = function(options = {}){
  // Convert Stream Readable options if underscored
  if(options.high_water_mark){
    options.highWaterMark = options.high_water_mark
  }
  if(options.object_mode){
    options.objectMode = options.object_mode
  }
  // Call parent constructor
  stream.Readable.call(this, options)
  // Clone and camelize options
  this.options = {}
  for(let k in options){
    this.options[Generator.camelize(k)] = options[k]
  }
  // Normalize options
  const dft = {
    columns: 8,
    delimiter: ',',
    duration: null,
    encoding: null,
    end: null,
    eof: false,
    fixedSize: false,
    length: -1,
    maxWordLength: 16,
    rowDelimiter: '\n',
    seed: false,
    sleep: 0,
  }
  for(const k in dft){
    if(this.options[k] === undefined){
      this.options[k] = dft[k]
    }
  }
  // Default values
  if(this.options.eof === true){
    this.options.eof = this.options.rowDelimiter
  }
  // State
  this._ = {
    start_time: this.options.duration ? Date.now() : null,
    fixed_size_buffer: '',
    count_written: 0,
    count_created: 0,
  }
  if(typeof this.options.columns === 'number'){
    this.options.columns = new Array(this.options.columns)
  }
  const accepted_header_types = Object.keys(Generator).filter( (t) => ( !['super_', 'camelize'].includes(t) ))
  for(let i = 0; i < this.options.columns.length; i++){
    const v = this.options.columns[i] || 'ascii'
    if(typeof v === 'string'){
      if(!accepted_header_types.includes(v)){
        throw Error(`Invalid column type: got "${v}", default values are ${JSON.stringify(accepted_header_types)}`)
      }
      this.options.columns[i] = Generator[v]
    }
  }
  return this
}
util.inherits(Generator, stream.Readable)
// Export the class
module.exports.Generator = Generator
// Generate a random number between 0 and 1 with 2 decimals. The function is idempotent if it detect the "seed" option.
Generator.prototype.random = function(){
  if(this.options.seed){
    return this.options.seed = this.options.seed * Math.PI * 100 % 100 / 100
  }else{
    return Math.random()
  }
}
// Stop the generation.
Generator.prototype.end = function(){
  this.push(null)
}
// Put new data into the read queue.
Generator.prototype._read = function(size){
  // Already started
  const data = []
  let length = this._.fixed_size_buffer.length
  if(length !== 0){
    data.push(this._.fixed_size_buffer)
  }
  while(true){
    // Time for some rest: flush first and stop later
    if( (this._.count_created === this.options.length) || (this.options.end && Date.now() > this.options.end) || (this.options.duration && Date.now() > this._.start_time + this.options.duration) ){
      // Flush
      if(data.length){
        if(this.options.objectMode){
          for(const line of data){
            this.__push(line)
          }
        }else{
          this.__push(data.join('') + (this.options.eof ? this.options.eof : ''))
        }
      }
      // Stop
      return this.push(null)
    }
    // Create the line
    let line = []
    let lineLength
    this.options.columns.forEach((fn) => {
      line.push(fn(this))
    })
    // for(const header in this.options.columns){
    //   // Create the field
    //   line.push(header(this))
    // }
    // Obtain line length
    if(this.options.objectMode){
      lineLength = 0
      for(const column of line)
        lineLength += column.length
    }else{
      // Stringify the line
      line = (this._.count_created === 0 ? '' : this.options.rowDelimiter)+line.join(this.options.delimiter)
      lineLength = line.length
    }
    this._.count_created++
    if(length + lineLength > size){
      if(this.options.objectMode){
        data.push(line)
        for(const line of data){
          this.__push(line)
        }
      }else{
        if(this.options.fixedSize){
          this._.fixed_size_buffer = line.substr(size - length)
          data.push(line.substr(0, size - length))
        }else{
          data.push(line)
        }
        this.__push(data.join(''))
      }
      return
    }
    length += lineLength
    data.push(line)
  }
}
// Put new data into the read queue.
Generator.prototype.__push = function(record){
  this._.count_written++
  if(this.options.sleep > 0){
    setTimeout( () => {
      this.push(record)
    }, this.options.sleep)
  }else{
    this.push(record)
  }
}
// Generate an ASCII value.
Generator.ascii = function(gen){
  // Column
  const column = []
  const nb_chars = Math.ceil(gen.random() * gen.options.maxWordLength)
  for(let i=0; i<nb_chars; i++){
    const char = Math.floor(gen.random() * 32)
    column.push(String.fromCharCode(char + (char < 16 ? 65 : 97 - 16)))
  }
  return column.join('')
}
// Generate an integer value.
Generator.int = function(gen){
  return Math.floor(gen.random() * Math.pow(2, 52))
}
// Generate an boolean value.
Generator.bool = function(gen){
  return Math.floor(gen.random() * 2)
}
// Camelize option properties
Generator.camelize = function(str){
  return str.replace(/_([a-z])/gi, function(_, match, index){
    return match.toUpperCase()
  })
}


/***/ }),

/***/ 68884:
/***/ ((module) => {



class ResizeableBuffer{
  constructor(size=100){
    this.size = size
    this.length = 0
    this.buf = Buffer.alloc(size)
  }
  prepend(val){
    if(Buffer.isBuffer(val)){
      const length = this.length + val.length
      if(length >= this.size){
        this.resize()
        if(length >= this.size){
          throw Error('INVALID_BUFFER_STATE')
        }
      }
      const buf = this.buf
      this.buf = Buffer.alloc(this.size)
      val.copy(this.buf, 0)
      buf.copy(this.buf, val.length)
      this.length += val.length
    }else{
      const length = this.length++
      if(length === this.size){
        this.resize()
      }
      const buf = this.clone()
      this.buf[0] = val
      buf.copy(this.buf,1, 0, length)
    }
  }
  append(val){
    const length = this.length++
    if(length === this.size){
      this.resize()
    }
    this.buf[length] = val
  }
  clone(){
    return Buffer.from(this.buf.slice(0, this.length))
  }
  resize(){
    const length = this.length
    this.size = this.size * 2
    const buf = Buffer.alloc(this.size)
    this.buf.copy(buf,0, 0, length)
    this.buf = buf
  }
  toString(encoding){
    if(encoding){
      return this.buf.slice(0, this.length).toString(encoding)
    }else{
      return Uint8Array.prototype.slice.call(this.buf.slice(0, this.length))
    }
  }
  toJSON(){
    return this.toString('utf8')
  }
  reset(){
    this.length = 0
  }
}

module.exports = ResizeableBuffer


/***/ }),

/***/ 74875:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/*
CSV Parse

Please look at the [project documentation](https://csv.js.org/parse/) for
additional information.
*/

const { Transform } = __webpack_require__(12781)
const ResizeableBuffer = __webpack_require__(68884)

// white space characters
// https://en.wikipedia.org/wiki/Whitespace_character
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Character_Classes#Types
// \f\n\r\t\v\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\ufeff
const tab = 9
const nl = 10 // \n, 0x0A in hexadecimal, 10 in decimal
const np = 12
const cr = 13 // \r, 0x0D in hexadécimal, 13 in decimal
const space = 32
const boms = {
  // Note, the following are equals:
  // Buffer.from("\ufeff")
  // Buffer.from([239, 187, 191])
  // Buffer.from('EFBBBF', 'hex')
  'utf8': Buffer.from([239, 187, 191]),
  // Note, the following are equals:
  // Buffer.from "\ufeff", 'utf16le
  // Buffer.from([255, 254])
  'utf16le': Buffer.from([255, 254])
}

class Parser extends Transform {
  constructor(opts = {}){
    super({...{readableObjectMode: true}, ...opts, encoding: null})
    this.__originalOptions = opts
    this.__normalizeOptions(opts)
  }
  __normalizeOptions(opts){
    const options = {}
    // Merge with user options
    for(let opt in opts){
      options[underscore(opt)] = opts[opt]
    }
    // Normalize option `encoding`
    // Note: defined first because other options depends on it
    // to convert chars/strings into buffers.
    if(options.encoding === undefined || options.encoding === true){
      options.encoding = 'utf8'
    }else if(options.encoding === null || options.encoding === false){
      options.encoding = null
    }else if(typeof options.encoding !== 'string' && options.encoding !== null){
      throw new CsvError('CSV_INVALID_OPTION_ENCODING', [
        'Invalid option encoding:',
        'encoding must be a string or null to return a buffer,',
        `got ${JSON.stringify(options.encoding)}`
      ], options)
    }
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false
    }else if(options.bom !== true){
      throw new CsvError('CSV_INVALID_OPTION_BOM', [
        'Invalid option bom:', 'bom must be true,',
        `got ${JSON.stringify(options.bom)}`
      ], options)
    }
    // Normalize option `cast`
    let fnCastField = null
    if(options.cast === undefined || options.cast === null || options.cast === false || options.cast === ''){
      options.cast = undefined
    }else if(typeof options.cast === 'function'){
      fnCastField = options.cast
      options.cast = true
    }else if(options.cast !== true){
      throw new CsvError('CSV_INVALID_OPTION_CAST', [
        'Invalid option cast:', 'cast must be true or a function,',
        `got ${JSON.stringify(options.cast)}`
      ], options)
    }
    // Normalize option `cast_date`
    if(options.cast_date === undefined || options.cast_date === null || options.cast_date === false || options.cast_date === ''){
      options.cast_date = false
    }else if(options.cast_date === true){
      options.cast_date = function(value){
        const date = Date.parse(value)
        return !isNaN(date) ? new Date(date) : value
      }
    }else{
      throw new CsvError('CSV_INVALID_OPTION_CAST_DATE', [
        'Invalid option cast_date:', 'cast_date must be true or a function,',
        `got ${JSON.stringify(options.cast_date)}`
      ], options)
    }
    // Normalize option `columns`
    let fnFirstLineToHeaders = null
    if(options.columns === true){
      // Fields in the first line are converted as-is to columns
      fnFirstLineToHeaders = undefined
    }else if(typeof options.columns === 'function'){
      fnFirstLineToHeaders = options.columns
      options.columns = true
    }else if(Array.isArray(options.columns)){
      options.columns = normalizeColumnsArray(options.columns)
    }else if(options.columns === undefined || options.columns === null || options.columns === false){
      options.columns = false
    }else{
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS', [
        'Invalid option columns:',
        'expect an array, a function or true,',
        `got ${JSON.stringify(options.columns)}`
      ], options)
    }
    // Normalize option `columns_duplicates_to_array`
    if(options.columns_duplicates_to_array === undefined || options.columns_duplicates_to_array === null || options.columns_duplicates_to_array === false){
      options.columns_duplicates_to_array = false
    }else if(options.columns_duplicates_to_array !== true){
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', [
        'Invalid option columns_duplicates_to_array:',
        'expect an boolean,',
        `got ${JSON.stringify(options.columns_duplicates_to_array)}`
      ], options)
    }else if(options.columns === false){
      throw new CsvError('CSV_INVALID_OPTION_COLUMNS_DUPLICATES_TO_ARRAY', [
        'Invalid option columns_duplicates_to_array:',
        'the `columns` mode must be activated.'
      ], options)
    }
    // Normalize option `comment`
    if(options.comment === undefined || options.comment === null || options.comment === false || options.comment === ''){
      options.comment = null
    }else{
      if(typeof options.comment === 'string'){
        options.comment = Buffer.from(options.comment, options.encoding)
      }
      if(!Buffer.isBuffer(options.comment)){
        throw new CsvError('CSV_INVALID_OPTION_COMMENT', [
          'Invalid option comment:',
          'comment must be a buffer or a string,',
          `got ${JSON.stringify(options.comment)}`
        ], options)
      }
    }
    // Normalize option `delimiter`
    const delimiter_json = JSON.stringify(options.delimiter)
    if(!Array.isArray(options.delimiter)) options.delimiter = [options.delimiter]
    if(options.delimiter.length === 0){
      throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
        'Invalid option delimiter:',
        'delimiter must be a non empty string or buffer or array of string|buffer,',
        `got ${delimiter_json}`
      ], options)
    }
    options.delimiter = options.delimiter.map(function(delimiter){
      if(delimiter === undefined || delimiter === null || delimiter === false){
        return Buffer.from(',', options.encoding)
      }
      if(typeof delimiter === 'string'){
        delimiter = Buffer.from(delimiter, options.encoding)
      }
      if( !Buffer.isBuffer(delimiter) || delimiter.length === 0){
        throw new CsvError('CSV_INVALID_OPTION_DELIMITER', [
          'Invalid option delimiter:',
          'delimiter must be a non empty string or buffer or array of string|buffer,',
          `got ${delimiter_json}`
        ], options)
      }
      return delimiter
    })
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === true){
      options.escape = Buffer.from('"', options.encoding)
    }else if(typeof options.escape === 'string'){
      options.escape = Buffer.from(options.escape, options.encoding)
    }else if (options.escape === null || options.escape === false){
      options.escape = null
    }
    if(options.escape !== null){
      if(!Buffer.isBuffer(options.escape)){
        throw new Error(`Invalid Option: escape must be a buffer, a string or a boolean, got ${JSON.stringify(options.escape)}`)
      }
    }
    // Normalize option `from`
    if(options.from === undefined || options.from === null){
      options.from = 1
    }else{
      if(typeof options.from === 'string' && /\d+/.test(options.from)){
        options.from = parseInt(options.from)
      }
      if(Number.isInteger(options.from)){
        if(options.from < 0){
          throw new Error(`Invalid Option: from must be a positive integer, got ${JSON.stringify(opts.from)}`)
        }
      }else{
        throw new Error(`Invalid Option: from must be an integer, got ${JSON.stringify(options.from)}`)
      }
    }
    // Normalize option `from_line`
    if(options.from_line === undefined || options.from_line === null){
      options.from_line = 1
    }else{
      if(typeof options.from_line === 'string' && /\d+/.test(options.from_line)){
        options.from_line = parseInt(options.from_line)
      }
      if(Number.isInteger(options.from_line)){
        if(options.from_line <= 0){
          throw new Error(`Invalid Option: from_line must be a positive integer greater than 0, got ${JSON.stringify(opts.from_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: from_line must be an integer, got ${JSON.stringify(opts.from_line)}`)
      }
    }
    // Normalize options `ignore_last_delimiters`
    if(options.ignore_last_delimiters === undefined || options.ignore_last_delimiters === null){
      options.ignore_last_delimiters = false
    }else if(typeof options.ignore_last_delimiters === 'number'){
      options.ignore_last_delimiters = Math.floor(options.ignore_last_delimiters)
      if(options.ignore_last_delimiters === 0){
        options.ignore_last_delimiters = false
      }
    }else if(typeof options.ignore_last_delimiters !== 'boolean'){
      throw new CsvError('CSV_INVALID_OPTION_IGNORE_LAST_DELIMITERS', [
        'Invalid option `ignore_last_delimiters`:',
        'the value must be a boolean value or an integer,',
        `got ${JSON.stringify(options.ignore_last_delimiters)}`
      ], options)
    }
    if(options.ignore_last_delimiters === true && options.columns === false){
      throw new CsvError('CSV_IGNORE_LAST_DELIMITERS_REQUIRES_COLUMNS', [
        'The option `ignore_last_delimiters`',
        'requires the activation of the `columns` option'
      ], options)
    }
    // Normalize option `info`
    if(options.info === undefined || options.info === null || options.info === false){
      options.info = false
    }else if(options.info !== true){
      throw new Error(`Invalid Option: info must be true, got ${JSON.stringify(options.info)}`)
    }
    // Normalize option `max_record_size`
    if(options.max_record_size === undefined || options.max_record_size === null || options.max_record_size === false){
      options.max_record_size = 0
    }else if(Number.isInteger(options.max_record_size) && options.max_record_size >= 0){
      // Great, nothing to do
    }else if(typeof options.max_record_size === 'string' && /\d+/.test(options.max_record_size)){
      options.max_record_size = parseInt(options.max_record_size)
    }else{
      throw new Error(`Invalid Option: max_record_size must be a positive integer, got ${JSON.stringify(options.max_record_size)}`)
    }
    // Normalize option `objname`
    if(options.objname === undefined || options.objname === null || options.objname === false){
      options.objname = undefined
    }else if(Buffer.isBuffer(options.objname)){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty buffer`)
      }
      if(options.encoding === null){
        // Don't call `toString`, leave objname as a buffer
      }else{
        options.objname = options.objname.toString(options.encoding)
      }
    }else if(typeof options.objname === 'string'){
      if(options.objname.length === 0){
        throw new Error(`Invalid Option: objname must be a non empty string`)
      }
      // Great, nothing to do
    }else{
      throw new Error(`Invalid Option: objname must be a string or a buffer, got ${options.objname}`)
    }
    // Normalize option `on_record`
    if(options.on_record === undefined || options.on_record === null){
      options.on_record = undefined
    }else if(typeof options.on_record !== 'function'){
      throw new CsvError('CSV_INVALID_OPTION_ON_RECORD', [
        'Invalid option `on_record`:',
        'expect a function,',
        `got ${JSON.stringify(options.on_record)}`
      ], options)
    }
    // Normalize option `quote`
    if(options.quote === null || options.quote === false || options.quote === ''){
      options.quote = null
    }else{
      if(options.quote === undefined || options.quote === true){
        options.quote = Buffer.from('"', options.encoding)
      }else if(typeof options.quote === 'string'){
        options.quote = Buffer.from(options.quote, options.encoding)
      }
      if(!Buffer.isBuffer(options.quote)){
        throw new Error(`Invalid Option: quote must be a buffer or a string, got ${JSON.stringify(options.quote)}`)
      }
    }
    // Normalize option `raw`
    if(options.raw === undefined || options.raw === null || options.raw === false){
      options.raw = false
    }else if(options.raw !== true){
      throw new Error(`Invalid Option: raw must be true, got ${JSON.stringify(options.raw)}`)
    }
    // Normalize option `record_delimiter`
    if(!options.record_delimiter){
      options.record_delimiter = []
    }else if(!Array.isArray(options.record_delimiter)){
      options.record_delimiter = [options.record_delimiter]
    }
    options.record_delimiter = options.record_delimiter.map( function(rd){
      if(typeof rd === 'string'){
        rd = Buffer.from(rd, options.encoding)
      }
      return rd
    })
    // Normalize option `relax`
    if(typeof options.relax === 'boolean'){
      // Great, nothing to do
    }else if(options.relax === undefined || options.relax === null){
      options.relax = false
    }else{
      throw new Error(`Invalid Option: relax must be a boolean, got ${JSON.stringify(options.relax)}`)
    }
    // Normalize option `relax_column_count`
    if(typeof options.relax_column_count === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count === undefined || options.relax_column_count === null){
      options.relax_column_count = false
    }else{
      throw new Error(`Invalid Option: relax_column_count must be a boolean, got ${JSON.stringify(options.relax_column_count)}`)
    }
    if(typeof options.relax_column_count_less === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_less === undefined || options.relax_column_count_less === null){
      options.relax_column_count_less = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_less must be a boolean, got ${JSON.stringify(options.relax_column_count_less)}`)
    }
    if(typeof options.relax_column_count_more === 'boolean'){
      // Great, nothing to do
    }else if(options.relax_column_count_more === undefined || options.relax_column_count_more === null){
      options.relax_column_count_more = false
    }else{
      throw new Error(`Invalid Option: relax_column_count_more must be a boolean, got ${JSON.stringify(options.relax_column_count_more)}`)
    }
    // Normalize option `skip_empty_lines`
    if(typeof options.skip_empty_lines === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_empty_lines === undefined || options.skip_empty_lines === null){
      options.skip_empty_lines = false
    }else{
      throw new Error(`Invalid Option: skip_empty_lines must be a boolean, got ${JSON.stringify(options.skip_empty_lines)}`)
    }
    // Normalize option `skip_lines_with_empty_values`
    if(typeof options.skip_lines_with_empty_values === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_empty_values === undefined || options.skip_lines_with_empty_values === null){
      options.skip_lines_with_empty_values = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_empty_values must be a boolean, got ${JSON.stringify(options.skip_lines_with_empty_values)}`)
    }
    // Normalize option `skip_lines_with_error`
    if(typeof options.skip_lines_with_error === 'boolean'){
      // Great, nothing to do
    }else if(options.skip_lines_with_error === undefined || options.skip_lines_with_error === null){
      options.skip_lines_with_error = false
    }else{
      throw new Error(`Invalid Option: skip_lines_with_error must be a boolean, got ${JSON.stringify(options.skip_lines_with_error)}`)
    }
    // Normalize option `rtrim`
    if(options.rtrim === undefined || options.rtrim === null || options.rtrim === false){
      options.rtrim = false
    }else if(options.rtrim !== true){
      throw new Error(`Invalid Option: rtrim must be a boolean, got ${JSON.stringify(options.rtrim)}`)
    }
    // Normalize option `ltrim`
    if(options.ltrim === undefined || options.ltrim === null || options.ltrim === false){
      options.ltrim = false
    }else if(options.ltrim !== true){
      throw new Error(`Invalid Option: ltrim must be a boolean, got ${JSON.stringify(options.ltrim)}`)
    }
    // Normalize option `trim`
    if(options.trim === undefined || options.trim === null || options.trim === false){
      options.trim = false
    }else if(options.trim !== true){
      throw new Error(`Invalid Option: trim must be a boolean, got ${JSON.stringify(options.trim)}`)
    }
    // Normalize options `trim`, `ltrim` and `rtrim`
    if(options.trim === true && opts.ltrim !== false){
      options.ltrim = true
    }else if(options.ltrim !== true){
      options.ltrim = false
    }
    if(options.trim === true && opts.rtrim !== false){
      options.rtrim = true
    }else if(options.rtrim !== true){
      options.rtrim = false
    }
    // Normalize option `to`
    if(options.to === undefined || options.to === null){
      options.to = -1
    }else{
      if(typeof options.to === 'string' && /\d+/.test(options.to)){
        options.to = parseInt(options.to)
      }
      if(Number.isInteger(options.to)){
        if(options.to <= 0){
          throw new Error(`Invalid Option: to must be a positive integer greater than 0, got ${JSON.stringify(opts.to)}`)
        }
      }else{
        throw new Error(`Invalid Option: to must be an integer, got ${JSON.stringify(opts.to)}`)
      }
    }
    // Normalize option `to_line`
    if(options.to_line === undefined || options.to_line === null){
      options.to_line = -1
    }else{
      if(typeof options.to_line === 'string' && /\d+/.test(options.to_line)){
        options.to_line = parseInt(options.to_line)
      }
      if(Number.isInteger(options.to_line)){
        if(options.to_line <= 0){
          throw new Error(`Invalid Option: to_line must be a positive integer greater than 0, got ${JSON.stringify(opts.to_line)}`)
        }
      }else{
        throw new Error(`Invalid Option: to_line must be an integer, got ${JSON.stringify(opts.to_line)}`)
      }
    }
    this.info = {
      bytes: 0,
      comment_lines: 0,
      empty_lines: 0,
      invalid_field_length: 0,
      lines: 1,
      records: 0
    }
    this.options = options
    this.state = {
      bomSkipped: false,
      bufBytesStart: 0,
      castField: fnCastField,
      commenting: false,
      // Current error encountered by a record
      error: undefined,
      enabled: options.from_line === 1,
      escaping: false,
      // escapeIsQuote: options.escape === options.quote,
      escapeIsQuote: Buffer.isBuffer(options.escape) && Buffer.isBuffer(options.quote) && Buffer.compare(options.escape, options.quote) === 0,
      // columns can be `false`, `true`, `Array`
      expectedRecordLength: Array.isArray(options.columns) ? options.columns.length : undefined,
      field: new ResizeableBuffer(20),
      firstLineToHeaders: fnFirstLineToHeaders,
      needMoreDataSize: Math.max(
        // Skip if the remaining buffer smaller than comment
        options.comment !== null ? options.comment.length : 0,
        // Skip if the remaining buffer can be delimiter
        ...options.delimiter.map( (delimiter) => delimiter.length),
        // Skip if the remaining buffer can be escape sequence
        options.quote !== null ? options.quote.length : 0,
      ),
      previousBuf: undefined,
      quoting: false,
      stop: false,
      rawBuffer: new ResizeableBuffer(100),
      record: [],
      recordHasError: false,
      record_length: 0,
      recordDelimiterMaxLength: options.record_delimiter.length === 0 ? 2 : Math.max(...options.record_delimiter.map( (v) => v.length)),
      trimChars: [Buffer.from(' ', options.encoding)[0], Buffer.from('\t', options.encoding)[0]],
      wasQuoting: false,
      wasRowDelimiter: false
    }
  }
  // Implementation of `Transform._transform`
  _transform(buf, encoding, callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(buf, false)
    if(err !== undefined){
      this.state.stop = true
    }
    callback(err)
  }
  // Implementation of `Transform._flush`
  _flush(callback){
    if(this.state.stop === true){
      return
    }
    const err = this.__parse(undefined, true)
    callback(err)
  }
  // Central parser implementation
  __parse(nextBuf, end){
    const {bom, comment, escape, from_line, ltrim, max_record_size, quote, raw, relax, rtrim, skip_empty_lines, to, to_line} = this.options
    let {record_delimiter} = this.options
    const {bomSkipped, previousBuf, rawBuffer, escapeIsQuote} = this.state
    let buf
    if(previousBuf === undefined){
      if(nextBuf === undefined){
        // Handle empty string
        this.push(null)
        return
      }else{
        buf = nextBuf
      }
    }else if(previousBuf !== undefined && nextBuf === undefined){
      buf = previousBuf
    }else{
      buf = Buffer.concat([previousBuf, nextBuf])
    }
    // Handle UTF BOM
    if(bomSkipped === false){
      if(bom === false){
        this.state.bomSkipped = true
      }else if(buf.length < 3){
        // No enough data
        if(end === false){
          // Wait for more data
          this.state.previousBuf = buf
          return
        }
      }else{
        for(let encoding in boms){
          if(boms[encoding].compare(buf, 0, boms[encoding].length) === 0){
            // Skip BOM
            let bomLength = boms[encoding].length
            this.state.bufBytesStart += bomLength
            buf = buf.slice(bomLength)
            // Renormalize original options with the new encoding
            this.__normalizeOptions({...this.__originalOptions, encoding: encoding})
            break
          }
        }
        this.state.bomSkipped = true
      }
    }
    const bufLen = buf.length
    let pos
    for(pos = 0; pos < bufLen; pos++){
      // Ensure we get enough space to look ahead
      // There should be a way to move this out of the loop
      if(this.__needMoreData(pos, bufLen, end)){
        break
      }
      if(this.state.wasRowDelimiter === true){
        this.info.lines++
        this.state.wasRowDelimiter = false
      }
      if(to_line !== -1 && this.info.lines > to_line){
        this.state.stop = true
        this.push(null)
        return
      }
      // Auto discovery of record_delimiter, unix, mac and windows supported
      if(this.state.quoting === false && record_delimiter.length === 0){
        const record_delimiterCount = this.__autoDiscoverRecordDelimiter(buf, pos)
        if(record_delimiterCount){
          record_delimiter = this.options.record_delimiter
        }
      }
      const chr = buf[pos]
      if(raw === true){
        rawBuffer.append(chr)
      }
      if((chr === cr || chr === nl) && this.state.wasRowDelimiter === false ){
        this.state.wasRowDelimiter = true
      }
      // Previous char was a valid escape char
      // treat the current char as a regular char
      if(this.state.escaping === true){
        this.state.escaping = false
      }else{
        // Escape is only active inside quoted fields
        // We are quoting, the char is an escape chr and there is a chr to escape
        // if(escape !== null && this.state.quoting === true && chr === escape && pos + 1 < bufLen){
        if(escape !== null && this.state.quoting === true && this.__isEscape(buf, pos, chr) && pos + escape.length < bufLen){
          if(escapeIsQuote){
            if(this.__isQuote(buf, pos+escape.length)){
              this.state.escaping = true
              pos += escape.length - 1
              continue
            }
          }else{
            this.state.escaping = true
            pos += escape.length - 1
            continue
          }
        }
        // Not currently escaping and chr is a quote
        // TODO: need to compare bytes instead of single char
        if(this.state.commenting === false && this.__isQuote(buf, pos)){
          if(this.state.quoting === true){
            const nextChr = buf[pos+quote.length]
            const isNextChrTrimable = rtrim && this.__isCharTrimable(nextChr)
            const isNextChrComment = comment !== null && this.__compareBytes(comment, buf, pos+quote.length, nextChr)
            const isNextChrDelimiter = this.__isDelimiter(buf, pos+quote.length, nextChr)
            const isNextChrRecordDelimiter = record_delimiter.length === 0 ? this.__autoDiscoverRecordDelimiter(buf, pos+quote.length) : this.__isRecordDelimiter(nextChr, buf, pos+quote.length)
            // Escape a quote
            // Treat next char as a regular character
            if(escape !== null && this.__isEscape(buf, pos, chr) && this.__isQuote(buf, pos + escape.length)){
              pos += escape.length - 1
            }else if(!nextChr || isNextChrDelimiter || isNextChrRecordDelimiter || isNextChrComment || isNextChrTrimable){
              this.state.quoting = false
              this.state.wasQuoting = true
              pos += quote.length - 1
              continue
            }else if(relax === false){
              const err = this.__error(
                new CsvError('CSV_INVALID_CLOSING_QUOTE', [
                  'Invalid Closing Quote:',
                  `got "${String.fromCharCode(nextChr)}"`,
                  `at line ${this.info.lines}`,
                  'instead of delimiter, record delimiter, trimable character',
                  '(if activated) or comment',
                ], this.options, this.__infoField())
              )
              if(err !== undefined) return err
            }else{
              this.state.quoting = false
              this.state.wasQuoting = true
              this.state.field.prepend(quote)
              pos += quote.length - 1
            }
          }else{
            if(this.state.field.length !== 0){
              // In relax mode, treat opening quote preceded by chrs as regular
              if( relax === false ){
                const err = this.__error(
                  new CsvError('INVALID_OPENING_QUOTE', [
                    'Invalid Opening Quote:',
                    `a quote is found inside a field at line ${this.info.lines}`,
                  ], this.options, this.__infoField(), {
                    field: this.state.field,
                  })
                )
                if(err !== undefined) return err
              }
            }else{
              this.state.quoting = true
              pos += quote.length - 1
              continue
            }
          }
        }
        if(this.state.quoting === false){
          let recordDelimiterLength = this.__isRecordDelimiter(chr, buf, pos)
          if(recordDelimiterLength !== 0){
            // Do not emit comments which take a full line
            const skipCommentLine = this.state.commenting && (this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0)
            if(skipCommentLine){
              this.info.comment_lines++
              // Skip full comment line
            }else{
              // Activate records emition if above from_line
              if(this.state.enabled === false && this.info.lines + (this.state.wasRowDelimiter === true ? 1: 0) >= from_line){
                this.state.enabled = true
                this.__resetField()
                this.__resetRecord()
                pos += recordDelimiterLength - 1
                continue
              }
              // Skip if line is empty and skip_empty_lines activated
              if(skip_empty_lines === true && this.state.wasQuoting === false && this.state.record.length === 0 && this.state.field.length === 0){
                this.info.empty_lines++
                pos += recordDelimiterLength - 1
                continue
              }
              this.info.bytes = this.state.bufBytesStart + pos;
              const errField = this.__onField()
              if(errField !== undefined) return errField
              this.info.bytes = this.state.bufBytesStart + pos + recordDelimiterLength;
              const errRecord = this.__onRecord()
              if(errRecord !== undefined) return errRecord
              if(to !== -1 && this.info.records >= to){
                this.state.stop = true
                this.push(null)
                return
              }
            }
            this.state.commenting = false
            pos += recordDelimiterLength - 1
            continue
          }
          if(this.state.commenting){
            continue
          }
          const commentCount = comment === null ? 0 : this.__compareBytes(comment, buf, pos, chr)
          if(commentCount !== 0){
            this.state.commenting = true
            continue
          }
          let delimiterLength = this.__isDelimiter(buf, pos, chr)
          if(delimiterLength !== 0){
            this.info.bytes = this.state.bufBytesStart + pos;
            const errField = this.__onField()
            if(errField !== undefined) return errField
            pos += delimiterLength - 1
            continue
          }
        }
      }
      if(this.state.commenting === false){
        if(max_record_size !== 0 && this.state.record_length + this.state.field.length > max_record_size){
          const err = this.__error(
            new CsvError('CSV_MAX_RECORD_SIZE', [
              'Max Record Size:',
              'record exceed the maximum number of tolerated bytes',
              `of ${max_record_size}`,
              `at line ${this.info.lines}`,
            ], this.options, this.__infoField())
          )
          if(err !== undefined) return err
        }
      }
      const lappend = ltrim === false || this.state.quoting === true || this.state.field.length !== 0 || !this.__isCharTrimable(chr)
      // rtrim in non quoting is handle in __onField
      const rappend = rtrim === false || this.state.wasQuoting === false
      if( lappend === true && rappend === true ){
        this.state.field.append(chr)
      }else if(rtrim === true && !this.__isCharTrimable(chr)){
        const err = this.__error(
          new CsvError('CSV_NON_TRIMABLE_CHAR_AFTER_CLOSING_QUOTE', [
            'Invalid Closing Quote:',
            'found non trimable byte after quote',
            `at line ${this.info.lines}`,
          ], this.options, this.__infoField())
        )
        if(err !== undefined) return err
      }
    }
    if(end === true){
      // Ensure we are not ending in a quoting state
      if(this.state.quoting === true){
        const err = this.__error(
          new CsvError('CSV_QUOTE_NOT_CLOSED', [
            'Quote Not Closed:',
            `the parsing is finished with an opening quote at line ${this.info.lines}`,
          ], this.options, this.__infoField())
        )
        if(err !== undefined) return err
      }else{
        // Skip last line if it has no characters
        if(this.state.wasQuoting === true || this.state.record.length !== 0 || this.state.field.length !== 0){
          this.info.bytes = this.state.bufBytesStart + pos;
          const errField = this.__onField()
          if(errField !== undefined) return errField
          const errRecord = this.__onRecord()
          if(errRecord !== undefined) return errRecord
        }else if(this.state.wasRowDelimiter === true){
          this.info.empty_lines++
        }else if(this.state.commenting === true){
          this.info.comment_lines++
        }
      }
    }else{
      this.state.bufBytesStart += pos
      this.state.previousBuf = buf.slice(pos)
    }
    if(this.state.wasRowDelimiter === true){
      this.info.lines++
      this.state.wasRowDelimiter = false
    }
  }
  __onRecord(){
    const {columns, columns_duplicates_to_array, encoding, info, from, relax_column_count, relax_column_count_less, relax_column_count_more, raw, skip_lines_with_empty_values} = this.options
    const {enabled, record} = this.state
    if(enabled === false){
      return this.__resetRecord()
    }
    // Convert the first line into column names
    const recordLength = record.length
    if(columns === true){
      if(skip_lines_with_empty_values === true && isRecordEmpty(record)){
        this.__resetRecord()
        return
      }
      return this.__firstLineToColumns(record)
    }
    if(columns === false && this.info.records === 0){
      this.state.expectedRecordLength = recordLength
    }
    if(recordLength !== this.state.expectedRecordLength){
      const err = columns === false ?
        // Todo: rename CSV_INCONSISTENT_RECORD_LENGTH to
        // CSV_RECORD_INCONSISTENT_FIELDS_LENGTH
        new CsvError('CSV_INCONSISTENT_RECORD_LENGTH', [
          'Invalid Record Length:',
          `expect ${this.state.expectedRecordLength},`,
          `got ${recordLength} on line ${this.info.lines}`,
        ], this.options, this.__infoField(), {
          record: record,
        })
      :
        // Todo: rename CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH to
        // CSV_RECORD_INCONSISTENT_COLUMNS
        new CsvError('CSV_RECORD_DONT_MATCH_COLUMNS_LENGTH', [
          'Invalid Record Length:',
          `columns length is ${columns.length},`, // rename columns
          `got ${recordLength} on line ${this.info.lines}`,
        ], this.options, this.__infoField(), {
          record: record,
        })
      if(relax_column_count === true ||
        (relax_column_count_less === true && recordLength < this.state.expectedRecordLength) ||
        (relax_column_count_more === true && recordLength > this.state.expectedRecordLength) ){
        this.info.invalid_field_length++
        this.state.error = err
      // Error is undefined with skip_lines_with_error
      }else{
        const finalErr = this.__error(err)
        if(finalErr) return finalErr
      }
    }
    if(skip_lines_with_empty_values === true && isRecordEmpty(record)){
      this.__resetRecord()
      return
    }
    if(this.state.recordHasError === true){
      this.__resetRecord()
      this.state.recordHasError = false
      return
    }
    this.info.records++
    if(from === 1 || this.info.records >= from){
      // With columns, records are object
      if(columns !== false){
        const obj = {}
        // Transform record array to an object
        for(let i = 0, l = record.length; i < l; i++){
          if(columns[i] === undefined || columns[i].disabled) continue
          // Turn duplicate columns into an array
          if (columns_duplicates_to_array === true && obj[columns[i].name] !== undefined) {
            if (Array.isArray(obj[columns[i].name])) {
              obj[columns[i].name] = obj[columns[i].name].concat(record[i])
            } else {
              obj[columns[i].name] = [obj[columns[i].name], record[i]]
            }
          } else {
            obj[columns[i].name] = record[i]
          }
        }
        const {objname} = this.options
        // Without objname (default)
        if(objname === undefined){
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: obj},
              (raw === true ? {raw: this.state.rawBuffer.toString(encoding)}: {}),
              (info === true ? {info: this.__infoRecord()}: {})
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push(obj)
            if(err){
              return err
            }
          }
        // With objname (default)
        }else{
          if(raw === true || info === true){
            const err = this.__push(Object.assign(
              {record: [obj[objname], obj]},
              raw === true ? {raw: this.state.rawBuffer.toString(encoding)}: {},
              info === true ? {info: this.__infoRecord()}: {}
            ))
            if(err){
              return err
            }
          }else{
            const err = this.__push([obj[objname], obj])
            if(err){
              return err
            }
          }
        }
      // Without columns, records are array
      }else{
        if(raw === true || info === true){
          const err = this.__push(Object.assign(
            {record: record},
            raw === true ? {raw: this.state.rawBuffer.toString(encoding)}: {},
            info === true ? {info: this.__infoRecord()}: {}
          ))
          if(err){
            return err
          }
        }else{
          const err = this.__push(record)
          if(err){
            return err
          }
        }
      }
    }
    this.__resetRecord()
  }
  __firstLineToColumns(record){
    const {firstLineToHeaders} = this.state
    try{
      const headers = firstLineToHeaders === undefined ? record : firstLineToHeaders.call(null, record)
      if(!Array.isArray(headers)){
        return this.__error(
          new CsvError('CSV_INVALID_COLUMN_MAPPING', [
            'Invalid Column Mapping:',
            'expect an array from column function,',
            `got ${JSON.stringify(headers)}`
          ], this.options, this.__infoField(), {
            headers: headers,
          })
        )
      }
      const normalizedHeaders = normalizeColumnsArray(headers)
      this.state.expectedRecordLength = normalizedHeaders.length
      this.options.columns = normalizedHeaders
      this.__resetRecord()
      return
    }catch(err){
      return err
    }
  }
  __resetRecord(){
    if(this.options.raw === true){
      this.state.rawBuffer.reset()
    }
    this.state.error = undefined
    this.state.record = []
    this.state.record_length = 0
  }
  __onField(){
    const {cast, encoding, rtrim, max_record_size} = this.options
    const {enabled, wasQuoting} = this.state
    // Short circuit for the from_line options
    if(enabled === false){
      return this.__resetField()
    }
    let field = this.state.field.toString(encoding)
    if(rtrim === true && wasQuoting === false){
      field = field.trimRight()
    }
    if(cast === true){
      const [err, f] = this.__cast(field)
      if(err !== undefined) return err
      field = f
    }
    this.state.record.push(field)
    // Increment record length if record size must not exceed a limit
    if(max_record_size !== 0 && typeof field === 'string'){
      this.state.record_length += field.length
    }
    this.__resetField()
  }
  __resetField(){
    this.state.field.reset()
    this.state.wasQuoting = false
  }
  __push(record){
    const {on_record} = this.options
    if(on_record !== undefined){
      const info = this.__infoRecord()
      try{
        record = on_record.call(null, record, info)
      }catch(err){
        return err
      }
      if(record === undefined || record === null){ return }
    }
    this.push(record)
  }
  // Return a tuple with the error and the casted value
  __cast(field){
    const {columns, relax_column_count} = this.options
    const isColumns = Array.isArray(columns)
    // Dont loose time calling cast
    // because the final record is an object
    // and this field can't be associated to a key present in columns
    if( isColumns === true && relax_column_count && this.options.columns.length <= this.state.record.length ){
      return [undefined, undefined]
    }
    if(this.state.castField !== null){
      try{
        const info = this.__infoField()
        return [undefined, this.state.castField.call(null, field, info)]
      }catch(err){
        return [err]
      }
    }
    if(this.__isFloat(field)){
      return [undefined, parseFloat(field)]
    }else if(this.options.cast_date !== false){
      const info = this.__infoField()
      return [undefined, this.options.cast_date.call(null, field, info)]
    }
    return [undefined, field]
  }
  // Helper to test if a character is a space or a line delimiter
  __isCharTrimable(chr){
    return chr === space || chr === tab || chr === cr || chr === nl || chr === np
  }
  // Keep it in case we implement the `cast_int` option
  // __isInt(value){
  //   // return Number.isInteger(parseInt(value))
  //   // return !isNaN( parseInt( obj ) );
  //   return /^(\-|\+)?[1-9][0-9]*$/.test(value)
  // }
  __isFloat(value){
    return (value - parseFloat( value ) + 1) >= 0 // Borrowed from jquery
  }
  __compareBytes(sourceBuf, targetBuf, targetPos, firstByte){
    if(sourceBuf[0] !== firstByte) return 0
    const sourceLength = sourceBuf.length
    for(let i = 1; i < sourceLength; i++){
      if(sourceBuf[i] !== targetBuf[targetPos+i]) return 0
    }
    return sourceLength
  }
  __needMoreData(i, bufLen, end){
    if(end) return false
    const {quote} = this.options
    const {quoting, needMoreDataSize, recordDelimiterMaxLength} = this.state
    const numOfCharLeft = bufLen - i - 1
    const requiredLength = Math.max(
      needMoreDataSize,
      // Skip if the remaining buffer smaller than record delimiter
      recordDelimiterMaxLength,
      // Skip if the remaining buffer can be record delimiter following the closing quote
      // 1 is for quote.length
      quoting ? (quote.length + recordDelimiterMaxLength) : 0,
    )
    return numOfCharLeft < requiredLength
  }
  __isDelimiter(buf, pos, chr){
    const {delimiter, ignore_last_delimiters} = this.options
    if(ignore_last_delimiters === true && this.state.record.length === this.options.columns.length - 1){
      return 0
    }else if(ignore_last_delimiters !== false && typeof ignore_last_delimiters === 'number' && this.state.record.length === ignore_last_delimiters - 1){
      return 0
    }
    loop1: for(let i = 0; i < delimiter.length; i++){
      const del = delimiter[i]
      if(del[0] === chr){
        for(let j = 1; j < del.length; j++){
          if(del[j] !== buf[pos+j]) continue loop1
        }
        return del.length
      }
    }
    return 0
  }
  __isRecordDelimiter(chr, buf, pos){
    const {record_delimiter} = this.options
    const recordDelimiterLength = record_delimiter.length
    loop1: for(let i = 0; i < recordDelimiterLength; i++){
      const rd = record_delimiter[i]
      const rdLength = rd.length
      if(rd[0] !== chr){
        continue
      }
      for(let j = 1; j < rdLength; j++){
        if(rd[j] !== buf[pos+j]){
          continue loop1
        }
      }
      return rd.length
    }
    return 0
  }
  __isEscape(buf, pos, chr){
    const {escape} = this.options
    if(escape === null) return false
    const l = escape.length
    if(escape[0] === chr){
      for(let i = 0; i < l; i++){
        if(escape[i] !== buf[pos+i]){
          return false
        }
      }
      return true
    }
    return false
  }
  __isQuote(buf, pos){
    const {quote} = this.options
    if(quote === null) return false
    const l = quote.length
    for(let i = 0; i < l; i++){
      if(quote[i] !== buf[pos+i]){
        return false
      }
    }
    return true
  }
  __autoDiscoverRecordDelimiter(buf, pos){
    const {encoding} = this.options
    const chr = buf[pos]
    if(chr === cr){
      if(buf[pos+1] === nl){
        this.options.record_delimiter.push(Buffer.from('\r\n', encoding))
        this.state.recordDelimiterMaxLength = 2
        return 2
      }else{
        this.options.record_delimiter.push(Buffer.from('\r', encoding))
        this.state.recordDelimiterMaxLength = 1
        return 1
      }
    }else if(chr === nl){
      this.options.record_delimiter.push(Buffer.from('\n', encoding))
      this.state.recordDelimiterMaxLength = 1
      return 1
    }
    return 0
  }
  __error(msg){
    const {skip_lines_with_error} = this.options
    const err = typeof msg === 'string' ? new Error(msg) : msg
    if(skip_lines_with_error){
      this.state.recordHasError = true
      this.emit('skip', err)
      return undefined
    }else{
      return err
    }
  }
  __infoDataSet(){
    return {
      ...this.info,
      columns: this.options.columns
    }
  }
  __infoRecord(){
    const {columns} = this.options
    return {
      ...this.__infoDataSet(),
      error: this.state.error,
      header: columns === true,
      index: this.state.record.length,
    }
  }
  __infoField(){
    const {columns} = this.options
    const isColumns = Array.isArray(columns)
    return {
      ...this.__infoRecord(),
      column: isColumns === true ?
        ( columns.length > this.state.record.length ?
          columns[this.state.record.length].name :
          null
        ) :
        this.state.record.length,
      quoting: this.state.wasQuoting,
    }
  }
}

const parse = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (typeof argument === 'string' || Buffer.isBuffer(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ], options || {})
    }
  }
  const parser = new Parser(options)
  if(callback){
    const records = options === undefined || options.objname === undefined ? [] : {}
    parser.on('readable', function(){
      let record
      while((record = this.read()) !== null){
        if(options === undefined || options.objname === undefined){
          records.push(record)
        }else{
          records[record[0]] = record[1]
        }
      }
    })
    parser.on('error', function(err){
      callback(err, undefined, parser.__infoDataSet())
    })
    parser.on('end', function(){
      callback(undefined, records, parser.__infoDataSet())
    })
  }
  if(data !== undefined){
    // Give a chance for events to be registered later
    if(typeof setImmediate === 'function'){
      setImmediate(function(){
        parser.write(data)
        parser.end()
      })
    }else{
      parser.write(data)
      parser.end()
    }
  }
  return parser
}

class CsvError extends Error {
  constructor(code, message, options, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ')
    super(message)
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError)
    }
    this.code = code
    for(const context of contexts){
      for(const key in context){
        const value = context[key]
        this[key] = Buffer.isBuffer(value) ? value.toString(options.encoding) : value == null ? value : JSON.parse(JSON.stringify(value))
      }
    }
  }
}

parse.Parser = Parser

parse.CsvError = CsvError

module.exports = parse

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase()
  })
}

const isObject = function(obj){
  return (typeof obj === 'object' && obj !== null && !Array.isArray(obj))
}

const isRecordEmpty = function(record){
  return record.every( (field) => field == null || field.toString && field.toString().trim() === '' )
}

const normalizeColumnsArray = function(columns){
  const normalizedColumns = [];
  for(let i = 0, l = columns.length; i < l; i++){
    const column = columns[i]
    if(column === undefined || column === null || column === false){
      normalizedColumns[i] = { disabled: true }
    }else if(typeof column === 'string'){
      normalizedColumns[i] = { name: column }
    }else if(isObject(column)){
      if(typeof column.name !== 'string'){
        throw new CsvError('CSV_OPTION_COLUMNS_MISSING_NAME', [
          'Option columns missing name:',
          `property "name" is required at position ${i}`,
          'when column is an object literal'
        ])
      }
      normalizedColumns[i] = column
    }else{
      throw new CsvError('CSV_INVALID_COLUMN_DEFINITION', [
        'Invalid column definition:',
        'expect a string or a literal object,',
        `got ${JSON.stringify(column)} at position ${i}`
      ])
    }
  }
  return normalizedColumns;
}


/***/ }),

/***/ 79168:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


/*
CSV Stringify

Please look at the [project documentation](https://csv.js.org/stringify/) for
additional information.
*/

const { Transform } = __webpack_require__(12781)
const bom_utf8 = Buffer.from([239, 187, 191])

class Stringifier extends Transform {
  constructor(opts = {}){
    super({...{writableObjectMode: true}, ...opts})
    const options = {}
    let err
    // Merge with user options
    for(let opt in opts){
      options[underscore(opt)] = opts[opt]
    }
    if(err = this.normalize(options)) throw err
    switch(options.record_delimiter){
      case 'auto':
        options.record_delimiter = null
        break
      case 'unix':
        options.record_delimiter = "\n"
        break
      case 'mac':
        options.record_delimiter = "\r"
        break
      case 'windows':
        options.record_delimiter = "\r\n"
        break
      case 'ascii':
        options.record_delimiter = "\u001e"
        break
      case 'unicode':
        options.record_delimiter = "\u2028"
        break
    }
    // Expose options
    this.options = options
    // Internal state
    this.state = {
      stop: false
    }
    // Information
    this.info = {
      records: 0
    }
  }
  normalize(options){
    // Normalize option `bom`
    if(options.bom === undefined || options.bom === null || options.bom === false){
      options.bom = false
    }else if(options.bom !== true){
      return new CsvError('CSV_OPTION_BOOLEAN_INVALID_TYPE', [
        'option `bom` is optional and must be a boolean value,',
        `got ${JSON.stringify(options.bom)}`
      ])
    }
    // Normalize option `delimiter`
    if(options.delimiter === undefined || options.delimiter === null){
      options.delimiter = ','
    }else if(Buffer.isBuffer(options.delimiter)){
      options.delimiter = options.delimiter.toString()
    }else if(typeof options.delimiter !== 'string'){
      return new CsvError('CSV_OPTION_DELIMITER_INVALID_TYPE', [
        'option `delimiter` must be a buffer or a string,',
        `got ${JSON.stringify(options.delimiter)}`
      ])
    }
    // Normalize option `quote`
    if(options.quote === undefined || options.quote === null){
      options.quote = '"'
    }else if(options.quote === true){
      options.quote = '"'
    }else if(options.quote === false){
      options.quote = ''
    }else if (Buffer.isBuffer(options.quote)){
      options.quote = options.quote.toString()
    }else if(typeof options.quote !== 'string'){
      return new CsvError('CSV_OPTION_QUOTE_INVALID_TYPE', [
        'option `quote` must be a boolean, a buffer or a string,',
        `got ${JSON.stringify(options.quote)}`
      ])
    }
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false
    }else{
      // todo
    }
    // Normalize option `quoted_empty`
    if(options.quoted_empty === undefined || options.quoted_empty === null){
      options.quoted_empty = undefined
    }else{
      // todo
    }
    // Normalize option `quoted_match`
    if(options.quoted_match === undefined || options.quoted_match === null || options.quoted_match === false){
      options.quoted_match = null
    }else if(!Array.isArray(options.quoted_match)){
      options.quoted_match = [options.quoted_match]
    }
    if(options.quoted_match){
      for(let quoted_match of options.quoted_match){
        const isString = typeof quoted_match === 'string'
        const isRegExp = quoted_match instanceof RegExp
        if(!isString && !isRegExp){
          return Error(`Invalid Option: quoted_match must be a string or a regex, got ${JSON.stringify(quoted_match)}`)
        }
      }
    }
    // Normalize option `quoted_string`
    if(options.quoted_string === undefined || options.quoted_string === null){
      options.quoted_string = false
    }else{
      // todo
    }
    // Normalize option `eof`
    if(options.eof === undefined || options.eof === null){
      options.eof = true
    }else{
      // todo
    }
    // Normalize option `escape`
    if(options.escape === undefined || options.escape === null){
      options.escape = '"'
    }else if(Buffer.isBuffer(options.escape)){
      options.escape = options.escape.toString()
    }else if(typeof options.escape !== 'string'){
      return Error(`Invalid Option: escape must be a buffer or a string, got ${JSON.stringify(options.escape)}`)
    }
    if (options.escape.length > 1){
      return Error(`Invalid Option: escape must be one character, got ${options.escape.length} characters`)
    }
    // Normalize option `header`
    if(options.header === undefined || options.header === null){
      options.header = false
    }else{
      // todo
    }
    // Normalize option `columns`
    options.columns = this.normalize_columns(options.columns)
    // Normalize option `quoted`
    if(options.quoted === undefined || options.quoted === null){
      options.quoted = false
    }else{
      // todo
    }
    // Normalize option `cast`
    if(options.cast === undefined || options.cast === null){
      options.cast = {}
    }else{
      // todo
    }
    // Normalize option cast.bigint
    if(options.cast.bigint === undefined || options.cast.bigint === null){
      // Cast boolean to string by default
      options.cast.bigint = value => '' + value
    }
    // Normalize option cast.boolean
    if(options.cast.boolean === undefined || options.cast.boolean === null){
      // Cast boolean to string by default
      options.cast.boolean = value => value ? '1' : ''
    }
    // Normalize option cast.date
    if(options.cast.date === undefined || options.cast.date === null){
      // Cast date to timestamp string by default
      options.cast.date = value => '' + value.getTime()
    }
    // Normalize option cast.number
    if(options.cast.number === undefined || options.cast.number === null){
      // Cast number to string using native casting by default
      options.cast.number = value => '' + value
    }
    // Normalize option cast.object
    if(options.cast.object === undefined || options.cast.object === null){
      // Stringify object as JSON by default
      options.cast.object = value => JSON.stringify(value)
    }
    // Normalize option cast.string
    if(options.cast.string === undefined || options.cast.string === null){
      // Leave string untouched
      options.cast.string = function(value){return value}
    }
    // Normalize option `record_delimiter`
    if(options.record_delimiter === undefined || options.record_delimiter === null){
      options.record_delimiter = '\n'
    }else if(Buffer.isBuffer(options.record_delimiter)){
      options.record_delimiter = options.record_delimiter.toString()
    }else if(typeof options.record_delimiter !== 'string'){
      return Error(`Invalid Option: record_delimiter must be a buffer or a string, got ${JSON.stringify(options.record_delimiter)}`)
    }
  }
  _transform(chunk, encoding, callback){
    if(this.state.stop === true){
      return
    }
    // Chunk validation
    if(!Array.isArray(chunk) && typeof chunk !== 'object'){
      this.state.stop = true
      return callback(Error(`Invalid Record: expect an array or an object, got ${JSON.stringify(chunk)}`))
    }
    // Detect columns from the first record
    if(this.info.records === 0){
      if(Array.isArray(chunk)){
        if(this.options.header === true && !this.options.columns){
          this.state.stop = true
          return callback(Error('Undiscoverable Columns: header option requires column option or object records'))
        }
      }else if(this.options.columns === undefined || this.options.columns === null){
        this.options.columns = this.normalize_columns(Object.keys(chunk))
      }
    }
    // Emit the header
    if(this.info.records === 0){
      this.bom()
      this.headers()
    }
    // Emit and stringify the record if an object or an array
    try{
      this.emit('record', chunk, this.info.records)
    }catch(err){
      this.state.stop = true
      return this.emit('error', err)
    }
    // Convert the record into a string
    let chunk_string
    if(this.options.eof){
      chunk_string = this.stringify(chunk)
      if(chunk_string === undefined){
        return
      }else{
        chunk_string = chunk_string + this.options.record_delimiter
      }
    }else{
      chunk_string = this.stringify(chunk)
      if(chunk_string === undefined){
        return
      }else{
        if(this.options.header || this.info.records){
          chunk_string = this.options.record_delimiter + chunk_string
        }
      }
    }
    // Emit the csv
    this.info.records++
    this.push(chunk_string)
    callback()
  }
  _flush(callback){
    if(this.info.records === 0){
      this.bom()
      this.headers()
    }
    callback()
  }
  stringify(chunk, chunkIsHeader=false){
    if(typeof chunk !== 'object'){
      return chunk
    }
    const {columns, header} = this.options
    const record = []
    // Record is an array
    if(Array.isArray(chunk)){
      // We are getting an array but the user has specified output columns. In
      // this case, we respect the columns indexes
      if(columns){
        chunk.splice(columns.length)
      }
      // Cast record elements
      for(let i=0; i<chunk.length; i++){
        const field = chunk[i]
        const [err, value] = this.__cast(field, {
          index: i, column: i, records: this.info.records, header: chunkIsHeader
        })
        if(err){
          this.emit('error', err)
          return
        }
        record[i] = [value, field]
      }
    // Record is a literal object
    }else{
      if(columns){
        for(let i=0; i<columns.length; i++){
          const field = get(chunk, columns[i].key)
          const [err, value] = this.__cast(field, {
            index: i, column: columns[i].key, records: this.info.records, header: chunkIsHeader
          })
          if(err){
            this.emit('error', err)
            return
          }
          record[i] = [value, field]
        }
      }else{
        for(let column of chunk){
          const field = chunk[column]
          const [err, value] = this.__cast(field, {
            index: i, column: columns[i].key, records: this.info.records, header: chunkIsHeader
          })
          if(err){
            this.emit('error', err)
            return
          }
          record.push([value, field])
        }
      }
    }
    let csvrecord = ''
    for(let i=0; i<record.length; i++){
      let options, err
      let [value, field] = record[i]
      if(typeof value === "string"){
        options = this.options
      }else if(isObject(value)){
        // let { value, ...options } = value
        options = value
        value = options.value
        delete options.value
        if(typeof value !== "string" && value !== undefined && value !== null){
          this.emit("error", Error(`Invalid Casting Value: returned value must return a string, null or undefined, got ${JSON.stringify(value)}`))
          return
        }
        options = {...this.options, ...options}
        if(err = this.normalize(options)){
          this.emit("error", err)
          return
        }
      }else if(value === undefined || value === null){
        options = this.options
      }else{
        this.emit("error", Error(`Invalid Casting Value: returned value must return a string, an object, null or undefined, got ${JSON.stringify(value)}`))
        return
      }
      const {delimiter, escape, quote, quoted, quoted_empty, quoted_string, quoted_match, record_delimiter} = options
      if(value){
        if(typeof value !== 'string'){
          this.emit("error", Error(`Formatter must return a string, null or undefined, got ${JSON.stringify(value)}`))
          return null
        }
        const containsdelimiter = delimiter.length && value.indexOf(delimiter) >= 0
        const containsQuote = (quote !== '') && value.indexOf(quote) >= 0
        const containsEscape = value.indexOf(escape) >= 0 && (escape !== quote)
        const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0
        const quotedString = quoted_string && typeof field === 'string'
        let quotedMatch = quoted_match && quoted_match.filter( quoted_match => {
          if(typeof quoted_match === 'string'){
            return value.indexOf(quoted_match) !== -1
          }else{
            return quoted_match.test(value)
          }
        })
        quotedMatch = quotedMatch && quotedMatch.length > 0
        const shouldQuote = containsQuote === true || containsdelimiter || containsRecordDelimiter || quoted || quotedString || quotedMatch
        if(shouldQuote === true && containsEscape === true){
          const regexp = escape === '\\'
          ? new RegExp(escape + escape, 'g')
          : new RegExp(escape, 'g')
          value = value.replace(regexp, escape + escape)
        }
        if(containsQuote === true){
          const regexp = new RegExp(quote,'g')
          value = value.replace(regexp, escape + quote)
        }
        if(shouldQuote === true){
          value = quote + value + quote
        }
        csvrecord += value
      }else if(quoted_empty === true || (field === '' && quoted_string === true && quoted_empty !== false)){
        csvrecord += quote + quote
      }
      if(i !== record.length - 1){
        csvrecord += delimiter
      }
    }
    return csvrecord
  }
  bom(){
    if(this.options.bom !== true){
      return
    }
    this.push(bom_utf8)
  }
  headers(){
    if(this.options.header === false){
      return
    }
    if(this.options.columns === undefined){
      return
    }
    let headers = this.options.columns.map(column => column.header)
    if(this.options.eof){
      headers = this.stringify(headers, true) + this.options.record_delimiter
    }else{
      headers = this.stringify(headers)
    }
    this.push(headers)
  }
  __cast(value, context){
    const type = typeof value
    try{
      if(type === 'string'){ // Fine for 99% of the cases
        return [undefined, this.options.cast.string(value, context)]
      }else if(type === 'bigint'){
        return [undefined, this.options.cast.bigint(value, context)]
      }else if(type === 'number'){
        return [undefined, this.options.cast.number(value, context)]
      }else if(type === 'boolean'){
        return [undefined, this.options.cast.boolean(value, context)]
      }else if(value instanceof Date){
        return [undefined, this.options.cast.date(value, context)]
      }else if(type === 'object' && value !== null){
        return [undefined, this.options.cast.object(value, context)]
      }else{
        return [undefined, value, value]
      }
    }catch(err){
      return [err]
    }
  }
  normalize_columns(columns){
    if(columns === undefined || columns === null){
      return undefined
    }
    if(typeof columns !== 'object'){
      throw Error('Invalid option "columns": expect an array or an object')
    }
    if(!Array.isArray(columns)){
      const newcolumns = []
      for(let k in columns){
        newcolumns.push({
          key: k,
          header: columns[k]
        })
      }
      columns = newcolumns
    }else{
      const newcolumns = []
      for(let column of columns){
        if(typeof column === 'string'){
          newcolumns.push({
            key: column,
            header: column
          })
        }else if(typeof column === 'object' && column !== undefined && !Array.isArray(column)){
          if(!column.key){
            throw Error('Invalid column definition: property "key" is required')
          }
          if(column.header === undefined){
            column.header = column.key
          }
          newcolumns.push(column)
        }else{
          throw Error('Invalid column definition: expect a string or an object')
        }
      }
      columns = newcolumns
    }
    return columns
  }
}

const stringify = function(){
  let data, options, callback
  for(let i in arguments){
    const argument = arguments[i]
    const type = typeof argument
    if(data === undefined && (Array.isArray(argument))){
      data = argument
    }else if(options === undefined && isObject(argument)){
      options = argument
    }else if(callback === undefined && type === 'function'){
      callback = argument
    }else{
      throw new CsvError('CSV_INVALID_ARGUMENT', [
        'Invalid argument:',
        `got ${JSON.stringify(argument)} at index ${i}`
      ])
    }
  }
  const stringifier = new Stringifier(options)
  if(callback){
    const chunks = []
    stringifier.on('readable', function(){
      let chunk
      while((chunk = this.read()) !== null){
        chunks.push(chunk)
      }
    })
    stringifier.on('error', function(err){
      callback(err)
    })
    stringifier.on('end', function(){
      callback(undefined, chunks.join(''))
    })
  }
  if(data !== undefined){
    // Give a chance for events to be registered later
    if(typeof setImmediate === 'function'){
      setImmediate(function(){
        for(let record of data){
          stringifier.write(record)
        }
        stringifier.end()
      })
    }else{
      for(let record of data){
        stringifier.write(record)
      }
      stringifier.end()
    }
  }
  return stringifier
}

class CsvError extends Error {
  constructor(code, message, ...contexts) {
    if(Array.isArray(message)) message = message.join(' ')
    super(message)
    if(Error.captureStackTrace !== undefined){
      Error.captureStackTrace(this, CsvError)
    }
    this.code = code
    for(const context of contexts){
      for(const key in context){
        const value = context[key]
        this[key] = Buffer.isBuffer(value) ? value.toString() : value == null ? value : JSON.parse(JSON.stringify(value))
      }
    }
  }
}

stringify.Stringifier = Stringifier

stringify.CsvError = CsvError

module.exports = stringify

const isObject = function(obj){
  return typeof obj === 'object' && obj !== null && ! Array.isArray(obj)
}

const underscore = function(str){
  return str.replace(/([A-Z])/g, function(_, match){
    return '_' + match.toLowerCase()
  })
}

// Lodash implementation of `get`

const charCodeOfDot = '.'.charCodeAt(0)
const reEscapeChar = /\\(\\)?/g
const rePropName = RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' + '|' +
  // Or match property names within brackets.
  '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' + '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
  ')\\]'+ '|' +
  // Or match "" as the space between consecutive dots or empty brackets.
  '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))'
, 'g')
const reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/
const reIsPlainProp = /^\w*$/
const getTag = function(value){
  if(!value)
    value === undefined ? '[object Undefined]' : '[object Null]'
  return Object.prototype.toString.call(value)
}
const isKey = function(value, object){
  if(Array.isArray(value)){
    return false
  }
  const type = typeof value
  if(type === 'number' || type === 'symbol' || type === 'boolean' || !value || isSymbol(value)){
    return true
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object))
}
const isSymbol = function(value){
  const type = typeof value
  return type === 'symbol' || (type === 'object' && value && getTag(value) === '[object Symbol]')
}
const stringToPath = function(string){
  const result = []
  if(string.charCodeAt(0) === charCodeOfDot){
    result.push('')
  }
  string.replace(rePropName, function(match, expression, quote, subString){
    let key = match
    if(quote){
      key = subString.replace(reEscapeChar, '$1')
    }else if(expression){
      key = expression.trim()
    }
    result.push(key)
  })
  return result
}
const castPath = function(value, object){
  if(Array.isArray(value)){
    return value
  } else {
    return isKey(value, object) ? [value] : stringToPath(value)
  }
}
const toKey = function(value){
  if(typeof value === 'string' || isSymbol(value))
    return value
  const result = `${value}`
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result
}
const get = function(object, path){
  path = castPath(path, object)
  let index = 0
  const length = path.length
  while(object != null && index < length){
    object = object[toKey(path[index++])]
  }
  return (index && index === length) ? object : undefined
}


/***/ }),

/***/ 44679:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// Alias to the ES6 modules exposing the stream and callback APIs

module.exports = {
  generate: __webpack_require__(78959),
  parse: __webpack_require__(74875),
  transform: __webpack_require__(40448),
  stringify: __webpack_require__(79168)
}


/***/ }),

/***/ 32722:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.attributeNames = exports.elementNames = void 0;
exports.elementNames = new Map([
    ["altglyph", "altGlyph"],
    ["altglyphdef", "altGlyphDef"],
    ["altglyphitem", "altGlyphItem"],
    ["animatecolor", "animateColor"],
    ["animatemotion", "animateMotion"],
    ["animatetransform", "animateTransform"],
    ["clippath", "clipPath"],
    ["feblend", "feBlend"],
    ["fecolormatrix", "feColorMatrix"],
    ["fecomponenttransfer", "feComponentTransfer"],
    ["fecomposite", "feComposite"],
    ["feconvolvematrix", "feConvolveMatrix"],
    ["fediffuselighting", "feDiffuseLighting"],
    ["fedisplacementmap", "feDisplacementMap"],
    ["fedistantlight", "feDistantLight"],
    ["fedropshadow", "feDropShadow"],
    ["feflood", "feFlood"],
    ["fefunca", "feFuncA"],
    ["fefuncb", "feFuncB"],
    ["fefuncg", "feFuncG"],
    ["fefuncr", "feFuncR"],
    ["fegaussianblur", "feGaussianBlur"],
    ["feimage", "feImage"],
    ["femerge", "feMerge"],
    ["femergenode", "feMergeNode"],
    ["femorphology", "feMorphology"],
    ["feoffset", "feOffset"],
    ["fepointlight", "fePointLight"],
    ["fespecularlighting", "feSpecularLighting"],
    ["fespotlight", "feSpotLight"],
    ["fetile", "feTile"],
    ["feturbulence", "feTurbulence"],
    ["foreignobject", "foreignObject"],
    ["glyphref", "glyphRef"],
    ["lineargradient", "linearGradient"],
    ["radialgradient", "radialGradient"],
    ["textpath", "textPath"],
]);
exports.attributeNames = new Map([
    ["definitionurl", "definitionURL"],
    ["attributename", "attributeName"],
    ["attributetype", "attributeType"],
    ["basefrequency", "baseFrequency"],
    ["baseprofile", "baseProfile"],
    ["calcmode", "calcMode"],
    ["clippathunits", "clipPathUnits"],
    ["diffuseconstant", "diffuseConstant"],
    ["edgemode", "edgeMode"],
    ["filterunits", "filterUnits"],
    ["glyphref", "glyphRef"],
    ["gradienttransform", "gradientTransform"],
    ["gradientunits", "gradientUnits"],
    ["kernelmatrix", "kernelMatrix"],
    ["kernelunitlength", "kernelUnitLength"],
    ["keypoints", "keyPoints"],
    ["keysplines", "keySplines"],
    ["keytimes", "keyTimes"],
    ["lengthadjust", "lengthAdjust"],
    ["limitingconeangle", "limitingConeAngle"],
    ["markerheight", "markerHeight"],
    ["markerunits", "markerUnits"],
    ["markerwidth", "markerWidth"],
    ["maskcontentunits", "maskContentUnits"],
    ["maskunits", "maskUnits"],
    ["numoctaves", "numOctaves"],
    ["pathlength", "pathLength"],
    ["patterncontentunits", "patternContentUnits"],
    ["patterntransform", "patternTransform"],
    ["patternunits", "patternUnits"],
    ["pointsatx", "pointsAtX"],
    ["pointsaty", "pointsAtY"],
    ["pointsatz", "pointsAtZ"],
    ["preservealpha", "preserveAlpha"],
    ["preserveaspectratio", "preserveAspectRatio"],
    ["primitiveunits", "primitiveUnits"],
    ["refx", "refX"],
    ["refy", "refY"],
    ["repeatcount", "repeatCount"],
    ["repeatdur", "repeatDur"],
    ["requiredextensions", "requiredExtensions"],
    ["requiredfeatures", "requiredFeatures"],
    ["specularconstant", "specularConstant"],
    ["specularexponent", "specularExponent"],
    ["spreadmethod", "spreadMethod"],
    ["startoffset", "startOffset"],
    ["stddeviation", "stdDeviation"],
    ["stitchtiles", "stitchTiles"],
    ["surfacescale", "surfaceScale"],
    ["systemlanguage", "systemLanguage"],
    ["tablevalues", "tableValues"],
    ["targetx", "targetX"],
    ["targety", "targetY"],
    ["textlength", "textLength"],
    ["viewbox", "viewBox"],
    ["viewtarget", "viewTarget"],
    ["xchannelselector", "xChannelSelector"],
    ["ychannelselector", "yChannelSelector"],
    ["zoomandpan", "zoomAndPan"],
]);


/***/ }),

/***/ 60698:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
/*
 * Module dependencies
 */
var ElementType = __importStar(__webpack_require__(76241));
var entities_1 = __webpack_require__(5213);
/**
 * Mixed-case SVG and MathML tags & attributes
 * recognized by the HTML parser.
 *
 * @see https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inforeign
 */
var foreignNames_1 = __webpack_require__(32722);
var unencodedElements = new Set([
    "style",
    "script",
    "xmp",
    "iframe",
    "noembed",
    "noframes",
    "plaintext",
    "noscript",
]);
/**
 * Format attributes
 */
function formatAttributes(attributes, opts) {
    if (!attributes)
        return;
    return Object.keys(attributes)
        .map(function (key) {
        var _a, _b;
        var value = (_a = attributes[key]) !== null && _a !== void 0 ? _a : "";
        if (opts.xmlMode === "foreign") {
            /* Fix up mixed-case attribute names */
            key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
        }
        if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
            return key;
        }
        return key + "=\"" + (opts.decodeEntities !== false
            ? entities_1.encodeXML(value)
            : value.replace(/"/g, "&quot;")) + "\"";
    })
        .join(" ");
}
/**
 * Self-enclosing tags
 */
var singleTag = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
/**
 * Renders a DOM node or an array of DOM nodes to a string.
 *
 * Can be thought of as the equivalent of the `outerHTML` of the passed node(s).
 *
 * @param node Node to be rendered.
 * @param options Changes serialization behavior
 */
function render(node, options) {
    if (options === void 0) { options = {}; }
    var nodes = "length" in node ? node : [node];
    var output = "";
    for (var i = 0; i < nodes.length; i++) {
        output += renderNode(nodes[i], options);
    }
    return output;
}
exports["default"] = render;
function renderNode(node, options) {
    switch (node.type) {
        case ElementType.Root:
            return render(node.children, options);
        case ElementType.Directive:
        case ElementType.Doctype:
            return renderDirective(node);
        case ElementType.Comment:
            return renderComment(node);
        case ElementType.CDATA:
            return renderCdata(node);
        case ElementType.Script:
        case ElementType.Style:
        case ElementType.Tag:
            return renderTag(node, options);
        case ElementType.Text:
            return renderText(node, options);
    }
}
var foreignModeIntegrationPoints = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title",
]);
var foreignElements = new Set(["svg", "math"]);
function renderTag(elem, opts) {
    var _a;
    // Handle SVG / MathML in HTML
    if (opts.xmlMode === "foreign") {
        /* Fix up mixed-case element names */
        elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
        /* Exit foreign mode at integration points */
        if (elem.parent &&
            foreignModeIntegrationPoints.has(elem.parent.name)) {
            opts = __assign(__assign({}, opts), { xmlMode: false });
        }
    }
    if (!opts.xmlMode && foreignElements.has(elem.name)) {
        opts = __assign(__assign({}, opts), { xmlMode: "foreign" });
    }
    var tag = "<" + elem.name;
    var attribs = formatAttributes(elem.attribs, opts);
    if (attribs) {
        tag += " " + attribs;
    }
    if (elem.children.length === 0 &&
        (opts.xmlMode
            ? // In XML mode or foreign mode, and user hasn't explicitly turned off self-closing tags
                opts.selfClosingTags !== false
            : // User explicitly asked for self-closing tags, even in HTML mode
                opts.selfClosingTags && singleTag.has(elem.name))) {
        if (!opts.xmlMode)
            tag += " ";
        tag += "/>";
    }
    else {
        tag += ">";
        if (elem.children.length > 0) {
            tag += render(elem.children, opts);
        }
        if (opts.xmlMode || !singleTag.has(elem.name)) {
            tag += "</" + elem.name + ">";
        }
    }
    return tag;
}
function renderDirective(elem) {
    return "<" + elem.data + ">";
}
function renderText(elem, opts) {
    var data = elem.data || "";
    // If entities weren't decoded, no need to encode them back
    if (opts.decodeEntities !== false &&
        !(!opts.xmlMode &&
            elem.parent &&
            unencodedElements.has(elem.parent.name))) {
        data = entities_1.encodeXML(data);
    }
    return data;
}
function renderCdata(elem) {
    return "<![CDATA[" + elem.children[0].data + "]]>";
}
function renderComment(elem) {
    return "<!--" + elem.data + "-->";
}


/***/ }),

/***/ 76241:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
/** Types of elements found in htmlparser2's DOM */
var ElementType;
(function (ElementType) {
    /** Type for the root element of a document */
    ElementType["Root"] = "root";
    /** Type for Text */
    ElementType["Text"] = "text";
    /** Type for <? ... ?> */
    ElementType["Directive"] = "directive";
    /** Type for <!-- ... --> */
    ElementType["Comment"] = "comment";
    /** Type for <script> tags */
    ElementType["Script"] = "script";
    /** Type for <style> tags */
    ElementType["Style"] = "style";
    /** Type for Any tag */
    ElementType["Tag"] = "tag";
    /** Type for <![CDATA[ ... ]]> */
    ElementType["CDATA"] = "cdata";
    /** Type for <!doctype ...> */
    ElementType["Doctype"] = "doctype";
})(ElementType = exports.ElementType || (exports.ElementType = {}));
/**
 * Tests whether an element is a tag or not.
 *
 * @param elem Element to test
 */
function isTag(elem) {
    return (elem.type === ElementType.Tag ||
        elem.type === ElementType.Script ||
        elem.type === ElementType.Style);
}
exports.isTag = isTag;
// Exports for backwards compatibility
/** Type for the root element of a document */
exports.Root = ElementType.Root;
/** Type for Text */
exports.Text = ElementType.Text;
/** Type for <? ... ?> */
exports.Directive = ElementType.Directive;
/** Type for <!-- ... --> */
exports.Comment = ElementType.Comment;
/** Type for <script> tags */
exports.Script = ElementType.Script;
/** Type for <style> tags */
exports.Style = ElementType.Style;
/** Type for Any tag */
exports.Tag = ElementType.Tag;
/** Type for <![CDATA[ ... ]]> */
exports.CDATA = ElementType.CDATA;
/** Type for <!doctype ...> */
exports.Doctype = ElementType.Doctype;


/***/ }),

/***/ 89641:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.DomHandler = void 0;
var domelementtype_1 = __webpack_require__(76241);
var node_1 = __webpack_require__(63617);
__exportStar(__webpack_require__(63617), exports);
var reWhitespace = /\s+/g;
// Default options
var defaultOpts = {
    normalizeWhitespace: false,
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false,
};
var DomHandler = /** @class */ (function () {
    /**
     * @param callback Called once parsing has completed.
     * @param options Settings for the handler.
     * @param elementCB Callback whenever a tag is closed.
     */
    function DomHandler(callback, options, elementCB) {
        /** The elements of the DOM */
        this.dom = [];
        /** The root element for the DOM */
        this.root = new node_1.Document(this.dom);
        /** Indicated whether parsing has been completed. */
        this.done = false;
        /** Stack of open tags. */
        this.tagStack = [this.root];
        /** A data node that is still being written to. */
        this.lastNode = null;
        /** Reference to the parser instance. Used for location information. */
        this.parser = null;
        // Make it possible to skip arguments, for backwards-compatibility
        if (typeof options === "function") {
            elementCB = options;
            options = defaultOpts;
        }
        if (typeof callback === "object") {
            options = callback;
            callback = undefined;
        }
        this.callback = callback !== null && callback !== void 0 ? callback : null;
        this.options = options !== null && options !== void 0 ? options : defaultOpts;
        this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler.prototype.onparserinit = function (parser) {
        this.parser = parser;
    };
    // Resets the handler back to starting state
    DomHandler.prototype.onreset = function () {
        this.dom = [];
        this.root = new node_1.Document(this.dom);
        this.done = false;
        this.tagStack = [this.root];
        this.lastNode = null;
        this.parser = null;
    };
    // Signals the handler that parsing is done
    DomHandler.prototype.onend = function () {
        if (this.done)
            return;
        this.done = true;
        this.parser = null;
        this.handleCallback(null);
    };
    DomHandler.prototype.onerror = function (error) {
        this.handleCallback(error);
    };
    DomHandler.prototype.onclosetag = function () {
        this.lastNode = null;
        var elem = this.tagStack.pop();
        if (this.options.withEndIndices) {
            elem.endIndex = this.parser.endIndex;
        }
        if (this.elementCB)
            this.elementCB(elem);
    };
    DomHandler.prototype.onopentag = function (name, attribs) {
        var type = this.options.xmlMode ? domelementtype_1.ElementType.Tag : undefined;
        var element = new node_1.Element(name, attribs, undefined, type);
        this.addNode(element);
        this.tagStack.push(element);
    };
    DomHandler.prototype.ontext = function (data) {
        var normalizeWhitespace = this.options.normalizeWhitespace;
        var lastNode = this.lastNode;
        if (lastNode && lastNode.type === domelementtype_1.ElementType.Text) {
            if (normalizeWhitespace) {
                lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
            }
            else {
                lastNode.data += data;
            }
            if (this.options.withEndIndices) {
                lastNode.endIndex = this.parser.endIndex;
            }
        }
        else {
            if (normalizeWhitespace) {
                data = data.replace(reWhitespace, " ");
            }
            var node = new node_1.Text(data);
            this.addNode(node);
            this.lastNode = node;
        }
    };
    DomHandler.prototype.oncomment = function (data) {
        if (this.lastNode && this.lastNode.type === domelementtype_1.ElementType.Comment) {
            this.lastNode.data += data;
            return;
        }
        var node = new node_1.Comment(data);
        this.addNode(node);
        this.lastNode = node;
    };
    DomHandler.prototype.oncommentend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.oncdatastart = function () {
        var text = new node_1.Text("");
        var node = new node_1.NodeWithChildren(domelementtype_1.ElementType.CDATA, [text]);
        this.addNode(node);
        text.parent = node;
        this.lastNode = text;
    };
    DomHandler.prototype.oncdataend = function () {
        this.lastNode = null;
    };
    DomHandler.prototype.onprocessinginstruction = function (name, data) {
        var node = new node_1.ProcessingInstruction(name, data);
        this.addNode(node);
    };
    DomHandler.prototype.handleCallback = function (error) {
        if (typeof this.callback === "function") {
            this.callback(error, this.dom);
        }
        else if (error) {
            throw error;
        }
    };
    DomHandler.prototype.addNode = function (node) {
        var parent = this.tagStack[this.tagStack.length - 1];
        var previousSibling = parent.children[parent.children.length - 1];
        if (this.options.withStartIndices) {
            node.startIndex = this.parser.startIndex;
        }
        if (this.options.withEndIndices) {
            node.endIndex = this.parser.endIndex;
        }
        parent.children.push(node);
        if (previousSibling) {
            node.prev = previousSibling;
            previousSibling.next = node;
        }
        node.parent = parent;
        this.lastNode = null;
    };
    return DomHandler;
}());
exports.DomHandler = DomHandler;
exports["default"] = DomHandler;


/***/ }),

/***/ 63617:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.cloneNode = exports.hasChildren = exports.isDocument = exports.isDirective = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = exports.Element = exports.Document = exports.NodeWithChildren = exports.ProcessingInstruction = exports.Comment = exports.Text = exports.DataNode = exports.Node = void 0;
var domelementtype_1 = __webpack_require__(76241);
var nodeTypes = new Map([
    [domelementtype_1.ElementType.Tag, 1],
    [domelementtype_1.ElementType.Script, 1],
    [domelementtype_1.ElementType.Style, 1],
    [domelementtype_1.ElementType.Directive, 1],
    [domelementtype_1.ElementType.Text, 3],
    [domelementtype_1.ElementType.CDATA, 4],
    [domelementtype_1.ElementType.Comment, 8],
    [domelementtype_1.ElementType.Root, 9],
]);
/**
 * This object will be used as the prototype for Nodes when creating a
 * DOM-Level-1-compliant structure.
 */
var Node = /** @class */ (function () {
    /**
     *
     * @param type The type of the node.
     */
    function Node(type) {
        this.type = type;
        /** Parent of the node */
        this.parent = null;
        /** Previous sibling */
        this.prev = null;
        /** Next sibling */
        this.next = null;
        /** The start index of the node. Requires `withStartIndices` on the handler to be `true. */
        this.startIndex = null;
        /** The end index of the node. Requires `withEndIndices` on the handler to be `true. */
        this.endIndex = null;
    }
    Object.defineProperty(Node.prototype, "nodeType", {
        // Read-only aliases
        /**
         * [DOM spec](https://dom.spec.whatwg.org/#dom-node-nodetype)-compatible
         * node {@link type}.
         */
        get: function () {
            var _a;
            return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "parentNode", {
        // Read-write aliases for properties
        /**
         * Same as {@link parent}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.parent;
        },
        set: function (parent) {
            this.parent = parent;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "previousSibling", {
        /**
         * Same as {@link prev}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.prev;
        },
        set: function (prev) {
            this.prev = prev;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Node.prototype, "nextSibling", {
        /**
         * Same as {@link next}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.next;
        },
        set: function (next) {
            this.next = next;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Clone this node, and optionally its children.
     *
     * @param recursive Clone child nodes as well.
     * @returns A clone of the node.
     */
    Node.prototype.cloneNode = function (recursive) {
        if (recursive === void 0) { recursive = false; }
        return cloneNode(this, recursive);
    };
    return Node;
}());
exports.Node = Node;
/**
 * A node that contains some data.
 */
var DataNode = /** @class */ (function (_super) {
    __extends(DataNode, _super);
    /**
     * @param type The type of the node
     * @param data The content of the data node
     */
    function DataNode(type, data) {
        var _this = _super.call(this, type) || this;
        _this.data = data;
        return _this;
    }
    Object.defineProperty(DataNode.prototype, "nodeValue", {
        /**
         * Same as {@link data}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.data;
        },
        set: function (data) {
            this.data = data;
        },
        enumerable: false,
        configurable: true
    });
    return DataNode;
}(Node));
exports.DataNode = DataNode;
/**
 * Text within the document.
 */
var Text = /** @class */ (function (_super) {
    __extends(Text, _super);
    function Text(data) {
        return _super.call(this, domelementtype_1.ElementType.Text, data) || this;
    }
    return Text;
}(DataNode));
exports.Text = Text;
/**
 * Comments within the document.
 */
var Comment = /** @class */ (function (_super) {
    __extends(Comment, _super);
    function Comment(data) {
        return _super.call(this, domelementtype_1.ElementType.Comment, data) || this;
    }
    return Comment;
}(DataNode));
exports.Comment = Comment;
/**
 * Processing instructions, including doc types.
 */
var ProcessingInstruction = /** @class */ (function (_super) {
    __extends(ProcessingInstruction, _super);
    function ProcessingInstruction(name, data) {
        var _this = _super.call(this, domelementtype_1.ElementType.Directive, data) || this;
        _this.name = name;
        return _this;
    }
    return ProcessingInstruction;
}(DataNode));
exports.ProcessingInstruction = ProcessingInstruction;
/**
 * A `Node` that can have children.
 */
var NodeWithChildren = /** @class */ (function (_super) {
    __extends(NodeWithChildren, _super);
    /**
     * @param type Type of the node.
     * @param children Children of the node. Only certain node types can have children.
     */
    function NodeWithChildren(type, children) {
        var _this = _super.call(this, type) || this;
        _this.children = children;
        return _this;
    }
    Object.defineProperty(NodeWithChildren.prototype, "firstChild", {
        // Aliases
        /** First child of the node. */
        get: function () {
            var _a;
            return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "lastChild", {
        /** Last child of the node. */
        get: function () {
            return this.children.length > 0
                ? this.children[this.children.length - 1]
                : null;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(NodeWithChildren.prototype, "childNodes", {
        /**
         * Same as {@link children}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.children;
        },
        set: function (children) {
            this.children = children;
        },
        enumerable: false,
        configurable: true
    });
    return NodeWithChildren;
}(Node));
exports.NodeWithChildren = NodeWithChildren;
/**
 * The root node of the document.
 */
var Document = /** @class */ (function (_super) {
    __extends(Document, _super);
    function Document(children) {
        return _super.call(this, domelementtype_1.ElementType.Root, children) || this;
    }
    return Document;
}(NodeWithChildren));
exports.Document = Document;
/**
 * An element within the DOM.
 */
var Element = /** @class */ (function (_super) {
    __extends(Element, _super);
    /**
     * @param name Name of the tag, eg. `div`, `span`.
     * @param attribs Object mapping attribute names to attribute values.
     * @param children Children of the node.
     */
    function Element(name, attribs, children, type) {
        if (children === void 0) { children = []; }
        if (type === void 0) { type = name === "script"
            ? domelementtype_1.ElementType.Script
            : name === "style"
                ? domelementtype_1.ElementType.Style
                : domelementtype_1.ElementType.Tag; }
        var _this = _super.call(this, type, children) || this;
        _this.name = name;
        _this.attribs = attribs;
        return _this;
    }
    Object.defineProperty(Element.prototype, "tagName", {
        // DOM Level 1 aliases
        /**
         * Same as {@link name}.
         * [DOM spec](https://dom.spec.whatwg.org)-compatible alias.
         */
        get: function () {
            return this.name;
        },
        set: function (name) {
            this.name = name;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Element.prototype, "attributes", {
        get: function () {
            var _this = this;
            return Object.keys(this.attribs).map(function (name) {
                var _a, _b;
                return ({
                    name: name,
                    value: _this.attribs[name],
                    namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
                    prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name],
                });
            });
        },
        enumerable: false,
        configurable: true
    });
    return Element;
}(NodeWithChildren));
exports.Element = Element;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `Element`, `false` otherwise.
 */
function isTag(node) {
    return (0, domelementtype_1.isTag)(node);
}
exports.isTag = isTag;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `CDATA`, `false` otherwise.
 */
function isCDATA(node) {
    return node.type === domelementtype_1.ElementType.CDATA;
}
exports.isCDATA = isCDATA;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Text`, `false` otherwise.
 */
function isText(node) {
    return node.type === domelementtype_1.ElementType.Text;
}
exports.isText = isText;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `Comment`, `false` otherwise.
 */
function isComment(node) {
    return node.type === domelementtype_1.ElementType.Comment;
}
exports.isComment = isComment;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDirective(node) {
    return node.type === domelementtype_1.ElementType.Directive;
}
exports.isDirective = isDirective;
/**
 * @param node Node to check.
 * @returns `true` if the node has the type `ProcessingInstruction`, `false` otherwise.
 */
function isDocument(node) {
    return node.type === domelementtype_1.ElementType.Root;
}
exports.isDocument = isDocument;
/**
 * @param node Node to check.
 * @returns `true` if the node is a `NodeWithChildren` (has children), `false` otherwise.
 */
function hasChildren(node) {
    return Object.prototype.hasOwnProperty.call(node, "children");
}
exports.hasChildren = hasChildren;
/**
 * Clone a node, and optionally its children.
 *
 * @param recursive Clone child nodes as well.
 * @returns A clone of the node.
 */
function cloneNode(node, recursive) {
    if (recursive === void 0) { recursive = false; }
    var result;
    if (isText(node)) {
        result = new Text(node.data);
    }
    else if (isComment(node)) {
        result = new Comment(node.data);
    }
    else if (isTag(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_1 = new Element(node.name, __assign({}, node.attribs), children);
        children.forEach(function (child) { return (child.parent = clone_1); });
        if (node.namespace != null) {
            clone_1.namespace = node.namespace;
        }
        if (node["x-attribsNamespace"]) {
            clone_1["x-attribsNamespace"] = __assign({}, node["x-attribsNamespace"]);
        }
        if (node["x-attribsPrefix"]) {
            clone_1["x-attribsPrefix"] = __assign({}, node["x-attribsPrefix"]);
        }
        result = clone_1;
    }
    else if (isCDATA(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_2 = new NodeWithChildren(domelementtype_1.ElementType.CDATA, children);
        children.forEach(function (child) { return (child.parent = clone_2); });
        result = clone_2;
    }
    else if (isDocument(node)) {
        var children = recursive ? cloneChildren(node.children) : [];
        var clone_3 = new Document(children);
        children.forEach(function (child) { return (child.parent = clone_3); });
        if (node["x-mode"]) {
            clone_3["x-mode"] = node["x-mode"];
        }
        result = clone_3;
    }
    else if (isDirective(node)) {
        var instruction = new ProcessingInstruction(node.name, node.data);
        if (node["x-name"] != null) {
            instruction["x-name"] = node["x-name"];
            instruction["x-publicId"] = node["x-publicId"];
            instruction["x-systemId"] = node["x-systemId"];
        }
        result = instruction;
    }
    else {
        throw new Error("Not implemented yet: ".concat(node.type));
    }
    result.startIndex = node.startIndex;
    result.endIndex = node.endIndex;
    if (node.sourceCodeLocation != null) {
        result.sourceCodeLocation = node.sourceCodeLocation;
    }
    return result;
}
exports.cloneNode = cloneNode;
function cloneChildren(childs) {
    var children = childs.map(function (child) { return cloneNode(child, true); });
    for (var i = 1; i < children.length; i++) {
        children[i].prev = children[i - 1];
        children[i - 1].next = children[i];
    }
    return children;
}


/***/ }),

/***/ 68134:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getFeed = void 0;
var stringify_1 = __webpack_require__(39682);
var legacy_1 = __webpack_require__(41670);
/**
 * Get the feed object from the root of a DOM tree.
 *
 * @param doc - The DOM to to extract the feed from.
 * @returns The feed.
 */
function getFeed(doc) {
    var feedRoot = getOneElement(isValidFeed, doc);
    return !feedRoot
        ? null
        : feedRoot.name === "feed"
            ? getAtomFeed(feedRoot)
            : getRssFeed(feedRoot);
}
exports.getFeed = getFeed;
/**
 * Parse an Atom feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getAtomFeed(feedRoot) {
    var _a;
    var childs = feedRoot.children;
    var feed = {
        type: "atom",
        items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function (item) {
            var _a;
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "id", children);
            addConditionally(entry, "title", "title", children);
            var href = (_a = getOneElement("link", children)) === null || _a === void 0 ? void 0 : _a.attribs.href;
            if (href) {
                entry.link = href;
            }
            var description = fetch("summary", children) || fetch("content", children);
            if (description) {
                entry.description = description;
            }
            var pubDate = fetch("updated", children);
            if (pubDate) {
                entry.pubDate = new Date(pubDate);
            }
            return entry;
        }),
    };
    addConditionally(feed, "id", "id", childs);
    addConditionally(feed, "title", "title", childs);
    var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
    if (href) {
        feed.link = href;
    }
    addConditionally(feed, "description", "subtitle", childs);
    var updated = fetch("updated", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "email", childs, true);
    return feed;
}
/**
 * Parse a RSS feed.
 *
 * @param feedRoot The root of the feed.
 * @returns The parsed feed.
 */
function getRssFeed(feedRoot) {
    var _a, _b;
    var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
    var feed = {
        type: feedRoot.name.substr(0, 3),
        id: "",
        items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function (item) {
            var children = item.children;
            var entry = { media: getMediaElements(children) };
            addConditionally(entry, "id", "guid", children);
            addConditionally(entry, "title", "title", children);
            addConditionally(entry, "link", "link", children);
            addConditionally(entry, "description", "description", children);
            var pubDate = fetch("pubDate", children);
            if (pubDate)
                entry.pubDate = new Date(pubDate);
            return entry;
        }),
    };
    addConditionally(feed, "title", "title", childs);
    addConditionally(feed, "link", "link", childs);
    addConditionally(feed, "description", "description", childs);
    var updated = fetch("lastBuildDate", childs);
    if (updated) {
        feed.updated = new Date(updated);
    }
    addConditionally(feed, "author", "managingEditor", childs, true);
    return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
    "fileSize",
    "bitrate",
    "framerate",
    "samplingrate",
    "channels",
    "duration",
    "height",
    "width",
];
/**
 * Get all media elements of a feed item.
 *
 * @param where Nodes to search in.
 * @returns Media elements.
 */
function getMediaElements(where) {
    return (0, legacy_1.getElementsByTagName)("media:content", where).map(function (elem) {
        var attribs = elem.attribs;
        var media = {
            medium: attribs.medium,
            isDefault: !!attribs.isDefault,
        };
        for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
            var attrib = MEDIA_KEYS_STRING_1[_i];
            if (attribs[attrib]) {
                media[attrib] = attribs[attrib];
            }
        }
        for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
            var attrib = MEDIA_KEYS_INT_1[_a];
            if (attribs[attrib]) {
                media[attrib] = parseInt(attribs[attrib], 10);
            }
        }
        if (attribs.expression) {
            media.expression =
                attribs.expression;
        }
        return media;
    });
}
/**
 * Get one element by tag name.
 *
 * @param tagName Tag name to look for
 * @param node Node to search in
 * @returns The element or null
 */
function getOneElement(tagName, node) {
    return (0, legacy_1.getElementsByTagName)(tagName, node, true, 1)[0];
}
/**
 * Get the text content of an element with a certain tag name.
 *
 * @param tagName Tag name to look for.
 * @param where  Node to search in.
 * @param recurse Whether to recurse into child nodes.
 * @returns The text content of the element.
 */
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
/**
 * Adds a property to an object if it has a value.
 *
 * @param obj Object to be extended
 * @param prop Property name
 * @param tagName Tag name that contains the conditionally added property
 * @param where Element to search for the property
 * @param recurse Whether to recurse into child nodes.
 */
function addConditionally(obj, prop, tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var val = fetch(tagName, where, recurse);
    if (val)
        obj[prop] = val;
}
/**
 * Checks if an element is a feed root node.
 *
 * @param value The name of the element to check.
 * @returns Whether an element is a feed root node.
 */
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}


/***/ }),

/***/ 633:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.uniqueSort = exports.compareDocumentPosition = exports.removeSubsets = void 0;
var domhandler_1 = __webpack_require__(89641);
/**
 * Given an array of nodes, remove any member that is contained by another.
 *
 * @param nodes Nodes to filter.
 * @returns Remaining nodes that aren't subtrees of each other.
 */
function removeSubsets(nodes) {
    var idx = nodes.length;
    /*
     * Check if each node (or one of its ancestors) is already contained in the
     * array.
     */
    while (--idx >= 0) {
        var node = nodes[idx];
        /*
         * Remove the node if it is not unique.
         * We are going through the array from the end, so we only
         * have to check nodes that preceed the node under consideration in the array.
         */
        if (idx > 0 && nodes.lastIndexOf(node, idx - 1) >= 0) {
            nodes.splice(idx, 1);
            continue;
        }
        for (var ancestor = node.parent; ancestor; ancestor = ancestor.parent) {
            if (nodes.includes(ancestor)) {
                nodes.splice(idx, 1);
                break;
            }
        }
    }
    return nodes;
}
exports.removeSubsets = removeSubsets;
/**
 * Compare the position of one node against another node in any other document.
 * The return value is a bitmask with the following values:
 *
 * Document order:
 * > There is an ordering, document order, defined on all the nodes in the
 * > document corresponding to the order in which the first character of the
 * > XML representation of each node occurs in the XML representation of the
 * > document after expansion of general entities. Thus, the document element
 * > node will be the first node. Element nodes occur before their children.
 * > Thus, document order orders element nodes in order of the occurrence of
 * > their start-tag in the XML (after expansion of entities). The attribute
 * > nodes of an element occur after the element and before its children. The
 * > relative order of attribute nodes is implementation-dependent./
 *
 * Source:
 * http://www.w3.org/TR/DOM-Level-3-Core/glossary.html#dt-document-order
 *
 * @param nodeA The first node to use in the comparison
 * @param nodeB The second node to use in the comparison
 * @returns A bitmask describing the input nodes' relative position.
 *
 * See http://dom.spec.whatwg.org/#dom-node-comparedocumentposition for
 * a description of these values.
 */
function compareDocumentPosition(nodeA, nodeB) {
    var aParents = [];
    var bParents = [];
    if (nodeA === nodeB) {
        return 0;
    }
    var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
    while (current) {
        aParents.unshift(current);
        current = current.parent;
    }
    current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
    while (current) {
        bParents.unshift(current);
        current = current.parent;
    }
    var maxIdx = Math.min(aParents.length, bParents.length);
    var idx = 0;
    while (idx < maxIdx && aParents[idx] === bParents[idx]) {
        idx++;
    }
    if (idx === 0) {
        return 1 /* DISCONNECTED */;
    }
    var sharedParent = aParents[idx - 1];
    var siblings = sharedParent.children;
    var aSibling = aParents[idx];
    var bSibling = bParents[idx];
    if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
        if (sharedParent === nodeB) {
            return 4 /* FOLLOWING */ | 16 /* CONTAINED_BY */;
        }
        return 4 /* FOLLOWING */;
    }
    if (sharedParent === nodeA) {
        return 2 /* PRECEDING */ | 8 /* CONTAINS */;
    }
    return 2 /* PRECEDING */;
}
exports.compareDocumentPosition = compareDocumentPosition;
/**
 * Sort an array of nodes based on their relative position in the document and
 * remove any duplicate nodes. If the array contains nodes that do not belong
 * to the same document, sort order is unspecified.
 *
 * @param nodes Array of DOM nodes.
 * @returns Collection of unique nodes, sorted in document order.
 */
function uniqueSort(nodes) {
    nodes = nodes.filter(function (node, i, arr) { return !arr.includes(node, i + 1); });
    nodes.sort(function (a, b) {
        var relative = compareDocumentPosition(a, b);
        if (relative & 2 /* PRECEDING */) {
            return -1;
        }
        else if (relative & 4 /* FOLLOWING */) {
            return 1;
        }
        return 0;
    });
    return nodes;
}
exports.uniqueSort = uniqueSort;


/***/ }),

/***/ 23774:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
__exportStar(__webpack_require__(39682), exports);
__exportStar(__webpack_require__(36210), exports);
__exportStar(__webpack_require__(52582), exports);
__exportStar(__webpack_require__(94935), exports);
__exportStar(__webpack_require__(41670), exports);
__exportStar(__webpack_require__(633), exports);
__exportStar(__webpack_require__(68134), exports);
/** @deprecated Use these methods from `domhandler` directly. */
var domhandler_1 = __webpack_require__(89641);
Object.defineProperty(exports, "isTag", ({ enumerable: true, get: function () { return domhandler_1.isTag; } }));
Object.defineProperty(exports, "isCDATA", ({ enumerable: true, get: function () { return domhandler_1.isCDATA; } }));
Object.defineProperty(exports, "isText", ({ enumerable: true, get: function () { return domhandler_1.isText; } }));
Object.defineProperty(exports, "isComment", ({ enumerable: true, get: function () { return domhandler_1.isComment; } }));
Object.defineProperty(exports, "isDocument", ({ enumerable: true, get: function () { return domhandler_1.isDocument; } }));
Object.defineProperty(exports, "hasChildren", ({ enumerable: true, get: function () { return domhandler_1.hasChildren; } }));


/***/ }),

/***/ 41670:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getElementsByTagType = exports.getElementsByTagName = exports.getElementById = exports.getElements = exports.testElement = void 0;
var domhandler_1 = __webpack_require__(89641);
var querying_1 = __webpack_require__(94935);
var Checks = {
    tag_name: function (name) {
        if (typeof name === "function") {
            return function (elem) { return (0, domhandler_1.isTag)(elem) && name(elem.name); };
        }
        else if (name === "*") {
            return domhandler_1.isTag;
        }
        return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.name === name; };
    },
    tag_type: function (type) {
        if (typeof type === "function") {
            return function (elem) { return type(elem.type); };
        }
        return function (elem) { return elem.type === type; };
    },
    tag_contains: function (data) {
        if (typeof data === "function") {
            return function (elem) { return (0, domhandler_1.isText)(elem) && data(elem.data); };
        }
        return function (elem) { return (0, domhandler_1.isText)(elem) && elem.data === data; };
    },
};
/**
 * @param attrib Attribute to check.
 * @param value Attribute value to look for.
 * @returns A function to check whether the a node has an attribute with a particular value.
 */
function getAttribCheck(attrib, value) {
    if (typeof value === "function") {
        return function (elem) { return (0, domhandler_1.isTag)(elem) && value(elem.attribs[attrib]); };
    }
    return function (elem) { return (0, domhandler_1.isTag)(elem) && elem.attribs[attrib] === value; };
}
/**
 * @param a First function to combine.
 * @param b Second function to combine.
 * @returns A function taking a node and returning `true` if either
 * of the input functions returns `true` for the node.
 */
function combineFuncs(a, b) {
    return function (elem) { return a(elem) || b(elem); };
}
/**
 * @param options An object describing nodes to look for.
 * @returns A function executing all checks in `options` and returning `true`
 * if any of them match a node.
 */
function compileTest(options) {
    var funcs = Object.keys(options).map(function (key) {
        var value = options[key];
        return Object.prototype.hasOwnProperty.call(Checks, key)
            ? Checks[key](value)
            : getAttribCheck(key, value);
    });
    return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
/**
 * @param options An object describing nodes to look for.
 * @param node The element to test.
 * @returns Whether the element matches the description in `options`.
 */
function testElement(options, node) {
    var test = compileTest(options);
    return test ? test(node) : true;
}
exports.testElement = testElement;
/**
 * @param options An object describing nodes to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes that match `options`.
 */
function getElements(options, nodes, recurse, limit) {
    if (limit === void 0) { limit = Infinity; }
    var test = compileTest(options);
    return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
}
exports.getElements = getElements;
/**
 * @param id The unique ID attribute value to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @returns The node with the supplied ID.
 */
function getElementById(id, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    if (!Array.isArray(nodes))
        nodes = [nodes];
    return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
}
exports.getElementById = getElementById;
/**
 * @param tagName Tag name to search for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `tagName`.
 */
function getElementsByTagName(tagName, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
}
exports.getElementsByTagName = getElementsByTagName;
/**
 * @param type Element type to look for.
 * @param nodes Nodes to search through.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes with the supplied `type`.
 */
function getElementsByTagType(type, nodes, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    return (0, querying_1.filter)(Checks.tag_type(type), nodes, recurse, limit);
}
exports.getElementsByTagType = getElementsByTagType;


/***/ }),

/***/ 52582:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepend = exports.prependChild = exports.append = exports.appendChild = exports.replaceElement = exports.removeElement = void 0;
/**
 * Remove an element from the dom
 *
 * @param elem The element to be removed
 */
function removeElement(elem) {
    if (elem.prev)
        elem.prev.next = elem.next;
    if (elem.next)
        elem.next.prev = elem.prev;
    if (elem.parent) {
        var childs = elem.parent.children;
        childs.splice(childs.lastIndexOf(elem), 1);
    }
}
exports.removeElement = removeElement;
/**
 * Replace an element in the dom
 *
 * @param elem The element to be replaced
 * @param replacement The element to be added
 */
function replaceElement(elem, replacement) {
    var prev = (replacement.prev = elem.prev);
    if (prev) {
        prev.next = replacement;
    }
    var next = (replacement.next = elem.next);
    if (next) {
        next.prev = replacement;
    }
    var parent = (replacement.parent = elem.parent);
    if (parent) {
        var childs = parent.children;
        childs[childs.lastIndexOf(elem)] = replacement;
    }
}
exports.replaceElement = replaceElement;
/**
 * Append a child to an element.
 *
 * @param elem The element to append to.
 * @param child The element to be added as a child.
 */
function appendChild(elem, child) {
    removeElement(child);
    child.next = null;
    child.parent = elem;
    if (elem.children.push(child) > 1) {
        var sibling = elem.children[elem.children.length - 2];
        sibling.next = child;
        child.prev = sibling;
    }
    else {
        child.prev = null;
    }
}
exports.appendChild = appendChild;
/**
 * Append an element after another.
 *
 * @param elem The element to append after.
 * @param next The element be added.
 */
function append(elem, next) {
    removeElement(next);
    var parent = elem.parent;
    var currNext = elem.next;
    next.next = currNext;
    next.prev = elem;
    elem.next = next;
    next.parent = parent;
    if (currNext) {
        currNext.prev = next;
        if (parent) {
            var childs = parent.children;
            childs.splice(childs.lastIndexOf(currNext), 0, next);
        }
    }
    else if (parent) {
        parent.children.push(next);
    }
}
exports.append = append;
/**
 * Prepend a child to an element.
 *
 * @param elem The element to prepend before.
 * @param child The element to be added as a child.
 */
function prependChild(elem, child) {
    removeElement(child);
    child.parent = elem;
    child.prev = null;
    if (elem.children.unshift(child) !== 1) {
        var sibling = elem.children[1];
        sibling.prev = child;
        child.next = sibling;
    }
    else {
        child.next = null;
    }
}
exports.prependChild = prependChild;
/**
 * Prepend an element before another.
 *
 * @param elem The element to prepend before.
 * @param prev The element be added.
 */
function prepend(elem, prev) {
    removeElement(prev);
    var parent = elem.parent;
    if (parent) {
        var childs = parent.children;
        childs.splice(childs.indexOf(elem), 0, prev);
    }
    if (elem.prev) {
        elem.prev.next = prev;
    }
    prev.parent = parent;
    prev.prev = elem.prev;
    prev.next = elem;
    elem.prev = prev;
}
exports.prepend = prepend;


/***/ }),

/***/ 94935:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.findAll = exports.existsOne = exports.findOne = exports.findOneChild = exports.find = exports.filter = void 0;
var domhandler_1 = __webpack_require__(89641);
/**
 * Search a node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param node Node to search. Will be included in the result set if it matches.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function filter(test, node, recurse, limit) {
    if (recurse === void 0) { recurse = true; }
    if (limit === void 0) { limit = Infinity; }
    if (!Array.isArray(node))
        node = [node];
    return find(test, node, recurse, limit);
}
exports.filter = filter;
/**
 * Search an array of node and its children for nodes passing a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @param limit Maximum number of nodes to return.
 * @returns All nodes passing `test`.
 */
function find(test, nodes, recurse, limit) {
    var result = [];
    for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
        var elem = nodes_1[_i];
        if (test(elem)) {
            result.push(elem);
            if (--limit <= 0)
                break;
        }
        if (recurse && (0, domhandler_1.hasChildren)(elem) && elem.children.length > 0) {
            var children = find(test, elem.children, recurse, limit);
            result.push.apply(result, children);
            limit -= children.length;
            if (limit <= 0)
                break;
        }
    }
    return result;
}
exports.find = find;
/**
 * Finds the first element inside of an array that matches a test function.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns The first node in the array that passes `test`.
 */
function findOneChild(test, nodes) {
    return nodes.find(test);
}
exports.findOneChild = findOneChild;
/**
 * Finds one element in a tree that passes a test.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @param recurse Also consider child nodes.
 * @returns The first child node that passes `test`.
 */
function findOne(test, nodes, recurse) {
    if (recurse === void 0) { recurse = true; }
    var elem = null;
    for (var i = 0; i < nodes.length && !elem; i++) {
        var checked = nodes[i];
        if (!(0, domhandler_1.isTag)(checked)) {
            continue;
        }
        else if (test(checked)) {
            elem = checked;
        }
        else if (recurse && checked.children.length > 0) {
            elem = findOne(test, checked.children);
        }
    }
    return elem;
}
exports.findOne = findOne;
/**
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns Whether a tree of nodes contains at least one node passing a test.
 */
function existsOne(test, nodes) {
    return nodes.some(function (checked) {
        return (0, domhandler_1.isTag)(checked) &&
            (test(checked) ||
                (checked.children.length > 0 &&
                    existsOne(test, checked.children)));
    });
}
exports.existsOne = existsOne;
/**
 * Search and array of nodes and its children for nodes passing a test function.
 *
 * Same as `find`, only with less options, leading to reduced complexity.
 *
 * @param test Function to test nodes on.
 * @param nodes Array of nodes to search.
 * @returns All nodes passing `test`.
 */
function findAll(test, nodes) {
    var _a;
    var result = [];
    var stack = nodes.filter(domhandler_1.isTag);
    var elem;
    while ((elem = stack.shift())) {
        var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1.isTag);
        if (children && children.length > 0) {
            stack.unshift.apply(stack, children);
        }
        if (test(elem))
            result.push(elem);
    }
    return result;
}
exports.findAll = findAll;


/***/ }),

/***/ 39682:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.innerText = exports.textContent = exports.getText = exports.getInnerHTML = exports.getOuterHTML = void 0;
var domhandler_1 = __webpack_require__(89641);
var dom_serializer_1 = __importDefault(__webpack_require__(60698));
var domelementtype_1 = __webpack_require__(76241);
/**
 * @param node Node to get the outer HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s outer HTML.
 */
function getOuterHTML(node, options) {
    return (0, dom_serializer_1.default)(node, options);
}
exports.getOuterHTML = getOuterHTML;
/**
 * @param node Node to get the inner HTML of.
 * @param options Options for serialization.
 * @deprecated Use the `dom-serializer` module directly.
 * @returns `node`'s inner HTML.
 */
function getInnerHTML(node, options) {
    return (0, domhandler_1.hasChildren)(node)
        ? node.children.map(function (node) { return getOuterHTML(node, options); }).join("")
        : "";
}
exports.getInnerHTML = getInnerHTML;
/**
 * Get a node's inner text. Same as `textContent`, but inserts newlines for `<br>` tags.
 *
 * @deprecated Use `textContent` instead.
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 */
function getText(node) {
    if (Array.isArray(node))
        return node.map(getText).join("");
    if ((0, domhandler_1.isTag)(node))
        return node.name === "br" ? "\n" : getText(node.children);
    if ((0, domhandler_1.isCDATA)(node))
        return getText(node.children);
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.getText = getText;
/**
 * Get a node's text content.
 *
 * @param node Node to get the text content of.
 * @returns `node`'s text content.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/textContent}
 */
function textContent(node) {
    if (Array.isArray(node))
        return node.map(textContent).join("");
    if ((0, domhandler_1.hasChildren)(node) && !(0, domhandler_1.isComment)(node)) {
        return textContent(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.textContent = textContent;
/**
 * Get a node's inner text.
 *
 * @param node Node to get the inner text of.
 * @returns `node`'s inner text.
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Node/innerText}
 */
function innerText(node) {
    if (Array.isArray(node))
        return node.map(innerText).join("");
    if ((0, domhandler_1.hasChildren)(node) && (node.type === domelementtype_1.ElementType.Tag || (0, domhandler_1.isCDATA)(node))) {
        return innerText(node.children);
    }
    if ((0, domhandler_1.isText)(node))
        return node.data;
    return "";
}
exports.innerText = innerText;


/***/ }),

/***/ 36210:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prevElementSibling = exports.nextElementSibling = exports.getName = exports.hasAttrib = exports.getAttributeValue = exports.getSiblings = exports.getParent = exports.getChildren = void 0;
var domhandler_1 = __webpack_require__(89641);
var emptyArray = [];
/**
 * Get a node's children.
 *
 * @param elem Node to get the children of.
 * @returns `elem`'s children, or an empty array.
 */
function getChildren(elem) {
    var _a;
    return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
}
exports.getChildren = getChildren;
/**
 * Get a node's parent.
 *
 * @param elem Node to get the parent of.
 * @returns `elem`'s parent node.
 */
function getParent(elem) {
    return elem.parent || null;
}
exports.getParent = getParent;
/**
 * Gets an elements siblings, including the element itself.
 *
 * Attempts to get the children through the element's parent first.
 * If we don't have a parent (the element is a root node),
 * we walk the element's `prev` & `next` to get all remaining nodes.
 *
 * @param elem Element to get the siblings of.
 * @returns `elem`'s siblings.
 */
function getSiblings(elem) {
    var _a, _b;
    var parent = getParent(elem);
    if (parent != null)
        return getChildren(parent);
    var siblings = [elem];
    var prev = elem.prev, next = elem.next;
    while (prev != null) {
        siblings.unshift(prev);
        (_a = prev, prev = _a.prev);
    }
    while (next != null) {
        siblings.push(next);
        (_b = next, next = _b.next);
    }
    return siblings;
}
exports.getSiblings = getSiblings;
/**
 * Gets an attribute from an element.
 *
 * @param elem Element to check.
 * @param name Attribute name to retrieve.
 * @returns The element's attribute value, or `undefined`.
 */
function getAttributeValue(elem, name) {
    var _a;
    return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
exports.getAttributeValue = getAttributeValue;
/**
 * Checks whether an element has an attribute.
 *
 * @param elem Element to check.
 * @param name Attribute name to look for.
 * @returns Returns whether `elem` has the attribute `name`.
 */
function hasAttrib(elem, name) {
    return (elem.attribs != null &&
        Object.prototype.hasOwnProperty.call(elem.attribs, name) &&
        elem.attribs[name] != null);
}
exports.hasAttrib = hasAttrib;
/**
 * Get the tag name of an element.
 *
 * @param elem The element to get the name for.
 * @returns The tag name of `elem`.
 */
function getName(elem) {
    return elem.name;
}
exports.getName = getName;
/**
 * Returns the next element sibling of a node.
 *
 * @param elem The element to get the next sibling of.
 * @returns `elem`'s next sibling that is a tag.
 */
function nextElementSibling(elem) {
    var _a;
    var next = elem.next;
    while (next !== null && !(0, domhandler_1.isTag)(next))
        (_a = next, next = _a.next);
    return next;
}
exports.nextElementSibling = nextElementSibling;
/**
 * Returns the previous element sibling of a node.
 *
 * @param elem The element to get the previous sibling of.
 * @returns `elem`'s previous sibling that is a tag.
 */
function prevElementSibling(elem) {
    var _a;
    var prev = elem.prev;
    while (prev !== null && !(0, domhandler_1.isTag)(prev))
        (_a = prev, prev = _a.prev);
    return prev;
}
exports.prevElementSibling = prevElementSibling;


/***/ }),

/***/ 24158:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeHTML = exports.decodeHTMLStrict = exports.decodeXML = void 0;
var entities_json_1 = __importDefault(__webpack_require__(96550));
var legacy_json_1 = __importDefault(__webpack_require__(86662));
var xml_json_1 = __importDefault(__webpack_require__(70772));
var decode_codepoint_1 = __importDefault(__webpack_require__(17641));
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
exports.decodeXML = getStrictDecoder(xml_json_1.default);
exports.decodeHTMLStrict = getStrictDecoder(entities_json_1.default);
function getStrictDecoder(map) {
    var replace = getReplacer(map);
    return function (str) { return String(str).replace(strictEntityRe, replace); };
}
var sorter = function (a, b) { return (a < b ? 1 : -1); };
exports.decodeHTML = (function () {
    var legacy = Object.keys(legacy_json_1.default).sort(sorter);
    var keys = Object.keys(entities_json_1.default).sort(sorter);
    for (var i = 0, j = 0; i < keys.length; i++) {
        if (legacy[j] === keys[i]) {
            keys[i] += ";?";
            j++;
        }
        else {
            keys[i] += ";";
        }
    }
    var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
    var replace = getReplacer(entities_json_1.default);
    function replacer(str) {
        if (str.substr(-1) !== ";")
            str += ";";
        return replace(str);
    }
    // TODO consider creating a merged map
    return function (str) { return String(str).replace(re, replacer); };
})();
function getReplacer(map) {
    return function replace(str) {
        if (str.charAt(1) === "#") {
            var secondChar = str.charAt(2);
            if (secondChar === "X" || secondChar === "x") {
                return decode_codepoint_1.default(parseInt(str.substr(3), 16));
            }
            return decode_codepoint_1.default(parseInt(str.substr(2), 10));
        }
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
        return map[str.slice(1, -1)] || str;
    };
}


/***/ }),

/***/ 17641:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_json_1 = __importDefault(__webpack_require__(39818));
// Adapted from https://github.com/mathiasbynens/he/blob/master/src/he.js#L94-L119
var fromCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.fromCodePoint ||
    function (codePoint) {
        var output = "";
        if (codePoint > 0xffff) {
            codePoint -= 0x10000;
            output += String.fromCharCode(((codePoint >>> 10) & 0x3ff) | 0xd800);
            codePoint = 0xdc00 | (codePoint & 0x3ff);
        }
        output += String.fromCharCode(codePoint);
        return output;
    };
function decodeCodePoint(codePoint) {
    if ((codePoint >= 0xd800 && codePoint <= 0xdfff) || codePoint > 0x10ffff) {
        return "\uFFFD";
    }
    if (codePoint in decode_json_1.default) {
        codePoint = decode_json_1.default[codePoint];
    }
    return fromCodePoint(codePoint);
}
exports["default"] = decodeCodePoint;


/***/ }),

/***/ 43793:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = void 0;
var xml_json_1 = __importDefault(__webpack_require__(70772));
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using XML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = __importDefault(__webpack_require__(96550));
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
/**
 * Encodes all entities and non-ASCII characters in the input.
 *
 * This includes characters that are valid ASCII characters in HTML documents.
 * For example `#` will be encoded as `&num;`. To get a more compact output,
 * consider using the `encodeNonAsciiHTML` function.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeHTML = getInverse(inverseHTML, htmlReplacer);
/**
 * Encodes all non-ASCII characters, as well as characters not valid in HTML
 * documents using HTML entities.
 *
 * If a character has no equivalent entity, a
 * numeric hexadecimal reference (eg. `&#xfc;`) will be used.
 */
exports.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
    return Object.keys(obj)
        .sort()
        .reduce(function (inverse, name) {
        inverse[obj[name]] = "&" + name + ";";
        return inverse;
    }, {});
}
function getInverseReplacer(inverse) {
    var single = [];
    var multiple = [];
    for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
        var k = _a[_i];
        if (k.length === 1) {
            // Add value to single array
            single.push("\\" + k);
        }
        else {
            // Add value to multiple array
            multiple.push(k);
        }
    }
    // Add ranges to single characters.
    single.sort();
    for (var start = 0; start < single.length - 1; start++) {
        // Find the end of a run of characters
        var end = start;
        while (end < single.length - 1 &&
            single[end].charCodeAt(1) + 1 === single[end + 1].charCodeAt(1)) {
            end += 1;
        }
        var count = 1 + end - start;
        // We want to replace at least three characters
        if (count < 3)
            continue;
        single.splice(start, count, single[start] + "-" + single[end]);
    }
    multiple.unshift("[" + single.join("") + "]");
    return new RegExp(multiple.join("|"), "g");
}
// /[^\0-\x7F]/gu
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = 
// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
String.prototype.codePointAt != null
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        function (str) { return str.codePointAt(0); }
    : // http://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
        function (c) {
            return (c.charCodeAt(0) - 0xd800) * 0x400 +
                c.charCodeAt(1) -
                0xdc00 +
                0x10000;
        };
function singleCharReplacer(c) {
    return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0))
        .toString(16)
        .toUpperCase() + ";";
}
function getInverse(inverse, re) {
    return function (data) {
        return data
            .replace(re, function (name) { return inverse[name]; })
            .replace(reNonASCII, singleCharReplacer);
    };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
/**
 * Encodes all non-ASCII characters, as well as characters not valid in XML
 * documents using numeric hexadecimal reference (eg. `&#xfc;`).
 *
 * Have a look at `escapeUTF8` if you want a more concise output at the expense
 * of reduced transportability.
 *
 * @param data String to escape.
 */
function escape(data) {
    return data.replace(reEscapeChars, singleCharReplacer);
}
exports.escape = escape;
/**
 * Encodes all characters not valid in XML documents using numeric hexadecimal
 * reference (eg. `&#xfc;`).
 *
 * Note that the output will be character-set dependent.
 *
 * @param data String to escape.
 */
function escapeUTF8(data) {
    return data.replace(xmlReplacer, singleCharReplacer);
}
exports.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
    return function (data) {
        return data.replace(reEscapeChars, function (c) { return obj[c] || singleCharReplacer(c); });
    };
}


/***/ }),

/***/ 5213:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
var decode_1 = __webpack_require__(24158);
var encode_1 = __webpack_require__(43793);
/**
 * Decodes a string with entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeXML` or `decodeHTML` directly.
 */
function decode(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
}
exports.decode = decode;
/**
 * Decodes a string with entities. Does not allow missing trailing semicolons for entities.
 *
 * @param data String to decode.
 * @param level Optional level to decode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `decodeHTMLStrict` or `decodeXML` directly.
 */
function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
}
exports.decodeStrict = decodeStrict;
/**
 * Encodes a string with entities.
 *
 * @param data String to encode.
 * @param level Optional level to encode at. 0 = XML, 1 = HTML. Default is 0.
 * @deprecated Use `encodeHTML`, `encodeXML` or `encodeNonAsciiHTML` directly.
 */
function encode(data, level) {
    return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
}
exports.encode = encode;
var encode_2 = __webpack_require__(43793);
Object.defineProperty(exports, "encodeXML", ({ enumerable: true, get: function () { return encode_2.encodeXML; } }));
Object.defineProperty(exports, "encodeHTML", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeNonAsciiHTML", ({ enumerable: true, get: function () { return encode_2.encodeNonAsciiHTML; } }));
Object.defineProperty(exports, "escape", ({ enumerable: true, get: function () { return encode_2.escape; } }));
Object.defineProperty(exports, "escapeUTF8", ({ enumerable: true, get: function () { return encode_2.escapeUTF8; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "encodeHTML4", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
Object.defineProperty(exports, "encodeHTML5", ({ enumerable: true, get: function () { return encode_2.encodeHTML; } }));
var decode_2 = __webpack_require__(24158);
Object.defineProperty(exports, "decodeXML", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));
Object.defineProperty(exports, "decodeHTML", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
// Legacy aliases (deprecated)
Object.defineProperty(exports, "decodeHTML4", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML5", ({ enumerable: true, get: function () { return decode_2.decodeHTML; } }));
Object.defineProperty(exports, "decodeHTML4Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeHTML5Strict", ({ enumerable: true, get: function () { return decode_2.decodeHTMLStrict; } }));
Object.defineProperty(exports, "decodeXMLStrict", ({ enumerable: true, get: function () { return decode_2.decodeXML; } }));


/***/ }),

/***/ 88409:
/***/ (function(module, exports, __webpack_require__) {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/he v1.2.0 by @mathias | MIT license */
;(function(root) {

	// Detect free variables `exports`.
	var freeExports =  true && exports;

	// Detect free variable `module`.
	var freeModule =  true && module &&
		module.exports == freeExports && module;

	// Detect free variable `global`, from Node.js or Browserified code,
	// and use it as `root`.
	var freeGlobal = typeof global == 'object' && global;
	if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
		root = freeGlobal;
	}

	/*--------------------------------------------------------------------------*/

	// All astral symbols.
	var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
	// All ASCII symbols (not just printable ASCII) except those listed in the
	// first column of the overrides table.
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides
	var regexAsciiWhitelist = /[\x01-\x7F]/g;
	// All BMP symbols that are not ASCII newlines, printable ASCII symbols, or
	// code points listed in the first column of the overrides table on
	// https://html.spec.whatwg.org/multipage/syntax.html#table-charref-overrides.
	var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;

	var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
	var encodeMap = {'\xAD':'shy','\u200C':'zwnj','\u200D':'zwj','\u200E':'lrm','\u2063':'ic','\u2062':'it','\u2061':'af','\u200F':'rlm','\u200B':'ZeroWidthSpace','\u2060':'NoBreak','\u0311':'DownBreve','\u20DB':'tdot','\u20DC':'DotDot','\t':'Tab','\n':'NewLine','\u2008':'puncsp','\u205F':'MediumSpace','\u2009':'thinsp','\u200A':'hairsp','\u2004':'emsp13','\u2002':'ensp','\u2005':'emsp14','\u2003':'emsp','\u2007':'numsp','\xA0':'nbsp','\u205F\u200A':'ThickSpace','\u203E':'oline','_':'lowbar','\u2010':'dash','\u2013':'ndash','\u2014':'mdash','\u2015':'horbar',',':'comma',';':'semi','\u204F':'bsemi',':':'colon','\u2A74':'Colone','!':'excl','\xA1':'iexcl','?':'quest','\xBF':'iquest','.':'period','\u2025':'nldr','\u2026':'mldr','\xB7':'middot','\'':'apos','\u2018':'lsquo','\u2019':'rsquo','\u201A':'sbquo','\u2039':'lsaquo','\u203A':'rsaquo','"':'quot','\u201C':'ldquo','\u201D':'rdquo','\u201E':'bdquo','\xAB':'laquo','\xBB':'raquo','(':'lpar',')':'rpar','[':'lsqb',']':'rsqb','{':'lcub','}':'rcub','\u2308':'lceil','\u2309':'rceil','\u230A':'lfloor','\u230B':'rfloor','\u2985':'lopar','\u2986':'ropar','\u298B':'lbrke','\u298C':'rbrke','\u298D':'lbrkslu','\u298E':'rbrksld','\u298F':'lbrksld','\u2990':'rbrkslu','\u2991':'langd','\u2992':'rangd','\u2993':'lparlt','\u2994':'rpargt','\u2995':'gtlPar','\u2996':'ltrPar','\u27E6':'lobrk','\u27E7':'robrk','\u27E8':'lang','\u27E9':'rang','\u27EA':'Lang','\u27EB':'Rang','\u27EC':'loang','\u27ED':'roang','\u2772':'lbbrk','\u2773':'rbbrk','\u2016':'Vert','\xA7':'sect','\xB6':'para','@':'commat','*':'ast','/':'sol','undefined':null,'&':'amp','#':'num','%':'percnt','\u2030':'permil','\u2031':'pertenk','\u2020':'dagger','\u2021':'Dagger','\u2022':'bull','\u2043':'hybull','\u2032':'prime','\u2033':'Prime','\u2034':'tprime','\u2057':'qprime','\u2035':'bprime','\u2041':'caret','`':'grave','\xB4':'acute','\u02DC':'tilde','^':'Hat','\xAF':'macr','\u02D8':'breve','\u02D9':'dot','\xA8':'die','\u02DA':'ring','\u02DD':'dblac','\xB8':'cedil','\u02DB':'ogon','\u02C6':'circ','\u02C7':'caron','\xB0':'deg','\xA9':'copy','\xAE':'reg','\u2117':'copysr','\u2118':'wp','\u211E':'rx','\u2127':'mho','\u2129':'iiota','\u2190':'larr','\u219A':'nlarr','\u2192':'rarr','\u219B':'nrarr','\u2191':'uarr','\u2193':'darr','\u2194':'harr','\u21AE':'nharr','\u2195':'varr','\u2196':'nwarr','\u2197':'nearr','\u2198':'searr','\u2199':'swarr','\u219D':'rarrw','\u219D\u0338':'nrarrw','\u219E':'Larr','\u219F':'Uarr','\u21A0':'Rarr','\u21A1':'Darr','\u21A2':'larrtl','\u21A3':'rarrtl','\u21A4':'mapstoleft','\u21A5':'mapstoup','\u21A6':'map','\u21A7':'mapstodown','\u21A9':'larrhk','\u21AA':'rarrhk','\u21AB':'larrlp','\u21AC':'rarrlp','\u21AD':'harrw','\u21B0':'lsh','\u21B1':'rsh','\u21B2':'ldsh','\u21B3':'rdsh','\u21B5':'crarr','\u21B6':'cularr','\u21B7':'curarr','\u21BA':'olarr','\u21BB':'orarr','\u21BC':'lharu','\u21BD':'lhard','\u21BE':'uharr','\u21BF':'uharl','\u21C0':'rharu','\u21C1':'rhard','\u21C2':'dharr','\u21C3':'dharl','\u21C4':'rlarr','\u21C5':'udarr','\u21C6':'lrarr','\u21C7':'llarr','\u21C8':'uuarr','\u21C9':'rrarr','\u21CA':'ddarr','\u21CB':'lrhar','\u21CC':'rlhar','\u21D0':'lArr','\u21CD':'nlArr','\u21D1':'uArr','\u21D2':'rArr','\u21CF':'nrArr','\u21D3':'dArr','\u21D4':'iff','\u21CE':'nhArr','\u21D5':'vArr','\u21D6':'nwArr','\u21D7':'neArr','\u21D8':'seArr','\u21D9':'swArr','\u21DA':'lAarr','\u21DB':'rAarr','\u21DD':'zigrarr','\u21E4':'larrb','\u21E5':'rarrb','\u21F5':'duarr','\u21FD':'loarr','\u21FE':'roarr','\u21FF':'hoarr','\u2200':'forall','\u2201':'comp','\u2202':'part','\u2202\u0338':'npart','\u2203':'exist','\u2204':'nexist','\u2205':'empty','\u2207':'Del','\u2208':'in','\u2209':'notin','\u220B':'ni','\u220C':'notni','\u03F6':'bepsi','\u220F':'prod','\u2210':'coprod','\u2211':'sum','+':'plus','\xB1':'pm','\xF7':'div','\xD7':'times','<':'lt','\u226E':'nlt','<\u20D2':'nvlt','=':'equals','\u2260':'ne','=\u20E5':'bne','\u2A75':'Equal','>':'gt','\u226F':'ngt','>\u20D2':'nvgt','\xAC':'not','|':'vert','\xA6':'brvbar','\u2212':'minus','\u2213':'mp','\u2214':'plusdo','\u2044':'frasl','\u2216':'setmn','\u2217':'lowast','\u2218':'compfn','\u221A':'Sqrt','\u221D':'prop','\u221E':'infin','\u221F':'angrt','\u2220':'ang','\u2220\u20D2':'nang','\u2221':'angmsd','\u2222':'angsph','\u2223':'mid','\u2224':'nmid','\u2225':'par','\u2226':'npar','\u2227':'and','\u2228':'or','\u2229':'cap','\u2229\uFE00':'caps','\u222A':'cup','\u222A\uFE00':'cups','\u222B':'int','\u222C':'Int','\u222D':'tint','\u2A0C':'qint','\u222E':'oint','\u222F':'Conint','\u2230':'Cconint','\u2231':'cwint','\u2232':'cwconint','\u2233':'awconint','\u2234':'there4','\u2235':'becaus','\u2236':'ratio','\u2237':'Colon','\u2238':'minusd','\u223A':'mDDot','\u223B':'homtht','\u223C':'sim','\u2241':'nsim','\u223C\u20D2':'nvsim','\u223D':'bsim','\u223D\u0331':'race','\u223E':'ac','\u223E\u0333':'acE','\u223F':'acd','\u2240':'wr','\u2242':'esim','\u2242\u0338':'nesim','\u2243':'sime','\u2244':'nsime','\u2245':'cong','\u2247':'ncong','\u2246':'simne','\u2248':'ap','\u2249':'nap','\u224A':'ape','\u224B':'apid','\u224B\u0338':'napid','\u224C':'bcong','\u224D':'CupCap','\u226D':'NotCupCap','\u224D\u20D2':'nvap','\u224E':'bump','\u224E\u0338':'nbump','\u224F':'bumpe','\u224F\u0338':'nbumpe','\u2250':'doteq','\u2250\u0338':'nedot','\u2251':'eDot','\u2252':'efDot','\u2253':'erDot','\u2254':'colone','\u2255':'ecolon','\u2256':'ecir','\u2257':'cire','\u2259':'wedgeq','\u225A':'veeeq','\u225C':'trie','\u225F':'equest','\u2261':'equiv','\u2262':'nequiv','\u2261\u20E5':'bnequiv','\u2264':'le','\u2270':'nle','\u2264\u20D2':'nvle','\u2265':'ge','\u2271':'nge','\u2265\u20D2':'nvge','\u2266':'lE','\u2266\u0338':'nlE','\u2267':'gE','\u2267\u0338':'ngE','\u2268\uFE00':'lvnE','\u2268':'lnE','\u2269':'gnE','\u2269\uFE00':'gvnE','\u226A':'ll','\u226A\u0338':'nLtv','\u226A\u20D2':'nLt','\u226B':'gg','\u226B\u0338':'nGtv','\u226B\u20D2':'nGt','\u226C':'twixt','\u2272':'lsim','\u2274':'nlsim','\u2273':'gsim','\u2275':'ngsim','\u2276':'lg','\u2278':'ntlg','\u2277':'gl','\u2279':'ntgl','\u227A':'pr','\u2280':'npr','\u227B':'sc','\u2281':'nsc','\u227C':'prcue','\u22E0':'nprcue','\u227D':'sccue','\u22E1':'nsccue','\u227E':'prsim','\u227F':'scsim','\u227F\u0338':'NotSucceedsTilde','\u2282':'sub','\u2284':'nsub','\u2282\u20D2':'vnsub','\u2283':'sup','\u2285':'nsup','\u2283\u20D2':'vnsup','\u2286':'sube','\u2288':'nsube','\u2287':'supe','\u2289':'nsupe','\u228A\uFE00':'vsubne','\u228A':'subne','\u228B\uFE00':'vsupne','\u228B':'supne','\u228D':'cupdot','\u228E':'uplus','\u228F':'sqsub','\u228F\u0338':'NotSquareSubset','\u2290':'sqsup','\u2290\u0338':'NotSquareSuperset','\u2291':'sqsube','\u22E2':'nsqsube','\u2292':'sqsupe','\u22E3':'nsqsupe','\u2293':'sqcap','\u2293\uFE00':'sqcaps','\u2294':'sqcup','\u2294\uFE00':'sqcups','\u2295':'oplus','\u2296':'ominus','\u2297':'otimes','\u2298':'osol','\u2299':'odot','\u229A':'ocir','\u229B':'oast','\u229D':'odash','\u229E':'plusb','\u229F':'minusb','\u22A0':'timesb','\u22A1':'sdotb','\u22A2':'vdash','\u22AC':'nvdash','\u22A3':'dashv','\u22A4':'top','\u22A5':'bot','\u22A7':'models','\u22A8':'vDash','\u22AD':'nvDash','\u22A9':'Vdash','\u22AE':'nVdash','\u22AA':'Vvdash','\u22AB':'VDash','\u22AF':'nVDash','\u22B0':'prurel','\u22B2':'vltri','\u22EA':'nltri','\u22B3':'vrtri','\u22EB':'nrtri','\u22B4':'ltrie','\u22EC':'nltrie','\u22B4\u20D2':'nvltrie','\u22B5':'rtrie','\u22ED':'nrtrie','\u22B5\u20D2':'nvrtrie','\u22B6':'origof','\u22B7':'imof','\u22B8':'mumap','\u22B9':'hercon','\u22BA':'intcal','\u22BB':'veebar','\u22BD':'barvee','\u22BE':'angrtvb','\u22BF':'lrtri','\u22C0':'Wedge','\u22C1':'Vee','\u22C2':'xcap','\u22C3':'xcup','\u22C4':'diam','\u22C5':'sdot','\u22C6':'Star','\u22C7':'divonx','\u22C8':'bowtie','\u22C9':'ltimes','\u22CA':'rtimes','\u22CB':'lthree','\u22CC':'rthree','\u22CD':'bsime','\u22CE':'cuvee','\u22CF':'cuwed','\u22D0':'Sub','\u22D1':'Sup','\u22D2':'Cap','\u22D3':'Cup','\u22D4':'fork','\u22D5':'epar','\u22D6':'ltdot','\u22D7':'gtdot','\u22D8':'Ll','\u22D8\u0338':'nLl','\u22D9':'Gg','\u22D9\u0338':'nGg','\u22DA\uFE00':'lesg','\u22DA':'leg','\u22DB':'gel','\u22DB\uFE00':'gesl','\u22DE':'cuepr','\u22DF':'cuesc','\u22E6':'lnsim','\u22E7':'gnsim','\u22E8':'prnsim','\u22E9':'scnsim','\u22EE':'vellip','\u22EF':'ctdot','\u22F0':'utdot','\u22F1':'dtdot','\u22F2':'disin','\u22F3':'isinsv','\u22F4':'isins','\u22F5':'isindot','\u22F5\u0338':'notindot','\u22F6':'notinvc','\u22F7':'notinvb','\u22F9':'isinE','\u22F9\u0338':'notinE','\u22FA':'nisd','\u22FB':'xnis','\u22FC':'nis','\u22FD':'notnivc','\u22FE':'notnivb','\u2305':'barwed','\u2306':'Barwed','\u230C':'drcrop','\u230D':'dlcrop','\u230E':'urcrop','\u230F':'ulcrop','\u2310':'bnot','\u2312':'profline','\u2313':'profsurf','\u2315':'telrec','\u2316':'target','\u231C':'ulcorn','\u231D':'urcorn','\u231E':'dlcorn','\u231F':'drcorn','\u2322':'frown','\u2323':'smile','\u232D':'cylcty','\u232E':'profalar','\u2336':'topbot','\u233D':'ovbar','\u233F':'solbar','\u237C':'angzarr','\u23B0':'lmoust','\u23B1':'rmoust','\u23B4':'tbrk','\u23B5':'bbrk','\u23B6':'bbrktbrk','\u23DC':'OverParenthesis','\u23DD':'UnderParenthesis','\u23DE':'OverBrace','\u23DF':'UnderBrace','\u23E2':'trpezium','\u23E7':'elinters','\u2423':'blank','\u2500':'boxh','\u2502':'boxv','\u250C':'boxdr','\u2510':'boxdl','\u2514':'boxur','\u2518':'boxul','\u251C':'boxvr','\u2524':'boxvl','\u252C':'boxhd','\u2534':'boxhu','\u253C':'boxvh','\u2550':'boxH','\u2551':'boxV','\u2552':'boxdR','\u2553':'boxDr','\u2554':'boxDR','\u2555':'boxdL','\u2556':'boxDl','\u2557':'boxDL','\u2558':'boxuR','\u2559':'boxUr','\u255A':'boxUR','\u255B':'boxuL','\u255C':'boxUl','\u255D':'boxUL','\u255E':'boxvR','\u255F':'boxVr','\u2560':'boxVR','\u2561':'boxvL','\u2562':'boxVl','\u2563':'boxVL','\u2564':'boxHd','\u2565':'boxhD','\u2566':'boxHD','\u2567':'boxHu','\u2568':'boxhU','\u2569':'boxHU','\u256A':'boxvH','\u256B':'boxVh','\u256C':'boxVH','\u2580':'uhblk','\u2584':'lhblk','\u2588':'block','\u2591':'blk14','\u2592':'blk12','\u2593':'blk34','\u25A1':'squ','\u25AA':'squf','\u25AB':'EmptyVerySmallSquare','\u25AD':'rect','\u25AE':'marker','\u25B1':'fltns','\u25B3':'xutri','\u25B4':'utrif','\u25B5':'utri','\u25B8':'rtrif','\u25B9':'rtri','\u25BD':'xdtri','\u25BE':'dtrif','\u25BF':'dtri','\u25C2':'ltrif','\u25C3':'ltri','\u25CA':'loz','\u25CB':'cir','\u25EC':'tridot','\u25EF':'xcirc','\u25F8':'ultri','\u25F9':'urtri','\u25FA':'lltri','\u25FB':'EmptySmallSquare','\u25FC':'FilledSmallSquare','\u2605':'starf','\u2606':'star','\u260E':'phone','\u2640':'female','\u2642':'male','\u2660':'spades','\u2663':'clubs','\u2665':'hearts','\u2666':'diams','\u266A':'sung','\u2713':'check','\u2717':'cross','\u2720':'malt','\u2736':'sext','\u2758':'VerticalSeparator','\u27C8':'bsolhsub','\u27C9':'suphsol','\u27F5':'xlarr','\u27F6':'xrarr','\u27F7':'xharr','\u27F8':'xlArr','\u27F9':'xrArr','\u27FA':'xhArr','\u27FC':'xmap','\u27FF':'dzigrarr','\u2902':'nvlArr','\u2903':'nvrArr','\u2904':'nvHarr','\u2905':'Map','\u290C':'lbarr','\u290D':'rbarr','\u290E':'lBarr','\u290F':'rBarr','\u2910':'RBarr','\u2911':'DDotrahd','\u2912':'UpArrowBar','\u2913':'DownArrowBar','\u2916':'Rarrtl','\u2919':'latail','\u291A':'ratail','\u291B':'lAtail','\u291C':'rAtail','\u291D':'larrfs','\u291E':'rarrfs','\u291F':'larrbfs','\u2920':'rarrbfs','\u2923':'nwarhk','\u2924':'nearhk','\u2925':'searhk','\u2926':'swarhk','\u2927':'nwnear','\u2928':'toea','\u2929':'tosa','\u292A':'swnwar','\u2933':'rarrc','\u2933\u0338':'nrarrc','\u2935':'cudarrr','\u2936':'ldca','\u2937':'rdca','\u2938':'cudarrl','\u2939':'larrpl','\u293C':'curarrm','\u293D':'cularrp','\u2945':'rarrpl','\u2948':'harrcir','\u2949':'Uarrocir','\u294A':'lurdshar','\u294B':'ldrushar','\u294E':'LeftRightVector','\u294F':'RightUpDownVector','\u2950':'DownLeftRightVector','\u2951':'LeftUpDownVector','\u2952':'LeftVectorBar','\u2953':'RightVectorBar','\u2954':'RightUpVectorBar','\u2955':'RightDownVectorBar','\u2956':'DownLeftVectorBar','\u2957':'DownRightVectorBar','\u2958':'LeftUpVectorBar','\u2959':'LeftDownVectorBar','\u295A':'LeftTeeVector','\u295B':'RightTeeVector','\u295C':'RightUpTeeVector','\u295D':'RightDownTeeVector','\u295E':'DownLeftTeeVector','\u295F':'DownRightTeeVector','\u2960':'LeftUpTeeVector','\u2961':'LeftDownTeeVector','\u2962':'lHar','\u2963':'uHar','\u2964':'rHar','\u2965':'dHar','\u2966':'luruhar','\u2967':'ldrdhar','\u2968':'ruluhar','\u2969':'rdldhar','\u296A':'lharul','\u296B':'llhard','\u296C':'rharul','\u296D':'lrhard','\u296E':'udhar','\u296F':'duhar','\u2970':'RoundImplies','\u2971':'erarr','\u2972':'simrarr','\u2973':'larrsim','\u2974':'rarrsim','\u2975':'rarrap','\u2976':'ltlarr','\u2978':'gtrarr','\u2979':'subrarr','\u297B':'suplarr','\u297C':'lfisht','\u297D':'rfisht','\u297E':'ufisht','\u297F':'dfisht','\u299A':'vzigzag','\u299C':'vangrt','\u299D':'angrtvbd','\u29A4':'ange','\u29A5':'range','\u29A6':'dwangle','\u29A7':'uwangle','\u29A8':'angmsdaa','\u29A9':'angmsdab','\u29AA':'angmsdac','\u29AB':'angmsdad','\u29AC':'angmsdae','\u29AD':'angmsdaf','\u29AE':'angmsdag','\u29AF':'angmsdah','\u29B0':'bemptyv','\u29B1':'demptyv','\u29B2':'cemptyv','\u29B3':'raemptyv','\u29B4':'laemptyv','\u29B5':'ohbar','\u29B6':'omid','\u29B7':'opar','\u29B9':'operp','\u29BB':'olcross','\u29BC':'odsold','\u29BE':'olcir','\u29BF':'ofcir','\u29C0':'olt','\u29C1':'ogt','\u29C2':'cirscir','\u29C3':'cirE','\u29C4':'solb','\u29C5':'bsolb','\u29C9':'boxbox','\u29CD':'trisb','\u29CE':'rtriltri','\u29CF':'LeftTriangleBar','\u29CF\u0338':'NotLeftTriangleBar','\u29D0':'RightTriangleBar','\u29D0\u0338':'NotRightTriangleBar','\u29DC':'iinfin','\u29DD':'infintie','\u29DE':'nvinfin','\u29E3':'eparsl','\u29E4':'smeparsl','\u29E5':'eqvparsl','\u29EB':'lozf','\u29F4':'RuleDelayed','\u29F6':'dsol','\u2A00':'xodot','\u2A01':'xoplus','\u2A02':'xotime','\u2A04':'xuplus','\u2A06':'xsqcup','\u2A0D':'fpartint','\u2A10':'cirfnint','\u2A11':'awint','\u2A12':'rppolint','\u2A13':'scpolint','\u2A14':'npolint','\u2A15':'pointint','\u2A16':'quatint','\u2A17':'intlarhk','\u2A22':'pluscir','\u2A23':'plusacir','\u2A24':'simplus','\u2A25':'plusdu','\u2A26':'plussim','\u2A27':'plustwo','\u2A29':'mcomma','\u2A2A':'minusdu','\u2A2D':'loplus','\u2A2E':'roplus','\u2A2F':'Cross','\u2A30':'timesd','\u2A31':'timesbar','\u2A33':'smashp','\u2A34':'lotimes','\u2A35':'rotimes','\u2A36':'otimesas','\u2A37':'Otimes','\u2A38':'odiv','\u2A39':'triplus','\u2A3A':'triminus','\u2A3B':'tritime','\u2A3C':'iprod','\u2A3F':'amalg','\u2A40':'capdot','\u2A42':'ncup','\u2A43':'ncap','\u2A44':'capand','\u2A45':'cupor','\u2A46':'cupcap','\u2A47':'capcup','\u2A48':'cupbrcap','\u2A49':'capbrcup','\u2A4A':'cupcup','\u2A4B':'capcap','\u2A4C':'ccups','\u2A4D':'ccaps','\u2A50':'ccupssm','\u2A53':'And','\u2A54':'Or','\u2A55':'andand','\u2A56':'oror','\u2A57':'orslope','\u2A58':'andslope','\u2A5A':'andv','\u2A5B':'orv','\u2A5C':'andd','\u2A5D':'ord','\u2A5F':'wedbar','\u2A66':'sdote','\u2A6A':'simdot','\u2A6D':'congdot','\u2A6D\u0338':'ncongdot','\u2A6E':'easter','\u2A6F':'apacir','\u2A70':'apE','\u2A70\u0338':'napE','\u2A71':'eplus','\u2A72':'pluse','\u2A73':'Esim','\u2A77':'eDDot','\u2A78':'equivDD','\u2A79':'ltcir','\u2A7A':'gtcir','\u2A7B':'ltquest','\u2A7C':'gtquest','\u2A7D':'les','\u2A7D\u0338':'nles','\u2A7E':'ges','\u2A7E\u0338':'nges','\u2A7F':'lesdot','\u2A80':'gesdot','\u2A81':'lesdoto','\u2A82':'gesdoto','\u2A83':'lesdotor','\u2A84':'gesdotol','\u2A85':'lap','\u2A86':'gap','\u2A87':'lne','\u2A88':'gne','\u2A89':'lnap','\u2A8A':'gnap','\u2A8B':'lEg','\u2A8C':'gEl','\u2A8D':'lsime','\u2A8E':'gsime','\u2A8F':'lsimg','\u2A90':'gsiml','\u2A91':'lgE','\u2A92':'glE','\u2A93':'lesges','\u2A94':'gesles','\u2A95':'els','\u2A96':'egs','\u2A97':'elsdot','\u2A98':'egsdot','\u2A99':'el','\u2A9A':'eg','\u2A9D':'siml','\u2A9E':'simg','\u2A9F':'simlE','\u2AA0':'simgE','\u2AA1':'LessLess','\u2AA1\u0338':'NotNestedLessLess','\u2AA2':'GreaterGreater','\u2AA2\u0338':'NotNestedGreaterGreater','\u2AA4':'glj','\u2AA5':'gla','\u2AA6':'ltcc','\u2AA7':'gtcc','\u2AA8':'lescc','\u2AA9':'gescc','\u2AAA':'smt','\u2AAB':'lat','\u2AAC':'smte','\u2AAC\uFE00':'smtes','\u2AAD':'late','\u2AAD\uFE00':'lates','\u2AAE':'bumpE','\u2AAF':'pre','\u2AAF\u0338':'npre','\u2AB0':'sce','\u2AB0\u0338':'nsce','\u2AB3':'prE','\u2AB4':'scE','\u2AB5':'prnE','\u2AB6':'scnE','\u2AB7':'prap','\u2AB8':'scap','\u2AB9':'prnap','\u2ABA':'scnap','\u2ABB':'Pr','\u2ABC':'Sc','\u2ABD':'subdot','\u2ABE':'supdot','\u2ABF':'subplus','\u2AC0':'supplus','\u2AC1':'submult','\u2AC2':'supmult','\u2AC3':'subedot','\u2AC4':'supedot','\u2AC5':'subE','\u2AC5\u0338':'nsubE','\u2AC6':'supE','\u2AC6\u0338':'nsupE','\u2AC7':'subsim','\u2AC8':'supsim','\u2ACB\uFE00':'vsubnE','\u2ACB':'subnE','\u2ACC\uFE00':'vsupnE','\u2ACC':'supnE','\u2ACF':'csub','\u2AD0':'csup','\u2AD1':'csube','\u2AD2':'csupe','\u2AD3':'subsup','\u2AD4':'supsub','\u2AD5':'subsub','\u2AD6':'supsup','\u2AD7':'suphsub','\u2AD8':'supdsub','\u2AD9':'forkv','\u2ADA':'topfork','\u2ADB':'mlcp','\u2AE4':'Dashv','\u2AE6':'Vdashl','\u2AE7':'Barv','\u2AE8':'vBar','\u2AE9':'vBarv','\u2AEB':'Vbar','\u2AEC':'Not','\u2AED':'bNot','\u2AEE':'rnmid','\u2AEF':'cirmid','\u2AF0':'midcir','\u2AF1':'topcir','\u2AF2':'nhpar','\u2AF3':'parsim','\u2AFD':'parsl','\u2AFD\u20E5':'nparsl','\u266D':'flat','\u266E':'natur','\u266F':'sharp','\xA4':'curren','\xA2':'cent','$':'dollar','\xA3':'pound','\xA5':'yen','\u20AC':'euro','\xB9':'sup1','\xBD':'half','\u2153':'frac13','\xBC':'frac14','\u2155':'frac15','\u2159':'frac16','\u215B':'frac18','\xB2':'sup2','\u2154':'frac23','\u2156':'frac25','\xB3':'sup3','\xBE':'frac34','\u2157':'frac35','\u215C':'frac38','\u2158':'frac45','\u215A':'frac56','\u215D':'frac58','\u215E':'frac78','\uD835\uDCB6':'ascr','\uD835\uDD52':'aopf','\uD835\uDD1E':'afr','\uD835\uDD38':'Aopf','\uD835\uDD04':'Afr','\uD835\uDC9C':'Ascr','\xAA':'ordf','\xE1':'aacute','\xC1':'Aacute','\xE0':'agrave','\xC0':'Agrave','\u0103':'abreve','\u0102':'Abreve','\xE2':'acirc','\xC2':'Acirc','\xE5':'aring','\xC5':'angst','\xE4':'auml','\xC4':'Auml','\xE3':'atilde','\xC3':'Atilde','\u0105':'aogon','\u0104':'Aogon','\u0101':'amacr','\u0100':'Amacr','\xE6':'aelig','\xC6':'AElig','\uD835\uDCB7':'bscr','\uD835\uDD53':'bopf','\uD835\uDD1F':'bfr','\uD835\uDD39':'Bopf','\u212C':'Bscr','\uD835\uDD05':'Bfr','\uD835\uDD20':'cfr','\uD835\uDCB8':'cscr','\uD835\uDD54':'copf','\u212D':'Cfr','\uD835\uDC9E':'Cscr','\u2102':'Copf','\u0107':'cacute','\u0106':'Cacute','\u0109':'ccirc','\u0108':'Ccirc','\u010D':'ccaron','\u010C':'Ccaron','\u010B':'cdot','\u010A':'Cdot','\xE7':'ccedil','\xC7':'Ccedil','\u2105':'incare','\uD835\uDD21':'dfr','\u2146':'dd','\uD835\uDD55':'dopf','\uD835\uDCB9':'dscr','\uD835\uDC9F':'Dscr','\uD835\uDD07':'Dfr','\u2145':'DD','\uD835\uDD3B':'Dopf','\u010F':'dcaron','\u010E':'Dcaron','\u0111':'dstrok','\u0110':'Dstrok','\xF0':'eth','\xD0':'ETH','\u2147':'ee','\u212F':'escr','\uD835\uDD22':'efr','\uD835\uDD56':'eopf','\u2130':'Escr','\uD835\uDD08':'Efr','\uD835\uDD3C':'Eopf','\xE9':'eacute','\xC9':'Eacute','\xE8':'egrave','\xC8':'Egrave','\xEA':'ecirc','\xCA':'Ecirc','\u011B':'ecaron','\u011A':'Ecaron','\xEB':'euml','\xCB':'Euml','\u0117':'edot','\u0116':'Edot','\u0119':'eogon','\u0118':'Eogon','\u0113':'emacr','\u0112':'Emacr','\uD835\uDD23':'ffr','\uD835\uDD57':'fopf','\uD835\uDCBB':'fscr','\uD835\uDD09':'Ffr','\uD835\uDD3D':'Fopf','\u2131':'Fscr','\uFB00':'fflig','\uFB03':'ffilig','\uFB04':'ffllig','\uFB01':'filig','fj':'fjlig','\uFB02':'fllig','\u0192':'fnof','\u210A':'gscr','\uD835\uDD58':'gopf','\uD835\uDD24':'gfr','\uD835\uDCA2':'Gscr','\uD835\uDD3E':'Gopf','\uD835\uDD0A':'Gfr','\u01F5':'gacute','\u011F':'gbreve','\u011E':'Gbreve','\u011D':'gcirc','\u011C':'Gcirc','\u0121':'gdot','\u0120':'Gdot','\u0122':'Gcedil','\uD835\uDD25':'hfr','\u210E':'planckh','\uD835\uDCBD':'hscr','\uD835\uDD59':'hopf','\u210B':'Hscr','\u210C':'Hfr','\u210D':'Hopf','\u0125':'hcirc','\u0124':'Hcirc','\u210F':'hbar','\u0127':'hstrok','\u0126':'Hstrok','\uD835\uDD5A':'iopf','\uD835\uDD26':'ifr','\uD835\uDCBE':'iscr','\u2148':'ii','\uD835\uDD40':'Iopf','\u2110':'Iscr','\u2111':'Im','\xED':'iacute','\xCD':'Iacute','\xEC':'igrave','\xCC':'Igrave','\xEE':'icirc','\xCE':'Icirc','\xEF':'iuml','\xCF':'Iuml','\u0129':'itilde','\u0128':'Itilde','\u0130':'Idot','\u012F':'iogon','\u012E':'Iogon','\u012B':'imacr','\u012A':'Imacr','\u0133':'ijlig','\u0132':'IJlig','\u0131':'imath','\uD835\uDCBF':'jscr','\uD835\uDD5B':'jopf','\uD835\uDD27':'jfr','\uD835\uDCA5':'Jscr','\uD835\uDD0D':'Jfr','\uD835\uDD41':'Jopf','\u0135':'jcirc','\u0134':'Jcirc','\u0237':'jmath','\uD835\uDD5C':'kopf','\uD835\uDCC0':'kscr','\uD835\uDD28':'kfr','\uD835\uDCA6':'Kscr','\uD835\uDD42':'Kopf','\uD835\uDD0E':'Kfr','\u0137':'kcedil','\u0136':'Kcedil','\uD835\uDD29':'lfr','\uD835\uDCC1':'lscr','\u2113':'ell','\uD835\uDD5D':'lopf','\u2112':'Lscr','\uD835\uDD0F':'Lfr','\uD835\uDD43':'Lopf','\u013A':'lacute','\u0139':'Lacute','\u013E':'lcaron','\u013D':'Lcaron','\u013C':'lcedil','\u013B':'Lcedil','\u0142':'lstrok','\u0141':'Lstrok','\u0140':'lmidot','\u013F':'Lmidot','\uD835\uDD2A':'mfr','\uD835\uDD5E':'mopf','\uD835\uDCC2':'mscr','\uD835\uDD10':'Mfr','\uD835\uDD44':'Mopf','\u2133':'Mscr','\uD835\uDD2B':'nfr','\uD835\uDD5F':'nopf','\uD835\uDCC3':'nscr','\u2115':'Nopf','\uD835\uDCA9':'Nscr','\uD835\uDD11':'Nfr','\u0144':'nacute','\u0143':'Nacute','\u0148':'ncaron','\u0147':'Ncaron','\xF1':'ntilde','\xD1':'Ntilde','\u0146':'ncedil','\u0145':'Ncedil','\u2116':'numero','\u014B':'eng','\u014A':'ENG','\uD835\uDD60':'oopf','\uD835\uDD2C':'ofr','\u2134':'oscr','\uD835\uDCAA':'Oscr','\uD835\uDD12':'Ofr','\uD835\uDD46':'Oopf','\xBA':'ordm','\xF3':'oacute','\xD3':'Oacute','\xF2':'ograve','\xD2':'Ograve','\xF4':'ocirc','\xD4':'Ocirc','\xF6':'ouml','\xD6':'Ouml','\u0151':'odblac','\u0150':'Odblac','\xF5':'otilde','\xD5':'Otilde','\xF8':'oslash','\xD8':'Oslash','\u014D':'omacr','\u014C':'Omacr','\u0153':'oelig','\u0152':'OElig','\uD835\uDD2D':'pfr','\uD835\uDCC5':'pscr','\uD835\uDD61':'popf','\u2119':'Popf','\uD835\uDD13':'Pfr','\uD835\uDCAB':'Pscr','\uD835\uDD62':'qopf','\uD835\uDD2E':'qfr','\uD835\uDCC6':'qscr','\uD835\uDCAC':'Qscr','\uD835\uDD14':'Qfr','\u211A':'Qopf','\u0138':'kgreen','\uD835\uDD2F':'rfr','\uD835\uDD63':'ropf','\uD835\uDCC7':'rscr','\u211B':'Rscr','\u211C':'Re','\u211D':'Ropf','\u0155':'racute','\u0154':'Racute','\u0159':'rcaron','\u0158':'Rcaron','\u0157':'rcedil','\u0156':'Rcedil','\uD835\uDD64':'sopf','\uD835\uDCC8':'sscr','\uD835\uDD30':'sfr','\uD835\uDD4A':'Sopf','\uD835\uDD16':'Sfr','\uD835\uDCAE':'Sscr','\u24C8':'oS','\u015B':'sacute','\u015A':'Sacute','\u015D':'scirc','\u015C':'Scirc','\u0161':'scaron','\u0160':'Scaron','\u015F':'scedil','\u015E':'Scedil','\xDF':'szlig','\uD835\uDD31':'tfr','\uD835\uDCC9':'tscr','\uD835\uDD65':'topf','\uD835\uDCAF':'Tscr','\uD835\uDD17':'Tfr','\uD835\uDD4B':'Topf','\u0165':'tcaron','\u0164':'Tcaron','\u0163':'tcedil','\u0162':'Tcedil','\u2122':'trade','\u0167':'tstrok','\u0166':'Tstrok','\uD835\uDCCA':'uscr','\uD835\uDD66':'uopf','\uD835\uDD32':'ufr','\uD835\uDD4C':'Uopf','\uD835\uDD18':'Ufr','\uD835\uDCB0':'Uscr','\xFA':'uacute','\xDA':'Uacute','\xF9':'ugrave','\xD9':'Ugrave','\u016D':'ubreve','\u016C':'Ubreve','\xFB':'ucirc','\xDB':'Ucirc','\u016F':'uring','\u016E':'Uring','\xFC':'uuml','\xDC':'Uuml','\u0171':'udblac','\u0170':'Udblac','\u0169':'utilde','\u0168':'Utilde','\u0173':'uogon','\u0172':'Uogon','\u016B':'umacr','\u016A':'Umacr','\uD835\uDD33':'vfr','\uD835\uDD67':'vopf','\uD835\uDCCB':'vscr','\uD835\uDD19':'Vfr','\uD835\uDD4D':'Vopf','\uD835\uDCB1':'Vscr','\uD835\uDD68':'wopf','\uD835\uDCCC':'wscr','\uD835\uDD34':'wfr','\uD835\uDCB2':'Wscr','\uD835\uDD4E':'Wopf','\uD835\uDD1A':'Wfr','\u0175':'wcirc','\u0174':'Wcirc','\uD835\uDD35':'xfr','\uD835\uDCCD':'xscr','\uD835\uDD69':'xopf','\uD835\uDD4F':'Xopf','\uD835\uDD1B':'Xfr','\uD835\uDCB3':'Xscr','\uD835\uDD36':'yfr','\uD835\uDCCE':'yscr','\uD835\uDD6A':'yopf','\uD835\uDCB4':'Yscr','\uD835\uDD1C':'Yfr','\uD835\uDD50':'Yopf','\xFD':'yacute','\xDD':'Yacute','\u0177':'ycirc','\u0176':'Ycirc','\xFF':'yuml','\u0178':'Yuml','\uD835\uDCCF':'zscr','\uD835\uDD37':'zfr','\uD835\uDD6B':'zopf','\u2128':'Zfr','\u2124':'Zopf','\uD835\uDCB5':'Zscr','\u017A':'zacute','\u0179':'Zacute','\u017E':'zcaron','\u017D':'Zcaron','\u017C':'zdot','\u017B':'Zdot','\u01B5':'imped','\xFE':'thorn','\xDE':'THORN','\u0149':'napos','\u03B1':'alpha','\u0391':'Alpha','\u03B2':'beta','\u0392':'Beta','\u03B3':'gamma','\u0393':'Gamma','\u03B4':'delta','\u0394':'Delta','\u03B5':'epsi','\u03F5':'epsiv','\u0395':'Epsilon','\u03DD':'gammad','\u03DC':'Gammad','\u03B6':'zeta','\u0396':'Zeta','\u03B7':'eta','\u0397':'Eta','\u03B8':'theta','\u03D1':'thetav','\u0398':'Theta','\u03B9':'iota','\u0399':'Iota','\u03BA':'kappa','\u03F0':'kappav','\u039A':'Kappa','\u03BB':'lambda','\u039B':'Lambda','\u03BC':'mu','\xB5':'micro','\u039C':'Mu','\u03BD':'nu','\u039D':'Nu','\u03BE':'xi','\u039E':'Xi','\u03BF':'omicron','\u039F':'Omicron','\u03C0':'pi','\u03D6':'piv','\u03A0':'Pi','\u03C1':'rho','\u03F1':'rhov','\u03A1':'Rho','\u03C3':'sigma','\u03A3':'Sigma','\u03C2':'sigmaf','\u03C4':'tau','\u03A4':'Tau','\u03C5':'upsi','\u03A5':'Upsilon','\u03D2':'Upsi','\u03C6':'phi','\u03D5':'phiv','\u03A6':'Phi','\u03C7':'chi','\u03A7':'Chi','\u03C8':'psi','\u03A8':'Psi','\u03C9':'omega','\u03A9':'ohm','\u0430':'acy','\u0410':'Acy','\u0431':'bcy','\u0411':'Bcy','\u0432':'vcy','\u0412':'Vcy','\u0433':'gcy','\u0413':'Gcy','\u0453':'gjcy','\u0403':'GJcy','\u0434':'dcy','\u0414':'Dcy','\u0452':'djcy','\u0402':'DJcy','\u0435':'iecy','\u0415':'IEcy','\u0451':'iocy','\u0401':'IOcy','\u0454':'jukcy','\u0404':'Jukcy','\u0436':'zhcy','\u0416':'ZHcy','\u0437':'zcy','\u0417':'Zcy','\u0455':'dscy','\u0405':'DScy','\u0438':'icy','\u0418':'Icy','\u0456':'iukcy','\u0406':'Iukcy','\u0457':'yicy','\u0407':'YIcy','\u0439':'jcy','\u0419':'Jcy','\u0458':'jsercy','\u0408':'Jsercy','\u043A':'kcy','\u041A':'Kcy','\u045C':'kjcy','\u040C':'KJcy','\u043B':'lcy','\u041B':'Lcy','\u0459':'ljcy','\u0409':'LJcy','\u043C':'mcy','\u041C':'Mcy','\u043D':'ncy','\u041D':'Ncy','\u045A':'njcy','\u040A':'NJcy','\u043E':'ocy','\u041E':'Ocy','\u043F':'pcy','\u041F':'Pcy','\u0440':'rcy','\u0420':'Rcy','\u0441':'scy','\u0421':'Scy','\u0442':'tcy','\u0422':'Tcy','\u045B':'tshcy','\u040B':'TSHcy','\u0443':'ucy','\u0423':'Ucy','\u045E':'ubrcy','\u040E':'Ubrcy','\u0444':'fcy','\u0424':'Fcy','\u0445':'khcy','\u0425':'KHcy','\u0446':'tscy','\u0426':'TScy','\u0447':'chcy','\u0427':'CHcy','\u045F':'dzcy','\u040F':'DZcy','\u0448':'shcy','\u0428':'SHcy','\u0449':'shchcy','\u0429':'SHCHcy','\u044A':'hardcy','\u042A':'HARDcy','\u044B':'ycy','\u042B':'Ycy','\u044C':'softcy','\u042C':'SOFTcy','\u044D':'ecy','\u042D':'Ecy','\u044E':'yucy','\u042E':'YUcy','\u044F':'yacy','\u042F':'YAcy','\u2135':'aleph','\u2136':'beth','\u2137':'gimel','\u2138':'daleth'};

	var regexEscape = /["&'<>`]/g;
	var escapeMap = {
		'"': '&quot;',
		'&': '&amp;',
		'\'': '&#x27;',
		'<': '&lt;',
		// See https://mathiasbynens.be/notes/ambiguous-ampersands: in HTML, the
		// following is not strictly necessary unless it’s part of a tag or an
		// unquoted attribute value. We’re only escaping it to support those
		// situations, and for XML support.
		'>': '&gt;',
		// In Internet Explorer ≤ 8, the backtick character can be used
		// to break out of (un)quoted attribute values or HTML comments.
		// See http://html5sec.org/#102, http://html5sec.org/#108, and
		// http://html5sec.org/#133.
		'`': '&#x60;'
	};

	var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
	var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
	var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
	var decodeMap = {'aacute':'\xE1','Aacute':'\xC1','abreve':'\u0103','Abreve':'\u0102','ac':'\u223E','acd':'\u223F','acE':'\u223E\u0333','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','acy':'\u0430','Acy':'\u0410','aelig':'\xE6','AElig':'\xC6','af':'\u2061','afr':'\uD835\uDD1E','Afr':'\uD835\uDD04','agrave':'\xE0','Agrave':'\xC0','alefsym':'\u2135','aleph':'\u2135','alpha':'\u03B1','Alpha':'\u0391','amacr':'\u0101','Amacr':'\u0100','amalg':'\u2A3F','amp':'&','AMP':'&','and':'\u2227','And':'\u2A53','andand':'\u2A55','andd':'\u2A5C','andslope':'\u2A58','andv':'\u2A5A','ang':'\u2220','ange':'\u29A4','angle':'\u2220','angmsd':'\u2221','angmsdaa':'\u29A8','angmsdab':'\u29A9','angmsdac':'\u29AA','angmsdad':'\u29AB','angmsdae':'\u29AC','angmsdaf':'\u29AD','angmsdag':'\u29AE','angmsdah':'\u29AF','angrt':'\u221F','angrtvb':'\u22BE','angrtvbd':'\u299D','angsph':'\u2222','angst':'\xC5','angzarr':'\u237C','aogon':'\u0105','Aogon':'\u0104','aopf':'\uD835\uDD52','Aopf':'\uD835\uDD38','ap':'\u2248','apacir':'\u2A6F','ape':'\u224A','apE':'\u2A70','apid':'\u224B','apos':'\'','ApplyFunction':'\u2061','approx':'\u2248','approxeq':'\u224A','aring':'\xE5','Aring':'\xC5','ascr':'\uD835\uDCB6','Ascr':'\uD835\uDC9C','Assign':'\u2254','ast':'*','asymp':'\u2248','asympeq':'\u224D','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','awconint':'\u2233','awint':'\u2A11','backcong':'\u224C','backepsilon':'\u03F6','backprime':'\u2035','backsim':'\u223D','backsimeq':'\u22CD','Backslash':'\u2216','Barv':'\u2AE7','barvee':'\u22BD','barwed':'\u2305','Barwed':'\u2306','barwedge':'\u2305','bbrk':'\u23B5','bbrktbrk':'\u23B6','bcong':'\u224C','bcy':'\u0431','Bcy':'\u0411','bdquo':'\u201E','becaus':'\u2235','because':'\u2235','Because':'\u2235','bemptyv':'\u29B0','bepsi':'\u03F6','bernou':'\u212C','Bernoullis':'\u212C','beta':'\u03B2','Beta':'\u0392','beth':'\u2136','between':'\u226C','bfr':'\uD835\uDD1F','Bfr':'\uD835\uDD05','bigcap':'\u22C2','bigcirc':'\u25EF','bigcup':'\u22C3','bigodot':'\u2A00','bigoplus':'\u2A01','bigotimes':'\u2A02','bigsqcup':'\u2A06','bigstar':'\u2605','bigtriangledown':'\u25BD','bigtriangleup':'\u25B3','biguplus':'\u2A04','bigvee':'\u22C1','bigwedge':'\u22C0','bkarow':'\u290D','blacklozenge':'\u29EB','blacksquare':'\u25AA','blacktriangle':'\u25B4','blacktriangledown':'\u25BE','blacktriangleleft':'\u25C2','blacktriangleright':'\u25B8','blank':'\u2423','blk12':'\u2592','blk14':'\u2591','blk34':'\u2593','block':'\u2588','bne':'=\u20E5','bnequiv':'\u2261\u20E5','bnot':'\u2310','bNot':'\u2AED','bopf':'\uD835\uDD53','Bopf':'\uD835\uDD39','bot':'\u22A5','bottom':'\u22A5','bowtie':'\u22C8','boxbox':'\u29C9','boxdl':'\u2510','boxdL':'\u2555','boxDl':'\u2556','boxDL':'\u2557','boxdr':'\u250C','boxdR':'\u2552','boxDr':'\u2553','boxDR':'\u2554','boxh':'\u2500','boxH':'\u2550','boxhd':'\u252C','boxhD':'\u2565','boxHd':'\u2564','boxHD':'\u2566','boxhu':'\u2534','boxhU':'\u2568','boxHu':'\u2567','boxHU':'\u2569','boxminus':'\u229F','boxplus':'\u229E','boxtimes':'\u22A0','boxul':'\u2518','boxuL':'\u255B','boxUl':'\u255C','boxUL':'\u255D','boxur':'\u2514','boxuR':'\u2558','boxUr':'\u2559','boxUR':'\u255A','boxv':'\u2502','boxV':'\u2551','boxvh':'\u253C','boxvH':'\u256A','boxVh':'\u256B','boxVH':'\u256C','boxvl':'\u2524','boxvL':'\u2561','boxVl':'\u2562','boxVL':'\u2563','boxvr':'\u251C','boxvR':'\u255E','boxVr':'\u255F','boxVR':'\u2560','bprime':'\u2035','breve':'\u02D8','Breve':'\u02D8','brvbar':'\xA6','bscr':'\uD835\uDCB7','Bscr':'\u212C','bsemi':'\u204F','bsim':'\u223D','bsime':'\u22CD','bsol':'\\','bsolb':'\u29C5','bsolhsub':'\u27C8','bull':'\u2022','bullet':'\u2022','bump':'\u224E','bumpe':'\u224F','bumpE':'\u2AAE','bumpeq':'\u224F','Bumpeq':'\u224E','cacute':'\u0107','Cacute':'\u0106','cap':'\u2229','Cap':'\u22D2','capand':'\u2A44','capbrcup':'\u2A49','capcap':'\u2A4B','capcup':'\u2A47','capdot':'\u2A40','CapitalDifferentialD':'\u2145','caps':'\u2229\uFE00','caret':'\u2041','caron':'\u02C7','Cayleys':'\u212D','ccaps':'\u2A4D','ccaron':'\u010D','Ccaron':'\u010C','ccedil':'\xE7','Ccedil':'\xC7','ccirc':'\u0109','Ccirc':'\u0108','Cconint':'\u2230','ccups':'\u2A4C','ccupssm':'\u2A50','cdot':'\u010B','Cdot':'\u010A','cedil':'\xB8','Cedilla':'\xB8','cemptyv':'\u29B2','cent':'\xA2','centerdot':'\xB7','CenterDot':'\xB7','cfr':'\uD835\uDD20','Cfr':'\u212D','chcy':'\u0447','CHcy':'\u0427','check':'\u2713','checkmark':'\u2713','chi':'\u03C7','Chi':'\u03A7','cir':'\u25CB','circ':'\u02C6','circeq':'\u2257','circlearrowleft':'\u21BA','circlearrowright':'\u21BB','circledast':'\u229B','circledcirc':'\u229A','circleddash':'\u229D','CircleDot':'\u2299','circledR':'\xAE','circledS':'\u24C8','CircleMinus':'\u2296','CirclePlus':'\u2295','CircleTimes':'\u2297','cire':'\u2257','cirE':'\u29C3','cirfnint':'\u2A10','cirmid':'\u2AEF','cirscir':'\u29C2','ClockwiseContourIntegral':'\u2232','CloseCurlyDoubleQuote':'\u201D','CloseCurlyQuote':'\u2019','clubs':'\u2663','clubsuit':'\u2663','colon':':','Colon':'\u2237','colone':'\u2254','Colone':'\u2A74','coloneq':'\u2254','comma':',','commat':'@','comp':'\u2201','compfn':'\u2218','complement':'\u2201','complexes':'\u2102','cong':'\u2245','congdot':'\u2A6D','Congruent':'\u2261','conint':'\u222E','Conint':'\u222F','ContourIntegral':'\u222E','copf':'\uD835\uDD54','Copf':'\u2102','coprod':'\u2210','Coproduct':'\u2210','copy':'\xA9','COPY':'\xA9','copysr':'\u2117','CounterClockwiseContourIntegral':'\u2233','crarr':'\u21B5','cross':'\u2717','Cross':'\u2A2F','cscr':'\uD835\uDCB8','Cscr':'\uD835\uDC9E','csub':'\u2ACF','csube':'\u2AD1','csup':'\u2AD0','csupe':'\u2AD2','ctdot':'\u22EF','cudarrl':'\u2938','cudarrr':'\u2935','cuepr':'\u22DE','cuesc':'\u22DF','cularr':'\u21B6','cularrp':'\u293D','cup':'\u222A','Cup':'\u22D3','cupbrcap':'\u2A48','cupcap':'\u2A46','CupCap':'\u224D','cupcup':'\u2A4A','cupdot':'\u228D','cupor':'\u2A45','cups':'\u222A\uFE00','curarr':'\u21B7','curarrm':'\u293C','curlyeqprec':'\u22DE','curlyeqsucc':'\u22DF','curlyvee':'\u22CE','curlywedge':'\u22CF','curren':'\xA4','curvearrowleft':'\u21B6','curvearrowright':'\u21B7','cuvee':'\u22CE','cuwed':'\u22CF','cwconint':'\u2232','cwint':'\u2231','cylcty':'\u232D','dagger':'\u2020','Dagger':'\u2021','daleth':'\u2138','darr':'\u2193','dArr':'\u21D3','Darr':'\u21A1','dash':'\u2010','dashv':'\u22A3','Dashv':'\u2AE4','dbkarow':'\u290F','dblac':'\u02DD','dcaron':'\u010F','Dcaron':'\u010E','dcy':'\u0434','Dcy':'\u0414','dd':'\u2146','DD':'\u2145','ddagger':'\u2021','ddarr':'\u21CA','DDotrahd':'\u2911','ddotseq':'\u2A77','deg':'\xB0','Del':'\u2207','delta':'\u03B4','Delta':'\u0394','demptyv':'\u29B1','dfisht':'\u297F','dfr':'\uD835\uDD21','Dfr':'\uD835\uDD07','dHar':'\u2965','dharl':'\u21C3','dharr':'\u21C2','DiacriticalAcute':'\xB4','DiacriticalDot':'\u02D9','DiacriticalDoubleAcute':'\u02DD','DiacriticalGrave':'`','DiacriticalTilde':'\u02DC','diam':'\u22C4','diamond':'\u22C4','Diamond':'\u22C4','diamondsuit':'\u2666','diams':'\u2666','die':'\xA8','DifferentialD':'\u2146','digamma':'\u03DD','disin':'\u22F2','div':'\xF7','divide':'\xF7','divideontimes':'\u22C7','divonx':'\u22C7','djcy':'\u0452','DJcy':'\u0402','dlcorn':'\u231E','dlcrop':'\u230D','dollar':'$','dopf':'\uD835\uDD55','Dopf':'\uD835\uDD3B','dot':'\u02D9','Dot':'\xA8','DotDot':'\u20DC','doteq':'\u2250','doteqdot':'\u2251','DotEqual':'\u2250','dotminus':'\u2238','dotplus':'\u2214','dotsquare':'\u22A1','doublebarwedge':'\u2306','DoubleContourIntegral':'\u222F','DoubleDot':'\xA8','DoubleDownArrow':'\u21D3','DoubleLeftArrow':'\u21D0','DoubleLeftRightArrow':'\u21D4','DoubleLeftTee':'\u2AE4','DoubleLongLeftArrow':'\u27F8','DoubleLongLeftRightArrow':'\u27FA','DoubleLongRightArrow':'\u27F9','DoubleRightArrow':'\u21D2','DoubleRightTee':'\u22A8','DoubleUpArrow':'\u21D1','DoubleUpDownArrow':'\u21D5','DoubleVerticalBar':'\u2225','downarrow':'\u2193','Downarrow':'\u21D3','DownArrow':'\u2193','DownArrowBar':'\u2913','DownArrowUpArrow':'\u21F5','DownBreve':'\u0311','downdownarrows':'\u21CA','downharpoonleft':'\u21C3','downharpoonright':'\u21C2','DownLeftRightVector':'\u2950','DownLeftTeeVector':'\u295E','DownLeftVector':'\u21BD','DownLeftVectorBar':'\u2956','DownRightTeeVector':'\u295F','DownRightVector':'\u21C1','DownRightVectorBar':'\u2957','DownTee':'\u22A4','DownTeeArrow':'\u21A7','drbkarow':'\u2910','drcorn':'\u231F','drcrop':'\u230C','dscr':'\uD835\uDCB9','Dscr':'\uD835\uDC9F','dscy':'\u0455','DScy':'\u0405','dsol':'\u29F6','dstrok':'\u0111','Dstrok':'\u0110','dtdot':'\u22F1','dtri':'\u25BF','dtrif':'\u25BE','duarr':'\u21F5','duhar':'\u296F','dwangle':'\u29A6','dzcy':'\u045F','DZcy':'\u040F','dzigrarr':'\u27FF','eacute':'\xE9','Eacute':'\xC9','easter':'\u2A6E','ecaron':'\u011B','Ecaron':'\u011A','ecir':'\u2256','ecirc':'\xEA','Ecirc':'\xCA','ecolon':'\u2255','ecy':'\u044D','Ecy':'\u042D','eDDot':'\u2A77','edot':'\u0117','eDot':'\u2251','Edot':'\u0116','ee':'\u2147','efDot':'\u2252','efr':'\uD835\uDD22','Efr':'\uD835\uDD08','eg':'\u2A9A','egrave':'\xE8','Egrave':'\xC8','egs':'\u2A96','egsdot':'\u2A98','el':'\u2A99','Element':'\u2208','elinters':'\u23E7','ell':'\u2113','els':'\u2A95','elsdot':'\u2A97','emacr':'\u0113','Emacr':'\u0112','empty':'\u2205','emptyset':'\u2205','EmptySmallSquare':'\u25FB','emptyv':'\u2205','EmptyVerySmallSquare':'\u25AB','emsp':'\u2003','emsp13':'\u2004','emsp14':'\u2005','eng':'\u014B','ENG':'\u014A','ensp':'\u2002','eogon':'\u0119','Eogon':'\u0118','eopf':'\uD835\uDD56','Eopf':'\uD835\uDD3C','epar':'\u22D5','eparsl':'\u29E3','eplus':'\u2A71','epsi':'\u03B5','epsilon':'\u03B5','Epsilon':'\u0395','epsiv':'\u03F5','eqcirc':'\u2256','eqcolon':'\u2255','eqsim':'\u2242','eqslantgtr':'\u2A96','eqslantless':'\u2A95','Equal':'\u2A75','equals':'=','EqualTilde':'\u2242','equest':'\u225F','Equilibrium':'\u21CC','equiv':'\u2261','equivDD':'\u2A78','eqvparsl':'\u29E5','erarr':'\u2971','erDot':'\u2253','escr':'\u212F','Escr':'\u2130','esdot':'\u2250','esim':'\u2242','Esim':'\u2A73','eta':'\u03B7','Eta':'\u0397','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','euro':'\u20AC','excl':'!','exist':'\u2203','Exists':'\u2203','expectation':'\u2130','exponentiale':'\u2147','ExponentialE':'\u2147','fallingdotseq':'\u2252','fcy':'\u0444','Fcy':'\u0424','female':'\u2640','ffilig':'\uFB03','fflig':'\uFB00','ffllig':'\uFB04','ffr':'\uD835\uDD23','Ffr':'\uD835\uDD09','filig':'\uFB01','FilledSmallSquare':'\u25FC','FilledVerySmallSquare':'\u25AA','fjlig':'fj','flat':'\u266D','fllig':'\uFB02','fltns':'\u25B1','fnof':'\u0192','fopf':'\uD835\uDD57','Fopf':'\uD835\uDD3D','forall':'\u2200','ForAll':'\u2200','fork':'\u22D4','forkv':'\u2AD9','Fouriertrf':'\u2131','fpartint':'\u2A0D','frac12':'\xBD','frac13':'\u2153','frac14':'\xBC','frac15':'\u2155','frac16':'\u2159','frac18':'\u215B','frac23':'\u2154','frac25':'\u2156','frac34':'\xBE','frac35':'\u2157','frac38':'\u215C','frac45':'\u2158','frac56':'\u215A','frac58':'\u215D','frac78':'\u215E','frasl':'\u2044','frown':'\u2322','fscr':'\uD835\uDCBB','Fscr':'\u2131','gacute':'\u01F5','gamma':'\u03B3','Gamma':'\u0393','gammad':'\u03DD','Gammad':'\u03DC','gap':'\u2A86','gbreve':'\u011F','Gbreve':'\u011E','Gcedil':'\u0122','gcirc':'\u011D','Gcirc':'\u011C','gcy':'\u0433','Gcy':'\u0413','gdot':'\u0121','Gdot':'\u0120','ge':'\u2265','gE':'\u2267','gel':'\u22DB','gEl':'\u2A8C','geq':'\u2265','geqq':'\u2267','geqslant':'\u2A7E','ges':'\u2A7E','gescc':'\u2AA9','gesdot':'\u2A80','gesdoto':'\u2A82','gesdotol':'\u2A84','gesl':'\u22DB\uFE00','gesles':'\u2A94','gfr':'\uD835\uDD24','Gfr':'\uD835\uDD0A','gg':'\u226B','Gg':'\u22D9','ggg':'\u22D9','gimel':'\u2137','gjcy':'\u0453','GJcy':'\u0403','gl':'\u2277','gla':'\u2AA5','glE':'\u2A92','glj':'\u2AA4','gnap':'\u2A8A','gnapprox':'\u2A8A','gne':'\u2A88','gnE':'\u2269','gneq':'\u2A88','gneqq':'\u2269','gnsim':'\u22E7','gopf':'\uD835\uDD58','Gopf':'\uD835\uDD3E','grave':'`','GreaterEqual':'\u2265','GreaterEqualLess':'\u22DB','GreaterFullEqual':'\u2267','GreaterGreater':'\u2AA2','GreaterLess':'\u2277','GreaterSlantEqual':'\u2A7E','GreaterTilde':'\u2273','gscr':'\u210A','Gscr':'\uD835\uDCA2','gsim':'\u2273','gsime':'\u2A8E','gsiml':'\u2A90','gt':'>','Gt':'\u226B','GT':'>','gtcc':'\u2AA7','gtcir':'\u2A7A','gtdot':'\u22D7','gtlPar':'\u2995','gtquest':'\u2A7C','gtrapprox':'\u2A86','gtrarr':'\u2978','gtrdot':'\u22D7','gtreqless':'\u22DB','gtreqqless':'\u2A8C','gtrless':'\u2277','gtrsim':'\u2273','gvertneqq':'\u2269\uFE00','gvnE':'\u2269\uFE00','Hacek':'\u02C7','hairsp':'\u200A','half':'\xBD','hamilt':'\u210B','hardcy':'\u044A','HARDcy':'\u042A','harr':'\u2194','hArr':'\u21D4','harrcir':'\u2948','harrw':'\u21AD','Hat':'^','hbar':'\u210F','hcirc':'\u0125','Hcirc':'\u0124','hearts':'\u2665','heartsuit':'\u2665','hellip':'\u2026','hercon':'\u22B9','hfr':'\uD835\uDD25','Hfr':'\u210C','HilbertSpace':'\u210B','hksearow':'\u2925','hkswarow':'\u2926','hoarr':'\u21FF','homtht':'\u223B','hookleftarrow':'\u21A9','hookrightarrow':'\u21AA','hopf':'\uD835\uDD59','Hopf':'\u210D','horbar':'\u2015','HorizontalLine':'\u2500','hscr':'\uD835\uDCBD','Hscr':'\u210B','hslash':'\u210F','hstrok':'\u0127','Hstrok':'\u0126','HumpDownHump':'\u224E','HumpEqual':'\u224F','hybull':'\u2043','hyphen':'\u2010','iacute':'\xED','Iacute':'\xCD','ic':'\u2063','icirc':'\xEE','Icirc':'\xCE','icy':'\u0438','Icy':'\u0418','Idot':'\u0130','iecy':'\u0435','IEcy':'\u0415','iexcl':'\xA1','iff':'\u21D4','ifr':'\uD835\uDD26','Ifr':'\u2111','igrave':'\xEC','Igrave':'\xCC','ii':'\u2148','iiiint':'\u2A0C','iiint':'\u222D','iinfin':'\u29DC','iiota':'\u2129','ijlig':'\u0133','IJlig':'\u0132','Im':'\u2111','imacr':'\u012B','Imacr':'\u012A','image':'\u2111','ImaginaryI':'\u2148','imagline':'\u2110','imagpart':'\u2111','imath':'\u0131','imof':'\u22B7','imped':'\u01B5','Implies':'\u21D2','in':'\u2208','incare':'\u2105','infin':'\u221E','infintie':'\u29DD','inodot':'\u0131','int':'\u222B','Int':'\u222C','intcal':'\u22BA','integers':'\u2124','Integral':'\u222B','intercal':'\u22BA','Intersection':'\u22C2','intlarhk':'\u2A17','intprod':'\u2A3C','InvisibleComma':'\u2063','InvisibleTimes':'\u2062','iocy':'\u0451','IOcy':'\u0401','iogon':'\u012F','Iogon':'\u012E','iopf':'\uD835\uDD5A','Iopf':'\uD835\uDD40','iota':'\u03B9','Iota':'\u0399','iprod':'\u2A3C','iquest':'\xBF','iscr':'\uD835\uDCBE','Iscr':'\u2110','isin':'\u2208','isindot':'\u22F5','isinE':'\u22F9','isins':'\u22F4','isinsv':'\u22F3','isinv':'\u2208','it':'\u2062','itilde':'\u0129','Itilde':'\u0128','iukcy':'\u0456','Iukcy':'\u0406','iuml':'\xEF','Iuml':'\xCF','jcirc':'\u0135','Jcirc':'\u0134','jcy':'\u0439','Jcy':'\u0419','jfr':'\uD835\uDD27','Jfr':'\uD835\uDD0D','jmath':'\u0237','jopf':'\uD835\uDD5B','Jopf':'\uD835\uDD41','jscr':'\uD835\uDCBF','Jscr':'\uD835\uDCA5','jsercy':'\u0458','Jsercy':'\u0408','jukcy':'\u0454','Jukcy':'\u0404','kappa':'\u03BA','Kappa':'\u039A','kappav':'\u03F0','kcedil':'\u0137','Kcedil':'\u0136','kcy':'\u043A','Kcy':'\u041A','kfr':'\uD835\uDD28','Kfr':'\uD835\uDD0E','kgreen':'\u0138','khcy':'\u0445','KHcy':'\u0425','kjcy':'\u045C','KJcy':'\u040C','kopf':'\uD835\uDD5C','Kopf':'\uD835\uDD42','kscr':'\uD835\uDCC0','Kscr':'\uD835\uDCA6','lAarr':'\u21DA','lacute':'\u013A','Lacute':'\u0139','laemptyv':'\u29B4','lagran':'\u2112','lambda':'\u03BB','Lambda':'\u039B','lang':'\u27E8','Lang':'\u27EA','langd':'\u2991','langle':'\u27E8','lap':'\u2A85','Laplacetrf':'\u2112','laquo':'\xAB','larr':'\u2190','lArr':'\u21D0','Larr':'\u219E','larrb':'\u21E4','larrbfs':'\u291F','larrfs':'\u291D','larrhk':'\u21A9','larrlp':'\u21AB','larrpl':'\u2939','larrsim':'\u2973','larrtl':'\u21A2','lat':'\u2AAB','latail':'\u2919','lAtail':'\u291B','late':'\u2AAD','lates':'\u2AAD\uFE00','lbarr':'\u290C','lBarr':'\u290E','lbbrk':'\u2772','lbrace':'{','lbrack':'[','lbrke':'\u298B','lbrksld':'\u298F','lbrkslu':'\u298D','lcaron':'\u013E','Lcaron':'\u013D','lcedil':'\u013C','Lcedil':'\u013B','lceil':'\u2308','lcub':'{','lcy':'\u043B','Lcy':'\u041B','ldca':'\u2936','ldquo':'\u201C','ldquor':'\u201E','ldrdhar':'\u2967','ldrushar':'\u294B','ldsh':'\u21B2','le':'\u2264','lE':'\u2266','LeftAngleBracket':'\u27E8','leftarrow':'\u2190','Leftarrow':'\u21D0','LeftArrow':'\u2190','LeftArrowBar':'\u21E4','LeftArrowRightArrow':'\u21C6','leftarrowtail':'\u21A2','LeftCeiling':'\u2308','LeftDoubleBracket':'\u27E6','LeftDownTeeVector':'\u2961','LeftDownVector':'\u21C3','LeftDownVectorBar':'\u2959','LeftFloor':'\u230A','leftharpoondown':'\u21BD','leftharpoonup':'\u21BC','leftleftarrows':'\u21C7','leftrightarrow':'\u2194','Leftrightarrow':'\u21D4','LeftRightArrow':'\u2194','leftrightarrows':'\u21C6','leftrightharpoons':'\u21CB','leftrightsquigarrow':'\u21AD','LeftRightVector':'\u294E','LeftTee':'\u22A3','LeftTeeArrow':'\u21A4','LeftTeeVector':'\u295A','leftthreetimes':'\u22CB','LeftTriangle':'\u22B2','LeftTriangleBar':'\u29CF','LeftTriangleEqual':'\u22B4','LeftUpDownVector':'\u2951','LeftUpTeeVector':'\u2960','LeftUpVector':'\u21BF','LeftUpVectorBar':'\u2958','LeftVector':'\u21BC','LeftVectorBar':'\u2952','leg':'\u22DA','lEg':'\u2A8B','leq':'\u2264','leqq':'\u2266','leqslant':'\u2A7D','les':'\u2A7D','lescc':'\u2AA8','lesdot':'\u2A7F','lesdoto':'\u2A81','lesdotor':'\u2A83','lesg':'\u22DA\uFE00','lesges':'\u2A93','lessapprox':'\u2A85','lessdot':'\u22D6','lesseqgtr':'\u22DA','lesseqqgtr':'\u2A8B','LessEqualGreater':'\u22DA','LessFullEqual':'\u2266','LessGreater':'\u2276','lessgtr':'\u2276','LessLess':'\u2AA1','lesssim':'\u2272','LessSlantEqual':'\u2A7D','LessTilde':'\u2272','lfisht':'\u297C','lfloor':'\u230A','lfr':'\uD835\uDD29','Lfr':'\uD835\uDD0F','lg':'\u2276','lgE':'\u2A91','lHar':'\u2962','lhard':'\u21BD','lharu':'\u21BC','lharul':'\u296A','lhblk':'\u2584','ljcy':'\u0459','LJcy':'\u0409','ll':'\u226A','Ll':'\u22D8','llarr':'\u21C7','llcorner':'\u231E','Lleftarrow':'\u21DA','llhard':'\u296B','lltri':'\u25FA','lmidot':'\u0140','Lmidot':'\u013F','lmoust':'\u23B0','lmoustache':'\u23B0','lnap':'\u2A89','lnapprox':'\u2A89','lne':'\u2A87','lnE':'\u2268','lneq':'\u2A87','lneqq':'\u2268','lnsim':'\u22E6','loang':'\u27EC','loarr':'\u21FD','lobrk':'\u27E6','longleftarrow':'\u27F5','Longleftarrow':'\u27F8','LongLeftArrow':'\u27F5','longleftrightarrow':'\u27F7','Longleftrightarrow':'\u27FA','LongLeftRightArrow':'\u27F7','longmapsto':'\u27FC','longrightarrow':'\u27F6','Longrightarrow':'\u27F9','LongRightArrow':'\u27F6','looparrowleft':'\u21AB','looparrowright':'\u21AC','lopar':'\u2985','lopf':'\uD835\uDD5D','Lopf':'\uD835\uDD43','loplus':'\u2A2D','lotimes':'\u2A34','lowast':'\u2217','lowbar':'_','LowerLeftArrow':'\u2199','LowerRightArrow':'\u2198','loz':'\u25CA','lozenge':'\u25CA','lozf':'\u29EB','lpar':'(','lparlt':'\u2993','lrarr':'\u21C6','lrcorner':'\u231F','lrhar':'\u21CB','lrhard':'\u296D','lrm':'\u200E','lrtri':'\u22BF','lsaquo':'\u2039','lscr':'\uD835\uDCC1','Lscr':'\u2112','lsh':'\u21B0','Lsh':'\u21B0','lsim':'\u2272','lsime':'\u2A8D','lsimg':'\u2A8F','lsqb':'[','lsquo':'\u2018','lsquor':'\u201A','lstrok':'\u0142','Lstrok':'\u0141','lt':'<','Lt':'\u226A','LT':'<','ltcc':'\u2AA6','ltcir':'\u2A79','ltdot':'\u22D6','lthree':'\u22CB','ltimes':'\u22C9','ltlarr':'\u2976','ltquest':'\u2A7B','ltri':'\u25C3','ltrie':'\u22B4','ltrif':'\u25C2','ltrPar':'\u2996','lurdshar':'\u294A','luruhar':'\u2966','lvertneqq':'\u2268\uFE00','lvnE':'\u2268\uFE00','macr':'\xAF','male':'\u2642','malt':'\u2720','maltese':'\u2720','map':'\u21A6','Map':'\u2905','mapsto':'\u21A6','mapstodown':'\u21A7','mapstoleft':'\u21A4','mapstoup':'\u21A5','marker':'\u25AE','mcomma':'\u2A29','mcy':'\u043C','Mcy':'\u041C','mdash':'\u2014','mDDot':'\u223A','measuredangle':'\u2221','MediumSpace':'\u205F','Mellintrf':'\u2133','mfr':'\uD835\uDD2A','Mfr':'\uD835\uDD10','mho':'\u2127','micro':'\xB5','mid':'\u2223','midast':'*','midcir':'\u2AF0','middot':'\xB7','minus':'\u2212','minusb':'\u229F','minusd':'\u2238','minusdu':'\u2A2A','MinusPlus':'\u2213','mlcp':'\u2ADB','mldr':'\u2026','mnplus':'\u2213','models':'\u22A7','mopf':'\uD835\uDD5E','Mopf':'\uD835\uDD44','mp':'\u2213','mscr':'\uD835\uDCC2','Mscr':'\u2133','mstpos':'\u223E','mu':'\u03BC','Mu':'\u039C','multimap':'\u22B8','mumap':'\u22B8','nabla':'\u2207','nacute':'\u0144','Nacute':'\u0143','nang':'\u2220\u20D2','nap':'\u2249','napE':'\u2A70\u0338','napid':'\u224B\u0338','napos':'\u0149','napprox':'\u2249','natur':'\u266E','natural':'\u266E','naturals':'\u2115','nbsp':'\xA0','nbump':'\u224E\u0338','nbumpe':'\u224F\u0338','ncap':'\u2A43','ncaron':'\u0148','Ncaron':'\u0147','ncedil':'\u0146','Ncedil':'\u0145','ncong':'\u2247','ncongdot':'\u2A6D\u0338','ncup':'\u2A42','ncy':'\u043D','Ncy':'\u041D','ndash':'\u2013','ne':'\u2260','nearhk':'\u2924','nearr':'\u2197','neArr':'\u21D7','nearrow':'\u2197','nedot':'\u2250\u0338','NegativeMediumSpace':'\u200B','NegativeThickSpace':'\u200B','NegativeThinSpace':'\u200B','NegativeVeryThinSpace':'\u200B','nequiv':'\u2262','nesear':'\u2928','nesim':'\u2242\u0338','NestedGreaterGreater':'\u226B','NestedLessLess':'\u226A','NewLine':'\n','nexist':'\u2204','nexists':'\u2204','nfr':'\uD835\uDD2B','Nfr':'\uD835\uDD11','nge':'\u2271','ngE':'\u2267\u0338','ngeq':'\u2271','ngeqq':'\u2267\u0338','ngeqslant':'\u2A7E\u0338','nges':'\u2A7E\u0338','nGg':'\u22D9\u0338','ngsim':'\u2275','ngt':'\u226F','nGt':'\u226B\u20D2','ngtr':'\u226F','nGtv':'\u226B\u0338','nharr':'\u21AE','nhArr':'\u21CE','nhpar':'\u2AF2','ni':'\u220B','nis':'\u22FC','nisd':'\u22FA','niv':'\u220B','njcy':'\u045A','NJcy':'\u040A','nlarr':'\u219A','nlArr':'\u21CD','nldr':'\u2025','nle':'\u2270','nlE':'\u2266\u0338','nleftarrow':'\u219A','nLeftarrow':'\u21CD','nleftrightarrow':'\u21AE','nLeftrightarrow':'\u21CE','nleq':'\u2270','nleqq':'\u2266\u0338','nleqslant':'\u2A7D\u0338','nles':'\u2A7D\u0338','nless':'\u226E','nLl':'\u22D8\u0338','nlsim':'\u2274','nlt':'\u226E','nLt':'\u226A\u20D2','nltri':'\u22EA','nltrie':'\u22EC','nLtv':'\u226A\u0338','nmid':'\u2224','NoBreak':'\u2060','NonBreakingSpace':'\xA0','nopf':'\uD835\uDD5F','Nopf':'\u2115','not':'\xAC','Not':'\u2AEC','NotCongruent':'\u2262','NotCupCap':'\u226D','NotDoubleVerticalBar':'\u2226','NotElement':'\u2209','NotEqual':'\u2260','NotEqualTilde':'\u2242\u0338','NotExists':'\u2204','NotGreater':'\u226F','NotGreaterEqual':'\u2271','NotGreaterFullEqual':'\u2267\u0338','NotGreaterGreater':'\u226B\u0338','NotGreaterLess':'\u2279','NotGreaterSlantEqual':'\u2A7E\u0338','NotGreaterTilde':'\u2275','NotHumpDownHump':'\u224E\u0338','NotHumpEqual':'\u224F\u0338','notin':'\u2209','notindot':'\u22F5\u0338','notinE':'\u22F9\u0338','notinva':'\u2209','notinvb':'\u22F7','notinvc':'\u22F6','NotLeftTriangle':'\u22EA','NotLeftTriangleBar':'\u29CF\u0338','NotLeftTriangleEqual':'\u22EC','NotLess':'\u226E','NotLessEqual':'\u2270','NotLessGreater':'\u2278','NotLessLess':'\u226A\u0338','NotLessSlantEqual':'\u2A7D\u0338','NotLessTilde':'\u2274','NotNestedGreaterGreater':'\u2AA2\u0338','NotNestedLessLess':'\u2AA1\u0338','notni':'\u220C','notniva':'\u220C','notnivb':'\u22FE','notnivc':'\u22FD','NotPrecedes':'\u2280','NotPrecedesEqual':'\u2AAF\u0338','NotPrecedesSlantEqual':'\u22E0','NotReverseElement':'\u220C','NotRightTriangle':'\u22EB','NotRightTriangleBar':'\u29D0\u0338','NotRightTriangleEqual':'\u22ED','NotSquareSubset':'\u228F\u0338','NotSquareSubsetEqual':'\u22E2','NotSquareSuperset':'\u2290\u0338','NotSquareSupersetEqual':'\u22E3','NotSubset':'\u2282\u20D2','NotSubsetEqual':'\u2288','NotSucceeds':'\u2281','NotSucceedsEqual':'\u2AB0\u0338','NotSucceedsSlantEqual':'\u22E1','NotSucceedsTilde':'\u227F\u0338','NotSuperset':'\u2283\u20D2','NotSupersetEqual':'\u2289','NotTilde':'\u2241','NotTildeEqual':'\u2244','NotTildeFullEqual':'\u2247','NotTildeTilde':'\u2249','NotVerticalBar':'\u2224','npar':'\u2226','nparallel':'\u2226','nparsl':'\u2AFD\u20E5','npart':'\u2202\u0338','npolint':'\u2A14','npr':'\u2280','nprcue':'\u22E0','npre':'\u2AAF\u0338','nprec':'\u2280','npreceq':'\u2AAF\u0338','nrarr':'\u219B','nrArr':'\u21CF','nrarrc':'\u2933\u0338','nrarrw':'\u219D\u0338','nrightarrow':'\u219B','nRightarrow':'\u21CF','nrtri':'\u22EB','nrtrie':'\u22ED','nsc':'\u2281','nsccue':'\u22E1','nsce':'\u2AB0\u0338','nscr':'\uD835\uDCC3','Nscr':'\uD835\uDCA9','nshortmid':'\u2224','nshortparallel':'\u2226','nsim':'\u2241','nsime':'\u2244','nsimeq':'\u2244','nsmid':'\u2224','nspar':'\u2226','nsqsube':'\u22E2','nsqsupe':'\u22E3','nsub':'\u2284','nsube':'\u2288','nsubE':'\u2AC5\u0338','nsubset':'\u2282\u20D2','nsubseteq':'\u2288','nsubseteqq':'\u2AC5\u0338','nsucc':'\u2281','nsucceq':'\u2AB0\u0338','nsup':'\u2285','nsupe':'\u2289','nsupE':'\u2AC6\u0338','nsupset':'\u2283\u20D2','nsupseteq':'\u2289','nsupseteqq':'\u2AC6\u0338','ntgl':'\u2279','ntilde':'\xF1','Ntilde':'\xD1','ntlg':'\u2278','ntriangleleft':'\u22EA','ntrianglelefteq':'\u22EC','ntriangleright':'\u22EB','ntrianglerighteq':'\u22ED','nu':'\u03BD','Nu':'\u039D','num':'#','numero':'\u2116','numsp':'\u2007','nvap':'\u224D\u20D2','nvdash':'\u22AC','nvDash':'\u22AD','nVdash':'\u22AE','nVDash':'\u22AF','nvge':'\u2265\u20D2','nvgt':'>\u20D2','nvHarr':'\u2904','nvinfin':'\u29DE','nvlArr':'\u2902','nvle':'\u2264\u20D2','nvlt':'<\u20D2','nvltrie':'\u22B4\u20D2','nvrArr':'\u2903','nvrtrie':'\u22B5\u20D2','nvsim':'\u223C\u20D2','nwarhk':'\u2923','nwarr':'\u2196','nwArr':'\u21D6','nwarrow':'\u2196','nwnear':'\u2927','oacute':'\xF3','Oacute':'\xD3','oast':'\u229B','ocir':'\u229A','ocirc':'\xF4','Ocirc':'\xD4','ocy':'\u043E','Ocy':'\u041E','odash':'\u229D','odblac':'\u0151','Odblac':'\u0150','odiv':'\u2A38','odot':'\u2299','odsold':'\u29BC','oelig':'\u0153','OElig':'\u0152','ofcir':'\u29BF','ofr':'\uD835\uDD2C','Ofr':'\uD835\uDD12','ogon':'\u02DB','ograve':'\xF2','Ograve':'\xD2','ogt':'\u29C1','ohbar':'\u29B5','ohm':'\u03A9','oint':'\u222E','olarr':'\u21BA','olcir':'\u29BE','olcross':'\u29BB','oline':'\u203E','olt':'\u29C0','omacr':'\u014D','Omacr':'\u014C','omega':'\u03C9','Omega':'\u03A9','omicron':'\u03BF','Omicron':'\u039F','omid':'\u29B6','ominus':'\u2296','oopf':'\uD835\uDD60','Oopf':'\uD835\uDD46','opar':'\u29B7','OpenCurlyDoubleQuote':'\u201C','OpenCurlyQuote':'\u2018','operp':'\u29B9','oplus':'\u2295','or':'\u2228','Or':'\u2A54','orarr':'\u21BB','ord':'\u2A5D','order':'\u2134','orderof':'\u2134','ordf':'\xAA','ordm':'\xBA','origof':'\u22B6','oror':'\u2A56','orslope':'\u2A57','orv':'\u2A5B','oS':'\u24C8','oscr':'\u2134','Oscr':'\uD835\uDCAA','oslash':'\xF8','Oslash':'\xD8','osol':'\u2298','otilde':'\xF5','Otilde':'\xD5','otimes':'\u2297','Otimes':'\u2A37','otimesas':'\u2A36','ouml':'\xF6','Ouml':'\xD6','ovbar':'\u233D','OverBar':'\u203E','OverBrace':'\u23DE','OverBracket':'\u23B4','OverParenthesis':'\u23DC','par':'\u2225','para':'\xB6','parallel':'\u2225','parsim':'\u2AF3','parsl':'\u2AFD','part':'\u2202','PartialD':'\u2202','pcy':'\u043F','Pcy':'\u041F','percnt':'%','period':'.','permil':'\u2030','perp':'\u22A5','pertenk':'\u2031','pfr':'\uD835\uDD2D','Pfr':'\uD835\uDD13','phi':'\u03C6','Phi':'\u03A6','phiv':'\u03D5','phmmat':'\u2133','phone':'\u260E','pi':'\u03C0','Pi':'\u03A0','pitchfork':'\u22D4','piv':'\u03D6','planck':'\u210F','planckh':'\u210E','plankv':'\u210F','plus':'+','plusacir':'\u2A23','plusb':'\u229E','pluscir':'\u2A22','plusdo':'\u2214','plusdu':'\u2A25','pluse':'\u2A72','PlusMinus':'\xB1','plusmn':'\xB1','plussim':'\u2A26','plustwo':'\u2A27','pm':'\xB1','Poincareplane':'\u210C','pointint':'\u2A15','popf':'\uD835\uDD61','Popf':'\u2119','pound':'\xA3','pr':'\u227A','Pr':'\u2ABB','prap':'\u2AB7','prcue':'\u227C','pre':'\u2AAF','prE':'\u2AB3','prec':'\u227A','precapprox':'\u2AB7','preccurlyeq':'\u227C','Precedes':'\u227A','PrecedesEqual':'\u2AAF','PrecedesSlantEqual':'\u227C','PrecedesTilde':'\u227E','preceq':'\u2AAF','precnapprox':'\u2AB9','precneqq':'\u2AB5','precnsim':'\u22E8','precsim':'\u227E','prime':'\u2032','Prime':'\u2033','primes':'\u2119','prnap':'\u2AB9','prnE':'\u2AB5','prnsim':'\u22E8','prod':'\u220F','Product':'\u220F','profalar':'\u232E','profline':'\u2312','profsurf':'\u2313','prop':'\u221D','Proportion':'\u2237','Proportional':'\u221D','propto':'\u221D','prsim':'\u227E','prurel':'\u22B0','pscr':'\uD835\uDCC5','Pscr':'\uD835\uDCAB','psi':'\u03C8','Psi':'\u03A8','puncsp':'\u2008','qfr':'\uD835\uDD2E','Qfr':'\uD835\uDD14','qint':'\u2A0C','qopf':'\uD835\uDD62','Qopf':'\u211A','qprime':'\u2057','qscr':'\uD835\uDCC6','Qscr':'\uD835\uDCAC','quaternions':'\u210D','quatint':'\u2A16','quest':'?','questeq':'\u225F','quot':'"','QUOT':'"','rAarr':'\u21DB','race':'\u223D\u0331','racute':'\u0155','Racute':'\u0154','radic':'\u221A','raemptyv':'\u29B3','rang':'\u27E9','Rang':'\u27EB','rangd':'\u2992','range':'\u29A5','rangle':'\u27E9','raquo':'\xBB','rarr':'\u2192','rArr':'\u21D2','Rarr':'\u21A0','rarrap':'\u2975','rarrb':'\u21E5','rarrbfs':'\u2920','rarrc':'\u2933','rarrfs':'\u291E','rarrhk':'\u21AA','rarrlp':'\u21AC','rarrpl':'\u2945','rarrsim':'\u2974','rarrtl':'\u21A3','Rarrtl':'\u2916','rarrw':'\u219D','ratail':'\u291A','rAtail':'\u291C','ratio':'\u2236','rationals':'\u211A','rbarr':'\u290D','rBarr':'\u290F','RBarr':'\u2910','rbbrk':'\u2773','rbrace':'}','rbrack':']','rbrke':'\u298C','rbrksld':'\u298E','rbrkslu':'\u2990','rcaron':'\u0159','Rcaron':'\u0158','rcedil':'\u0157','Rcedil':'\u0156','rceil':'\u2309','rcub':'}','rcy':'\u0440','Rcy':'\u0420','rdca':'\u2937','rdldhar':'\u2969','rdquo':'\u201D','rdquor':'\u201D','rdsh':'\u21B3','Re':'\u211C','real':'\u211C','realine':'\u211B','realpart':'\u211C','reals':'\u211D','rect':'\u25AD','reg':'\xAE','REG':'\xAE','ReverseElement':'\u220B','ReverseEquilibrium':'\u21CB','ReverseUpEquilibrium':'\u296F','rfisht':'\u297D','rfloor':'\u230B','rfr':'\uD835\uDD2F','Rfr':'\u211C','rHar':'\u2964','rhard':'\u21C1','rharu':'\u21C0','rharul':'\u296C','rho':'\u03C1','Rho':'\u03A1','rhov':'\u03F1','RightAngleBracket':'\u27E9','rightarrow':'\u2192','Rightarrow':'\u21D2','RightArrow':'\u2192','RightArrowBar':'\u21E5','RightArrowLeftArrow':'\u21C4','rightarrowtail':'\u21A3','RightCeiling':'\u2309','RightDoubleBracket':'\u27E7','RightDownTeeVector':'\u295D','RightDownVector':'\u21C2','RightDownVectorBar':'\u2955','RightFloor':'\u230B','rightharpoondown':'\u21C1','rightharpoonup':'\u21C0','rightleftarrows':'\u21C4','rightleftharpoons':'\u21CC','rightrightarrows':'\u21C9','rightsquigarrow':'\u219D','RightTee':'\u22A2','RightTeeArrow':'\u21A6','RightTeeVector':'\u295B','rightthreetimes':'\u22CC','RightTriangle':'\u22B3','RightTriangleBar':'\u29D0','RightTriangleEqual':'\u22B5','RightUpDownVector':'\u294F','RightUpTeeVector':'\u295C','RightUpVector':'\u21BE','RightUpVectorBar':'\u2954','RightVector':'\u21C0','RightVectorBar':'\u2953','ring':'\u02DA','risingdotseq':'\u2253','rlarr':'\u21C4','rlhar':'\u21CC','rlm':'\u200F','rmoust':'\u23B1','rmoustache':'\u23B1','rnmid':'\u2AEE','roang':'\u27ED','roarr':'\u21FE','robrk':'\u27E7','ropar':'\u2986','ropf':'\uD835\uDD63','Ropf':'\u211D','roplus':'\u2A2E','rotimes':'\u2A35','RoundImplies':'\u2970','rpar':')','rpargt':'\u2994','rppolint':'\u2A12','rrarr':'\u21C9','Rrightarrow':'\u21DB','rsaquo':'\u203A','rscr':'\uD835\uDCC7','Rscr':'\u211B','rsh':'\u21B1','Rsh':'\u21B1','rsqb':']','rsquo':'\u2019','rsquor':'\u2019','rthree':'\u22CC','rtimes':'\u22CA','rtri':'\u25B9','rtrie':'\u22B5','rtrif':'\u25B8','rtriltri':'\u29CE','RuleDelayed':'\u29F4','ruluhar':'\u2968','rx':'\u211E','sacute':'\u015B','Sacute':'\u015A','sbquo':'\u201A','sc':'\u227B','Sc':'\u2ABC','scap':'\u2AB8','scaron':'\u0161','Scaron':'\u0160','sccue':'\u227D','sce':'\u2AB0','scE':'\u2AB4','scedil':'\u015F','Scedil':'\u015E','scirc':'\u015D','Scirc':'\u015C','scnap':'\u2ABA','scnE':'\u2AB6','scnsim':'\u22E9','scpolint':'\u2A13','scsim':'\u227F','scy':'\u0441','Scy':'\u0421','sdot':'\u22C5','sdotb':'\u22A1','sdote':'\u2A66','searhk':'\u2925','searr':'\u2198','seArr':'\u21D8','searrow':'\u2198','sect':'\xA7','semi':';','seswar':'\u2929','setminus':'\u2216','setmn':'\u2216','sext':'\u2736','sfr':'\uD835\uDD30','Sfr':'\uD835\uDD16','sfrown':'\u2322','sharp':'\u266F','shchcy':'\u0449','SHCHcy':'\u0429','shcy':'\u0448','SHcy':'\u0428','ShortDownArrow':'\u2193','ShortLeftArrow':'\u2190','shortmid':'\u2223','shortparallel':'\u2225','ShortRightArrow':'\u2192','ShortUpArrow':'\u2191','shy':'\xAD','sigma':'\u03C3','Sigma':'\u03A3','sigmaf':'\u03C2','sigmav':'\u03C2','sim':'\u223C','simdot':'\u2A6A','sime':'\u2243','simeq':'\u2243','simg':'\u2A9E','simgE':'\u2AA0','siml':'\u2A9D','simlE':'\u2A9F','simne':'\u2246','simplus':'\u2A24','simrarr':'\u2972','slarr':'\u2190','SmallCircle':'\u2218','smallsetminus':'\u2216','smashp':'\u2A33','smeparsl':'\u29E4','smid':'\u2223','smile':'\u2323','smt':'\u2AAA','smte':'\u2AAC','smtes':'\u2AAC\uFE00','softcy':'\u044C','SOFTcy':'\u042C','sol':'/','solb':'\u29C4','solbar':'\u233F','sopf':'\uD835\uDD64','Sopf':'\uD835\uDD4A','spades':'\u2660','spadesuit':'\u2660','spar':'\u2225','sqcap':'\u2293','sqcaps':'\u2293\uFE00','sqcup':'\u2294','sqcups':'\u2294\uFE00','Sqrt':'\u221A','sqsub':'\u228F','sqsube':'\u2291','sqsubset':'\u228F','sqsubseteq':'\u2291','sqsup':'\u2290','sqsupe':'\u2292','sqsupset':'\u2290','sqsupseteq':'\u2292','squ':'\u25A1','square':'\u25A1','Square':'\u25A1','SquareIntersection':'\u2293','SquareSubset':'\u228F','SquareSubsetEqual':'\u2291','SquareSuperset':'\u2290','SquareSupersetEqual':'\u2292','SquareUnion':'\u2294','squarf':'\u25AA','squf':'\u25AA','srarr':'\u2192','sscr':'\uD835\uDCC8','Sscr':'\uD835\uDCAE','ssetmn':'\u2216','ssmile':'\u2323','sstarf':'\u22C6','star':'\u2606','Star':'\u22C6','starf':'\u2605','straightepsilon':'\u03F5','straightphi':'\u03D5','strns':'\xAF','sub':'\u2282','Sub':'\u22D0','subdot':'\u2ABD','sube':'\u2286','subE':'\u2AC5','subedot':'\u2AC3','submult':'\u2AC1','subne':'\u228A','subnE':'\u2ACB','subplus':'\u2ABF','subrarr':'\u2979','subset':'\u2282','Subset':'\u22D0','subseteq':'\u2286','subseteqq':'\u2AC5','SubsetEqual':'\u2286','subsetneq':'\u228A','subsetneqq':'\u2ACB','subsim':'\u2AC7','subsub':'\u2AD5','subsup':'\u2AD3','succ':'\u227B','succapprox':'\u2AB8','succcurlyeq':'\u227D','Succeeds':'\u227B','SucceedsEqual':'\u2AB0','SucceedsSlantEqual':'\u227D','SucceedsTilde':'\u227F','succeq':'\u2AB0','succnapprox':'\u2ABA','succneqq':'\u2AB6','succnsim':'\u22E9','succsim':'\u227F','SuchThat':'\u220B','sum':'\u2211','Sum':'\u2211','sung':'\u266A','sup':'\u2283','Sup':'\u22D1','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','supdot':'\u2ABE','supdsub':'\u2AD8','supe':'\u2287','supE':'\u2AC6','supedot':'\u2AC4','Superset':'\u2283','SupersetEqual':'\u2287','suphsol':'\u27C9','suphsub':'\u2AD7','suplarr':'\u297B','supmult':'\u2AC2','supne':'\u228B','supnE':'\u2ACC','supplus':'\u2AC0','supset':'\u2283','Supset':'\u22D1','supseteq':'\u2287','supseteqq':'\u2AC6','supsetneq':'\u228B','supsetneqq':'\u2ACC','supsim':'\u2AC8','supsub':'\u2AD4','supsup':'\u2AD6','swarhk':'\u2926','swarr':'\u2199','swArr':'\u21D9','swarrow':'\u2199','swnwar':'\u292A','szlig':'\xDF','Tab':'\t','target':'\u2316','tau':'\u03C4','Tau':'\u03A4','tbrk':'\u23B4','tcaron':'\u0165','Tcaron':'\u0164','tcedil':'\u0163','Tcedil':'\u0162','tcy':'\u0442','Tcy':'\u0422','tdot':'\u20DB','telrec':'\u2315','tfr':'\uD835\uDD31','Tfr':'\uD835\uDD17','there4':'\u2234','therefore':'\u2234','Therefore':'\u2234','theta':'\u03B8','Theta':'\u0398','thetasym':'\u03D1','thetav':'\u03D1','thickapprox':'\u2248','thicksim':'\u223C','ThickSpace':'\u205F\u200A','thinsp':'\u2009','ThinSpace':'\u2009','thkap':'\u2248','thksim':'\u223C','thorn':'\xFE','THORN':'\xDE','tilde':'\u02DC','Tilde':'\u223C','TildeEqual':'\u2243','TildeFullEqual':'\u2245','TildeTilde':'\u2248','times':'\xD7','timesb':'\u22A0','timesbar':'\u2A31','timesd':'\u2A30','tint':'\u222D','toea':'\u2928','top':'\u22A4','topbot':'\u2336','topcir':'\u2AF1','topf':'\uD835\uDD65','Topf':'\uD835\uDD4B','topfork':'\u2ADA','tosa':'\u2929','tprime':'\u2034','trade':'\u2122','TRADE':'\u2122','triangle':'\u25B5','triangledown':'\u25BF','triangleleft':'\u25C3','trianglelefteq':'\u22B4','triangleq':'\u225C','triangleright':'\u25B9','trianglerighteq':'\u22B5','tridot':'\u25EC','trie':'\u225C','triminus':'\u2A3A','TripleDot':'\u20DB','triplus':'\u2A39','trisb':'\u29CD','tritime':'\u2A3B','trpezium':'\u23E2','tscr':'\uD835\uDCC9','Tscr':'\uD835\uDCAF','tscy':'\u0446','TScy':'\u0426','tshcy':'\u045B','TSHcy':'\u040B','tstrok':'\u0167','Tstrok':'\u0166','twixt':'\u226C','twoheadleftarrow':'\u219E','twoheadrightarrow':'\u21A0','uacute':'\xFA','Uacute':'\xDA','uarr':'\u2191','uArr':'\u21D1','Uarr':'\u219F','Uarrocir':'\u2949','ubrcy':'\u045E','Ubrcy':'\u040E','ubreve':'\u016D','Ubreve':'\u016C','ucirc':'\xFB','Ucirc':'\xDB','ucy':'\u0443','Ucy':'\u0423','udarr':'\u21C5','udblac':'\u0171','Udblac':'\u0170','udhar':'\u296E','ufisht':'\u297E','ufr':'\uD835\uDD32','Ufr':'\uD835\uDD18','ugrave':'\xF9','Ugrave':'\xD9','uHar':'\u2963','uharl':'\u21BF','uharr':'\u21BE','uhblk':'\u2580','ulcorn':'\u231C','ulcorner':'\u231C','ulcrop':'\u230F','ultri':'\u25F8','umacr':'\u016B','Umacr':'\u016A','uml':'\xA8','UnderBar':'_','UnderBrace':'\u23DF','UnderBracket':'\u23B5','UnderParenthesis':'\u23DD','Union':'\u22C3','UnionPlus':'\u228E','uogon':'\u0173','Uogon':'\u0172','uopf':'\uD835\uDD66','Uopf':'\uD835\uDD4C','uparrow':'\u2191','Uparrow':'\u21D1','UpArrow':'\u2191','UpArrowBar':'\u2912','UpArrowDownArrow':'\u21C5','updownarrow':'\u2195','Updownarrow':'\u21D5','UpDownArrow':'\u2195','UpEquilibrium':'\u296E','upharpoonleft':'\u21BF','upharpoonright':'\u21BE','uplus':'\u228E','UpperLeftArrow':'\u2196','UpperRightArrow':'\u2197','upsi':'\u03C5','Upsi':'\u03D2','upsih':'\u03D2','upsilon':'\u03C5','Upsilon':'\u03A5','UpTee':'\u22A5','UpTeeArrow':'\u21A5','upuparrows':'\u21C8','urcorn':'\u231D','urcorner':'\u231D','urcrop':'\u230E','uring':'\u016F','Uring':'\u016E','urtri':'\u25F9','uscr':'\uD835\uDCCA','Uscr':'\uD835\uDCB0','utdot':'\u22F0','utilde':'\u0169','Utilde':'\u0168','utri':'\u25B5','utrif':'\u25B4','uuarr':'\u21C8','uuml':'\xFC','Uuml':'\xDC','uwangle':'\u29A7','vangrt':'\u299C','varepsilon':'\u03F5','varkappa':'\u03F0','varnothing':'\u2205','varphi':'\u03D5','varpi':'\u03D6','varpropto':'\u221D','varr':'\u2195','vArr':'\u21D5','varrho':'\u03F1','varsigma':'\u03C2','varsubsetneq':'\u228A\uFE00','varsubsetneqq':'\u2ACB\uFE00','varsupsetneq':'\u228B\uFE00','varsupsetneqq':'\u2ACC\uFE00','vartheta':'\u03D1','vartriangleleft':'\u22B2','vartriangleright':'\u22B3','vBar':'\u2AE8','Vbar':'\u2AEB','vBarv':'\u2AE9','vcy':'\u0432','Vcy':'\u0412','vdash':'\u22A2','vDash':'\u22A8','Vdash':'\u22A9','VDash':'\u22AB','Vdashl':'\u2AE6','vee':'\u2228','Vee':'\u22C1','veebar':'\u22BB','veeeq':'\u225A','vellip':'\u22EE','verbar':'|','Verbar':'\u2016','vert':'|','Vert':'\u2016','VerticalBar':'\u2223','VerticalLine':'|','VerticalSeparator':'\u2758','VerticalTilde':'\u2240','VeryThinSpace':'\u200A','vfr':'\uD835\uDD33','Vfr':'\uD835\uDD19','vltri':'\u22B2','vnsub':'\u2282\u20D2','vnsup':'\u2283\u20D2','vopf':'\uD835\uDD67','Vopf':'\uD835\uDD4D','vprop':'\u221D','vrtri':'\u22B3','vscr':'\uD835\uDCCB','Vscr':'\uD835\uDCB1','vsubne':'\u228A\uFE00','vsubnE':'\u2ACB\uFE00','vsupne':'\u228B\uFE00','vsupnE':'\u2ACC\uFE00','Vvdash':'\u22AA','vzigzag':'\u299A','wcirc':'\u0175','Wcirc':'\u0174','wedbar':'\u2A5F','wedge':'\u2227','Wedge':'\u22C0','wedgeq':'\u2259','weierp':'\u2118','wfr':'\uD835\uDD34','Wfr':'\uD835\uDD1A','wopf':'\uD835\uDD68','Wopf':'\uD835\uDD4E','wp':'\u2118','wr':'\u2240','wreath':'\u2240','wscr':'\uD835\uDCCC','Wscr':'\uD835\uDCB2','xcap':'\u22C2','xcirc':'\u25EF','xcup':'\u22C3','xdtri':'\u25BD','xfr':'\uD835\uDD35','Xfr':'\uD835\uDD1B','xharr':'\u27F7','xhArr':'\u27FA','xi':'\u03BE','Xi':'\u039E','xlarr':'\u27F5','xlArr':'\u27F8','xmap':'\u27FC','xnis':'\u22FB','xodot':'\u2A00','xopf':'\uD835\uDD69','Xopf':'\uD835\uDD4F','xoplus':'\u2A01','xotime':'\u2A02','xrarr':'\u27F6','xrArr':'\u27F9','xscr':'\uD835\uDCCD','Xscr':'\uD835\uDCB3','xsqcup':'\u2A06','xuplus':'\u2A04','xutri':'\u25B3','xvee':'\u22C1','xwedge':'\u22C0','yacute':'\xFD','Yacute':'\xDD','yacy':'\u044F','YAcy':'\u042F','ycirc':'\u0177','Ycirc':'\u0176','ycy':'\u044B','Ycy':'\u042B','yen':'\xA5','yfr':'\uD835\uDD36','Yfr':'\uD835\uDD1C','yicy':'\u0457','YIcy':'\u0407','yopf':'\uD835\uDD6A','Yopf':'\uD835\uDD50','yscr':'\uD835\uDCCE','Yscr':'\uD835\uDCB4','yucy':'\u044E','YUcy':'\u042E','yuml':'\xFF','Yuml':'\u0178','zacute':'\u017A','Zacute':'\u0179','zcaron':'\u017E','Zcaron':'\u017D','zcy':'\u0437','Zcy':'\u0417','zdot':'\u017C','Zdot':'\u017B','zeetrf':'\u2128','ZeroWidthSpace':'\u200B','zeta':'\u03B6','Zeta':'\u0396','zfr':'\uD835\uDD37','Zfr':'\u2128','zhcy':'\u0436','ZHcy':'\u0416','zigrarr':'\u21DD','zopf':'\uD835\uDD6B','Zopf':'\u2124','zscr':'\uD835\uDCCF','Zscr':'\uD835\uDCB5','zwj':'\u200D','zwnj':'\u200C'};
	var decodeMapLegacy = {'aacute':'\xE1','Aacute':'\xC1','acirc':'\xE2','Acirc':'\xC2','acute':'\xB4','aelig':'\xE6','AElig':'\xC6','agrave':'\xE0','Agrave':'\xC0','amp':'&','AMP':'&','aring':'\xE5','Aring':'\xC5','atilde':'\xE3','Atilde':'\xC3','auml':'\xE4','Auml':'\xC4','brvbar':'\xA6','ccedil':'\xE7','Ccedil':'\xC7','cedil':'\xB8','cent':'\xA2','copy':'\xA9','COPY':'\xA9','curren':'\xA4','deg':'\xB0','divide':'\xF7','eacute':'\xE9','Eacute':'\xC9','ecirc':'\xEA','Ecirc':'\xCA','egrave':'\xE8','Egrave':'\xC8','eth':'\xF0','ETH':'\xD0','euml':'\xEB','Euml':'\xCB','frac12':'\xBD','frac14':'\xBC','frac34':'\xBE','gt':'>','GT':'>','iacute':'\xED','Iacute':'\xCD','icirc':'\xEE','Icirc':'\xCE','iexcl':'\xA1','igrave':'\xEC','Igrave':'\xCC','iquest':'\xBF','iuml':'\xEF','Iuml':'\xCF','laquo':'\xAB','lt':'<','LT':'<','macr':'\xAF','micro':'\xB5','middot':'\xB7','nbsp':'\xA0','not':'\xAC','ntilde':'\xF1','Ntilde':'\xD1','oacute':'\xF3','Oacute':'\xD3','ocirc':'\xF4','Ocirc':'\xD4','ograve':'\xF2','Ograve':'\xD2','ordf':'\xAA','ordm':'\xBA','oslash':'\xF8','Oslash':'\xD8','otilde':'\xF5','Otilde':'\xD5','ouml':'\xF6','Ouml':'\xD6','para':'\xB6','plusmn':'\xB1','pound':'\xA3','quot':'"','QUOT':'"','raquo':'\xBB','reg':'\xAE','REG':'\xAE','sect':'\xA7','shy':'\xAD','sup1':'\xB9','sup2':'\xB2','sup3':'\xB3','szlig':'\xDF','thorn':'\xFE','THORN':'\xDE','times':'\xD7','uacute':'\xFA','Uacute':'\xDA','ucirc':'\xFB','Ucirc':'\xDB','ugrave':'\xF9','Ugrave':'\xD9','uml':'\xA8','uuml':'\xFC','Uuml':'\xDC','yacute':'\xFD','Yacute':'\xDD','yen':'\xA5','yuml':'\xFF'};
	var decodeMapNumeric = {'0':'\uFFFD','128':'\u20AC','130':'\u201A','131':'\u0192','132':'\u201E','133':'\u2026','134':'\u2020','135':'\u2021','136':'\u02C6','137':'\u2030','138':'\u0160','139':'\u2039','140':'\u0152','142':'\u017D','145':'\u2018','146':'\u2019','147':'\u201C','148':'\u201D','149':'\u2022','150':'\u2013','151':'\u2014','152':'\u02DC','153':'\u2122','154':'\u0161','155':'\u203A','156':'\u0153','158':'\u017E','159':'\u0178'};
	var invalidReferenceCodePoints = [1,2,3,4,5,6,7,8,11,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,64976,64977,64978,64979,64980,64981,64982,64983,64984,64985,64986,64987,64988,64989,64990,64991,64992,64993,64994,64995,64996,64997,64998,64999,65000,65001,65002,65003,65004,65005,65006,65007,65534,65535,131070,131071,196606,196607,262142,262143,327678,327679,393214,393215,458750,458751,524286,524287,589822,589823,655358,655359,720894,720895,786430,786431,851966,851967,917502,917503,983038,983039,1048574,1048575,1114110,1114111];

	/*--------------------------------------------------------------------------*/

	var stringFromCharCode = String.fromCharCode;

	var object = {};
	var hasOwnProperty = object.hasOwnProperty;
	var has = function(object, propertyName) {
		return hasOwnProperty.call(object, propertyName);
	};

	var contains = function(array, value) {
		var index = -1;
		var length = array.length;
		while (++index < length) {
			if (array[index] == value) {
				return true;
			}
		}
		return false;
	};

	var merge = function(options, defaults) {
		if (!options) {
			return defaults;
		}
		var result = {};
		var key;
		for (key in defaults) {
			// A `hasOwnProperty` check is not needed here, since only recognized
			// option names are used anyway. Any others are ignored.
			result[key] = has(options, key) ? options[key] : defaults[key];
		}
		return result;
	};

	// Modified version of `ucs2encode`; see https://mths.be/punycode.
	var codePointToSymbol = function(codePoint, strict) {
		var output = '';
		if ((codePoint >= 0xD800 && codePoint <= 0xDFFF) || codePoint > 0x10FFFF) {
			// See issue #4:
			// “Otherwise, if the number is in the range 0xD800 to 0xDFFF or is
			// greater than 0x10FFFF, then this is a parse error. Return a U+FFFD
			// REPLACEMENT CHARACTER.”
			if (strict) {
				parseError('character reference outside the permissible Unicode range');
			}
			return '\uFFFD';
		}
		if (has(decodeMapNumeric, codePoint)) {
			if (strict) {
				parseError('disallowed character reference');
			}
			return decodeMapNumeric[codePoint];
		}
		if (strict && contains(invalidReferenceCodePoints, codePoint)) {
			parseError('disallowed character reference');
		}
		if (codePoint > 0xFFFF) {
			codePoint -= 0x10000;
			output += stringFromCharCode(codePoint >>> 10 & 0x3FF | 0xD800);
			codePoint = 0xDC00 | codePoint & 0x3FF;
		}
		output += stringFromCharCode(codePoint);
		return output;
	};

	var hexEscape = function(codePoint) {
		return '&#x' + codePoint.toString(16).toUpperCase() + ';';
	};

	var decEscape = function(codePoint) {
		return '&#' + codePoint + ';';
	};

	var parseError = function(message) {
		throw Error('Parse error: ' + message);
	};

	/*--------------------------------------------------------------------------*/

	var encode = function(string, options) {
		options = merge(options, encode.options);
		var strict = options.strict;
		if (strict && regexInvalidRawCodePoint.test(string)) {
			parseError('forbidden code point');
		}
		var encodeEverything = options.encodeEverything;
		var useNamedReferences = options.useNamedReferences;
		var allowUnsafeSymbols = options.allowUnsafeSymbols;
		var escapeCodePoint = options.decimal ? decEscape : hexEscape;

		var escapeBmpSymbol = function(symbol) {
			return escapeCodePoint(symbol.charCodeAt(0));
		};

		if (encodeEverything) {
			// Encode ASCII symbols.
			string = string.replace(regexAsciiWhitelist, function(symbol) {
				// Use named references if requested & possible.
				if (useNamedReferences && has(encodeMap, symbol)) {
					return '&' + encodeMap[symbol] + ';';
				}
				return escapeBmpSymbol(symbol);
			});
			// Shorten a few escapes that represent two symbols, of which at least one
			// is within the ASCII range.
			if (useNamedReferences) {
				string = string
					.replace(/&gt;\u20D2/g, '&nvgt;')
					.replace(/&lt;\u20D2/g, '&nvlt;')
					.replace(/&#x66;&#x6A;/g, '&fjlig;');
			}
			// Encode non-ASCII symbols.
			if (useNamedReferences) {
				// Encode non-ASCII symbols that can be replaced with a named reference.
				string = string.replace(regexEncodeNonAscii, function(string) {
					// Note: there is no need to check `has(encodeMap, string)` here.
					return '&' + encodeMap[string] + ';';
				});
			}
			// Note: any remaining non-ASCII symbols are handled outside of the `if`.
		} else if (useNamedReferences) {
			// Apply named character references.
			// Encode `<>"'&` using named character references.
			if (!allowUnsafeSymbols) {
				string = string.replace(regexEscape, function(string) {
					return '&' + encodeMap[string] + ';'; // no need to check `has()` here
				});
			}
			// Shorten escapes that represent two symbols, of which at least one is
			// `<>"'&`.
			string = string
				.replace(/&gt;\u20D2/g, '&nvgt;')
				.replace(/&lt;\u20D2/g, '&nvlt;');
			// Encode non-ASCII symbols that can be replaced with a named reference.
			string = string.replace(regexEncodeNonAscii, function(string) {
				// Note: there is no need to check `has(encodeMap, string)` here.
				return '&' + encodeMap[string] + ';';
			});
		} else if (!allowUnsafeSymbols) {
			// Encode `<>"'&` using hexadecimal escapes, now that they’re not handled
			// using named character references.
			string = string.replace(regexEscape, escapeBmpSymbol);
		}
		return string
			// Encode astral symbols.
			.replace(regexAstralSymbols, function($0) {
				// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
				var high = $0.charCodeAt(0);
				var low = $0.charCodeAt(1);
				var codePoint = (high - 0xD800) * 0x400 + low - 0xDC00 + 0x10000;
				return escapeCodePoint(codePoint);
			})
			// Encode any remaining BMP symbols that are not printable ASCII symbols
			// using a hexadecimal escape.
			.replace(regexBmpWhitelist, escapeBmpSymbol);
	};
	// Expose default options (so they can be overridden globally).
	encode.options = {
		'allowUnsafeSymbols': false,
		'encodeEverything': false,
		'strict': false,
		'useNamedReferences': false,
		'decimal' : false
	};

	var decode = function(html, options) {
		options = merge(options, decode.options);
		var strict = options.strict;
		if (strict && regexInvalidEntity.test(html)) {
			parseError('malformed character reference');
		}
		return html.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
			var codePoint;
			var semicolon;
			var decDigits;
			var hexDigits;
			var reference;
			var next;

			if ($1) {
				reference = $1;
				// Note: there is no need to check `has(decodeMap, reference)`.
				return decodeMap[reference];
			}

			if ($2) {
				// Decode named character references without trailing `;`, e.g. `&amp`.
				// This is only a parse error if it gets converted to `&`, or if it is
				// followed by `=` in an attribute context.
				reference = $2;
				next = $3;
				if (next && options.isAttributeValue) {
					if (strict && next == '=') {
						parseError('`&` did not start a character reference');
					}
					return $0;
				} else {
					if (strict) {
						parseError(
							'named character reference was not terminated by a semicolon'
						);
					}
					// Note: there is no need to check `has(decodeMapLegacy, reference)`.
					return decodeMapLegacy[reference] + (next || '');
				}
			}

			if ($4) {
				// Decode decimal escapes, e.g. `&#119558;`.
				decDigits = $4;
				semicolon = $5;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(decDigits, 10);
				return codePointToSymbol(codePoint, strict);
			}

			if ($6) {
				// Decode hexadecimal escapes, e.g. `&#x1D306;`.
				hexDigits = $6;
				semicolon = $7;
				if (strict && !semicolon) {
					parseError('character reference was not terminated by a semicolon');
				}
				codePoint = parseInt(hexDigits, 16);
				return codePointToSymbol(codePoint, strict);
			}

			// If we’re still here, `if ($7)` is implied; it’s an ambiguous
			// ampersand for sure. https://mths.be/notes/ambiguous-ampersands
			if (strict) {
				parseError(
					'named character reference was not terminated by a semicolon'
				);
			}
			return $0;
		});
	};
	// Expose default options (so they can be overridden globally).
	decode.options = {
		'isAttributeValue': false,
		'strict': false
	};

	var escape = function(string) {
		return string.replace(regexEscape, function($0) {
			// Note: there is no need to check `has(escapeMap, $0)` here.
			return escapeMap[$0];
		});
	};

	/*--------------------------------------------------------------------------*/

	var he = {
		'version': '1.2.0',
		'encode': encode,
		'decode': decode,
		'escape': escape,
		'unescape': decode
	};

	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
			return he;
		}).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	}	else { var key; }

}(this));


/***/ }),

/***/ 92879:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__(64809);


/***/ }),

/***/ 75464:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// eslint-disable-next-line no-unused-vars
const { Picker } = __webpack_require__(51900);

const { trimCharacter } = __webpack_require__(91610);
// eslint-disable-next-line no-unused-vars
const { StackItem, BlockStackItem, TableCellStackItem, TableRowStackItem, TableStackItem, TransformerStackItem }
  = __webpack_require__(4779);
const { tableToString } = __webpack_require__(60121);
const { WhitespaceProcessor } = __webpack_require__(96776);

// eslint-disable-next-line import/no-unassigned-import
__webpack_require__(19901);


/**
 * Helps to build text from inline and block elements.
 *
 * @class BlockTextBuilder
 */
class BlockTextBuilder {

  /**
   * Creates an instance of BlockTextBuilder.
   *
   * @param { Options } options HtmlToText options.
   * @param { Picker<DomNode, TagDefinition> } picker Selectors decision tree picker.
   */
  constructor (options, picker) {
    this.options = options;
    this.picker = picker;
    this.whitespaceProcessor = new WhitespaceProcessor(options);
    /** @type { StackItem } */
    this._stackItem = new BlockStackItem(options);
    /** @type { TransformerStackItem } */
    this._wordTransformer = undefined;
  }

  /**
   * Put a word-by-word transform function onto the transformations stack.
   *
   * Mainly used for uppercasing. Can be bypassed to add unformatted text such as URLs.
   *
   * Word transformations applied before wrapping.
   *
   * @param { (str: string) => string } wordTransform Word transformation function.
   */
  pushWordTransform (wordTransform) {
    this._wordTransformer = new TransformerStackItem(this._wordTransformer, wordTransform);
  }

  /**
   * Remove a function from the word transformations stack.
   *
   * @returns { (str: string) => string } A function that was removed.
   */
  popWordTransform () {
    if (!this._wordTransformer) { return undefined; }
    const transform = this._wordTransformer.transform;
    this._wordTransformer = this._wordTransformer.next;
    return transform;
  }

  /** @returns { (str: string) => string } */
  _getCombinedWordTransformer () {
    const applyTransformer = (str, transformer) =>
      ((transformer) ? applyTransformer(transformer.transform(str), transformer.next) : str);
    return (str) => applyTransformer(str, this._wordTransformer);
  }

  _popStackItem () {
    const item = this._stackItem;
    this._stackItem = item.next;
    return item;
  }

  /**
   * Add a line break into currently built block.
   */
  addLineBreak () {
    if (!(
      this._stackItem instanceof BlockStackItem
      || this._stackItem instanceof TableCellStackItem
    )) { return; }
    if (this._stackItem.isPre) {
      this._stackItem.rawText += '\n';
    } else {
      this._stackItem.inlineTextBuilder.startNewLine();
    }
  }

  /**
   * Allow to break line in case directly following text will not fit.
   */
  addWordBreakOpportunity () {
    if (
      this._stackItem instanceof BlockStackItem
      || this._stackItem instanceof TableCellStackItem
    ) {
      this._stackItem.inlineTextBuilder.wordBreakOpportunity = true;
    }
  }

  /**
   * Add a node inline into the currently built block.
   *
   * @param { string } str
   * Text content of a node to add.
   *
   * @param { object | boolean } [ optionsObjectOrNoWordTransform ]
   * Object holding the parameters of the operation.
   *
   * Boolean value is deprecated.
   *
   * @param { boolean } [ optionsObjectOrNoWordTransform.noWordTransform = false ]
   * Ignore word transformers if there are any.
   */
  addInline (str, optionsObjectOrNoWordTransform = {}) {
    if (typeof optionsObjectOrNoWordTransform === 'object') {
      this._addInline(str, optionsObjectOrNoWordTransform);
    } else {
      this._addInline(str, { noWordTransform: optionsObjectOrNoWordTransform });
    }
  }

  _addInline (str, { noWordTransform = false } = {}) {
    if (!(
      this._stackItem instanceof BlockStackItem
      || this._stackItem instanceof TableCellStackItem
    )) { return; }

    if (this._stackItem.isPre) {
      this._stackItem.rawText += str;
      return;
    }

    if (
      str.length === 0 || // empty string
      (
        this._stackItem.stashedLineBreaks && // stashed linebreaks make whitespace irrelevant
        !this.whitespaceProcessor.testContainsWords(str) // no words to add
      )
    ) { return; }

    if (this.options.preserveNewlines) {
      const newlinesNumber = this.whitespaceProcessor.countNewlinesNoWords(str);
      if (newlinesNumber > 0) {
        this._stackItem.inlineTextBuilder.startNewLine(newlinesNumber);
        // keep stashedLineBreaks unchanged
        return;
      }
    }

    if (this._stackItem.stashedLineBreaks) {
      this._stackItem.inlineTextBuilder.startNewLine(this._stackItem.stashedLineBreaks);
    }
    this.whitespaceProcessor.shrinkWrapAdd(
      str,
      this._stackItem.inlineTextBuilder,
      (this._wordTransformer && !noWordTransform) ? this._getCombinedWordTransformer() : undefined
    );
    this._stackItem.stashedLineBreaks = 0; // inline text doesn't introduce line breaks
  }

  /**
   * Start building a new block.
   *
   * @param { object | number } [optionsObjectOrLeadingLineBreaks]
   * Object holding the parameters of the block.
   *
   * Number value is deprecated.
   *
   * @param { number }  [optionsObjectOrLeadingLineBreaks.leadingLineBreaks = 1]
   * This block should have at least this number of line breaks to separate if from any preceding block.
   *
   * @param { number }  [optionsObjectOrLeadingLineBreaks.reservedLineLength = 0]
   * Reserve this number of characters on each line for block markup.
   *
   * @param { boolean } [optionsObjectOrLeadingLineBreaks.isPre = false]
   * Should HTML whitespace be preserved inside this block.
   *
   * @param { number }  [reservedLineLength]
   * Deprecated.
   *
   * @param { boolean } [isPre]
   * Deprecated.
   */
  openBlock (optionsObjectOrLeadingLineBreaks = {}, reservedLineLength = undefined, isPre = undefined) {
    if (typeof optionsObjectOrLeadingLineBreaks === 'object') {
      this._openBlock(optionsObjectOrLeadingLineBreaks);
    } else {
      this._openBlock({
        isPre: isPre,
        leadingLineBreaks: optionsObjectOrLeadingLineBreaks,
        reservedLineLength: reservedLineLength,
      });
    }
  }

  _openBlock ({ leadingLineBreaks = 1, reservedLineLength = 0, isPre = false } = {}) {
    const maxLineLength = Math.max(20, this._stackItem.inlineTextBuilder.maxLineLength - reservedLineLength);
    this._stackItem = new BlockStackItem(
      this.options,
      this._stackItem,
      leadingLineBreaks,
      maxLineLength
    );
    if (isPre) { this._stackItem.isPre = true; }
  }

  /**
   * Finalize currently built block, add it's content to the parent block.
   *
   * @param { object | number }         [optionsObjectOrTrailingLineBreaks]
   * Object holding the parameters of the block.
   *
   * Number value is deprecated.
   *
   * @param { number }                  [optionsObjectOrTrailingLineBreaks.trailingLineBreaks = 1]
   * This block should have at least this number of line breaks to separate it from any following block.
   *
   * @param { (str: string) => string } [optionsObjectOrTrailingLineBreaks.blockTransform = undefined]
   * A function to transform the block text before adding to the parent block.
   * This happens after word wrap and should be used in combination with reserved line length
   * in order to keep line lengths correct.
   * Used for whole block markup.
   *
   * @param { (str: string) => string } [blockTransform]
   * Deprecated.
   */
  closeBlock (optionsObjectOrTrailingLineBreaks = {}, blockTransform = undefined) {
    if (typeof optionsObjectOrTrailingLineBreaks === 'object') {
      this._closeBlock(optionsObjectOrTrailingLineBreaks);
    } else {
      this._closeBlock({
        trailingLineBreaks: optionsObjectOrTrailingLineBreaks,
        blockTransform: blockTransform,
      });
    }
  }

  _closeBlock ({ trailingLineBreaks = 1, blockTransform = undefined } = {}) {
    const block = this._popStackItem();
    const blockText = (blockTransform) ? blockTransform(getText(block)) : getText(block);
    addText(this._stackItem, blockText, block.leadingLineBreaks, Math.max(block.stashedLineBreaks, trailingLineBreaks));
  }

  /**
   * Start building a table.
   */
  openTable () {
    this._stackItem = new TableStackItem(this._stackItem);
  }

  /**
   * Start building a table row.
   */
  openTableRow () {
    if (!(this._stackItem instanceof TableStackItem)) {
      throw new Error('Can\'t add table row to something that is not a table! Check the formatter.');
    }
    this._stackItem = new TableRowStackItem(this._stackItem);
  }

  /**
   * Start building a table cell.
   *
   * @param { object | number } [optionsObjectOrMaxColumnWidth = undefined]
   * Object holding the parameters of the cell.
   *
   * Number value is deprecated.
   *
   * @param { number } [optionsObjectOrMaxColumnWidth.maxColumnWidth = undefined]
   * Wrap cell content to this width. Fall back to global wordwrap value if undefined.
   */
  openTableCell (optionsObjectOrMaxColumnWidth = {}) {
    if (typeof optionsObjectOrMaxColumnWidth === 'object') {
      this._openTableCell(optionsObjectOrMaxColumnWidth);
    } else {
      this._openTableCell({ maxColumnWidth: optionsObjectOrMaxColumnWidth });
    }
  }

  _openTableCell ({ maxColumnWidth = undefined } = {}) {
    if (!(this._stackItem instanceof TableRowStackItem)) {
      throw new Error('Can\'t add table cell to something that is not a table row! Check the formatter.');
    }
    this._stackItem = new TableCellStackItem(this.options, this._stackItem, maxColumnWidth);
  }

  /**
   * Finalize currently built table cell and add it to parent table row's cells.
   *
   * @param { object | number } [optionsObjectOrColspan]
   * Object holding the parameters of the cell.
   *
   * Number value is deprecated.
   *
   * @param { number } [optionsObjectOrColspan.colspan = 1] How many columns this cell should occupy.
   * @param { number } [optionsObjectOrColspan.rowspan = 1] How many rows this cell should occupy.
   *
   * @param { number } [rowspan] Deprecated.
   */
  closeTableCell (optionsObjectOrColspan = {}, rowspan = undefined) {
    if (typeof optionsObjectOrColspan === 'object') {
      this._closeTableCell(optionsObjectOrColspan);
    } else {
      this._closeTableCell({
        colspan: optionsObjectOrColspan,
        rowspan: rowspan,
      });
    }
  }

  _closeTableCell ({ colspan = 1, rowspan = 1 } = {}) {
    const cell = this._popStackItem();
    const text = trimCharacter(getText(cell), '\n');
    cell.next.cells.push({ colspan: colspan, rowspan: rowspan, text: text });
  }

  /**
   * Finalize currently built table row and add it to parent table's rows.
   */
  closeTableRow () {
    const row = this._popStackItem();
    row.next.rows.push(row.cells);
  }

  /**
   * Finalize currently built table and add the rendered text to the parent block.
   *
   * @param { object | number } [optionsObjectOrColSpacing]
   * Object holding the parameters of the table.
   *
   * Number value is deprecated.
   *
   * @param { number } [optionsObjectOrColSpacing.colSpacing = 3]
   * Number of spaces between table columns.
   *
   * @param { number } [optionsObjectOrColSpacing.rowSpacing = 0]
   * Number of empty lines between table rows.
   *
   * @param { number } [optionsObjectOrColSpacing.leadingLineBreaks = 2]
   * This table should have at least this number of line breaks to separate if from any preceding block.
   *
   * @param { number } [optionsObjectOrColSpacing.trailingLineBreaks = 2]
   * This table should have at least this number of line breaks to separate it from any following block.
   *
   * @param { number } [rowSpacing]
   * Deprecated.
   *
   * @param { number } [leadingLineBreaks]
   * Deprecated.
   *
   * @param { number } [trailingLineBreaks]
   * Deprecated.
   */
  closeTable (
    optionsObjectOrColSpacing = {},
    rowSpacing = undefined,
    leadingLineBreaks = undefined,
    trailingLineBreaks = undefined
  ) {
    if (typeof optionsObjectOrColSpacing === 'object') {
      this._closeTable(optionsObjectOrColSpacing);
    } else {
      this._closeTable({
        colSpacing: optionsObjectOrColSpacing,
        leadingLineBreaks: leadingLineBreaks,
        rowSpacing: rowSpacing,
        trailingLineBreaks: trailingLineBreaks
      });
    }
  }

  _closeTable ({ colSpacing = 3, rowSpacing = 0, leadingLineBreaks = 2, trailingLineBreaks = 2 } = {}) {
    const table = this._popStackItem();
    const output = tableToString(table.rows, rowSpacing, colSpacing);
    if (output) {
      addText(this._stackItem, output, leadingLineBreaks, trailingLineBreaks);
    }
  }

  /**
   * Return the rendered text content of this builder.
   *
   * @returns { string }
   */
  toString () {
    return getText(this._stackItem.getRoot());
    // There should only be the root item if everything is closed properly.
  }

}

function getText (stackItem) {
  if (!(
    stackItem instanceof BlockStackItem
    || stackItem instanceof TableCellStackItem
  )) {
    throw new Error('Only blocks and table cells can be requested for text contents.');
  }
  return (stackItem.inlineTextBuilder.isEmpty())
    ? stackItem.rawText
    : stackItem.rawText + stackItem.inlineTextBuilder.toString();
}

function addText (stackItem, text, leadingLineBreaks, trailingLineBreaks) {
  if (!(
    stackItem instanceof BlockStackItem
    || stackItem instanceof TableCellStackItem
  )) {
    throw new Error('Only blocks and table cells can contain text.');
  }
  const parentText = getText(stackItem);
  const lineBreaks = Math.max(stackItem.stashedLineBreaks, leadingLineBreaks);
  stackItem.inlineTextBuilder.clear();
  if (parentText) {
    stackItem.rawText = parentText + '\n'.repeat(lineBreaks) + text;
  } else {
    stackItem.rawText = text;
    stackItem.leadingLineBreaks = lineBreaks;
  }
  stackItem.stashedLineBreaks = trailingLineBreaks;
}

module.exports = { BlockTextBuilder: BlockTextBuilder };


/***/ }),

/***/ 46366:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const he = __webpack_require__(88409);

const { get, numberToLetterSequence, numberToRoman, splitClassesAndIds, trimCharacter } = __webpack_require__(91610);

// eslint-disable-next-line import/no-unassigned-import
__webpack_require__(19901);


/**
 * Dummy formatter that discards the input and does nothing.
 *
 * @type { FormatCallback }
 */
function formatSkip (elem, walk, builder, formatOptions) {
  /* do nothing */
}

/**
 * Process an inline-level element.
 *
 * @type { FormatCallback }
 */
function formatInline (elem, walk, builder, formatOptions) {
  walk(elem.children, builder);
}

/**
 * Process a block-level container.
 *
 * @type { FormatCallback }
 */
function formatBlock (elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks });
}

/**
 * Process a line-break.
 *
 * @type { FormatCallback }
 */
function formatLineBreak (elem, walk, builder, formatOptions) {
  builder.addLineBreak();
}

/**
 * Process a `wbk` tag (word break opportunity).
 *
 * @type { FormatCallback }
 */
function formatWbr (elem, walk, builder, formatOptions) {
  builder.addWordBreakOpportunity();
}

/**
 * Process a horizontal line.
 *
 * @type { FormatCallback }
 */
function formatHorizontalLine (elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  builder.addInline('-'.repeat(formatOptions.length || builder.options.wordwrap || 40));
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}

/**
 * Process a paragraph.
 *
 * @type { FormatCallback }
 */
function formatParagraph (elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}

/**
 * Process a preformatted content.
 *
 * @type { FormatCallback }
 */
function formatPre (elem, walk, builder, formatOptions) {
  builder.openBlock({
    isPre: true,
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2
  });
  walk(elem.children, builder);
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}

/**
 * Process a heading.
 *
 * @type { FormatCallback }
 */
function formatHeading (elem, walk, builder, formatOptions) {
  builder.openBlock({ leadingLineBreaks: formatOptions.leadingLineBreaks || 2 });
  if (formatOptions.uppercase !== false) {
    builder.pushWordTransform(str => str.toUpperCase());
    walk(elem.children, builder);
    builder.popWordTransform();
  } else {
    walk(elem.children, builder);
  }
  builder.closeBlock({ trailingLineBreaks: formatOptions.trailingLineBreaks || 2 });
}

/**
 * Process a blockquote.
 *
 * @type { FormatCallback }
 */
function formatBlockquote (elem, walk, builder, formatOptions) {
  builder.openBlock({
    leadingLineBreaks: formatOptions.leadingLineBreaks || 2,
    reservedLineLength: 2
  });
  walk(elem.children, builder);
  builder.closeBlock({
    trailingLineBreaks: formatOptions.trailingLineBreaks || 2,
    blockTransform: str => ((formatOptions.trimEmptyLines !== false) ? trimCharacter(str, '\n') : str)
      .split('\n')
      .map(line => '> ' + line)
      .join('\n')
  });
}

function withBrackets (str, brackets) {
  if (!brackets) { return str; }

  const lbr = (typeof brackets[0] === 'string')
    ? brackets[0]
    : '[';
  const rbr = (typeof brackets[1] === 'string')
    ? brackets[1]
    : ']';
  return lbr + str + rbr;
}

/**
 * Process an image.
 *
 * @type { FormatCallback }
 */
function formatImage (elem, walk, builder, formatOptions) {
  const attribs = elem.attribs || {};
  const alt = (attribs.alt)
    ? he.decode(attribs.alt, builder.options.decodeOptions)
    : '';
  const src = (!attribs.src)
    ? ''
    : (formatOptions.baseUrl && attribs.src.indexOf('/') === 0)
      ? formatOptions.baseUrl + attribs.src
      : attribs.src;
  const text = (!src)
    ? alt
    : (!alt)
      ? withBrackets(src, formatOptions.linkBrackets)
      : alt + ' ' + withBrackets(src, formatOptions.linkBrackets);

  builder.addInline(text);
}

/**
 * Process an anchor.
 *
 * @type { FormatCallback }
 */
function formatAnchor (elem, walk, builder, formatOptions) {
  function getHref () {
    if (formatOptions.ignoreHref) { return ''; }
    if (!elem.attribs || !elem.attribs.href) { return ''; }
    let href = elem.attribs.href.replace(/^mailto:/, '');
    if (formatOptions.noAnchorUrl && href[0] === '#') { return ''; }
    href = (formatOptions.baseUrl && href[0] === '/')
      ? formatOptions.baseUrl + href
      : href;
    return he.decode(href, builder.options.decodeOptions);
  }
  const href = getHref();
  if (!href) {
    walk(elem.children, builder);
  } else {
    let text = '';
    builder.pushWordTransform(
      str => {
        if (str) { text += str; }
        return str;
      }
    );
    walk(elem.children, builder);
    builder.popWordTransform();

    const hideSameLink = formatOptions.hideLinkHrefIfSameAsText && href === text;
    if (!hideSameLink) {
      builder.addInline(
        (!text)
          ? href
          : ' ' + withBrackets(href, formatOptions.linkBrackets),
        { noWordTransform: true }
      );
    }
  }
}

/**
 * @param { DomNode }           elem               List items with their prefixes.
 * @param { RecursiveCallback } walk               Recursive callback to process child nodes.
 * @param { BlockTextBuilder }  builder            Passed around to accumulate output text.
 * @param { FormatOptions }     formatOptions      Options specific to a formatter.
 * @param { () => string }      nextPrefixCallback Function that returns increasing index each time it is called.
 */
function formatList (elem, walk, builder, formatOptions, nextPrefixCallback) {
  const isNestedList = get(elem, ['parent', 'name']) === 'li';

  // With Roman numbers, index length is not as straightforward as with Arabic numbers or letters,
  // so the dumb length comparison is the most robust way to get the correct value.
  let maxPrefixLength = 0;
  const listItems = (elem.children || [])
    // it might be more accurate to check only for html spaces here, but no significant benefit
    .filter(child => child.type !== 'text' || !/^\s*$/.test(child.data))
    .map(function (child) {
      if (child.name !== 'li') {
        return { node: child, prefix: '' };
      }
      const prefix = (isNestedList)
        ? nextPrefixCallback().trimStart()
        : nextPrefixCallback();
      if (prefix.length > maxPrefixLength) { maxPrefixLength = prefix.length; }
      return { node: child, prefix: prefix };
    });
  if (!listItems.length) { return; }

  const reservedLineLength = maxPrefixLength;
  const spacing = '\n' + ' '.repeat(reservedLineLength);
  builder.openBlock({ leadingLineBreaks: isNestedList ? 1 : (formatOptions.leadingLineBreaks || 2) });
  for (const { node, prefix } of listItems) {
    builder.openBlock({
      leadingLineBreaks: 1,
      reservedLineLength: reservedLineLength
    });
    walk([node], builder);
    builder.closeBlock({
      trailingLineBreaks: 1,
      blockTransform: str => prefix + ' '.repeat(reservedLineLength - prefix.length) + str.replace(/\n/g, spacing)
    });
  }
  builder.closeBlock({ trailingLineBreaks: isNestedList ? 1 : (formatOptions.trailingLineBreaks || 2) });
}

/**
 * Process an unordered list.
 *
 * @type { FormatCallback }
 */
function formatUnorderedList (elem, walk, builder, formatOptions) {
  const prefix = formatOptions.itemPrefix || ' * ';
  return formatList(elem, walk, builder, formatOptions, () => prefix);
}

/**
 * Process an ordered list.
 *
 * @type { FormatCallback }
 */
function formatOrderedList (elem, walk, builder, formatOptions) {
  let nextIndex = Number(elem.attribs.start || '1');
  const indexFunction = getOrderedListIndexFunction(elem.attribs.type);
  const nextPrefixCallback = () => ' ' + indexFunction(nextIndex++) + '. ';
  return formatList(elem, walk, builder, formatOptions, nextPrefixCallback);
}

/**
 * Return a function that can be used to generate index markers of a specified format.
 *
 * @param   { string } [olType='1'] Marker type.
 * @returns { (i: number) => string }
 */
function getOrderedListIndexFunction (olType = '1') {
  switch (olType) {
    case 'a': return (i) => numberToLetterSequence(i, 'a');
    case 'A': return (i) => numberToLetterSequence(i, 'A');
    case 'i': return (i) => numberToRoman(i).toLowerCase();
    case 'I': return (i) => numberToRoman(i);
    case '1':
    default: return (i) => (i).toString();
  }
}

function isDataTable (attr, tables) {
  if (tables === true) { return true; }
  if (!attr) { return false; }

  const { classes, ids } = splitClassesAndIds(tables);
  const attrClasses = (attr['class'] || '').split(' ');
  const attrIds = (attr['id'] || '').split(' ');

  return attrClasses.some(x => classes.includes(x)) || attrIds.some(x => ids.includes(x));
}

/**
 * Process a table (either as a container or as a data table, depending on options).
 *
 * @type { FormatCallback }
 */
function formatTable (elem, walk, builder, formatOptions) {
  return isDataTable(elem.attribs, builder.options.tables)
    ? formatDataTable(elem, walk, builder, formatOptions)
    : formatBlock(elem, walk, builder, formatOptions);
}

/**
 * Process a data table.
 *
 * @type { FormatCallback }
 */
function formatDataTable (elem, walk, builder, formatOptions) {
  builder.openTable();
  elem.children.forEach(walkTable);
  builder.closeTable({
    colSpacing: formatOptions.colSpacing,
    leadingLineBreaks: formatOptions.leadingLineBreaks,
    rowSpacing: formatOptions.rowSpacing,
    trailingLineBreaks: formatOptions.trailingLineBreaks
  });

  function formatCell (cellNode) {
    const colspan = +get(cellNode, ['attribs', 'colspan']) || 1;
    const rowspan = +get(cellNode, ['attribs', 'rowspan']) || 1;
    builder.openTableCell({ maxColumnWidth: formatOptions.maxColumnWidth });
    walk(cellNode.children, builder);
    builder.closeTableCell({ colspan: colspan, rowspan: rowspan });
  }

  function walkTable (elem) {
    if (elem.type !== 'tag') { return; }

    const formatHeaderCell = (formatOptions.uppercaseHeaderCells !== false)
      ? (cellNode) => {
        builder.pushWordTransform(str => str.toUpperCase());
        formatCell(cellNode);
        builder.popWordTransform();
      }
      : formatCell;

    switch (elem.name) {
      case 'thead':
      case 'tbody':
      case 'tfoot':
      case 'center':
        elem.children.forEach(walkTable);
        return;

      case 'tr': {
        builder.openTableRow();
        for (const childOfTr of elem.children) {
          if (childOfTr.type !== 'tag') { continue; }
          switch (childOfTr.name) {
            case 'th': {
              formatHeaderCell(childOfTr);
              break;
            }
            case 'td': {
              formatCell(childOfTr);
              break;
            }
            default:
              // do nothing
          }
        }
        builder.closeTableRow();
        break;
      }

      default:
        // do nothing
    }
  }
}

module.exports = {
  anchor: formatAnchor,
  block: formatBlock,
  blockquote: formatBlockquote,
  dataTable: formatDataTable,
  heading: formatHeading,
  horizontalLine: formatHorizontalLine,
  image: formatImage,
  inline: formatInline,
  lineBreak: formatLineBreak,
  orderedList: formatOrderedList,
  paragraph: formatParagraph,
  pre: formatPre,
  skip: formatSkip,
  table: formatTable,
  unorderedList: formatUnorderedList,
  wbr: formatWbr
};


/***/ }),

/***/ 91610:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


const merge = __webpack_require__(18203);

/**
 * Given a list of class and ID selectors (prefixed with '.' and '#'),
 * return them as separate lists of names without prefixes.
 *
 * @param { string[] } selectors Class and ID selectors (`[".class", "#id"]` etc).
 * @returns { { classes: string[], ids: string[] } }
 */
function splitClassesAndIds (selectors) {
  const classes = [];
  const ids = [];
  for (const selector of selectors) {
    if (selector.startsWith('.')) {
      classes.push(selector.substring(1));
    } else if (selector.startsWith('#')) {
      ids.push(selector.substring(1));
    }
  }
  return { classes: classes, ids: ids };
}

/**
 * Make a recursive function that will only run to a given depth
 * and switches to an alternative function at that depth. \
 * No limitation if `n` is `undefined` (Just wraps `f` in that case).
 *
 * @param   { number | undefined } n   Allowed depth of recursion. `undefined` for no limitation.
 * @param   { Function }           f   Function that accepts recursive callback as the first argument.
 * @param   { Function }           [g] Function to run instead, when maximum depth was reached. Do nothing by default.
 * @returns { Function }
 */
function limitedDepthRecursive (n, f, g = () => undefined) {
  if (n === undefined) {
    const f1 = function (...args) { return f(f1, ...args); };
    return f1;
  }
  if (n >= 0) {
    return function (...args) { return f(limitedDepthRecursive(n - 1, f, g), ...args); };
  }
  return g;
}

/**
 * Convert a number into alphabetic sequence representation (Sequence without zeroes).
 *
 * For example: `a, ..., z, aa, ..., zz, aaa, ...`.
 *
 * @param   { number } num              Number to convert. Must be >= 1.
 * @param   { string } [baseChar = 'a'] Character for 1 in the sequence.
 * @param   { number } [base = 26]      Number of characters in the sequence.
 * @returns { string }
 */
function numberToLetterSequence (num, baseChar = 'a', base = 26) {
  const digits = [];
  do {
    num -= 1;
    digits.push(num % base);
    num = (num / base) >> 0; // quick `floor`
  } while (num > 0);
  const baseCode = baseChar.charCodeAt(0);
  return digits
    .reverse()
    .map(n => String.fromCharCode(baseCode + n))
    .join('');
}

const I = ['I', 'X', 'C', 'M'];
const V = ['V', 'L', 'D'];

/**
 * Convert a number to it's Roman representation. No large numbers extension.
 *
 * @param   { number } num Number to convert. `0 < num <= 3999`.
 * @returns { string }
 */
function numberToRoman (num) {
  return [...(num) + '']
    .map(n => +n)
    .reverse()
    .map((v, i) => ((v % 5 < 4)
      ? (v < 5 ? '' : V[i]) + I[i].repeat(v % 5)
      : I[i] + (v < 5 ? V[i] : I[i + 1])))
    .reverse()
    .join('');
}

/**
 * Return the same string or a substring with the given character occurences removed from each end if any.
 *
 * @param   { string } str  A string to trim.
 * @param   { string } char A character to be trimmed.
 * @returns { string }
 */
function trimCharacter (str, char) {
  let start = 0;
  let end = str.length;
  while (start < end && str[start] === char) { ++start; }
  while (end > start && str[end - 1] === char) { --end; }
  return (start > 0 || end < str.length)
    ? str.substring(start, end)
    : str;
}

/**
 * Get a nested property from an object.
 *
 * @param   { object }   obj  The object to query for the value.
 * @param   { string[] } path The path to the property.
 * @returns { any }
 */
function get (obj, path) {
  for (const key of path) {
    if (!obj) { return undefined; }
    obj = obj[key];
  }
  return obj;
}

/**
 * Deduplicate an array by a given key callback.
 * Item properties are merged recursively and with the preference for last defined values.
 * Of items with the same key, merged item takes the place of the last item,
 * others are omitted.
 *
 * @param { any[] } items An array to deduplicate.
 * @param { (x: any) => string } getKey Callback to get a value that distinguishes unique items.
 * @returns { any[] }
 */
function mergeDuplicatesPreferLast (items, getKey) {
  const map = new Map();
  for (let i = items.length; i-- > 0;) {
    const item = items[i];
    const key = getKey(item);
    map.set(
      key,
      (map.has(key))
        ? merge(item, map.get(key), { arrayMerge: overwriteMerge })
        : item
    );
  }
  return [...map.values()].reverse();
}

const overwriteMerge = (acc, src, options) => [...src];

module.exports = {
  get: get,
  limitedDepthRecursive: limitedDepthRecursive,
  mergeDuplicatesPreferLast: mergeDuplicatesPreferLast,
  numberToLetterSequence: numberToLetterSequence,
  numberToRoman: numberToRoman,
  splitClassesAndIds: splitClassesAndIds,
  trimCharacter: trimCharacter
};


/***/ }),

/***/ 64809:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const { hp2Builder } = __webpack_require__(707);
const merge = __webpack_require__(18203);
const he = __webpack_require__(88409);
const htmlparser = __webpack_require__(83137);
const selderee = __webpack_require__(51900);

const { BlockTextBuilder } = __webpack_require__(75464);
const defaultFormatters = __webpack_require__(46366);
const { limitedDepthRecursive, mergeDuplicatesPreferLast, get } = __webpack_require__(91610);

// eslint-disable-next-line import/no-unassigned-import
__webpack_require__(19901);


/**
 * Default options.
 *
 * @constant
 * @type { Options }
 * @default
 * @private
 */
const DEFAULT_OPTIONS = {
  baseElements: {
    selectors: [ 'body' ],
    orderBy: 'selectors', // 'selectors' | 'occurrence'
    returnDomByDefault: true
  },
  decodeOptions: {
    isAttributeValue: false,
    strict: false
  },
  formatters: {},
  limits: {
    ellipsis: '...',
    maxBaseElements: undefined,
    maxChildNodes: undefined,
    maxDepth: undefined,
    maxInputLength: (1 << 24) // 16_777_216
  },
  longWordSplit: {
    forceWrapOnLimit: false,
    wrapCharacters: []
  },
  preserveNewlines: false,
  selectors: [
    { selector: '*', format: 'inline' },
    {
      selector: 'a',
      format: 'anchor',
      options: {
        baseUrl: null,
        hideLinkHrefIfSameAsText: false,
        ignoreHref: false,
        linkBrackets: ['[', ']'],
        noAnchorUrl: true
      }
    },
    { selector: 'article', format: 'block' },
    { selector: 'aside', format: 'block' },
    {
      selector: 'blockquote',
      format: 'blockquote',
      options: { leadingLineBreaks: 2, trailingLineBreaks: 2, trimEmptyLines: true }
    },
    { selector: 'br', format: 'lineBreak' },
    { selector: 'div', format: 'block' },
    { selector: 'footer', format: 'block' },
    { selector: 'form', format: 'block' },
    { selector: 'h1', format: 'heading', options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'h2', format: 'heading', options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'h3', format: 'heading', options: { leadingLineBreaks: 3, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'h4', format: 'heading', options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'h5', format: 'heading', options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'h6', format: 'heading', options: { leadingLineBreaks: 2, trailingLineBreaks: 2, uppercase: true } },
    { selector: 'header', format: 'block' },
    {
      selector: 'hr',
      format: 'horizontalLine',
      options: { leadingLineBreaks: 2, length: undefined, trailingLineBreaks: 2 }
    },
    {
      selector: 'img',
      format: 'image',
      options: { baseUrl: null, linkBrackets: ['[', ']'] }
    },
    { selector: 'main', format: 'block' },
    { selector: 'nav', format: 'block' },
    {
      selector: 'ol',
      format: 'orderedList',
      options: { leadingLineBreaks: 2, trailingLineBreaks: 2 }
    },
    { selector: 'p', format: 'paragraph', options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
    { selector: 'pre', format: 'pre', options: { leadingLineBreaks: 2, trailingLineBreaks: 2 } },
    { selector: 'section', format: 'block' },
    {
      selector: 'table',
      format: 'table',
      options: {
        colSpacing: 3,
        leadingLineBreaks: 2,
        maxColumnWidth: 60,
        rowSpacing: 0,
        trailingLineBreaks: 2,
        uppercaseHeaderCells: true
      }
    },
    {
      selector: 'ul',
      format: 'unorderedList',
      options: { itemPrefix: ' * ', leadingLineBreaks: 2, trailingLineBreaks: 2 }
    },
    { selector: 'wbr', format: 'wbr' },
  ],
  tables: [], // deprecated
  whitespaceCharacters: ' \t\r\n\f\u200b',
  wordwrap: 80
};

const concatMerge = (acc, src, options) => [...acc, ...src];
const overwriteMerge = (acc, src, options) => [...src];
const selectorsMerge = (acc, src, options) => (
  (acc.some(s => typeof s === 'object'))
    ? concatMerge(acc, src, options) // selectors
    : overwriteMerge(acc, src, options) // baseElements.selectors
);

/**
 * Preprocess options, compile selectors into a decision tree,
 * return a function intended for batch processing.
 *
 * @param   { Options } [options = {}]   HtmlToText options.
 * @returns { (html: string) => string } Pre-configured converter function.
 * @static
 */
function compile (options = {}) {
  options = merge(
    DEFAULT_OPTIONS,
    options,
    {
      arrayMerge: overwriteMerge,
      customMerge: (key) => ((key === 'selectors') ? selectorsMerge : undefined)
    }
  );
  options.formatters = Object.assign({}, defaultFormatters, options.formatters);

  handleDeprecatedOptions(options);

  const uniqueSelectors = mergeDuplicatesPreferLast(options.selectors, (s => s.selector));
  const selectorsWithoutFormat = uniqueSelectors.filter(s => !s.format);
  if (selectorsWithoutFormat.length) {
    throw new Error(
      'Following selectors have no specified format: ' +
      selectorsWithoutFormat.map(s => `\`${s.selector}\``).join(', ')
    );
  }
  const picker = new selderee.DecisionTree(
    uniqueSelectors.map(s => [s.selector, s])
  ).build(hp2Builder);

  const baseSelectorsPicker = new selderee.DecisionTree(
    options.baseElements.selectors.map((s, i) => [s, i + 1])
  ).build(hp2Builder);
  function findBaseElements (dom) {
    return findBases(dom, options, baseSelectorsPicker);
  }

  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk,
    function (dom, builder) {
      builder.addInline(options.limits.ellipsis || '');
    }
  );

  return function (html) {
    return process(html, options, picker, findBaseElements, limitedWalk);
  };
}

/**
 * Convert given HTML according to preprocessed options.
 *
 * @param { string } html HTML content to convert.
 * @param { Options } options HtmlToText options (preprocessed).
 * @param { Picker<DomNode, TagDefinition> } picker
 * Tag definition picker for DOM nodes processing.
 * @param { (dom: DomNode[]) => DomNode[] } findBaseElements
 * Function to extract elements from HTML DOM
 * that will only be present in the output text.
 * @param { RecursiveCallback } walk Recursive callback.
 * @returns { string }
 */
function process (html, options, picker, findBaseElements, walk) {
  const maxInputLength = options.limits.maxInputLength;
  if (maxInputLength && html && html.length > maxInputLength) {
    console.warn(
      `Input length ${html.length} is above allowed limit of ${maxInputLength}. Truncating without ellipsis.`
    );
    html = html.substring(0, maxInputLength);
  }

  const handler = new htmlparser.DomHandler();
  new htmlparser.Parser(handler, { decodeEntities: false }).parseComplete(html);

  const bases = findBaseElements(handler.dom);
  const builder = new BlockTextBuilder(options, picker);
  walk(bases, builder);
  return builder.toString();
}

/**
 * Convert given HTML content to plain text string.
 *
 * @param   { string }  html           HTML content to convert.
 * @param   { Options } [options = {}] HtmlToText options.
 * @returns { string }                 Plain text string.
 * @static
 *
 * @example
 * const { convert } = require('html-to-text');
 * const text = convert('<h1>Hello World</h1>', {
 *   wordwrap: 130
 * });
 * console.log(text); // HELLO WORLD
 */
function convert (html, options = {}) {
  return compile(options)(html);
}

/**
 * Map previously existing and now deprecated options to the new options layout.
 * This is a subject for cleanup in major releases.
 *
 * @param { Options } options HtmlToText options.
 */
function handleDeprecatedOptions (options) {
  const selectorDefinitions = options.selectors;

  if (options.tags) {
    const tagDefinitions = Object.entries(options.tags).map(
      ([selector, definition]) => ({ ...definition, selector: selector || '*' })
    );
    selectorDefinitions.push(...tagDefinitions);
  }

  function set (obj, path, value) {
    const valueKey = path.pop();
    for (const key of path) {
      let nested = obj[key];
      if (!nested) {
        nested = {};
        obj[key] = nested;
      }
      obj = nested;
    }
    obj[valueKey] = value;
  }

  function copyFormatterOption (source, format, target) {
    if (options[source] === undefined) { return; }
    for (const definition of selectorDefinitions) {
      if (definition.format === format) {
        set(definition, ['options', target], options[source]);
      }
    }
  }

  copyFormatterOption('hideLinkHrefIfSameAsText', 'anchor', 'hideLinkHrefIfSameAsText');
  copyFormatterOption('ignoreHref', 'anchor', 'ignoreHref');
  copyFormatterOption('linkHrefBaseUrl', 'anchor', 'baseUrl');
  copyFormatterOption('noAnchorUrl', 'anchor', 'noAnchorUrl');
  copyFormatterOption('noLinkBrackets', 'anchor', 'noLinkBrackets');

  copyFormatterOption('linkHrefBaseUrl', 'image', 'baseUrl');

  copyFormatterOption('unorderedListItemPrefix', 'unorderedList', 'itemPrefix');

  copyFormatterOption('uppercaseHeadings', 'heading', 'uppercase');
  copyFormatterOption('uppercaseHeadings', 'table', 'uppercaseHeadings');
  copyFormatterOption('uppercaseHeadings', 'dataTable', 'uppercaseHeadings');

  if (options['ignoreImage']) {
    for (const definition of selectorDefinitions) {
      if (definition.format === 'image') {
        definition.format = 'skip';
      }
    }
  }

  if (options['singleNewLineParagraphs']) {
    for (const definition of selectorDefinitions) {
      if (definition.format === 'paragraph' || definition.format === 'pre') {
        set(definition, ['options', 'leadingLineBreaks'], 1);
        set(definition, ['options', 'trailingLineBreaks'], 1);
      }
    }
  }

  if (options['baseElement']) {
    const baseElement = options['baseElement'];
    set(
      options,
      ['baseElements', 'selectors'],
      (Array.isArray(baseElement) ? baseElement : [baseElement])
    );
  }
  if (options['returnDomByDefault'] !== undefined) {
    set(options, ['baseElements', 'returnDomByDefault'], options['returnDomByDefault']);
  }

  for (const definition of selectorDefinitions) {
    if (definition.format === 'anchor' && get(definition, ['options', 'noLinkBrackets'])) {
      set(definition, ['options', 'linkBrackets'], false);
    }
  }
}

function findBases (dom, options, baseSelectorsPicker) {
  const results = [];

  function recursiveWalk (walk, /** @type { DomNode[] } */ dom) {
    dom = dom.slice(0, options.limits.maxChildNodes);
    for (const elem of dom) {
      if (elem.type !== 'tag') {
        continue;
      }
      const pickedSelectorIndex = baseSelectorsPicker.pick1(elem);
      if (pickedSelectorIndex > 0) {
        results.push({ selectorIndex: pickedSelectorIndex, element: elem });
      } else if (elem.children) {
        walk(elem.children);
      }
      if (results.length >= options.limits.maxBaseElements) {
        return;
      }
    }
  }

  const limitedWalk = limitedDepthRecursive(
    options.limits.maxDepth,
    recursiveWalk
  );
  limitedWalk(dom);

  if (options.baseElements.orderBy !== 'occurrence') { // 'selectors'
    results.sort((a, b) => a.selectorIndex - b.selectorIndex);
  }
  return (options.baseElements.returnDomByDefault && results.length === 0)
    ? dom
    : results.map(x => x.element);
}

/**
 * Function to walk through DOM nodes and accumulate their string representations.
 *
 * @param   { RecursiveCallback } walk    Recursive callback.
 * @param   { DomNode[] }         [dom]   Nodes array to process.
 * @param   { BlockTextBuilder }  builder Passed around to accumulate output text.
 * @private
 */
function recursiveWalk (walk, dom, builder) {
  if (!dom) { return; }

  const options = builder.options;

  const tooManyChildNodes = dom.length > options.limits.maxChildNodes;
  if (tooManyChildNodes) {
    dom = dom.slice(0, options.limits.maxChildNodes);
    dom.push({
      data: options.limits.ellipsis,
      type: 'text'
    });
  }

  for (const elem of dom) {
    switch (elem.type) {
      case 'text': {
        builder.addInline(he.decode(elem.data, options.decodeOptions));
        break;
      }
      case 'tag': {
        const tagDefinition = builder.picker.pick1(elem);
        const format = options.formatters[tagDefinition.format];
        format(elem, walk, builder, tagDefinition.options || {});
        break;
      }
      default:
        /* do nothing */
        break;
    }
  }

  return;
}

/**
 * @deprecated Use `{ convert }` function instead!
 * @see convert
 *
 * @param   { string }  html           HTML content to convert.
 * @param   { Options } [options = {}] HtmlToText options.
 * @returns { string }                 Plain text string.
 * @static
 */
const fromString = (html, options = {}) => convert(html, options);

module.exports = {
  compile: compile,
  convert: convert,
  fromString: fromString,
  htmlToText: convert
};


/***/ }),

/***/ 38077:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// eslint-disable-next-line import/no-unassigned-import
__webpack_require__(19901);

/**
 * Helps to build text from words.
 */
class InlineTextBuilder {
  /**
   * Creates an instance of InlineTextBuilder.
   *
   * If `maxLineLength` is not provided then it is either `options.wordwrap` or unlimited.
   *
   * @param { Options } options           HtmlToText options.
   * @param { number }  [ maxLineLength ] This builder will try to wrap text to fit this line length.
   */
  constructor (options, maxLineLength = undefined) {
    /** @type { string[][] } */
    this.lines = [];
    /** @type { string[] }   */
    this.nextLineWords = [];
    this.maxLineLength = maxLineLength || options.wordwrap || Number.MAX_VALUE;
    this.nextLineAvailableChars = this.maxLineLength;
    this.wrapCharacters = options.longWordSplit.wrapCharacters || [];
    this.forceWrapOnLimit = options.longWordSplit.forceWrapOnLimit || false;

    this.stashedSpace = false;
    this.wordBreakOpportunity = false;
  }

  /**
   * Add a new word.
   *
   * @param { string } word A word to add.
   */
  pushWord (word) {
    if (this.nextLineAvailableChars <= 0) {
      this.startNewLine();
    }
    const isLineStart = this.nextLineWords.length === 0;
    const cost = word.length + (isLineStart ? 0 : 1);
    if (cost <= this.nextLineAvailableChars) { // Fits into available budget

      this.nextLineWords.push(word);
      this.nextLineAvailableChars -= cost;

    } else { // Does not fit - try to split the word

      // The word is moved to a new line - prefer to wrap between words.
      const [first, ...rest] = this.splitLongWord(word);
      if (!isLineStart) { this.startNewLine(); }
      this.nextLineWords.push(first);
      this.nextLineAvailableChars -= first.length;
      for (const part of rest) {
        this.startNewLine();
        this.nextLineWords.push(part);
        this.nextLineAvailableChars -= part.length;
      }

    }
  }

  /**
   * Pop a word from the currently built line.
   * This doesn't affect completed lines.
   *
   * @returns { string }
   */
  popWord () {
    const lastWord = this.nextLineWords.pop();
    if (lastWord !== undefined) {
      const isLineStart = this.nextLineWords.length === 0;
      const cost = lastWord.length + (isLineStart ? 0 : 1);
      this.nextLineAvailableChars += cost;
    }
    return lastWord;
  }

  /**
   * Concat a word to the last word already in the builder.
   * Adds a new word in case there are no words yet in the last line.
   *
   * @param { string } word A word to be concatenated.
   */
  concatWord (word) {
    if (this.wordBreakOpportunity && word.length > this.nextLineAvailableChars) {
      this.pushWord(word);
      this.wordBreakOpportunity = false;
    } else {
      const lastWord = this.popWord();
      this.pushWord((lastWord) ? lastWord.concat(word) : word);
    }
  }

  /**
   * Add current line (and more empty lines if provided argument > 1) to the list of complete lines and start a new one.
   *
   * @param { number } n Number of line breaks that will be added to the resulting string.
   */
  startNewLine (n = 1) {
    this.lines.push(this.nextLineWords);
    if (n > 1) {
      this.lines.push(...Array.from({ length: n - 1 }, () => []));
    }
    this.nextLineWords = [];
    this.nextLineAvailableChars = this.maxLineLength;
  }

  /**
   * No words in this builder.
   *
   * @returns { boolean }
   */
  isEmpty () {
    return this.lines.length === 0
        && this.nextLineWords.length === 0;
  }

  clear () {
    this.lines.length = 0;
    this.nextLineWords.length = 0;
    this.nextLineAvailableChars = this.maxLineLength;
  }

  /**
   * Join all lines of words inside the InlineTextBuilder into a complete string.
   *
   * @returns { string }
   */
  toString () {
    return [...this.lines, this.nextLineWords]
      .map(words => words.join(' '))
      .join('\n');
  }

  /**
   * Split a long word up to fit within the word wrap limit.
   * Use either a character to split looking back from the word wrap limit,
   * or truncate to the word wrap limit.
   *
   * @param   { string }   word Input word.
   * @returns { string[] }      Parts of the word.
   */
  splitLongWord (word) {
    const parts = [];
    let idx = 0;
    while (word.length > this.maxLineLength) {

      const firstLine = word.substring(0, this.maxLineLength);
      const remainingChars = word.substring(this.maxLineLength);

      const splitIndex = firstLine.lastIndexOf(this.wrapCharacters[idx]);

      if (splitIndex > -1) { // Found a character to split on

        word = firstLine.substring(splitIndex + 1) + remainingChars;
        parts.push(firstLine.substring(0, splitIndex + 1));

      } else { // Not found a character to split on

        idx++;
        if (idx < this.wrapCharacters.length) { // There is next character to try

          word = firstLine + remainingChars;

        } else { // No more characters to try

          if (this.forceWrapOnLimit) {
            parts.push(firstLine);
            word = remainingChars;
            if (word.length > this.maxLineLength) {
              continue;
            }
          } else {
            word = firstLine + remainingChars;
          }
          break;

        }

      }

    }
    parts.push(word); // Add remaining part to array
    return parts;
  }
}

module.exports = { InlineTextBuilder: InlineTextBuilder };


/***/ }),

/***/ 4779:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/* eslint-disable max-classes-per-file */

const { InlineTextBuilder } = __webpack_require__(38077);


class StackItem {
  constructor (next = null) { this.next = next; }

  getRoot () { return (this.next) ? this.next : this; }
}

class BlockStackItem extends StackItem {
  constructor (options, next = null, leadingLineBreaks = 1, maxLineLength = undefined) {
    super(next);
    this.leadingLineBreaks = leadingLineBreaks;
    this.inlineTextBuilder = new InlineTextBuilder(options, maxLineLength);
    this.rawText = '';
    this.stashedLineBreaks = 0;
    this.isPre = next && next.isPre;
  }
}

class TableStackItem extends StackItem {
  constructor (next = null) {
    super(next);
    this.rows = [];
    this.isPre = next && next.isPre;
  }
}

class TableRowStackItem extends StackItem {
  constructor (next = null) {
    super(next);
    this.cells = [];
    this.isPre = next && next.isPre;
  }
}

class TableCellStackItem extends StackItem {
  constructor (options, next = null, maxColumnWidth = undefined) {
    super(next);
    this.inlineTextBuilder = new InlineTextBuilder(options, maxColumnWidth);
    this.rawText = '';
    this.stashedLineBreaks = 0;
    this.isPre = next && next.isPre;
  }
}

class TransformerStackItem extends StackItem {
  constructor (next = null, transform) {
    super(next);
    this.transform = transform;
  }
}

module.exports = {
  BlockStackItem: BlockStackItem,
  StackItem: StackItem,
  TableCellStackItem: TableCellStackItem,
  TableRowStackItem: TableRowStackItem,
  TableStackItem: TableStackItem,
  TransformerStackItem: TransformerStackItem,
};


/***/ }),

/***/ 60121:
/***/ ((module) => {


function getRow (matrix, j) {
  if (!matrix[j]) { matrix[j] = []; }
  return matrix[j];
}

function findFirstVacantIndex (row, x = 0) {
  while (row[x]) { x++; }
  return x;
}

function transposeInPlace (matrix, maxSize) {
  for (let i = 0; i < maxSize; i++) {
    const rowI = getRow(matrix, i);
    for (let j = 0; j < i; j++) {
      const rowJ = getRow(matrix, j);
      const temp = rowI[j];
      rowI[j] = rowJ[i];
      rowJ[i] = temp;
    }
  }
}

function putCellIntoLayout (cell, layout, baseRow, baseCol) {
  for (let r = 0; r < cell.rowspan; r++) {
    const layoutRow = getRow(layout, baseRow + r);
    for (let c = 0; c < cell.colspan; c++) {
      layoutRow[baseCol + c] = cell;
    }
  }
}

function updateOffset (offsets, base, span, value) {
  offsets[base + span] = Math.max(
    offsets[base + span] || 0,
    offsets[base] + value
  );
}

/**
 * @typedef { object } TablePrinterCell
 * Cell definition for the table printer.
 *
 * @property { number } colspan Number of columns this cell occupies.
 * @property { number } rowspan Number of rows this cell occupies.
 * @property { string } text Cell contents (pre-wrapped).
 */

/**
 * Render a table into string.
 * Cells can contain multiline text and span across multiple rows and columns.
 *
 * Modifies cells to add lines array.
 *
 * @param { TablePrinterCell[][] } tableRows Table to render.
 * @param { number } rowSpacing Number of spaces between columns.
 * @param { number } colSpacing Number of empty lines between rows.
 * @returns { string }
 */
function tableToString (tableRows, rowSpacing, colSpacing) {
  const layout = [];
  let colNumber = 0;
  const rowNumber = tableRows.length;
  const rowOffsets = [0];
  // Fill the layout table and row offsets row-by-row.
  for (let j = 0; j < rowNumber; j++) {
    const layoutRow = getRow(layout, j);
    const cells = tableRows[j];
    let x = 0;
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      x = findFirstVacantIndex(layoutRow, x);
      putCellIntoLayout(cell, layout, j, x);
      x += cell.colspan;
      cell.lines = cell.text.split('\n');
      const cellHeight = cell.lines.length;
      updateOffset(rowOffsets, j, cell.rowspan, cellHeight + rowSpacing);
    }
    colNumber = (layoutRow.length > colNumber) ? layoutRow.length : colNumber;
  }

  transposeInPlace(layout, (rowNumber > colNumber) ? rowNumber : colNumber);

  const outputLines = [];
  const colOffsets = [0];
  // Fill column offsets and output lines column-by-column.
  for (let x = 0; x < colNumber; x++) {
    let y = 0;
    let cell;
    while (y < rowNumber && (cell = layout[x][y])) {
      if (!cell.rendered) {
        let cellWidth = 0;
        for (let j = 0; j < cell.lines.length; j++) {
          const line = cell.lines[j];
          const lineOffset = rowOffsets[y] + j;
          outputLines[lineOffset] = (outputLines[lineOffset] || '').padEnd(colOffsets[x]) + line;
          cellWidth = (line.length > cellWidth) ? line.length : cellWidth;
        }
        updateOffset(colOffsets, x, cell.colspan, cellWidth + colSpacing);
        cell.rendered = true;
      }
      y += cell.rowspan;
    }
  }

  return outputLines.join('\n');
}

module.exports = { tableToString: tableToString };


/***/ }),

/***/ 19901:
/***/ (() => {


/**
 * @typedef { object } Options
 * HtmlToText options.
 *
 * @property { BaseElementsOptions }  [baseElements]
 * Options for narrowing down to informative parts of HTML document.
 *
 * @property { DecodeOptions }        [decodeOptions]
 * Text decoding options given to `he.decode`.
 *
 * For more information see the [he](https://github.com/mathiasbynens/he) module.
 *
 * @property { object.< string, FormatCallback > } [formatters = {}]
 * A dictionary with custom formatting functions for specific kinds of elements.
 *
 * Keys are custom string identifiers, values are callbacks.
 *
 * @property { LimitsOptions }        [limits]
 * Options for handling complex documents and limiting the output size.
 *
 * @property { LongWordSplitOptions } [longWordSplit]
 * Describes how to wrap long words.
 *
 * @property { boolean }              [preserveNewlines = false]
 * By default, any newlines `\n` from the input HTML are collapsed into space as any other HTML whitespace characters.
 * If `true`, these newlines will be preserved in the output.
 * This is only useful when input HTML carries some plain text formatting instead of proper tags.
 *
 * @property { SelectorDefinition[] } [selectors = []]
 * Instructions for how to render HTML elements based on matched selectors.
 *
 * Use this to (re)define options for new or already supported tags.
 *
 * @property { string[] | boolean }   [tables = []]
 * Deprecated. Use selectors with `format: 'dataTable'` instead.
 *
 * @property { string }               [whitespaceCharacters = ' \t\r\n\f\u200b']
 * All characters that are considered whitespace.
 * Default is according to HTML specifications.
 *
 * @property { number | boolean | null } [wordwrap = 80]
 * After how many chars a line break should follow in `p` elements.
 *
 * Set to `null` or `false` to disable word-wrapping.
 */

/**
 * @typedef { object } BaseElementsOptions
 * Options for narrowing down to informative parts of HTML document.
 *
 * @property { string[] } [selectors = ['body']]
 * The resulting text output will be composed from the text content of elements
 * matched with these selectors.
 *
 * @property { 'selectors' | 'occurrence' } [orderBy = 'selectors']
 * When multiple selectors are set, this option specifies
 * whether the selectors order has to be reflected in the output text.
 *
 * `'selectors'` (default) - matches for the first selector will appear first, etc;
 *
 * `'occurrence'` - all bases will appear in the same order as in input HTML.
 *
 * @property { boolean } [returnDomByDefault = true]
 * Use the entire document if none of provided selectors matched.
 */

/**
 * @typedef { object } DecodeOptions
 * Text decoding options given to `he.decode`.
 *
 * For more information see the [he](https://github.com/mathiasbynens/he) module.
 *
 * @property { boolean } [isAttributeValue = false]
 * TL;DR: If set to `true` - leave attribute values raw, don't parse them as text content.
 *
 * @property { boolean } [strict = false]
 * TL;DR: If set to `true` - throw an error on invalid HTML input.
 */

/**
 * @typedef { object } LimitsOptions
 * Options for handling complex documents and limiting the output size.
 *
 * @property { string } [ellipsis = ...]
 * A string to put in place of skipped content.
 *
 * @property { number | undefined } [maxBaseElements = undefined]
 * Stop looking for new base elements after this number of matches.
 *
 * No ellipsis is used when this condition is met.
 *
 * No limit if undefined.
 *
 * @property { number | undefined } [maxChildNodes = undefined]
 * Process only this many child nodes of any element.
 *
 * Remaining nodes, if any, will be replaced with ellipsis.
 *
 * Text nodes are counted along with tags.
 *
 * No limit if undefined.
 *
 * @property { number | undefined } [maxDepth = undefined]
 * Only go to a certain depth starting from `Options.baseElement`.
 *
 * Replace deeper nodes with ellipsis.
 *
 * No depth limit if undefined.
 *
 * @property { number } [maxInputLength = 16_777_216]
 * If the input string is longer than this value - it will be truncated
 * and a message will be sent to `stderr`.
 *
 * Ellipsis is not used in this case.
 */

/**
 * @typedef { object } LongWordSplitOptions
 * Describes how to wrap long words.
 *
 * @property { boolean }  [forceWrapOnLimit = false]
 * Break long words on the `Options.wordwrap` limit when there are no characters to wrap on.
 *
 * @property { string[] } [wrapCharacters = []]
 * An array containing the characters that may be wrapped on.
 */

/**
 * @typedef { object } SelectorDefinition
 * Describes how to handle tags matched by a selector.
 *
 * @property { string } selector
 * CSS selector. Refer to README for notes on supported selectors etc.
 *
 * @property { string } format
 * Identifier of a {@link FormatCallback}, built-in or provided in `Options.formatters` dictionary.
 *
 * @property { FormatOptions } options
 * Options to customize the formatter for this element.
 */

/**
 * @typedef { object } FormatOptions
 * Options specific to different formatters ({@link FormatCallback}).
 * This is an umbrella type definition. Each formatter supports it's own subset of options.
 *
 * @property { number } [leadingLineBreaks]
 * Number of line breaks to separate previous block from this one.
 *
 * Note that N+1 line breaks are needed to make N empty lines.
 *
 * @property { number } [trailingLineBreaks]
 * Number of line breaks to separate this block from the next one.
 *
 * Note that N+1 line breaks are needed to make N empty lines.
 *
 * @property { string | null } [baseUrl = null]
 * (Only for: `anchor` and `image` formatters.) Server host for link `href` attributes and image `src` attributes
 * relative to the root (the ones that start with `/`).
 *
 * For example, with `baseUrl = 'http://asdf.com'` and `<a href='/dir/subdir'>...</a>`
 * the link in the text will be `http://asdf.com/dir/subdir`.
 *
 * Keep in mind that `baseUrl` should not end with a `/`.
 *
 * @property { boolean } [hideLinkHrefIfSameAsText = false]
 * (Only for: `anchor` formatter.) By default links are translated in the following way:
 *
 * `<a href='link'>text</a>` => becomes => `text [link]`.
 *
 * If this option is set to `true` and `link` and `text` are the same,
 * `[link]` will be omitted and only `text` will be present.
 *
 * @property { boolean } [ignoreHref = false]
 * (Only for: `anchor` formatter.) Ignore all links. Only process internal text of anchor tags.
 *
 * @property { [string, string] | false } [linkBrackets]
 * (Only for: `anchor` and `image` formatters.) Surround links with these brackets. Default: `['[', ']']`.
 *
 * Set to `false` or `['', '']` to disable.
 *
 * @property { boolean } [noAnchorUrl = true]
 * (Only for: `anchor` formatter.) Ignore anchor links (where `href='#...'`).
 *
 * @property { string } [itemPrefix = ' * ']
 * (Only for: `unorderedList` formatter.) String prefix for each list item.
 *
 * @property { boolean } [uppercase = true]
 * (Only for: `heading` formatter.) By default, headings (`<h1>`, `<h2>`, etc) are uppercased.
 *
 * Set this to `false` to leave headings as they are.
 *
 * @property { number | undefined } [length = undefined]
 * (Only for: `horizontalLine` formatter.) Length of the `<hr/>` line.
 *
 * If numeric value is provided - it is used.
 * Otherwise, if global `wordwrap` number is provided - it is used.
 * If neither is true, then the fallback value of 40 is used.
 *
 * @property { boolean } [trimEmptyLines = true]
 * (Only for: `blockquote` formatter.) Trim empty lines from blockquote.
 *
 * @property { boolean } [uppercaseHeaderCells = true]
 * (Only for: `table`, `dataTable` formatter.) By default, heading cells (`<th>`) are uppercased.
 *
 * Set this to `false` to leave heading cells as they are.
 *
 * @property { number } [maxColumnWidth = 60]
 * (Only for: `table`, `dataTable` formatter.) Data table cell content will be wrapped to fit this width
 * instead of global `wordwrap` limit.
 *
 * Set this to `undefined` in order to fall back to `wordwrap` limit.
 *
 * @property { number } [colSpacing = 3]
 * (Only for: `table`, `dataTable` formatter.) Number of spaces between data table columns.
 *
 * @property { number } [rowSpacing = 0]
 * (Only for: `table`, `dataTable` formatter.) Number of empty lines between data table rows.
 *
 */

/**
 * @typedef { object } DomNode
 * Simplified definition of [htmlparser2](https://github.com/fb55/htmlparser2) Node type.
 *
 * Makes no distinction between elements (tags) and data nodes (good enough for now).
 *
 * @property { string }                 type       Type of node - "text", "tag", "comment", "script", etc.
 * @property { string }                 [data]     Content of a data node.
 * @property { string }                 [name]     Tag name.
 * @property { object.<string,string> } [attribs]  Tag attributes dictionary.
 * @property { DomNode[] }              [children] Child nodes.
 * @property { DomNode }                [parent]   Parent node.
 */

/**
 * A function to stringify a DOM node.
 *
 * @callback FormatCallback
 *
 * @param   { DomNode }           elem          A DOM node as returned by [htmlparser2](https://github.com/fb55/htmlparser2).
 * @param   { RecursiveCallback } walk          Recursive callback to process child nodes.
 * @param   { BlockTextBuilder }  builder       Passed around to accumulate output text. Contains options object.
 * @param   { FormatOptions }     formatOptions Options specific to this callback.
 */

/**
 * A function to process child nodes.
 * Passed into a {@link FormatCallback} as an argument.
 *
 * @callback RecursiveCallback
 *
 * @param   { DomNode[] }        [nodes] DOM nodes array.
 * @param   { BlockTextBuilder } builder Passed around to accumulate output text. Contains options object.
 */


/***/ }),

/***/ 96776:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {


// eslint-disable-next-line no-unused-vars
const { InlineTextBuilder } = __webpack_require__(38077);

// eslint-disable-next-line import/no-unassigned-import
__webpack_require__(19901);


function charactersToCodes (str) {
  return [...str]
    .map(c => '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0'))
    .join('');
}

/**
 * Helps to handle HTML whitespaces.
 *
 * @class WhitespaceProcessor
 */
class WhitespaceProcessor {

  /**
   * Creates an instance of WhitespaceProcessor.
   *
   * @param { Options } options    HtmlToText options.
   * @memberof WhitespaceProcessor
   */
  constructor (options) {
    this.whitespaceChars = (options.preserveNewlines)
      ? options.whitespaceCharacters.replace(/\n/g, '')
      : options.whitespaceCharacters;
    const whitespaceCodes = charactersToCodes(this.whitespaceChars);
    this.leadingWhitespaceRe = new RegExp(`^[${whitespaceCodes}]`);
    this.trailingWhitespaceRe = new RegExp(`[${whitespaceCodes}]$`);
    this.allWhitespaceOrEmptyRe = new RegExp(`^[${whitespaceCodes}]*$`);
    this.newlineOrNonWhitespaceRe = new RegExp(`(\\n|[^\\n${whitespaceCodes}])`, 'g');

    if (options.preserveNewlines) {

      const wordOrNewlineRe = new RegExp(`\\n|[^\\n${whitespaceCodes}]+`, 'gm');

      /**
       * Shrink whitespaces and wrap text, add to the builder.
       *
       * @param { string }                  text              Input text.
       * @param { InlineTextBuilder }       inlineTextBuilder A builder to receive processed text.
       * @param { (str: string) => string } [ transform ]     A transform to be applied to words.
       */
      this.shrinkWrapAdd = function (text, inlineTextBuilder, transform = (str => str)) {
        if (!text) { return; }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = wordOrNewlineRe.exec(text);
        if (m) {
          anyMatch = true;
          if (m[0] === '\n') {
            inlineTextBuilder.startNewLine();
          } else if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
            inlineTextBuilder.pushWord(transform(m[0]));
          } else {
            inlineTextBuilder.concatWord(transform(m[0]));
          }
          while ((m = wordOrNewlineRe.exec(text)) !== null) {
            if (m[0] === '\n') {
              inlineTextBuilder.startNewLine();
            } else {
              inlineTextBuilder.pushWord(transform(m[0]));
            }
          }
        }
        inlineTextBuilder.stashedSpace = (previouslyStashedSpace && !anyMatch) || (this.testTrailingWhitespace(text));
        // No need to stash a space in case last added item was a new line,
        // but that won't affect anything later anyway.
      };

    } else {

      const wordRe = new RegExp(`[^${whitespaceCodes}]+`, 'g');

      this.shrinkWrapAdd = function (text, inlineTextBuilder, transform = (str => str)) {
        if (!text) { return; }
        const previouslyStashedSpace = inlineTextBuilder.stashedSpace;
        let anyMatch = false;
        let m = wordRe.exec(text);
        if (m) {
          anyMatch = true;
          if (previouslyStashedSpace || this.testLeadingWhitespace(text)) {
            inlineTextBuilder.pushWord(transform(m[0]));
          } else {
            inlineTextBuilder.concatWord(transform(m[0]));
          }
          while ((m = wordRe.exec(text)) !== null) {
            inlineTextBuilder.pushWord(transform(m[0]));
          }
        }
        inlineTextBuilder.stashedSpace = (previouslyStashedSpace && !anyMatch) || this.testTrailingWhitespace(text);
      };

    }
  }

  /**
   * Test whether the given text starts with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testLeadingWhitespace (text) {
    return this.leadingWhitespaceRe.test(text);
  }

  /**
   * Test whether the given text ends with HTML whitespace character.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testTrailingWhitespace (text) {
    return this.trailingWhitespaceRe.test(text);
  }

  /**
   * Test whether the given text contains any non-whitespace characters.
   *
   * @param   { string }  text  The string to test.
   * @returns { boolean }
   */
  testContainsWords (text) {
    return !this.allWhitespaceOrEmptyRe.test(text);
  }

  /**
   * Return the number of newlines if there are no words.
   *
   * If any word is found then return zero regardless of the actual number of newlines.
   *
   * @param   { string }  text  Input string.
   * @returns { number }
   */
  countNewlinesNoWords (text) {
    this.newlineOrNonWhitespaceRe.lastIndex = 0;
    let counter = 0;
    let match;
    while ((match = this.newlineOrNonWhitespaceRe.exec(text)) !== null) {
      if (match[0] === '\n') {
        counter++;
      } else {
        return 0;
      }
    }
    return counter;
  }

}

module.exports = { WhitespaceProcessor: WhitespaceProcessor };


/***/ }),

/***/ 8612:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.parseFeed = exports.FeedHandler = void 0;
var domhandler_1 = __importDefault(__webpack_require__(89641));
var DomUtils = __importStar(__webpack_require__(23774));
var Parser_1 = __webpack_require__(14477);
var FeedItemMediaMedium;
(function (FeedItemMediaMedium) {
    FeedItemMediaMedium[FeedItemMediaMedium["image"] = 0] = "image";
    FeedItemMediaMedium[FeedItemMediaMedium["audio"] = 1] = "audio";
    FeedItemMediaMedium[FeedItemMediaMedium["video"] = 2] = "video";
    FeedItemMediaMedium[FeedItemMediaMedium["document"] = 3] = "document";
    FeedItemMediaMedium[FeedItemMediaMedium["executable"] = 4] = "executable";
})(FeedItemMediaMedium || (FeedItemMediaMedium = {}));
var FeedItemMediaExpression;
(function (FeedItemMediaExpression) {
    FeedItemMediaExpression[FeedItemMediaExpression["sample"] = 0] = "sample";
    FeedItemMediaExpression[FeedItemMediaExpression["full"] = 1] = "full";
    FeedItemMediaExpression[FeedItemMediaExpression["nonstop"] = 2] = "nonstop";
})(FeedItemMediaExpression || (FeedItemMediaExpression = {}));
// TODO: Consume data as it is coming in
var FeedHandler = /** @class */ (function (_super) {
    __extends(FeedHandler, _super);
    /**
     *
     * @param callback
     * @param options
     */
    function FeedHandler(callback, options) {
        var _this = this;
        if (typeof callback === "object") {
            callback = undefined;
            options = callback;
        }
        _this = _super.call(this, callback, options) || this;
        return _this;
    }
    FeedHandler.prototype.onend = function () {
        var _a, _b;
        var feedRoot = getOneElement(isValidFeed, this.dom);
        if (!feedRoot) {
            this.handleCallback(new Error("couldn't find root of feed"));
            return;
        }
        var feed = {};
        if (feedRoot.name === "feed") {
            var childs = feedRoot.children;
            feed.type = "atom";
            addConditionally(feed, "id", "id", childs);
            addConditionally(feed, "title", "title", childs);
            var href = getAttribute("href", getOneElement("link", childs));
            if (href) {
                feed.link = href;
            }
            addConditionally(feed, "description", "subtitle", childs);
            var updated = fetch("updated", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "email", childs, true);
            feed.items = getElements("entry", childs).map(function (item) {
                var entry = {};
                var children = item.children;
                addConditionally(entry, "id", "id", children);
                addConditionally(entry, "title", "title", children);
                var href = getAttribute("href", getOneElement("link", children));
                if (href) {
                    entry.link = href;
                }
                var description = fetch("summary", children) || fetch("content", children);
                if (description) {
                    entry.description = description;
                }
                var pubDate = fetch("updated", children);
                if (pubDate) {
                    entry.pubDate = new Date(pubDate);
                }
                entry.media = getMediaElements(children);
                return entry;
            });
        }
        else {
            var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
            feed.type = feedRoot.name.substr(0, 3);
            feed.id = "";
            addConditionally(feed, "title", "title", childs);
            addConditionally(feed, "link", "link", childs);
            addConditionally(feed, "description", "description", childs);
            var updated = fetch("lastBuildDate", childs);
            if (updated) {
                feed.updated = new Date(updated);
            }
            addConditionally(feed, "author", "managingEditor", childs, true);
            feed.items = getElements("item", feedRoot.children).map(function (item) {
                var entry = {};
                var children = item.children;
                addConditionally(entry, "id", "guid", children);
                addConditionally(entry, "title", "title", children);
                addConditionally(entry, "link", "link", children);
                addConditionally(entry, "description", "description", children);
                var pubDate = fetch("pubDate", children);
                if (pubDate)
                    entry.pubDate = new Date(pubDate);
                entry.media = getMediaElements(children);
                return entry;
            });
        }
        this.feed = feed;
        this.handleCallback(null);
    };
    return FeedHandler;
}(domhandler_1.default));
exports.FeedHandler = FeedHandler;
function getMediaElements(where) {
    return getElements("media:content", where).map(function (elem) {
        var media = {
            medium: elem.attribs.medium,
            isDefault: !!elem.attribs.isDefault,
        };
        if (elem.attribs.url) {
            media.url = elem.attribs.url;
        }
        if (elem.attribs.fileSize) {
            media.fileSize = parseInt(elem.attribs.fileSize, 10);
        }
        if (elem.attribs.type) {
            media.type = elem.attribs.type;
        }
        if (elem.attribs.expression) {
            media.expression = elem.attribs
                .expression;
        }
        if (elem.attribs.bitrate) {
            media.bitrate = parseInt(elem.attribs.bitrate, 10);
        }
        if (elem.attribs.framerate) {
            media.framerate = parseInt(elem.attribs.framerate, 10);
        }
        if (elem.attribs.samplingrate) {
            media.samplingrate = parseInt(elem.attribs.samplingrate, 10);
        }
        if (elem.attribs.channels) {
            media.channels = parseInt(elem.attribs.channels, 10);
        }
        if (elem.attribs.duration) {
            media.duration = parseInt(elem.attribs.duration, 10);
        }
        if (elem.attribs.height) {
            media.height = parseInt(elem.attribs.height, 10);
        }
        if (elem.attribs.width) {
            media.width = parseInt(elem.attribs.width, 10);
        }
        if (elem.attribs.lang) {
            media.lang = elem.attribs.lang;
        }
        return media;
    });
}
function getElements(tagName, where) {
    return DomUtils.getElementsByTagName(tagName, where, true);
}
function getOneElement(tagName, node) {
    return DomUtils.getElementsByTagName(tagName, node, true, 1)[0];
}
function fetch(tagName, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    return DomUtils.getText(DomUtils.getElementsByTagName(tagName, where, recurse, 1)).trim();
}
function getAttribute(name, elem) {
    if (!elem) {
        return null;
    }
    var attribs = elem.attribs;
    return attribs[name];
}
function addConditionally(obj, prop, what, where, recurse) {
    if (recurse === void 0) { recurse = false; }
    var tmp = fetch(what, where, recurse);
    if (tmp)
        obj[prop] = tmp;
}
function isValidFeed(value) {
    return value === "rss" || value === "feed" || value === "rdf:RDF";
}
/**
 * Parse a feed.
 *
 * @param feed The feed that should be parsed, as a string.
 * @param options Optionally, options for parsing. When using this option, you should set `xmlMode` to `true`.
 */
function parseFeed(feed, options) {
    if (options === void 0) { options = { xmlMode: true }; }
    var handler = new FeedHandler(options);
    new Parser_1.Parser(handler, options).end(feed);
    return handler.feed;
}
exports.parseFeed = parseFeed;


/***/ }),

/***/ 14477:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Parser = void 0;
var Tokenizer_1 = __importDefault(__webpack_require__(70658));
var formTags = new Set([
    "input",
    "option",
    "optgroup",
    "select",
    "button",
    "datalist",
    "textarea",
]);
var pTag = new Set(["p"]);
var openImpliesClose = {
    tr: new Set(["tr", "th", "td"]),
    th: new Set(["th"]),
    td: new Set(["thead", "th", "td"]),
    body: new Set(["head", "link", "script"]),
    li: new Set(["li"]),
    p: pTag,
    h1: pTag,
    h2: pTag,
    h3: pTag,
    h4: pTag,
    h5: pTag,
    h6: pTag,
    select: formTags,
    input: formTags,
    output: formTags,
    button: formTags,
    datalist: formTags,
    textarea: formTags,
    option: new Set(["option"]),
    optgroup: new Set(["optgroup", "option"]),
    dd: new Set(["dt", "dd"]),
    dt: new Set(["dt", "dd"]),
    address: pTag,
    article: pTag,
    aside: pTag,
    blockquote: pTag,
    details: pTag,
    div: pTag,
    dl: pTag,
    fieldset: pTag,
    figcaption: pTag,
    figure: pTag,
    footer: pTag,
    form: pTag,
    header: pTag,
    hr: pTag,
    main: pTag,
    nav: pTag,
    ol: pTag,
    pre: pTag,
    section: pTag,
    table: pTag,
    ul: pTag,
    rt: new Set(["rt", "rp"]),
    rp: new Set(["rt", "rp"]),
    tbody: new Set(["thead", "tbody"]),
    tfoot: new Set(["thead", "tbody"]),
};
var voidElements = new Set([
    "area",
    "base",
    "basefont",
    "br",
    "col",
    "command",
    "embed",
    "frame",
    "hr",
    "img",
    "input",
    "isindex",
    "keygen",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
]);
var foreignContextElements = new Set(["math", "svg"]);
var htmlIntegrationElements = new Set([
    "mi",
    "mo",
    "mn",
    "ms",
    "mtext",
    "annotation-xml",
    "foreignObject",
    "desc",
    "title",
]);
var reNameEnd = /\s|\//;
var Parser = /** @class */ (function () {
    function Parser(cbs, options) {
        if (options === void 0) { options = {}; }
        var _a, _b, _c, _d, _e;
        /** The start index of the last event. */
        this.startIndex = 0;
        /** The end index of the last event. */
        this.endIndex = null;
        this.tagname = "";
        this.attribname = "";
        this.attribvalue = "";
        this.attribs = null;
        this.stack = [];
        this.foreignContext = [];
        this.options = options;
        this.cbs = cbs !== null && cbs !== void 0 ? cbs : {};
        this.lowerCaseTagNames = (_a = options.lowerCaseTags) !== null && _a !== void 0 ? _a : !options.xmlMode;
        this.lowerCaseAttributeNames =
            (_b = options.lowerCaseAttributeNames) !== null && _b !== void 0 ? _b : !options.xmlMode;
        this.tokenizer = new ((_c = options.Tokenizer) !== null && _c !== void 0 ? _c : Tokenizer_1.default)(this.options, this);
        (_e = (_d = this.cbs).onparserinit) === null || _e === void 0 ? void 0 : _e.call(_d, this);
    }
    Parser.prototype.updatePosition = function (initialOffset) {
        if (this.endIndex === null) {
            if (this.tokenizer.sectionStart <= initialOffset) {
                this.startIndex = 0;
            }
            else {
                this.startIndex = this.tokenizer.sectionStart - initialOffset;
            }
        }
        else {
            this.startIndex = this.endIndex + 1;
        }
        this.endIndex = this.tokenizer.getAbsoluteIndex();
    };
    // Tokenizer event handlers
    Parser.prototype.ontext = function (data) {
        var _a, _b;
        this.updatePosition(1);
        this.endIndex--;
        (_b = (_a = this.cbs).ontext) === null || _b === void 0 ? void 0 : _b.call(_a, data);
    };
    Parser.prototype.onopentagname = function (name) {
        var _a, _b;
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        this.tagname = name;
        if (!this.options.xmlMode &&
            Object.prototype.hasOwnProperty.call(openImpliesClose, name)) {
            var el = void 0;
            while (this.stack.length > 0 &&
                openImpliesClose[name].has((el = this.stack[this.stack.length - 1]))) {
                this.onclosetag(el);
            }
        }
        if (this.options.xmlMode || !voidElements.has(name)) {
            this.stack.push(name);
            if (foreignContextElements.has(name)) {
                this.foreignContext.push(true);
            }
            else if (htmlIntegrationElements.has(name)) {
                this.foreignContext.push(false);
            }
        }
        (_b = (_a = this.cbs).onopentagname) === null || _b === void 0 ? void 0 : _b.call(_a, name);
        if (this.cbs.onopentag)
            this.attribs = {};
    };
    Parser.prototype.onopentagend = function () {
        var _a, _b;
        this.updatePosition(1);
        if (this.attribs) {
            (_b = (_a = this.cbs).onopentag) === null || _b === void 0 ? void 0 : _b.call(_a, this.tagname, this.attribs);
            this.attribs = null;
        }
        if (!this.options.xmlMode &&
            this.cbs.onclosetag &&
            voidElements.has(this.tagname)) {
            this.cbs.onclosetag(this.tagname);
        }
        this.tagname = "";
    };
    Parser.prototype.onclosetag = function (name) {
        this.updatePosition(1);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        if (foreignContextElements.has(name) ||
            htmlIntegrationElements.has(name)) {
            this.foreignContext.pop();
        }
        if (this.stack.length &&
            (this.options.xmlMode || !voidElements.has(name))) {
            var pos = this.stack.lastIndexOf(name);
            if (pos !== -1) {
                if (this.cbs.onclosetag) {
                    pos = this.stack.length - pos;
                    while (pos--) {
                        // We know the stack has sufficient elements.
                        this.cbs.onclosetag(this.stack.pop());
                    }
                }
                else
                    this.stack.length = pos;
            }
            else if (name === "p" && !this.options.xmlMode) {
                this.onopentagname(name);
                this.closeCurrentTag();
            }
        }
        else if (!this.options.xmlMode && (name === "br" || name === "p")) {
            this.onopentagname(name);
            this.closeCurrentTag();
        }
    };
    Parser.prototype.onselfclosingtag = function () {
        if (this.options.xmlMode ||
            this.options.recognizeSelfClosing ||
            this.foreignContext[this.foreignContext.length - 1]) {
            this.closeCurrentTag();
        }
        else {
            this.onopentagend();
        }
    };
    Parser.prototype.closeCurrentTag = function () {
        var _a, _b;
        var name = this.tagname;
        this.onopentagend();
        /*
         * Self-closing tags will be on the top of the stack
         * (cheaper check than in onclosetag)
         */
        if (this.stack[this.stack.length - 1] === name) {
            (_b = (_a = this.cbs).onclosetag) === null || _b === void 0 ? void 0 : _b.call(_a, name);
            this.stack.pop();
        }
    };
    Parser.prototype.onattribname = function (name) {
        if (this.lowerCaseAttributeNames) {
            name = name.toLowerCase();
        }
        this.attribname = name;
    };
    Parser.prototype.onattribdata = function (value) {
        this.attribvalue += value;
    };
    Parser.prototype.onattribend = function (quote) {
        var _a, _b;
        (_b = (_a = this.cbs).onattribute) === null || _b === void 0 ? void 0 : _b.call(_a, this.attribname, this.attribvalue, quote);
        if (this.attribs &&
            !Object.prototype.hasOwnProperty.call(this.attribs, this.attribname)) {
            this.attribs[this.attribname] = this.attribvalue;
        }
        this.attribname = "";
        this.attribvalue = "";
    };
    Parser.prototype.getInstructionName = function (value) {
        var idx = value.search(reNameEnd);
        var name = idx < 0 ? value : value.substr(0, idx);
        if (this.lowerCaseTagNames) {
            name = name.toLowerCase();
        }
        return name;
    };
    Parser.prototype.ondeclaration = function (value) {
        if (this.cbs.onprocessinginstruction) {
            var name_1 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("!" + name_1, "!" + value);
        }
    };
    Parser.prototype.onprocessinginstruction = function (value) {
        if (this.cbs.onprocessinginstruction) {
            var name_2 = this.getInstructionName(value);
            this.cbs.onprocessinginstruction("?" + name_2, "?" + value);
        }
    };
    Parser.prototype.oncomment = function (value) {
        var _a, _b, _c, _d;
        this.updatePosition(4);
        (_b = (_a = this.cbs).oncomment) === null || _b === void 0 ? void 0 : _b.call(_a, value);
        (_d = (_c = this.cbs).oncommentend) === null || _d === void 0 ? void 0 : _d.call(_c);
    };
    Parser.prototype.oncdata = function (value) {
        var _a, _b, _c, _d, _e, _f;
        this.updatePosition(1);
        if (this.options.xmlMode || this.options.recognizeCDATA) {
            (_b = (_a = this.cbs).oncdatastart) === null || _b === void 0 ? void 0 : _b.call(_a);
            (_d = (_c = this.cbs).ontext) === null || _d === void 0 ? void 0 : _d.call(_c, value);
            (_f = (_e = this.cbs).oncdataend) === null || _f === void 0 ? void 0 : _f.call(_e);
        }
        else {
            this.oncomment("[CDATA[" + value + "]]");
        }
    };
    Parser.prototype.onerror = function (err) {
        var _a, _b;
        (_b = (_a = this.cbs).onerror) === null || _b === void 0 ? void 0 : _b.call(_a, err);
    };
    Parser.prototype.onend = function () {
        var _a, _b;
        if (this.cbs.onclosetag) {
            for (var i = this.stack.length; i > 0; this.cbs.onclosetag(this.stack[--i]))
                ;
        }
        (_b = (_a = this.cbs).onend) === null || _b === void 0 ? void 0 : _b.call(_a);
    };
    /**
     * Resets the parser to a blank state, ready to parse a new HTML document
     */
    Parser.prototype.reset = function () {
        var _a, _b, _c, _d;
        (_b = (_a = this.cbs).onreset) === null || _b === void 0 ? void 0 : _b.call(_a);
        this.tokenizer.reset();
        this.tagname = "";
        this.attribname = "";
        this.attribs = null;
        this.stack = [];
        (_d = (_c = this.cbs).onparserinit) === null || _d === void 0 ? void 0 : _d.call(_c, this);
    };
    /**
     * Resets the parser, then parses a complete document and
     * pushes it to the handler.
     *
     * @param data Document to parse.
     */
    Parser.prototype.parseComplete = function (data) {
        this.reset();
        this.end(data);
    };
    /**
     * Parses a chunk of data and calls the corresponding callbacks.
     *
     * @param chunk Chunk to parse.
     */
    Parser.prototype.write = function (chunk) {
        this.tokenizer.write(chunk);
    };
    /**
     * Parses the end of the buffer and clears the stack, calls onend.
     *
     * @param chunk Optional final chunk to parse.
     */
    Parser.prototype.end = function (chunk) {
        this.tokenizer.end(chunk);
    };
    /**
     * Pauses parsing. The parser won't emit events until `resume` is called.
     */
    Parser.prototype.pause = function () {
        this.tokenizer.pause();
    };
    /**
     * Resumes parsing after `pause` was called.
     */
    Parser.prototype.resume = function () {
        this.tokenizer.resume();
    };
    /**
     * Alias of `write`, for backwards compatibility.
     *
     * @param chunk Chunk to parse.
     * @deprecated
     */
    Parser.prototype.parseChunk = function (chunk) {
        this.write(chunk);
    };
    /**
     * Alias of `end`, for backwards compatibility.
     *
     * @param chunk Optional final chunk to parse.
     * @deprecated
     */
    Parser.prototype.done = function (chunk) {
        this.end(chunk);
    };
    return Parser;
}());
exports.Parser = Parser;


/***/ }),

/***/ 70658:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var decode_codepoint_1 = __importDefault(__webpack_require__(17641));
var entities_json_1 = __importDefault(__webpack_require__(96550));
var legacy_json_1 = __importDefault(__webpack_require__(86662));
var xml_json_1 = __importDefault(__webpack_require__(70772));
function whitespace(c) {
    return c === " " || c === "\n" || c === "\t" || c === "\f" || c === "\r";
}
function isASCIIAlpha(c) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
}
function ifElseState(upper, SUCCESS, FAILURE) {
    var lower = upper.toLowerCase();
    if (upper === lower) {
        return function (t, c) {
            if (c === lower) {
                t._state = SUCCESS;
            }
            else {
                t._state = FAILURE;
                t._index--;
            }
        };
    }
    return function (t, c) {
        if (c === lower || c === upper) {
            t._state = SUCCESS;
        }
        else {
            t._state = FAILURE;
            t._index--;
        }
    };
}
function consumeSpecialNameChar(upper, NEXT_STATE) {
    var lower = upper.toLowerCase();
    return function (t, c) {
        if (c === lower || c === upper) {
            t._state = NEXT_STATE;
        }
        else {
            t._state = 3 /* InTagName */;
            t._index--; // Consume the token again
        }
    };
}
var stateBeforeCdata1 = ifElseState("C", 24 /* BeforeCdata2 */, 16 /* InDeclaration */);
var stateBeforeCdata2 = ifElseState("D", 25 /* BeforeCdata3 */, 16 /* InDeclaration */);
var stateBeforeCdata3 = ifElseState("A", 26 /* BeforeCdata4 */, 16 /* InDeclaration */);
var stateBeforeCdata4 = ifElseState("T", 27 /* BeforeCdata5 */, 16 /* InDeclaration */);
var stateBeforeCdata5 = ifElseState("A", 28 /* BeforeCdata6 */, 16 /* InDeclaration */);
var stateBeforeScript1 = consumeSpecialNameChar("R", 35 /* BeforeScript2 */);
var stateBeforeScript2 = consumeSpecialNameChar("I", 36 /* BeforeScript3 */);
var stateBeforeScript3 = consumeSpecialNameChar("P", 37 /* BeforeScript4 */);
var stateBeforeScript4 = consumeSpecialNameChar("T", 38 /* BeforeScript5 */);
var stateAfterScript1 = ifElseState("R", 40 /* AfterScript2 */, 1 /* Text */);
var stateAfterScript2 = ifElseState("I", 41 /* AfterScript3 */, 1 /* Text */);
var stateAfterScript3 = ifElseState("P", 42 /* AfterScript4 */, 1 /* Text */);
var stateAfterScript4 = ifElseState("T", 43 /* AfterScript5 */, 1 /* Text */);
var stateBeforeStyle1 = consumeSpecialNameChar("Y", 45 /* BeforeStyle2 */);
var stateBeforeStyle2 = consumeSpecialNameChar("L", 46 /* BeforeStyle3 */);
var stateBeforeStyle3 = consumeSpecialNameChar("E", 47 /* BeforeStyle4 */);
var stateAfterStyle1 = ifElseState("Y", 49 /* AfterStyle2 */, 1 /* Text */);
var stateAfterStyle2 = ifElseState("L", 50 /* AfterStyle3 */, 1 /* Text */);
var stateAfterStyle3 = ifElseState("E", 51 /* AfterStyle4 */, 1 /* Text */);
var stateBeforeSpecialT = consumeSpecialNameChar("I", 54 /* BeforeTitle1 */);
var stateBeforeTitle1 = consumeSpecialNameChar("T", 55 /* BeforeTitle2 */);
var stateBeforeTitle2 = consumeSpecialNameChar("L", 56 /* BeforeTitle3 */);
var stateBeforeTitle3 = consumeSpecialNameChar("E", 57 /* BeforeTitle4 */);
var stateAfterSpecialTEnd = ifElseState("I", 58 /* AfterTitle1 */, 1 /* Text */);
var stateAfterTitle1 = ifElseState("T", 59 /* AfterTitle2 */, 1 /* Text */);
var stateAfterTitle2 = ifElseState("L", 60 /* AfterTitle3 */, 1 /* Text */);
var stateAfterTitle3 = ifElseState("E", 61 /* AfterTitle4 */, 1 /* Text */);
var stateBeforeEntity = ifElseState("#", 63 /* BeforeNumericEntity */, 64 /* InNamedEntity */);
var stateBeforeNumericEntity = ifElseState("X", 66 /* InHexEntity */, 65 /* InNumericEntity */);
var Tokenizer = /** @class */ (function () {
    function Tokenizer(options, cbs) {
        var _a;
        /** The current state the tokenizer is in. */
        this._state = 1 /* Text */;
        /** The read buffer. */
        this.buffer = "";
        /** The beginning of the section that is currently being read. */
        this.sectionStart = 0;
        /** The index within the buffer that we are currently looking at. */
        this._index = 0;
        /**
         * Data that has already been processed will be removed from the buffer occasionally.
         * `_bufferOffset` keeps track of how many characters have been removed, to make sure position information is accurate.
         */
        this.bufferOffset = 0;
        /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
        this.baseState = 1 /* Text */;
        /** For special parsing behavior inside of script and style tags. */
        this.special = 1 /* None */;
        /** Indicates whether the tokenizer has been paused. */
        this.running = true;
        /** Indicates whether the tokenizer has finished running / `.end` has been called. */
        this.ended = false;
        this.cbs = cbs;
        this.xmlMode = !!(options === null || options === void 0 ? void 0 : options.xmlMode);
        this.decodeEntities = (_a = options === null || options === void 0 ? void 0 : options.decodeEntities) !== null && _a !== void 0 ? _a : true;
    }
    Tokenizer.prototype.reset = function () {
        this._state = 1 /* Text */;
        this.buffer = "";
        this.sectionStart = 0;
        this._index = 0;
        this.bufferOffset = 0;
        this.baseState = 1 /* Text */;
        this.special = 1 /* None */;
        this.running = true;
        this.ended = false;
    };
    Tokenizer.prototype.write = function (chunk) {
        if (this.ended)
            this.cbs.onerror(Error(".write() after done!"));
        this.buffer += chunk;
        this.parse();
    };
    Tokenizer.prototype.end = function (chunk) {
        if (this.ended)
            this.cbs.onerror(Error(".end() after done!"));
        if (chunk)
            this.write(chunk);
        this.ended = true;
        if (this.running)
            this.finish();
    };
    Tokenizer.prototype.pause = function () {
        this.running = false;
    };
    Tokenizer.prototype.resume = function () {
        this.running = true;
        if (this._index < this.buffer.length) {
            this.parse();
        }
        if (this.ended) {
            this.finish();
        }
    };
    /**
     * The current index within all of the written data.
     */
    Tokenizer.prototype.getAbsoluteIndex = function () {
        return this.bufferOffset + this._index;
    };
    Tokenizer.prototype.stateText = function (c) {
        if (c === "<") {
            if (this._index > this.sectionStart) {
                this.cbs.ontext(this.getSection());
            }
            this._state = 2 /* BeforeTagName */;
            this.sectionStart = this._index;
        }
        else if (this.decodeEntities &&
            c === "&" &&
            (this.special === 1 /* None */ || this.special === 4 /* Title */)) {
            if (this._index > this.sectionStart) {
                this.cbs.ontext(this.getSection());
            }
            this.baseState = 1 /* Text */;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    /**
     * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
     *
     * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
     * We allow anything that wouldn't end the tag.
     */
    Tokenizer.prototype.isTagStartChar = function (c) {
        return (isASCIIAlpha(c) ||
            (this.xmlMode && !whitespace(c) && c !== "/" && c !== ">"));
    };
    Tokenizer.prototype.stateBeforeTagName = function (c) {
        if (c === "/") {
            this._state = 5 /* BeforeClosingTagName */;
        }
        else if (c === "<") {
            this.cbs.ontext(this.getSection());
            this.sectionStart = this._index;
        }
        else if (c === ">" ||
            this.special !== 1 /* None */ ||
            whitespace(c)) {
            this._state = 1 /* Text */;
        }
        else if (c === "!") {
            this._state = 15 /* BeforeDeclaration */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "?") {
            this._state = 17 /* InProcessingInstruction */;
            this.sectionStart = this._index + 1;
        }
        else if (!this.isTagStartChar(c)) {
            this._state = 1 /* Text */;
        }
        else {
            this._state =
                !this.xmlMode && (c === "s" || c === "S")
                    ? 32 /* BeforeSpecialS */
                    : !this.xmlMode && (c === "t" || c === "T")
                        ? 52 /* BeforeSpecialT */
                        : 3 /* InTagName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInTagName = function (c) {
        if (c === "/" || c === ">" || whitespace(c)) {
            this.emitToken("onopentagname");
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateBeforeClosingTagName = function (c) {
        if (whitespace(c)) {
            // Ignore
        }
        else if (c === ">") {
            this._state = 1 /* Text */;
        }
        else if (this.special !== 1 /* None */) {
            if (this.special !== 4 /* Title */ && (c === "s" || c === "S")) {
                this._state = 33 /* BeforeSpecialSEnd */;
            }
            else if (this.special === 4 /* Title */ &&
                (c === "t" || c === "T")) {
                this._state = 53 /* BeforeSpecialTEnd */;
            }
            else {
                this._state = 1 /* Text */;
                this._index--;
            }
        }
        else if (!this.isTagStartChar(c)) {
            this._state = 20 /* InSpecialComment */;
            this.sectionStart = this._index;
        }
        else {
            this._state = 6 /* InClosingTagName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInClosingTagName = function (c) {
        if (c === ">" || whitespace(c)) {
            this.emitToken("onclosetag");
            this._state = 7 /* AfterClosingTagName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateAfterClosingTagName = function (c) {
        // Skip everything until ">"
        if (c === ">") {
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeName = function (c) {
        if (c === ">") {
            this.cbs.onopentagend();
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "/") {
            this._state = 4 /* InSelfClosingTag */;
        }
        else if (!whitespace(c)) {
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInSelfClosingTag = function (c) {
        if (c === ">") {
            this.cbs.onselfclosingtag();
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
            this.special = 1 /* None */; // Reset special state, in case of self-closing special tags
        }
        else if (!whitespace(c)) {
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateInAttributeName = function (c) {
        if (c === "=" || c === "/" || c === ">" || whitespace(c)) {
            this.cbs.onattribname(this.getSection());
            this.sectionStart = -1;
            this._state = 10 /* AfterAttributeName */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateAfterAttributeName = function (c) {
        if (c === "=") {
            this._state = 11 /* BeforeAttributeValue */;
        }
        else if (c === "/" || c === ">") {
            this.cbs.onattribend(undefined);
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
        else if (!whitespace(c)) {
            this.cbs.onattribend(undefined);
            this._state = 9 /* InAttributeName */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateBeforeAttributeValue = function (c) {
        if (c === '"') {
            this._state = 12 /* InAttributeValueDq */;
            this.sectionStart = this._index + 1;
        }
        else if (c === "'") {
            this._state = 13 /* InAttributeValueSq */;
            this.sectionStart = this._index + 1;
        }
        else if (!whitespace(c)) {
            this._state = 14 /* InAttributeValueNq */;
            this.sectionStart = this._index;
            this._index--; // Reconsume token
        }
    };
    Tokenizer.prototype.handleInAttributeValue = function (c, quote) {
        if (c === quote) {
            this.emitToken("onattribdata");
            this.cbs.onattribend(quote);
            this._state = 8 /* BeforeAttributeName */;
        }
        else if (this.decodeEntities && c === "&") {
            this.emitToken("onattribdata");
            this.baseState = this._state;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateInAttributeValueDoubleQuotes = function (c) {
        this.handleInAttributeValue(c, '"');
    };
    Tokenizer.prototype.stateInAttributeValueSingleQuotes = function (c) {
        this.handleInAttributeValue(c, "'");
    };
    Tokenizer.prototype.stateInAttributeValueNoQuotes = function (c) {
        if (whitespace(c) || c === ">") {
            this.emitToken("onattribdata");
            this.cbs.onattribend(null);
            this._state = 8 /* BeforeAttributeName */;
            this._index--;
        }
        else if (this.decodeEntities && c === "&") {
            this.emitToken("onattribdata");
            this.baseState = this._state;
            this._state = 62 /* BeforeEntity */;
            this.sectionStart = this._index;
        }
    };
    Tokenizer.prototype.stateBeforeDeclaration = function (c) {
        this._state =
            c === "["
                ? 23 /* BeforeCdata1 */
                : c === "-"
                    ? 18 /* BeforeComment */
                    : 16 /* InDeclaration */;
    };
    Tokenizer.prototype.stateInDeclaration = function (c) {
        if (c === ">") {
            this.cbs.ondeclaration(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateInProcessingInstruction = function (c) {
        if (c === ">") {
            this.cbs.onprocessinginstruction(this.getSection());
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateBeforeComment = function (c) {
        if (c === "-") {
            this._state = 19 /* InComment */;
            this.sectionStart = this._index + 1;
        }
        else {
            this._state = 16 /* InDeclaration */;
        }
    };
    Tokenizer.prototype.stateInComment = function (c) {
        if (c === "-")
            this._state = 21 /* AfterComment1 */;
    };
    Tokenizer.prototype.stateInSpecialComment = function (c) {
        if (c === ">") {
            this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
    };
    Tokenizer.prototype.stateAfterComment1 = function (c) {
        if (c === "-") {
            this._state = 22 /* AfterComment2 */;
        }
        else {
            this._state = 19 /* InComment */;
        }
    };
    Tokenizer.prototype.stateAfterComment2 = function (c) {
        if (c === ">") {
            // Remove 2 trailing chars
            this.cbs.oncomment(this.buffer.substring(this.sectionStart, this._index - 2));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c !== "-") {
            this._state = 19 /* InComment */;
        }
        // Else: stay in AFTER_COMMENT_2 (`--->`)
    };
    Tokenizer.prototype.stateBeforeCdata6 = function (c) {
        if (c === "[") {
            this._state = 29 /* InCdata */;
            this.sectionStart = this._index + 1;
        }
        else {
            this._state = 16 /* InDeclaration */;
            this._index--;
        }
    };
    Tokenizer.prototype.stateInCdata = function (c) {
        if (c === "]")
            this._state = 30 /* AfterCdata1 */;
    };
    Tokenizer.prototype.stateAfterCdata1 = function (c) {
        if (c === "]")
            this._state = 31 /* AfterCdata2 */;
        else
            this._state = 29 /* InCdata */;
    };
    Tokenizer.prototype.stateAfterCdata2 = function (c) {
        if (c === ">") {
            // Remove 2 trailing chars
            this.cbs.oncdata(this.buffer.substring(this.sectionStart, this._index - 2));
            this._state = 1 /* Text */;
            this.sectionStart = this._index + 1;
        }
        else if (c !== "]") {
            this._state = 29 /* InCdata */;
        }
        // Else: stay in AFTER_CDATA_2 (`]]]>`)
    };
    Tokenizer.prototype.stateBeforeSpecialS = function (c) {
        if (c === "c" || c === "C") {
            this._state = 34 /* BeforeScript1 */;
        }
        else if (c === "t" || c === "T") {
            this._state = 44 /* BeforeStyle1 */;
        }
        else {
            this._state = 3 /* InTagName */;
            this._index--; // Consume the token again
        }
    };
    Tokenizer.prototype.stateBeforeSpecialSEnd = function (c) {
        if (this.special === 2 /* Script */ && (c === "c" || c === "C")) {
            this._state = 39 /* AfterScript1 */;
        }
        else if (this.special === 3 /* Style */ && (c === "t" || c === "T")) {
            this._state = 48 /* AfterStyle1 */;
        }
        else
            this._state = 1 /* Text */;
    };
    Tokenizer.prototype.stateBeforeSpecialLast = function (c, special) {
        if (c === "/" || c === ">" || whitespace(c)) {
            this.special = special;
        }
        this._state = 3 /* InTagName */;
        this._index--; // Consume the token again
    };
    Tokenizer.prototype.stateAfterSpecialLast = function (c, sectionStartOffset) {
        if (c === ">" || whitespace(c)) {
            this.special = 1 /* None */;
            this._state = 6 /* InClosingTagName */;
            this.sectionStart = this._index - sectionStartOffset;
            this._index--; // Reconsume the token
        }
        else
            this._state = 1 /* Text */;
    };
    // For entities terminated with a semicolon
    Tokenizer.prototype.parseFixedEntity = function (map) {
        if (map === void 0) { map = this.xmlMode ? xml_json_1.default : entities_json_1.default; }
        // Offset = 1
        if (this.sectionStart + 1 < this._index) {
            var entity = this.buffer.substring(this.sectionStart + 1, this._index);
            if (Object.prototype.hasOwnProperty.call(map, entity)) {
                this.emitPartial(map[entity]);
                this.sectionStart = this._index + 1;
            }
        }
    };
    // Parses legacy entities (without trailing semicolon)
    Tokenizer.prototype.parseLegacyEntity = function () {
        var start = this.sectionStart + 1;
        // The max length of legacy entities is 6
        var limit = Math.min(this._index - start, 6);
        while (limit >= 2) {
            // The min length of legacy entities is 2
            var entity = this.buffer.substr(start, limit);
            if (Object.prototype.hasOwnProperty.call(legacy_json_1.default, entity)) {
                this.emitPartial(legacy_json_1.default[entity]);
                this.sectionStart += limit + 1;
                return;
            }
            limit--;
        }
    };
    Tokenizer.prototype.stateInNamedEntity = function (c) {
        if (c === ";") {
            this.parseFixedEntity();
            // Retry as legacy entity if entity wasn't parsed
            if (this.baseState === 1 /* Text */ &&
                this.sectionStart + 1 < this._index &&
                !this.xmlMode) {
                this.parseLegacyEntity();
            }
            this._state = this.baseState;
        }
        else if ((c < "0" || c > "9") && !isASCIIAlpha(c)) {
            if (this.xmlMode || this.sectionStart + 1 === this._index) {
                // Ignore
            }
            else if (this.baseState !== 1 /* Text */) {
                if (c !== "=") {
                    // Parse as legacy entity, without allowing additional characters.
                    this.parseFixedEntity(legacy_json_1.default);
                }
            }
            else {
                this.parseLegacyEntity();
            }
            this._state = this.baseState;
            this._index--;
        }
    };
    Tokenizer.prototype.decodeNumericEntity = function (offset, base, strict) {
        var sectionStart = this.sectionStart + offset;
        if (sectionStart !== this._index) {
            // Parse entity
            var entity = this.buffer.substring(sectionStart, this._index);
            var parsed = parseInt(entity, base);
            this.emitPartial(decode_codepoint_1.default(parsed));
            this.sectionStart = strict ? this._index + 1 : this._index;
        }
        this._state = this.baseState;
    };
    Tokenizer.prototype.stateInNumericEntity = function (c) {
        if (c === ";") {
            this.decodeNumericEntity(2, 10, true);
        }
        else if (c < "0" || c > "9") {
            if (!this.xmlMode) {
                this.decodeNumericEntity(2, 10, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
    };
    Tokenizer.prototype.stateInHexEntity = function (c) {
        if (c === ";") {
            this.decodeNumericEntity(3, 16, true);
        }
        else if ((c < "a" || c > "f") &&
            (c < "A" || c > "F") &&
            (c < "0" || c > "9")) {
            if (!this.xmlMode) {
                this.decodeNumericEntity(3, 16, false);
            }
            else {
                this._state = this.baseState;
            }
            this._index--;
        }
    };
    Tokenizer.prototype.cleanup = function () {
        if (this.sectionStart < 0) {
            this.buffer = "";
            this.bufferOffset += this._index;
            this._index = 0;
        }
        else if (this.running) {
            if (this._state === 1 /* Text */) {
                if (this.sectionStart !== this._index) {
                    this.cbs.ontext(this.buffer.substr(this.sectionStart));
                }
                this.buffer = "";
                this.bufferOffset += this._index;
                this._index = 0;
            }
            else if (this.sectionStart === this._index) {
                // The section just started
                this.buffer = "";
                this.bufferOffset += this._index;
                this._index = 0;
            }
            else {
                // Remove everything unnecessary
                this.buffer = this.buffer.substr(this.sectionStart);
                this._index -= this.sectionStart;
                this.bufferOffset += this.sectionStart;
            }
            this.sectionStart = 0;
        }
    };
    /**
     * Iterates through the buffer, calling the function corresponding to the current state.
     *
     * States that are more likely to be hit are higher up, as a performance improvement.
     */
    Tokenizer.prototype.parse = function () {
        while (this._index < this.buffer.length && this.running) {
            var c = this.buffer.charAt(this._index);
            if (this._state === 1 /* Text */) {
                this.stateText(c);
            }
            else if (this._state === 12 /* InAttributeValueDq */) {
                this.stateInAttributeValueDoubleQuotes(c);
            }
            else if (this._state === 9 /* InAttributeName */) {
                this.stateInAttributeName(c);
            }
            else if (this._state === 19 /* InComment */) {
                this.stateInComment(c);
            }
            else if (this._state === 20 /* InSpecialComment */) {
                this.stateInSpecialComment(c);
            }
            else if (this._state === 8 /* BeforeAttributeName */) {
                this.stateBeforeAttributeName(c);
            }
            else if (this._state === 3 /* InTagName */) {
                this.stateInTagName(c);
            }
            else if (this._state === 6 /* InClosingTagName */) {
                this.stateInClosingTagName(c);
            }
            else if (this._state === 2 /* BeforeTagName */) {
                this.stateBeforeTagName(c);
            }
            else if (this._state === 10 /* AfterAttributeName */) {
                this.stateAfterAttributeName(c);
            }
            else if (this._state === 13 /* InAttributeValueSq */) {
                this.stateInAttributeValueSingleQuotes(c);
            }
            else if (this._state === 11 /* BeforeAttributeValue */) {
                this.stateBeforeAttributeValue(c);
            }
            else if (this._state === 5 /* BeforeClosingTagName */) {
                this.stateBeforeClosingTagName(c);
            }
            else if (this._state === 7 /* AfterClosingTagName */) {
                this.stateAfterClosingTagName(c);
            }
            else if (this._state === 32 /* BeforeSpecialS */) {
                this.stateBeforeSpecialS(c);
            }
            else if (this._state === 21 /* AfterComment1 */) {
                this.stateAfterComment1(c);
            }
            else if (this._state === 14 /* InAttributeValueNq */) {
                this.stateInAttributeValueNoQuotes(c);
            }
            else if (this._state === 4 /* InSelfClosingTag */) {
                this.stateInSelfClosingTag(c);
            }
            else if (this._state === 16 /* InDeclaration */) {
                this.stateInDeclaration(c);
            }
            else if (this._state === 15 /* BeforeDeclaration */) {
                this.stateBeforeDeclaration(c);
            }
            else if (this._state === 22 /* AfterComment2 */) {
                this.stateAfterComment2(c);
            }
            else if (this._state === 18 /* BeforeComment */) {
                this.stateBeforeComment(c);
            }
            else if (this._state === 33 /* BeforeSpecialSEnd */) {
                this.stateBeforeSpecialSEnd(c);
            }
            else if (this._state === 53 /* BeforeSpecialTEnd */) {
                stateAfterSpecialTEnd(this, c);
            }
            else if (this._state === 39 /* AfterScript1 */) {
                stateAfterScript1(this, c);
            }
            else if (this._state === 40 /* AfterScript2 */) {
                stateAfterScript2(this, c);
            }
            else if (this._state === 41 /* AfterScript3 */) {
                stateAfterScript3(this, c);
            }
            else if (this._state === 34 /* BeforeScript1 */) {
                stateBeforeScript1(this, c);
            }
            else if (this._state === 35 /* BeforeScript2 */) {
                stateBeforeScript2(this, c);
            }
            else if (this._state === 36 /* BeforeScript3 */) {
                stateBeforeScript3(this, c);
            }
            else if (this._state === 37 /* BeforeScript4 */) {
                stateBeforeScript4(this, c);
            }
            else if (this._state === 38 /* BeforeScript5 */) {
                this.stateBeforeSpecialLast(c, 2 /* Script */);
            }
            else if (this._state === 42 /* AfterScript4 */) {
                stateAfterScript4(this, c);
            }
            else if (this._state === 43 /* AfterScript5 */) {
                this.stateAfterSpecialLast(c, 6);
            }
            else if (this._state === 44 /* BeforeStyle1 */) {
                stateBeforeStyle1(this, c);
            }
            else if (this._state === 29 /* InCdata */) {
                this.stateInCdata(c);
            }
            else if (this._state === 45 /* BeforeStyle2 */) {
                stateBeforeStyle2(this, c);
            }
            else if (this._state === 46 /* BeforeStyle3 */) {
                stateBeforeStyle3(this, c);
            }
            else if (this._state === 47 /* BeforeStyle4 */) {
                this.stateBeforeSpecialLast(c, 3 /* Style */);
            }
            else if (this._state === 48 /* AfterStyle1 */) {
                stateAfterStyle1(this, c);
            }
            else if (this._state === 49 /* AfterStyle2 */) {
                stateAfterStyle2(this, c);
            }
            else if (this._state === 50 /* AfterStyle3 */) {
                stateAfterStyle3(this, c);
            }
            else if (this._state === 51 /* AfterStyle4 */) {
                this.stateAfterSpecialLast(c, 5);
            }
            else if (this._state === 52 /* BeforeSpecialT */) {
                stateBeforeSpecialT(this, c);
            }
            else if (this._state === 54 /* BeforeTitle1 */) {
                stateBeforeTitle1(this, c);
            }
            else if (this._state === 55 /* BeforeTitle2 */) {
                stateBeforeTitle2(this, c);
            }
            else if (this._state === 56 /* BeforeTitle3 */) {
                stateBeforeTitle3(this, c);
            }
            else if (this._state === 57 /* BeforeTitle4 */) {
                this.stateBeforeSpecialLast(c, 4 /* Title */);
            }
            else if (this._state === 58 /* AfterTitle1 */) {
                stateAfterTitle1(this, c);
            }
            else if (this._state === 59 /* AfterTitle2 */) {
                stateAfterTitle2(this, c);
            }
            else if (this._state === 60 /* AfterTitle3 */) {
                stateAfterTitle3(this, c);
            }
            else if (this._state === 61 /* AfterTitle4 */) {
                this.stateAfterSpecialLast(c, 5);
            }
            else if (this._state === 17 /* InProcessingInstruction */) {
                this.stateInProcessingInstruction(c);
            }
            else if (this._state === 64 /* InNamedEntity */) {
                this.stateInNamedEntity(c);
            }
            else if (this._state === 23 /* BeforeCdata1 */) {
                stateBeforeCdata1(this, c);
            }
            else if (this._state === 62 /* BeforeEntity */) {
                stateBeforeEntity(this, c);
            }
            else if (this._state === 24 /* BeforeCdata2 */) {
                stateBeforeCdata2(this, c);
            }
            else if (this._state === 25 /* BeforeCdata3 */) {
                stateBeforeCdata3(this, c);
            }
            else if (this._state === 30 /* AfterCdata1 */) {
                this.stateAfterCdata1(c);
            }
            else if (this._state === 31 /* AfterCdata2 */) {
                this.stateAfterCdata2(c);
            }
            else if (this._state === 26 /* BeforeCdata4 */) {
                stateBeforeCdata4(this, c);
            }
            else if (this._state === 27 /* BeforeCdata5 */) {
                stateBeforeCdata5(this, c);
            }
            else if (this._state === 28 /* BeforeCdata6 */) {
                this.stateBeforeCdata6(c);
            }
            else if (this._state === 66 /* InHexEntity */) {
                this.stateInHexEntity(c);
            }
            else if (this._state === 65 /* InNumericEntity */) {
                this.stateInNumericEntity(c);
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
            }
            else if (this._state === 63 /* BeforeNumericEntity */) {
                stateBeforeNumericEntity(this, c);
            }
            else {
                this.cbs.onerror(Error("unknown _state"), this._state);
            }
            this._index++;
        }
        this.cleanup();
    };
    Tokenizer.prototype.finish = function () {
        // If there is remaining data, emit it in a reasonable way
        if (this.sectionStart < this._index) {
            this.handleTrailingData();
        }
        this.cbs.onend();
    };
    Tokenizer.prototype.handleTrailingData = function () {
        var data = this.buffer.substr(this.sectionStart);
        if (this._state === 29 /* InCdata */ ||
            this._state === 30 /* AfterCdata1 */ ||
            this._state === 31 /* AfterCdata2 */) {
            this.cbs.oncdata(data);
        }
        else if (this._state === 19 /* InComment */ ||
            this._state === 21 /* AfterComment1 */ ||
            this._state === 22 /* AfterComment2 */) {
            this.cbs.oncomment(data);
        }
        else if (this._state === 64 /* InNamedEntity */ && !this.xmlMode) {
            this.parseLegacyEntity();
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state === 65 /* InNumericEntity */ && !this.xmlMode) {
            this.decodeNumericEntity(2, 10, false);
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state === 66 /* InHexEntity */ && !this.xmlMode) {
            this.decodeNumericEntity(3, 16, false);
            if (this.sectionStart < this._index) {
                this._state = this.baseState;
                this.handleTrailingData();
            }
        }
        else if (this._state !== 3 /* InTagName */ &&
            this._state !== 8 /* BeforeAttributeName */ &&
            this._state !== 11 /* BeforeAttributeValue */ &&
            this._state !== 10 /* AfterAttributeName */ &&
            this._state !== 9 /* InAttributeName */ &&
            this._state !== 13 /* InAttributeValueSq */ &&
            this._state !== 12 /* InAttributeValueDq */ &&
            this._state !== 14 /* InAttributeValueNq */ &&
            this._state !== 6 /* InClosingTagName */) {
            this.cbs.ontext(data);
        }
        /*
         * Else, ignore remaining data
         * TODO add a way to remove current tag
         */
    };
    Tokenizer.prototype.getSection = function () {
        return this.buffer.substring(this.sectionStart, this._index);
    };
    Tokenizer.prototype.emitToken = function (name) {
        this.cbs[name](this.getSection());
        this.sectionStart = -1;
    };
    Tokenizer.prototype.emitPartial = function (value) {
        if (this.baseState !== 1 /* Text */) {
            this.cbs.onattribdata(value); // TODO implement the new event
        }
        else {
            this.cbs.ontext(value);
        }
    };
    return Tokenizer;
}());
exports["default"] = Tokenizer;


/***/ }),

/***/ 83137:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.RssHandler = exports.DefaultHandler = exports.DomUtils = exports.ElementType = exports.Tokenizer = exports.createDomStream = exports.parseDOM = exports.parseDocument = exports.DomHandler = exports.Parser = void 0;
var Parser_1 = __webpack_require__(14477);
Object.defineProperty(exports, "Parser", ({ enumerable: true, get: function () { return Parser_1.Parser; } }));
var domhandler_1 = __webpack_require__(89641);
Object.defineProperty(exports, "DomHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
Object.defineProperty(exports, "DefaultHandler", ({ enumerable: true, get: function () { return domhandler_1.DomHandler; } }));
// Helper methods
/**
 * Parses the data, returns the resulting document.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 */
function parseDocument(data, options) {
    var handler = new domhandler_1.DomHandler(undefined, options);
    new Parser_1.Parser(handler, options).end(data);
    return handler.root;
}
exports.parseDocument = parseDocument;
/**
 * Parses data, returns an array of the root nodes.
 *
 * Note that the root nodes still have a `Document` node as their parent.
 * Use `parseDocument` to get the `Document` node instead.
 *
 * @param data The data that should be parsed.
 * @param options Optional options for the parser and DOM builder.
 * @deprecated Use `parseDocument` instead.
 */
function parseDOM(data, options) {
    return parseDocument(data, options).children;
}
exports.parseDOM = parseDOM;
/**
 * Creates a parser instance, with an attached DOM handler.
 *
 * @param cb A callback that will be called once parsing has been completed.
 * @param options Optional options for the parser and DOM builder.
 * @param elementCb An optional callback that will be called every time a tag has been completed inside of the DOM.
 */
function createDomStream(cb, options, elementCb) {
    var handler = new domhandler_1.DomHandler(cb, options, elementCb);
    return new Parser_1.Parser(handler, options);
}
exports.createDomStream = createDomStream;
var Tokenizer_1 = __webpack_require__(70658);
Object.defineProperty(exports, "Tokenizer", ({ enumerable: true, get: function () { return __importDefault(Tokenizer_1).default; } }));
var ElementType = __importStar(__webpack_require__(76241));
exports.ElementType = ElementType;
/*
 * All of the following exports exist for backwards-compatibility.
 * They should probably be removed eventually.
 */
__exportStar(__webpack_require__(8612), exports);
exports.DomUtils = __importStar(__webpack_require__(23774));
var FeedHandler_1 = __webpack_require__(8612);
Object.defineProperty(exports, "RssHandler", ({ enumerable: true, get: function () { return FeedHandler_1.FeedHandler; } }));


/***/ }),

/***/ 82815:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

function _typeof(obj) {
  "@babel/helpers - typeof";

  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

// Generated by CoffeeScript 2.6.0
var _snake_case; exports.clone = void 0; exports.compare = void 0; exports.is_object = void 0; exports.is_object_literal = void 0; exports.merge = void 0; exports.mutate = void 0; exports.snake_case = void 0;

exports.merge = function merge() {
  return exports.mutate.apply(void 0, [{}].concat(Array.prototype.slice.call(arguments)));
};

exports.clone = function clone(target) {
  if (Array.isArray(target)) {
    return target.map(function (element) {
      return exports.clone(element);
    });
  } else if (target && _typeof(target) === 'object') {
    return exports.mutate({}, target);
  } else {
    return target;
  }
};

exports.mutate = function mutate() {
  var i, j, name, ref, source, target, v;
  target = arguments[0];

  for (i = j = 1, ref = arguments.length; 1 <= ref ? j < ref : j > ref; i = 1 <= ref ? ++j : --j) {
    source = arguments[i];

    if (exports.is_object_literal(source)) {
      if (!exports.is_object_literal(target)) {
        target = {};
      }

      for (name in source) {
        if (/__proto__|prototype/.test(name)) {
          // See
          // https://github.com/adaltas/node-mixme/issues/1
          // https://github.com/adaltas/node-mixme/issues/2
          // continue if /__proto__|constructor|prototype|eval|function|\*|\+|;|\s|\(|\)|!/.test name
          // Unless proven wrong, I consider ok to copy any properties named eval
          // or function, we are not executing those, only copying.
          continue;
        }

        target[name] = exports.mutate(target[name], source[name]);
      }
    } else if (Array.isArray(source)) {
      target = function () {
        var k, len, results;
        results = [];

        for (k = 0, len = source.length; k < len; k++) {
          v = source[k];
          results.push(exports.mutate(void 0, v));
        }

        return results;
      }();
    } else if (source !== void 0) {
      target = source;
    }
  }

  return target;
};

exports.snake_case = function snake_case(source) {
  var convert = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  var name, src, target, u;
  target = {};

  if (exports.is_object_literal(source)) {
    u = typeof convert === 'number' && convert > 0 ? convert - 1 : convert;

    for (name in source) {
      src = source[name];

      if (convert) {
        name = _snake_case(name);
      }

      target[name] = exports.snake_case(src, u);
    }
  } else {
    target = source;
  }

  return target;
};

exports.compare = function compare(el1, el2) {
  var i, j, k, key, keys1, keys2, len, ref;

  if (exports.is_object_literal(el1)) {
    if (!exports.is_object_literal(el2)) {
      return false;
    }

    keys1 = Object.keys(el1).sort();
    keys2 = Object.keys(el2).sort();

    if (keys1.length !== keys2.length) {
      return false;
    }

    for (i = j = 0, len = keys1.length; j < len; i = ++j) {
      key = keys1[i];

      if (key !== keys2[i]) {
        return false;
      }

      if (!exports.compare(el1[key], el2[key])) {
        return false;
      }
    }
  } else if (Array.isArray(el1)) {
    if (!Array.isArray(el2)) {
      return false;
    }

    if (el1.length !== el2.length) {
      return false;
    }

    for (i = k = 0, ref = el1.length; 0 <= ref ? k < ref : k > ref; i = 0 <= ref ? ++k : --k) {
      if (!exports.compare(el1[i], el2[i])) {
        return false;
      }
    }
  } else {
    if (el1 !== el2) {
      return false;
    }
  }

  return true;
};

_snake_case = function _snake_case(str) {
  return str.replace(/([A-Z])/g, function (_, match, index) {
    return '_' + match.toLowerCase();
  });
};

exports.is_object = function is_object(obj) {
  return obj && _typeof(obj) === 'object' && !Array.isArray(obj);
};

exports.is_object_literal = function is_object_literal(obj) {
  var test;
  test = obj;

  if (_typeof(obj) !== 'object' || obj === null) {
    return false;
  } else {
    if (Object.getPrototypeOf(test) === null) {
      return true;
    }

    while (!false) {
      if (Object.getPrototypeOf(test = Object.getPrototypeOf(test)) === null) {
        break;
      }
    }

    return Object.getPrototypeOf(obj) === test;
  }
};


/***/ }),

/***/ 16050:
/***/ (function(module, exports) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)) /* global define */
  } else {}
}(this, function() {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty
  var toString = Object.prototype.toString
  var hasSticky = typeof new RegExp().sticky === 'boolean'

  /***************************************************************************/

  function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
  function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  function reGroups(s) {
    var re = new RegExp('|' + s)
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    if (!regexps.length) return '(?!)'
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|')
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
      if (obj.global) throw new Error('RegExp /g flag is implied')
      if (obj.sticky) throw new Error('RegExp /y flag is implied')
      if (obj.multiline) throw new Error('RegExp /m flag is implied')
      return obj.source

    } else {
      throw new Error('Not a pattern: ' + obj)
    }
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object)
    var result = []
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var thing = object[key]
      var rules = [].concat(thing)
      if (key === 'include') {
        for (var j = 0; j < rules.length; j++) {
          result.push({include: rules[j]})
        }
        continue
      }
      var match = []
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match))
          result.push(ruleOptions(key, rule))
          match = []
        } else {
          match.push(rule)
        }
      })
      if (match.length) result.push(ruleOptions(key, match))
    }
    return result
  }

  function arrayToRules(array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      var obj = array[i]
      if (obj.include) {
        var include = [].concat(obj.include)
        for (var j = 0; j < include.length; j++) {
          result.push({include: include[j]})
        }
        continue
      }
      if (!obj.type) {
        throw new Error('Rule has no type: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.type, obj))
    }
    return result
  }

  function ruleOptions(type, obj) {
    if (!isObject(obj)) {
      obj = { match: obj }
    }
    if (obj.include) {
      throw new Error('Matching rules cannot also include states')
    }

    // nb. error and fallback imply lineBreaks
    var options = {
      defaultType: type,
      lineBreaks: !!obj.error || !!obj.fallback,
      pop: false,
      next: null,
      push: null,
      error: false,
      fallback: false,
      value: null,
      type: null,
      shouldThrow: false,
    }

    // Avoid Object.assign(), so we support IE9+
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        options[key] = obj[key]
      }
    }

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
      throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    var match = options.match
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    })
    return options
  }

  function toRules(spec) {
    return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
  }

  var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true})
  function compileRules(rules, hasStates) {
    var errorRule = null
    var fast = Object.create(null)
    var fastAllowed = true
    var unicodeFlag = null
    var groups = []
    var parts = []

    // If there is a fallback rule, then disable fast matching
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].fallback) {
        fastAllowed = false
      }
    }

    for (var i = 0; i < rules.length; i++) {
      var options = rules[i]

      if (options.include) {
        // all valid inclusions are removed by states() preprocessor
        throw new Error('Inheritance is not allowed in stateless lexers')
      }

      if (options.error || options.fallback) {
        // errorRule can only be set once
        if (errorRule) {
          if (!options.fallback === !errorRule.fallback) {
            throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
          } else {
            throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
          }
        }
        errorRule = options
      }

      var match = options.match.slice()
      if (fastAllowed) {
        while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
          var word = match.shift()
          fast[word.charCodeAt(0)] = options
        }
      }

      // Warn about inappropriate state-switching options
      if (options.pop || options.push || options.next) {
        if (!hasStates) {
          throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
        }
        if (options.fallback) {
          throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
        }
      }

      // Only rules with a .match are included in the RegExp
      if (match.length === 0) {
        continue
      }
      fastAllowed = false

      groups.push(options)

      // Check unicode flag is used everywhere or nowhere
      for (var j = 0; j < match.length; j++) {
        var obj = match[j]
        if (!isRegExp(obj)) {
          continue
        }

        if (unicodeFlag === null) {
          unicodeFlag = obj.unicode
        } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
          throw new Error('If one rule is /u then all must be')
        }
      }

      // convert to RegExp
      var pat = reUnion(match.map(regexpOrLiteral))

      // validate
      var regexp = new RegExp(pat)
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat)
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat))
    }


    // If there's no fallback rule, use the sticky flag so we only look for
    // matches at the current index.
    //
    // If we don't support the sticky flag, then fake it using an irrefutable
    // match (i.e. an empty pattern).
    var fallbackRule = errorRule && errorRule.fallback
    var flags = hasSticky && !fallbackRule ? 'ym' : 'gm'
    var suffix = hasSticky || fallbackRule ? '' : '|'

    if (unicodeFlag === true) flags += "u"
    var combined = new RegExp(reUnion(parts) + suffix, flags)
    return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
  }

  function compile(rules) {
    var result = compileRules(toRules(rules))
    return new Lexer({start: result}, 'start')
  }

  function checkStateGroup(g, name, map) {
    var state = g && (g.push || g.next)
    if (state && !map[state]) {
      throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
      throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
  }
  function compileStates(states, start) {
    var all = states.$all ? toRules(states.$all) : []
    delete states.$all

    var keys = Object.getOwnPropertyNames(states)
    if (!start) start = keys[0]

    var ruleMap = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      ruleMap[key] = toRules(states[key]).concat(all)
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var rules = ruleMap[key]
      var included = Object.create(null)
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j]
        if (!rule.include) continue
        var splice = [j, 1]
        if (rule.include !== key && !included[rule.include]) {
          included[rule.include] = true
          var newRules = ruleMap[rule.include]
          if (!newRules) {
            throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
          }
          for (var k = 0; k < newRules.length; k++) {
            var newRule = newRules[k]
            if (rules.indexOf(newRule) !== -1) continue
            splice.push(newRule)
          }
        }
        rules.splice.apply(rules, splice)
        j--
      }
    }

    var map = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      map[key] = compileRules(ruleMap[key], true)
    }

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i]
      var state = map[name]
      var groups = state.groups
      for (var j = 0; j < groups.length; j++) {
        checkStateGroup(groups[j], name, map)
      }
      var fastKeys = Object.getOwnPropertyNames(state.fast)
      for (var j = 0; j < fastKeys.length; j++) {
        checkStateGroup(state.fast[fastKeys[j]], name, map)
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {
    var reverseMap = Object.create(null)
    var byLength = Object.create(null)
    var types = Object.getOwnPropertyNames(map)
    for (var i = 0; i < types.length; i++) {
      var tokenType = types[i]
      var item = map[tokenType]
      var keywordList = Array.isArray(item) ? item : [item]
      keywordList.forEach(function(keyword) {
        (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword)
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        reverseMap[keyword] = tokenType
      })
    }

    // fast string lookup
    // https://jsperf.com/string-lookups
    function str(x) { return JSON.stringify(x) }
    var source = ''
    source += 'switch (value.length) {\n'
    for (var length in byLength) {
      var keywords = byLength[length]
      source += 'case ' + length + ':\n'
      source += 'switch (value) {\n'
      keywords.forEach(function(keyword) {
        var tokenType = reverseMap[keyword]
        source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n'
      })
      source += '}\n'
    }
    source += '}\n'
    return Function('value', source) // type
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state
    this.states = states
    this.buffer = ''
    this.stack = []
    this.reset()
  }

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || ''
    this.index = 0
    this.line = info ? info.line : 1
    this.col = info ? info.col : 1
    this.queuedToken = info ? info.queuedToken : null
    this.queuedThrow = info ? info.queuedThrow : null
    this.setState(info ? info.state : this.startState)
    this.stack = info && info.stack ? info.stack.slice() : []
    return this
  }

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: this.stack.slice(),
      queuedToken: this.queuedToken,
      queuedThrow: this.queuedThrow,
    }
  }

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state
    var info = this.states[state]
    this.groups = info.groups
    this.error = info.error
    this.re = info.regexp
    this.fast = info.fast
  }

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop())
  }

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state)
    this.setState(state)
  }

  var eat = hasSticky ? function(re, buffer) { // assume re is /y
    return re.exec(buffer)
  } : function(re, buffer) { // assume re is /g
    var match = re.exec(buffer)
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  }

  Lexer.prototype._getGroup = function(match) {
    var groupCount = this.groups.length
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i]
      }
    }
    throw new Error('Cannot find token type for matched text')
  }

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var index = this.index

    // If a fallback token matched, we don't need to re-run the RegExp
    if (this.queuedGroup) {
      var token = this._token(this.queuedGroup, this.queuedText, index)
      this.queuedGroup = null
      this.queuedText = ""
      return token
    }

    var buffer = this.buffer
    if (index === buffer.length) {
      return // EOF
    }

    // Fast matching for single characters
    var group = this.fast[buffer.charCodeAt(index)]
    if (group) {
      return this._token(group, buffer.charAt(index), index)
    }

    // Execute RegExp
    var re = this.re
    re.lastIndex = index
    var match = eat(re, buffer)

    // Error tokens match the remaining buffer
    var error = this.error
    if (match == null) {
      return this._token(error, buffer.slice(index, buffer.length), index)
    }

    var group = this._getGroup(match)
    var text = match[0]

    if (error.fallback && match.index !== index) {
      this.queuedGroup = group
      this.queuedText = text

      // Fallback tokens contain the unmatched portion of the buffer
      return this._token(error, buffer.slice(index, match.index), index)
    }

    return this._token(group, text, index)
  }

  Lexer.prototype._token = function(group, text, offset) {
    // count line breaks
    var lineBreaks = 0
    if (group.lineBreaks) {
      var matchNL = /\n/g
      var nl = 1
      if (text === '\n') {
        lineBreaks = 1
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex }
      }
    }

    var token = {
      type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
      value: typeof group.value === 'function' ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: offset,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    }
    // nb. adding more props to token object will make V8 sad!

    var size = text.length
    this.index += size
    this.line += lineBreaks
    if (lineBreaks !== 0) {
      this.col = size - nl + 1
    } else {
      this.col += size
    }

    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      throw new Error(this.formatError(token, "invalid syntax"))
    }

    if (group.pop) this.popState()
    else if (group.push) this.pushState(group.push)
    else if (group.next) this.setState(group.next)

    return token
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer
    }

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next()
      return {value: token, done: !token}
    }

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    }

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    }
  }

  Lexer.prototype.formatError = function(token, message) {
    if (token == null) {
      // An undefined token indicates EOF
      var text = this.buffer.slice(this.index)
      var token = {
        text: text,
        offset: this.index,
        lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
        line: this.line,
        col: this.col,
      }
    }
    var start = Math.max(0, token.offset - token.col + 1)
    var eol = token.lineBreaks ? token.text.indexOf('\n') : token.text.length
    var firstLine = this.buffer.substring(start, token.offset + eol)
    message += " at line " + token.line + " col " + token.col + ":\n\n"
    message += "  " + firstLine + "\n"
    message += "  " + Array(token.col).join(" ") + "^"
    return message
  }

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  }

  Lexer.prototype.has = function(tokenType) {
    return true
  }


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
    fallback: Object.freeze({fallback: true}),
    keywords: keywordTransform,
  }

}));


/***/ }),

/***/ 3836:
/***/ (function(module) {

(function(root, factory) {
    if ( true && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(getSymbolShortDisplay).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            // Having right set here will prevent the right state and its children
            // form being garbage collected
            state.right = undefined;
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var lines = buffer
                .split("\n")
                .slice(
                    Math.max(0, this.line - 5), 
                    this.line
                );

            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var col = this.index - this.lastLineBreak;
            var lastLineDigits = String(this.line).length;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += lines
                .map(function(line, i) {
                    return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
                }, this)
                .join("\n");
            message += "\n" + pad("", lastLineDigits + col) + "^\n";
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }

        function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
        }
    }

    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (true) {
            try {
                token = lexer.next();
                if (!token) {
                    break;
                }
            } catch (e) {
                // Create the next column so that the error reporter
                // can display the correctly predicted states.
                var nextColumn = new Column(this.grammar, this.current + 1);
                this.table.push(nextColumn);
                var err = new Error(this.reportLexerError(e));
                err.offset = this.current;
                err.token = e.token;
                throw err;
            }
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var err = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        // Planning to add a token property to moo's thrown error
        // even on erroring tokens to be used in error display below
        var token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states
            .filter(function(state) {
                var nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            });

        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        } else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            // Display a "state stack" for each expectant state
            // - which shows you how this state came to be, step by step.
            // If there is more than one derivation, we only display the first one.
            var stateStacks = expectantStates
                .map(function(state) {
                    return this.buildFirstStateStack(state, []) || [state];
                }, this);
            // Display each state that is expecting a terminal symbol next.
            stateStacks.forEach(function(stateStack) {
                var state = stateStack[0];
                var nextSymbol = state.rule.symbols[state.dot];
                var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);
        }
        lines.push("");
        return lines.join("\n");
    }
    
    Parser.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            } else {
                if (sameDisplayCount > 0) {
                    lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    };

    Parser.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
    };

    /*
    Builds a the first state stack. You can think of a state stack as the call stack
    of the recursive-descent parser which the Nearley parse algorithm simulates.
    A state stack is represented as an array of state objects. Within a
    state stack, the first item of the array will be the starting
    state, with each successive item in the array going further back into history.

    This function needs to be given a starting state and an empty array representing
    the visited states, and it returns an single state stack.

    */
    Parser.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
            // Found cycle, return null
            // to eliminate this path from the results, because
            // we don't know how to display it meaningfully
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            } else if (symbol.type) {
                return symbol.type + ' token';
            } else if (symbol.test) {
                return 'token matching ' + String(symbol.test);
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return symbol.toString();
            } else if (symbol.type) {
                return '%' + symbol.type;
            } else if (symbol.test) {
                return '<' + String(symbol.test) + '>';
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));


/***/ }),

/***/ 94147:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


const csv = __webpack_require__(94915);
const fs = __webpack_require__(57147);

/**
 * Converts an array of objects into a CSV file.
 */
class ObjectsToCsv {
  /**
   * Creates a new instance of the object array to csv converter.
   * @param {object[]} objectArray
   */
  constructor(objectArray) {
    if (!Array.isArray(objectArray)) {
      throw new Error('The input to objects-to-csv must be an array of objects.');
    }

    if (objectArray.length > 0) {
      if (objectArray.some(row => typeof row !== 'object')) {
        throw new Error('The array must contain objects, not other data types.');
      }
    }

    this.data = objectArray;
  }

  /**
   * Saves the CSV file to the specified file.
   * @param {string} filename - The path and filename of the new CSV file.
   * @param {object} options - The options for writing to disk.
   * @param {boolean} [options.append] - Whether to append to file. Default is overwrite (false).
   * @param {boolean} [options.bom] - Append the BOM mark so that Excel shows
   * @param {boolean} [options.allColumns] - Whether to check all items for column names or only the first.  Default is the first.
   * Unicode correctly.
   */
  async toDisk(filename, options) {
    if (!filename) {
      throw new Error('Empty filename when trying to write to disk.');
    }

    let addHeader = false;

    // If the file didn't exist yet or is empty, add the column headers
    // as the first line of the file. Do not add it when we are appending
    // to an existing file.
    const fileNotExists = !fs.existsSync(filename) || fs.statSync(filename).size === 0;
    if (fileNotExists || !options || !options.append) {
      addHeader = true;
    }

    const allColumns = options && options.allColumns
      ? options.allColumns
      : false;

    let data = await this.toString(addHeader, allColumns);
    // Append the BOM mark if requested at the beginning of the file, otherwise
    // Excel won't show Unicode correctly. The actual BOM mark will be EF BB BF,
    // see https://stackoverflow.com/a/27975629/6269864 for details.
    if (options && options.bom && fileNotExists) {
      data = '\ufeff' + data;
    }

    if (options && options.append) {
      return new Promise((resolve, reject) => {
        fs.appendFile(filename, data, 'utf8', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    } else {
      return new Promise((resolve, reject) => {
        fs.writeFile(filename, data, 'utf8', (error) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        });
      });
    }
  }

  /**
   * Returns the CSV file as string.
   * @param {boolean} header - If false, omit the first row containing the
   * column names.
   * @param {boolean} allColumns - Whether to check all items for column names.
   *   Uses only the first item if false.
   * @returns {Promise<string>}
   */
  async toString(header = true, allColumns = false) {
    return await convert(this.data, header, allColumns);
  }
}

/**
 * Private method to run the actual conversion of array of objects to CSV data.
 * @param {object[]} data
 * @param {boolean} header - Whether the first line should contain column headers.
 * @param {boolean} allColumns - Whether to check all items for column names.
 *   Uses only the first item if false.
 * @returns {string}
 */
async function convert(data, header = true, allColumns = false) {
  if (data.length === 0) {
    return '';
  }

  const columnNames =
    allColumns
      ? [...data
        .reduce((columns, row) => { // check each object to compile a full list of column names
          Object.keys(row).map(rowKey => columns.add(rowKey));
          return columns;
        }, new Set())]
      : Object.keys(data[0]); // just figure out columns from the first item in array

  if (allColumns) {
    columnNames.sort(); // for predictable order of columns
  }

  // This will hold data in the format that `async-csv` can accept, i.e.
  // an array of arrays.
  let csvInput = [];
  if (header) {
    csvInput.push(columnNames);
  }

  // Add all other rows:
  csvInput.push(
    ...data.map(row => columnNames.map(column => row[column])),
  );

  return await csv.stringify(csvInput);
}

module.exports = ObjectsToCsv;


/***/ }),

/***/ 40448:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

// Generated by CoffeeScript 2.5.1
// # Stream Transformer

// Pass all elements of an array or a stream to transform, filter and add. Features include:   

// *   Extends the Node.js "stream.Transform" API.   
// *   Both synchrounous and asynchronous support based and user callback 
//     arguments signature.   
// *   Ability to skip records.   
// *   Sequential and concurrent execution using the "parallel" options.

// Please look at the [README], the [samples] and the [tests] for additional
// information.
var Transformer, clone, stream, util;

stream = __webpack_require__(12781);

util = __webpack_require__(73837);

({clone} = __webpack_require__(82815));

// ## Usage

// Callback approach, for ease of use:   

// `transform(records, [options], handler, callback)`     

// Stream API, for maximum of power:   

// `transform([records], [options], handler, [callback])`   
module.exports = function() {
  var argument, callback, error, handler, i, j, len, options, records, result, transform, type;
  options = {};
  for (i = j = 0, len = arguments.length; j < len; i = ++j) {
    argument = arguments[i];
    type = typeof argument;
    if (argument === null) {
      type = 'null';
    } else if (type === 'object' && Array.isArray(argument)) {
      type = 'array';
    }
    if (type === 'array') {
      records = argument;
    } else if (type === 'object') {
      options = clone(argument);
    } else if (type === 'function') {
      if (handler && i === arguments.length - 1) {
        callback = argument;
      } else {
        handler = argument;
      }
    } else if (type !== 'null') {
      throw new Error(`Invalid Arguments: got ${JSON.stringify(argument)} at position ${i}`);
    }
  }
  transform = new Transformer(options, handler);
  error = false;
  if (records) {
    setImmediate(function() {
      var k, len1, record;
      for (k = 0, len1 = records.length; k < len1; k++) {
        record = records[k];
        if (error) {
          break;
        }
        transform.write(record);
      }
      return transform.end();
    });
  }
  if (callback || options.consume) {
    result = [];
    transform.on('readable', function() {
      var record, results;
      results = [];
      while ((record = transform.read())) {
        if (callback) {
          results.push(result.push(record));
        } else {
          results.push(void 0);
        }
      }
      return results;
    });
    transform.on('error', function(err) {
      error = true;
      if (callback) {
        return callback(err);
      }
    });
    transform.on('end', function() {
      if (callback && !error) {
        return callback(null, result);
      }
    });
  }
  return transform;
};

// ## Transformer

// Options are documented [here](http://csv.js.org/transform/options/).
Transformer = function(options1 = {}, handler1) {
  var base, base1;
  this.options = options1;
  this.handler = handler1;
  if ((base = this.options).consume == null) {
    base.consume = false;
  }
  this.options.objectMode = true;
  if ((base1 = this.options).parallel == null) {
    base1.parallel = 100;
  }
  stream.Transform.call(this, this.options);
  this.state = {
    running: 0,
    started: 0,
    finished: 0
  };
  return this;
};

util.inherits(Transformer, stream.Transform);

module.exports.Transformer = Transformer;

Transformer.prototype._transform = function(chunk, encoding, cb) {
  var callback, err, l;
  this.state.started++;
  this.state.running++;
  if (this.state.running < this.options.parallel) {
    cb();
    cb = null;
  }
  try {
    l = this.handler.length;
    if (this.options.params != null) {
      l--;
    }
    if (l === 1) { // sync
      this.__done(null, [this.handler.call(this, chunk, this.options.params)], cb);
    } else if (l === 2) { // async
      callback = (err, ...chunks) => {
        return this.__done(err, chunks, cb);
      };
      this.handler.call(this, chunk, callback, this.options.params);
    } else {
      throw Error("Invalid handler arguments");
    }
    return false;
  } catch (error1) {
    err = error1;
    return this.__done(err);
  }
};

Transformer.prototype._flush = function(cb) {
  this._ending = function() {
    if (this.state.running === 0) {
      this._ending = undefined
      return cb();
    }
  };
  return this._ending();
};

Transformer.prototype.__done = function(err, chunks, cb) {
  var chunk, j, len;
  this.state.running--;
  if (err) {
    return this.emit('error', err);
  }
  this.state.finished++;
  for (j = 0, len = chunks.length; j < len; j++) {
    chunk = chunks[j];
    if (typeof chunk === 'number') {
      chunk = `${chunk}`;
    }
    if ((chunk != null) && chunk !== '') {
      // We dont push empty string
      // See https://nodejs.org/api/stream.html#stream_readable_push
      this.push(chunk);
    }
  }
  if (cb) {
    cb();
  }
  if (this._ending) {
    return this._ending();
  }
};

// [readme]: https://github.com/wdavidw/node-stream-transform
// [samples]: https://github.com/wdavidw/node-stream-transform/tree/master/samples
// [tests]: https://github.com/wdavidw/node-stream-transform/tree/master/test


/***/ }),

/***/ 707:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var domhandler = __webpack_require__(89641);
var selderee = __webpack_require__(51900);

/**
 * A {@link BuilderFunction} implementation.
 *
 * Creates a function (in a {@link Picker} wrapper) that can run
 * the decision tree against `htmlparser2` `Element` nodes.
 *
 * @typeParam V - the type of values associated with selectors.
 *
 * @param nodes - nodes ({@link DecisionTreeNode})
 * from the root level of the decision tree.
 *
 * @returns a {@link Picker} object.
 */
function hp2Builder(nodes) {
    return new selderee.Picker(handleArray(nodes));
}
// ==============================================
function handleArray(nodes) {
    const matchers = nodes.map(handleNode);
    return (el, ...tail) => flatMap(matchers, m => m(el, ...tail));
}
function handleNode(node) {
    switch (node.type) {
        case 'terminal': {
            const result = [node.valueContainer];
            return (el, ...tail) => result;
        }
        case 'tagName':
            return handleTagName(node);
        case 'attrValue':
            return handleAttrValueName(node);
        case 'attrPresence':
            return handleAttrPresenceName(node);
        case 'pushElement':
            return handlePushElementNode(node);
        case 'popElement':
            return handlePopElementNode(node);
    }
}
function handleTagName(node) {
    const variants = {};
    for (const variant of node.variants) {
        variants[variant.value] = handleArray(variant.cont);
    }
    return (el, ...tail) => {
        const continuation = variants[el.name];
        return (continuation) ? continuation(el, ...tail) : [];
    };
}
function handleAttrPresenceName(node) {
    const attrName = node.name;
    const continuation = handleArray(node.cont);
    return (el, ...tail) => (Object.prototype.hasOwnProperty.call(el.attribs, attrName))
        ? continuation(el, ...tail)
        : [];
}
function handleAttrValueName(node) {
    const callbacks = [];
    for (const matcher of node.matchers) {
        const predicate = matcher.predicate;
        const continuation = handleArray(matcher.cont);
        callbacks.push((attr, el, ...tail) => (predicate(attr) ? continuation(el, ...tail) : []));
    }
    const attrName = node.name;
    return (el, ...tail) => {
        const attr = el.attribs[attrName];
        return (attr || attr === '')
            ? flatMap(callbacks, cb => cb(attr, el, ...tail))
            : [];
    };
}
function handlePushElementNode(node) {
    const continuation = handleArray(node.cont);
    const leftElementGetter = (node.combinator === '+')
        ? getPrecedingElement
        : getParentElement;
    return (el, ...tail) => {
        const next = leftElementGetter(el);
        if (next === null) {
            return [];
        }
        return continuation(next, el, ...tail);
    };
}
const getPrecedingElement = (el) => {
    const prev = el.prev;
    if (prev === null) {
        return null;
    }
    return (domhandler.isTag(prev)) ? prev : getPrecedingElement(prev);
};
const getParentElement = (el) => {
    const parent = el.parent;
    return (parent && domhandler.isTag(parent)) ? parent : null;
};
function handlePopElementNode(node) {
    const continuation = handleArray(node.cont);
    return (el, next, ...tail) => continuation(next, ...tail);
}
// Can be removed after transition to Node 12.
function flatMap(items, mapper) {
    return [].concat(...amap(items, mapper));
}
function amap(items, mapper) {
    const len = items.length;
    const res = new Array(len);
    for (let i = 0; i < len; i++) {
        res[i] = mapper(items[i]);
    }
    return res;
}

exports.hp2Builder = hp2Builder;


/***/ }),

/***/ 82258:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var nearley = __webpack_require__(3836);
var moo = __webpack_require__(16050);

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var moo__namespace = /*#__PURE__*/_interopNamespace(moo);

// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
// Bypasses TS6133. Allow declared but unused functions.
// @ts-ignore
function id(d) { return d[0]; }
const lexer = moo__namespace.compile({
    ws: { match: /[ \t\r\n\f]+/, lineBreaks: true },
    idn: { match: /[a-zA-Z_-][a-zA-Z0-9_-]*/ },
    hashToken: { match: /#[a-zA-Z0-9_-]+/, value: (s) => s.slice(1) },
    str1: { match: /'(?:\\['\\]|[^\n'\\])*'/, value: (s) => s.slice(1, -1) },
    str2: { match: /"(?:\\["\\]|[^\n"\\])*"/, value: (s) => s.slice(1, -1) },
    asterisk: '*',
    fullstop: '.',
    comma: ',',
    lbr: '[',
    rbr: ']',
    eq: '=',
    gt: '>',
    vbar: '|',
    plus: '+',
    tilde: '~',
    caret: '^',
    dollar: '$',
    //colon:      ':',
    //lpar:       '(',
    //rpar:       ')',
});
function firstTokenValue(tokens) {
    return tokens[0].value;
}
function second(tokens) {
    return tokens[1];
}
function sumSpec([a0, a1, a2], [b0, b1, b2]) {
    return [a0 + b0, a1 + b1, a2 + b2];
}
const grammar = {
    Lexer: lexer,
    ParserRules: [
        { "name": "main", "symbols": ["_", "listSelector", "_"], "postprocess": second },
        { "name": "mainNoList", "symbols": ["_", "complexSelector", "_"], "postprocess": second },
        { "name": "listSelector", "symbols": ["complexSelector"], "postprocess": ([next]) => ({ type: 'list', list: [next] }) },
        { "name": "listSelector", "symbols": ["listSelector", "_", (lexer.has("comma") ? { type: "comma" } : comma), "_", "complexSelector"], "postprocess": ([acc, , , , next]) => ({ type: 'list', list: [...acc.list, next] }) },
        { "name": "complexSelector", "symbols": ["compoundSelector"], "postprocess": id },
        { "name": "complexSelector", "symbols": ["complexSelector", "__", "compoundSelector"], "postprocess": ([left, , right]) => ({
                type: 'compound',
                list: [...right.list, { type: 'combinator', combinator: ' ', left: left, specificity: left.specificity }],
                specificity: sumSpec(left.specificity, right.specificity)
            }) },
        { "name": "complexSelector", "symbols": ["complexSelector", "_", "combinator", "_", "compoundSelector"], "postprocess": ([left, , c, , right]) => ({
                type: 'compound',
                list: [...right.list, { type: 'combinator', combinator: c, left: left, specificity: left.specificity }],
                specificity: sumSpec(left.specificity, right.specificity)
            }) },
        { "name": "combinator", "symbols": [(lexer.has("gt") ? { type: "gt" } : gt)], "postprocess": () => '>' },
        { "name": "combinator", "symbols": [(lexer.has("plus") ? { type: "plus" } : plus)], "postprocess": () => '+' },
        { "name": "combinator", "symbols": [(lexer.has("tilde") ? { type: "tilde" } : tilde)], "postprocess": () => '~' },
        { "name": "combinator", "symbols": [(lexer.has("vbar") ? { type: "vbar" } : vbar), (lexer.has("vbar") ? { type: "vbar" } : vbar)], "postprocess": () => '||' },
        { "name": "compoundSelector", "symbols": ["typeSelector"], "postprocess": ([next]) => ({
                type: 'compound',
                list: [next],
                specificity: next.specificity
            }) },
        { "name": "compoundSelector", "symbols": ["subclassSelector"], "postprocess": ([next]) => ({
                type: 'compound',
                list: [next],
                specificity: next.specificity
            }) },
        { "name": "compoundSelector", "symbols": ["compoundSelector", "subclassSelector"], "postprocess": ([acc, next]) => ({
                type: 'compound',
                list: [...acc.list, next],
                specificity: sumSpec(acc.specificity, next.specificity)
            }) },
        { "name": "subclassSelector", "symbols": ["idSelector"], "postprocess": id },
        { "name": "subclassSelector", "symbols": ["classSelector"], "postprocess": id },
        { "name": "subclassSelector", "symbols": ["attrSelector"], "postprocess": id },
        { "name": "attrSelector", "symbols": ["attrPresenceSelector"], "postprocess": id },
        { "name": "attrSelector", "symbols": ["attrValueSelector"], "postprocess": id },
        { "name": "typeSelector", "symbols": ["tagSelector"], "postprocess": id },
        { "name": "typeSelector", "symbols": ["uniSelector"], "postprocess": id },
        { "name": "attrPresenceSelector", "symbols": [(lexer.has("lbr") ? { type: "lbr" } : lbr), "_", "wqname", "_", (lexer.has("rbr") ? { type: "rbr" } : rbr)], "postprocess": ([, , wqname]) => ({
                type: 'attrPresence',
                name: wqname.name,
                namespace: wqname.namespace,
                specificity: [0, 1, 0]
            })
        },
        { "name": "attrValueSelector", "symbols": [(lexer.has("lbr") ? { type: "lbr" } : lbr), "_", "wqname", "_", "attrMatcher", "_", "attrValue", "_", (lexer.has("rbr") ? { type: "rbr" } : rbr)], "postprocess": ([, , wqname, , matcher, , v]) => ({
                type: 'attrValue',
                name: wqname.name,
                namespace: wqname.namespace,
                matcher: matcher,
                value: v.value,
                modifier: v.modifier,
                specificity: [0, 1, 0]
            })
        },
        { "name": "attrMatcher", "symbols": [(lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '=' },
        { "name": "attrMatcher", "symbols": [(lexer.has("tilde") ? { type: "tilde" } : tilde), (lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '~=' },
        { "name": "attrMatcher", "symbols": [(lexer.has("vbar") ? { type: "vbar" } : vbar), (lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '|=' },
        { "name": "attrMatcher", "symbols": [(lexer.has("caret") ? { type: "caret" } : caret), (lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '^=' },
        { "name": "attrMatcher", "symbols": [(lexer.has("dollar") ? { type: "dollar" } : dollar), (lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '$=' },
        { "name": "attrMatcher", "symbols": [(lexer.has("asterisk") ? { type: "asterisk" } : asterisk), (lexer.has("eq") ? { type: "eq" } : eq)], "postprocess": () => '*=' },
        { "name": "attrValue", "symbols": ["str"], "postprocess": ([v]) => ({ value: v, modifier: null }) },
        { "name": "attrValue", "symbols": ["idn"], "postprocess": ([v]) => ({ value: v, modifier: null }) },
        { "name": "attrValue", "symbols": ["str", "_", "attrModifier"], "postprocess": ([v, , mod]) => ({ value: v, modifier: mod }) },
        { "name": "attrValue", "symbols": ["idn", "__", "attrModifier"], "postprocess": ([v, , mod]) => ({ value: v, modifier: mod }) },
        { "name": "attrModifier", "symbols": [{ "literal": "i" }], "postprocess": () => 'i' },
        { "name": "attrModifier", "symbols": [{ "literal": "I" }], "postprocess": () => 'i' },
        { "name": "attrModifier", "symbols": [{ "literal": "s" }], "postprocess": () => 's' },
        { "name": "attrModifier", "symbols": [{ "literal": "S" }], "postprocess": () => 's' },
        { "name": "idSelector", "symbols": [(lexer.has("hashToken") ? { type: "hashToken" } : hashToken)], "postprocess": ([{ value: name }]) => ({ type: 'id', name: name, specificity: [1, 0, 0] }) },
        { "name": "classSelector", "symbols": [(lexer.has("fullstop") ? { type: "fullstop" } : fullstop), "idn"], "postprocess": ([, name]) => ({ type: 'class', name: name, specificity: [0, 1, 0] }) },
        { "name": "tagSelector", "symbols": ["wqname"], "postprocess": ([wqname]) => ({
                type: 'tag',
                name: wqname.name,
                namespace: wqname.namespace,
                specificity: [0, 0, 1]
            })
        },
        { "name": "uniSelector", "symbols": [(lexer.has("asterisk") ? { type: "asterisk" } : asterisk)], "postprocess": () => ({ type: 'universal', namespace: null, specificity: [0, 0, 0] }) },
        { "name": "uniSelector", "symbols": ["ns", (lexer.has("asterisk") ? { type: "asterisk" } : asterisk)], "postprocess": ([ns]) => ({ type: 'universal', namespace: ns, specificity: [0, 0, 0] }) },
        { "name": "wqname", "symbols": ["idn"], "postprocess": ([name]) => ({ name: name, namespace: null }) },
        { "name": "wqname", "symbols": ["ns", "idn"], "postprocess": ([ns, name]) => ({ name: name, namespace: ns }) },
        { "name": "ns", "symbols": [(lexer.has("vbar") ? { type: "vbar" } : vbar)], "postprocess": () => '' },
        { "name": "ns", "symbols": ["idn", (lexer.has("vbar") ? { type: "vbar" } : vbar)], "postprocess": id },
        { "name": "str", "symbols": [(lexer.has("str1") ? { type: "str1" } : str1)], "postprocess": firstTokenValue },
        { "name": "str", "symbols": [(lexer.has("str2") ? { type: "str2" } : str2)], "postprocess": firstTokenValue },
        { "name": "idn", "symbols": [(lexer.has("idn") ? { type: "idn" } : idn)], "postprocess": firstTokenValue },
        { "name": "_$ebnf$1", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": id },
        { "name": "_$ebnf$1", "symbols": [], "postprocess": () => null },
        { "name": "_", "symbols": ["_$ebnf$1"], "postprocess": () => null },
        { "name": "__", "symbols": [(lexer.has("ws") ? { type: "ws" } : ws)], "postprocess": () => null }
    ],
    ParserStart: "main",
};

var ast = /*#__PURE__*/Object.freeze({
    __proto__: null
});

// Passing the start argument to a parser or grammar constructor
// doesn't seem to work as expected.
const compiledRulesNoList = { ...grammar, ParserStart: 'mainNoList' };
/**
 * Parse a CSS selector string.
 *
 * This function supports comma-separated selector lists
 * and always returns an AST starting from a node of type `list`.
 *
 * @param str - CSS selector string (can contain commas).
 */
function parse(str) {
    return _parse(grammar, str);
}
/**
 * Parse a CSS selector string.
 *
 * This function does not support comma-separated selector lists
 * and always returns an AST starting from a node of type `compound`.
 *
 * @param str - CSS selector string (no commas).
 */
function parse1(str) {
    return _parse(compiledRulesNoList, str);
}
function _parse(compiledRules1, str) {
    const parser = new nearley.Parser(nearley.Grammar.fromCompiled(compiledRules1));
    parser.feed(str);
    if (parser.results.length === 0) {
        throw new Error('Failed to parse - input string might be incomplete.');
    }
    return parser.results[0];
}
/**
 * Convert a selector AST back to a string representation.
 *
 * Note: formatting is not preserved in the AST.
 *
 * @param selector - A selector AST object.
 */
function serialize(selector) {
    if (!selector.type) {
        throw new Error('This is not an AST node.');
    }
    switch (selector.type) {
        case 'universal':
            return _serNs(selector.namespace) + '*';
        case 'tag':
            return _serNs(selector.namespace) + selector.name;
        case 'class':
            return '.' + selector.name;
        case 'id':
            return '#' + selector.name;
        case 'attrPresence':
            return `[${_serNs(selector.namespace)}${selector.name}]`;
        case 'attrValue':
            return `[${_serNs(selector.namespace)}${selector.name}${selector.matcher}${_serStr(selector.value)}${(selector.modifier ? selector.modifier : '')}]`;
        case 'combinator':
            return serialize(selector.left) + selector.combinator;
        case 'compound':
            return selector.list.reduce((acc, node) => {
                if (node.type === 'combinator') {
                    return serialize(node) + acc;
                }
                else {
                    return acc + serialize(node);
                }
            }, '');
        case 'list':
            return selector.list.map(serialize).join(',');
    }
}
function _serNs(ns) {
    return (ns || ns === '')
        ? ns + '|'
        : '';
}
function _serStr(str) {
    if (str.indexOf('"') === -1) {
        return `"${str}"`;
    }
    else if (str.indexOf("'") === -1) {
        return `'${str}'`;
    }
    else {
        return `"${str.replace('"', '\\"')}"`;
    }
}
/**
 * Modifies the given AST **in place** to have all internal arrays
 * in a stable order. Returns the AST.
 *
 * Intended for consitent processing and normalized `serialize()` output.
 *
 * @param selector - A selector AST object.
 */
function normalize(selector) {
    if (!selector.type) {
        throw new Error('This is not an AST node.');
    }
    switch (selector.type) {
        case 'compound': {
            selector.list.forEach(normalize);
            selector.list.sort((a, b) => _compareArrays(_getSelectorPriority(a), _getSelectorPriority(b)));
            break;
        }
        case 'combinator': {
            normalize(selector.left);
            break;
        }
        case 'list': {
            selector.list.forEach(normalize);
            selector.list.sort((a, b) => (serialize(a) < serialize(b)) ? -1 : 1);
            break;
        }
    }
    return selector;
}
function _getSelectorPriority(selector) {
    switch (selector.type) {
        case 'universal':
            return [1];
        case 'tag':
            return [1];
        case 'id':
            return [2];
        case 'class':
            return [3, selector.name];
        case 'attrPresence':
            return [4, serialize(selector)];
        case 'attrValue':
            return [5, serialize(selector)];
        case 'combinator':
            return [15, serialize(selector)];
    }
}
/**
 * Compare selectors based on their specificity.
 *
 * Usable as a comparator for sorting.
 *
 * @param a - First selector.
 * @param b - Second selector.
 */
function compareSelectors(a, b) {
    return _compareArrays(a.specificity, b.specificity);
}
/**
 * Compare specificity values without reducing them
 * as arbitrary base numbers.
 *
 * Usable as a comparator for sorting.
 *
 * @param a - First specificity value.
 * @param b - Second specificity value.
 */
function compareSpecificity(a, b) {
    return _compareArrays(a, b);
}
function _compareArrays(a, b) {
    if (!Array.isArray(a) || !Array.isArray(b)) {
        throw new Error('Arguments must be arrays.');
    }
    const shorter = (a.length < b.length) ? a.length : b.length;
    for (let i = 0; i < shorter; i++) {
        if (a[i] === b[i]) {
            continue;
        }
        return (a[i] < b[i]) ? -1 : 1;
    }
    return a.length - b.length;
}

exports.Ast = ast;
exports.compareSelectors = compareSelectors;
exports.compareSpecificity = compareSpecificity;
exports.normalize = normalize;
exports.parse = parse;
exports.parse1 = parse1;
exports.serialize = serialize;


/***/ }),

/***/ 51900:
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({ value: true }));

var parseley = __webpack_require__(82258);

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var parseley__namespace = /*#__PURE__*/_interopNamespace(parseley);

var Ast = /*#__PURE__*/Object.freeze({
    __proto__: null
});

var Types = /*#__PURE__*/Object.freeze({
    __proto__: null
});

/**
 * A {@link BuilderFunction} implementation.
 *
 * Produces a string representation of the tree
 * for testing and debug purposes.
 *
 * Only accepts `string` as the associated value type.
 * Map your input collection before creating a {@link DecisionTree}
 * if you want to use it with a different type -
 * the decision on how to stringify the value is up to you.
 *
 * @param nodes - nodes from the root level of the decision tree.
 * @returns the string representation of the tree.
 */
const treeify = (nodes) => '▽\n' + treeifyArray(nodes, thinLines);
const thinLines = [['├─', '│ '], ['└─', '  ']];
const heavyLines = [['┠─', '┃ '], ['┖─', '  ']];
const doubleLines = [['╟─', '║ '], ['╙─', '  ']];
function treeifyArray(nodes, tpl = heavyLines) {
    return prefixItems(tpl, nodes.map(n => treeifyNode(n)));
}
function treeifyNode(node) {
    switch (node.type) {
        case 'terminal': {
            const vctr = node.valueContainer;
            return `◁ #${vctr.index} ${JSON.stringify(vctr.specificity)} ${vctr.value}`;
        }
        case 'tagName':
            return `◻ Tag name\n${treeifyArray(node.variants, doubleLines)}`;
        case 'attrValue':
            return `▣ Attr value: ${node.name}\n${treeifyArray(node.matchers, doubleLines)}`;
        case 'attrPresence':
            return `◨ Attr presence: ${node.name}\n${treeifyArray(node.cont)}`;
        case 'pushElement':
            return `◉ Push element: ${node.combinator}\n${treeifyArray(node.cont, thinLines)}`;
        case 'popElement':
            return `◌ Pop element\n${treeifyArray(node.cont, thinLines)}`;
        case 'variant':
            return `◇ = ${node.value}\n${treeifyArray(node.cont)}`;
        case 'matcher':
            return `◈ ${node.matcher} "${node.value}"${node.modifier || ''}\n${treeifyArray(node.cont)}`;
    }
}
function prefixItems(tpl, items) {
    return items
        .map((item, i, { length }) => prefixItem(tpl, item, i === length - 1))
        .join('\n');
}
function prefixItem(tpl, item, tail = true) {
    const tpl1 = tpl[tail ? 1 : 0];
    return tpl1[0] + item.split('\n').join('\n' + tpl1[1]);
}

var TreeifyBuilder = /*#__PURE__*/Object.freeze({
    __proto__: null,
    treeify: treeify
});

/**
 * CSS selectors decision tree.
 * Data structure that weaves similar selectors together
 * in order to minimize the number of checks required
 * to find the ones matching a given HTML element.
 *
 * Converted into a functioning implementation via plugins
 * tailored for specific DOM ASTs.
 *
 * @typeParam V - the type of values associated with selectors.
 */
class DecisionTree {
    /**
     * Create new DecisionTree object.
     *
     * @param input - an array containing all selectors
     * paired with associated values.
     *
     * @typeParam V - the type of values associated with selectors.
     */
    constructor(input) {
        this.branches = weave(toAstTerminalPairs(input));
    }
    /**
     * Turn this decision tree into a usable form.
     *
     * @typeParam R - return type defined by the builder function.
     *
     * @param builder - the builder function.
     *
     * @returns the decision tree in a form ready for use.
     */
    build(builder) {
        return builder(this.branches);
    }
}
function toAstTerminalPairs(array) {
    const len = array.length;
    const results = new Array(len);
    for (let i = 0; i < len; i++) {
        const [selectorString, val] = array[i];
        const ast = preprocess(parseley__namespace.parse1(selectorString));
        results[i] = {
            ast: ast,
            terminal: {
                type: 'terminal',
                valueContainer: { index: i, value: val, specificity: ast.specificity }
            }
        };
    }
    return results;
}
function preprocess(ast) {
    reduceSelectorVariants(ast);
    parseley__namespace.normalize(ast);
    return ast;
}
function reduceSelectorVariants(ast) {
    const newList = [];
    ast.list.forEach(sel => {
        switch (sel.type) {
            case 'class':
                newList.push({
                    matcher: '~=',
                    modifier: null,
                    name: 'class',
                    namespace: null,
                    specificity: sel.specificity,
                    type: 'attrValue',
                    value: sel.name,
                });
                break;
            case 'id':
                newList.push({
                    matcher: '=',
                    modifier: null,
                    name: 'id',
                    namespace: null,
                    specificity: sel.specificity,
                    type: 'attrValue',
                    value: sel.name,
                });
                break;
            case 'combinator':
                reduceSelectorVariants(sel.left);
                newList.push(sel);
                break;
            case 'universal':
                // skip it
                break;
            default:
                newList.push(sel);
                break;
        }
    });
    ast.list = newList;
}
function weave(items) {
    const branches = [];
    while (items.length) {
        const topKind = findTopKey(items, (sel) => true, getSelectorKind);
        const { matches, nonmatches, empty } = breakByKind(items, topKind);
        items = nonmatches;
        if (matches.length) {
            branches.push(branchOfKind(topKind, matches));
        }
        if (empty.length) {
            branches.push(...terminate(empty));
        }
    }
    return branches;
}
function terminate(items) {
    const results = [];
    for (const item of items) {
        const terminal = item.terminal;
        if (terminal.type === 'terminal') {
            results.push(terminal);
        }
        else { // popElement - lift contained terminals
            const { matches, rest } = partition(terminal.cont, (node) => node.type === 'terminal');
            matches.forEach((node) => results.push(node));
            if (rest.length) {
                terminal.cont = rest;
                results.push(terminal);
            }
        }
    }
    return results;
}
function breakByKind(items, selectedKind) {
    const matches = [];
    const nonmatches = [];
    const empty = [];
    for (const item of items) {
        const simpsels = item.ast.list;
        if (simpsels.length) {
            const isMatch = simpsels.some(node => getSelectorKind(node) === selectedKind);
            (isMatch ? matches : nonmatches).push(item);
        }
        else {
            empty.push(item);
        }
    }
    return { matches, nonmatches, empty };
}
function getSelectorKind(sel) {
    switch (sel.type) {
        case 'attrPresence':
            return `attrPresence ${sel.name}`;
        case 'attrValue':
            return `attrValue ${sel.name}`;
        case 'combinator':
            return `combinator ${sel.combinator}`;
        default:
            return sel.type;
    }
}
function branchOfKind(kind, items) {
    if (kind === 'tag') {
        return tagNameBranch(items);
    }
    if (kind.startsWith('attrValue ')) {
        return attrValueBranch(kind.substring(10), items);
    }
    if (kind.startsWith('attrPresence ')) {
        return attrPresenceBranch(kind.substring(13), items);
    }
    if (kind === 'combinator >') {
        return combinatorBranch('>', items);
    }
    if (kind === 'combinator +') {
        return combinatorBranch('+', items);
    }
    throw new Error(`Unsupported selector kind: ${kind}`);
}
function tagNameBranch(items) {
    const groups = spliceAndGroup(items, (x) => x.type === 'tag', (x) => x.name);
    const variants = Object.entries(groups).map(([name, group]) => ({
        type: 'variant',
        value: name,
        cont: weave(group.items)
    }));
    return {
        type: 'tagName',
        variants: variants
    };
}
function attrPresenceBranch(name, items) {
    for (const item of items) {
        spliceSimpleSelector(item, (x) => (x.type === 'attrPresence') && (x.name === name));
    }
    return {
        type: 'attrPresence',
        name: name,
        cont: weave(items)
    };
}
function attrValueBranch(name, items) {
    const groups = spliceAndGroup(items, (x) => (x.type === 'attrValue') && (x.name === name), (x) => `${x.matcher} ${x.modifier || ''} ${x.value}`);
    const matchers = [];
    for (const group of Object.values(groups)) {
        const sel = group.oneSimpleSelector;
        const predicate = getAttrPredicate(sel);
        const continuation = weave(group.items);
        matchers.push({
            type: 'matcher',
            matcher: sel.matcher,
            modifier: sel.modifier,
            value: sel.value,
            predicate: predicate,
            cont: continuation
        });
    }
    return {
        type: 'attrValue',
        name: name,
        matchers: matchers
    };
}
function getAttrPredicate(sel) {
    if (sel.modifier === 'i') {
        const expected = sel.value.toLowerCase();
        switch (sel.matcher) {
            case '=':
                return (actual) => expected === actual.toLowerCase();
            case '~=':
                return (actual) => actual.toLowerCase().split(/[ \t]+/).includes(expected);
            case '^=':
                return (actual) => actual.toLowerCase().startsWith(expected);
            case '$=':
                return (actual) => actual.toLowerCase().endsWith(expected);
            case '*=':
                return (actual) => actual.toLowerCase().includes(expected);
            case '|=':
                return (actual) => {
                    const lower = actual.toLowerCase();
                    return (expected === lower) || (lower.startsWith(expected) && lower[expected.length] === '-');
                };
        }
    }
    else {
        const expected = sel.value;
        switch (sel.matcher) {
            case '=':
                return (actual) => expected === actual;
            case '~=':
                return (actual) => actual.split(/[ \t]+/).includes(expected);
            case '^=':
                return (actual) => actual.startsWith(expected);
            case '$=':
                return (actual) => actual.endsWith(expected);
            case '*=':
                return (actual) => actual.includes(expected);
            case '|=':
                return (actual) => (expected === actual) || (actual.startsWith(expected) && actual[expected.length] === '-');
        }
    }
}
function combinatorBranch(combinator, items) {
    const groups = spliceAndGroup(items, (x) => (x.type === 'combinator') && (x.combinator === combinator), (x) => parseley__namespace.serialize(x.left));
    const leftItems = [];
    for (const group of Object.values(groups)) {
        const rightCont = weave(group.items);
        const leftAst = group.oneSimpleSelector.left;
        leftItems.push({
            ast: leftAst,
            terminal: { type: 'popElement', cont: rightCont }
        });
    }
    return {
        type: 'pushElement',
        combinator: combinator,
        cont: weave(leftItems)
    };
}
function spliceAndGroup(items, predicate, keyCallback) {
    const groups = {};
    while (items.length) {
        const bestKey = findTopKey(items, predicate, keyCallback);
        const bestKeyPredicate = (sel) => predicate(sel) && keyCallback(sel) === bestKey;
        const hasBestKeyPredicate = (item) => item.ast.list.some(bestKeyPredicate);
        const { matches, rest } = partition1(items, hasBestKeyPredicate);
        let oneSimpleSelector = null;
        for (const item of matches) {
            const splicedNode = spliceSimpleSelector(item, bestKeyPredicate);
            if (!oneSimpleSelector) {
                oneSimpleSelector = splicedNode;
            }
        }
        if (oneSimpleSelector == null) {
            throw new Error('No simple selector is found.');
        }
        groups[bestKey] = { oneSimpleSelector: oneSimpleSelector, items: matches };
        items = rest;
    }
    return groups;
}
function spliceSimpleSelector(item, predicate) {
    const simpsels = item.ast.list;
    const matches = new Array(simpsels.length);
    let firstIndex = -1;
    for (let i = simpsels.length; i-- > 0;) {
        if (predicate(simpsels[i])) {
            matches[i] = true;
            firstIndex = i;
        }
    }
    if (firstIndex == -1) {
        throw new Error(`Couldn't find the required simple selector.`);
    }
    const result = simpsels[firstIndex];
    item.ast.list = simpsels.filter((sel, i) => !matches[i]);
    return result;
}
function findTopKey(items, predicate, keyCallback) {
    const candidates = {};
    for (const item of items) {
        const candidates1 = {};
        for (const node of item.ast.list.filter(predicate)) {
            candidates1[keyCallback(node)] = true;
        }
        for (const key of Object.keys(candidates1)) {
            if (candidates[key]) {
                candidates[key]++;
            }
            else {
                candidates[key] = 1;
            }
        }
    }
    let topKind = '';
    let topCounter = 0;
    for (const entry of Object.entries(candidates)) {
        if (entry[1] > topCounter) {
            topKind = entry[0];
            topCounter = entry[1];
        }
    }
    return topKind;
}
function partition(src, predicate) {
    const matches = [];
    const rest = [];
    for (const x of src) {
        if (predicate(x)) {
            matches.push(x);
        }
        else {
            rest.push(x);
        }
    }
    return { matches, rest };
}
function partition1(src, predicate) {
    const matches = [];
    const rest = [];
    for (const x of src) {
        if (predicate(x)) {
            matches.push(x);
        }
        else {
            rest.push(x);
        }
    }
    return { matches, rest };
}

/**
 * Simple wrapper around the matcher function.
 * Recommended return type for builder plugins.
 *
 * @typeParam L - the type of HTML Element in the targeted DOM AST.
 * @typeParam V - the type of associated values.
 */
class Picker {
    /**
     * Create new Picker object.
     *
     * @typeParam L - the type of HTML Element in the targeted DOM AST.
     * @typeParam V - the type of associated values.
     *
     * @param f - the function that matches an element
     * and returns all associated values.
     */
    constructor(f) {
        this.f = f;
    }
    /**
     * Run the selectors decision tree against one HTML Element
     * and return all matched associated values
     * along with selector specificities.
     *
     * Client code then decides how to further process them
     * (sort, filter, etc).
     *
     * @param el - an HTML Element.
     *
     * @returns all associated values along with
     * selector specificities for all matched selectors.
     */
    pickAll(el) {
        return this.f(el);
    }
    /**
     * Run the selectors decision tree against one HTML Element
     * and choose the value from the most specific mached selector.
     *
     * @param el - an HTML Element.
     *
     * @param preferFirst - option to define which value to choose
     * when there are multiple matches with equal specificity.
     *
     * @returns the value from the most specific mached selector
     * or `null` if nothing matched.
     */
    pick1(el, preferFirst = false) {
        const results = this.f(el);
        const len = results.length;
        if (len === 0) {
            return null;
        }
        if (len === 1) {
            return results[0].value;
        }
        const comparator = (preferFirst)
            ? comparatorPreferFirst
            : comparatorPreferLast;
        let result = results[0];
        for (let i = 1; i < len; i++) {
            const next = results[i];
            if (comparator(result, next)) {
                result = next;
            }
        }
        return result.value;
    }
}
function comparatorPreferFirst(acc, next) {
    const diff = parseley.compareSpecificity(next.specificity, acc.specificity);
    return diff > 0 || (diff === 0 && next.index < acc.index);
}
function comparatorPreferLast(acc, next) {
    const diff = parseley.compareSpecificity(next.specificity, acc.specificity);
    return diff > 0 || (diff === 0 && next.index > acc.index);
}

exports.Ast = Ast;
exports.DecisionTree = DecisionTree;
exports.Picker = Picker;
exports.Treeify = TreeifyBuilder;
exports.Types = Types;


/***/ }),

/***/ 39818:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"0":65533,"128":8364,"130":8218,"131":402,"132":8222,"133":8230,"134":8224,"135":8225,"136":710,"137":8240,"138":352,"139":8249,"140":338,"142":381,"145":8216,"146":8217,"147":8220,"148":8221,"149":8226,"150":8211,"151":8212,"152":732,"153":8482,"154":353,"155":8250,"156":339,"158":382,"159":376}');

/***/ }),

/***/ 96550:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"\'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\\"","QUOT":"\\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}');

/***/ }),

/***/ 86662:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"Aacute":"Á","aacute":"á","Acirc":"Â","acirc":"â","acute":"´","AElig":"Æ","aelig":"æ","Agrave":"À","agrave":"à","amp":"&","AMP":"&","Aring":"Å","aring":"å","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","brvbar":"¦","Ccedil":"Ç","ccedil":"ç","cedil":"¸","cent":"¢","copy":"©","COPY":"©","curren":"¤","deg":"°","divide":"÷","Eacute":"É","eacute":"é","Ecirc":"Ê","ecirc":"ê","Egrave":"È","egrave":"è","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","frac12":"½","frac14":"¼","frac34":"¾","gt":">","GT":">","Iacute":"Í","iacute":"í","Icirc":"Î","icirc":"î","iexcl":"¡","Igrave":"Ì","igrave":"ì","iquest":"¿","Iuml":"Ï","iuml":"ï","laquo":"«","lt":"<","LT":"<","macr":"¯","micro":"µ","middot":"·","nbsp":" ","not":"¬","Ntilde":"Ñ","ntilde":"ñ","Oacute":"Ó","oacute":"ó","Ocirc":"Ô","ocirc":"ô","Ograve":"Ò","ograve":"ò","ordf":"ª","ordm":"º","Oslash":"Ø","oslash":"ø","Otilde":"Õ","otilde":"õ","Ouml":"Ö","ouml":"ö","para":"¶","plusmn":"±","pound":"£","quot":"\\"","QUOT":"\\"","raquo":"»","reg":"®","REG":"®","sect":"§","shy":"­","sup1":"¹","sup2":"²","sup3":"³","szlig":"ß","THORN":"Þ","thorn":"þ","times":"×","Uacute":"Ú","uacute":"ú","Ucirc":"Û","ucirc":"û","Ugrave":"Ù","ugrave":"ù","uml":"¨","Uuml":"Ü","uuml":"ü","Yacute":"Ý","yacute":"ý","yen":"¥","yuml":"ÿ"}');

/***/ }),

/***/ 70772:
/***/ ((module) => {

"use strict";
module.exports = JSON.parse('{"amp":"&","apos":"\'","gt":">","lt":"<","quot":"\\""}');

/***/ })

};
;