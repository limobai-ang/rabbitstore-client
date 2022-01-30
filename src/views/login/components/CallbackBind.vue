<template>
  <Form class="app-form" ref="formRef" :validation-schema="mySchema" v-slot="{errors}">
    <div class="user-info">
      <img :src="avatar" alt="" />
      <p>{{nickname}}</p>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-phone"></i>
        <Field name="mobile" v-model="form.mobile" class="input" type="text" placeholder="绑定的手机号" />
      </div>
      <div class="error" v-if="errors.mobile">{{errors.mobile}}</div>
    </div>
    <div class="app-form-item">
      <div class="field">
        <i class="icon iconfont icon-code"></i>
        <Field name="code" v-model="form.code" class="input" type="text" placeholder="短信验证码" />
        <span class="code" @click="send()">{{time===0?'发送验证码':`${time}秒后发送`}}</span>
      </div>
      <div class="error" v-if="errors.code">{{errors.code}}</div>
    </div>
    <a href="javascript:;" class="submit" @click="submit">立即绑定</a>
  </Form>
</template>

<script>
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { reactive, ref, onUnmounted } from 'vue-demi'
// 导入qq登录变量
import QC from 'qc'
import { Form, Field } from 'vee-validate'
import { useIntervalFn } from '@vueuse/core'
import Message from '@/components/library/Message'
import { userQQBindCode, userQQBindLogin } from '@/api/user'
export default {
  name: 'CallbackBind',
  components: {
    Form,
    Field
  },
  props: {
    openId: {
      type: String,
      default: ''
    }
  },
  setup (props) {
    // 头像和名称信息
    const nickname = ref('null')
    const avatar = ref('null')

    // 使用store
    const store = useStore()
    // // 使用router
    const router = useRouter()

    const formRef = ref(null)
    // 发起请求获取数据
    if (QC.Login.check()) {
      QC.api('get_user_info').success(res => {
        avatar.value = res.data.figureurl_1
        nickname.value = res.data.nickname
      })
    }

    // 定义表单
    const form = reactive({
      mobile: '17771166963',
      code: ''
    })
    // 定义表单验证对象
    const mySchema = reactive({
      mobile (value) {
        if (!value) return '请输入手机号'
        if (!/^1[3-9]\d{9}$/.test(value)) return '手机号格式错误'
        return true
      },
      code (value) {
        if (!value) return '请输入验证码'
        if (!/^\d{6}$/.test(value)) return '验证码是6个数字'
        return true
      }
    })

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
          await userQQBindCode(form.mobile).catch(err => err)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formRef.value.setFieldError('mobile', valid)
      }
    }

    // 立即绑定
    // 需要在点击登录的时候对整体表单进行校验
    const submit = async () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
      const valid = await formRef.value.validate()
      if (!valid) return
      // 绑定账号
      const data = await userQQBindLogin({ unionId: props.openId, ...form }).catch(err => {
        // 绑定失败
        Message({ type: 'error', text: err.response.data.message })
        return err
      })
      console.dir(data)
      if (data.response.status === 400) return
      // 绑定成功
      // 1. 存储信息 (将数据保存到vuex并持久化)
      const { id, account, nickname, avatar, token, mobile } = data.result
      store.commit('user/setUser', { id, account, nickname, avatar, token, mobile })
      // 2. 提示
      Message({ type: 'success', text: 'QQ绑定成功' })
      // 3. 跳转
      router.push(store.state.user.redirectUrl || '/')
    }
    return { nickname, avatar, form, mySchema, send, time, formRef, submit }
  }
}
</script>

<style scoped lang='less'>
.user-info {
    width: 320px;
    height: 70px;
    margin: 0 auto;
    display: flex;
    background: #f2f2f2;
    align-items: center;
    padding: 0 10px;
    margin-bottom: 25px;
    img {
      background: #f2f2f2;
      width: 50px;
      height: 50px;
    }
    p {
      padding-left: 10px;
    }
  }
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
