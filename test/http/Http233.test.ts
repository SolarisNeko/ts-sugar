import Http233, {HttpResponse} from "../../src/http/Http233";

describe('Http', () => {
    it('should send a GET request', async () => {
        const response: HttpResponse = await Http233.builder()
            .url('https://jsonplaceholder.typicode.com/posts/1')
            .method('GET')
            .send();

        expect(response.status).toBe(200); // 检查状态码是否为 200
        expect(response.body).toBeDefined(); // 检查返回的数据不是 undefined
        expect(response.body.userId).toBe(1); // 检查返回数据中 userId 是否为 1
    });

    it('should send a POST request', async () => {
        const data = {
            title: 'foo',
            body: 'bar',
            userId: 1
        };
        const response: HttpResponse = await Http233.builder()
            .url('https://jsonplaceholder.typicode.com/posts')
            .method('POST')
            .headers({'Content-Type': 'application/json'})
            .data(data)
            .send();

        expect(response.status).toBe(201); // 检查状态码是否为 201 (Created)
        expect(response.body).toBeDefined(); // 检查返回的数据不是 undefined
        expect(response.body.title).toBe('foo'); // 检查返回数据中 title 是否为 'foo'
    });
});
