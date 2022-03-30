/**
 * 文章请求模块
 */
import request from "@/utils/request"

/**
 * 1.获取文章列表
 */
export const getArticles = params => {
    return request({
        method: 'GET',
        url: '/v1_0/articles',
        params
    })
}

/**
 *2.根据id获取指定文章
 */
export const getArticleById = articleId => {
    return request({
        method: 'GET',
        url: `/v1_0/articles/${articleId}`,
    })
}

// 3.收藏文章(这里的参数必须是 target，写成articleId 不行)
export const addCollect = target => {
    return request({
        method: 'POST',
        url: '/v1_0/article/collections',
        data: {
            target
        }
    })
}
// 4.取消收藏文章
export const deleteCollect = articleId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/collections/${articleId}`
    })
}
// 5.点赞文章
export const addLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/article/likings',
        data: {
            target
        }
    })
}
// 6.取消点赞文章
export const deleteLike = articleId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/article/likings/${articleId}`
    })
}