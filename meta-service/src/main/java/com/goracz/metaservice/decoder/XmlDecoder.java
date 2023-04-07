package com.goracz.metaservice.decoder;

import com.goracz.metaservice.converter.XMLToIPTVResponseConverter;
import com.goracz.metaservice.dto.IPTVResponse;
import org.reactivestreams.Publisher;
import org.springframework.core.ResolvableType;
import org.springframework.core.codec.AbstractDataBufferDecoder;
import org.springframework.core.io.buffer.DataBuffer;
import org.springframework.core.io.buffer.DataBufferUtils;
import org.springframework.util.MimeType;
import reactor.core.publisher.Flux;

import java.nio.charset.StandardCharsets;
import java.util.Map;

public class XmlDecoder extends AbstractDataBufferDecoder<IPTVResponse> {
    public XmlDecoder() {
        super(new MimeType("application", "xml"));
    }

    @Override
    public boolean canDecode(ResolvableType elementType, MimeType mimeType) {
        return (IPTVResponse.class.isAssignableFrom(elementType.toClass()) &&
                super.canDecode(elementType, mimeType));
    }

    @Override
    public Flux<IPTVResponse> decode(Publisher<DataBuffer> inputStream,
                                     ResolvableType elementType,
                                     MimeType mimeType,
                                     Map<String, Object> hints) {
        return DataBufferUtils.join(inputStream)
                .map(dataBuffer -> {
                    byte[] bytes = new byte[dataBuffer.readableByteCount()];
                    dataBuffer.read(bytes);
                    DataBufferUtils.release(dataBuffer);

                    String xml = new String(bytes, StandardCharsets.UTF_8);
                    return XMLToIPTVResponseConverter.convertXMLToIPTVResponse(xml);
                })
                .flux();
    }
}
