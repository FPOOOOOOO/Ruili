package icu.nescar.armee.jet.broker.ext.consumer.kafka;

import com.google.errorprone.annotations.Var;
import icu.nescar.armee.jet.broker.ext.conf.ConfArguments;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import icu.nescar.armee.jet.broker.ext.producer.MsgKey;
import icu.nescar.armee.jet.broker.msg.comd.AuthInfoSettingsMsgBody;
import icu.nescar.armee.jet.broker.msg.comd.TerminalSettingsMsgBody;
import icu.nescar.armee.jet.broker.util.SerializationUtil;
import io.github.hylexus.jt808.dispatcher.CommandSender;
import io.github.hylexus.jt808.msg.resp.CommandMsg;
import io.github.hylexus.jt808.session.Jt808SessionManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.clients.consumer.ConsumerRecords;
import org.apache.kafka.clients.consumer.OffsetAndMetadata;
import org.apache.kafka.common.TopicPartition;
import org.apache.kafka.common.errors.TimeoutException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import static icu.nescar.armee.jet.broker.config.Jt808MsgType.CLIENT_COMMON_REPLY;

/**
 * @Auther whale
 * @Date 2020/11/26
 * jet协议的kafka消费者实例
 * 重写run函数 在里面进行数据的下发
 */
@Slf4j
@Component
public class JetConsumerImpl extends KafkaConsumerImpl<ConsumerRecord<MsgKey, byte[]>> {


    CommandMsg commandLockAuthMsg = null;
    CommandMsg commandTerminalMsg =null;
    int flag=0;
    /**
     * Kafka消费者实例
     *
     * @param t topic
     * 设置Kafka Consumer
     */
    public JetConsumerImpl(String t,String cg,String ct) {
        super(t,cg,ct);
    }
    public static String cgName=System.getProperty(VmOptions.KAFKA_CONSUMER_GROUP_ID);
    public static String consumerId=System.getProperty(VmOptions.KAFKA_CONSUMER_ID);

    public JetConsumerImpl() {
        super(ConfArguments.KAFKA_TOPIC_CMD,cgName,consumerId);
    }
    public Long timeout;

    @Autowired
    private CommandSender commandSender;

    @Autowired
    private Jt808SessionManager sessionManager;

    public static ExecutorService threadPool= Executors.newFixedThreadPool(5);

    @Override
    public void run(){
        while (true) {
            long startMs = System.currentTimeMillis() / 1000;
            //log.info("start : " + startMs);
            //当终端存在连接时，下发。否则无法发送

            ConsumerRecords<MsgKey, byte[]> records = (ConsumerRecords<MsgKey, byte[]>) receive(Duration.ofSeconds(1));
            timeout=VmOptions.TIME_OUT;
            //重试发送消息的最大次数
//            int maxTry=5;
            for (ConsumerRecord<MsgKey, byte[]> record : records) {
                String terminalId = record.key().getTerminalId();
                AuthInfoSettingsMsgBody lockInfo = (AuthInfoSettingsMsgBody) SerializationUtil.deserialize(record.value());//设置具体的下发信息内容
                commandLockAuthMsg = CommandMsg.of(terminalId, CLIENT_COMMON_REPLY, lockInfo);
                log.info("收到平台的授权消息:" + commandLockAuthMsg.toString() + ";body:" + commandLockAuthMsg.getBody());

                if (sessionManager.findByTerminalId(terminalId).isPresent()) {
                            if (record.key().getMsgId() == 0x8F00) {//msgid是授权消息下发
//                                for(int i=0;i<maxTry;i++){
//                                    authCommandSend(terminalId,record);}
//                                if(flag==0){
//                                log.info("重试五次，但下发消息依旧失败，停止发送");}
                                //收到授权信息 直接下发，不等待回复。
                              try {
                                    commandSender.sendCommand(commandLockAuthMsg);
                                    log.info("下发授权消息成功");
                                } catch (InterruptedException e) {
                                    e.printStackTrace();
                                } catch (IOException e) {
                                    e.printStackTrace();
                                }
                            }
                        } else {
                            log.info("收到平台下发信息，但无法发送，由于该终端:{},未连接", terminalId);
                        }
                    }
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
    //下发授权消息给终端 且等待回复
    public void authCommandSend(String terminalId,ConsumerRecord<MsgKey, byte[]> record){

        AuthInfoSettingsMsgBody lockInfo = (AuthInfoSettingsMsgBody) SerializationUtil.deserialize(record.value());//设置具体的下发信息内容
        if (commandLockAuthMsg==null){
            commandLockAuthMsg = CommandMsg.of(terminalId, CLIENT_COMMON_REPLY, lockInfo);
        }
        log.info("收到平台的授权消息:" + commandLockAuthMsg.toString() + ";body:" + commandLockAuthMsg.getBody());
        Object resp = null;
        try {
            resp = commandSender.sendCommandAndWaitingForReply(commandLockAuthMsg, timeout, TimeUnit.SECONDS);
            if (resp != null) {
                log.info("下发授权消息成功，并收到回复resp: {}", resp);
                flag=1;
                commandLockAuthMsg = null;
            }else {
                log.info("下发授权信息失败，重新尝试下发");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}

