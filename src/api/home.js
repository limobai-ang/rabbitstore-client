// 首页相关的api函数
import request from '@/utils/request'

// 获取品牌 limit-品牌个数
export const findBrand = (limit) => {
  return request('/home/brand', 'get', { limit })
}

// 获取轮播图数据
export const getBanner = () => {
  return request('/home/banner', 'get')
}

// 获取新鲜好物的数据
export const getNewGoods = () => {
  return request('/home/new', 'get')
}

// 获取人气推荐数据
export const getRecommen = () => {
  return request('/home/hot', 'get')
}

// 获取商品数据
export const getGoods = () => {
  return request('/home/goods', 'get')
}

// 获取专题数据
export const getSpecial = (limit) => {
  return request('home/special', 'get', { limit })
}
