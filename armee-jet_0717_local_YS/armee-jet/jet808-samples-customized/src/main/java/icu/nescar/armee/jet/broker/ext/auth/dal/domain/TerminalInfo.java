package icu.nescar.armee.jet.broker.ext.auth.dal.domain;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

/**
 * 终端信息
 * @author neyzoter
 */
@Getter
@Setter
public class TerminalInfo implements Serializable {
    private static final long serialVersionUID = -4205392209808261193L;
    /**
     * terminalId
     */
    private String terminalId;

    /**
     * password
     */
    private String password;
}
