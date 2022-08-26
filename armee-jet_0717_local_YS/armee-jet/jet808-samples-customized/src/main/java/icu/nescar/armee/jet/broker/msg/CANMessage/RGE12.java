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
public class RGE12 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 5794952101293096066L;
    private int axleLoadCalibrationDataStorageRequest;
    private int tyreWheelIdentification;
    private int axleLoadMeasuredByExternScale;
    private int identificationDataIndex;
    private int identificationDataContent;
    private byte[] canTime;
}

