import axios from "axios";
import qs from "qs";
import { message } from "antd";

// 此文件为请求函数，主要有get和post两种，一般不需要修改

axios.interceptors.request.use(
  config => {
    // 发送请求之前做什么
    //如果有token给所有的headers加入token参数
    // if (config.method === "post") {
    //   if (localStorage.getItem("token")) {
    //     console.log(1111)
    //     config.headers.authorization = `Bearer ${localStorage.getItem("token")}`;
    //   }
    // }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    return response;
  },
    error => {
  //   if (error.response.status === 401) {
  //     localStorage.removeItem("token");
  //     localStorage.removeItem("access_token");
  //     message.error("会话已过期，请重新登陆");
  //     setTimeout(function () {
  //       window.location.href = "/";
  //     }, 500);
  //     return;
  //   }else if(error.response.status === 400 || error.response.status === 400){
  //     message.error('请求失败');
  //   } else if(error.response.status === 500){
  //     return error.response;
  //   }
  //   message.error("网络异常");
  //   return Promise.reject(error.response);
    return;
  }
);

function checkStatus(response) {
  // 如果http状态码正常，则直接返回数据
  if (response && ( response.status === 200 ) ) {
    return response;
  } else if (
    response &&
    response.status === 401
  ) {
    //token过期或不合法,跳转登录
    //清除token缓存
    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    message.error("会话已过期，请重新登陆");
    setTimeout(function () {
      window.location.href = "/";
    }, 500);
  } else {
    
    // 异常状态下，把错误信息返回去
  //   return {
  //     status: response.status,
  //     msg: "网络异常"
  //   };
   }
}

export default {
  post(url, data, adata) {
    return axios({
      method: "post",
      url,
      data: qs.stringify(data),
      timeout: 10000,
      headers: {
        // access_token: 'Bearer ' + '4e59536e-5617-47a4-b786-f253eda3a410'
        // "Origin": "http://localhost:3000",
        // "Authorization": "Bearer " + data.access_token
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  post_plus(url, access_token, carQueryParam, adata) {
    return axios({
      method: "post",
      url,
      data: JSON.stringify(carQueryParam),
      timeout: 10000,
      headers: {
        // access_token: 'Bearer ' + '4e59536e-5617-47a4-b786-f253eda3a410'
        "Authorization": "Bearer " + access_token,
        "Content-Type": "application/json;charset=utf-8"
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  postlogin(url, data, adata) {
    return axios({
      method: "post",
      url,
      data: qs.stringify(data),
      timeout: 50000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": `Basic d2ViX2FwcGxpY2F0aW9uOndlYl9hcHBsaWNhdGlvbl8xMjM0NTY=`
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  postlogoff(url, data, adata) {
    return axios({
      method: "delete",
      url,
      data: qs.stringify(data),
      timeout: 50000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Authorization": 'Bearer ' + localStorage.getItem('token')
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  get(url, data, adata) {
    return axios({
      method: "get",
      url,
      timeout: 50000,
      data: qs.stringify(data),
      headers: {
        Authorization: 'Bearer ' + localStorage.getItem('access_token')
      }
    }).then(response => {
      return checkStatus(response);
    });
  },
  getcon(url, data, adata) {
    return axios({
      method: "get",
      url,
      data: qs.stringify(data),
      timeout: 50000
    }).then(response => {
      return response;
    });
  }
};
