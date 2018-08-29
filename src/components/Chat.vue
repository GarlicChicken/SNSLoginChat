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
          <div id="viewMore" v-show="countMessage >= viewMessage" v-on:click="viewMore">이전 대화 보기</div>
          <ul>
            <li v-for="message, index in messages" :key="message.id">
              <div v-if="viewMessage >= countMessage - index">
                <!-- 날짜 변경 출력 -->
                <div class="dateLine" v-show="message.dateChange">{{ message.date }}</div>
                <!-- 나의 메세지 -->
                <div class="myMessageBox" v-if="message.kakaoId === kakaoId">
                  <div class="myTime" v-show="message.timeChange">{{message.time}}</div>
                  <div class="myBox">{{ message.content }}</div>
                </div>
                <!-- 타인 메세지 -->
                <div v-else>
                  <div class="yourName" v-show="message.nameChange">{{ message.name }}</div>
                  <div class="yourMessageBox">
                    <div class="yourContent">{{ message.content }}</div>
                    <span class="yourTime" v-show="message.timeChange">{{message.time}}</span>
                  </div>
                </div>
                <div class="timeChangeSpace" v-show="message.timeChange"> </div>
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
      countMessage: 0,
      scrollfocus: null
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
    const week = new Array('일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일');

    ref.onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if(change.type == 'added'){
          let doc = change.doc
          let msgDate = new Date(doc.data().timestamp);
          let FullDate = msgDate.getFullYear()+'년 '+msgDate.getMonth()+'월 '+msgDate.getDate()+'일 '+ week[msgDate.getDay()];
          let msgHour = msgDate.getHours();
          let msgMinute = ('00'+msgDate.getMinutes()).slice(-2);
          if (msgHour < 12){
            msgHour = '오전 '+ msgHour; 
          }else{
            msgHour = '오후 '+ (msgHour - 12);
          }
          this.messages.push({
            name: doc.data().name,
            content: doc.data().content,
            kakaoId: doc.data().kakaoId,
            date: FullDate,
            time: msgHour + ':' + msgMinute,
            dateChange: null,
            timeChange: null,
            nameChange: null
          })
          let i = this.countMessage;
          if (i > 0){
            if(this.messages[i]['date'] !== this.messages[i-1]['date']){
              this.messages[i]['dateChange'] = 'Change';
              this.messages[i-1]['timeChange'] = 'Change';
            }else if(this.messages[i]['time'] !== this.messages[i-1]['time']){
              this.messages[i-1]['timeChange'] = 'Change';
              this.messages[i]['nameChange'] = 'Change';
            }else if(this.messages[i]['kakaoId'] !== this.messages[i-1]['kakaoId']){
              this.messages[i-1]['timeChange'] = 'Change';
              this.messages[i]['nameChange'] = 'Change';
            }
          }else{
            this.messages[i]['dateChange'] = 'Change';
            this.messages[i]['timeChange'] = 'Change';
          }
          this.countMessage++;
        }
      })
      this.isLoading=true;
    })
  },
  updated(){
    if (this.scrollfocus === null){
      this.scrollMove();
    }
    if (this.kakaoId !== document.getElementById('kakaoId').value){
      this.kakaoId = document.getElementById('kakaoId').value;
    }
  },
  methods: {
    addMessage(){
      if(this.newMessage){
        db.collection('messages').add({
          content: this.newMessage,
          name: document.getElementById('kakaoName').value,
          kakaoId: document.getElementById('kakaoId').value,
          timestamp: Number(new Date())
        }).catch(err => {
          console.log(err)
        })
        this.scrollfocus = null;
        this.newMessage = null;
      }
    },
    scrollMove() {
      let container = document.querySelector(".readMessage");
      let scrollHeight = container.scrollHeight;
      container.scrollTop = scrollHeight;
		},
    kakaoLogout(){
      Kakao.Auth.logout(function() {
        location.href="SNSLoginChat/";
      });
    },
    viewMore(){
      if(this.countMessage >= this.viewMessage){
        this.viewMessage = this.viewMessage + 20;
        this.scrollfocus = 'do not move';
      }
    }
  }
}
</script>

<style scoped>
  @import 'chatRoom.css';
</style>