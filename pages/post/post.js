const util = require("../../utils/util.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentYear: util.formatTime(new Date()).slice(0, 4),
    isnavgate:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  // 长按复制邮箱地址
  copyEmail(e){
    var that = this;
    wx.setClipboardData({
      data: e.currentTarget.dataset.email,
      success(res) {
        
      },
      complete(){
        wx.showToast({
          title: '复制成功',
          icon: 'none',
          duration: 800,
        })
        setTimeout(function () {
          that.setData({
            addFansShow: false
          })
        }, 800)
      }
    })
  },
  // 判断是否登录、
  islogin(e){
    var editType = e.currentTarget.dataset.edittype
    if (app.globalData.userInfo==null){
      wx.showModal({
        title: '提示',
        content: '未登录或登录失效，请重新登录',
        complete(res){
          console.log(res)
          if (res.confirm){
            wx.switchTab({
              url: '../mine/mine',
            })
          }
        }
      })
    }else{
      wx.navigateTo({
        url: '../postEdit/postEdit?editType=' + editType,
      })
    }
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