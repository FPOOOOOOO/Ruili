package icu.nescar.armee.jet.broker.ext.conf;

import lombok.Getter;

/**
 * 支持的数据库类型
 * @author neyzoter
 */
@Getter
public enum AuthDb {
    /**
     * 存储在MySQL
     */
    MYSQL("MySQL", "mysql"),
    /**
     * 存储在MongoDB
     */
    MONGODB("MongoDB", "mongodb"),
    /**
     * 存储在文件中
     */
    FILE("File", "file");

    private final String desc;
    private final String name;

    AuthDb(String desc, String name) {
        this.desc = desc;
        this.name = name;
    }
}
