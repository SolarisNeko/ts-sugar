import ActionChain from "../../src/action/ActionChain";
test('ActionChain base test', () => {
    ActionChain.serialize((ok) => {
        // console.log(1);
        ok();
    }, (ok) => {
        // console.log(3);
    }, (ok) => {
        throw new Error('not ok!');
    });
});
