import { assert } from "console";
import ActionChain from "../../src/action/ActionChain";

test('ActionChain base test', () => {

  ActionChain.serialize((ok) => {
    // console.logger(1);
    ok()

  }, (ok) => {
    // console.logger(3);

  }, (ok) => {
    throw new Error('not ok!')
  })
})