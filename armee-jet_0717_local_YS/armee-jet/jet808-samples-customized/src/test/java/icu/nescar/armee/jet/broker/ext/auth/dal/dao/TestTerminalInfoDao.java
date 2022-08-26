package icu.nescar.armee.jet.broker.ext.auth.dal.dao;

import icu.nescar.armee.jet.broker.ext.auth.dal.domain.TerminalInfo;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.util.List;

public class TestTerminalInfoDao {
    @Before
    public void init() {
        System.out.println("TerminalInfoDao 开始测试-----------------");
    }
    @Test
    public void testFindTerminal() {
        try {
            TerminalInfoDao service = TerminalInfoDaoFactory.createTerminalInfoDao(System.getProperty(VmOptions.AUTH_BY));
            assert service != null;
            List<TerminalInfo> list = service.findLimitTerminal("12", "HU", 1);
            if (list == null) {
                System.out.println("Result : Null");
            } else {
                TerminalInfo info = list.get(0);
                System.out.println(String.format("Terminal Id : %s , PSW : %s", info.getTerminalId(), info.getPassword()));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @After
    public void after() {
        System.out.println("TerminalInfoDao 测试结束-----------------");
    }
}