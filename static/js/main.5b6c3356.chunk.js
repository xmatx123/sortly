(this["webpackJsonpsortly-de"]=this["webpackJsonpsortly-de"]||[]).push([[0],[,,,,,,,,,,,,,,,,function(e,t,a){e.exports=a.p+"static/media/logo.3de73253.png"},,,,,,,,,,,function(e,t,a){e.exports=a(61)},,,,,,,,,,function(e,t,a){},,,,,function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},function(e,t,a){},,function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),c=a(20),o=a.n(c),l=a(9),s=a(65),i=a(25),m=a(3),u=a(14),d=a.n(u),p=(a(37),a(16)),g=a.n(p),v=a(13),b=a(22),E=a(5);const h=Object(b.a)({apiKey:"AIzaSyAOZkZ8FGkHv6J4xD-yckuKOasuO4zEF2c",authDomain:"sortly-1b701.firebaseapp.com",projectId:"sortly-1b701",storageBucket:"sortly-1b701.firebasestorage.app",messagingSenderId:"37869262835",appId:"1:37869262835:web:9d463c1b217727d88e6486"}),y=Object(v.b)(h),f=Object(E.f)(h);const N=Object(n.createContext)();function O(){return Object(n.useContext)(N)}function j(e){let{children:t}=e;const[a,c]=Object(n.useState)(null),[o,l]=Object(n.useState)(!0);Object(n.useEffect)(()=>Object(v.c)(y,e=>{c(e),l(!1)}),[]);const s={currentUser:a,signup:function(e,t){return Object(v.a)(y,e,t)},login:function(e,t){return Object(v.d)(y,e,t)},logout:function(){return Object(v.e)(y)}};return r.a.createElement(N.Provider,{value:s},!o&&t)}const k={getAvatarOptions:()=>[{id:"default",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=default",name:"Default"},{id:"happy",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=happy",name:"Happy"},{id:"cool",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=cool",name:"Cool"},{id:"smart",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=smart",name:"Smart"},{id:"friendly",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=friendly",name:"Friendly"},{id:"adventurous",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=adventurous",name:"Adventurous"},{id:"creative",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=creative",name:"Creative"},{id:"mysterious",url:"https://api.dicebear.com/7.x/avataaars/svg?seed=mysterious",name:"Mysterious"}]},S={async getUserProfile(e){try{const t=await Object(E.d)(Object(E.c)(f,"users",e));if(t.exists())return t.data();const a={nickname:"",country:"",avatarUrl:k.getAvatarOptions()[0].url,createdAt:new Date};return await this.updateUserProfile(e,a),a}catch(t){throw console.error("Error getting user profile:",t),t}},async updateUserProfile(e,t){try{const a=Object(E.c)(f,"users",e);await Object(E.k)(a,{...t,updatedAt:new Date},{merge:!0})}catch(a){throw console.error("Error updating user profile:",a),a}},async updateProfileField(e,t,a){try{const n=Object(E.c)(f,"users",e);await Object(E.l)(n,{[t]:a,updatedAt:new Date})}catch(n){throw console.error("Error updating profile field:",n),n}}};a(42);function C(){const{currentUser:e,login:t,signup:a,logout:c}=O(),[o,l]=Object(n.useState)(""),[s,i]=Object(n.useState)(""),[u,d]=Object(n.useState)(""),[p,g]=Object(n.useState)(!1),[v,b]=Object(n.useState)(!1),[E,h]=Object(n.useState)(null),y=Object(m.o)();return Object(n.useEffect)(()=>{(async()=>{if(e)try{const t=await S.getUserProfile(e.uid);h(t)}catch(u){console.error("Error loading user profile:",u)}})()},[e]),e?r.a.createElement("div",{className:"login-button"},r.a.createElement("div",{className:"user-profile-button",onClick:()=>y("/profile")},r.a.createElement("img",{src:(null===E||void 0===E?void 0:E.avatarUrl)||k.getAvatarOptions()[0].url,alt:"Profile",className:"header-avatar"}),r.a.createElement("span",{className:"user-name"},(null===E||void 0===E?void 0:E.nickname)||e.email)),r.a.createElement("button",{onClick:async function(){try{d(""),g(!0),await c(),y("/")}catch(u){d("Failed to log out: "+u.message)}g(!1)},disabled:p,className:"logout-button"},"Log Out")):r.a.createElement("div",{className:"login-button"},v?r.a.createElement("div",{className:"login-form"},r.a.createElement("input",{type:"email",value:o,onChange:e=>l(e.target.value),placeholder:"Email",required:!0}),r.a.createElement("input",{type:"password",value:s,onChange:e=>i(e.target.value),placeholder:"Password",required:!0}),r.a.createElement("div",{className:"login-buttons"},r.a.createElement("button",{onClick:async function(e){e.preventDefault();try{d(""),g(!0),await t(o,s),b(!1),y("/profile")}catch(u){d("Failed to log in: "+u.message)}g(!1)},disabled:p},"Login"),r.a.createElement("button",{onClick:async function(e){e.preventDefault();try{d(""),g(!0),await a(o,s),b(!1),y("/profile")}catch(u){d("Failed to create an account: "+u.message)}g(!1)},disabled:p},"Sign Up"),r.a.createElement("button",{onClick:()=>b(!1)},"Cancel")),u&&r.a.createElement("p",{style:{color:"red"}},u)):r.a.createElement("button",{onClick:()=>b(!0)},"Login / Sign Up"))}var w=function(){const[e,t]=Object(n.useState)(!1),a=()=>{t(!1)};return r.a.createElement("header",{className:"header"},r.a.createElement("div",{className:"header-container"},r.a.createElement(l.b,{to:"/",className:"header-logo",onClick:a},r.a.createElement("img",{src:g.a,alt:"Sortly Logo",className:"logo-image"}),r.a.createElement("span",{className:"site-name"},"Sortly - The Sorting Game")),r.a.createElement("button",{className:"menu-button",onClick:()=>{t(!e)}},"\u2630"),r.a.createElement("nav",{className:"header-nav "+(e?"active":"")},r.a.createElement(l.b,{to:"/",className:"nav-link",onClick:a},"Home"),r.a.createElement(l.b,{to:"/game/population",className:"nav-link",onClick:a},"Population"),r.a.createElement(l.b,{to:"/game/area",className:"nav-link",onClick:a},"Area"),r.a.createElement(l.b,{to:"/leaderboard",className:"nav-link",onClick:a},"Leaderboard"),r.a.createElement("div",{className:"nav-login"},r.a.createElement(C,null)))))};a(43);var A=function(){return r.a.createElement("footer",{className:"footer"},r.a.createElement("div",{className:"footer-container"},r.a.createElement("img",{src:g.a,alt:"Sortly Logo",className:"footer-logo"}),r.a.createElement("p",null,"\xa9 ",(new Date).getFullYear()," Sortly. All rights reserved.")))};a(44);var U=function(){const e=Object(m.o)();return r.a.createElement("div",{className:"homepage"},r.a.createElement("div",{className:"section population-section"},r.a.createElement("div",{className:"overlay"},r.a.createElement("h2",null,"Sort by Population"),r.a.createElement("button",{className:"button button-primary",onClick:()=>{d.a.event({category:"Game",action:"Clicked Play Population Game"}),e("/game/population")}},"Play Now"))),r.a.createElement("div",{className:"section area-section"},r.a.createElement("div",{className:"overlay"},r.a.createElement("h2",null,"Sort by Area"),r.a.createElement("button",{className:"button button-primary",onClick:()=>{d.a.event({category:"Game",action:"Clicked Play Area Game"}),e("/game/area")}},"Play Now"))),r.a.createElement("div",{className:"section coming-soon-section"},r.a.createElement("div",{className:"overlay"},r.a.createElement("h2",null,"New Game Mode"),r.a.createElement("p",null,"Coming Soon"))))};a(45);var P=function(e){let{country:t,isClickable:a,highlight:c,mode:o}=e;const[l,s]=Object(n.useState)(!1),i=c?"highlighted-"+c:"";return r.a.createElement("div",{className:`country-card ${l?"flipped":""} ${a?"clickable":""} ${i}`,onClick:()=>{a&&s(!l)}},r.a.createElement("div",{className:"card-inner"},r.a.createElement("div",{className:"card-face card-front "+i},r.a.createElement("img",{src:t.flagUrl,alt:"Flag of "+t.name,className:"country-flag"}),r.a.createElement("div",{className:"country-info"},r.a.createElement("h3",{className:"country-name"},t.name))),r.a.createElement("div",{className:"card-face card-back "+i},r.a.createElement("div",{className:"country-info"},r.a.createElement("h3",{className:"country-name"},t.name),r.a.createElement("p",{className:"country-detail"},{population:"Population: "+t.population.toLocaleString(),area:`Area: ${t.area.toLocaleString()} km\xb2`}[o]||"")))))};a(46);const D={population:{sorting:{bronze:{id:"population_sorting_bronze",title:"Population Bronze Sorter",description:"Correctly sort 3 countries by population",icon:"\ud83e\udd49",requirement:3},silver:{id:"population_sorting_silver",title:"Population Silver Sorter",description:"Correctly sort 7 countries by population",icon:"\ud83e\udd48",requirement:7},gold:{id:"population_sorting_gold",title:"Population Gold Sorter",description:"Correctly sort 12 countries by population",icon:"\ud83e\udd47",requirement:12},platinum:{id:"population_sorting_platinum",title:"Population Platinum Sorter",description:"Correctly sort 20 countries by population",icon:"\ud83d\udc51",requirement:20}},gameCount:{id:"population_games",title:"Population Game Master",description:"Complete 50 population sorting games",icon:"\ud83c\udfae",requirement:50}},area:{sorting:{bronze:{id:"area_sorting_bronze",title:"Area Bronze Sorter",description:"Correctly sort 3 countries by area",icon:"\ud83e\udd49",requirement:3},silver:{id:"area_sorting_silver",title:"Area Silver Sorter",description:"Correctly sort 7 countries by area",icon:"\ud83e\udd48",requirement:7},gold:{id:"area_sorting_gold",title:"Area Gold Sorter",description:"Correctly sort 12 countries by area",icon:"\ud83e\udd47",requirement:12},platinum:{id:"area_sorting_platinum",title:"Area Platinum Sorter",description:"Correctly sort 20 countries by area",icon:"\ud83d\udc51",requirement:20}},gameCount:{id:"area_games",title:"Area Game Master",description:"Complete 50 area sorting games",icon:"\ud83c\udfae",requirement:50}}},G={async getUserAchievements(e){try{const t=await Object(E.d)(Object(E.c)(f,"achievements",e));return t.exists()?t.data():null}catch(t){throw console.error("Error getting user achievements:",t),t}},async updateUserAchievements(e,t){try{await Object(E.k)(Object(E.c)(f,"achievements",e),{...t,updatedAt:Object(E.j)()},{merge:!0})}catch(a){throw console.error("Error updating user achievements:",a),a}},async checkAndUpdateAchievements(e,t,a){try{var n,r;const c=await this.getUserAchievements(e)||{},o=D[t];let l=!1;Object.values(o.sorting).forEach(e=>{!c[e.id]&&a>=e.requirement&&(c[e.id]={unlocked:!0,unlockedAt:Object(E.j)()},l=!0)});const s=o.gameCount,i=((null===(n=c[s.id])||void 0===n?void 0:n.count)||0)+1;return i>=s.requirement&&!(null===(r=c[s.id])||void 0===r?void 0:r.unlocked)?(c[s.id]={unlocked:!0,unlockedAt:Object(E.j)(),count:i},l=!0):(c[s.id]={...c[s.id],count:i},l=!0),l&&await this.updateUserAchievements(e,c),c}catch(c){throw console.error("Error checking achievements:",c),c}},getAchievementDefinitions:()=>D};var x=function(){const{currentUser:e}=O(),[t,a]=Object(n.useState)([]),[c,o]=Object(n.useState)(null),[l,s]=Object(n.useState)([]),[i,u]=Object(n.useState)(0),[d,p]=Object(n.useState)(null),{mode:g}=Object(m.q)(),v=Object(m.o)(),b=e=>{const t=Math.floor(Math.random()*e.length);return e.splice(t,1)[0]},E=Object(n.useCallback)(e=>{const t=[...e],n=b(t),r=b(t);a([n]),s(t),u(1),o(r)},[]);Object(n.useEffect)(()=>{(async()=>{const e=(await(async()=>{try{const e=await fetch("https://restcountries.com/v3.1/all");if(!e.ok)throw new Error("HTTP error! status: "+e.status);const t=await e.json();if(!Array.isArray(t))throw new Error("Invalid data format received from API");const a=t.filter(e=>{var t,a;return e.unMember&&(null===(t=e.name)||void 0===t?void 0:t.common)&&(null===(a=e.flags)||void 0===a?void 0:a.svg)&&"number"===typeof e.population&&"number"===typeof e.area});return a.map((e,t)=>({id:t+1,name:e.name.common,flagUrl:e.flags.svg,population:e.population,area:e.area}))}catch(e){throw console.error("Error fetching countries:",e),new Error("Failed to fetch countries data. Please try again later.")}})()).filter(e=>e.population&&e.area&&e.flagUrl);E(e)})()},[E]);const h="area"===g?"area":"population",y=async n=>{const r=[...t];if(r.splice(n,0,c),f(r))a(r),u(e=>e+1),o(null),(async()=>{if(0===l.length){if(console.log("Game completed successfully!"),console.log("Final score:",i),console.log("Mode:",g),e)try{console.log("Checking achievements for user:",e.uid);const t=await G.checkAndUpdateAchievements(e.uid,g,i);console.log("Updated achievements:",t)}catch(r){console.error("Error updating achievements:",r)}else console.log("No user logged in, skipping achievement update");return void v("/gameover",{state:{score:i,message:"Congratulations! You sorted all countries correctly.",mode:g}})}const t=[...l],a=Math.floor(Math.random()*t.length),n=t.splice(a,1)[0];o(n),s(t)})();else{const a=[...[...t,c]].sort((e,t)=>e[h]-t[h]);if(console.log("Game ended with incorrect placement"),console.log("Final score:",i),console.log("Mode:",g),console.log("Number of countries sorted:",i),e)try{console.log("Checking achievements for user:",e.uid);const t=await G.checkAndUpdateAchievements(e.uid,g,i);console.log("Updated achievements:",t)}catch(m){console.error("Error updating achievements:",m)}else console.log("No user logged in, skipping achievement update");v("/gameover",{state:{score:i,message:"Incorrect placement!",incorrectCountry:c,userOrder:r,correctOrder:a,mode:g}})}},f=e=>{for(let t=0;t<e.length-1;t++)if(e[t][h]>e[t+1][h])return!1;return!0};return r.a.createElement("div",{className:"game-page"},r.a.createElement("h2",null,"Sort Countries by ","area"===g?"Area":"Population"," (Ascending)"),r.a.createElement("p",null,"Score: ",i-1),r.a.createElement("div",{className:"sorted-countries-container"},c&&r.a.createElement("div",{className:"instructions"},r.a.createElement("p",null,"Where does ",r.a.createElement("strong",null,c.name)," fit among the sorted countries?")),r.a.createElement("div",{className:"sorted-countries"},t.map((e,t)=>r.a.createElement(P,{key:"country-"+e.id,country:e,isClickable:!0,mode:g,highlight:d===t?"hover":""}))),c&&r.a.createElement("div",{className:"insert-buttons"},r.a.createElement("button",{className:"insert-button lower-button",onClick:()=>y(0),onMouseEnter:()=>p(0),onMouseLeave:()=>p(null)},"\u2193"),t.map((e,a)=>r.a.createElement("button",{key:"insert-"+(a+1),className:"insert-button "+(a===t.length-1?"higher-button":"here-button"),onClick:()=>y(a+1),onMouseEnter:()=>p(a+1),onMouseLeave:()=>p(null)},a===t.length-1?"\u2191":a+1)))),c&&r.a.createElement("div",{className:"current-country"},r.a.createElement("h3",null,"Current Country:"),r.a.createElement(P,{country:c,isClickable:!1,mode:g})))};const F=function(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;const t=JSON.parse(localStorage.getItem("sortly_leaderboard")||"[]");return e?t.filter(t=>t.mode===e):t},M=["population","area"],L={async getTopGames(e,t){let a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:5;try{const n=Object(E.b)(f,"gameHistory"),r=Object(E.i)(n,Object(E.m)("userId","==",e),Object(E.m)("category","==",t),Object(E.h)("score","desc"),Object(E.g)(a));return(await Object(E.e)(r)).docs.map(e=>({id:e.id,...e.data()}))}catch(n){const r=Object(E.i)(Object(E.b)(f,"gameHistory"),Object(E.m)("userId","==",e),Object(E.m)("category","==",t));return(await Object(E.e)(r)).docs.map(e=>({id:e.id,...e.data()})).sort((e,t)=>t.score-e.score).slice(0,a)}},async getAllTopGames(e){try{const t={};return await Promise.all(M.map(async a=>{t[a]=await this.getTopGames(e,a)})),t}catch(t){return console.error("Error fetching all top games:",t),{}}},async saveGame(e,t,a,n){try{const r=n.map(e=>{let{id:t,name:a,flagUrl:n}=e;return{id:t,name:a,flagUrl:n}});await Object(E.a)(Object(E.b)(f,"gameHistory"),{userId:e,category:t,score:a,countries:r,timestamp:Object(E.j)()})}catch(r){throw console.error("Error saving game history:",r),r}}};a(47),a(48);var _=function(){const e=Object(m.m)(),t=Object(m.o)(),{currentUser:a}=O(),{score:c,message:o,incorrectCountry:l,userOrder:s,correctOrder:i,mode:u}=e.state||{},[d,p]=Object(n.useState)(""),[g,v]=Object(n.useState)(!1),[b,E]=Object(n.useState)(""),h=Object(n.useRef)(!1);return Object(n.useEffect)(()=>{(async()=>{if(a&&s&&!h.current)try{console.log("Attempting to save game history:",{userId:a.uid,mode:u,score:c-1,countriesCount:s.length}),await L.saveGame(a.uid,u,c-1,s.map(e=>({id:e.id,name:e.name,flagUrl:e.flagUrl}))),h.current=!0,console.log("Game history saved successfully")}catch(b){console.error("Error saving game history:",b)}})()},[a,s,u,c]),r.a.createElement("div",{className:"game-over-page"},r.a.createElement("h2",null,"Game Over"),r.a.createElement("p",null,o),r.a.createElement("p",null,"Your final score: ",c-1),g?r.a.createElement("div",{className:"submission-success"},r.a.createElement("p",null,"Score submitted successfully!")):r.a.createElement("form",{onSubmit:e=>{if(e.preventDefault(),d.trim())try{((e,t,a)=>{const n=F(),r={id:Date.now(),playerName:e,score:t,mode:a,date:(new Date).toISOString()};n.push(r),n.sort((e,t)=>t.score-e.score);const c=n.slice(0,100);localStorage.setItem("sortly_leaderboard",JSON.stringify(c))})(d,c-1,u),v(!0)}catch(t){E("Failed to submit score. Please try again.")}else E("Please enter your name")},className:"score-submission"},r.a.createElement("div",{className:"input-group"},r.a.createElement("label",{htmlFor:"playerName"},"Enter your name:"),r.a.createElement("input",{type:"text",id:"playerName",value:d,onChange:e=>p(e.target.value),placeholder:"Your name",maxLength:20})),b&&r.a.createElement("p",{className:"error"},b),r.a.createElement("button",{type:"submit",className:"button button-primary"},"Submit Score")),s&&l&&r.a.createElement("div",{className:"user-order"},r.a.createElement("h3",null,"Your order was:"),r.a.createElement("div",{className:"country-list"},s.map(e=>r.a.createElement(P,{key:e.id,country:e,isClickable:!0,highlight:e.id===l.id?"incorrect":"",mode:u})))),i&&l&&r.a.createElement("div",{className:"correct-order"},r.a.createElement("h3",null,"The correct order was:"),r.a.createElement("div",{className:"country-list"},i.map(e=>r.a.createElement(P,{key:e.id,country:e,isClickable:!0,highlight:e.id===l.id?"correct":"",mode:u})))),r.a.createElement("div",{className:"game-over-buttons"},r.a.createElement("button",{className:"button button-primary",onClick:()=>t("/game/"+u)},"Play Again"),r.a.createElement("button",{className:"button button-secondary",onClick:()=>t("/")},"Go to Home Page"),r.a.createElement("button",{className:"button button-secondary",onClick:()=>t("/leaderboard")},"View Leaderboard")))};const q=e=>(null===e||void 0===e?void 0:e.toDate)?e.toDate().toLocaleDateString("en-US",{year:"numeric",month:"short",day:"numeric"}):null;a(49);var I=function(){const[e,t]=Object(n.useState)([]),[a,c]=Object(n.useState)(null);return Object(n.useEffect)(()=>{(()=>{const e=F(a);t(e)})()},[a]),r.a.createElement("div",{className:"leaderboard-page"},r.a.createElement("h2",null,"Leaderboard"),r.a.createElement("div",{className:"mode-filters"},r.a.createElement("button",{className:"button "+(a?"button-secondary":"button-primary"),onClick:()=>c(null)},"All Modes"),r.a.createElement("button",{className:"button "+("population"===a?"button-primary":"button-secondary"),onClick:()=>c("population")},"Population"),r.a.createElement("button",{className:"button "+("area"===a?"button-primary":"button-secondary"),onClick:()=>c("area")},"Area")),r.a.createElement("div",{className:"leaderboard-table"},r.a.createElement("table",null,r.a.createElement("thead",null,r.a.createElement("tr",null,r.a.createElement("th",null,"Rank"),r.a.createElement("th",null,"Player"),r.a.createElement("th",null,"Score"),r.a.createElement("th",null,"Mode"),r.a.createElement("th",null,"Date"))),r.a.createElement("tbody",null,e.map((e,t)=>r.a.createElement("tr",{key:e.id},r.a.createElement("td",null,t+1),r.a.createElement("td",null,e.playerName),r.a.createElement("td",null,e.score),r.a.createElement("td",null,e.mode.charAt(0).toUpperCase()+e.mode.slice(1)),r.a.createElement("td",null,q(e.date))))))))};a(50);var T=e=>{let{avatarOptions:t,selectedAvatar:a,onSelect:n,onClose:c}=e;return r.a.createElement("div",{className:"avatar-selector"},r.a.createElement("div",{className:"avatar-grid"},t.map(e=>r.a.createElement("div",{key:e.id,className:"avatar-option "+(a===e.url?"selected":""),onClick:()=>n(e.url)},r.a.createElement("img",{src:e.url,alt:e.name}),r.a.createElement("span",null,e.name)))))};a(51);var H=e=>{let{formData:t,onSubmit:a,onChange:n,onCancel:c}=e;return r.a.createElement("form",{onSubmit:a,className:"profile-form"},r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Nickname:"),r.a.createElement("input",{type:"text",name:"nickname",value:t.nickname,onChange:n,required:!0})),r.a.createElement("div",{className:"form-group"},r.a.createElement("label",null,"Country:"),r.a.createElement("input",{type:"text",name:"country",value:t.country,onChange:n,required:!0})),r.a.createElement("div",{className:"form-actions"},r.a.createElement("button",{type:"submit",className:"save-button"},"Save Changes"),r.a.createElement("button",{type:"button",onClick:c,className:"cancel-button"},"Cancel")))};a(52);var z=e=>{let{profile:t,currentUser:a,editing:n,formData:c,avatarOptions:o,showAvatarSelector:l,onEdit:s,onAvatarSelect:i,onAvatarSelectorToggle:m,onSubmit:u,onChange:d,onCancel:p}=e;return r.a.createElement("div",{className:"profile-header"},r.a.createElement("div",{className:"avatar-container"},r.a.createElement("img",{src:(null===t||void 0===t?void 0:t.avatarUrl)||o[0].url,alt:"Profile",className:"profile-avatar"}),n&&r.a.createElement("button",{className:"change-avatar-button",onClick:m},"Change Avatar"),l&&r.a.createElement(T,{avatarOptions:o,selectedAvatar:c.avatarUrl,onSelect:i,onClose:()=>m(!1)})),r.a.createElement("div",{className:"profile-info"},r.a.createElement("div",{className:"profile-main"},n?r.a.createElement(H,{formData:c,onSubmit:u,onChange:d,onCancel:p}):r.a.createElement(r.a.Fragment,null,r.a.createElement("h1",{className:"nickname"},(null===t||void 0===t?void 0:t.nickname)||"Set your nickname"),r.a.createElement("p",{className:"email"},a.email),r.a.createElement("p",{className:"country"},(null===t||void 0===t?void 0:t.country)||"Set your country"),r.a.createElement("button",{onClick:s,className:"edit-button"},"Edit Profile")))))};a(53);var B=e=>{let{achievement:t,isUnlocked:a,unlockDate:n}=e;return r.a.createElement("div",{className:"achievement-card "+(a?"unlocked":"locked")},r.a.createElement("div",{className:"achievement-content"},r.a.createElement("div",{className:"achievement-icon"},t.icon),r.a.createElement("div",{className:"achievement-info"},r.a.createElement("h3",null,t.title),r.a.createElement("p",null,t.description),a&&n&&r.a.createElement("div",{className:"achievement-date"},"Unlocked: ",q(n)))),r.a.createElement("div",{className:"achievement-status"},a?"\u2713":"\ud83d\udd12"))};a(54);var J=e=>{let{achievementDefinitions:t,achievements:a}=e;const n=(e=>{const t=[];return Object.entries(e).forEach(e=>{let[a,n]=e;Object.entries(n.sorting).forEach(e=>{let[n,r]=e;t.push({...r,category:a,type:"sorting"})}),n.gameCount&&t.push({...n.gameCount,category:a,type:"gameCount"})}),t})(t);return r.a.createElement("div",{className:"achievements-section"},r.a.createElement("h2",null,"Achievements"),r.a.createElement("div",{className:"achievements-grid"},n.map(e=>{var t,n;return r.a.createElement(B,{key:e.id,achievement:e,isUnlocked:null===a||void 0===a||null===(t=a[e.id])||void 0===t?void 0:t.unlocked,unlockDate:null===a||void 0===a||null===(n=a[e.id])||void 0===n?void 0:n.unlockedAt})})))};a(55);var Y=e=>{var t,a;let{game:n,index:c}=e;return r.a.createElement("div",{className:"game-history-item"},r.a.createElement("div",{className:"game-rank"},"#",c+1),r.a.createElement("div",{className:"game-score"},"Score: ",n.score),r.a.createElement("div",{className:"game-mode"},n.category.charAt(0).toUpperCase()+n.category.slice(1)," Mode"),r.a.createElement("div",{className:"game-date"},(null===(t=n.timestamp)||void 0===t?void 0:t.toDate)?q(n.timestamp):"Date unavailable"),r.a.createElement("div",{className:"game-countries"},null===(a=n.countries)||void 0===a?void 0:a.map((e,t)=>r.a.createElement("div",{key:t,className:"country-item"},r.a.createElement("img",{src:e.flagUrl,alt:e.name,className:"country-flag"}),r.a.createElement("span",null,e.name)))))};a(56);var R=e=>{let{gameHistory:t}=e;const a=Object(n.useMemo)(()=>{if(!t||0===Object.keys(t).length)return[];return Object.entries(t).flatMap(e=>{let[t,a]=e;return a.map(e=>({...e,category:t}))}).filter((e,t,a)=>t===a.findIndex(t=>t.id===e.id)).sort((e,t)=>t.score-e.score).slice(0,5)},[t]);return t?0===Object.keys(t).length?r.a.createElement("div",{className:"game-history-section"},r.a.createElement("h2",null,"Best 5 Games"),r.a.createElement("p",null,"No games played yet. Start playing to see your best games here!")):r.a.createElement("div",{className:"game-history-section"},r.a.createElement("h2",null,"Best 5 Games"),r.a.createElement("div",{className:"game-history-list"},a.map((e,t)=>r.a.createElement(Y,{key:e.id,game:e,index:t})))):r.a.createElement("div",{className:"game-history-section"},r.a.createElement("h2",null,"Best 5 Games"),r.a.createElement("p",null,"Loading game history..."))};a(57);var $=()=>{const{currentUser:e}=O(),t=Object(m.o)(),[a,c]=Object(n.useState)(null),[o,l]=Object(n.useState)(null),[s,i]=Object(n.useState)(null),[u,d]=Object(n.useState)(!0),[p,g]=Object(n.useState)(""),[v,b]=Object(n.useState)(!1),[E,h]=Object(n.useState)(!1),[y,f]=Object(n.useState)({nickname:"",country:"",avatarUrl:""}),N=k.getAvatarOptions(),j=G.getAchievementDefinitions(),C=null===e||void 0===e?void 0:e.uid,w=Object(n.useCallback)(async()=>{if(C)try{const[e,t,a]=await Promise.all([S.getUserProfile(C),G.getUserAchievements(C),L.getAllTopGames(C)]);e&&(c(e),f({nickname:e.nickname||"",country:e.country||"",avatarUrl:e.avatarUrl||N[0].url})),l(t),i(a)}catch(p){g("Failed to load profile: "+p.message)}finally{d(!1)}},[C,N]);Object(n.useEffect)(()=>{e&&w()},[e,w]);return e?u?r.a.createElement("div",{className:"profile-page"},"Loading..."):r.a.createElement("div",{className:"profile-page"},r.a.createElement("div",{className:"profile-content"},r.a.createElement(z,{profile:a,currentUser:e,editing:v,formData:y,avatarOptions:N,showAvatarSelector:E,onEdit:()=>b(!0),onAvatarSelect:e=>{f(t=>({...t,avatarUrl:e})),h(!1)},onAvatarSelectorToggle:()=>h(!E),onSubmit:async t=>{t.preventDefault();try{g(""),await S.updateUserProfile(e.uid,y),c(e=>({...e,...y})),b(!1)}catch(p){g("Failed to update profile: "+p.message)}},onChange:e=>{const{name:t,value:a}=e.target;f(e=>({...e,[t]:a}))},onCancel:()=>b(!1)}),p&&r.a.createElement("div",{className:"error-message"},p),r.a.createElement(J,{achievementDefinitions:j,achievements:o}),r.a.createElement(R,{gameHistory:s}))):(t("/"),null)};const K={async addScore(e,t,a,n){try{return(await Object(E.a)(Object(E.b)(f,"scores"),{userId:e,username:t,score:a,gameMode:n,timestamp:Object(E.j)()})).id}catch(r){throw console.error("Error adding score:",r),r}},async getGlobalLeaderboard(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:10;try{const t=Object(E.i)(Object(E.b)(f,"scores"),Object(E.h)("score","desc"),e(e));return(await Object(E.e)(t)).docs.map(e=>({id:e.id,...e.data()}))}catch(t){throw console.error("Error getting leaderboard:",t),t}},async getUserBestScores(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:5;try{const a=Object(E.i)(Object(E.b)(f,"scores"),Object(E.m)("userId","==",e),Object(E.h)("score","desc"),t(t));return(await Object(E.e)(a)).docs.map(e=>({id:e.id,...e.data()}))}catch(a){throw console.error("Error getting user scores:",a),a}}};function Z(){const{currentUser:e,login:t,signup:a,logout:c}=O(),[o,l]=Object(n.useState)(""),[s,i]=Object(n.useState)(""),[m,u]=Object(n.useState)(""),[d,p]=Object(n.useState)(!1),[g,v]=Object(n.useState)(null);return r.a.createElement("div",{style:{padding:"20px"}},r.a.createElement("h2",null,"Firebase Test"),e?r.a.createElement("div",null,r.a.createElement("p",null,"Logged in as: ",e.email),r.a.createElement("button",{onClick:async function(){try{u(""),p(!0),await c()}catch(m){u("Failed to log out: "+m.message)}p(!1)},disabled:d},"Log Out"),r.a.createElement("button",{onClick:async function(){if(e)try{await K.addScore(e.uid,e.email,100,"test"),v("Score added successfully!")}catch(m){v("Failed to add score: "+m.message)}},style:{marginLeft:"10px"}},"Add Test Score"),g&&r.a.createElement("p",null,g)):r.a.createElement("div",null,r.a.createElement("form",{onSubmit:async function(e){e.preventDefault();try{u(""),p(!0),await a(o,s)}catch(m){u("Failed to create an account: "+m.message)}p(!1)}},r.a.createElement("input",{type:"email",value:o,onChange:e=>l(e.target.value),placeholder:"Email",required:!0}),r.a.createElement("input",{type:"password",value:s,onChange:e=>i(e.target.value),placeholder:"Password",required:!0}),r.a.createElement("button",{type:"submit",disabled:d},"Sign Up")),r.a.createElement("form",{onSubmit:async function(e){e.preventDefault();try{u(""),p(!0),await t(o,s)}catch(m){u("Failed to log in: "+m.message)}p(!1)},style:{marginTop:"10px"}},r.a.createElement("button",{type:"submit",disabled:d},"Log In"))),m&&r.a.createElement("p",{style:{color:"red"}},m))}a(58);var V=function(){const e=Object(m.m)();return Object(n.useEffect)(()=>{d.a.initialize("G-9679TPXEBR")},[]),Object(n.useEffect)(()=>{d.a.send({hitType:"pageview",page:e.pathname})},[e.pathname]),r.a.createElement(j,null,r.a.createElement("div",{className:"App"},r.a.createElement(w,null),r.a.createElement("div",{className:"content"},r.a.createElement(m.c,null,r.a.createElement(m.a,{path:"/",element:r.a.createElement(U,null)}),r.a.createElement(m.a,{path:"/game/:mode",element:r.a.createElement(x,null)}),r.a.createElement(m.a,{path:"/gameover",element:r.a.createElement(_,null)}),r.a.createElement(m.a,{path:"/leaderboard",element:r.a.createElement(I,null)}),r.a.createElement(m.a,{path:"/profile",element:r.a.createElement($,null)}),r.a.createElement(m.a,{path:"/test",element:r.a.createElement(Z,null)}))),r.a.createElement(A,null)))};a(59);o.a.createRoot(document.getElementById("root")).render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(l.a,null,r.a.createElement(s.a,{backend:i.a},r.a.createElement(V,null)))))}],[[27,1,2]]]);
//# sourceMappingURL=main.5b6c3356.chunk.js.map