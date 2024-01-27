import request from '@/utils/request';

//获取科目列表
export function getSubjectList() {
    return request({
        'url': '/admin/course/getSubjectList',
        'method': 'GET',       
    })
}


//获取科目最大值
export function getSubjectMax(data) {
    return request({
        'url': '/admin/course/getSubjectMax',
        'method': 'POST',
        data
    })
    
}
//获取班级平均分
export function getClassAve(params) {
    return request({
        'url': '/admin/course/getClassAve',
        'method': 'GET',
        params
    })
    
}

//获取年级平均分
export function getGradeAve(params) {
    return request({
        'url': '/admin/course/getGradeAve',
        'method': 'GET',
        params
    })
    
}

//通过考试名称获取考试科目列表
export function  getSubjectListByExamName(params){
    return request({
        'url': '/admin/course/getSubjectListByExamName',
        'method': 'GET',
        params
    })
}

//获取课程分页
export function getcoursePage(params) {
    return request({
        'url': '/admin/course/page',
        'method': 'GET',
        params
    })
}

//新增
export function addcourse(data) {
    return request({
        'url': '/admin/course/addcourse',
        'method': 'POST',
        data
    })
}

//修改课程名称
export function updatacourse(params){
    return request({
        'url': '/admin/course/updatacourse',
        'method': 'POST',
        data:params
    })
}

//删除课程
export function deletecourse(id){
    return request({
        'url': `/admin/course/deletecourse/${id}`,
        'method': 'Delete',
        
    })
}

//获取课程id列表
export function getCourseIdList(){
    return request({
        'url': `/admin/course/getCourseIdList`,
        'method': 'GET',       
    })
}

//通过课程id获取课程名称
export function getCourseNameById(id){
    return request({
        'url': `/admin/course/getCourseNameById/${id}`,
        'method': 'GET',       
    })
}

//通过课程名称获取课程id
export function getCourseIdByName(name){
    return request({
        'url': `/admin/course/getCourseIdByName/${name}`,
        'method': 'GET',       
    })
}

//获取科目最大值

export function getCourseMax(name){
    return request({
        'url': `/admin/course/getCourseMax/${name}`,
        'method': 'GET',       
    })
}