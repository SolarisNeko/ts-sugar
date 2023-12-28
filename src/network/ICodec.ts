export interface ICodec<REQ, RESP> {

    encode(reqData: REQ): Uint8Array;

    decode(buffer: Uint8Array): RESP;
}