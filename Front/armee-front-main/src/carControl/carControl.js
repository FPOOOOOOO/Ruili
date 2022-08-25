import React from "react";
import {
  DatePicker,
  Table,
  Button,
  Layout,
  Card,
  Input,
  message
} from "antd";

import {
  addLockInfo,
  queryDevice,
  lockIm
} from "../axios";
import "./carControl.css";

const { Content } = Layout;
const { RangePicker } = DatePicker;

var st = "";
var et = "";
var obj = {}; // 保存后端数据

function add(n) {
  return n < 10 ? '0' + n : n;
}

function addmilli(n) {
  if (n < 10) {
    return '00' + n;
  }
  else if (n < 100) {
    return '0' + n;
  }
  else return n;
}

function utc2beijing(utc_datetime) {
  // 转为正常的时间格式 年-月-日 时:分:秒
  // let T_pos = utc_datetime.indexOf('T');
  // let Z_pos = utc_datetime.indexOf('Z');
  // let year_month_day = utc_datetime.substr(0,T_pos);
  // let hour_minute_second = utc_datetime.substr(T_pos+1,Z_pos-T_pos-1);
  // let new_datetime = year_month_day+" "+hour_minute_second; // 2017-03-31 08:02:06

  // 处理成为时间戳
  var timestamp = new Date(Date.parse(utc_datetime));
  timestamp = timestamp.getTime();
  timestamp = timestamp / 1000;

  // 增加8个小时，北京时间比utc时间多八个时区
  var timesBJ = timestamp + 8 * 60 * 60;

  // 时间戳转为时间
  let now = new Date(parseInt(timesBJ) * 1000),
    y = now.getFullYear(),
    m = now.getMonth() + 1,
    d = now.getDate();
  return y + "-" + (m < 10 ? "0" + m : m) + "-" + (d < 10 ? "0" + d : d) + " " + now.toTimeString().substr(0, 8);
  //let beijing_datetime = new Date(parseInt(timestamp) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");

  //return beijing_datetime; // 2017-03-31 16:02:06
}

// var response = [
//   {
//     gid: "00001",
//   },
//   {
//     gid: "00002",
//   }
// ]

const nodeInfoTableColumns = [
  {
    title: "汽车ID",
    dataIndex: "deviceId",
    key: "deviceId"
  },
  {
    title: "司机ID",
    dataIndex: "driverId",
    key: "driverId",
    render: () => (
      <Input onChange={(e) => {
        obj.driverId = e.target.value;
      }} />
    )
  },
  {
    title: "解锁时间",
    dataIndex: "time",
    key: "time",
    render: () => (
      <RangePicker showTime
        placeholder={["开始时间", "结束时间"]}
        onChange={(e) => {
          if (e) {
            st = e[0]._d;
            et = e[1]._d;
          }
          else {
            st = null;
            et = null;
          }
          //console.log(st);
        }} />
    ),
  },
  {
    title: "",
    dataIndex: "upload",
    key: "upload",
    render: (text, record, index) => (
      <Button onClick={function () {
        if (!st || !obj.driverId) {
          message.error("请输入完整信息");
        }
        else {
          //obj.st = st.getUTCFullYear()+"-"+add((st.getUTCMonth()+1))+"-"+add(st.getUTCDate())+"T"+add(st.getUTCHours())+":"+add(st.getUTCMinutes())+":"+add(st.getUTCSeconds())+"."+addmilli(st.getUTCMilliseconds())+"+00:00";
          //obj.et = et.getUTCFullYear()+"-"+add((et.getUTCMonth()+1))+"-"+add(et.getUTCDate())+"T"+add(et.getUTCHours())+":"+add(et.getUTCMinutes())+":"+add(et.getUTCSeconds())+"."+addmilli(et.getUTCMilliseconds())+"+00:00";
          var UTCst = st.getUTCFullYear() + "-" + add((st.getUTCMonth() + 1)) + "-" + add(st.getUTCDate()) + " " + add(st.getUTCHours()) + ":" + add(st.getUTCMinutes()) + ":" + add(st.getUTCSeconds());
          var UTCet = et.getUTCFullYear() + "-" + add((et.getUTCMonth() + 1)) + "-" + add(et.getUTCDate()) + " " + add(et.getUTCHours()) + ":" + add(et.getUTCMinutes()) + ":" + add(et.getUTCSeconds());
          obj.st = utc2beijing(UTCst);
          obj.et = utc2beijing(UTCet);
          obj.deviceId = record.deviceId;
          obj.downed = 0;
          console.log(obj.st);
          addLockInfo([//added 0717 直接插入需要表关联，不然会报错 Cannot add or update a child row: a foreign key constraint fails
            obj.deviceId,
            obj.driverId,
            obj.et,
            obj.st,
            obj.downed
          ]).then(res => {
            if (res === undefined) {
              message.error("The returned data was not retrieved!");
            }
            else {
              switch (res.status) {
                case 401: message.error("Unauthorized, 指令下发失败"); break;
                case 403: message.error("Forbidden, 指令下发失败"); break;
                case 404: message.error("Not Found, 指令下发失败"); break;
                case 200: message.success("指令下发成功"); break;
                case 201: message.success("指令下发成功"); break;
              }
            }
          })
        }
      }}>确定</Button>
    ),
  },
  {
    title: "",
    dataIndex: "lockIm",
    key: "lockIm",
    render: (text, record, index) => (
      <Button onClick={function () {
        //console.log(record.deviceId);
        lockIm([
          record.deviceId
        ]).then(res => {
          if (res === undefined) {
            message.error("The returned data was not retrieved!");
          }
          else {
            switch (res.status) {
              case 401: message.error("Unauthorized, 指令下发失败"); break;
              case 403: message.error("Forbidden, 指令下发失败"); break;
              case 404: message.error("Not Found, 指令下发失败"); break;
              case 200: message.success("指令下发成功"); break;
              case 201: message.success("指令下发成功"); break;
            }
          }
        })
      }}>立即上锁</Button>
    ),
  }
];

class App extends React.Component {
  state = {
    collapsed: false,
    nodeInfoTableDataSource: [],
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    // 获得汽车列表数据并整型数组
    queryDevice().then(res => {
      console.log(res);
      if (res === undefined) {
        message.error("The returned data was not retrieved!");
      }
      else {
        if (res.status === 201 || res.status === 200) {
          let nodeInfoTableDataSource = [];
          // response.forEach(element => {
          res.data.data.forEach(element => {
            let obj = {};
            obj.deviceId = element.gid;
            nodeInfoTableDataSource.push(obj);
          });
          this.setState({ nodeInfoTableDataSource: nodeInfoTableDataSource });
        }
        else if (res.status === 401) {
          message.error("Unauthorized, 获取汽车列表失败");
          return;
        }
        else if (res.status === 403) {
          message.error("Forbidden, 获取汽车列表失败");
          return;
        }
        else if (res.status === 404) {
          message.error("Not Found, 获取汽车列表失败");
          return;
        }
      }
    });
  }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>

        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="汽车控制" id="nodeManage">
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.nodeInfoTableDataSource}
                  columns={nodeInfoTableColumns}
                />
              </div>
            </Card>
          </Content>

        </Layout>
      </Layout>
    );
  }
}

export default App;