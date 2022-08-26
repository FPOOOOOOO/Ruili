package icu.nescar.armee.jet.broker.msg.comd;

import io.github.hylexus.jt.annotation.msg.resp.CommandField;
import io.github.hylexus.jt.annotation.msg.resp.Jt808RespMsgBody;
import io.github.hylexus.jt.data.resp.BytesValueWrapper;
import lombok.Data;
import lombok.experimental.Accessors;

import java.io.Serializable;
import java.util.List;

import static io.github.hylexus.jt.data.MsgDataType.BYTE;
import static io.github.hylexus.jt.data.MsgDataType.DWORD;

/**
 * @author hylexus
 * Created At 2019-10-16 10:43 下午
 * 设置终端参数的下发消息体
 * @write by whale
 * 设置终端参数是jt808协议里面的内容
 * 但目前瑞立终端参数是本地写死 不是由云端下发 所以没有用到
 */
@Data
@Accessors(chain = true)
@Jt808RespMsgBody(respMsgId = 0x8103, desc = "设置终端参数")
public class TerminalSettingsMsgBody implements Serializable {
    private static final long serialVersionUID = -7832581497643729797L;
    //参数总数
    @CommandField(order = 1, targetMsgDataType = BYTE)
    private int totalParamCount;

    //参数项列表
    @CommandField(order = 2)
    private List<ParamItem> paramList;


    //参数项格式
    @Data
    @Accessors(chain = true)
    @SuppressWarnings("rawtypes")
    public static class ParamItem {
        @CommandField(order = 1, targetMsgDataType = DWORD)
        private int msgId;//参数ID

        @CommandField(order = 2, targetMsgDataType = BYTE)
        private int bytesCountOfContentLength;//参数长度

        @CommandField(order = 3)
        private BytesValueWrapper msgContent;//参数值 是封装类 无论哪种数据类型都可以封装成字节数组

        public ParamItem(int msgId, BytesValueWrapper msgContent) {
            this.msgId = msgId;
            this.msgContent = msgContent;
            this.bytesCountOfContentLength = msgContent.getAsBytes().length;
        }
    }

}
