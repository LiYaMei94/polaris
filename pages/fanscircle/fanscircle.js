// pages/fanscircle/fanscircle.js
const util = require("../../utils/util.js")
const app = getApp()
import request from "../../common/HttpService.js"
import API from "../../common/API.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperInfo: [],
    currentIndex: 0, //当前显示的第几页
    polarisItemInfo: [
      [],
      []
    ],
    swiperHeights: [], //swiper每列的高度,
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的
    page: [1, 1],
    loadComplete: [true, true], //是否不再加载下一页
    showToTop: false, //显示置顶
    addFansShow: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      swiperInfo: app.globalData.swiperInfo
    })
    // 消息列表
    
    this.refreshFirst()
  },
  //首次进入
  refreshFirst() {
    this.setData({
      polarisItemInfo: [
        [],
        []
      ],
      page: [1, 1],
      loadComplete: [false, false],
      showOp: false
    })
    this.requestData(0)
    this.requestData(1)

  },

  //获取数据
  requestData(index) {
    let me = this
    request({
      url: API.personalNews,
      data: {
        essence: index,
        page: me.data.page[index]
      },
      start() {
        if (me.data.page[index] === 1) {
          util.showBusy("玩命加载中..")
        }
      },
      success(res) {
        //加载完成

        if (me.data.page[index] === 1) {
          me.data.polarisItemInfo[index] = res.data
        } else {
          me.data.polarisItemInfo[index] = me.data.polarisItemInfo[index].concat(res.data)
        }
        if (res.data.length < 10) {
          me.data.loadComplete[index] = true
          me.setData({
            loadComplete: me.data.loadComplete
          })
        } else {
          me.data.page[index]++
        }

        me.setData({
          polarisItemInfo: me.data.polarisItemInfo,
          page: me.data.page
        })
        me.onShow()
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
  },
  // 更新列表
  updatelist(polarisItem) {
    var polarisItemInfo = this.data.polarisItemInfo;
    var that = this;
    console.log(polarisItem)
    polarisItemInfo[that.data.currentIndex].forEach(function(item, i) {
      if (item.id == polarisItem.detail.id) {
        polarisItemInfo[that.data.currentIndex][i] = polarisItem.detail
      }
    })
    that.setData({
      polarisItemInfo: polarisItemInfo
    })
    // console.log(that.data.polarisItemInfo)
  },

  // 页面滑动关闭视频播放
  onPageScroll: function(e) {
    const {
      scrollTop
    } = e
    this.setData({
      showToTop: scrollTop > 1000
    })
  },
  //置顶
  toTop() {
    wx.pageScrollTo({
      scrollTop: 0,
    })
  },
  // 界面切换
  switchPage(e) {
    // console.log(e)
    let index = this.data.currentIndex;
    if (e.type === "tap") {
      index = e.currentTarget.dataset.index;
    } else if (e.type === "change") {
      index = e.detail.current;
    }
    if (this.data.currentIndex === index) return;
    this.setData({
      currentIndex: index
    })
  },
  // 打开或关闭操作窗
  openOp(e) {
    // console.log(e)
    const data = e.detail.open;
    let item = this.data.currentOpItem;
    if (data) {
      item = e.detail.item;
    }

    this.setData({
      showOp: data,
      currentOpItem: item !== undefined ? item : {}
    })
  },
  // 加入粉丝群弹窗
  AddFans(e) {
    this.setData({
      addFansShow: true
    })
    console.log(this.data.addFansShow)
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
    let me = this;
    me.setData({
      swiperInfo: app.globalData.swiperInfo
    })
    let swiperHeights = []
    //swiperHeights  .fans_column_item
    util.get_wxml(`.polaris-list`, (rects) => {
      for (let i = 0; i < rects.length; i++) {
        swiperHeights.push(rects[i].height)
      }
      me.setData({
        swiperHeights: swiperHeights
      })
      // 就是循环相加每个列表的高度，然后赋值给swiper_height,便可以求出当前tab栏的高度，赋值给swiper 便可以swiper高度自适应
    })


  },
  
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // this.addplayer()
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.refreshFirst()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    // console.log("触底")
    let me = this
    if (!me.data.loadComplete[me.data.currentIndex]) {
      me.requestData(me.data.currentIndex)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})