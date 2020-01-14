
const util =require('../../utils/util.js');
const SensitiveWords=require('../../utils/SensitiveWords.js');
var upload = require('../../common/cos-upload');
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    editType:2,//图片，视频，文字
    content:'',//内容
    valueLength: 0,//输入的字数
    canvasMarginRight:10,
    uploadImgArr:[],//上传图片数组
    uploadVideoArr:'',//上传视频数组
    showuploadImgArr: [],//展示图片数组
    showVideoDialog: false, //是否弹窗播放
    issueClickCan:true,//发按钮是否可以点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.editType){
      this.setData({
        editType: options.editType
      })
    }
    
  },
  // textare字数计算
  textareInput(e){
    var value=e.detail.value;
    var valueLength=parseInt(value.length);
    this.setData({
      valueLength:valueLength,
      content:value
    })
  },
  // 上传文件请求
  uploadRequest(filepath, editType,dir){
    // console.log(dir)
    var that = this;
    let promiseList = filepath.map((item) => {
      return new Promise((resolve, reject) => {
        upload({
          dir: dir,
          filepath: item,
          success(res) {
            resolve(res)
          },
          fail(res) {
            reject(res)
          }
        })
      });
    });
    // 使用Primise.all来执行promiseList
    const result = Promise.all(promiseList).then((res) => {
      console.log(res)
      if (this.data.editType == 1){
        res.forEach(function (img, i) {
          that.data.uploadImgArr.push(img.data)
        })
        that.setData({
          uploadImgArr: that.data.uploadImgArr,
          canvasMarginRight: 10
        })
        that.issueReuqest(that.data.editType, that.data.content, that.data.uploadImgArr, '')
      } else if (this.data.editType == 2){
        that.setData({
          uploadVideoArr: [res[0].data]
        })
        that.issueReuqest(that.data.editType, that.data.content, that.data.uploadVideoArr, '')
      }
    }).catch((error) => {
      console.log(error);
    });
  },
  // 选择文件
  uploadFile(e){
    const that = this;
    var showuploadImgArr = that.data.showuploadImgArr;//展示图片数组
    if (this.data.editType != 3){
      // 图片
      if (this.data.editType ==1){
        if (showuploadImgArr.length<3){
          wx.chooseImage({
            count: 3,
            sizeType: ['original', 'compressed'],
            success: function (res) {
              // console.log(res)
              res.tempFiles.forEach(function (img, i) {
                // console.log(img.size)
                if (res.tempFiles[i].size <= 5 * 1024 * 1024) {
                  showuploadImgArr.push(res.tempFilePaths[i])
                } else {
                  wx.showToast({
                    title: '只能上传5M以内的图片',
                    icon: 'none',
                    duration: 1500,
                  })
                }
                that.setData({
                  showuploadImgArr: showuploadImgArr
                })
                // console.log(that.data.showUploadImgArr)
              })
            },
            fail(error){
              wx.showToast({
                title: '图片选择失败，请重新选择',
                icon: 'none',
                duration: 1500
              })
            }
          })
        }else{
          wx.showToast({
            title: '最多只能上传3张',
            icon:'none',
            duration: 1500
          })
        }
      }else{
        // 视频
        // console.log(that.data.uploadVideoArr)
        if (that.data.uploadVideoArr==''){
          wx.chooseVideo({
            count: 1,
            sizeType: ['original', 'compressed'],
            success: function (res) {
              // console.log(res)
              if (res.tempFilePath){
                if (res.size < 5 * 1024 * 1024){
                  that.setData({
                    uploadVideoArr: res.tempFilePath
                  })
                }else{
                  wx.showToast({
                    title: '只能上传5M以内的视频',
                    icon: 'none',
                    duration: 1500,
                  })
                }
                // console.log(that.data.uploadVideoArr)
              }else{

              }
              
            },
            fail(error){
              console.log(error)
              wx.showToast({
                title: '视频选择失败，请重新选择',
                icon:'none',
                duration: 1500
              })
            }
          })
        }else{
          wx.showToast({
            title: '只能上传1个视频',
            icon: 'none',
            duration: 1500
          })
        }
      }
    }else{
      // 文字
    }
  },
  // 删除图片
  deleteImg(e){
    var imgindex = e.currentTarget.dataset.imgindex;
    var showuploadImgArr = this.data.showuploadImgArr;
    if (this.data.editType == 1){
      showuploadImgArr.splice(imgindex, 1)
      this.setData({
        showuploadImgArr: showuploadImgArr
      })
    } else if (this.data.editType == 2){
      this.setData({
        uploadVideoArr:''
      })
    }
  },
  // 发布请求
  issueReuqest(editType, content, url, video_img){
    // console.log(editType)
    // console.log(content)
    // console.log(url)
    // console.log(video_img)
    request({
      url: API.submitNews,
      data: {
        "type": editType,
        "content": content,
        "url": url,
        "video_img": video_img
      },
      start() { },
      success: function (res) {
        // wx.hideLoading()
        wx.showModal({
          title: '温馨提示',
          content: '发布成功,等待审核',
          showCancel:false,
          complete:function(){
            wx.switchTab({
              url: '../fanscircle/fanscircle',
            })
          }
        })
       
      }
    })
  },
  // 发布
  issueClick: util.throttle(function (e){
    util.showBusy("发布中...")
    var that= this;
    if (that.data.issueClickCan){
      if (that.data.content) {
        // 敏感词过滤
        util.sensitiveWordsFun(that.data.content).then(res => {
          // console.log(res)
          if (res) {
            wx.showToast({
              title: '您输入的内容有敏感词，请重新输入',
              icon: 'none',
              duration: 1500
            })
          } else {
            if (that.data.editType == 3) {
              // 文字
              that.setData({
                issueClickCan: false
              })
              that.issueReuqest(that.data.editType, that.data.content, [], '')
            } else if (that.data.editType == 1) {
              // 图片
              if (that.data.showuploadImgArr.length != 0) {
                if (that.data.showuploadImgArr.length < 4) {
                  that.setData({
                    issueClickCan: false
                  })
                  that.uploadRequest(that.data.showuploadImgArr, that.data.editType, 'issueImg');
                } else {
                  wx.showToast({
                    title: '只能上传3张，您已选择' + that.data.showuploadImgArr.length + '张,删除试试吧!',
                    icon: 'none',
                    duration: 1500
                  })
                }
              } else {
                wx.showToast({
                  title: '请上传图片',
                  icon: 'none',
                  duration: 1500
                })
              }
            } else {
              // 视频
              if (that.data.uploadVideoArr) {
                that.setData({
                  issueClickCan: false
                })
                that.uploadRequest([that.data.uploadVideoArr], that.data.editType, 'issueVideo');
              } else {
                wx.showToast({
                  title: '请上传视频',
                  icon: 'none',
                  duration: 1500
                })
              }
            }
          }
        })
      } else {
        wx.showToast({
          title: '请输入内容',
          icon: 'none',
          duration: 1500
        })
      }
    }
  }),
  
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