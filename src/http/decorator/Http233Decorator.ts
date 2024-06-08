import {EnumHttpMethod} from "../Http233";

export class HttpSendRequestOptions {
    // 域名 = ${IP}:${port}
    domain: string = "localhost";
    // 域名下子路径
    uri: string = "";
    // httpMethod
    httpMethod: EnumHttpMethod = EnumHttpMethod.POST;
    // 可选的请求头
    headers?: Record<string, string> = null;
    // 超时时间
    timeoutMs: number = 60 * 1000
}


export class Http233Decorator {


    private static readonly DEFAULT_HTTP_SEND_REQUEST_OPTIONS: HttpSendRequestOptions = {
        domain: "localhost",
        uri: "/",
        httpMethod: EnumHttpMethod.POST,
        headers: null,
        timeoutMs: 60 * 1000,
    }

    static SendHttpJsonRequest(options: HttpSendRequestOptions = Http233Decorator.DEFAULT_HTTP_SEND_REQUEST_OPTIONS) {
        return function (target: any,
                         propertyKey: string,
                         descriptor: TypedPropertyDescriptor<(...args: any) => any>,
        ) {
            // 获取原始方法
            const originalMethod = descriptor.value!;

            descriptor.value = function (...args: any[]): any {

                const fullUrl = `${options.domain}${options.uri}`;
                const xhr = new XMLHttpRequest();
                // 设置超时时间
                xhr.timeout = options.timeoutMs;


                // http request obj
                const httpRequestObj = args[0];

                return new Promise((resolve,
                                    reject,
                ) => {
                    xhr.onreadystatechange = () => {
                        if (xhr.readyState === 4) {
                            if (xhr.status >= 200 && xhr.status < 300) {
                                try {
                                    const response = JSON.parse(xhr.responseText);
                                    resolve(response);
                                } catch (error) {
                                    reject(new Error(`Invalid JSON response: ${xhr.responseText}`));
                                }
                            } else {
                                reject(new Error(`HTTP request failed with status ${xhr.status}`));
                            }
                        }
                    };

                    xhr.onerror = () => reject(new Error('[Http] Network error'));
                    xhr.ontimeout = () => reject(new Error('[Http] Request timeout'));

                    xhr.open(options.httpMethod, fullUrl, true);
                    if (options.headers) {
                        const entries = Object.keys(options.headers);
                        for (const [key] of entries) {
                            const value: string = entries[key];
                            xhr.setRequestHeader(key, value);
                        }
                    }
                    xhr.setRequestHeader('Content-Type', 'application/json');

                    // 如果是 POST/PUT/DELETE 请求，将参数转换为 JSON 字符串发送
                    const data = JSON.stringify(httpRequestObj ?? {});
                    xhr.send(data);

                    originalMethod.apply(this, args);
                });
            };
        };
    }

}