package icu.nescar.armee.jet.broker.util;

import java.io.*;

/**
 * （反）序列化工具
 * @author neyzoter
 */
public class SerializationUtil implements Serializable {

    private static final long serialVersionUID = 5603369754005781706L;

    /**
     * 序列化
     * @param obj 序列化对象
     * @return 字节序列
     */
    public static byte[] serialize(Object obj) throws Exception{
        ByteArrayOutputStream baos = null;
        ObjectOutputStream oos = null;
        try{
            // create byte array output stream
            baos = new ByteArrayOutputStream();
            // create obj output stream, write into baos
            oos = new ObjectOutputStream(baos);
            // write obj into baos
            oos.writeObject(obj);
            // trans to byte[]
            byte[] bytes = baos.toByteArray();
            oos.close();
            return bytes;
        }catch (Exception e){
            throw e;
        }
    }

    /**
     * 反序列化
     * @param bytes 字节序列
     * @return 反序列化对象
     */
    public static Object deserialize(byte[] bytes){
        ByteArrayInputStream bais = null;
        Object tmpObject = null;
        try {
            // trans to ByteArrayInputStream
            bais = new ByteArrayInputStream(bytes);
            // trans to obj InputStream
            ObjectInputStream ois = new ObjectInputStream(bais);
            // trans to obj
            tmpObject = (Object)ois.readObject();
            ois.close();
            return tmpObject;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

}