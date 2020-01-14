// pages/StartPage/StartPage.js
var timer;
var qcloud = require('../../vendor/wafer2-client-sdk/index')
const util = require("../../utils/util.js")
const app=getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countdown:5,
    bgStatusText: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.countTime()
    if (app.globalData.systemInfo.model == "iPhone X"){
      this.setData({
        bgStatusText:true
      })
    }
  },
  // 倒计时
  countTime() {
    var that = this;
    var count = 5;
    // timer = setInterval(function () {
    //   count = count - 1;
    //   if (that.data.countdown == 0) {
    //     //跳转
    //     clearInterval(timer)
    //     wx.switchTab({
    //       url: '../home/home',
    //     })
    //   } else {
    //     that.setData({
    //       countdown: count
    //     })
    //   }
    // }, 1000)
    setTimeout(function(){
      wx.switchTab({
        url: '../home/home',
      })
    },3000)

  },
  // 跳转到首页
  goHomePage(e){
    // clearInterval(timer)
    wx.switchTab({
      url: '../home/home',
    })
  },
  bindGetUserInfo_game: function () {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          this.getUserInfo("game");
        } else {
          util.showModel("错误", "请授权后使用")
        }
      }
    })
  },
  getUserInfo: function (flag) {
    const session = qcloud.Session.get()
    if (session) {
      //本地已有登录状态
      qcloud.loginWithCode({
        success: res => {
          console.log(res)
          this.setData({
            userInfo: res,
            hasUserInfo: true
          })
        },
        fail: err => {
          console.error(err)
          util.showModel('登录错误', err.message)
        }
      })
    } else {
      util.showBusy("正在登录..")
      
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})