package icu.nescar.armee.jet.broker.msg.req;

import icu.nescar.armee.jet.broker.util.SerializationUtil;
import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import io.github.hylexus.jt.annotation.msg.req.basic.BasicField;
import io.github.hylexus.jt.data.MsgDataType;
import io.github.hylexus.jt808.msg.RequestMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @Auther whale
 * @Date 2021/1/15
 * 授权信息成功上报的消息题
 */
@Data
@Accessors(chain = true)
@Jt808ReqMsgBody(msgType = 0x0F07)

public class AuthUpdateSuccessRequestMsgBody implements RequestMsgBody, Serializable {
    private static final long serialVersionUID = -7197293729749L;
    //司机身份信息,在上层存储叫icCode
//    @BasicField(startIndex = 0,dataType = MsgDataType.BYTES,length=6)
//    private byte[] driverID;
    @BasicField(startIndex = 0,dataType = MsgDataType.STRING,length=6)
    private String driverId;


    @BasicField(startIndex =6 ,dataType = MsgDataType.BYTES,length = 6)
    private byte[] lockTimeStart;//上锁时间起点 YY-MM-DD-hh-mm-ss GMT+8时间
    @BasicField(startIndex = 12,dataType = MsgDataType.BYTES,length = 6)
    private byte[] lockTimeEnd;//上锁时间终点 YY-MM-DD-hh-mm-ss GMT+8时间

    @BasicField(startIndex = 18,dataType = MsgDataType.BYTES,length = 6)
    private byte[] updateTime;

}

