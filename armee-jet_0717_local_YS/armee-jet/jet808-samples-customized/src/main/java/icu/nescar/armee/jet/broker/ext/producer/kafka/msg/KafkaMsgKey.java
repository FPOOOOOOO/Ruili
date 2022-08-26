package icu.nescar.armee.jet.broker.ext.producer.kafka.msg;

import icu.nescar.armee.jet.broker.ext.producer.MsgKey;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.io.Serializable;

/**
 * Kafka消息的key
 * @author neyzoter
 */
@Getter
@Setter
@ToString
public class KafkaMsgKey implements Serializable, MsgKey {
    private static final long serialVersionUID = 8445397571181027199L;
    private String terminalId;
    private int msgId;

    /**
     *
     * @param tid 终端ID
     * @param mid 消息ID
     */
    public KafkaMsgKey(String tid, int mid){
        terminalId = tid;
        msgId = mid;
    }
}
