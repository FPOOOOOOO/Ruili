package icu.nescar.armee.jet.broker.handler.upload;

import icu.nescar.armee.jet.broker.config.Jt808MsgType;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.KafkaProducerStatic2;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKey;
import icu.nescar.armee.jet.broker.msg.req.AuthUpdateSuccessRequestMsgBody;
import icu.nescar.armee.jet.broker.util.CheckSum;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandler;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandlerMapping;
import io.github.hylexus.jt.command.CommandWaitingPool;
import io.github.hylexus.jt.command.Jt808CommandKey;

import io.github.hylexus.jt808.msg.RequestMsgHeader;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.RespMsgBody;
import io.github.hylexus.jt808.msg.req.BuiltinTerminalCommonReplyMsgBody;
import io.github.hylexus.jt808.msg.resp.CommonReplyMsgBody;

import io.github.hylexus.jt808.session.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @Auther whale
 * @Date 2021/3/10
 * 收到终端通用应答后 将下发消息等待的commandkey的值写入
 * 让平台根据commandkey的值判断消息下发成功
 */
@Slf4j
@Jt808RequestMsgHandler
@Component
public class TerminalCommonReplyMsgHandler  {
    @Autowired
    CheckSum checkSum;


    @Jt808RequestMsgHandlerMapping(msgType = 0x0001)
    public RespMsgBody processCommonMsg(
            Session session, RequestMsgMetadata metadata,
            RequestMsgHeader header, BuiltinTerminalCommonReplyMsgBody msgBody
    ) {
//        assert header.getMsgId() == Jt808MsgType.CLIENT_CAN_INFO_UPLOAD.getMsgId();
        assert session.getTerminalId().equals(header.getTerminalId());
        assert session.getTerminalId().equals(metadata.getHeader().getTerminalId());
        assert metadata.getHeader() == header;
        //如果校验码一致 本身这里会写入commandkey 从而使不再重复发送 去掉这个机制 不使用

        if (checkSum.validateCheckSum(metadata.getUnescaped(), metadata.getHeader(), metadata.getCheckSum())) {
//            try {
//
//                Jt808CommandKey commandKey = Jt808CommandKey.of(metadata.getMsgType(), metadata.getHeader().getTerminalId(), metadata.getHeader().getFlowId());
//               commandKey.setFlowId(metadata.getHeader().getFlowId());
//                commandKey.setFlowId(msgBody.getReplyFlowId());
//                commandKey.setMsgType(metadata.getMsgType());
//                commandKey.setTerminalId(metadata.getHeader().getTerminalId());
//                CommandWaitingPool.getInstance().putIfNecessary(commandKey, "result for " + commandKey.getKeyAsString());
//            } catch (Exception e) {
//                e.printStackTrace();
//            }



            log.info("收到终端通用应答 terminalId = {}, msgBody = {}", session.getTerminalId(), msgBody);
            return CommonReplyMsgBody.success(header.getFlowId(), Jt808MsgType.CLIENT_COMMON_REPLY);

        } else {
            log.info("终端应答消息校验有误");
            //2表示消息错误 校验不一致
            return CommonReplyMsgBody.of((byte) 2, header.getFlowId(), Jt808MsgType.CLIENT_COMMON_REPLY);
        }


    }
}

//
//    @Autowired
//    CheckSum checkSum;
//
//    @Override
//    protected Optional<RespMsgBody> doProcess(RequestMsgMetadata metadata, BuiltinTerminalCommonReplyMsgBody body, Jt808Session session) {
//
//        if (checkSum.validateCheckSum(metadata.getUnescaped(), metadata.getHeader(), metadata.getCheckSum())) {
//            Jt808CommandKey commandKey = Jt808CommandKey.of(metadata.getMsgType(), metadata.getHeader().getTerminalId(), metadata.getHeader().getFlowId());
//            commandKey.setFlowId(metadata.getHeader().getFlowId());
//            commandKey.setMsgType(metadata.getMsgType());
//            commandKey.setTerminalId(metadata.getHeader().getTerminalId());
//            CommandWaitingPool.getInstance().putIfNecessary(commandKey, "result for " + commandKey.getKeyAsString());
//            log.info("收到终端通用应答 terminalId = {}, msgBody = {}", session.getTerminalId(), body);
//            return Optional.empty();
//        }
//        else {
//            log.info("终端应答消息校验错误，不处理");
//            return Optional.empty();
//        }
//    }

