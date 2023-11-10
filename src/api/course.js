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