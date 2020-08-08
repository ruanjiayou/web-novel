export default function (n) {
  let time = '', h = 0, m = 0, s = 0;
  n = n.toFixed(0)
  if (n > 3600) {
    h = n / 3600;
    if (h < 10) {
      h = '0' + h
    }
    n = n % 3600;
  }
  m = (n / 60).toFixed(0);
  if (m < 10) {
    m = '0' + m;
  }
  s = n % 60;
  if (s < 10) {
    s = '0' + s
  }
  if (h) {
    return `${h}:${m}:${s}`
  } else {
    return `${m}:${s}`
  }
}