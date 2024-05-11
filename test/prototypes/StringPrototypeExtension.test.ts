import {StringPrototypeExtension} from "../../src/prototypes/StringPrototypeExtension";
import {UInt8ArrayPrototypeExtension} from "../../src/prototypes/UInt8ArrayPrototypeExtension";

describe('StringPrototypeExtension', () => {
    it('should add and read int correctly', () => {
        StringPrototypeExtension.init()
        UInt8ArrayPrototypeExtension.init()

        let test: String = "";
        let str: UInt8ArrayPrototypeExtension = test.toUin8Array()
            .toUInt8ArrayExtension()
            .addInt(10)
            .addInt(20)
            .addInt(30)

        let number = str.readInt();


        expect(number).toBe(10);

    });


});
