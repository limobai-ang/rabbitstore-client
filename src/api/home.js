// 首页相关的api函数
import request from '@/utils/request'

// 获取品牌 limit-品牌个数
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}
