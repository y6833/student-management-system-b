import request from '@/utils/request';


//获取用户信息

export function getUser(params) {
    return request({
        'url': '/admin/user/getUser',
        'method': 'GET',
        params
    })
}

// 控制激活按钮
export function updateIsActivate(params) {
    return request({
        'url': '/admin/user/updateIsActivate',
        'method': 'GET',
        params
    })
}

//添加用户
export function addUser(data) {
    return request({
        'url': '/admin/user/addUser',
        'method': 'POST',
        data
    })
}

//删除学生

export function removeUser(id) {
    return request({
        'url': `/admin/user/${id}`,
        'method': 'DELETE',

    })
}


//修改用户
export function updataUser(data) {
    return request({
        'url': '/admin/user/updataUser',
        'method': 'POST',
        data
    })
}