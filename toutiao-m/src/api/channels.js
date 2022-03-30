/**
 * 频道请求模块
 */
import request from '@/utils/request.js'

// 1.获取 "所有"的频道列表
export const getAllChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/channels'
    })
}

// 2.添加用户频道
export const addUserChannels = channel => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/channels',
        data: {
            channels: [channel]
        }
    })
}
// 3.删除用户频道
export const deleteUserChannel = channelId => {
    return request({
        method: 'DELETE',
        url: `v1_0/user/channels/${channelId}`
    })
}