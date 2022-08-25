import React from "react";
import { Table, Layout, Row, Col, Card, Button, Input, Modal, message, DatePicker } from "antd";
import {
  addDevice,
  deleteDevice,
  queryDevice,
  updateDevice
} from "../../axios";
import "./data.css";

const { Content } = Layout;
const InputGroup = Input.Group;

var obj = {};
var data = {};

// 转换时间格式
function add(n) {
  return n<10 ? '0'+n : n;
}

function addmilli(n) {
  if (n < 10){
    return '00'+n;
  }
  else if (n<100){
    return '0'+n;
  }
  else return n;
}

// var response = [
//   {
//     gid: 111111,
//     driverGid: 111111,
//     imei: "010101",
//     imsi: "010101",
//     licensePlate: "渝A8888",
//     lockStartTime: "2021-02-09T07:01:13.892+08:00",
//     lockEndTime: "2021-02-09T07:01:13.892+08:00",
//     lockStatus: 0
//   },
//   {
//     gid: 222222,
//     driverGid: 222222,
//     imei: "020202",
//     imsi: "020202",
//     licensePlate: "渝A8888",
//     lockStartTime: "2021-02-09T07:01:13.892+08:00",
//     lockEndTime: "2021-02-09T07:01:13.892+08:00",
//     lockStatus: 1
//   }
// ]

class App extends React.Component {
  state = {
    nodeInfoTableColumns: [
      {
        title: "挂车Gid",
        key: "gid",
        dataIndex: "gid"
      },
      {
        title: "司机Gid",
        key: "driverGid",
        dataIndex: "driverGid"
      },
      {
        title: "imei",
        key: "imei",
        dataIndex: "imei"
      },
      {
        title: "imsi",
        key: "imsi",
        dataIndex: "imsi"
      },
      {
        title: "车牌号",
        key: "licensePlate",
        dataIndex: "licensePlate"
      },
      {
        title: "上锁时间",
        key: "lockStartTime",
        dataIndex: "lockStartTime"
      },
      {
        title: "解锁时间",
        key: "lockEndTime",
        dataIndex: "lockEndTime"
      },
      {
        title: "上锁状态",
        key: "lockStatus",
        dataIndex: "lockStatus"
      },
      {
        title: "",
        dataIndex: "Edit",
        key: "Edit",
        render: (text, record, index)=>
        <Button onClick={() => {
          obj = record;
           // 更新汽车窗口可见
          this.setState({ updateDeviceModalVisible: true});
          this.setState({ //数据初始化
            updateDeviceGid: obj.gid,
            updateDeviceDriverGid: obj.driverGid,
            updateDeviceImei: obj.imei,
            updateDeviceImsi: obj.imsi,
            updateDeviceLicensePlate: obj.licensePlate,
            updateDeviceLockStartTime: obj.lockStartTime,
            updateDeviceLockEndTime: obj.lockEndTime,
            updateDeviceLockStatus: obj.lockStatus,
          })}}>编辑</Button>
      }
    ],
    collapsed: false,
    deviceIdSelected: [],
    deviceInfoTableDataSource: [],
    deleteDeviceDisabled: true,
    keyValue: "time"
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentDidMount() {
    // 获取汽车数据
    queryDevice().then(res => {
      if (res === undefined){
        message.error("The returned data was not retrieved!");
      }
      else{
        if (res.status === 200 || res.status === 201) {
          let deviceInfoTableDataSource = [];
          res.data.data.forEach(element => {
          // response.forEach(element => {
            let obj = {};
            obj.gid = element.gid;
            obj.driverGid = element.driverGid;
            obj.imei = element.imei;
            obj.imsi = element.imsi;
            obj.licensePlate = element.licensePlate;
            obj.lockStartTime = new Date(element.lockStartTime).getFullYear()+"-"+add((new Date(element.lockStartTime).getMonth()+1))+"-"+add(new Date(element.lockStartTime).getDate())+" "+add(new Date(element.lockStartTime).getHours())+":"+add(new Date(element.lockStartTime).getMinutes())+":"+add(new Date(element.lockStartTime).getSeconds());
            obj.lockEndTime = new Date(element.lockEndTime).getFullYear()+"-"+add((new Date(element.lockEndTime).getMonth()+1))+"-"+add(new Date(element.lockEndTime).getDate())+" "+add(new Date(element.lockEndTime).getHours())+":"+add(new Date(element.lockEndTime).getMinutes())+":"+add(new Date(element.lockEndTime).getSeconds());
            obj.lockStatus = element.lockStatus;  
            deviceInfoTableDataSource.push(obj);
           });
           this.setState({ deviceInfoTableDataSource: deviceInfoTableDataSource });
        } 
        else if (res.status === 401){
          message.error("Unauthorized, 获取汽车列表失败");
          return;
        }
        else if (res.status === 403){
          message.error("Forbidden, 获取汽车列表失败"); 
        }
        else {
          message.error("Not Found, 获取汽车列表失败");
        }
       }
      })
    }

    // 添加汽车窗口可见
    addDeviceModal = () => {
      this.setState({ addDeviceModalVisible: true });
    };
  
    // 添加新汽车信息
    addDeviceModalHandleOk = () => {
      if (
        !this.state.addDeviceGid  ||
        !this.state.addDeviceDriverGid  ||
        !this.state.addDeviceImei  ||
        !this.state.addDeviceImsi  ||
        !this.state.addDeviceLicensePlate  ||
        !this.state.addDeviceLockStatus  ||
        !this.state.addDevicePsw
      ) {
        message.error("请输入完整信息！");
      } else {
        let date = new Date();
        let endTime = this.state.addDeviceLockEndTime;
        let startTime = this.state.addDeviceLockStartTime;
        let data = {};
        data.driverGid = parseInt(this.state.addDeviceDriverGid);
        data.gid = parseInt(this.state.addDeviceGid);
        data.gmtCreate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+08:00";
        data.gmtUpdate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+08:00";
        data.imei = this.state.addDeviceImei;
        data.imsi = this.state.addDeviceImsi;
        data.licensePlate = this.state.addDeviceLicensePlate;
        data.lockStatus = parseInt(this.state.addDeviceLockStatus);
        data.psw = this.state.addDevicePsw
        if (endTime && startTime){
          data.lockEndTime = endTime.getUTCFullYear()+"-"+add((endTime.getUTCMonth()+1))+"-"+add(endTime.getUTCDate())+"T"+add(endTime.getUTCHours())+":"+add(endTime.getUTCMinutes())+":"+add(endTime.getUTCSeconds())+"."+addmilli(endTime.getUTCMilliseconds())+"+08:00";
          data.lockStartTime = startTime.getUTCFullYear()+"-"+add((startTime.getUTCMonth()+1))+"-"+add(startTime.getUTCDate())+"T"+add(startTime.getUTCHours())+":"+add(startTime.getUTCMinutes())+":"+add(startTime.getUTCSeconds())+"."+addmilli(startTime.getUTCMilliseconds())+"+08:00";
        }
        else if (!endTime && startTime){
          data.lockEndTime = null;
          data.lockStartTime = startTime.getUTCFullYear()+"-"+add((startTime.getUTCMonth()+1))+"-"+add(startTime.getUTCDate())+"T"+add(startTime.getUTCHours())+":"+add(startTime.getUTCMinutes())+":"+add(startTime.getUTCSeconds())+"."+addmilli(startTime.getUTCMilliseconds())+"+08:00";
        }
        else if (endTime && !startTime){
          data.lockEndTime = endTime.getUTCFullYear()+"-"+add((endTime.getUTCMonth()+1))+"-"+add(endTime.getUTCDate())+"T"+add(endTime.getUTCHours())+":"+add(endTime.getUTCMinutes())+":"+add(endTime.getUTCSeconds())+"."+addmilli(endTime.getUTCMilliseconds())+"+08:00";;
          data.lockStartTime = null;
        }
        else {
          data.lockEndTime = null;
          data.lockStartTime = null;
        }
        console.log(data);
        addDevice(data).then(res => {
          if (res === undefined){
            message.error("The returned data was not retrieved!");
            return;
          }
          else{
            if (res.status === 201 || res.status === 200) {
              message.success("添加成功！");
              queryDevice().then(res => {
                if (res === undefined){
                  message.error("The returned data was not retrieved!");
                }
                else{
                  if (res.status === 201 || res.status === 200) {
                    let deviceInfoTableDataSource = [];
                    res.data.data.forEach(element => {
                      let obj = {};
                      obj.gid = element.gid;
                      obj.driverGid = element.driverGid;
                      obj.imei = element.imei;
                      obj.imsi = element.imsi;
                      obj.licensePlate = element.licensePlate;
                      obj.lockStartTime = new Date(element.lockStartTime).getFullYear()+"-"+add((new Date(element.lockStartTime).getMonth()+1))+"-"+add(new Date(element.lockStartTime).getDate())+" "+add(new Date(element.lockStartTime).getHours())+":"+add(new Date(element.lockStartTime).getMinutes())+":"+add(new Date(element.lockStartTime).getSeconds());
                      obj.lockEndTime = new Date(element.lockEndTime).getFullYear()+"-"+add((new Date(element.lockEndTime).getMonth()+1))+"-"+add(new Date(element.lockEndTime).getDate())+" "+add(new Date(element.lockEndTime).getHours())+":"+add(new Date(element.lockEndTime).getMinutes())+":"+add(new Date(element.lockEndTime).getSeconds());
                      obj.lockStatus = element.lockStatus;  
                      deviceInfoTableDataSource.push(obj);
                    });
                    this.setState({ deviceInfoTableDataSource: deviceInfoTableDataSource });
                  } 
                  else if (res.status === 401){
                    message.error("Unauthorized, 获取汽车列表失败");
                  }
                  else if (res.status === 403){
                    message.error("Forbidden, 获取汽车列表失败");
                  }
                  else {
                    message.error("Not Found, 获取汽车列表失败");
                  }
                }
              });
            } 
            else if (res.status === 401){
              message.error("Unauthorized, 添加失败");
              return;
            }
            else if (res.status === 403){
              message.error("Forbidden, 添加失败"); 
              return;
            }
            else {
              message.error("Not Found, 添加失败");
              return;
            }
          }
          this.setState({ addDeviceModalVisible: false });
          this.setState({
            addDeviceGid: null,
            addDeviceDriverGid: null,
            addDeviceImei: null,
            addDeviceImsi: null,
            addDeviceLicensePlate: null,
            addDeviceLockEndTime: null,
            addDeviceLockStartTime: null,
            addDeviceLockStatus: null,
            addDevicePsw: null,
            keyValue: new Date()
          });
        });
      }
    };
  
    // 取消增加汽车，变量清零
    addDeviceModalHandleCancel = () => {
      this.setState({ addDeviceModalVisible: false });
      this.setState({
        addDeviceGid: null,
        addDeviceDriverGid: null,
        addDeviceImei: null,
        addDeviceImsi: null,
        addDeviceLicensePlate: null,
        addDeviceLockEndTime: null,
        addDeviceLockStartTime: null,
        addDeviceLockStatus: null,
        addDevicePsw: null,
        keyValue: new Date()
      });
    };
  
    // 更新汽车信息
    updateDeviceModalHandleOk = () => {
      if (
        !String(this.state.updateDeviceGid)  ||
        !String(this.state.updateDeviceDriverGid)  ||
        !this.state.updateDeviceImei  ||
        !this.state.updateDeviceImsi  ||
        !this.state.updateDeviceLicensePlate  ||
        !String(this.state.updateDeviceLockStatus)  ||
        !this.state.updateDevicePsw
      ) {
        message.error("请输入完整信息！");
      } 
      else {
        if (this.state.updateDeviceLockStartTime[4] !== '-' && this.state.updateDeviceLockEndTime[4] !== '-' && this.state.updateDeviceLockStartTime !== null && this.state.updateDeviceLockEndTime !== null){
          let date = new Date();
          let endTime = this.state.updateDeviceLockEndTime;
          let startTime = this.state.updateDeviceLockStartTime;
          data.driverGid = parseInt(this.state.updateDeviceDriverGid);
          data.gid = parseInt(this.state.updateDeviceGid);
          data.gmtCreate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.gmtUpdate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.imei = this.state.updateDeviceImei;
          data.imsi = this.state.updateDeviceImsi;
          data.licensePlate = this.state.updateDeviceLicensePlate;
          data.lockEndTime = endTime.getUTCFullYear()+"-"+add((endTime.getUTCMonth()+1))+"-"+add(endTime.getUTCDate())+"T"+add(endTime.getUTCHours())+":"+add(endTime.getUTCMinutes())+":"+add(endTime.getUTCSeconds())+"."+addmilli(endTime.getUTCMilliseconds())+"+00:00";
          data.lockStartTime = startTime.getUTCFullYear()+"-"+add((startTime.getUTCMonth()+1))+"-"+add(startTime.getUTCDate())+"T"+add(startTime.getUTCHours())+":"+add(startTime.getUTCMinutes())+":"+add(startTime.getUTCSeconds())+"."+addmilli(startTime.getUTCMilliseconds())+"+00:00";
          data.lockStatus = parseInt(this.state.updateDeviceLockStatus);
          data.psw = this.state.updateDevicePsw;
        }
        else if ((this.state.updateDeviceLockStartTime[4] !== '-' && this.state.updateDeviceLockEndTime[4] === '-' && this.state.updateDeviceLockStartTime !== null) || (this.state.updateDeviceLockStartTime[4] !== '-' && this.state.updateDeviceLockEndTime[4] !== '-' && this.state.updateDeviceLockStartTime !== null && this.state.updateDeviceLockEndTime === null) ){
          let date = new Date();
          let startTime = this.state.updateDeviceLockStartTime;
          data.driverGid = parseInt(this.state.updateDeviceDriverGid);
          data.gid = parseInt(this.state.updateDeviceGid);
          data.gmtCreate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.gmtUpdate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.imei = this.state.updateDeviceImei;
          data.imsi = this.state.updateDeviceImsi;
          data.licensePlate = this.state.updateDeviceLicensePlate;
          data.lockEndTime = this.state.updateDeviceLockEndTime;
          data.lockStartTime = startTime.getUTCFullYear()+"-"+add((startTime.getUTCMonth()+1))+"-"+add(startTime.getUTCDate())+"T"+add(startTime.getUTCHours())+":"+add(startTime.getUTCMinutes())+":"+add(startTime.getUTCSeconds())+"."+addmilli(startTime.getUTCMilliseconds())+"+00:00";
          data.lockStatus = parseInt(this.state.updateDeviceLockStatus);
          data.psw = this.state.updateDevicePsw;
        }
        else if ((this.state.updateDeviceLockStartTime[4] === '-' && this.state.updateDeviceLockEndTime[4] !== '-' && this.state.updateDeviceLockEndTime != null) || (this.state.updateDeviceLockStartTime[4] !== '-' && this.state.updateDeviceLockEndTime[4] !== '-' && this.state.updateDeviceLockStartTime === null && this.state.updateDeviceLockEndTime !== null) ){
          let date = new Date();
          let endTime = this.state.updateDeviceLockEndTime;
          data.driverGid = parseInt(this.state.updateDeviceDriverGid);
          data.gid = parseInt(this.state.updateDeviceGid);
          data.gmtCreate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.gmtUpdate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.imei = this.state.updateDeviceImei;
          data.imsi = this.state.updateDeviceImsi;
          data.licensePlate = this.state.updateDeviceLicensePlate;
          data.lockEndTime = endTime.getUTCFullYear()+"-"+add((endTime.getUTCMonth()+1))+"-"+add(endTime.getUTCDate())+"T"+add(endTime.getUTCHours())+":"+add(endTime.getUTCMinutes())+":"+add(endTime.getUTCSeconds())+"."+addmilli(endTime.getUTCMilliseconds())+"+00:00";
          data.lockStartTime = this.state.updateDeviceLockStartTime;
          data.lockStatus = parseInt(this.state.updateDeviceLockStatus);
          data.psw = this.state.updateDevicePsw;
        }
        else {
          let date = new Date();
          data.driverGid = parseInt(this.state.updateDeviceDriverGid);
          data.gid = parseInt(this.state.updateDeviceGid);
          data.gmtCreate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.gmtUpdate = date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
          data.imei = this.state.updateDeviceImei;
          data.imsi = this.state.updateDeviceImsi;
          data.licensePlate = this.state.updateDeviceLicensePlate;
          data.lockEndTime = this.state.updateDeviceLockEndTime;
          data.lockStartTime = this.state.updateDeviceLockStartTime;
          data.lockStatus = parseInt(this.state.updateDeviceLockStatus);
          data.psw = this.state.updateDevicePsw;
        }
        //console.log(data);
        updateDevice(data).then(res => {
          if (res === undefined){
            message.error("The returned data was not retrieved!");
            return;
          }
          else {
            if (res.status === 201 || res.status === 200) {
              message.success("更新成功！");
              queryDevice().then(res => {
                if (res === undefined){
                  message.error("The returned data was not retrieved!");
                }
                else{
                  if (res.status === 201 || res.status === 200) {
                    let deviceInfoTableDataSource = [];
                    res.data.data.forEach(element => {
                      let obj = {};
                      obj.gid = element.gid;
                      obj.driverGid = element.driverGid;
                      obj.imei = element.imei;
                      obj.imsi = element.imsi;
                      obj.licensePlate = element.licensePlate;
                      obj.lockStartTime = new Date(element.lockStartTime).getFullYear()+"-"+add((new Date(element.lockStartTime).getMonth()+1))+"-"+add(new Date(element.lockStartTime).getDate())+" "+add(new Date(element.lockStartTime).getHours())+":"+add(new Date(element.lockStartTime).getMinutes())+":"+add(new Date(element.lockStartTime).getSeconds());
                      obj.lockEndTime = new Date(element.lockEndTime).getFullYear()+"-"+add((new Date(element.lockEndTime).getMonth()+1))+"-"+add(new Date(element.lockEndTime).getDate())+" "+add(new Date(element.lockEndTime).getHours())+":"+add(new Date(element.lockEndTime).getMinutes())+":"+add(new Date(element.lockEndTime).getSeconds());
                      obj.lockStatus = element.lockStatus;  
                      deviceInfoTableDataSource.push(obj);
                    });
                    this.setState({ deviceInfoTableDataSource: deviceInfoTableDataSource });
                  } 
                  else if (res.status === 401){
                    message.error("Unauthorized, 获取汽车列表失败");
                  }
                  else if (res.status === 403){
                    message.error("Forbidden, 获取汽车列表失败");
                  }
                  else {
                    message.error("Not Found, 获取汽车列表失败");
                  }
                }
              });
            } else if (res.status === 401){
              message.error("Unauthorized, 更新失败");
              return;
            }
            else if (res.status === 403){
              message.error("Forbidden, 更新失败");
              return;
            }
            else {
              message.error("Not Found, 更新失败");
              return;
            }
          }
          this.setState({ updateDeviceModalVisible: false });
          this.setState({
            updateDeviceGid: obj.gid,
            updateDeviceDriverGid: obj.driverGid,
            updateDeviceImei: obj.imei,
            updateDeviceImsi: obj.imsi,
            updateDeviceLicensePlate: obj.licensePlate,
            updateDeviceLockEndTime: obj.lockEndTime,
            updateDeviceLockStartTime: obj.lockStartTime,
            updateDeviceLockStatus: obj.lockStatus,
            updateDevicePsw: obj.psw,
            keyValue: new Date()
          });
        });
      }
    }
  
    //取消汽车信息更新
    updateDeviceModalHandleCancel = () => {
      this.setState( {updateDeviceModalVisible: false });
      this.setState({
        updateDeviceGid: obj.gid,
        updateDeviceDriverGid: obj.driverGid,
        updateDeviceImei: obj.imei,
        updateDeviceImsi: obj.imsi,
        updateDeviceLicensePlate: obj.licensePlate,
        updateDeviceLockEndTime: obj.lockEndTime,
        updateDeviceLockStartTime: obj.lockStartTime,
        updateDeviceLockStatus: obj.lockStatus,
        updateDevicePsw: obj.psw,
        keyValue: new Date()
      });
    }
  
    //删除汽车窗口可见
    deleteNodeModel = () => {
      this.setState({ deleteNodeModalVisible: true });
    };
  
    // 删除汽车函数
    deleteNodeModalHandleOk = () => {
      if (this.state.deviceIdSelected.length !== 1) {
        message.error('不可批量删除汽车，请选择一辆汽车');
        return;
      }
      deleteDevice([this.state.deviceIdSelected[0]]).then(res => {
        if (res === undefined){
          message.error("The returned data was not retrieved!");
          return;
        }
        else {
          if (res.status === 200 || res.status === 201) {
            message.success("删除成功！");
            queryDevice().then(res => {
              if (res === undefined){
                message.error("The returned data was not retrieved!");
              }
              else {
                if (res.status === 200 || res.status === 201) {
                  let deviceInfoTableDataSource = [];
                  res.data.data.forEach(element => {
                    let obj = {};
                    obj.gid = element.gid;
                    obj.driverGid = element.driverGid;
                    obj.imei = element.imei;
                    obj.imsi = element.imsi;
                    obj.licensePlate = element.licensePlate;
                    obj.lockStartTime = new Date(element.lockStartTime).getFullYear()+"-"+add((new Date(element.lockStartTime).getMonth()+1))+"-"+add(new Date(element.lockStartTime).getDate())+" "+add(new Date(element.lockStartTime).getHours())+":"+add(new Date(element.lockStartTime).getMinutes())+":"+add(new Date(element.lockStartTime).getSeconds());
                    obj.lockEndTime = new Date(element.lockEndTime).getFullYear()+"-"+add((new Date(element.lockEndTime).getMonth()+1))+"-"+add(new Date(element.lockEndTime).getDate())+" "+add(new Date(element.lockEndTime).getHours())+":"+add(new Date(element.lockEndTime).getMinutes())+":"+add(new Date(element.lockEndTime).getSeconds());
                    obj.lockStatus = element.lockStatus;  
                    deviceInfoTableDataSource.push(obj);
                  });
                  this.setState({ deviceInfoTableDataSource: deviceInfoTableDataSource });
                } 
                else if (res.status === 401) {
                  message.error("Unauthorized, 获取汽车列表失败");
                }
                else if (res.status === 403) {
                  message.error("Forbidden, 获取汽车列表失败");
                }
                else {
                  message.error("Not Found, 获取汽车列表失败");
                }
              }
            });
          } 
          else if (res.status === 401) {
            message.error("Unauthorized, 删除失败");
            return;
          }
          else if (res.status === 403) {
            message.error("Forbidden, 删除失败");
            return;
          }
          else {
            message.error("Not Found, 删除失败");
            return;
          }
        }
        this.setState({ deleteNodeModalVisible: false });
      });
    };
  
    deleteNodeModalHandleCancel = () => {
      this.setState({ deleteNodeModalVisible: false });
    };
  
    dataInfoTableRowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows)
        if (selectedRows.length < 1) {
          this.setState({ deleteDeviceDisabled: true })
        }else{
          this.setState({ deleteDeviceDisabled: false })
        }
        let re = [];
        selectedRows.forEach(ele => {
          re.push(ele.gid)
        })
        this.setState({ deviceIdSelected: re });
      }
    };
  
    render() {
      return (
        <Layout style={{ minHeight: "100vh" }}>
          <Layout>
            <Content style={{ margin: "16px 16px" }} id="NodeManage">
              <Card title="汽车信息管理" id="nodeManage">
                <div className="gutter-example-nodemanage">
                  <Row>
                    <Col className="gutter-row-nodemanage" span={6}>
                      <div className="gutter-box-nodemanage">
                        <div>
                          <Button type="primary" onClick={this.addDeviceModal}>
                            添加
                          </Button>
                          <Button
                            disabled={this.state.deleteDeviceDisabled}
                            onClick={this.deleteNodeModel}
                            style={{ marginLeft: 10 }}
                          >
                            删除
                          </Button>
                          <Modal
                            title="提示"
                            visible={this.state.deleteNodeModalVisible}
                            onOk={this.deleteNodeModalHandleOk}
                            onCancel={this.deleteNodeModalHandleCancel}
                            cancelText="取消"
                            okText="确定"
                          >
                            <p>确定删除选中汽车吗？</p>
                          </Modal>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div style={{ marginTop: 5 }}>
                  <Table
                    rowSelection={this.dataInfoTableRowSelection}
                    dataSource={this.state.deviceInfoTableDataSource}
                    columns={this.state.nodeInfoTableColumns}
                  />
                </div>
                <div id="addDevice">
                  <Modal
                    title="添加汽车信息"
                    visible={this.state.addDeviceModalVisible}
                    onOk={this.addDeviceModalHandleOk}
                    onCancel={this.addDeviceModalHandleCancel}
                    cancelText="取消"
                    okText="确定"
                  >
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="挂车Gid"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入挂车Gid"
                        value={this.state.addDeviceGid}
                        onChange={e => {
                          this.setState({ addDeviceGid: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="司机Gid"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入司机Gid"
                        value={this.state.addDeviceDriverGid}
                        onChange={e => {
                          this.setState({ addDeviceDriverGid: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="imei"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入imei"
                        value={this.state.addDeviceImei}
                        onChange={e => {
                          this.setState({ addDeviceImei: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="imsi"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入imsi"
                        value={this.state.addDeviceImsi}
                        onChange={e => {
                          this.setState({ addDeviceImsi: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="车牌号"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入车牌号"
                        value={this.state.addDeviceLicensePlate}
                        onChange={e => {
                          this.setState({ addDeviceLicensePlate: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="上锁时间"
                        disabled={true}
                        className="inputTitle"
                      />
                      <DatePicker showTime
                        style={{ width: "80%" }}
                        placeholder="请选择上锁时间"
                        key={this.state.keyValue}
                        onChange={e => {
                          if (e){ 
                            this.setState({ addDeviceLockStartTime: e._d });
                          }
                          else {
                            this.setState({ addDeviceLockStartTime: null });
                          }
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="解锁时间"
                        disabled={true}
                        className="inputTitle"
                      />
                      <DatePicker showTime
                        style={{ width: "80%" }}
                        placeholder="请选择解锁时间"
                        key={this.state.keyValue}
                        onChange={e => {
                          if (e){
                            this.setState({ addDeviceLockEndTime: e._d });
                          }
                          else {
                            this.setState({ addDeviceLockEndTime: null });
                          }
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="上锁状态"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入上锁状态"
                        value={this.state.addDeviceLockStatus}
                        onChange={e => {
                          this.setState({ addDeviceLockStatus: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="密码"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        placeholder="请输入密码"
                        value={this.state.addDevicePsw}
                        onChange={e => {
                          this.setState({ addDevicePsw: e.target.value });
                        }}
                      />
                    </InputGroup>
                  </Modal>
                </div>
                <div id="updateDevice">
                  <Modal
                    title="更新汽车信息"
                    visible={this.state.updateDeviceModalVisible}
                    onOk={this.updateDeviceModalHandleOk}
                    onCancel={this.updateDeviceModalHandleCancel}
                    cancelText="取消"
                    okText="确定"
                  >
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="挂车Gid"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceGid}
                        onChange={e => {
                          this.setState({ updateDeviceGid: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="司机Gid"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceDriverGid}
                        onChange={e => {
                          this.setState({ updateDeviceDriverGid: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="imei"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceImei}
                        onChange={e => {
                          this.setState({ updateDeviceImei: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="imsi"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceImsi}
                        onChange={e => {
                          this.setState({ updateDeviceImsi: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="车牌号"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceLicensePlate}
                        onChange={e => {
                          this.setState({ updateDeviceLicensePlate: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="上锁时间"
                        disabled={true}
                        className="inputTitle"
                      />
                      <DatePicker showTime
                        style={{ width: "80%" }}
                        placeholder={obj.lockStartTime}
                        key={this.state.keyValue}
                        onChange={e => {
                          if (e){
                            this.setState({ updateDeviceLockStartTime: e._d });
                          }
                          else {
                            this.setState({ updateDeviceLockStartTime: null });
                          }
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="解锁时间"
                        disabled={true}
                        className="inputTitle"
                      />
                      <DatePicker showTime
                        style={{ width: "80%" }}
                        placeholder={obj.lockEndTime}
                        key={this.state.keyValue}
                        onChange={e => {
                          if (e){
                            this.setState({ updateDeviceLockEndTime: e._d });
                          }
                          else{
                            this.setState({ updateDeviceLockEndTime: null });
                          }
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="上锁状态"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDeviceLockStatus}
                        onChange={e => {
                          this.setState({ updateDeviceLockStatus: e.target.value });
                        }}
                      />
                    </InputGroup>
                    <InputGroup compact>
                      <Input
                        style={{ width: "20%" }}
                        defaultValue="密码"
                        disabled={true}
                        className="inputTitle"
                      />
                      <Input
                        style={{ width: "80%" }}
                        value={this.state.updateDevicePsw}
                        onChange={e => {
                          this.setState({ updateDevicePsw: e.target.value });
                        }}
                      />
                    </InputGroup>
                  </Modal>
                </div>
              </Card>
            </Content>
          </Layout>
        </Layout>
      );
    }
  }
  
  export default App;
  