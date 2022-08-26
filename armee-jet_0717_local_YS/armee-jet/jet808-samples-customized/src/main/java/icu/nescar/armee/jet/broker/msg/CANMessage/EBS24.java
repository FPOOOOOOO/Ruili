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
public class EBS24 implements CANMsgBody, Serializable {
    private static final long serialVersionUID = 9079893859464007555L;
    private int geometricDataIndex;
    private int geometricDataIndexContent;
    private int towedDetectionStatus;
    private int vehicleCombinationABSStatus;
    private byte[] canTime;
}

