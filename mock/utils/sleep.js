module.exports = async function sleep(t = 1) {
  return new Promise(resolve => {
    setTimeout(() => { resolve(true); }, t * 1000);
  });
}