// pages/mine_vip_rule/mine_vip_rule.js
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 0, //类型 0 为默认,会员规则  1为积分规则
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      type: options.type ? options.type:0
    })
  },
  // 点击头部切换
  clickHeaderTap(e) {
    // console.log(e)
    let type;
    if (e.type === "tap") {
      type = e.currentTarget.dataset.type;
    } else if (e.type ==="change"){
      type = e.detail.current;
    }
    this.setData({
      type
    })
  },
  preview(e){
    // console.log(e)
    let url = e.currentTarget.dataset.url;
    // util.previewImage([url])
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