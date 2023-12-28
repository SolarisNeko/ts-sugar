// Mock WebSocket
import {AbstractWebSocket} from "../../src/network/socket/AbstractWebSocket";
import {SocketReqData, SocketRespData} from "../../src/network/ISocket";
import {JsonCodec} from "../../src/network/codec/JsonCodec";

// Extend AbstractWebSocket for testing
class DemoWs extends AbstractWebSocket<SocketReqData, SocketRespData> {

    constructor() {
        super(new JsonCodec());
    }

    handleMessage(resp: SocketRespData): void {
        console.log("resp = ", resp)
    }


}


describe("AbstractWebSocket", () => {
    let socket: DemoWs;

    beforeEach(() => {
        socket = new DemoWs();
    });

    afterEach(() => {
        socket.close()
    });

    it("should connect successfully", (done) => {

        socket.connect({url: "ws://localhost:11111"});
        socket.send({
            // 请求码
            cmdCode: 1,
            // 加密方式,
            encryptType: 0,
            // 描述
            desc: "demo",
            // 数据
            data: {
                "name": "demo"
            }
        })

// Wait for 1 second before exiting the test
        setTimeout(() => {
            // Add any additional assertions or expectations here if needed

            // Call done to signal the end of the test
            done();
        }, 2000);

    });

});
