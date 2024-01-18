import request from '@/utils/request';

// 获取专业列表
export function getMajorList(){
    return request({
        'url': '/admin/major/getMajorList',
        'method': 'GET',
    })
}

//获得专业page
export function getmajorPage(params){
    return request({
        'url': '/admin/major/getmajorPage',
        'method': 'GET',
        params
    })
}

//修改专业名称
export function updatamajor(params){
    return request({
        'url': '/admin/major/updatamajor',
        'method': 'POST',
        data:params
    })
}

//删除专业
export function deletemajor(id){
    return request({
        'url': `/admin/major/deletemajor/${id}`,
        'method': 'Delete',
        
    })
}

//添加专业

export function addmajor(data) {
    return request({
        'url': '/admin/major/addmajor',
        'method': 'POST',
        data
    })
}