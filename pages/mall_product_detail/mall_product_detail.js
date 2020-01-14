const app = getApp();
const util = require("../../utils/util.js");
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    productDetail:{},
    product_id:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // if (options.id){
    //   this.setData({
    //     product_id: options.id
    //   })
    //   this.getProductDetail(this.data.product_id)
    // }
    this.getProductDetail(this.data.product_id)
  },
  getProductDetail(id) {
    // 兑换方式[1:积分 2:金币 3:均可]
    const that=this;
    request({
      url: API.goodsInfo,
      data:{
        id:id
      },
      start(){
        util.showBusy("加载中..")
      },
      success(res){
        console.log(res)
        res.count=1
        that.setData({
          productDetail:res
        })
      }
    })
  },
  // 切换兑换方式
  exchange_methods(e){
    const value=e.detail.value;
    if (value =='虚拟币'){
      this.data.productDetail.way=2;
    }else{
      this.data.productDetail.way = 1;
    }
    this.setData({
      productDetail: this.data.productDetail
    })
    console.log(value)
  },
  // 兑换
  exchange(e){
    wx.navigateTo({
      url: '../mall_submit_order/mall_submit_order?productDetail=' + JSON.stringify(this.data.productDetail),
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
  onShareAppMessage: function (res) {
    // console.log(res)还要传入商品的id
    if (res.from === 'button') { // 来自页面内转发按钮      
      console.log(res.target)
    }
    return {
      title: res.target.dataset.product_name,
      path: 'pages/mall_product_detail/mall_product_detail' 
    }
  }
})