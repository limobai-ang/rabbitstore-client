<template>
  <div class="login-callback">
    <LoginHeader>联合登录</LoginHeader>
    <section class="container" v-if="isBind">
      <nav class="tab">
        <a
          @click="hasAccount = true"
          :class="{ active: hasAccount }"
          href="javascript:;"
        >
          <i class="iconfont icon-bind" />
          <span>已有小兔鲜账号，请绑定手机</span>
        </a>
        <a
          @click="hasAccount = false"
          :class="{ active: !hasAccount }"
          href="javascript:;"
        >
          <i class="iconfont icon-edit" />
          <span>没有小兔鲜账号，请完善资料</span>
        </a>
      </nav>
      <div class="tab-content" v-if="hasAccount">
        <CallbackBind :openId="unionId"/>
      </div>
      <div class="tab-content" v-else>
        <CallbackPatch :openId="unionId"/>
      </div>
    </section>
    <section class="container" v-else>
      <div class="unbind">
        <div class="loading"></div>
      </div>
    </section>
    <LoginFooter />
  </div>
</template>

<script>
import LoginHeader from './components/LoginHeaders.vue'
import LoginFooter from './components/LoginFooter.vue'
import CallbackBind from './components/CallbackBind.vue'
import CallbackPatch from './components/CallbackPatch.vue'
import { ref } from 'vue-demi'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import { userQQLogin } from '@/api/user'
// 提示方法
import Message from '@/components/library/Message'
// 导入qq登录变量
import QC from 'qc'

export default {
  name: 'Callback',
  components: {
    LoginHeader,
    LoginFooter,
    CallbackBind,
    CallbackPatch
  },
  setup () {
    // 有账号和没有账号之间切换
    const hasAccount = ref(true)
    // 登录成功和失败时的切换
    const isBind = ref(false)
    // 保存的openId
    const unionId = ref(null)

    const router = useRouter()
    const route = useRoute()
    const store = useStore()

    // 通过QQ的API获取openId就是后台需要的unionId 然后去登录
    // 如果成功: 登录成功
    // 如果失败: 改QQ未和小兔仙进行绑定（有账号未绑定QQ，没有账号未绑定QQ）

    // QC.Login.check() 判断qq是否登录
    if (QC.Login.check()) {
      // 获取qq唯一标识 向后台发送第三方登录请求
      QC.Login.getMe((openId) => {
        unionId.value = openId
        // 发送登录请求
        userQQLogin(openId, 1)
          .then((res) => {
            // 登录成功 (储存用户信息， 跳转到来源页或者首页， 成功提示)
            console.log(res)
            // 1. 存储信息 (将数据保存到vuex并持久化)
            const { id, account, nickname, avatar, token, mobile } = res.result
            store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })

            // 合并购物车操作
            store.dispatch('cart/mergeLocalCart').then(() => {
              // 2. 提示
              Message({ type: 'success', text: '登录成功' })
              // 3. 跳转
              router.push(route.query.redirectUrl || '/')
            })
          })
          .catch((err) => {
            // 登录失败
            console.log(err, '登录失败')
            isBind.value = true
          })
      })
    }

    return {
      hasAccount,
      isBind,
      unionId
    }
  }
}
</script>

<style scoped lang='less'>
  .container {
    padding: 25px 0;
    position: relative;
    height: 730px;
    .unbind {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      padding: 25px 0;
      z-index: 99;
      .loading {
        height: 100%;
        background: #fff url(../../assets/images/load.gif) no-repeat center /
          100px 100px;
      }
    }
  }
  .tab {
    background: #fff;
    height: 80px;
    padding-top: 40px;
    font-size: 18px;
    text-align: center;
    a {
      color: #666;
      display: inline-block;
      width: 350px;
      line-height: 40px;
      border-bottom: 2px solid #e4e4e4;
      i {
        font-size: 22px;
        vertical-align: middle;
      }
      span {
        vertical-align: middle;
        margin-left: 4px;
      }
      &.active {
        color: @xtxColor;
        border-color: @xtxColor;
      }
    }
  }
  .tab-content {
    min-height: 600px;
    background: #fff;
  }
</style>
