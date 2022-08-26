package icu.nescar.armee.jet.broker.util;

import org.junit.Test;

/**
 * 测试时间转化器
 * @author neyzoter
 */
public class TimeConverterTester {
    @Test
    public void testRfc3339ToLong() {
        String date = "2020-9-4T12:10:20Z";
        long time = TimeConverter.RFC3339ToLong(date);
        System.out.println(time);
    }

    @Test
    public void testLongToRcf3339() {
        long time = 1599192620000L;
        String rfc = TimeConverter.longToRFC3339(time);
        System.out.println(rfc);
    }
}
