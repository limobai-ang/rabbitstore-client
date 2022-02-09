<template>
  <AppDialog :title="(formData.id?'编辑':'添加') + '收货地址'" v-model:visible="dialogVisible">
    <div class="address-edit">
      <div class="app-form">
        <div class="app-form-item">
          <div class="label">收货人：</div>
          <div class="field">
            <input class="input" v-model="formData.receiver" placeholder="请输入收货人" />
          </div>
        </div>
        <div class="app-form-item">
          <div class="label">手机号：</div>
          <div class="field">
            <input class="input" v-model="formData.contact" placeholder="请输入手机号" />
          </div>
        </div>
        <div class="app-form-item">
          <div class="label">地区：</div>
          <div class="field">
            <AppCity :fullLocation="formData.id?formData.fullLocation:'请选择所在地区'" @change="changeCty"/>
          </div>
        </div>
        <div class="app-form-item">
          <div class="label">详细地址：</div>
          <div class="field">
            <input class="input"  v-model="formData.address" placeholder="请输入详细地址" />
          </div>
        </div>
        <div class="app-form-item">
          <div class="label">邮政编码：</div>
          <div class="field">
            <input class="input" v-model="formData.postalCode" placeholder="请输入邮政编码" />
          </div>
        </div>
        <div class="app-form-item">
          <div class="label">地址标签：</div>
          <div class="field">
            <input class="input" v-model="formData.addressTags" placeholder="请输入地址标签，逗号分隔" />
          </div>
        </div>
      </div>
    </div>
    <template v-slot:footer>
      <AppButton
        type="gray"
        style="margin-right: 20px"
        @click="dialogVisible = false"
        >取消</AppButton
      >
      <AppButton type="primary" @click="submit">确认</AppButton>
    </template>
  </AppDialog>
</template>
<script>
import { reactive, ref } from 'vue'
import { addAddress, editAddress } from '@/api/order'
import Message from '@/components/library/Message'

export default {
  name: 'AddressEdit',
  setup (props, { emit }) {
    const dialogVisible = ref(false)
    // 打开函数
    const open = (form) => {
      dialogVisible.value = true
      if (form) {
        // 传递了数据就赋值
        for (const key in formData) {
          formData[key] = form[key]
        }
      } else {
        // 没有传递就清空
        for (const key in formData) {
          formData[key] = ''
        }
      }
    }
    // 表单数据
    const formData = reactive({
      id: '',
      receiver: '',
      contact: '',
      provinceCode: '',
      cityCode: '',
      countyCode: '',
      address: '',
      postalCode: '',
      addressTags: '',
      isDefault: 0,
      fullLocation: ''
    })
    // 选择地区
    const changeCty = (data) => {
      // 省市区和对应的邮编
      formData.provinceCode = data.provinceCode
      formData.cityCode = data.cityCode
      formData.countyCode = data.countyCode
      formData.fullLocation = data.fullLocation
    }

    // 提交操作
    const submit = () => {
      if (formData.id) {
        editAddress(formData).then(data => {
          // 修改成功
          Message({ text: '修改收货地址成功', type: 'success' })
          dialogVisible.value = false
          emit('on-success', formData)
        })
      } else { }
      addAddress(formData).then(data => {
        // 添加成功
        Message({ text: '添加收货地址成功', type: 'success' })
        formData.id = data.result.id
        dialogVisible.value = false
        emit('on-success', formData)
      })
    }
    return { dialogVisible, open, formData, changeCty, submit }
  }
}
</script>
<style scoped lang="less">
.app-dialog {
  :deep(.wrapper){
    width: 780px;
    .body {
      font-size: 14px;
    }
  }
}
.app-form {
  padding: 0;
  input {
    outline: none;
    &::placeholder {
      color: #ccc;
    }
  }
}
.app-city {
  width: 320px;
  :deep(.select) {
    height: 50px;
    line-height: 48px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    .placeholder {
      color: #ccc;
    }
    i {
      color: #ccc;
      font-size: 18px;
    }
    .value {
      font-size: 14px;
    }
  }
  :deep(.option) {
    top: 49px;
  }
}
</style>
