/*
基于axios封装的请求模块
*/

import axios from 'axios'
import JSONbig from 'json-bigint'


// 创建一个axios实例，说白了就是复制一个axios
// 我们通过这个实例去发请求，把需要的配置资源给这个实例来处理

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  transformResponse: [function (data) {
    //定义后端返回的原始数据处理
    // 参数data就是后端返回的原始数据 （未经处理的JSON格式字符串）
    // console.log(data);

    // 后端返回的数据可能不是JSON格式字符串
    // 如果不是，那么JSONbig.parse调用就会报错
    // 所以用try-catch来捕获异常，处理异常的发生
    try {
      return JSONbig.parse(data)
    } catch (error) {
      return data
    }
  }]


})

// 请求拦截器
request.interceptors.request.use(
  // 任何请求都会进过这里
  // config是当前请求相关的配置信息对象
  // config是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // console.log(config);
    //我们可以在请求发送之前定制一些业务功能处理。例如统一设置token 
    // 如果有登录用户信息，则统一设置token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }

    // 当这里return config之后，请求才会真正的发出去
    return config
  },
  function (err) {
    return Promise.reject(err)
  }
)




// 响应拦截器


export default request

// 谁要使用就加载这个模块
// import request from 'request.js
// request.xxx
// request({
//   methods: ,
//   url:''
// })












