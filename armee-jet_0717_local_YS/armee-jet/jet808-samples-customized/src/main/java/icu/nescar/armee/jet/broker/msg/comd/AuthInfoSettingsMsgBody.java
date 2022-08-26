package icu.nescar.armee.jet.broker.msg.comd;

import io.github.hylexus.jt.annotation.msg.resp.CommandField;
import io.github.hylexus.jt.annotation.msg.resp.Jt808RespMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;
//import sun.jvm.hotspot.runtime.Bytes;

import java.io.Serializable;

import static io.github.hylexus.jt.data.MsgDataType.*;

/**
 * @author whale
 * Created At 2020-12-10 10:43 下午
 * 设置授权信息的下发消息体
 */
@Data
@Accessors(chain = true)
@Jt808RespMsgBody(respMsgId = 0x8F00, desc = "授权信息下发")
public class AuthInfoSettingsMsgBody implements Serializable {
    private static final long serialVersionUID = -7832986449797L;
    //车辆的身份信息 下发的是ic卡号 string类型 6个字节
//    @CommandField(order = 1, targetMsgDataType = BYTES)
//    private byte[] driverID;
    @CommandField(order = 1, targetMsgDataType =STRING )
    private String driverID;

    @CommandField(order = 2, targetMsgDataType =STRING )
    private String terminalID;

    //上锁时间起点 服务端设置的上锁时间范围 YY-MM-DD-hh-mm-ss GMT+8时间
    @CommandField(order = 3, targetMsgDataType =BYTES)
    private byte[] lockTimeStart;

    //上锁时间终点 YY-MM-DD-hh-mm-ss GMT+8时间
    @CommandField(order = 4, targetMsgDataType = BYTES)
    private byte[] lockTimeEnd;

}
