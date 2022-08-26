import React, { Component } from 'react';
import './App.css';
import {
  Layout,
  Menu,
  message,
} from "antd";
import {
  SmileOutlined,
  HomeOutlined,
  SettingOutlined,
  FileTextOutlined,
  UserOutlined,
  SwapLeftOutlined,
} from '@ant-design/icons';

import { Route, Switch, Link } from 'react-router-dom';
import carStart from "./carStart/carStart";
import carControl from "./carControl/carControl";
import data from "./carInfo/data/data";
import queryTsData from "./carInfo/queryTsData/queryTsData";
import driver from "./userManage/driver/driver";
import admin from "./userManage/admin/admin";
import {
  logoff
} from "./axios/index";

const { Content, Sider } = Layout;
const { SubMenu } = Menu;
const role = localStorage.getItem('user_type');

export default class App extends Component {
  state = {
    menuKey: null,
  };

  componentWillMount = () => {
    const pathname = window.location.pathname;
    this.setState({ menuKey: pathname });
  }

  componentDidMount = () => {
    document.title = "远程信息管理平台";
  }

  // 登出
  // 本地登出
  log_off = () => {

    message.success("注销成功");

    localStorage.removeItem("token");
    localStorage.removeItem("access_token");
    localStorage.removeItem("userID");
    localStorage.removeItem("user_type");
    setTimeout(function () {
      window.location.href = "/";
    }, 1000);
  }


  // 以下需要服务器
  // log_off = () => {
  //   logoff().then(res => {
  //     if (res === undefined){
  //       message.error("The returned data was not retrieved!");
  //       // setTimeout(function () {
  //       //   window.location.href = "/";
  //       // }, 1000);
  //     }
  //     else{
  //       // todo 
  //       // if (res.data.status == 1) {
  //       if (res) {
  //         message.success("注销成功");
  //       } 
  //       else {
  //         message.error("注销失败");
  //       }
  //       localStorage.removeItem("token");
  //       localStorage.removeItem("access_token");
  //       localStorage.removeItem("userID");
  //       localStorage.removeItem("user_type");
  //       setTimeout(function () {
  //         window.location.href = "/";
  //       }, 1000);
  //     }
  //   });
  // }

  render() {
    return (
      <Layout style={{ minHeight: "100vh" }}>
        <Sider
          collapsible
        >
          <Menu theme="dark" mode="inline" defaultSelectedKeys={[this.state.menuKey]}>
            <Menu.Item key="admin" disabled={true}>
              <SmileOutlined />
              <span>您好，{localStorage.getItem("userID")}</span>
            </Menu.Item>
            {/* 根据用户类型，判断是否显示各个标签 */}
            <Menu.Item key="/app" >
              <Link to="/app">
                <HomeOutlined />
                <span>首页</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/app/carControl"> { /* style={{ display: (role === 'ROLE_ADMIN' || role == 'ROLE_SUPER_ADMIN') ? 'block' : 'none'}}> */}
              <Link to="/app/carControl">
                <SettingOutlined />
                <span>汽车控制</span>
              </Link>
            </Menu.Item>
            <SubMenu
              title={
                <span>
                  <FileTextOutlined />
                  <span>汽车信息</span>
                </span>
              }>
              {/* style={{ display: (role === 'ROLE_ADMIN' || role == 'ROLE_SUPER_ADMIN') ? 'block' : 'none'}}>  */}
              <Menu.Item key="/app/carInfo/data">
                <Link to="/app/carInfo/data" >
                  <span>汽车信息</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/carInfo/queryTsData">
                <Link to="/app/carInfo/queryTsData" >
                  <span>汽车时序数据</span>
                </Link>
              </Menu.Item>
            </SubMenu>
            {/* 根据用户类型，判断是否显示用户管理标签 */}
            <SubMenu
              title={
                <span>
                  <UserOutlined />
                  <span>用户管理</span>
                </span>
              }
              style={{display:(role == 'ROLE_SUPER_ADMIN')?'block':'none'}}
              >
              {/* style={{ display: (role === 'ROLE_SUPER_ADMIN') ? 'block' : 'none' }}>  */}
              <Menu.Item key="/app/user/driver" >
                <Link to="/app/user/driver">
                  <span>司机</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="/app/user/admin">
                <Link to="/app/user/admin">
                  <span>管理员</span>
                </Link>
              </Menu.Item>
            </SubMenu>
            <Menu.Item key="log_off">
              <span onClick={this.log_off}>
                <SwapLeftOutlined />
                <span>退出登陆</span>
              </span>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout >
          <Content id="Farmer">
            <Switch>
              {/* 全部路由 */}
              <Route exact path='/app' component={carStart} />
              <Route path='/app/carControl' component={carControl} />
              <Route path="/app/carInfo/data" component={data} />
              <Route path="/app/carInfo/queryTsData" component={queryTsData} />
              <Route path="/app/user/driver" component={driver} />
              <Route path="/app/user/admin" component={admin} />
            </Switch>
          </Content>
          {/* <Footer style={{ textAlign: "center" }}>
            SORL ©2021 Created by Zhejiang University
          </Footer> */}
        </Layout>
      </Layout>
    )
  }
}
