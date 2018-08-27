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
              <div v-if="message.date!==toDay" class="dateLine">{{toDay}}</div>
              <div v-if="message.kakaoId === kakaoId">
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
      kakaoId: null,
      toDay: String(new Date().getFullYear())+'년 '+ String(new Date().getMonth())+'월 '+String(new Date().getDate())+'일'
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
            name: doc.data().name,
            content: doc.data().content,
            kakaoId: doc.data().kakaoId,
            timestamp: doc.data().timestamp,
            date: doc.data().date
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
      let timestamp = Number(new Date()) // timestamp 변수
      if(this.newMessage){
        db.collection('messages').add({
          content: this.newMessage,
          name: document.getElementById('kakaoName').value,
          kakaoId: document.getElementById('kakaoId').value,
          timestamp: timestamp,
          date: this.toDay
        }).catch(err => {
          console.log(err)
        })
        this.newMessage = null
      }
    },
    scrollToEnd() { // 스크롤 자동으로 포커싱 되는 함수
      let container = document.querySelector(".readMessage");
      let scrollHeight = container.scrollHeight;
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

<style scoped>
  @import 'chatRoom.css';
</style>