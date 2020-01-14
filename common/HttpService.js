import {
  HEADER
} from '../common/API'
import API from '../common/API'
const util = require("../utils/util.js")
var qcloud = require('../vendor/wafer2-client-sdk/index')
// import wxPromise from "../utils/wxPromise.min.js"

const request = function(options) {
  return new Promise((resolve, reject) => {
    if (util.type(options) === 'string') {
      options = {
        url: options
      }
    }
    const {
      url,
      data,
      start,
      success,
      fail,
      complete,
      header,
    } = options

    const session = qcloud.Session.get() || null;
    // 如果传入的原始配置没有header，则用默认的替代
    if (!header) {
      options.header = HEADER
    } else {
      options.header = util.extend(options.header, HEADER)
    }
    if (session) {
      options.header = util.extend(options.header, {
        "x-wx-skey": session.skey,
      })
    }

    if (session) {
      if (!data) {
        options.data = {
          openid: session.userinfo.openid
        }
      } else {
        util.extend(options.data, {
          openid: session.userinfo.openid
        })
      }
    }

    try {
      options = util.extend(options, {
        method: "POST",
        success(res) {
          const {
            errMsg,
            statusCode
          } = res
          // console.log(url + "返回的数据：")
          // console.log(res)
          if (errMsg && statusCode) {
            // 由于返回的statusCode是字符串'200'，故用 ==
            if (errMsg === 'request:ok' && statusCode == 200) {
              const {
                code,
                data,
                msg
              } = res.data;
              // 服务器上传
              if (msg) {
                if (code === 0) {
                  resolve(res.data.data)
                  wx.hideToast()
                  if (util.isFunction(success)) {
                    success(res.data.data)
                  } else {

                  }
                } else {
                  // console.log(res)
                  if (code === -1 || code === -4) {
                    //需要重新登录 或用户不存在
                    wx.clearStorage()
                    getApp().reset()
                    wx.reLaunch({
                      url: '/pages/mine/mine',
                    })
                    util.showModel("提示", "未登录或登录失效，请重新登录", function(res) {
                      if (res.confirm) {

                      }
                    })
                  } else {
                    reject(res.data)
                    if (util.isFunction(fail)) {
                      fail(res.data)
                    } else {
                      util.showFail(res.data.msg)
                    }
                  }
                }
              } else {
                //文件上传鉴权接口
                resolve(res.data)
                if (util.isFunction(success)) {
                  success(res.data)
                } else {

                }
              }
            } else {
              reject(res)
              util.showFail(res.statusCode + " " + res.errMsg)
            }
          } else {
            reject(res)
            util.showFail(JSON.stringify(res))
          }
        },
        fail(res) {
          reject(res)
          util.showFail(JSON.stringify(res))
        },
        complete(res) {
          if (util.isFunction(complete)) {
            complete(res)
          }
        }
      })
      if (util.isFunction(start)) {
        start()
      } else {
        util.showBusy("玩命加载中..")
      }
      wx.request(options)
    } catch (e) {
      reject(e)
      util.showFail(JSON.stringify(e))
    }
  })
}

export default request