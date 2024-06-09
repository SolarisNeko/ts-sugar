import {EnumHttpMethod} from "../Http233";
import {Logger} from "../../logger/Logger";
import {JsonUtils} from "../../json/JsonUtils";

export class HttpSendRequestOptions {
    // 域名 = ${IP}:${port}
    domain?: string | null = "localhost";
    // 端口 ｜ 0 = 不需要
    port?: number | null;
    // 域名下子路径
    uri?: string | null = "";
    // httpMethod
    httpMethod?: EnumHttpMethod = EnumHttpMethod.POST;
    // 可选的请求头
    headers?: Record<string, string> | null = null;
    // 超时时间
    timeoutMs?: number | null = 60 * 1000;
    // 安全证书
    sslFlag?: boolean | null = false;
}


export class Http233Decorator {

    private static sslFlag = false

    public static setSSLFlag(flag: boolean) {
        this.sslFlag = flag;
    }


    private static readonly DEFAULT_HTTP_SEND_REQUEST_OPTIONS: HttpSendRequestOptions = {
        domain: "localhost",
        port: 0,
        uri: "",
        httpMethod: EnumHttpMethod.POST,
        headers: null,
        timeoutMs: 60 * 1000,
        sslFlag: true
    }


    /**
     * @sendHttpJsonRequestAsync
     * 发送异步 HTTP JSON 请求
     * @param options
     */
    static sendHttpJsonRequestAsync<T>(
        options: HttpSendRequestOptions = Http233Decorator.DEFAULT_HTTP_SEND_REQUEST_OPTIONS
    ) {
        return function (
            target: any,
            propertyKey: string,
            descriptor: TypedPropertyDescriptor<(...args: any) => Promise<T>>
        ) {
            const originalMethod = descriptor.value!;

            descriptor.value = async function (...args: any[]): Promise<any> {
                // 合并默认选项和传入的选项
                const finalOptions: HttpSendRequestOptions = {
                    ...Http233Decorator.DEFAULT_HTTP_SEND_REQUEST_OPTIONS,
                    ...options,
                };

                return new Promise<any>((resolve,
                                         reject) => {
                    let responseObj: any = null;
                    let portStr = Http233Decorator.getPort(finalOptions);
                    let httpStr = Http233Decorator.getHttpDeclare(finalOptions);

                    const fullUrl = `${httpStr}${finalOptions.domain}${portStr}/${finalOptions.uri}`;
                    const requestArg = args[0];
                    let timeoutMs = finalOptions.timeoutMs;

                    Logger.DEFAULT.debug(`http request! fullUrl=${fullUrl}, timeout=${timeoutMs}`, requestArg);

                    const xhr = new XMLHttpRequest();
                    xhr.timeout = timeoutMs!;

                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                let text = "";
                                try {
                                    text = xhr.responseText;
                                    responseObj = JsonUtils.deserialize(text, Object);

                                    Logger.DEFAULT.debug(`解析 http response 成功! response obj = `, responseObj);
                                    resolve(responseObj);
                                } catch (error) {
                                    Logger.DEFAULT.error(`解析响应失败. responseText = ${text}`);
                                    reject(error);
                                }
                            } else {
                                reject(xhr.status);
                            }
                        }
                    };

                    xhr.onerror = (error) => {
                        Logger.DEFAULT.error(`Network error`, error);
                        reject(error);
                    };
                    xhr.ontimeout = () => {
                        Logger.DEFAULT.error(`Request timeout. obj = `, requestArg);
                        reject("Request timeout");
                    };

                    xhr.open(finalOptions.httpMethod!, fullUrl, true);
                    if (finalOptions.headers) {
                        for (const key in finalOptions.headers) {
                            const value: string = finalOptions.headers[key];
                            xhr.setRequestHeader(key, value);
                        }
                    }
                    xhr.setRequestHeader("Content-Type", "application/json");

                    const data = JSON.stringify(requestArg ?? {});
                    xhr.send(data);

                    originalMethod.apply(this, args);
                });
            };
        };
    }


    private static getPort(options: HttpSendRequestOptions) {
        let port = options.port;
        let portStr = ""
        if (port > 0) {
            portStr = ":" + port
        }
        return portStr;
    }

    private static getHttpDeclare(options: HttpSendRequestOptions): string {
        if (options.sslFlag) {
            return "https://"
        } else {
            return "http://"

        }
    }
}