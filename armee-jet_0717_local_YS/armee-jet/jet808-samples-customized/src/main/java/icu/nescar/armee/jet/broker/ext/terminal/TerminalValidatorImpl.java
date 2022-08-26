package icu.nescar.armee.jet.broker.ext.terminal;

import io.github.hylexus.jt808.ext.TerminalValidator;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;

public class TerminalValidatorImpl implements TerminalValidator {

    @Override
    public boolean validateTerminal(RequestMsgMetadata metadata) {
        return false;
    }

    @Override
    public boolean needValidate(RequestMsgMetadata metadata, Integer msgId) {
        return false;
    }
}
