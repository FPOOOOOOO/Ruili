import React from "react";
import {
  Table,
  Layout,
  Row,
  Col,
  Card,
  Button,
  Input,
  Modal,
  message,
} from "antd";

import {
  queryDriver,
  addDriver,
  updateDriver,
  deleteDriver
} from "../../axios";
import "./driver.css";

var obj = {};

const { Content } = Layout;
const InputGroup = Input.Group;

// const response = [
//   {
//     no : "01",
//     name : "zhangsan",
//     telArea : "86",
//     tel : "12345678",
//     realName : "张三",
//     email : "01234567890@qq.com",
//     authority : "驾驶员",
//     icCode : "000000",
//     password : "111111",
//     position : "驾驶员",
//     staffGid : 222222
// },
//   {
//     no : "02",
//     name : "lisi",
//     telArea : "86",
//     tel : "12345678",
//     realName : "李四",
//     email : "01234567890@qq.com",
//     authority : "驾驶员",
//     icCode : "000000",
//     password : "111111",
//     position : "驾驶员",
//     staffGid : 222222
//   }
// ]

const zdd=[{
  no: "01",
  name: "zhangsan",
  telArea: "86",
  tel: "12345678",
  realName: "张三",
  email: "01234567890@qq.com",
  authority: "驾驶员",
  icCode: "000000",
  password: "111111",
  position: "驾驶员",
  staffGid: 222222
}]

class App extends React.Component {
  state = {
    nodeInfoTableColumns: [
      {
        title: "编号",
        dataIndex: "no",
        key: "no",
      },
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        editable: true
      },
      {
        title: "区号",
        dataIndex: "telArea",
        key: "telArea",
        editable: true
      },
      {
        title: "电话",
        dataIndex: "tel",
        key: "tel",
        editable: true
      },
      {
        title: "真实姓名",
        dataIndex: "realName",
        key: "realName",
        editable: true
      },
      {
        title: "邮箱",
        dataIndex: "email",
        key: "email",
        editable: true
      },
      {
        title: "权限",
        dataIndex: "authority",
        key: "authority",
        editable: true
      },
      {
        title: "icCode",
        dataIndex: "icCode",
        key: "icCode",
        editable: true
      },
      {
        title: "密码",
        dataIndex: "password",
        key: "password",
        editable: true
      },
      {
        title: "职位",
        dataIndex: "position",
        key: "position",
        editable: true
      },
      {
        title: "员工Gid",
        dataIndex: "staffGid",
        key: "staffGid",
        editable: true
      },
      {
        title: "",
        dataIndex: "Edit",
        key: "Edit",
        render: (text, record, index) =>
          <Button onClick={() => {
            obj = record;
            // 更新驾驶员窗口可见
            this.setState({ updateDriverModalVisible: true });
            this.setState({ //数据初始化
              updateDriverNo: obj.no,
              updateDriverName: obj.name,
              updateDriverTelArea: obj.telArea,
              updateDriverTel: obj.tel,
              updateDriverRealName: obj.realName,
              updateDriverEmail: obj.email,
              updateDriverIcCode: obj.icCode,
              updateDriverPassword: obj.password,
              updateDriverPosition: obj.position,
              updateDriverStaffGid: obj.staffGid
            })
          }}>编辑</Button>
      }
    ],
    collapsed: false,
    driverIdSelected: [],
    driverInfoTableDataSource: [],
    deleteDriverDisabled: true,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    // 获取驾驶员数据
    queryDriver().then(res => {
      if (res === undefined) {
        message.error("The returned data was not retrieved!");
      }
      else {
        if (res.status === 200 || res.status === 201) {
          let driverInfoTableDataSource = [];
          res.data.data.forEach(element => {
            // response.forEach(element => {
            let obj = {};
            obj.no = element.no;
            obj.name = element.name;
            obj.telArea = element.telArea;
            obj.tel = element.tel;
            obj.realName = element.realName;
            obj.email = element.email;
            obj.authority = element.authority;
            obj.icCode = element.icCode;
            obj.password = element.password;
            obj.position = element.position;
            obj.staffGid = element.staffGid;
            driverInfoTableDataSource.push(obj);
          });
          this.setState({ driverInfoTableDataSource: driverInfoTableDataSource });
        }
        else if (res.status === 401) {
          message.error("Unauthorized, 获取驾驶员数据失败");
          return;
        }
        else if (res.status === 403) {
          message.error("Forbidden, 获取驾驶员数据失败");
        }
        else {
          message.error("Not Found, 获取驾驶员数据失败");
        }
      }
    });
  }

  // 添加驾驶员窗口可见
  addDriverModal = () => {
    this.setState({ addDriverModalVisible: true });
  };

  // 添加新驾驶员信息
  addDriverModalHandleOk = () => {
    this.state.addDriverAuthority = "driver"; // 默认权限为驾驶员
    if (
      !this.state.addDriverNo ||
      !this.state.addDriverName ||
      !this.state.addDriverTelArea ||
      !this.state.addDriverTel ||
      !this.state.addDriverRealName ||
      !this.state.addDriverEmail ||
      !this.state.addDriverIcCode ||
      !this.state.addDriverPassword ||
      !this.state.addDriverPosition ||
      !this.state.addDriverStaffGid
    ) {
      message.error("请输入完整信息！");
    } else {
      addDriver(
        [zdd
        ,{
        authority: this.state.addDriverAuthority,
        email: this.state.addDriverEmail,
        icCode: this.state.addDriverIcCode,
        name: this.state.addDriverName,
        no: this.state.addDriverNo,
        passwprd: this.state.addDriverPassword,
        position: this.state.addDriverPosition,
        realName: this.state.addDriverRealName,
        staffGid: parseInt(this.state.addDriverStaffGid),
        tel: this.state.addDriverTel,
        telArea: this.state.addDriverTelArea
      }]).then(res => {
        if (res === undefined) {
          message.error("The returned data was not retrieved!");
          return;
        }
        else {
          if (res.status === 201 || res.status === 200) {
            message.success("添加成功！");
            queryDriver().then(res => {
              if (res === undefined) {
                message.error("The returned data was not retrieved!");
              }
              else {
                if (res.status === 201 || res.status === 200) {
                  let driverInfoTableDataSource = [];
                  res.data.data.forEach(element => {
                    let obj = {};
                    obj.no = element.no;
                    obj.name = element.name;
                    obj.telArea = element.telArea;
                    obj.tel = element.tel;
                    obj.realName = element.realName;
                    obj.email = element.email;
                    obj.authority = element.authority;
                    obj.icCode = element.icCode;
                    obj.password = element.password;
                    obj.position = element.position;
                    obj.staffGid = element.staffGid;
                    driverInfoTableDataSource.push(obj);
                  });
                  this.setState({ driverInfoTableDataSource: driverInfoTableDataSource });
                }
                else if (res.status === 401) {
                  message.error("Unauthorized, 获取驾驶员数据失败");
                }
                else if (res.status === 403) {
                  message.error("Forbidden, 获取驾驶员数据失败");
                }
                else {
                  message.error("Not Found, 获取驾驶员数据失败");
                }
              }
            });
          } else if (res.status === 401) {
            message.error("Unauthorized, 添加失败");
            return;
          }
          else if (res.status === 403) {
            message.error("Forbidden, 添加失败");
            return;
          }
          else {
            message.error("Not Found, 添加失败");
            return;
          }
        }

        this.setState({ addDriverModalVisible: false });
        this.setState({
          addDriverNo: null,
          addDriverName: null,
          addDriverTelArea: null,
          addDriverTel: null,
          addDriverRealName: null,
          addDriverEmail: null,
          addDriverAuthority: null,
          addDriverIcCode: null,
          addDriverPassword: null,
          addDriverPosition: null,
          addDriverStaffGid: null
        });
      });
    }
  };

  // 取消增加司机，变量清零
  addDriverModalHandleCancel = () => {
    this.setState({ addDriverModalVisible: false });
    this.setState({
      addDriverNo: null,
      addDriverName: null,
      addDriverTelArea: null,
      addDriverTel: null,
      addDriverRealName: null,
      addDriverEmail: null,
      addDriverAuthority: null,
      addDriverIcCode: null,
      addDriverPassword: null,
      addDriverPosition: null,
      addDriverStaffGid: null
    });
  };

  // 更新司机信息
  updateDriverModalHandleOk = () => {
    this.state.updateDriverAuthority = "driver"; //默认权限为驾驶员
    this.state.updateDriverStaffGid = parseInt(obj.staffGid); //员工Gid不可更改
    if (
      !this.state.updateDriverNo ||
      !this.state.updateDriverName ||
      !this.state.updateDriverTelArea ||
      !this.state.updateDriverTel ||
      !this.state.updateDriverRealName ||
      !this.state.updateDriverEmail ||
      !this.state.updateDriverIcCode ||
      !this.state.updateDriverPassword ||
      !this.state.updateDriverPosition
    ) {
      message.error("请输入完整信息！");
    } else {
      updateDriver({
        authority: this.state.updateDriverAuthority,
        email: this.state.updateDriverEmail,
        icCode: this.state.updateDriverIcCode,
        name: this.state.updateDriverName,
        no: this.state.updateDriverNo,
        passwprd: this.state.updateDriverPassword,
        position: this.state.updateDriverPosition,
        realName: this.state.updateDriverRealName,
        staffGid: this.state.updateDriverStaffGid,
        tel: this.state.updateDriverTel,
        telArea: this.state.updateDriverTelArea
      }).then(res => {
        if (res === undefined) {
          message.error("The returned data was not retrieved!");
          return;
        }
        else {
          if (res.status === 201 || res.status === 200) {
            message.success("更新成功！");
            queryDriver().then(res => {
              if (res === undefined) {
                message.error("The returned data was not retrieved!");
              }
              else {
                if (res.status === 201 || res.status === 200) {
                  let driverInfoTableDataSource = [];
                  res.data.data.forEach(element => {
                    let obj = {};
                    obj.no = element.no;
                    obj.name = element.name;
                    obj.telArea = element.telArea;
                    obj.tel = element.tel;
                    obj.realName = element.realName;
                    obj.email = element.email;
                    obj.authority = element.authority;
                    obj.icCode = element.icCode;
                    obj.password = element.password;
                    obj.position = element.position;
                    obj.staffGid = element.staffGid;
                    driverInfoTableDataSource.push(obj);
                  });
                  this.setState({ driverInfoTableDataSource: driverInfoTableDataSource });
                }
                else if (res.status === 401) {
                  message.error("Unauthorized, 获取驾驶员数据失败");
                }
                else if (res.status === 403) {
                  message.error("Forbidden, 获取驾驶员数据失败");
                }
                else {
                  message.error("Not Found, 获取驾驶员数据失败");
                }
              }
            });
          }
          else if (res.status === 401) {
            message.error("Unauthorized, 更新失败");
            return;
          }
          else if (res.status === 403) {
            message.error("Forbidden, 更新失败");
            return;
          }
          else {
            message.error("Not Found, 更新失败");
            return;
          }
        }

        this.setState({ updateDriverModalVisible: false });
        this.setState({
          updateDriverNo: obj.no,
          updateDriverName: obj.name,
          updateDriverTelArea: obj.telArea,
          updateDriverTel: obj.tel,
          updateDriverRealName: obj.realName,
          updateDriverEmail: obj.email,
          updateDriverIcCode: obj.icCode,
          updateDriverPassword: obj.password,
          updateDriverPosition: obj.position,
          updateDriverStaffGid: obj.staffGid
        });
      });
    }
  }

  //取消司机信息更新
  updateDriverModalHandleCancel = () => {
    this.setState({ updateDriverModalVisible: false });
    this.setState({
      updateDriverNo: obj.no,
      updateDriverName: obj.name,
      updateDriverTelArea: obj.telArea,
      updateDriverTel: obj.tel,
      updateDriverRealName: obj.realName,
      updateDriverEmail: obj.email,
      updateDriverIcCode: obj.icCode,
      updateDriverPassword: obj.password,
      updateDriverPosition: obj.position,
      updateDriverStaffGid: obj.staffGid
    });
  }

  //删除司机窗口可见
  deleteNodeModel = () => {
    this.setState({ deleteNodeModalVisible: true });
  };

  // 删除司机函数
  deleteNodeModalHandleOk = () => {
    if (this.state.driverIdSelected.length !== 1) {
      message.error('不可批量删除用户，请选择一位用户');
      return;
    }
    deleteDriver([this.state.driverIdSelected[0]]).then(res => {
      if (res === undefined) {
        message.error("The returned data was not retrieved!");
        return;
      }
      else {
        if (res.status === 200 || res.status === 201) {
          message.success("删除成功！");
          queryDriver().then(res => {
            if (res === undefined) {
              message.error("The returned data was not retrieved!");
            }
            else {
              if (res.status === 200 || res.status === 201) {
                let driverInfoTableDataSource = [];
                res.data.data.forEach(element => {
                  let obj = {};
                  obj.no = element.no;
                  obj.name = element.name;
                  obj.telArea = element.telArea;
                  obj.tel = element.tel;
                  obj.realName = element.realName;
                  obj.email = element.email;
                  obj.authority = element.authority;
                  obj.icCode = element.icCode;
                  obj.password = element.password;
                  obj.position = element.position;
                  obj.staffGid = element.staffGid;
                  driverInfoTableDataSource.push(obj);
                });
                this.setState({ driverInfoTableDataSource: driverInfoTableDataSource });
              }
              else if (res.status === 401) {
                message.error("Unauthorized, 获取驾驶员数据失败");
              }
              else if (res.status === 403) {
                message.error("Forbidden, 获取驾驶员数据失败");
              }
              else {
                message.error("Not Found, 获取驾驶员数据失败");
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
        this.setState({ deleteDriverDisabled: true })
      } else {
        this.setState({ deleteDriverDisabled: false })
      }
      let re = [];
      selectedRows.forEach(ele => {
        re.push(ele.gid)
      })
      this.setState({ driverIdSelected: re });
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="司机信息管理" id="nodeManage">
              <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                      <div>
                        <Button type="primary" onClick={this.addDriverModal}>
                          添加
                        </Button>
                        <Button
                          disabled={this.state.deleteDriverDisabled}
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
                          <p>确定删除选中驾驶员吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.driverInfoTableDataSource}
                  columns={this.state.nodeInfoTableColumns}
                />
              </div>
              <div id="addDriver">
                <Modal
                  title="添加驾驶员"
                  visible={this.state.addDriverModalVisible}
                  onOk={this.addDriverModalHandleOk}
                  onCancel={this.addDriverModalHandleCancel}
                  cancelText="取消"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="编号"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入编号"
                      value={this.state.addDriverNo}
                      onChange={e => {
                        this.setState({ addDriverNo: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="姓名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入姓名"
                      value={this.state.addDriverName}
                      onChange={e => {
                        this.setState({ addDriverName: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="区号"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入区号"
                      value={this.state.addDriverTelArea}
                      onChange={e => {
                        this.setState({ addDriverTelArea: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="电话"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入电话"
                      value={this.state.addDriverTel}
                      onChange={e => {
                        this.setState({ addDriverTel: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="真实姓名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入真实姓名"
                      value={this.state.addDriverRealName}
                      onChange={e => {
                        this.setState({ addDriverRealName: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="邮箱"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入邮箱"
                      value={this.state.addDriverEmail}
                      onChange={e => {
                        this.setState({ addDriverEmail: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="权限"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      defaultValue="驾驶员"
                      disabled={true}
                      className="inputTitle"

                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="icCode"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入icCode"
                      value={this.state.addDriverIcCode}
                      onChange={e => {
                        this.setState({ addDriverIcCode: e.target.value });
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
                      value={this.state.addDriverPassword}
                      onChange={e => {
                        this.setState({ addDriverPassword: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="职位"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入职位"
                      value={this.state.addDriverPosition}
                      onChange={e => {
                        this.setState({ addDriverPosition: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="员工Gid"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      placeholder="请输入员工Gid"
                      value={this.state.addDriverStaffGid}
                      onChange={e => {
                        this.setState({ addDriverStaffGid: e.target.value });
                      }}
                    />
                  </InputGroup>
                </Modal>
              </div>
              <div id="updateDriver">
                <Modal
                  title="更新驾驶员"
                  visible={this.state.updateDriverModalVisible}
                  onOk={this.updateDriverModalHandleOk}
                  onCancel={this.updateDriverModalHandleCancel}
                  cancelText="取消"
                  okText="确定"
                >
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="编号"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverNo}
                      onChange={e => {
                        this.setState({ updateDriverNo: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="姓名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverName}
                      onChange={e => {
                        this.setState({ updateDriverName: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="区号"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverTelArea}
                      onChange={e => {
                        this.setState({ updateDriverTelArea: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="电话"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverTel}
                      onChange={e => {
                        this.setState({ updateDriverTel: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="真实姓名"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverRealName}
                      onChange={e => {
                        this.setState({ updateDriverRealName: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="邮箱"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverEmail}
                      onChange={e => {
                        this.setState({ updateDriverEmail: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="权限"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      defaultValue="驾驶员"
                      disabled={true}
                      className="inputTitle"
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="icCode"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverIcCode}
                      onChange={e => {
                        this.setState({ updateDriverIcCode: e.target.value });
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
                      value={this.state.updateDriverPassword}
                      onChange={e => {
                        this.setState({ updateDriverPassword: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="职位"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      value={this.state.updateDriverPosition}
                      onChange={e => {
                        this.setState({ updateDriverPosition: e.target.value });
                      }}
                    />
                  </InputGroup>
                  <InputGroup compact>
                    <Input
                      style={{ width: "20%" }}
                      defaultValue="员工Gid"
                      disabled={true}
                      className="inputTitle"
                    />
                    <Input
                      style={{ width: "80%" }}
                      defaultValue={this.state.updateDriverStaffGid}
                      disabled={true}
                      className="inputTitle"
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
