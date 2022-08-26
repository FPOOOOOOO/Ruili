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
public class EBS23 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 1612935355051329065L;
    private int tyrePressureStatus;
    private int brakeLiningStatus;
    private int brakeTemperatureStatus;
    private int vehiclePneumaticSupplyStatus;
    private int tyreIdentificationForTyrePressure;
    private int tyreIdentificationForBrakeLining;
    private int tyreIdentificationForBrakeTemperature;
    private int tyrePressure;
    private int brakeLining;
    private int brakeTemperature;
    private int pneumaticSupplyPressure;
    private byte[] canTime;

}

