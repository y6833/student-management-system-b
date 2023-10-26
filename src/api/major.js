import request from '@/utils/request';

// 获取专业列表
export function getMajorList(){
    return request({
        'url': '/admin/major/getMajorList',
        'method': 'GET',
    })
}