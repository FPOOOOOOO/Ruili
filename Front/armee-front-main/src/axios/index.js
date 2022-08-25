import http from "./tools";
import * as config from "./config";

// 所有前后端接口均在此文件填写，包含参数
//登录
export const login = params =>
  http.postlogin(config.authIp + "/oauth/token", {
    grant_type: "password",
    username: params[0],
    password: params[1]
  });

//退出
export const logoff = params =>
  http.postlogoff(config.authIp + "/oauth/token?token=" + localStorage.getItem('access_token'), {

  });

//添加汽车上锁
export const addLockInfo = params => 
  http.post(config.requestIp + "/carControl/addLockInfo",{
    access_token: localStorage.getItem('access_token'),
    deviceId: params[0],
    driverId: params[1],
    et: params[2],
    st: params[3],
    downed:params[4]
  });

//挂车立即上锁命令
export const lockIm = params =>
  http.post(config.requestIp + "/carControl/lockIm", {
    access_token: localStorage.getItem('access_token'),
    deviceId: params[0]
  });

//插入汽车信息
export const addDevice = params =>
  http.post(config.requestIp + "/carInfo/addDevice", {
    access_token: localStorage.getItem('access_token'),
    deviceId: params[0]
  });
  
//删除汽车信息
export const deleteDevice = params =>
  http.post(config.requestIp + "/carInfo/delete", {
    access_token: localStorage.getItem('access_token'),
    deviceId: params[0]
  });

//查询汽车信息
export const queryDevice = params =>
  http.post(config.requestIp + "/carInfo/queryDevice", {
    access_token: localStorage.getItem('access_token')
  });

//查询汽车时序数据
export const queryTsData = params =>
     http.post_plus(config.requestIp + "/carInfo/queryTsData", 
        localStorage.getItem("access_token"),
        params
     )
  // http.post(config.requestIp + "/carInfo/queryTsData", {
  //   access_token: localStorage.getItem('access_token')
  // });

//更新汽车信息
export const updateDevice = params =>
  http.post(config.requestIp + "/carInfo/updateDevice", {
    access_token: localStorage.getItem('access_token'),
    device: params[0]
  });

//查询驾驶员
export const queryDriver = params =>
  http.post(config.requestIp + "/userManage/queryDriver", {
    access_token: localStorage.getItem('access_token')
  });

//删除驾驶员
export const deleteDriver = params =>
  http.post(config.requestIp + "/userManage/deleteDriver", {
    access_token: localStorage.getItem('access_token'),
    deleteId: params[0]
  });

//添加驾驶员
export const addDriver = params =>
  http.post(config.requestIp + "/userManage/addDriver", {
    access_token: localStorage.getItem('access_token'),
    staffCredentialDto: params[0]
  });

//更新驾驶员
export const updateDriver = params =>
  http.post(config.requestIp + "/userManage/updateDriver", {
    access_token: localStorage.getItem('access_token'),
    staffCredentialsDto: params[0]
  });

//查询管理员
export const queryAdmin = params =>
  http.post(config.requestIp + "/userManage/queryAdmin", {
    access_token: localStorage.getItem('access_token')
  });

//删除管理员
export const deleteAdmin = params =>
  http.post(config.requestIp + "/userManage/deleteAdmin", {
    access_token: localStorage.getItem('access_token'),
    deleteId:params[0]
  });

//添加管理员
export const addAdmin = params =>
  http.post(config.requestIp + "/userManage/addAdmin", {
    access_token: localStorage.getItem('access_token'),
    staffCredentialDto: params[0]
  });

//批量添加管理员
  export const addAdmins = params =>
  http.post(config.requestIp + "/userManage/addAdmins", {
    access_token: localStorage.getItem('access_token'),
    staffCredentialDtos: params[0]
  });

  //更新管理员
  export const updateAdmin = params =>
  http.post(config.requestIp + "/userManage/updateAdmin", {
    access_token: localStorage.getItem('access_token'),
    staffCredentialDto: params[0]
  });