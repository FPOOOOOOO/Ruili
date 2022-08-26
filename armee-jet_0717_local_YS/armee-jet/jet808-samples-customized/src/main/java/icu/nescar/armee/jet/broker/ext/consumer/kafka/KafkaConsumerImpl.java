package icu.nescar.armee.jet.broker.ext.consumer.kafka;

import icu.nescar.armee.jet.broker.ext.conf.ConfArguments;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import icu.nescar.armee.jet.broker.ext.consumer.Consumer;
import icu.nescar.armee.jet.broker.ext.producer.MsgKey;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKeyDeserializer;
import jdk.nashorn.internal.runtime.regexp.joni.constants.Arguments;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.*;
import org.apache.kafka.common.PartitionInfo;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.TimeoutException;
import org.apache.kafka.common.serialization.ByteArrayDeserializer;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.*;

/**
 * Kafka消费者
 * @author neyzoter
 */
@Slf4j
public class KafkaConsumerImpl<T extends ConsumerRecord<MsgKey, byte[]>> implements Consumer<ConsumerRecord<MsgKey, byte[]>> {
    /**
     * Kafka消费者
     */
    protected KafkaConsumer<MsgKey, byte[]> consumer;

    /**
     * url
     */
    protected String url;
    /**
     * 端口
     */
    protected String port;
    /**
     * 节点名称
     */
    protected String broker;
    /**
     * 主题
     */
    protected String topic;
    /**
     * 结束运行
     */
    protected boolean shutdown;

    public KafkaConsumerImpl() {
        this(ConfArguments.KAFKA_TOPIC_CMD,"default","default");
    }
    /**
     * 设置Kafka Consumer
     * @param topic 主题
     * @param CgName 消费者组
     */
    public KafkaConsumerImpl(String topic, String CgName, String consumerId) {
        shutdown = false;
        url = System.getProperty(VmOptions.KAFKA_CONSUMER_SERVER_URL);
        port = System.getProperty(VmOptions.KAFKA_CONSUMER_SERVER_PORT);

        broker = System.getProperty(VmOptions.BROKER_ID);
        Properties props = new Properties();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, url + ":" + port);
        // 每个broker都需要不相同
        // 否则会出现多个broker只能消费一部分数据的情况
        props.put(ConsumerConfig.GROUP_ID_CONFIG, CgName);
        // 启动手动
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, "true");
//        props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, "1000");
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, KafkaMsgKeyDeserializer.class.getName());
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, ByteArrayDeserializer.class.getName());
        props.put(ConsumerConfig.CLIENT_ID_CONFIG, CgName + broker + consumerId);
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG,"300");

        consumer = new KafkaConsumer<>(props);
        this.topic = topic;
        // 会rebalance消费者，所以分区是不确定的
        // 我的理解：consumer就无法使用seekToEnd 或者 seekToBeginng
        consumer.subscribe(Collections.singletonList(topic));

        List<PartitionInfo> piSet = consumer.partitionsFor(topic);
        List<TopicPartition> tpList = new ArrayList<>(piSet.size());
        for (PartitionInfo pi : piSet) {
            tpList.add(new TopicPartition(pi.topic(), pi.partition()));
        }
        log.info(String.format("KafkaConsumerImpl : [%s   %s   %s]", topic, CgName, consumerId));
//        consumer.assign(tpList);
////         如果宕机，则需要恢复到offset
//        resetConsumer();
    }

    @Override
    public Iterable<ConsumerRecord<MsgKey, byte[]>> receive(Duration t) {
        return consumer.poll(t);
    }

    @Override
    public void run() {
        while (!shutdown) {
            long startMs = System.currentTimeMillis() / 1000;
            log.info("start : " + startMs);
            ConsumerRecords<MsgKey, byte[]> records = (ConsumerRecords<MsgKey, byte[]>) receive(Duration.ofSeconds(5));
            /**
             * 手动控制offset
             * 当宕机后，等待consumer重启，则通过seek(TopicPartition, long)来恢复到之前的offset
             */
            // 分别对每个partition进行操作
            for (TopicPartition partition : records.partitions()) {
                List<ConsumerRecord<MsgKey, byte[]>> partitionRecords = records.records(partition);
                for (ConsumerRecord<MsgKey, byte[]> record : partitionRecords) {
                    System.out.println("[ " + broker + " ] Received message: (" + record.key() + ", " + Arrays.toString(record.value()) + ") at offset " + record.offset() + " from partition " + record.partition() +
                            " in " + (int) (System.currentTimeMillis() / 1000 - startMs) + " ms");
                }
                // 获取最近的offset
                long lastOffset = partitionRecords.get(partitionRecords.size() - 1).offset();
                // 提交offset
                try {
                    System.out.println("Start sending offset [ " + lastOffset + " ]");
                    consumer.commitSync(Collections.singletonMap(partition, new OffsetAndMetadata(lastOffset + 1)), Duration.ofSeconds(2));
                    System.out.println("Sent offset successfully");
                } catch (TimeoutException te) {
                    te.printStackTrace();
                }
            }
       }
    }

    /**
     * 重新设置消费者
     */
    public void resetConsumer () {
        // 获取所有的partition
        List<PartitionInfo> partitionInfos = consumer.partitionsFor(topic);
        List<TopicPartition> topicPartitions = new ArrayList<>(partitionInfos.size());
        for (PartitionInfo pi : partitionInfos) {
            topicPartitions.add(new TopicPartition(pi.topic(), pi.partition()));

        }
        // 设置offset
        // TODO 将offset保存到数据库中，从数据库中读取
//        consumer.seek(PartitionInfo, Offset);

        // 从Kafka当前保存的最新数据开始
//        consumer.seekToBeginning(topicPartitions);
        // 从Kafka最新的数据开始
        consumer.seekToEnd(topicPartitions);
    }

}
