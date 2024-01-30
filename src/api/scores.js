import request from '@/utils/request';


export function getStuScoreList(params) {
    return request({
        'url': '/admin/score/getStuScoreList',
        'method': 'GET',
        params
    })
}

export function getStuScoreGradeRankList(params) {
    return request({
        'url': '/admin/score/getStuScoreGradeRankList',
        'method': 'GET',
        params
    })
}
export function getStuScoreClassRankList(params) {
    return request({
        'url': '/admin/score/getStuScoreClassRankList',
        'method': 'GET',
        params
    })
}



export function ClassRankSegment(params) {
    return request({
        'url': '/admin/score/ClassRankSegment',
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


//获取数据条数
export function getScoreTotal(){
    return request({
        'url': '/admin/score/getScoreTotal',
        'method': 'GET',
    })
}


export function getExamcompareChart(params){
    return request({
        'url': '/admin/score/getExamcompareChart',
        'method': 'GET',
        params
    })
}
//导出
export function exportScore(examName){
    return request({
        'url': `/admin/score/export?examName=${examName}`,
        'method': 'GET',
    })
}

//修改评语
export function updataProposal(params){
    return request({
        'url': '/admin/score/updataProposal',
        'method': 'GET',
        params
    })
}


//获得考试平均分列表
export function getAveTableData(params){
    return request({
        'url': '/admin/score/getAveTableData',
        'method': 'GET',
        params
    })
}


//获得考试平均分列表
export function getSubjectListByExamNameAndGradeAndMajor(params){
    return request({
        'url': '/admin/score/getSubjectListByExamNameAndGradeAndMajor',
        'method': 'GET',
        params
    })
}
//获取考试年级学生数量
export function getGradeNum(params){
    return request({
        'url': '/admin/score/getGradeNum',
        'method': 'GET',
        params
    })
}
//获取考试班级学生数量
export function getClassNum(params){
    return request({
        'url': '/admin/score/getClassNum',
        'method': 'GET',
        params
    })
}
//获取横坐标

export function getAbscissa(params){
    return request({
        'url': '/admin/score/getAbscissa',
        'method': 'GET',
        params
    })
}

//班级获取横坐标
export function getAbscissa1(params){
    return request({
        'url': '/admin/score/getAbscissa1',
        'method': 'GET',
        params
    })
}
//获取科目分数集合
export function getScoreListByExamAndGradeAndSubject(params){
    return request({
        'url': '/admin/score/getScoreListByExamAndGradeAndSubject',
        'method': 'GET',
        params
    })
}

//获取科目分数集合
export function getScoreListByExamAndClassAndSubject(params){
    return request({
        'url': '/admin/score/getScoreListByExamAndClassAndSubject',
        'method': 'GET',
        params
    })
}

//获得科目考试所有考试的平均分

export function getExamClassAve(params){
    return request({
        'url': '/admin/score/getExamClassAve',
        'method': 'GET',
        params
    })
}


export function getSubRank(params){
    return request({
        'url': '/admin/score/getSubRank',
        'method': 'GET',
        params
    })
}