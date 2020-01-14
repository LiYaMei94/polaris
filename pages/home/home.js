// pages/home/home.js
const util = require("../../utils/util.js")
import API from "../../common/API.js"
import request from "../../common/HttpService.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    swiperInfo: {},
    polarisItemInfo: [],
    signInSuccessfully: false, //签到成功
    countdown: 5,
    showOp: false, //是否显示操作,
    currentOpItem: {}, //当前弹窗的操作的
    page: 1,
    taskID: 1,
    loadComplete: true,
    signCredit: 0,
    showToTop: false, //显示置顶
    addFansShow:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    if (options.taskID) {
      this.setData({
        taskID: options.taskID
      })
      // console.log(this.data.taskID)
    }
    // 消息列表
    this.refreshFirst();
    this.setData({
      userInfo: app.globalData.userInfo
    })
    // 轮播图
    app.getSwiper()
    if (app.globalData.userInfo != null) {
      app.refreshMine()
    }

  },
  //首次请求数据
  refreshFirst() {
    this.setData({
      polarisItemInfo: [],
      showOp: false,
      page: 1,
      loadComplete: false,
    })
    this.getOfficialNews()
  },
  // 管方消息列表
  getOfficialNews() {
    var me = this;
    request({
      url: API.officialNews,
      data: {
        "page": me.data.page
      },
      start() {
        if (me.data.page === 1) {
          util.showBusy("玩命加载中..")
        }
      },
      success: function(res) {
        if (me.data.page === 1) {
          me.data.polarisItemInfo = res.data
        } else {
          me.data.polarisItemInfo = me.data.polarisItemInfo.concat(res.data)
        }
        if (res.data.length < 10) {
          me.data.loadComplete = true
          me.setData({
            loadComplete: me.data.loadComplete
          })
        } else {
          me.data.page++
        }

        me.setData({
          polarisItemInfo: me.data.polarisItemInfo,
          page: me.data.page,
        })
      },
      complete() {
        wx.stopPullDownRefresh()
      }
    })
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
  // 签到
  signIn(e) {
    var that = this;
    if (that.data.userInfo.is_sign==1){
      // wx.showToast({
      //   title: '今日已签到',
      //   duration:800,
      //   icon:'none'
      // })
    }else{
      request({
        url: API.finishTask,
        data: {
          "id": that.data.taskID
        },
        success: function (res) {
          // console.log(res)
          that.data.userInfo.credit = res.credit
          that.data.userInfo.is_sign = true
          wx.setStorageSync("userInfo", that.data.userInfo)
          app.refreshMine();
          that.setData({
            signInSuccessfully: true,
            signCredit: res.reward,
            userInfo: that.data.userInfo
          })
        }
      })
    }
    
  },

  // 签到成功框隐藏
  hiddensignInDialog(e) {
    this.setData({
      signInSuccessfully: false
    })
  },
  // 加入粉丝群弹窗
  AddFans(e){
    this.setData({
      addFansShow:true
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
    this.setData({
      userInfo: app.globalData.userInfo
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
    let me = this
    if (!me.data.loadComplete) {
      me.getOfficialNews()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    console.log(res)
    if (res.from === 'button') { // 来自页面内转发按钮      
      console.log(res.target)
    }
    return {
      title: res.target.dataset.contenttext,
      path: 'pages/contentDetial/contentDetial?contetnIndex=' + res.target.dataset.polarisindex
    }
  }
})