export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface HttpRequestConfig {
    url: string;
    method: HttpMethod;
    headers?: Record<string, string>;
    data?: any;
    timeoutMs?: any;
}

// 响应
export interface HttpResponse {
    status: number;
    body: any;
    headers: Record<string, string>;
}

export default class Http233 {
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
        const timeoutPromise = new Promise<HttpResponse>((_, reject) =>
            setTimeout(() => {
                // 请求超时，中止请求
                controller.abort();
                reject(new Error('Request timeout'));
            }, timeoutMs)
        );

        const fetchPromise = fetch(this.config.url, {
            method: this.config.method,
            headers: this.config.headers,
            body: this.config.data ? JSON.stringify(this.config.data) : undefined,
            // 将 AbortController.signal 传递给 fetch 请求
            signal: controller.signal
        })
            .then(async (response) => {
                const body = await response.json();
                return {
                    status: response.status,
                    body,
                    headers: Object.fromEntries(response.headers)
                };
            });

        try {
            const response: HttpResponse = await Promise.race([fetchPromise, timeoutPromise]);
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
