webpackJsonp([1],{NHnr:function(e,a,s){"use strict";Object.defineProperty(a,"__esModule",{value:!0});var t=s("7+uW"),n={render:function(){var e=this.$createElement,a=this._self._c||e;return a("div",{attrs:{id:"app"}},[a("router-view")],1)},staticRenderFns:[]};var o=s("VU/8")({name:"App"},n,!1,function(e){s("xwbU")},null,null).exports,i=s("/ocq"),c=s("mvHQ"),r=s.n(c),d={name:"KakaoLogin",data:function(){return{feedback:null,message:"다른 SNS 로그인도 추가할 예정"}},created:function(){Kakao.Auth.getAccessToken()&&this.$router.push("/SNSLoginChat/Chat")},mounted:function(){Kakao.Auth.createLoginButton({container:"#kakao-login-btn",success:function(e){location.href="/SNSLoginChat/"},fail:function(e){this.feedback="로그인이 정상적으로 되지 않았습니다.",alert(r()(e))}})}},u={render:function(){var e=this,a=e.$createElement,s=e._self._c||a;return s("div",{attrs:{id:"loginForm"}},[s("h1",[e._v("Welcome to Chat Room")]),e._v(" "),e._m(0),e._v(" "),s("p",[e._v(e._s(e.feedback))]),e._v(" "),s("p",[e._v(e._s(e.message))])])},staticRenderFns:[function(){var e=this.$createElement,a=this._self._c||e;return a("div",{attrs:{id:"kakao-login"}},[a("a",{attrs:{id:"kakao-login-btn"}}),this._v(" "),a("a",{attrs:{href:"http://developers.kakao.com/logout"}})])}]};var m=s("VU/8")(d,u,!1,function(e){s("m2Vk")},"data-v-45b017c0",null).exports,l=s("kxiW"),g=s.n(l),v=(s("881v"),g.a.initializeApp({apiKey:"AIzaSyD3-OYWXTCzM48fiB9doDUHPm_ExHEfGlY",authDomain:"kakao-login-chat.firebaseapp.com",databaseURL:"https://kakao-login-chat.firebaseio.com",projectId:"kakao-login-chat",storageBucket:"kakao-login-chat.appspot.com",messagingSenderId:"528088283871"}));v.firestore().settings({timestampsInSnapshots:!0});var h=v.firestore(),k={name:null,data:function(){return{isLoading:!1,messages:[],newMessage:null,kakaoId:null,viewMessage:20,countMessage:0,scrollfocus:null}},created:function(){var e=this;Kakao.API.request({url:"/v1/user/me",success:function(e){document.getElementById("kakaoName").value=e.properties.nickname,document.getElementById("kakaoId").value=e.id}});var a=h.collection("messages").orderBy("timestamp","asc"),s=new Array("일요일","월요일","화요일","수요일","목요일","금요일","토요일");a.onSnapshot(function(a){a.docChanges().forEach(function(a){if("added"==a.type){var t=a.doc,n=new Date(t.data().timestamp),o=n.getFullYear()+"년 "+n.getMonth()+"월 "+n.getDate()+"일 "+s[n.getDay()],i=n.getHours(),c=("00"+n.getMinutes()).slice(-2);i=i<12?"오전 "+i:"오후 "+(i-12),e.messages.push({name:t.data().name,content:t.data().content,kakaoId:t.data().kakaoId,date:o,time:i+":"+c,dateChange:null,timeChange:null,nameChange:null});var r=e.countMessage;r>0?e.messages[r].date!==e.messages[r-1].date?(e.messages[r].dateChange="Change",e.messages[r-1].timeChange="Change"):e.messages[r].time!==e.messages[r-1].time?(e.messages[r-1].timeChange="Change",e.messages[r].nameChange="Change"):e.messages[r].kakaoId!==e.messages[r-1].kakaoId&&(e.messages[r-1].timeChange="Change",e.messages[r].nameChange="Change"):(e.messages[r].dateChange="Change",e.messages[r].timeChange="Change"),e.countMessage++}}),e.isLoading=!0})},updated:function(){null===this.scrollfocus&&this.scrollMove(),this.kakaoId!==document.getElementById("kakaoId").value&&(this.kakaoId=document.getElementById("kakaoId").value)},methods:{addMessage:function(){this.newMessage&&(h.collection("messages").add({content:this.newMessage,name:document.getElementById("kakaoName").value,kakaoId:document.getElementById("kakaoId").value,timestamp:Number(new Date)}).catch(function(e){console.log(e)}),this.scrollfocus=null,this.newMessage=null)},scrollMove:function(){var e=document.querySelector(".readMessage"),a=e.scrollHeight;e.scrollTop=a},kakaoLogout:function(){Kakao.Auth.logout(function(){location.href="/SNSLoginChat/"})},viewMore:function(){this.countMessage>=this.viewMessage&&(this.viewMessage=this.viewMessage+20,this.scrollfocus="do not move")}}},p={render:function(){var e=this,a=e.$createElement,s=e._self._c||a;return s("section",[s("div",{directives:[{name:"show",rawName:"v-show",value:!e.isLoading,expression:"!isLoading"}],staticClass:"loading"},[s("div",{staticClass:"bounce1"}),e._v(" "),s("div",{staticClass:"bounce2"}),e._v(" "),s("div",{staticClass:"bounce3"})]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:e.isLoading,expression:"isLoading"}],staticClass:"chatRoom"},[s("h2",[e._v("SNS Login Chat Room")]),e._v(" "),s("div",{staticClass:"readMessage"},[s("div",{directives:[{name:"show",rawName:"v-show",value:e.countMessage>=e.viewMessage,expression:"countMessage >= viewMessage"}],attrs:{id:"viewMore"},on:{click:e.viewMore}},[e._v("이전 대화 보기")]),e._v(" "),s("ul",e._l(e.messages,function(a,t){return s("li",{key:a.id},[e.viewMessage>=e.countMessage-t?s("div",[s("div",{directives:[{name:"show",rawName:"v-show",value:a.dateChange,expression:"message.dateChange"}],staticClass:"dateLine"},[e._v(e._s(a.date))]),e._v(" "),a.kakaoId===e.kakaoId?s("div",{staticClass:"myMessageBox"},[s("div",{directives:[{name:"show",rawName:"v-show",value:a.timeChange,expression:"message.timeChange"}],staticClass:"myTime"},[e._v(e._s(a.time))]),e._v(" "),s("div",{staticClass:"myBox"},[e._v(e._s(a.content))])]):s("div",[s("div",{directives:[{name:"show",rawName:"v-show",value:a.nameChange,expression:"message.nameChange"}],staticClass:"yourName"},[e._v(e._s(a.name))]),e._v(" "),s("div",{staticClass:"yourMessageBox"},[s("div",{staticClass:"yourContent"},[e._v(e._s(a.content))]),e._v(" "),s("span",{directives:[{name:"show",rawName:"v-show",value:a.timeChange,expression:"message.timeChange"}],staticClass:"yourTime"},[e._v(e._s(a.time))])])]),e._v(" "),s("div",{directives:[{name:"show",rawName:"v-show",value:a.timeChange,expression:"message.timeChange"}],staticClass:"timeChangeSpace"})]):e._e()])}))]),e._v(" "),s("div",{attrs:{id:"sendMessage"}},[s("form",{on:{submit:function(a){return a.preventDefault(),e.addMessage(a)}}},[s("input",{directives:[{name:"model",rawName:"v-model",value:e.newMessage,expression:"newMessage"}],attrs:{id:"inputBox",type:"text",autocomplete:"off"},domProps:{value:e.newMessage},on:{keydown:e.scrollMove,input:function(a){a.target.composing||(e.newMessage=a.target.value)}}})])]),e._v(" "),s("div",{attrs:{id:"logoutButton"},on:{click:e.kakaoLogout}},[e._v("LOGOUT")]),e._v(" "),s("input",{attrs:{id:"kakaoName",type:"hidden"}}),e._v(" "),s("input",{attrs:{id:"kakaoId",type:"hidden"}})])])},staticRenderFns:[]};var f=s("VU/8")(k,p,!1,function(e){s("umlj")},"data-v-e13805d6",null).exports;t.a.use(i.a);var C=new i.a({mode:"history",routes:[{path:"/SNSLoginChat/",name:"SnsLogin",component:m},{path:"/SNSLoginChat/Chat",name:"Chat",component:f,props:null,beforeEnter:function(e,a,s){if(Kakao.Auth.getAccessToken())return s();s("/")}}]});t.a.config.productionTip=!1,Kakao.init("da3bfaf021be62d706493fc7d38f906b"),new t.a({el:"#app",router:C,components:{App:o},template:"<App/>"})},m2Vk:function(e,a){},umlj:function(e,a){},xwbU:function(e,a){}},["NHnr"]);
//# sourceMappingURL=app.3f4ead4c779949c4432f.js.map