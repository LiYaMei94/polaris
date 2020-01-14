const util = require("../../../utils/util.js")
import API from "../../../common/API.js"
import request from "../../../common/HttpService.js"
const app = getApp();
var upload = require('../../../common/cos-upload');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskID:0,
    taskDetailInfo:{},
    uploadImgArr: [],
    showuploadImgArr: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.taskID){
      this.setData({
        taskID: options.taskID
      })
      this.getDetailInfo(this.data.taskID)
    }
  },
  // 详情信息
  getDetailInfo(id){
    var that = this;
    request({
      url: API.taskInfo,
      data:{
        id:id
      },
      success: function (res) {
        // console.log(res)
        res.finshed = false;
        if (res.finish == res.times) {
          res.finshed = true;
        }
        that.setData({
          taskDetailInfo: res
        })
        // console.log(that.data.taskDetailInfo)
      }
    })
  },
  // 详情按钮操作
  taskTypeClick(e) {
    var that=this;
    var taskType = e.currentTarget.dataset.tasktype;
    var finshed = e.currentTarget.dataset.finshed;
    var uploadImgArr = that.data.uploadImgArr;
    var showuploadImgArr = that.data.showuploadImgArr;
    var pages=getCurrentPages();
    var lastPage = pages[pages.length-2];
    lastPage.doTask(taskType, that.data.taskID, finshed, '../../home/home')
  },
  // 返回列表
  gomakeReinforce(e){
    wx.navigateBack({
      
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