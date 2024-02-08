/**
 * WebSocketUtils 处理 WebSocket 连接和消息处理，处理特定格式的二进制数据包。
 */
export class WebSocketUtils {
    private websocket: WebSocket | null = null;
    private url: string;
    private maxRetries: number;
    private retries: number;
    private messageHandlers: {
        [messageCode: number]: (message: Uint8Array) => void
    } = {};

    // TCP 缓冲区
    private buffer: Uint8Array = new Uint8Array(0);

    /**
     * 创建 WebSocketUtils 的实例。
     * @param url 建立 WebSocket 连接的 URL。
     * @param maxRetries 最大重连尝试次数（默认: 3）。
     */
    constructor(url: string, maxRetries: number = 3) {
        this.url = url;
        this.maxRetries = maxRetries;
        this.retries = 0;
    }

    /**
     * 连接 WebSocket 并处理消息。
     * @returns 当 WebSocket 连接成功时解析的 Promise。
     */
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.websocket = new WebSocket(this.url);

            // 事件监听...

            this.websocket.onmessage = (event) => {
                const data = new Uint8Array(event.data);
                this.buffer = this.concatUint8Arrays(this.buffer, data);

                while (this.buffer.length >= 8) {
                    const packetSize = new DataView(this.buffer.buffer, 0, 4).getInt32(0);
                    if (this.buffer.length >= packetSize) {
                        const handlerCode = new DataView(this.buffer.buffer, 4, 4).getInt32(0);
                        const content = this.buffer.subarray(8, packetSize);

                        // 使用 handlerCode 和 content 处理消息内容
                        if (this.messageHandlers[handlerCode]) {
                            this.messageHandlers[handlerCode](content);
                        }

                        this.buffer = this.buffer.subarray(packetSize);
                    } else {
                        // 如果尚未接收到完整的数据包，退出循环
                        break;
                    }
                }
            };
        });
    }

    /**
     * 合并两个 Uint8Array。
     * @param a 第一个 Uint8Array。
     * @param b 第二个 Uint8Array。
     * @returns 合并后包含 a 和 b 数据的新 Uint8Array。
     */
    private concatUint8Arrays(a: Uint8Array, b: Uint8Array): Uint8Array {
        const result = new Uint8Array(a.length + b.length);
        result.set(a, 0);
        result.set(b, a.length);
        return result;
    }

    /**
     * 关闭 WebSocket 连接。
     */
    close(): void {
        if (this.websocket) {
            this.websocket.close();
        }
    }

    /**
     * 为特定消息代码注册消息处理器。
     * @param messageCode 消息的代码。
     * @param handler 处理消息数据的函数。
     */
    registerMessageHandler(messageCode: number, handler: (message: Uint8Array) => void): void {
        this.messageHandlers[messageCode] = handler;
    }
}
