import{c as e,n as t,t as n}from"./jsx-runtime-Dx9TgJjK.js";import{X as r,Y as i,Z as a,_ as o,g as s,h as c,n as l,t as u,u as d}from"./DefaultPropsProvider-DeiGNyQe.js";import{a as f,i as p,o as m,r as h}from"./react-is-Bzw4LM_u.js";import{l as g}from"./Button-CG6IRxjS.js";m(),p();var _=e(t());function v(e){return s(`MuiCircularProgress`,e)}c(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]),r();var y=n(),b=[`className`,`color`,`disableShrink`,`size`,`style`,`thickness`,`value`,`variant`],x=e=>e,S,C,w,T,E=44,D=a(S||=x`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`),O=a(C||=x`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`),k=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e,a={root:[`root`,n,`color${g(r)}`],svg:[`svg`],circle:[`circle`,`circle${g(n)}`,i&&`circleDisableShrink`]};return d(a,v,t)},A=l(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${g(n.color)}`]]}})(({ownerState:e,theme:t})=>f({display:`inline-block`},e.variant===`determinate`&&{transition:t.transitions.create(`transform`)},e.color!==`inherit`&&{color:(t.vars||t).palette[e.color].main}),({ownerState:e})=>e.variant===`indeterminate`&&i(w||=x`
      animation: ${0} 1.4s linear infinite;
    `,D)),j=l(`svg`,{name:`MuiCircularProgress`,slot:`Svg`,overridesResolver:(e,t)=>t.svg})({display:`block`}),M=l(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,t[`circle${g(n.variant)}`],n.disableShrink&&t.circleDisableShrink]}})(({ownerState:e,theme:t})=>f({stroke:`currentColor`},e.variant===`determinate`&&{transition:t.transitions.create(`stroke-dashoffset`)},e.variant===`indeterminate`&&{strokeDasharray:`80px, 200px`,strokeDashoffset:0}),({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink&&i(T||=x`
      animation: ${0} 1.4s ease-in-out infinite;
    `,O)),N=_.forwardRef(function(e,t){let n=u({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,size:s=40,style:c,thickness:l=3.6,value:d=0,variant:p=`indeterminate`}=n,m=h(n,b),g=f({},n,{color:i,disableShrink:a,size:s,thickness:l,value:d,variant:p}),_=k(g),v={},x={},S={};if(p===`determinate`){let e=2*Math.PI*((E-l)/2);v.strokeDasharray=e.toFixed(3),S[`aria-valuenow`]=Math.round(d),v.strokeDashoffset=`${((100-d)/100*e).toFixed(3)}px`,x.transform=`rotate(-90deg)`}return(0,y.jsx)(A,f({className:o(_.root,r),style:f({width:s,height:s},x,c),ownerState:g,ref:t,role:`progressbar`},S,m,{children:(0,y.jsx)(j,{className:_.svg,ownerState:g,viewBox:`${E/2} ${E/2} ${E} ${E}`,children:(0,y.jsx)(M,{className:_.circle,style:v,ownerState:g,cx:E,cy:E,r:(E-l)/2,fill:`none`,strokeWidth:l})})}))});export{N as t};