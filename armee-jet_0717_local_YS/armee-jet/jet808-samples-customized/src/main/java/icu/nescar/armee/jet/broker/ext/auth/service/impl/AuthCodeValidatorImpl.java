package icu.nescar.armee.jet.broker.ext.auth.service.impl;

import icu.nescar.armee.jet.broker.ext.auth.dal.dao.TerminalInfoDao;
import icu.nescar.armee.jet.broker.ext.auth.dal.dao.TerminalInfoDaoFactory;
import icu.nescar.armee.jet.broker.ext.auth.dal.domain.TerminalInfo;
import icu.nescar.armee.jet.broker.ext.auth.service.AuthCodeValidatorService;
import icu.nescar.armee.jet.broker.ext.conf.VmOptions;
import io.github.hylexus.jt.annotation.BuiltinComponent;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.req.BuiltinAuthRequestMsgBody;
import io.github.hylexus.jt808.session.Jt808Session;
import io.github.hylexus.jt808.session.Session;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.Semaphore;

/**
 * 基于MySQL的鉴权
 * @author neyzoter
 */
@Primary
public class AuthCodeValidatorImpl implements AuthCodeValidatorService {

    /**
     * 连接池
     */
    private final LinkedBlockingQueue<TerminalInfoDao> daos;
    /**
     * 连接池的信号量
     */
    private final Semaphore smph;
    public AuthCodeValidatorImpl() {
        String db = System.getProperty(VmOptions.AUTH_BY);
        int poolCore = Integer.parseInt(System.getProperty(VmOptions.AUTH_VALIDATOR_POOL_CORE_NUM));
        daos = new LinkedBlockingQueue<>(poolCore);
        smph = new Semaphore(poolCore);
        try {
            for (;poolCore > 0;poolCore--) {
                daos.add(TerminalInfoDaoFactory.createTerminalInfoDao(db));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @Override
    public boolean validateAuthCode(Jt808Session session, RequestMsgMetadata requestMsgMetadata, BuiltinAuthRequestMsgBody builtinAuthRequestMsgBody) {
        TerminalInfoDao dao = null;
        // semaphore是否成功获取
        boolean smphAcquired = false;
        try {
            // 阻塞获取资源
            smph.acquire();
            // 成功获取smph
            smphAcquired = true;
            // 从阻塞队列中获取dao资源
            // 注意和获取smph的先后关系
            dao = daos.poll();
            if (dao == null) {
                throw new Exception("Dao Is Null");
            }
            List<TerminalInfo> list = dao.findLimitTerminal(session.getTerminalId(), builtinAuthRequestMsgBody.getAuthCode(), 1);
            if (list == null) {
                return false;
            }
            return !list.isEmpty();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            // 如果dao成功获取，则需要重新加入到队列中
            // 注意和释放smph的先后关系
            if (dao != null) {
                // 将使用完的dao重新放入队列中
                daos.add(dao);
            }
            // 如果smph成功获取，则需要释放
            if (smphAcquired) {
                smph.release();
            }
        }
        return false;
    }
}
