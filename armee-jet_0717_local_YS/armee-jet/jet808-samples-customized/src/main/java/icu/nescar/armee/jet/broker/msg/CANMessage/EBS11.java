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
public class EBS11 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 5855530221038216001L;
    private int ABSstatus;
    private int retarderControlStatus;
    private int ASRBrakeCcontrolStatus;
    private int ASREngineControlStatus;
    private int brakeLightSwitch;
    private int vehicleType;
    private int VDCActive;
    private int serviceBrakeDemandPressure;
    private int parkBrakeDemandRelativePressure;
    private int retarderDemandRelativePressure;
    private int relativeBrakeDemandFrontLeftSide;
    private int relativeBrakeDemandRearRightSide;
//    private byte[] canTime;

}

