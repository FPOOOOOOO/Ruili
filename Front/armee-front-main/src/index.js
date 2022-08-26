import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import SignIn from "./SignIn/SignIn";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
 
function requireAuthentication(Component) {
  // 组件有已登陆的模块 直接返回 (防止重新渲染)
  if (Component.AuthenticatedComponent) {
    return Component.AuthenticatedComponent;
  }

  // 创建验证组件
  class AuthenticatedComponent extends React.Component {
    state = {
      flag: false
    };
    componentWillMount() {
      this.checkAuth();
    }
    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }
    checkAuth() {
      //判断缓存是否有token
      const access_token = localStorage.getItem("access_token");

      const reg = access_token ? true : null;
      if (reg) {
        //有token，重置flag
        this.setState({ flag: true });
      } else {

        let platform = localStorage.getItem('platform')
        if(platform){
          window.location.href = "/?"+platform;
          localStorage.removeItem('platform')
        }else{
          window.location.href = "/";
        }
      }
    }
    render() {
      return this.state.flag ? <Component {...this.props} /> : null;
    }
  }
  return AuthenticatedComponent;
}

function SignupAuthentication(Component) {
  // 组件有已登陆的模块 直接返回 (防止重新渲染)
  if (Component.AuthSignupComponent) {
    return Component.AuthSignupComponent;
  }

  // 创建验证组件
  class AuthSignupComponent extends React.Component {
    state = {
      flag: false
    };
    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      //判断缓存是否有token
      const access_token = localStorage.getItem("access_token");
      const reg = access_token ? true : null;
      if (!reg) {
        //没有token转登录接口
        this.setState({ flag: true });
      } else {
        //this.setState({ flag: true });
        window.location.href = "/app";
      }
    }

    render() {
      return this.state.flag ? <Component {...this.props} /> : null;
    }
  }
  return AuthSignupComponent;
}

ReactDOM.render(
  <Router>
    <Switch>
      {/* 没有token跳转登录页，有token跳转首页 */}
      <Route exact path="/" component={SignupAuthentication(SignIn)} />
      <Route path="/app" component={requireAuthentication(App)} />
    </Switch>
  </Router>,
  //   <Router>
  //   <Switch>
  //     {/* 没有token跳转登录页，有token跳转首页 */}
  //     <Route exact path="/" component={SignupAuthentication(SignIn)} />
  //   </Switch>
  // </Router>,
  document.getElementById("root")
);
registerServiceWorker();
