const util = require('../../utils/util.js');
var upload = require('../../common/cos-upload');
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskListArr: [],
    taskType:'',
    userInfo: app.globalData.userInfo,
    uploadImgArr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTaskList();
    
  },
  // 任务列表
  getTaskList(){
    var that = this;
    request({
      url: API.taskList,
      success: function (res) {
        // console.log(res)
        res.forEach(function(task,i){
          task.finshed = false;
          if(task.finish==task.times){
            task.finshed = true;
          }
        })
        that.setData({
          taskListArr: res
        })
      }
    })
  },
  // 任务操作
  taskTypeClick(e){
    var that=this;
    var taskType=e.currentTarget.dataset.tasktype;
    var taskID = e.currentTarget.dataset.taskid;
    var finshed = e.currentTarget.dataset.finshed;
    console.log()
    that.doTask(taskType, taskID, finshed,'../home/home')
  },
  // 做任务
  doTask(taskType, taskID, finshed, pagepath){
    var that = this;
    var tempFilePath='';
    if (finshed) {
      // wx.showToast({
      //   title: '该任务已完成',
      //   icon: 'none',
      //   duration: 800
      // })
    } else {
      if (taskType == '签到') {
        wx.switchTab({
          url: pagepath+'?taskID=' + taskID,
        })
      } else if (taskType == '上传') {
        // 选择图片
        wx.chooseImage({
          count: 3,
          sizeType: ['original', 'compressed'],
          success: function (res) {
            console.log(res)
            tempFilePath = res.tempFilePaths;//上传的
            //图片上传
            let promiseList = res.tempFilePaths.map((item) => {
              return new Promise(resolve => {
                upload({
                  dir: 'taskImg',
                  filepath: item,
                  success(res) {
                    resolve(res)
                  }
                })
              });
            });
            // 使用Primise.all来执行promiseList
            const result = Promise.all(promiseList).then((res) => {
              that.uploadAudit(taskID, res)
            }).catch((error) => {
              console.log(error);
            });
          },
        })
      } else {
        console.log('其他操作')
      }
    }
  },
  // 上传审核
  uploadAudit(taskid,imgArr){
    var uploadImgArr=[]
    imgArr.forEach(function(img,i){
      uploadImgArr.push(img.data)
    })
    // console.log(uploadImgArr)
    var that = this;
    if(true){

    }else{
      request({
        url: API.uploadAudit,
        data: {
          taskid: taskid,
          img: uploadImgArr
        },
        success: function (res) {
          console.log(res)
          wx.showModal({
            title: '温馨提示',
            content: '发布成功,等待审核',
            showCancel: false,
          })
        },
        fail: function (res) {
          console.log(res)
          wx.hideToast();
          if (res.code == "-50007") {
            wx.showModal({
              title: '温馨提示',
              content: res.msg,
              showCancel: false
            })
          } else {
            wx.showToast({
              title: res.msg,
            })
          }
        }
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
    this.getTaskList();
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