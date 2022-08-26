package icu.nescar.armee.jet.broker.ext.producer.kafka.msg;

import icu.nescar.armee.jet.broker.util.SerializationUtil;
import org.apache.kafka.common.serialization.Deserializer;

import java.util.Map;

/**
 * Kafka消费者
 */
public class KafkaMsgKeyDeserializer implements Deserializer<KafkaMsgKey> {
    @Override
    public void configure(Map<String, ?> map, boolean b) {
        // do nothing
    }

    @Override
    public KafkaMsgKey deserialize(String s, byte[] bytes) {
        try {
            return (KafkaMsgKey) SerializationUtil.deserialize(bytes);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    @Override
    public void close() {
        // do nothing
    }
}
