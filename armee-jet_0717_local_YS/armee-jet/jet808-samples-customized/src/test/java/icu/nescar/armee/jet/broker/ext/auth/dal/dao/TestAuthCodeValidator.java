package icu.nescar.armee.jet.broker.ext.auth.dal.dao;


import icu.nescar.armee.jet.broker.ext.auth.service.impl.AuthCodeValidatorImpl;

import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.jt808.msg.req.BuiltinAuthRequestMsgBody;
import io.github.hylexus.jt808.session.Session;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;


public class TestAuthCodeValidator {
    @Before
    public void init() {
        System.out.println(" AuthCodeValidator开始测试-----------------");
    }
    @Test
    public void testAuthValidate() {
        try {
            AuthCodeValidatorImpl auth=new AuthCodeValidatorImpl();
            Session ses=new Session();
            ses.setTerminalId("12");
            RequestMsgMetadata requestMsgMetadata=null;
            BuiltinAuthRequestMsgBody authbody=new BuiltinAuthRequestMsgBody();
            authbody.setAuthCode("HU");

            System.out.println(auth.validateAuthCode(ses,requestMsgMetadata,authbody));
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    @After
    public void after() {
        System.out.println("AuthCodeValidator测试结束-----------------");
    }
}
