const SensitiveWords = require('./SensitiveWords.js');
module.exports = {
  formatTime,
  getBirthData,
  getDay,
  copy,
  get_wxml,
  extend,
  type,
  objectToQueryString,
  isNullObject,
  isPlainEmptyObject,
  isEmptyObject,
  isPlainObject,
  showSuccess,
  showFail,
  showBusy,
  showModel,
  isFunction,
  sensitiveWordsFun,
  previewImage,
  throttle
}
// 点击防抖
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和参数传给原函数
      _lastTime = _nowTime
    }
  }
}
/**
 * 预览图片
 */
function previewImage(images) {
  // let opcallback = arguments[0]
  // images = isFunction(opcallback) ? images.map(opcallback) : images;
  let current = arguments[1] ? arguments[1] : 0
  wx.previewImage({
    urls: images,
    current: images[current]
  })
}
/**
 *  三种吐司
 * */
export function showSuccess() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "",
    icon: "success",
    mask: true,
    duration: arguments[1] ? arguments[1] : 1500
  })
}
export function showFail() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "",
    icon: "none",
    mask: true,
    duration: arguments[1] ? arguments[1] : 1500
  })
}
export function showBusy() {
  wx.showToast({
    title: arguments[0] ? arguments[0] : "加载中",
    icon: "loading",
    mask: true,
    duration: arguments[1] ? arguments[1] : 10000
  })
}
export function showModel() {
  let title = arguments[0]
  let content = type(arguments[1]) === "string" ? arguments[1] : JSON.stringify(arguments[1])
  let showCancel = arguments[3]
  if (isEmptyObject(content) | isNullObject(content)) {
    showFail(title)
   
    return;
  }
  wx.hideToast();
  wx.showModal({
    title,
    content: content,
    showCancel: showCancel,
    success: arguments[2]
  })
}
// 获取wxml的节点信息
function get_wxml(className, callback) {
  wx.createSelectorQuery().selectAll(className).boundingClientRect(callback).exec()
}
// 判断一个对象是否是函数
export function isFunction(fn) {
  return type(fn) === 'function';
};
// 简单的深拷贝方法
export function copy(obj) {
  if (type(obj) === 'object') {
    return JSON.parse(JSON.stringify(obj))
  } else if (Array.isArray(obj)) {
    return [...obj]
  }
}
/**
 * 格式化时间
 */
function formatTime(date) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取生日
 */
function getBirthData() {
  let displayData = [
    [],
    [],
    []
  ];
  let selectIndex = [];
  //1.获取当前时间
  const currentDate = new Date();
  //2.年
  let minYear = currentDate.getFullYear() - 100;
  for (let i = minYear; i < currentDate.getFullYear(); i++) {
    displayData[0].push(i + 1 + "年");
  }
  selectIndex.push(displayData[0].indexOf(currentDate.getFullYear() + "年"))
  //3.月
  for (let i = 1; i <= 12; i++) {
    displayData[1].push(i + "月")
  }
  selectIndex.push(displayData[1].indexOf(currentDate.getMonth() + 1 + "月"))
  //4.日
  for (let i = 1; i <= getDay(currentDate.getFullYear(), currentDate.getMonth() + 1); i++) {
    displayData[2].push(i + "日")
  }
  selectIndex.push(displayData[2].indexOf(currentDate.getDate() + "日"))
  // console.log(displayData)

  // }
  return {
    displayData,
    selectValue: currentDate.getFullYear() + "-" + (currentDate.getMonth() + 1) + "-" + currentDate.getDate(),
    selectIndex
  };
}

//根据选中的年月 获取当前月的日子
function getDay(year, month) {
  let date = new Date(year, month, 0);
  return date.getDate();
}


/**
 * 对象转string参数   {name:'小明',age:18} -> name=小明&age=18
 */
export function objectToQueryString(dataObject) {
  if (!dataObject || typeof dataObject !== 'object') {
    return ''
  }
  const kvArr = []
  Object.keys(dataObject).forEach(key => kvArr.push(`${key}=${dataObject[key]}`))
  return kvArr.join('&')
}

/*
  判断传入的参数的类型
*/
export function type(arg) {
  const t = typeof arg
  return t === 'object' ?
    arg === null ?
    'null' :
    Object.prototype.toString.call(arg).slice(8, -1).toLowerCase() :
    t
}
/**
 * 判断Null
 */
export function isNullObject(obj) {
  return obj == null ?
    true :
    isPlainEmptyObject(obj) ?
    true :
    false
}
/*
  判断一个对象是否是plain empty object
*/
export function isPlainEmptyObject(obj) {
  if (!isPlainObject(obj)) {
    return false;
  }
  return isEmptyObject(obj);
}

/*
   判断一个数组和对象是否是empty
   只要传入的obj对象没有emunerable=true的属性，就返回true
*/
export function isEmptyObject(obj) {
  var name;
  for (name in obj) {
    return false;
  }
  return true;
}

// 判断是否为普通对象
// 即简单的字典
// { id:xx, name:xx } -> true
export function isPlainObject(obj) {
  let key;
  // 过滤非对象和global对象
  // 小程序中可以认为wx就是global
  if (type(obj) !== 'object') {
    return false;
  }
  const hasOwn = Object.prototype.hasOwnProperty;
  // 这个对象不能是自定义构造器new 出来的
  // 且对象构造器的prototype属性必须有自己的 isPrototypeOf 属性（其实判断7个内置属性都行，不一定非要判断这个）...
  if (obj.constructor && !hasOwn.call(obj, 'constructor') && !hasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
    return false;
  }
  // key in 会先遍历自有属性，如果最后一个属性都是自有属性的话，说明整个
  // 对象上所有属性都是自有属性，说明这个对象就是一个简单的字典
  for (key in obj) {}
  return key === void 0 || hasOwn.call(obj, key);
}


// 对象拷贝（复制）工具方法。类似于jQuery的extend方法
export function extend(...args) {
  let options,
    name,
    src,
    copy,
    copyIsArray,
    clone,
    target = args[0] || {},
    i = 1,
    length = args.length,
    deep = false;
  // log( args );
  // 第一个参数作为是否是深拷贝的flag
  if (typeof target === 'boolean') {
    deep = target;
    target = args[i] || {};
    // 跳过第一个参数
    i++;
  }
  // 只有对象和函数可extend
  // 保证target一定为对象
  if (typeof target !== 'object' && !Utils.isFunction(target)) {
    target = {};
  }
  if (i === length) {
    // 如果除了deep之外只有一个参数，那么就把target指向this （this是Utils对象）
    // target = {};
    i--;
  }
  // 处理deep和target之后的参数
  for (; i < length; i++) {
    if ((options = args[i]) != null) {
      for (name in options) {
        src = target[name];
        copy = options[name];
        // 在copy中有引用target，导致死循环
        if (target === copy)
          continue
        // 对象和数组分开处理。加快拷贝速度
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false;
            clone = src && Array.isArray(src) ?
              src : [];
          } else {
            clone = src && isPlainObject(src) ?
              src : {};
          }
          // 递归
          target[name] = extend(deep, clone, copy);
        } else if (copy !== void 0) { // 不是深拷
          target[name] = copy;
        }
      }
    }
  }
  // return出去改变过后的对象
  return target;
}

// 敏感词过滤

function sensitiveWordsFun(text) {
  return new Promise(resolve => {
    var reg;
    var fileSystemManager = wx.getFileSystemManager();
    var result=false;
    // console.log(SensitiveWords.SensitiveWords)
    SensitiveWords.SensitiveWords.forEach(function (word, i) {
      reg = new RegExp(word, "g");
      //判断内容中是否包括敏感词
      if (text.indexOf(word) != -1) {
        text = text.replace(reg, "*");
        result=true;
        return;
      }
    })
    resolve(result)
  })
  
  // fileSystemManager.readFile({
  //   filePath: "/utils/敏感词库大全.txt",
  //   encoding: "utf-8",
  //   success: function (res) {
  //     // console.log(res)
  //     // var content = res.data.replace(/^[\u4E00-\u9FA5]/g, "");
  //     var temp = res.data.split(/[\n]/);
  //     temp.forEach(function (word, i) {
  //       //判断内容中是否包括敏感词
  //       word = word.slice(0, -1)
  //       reg = new RegExp(word, "g");
  //       if (text.indexOf(word) != -1) {
  //         text = text.replace(reg, "*");
  //         result = true
  //         return;
  //       }
  //     })
  //     resolve(result)
  //     // resolve(text)
  //   },
  //   fail: function (res) {
  //     console.log(res.errMsg);
  //   }
  // });
}