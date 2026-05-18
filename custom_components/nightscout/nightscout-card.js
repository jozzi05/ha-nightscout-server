//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, ee = g ? g.emptyScript : "", te = h.reactiveElementPolyfillSupport, _ = (e, t) => e, v = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? ee : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, y = (e, t) => !l(e, t), ne = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	useDefault: !1,
	hasChanged: y
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var b = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = ne) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? ne;
	}
	static _$Ei() {
		if (this.hasOwnProperty(_("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(_("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(_("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(Infinity).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? v : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? v : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? y)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
b.elementStyles = [], b.shadowRootOptions = { mode: "open" }, b[_("elementProperties")] = /* @__PURE__ */ new Map(), b[_("finalized")] = /* @__PURE__ */ new Map(), te?.({ ReactiveElement: b }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var x = globalThis, re = (e) => e, S = x.trustedTypes, C = S ? S.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, w = "$lit$", T = `lit$${Math.random().toFixed(9).slice(2)}$`, ie = "?" + T, ae = `<${ie}>`, E = document, D = () => E.createComment(""), O = (e) => e === null || typeof e != "object" && typeof e != "function", k = Array.isArray, oe = (e) => k(e) || typeof e?.[Symbol.iterator] == "function", A = "[ 	\n\f\r]", j = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, M = /-->/g, N = />/g, P = RegExp(`>|${A}(?:([^\\s"'>=/]+)(${A}*=${A}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), se = /'/g, ce = /"/g, le = /^(?:script|style|textarea|title)$/i, F = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), I = Symbol.for("lit-noChange"), L = Symbol.for("lit-nothing"), ue = /* @__PURE__ */ new WeakMap(), R = E.createTreeWalker(E, 129);
function z(e, t) {
	if (!k(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return C === void 0 ? t : C.createHTML(t);
}
var de = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = j;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === j ? c[1] === "!--" ? o = M : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = P) : (le.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = P) : o = N : o === P ? c[0] === ">" ? (o = i ?? j, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? P : c[3] === "\"" ? ce : se) : o === ce || o === se ? o = P : o === M || o === N ? o = j : (o = P, i = void 0);
		let d = o === P && e[t + 1].startsWith("/>") ? " " : "";
		a += o === j ? n + ae : l >= 0 ? (r.push(s), n.slice(0, l) + w + n.slice(l) + T + d) : n + T + (l === -2 ? t : d);
	}
	return [z(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, B = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = de(t, n);
		if (this.el = e.createElement(l, r), R.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = R.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(w)) {
					let t = u[o++], n = i.getAttribute(e).split(T), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? pe : r[1] === "?" ? me : r[1] === "@" ? he : U
					}), i.removeAttribute(e);
				} else e.startsWith(T) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (le.test(i.tagName)) {
					let e = i.textContent.split(T), t = e.length - 1;
					if (t > 0) {
						i.textContent = S ? S.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], D()), R.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], D());
					}
				}
			} else if (i.nodeType === 8) if (i.data === ie) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(T, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += T.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = E.createElement("template");
		return n.innerHTML = e, n;
	}
};
function V(e, t, n = e, r) {
	if (t === I) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = O(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = V(e, i._$AS(e, t.values), i, r)), t;
}
var fe = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? E).importNode(t, !0);
		R.currentNode = r;
		let i = R.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new H(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ge(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = R.nextNode(), a++);
		}
		return R.currentNode = E, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, H = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = L, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = V(this, e, t), O(e) ? e === L || e == null || e === "" ? (this._$AH !== L && this._$AR(), this._$AH = L) : e !== this._$AH && e !== I && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? oe(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== L && O(this._$AH) ? this._$AA.nextSibling.data = e : this.T(E.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = B.createElement(z(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new fe(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = ue.get(e.strings);
		return t === void 0 && ue.set(e.strings, t = new B(e)), t;
	}
	k(t) {
		k(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(D()), this.O(D()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = re(e).nextSibling;
			re(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, U = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = L, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = L;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = V(this, e, t, 0), a = !O(e) || e !== this._$AH && e !== I, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = V(this, r[n + o], t, o), s === I && (s = this._$AH[o]), a ||= !O(s) || s !== this._$AH[o], s === L ? e = L : e !== L && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === L ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, pe = class extends U {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === L ? void 0 : e;
	}
}, me = class extends U {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== L);
	}
}, he = class extends U {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = V(this, e, t, 0) ?? L) === I) return;
		let n = this._$AH, r = e === L && n !== L || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== L && (n === L || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ge = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		V(this, e);
	}
}, _e = x.litHtmlPolyfillSupport;
_e?.(B, H), (x.litHtmlVersions ??= []).push("3.3.3");
var ve = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new H(t.insertBefore(D(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, W = globalThis, G = class extends b {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ve(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return I;
	}
};
G._$litElement$ = !0, G.finalized = !0, W.litElementHydrateSupport?.({ LitElement: G });
var ye = W.litElementPolyfillSupport;
ye?.({ LitElement: G }), (W.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var be = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, xe = {
	attribute: !0,
	type: String,
	converter: v,
	reflect: !1,
	hasChanged: y
}, Se = (e = xe, t, n) => {
	let { kind: r, metadata: i } = n, a = globalThis.litPropertyMetadata.get(i);
	if (a === void 0 && globalThis.litPropertyMetadata.set(i, a = /* @__PURE__ */ new Map()), r === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(n.name, e), r === "accessor") {
		let { name: r } = n;
		return {
			set(n) {
				let i = t.get.call(this);
				t.set.call(this, n), this.requestUpdate(r, i, e, !0, n);
			},
			init(t) {
				return t !== void 0 && this.C(r, void 0, e, t), t;
			}
		};
	}
	if (r === "setter") {
		let { name: r } = n;
		return function(n) {
			let i = this[r];
			t.call(this, n), this.requestUpdate(r, i, e, !0, n);
		};
	}
	throw Error("Unsupported decorator location: " + r);
};
function K(e) {
	return (t, n) => typeof n == "object" ? Se(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function q(e) {
	return K({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region src/styles.ts
var Ce = o`
  :host {
    display: block;
  }

  ha-card {
    padding: 16px;
    overflow: hidden;
    box-sizing: border-box;
    border: 2px solid transparent;
    transition: border-color 0.3s ease;
  }

  ha-card.blink {
    animation: glucose-blink 5s ease-in;
  }

  @keyframes glucose-blink {
    0% {
      border-color: var(--blink-color, transparent);
    }
    20% {
      border-color: var(--blink-color, transparent);
    }
    100% {
      border-color: transparent;
    }
  }

  .ns-row {
    display: flex;
    align-items: baseline;
    gap: 12px;
    flex-wrap: wrap;
  }

  .ns-glucose {
    font-weight: bold;
    line-height: 1;
  }

  .ns-arrow {
    font-weight: bold;
    line-height: 1;
  }

  .ns-secondary {
    opacity: 0.85;
  }

  .ns-time-ago {
    opacity: 0.6;
    margin-top: 2px;
  }

  .ns-label {
    opacity: 0.6;
    margin-right: 2px;
  }

  .ns-not-available {
    opacity: 0.5;
    font-style: italic;
    padding: 16px 0;
  }
`, we = o`
  :host {
    display: block;
    font-family: var(--ha-font-family-body, var(--primary-font-family, "Roboto", sans-serif));
    color: var(--primary-text-color);
    -webkit-font-smoothing: antialiased;
  }

  .editor {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 4px 0 8px;
    box-sizing: border-box;
  }

  .panel {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px 14px;
    border-radius: 10px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12));
    background: var(--secondary-background-color, rgba(0, 0, 0, 0.04));
  }

  .panel-title {
    margin: 0;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: var(--secondary-text-color, var(--primary-text-color));
    opacity: 0.85;
  }

  .hint {
    margin: 0;
    font-size: 0.875rem;
    line-height: 1.45;
    color: var(--secondary-text-color, var(--primary-text-color));
    opacity: 0.8;
  }

  .field-select,
  .field-input,
  .field-number {
    width: 100%;
    box-sizing: border-box;
    padding: 8px 10px;
    font: inherit;
    font-size: 0.9rem;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  .field-select:focus,
  .field-input:focus,
  .field-number:focus {
    border-color: var(--primary-color, #03a9f4);
    box-shadow: 0 0 0 1px var(--primary-color, #03a9f4);
  }

  .field-number {
    width: 4.5rem;
    text-align: center;
    padding: 6px 8px;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
    gap: 8px 12px;
  }

  .checkbox-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 0.9rem;
    cursor: pointer;
    user-select: none;
  }

  .checkbox-item input {
    width: 1rem;
    height: 1rem;
    margin: 0;
    accent-color: var(--primary-color, #03a9f4);
    cursor: pointer;
  }

  .slider-row {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .slider-row input[type="range"] {
    flex: 1;
    min-width: 0;
    accent-color: var(--primary-color, #03a9f4);
  }

  .slider-value {
    flex-shrink: 0;
    min-width: 3rem;
    padding: 4px 10px;
    font-size: 0.85rem;
    font-weight: 600;
    text-align: center;
    border-radius: 6px;
    background: var(--card-background-color, rgba(0, 0, 0, 0.06));
    color: var(--primary-text-color);
  }

  .range-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px 14px;
  }

  .range-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 0.8rem;
    color: var(--secondary-text-color, var(--primary-text-color));
  }

  .color-row {
    display: flex;
    flex-wrap: wrap;
    gap: 12px 20px;
  }

  .color-field {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 0.875rem;
  }

  .color-field input[type="color"] {
    width: 2.25rem;
    height: 2.25rem;
    padding: 2px;
    border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.2));
    border-radius: 8px;
    background: transparent;
    cursor: pointer;
  }

  .entity-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .entity-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .entity-label {
    font-size: 0.8rem;
    font-weight: 500;
    color: var(--secondary-text-color, var(--primary-text-color));
    text-transform: capitalize;
  }

  .entity-field .field-input {
    font-family: var(--code-font-family, ui-monospace, monospace);
    font-size: 0.8rem;
  }
`, J = {
	show_glucose: !0,
	show_time_ago: !0,
	show_delta: !0,
	show_iob: !0,
	show_cob: !0,
	font_size: 48,
	urgent_low: 70,
	urgent_high: 200,
	low: 85,
	high: 170,
	color_urgent: "#e74c3c",
	color_warning: "#f39c12",
	color_ok: "#2ecc71"
}, Te = {
	DoubleUp: "⇈",
	SingleUp: "↑",
	FortyFiveUp: "↗",
	Flat: "→",
	FortyFiveDown: "↘",
	SingleDown: "↓",
	DoubleDown: "⇊",
	"NOT COMPUTABLE": "?",
	"RATE OUT OF RANGE": "⚠"
};
function Ee(e, t = Date.now()) {
	let n = t - new Date(e).getTime();
	if (n < 0) return "just now";
	let r = Math.floor(n / 6e4);
	if (r < 1) return "just now";
	if (r === 1) return "1 min ago";
	if (r < 60) return `${r} min ago`;
	let i = Math.floor(r / 60);
	return i === 1 ? "1 hour ago" : `${i} hours ago`;
}
function De(e, t) {
	return e < t.urgent_low || e > t.urgent_high ? t.color_urgent : e < t.low || e > t.high ? t.color_warning : t.color_ok;
}
//#endregion
//#region \0@oxc-project+runtime@0.130.0/helpers/decorate.js
function Y(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/nightscout-card-editor.ts
var Oe = [
	"glucose",
	"delta",
	"iob",
	"cob",
	"last_reading"
], X = "nightscout", ke = {
	glucose: "Glucose",
	delta: "Delta",
	iob: "IOB",
	cob: "COB",
	last_reading: "Last reading"
}, Ae = [
	["show_glucose", "Glucose"],
	["show_time_ago", "Time ago"],
	["show_delta", "Delta"],
	["show_iob", "IOB"],
	["show_cob", "COB"]
], Z = class extends G {
	constructor(...e) {
		super(...e), this._config = {
			type: "custom:nightscout-card",
			...J
		}, this._registryCache = null, this._registryReady = !1;
	}
	static {
		this.styles = we;
	}
	setConfig(e) {
		this._config = {
			...J,
			...e,
			type: "custom:nightscout-card"
		};
	}
	async firstUpdated() {
		try {
			await this._loadEntityRegistry();
		} catch (e) {
			console.warn("Nightscout card: could not load entity registry", e);
		} finally {
			this._registryReady = !0;
		}
	}
	_fireChanged() {
		this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: this._config },
			bubbles: !0,
			composed: !0
		}));
	}
	_entitiesFromHass() {
		return this.hass?.entities ? Object.values(this.hass.entities).filter((e) => e.platform === X && e.device_id).map((e) => ({
			entity_id: e.entity_id,
			device_id: e.device_id,
			platform: e.platform,
			unique_id: e.unique_id ?? ""
		})) : [];
	}
	async _loadEntityRegistry() {
		if (this._registryCache) return this._registryCache;
		let e = this._entitiesFromHass();
		if (e.length > 0) return this._registryCache = e, e;
		let t = await this.hass.callWS({ type: "config/entity_registry/list" });
		return this._registryCache = t, t;
	}
	_discoverNightscoutSites(e) {
		let t = /* @__PURE__ */ new Map();
		for (let n of e) n.platform !== X || !n.device_id || !n.entity_id.endsWith("_glucose") && !n.unique_id.endsWith("_glucose") || t.set(n.device_id, n);
		let n = [];
		for (let [e, r] of t) {
			let t = this.hass.devices?.[e], i = t?.name_by_user || t?.name || r.entity_id.replace(/^sensor\./, "").replace(/_glucose$/, "");
			n.push({
				deviceId: e,
				label: i
			});
		}
		return n.sort((e, t) => e.label.localeCompare(t.label));
	}
	_applyDeviceEntities(e, t) {
		let n = t.filter((t) => t.device_id === e && t.platform === X), r = {};
		for (let e of Oe) {
			let t = n.find((t) => t.entity_id.endsWith(`_${e}`) || t.unique_id.endsWith(`_${e}`));
			t && (r[`${e}_entity`] = t.entity_id);
		}
		return r;
	}
	async _deviceChanged(e) {
		let t = e.target.value;
		if (this._config = {
			...this._config,
			device_id: t || void 0
		}, !t) {
			this._fireChanged();
			return;
		}
		try {
			let e = await this._loadEntityRegistry();
			this._config = {
				...this._config,
				...this._applyDeviceEntities(t, e)
			};
		} catch (e) {
			console.warn("Nightscout card: could not map entities for device", e);
		}
		this._fireChanged();
	}
	_toggleChanged(e, t) {
		let n = t.target.checked;
		this._config = {
			...this._config,
			[e]: n
		}, this._fireChanged();
	}
	_numberChanged(e, t) {
		let n = Number(t.target.value);
		isNaN(n) || (this._config = {
			...this._config,
			[e]: n
		}, this._fireChanged());
	}
	_colorChanged(e, t) {
		let n = t.target.value;
		this._config = {
			...this._config,
			[e]: n
		}, this._fireChanged();
	}
	_textChanged(e, t) {
		let n = t.target.value;
		this._config = {
			...this._config,
			[e]: n
		}, this._fireChanged();
	}
	_renderSitePicker(e, t) {
		return this._registryReady ? e.length === 0 ? F`<p class="hint" data-testid="device-picker-empty">
        No Nightscout devices found. Add the integration under Settings → Devices, then reopen this
        editor.
      </p>` : F`
      <select
        class="field-select"
        data-testid="device-picker"
        .value=${t || ""}
        @change=${this._deviceChanged}
      >
        <option value="">Select a site</option>
        ${e.map((e) => F`
            <option value=${e.deviceId} ?selected=${t === e.deviceId}>
              ${e.label}
            </option>
          `)}
      </select>
    ` : F`<p class="hint" data-testid="device-picker-loading">Loading sites…</p>`;
	}
	render() {
		if (!this.hass) return F`<div class="editor" data-testid="editor">Loading…</div>`;
		let e = this._config, t = this._registryCache ?? this._entitiesFromHass(), n = this._discoverNightscoutSites(t);
		return F`
      <div class="editor" data-testid="editor">
        <section class="panel">
          <h3 class="panel-title">Nightscout site</h3>
          ${this._renderSitePicker(n, e.device_id)}
        </section>

        <section class="panel">
          <h3 class="panel-title">Visible fields</h3>
          <div class="checkbox-grid">
            ${Ae.map(([t, n]) => F`
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    data-testid="toggle-${t}"
                    .checked=${e[t] !== !1}
                    @change=${(e) => this._toggleChanged(t, e)}
                  />
                  ${n}
                </label>
              `)}
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Font size</h3>
          <div class="slider-row">
            <input
              type="range"
              data-testid="font-size"
              min="20"
              max="72"
              .value=${String(e.font_size)}
              @input=${(e) => this._numberChanged("font_size", e)}
            />
            <span class="slider-value" data-testid="font-size-value">${e.font_size}px</span>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Glucose ranges (mg/dL)</h3>
          <div class="range-grid">
            <label class="range-field">
              Urgent low
              <input
                type="number"
                class="field-number"
                data-testid="urgent-low"
                .value=${String(e.urgent_low)}
                @change=${(e) => this._numberChanged("urgent_low", e)}
              />
            </label>
            <label class="range-field">
              Low
              <input
                type="number"
                class="field-number"
                data-testid="low"
                .value=${String(e.low)}
                @change=${(e) => this._numberChanged("low", e)}
              />
            </label>
            <label class="range-field">
              High
              <input
                type="number"
                class="field-number"
                data-testid="high"
                .value=${String(e.high)}
                @change=${(e) => this._numberChanged("high", e)}
              />
            </label>
            <label class="range-field">
              Urgent high
              <input
                type="number"
                class="field-number"
                data-testid="urgent-high"
                .value=${String(e.urgent_high)}
                @change=${(e) => this._numberChanged("urgent_high", e)}
              />
            </label>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Colors</h3>
          <div class="color-row">
            <label class="color-field">
              Urgent
              <input
                type="color"
                data-testid="color-urgent"
                .value=${e.color_urgent}
                @input=${(e) => this._colorChanged("color_urgent", e)}
              />
            </label>
            <label class="color-field">
              Warning
              <input
                type="color"
                data-testid="color-warning"
                .value=${e.color_warning}
                @input=${(e) => this._colorChanged("color_warning", e)}
              />
            </label>
            <label class="color-field">
              OK
              <input
                type="color"
                data-testid="color-ok"
                .value=${e.color_ok}
                @input=${(e) => this._colorChanged("color_ok", e)}
              />
            </label>
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Entity overrides</h3>
          <p class="hint">Filled automatically when you select a site. Edit only if needed.</p>
          <div class="entity-list">
            ${Oe.map((t) => F`
                <div class="entity-field">
                  <span class="entity-label">${ke[t]}</span>
                  <input
                    type="text"
                    class="field-input"
                    data-testid="entity-${t}"
                    .value=${e[`${t}_entity`] || ""}
                    @change=${(e) => this._textChanged(`${t}_entity`, e)}
                    placeholder="sensor.example_${t}"
                  />
                </div>
              `)}
          </div>
        </section>

        <section class="panel">
          <h3 class="panel-title">Background</h3>
          <div class="entity-field">
            <span class="entity-label">Card background</span>
            <input
              type="text"
              class="field-input"
              data-testid="background-color"
              .value=${e.background_color || ""}
              @change=${(e) => this._textChanged("background_color", e)}
              placeholder="Leave empty for theme default"
            />
          </div>
        </section>
      </div>
    `;
	}
};
Y([K({ attribute: !1 })], Z.prototype, "hass", void 0), Y([q()], Z.prototype, "_config", void 0), Y([q()], Z.prototype, "_registryCache", void 0), Y([q()], Z.prototype, "_registryReady", void 0), Z = Y([be("nightscout-card-editor")], Z);
//#endregion
//#region src/nightscout-card.ts
var Q = class extends G {
	constructor(...e) {
		super(...e), this._blinking = !1, this._prevGlucose = null, this._now = Date.now();
	}
	static {
		this.styles = Ce;
	}
	static getConfigElement() {
		return document.createElement("nightscout-card-editor");
	}
	static getStubConfig() {
		return { ...J };
	}
	setConfig(e) {
		this._config = {
			...J,
			...e
		};
	}
	getCardSize() {
		return 2;
	}
	connectedCallback() {
		super.connectedCallback(), this._timeAgoInterval = setInterval(() => {
			this._now = Date.now();
		}, 15e3);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._timeAgoInterval && clearInterval(this._timeAgoInterval), this._blinkTimeout && clearTimeout(this._blinkTimeout);
	}
	updated(e) {
		if (super.updated(e), !e.has("hass") || !this._config?.glucose_entity) return;
		let t = this.hass?.states[this._config.glucose_entity], n = t?.state ?? null;
		this._prevGlucose !== null && n !== this._prevGlucose && this._triggerBlink(t), this._prevGlucose = n;
	}
	_triggerBlink(e) {
		if (!e) return;
		let t = e.attributes.raw_mgdl;
		if (t == null) return;
		let n = this._getGlucoseColor(t), r = this.shadowRoot?.querySelector("ha-card");
		r && (this._blinkTimeout && clearTimeout(this._blinkTimeout), r.style.setProperty("--blink-color", n), r.classList.remove("blink"), r.offsetWidth, r.classList.add("blink"), this._blinking = !0, this._blinkTimeout = setTimeout(() => {
			r.classList.remove("blink"), this._blinking = !1;
		}, 2e3));
	}
	_getGlucoseColor(e) {
		return De(e, this._config);
	}
	_getValueColor() {
		if (!this._config?.glucose_entity) return;
		let e = this.hass?.states[this._config.glucose_entity];
		if (!e) return;
		let t = e.attributes.raw_mgdl;
		if (t != null) return this._getGlucoseColor(t);
	}
	render() {
		if (!this._config || !this.hass) return F`<ha-card
        ><div class="ns-not-available" data-testid="not-configured">
          Nightscout card not configured
        </div></ha-card
      >`;
		let e = this._config, t = e.glucose_entity ? this.hass.states[e.glucose_entity] : void 0, n = e.delta_entity ? this.hass.states[e.delta_entity] : void 0, r = e.iob_entity ? this.hass.states[e.iob_entity] : void 0, i = e.cob_entity ? this.hass.states[e.cob_entity] : void 0, a = e.last_reading_entity ? this.hass.states[e.last_reading_entity] : void 0, o = t?.state, s = t?.attributes.direction, c = s ? Te[s] ?? s : "", l = n?.state, u = n?.attributes.unit_of_measurement, d = r?.state, f = i?.state, p = this._getValueColor(), m = e.font_size, h = Math.round(m * .45), g = Math.round(m * .35), ee = e.background_color ? `background-color: ${e.background_color}` : "";
		return this._now, F`
      <ha-card style="${ee}">
        <div class="ns-row">
          ${e.show_glucose && o != null ? F`<span
                class="ns-glucose"
                data-testid="glucose-value"
                style="font-size:${m}px; color:${p ?? "inherit"}"
                >${o}</span
              >` : L}
          ${e.show_glucose && c ? F`<span
                class="ns-arrow"
                data-testid="direction-arrow"
                style="font-size:${Math.round(m * .6)}px; color:${p ?? "inherit"}"
                >${c}</span
              >` : L}
          ${e.show_delta && l != null ? F`<span
                class="ns-secondary"
                data-testid="delta"
                style="font-size:${h}px"
                >Δ
                ${Number(l) >= 0 ? "+" : ""}${l}${u ? ` ${u}` : ""}</span
              >` : L}
          ${e.show_iob && d != null ? F`<span class="ns-secondary" data-testid="iob" style="font-size:${h}px"
                ><span class="ns-label">IOB</span>${d}</span
              >` : L}
          ${e.show_cob && f != null ? F`<span class="ns-secondary" data-testid="cob" style="font-size:${h}px"
                ><span class="ns-label">COB</span>${f}</span
              >` : L}
        </div>
        ${e.show_time_ago && a ? F`<div class="ns-time-ago" data-testid="time-ago" style="font-size:${g}px">
              ${Ee(a.state)}
            </div>` : L}
      </ha-card>
    `;
	}
};
Y([K({ attribute: !1 })], Q.prototype, "hass", void 0), Y([q()], Q.prototype, "_config", void 0), Y([q()], Q.prototype, "_blinking", void 0), Y([q()], Q.prototype, "_now", void 0), Q = Y([be("nightscout-card")], Q);
var $ = window;
$.customCards = $.customCards || [], $.customCards.push({
	type: "nightscout-card",
	name: "Nightscout",
	description: "Glucose monitoring card for Nightscout"
});
//#endregion
export { Q as NightscoutCard };
