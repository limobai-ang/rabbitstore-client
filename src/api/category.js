// 分类相关的api函数
import request from '@/utils/request'

// 获取一级分类
export const findAllCategory = () => {
  return request('/home/category/head', 'get')
}
