/*
文章相关请求模块


*/

import request from '@/utils/request.js'
// 获取文章列表
export const getArticles = (abc) => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/articles',
    // Body参数使用data设置
    // Query参数使用params设置
    // Headers参数使用 headers设置
    params: abc

  })
}

// 获取文章频道
export const getArticleChannels = params => {
  return request({
    method: 'GET',
    url: '/mp/v1_0/channels',

  })
}

// 删除文章
export const deleteArticle = articleId => {
  return request({
    method: 'GET',
    // 接口文档中写的路径参数需要在url中传递
    // 凡是看见接口路径中有 ：xxx格式的字段，则需要传递
    url: `/mp/v1_0/articles/${articleId}`,

  })
}
//  发布文章

export const publishArticle = (data, draft = false) => {
  return request({
    method: 'POST',
    url: '/mp/v1_0/articles',
    params: {
      draft   //是否存为草稿（布尔值，true为草稿）
    },
    data

  })
}

//  编辑文章

export const updateArticle = (articleId, data, draft = false) => {
  return request({
    method: 'PUT',
    url: `/mp/v1_0/articles/${articleId}`,
    params: {
      draft   //是否存为草稿（布尔值，true为草稿）
    },
    data

  })
}


//  获取指定文章

export const getArticle = articleId => {
  return request({
    method: 'GET',
    url: `/mp/v1_0/articles/${articleId}`,
  })
}














