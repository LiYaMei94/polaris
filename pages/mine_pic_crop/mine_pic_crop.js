// pages/mine_pic_crop/mine_pic_crop.js
import WeCropper from '../template/we-cropper/we-cropper.js'
import API from "../../common/API.js"

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 50
const util = require("../../utils/util.js")


Page({

  /**
   * 页面的初始数据
   */
  data: {
    cropperOpt: {
      id: 'cropper',
      width,
      height,
      scale: 2.5,
      zoom: 8,
      cut: {
        x: (width - 300) / 2,
        y: (height - 300) / 2,
        width: 300,
        height: 300
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const {
      cropperOpt
    } = this.data

    new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`before picture loaded, i can do something`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
      .on('beforeDraw', (ctx, instance) => {
        console.log(`before canvas draw,i can do something`)
        console.log(`current canvas context:`, ctx)
      })
      .updateCanvas()

    const src = options.path
    console.log(src)
    //  获取裁剪图片资源后，给data添加src属性及其值

    this.wecropper.pushOrign(src)
  },
  touchStart(e) {
    this.wecropper.touchStart(e)
  },
  touchMove(e) {
    this.wecropper.touchMove(e)
  },
  touchEnd(e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage() {
    let me = this
    this.wecropper.getCropperImage((src) => {
      // if (src) {
      //   console.log(src)
      //   wx.previewImage({
      //     current: '', // 当前显示图片的http链接
      //     urls: [src] // 需要预览的图片http链接列表
      //   })
      // } else {
      //   console.log('获取图片地址失败，请稍后重试')
      // }
      if (src) {
        console.log(src)
            const pages = getCurrentPages();
            pages[pages.length - 2].data.userInfo.avatar = src
            pages[pages.length - 2].setData({
              userInfo: pages[pages.length - 2].data.userInfo
              // userInfo: pages[pages.length - 2].data.userInfo
            })

            wx.navigateBack({

            })
        
      } else {
        util.showFail("裁剪失败")
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