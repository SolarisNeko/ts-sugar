import {ISocket} from "../ISocket";
// 引入 ws 库提供的 WebSocket 类
import {WebSocket} from 'ws';
import {ICodec} from "../ICodec";

/**
 * WebSocket的抽象实现
 */
export abstract class AbstractWebSocket<REQ, RESP> implements ISocket<REQ, RESP> {
    private url: string = '';
    private host: string = '';
    private port: number = 0;
    private autoReconnect: boolean = false;
    private autoReconnectInterval: number = 5000;
    private ws: WebSocket | null = null;
    private codec: ICodec<REQ, RESP>;

    constructor(codec: ICodec<REQ, RESP>) {
        this.codec = codec;
    }

// 默认的 send 方法实现
    send(data: REQ): void {
        // 检查 WebSocket 是否已经打开
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            // 使用编解码器对数据进行编码
            const encodedData = this.codec.encode(data);
            // 发送编码后的数据
            this.ws.send(encodedData);
        } else {
            // WebSocket 没有打开时，输出错误信息
            console.error('WebSocket 未打开，无法发送数据。');
        }
    }

// 默认的 onMessage 方法实现
    onMessage(binaryData: Uint8Array): void {
        // 使用编解码器对二进制数据进行解码
        const decodedData = this.codec.decode(binaryData);
        // 调用抽象方法处理解码后的数据
        this.handleMessage(decodedData);
    }


// 默认的 onMessage 方法实现
    abstract handleMessage(resp: RESP): void

    onConnected(): void {
        console.log('WebSocket 连接成功');
    }

    onError(e: Error): void {
        console.error(`WebSocket 错误: `, e);
    }

    onClosed(): void {
        console.log('WebSocket 连接已关闭');
        if (this.autoReconnect) {
            console.log(`尝试在 ${this.autoReconnectInterval / 1000} 秒后重新连接`);
            setTimeout(() => this.connect({}), this.autoReconnectInterval);
        }
    }

    connect(options: any): void {
        this.url = options.url || '';
        this.host = options.host || '';
        this.port = options.port || 0;
        this.autoReconnect = options.autoReconnect || false;
        this.autoReconnectInterval = options.autoReconnectInterval || 5000;

        console.log('WebSocket URL:', this.url);
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
            this.onConnected();
        };

        this.ws.onmessage = (event) => {
            let packetData = event.data;

            if (typeof packetData === 'string') {
                // Convert string to bytes
                const encoder = new TextEncoder();
                const data = encoder.encode(packetData);

                // Handle byte data (Uint8Array)
                this.onMessage(data);
            } else if (packetData instanceof ArrayBuffer || packetData instanceof Uint8Array) {
                // Handle binary data as Uint8Array
                const data = new Uint8Array(packetData);
                this.onMessage(data);
            } else if (packetData instanceof Blob) {
                // Handle Blob data
                const reader = new FileReader();
                reader.onload = () => {
                    const data = new Uint8Array(reader.result as ArrayBuffer);
                    this.onMessage(data);
                };
                reader.readAsArrayBuffer(packetData);
            } else {
                // Handle other types of data or raise an error
                console.error('Unsupported data type:', packetData);
            }
        };

        this.ws.onerror = (event) => {
            this.onError(new Error(`WebSocket 错误: ${event}`));
        };

        this.ws.onclose = () => {
            this.onClosed();
        };
    }


    close(code?: number,
          reason?: string
    ): void {
        if (this.ws) {
            this.ws.close(code, reason);
        }
    }

    getUrl(): string {
        return this.url;
    }

    getHost(): string {
        return this.host;
    }

    getPort(): number {
        return this.port;
    }

    enableAutoReconnect(enable: boolean): void {
        this.autoReconnect = enable;
    }

    isAutoReconnectEnabled(): boolean {
        return this.autoReconnect;
    }

    getAutoReconnectInterval(): number {
        return this.autoReconnectInterval;
    }

    setAutoReconnectInterval(interval: number): void {
        this.autoReconnectInterval = interval;
    }
}
