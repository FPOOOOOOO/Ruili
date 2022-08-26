package icu.nescar.armee.jet.broker.ext.producer;

import java.io.Serializable;

/**
 * 消息的key
 * @author neyzoter
 */
public interface MsgKey extends Serializable {
    String getTerminalId();
    int getMsgId();
}
