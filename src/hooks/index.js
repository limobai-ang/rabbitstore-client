// hooks 封装逻辑，提供响应式数据。
import { useIntersectionObserver, useIntervalFn } from '@vueuse/core'
import { ref, onUnmounted } from 'vue'
import dayjs from 'dayjs'
// 数据懒加载函数
export const useLazyData = (apiFn) => {
  // 需要
  // 1. 被观察的对象
  // 2. 不同的API函数
  const target = ref(null)
  const result = ref([])
  const { stop } = useIntersectionObserver(
    target,
    ([{ isIntersecting }], observerElement) => {
      if (isIntersecting) {
        stop()
        // 调用API获取数据
        apiFn().then(data => {
          result.value = data.result
        })
      }
    }
  )
  // 返回--->数据（dom,后台数据）
  return { target, result }
}

// 获取倒计时时间
export const usePayTime = () => {
  // 倒计时逻辑
  const time = ref(0)
  const timeText = ref('')

  // 定时器
  const { pause, resume } = useIntervalFn(() => {
    time.value--
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    if (time.value <= 0) {
      pause()
    }
  }, 1000, false)

  // 页面卸载时清除定时器
  onUnmounted(() => {
    pause()
  })

  // 开启定时器 countdown 倒计时时间（单位秒）
  const start = (countdown) => {
    if (countdown < 0) {
      timeText.value = '已结束'
      return
    }
    time.value = countdown
    // 得到mm-ss的时间格式 赋值给timeText
    timeText.value = dayjs.unix(time.value).format('mm分ss秒')
    // 开始执行 useIntervalFn 定时器
    resume()
  }
  return {
    start,
    timeText
  }
}
