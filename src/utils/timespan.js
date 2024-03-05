// 人性化时间
export default function simpleDuration(date) {
  const ts = Date.now();
  const duration = ts - date.getTime();
  let tips = '',
    suffix = duration > 0 ? '前' : '后';
  let year = 24 * 60 * 60 * 1000 * 365,
    month = 24 * 60 * 60 * 1000 * 30,
    day = 24 * 60 * 60 * 1000,
    hour = 60 * 60 * 1000,
    minute = 60 * 1000;
  if (duration >= year) {
    tips = Math.floor(duration / year) + '年';
  } else if (duration >= month) {
    tips = Math.floor(duration / month) + '月';
  } else if (duration >= day) {
    tips = Math.floor(duration / day) + '天';
  } else if (duration >= hour && duration < day) {
    tips = Math.floor(duration / hour) + '小时';
  } else if (duration > minute && duration < hour) {
    tips = Math.floor(duration / minute) + '分钟';
  } else {
    tips = '刚刚';
    suffix = '';
  }
  return tips + suffix;
}
