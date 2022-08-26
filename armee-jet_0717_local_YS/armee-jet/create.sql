DROP DATABASE tms;
CREATE DATABASE tms;
USE tms;
DROP TABLE IF EXISTS `device`;
CREATE TABLE `device` (
  `gid` BIGINT UNSIGNED AUTO_INCREMENT COMMENT '挂车唯一id',
  `imei` VARCHAR(32) NOT NULL COMMENT 'IMEI',
  `imsi` VARCHAR(32) NOT NULL COMMENT 'IMSI',
  `psw` VARCHAR(32) NOT NULL COMMENT '设备密码，对应到一个挂车',
  `lock_status` INT(2) DEFAULT 1 COMMENT '上锁状态，1：上锁；0：未上锁',
  `lock_start_time` DATETIME(6) DEFAULT NULL COMMENT '上锁开始时间，只有lock_status为1时有效',
  `lock_end_time` DATETIME(6) DEFAULT NULL COMMENT '上锁结束时间，只有lock_status为1时有效',
  `license_plate` VARCHAR(16) DEFAULT NULL COMMENT '车牌号',
  `driver_gid` BIGINT UNSIGNED DEFAULT NULL  COMMENT '驾驶员唯一id',
  `gmt_create` DATETIME(6) DEFAULT NULL COMMENT '创建时间',
  `gmt_update` DATETIME(6) DEFAULT NULL COMMENT '更改时间',
  PRIMARY KEY (`gid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
DESC `device`;

INSERT INTO device (gid, imei, imsi, psw, lock_status, lock_start_time, lock_end_time, license_plate, driver_gid, gmt_create, gmt_update) VALUES (0,'12','12','HU',0,NOW(),NOW(),'浙Ahujing',12,NOW(),NOW());
