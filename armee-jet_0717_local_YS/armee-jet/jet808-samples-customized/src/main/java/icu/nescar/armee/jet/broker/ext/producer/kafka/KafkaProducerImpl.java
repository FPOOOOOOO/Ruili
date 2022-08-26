package icu.nescar.armee.jet.broker.ext.producer.kafka;

import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import icu.nescar.armee.jet.broker.ext.producer.MsgKey;
import icu.nescar.armee.jet.broker.ext.producer.Producer;
import icu.nescar.armee.jet.broker.ext.producer.kafka.msg.KafkaMsgKeySerializer;
import icu.nescar.armee.jet.broker.util.SerializationUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.producer.*;
import org.apache.kafka.common.serialization.ByteArraySerializer;

import java.util.HashSet;
import java.util.Properties;
import java.util.Set;
import java.util.concurrent.locks.ReentrantLock;

/**
 * Kafka生产者
 * <pre>
 *     kafka cmd : ./bin/kafka-console-consumer.sh --bootstrap-server=localhost:9092 --topic=Data --group=123
 * </pre>
 * @author neyzoter
 */
@Slf4j
public class KafkaProducerImpl<K extends MsgKey, V> implements Producer<K, V> {
    /**
     * producer线程安全
     */
    protected KafkaProducer<K, byte[]> producer;
    /**
     * 主题
     */
    protected String topic;
    /**
     * 同步或者异步
     */
    protected Boolean isAsync;
    /**
     * 节点名称
     */
    public String broker;
    /**
     * kafka url
     */
    public String url;
    /**
     * kafka 端口
     */
    public String port;
    /**
     * 生产者字符Id，用于唯一标示一个生产者
     */
    protected String producerStrId;
    /**
     * 生产者分割符
     */
    protected static final String producerSpliter = "_";
    /**
     * 生产者Id，随着生产者个数增多而增加
     */
    protected static int producerId = 0;
    /**
     * 用于保护static变量
     */
    protected static final ReentrantLock staticLock = new ReentrantLock();
    /**
     * broker集合
     */
    protected static final Set<String> producerSet = new HashSet<>();
    /**
     * 最大生产者ID
     */
    public static final int MAX_PRODUCER_ID = 100;

    /**
     * Kafka生产者实例
     * @param topic 主题
     * @param isAsync 是否异步
     */
    public KafkaProducerImpl(String topic, Boolean isAsync) {
        // 保护静态变量
        staticLock.lock();
        try {
            // TODO 将Kafka的参数设计为可配置
            url = System.getProperty(VmOptions.KAFKA_PRODUCER_SERVER_URL);
            port = System.getProperty(VmOptions.KAFKA_PRODUCER_SERVER_PORT);
            broker = System.getProperty(VmOptions.BROKER_ID);
            // 判断生产者是否已经存在
            int tryTime = 0;
            do {
                // 尝试次数过多
                if (tryTime > 2 * MAX_PRODUCER_ID) {
                    throw new Exception("Cannot Find producerStrId");
                }
                producerStrId = getPdStrId();
                tryTime ++;
            } while (producerStrId == null || producerSet.contains(producerStrId));
            if (url == null || port == null || producerStrId.split(producerSpliter).length == 1) {
                System.err.println("Kafka Error : No Url or Port or producerStrId");
            }
            Properties props = new Properties();
            // 判别请求是否为完整的条件，是否成功发送
            props.put(ProducerConfig.ACKS_CONFIG, "all");
            // 如果请求失败，生产者自动重试，这里设置重试次数为5
            props.put(ProducerConfig.RETRIES_CONFIG, 5);
            // 设置分区未发送的消息个数，每个分区都会对应一个缓存区来存储这些消息
            props.put(ProducerConfig.BATCH_SIZE_CONFIG, 1000);
            // 生产者在发送请求前等待一段时间，希望更多的消息填补到未满得到批中
            // 此处设置500ms发送一次，则在数据存储到缓存区后，会等待500ms
            // 不过也不绝对，如果缓存区中已经有其他的消息，可能跟着其他的消息一块发出去了
            props.put(ProducerConfig.LINGER_MS_CONFIG, 0);
            // 生产者可用的缓存总量，如果消息发送速度比其传输到服务器的快，
            // 将会耗尽这个缓存空间。当缓存空间耗尽，其他发送调用将被阻塞，
            // 阻塞时间的阈值通过max.block.ms设定，之后它将抛出一个TimeoutException。
            props.put(ProducerConfig.BUFFER_MEMORY_CONFIG, 2048000);
            props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, url + ":" + port);
            props.put(ProducerConfig.CLIENT_ID_CONFIG, producerStrId);
            props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, KafkaMsgKeySerializer.class.getName());
            props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, ByteArraySerializer.class.getName());
            props.put(ProducerConfig.PARTITIONER_CLASS_CONFIG, "icu.nescar.armee.jet.broker.ext.producer.kafka.partitioner.AllocationPartitioner");
            producer = new KafkaProducer<>(props);
            // 添加该broker名称
            producerSet.add(producerStrId);
            log.info("创建新的生产者 ： " + producerId);
            this.topic = topic;
            this.isAsync = isAsync;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if(staticLock.isHeldByCurrentThread()) {
                staticLock.unlock();
            }
        }
    }
    @Override
    public void send(K key, V value) {
        try {
            byte[] byteV = SerializationUtil.serialize(value);
            ProducerRecord<K, byte[]> record = new ProducerRecord<>(topic, key, byteV);
            // 异步
            if (isAsync) {
                // 实际上send就是一个异步发送的函数，只是send可以有回调函数
                // 如果回调函数会占用较多的CPU资源，建议在回调函数中创建线程执行
                producer.send(record, new DemoCallBack(System.currentTimeMillis(), key, value));
            // 同步
            } else {
                producer.send(record).get();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void finalize() {
        // 断开连接
        producer.close();
        // 每次该对象被回收时，需要将producerStrId回收
        producerSet.remove(this.producerStrId);
    }

    /**
     * 获取producerStrId<br>
     * producerId自增
     * @return producerStrId
     * @throws Exception GetPdStrId Error
     */
    public String getPdStrId() throws Exception{
        staticLock.lock();
        try {
            String pdStrId = broker + producerSpliter + producerId;
            // producerId自增
            producerId = ++producerId < MAX_PRODUCER_ID ? producerId : 0;
            return pdStrId;
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            if (staticLock.isHeldByCurrentThread()) {
                staticLock.unlock();
            }
        }
        throw new Exception("GetPdStrId Error");
    }
}

class DemoCallBack implements Callback {

    private final long startTime;
    private final MsgKey key;
    private final Object message;

    public DemoCallBack(long startTime, MsgKey key, Object message) {
        this.startTime = startTime;
        this.key = key;
        this.message = message;
    }

    /**
     * A callback method the user can implement to provide asynchronous handling of request completion. This method will
     * be called when the record sent to the server has been acknowledged. When exception is not null in the callback,
     * metadata will contain the special -1 value for all fields except for topicPartition, which will be valid.
     *
     * @param metadata  The metadata for the record that was sent (i.e. the partition and offset). Null if an error
     *                  occurred.
     * @param exception The exception thrown during processing of this record. Null if no error occurred.
     */
    @Override
    public void onCompletion(RecordMetadata metadata, Exception exception) {
        long elapsedTime = System.currentTimeMillis() - startTime;
        if (metadata != null) {
            System.out.println(
                    "message(" + key + ", " + message + ") sent to partition(" + metadata.partition() +
                            "), " +
                            "offset(" + metadata.offset() + ") in " + elapsedTime + " ms");
        } else {
            exception.printStackTrace();
        }
    }
}

