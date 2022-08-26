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
public class RGE11 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = -4516841292109774090L;
    private int rideHeightRequest;
    private int levelChangeRequestFrontAxle;
    private int levelChangeRequestRearAxle;
    private int tractionHelpRequest;
    private int liftAxle1PositionRequest;
    private int liftAxle2PositionRequest;
    private int steeringAxleLockingRequest;
    private int rampLevelRequest;
    private int levelControlRequest;
    private int rampLevelStorageRequest;
    private int stopLevelChangeRequest;
    private int rideHeightStorageRequest;
    private int drivenAxleLoad;
    private int parkingAndTrailerAirPressure;
    private int auxiliaryEquipmentSupplyPressure;
    private int liftAxle3PositionRequest;
    private int liftAxle4PositionRequest;
    private int liftAxle5PositionRequest;
    private int rideHeightAndRampLevelSetRequest;
    private byte[] canTime;
}

