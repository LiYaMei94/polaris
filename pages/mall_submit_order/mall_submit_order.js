const app = getApp();
const util = require("../../utils/util.js");
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_exchange:false,//是否出现兑换框
    count: 1,
    is_minu_disable: false,//减号是否可以点击
    is_coin_lock:false,//金币不足弹窗是否出现
    is_exchange_success:false,//兑换成功金币
    productDetail:{},
    coin:0,//每一件商品的虚拟币单价
    credit: 0,//每一件商品的积分单价
    userInfo:{},
    coin_lock_info:{},//传递给钱不足模板的数据
    default_address:{},//默认地址
    is_default_address:true,//是否有默认地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.productDetail){
      let is_minu_disable=false;
      if (JSON.parse(options.productDetail).count > 1) {
        is_minu_disable=true
      } else {
        is_minu_disable=false
      }
      this.setData({
        productDetail: JSON.parse(options.productDetail),
        coin: JSON.parse(options.productDetail).coin,
        credit: JSON.parse(options.productDetail).credit,
        is_minu_disable: is_minu_disable,
        userInfo: app.globalData.userInfo
      })
      console.log(this.data.productDetail)
    }
  },
  // 数量改变
  countChange(e) {
    // console.log(e.detail.count)
    let productDetail = this.data.productDetail;
    productDetail.count = e.detail.count;
    productDetail.coin = e.detail.count * this.data.coin;
    productDetail.credit = e.detail.count * this.data.credit;
    this.setData({
      productDetail: productDetail,
      is_minu_disable: e.detail.is_minu_disable
    })
  },
  // 地址
  address(e){
    let url ='../mall_address_list/mall_address_list';
    const that=this;
    if (JSON.stringify(that.data.default_address) == "{}"){
      url ='../mall_address_edit/mall_address_edit'
    }
    wx.navigateTo({
      url: url,
    })
  },
  // 兑换按钮
  eachange(e){
    const that=this;
    const userInfo=that.data.userInfo;
    let is_exchange=false;
    let is_coin_lock=false;
    console.log(userInfo)
    if (that.data.productDetail.way==1){
      // 积分
      if (userInfo.credit < that.data.productDetail.credit){
        is_exchange=true
      }else{
        is_coin_lock=true
      }
    } else if (that.data.productDetail.way == 2){
      // 虚拟币
      if (userInfo.coin < that.data.productDetail.coin) {
        is_exchange = true
      } else {
        is_coin_lock=true
      }
    }
      that.setData({
        is_exchange: is_exchange,
        is_coin_lock: is_coin_lock,
        coin_lock_info:{
          way: that.data.productDetail.way,
          credit:userInfo.credit,
          coin:userInfo.coin
        },

      })
  },
  
  // 关闭弹窗
  hiddendialog(e){
    const that=this;
    // 兑换弹窗关闭
    if (!e.detail.status){
      if (e.detail.status != "cancel"){
        // 确定
        request({
          url: API.order,
          data: {
            gid: that.data.productDetail.id,
            count: that.data.productDetail.count,
            way: that.data.productDetail.way,
            address: that.data.default_address.id
          },
          start() {
            util.showBusy("加载中..")
          },
          success(res) {
            console.log(res)
          }
        })
      }
    }
    this.setData({
      is_coin_lock: false,
      is_exchange_success: false,
      is_exchange: false
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
    const default_address = wx.getStorageSync('default_address');
    let is_default_address=true;
    if (JSON.stringify(default_address) == "{}"){
      is_default_address=false
    }else{
      is_default_address=true
    }
    this.setData({
      default_address: default_address,
      is_default_address: is_default_address
    })
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