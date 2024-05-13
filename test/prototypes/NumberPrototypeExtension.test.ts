import {NumberPrototypeExtension} from "../../src/prototypes/NumberPrototypeExtension";

describe('StringPrototypeExtension', () => {
    it('should add and read int correctly', () => {
        NumberPrototypeExtension.init()

       let number = 1.2344.withDecimalCount(2, true);
        expect(number.toString()).toEqual('1.23')
    });


});
