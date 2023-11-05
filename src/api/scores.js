import request from '@/utils/request';


export function getStuScoreList(params) {
    return request({
        'url': '/admin/score/getStuScoreList',
        'method': 'GET',
        params
    })
}
// 获取学生成绩信息
export function getStuScorePage(data) {
    return request({
        'url': '/admin/score/getStuScorePage',
        'method': 'POST',
        data
    })
}


//更新学生成绩
export function updataScore(params) {
    return request({
        'url': '/admin/score/updataScore',
        'method': 'GET',
        params
    })
}

//获取考试列表
export function getExamList() {
    return request({
        'url': '/admin/score/getExamList',
        'method': 'GET',
    })
}

//添加学生成绩
export function addStudentScore(params) {
    return request({
        'url': '/admin/score/addStudentScore',
        'method': 'GET',
        params
    })
}

//删除学生成绩
export function delStudentScore(params) {
    return request({
        'url': '/admin/score/delStudentScore',
        'method': 'DELETE',
        params
    })
    
}