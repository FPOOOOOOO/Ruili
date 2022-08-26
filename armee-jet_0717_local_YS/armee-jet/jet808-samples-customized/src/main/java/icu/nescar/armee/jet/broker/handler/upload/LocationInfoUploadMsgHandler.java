package icu.nescar.armee.jet.broker.handler.upload;

import icu.nescar.armee.jet.broker.config.CANMsgType;
import icu.nescar.armee.jet.broker.config.Jt808MsgType;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.KafkaProducerStatic;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKey;
import icu.nescar.armee.jet.broker.msg.req.CANMsgRequestMsgBody;
import icu.nescar.armee.jet.broker.msg.req.LocationUploadRequestMsgBody;
import icu.nescar.armee.jet.broker.util.CheckSum;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandler;
import io.github.hylexus.jt.annotation.msg.handler.Jt808RequestMsgHandlerMapping;
import io.github.hylexus.jt.data.msg.MsgType;
import io.github.hylexus.jt808.handler.AbstractMsgHandler;
import io.github.hylexus.jt808.msg.RequestMsgHeader;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.RespMsgBody;
import io.github.hylexus.jt808.msg.resp.CommonReplyMsgBody;
import io.github.hylexus.jt808.session.Jt808Session;
import io.github.hylexus.jt808.session.Session;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Optional;

/**
 * @author hylexus
 * Created At 2019-09-19 11:31 下午
 * 位置上报信息的消息处理器
 * 会返回一个通用应答
 */
@Slf4j
@Component
@Jt808RequestMsgHandler
public class LocationInfoUploadMsgHandler{

    @Autowired
    CheckSum checkSum;
    @Jt808RequestMsgHandlerMapping(msgType = 0x0200)
    public RespMsgBody processLocationMsg(
            Session session, RequestMsgMetadata metadata,
            RequestMsgHeader header,LocationUploadRequestMsgBody msgBody
    ) {
        //对校验码进行判断 不一致的话就不进行上传操作
        if (checkSum.validateCheckSum(metadata.getBodyBytes(), metadata.getHeader(), metadata.getCheckSum()))
        {
                Producer<KafkaMsgKey, Object> implSync = KafkaProducerStatic.getDataInstance();
                try {
                    KafkaMsgKey key = new KafkaMsgKey(session.getTerminalId(), Jt808MsgType.CLIENT_LOCATION_INFO_UPLOAD.getMsgId());
                    implSync.send(key, msgBody);
                } catch (Exception e) {
                    e.printStackTrace();
                }
                log.info("处理位置上报信息 terminalId = {}, msgBody = {}", session.getTerminalId(), msgBody);
                //返回平台通用应答 ：结果（成功即结果为0） 流水号（终端号）和发来的对应消息id三个数据}
                return CommonReplyMsgBody.success(header.getFlowId(), Jt808MsgType.CLIENT_LOCATION_INFO_UPLOAD);//Optional.of（t）返回一个t的非空值


        } else {
            log.info("位置消息校验错误，不上传");
            //2表示消息错误 校验不一致
            return CommonReplyMsgBody.of((byte) 2, header.getFlowId(), Jt808MsgType.CLIENT_LOCATION_INFO_UPLOAD);
        }
    }
}
