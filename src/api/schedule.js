import request from '@/utils/request';

// 获取课表信息列表
export function getscheduleList(){
    return request({
        'url': '/admin/schedules/getscheduleList',
        'method': 'GET',
    })
}

//获得课表信息page
export function getschedulePage(params){
    return request({
        'url': '/admin/schedules/getschedulePage',
        'method': 'GET',
        params
    })
}

//修改课表信息名称
export function updataschedule(params){
    return request({
        'url': '/admin/schedules/updataschedule',
        'method': 'POST',
        data:params
    })
}

//删除课表信息
export function deleteschedule(id){
    return request({
        'url': `/admin/schedules/deleteschedule/${id}`,
        'method': 'Delete',
        
    })
}

//添加课表信息

export function addschedule(data) {
    return request({
        'url': '/admin/schedules/addschedule',
        'method': 'POST',
        data
    })
}

//添加课表内容
export function saveschedule(data) {
    return request({
        'url': '/admin/schedule/saveschedule',
        'method': 'POST',
        data
    })
}
//删除课表内容
export function deleteScheduleInFo(data){
    return request({
        'url': '/admin/schedule/deleteScheduleInFo',
        'method': 'POST',
        data
    })
}
// 修改课程内容
export function updatascheduleInFo(data){
    return request({
        'url': '/admin/schedule/updatascheduleInFo',
        'method': 'POST',
        data
    })
}

//根据课程id获取课程名称
export function getscheduleNameById(id){
    return request({
        'url': `/admin/schedules/getscheduleNameById/${id}`,
        'method': 'GET',
    })
}


//获取课表数据集合
export function getscheduleWorkList(id){
    return request({
        'url': `/admin/schedule/getscheduleWorkList/${id}`,
        'method': 'GET',
    })
}
