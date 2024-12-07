import request from '../utils/request'

// 获取统计数据
export const getStatistics = () => {
    return request({
        url: '/admin/dashboard/statistics',
        method: 'get'
    })
}

// 获取性别比例数据
export const getGenderRatio = () => {
    return request({
        url: '/admin/dashboard/gender-ratio',
        method: 'get'
    })
}

// 获取专业分布数据
export const getMajorDistribution = () => {
    return request({
        url: '/admin/dashboard/major-distribution',
        method: 'get'
    })
}

// 获取学生增长趋势
export const getStudentTrend = () => {
    return request({
        url: '/admin/dashboard/student-trend',
        method: 'get'
    })
}
