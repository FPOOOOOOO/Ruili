package icu.nescar.armee.jet.broker.ext.producer.kafka;

import icu.nescar.armee.jet.broker.ext.conf.ConfArguments;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKey;

/**
 * @Auther whale
 * @Date 2021/3/17
 * 设备信息的生产者单例
 * 非时序数据
 */
public class KafkaProducerStatic2 {
    protected static volatile Producer<KafkaMsgKey, Object> producer;
    public static Producer<KafkaMsgKey, Object> getDeviceInstance() {
        if (producer == null) {
            synchronized (KafkaProducerStatic.class) {
                if(producer == null) {
                    producer = new KafkaProducerImpl<>(ConfArguments.KAFKA_TOPIC_DEVICE, false);
                }
            }
        }
        return producer;
    }
}

