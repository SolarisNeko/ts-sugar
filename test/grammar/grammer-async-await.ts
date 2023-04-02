foo();

async function foo() {
  try {
    const result = await doThing1();
    const newResult = await doThing2(result);
    const finalResult = await doThing3(newResult);
    console.log(`Got the final result: ${finalResult}`);
  } catch (error: any) {
    failureCallback(error);
  }
}

async function doThing1(): Promise<String> {
  console.log('1')
  return '1';
}

async function doThing2(result: String): Promise<String> {
  const newLocal = result + '2';
  console.log(newLocal);
  return newLocal;
}


async function doThing3(prevResult: String) : Promise<String> {
  const newLocal = prevResult + '3';
  console.log(newLocal)
  return newLocal
}


function failureCallback(error: any) {
  console.error(error)
}