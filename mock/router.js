const _ = require('lodash'); const fs = require('fs');
const path = require('path');

/**
 * 遍历文件夹
 * @param {object} opt 参数
 * @param {function} cb 回调函数
 */
function loader(opt, cb = null) {
  scanner(opt.dir, cb, opt.filter, opt.recusive);
}

function scanner(dir, cb, filter, recusive) {
  fs.readdirSync(dir).forEach(file => {
    const fullpath = path.join(dir, file);
    const ext = path.extname(file).toLocaleLowerCase();
    const filename = file.substr(0, file.length - ext.length);
    if (recusive === true && fs.existsSync(fullpath) && fs.lstatSync(fullpath).isDirectory()) {
      scanner(fullpath, cb, filter, recusive);
    } else if (cb) {
      // filter处理
      cb({ fullpath, dir, filename, ext });
    }
  });
}

let routes = [];

/**
 * 调整路由数组
 */
function adjustRoutes(arr) {
  function compare(str1, str2) {
    let len1 = str1.length,
      len2 = str2.length;
    for (let i = 0; i < len1 && i < len2; i++) {
      if (str1[i] === ':' || str1[i] === '*') {
        return -1;
      }
      if (str2[i] === ':' || str2[i] === '*') {
        return 1;
      }
      if (str1.charCodeAt(i) !== str2.charCodeAt(i)) {
        return str1.charCodeAt(i) - str2.charCodeAt(i);
      }
    }
    return len1 - len2;
  }
  arr.sort(function (a, b) {
    if (a.type === 'use' || b.type === 'use') {
      if (a.type === b.type) {
        return compare(a.path, b.path);
      } else {
        return a.type === 'use' ? -1 : 1;
      }
    }
    return compare(a.path, b.path);
  });
  return arr;
}
/**
 * 处理路由文件
 * @param {object} info 路径信息
 */
function handler(info) {
  let route = require(info.fullpath);
  Object.keys(route).forEach(key => {
    // 转化为可以排序的对象
    const [method, apipath] = key.split(' ');
    //app[method](apipath, route[key]);
    const o = {
      type: method.toLowerCase(),
      path: apipath,
      handle: route[key]
    };
    routes.push(o);
  });
}
/**
 * 加载所有路由
 */
loader({
  dir: path.normalize(__dirname + '/routes'),
  recusive: true
}, handler);

module.exports = function (app) {
  // 排序
  routes = adjustRoutes(routes);
  // 挂载到app上
  routes.forEach((route) => {
    app[route.type](route.path, async function (req, res, next) {
      // 普通API
      try {
        const result = await route.handle.call(app, req, res, next);
        // 处理列表分页
        if (result !== undefined) {
          res.json(result);
        }
      } catch (e) {
        next(e);
      }
    });
  });
}