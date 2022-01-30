<template>
  <Form class="app-form" ref="formRef" :validation-schema="mySchema" v-slot="{errors}">
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-user"></i>
        <Field class="input" name="account" v-model="form.account" type="text" placeholder="请输入用户名" />
      </div>
      <div class="error" v-if="errors.account">{{errors.account}}</div>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field class="input" name="mobile" v-model="form.mobile" type="text" placeholder="请输入手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field class="input" name="code" v-model="form.code" type="text" placeholder="请输入验证码" />
        <span class="code" @click="send">发送验证码</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" name="password" v-model="form.password" type="password" placeholder="请输入密码" />
      </div>
      <div class="error" v-if="errors.password">{{errors.password}}</div>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-lock"></i>
        <Field class="input" name="confirmPassword" v-model="form.confirmPassword" type="password" placeholder="请确认密码" />
      </div>
      <div class="error" v-if="errors.confirmPassword">{{errors.confirmPassword}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即提交</a>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate'
import { reactive, onUnmounted, ref } from 'vue-demi'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
// 导入效验规则对象
import veeSchema from '@/utils/vee-validate-schema'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQPatchCode, userQQPatchLogin } from '@/api/user'

export default {
  name: 'CallbackPatch',
  components: {
    Form, Field
  },
  props: {
    openId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 使用store router
    const store = useStore()
    const router = useRouter()

    const formRef = ref(null)

    // 表单
    const form = reactive({
      account: '',
      mobile: '',
      code: '',
      password: '',
      confirmPassword: ''
    })

    // 校验规则对象 （属性名和Field组件里的name属性对应）
    const mySchema = {
      account: veeSchema.accountConfirm,
      mobile: veeSchema.mobile,
      code: veeSchema.code,
      password: veeSchema.password,
      confirmPassword: (value) => {
        if (!value) return '请再次输入密码'
        if (value !== form.password) return '两次密码输入不一致'
        return true
      }
    }

    // 发送验证码验证
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
      if (valid === true) {
        // 通过
        if (time.value === 0) {
        // 没有倒计时才可以发送
          // 发送请求
          const res = await userQQPatchCode(form.mobile).catch(err => err)
          if (res.code !== '1') return
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formRef.value.setFieldError('mobile', valid)
      }
    }

    // 完善信息
    const submit = async () => {
      const valid = formRef.value.validate()
      if (valid) {
        userQQPatchLogin({
          unionId: props.openId,
          ...form
        }).then(data => {
          // 实现和之前登录一样的逻辑
          // 1. 存储用户信息
          const { id, account, avatar, mobile, nickname, token } = data.result
          store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          // 2. 跳转到来源页或者首页
          router.push(store.state.user.redirectUrl)
          // 3. 成功提示
          Message({ type: 'success', text: 'QQ完善信息成功' })
        }).catch(e => {
          Message({ type: 'error', text: '完善信息失败' })
        })
      }
    }
    return {
      mySchema,
      form,
      send,
      formRef,
      submit
    }
  }
}
</script>

<style scoped lang='less'>
.code {
  position: absolute;
  right: 0;
  top: 0;
  line-height: 50px;
  width: 80px;
  color: #999;
  &:hover {
    cursor: pointer;
  }
}
</style>
