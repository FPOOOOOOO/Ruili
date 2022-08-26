package icu.nescar.armee.jet.broker.ext.auth.dal.dao;

import icu.nescar.armee.jet.broker.ext.conf.AuthDb;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import lombok.extern.slf4j.Slf4j;

/**
 * 终端设备信息查询工厂
 * @author neyzoter
 */
@Slf4j
public class TerminalInfoDaoFactory {
    /**
     * 创建终端信息查询接口
     * @param dao 查询数据库，比如mysql
     * @return 终端信息查询接口
     * @throws Exception 创建异常
     */
    public static TerminalInfoDao createTerminalInfoDao(String dao) throws Exception {
        AuthDb authDb = VmOptions.findDbSupported(dao);
        if (authDb == null) {
            return null;
        }
        switch (authDb) {
            case MYSQL:
                return new MysqlTerminalInfoDao.MysqlTerminalInfoDaoBuilder().defaultDao();
            default:
                return null;
        }
    }
}
