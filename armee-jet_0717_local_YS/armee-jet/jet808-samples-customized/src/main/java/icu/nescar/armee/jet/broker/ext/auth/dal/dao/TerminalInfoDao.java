package icu.nescar.armee.jet.broker.ext.auth.dal.dao;

import icu.nescar.armee.jet.broker.ext.auth.dal.domain.TerminalInfo;

import java.util.List;

/**
 * 设备信息数据访问对象
 * @author neyzoter
 */
public interface TerminalInfoDao {
    /**
     * 找到终端
     * @param terminalId 终端ID
     * @param password 密码
     * @return 终端列表
     */
    List<TerminalInfo> findTerminal(String terminalId, String password);
    /**
     * 找到前top个终端
     * @param terminalId 终端ID
     * @param password 密码
     * @param limit 前几个
     * @return 终端列表
     */
    List<TerminalInfo> findLimitTerminal(String terminalId, String password, int limit);
}
