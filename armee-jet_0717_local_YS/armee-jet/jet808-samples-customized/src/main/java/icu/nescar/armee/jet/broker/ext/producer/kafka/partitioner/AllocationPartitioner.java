package icu.nescar.armee.jet.broker.ext.producer.kafka.partitioner;

import org.apache.kafka.clients.producer.Partitioner;
import org.apache.kafka.common.Cluster;

import java.util.Map;

/**
 * 分区分配器
 * @author neyzoter
 */
public class AllocationPartitioner implements Partitioner {
    public AllocationPartitioner() {

    }
    @Override
    public void configure(Map<String, ?> configs) {
    }
    @Override
    public int partition(String topic, Object key, byte[] keyBytes, Object value, byte[] valueBytes, Cluster cluster) {
        int num = cluster.availablePartitionsForTopic(topic).size();
        int keyHash = key.hashCode();
        return keyHash % num;
    }
    @Override
    public void close () {

    }
}
