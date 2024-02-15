import {HttpMethod} from "../../src/http/Http233";
import {Enums} from "../../src/enums/Enums";

describe('Enums', () => {
    describe('getTypeByName', () => {
        it('should return enum value for valid string', () => {
            const method: HttpMethod = Enums.getTypeByName<HttpMethod>('GET', HttpMethod);
            expect(method).toEqual(HttpMethod.GET);
        });

        it('should return null for invalid string', () => {
            const method: HttpMethod = Enums.getTypeByName<HttpMethod>('INVALID_METHOD', HttpMethod);
            expect(method).toBeNull();
        });

        it('should return null for null enumType', () => {
            const method: HttpMethod = Enums.getTypeByName<HttpMethod>('GET', null);
            expect(method).toBeNull();
        });
    });
});
