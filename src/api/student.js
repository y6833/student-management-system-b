import request from '@/utils/request';

// 获取学生信息
export function getStudentPage(params) {
    return request({
        'url': '/admin/student/page',
        'method': 'GET',
        params
    })
}

//添加学生
export function saveStudent(data) {
    return request({
        'url': '/admin/student',
        'method': 'POST',
        data
    })
}

//删除学生

export function removeStudent(id) {
    return request({
        'url': `/admin/student/${id}`,
        'method': 'DELETE',

    })
}

//修改学生
export function updatastudent(data) {
    return request({
        'url': '/admin/student/updata',
        'method': 'POST',
        data
    })
}

//通过id获取学生
export function getStuById(id) {
    return request({
        'url': `/admin/student/${id}`,
        'method': 'GET',
    })
}