/* eslint eqeqeq: 0 */

function equal(old, target) {
  let r = true;
  for (const prop in old) {
    if (typeof old[prop] === 'object' && typeof target[prop] === 'object') {
      if (old[prop].toString() != target[prop].toString()) {
        r = false;
      }
    } else if (old[prop] != target[prop]) {
      r = false;
    }
  }
  return r;
}

export default equal;
