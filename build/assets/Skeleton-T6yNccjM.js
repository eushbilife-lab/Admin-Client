import{c as e,n as t,t as n}from"./jsx-runtime-Dx9TgJjK.js";import{X as r,Y as i,Z as a,_ as o,at as s,d as c,f as l,g as u,h as d,it as f,n as p,t as m,u as h}from"./DefaultPropsProvider-DeiGNyQe.js";import{a as g,i as _,o as v,r as y}from"./react-is-Bzw4LM_u.js";f(),c();function b(e,t=0,n=1){return l(e,t,n)}function x(e){e=e.slice(1);let t=RegExp(`.{1,${e.length>=6?2:1}}`,`g`),n=e.match(t);return n&&n[0].length===1&&(n=n.map(e=>e+e)),n?`rgb${n.length===4?`a`:``}(${n.map((e,t)=>t<3?parseInt(e,16):Math.round(parseInt(e,16)/255*1e3)/1e3).join(`, `)})`:``}function S(e){if(e.type)return e;if(e.charAt(0)===`#`)return S(x(e));let t=e.indexOf(`(`),n=e.substring(0,t);if([`rgb`,`rgba`,`hsl`,`hsla`,`color`].indexOf(n)===-1)throw Error(s(9,e));let r=e.substring(t+1,e.length-1),i;if(n===`color`){if(r=r.split(` `),i=r.shift(),r.length===4&&r[3].charAt(0)===`/`&&(r[3]=r[3].slice(1)),[`srgb`,`display-p3`,`a98-rgb`,`prophoto-rgb`,`rec-2020`].indexOf(i)===-1)throw Error(s(10,i))}else r=r.split(`,`);return r=r.map(e=>parseFloat(e)),{type:n,values:r,colorSpace:i}}function C(e){let{type:t,colorSpace:n}=e,{values:r}=e;return t.indexOf(`rgb`)===-1?t.indexOf(`hsl`)!==-1&&(r[1]=`${r[1]}%`,r[2]=`${r[2]}%`):r=r.map((e,t)=>t<3?parseInt(e,10):e),r=t.indexOf(`color`)===-1?`${r.join(`, `)}`:`${n} ${r.join(` `)}`,`${t}(${r})`}function w(e,t){return e=S(e),t=b(t),(e.type===`rgb`||e.type===`hsl`)&&(e.type+=`a`),e.type===`color`?e.values[3]=`/${t}`:e.values[3]=t,C(e)}function T(e){return String(e).match(/[\d.\-+]*\s*(.*)/)[1]||``}function E(e){return parseFloat(e)}v(),_();var D=e(t());function O(e){return u(`MuiSkeleton`,e)}d(`MuiSkeleton`,[`root`,`text`,`rectangular`,`rounded`,`circular`,`pulse`,`wave`,`withChildren`,`fitContent`,`heightAuto`]),r();var k=n(),A=[`animation`,`className`,`component`,`height`,`style`,`variant`,`width`],j=e=>e,M,N,P,F,I=e=>{let{classes:t,variant:n,animation:r,hasChildren:i,width:a,height:o}=e;return h({root:[`root`,n,r,i&&`withChildren`,i&&!a&&`fitContent`,i&&!o&&`heightAuto`]},O,t)},L=a(M||=j`
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
`),R=a(N||=j`
  0% {
    transform: translateX(-100%);
  }

  50% {
    /* +0.5s of delay between each loop */
    transform: translateX(100%);
  }

  100% {
    transform: translateX(100%);
  }
`),z=p(`span`,{name:`MuiSkeleton`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],n.animation!==!1&&t[n.animation],n.hasChildren&&t.withChildren,n.hasChildren&&!n.width&&t.fitContent,n.hasChildren&&!n.height&&t.heightAuto]}})(({theme:e,ownerState:t})=>{let n=T(e.shape.borderRadius)||`px`,r=E(e.shape.borderRadius);return g({display:`block`,backgroundColor:e.vars?e.vars.palette.Skeleton.bg:w(e.palette.text.primary,e.palette.mode===`light`?.11:.13),height:`1.2em`},t.variant===`text`&&{marginTop:0,marginBottom:0,height:`auto`,transformOrigin:`0 55%`,transform:`scale(1, 0.60)`,borderRadius:`${r}${n}/${Math.round(r/.6*10)/10}${n}`,"&:empty:before":{content:`"\\00a0"`}},t.variant===`circular`&&{borderRadius:`50%`},t.variant===`rounded`&&{borderRadius:(e.vars||e).shape.borderRadius},t.hasChildren&&{"& > *":{visibility:`hidden`}},t.hasChildren&&!t.width&&{maxWidth:`fit-content`},t.hasChildren&&!t.height&&{height:`auto`})},({ownerState:e})=>e.animation===`pulse`&&i(P||=j`
      animation: ${0} 2s ease-in-out 0.5s infinite;
    `,L),({ownerState:e,theme:t})=>e.animation===`wave`&&i(F||=j`
      position: relative;
      overflow: hidden;

      /* Fix bug in Safari https://bugs.webkit.org/show_bug.cgi?id=68196 */
      -webkit-mask-image: -webkit-radial-gradient(white, black);

      &::after {
        animation: ${0} 2s linear 0.5s infinite;
        background: linear-gradient(
          90deg,
          transparent,
          ${0},
          transparent
        );
        content: '';
        position: absolute;
        transform: translateX(-100%); /* Avoid flash during server-side hydration */
        bottom: 0;
        left: 0;
        right: 0;
        top: 0;
      }
    `,R,(t.vars||t).palette.action.hover)),B=D.forwardRef(function(e,t){let n=m({props:e,name:`MuiSkeleton`}),{animation:r=`pulse`,className:i,component:a=`span`,height:s,style:c,variant:l=`text`,width:u}=n,d=y(n,A),f=g({},n,{animation:r,component:a,variant:l,hasChildren:!!d.children}),p=I(f);return(0,k.jsx)(z,g({as:a,ref:t,className:o(p.root,i),ownerState:f},d,{style:g({width:u,height:s},c)}))});export{w as n,B as t};