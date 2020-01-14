const _windowWidth = wx.getSystemInfoSync().windowWidth // (px)
const _windowHeight = wx.getSystemInfoSync().windowHeight // (px)
const app = getApp();
const util = require("../../utils/util.js");
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_record: [],
    _windowWidth: _windowWidth,
    _windowHeight: _windowHeight,
    slide_width: 150,
    btnCount: 2,
    height: 150,
    page:1,
    loadComplete: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.get_order_record();
  },
  get_order_record(){
    const that=this;
    request({
      url: API.orderList,
      data:{
        page: that.data.page
      },
      start(){
        util.showBusy("加载中..")
      },
      success(res) {
        console.log(res)
        if (that.data.page === 1) {
          that.data.order_record = res.data
        } else {
          that.data.order_record = that.data.order_record.concat(res.data)
        }
        if (res.data.length < 10) {
          that.data.loadComplete = true
          that.setData({
            loadComplete: that.data.loadComplete
          })
        } else {
          that.data.page++
        }

        that.setData({
          order_record: that.data.order_record,
          page: that.data.page,
        })

      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 删除订单记录
  delete_record(e){
    // console.log(e)
    const record_id=e.currentTarget.dataset.record_id;
    const that = this;
    request({
      url: API.delOrder,
      data: {
        oid: record_id
      },
      start() {
        util.showBusy("删除中..")
      },
      success(res) {
        console.log(res)
        util.showFail("删除成功")
      }
    })
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
    let that = this
    if (!that.data.loadComplete) {
      that.get_order_record()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})