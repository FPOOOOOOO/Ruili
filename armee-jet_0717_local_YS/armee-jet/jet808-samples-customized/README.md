# 说明
## 1、配置config
### 1.1 Jt808Config添加消息转换器、处理器

Jt808Config.configureMsgConverterMapping和configureMsgHandlerMapping分别添加消息转换器、消息处理器。

### 1.2 Jt808MsgTypeParser添加自定义设备鉴权器

Jt808Config.supplyAuthCodeValidator中添加自定义设备鉴权器

### 1.3 Jt808MsgType添加消息类型

## 2、控制器（MVC的概念）
可以通过HTTP来获取消息，如设备的属性

## 3、自定义消息转换器converter

参考转换器LocationUploadMsgBodyConverter的设计

## 4、拓展功能ext
自定义拓展功能，比如自定义设备鉴权器、消息生产者、消息消费者等

## 5、自定义消息处理器handler

参考处理器LocationInfoUploadMsgHandler，实现获取到此类消息后到后续操作，比如发送到Kafka消息队列、返回响应（到设备）。

返回响应后，调用doProcess的函数（AbstractMsgHandler.handleMsg）会自动将响应发送给设备，不需要人为操作。

## 6、自定义消息msg
### 6.1 请求消息req
自定义请求消息，比如LocationUploadRequestMsgBody定义了请求位置信息
### 6.2 响应消息resp
RespTerminalSettings定义了设备的属性，可以通过控制器来实现获取

## 7、工具util
