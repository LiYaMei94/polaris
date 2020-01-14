// pages/complete_personal_info/complete_personal_info.js
const app = getApp();
const util = require("../../utils/util.js")
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
var upload = require('../../common/cos-upload');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    currentDate: util.getBirthData().selectValue
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      userInfo: util.copy(app.globalData.userInfo)
    })
  },
  // 选择头像
  choosePortrait() {
    const me = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      success: function(res) {
        const tempFilePaths = res.tempFilePaths
        const tempFiles = res.tempFiles
        console.log(tempFilePaths)
        wx.navigateTo({
          url: '../mine_pic_crop/mine_pic_crop?path=' + tempFilePaths[0],
        })
      },
    })
  },
  // 选择性别
  selectSex(e) {
    // console.log(e)
    const sex = e.currentTarget.dataset.content;
    this.data.userInfo.gender = sex;
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  //日期选中
  bindDateChange(e){
    console.log(e)
    this.data.userInfo.birth=e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  //昵称输入监听
  bindinput(e){
    this.data.userInfo.nickname = e.detail.value;
    this.setData({
      userInfo: this.data.userInfo
    })
  },
  //点击完成
  complete: util.throttle(function (e) {
    console.log(e)
    const me = this;
    me.data.userInfo.nickname=e.detail.value.nickname;
    //如果头像修改  需要先上传
    if (me.data.userInfo.avatar !== app.globalData.userInfo.avatar) {
      //图片上传
      upload({
        dir: "avatar",
        filepath: me.data.userInfo.avatar,
        success(res) {
          me.data.userInfo.avatar = res.data
          me.requestComplete()
        },
        fail(res) {
          util.showFail(JSON.stringify(res))
        }
      })
    } else {
      me.requestComplete()
    }
  }),
  // 请求完成信息
  requestComplete() {
    const me = this;
    request({
      url: API.completeInfo,
      data: {
        avatar: me.data.userInfo.avatar,
        name: me.data.userInfo.nickname,
        gender: me.data.userInfo.gender,
        birth: me.data.userInfo.birth,
        sign: me.data.userInfo.signature,
        address: me.data.userInfo.address
      },
      start(){
        util.showBusy("上传中..")
      },
      success(res) {
        app.login({
          success() {
            const pages = getCurrentPages();
            pages[pages.length - 2].onShow()

            wx.navigateBack({

            })
          }
        });
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