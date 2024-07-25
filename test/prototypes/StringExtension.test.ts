import {StringExtension} from "../../src/prototypes/StringExtension";
import {UInt8ArrayExtension} from "../../src/prototypes/UInt8ArrayExtension";

describe('StringPrototypeExtension', () => {
    it('should add and read int correctly', () => {
        StringExtension.init()
        UInt8ArrayExtension.init()

        let test: String = "";
        let str: UInt8ArrayExtension = test.toUin8Array()
            .toUInt8ArrayExtension()
            .addInt(10)
            .addInt(20)
            .addInt(30)

        let number = str.readInt();


        expect(number).toBe(10);

    });


});
