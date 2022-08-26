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
public class EBS25 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = -8042273802027743105L;
    private int brakeCylinderPressureFirstAxleLeftWheel;
    private int brakeCylinderPressureFirstAxleRightWheel;
    private int brakeCylinderPressureSecondAxleLeftWheel;
    private int brakeCylinderPressureSecondAxleRightWheel;
    private int brakeCylinderPressureThirdAxleLeftWheel;
    private int brakeCylinderPressureThirdAxleRightWheel;
    private int ROPSystemStatus;
    private int YCSystemStatus;
    private int externalBrakeRequestStatus;
    private byte[] canTime;

}

