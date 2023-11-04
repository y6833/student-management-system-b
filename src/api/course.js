import request from '@/utils/request';

//获取科目列表
export function getSubjectList() {
    return request({
        'url': '/admin/course/getSubjectList',
        'method': 'GET',       
    })
}