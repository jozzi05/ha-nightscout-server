function t(t,e,s,i){var o,n=arguments.length,r=n<3?e:null===i?i=Object.getOwnPropertyDescriptor(e,s):i;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)r=Reflect.decorate(t,e,s,i);else for(var a=t.length-1;a>=0;a--)(o=t[a])&&(r=(n<3?o(r):n>3?o(e,s,r):o(e,s))||r);return n>3&&r&&Object.defineProperty(e,s,r),r}"function"==typeof SuppressedError&&SuppressedError;const e=globalThis,s=e.ShadowRoot&&(void 0===e.ShadyCSS||e.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,i=Symbol(),o=new WeakMap;let n=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==i)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(s&&void 0===t){const s=void 0!==e&&1===e.length;s&&(t=o.get(e)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&o.set(e,t))}return t}toString(){return this.cssText}};const r=(t,...e)=>{const s=1===t.length?t[0]:e.reduce((e,s,i)=>e+(t=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[i+1],t[0]);return new n(s,t,i)},a=s?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return(t=>new n("string"==typeof t?t:t+"",void 0,i))(e)})(t):t,{is:l,defineProperty:h,getOwnPropertyDescriptor:c,getOwnPropertyNames:d,getOwnPropertySymbols:p,getPrototypeOf:u}=Object,_=globalThis,g=_.trustedTypes,f=g?g.emptyScript:"",$=_.reactiveElementPolyfillSupport,y=(t,e)=>t,v={toAttribute(t,e){switch(e){case Boolean:t=t?f:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t)}return t},fromAttribute(t,e){let s=t;switch(e){case Boolean:s=null!==t;break;case Number:s=null===t?null:Number(t);break;case Object:case Array:try{s=JSON.parse(t)}catch(t){s=null}}return s}},b=(t,e)=>!l(t,e),m={attribute:!0,type:String,converter:v,reflect:!1,useDefault:!1,hasChanged:b};Symbol.metadata??=Symbol("metadata"),_.litPropertyMetadata??=new WeakMap;let A=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=m){if(e.state&&(e.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);void 0!==i&&h(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:o}=c(this.prototype,t)??{get(){return this[e]},set(t){this[e]=t}};return{get:i,set(e){const n=i?.call(this);o?.call(this,e),this.requestUpdate(t,n,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??m}static _$Ei(){if(this.hasOwnProperty(y("elementProperties")))return;const t=u(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(y("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(y("properties"))){const t=this.properties,e=[...d(t),...p(t)];for(const s of e)this.createProperty(s,t[s])}const t=this[Symbol.metadata];if(null!==t){const e=litPropertyMetadata.get(t);if(void 0!==e)for(const[t,s]of e)this.elementProperties.set(t,s)}this._$Eh=new Map;for(const[t,e]of this.elementProperties){const s=this._$Eu(t,e);void 0!==s&&this._$Eh.set(s,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const t of s)e.unshift(a(t))}else void 0!==t&&e.push(a(t));return e}static _$Eu(t,e){const s=e.attribute;return!1===s?void 0:"string"==typeof s?s:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.()}removeController(t){this._$EO?.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return((t,i)=>{if(s)t.adoptedStyleSheets=i.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const s of i){const i=document.createElement("style"),o=e.litNonce;void 0!==o&&i.setAttribute("nonce",o),i.textContent=s.cssText,t.appendChild(i)}})(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$ET(t,e){const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(void 0!==i&&!0===s.reflect){const o=(void 0!==s.converter?.toAttribute?s.converter:v).toAttribute(e,s.type);this._$Em=t,null==o?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){const s=this.constructor,i=s._$Eh.get(t);if(void 0!==i&&this._$Em!==i){const t=s.getPropertyOptions(i),o="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:v;this._$Em=i;const n=o.fromAttribute(e,t.type);this[i]=n??this._$Ej?.get(i)??n,this._$Em=null}}requestUpdate(t,e,s,i=!1,o){if(void 0!==t){const n=this.constructor;if(!1===i&&(o=this[t]),s??=n.getPropertyOptions(t),!((s.hasChanged??b)(o,e)||s.useDefault&&s.reflect&&o===this._$Ej?.get(t)&&!this.hasAttribute(n._$Eu(t,s))))return;this.C(t,e,s)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(t,e,{useDefault:s,reflect:i,wrapped:o},n){s&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,n??e??this[t]),!0!==o||void 0!==n)||(this._$AL.has(t)||(this.hasUpdated||s||(e=void 0),this._$AL.set(t,e)),!0===i&&this._$Em!==t&&(this._$Eq??=new Set).add(t))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,e]of this._$Ep)this[t]=e;this._$Ep=void 0}const t=this.constructor.elementProperties;if(t.size>0)for(const[e,s]of t){const{wrapped:t}=s,i=this[e];!0!==t||this._$AL.has(e)||void 0===i||this.C(e,void 0,s,i)}}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(e)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[y("elementProperties")]=new Map,A[y("finalized")]=new Map,$?.({ReactiveElement:A}),(_.reactiveElementVersions??=[]).push("2.1.2");const w=globalThis,C=t=>t,E=w.trustedTypes,x=E?E.createPolicy("lit-html",{createHTML:t=>t}):void 0,S="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,P="?"+k,O=`<${P}>`,U=document,T=()=>U.createComment(""),M=t=>null===t||"object"!=typeof t&&"function"!=typeof t,N=Array.isArray,H="[ \t\n\f\r]",R=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,D=/-->/g,z=/>/g,j=RegExp(`>|${H}(?:([^\\s"'>=/]+)(${H}*=${H}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),L=/'/g,B=/"/g,I=/^(?:script|style|textarea|title)$/i,W=(t=>(e,...s)=>({_$litType$:t,strings:e,values:s}))(1),G=Symbol.for("lit-noChange"),V=Symbol.for("lit-nothing"),q=new WeakMap,F=U.createTreeWalker(U,129);function K(t,e){if(!N(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==x?x.createHTML(e):e}const J=(t,e)=>{const s=t.length-1,i=[];let o,n=2===e?"<svg>":3===e?"<math>":"",r=R;for(let e=0;e<s;e++){const s=t[e];let a,l,h=-1,c=0;for(;c<s.length&&(r.lastIndex=c,l=r.exec(s),null!==l);)c=r.lastIndex,r===R?"!--"===l[1]?r=D:void 0!==l[1]?r=z:void 0!==l[2]?(I.test(l[2])&&(o=RegExp("</"+l[2],"g")),r=j):void 0!==l[3]&&(r=j):r===j?">"===l[0]?(r=o??R,h=-1):void 0===l[1]?h=-2:(h=r.lastIndex-l[2].length,a=l[1],r=void 0===l[3]?j:'"'===l[3]?B:L):r===B||r===L?r=j:r===D||r===z?r=R:(r=j,o=void 0);const d=r===j&&t[e+1].startsWith("/>")?" ":"";n+=r===R?s+O:h>=0?(i.push(a),s.slice(0,h)+S+s.slice(h)+k+d):s+k+(-2===h?e:d)}return[K(t,n+(t[s]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),i]};class Z{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let o=0,n=0;const r=t.length-1,a=this.parts,[l,h]=J(t,e);if(this.el=Z.createElement(l,s),F.currentNode=this.el.content,2===e||3===e){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes)}for(;null!==(i=F.nextNode())&&a.length<r;){if(1===i.nodeType){if(i.hasAttributes())for(const t of i.getAttributeNames())if(t.endsWith(S)){const e=h[n++],s=i.getAttribute(t).split(k),r=/([.?@])?(.*)/.exec(e);a.push({type:1,index:o,name:r[2],strings:s,ctor:"."===r[1]?et:"?"===r[1]?st:"@"===r[1]?it:tt}),i.removeAttribute(t)}else t.startsWith(k)&&(a.push({type:6,index:o}),i.removeAttribute(t));if(I.test(i.tagName)){const t=i.textContent.split(k),e=t.length-1;if(e>0){i.textContent=E?E.emptyScript:"";for(let s=0;s<e;s++)i.append(t[s],T()),F.nextNode(),a.push({type:2,index:++o});i.append(t[e],T())}}}else if(8===i.nodeType)if(i.data===P)a.push({type:2,index:o});else{let t=-1;for(;-1!==(t=i.data.indexOf(k,t+1));)a.push({type:7,index:o}),t+=k.length-1}o++}}static createElement(t,e){const s=U.createElement("template");return s.innerHTML=t,s}}function Q(t,e,s=t,i){if(e===G)return e;let o=void 0!==i?s._$Co?.[i]:s._$Cl;const n=M(e)?void 0:e._$litDirective$;return o?.constructor!==n&&(o?._$AO?.(!1),void 0===n?o=void 0:(o=new n(t),o._$AT(t,s,i)),void 0!==i?(s._$Co??=[])[i]=o:s._$Cl=o),void 0!==o&&(e=Q(t,o._$AS(t,e.values),o,i)),e}class X{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=(t?.creationScope??U).importNode(e,!0);F.currentNode=i;let o=F.nextNode(),n=0,r=0,a=s[0];for(;void 0!==a;){if(n===a.index){let e;2===a.type?e=new Y(o,o.nextSibling,this,t):1===a.type?e=new a.ctor(o,a.name,a.strings,this,t):6===a.type&&(e=new ot(o,this,t)),this._$AV.push(e),a=s[++r]}n!==a?.index&&(o=F.nextNode(),n++)}return F.currentNode=U,i}p(t){let e=0;for(const s of this._$AV)void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class Y{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=V,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return void 0!==e&&11===t?.nodeType&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=Q(this,t,e),M(t)?t===V||null==t||""===t?(this._$AH!==V&&this._$AR(),this._$AH=V):t!==this._$AH&&t!==G&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):(t=>N(t)||"function"==typeof t?.[Symbol.iterator])(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==V&&M(this._$AH)?this._$AA.nextSibling.data=t:this.T(U.createTextNode(t)),this._$AH=t}$(t){const{values:e,_$litType$:s}=t,i="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=Z.createElement(K(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===i)this._$AH.p(e);else{const t=new X(i,this),s=t.u(this.options);t.p(e),this.T(s),this._$AH=t}}_$AC(t){let e=q.get(t.strings);return void 0===e&&q.set(t.strings,e=new Z(t)),e}k(t){N(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const o of t)i===e.length?e.push(s=new Y(this.O(T()),this.O(T()),this,this.options)):s=e[i],s._$AI(o),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){const e=C(t).nextSibling;C(t).remove(),t=e}}setConnected(t){void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t))}}class tt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,o){this.type=1,this._$AH=V,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=o,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=V}_$AI(t,e=this,s,i){const o=this.strings;let n=!1;if(void 0===o)t=Q(this,t,e,0),n=!M(t)||t!==this._$AH&&t!==G,n&&(this._$AH=t);else{const i=t;let r,a;for(t=o[0],r=0;r<o.length-1;r++)a=Q(this,i[s+r],e,r),a===G&&(a=this._$AH[r]),n||=!M(a)||a!==this._$AH[r],a===V?t=V:t!==V&&(t+=(a??"")+o[r+1]),this._$AH[r]=a}n&&!i&&this.j(t)}j(t){t===V?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class et extends tt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===V?void 0:t}}class st extends tt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==V)}}class it extends tt{constructor(t,e,s,i,o){super(t,e,s,i,o),this.type=5}_$AI(t,e=this){if((t=Q(this,t,e,0)??V)===G)return;const s=this._$AH,i=t===V&&s!==V||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,o=t!==V&&(s===V||i);i&&this.element.removeEventListener(this.name,this,s),o&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}}class ot{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){Q(this,t)}}const nt=w.litHtmlPolyfillSupport;nt?.(Z,Y),(w.litHtmlVersions??=[]).push("3.3.3");const rt=globalThis;class at extends A{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=((t,e,s)=>{const i=s?.renderBefore??e;let o=i._$litPart$;if(void 0===o){const t=s?.renderBefore??null;i._$litPart$=o=new Y(e.insertBefore(T(),t),t,void 0,s??{})}return o._$AI(t),o})(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return G}}at._$litElement$=!0,at.finalized=!0,rt.litElementHydrateSupport?.({LitElement:at});const lt=rt.litElementPolyfillSupport;lt?.({LitElement:at}),(rt.litElementVersions??=[]).push("4.2.2");const ht=t=>(e,s)=>{void 0!==s?s.addInitializer(()=>{customElements.define(t,e)}):customElements.define(t,e)},ct={attribute:!0,type:String,converter:v,reflect:!1,hasChanged:b},dt=(t=ct,e,s)=>{const{kind:i,metadata:o}=s;let n=globalThis.litPropertyMetadata.get(o);if(void 0===n&&globalThis.litPropertyMetadata.set(o,n=new Map),"setter"===i&&((t=Object.create(t)).wrapped=!0),n.set(s.name,t),"accessor"===i){const{name:i}=s;return{set(s){const o=e.get.call(this);e.set.call(this,s),this.requestUpdate(i,o,t,!0,s)},init(e){return void 0!==e&&this.C(i,void 0,t,e),e}}}if("setter"===i){const{name:i}=s;return function(s){const o=this[i];e.call(this,s),this.requestUpdate(i,o,t,!0,s)}}throw Error("Unsupported decorator location: "+i)};function pt(t){return(e,s)=>"object"==typeof s?dt(t,e,s):((t,e,s)=>{const i=e.hasOwnProperty(s);return e.constructor.createProperty(s,t),i?Object.getOwnPropertyDescriptor(e,s):void 0})(t,e,s)}function ut(t){return pt({...t,state:!0,attribute:!1})}const _t=r`
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
    animation: glucose-blink 2s ease-in-out;
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
`,gt={show_glucose:!0,show_time_ago:!0,show_delta:!0,show_iob:!0,show_cob:!0,font_size:48,urgent_low:70,urgent_high:200,low:85,high:170,color_urgent:"#e74c3c",color_warning:"#f39c12",color_ok:"#2ecc71"},ft=["glucose","delta","iob","cob","last_reading"];let $t=class extends at{constructor(){super(...arguments),this._config={type:"custom:nightscout-card",...gt}}setConfig(t){this._config={...gt,...t}}_fireChanged(){this.dispatchEvent(new CustomEvent("config-changed",{detail:{config:this._config},bubbles:!0,composed:!0}))}async _deviceChanged(t){const e=t.target.value;if(this._config={...this._config,device_id:e},e){try{const t=(await this.hass.callWS({type:"config/entity_registry/list"})).filter(t=>t.device_id===e&&"nightscout"===t.platform),s={};for(const e of ft){const i=t.find(t=>t.entity_id.endsWith(`_${e}`));i&&(s[`${e}_entity`]=i.entity_id)}this._config={...this._config,...s}}catch{}this._fireChanged()}else this._fireChanged()}_toggleChanged(t,e){const s=e.target.checked;this._config={...this._config,[t]:s},this._fireChanged()}_numberChanged(t,e){const s=Number(e.target.value);isNaN(s)||(this._config={...this._config,[t]:s},this._fireChanged())}_colorChanged(t,e){const s=e.target.value;this._config={...this._config,[t]:s},this._fireChanged()}_textChanged(t,e){const s=e.target.value;this._config={...this._config,[t]:s},this._fireChanged()}_buildDeviceOptions(){if(!this.hass)return[];const t=[];for(const e of Object.keys(this.hass.states))if(e.startsWith("sensor.")&&e.endsWith("_glucose")){if(this.hass.states[e]){const s=e.replace("sensor.","").replace("_glucose","");t.push({id:e,name:s})}}return t}render(){const t=this._config;return W`
      <div class="editor">
        <div class="section-title">Device</div>
        <ha-device-picker
          .hass=${this.hass}
          .value=${t.device_id||""}
          .includeDomains=${["nightscout"]}
          @value-changed=${t=>{const e=t.detail.value;this._deviceChanged({target:{value:e}})}}
        ></ha-device-picker>

        <div class="section-title">Visible fields</div>
        ${[["show_glucose","Glucose"],["show_time_ago","Time ago"],["show_delta","Delta"],["show_iob","IOB"],["show_cob","COB"]].map(([e,s])=>W`
            <label>
              <input
                type="checkbox"
                .checked=${!1!==t[e]}
                @change=${t=>this._toggleChanged(e,t)}
              />
              ${s}
            </label>
          `)}

        <div class="section-title">Font size</div>
        <div class="row">
          <input
            type="range"
            min="20"
            max="72"
            .value=${String(t.font_size)}
            @input=${t=>this._numberChanged("font_size",t)}
          />
          <span>${t.font_size}px</span>
        </div>

        <div class="section-title">Glucose ranges (mg/dL)</div>
        <div class="row">
          <label>Urgent low <input type="number" .value=${String(t.urgent_low)} @change=${t=>this._numberChanged("urgent_low",t)} /></label>
          <label>Low <input type="number" .value=${String(t.low)} @change=${t=>this._numberChanged("low",t)} /></label>
        </div>
        <div class="row">
          <label>High <input type="number" .value=${String(t.high)} @change=${t=>this._numberChanged("high",t)} /></label>
          <label>Urgent high <input type="number" .value=${String(t.urgent_high)} @change=${t=>this._numberChanged("urgent_high",t)} /></label>
        </div>

        <div class="section-title">Colors</div>
        <div class="row">
          <label>Urgent <input type="color" .value=${t.color_urgent} @input=${t=>this._colorChanged("color_urgent",t)} /></label>
          <label>Warning <input type="color" .value=${t.color_warning} @input=${t=>this._colorChanged("color_warning",t)} /></label>
          <label>OK <input type="color" .value=${t.color_ok} @input=${t=>this._colorChanged("color_ok",t)} /></label>
        </div>

        <div class="section-title">Entity overrides</div>
        ${ft.map(e=>W`
            <label>
              ${e.replace("_"," ")}
              <input
                type="text"
                .value=${t[`${e}_entity`]||""}
                @change=${t=>this._textChanged(`${e}_entity`,t)}
                placeholder="sensor.xxx_${e}"
              />
            </label>
          `)}

        <div class="section-title">Background</div>
        <label>
          Override background color
          <input
            type="text"
            .value=${t.background_color||""}
            @change=${t=>this._textChanged("background_color",t)}
            placeholder="Leave empty for theme default"
          />
        </label>
      </div>
    `}};$t.styles=r`
    .editor {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 8px 0;
    }
    .row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .section-title {
      font-weight: 500;
      margin-top: 8px;
      opacity: 0.8;
    }
    label {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
    }
    input[type="number"],
    input[type="color"],
    input[type="text"] {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
    input[type="number"] {
      width: 70px;
    }
    input[type="color"] {
      width: 40px;
      height: 28px;
      padding: 2px;
      cursor: pointer;
    }
    select {
      padding: 4px 8px;
      border: 1px solid var(--divider-color, #ccc);
      border-radius: 4px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #000);
    }
  `,t([pt({attribute:!1})],$t.prototype,"hass",void 0),t([ut()],$t.prototype,"_config",void 0),$t=t([ht("nightscout-card-editor")],$t);const yt={DoubleUp:"⇈",SingleUp:"↑",FortyFiveUp:"↗",Flat:"→",FortyFiveDown:"↘",SingleDown:"↓",DoubleDown:"⇊","NOT COMPUTABLE":"?","RATE OUT OF RANGE":"⚠"};let vt=class extends at{constructor(){super(...arguments),this._blinking=!1,this._prevGlucose=null,this._now=Date.now()}static getConfigElement(){return document.createElement("nightscout-card-editor")}static getStubConfig(){return{...gt}}setConfig(t){this._config={...gt,...t}}getCardSize(){return 2}connectedCallback(){super.connectedCallback(),this._timeAgoInterval=setInterval(()=>{this._now=Date.now()},15e3)}disconnectedCallback(){super.disconnectedCallback(),this._timeAgoInterval&&clearInterval(this._timeAgoInterval),this._blinkTimeout&&clearTimeout(this._blinkTimeout)}updated(t){if(super.updated(t),!t.has("hass")||!this._config?.glucose_entity)return;const e=this.hass?.states[this._config.glucose_entity],s=e?.state??null;null!==this._prevGlucose&&s!==this._prevGlucose&&this._triggerBlink(e),this._prevGlucose=s}_triggerBlink(t){if(!t)return;const e=t.attributes.raw_mgdl;if(null==e)return;const s=this._getGlucoseColor(e),i=this.shadowRoot?.querySelector("ha-card");i&&(this._blinkTimeout&&clearTimeout(this._blinkTimeout),i.style.setProperty("--blink-color",s),i.classList.remove("blink"),i.offsetWidth,i.classList.add("blink"),this._blinking=!0,this._blinkTimeout=setTimeout(()=>{i.classList.remove("blink"),this._blinking=!1},2e3))}_getGlucoseColor(t){const e=this._config;return t<e.urgent_low||t>e.urgent_high?e.color_urgent:t<e.low||t>e.high?e.color_warning:e.color_ok}_getValueColor(){if(!this._config?.glucose_entity)return;const t=this.hass?.states[this._config.glucose_entity];if(!t)return;const e=t.attributes.raw_mgdl;return null!=e?this._getGlucoseColor(e):void 0}render(){if(!this._config||!this.hass)return W`<ha-card><div class="ns-not-available">Nightscout card not configured</div></ha-card>`;const t=this._config,e=t.glucose_entity?this.hass.states[t.glucose_entity]:void 0,s=t.delta_entity?this.hass.states[t.delta_entity]:void 0,i=t.iob_entity?this.hass.states[t.iob_entity]:void 0,o=t.cob_entity?this.hass.states[t.cob_entity]:void 0,n=t.last_reading_entity?this.hass.states[t.last_reading_entity]:void 0,r=e?.state,a=e?.attributes.direction,l=a?yt[a]??a:"",h=s?.state,c=s?.attributes.unit_of_measurement,d=i?.state,p=o?.state,u=this._getValueColor(),_=t.font_size,g=Math.round(.45*_),f=Math.round(.35*_),$=t.background_color?`background-color: ${t.background_color}`:"";return this._now,W`
      <ha-card style="${$}">
        <div class="ns-row">
          ${t.show_glucose&&null!=r?W`<span class="ns-glucose" style="font-size:${_}px; color:${u??"inherit"}">${r}</span>`:V}
          ${t.show_glucose&&l?W`<span class="ns-arrow" style="font-size:${Math.round(.6*_)}px; color:${u??"inherit"}">${l}</span>`:V}
          ${t.show_delta&&null!=h?W`<span class="ns-secondary" style="font-size:${g}px">Δ ${Number(h)>=0?"+":""}${h}${c?` ${c}`:""}</span>`:V}
          ${t.show_iob&&null!=d?W`<span class="ns-secondary" style="font-size:${g}px"><span class="ns-label">IOB</span>${d}</span>`:V}
          ${t.show_cob&&null!=p?W`<span class="ns-secondary" style="font-size:${g}px"><span class="ns-label">COB</span>${p}</span>`:V}
        </div>
        ${t.show_time_ago&&n?W`<div class="ns-time-ago" style="font-size:${f}px">${function(t){const e=new Date(t).getTime(),s=Date.now()-e;if(s<0)return"just now";const i=Math.floor(s/6e4);if(i<1)return"just now";if(1===i)return"1 min ago";if(i<60)return`${i} min ago`;const o=Math.floor(i/60);return 1===o?"1 hour ago":`${o} hours ago`}(n.state)}</div>`:V}
      </ha-card>
    `}};vt.styles=_t,t([pt({attribute:!1})],vt.prototype,"hass",void 0),t([ut()],vt.prototype,"_config",void 0),t([ut()],vt.prototype,"_blinking",void 0),t([ut()],vt.prototype,"_now",void 0),vt=t([ht("nightscout-card")],vt);const bt=window;bt.customCards=bt.customCards||[],bt.customCards.push({type:"nightscout-card",name:"Nightscout",description:"Glucose monitoring card for Nightscout"});export{vt as NightscoutCard};
