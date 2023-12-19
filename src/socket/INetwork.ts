/*
 * 网络相关接口定义
 */
export type NetData = (string | ArrayBufferLike | Blob | ArrayBufferView);

// 网络数据回调
export type NetCallback = (data: any) => void;

/**
 * 请求协议
 * */
export interface IRequestProtocol {
    /** 请求码 */
    code: number,
    // 加密方式
    encryptType: number,
    /** 是否压缩 */
    isCompress: boolean,
    /** 消息内容 */
    data?: any;
}

/**
 * 响应协议
 * */
export interface IResponseProtocol {
    /** 响应协议状态码 */
    code: number,
    // 加密方式
    encryptType: number,
    /** 数据是否压缩 */
    isCompress: boolean,
    /** 协议数据 */
    data?: any,
}

/** 回调对象 */
export interface CallbackObject {
    target: any,                // 回调对象，不为null时调用target.callback(xxx)
    callback: NetCallback,      // 回调函数
}

/** 请求对象 */
export interface RequestObject {
    buffer: NetData,                   // 请求的Buffer
    rspCmd: string,                    // 等待响应指令
    rspObject: CallbackObject | null,  // 等待响应的回调对象
}

/** 协议辅助接口 */
export interface IProtocolHelper {
    /** 返回包头长度 */
    getHeadlen(): number;

    /** 返回一个心跳包 */
    getHearbeat(): NetData;

    /** 返回整个包的长度 */
    getPackageLen(msg: NetData): number;

    /** 检查包数据是否合法（避免客户端报错崩溃） */
    checkResponsePackage(msg: IResponseProtocol): boolean;

    /** 处理请求包数据 */
    handlerRequestPackage(reqProtocol: IRequestProtocol): string;

    /** 处理响应包数据 */
    handlerResponsePackage(respProtocol: IResponseProtocol): boolean;

    /** 返回包的id或协议类型 */
    getPackageId(msg: IResponseProtocol): string;
}


export type SocketFunc = (event: any) => void;

export type MessageFunc = (msg: NetData) => void;

/** Socket接口 */
export interface ISocket {
    // 连接回调
    onConnected: SocketFunc | null;
    // 收到消息回调
    onMessage: MessageFunc | null;
    // 错误回调
    onError: SocketFunc | null;
    // 关闭回调
    onClosed: SocketFunc | null;

    // 连接接口
    connect(options: any): any;

    // 数据发送接口
    send(buffer: NetData): number;

    // 关闭接口
    close(code?: number, reason?: string): void;
}

/** 网络提示接口 */
export interface INetworkTips {
    connectTips(isShow: boolean): void;

    reconnectTips(isShow: boolean): void;

    requestTips(isShow: boolean): void;

    responseErrorCode(code: number): void;
}

