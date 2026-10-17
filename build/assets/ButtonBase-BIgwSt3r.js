import{c as e,n as t,t as n}from"./jsx-runtime-Dx9TgJjK.js";import{X as r,Z as i,_ as a,g as o,h as s,r as c,t as l,u}from"./DefaultPropsProvider-DE_wJ7lg.js";import{a as d,i as f,o as p,r as m}from"./react-is-Bzw4LM_u.js";var h=e(t()),g=typeof window<`u`?h.useLayoutEffect:h.useEffect;function _(e,t){typeof e==`function`?e(t):e&&(e.current=t)}function v(e){let t=h.useRef(e);return g(()=>{t.current=e}),h.useRef((...e)=>(0,t.current)(...e)).current}function y(...e){return h.useMemo(()=>e.every(e=>e==null)?null:t=>{e.forEach(e=>{_(e,t)})},e)}var b={};function x(e,t){let n=h.useRef(b);return n.current===b&&(n.current=e(t)),n}var S=[];function C(e){h.useEffect(e,S)}var w=class e{constructor(){this.currentId=null,this.clear=()=>{this.currentId!==null&&(clearTimeout(this.currentId),this.currentId=null)},this.disposeEffect=()=>this.clear}static create(){return new e}start(e,t){this.clear(),this.currentId=setTimeout(()=>{this.currentId=null,t()},e)}};function T(){let e=x(w.create).current;return C(e.disposeEffect),e}var E=!0,D=!1,O=new w,ee={text:!0,search:!0,url:!0,tel:!0,email:!0,password:!0,number:!0,date:!0,month:!0,week:!0,time:!0,datetime:!0,"datetime-local":!0};function te(e){let{type:t,tagName:n}=e;return!!(n===`INPUT`&&ee[t]&&!e.readOnly||n===`TEXTAREA`&&!e.readOnly||e.isContentEditable)}function ne(e){e.metaKey||e.altKey||e.ctrlKey||(E=!0)}function k(){E=!1}function A(){this.visibilityState===`hidden`&&D&&(E=!0)}function re(e){e.addEventListener(`keydown`,ne,!0),e.addEventListener(`mousedown`,k,!0),e.addEventListener(`pointerdown`,k,!0),e.addEventListener(`touchstart`,k,!0),e.addEventListener(`visibilitychange`,A,!0)}function j(e){let{target:t}=e;try{return t.matches(`:focus-visible`)}catch{}return E||te(t)}function M(){let e=h.useCallback(e=>{e!=null&&re(e.ownerDocument)},[]),t=h.useRef(!1);function n(){return t.current?(D=!0,O.start(100,()=>{D=!1}),t.current=!1,!0):!1}function r(e){return j(e)?(t.current=!0,!0):!1}return{isFocusVisibleRef:t,onFocus:r,onBlur:n,ref:e}}p(),f();var N=v,P=y,ie=M;function F(e,t){return F=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},F(e,t)}function I(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,F(e,t)}var L=h.createContext(null);function R(e){if(e===void 0)throw ReferenceError(`this hasn't been initialised - super() hasn't been called`);return e}function z(e,t){var n=function(e){return t&&(0,h.isValidElement)(e)?t(e):e},r=Object.create(null);return e&&h.Children.map(e,function(e){return e}).forEach(function(e){r[e.key]=n(e)}),r}function ae(e,t){e||={},t||={};function n(n){return n in t?t[n]:e[n]}var r=Object.create(null),i=[];for(var a in e)a in t?i.length&&(r[a]=i,i=[]):i.push(a);var o,s={};for(var c in t){if(r[c])for(o=0;o<r[c].length;o++){var l=r[c][o];s[r[c][o]]=n(l)}s[c]=n(c)}for(o=0;o<i.length;o++)s[i[o]]=n(i[o]);return s}function B(e,t,n){return n[t]==null?e.props[t]:n[t]}function V(e,t){return z(e.children,function(n){return(0,h.cloneElement)(n,{onExited:t.bind(null,n),in:!0,appear:B(n,`appear`,e),enter:B(n,`enter`,e),exit:B(n,`exit`,e)})})}function H(e,t,n){var r=z(e.children),i=ae(t,r);return Object.keys(i).forEach(function(a){var o=i[a];if((0,h.isValidElement)(o)){var s=a in t,c=a in r,l=t[a],u=(0,h.isValidElement)(l)&&!l.props.in;c&&(!s||u)?i[a]=(0,h.cloneElement)(o,{onExited:n.bind(null,o),in:!0,exit:B(o,`exit`,e),enter:B(o,`enter`,e)}):!c&&s&&!u?i[a]=(0,h.cloneElement)(o,{in:!1}):c&&s&&(0,h.isValidElement)(l)&&(i[a]=(0,h.cloneElement)(o,{onExited:n.bind(null,o),in:l.props.in,exit:B(o,`exit`,e),enter:B(o,`enter`,e)}))}}),i}var U=Object.values||function(e){return Object.keys(e).map(function(t){return e[t]})},oe={component:`div`,childFactory:function(e){return e}},W=function(e){I(t,e);function t(t,n){var r=e.call(this,t,n)||this;return r.state={contextValue:{isMounting:!0},handleExited:r.handleExited.bind(R(r)),firstRender:!0},r}var n=t.prototype;return n.componentDidMount=function(){this.mounted=!0,this.setState({contextValue:{isMounting:!1}})},n.componentWillUnmount=function(){this.mounted=!1},t.getDerivedStateFromProps=function(e,t){var n=t.children,r=t.handleExited;return{children:t.firstRender?V(e,r):H(e,n,r),firstRender:!1}},n.handleExited=function(e,t){var n=z(this.props.children);e.key in n||(e.props.onExited&&e.props.onExited(t),this.mounted&&this.setState(function(t){var n=d({},t.children);return delete n[e.key],{children:n}}))},n.render=function(){var e=this.props,t=e.component,n=e.childFactory,r=m(e,[`component`,`childFactory`]),i=this.state.contextValue,a=U(this.state.children).map(n);return delete r.appear,delete r.enter,delete r.exit,t===null?h.createElement(L.Provider,{value:i},a):h.createElement(L.Provider,{value:i},h.createElement(t,r,a))},t}(h.Component);W.propTypes={},W.defaultProps=oe;var G=n();function K(e){let{className:t,classes:n,pulsate:r=!1,rippleX:i,rippleY:o,rippleSize:s,in:c,onExited:l,timeout:u}=e,[d,f]=h.useState(!1),p=a(t,n.ripple,n.rippleVisible,r&&n.ripplePulsate),m={width:s,height:s,top:-(s/2)+o,left:-(s/2)+i},g=a(n.child,d&&n.childLeaving,r&&n.childPulsate);return!c&&!d&&f(!0),h.useEffect(()=>{if(!c&&l!=null){let e=setTimeout(l,u);return()=>{clearTimeout(e)}}},[l,c,u]),(0,G.jsx)(`span`,{className:p,style:m,children:(0,G.jsx)(`span`,{className:g})})}var q=s(`MuiTouchRipple`,[`root`,`ripple`,`rippleVisible`,`ripplePulsate`,`child`,`childLeaving`,`childPulsate`]);p(),f(),r();var se=[`center`,`classes`,`className`],J=e=>e,ce,le,ue,de,Y=550,fe=i(ce||=J`
  0% {
    transform: scale(0);
    opacity: 0.1;
  }

  100% {
    transform: scale(1);
    opacity: 0.3;
  }
`),pe=i(le||=J`
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
`),X=i(ue||=J`
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(0.92);
  }

  100% {
    transform: scale(1);
  }
`),Z=c(`span`,{name:`MuiTouchRipple`,slot:`Root`})({overflow:`hidden`,pointerEvents:`none`,position:`absolute`,zIndex:0,top:0,right:0,bottom:0,left:0,borderRadius:`inherit`}),me=c(K,{name:`MuiTouchRipple`,slot:`Ripple`})(de||=J`
  opacity: 0;
  position: absolute;

  &.${0} {
    opacity: 0.3;
    transform: scale(1);
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  &.${0} {
    animation-duration: ${0}ms;
  }

  & .${0} {
    opacity: 1;
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: currentColor;
  }

  & .${0} {
    opacity: 0;
    animation-name: ${0};
    animation-duration: ${0}ms;
    animation-timing-function: ${0};
  }

  & .${0} {
    position: absolute;
    /* @noflip */
    left: 0px;
    top: 0;
    animation-name: ${0};
    animation-duration: 2500ms;
    animation-timing-function: ${0};
    animation-iteration-count: infinite;
    animation-delay: 200ms;
  }
`,q.rippleVisible,fe,Y,({theme:e})=>e.transitions.easing.easeInOut,q.ripplePulsate,({theme:e})=>e.transitions.duration.shorter,q.child,q.childLeaving,pe,Y,({theme:e})=>e.transitions.easing.easeInOut,q.childPulsate,X,({theme:e})=>e.transitions.easing.easeInOut),he=h.forwardRef(function(e,t){let n=l({props:e,name:`MuiTouchRipple`}),{center:r=!1,classes:i={},className:o}=n,s=m(n,se),[c,u]=h.useState([]),f=h.useRef(0),p=h.useRef(null);h.useEffect(()=>{p.current&&=(p.current(),null)},[c]);let g=h.useRef(!1),_=T(),v=h.useRef(null),y=h.useRef(null),b=h.useCallback(e=>{let{pulsate:t,rippleX:n,rippleY:r,rippleSize:o,cb:s}=e;u(e=>[...e,(0,G.jsx)(me,{classes:{ripple:a(i.ripple,q.ripple),rippleVisible:a(i.rippleVisible,q.rippleVisible),ripplePulsate:a(i.ripplePulsate,q.ripplePulsate),child:a(i.child,q.child),childLeaving:a(i.childLeaving,q.childLeaving),childPulsate:a(i.childPulsate,q.childPulsate)},timeout:Y,pulsate:t,rippleX:n,rippleY:r,rippleSize:o},f.current)]),f.current+=1,p.current=s},[i]),x=h.useCallback((e={},t={},n=()=>{})=>{let{pulsate:i=!1,center:a=r||t.pulsate,fakeElement:o=!1}=t;if(e?.type===`mousedown`&&g.current){g.current=!1;return}e?.type===`touchstart`&&(g.current=!0);let s=o?null:y.current,c=s?s.getBoundingClientRect():{width:0,height:0,left:0,top:0},l,u,d;if(a||e===void 0||e.clientX===0&&e.clientY===0||!e.clientX&&!e.touches)l=Math.round(c.width/2),u=Math.round(c.height/2);else{let{clientX:t,clientY:n}=e.touches&&e.touches.length>0?e.touches[0]:e;l=Math.round(t-c.left),u=Math.round(n-c.top)}if(a)d=Math.sqrt((2*c.width**2+c.height**2)/3),d%2==0&&(d+=1);else{let e=Math.max(Math.abs((s?s.clientWidth:0)-l),l)*2+2,t=Math.max(Math.abs((s?s.clientHeight:0)-u),u)*2+2;d=Math.sqrt(e**2+t**2)}e!=null&&e.touches?v.current===null&&(v.current=()=>{b({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:n})},_.start(80,()=>{v.current&&=(v.current(),null)})):b({pulsate:i,rippleX:l,rippleY:u,rippleSize:d,cb:n})},[r,b,_]),S=h.useCallback(()=>{x({},{pulsate:!0})},[x]),C=h.useCallback((e,t)=>{if(_.clear(),e?.type===`touchend`&&v.current){v.current(),v.current=null,_.start(0,()=>{C(e,t)});return}v.current=null,u(e=>e.length>0?e.slice(1):e),p.current=t},[_]);return h.useImperativeHandle(t,()=>({pulsate:S,start:x,stop:C}),[S,x,C]),(0,G.jsx)(Z,d({className:a(q.root,i.root,o),ref:y},s,{children:(0,G.jsx)(W,{component:null,exit:!0,children:c})}))});function ge(e){return o(`MuiButtonBase`,e)}var Q=s(`MuiButtonBase`,[`root`,`disabled`,`focusVisible`]);p(),f();var _e=`action.centerRipple.children.className.component.disabled.disableRipple.disableTouchRipple.focusRipple.focusVisibleClassName.LinkComponent.onBlur.onClick.onContextMenu.onDragLeave.onFocus.onFocusVisible.onKeyDown.onKeyUp.onMouseDown.onMouseLeave.onMouseUp.onTouchEnd.onTouchMove.onTouchStart.tabIndex.TouchRippleProps.touchRippleRef.type`.split(`.`),ve=e=>{let{disabled:t,focusVisible:n,focusVisibleClassName:r,classes:i}=e,a=u({root:[`root`,t&&`disabled`,n&&`focusVisible`]},ge,i);return n&&r&&(a.root+=` ${r}`),a},ye=c(`button`,{name:`MuiButtonBase`,slot:`Root`,overridesResolver:(e,t)=>t.root})({display:`inline-flex`,alignItems:`center`,justifyContent:`center`,position:`relative`,boxSizing:`border-box`,WebkitTapHighlightColor:`transparent`,backgroundColor:`transparent`,outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:`pointer`,userSelect:`none`,verticalAlign:`middle`,MozAppearance:`none`,WebkitAppearance:`none`,textDecoration:`none`,color:`inherit`,"&::-moz-focus-inner":{borderStyle:`none`},[`&.${Q.disabled}`]:{pointerEvents:`none`,cursor:`default`},"@media print":{colorAdjust:`exact`}}),$=h.forwardRef(function(e,t){let n=l({props:e,name:`MuiButtonBase`}),{action:r,centerRipple:i=!1,children:o,className:s,component:c=`button`,disabled:u=!1,disableRipple:f=!1,disableTouchRipple:p=!1,focusRipple:g=!1,LinkComponent:_=`a`,onBlur:v,onClick:y,onContextMenu:b,onDragLeave:x,onFocus:S,onFocusVisible:C,onKeyDown:w,onKeyUp:T,onMouseDown:E,onMouseLeave:D,onMouseUp:O,onTouchEnd:ee,onTouchMove:te,onTouchStart:ne,tabIndex:k=0,TouchRippleProps:A,touchRippleRef:re,type:j}=n,M=m(n,_e),F=h.useRef(null),I=h.useRef(null),L=P(I,re),{isFocusVisibleRef:R,onFocus:z,onBlur:ae,ref:B}=ie(),[V,H]=h.useState(!1);u&&V&&H(!1),h.useImperativeHandle(r,()=>({focusVisible:()=>{H(!0),F.current.focus()}}),[]);let[U,oe]=h.useState(!1);h.useEffect(()=>{oe(!0)},[]);let W=U&&!f&&!u;h.useEffect(()=>{V&&g&&!f&&U&&I.current.pulsate()},[f,g,V,U]);function K(e,t,n=p){return N(r=>(t&&t(r),!n&&I.current&&I.current[e](r),!0))}let q=K(`start`,E),se=K(`stop`,b),J=K(`stop`,x),ce=K(`stop`,O),le=K(`stop`,e=>{V&&e.preventDefault(),D&&D(e)}),ue=K(`start`,ne),de=K(`stop`,ee),Y=K(`stop`,te),fe=K(`stop`,e=>{ae(e),R.current===!1&&H(!1),v&&v(e)},!1),pe=N(e=>{F.current||=e.currentTarget,z(e),R.current===!0&&(H(!0),C&&C(e)),S&&S(e)}),X=()=>{let e=F.current;return c&&c!==`button`&&!(e.tagName===`A`&&e.href)},Z=h.useRef(!1),me=N(e=>{g&&!Z.current&&V&&I.current&&e.key===` `&&(Z.current=!0,I.current.stop(e,()=>{I.current.start(e)})),e.target===e.currentTarget&&X()&&e.key===` `&&e.preventDefault(),w&&w(e),e.target===e.currentTarget&&X()&&e.key===`Enter`&&!u&&(e.preventDefault(),y&&y(e))}),ge=N(e=>{g&&e.key===` `&&I.current&&V&&!e.defaultPrevented&&(Z.current=!1,I.current.stop(e,()=>{I.current.pulsate(e)})),T&&T(e),y&&e.target===e.currentTarget&&X()&&e.key===` `&&!e.defaultPrevented&&y(e)}),Q=c;Q===`button`&&(M.href||M.to)&&(Q=_);let $={};Q===`button`?($.type=j===void 0?`button`:j,$.disabled=u):(!M.href&&!M.to&&($.role=`button`),u&&($[`aria-disabled`]=u));let be=P(t,B,F),xe=d({},n,{centerRipple:i,component:c,disabled:u,disableRipple:f,disableTouchRipple:p,focusRipple:g,tabIndex:k,focusVisible:V}),Se=ve(xe);return(0,G.jsxs)(ye,d({as:Q,className:a(Se.root,s),ownerState:xe,onBlur:fe,onClick:y,onContextMenu:se,onFocus:pe,onKeyDown:me,onKeyUp:ge,onMouseDown:q,onMouseLeave:le,onMouseUp:ce,onDragLeave:J,onTouchEnd:de,onTouchMove:Y,onTouchStart:ue,ref:be,tabIndex:u?-1:k,type:j},$,M,{children:[o,W?(0,G.jsx)(he,d({ref:L,center:i},A)):null]}))});export{ie as a,w as c,v as d,_ as f,I as i,T as l,W as n,P as o,g as p,L as r,N as s,$ as t,y as u};