/**
 * 评论接口模块
 */
import request from "@/utils/request"

/**
 * 1.获取评论列表
 */
export const getComments = params => {
    return request({
        method: 'GET',
        url: '/v1_0/comments',
        params
    })
}

// 2.对评论或评论回复点赞
export const addCommentLike = target => {
    return request({
        method: 'POST',
        url: '/v1_0/comment/likings',
        data:{
            target
        }
    })
}

// 3.取消对评论或评论回复点赞
export const deleteCommentLike = target => {
    return request({
        method: 'DELETE',
        url: `/v1_0/comment/likings/${target}`
    })
}
// 4.发布文章评论或评论回复
export const addComment = data => {
    return request({
        method: 'POST',
        url: '/v1_0/comments',
        data
    })
}