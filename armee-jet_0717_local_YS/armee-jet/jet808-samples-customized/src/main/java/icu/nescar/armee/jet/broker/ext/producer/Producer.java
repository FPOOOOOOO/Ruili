package icu.nescar.armee.jet.broker.ext.producer;

/**
 * 生产者，生产消息到外部
 * @author neyzoter
 */
public interface Producer<K, V> {

    /**
     * 发送消息
     * @param key 键
     * @param value 数据
     */
    void send(K key, V value);
}
