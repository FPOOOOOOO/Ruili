package icu.nescar.armee.jet.broker.msg.CANMessage;

import io.github.hylexus.jt.annotation.msg.req.Jt808ReqMsgBody;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.lang.ref.PhantomReference;

/**
 * @Auther whale
 * @Date 2021/4/28
 */
@Data
@Accessors(chain = true)
public class EBS22 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 5285421973427290666L;
    private int ABSStatus;
    private int retarderControlStatus;
    private int serviceBrakeStatus;
    private int automaticTowedVehicleBrakingStatus;
    private int electricalSupplyStatus;
    private int redWarningSignalRequest;
    private int amberWarningSignalRequest;
    private int electricalSupplyOfNonbrakingSystemStatus;
    private int springBrakeInstallationStatus;
    private int electricalLoadProportionalFunctionInstallStatus;
    private int vehicleType;
    private int springBrakeStatus;
    private int loadRampApproachAssistanceStatus;
    private int supplyLineBraking;
    private int stopLampsRequest;
    private int brakingViaElectricControlLineSupport;
    private int axleLoadSum;
    private int retarderReferenceTorque;
    private byte[] canTime;


}

