package icu.nescar.armee.jet.broker.converter;

import icu.nescar.armee.jet.broker.config.CANMsgType;
import icu.nescar.armee.jet.broker.msg.CANMessage.*;
import icu.nescar.armee.jet.broker.msg.req.CANMsgRequestMsgBody;
import io.github.hylexus.jt808.converter.RequestMsgBodyConverter;
import io.github.hylexus.jt808.msg.RequestMsgBody;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import lombok.extern.slf4j.Slf4j;

import java.sql.Time;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.Optional;

import static io.github.hylexus.oaks.utils.IntBitOps.intFromBytes;

/**
 * @Auther whale
 * @Date 2021/4/22
 * can报文的转换器
 */
@Slf4j
public class CANMsgBodyConverter implements RequestMsgBodyConverter<CANMsgRequestMsgBody> {

    @Override
    public Optional<CANMsgRequestMsgBody> convert2Entity(RequestMsgMetadata requestMsgMetadata) {
        byte[] bytes = requestMsgMetadata.getBodyBytes();
        CANMsgRequestMsgBody body=new CANMsgRequestMsgBody();
//        body.setMsgItem(intFromBytes(bytes,0,2));
        //转换成rfc时间格式
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");
        String timeStr = simpleDateFormat.format(new Date());
        String timehjy = "2022-07-07T00:44:51Z";
        //body.setCanTime(timeStr);
        body.setCanTime(timeStr);
        body.setCanID(intFromBytes(bytes,0,4));
        byte[] canData=Arrays.copyOfRange(bytes,4,12);
        switch (body.getCanID()){
            case 0x0C02C820:
                EBS11 canBody=new EBS11();
//                canBody.setCanTime(body.getCanTime());
                canBody.setABSstatus(canData[0]&0x03);
                canBody.setRetarderControlStatus((canData[0]>>2)&0x03);
                canBody.setASRBrakeCcontrolStatus((canData[0]>>4)&0x03);
                canBody.setASREngineControlStatus((canData[0]>>6)&0x03);
                canBody.setBrakeLightSwitch(canData[1]&0x03);
                canBody.setVehicleType((canData[1]>>2)&0x03);
                canBody.setVDCActive((canData[1]>>4)&0x03);
                canBody.setServiceBrakeDemandPressure(intFromBytes(canData,2,2));
                canBody.setParkBrakeDemandRelativePressure(intFromBytes(canData,4,1));
                canBody.setRetarderDemandRelativePressure(intFromBytes(canData,5,1));
                canBody.setRelativeBrakeDemandFrontLeftSide(intFromBytes(canData,6,1));
                canBody.setRelativeBrakeDemandRearRightSide(intFromBytes(canData,7,1));
                body.setCanData(canBody);
                break;
            case 0x18FEC920:
                EBS12 canBody2=new EBS12();
//                canBody2.setCanTime(body.getCanTime());
                canBody2.setRetarderControlStatus(canData[0]&0x03);
                canBody2.setROPStatus((canData[0]>>2)&0x03);
                canBody2.setYCStatus((canData[0]>>4)&0x03);
                canBody2.setTrailerROPSystemRequest(canData[1]&0x03);
                canBody2.setTrailerYCSystemRequest((canData[1]>>2)&0x03);
                canBody2.setReverseGearStatus((canData[1]>>4)&0x03);
                canBody2.setEmergencyBrakingStatus((canData[1]>>6)&0x03);
                canBody2.setTwoElectricalCircuitsBrakeDemandStatus(canData[2]&0x03);
                canBody2.setABSOffroadRequest((canData[2]>>2)&0x03);
                canBody2.setPneumaticControlLineStatus((canData[2]>>4)&0x03);
                canBody2.setLoadProportionalFunctionInstallationStatus((canData[2]>>6)&0x03);
                canBody2.setRoadCurvature(intFromBytes(canData,4,2));
                canBody2.setBrakingSystemWheelbasedSpeed(intFromBytes(canData,6,2));
                body.setCanData(canBody2);
                break;

            case 0x0C0320C8:
                EBS21 canBody3=new EBS21();
//                canBody3.setCanTime(body.getCanTime());
                canBody3.setABSStatus(canData[0]&0x03);
                canBody3.setRetarderControlStatus((canData[0]>>2)&0x03);
                canBody3.setServiceBrakeStatus((canData[0]>>4)&0x03);
                canBody3.setAutomaticTowedVehicleBrakingStatus((canData[0]>>6)&0x03);
                canBody3.setVDCActive(canData[1]&0x03);
                canBody3.setSupportOfSideOrAxleWiseBrakeForceDistribution((canData[1]>>2)&0x03);
                canBody3.setBrakingSystemWheelBasedSpeed(intFromBytes(canData,2,2));
                canBody3.setRetarderRelativePeakTorque(intFromBytes(canData,4,1));
                canBody3.setWheelSpeedDifferenceMainAxle(intFromBytes(canData,5,2));
                canBody3.setLateralAcceleration(intFromBytes(canData,7,1));
                body.setCanData(canBody3);
                break;

            case 0x18FEC4C8:
                EBS22 canBody4=new EBS22();
//                canBody4.setCanTime(body.getCanTime());
                canBody4.setABSStatus(canData[0]&0x03);
                canBody4.setRetarderControlStatus((canData[0]>>2)&0x03);
                canBody4.setServiceBrakeStatus((canData[0]>>4)&0x03);
                canBody4.setAutomaticTowedVehicleBrakingStatus((canData[0]>>6)&0x03);
                canBody4.setElectricalSupplyStatus(canData[1]&0x03);
                canBody4.setRedWarningSignalRequest((canData[1]>>2)&0x03);
                canBody4.setAmberWarningSignalRequest((canData[1]>>4)&0x03);
                canBody4.setElectricalSupplyOfNonbrakingSystemStatus((canData[1]>>6)&0x03);
                canBody4.setSpringBrakeInstallationStatus(canData[2]&0x03);
                canBody4.setElectricalLoadProportionalFunctionInstallStatus((canData[2]>>2)&0x03);
                canBody4.setVehicleType((canData[2]>>4)&0x03);
                canBody4.setSpringBrakeStatus((canData[2]>>6)&0x03);
                canBody4.setLoadRampApproachAssistanceStatus(canData[3]&0x03);
                canBody4.setSupplyLineBraking((canData[3]>>2)&0x03);
                canBody4.setStopLampsRequest((canData[3]>>4)&0x03);
                canBody4.setBrakingViaElectricControlLineSupport((canData[3]>>6)&0x03);
                canBody4.setAxleLoadSum(intFromBytes(canData,4,2));
                canBody4.setRetarderReferenceTorque(intFromBytes(canData,6,2));
                body.setCanData(canBody4);
                break;
            case 0x18FEC6C8:
                EBS23 canBody5=new EBS23();
//                canBody5.setCanTime(body.getCanTime());
                canBody5.setTyrePressureStatus(canData[0]&0x03);
                canBody5.setBrakeLiningStatus((canData[0]>>2)&0x03);
                canBody5.setBrakeTemperatureStatus((canData[0]>>4)&0x03);
                canBody5.setPneumaticSupplyPressure((canData[0]>>6)&0x03);
                canBody5.setTyreIdentificationForTyrePressure(intFromBytes(canData,1,1));
                canBody5.setTyreIdentificationForBrakeLining(intFromBytes(canData,2,1));
                canBody5.setTyreIdentificationForBrakeTemperature(intFromBytes(canData,3,1));
                canBody5.setTyrePressure(intFromBytes(canData,4,1));
                canBody5.setBrakeLining(intFromBytes(canData,5,1));
                canBody5.setBrakeTemperature(intFromBytes(canData,6,1));
                canBody5.setPneumaticSupplyPressure(intFromBytes(canData,7,2));
                body.setCanData(canBody5);
                break;
            case 0x18FD9AC8:
                EBS24 canBody6=new EBS24();
//                canBody6.setCanTime(body.getCanTime());
                canBody6.setGeometricDataIndex(intFromBytes(canData,0,1));
                canBody6.setGeometricDataIndexContent(intFromBytes(canData,1,1));
                canBody6.setTowedDetectionStatus((canData[2]>>2)&0x15);
                canBody6.setVehicleCombinationABSStatus((canData[2]>>4)&0x03);
                body.setCanData(canBody6);
                break;
            case 0x18FEADC8:
                EBS25 canBody7=new EBS25();
//                canBody7.setCanTime(body.getCanTime());
                canBody7.setBrakeCylinderPressureFirstAxleLeftWheel(intFromBytes(canData,0,1));
                canBody7.setBrakeCylinderPressureFirstAxleRightWheel(intFromBytes(canData,1,1));
                canBody7.setBrakeCylinderPressureSecondAxleLeftWheel(intFromBytes(canData,2,1));
                canBody7.setBrakeCylinderPressureSecondAxleRightWheel(intFromBytes(canData,3,1));
                canBody7.setBrakeCylinderPressureThirdAxleLeftWheel(intFromBytes(canData,4,1));
                canBody7.setBrakeCylinderPressureThirdAxleRightWheel(intFromBytes(canData,5,1));
                canBody7.setROPSystemStatus(canData[6]&0x03);
                canBody7.setYCSystemStatus((canData[6]>>2)&0x03);
                canBody7.setExternalBrakeRequestStatus((canData[6]>>4)&0x03);
                body.setCanData(canBody7);
                break;
            case 0x0CFE6EC8:
                EBS26 canBody8=new EBS26();
//                canBody8.setCanTime(body.getCanTime());
                canBody8.setWheelSpeedFirstAxleLeftWheel(intFromBytes(canData,0,2));
                canBody8.setWheelSpeedFirstAxleRightWheel(intFromBytes(canData,2,2));
                body.setCanData(canBody8);
                break;
            case 0x18E4C820:
                RGE11 canBody9=new RGE11();
//                canBody9.setCanTime(body.getCanTime());
                canBody9.setRideHeightRequest(canData[0]&0x03);
                canBody9.setLevelChangeRequestFrontAxle((canData[0]>>2)&0x03);
                canBody9.setLevelChangeRequestRearAxle((canData[0]>>4)&0x03);
                canBody9.setTractionHelpRequest((canData[0]>>6)&0x03);
                canBody9.setLiftAxle1PositionRequest(canData[1]&0x03);
                canBody9.setLiftAxle2PositionRequest((canData[1]>>2)&0x03);
                canBody9.setSteeringAxleLockingRequest((canData[1]>>4)&0x03);
                canBody9.setRampLevelRequest((canData[1]>>6)&0x03);
                canBody9.setLevelControlRequest(canData[2]&0x03);
                canBody9.setRampLevelStorageRequest((canData[2]>>2)&0x03);
                canBody9.setStopLevelChangeRequest((canData[2]>>4)&0x03);
                canBody9.setRideHeightStorageRequest((canData[2]>>6)&0x03);
                canBody9.setDrivenAxleLoad(intFromBytes(canData,3,2));
                canBody9.setParkingAndTrailerAirPressure(intFromBytes(canData,5,1));
                canBody9.setAuxiliaryEquipmentSupplyPressure(intFromBytes(canData,6,1));
                canBody9.setLiftAxle3PositionRequest(canData[7]&0x03);
                canBody9.setLiftAxle4PositionRequest((canData[7]>>2)&0x03);
                canBody9.setLiftAxle5PositionRequest((canData[7]>>4)&0x03);
                canBody9.setRideHeightAndRampLevelSetRequest((canData[7]>>6)&0x03);
                body.setCanData(canBody9);
                break;
            case 0x188AC820:
                RGE12 canBody10=new RGE12();
//                canBody10.setCanTime(body.getCanTime());
                canBody10.setAxleLoadCalibrationDataStorageRequest(canData[0]&0x03);
                canBody10.setTyreWheelIdentification(intFromBytes(canData,1,1));
                canBody10.setAxleLoadMeasuredByExternScale(intFromBytes(canData,2,1));
                canBody10.setIdentificationDataIndex(intFromBytes(canData,4,1));
                canBody10.setIdentificationDataContent(intFromBytes(canData,5,1));
                body.setCanData(canBody10);
                break;
            case 0x18E520C8:
                RGE21 canBody11=new RGE21();
//                canBody11.setCanTime(body.getCanTime());
                canBody11.setRideHeightLevel(canData[0]&0x03);
                canBody11.setLevelControlStatus((canData[0]>>2)&0x03);
                canBody11.setTractionHelpStatus((canData[0]>>4)&0x03);
                canBody11.setRampLevelPosition((canData[0]>>6)&0x03);
                canBody11.setLiftAxle1Position(canData[1]&0x03);
                canBody11.setLiftAxle2Position((canData[1]>>2)&0x03);
                canBody11.setSteeringAxleLockingStatus((canData[1]>>4)&0x03);
                canBody11.setRideHeightStorage(canData[2]&0x03);
                canBody11.setRampLevelStorageStatus((canData[2]>>2)&0x03);
                canBody11.setLevelChangeStatusFrontAxle((canData[2]>>4)&0x03);
                canBody11.setLevelChangeStatusRearAxle((canData[2]>>6)&0x03);
                canBody11.setStopLevelChangeAcknowledge(canData[3]&0x03);
                canBody11.setNormalLevel((canData[3]>>2)&0x03);
                canBody11.setRampLevel((canData[3]>>4)&0x03);
                canBody11.setExtendedRideHeightAndRampLevelStorage((canData[3]>>6)&0x03);
                canBody11.setLevelChangeStatusFrontAxle(intFromBytes(canData,4,2));
                canBody11.setLevelChangeStatusRearAxle(intFromBytes(canData,6,2));
                body.setCanData(canBody11);
                break;
            case 0x18FE5CC8:
                RGE22 canBody12=new RGE22();
//                canBody12.setCanTime(body.getCanTime());
                canBody12.setRelativeBodyLevelFrontAxle(intFromBytes(canData,0,2));
                canBody12.setRelativeBodyLevelRearAxle(intFromBytes(canData,2,2));
                canBody12.setTyreIdentification(intFromBytes(canData,4,1));
                canBody12.setAxleLoad(intFromBytes(canData,5,2));
                body.setCanData(canBody12);
                break;
            case 0x18FE5EC8:
                RGE23 canBody13=new RGE23();
//                canBody13.setCanTime(body.getCanTime());
                canBody13.setTyreIdentification(intFromBytes(canData,0,1));
                canBody13.setTyreTemperature(intFromBytes(canData,1,2));
                canBody13.setAirLeakageDetection(intFromBytes(canData,3,2));
                canBody13.setTyrePressureThresholdDetection(canData[5]&0x07);
                canBody13.setTyreModulePowerSupplyStatus((canData[5]>>3)&0x03);
                canBody13.setIdentificationDataIndex(intFromBytes(canData,6,1));
                canBody13.setIdentificationDataContent(intFromBytes(canData,7,1));
                body.setCanData(canBody13);
                break;
            case 0x188920C8:
                RGE24 canBody14=new RGE24();
//                canBody14.setCanTime(body.getCanTime());
                canBody14.setTyreIdentification(intFromBytes(canData,0,1));
                canBody14.setAxleLoadMeasuredByTowedVehicle(intFromBytes(canData,1,2));
                canBody14.setAxleLoadMeasuredByExternalVehicle(intFromBytes(canData,3,2));
                canBody14.setAxleLoadCalibrationDataLoadLevel(canData[5]&0x03);
                canBody14.setAxleLoadCalibrationType((canData[5]>>2)&0x03);
                canBody14.setAxleLoadCalibrationDataStorage((canData[5]>>4)&0x03);
                canBody14.setYear(intFromBytes(canData,6,1));
                canBody14.setMonth(intFromBytes(canData,7,1));
                body.setCanData(canBody14);
                break;
            case 0x18FEE620:
                TDE11 canBody15=new TDE11();
//                canBody15.setCanTime(body.getCanTime());
                canBody15.setSeconds(intFromBytes(canData,0,1));
                canBody15.setMinutes(intFromBytes(canData,1,1));
                canBody15.setHours(intFromBytes(canData,2,1));
                canBody15.setDay(intFromBytes(canData,3,1));
                canBody15.setMonth(intFromBytes(canData,4,1));
                canBody15.setYear(intFromBytes(canData,5,1));
                canBody15.setLocalMinuteOffset(intFromBytes(canData,6,1));
                canBody15.setLocalHourOffset(intFromBytes(canData,7,1));
                body.setCanData(canBody15);
                break;
            default:
                log.info("收到未定义的CanID="+body.getCanID()+"的can报文");


        }



        return Optional.of(body);
    }
}

