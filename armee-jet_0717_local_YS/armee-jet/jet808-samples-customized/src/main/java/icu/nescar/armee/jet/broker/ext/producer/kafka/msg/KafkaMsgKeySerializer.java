package icu.nescar.armee.jet.broker.ext.producer.kafka.msg;

import icu.nescar.armee.jet.broker.util.SerializationUtil;
import org.apache.kafka.common.serialization.Serializer;

import java.util.Map;

/**
 * Kafka消息key序列化器
 * @author neyzoter
 */
public class KafkaMsgKeySerializer implements Serializer<KafkaMsgKey> {
    @Override
    public void configure(Map<String, ?> map, boolean b) {
        // do nothing
    }

    @Override
    public byte[] serialize(String s, KafkaMsgKey key) {
        try{
            return SerializationUtil.serialize(key);
        }catch (Exception e){
            e.printStackTrace();
        }
        return new byte[0];
    }

    @Override
    public void close() {
        // do nothing
    }
}
