package icu.nescar.armee.jet.broker.config;


import icu.nescar.armee.jet.broker.converter.CANMsgBodyConverter;
import icu.nescar.armee.jet.broker.converter.LocationMsgBodyConverter;
import icu.nescar.armee.jet.broker.ext.auth.service.impl.AuthCodeValidatorImpl;
//import icu.nescar.armee.jet.broker.ext.netty.MyChannelHandlerAdapter;
import icu.nescar.armee.jet.broker.ext.netty.MyChannelHandlerAdapter;
import io.github.hylexus.jt.exception.MsgEscapeException;
import io.github.hylexus.jt808.boot.config.Jt808ServerConfigurationSupport;
import io.github.hylexus.jt808.codec.BytesEncoder;
import io.github.hylexus.jt808.converter.MsgTypeParser;
import io.github.hylexus.jt808.ext.AuthCodeValidator;

import io.github.hylexus.jt808.ext.TerminalValidator;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.session.Jt808SessionManager;
import io.github.hylexus.jt808.support.MsgHandlerMapping;
import io.github.hylexus.jt808.support.RequestMsgBodyConverterMapping;
import io.github.hylexus.jt808.support.netty.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

/**
 * @author hylexus
 * Created At 2019-09-22 3:43 下午
 * 添加消息转换器、处理器
 */
@Slf4j//生成log日志的注解
@Configuration//spring框架的注解 说明这个类作为一个IoC容器
public class Jt808Config extends Jt808ServerConfigurationSupport {

    @Autowired
    private Jt808SessionManager sessionManager;

    private final static AuthCodeValidatorImpl authCodeValidator=new AuthCodeValidatorImpl();
//覆盖默认逻辑 netty的相关配置

/*ServerBootstrap服务器端的引导类，绑定到一个本地端口，且需要两组不同的channel
* 一组用来代表服务器自身的已绑定到某个本地端口的正在监听的套接字
* 第二组包含所有已创建的用来处理传入客户端连接的channel*/
// [非必须配置] -- 可替换内置Netty相关配置
//@Override
public Jt808ServerNettyConfigure jt808ServerNettyConfigure(
        HeatBeatHandler heatBeatHandler, Jt808DecodeHandler decodeHandler,
        TerminalValidatorHandler terminalValidatorHandler, MyChannelHandlerAdapter jt808ChannelHandlerAdapter) {

   return super.jt808ServerNettyConfigure(heatBeatHandler, decodeHandler, terminalValidatorHandler, jt808ChannelHandlerAdapter);
//   AuthValidatorHandler authValidatorHandler=new AuthValidatorHandler(authCodeValidator);
//    return new ArmeeServerNettyConfigure(heatBeatHandler, decodeHandler, terminalValidatorHandler, authValidatorHandler, jt808ChannelHandlerAdapter);
}



    @Override
    /*手动将解析位置消息的转换器注册进去,还注册了新的里程信息转换器*/
    public void configureMsgConverterMapping(RequestMsgBodyConverterMapping mapping) {
        super.configureMsgConverterMapping(mapping);
        mapping.registerConverter(Jt808MsgType.CLIENT_LOCATION_INFO_UPLOAD, new LocationMsgBodyConverter());
        mapping.registerConverter(Jt808MsgType.CLIENT_CAN_INFO_UPLOAD,new CANMsgBodyConverter());
    }

    @Override
    /*手动将解析xx消息的处理器注册进去，同上
    * 如果自定义了鉴权消息处理器，并在此处注册，那么AuthCodeValidator也不需要提供了
    * 但自定义的一些处理器在使用过程中会报null指针错误 所以目前废弃掉这种方式了
    * 也可以从Spring容器中获取bean来注入，不一定要手动new一个handler注册*/
    public void configureMsgHandlerMapping(MsgHandlerMapping mapping) {
        super.configureMsgHandlerMapping(mapping);
//        mapping.registerHandler(Jt808MsgType.CLIENT_MILEAGE_INFO_UPLOAD, new MileageInfoUploadMsgHandler());
//        mapping.registerHandler(Jt808MsgType.CLIENT_COMMON_REPLY, new TerminalCommonReplyMsgHandler());
    }

    @Override
    public BytesEncoder supplyBytesEncoder() {
        return new BytesEncoder() {

            private final BytesEncoder bytesEncoder = new BytesEncoder.DefaultBytesEncoder();

            @Override
            public byte[] doEscapeForReceive(byte[] bytes, int start, int end) throws MsgEscapeException {
                return bytesEncoder.doEscapeForReceive(bytes, start, end);
            }

            @Override
            public byte[] doEscapeForSend(byte[] bytes, int start, int end) throws MsgEscapeException {
                return bytesEncoder.doEscapeForSend(bytes, start, end);
            }
        };
    }
    @Override
    public TerminalValidator terminalValidator() {
        return new TerminalValidator() {
            @Override
            public boolean validateTerminal(RequestMsgMetadata metadata) {
                return true;
            }

            @Override
            public boolean needValidate(RequestMsgMetadata metadata, Integer msgId) {
                return true;
            }
        };
    }

    @Override
   public AuthCodeValidator supplyAuthCodeValidator() {
        return (session, requestMsgMetadata, authRequestMsgBody) -> {
          final String terminalId = session.getTerminalId();
           final String authCode = authRequestMsgBody.getAuthCode();
            // 从覆盖的validateAuthCode方法进行鉴权逻辑
           if(authCodeValidator.validateAuthCode(session,requestMsgMetadata,authRequestMsgBody)){

                log.info("鉴权通过。AuthCode validate for terminal : {} with authCode : {}, result: {}", terminalId, authCode, true);
                //鉴权通过的话 将session持久化，否则就断开
                sessionManager.persistenceIfNecessary(terminalId, session.getChannel());
               return true;}
            else {log.info("鉴权失败。AuthCode validate for terminal : {} with authCode : {}, result: {}", terminalId, authCode, false);
//               sessionManager.removeBySessionId(sessionManager.generateSessionId(session.getChannel()));
               sessionManager.persistenceIfNecessary(terminalId, session.getChannel());
         return false;}
        };
    }


    @Override
    public MsgTypeParser supplyMsgTypeParser() {
        return new Jt808MsgTypeParser();
    }

}
