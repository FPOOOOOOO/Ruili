package icu.nescar.armee.jet.broker.ext.producer.kafka;

import icu.nescar.armee.jet.broker.ext.conf.ConfArguments;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKey;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

/**
 * 测试Kafka
 * @author neyzoter
 */
public class TestKafkaProducer {
    @Before
    public void init() {
        System.out.println("KafkaProducer 开始测试-----------------");
    }
    @Test
    public void testKafkaProducer(){
        Producer<KafkaMsgKey, Object> implSync = new KafkaProducerImpl<>(ConfArguments.KAFKA_TOPIC_DATA, false);
        Producer<KafkaMsgKey, Object> implAsync = new KafkaProducerImpl<>(ConfArguments.KAFKA_TOPIC_DATA, true);
        KafkaMsgKey key = new KafkaMsgKey("client1", 0x8001);
        String msg = "Msg Sended!";
        implAsync.send(key, msg);
        implSync.send(key, msg);

    }
    @After
    public void after() {
        System.out.println("KafkaProducer 测试结束-----------------");
    }
}
