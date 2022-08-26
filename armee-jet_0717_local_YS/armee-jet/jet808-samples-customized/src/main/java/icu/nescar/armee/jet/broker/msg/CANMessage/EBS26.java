package icu.nescar.armee.jet.broker.msg.CANMessage;

import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;

/**
 * @Auther whale
 * @Date 2021/4/28
 */
@Data
@Accessors(chain = true)
public class EBS26 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 8724262163878060164L;
    private int wheelSpeedFirstAxleLeftWheel;
    private int wheelSpeedFirstAxleRightWheel;
    private byte[] canTime;

}

