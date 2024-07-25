import {NumberExtension} from "../../src/prototypes/NumberExtension";

describe('StringExtension', () => {
    it('should add and read int correctly', () => {
        NumberExtension.init()

       let number = 1.2344.withDecimalCount(2, true);
        expect(number.toString()).toEqual('1.23')
    });


});
