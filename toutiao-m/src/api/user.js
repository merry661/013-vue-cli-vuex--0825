// 导入用户请求模块
import request from '@/utils/request.js'
import store from '@/store'

// 1. 用户登录
export const login = data => {
    return request({
        method: 'POST',
        url: '/v1_0/authorizations',
        data
    })
}

// 2. 获取短信验证码
export const getSmsCode = mobileNum => {
    return request({
        method: 'GET',
        url: `/v1_0/sms/codes/${mobileNum}`
    })
}

// 3. 获取用户信息
// 该接口需要授权才能访问
export const getUserInfo = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user'
        // 设置了请求拦截器,这里就不用再配置请求头的token了
        // headers: {
        //     Authorization: `Bearer ${store.state.userInfo.token}`
        // }
    })
}

// 4.获取 "用户"的频道列表
export const getUserChannels = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/channels'
    })
}
// 5.关注用户
export const addFollow = userId => {
    return request({
        method: 'POST',
        url: '/v1_0/user/followings',
        data: {
            target: userId
        }
    })
}
// 6.取消关注用户
export const deleteFollow = userId => {
    return request({
        method: 'DELETE',
        url: `/v1_0/user/followings/${userId}`
    })
}

// 7.获取当前用户的 个人资料
export const getUserProfile = () => {
    return request({
        method: 'GET',
        url: '/v1_0/user/profile'
    })
}
// 8.编辑用户资料
export const updateUserProfile = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/profile',
        data
    })
}

// 9.更新用户 照片资料
export const updateUserPhoto = data => {
    return request({
        method: 'PATCH',
        url: '/v1_0/user/photo',
        data
    })
}