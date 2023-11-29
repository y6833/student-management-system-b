import request from '@/utils/request';

// 获取教师信息
export function getTeacherPage(params) {
    return request({
        'url': '/admin/teacher/page',
        'method': 'GET',
        params
    })
}

//添加教师
export function saveTeacher(data) {
    return request({
        'url': '/admin/teacher',
        'method': 'POST',
        data
    })
}

//删除教师

export function removeTeacher(id) {
    return request({
        'url': `/admin/teacher/${id}`,
        'method': 'DELETE',

    })
}

//修改教师
export function updatateacher(data) {
    return request({
        'url': '/admin/teacher/updata',
        'method': 'POST',
        data
    })
}

//根据id获取教师信息
export function getTeacherByRoleId(id) {
    return request({
        'url': `/admin/teacher/getTeacherByRoleId/${id}`,
        'method': 'GET',
    })
}

//获取所有的教师id
export function getTeacherList() {
    return request({
        'url': '/admin/teacher/getTeacherList',
        'method': 'GET',
    })
    
}

//通过教师id获取教师姓名
export function getTeacherNameById(id) {
    return request({
        'url': `/admin/teacher/getTeacherNameById/${id}`,
        'method': 'GET',
    })
}