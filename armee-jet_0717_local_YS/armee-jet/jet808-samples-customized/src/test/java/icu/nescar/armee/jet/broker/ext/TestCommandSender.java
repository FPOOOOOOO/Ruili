package icu.nescar.armee.jet.broker.ext;

import icu.nescar.armee.jet.broker.msg.comd.AuthInfoSettingsMsgBody;
import io.github.hylexus.jt808.dispatcher.CommandSender;
import io.github.hylexus.jt808.dispatcher.impl.AbstractCommandSender;
import io.github.hylexus.jt808.msg.resp.CommandMsg;
import io.github.hylexus.jt808.session.Jt808SessionManager;
import org.springframework.beans.factory.annotation.Autowired;


import java.io.IOException;

import static icu.nescar.armee.jet.broker.config.Jt808MsgType.CLIENT_COMMON_REPLY;

/**
 * @Auther whale
 * @Date 2021/1/15
 */
public class TestCommandSender {

    private AbstractCommandSender commandSender;
    private Jt808SessionManager sessionManager;


    private AuthInfoSettingsMsgBody authInfo;
    String terminalId = "799383947";
    Long timeout = 5L;




    //设置具体的下发信息内容

    CommandMsg commandMsg = CommandMsg.of(terminalId, CLIENT_COMMON_REPLY, authInfo);


}


