// create a function that generates an array of 16 random bytes
function createRandomBytes(length: number): ArrayLike<number> {
  const array = new Uint8Array(length);
  return window.crypto.getRandomValues(array);
}

export { createRandomBytes };
