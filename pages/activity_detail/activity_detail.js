// pages/activity_detail/activity_detail.js
const app = getApp();
const util = require("../../utils/util.js")
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getActivityInfo(options.id)
  },
  // 获取活动详情
  getActivityInfo(id) {
    const me=this
    request({
      url: API.getActivity,
      data:{
        id:id
      },
      success(res){
        me.setData({
          activity:res
        })
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})