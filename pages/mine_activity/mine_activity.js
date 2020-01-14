// pages/mine_activity/mine_activity.js
const app = getApp();
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activities: [],
    page: 1,
    loadComplete: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (app.globalData.userInfo !== null) {
      this.refreshFirst()
    }
  },
  refreshFirst() {
    this.setData({
      activities: [],
      page: 1,
      loadComplete: false
    })
    this.requestData()
  },
  requestData() {
    if (app.globalData.userInfo == null) {
      return
    }
    let me = this
    request({
      url: API.message,
      data: {
        page: me.data.page
      },
      start() {
        if (me.data.page === 1) {
          util.showBusy("玩命加载中..")
        }
      },
      success(res) {

        if (me.data.page === 1) {
          me.data.activities = res.data
        } else {
          me.data.activities = me.data.activities.concat(res.data)
        }
        if (res.data.length < 10) {
          me.data.loadComplete = true
          me.setData({
            loadComplete: me.data.loadComplete
          })
        } else {
          me.data.page++
        }

        me.setData({
          activities: me.data.activities,
          page: me.data.page
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    if (app.globalData.userInfo !== null) {
      this.refreshFirst()
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    let me = this
    if (!me.data.loadComplete) {
      me.requestData()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})