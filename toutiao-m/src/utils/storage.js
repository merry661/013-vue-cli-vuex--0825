// 封装本地存储操作模块

// 获取本地存储的token
export const getItem = key => {
    // 区分JSON字符串和非JSON字符串
    const data = window.localStorage.getItem(key);
    try {
        // 返回JSON对象
        return JSON.parse(data);
    } catch (err) {
        // 如果不是JSON字符串，就直接返回
        return data;
    }
}

// 存储token到本地
export const setItem = (key, value) => {
    // 区分对象和字符串
    // 将数组，对象类型的数据转换为JSON格式的字符串进行存储
    if (typeof value === 'object') {
        value = JSON.stringify(value);
    }
    window.localStorage.setItem(key, value);
}

// 删除token
export const removeItem = key => {
    window.localStorage.removeItem(key);
}