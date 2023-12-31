/**
 * HTTP 请求方法
 */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

/**
 * HTTP 请求配置
 */
export interface HttpRequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    data?: any;
    timeoutMs?: any;
}

/**
 * HTTP 响应
 */
export interface HttpResponse {
    status: number;
    headers: Record<string, string>;
    body: any;
}

/**
 * HTTP 工具
 */
export class Http233 {
    // 配置
    private config: HttpRequestConfig = {
        url: '',
        method: 'GET',
        // 默认超时时间 10s
        timeoutMs: 10 * 1000
    };


    static builder(): Http233 {
        return new Http233();
    }

    url(url: string): Http233 {
        this.config.url = url;
        return this;
    }

    method(method: HttpMethod): Http233 {
        this.config.method = method;
        return this;
    }

    headers(headers: Record<string, string>): Http233 {
        this.config.headers = headers;
        return this;
    }

    data(data: any): Http233 {
        this.config.data = data;
        return this;
    }

    timeout(timeoutMs: number): Http233 {
        this.config.timeoutMs = timeoutMs;
        return this;
    }

    async send(): Promise<HttpResponse> {
        const controller = new AbortController();
        let timeoutMs = this.config.timeoutMs;
        const timeoutPromise = new Promise<HttpResponse>((_,
                                                          reject) =>
            setTimeout(() => {
                // 请求超时，中止请求
                controller.abort();
                reject(new Error('Request timeout'));
            }, timeoutMs)
        );

        const xhr = new XMLHttpRequest();
        xhr.open(this.config.method, this.config.url, true);

        // Set headers
        if (this.config.headers) {
            for (const [key, value] of Object.entries(this.config.headers)) {
                xhr.setRequestHeader(key, value);
            }
        }

        xhr.timeout = timeoutMs;

        // Create a promise for the XMLHttpRequest
        const xhrPromise = new Promise<HttpResponse>((resolve,
                                                      reject) => {
            xhr.onreadystatechange = () => {
                if (xhr.readyState === XMLHttpRequest.DONE) {
                    const headers: Record<string, string> = {};
                    xhr.getAllResponseHeaders().trim().split('\n').forEach((header) => {
                        const [name, value] = header.split(':').map((h) => h.trim());
                        headers[name] = value;
                    });

                    const response: HttpResponse = {
                        status: xhr.status,
                        headers,
                        body: xhr.responseText,
                    };

                    resolve(response);
                }
            };

            xhr.onerror = () => reject(new Error('Network request failed'));
            xhr.ontimeout = () => reject(new Error('Request timeout'));
        });

        // Send the request with the provided data
        xhr.send(this.config.data ? JSON.stringify(this.config.data) : undefined);

        try {
            const response: HttpResponse = await Promise.race([xhrPromise, timeoutPromise]);
            return response;
        } catch (error) {
            // 捕获超时错误
            throw error;
        }
    }


    sendGet(): Promise<HttpResponse> {
        return this.method('GET').send();
    }

    sendPost(): Promise<HttpResponse> {
        return this.method('POST').send();
    }

    sendPut(): Promise<HttpResponse> {
        return this.method('PUT').send();
    }

    sendDelete(): Promise<HttpResponse> {
        return this.method('DELETE').send();
    }
}
