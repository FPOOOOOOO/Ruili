import React from "react";
import {
  Layout,
  Card,
  Button,
  message,
  DatePicker,
  Input,
  Modal,
  Tooltip,
  List,
  Pagination
} from "antd";
import{
  MenuOutlined,
  KeyOutlined,
  SearchOutlined,
  MonitorOutlined,
  FireOutlined,
  LinkOutlined,
  DisconnectOutlined,
  CheckOutlined,
  CloseOutlined,
  PoweroffOutlined,
  ExclamationOutlined
}
from '@ant-design/icons';

import { 
  Chart,  
  Axis, 
  Guide,
  Point,
  Geom
 } from "bizcharts";
import {
  InfoWindow,
  Map, 
  Marker, 
  MarkerList, 
  NavigationControl, 
  Polyline
} from "react-bmap";
import {
  queryTsData,
  queryDevice
} from "../../axios";
import "./queryTsData.css";
import qs from "qs";

const { Content } = Layout;
const InputGroup = Input.Group;
const { Line } = Guide;
const gridStyle = { 
  width: "20%", 
  height: "200px", 
  textAlign: "center", 
  padding: "10px" 
};
const cardStyle = { 
  width: "100%", 
  height: "200px",  
  padding: "10px" 
};
const cols = {
  time: {
    alias: "时间"
  },
  speed: {
    alias: "速度(km/h)"
  }
};

var len = 0; //所有汽车

var length = 0; //单个汽车

var carAmount = 0;
var allCarData = [];
var allCarLocation = [
  {
    lng: 116.397128,
    lat: 399.16527
  }
];
var data = [];
var objSpeed = [];
var ABSstatus = [];
var location = [
  {
    time: new Date().getUTCFullYear()+"-"+add((new Date().getUTCMonth()+1))+"-"+add(new Date().getUTCDate())+"T"+add(new Date().getUTCHours())+":"+add(new Date().getUTCMinutes())+":"+add(new Date().getUTCSeconds())+"."+addmilli(new Date().getUTCMilliseconds())+"+00:00",
    lng: 116.397128,
    lat: 39.916527,
    height: 0,
    direction: "正北"
  }
];
var historicalLocation = [
  {
    lng: 116.397128,
    lat: 399.16527
  }
];

var carQueryParam = {
  st: "",
  et: "",
  fields: [
    "direction","height","lat","lng","locationTime","speed","status"
  ],
  retentionPolicy: "",
  tags: {
    terminalId: ""
  }
};

// 转换时间格式
function add(n) {
  return n<10 ? "0"+n : n;
}

function addmilli(n) {
  if (n < 10){
    return "00"+n;
  }
  else if (n<100){
    return "0"+n;
  }
  else return n;
}

const response = {
  data:{
    error: "",
    results: [{
      error: "",
      series: [
        {
          columns: [
            "locationTime",
            "height",
            "lng",
            "lat",
            "speed",
            "direction",
            "status"
          ],
          values: [[
            "2021-02-09T07:01:13.892+00:00",
            800,
            117.397128,
            40.916527,
            0,
            0,
            0 
          ],
          [
            "2021-02-09T07:02:13.892+00:00",
            801,
            118.397129,
            41.916528,
            2,
            0,
            0 
          ],
          [
            "2021-02-09T07:03:13.892+00:00",
            799,
            119.397130,
            42.916529,
            7,
            0,
            4096 
          ],
          [
            "2021-02-09T07:04:13.892+00:00",
            801,
            120.397131,
            43.916530,
            10,
            0,
            0 
          ],
          [
            "2021-02-09T07:05:13.892+00:00",
            801,
            121.397132,
            44.916531,
            20,
            0,
            0 
          ],
          [
            "2021-02-09T07:06:13.892+00:00",
            801,
            122.397133,
            45.916532,
            13,
            0,
            0 
          ],
          [
            "2021-02-09T07:07:13.892+00:00",
            801,
            123.397134,
            46.916533,
            0,
            45,
            45 
          ],
          [
            "2021-02-09T07:08:13.892+00:00",
            801,
            122.397133,
            45.916532,
            13,
            271,
            0 
          ]
        ]
        }
      ]
    }]
  }
}

const responseCar = [
  {
    gid: 111111,
    driverGid: 111111,
    imei: "010101",
    imsi: "010101",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 0
  },
  {
    gid: 222222,
    driverGid: 222222,
    imei: "020202",
    imsi: "020202",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 1
  },
  {
    gid: 333333,
    driverGid: 333333,
    imei: "020202",
    imsi: "020202",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 1
  },
  {
    gid: 444444,
    driverGid: 444444,
    imei: "020202",
    imsi: "020202",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 1
  },
  {
    gid: 555555,
    driverGid: 555555,
    imei: "020202",
    imsi: "020202",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 1
  },{
    gid: 666666,
    driverGid: 666666,
    imei: "020202",
    imsi: "020202",
    licensePlate: "渝A8888",
    lockStartTime: "2021-02-09T07:01:13.892+00:00",
    lockEndTime: "2021-02-09T07:01:13.892+00:00",
    lockStatus: 1
  }
]

class App extends React.Component {
  // 状态变更变量
  constructor(props) {
    super(props);
    this.state = {
      carData: true, //false,
      collapsed: false,
      speedTableDataSource: [],
      accOnlineState: "开",
      carLoadState: "满载",
      oilWayState: "断开",
      elecWayState: "断开",
      carDoorState: "解锁",
      inputDeviceModalVisible: false,
      keyValue: "time",
      key: "tab1",
      minValue: 0,
      maxValue: 4,
      current: 1,
      showABS: false
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (
      this.props !== nextProps ||
      this.state !== nextState
    ){
      return true;
    }
    
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  onTabChange = (key, type) => { 
    this.setState({ [type]: key }); 
  }

  handleChange = value => {
    this.setState({
      minValue: (value-1) * 4,
      maxValue: value * 4,
      current: value
    })
  };

  // componentDidMount() {
  //   carQueryParam.tags.terminalId="";
  //   // 展示所有汽车
  //   queryDevice().then(res => {
  //     if (res === undefined){
  //       message.error("The returned data was not retrieved!");
  //     }
  //     else{
  //       if (res.status === 200 || res.status === 201) {
  //         allCarData = new Array(); 
  //         carAmount = 0;
  //         res.data.data.forEach(element => {
  //         // responseCar.forEach(element => {
  //           allCarData[carAmount] = new Object();
  //           allCarData[carAmount].gid = element.gid;
  //           allCarData[carAmount].driverGid = element.driverGid;
  //           allCarData[carAmount].lockStartTime = new Date(element.lockStartTime).getFullYear()+"-"+add((new Date(element.lockStartTime).getMonth()+1))+"-"+add(new Date(element.lockStartTime).getDate())+" "+add(new Date(element.lockStartTime).getHours())+":"+add(new Date(element.lockStartTime).getMinutes())+":"+add(new Date(element.lockStartTime).getSeconds());
  //           allCarData[carAmount].lockEndTime = new Date(element.lockEndTime).getFullYear()+"-"+add((new Date(element.lockEndTime).getMonth()+1))+"-"+add(new Date(element.lockEndTime).getDate())+" "+add(new Date(element.lockEndTime).getHours())+":"+add(new Date(element.lockEndTime).getMinutes())+":"+add(new Date(element.lockEndTime).getSeconds());
  //           allCarData[carAmount].lockStatus = element.lockStatus; 
  //           carAmount++;
  //         });
  //       }
  //       else if (res.status === 401){
  //         message.error("Unauthorized, 获取汽车列表失败");
  //         return;
  //       }
  //       else if (res.status === 403){
  //         message.error("Forbidden, 获取汽车列表失败"); 
  //       }
  //       else {
  //         message.error("Not Found, 获取汽车列表失败");
  //       }
  //     }
  //   })
  //   let cars=0;
  //   let date=new Date();
  //   allCarLocation=new Array();
  //   for (cars=0; cars<carAmount; cars++){  
  //     allCarLocation[cars]=new Object();            
  //     allCarLocation[cars].gid=allCarData[cars].gid;
  //     allCarLocation[cars].text="挂车Gid: "+allCarData[cars].gid;
  //     carQueryParam.tags.terminalId=allCarData[cars].gid; // 因为只能请求到gid，所以用这个作为时序数据查询的唯一标识
  //     console.log(carQueryParam.tags.terminalId);
  //     carQueryParam.st=date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
  //     carQueryParam.et=date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(date.getUTCHours())+":"+add(date.getUTCMinutes())+":"+add(date.getUTCSeconds())+"."+addmilli(date.getUTCMilliseconds())+"+00:00";
  //     queryTsData(carQueryParam).then(res => {
  //       if (res === undefined){
  //         message.error("The returned data was not retrieved!");
  //         return;
  //       }
  //       else {
  //         console.log(res);
  //         if (res.status === 200 || res.status === 201){
  //           len = 0;
  //           let allCarLoc=new Array();
  //           res.data.data.results[0].series[0].values.forEach(element => {
  //           // response.data.results[0].series[0].values.forEach(element => {
  //             allCarLoc[len]=new Object();
  //             allCarLoc[len].lat = element[3]*1.0;
  //             allCarLoc[len].lng = element[2]*1.0;
  //             len++;
  //           });
  //           len--;
  //           allCarLocation[cars].lat=allCarLoc[len].lat;
  //           allCarLocation[cars].lng=allCarLoc[len].lng;
  //           allCarLocation[cars].location=allCarLoc[len].lng+","+allCarLoc[len].lat;
  //         }
  //         else if (res.status === 401){
  //           message.error("Unauthorized, 获取时序数据失败");
  //           return;
  //         }
  //         else if (res.status === 403){
  //           message.error("Forbidden, 获取时序数据失败"); 
  //           return;
  //         }
  //         else {
  //           message.error("Not Found, 获取时序数据失败");
  //           return;
  //         }
  //       }
  //     })
  //   }
  //   // allCarLocation[cars]=new Object();
  //   // allCarLocation[cars].text="挂车Gid: "+777777;
  //   // allCarLocation[cars].location="116.397128,39.916527";
  //   this.setState({carData: false});
  // }

  inputDeviceModal = () => {
    this.setState({ inputDeviceModalVisible: true });
  };

  inputDeviceModalHandleOk = () => {
    if (
      !this.state.inputDeviceTerminalId ||
      !this.state.inputDeviceSt ||
      !this.state.inputDeviceEt
    ) {
      message.error("请输入完整查询信息！");
    }
    else {
      carQueryParam.tags.terminalId=this.state.inputDeviceTerminalId;
      carQueryParam.st=this.state.inputDeviceSt.getUTCFullYear()+"-"+add((this.state.inputDeviceSt.getUTCMonth()+1))+"-"+add(this.state.inputDeviceSt.getUTCDate())+"T"+add(this.state.inputDeviceSt.getUTCHours())+":"+add(this.state.inputDeviceSt.getUTCMinutes())+":"+add(this.state.inputDeviceSt.getUTCSeconds())+"."+addmilli(this.state.inputDeviceSt.getUTCMilliseconds())+"+00:00";
      carQueryParam.et=this.state.inputDeviceEt.getUTCFullYear()+"-"+add((this.state.inputDeviceEt.getUTCMonth()+1))+"-"+add(this.state.inputDeviceEt.getUTCDate())+"T"+add(this.state.inputDeviceEt.getUTCHours())+":"+add(this.state.inputDeviceEt.getUTCMinutes())+":"+add(this.state.inputDeviceEt.getUTCSeconds())+"."+addmilli(this.state.inputDeviceEt.getUTCMilliseconds())+"+00:00";
      console.log(carQueryParam.st);
      queryTsData(carQueryParam).then(res => {
        if (res === undefined){
          message.error("The returned data was not retrieved!");
          return;
        }
        else {
          if (res.status === 200 || res.status === 201){
            data=new Array();
            objSpeed=new Array();
            location=new Array();
            historicalLocation=new Array();
            length = 0;
            if (res.data.data.results[0].series !== null) {
              res.data.data.results[0].series[0].values.forEach(element => {
            // response.data.results[0].series[0].values.forEach(element => {
              data[length]=new Array();
              data[length] = element;
              objSpeed[length]=new Object();
              objSpeed[length].speed = element[4];
              objSpeed[length].time = new Date(element[0]).getFullYear()+"-"+add((new Date(element[0]).getMonth()+1))+"-"+add(new Date(element[0]).getDate())+" "+add(new Date(element[0]).getHours())+":"+add(new Date(element[0]).getMinutes())+":"+add(new Date(element[0]).getSeconds())+'.'+addmilli(new Date(element[0]).getMilliseconds());
              location[length]=new Object();
              if (element[5] === 0){
                location[length].direction="正北";
              }
              else if(element[5] === 90){
                location[length].direction="正东";
              }
              else if (element[5] === 180){
                location[length].direction="正南";
              }
              else if (element[5] === 270){
                location[length].direction="正西";
              }
              else if (element[5] > 0 && element[5] < 90){
                location[length].direction="北偏东"+element[5]+"°";
              }
              else if (element[5] > 90 && element[5] < 180){
                location[length].direction="南偏东"+(180-element[5])+"°";
              }
              else if (element[5] > 180 && element[5] < 270){
                location[length].direction="南偏西"+(element[5]-180)+"°";
              }
              else {
                location[length].direction="北偏西"+(360-element[5])+"°";
              }
              location[length].height = element[1];
              location[length].lat = element[3]*1.0;
              location[length].lng = element[2]*1.0;
              location[length].time = element[0];
              historicalLocation[length]=new Object();
              historicalLocation[length].lat=element[3]*1.0;
              historicalLocation[length].lng=element[2]*1.0;
              length++;
            });
            length--;
            // console.log(data);
            this.setState({accOnlineState : "" + (data[length][6] & 1) === "1" ? "开" : "关"});
            this.setState({carLoadState : "" + (data[length][6] & 768) === "768" ? "满载" : ("" + (data[length][6] & 768) === "0" ? "空载" : "半载")});
            this.setState({oilWayState : "" + (data[length][6] & 1024) === "1024" ? "正常" : "断开"});
            this.setState({elecWayState: "" + (data[length][6] & 2048) === "2048" ? "正常" : "断开"});
            this.setState({carDoorState : "" + (data[length][6] & 4096) === "4096" ? "加锁" : "解锁"});
            }
            else {
              message.error("该时间段内没有数据，请重新选择")
            }
          }
          else if (res.status === 401){
            message.error("Unauthorized, 获取时序数据失败");
            return;
          }
          else if (res.status === 403){
            message.error("Forbidden, 获取时序数据失败"); 
            return;
          }
          else {
            message.error("Not Found, 获取时序数据失败");
            return;
          }
        }
        this.setState({
          inputDeviceModalVisible: false,
          keyValue: new Date(),
          inputDeviceTerminalId: null,
          inputDeviceSt: null,
          inputDeviceEt: null
        });
      }) 
    }
  };

  inputDeviceModalHandleCancel = () => {
    this.setState({
      inputDeviceModalVisible: false,
      keyValue: new Date(),
      inputDeviceTerminalId: null,
      inputDeviceSt: null,
      inputDeviceEt: null
    });
  };

  handleChooseCar = gid => {
    this.setState({carData: true})
    let date = new Date();
    carQueryParam.tags.terminalId=gid; // 因为请求不到挂车的terminalId，所以暂时用挂车Gid代替
    carQueryParam.st=date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(0)+":"+add(0)+":"+add(0)+"."+addmilli(0)+"+00:00";
    carQueryParam.et=date.getUTCFullYear()+"-"+add((date.getUTCMonth()+1))+"-"+add(date.getUTCDate())+"T"+add(23)+":"+add(59)+":"+add(59)+"."+addmilli(999)+"+00:00";
    console.log(qs.stringify(carQueryParam));
    queryTsData(carQueryParam).then(res => {
      if (res === undefined){
        message.error("The returned data was not retrieved!");
      }
      else {
        if (res.status === 200 || res.status === 201){
          length = 0;
          data=new Array();
          objSpeed=new Array();
          location=new Array();
          historicalLocation=new Array();
          ABSstatus=new Array();
          if (res.data.data.data.results[0].series === null) {
            message.warn("Warning, 未查询到时序数据"); 
          } else {
            res.data.data.data.results[0].series[0].values.forEach(element => {
            // response.data.results[0].series[0].values.forEach(element => {
              data[length]=new Array();
              data[length] = element;
              ABSstatus[length] = new Object();
              ABSstatus[length].ABSstatus = element[6];
              ABSstatus[length].time = new Date(element[0]).getFullYear()+"-"+add((new Date(element[0]).getMonth()+1))+"-"+add(new Date(element[0]).getDate())+" "+add(new Date(element[0]).getHours())+":"+add(new Date(element[0]).getMinutes())+":"+add(new Date(element[0]).getSeconds())+'.'+addmilli(new Date(element[0]).getMilliseconds());
              objSpeed[length]=new Object();
              objSpeed[length].speed = element[4];
              objSpeed[length].time = new Date(element[0]).getFullYear()+"-"+add((new Date(element[0]).getMonth()+1))+"-"+add(new Date(element[0]).getDate())+" "+add(new Date(element[0]).getHours())+":"+add(new Date(element[0]).getMinutes())+":"+add(new Date(element[0]).getSeconds())+'.'+addmilli(new Date(element[0]).getMilliseconds());
              location[length]=new Object();
              if (element[5] === 0){
                location[length].direction="正北";
              }
              else if(element[5] === 90){
                location[length].direction="正东";
              }
              else if (element[5] === 180){
                location[length].direction="正南";
              }
              else if (element[5] === 270){
                location[length].direction="正西";
              }
              else if (element[5] > 0 && element[5] < 90){
                location[length].direction="北偏东"+element[0]+"°";
              }
              else if (element[5] > 90 && element[5] < 180){
                location[length].direction="南偏东"+(180-element[5])+"°";
              }
              else if (element[5] > 180 && element[5] < 270){
                location[length].direction="南偏西"+(element[5]-180)+"°";
              }
              else {
                location[length].direction="北偏西"+(360-element[5])+"°";
              }
              location[length].height = element[1];
              location[length].lat = element[3]*1.0;
              location[length].lng = element[2]*1.0;
              location[length].time = element[0];
              historicalLocation[length]=new Object();
              historicalLocation[length].lat=element[3]*1.0;
              historicalLocation[length].lng=element[2]*1.0;
              length++;
            });
            length--;
            console.log(historicalLocation);
            this.setState({accOnlineState : "" + (data[length][6] & 1) === "1" ? "开" : "关"});
            this.setState({carLoadState : "" + (data[length][6] & 768) === "768" ? "满载" : ("" + (data[length][6] & 768) === "0" ? "空载" : "半载")});
            this.setState({oilWayState : "" + (data[length][6] & 1024) === "1024" ? "正常" : "断开"});
            this.setState({elecWayState: "" + (data[length][6] & 2048) === "2048" ? "正常" : "断开"});
            this.setState({carDoorState : "" + (data[length][6] & 4096) === "4096" ? "加锁" : "解锁"});
          }
        }
        else if (res.status === 401){
          message.error("Unauthorized, 获取时序数据失败");
          return;
        }
        else if (res.status === 403){
          message.error("Forbidden, 获取时序数据失败"); 
        }
        else {
          message.error("Not Found, 获取时序数据失败");
        }
      }
    })
  }

  handleTurnBack = () => {
    this.setState({carData: false});
  }

  showABSstatus = () => {
    this.setState({showABS: true});
  }

  render() {
    const contentList_allCar = {
      tab1:
      <div>
        <Card 
          style={{ 
          width: "100%", 
          height: "370px", 
          textAlign: "center", 
        }}>
          {/* <Map 
            enableScrollWheelZoom={true}
            center={{lng: allCarLocation[0].lng, lat: allCarLocation[0].lat}} 
            zoom="6"
          >
            <MarkerList
              data={allCarLocation}
              fillStyle="#ff3333" 
              animation={true} 
              isShowShadow={true} 
              multiple={true} 
              autoViewport={true}
            />
            <NavigationControl /> 
          </Map> */}
        </Card>
      </div>
    }

    //表头
    const tabList = [{
      key: "tab1",
      tab: (
        <Tooltip title="显示汽车历史GPS定位">
          汽车定位
        </Tooltip>
      )
    },{
      key: "tab2",
      tab: (
        <Tooltip title="显示汽车历史时速">
          汽车时速
        </Tooltip>
      )
    },{
      key: "tab3",
      tab: (
        <Tooltip title="EBS11">
          EBS11
        </Tooltip>
      )
    }];

    //单个汽车时序信息
    const contentList_oneCar = {
      tab1:
      <div>
        <Card>
          <Card.Grid style={{ 
            width: "75%", 
            height: "370px", 
            textAlign: "center", 
            padding: "10px" 
          }}>
            <Map
              enableScrollWheelZoom={true}
              center={{lng: (historicalLocation[length].lng + historicalLocation[0].lng)/2, lat: (historicalLocation[length].lat + historicalLocation[0].lat)/2}} 
              zoom="6"
            >
              <Marker 
                icon={"start"}
                position={{lng: historicalLocation[0].lng, lat: historicalLocation[0].lat}}
              />
              <Marker 
                icon={"end"}
                position={{lng: historicalLocation[length].lng, lat: historicalLocation[length].lat}}
              />
              <NavigationControl /> 
              <Polyline
                strokeColor="blue"
                path={historicalLocation}
              />
            </Map>
          </Card.Grid>
          <Card.Grid
            style={{ 
              width: "25%", 
              height: "370px", 
              textAlign: "center", 
              padding: "20px",
              
            }}>
            <List
              style={{marginTop: "4%"}}
              bordered
              header={
                <div style={{ fontSize: "18px", fontWeight: "bold", height: "20%", textAlign: "left"}}>
                  最后一次上报时汽车位置信息：
                </div>
              }
              dataSource={[
                "时间："+ new Date(location[length].time).getFullYear()+"-"+add((new Date(location[length].time).getMonth()+1))+"-"+add(new Date(location[length].time).getDate())+" "+add(new Date(location[length].time).getHours())+":"+add(new Date(location[length].time).getMinutes())+":"+add(new Date(location[length].time).getSeconds()),
                "经度："+location[length].lng+'°',
                "纬度："+location[length].lat+'°',
                "高程："+location[length].height+'米',
                "方向："+location[length].direction
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            >
            </List>
          </Card.Grid>
        </Card>
      </div>,
      tab2: 
      <div>
        <Chart
          padding={[10, 20, 50, 50]}
          autoFit
          height={370}
          data={objSpeed}
          scale={cols}
          placeholder
        >
          <Line position="time*speed" tooltip={["time*speed", (t, s) => {
            return {
              title: `${t}`,
              name: "speed",
              value: s
            }
          }]} />
          <Point position="time*speed" />
          <Tooltip showCrosshairs lock triggerOn="click" />
          <Axis name="speed" title={{
            position: "center",
            style: {
              fontSize: "12"
            }
          }} />
          <Axis name="time" title={{
            position: "center",
            style: {
              fontSize: "12"
            }
          }} />
          <Geom 
            type="line" 
            position="time*speed" 
            size={2} 
            shape={"smooth"} 
            color={"#0099ff"}
            animate={false}
           />
          <Geom 
            type="area"
            position="time*speed"
            shape={"smooth"}
            color={"#0099ff"}
            animate={false}
          />
        </Chart>
      </div>,
      tab3:
      <div>
        <Card>
          <Card.Grid style={{ 
            width: "25%", 
            height: "600px", 
            textAlign: "center", 
            padding: "10px" 
          }}>
            <List
              style={{marginTop: "4%"}}
              bordered
              dataSource={[
                <Button onClick={this.showABSstatus}>ABSstatus：{new Date(location[length].time).getFullYear()}</Button>,
                "retarderControlStatus："+location[length].lng+'°',
                "ASRBrakeCcontrolStatus："+location[length].lat+'°',
                "ASREngineControlStatu："+location[length].height+'米',
                "brakeLightSwitch："+location[length].direction,
                "vehicleType",
                "VDCActive",
                "serviceBrakeDemandPressure",
                "parkBrakeDemandRelativePressure",
                "retarderDemandRelativePressure",
                "relativeBrakeDemandFrontLeftSide",
                "relativeBrakeDemandRearRightSide"
              ]}
              renderItem={item => <List.Item>{item}</List.Item>}
            >
            </List>
          </Card.Grid>
          <Card.Grid
            style={{ 
              width: "75%", 
              height: "600px", 
              textAlign: "center", 
              padding: "20px",
              
            }}>
            <Chart
              style={{display: this.state.showABS === true ? "block" : "none" }}
              padding={[10, 20, 50, 50]}
              autoFit
              height={370}
              data={ABSstatus}
              scale={cols}
              placeholder
            >
              <Line position="time*ABSstatus" tooltip={["time*ABSstatus", (t, s) => {
                return {
                  title: `${t}`,
                  name: "ABSstatus",
                  value: s
                }
              }]} />
              <Point position="time*ABSstatus" />
              <Tooltip showCrosshairs lock triggerOn="click" />
              <Axis name="ABSstatus" title={{
                position: "center",
                style: {
                  fontSize: "12"
                }
              }} />
              <Axis name="time" title={{
                position: "center",
                style: {
                  fontSize: "12"
                }
              }} />
              <Geom 
                type="line" 
                position="time*ABSstatus" 
                size={2} 
                shape={"smooth"} 
                color={"#0099ff"}
                animate={false}
              />
              <Geom 
                type="area"
                position="time*ABSstatus"
                shape={"smooth"}
                color={"#0099ff"}
                animate={false}
              />
            </Chart>
          </Card.Grid>
        </Card>
      </div>
    }
    return (
      <Layout style={{ minHeight: "100vh" }}>
        {/* <Layout style={{display: this.state.carData === false ? "block" : "none" }}>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <div style={{ height: "340px" }}>
              <Card title="汽车时序数据查询" id="nodeManage" style={{height: "20px", width: "100%"}} extra={
                <div> 
                  <Button type="primary" onClick={this.inputDeviceModal}>点击查询汽车信息</Button>
                </div>
              }>
                <div>
                  <List
                    grid={{ gutter: 16, column: 4 }}
                    dataSource={allCarData.slice(this.state.minValue, this.state.maxValue)}
                    renderItem={item => (
                      <List.Item onClick={() => this.handleChooseCar(item.gid)}>
                        <Card 
                          size="small"
                          style={cardStyle}
                          title={item.gid}
                          hoverable={true}
                          headStyle={{textAlign: "center"}}
                        >
                          <p>司机Gid: {item.driverGid}</p>
                          <p>解锁开始时间: {item.lockStartTime}</p>
                          <p>解锁结束时间: {item.lockEndTime}</p>
                          <p>上锁状态: {item.lockStatus === 0 ? "解锁" : "加锁"}</p>
                        </Card>
                      </List.Item>
                    )}
                  />
                  <Pagination
                    style={{textAlign: "right"}}
                    current={this.state.current}
                    defaultPageSize={4}
                    showQuickJumper
                    total={carAmount} 
                    showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
                    onChange={this.handleChange}
                  />
                </div>
              </Card>
            </div>
            <div>
              <Card style={{ width: "100%" }} >
                {contentList_allCar.tab1} 
              </Card>
            </div>
          </Content>
        </Layout> */}
        <Layout style={{display: this.state.carData === true ? "block" : "none"}}>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <div style={{ height: "300px" }}>
              <Card title="汽车时序数据查询" id="nodeManage" style={{height: "20px", width: "100%"}} extra={
                <div>
                  当前terminalId: {carQueryParam.tags.terminalId} 
                  &nbsp;
                  <Button type="primary" onClick={this.inputDeviceModal}>点击查询汽车信息</Button>
                  &nbsp;
                  <Button type="primary" onClick={this.handleTurnBack}>返回</Button>
                </div>}>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#FFC125", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <MenuOutlined style={{ display: this.state.accOnlineState === "开" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <KeyOutlined style={{ display: this.state.accOnlineState === "关" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> ACC开关状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.accOnlineState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#912CEE", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <SearchOutlined style={{ display: this.state.carLoadState === "空载" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <MonitorOutlined style={{ display: this.state.carLoadState === "半载" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <FireOutlined style={{ display: this.state.carLoadState === "满载" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车载量状态</div>
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.carLoadState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#4169E1", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <LinkOutlined style={{ display: this.state.oilWayState === "正常" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <DisconnectOutlined style={{ display: this.state.oilWayState === "断开" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车油路状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.oilWayState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#D02090", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <CheckOutlined style={{ display: this.state.elecWayState === "正常" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <CloseOutlined style={{ display: this.state.elecWayState === "断开" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 汽车电路状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.elecWayState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
              <Card.Grid style={gridStyle}>
              <div style={{ display: "flex", alignItems: "center", paddingTop: "5%", justifyContent: "center", height: "100%", width: "100%" }}> 
                <div style={{ position: "relative", border: "1px solid #e8e8e8", height: "100%", width: "100%", borderRadius: "4px", }}> 
                  <div style={{ position: "absolute", top: "-20px", marginLeft: "30%", height: "100px", width: "100px", backgroundColor: "#ed7010", borderRadius: "4px", boxShadow: "0 0 10px grey", display: "flex", alignItems: "center", justifyContent: "center", }}> 
                    <PoweroffOutlined style={{ display: this.state.carDoorState === "加锁" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                    <ExclamationOutlined style={{ display: this.state.carDoorState === "解锁" ? "block" : "none", color: "white", fontSize: "60px" }}/>
                  </div> 
                  <div style={{ textAlign: "center" }}> 
                    <div style={{ fontSize: "14px", marginTop: "100px" }}> 车门状态</div> 
                    <div style={{ fontSize: "30px", fontWeight: "bold" }}>{this.state.carDoorState}</div> 
                  </div>
                </div> 
              </div>
              </Card.Grid>
            </Card>
            </div>
            <div>
              <Card
                style={{ width: "100%" }} 
                tabList={tabList} 
                activeTabKey={this.state.key} 
                onTabChange={(key) => { 
                  this.onTabChange(key, "key"); 
                }}> 
                {contentList_oneCar[this.state.key]} 
              </Card>
            </div>
            <div id="inputDevice">
              <Modal title="查询汽车信息"
                visible={this.state.inputDeviceModalVisible}
                onOk={this.inputDeviceModalHandleOk}
                onCancel={this.inputDeviceModalHandleCancel}
                cancelText="取消"
                okText="确定"
              >
                <InputGroup compact>
                <Input 
                  style={{ width: "20%" }}
                  defaultValue="terminalId"
                  disabled={true}
                  className="inputTitle"/>
                <Input 
                  style={{ width: "80%" }}
                  placeholder="请输入汽车terminalId"
                  value={this.state.inputDeviceTerminalId}
                  onChange={(e)=> {
                    this.setState({inputDeviceTerminalId: e.target.value});
                  }}
                  />
                </InputGroup>
                <InputGroup compact>
                  <Input
                    style={{ width: "20%" }}
                    defaultValue="开始时间"
                    disabled={true}
                    className="inputTitle" />
                  <DatePicker showTime
                    style={{ width: "80%" }}
                    placeholder="请输入查询开始时间"
                    key={this.state.keyValue}
                    onChange={(e)=>{
                      if (e){
                        this.setState({inputDeviceSt: e._d});
                      }
                      else {
                        this.setState({inputDeviceSt: null});
                      }
                    }}
                    />
                </InputGroup>
                <InputGroup compact>
                  <Input
                    style={{ width: "20%" }}
                    defaultValue="结束时间"
                    disabled={true}
                    className="inputTitle"/>
                  <DatePicker showTime
                    style={{ width: "80%" }}
                    placeholder="请输入查询结束时间"
                    key={this.state.keyValue}
                    onChange={(e)=>{
                      if (e){
                        this.setState({inputDeviceEt: e._d});
                      }
                      else {
                        this.setState({inputDeviceEt: null});
                      }
                    }}
                  />  
                </InputGroup>
              </Modal>
            </div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

export default App;
