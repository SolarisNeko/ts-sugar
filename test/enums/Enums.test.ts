import {EnumHttpMethod} from "../../src/http/Http233";
import {Enums} from "../../src/enums/Enums";

describe('Enums', () => {
    describe('getTypeByName', () => {
        it('should return enum value for valid string', () => {
            const method: EnumHttpMethod = Enums.getTypeByName<EnumHttpMethod>('GET', EnumHttpMethod);
            expect(method).toEqual(EnumHttpMethod.GET);
        });

        it('should return null for invalid string', () => {
            const method: EnumHttpMethod = Enums.getTypeByName<EnumHttpMethod>('INVALID_METHOD', EnumHttpMethod);
            expect(method).toBeNull();
        });

        it('should return null for null enumType', () => {
            const method: EnumHttpMethod = Enums.getTypeByName<EnumHttpMethod>('GET', null);
            expect(method).toBeNull();
        });
    });
});
