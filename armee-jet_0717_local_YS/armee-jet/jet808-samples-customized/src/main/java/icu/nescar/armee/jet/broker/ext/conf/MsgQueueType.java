package icu.nescar.armee.jet.broker.ext.conf;

import lombok.Getter;

/**
 * 消息中间件类型
 * @author neyzoter
 */
@Getter
public enum MsgQueueType {
    /**
     * kafka
     */
    KAFKA("Kafka", "kafka");

    private final String desc;
    private final String name;

    MsgQueueType(String desc, String name) {
        this.desc = desc;
        this.name = name;
    }
}
