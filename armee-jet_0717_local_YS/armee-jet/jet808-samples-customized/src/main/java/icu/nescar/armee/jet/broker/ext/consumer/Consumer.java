package icu.nescar.armee.jet.broker.ext.consumer;

import java.time.Duration;

/**
 * 消费者
 * @author neyzoter
 */
public interface Consumer<T> extends Runnable{

    /**
     * 接收数据
     * @param t 持续时间
     * @return 接收到的数据
     */
    Iterable<T> receive(Duration t);
}
