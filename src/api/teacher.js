import request from '@/utils/request';

// 获取学生信息
export function getTeacherPage(params) {
    return request({
        'url': '/admin/teacher/page',
        'method': 'GET',
        params
    })
}

//添加学生
export function saveTeacher(data) {
    return request({
        'url': '/admin/teacher',
        'method': 'POST',
        data
    })
}

//删除学生

export function removeTeacher(id) {
    return request({
        'url': `/admin/teacher/${id}`,
        'method': 'DELETE',

    })
}

//修改学生
export function updatateacher(data) {
    return request({
        'url': '/admin/teacher/updata',
        'method': 'POST',
        data
    })
}