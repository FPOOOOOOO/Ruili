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
public class EBS12 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 8126515654685264539L;
    private int retarderControlStatus;
    private int ROPStatus;
    private int YCStatus;
    private int trailerROPSystemRequest;
    private int trailerYCSystemRequest;
    private int reverseGearStatus;
    private int emergencyBrakingStatus;
    private int twoElectricalCircuitsBrakeDemandStatus;
    private int ABSOffroadRequest;
    private int pneumaticControlLineStatus;
    private int loadProportionalFunctionInstallationStatus;
    private int roadCurvature;
    private int brakingSystemWheelbasedSpeed;
    private byte[] canTime;

}

