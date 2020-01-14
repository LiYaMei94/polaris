//app.js
/**
 * appid：wx246582fd9f8dd724
 * appSecret：31c55a92348cfd4f1fe11a3795e0c5c5
 */
var qcloud = require('./vendor/wafer2-client-sdk/index');
const util = require("./utils/util.js");
import API from "./common/API.js";
import request from "./common/HttpService.js";

App({
  onLaunch: function() {
    // 获取设备信息
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        // console.log(res)
        that.globalData.systemInfo = res
      },
    })

    qcloud.setLoginUrl(API.login)
    this.globalData.userInfo = wx.getStorageSync('userInfo') || null;
    that.getaccess_token()
    // 设置默认地址
    that.getAddress()
  },
  // 获取access_token
  getaccess_token() {
    var that = this;
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=' + that.globalData.appid + '&secret=' + that.globalData.appSecret,
      success(res) {
        // console.log(res)
        that.globalData.access_token = res.data.access_token;
      }
    })
  },
  // 登录
  login(callback) {
    const me = this;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 首次登录
          const session = qcloud.Session.get()

          if (session) {
            request({
              url: API.mine,
              start() {

              },
              success(res) {
                wx.setStorageSync('userInfo', res)
                me.globalData.userInfo = res
                if (util.isFunction(callback.success)) {
                  callback.success(me.globalData.userInfo)
                }
              }
            })
          } else {
            util.showBusy()
            // 首次登录
            qcloud.login({
              success: res => {
                me.globalData.userInfo = res
                wx.setStorageSync("userInfo", me.globalData.userInfo)
                wx.hideToast()
                if (util.isFunction(callback.success)) {
                  callback.success(me.globalData.userInfo)
                }
              },
              fail: err => {
                console.error(err)
                util.showModel('登录错误', err.message)
                if (util.isFunction(callback.fail)) {
                  callback.fail()
                }
              }
            })
          }
        } else {
          util.showModel("提示", "请授权后使用")
        }
      }
    })
  },
  // 轮播图
  getSwiper() {
    var that = this;
    request({
      url: API.banner,
      start() {

      },
      success: function(res) {
        for (let i in res) {
          if (res[i].position == 1) { //1为活动
            res[i].navigateurl = "../activity_detail/activity_detail?id=" + res[i].jump_id
          }
        }
        that.globalData.swiperInfo.swiperimgUrls = res;
        // 获取页面 刷新数据
        const pages = getCurrentPages();
        for (let i in pages) {
          if (pages[i].route === "pages/home/home") {
            let swipe_copy = util.copy(that.globalData.swiperInfo)
            swipe_copy.swiperimgUrls.unshift({
              image: "https://polaris-1257165361.cos.ap-guangzhou.myqcloud.com/static/images/homeImg%5C1_03.png",
              position: 1,
              navigateurl: "../polarisIntroduction/polarisIntroduction"
            })
            pages[i].setData({
              swiperInfo: swipe_copy
            })

          } else if (pages[i].route === "pages/fanscircle/fanscircle" || pages[i].route === "pages/tripDetail/tripDetail") {
            pages[i].setData({
              swiperInfo: that.globalData.swiperInfo
            })
          }
        }
      },
      fail: function() {
        console.log("失败")
        util.showModel("错误", "加载失败，请稍后重试~")
      },
      complete: function() {
        wx.hideToast()
      }
    })
  },
  //刷新我的数据
  refreshMine() {
    let me = this

    request({
      url: API.mine,
      start() {

      },
      success(res) {
        console.log(res)
        wx.setStorageSync('userInfo', res)
        me.globalData.userInfo = res

        const pages = getCurrentPages();
        // console.log(pages.length)
        for (let i in pages) {
          if (pages[i].route === "pages/home/home" ||
            pages[i].route === "pages/mine/mine" ||
            pages[i].route === "pages/mine_personal_info/mine_personal_info") {
            pages[i].setData({
              userInfo: me.globalData.userInfo
            })
          } else if (pages[i].route === "pages/mine_home/mine_home") {
            if (pages[i].data.userInfo.openid === me.globalData.userInfo.openid) {
              pages[i].setData({
                userInfo: me.globalData.userInfo
              })
            }
          }
        }
      }
    })
  },
  //重置数据
  reset: function() {
    this.globalData.userInfo = null;
  },
  // 管方消息列表
  getOfficialNews(url, page) {
    var that = this;
    request({
      url: url,
      data: {
        "page": page
      },
      start() {},
      success: function(res) {
        // 获取页面 刷新数据
        const pages = getCurrentPages();
        // console.log(pages)
        for (let i in pages) {
          if (pages[i].route === "pages/mine/mine") {
            pages[i].setData({
              polarisItemInfo: res.data
            })
          }
        }
      }
    })
  },
  // 设置地址全局
  getAddress() {
    const that = this;
    request({
      url: API.addressList,
      data: {
        page: 1
      },
      start() {},
      success(res) {
        if(res.data.length!=0){
          res.data[0].detail = res.data[0].province + res.data[0].city + res.data[0].region + res.data[0].detail;
          wx.setStorageSync('default_address', res.data[0])
        }else{
          wx.setStorageSync('default_address', {})
        }
        
      }
    })
  },
  globalData: {
    appid: 'wx246582fd9f8dd724',
    appSecret: '31c55a92348cfd4f1fe11a3795e0c5c5',
    access_token: '',
    systemInfo: {},
    userInfo: null,
    swiperInfo: {
      indicatorDots: true,
      autoplay: true,
      interval: 5000,
      duration: 1000,
      circular: true,
      indicatorColor: '#fff',
      indicatorActiveColor: '#57D78C',
    }
  }
})