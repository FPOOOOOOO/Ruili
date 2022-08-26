package icu.nescar.armee.jet.broker.config;

import lombok.Getter;
import lombok.ToString;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

/**
 * @Auther whale
 * @Date 2021/4/28
 */
@Getter
@ToString
public enum CANMsgType {


    EBS11(0x0C02C820),
    EBS12(0x18FEC920),
    RGE11(0x18FEC920),
    RGE12(0x188AC820),
    EBS21(0x0C0320C8),
    EBS22(0x18FEC4C8),
    EBS23(0x18FEC6C8),
    EBS24(0x18FD9AC8),
    EBS25(0x18FEADC8),
    EBS26(0x0CFE6EC8),
    RGE21(0x18E520C8),
    RGE22(0x18FE5CC8),
    RGE23(0x18FE5EC8),
    RGE24(0x188920C8),
    TDE11(0x18FEE620),


    ;
    private final int msgId;

    CANMsgType(int msgId) {
        this.msgId = msgId;
    }

    private static final Map<Integer, CANMsgType> mapping = new HashMap<>(values().length);

    static {
        for (CANMsgType type : values()) {
            mapping.put(type.msgId, type);
        }
    }


    public Optional<CANMsgType> parseFromInt(int msgId) {
        return Optional.ofNullable(mapping.get(msgId));
    }
    //指定msgId返回mapping中存储的对应id对象，如果是null的话返回空值
}

