import {DataStream} from "../../src/dataStream/DataStream";
import {DataStreamV1} from "../../src/dataStream/DataStreamV1";
import {RandomUtils} from "../../src/utils/RandomUtils";

interface IUser {
    userId: number;
    name: string;
    email: string;
    age: number;
}

describe('Stream', () => {
    const generateRandomUsers = (count: number): IUser[] => {
        const users: IUser[] = [];
        const domains = ['example.com', 'test.com', 'demo.com'];

        function generateRandomString(length: number): string {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * characters.length));
            }
            return result;
        }

        function getEmail() {
            return `${generateRandomString(5)}@${domains[Math.floor(Math.random() * domains.length)]}`;
        }

        for (let i = 0; i < count; i++) {
            users.push({
                userId: i + 1,
                name: RandomUtils.generateRandomString(7),
                email: getEmail.call(this),
                age: RandomUtils.generateRandomInteger(18, 60),
            });
        }
        return users;
    };

    it('test DataStream / DataStreamV1 performance | spend timeMs', () => {
        const data = generateRandomUsers(100_0000);

        // 预热
        for (let i = 0; i < 3; i++) {
            DataStreamV1.from(data)
                .map(x => {
                    x.name = x.name.toUpperCase();
                    return x;
                })
                .filter(it => RandomUtils.generateRandomInteger(1, 100) > 50)
                .filter((x) => x.age % 2 == 0)
                .filter((x) => x.name.length > 5) // 示例：增加一个额外的 filter 条件
                .filter((x) => x.email.includes('example'))
                .toArray();

            DataStream.from(data)
                .map(x => {
                    x.name = x.name.toUpperCase();
                    return x;
                })
                .filter(it => RandomUtils.generateRandomInteger(1, 100) > 50)
                .filter((x) => x.age % 2 == 0)
                .filter((x) => x.name.length > 5) // 示例：增加一个额外的 filter 条件
                .filter((x) => x.email.includes('example'))
                .toArray();
        }

        // 正式测试
        function testDataStream() {
            console.time('DataStream');
            const newData = DataStream.from(data)
                .map(x => {
                    x.name = x.name.toUpperCase();
                    return x;
                })
                .filter(it => it.age % 2 == 0)
                .toArray();
            console.timeEnd('DataStream');
            return newData;
        }


        function testDataStreamV1() {
            console.time('DataStreamV1');
            const v1 = DataStreamV1.from(data)
                .map(x => {
                    x.name = x.name.toUpperCase();
                    return x;
                })
                .filter(it => it.age % 2 == 0)
                .toArray();
            console.timeEnd('DataStreamV1');
            return v1;
        }

        const nowData = testDataStream();
        const v1 = testDataStreamV1();


        // Optional assertions to check the result if needed
        expect(nowData).toBeInstanceOf(Array);
        expect(v1).toBeInstanceOf(Array);
    });
});
