package icu.nescar.armee.jet.broker.util;

import io.github.hylexus.jt808.codec.BytesEncoder;
import io.github.hylexus.jt808.msg.RequestMsgHeader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @Auther whale
 * @Date 2021/5/11
 * 检查校验码
 */
@Slf4j
@Component
public class CheckSum {
     @Autowired
    BytesEncoder bytesEncoder;
    public boolean validateCheckSum(byte[] bytes, RequestMsgHeader msgHeader, byte checkSumInPkg) {
        final int calculatedCheckSum = this.bytesEncoder.calculateCheckSum(bytes, 0, bytes.length - 1);
        if (checkSumInPkg != calculatedCheckSum) {
            log.warn("检验码不一致,msgId:{},actual : {},expected : {}", msgHeader.getMsgId(), checkSumInPkg, calculatedCheckSum);
            return false;
        }
        return true;
    }
}

