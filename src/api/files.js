import request from '@/utils/request';

//获取文件列表
export function getPage(params) {
        return request({
            'url': '/file/page',
            'method': 'GET',
            params
        })
}

//删除文件
export function deleteFile(id) {
    return request({
        'url': `/file/${id}`,
        'method': 'DELETE',
    })
}
//批量删除
export function deleteFiles(data) {
    return request({
        'url': '/file/del/batch',
        'method': 'POST',
        data
    })
}

//修改文件状态
export function updateFileStatus(data) {
    return request({
        'url': '/file/update',
        'method': 'POST',
        data
    })
}


//上传文件
export function uploadFile(data) {
    return request({
        'url': '/file/upload',
        'method': 'POST',
        data
    })
}

//获取文件列表
export function getFiletypeList() {
        return request({
            'url': '/file/getfiletypelist',
            'method': 'GET', 
        })
}