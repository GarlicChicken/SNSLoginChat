<template>
  <section>
    <div v-show="!isLoading" class="loading">
      <div class="bounce1"></div>
      <div class="bounce2"></div>
      <div class="bounce3"></div>
    </div>
    <div v-show="isLoading" class="chatRoom">
      <h2>SNS Login Chat Room</h2>
        <div class="readMessage">
          <ul>
            <li v-for="message in messages">
              <div v-if="message.kakaoId == kakaoId">
                <div class="myBox">{{ message.content }}</div>
              </div>
              <div v-else>
                <div class="yourName">{{ message.name }}</div>
                <div class="yourContent">{{ message.content }}</div>
              </div>
            </li>
          </ul>
        </div>
        <div id="sendMessage">
          <form @submit.prevent="addMessage">         
            <input id="inputBox" type="text" v-model="newMessage" autocomplete="off">
          </form>
        </div>
        <div id="logoutButton" v-on:click="kakaoLogout">LOGOUT</div>
        <input id="kakaoName" type="hidden">
        <input id="kakaoId" type="hidden">
    </div>
  </section>
</template>

<script>
import db from '@/firebase/init'
export default {
  name: null,
  data(){
    return{
      isLoading: false,
      messages: [],
      newMessage: null,
      kakaoId: null
    }
  },
  created(){
    Kakao.API.request({
      url: '/v1/user/me',
      success: function(res) {
        document.getElementById('kakaoName').value = res.properties.nickname;
        document.getElementById('kakaoId').value = res.id;
      }
    })
    let ref = db.collection('messages')
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'added'){
          let doc = change.doc
          this.messages.push({
            id: doc.id,
            name: doc.data().name,
            content: doc.data().content,
            kakaoId: doc.data().kakaoId,
            timestamp: doc.data().timestamp
          })
          this.messages.sort(function (a, b){return a.timestamp - b.timestamp});// timestamp 기준으로 정렬
          this.isLoading=true;
        }
      })
    })
  },
  updated(){
    this.kakaoId = document.getElementById('kakaoId').value;
    this.scrollToEnd();
  },
  methods: {
    addMessage(){
      var date = Number(new Date()) // timestamp 변수
      if(this.newMessage){
        db.collection('messages').add({
          content: this.newMessage,
          name: document.getElementById('kakaoName').value,
          kakaoId: document.getElementById('kakaoId').value,
          timestamp: date
        }).catch(err => {
          console.log(err)
        })
        this.newMessage = null
      }
    },
    scrollToEnd() { // 스크롤 자동으로 포커싱 되는 함수
      var container = document.querySelector(".readMessage");
      var scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
		},
    kakaoLogout(){
      Kakao.Auth.logout(function() {
        location.href="/SNSLoginChat/";
      });
    }
  }
}
</script>

<style>
  ul{
    list-style: none;
    margin:0px;
    padding:0px;
    text-align:left;
  }
  .loading {
    margin: 20% auto 0;
    width: 70px;
    text-align: center;
  }
  .loading > div {
    width: 18px;
    height: 18px;
    background-color: rgb(70, 165, 255);
    border-radius: 100%;
    display: inline-block;
    -webkit-animation: sk-bouncedelay 1.4s infinite ease-in-out both;
    animation: sk-bouncedelay 1.4s infinite ease-in-out both;
  }
  .loading .bounce1 {
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }
  .loading .bounce2 {
    -webkit-animation-delay: -0.16s;
    animation-delay: -0.16s;
  }
  @-webkit-keyframes sk-bouncedelay {
    0%, 80%, 100% { -webkit-transform: scale(0) }
    40% { -webkit-transform: scale(1.0) }
  }
  @keyframes sk-bouncedelay {
    0%, 80%, 100% { 
      -webkit-transform: scale(0);
      transform: scale(0);
    } 40% { 
      -webkit-transform: scale(1.0);
      transform: scale(1.0);
    }
  }
  .chatRoom{
    display: inline-block;
    background-color: white;
    max-width: 500px;
    box-shadow: 0px 10px 20px rgb(104, 104, 104);
  }
  .readMessage{
    max-height: 600px;
    border: 0px;  
    margin: auto;
    background-color: rgb(135, 178, 246);
    overflow-y: scroll;
    overflow-x: hidden;
  }
  #sendMessage{
    width: 100%;
    background-color: white;
  }
  #inputBox{
    border: none;
    outline: none;
    height: 30px;
    width: 90%;
    padding: 2% 1% 2% 1%;
  }
  #logoutButton{
    cursor: pointer;
    font-size:1.7rem;
    font-weight: bold;
    width: 100%;
    padding: 8px 0px 8px 0px;
    color: #fcfcfc;
    background-color: #868686;
  }
  #logoutButton:hover{
    color: #3f3e3e;
    background-color: #cecece;
  }
  /* Content CSS */
  .myBox{
    background-color: #fcff40;
    display:inline-block;
    max-width: 70%;
    border-radius: 6px;
    padding: 5px;
    margin: 3px;  
    text-align: right;
    float: right;
    clear: both;
  }
  .yourContent{
    background-color: #ffffff;
    display:inline-block;
    max-width: 70%;
    border-radius: 6px;
    padding: 5px;
    margin: 3px;  
  }
  .yourName{
    margin-left: 5px;
    color:rgb(39, 39, 39);
  }
</style>