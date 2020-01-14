const app = getApp();
const util = require("../../../utils/util.js")
import API from "../../../common/API.js"
import request from "../../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tripID:0,
    tripDetailInfo:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.tripID){
      this.setData({
        tripID: options.tripID
      })
    }
    this.getTripDetailInfo()
  },
  getTripDetailInfo(){
    var that=this;
    request({
      url: API.scheduleInfo,
      data:{
        id:that.data.tripID
      },
      start(){},
      success(res){
        // console.log(res)
        that.setData({
          tripDetailInfo:res
        })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})