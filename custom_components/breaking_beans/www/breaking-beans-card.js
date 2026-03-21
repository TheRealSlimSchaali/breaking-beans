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
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: ee, getOwnPropertySymbols: te, getPrototypeOf: ne } = Object, f = globalThis, p = f.trustedTypes, re = p ? p.emptyScript : "", ie = f.reactiveElementPolyfillSupport, m = (e, t) => e, h = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? re : null;
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
}, g = (e, t) => !l(e, t), _ = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	useDefault: !1,
	hasChanged: g
};
Symbol.metadata ??= Symbol("metadata"), f.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var v = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = _) {
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
		return this.elementProperties.get(e) ?? _;
	}
	static _$Ei() {
		if (this.hasOwnProperty(m("elementProperties"))) return;
		let e = ne(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(m("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(m("properties"))) {
			let e = this.properties, t = [...ee(e), ...te(e)];
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
			let i = (n.converter?.toAttribute === void 0 ? h : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? h : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? g)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[m("elementProperties")] = /* @__PURE__ */ new Map(), v[m("finalized")] = /* @__PURE__ */ new Map(), ie?.({ ReactiveElement: v }), (f.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var y = globalThis, b = (e) => e, x = y.trustedTypes, S = x ? x.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, C = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, ae = "?" + w, oe = `<${ae}>`, T = document, E = () => T.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", O = Array.isArray, se = (e) => O(e) || typeof e?.[Symbol.iterator] == "function", k = "[ 	\n\f\r]", A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, j = /-->/g, M = />/g, N = RegExp(`>|${k}(?:([^\\s"'>=/]+)(${k}*=${k}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), P = /'/g, F = /"/g, I = /^(?:script|style|textarea|title)$/i, L = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), R = Symbol.for("lit-noChange"), z = Symbol.for("lit-nothing"), B = /* @__PURE__ */ new WeakMap(), V = T.createTreeWalker(T, 129);
function H(e, t) {
	if (!O(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return S === void 0 ? t : S.createHTML(t);
}
var ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === A ? c[1] === "!--" ? o = j : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = N) : (I.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = N) : o = M : o === N ? c[0] === ">" ? (o = i ?? A, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? N : c[3] === "\"" ? F : P) : o === F || o === P ? o = N : o === j || o === M ? o = A : (o = N, i = void 0);
		let d = o === N && e[t + 1].startsWith("/>") ? " " : "";
		a += o === A ? n + oe : l >= 0 ? (r.push(s), n.slice(0, l) + C + n.slice(l) + w + d) : n + w + (l === -2 ? t : d);
	}
	return [H(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, U = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ce(t, n);
		if (this.el = e.createElement(l, r), V.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = V.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(C)) {
					let t = u[o++], n = i.getAttribute(e).split(w), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? ue : r[1] === "?" ? de : r[1] === "@" ? fe : K
					}), i.removeAttribute(e);
				} else e.startsWith(w) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (I.test(i.tagName)) {
					let e = i.textContent.split(w), t = e.length - 1;
					if (t > 0) {
						i.textContent = x ? x.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], E()), V.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], E());
					}
				}
			} else if (i.nodeType === 8) if (i.data === ae) c.push({
				type: 2,
				index: a
			});
			else {
				let e = -1;
				for (; (e = i.data.indexOf(w, e + 1)) !== -1;) c.push({
					type: 7,
					index: a
				}), e += w.length - 1;
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = T.createElement("template");
		return n.innerHTML = e, n;
	}
};
function W(e, t, n = e, r) {
	if (t === R) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = D(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = W(e, i._$AS(e, t.values), i, r)), t;
}
var le = class {
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
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? T).importNode(t, !0);
		V.currentNode = r;
		let i = V.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new G(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new pe(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = V.nextNode(), a++);
		}
		return V.currentNode = T, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, G = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = z, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
		e = W(this, e, t), D(e) ? e === z || e == null || e === "" ? (this._$AH !== z && this._$AR(), this._$AH = z) : e !== this._$AH && e !== R && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? se(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== z && D(this._$AH) ? this._$AA.nextSibling.data = e : this.T(T.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = U.createElement(H(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new le(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = B.get(e.strings);
		return t === void 0 && B.set(e.strings, t = new U(e)), t;
	}
	k(t) {
		O(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(E()), this.O(E()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = b(e).nextSibling;
			b(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, K = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = z, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = z;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = W(this, e, t, 0), a = !D(e) || e !== this._$AH && e !== R, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = W(this, r[n + o], t, o), s === R && (s = this._$AH[o]), a ||= !D(s) || s !== this._$AH[o], s === z ? e = z : e !== z && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === z ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, ue = class extends K {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === z ? void 0 : e;
	}
}, de = class extends K {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== z);
	}
}, fe = class extends K {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = W(this, e, t, 0) ?? z) === R) return;
		let n = this._$AH, r = e === z && n !== z || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== z && (n === z || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, pe = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		W(this, e);
	}
}, me = y.litHtmlPolyfillSupport;
me?.(U, G), (y.litHtmlVersions ??= []).push("3.3.2");
var he = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new G(t.insertBefore(E(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, q = globalThis, J = class extends v {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = he(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return R;
	}
};
J._$litElement$ = !0, J.finalized = !0, q.litElementHydrateSupport?.({ LitElement: J });
var ge = q.litElementPolyfillSupport;
ge?.({ LitElement: J }), (q.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region node_modules/@lit/reactive-element/decorators/custom-element.js
var _e = (e) => (t, n) => {
	n === void 0 ? customElements.define(e, t) : n.addInitializer(() => {
		customElements.define(e, t);
	});
}, ve = {
	attribute: !0,
	type: String,
	converter: h,
	reflect: !1,
	hasChanged: g
}, ye = (e = ve, t, n) => {
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
function Y(e) {
	return (t, n) => typeof n == "object" ? ye(e, t, n) : ((e, t, n) => {
		let r = t.hasOwnProperty(n);
		return t.constructor.createProperty(n, e), r ? Object.getOwnPropertyDescriptor(t, n) : void 0;
	})(e, t, n);
}
//#endregion
//#region node_modules/@lit/reactive-element/decorators/state.js
function X(e) {
	return Y({
		...e,
		state: !0,
		attribute: !1
	});
}
//#endregion
//#region \0@oxc-project+runtime@0.115.0/helpers/decorate.js
function Z(e, t, n, r) {
	var i = arguments.length, a = i < 3 ? t : r === null ? r = Object.getOwnPropertyDescriptor(t, n) : r, o;
	if (typeof Reflect == "object" && typeof Reflect.decorate == "function") a = Reflect.decorate(e, t, n, r);
	else for (var s = e.length - 1; s >= 0; s--) (o = e[s]) && (a = (i < 3 ? o(a) : i > 3 ? o(t, n, a) : o(t, n)) || a);
	return i > 3 && a && Object.defineProperty(t, n, a), a;
}
//#endregion
//#region src/breaking-beans-predictor-card.ts
var Q = class extends J {
	constructor(...e) {
		super(...e), this._selected_batch = "", this._selected_person = "", this._prediction = null, this._loading = !1;
	}
	setConfig(e) {
		if (!e) throw Error("Invalid configuration");
		this.config = e;
	}
	shouldUpdate(e) {
		return e.has("hass") ? !0 : super.shouldUpdate(e);
	}
	_getEntities(e) {
		return this.hass ? Object.keys(this.hass.states).filter((t) => this.hass.states[t].attributes.integration === "breaking_beans" && e.some((e) => t.endsWith(e))).map((e) => this.hass.states[e]) : [];
	}
	_getCleanName(e, t) {
		if (!e) return "";
		let n = e.attributes.friendly_name || e.entity_id;
		for (let e of t) n = n.replace(e, "");
		return n.trim();
	}
	_getInternalId(e, t) {
		if (!e) return "";
		let n = this.hass.states[e];
		if (n && n.attributes.internal_id) return n.attributes.internal_id;
		let r = e.split("."), i = r[r.length - 1].replace("_remaining", "").replace("_verbleibend", "");
		return i.startsWith(t) ? i : t + i;
	}
	async _getPrediction() {
		this._loading = !0, this._prediction = null;
		let e = this._getEntities(["_remaining", "_verbleibend"]).filter((e) => parseFloat(e.state) > 0), t = this._selected_batch || e[0]?.entity_id || "", n = this._selected_person || "Guest", r = this._getInternalId(t, "batch_");
		if (!r) {
			this._loading = !1;
			return;
		}
		try {
			this._prediction = await this.hass.connection.sendMessagePromise({
				type: "breaking_beans/get_prediction",
				batch_id: r,
				person: n
			});
		} catch (e) {
			console.error("Prediction failed: ", e);
		}
		this._loading = !1;
	}
	render() {
		if (!this.hass) return L`<p>Loading...</p>`;
		let e = this._getEntities(["_remaining", "_verbleibend"]).filter((e) => parseFloat(e.state) > 0), t = Object.keys(this.hass.states).filter((e) => e.startsWith("person.")).map((e) => this.hass.states[e]);
		return L`
      <ha-card>
        <div class="card-content">
          <div class="header">
             <ha-icon icon="mdi:lightbulb-on"></ha-icon>
             <span class="title">Shot Predictor</span>
          </div>

          <div class="form-grid">
            <div class="native-select-wrapper">
                <label>Person</label>
                <select @change=${(e) => {
			this._selected_person = e.target.value, this._prediction = null;
		}} .value=${this._selected_person || "Guest"}>
                    <option value="Guest">Guest</option>
                    ${t.map((e) => L`<option value="${e.attributes.friendly_name || e.entity_id}">${e.attributes.friendly_name || e.entity_id}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>Batch</label>
                <select @change=${(e) => {
			this._selected_batch = e.target.value, this._prediction = null;
		}} .value=${this._selected_batch || e[0]?.entity_id || ""}>
                    ${e.map((e) => L`<option value="${e.entity_id}">${this._getCleanName(e, [" Verbleibend", " Remaining"])}</option>`)}
                </select>
            </div>
          </div>

          <ha-button raised @click=${this._getPrediction} ?disabled=${this._loading} style="margin-top:20px; width:100%;">
            ${this._loading ? "Predicting..." : "Get Recommendation"}
          </ha-button>

          ${this._prediction ? this._renderPrediction() : ""}
        </div>
      </ha-card>
    `;
	}
	_renderPrediction() {
		return this._prediction.status === "insufficient_data" ? L`
            <div class="result-box empty">
                Not enough past shots for this bean and person to make a prediction.
            </div>
          ` : L`
        <div class="result-box">
            <div class="stats-row">
                <div class="stat"><span class="label">Setting</span><span class="value main">${this._prediction.suggested_setting}</span></div>
                <div class="stat"><span class="label">Dose</span><span class="value">${this._prediction.suggested_dose}g</span></div>
                <div class="stat"><span class="label">Yield</span><span class="value">${this._prediction.suggested_yield}g</span></div>
            </div>
            <div class="meta-row">
                <small>Based on last ${this._prediction.shots_analyzed} shots (Avg Rating: ${this._prediction.avg_rating}★)</small>
                ${Math.abs(this._prediction.age_adjustment) > .01 ? L`<small style="color:var(--warning-color)">Age Adjust: ${this._prediction.age_adjustment}</small>` : ""}
            </div>
        </div>
      `;
	}
	static {
		this.styles = o`
    ha-card {
      background: var(--card-background-color, #fff);
      padding: 16px;
      border-radius: 12px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2));
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .header ha-icon {
      color: #f39c12;
      --mdc-icon-size: 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
    }
    .native-select-wrapper {
        display: flex;
        flex-direction: column;
    }
    .native-select-wrapper label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        padding-left: 2px;
    }
    .native-select-wrapper select {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        appearance: none;
        outline: none;
    }
    .native-select-wrapper select:focus {
        border-color: var(--primary-color);
    }
    ha-button { --mdc-theme-primary: #6F4E37; }

    .result-box {
        margin-top: 20px;
        background: var(--secondary-background-color);
        padding: 16px;
        border-radius: 8px;
        border-left: 4px solid #f39c12;
    }
    .result-box.empty { border-left-color: var(--error-color, #e74c3c); }
    .stats-row {
        display: flex;
        justify-content: space-around;
        margin-bottom: 12px;
    }
    .stat {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
    }
    .stat .label { font-size: 11px; text-transform: uppercase; color: var(--secondary-text-color); }
    .stat .value { font-size: 18px; font-weight: bold; color: var(--primary-text-color); }
    .stat .value.main { font-size: 24px; color: #6F4E37; }
    .meta-row {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2px;
        border-top: 1px solid var(--divider-color);
        padding-top: 8px;
    }
  `;
	}
};
Z([Y({ attribute: !1 })], Q.prototype, "hass", void 0), Z([Y({ attribute: !1 })], Q.prototype, "config", void 0), Z([X()], Q.prototype, "_selected_batch", void 0), Z([X()], Q.prototype, "_selected_person", void 0), Z([X()], Q.prototype, "_prediction", void 0), Z([X()], Q.prototype, "_loading", void 0), Q = Z([_e("breaking-beans-predictor-card")], Q);
//#endregion
//#region src/breaking-beans-card.ts
var $ = class extends J {
	constructor(...e) {
		super(...e), this._selected_batch = "", this._selected_grinder = "", this._selected_machine = "", this._dose = 18, this._yield = 36, this._time = 28, this._grinder_setting = 10, this._rating = 3, this._acidity = 3, this._bitterness = 3, this._selected_person = "", this._drink_type = "Espresso (Double)", this._edit_mode = !1, this._edit_brew_id = "", this._coffeeTypes = [
			"Espresso (Single)",
			"Espresso (Double)",
			"Ristretto",
			"Lungo",
			"Americano",
			"Long Black",
			"Café Crème (Schümli)",
			"Cappuccino",
			"Flat White",
			"Latte Macchiato",
			"Espresso Macchiato",
			"Mokka",
			"French Press",
			"n/a"
		], this._translations = {
			en: {
				inventory: "Inventory",
				quick_log: "Quick Log Brew",
				batch: "Batch",
				grinder: "Grinder",
				machine: "Machine",
				dose: "Dose (g)",
				yield: "Yield (g)",
				time: "Time (s)",
				setting: "Setting",
				log: "Log Shot",
				logged: "Shot logged!",
				acidity: "Acidity (1-5)",
				bitterness: "Bitterness (1-5)",
				rating_1: "Not enough",
				rating_3: "Good",
				rating_5: "Too much",
				person: "Person",
				guest: "Guest",
				deplete: "Deplete",
				rating_ovrl: "Rating (Ovrl.)"
			},
			de: {
				inventory: "Bestand",
				quick_log: "Bezug dokumentieren",
				batch: "Charge",
				grinder: "Mühle",
				machine: "Maschine",
				dose: "Menge In (g)",
				yield: "Menge Out (g)",
				time: "Zeit (s)",
				setting: "Mahlgrad",
				log: "Speichern",
				logged: "Bezug gespeichert!",
				acidity: "Säure (1-5)",
				bitterness: "Bitterkeit (1-5)",
				rating_1: "Zu Milde",
				rating_3: "Gut",
				rating_5: "Zu Stark",
				person: "Person",
				guest: "Gast",
				deplete: "Leeren",
				rating_ovrl: "Bewertung (Gesamt)"
			},
			fr: {
				inventory: "Inventaire",
				quick_log: "Enregistrer un café",
				batch: "Lot",
				grinder: "Moulin",
				machine: "Machine",
				dose: "Dose (g)",
				yield: "Rendement (g)",
				time: "Temps (s)",
				setting: "Réglage",
				log: "Enregistrer",
				logged: "Café enregistré !"
			},
			it: {
				inventory: "Inventario",
				quick_log: "Registra caffè",
				batch: "Lotto",
				grinder: "Macinacaffè",
				machine: "Macchina",
				dose: "Dose (g)",
				yield: "Resa (g)",
				time: "Tempo (s)",
				setting: "Macinatura",
				log: "Registra",
				logged: "Caffè registrato!"
			}
		};
	}
	_t(e) {
		let t = this.hass?.language || "en";
		return (this._translations[t.split("-")[0]] || this._translations.en)[e] || e;
	}
	setConfig(e) {
		if (!e) throw Error("Invalid configuration");
		this.config = e;
	}
	shouldUpdate(e) {
		return e.has("hass") ? !0 : super.shouldUpdate(e);
	}
	render() {
		if (!this.hass) return L`<p>Loading...</p>`;
		let e = this._getEntities(["_remaining", "_verbleibend"]).filter((e) => parseFloat(e.state) > 0), t = this._getEntities([
			"_maintenance",
			"_durchsatz",
			"_throughput",
			"_throughput_kg"
		]), n = this._getEntities([
			"_maintenance",
			"_gesamtbezuge",
			"_total_shots"
		]), r = Object.values(this.hass.states).find((e) => e.attributes.integration === "breaking_beans" && e.attributes.history)?.attributes?.history || [];
		return L`
      <ha-card>
        <div class="card-content">
          <div class="header">
             <ha-icon icon="mdi:coffee-beans"></ha-icon>
             <span class="title">Breaking Beans</span>
          </div>
          <div class="section-title">${this._t("inventory")}</div>
          ${this._renderInventory(e)}
          <div class="section-title">${this._t("quick_log")}</div>
          ${this._renderBrewForm(e, t, n)}
          ${r.length > 0 ? L`
            <div class="section-title">History</div>
            <div class="history-table">
               ${[...r].reverse().slice(0, 5).map((e) => {
			let t = "Unknown";
			if (e.timestamp) {
				let n = new Date(e.timestamp);
				isNaN(n.getTime()) || (t = n.toLocaleDateString([], {
					day: "numeric",
					month: "short"
				}));
			}
			return L`
                 <div class="history-item">
                   <div class="hist-header">
                     <div class="hist-title">
                       <span class="hist-type">${e.drink_type && e.drink_type !== "n/a" ? e.drink_type : "Espresso"}</span>
                       <span class="hist-date">${t}</span>
                     </div>
                     <div class="hist-rating">
                       <span class="rating">${"★".repeat(e.rating || 0)}</span>
                     </div>
                   </div>
                   
                   <div class="hist-bean">
                     ${e.bean_name || "Coffee"} <span class="hist-person">by ${e.person || "Unknown"}</span>
                   </div>
                   
                   <div class="hist-metrics">
                     <div class="metric-chip">
                       <ha-icon icon="mdi:scale"></ha-icon>
                       ${parseFloat(e.dose || 0).toFixed(1)}g ➔ ${parseFloat(e.yield || 0).toFixed(1)}g
                     </div>
                     <div class="metric-chip">
                       <ha-icon icon="mdi:timer-outline"></ha-icon>
                       ${e.time}s
                     </div>
                     <div class="metric-chip">
                       <ha-icon icon="mdi:cog-outline"></ha-icon>
                       ${e.grinder_setting}
                     </div>
                     <div class="metric-chip" title="Acidity">
                       <ha-icon icon="mdi:fruit-citrus"></ha-icon>
                       ${e.acidity || 3}
                     </div>
                     <div class="metric-chip" title="Bitterness">
                       <ha-icon icon="mdi:tree-outline"></ha-icon>
                       ${e.bitterness || 3}
                     </div>
                   </div>
                   
                   <div class="hist-actions">
                     <ha-icon-button title="Edit" @click=${() => this._editBrew(e)}>
                       <ha-icon icon="mdi:pencil"></ha-icon>
                     </ha-icon-button>
                     <ha-icon-button title="Delete (Return Beans)" @click=${() => this._deleteBrew(e.id, !0)}>
                       <ha-icon icon="mdi:delete-restore"></ha-icon>
                     </ha-icon-button>
                     <ha-icon-button title="Delete (Permanent)" @click=${() => this._deleteBrew(e.id, !1)}>
                       <ha-icon icon="mdi:delete"></ha-icon>
                     </ha-icon-button>
                   </div>
                 </div>
               `;
		})}
            </div>
          ` : ""}
        </div>
      </ha-card>
    `;
	}
	_getEntities(e) {
		return Object.keys(this.hass.states).filter((t) => this.hass.states[t].attributes.integration === "breaking_beans" && e.some((e) => t.endsWith(e))).map((e) => this.hass.states[e]);
	}
	_getCleanName(e, t) {
		if (!e) return "";
		let n = e.attributes.friendly_name || e.entity_id;
		for (let e of t) n = n.replace(e, "");
		return n.trim();
	}
	_getInternalId(e, t) {
		if (!e) return "";
		let n = this.hass.states[e];
		if (n && n.attributes.internal_id) return n.attributes.internal_id;
		let r = e.split("."), i = r[r.length - 1].replace("_remaining", "").replace("_verbleibend", "").replace("_maintenance", "").replace("_durchsatz", "").replace("_gesamtbezuge", "");
		return i.startsWith(t) ? i : t + i;
	}
	async _deleteBrew(e, t) {
		e && confirm(`Delete this brew${t ? " AND return the beans to stock" : ""}?`) && await this.hass.callService("breaking_beans", "delete_brew", {
			brew_id: e,
			return_beans: t
		});
	}
	async _depleteBatch(e) {
		confirm("Are you sure you want to mark this batch as completely empty?") && await this.hass.callService("breaking_beans", "deplete_batch", { batch_id: this._getInternalId(e, "batch_") });
	}
	_editBrew(e) {
		this._edit_mode = !0, this._edit_brew_id = e.id, this._dose = parseFloat(e.dose) || 18, this._yield = parseFloat(e.yield) || 36, this._time = parseInt(e.time) || 28, this._grinder_setting = parseFloat(e.grinder_setting) || 10, this._rating = parseInt(e.rating) || 3, this._acidity = parseInt(e.acidity) || 3, this._bitterness = parseInt(e.bitterness) || 3, this._drink_type = e.drink_type && e.drink_type !== "n/a" ? e.drink_type : "Espresso (Double)";
		let t = this._getEntities(["_remaining", "_verbleibend"]).find((t) => this._getInternalId(t.entity_id, "batch_") === e.batch_id);
		t && (this._selected_batch = t.entity_id);
		let n = this._getEntities([
			"_maintenance",
			"_durchsatz",
			"_throughput",
			"_throughput_kg"
		]).find((t) => this._getInternalId(t.entity_id, "grinder_") === e.grinder_id);
		n && (this._selected_grinder = n.entity_id);
		let r = this._getEntities([
			"_maintenance",
			"_gesamtbezuge",
			"_total_shots"
		]).find((t) => this._getInternalId(t.entity_id, "machine_") === e.machine_id);
		r && (this._selected_machine = r.entity_id), this._selected_person = e.person || "";
		let i = this.shadowRoot?.querySelector(".brew-form");
		i && i.scrollIntoView({
			behavior: "smooth",
			block: "start"
		});
	}
	_cancelEdit() {
		this._edit_mode = !1, this._edit_brew_id = "";
	}
	_renderInventory(e) {
		return e.length === 0 ? L`<p>No active beans found.</p>` : L`
      <div class="inventory">
        ${e.map((e) => {
			let t = this._getCleanName(e, [" Verbleibend", " Remaining"]), n = e.state;
			return L`
            <div class="batch-item">
              <div class="batch-info">
                <span class="batch-name">${t}</span>
                <span class="batch-weight">${n}${e.attributes.unit_of_measurement || "g"}</span>
              </div>
              <ha-progressbar .value=${Math.min(1, parseFloat(n) / 250)}></ha-progressbar>
              <div class="batch-actions" style="margin-top: 4px; text-align: right;">
                 <a href="#" @click=${(t) => {
				t.preventDefault(), this._depleteBatch(e.entity_id);
			}} style="font-size: 11px; color: var(--secondary-text-color);">${this._t("deplete")}</a>
              </div>
            </div>
          `;
		})}
      </div>
    `;
	}
	_renderBrewForm(e, t, n) {
		let r = Object.keys(this.hass.states).filter((e) => e.startsWith("person.")).map((e) => this.hass.states[e]);
		return L`
      <div class="brew-form">
        <div class="form-grid">
            <div class="native-select-wrapper">
                <label>${this._t("batch")}</label>
                <select @change=${(e) => this._selected_batch = e.target.value} .value=${this._selected_batch || e[0]?.entity_id || ""}>
                    ${e.map((e) => L`<option value="${e.entity_id}">${this._getCleanName(e, [" Verbleibend", " Remaining"])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t("grinder")}</label>
                <select @change=${(e) => this._selected_grinder = e.target.value} .value=${this._selected_grinder || t[0]?.entity_id || ""}>
                    ${t.map((e) => L`<option value="${e.entity_id}">${this._getCleanName(e, [" Durchsatz", " Throughput"])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t("machine")}</label>
                <select @change=${(e) => this._selected_machine = e.target.value} .value=${this._selected_machine || n[0]?.entity_id || ""}>
                    ${n.map((e) => L`<option value="${e.entity_id}">${this._getCleanName(e, [" Gesamtbezüge", " Total Shots"])}</option>`)}
                </select>
            </div>
            <div class="native-select-wrapper">
                <label>${this._t("person")}</label>
                <select @change=${(e) => this._selected_person = e.target.value} .value=${this._selected_person || this._t("guest")}>
                    <option value="${this._t("guest")}">${this._t("guest")}</option>
                    ${r.map((e) => L`<option value="${e.attributes.friendly_name || e.entity_id}">${e.attributes.friendly_name || e.entity_id}</option>`)}
                </select>
            </div>
        </div>
        <div class="form-grid">
            <div class="native-select-wrapper">
                <label>Coffee Type</label>
                <select @change=${(e) => this._drink_type = e.target.value} .value=${this._drink_type}>
                    ${this._coffeeTypes.map((e) => L`<option value="${e}">${e}</option>`)}
                </select>
            </div>
        </div>
        <div class="form-grid">
            <ha-textfield label="${this._t("dose")}" type="number" .value=${this._dose.toString()} @input=${(e) => this._dose = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("yield")}" type="number" .value=${this._yield.toString()} @input=${(e) => this._yield = parseFloat(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("time")}" type="number" step="1" .value=${this._time.toString()} @input=${(e) => this._time = parseInt(e.target.value)}></ha-textfield>
            <ha-textfield label="${this._t("setting")}" type="number" step="0.1" .value=${this._grinder_setting.toString()} @input=${(e) => this._grinder_setting = parseFloat(e.target.value)}></ha-textfield>
        </div>
        
        <div class="sliders" style="margin-top: 16px;">
            <div class="slider-container">
                <div class="slider-header">
                    <span>${this._t("acidity")}</span>
                    <span>${this._acidity}</span>
                </div>
                <div class="slider-row">
                    <small>${this._t("rating_1")}</small>
                    <input type="range" min="1" max="5" .value=${this._acidity.toString()} @input=${(e) => this._acidity = parseInt(e.target.value)}>
                    <small>${this._t("rating_5")}</small>
                </div>
            </div>
            
            <div class="slider-container">
                <div class="slider-header">
                    <span>${this._t("bitterness")}</span>
                    <span>${this._bitterness}</span>
                </div>
                <div class="slider-row">
                    <small>${this._t("rating_1")}</small>
                    <input type="range" min="1" max="5" .value=${this._bitterness.toString()} @input=${(e) => this._bitterness = parseInt(e.target.value)}>
                    <small>${this._t("rating_5")}</small>
                </div>
            </div>
            
            <div class="slider-container">
                <div class="slider-header">
                    <span>${this._t("rating_ovrl")}</span>
                    <span>${"★".repeat(this._rating)}</span>
                </div>
                <div class="slider-row">
                    <input type="range" min="1" max="5" .value=${this._rating.toString()} @input=${(e) => this._rating = parseInt(e.target.value)}>
                </div>
            </div>
        </div>

        <div style="display: flex; gap: 8px; margin-top:20px;">
           <ha-button raised @click=${this._logBrew} style="flex: 1;">${this._edit_mode ? "Save Changes" : this._t("log")}</ha-button>
           ${this._edit_mode ? L`<ha-button @click=${this._cancelEdit} style="flex: 1;">Cancel</ha-button>` : ""}
        </div>
      </div>
    `;
	}
	async _logBrew() {
		let e = this._getEntities(["_remaining", "_verbleibend"]).filter((e) => parseFloat(e.state) > 0), t = this._getEntities([
			"_maintenance",
			"_durchsatz",
			"_throughput",
			"_throughput_kg"
		]), n = this._getEntities([
			"_maintenance",
			"_gesamtbezuge",
			"_total_shots"
		]), r = this._selected_batch || e[0]?.entity_id || "", i = this._selected_grinder || t[0]?.entity_id || "", a = this._selected_machine || n[0]?.entity_id || "", o = this._selected_person || this._t("guest"), s = {
			batch_id: this._getInternalId(r, "batch_"),
			grinder_id: this._getInternalId(i, "grinder_"),
			machine_id: this._getInternalId(a, "machine_"),
			dose: this._dose,
			yield: this._yield,
			time: this._time,
			grinder_setting: this._grinder_setting,
			rating: this._rating,
			acidity: this._acidity,
			bitterness: this._bitterness,
			person: o,
			drink_type: this._drink_type,
			bean_name: Object.values(this.hass.states).find((e) => e.entity_id === r)?.attributes?.friendly_name?.split(" Verbleibend")[0]?.split(" Remaining")[0] || "Unknown Bean"
		};
		this._edit_mode ? (s.brew_id = this._edit_brew_id, await this.hass.callService("breaking_beans", "edit_brew", s), alert("Changes saved!"), this._cancelEdit()) : (await this.hass.callService("breaking_beans", "add_brew", s), alert(this._t("logged")));
	}
	static {
		this.styles = o`
    ha-card {
      background: var(--card-background-color, #fff);
      padding: 16px;
      border-radius: 12px;
      box-shadow: var(--ha-card-box-shadow, 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2));
    }
    .header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }
    .header ha-icon {
      color: #6F4E37;
      --mdc-icon-size: 32px;
    }
    .title {
      font-size: 24px;
      font-weight: 500;
      color: var(--primary-text-color);
    }
    .section-title {
      font-size: 14px;
      font-weight: bold;
      text-transform: uppercase;
      color: var(--secondary-text-color);
      margin-top: 16px;
      margin-bottom: 8px;
    }
    .inventory {
      background: var(--secondary-background-color);
      padding: 12px;
      border-radius: 8px;
    }
    .batch-item {
      margin-bottom: 12px;
    }
    .batch-item:last-child { margin-bottom: 0; }
    .batch-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
    }
    .batch-name { font-weight: 500; font-size: 14px; }
    .batch-weight { color: var(--primary-color); font-weight: bold; }
    ha-progressbar {
      --ha-progressbar-height: 6px;
      --ha-progressbar-border-radius: 3px;
      --ha-progressbar-progress-color: #6F4E37;
    }
    .form-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
      gap: 12px;
      margin-top: 8px;
    }
    .native-select-wrapper {
        display: flex;
        flex-direction: column;
    }
    .native-select-wrapper label {
        font-size: 12px;
        color: var(--secondary-text-color);
        margin-bottom: 4px;
        padding-left: 2px;
    }
    .native-select-wrapper select {
        width: 100%;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, #e0e0e0);
        background: var(--card-background-color, #fff);
        color: var(--primary-text-color);
        font-size: 14px;
        appearance: none;
        outline: none;
    }
    .native-select-wrapper select:focus {
        border-color: var(--primary-color);
    }
    ha-textfield { width: 100%; }
    ha-button { width: 100%; --mdc-theme-primary: #6F4E37; }
    
    .sliders {
        display: flex;
        flex-direction: column;
        gap: 16px;
        background: var(--secondary-background-color);
        padding: 12px;
        border-radius: 8px;
    }
    .slider-container {
        display: flex;
        flex-direction: column;
    }
    .slider-header {
        display: flex;
        justify-content: space-between;
        font-size: 13px;
        font-weight: 500;
        margin-bottom: 4px;
    }
    .slider-row {
        display: flex;
        align-items: center;
        gap: 8px;
    }
    .slider-row small {
        width: 60px;
        text-align: center;
        color: var(--secondary-text-color);
        font-size: 11px;
    }
    .slider-row input[type=range] {
        flex: 1;
        accent-color: #6F4E37;
    }
    
    .history-table {
      margin-top: 8px;
      font-size: 13px;
      background: var(--secondary-background-color);
      border-radius: 8px;
      padding: 8px;
    }
    .history-item {
      display: flex;
      flex-direction: column;
      padding: 12px 8px;
      border-bottom: 1px solid var(--divider-color);
      gap: 8px;
    }
    .history-item:last-child { border-bottom: none; }
    .hist-header { display: flex; justify-content: space-between; align-items: center; }
    .hist-title { display: flex; align-items: baseline; gap: 8px; }
    .hist-type { font-weight: 600; font-size: 14px; color: var(--primary-text-color); }
    .hist-date { font-size: 12px; color: var(--secondary-text-color); }
    .hist-rating { color: #f1c40f; letter-spacing: 2px; }
    
    .hist-bean {
      font-size: 13px;
      color: var(--primary-text-color);
      line-height: 1.4;
    }
    .hist-person {
      color: var(--secondary-text-color);
      font-style: italic;
    }
    
    .hist-metrics {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 4px;
    }
    .metric-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: rgba(111, 78, 55, 0.1);
      color: var(--primary-text-color);
      padding: 4px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
    }
    .metric-chip ha-icon {
      --mdc-icon-size: 14px;
      color: #6F4E37;
    }
    
    .hist-actions {
      display: flex;
      justify-content: flex-end;
      gap: 4px;
      margin-top: 4px;
    }
    .hist-actions ha-icon-button {
      color: var(--secondary-text-color);
      --mdc-icon-button-size: 32px;
      --mdc-icon-size: 20px;
    }
    .rating { color: #f1c40f; }
  `;
	}
};
Z([Y({ attribute: !1 })], $.prototype, "hass", void 0), Z([Y({ attribute: !1 })], $.prototype, "config", void 0), Z([X()], $.prototype, "_selected_batch", void 0), Z([X()], $.prototype, "_selected_grinder", void 0), Z([X()], $.prototype, "_selected_machine", void 0), Z([X()], $.prototype, "_dose", void 0), Z([X()], $.prototype, "_yield", void 0), Z([X()], $.prototype, "_time", void 0), Z([X()], $.prototype, "_grinder_setting", void 0), Z([X()], $.prototype, "_rating", void 0), Z([X()], $.prototype, "_acidity", void 0), Z([X()], $.prototype, "_bitterness", void 0), Z([X()], $.prototype, "_selected_person", void 0), Z([X()], $.prototype, "_drink_type", void 0), Z([X()], $.prototype, "_edit_mode", void 0), Z([X()], $.prototype, "_edit_brew_id", void 0), $ = Z([_e("breaking-beans-card")], $);
//#endregion
export { $ as BreakingBeansCard };
