package icu.nescar.armee.jet.broker.util;

import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * 时间转化器
 * @author neyzoter
 */
public class TimeConverter {

    public static final String RFC3339_FORMAT = "yyyy-MM-dd'T'HH:mm:ss'Z'";
    public static final long RFC3339_TO_LONG_ERROR = -1;

    /**
     * RFC3339转化为Long
     * @return long时间
     */
    public static long RFC3339ToLong(String rfc) {
        SimpleDateFormat df = new SimpleDateFormat(RFC3339_FORMAT);
        long time = RFC3339_TO_LONG_ERROR;
        try {
            time = df.parse(rfc).getTime();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return time;
    }
    /**
     * RFC3339转化为Double
     * @return Double时间
     */
    public static double RFC3339ToDouble(String rfc) {
        return (double) RFC3339ToLong(rfc);
    }

    /**
     * Long转化为RFC3339FFG
     * @param time long时间
     * @return RFC3339时间
     */
    public static String longToRFC3339(long time) {
        SimpleDateFormat df = new SimpleDateFormat(RFC3339_FORMAT);
        Date date = new Date(time);
        return df.format(date);
    }

    /**
     * Double转化为RFC3339
     * @param time double时间
     * @return RFC3339时间
     */
    public static String doubleToRFC3339(double time) {
        return longToRFC3339((long) time);
    }
}
