/* 
用户相关请求模块
*/
import request from "@/utils/request.js";

// 用户登录
export const login = data => {
  return request({
    method: "POST",
    url: "/mp/v1_0/authorizations",
    // data用来设置POST请求体
    data
  })
}

// 获取用户信息
export const getUserProfile = () => {
  // 拿本地存储的token数据
  // const user = window.localStorage.getItem('user') //这里拿到的是JSON格式的字符串
  // 用JSON.parse还原为原来的数据对象
  // const user = JSON.parse(window.localStorage.getItem('user'))
  // console.log(user);
  return request({
    method: 'GET',
    url: "/mp/v1_0/user/profile",
    // 后端要求把需要授权的用户身份放到请求头中
    // axios可以通过把headers选项设置请求头
    // headers: {
    // 属性名和值都是得看接口的要求
    // 属性名：Authorization  这个是接口文档要求的
    // 属性值：Bearer空格token数据
    // 第一种：这种方式是写死的。不同用户登录有不同的token
    // Authorization: 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2Mzg4MDgxNTEsInVzZXJfaWQiOjEsInJlZnJlc2giOmZhbHNlLCJ2ZXJpZmllZCI6dHJ1ZX0.JWgnJpY5GhEKt8fZ3Lb0eLDpaGE090ALIs2Guc9CUyA'
    // 第二种：通过localStorage获取token
    // Authorization: 'Bearer ' + user.token 这种写法容易出错
    // Authorization: `Bearer ${user.token}`
    // 第三种：通过axios拦截器（在utils文件的request文件里设置）这里就不需要设置了
    // }
  })
}

// 修改用户信息

export const updateUser = () => {

}








































