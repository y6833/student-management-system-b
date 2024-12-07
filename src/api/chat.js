import request from '../utils/request'

// 发送聊天消息
export const sendChatMessage = (message) => {
    return request({
        url: '/chat/send',
        method: 'post',
        data: { message }
    })
}
