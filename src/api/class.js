import request from '@/utils/request';

// 获取班级列表
export function getClassList() {
    return request({
        'url': '/admin/classs/getClassList',
        'method': 'GET',
    })
}

//获取年级列表
export function getGradeList(){
    return request({
        'url': '/admin/classs/getGradeList',
        'method': 'GET',
    })
}
//通过年级id获取班级列表
export function getClassListBygradeId(params){
    return request({
        'url': '/admin/classs/getClassListBygradeId',
        'method': 'GET',
        params
    })
}
//通过班级id获得专业
export function getMajorByclassId(params){
    return request({
        'url': '/admin/classs/getMajorByclassId',
        'method': 'GET',
        params
    })
}

//通过班级id获得年级
export function getGradeByclassId(params){
    return request({
        'url': '/admin/classs/getGradeByclassId',
        'method': 'GET',
        params
    })
}

//获得班级page
export function getclassPage(params){
    return request({
        'url': '/admin/classs/getclassPage',
        'method': 'GET',
        params
    })
}

//添加班级
export function addClass(data){
    return request({
        'url': '/admin/classs/addClass',
        'method': 'POST',
        data
    })
}

//修改
export function updataClass(data){
    return request({
        'url': '/admin/classs/updataClass',
        'method': 'POST',
        data
    })
}

//删除
export function removeclass(id){
    return request({
        'url': `/admin/classs/removeclass/${id}`,
        'method': 'DELETE',
    })
}
