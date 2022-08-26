package icu.nescar.armee.jet.broker.msg.CANMessage;

import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @Auther whale
 * @Date 2021/4/28
 * 不使用
 */
@Data
@Accessors(chain = true)
public class TDE11 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 4676723118111669262L;
    private int seconds;
    private int minutes;
    private int hours;
    private int day;
    private int month;
    private int year;
    private int localMinuteOffset;
    private int localHourOffset;
    private byte[] canTime;
}

