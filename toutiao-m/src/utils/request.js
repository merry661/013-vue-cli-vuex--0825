// 封装请求模块
import axios from 'axios'
import store from '@/store'

// 处理 大数字问题
import jsonBig from 'json-bigint'

const request = axios.create({
  baseURL: 'http://toutiao.itheima.net', // 基础路径

  // transformResponse数组: 自定义原始的响应数据（字符串）
  transformResponse: [function (data) {
    try {
      // 如果转换成功则返回转换的数据结果
      return jsonBig.parse(data);
    } catch (error) {
      //如果转换失败，则包装为统一数据格式并返回
      return {
        data
      }
    }
  }]

})

// 请求拦截器
// 每个请求发起都会经过这里
request.interceptors.request.use(function (config) {

  const { userInfo } = store.state;//获取用户信息
  if (userInfo && userInfo.token) {
    config.headers.Authorization = `Bearer ${userInfo.token}`
  }

  // 注意：这里务必要返回 config 配置对象，否则请求就停在这里出不去了
  return config
}, function (error) {
  // 请求出错或超时
  console.log(error, "出错了")
  return Promise.reject(error);
})

export default request