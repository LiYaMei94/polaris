const app = getApp();
const util = require("../../utils/util.js");
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:[],
    page:1,
    loadComplete: true,
    default_address:{}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddress()
  },
  // 地址列表
  getAddress() {
    const that=this;
    request({
      url: API.addressList,
      data:{
        page:that.data.page
      },
      start(){
        util.showBusy("加载中..")
      },
      success(res){
        console.log(res)
        if (res.data.length!=0){
          res.data.forEach(function (list, i) {
            list.detail = list.province + list.city + list.region + list.detail;
            if (list.id == that.data.default_address.id) {
              list.checked = true;
            } else {
              list.checked = false;
            }
          })
          if (that.data.page === 1) {
            that.data.address = res.data
          } else {
            that.data.address = that.data.address.concat(res.data)
          }
          if (res.data.length < 10) {
            that.data.loadComplete = true
            that.setData({
              loadComplete: that.data.loadComplete
            })
          } else {
            that.data.page++
          }
        }else{
          that.data.address=[];
          wx.setStorageSync('default_address', {})
        }
        that.setData({
          address: that.data.address,
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
    this.setData({
      default_address: wx.getStorageSync('default_address')
    })
    // console.log(this.data.default_address)
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
      that.getAddress()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})