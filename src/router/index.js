import Vue from 'vue'
import Router from 'vue-router'
import SnsLogin from '@/components/SnsLogin'
import Chat from '@/components/Chat'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/SNSLoginChat/',
      name: 'SnsLogin',
      component: SnsLogin
    },
    {
      path: '/SNSLoginChat/Chat',
      name: 'Chat',
      component: Chat,
      props: null,
      beforeEnter: (to, from, next)=> {
        if (Kakao.Auth.getAccessToken()){
          return next()
        }else {
          next('/')
        }
      }
    }
  ]
})