import {JsonCodec} from "../../../src/network/codec/JsonCodec";
import {SocketReqData, SocketRespData} from "../../../src/network/ISocket";

describe("JsonCodec", () => {
    let jsonCodec: JsonCodec;

    beforeEach(() => {
        jsonCodec = new JsonCodec();
    });

    it("should encode SocketReqData to Uint8Array", () => {
        const reqData: SocketReqData = {
            cmdCode: 1,
            encryptType: 0,
            desc: "Hello, WebSocket!",
            data: {key: "value"},
        };

        const encodedData = jsonCodec.encode(reqData);

        // 使用 TextDecoder 将 Uint8Array 解码为字符串
        const decoder = new TextDecoder();
        const decodedString = decoder.decode(encodedData);

        // 验证解码后的字符串是否与预期一致
        expect(decodedString).toEqual(JSON.stringify(reqData));
    });

    it("should decode Uint8Array to SocketRespData", () => {
        const respData: SocketRespData = {
            cmdCode: 2,
            encryptType: 1,
            desc: "Response Data",
            data: {result: "success"},
        };

        // 将响应数据转换为字符串
        const respString = JSON.stringify(respData);

        // 使用 TextEncoder 将字符串编码为 Uint8Array
        const encoder = new TextEncoder();
        const encodedData = encoder.encode(respString);

        // 使用 JsonCodec 进行解码
        const decodedData = jsonCodec.decode(encodedData);

        // 验证解码后的数据是否与预期一致
        expect(decodedData).toEqual(respData);
    });
});
