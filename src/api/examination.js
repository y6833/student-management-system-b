import request from '@/utils/request';

// 获取考试信息
export function getExaminationPage(params) {
    return request({
        'url': '/admin/examination/page',
        'method': 'GET',
        params
    })
}


//添加考试信息
export function addExamination(data) {
    return request({
        'url': '/admin/examination/addExamination',
        'method': 'POST',
        data
    })
}

//更新考试信息
export function updataExamination(data){
    return request({
        'url': '/admin/examination/updateExamination',
        'method': 'POST',
        data
    })
}

//删除考试信息
export function removeExamination(id) {
    return request({
        'url': `/admin/examination/${id}`,
        'method': 'DELETE',
    })
}

export function getCurrSchedule(params){
    return request({
        'url': `/admin/examination/getCurrSchedule`,
        'method': 'GET',
        params
    })
}

//获取课表考试的考试列表
export function getExamListks(){
    return request({
        'url': `/admin/examination/getExamListks`,
        'method': 'GET',
    })
}