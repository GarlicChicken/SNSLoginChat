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
          <div id="viewMore" v-show="totalMessage >= viewMessage" v-on:click="viewMore">이전 대화 보기</div>
          <ul>
            <li v-for="message, index in messages" :key="message.id">
              <div v-if="viewMessage >= totalMessage - index">
                <div class="dateLine" v-if="message.dateChange==='change'">{{ message.date }}</div>
                <div v-if="message.kakaoId === kakaoId">
                  <div class="myBox">{{ message.content }}</div>
                </div>
                <div v-else>
                  <div class="yourName">{{ message.name }}</div>
                  <div class="yourContent">{{ message.content }}</div>
                </div>
              </div>
            </li>
          </ul>
        </div>
        <div id="sendMessage">
          <form v-on:submit.prevent="addMessage">         
            <input v-on:keydown="scrollMove" id="inputBox" type="text" v-model="newMessage" autocomplete="off">
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
      viewMessage: 20,
      totalMessage: null,
      update: null, // updated 한번만 사용
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
    let ref = db.collection("messages").orderBy("timestamp", "asc")
    let dateCheck = null;
    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'added'){

          let doc = change.doc
          if (dateCheck !== null && dateCheck !== doc.data().date){
            this.messages.push({ 
              name: doc.data().name,
              content: doc.data().content,
              kakaoId: doc.data().kakaoId,
              timestamp: doc.data().timestamp,
              date: doc.data().date,
              dateChange: 'change'
            })  
          }else{
            this.messages.push({
              name: doc.data().name,
              content: doc.data().content,
              kakaoId: doc.data().kakaoId,
              timestamp: doc.data().timestamp,
              date: doc.data().date
            })
          }
          dateCheck = doc.data().date;
          this.totalMessage = this.totalMessage + 1;
        }
      })
      this.isLoading=true;
    })
  },
  updated(){
    if (this.update === null){
      this.scrollMove();
      this.update = 'updated';
    }
    if (this.kakaoId !== document.getElementById('kakaoId').value){
      this.kakaoId = document.getElementById('kakaoId').value;
    }
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
        this.newMessage = null;
        this.scrollMove();
      }
    },
    scrollMove() {
      let container = document.querySelector(".readMessage");
      let scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
		},
    kakaoLogout(){
      Kakao.Auth.logout(function() {
        location.href="/";
      });
    },
    viewMore(){
      if(this.totalMessage >= this.viewMessage){
        this.viewMessage = this.viewMessage + 20;
      }
    }
  }
}
</script>

<style scoped>
  @import 'chatRoom.css';
</style>