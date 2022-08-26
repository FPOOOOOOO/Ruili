package icu.nescar.armee.jet.broker.handler.upload;

import icu.nescar.armee.jet.broker.config.Jt808MsgType;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.KafkaProducerStatic;
import icu.nescar.armee.jet.broker.ext.producer.kafka.KafkaProducerStatic2;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKey;
import icu.nescar.armee.jet.broker.msg.req.AuthUpdateSuccessRequestMsgBody;
import icu.nescar.armee.jet.broker.util.CheckSum;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandler;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandlerMapping;
import io.github.hylexus.jt808.msg.RequestMsgHeader;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.RespMsgBody;
import io.github.hylexus.jt808.msg.resp.CommonReplyMsgBody;
import io.github.hylexus.jt808.session.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @Auther whale
 * @Date 2020/9/7
 * 授权信息更新成功上报处理器
 */
@Slf4j
@Jt808RequestMsgHandler
@Component
public class AuthUpdateSuccessMsgHandler {
    @Autowired
    CheckSum checkSum;

    @Jt808RequestMsgHandlerMapping(msgType = 0x0F07)
    public RespMsgBody processAuthUpdateMsg(
            Session session, RequestMsgMetadata metadata,
            RequestMsgHeader header, AuthUpdateSuccessRequestMsgBody msgBody
    ) {
        assert header.getMsgId() == Jt808MsgType.CLIENT_SETTINGS_UPDATE_INFO_UPLOAD.getMsgId();
        assert session.getTerminalId().equals(header.getTerminalId());
        assert session.getTerminalId().equals(metadata.getHeader().getTerminalId());
        assert metadata.getHeader() == header;
        if (checkSum.validateCheckSum(metadata.getUnescaped(), metadata.getHeader(), metadata.getCheckSum())) {

            Producer<KafkaMsgKey, Object> implSync = KafkaProducerStatic2.getDeviceInstance();
            try {
                KafkaMsgKey key = new KafkaMsgKey(session.getTerminalId(), Jt808MsgType.CLIENT_SETTINGS_UPDATE_INFO_UPLOAD.getMsgId());
                implSync.send(key, msgBody);
            } catch (Exception e) {
                e.printStackTrace();
            }
            log.info("处理授权信息更新成功上报信息 terminalId = {}, msgBody = {}", header.getTerminalId(), msgBody);
            return CommonReplyMsgBody.success(header.getFlowId(), Jt808MsgType.CLIENT_SETTINGS_UPDATE_INFO_UPLOAD);

        }
        else {
            log.info("授权信息上报信息校验有误，不上传");
            return CommonReplyMsgBody.of((byte) 2, header.getFlowId(), Jt808MsgType.CLIENT_SETTINGS_UPDATE_INFO_UPLOAD);
        }
    }
}

