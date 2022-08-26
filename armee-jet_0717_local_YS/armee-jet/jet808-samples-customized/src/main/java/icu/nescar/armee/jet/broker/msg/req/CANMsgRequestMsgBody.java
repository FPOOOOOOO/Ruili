package icu.nescar.armee.jet.broker.msg.req;

import icu.nescar.armee.jet.broker.msg.CANMessage.CANMsgBody;
import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import io.github.hylexus.jt.annotation.msg.req.basic.BasicField;
import io.github.hylexus.jt.data.MsgDataType;
import io.github.hylexus.jt808.msg.RequestMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.Date;

/**
 * @Auther whale
 * @Date 2020/11/16
 * CAN总线数据上传  直接将can总线报文上传
 */
@Data
@Accessors(chain = true)
@Jt808ReqMsgBody(msgType = 0x0705)
public class CANMsgRequestMsgBody implements RequestMsgBody, Serializable {
    private static final long serialVersionUID = -2049808968329417346L;
    //数据项个数 目前只传1个
//    @BasicField(startIndex = 0, dataType = MsgDataType.WORD, length = 2)
//    private int msgItem;

//    CAN总线数据接收时间
//    @BasicField(startIndex = 2, dataType = MsgDataType.BYTES, length = 6)
    private String canTime;//第 1 条 CAN 总线数据的接收时间，yy-hh-mm-ss-msms

    //bit31 表示 CAN 通道号，0：CAN1，1：CAN2；
    //bit30 表示帧类型，0：标准帧，1：扩展帧；
    //bit29 表示数据采集方式，0：原始数据，1：采
    //集区间的平均值；
    //bit28-bit0 表示 CAN 总线 ID。
//    @BasicField(startIndex = 8,dataType = MsgDataType.DWORD,length = 4)
    private int canID;

    //CAN 数据
//    @BasicField(startIndex = 12,dataType = MsgDataType.BYTES,length = 8)
    private CANMsgBody canData;

}
