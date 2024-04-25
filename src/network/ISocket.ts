// 请求
export interface SocketReqData {
    // 唯一id
    packetId: string,
    // 加密方式,
    encryptType: number,
    // 描述
    desc: string,
    // 数据
    data: any
}

// 响应
export interface SocketRespData {
    // 唯一id
    packetId: string,
    // 加密方式,
    encryptType: number,
    // 描述
    desc: string,
    // 数据
    data: any
}

// Socket 连接选项接口
export interface SocketConnectOptions {
    url?: string;                    // WebSocket 连接的 URL
    host?: string;                   // 主机地址
    port?: number;                   // 端口号
    autoReconnect?: boolean;         // 是否自动重连
    autoReconnectInterval?: number;  // 自动重连的时间间隔
}

/**
 * Socket接口
 **/
export interface ISocket<REQ, RESP> {

    // 连接接口
    connect(options: SocketConnectOptions): any;

    // 连接回调
    onConnected(): void;

    // 数据发送接口
    send(data: REQ): void;

    // 收到消息回调
    onMessage(data: Uint8Array): void;

    // 关闭接口
    close(code?: number,
          reason?: string,
    ): void;

    // 错误回调
    onError(e: Error): void;

    // 关闭回调
    onClosed(): void;

    // 获取链接地址
    getUrl(): string;

    // 获取主机地址
    getHost(): string;

    // 获取端口号
    getPort(): number;

    // 启用或禁用自动重连
    enableAutoReconnect(enable: boolean): void;

    // 检查是否启用了自动重连
    isAutoReconnectEnabled(): boolean;

    // 获取自动重连间隔
    getAutoReconnectInterval(): number;

    // 设置自动重连间隔
    setAutoReconnectInterval(interval: number): void;
}