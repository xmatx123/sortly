(this["webpackJsonpsortly-de"]=this["webpackJsonpsortly-de"]||[]).push([[0],[,,,,,,,function(e,t,a){e.exports=a.p+"static/media/logo.3de73253.png"},,,,,,,,,function(e,t,a){e.exports=a(37)},,,,,,,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,function(e,t,a){"use strict";a.r(t);var n=a(0),l=a.n(n),r=a(11),c=a.n(r),o=a(4),s=a(41),m=a(14),i=a(2),u=a(5),d=a.n(u),E=(a(26),a(7)),b=a.n(E);var p=function(){const[e,t]=Object(n.useState)(!1),a=()=>{t(!1)};return l.a.createElement("header",{className:"header"},l.a.createElement("div",{className:"header-container"},l.a.createElement(o.b,{to:"/",className:"header-logo",onClick:a},l.a.createElement("img",{src:b.a,alt:"Sortly Logo",className:"logo-image"}),l.a.createElement("span",{className:"site-name"},"Sortly - The Sorting Game")),l.a.createElement("button",{className:"menu-button",onClick:()=>{t(!e)}},"\u2630"),l.a.createElement("nav",{className:"header-nav "+(e?"active":"")},l.a.createElement(o.b,{to:"/",className:"nav-link",onClick:a},"Home"),l.a.createElement(o.b,{to:"/game/population",className:"nav-link",onClick:a},"Population"),l.a.createElement(o.b,{to:"/game/area",className:"nav-link",onClick:a},"Area"),l.a.createElement(o.b,{to:"/leaderboard",className:"nav-link",onClick:a},"Leaderboard"))))};a(27);var g=function(){return l.a.createElement("footer",{className:"footer"},l.a.createElement("div",{className:"footer-container"},l.a.createElement("img",{src:b.a,alt:"Sortly Logo",className:"footer-logo"}),l.a.createElement("p",null,"\xa9 ",(new Date).getFullYear()," Sortly. All rights reserved.")))};a(28);var h=function(){const e=Object(i.o)();return l.a.createElement("div",{className:"homepage"},l.a.createElement("div",{className:"section population-section"},l.a.createElement("div",{className:"overlay"},l.a.createElement("h2",null,"Sort by Population"),l.a.createElement("button",{className:"button button-primary",onClick:()=>{d.a.event({category:"Game",action:"Clicked Play Population Game"}),e("/game/population")}},"Play Now"))),l.a.createElement("div",{className:"section area-section"},l.a.createElement("div",{className:"overlay"},l.a.createElement("h2",null,"Sort by Area"),l.a.createElement("button",{className:"button button-primary",onClick:()=>{d.a.event({category:"Game",action:"Clicked Play Area Game"}),e("/game/area")}},"Play Now"))),l.a.createElement("div",{className:"section coming-soon-section"},l.a.createElement("div",{className:"overlay"},l.a.createElement("h2",null,"New Game Mode"),l.a.createElement("p",null,"Coming Soon"))))};a(29);var y=function(e){let{country:t,isClickable:a,highlight:r,mode:c}=e;const[o,s]=Object(n.useState)(!1),m=r?"highlighted-"+r:"";return l.a.createElement("div",{className:`country-card ${o?"flipped":""} ${a?"clickable":""} ${m}`,onClick:()=>{a&&s(!o)}},l.a.createElement("div",{className:"card-inner"},l.a.createElement("div",{className:"card-face card-front "+m},l.a.createElement("img",{src:t.flagUrl,alt:"Flag of "+t.name,className:"country-flag"}),l.a.createElement("div",{className:"country-info"},l.a.createElement("h3",{className:"country-name"},t.name))),l.a.createElement("div",{className:"card-face card-back "+m},l.a.createElement("div",{className:"country-info"},l.a.createElement("h3",{className:"country-name"},t.name),l.a.createElement("p",{className:"country-detail"},"population"===c?"Population: "+t.population.toLocaleString():"area"===c?`Area: ${t.area.toLocaleString()} km\xb2`:"")))))};a(30);var v=function(){const[e,t]=Object(n.useState)([]),[a,r]=Object(n.useState)(null),[c,o]=Object(n.useState)([]),[s,m]=Object(n.useState)(0),[u,d]=Object(n.useState)(null),{mode:E}=Object(i.q)(),b=Object(i.o)();Object(n.useEffect)(()=>{(async()=>{const e=(await(async()=>{try{const e=await fetch("https://restcountries.com/v3.1/all"),t=(await e.json()).filter(e=>e.unMember);return t.map((e,t)=>({id:t+1,name:e.name.common||e.name.official,flagUrl:e.flags.svg||e.flags.png,population:e.population,area:e.area}))}catch(e){return console.error("Error fetching countries:",e),[]}})()).filter(e=>e.population&&e.area&&e.flagUrl);g(e)})()},[]);const p="area"===E?"area":"population",g=e=>{const a=[...e],n=Math.floor(Math.random()*a.length),l=a.splice(n,1)[0],c=Math.floor(Math.random()*a.length),s=a.splice(c,1)[0];t([l]),o(a),m(1),r(s)},h=n=>{const l=[...e];if(l.splice(n,0,a),v(l))t(l),m(e=>e+1),r(null),(()=>{if(0===c.length)return void b("/gameover",{state:{score:s,message:"Congratulations! You sorted all countries correctly.",mode:E}});const e=[...c],t=Math.floor(Math.random()*e.length),a=e.splice(t,1)[0];r(a),o(e)})();else{const t=[...[...e,a]].sort((e,t)=>e[p]-t[p]);b("/gameover",{state:{score:s,message:"Incorrect placement!",incorrectCountry:a,userOrder:l,correctOrder:t,mode:E}})}},v=e=>{for(let t=0;t<e.length-1;t++)if(e[t][p]>e[t+1][p])return!1;return!0};return l.a.createElement("div",{className:"game-page"},l.a.createElement("h2",null,"Sort Countries by ","area"===E?"Area":"Population"," (Ascending)"),l.a.createElement("p",null,"Score: ",s-1),l.a.createElement("div",{className:"sorted-countries-container"},a&&l.a.createElement("div",{className:"instructions"},l.a.createElement("p",null,"Where does ",l.a.createElement("strong",null,a.name)," fit among the sorted countries?")),l.a.createElement("div",{className:"sorted-countries"},e.map((e,t)=>l.a.createElement(y,{key:"country-"+e.id,country:e,isClickable:!0,mode:E,highlight:u===t?"hover":""}))),a&&l.a.createElement("div",{className:"insert-buttons"},l.a.createElement("button",{className:"insert-button lower-button",onClick:()=>h(0),onMouseEnter:()=>d(0),onMouseLeave:()=>d(null)},"\u2193"),e.map((t,a)=>l.a.createElement("button",{key:"insert-"+(a+1),className:"insert-button "+(a===e.length-1?"higher-button":"here-button"),onClick:()=>h(a+1),onMouseEnter:()=>d(a+1),onMouseLeave:()=>d(null)},a===e.length-1?"\u2191":a+1)))),a&&l.a.createElement("div",{className:"current-country"},l.a.createElement("h3",null,"Current Country:"),l.a.createElement(y,{country:a,isClickable:!1,mode:E})))};const N=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;const t=JSON.parse(localStorage.getItem("sortly_leaderboard")||"[]");return e?t.filter(t=>t.mode===e):t};a(31),a(32);var f=function(){const e=Object(i.m)(),t=Object(i.o)(),{score:a,message:r,incorrectCountry:c,userOrder:o,correctOrder:s,mode:m}=e.state||{},[u,d]=Object(n.useState)(""),[E,b]=Object(n.useState)(!1),[p,g]=Object(n.useState)("");return l.a.createElement("div",{className:"game-over-page"},l.a.createElement("h2",null,"Game Over"),l.a.createElement("p",null,r),l.a.createElement("p",null,"Your final score: ",a-1),E?l.a.createElement("div",{className:"submission-success"},l.a.createElement("p",null,"Score submitted successfully!")):l.a.createElement("form",{onSubmit:e=>{if(e.preventDefault(),u.trim())try{((e,t,a)=>{const n=N(),l={id:Date.now(),playerName:e,score:t,mode:a,date:(new Date).toISOString()};n.push(l),n.sort((e,t)=>t.score-e.score);const r=n.slice(0,100);localStorage.setItem("sortly_leaderboard",JSON.stringify(r))})(u,a-1,m),b(!0)}catch(t){g("Failed to submit score. Please try again.")}else g("Please enter your name")},className:"score-submission"},l.a.createElement("div",{className:"input-group"},l.a.createElement("label",{htmlFor:"playerName"},"Enter your name:"),l.a.createElement("input",{type:"text",id:"playerName",value:u,onChange:e=>d(e.target.value),placeholder:"Your name",maxLength:20})),p&&l.a.createElement("p",{className:"error"},p),l.a.createElement("button",{type:"submit",className:"button button-primary"},"Submit Score")),o&&c&&l.a.createElement("div",{className:"user-order"},l.a.createElement("h3",null,"Your order was:"),l.a.createElement("div",{className:"country-list"},o.map(e=>l.a.createElement(y,{key:e.id,country:e,isClickable:!0,highlight:e.id===c.id?"incorrect":"",mode:m})))),s&&c&&l.a.createElement("div",{className:"correct-order"},l.a.createElement("h3",null,"The correct order was:"),l.a.createElement("div",{className:"country-list"},s.map(e=>l.a.createElement(y,{key:e.id,country:e,isClickable:!0,highlight:e.id===c.id?"correct":"",mode:m})))),l.a.createElement("div",{className:"game-over-buttons"},l.a.createElement("button",{className:"button button-primary",onClick:()=>t("/game/"+m)},"Play Again"),l.a.createElement("button",{className:"button button-secondary",onClick:()=>t("/")},"Go to Home Page"),l.a.createElement("button",{className:"button button-secondary",onClick:()=>t("/leaderboard")},"View Leaderboard")))};a(33);var k=function(){const[e,t]=Object(n.useState)([]),[a,r]=Object(n.useState)(null);return Object(n.useEffect)(()=>{(()=>{const e=N(a);t(e)})()},[a]),l.a.createElement("div",{className:"leaderboard-page"},l.a.createElement("h2",null,"Leaderboard"),l.a.createElement("div",{className:"mode-filters"},l.a.createElement("button",{className:"button "+(a?"button-secondary":"button-primary"),onClick:()=>r(null)},"All Modes"),l.a.createElement("button",{className:"button "+("population"===a?"button-primary":"button-secondary"),onClick:()=>r("population")},"Population"),l.a.createElement("button",{className:"button "+("area"===a?"button-primary":"button-secondary"),onClick:()=>r("area")},"Area")),l.a.createElement("div",{className:"leaderboard-table"},l.a.createElement("table",null,l.a.createElement("thead",null,l.a.createElement("tr",null,l.a.createElement("th",null,"Rank"),l.a.createElement("th",null,"Player"),l.a.createElement("th",null,"Score"),l.a.createElement("th",null,"Mode"),l.a.createElement("th",null,"Date"))),l.a.createElement("tbody",null,e.map((e,t)=>{return l.a.createElement("tr",{key:e.id},l.a.createElement("td",null,t+1),l.a.createElement("td",null,e.playerName),l.a.createElement("td",null,e.score),l.a.createElement("td",null,e.mode.charAt(0).toUpperCase()+e.mode.slice(1)),l.a.createElement("td",null,(a=e.date,new Date(a).toLocaleDateString())));var a})))))};a(34);var S=function(){const e=Object(i.m)();return Object(n.useEffect)(()=>{d.a.initialize("G-9679TPXEBR")},[]),Object(n.useEffect)(()=>{d.a.send({hitType:"pageview",page:e.pathname})},[e.pathname]),l.a.createElement("div",{className:"App"},l.a.createElement(p,null),l.a.createElement("div",{className:"content"},l.a.createElement(i.c,null,l.a.createElement(i.a,{path:"/",element:l.a.createElement(h,null)}),l.a.createElement(i.a,{path:"/game/:mode",element:l.a.createElement(v,null)}),l.a.createElement(i.a,{path:"/gameover",element:l.a.createElement(f,null)}),l.a.createElement(i.a,{path:"/leaderboard",element:l.a.createElement(k,null)}))),l.a.createElement(g,null))};a(35);c.a.createRoot(document.getElementById("root")).render(l.a.createElement(l.a.StrictMode,null,l.a.createElement(o.a,null,l.a.createElement(s.a,{backend:m.a},l.a.createElement(S,null)))))}],[[16,1,2]]]);
//# sourceMappingURL=main.6eee2fe9.chunk.js.map