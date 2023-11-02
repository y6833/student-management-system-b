import axios from 'axios';
import ElementUI from 'element-ui';

// 创建axios实例
const request = axios.create({
  baseURL: 'http://localhost:9001/sms', // 设置请求的baseURL
  timeout: 5000, // 请求超时时间
});

// 请求拦截器
request.interceptors.request.use(
  config => {
    // 在发送请求前做一些处理，例如添加token等
    config.headers['Content-Type'] = 'application/json;charset=UTF-8';
    let user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : {};
    if (user) {
      config.headers['token'] = user.token; //设置请求头
    }
    return config;
  },
  error => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  response => {
    // 对响应数据做一些处理
    let res = response.data
    //返回文件
    if (response.config.responseType === 'blob') {
      res = res
    }
    if (typeof res === 'string') {
      res = res ? JSON.parse(res) : res
    }
    //当权限验证不通过的时候给出提示
    if (res.code === '401') {
      ElementUI.Message({
        message: res.msg,
        type: 'error'
      });
      setTimeout(() => {
      window.location.href = '/login';
      }, 1000);
    }
    return res;
  },
  error => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

export default request;
