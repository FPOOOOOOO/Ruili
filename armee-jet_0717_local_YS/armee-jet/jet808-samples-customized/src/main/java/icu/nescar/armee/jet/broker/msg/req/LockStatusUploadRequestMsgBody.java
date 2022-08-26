package icu.nescar.armee.jet.broker.msg.req;

import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import io.github.hylexus.jt.annotation.msg.req.basic.BasicField;
import io.github.hylexus.jt.annotation.msg.req.slice.SlicedFrom;
import io.github.hylexus.jt.data.MsgDataType;
import io.github.hylexus.jt808.msg.RequestMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @Auther whale
 * @Date 2020/9/7
 * 锁状态上报的消息体
 * 当锁状态发生改变时主动上报
 */
@Data
@Accessors(chain = true)
@Jt808ReqMsgBody(msgType = 0x0F05)
public class LockStatusUploadRequestMsgBody implements RequestMsgBody, Serializable {
    private static final long serialVersionUID = 4777988741696018338L;
    //锁状态信息
    //0：开锁；1：上锁
    //其余值保留
    @BasicField(startIndex = 0,dataType = MsgDataType.BYTE,length = 1)
    private byte lockStatus;


    //事件发生时的时间
   @BasicField(startIndex = 1,dataType = MsgDataType.BYTES,length = 6)
    private byte[] lockStatusTime;//时间 YY-MM-DD-hh-mm-ss GMT+8时间
}

