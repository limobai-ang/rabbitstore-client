<template>
  <div class="account-box">
    <div class="toggle">
      <a @click="changeLoginWay(false)" href="javascript:;" v-if="isMsgLogin">
        <i class="iconfont icon-user"></i> 使用账号登录
      </a>
      <a @click="changeLoginWay(true)" href="javascript:;" v-else>
        <i class="iconfont icon-msg"></i> 使用短信登录
      </a>
    </div>
    <!-- validation-schema 属性绑定效验规则  v-slot="{errors}"接收错误信息对象 -->
    <Form class="form" ref="formRef"  :validation-schema="mySchema" autocomplete="off" v-slot="{errors}">
      <template v-if="!isMsgLogin">
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名或手机号" />
          </div>
          <!-- 错误提示 -->
          <div class="error" v-if="errors.account"><i class="iconfont icon-warning" />{{errors.account}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password"><i class="iconfont icon-warning" />{{errors.password}}</div>
        </div>
      </template>
      <template v-else>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <Field :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile"><i class="iconfont icon-warning" />{{errors.mobile}}</div>
        </div>
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <Field :class="{error:errors.verificationCode}" v-model="form.verificationCode" name="verificationCode" type="password" placeholder="请输入验证码" />
            <span @click="send()" class="code">
              {{time===0?'发送验证码':`${time}秒后发送`}}
            </span>
          </div>
          <div class="error" v-if="errors.verificationCode"><i class="iconfont icon-warning" />{{errors.verificationCode}}</div>
        </div>
      </template>
      <div class="form-item">
        <div class="agree">
          <!-- <AppCheckbox v-model="form.isAgree" /> -->
          <Field as="AppCheckbox" name="isAgree" v-model="form.isAgree"/>
          <span>我已同意</span>
          <a href="javascript:;">《隐私条款》</a>
          <span>和</span>
          <a href="javascript:;">《服务条款》</a>
        </div>
        <div class="error" v-if="errors.isAgree"><i class="iconfont icon-warning" />{{errors.isAgree}}</div>
      </div>
      <a href="javascript:;" class="btn" @click="login">登录</a>
    </Form>
    <div class="action">
      <!-- <span id="qqLoginBtn"></span> -->
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { ref, reactive, onUnmounted } from 'vue-demi'
import { Form, Field } from 'vee-validate'
// 导入效验规则对象
import veeSchema from '@/utils/vee-validate-schema'
// 提示方法
import Message from '@/components/library/Message'
import { userAccountLogin, userMobileLoginMsg, userMobileLogin } from '@/api/user'

import { useIntervalFn } from '@vueuse/core'

// 导入qq登录变量
// import QC from 'qc'

export default {
  name: 'LoginForm',
  components: {
    Form, Field
  },
  setup () {
    // 使用store
    const store = useStore()
    // // 使用router
    const router = useRouter()

    // 是否短信登录
    const isMsgLogin = ref(false)

    // form表单元素
    const formRef = ref(null)
    // 可以使用Form 组件提供 resetForm 方法对表单进行清除校验结果
    // formRef.value.resetForm()

    // 切换登录方式
    const changeLoginWay = (flag) => {
      isMsgLogin.value = flag
      // 重置表单
      form.isAgree = false
      form.account = null
      form.password = null
      form.mobile = null
      form.verificationCode = null
    }
    // 表单对象数据
    const form = reactive({
      isAgree: false,
      account: 'limobai',
      password: '123456',
      mobile: null,
      verificationCode: null
    })
    // 校验规则对象 （属性名和Field组件里的name属性对应）
    const mySchema = {
      isAgree: veeSchema.isAgree,
      account: veeSchema.account,
      password: veeSchema.password,
      mobile: veeSchema.mobile,
      verificationCode: veeSchema.code
    }

    // 手机号验证码登录
    // pause 暂停 resume 开始
    // useIntervalFn(回调函数,执行间隔,是否立即开启)
    const time = ref(0)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })

    // 发送短信
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      console.log(valid)
      if (valid === true) {
        // 通过
        if (time.value === 0) {
        // 没有倒计时才可以发送
          await userMobileLoginMsg(form.mobile).catch(err => err)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formRef.value.setFieldError('mobile', valid)
      }
    }

    // 登录按钮
    // 需要在点击登录的时候对整体表单进行校验
    const login = async () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
      const valid = await formRef.value.validate()
      if (!valid) return
      let data = null
      // 判断登录放方式（账号登录还是手机号登录）
      if (!isMsgLogin.value) {
        data = await userAccountLogin(form).catch(err => {
          err.isError = true
          return err
        })
        // 帐号密码登录失败
        if (data.isError) return Message({ type: 'error', text: data.response.data.message || '登录失败' })
      } else {
        // 手机号登录
        data = await userMobileLogin(form).catch(err => {
          err.isError = true
          return err
        })
        if (data.isError) return Message({ type: 'error', text: data.response.data.message || '登录失败' })
      }
      // 成功
      // 1. 存储信息 (将数据保存到vuex并持久化)
      const { id, account, nickname, avatar, token, mobile } = data.result
      store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })

      // 合并购物车操作
      store.dispatch('cart/mergeLocalCart').then(() => {
        // 2. 提示
        Message({ type: 'success', text: '登录成功' })
        // 3. 跳转
        router.push(store.state.user.redirectUrl || '/')
      })
    }

    // QQ登录
    // onMounted(() => {
    //   // 组件渲染完毕，使用QC生成QQ登录按钮(获取跳转地址)
    //   QC.Login({
    //     btnId: 'qqLoginBtn'
    //   })
    // })

    return {
      isMsgLogin,
      form,
      mySchema,
      changeLoginWay,
      formRef,
      login,
      time,
      send

    }
  }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
