// pages/mine_collect/mine_collect.js
const app = getApp();
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    polarisItemInfo: [],
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的
    page: 1,
    loadComplete: true,
    showToTop: false //显示置顶
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // 消息列表
    if (this.data.userInfo !== null) {
      this.refreshFirst()
    }
  },
  //首次数据加载
  refreshFirst() {
    this.setData({
      polarisItemInfo: [],
      showOp: false,
      page: 1,
      loadComplete: false
    })
    this.requestData()
  },
  //请求列表数据
  requestData() {
    let me = this
    request({
      url: API.getFavoriteNews,
      data: {
        uid: me.data.userInfo.openid,
        page: me.data.page
      },
      start() {
        if (me.data.page === 1) {
          util.showBusy("玩命加载中..")
        }
      },
      success(res) {
        if (me.data.page === 1) {
          me.data.polarisItemInfo = res.data
        } else {
          me.data.polarisItemInfo = me.data.polarisItemInfo.concat(res.data)
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
          polarisItemInfo: me.data.polarisItemInfo,
          page: me.data.page
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 打开或关闭操作窗
  openOp(e) {
    console.log(e)
    const data = e.detail.open;
    let item = this.data.currentOpItem;
    if (data) {
      item = e.detail.item;
    }

    this.setData({
      showOp: data,
      currentOpItem: item !== undefined ? item : {}
    })
  },
  //滑动监听
  onPageScroll: function(e) {
    const {
      scrollTop
    } = e
    this.setData({
      showToTop: scrollTop > 1000
    })
  },
  //置顶
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
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
    this.refreshFirst()
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