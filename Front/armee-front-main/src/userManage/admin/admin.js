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
  Upload
} from "antd";
import * as XLSX from "xlsx";

import {
  queryAdmin,
  addAdmin,
  addAdmins,
  deleteAdmin,
  updateAdmin
} from "../../axios";
import "./admin.css";

var obj={};

const { Content } = Layout;
const InputGroup = Input.Group;

const Uploader = () => {
  const props = {
    beforeUpload: file => {
      console.log(file.type);
      if (file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" && file.type !== "application/vnd.ms-excel" ){
        message.error(`${file.name} is not an excel file`);
        return;
      }
      else {
        let data = [];// 存储获取到的数据
        let admins=[]; // 用于批量添加保存管理员数据
        let i = 0;
        let flag = 0;
        const fileReader = new FileReader();
        fileReader.readAsBinaryString(file);  //二进制
        fileReader.onload = event => {
          const {result } = event.target;
          const workbook = XLSX.read(result, {type:'binary' });
          for (const sheet in workbook.Sheets) {
            if (workbook.Sheets.hasOwnProperty(sheet)) {
              data =data.concat(XLSX.utils.sheet_to_json(workbook.Sheets[sheet]));
            }
          }
          console.log(data);
          while (data[i]){
            if (!data[i].编号 ||
                !data[i].姓名 ||
                !data[i].区号 ||
                !data[i].电话 ||
                !data[i].邮箱 ||
                !data[i].真实姓名 ||
                !data[i].iccode ||
                !data[i].密码 ||
                !data[i].职位 ||
                !data[i].员工gid
              ){
                message.error("文件不合法，请检查文件内容！");
                flag = 1; // 不上传
                break;
              }
            else {
              admins[i] = new Object();
              admins[i].authority = "admin";
              admins[i].email = data[i].邮箱;
              admins[i].icCode = data[i].iccode;
              admins[i].name = data[i].姓名;
              admins[i].no = data[i].编号;
              admins[i].password = data[i].密码;
              admins[i].position = data[i].职位;
              admins[i].realName = data[i].真实姓名;
              admins[i].staffGid = parseInt(data[i].员工gid);
              admins[i].tel = data[i].电话;
              admins[i].telArea = data[i].区号;
              i++;
            }
          }
          if (flag === 0 ){
            console.log(admins);
            addAdmins(admins).then(res => {
              if (res === undefined){
                message.error("The returned data was not retrieved!");
                return;
              }
              else{
                if (res.status === 201 || res.status === 200) {
                  message.success("添加成功！");
                  queryAdmin().then(res => {
                    if (res === undefined){
                      message.error("The returned data was not retrieved!");
                      return;
                    }
                    else{
                      if (res.status === 201 || res.status === 200) {
                        let adminInfoTableDataSource = [];
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
                          adminInfoTableDataSource.push(obj);
                        });
                        this.setState({ adminInfoTableDataSource: adminInfoTableDataSource });
                      } 
                      else if (res.status === 401){
                        message.error("Unauthorized, 获取管理员数据失败");
                        return;
                      }
                      else if (res.status === 403){
                        message.error("Forbidden, 获取管理员数据失败");
                        return;
                      }
                      else {
                        message.error("Not Found, 获取管理员数据失败");
                        return;
                      }
                    }
                  });
                } 
                else if (res.status === 401){
                  message.error("Unauthorized, 批量添加失败");
                  return;
                }
                else if (res.status === 403){
                  message.error("Forbidden, 批量添加失败");
                  return;
                }
                else {
                  message.error("Not Found, 批量添加失败");
                  return;
                }
              }
            });
          }
        }
      };
    },
  };
  return (
    <Upload {...props} multiple action="" showUploadList={false}>
      <Button type="primary" style={{ marginLeft: 10 }}>
        批量添加
      </Button>
    </Upload>
  );
};

// const response = [
//   {
//     no : "01",
//     name : "zhangsan",
//     telArea : "86",
//     tel : "12345678",
//     realName : "张三",
//     email : "01234567890@qq.com",
//     authority : "管理员",
//     icCode : "000000",
//     password : "111111",
//     position : "管理员",
//     staffGid : 222222
// },
//   {
//     no : "02",
//     name : "lisi",
//     telArea : "86",
//     tel : "12345678",
//     realName : "李四",
//     email : "01234567890@qq.com",
//     authority : "管理员",
//     icCode : "000000",
//     password : "111111",
//     position : "管理员",
//     staffGid : 222222
//   }
// ]

class App extends React.Component {
  state = {
    nodeInfoTableColumns:[
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
        render: (text, record, index)=>
        <Button onClick={() => {
          obj = record;
           // 更新管理员窗口可见
          this.setState({ updateAdminModalVisible: true});
          this.setState({ //数据初始化
            updateAdminNo: obj.no,
            updateAdminName: obj.name,
            updateAdminTelArea: obj.telArea,
            updateAdminTel: obj.tel,
            updateAdminRealName: obj.realName,
            updateAdminEmail: obj.email,
            updateAdminIcCode: obj.icCode,
            updateAdminPassword: obj.password,
            updateAdminPosition: obj.position,
            updateAdminStaffGid: obj.staffGid
          })}}>编辑</Button>
        }
      
    ],
    collapsed: false,
    adminIdSelected: [],
    adminInfoTableDataSource: [],
    deleteAdminDisabled: true,
  };

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  componentWillMount() { }

  componentDidMount() {
    // 获取管理员数据
    queryAdmin().then(res => {
      if (res === undefined){
        message.error("The returned data was not retrieved!");
      }
      else {
        if (res.status === 200 || res.status === 201) {
          let adminInfoTableDataSource = [];
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
            adminInfoTableDataSource.push(obj);
          });
          this.setState({ adminInfoTableDataSource: adminInfoTableDataSource });
        } 
        else if (res.status === 401){
          message.error("Unauthorized, 获取管理员数据失败");
          return;
        }
        else if (res.status === 403){
          message.error("Forbidden, 获取管理员数据失败"); 
          return;
        }
        else {
          message.error("Not Found, 获取管理员数据失败");
          return;
        }
      }
     });
  }

  // 添加管理员窗口可见
  addAdminModal = () => {
    this.setState({ addAdminModalVisible: true });
  };

  // 添加新管理员信息
  addAdminModalHandleOk = () => {
    this.state.addAdminAuthority = "admin"; // 默认权限为管理员
    if (
      !this.state.addAdminNo  ||
      !this.state.addAdminName  ||
      !this.state.addAdminTelArea  ||
      !this.state.addAdminTel  ||
      !this.state.addAdminRealName  ||
      !this.state.addAdminEmail  ||
      !this.state.addAdminIcCode  ||
      !this.state.addAdminPassword  ||
      !this.state.addAdminPosition  ||
      !this.state.addAdminStaffGid 
    ) {
      message.error("请输入完整信息！");
    } else {
      addAdmin({
        authority: this.state.addAdminAuthority,
        email: this.state.addAdminEmail,
        icCode: this.state.addAdminIcCode,
        name: this.state.addAdminName,
        no: this.state.addAdminNo,
        passwprd: this.state.addAdminPassword,
        position: this.state.addAdminPosition,
        realName: this.state.addAdminRealName,
        staffGid: parseInt(this.state.addAdminStaffGid),
        tel: this.state.addAdminTel,
        telArea: this.state.addAdminTelArea
      }).then(res => {
        if (res === undefined){
          message.error("The returned data was not retrieved!");
          return;
        }
        else{
          if (res.status === 201 || res.status === 200) {
            message.success("添加成功！");
            queryAdmin().then(res => {
              if (res === undefined){
                message.error("The returned data was not retrieved!");
              }
              else{
                if (res.status === 201 || res.status === 200) {
                  let adminInfoTableDataSource = [];
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
                    adminInfoTableDataSource.push(obj);
                  });
                  this.setState({ adminInfoTableDataSource: adminInfoTableDataSource });
                } else if (res.status === 401){
                    message.error("Unauthorized, 获取管理员数据失败");
                  }
                  else if (res.status === 403){
                    message.error("Forbidden, 获取管理员数据失败");
                  }
                  else {
                    message.error("Not Found, 获取管理员数据失败");
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
        this.setState({ addAdminModalVisible: false });
        this.setState({
          addAdminNo: null,
          addAdminName: null,
          addAdminTelArea: null,
          addAdminTel: null,
          addAdminRealName: null,
          addAdminEmail: null,
          addAdminAuthority: null,
          addAdminIcCode: null,
          addAdminPassword: null,
          addAdminPosition: null,
          addAdminStaffGid: null
        });
      });
    }
  };

  // 取消增加管理员，变量清零
  addAdminModalHandleCancel = () => {
    this.setState({ addAdminModalVisible: false });
    this.setState({
      addAdminNo: null,
      addAdminName: null,
      addAdminTelArea: null,
      addAdminTel: null,
      addAdminRealName: null,
      addAdminEmail: null,
      addAdminAuthority: null,
      addAdminIcCode: null,
      addAdminPassword: null,
      addAdminPosition: null,
      addAdminStaffGid: null
    });
  };

  // 更新管理员信息
  updateAdminModalHandleOk = () => {
    this.state.updateAdminAuthority="admin"; //默认权限为管理员
    this.state.updateAdminStaffGid=obj.staffGid; //员工Gid不可更改
    if (
      !this.state.updateAdminNo  ||
      !this.state.updateAdminName  ||
      !this.state.updateAdminTelArea  ||
      !this.state.updateAdminTel  ||
      !this.state.updateAdminRealName  ||
      !this.state.updateAdminEmail  ||
      !this.state.updateAdminIcCode  ||
      !this.state.updateAdminPassword  ||
      !this.state.updateAdminPosition  
    ) {
      message.error("请输入完整信息！");
    } else {
      updateAdmin({
        authority: this.state.updateAdminAuthority,
        email: this.state.updateAdminEmail,
        icCode: this.state.updateAdminIcCode,
        name: this.state.updateAdminName,
        no: this.state.updateAdminNo,
        passwprd: this.state.updateAdminPassword,
        position: this.state.updateAdminPosition,
        realName: this.state.updateAdminRealName,
        staffGid: parseInt(this.state.updateAdminStaffGid),
        tel: this.state.updateAdminTel,
        telArea: this.state.updateAdminTelArea
      }).then(res => {
        if (res === undefined){
          message.error("The returned data was not retrieved!");
          return;
        }
        else{
          if (res.status === 201 || res.status === 200) {
            message.success("更新成功！");
            queryAdmin().then(res => {
              if (res === undefined){
                message.error("The returned data was not retrieved!");
              }
              else{
                if (res.status === 201 || res.status === 200) {
                  let adminInfoTableDataSource = [];
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
                    adminInfoTableDataSource.push(obj);
                  });
                  this.setState({ adminInfoTableDataSource: adminInfoTableDataSource });
                } 
                else if (res.status === 401){
                  message.error("Unauthorized, 获取管理员数据失败");
                }
                else if (res.status === 403){
                  message.error("Forbidden, 获取管理员数据失败");
                }
                else {
                  message.error("Not Found, 获取管理员数据失败");
                }
              }
            });
          } 
          else if (res.status === 401){
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
        
        this.setState({ updateAdminModalVisible: false });
        this.setState({
          updateAdminNo: obj.no,
          updateAdminName: obj.name,
          updateAdminTelArea: obj.telArea,
          updateAdminTel: obj.tel,
          updateAdminRealName: obj.realName,
          updateAdminEmail: obj.email,
          updateAdminIcCode: obj.icCode,
          updateAdminPassword: obj.password,
          updateAdminPosition: obj.position,
          updateAdminStaffGid: obj.staffGid
        });
      });
    }
  }

  //取消管理员信息更新
  updateAdminModalHandleCancel = () => {
    this.setState( {updateAdminModalVisible: false });
    this.setState({
      updateAdminNo: obj.no,
      updateAdminName: obj.name,
      updateAdminTelArea: obj.telArea,
      updateAdminTel: obj.tel,
      updateAdminRealName: obj.realName,
      updateAdminEmail: obj.email,
      updateAdminIcCode: obj.icCode,
      updateAdminPassword: obj.password,
      updateAdminPosition: obj.position,
      updateAdminStaffGid: obj.staffGid
    });
  }

  //删除管理员窗口可见
  deleteNodeModel = () => {
    this.setState({ deleteNodeModalVisible: true });
  };

  // 删除管理员函数
  deleteNodeModalHandleOk = () => {
    if (this.state.adminIdSelected.length !== 1) {
      message.error('不可批量删除用户，请选择一位用户');
      return;
    }
    deleteAdmin([this.state.adminIdSelected[0]]).then(res => {
      if (res === undefined){
        message.error("The returned data was not retrieved!");
        return;
      }
      else{
        if (res.status === 200 || res.status === 201) {
          message.success("删除成功！");
          queryAdmin().then(res => {
            if (res === undefined){
              message.error("The returned data was not retrieved!");
            }
            else{
              if (res.status === 200 || res.status === 201) {
                let adminInfoTableDataSource = [];
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
                  adminInfoTableDataSource.push(obj);
                });
                this.setState({ adminInfoTableDataSource: adminInfoTableDataSource });
              } 
              else if (res.status === 401) {
                message.error("Unauthorized, 获取管理员数据失败");
              }
              else if (res.status === 403) {
                message.error("Forbidden, 获取管理员数据失败");
              }
              else {
                message.error("Not Found, 获取管理员数据失败");
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
        this.setState({ deleteAdminDisabled: true })
      }else{
        this.setState({ deleteAdminDisabled: false })
      }
      let re = [];
      selectedRows.forEach(ele => {
        re.push(ele.gid)
      })
      this.setState({ adminIdSelected: re });
    }
  };

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Layout>
          <Content style={{ margin: "16px 16px" }} id="NodeManage">
            <Card title="管理员信息管理" id="nodeManage">
              <div className="gutter-example-nodemanage">
                <Row>
                  <Col className="gutter-row-nodemanage" span={6}>
                    <div className="gutter-box-nodemanage">
                    <div>
                        <Button type="primary" onClick={this.addAdminModal}>
                          添加
                        </Button>
                        <Uploader />
                        <Button
                          disabled={this.state.deleteAdminDisabled}
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
                          <p>确定删除选中管理员吗？</p>
                        </Modal>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
              <div style={{ marginTop: 5 }}>
                <Table
                  rowSelection={this.dataInfoTableRowSelection}
                  dataSource={this.state.adminInfoTableDataSource}
                  columns={this.state.nodeInfoTableColumns}
                />
              </div>
              <div id="addAdmin">
                <Modal
                  title="添加管理员"
                  visible={this.state.addAdminModalVisible}
                  onOk={this.addAdminModalHandleOk}
                  onCancel={this.addAdminModalHandleCancel}
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
                      value={this.state.addAdminNo}
                      onChange={e => {
                        this.setState({ addAdminNo: e.target.value });
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
                      value={this.state.addAdminName}
                      onChange={e => {
                        this.setState({ addAdminName: e.target.value });
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
                      value={this.state.addAdminTelArea}
                      onChange={e => {
                        this.setState({ addAdminTelArea: e.target.value });
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
                      value={this.state.addAdminTel}
                      onChange={e => {
                        this.setState({ addAdminTel: e.target.value });
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
                      value={this.state.addAdminRealName}
                      onChange={e => {
                        this.setState({ addAdminRealName: e.target.value });
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
                      value={this.state.addAdminEmail}
                      onChange={e => {
                        this.setState({ addAdminEmail: e.target.value });
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
                      defaultValue="管理员"
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
                      value={this.state.addAdminIcCode}
                      onChange={e => {
                        this.setState({ addAdminIcCode: e.target.value });
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
                      value={this.state.addAdminPassword}
                      onChange={e => {
                        this.setState({ addAdminPassword: e.target.value });
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
                      value={this.state.addAdminPosition}
                      onChange={e => {
                        this.setState({ addAdminPosition: e.target.value });
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
                      value={this.state.addAdminStaffGid}
                      onChange={e => {
                        this.setState({ addAdminStaffGid: e.target.value });
                      }}
                    />
                  </InputGroup>
                </Modal>
              </div>
              <div id="updateAdmin">
                <Modal
                  title="更新管理员"
                  visible={this.state.updateAdminModalVisible}
                  onOk={this.updateAdminModalHandleOk}
                  onCancel={this.updateAdminModalHandleCancel}
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
                      value={this.state.updateAdminNo}
                      onChange={e => {
                        this.setState({ updateAdminNo: e.target.value });
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
                      value={this.state.updateAdminName}
                      onChange={e => {
                        this.setState({ updateAdminName: e.target.value });
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
                      value={this.state.updateAdminTelArea}
                      onChange={e => {
                        this.setState({ updateAdminTelArea: e.target.value });
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
                      value={this.state.updateAdminTel}
                      onChange={e => {
                        this.setState({ updateAdminTel: e.target.value });
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
                      value={this.state.updateAdminRealName}
                      onChange={e => {
                        this.setState({ updateAdminRealName: e.target.value });
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
                      value={this.state.updateAdminEmail}
                      onChange={e => {
                        this.setState({ updateAdminEmail: e.target.value });
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
                      defaultValue="管理员"
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
                      value={this.state.updateAdminIcCode}
                      onChange={e => {
                        this.setState({ updateAdminIcCode: e.target.value });
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
                      value={this.state.updateAdminPassword}
                      onChange={e => {
                        this.setState({ updateAdminPassword: e.target.value });
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
                      value={this.state.updateAdminPosition}
                      onChange={e => {
                        this.setState({ updateAdminPosition: e.target.value });
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
                      defaultValue={this.state.updateAdminStaffGid}
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
