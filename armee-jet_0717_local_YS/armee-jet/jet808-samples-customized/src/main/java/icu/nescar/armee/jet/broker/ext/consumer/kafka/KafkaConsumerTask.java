package icu.nescar.armee.jet.broker.ext.consumer.kafka;

import com.mysql.cj.util.TimeUtil;
import icu.nescar.armee.jet.broker.ext.consumer.Consumer;
import icu.nescar.armee.jet.broker.ext.producer.MsgKey;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.stereotype.Component;

import java.util.concurrent.*;

/**
 * @Auther whale
 * @Date 2020/11/26
 * 利用线程池执行consumer的任务
 */
@Component
public class KafkaConsumerTask {
    Consumer<ConsumerRecord<MsgKey, byte[]>> consumer;
    ExecutorService ses;
    @Autowired
    public KafkaConsumerTask(JetConsumerImpl jetConsumerImpl) {
        consumer = jetConsumerImpl;
        ses = new ThreadPoolExecutor(1, 2, 1, TimeUnit.SECONDS, new LinkedBlockingDeque<>());
        ses.submit(consumer);
    }
}

