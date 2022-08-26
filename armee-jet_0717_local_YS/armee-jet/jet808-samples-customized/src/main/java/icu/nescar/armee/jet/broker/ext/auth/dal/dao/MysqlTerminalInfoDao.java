package icu.nescar.armee.jet.broker.ext.auth.dal.dao;

import icu.nescar.armee.jet.broker.ext.auth.dal.domain.TerminalInfo;
import icu.nescar.armee.jet.broker.ext.conf.ConfArguments;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;

import java.lang.reflect.Field;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

@Getter
@Slf4j
public class MysqlTerminalInfoDao implements TerminalInfoDao {
    String url;
    String user;
    String password;
    String driver;
    Connection conn;
    Statement stmt;

    private MysqlTerminalInfoDao(String u, String usr, String psw, String d, Connection c, Statement s) {
        url = u;user = usr;password = psw;driver = d;conn = c;stmt = s;
    }
    @Override
    public List<TerminalInfo> findTerminal(String terminalId, String password) {

        String table = System.getProperty(VmOptions.MYSQL_AUTH_TABLE);
        String terminalIdSeg = ConfArguments.MYSQL_AUTH_TABLE_SEGMENT_TERMINAL_ID;
        String pswSeg = ConfArguments.MYSQL_AUTH_TABLE_SEGMENT_PASSWORD;
        List<TerminalInfo> list = new ArrayList<>();
        if (table == null) {
            log.error("Lack SQL Table");
            return list;
        }
        String sql = String.format("select * from %s where %s=\"%s\" and %s=\"%s\"",
                table, terminalIdSeg, terminalId, pswSeg, password);
        try {
            ResultSet set = stmt.executeQuery(sql);
            while (set.next()) {
                String id = set.getString(terminalIdSeg);
                String psw = set.getString(pswSeg);
                TerminalInfo info = new TerminalInfo();
                info.setPassword(psw);
                info.setTerminalId(id);
                list.add(info);
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    @Override
    public List<TerminalInfo> findLimitTerminal(String terminalId, String password, int limit) {
        String table = System.getProperty(VmOptions.MYSQL_AUTH_TABLE);
        String terminalIdSeg = ConfArguments.MYSQL_AUTH_TABLE_SEGMENT_TERMINAL_ID;
        String pswSeg = ConfArguments.MYSQL_AUTH_TABLE_SEGMENT_PASSWORD;
        List<TerminalInfo> list = new ArrayList<>();
        if (table == null) {
            log.error("Lack SQL Table");
            return list;
        }
        String sql = String.format("select * from %s where %s=\"%s\" and %s=\"%s\" limit %d",
                 table, terminalIdSeg, terminalId, pswSeg, password, limit);
        try {
            ResultSet set = stmt.executeQuery(sql);
            while (set.next()) {
                String id = set.getString(terminalIdSeg);
                String psw = set.getString(pswSeg);
                TerminalInfo info = new TerminalInfo();
                info.setPassword(psw);
                info.setTerminalId(id);
                list.add(info);
            }
            return list;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }

    /**
     * 析构函数
     */
    public void finalize(){
        try {
            stmt.close();
            conn.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    public static class MysqlTerminalInfoDaoBuilder {
        private String url = null;
        private String user = null;
        private String password = null;
        private String driver = null;
        /**
         * 设置url，参数默认为VmOptions.MYSQL_URL_DEFAULT_PARAMS
         * @param u url
         * @return {@link MysqlTerminalInfoDaoBuilder}
         */
        public MysqlTerminalInfoDaoBuilder url(String u) {
            // url + ? + 参数，和HTTP的url相同意思
            url = "jdbc:" + u + "?" + VmOptions.MYSQL_URL_DEFAULT_PARAMS;
            return this;
        }

        /**
         * 设置url
         * @param u url
         * @param params mysql参数
         * @return {@link MysqlTerminalInfoDaoBuilder}
         */
        public MysqlTerminalInfoDaoBuilder url(String u, String params) {
            // url + ? + 参数，和HTTP的url相同意思
            url = "jdbc:" + u + "?" + params;
            return this;
        }

        /**
         * 设置用户名
         * @param usr 用户名
         * @return {@link MysqlTerminalInfoDaoBuilder}
         */
        public MysqlTerminalInfoDaoBuilder user(String usr) {
            user = usr;
            return this;
        }

        /**
         * 设置密码
         * @param psw 密码
         * @return {@link MysqlTerminalInfoDaoBuilder}
         */
        public MysqlTerminalInfoDaoBuilder password(String psw) {
            password = psw;
            return this;
        }

        /**
         * JDBC的驱动
         * @param d JDBC驱动
         * @return {@link MysqlTerminalInfoDaoBuilder}
         */
        public MysqlTerminalInfoDaoBuilder driver(String d){
            driver = d;
            return this;
        }

        /**
         * 构建MysqlTerminalInfoDao
         * @return {@link MysqlTerminalInfoDao}
         */
        public MysqlTerminalInfoDao build() throws Exception{
            boolean supported = false;
            for (String option : VmOptions.JDBC_DRIVER_SUPPORT) {
                if (driver.equals(option)) {
                    supported = true;
                }
            }
            if (!supported) {
                throw new Exception("Unsupported JDBC Driver");
            }
            // 注册 JDBC 驱动
            log.info("注册JDBC驱动 ： " + driver);
            Class.forName(driver);
            // 打开链接
            log.info("连接数据库...");
            Connection conn = DriverManager.getConnection(url,user,password);
            Statement stmt = conn.createStatement();
            Field[] fields = this.getClass().getDeclaredFields();
            for (Field f : fields) {
                if (f.get(this) == null) {
                    throw new Exception("DB Connector's " + f.getName() + " Has Not Been Inited");
                }
            }
            return new MysqlTerminalInfoDao(url, user, password, driver, conn, stmt);
        }

        /**
         * 创建默认Mysql终端信息查询Dao实例
         * @return {@link MysqlTerminalInfoDao}
         * @throws Exception 创建异常
         */
        public MysqlTerminalInfoDao defaultDao() throws Exception{
            return new MysqlTerminalInfoDaoBuilder()
                    .driver(System.getProperty(VmOptions.JDBC_DRIVER))
                    .password(System.getProperty(VmOptions.MYSQL_PSW))
                    .user(System.getProperty(VmOptions.MYSQL_USER))
                    .url(System.getProperty(VmOptions.MYSQL_URL))
                    .build();
        }
    }
}
