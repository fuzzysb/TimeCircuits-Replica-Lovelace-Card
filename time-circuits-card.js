/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
var _a;
const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
let n$3 = class n {
  constructor(t2, e2, o2) {
    if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t2, this.t = e2;
  }
  get styleSheet() {
    let t2 = this.o;
    const s2 = this.t;
    if (e$2 && void 0 === t2) {
      const e2 = void 0 !== s2 && 1 === s2.length;
      e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
    }
    return t2;
  }
  toString() {
    return this.cssText;
  }
};
const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
  const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
    if (true === t3._$cssResult$) return t3.cssText;
    if ("number" == typeof t3) return t3;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(s2) + t2[o3 + 1], t2[0]);
  return new n$3(o2, t2, s$2);
}, S$1 = (s2, o2) => {
  if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
  else for (const e2 of o2) {
    const o3 = document.createElement("style"), n3 = t$2.litNonce;
    void 0 !== n3 && o3.setAttribute("nonce", n3), o3.textContent = e2.cssText, s2.appendChild(o3);
  }
}, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
  let e2 = "";
  for (const s2 of t3.cssRules) e2 += s2.cssText;
  return r$4(e2);
})(t2) : t2;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
  switch (s2) {
    case Boolean:
      t2 = t2 ? l$1 : null;
      break;
    case Object:
    case Array:
      t2 = null == t2 ? t2 : JSON.stringify(t2);
  }
  return t2;
}, fromAttribute(t2, s2) {
  let i2 = t2;
  switch (s2) {
    case Boolean:
      i2 = null !== t2;
      break;
    case Number:
      i2 = null === t2 ? null : Number(t2);
      break;
    case Object:
    case Array:
      try {
        i2 = JSON.parse(t2);
      } catch (t3) {
        i2 = null;
      }
  }
  return i2;
} }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
let y$1 = class y extends HTMLElement {
  static addInitializer(t2) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t2);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t2, s2 = b$1) {
    if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
      const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
      void 0 !== h2 && e$1(this.prototype, t2, h2);
    }
  }
  static getPropertyDescriptor(t2, s2, i2) {
    const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
      return this[s2];
    }, set(t3) {
      this[s2] = t3;
    } };
    return { get: e2, set(s3) {
      const h2 = e2 == null ? void 0 : e2.call(this);
      r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
    }, configurable: true, enumerable: true };
  }
  static getPropertyOptions(t2) {
    return this.elementProperties.get(t2) ?? b$1;
  }
  static _$Ei() {
    if (this.hasOwnProperty(d$1("elementProperties"))) return;
    const t2 = n$2(this);
    t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(d$1("finalized"))) return;
    if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
      const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
      for (const i2 of s2) this.createProperty(i2, t3[i2]);
    }
    const t2 = this[Symbol.metadata];
    if (null !== t2) {
      const s2 = litPropertyMetadata.get(t2);
      if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [t3, s2] of this.elementProperties) {
      const i2 = this._$Eu(t3, s2);
      void 0 !== i2 && this._$Eh.set(i2, t3);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(s2) {
    const i2 = [];
    if (Array.isArray(s2)) {
      const e2 = new Set(s2.flat(1 / 0).reverse());
      for (const s3 of e2) i2.unshift(c$2(s3));
    } else void 0 !== s2 && i2.push(c$2(s2));
    return i2;
  }
  static _$Eu(t2, s2) {
    const i2 = s2.attribute;
    return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var _a2;
    this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
  }
  addController(t2) {
    var _a2;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
  }
  removeController(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
  }
  _$E_() {
    const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
    for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
    t2.size > 0 && (this._$Ep = t2);
  }
  createRenderRoot() {
    const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return S$1(t2, this.constructor.elementStyles), t2;
  }
  connectedCallback() {
    var _a2;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
    });
  }
  enableUpdating(t2) {
  }
  disconnectedCallback() {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
      var _a3;
      return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
    });
  }
  attributeChangedCallback(t2, s2, i2) {
    this._$AK(t2, i2);
  }
  _$ET(t2, s2) {
    var _a2;
    const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
    if (void 0 !== e2 && true === i2.reflect) {
      const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
      this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
    }
  }
  _$AK(t2, s2) {
    var _a2, _b;
    const i2 = this.constructor, e2 = i2._$Eh.get(t2);
    if (void 0 !== e2 && this._$Em !== e2) {
      const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
      this._$Em = e2;
      const r2 = h2.fromAttribute(s2, t3.type);
      this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
    }
  }
  requestUpdate(t2, s2, i2, e2 = false, h2) {
    var _a2;
    if (void 0 !== t2) {
      const r2 = this.constructor;
      if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
      this.C(t2, s2, i2);
    }
    false === this.isUpdatePending && (this._$ES = this._$EP());
  }
  C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
    i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
  }
  async _$EP() {
    this.isUpdatePending = true;
    try {
      await this._$ES;
    } catch (t3) {
      Promise.reject(t3);
    }
    const t2 = this.scheduleUpdate();
    return null != t2 && await t2, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var _a2;
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [t4, s3] of this._$Ep) this[t4] = s3;
        this._$Ep = void 0;
      }
      const t3 = this.constructor.elementProperties;
      if (t3.size > 0) for (const [s3, i2] of t3) {
        const { wrapped: t4 } = i2, e2 = this[s3];
        true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
      }
    }
    let t2 = false;
    const s2 = this._$AL;
    try {
      t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
      }), this.update(s2)) : this._$EM();
    } catch (s3) {
      throw t2 = false, this._$EM(), s3;
    }
    t2 && this._$AE(s2);
  }
  willUpdate(t2) {
  }
  _$AE(t2) {
    var _a2;
    (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
      var _a3;
      return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
    }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t2) {
    return true;
  }
  update(t2) {
    this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
  }
  updated(t2) {
  }
  firstUpdated(t2) {
  }
};
y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1 = globalThis, i$1 = (t2) => t2, s$1 = t$1.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y2 = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
function V(t2, i2) {
  if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return void 0 !== e ? e.createHTML(i2) : i2;
}
const N = (t2, i2) => {
  const s2 = t2.length - 1, e2 = [];
  let n3, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
  for (let i3 = 0; i3 < s2; i3++) {
    const s3 = t2[i3];
    let a2, u2, d2 = -1, f2 = 0;
    for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y2.test(u2[2]) && (n3 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n3 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n3 = void 0);
    const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
    l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
  }
  return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
};
class S {
  constructor({ strings: t2, _$litType$: i2 }, e2) {
    let r2;
    this.parts = [];
    let l2 = 0, a2 = 0;
    const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
    if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
      const t3 = this.el.content.firstChild;
      t3.replaceWith(...t3.childNodes);
    }
    for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
      if (1 === r2.nodeType) {
        if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
          const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
          d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
        } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
        if (y2.test(r2.tagName)) {
          const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
          if (i3 > 0) {
            r2.textContent = s$1 ? s$1.emptyScript : "";
            for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
            r2.append(t3[i3], c());
          }
        }
      } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
      else {
        let t3 = -1;
        for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
      }
      l2++;
    }
  }
  static createElement(t2, i2) {
    const s2 = l.createElement("template");
    return s2.innerHTML = t2, s2;
  }
}
function M(t2, i2, s2 = t2, e2) {
  var _a2, _b;
  if (i2 === E) return i2;
  let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
  const o2 = a(i2) ? void 0 : i2._$litDirective$;
  return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
}
class R {
  constructor(t2, i2) {
    this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t2) {
    const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l).importNode(i2, true);
    P.currentNode = e2;
    let h2 = P.nextNode(), o2 = 0, n3 = 0, r2 = s2[0];
    for (; void 0 !== r2; ) {
      if (o2 === r2.index) {
        let i3;
        2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n3];
      }
      o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P.nextNode(), o2++);
    }
    return P.currentNode = l, e2;
  }
  p(t2) {
    let i2 = 0;
    for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
  }
}
class k {
  get _$AU() {
    var _a2;
    return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
  }
  constructor(t2, i2, s2, e2) {
    this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
  }
  get parentNode() {
    let t2 = this._$AA.parentNode;
    const i2 = this._$AM;
    return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t2, i2 = this) {
    t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
  }
  O(t2) {
    return this._$AA.parentNode.insertBefore(t2, this._$AB);
  }
  T(t2) {
    this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
  }
  _(t2) {
    this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
  }
  $(t2) {
    var _a2;
    const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
    if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
    else {
      const t3 = new R(e2, this), s3 = t3.u(this.options);
      t3.p(i2), this.T(s3), this._$AH = t3;
    }
  }
  _$AC(t2) {
    let i2 = C.get(t2.strings);
    return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
  }
  k(t2) {
    u(this._$AH) || (this._$AH = [], this._$AR());
    const i2 = this._$AH;
    let s2, e2 = 0;
    for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
    e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
  }
  _$AR(t2 = this._$AA.nextSibling, s2) {
    var _a2;
    for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
      const s3 = i$1(t2).nextSibling;
      i$1(t2).remove(), t2 = s3;
    }
  }
  setConnected(t2) {
    var _a2;
    void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
  }
}
class H {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t2, i2, s2, e2, h2) {
    this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
  }
  _$AI(t2, i2 = this, s2, e2) {
    const h2 = this.strings;
    let o2 = false;
    if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
    else {
      const e3 = t2;
      let n3, r2;
      for (t2 = h2[0], n3 = 0; n3 < h2.length - 1; n3++) r2 = M(this, e3[s2 + n3], i2, n3), r2 === E && (r2 = this._$AH[n3]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n3]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n3 + 1]), this._$AH[n3] = r2;
    }
    o2 && !e2 && this.j(t2);
  }
  j(t2) {
    t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
  }
}
class I extends H {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t2) {
    this.element[this.name] = t2 === A ? void 0 : t2;
  }
}
class L extends H {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t2) {
    this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
  }
}
class z extends H {
  constructor(t2, i2, s2, e2, h2) {
    super(t2, i2, s2, e2, h2), this.type = 5;
  }
  _$AI(t2, i2 = this) {
    if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
    const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
    e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
  }
  handleEvent(t2) {
    var _a2;
    "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
  }
}
class Z {
  constructor(t2, i2, s2) {
    this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t2) {
    M(this, t2);
  }
}
const B = t$1.litHtmlPolyfillSupport;
B == null ? void 0 : B(S, k), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.3");
const D = (t2, i2, s2) => {
  const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
  let h2 = e2._$litPart$;
  if (void 0 === h2) {
    const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
    e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
  }
  return h2._$AI(t2), h2;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const s = globalThis;
class i extends y$1 {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var _a2;
    const t2 = super.createRenderRoot();
    return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
  }
  update(t2) {
    const r2 = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var _a2;
    super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
  }
  disconnectedCallback() {
    var _a2;
    super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
  }
  render() {
    return E;
  }
}
i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
const o$1 = s.litElementPolyfillSupport;
o$1 == null ? void 0 : o$1({ LitElement: i });
(s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t = (t2) => (e2, o2) => {
  void 0 !== o2 ? o2.addInitializer(() => {
    customElements.define(t2, e2);
  }) : customElements.define(t2, e2);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
  const { kind: n3, metadata: i2 } = r2;
  let s2 = globalThis.litPropertyMetadata.get(i2);
  if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n3 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n3) {
    const { name: o2 } = r2;
    return { set(r3) {
      const n4 = e2.get.call(this);
      e2.set.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    }, init(e3) {
      return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
    } };
  }
  if ("setter" === n3) {
    const { name: o2 } = r2;
    return function(r3) {
      const n4 = this[o2];
      e2.call(this, r3), this.requestUpdate(o2, n4, t2, true, r3);
    };
  }
  throw Error("Unsupported decorator location: " + n3);
};
function n2(t2) {
  return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
    const r2 = e3.hasOwnProperty(o3);
    return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
  })(t2, e2, o2);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function r(r2) {
  return n2({ ...r2, state: true, attribute: false });
}
const DEFAULT_THEME = {
  background: "#0a0a0a",
  bezel: "#2a2a2a",
  label_color: "#e8e8e8",
  top_color: "#ff2200",
  middle_color: "#22ff44",
  bottom_color: "#ffcc00",
  ampm_active_top: "#ff2200",
  ampm_active_middle: "#22ff44",
  ampm_active_bottom: "#ffcc00",
  accent: "#ffb011"
};
function resolveTheme(cfg) {
  return { ...DEFAULT_THEME, ...cfg || {} };
}
const DATE_FORMAT_MD = "MD";
const DATE_FORMAT_DM = "DM";
function parseTimeState(raw) {
  if (!raw) return void 0;
  const s2 = String(raw).trim();
  if (!/^\d{12}$/.test(s2)) return void 0;
  return {
    monthDay: s2.slice(0, 4),
    year: s2.slice(4, 8),
    hourMin: s2.slice(8, 12)
  };
}
function toDisplayOrder(md, format) {
  if (md.length !== 4) return md;
  if (format === DATE_FORMAT_DM) return md.slice(2, 4) + md.slice(0, 2);
  return md;
}
function isAm(hourStr) {
  const h2 = parseInt(hourStr.slice(0, 2), 10);
  return Number.isFinite(h2) ? h2 < 12 : true;
}
function pad2(n3) {
  return n3 < 10 ? "0" + n3 : String(n3);
}
var __defProp$1 = Object.defineProperty;
var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
var __decorateClass$1 = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp$1(target, key, result);
  return result;
};
const THEME_KEYS = [
  { key: "background", label: "Background" },
  { key: "bezel", label: "Bezel" },
  { key: "label_color", label: "Labels" },
  { key: "top_color", label: "Top (Destination)" },
  { key: "middle_color", label: "Middle (Present)" },
  { key: "bottom_color", label: "Bottom (Departed)" },
  { key: "accent", label: "Accent / button" }
];
let TimeCircuitsEditor = class extends i {
  constructor() {
    super(...arguments);
    this._cfg = {};
    this._showAdvanced = false;
  }
  setConfig(cfg) {
    this._cfg = { ...cfg };
  }
  _fire(changed) {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: { ...this._cfg, ...changed } }
      })
    );
  }
  _entity(kind, key) {
    const entities = this.hass ? Object.keys(this.hass.states) : [];
    const filtered = entities.filter((e2) => e2.startsWith(kind + "."));
    const current = this._cfg[key];
    return b`
      <ha-select
        label=${this._labelFor(key)}
        .value=${current ?? ""}
        @selected=${(e2) => this._fire({ [key]: e2.target.value || void 0 })}
        @closed=${(e2) => e2.stopPropagation()}
        clearable
      >
        ${filtered.map((e2) => b`<mwc-list-item .value=${e2}>${e2}</mwc-list-item>`)}
      </ha-select>
    `;
  }
  _labelFor(key) {
    switch (key) {
      case "destination_entity":
        return "Destination Time (top, red)";
      case "departed_entity":
        return "Last Time Departed (bottom, yellow)";
      case "present_entity":
        return "Present Time (middle, green)";
      case "date_format_entity":
        return "Date Format select (MD/DM)";
      case "sync_entity":
        return "Sync RTC button";
      default:
        return String(key);
    }
  }
  render() {
    const theme = { ...DEFAULT_THEME, ...this._cfg.theme || {} };
    return b`
      <div class="form">
        <div class="section">
          <div class="section-title">Entities</div>
          ${this._entity("text", "destination_entity")}
          ${this._entity("text", "departed_entity")}
          ${this._entity("text", "present_entity")}
          ${this._entity("select", "date_format_entity")}
          ${this._entity("button", "sync_entity")}
        </div>

        <div class="section">
          <div class="section-title">Display</div>
          <ha-textfield
            label="Title"
            .value=${this._cfg.title ?? ""}
            @input=${(e2) => this._fire({ title: e2.target.value || void 0 })}
          ></ha-textfield>
          <ha-textfield
            label="Font family (optional)"
            .value=${this._cfg.font_family ?? ""}
            @input=${(e2) => this._fire({ font_family: e2.target.value || void 0 })}
          ></ha-textfield>
        </div>

        <div class="section">
          <div class="row">
            <div class="section-title">Theme</div>
            <ha-switch
              .checked=${this._showAdvanced}
              @change=${(e2) => this._showAdvanced = e2.target.checked}
            ></ha-switch>
            <span class="adv-label">all colors</span>
          </div>
          ${this._showAdvanced ? THEME_KEYS.map(
      (t2) => b`
                  <div class="color-row">
                    <span>${t2.label}</span>
                    <input
                      type="color"
                      .value=${theme[t2.key]}
                      @input=${(e2) => this._fire({ theme: { ...theme, [t2.key]: e2.target.value } })}
                    />
                  </div>
                `
    ) : b`
              <div class="color-row">
                <span>Top (Destination)</span>
                <input
                  type="color"
                  .value=${theme.top_color}
                  @input=${(e2) => this._fire({ theme: { ...theme, top_color: e2.target.value } })}
                />
              </div>
              <div class="color-row">
                <span>Middle (Present)</span>
                <input
                  type="color"
                  .value=${theme.middle_color}
                  @input=${(e2) => this._fire({ theme: { ...theme, middle_color: e2.target.value } })}
                />
              </div>
              <div class="color-row">
                <span>Bottom (Departed)</span>
                <input
                  type="color"
                  .value=${theme.bottom_color}
                  @input=${(e2) => this._fire({ theme: { ...theme, bottom_color: e2.target.value } })}
                />
              </div>
            `}
        </div>
      </div>
    `;
  }
};
TimeCircuitsEditor.styles = i$3`
    :host { display: block; }
    .form { display: flex; flex-direction: column; gap: 16px; }
    .section { display: flex; flex-direction: column; gap: 12px; }
    .section-title { font-weight: 600; font-size: 13px; opacity: 0.8; }
    .row { display: flex; align-items: center; gap: 8px; }
    .adv-label { font-size: 12px; opacity: 0.7; }
    .color-row {
      display: flex; align-items: center;
      justify-content: space-between;
      padding: 4px 0;
      font-size: 13px;
    }
    input[type="color"] { width: 40px; height: 28px; border: none; background: none; cursor: pointer; }
    ha-select { width: 100%; }
    ha-textfield { width: 100%; }
  `;
__decorateClass$1([
  n2({ attribute: false })
], TimeCircuitsEditor.prototype, "hass", 2);
__decorateClass$1([
  r()
], TimeCircuitsEditor.prototype, "_cfg", 2);
__decorateClass$1([
  r()
], TimeCircuitsEditor.prototype, "_showAdvanced", 2);
TimeCircuitsEditor = __decorateClass$1([
  t("time-circuits-editor")
], TimeCircuitsEditor);
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
    if (decorator = decorators[i2])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};
const VERSION = "1.1.0";
const CARD_NAME = "time-circuits-card";
const DSEG7_FONT_FACE_ID = "time-circuits-card-dseg7-font";
function ensureDseg7Font() {
  if (document.getElementById(DSEG7_FONT_FACE_ID)) return;
  const style = document.createElement("style");
  style.id = DSEG7_FONT_FACE_ID;
  style.textContent = `
@font-face {
  font-family: 'DSEG7 Classic';
  font-style: normal;
  font-weight: 400;
  font-display: swap;
  src: url('https://cdn.jsdelivr.net/npm/@fontsource/dseg7@4.5.4/files/dseg7-classic-400-normal.woff2') format('woff2'),
       url('https://cdn.jsdelivr.net/npm/@fontsource/dseg7@4.5.4/files/dseg7-classic-400-normal.woff') format('woff');
}
`;
  document.head.appendChild(style);
}
let TimeCircuitsCard = class extends i {
  constructor() {
    super(...arguments);
    this._cfg = {};
    this._clockTick = 0;
  }
  static getConfigElement() {
    return document.createElement("time-circuits-editor");
  }
  static getStubConfig() {
    return {
      title: "Time Circuits",
      destination_entity: "text.time_circuits_replica_destination_time",
      departed_entity: "text.time_circuits_replica_last_time_departed",
      date_format_entity: "select.time_circuits_replica_date_format",
      sync_entity: "button.time_circuits_replica_sync_rtc_time"
    };
  }
  setConfig(cfg) {
    if (!cfg) throw new Error("Invalid configuration");
    this._cfg = cfg;
  }
  getCardSize() {
    return 5;
  }
  connectedCallback() {
    super.connectedCallback();
    ensureDseg7Font();
    this._clockTimer = window.setInterval(() => {
      this._clockTick++;
    }, 1e3);
  }
  disconnectedCallback() {
    if (this._clockTimer) window.clearInterval(this._clockTimer);
    super.disconnectedCallback();
  }
  _state(entityId) {
    if (!entityId || !this.hass) return void 0;
    return this.hass.states[entityId];
  }
  _dateFormat() {
    const st = this._state(this._cfg.date_format_entity);
    if (st && st.state && (st.state === "MD" || st.state === "DM")) return st.state;
    return DATE_FORMAT_MD;
  }
  _presentRow() {
    const fmt = this._dateFormat();
    const st = this._state(this._cfg.present_entity);
    if (st && st.state) {
      const parsed2 = parseTimeState(st.state);
      if (parsed2) {
        return {
          label: "PRESENT TIME",
          parsed: parsed2,
          displayMD: toDisplayOrder(parsed2.monthDay, fmt),
          am: isAm(parsed2.hourMin)
        };
      }
    }
    const now = /* @__PURE__ */ new Date();
    const md = pad2(now.getMonth() + 1) + pad2(now.getDate());
    const yr = String(now.getFullYear());
    const hm = pad2(now.getHours()) + pad2(now.getMinutes());
    const parsed = { monthDay: md, year: yr, hourMin: hm };
    return {
      label: "PRESENT TIME",
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: now.getHours() < 12
    };
  }
  _rowFromEntity(label, entityId) {
    const st = this._state(entityId);
    const parsed = parseTimeState(st == null ? void 0 : st.state);
    if (!parsed) {
      console.debug(`[time-circuits] ${label} entity=${entityId} state=${st == null ? void 0 : st.state} -> parse failed`);
      return { label, am: true };
    }
    const fmt = this._dateFormat();
    return {
      label,
      parsed,
      displayMD: toDisplayOrder(parsed.monthDay, fmt),
      am: isAm(parsed.hourMin)
    };
  }
  _rowColor(kind, theme) {
    if (kind === "top") return theme.top_color;
    if (kind === "middle") return theme.middle_color;
    return theme.bottom_color;
  }
  _handleSync() {
    const entityId = this._cfg.sync_entity;
    if (!entityId || !this.hass) return;
    this.hass.callService("button", "press", { entity_id: entityId });
  }
  _setTimeEntity(entityId, value) {
    if (!this.hass) return;
    this.hass.callService("text", "set_value", { entity_id: entityId, value });
  }
  _editRow(entityId, label) {
    if (!entityId || !this.hass) return;
    const st = this._state(entityId);
    const parsed = parseTimeState(st == null ? void 0 : st.state);
    const fmt = this._dateFormat();
    const initialValue = parsed ? `${toDisplayOrder(parsed.monthDay, fmt)}${parsed.year}${parsed.hourMin}` : "010120250000";
    const orderLabel = fmt === "DM" ? "DDMMYYYYHHMM" : "MMDDYYYYHHMM";
    const v2 = window.prompt(
      `Set ${label ?? entityId}
Format: ${orderLabel} (12 digits)`,
      initialValue
    );
    if (v2 == null) return;
    if (!/^\d{12}$/.test(v2.trim())) {
      window.alert(`Value must be exactly 12 digits: ${orderLabel}`);
      return;
    }
    const trimmed = v2.trim();
    const storedMD = fmt === "DM" ? trimmed.slice(2, 4) + trimmed.slice(0, 2) : trimmed.slice(0, 4);
    const storedValue = storedMD + trimmed.slice(4);
    this._setTimeEntity(entityId, storedValue);
  }
  render() {
    const cfg = this._cfg;
    const theme = resolveTheme(cfg.theme);
    const top = this._rowFromEntity("DESTINATION TIME", cfg.destination_entity);
    const present = this._presentRow();
    const bottom = this._rowFromEntity("LAST TIME DEPARTED", cfg.departed_entity);
    void this._clockTick;
    if (!top.parsed || !bottom.parsed) {
      console.debug("[time-circuits] render: top.parsed=", !!top.parsed, "bottom.parsed=", !!bottom.parsed, "hass=", !!this.hass);
    }
    return b`
      <ha-card style=${this._cardStyle(theme)}>
        <div class="bezel">
          <div class="panel" style=${this._panelStyle()}>
            ${cfg.title ? b`<div class="card-title" style="color:${theme.label_color}">
                  ${cfg.title}
                </div>` : A}
            ${this._renderRow(top, theme, "top", cfg.destination_entity, true)}
            ${this._renderRow(present, theme, "middle", cfg.present_entity, false)}
            ${this._renderRow(bottom, theme, "bottom", cfg.departed_entity, true)}
            ${cfg.sync_entity ? b`
                  <div class="sync-bar">
                    <mwc-button
                      raised
                      label="SYNC RTC"
                      style="--mdc-theme-primary:${theme.accent};--mdc-theme-on-primary:#0a0a0a"
                      @click=${() => this._handleSync()}
                    ></mwc-button>
                  </div>
                ` : A}
          </div>
        </div>
      </ha-card>
    `;
  }
  _renderRow(row, theme, kind, entityId, editable) {
    var _a2, _b;
    const color = this._rowColor(kind, theme);
    const p2 = row.parsed;
    const md = row.displayMD ?? (p2 == null ? void 0 : p2.monthDay);
    const click = editable ? () => this._editRow(entityId, row.label) : void 0;
    return b`
      <div class="row">
        <div
          class="segments ${editable ? "editable" : ""} ${p2 ? "" : "empty"}"
          @click=${click}
        >
          <div class="col col-two">
            <div class="col-head"><span class="dymo">MONTH</span><span class="dymo">DAY</span></div>
            <div class="col-body">
              ${this._renderPair(md == null ? void 0 : md.slice(0, 2), color)}
              <span class="seg-gap"></span>
              ${this._renderPair(md == null ? void 0 : md.slice(2, 4), color)}
            </div>
          </div>
          <div class="col col-one">
            <div class="col-head"><span class="dymo">YEAR</span></div>
            <div class="col-body">${this._renderYear(p2 == null ? void 0 : p2.year, color)}</div>
          </div>
          <div class="col col-ampm">
            <div class="col-body">${this._renderAmPm(row.am, color)}</div>
          </div>
          <div class="col col-two">
            <div class="col-head"><span class="dymo">HOUR</span><span class="dymo">MIN</span></div>
            <div class="col-body">
              ${this._renderPair((_a2 = p2 == null ? void 0 : p2.hourMin) == null ? void 0 : _a2.slice(0, 2), color)}
              <span class="colon" style="color:${color}">:</span>
              ${this._renderPair((_b = p2 == null ? void 0 : p2.hourMin) == null ? void 0 : _b.slice(2, 4), color)}
            </div>
          </div>
        </div>
        <div class="row-label-wrap"><span class="row-label-dymo">${row.label}</span></div>
      </div>
    `;
  }
  _renderPair(value, color) {
    const v2 = value && value.length >= 2 ? value.slice(0, 2) : "--";
    return b`<span class="led-pair" style="color:${color}">
      <span class="digit">${v2[0]}</span><span class="digit">${v2[1]}</span>
    </span>`;
  }
  _renderYear(value, color) {
    const v2 = value && value.length === 4 ? value : "----";
    return b`<span class="led-year" style="color:${color}">
      ${v2.split("").map((c2) => b`<span class="digit">${c2}</span>`)}
    </span>`;
  }
  _renderAmPm(am, color) {
    return b`
      <div class="ampm-stack" style="--lamp:${color}">
        <span class="dymo">AM</span>
        <div class="ampm-lamp ${am ? "on" : "off"}"></div>
        <span class="dymo">PM</span>
        <div class="ampm-lamp ${am ? "off" : "on"}"></div>
      </div>
    `;
  }
  _cardStyle(theme) {
    return [
      `background:${theme.background}`,
      `border:6px solid #1a1a1a`,
      `border-radius:14px`,
      `padding:0`,
      `overflow:hidden`
    ].join(";");
  }
  _panelStyle() {
    return [
      `padding:10px 12px 8px`,
      `--led-font:${this._cfg.font_family ?? "'DSEG7 Classic', 'Courier New', monospace"}`
    ].join(";");
  }
};
TimeCircuitsCard.styles = i$3`
    :host { display: block; }
    ha-card { display: block; }
    .bezel {
      border: 3px solid #1a1a1a;
      border-radius: 10px;
      margin: 4px;
      background:
        linear-gradient(180deg, #d0d0d0 0%, #a8a8a8 30%, #888 70%, #707070 100%);
      box-shadow:
        inset 0 1px 0 #e8e8e8,
        inset 0 -2px 6px rgba(0,0,0,0.5),
        0 2px 6px rgba(0,0,0,0.6);
    }
    .panel {
      display: flex;
      flex-direction: column;
      gap: 0;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      padding: 8px 6px 6px;
    }
    .card-title {
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 11px;
      letter-spacing: 4px;
      text-transform: uppercase;
      text-align: center;
      opacity: 0.55;
      margin: 2px 0 6px;
      font-weight: 700;
      color: #222;
    }
    .row {
      display: flex;
      flex-direction: column;
      gap: 5px;
      padding: 6px 4px 5px;
      position: relative;
    }
    .row + .row { border-top: 1px solid #606060; }
    .segments {
      display: flex;
      align-items: flex-end;
      justify-content: center;
      gap: 0;
      flex-wrap: nowrap;
    }
    .segments.editable { cursor: pointer; }
    .segments.empty { color: #444; }
    .col {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
      padding: 0 8px;
    }
    .col + .col {
      border-left: 2px solid #787878;
      box-shadow: inset 1px 0 0 #b8b8b8;
    }
    .col-head {
      display: flex;
      justify-content: center;
      gap: 4px;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    }
    .dymo {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #b71c1c;
      color: #fff;
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      padding: 2px 5px;
      border-radius: 2px;
      min-width: 2.5em;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.25),
        inset 0 -1px 0 rgba(0,0,0,0.4),
        0 1px 1px rgba(0,0,0,0.5);
    }
    .col-one .dymo { min-width: 4em; }
    .col-body {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .led-pair, .led-year {
      display: inline-flex;
      align-items: center;
      font-family: var(--led-font);
      font-variant-numeric: tabular-nums;
      font-weight: 400;
      letter-spacing: 1px;
    }
    .seg-gap { width: 6px; display: inline-block; }
    .digit {
      font-size: 30px;
      line-height: 1;
      min-width: 0.62em;
      text-align: center;
      text-shadow:
        0 0 5px currentColor,
        0 0 12px currentColor,
        0 0 2px currentColor;
    }
    .colon {
      font-family: var(--led-font);
      font-size: 30px;
      line-height: 1;
      padding: 0 2px;
      text-shadow: 0 0 6px currentColor, 0 0 14px currentColor;
      animation: blink 1s steps(2, start) infinite;
    }
    @keyframes blink { 50% { opacity: 0.2; } }
    .ampm-stack {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 3px;
    }
    .ampm-lamp {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: #2a2a2a;
      border: 2px solid #888;
      box-sizing: border-box;
      transition: background 0.2s, box-shadow 0.2s, border-color 0.2s;
    }
    .ampm-lamp.on {
      background: var(--lamp);
      border-color: #ccc;
      box-shadow:
        0 0 6px var(--lamp),
        0 0 12px var(--lamp),
        inset 0 0 3px rgba(255,255,255,0.6);
    }
    .ampm-lamp.off { background: #1a1a1a; box-shadow: none; }
    .row-label-wrap {
      display: flex;
      justify-content: center;
      margin-top: 2px;
    }
    .row-label-dymo {
      display: inline-block;
      background: #111;
      color: #fff;
      font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 2.5px;
      text-transform: uppercase;
      padding: 3px 14px;
      border-radius: 3px;
      box-shadow:
        inset 0 1px 0 rgba(255,255,255,0.12),
        inset 0 -1px 0 rgba(0,0,0,0.6),
        0 1px 2px rgba(0,0,0,0.5);
    }
    .sync-bar {
      display: flex;
      justify-content: center;
      margin-top: 6px;
      padding-bottom: 2px;
    }
    @media (max-width: 480px) {
      .digit { font-size: 22px; }
      .colon { font-size: 22px; }
      .col { padding: 0 5px; }
      .row { padding: 5px 2px 4px; }
      .dymo { font-size: 6px; padding: 2px 4px; }
    }
  `;
__decorateClass([
  n2({ attribute: false })
], TimeCircuitsCard.prototype, "hass", 2);
__decorateClass([
  r()
], TimeCircuitsCard.prototype, "_cfg", 2);
__decorateClass([
  r()
], TimeCircuitsCard.prototype, "_clockTick", 2);
TimeCircuitsCard = __decorateClass([
  t(CARD_NAME)
], TimeCircuitsCard);
if (window.customCards) {
  window.customCards.push({
    type: CARD_NAME,
    name: "Time Circuits",
    description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices."
  });
} else {
  window.customCards = [
    {
      type: CARD_NAME,
      name: "Time Circuits",
      description: "Back to the Future Time Circuits replica card for ESP32 + MQTT devices."
    }
  ];
}
console.info(
  `%c TIME-CIRCUITS-CARD %c v${VERSION} `,
  "color: white; background: #ff2200; font-weight: bold;",
  "color: #ff2200; background: black; font-weight: bold;"
);
export {
  TimeCircuitsCard
};
