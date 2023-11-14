import request from '@/utils/request';

//查询
export function getPermissionList(params) {
    return request({
        'url': '/admin/userpermission/getPermissionList',
        'method': 'GET',
        params
    })
}

//删除
export function deletePermission(params) {
    return request({
        'url': '/admin/userpermission/deletePermission',
        'method': 'GET',
        params
    })
}

//添加
export function addUserPermission(params) {
    return request({
        'url': '/admin/userpermission/addUserPermission',
        'method': 'GET',
        params
    })
}

//获取当前用户的权限
export function getUserPermission(params){
    return request({
        'url': '/admin/userpermission/getUserPermission',
        'method': 'GET',
        params
    })
}