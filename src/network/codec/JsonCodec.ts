import {ICodec} from "../ICodec";
import {SocketReqData, SocketRespData} from "../ISocket";

/**
 * json 编解码
 */
export class JsonCodec implements ICodec<SocketReqData, SocketRespData> {
    encode(reqData: SocketReqData): Uint8Array {
        // 将请求数据转换为字符串
        const encodedString = JSON.stringify(reqData);
        // 使用 TextEncoder 将字符串编码为 Uint8Array
        const encoder = new TextEncoder();
        return encoder.encode(encodedString);
    }

    decode(buffer: Uint8Array): SocketRespData {
        // 使用 TextDecoder 将 Uint8Array 解码为字符串
        const decoder = new TextDecoder();
        const decodedString = decoder.decode(buffer);
        // 将解码后的字符串转换为 SocketRespData 对象
        return JSON.parse(decodedString);
    }
}
