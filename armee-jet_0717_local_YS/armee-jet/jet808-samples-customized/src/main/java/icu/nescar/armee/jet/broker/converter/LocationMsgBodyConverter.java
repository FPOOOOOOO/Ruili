package icu.nescar.armee.jet.broker.converter;

import icu.nescar.armee.jet.broker.msg.req.LocationUploadRequestMsgBody;
import io.github.hylexus.jt808.converter.RequestMsgBodyConverter;
import io.github.hylexus.jt808.msg.RequestMsgMetadata;
import io.github.hylexus.oaks.utils.BcdOps;

import java.util.Arrays;
import java.util.Optional;

import static io.github.hylexus.oaks.utils.IntBitOps.intFromBytes;

/**
 * @Auther whale
 * @Date 2021/3/17
 * 因为注解生成的dword没有double型 所以就自行实现然后 手动注册converter进mapping
 */

public class LocationMsgBodyConverter implements RequestMsgBodyConverter<LocationUploadRequestMsgBody> {

    @Override
    public Optional<LocationUploadRequestMsgBody> convert2Entity(RequestMsgMetadata metadata) {
        byte[] bytes = metadata.getBodyBytes();
        LocationUploadRequestMsgBody body = new LocationUploadRequestMsgBody();
        body.setWarningFlag(intFromBytes(bytes, 0, 4));
        body.setStatus(intFromBytes(bytes, 4, 4));
        body.setLat(intFromBytes(bytes, 8, 4) * 1.0 / 100_0000);
        body.setLng(intFromBytes(bytes, 12, 4) * 1.0 / 100_0000);
        body.setHeight((short) intFromBytes(bytes, 16, 2));
        body.setSpeed((short) intFromBytes(bytes, 18, 2));
        //协议上这个direction的长度是2
        body.setDirection((short) intFromBytes(bytes, 20, 2));
        body.setLocationTime(Arrays.copyOfRange(bytes,22,28));
        return Optional.of(body);
    }

}

