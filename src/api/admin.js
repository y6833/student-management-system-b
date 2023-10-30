import request from '@/utils/request';

// 获取管理员信息
export function getAdminPage(params) {
    return request({
        'url': '/admin/admin/page',
        'method': 'GET',
        params
    })
}

//添加管理员
export function saveAdmin(data) {
    return request({
        'url': '/admin/admin',
        'method': 'POST',
        data
    })
}

//删除管理员

export function removeAdmin(id) {
    return request({
        'url': `/admin/admin/${id}`,
        'method': 'DELETE',

    })
}

//修改管理员
export function updataAdmin(data) {
    return request({
        'url': '/admin/admin/updata',
        'method': 'POST',
        data
    })
}

//根据id获取管理员信息
export function getAdminByRoleId(id) {
    return request({
        'url': `/admin/admin/getAdminByRoleId/${id}`,
        'method': 'GET',
    })
}