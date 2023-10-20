var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
foo();
function foo() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield doThing1();
            const newResult = yield doThing2(result);
            const finalResult = yield doThing3(newResult);
            console.log(`Got the final result: ${finalResult}`);
        }
        catch (error) {
            failureCallback(error);
        }
    });
}
function doThing1() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('1');
        return '1';
    });
}
function doThing2(result) {
    return __awaiter(this, void 0, void 0, function* () {
        const newLocal = result + '2';
        console.log(newLocal);
        return newLocal;
    });
}
function doThing3(prevResult) {
    return __awaiter(this, void 0, void 0, function* () {
        const newLocal = prevResult + '3';
        console.log(newLocal);
        return newLocal;
    });
}
function failureCallback(error) {
    console.error(error);
}
