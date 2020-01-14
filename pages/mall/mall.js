
import API from "../../common/API.js";
import request from "../../common/HttpService.js";
const app = getApp();
const util = require("../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    product:[],
    page:1,
    loadComplete: true,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getProduct();
    // .credit
    console.log(app.globalData.userInfo.coin)
  },
  getProduct(){
    const that=this;
    request({
      url: API.goodsList,
      data:{
        page: that.data.page
      },
      start(){
        util.showBusy("加载中..")
      },
      success(res){
        console.log(res)
        if (that.data.page === 1) {
          that.data.product = res.data
        } else {
          that.data.product = that.data.product.concat(res.data)
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
          product: that.data.product,
          page: that.data.page,
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
      that.getProduct()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})