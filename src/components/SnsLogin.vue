<template>
  <div id="loginForm">
    <h1>Welcome Chat Room</h1>
    <div id="kakao-login">
      <a id="kakao-login-btn"></a>
      <a href="http://developers.kakao.com/logout"></a>
    </div>
    <p>{{ feedback }}</p>
    <p>{{ message }}</p>
  </div>
</template>
<script>
export default {
  name: 'KakaoLogin',
  data(){
    return{
      feedback: null,
      message: '다른 SNS 로그인도 추가할 예정'
    }
  },
  created() {
    if(Kakao.Auth.getAccessToken()){
      this.$router.push('/SNSLoginChat/Chat')
    }
  },
  mounted() {
    Kakao.Auth.createLoginButton({
      container: '#kakao-login-btn',
      success: function(authObj)  {      
        location.href="/SNSLoginChat/";
      },
      fail: function(err) {
        this.feedback = "로그인이 정상적으로 되지 않았습니다.";
        alert(JSON.stringify(err));
      }
    })
  }
}
</script>

<style scoped>
  #loginForm{
    margin: 10%;
  }
</style>
