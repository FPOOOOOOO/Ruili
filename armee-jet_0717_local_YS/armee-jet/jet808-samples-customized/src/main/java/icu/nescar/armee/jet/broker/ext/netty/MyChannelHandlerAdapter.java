package icu.nescar.armee.jet.broker.ext.netty;

import io.github.hylexus.jt.data.msg.MsgType;
import io.github.hylexus.jt.utils.HexStringUtils;
import io.github.hylexus.jt808.converter.MsgTypeParser;
import io.github.hylexus.jt808.dispatcher.RequestMsgDispatcher;
import io.github.hylexus.jt808.msg.RequestMsgHeader;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.RequestMsgWrapper;
import io.github.hylexus.jt808.session.Jt808SessionManager;

import io.github.hylexus.jt808.support.netty.Jt808ChannelHandlerAdapter;
import io.netty.channel.ChannelHandler;
import io.netty.channel.ChannelHandlerContext;
import io.netty.util.ReferenceCountUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;


import java.lang.reflect.InvocationTargetException;
import java.util.Optional;


@Component
@ChannelHandler.Sharable
public class MyChannelHandlerAdapter extends Jt808ChannelHandlerAdapter {
    private static final Logger log = LoggerFactory.getLogger("my.channel.handler.adapter");
    private final RequestMsgDispatcher msgDispatcher;
    private final MsgTypeParser msgTypeParser;
    private final Jt808SessionManager sessionManager;

    public MyChannelHandlerAdapter(RequestMsgDispatcher msgDispatcher, MsgTypeParser msgTypeParser, Jt808SessionManager sessionManager) {
        super(msgDispatcher, msgTypeParser, sessionManager);
        this.sessionManager = sessionManager;
        this.msgDispatcher = msgDispatcher;
        this.msgTypeParser = msgTypeParser;
    }
//    public Jt808ChannelHandlerAdapter(RequestMsgDispatcher msgDispatcher, MsgTypeParser msgTypeParser, Jt808SessionManager sessionManager) {
//        super(msgDispatcher, msgTypeParser, sessionManager);
//    }


    public void channelRead(ChannelHandlerContext ctx, Object msg) throws Exception {
        try {
            if (!(msg instanceof RequestMsgMetadata)) {
                return;
            }

            RequestMsgMetadata metadata = (RequestMsgMetadata)msg;
            RequestMsgHeader header = metadata.getHeader();
            int msgId = header.getMsgId();
            Optional<MsgType> msgType = this.msgTypeParser.parseMsgType(msgId);


            if (msgType.isPresent()) {
                metadata.setMsgType((MsgType)msgType.get());
                String terminalId = header.getTerminalId();
                if(msgId==0x102){
                    log.debug("[decode] : {}, terminalId={}, msg = {}", new Object[]{msgType.get(), terminalId, metadata});
                    RequestMsgWrapper requestMsgWrapper = (new RequestMsgWrapper()).setMetadata(metadata);
                    this.sessionManager.persistenceIfNecessary(terminalId, ctx.channel());
                    this.msgDispatcher.doDispatch(requestMsgWrapper);
                    return;
                }
                else {
                    if( sessionManager.findByTerminalId(header.getTerminalId(),true).isPresent())
                    { log.debug("[decode] : {}, terminalId={}, msg = {}", new Object[]{msgType.get(), terminalId, metadata});
                        RequestMsgWrapper requestMsgWrapper = (new RequestMsgWrapper()).setMetadata(metadata);
                        this.sessionManager.persistenceIfNecessary(terminalId, ctx.channel());
                        this.msgDispatcher.doDispatch(requestMsgWrapper);
                        return;}
                    else {
                        sessionManager.removeBySessionId(sessionManager.generateSessionId(ctx.channel()));
                        log.info("terminalId={}的终端未经过鉴权或鉴权未通过",terminalId);
                    }

                }
            }
            log.warn("received unknown msg, msgId = {}({}). ignore.", msgId, HexStringUtils.int2HexString(msgId, 4));
        } catch (InvocationTargetException var13) {
            log.error("InvocationTargetException", var13);
            throw var13;
        } catch (Throwable var14) {
            log.error(var14.getMessage(), var14);
            throw var14;
        } finally {
            ReferenceCountUtil.release(msg);
        }

    }
}


